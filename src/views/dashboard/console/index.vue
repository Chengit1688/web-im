<template>
  <div class="console">
    <!--数据卡片-->
    <n-grid cols="1 s:2 m:2 l:3 xl:3 2xl:3" responsive="screen" :x-gap="12" :y-gap="8">
      <n-grid-item v-for="(item,index) in cardList">
        <NCard :title="item.title" :segmented="{ content: true}" size="small" :bordered="false">
          <template #header-extra>
            <n-tag type="success">总</n-tag>
          </template>
          <div class="py-1 px-1 flex justify-between">
            <n-skeleton v-if="loading" :width="100" size="medium" />
            <span v-else>
              <CountTo v-if="item.value>0" :startVal="0" :endVal="item.value" class="text-3xl" />
              <span v-else class="text-3xl">{{ item.value }}</span>
            </span>
            
          </div>
        </NCard>
      </n-grid-item>
    </n-grid>
    <!--访问量 | 流量趋势-->
    <n-grid cols="1 s:1 m:1 l:2 xl:2 2xl:2" responsive="screen" :x-gap="12" :y-gap="8" class="mt-10">
      <n-grid-item>
        <NCard title="每日注册数量"  size="small" :bordered="false">
          <VisitAmount :time="register_bar_time" :value="register_bar_count"/>
        </NCard>
      </n-grid-item>
      <n-grid-item>
        <NCard title="每日登录数量"  size="small" :bordered="false">
          <VisitAmount :time="login_bar_time" :value="login_bar_count"/>
        </NCard>
      </n-grid-item>
      <n-grid-item>
        <NCard title="每日私聊消息数量"  size="small" :bordered="false">
          <VisitAmount :time="sigle_msg_bar_time" :value="sigle_msg_bar_count"/>
        </NCard>
      </n-grid-item>
      <n-grid-item>
        <NCard title="每日群聊消息数量"  size="small" :bordered="false">
          <VisitAmount :time="group_msg_bar_time" :value="group_msg_bar_count"/>
        </NCard>
      </n-grid-item>
    </n-grid>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted } from 'vue';
  import { getDashboard } from '@/api/dashboard';
  import VisitAmount from './components/VisitAmount.vue';
  import { CountTo } from '@/components/CountTo/index';
  const loading = ref(true);
  const cardList = <any>ref([
    {title:'注册数量',value:0},
    {title:'登录数量',value:0},
    {title:'在线峰值',value:0},
    {title:'私聊消息数量',value:0},
    {title:'群聊数量',value:0},  
    {title:'群聊消息数量',value:0}
  ])
  const register_bar_time = ref([])
  const register_bar_count = ref([])

  const login_bar_time = ref([])
  const login_bar_count = ref([])

  const sigle_msg_bar_time = ref([])
  const sigle_msg_bar_count = ref([])

  const group_msg_bar_time = ref([])
  const group_msg_bar_count = ref([])

  onMounted(async () => {
    const data = await getDashboard();
    cardList.value = [
      {title:'注册数量',value:data.register_num},
      {title:'登录数量',value:data.login_num},
      {title:'在线峰值',value:data.online_max},
      {title:'私聊消息数量',value:data.sigle_msg_num},
      {title:'群聊数量',value:data.group_num},
      {title:'群聊消息数量',value:data.group_msg_num}
    ]
    register_bar_time.value = data.register_bar.map(item=>item.date)
    register_bar_count.value = data.register_bar.map(item=>item.count)

    login_bar_time.value = data.login_bar.map(item=>item.date)
    login_bar_count.value = data.login_bar.map(item=>item.count)

    sigle_msg_bar_time.value = data.sigle_msg_bar.map(item=>item.date)
    sigle_msg_bar_count.value = data.sigle_msg_bar.map(item=>item.count)

    group_msg_bar_time.value = data.group_msg_bar.map(item=>item.date)
    group_msg_bar_count.value = data.group_msg_bar.map(item=>item.count)
    loading.value = false;
  });
</script>

<style lang="less" scoped></style>
