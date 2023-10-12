<template>
  <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" title="余额动态调整">
    <n-form :model="formParams" :rules="rules" ref="formRef" :label-width="120" class="py-4">
      <n-form-item label="调整金额" path="amount">
        <n-input placeholder="请输入调整金额" v-model:value="formParams.amount" />
      </n-form-item>
      <n-form-item label="调整原因" path="note">
        <n-input placeholder="请输入调整原因" v-model:value="formParams.note" />
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
  import { changeAmount } from '@/api/user';
  import { useMessage } from 'naive-ui';
  const props = defineProps(['info']);
  const emit = defineEmits(['childToParent']);
  const message = useMessage();
  const formRef: any = ref(null);
  const formBtnLoading = ref(false);
  const formParams = reactive({
    amount: null,
    user_id: null,
    note: null,
  });
  const rules: any = {
    amount: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入调整金额',
    },
    note: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入调整原因',
    },
  };
  const showModal = ref(false);
  function openModal() {
    Object.assign(unref(formParams), {
      amount: null,
      user_id: null,
      note: null,
    });
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
        parmas.amount = Number(parmas.amount * 100);
        try {
          await changeAmount(parmas);
          showModal.value = false;
          message.success('余额动态调整成功');
          emit('childToParent');
        } catch (error: any) {
          message.error(error.message);
        }
        formBtnLoading.value = false;
      }
    });
  }
</script>
