<template>
  <n-modal
    id="basic-modal"
    v-model:show="showModal"
    :show-icon="false"
    preset="card"
    class="fixed top-10 left-1/2"
    style="margin-left: -250px; width: 600px;"
    :closable="false"
    :closeOnEsc="true"
    footer-style="border-top:1px solid rgb(239, 239, 245)"
  >
    <n-input placeholder="请输入关键词搜索" v-model:value="formParams.username" autofocus clearable @input="filterRouter"/>
    <div class="mt-2">
      <n-empty description="你什么也找不到" v-if="list.length==0"/>
      <n-scrollbar style="max-height: 500px" v-else>
        <n-list hoverable clickable :show-divider="false"  class="listItem">
          <n-list-item v-for="(item,index) in list" class="mt-2 listHover" :key="index" @click="itemClick(item)">
            {{ item.meta.title }}
            <template #suffix>
              <n-icon size="18">
                <EnterOutlined/>
              </n-icon>
            </template>
          </n-list-item>
        </n-list>
      </n-scrollbar>
    </div>
    <!-- <template #footer>
      <div class="mt-2">
        <span class="mr-14px flex-y-center mr-7">
          <n-icon size="18">
            <EnterOutlined/>
          </n-icon>
            <span>确认</span>
        </span>
        <span class="mr-7 flex-y-center">
          <n-icon size="18">
            <ArrowUpOutlined/>
          </n-icon>
          <n-icon size="18">
            <ArrowDownOutlined/>
          </n-icon>
            <span>切换</span>
        </span>
        <span class="flex-y-center">
          <n-icon size="18">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
              <path fill="currentColor" d="M1 7h6v2H3v2h4v2H3v2h4v2H1V7m10 0h4v2h-4v2h2a2 2 0 0 1 2 2v2c0 1.11-.89 2-2 2H9v-2h4v-2h-2a2 2 0 0 1-2-2V9c0-1.1.9-2 2-2m8 0h2a2 2 0 0 1 2 2v1h-2V9h-2v6h2v-1h2v1c0 1.11-.89 2-2 2h-2a2 2 0 0 1-2-2V9c0-1.1.9-2 2-2Z"/>
            </svg>
          </n-icon>
            <span>关闭</span>
        </span>
      </div>
    </template> -->
  </n-modal>
</template>
<script lang="ts" setup>
  import { ref, reactive, unref } from 'vue';
  import {ArrowUpOutlined, ArrowDownOutlined, EnterOutlined} from '@vicons/antd';
  import { useRouter } from 'vue-router'
  const showModal = ref(false);
  const router= useRouter()
  const routerList =<any>ref([])
  const list = <any>ref([])
  const formParams = reactive({
    username: undefined,
  });
  async function openModal() {
    
    showModal.value = true;
    Object.assign(unref(formParams),{username: null})
    let black = ['/login','/','/redirect','/redirect/:path(.*)','/:path(.*)*','/:path(.*)*','/version','/dashboard','/discovery']
    routerList.value = router.getRoutes().filter(item=> !black.includes(item.path))
  }
  function filterRouter(value){
    if(value){
      list.value = routerList.value.filter(item=>item.meta.title.indexOf(value)>-1)
    }
  }
  function itemClick(item){
    router.push({ name: item.name });
  }
  defineExpose({
    openModal,
  });
</script>
<style lang="less" scoped>
 ::v-deep .listItem li{
    background: #f0f1f3;
  }
  ::v-deep  .n-list--hoverable .n-list-item:hover{
    background: rgb(24, 144, 255);
    color: #fff;
  }
</style>