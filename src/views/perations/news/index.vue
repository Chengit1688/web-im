<template>
    <n-card :bordered="false" class="proCard" v-if="!showFrom">
        <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset" />
        <BasicTable :columns="columns" :request="loadDataTable" :row-key="(row) => row.id" ref="actionRef"
            :actionColumn="actionColumn">
            <template #tableTitle>
                <n-button type="primary" @click="showAddModal" class="mr-5">
                    <template #icon>
                        <n-icon>
                            <PlusOutlined />
                        </n-icon>
                    </template>
                    创建新闻
                </n-button>

            </template>

        </BasicTable>
    </n-card>

    <dialogForm v-if="showFrom" :formModel="formModel" @handleShowModal="showAddModal"></dialogForm>
</template>
  
<script lang="ts" setup>
    import { h, reactive, ref, unref, } from 'vue';
    import { BasicTable,TableAction } from '@/components/Table';
    import { getNewsList,deleteNews } from "@/api/perations"
    import dialogForm from './dialogForm.vue';
    import { formatToDateTime } from '@/utils/dateUtil';
    import { BasicForm,FormSchema, useForm } from '@/components/Form/index';

    const showFrom = ref(false)
    const actionRef = ref()

    const formParams = reactive({ // form 表单
        create_user_id: undefined,
        title:undefined,
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
        label: '删除',
        type: 'primary',
        onClick: ()=>{
            deleteNews({
                id: record.id
            }).then(res=>{
                if(res.code === 200){
                    actionRef.value.reload()
                }
            })
        },
        ifShow: () => {
          return true;
        },
      },
    ];
  }
   
    const columns = [
        {
            title: '新闻标题',
            key: 'title',
            align:'center',
            width:150
        },
        // {
        //     title: '创建者',
        //     key: 'create_nickname',
        //     align:'center'
        // },
        {
            title: '创建时间',
            key: 'created_at',
            align:'center',
            render: (row) => (row.updated_at ? formatToDateTime(new Date(row.updated_at * 1000),'yyyy-MM-dd HH:mm:ss'): '-'),
             width:200
            
        },
        {
            title: '更新时间',
            key: 'updated_at',
            align:'center',
            render: (row) => (row.updated_at ? formatToDateTime(new Date(row.updated_at * 1000),'yyyy-MM-dd HH:mm:ss'): '-'),
             width:200
        }
    ]


    const schemas: FormSchema[] = [ // BasicForm 配置
    {
      field: 'title',
      component: 'NInput',
      label: '',
      giProps: { span: '4'},
      componentProps: {
        placeholder: '请输入新闻标题',
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
    return await getNewsList(params);
  };  
  </script>
  