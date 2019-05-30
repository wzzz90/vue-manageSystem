import axios from 'axios';
import { Message, Loading } from 'element-ui';
import router from './router';

// axios.defaults.timeout = 3000;

let loading;

function startLoading() {
  loading = Loading.service({
    lock: true,
    text: '加载中...',
    background: 'rgba(0,0,0,0.7)'
  });
}

function endLoading() {
  loading.close();
}

/* 请求拦截 */
axios.interceptors.request.use(config => {
  startLoading();

  if(localStorage.eleToken) {
    config.headers.Authorization = localStorage.eleToken;
  }
  return config;
}, error => {
  return Promise.reject(error)
})


/* 响应拦截 */

axios.interceptors.response.use(response => {
  endLoading();
  return response.data;
}, error => {
  endLoading();
  // if(error.indexOf('timeout') > -1) {
  //   Message.error('网络超时');
  // }

  const msg = error.response.data.msg || error.response.data
  Message.error(msg);

  const { status } = error.response;

  if(status == 401) {
    Message.error("token已失效，请重新登录！");
    localStorage.removeItem('eleToken')
    router.push('/login')
  }

  return Promise.reject(error.response)
})

export default axios;