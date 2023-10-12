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
    />
  </n-card>
  <logDetails ref="logDetailsShow" />
</template>

<script lang="ts" setup>
  import { h, reactive, ref, unref } from 'vue';
  import { BasicTable, TableAction} from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { getInviteCodeList} from '@/api/perations';
  import logDetails from "./dialog/index.vue"
  import {columns} from "./columns"
  import { useDialog, useMessage } from 'naive-ui';
  const message = useMessage();
  const logDetailsShow = ref()
  const actionColumn = [
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      width:'200px',
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
        label: '查看',
        type: 'primary',
        onClick: handelShow.bind(null, record),
        ifShow: () => {
          return record.role_key!='admin';
        },
      },
    ];
  }
  const schemas: FormSchema[] = [ // BasicForm 配置
    {
      field: 'invite_code',
      component: 'NInput',
      label: '',
      giProps: { span: '4'},
      componentProps: {
        placeholder: '请输入邀请码',
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
    invite_code: undefined,
  });
  
  const loadDataTable = async (res) => { // table 请求配置
    let params = {
      ...formParams,
      ...res,
    }
    try {
      return await getInviteCodeList(params)
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
    formParams.time = []
    actionRef.value.reload({page: 1, page_size: 20})
  }
    // 详情弹窗
    function handelShow(row) {
      logDetailsShow.value.openModal(row);
  }
</script>
