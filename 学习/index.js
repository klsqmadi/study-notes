const MyPromise = require('./promise4')
function executor(resolve,reject){
    // throw new Error('this is error')
    // resolve('this is success')
    // reject('this is fail')
        resolve('this is executor')
}

let promise = new MyPromise(executor)

promise.then((value)=>{
    console.log('Fulfilled1: ', value);
    return value
}).then((value)=>{
    console.log('value: ', value);
    return Promise.resolve('this is Promise resolve')

}).then((value)=>{
    console.log('value: ', value);
    return new Promise((resolve,reject)=>{
        resolve('this is new Promise resolve')
    })
}).then().then().then().then().then(value=>{
    console.log('value: ', value);
})
