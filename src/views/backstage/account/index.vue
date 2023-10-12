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
    >
      <template #tableTitle>
        <n-button type="primary" @click="showModel">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          添加
        </n-button>
      </template>
    </BasicTable>
  </n-card>
  <addModal ref="addModalShow" :options="options" @childToParent="childToParent"/>
  <editModal ref="editModalShow" :options="options" @childToParent="childToParent"/>
  
  <editPasswordModal ref="editPasswordModalShow" :options="options" @childToParent="childToParent"/>


</template>

<script lang="ts" setup>
  import { h, onMounted, reactive, ref, unref } from 'vue';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { getAdminList,deleteAcount, getRoleList} from '@/api/backstage';
  import addModal from "./dialog/add.vue"
  import editPasswordModal from "./dialog/editPassword.vue"
  import editModal from "./dialog/edit.vue"
  import { BasicTable ,TableAction} from '@/components/Table';
  import { useDialog, useMessage } from 'naive-ui';
  import { DeleteOutlined, EditOutlined ,PlusOutlined} from '@vicons/antd';
  import {columns} from "./columns"
  const message = useMessage();
  const dialog = useDialog();
  const addModalShow = ref()
  const editModalShow = ref()
  const editPasswordModalShow = ref()
  const options = ref([])
  const actionColumn = [
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      width:'300px',
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
          return record.username!='root';
        },
      },
      {
        label: '编辑',
        type: 'primary',
        icon: EditOutlined,
        onClick: handleEdit.bind(null, record),
        ifShow: () => {
          return record.username!='root';
        },
      },
      {
        label: '改密',
        type: 'success',
        icon: EditOutlined,
        onClick: handleEditPassword.bind(null, record),
        ifShow: () => {
          return record.username!='root';
        },
      },
    ];
  }
  const schemas: FormSchema[] = [ // BasicForm 配置
    {
      field: 'username',
      component: 'NInput',
      label: '',
      giProps: { span: '4'},
      componentProps: {
        placeholder: '请输入账号',
      },
    },
    {
      field: 'nick_name',
      component: 'NInput',
      label: '',
      giProps: { span: '4'},
      componentProps: {
        placeholder: '请输入名称',
      },
    },
    {
      field: 'role_key',
      component: 'NSelect',
      label: '',
      giProps: { span: '4'},
      componentProps: {
        placeholder: '请选择角色',
        options: options,
        labelField:'role_key',
        valueField:'role_key',
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
  const actionRef = ref(); // 表格ref
  const formParams = reactive({ // form 表单
    username: undefined,
    nick_name:undefined,
    role_key:undefined,
    time: [],
  });
  const loadDataTable = async (res) => { // table 请求配置
    let params = {
      ...formParams,
      ...res,
    }
    if(params.time&&params.time.length>0){
      params.login_time_start = parseInt(params.time[0]/1000)
      params.login_time_end = parseInt(params.time[1]/1000)
    }
    delete params.time
    return await getAdminList(params);
  };
  function handleSubmit(values: Recordable) { // 搜索
    Object.assign(unref(formParams), values)
    actionRef.value.reload({page: 1, page_size: 20})
  }
  function handleReset(values: Recordable) { // 重置 
    for(let i in formParams){
      formParams[i] = values[i] || undefined
    }
    formParams.time = []
    actionRef.value.reload({page: 1, page_size: 20})
  }
  function handleDelete(record) {
    dialog.info({
      title: '提示',
      content: `您想删除${record.username}`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        let params = {
          id:record.id
        }
        try {
          await deleteAcount(params)
          message.success('删除成功');
          actionRef.value.reload()
        } catch (error:any) {
          message.error(error.message)
        }
      }
    });
  }
  // 编辑
  function handleEdit(record) {
    editModalShow.value.openModal(record)
  }
  //改密
  function handleEditPassword(record){
    editPasswordModalShow.value.openModal(record)
  }
  function showModel () {
    addModalShow.value.openModal()
  }
  const childToParent = ()=>{
    actionRef.value.reload({page: 1, page_size: 20})
  }
  onMounted(async () => {
    const {list} =  await getRoleList({page: 1, page_size: 999})
    for(let i in list){
      list[i].role_id = list[i].id
    }
    options.value = list
  })
</script>
