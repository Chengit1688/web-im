<template>
  <n-modal id="basic-modal" v-model:show="showModal" :show-icon="false" preset="card" title="编辑邀请码" style="width:40%">
    <n-form :model="formParams" :rules="rules" ref="formRef" :label-width="120" class="py-4">
      <n-form-item label="邀请码" path="invite_code">
        <n-input placeholder="请输入名称" :allow-input="onlyAllowNumber"  v-model:value="formParams.invite_code" />
      </n-form-item>
      <n-form-item label="默认群" path="default_groups">
        <n-select :render-tag="renderTagGroup" :render-label="renderLableGroup" v-model:value="formParams.default_groups"  placeholder="填写群ID/群账号" multiple filterable  label-field="name" value-field="group_id"  :options="groupOptions" clearable remote :clear-filter-after-select="false" @search="searchGroupHttp"/>
      </n-form-item>
      <n-form-item label="默认好友" path="default_friends">
        <n-select :render-tag="renderTagFriends" :render-label="renderLableFriends" v-model:value="formParams.default_friends" placeholder="填写ID/账号/手机号/昵称" label-field="nick_name" value-field="user_id" multiple filterable   :options="friendsOptions" clearable remote :clear-filter-after-select="false" @search="searchUserHttp"/>
      </n-form-item>
      <n-form-item label="默认好友打招呼消息" path="greet_msg">
        <n-input type="textarea" rows="2" maxlength="200"  showCount placeholder="请输入打招呼消息" v-model:value="formParams.greet_msg" />
      </n-form-item>
      <n-form-item label="备注" path="remarks">
        <n-input type="textarea" rows="2" placeholder="请输入备注" v-model:value="formParams.remarks" />
      </n-form-item>
    </n-form>

    <template #action>
      <n-space justify="end">
        <n-button @click="() => (showModal = false)">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>
  <script lang="ts" setup >
    import {ref, reactive, unref, h} from 'vue';
    import { upInviteCode,upInviteCodeUser,upInviteCodeGroup} from '@/api/system';
    import { NTag, SelectOption, SelectRenderTag, useMessage } from 'naive-ui';
    import { searchUser ,searchGroup} from '@/api/user';
    const groupOptions = ref([])
    const friendsOptions = ref([])
    const defaultGroup = ref([])
    const defaultFriends = ref([])
    const emit = defineEmits(['childToParent']);
    const formBtnLoading = ref(false);
    const message = useMessage();
    const formParams = <any>reactive({
      invite_code: undefined,
      default_groups: undefined,
      default_friends: undefined, 
      greet_msg: undefined,
      remarks: undefined,
    });
    const rules:any = {
      name: {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入邀请码',
      }
    };
    const renderLableGroup =  (option: SelectOption)=> {
      return option.name + '(' + option.group_id + ')'
    }
    const renderTagGroup: SelectRenderTag = ({ option, handleClose }) => {
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
    }
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
    function onlyAllowNumber (value: string){
      return !value || /^\d+$/.test(value) && !value.startsWith(' ') && !value.endsWith(' ')
    }
    const showModal = ref(false)
    function openModal (row){
      for(let i in row){
        if(!row[i]){
          row[i]=undefined
        }
      }
      Object.assign(unref(formParams), row)
      groupOptions.value = row.default_groups
      friendsOptions.value = row.default_friends
      defaultGroup.value = row.default_groups
      defaultFriends.value = row.default_friends
      formParams.default_groups = formParams.default_groups?formParams.default_groups.map(item=>item.group_id):[]
      formParams.default_friends = formParams.default_friends?formParams.default_friends.map(item=>item.user_id):[]
      showModal.value = true
    }
    async function searchGroupHttp(e){
      if(!e) return 
      try {
        const data = await searchGroup({search:e})
        groupOptions.value =data.list
      } catch (error:any) {
        message.error(error.message)
      }
    }
    async function searchUserHttp(e){
      if(!e) return 
      try {
        const data = await searchUser({search:e})
        friendsOptions.value =data.list
      } catch (error:any) {
        message.error(error.message)
      }
    }
    defineExpose({
      openModal
    })
    async function confirmForm(){
      formBtnLoading.value = true
      if(JSON.stringify(defaultGroup.value?defaultGroup.value.map(item=>item.group_id):[])!=JSON.stringify(formParams.default_groups)){
        let parmas = {
          id:formParams.id,
          invite_code:formParams.invite_code,
          default_groups:formParams.default_groups,
        } 
        if(parmas.default_groups&&parmas.default_groups.length>1){
          parmas.default_groups = parmas.default_groups.join(',')
        }else if(parmas.default_groups&&parmas.default_groups.length==1){
          parmas.default_groups = parmas.default_groups.toString()
        }else {
          parmas.default_groups = ""
        }
        upInviteCodeGroup(parmas)
      }
      if(JSON.stringify(defaultFriends.value?defaultFriends.value.map(item=>item.user_id):[])!=JSON.stringify(formParams.default_friends)){
        let parmas = {
          id:formParams.id,
          invite_code:formParams.invite_code,
          default_friends:formParams.default_friends,
        }
        if(parmas.default_friends&&parmas.default_friends.length>1){
          parmas.default_friends = parmas.default_friends.join(',')
        }else if(parmas.default_friends&&parmas.default_friends.length==1){
          parmas.default_friends = parmas.default_friends.toString()
        }else {
          parmas.default_friends = ""
        }
        upInviteCodeUser(parmas)
      }
      try {
        let parmas = {
          id:formParams.id,
          invite_code:formParams.invite_code,
          greet_msg:formParams.greet_msg,
          remarks:formParams.remarks,
        }
        await upInviteCode(parmas)
        emit('childToParent')
        showModal.value = false
        message.success('编辑成功');
      } catch (error:any) {
        message.error(error.message)
      }
      formBtnLoading.value = false
    }
    
  </script>