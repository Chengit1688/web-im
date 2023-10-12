<template>
    <n-modal  v-model:show="showModal" :show-icon="false" preset="dialog" title="预览">
      <div>
        <n-image v-if="info.type==3" :src="formatUrl(info.image_info.image_url)"/>
        <video  v-if="info.type==5" :src="formatUrl(info.video_info.file_url)" controls style="width: -webkit-fill-available;"></video>
        <audio v-if="info.type==4" preload="auto" :src="formatUrl(info.audio_info.file_url)"  controls />
      </div>
    </n-modal>
  </template>
    <script lang="ts" setup >
      import {ref} from 'vue';
      import {formatUrl} from '@/utils'
      const info = <any>ref({})
      const showModal = ref(false)
      function openModal (obj){
        info.value = obj
        showModal.value = true
      }
      defineExpose({
        openModal
      })
    </script>