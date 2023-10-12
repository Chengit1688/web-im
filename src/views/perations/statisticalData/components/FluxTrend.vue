<template>
  <n-spin :show="showLoading">
    <div v-if="props.value?.length>0" ref="chartRef" style="height: 800px;width: 100%;" ></div>
    <n-empty  v-else size="large" description="无数据" style="height: 800px;width: 100%;justify-content: center;"></n-empty>
  </n-spin> 
</template>
<script lang="ts" setup>
import {ref, Ref, watch } from 'vue';
import { useECharts } from '@/hooks/web/useECharts';
  const props = defineProps(['time','value','max'])
  const chartRef = ref<HTMLDivElement | null>(null);
  const showLoading = ref(true)
  const { setOptions } = useECharts(chartRef as Ref<HTMLDivElement>);
  watch(
      () => props.time,() => {
        
        setOptions({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              lineStyle: {
                width: 1,
                color: '#019680',
              },
            },
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: props.time,
            splitLine: {
              show: true,
              lineStyle: {
                width: 1,
                type: 'solid',
                color: 'rgba(226,226,226,0.5)',
              },
            },
            axisTick: {
              show: false,
            },
          },
          yAxis: [
            {
              type: 'value',
              max: props.max + 5,
              splitNumber: 10,
              axisTick: {
                show: false,
              },
              splitArea: {
                show: true,
                areaStyle: {
                  color: ['rgba(255,255,255,0.2)', 'rgba(226,226,226,0.2)'],
                },
              },
            },
          ],
          grid: { left: '1%', right: '5%', top: '2%', bottom: 0, containLabel: true },
          series: [
            {
              smooth: true,
              data: props.value,
              type: 'line',
              areaStyle: {},
              itemStyle: {
                color: '#5ab1ef',
              },
            }
          ],
        });
      },
      { immediate: true }
    );
    setTimeout(() => {
      showLoading.value = false
    }, 300);
</script>
