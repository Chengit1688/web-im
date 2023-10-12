import { http } from '@/utils/http/axios';

// 操作日志
/**
 * @description: 查询签到配置
 */
export function getOperateLog(params) {
  return http.request({
    url: '/cms_api/log/operate_log',
    method: 'GET',
    params
  });
}