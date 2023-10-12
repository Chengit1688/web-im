<template>
  <n-card :bordered="false" class="proCard">
    <n-card class="mb-5">
      <span class="mr-5 ml-1  align-middle" >开关</span>
      <n-switch :value="status" :rubber-band="true"  :loading="loading" :checked-value="1" :unchecked-value="2" size="medium" @update:value="handleChange">
        <template #checked>
          开
        </template>
        <template #unchecked>
          关
        </template>
      </n-switch>
      <span class="ml-5  align-middle">（默认关闭，开启后只能是IP白名单的IP地址能访问后台）</span>
    </n-card>
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
</template>

<script lang="ts" setup>
  import { h, reactive, ref, unref } from 'vue';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { getIpWhiteList,deleteIpWhite,getIpWhiteSwitch,upIpWhiteSwitch} from '@/api/backstage';
  import addModal from "./dialog/add.vue"
  import editModal from "./dialog/edit.vue"
  import { BasicTable ,TableAction} from '@/components/Table';
  import { useDialog, useMessage } from 'naive-ui';
  import { DeleteOutlined, EditOutlined ,PlusOutlined} from '@vicons/antd';
  import {columns} from "./columns"
  const message = useMessage();
  const dialog = useDialog();
  const addModalShow = ref()
  const editModalShow = ref()
  const options = ref([])
  const status = ref(1)
  const loading = ref(false)
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
    ];
  }
  const schemas: FormSchema[] = [ // BasicForm 配置
    {
      field: 'ip',
      component: 'NInput',
      label: '',
      giProps: { span: '4'},
      componentProps: {
        placeholder: '请输入IP地址',
      },
    },
    {
      field: 'note',
      component: 'NInput',
      label: '',
      giProps: { span: '4'},
      componentProps: {
        placeholder: '请输入备注',
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
    ip: undefined,
    note:undefined,
  });
  const loadDataTable = async (res) => { // table 请求配置
    let params = {
      ...formParams,
      ...res,
    }
    await loadStatus()
    return await getIpWhiteList(params);
  };
  const loadStatus =  async () => { // table 请求配置
    try {
      const  data  =  await getIpWhiteSwitch()
      status.value = data
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
  function handleChange (value) {
    dialog.info({
      title: '提示',
      content: `是否${value==1?'开启':'关闭'}？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        loading.value = true
        let params = {
          status : value
        }
        try {
          await upIpWhiteSwitch(params)
          message.success(`${value==1?'开启':'关闭'}成功`);
          status.value = value
        } catch (error:any) {
          message.error(error.message)
        }
        loading.value = false
      }
    });
  }
  function handleDelete(record) {
    dialog.info({
      title: '提示',
      content: `您想移除${record.ip}白名单`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        try {
          await deleteIpWhite(record.id)
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
  function showModel () {
    addModalShow.value.openModal()
  }
  const childToParent = ()=>{
    actionRef.value.reload({page: 1, page_size: 20})
  }
</script>
