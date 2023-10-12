<template>
    <n-card :bordered="false" class="proCard" >
        <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset" />
        <BasicTable :columns="columns" :request="loadDataTable" :row-key="(row) => row.id" ref="actionRef"
            :actionColumn="actionColumn">
            <template #tableTitle>
                <n-button type="primary" @click="handleEdit" class="mr-5">
                    <template #icon>
                        <n-icon>
                            <PlusOutlined />
                        </n-icon>
                    </template>
                    新增奖品
                </n-button>
            </template>
        </BasicTable>
        <editModal ref="editModalShow" :options="options" @childToParent="childToParent"/>
    </n-card>
    
</template>
  
<script lang="ts" setup>
    import { h, reactive, ref, unref, } from 'vue';
    import { BasicTable,TableAction } from '@/components/Table';
    import { getPrizeList,deletePrize} from "@/api/perations"
    import editModal from "./dialog/edit.vue"
    import { formatToDateTime } from '@/utils/dateUtil';
    import { NImage,useDialog,useMessage } from 'naive-ui';

    import { BasicForm,FormSchema, useForm } from '@/components/Form/index';
    import { formatUrl } from '@/utils';
    const options = ref<any>([])
    const editModalShow = ref()
    const dialog = useDialog();
    const message = useMessage();
    const statusType = [
       
        { label: '正常', value: 1 },
        { label: '删除', value: 2 },
       
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
    if(record.status === 2) return
    return [
  
      {
        label: '编辑',
        type: 'primary',
        onClick: handleEdit.bind(null, record),
        ifShow: () => {
          return true;
        },
      },
      {
        label: '删除',
        type: 'error',
        onClick: handleDelted.bind(null, record),
        ifShow: () => {
          return true;
        },
      },
    ];
  }
   
    const columns = [
    {
            title: '奖品名称',
            key: 'name',
            align:'center',
            width:150
        },
        {
            title: '是否虚拟商品',
            key: 'mobile',
            align:'center',
            width:140,
            render: (row) => (row.is_fictitious === 1 ? '虚拟商品' : '实物'),
        },
        {
            title: '奖品图片',
            key: 'icon',
            align:'center',
            width:140,
            render(row) {
                return h(NImage, {
                    style: 'border-radius: 3px;height:80px;',
                    height: 80,
                    width: 80,
                    src: row.icon ? formatUrl(row.icon) : '',
                });
            }
        },
        {
            title: '奖品描述',
            key: 'describe',
            align:'center',
      
        },
        {
            title: '虚拟奖品描述/值',
            key: 'fictitious_value',
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
  function handleEdit(record?:any) {
    editModalShow.value.openModal(record)
  }
  function handleDelted (row) {
    const out = dialog.info({
      title: '提示',
      content: `是否删除此条奖品？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        out.loading = true
        let params = {
          id: row.id
        }
        try {
          await deletePrize(params)
          message.success(`删除成功`);
          actionRef.value.reload({page: 1, page_size: 20})
        } catch (error:any) {
          message.error(error.message)
        } 
      }
    });
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
    return await getPrizeList(params);
  };  
  </script>
  