<template>
  <n-card :bordered="false" class="proCard">
    <n-spin size="small" :show="show">
      <n-form :model="formValue" label-placement="left">
        <div style="margin-bottom: 20px;font-weight: bold;">移动端</div>
        <n-form-item label="" path="phone" >
          <n-checkbox-group v-model:value="formValue.mobile" :min="1">
            <n-grid :y-gap="24" :cols="1">
              <n-gi>
                <n-checkbox :value="1" label="手机号" />
              </n-gi>
              <n-gi>
                <n-checkbox :value="2" label="账号" />
              </n-gi>
              <n-gi>
                <n-checkbox :value="3" label="游客（仅APP）" />
              </n-gi>
            </n-grid>
          </n-checkbox-group>
        </n-form-item>
        <div style="margin-bottom: 20px;font-weight: bold;">PC端</div>
        <n-form-item label="" path="phone" >
          <n-checkbox-group v-model:value="formValue.pc" :min="1">
            <n-grid :y-gap="24" :cols="1">
              <n-gi>
                <n-checkbox :value="1" label="手机号" />
              </n-gi>
              <n-gi>
                <n-checkbox :value="2" label="账号" />
              </n-gi>
            </n-grid>
          </n-checkbox-group>
        </n-form-item>
        <div>
          <n-space>
            <n-button type="primary" @click="formSubmit">保存</n-button>
          </n-space>
        </div>
      </n-form>
    </n-spin>
  </n-card>
  
</template>
  
  <script lang="ts" setup>
    import { onMounted, reactive, ref, unref } from 'vue';
    import {useDialog,useMessage } from 'naive-ui';
    import { getLoginConfig,upLoginConfig} from '@/api/system';
    const message = useMessage();
    const dialog = useDialog();
    const show = ref(true)
    const formValue = reactive({
      mobile:[],
      pc:[]
    })
    async function getLoginConfigHttp() {
      try {
        const data = await getLoginConfig()
        Object.assign(unref(formValue), data)
        show.value = false
      } catch (error :any) {
        message.error(error.message);
      }
    }
    function formSubmit() {
      dialog.info({
        title: '提示',
        content: `是否保存当前修改？`,
        positiveText: '确定',
        negativeText: '取消',
        onPositiveClick: async () => {
          let params = {
            config:formValue
          }
          try {
            await upLoginConfig(params)
            message.success('保存成功');
          } catch (error :any) {
            message.error(error.message);
          }
        },
        onNegativeClick: () => {},
      });
    }
    onMounted(() => {
      getLoginConfigHttp()
    })
  </script>