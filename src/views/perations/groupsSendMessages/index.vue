<template>
   <n-card :bordered="false" class="proCard">
    <n-tabs type="line" >
      <n-tab-pane name="sendMessage" tab="消息群发">
        <sendMessage />
      </n-tab-pane>
      <n-tab-pane name="messageRecord" tab="群发记录">
        <messageRecord/>
      </n-tab-pane>
    </n-tabs>
  </n-card>
  
  
</template>

<script lang="ts" setup>
  import sendMessage from './components/sendMessage.vue';
  import messageRecord from './components/messageRecord.vue';
</script>
