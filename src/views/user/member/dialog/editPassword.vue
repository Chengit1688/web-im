<template>
  <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" title="修改密码">
    <n-form :model="formParams" :rules="rules" ref="formRef" :label-width="120" class="py-4">
      <n-form-item label="密码" path="password">
        <n-input placeholder="请输入密码" v-model:value="formParams.password" />
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
  import { editPassword } from '@/api/user';
  import { useMessage } from 'naive-ui';
  import { useRoute } from 'vue-router';
  const props = defineProps(['info']);
  const message = useMessage();
  const route = useRoute();
  const formRef: any = ref(null);
  const formBtnLoading = ref(false);
  const loading = ref(false);
  const options = ref([]);
  const formParams = reactive({
    password: undefined,
    user_id: undefined,
  });
  const rules: any = {
    password: [{
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入密码',
    },
    { min: 6,  max: 16,message: '密码长度为6~16位', trigger: ['input', 'blur'] },
  ],
  };
  const showModal = ref(false);
  function openModal() {
    formParams.user_id = [];
    options.value = [];
    showModal.value = true;
  }
  defineExpose({
    openModal,
  });
  function confirmForm() {
    formRef.value.validate(async (errors: boolean) => {
      if (!errors) {
        formBtnLoading.value = true;
        let parmas = JSON.parse(JSON.stringify(formParams));
        parmas.user_id = props.info.userId;
        try {
          await editPassword(parmas);
          showModal.value = false;
          message.success('修改成功');
          formParams.password = undefined
        } catch (error: any) {
          message.error(error.message);
        }
        formBtnLoading.value = false;
      }
    });
  }
</script>
