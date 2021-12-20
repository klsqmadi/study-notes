#### Object.create(A,B)

##### 第一个参数

- 必需参数

- type：[Object，null]（Object prototype may only be an Object or null）

- 当值为null时，将生成一个不继承任何属性的对象(比如没有toString和valueOf方法)

- 当值为obj时，将新建一个空的构造函数Fn()，将Fn.prototype指向obj，然后返回一个new Fn()实例，实例会继承obj的属性

- ```
  Object.create = function (obj) {
      function F() {} //新建一个空的构造函数
      F.prototype = obj; //构造函数的原型对象指向obj
      return new F(); //返回一个继承了obj属性的构造函数的实例化对象
    };
    
  -----
  
  Object.create = function (obj) {
      var B={}; //实例化一个obj
      B.__proto__=obj; //实例化对象的__proto__ 指向obj
      return B;  //返回实例化对象
  };
  ```

##### 第二个参数

- 该参数是一个属性描述对象，它所描述的对象属性，会添加到实例对象，作为该对象自身的属性。

- ```
  var obj = Object.create({}, {
    p1: {
      value: 123,
      enumerable: true,
      configurable: true,
      writable: true,
    },
    p2: {
      value: 'abc',
      enumerable: true,
      configurable: true,
      writable: true,
    }
  });
  
  // 等同于
  var obj = Object.create({});
  obj.p1 = 123;
  obj.p2 = 'abc';
  ```

#### Object.setPrototypeOf(obj,prototype)

- obj 要设定原型的对象

- prototype 新的原型对象

- ```
  function setProOf(obj,prototype){
  	obj.__proto__ = prototype
  	return obj
  }
  ```
  

#### create和setPrototypeOf的区别

- 使用Object.create,Animal.prototype将会指向一个空对象，空对象的原型属性指向Plants的prototytpe。所以我们不能再访问Animal的原有prototypoe中的属性。Object.create的使用方式也凸显了直接重新赋值。
- 使用Object.setPrototypeOf则会将Animal.prototype将会指向Animal原有的prototype，然后这个prototype的prototype再指向Plants的prototytpe。所以我们优先访问的Animal，然后再是plants。
- 在进行俩个原型之间的委托时使用setPrototype更好，Object.create更适和直接对一个无原生原型的对象快速进行委托。