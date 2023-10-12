<template>
    <div>
      <div class="n-layout-page-header">
        <n-card :bordered="false" title="">
          <n-grid cols="2 s:1 m:1 l:2 xl:2 2xl:2" responsive="screen">
            <n-gi>
              <div class="flex items-center">
                <div>
                  <n-avatar circle :size="64" :src="schoolboy" />
                </div>
                <div>
                  <p class="px-4 text-xl">欢迎登录IM管理后台</p>
                </div>
              </div>
            </n-gi>
          </n-grid>
        </n-card>
      </div>
      <n-grid class="mt-4" cols="1 s:1 m:1 l:1 xl:1 2xl:1" responsive="screen" :x-gap="12" :y-gap="9" v-if="false">
        <n-gi>
          <n-card
            :segmented="{ content: true }"
            content-style="padding: 0;"
            :bordered="false"
            size="small"
            title="快捷操作"
          >
            <div class="flex flex-wrap project-card">
              <!-- <n-card size="small" class="cursor-pointer project-card-item" hoverable v-for="(item,index) in asyncRouteStore.getMenus">
                <div class="flex flex-col justify-center text-gray-500">
                  <span class="text-center">
                    <n-icon size="30" color="#68c755">
                      <DashboardOutlined />
                    </n-icon>
                    {{ item }}
                  </span>
                  <span class="text-lx text-center">{{ item.meta.title }}</span>
                </div>
              </n-card> -->
              <!-- <n-card size="small" class="cursor-pointer project-card-item" hoverable>
                <div class="flex flex-col justify-center text-gray-500">
                  <span class="text-center">
                    <n-icon size="30" color="#fab251">
                      <ProfileOutlined />
                    </n-icon>
                  </span>
                  <span class="text-lx text-center">列表</span>
                </div>
              </n-card>
              <n-card size="small" class="cursor-pointer project-card-item" hoverable>
                <div class="flex flex-col justify-center text-gray-500">
                  <span class="text-center">
                    <n-icon size="30" color="#1890ff">
                      <FileProtectOutlined />
                    </n-icon>
                  </span>
                  <span class="text-lx text-center">表单</span>
                </div>
              </n-card>
              <n-card size="small" class="cursor-pointer project-card-item" hoverable>
                <div class="flex flex-col justify-center text-gray-500">
                  <span class="text-center">
                    <n-icon size="30" color="#f06b96">
                      <ApartmentOutlined />
                    </n-icon>
                  </span>
                  <span class="text-lx text-center">权限管理</span>
                </div>
              </n-card>
              <n-card size="small" class="cursor-pointer project-card-item" hoverable>
                <div class="flex flex-col justify-center text-gray-500">
                  <span class="text-center">
                    <n-icon size="30" color="#7238d1">
                      <SettingOutlined />
                    </n-icon>
                  </span>
                  <span class="text-lx text-center">系统管理</span>
                </div>
              </n-card>
              <n-card size="small" class="cursor-pointer project-card-item" hoverable>
                <div class="flex flex-col justify-center text-gray-500">
                  <span class="text-center">
                    <n-icon size="30" color="">
                      <DashboardOutlined />
                    </n-icon>
                  </span>
                  <span class="text-lx text-center">主控台</span>
                </div>
              </n-card> -->
            </div>
          </n-card>
        </n-gi>
      </n-grid>
    </div>
  </template>
  
  <script lang="ts" setup>
    import schoolboy from '@/assets/images/schoolboy.png';
    import {DashboardOutlined, ProfileOutlined, FileProtectOutlined, SettingOutlined,ApartmentOutlined} from '@vicons/antd';
    import { generatorMenu, generatorMenuMix } from '@/utils';
    import { useAsyncRouteStore } from '@/store/modules/asyncRoute';
    const asyncRouteStore = useAsyncRouteStore();
  </script>
  
  <style lang="less" scoped>
    .project-card {
      margin-right: -6px;
      &-item {
        margin: -1px;
        width: 33.333333%;
      }
    }
  </style>