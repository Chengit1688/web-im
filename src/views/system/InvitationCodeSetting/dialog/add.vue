<template>
  <n-modal id="basic-modal" v-model:show="showModal" :show-icon="false" preset="card" title="添加邀请码" style="width:40%">
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
  import { h, ref, VNodeChild} from 'vue';
  import { addInviteCode} from '@/api/system';
  import { NTag, SelectOption, useMessage } from 'naive-ui';
  import { BasicForm, FormSchema, useForm } from '@/components/Form/index';
  import { searchUser ,searchGroup} from '@/api/user';
  const emit = defineEmits(['childToParent']);
  const message = useMessage();
  const showModal = ref(false)
  const groupOptions = ref([])
  const friendsOptions = ref([])
  const schemas: FormSchema[] = [ // BasicForm 配置
    {
      field: 'invite_code',
      component: 'NInput',
      label: '邀请码',
      componentProps: {
        placeholder: '请输入邀请码',
        allowInput:onlyAllowNumber
      },
      rules: [{ required: true, message: '请输入邀请码', trigger: ['blur'] }],
    },
    {
      field: 'default_groups',
      component: 'NSelect',
      label: '默认群',
      componentProps: {
        placeholder: '填写群ID/群账号',
        remote:true,
        clearable:true,
        filterable:true,
        multiple:true,
        clearFilterAfterSelect:false,
        options: groupOptions,
        labelField:'name',
        valueField:'group_id',
        renderLabel:  (option: SelectOption): VNodeChild => {
          return option.name + '(' + option.group_id + ')'
        },
        renderTag: ({ option, handleClose }) => {
          return h(
            NTag,
            {
              closable: true,
              round:true,
              size:'small',
              bordered:false,
              style:'width:80px',
              onMousedown: (e: FocusEvent) => {
                e.preventDefault()
              },
              onClose: (e: MouseEvent) => {
                e.stopPropagation()
                handleClose()
              }
            },
            { default: () => option.name }
          )
        },
        onSearch: async (e: any) => {
          if(!e) return 
          try {
            const data = await searchGroup({search:e})
            groupOptions.value =data.list
          } catch (error:any) {
            message.error(error.message)
          }
        },
      },
    },
    {
      field: 'default_friends',
      component: 'NSelect',
      label: '默认好友',
      componentProps: {
        placeholder: '填写ID/账号/手机号/昵称',
        remote:true,
        clearable:true,
        filterable:true,
        multiple:true,
        clearFilterAfterSelect:false,
        options: friendsOptions,
        labelField:'nick_name',
        valueField:'user_id',
        renderLabel:  (option: SelectOption): VNodeChild => {
          return option.nick_name + '(' + option.user_id + ')'
        },
        renderTag: ({ option, handleClose }) => {
          return h(
            NTag,
            {
              closable: true,
              round:true,
              size:'small',
              bordered:false,
              style:'width:80px',
              onMousedown: (e: FocusEvent) => {
                e.preventDefault()
              },
              onClose: (e: MouseEvent) => {
                e.stopPropagation()
                handleClose()
              }
            },
            { default: () => option.nick_name }
          )
        },
        onSearch: async (e: any) => {
          if(!e) return 
          try {
            const data = await searchUser({search:e})
            friendsOptions.value =data.list
          } catch (error:any) {
            message.error(error.message)
          }
        },
      },
    },
    {
      field: 'greet_msg',
      component: 'NInput',
      label: '默认好友打招呼消息',
      componentProps: {
        placeholder: '请输入默认好友打招呼消息',
        type:'textarea',
        maxlength:"200",
        showCount:true
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
    },
  ];
  const [register, {}] = useForm({ 
    gridProps: {   cols: 1},
    labelWidth: 80,
    labelPlacement:'top',
    schemas,
    layout:'horizontal'
  });
  function onlyAllowNumber (value: string){
    return !value || /^\d+$/.test(value) && !value.startsWith(' ') && !value.endsWith(' ')
  }
  
  function openModal (){
    showModal.value = true
  }
  defineExpose({
    openModal
  })
  async function confirmForm(values){
    let data = values
    if(data.default_friends&&data.default_friends.length>1){
      data.default_friends = data.default_friends.join(',')
    }else if(data.default_friends&&data.default_friends.length==1){
      data.default_friends = data.default_friends.toString()
    }else {
      data.default_friends = ""
    }
    if(data.default_groups&&data.default_groups.length>1){
      data.default_groups = data.default_groups.join(',')
    }else if(data.default_groups&&data.default_groups.length==1){
      data.default_groups = data.default_groups.toString()
    }else {
      data.default_groups = ""
    }
    try {
      await addInviteCode(data)
      emit('childToParent')
      showModal.value = false
      message.success('添加成功');
    } catch (error:any) {
      message.error(error.message)
    } 
  }
  
</script>