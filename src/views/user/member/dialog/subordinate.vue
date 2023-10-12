<template>
    <n-modal
      id="basic-modal"
      v-model:show="showModal"
      :show-icon="false"
      preset="dialog"
      title="下级列表"
      style="width: 1300px"
    >
      <n-card :bordered="false" class="proCard">
        <BasicTable
          :columns="subordinateColumns"
          :request="loadDataTable"
          :row-key="(row) => row.id"
          ref="actionRef"
        >
        </BasicTable>
      </n-card>
    </n-modal>
  </template>
  <script lang="ts" setup>
    import {ref, reactive } from 'vue';
    import { BasicTable } from '@/components/Table';
    import { getAgentLevel } from '@/api/user';
    import {  useForm } from '@/components/Form/index';
    import { subordinateColumns } from '../columns';


    const actionRef = ref(); // 表格ref
    const userId = ref('')
    const showModal = ref(false);
    const formParams = reactive({ // form 表单
       
    });
    const loadDataTable = async (res) => { // table 请求配置
      let params = {
        ...formParams,
        ...res,
      }
      params.invite_user_id = userId.value
      return await getAgentLevel(params)
      
    };
   
    const info = ref({
      userId:""
    });
   
  
    const [register, {}] = useForm({
      gridProps: { xGap: '12' },
      labelWidth: 80,

    });
  
    function openModal (row){
       
      userId.value = row.user_id
      showModal.value = true
    }
   
   
    defineExpose({
      openModal,
    });
  </script>
  