const PENDING = 'pending',
    FULFILLED = 'fulfilled',
    REJECTED = 'rejected'
class myPromise {
    constructor(executor) {
        this.status = PENDING
        this.value = null
        this.reason = null

        this.fulfilledQueue = []
        this.rejectedQueue = []
        
        try {
            executor(this.resolve.bind(this), this.reject.bind(this))
        } catch (error) {
            this.reject(error)
        }
    }
    then(onFulfilled, onRejected) {
        onFulfilled = typeof onFulfilled === 'function'?onFulfilled:value => value
        onRejected = typeof onRejected === 'function'?onRejected:reason =>{throw reason}
        let promise2 = new myPromise((resolve, reject) => {
            const status = this.status
            if (status === PENDING) {
                this.fulfilledQueue.push(() => {
                    setTimeout(() => {
                        try {
                            let x = onFulfilled(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (error) {
                            reject(error)
                        }
                    }, 0);
                })
                this.rejectedQueue.push(() => {
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

            if (status === FULFILLED) {
                setTimeout(() => {
                    try {
                        let x = onFulfilled(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0);
            }
            if (status === REJECTED) {
                setTimeout(() => {
                    try {
                        let x = onRejected(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (error) {
                        reject(error)
                    }
                }, 0);
            }
        })
        return promise2
    }
    resolve(value) {
        console.log(this)
        if (this.status === PENDING) {
            this.status = FULFILLED
            this.value = value
            this.fulfilledQueue.forEach(fn => fn())
        }
    }
    reject(reason){
        if (this.status === PENDING) {
            this.status = REJECTED
            this.reason = reason
            this.rejectedQueue.forEach(fn => fn())
        }
    }
    catch(onRejected) {
        return this.then(null, onRejected)
    }
    finally(onFinally) {
        return this.then(value => Promise.resolve(onFinally()).then(() => value), reason => Promise.reject(onFinally).then(() => reason))
    }
    static resolve(value) {
        if(value instanceof myPromise) return value
        return new myPromise((resolve, reject) => resolve(value))
    }
    static reject(reason) {
        return new myPromise((resolve, reject) => reject(reason))
    }
    static all(promises) {
        let result = []
        let promiseCount = 0
        let length = promises.length
        return new myPromise((resolve, reject) => {
            for (let i = 0; i < length; i++) {
                promises[i].then(value => {
                    promiseCount++
                    result[i] = value
                    if (promiseCount === length) {
                        resolve(result)
                    }
                }, reason => reject(reason))
            }
        })
    }
    static any(promises) {
        let result = []
        let promiseCount = 0
        let length = promises.length
        return new myPromise((resolve, reject) => {
            for (let i = 0; i < length; i++) {
                promises[i].then(value => {
                    resolve(value)
                }, reason => {
                    promiseCount++
                    result[i] = value
                    if (promiseCount === length) {
                        reject(reason)
                    }
                })
            }
        })
    }
    static race(promises) {
        return new myPromise((resolve, reject) => {
            promises.forEach(item => {
                item.then(value => {
                    resolve(value)
                }, reason => {
                    reject(reason)
                })
            })
        })
    }
}

function resolvePromise(promise2, x, resolve, reject) {
    if (promise2 === x) {
        throw new TypeError('same ')
    } else {
        let called
        if ((typeof x == 'object' && x != null) || typeof x == 'function') {
            try {
                let then = x.then
                if (typeof then == 'function') {
                    then.call(x, (y) => {
                        if (called) return
                        called = true
                        resolvePromise(promise2, y, resolve, reject)
                    }, (r) => {
                        if (called) return
                        called = true
                        reject(r)
                    })
                } else {
                    if (called) return
                    called = true
                    resolve(x)
                }
            } catch (error) {
                if (called) return
                called = true
                reject(error)
            }
        } else {
            if (called) return
            called = true
            resolve(X)
        }
    }

}

myPromise.deferred = function () {
    let dfd = {}
    dfd.promise = new myPromise((resolve, reject) => {
        dfd.resolve = resolve
        dfd.reject = reject
    })
    return dfd
}

module.exports = myPromise