<template>
  <n-modal  v-model:show="showModal" :show-icon="false" preset="dialog" title="添加发现页" >
    <n-form :model="formParams"  :rules="rules" ref="formRef" :label-width="80" class="py-4" label-placement="left">
      <n-form-item label="链接地址" path="url">
        <n-input placeholder="请输入链接地址" maxlength="200" show-count v-model:value="formParams.url" />
      </n-form-item>
      <n-form-item label="排序" path="sort">
        <n-input-number placeholder="请输入排序值" v-model:value="formParams.sort" min="0" class="w-full"/>
      </n-form-item>
      <n-form-item label="名称" path="name">
        <n-input placeholder="请输入名称" maxlength="20" show-count v-model:value="formParams.name" />
      </n-form-item>
      <n-form-item label="图标" path="icon">
        <BasicUpload
          :action="`${VITE_SOME_KEY=='dev'?'api':''}/cms_api/third/upload`"
          :data="{ file_type: 3, operation_id:'' + new Date().getTime()}"
          :headers="uploadHeaders"
          name="file"
          :width="80"
          :height="80"
          :maxNumber="1"
          v-model:value="formParams.icon"
          helpText="单个文件不超过2MB,图片格式支持jpg,png,bmp,jpeg,图片尺寸最大200px*200px"
          @uploadChange="uploadChange"
          accept=".jpg,.png,.jpeg,.bmp"
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
<script lang="ts" setup >
  import {reactive, ref, unref} from 'vue';
  import { useMessage } from 'naive-ui';
  import { BasicUpload } from '@/components/Upload';
  import { storage } from '@/utils/Storage';
  import { ACCESS_TOKEN} from '@/store/mutation-types';
  import { addDiscover} from '@/api/discovery/index';
  const emit = defineEmits(['childToParent']);
  const VITE_SOME_KEY = import.meta.env.VITE_SOME_KEY
  const formRef: any = ref(null);
  const message = useMessage();
  const formBtnLoading = ref(false);
  const showModal = ref(false)
  const uploadHeaders = ref({
    token: storage.get(ACCESS_TOKEN),
  })
  const formParams = reactive({
    name:undefined,
    sort: undefined,
    url: undefined,
    icon: undefined,
  });
  const rules:any = {
    name: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入名称',
    },
    url:{
      required: true,
      trigger: 'change',
      message: '请输入URL',
    },
  };
  function uploadChange(val){
    formParams.icon = val
  }
  function openModal (){
    Object.assign(unref(formParams), {
      name:undefined,
      sort: undefined,
      url: undefined,
      icon: undefined,
    })
    showModal.value = true
  }
  defineExpose({
    openModal
  })
  async function confirmForm(){
    formRef.value.validate(async (errors: boolean) => {
      if (!errors) {
        let parmas = JSON.parse(JSON.stringify(formParams))
        parmas.icon = formParams.icon
        try {
          await addDiscover(parmas)
          emit('childToParent')
          showModal.value = false
          message.success('添加成功')
        } catch (error:any) {
          message.error(error.message)
        }
      }
    });
  }
  
</script>