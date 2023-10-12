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
  // {
  //   label: 'Windows',
  //   value: 3,
  // },
  // {
  //   label: 'OSX',
  //   value: 4,
  // },
  // {
  //   label: 'Web',
  //   value: 5,
  // },
  // {
  //   label: 'MiniWeb',
  //   value: 6,
  // },
  // {
  //   label: 'linux',
  //   value: 7,
  // },
  // {
  //   label: 'APad',
  //   value: 8,
  // },
  // {
  //   label: 'IPad',
  //   value: 9,
  // },
];

const status = [
  {
    label: '开启',
    value: 1,
  },
  {
    label: '关闭',
    value: 2,
  },
];
const options = [
  {
    label: '是',
    value: 1,
  },
  {
    label: '否',
    value: 2,
  },
];
export const columns = [
  {
    title: '版本号',
    key: 'version',
    align:'center',
  },
  {
    title: '客户端',
    key: 'platform',
    align:'center',
    render: (row) => (platforms.find(item=>item.value==row.platform)?.label)
  },
  {
    title: '是否强制升级',
    key: 'is_force',
    align:'center',
    render: (row) => (row.is_force==1?'是':'否')
  },
  {
    title: '标题',
    key: 'title',
    align:'center',
    width:250,
  },
  {
    title: '下载地址',
    key: 'download_url',
    align:'center'
  },
  {
    title: '更新声明',
    key: 'update_desc',
    align:'center',
    width:250
  },
  {
    title: '创建时间',
    key: 'created_at',
    align:'center',
    render: (row) => (row.created_at ? formatToDateTime(new Date(row.created_at * 1000),'yyyy-MM-dd HH:mm:ss'): '-'),
    width:200
  },
];
export const statusList = status
export const platformsList = platforms
export const is_forcePptions = options