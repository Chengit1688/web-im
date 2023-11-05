import { format } from 'date-fns';

const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm';
const DATE_FORMAT = 'YYYY-MM-DD ';

export function formatToDateTime(date: any, formatStr = DATE_TIME_FORMAT): string {
  return format(date, formatStr);
}

export function formatToDate(date: any, formatStr = DATE_FORMAT): string {
  return format(date, formatStr);
}

export function formatDate (value){ // 时间戳转换日期格式方法
  if (value == null) {
    return ''
  } else {
    const date = new Date(value)
    const y = date.getFullYear()// 年
    let MM = date.getMonth() + 1 // 月
    MM = MM < 10 ? ('0' + MM) : MM
    let d = date.getDate() // 日
    d = d < 10 ? ('0' + d) : d
    let h = date.getHours() // 时
    h = h < 10 ? ('0' + h) : h
    let m = date.getMinutes()// 分
    m = m < 10 ? ('0' + m) : m
    return y + '-' + MM + '-' + d + ' ' + h + ':' + m
  }
}
