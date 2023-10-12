import { http } from '@/utils/http/axios';

export interface BasicResponseModel<T = any> {
  code: number;
  message: string;
  data: T;
}
/**
 * @description: 根据用户id获取用户菜单
 */
export function adminMenus() {
  return http.request({
    url: '/cms_api/admin/get_info',
    method: 'GET',
  });
}

/**
 * @description: 用户登录
 */
export function login(data) {
  return http.request<BasicResponseModel>(
    {
      url: '/cms_api/admin/login',
      method: 'POST',
      data
    },
    {
      isTransformResponse: false,
    }
  );
}

export function getInfo() {
  return http.request({
    url: '/cms_api/config/info',
    method: 'GET',
  },
  {
    isTransformResponse: false,
  });
}
