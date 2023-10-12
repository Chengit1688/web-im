<template>
  <n-card :bordered="false" class="proCard">
    <n-spin size="small" :show="show">
      <n-form :model="formValue" label-placement="left">
        <n-form-item label="邀请码开关：" path="is_invite_code">
          <n-switch :checked-value="1" :unchecked-value="2" v-model:value="formValue.is_invite_code" />
          <span class="ml-3">（开启后，注册页面显示邀请码输入框）</span>
        </n-form-item>
        <n-form-item  label="校验邀请码：" path="check_invite_code" v-if="formValue.is_invite_code==1">
          <n-switch :checked-value="1" :unchecked-value="2" v-model:value="formValue.check_invite_code" />
          <span class="ml-3">（开启后，邀请码为必输项）</span>
        </n-form-item>
        <!-- <n-form-item label="验证码开关：" path="is_verification_code">
          <n-switch :checked-value="1" :unchecked-value="2" v-model:value="formValue.is_verification_code" />
          <span class="ml-3">（开启后，注册页面校验验证码）</span>
        </n-form-item> -->
        <n-form-item label="短信验证码：" path="is_sms_code">
          <n-switch :checked-value="1" :unchecked-value="2" v-model:value="formValue.is_sms_code" />
          <span class="ml-3">（开启后，手机注册进行短信验证）</span>
        </n-form-item>

        <n-form-item label="账号格式：" path="is_all_account">
          <n-switch :checked-value="1" :unchecked-value="2" v-model:value="formValue.is_all_account" :rail-style="railStyle">
            <template #checked>
              字母+数字
            </template>
            <template #unchecked>
              全部格式
            </template>
          </n-switch>
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
import { getRegisterConfig,upRegisterConfig} from '@/api/system';
const message = useMessage();
const dialog = useDialog();
const show = ref(true)
const formValue = reactive<any>({
  check_invite_code: undefined,
  is_invite_code: undefined,
  is_verification_code: undefined,
  is_sms_code: undefined,
  is_all_account: undefined
})
function railStyle () {
  const style = {
    background : "",
    boxShadow:""
  };
  if (formValue.is_all_account==1) {
    style.background = "#2080f0";
    style.boxShadow = "0 0 0 2px #2080f040";
  } else {
    style.background = "#18a058";
    style.boxShadow = "0 0 0 2px #18a05840";
  }
  return style;
}
async function getRegisterConfigHttp() {
  try {
    const data = await getRegisterConfig()
    Object.assign(unref(formValue), data);
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
      if(params.config.is_invite_code ==2){
        params.config.check_invite_code  = 2
      }
      try {
        await upRegisterConfig(params)
        message.success('保存成功');
      } catch (error :any) {
        message.error(error.message);
      }
    },
    onNegativeClick: () => {},
  });
}
onMounted(() => {
  getRegisterConfigHttp()
})
</script>