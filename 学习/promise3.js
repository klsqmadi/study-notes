//promise 的一些特性

/**
 * 成功的条件
 * then return 一个普通的javascript 的value
 * then return 一个new Promise()成功态的结果 的value
 */

/**
 * 失败的条件
 * then return  抛出异常 throw new Error() 
 * then return  一个new Promise()失败态的结果
 */

//promise 的链式调用
//jQuery 的链式调用是通过 return this
//then 里面没有this ，onFulfilled and onRejected must be called as functions
//这两个参数必须被当成函数调用，所以没有this
//return new Promise()