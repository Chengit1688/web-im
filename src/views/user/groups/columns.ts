import { NImage } from "naive-ui";
import { h } from "vue";
import moren from '@/assets/images/moren.png';
import {formatUrl} from '@/utils'
export const columns = [
  {
    title: '群头像',
    key: 'face_url',
    align:'center',
    render(row) {
      return h(
        NImage,
        {
          style:'border-radius: 3px;height:34px;',
          height:34,
          width:34,
          src: row.face_url?formatUrl(row.face_url):moren,
        }
      );
    },
  },
  {
    title: '群账号',
    key: 'group_id',
    align:'center',
    width:150
  },
  {
    title: '群名称',
    key: 'name',
    align:'center'
  }
];
