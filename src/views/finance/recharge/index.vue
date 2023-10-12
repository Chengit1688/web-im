<template>
  <n-card>
    <n-card :bordered="false" class="proCard" style="width: calc(100% - 450px);float: left;">
      <n-radio :checked="checkedValue == 1" :value="1" @change="handleChange" class="mb-3">
        自定义网页
      </n-radio>
      <n-grid x-gap="12" :cols="2">
        <n-gi span="2">
          <Editor @change="onEditorChange"  :content="formParams.html"  ref="parentComponent"/>
        </n-gi>
      </n-grid>
      <n-radio :checked="checkedValue == 2" :value="2" @change="handleChange" class="mb-3 mt-3">
        充值地址
      </n-radio>
      <n-input v-model:value="formParams.url" @focus="urlGetFocus" type="textarea" rows="10" placeholder="请输入充值地址（http:// 或 https://）"></n-input>
      <n-button type="info" class="mt-10 float-right" @click="submit" :loading="formBtnLoading">保存</n-button>
    </n-card>
    <n-card :bordered="false" class="proCard m-auto" style="width: 420px;">
     <div style="border:1px solid #ccced1;height: 800px;border-radius: 10px;" class="mt-9">
        <div style="height: 39px;border-bottom:1px solid #ccced1;line-height: 39px;" class="text-center">
          <span>充值</span>
        </div>
        <n-spin :show="showSpin" style="height: 600px">
          <n-scrollbar style="max-height: 600px" v-if="checkedValue==1">
            <div v-html="formParams.html" class="p-2"></div>
          </n-scrollbar>
          <iframe v-else id="Iframe" frameborder="0" class="w-full h-full" :src="formParams.url" style="height:750px;"></iframe>
        </n-spin>
      </div>
    </n-card>
  </n-card>
  
</template>

<script lang="ts" setup>
  import {nextTick, onMounted, reactive, ref } from 'vue';
  import Editor from '@/components/Editor/index.vue';
  import { getDeposite,setDeposite} from '@/api/finance/index';
  import { useMessage } from 'naive-ui';
  const checkedValue = ref(1)
  const message = useMessage();
  const showSpin =ref(false)
  const Iframe = <any>ref(null)
  const formBtnLoading =ref(false)
  const formParams = reactive({
    html:"",
    url: "",
  });
  function onEditorChange(val){
    formParams.html = val
    checkedValue.value = 1
  }
  function urlGetFocus(){
    checkedValue.value = 2
  }
  function handleChange(e){
    checkedValue.value = e.target.value
  }
  async function submit(){
    formBtnLoading.value = true
    let params = {
      switch: +checkedValue.value,
      html:formParams.html,
      url: formParams.url,
    }
    try {
      await setDeposite(params)
      message.success('保存成功')
    } catch (error:any) {
      formBtnLoading.value = false
      message.error(error.message)
    }
    formBtnLoading.value = false
  }
  async function iframeLoad(){
    showSpin.value = true
    const data =  await getDeposite()
    checkedValue.value = data.switch
    Object.assign(formParams,data)
    nextTick(() => {
      if( checkedValue.value==2){
        const iframe:any = document.getElementById('Iframe')
        if (iframe.attachEvent) {
          // IE
          iframe.attachEvent("onload", function() {
            showSpin.value = false
          });
        } else {
          // 非IE
          iframe.onload = function() {
            showSpin.value = false
          };
        }
      }else{
        showSpin.value = false
      }
    });
  }
  onMounted(() => {
    iframeLoad()
  })
</script>
<style lang="less" scoped>
   ::v-deep  .tox-tinymce{
    height: 500px !important;
  }
</style>