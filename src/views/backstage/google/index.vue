<template>
  <n-card :bordered="false" class="proCard">
    <n-grid cols="1" responsive="screen">
      <n-grid-item>
        <n-form :label-width="110"  label-placement="left">
          <n-form-item label="验证码开关：">
            <n-switch :value="configUration.google_code_is_open"  :checked-value="1" :unchecked-value="2" @update:value="setGooGle" >
              <template #checked>
                开
              </template>
              <template #unchecked>
                关
              </template>
            </n-switch>
            <span class="ml-5  align-middle">（说明：开-进入IM需要谷歌二次验证；关-进入IM不需要谷歌二次验证）</span>
          </n-form-item>
        </n-form>
      </n-grid-item>
      <n-grid-item>
        <n-spin :show="configUration.image?false:true">
          <n-card >
            <h3>绑定谷歌验证</h3>
            <p>开启两步验证(2FA)增加账户安全性。</p>
            <n-alert title="" type="warning" :show-icon="false">
              请从IOS的App Store或Android的Google Play下载谷歌身份验证器(Google Authenticator)应用，绑定谷歌验证。
            </n-alert>
            <div class="flex" style="align-items: center;">
              <n-card class="mt-5" style="width:400px;" :bordered="false">
                <n-image v-if="configUration.image" width="300" heiget="300" :src="'data:image/png;base64,'+configUration.image"/>
              </n-card> 
              <n-card class="mt-5 font-bold">
                <p>无法扫描二维码？</p> 
                <p>选择手动输入账户请在手机应用上输入下列明细内容</p> 
                <p>账户：{{ configUration.username }}</p> 
                <p>密钥：{{ configUration.secret }}</p> 
                <p>基于时间：是</p> 
              </n-card>
            </div>
          </n-card>
        </n-spin>
      </n-grid-item>
    </n-grid>
    
  </n-card>
  </template>
    <script lang="ts" setup >
      import {reactive, unref, onMounted} from 'vue';
      import { getConfigUration,setConfigUration} from '@/api/backstage';
      import { useDialog, useMessage } from 'naive-ui';
      import { useUserStoreWidthOut } from '@/store/modules/user';
      const userStore = useUserStoreWidthOut();
      const configUration = reactive({
        google_code_is_open:undefined,
        secret: undefined,
        username: undefined,
        image: undefined,
      });
      const message = useMessage();
      const dialog = useDialog();
      function setGooGle(value){
        const google = dialog.info({
          title: '提示',
          content: `是否${value==2?'关闭':'开启'}？`,
          positiveText: '确定',
          negativeText: '取消',
          onPositiveClick: async () => {
            google.loading = true
            let params = {
              status:value
            }
            try {
              await setConfigUration(params)
              message.success(`${value==2?'关闭':'开启'}成功`);
              configUration.google_code_is_open = value
            } catch (error:any) {
              message.error(error.message)
            }
            google.loading = false
          }
        });
      }
      
      onMounted(async () => {
        try {
          const  data  =  await getConfigUration()
          Object.assign(unref(configUration),userStore.getConfigUration,data)
        } catch (error:any) {
          message.error(error.message)
        }
      })
    </script>
