<template>
  <div>
    <vue3-tinymce v-model="props.content" :setting="state.setting" script-src="/tinymce/tinymce.min.js"
      @init="onEditorReady" @change="onEditorChange" />
  </div>
</template>

<script setup>
import { ref, reactive, inject } from 'vue'
import { storage } from '@/utils/Storage';
import Vue3Tinymce from '@jsdawn/vue3-tinymce';
import { ACCESS_TOKEN } from '@/store/mutation-types';
const VITE_SOME_KEY = import.meta.env.VITE_SOME_KEY
const props = defineProps({
  content: {
    type: String,
    default: '',
  }
})
const state = reactive({
  setting: {
    // height: props.content, // editor 高度
    // max_height: 950,
    // min_height: 100,
    menubar: false,
    branding: false,
    statusbar: false,
    // undo redo  |
    toolbar: 'fontsize  blocks alignleft aligncenter alignright alignjustify link unlink numlist bullist image media table forecolor backcolor bold italic underline strikethrough  superscript subscript removeformat codesample code preview',
    quickbars_selection_toolbar: false,
    toolbar_mode: 'sliding',
    plugins: 'codesample link image media table lists fullscreen preview code',
    font_size_formats: '12px 14px 16px 18px',
    link_default_target: '_blank',
    link_title: false,
    nonbreaking_force_tab: true,
    custom_images_upload: true,
    images_upload_url: `${VITE_SOME_KEY == 'dev' ? 'api' : ''}/cms_api/third/upload`,
    custom_images_upload_callback: (res) => res.data.url,
    custom_images_upload_header: { token: storage.get(ACCESS_TOKEN), },
    custom_images_upload_param: { file_type: 3, operation_id: '' + new Date().getTime() },
    language: 'zh-Hans',
    language_url: '/tinymce/langs/zh-Hans.js'
  },
});

const emit = defineEmits(['ready', 'focus', 'blur', 'input', 'destroy', 'onEditor', 'change'])

const editorRef = ref(null)
const onEditorReady = () => {
  emit('ready')
}
const onEditorChange = (val) => {
  emit('change', val)
}
const onEditorDestroy = () => {
  emit('destroy')
}
</script>