const { defineConfig } = require('@vue/cli-service')
const { VantResolver } = require('@vant/auto-import-resolver')
const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
// 去掉注释js
const TerserPlugin = require('terser-webpack-plugin')
module.exports = defineConfig({
  outputDir: process.env.VUE_APP_PAGE_RHEME, // 打包生成的文件夹名称
  productionSourceMap: false, // 正式环境去掉sourcemap
  transpileDependencies: true, // true 表示开启 eslint,但不阻塞项目运行
  lintOnSave: false, // 关闭eslint
  devServer: {
    port: process.env.VUE_APP_PORT,
    proxy: {
      '/mall': {
        target: 'https://hellofun789.one/', // 目标代理接口地址
        changeOrigin: true,
        ws: false,
        secure: false,
      },
    },
    client: {
      overlay: false,
    },
  },
  css: {
    extract: false,
    sourceMap: true,
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    },
  },
  configureWebpack: (config) => {
    const { VUE_APP_ENV } = process.env
    const plugins = [
      AutoImport.default({ resolvers: [VantResolver()] }),
      Components.default({ resolvers: [VantResolver()] }),
    ]
    // 去掉js注释
    if (VUE_APP_ENV === 'production') {
      plugins.push(
        new TerserPlugin({
          terserOptions: {
            ecma: undefined,
            warnings: false,
            parse: {},
            compress: {
              drop_console: true,
              drop_debugger: false,
              pure_funcs: ['console.log'], // 移除console
            },
          },
        })
      )
    }
    config.devtool = VUE_APP_ENV === 'production' ? false : 'source-map'
    config.plugins = [...config.plugins, ...plugins]
    config.optimization = {
      splitChunks: {
        cacheGroups: {
          common: {
            name: 'chunk-common',
            chunks: 'initial',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
            priority: 1,
            reuseExistingChunk: true,
            enforce: true,
          },
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            chunks: 'initial',
            priority: 2,
            reuseExistingChunk: true,
            enforce: true,
          },
          vant: {
            name: 'chunk-vant',
            test: /[\\/]node_modules[\\/](vue-)?vant[\\/]/,
            chunks: 'all',
            priority: 4,
            reuseExistingChunk: true,
            enforce: true,
          },
        },
      },
    }
  },
  chainWebpack(config) {
    // 获取环境变量
    const { VUE_APP_TITLE, VUE_APP_PAGE_RHEME, VUE_APP_ENV, VUE_APP_COLOR_THEME } = process.env
    // 删除.vue 文件template代码注释
    if (VUE_APP_ENV === 'production') {
      const vueRule = config.module.rule('vue')
      // 修改Vue-loader的选项
      vueRule.use('vue-loader').tap((options) => ({
        ...options,
        compilerOptions: {
          // 移除HTML模板注释
          comments: false,
        },
      }))
    }
    config.plugin('html').tap((args) => {
      args[0].templateParameters = (compilation, assets, options) => {
        return {
          compilation,
          webpackConfig: compilation.options,
          htmlWebpackPlugin: {
            tags: assets.chunks,
            files: assets.files,
            options,
          },
          // 注入到index.html的变量
          // PUBLIC_PATH: process.env.PUBLIC_PATH || '/',
          // CUSTOM_NAME: VUE_APP_TITLE, // 将变量转换成字符串形式以便插入HTML中
          THEME: VUE_APP_PAGE_RHEME,
          // THEMETYPE: VUE_APP_COLOR_THEME,
        }
      }
      // 去掉html模板中注释
      if (VUE_APP_ENV === 'production') {
        args[0].minify = {
          removeComments: true, // 去除所有 HTML 注释
          collapseWhitespace: true, // 折叠空白区域（包括换行符）
          minifyCSS: true, // 压缩内联 CSS
          minifyJS: true, // 压缩内联 JavaScript
        }
      }

      return args
    })
  },
})
