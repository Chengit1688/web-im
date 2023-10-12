import {formatToDateTime} from "@/utils/dateUtil"
export const columns = [
  {
    title: '服务id',
    key: 'service_id',
    align:'center',
  },
  {
    title: '服务host',
    key: 'service_host',
    align:'center',
  },
  {
    title: '服务ip',
    key: 'service_ip',
    align:'center',
  },
  {
    title: '环境',
    key: 'env',
    align:'center',
  },
  {
    title: '日志级别',
    key: 'log_level',
    align:'center',
  },
  {
    title: '日志id',
    key: 'operation_id',
    align:'center',
  },
  {
    title: '请求接口',
    key: 'request_url',
    align:'center',
  },
  {
    title: '日志时间',
    key: 'created_at',
    align:'center',
    render: (row) => (row.created_at ? formatToDateTime(new Date(row.created_at),'yyyy-MM-dd HH:mm:ss'): '-')
  },
];
