import { formatToDateTime } from '@/utils/dateUtil';
export const columns = [
  {
    title: '用户ID',
    key: 'user_id',
    align: 'center',
    width: 120,
  },
  {
    title: '昵称',
    key: 'nick_name',
    align: 'center',
  },
  {
    title: '时间',
    key: 'created_at',
    align: 'center',
    render: (row) =>
      row.created_at
        ? formatToDateTime(new Date(row.created_at * 1000), 'yyyy-MM-dd HH:mm:ss')
        : '-',
  },
  {
    title: '签到奖励金额',
    key: 'reward',
    align: 'center',
    render: (row) => row.reward / 100,
  },
];
