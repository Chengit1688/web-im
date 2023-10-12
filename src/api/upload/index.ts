import { http } from '@/utils/http/axios';

//文件、照片上传
export function upload(data) {
  return http.request({
    url: '/cms_api/third/upload',
    method: 'post',
    data
  });
}