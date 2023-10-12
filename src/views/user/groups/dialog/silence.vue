<template>
  <n-modal  v-model:show="showModal" :show-icon="false" preset="dialog" :title="`${groupName} 全体禁言设置`">
    <n-form :model="formParams" :rules="rules"  ref="formRef" :label-width="80" class="py-4" label-placement="left">
      <n-form-item label="" path="mute_all_member">
        <n-radio-group v-model:value="formParams.mute_all_member" name="radiogroup">
          <n-space>
            <n-radio v-for="silence in silenceList" :key="silence.value" :value="silence.value">
              {{ silence.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item>
      <n-grid cols="23" v-if="formParams.mute_all_member==4">
        <n-grid-item span="11">
          <n-form-item path="start" >
            <n-time-picker v-model:formatted-value="formParams.start" class="w-full" placeholder="请选择开始时间" format="HH:mm"/>
          </n-form-item>
        </n-grid-item>
        <n-grid-item >
          <n-form-item label="" >
            <span class="m-auto">~</span>
          </n-form-item>
        </n-grid-item>
        <n-grid-item span="11">
          <n-form-item label="" path="end" >
            <n-time-picker v-model:formatted-value="formParams.end" class="w-full"  placeholder="请选择结束时间" format="HH:mm"/>
          </n-form-item>
        </n-grid-item>
      </n-grid>
    </n-form>

    <template #action>
      <n-space>
        <n-button @click="() => (showModal = false)">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
      </n-space>
    </template>
  </n-modal>
 </template>
  <script lang="ts" setup >
    import {ref, reactive} from 'vue';
    import { upGroup} from '@/api/user';
    import { useMessage } from 'naive-ui';
    const emit = defineEmits(['childToParent']);
    const message = useMessage();
    const formRef: any = ref(null);
    const formBtnLoading = ref(false);
    const groupName = ref('')
    const GroupId = ref('')
    const silenceList = ref([
      {
        label: "不禁言",
        value:2
      },
      {
        label: '永久禁言',
        value: 1
      },
      {
        label: '新入群禁言',
        value: 3
      },
      {
        label: '时段禁言',
        value: 4
      },
    ])
    const formParams = reactive({
      mute_all_period: undefined,
      mute_all_member: undefined,
      start: undefined,
      end: undefined,
    });
    const rules:any = {
      start: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入开始时间',
      },
      end:{
        required: true,
        trigger: 'change',
        message: '请输入结束时间',
      },
    };
    const showModal = ref(false)

    function openModal (record){
      formParams.mute_all_period = record.mute_all_period
      formParams.mute_all_member = record.mute_all_member
      if(formParams.mute_all_member==4 && record.mute_all_period){
        let timeList = record.mute_all_period.split('-')
        formParams.start = timeList[0]
        formParams.end = timeList[1]
      }
      groupName.value = record.name
      GroupId.value = record.group_id
      showModal.value = true
    }
    defineExpose({
      openModal
    })
    function confirmForm(){
      formRef.value.validate(async (errors: boolean) => {
        if (!errors) {
          formBtnLoading.value = true
          let params:any = {
              group_id:GroupId.value,
              mute_all_member:formParams.mute_all_member
          }
          if(params.mute_all_member==4 ){
            params.mute_all_period = formParams.start + '-' + formParams.end
          }
          try {
            await upGroup(params)
            formBtnLoading.value = false
            emit('childToParent')
            showModal.value = false
            message.success('设置禁言成功')
          } catch (error:any) {
            message.error(error.message)
            formBtnLoading.value = false
          }
        }
      });
    }
    
  </script>