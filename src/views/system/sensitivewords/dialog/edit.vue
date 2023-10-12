<template>
  <n-modal id="basic-modal" v-model:show="showModal" :show-icon="false" preset="dialog" title="编辑敏感词">
    <n-form
      :model="formParams"
      :rules="rules"
      ref="formRef"
      :label-width="120"
      class="py-4"
    >
      <n-form-item label="敏感词" path="shield_words">
        <n-input placeholder="请输入敏感词" maxlength="16" show-count v-model:value="formParams.shield_words" />
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
    import { upShield} from '@/api/system';
    import { useMessage } from 'naive-ui';
    const emit = defineEmits(['childToParent']);
    const message = useMessage();
    const formRef: any = ref(null);
    const formBtnLoading = ref(false);
    const formParams = reactive({
      shield_words: undefined,
    });
    const rules:any = {
      shield_words: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入敏感词',
      }
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
          formBtnLoading.value = true
          try {
            await upShield(formParams)
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