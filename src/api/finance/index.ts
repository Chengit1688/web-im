import { http } from '@/utils/http/axios';

// 签到配置
/**
 * @description: 查询签到配置
 */
export function getSign() {
  return http.request({
    url: '/cms_api/config/get_sign_config',
    method: 'GET',
  });
}
/**
 * @description: 修改签到配置
 */
export function setSign(data) {
  return http.request({
    url: '/cms_api/config/sign_config_handle',
    method: 'POST',
    data,
  });
}
/**
 * @description: 获取签到列表
 */
export function getSignList(data) {
  return http.request({
    url: '/cms_api/user/sign_log_list',
    method: 'POST',
    data,
  });
}
// 充值配置
/**
 * @description: 查询充值配置
 */
export function getDeposite() {
  return http.request({
    url: '/cms_api/config/deposite',
    method: 'GET',
  });
}
/**
 * @description: 修改充值配置
 */
export function setDeposite(data) {
  return http.request({
    url: '/cms_api/config/deposite',
    method: 'POST',
    data,
  });
}

// 提现配置
/**
 * @description: 查询提现配置
 */
export function getWithdraw() {
  return http.request({
    url: '/cms_api/config/withdraw',
    method: 'GET',
  });
}
/**
 * @description: 修改提现配置
 */
export function setWithdraw(data) {
  return http.request({
    url: '/cms_api/config/withdraw',
    method: 'POST',
    data,
  });
}
/**
 * @description: 查询提现 轮询
 */
export function getWithdrawPendIng() {
  return http.request({
    url: '/cms_api/wallet/withdraw_records/count_pending',
    method: 'GET',
  });
}

/**
 * @description: 个人红包记录
 */
export function redpackSingleRecords(params) {
  return http.request({
    url: '/cms_api/wallet/redpack_single_records',
    method: 'GET',
    params,
  });
}

/**
 * @description: 个人红包记录导出EXCEL
 */
export function redpackSingleRecordsExport(params) {
  return http.request(
    {
      url: '/cms_api/wallet/redpack_single_records/export',
      method: 'GET',
      params,
      responseType: 'arraybuffer',
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 群红包记录
 */
export function redpackGroupRecords(data) {
  return http.request({
    url: '/cms_api/wallet/redpack_group_records',
    method: 'POST',
    data,
  });
}

/**
 * @description: 群记录导出EXCEL
 */
export function redpackGroupRecordsExport(data) {
  return http.request(
    {
      url: '/cms_api/wallet/redpack_group_records/export',
      method: 'POST',
      data,
      responseType: 'arraybuffer',
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 红包配置列表
 */
export function redpackConfigList(data) {
  return http.request({
    url: '/cms_api/wallet/redpack_group_mine_list',
    method: 'POST',
    data,
  });
}

/**
 * @description: 新增红包配置
 */
export function addRedpackGroupMine(data) {
  return http.request({
    url: '/cms_api/wallet/redpack_group_mine_add',
    method: 'POST',
    data,
  });
}
