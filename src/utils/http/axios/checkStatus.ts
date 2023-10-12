export function checkStatus(status: number, msg: string): void {
  const $message = window['$message'];
  switch (status) {
    case 400:
      $message.error(msg);
      break;
    // 401: 未登录
    // 未登录则跳转登录页面，并携带当前页面的路径
    // 在登录成功后返回当前页面，这一步需要在登录页操作。
    case 401:
      $message.error('用户没有权限（令牌、用户名、密码错误）!');
      break;
    case 403:
      $message.error('用户得到授权，但是访问是被禁止的。!');
      break;
    // 404请求不存在
    case 404:
      $message.error('网络请求错误，未找到该资源!');
      break;
    case 405:
      $message.error('网络请求错误，请求方法未允许!');
      break;
    case 408:
      $message.error('网络请求超时');
      break;
    case 500:
      $message.error('服务器错误,请联系管理员!');
      break;
    case 501:
      $message.error('数据库错误');
      break;
    case 502:
      $message.error('网络错误');
      break;
    case 503:
      $message.error('服务不可用，服务器暂时过载或维护!');
      break;
    case 504:
      $message.error('网络超时');
      break;
    case 505:
      $message.error('请重新登录!');
      break;
    case 10000:
      $message.error('请求参数错误!');
      break;
    case 10001:
      $message.error('用户未登录,请登录!');
      break;
    case 10002:
      $message.error('无权访问!');
      break;
    case 10003:
      $message.error('验证码错误!');
      break;
    case 10011:
      $message.error('用户没有在群组中!');
      break;
    case 10013:
      $message.error('群组不存在!');
      break;
    case 10014:
      $message.error('设备不存在!');
      break;
    case 10015:
      $message.error('对方已经是好友了!');
      break;
    case 10016:
      $message.error('用户找不到!');
      break;
    case 10017:
      $message.error('密码错误!');
      break;
    default:
      $message.error(msg);
  }
}
