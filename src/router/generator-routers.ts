import { adminMenus } from '@/api/root';
import { constantRouterIcon } from './router-icons';
import { RouteRecordRaw } from 'vue-router';
import { Layout, ParentLayout } from '@/router/constant';
import type { AppRouteRecordRaw } from '@/router/types';
import { storage } from '@/utils/Storage';
import { CURRENT_USER } from '@/store/mutation-types';
import { useUserStoreWidthOut } from '@/store/modules/user';
const userStore = useUserStoreWidthOut
const LayoutMap = new Map<string, () => Promise<typeof import('*.vue')>>();
LayoutMap.set("LAYOUT", Layout);

// 排序
function sortRoute(a, b) {
  return (a?.sort || 0) - (b?.sort || 0);
}
/**
 * 格式化 后端 结构信息并递归生成层级路由表
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const routerGenerator = (routerMap, parent?): any[] => {
  return routerMap.map((item) => {
    const currentRouter: any = {
      // 路由地址 动态拼接生成如 /dashboard/workplace
      path: `${(parent && parent.path) || ''}/${item.path}`,
      // 路由名称，建议唯一
      name: item.menu_name || '',
      // 该路由对应页面的 组件
      component: item.component,
      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: item.title,
        icon: constantRouterIcon[item.icon] || null,
        sort: item.sort,
        hidden: item.hidden==1?false:true
      },
    };
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    currentRouter.path = currentRouter.path.replace('//', '/');
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect);
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      //如果未定义 redirect 默认第一个子路由为 redirect
      !item.redirect && (currentRouter.redirect = `${item.path}/${item.children.find(ite=>ite.sort==0)?item.children.find(ite=>ite.sort==0).path:item.children[0].path}`);
      // Recursion
      currentRouter.children = routerGenerator(item.children.sort(sortRoute), currentRouter);
    }
    return currentRouter;
  });
};
/**
 * 动态生成菜单
 * @returns {Promise<Router>}
 */
export const generatorDynamicRouter = (): Promise<RouteRecordRaw[]> => {
  return new Promise((resolve, reject) => {
    adminMenus().then((result) => {
      console.log(result.menus)
     let a =  result.menus.find(item=>item.menu_name=="Dashboard").children
      for(let i in a){
        if(a[i].menu_name=="workplace" && a.length==1){
          a[i].hidden = 1
        }
      }
      const routeList = routerGenerator(result.menus.sort(sortRoute));
      const userInfo = {
        nick_name: result.nick_name,
        phone_number: result.phone_number,
        user_id: result.user_id,
        username: result.username,
      }
      storage.set(CURRENT_USER, userInfo);
      userStore().setUserInfo(userInfo)
      asyncImportRoute(routeList);
      resolve(routeList);
    }).catch((err) => {
      storage.clear();
      reject(err.message);
    });
  });
};

/**
 * 查找views中对应的组件文件
 * */
let viewsModules: Record<string, () => Promise<Recordable>>;
export const asyncImportRoute = (routes: AppRouteRecordRaw[] | undefined): void => {
  viewsModules = viewsModules || import.meta.glob('../views/**/*{vue,tsx}');
  if (!routes) return;
  routes.forEach((item) => {
    const { component, name } = item;
    const { children } = item;
    if (component) {
      const layoutFound = LayoutMap.get(component as string);
      
      if (layoutFound) {
        item.component = layoutFound;
      } else {
        item.component = dynamicImport(viewsModules, component as string);
      }
    } else if (name) {
      item.component = ParentLayout;
    }
    children && asyncImportRoute(children);
  });
};

/**
 * 动态导入
 * */
export const dynamicImport = (
  viewsModules: Record<string, () => Promise<Recordable>>,
  component: string
) => {
  const keys = Object.keys(viewsModules);
  const matchKeys = keys.filter((key) => {
    let k = key.replace('../views', '');
    const lastIndex = k.lastIndexOf('.');
    k = k.substring(0, lastIndex);
    return k === component;
  });
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];
    return viewsModules[matchKey];
  }
  
  if (matchKeys?.length > 1) {
    console.warn(
      'Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure'
    );
    return;
  }
};