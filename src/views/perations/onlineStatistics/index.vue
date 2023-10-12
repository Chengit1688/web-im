<template>
  <n-card :bordered="false" class="proCard">
    <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset" :show-advanced-button="false"/>
    <BasicTable 
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.id"
      ref="actionRef"
    >
      <template #tableTitle>
        <span class="ml-2">当前在线：
         <h3 class="font-bold inline-block"> {{ count }}</h3>
        </span>
      </template>
    </BasicTable>
  </n-card>
</template>

<script lang="ts" setup>
  import { reactive, ref, unref } from 'vue';
  import { BasicTable} from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import {columns} from "./columns"
  import { getOnlineUser} from '@/api/perations';
  const formParams = reactive({ // form 表单
    keyword: undefined,
  });
  const count = ref()
  const actionRef = ref(); // 表格ref
  const schemas: FormSchema[] = [ // BasicForm 配置
    {
      field: 'keyword',
      component: 'NInput',
      label: '',
      giProps: { span: '4'},
      componentProps: {
        placeholder: '请输入用户ID/昵称',
      },
    },
  ];
  const [register, {}] = useForm({ 
    gridProps: {  xGap: '12'},
    labelWidth: 80,
    schemas,
  });
  const loadDataTable = async (res) => { // table 请求配置
    let params = {
      ...formParams,
      ...res,
    }
    const {data}= await getOnlineUser(params);
    count.value = data.total_count
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
</script>
