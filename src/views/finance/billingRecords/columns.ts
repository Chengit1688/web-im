import {formatToDateTime} from "@/utils/dateUtil"
import { NTag } from "naive-ui";
import { h } from "vue";
const colorObj = {
  "web":'success',
  "android":'warning',
  "ios":'error'
}
export const columns = [
  {
    title: '商户',
    key: 'app_name',
    align:'center',
    width:120
  },
  {
    title: '用户',
    key: 'user_id',
    align:'center',
    width:150
  },
  {
    title: '登录类型',
    key: 'mac_type',
    align:'center',
    render(row) {
      return h(
        NTag,
        {
          round:true,
          bordered:false,
          type:colorObj[row.mac_type]
        },
        {
          default: () => (row.mac_type),
        }
      );
    },
  },
  {
    title: '手机型号',
    key: 'phone_type',
    align:'center'
  },
  {
    title: '上报时间',
    key: 'CreateTime',
    align:'center',
    render: (row) => (row.CreateTime ? formatToDateTime(new Date(row.CreateTime * 1000),'yyyy-MM-dd HH:mm:ss'): '-')
  }
];
