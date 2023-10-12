<template>
  <n-modal id="basic-modal" v-model:show="showModal" :show-icon="false" preset="dialog" title="添加角色">
    <n-form
      :model="formParams"
      :rules="rules"
      ref="formRef"
      :label-width="120"
      class="py-4"
    >
      <n-form-item label="角色名称" path="role_key">
        <n-input placeholder="请输入角色名称" maxlength="16" v-model:value="formParams.role_key" />
      </n-form-item>
      <n-form-item label="角色描述" path="role_name">
        <n-input  placeholder="请输入角色描述" maxlength="20" v-model:value="formParams.role_name" />
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
              checkable
              cascade
              :data="treeData"
              @update:checked-keys="indeterminateTree"
            />
          </n-spin>
          
        </n-card>
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
    import {ref, reactive} from 'vue';
    import {addRole,getRoleAll} from "@/api/backstage"
    import { useMessage } from 'naive-ui';
    const emit = defineEmits(['childToParent']);
    const message = useMessage();
    const formBtnLoading = ref(false);
    const treeData = ref([]);
    const consoleId =<any> ref();
    const show = ref(true)
    const showModal = ref(false)
    const checkKeys = ref([]);
    const formRef = ref();
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
    async function openModal (){
      Object.assign(formParams,{role_name:undefined,role_key:undefined})
      showModal.value = true
      try {
        const {list} =  await getRoleAll()
        let listCopy = list
        treeData.value = toTree(list.sort(sortList).filter(item=>item.visible==1&&item.hidden==1),0);
        defaultList.value =  listCopy.filter(item=>item.name=='Dashboard' || item.name=='workplace').map(a=>a.id)
        consoleId.value = listCopy.find(item=>item.name=='console').id
        show.value = false
      } catch (error:any) {
        message.error(error.message)
      }
    }
    defineExpose({
      openModal
    })
    function indeterminateTree(keys){
      checkKeys.value =keys
    }
    async function confirmForm(){
      formRef.value.validate(async (errors: boolean) => {
        if (!errors) {
          formBtnLoading.value= true
          try {
            let params:any = Object.assign(formParams,{menus:checkKeys.value})
            if(!params.menus.includes(consoleId.value)){
              params.menus =  params.menus.concat(defaultList.value)
            }
            
            await addRole(params)
            showModal.value = false
            message.success('添加成功')
            emit('childToParent')
          } catch (error:any) {
            message.error(error.message)
          }
          formBtnLoading.value= false
        }
      });
    
    }
    
  </script>