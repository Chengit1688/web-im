<template>
  <n-card :bordered="false" class="proCard">
    <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset" />
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.id"
      ref="actionRef"
      :actionColumn="actionColumn"
    >
      <template #tableTitle>
        <n-button type="primary" @click="showAddModal" class="mr-5">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          批量创建用户
        </n-button>
        <n-button type="warning" class="mr-5" @click="exportList"> 
          <template #icon>
            <n-icon>
              <ExportOutlined />
            </n-icon>
          </template>
          导出用户列表
        </n-button>
        <n-button type="error" class="mr-5" @click="clearChat"> 
          <template #icon>
            <n-icon>
              <DeleteOutlined />
            </n-icon>
          </template>
          清除全部客户端聊天记录
        </n-button>
      </template>
      <template #tableFooter>
        总人数：{{ countNumber }}
      </template>
    </BasicTable>
    <addModal ref="addModalShow" @childToParent="childToParent" />
    <infoModal ref="infoModalShow" @childToParent="childToParent" />
    <subordinateModal ref="subordinateModalShow" @childToParent="childToParent" />
    <friendModal ref="friendModalShow" @childToParent="childToParent" />
  </n-card>
</template>

<script lang="ts" setup>
  import { h, reactive, ref, unref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { getUserList, freezeUser, unfreezeUser,clearMessage ,exportUserList} from '@/api/user';
  import { NSwitch } from 'naive-ui';
  import { columns } from '../columns';
  import { useDialog, useMessage } from 'naive-ui';
  import { PlusOutlined,DeleteOutlined,ExportOutlined} from '@vicons/antd';
  import addModal from '../dialog/add.vue';
  import infoModal from '../dialog/userInfo.vue';
  import friendModal from '../dialog/friendInfo.vue';
  import subordinateModal from '../dialog/subordinate.vue';
  const addModalShow = ref();
  const infoModalShow = ref();
  const friendModalShow = ref();
  const subordinateModalShow = ref()
  const countNumber = ref()
  const message = useMessage();
  const dialog = useDialog();
  const actionColumn = [
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      width: 150,
      render(record) {
        return h(TableAction as any, {
          style: 'text',
          actions: createActions(record),
        });
      },
    },
    {
      index: 9,
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      align: 'center',
      width: 100,
      ellipsis: false,
      render(row) {
        return h(
          NSwitch,
          {
            checkedValue: 1,
            uncheckedValue: 2,
            value: row.status,
            // 监测switch的改变
            onUpdateValue: (value) => upStatus(value, row),
          },
          {
            checked: () => '启用',
            unchecked: () => '冻结',
          }
        );
      },
    },
  ];
  function createActions(record) {
    return [
      {
        label: '好友',
        type: 'primary',
        onClick: showFriendModal.bind(null, record),
        // 根据业务控制是否显示 isShow 和 auth 是并且关系
        ifShow: () => {
          return true;
        },
      },
      {
        label: '详情',
        type: 'primary',
        onClick: showInfoModal.bind(null, record),
        ifShow: () => {
          return true;
        },
      },
      {
        label: '下级',
        type: 'primary',
        onClick:showSubordinateModal.bind(null, record),
        ifShow: () => {
          return true;
        },
      },
    ];
  }
  const schemas: FormSchema[] = [
  {
      field: 'user_id',
      component: 'NInput',
      label: '',
      giProps: { span: '4' },
      componentProps: {
        placeholder: '请输入用户ID',
      },
    },
    // BasicForm 配置
    {
      field: 'account',
      component: 'NInput',
      label: '',
      giProps: { span: '4' },
      componentProps: {
        placeholder: '请输入用户账号',
      },
    },
    {
      field: 'nick_name',
      component: 'NInput',
      label: '',
      giProps: { span: '4' },
      componentProps: {
        placeholder: '请输入用户昵称',
      },
    },
    {
      field: 'phone_number',
      component: 'NInput',
      label: '',
      giProps: { span: '4' },
      componentProps: {
        placeholder: '请输入手机号码',
      },
    },
    {
      field: 'time',
      component: 'NDatePicker',
      label: '',
      defaultValue:null,
      giProps: { span: '8' },
      componentProps: {
        placeholder: '请选择注册时间',
        type: 'datetimerange',
        clearable: false,
        defaultTime: ['00:00:00', '23:59:59'],
      },
    },
    {
      field: 'login_ip',
      component: 'NInput',
      label: '',
      giProps: { span: '4' },
      componentProps: {
        placeholder: '请输入登录IP',
      },
    },
    {
      field: 'status',
      component: 'NSelect',
      label: '',
      giProps: { span: '4' },
      componentProps: {
        placeholder: '请选择用户状态',
        options: [
          {
            label: '启用',
            value: '1',
          },
          {
            label: '冻结',
            value: '2',
          },
        ],
      },
    },
    {
      field: 'invite_code',
      component: 'NInput',
      label: '',
      giProps: { span: '4' },
      componentProps: {
        placeholder: '请输入邀请码',
      },
    },
  ];
  const [register, {}] = useForm({
    gridProps: { xGap: '12' },
    labelWidth: 80,
    schemas,
  });
  const actionRef = ref(); // 表格ref
  const formParams = reactive({
    // form 表单
    user_id: undefined,
    mac_type: undefined,
    nick_name: undefined,
    account: undefined,
    phone_number: undefined,
    status: undefined, // Number 状态 1正常 2冻结
    login_ip: undefined,
    gender: undefined, //用户性别 1男 2女
    invite_code: undefined,
    time: [],
  });
  const loadDataTable = async (res) => {
    // table 请求配置
    let params = {
      ...formParams,
      ...res,
    };
    if(params.time&&params.time.length>0){
      params.register_time_start = parseInt(params.time[0]/1000)
      params.register_time_end = parseInt(params.time[1]/1000)
    }
    delete params.time;
    const {data}= await getUserList(params);
    countNumber.value = data.count
    return  data;
  };
  const childToParent = () => {
    actionRef.value.reload({ page: 1, page_size: 20 });
  };
  // 状态
  function upStatus(value, row) {
    dialog.info({
      title: '提示',
      content: `您想${value == 2 ? '冻结' : '启用'}此用户吗？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        let params = {
          user_id: row.user_id,
        };
        try {
          (await row.status) == 2 ? unfreezeUser(params) : freezeUser(params);
          row.status = value;
          message.success(`${value == 2 ? '冻结' : '启用'}成功`);
        } catch (error: any) {
          message.error(error.message);
        }
      },
    });
  }
  function handleSubmit(values: Recordable) {
    // 搜索
    Object.assign(unref(formParams), values);
    actionRef.value.reload({ page: 1, show: 20 });
  }
  function handleReset(values: Recordable) {
    // 重置
    for (let i in formParams) {
      formParams[i] = values[i] || undefined;
    }
    actionRef.value.reload({ page: 1, show: 20 });
  }
  // 新增
  function showAddModal() {
    addModalShow.value.openModal();
  }
  // 详情弹窗
  function showInfoModal(row) {
    infoModalShow.value.openModal(row);
  }
  //  下级弹窗
  function showSubordinateModal(row) {
    subordinateModalShow.value.openModal(row);
  }
  // 好友弹窗
  function showFriendModal(row) {
    friendModalShow.value.openModal(row);
  }
  // 导出数据
  async function exportList(){
    const clear =  dialog.info({
      title: '提示',
      content: `确定导出搜索后所有用户数据？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        clear.loading = true
        let params:any = {
          ...formParams,
        };
        if(params.time&&params.time.length>0){
          params.register_time_start = parseInt(params.time[0]/1000)
          params.register_time_end = parseInt(params.time[1]/1000)
        }
        delete params.time;
        try {
          const data = await exportUserList(params)
          const xlsx = 'application/octet-stream'
          const blob = new Blob([data], { type: xlsx })
          //转换数据类型
          const a = document.createElement('a') // 转换完成，创建一个a标签用于下载
          // const name = res.headers['content-disposition']
          // a.download = name.split('=')[1]
          a.href = URL.createObjectURL(blob)
          a.setAttribute('download', '用户列表.xlsx');
          a.click()
          a.remove()
          // 直接打开下载文件的链接
          // window.location.href = res.request.responseURL
        } catch (error:any) {
          message.error(error.message)
        }
      }
    });
  }
  // 清空群聊天记录
  function clearChat(){
   const clear =  dialog.info({
      title: '提示',
      content: `是否清除全部客户端聊天记录？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        clear.loading = true
        let params = {
          // 1 清除用户全部聊天记录
          // 2 清除指定群全部群成员聊天记录
          // 3 清除全部用户全部聊天记录
          type:3,
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
</script>
