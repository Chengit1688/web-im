import { http } from '@/utils/http/axios';

// 发现页
/**
 * @description: 获取发现页
 */
export function getDiscover() {
  return http.request({
    url: '/cms_api/discover',
    method: 'GET'
  },
  {
    isTransformResponse: false,
  });
}
/**
 * @description: 新增发现页
 */
export function addDiscover(data) {
  return http.request({
    url: '/cms_api/discover',
    method: 'POST',
    data
  })
}
/**
 * @description: 修改发现页
 */
export function upDiscover(data) {
  return http.request({
    url: '/cms_api/discover/'+data.id,
    method: 'PUT',
    data
  })
}
/**
 * @description: 删除发现页
 */
export function deleteDiscover(id) {
  return http.request({
    url: '/cms_api/discover/'+id,
    method: 'DELETE',
  })
}


/**
 * @description: 获取发现页开关
 */
export function getDiscoverStatus() {
  return http.request({
    url: '/cms_api/discover/status',
    method: 'GET'
  });
}
/**
 * @description: 发现页开关修改
 */
export function upDiscoverStatus(data) {
  return http.request({
    url: '/cms_api/discover/status',
    method: 'POST',
    data
  })
}