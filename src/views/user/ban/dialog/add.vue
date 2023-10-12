<template>
  <n-modal
    id="basic-modal"
    v-model:show="showModal"
    :show-icon="false"
    preset="dialog"
    title="添加特权用户"
  >
    <n-form :model="formParams" :rules="rules" ref="formRef" :label-width="120" class="py-4" label-placement="left">
      <n-form-item label="" path="user_id">
        <n-select  v-model:value="formParams.user_id" placeholder="填写ID/账号/手机号/昵称" label-field="nick_name" value-field="user_id"  filterable   :options="usrerOptions" clearable remote  @search="searchUserHttp"/>
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
<script lang="ts" setup>
  import { ref, reactive, unref } from 'vue';
  import { addPrivilege, searchUser } from '@/api/user';
  import { useMessage } from 'naive-ui';
  const formRef: any = ref(null);
  const message = useMessage();
  const formBtnLoading = ref(false);
  const showModal = ref(false);
  const emit = defineEmits(['childToParent']);
  const usrerOptions = ref([])
  const formParams = reactive({
    user_id: undefined,
  });
  const rules: any = {
    user_id: [
      {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入用户ID',
      }
    ]
  };

  async function openModal() {
    Object.assign(unref(formParams), {
      user_id: undefined,
      nick_name: undefined,
    });
    usrerOptions.value =  []
    showModal.value = true;
  }
  async function searchUserHttp(e){
    if(!e) return 
    try {
      const data = await searchUser({search:e})
      usrerOptions.value =data.list
    } catch (error:any) {
      message.error(error.message)
    }
  }
  defineExpose({
    openModal,
  });
  async function confirmForm() {
    formRef.value.validate(async (errors: boolean) => {
      if (!errors) {
        formBtnLoading.value = true;
        try {
          await addPrivilege(formParams);
          emit('childToParent');
          showModal.value = false;
          message.success('添加成功');
        } catch (error: any) {
          message.error(error.message);
        }
        formBtnLoading.value = false;
      }
    });
  }
</script>
