<template>
  <n-card :bordered="false" class="proCard">
    <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset" :show-advanced-button="false"/>
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.id"
      ref="actionRef"
    />
  </n-card>
</template>

<script lang="ts" setup>
  import { reactive, ref, unref } from 'vue';
  import { BasicTable} from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import {getSuggestionRecords} from '@/api/perations'
  import {columns} from "./columns"
  const schemas: FormSchema[] = [ // BasicForm 配置
    {
      field: 'user_id',
      component: 'NInput',
      label: '',
      giProps: { span: '3'},
      componentProps: {
        placeholder: '请输入用户ID',
      },
    },
    {
      field: 'nick_name',
      component: 'NInput',
      label: '',
      giProps: { span: '3'},
      componentProps: {
        placeholder: '请输入用户昵称',
      },
    },
    {
      field: 'content',
      component: 'NInput',
      label: '',
      giProps: { span: '3'},
      componentProps: {
        placeholder: '请输入内容',
      },
    },
    {
      field: 'brand',
      component: 'NInput',
      label: '',
      giProps: { span: '3'},
      componentProps: {
        placeholder: '请输入品牌',
      },
    },
    {
      field: 'platform',
      component: 'NSelect',
      label: '',
      giProps: { span: '3'},
      componentProps: {
        placeholder: '请选择客户端',
        options: [
          {
            label: 'WEB',
            value: 5,
          },
          {
            label: 'IOS',
            value: 1,
          },
          {
            label: 'Android',
            value: 2,
          },
        ]
      },
    },
    {
      field: 'time',
      component: 'NDatePicker',
      label: '',
      defaultValue: null,
      giProps: { span: '9'},
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
  const actionRef = ref(); // 表格ref
  const formParams = reactive({ // form 表单
    nick_name: undefined,
    user_id: undefined,
    content: undefined,
    brand: undefined,
    platform: undefined,
    time: [],
  });
  
  const loadDataTable = async (res) => { // table 请求配置
    let params = {
      ...formParams,
      ...res,
    }
    if(params.time&&params.time.length>0){
      params.begin_date = parseInt(params.time[0]/1000)
      params.end_date = parseInt(params.time[1]/1000)
    }
    delete params.time
    return await getSuggestionRecords(params)
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
</script>
