/****   request.js   ****/
// 导入axios
import axios from 'axios';
import { stringify } from 'qs';
// 使用element-ui Message做消息提醒
import { Toast } from 'vant';
// 导入静态配置
import config from '../../config.json'; // 根据实际路径调整
//1. 创建新的axios实例，
const service = axios.create({
  // 公共接口--这里注意后面会讲
  baseURL: process.env.BASE_API, //默认
  // 超时时间 单位是ms，这里设置了3s的超时时间
  timeout: 60 * 1000,
});
// 2.请求拦截器
service.interceptors.request.use(
  (config: any) => {
    //发请求前做的一些处理，数据转化，配置请求头，设置token,设置loading等，根据需求去添加
    config.data = stringify(config.data); //数据转化,也可以使用qs转换
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded', //配置请求头
      //'Content-Type': "application/json; charset=UTF-8", //配置请求头
    };
    // //注意使用token的时候需要引入cookie方法或者用本地localStorage等方法，推荐js-cookie
    // const token = getCookie('名称');//这里取token之前，你肯定需要先拿到token,存一下
    // if (token) {
    //     config.params = { 'token': token } //如果要求携带在参数中
    //     config.headers.token = token; //如果要求携带在请求头中
    // }
    return config;
  },
  (error: any) => {
    Promise.reject(error);
  }
);

// 3.响应拦截器
service.interceptors.response.use(
  (response: any) => {
    //接收到响应数据并成功后的一些共有的处理，关闭loading等

    return response;
  },
  (error: any) => {
    /***** 接收到异常响应的处理开始 *****/
    if (error && error.response) {
      // 1.公共错误处理
      // 2.根据响应码具体处理
      switch (error.response.status) {
        case 400:
          error.message = '错误请求';
          break;
        case 401:
          error.message = '未授权，请重新登录';
          break;
        case 403:
          error.message = '拒绝访问';
          break;
        case 404:
          error.message = '请求错误,未找到该资源';
          break;
        case 405:
          error.message = '请求方法未允许';
          break;
        case 408:
          error.message = '请求超时';
          break;
        case 500:
          error.message = '服务器端出错';
          break;
        case 501:
          error.message = '网络未实现';
          break;
        case 502:
          error.message = '网络错误';
          break;
        case 503:
          error.message = '服务不可用';
          break;
        case 504:
          error.message = '网络超时';
          break;
        case 505:
          error.message = 'http版本不支持该请求';
          break;
        default:
          error.message = `连接错误${error.response.status}`;
      }
    } else {
      // 超时处理
      if (JSON.stringify(error).includes('timeout')) {
        Toast.fail({
          forbidClick: true,
          message: '服务器响应超时，请刷新当前页',
        });
      }
      error.message = '连接服务器失败';
    }

    Toast.fail({
      forbidClick: true,
      message: error.message,
    });

    /***** 处理结束 *****/
    //如果不需要错误处理，以上的处理过程都可省略
    return Promise.resolve(error.response);
  }
);
//4.导入文件
//export default service
//导出AxiosInstance
export const http = function createAxios(apiUrl: string) {
  if (apiUrl) {
    service.defaults.baseURL = apiUrl;
  } else {
    // // 确保 config 是一个对象
    // if (typeof config === 'object' && config.apiUrl) {
    //   console.log(config.apiUrl);

    //   service.defaults.baseURL = config.apiUrl;
    // } else {
    //   console.error('config 对象格式错误或缺少 apiUrl 属性');
    // }
    service.defaults.baseURL = 'http://localhost:8889/Server.asmx'; //本机
    // service.defaults.baseURL = 'http://119.3.222.59:5757/Server.asmx'; //丰台医院
    // service.defaults.baseURL = 'http://10.165.8.89:8889/Server.asmx'; //北坞
    // service.defaults.baseURL = 'http://10.165.8.89:8886/Server.asmx'; //北坞(集群)                        ***********administrator/Bwjy@8.89
    // service.defaults.baseURL = 'http://10.165.8.89:8899/Server.asmx'; //北坞(测试)
    // service.defaults.baseURL = 'http://172.16.209.230:2900/Server.asmx'; //马家堡
    // service.defaults.baseURL = 'http://172.16.209.230:1444/Server.asmx'; //马家堡
    // service.defaults.baseURL = 'http://192.192.192.109:8888/Server.asmx'; //京城皮肤病医院
    // service.defaults.baseURL = 'http://192.168.1.221:7979/Server.asmx'; //北京京中医院                               ***********administrator/Jzyy11@#
    // service.defaults.baseURL = 'http://192.168.3.103:8888/Server.asmx'; //北京京苑医院
    // service.defaults.baseURL = 'http://10.6.123.134:8828/Server.asmx'; //电力医院(测试)
    // service.defaults.baseURL = 'http://10.6.69.52:8828/Server.asmx'; //电力医院(生产)
    // service.defaults.baseURL = 'http://192.168.4.19:4477/Server.asmx'; //南苑医院
    // service.defaults.baseURL = 'http://192.168.4.19:4488/Server.asmx'; //南苑医院(集群)
    // service.defaults.baseURL = 'http://192.168.100.136:7779/Server.asmx'; //丰台医院
    // service.defaults.baseURL = 'http://192.168.1.33:8899/Server.asmx'; //和平骨科医院                                   ***********administrator/hpyy_123456
    // service.defaults.baseURL = 'http://10.6.160.6:8899/Server.asmx'; //看丹社区
    // service.defaults.baseURL = 'http://119.3.222.59:5757/Server.asmx'; //公司演示服务器
    // service.defaults.baseURL = 'http://172.17.1.7:8888/Server.asmx'; //山西汾阳宁云堂
    // service.defaults.baseURL = 'http://192.168.3.200:8888/Server.asmx'; //东方明中医院
    // service.defaults.baseURL = 'http://192.168.3.225:8080/Server.asmx'; //送变电
    // service.defaults.baseURL = 'http://192.168.0.221:8888/Server.asmx'; //福利医院
    // service.defaults.baseURL = 'http://192.168.101.134:8888/Server.asmx'; //安定门
    // service.defaults.baseURL = 'http://192.168.0.6:8080/Server.asmx'; //本真堂
    //========================================================localhot //民航医院
    // apiUrl = service.defaults.baseURL;
  }
  return service;
};
export function getUrl() {
  return service.defaults.baseURL;
}
/****   request.js   ****/