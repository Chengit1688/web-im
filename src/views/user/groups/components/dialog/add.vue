<template>
    <n-modal  v-model:show="showModal" :show-icon="false" preset="dialog" title="添加群成员">
      <n-form :model="formParams"  :rules="rules" ref="formRef" :label-width="80" class="py-4" label-placement="left">
        <n-form-item label="" path="user_id_list">
          <n-select
            v-model:value="formParams.user_id_list"
            multiple
            filterable
            placeholder="请输入用户ID/昵称/手机号"
            :options="options"
            :loading="loading"
            clearable
            remote
            :clear-filter-after-select="true"
            label-field="nick_name"
            value-field="user_id"
            @search="handleSearch"

          />
        </n-form-item>
      </n-form>
  
      <template #action>
        <n-space>
          <n-button @click="() => (showModal = false)">取消</n-button>
          <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
        </n-space>
      </template>
    </n-modal>
  </template>
    <script lang="ts" setup >
      import {ref, reactive} from 'vue';
      import { addGroupMember} from '@/api/user';
      import { getUserList2} from '@/api/user';
      import { useMessage } from 'naive-ui';
      const emit = defineEmits(['childToParent']);
      const message = useMessage();
      const formRef: any = ref(null);
      const formBtnLoading = ref(false);
      const loading = ref(false);
      const options = ref([]);
      const groupId = ref()
      const formParams = reactive({
        user_id_list:[],
      });
      const rules:any = {
        user_id_list: {
          type:'array',
          required: true,
          trigger: 'change',
          message: '请输入群成员ID',
        },
      };
      const showModal = ref(false)
      function openModal (value){
        groupId.value = value
        formParams.user_id_list = []
        options.value=[]
        showModal.value = true
      }
      defineExpose({
        openModal
      })
      async function handleSearch(query: string){
        let parmas = {
          search_key:query,
          page: 1, 
          page_size: 20
        }
        loading.value = true
        try {
          const {list} = await getUserList2(parmas)
          if(list){
            options.value = list
          }
          
        } catch (error:any) {
          message.error(error.message)
        }
        loading.value = false
      }
      function confirmForm(){
        formRef.value.validate(async (errors: boolean) => {
          if (!errors) {
            formBtnLoading.value = true
            let parmas = JSON.parse(JSON.stringify(formParams))
            parmas.group_id = groupId.value
            try {
              await addGroupMember(parmas)
              showModal.value = false
              message.success('添加成功')
              emit('childToParent')
            } catch (error:any) {
              message.error(error.message)
            }
            formBtnLoading.value = false
          }
        });
      }
      
    </script>