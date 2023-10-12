import { Layout } from '@/router/constant';
import { renderIcon } from '@/utils/index';
import { DashboardOutlined} from '@vicons/antd';

export const DashboardRoute = {
  path: '/dashboard',
  menu_name: 'Dashboard',
  component: Layout,
  redirect:'/dashboard/workplace',
  meta: {
    title: '首页',
    sort:0,
    icon: renderIcon(DashboardOutlined),
  },
  children: [
    {
      path: '/dashboard/workplace',
      menu_name: 'workplace',
      meta: {
        title: '首页'
      },
      component: () => import('@/views/dashboard/workplace/index.vue'),
    }
  ],
};


export default DashboardRoute;
