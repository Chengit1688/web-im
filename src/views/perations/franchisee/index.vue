<template>
  <BasicForm
    @register="register"
    @submit="handleSubmit"
    @reset="handleReset"
    @export="handleExport"
    :show-advanced-button="false"
    show-export-button
  />
  <BasicTable
    :columns="columns"
    :request="loadDataTable"
    :row-key="(row) => row.id"
    ref="actionRef"
    :actionColumn="actionColumn"
  />

  <detailModal ref="detailModalShow" @childToParent="childToParent" />
  <memberModal ref="memberModalShow" @childToParent="childToParent" />
</template>

<script lang="ts" setup>
  import { h, reactive, ref, unref } from 'vue';
  import { BasicTable, TableAction } from '@/components/Table';
  import { getShoppingList } from '@/api/perations';
  import memberModal from './dialog/member.vue';
  import detailModal from './dialog/detail.vue';
  // import subordinateModal from "./subordinate.vue"
  import { formatToDateTime } from '@/utils/dateUtil';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { NImage } from 'naive-ui';
  import { formatUrl } from '@/utils';
  import * as XLSX from 'xlsx';

  const statusType = [
    { label: '待审核', value: 1 },
    { label: '审核中', value: 2 },
    { label: '审核通过', value: 3 },
    { label: '审核驳回', value: 4 },
  ];

  const detailModalShow = ref();
  const memberModalShow = ref();

  const showFrom = ref(false);
  const actionRef = ref();

  const formParams = reactive({
    // form 表单
    shop_id: 0,
    shop_name: undefined,
    status: 0,
  });

  const formModel = reactive({
    // form 表单
    title: undefined,
    video: undefined,
    imgs: [],
    content: undefined,
  });

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
  ];

  function createActions(record: any) {
    return [
      //   {
      //     label: '编辑',
      //     type: 'primary',
      //     onClick: ()=>{
      //         Object.assign(formModel,{

      //         })
      //     },
      //     // 根据业务控制是否显示 isShow 和 auth 是并且关系
      //     ifShow: () => {
      //       return true;
      //     },
      //   },
      {
        label: '详情',
        type: 'primary',
        onClick: handleDetail.bind(null, record),
        ifShow: () => {
          return true;
        },
      },
      {
        label: '团队成员',
        type: 'primary',
        onClick: showMemberModalShowModal.bind(null, record),
        ifShow: () => {
          return true;
        },
      },
    ];
  }

  const columns = [
    {
      title: '申请人',
      key: 'nick_name',
      align: 'center',
      width: 150,
    },
    {
      title: '申请人ID',
      key: 'user_id',
      align: 'center',
      width: 150,
    },
    {
      title: '申请时间',
      key: 'CreatedAt',
      align: 'center',
      width: 150,
      render: (row) =>
        row.CreatedAt ? formatToDateTime(new Date(row.CreatedAt * 1000), 'yyyy-MM-dd HH:mm') : '-',
    },
    {
      title: '店铺名称',
      key: 'shop_name',
      align: 'center',
    },
    {
      title: '营业执照',
      key: 'license',
      align: 'center',
      width: 140,
      render(row) {
        if (row.license) {
          return h(NImage, {
            style: 'border-radius: 3px;height:80px;',
            height: 80,
            width: 80,
            src: row.license ? formatUrl(row.license) : '',
          });
        }
        return '';
      },
    },
    {
      title: '店面照片',
      key: 'shop_icon',
      align: 'center',
      render(row) {
        return h(NImage, {
          style: 'border-radius: 3px;height:80px;',
          height: 80,
          width: 80,
          src: row.shop_icon[0] ? formatUrl(row.shop_icon[0]) : '',
        });
      },
    },
    {
      title: '状态',
      key: 'status',
      align: 'center',
      render: (row) =>
        row.status == 1
          ? '待审核'
          : row.status == 2
          ? '审核中'
          : row.status == 3
          ? '审核通过'
          : '审核驳回',
    },

    // {
    //     title: '申请时间',
    //     key: 'created_at',
    //     align:'center',
    //     render: (row) => (row.updated_at ? formatToDateTime(new Date(row.updated_at * 1000),'yyyy-MM-dd HH:mm:ss'): '-'),
    //      width:200

    // },
    // {
    //     title: '更新时间',
    //     key: 'updated_at',
    //     align:'center',
    //     render: (row) => (row.updated_at ? formatToDateTime(new Date(row.updated_at * 1000),'yyyy-MM-dd HH:mm:ss'): '-'),
    //      width:200
    // }
  ];

  const schemas: FormSchema[] = [
    // BasicForm 配置
    {
      field: 'shop_name',
      component: 'NInput',
      label: '',
      giProps: { span: '4' },
      componentProps: {
        placeholder: '请输入店铺名称',
      },
    },
    {
      field: 'user_id',
      component: 'NInput',
      label: '',
      giProps: { span: '4' },
      componentProps: {
        placeholder: '请输入申请人ID',
      },
    },
    {
      field: 'status',
      component: 'NSelect',
      label: '',
      giProps: { span: '4' },
      componentProps: {
        placeholder: '请选择状态',
        options: [...statusType],
      },
    },
    {
      field: 'CreatedAt',
      component: 'NDatePicker',
      label: '',
      defaultValue: null,
      giProps: { span: '6'},
      componentProps: {
        placeholder:'请选择时间',
        type: 'date',
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
  const showAddModal = (falg) => {
    showFrom.value = !!falg;
  };

  const handleSubmit = (values: any) => {
    Object.assign(unref(formParams), values);
    actionRef.value.reload({ page: 1, page_size: 20 });
  };
  const handleExport = async () => {
    let params = {
      ...formParams,
      page: 1,
      page_size: 9999,
    };
    const res = await getShoppingList(params);
    if (res) {
      const { list } = res;
      let result = list.map((item) => {
        let { account, user_id, CreatedAt, shop_name, shop_icon, status ,license} = item;
        status = status == 1 ? '待审核' : status == 2 ? '审核通过' : status == 3 ? '审核拒绝' : '-';
        return [
          account || '-',
          user_id || '-',
          CreatedAt ? formatToDateTime(new Date(CreatedAt * 1000), 'yyyy-MM-dd HH:mm') : '-',
          shop_name || '-',
          license ? formatUrl(license) : '-',
          shop_icon[0] ? formatUrl(shop_icon[0]) : '-',
          status,
        ];
      });
      result = [['申请人', '申请人ID', '申请时间', '店铺名称', '照片', '状态'], ...result];
      // 创建工作表
      const data = XLSX.utils.aoa_to_sheet(result);
      // 创建工作簿
      const wb = XLSX.utils.book_new();
      // 将工作表放入工作簿中
      XLSX.utils.book_append_sheet(wb, data, 'data');
      // 生成文件并下载
      XLSX.writeFile(wb, '加盟商.xlsx');
    }
  };

  function handleReset(values: Recordable) {
    // 重置
    for (let i in formParams) {
      formParams[i] = values[i] || undefined;
    }
    actionRef.value.reload({ page: 1, page_size: 20 });
  }

  const loadDataTable = async (res) => {
    // table 请求配置
    console.log('res==>>', res);
    let params = {
      ...formParams,
      ...res,
    };

    return await getShoppingList(params);
  };

  // 详情
  function handleDetail(row) {
    detailModalShow.value.openModal(row);
  }

  function showMemberModalShowModal(row) {
    memberModalShow.value.openModal(row);
  }

  const childToParent = () => {
    actionRef.value.reload();
  };
</script>
