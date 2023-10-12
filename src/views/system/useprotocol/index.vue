<template>
  <n-card :bordered="false" class="proCard">
    <n-tabs type="line"  default-value="xieyi" display-directive="show">
      <n-tab-pane name="xieyi" tab="用户协议">
        <xieyi ref="xieyiSetting" />
      </n-tab-pane>
      <n-tab-pane name="yinsi" tab="隐私政策">
        <yinsi ref="yinsiSetting" />
      </n-tab-pane>
      <n-tab-pane name="guanyu" tab="关于我们">
        <guanyu ref="guanyuSetting" />
      </n-tab-pane>
    </n-tabs>
  </n-card>
</template>
<script lang="ts" setup>
  import xieyi from './components/xieyi.vue';
  import yinsi from './components/yinsi.vue';
  import guanyu from './components/guanyu.vue';
</script>
