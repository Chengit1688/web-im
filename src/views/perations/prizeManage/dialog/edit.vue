<template>
  <n-modal  style="width: 800px" id="basic-modal" v-model:show="showModal" :show-icon="false" preset="dialog" :title="formParams.id ? '编辑奖品':'新增奖品'">
    <n-form
      :model="formParams"
      :rules="rules"
      ref="formRef"
      :label-width="120"
      
      class="py-4"
    >
      <n-form-item label="奖品名字" path="name">
        <n-input placeholder="请输入名字" v-model:value="formParams.name" />
      </n-form-item>
      <n-form-item label="奖品类型" path="is_fictitious">
        <n-radio-group v-model:value="formParams.is_fictitious" name="radiogroup">
          <n-space>
            <n-radio v-for="song in awardType" :key="song.value" :value="song.value">
              {{ song.label }}
            </n-radio>
          </n-space>
      </n-radio-group>
      </n-form-item>
      <n-form-item label="兑换需消耗的金币数量" path="cost">
        <n-input  :allow-input="onlyAllowNumber" placeholder="请输入金币数量" v-model:value="formParams.cost" />
      </n-form-item>
      <n-form-item label="封面图片" path="icon">
            <BasicUpload :action="`${VITE_SOME_KEY=='dev'?'api':''}/cms_api/third/upload`"
                :data="{ file_type: 3, operation_id:'' + new Date().getTime()}" :headers="uploadHeaders" name="file"
                :width="80" :height="80" maxNumber="1" v-model:value="formParams.icon"
                helpText="单个文件不超过2MB,图片格式支持jpg,png,bmp,jpeg,图片尺寸最大200px*200px" @uploadChange="uploadChange"
                accept=".jpg,.png,.jpeg,.bmp" />
        </n-form-item>
      <n-form-item label="虚拟奖品的备注或者值" path="fictitious_value">
        <n-input  type="textarea" placeholder="请输入虚拟奖品的备注或者值" v-model:value="formParams.fictitious_value" />
      </n-form-item>
      <n-form-item label="奖品描述" path="describe">
        <n-input type="textarea" placeholder="请输入奖品描述" v-model:value="formParams.describe" />
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
  import { ACCESS_TOKEN } from '@/store/mutation-types';

import { storage } from '@/utils/Storage';
    import {ref, reactive, unref} from 'vue';
    import { addPrize, updatePrize } from '@/api/perations';
    import { useMessage } from 'naive-ui';
    const props = defineProps(['options'])
    const VITE_SOME_KEY = import.meta.env.VITE_SOME_KEY
    const awardType = ref([
       { label: '虚拟商品', value: 1 },
       { label: '实物', value: 2 },
      
   ])
   const onlyAllowNumber =  (value: string) => !value || /^\d+$/.test(value);
   const uploadHeaders = ref({
    token: storage.get(ACCESS_TOKEN),
  })
    const emit = defineEmits(['childToParent']);
    const message = useMessage();
    const formRef: any = ref(null);
    const formBtnLoading = ref(false);
    const formParams = reactive({
      name: undefined,
      cost: undefined,
      fictitious_value: undefined,
      express_number: undefined,
      is_fictitious: 1,
      id: undefined,
      icon: undefined,
      describe: undefined,
    });
    const rules:any = {
        name: {
          required: true,
          trigger: ['blur', 'input'],
          message: '请输入名称',
        },
        cost: {
          required: true,
          trigger: ['blur', 'input'],
          message: '请输入金币数量',
        },
       
         
    };
    function uploadChange(val){
      formParams.icon = val
  }
    const showModal = ref(false)
    function openModal (record){
      Object.assign(unref(formParams), record)
      showModal.value = true
    }
    defineExpose({
      openModal
    })
    function confirmForm(){
      formRef.value.validate(async (errors: boolean) => {
        if (!errors) {
          let parmas = {
            ...formParams,
            cost : Number(formParams.cost) 
          }
          try {

            if(formParams.id){ // 编辑
              await updatePrize(parmas)
            }else{
              const list = [{
                ...parmas
              }]
              await addPrize({list})
            }
            emit('childToParent')
            showModal.value = false
            message.success('操作成功')
          } catch (error:any) {
            message.error(error.message)
          }
        }
      });
    }
    
  </script>