<template>
  <n-card>
    <n-card :bordered="false" class="proCard" style="width: calc(100% - 450px);float: left;">
      <n-card  title="提现金额">
        <n-form :model="formParams" :rules="rules" ref="formRef"  label-placement="left">
            <n-form-item label="最小提现：" path="min">
              <n-input-number placeholder="请输入最小提现"  :min="0"  v-model:value="formParams.min" />
            </n-form-item>
            <n-form-item label="最大提现：" path="max">
              <n-input-number placeholder="请输入最大提现：" :min="0"  v-model:value="formParams.max" />
            </n-form-item>
          </n-form>
      </n-card>
      <n-card  class="mt-2">
        <template #header>
          提现字段配置
          <span style="font-size: 16px;font-weight: normal;">(用户提现时需要根据配置字段填写提现信息)</span>
        </template>
        <template #header-extra>
          <n-button @click="add">新增字段</n-button>
        </template>
        <n-table  :single-line="false">
          <thead>
            <tr>
              <th>字段</th>
              <th>必填</th>
              <th>排序</th>
              <th>默认内容</th>
              <th>默认内容是否可以修改</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item,index) in formParams.columnsCopy" :key="index">
              <td style="width: 200px;">
                <n-input v-if="item.edit" v-model:value="item.name"/>
                <span v-else>{{ item.name}}</span>
                
              </td>
              <td>
                <n-switch :disabled="item.name=='提现金额'" :checked-value="1" :unchecked-value="2" v-model:value="item.required"/>
              </td>
              <td >
                <n-input-number :disabled="item.name=='提现金额'" v-model:value="item.sort"/>
              </td>
              <td>
                <n-input :disabled="item.default_content_modify==2" v-model:value="item.default_content" />
              </td>
              <td>
                <n-switch :checked-value="1" :unchecked-value="2" v-model:value="item.default_content_modify"/>
              </td>
              <td>
                <n-button v-if="item.name!='提现金额'" text text-color="red" @click="deleted(index)">移除</n-button>
              </td>
            </tr>
          </tbody>
        </n-table>
      </n-card>
      <n-button type="info" class="mt-10" @click="submit" :loading="formBtnLoading">保存</n-button>
      <n-button class="mt-10 ml-5" @click="reset">重置</n-button>
    </n-card>
    <n-card :bordered="false" class="proCard m-auto" style="width: 420px;">
     <div style="border:1px solid #ccced1;height: 800px;border-radius: 10px;">
        <div style="height: 39px;border-bottom:1px solid #ccced1;line-height: 39px;" class="text-center">
          <span>提现</span>
        </div>
        <div v-for="(item,index) in formParams.columnsCopy" :key="index" class="p-5">
          <span>{{ item.name }}</span>
          <p style="border-bottom: 1px solid #ccc;">
            <span  class="font-bold"  style="font-size: 30px;" v-if="item.name=='提现金额'">
              ¥ <span class="ml-10"> 130</span>
            </span>
          </p>
          <p  v-if="item.name=='提现金额'">
            余额 ￥789,654,321  
            <span style="color:#0099CC; text-decoration-line:underline" >全部提现</span>
          </p>
        </div>
      </div>
    </n-card>
  </n-card>
  
</template>

<script lang="ts" setup>
  import {onMounted, reactive, ref } from 'vue';
  import { getWithdraw,setWithdraw} from '@/api/finance/index';
  import { useMessage } from 'naive-ui';
  const formBtnLoading = ref(false);
  const pageData = ref({})
  const message = useMessage();
  const formParams = <any>reactive({
    min: null,
    max: null,
    columns:[],
    columnsCopy:[]
  });
  const rules:any = {
    name: {
      required: true,
      trigger: ['blur', 'input'],
      message: '请输入邀请码',
    }
  };
  async function getWithdrawHttp (){
    const data =  await getWithdraw()
    Object.assign(formParams,{
      ...data,
      min: data.min / 100,
      max: data.max / 100,
    })
    pageData.value =  JSON.parse(JSON.stringify(data))
    formParams.columnsCopy = JSON.parse(JSON.stringify(data.columns))
    for(let i in formParams.columnsCopy){
      formParams.columnsCopy[i].edit = false
    }
  }
  function reset(){
    Object.assign(formParams,pageData.value)
    formParams.columnsCopy = JSON.parse(JSON.stringify(formParams.columns))
  }
  function add(){
    let obj = {
      name:null,
      default_content:null,
      default_content_modify:1,
      required: 1,
      sort: formParams.columnsCopy.length+1,
      edit:true
    }
    formParams.columnsCopy.unshift(obj)
  }
  function deleted(index){
    formParams.columnsCopy.splice(index, 1);
  }
  async function submit(){
    formBtnLoading.value = true
    let params = JSON.parse(JSON.stringify(formParams.columnsCopy))
    for(let i in params){
      delete params[i].edit
    }
    try {
      await setWithdraw({
        min:formParams.min * 100,
        max:formParams.max * 100,
        columns:params
      })
      message.success('保存成功')
      getWithdrawHttp ()
    } catch (error:any) {
      message.error(error.message)
    }
    formBtnLoading.value = false
  }
  onMounted(() => {
    getWithdrawHttp()
  })
</script>
