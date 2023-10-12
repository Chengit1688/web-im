<template>
  <n-modal id="basic-modal" v-model:show="showModal" :show-icon="false" preset="dialog" title="编辑群信息">
    <n-form :model="formParams"  :rules="rules" ref="formRef" :label-width="80" class="py-4" label-placement="left">
      <n-form-item label="群名称" path="name">
        <n-input placeholder="请输入名称" maxlength="20" show-count v-model:value="formParams.name" />
      </n-form-item>
      <n-form-item label="群头像" path="face_url">
        <BasicUpload
          :action="`${VITE_SOME_KEY=='dev'?'api':''}/cms_api/third/upload`"
          :data="{ file_type: 3, operation_id:'' + new Date().getTime()}"
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
        <n-input type="textarea" placeholder="请输入群公告" maxlength="500" show-count v-model:value="formParams.notification" />
      </n-form-item>
      <n-form-item label=" ">
        <n-checkbox :checked-value="1" :unchecked-value="2" v-model:checked="formParams.is_topannocuncement">
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
  <script lang="ts" setup >
    import {ref, reactive, unref} from 'vue';
    import { upGroup} from '@/api/user';
    import { useMessage } from 'naive-ui';
    import { BasicUpload } from '@/components/Upload';
    import { storage } from '@/utils/Storage';
    import { ACCESS_TOKEN} from '@/store/mutation-types';
    const emit = defineEmits(['childToParent']);
    const message = useMessage();
    const formRef: any = ref(null);
    const formBtnLoading = ref(false);
    const VITE_SOME_KEY = import.meta.env.VITE_SOME_KEY
    const uploadHeaders = ref({
      token: storage.get(ACCESS_TOKEN),
    })
    const formParams:any = reactive({
      name: undefined,
      face_url: undefined,
      notification: undefined,
      is_topannocuncement: undefined,
    });
    const rules:any = {
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
    const showModal = ref(false)
    function openModal (record){
      Object.assign(unref(formParams), record)
      formParams.face_url = formParams.face_url
      console.log(record)
      showModal.value = true
    }
    defineExpose({
      openModal
    })
    function uploadChange(val){
      formParams.face_url = val
    }
    function confirmForm(){
      formRef.value.validate(async (errors: boolean) => {
        if (!errors) {
          formBtnLoading.value = true
          let params:any = {
            group_id:formParams.group_id,
            face_url : formParams.face_url,
            name: formParams.name,
            is_topannocuncement: formParams.is_topannocuncement,
            notification: formParams.notification || ' '
          }
          try {
            await upGroup(params)
            emit('childToParent')
            showModal.value = false
            message.success('修改成功')
          } catch (error:any) {
            message.error(error.message)
          }
          formBtnLoading.value = false
        }
      });
    }
    
  </script>