import {formatToDateTime} from "@/utils/dateUtil"
export const columns = [
  {
    title: '敏感词',
    key: 'shield_words',
    align:'center',
  },
  {
    title: '操作者',
    key: 'operation_user',
    align:'center',
  },
  {
    title: '编辑时间',
    key: 'created_at',
    align:'center',
    render: (row) => (row.created_at ? formatToDateTime(new Date(row.created_at * 1000),'yyyy-MM-dd HH:mm:ss'): '-'),
  },
];