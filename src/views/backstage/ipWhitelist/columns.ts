import {formatToDateTime} from "@/utils/dateUtil"
export const columns = [
  
  {
    title: 'IP地址',
    key: 'ip',
    align:'center',
  },
  {
    title: '创建时间',
    key: 'created_at',
    align:'center',
    render: (row) => (row.created_at ? formatToDateTime(new Date(row.created_at * 1000),'yyyy-MM-dd HH:mm:ss'): '-')
  },
  // {
  //   title: '操作者',
  //   key: 'note',
  //   align:'center',
  // },
  {
    title: '备注',
    key: 'note',
    align:'center',
  }
];



