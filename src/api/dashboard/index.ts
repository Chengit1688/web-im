

import { http } from '@/utils/http/axios';

// 首页
/**
 * @description: 获取发现页
 */
export function getDashboard() {
  return http.request({
    url: '/cms_api/dashboard',
    method: 'GET'
  });
}