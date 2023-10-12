<template>
  <n-card :bordered="false" class="proCard">
    <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset" :show-advanced-button="false"/>

    <BasicTable
      :columns="momentsListColumns"
      :request="loadDataTable"
      :row-key="(row) => row.id"
      ref="actionRef"
      :actionColumn="actionColumn"
    >
    </BasicTable>
    <addModal ref="addModalShow" @childToParent="childToParent"/>
    <infoModal ref="infoModalShow" @childToParent="childToParent"/>
  </n-card>
</template>

<script lang="ts" setup>
  import { h, reactive, ref, unref } from 'vue';
  import { BasicTable, TableAction} from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { getUserList,freezeUser,unfreezeUser} from '@/api/user';
  import { NSwitch } from "naive-ui";
  import {momentsListColumns} from "../columns"
  import { useDialog, useMessage } from 'naive-ui';
  import {PlusOutlined, DeleteOutlined, EditOutlined } from '@vicons/antd';


  const message = useMessage();
  const dialog = useDialog();
  const actionColumn = [
  {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      width:150,
      render(record) {
        return h(TableAction as any, {
          style: 'text',
          actions: createActions(record),
        });
      },
    },
  ]
  function createActions(record) {
    return [
     
      {
        label: '删除',
        type: 'error',
        ifShow: () => {
          return true;
        },
      },
    ];
  }
  const schemas: FormSchema[] = [ // BasicForm 配置
    {
      field: 'account',
      component: 'NInput',
      label: '',
      giProps: { span: '4'},
      componentProps: {
        placeholder: '请输入用户账号',
      },
    },
    {
      field: 'nick_name',
      component: 'NInput',
      label: '',
      giProps: { span: '4'},
      componentProps: {
        placeholder: '请输入动态内容',
      },
    },
    {
      field: 'time',
      component: 'NDatePicker',
      label: '',
      defaultValue: [new Date().setHours(0,0,0,0)- 7 * 24* 60 * 60 * 1000,new Date().setHours(23,59,59,0)],
      giProps: { span: '8'},
      componentProps: {
        placeholder: '请选择发送时间',
        type: 'datetimerange',
        clearable: false,
        defaultTime:['00:00:00','23:59:59'],
      },
    },
  ];
  const [register, {}] = useForm({ 
    gridProps: {  xGap: '12'},
    labelWidth: 80,
    schemas,
  });
  const actionRef = ref(); // 表格ref
  const formParams = reactive({ // form 表单
    user_id: undefined,
    mac_type:undefined,
    nick_name: undefined,
    account: undefined,
    phone_number: undefined,
    status: undefined, // Number 状态 1正常 2冻结
    login_ip: undefined,
    gender: undefined, //用户性别 1男 2女
    invite_code: undefined,
    time: [new Date().setHours(0,0,0,0)- 7 * 24* 60 * 60 * 1000,new Date().setHours(23,59,59,0)],
  });
  
  const loadDataTable = async (res) => { // table 请求配置
    let params = {
      ...formParams,
      ...res,
    }
    params.register_time_start = parseInt(params.time[0]/1000)
    params.register_time_end = parseInt(params.time[1]/1000)
    delete params.time
    // return await getUserList(params);
  };
  const childToParent = ()=>{
    actionRef.value.reload({page: 1, page_size: 20})
  }
  function handleSubmit(values: Recordable) { // 搜索
    Object.assign(unref(formParams), values)
    actionRef.value.reload({page: 1, show: 20})
  }
  function handleReset(values: Recordable) { // 重置 
    for(let i in formParams){
      formParams[i] = values[i] || undefined
    }
    actionRef.value.reload({page: 1, show: 20})
  }
</script>
