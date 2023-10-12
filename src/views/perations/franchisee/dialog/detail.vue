<template>
  <n-modal  v-model:show="showModal" :show-icon="false" preset="dialog" title="加盟商详情" >
    <n-form :model="formParams"  :rules="rules" ref="formRef" :label-width="80" class="py-4" label-placement="left">
      <n-form-item label="申请人:" path="nick_name">
        <div>{{formParams.nick_name}}</div>
      </n-form-item>
      <n-form-item label="店铺名称:" path="shop_name">
        <div>{{formParams.shop_name}}</div>
      </n-form-item>
      <n-form-item label="店铺类型:" path="shop_type">
        <div>{{formParams.shop_type}}</div>
      </n-form-item>
      <n-form-item label="店铺地址:" path="shop_location">
        <div>{{formParams.shop_location}}</div>
      </n-form-item>
      <!-- <n-form-item label="营业执照:" path="nick_name">
        <div>{{formParams.nick_name}}</div>
      </n-form-item> -->
      <!-- <n-form-item label="店面照片:" path="shop_icon">
        <div>{{formParams.shop_icon}}</div>
      </n-form-item> -->
      <!-- <n-form-item label="店铺简介:" path="nick_name">
        <div>{{formParams.nick_name}}</div>
      </n-form-item> -->
      <n-form-item label="审核状态" path="status">
        <n-radio-group v-model:value="formParams.status" >
            <n-radio :value="1">待审核</n-radio>
            <n-radio :value="2">通过</n-radio>
            <n-radio :value="3">拒绝</n-radio>
        </n-radio-group>
        <!-- <div v-else>
          <span v-if="formParams.status==2">通过</span>
          <span v-if="formParams.status==3">拒绝</span>
        </div> -->
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
  import { approveShopping} from '@/api/perations/index';
  const emit = defineEmits(['childToParent']);
  const VITE_SOME_KEY = import.meta.env.VITE_SOME_KEY
  const formRef: any = ref(null);
  const message = useMessage();
  const formBtnLoading = ref(false);
  const showModal = ref(false)
  const uploadHeaders = ref({
    token: storage.get(ACCESS_TOKEN),
  })
  const formParams:any = reactive({
    name:undefined,
    sort: undefined,
    url: undefined,
    icon: undefined,
  });
  const rules:any = {

  };

  function onStatusChange(e){
    console.log(e, 'e----')
  }
  function uploadChange(val){
    formParams.icon = val
  }
  function openModal (record){
    Object.assign(unref(formParams), record)
    formParams.icon = formParams.icon
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
          await approveShopping(parmas)
          emit('childToParent')
          showModal.value = false
          message.success('审核成功')
        } catch (error:any) {
          message.error(error.message)
        }
      }
    });
  }
  
</script>
