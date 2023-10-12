<template>
  <n-card :bordered="false" class="proCard">
    <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset" :show-advanced-button="false" />
    <BasicTable :columns="groupColumns" :request="loadDataTable" :row-key="(row) => row.id" ref="actionRef" :actionColumn="actionColumn"/>
  </n-card>
 </template>
 
 <script lang="ts" setup>
  import {h, reactive, ref, unref } from 'vue';
  import { BasicTable, TableAction} from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { getDefaultGroupList,upGroup} from '@/api/perations/index';
  import {groupColumns} from "./../columns"
  import { useMessage, useDialog } from 'naive-ui';
  const message = useMessage();
  const dialog = useDialog();
  const actionColumn = [
  {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      width:400,
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
        label: '取消默认群聊',
        type: 'error',
        onClick: handleCancel.bind(null, record),
        ifShow: () => {
          return true;
        },
      },
    ];
  }
  const schemas: FormSchema[] = [ // BasicForm 配置
    {
      field: 'group_name',
      component: 'NInput',
      label: '',
      giProps: { span: '4'},
      componentProps: {
        placeholder: '请输入群名称',
      },
    },
    {
      field: 'owner_name',
      component: 'NInput',
      label: '',
      giProps: { span: '4'},
      componentProps: {
        placeholder: '请输入群主名称',
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
    group_name:undefined,
    owner_name:undefined,
    is_default:1,

  });
   
  const loadDataTable = async (res) => { // table 请求配置
    let params = {
      ...formParams,
      ...res,
    }
    return await getDefaultGroupList(params);
  };
  function handleCancel(row) { // 取消默认群聊
    dialog.info({
      title: '提示',
      content: `是否取消该群的默认群聊资格？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        let params:any = {
          group_id:row.group_id,
          is_default:2
        }
        try {
          await upGroup(params)
          message.success(`取消成功`);
          actionRef.value.reload({page: 1, page_size: 20})
        } catch (error:any) {
          message.error(error.message)
        } 
      }
    });
  }
  function handleSubmit(values: Recordable) { // 搜索
    Object.assign(unref(formParams), values)
    actionRef.value.reload({page: 1, page_size: 20})
  }
  function handleReset(values: Recordable) { // 重置
    for(let i in formParams){
      formParams[i] = values[i] || undefined
    }
    formParams.is_default = 1
    actionRef.value.reload({page: 1, page_size: 20})
  }
 </script>
 