import { http } from '@/utils/http/axios';

/**
 * @description: 角色列表
 */
export function getRoleList(params) {
  return http.request({
    url: '/cms_api/role',
    method: 'GET',
    params
  });
} 
/**
 * @description: 角色列表
 */
export function getRoleAll() {
  return http.request({
    url: '/cms_api/menu',
    method: 'GET',
  });
}
/**
 * @description: 删除角色
 */
export function deleteRole(id) {
  return http.request({
    url: '/cms_api/role/'+id,
    method: 'DELETE',
  })
}

/**
 * @description: 新增角色
 */
export function addRole(data) {
  return http.request({
    url: '/cms_api/role',
    method: 'POST',
    data
  })
}

/**
 * @description: 修改角色
 */
export function editRole(data) {
  return http.request({
    url: '/cms_api/role/'+data.id,
    method: 'PUT',
    data
  })
}

/**
 * @description: 获取角色
 */
export function getRoleById(id) {
  return http.request({
    url: '/cms_api/role/'+id,
    method: 'GET',
  })
}

/**
 * @description: 后台账号列表
 */
export function getAdminList(params) {
  return http.request({
    url: '/cms_api/admin',
    method: 'GET',
    params
  });
}

/**
 * @description: 新增账号
 */
export function addAcount(data) {
  return http.request({
    url: '/cms_api/admin',
    method: 'POST',
    data
  })
}
/**
 * @description: 删除账号
 */
export function deleteAcount(data) {
  return http.request({
    url: '/cms_api/admin',
    method: 'DELETE',
    data
  })
}

/**
 * @description: 修改账号
 */
export function editAccount(data) {
  return http.request({
    url: '/cms_api/admin/update_info',
    method: 'PUT',
    data
  })
}
/**
 * @description: 修改账号账号
 */
export function editAccountPassword(data) {
  return http.request({
    url: '/cms_api/admin/update_password',
    method: 'PUT',
    data
  })
}

/**
 * @description: 获取配置
 */
export function getConfigUration() {
  return http.request({
    url: '/cms_api/admin/get_google_secret',
    method: 'GET',
  });
}
/**
 * @description: 修改配置
 */
export function setConfigUration(params) {
  return http.request({
    url: '/cms_api/config/google_code_is_open',
    method: 'POST',
    params
  })
}

/**
* @description: IP白名单
*/
export function getIpWhiteList(params) {
  return http.request({
    url: '/cms_api/admin/ip_white_list',
    method: 'GET',
    params,
  })
 }

 /**
 * @description: 新增白名单
 */
export function addIpWhite(data) {
  return http.request({
    url: '/cms_api/admin/ip_white_list',
    method: 'POST',
    data
  })
}
/**
 * @description: 删除白名单
 */
export function deleteIpWhite(id) {
  return http.request({
    url: '/cms_api/admin/ip_white_list/' + id,
    method: 'DELETE',
  })
}

/**
 * @description: 修改白名单
 */
export function editIpWhite(data) {
  return http.request({
    url: '/cms_api/admin/ip_white_list/' + data.id,
    method: 'PUT',
    data
  })
}

/**
* @description: IP白名单开关
*/
export function getIpWhiteSwitch() {
  return http.request({
    url: '/cms_api/config/ip_white_list_is_open',
    method: 'GET'
  })
 }
 /**
 * @description: IP白名单开关修改
 */
export function upIpWhiteSwitch(data) {
  return http.request({
    url: '/cms_api/config/ip_white_list_is_open',
    method: 'POST',
    data
  })
}