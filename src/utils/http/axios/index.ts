// axios配置  可自行根据项目进行更改，只需更改该文件即可，其他文件可以不动
// The axios configuration can be changed according to the project, just change the file, other files can be left unchanged

import type { AxiosResponse } from 'axios';
import type { CreateAxiosOptions, RequestOptions, Result } from './types';

import { VAxios } from './Axios';
import { AxiosTransform } from './axiosTransform';

import { checkStatus } from './checkStatus';

import { RequestEnum, ResultEnum, ContentTypeEnum } from '@/enums/httpEnum';

import { isString } from '@/utils/is';
import { formatRequestDate } from '@/utils/dateUtil';
import { setObjToUrlParams, deepMerge } from '@/utils';
import { errorResult } from './const';

/**
 * @description: 数据处理，方便区分多种处理方式
 */
const transform: AxiosTransform = {
  /**
   * @description: 处理请求数据
   */
  transformRequestData: (res: AxiosResponse<Result>, options: RequestOptions) => {
    const { isTransformRequestResult } = options;
    // 不进行任何处理，直接返回
    // 用于页面代码可能需要直接获取code，data，message这些信息时开启
    if (!isTransformRequestResult) {
      return res.data;
    }
    // 错误的时候返回

    const { data } = res;
    if (!data) {
      // return '[HTTP] Request has no return value';
      return errorResult;
    }
    //  这里 code，result，message为 后台统一的字段，需要在 types.ts内修改为项目自己的接口返回格式
    const { code, result, message } = data;

    // 这里逻辑可以根据项目进行修改
    const hasSuccess = data && Reflect.has(data, 'code') && code === ResultEnum.SUCCESS;
    if (!hasSuccess) {
      if (message) {
        console.log(message);
      }
      Promise.reject(new Error(message));
      return errorResult;
    }

    // 接口请求成功，直接返回结果
    if (code === ResultEnum.SUCCESS) {
      return result;
    }
    // 接口请求错误，统一提示错误信息
    if (code === ResultEnum.ERROR) {

      Promise.reject(message);
      return errorResult;
    }
    // 登录超时
    if (code === ResultEnum.TIMEOUT) {
      const timeoutMsg = "超时";
      Promise.reject(new Error(timeoutMsg));
      return errorResult;
    }
    return errorResult;
  },

  // 请求之前处理config
  beforeRequestHook: (config, options) => {
    const { apiUrl, joinPrefix, joinParamsToUrl, formatDate } = options;

    if (joinPrefix) {
      
    }

    // if (apiUrl && isString(apiUrl)) {
    //   config.url = `${apiUrl}${config.url}`;
    // }
    // if (config.method === RequestEnum.GET) {
    //   const now = new Date().getTime();
    //   if (!isString(config.params)) {
    //     config.data = {
    //       // 给 get 请求加上时间戳参数，避免从缓存中拿数据。
    //       params: Object.assign(config.params || {}, {
    //         _t: now,
    //       }),
    //     };
    //   } else {
    //     // 兼容restful风格
    //     config.url = config.url + config.params + `?_t=${now}`;
    //     config.params = undefined;
    //   }
    // } else {
    //   if (!isString(config.params)) {
    //     formatDate && formatRequestDate(config.params);
    //     config.data = config.data;
    //     config.params = undefined;
    //     if (joinParamsToUrl) {
    //       config.url = setObjToUrlParams(config.url as string, config.data);
    //     }
    //   } else {
    //     // 兼容restful风格
    //     config.url = config.url + config.params;
    //     config.params = config.params;
    //   }
    // }
    return config;
  },

  /**
   * @description: 请求拦截器处理
   */
  requestInterceptors: (config) => {
    // 请求之前处理config

    return config;
  },

  /**
   * @description: 响应错误处理
   */
  responseInterceptorsCatch: (error: any) => {
    const { response, code, message } = error || {};
    const msg: string =
      response && response.data && response.data.error ? response.data.error.message : '';
    const err: string = error.toString();
    try {
      if (code === 'ECONNABORTED' && message.indexOf('timeout') !== -1) {
      }
      if (err && err.includes('Network Error')) {
        console.log(err);
      }
    } catch (error) {
      throw new Error(error);
    }
    checkStatus(error.response && error.response.status, msg);
    return Promise.reject(error);
  },
};

export function createAxios(opt?: Partial<CreateAxiosOptions>) {
  return new VAxios(
    deepMerge(
      {
        timeout: opt?.timeout|| 5 * 1000,
        // 基础接口地址
        baseURL: opt?.baseURL,
        //baseURL: globSetting.apiUrl,
        // 接口可能会有通用的地址部分，可以统一抽取出来
        headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
        // 数据处理方式
        transform,
        // 配置项，下面的选项都可以在独立的接口请求中覆盖
        requestOptions: {
          // 默认将prefix 添加到url
          joinPrefix: true,
          // 需要对返回数据进行处理
          isTransformRequestResult: true,
          // post请求的时候添加参数到url
          joinParamsToUrl: false,
          // 格式化提交参数时间
          formatDate: true,
          // 消息提示类型
          errorMessageMode: 'none',
          // 接口地址
          apiUrl: opt?.url,
        },
      },
      opt || {}
    )
  );
}
export const defHttp = createAxios();

// other api url
// export const otherHttp = createAxios({
//   requestOptions: {
//     apiUrl: 'xxx',
//   },
// });
