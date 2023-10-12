<template>
  <n-modal id="basic-modal" v-model:show="showModal" :show-icon="false" preset="dialog" title="编辑管理员">
    <n-form
      :model="formParams"
      :rules="rules"
      ref="formRef"
      :label-width="120"
      class="py-4"
    >
      <n-form-item label="账号" path="username">
        <n-input placeholder="请输入账号" v-model:value="formParams.username" />
      </n-form-item>
      <n-form-item label="名称" path="nick_name">
        <n-input  placeholder="请输入名称" v-model:value="formParams.nick_name" />
      </n-form-item>
      <n-form-item label="角色" path="role_key">
        <n-select v-model:value="formParams.role_key"  :options="props.options" label-field="role_key" value-field="role_key"/>
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
    import { editAccount} from '@/api/backstage';
    import { useMessage } from 'naive-ui';
    const props = defineProps(['options'])
    const emit = defineEmits(['childToParent']);
    const message = useMessage();
    const formRef: any = ref(null);
    const formBtnLoading = ref(false);
    const formParams = reactive({
      username: undefined,
      nick_name: undefined,
      role_key: undefined,
      id: undefined,
    });
    const rules:any = {
      username: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入账号',
      },
      nick_name: {
        required: true,
        trigger: ['blur', 'change'],
        message: '请输入名称',
      },
    };
    const showModal = ref(false)
    function openModal (record){
      Object.assign(unref(formParams), record,{role_id:props})
      showModal.value = true
    }
    defineExpose({
      openModal
    })
    function confirmForm(){
      formRef.value.validate(async (errors: boolean) => {
        if (!errors) {
          let parmas = {
            id:formParams.id,
            nick_name:formParams.nick_name,
            username:formParams.username,
            role_id:props.options.find(item=>item.role_key==formParams.role_key).role_id, 
          }
          try {
            await editAccount(parmas)
            emit('childToParent')
            showModal.value = false
            message.success('修改成功')
          } catch (error:any) {
            message.error(error.message)
          }
        }
      });
    }
    
  </script>