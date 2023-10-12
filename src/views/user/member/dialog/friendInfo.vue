<template>
  <n-modal
    id="basic-modal"
    v-model:show="showModal"
    :show-icon="false"
    preset="dialog"
    title="好友列表"
    style="width: 1000px"
  >
    <n-card :bordered="false" class="proCard">
      <BasicForm
        @register="register"
        @submit="handleSubmit"
        @reset="handleReset"
        :show-advanced-button="false"
      />
      <BasicTable
        :columns="friendsColumns"
        :request="loadDataTable"
        :row-key="(row) => row.id"
        ref="actionRef"
        :actionColumn="actionColumn"
      >
      <template #tableTitle>
          <n-button type="primary" @click="handleAdd">
            <template #icon>
              <n-icon>
                <PlusOutlined />
              </n-icon>
            </template>
            添加好友
          </n-button>
        </template>
      </BasicTable>
      <addModal ref="addModalShow" @childToParent="childToParent" :info="info"/>
    </n-card>
  </n-modal>
</template>
<script lang="ts" setup>
  import { h,ref, reactive, unref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { usersFriendsList,deleteFriends, searchUser } from '@/api/user';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { friendsColumns } from '../columns';
  import addModal from "./addFriends.vue"
  import {PlusOutlined } from '@vicons/antd';

  import { useDialog, useMessage } from 'naive-ui';
  const addModalShow = ref()
  const usrerOptions = ref([])
  const message = useMessage();
  const dialog = useDialog();
  const actionRef = ref(); // 表格ref
  const userId = ref('')
  const showModal = ref(false);
  const formParams = reactive({ // form 表单
    friend_id: undefined,
  });
  const loadDataTable = async (res) => { // table 请求配置
    let params = {
      ...formParams,
      ...res,
    }
    params.user_id = userId.value
    return await usersFriendsList(params)
    
  };
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
  const info = ref({
    userId:""
  });
  function createActions(record) {
    return [
      {
        label: '删除',
        type: 'error',
        onClick: handleDelete.bind(null, record),
        // 根据业务控制是否显示 isShow 和 auth 是并且关系
        ifShow: () => {
          return true;
        },
      },
    ];
  }
  const schemas: FormSchema[] = [
    // BasicForm 配置
    {
      field: 'friend_id',
      component: 'NSelect',
      label: '',
      giProps: { span: '8' },
      componentProps: {
        placeholder: '请输入用户ID/昵称/手机号',
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
  ];
  const [register, {}] = useForm({
    gridProps: { xGap: '12' },
    labelWidth: 80,
    schemas,
  });

  function openModal (row){
    userId.value = row.user_id
    showModal.value = true
  }
  function handleDelete(record) {
    dialog.info({
      title: '提示',
      content: `您想删除${record.nick_name}`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        let params = {
          user_id:userId.value,
          friend_id:record.user_id
        }
        try {
          await deleteFriends(params)
          message.success('删除成功');
          actionRef.value.reload()
        } catch (error:any) {
          message.error(error.message)
        }
      }
    });
  }
  function handleSubmit(values: Recordable) { // 搜索
    Object.assign(unref(formParams),values)
    actionRef.value.reload({page: 1, show: 20})
  }
  function handleReset(values: Recordable) { // 重置 
    for(let i in formParams){
      formParams[i] = values[i] || undefined
    }
    actionRef.value.reload({page: 1, page_size: 20})
  }
   // 添加群成员
   function handleAdd(){
    addModalShow.value.openModal()
    console.log(userId.value )
    info.value.userId = userId.value 
  }
  const childToParent = ()=>{
    actionRef.value.reload()
  }
  defineExpose({
    openModal,
  });
</script>
