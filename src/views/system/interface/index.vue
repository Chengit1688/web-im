<template>
  <n-card :bordered="false" class="proCard">
    <n-card  class="proCard mb-1">
      <n-form-item label="站点名称"  class="w-1/3">
        <n-input v-model:value="formParams.site_name" maxlength="10" showCount placeholder="请输入站点名称"/>
        <n-button type="info" class="ml-5" @click="submit('site_name')" :loading="formLoading('site_name')">
          保存
        </n-button>
      </n-form-item>
    </n-card>
    <n-card  class="proCard mb-1">
      <n-form-item label="登录页图标" class="w-1/3">
        <BasicUpload
          :action="`${VITE_SOME_KEY=='dev'?'api':''}/cms_api/third/upload`"
          :data="{ file_type: 3, operation_id:'' + new Date().getTime()}"
          :headers="uploadHeaders"
          name="file"
          :width="80"
          :height="80"
          v-model:value="formParams.login_icon"
          @uploadChange="uploadChange_login_icon"
        />
        <n-button type="info" @click="submit('login_icon')" :loading="formLoading('login_icon')">
          保存
        </n-button>
      </n-form-item>
    </n-card>
    <n-card  class="proCard mb-1">
      <n-form-item label="页签图标"  class="w-1/3">
        <BasicUpload
          :action="`${VITE_SOME_KEY=='dev'?'api':''}/cms_api/third/upload`"
          :data="{ file_type: 3, operation_id:'' + new Date().getTime()}"
          :headers="uploadHeaders"
          name="file"
          :width="80"
          :height="80"
          v-model:value="formParams.page_icon"
          @uploadChange="uploadChange_page_icon"
        />
        <n-button type="info" @click="submit('page_icon')" :loading="formLoading('page_icon')">
          保存
        </n-button>
      </n-form-item>
    </n-card>
    <n-card  class="proCard mb-1">
      <n-form-item label="菜单栏图标"  class="w-1/3" >
        <BasicUpload
          :action="`${VITE_SOME_KEY=='dev'?'api':''}/cms_api/third/upload`"
          :data="{ file_type: 3, operation_id:'' + new Date().getTime()}"
          :headers="uploadHeaders"
          name="file"
          :width="80"
          :height="80"
          v-model:value="formParams.menu_icon"
          @uploadChange="uploadChange_menu_icon"
        />
        <n-button type="info" @click="submit('menu_icon')" :loading="formLoading('menu_icon')">
          保存
        </n-button>
      </n-form-item>
    </n-card>
    <n-card  class="proCard mb-1">
      <n-form-item label="登录页背景图">
        <BasicUpload
          :action="`${VITE_SOME_KEY=='dev'?'api':''}/cms_api/third/upload`"
          :data="{ file_type: 3, operation_id:'' + new Date().getTime()}"
          :headers="uploadHeaders"
          name="file"
          :width="100"
          :height="300"
          :widthtype="'%'"
          v-model:value="formParams.login_backend"
          @uploadChange="uploadChange_loginBac"
        />
      </n-form-item>
      <n-form-item label=""  class="float-right">
        <n-button type="info" @click="submit('login_backend')" :loading="formLoading('login_backend')">
          保存
        </n-button>
      </n-form-item>
    </n-card>
  </n-card>
</template>
<script lang="ts" setup >
  import {reactive, unref, ref, watch} from 'vue';
  import { upIsiteUi} from '@/api/system';
  import { useMessage } from 'naive-ui';
  import { useUserStoreWidthOut } from '@/store/modules/user';
  import { storage } from '@/utils/Storage';
  import { ACCESS_TOKEN} from '@/store/mutation-types';
  const loadName = ref('')
  const userStore = useUserStoreWidthOut();
  const VITE_SOME_KEY = import.meta.env.VITE_SOME_KEY
  const uploadHeaders = ref({
    token: storage.get(ACCESS_TOKEN),
  })
  const formParams :any = reactive({
    site_name: undefined,
    login_icon:undefined,
    login_backend: undefined,
    page_icon: undefined,
    menu_icon: undefined,
    
  });
  const message = useMessage();
  function uploadChange_login_icon(val){
    formParams.login_icon = val
  }
  function uploadChange_page_icon(val){
    formParams.page_icon = val
  }
  function uploadChange_menu_icon(val){
    formParams.menu_icon = val
  }
  function uploadChange_loginBac(val){
    formParams.login_backend = val
  }
  // 状态
  async function submit(name){
    let typeList:any = [
      {},
      { type:1,name:'site_name',value:formParams.site_name},
      { type:2,name:'login_icon',value:formParams.login_icon},
      { type:3,name:'login_backend',value:formParams.login_backend},
      { type:4,name:'page_icon',value:formParams.page_icon},
      { type:5,name:'menu_icon',value:formParams.menu_icon}
    ]
    let params = {
      type:typeList.find(item=>item.name==name).type,
      value:typeList.find(item=>item.name==name).value
    }
    loadName.value = name
    try {
      await upIsiteUi(params)
      message.success(`保存成功`);
      let configuration = {
        google_code_is_open: userStore.configuration.google_code_is_open,
        login_backend: typeList.find(item=>item.name=='login_backend').value,
        login_icon: typeList.find(item=>item.name=='login_icon').value,
        menu_icon: typeList.find(item=>item.name=='menu_icon').value,
        page_icon: typeList.find(item=>item.name=='page_icon').value,
        site_name: typeList.find(item=>item.name=='site_name').value,
      }
      userStore.setConfigUration(configuration);
      loadName.value = ""
    } catch (error:any) {
      message.error(error.message)
      loadName.value = ""
    } 
  }
  function formLoading(name){
    if(loadName.value==name){
      return true
    }else{
      return false
    }
  }
  watch(
    () => userStore.getConfigUration,
    () => {
      Object.assign(unref(formParams),userStore.configuration)
    },
    { immediate: true }
  );
</script>
