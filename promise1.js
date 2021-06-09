const PENDING = 'PENDING',
      FULFILLED = 'FULFILLED',
      REJECTED  = 'REJECTED'
/**
 * promise1.js
 * 写了一个最最最基本的promise
 * 只能实例化 promise
 * resolve，reject，throw error
 * 并去调用执行对应的一个then方法
 */

class MyPromise{
    //executor 执行器
    //有两个参数，一个resolve，一个reject
    //传入构造器，并立即执行 executor === 相当于在new Promise(executor) 构造函数里的构造器传入executor 
    constructor(executor){
        this.status = PENDING
        this.value = undefined
        this.reason = undefined

        //为什么resolve和reject不定义在constructor外面，
        //定义在外面相当于在类的prototype上定义，这样会造成每个实例都是继承同一个resolve
        //但是每一个promise的执行器里面都应该有自己的resolve
        const resolve = (value) => {
            //resolve和reject执行，结果产生以后不能变化状态
            //所以resolve只有this.status === PENDING，才能更改状态
            if(this.status === PENDING){
                this.status = FULFILLED;
                this.value = value
            }
        }
        
        const reject = (reason) => {
            if(this.status === PENDING){
                this.status = REJECTED
                this.reason = reason
            }
        }
        //try catch 用于捕获 异常和抛出的错误
        //一旦catch，则执行reject()
        try {
            executor(resolve,reject)
        } catch (e) {
            reject(e)
        }
    }
    //then 有两个参数(onFulfilled,onRejected)
    //一个成功的回调----在this.status === fulfilled时执行
    //一个失败的回调----在this.status === rejected时执行
    then (onFulfilled,onRejected) {
        if(this.status === FULFILLED){
            onFulfilled(this.value)
        }
        if(this.status == REJECTED){
            onRejected(this.reason)
        }
    }
}
module.exports = MyPromise
