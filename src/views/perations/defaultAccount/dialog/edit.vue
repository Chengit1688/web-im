<template>
  <n-modal id="basic-modal" v-model:show="showModal" :show-icon="false" preset="card" title="编辑默认好友" style="width:30%">
    <n-form :model="formParams" ref="formRef" :label-width="120" class="py-4">
      <n-form-item label="用户ID" path="user_id">
        <n-input placeholder="请输入名称"  v-model:value="formParams.user_id" disabled/>
      </n-form-item>
      <n-form-item label="打招呼消息" path="greet_msg">
        <n-input type="textarea" rows="2" placeholder="请输入打招呼消息" v-model:value="formParams.greet_msg" />
      </n-form-item>
      <n-form-item label="备注" path="remarks">
        <n-input type="textarea" rows="2" placeholder="请输入备注" v-model:value="formParams.remarks" />
      </n-form-item>
    </n-form>
    <template #action>
      <n-space justify="end">
        <n-button @click="() => (showModal = false)">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>
  <script lang="ts" setup >
    import {ref, reactive, unref} from 'vue';
    import { upDefaultAccount} from '@/api/perations';
    import { useMessage } from 'naive-ui';
    const showModal = ref(false)
    const emit = defineEmits(['childToParent']);
    const formBtnLoading = ref(false);
    const message = useMessage();
    const formParams = reactive({
      user_id: undefined, 
      greet_msg: undefined,
      remarks: undefined,
      id:undefined
    });
    
    function openModal (row){
      let rows = {
        user_id:row.user_id,
        greet_msg: row.greet_msg,
        remarks: row.remarks,
        id: row.id,
      }
      Object.assign(unref(formParams), rows)
      showModal.value = true
    }
    defineExpose({
      openModal
    })
    async function confirmForm(){
      formBtnLoading.value = true
      let parmas = JSON.parse(JSON.stringify(formParams))
      try {
        await upDefaultAccount(parmas)
        emit('childToParent')
        showModal.value = false
        message.success('编辑成功');
      } catch (error:any) {
        message.error(error.message)
      }
      formBtnLoading.value = false
    }
    
  </script>