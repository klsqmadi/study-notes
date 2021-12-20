const Pending = 'pending',
    Fulfilled = 'fulfilled',
      Rejected = 'rejected'
class MyPromise {
    constructor(executor) {
        this.value = null
        this.reason = null
        this.status = Pending
        this.FulfilledStack = []
        this.RejectedStack = []
        let resolve = (value) => {
            if (this.status === Pending) {
                this.status = Fulfilled
                this.value = value
                this.FulfilledStack.forEach(fn => fn())
            }
        }

        let reject = (reason) => {
            if (this.status === Pending) {
                this.status = Rejected
                this.reason = reason
                this.RejectedStack.forEach(fn => fn())
            }
        }
        try {
            executor(resolve, reject)
        } catch (e) {
            reject(e)
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value
        onRejected = typeof onRejected === 'function' ? onRejected : reason => { throw reason }
        let promise2 = new MyPromise((resolve, reject) => {
            if (this.status === Fulfilled) {
                try {
                    let count = 0
                    let observe = new MutationObserver((mutationRecords, observers) => {
                        console.log('mutationRecords: ', mutationRecords);
                        let x = onFulfilled(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                        
                    })
                    let textNode = document.createTextNode(String(count))
                    observe.observe(textNode, { characterData: true })
                    textNode.data = String(++count)
                } catch (error) {
                    reject(error)
                }
            }
            if (this.status === Rejected) {
                try {
                    let count = 0
                    let observe = new MutationObserver((mutationsList, observer) => {
                        let x = onRejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                        
                    })
                    let textNode = document.createTextNode(String(count))
                    observe.observe(textNode, { characterData: true })
                    textNode.data = String(++count)
                } catch (error) {
                    reject(error)
                }
            }
            if (this.status === Pending) {
                try {
                    this.FulfilledStack.push(() => { let x = onFulfilled(this.value) })
                    
                } catch (error) {
                    reject(error)
                }

                try {
                    this.RejectedStack.push(() => { let x = onRejected(this.reason) })
                    
                } catch (error) {
                    reject(error)
                }

            }
        })
        return promise2
    }
    catch(onRejected) {
        return this.then(null, onRejected)
    }
    finally(onFinally) {
        return this.then(value => Promise.resolve(onFinally()).then(() => value), reason => Promise.reject(onFinally).then(() => reason))
    }
}
MyPromise.all = function (promises) {
    let result = []
    let promiseCount = 0
    let length = promises.length
    return new MyPromise((resolve, reject) => {
        for (let i = 0; i < length; i++) {
            promises[i].then(value => {
                result[i] = value
                promiseCount++
                if (promiseCount == length) {
                    resolve(result)
                }
            }, reason => {
                reject(reason)
            })
        }
    })
}
MyPromise.resolve = function (value) {
    return new MyPromise((resolve, reject) => {
        resolve(value)
    })
}
MyPromise.reject = function (reason) {
    return new Promise((resolve, reject) => {
        reject(reason)
    })
}
MyPromise.race = function (promises) {
    return new MyPromise((resolve, reject) => {
        for (let i = 0; i < promises.length; i++) {
            promises[i].then((value) => {
               resolve(value)
            })
        }
    })
}
 
function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        throw new TypeError('typeError')
    }
    else {
        let called = false
        if ((typeof x === 'object' && x != null) || typeof x === 'function') {
            try {
                if (typeof x.then === 'function') {
                    x.then((y) => {
                        if (called) return
                        called = true
                        resolve(y)
                    }, (r) => {
                        if (called) return
                        called = true
                        reject(r)
                    })
                } else {
                    resolve(x)
                }
            } catch (error) {
                reject(error)
            }
        } else {
            if (called) return
            called = true
            return x
        }

    }
}

module.exports = MyPromise