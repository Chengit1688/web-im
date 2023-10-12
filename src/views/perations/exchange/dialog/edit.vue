<template>
  <n-modal id="basic-modal" v-model:show="showModal" :show-icon="false" preset="dialog" title="编辑兑奖">
    <n-form
      :model="formParams"
      :rules="rules"
      ref="formRef"
      :label-width="120"
      class="py-4"
    >
      <n-form-item label="手机号" path="mobile">
        <n-input placeholder="请输入账号" v-model:value="formParams.mobile" />
      </n-form-item>
      <n-form-item label="奖品类型" path="is_fictitious">
        <n-radio-group v-model:value="formParams.is_fictitious" name="radiogroup">
          <n-space>
            <n-radio disabled v-for="song in fictitiousType" :key="song.value" :value="song.value">
              {{ song.label }}
            </n-radio>
          </n-space>
      </n-radio-group>
    </n-form-item>
      <n-form-item label="用户名" path="user_name">
        <n-input  placeholder="请输入名称" v-model:value="formParams.user_name" />
      </n-form-item>
      <n-form-item label="地址" path="address">
        <n-input  placeholder="请输入名称" v-model:value="formParams.address" />
      </n-form-item>
      <n-form-item label="快递单号" path="express_number">
        <n-input  placeholder="请输入名称" v-model:value="formParams.express_number" />
      </n-form-item>
      
    
      <n-form-item label="状态（虚拟商品选择前2项，实物商品选择后2项）" path="status">
        <n-radio-group v-model:value="formParams.status" name="radiogroup">
          <n-space>
            <n-radio v-for="song in statusType" :key="song.value" :value="song.value">
              {{ song.label }}
            </n-radio>
          </n-space>
      </n-radio-group>
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
    import { setRedeemPrize} from '@/api/perations';
    import { useMessage } from 'naive-ui';
    const props = defineProps(['options'])
    const statusType = ref([
       { label: '充值中', value: 1 },
       { label: '充值成功', value: 2 },
       { label: '待出库', value: 21 },
       { label: '已发货', value: 22 },
   ])
   const fictitiousType = ref([
        {
             label: '虚拟',
             value: 1
           },
           {
             label: '实物',
             value: 2
           }
        ])
    const emit = defineEmits(['childToParent']);
    const message = useMessage();
    const formRef: any = ref(null);
    const formBtnLoading = ref(false);
    const formParams = reactive({
      mobile: undefined,
      user_name: undefined,
      address: undefined,
      express_number: undefined,
      status: undefined,
      id: undefined,
      is_fictitious: undefined,
    });
    const rules:any = {
      
    };
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
            ...formParams 
          }
          try {
            await setRedeemPrize(parmas)
            emit('childToParent')
            showModal.value = false
            message.success('修改成功')
          } catch (error:any) {
            message.error(error.message)
          }
        }
      });
    }
    
  </script>