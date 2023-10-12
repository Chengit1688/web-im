<template>
    <n-card :bordered="false" class="proCard" >
        <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset" />
        <BasicTable :columns="columns" :request="loadDataTable" :row-key="(row) => row.id" ref="actionRef"
            :actionColumn="actionColumn">
        </BasicTable>
        <editModal ref="editModalShow" :options="options" @childToParent="childToParent"/>
    </n-card>
    
</template>
  
<script lang="ts" setup>
    import { h, reactive, ref, unref, } from 'vue';
    import { BasicTable,TableAction } from '@/components/Table';
    import { getRedeemPrize} from "@/api/perations"
    import editModal from "./dialog/edit.vue"
    import { formatToDateTime } from '@/utils/dateUtil';
    import { BasicForm,FormSchema, useForm } from '@/components/Form/index';
    const options = ref<any>([])
    const editModalShow = ref()

    const statusType = [
       
        { label: '充值中', value: 1 },
        { label: '充值成功', value: 2 },
        { label: '待出库', value: 21 },
        { label: '已发货', value: 22 },
    ]

    const actionRef = ref()

    const formParams = reactive({ // form 表单
        create_user_id: undefined,
        title:undefined,
    });
    const childToParent = ()=>{
    actionRef.value.reload({page: 1, page_size: 20})
  }

    const formModel = reactive({ // form 表单
        title:undefined,
        video:undefined,
        imgs:[],
        content:undefined,
    });

    const actionColumn = [
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      flexd:'right',
      align: 'center',
      width: 150,
      render(record) {
        return h(TableAction as any, {
          style: 'text',
          actions: createActions(record),
        });
      },
    },
]

function createActions(record:any) {
    return [
  
      {
        label: '编辑',
        type: 'primary',
        onClick: handleEdit.bind(null, record),
        ifShow: () => {
          return true;
        },
      },
    ];
  }
   
    const columns = [
    {
            title: '用户ID',
            key: 'user_id',
            align:'center',
            width:120
        },
        {
            title: '用户姓名',
            key: 'user_name',
            align:'center',
            width:120
        },
        {
            title: '手机号',
            key: 'mobile',
            align:'center',
            width:140
        },
        {
            title: '奖品名称',
            key: 'name',
            align:'center',
            width:140
        },
        {
            title: '是否虚拟商品',
            key: 'mobile',
            align:'center',
            width:140,
            render: (row) => (row.is_fictitious === 1 ? '虚拟商品' : '实物'),
        },
        {
            title: '消耗金币',
            key: 'cost',
            align:'center',
            width:140,
            render: (row) => (isNaN(row.cost / 100) ? '0' : row.cost / 100),
        },
        {
            title: '地址',
            key: 'address',
            align:'center',
           
        },
        {
            title: '快递单号',
            key: 'express_number',
            align:'center',
            
        },
        {
            title: '状态',
            key: 'status',
            align:'center',
            width:120,
            render: (row) => (statusType.find(item => item.value === row.status)?.label || '-'),
        },
        {
            title: '创建时间',
            key: 'created_at',
            align:'center',
            render: (row) => (row.updated_at ? formatToDateTime(new Date(row.updated_at * 1000),'yyyy-MM-dd HH:mm:ss'): '-'),
           
            
        },
        {
            title: '更新时间',
            key: 'updated_at',
            align:'center',
            render: (row) => (row.updated_at ? formatToDateTime(new Date(row.updated_at * 1000),'yyyy-MM-dd HH:mm:ss'): '-'),
            
        }
    ]


    const schemas: FormSchema[] = [ // BasicForm 配置
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
      field: 'status',
      component: 'NSelect',
      label: '',
      giProps: { span: '4' },
      componentProps: {
        placeholder: '请选择状态',
        options: [
          ...statusType
        ],
      },
    },
    {
      field: 'is_fictitious',
      component: 'NSelect',
      label: '',
      giProps: { span: '4' },
      componentProps: {
        placeholder: '请选择商品类型',
        options: [
        {
             label: '虚拟',
             value: 1
           },
           {
             label: '实物',
             value: 2
           }
        ],
      },
    },
  ];

    const [register, {}] = useForm({ 
        gridProps: {  xGap: '12'},
        labelWidth: 80,
        schemas,

  });
  function handleEdit(record) {
    editModalShow.value.openModal(record)
  }

    const handleSubmit = (values: any) => {
        Object.assign(unref(formParams), values)
        actionRef.value.reload({page: 1, page_size: 20})
    }
    function handleReset(values: Recordable) { // 重置 
        for(let i in formParams){
            formParams[i] = values[i] || undefined
        }
        actionRef.value.reload({page: 1, page_size: 20})
    } 
    const loadDataTable = async (res) => { // table 请求配置
        let params = {
            ...formParams,
            ...res,
        }
    return await getRedeemPrize(params);
  };  
  </script>
  