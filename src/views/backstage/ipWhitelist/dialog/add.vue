<template>
  <n-modal
    id="basic-modal"
    v-model:show="showModal"
    :show-icon="false"
    preset="dialog"
    title="添加白名单"
  >
    <n-form :model="formParams" :rules="rules" ref="formRef" :label-width="120" class="py-4">
      <n-form-item label="IP地址" path="ip">
        <n-input placeholder="请输入IP地址" v-model:value="formParams.ip" />
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
  import { addIpWhite } from '@/api/backstage';
  import { useMessage } from 'naive-ui';
  const formRef: any = ref(null);
  const message = useMessage();
  const formBtnLoading = ref(false);
  const showModal = ref(false);
  const emit = defineEmits(['childToParent']);
  const formParams = reactive({
    ip: undefined,
    note: undefined,
  });
  const rules: any = {
    ip: [
      {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入ip地址',
      },
    ],
    note: [
      {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入备注',
      },
    ],
    nick_name: [
      { min: 1, max: 16, message: '昵称长度为1~16位', required: true, trigger: ['input', 'blur'] },
    ],
    role_id: {
      required: true,
      type: 'number',
      trigger: ['blur', 'change'],
      message: '请选择角色',
    },
  };

  async function openModal() {
    Object.assign(unref(formParams), {
      ip: undefined,
      note: undefined,
    });
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
  async function confirmForm() {
    formRef.value.validate(async (errors: boolean) => {
      if (isValidIP(formParams.ip)) {
        if (!errors) {
          formBtnLoading.value = true;
          try {
            await addIpWhite(formParams);
            emit('childToParent');
            showModal.value = false;
            message.success('添加成功');
          } catch (error: any) {
            message.error(error.message);
          }
          formBtnLoading.value = false;
        }
      } else {
        message.error('请输入有效IP地址！');
      }
    });
  }
</script>
