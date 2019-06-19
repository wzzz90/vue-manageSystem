import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import 'element-ui/lib/theme-chalk/index.css';
import axios from './http';
import echarts from 'echarts';
import directive from './directives';
import * as custom  from './filters';
import "../public/css/reset.css"
import {
  Input,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  TimePicker,
  Form,
  FormItem,
  Row,
  Col,
  Loading,
  Message,
  Icon
} from 'element-ui';

Vue.use(Input);
Vue.use(Select);
Vue.use(Option);
Vue.use(OptionGroup);
Vue.use(Button);
Vue.use(ButtonGroup);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(DatePicker);
Vue.use(TimePicker);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Row);
Vue.use(Col);
Vue.use(Icon)

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$message = Message;

Vue.config.productionTip = false


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
