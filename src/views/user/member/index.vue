<template>
  <n-card :bordered="false" class="proCard" >
   <n-tabs type="line" > 
     <n-tab-pane name="accountList" tab="用户列表">
       <accountList />
     </n-tab-pane>
     <n-tab-pane name="chatList" tab="用户聊天记录查询">
       <chatList/>
     </n-tab-pane>
     <!-- <n-tab-pane name="momentsList" tab="用户朋友圈动态">
       <momentsList/>
     </n-tab-pane> -->
   </n-tabs>
 </n-card>
 
 
</template>

<script lang="ts" setup>
 import accountList from './components/accountList.vue';
 import chatList from './components/chatList.vue';
//  import momentsList from './components/momentsList.vue';

</script>
