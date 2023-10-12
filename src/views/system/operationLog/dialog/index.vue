<template>
  <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" :title="props.info.title" style="width:40%;">
    <template #default>
      <n-scrollbar style="max-height: 600px">
        {{props.info.message}}
      </n-scrollbar>
    </template>
    <template #action>
      <n-button @click="showModal = false">取消</n-button>
      <n-button @click="okModal" type="primary">复制此错误信息</n-button>
    </template>
  </n-modal>
</template>
  <script lang="ts" setup >
    import { ref} from 'vue';
    import { useMessage } from 'naive-ui';
    const message = useMessage();
    const props = defineProps(['info'])
    const showModal = ref(false)
    function openModal (){
      showModal.value = true
    }
    defineExpose({
      openModal
    })
    function okModal(){
      navigator.clipboard.writeText(props.info.message).then(() => {
        message.success('复制成功');
        showModal.value = false
      }, () => {
        message.error('复制失败');
      })
    }
    
  </script>