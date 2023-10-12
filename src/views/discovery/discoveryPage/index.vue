<template>
  <n-card :bordered="false" class="proCard">
    <n-card class="mb-5">
      <span class="mr-5 ml-1  align-middle" >发现页开关</span>
      <n-switch :value="status" :rubber-band="true"  :loading="loading" :checked-value="1" :unchecked-value="2" size="medium" @update:value="handleChange">
        <template #checked>
          开
        </template>
        <template #unchecked>
          关
        </template>
      </n-switch>
      <span class="ml-5  align-middle">（打开后，底部显示发现页入口）</span>
    </n-card>
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :dataSource = "dataLIst"
      :row-key="(row) => row.id"
      ref="actionRef"
      :actionColumn="actionColumn"
      :pagination="false"
    >
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
  import { h, ref } from 'vue';
  import { BasicTable, TableAction} from '@/components/Table';
  import { getDiscover,deleteDiscover,getDiscoverStatus,upDiscoverStatus} from '@/api/discovery/index';
  import {PlusOutlined,DeleteOutlined, EditOutlined  } from '@vicons/antd';
  import {columns} from "./columns"
  import addModal from "./dialog/add.vue"
  import editModal from "./dialog/edit.vue"
  import { useMessage, useDialog } from 'naive-ui';
  const status = ref(1)
  const loading = ref(false)
  const editModalShow = ref()
  const addModalShow = ref()
  const message = useMessage();
  const dialog = useDialog();
  const dataLIst:any= ref([])
  const actionRef = ref(); // 表格ref
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
        label: '删除',
        type: 'error',
        color: 'red',
        icon: DeleteOutlined,
        onClick: handleDel.bind(null, record),
        // 根据业务控制是否显示 isShow 和 auth 是并且关系
        ifShow: () => {
          return true;
        },
      },
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

  const loadDataTable =  async () => { // table 请求配置
    try {
      const { data } =  await getDiscover()
      await loadStatus()
      dataLIst.value =data
    } catch (error:any) {
      message.error(error.message)
    }
  };
  const loadStatus =  async () => { // table 请求配置
    try {
      const  data  =  await getDiscoverStatus()
      status.value = data
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
  function handleChange (value) {
    dialog.info({
      title: '提示',
      content: `是否${value==1?'开启':'关闭'}发现页？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        loading.value = true
        let params = {
          status : value
        }
        try {
          await upDiscoverStatus(params)
          message.success(`${value==1?'开启':'关闭'}成功`);
          status.value = value
        } catch (error:any) {
          message.error(error.message)
        }
        loading.value = false
      }
    });
  }
  // 删除
  function handleDel(row){
    dialog.info({
      title: '提示',
      content: `是否删除当前条发现？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          await deleteDiscover(row.id)
          message.success(`删除成功`);
          actionRef.value.reload()
        } catch (error:any) {
          message.error(error.message)
        } 
      }
    });
  }
  const childToParent = ()=>{
    actionRef.value.reload()
  }
</script>
