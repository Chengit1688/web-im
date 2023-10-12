import { http } from '@/utils/http/axios';

//用户管理

/**
 * @description: 获取用户列表
 */
export function getUserList(params) {
  return http.request(
    {
      url: '/cms_api/user',
      method: 'GET',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}
/**
 * @description: 获取用户列表根据手机号/昵称
 */
export function getUserList2(params) {
  return http.request({
    url: '/cms_api/user/user_for_group',
    method: 'GET',
    params,
  });
}
/**
 * @description: 冻结用户
 */
export function freezeUser(data) {
  return http.request({
    url: '/cms_api/user/freeze',
    method: 'POST',
    data,
  });
}
/**
 * @description: 解冻用户
 */
export function unfreezeUser(data) {
  return http.request({
    url: '/cms_api/user/unfreeze',
    method: 'POST',
    data,
  });
}

/**
 * @description: 查看用户详情
 */
export function getUserDetails(params) {
  return http.request({
    url: '/cms_api/user/details',
    method: 'GET',
    params,
  });
}
/**
 * @description: 批量创建用户
 */
export function addNewUser(data) {
  return http.request({
    url: '/cms_api/user',
    method: 'POST',
    data,
  });
}
/**
 * @description: 用户好友列表
 */
export function usersFriendsList(data) {
  return http.request({
    url: '/cms_api/friend/user_friend_list',
    method: 'POST',
    data,
  });
}
/**
 * @description: 修改账号密码
 */
export function editPassword(data) {
  return http.request({
    url: '/cms_api/user/set_password',
    method: 'POST',
    data,
  });
}
/**
 * @description: 修改用户信息
 */
export function editUserInfo(data) {
  return http.request({
    url: '/cms_api/user/updates',
    method: 'POST',
    data,
  });
}
/**
 * @description: 移除好友
 */
export function deleteFriends(data) {
  return http.request({
    url: '/cms_api/friend/user_remove_friend',
    method: 'POST',
    data,
  });
}

/**
 * @description: 添加好友
 */
export function addFriends(data) {
  return http.request({
    url: '/cms_api/friend/user_add_friend',
    method: 'POST',
    data,
  });
}
//创建群
export function creatGroup(data) {
  return http.request({
    url: '/cms_api/group/create_group',
    method: 'post',
    data,
  });
}
//获取群列表
export function getGroupList(data) {
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
//群合并
export function mergeGroup(data) {
  return http.request({
    url: '/cms_api/group/group_merge',
    method: 'post',
    data,
  });
}

//群成员
export function getGroupMemberList(data) {
  return http.request({
    url: '/cms_api/group/group_member_list',
    method: 'post',
    data,
  });
}

//设为管理员
export function setAdmin(data) {
  return http.request({
    url: '/cms_api/group/set_admin',
    method: 'post',
    data,
  });
}

//踢出群聊
export function removeGroupMember(data) {
  return http.request({
    url: '/cms_api/group/remove_group_member',
    method: 'POST',
    data,
  });
}
//邀请入群
export function addGroupMember(data) {
  return http.request({
    url: '/cms_api/group/add_group_members',
    method: 'POST',
    data,
  });
}
//群信息
export function getGroupInfo(data) {
  return http.request({
    url: '/cms_api/group/group_info',
    method: 'POST',
    data,
  });
}
// 群聊天记录

export function getGroupChat(params) {
  return http.request(
    {
      url: '/cms_api/chat/message_history',
      method: 'GET',
      params,
      responseType: params.export ? 'arraybuffer' : undefined,
    },
    {
      isTransformResponse: false,
    }
  );
}
//群信息
export function setRobot(data) {
  return http.request({
    url: '/cms_api/group/set_robot',
    method: 'POST',
    data,
  });
}
// 群聊天记录

export function deleteMessage(data) {
  return http.request({
    url: '/cms_api/chat/message_change',
    method: 'POST',
    data,
  });
}

/**
 * @description: 特权用户列表
 */
export function getPrivilegeList(data) {
  return http.request(
    {
      url: '/cms_api/user/privilege_user_list',
      method: 'POST',
      data,
    },
    {
      isTransformResponse: false,
    }
  );
}
/**
 * @description: 特权用户新增
 */
export function addPrivilege(data) {
  return http.request({
    url: '/cms_api/user/privilege_user_add',
    method: 'POST',
    data,
  });
}

/**
 * @description: 特权用户删除
 */
export function deletePrivilege(data) {
  return http.request({
    url: '/cms_api/user/privilege_user_remove',
    method: 'POST',
    data,
  });
}

/**
 * @description: 特权用户一键全站进群
 */
export function enterAllGroup(data) {
  return http.request({
    url: '/cms_api/group/batch_join_group',
    method: 'POST',
    data,
  });
}

/**
 * @description: 清除客户端聊天记录
 */

export function clearMessage(data) {
  return http.request({
    url: '/cms_api/chat/message_clear',
    method: 'POST',
    data,
  });
}

/**
 * @description: 余额调整
 */

export function changeAmount(data) {
  return http.request({
    url: '/cms_api/wallet/change_amount',
    method: 'POST',
    data,
  });
}

/**
 * @description: 支付密码修改
 */

export function setPaypasswd(data) {
  return http.request({
    url: '/cms_api/wallet/set_paypasswd',
    method: 'POST',
    data,
  });
}

/**
 * @description: 导出用户列表
 */
export function exportUserList(params) {
  return http.request(
    {
      url: '/cms_api/user/export',
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
 * @description: 用户列表
 */
export function searchUser(params) {
  return http.request({
    url: '/cms_api/user/search',
    method: 'GET',
    params,
  });
}
/**
 * @description: 群组列表
 */
export function searchGroup(params) {
  return http.request({
    url: '/cms_api/group/search',
    method: 'GET',
    params,
  });
}

/**
 * @description: 特权用户一键冻结
 */
export function setFreeze(data) {
  return http.request({
    url: '/cms_api/user/privilege_user/set_freeze',
    method: 'POST',
    data,
  });
}
/**
 * @description: 登录日志
 */
export function getLoginHistory(params) {
  return http.request({
    url: '/cms_api/user/login_history',
    method: 'GET',
    params,
  });
}

/**
 * @description: 查看自己的下级
 */
export function getAgentLevel(data) {
  return http.request({
    url: '/cms_api/user/agent_level',
    method: 'POST',
    data,
  });
}
