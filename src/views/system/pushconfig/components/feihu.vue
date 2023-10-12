<template>
    <n-card :bordered="false" class="proCard">
      <n-spin size="small" :show="show">
        <n-form :model="formParams"  :rules="rules" ref="formRef">
          <n-form-item label="AppId:" path="app_key" class="w-2/6">
            <n-input placeholder="请输入app_key" v-model:value="formParams.app_key" />
          </n-form-item>
          <n-form-item label="AppSecret:" path="app_secret" class="w-2/6">
            <n-input placeholder="请输入master_secret" v-model:value="formParams.app_secret" />
          </n-form-item>
          <div>
            <n-space>
              <n-button type="primary"  @click="formSubmit">保存</n-button>
            </n-space>
          </div>
        </n-form>
      </n-spin>
    </n-card>
  </template>
    
    <script lang="ts" setup>
      import { onMounted, reactive, ref, unref } from 'vue';
      import {useDialog,useMessage } from 'naive-ui';
      import { getFpush,upFpush} from '@/api/system';
      const message = useMessage();
      const dialog = useDialog();
      const show = ref(true)
      const formRef: any = ref(null);
      const formParams = reactive({
        app_key:undefined,
        app_secret:undefined
      })
      const rules:any = {
        app_key: {
          required: true,
          trigger: ['blur', 'input'],
          message: '请输入app_key',
        },
        app_secret: {
          required: true,
          trigger: ['blur', 'input'],
          message: '请输入master_secret',
        }
      };
      async function getJpushHttp() {
        try {
          const data = await getFpush()
          Object.assign(unref(formParams), data)
          show.value = false
        } catch (error :any) {
          message.error(error.message);
        }
      }
      function formSubmit() {
        formRef.value.validate(async (errors: boolean) => {
          if (!errors) {
            const push = dialog.info({
              title: '提示',
              content: `是否保存当前修改？`,
              positiveText: '确定',
              negativeText: '取消',
              onPositiveClick: async () => {
                push.loading = true
                let params = formParams
                try {
                  await upFpush(params)
                  message.success('保存成功');
                } catch (error :any) {
                  message.error(error.message);
                }
                push.loading = false
              },
              onNegativeClick: () => {},
            });
          }
        });
        
      }
      onMounted(() => {
        getJpushHttp()
      })
    </script>