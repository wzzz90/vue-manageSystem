import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from './http';
import echarts from 'echarts';
import directive from './directives';
import * as custom  from './filters';

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.directive(directive.name, directive)
Vue.prototype.$axios = axios
Vue.prototype.$echarts = echarts

Object.keys(custom).forEach(key => {
  Vue.filter(key, custom[key])
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
