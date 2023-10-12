<template>
    <n-modal  v-model:show="showModal" :show-icon="false" preset="dialog" :title="`将其他群合并到 “ ${groupName} ”`">
      <div>
        请在此处填写被合并群的群号（表格首列），点击合并后，
        将会把被合并群的群成员邀请到当前群,已有的群成员会忽略本次操作不受影响。如果群成员数量过多，点击合并按钮后请稍作等待。
      </div>
      <n-form :model="formParams"  :rules="rules" ref="formRef" :label-width="80" class="py-4" label-placement="left">
        <n-form-item label="" path="from_group_id">
          <n-input placeholder="填写合并群号，将你所填写群号的群成员合并到该群" v-model:value="formParams.from_group_id" />
        </n-form-item>
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
      import {ref, reactive, unref} from 'vue';
      import { mergeGroup} from '@/api/user';
      import { useMessage } from 'naive-ui';
      const emit = defineEmits(['childToParent']);
      const message = useMessage();
      const formRef: any = ref(null);
      const formBtnLoading = ref(false);
      const groupName = ref('')
      const toGroupId = ref('')
      const formParams = reactive({
        from_group_id: undefined,
      });
      const rules = {
        from_group_id: {
          required: true,
          trigger: ['blur', 'input'],
          message: '请填写合并群号',
        },
      };
      const showModal = ref(false)
      function openModal (record){
        formParams.from_group_id = undefined
        groupName.value = record.name
        toGroupId.value = record.group_id
        showModal.value = true
      }
      defineExpose({
        openModal
      })
      function confirmForm(){
        formRef.value.validate(async (errors: boolean) => {
          if (!errors) {
            formBtnLoading.value = true
            let parmas = {
              from_group_id:formParams.from_group_id,
              to_group_id:toGroupId.value
            }
            try {
              await mergeGroup(parmas)
              formBtnLoading.value = false
              emit('childToParent')
              showModal.value = false
              message.success('合并成功')
            } catch (error:any) {
              message.error(error.message)
              formBtnLoading.value = false
            }
          }
        });
      }
      
    </script>