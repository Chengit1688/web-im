<template>
  <n-card :bordered="false" class="proCard">
    <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset" :show-advanced-button="false"/>
    <BasicTable :columns="columns" 
      :request="loadDataTable" 
      :row-key="(row) => row.group_id" 
      ref="actionRef" 
      :actionColumn="actionColumn"
      @edit-end="editEnd"
      @edit-change="onEditChange"
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
    <mergeModal ref="mergeModalShow" @childToParent="childToParent"/>
    <groupInfoModal ref="groupInfoModalShow" />
    <groupMembers ref="groupMembersModalShow" />
    <groupChatList ref="groupChatListModalShow" />
    <silence ref="silenceModalShow" @childToParent="childToParent"/>
  </n-card>
</template>

<script lang="ts" setup>
  import { h, reactive, ref, unref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { getGroupList,upGroup,setRobot ,clearMessage} from '@/api/user/index';
  import {columns} from "./columns"
  import {PlusOutlined } from '@vicons/antd';
  import { NButton, NSwitch } from 'naive-ui';
  import { useDialog, useMessage } from 'naive-ui';
  import addModal from "./dialog/add.vue"
  import editModal from "./dialog/edit.vue"
  import mergeModal from "./dialog/merge.vue"
  import groupInfoModal from "./dialog/groupInfo.vue"
  import silence from "./dialog/silence.vue"
  import groupMembers from "./components/groupMembers.vue"
  import groupChatList from "./components/groupChatList.vue"
  const editModalShow = ref()
  const addModalShow = ref()
  const mergeModalShow = ref()
  const silenceModalShow =  ref()
  const groupInfoModalShow = ref()
  const groupMembersModalShow = ref()
  const groupChatListModalShow = ref()
  const message = useMessage();
  const dialog = useDialog();
  const actionColumn = [
    {
      index:3,
      title: '群主名称',
      key: 'owner_nick_name',
      dataIndex: 'owner_nick_name',
      align: 'center',
      ellipsis:false,
      render (row) {
        return h(
          'span',
          {
            style:"cursor:pointer;color:#3c9bff",
            
            onClick: () => handleName(row)
          },
          { default: () => row.owner_nick_name }
        )
      }
    },
    {
      index:4,
      title: '群人数',
      key: 'members_total',
      dataIndex: 'members_total',
      align: 'center',
      ellipsis:false,
      render (row) {
        return h(
          'span',
          {
            style:"cursor:pointer;color:#3c9bff",
            
            onClick: () => groupMembersModalShow.value.openModal(row)
          },
          { default: () => row.members_total }
        )
      }
    },
    {
      index:5,
      title: '机器人数',
      key: 'robot_total',
      dataIndex: 'robot_total',
      editComponent: 'NInput',
      align:'center',
      // 默认必填校验
      editRule: ruleInput,
      edit: true,
      width: 200,
      editComponentProps:{
        allowInput:onlyAllowNumber
      }
    },
    {
      index:6,
      title: '发言频率（秒）',
      key: 'group_send_limit',
      dataIndex: 'group_send_limit',
      editComponent: 'NInput',
      align:'center',
      // 默认必填校验
      editRule: ruleInputLimt,
      edit: true,
      width: 200,
      editComponentProps:{
        allowInput:onlyAllowNumber
      }
    },
    {
      index:7,
      title: '禁止退群',
      key: 'ban_remove_by_normal',
      dataIndex: 'status',
      align: 'center',
      ellipsis:false,
      render(row) {
        return h(NSwitch, {
          checkedValue: 1,
          uncheckedValue: 2,
          value: row.ban_remove_by_normal,
          // 监测switch的改变
          onUpdateValue: (value) => upGroupHttp(value,row,1)
        },
        { 
          checked: () => '开' ,
          unchecked: () => '关'
        })
      },
    },  
    
    {
      index:8,
      title: '默认群',
      key: 'is_default',
      dataIndex: 'is_default',
      align: 'center',
      ellipsis:false,
      render(row) {
        return h(NSwitch, {
          checkedValue: 1,
          uncheckedValue: 2,
          checked: '开',
          unchecked: '关',
          value: row.is_default,
          // 监测switch的改变
          onUpdateValue: (value) => upGroupHttp(value,row,2)
        },
        { 
          checked: () => '开' ,
          unchecked: () => '关'
        })
      },
    },
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
          dropDownActions: [
            {
              label: '合并',
              type: 'primary',
              key: 'handleMerge',
              ifShow: () => {
                return true;
              },
            },
            {
              label: '解散',
              type: 'error',
              color: 'red',
              key: 'disbandGroup',
              ifShow: () => {
                return true;
              },
            },
            {
              label: '清空聊天记录',
              type: 'error',
              color: 'red',
              key: 'clearChat',
              ifShow: () => {
                return true;
              },
            }
          ],
          select: (key) => {
            if(key=='handleMerge'){
              handleMerge(record)
            }else if(key=='disbandGroup'){
              disbandGroup(record)
            }else{
              clearChat(record)
            }
          },
        });
      },
    },
  ]
  function createActions(record) {
    return [
      {
        label: '编辑',
        type: 'primary',
        onClick: handleEdit.bind(null, record),
        ifShow: () => {
          return true;
        },
      },
      {
        label: '聊天记录',
        type: 'primary',
        onClick: handleChat.bind(null, record),
        ifShow: () => {
          return true;
        },
      },
      {
        label: '全体禁言',
        type: 'primary', 
        onClick: silenceHttp.bind(null, record),
        // 根据业务控制是否显示 isShow 和 auth 是并且关系
        ifShow: () => {
          return true;
        },
      }
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
    group_name: undefined,
    owner_name:undefined,
  });
  
  const loadDataTable = async (res) => { // table 请求配置
    let params = {
      ...formParams,
      ...res,
    }
    return await getGroupList(params);
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
  // 添加群 
  function handleAdd(){
    addModalShow.value.openModal()
  }
  // 编辑群
  function handleEdit(row){
    editModalShow.value.openModal(row)
  }
  // 合并群
  function handleMerge(row){
    mergeModalShow.value.openModal(row)
  }
  //查看群信息
  function handleName(row){
    groupInfoModalShow.value.openModal(row)
  }
  //查看群聊天记录
  function handleChat(row){
    groupChatListModalShow.value.openModal(row)
  }
  //全体禁言
  function silenceHttp(row){
    silenceModalShow.value.openModal(row)
  }
  //更新群信息
  function upGroupHttp(value,row,type){
    dialog.info({
      title: '提示',
      content: `是否${value==2?'关闭':'开启'}${type==2?'默认群':'禁止退群'}？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        let params:any = {
          group_id:row.group_id
        }
        if(type==1){
          params.ban_remove_by_normal = value
        }else{
          params.is_default = value
        }
        try {
          await upGroup(params)
          if(type==1){
            row.ban_remove_by_normal = value
          }else{
            row.is_default = value
          }
          message.success(`${value==2?'关闭':'开启'}成功`);
        } catch (error:any) {
          message.error(error.message)
        } 
      }
    });
  }
  // 清空群聊天记录
  function clearChat(row){
   const clear =  dialog.info({
      title: '提示',
      content: `是否清空名称为 “ ${row.name} ” 的群聊天记录？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        clear.loading = true
        let params = {
          // 1 清除用户全部聊天记录
          // 2 清除指定群全部群成员聊天记录
          // 3 清除全部用户全部聊天记录
          type:2,
          target_id:row.group_id
        }
        try {
          await clearMessage(params)
          message.success(`清空成功`);
        } catch (error:any) {
          message.error(error.message)
        } 
      }
    });
  }
  // 解散群
  function disbandGroup(row){
    dialog.info({
      title: '提示',
      content: `是否解散名称为 “ ${row.name} ” 的群？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        let params:any = {
          group_id:row.group_id
        }
        params.status = 2
        try {
          await upGroup(params)
          message.success(`解散成功`);
          actionRef.value.reload({page: 1, page_size: 20})
        } catch (error:any) {
          message.error(error.message)
        } 
      }
    });
  }
  function ruleInput(text){
    if(text==null || text=="" || text==undefined){
      return '请输入数量！'
    }else if(text<0){
      return "数量不能小于0"
    }else if(text>1000){
      return "数量不能大于1000"
    }
  }
  function ruleInputLimt(text){
    if(text==null || text=="" || text==undefined){
      return '请输入发言频率！'
    }else if(text<0){
      return "频率不能小于0"
    }else if(text>10000){
      return "频率不能大于10000"
    }
  }
  function onlyAllowNumber(text){
    return !text || /^\d+$/.test(text) && !text.startsWith(' ') && !text.endsWith(' ')
  }
  function onEditChange({ column, value, record }) {
    if (column.key == 'robot_total') {
      record.editValueRefs.robot_total.value = `${value}`;
    }
    if (column.key == 'group_send_limit') {
      record.editValueRefs.group_send_limit.value = `${value}`;
    }
  }
  async function editEnd({ record, value, key }) {
    if (key == 'robot_total') {
      try {
        await setRobot({group_id:record.group_id,robot_total:+value})
        message.success(`设置成功`);
      } catch (error:any) {
        message.error(error.message)
      }
    }
    if (key == 'group_send_limit') {
      try {
        let params = {
          group_id:record.group_id,
          group_send_limit:value==0?-1:+value
        }
        await upGroup(params)
        message.success(`设置成功`);
      } catch (error:any) {
        message.error(error.message)
      }
    }
    
  }

  const childToParent = ()=>{
    actionRef.value.reload({page: 1, page_size: 20})
  }
</script>
