import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/views/Index.vue'
import Register from '@/views/Register.vue'
import Login from '@/views/Login.vue'
import NotFound from '@/views/404.vue'
import Home from '@/views/Home.vue'
import InfoShow from '@/views/InfoShow.vue'
import FundList from '@/views/FundList.vue'
Vue.use(Router)
import store from './store';
import axios from './http';

const router = new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      redirect: '/index',
    },
    {
      path: '/index',
      name: 'index',
      component: Index,
      children: [{
        path: '',
        name: 'home',
        component: Home,
      },{
        path: '/home',
        name: 'home',
        component: Home,
      },{
        path: '/infoshow',
        name: 'infoshow',
        meta: {},
        component: InfoShow,
      },{
        path: '/fundlist',
        name: 'fundlist',
        component: FundList,
      }
      
    ]
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '*',
      name: '404',
      component: NotFound
    }
  ]
})

router.beforeEach((to, from, next) => {
  const isLogin = localStorage.eleToken ? true : false;

  if(to.path == '/login' || to.path == '/register') {
    next()
  } else {
    console.log(store.getters.privileges)
    if(store.getters.privileges.length == 0) {
      loadPrivileges()
    }
    isLogin ? next() : next("/login")
  }
})

const loadPrivileges = async () => {
  let promise;
  
  if(!store.getters.privileges.length) {
    promise = new Promise(async (resolve, reject) => {
      let url, response, codes;

      if(store.getters.user.id) {
        const identity = store.getters.identity;

        url = `/api/privileges?identity=${identity}`;

        try {
          response = await axios.get(url);
          codes = response.data.data || [];

          await store.commit('GET_PRIVILEGES', codes)

          resolve(codes)
        } catch (error) {
          codes = []
          reject(err)
        }
      }
    })
  } else {
    promise = Promise.resolve(store.getters.privileges)
  }

  return promise;
}
export default router;
