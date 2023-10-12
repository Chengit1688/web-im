<template>
 <n-card :bordered="false" class="proCard" style="float: left;">
    <n-grid x-gap="12" :cols="2">
      <n-gi>
          <Editor :content="formParams.content"  @change="onEditorChange"/>
        </n-gi>
        <n-gi>
          <div >
            <div style="border:1px solid #ccced1;height: 39px;border-bottom: none;line-height: 39px;">
              <span class="ml-3">预览</span>
            </div>
              <div  style="border:1px solid #ccced1;height: 900px;">
                <n-scrollbar style="max-height: 900px">
                  <div v-html="formParams.content" style="padding:0 0.6em;"></div>
                </n-scrollbar>
              </div>
          </div>
        </n-gi>
    </n-grid>
    <n-button type="info" class="mt-10 float-right" @click="submit" :loading="formBtnLoading">保存</n-button>
  </n-card>
  
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref } from 'vue';
  import { getAgreement,setAgreement} from '@/api/system/index';
  import { useMessage } from 'naive-ui';
  const formBtnLoading = ref(false)
  const message = useMessage();
  const formParams = reactive({
    content:""
  });
  function onEditorChange(val){
    formParams.content = val
  }
  async function submit(){
    formBtnLoading.value = true
    let params = {
      content:formParams.content,
    }
    try {
      await setAgreement(params)
      message.success('保存成功')
    } catch (error:any) {
      message.error(error.message)
    }
    formBtnLoading.value = false
  }
  onMounted(async () => {
    const data =  await getAgreement()
    Object.assign(formParams,data)
  })
</script>
 
<style lang="less" scoped>
  ::v-deep  .tox-tinymce{
    min-height: 100px;
    max-height: 950px;
    height: 950px !important;
  }
</style>
