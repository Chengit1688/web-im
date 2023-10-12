<template>
  <div ref="chartRef" style="height: 280px; width:100%;"></div>
</template>
<script lang="ts" setup>
  import {  ref, Ref, watch } from 'vue';
  import { useECharts } from '@/hooks/web/useECharts';
  const props = defineProps(['time','value'])
  const chartRef = ref<HTMLDivElement | null>(null);
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
      grid: { left: '1%', right: '5%', top: '2  %', bottom: 0, containLabel: true },
      xAxis: {
        type: 'category',
        data: props.time,
      },
      yAxis: {
        type: 'value',
        max: 8000,
        splitNumber: 4,
      },
      series: [
        {
          data: props.value,
          type: 'bar',
          barMaxWidth: 80,
        },
      ],
    });
    }
  );
</script>
