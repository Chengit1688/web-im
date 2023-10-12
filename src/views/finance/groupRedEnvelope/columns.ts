import { formatToDateTime } from '@/utils/dateUtil';
import { NTag } from 'naive-ui';
import { h } from 'vue';
const colorObj = {
  '2': 'success',
  '1': 'warning',
  '3': 'error',
};
const textObj = {
  '2': '普通红包',
  '1': '拼手气红包',
  '3': '专属红包',
  '4': '游戏雷红包',
};
const textObj2 = {
  '2': '已领取',
  '1': '待领取',
  '3': '已退回',
};
export const columns = [
  {
    title: '金额',
    key: 'amount',
    align: 'center',
    width: 120,
  },

  {
    title: '群名称',
    key: 'group_name',
    align: 'center',
    width: 150,
  },

  {
    title: '发送者',
    key: 'sender_nick_name',
    align: 'center',
    width: 150,
  },
  {
    title: '红包个数',
    key: 'total',
    align: 'center',
    width: 150,
  },

  {
    title: '红包类型',
    key: 'type',
    align: 'center',
    render(row) {
      return h(
        NTag,
        {
          round: true,
          bordered: false,
          type: colorObj[row.type],
        },
        {
          default: () => textObj[row.type],
        }
      );
    },
  },
  {
    title: '状态',
    key: 'status',
    align: 'center',
    render(row) {
      return h(
        NTag,
        {
          round: true,
          bordered: false,
          type: colorObj[row.status],
        },
        {
          default: () => textObj2[row.status],
        }
      );
    },
  },
  {
    title: '发送时间',
    key: 'send_at',
    align: 'center',
    render: (row) =>
      row.send_at ? formatToDateTime(new Date(row.send_at * 1000), 'yyyy-MM-dd HH:mm:ss') : '-',
  },
  {
    title: '接收时间',
    key: 'recv_at',
    align: 'center',
    render: (row) =>
      row.recv_at ? formatToDateTime(new Date(row.recv_at * 1000), 'yyyy-MM-dd HH:mm:ss') : '-',
  },
];
