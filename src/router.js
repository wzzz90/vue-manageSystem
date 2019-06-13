import Vue from 'vue'
import Router from 'vue-router'
import store from './store';
import axios from './http';

import Layout  from '@/components/Layout';

Vue.use(Router)

const load = (view) => () => import(`./views/${ view }`);

const routes = [
  {
    path: '/register',
    name: 'register',
    component: load('Register')
  },
  {
    path: '/login',
    name: 'login',
    component: load('Login')
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    meta: {
      label: '首页',
      hidden: false,
      dropdown: true,
      icon: 'icon-home'
    },
    children: [{
      path: '/index',
      component: load('Home'),
      meta: {
        label: '首页',
        hidden: false
      }
    }]
  },
  {
    path: '/info',
    component: Layout,
    redirect: '/info/infoshow',
    meta: {
      label: '信息管理',
      icon: "icon--yonghuquanxiangua",
      hidden: false,
      dropdown: false
    },
    children: [{
        path: '/info/infoshow',
        meta: {
          label: '个人信息',
          hidden: false
        },
        component: load('InfoShow'),
    }]
  },
  {
    path: '/fundmanage',
    component: Layout,
    redirect: '/fundmanage/fundlist',
    meta: {
      label: '资金管理',
      icon: "icon-invest",
      hidden: false,
      dropdown: false
    },
    children: [
      {
        path: '/fundmanage/fundlist',
        meta: {
          label: '资金流水',
          hidden: false
        },
        component: load('FundList')
      },
      {
        path: '/fundmanage/myechart',
        meta: {
          label: '数据统计',
          hidden: false
        },
        component: load('MyEchart'),
      }
    ]
  },
  {
    path: '/privilegemanage',
    component: Layout,
    redirect: '/privilegemanage/privilege',
    meta: {
      label: '权限管理',
      icon: "icon--jiaoseyuquanxian",
      hidden: false,
      dropdown: false,
      code: 'privilege',
    },
    children: [{
      path: '/privilegemanage/privilege',
      component: load('PriviManage'),
      meta: {
        label: '权限设置',
        hidden: false,
        code: 'privilege',
      }
    }]
  },
  {
    path: '/noPermission',
    name: 'noPermission',
    meta: {
      hidden: false
    },
    component: load('noPermission')
  },
  {
    path: '*',
    name: '404',
    component: load('404')
  }
  
]

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: routes
})

const checkPrivilege = (to) => {
  const codes = store.getters.privileges;
  const code = to.meta.code;
  let hasPrivilege = true;
  if(!!code) {
    hasPrivilege = codes.includes(code);
  }
  return hasPrivilege;
}

router.beforeEach((to, from, next) => {
  const isLogin = localStorage.eleToken ? true : false;

  if(to.path == '/login' || to.path == '/register') {
    next()
  } else {
    if(store.getters.privileges.length == 0) {
      loadPrivileges()
    }
    if(isLogin) {
      if(checkPrivilege(to)) {
        to.meta.hidden = false;
        next()
      } else {
        to.meta.hidden = true;
        next('/noPermission')
      }
    } else {
      next("/login")
    }
  }
})

const loadPrivileges = async () => {
  let promise;
  
  if(!store.getters.privileges.length) {
    promise = new Promise(async (resolve, reject) => {
      let url, response, codes;

      if(store.getters.isAuthenticated) {
        const identity = store.getters.user.identity;

        url = `/api/privileges/role?identity=${identity}`;

        try {
          response = await axios.get(url);
          codes = response.data || [];

          await store.commit('GET_PRIVILEGES', codes)

          resolve(codes)
        } catch (error) {
          codes = []
          reject(error)
        }
      }
    })
  } else {
    promise = Promise.resolve(store.getters.privileges)
  }

  return promise;
}

export default router;

export { routes };
