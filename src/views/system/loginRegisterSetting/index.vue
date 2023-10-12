<template>
  <n-card :bordered="false" class="proCard">
    <n-tabs type="line"  default-value="login" display-directive="show">
      <n-tab-pane name="login" tab="登录方式设置">
        <LoginSetting ref="loginSetting" />
      </n-tab-pane>
      <n-tab-pane name="register" tab="注册方式设置">
        <RegisterSetting ref="registerSetting" />
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>
<script lang="ts" setup>
  import LoginSetting from './components/LoginSetting.vue';
  import RegisterSetting from './components/RegisterSetting.vue';
</script>
