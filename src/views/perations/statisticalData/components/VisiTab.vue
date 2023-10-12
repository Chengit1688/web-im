<template>
  <div class="mt-4">
    <NRow :gutter="24">
      <NCol :span="24">
        <n-card content-style="padding: 0;" :bordered="false">
          <BasicForm @register="register" class="pt-5 ml-2 pr-32" :show-advanced-button="false" @submit="handleSubmit" @reset="handleReset"/>
        </n-card>
        <n-card content-style="padding: 0;" :bordered="false">
          <n-tabs type="line" size="large" :tabs-padding="20" pane-style="padding: 20px;">
            <n-tab-pane name="每日在线人数统计">
              <FluxTrend :time="onlineTime" :value="onlineValue" :max="onlineMax" v-if="isShowOnline"/>
            </n-tab-pane>
            <n-tab-pane name="每日注册人数统计">
              <FluxTrend :time="registerTime" :value="registerValue" :max="registerMax"  v-if="isShowRegister"/>
            </n-tab-pane>
            <n-tab-pane name="每日所有群消息统计">
              <FluxTrend :time="groupTime" :value="groupValue" :max="groupMax"  v-if="isShowGroup"/>
            </n-tab-pane>
            <n-tab-pane name="每日二人消息数量统计">
              <FluxTrend :time="singleTime" :value="singleValue" :max="singleMax"  v-if="isShowSingle"/>
            </n-tab-pane>
          </n-tabs>
        </n-card>
      </NCol>
    </NRow>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, reactive, ref ,nextTick} from 'vue';
  import {useMessage } from 'naive-ui';
  import FluxTrend from './FluxTrend.vue';
  import { getOnlineStatistics,getRegisterStatistics,getSingleStatistics,getGroupStatistics} from '@/api/perations';
  import { FormSchema, useForm } from '@/components/Form';
  const onlineTime = ref(null)
  const onlineValue = ref(null)
  const registerTime = ref(null)
  const registerValue = ref(null)
  const singleTime = ref(null)
  const singleValue = ref(null)
  const groupTime = ref(null)
  const groupValue = ref(null)
  const isShowOnline = ref(true)
  const isShowRegister = ref(true)
  const isShowSingle = ref(true)
  const isShowGroup = ref(true)
  const onlineMax = ref(0)
  const registerMax = ref(0)
  const groupMax = ref(0)
  const singleMax = ref(0)
  const message = useMessage();
  const formParams = reactive({
    time: [
      new Date().setHours(0, 0, 0, 0) - 7 * 24 * 60 * 60 * 1000,
      new Date().setHours(23, 59, 59, 0),
    ],
  });
  const schemas: FormSchema[] = [
    {
      field: 'time',
      component: 'NDatePicker',
      label: '',
      defaultValue: [
        new Date().setHours(0, 0, 0, 0) - 7 * 24 * 60 * 60 * 1000,
        new Date().setHours(23, 59, 59, 0),
      ],
      giProps: { span: '8' },
      componentProps: {
        placeholder: '请选择注册时间',
        type: 'datetimerange',
        clearable: false,
        defaultTime: ['00:00:00', '23:59:59'],
      },
    }
  ];
  const [register, {}] = useForm({
    gridProps: { xGap: '12' },
    labelWidth: 80,
    schemas,
  });
  // 在数组中查找最大值
  function arrayMax(arrs) {
    var max = arrs[0];
    for(var i = 1,ilen = arrs.length; i < ilen; i++) {
        if(arrs[i] > max) {
            max = arrs[i];
        }
    }
    return max;
  }
  async function handleSubmit(values: Recordable) {
    // 搜索
    await getOnlineStatisticsHttp(values);
    await getRegisterStatisticsHttp(values);
    await getGroupStatisticsHttp(values);
    await getSingleStatisticsHttp(values);
  }
  async function handleReset(values: Recordable) {
    // 重置
    for (let i in formParams) {
      formParams[i] = values[i] || undefined;
    }

    await getOnlineStatisticsHttp(values);
    await getRegisterStatisticsHttp(values);
    await getGroupStatisticsHttp(values);
    await getSingleStatisticsHttp(values);
  }
  async function getOnlineStatisticsHttp(values){
    try {
      let params = {...values};
      params.begin_date = parseInt(params.time[0] / 1000);
      params.end_date = parseInt(params.time[1] / 1000);
      delete params.time;
      const onlineData = await getOnlineStatistics(params)
      // 在线
      if(onlineData){
        onlineTime.value = onlineData.map(item=>item.date)
        onlineValue.value = onlineData.map(item=>item.count)
        onlineMax.value = arrayMax(onlineValue.value)
        isShowOnline.value = false
        nextTick(() => {
          isShowOnline.value = true
        });
      }else{
        onlineTime.value = null
        onlineValue.value = null
      }
    } catch (error:any) {
      message.error(error.message)
    }
  }
  async function getRegisterStatisticsHttp(values){
    try {
      let params = {...values};
      params.begin_date = parseInt(params.time[0] / 1000);
      params.end_date = parseInt(params.time[1] / 1000);
      delete params.time;
      const registerData = await getRegisterStatistics(params)
      //注册
      if(registerData.list){
        registerTime.value = registerData.list.map(item=>item.daily)
        registerValue.value = registerData.list.map(item=>item.count)
        registerMax.value = arrayMax(registerValue.value)
        isShowRegister.value = false
        nextTick(() => {
          isShowRegister.value = true
        });
      }else{
        registerTime.value = null
        registerValue.value = null
      }
    } catch (error:any) {
      message.error(error.message)
    }
  }
  async function getGroupStatisticsHttp(values){
    try {
      let params = {...values};
      params.begin_date = parseInt(params.time[0] / 1000);
      params.end_date = parseInt(params.time[1] / 1000);
      delete params.time;
      const groupData = await getGroupStatistics(params)
      //群聊
      if(groupData){
        groupTime.value = groupData.map(item=>item.date)
        groupValue.value = groupData.map(item=>item.count)
        groupMax.value = arrayMax(groupValue.value)
        isShowGroup.value = false
        nextTick(() => {
          isShowGroup.value = true
        });
      }else{
        groupTime.value = null
        groupValue.value = null
      }
    } catch (error:any) {
      message.error(error.message)
    }
  }
  async function getSingleStatisticsHttp(values){
    try {
      let params = {...values};
      params.begin_date = parseInt(params.time[0] / 1000);
      params.end_date = parseInt(params.time[1] / 1000);
      delete params.time;
      const singleData = await getSingleStatistics(params)
      // 单聊
      if(singleData){
        singleTime.value = singleData.map(item=>item.date)
        singleValue.value = singleData.map(item=>item.count)
        singleMax.value = arrayMax(singleValue.value)
        isShowSingle.value = false
        nextTick(() => {
          isShowSingle.value = true
        });
      }else{
        singleTime.value = null
        singleValue.value = null
      }
    } catch (error:any) {
      message.error(error.message)
    }
  }
  onMounted(async () => {
    await getOnlineStatisticsHttp(formParams);
    await getRegisterStatisticsHttp(formParams);
    await getGroupStatisticsHttp(formParams);
    await getSingleStatisticsHttp(formParams);
  })
</script>
