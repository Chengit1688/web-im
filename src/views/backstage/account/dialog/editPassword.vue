<template>
  <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" title="修改密码">
    <n-form :model="formParams" :rules="rules" ref="formRef" :label-width="120" class="py-4" label-placement="left">
      <n-form-item label="" path="password">
        <n-input  placeholder="请输入密码" v-model:value="formParams.password" />
      </n-form-item>
    </n-form>
    <template #action>
      <n-space>
        <n-button @click="() => (showModal = false,formParams.password = undefined)">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>
<script lang="ts" setup>
  import { ref, reactive, unref } from 'vue';
  import { editAccountPassword } from '@/api/backstage';
  import { useMessage } from 'naive-ui';
  const emit = defineEmits(['childToParent']);
  const message = useMessage();
  const formRef: any = ref(null);
  const formBtnLoading = ref(false);
  const formParams = reactive({
    password: undefined,
    id: undefined,
  });
  const rules: any = {
    password: [
      {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入密码',
      },
      { min: 6, max: 16, message: '密码长度为6~16位', required: true, trigger: ['input', 'blur'] },
    ],
  };
  const showModal = ref(false);
  function openModal(record) {
    Object.assign(unref(formParams), record)
    showModal.value = true;
  }
  defineExpose({
    openModal,
  });
  function confirmForm() {
    formRef.value.validate(async (errors: boolean) => {
      if (!errors) {
        formBtnLoading.value = true;
        let parmas = {
            id:formParams.id,
            password:formParams.password,
          }
        try {
          await editAccountPassword(parmas);
          showModal.value = false;
          message.success('修改成功');
          formParams.password = undefined
          emit('childToParent');
        } catch (error: any) {
          message.error(error.message);
        }
        formBtnLoading.value = false;
      }
    });
  }
</script>
