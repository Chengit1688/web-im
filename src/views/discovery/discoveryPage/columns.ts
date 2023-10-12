import {formatToDateTime} from "@/utils/dateUtil"
import { NAvatar, NImage } from "naive-ui";
import moren from '@/assets/images/moren.png';
import { h } from "vue";
export const columns = [
  {
    title: 'ID',
    key: 'id',
    align:'center',
  },
  {
    title: '链接',
    key: 'url',
    align:'center',
    width:150
  },
  {
    title: '图标',
    key: 'icon',
    align:'center',
    render(row) {
      return h(
        NImage,
        {
          style:'border-radius: 3px;height:34px;',
          height:34,
          width:34,
          src: row.icon?row.icon:moren,
        }
      );
    },
  },
  {
    title: '名称',
    key: 'name',
    align:'center'
  },
  {
    title: '创建时间',
    key: 'created_at',
    align:'center',
    render: (row) => (row.created_at ? formatToDateTime(new Date(row.created_at * 1000),'yyyy-MM-dd HH:mm:ss'): '-')
  },
  {
    title: '排序',
    key: 'sort',
    align:'center'
  }
];
