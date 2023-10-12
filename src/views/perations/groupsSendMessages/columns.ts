import { formatToDateTime } from "@/utils/dateUtil";
import  {decrypt,isJsonString}  from '@/utils/ase'
export const columns = [
  {
    title: '序号',
    key: 'id',
    align:'center',
  },
  {
    title: '消息内容',
    key: 'content',
    align:'center',
    render: (row) => (row.content ? (isJsonString(decrypt(row.content))?JSON.parse(decrypt(row.content)).text:decrypt(row.content)):'-'),
    ellipsis: {
      tooltip: {
        width:800,
        style:"max-height: 400px",
        scrollable:true,
      }
    }
  },
  {
    title: '发送者ID',
    key: 'sender_ids',
    align:'center',
    ellipsis: {
      tooltip: {
        width:800,
        style:"max-height: 400px",
        scrollable:true,
      }
    }
  },
  {
    title: '发送者昵称',
    key: 'sender_nicknames',
    align:'center',
    ellipsis: {
      tooltip: {
        width:800,
        style:"max-height: 400px",
        scrollable:true,
      }
    }
  },
  {
    title: '发送时间',
    key: 'created_at',
    align:'center',
    render: (row) => (row.created_at ? formatToDateTime(new Date(row.created_at * 1000),'yyyy-MM-dd HH:mm:ss'): '-')
  },
  {
    title: '操作者',
    key: 'operate',
    align:'center'
  }
];