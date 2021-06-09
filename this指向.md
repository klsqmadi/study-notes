#### 默认绑定规则

- 函数独立调用
- 独立调用的函数的内部this指向 就会指向window 

- this -> window

#### 隐式绑定规则

##### 谁调用就指向谁

- 在预编译的时候，每个函数都会有一个this指向

- 每一个函数执行，都会有一个自身的 this指向

- 函数执行，this指向才有意义，函数不执行，this指向没有意义

- 每个函数自身的this指向都会在函数执行的时候才会产生的

- 每个函数本身的this指向可能相等

- ```
  就是在预编译的时候，每个函数都会被分配一个this指向，然后再函数执行时，this指向会重新被修改，形成函数自身的this指向
  ```

- 当方法重写或方法被赋值的时候，会隐式丢失

- ```
  function foo (){
          console.log(this)
      }
      let obj = {
          a :2,
          foo:foo
      }
      let boo = obj.foo
      obj.foo()
      boo()
  ```

- 参数赋值调用

- ```
  function bar(fn){
          console.log(this)
          fn()
      }
  bar(obj.foo)
  ```

##### 父函数是有能力决定 子函数的this指向

- 回调函数，父函数，子函数
- 当函数作为参数时，该函数也就是回调函数 

#### 显示绑定

- call

  ```
  bar.call(obj,1,2,3,4,5)
  bar,call(obj,...[1,2,3,4,5])
  
  this指向 一定是对象
  
  bar.call(1,2,3,4)
  当1变为第一个参数，this指向时，
  1不是对象，会通过相应的包装类把1包装成一个对象
  Number(1)
  ```

- apply

  ```
  bar.apply(obj,[1,2,3,4,5])
  ```

- bind

  ```
  bar.bind(obj)(...[1,2,3,4,5])
  ```

#### new绑定 

- ```
  function Person(){
  	this.a = 1
  }
  console.log(new Person) // Person{}
  
  function Person(){
  	return 1
  }
  console.log(new Person) // Number(1)
  
  fuunction Person(){
  	return {}
  }
  console.log(new Person) // {}
  ```

#### 构造函数和函数的区别

- 构造函数会使用this关键字定义成员变量和成员方法，函数不会使用this关键字

- 构造函数一般是不需要显示返回值的，因为new操作符 会返回一个对象

- 每个构造函数在**new**之后都会返回一个对象，（构造函数可以返回一个对象，如果构造函数不返回值 ，或者不返回一个对象，new操作符会（帮构造函数返回一个对象）默认返回一个，如果构造函数返回一个对象，那么new操作符就不帮构造函数返回对象）

#### 箭头函数

- 箭头函数本身没有this（不去绑定一个this），它是顺着作用域往上寻找最近的一个this作为他的this
- 取决于父环境中的this指向

- 默认绑定规则（独立调用对箭头函数绑定无效）
- 隐式绑定规则无效
- new不能实例箭头函数

#### 函数声明和函数表达式

- 函数声明会在预编译的时候被提升到作用域最上面
- 函数表达式创建的函数是在运行时进行赋值，而且要等到赋值完成之后才可以进行调用

