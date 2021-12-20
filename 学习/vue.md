# vue的生命周期
1. new Vue
   1. 进入了_init函数，主要初始化了一些属性
   2. initLifeCircle
      1. 初始化了$parent, $children,根实例没有 $parent，而且 $children是一个空数组，等到根实例的子组件进行initLifeCircle，把子组件自身放入根实例的 $children中
   3. initEvent
      1. 初始化了事件相关的属性，比如_event，once，on，off，emit
   4. initRenders
      1. 初始化了渲染相关的，比如 $createElement
2. beforeCreate
3. beforeCreate调用完之后，create之前
   1. 初始化inject
   2. 初始化state
      1. 初始化props
      2. 初始化methods
      3. 初始化data
      4. 初始化computed
      5. 初始化watch
   3. 初始化provide 
4. create
5. create调用完之后，beforeMount之前
   1. 判断是否是runtime with compiler版本，如果是判断是否有el选项，再判断template，如果有template则将template编译成render函数，如果没有就将el对应的outer html作为template编译成render
6. beforeMount
   1. 会调用updateComponent函数，里面会执行update函数，首先会在参数里执行render函数，render函数里面的with调用，执行render字符串里面的_c,_s,_v函数，生成vnode，然后update会将vnode进行patch操作，帮我们把vnode通过createTrueElement函数生成真实节点并且渲染到dom节点中
   2. 再执行_s时，会触发data的get，dep进行依赖收集，收集那些watcher，在之后数据更新时，重新触发updateComponents，
   3. 如果是更新后调用updateComponent函数，updateComponent函数的内部patch就不在是初始化创建节点，而是对新旧vnode进行diff，最小化更新节点
7. mount
8. 当响应式数据更新时，会触发watcher的回调函数，也就是vm._update(vm._render()),在更新之前会调用beforeUpdate
9. beforeUpdate
   1.  由于vue的异步更新机制，beforeUpdate的调用会在nextTick中
   2.  经过一系列patch，diff，组件渲染完毕，调用update构子 
10. update
11. 在patch的过程中，如果发现有组件消失了，就会调用removeVnode进入组件的销毁过程
12. beforeDestroy
13. 经历清除父子关系，watcher逻辑，事件监听器等
14. destroy