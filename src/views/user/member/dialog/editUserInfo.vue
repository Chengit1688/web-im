<template>
  <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" title="编辑用户资料">
    <n-form :model="props.info" :rules="rules" ref="formRef" :label-width="120" class="py-4">
      <n-form-item label="昵称" path="nick_name" >
        <n-input placeholder="请输入昵称" v-model:value="props.info.nick_name" />
      </n-form-item>
      <n-form-item label="手机号码" path="phone_number">
        <n-input placeholder="请输入手机号码" v-model:value="props.info.phone_number" type="number"/>
      </n-form-item>
      <n-form-item label="年龄" path="age">
        <n-input placeholder="请输入年龄" v-model:value="props.info.age" type="number"/>
      </n-form-item>
      <n-form-item label="签名" path="signatures">
        <n-input placeholder="请输入签名" v-model:value="props.info.signatures" maxlength="200" type='textarea' show-count clearable />
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
  import { editUserInfo } from '@/api/user';
  import { useMessage } from 'naive-ui';
  import { useRoute } from 'vue-router';
  const props = defineProps(['info']);
  const emit = defineEmits(['childToParent']);
  const message = useMessage();
  const route = useRoute();
  const formRef: any = ref(null);
  const formBtnLoading = ref(false);
  const loading = ref(false);
  const options = ref([]);
  const info = reactive({
    signatures: undefined,
    user_id: undefined,
    age:undefined,
    phone_number:undefined,
    nick_name:undefined
  });
  const rules: any = {
    nick_name: [{
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入昵称',
    },
    { min: 1,  max: 16,message: '昵称长度为1~16位', trigger: ['input', 'blur'] },
  ],
  phone_number: [
    { min: 1,  max: 20,message: '手机号码最长20位', trigger: ['input', 'blur'] },
  ],

  };
  const showModal = ref(false);
  function openModal() {
    showModal.value = true;
  }
  defineExpose({
    openModal,
  });
  function confirmForm() {
    formRef.value.validate(async (errors: boolean) => {
      if (!errors) {
        formBtnLoading.value = true;
        let parmas = JSON.parse(JSON.stringify(props.info));
        parmas.user_id = props.info.userId;
        parmas.age = Number(props.info.age);
        delete parmas.userId
        try {
          await editUserInfo(parmas);
          showModal.value = false;
          message.success('修改成功');
          emit('childToParent');
        } catch (error: any) {
          message.error(error.message);
        }
        formBtnLoading.value = false;
      }
    });
  }
</script>
