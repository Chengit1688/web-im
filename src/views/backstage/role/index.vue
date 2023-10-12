<template>
  <n-card :bordered="false" class="proCard">
    <BasicForm 
      :schemas="schemas" 
      :gridProps="{ xGap: 12 }"
      @submit="handleSubmit" 
      @reset="handleReset" 
      :show-advanced-button="false"
    />
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
  <addModal ref="addModalShow" @childToParent="childToParent"/>
  <editModal ref="editModalShow" @childToParent="childToParent"/>
</template>

<script lang="ts" setup>
  import { h, reactive, ref, unref } from 'vue';
  import { BasicTable ,TableAction} from '@/components/Table';
  import { BasicForm, FormSchema } from '@/components/Form/index';
  import { getRoleList,deleteRole} from '@/api/backstage';
  import addModal from "./dialog/add.vue"
  import editModal from "./dialog/edit.vue"
  import { useDialog, useMessage } from 'naive-ui';
  import {columns} from "./columns"
  import { DeleteOutlined, EditOutlined ,PlusOutlined} from '@vicons/antd';
  const message = useMessage();
  const dialog = useDialog();
  const addModalShow = ref()
  const editModalShow = ref()
  const actionRef = ref(); // 表格ref
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
        label: '编辑',
        type: 'primary',
        icon: EditOutlined,
        onClick: handleEdit.bind(null, record),
        ifShow: () => {
          return record.role_key!='admin';
        },
      },
      {
        label: '删除',
        type: 'error',
        color: 'red',
        icon: DeleteOutlined,
        onClick: handleDelete.bind(null, record),
        ifShow: () => {
          return record.role_key!='admin';
        },
      }
    ];
  }
  const schemas: FormSchema[] = [ // BasicForm 配置
    {
      field: 'role_name',
      component: 'NInput',
      label: '',
      giProps: { span: '4'},
      componentProps: {
        placeholder: '请输入角色描述',
      },
    },
    {
      field: 'role_key',
      component: 'NInput',
      label: '',
      giProps: { span: '4'},
      componentProps: {
        placeholder: '请输入角色名称',
      },
    }
  ];
  
  const formParams = reactive({ // form 表单
    role_name: undefined,
    role_key:undefined,
  });
  
  const loadDataTable = async (res) => { // table 请求配置
    let params = {
      ...formParams,
      ...res,
    }
    try {
      return await getRoleList(params)
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
  function handleDelete(record) {
    const deleteDla =  dialog.info({
      title: '提示',
      content: `您想删除${record.role_name}`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        deleteDla.loading = true
        try {
          await deleteRole(record.id)
          message.success('删除成功');
          actionRef.value.reload()
        } catch (error:any) {
          message.error(error.message)
        }
      }
    });
  }
  function handleEdit(record) {
    editModalShow.value.openModal(record)
  }
  function showModel () {
    addModalShow.value.openModal()
  }
  const childToParent = ()=>{
    actionRef.value.reload()
  }
</script>
