<template>
  <n-card :bordered="false" class="proCard">
    <BasicForm :schemas="schemas" :gridProps="{ xGap: 12 }" @submit="handleSubmit" @reset="handleReset"  :show-advanced-button="false"  />
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.id"
      ref="actionRef"
      :actionColumn="actionColumn"
    />
    <infoModal ref="infoModalShow"/>
  </n-card>
</template>

<script lang="ts" setup>
  import {h, reactive, ref, unref } from 'vue';
  import { BasicTable, TableAction} from '@/components/Table';
  import { getOperateLog} from '@/api/log';
  import {columns} from "./columns"
  import { useMessage } from 'naive-ui';
  import { FormSchema, BasicForm } from '@/components/Form';
  import infoModal from './dialog/info.vue';
  const infoModalShow = ref();
  const message = useMessage();
  const actionRef = ref(); // 表格ref
  const schemas: FormSchema[] = [ // BasicForm 配置
    {
      field: 'search',
      component: 'NInput',
      label: '',
      giProps: { span: '4'},
      componentProps: {
        placeholder: '请输入服务ID/日志ID/请求路径',
      },
    },  
    {
      field: 'time',
      component: 'NDatePicker',
      label: '',
      defaultValue: null,
      giProps: { span: '8'},
      componentProps: {
        placeholder: '请选择注册时间',
        type: 'datetimerange',
        clearable: false,
        defaultTime:['00:00:00','23:59:59'],
      },
    },
  ];
  const actionColumn = [
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      width: 150,
      render(record) {
        return h(TableAction as any, {
          style: 'text',
          actions: createActions(record),
        });
      },
    },
  ];
  function createActions(record) {
    return [
      {
        label: '查看',
        type: 'primary',
        onClick: showModal.bind(null, record),
        // 根据业务控制是否显示 isShow 和 auth 是并且关系
        ifShow: () => {
          return true;
        },
      }
    ];
  }
  // 详细弹窗
  function showModal(row) {
    infoModalShow.value.openModal(row);
  }
  const formParams = reactive({ // form 表单
    search: undefined,
    time: [],
  });
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
  const loadDataTable =  async (res) => { // table 请求配置
    let params = {
      ...formParams,
      ...res,
    }
    if(params.time&&params.time.length>0){
      params.created_time_start = parseInt(params.time[0])
      params.created_time_end = parseInt(params.time[1])
    }
    delete params.time
    try {
      return await getOperateLog(params);
    } catch (error:any) {
      message.error(error.message)
    }
   
  };
</script>
