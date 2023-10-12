<template>
    <n-card>
        <n-icon size="26" @click="back">
            <ArrowBack />
        </n-icon>

        <n-form :model="formParams" :rules="rules" ref="formRef" :label-width="120" class="py-4">
            <n-form-item label="新闻标题" path="title">
                <n-input placeholder="请输入新闻标题" v-model:value="formParams.title" />
            </n-form-item>
            <n-form-item label="封面类型" path="type">
                <n-radio-group v-model:value="formParams.type">
                    <n-space>
                        <n-radio label="图片" value="1" />
                        <n-radio label="视频" value="2" />
                    </n-space>
                </n-radio-group>
            </n-form-item>
            <n-form-item label="封面图片" path="image" v-if="formParams.type === '1'">
                <BasicUpload :action="`${VITE_SOME_KEY=='dev'?'api':''}/cms_api/third/upload`"
                    :data="{ file_type: 3, operation_id:'' + new Date().getTime()}" :headers="uploadHeaders" name="file"
                    :width="80" :height="80" multiple maxNumber="3" v-model:value="formParams.image"
                    helpText="APP端最多显示3张，单个文件不超过2MB,图片格式支持jpg,png,bmp,jpeg,图片尺寸最大200px*200px" @uploadChange="uploadChange"
                    accept=".jpg,.png,.jpeg,.bmp" />
            </n-form-item>
            <n-form-item label="封面视频" path="video" v-if="formParams.type === '2'">
                <BasicUpload :action="`${VITE_SOME_KEY=='dev'?'api':''}/cms_api/third/upload`"
                    :data="{ file_type: 5, operation_id:'' + new Date().getTime()}" :headers="uploadHeaders" name="file"
                    :width="80" :height="80" :maxNumber="1" v-model:value="formParams.video" helpText="单个文件不超过5MB"
                    @uploadChange="uploadChange" accept=".mp4,.wmv,.avi,.vob" />
            </n-form-item>
            <n-form-item label="新闻内容" path="content" v-if="formParams.type === '1'">
                <Editor :content="formParams.content" @change="onEditorChange" />
            </n-form-item>
            <n-form-item>
                <div style="display: flex; justify-content: center">
                    <n-button round type="primary" @click="hanleSubmit">
                        提交
                    </n-button>
                    <n-button round style="margin-left: 20px;" @click="back">
                        返回
                    </n-button>
                </div>
            </n-form-item>
        </n-form>
    </n-card>
</template>


<script lang="ts" setup>
import { ACCESS_TOKEN } from '@/store/mutation-types';
import { ArrowBack} from '@vicons/ionicons5'
import { storage } from '@/utils/Storage';
import { ref, reactive } from 'vue';
import { FormInst } from 'naive-ui';
import { createNews} from "@/api/perations"
const emit = defineEmits(['handleShowModal']);
const formRef = ref<FormInst | null>(null)
const VITE_SOME_KEY = import.meta.env.VITE_SOME_KEY
const uploadHeaders = ref({
    token: storage.get(ACCESS_TOKEN),
  })
const formParams = reactive({
    title: void 0,
    note: void 0,
    type: '1',
    content: '',
    image: [],
    video: void 0
});
function uploadChange(val:any){
    if(typeof val === 'number'){ //临时方法
        formParams.image.splice(val,1)
        return
    }
    if(formParams.type === '1'){
        formParams.image.push(val as never)
    }
    if(formParams.type === '2'){
        formParams.video = val
    }
   
  }
const rules: any = {
    title: [
      {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入新闻标题',
      },
    ],
    content:[
    {
        required: true,
        trigger: ['blur', 'input'],
        message: '请输入新闻内容',
      }, 
    ]

}
const onEditorChange = (val) =>{
    formParams.content = val
}

const hanleSubmit = () =>{
    formRef.value?.validate( async (errors) => {
          if (!errors) {
           await createNews({
                operation_id: new Date().getTime().toString(),
                title: formParams.title,
                video: formParams.video,
                image: formParams.image,
                content: formParams.content, 
            })
           back()
          } else {
            console.log(errors)
          }
        })
}

const back = () =>{
    emit('handleShowModal',false)
}

</script>

<style>
.tox-tinymce-aux {
    z-index: 9999999 !important;
}
</style>