<template>
  <n-modal
    id="basic-modal"
    v-model:show="showModal"
    :show-icon="false"
    preset="dialog"
    title="添加群"
  >
    <n-form
      :model="formParams"
      :rules="rules"
      ref="formRef"
      :label-width="80"
      class="py-4"
      label-placement="left"
    >
      <n-form-item label="群主ID" path="owner_id">
        <n-select
          v-model:value="formParams.owner_id"
          placeholder="填写ID/账号/手机号/昵称"
          label-field="nick_name"
          value-field="user_id"
          filterable
          :options="usrerOptions"
          clearable
          remote
          @search="searchUserHttp"
        />
      </n-form-item>
      <n-form-item label="群名称" path="name">
        <n-input
          placeholder="请输入名称"
          maxlength="20"
          show-count
          v-model:value="formParams.name"
        />
      </n-form-item>
      <n-form-item label="群头像" path="face_url">
        <BasicUpload
          :action="`${VITE_SOME_KEY == 'dev' ? 'api' : ''}/cms_api/third/upload`"
          :data="{ file_type: 3, operation_id: '' + new Date().getTime() }"
          :headers="uploadHeaders"
          name="file"
          :width="80"
          :height="80"
          :maxNumber="1"
          v-model:value="formParams.face_url"
          helpText="单个文件不超过2MB"
          @uploadChange="uploadChange"
        />
      </n-form-item>
      <n-form-item label="群公告" path="notification" :show-feedback="false">
        <n-input
          type="textarea"
          placeholder="请输入群公告"
          maxlength="500"
          show-count
          v-model:value="formParams.notification"
        />
      </n-form-item>
      <n-form-item label=" " path="notification">
        <n-checkbox
          :checked-value="1"
          :unchecked-value="2"
          v-model:checked="formParams.is_topannocuncement"
        >
          置顶公告
        </n-checkbox>
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
  import { creatGroup, searchUser } from '@/api/user';
  import { useMessage } from 'naive-ui';
  import { BasicUpload } from '@/components/Upload';
  import { storage } from '@/utils/Storage';
  import { ACCESS_TOKEN } from '@/store/mutation-types';
  const emit = defineEmits(['childToParent']);
  const message = useMessage();
  const formRef: any = ref(null);
  const formBtnLoading = ref(false);
  const usrerOptions = ref([]);
  const VITE_SOME_KEY = import.meta.env.VITE_SOME_KEY;
  const uploadHeaders = ref({
    token: storage.get(ACCESS_TOKEN),
  });
  const formParams = reactive({
    owner_id: undefined,
    name: undefined,
    face_url: undefined,
    notification: undefined,
    is_topannocuncement: 2,
  });
  const rules: any = {
    owner_id: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请填写ID/账号/手机号/昵称',
    },
    name: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入群名称',
    },
    // face_url:{
    //   required: true,
    //   trigger: 'change',
    //   message: '请上传头像',
    // },
  };
  const showModal = ref(false);
  function openModal() {
    Object.assign(unref(formParams), {
      owner_id: undefined,
      name: undefined,
      face_url: undefined,
      notification: undefined,
      is_topannocuncement: 2,
    });
    showModal.value = true;
  }
  async function searchUserHttp(e) {
    if (!e) return;
    try {
      const data = await searchUser({ search: e });
      usrerOptions.value = data.list;
    } catch (error: any) {
      message.error(error.message);
    }
  }
  defineExpose({
    openModal,
  });
  function uploadChange(val) {
    formParams.face_url = val;
  }
  function confirmForm() {
    formRef.value.validate(async (errors: boolean) => {
      if (!errors) {
        formBtnLoading.value = true;
        let parmas = JSON.parse(JSON.stringify(formParams));
        parmas.face_url = formParams.face_url;
        parmas.notification = parmas.notification || ' ';
        try {
          await creatGroup(parmas);
          showModal.value = false;
          message.success('创建成功');
          emit('childToParent');
        } catch (error: any) {
          message.error(error.message);
        }
        formBtnLoading.value = false;
      }
    });
  }
</script>
