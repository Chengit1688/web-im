<template>
    <n-modal
      id="basic-modal"
      v-model:show="showModal"
      :show-icon="false"
      preset="dialog"
      style="width: 1500px"
    >
      <n-card :bordered="false" class="proCard">
        <BasicTable
          :request="loadDataTable"
          :row-key="(row) => row.id"
          ref="actionRef"
          :actionColumn="columns"
        >
        <template #tableTitle>
     
        <n-button type="primary" class="mr-5" @click="handleDialog">
          <template #icon>
            <n-icon>
              <SettingFilled />
            </n-icon>
          </template>
          新增雷红包配置
        </n-button>
      </template>
        </BasicTable>
      </n-card>
      <RedConfig ref="redConfigShow"></RedConfig>
    </n-modal>
  </template>
  <script lang="ts" setup>
    import { ref, reactive, unref } from 'vue';
    import { BasicTable} from '@/components/Table';
    import { redpackConfigList} from '@/api/finance';
    import { FormSchema, useForm } from '@/components/Form/index';
    import { ExportOutlined, SettingFilled} from '@vicons/antd';
    import RedConfig from './redConfig.vue';
    const actionRef = ref(); // 表格ref
    const inviteCode = ref('')
    const showModal = ref(false);
    const redConfigShow = ref()

    const handleDialog = () =>{
      redConfigShow.value.openModal()
    }

    const columns = [
        {
            title: '金额',
            key: 'amount',
            align:'center',
            width:120
        },

        {
            title: '群名称',
            key: 'group_name',
            align:'center',
            width:150
        },
        
        {
            title: '发送者',
            key: 'sender_nick_name',
            align:'center',
            width:150
        },
        {
            title: '红包个数',
            key: 'total',
            align:'center',
            width:150
        }
    ]

    const formParams = reactive({
      // form 表单
     
    });
    const loadDataTable = async (res) => { // table 请求配置
      let params = {
        ...formParams,
        ...res,
      }
      return await redpackConfigList(params)
      
    };
   
  
  
    function openModal(record) {
  
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
  