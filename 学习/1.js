// const fs = require('fs')
// console.log(1)
// setTimeout(function(){
//     console.log(2)
//     setTimeout(() => {
//         console.log('888');
//         setTimeout(() => {
//             console.log(999);
//         }, 3);
//     }, 3);
//     Promise.resolve(100).then(function(){
//         console.log('promise')
//     })
// })
// fs.readFile('./1.txt','utf8' ,(error, data) => {
//     console.log(error,data)
// })
// setImmediate(() => {
//     console.log('immediate')
// })
// let promise = new Promise(function(resolve, reject){
//     console.log(7)
//     resolve(100)
// }).then(function(data){
//     console.log(data)
// })
// setTimeout(function(){
//     console.log(3)
// })
// console.log(5)
let MyPromise = require('./promise4')

// setTimeout(() => {
//     console.log(1)
// }, 1);
// let x = new MyPromise((resolve, reject) => {
//     console.log(2)
//     resolve(2)
// }).then((v) => {
//     console.log(3)
// })
let x = new MyPromise((resolve, reject) => {
    resolve(1)
}).then((v) => {
    console.log(v);
    return new MyPromise((resolve, reject) => {
        resolve(2)
    }).then((v) => {
        console.log(v);
        return 3
    })
}).then((v) => {
    console.log(v);
    return {
        then:4
    }
}).then((v) => {
    console.log(v);
    return {
        then(onFulfilled, onRejected) {
            onFulfilled(5)
        }
    }
}).then(v => {
    console.log(v)
    return new MyPromise((resolve, reject) => {
        resolve(6)
    })
}).then(v => {
    console.log(v)
})

// const promise1 = new Promise((resolve, reject) => {
//     setTimeout(resolve, 500, 'one');
//   });
  
//   const promise2 = new Promise((resolve, reject) => {
//     setTimeout(reject, 100, 'two');
//   })
  
//   Promise.all([promise1, promise2]).then((value) => {
//     console.log(value);
//     // Both resolve, but promise2 is faster
//   });

// let x = new MyPromise((resolve, reject) => {
//     console.log(1)
//     resolve(2)
//     //   resolve(2)
// }).then(value => {
//       console.log(value)
// }).finally(() => {
//     console.log(3)
// })
