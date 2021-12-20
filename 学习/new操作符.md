```
function likeNew(fn){
        let obj = Object.create(fn.prototype)  
        let arg = [].slice.call(arguments,1)
        let result = fn.call(obj,...arg)
        if(result instanceof Object || typeof result === 'function'){
            console.log(1)
            return result
        }
        return obj
}
function Person(name){
        this.name = name
}
//  1.有一个对象取代了构造函数原先里面的this
let obj = {}
let result = fn.call(obj)

//  2.同时这个obj会与构造函数的prototype连接起来，即obj是通过（new 构造函数）实例化生成的
obj.__proto__ = fn.prototype//但这样写有一定的副作用，就是可以被枚举
--->
let obj = Object.create(fn.prototype) || Object.setPrototypeOf(obj,fn.prototype)
//Object.create 和setPrototypeOf 有一些区别

//  3.有一些参数可能需要传进来，参数传给构造函数中
let args = Array.prototype.slice.call(arguments,1)//拿到除了第一个参数：fn之后的参数(arguments)
result = fn.call(obj,...args)

//  4.如果构造函数有返回值，返回值是原始值时，默认返回一个由fn实例化的obj，返回值是引用值时，则返回result，
if(typeof result === 'function' || result instanceof Object){
	return result
}else{
	return obj
}
```



#### new操作符做了哪些事

```
1.创建了一个全新的对象
2.这个对象ui被执行[[prototype]],也就是与构造函数的prototype进行链接
3.生成的新对象会绑定到构造函数调用的this
4.如果函数没有返回对象类型Object(包含Functoin, Array, Date, RegExg, Error)，那么new表达式中的函数调用会自动返回这个新的对象。
```

