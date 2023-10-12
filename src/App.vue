<template>
  <NConfigProvider
    v-if="!isLock"
    :locale="zhCN"
    :theme="getDarkTheme"
    :theme-overrides="getThemeOverrides"
    :date-locale="dateZhCN"
  >
    <AppProvider>
      <RouterView  :key="$route.fullPath"/>  <!-- 必须加key  v-if="showPage" 这个是通过显示隐藏重新加载-->
    </AppProvider>
  </NConfigProvider>

  <transition v-if="isLock && $route.name !== 'login'" name="slide-up">
    <LockScreen />
  </transition>
</template>

<script lang="ts" setup>
  import { computed, nextTick, onBeforeUnmount, onMounted, onUnmounted, provide, ref } from 'vue';
  import { zhCN, dateZhCN, darkTheme } from 'naive-ui';
  import { LockScreen } from '@/components/Lockscreen';
  import { AppProvider } from '@/components/Application';
  import { useLockscreenStore } from '@/store/modules/lockscreen';
  import { useRoute } from 'vue-router';
  import { useDesignSettingStore } from '@/store/modules/designSetting';
  import { lighten } from '@/utils/index';
  import { useUserStore } from '@/store/modules/user';
  import { withdrawStore } from '@/store/modules/withdraw';
  import {getWithdrawPendIng} from '@/api/finance'
  import favicon from '@/assets/icons/favicon.ico';
  const route = useRoute();
  const useLockscreen = useLockscreenStore();
  const designStore = useDesignSettingStore();
  const isLock = computed(() => useLockscreen.isLock);
  // const lockTime = computed(() => useLockscreen.lockTime);
  const userStore = useUserStore();
  const withdraw = withdrawStore();
  const showPage = ref<boolean>(true)
  const withDrawtimer =ref<any>(null)
  const onRefresh = () => {
    showPage.value = false
    nextTick(() => {
      showPage.value = true
    })
  }
  provide('reload', onRefresh)
  /**
   * @type import('naive-ui').GlobalThemeOverrides
   */
  const getThemeOverrides = computed(() => {
    const appTheme = designStore.appTheme;
    const lightenStr = lighten(designStore.appTheme, 6);
    return {
      common: {
        primaryColor: appTheme,
        primaryColorHover: lightenStr,
        primaryColorPressed: lightenStr,
        primaryColorSuppl: appTheme,
      },
      LoadingBar: {
        colorLoading: appTheme,
      },
    };
  });

  const getDarkTheme = computed(() => (designStore.darkTheme ? darkTheme : undefined));


  // let timer;

  // const timekeeping = () => {
  //   clearInterval(timer);
  //   if (route.name == 'login' || isLock.value) return;
  //   // 设置不锁屏
  //   useLockscreen.setLock(false);
  //   // 重置锁屏时间
  //   useLockscreen.setLockTime();
  //   timer = setInterval(() => {
  //     // 锁屏倒计时递减
  //     useLockscreen.setLockTime(lockTime.value - 1);
  //     if (lockTime.value <= 0) {
  //       // 设置锁屏
  //       useLockscreen.setLock(true);
  //       return clearInterval(timer);
  //     }
  //   }, 1000);
  // };
  // const timekeepingWithdraw = async () => {
  //   clearInterval(withDrawtimer)
  //   withDrawtimer.value = null;
  //   if (route.name == 'login') return;
  //   let data =  await getWithdrawPendIng()
  //   withdraw.setCount({count:data,time: new Date().getTime()})
  //   //每5s刷新提现审核
  //   withDrawtimer.value = setInterval(async () => {
  //     let data1 =  await getWithdrawPendIng()
  //     withdraw.setCount({count:data1,time: new Date().getTime()})
  //   }, 5000);
  // };
  onMounted(async () => {
    // document.addEventListener('mousedown', timekeeping);
    // await timekeepingWithdraw()
    try {
      const {data} =  await userStore.getInfoHttp();
      if(data.ui_info.site_name){
        document.title = data.ui_info.site_name
      }
      let link =  document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      if(data.ui_info.page_icon){
        link.href = data.ui_info.page_icon;
      }else{
        link.href = favicon
      }
      document.getElementsByTagName('head')[0].appendChild(link);
    } catch (error:any) {
    }
  });

  onUnmounted(() => {
    // document.removeEventListener('mousedown', timekeeping);
    clearInterval(withDrawtimer)
    withDrawtimer.value = null;
  });
</script>

<style lang="less">
  @import 'styles/index.less';
</style>
