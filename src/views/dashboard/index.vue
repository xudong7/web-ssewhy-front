<script setup>
import echarts from "@/utils/echarts";
import { onMounted, ref } from "vue";

const chartRef = ref(null);
let echartClient = null;
onMounted(() => {
  initChart();
});
function initChart() {
  echartClient = echarts.init(chartRef.value);
  echartClient.setOption({
    tooltip: {},
    xAxis: {
      data: ["衬衫", "羊毛衫", "雪纺衫", "裤子", "高跟鞋", "袜子"],
    },
    yAxis: {},
    series: [
      {
        name: "销量",
        type: "bar",
        data: [5, 20, 36, 10, 10, 20],
      },
    ],
  });
}
</script>
<template>
  <div class="chart-box" ref="chartRef"></div>
</template>

<style scoped lang="scss">
.chart-box {
  width: 600px;
  height: 400px;
}
</style>
