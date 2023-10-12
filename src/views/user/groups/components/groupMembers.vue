<template>
  <n-modal  v-model:show="showModal" :show-icon="false" preset="dialog" :title="`群名称：${groupName}`" style="width:60%;">
    <n-card :bordered="false" class="proCard">
      <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset" :show-advanced-button="false"/>
      <BasicTable
        :columns="memberColumns"
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
            添加
          </n-button>
        </template>
      </BasicTable>
      <addModal ref="addModalShow" @childToParent="childToParent"/>
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
  import { h, reactive, ref, unref } from 'vue';
  import { BasicTable, TableAction} from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index'; 
  import {PlusOutlined } from '@vicons/antd';
  import { getGroupMemberList,setAdmin,removeGroupMember} from '@/api/user/index';
  import {memberColumns} from "./columns"
  import { useMessage, useDialog } from 'naive-ui';
  import addModal from "./dialog/add.vue"
  const addModalShow = ref()
  const groupId = ref('')
  const groupName = ref('')
  const actionRef = ref(); // 表格ref
  const message = useMessage();
  const dialog = useDialog();
  const showModal = ref(false);
  const formParams = reactive({ // form 表单
    search_key: undefined
  });
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
        label: `${record.role=='user'?'设为管理员':'取消管理员'}`,
        type: 'primary',
        onClick: handleAdmin.bind(null, record),
        ifShow: () => {
          return record.role!='owner';
        },
      },
      {
        label: '踢出群聊',
        type: 'error',
        onClick: handleKickOut.bind(null, record),
        ifShow: () => {
          return record.role!='owner';
        },
      }
    ];
  }
  const schemas: FormSchema[] = [ // BasicForm 配置
    {
      field: 'search_key',
      component: 'NInput',
      label: '',
      giProps: { span: '8'},
      componentProps: {
        placeholder: '请输入群成员ID/昵称/手机号',
      },
    }
  ];
  const [register, {}] = useForm({ 
    gridProps: {  xGap: '12'},
    labelWidth: 80,
    schemas,

  });
  function openModal (row){
    groupId.value = row.group_id
    groupName.value = row.name
    showModal.value = true
  }
  const loadDataTable = async (res) => { // table 请求配置
    let params = {
      ...formParams,
      ...res,
    }
    params.group_id = groupId.value
    return await getGroupMemberList(params)
    
  };
  defineExpose({
    openModal
  })
  // 添加群成员
  function handleAdd(){
    addModalShow.value.openModal(groupId.value)
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
  function handleAdmin (row) {
    const admin = dialog.info({
      title: '提示',
      content: `是否将名称为 “ ${row.nick_name} ” 的成员${row.role=='user'?'设置':'取消'}为管理员？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        admin.loading = true
        let params = {
          group_id:groupId.value,
          user_id:row.user_id,
          status:row.role=='user'?1:2,
        }
        try {
          await setAdmin(params)
          message.success(`${params.status==1?'设置成功':'取消成功'}`);
          actionRef.value.reload({page: 1, page_size: 20})
        } catch (error:any) {
          message.error(error.message)
        } 
      }
    });
  }
  function handleKickOut (row) {
    const out = dialog.info({
      title: '提示',
      content: `是否将名称为 “ ${row.nick_name} ” 的成员踢出群聊？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        out.loading = true
        let params = {
          group_id:groupId.value,
          user_id_list:[row.user_id]
        }
        try {
          await removeGroupMember(params)
          message.success(`踢出成功`);
          actionRef.value.reload({page: 1, page_size: 20})
        } catch (error:any) {
          message.error(error.message)
        } 
      }
    });
  }
  
</script>
