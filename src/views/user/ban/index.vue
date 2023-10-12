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
        <n-button type="primary" @click="showModel" class="mr-5">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          添加
        </n-button>
        <n-button :type="isFreeze==2?'error':'success'" @click="handleFreeze()">
          <template #icon>
            <n-icon>
              <SnowOutline />
            </n-icon>
          </template>
          {{ isFreeze==2?'一键冻结':'一键解冻' }}
        </n-button>
      </template>
    </BasicTable>
  </n-card>
  <addModal ref="addModalShow" :options="options" @childToParent="childToParent"/>

</template>

<script lang="ts" setup>
  import { h, reactive, ref, unref } from 'vue';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { getPrivilegeList,deletePrivilege,enterAllGroup,setFreeze} from '@/api/user';
  import addModal from "./dialog/add.vue"
  import { BasicTable ,TableAction} from '@/components/Table';
  import { NTag, useDialog, useMessage } from 'naive-ui';
  import { DeleteOutlined ,PlusOutlined} from '@vicons/antd';
  import { SnowOutline} from '@vicons/ionicons5';
  import {columns} from "./columns"
  const message = useMessage();
  const dialog = useDialog();
  const addModalShow = ref()
  const isFreeze = ref()
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
    {
      index:4,
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      width:'200px',
      render (record) {
        return h(
          NTag,
          {type:record.status==1?'success':'error'},
          { default: () => record.status==2?'冻结':'正常' }
        )
      }
      
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
      // {
      //   label: '一键全站好友',
      //   type: 'primary',
      //   onClick: handleAllFriends.bind(null, record),
      //   ifShow: () => {
      //     return record.username!='root';
      //   },
      // },
      {
        label: '一键全站进群',
        type: 'success',
        onClick: handleEnterGroup.bind(null, record),
        ifShow: () => {
          return record.username!='root';
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
        placeholder: '请输入昵称',
      },
    },
  ];
  const [register, {}] = useForm({ 
    gridProps: {  xGap: '12'},
    labelWidth: 80,
    schemas,

  });
  const actionRef = ref(); // 表格ref
  const formParams = reactive({ // form 表单
    user_id: undefined,
    nick_name:undefined,
  });
  const loadDataTable = async (res) => { // table 请求配置
    let params = {
      ...formParams,
      ...res,
    }
    const {data} =  await getPrivilegeList(params);
    isFreeze.value = data.is_freeze
    return data
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
    dialog.info({
      title: '提示',
      content: `您想删除${record.account}特权账号`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        let params = {
          user_id:record.user_id,
          nick_name:record.nick_name
        }
        try {
          await deletePrivilege(params)
          message.success('删除成功');
          actionRef.value.reload()
        } catch (error:any) {
          message.error(error.message)
        }
      }
    });
  }
  // 一键冻结
  function handleFreeze(){
    const freeze = dialog.info({
      title: '提示',
      content: `您想将所有账号一键${isFreeze.value==2?'冻结':'解冻'}吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        freeze.loading = true
        let params = {
          is_freeze:isFreeze.value==2?1:2,
        }
        try {
          await setFreeze(params)
          message.success(`一键${isFreeze.value==2?'冻结':'解冻'}成功`);
          actionRef.value.reload()
        } catch (error:any) {
          message.error(error.message)
        }
      }
    });
  }
  // 一键进群
  function handleEnterGroup(record) {
    const join = dialog.info({
      title: '提示',
      content: `您想将${record.account}账号一键全站进群`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        join.loading = true
        let params = {
          user_id:record.user_id,
        }
        try {
          await enterAllGroup(params)
          message.success('一键全站进群成功');
          actionRef.value.reload()
        } catch (error:any) {
          message.error(error.message)
        }
      }
    });
  }
  // 一键好友
  function handleAllFriends() {
    message.error('敬请期待')
  }
  function showModel () {
    addModalShow.value.openModal()
  }
  const childToParent = ()=>{
    actionRef.value.reload({page: 1, page_size: 20})
  }
</script>
