<template>
  <n-modal id="basic-modal" v-model:show="showModal" :show-icon="false" preset="dialog" title="添加升级配置">
    <n-form
      :model="formParams"
      :rules="rules"
      ref="formRef"
      :label-width="120"
      class="py-4"
    >
      <n-form-item label="版本号" path="version">
        <n-input placeholder="请输入版本号" v-model:value="formParams.version" />
      </n-form-item>
      <n-form-item label="客户端" path="platform">
        <n-select v-model:value="formParams.platform" :options="platformsList" />
      </n-form-item>
      <n-form-item label="是否强制升级" path="is_force">
        <n-select v-model:value="formParams.is_force" :options="is_forcePptions" />
      </n-form-item>
      <n-form-item label="标题" path="title">
        <n-input  placeholder="请输入标题" maxlength="20" show-count v-model:value="formParams.title"/>
      </n-form-item>
      <n-form-item label="下载地址" path="download_url">
        <n-input  placeholder="请输入地址" v-model:value="formParams.download_url" />
      </n-form-item>
      <n-form-item label="更新说明" path="update_desc">
        <n-input type="textarea" placeholder="请输入更新说明" maxlength="200" show-count v-model:value="formParams.update_desc" />
      </n-form-item>
    </n-form>

    <template #action>
      <n-space>
        <n-button @click="() => (showModal = false)">取消</n-button>
        <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
      </n-space>
    </template>
  </n-modal>
</template>
  <script lang="ts" setup >
    import {ref, reactive, unref} from 'vue';
    import {platformsList,is_forcePptions} from "./../columns"
    import { addVersion} from '@/api/version';
    import { useMessage } from 'naive-ui';
    const message = useMessage();
    const emit = defineEmits(['childToParent']);
    const formRef: any = ref(null);
    const formBtnLoading = ref(false);
    const formParams = reactive({
      version: undefined,
      platform: 1,
      is_force: 1,
      update_desc: undefined,
      title: undefined,
      download_url: undefined,
    });
    const rules:any = {
      version: {
        required: true,
        trigger: 'blur',
        message: '请输入版本号',
      },
      title: {
        required: true,
        trigger: 'blur',
        message: '请输入标题',
      },
      download_url: {
        required: true,
        trigger: 'blur',
        message: '请输入下载链接',
      },
      update_desc: {
        required: true,
        trigger: 'blur',
        message: '请输入更新说明',
      },
    };
    const showModal = ref(false)
    function openModal (){
      Object.assign(unref(formParams),{
        version: undefined,
        platform: 1,
        is_force: 1,
        update_desc: undefined,
        title: undefined,
        download_url: undefined,
      })
      showModal.value = true
    }
    defineExpose({
      openModal
    })
    function confirmForm(){
      formRef.value.validate(async (errors: boolean) => {
        if (!errors) {
          try {
            await addVersion(formParams)
            emit('childToParent')
            showModal.value = false
            message.success('添加成功')
          } catch (error:any) {
            message.error(error.message)
          }
        }
      });
    }
  </script>