<template>
    <n-card :bordered="false" class="proCard" >
        <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset" />
        <BasicTable :columns="columns" :request="loadDataTable" :row-key="(row) => row.id" ref="actionRef"
            :actionColumn="actionColumn">
        </BasicTable>
       
    </n-card>
    
</template>
  
<script lang="ts" setup>
    import { h, reactive, ref, unref, } from 'vue';
    import { BasicTable,TableAction } from '@/components/Table';
    import { getRealNameList,authRealName} from "@/api/perations"
    import editModal from "./dialog/edit.vue"
    import { formatToDateTime } from '@/utils/dateUtil';
    import {formatUrl} from '@/utils';
    import { BasicForm,FormSchema, useForm } from '@/components/Form/index';
import { NImage } from 'naive-ui';
import { PassThrough } from 'stream';
    const options = ref<any>([])
    const editModalShow = ref()

    const statusType = [
       
        { label: '未实名', value: 1 },
        { label: '审核中', value: 2 },
        { label: '审核通过', value: 3 },
        { label: '审核驳回', value: 4 },
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
        label: '通过',
        type: 'primary',
        onClick: handleAuthSubmit.bind(null, record, 3),
        ifShow: () => {
          return record.is_real_auth != 3;
        },
      },
      {
        label: '驳回',
        type: 'error',
        onClick: handleAuthSubmit.bind(null, record, 4),
        ifShow: () => {
          return record.is_real_auth != 4;
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
            title: '账号',
            key: 'account',
            align:'center',
            width:120
        },
       {
            title: '真实姓名',
            key: 'real_name',
            align:'center',
            width:120
        },
    
        {
            title: '身份证号',
            key: 'id_no',
            align:'center',
            width:180
        },
        {
            title: '身份证正面',
            key: 'id_front_img',
            align:'center',
            width:140,
            render(row) {
                return h(NImage, {
                    style: 'border-radius: 3px;height:80px;',
                    height: 80,
                    width: 80,
                    src: row.id_front_img ? formatUrl(row.id_front_img) : '',
                });
            }
        },
        {
            title: '身份证背面',
            key: 'id_back_img',
            align:'center',
            width:140,
            render(row) {
                return h(NImage, {
                    style: 'border-radius: 3px;height:80px;',
                    height: 80,
                    width: 80,
                    src: row.id_back_img ? formatUrl(row.id_back_img) : '',
                });
            }
        },
       
        {
            title: '审核状态',
            key: 'is_real_auth',
            align:'center',
            width:120,
            render: (row) => (statusType.find(item => item.value === row.is_real_auth)?.label || '-'),
        },
        {
            title: '创建时间',
            key: 'created_at',
            align:'center',
            render: (row) => (row.created_at ? formatToDateTime(new Date(row.created_at * 1000),'yyyy-MM-dd HH:mm:ss'): '-'),
            width:120,
        },
  
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
      field: 'is_real_auth',
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
   
  ];

    const [register, {}] = useForm({ 
        gridProps: {  xGap: '12'},
        labelWidth: 80,
        schemas,

  });
  const passThrough = (record) => {
    // 通过
  }

  const handleReject = (record) => {
    // 驳回
  }


  const handleAuthSubmit = (record: any, status) => {
    authRealName({is_real_auth: status, user_id: record.user_id}).then(res => {
        actionRef.value.reload({page: 1, page_size: 20})
    })
   
  }



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
    return await getRealNameList(params);
  };  
  </script>
  