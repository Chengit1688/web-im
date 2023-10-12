<template>
  <div class="view-account">
    <div class="view-account-leftcontainer">
      <img v-if="configUration.login_backend" :src="configUration.login_backend" alt="" class="h-full w-full"/>
      <img v-else src="~@/assets/images/left.svg" alt="" class="h-full w-full"/>       
    </div>
    <div class="view-account-rightcontainer">
      <div class="view-account-rightcontainer-cen">
        <div class="view-account-top">
          <div class="view-account-top-logo">
            <img v-if="configUration.login_icon" :src="configUration.login_icon" alt="" class="h-full w-full"/>
            <img v-else src="/src/assets/images/logo.svg" alt="" class="h-full w-full"/>       

            <h2 >{{ configUration.site_name?configUration.site_name:websiteConfig.title }}</h2>
          </div>
        </div>
        <div class="view-account-form">
          <n-form
            ref="formRef"
            size="large"
            :model="formInline"
            :rules="rules"
            class="formStyle"
          >
            <n-form-item path="username" label="账号">
              <n-input v-model:value="formInline.username" placeholder="请输入账号">
                <template #prefix>
                  <n-icon size="18" color="#808695">
                    <PersonOutline />
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>
            <n-form-item path="password" label="密码">
              <n-input
                v-model:value="formInline.password"
                type="password"
                showPasswordOn="click"
                placeholder="请输入密码"
              >
                <template #prefix>
                  <n-icon size="18" color="#808695">
                    <LockClosedOutline />
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>
            <n-form-item path="google_code" v-if="configUration.google_code_is_open==1" label="谷歌验证码">
              <n-input :allow-input="onlyAllowNumber" v-model:value="formInline.google_code"  placeholder="请输入谷歌验证码" class="w-full">
                <template #prefix>
                  <n-icon size="18" color="#808695">
                    <GoogleOutlined />
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>
            <n-form-item>
              <n-button type="primary" @click="handleSubmit" size="large" :loading="loading" block style="border-radius:20px">
                登录
              </n-button>
            </n-form-item>
          </n-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, reactive, ref ,unref, watch} from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useUserStore } from '@/store/modules/user';
  import { useMessage } from 'naive-ui';
  import { ResultEnum } from '@/enums/httpEnum';
  import { PersonOutline, LockClosedOutline} from '@vicons/ionicons5';
  import { GoogleOutlined} from '@vicons/antd';
  import { PageEnum } from '@/enums/pageEnum';
  import { websiteConfig } from '@/config/website.config';
  import { useAsyncRouteStoreWidthOut } from '@/store/modules/asyncRoute';
  const formRef = ref();
  const message = useMessage();
  const loading = ref(false);
  const LOGIN_NAME = PageEnum.BASE_LOGIN_NAME;
  const asyncRouteStore = useAsyncRouteStoreWidthOut();
  const formInline:any = reactive({
    username: undefined,
    password: undefined,
    google_code: undefined,
    
  });

  const rules = {
    username: { required: true, message: '请输入账号', trigger: 'blur' },
    password: { required: true, message: '请输入密码', trigger: 'blur' },
    google_code: [
        {
          required: true,
          validator (rule,value) {
            if (!value) {
              return new Error('请输入谷歌验证码！')
            }else if(value.length!=6){
              return new Error('谷歌验证码应为6位数字！')
            }
            return true
          },
          trigger: ['input', 'blur']
        }
      ],
  };

  const userStore = useUserStore();
  const configUration = reactive({
    google_code_is_open:undefined,
    site_name:undefined,
    login_icon:undefined,
    login_backend: undefined,
  });
  
  const router = useRouter();
  const route = useRoute();
  const handleSubmit = (e) => {
    e.preventDefault();
    formRef.value.validate(async (errors) => {
      if (!errors) {
        message.loading('登录中...');
        loading.value = true;
        try {
          formInline.google_code = formInline.google_code?formInline.google_code*1:formInline.google_code
          const { code, message: msg } = await userStore.login(formInline);
          message.destroyAll();
          if (code == ResultEnum.SUCCESS) {
            const toPath = decodeURIComponent((route.query?.redirect || '/') as string);
            message.success('登录成功，即将进入系统');
              if (route.name === LOGIN_NAME) {
                router.replace('/');
              } else {
                router.replace(toPath);
              }
          } else {
            message.info(msg || '登录失败');
          }
        } finally {
          loading.value = false;
        }
      }
    });
  };
  function onlyAllowNumber (value: string){
    return !value || /^\d+$/.test(value) && !value.startsWith(' ') && !value.endsWith(' ')
  }
  watch(
    () => userStore.getConfigUration,
    () => {
      Object.assign(unref(configUration),userStore.getConfigUration)
    },
    { immediate: true }
  );
</script>

<style lang="less" scoped>
  .view-account {
    display: flex;
    align-items: center;
    height: 100vh;
    overflow: auto;
    &-leftcontainer {
      flex: 1;
      width: 30%;
      min-width: 500px;
      margin-left: 100px;
      // height: 1000px;
    }
    &-rightcontainer {
      flex: 1;
      display: flex;
      &-cen{
        padding: 5vh;
        background: #fff;
        width: 450px;
        border-radius: 20px;
        margin: auto;
      }
    }
    
    &-top {
      padding: 1vh 0;
      text-align: center;

      &-desc {
        font-size: 14px;
        color: #808695;
      }
      &-logo {
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        img {
          margin: 0 auto;
            width: auto;
            height: 15vh;
        }
        h2{
          color: #4773ff;
          font-size: 3vh;
        }
        .title {
          margin: 0;
        }
      }
    }

    &-other {
      width: 100%;
    }

    .default-color {
      color: #515a6e;

      .ant-checkbox-wrapper {
        color: #515a6e;
      }
    }
  }

  @media (min-width: 768px) {
    .view-account {
      flex-grow: 0;
      background-image: linear-gradient(to bottom, #4a73ff 0%, #7da8ff 100%);
      // background-repeat: no-repeat;
      // background-position: 50%;
      background-size: 100%;
    }

    .page-account-container {
      padding: 32px 0 24px 0;
    }
  }
</style>
