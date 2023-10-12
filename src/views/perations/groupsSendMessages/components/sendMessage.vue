<template>
  <n-card :bordered="false" class="proCard">
    <n-grid cols="1 s:1 m:1 l:1 xl:1 2xl:3" responsive="screen">
      <n-grid-item>
        <n-form :model="formParams"  :rules="rules" ref="formRef" :label-width="100"  label-placement="left">
          <n-form-item label="发送者ID：" path="sender_ids" >
            <!-- <n-input placeholder="请输入用户ID，可以输入多个发送者ID，用英文格式的逗号隔开"  v-model:value="formParams.sender_ids"/> -->
            <n-select :render-tag="renderTagFriends" :render-label="renderLableFriends" v-model:value="formParams.sender_ids" placeholder="填写ID/账号/手机号/昵称" label-field="nick_name" value-field="user_id" multiple filterable   :options="usrerOptions" clearable remote :clear-filter-after-select="false" @search="searchUserHttp"/>
            <span class="ml-5 w-1/2 align-middle text-red-500">消息将通过所填用户，发给他的所有好友</span>
          </n-form-item>
          <n-form-item label="消息内容：" path="content">
            <n-input type="textarea" rows="20" placeholder="请输入消息内容：" show-count maxlength="200" v-model:value="formParams.content" />
          </n-form-item>
          <n-form-item label="" path="" class="float-right">
            <n-button type="info" :loading="formBtnLoading" @click="confirmForm" >发送</n-button>
          </n-form-item>
        </n-form>
      </n-grid-item>
    </n-grid>
    
  </n-card>
  </template>
    <script lang="ts" setup >
      import {ref, reactive, unref, h} from 'vue';
      import { sendMessage} from '@/api/perations';
      import { NTag, SelectOption, SelectRenderTag, useDialog,useMessage } from 'naive-ui';
      import  {encrypt}  from '@/utils/ase'
      import {searchUser } from '@/api/user';
      const message = useMessage();
      const dialog = useDialog();
      const formRef: any = ref(null);
      const formBtnLoading = ref(false);
      const usrerOptions = ref([])
      const formParams = reactive({
        sender_ids:[],
        content: undefined,
      });
      const rules:any = {
        sender_ids: {
          type:'array',
          required: true,
          trigger: ['blur', 'input'],
          message: '请填写ID/账号/手机号/昵称',
        },
        content: {
          required: true,
          trigger: ['blur', 'input'],
          message: '请输入消息内容',
        }
      };
      const renderLableFriends =  (option: SelectOption)=> {
        return option.nick_name + '(' + option.user_id + ')'
      }
      const renderTagFriends: SelectRenderTag = ({ option, handleClose }) => {
        return h(
          NTag,{
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
      }
      async function searchUserHttp(e){
        if(!e) return 
        try {
          const data = await searchUser({search:e})
          usrerOptions.value =data.list
        } catch (error:any) {
          message.error(error.message)
        }
      }
      function confirmForm(){
        formRef.value.restoreValidation
        formRef.value.validate(async (errors: boolean) => {
          if (!errors) {
            const send = dialog.info({
              title: '提示',
              content: `是否群发消息？`,
              positiveText: '确定',
              negativeText: '取消',
              onPositiveClick: async () => {
                send.loading = true
                let parmas:any = {
                  sender_ids:formParams.sender_ids,
                  content:encrypt(JSON.stringify({'text':formParams.content})) 
                }
                if(parmas.sender_ids&&parmas.sender_ids.length>1){
                  parmas.sender_ids = parmas.sender_ids.join(',')
                }else if(parmas.sender_ids&&parmas.sender_ids.length==1){
                  parmas.sender_ids = parmas.sender_ids.toString()
                }else {
                  parmas.sender_ids = ""
                }
                try {
                  const data =  await sendMessage(parmas)
                  message.success(data)
                  formBtnLoading.value = false
                  Object.assign(unref(formParams),{sender_ids:null,content: null})
                } catch (error:any) {
                  message.error(error.message)
                  formBtnLoading.value = false
                }
              }
            });
          }
        });
      }
    </script>
