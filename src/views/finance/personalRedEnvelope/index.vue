<template>
  <n-card :bordered="false" class="proCard">
    <BasicForm
      @register="register"
      @submit="handleSubmit"
      @reset="handleReset"
      :show-advanced-button="false"
    >
      <template #statusSlot="{ model, field }">
        <n-input v-model:value="model[field]" />
      </template>
    </BasicForm>

    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.id"
      ref="actionRef"
    >
      <template #tableTitle>
        <n-button type="warning" class="mr-5" @click="exportList">
          <template #icon>
            <n-icon>
              <ExportOutlined />
            </n-icon>
          </template>
          导出列表
        </n-button>
      </template>
      <template #tableFooter> 总人数：{{ countNumber }} </template>
    </BasicTable>
  </n-card>
</template>

<script lang="ts" setup>
  import { h, reactive, ref, unref } from 'vue';
  import { BasicTable } from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
 import { ExportOutlined} from '@vicons/antd';
  import { redpackSingleRecords, redpackSingleRecordsExport } from '@/api/finance/index';
  import { useDialog, useMessage } from 'naive-ui';
  import { columns } from './columns';
  const message = useMessage();
  const dialog = useDialog();
  const schemas: FormSchema[] = [
    // BasicForm 配置
    {
      field: 'sender_id',
      component: 'NInput',
      label: '',
      giProps: { span: '4' },
      componentProps: {
        placeholder: '请输入发送者用户ID',
      },
    },
    {
      field: 'receiver_id',
      component: 'NInput',
      label: '',
      giProps: { span: '4' },
      componentProps: {
        placeholder: '请输入接收者用户ID',
      },
    },

    {
      field: 'status',
      component: 'NSelect',
      label: '',
      giProps: { span: '4' },
      componentProps: {
        placeholder: '请选择登录类型',
        options: [
          {
            label: '待领取',
            value: '1',
          },
          {
            label: '已领取',
            value: '2',
          },
          {
            label: '已退回',
            value: '3',
          },
        ],
      },
    },
    {
      field: 'send_time',
      component: 'NDatePicker',
      label: '发送时间',
      // defaultValue: [new Date().setHours(0, 0, 0, 0), new Date().setHours(23, 59, 59, 0)],
      giProps: { span: '6' },
      componentProps: {
        type: 'datetimerange',
        clearable: false,
        // defaultTime: ['00:00:00', '23:59:59'],
      },
    },

    {
      field: 'recv_time',
      component: 'NDatePicker',
      label: '领取时间',
      // defaultValue: [new Date().setHours(0, 0, 0, 0), new Date().setHours(23, 59, 59, 0)],
      giProps: { span: '6' },
      componentProps: {
        type: 'datetimerange',
        clearable: false,
        // defaultTime: ['00:00:00', '23:59:59'],
      },
    },
  ];
  const [register, {}] = useForm({
    gridProps: { xGap: '12' },
    labelWidth: 80,
    schemas,
  });
  const info = ref({
    title: '',
    message: '',
  });
  const actionRef = ref(); // 表格ref
  const formParams = reactive({
    // form 表单
    sender_id: '',
    receiver_id: '',
    status: '',
    send_time_start: '',
    send_time_end: '',
    recv_time_start: '',
    recv_time_end: '',
    send_time: '',
    recv_time: '',
  });

  const loadDataTable = async (res) => {
    // table 请求配置
    let params = {
      ...formParams,
      ...res,
    };
    params.send_time_start = params.send_time?.[0];
    params.send_time_end = params.send_time?.[1];
    params.recv_time_start = params.recv_time?.[0];
    params.recv_time_end = params.recv_time?.[1];

    delete params.send_time;
    delete params.recv_time;

    try {
      return await redpackSingleRecords(params);
    } catch (error: any) {
      message.error(error.message);
    }
  };
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
  function showModel(value, msg) {
    info.value.title = msg;
    info.value.message = value;
  }

  // 导出数据
  async function exportList() {
    const clear = dialog.info({
      title: '提示',
      content: `确定导出搜索后所有数据？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        clear.loading = true;
        let params: any = {
          ...formParams,
        };
        params.send_time_start = params.send_time?.[0];
        params.send_time_end = params.send_time?.[1];
        params.recv_time_start = params.recv_time?.[0];
        params.recv_time_end = params.recv_time?.[1];

        delete params.send_time;
        delete params.recv_time;


          const data = await redpackSingleRecordsExport(params);
          const xlsx = 'application/octet-stream';
           console.log(data)
          const blob = new Blob([data], { type: xlsx });
         
          //转换数据类型
          const a = document.createElement('a'); // 转换完成，创建一个a标签用于下载
          // const name = res.headers['content-disposition']
          // a.download = name.split('=')[1]
          a.href = URL.createObjectURL(blob);
          a.setAttribute('download', '个人红包记录.xlsx');
          a.click();
          a.remove();
        try {
        
          // 直接打开下载文件的链接
          // window.location.href = res.request.responseURL
        } catch (error: any) {
          message.error(error.message);
        }
      },
    });
  }
</script>
