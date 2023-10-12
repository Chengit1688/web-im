<template>
  <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" title="添加好友">
    <n-form :model="formParams" :rules="rules" ref="formRef" :label-width="120" class="py-4">
      <n-form-item label="" path="friend_id">
        <n-input placeholder="请输入用户ID/昵称/手机号" v-model:value="formParams.friend_id" />
      </n-form-item>
    </n-form>
    <template #action>
      <n-space>
        <n-button @click="closeModal">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>
<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { addFriends } from '@/api/user';
  import { useMessage } from 'naive-ui';
  const props = defineProps(['info']);
  const emit = defineEmits(['childToParent']);
  const message = useMessage();
  const formRef: any = ref(null);
  const formBtnLoading = ref(false);
  const options = ref([]);
  const formParams = <any> reactive({
    friend_id: undefined,
    user_id: undefined,
  });
  const rules: any = {
    friend_id: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入用户ID/昵称/手机号',
    },
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
  function confirmForm(values: Recordable) {
    formRef.value.validate(async (errors: boolean) => {
      if (!errors) {
        formBtnLoading.value = true;
        let parmas = JSON.parse(JSON.stringify(formParams));
        parmas.user_id = props.info.userId;
        try {
          await addFriends(parmas);
          showModal.value = false;
          message.success('添加成功');
          for (let i in formParams) {
            formParams[i] = values[i] || undefined;
          }
          emit('childToParent');
        } catch (error: any) {
          message.error(error.message);
        }
        formBtnLoading.value = false;
      }
    });
  }
  function closeModal(values: Recordable) {
    // 重置
    for (let i in formParams) {
      formParams[i] = values[i] || undefined;
    }
    showModal.value = false;
  }
</script>
