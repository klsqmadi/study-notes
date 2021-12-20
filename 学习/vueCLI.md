### 开启服务器

- 对一个js或vue单一文件开启服务器，在这个文件下运行`vue serve`
- `vue serve`会默认一个入口文件（`main.js`  `index.js` `App.vue` `app.vue`）
- 也可以指定入口`vue serve myCpn.vue`(再提供一个`index.html` `package.json` 安装并使用依赖，相应文件配置`babel`，`postcss` 和`eslint` 直接 == `vue create`)

- ```text
  Usage: serve [options] [entry]
  
  在开发环境模式下零配置为 .js 或 .vue 文件启动一个服务器
  
  
  Options:
  
    -o, --open  打开浏览器
    -c, --copy  将本地 URL 复制到剪切板
    -h, --help  输出用法信息
  ```

- ```text
  Usage: build [options] [entry]
  
  在生产环境模式下零配置构建一个 .js 或 .vue 文件
  build也和serve差不多 可以单独打包一个文件
  
  Options:
  
    -t, --target <target>  构建目标 (app | lib | wc | wc-async, 默认值：app)
    -n, --name <name>      库的名字或 Web Components 组件的名字 (默认值：入口文件名)
    -d, --dest <dir>       输出目录 (默认值：dist)
    -h, --help             输出用法信息
  ```

### 插件

- vue cli使用了一个基于插件的架构
- 一个项目里的package.json 里面的依赖都是以@vue/cli-plugin开头的
- 插件可以直接修改webpack的内部配置，也可以直接`vue-cli-service`注入一些命令
- 每一个插件都一个生成器（Generator 用来创建文件的）和运行时插件（runtime plugin 用来调整webpack的内部配置和注入命令的 ）

- `vue add eslint`可以向一个已经创建好的项目中追加一些插件
- `vuePlugins.resolveFrom`可以写在package.json中，它可以指向在该项目之外的文件夹的package.json
- 如果只需要调用插件里的暴露出来的api而不需要完整的插件，可以在package.json使用`vuePlugins.service:[common.js]`

### preset

- preset是一个包含创建新项目所需的预定义选项和插件的json对象
- `vuerc`存储在c盘的目录下 

### CLI服务

- @vue/cli-service 安装了一个vue-cli-serve的命令，可以在npm script中调用他，或者在终端用./node_module/.bin/vue-cli-service去调用vue-cli-serve这个命令

- ```bash
  npm run serve
  # OR
  yarn serve
  npx vue-cli-service serve
  ```

- ```text
  用法：vue-cli-service serve [options] [entry]
  
  选项：
  
    --open    在服务器启动时打开浏览器
    --copy    在服务器启动时将 URL 复制到剪切版
    --mode    指定环境模式 (默认值：development)
    --host    指定 host (默认值：0.0.0.0)
    --port    指定 port (默认值：8080)
    --https   使用 https (默认值：false)
  ```

- vue-cli-service serve会开启一个基于webpack-dev-server的开发服务器，并且有热更新

- 除了在npm script里可以配置开发服务器，还可以在vue.config.js里进行配置

- ```text
  用法：vue-cli-service build [options] [entry|pattern]
  
  选项：
  
    --mode        指定环境模式 (默认值：production)
    --dest        指定输出目录 (默认值：dist)
    --modern      现代模式（生成2个包，一个用于支持es5的浏览器，一个支持老的浏览器）
    --target      app | lib | wc | wc-async (默认值：app)
    --name        库或 Web Components 模式下的名字 (默认值：package.json 中的 "name" 字段或入口文件名)
    --no-clean    在构建项目之前不清除目标目录
    --report      生成 report.html 以帮助分析包内容
    --report-json 生成 report.json 以帮助分析包内容
    --watch       监听文件变化
  ```



### 浏览器兼容

- `browerslist`可以指定浏览器的范围，用来确定转译的时候形成的js特性和css的前缀
- 现代模式 `--modern`会生成两个包
- 现代版的包会通过 `<script type="module">` 在被支持的浏览器中加载；它们还会使用 `<link rel="modulepreload">` 进行预加载。
- 旧版的包会通过 `<script nomodule>` 加载，并会被支持 ES modules 的浏览器忽略。

### html和静态资源

- public//index.html会被html-webpack-plugin处理，vuecli也会注入静态资源和js css

