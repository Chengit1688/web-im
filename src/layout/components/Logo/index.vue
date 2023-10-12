<template>
  <div class="logo">
    <img v-if="props.collapsed || configUration?.site_name?.length<7" :src="configUration.menu_icon?configUration.menu_icon :websiteConfig.logo" alt="" :class="{ 'mr-2': !props.collapsed }" />
    <h3 v-show="!props.collapsed" class="title">{{ configUration.site_name?configUration.site_name:websiteConfig.title }}</h3>
  </div>
</template>

<script lang="ts" setup>
  import { websiteConfig } from '@/config/website.config';
  import { useUserStore } from '@/store/modules/user';
  import { reactive, unref, watch } from 'vue';
  const props = defineProps(['collapsed'])
  const userStore = useUserStore();
  const configUration = reactive({
    google_code_is_open:undefined,
    site_name:undefined,
    menu_icon:undefined
  });
  watch(
    () => userStore.getConfigUration,
    () => {
      Object.assign(unref(configUration),userStore.getConfigUration)
    },
    { immediate: true }
  );
</script>

<style lang="less" scoped>
  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 64px;
    line-height: 64px;
    overflow: hidden;
    white-space: nowrap;

    img {
      width: auto;
      height: 32px;
    }

    .title {
      margin: 0;
    }
  }
</style>
