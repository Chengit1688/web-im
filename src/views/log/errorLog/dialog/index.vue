<template>
  <n-modal
    id="basic-modal"
    v-model:show="showModal"
    :show-icon="false"
    preset="dialog"
    :title="`邀请码：${inviteCode}`"
    style="width: 1500px"
  >
    <n-card :bordered="false" class="proCard">
      <BasicForm
        @register="register"
        @submit="handleSubmit"
        @reset="handleReset"
        :show-advanced-button="false"
      />
      <BasicTable
        :request="loadDataTable"
        :row-key="(row) => row.id"
        ref="actionRef"
        :actionColumn="infoColumns"
      >
      </BasicTable>
    </n-card>
  </n-modal>
</template>
<script lang="ts" setup>
  import { ref, reactive, unref } from 'vue';
  import { BasicTable} from '@/components/Table';
  import { getInviteCodeInfo} from '@/api/perations';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { infoColumns } from '../columns';
  const actionRef = ref(); // 表格ref
  const inviteCode = ref('')
  const showModal = ref(false);
  const formParams = reactive({
    // form 表单
    nick_name: undefined,
    account: undefined,
    phone_number: undefined,
    time: [],
  });
  const loadDataTable = async (res) => { // table 请求配置
    let params = {
      ...formParams,
      ...res,
    }
    if(params.time&&params.time.length>0){
      params.begin_date = parseInt(params.time[0]/1000)
      params.end_date = parseInt(params.time[1]/1000)
    }
    delete params.time
    params.invite_code =inviteCode.value
    return await getInviteCodeInfo(params)
    
  };
  const schemas: FormSchema[] = [
    // BasicForm 配置
    {
      field: 'account',
      component: 'NInput',
      label: '',
      giProps: { span: '6' },
      componentProps: {
        placeholder: '请输入账号',
      },
    },
    {
      field: 'nick_name',
      component: 'NInput',
      label: '',
      giProps: { span: '6' },
      componentProps: {
        placeholder: '请输入昵称',
      },
    },
    {
      field: 'phone_number',
      component: 'NInput',
      label: '',
      giProps: { span: '6' },
      componentProps: {
        placeholder: '请输入手机号',
      },
    },
    {
      field: 'time',
      component: 'NDatePicker',
      label: '',
      defaultValue: null,
      giProps: { span: '6'},
      componentProps: {
        type: 'datetimerange',
        clearable: false,
        defaultTime:['00:00:00','23:59:59'],
      },
    }
    
  ];
  const [register, {}] = useForm({
    gridProps: { xGap: '12' },
    labelWidth: 80,
    schemas,
  });

  function openModal(record) {
    Object.assign(unref(formParams), record)
    inviteCode.value = record.invite_code
    showModal.value = true;
  }
  function handleSubmit(values: Recordable) { // 搜索
    Object.assign(unref(formParams),values)
    actionRef.value.reload({page: 1, show: 20})
  }
  function handleReset(values: Recordable) { // 重置 
    for(let i in formParams){
      formParams[i] = values[i] || undefined
    }
    formParams.time = []
    actionRef.value.reload({page: 1, page_size: 20})
  }
  defineExpose({
    openModal,
  });
</script>
