<template>
  <n-card :bordered="false" class="proCard">
    <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset"  :show-advanced-button="true"  />
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.id"
      ref="actionRef"
      :actionColumn="actionColumn"
      @update:checked-row-keys="handleCheck"
    >
      <template #tableTitle>
        <n-button type="primary" @click="showAddModal" class="mr-5">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          添加
        </n-button>
        <n-button type="error" @click="batchDelete" class="mr-5" :disabled="rowKeysId.length==0">
          <template #icon>
            <n-icon>
              <DeleteOutlined />
            </n-icon>
          </template>
          批量删除
        </n-button>
      </template>
    </BasicTable>
    <addModal ref="addModalShow" @childToParent="childToParent"/>
    <editModal ref="editModalShow" @childToParent="childToParent"/>
  </n-card>
</template>

<script lang="ts" setup>
  import { h, reactive, ref, unref } from 'vue';
  import { BasicTable ,TableAction} from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { getInviteList,upInviteCodeStatus,deleteInviteCode} from '@/api/system';
  import { NSwitch } from "naive-ui";
  import { useDialog, useMessage } from 'naive-ui';
  import {columns} from "./columns"
  import {PlusOutlined, DeleteOutlined, EditOutlined } from '@vicons/antd';
  import addModal from "./dialog/add.vue"
  import editModal from "./dialog/edit.vue"
  const message = useMessage();
  const dialog = useDialog();
  const actionRef = ref(); // 表格ref
  const addModalShow = ref()
  const editModalShow = ref()
  const rowKeysId = ref([])
  const formParams = reactive({ // form 表单
    invite_code: undefined,
    default_friend:undefined,
    default_group:undefined,
    remarks:undefined,
    operation_user:undefined,
    time: [],
    status:undefined,
  });
  const actionColumn = [
    {
      index:"0",
      type: 'selection',
      width:30,
      key: 'index',
      dataIndex: 'index',
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      width:200,
      render(record) {
        return h(TableAction as any, {
          style: 'text',
          actions: createActions(record),
        });
      },
    },
    {
      index:4,
      title: '轮流添加好友/群',
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      width:200,
      ellipsis:false,
      render(row) {
        return h(NSwitch, {
          checkedValue: 1,
          uncheckedValue: 2,
          value: row.is_open_turn,
          // 监测switch的改变
          onUpdateValue: (value) => upTurn(value,row)
        })
      },
    },
    {
      index:5,
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      width:80,
      ellipsis:false,
      render(row) {
        return h(NSwitch, {
          checkedValue: 1,
          uncheckedValue: 2,
          value: row.status,
          // 监测switch的改变
          onUpdateValue: (value) => upStatus(value,row)
        })
      },
    },
  ]
  function createActions(record) {
    return [
      // {
      //   label: '删除',
      //   type: 'error',
      //   color: 'red',
      //   icon: DeleteOutlined,
      //   onClick: handleDelete.bind(null, record),
      //   // 根据业务控制是否显示 isShow 和 auth 是并且关系
      //   ifShow: () => {
      //     return true;
      //   },
      // },
      {
        label: '编辑',
        type: 'primary',
        icon: EditOutlined,
        onClick: handleEdit.bind(null, record),
        ifShow: () => {
          return true;
        },
      },
    ];
  }
  const schemas: FormSchema[] = [ // BasicForm 配置
    {
      field: 'invite_code',
      component: 'NInput',
      label: '',
      giProps: { span: '6'},
      componentProps: {
        placeholder: '请输入邀请码',
      },
    },
    {
      field: 'default_friend',
      component: 'NInput',
      label: '',
      giProps: { span: '6'},
      componentProps: {
        placeholder: '请输入好友ID',
      },
    },
    {
      field: 'time',
      component: 'NDatePicker',
      label: '',
      giProps: { span: '12'},
      defaultValue:null,
      componentProps: {
        type: 'datetimerange',
        clearable: false,
        defaultTime:['00:00:00','23:59:59'],
      },
    },
    {
      field: 'default_group',
      component: 'NInput',
      label: '',
      giProps: { span: '6'},
      componentProps: {
        placeholder: '请输入群ID',
      },
    },
    {
      field: 'remarks',
      component: 'NInput',
      label: '',
      giProps: { span: '6'},
      componentProps: {
        placeholder: '请输入备注',
      },
    },
    {
      field: 'operation_user',
      component: 'NInput',
      label: '',
      giProps: { span: '6'},
      componentProps: {
        placeholder: '请输入操作者',
      },
    },
    {
      field: 'status',
      component: 'NSelect',
      label: '',
      giProps: { span: '6'},
      componentProps: {
        placeholder: '请选择状态',
        options: [
          {
            label: '启用',
            value: 1,
          },
          {
            label: '禁用',
            value: 2,
          },
        ]
      },
    },
  ];
  const [register, {}] = useForm({ 
    gridProps: {  xGap: '12'},
    labelWidth: 80,
    schemas,
  });
  const loadDataTable = async (res) => { // table 请求配置
    let params = {
      ...res,
      ...formParams
    }
    if(params.time&&params.time.length>0){
      params.begin_date = parseInt(params.time[0]/1000)
      params.end_date = parseInt(params.time[1]/1000)
    }
    delete params.time
    try {
      return await getInviteList(params)
    } catch (error:any) {
      message.error(error.message)
    }
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
  const childToParent = ()=>{
    actionRef.value.reload({page: 1, page_size: 20})
  }
  function handleDelete(row) {
    deleteHttp(row)
  }
  function deleteHttp(values,isAll=''){
    dialog.info({
      title: '提示',
      content: `您想删除${isAll?'这' + values.length + '个':'此'}邀请码？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        let params = {
          ids:isAll?values:[values.id]
        }
        try {
          await deleteInviteCode(params)
          message.success('删除成功');
          actionRef.value.reload()
        } catch (error:any) {
          message.error(error.message)
        }
      },
      onNegativeClick: () => {},
    });
  }
  // 新增
  function showAddModal() {
    addModalShow.value.openModal()
  }
  // 编辑
  function handleEdit(record) {
    editModalShow.value.openModal(record)
  }
  // 状态
  function upTurn(value,row){
    dialog.info({
      title: '提示',
      content: `您想${value==2?'禁用':'启用'}轮流添加好友/群？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        let params = {
          status:row.status,
          is_open_turn:value,
          id:row.id
        }
        try {
          await upInviteCodeStatus(params)
          row.is_open_turn = value
          message.success(`${value==2?'禁用':'启用'}成功`);
        } catch (error:any) {
          message.error(error.message)
        } 
      }
    });
  }
  // 状态
  function upStatus(value,row){
    dialog.info({
      title: '提示',
      content: `您想${value==2?'禁用':'启用'}此邀请码吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        let params = {
          is_open_turn:row.is_open_turn,
          status:value,
          id:row.id
        }
        try {
          await upInviteCodeStatus(params)
          row.status = value
          message.success(`${value==2?'禁用':'启用'}成功`);
        } catch (error:any) {
          message.error(error.message)
        } 
      }
    });
  }
  function handleCheck (rowKeys) {
    rowKeysId.value = rowKeys
  }
  function batchDelete(){
    deleteHttp(rowKeysId.value,1)
  }
</script>
