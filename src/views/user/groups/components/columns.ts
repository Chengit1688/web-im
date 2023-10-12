import {formatToDateTime} from "@/utils/dateUtil"
let typeName = {
  0:'未知',
  1:'文本',
  2:'表情',
  3:'图片',
  4:'语音',
  5:'视频',
  6:'文件',
  7:'名片',
  8:'@',
  9:'引用',
}
export const typeNameList = [
  {
    label: '文本',
    value: 1,
  },
  {
    label: '表情',
    value: 2,
  },
  {
    label: '图片',
    value: 3,
  },
  {
    label: '语音',
    value: 4,
  },
  {
    label: '视频',
    value: 5,
  },
  {
    label: '文件',
    value: 6,
  },
  {
    label: '名片',
    value: 7,
  },
  {
    label: '@',
    value: 8,
  },
  {
    label: '引用',
    value: 9,
  }
];

export const memberColumns = [
  {
    title: '群成员ID',
    key: 'user_id',
    align:'center',
  },
  {
    title: '群成员昵称',
    key: 'nick_name',
    align:'center',
  },
  {
    title: '群成员身份',
    key: 'role',
    align:'center',
    render: (row) => (row.role=='owner' ? '群主':(row.role=='admin' ? '管理员':'普通成员'))
  },
];

export const chatColumns = [
  {
    title: '发送时间',
    key: 'send_time',
    align:'center',
    render: (row) => (row.send_time ? formatToDateTime(new Date(row.send_time),'yyyy-MM-dd HH:mm:ss'): '-')
  },
  {
    title: '发送人',
    key: 'send_nickname',
    align:'center',
  },
  {
    title: '发送人ID',
    key: 'send_id',
    align:'center',
  },
  {
    title: '消息类型',
    key: 'type',
    align:'center',
    render: (row) => (typeName[row.type])
  }
];

