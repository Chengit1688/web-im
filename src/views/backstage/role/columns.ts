import {formatToDateTime} from "@/utils/dateUtil"
export const columns = [
  {
    title: '角色描述',
    key: 'role_name',
    align:'center',
  },
  {
    title: '角色名称',
    key: 'role_key',
    align:'center',
  },
  // {
  //   title: '上报时间',
  //   key: 'CreateTime',
  //   align:'center',
  //   render: (row) => (row.CreateTime ? formatToDateTime(new Date(row.CreateTime * 1000),'yyyy-MM-dd HH:mm:ss'): '-')
  // }
];
