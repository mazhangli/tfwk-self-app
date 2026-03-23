import type { GlobEnvConfig } from '@/types/config';
import * as utils from '@/utils/utils';

export const getGlobEnvConfig = (): GlobEnvConfig => {
  const env = process.env;//import.meta.env;
  return (env as unknown) as GlobEnvConfig;
};

/**
 * @description: 开发模式
 */
export const devMode = 'development';

/**
 * @description: 生产模式
 */
export const prodMode = 'production';

/**
 * @description: 获取环境变量
 * @returns:
 * @example:
 */
export const getEnv = (): string => process.env.NODE_ENV;


/**
 * @description: 是否是开发模式
 * @returns:
 * @example:
 */
export const isDevMode = (): boolean =>  process.env.NODE_ENV === 'development';

/**
 * @description: 是否是生产模式模式
 * @returns:
 * @example:
 */
export const isProdMode = (): boolean =>  process.env.NODE_ENV === 'production';

/**
 * @description: 是否开启mock
 * @returns:
 * @example:
 */
export const isUseMock = (): boolean => process.env.VUE_APP_USE_MOCK?.toLowerCase() === "true";
// {
//  return utils.loadEnv();
// }
