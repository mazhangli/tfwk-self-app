//参考vue3.x官方文档:https://cli.vuejs.org/zh/config
import { ProjectOptions } from '@vue/cli-service';
import { resolve, join } from 'path';

//注意开头被//注释的参数不建议新手轻易改动
function pathResolve(dir) {
  return resolve(__dirname, '.', dir);
}

function joinResolve(dir) {
  return join(__dirname, dir);
}

const addStyleResource = function(rule: any) {
  rule
    .use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [resolve(__dirname, './src/assets/style/style.less')],
    });
};

import { loadEnv } from './src/utils/utils';
const viteEnv = loadEnv();

import { createProxy } from './src/utils/proxy';
import { modifyVars } from './src/assets/less/resetvant/var';

const {
  VUE_APP_PORT,
  VUE_APP_ASSETS_DIR,
  VUE_APP_USE_MOCK,
  VUE_APP_USE_PWA,
  VUE_APP_PUBLIC_PATH,
  VUE_APP_PROXY,
} = viteEnv;

console.log(VUE_APP_PROXY);

// ============================================================

const config: ProjectOptions = {
  publicPath: VUE_APP_PUBLIC_PATH,
  outputDir: VUE_APP_PUBLIC_PATH,
  assetsDir: VUE_APP_ASSETS_DIR,
  lintOnSave: false,

  configureWebpack: {
    resolve: { extensions: ['.ts', '.tsx', '.js', '.json', 'mjs'] },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            appendTsSuffixTo: [/\.vue$/],
          },
        },
      ],
    },
    externals: {
      './config.jsON': 'commonjson ./config.json'
    }
  },

  chainWebpack: (config) => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal'];
    types.forEach((type) => addStyleResource(config.module.rule('less').oneOf(type)));
    config.resolve.alias;
  },

  css: {
    extract: false,
    requireModuleExtension: true,
    loaderOptions: {
      less: {
        modifyVars: {
          hack: `true; @import "${joinResolve('./src/assets/style/less.less')}";`,
        },
      },
    },
  },

  devServer: {
    open: false,
    hotOnly: false,
    proxy: {
      '/api': {
        target: 'http://localhost:777/Service.asmx',
        ws: true,
        changOrigin: true,
        pathRewrite: {
          '^/api': '',
        },
      },
    },
  },
};

module.exports = config;