import { formatUrl } from "@/utils";
import { NAvatar, NImage } from "naive-ui";
import { h } from "vue";
import moren from '@/assets/images/moren.png';
export const accountColumns = [
  {
    title: '用户昵称',
    key: 'nick_name',
    align:'center',
  },
  {
    title: '用户ID',
    key: 'user_id',
    align:'center',
  },
  {
    title: '好友数量统计',
    key: 'friend_total',
    align:'center'
  },
  {
    title: '默认打招呼消息',
    key: 'greet_msg',
    align:'center'
  },
  {
    title: '备注',
    key: 'remarks',
    align:'center'
  }
];

export const groupColumns = [
  {
    title: '群头像',
    key: 'face_url',
    align:'center',
    width:120,
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
  },
  {
    title: '群主名称',
    key: 'owner_nick_name',
    align:'center'
  }
];