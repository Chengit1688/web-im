import {formatToDateTime} from "@/utils/dateUtil"
export const columns = [
  {
    title: '邀请码',
    key: 'invite_code',
    align:'center'
  },
  {
    title: '默认好友ID',
    key: 'default_friends',
    align:'center',
    render: (row) => (row.default_friends ? row.default_friends.map(item=>item.user_id).join(','):''),
  },
  {
    title: '默认群ID',
    key: 'default_groups',
    align:'center',
    render: (row) => (row.default_groups ? row.default_groups.map(item=>item.group_id).join(','):''),
  },
  {
    title: '打招呼信息',
    key: 'greet_msg',
    align:'center'
  },
  {
    title: '备注',
    key: 'remarks',
    align:'center'
  },
  {
    title: '创建时间',
    key: 'created_at',
    align:'center',
    render: (row) => (row.created_at ? formatToDateTime(new Date(row.created_at * 1000),'yyyy-MM-dd HH:mm:ss'): '-'),
    width:200
  },
  {
    title: '修改时间',
    key: 'updated_at',
    align:'center',
    render: (row) => (row.updated_at ? formatToDateTime(new Date(row.updated_at * 1000),'yyyy-MM-dd HH:mm:ss'): '-'),
    width:200
  },
  {
    title: '操作者',
    key: 'operation_user',
    align:'center'
  },
];
