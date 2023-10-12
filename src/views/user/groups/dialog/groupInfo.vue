<template>
  <n-modal id="basic-modal" v-model:show="showModal" :show-icon="false" preset="dialog" title="群组详情" style="width:30%;" @close="onCloseModal">
    <n-spin :show="show">
      <n-form :model="formParams" ref="formRef" :label-width="0">
        <n-row style="margin-bottom:12px;">
          <n-col :span="12">
            群ID：{{ formParams.group_id}}
          </n-col>
          <n-col :span="12">
            群名：{{ formParams.name }}
          </n-col>
        </n-row>
        <n-row style="margin-bottom:12px;">
          <n-col :span="12">
            群主ID：{{ formParams.owner_user_id }}
          </n-col>
          <n-col :span="12">
            群主昵称：{{ formParams.owner_nick_name }}
          </n-col>
        </n-row>
        <n-row style="margin-bottom:12px;">
          <n-col :span="12">
            群版本号：{{ formParams.last_version }}
          </n-col>
          <n-col :span="12" >
            创建时间：<span v-if="formParams.create_time">{{ formatToDateTimeHttp(formParams.create_time)}}</span>
          </n-col>
        </n-row>
        <n-row style="margin-bottom:12px;">
          <n-col :span="12">
            是否默认群：<n-tag round size="small" :type="formParams.is_default==1?'success':'error'"> {{ formParams.is_default==1?'是':'否' }} </n-tag>
          </n-col>
          <n-col :span="12">
            群成员数量：{{ formParams.members_total }}
          </n-col>
        </n-row>
        <n-row style="margin-bottom:12px;">
          <n-col :span="12">
            群禁言：<n-tag round size="small" :type="formParams.mute_all_member==1?'success':'error'"> {{ formParams.mute_all_member==1?'是':'否' }} </n-tag> 
          </n-col>
          <n-col :span="12">
            入群申请：<n-tag round size="small" :type="formParams.join_need_apply==1?'success':'error'"> {{ formParams.join_need_apply==1?'需要':'不需要' }} </n-tag> 
          </n-col>
        </n-row>
        <n-row style="margin-bottom:12px;">
          <n-col :span="12">
            禁止普通用户退群：<n-tag round size="small" :type="formParams.ban_remove_by_normal==1?'success':'error'"> {{ formParams.ban_remove_by_normal==1?'是':'否' }} </n-tag> 
          </n-col>
          <n-col :span="12">
            群状态：<n-tag round size="small" :type="formParams.status==1?'success':'error'"> {{ formParams.status==1?'有效':'解散' }} </n-tag>
          </n-col>
        </n-row>
      </n-form>
    </n-spin>
  </n-modal>
</template>
<script lang="ts" setup >
  import {ref, reactive, unref} from 'vue';
  import {formatToDateTime} from "@/utils/dateUtil"
  import { getGroupInfo } from "@/api/user"
  import { useMessage } from 'naive-ui';
  const message = useMessage();
  const showModal = ref(false)
  const show = ref(true)
  const formParams = reactive({
    group_id: undefined,
    name: undefined,
    nick_name: undefined,
    face_url: undefined,
    members_total: undefined,
    notification:undefined,
    introduction:undefined,
    create_time:undefined,
    last_version:undefined,
    create_user_id:undefined,
    status:undefined,
    admins_total:undefined,
    is_default:undefined,
    owner_nick_name:undefined,
    mute_all_member:undefined,
    join_need_apply:undefined,
    ban_remove_by_normal:undefined,
    owner_user_id:undefined,
  });
  async function openModal (row){
    showModal.value = true
    let params = {
      group_id:row.group_id
    }
    show.value = true
    try {
      const data = await getGroupInfo(params)
      Object.assign(unref(formParams),data)
    } catch (error:any) {
      message.error(error.message)
    }
    show.value = false
  }
  function formatToDateTimeHttp(time){
    return formatToDateTime(new Date(time * 1000),'yyyy-MM-dd HH:mm:ss')
  }
  function onCloseModal(){
    Object.assign(unref(formParams),{
      group_id: undefined,
      name: undefined,
      nick_name: undefined,
      face_url: undefined,
      members_total: undefined,
      notification:undefined,
      introduction:undefined,
      create_time:undefined,
      last_version:undefined,
      create_user_id:undefined,
      status:undefined,
      admins_total:undefined,
      is_default:undefined,
      owner_nick_name:undefined,
      mute_all_member:undefined,
      join_need_apply:undefined,
      ban_remove_by_normal:undefined,
      owner_user_id:undefined
    })
  }
  defineExpose({
    openModal
  })
</script>