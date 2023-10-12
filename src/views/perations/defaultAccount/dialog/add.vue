<template>
  <n-modal id="basic-modal" v-model:show="showModal" :show-icon="false" preset="card" title="添加默认好友" style="width:30%">
    <BasicForm
      submitButtonText="确定"
      resetButtonText="取消"
      @register="register"
      @submit="confirmForm"
      @reset="showModal=false"
    />
  </n-modal>
</template>
<script lang="ts" setup >
  import {ref, VNodeChild} from 'vue';
  import { addDefaultAccount} from '@/api/perations';
  import { SelectOption, useMessage } from 'naive-ui';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { searchUser } from '@/api/user';
  const emit = defineEmits(['childToParent']);
  const message = useMessage();
  const showModal = ref(false)
  const sendOptions = ref([])
  
  const schemas: FormSchema[] = [ // BasicForm 配置
    {
      field: 'user_id',
      component: 'NSelect',
      label: '用户',
      giProps: { span: '4'},
      componentProps: {
        placeholder: '请输入用户ID/账号/手机号/昵称',
        remote:true,
        clearable:true,
        filterable:true,
        options: sendOptions,
        labelField:'nick_name',
        valueField:'user_id',
        renderLabel:  (option: SelectOption): VNodeChild => {
          return option.nick_name + '(' + option.user_id + ')'
        },
        onSearch: async (e: any) => {
          if(!e) return 
          try {
            const data = await searchUser({search:e})
            sendOptions.value =data.list
          } catch (error:any) {
            message.error(error.message)
          }
        },
      },
      rules: [{ required: true, message: '请输入用户ID/账号/手机号/昵称', trigger: ['blur'] }],
    },
    {
      field: 'greet_msg',
      component: 'NInput',
      label: '打招呼消息',
      componentProps: {
        placeholder: '请输入打招呼消息',
        type:'textarea'
      },
    },
    {
      field: 'remarks',
      component: 'NInput',
      label: '备注',
      componentProps: {
        placeholder: '请输入备注',
        type:'textarea'
      },
    }
  ];
  const [register, {}] = useForm({ 
    gridProps: {   cols: 1},
    labelWidth: 80,
    labelPlacement:'top',
    schemas,
    layout:'horizontal'

  });
  function openModal (){
    showModal.value = true
  }
  defineExpose({
    openModal
  })
  async function confirmForm(values){
    try {
      await addDefaultAccount(values)
      emit('childToParent')
      showModal.value = false
      message.success('添加成功');
    } catch (error:any) {
      message.error(error.message)
    } 
  }
  
</script>