<template>
  <n-card :bordered="false" class="proCard">
    <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset" :show-advanced-button="false" />
    <BasicTable :columns="accountColumns" :request="loadDataTable" :row-key="(row) => row.id" ref="actionRef" :actionColumn="actionColumn">
      <template #tableTitle>
        <n-button type="primary" @click="handleAdd">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          添加
        </n-button>
      </template>
    </BasicTable>
    <addModal ref="addModalShow" @childToParent="childToParent"/>
    <editModal ref="editModalShow" @childToParent="childToParent"/>
  </n-card>
 </template>
 
 <script lang="ts" setup>
  import { h, reactive, ref, unref } from 'vue';
  import { BasicTable, TableAction} from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { getDefaultAccountList,deDefaultAccount} from '@/api/perations/index';
  import {accountColumns} from "./../columns"
  import { DeleteOutlined, EditOutlined ,PlusOutlined} from '@vicons/antd';
  import { useDialog, useMessage } from 'naive-ui';
  import addModal from "./../dialog/add.vue"
  import editModal from "./../dialog/edit.vue"
  const message = useMessage();
  const dialog = useDialog();
  const editModalShow = ref()
  const addModalShow = ref()
  const actionColumn = [
  {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
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
        color: 'red',
        icon: DeleteOutlined,
        onClick: handleDelete.bind(null, record),
        ifShow: () => {
          return record.role_key!='admin';
        },
      },
      {
        label: '编辑',
        type: 'primary',
        icon: EditOutlined,
        onClick: handleEdit.bind(null, record),
        ifShow: () => {
          return record.role_key!='admin';
        },
      },
    ];
  }
  const schemas: FormSchema[] = [ // BasicForm 配置
  {
      field: 'user_id',
      component: 'NInput',
      label: '',
      giProps: { span: '4'},
      componentProps: {
        placeholder: '请输入用户ID',
      },
    },
    {
      field: 'nick_name',
      component: 'NInput',
      label: '',
      giProps: { span: '4'},
      componentProps: {
        placeholder: '请输入用户昵称',
      },
    },
    {
      field: 'remarks',
      component: 'NInput',
      label: '',
      giProps: { span: '4'},
      componentProps: {
        placeholder: '请输入用户备注',
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
    remarks: undefined,
    user_id:undefined,
    nick_name:undefined,
  });
   
  const loadDataTable = async (res) => { // table 请求配置
    let params = {
      ...formParams,
      ...res,
    }
    try {
      return await getDefaultAccountList(params)
    } catch (error:any) {
      message.error(error.message)
    }
  };
  // 添加
  function handleAdd(){
    addModalShow.value.openModal()
  }
  // 编辑
  function handleEdit(row){
    editModalShow.value.openModal(row)
  }
  // 删除
  function handleDelete(record) {
    dialog.info({
      title: '提示',
      content: `您想删除此默认账号`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        let params = {
          id:record.id
        }
        try {
          await deDefaultAccount(params)
          message.success('删除成功');
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
    actionRef.value.reload({page: 1, page_size: 20})
  }
  const childToParent = ()=>{
    actionRef.value.reload({page: 1, page_size: 20})
  }
 </script>
 