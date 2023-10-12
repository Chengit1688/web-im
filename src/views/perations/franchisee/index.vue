<template>

  <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset" :show-advanced-button="false"/>
  <BasicTable :columns="columns" :request="loadDataTable" :row-key="(row) => row.id" ref="actionRef"
      :actionColumn="actionColumn">
  </BasicTable>

  <detailModal ref="detailModalShow" @childToParent="childToParent"/>
  <memberModal ref="memberModalShow" @childToParent="childToParent" />
</template>
  
<script lang="ts" setup>
    import { h, reactive, ref, unref, } from 'vue';
    import { BasicTable,TableAction } from '@/components/Table';
    import { getShoppingList } from "@/api/perations"
    import memberModal from "./dialog/member.vue"
    import detailModal from "./dialog/detail.vue"
    // import subordinateModal from "./subordinate.vue"
    import { formatToDateTime } from '@/utils/dateUtil';
    import { BasicForm,FormSchema, useForm } from '@/components/Form/index';

  const detailModalShow = ref()
  const memberModalShow = ref()

    const showFrom = ref(false)
    const actionRef = ref()

    const formParams = reactive({ // form 表单
        shop_id: 0,
        shop_name: undefined,
        status: 0,
    });

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
            align:'center',
            width:150
        },
        {
            title: '店铺名称',
            key: 'shop_name',
            align:'center'
        },
        {
            title: '状态',
            key: 'status',
            align:'center',
            render: (row) => (row.status == 1 ? '待审核' : row.status == 2 ? '审核通过' : row.status == 3 ? '审核拒绝' : '-' )
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
    ]


    const schemas: FormSchema[] = [ // BasicForm 配置
    {
      field: 'shop_name',
      component: 'NInput',
      label: '',
      giProps: { span: '4'},
      componentProps: {
        placeholder: '请输入店铺名称',
      },
    }
  ];

    const [register, {}] = useForm({ 
        gridProps: {  xGap: '12'},
        labelWidth: 80,
        schemas,

  });
    const showAddModal = (falg) =>{
        showFrom.value = !!falg
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

    return await getShoppingList(params);
  };  

  // 详情
  function handleDetail(row){
    detailModalShow.value.openModal(row)
  }
  function showMemberModalShowModal(row) {
    memberModalShow.value.openModal(row);
  }


  const childToParent = ()=>{
    actionRef.value.reload()
  }
  </script>
  