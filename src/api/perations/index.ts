import { http } from '@/utils/http/axios';
//获取默认账号列表
export function getDefaultAccountList(data) {
  return http.request({
    url: '/cms_api/config/default_account_list',
    method: 'post',
    data,
  });
}

//添加默认好友
export function addDefaultAccount(data) {
  return http.request({
    url: '/cms_api/config/default_account_add',
    method: 'post',
    data,
  });
}
//更新默认好友
export function upDefaultAccount(data) {
  return http.request({
    url: '/cms_api/config/default_account_update',
    method: 'post',
    data,
  });
}
//删除默认好友
export function deDefaultAccount(data) {
  return http.request({
    url: '/cms_api/config/default_account_delete',
    method: 'post',
    data,
  });
}

//获取默认群列表
export function getDefaultGroupList(data) {
  return http.request({
    url: '/cms_api/group/group_list',
    method: 'post',
    data,
  });
}
//更新群信息
export function upGroup(data) {
  return http.request({
    url: '/cms_api/group/group_update',
    method: 'post',
    data,
  });
}

//获取公告
export function getAnnouncement() {
  return http.request({
    url: '/cms_api/announcement',
    method: 'GET',
  });
}
//修改公告
export function setAnnouncement(data) {
  return http.request({
    url: '/cms_api/announcement',
    method: 'post',
    data,
  });
}

//获取每日在线人数统计
export function getOnlineStatistics(params) {
  return http.request({
    url: '/cms_api/operation/online_statistics',
    method: 'GET',
    params,
  });
}

//获取每日注册人数统计
export function getRegisterStatistics(data) {
  return http.request({
    url: '/cms_api/operation/reg_statistics',
    method: 'POST',
    data,
  });
}
//获取每日单聊统计
export function getSingleStatistics(params) {
  return http.request({
    url: '/cms_api/operation/single_msg_statistics',
    method: 'GET',
    params,
  });
}

//获取每日群聊统计
export function getGroupStatistics(params) {
  return http.request({
    url: '/cms_api/operation/group_msg_statistics',
    method: 'GET',
    params,
  });
}
//获取渠道统计
export function getInviteCodeList(data) {
  return http.request({
    url: '/cms_api/operation/invite_code_statistics_list',
    method: 'POST',
    data,
  });
}
//渠道统计详情
export function getInviteCodeInfo(data) {
  return http.request({
    url: '/cms_api/operation/invite_code_statistics_details',
    method: 'POST',
    data,
  });
}
//获取IP黑名单

export function getIpBlackList(params) {
  return http.request({
    url: '/cms_api/operation/ip_black_list',
    method: 'GET',
    params,
  });
}
//获取消息群发记录
export function getMessageRecords(params) {
  return http.request({
    url: '/cms_api/chat/multi_send_records',
    method: 'GET',
    params,
  });
}

//新增ip黑名单
export function saveIpBlack(data) {
  return http.request({
    url: '/cms_api/operation/ip_black_list',
    method: 'POST',
    data,
  });
}

/**
 * @description: 修改IP黑名单
 */
export function editIpBlack(data) {
  return http.request({
    url: '/cms_api/operation/ip_black_list/' + data.id,
    method: 'PUT',
    data,
  });
}

/**
 * @description: 删除IP黑名单
 */
export function deleteIpBlack(id) {
  return http.request({
    url: '/cms_api/operation/ip_black_list/' + id,
    method: 'DELETE',
  });
}
//消息群发
export function sendMessage(data) {
  return http.request({
    url: '/cms_api/chat/multi_send',
    method: 'POST',
    data,
  });
}

//获取投诉记录
export function getSuggestionRecords(params) {
  return http.request({
    url: '/cms_api/operation/suggestion_list',
    method: 'GET',
    params,
  });
}

//获取在线用户
export function getOnlineUser(params) {
  return http.request(
    {
      url: '/cms_api/operation/online_users',
      method: 'GET',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}

//获取新闻列表
export function getNewsList(data) {
  return http.request({
    url: '/cms_api/news/list',
    method: 'POST',
    data,
  });
}

//创建新闻
export function createNews(data) {
  return http.request({
    url: '/cms_api/news/add',
    method: 'POST',
    data,
  });
}

//删除新闻
export function deleteNews(data) {
  return http.request({
    url: '/cms_api/news/delete',
    method: 'POST',
    data,
  });
}

// 加盟商列表
export function getShoppingList(data) {
  return http.request({
    url: '/cms_api/shopping/list',
    method: 'POST',
    data,
  });
}
// 审核加盟商
export function approveShopping(data) {
  return http.request({
    url: '/cms_api/shopping/approve',
    method: 'POST',
    data,
  });
}

// 运营商列表
export function getOperatorList(data) {
  return http.request({
    url: '/cms_api/operator/list',
    method: 'POST',
    data,
  });
}
// 审核运营商
export function approveOperator(data) {
  return http.request({
    url: '/cms_api/operator/approve',
    method: 'POST',
    data,
  });
}

// 运营商的团队成员
export function getOperatorMemberList(data) {
  return http.request({
    url: '/cms_api/operator/member_list',
    method: 'POST',
    data,
  });
}

/**
 * @description: 查看自己的下级
 */
export function getOperatorAgentLevel(data) {
  return http.request({
    url: '/cms_api/user/operator_level',
    method: 'POST',
    data,
  });
}

// 兑换列表
export function getRedeemPrize(data) {
  return http.request({
    url: '/cms_api/discover/list_redeem_prize',
    method: 'POST',
    data,
  });
}

// 增加奖品
export function addPrize(data) {
  return http.request({
    url: '/cms_api/discover/prize_add',
    method: 'POST',
    data,
  });
}

// 删除奖品
export function deletePrize(data) {
  return http.request({
    url: '/cms_api/discover/prize_delete',
    method: 'POST',
    data,
  });
}

// 奖品列表
export function getPrizeList(data) {
  return http.request({
    url: '/cms_api/discover/prize_list',
    method: 'POST',
    data,
  });
}

// 修改奖品
export function updatePrize(data) {
  return http.request({
    url: '/cms_api/discover/prize_update',
    method: 'POST',
    data,
  });
}

// 修改兑奖列表
export function setRedeemPrize(data) {
  return http.request({
    url: '/cms_api/discover/set_redeem_prize',
    method: 'POST',
    data,
  });
}

// 加盟商的团队成员
export function getStoreMemberList(data) {
  return http.request({
    url: '/cms_api/shopping/member_list',
    method: 'POST',
    data,
  });
}

// 实名认证列表
export function getRealNameList(data) {
  return http.request({
    url: '/cms_api/user/real_name_list',
    method: 'POST',
    data,
  });
}

// 实名认证审核
export function authRealName(data) {
  return http.request({
    url: '/cms_api/user/real_name_auth',
    method: 'POST',
    data,
  });
}
