import { http } from '@/utils/http/axios';

// 登录注册配置
/**
 * @description: 获取登录配置
 */
export function getLoginConfig() {
  return http.request({
    url: '/cms_api/config/login_config',
    method: 'GET'
  });
}
/**
 * @description: 更新登录配置
 */
export function upLoginConfig(data) {
  return http.request({
    url: '/cms_api/config/login_config',
    method: 'POST',
    data
  })
}
/**
 * @description: 获取注册配置
 */
export function getRegisterConfig() {
  return http.request({
    url: '/cms_api/config/register_config',
    method: 'GET'
  });
}
/**
 * @description: 更新注册配置
 */
export function upRegisterConfig(data) {
  return http.request({
    url: '/cms_api/config/register_config',
    method: 'POST',
    data
  });
}
//邀请码配置

/**
 * @description: 获取邀请码列表
 */
export function getInviteList(params) {
  return http.request({
    url: '/cms_api/config/invite_list',
    method: 'POST',
    params
  });
}
/**
 * @description: 新增邀请码
 */
export function addInviteCode(data) {
  return http.request({
    url: '/cms_api/config/invite_add',
    method: 'POST',
    data
  })
}
/**
 * @description: 更新邀请码信息
 */
export function upInviteCode(data) {
  return http.request({
    url: '/cms_api/config/invite_update',
    method: 'POST',
    data
  })
}
/**
 * @description: 更新邀请码默认好友
 */
export function upInviteCodeUser(data) {
  return http.request({
    url: '/cms_api/config/invite_update_friends',
    method: 'POST',
    data
  })
}

/**
 * @description: 更新邀请码默认群
 */
export function upInviteCodeGroup(data) {
  return http.request({
    url: '/cms_api/config/invite_update_groups',
    method: 'POST',
    data
  })
}

/**
 * @description: 删除邀请码 单个 或 多个
 */
export function deleteInviteCode(data) {
  return http.request({
    url: '/cms_api/config/invite_delete',
    method: 'POST',
    data
  })
}

/**
 * @description: 更改邀请码状态
 */
export function upInviteCodeStatus(data) {
  return http.request({
    url: '/cms_api/config/invite_update_status',
    method: 'POST',
    data
  })
}



// 界面设置

/**
 * @description: 修改界面设置
 */
export function upIsiteUi(data) {
  return http.request({
    url: '/cms_api/config/site_ui',
    method: 'POST',
    data
  })
} 


//敏感词

/**
 * @description: 获取敏感词列表
 */
export function getShieldList(params) {
  return http.request({
    url: '/cms_api/config/shield_list',
    method: 'POST',
    params
  });
}
/**
 * @description: 新增敏感词
 */
export function addShield(data) {
  return http.request({
    url: '/cms_api/config/shield_add',
    method: 'POST',
    data
  })
}
/**
 * @description: 更新敏感词
 */
export function upShield(data) {
  return http.request({
    url: '/cms_api/config/shield_update',
    method: 'POST',
    data
  })
}

/**
 * @description: 删除敏感词
 */
export function deleteShield(data) {
  return http.request({
    url: '/cms_api/config/shield_delete',
    method: 'POST',
    data
  })
}
//推送

/**
 * @description: 获取极光推送
 */
export function getJpush() {
  return http.request({
    url: '/cms_api/config/jpush',
    method: 'GET',
  });
}
/**
 * @description: 修改极光推送
 */
export function upJpush(data) {
  return http.request({
    url: '/cms_api/config/jpush',
    method: 'POST',
    data
  })
}

/**
 * @description: 获取飞虎推送
 */
export function getFpush() {
  return http.request({
    url: '/cms_api/config/feihu',
    method: 'GET',
  });
}
/**
 * @description: 修改飞虎推送
 */
export function upFpush(data) {
  return http.request({
    url: '/cms_api/config/feihu',
    method: 'POST',
    data
  })
}
//参数配置

/**
 * @description: 获取参数配置
 */
export function getParameter() {
  return http.request({
    url: '/cms_api/config/parameter_config',
    method: 'GET',
  });
}

/**
 * @description: 修改参数配置
 */
export function upParameter(data) {
  return http.request({
    url: '/cms_api/config/parameter_config_update',
    method: 'POST',
    data
  });
}

//获取用户协议

export function getAgreement() {
  return http.request({
    url: '/cms_api/config/user_agreement',
    method: 'GET',
  });
}
//修改用户协议
export function setAgreement(data) {
  return http.request({
    url: '/cms_api/config/user_agreement',
    method: 'POST',
    data
  });
}
//获取隐私政策

export function getPolicy() {
  return http.request({
    url: '/cms_api/config/privacy_policy',
    method: 'GET',
  });
}
//修改隐私政策
export function setPolicy(data) {
  return http.request({
    url: '/cms_api/config/privacy_policy',
    method: 'POST',
    data
  });
}
//获取关于我们

export function getBbout() {
  return http.request({
    url: '/cms_api/config/about_us',
    method: 'GET',
  });
}

//修改关于我们
export function setBbout(data) {
  return http.request({
    url: '/cms_api/config/about_us',
    method: 'POST',
    data
  });
}