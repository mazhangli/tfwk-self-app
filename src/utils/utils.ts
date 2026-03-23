import { existsSync, lstatSync, readdirSync, readFileSync } from 'fs';
import { resolve } from 'path';
import { networkInterfaces } from 'os';
import { config, parse } from 'dotenv';
import chalk from 'chalk';

export const isFunction = (arg: unknown): arg is (...args: any[]) => any =>
  typeof arg === 'function';

export const isRegExp = (arg: unknown): arg is RegExp =>
  Object.prototype.toString.call(arg) === '[object RegExp]';

/*
 * Read all files in the specified folder, filter through regular rules, and return file path array
 * @param root Specify the folder path
 * [@param] reg Regular expression for filtering files, optional parameters
 * Note: It can also be deformed to check whether the file path conforms to regular rules. The path can be a folder or a file. The path that does not exist is also fault-tolerant.
 */
export function readAllFile(root: string, reg: RegExp) {
  let resultArr: string[] = [];
  try {
    if (existsSync(root)) {
      const stat = lstatSync(root);
      if (stat.isDirectory()) {
        // dir
        const files = readdirSync(root);
        files.forEach(function (file) {
          const t = readAllFile(root + '/' + file, reg);
          resultArr = resultArr.concat(t);
        });
      } else {
        if (reg !== undefined) {
          if (isFunction(reg.test) && reg.test(root)) {
            resultArr.push(root);
          }
        } else {
          resultArr.push(root);
        }
      }
    }
  } catch (error) {}

  return resultArr;
}

/**
 * get client ip address
 */
export function getIPAddress() {
  let interfaces = networkInterfaces();
  for (let devName in interfaces) {
    let iFace = interfaces[devName];
    if (!iFace) return;
    for (let i = 0; i < iFace.length; i++) {
      let alias = iFace[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address;
      }
    }
  }

  return '';
}
//身份证号脱敏
export function idCardEncipher(idCard: string): string {
  const reg = /^(.{4})(?:\d+)(.{2}$)/;
  const maskedIdCard = idCard.replace(reg, '$1******$2');
  return maskedIdCard;
}
export function isDevFn(): boolean {
  return process.env.NODE_ENV === 'development';
}

export function isProdFn(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Whether to generate package preview
 */
export function isReportMode(): boolean {
  return process.env.REPORT === 'true';
}

/**
 *  Whether to generate package site
 */
export function isSiteMode(): boolean {
  return process.env.SITE === 'true';
}

export interface VueEnv {
  VUE_APP_PORT: number;
  VUE_APP_ASSETS_DIR: string;
  VUE_APP_USE_MOCK: boolean;
  VUE_APP_USE_PWA: boolean;
  VUE_APP_PUBLIC_PATH: string;
  VUE_APP_PROXY: [string, string][];
  VUE_APP_USE_CDN: boolean;
  GLOB_APP_TITLE: string;
  BUILD_ON_CLEAN_CONSOLE: boolean;
  BUILD_ON_GZIP: boolean;
}

// Read all environment variable configuration files to process.env
export function loadEnv(): VueEnv {
  const env = process.env.NODE_ENV.trim();
  const ret: any = {};
  const envList = [`.env.${env}.local`, `.env.${env}`, '.env.local', '.env', ,];
  envList.forEach((e) => {
    config({
      path: e,
    });
  });
  for (const envName of Object.keys(process.env)) {
    let realName = (process.env as any)[envName].replace(/\\n/g, '\n');
    realName = realName === 'true' ? true : realName === 'false' ? false : realName;
    if (envName === 'VUE_APP_PORT') {
      realName = Number(realName);
    }
    if (envName === 'VUE_APP_PROXY') {
      try {
        realName = JSON.parse(realName);
      } catch (error) {}
    }
    ret[envName] = realName;
    process.env[envName] = realName;
  }
  return ret;
}

/**
 * Get the environment variables starting with the specified prefix
 * @param match prefix
 * @param confFiles ext
 */
export function getEnvConfig(match = 'GLOB_', confFiles = ['.env', '.env.production']) {
  let envConfig = {};
  confFiles.forEach((item) => {
    try {
      const env = parse(readFileSync(resolve(process.cwd(), item)));

      envConfig = { ...envConfig, ...env };
    } catch (error) {}
  });
  Object.keys(envConfig).forEach((key) => {
    const reg = new RegExp(`^(${match})`);
    if (!reg.test(key)) {
      Reflect.deleteProperty(envConfig, key);
    }
  });
  return envConfig;
}

function consoleFn(color: string, message: any) {
  console.log(
    chalk.blue.bold('****************  ') +
      (chalk as any)[color].bold(message) +
      chalk.blue.bold('  ****************')
  );
}

/**
 * warnConsole
 * @param message
 */
export function successConsole(message: any) {
  consoleFn('green', '✨ ' + message);
}

/**
 * warnConsole
 * @param message
 */
export function errorConsole(message: any) {
  consoleFn('red', '✨ ' + message);
}

/**
 * warnConsole
 * @param message message
 */
export function warnConsole(message: any) {
  consoleFn('yellow', '✨ ' + message);
}

/**
 * Get user root directory
 * @param dir file path
 */
export function getCwdPath(...dir: string[]) {
  return resolve(process.cwd(), ...dir);
}

// export const run = (bin: string, args: any, opts = {}) =>
//   execa(bin, args, { stdio: 'inherit', ...opts });


export function sleep(ms: number | undefined) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
