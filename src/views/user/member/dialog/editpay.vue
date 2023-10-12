<template>
  <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" title="设置支付密码">
    <n-form :model="formParams" :rules="rules" ref="formRef" :label-width="120" class="py-4">
      <n-form-item label="支付密码密码" path="pay_passwd">
        <n-input-number style="width: 100%;" min="100000" max="999999" placeholder="请输入支付密码" v-model:value="formParams.pay_passwd"  :show-button="false"/>
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
  import { setPaypasswd } from '@/api/user';
  import { useMessage } from 'naive-ui';
  const props = defineProps(['info']);
  const message = useMessage();
  const formRef: any = ref(null);
  const formBtnLoading = ref(false);
  const formParams = reactive({
    pay_passwd: undefined,
    user_id: undefined,
  });
  const rules: any = {
    pay_passwd: {
      type:'number',
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入6位纯数字密码',
    }
  };
  const showModal = ref(false);
  function openModal() {
    Object.assign(unref(formParams),{
      user_id: null,
      pay_passwd: null,
    })
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
        parmas.pay_passwd =parmas.pay_passwd +''
        try {
          await setPaypasswd(parmas);
          showModal.value = false;
          message.success('修改成功');
        } catch (error: any) {
          message.error(error.message);
        }
        formBtnLoading.value = false;
      }
    });
  }
</script>
