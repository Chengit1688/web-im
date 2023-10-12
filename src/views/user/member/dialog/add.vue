<template>
  <n-modal
    id="basic-modal"
    v-model:show="showModal"
    :show-icon="false"
    preset="dialog"
    title="批量添加用户"
    style="width: 800px"
  >
    <n-form
      :model="dynamicForm"
      width="200px"
      ref="formRef"
      :label-width="120"
      label-placement="left"
    >
      <div
        v-for="(item, index) in dynamicForm.users"
        style="display: flex; justify-content: space-between"
      >
        <n-form-item
          :key="index"
          :path="`users[${index}].account`"
          label="账号" 
          label-width="60"
          :rule="[{required: true, message: '请输入账号',trigger: ['input', 'blur']},{ min: 4, max: 16, message: '账号长度为4~16位', trigger: ['input', 'blur'] }]">
          <n-input v-model:value="item.account" clearable placeholder="请输入账号" />
        </n-form-item>
        <n-form-item
          :key="index"
          :path="`users[${index}].password`"
          label="密码" 
          label-width="60"
          :rule="[{required: true, message: '请输入密码',trigger: ['input', 'blur']},{ min: 6,  max: 16,message: '密码长度为6~16位', trigger: ['input', 'blur'] }]">
          <n-input v-model:value="item.password" clearable placeholder="请输入密码" />
        </n-form-item>
        <n-form-item
          :key="index"
          :path="`users[${index}].nick_name`"
          label="昵称" 
          label-width="60"
          :rule="[{
            required: true,
            message: '请输入昵称',
            trigger: ['input', 'blur'],
          },
          { min: 1,  max: 16,message: '昵称长度为1~16位', trigger: ['input', 'blur'] },
          
          ]"
        >
          <n-input v-model:value="item.nick_name" clearable placeholder="请输入昵称" />
        </n-form-item>
        <n-form-item>
          <n-button
            style="margin-left: 12px"
            type="error"
            @click="removeItem(index)"
            v-if="index != 0"
          >
            删除
          </n-button>
          <div style="margin-left: 12px; width: 56px" v-else> </div>
        </n-form-item>
      </div>
    </n-form>
    <template #action>
      <n-space>
        <n-button attr-type="button" type="info" @click="addItem"> 新增用户 </n-button>
        <n-button type="info" :loading="formBtnLoading" @click="confirmForm">创建</n-button>
      </n-space>
    </template>
  </n-modal>
</template>
<script lang="ts" setup>
  import { ref, reactive } from 'vue';
  import { addNewUser } from '@/api/user';
  import { useMessage } from 'naive-ui';
  const message = useMessage();
  const emit = defineEmits(['childToParent']);
  const formRef: any = ref(null);
  const formBtnLoading = ref(false);
  const dynamicForm = reactive({
    users: [{ account: '', nick_name: '', password: '' }],
  });
  const removeItem = (index: number) => {
    dynamicForm.users.splice(index, 1);
  };

  const addItem = () => {
    dynamicForm.users.push({ account: '', nick_name: '', password: '' });
  };

  const showModal = ref(false);
  function openModal() {
    showModal.value = true;
    dynamicForm.users= [{ account: '', nick_name: '', password: '' }]
  }
  defineExpose({
    openModal,
  });
  function confirmForm() {
    formRef.value.validate(async (errors: boolean) => {
      if (!errors) {
        let parmas: any = dynamicForm;
        try {
          await addNewUser(parmas);
          showModal.value = false;
          message.success('添加成功');
          emit('childToParent');
        } catch (error: any) {
          message.error(error.message);
        }
      }
    });
  }
</script>
