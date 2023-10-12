<template>
  <n-modal id="basic-modal" v-model:show="showModal" :show-icon="false" preset="card" title="日志详情" style="width:40%;" @close="onCloseModal">
    <div>
      <n-row style="margin-bottom:12px;">
          <n-col :span="12">
            服务ID：{{ infoObj.service_id}}
          </n-col>
          <n-col :span="12">
            软件环境：{{ infoObj.env }}
          </n-col>
        </n-row>
        <n-row style="margin-bottom:12px;">
          <n-col :span="12">
            服务host：{{ infoObj.service_host }}
          </n-col>
          <n-col :span="12">
            服务ip：{{ infoObj.service_ip }}
          </n-col>
        </n-row>
        <n-row style="margin-bottom:12px;">
          <n-col :span="12">
            日志级别：{{ infoObj.log_level }}
          </n-col>
          <n-col :span="12" >
            日志id：{{ infoObj.operation_id }}
          </n-col>
        </n-row>
        <n-row style="margin-bottom:12px;">
          <n-col :span="12">
            请求方法：{{ infoObj.request_method }}
          </n-col>
          <n-col :span="12">
            请求地址：{{ infoObj.request_url }}
          </n-col>
        </n-row>
        <n-row style="margin-bottom:12px;">
          <n-col :span="12">
            操作人：{{ infoObj.username }}
          </n-col>
          <n-col :span="12">
            请求时间：<span v-if="infoObj.created_at">{{ formatToDateTimeHttp(infoObj.created_at)}}</span>
          </n-col>
        </n-row>
        <n-row style="margin-bottom:12px;">
          <n-col :span="24">
            用户代理：{{ infoObj.request_user_agent }}
          </n-col>
        </n-row>
        <n-row style="margin-bottom:12px;">
          <n-col :span="24">
            请求参数：{{ infoObj.request_params }}
          </n-col>
        </n-row>
        <n-row style="margin-bottom:12px;">
          <n-col :span="24">
            日志数据：{{ infoObj.log_remark }}
          </n-col>
        </n-row>
    </div>
  </n-modal>
</template>
<script lang="ts" setup >
  import {ref} from 'vue';
  import {formatToDateTime} from "@/utils/dateUtil"
  const infoObj = <any>ref({})
  const showModal = ref(false)
  async function openModal (row){
    showModal.value = true
    infoObj.value = row
  }
  function formatToDateTimeHttp(time){
    return formatToDateTime(new Date(time),'yyyy-MM-dd HH:mm:ss')
  }
  function onCloseModal(){
    infoObj.value = {}
  }
  defineExpose({
    openModal
  })
</script>