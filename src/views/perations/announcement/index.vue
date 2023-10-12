<template>
  <n-card :bordered="false" class="proCard">
    <n-grid cols="1 s:1 m:1 l:1 xl:2 2xl:3" responsive="screen">
      <n-grid-item>
        <n-form :model="formParams"  :rules="rules" ref="formRef" :label-width="100"  label-placement="left">
          <n-form-item label="公告开关：" path="is_open">
            <n-switch v-model:value="formParams.is_open"   :checked-value="1" :unchecked-value="2">
              <template #checked>
                开
              </template>
              <template #unchecked>
                关
              </template>
            </n-switch>
            <span class="ml-5  align-middle">（说明：开-进入IM显示公告；关-进入IM不显示公告）</span>
          </n-form-item>
          <n-grid cols="23">
            <n-grid-item span="11">
              <n-form-item path="start" >
                <template #label>
                  显示时间
                  <n-tooltip trigger="hover" placement="top-start">
                    <template #trigger>
                      <n-icon size="18" class="cursor-pointer text-gray-400">
                        <QuestionCircleOutlined />
                      </n-icon>
                    </template>
                    配置时间段，只在每天配置的时间段显示；不配置时间段，全天显示
                  </n-tooltip>
                </template>
                <n-time-picker v-model:formatted-value="formParams.start" class="w-full" placeholder="请选择开始时间"/>
              </n-form-item>
            </n-grid-item>
            <n-grid-item >
              <n-form-item label="" >
                <span class="m-auto">到</span>
              </n-form-item>
            </n-grid-item>
            <n-grid-item span="11">
              <n-form-item label="" path="end" >
                <n-time-picker v-model:formatted-value="formParams.end" class="w-full"  :is-second-disabled="isSecondDisabled" placeholder="请选择结束时间"/>
              </n-form-item>
            </n-grid-item>
          </n-grid>
          <n-form-item label="标题：" path="title" >
            <n-input placeholder="请输入标题" maxlength="20" show-count v-model:value="formParams.title" />
          </n-form-item>
          <n-form-item label="内容：" path="content">
            <n-input type="textarea" rows="20" placeholder="请输入内容：" show-count maxlength="200" v-model:value="formParams.content" />
          </n-form-item>
          <n-form-item label="" path="" class="float-right">
            <n-button type="info" :loading="formBtnLoading" @click="confirmForm" >保存修改</n-button>
          </n-form-item>
        </n-form>
      </n-grid-item>
    </n-grid>
    
  </n-card>
  </template>
    <script lang="ts" setup >
      import {ref, reactive, unref, onMounted} from 'vue';
      import { getAnnouncement,setAnnouncement} from '@/api/perations';
      import { useMessage } from 'naive-ui';
      import {QuestionCircleOutlined } from '@vicons/antd';
      const message = useMessage();
      const formRef: any = ref(null);
      const formBtnLoading = ref(false);
      const formParams = reactive({
        is_open:undefined,
        title: undefined,
        start:undefined,
        end:undefined,
        content: undefined,
      });
      const rules:any = {
        title: {
          required: true,
          trigger: ['blur', 'input'],
          message: '请输入标题',
        },
        content: {
          required: true,
          trigger: ['blur', 'input'],
          message: '请输入内容',
        },
        start:{
          required: true,
          validator (rule, value) {
            let params = JSON.parse(JSON.stringify(formParams))
            if (params.end&&!value) {
              return new Error('请选择开始时间')
            } else if (value&&value.split(":").join('') > params.end&&params.end.split(":").join('')) {
              return new Error('开始时间必须小于结束时间')
            }
            return true
          },
          trigger: ['input', 'blur']
        },
        end:{
          required: true,
          validator (rule, value) {
            let params = JSON.parse(JSON.stringify(formParams))
            if (params.start&&!value) {
              return new Error('请选择结束时间')
            } else if (value&&value.split(":").join('')< params.start&&params.start.split(":").join('')) {
              return new Error('结束时间必须大于开始时间')
            }
            return true
          },
          trigger: ['input', 'blur']
        }
      };
      function confirmForm(){
        formRef.value.validate(async (errors: boolean) => {
          if (!errors) {
            formBtnLoading.value = true
            let parmas = JSON.parse(JSON.stringify(formParams))
            try {
              await setAnnouncement(parmas)
              message.success('保存成功')
              formBtnLoading.value = false
            } catch (error:any) {
              message.error(error.message)
              formBtnLoading.value = false
            }
          }
        });
      }
      onMounted(async () => {
        try {
          const  data  =  await getAnnouncement()
          Object.assign(unref(formParams), data)
        } catch (error:any) {
          message.error(error.message)
        }
      })
    </script>
