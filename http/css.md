# BFC
- FC就是format context格式化上下文，是一个独立的渲染环境，它拥有自己的渲染规则，在元素环境内规定了子元素如何进行布局和之间的相互作用，不会受到外界环境的影响
- 在BFC里，块盒和行盒都会沿着父左边框垂直排列
- BFC的垂直距离由margin值决定，在BFC里相邻的两个元素的margin值会发送重叠
- BFC在页面内就是一个隔离的容器，容器内的子元素不会影响到外界元素，所以在遇到兄弟元素是float box时，float box不应该影响BFC内部元素的布局，他会通过变窄来自适应
- 如果BFC容器内有float元素，他在计算高度时会把float也计算进去
## 创建BFC
- float值不是none
- overflow不是visible，应该是auto，hidden，scroll
- position的值不是static或者relative
- display的值是flex，inline-block，inline-flex，table-cell

# 高度塌陷
- 使用伪元素设置clear：both
- 在浮动盒子下面加一个空div，再加上属性clear：both
- 让父元素触发BFC
# css优先级
- 1. !important
- 2. 内联样式*1000*
- 3. id选择器*0100*
- 4. 类选择器，伪类选择器，属性选择器*0010*
- 5. 标签选择器，伪元素选择器*0001*
- 6. 通配符，子类选择器，兄弟选择器 *0000*
- 7. 继承样式

- 权值比重是256进制，所以说256个类选择器才能覆盖id选择器的样式
##  伪类和伪元素
- 伪类表示被选择元素的某个状态，如:fouse,:active,:hover，:link
  - 1. 状态伪类
  - 2. 结构伪类:first-child , nth-child() :
  - 3. 表单相关伪类
- 伪元素表示被选择元素的某个部分，这个部分看起来像一个独立的元素，但是伪元素只存在于css
  - 1. css3之前:before, :after, :first-letter :first-line
  - 2. css3之后:placeholder, :section

# 行内元素哪些属性不能设置
- width height padding/margin-top/bottom float line-height
# 兄弟选择器
- +，某个元素的后面一个兄弟
- ~，某个元素的后面所有兄弟

# rem em px vh vw的区别