- `prelaod`用来指定页面加载后很快会被用到的资源，所以在页面加载的过程中，我们希望在浏览器开始主体渲染之前尽早 preload。这些提示会被 [@vue/preload-webpack-plugin](https://github.com/vuejs/preload-webpack-plugin) 注入，并且可以通过 `chainWebpack` 的 `config.plugin('preload')` 进行修改和删除。
- `prefecth`用来告诉浏览器在页面加载完成后，利用空闲时间提前获取用户未来可能会访问的内容。这些提示会被 [@vue/preload-webpack-plugin](https://github.com/vuejs/preload-webpack-plugin) 注入，并且可以通过 `chainWebpack` 的 `config.plugin('prefetch')` 进行修改和删除。

- 构建多页面应用，Vue CLI 支持使用 [`vue.config.js` 中的 `pages` 选项](https://cli.vuejs.org/zh/config/#pages)构建一个多页面的应用。构建好的应用将会在不同的入口之间高效共享通用的 chunk 以获得最佳的加载性能。
- 处理静态资源，可以通过js或css 通过相对路径用import引入，这些会被webpack处理，也可以放置在public目录下或通过绝对路径，这样子会直接被拷贝，而不会经过webpack的处理
- 从相对路径导入的资源会被webpack处理，所有的`url`会被解析为一个模块依赖，通过`file-loader`用`版本哈希值`和正确的`基础公共路径`来决定最终的文件路径,还有用url-loader将小于4kb的资源内联（就是放在一起），以减少http的请求数量
- url的转换规则
  - 如果url是一个绝对路径，则它不会变
  - 如果url是一个以`。`开头的，它会被解读为一个相对路径请求且基于你的文件系统里的文件结构去解析
  - 如果 URL 以 `@` 开头，它也会作为一个模块请求被解析。它的用处在于 Vue CLI 默认会设置一个指向 `<projectRoot>/src` 的别名 `@`
- public文件夹
  - 任何放置在public文件夹的静态资源都会被进行简单的拷贝，而不经过webpack，所以你要通过绝对路径来引用他们
  - 我们推荐你把资源引入作为你的模块依赖图的一部分，有几个好处
    - webpack会把js和css压缩和打包放在一起来避免额外的请求
    - 文件丢失时会导致编译错误，而不是在用户访问页面时跳出404
    - 最终生成的文件的名字会有一个哈希值，所以不用担心浏览器缓存一些老版本
  - 如果项目部署的不是根域名，需要去配置publicPath

### webpack

- 调整 webpack 配置最简单的方式就是在 `vue.config.js` 中的 `configureWebpack` 选项提供一个对象：

- ```js
  // vue.config.js
  module.exports = {
    configureWebpack: {
      plugins: [
        new MyAwesomeWebpackPlugin()
      ]
    }
  }
  ```

- 有些 webpack 选项是基于 `vue.config.js` 中的值设置的，所以不能直接修改。样做是因为 `vue.config.js` 中的值会被用在配置里的多个地方，以确保所有的部分都能正常工作在一起。

- 如果确实想要修改一些配置，可以通过在vue.config.js里的configureWebpack进行修改，这是一个函数（该函数会在环境变量被设置之后懒执行），他的第一个参数是已经被解析好的配置

- ```js
  // vue.config.js
  module.exports = {
    configureWebpack: config => {
      if (process.env.NODE_ENV === 'production') {
        // 为生产环境修改配置...
      } else {
        // 为开发环境修改配置...
      }
    }
  }
  ```

- 链式操作

  - vuecli内部的webpack配置是通过webpack-chain维护的，这个库提供了一个webpack的原始配置的抽取，使其可以定义具名的loader规则和具名插件，使得可以在后期进入规则对其选项进行修改

  - ```js
    // vue.config.js
    module.exports = {
      chainWebpack: config => {
        config.module
          .rule('vue')
          .use('vue-loader')
            .tap(options => {
              // 修改它的选项...
              return options
            })
      }
    }
    ```

  - 可以通过vue-cli-service inspect来查看解析好的webpack配置
  - 开发环境：`npx vue-cli-service inspect --mode development`
    生产环境：`npx vue-cli-service inspect --mode production`
  - 开发环境：
  - `npx vue-cli-service inspect --mode development >> webpack.config.development.js`
    生产环境：
  - `npx vue-cli-service inspect --mode production >> webpack.config.production.js`



### 模式和环境变量

- 模式
  - `development` 用于serve  创建一个 webpack 配置，该配置启用热更新，不会对资源进行 hash 也不会打出 vendor bundles，目的是为了在开发的时候能够快速重新构建。
  - `test` 用于 test：unit，Vue CLI 会创建一个优化过后的，并且旨在用于单元测试的 webpack 配置，它并不会处理图片以及一些对单元测试非必需的其他资源。
  - `production` 用于build
- 可以通过--mode 改变模式
- 当运行vue-cli-service命令时，所有的环境变量都都会从环境文件(.env .env.production .env.production.local)中载入，如果文件内部没有NODE_ENV的变量，它的值将取决于模式，

### 配置相关

#### publicPath

- default：`/`

- 部署应用包时的基本url，用法和webpack的`output.publicPaht`一致，但vuecli一些其他地方也需要用到这个值，所以不能直接在webpack.config.js直接修改这个值,要在vue.config.js里修改
- 默认情况下，vuecli会假设你的应用时被部署在一个域名的根路径下的`www.localhost:8080/`，如果需要部署在子路径下，需要配置`publicPaht`为`/my-app/`

- 这个值设置为空字符串 (`''`) 或是相对路径 (`'./'`)，效果一样

#### otupitDir

- default：`dist`
- 当vue-cli-serviice build运行时，生产环境构建文件的目录，默认会在构建前清空目录，用--no-clean可关闭
- 请始终使用 `outputDir` 而不要修改 webpack 的 `output.path`。

#### assetsDir

- Default: `''`

- 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 `outputDir` 的) 目录。

####  indexPath

- Default: `'index.html'`

- 指定生成的 `index.html` 的输出路径 (相对于 `outputDir`)。也可以是一个绝对路径。

#### filenameHashing

- Default: `true`
- 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存。然而，这也要求 index 的 HTML 是被 Vue CLI 自动生成的。如果你无法使用 Vue CLI 生成的 index HTML，你可以通过将这个选项设为 `false` 来关闭文件名哈希。

#### pages

- 多页面应用

- Default: `undefined`

- ```js
  module.exports = {
    pages: {
      index: {
        // page 的入口（除了这个必需）
        entry: 'src/index/main.js',
        // 模板来源
        template: 'public/index.html',
        // 在 dist/index.html 的输出
        filename: 'index.html',
        // 当使用 title 选项时，
        // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
        title: 'Index Page',
        // 在这个页面中包含的块，默认情况下会包含
        // 提取出来的通用 chunk 和 vendor chunk。
        chunks: ['chunk-vendors', 'chunk-common', 'index']
      },
      // 当使用只有入口的字符串格式时，
      // 模板会被推导为 `public/subpage.html`
      // 并且如果找不到的话，就回退到 `public/index.html`。
      // 输出文件名会被推导为 `subpage.html`。
      subpage: 'src/subpage/main.js'
    }
  }
  ```

#### lintOnSave

- Type: `boolean` | `'warning'` | `'default'` | `'error'`

- Default: `'default'`

- 当值为`true`或者`warning`，eslint-loader会将lint `错误`输出为`编译警告`，默认情况下会被输出到命令行，且不会使得编译失败

- 当值为`defalut`，会将lint `错误`直接输出到浏览器中，这会编译失败

- 当值为`error`，会将lint `警告`也输出为编译错误，这会编译失败

- 可以设置devServer让在浏览器中显示警告和错误

- ```js
  // vue.config.js
  module.exports = {
    devServer: {
      overlay: {
        warnings: true,
        errors: true
      }
    }
  }
  ```

#### transpileDependencies

- Type: `Array<string | RegExp>`

- Default: `[]`
- 默认情况下babel-loader会忽略所有node_module文件，开启这个配置可以去转译依赖

#### productionSourceMap

- Default: `true`
- 开启一个生产环境的sourceMap，关闭会加速build

#### configureWebpack

- Type: `Object | Function`
- 如果这个值是一个object，则会通过webpack-merge 合并到最终的配置中
- 如果这个值是一个function，则会接受一个被解析过的配置信息作为参数，这个function可以修改配置不返回任何东西

#### chainWebpack

- Type: `Function`
- 是一个函数，会接收一个基于 [webpack-chain](https://github.com/mozilla-neutrino/webpack-chain) 的 `ChainableConfig` 实例。允许对内部的 webpack 配置进行更细粒度的修改。

#### css.loaderOptions

- Type: `Object`
- Default: `{}`

- 向 CSS 相关的 loader 传递选项

#### devServer

- Type: `Object`
- [所有 `webpack-dev-server` 的选项](https://webpack.js.org/configuration/dev-server/)都支持

####  devServer.proxy

- ```
  devServer:{
  	proxy:{
  		'api':'http://localhost:3030'
  	}//请求/api/xxx   将被代理到localhost:3030/api/xxx
  }
  ```

- ```
  devServer:{
  	proxy:{
  		context:['/auth','/api'],
  		target:'http://localhost:3030'
  	}多个路径代理
  }
  ```

- ```
  devServer：{
  	proxy:{
  		'api':{
  			target:'http://localhost:3030',
  			pathRewrite:{'^/api':''}，//路径重写
  			changeOrigin：true//跨域配置，
  			secure：true//https配置
  		} 
  	}
  }
  ```

- ```
  target：要使用url模块解析的url字符串
  forward：要使用url模块解析的url字符串
  agent：要传递给http（s）.request的对象（请参阅Node的https代理和http代理对象）
  ssl：要传递给https.createServer（）的对象
  ws：true / false，是否代理websockets
  xfwd：true / false，添加x-forward标头
  secure：true / false，是否验证SSL Certs
  toProxy：true / false，传递绝对URL作为路径（对代理代理很有用）
  prependPath：true / false，默认值：true - 指定是否要将目标的路径添加到代理路径
  ignorePath：true / false，默认值：false - 指定是否要忽略传入请求的代理路径（注意：如果需要，您必须附加/手动）。
  localAddress：要为传出连接绑定的本地接口字符串
  changeOrigin：true / false，默认值：false - 将主机标头的原点更改为目标URL
  ```

