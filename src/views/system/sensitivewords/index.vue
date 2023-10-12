<template>
  <n-card :bordered="false" class="proCard">
    <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset" :show-advanced-button="false">
      <template #statusSlot="{ model, field }">
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
      <n-button type="primary" @click="showAddModal">
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
  import {h, reactive, ref, unref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { getShieldList,deleteShield} from '@/api/system';
  import {columns} from "./columns"
  import { DeleteOutlined, EditOutlined, PlusOutlined } from '@vicons/antd';
  import addModal from "./dialog/add.vue"
  import editModal from "./dialog/edit.vue"
  import { useDialog, useMessage } from 'naive-ui';
  const message = useMessage();
  const dialog = useDialog();
  const addModalShow = ref()
  const editModalShow = ref()
  const schemas: FormSchema[] = [ // BasicForm 配置
  {
      field: 'shield_words',
      component: 'NInput',
      label: '',
      giProps: { span: '6'},
      componentProps: {
        placeholder: '请输入敏感词',
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
  const actionColumn = [
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
    }
  ]
  function createActions(record) {
    return [
      {
        label: '编辑',
        type: 'primary',
        icon: EditOutlined,
        onClick: handleEdit.bind(null, record),
        ifShow: () => {
          return true;
        },
      },
      {
        label: '删除',
        type: 'error',
        color: 'red',
        icon: DeleteOutlined,
        onClick: handleDelete.bind(null, record),
        // 根据业务控制是否显示 isShow 和 auth 是并且关系
        ifShow: () => {
          return true;
        },
      }
    ];
  }
  const [register, {}] = useForm({ 
    gridProps: {xGap: '12'},
    labelWidth: 80,
    schemas,
  });
  const actionRef = ref(); // 表格ref
  const formParams = reactive({ // form 表单
    platform:undefined,
    status:undefined,
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
    return await getShieldList(params);
  };
  // 搜索
  function handleSubmit(values: Recordable) { 
    Object.assign(unref(formParams), values)
    actionRef.value.reload({page: 1, page_size: 20})
  }
  // 重置
  function handleReset(values: Recordable) { // 重置
    for(let i in formParams){
      formParams[i] = values[i] || undefined
    }
    actionRef.value.reload({page: 1, page_size: 20})
  }
  //删除
  function handleDelete(row) {
    dialog.info({
      title: '提示',
      content: `您想删除此敏感词？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        let params = {
          id:row.id
        }
        try {
          await deleteShield(params)
          message.success('删除成功');
          actionRef.value.reload()
        } catch (error:any) {
          message.error(error.message)
        }
      },
      onNegativeClick: () => {},
    });
  }
  //新增
  function showAddModal() {
    addModalShow.value.openModal()
  }
  // 编辑
  function handleEdit(record) {
    editModalShow.value.openModal(record)
  }
  const childToParent = ()=>{
    actionRef.value.reload({page: 1, page_size: 20})
  }
</script>
