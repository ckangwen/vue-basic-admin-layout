const path = require('path')

function resolve (dir) {
  return path.join(__dirname, './', dir)
}
const svgDirPath = 'src/assets/svg'
module.exports = {
  devServer: {
    proxy: {
      '/': {
        target: 'https://unpkg.com/element-ui/lib/theme-chalk/',
        ws: true,
        changOrigin: true
      }
    }
  },
  chainWebpack: config => {
    // svg rule loader
    const svgRule = config.module.rule('svg') // 找到svg-loader
    svgRule.uses.clear() // 清除已有的loader, 如果不这样做会添加在此loader之后
    svgRule.exclude.add(/node_modules/) // 正则匹配排除node_modules目录
    // 添加svg新的loader处理
    svgRule
      .test(/\.svg$/)
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]'
      })

    // 修改images loader 添加svg处理
    const imagesRule = config.module.rule('images')
    imagesRule.exclude.add(resolve(svgDirPath))
    config.module
      .rule('images')
      .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
  }
}
