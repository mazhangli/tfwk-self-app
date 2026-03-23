import axios from 'axios';
import { stringify } from 'qs';
import { Toast } from 'vant';
import { Close } from '@/utils/loading';
// 根据环境不同引入不同api地址
// import { api } from '@/config/index';
// create an axios instance
const http = axios.create({
  baseURL: '/self', // url = base api url + request url
  withCredentials: false, // send cookies when cross-domain requests
  timeout: 10000, // request timeout
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
});

// request拦截器 request interceptor
http.interceptors.request.use(
  (config) => {
    return config;
  },

  (error) => {
    console.log(error); // for debug
    return Promise.reject(error);
  }
);
// respone拦截器
http.interceptors.response.use(
  (response) => {
    const res = response.data;
    console.log('res:' + JSON.stringify(res)); // for debug
    if (res.status && res.status !== 200) {
      return Promise.reject(res || 'error');
    } else {
      return Promise.resolve(res);
    }
  },
  (error) => {
    Toast.clear();
    Toast.fail('err:' + error);
    console.log('err:' + error); // for debug
    return Promise.reject(error);
  }
);
// 将axios 的 post 方法，绑定到 vue 实例上面的 $post
export function post(url: any, params: any) {
  return new Promise((resolve, reject) => {
    http
      .post(url, stringify(params))
      .then((res: any) => {
        resolve(res);
      })
      .catch((err: any) => {
        reject(err);
        Close();
      });
  });
}
// 将axios 的 get 方法，绑定到 vue 实例上面的 $get
export function get(url: any, params: any) {
  return new Promise((resolve, reject) => {
    http
      .get(url, { params: params })
      .then((res: any) => {
        resolve(JSON.parse(res)); // 返回请求成功的数据 data
      })
      .catch((err: any) => {
        reject(err);
        Close();
      });
  });
}
//export default http
