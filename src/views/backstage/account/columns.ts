import {formatToDateTime} from "@/utils/dateUtil"
export const columns = [
  
  {
    title: '账号',
    key: 'username',
    align:'center',
    width:120
  },
  {
    title: '名称',
    key: 'nick_name',
    align:'center',
    width:150
  },
  {
    title: '角色',
    key: 'role_key',
    align:'center',
  },
  {
    title: '上次登录时间',
    key: 'last_login_time',
    align:'center',
    render: (row) => (row.last_login_time ? formatToDateTime(new Date(row.last_login_time * 1000),'yyyy-MM-dd HH:mm:ss'): '-')
  },
  {
    title: '上次登录IP',
    key: 'last_login_ip',
    align:'center'
  },
];



