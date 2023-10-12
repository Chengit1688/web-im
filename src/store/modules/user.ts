import { defineStore } from 'pinia';
import { store } from '@/store';
import { ACCESS_TOKEN, CURRENT_USER, IS_LOCKSCREEN,CONFIG_URATION } from '@/store/mutation-types';
import { ResultEnum } from '@/enums/httpEnum';
import { storage } from '@/utils/Storage';
import { login,getInfo, adminMenus } from '@/api/root';

export interface IUserState {
  token: string;
  username: string;
  welcome: string;
  avatar: string;
  permissions: any[];
  info: any;
  configuration: any;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): IUserState => ({
    token: storage.get(ACCESS_TOKEN, ''),
    username: '',
    welcome: '',
    avatar: '',
    permissions: [],
    info: storage.get(CURRENT_USER, {}),
    configuration: {}
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    getAvatar(): string {
      return this.avatar;
    },
    getNickname(): string {
      return this.username;
    },
    getPermissions(): [any][] {
      return this.permissions;
    },
    getUserInfo(): object {
      return this.info;
    },
    getConfigUration(): object {
      return this.configuration;
    },
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setAvatar(avatar: string) {
      this.avatar = avatar;
    },
    setPermissions(permissions) {
      this.permissions = permissions;
    },
    setUserInfo(info) {
      this.info = info;
    },
    setConfigUration(configuration) {
      this.configuration = configuration;
    },
    // 登录前获取配置
    async getInfoHttp() {
      try {
        const response = await getInfo();
        const { data, code } = response;
        if (code === ResultEnum.SUCCESS) {
          let parmas = {
            google_code_is_open: data.google_code_is_open,
            login_backend: data.ui_info.login_backend,
            login_icon: data.ui_info.login_icon,
            menu_icon: data.ui_info.menu_icon,
            page_icon: data.ui_info.page_icon,
            site_name: data.ui_info.site_name,
          }
          this.setConfigUration(parmas);
        }
        return Promise.resolve(response);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    // 登录
    async login(userInfo) {
      try {
        const response = await login(userInfo);
        const { data, code } = response;
        if (code === ResultEnum.SUCCESS) {
          storage.set(ACCESS_TOKEN, data.token, data.expire);
          storage.set(IS_LOCKSCREEN, false);
          this.setToken(data.token);
        }
        return Promise.resolve(response);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    // 登出
    async logout() {
      this.setUserInfo('');
      storage.remove(ACCESS_TOKEN);
      storage.remove(CURRENT_USER);
      storage.remove(CONFIG_URATION);
      storage.remove("IS-LOCKSCREEN");
      return Promise.resolve('');
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWidthOut() {
  return useUserStore(store);
}
