import {formatToDateTime} from "@/utils/dateUtil"
import { NImage } from "naive-ui";
import moren from '@/assets/images/moren.png';
import { NTag } from "naive-ui";
import { h } from "vue";
const colorObj = {
  "web":'success',
  "android":'warning',
  "ios":'error'
}
export const columns = [
  {
    title: '邀请码',
    key: 'invite_code',
    align:'center',
  },
  {
    title: '注册人数',
    key: 'count',
    align:'center',
  },
];
export const infoColumns = [
  {
    title: '头像',
    key: 'face_url',
    align:'center',
    render(row) {
      return h(
        NImage,
        {
          style:'border-radius: 3px;height:34px;',
          height:34,
          width:34,
          src: row.face_url?row.face_url:moren,
        }
      );
    },
  },
  {
    title: 'ID',
    key: 'user_id',
    align:'center',
  },
  {
    title: '账号',
    key: 'account',
    align:'center',
  },
  {
    title: '昵称',
    key: 'nick_name',
    align:'center',
  },
  {
    title: '手机号',
    key: 'phone_number',
    align:'center',
  },
  {
    title: '邀请码',
    key: 'invite_code',
    align:'center',
  },
  {
    title: '余额',
    key: 'balance',
    align:'center',
  },
  {
    title: '注册时间',
    key: 'registry_time',
    align:'center',
    render: (row) => (row.registry_time ? formatToDateTime(new Date(row.registry_time * 1000),'yyyy-MM-dd HH:mm:ss'): '-')
  },
  {
    title: '最后登录时间',
    key: 'latest_login_time',
    align:'center',
    render: (row) => (row.latest_login_time ? formatToDateTime(new Date(row.latest_login_time * 1000),'yyyy-MM-dd HH:mm:ss'): '-')
  },
];
