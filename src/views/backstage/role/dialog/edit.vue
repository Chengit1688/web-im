<template>
    <n-modal v-model:show="showModal" :show-icon="false" preset="dialog" title="编辑角色" @after-leave="cenalModel">
      <n-form
        :model="formParams"
        :rules="rules"
        ref="formRef"
        :label-width="120"
        class="py-4"
      >
        <n-form-item label="角色名称" path="role_key">
          <n-input placeholder="请输入角色名称" v-model:value="formParams.role_key" />
        </n-form-item>
        <n-form-item label="角色描述" path="role_name">
          <n-input  placeholder="请输入角色描述" v-model:value="formParams.role_name" />
        </n-form-item>
        <n-form-item label="角色权限" path="menus" >
          <n-card >
            <n-spin size="small" :show="show" style="height: 300px;">
              <n-tree
                block-line
                :virtual-scroll="true"
                style="max-height: 260px; overflow: hidden"
                key-field="id"
                label-field="title"
                cascade
                checkable
                :data="treeData"
                :checked-keys="checkedKeys"
                @update:checked-keys="checkedTree"
                @update:indeterminate-keys="indeterminateTree"
              />
            </n-spin>
            
          </n-card>
        </n-form-item>
      </n-form>
  
      <template #action>
        <n-space>
          <n-button @click="cenalModel">取消</n-button>
          <n-button type="info" :loading="formBtnLoading" @click="confirmForm">确定</n-button>
        </n-space>
      </template>
    </n-modal>
  </template>
    <script lang="ts" setup >
      import {ref, reactive, unref} from 'vue';
      import {editRole,getRoleAll,getRoleById} from "@/api/backstage"
      import { useMessage } from 'naive-ui';
      const message = useMessage();
      const emit = defineEmits(['childToParent']);
      const formBtnLoading = ref(false);
      const treeData = ref([]);
      const show = ref(true)
      const showModal = ref(false)
      const checkedKeys = <any>ref([]);
      const indeterminateKeys = <any>ref([]);
      const formRef = ref();
      const consoleId =<any> ref();
      const defaultList = ref([]);
      const formParams = reactive({
        role_name: undefined,
        role_key: undefined,
        menus: [], 
      });
      const rules:any = {
        role_name: {
          required: true,
          trigger: ['blur', 'input'],
          message: '请输入角色描述',
        },
        role_key: {
          required: true,
          trigger: ['blur', 'input'],
          message: '请输入角色名称',
        },
      };
      const tileArr = (arr) =>{
        return arr.reduce((acc,cur) =>
        acc.concat(Array.isArray(cur)?tileArr(cur):cur),[])
      }
      function toTree(arr, parentId) {
        function loop(parentId) {
          return arr.reduce((acc, cur) => {
            if (cur.parent_id === parentId) {
              cur.children = loop(cur.id)
              if(cur.children.length==0) delete cur.children
              acc.push(cur)
            }
            return acc
          }, [])
        }
        return loop(parentId)
      }
      // 排序
      function sortList(a, b) {
        return (a?.sort || 0) - (b?.sort || 0);
      }
      async function openModal (row){
        show.value = true
        showModal.value = true
        Object.assign(unref(formParams), {role_name:row.role_name,role_key:row.role_key})
        try {
          const {list} =  await getRoleAll()
          const listCopy = JSON.parse(JSON.stringify(list))
          const data =  await getRoleById(row.id)
          let getParams = {
              menus:data.menus.filter(item=>item.parent_id!=0).map(item=>item.id),
          }
          treeData.value = toTree(list.sort(sortList).filter(item=>item.visible==1&&item.hidden==1),0);
          checkedKeys.value  = getParams.menus
          defaultList.value =  listCopy.filter(item=>item.name=='Dashboard' || item.name=='workplace').map(a=>a.id)
          consoleId.value = listCopy.find(item=>item.name=='console').id
          show.value = false
          Object.assign(unref(formParams), getParams,{id:row.id})
        } catch (error:any) {
          message.error(error.message)
        }
      }
      defineExpose({
        openModal
      })
      function checkedTree(keys){
        checkedKeys.value = keys
      }
      function indeterminateTree(keys){
        indeterminateKeys.value = keys
      }
      async function confirmForm(){
        let idlist = checkedKeys.value.concat(indeterminateKeys.value)
        let params:any = Object.assign(formParams,{menus:Array.from(idlist)})
        if(!params.menus.includes(consoleId.value)){
          params.menus = params.menus.concat(defaultList.value)
        }
        formRef.value.validate(async (errors: boolean) => {
          if (!errors) {
            formBtnLoading.value= true
            try {
              await editRole(Object.assign(params))
              showModal.value = false
              message.success('编辑成功')
              emit('childToParent')
            } catch (error:any) {
              message.error(error.message)
            }
            formBtnLoading.value= false
          }
        });
        
      }
      function cenalModel(){
        showModal.value = false 
        show.value = true
        treeData.value = []
        treeData.value.length = 0
        Object.assign(unref(formParams), {role_name: undefined,role_key: undefined,menus:[]})
      }
    </script>