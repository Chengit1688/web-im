<template>
  <n-modal
    id="basic-modal"
    v-model:show="showModal"
    :show-icon="false"
    preset="dialog"
    title="添加账号"
  >
    <n-form :model="formParams" :rules="rules" ref="formRef" :label-width="120" class="py-4">
      <n-form-item label="账号" path="username">
        <n-input placeholder="请输入账号" v-model:value="formParams.username" />
      </n-form-item>
      <n-form-item label="密码" path="password">
        <n-input placeholder="请输入密码" v-model:value="formParams.password" />
      </n-form-item>
      <n-form-item label="名称" path="nick_name">
        <n-input placeholder="请输入名称" v-model:value="formParams.nick_name" />
      </n-form-item>
      <n-form-item label="角色" path="role_id">
        <n-select
          v-model:value="formParams.role_id"
          :options="props.options"
          label-field="role_key"
          value-field="id"
        />
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
  import { addAcount } from '@/api/backstage';
  import { useMessage } from 'naive-ui';
  const formRef: any = ref(null);
  const message = useMessage();
  const formBtnLoading = ref(false);
  const props = defineProps(['options']);
  const showModal = ref(false);
  const emit = defineEmits(['childToParent']);
  const formParams = reactive({
    username: undefined,
    password: undefined,
    nick_name: undefined,
    role_id: undefined,
  });
  const rules: any = {
    username: [
      {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入账号',
      },
      { min: 4, max: 16, message: '账号长度为4~16位', required: true, trigger: ['input', 'blur'] },
    ],
    password: [
      {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入密码',
      },
      { min: 6, max: 16, message: '密码长度为6~16位', required: true, trigger: ['input', 'blur'] },
    ],
    nick_name: [
      { min: 1, max: 16, message: '名称长度为1~16位', required: true, trigger: ['input', 'blur'] },
    ],
    role_id: {
          required: true,
          type: 'number',
          trigger: ['blur', 'change'],
          message: '请选择角色'
        },
  };

  async function openModal() {
    Object.assign(unref(formParams), {
      username: undefined,
      password: undefined,
      nick_name: undefined,
      role_id: undefined,
    });
    showModal.value = true;
  }
  defineExpose({
    openModal,
  });
  async function confirmForm() {
    formRef.value.validate(async (errors: boolean) => {
      if (!errors) {
        formBtnLoading.value = true;
        try {
          await addAcount(formParams);
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
