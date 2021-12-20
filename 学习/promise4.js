const PENDING = 'PENDING',
    FULFILLED = 'FULFILLED',
    REJECTED = 'REJECTED'

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        throw new TypeError('it is the same promise')
    } else {
        let called = false
        if ((typeof x === 'object' && x !== null) || typeof x === 'function') {
            try {
                let then = x.then
                if (typeof then === 'function') {
                    then.call(x, (y)=>{
                        if(called) return 
                        called = true
                        resolvePromise(promise2, y, resolve, reject)
                    },(r)=>{
                        if(called) return 
                        called = true
                        reject(r)
                    })
                } else {
                    resolve(x)
                }
            } catch (e) {
                if(called) return 
                called = true
                reject(e)
            }
        }else{
            if(called) return 
            called = true
            resolve(x)
        }
    }
}
class MyPromise {
    //executor 执行器
    //有两个参数，一个resolve，一个reject
    //传入构造器，并立即执行 executor === 相当于在new Promise(executor) 构造函数里的构造器传入executor 
    constructor(executor) {
        this.status = PENDING
        this.value = undefined
        this.reason = undefined

        this.onFulfilledCallbacks = []
        this.onRejectedCallbacks = []
        //为什么resolve和reject不定义在constructor外面，
        //定义在外面相当于在类的prototype上定义，这样会造成每个实例都是继承同一个resolve
        //但是每一个promise的执行器里面都应该有自己的resolve
        const resolve = (value) => {
            //resolve和reject执行，结果产生以后不能变化状态
            //所以resolve只有this.status === PENDING，才能更改状态
            if (this.status === PENDING) {
                this.status = FULFILLED;
                this.value = value
                //++发布订阅
                this.onFulfilledCallbacks.forEach(fn => fn())
            }
        }

        const reject = (reason) => {
            if (this.status === PENDING) {
                this.status = REJECTED
                this.reason = reason
                //++发布订阅
                this.onRejectedCallbacks.forEach(fn => fn())
            }
        }
        //try catch 用于捕获 异常和抛出的错误
        //一旦catch，则执行reject()
        try {
            executor(resolve, reject)
        } catch (e) {
            reject(e)
        }
    }

    //then 有两个参数(onFulfilled,onRejected)
    //一个成功的回调----在this.status === fulfilled时执行
    //一个失败的回调----在this.status === rejected时执行
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function'?onFulfilled:value => value
        onRejected = typeof onRejected === 'function'?onRejected:reason =>{throw reason}
        let promise2 = new Promise((resolve, reject) => {
            if (this.status === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0);
            }
            if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)

                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0);
            }
            //+-当进入then方法后，this.status仍处于pending时，需要处理这个状态
            //在then被多次调用时,必须按每个then原有的顺序  依次去执行then里面的方法
            //而且当this.status 确定后,只能去执行每个then里面onFulfilled方法
            //                             /或者/
            //                             执行每个then里面onRejected方法
            //不可能先去执行onFulfilled成功的方法，再去执行onRejected失败的方法

            //在setTimeOut 异步执行resolve方法，会延迟状态的改变，
            //但所有的then方法都会继续执行，所以需要收集方法-------这个过程就是--订阅--的过程
            if (this.status === PENDING) {
                //收集所有的onFulfilled回调，同时需要存储value
                //所以用一个函数，里面放onFulfilled参数的执行
                //这个过程就是--订阅--的过程
                //-+
                this.onFulfilledCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    }, 0);
                })
                this.onRejectedCallbacks.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onRejected(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    }, 0);
                })
            }
        })
        return promise2
    }
}

module.exports = MyPromise