import {formatToDateTime} from "@/utils/dateUtil"
export const columns = [
  {
    title: '用户ID',
    key: 'user_id',
    align:'center',
  },
  {
    title: '昵称',
    key: 'nickname',
    align:'center',
  },
  {
    title: '最后登录时间',
    key: 'last_login_time',
    align:'center',
    render: (row) => (row.last_login_time ? formatToDateTime(new Date(row.last_login_time * 1000),'yyyy-MM-dd HH:mm:ss'): '-')
  }
];
