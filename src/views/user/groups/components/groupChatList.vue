<template>
  <n-modal  v-model:show="showModal" :show-icon="false" preset="dialog" :title="`群名称：${groupName}`" style="width:80%;">
    <n-card :bordered="false" class="proCard">
      <BasicForm @register="register" @submit="handleSubmit" @reset="handleReset" :show-advanced-button="false"/>
      <BasicTable
        :columns="chatColumns"
        :request="loadDataTable"
        :row-key="(row) => row.msg_id"
        ref="actionRef"
        :actionColumn="actionColumn"
      >
        <template #tableTitle>
          <n-button type="warning" class="mr-5" @click="exportList"> 
            <template #icon>
              <n-icon>
                <ExportOutlined />
              </n-icon>
            </template>
            导出聊天记录
          </n-button>
        </template>
      </BasicTable>
      <preview ref="previewModalShow" />
    </n-card>
  </n-modal>
</template>

<script lang="ts" setup>
  import { h, reactive, ref, unref } from 'vue';
  import { BasicTable, TableAction} from '@/components/Table';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index'; 
  import { getGroupChat,deleteMessage, searchUser} from '@/api/user/index';
  import {chatColumns,typeNameList} from "./columns"
  import { useMessage, useDialog, NButton } from 'naive-ui';
  import {downloadFile} from '@/utils/index'
  import { ExportOutlined} from '@vicons/antd';
  import preview from "./dialog/preview.vue"
  const previewModalShow = ref()
  const groupId = ref('')
  const groupName = ref('')
  const actionRef = ref(); // 表格ref
  const message = useMessage();
  const dialog = useDialog();
  const showModal = ref(false);
  const usrerOptions = ref([])
  const formParams = reactive({ // form 表单
    recv_id:undefined,
    send_id:undefined,
    type:undefined,
    time: [],
    content:undefined,

  });
  const actionColumn = [
    {
      index:4,
      title: '聊天内容',
      key: 'content',
      align:'center',
      width:400,
      render: (row) => (isJSON(row.content)?selectType(row.type,JSON.parse(row.content)):''),
      ellipsis: {
        tooltip: {
          width:800,
          style:"max-height: 400px",
          scrollable:true,
        }
      }
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'action',
      align: 'center',
      render(record) {
        return h(TableAction as any, {
          style: 'text',
          actions: createActions(record),
        });
      },
    },
  ]
  function createActions(record) {
    return [
      {
        label: '删除',
        type: 'error',
        onClick: handleDelted.bind(null, record),
        ifShow: () => {
          return true
        },
      }
    ];
  }
  function selectType(type,obj){
    if(type==3 || type==4 || type==5){
      return  h(
        NButton,
        {
          style:"cursor:pointer;color:#3c9bff",
          size: 'small',
          text:true,
          onClick: () => previewClick(type,obj)
        },
        { default: () => '预览' }
      );
    }else if(type==6){
      return  h(
        NButton,
        {
          style:"cursor:pointer;color:#3c9bff",
          size: 'small',
          text:true,
          onClick: () => download(obj)
        },
        { default: () => '下载' }
      );
    }else if(type==1 || type==2 || type==8 || type==7 ||  type==9){
      return obj.text
    }else if (type==0){
      return "未知"
    }else {
      return ""
    }
  }
  const schemas: FormSchema[] = [ // BasicForm 配置
    {
      field: 'content',
      component: 'NInput',
      label: '',
      giProps: { span: '4'},
      componentProps: {
        placeholder: '请输入聊天内容',
      },
    },
    {
      field: 'send_id',
      component: 'NSelect',
      label: '',
      giProps: { span: '6'},
      componentProps: {
        placeholder: '请输入发送人ID/昵称/账号/手机号',
        remote:true,
        clearable:true,
        filterable:true,
        options: usrerOptions,
        labelField:'nick_name',
        valueField:'user_id',
        onSearch: async (e: any) => {
          try {
            const data = await searchUser({search:e})
            usrerOptions.value =data.list
          } catch (error:any) {
            message.error(error.message)
          }
        },
      },
    },
    {
      field: 'type',
      component: 'NSelect',
      label: '',
      giProps: { span: '4'},
      componentProps: {
        placeholder: '请选择消息类型',
        options: typeNameList
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
    gridProps: {  xGap: '12'},
    labelWidth: 80,
    schemas,

  });
  function isJSON(str) {
    if (typeof str == 'string') {
      try {
        let obj=JSON.parse(str);
        if(typeof obj == 'object' && obj ){
            return true;
        }else{
            return false;
        }
      } catch(e) {
        return false;
      }
    }
  }
  function openModal (row){
    groupId.value = row.group_id
    groupName.value = row.name
    Object.assign(unref(formParams), {
      recv_id:undefined,
      send_id:undefined,
      type:undefined,
      time: [],
      content:undefined,
    })
    showModal.value = true
  }
  const loadDataTable = async (res) => { // table 请求配置
    let params = {
      ...formParams,
      ...res,
    }
    params.recv_id = groupId.value
    if(params.time&&params.time.length>0){
      params.start_time = parseInt(params.time[0])
      params.end_time = parseInt(params.time[1])
    }
    params.conversation_type = 2
    delete params.time
    const {data} = await getGroupChat(params)
    return data
  };
  // 导出数据
  async function exportList(){
    const clear =  dialog.info({
      title: '提示',
      content: `确定导出${groupName.value}的群聊天记录？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        clear.loading = true
        let params:any = {
          ...formParams,
        };
        if(params.time&&params.time.length>0){
          params.start_time = parseInt(params.time[0])
          params.end_time = parseInt(params.time[1])
        }
        params.conversation_type= 1
        params.export = true
        delete params.time
        try {
          const data = await getGroupChat(params)
          const xlsx = 'application/octet-stream'
          const blob = new Blob([data], { type: xlsx })
          //转换数据类型
          const a = document.createElement('a') // 转换完成，创建一个a标签用于下载
          // const name = res.headers['content-disposition']
          // a.download = name.split('=')[1]
          a.href = URL.createObjectURL(blob)
          a.setAttribute('download', `${groupName.value} 聊天记录.xlsx`);
          a.click()
          a.remove()
          // 直接打开下载文件的链接
          // window.location.href = res.request.responseURL
        } catch (error:any) {
          message.error(error.message)
        }
      }
    });
  }
  defineExpose({
    openModal
  })
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
  function previewClick(type,row){
    let obj = Object.assign({type:type},row)
    previewModalShow.value.openModal(obj)
  }
  function download(row){
    downloadFile(row.file_info.file_url,row.file_info.file_name)
    // const link = document.createElement('a')
    // link.style.display = 'none'
    // link.href = "#"
    // console.log(link.href)
    // // link.target = '_blank'
    // link.download = row.file_info.file_url
    // link.setAttribute('download', row.file_info.file_url)
    // document.body.appendChild(link)
    // link.click()
  }
  function handleDelted (row) {
    const out = dialog.info({
      title: '提示',
      content: `是否删除此条记录？`,
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: async () => {
        out.loading = true
        let params = {
          group_id:groupId.value,
          msg_id_list:[row.msg_id],
          status:3
        }
        try {
          await deleteMessage(params)
          message.success(`删除成功`);
          actionRef.value.reload({page: 1, page_size: 20})
        } catch (error:any) {
          message.error(error.message)
        } 
      }
    });
  }
  
</script>
