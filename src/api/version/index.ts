import { http } from '@/utils/http/axios';
/**
 * @description: 获取版本升级
 */
export function getVersionList(data) {
    return http.request({
      url: '/cms_api/config/version_list',
      method: 'POST',
      data
    });
  }
  /**
   * @description: 新增版本升级
   */
  export function addVersion(data) {
    return http.request({
      url: '/cms_api/config/version_add',
      method: 'POST',
      data
    })
  }
   /**
   * @description: 修改版本升级
   */
   export function upVersion(data) {
    return http.request({
      url: '/cms_api/config/version_update',
      method: 'POST',
      data
    })
  }
   /**
   * @description: 版本升级状态修改
   */
   export function upVersionStatus(data) {
    return http.request({
      url: '/cms_api/config/version_update_status',
      method: 'POST',
      data
    })
  }
   /**
   * @description: 删除版本升级
   */
   export function deleVersion(data) {
    return http.request({
      url: '/cms_api/config/version_delete',
      method: 'POST',
      data
    })
  }