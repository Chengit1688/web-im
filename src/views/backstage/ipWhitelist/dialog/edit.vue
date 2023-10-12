<template>
  <n-modal
    id="basic-modal"
    v-model:show="showModal"
    :show-icon="false"
    preset="dialog"
    title="编辑白名单"
  >
    <n-form :model="formParams" :rules="rules" ref="formRef" :label-width="120" class="py-4">
      <n-form-item label="IP" path="ip">
        <n-input placeholder="请输入IP" v-model:value="formParams.ip" />
      </n-form-item>
      <n-form-item label="备注" path="note">
        <n-input
          placeholder="请输入备注"
          v-model:value="formParams.note"
          maxlength="255"
          type="textarea"
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
  import { editIpWhite } from '@/api/backstage';
  import { useMessage } from 'naive-ui';
  const props = defineProps(['options']);
  const emit = defineEmits(['childToParent']);
  const message = useMessage();
  const formRef: any = ref(null);
  const formBtnLoading = ref(false);
  const formParams = reactive({
    ip: undefined,
    note: undefined,
    id: undefined,
  });
  const rules: any = {
    ip: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入IP地址',
    },
    note: {
      required: true,
      trigger: ['blur', 'change'],
      message: '请输入备注',
    },
  };
  const showModal = ref(false);
  function openModal(record) {
    Object.assign(unref(formParams), record, { role_id: props });
    showModal.value = true;
  }
  defineExpose({
    openModal,
  });
  // IP地址校验
  function isValidIP(ip) {
    var reg =
      /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    return reg.test(ip);
  }
  function confirmForm() {
    formRef.value.validate(async (errors: boolean) => {
      if (isValidIP(formParams.ip)) {
        if (!errors) {
          let parmas = {
            id: formParams.id,
            ip: formParams.ip,
            note: formParams.note,
          };
          try {
            await editIpWhite(parmas);
            emit('childToParent');
            showModal.value = false;
            message.success('修改成功');
          } catch (error: any) {
            message.error(error.message);
          }
        }
      } else {
        message.error('请输入有效IP地址！');
      }
    });
  }
</script>
