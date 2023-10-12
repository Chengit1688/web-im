import {formatToDateTime} from "@/utils/dateUtil"
const platforms = [
  {
    label: 'IOS',
    value: 1,
  },
  {
    label: 'Android',
    value: 2,
  },
  {
    label: 'Web',
    value: 5,
  },
];
export const columns = [
  {
    title: '序号',
    key: 'id',
    align:'center',
    width:120
  },
  {
    title: 'ID',
    key: 'user_id',
    align:'center',
    width:120
  },
  {
    title: '昵称',
    key: 'nick_name',
    align:'center',
    width:150
  },
  {
    title: '内容',
    key: 'content',
    align:'center',
    ellipsis: {
      tooltip: {
        width:600,
        style:"max-height: 400px",
        scrollable:true,
      }
    }
  },
  {
    title: '品牌',
    key: 'brand',
    align:'center'
  },
  {
    title: '客户端',
    key: 'platform',
    align:'center',
    render: (row) => (platforms.find(item=>item.value==row.platform)?.label)
  },
  {
    title: '版本号',
    key: 'app_version',
    align:'center'
  },
  {
    title: '时间',
    key: 'created_at',
    align:'center',
    render: (row) => (row.created_at ? formatToDateTime(new Date(row.created_at * 1000),'yyyy-MM-dd HH:mm:ss'): '-')
  }
];
