// Promise.all = function (arr) {
//   let count = 0
//   let result = []
//   const length = arr.length //3
//   return new Promise((resolve, reject) => {
//     for (let i = 0; i < length; i++) {
//       arr[i].then((res) => {
//         count++
//         result[i] = res
//         if (count == length) {
//           resolve(result)
//         }
//       }).catch((err) => {
//         reject(err)
//       })
//     }
//   })
// }

// let a = new Promise(resolve => {
//   resolve(1)
// })

// let b = new Promise(resolve => {
//   resolve(2)
// })

// let c = new Promise(resolve => {
//   resolve(3)
// })

// let d = new Promise(resolve => {
//   setTimeout(() => {
//     resolve(4)
//   }, 1000);
// })

// Promise.all([a, b, c, d, 1]).then(res => {
//   console.log(res)
// })

const a = [
  {
    name: '123',
    url: '123',
    production: '123'
  }
]
console.log(JSON.stringify(a))