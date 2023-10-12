import { renderIcon } from '@/utils/index';
import {ExclamationCircleOutlined,DashboardOutlined, ArrowUpOutlined, AppstoreOutlined,GlobalOutlined, MoneyCollectOutlined, TeamOutlined, MessageOutlined,LineChartOutlined,SettingOutlined,UserOutlined} from '@vicons/antd';

//前端路由图标映射表
export const constantRouterIcon = {
  DashboardOutlined: renderIcon(DashboardOutlined),
  AppstoreOutlined: renderIcon(AppstoreOutlined),
  GlobalOutlined: renderIcon(GlobalOutlined),
  MoneyCollectOutlined: renderIcon(MoneyCollectOutlined),
  TeamOutlined: renderIcon(TeamOutlined),
  MessageOutlined: renderIcon(MessageOutlined),
  LineChartOutlined: renderIcon(LineChartOutlined),
  SettingOutlined: renderIcon(SettingOutlined),
  UserOutlined: renderIcon(UserOutlined),
  ArrowUpOutlined: renderIcon(ArrowUpOutlined),
  ExclamationCircleOutlined: renderIcon(ExclamationCircleOutlined),
};
