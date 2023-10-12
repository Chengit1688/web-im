<template>
  <n-card :bordered="false" class="proCard">
    <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset" :show-advanced-button="false">
      <template #statusSlot="{ model, field }" >
        <n-input v-model:value="model[field]" />
      </template>
    </BasicForm>

    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.id"
      ref="actionRef"
      :actionColumn="actionColumn"
    />
  </n-card>
  <logDetails ref="logDetailsShow" :info="info"/>
</template>

<script lang="ts" setup>
  import { h, reactive, ref, unref } from 'vue';
  import { BasicTable} from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  
  import logDetails from "./dialog/index.vue"
  import {columns} from "./columns"
  const logDetailsShow = ref()
  const actionColumn = [
    {
      index:4,
      title: '信息',
      dataIndex: 'info',
      key: 'info',
      align: 'center',
      render (row) {
        return h(
          'span',
          {
            style:"cursor:pointer;",
            onClick: () => showModel(row.info,'信息详情')
          },
          { default: () => row.info }
        )
      }
    },
    {
      index:5,
      title: '额外信息',
      key: 'extra',
      dataIndex: 'extra',
      align: 'center',
      render (row) {
        return h(
          'span',
          {
            style:"cursor:pointer;",
            onClick: () => showModel(row.extra,'额外信息详情')
          },
          { default: () => row.extra }
        )
      }
    }
  ]
  const schemas: FormSchema[] = [ // BasicForm 配置
    {
      field: 'user_id',
      component: 'NInput',
      label: '',
      giProps: { span: '4'},
      componentProps: {
        placeholder: '请输入姓名',
      },
    },
    {
      field: 'mac_type',
      component: 'NSelect',
      label: '',
      giProps: { span: '4'},
      componentProps: {
        placeholder: '请选择登录类型',
        options: [
          {
            label: 'WEB',
            value: 'web',
          },
          {
            label: 'IOS',
            value: 'ios',
          },
          {
            label: '安卓',
            value: 'android',
          },
        ]
      },
    },
    {
      field: 'time',
      component: 'NDatePicker',
      label: '',
      defaultValue: null,
      giProps: { span: '6'},
      componentProps: {
        type: 'datetimerange',
        clearable: false,
        defaultTime:['00:00:00','23:59:59'],
      },
    }
  ];
  const [register, {}] = useForm({ 
    gridProps: {  xGap: '12'},
    labelWidth: 80,
    schemas,

  });
  const info = ref({
    title:"",
    message:""
  });
  const actionRef = ref(); // 表格ref
  const formParams = reactive({ // form 表单
    user_id: '',
    mac_type:'',
    time: [],
  });
  
  const loadDataTable = async (res) => { // table 请求配置
    let params = {
      ...formParams,
      ...res,
    }
    if(params.time&&params.time.length>0){
      params.stime = parseInt(params.time[0]/1000)
      params.etime = parseInt(params.time[1]/1000)
    }
    delete params.time
  };
  function handleSubmit(values: Recordable) { // 搜索
    Object.assign(unref(formParams), values)
    actionRef.value.reload({page: 1, page_size: 20})
  }
  function handleReset(values: Recordable) { // 重置 
    for(let i in formParams){
      formParams[i] = values[i] || undefined
    }
    actionRef.value.reload({page: 1, page_size: 20})
  }
  function showModel (value,msg) {
    info.value.title = msg
    info.value.message = value 
    logDetailsShow.value.openModal()
  }
</script>
