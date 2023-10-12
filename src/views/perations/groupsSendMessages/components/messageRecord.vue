<template>
  <n-card :bordered="false" class="proCard">
    <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset" :show-advanced-button="false" />
    <BasicTable :columns="columns" :request="loadDataTable" :row-key="(row) => row.id" ref="actionRef"/>
  </n-card>
 </template>
 
 <script lang="ts" setup>
  import { reactive, ref, unref } from 'vue';
  import { BasicTable} from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { getMessageRecords} from '@/api/perations/index';
  import {columns} from "../columns"
  import { searchUser } from '@/api/user';
import { useMessage } from 'naive-ui';
  const usrerOptions = ref([])
  const message = useMessage();
  const schemas: FormSchema[] = [ // BasicForm 配置
    {
      field: 'content',
      component: 'NInput',
      label: '',
      giProps: { span: '4'},
      componentProps: {
        placeholder: '请输入消息内容',
      },
    },
    {
      field: 'sender_id',
      component: 'NSelect',
      label: '',
      giProps: { span: '6'},
      componentProps: {
        placeholder: '请输入发送人ID/昵称/账号/手机号',
        remote:true,
        clearable:true,
        filterable:true,
        options: usrerOptions,
        labelField:'nick_name',
        valueField:'user_id',
        onSearch: async (e: any) => {
          try {
            const data = await searchUser({search:e})
            usrerOptions.value =data.list
          } catch (error:any) {
            message.error(error.message)
          }
        },
      },
    },
    // {
    //   field: 'sender_nickname',
    //   component: 'NInput',
    //   label: '',
    //   giProps: { span: '4'},
    //   componentProps: {
    //     placeholder: '请输入发送者昵称',
    //   },
    // },
    {
      field: 'operate',
      component: 'NInput',
      label: '',
      giProps: { span: '4'},
      componentProps: {
        placeholder: '请输入操作者',
      },
    },
    {
      field: 'time',
      component: 'NDatePicker',
      label: '',
      giProps: { span: '8'},
      defaultValue: null,
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
    sender_id:undefined,
    sender_nickname:undefined,
    operate:undefined,
    content:undefined,
    time: [],
  });
   
  const loadDataTable = async (res) => { // table 请求配置
    let params = {
      ...formParams,
      ...res,
    }
    if(params.time&&params.time.length>0){
      params.operate_time_start = parseInt(params.time[0]/1000)
      params.operate_time_end = parseInt(params.time[1]/1000)
    }
    delete params.time
    return await getMessageRecords(params);
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
 