<template>
  <n-card :bordered="false" class="proCard">
    <n-tabs type="line"  default-value="jiguang" display-directive="show">
      <n-tab-pane name="jiguang" tab="极光推送">
        <jiguang ref="jiguangSetting" />
      </n-tab-pane>
      <!-- <n-tab-pane name="feihu" tab="飞虎推送">
        <feihu ref="feihuSetting" />
      </n-tab-pane> -->
    </n-tabs>
  </n-card>
</template>
<script lang="ts" setup>
  import jiguang from './components/jiguang.vue';
  import feihu from './components/feihu.vue';
</script>
