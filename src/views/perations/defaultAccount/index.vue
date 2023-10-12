<template>
   <n-card :bordered="false" class="proCard">
    <n-tabs type="line" >
      <n-tab-pane name="defaultAccount" tab="默认好友">
        <defaultAccount />
      </n-tab-pane>
      <n-tab-pane name="defaultGroup" tab="默认群聊">
        <defaultGroup/>
      </n-tab-pane>
    </n-tabs>
  </n-card>
  
  
</template>

<script lang="ts" setup>
  import defaultAccount from './components/defaultAccount.vue';
  import defaultGroup from './components/defaultGroup.vue';
</script>
