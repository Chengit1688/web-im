import { formatToDateTime } from '@/utils/dateUtil';
import { NImage } from 'naive-ui';
import moren from '@/assets/images/moren.png';
import { formatUrl } from '@/utils';
import { h } from 'vue';
export const columns = [
  {
    title: '头像',
    key: 'face_url',
    align: 'center',
    render(row) {
      return h(NImage, {
        style: 'border-radius: 3px;height:34px;',
        height: 34,
        width: 34,
        src: row.face_url ? formatUrl(row.face_url) : moren,
      });
    },
  },
  {
    title: 'ID',
    key: 'user_id',
    align: 'center',
    width: 120,
  },
  {
    title: '账号',
    key: 'account',
    align: 'center',
    width: 150,
  },
  {
    title: '昵称',
    key: 'nick_name',
    align: 'center',
  },
  {
    title: '手机号',
    key: 'phone_number',
    align: 'center',
  },
  {
    title: '注册时间',
    key: 'created_at',
    align: 'center',
    render: (row) =>
      row.created_at
        ? formatToDateTime(new Date(row.created_at * 1000), 'yyyy-MM-dd HH:mm:ss')
        : '-',
  },
  {
    title: '最后登录IP',
    key: 'login_ip',
    align: 'center',
  },
  // {
  //   title: 'IP归属地',
  //   key: 'ip_info',
  //   align:'center'
  // },
  {
    title: '余额',
    key: 'balance',
    align: 'center',
  },
  {
    title: '邀请码',
    key: 'invite_code',
    align: 'center',
  },
];

export const chatListColumns = [
  {
    title: '发送时间',
    key: 'user_id',
    align: 'center',
    width: 120,
  },
  {
    title: '发送者',
    key: 'account',
    align: 'center',
    width: 150,
  },
  {
    title: '接收者',
    key: 'nick_name',
    align: 'center',
  },
  {
    title: '消息类型',
    key: 'phone_number',
    align: 'center',
  },
  {
    title: '聊天内容',
    key: 'created_at',
    align: 'center',
    render: (row) =>
      row.created_at
        ? formatToDateTime(new Date(row.created_at * 1000), 'yyyy-MM-dd HH:mm:ss')
        : '-',
  },
];

export const momentsListColumns = [
  {
    title: '账号',
    key: 'user_id',
    align: 'center',
    width: 120,
  },
  {
    title: '内容',
    key: 'account',
    align: 'center',
    width: 150,
  },
  {
    title: '图片',
    key: 'nick_name',
    align: 'center',
  },
  {
    title: '视频',
    key: 'phone_number',
    align: 'center',
  },
  {
    title: '发送时间',
    key: 'created_at',
    align: 'center',
    render: (row) =>
      row.created_at
        ? formatToDateTime(new Date(row.created_at * 1000), 'yyyy-MM-dd HH:mm:ss')
        : '-',
  },
];
export const friendsColumns = [
  {
    title: 'ID',
    key: 'user_id',
    align: 'center',
    width: 120,
  },
  {
    title: '昵称',
    key: 'nick_name',
    align: 'center',
    width: 150,
  },
];
export const subordinateColumns = [
  {
    title: '店铺ID',
    key: 'shop_id',
    align: 'center',
    width: 120,
  },
  {
    title: '店铺名称',
    key: 'shop_name',
    align: 'center',
    width: 150,
  },
  {
    title: '头像',
    key: 'face_url',
    align: 'center',
    render(row) {
      return h(NImage, {
        style: 'border-radius: 3px;height:34px;',
        height: 34,
        width: 34,
        src: row.face_url ? formatUrl(row.face_url) : moren,
      });
    },
  },
  {
    title: '用户ID',
    key: 'user_id',
    align: 'center',
    width: 120,
  },

  {
    title: '账号',
    key: 'account',
    align: 'center',
    width: 150,
  },
  {
    title: '昵称',
    key: 'nick_name',
    align: 'center',
  },
  {
    title: '手机号',
    key: 'phone_number',
    align: 'center',
  },
  // {
  //   title: '注册时间',
  //   key: 'created_at',
  //   align: 'center',
  //   render: (row) =>
  //     row.created_at
  //       ? formatToDateTime(new Date(row.created_at * 1000), 'yyyy-MM-dd HH:mm:ss')
  //       : '-',
  // },
];

let typeName = {
  0: '未知',
  1: '文本',
  2: '表情',
  3: '图片',
  4: '语音',
  5: '视频',
  6: '文件',
  7: '名片',
  8: '@',
  9: '引用',
};
export const chatColumns = [
  {
    title: '发送时间',
    key: 'send_time',
    align: 'center',
    render: (row) =>
      row.send_time ? formatToDateTime(new Date(row.send_time), 'yyyy-MM-dd HH:mm:ss') : '-',
  },
  {
    title: '发送人',
    key: 'send_nickname',
    align: 'center',
  },
  {
    title: '发送人ID',
    key: 'send_id',
    align: 'center',
  },
  {
    title: '接收者',
    key: 'recv_name',
    align: 'center',
  },
  {
    title: '接收者ID',
    key: 'recv_id',
    align: 'center',
  },

  {
    title: '消息类型',
    key: 'type',
    align: 'center',
    render: (row) => typeName[row.type],
  },
];

export const logColumns = [
  {
    title: '登录时间',
    key: 'created_at',
    align: 'center',
    render: (row) =>
      row.created_at
        ? formatToDateTime(new Date(row.created_at * 1000), 'yyyy-MM-dd HH:mm:ss')
        : '-',
  },
  {
    title: '登录IP',
    key: 'ip',
    align: 'center',
  },
  {
    title: '登录设备ID',
    key: 'device_id',
    align: 'center',
  },
  {
    title: '登录平台',
    key: 'platform',
    align: 'center',
  },
  {
    title: '品牌型号',
    key: 'brand',
    align: 'center',
  },
];
