<template>
  <n-card :bordered="false" class="proCard">
    <n-card class="mb-5">
      <span class="mr-5 ml-1 align-middle">签到开关</span>
      <n-switch
        :value="status"
        :loading="loading"
        :checked-value="1"
        :unchecked-value="2"
        size="medium"
        @update:value="handleChange"
      >
        <template #checked> 开 </template>
        <template #unchecked> 关 </template>
      </n-switch>
      <span class="ml-5 align-middle">（打开后，客户端显示签到入口）</span>
    </n-card>
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
      :dataSource="dataLIst"
      :row-key="(row) => row.id"
      ref="actionRef"
    />
  </n-card>
</template>

<script lang="ts" setup>
  import { reactive, ref, unref } from 'vue';
  import { BasicTable } from '@/components/Table';
  import { getSignList, getSign, setSign } from '@/api/finance';
  import { columns } from './columns';
  import { useMessage, useDialog } from 'naive-ui';
  import { FormSchema, BasicForm } from '@/components/Form';
  const status = ref(1);
  const loading = ref(false);
  const message = useMessage();
  const dialog = useDialog();
  const dataLIst: any = ref([]);
  const actionRef = ref(); // 表格ref
  const schemas: FormSchema[] = [
    // BasicForm 配置
    {
      field: 'user_id',
      component: 'NInput',
      label: '',
      giProps: { span: '4' },
      componentProps: {
        placeholder: '请输入用户ID',
      },
    },
    {
      field: 'nick_name',
      component: 'NInput',
      label: '',
      giProps: { span: '4' },
      componentProps: {
        placeholder: '请输入昵称',
      },
    },
    {
      field: 'time',
      component: 'NDatePicker',
      label: '',
      defaultValue: null,
      giProps: { span: '8' },
      componentProps: {
        placeholder: '请选择注册时间',
        type: 'datetimerange',
        clearable: false,
        defaultTime: ['00:00:00', '23:59:59'],
      },
    },
  ];

  const formParams = reactive({
    // form 表单
    user_id: undefined,
    nick_name: undefined,
    time: [],
  });
  function handleSubmit(values: Recordable) {
    // 搜索
    Object.assign(unref(formParams), values);
    actionRef.value.reload({ page: 1, page_size: 20 });
  }
  function handleReset(values: Recordable) {
    // 重置
    for (let i in formParams) {
      formParams[i] = values[i] || undefined;
    }
    actionRef.value.reload({ page: 1, page_size: 20 });
  }
  function handleChange(value) {
    dialog.info({
      title: '提示',
      content: `是否${value == 1 ? '开启' : '关闭'}签到？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        let params = {
          config: {
            sign: value,
          },
        };
        try {
          await setSign(params);
          message.success(`${value == 1 ? '开启' : '关闭'}成功`);
          status.value = value;
        } catch (error: any) {
          message.error(error.message);
        }
      },
    });
  }
  const loadDataTable = async (res) => {
    // table 请求配置
    let params = {
      ...formParams,
      ...res,
    };
    params.ID = params.ID ? params.ID * 1 : params.ID;
    if (params.time && params.time.length > 0) {
      params.begin_date = parseInt(params.time[0] / 1000);
      params.end_date = parseInt(params.time[1] / 1000);
    }
    delete params.time;
    try {
      getSignHttp();
      return await getSignList(params);
    } catch (error: any) {
      message.error(error.message);
    }
  };
  const getSignHttp = async () => {
    // table 请求配置
    try {
      const { sign } = await getSign();
      status.value = sign;
    } catch (error: any) {
      message.error(error.message);
    }
  };
</script>
