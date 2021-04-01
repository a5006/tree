// 生成数据
let data = [...new Array(20).keys()].map(() => {
  return () => {
   return new Promise((resolve, reject) => {
      setTimeout(() => {
        Math.floor(Math.random() * 10) % 2 === 0
          ? resolve(`成功：${new Date().getTime()}`)
          : reject('失败');
      }, Math.floor(Math.random() * 2000) + 1000);
    });
  };
});
// 分割方法
function handleArr(arr, max = 3) {
  let idx = 0;
  let newArr = [];
  while (idx < arr.length) {
    let sliceArr = arr.slice(idx, (idx += max));
    newArr.push(sliceArr);
  }
  return newArr;
}

function go(arr) {
  let i = 0;
  function sendReq(drr) {
    if(!drr) return
    Promise.allSettled(drr.map((fn) => fn())).then((res) => {
      console.log(res,'res')
      i++
     sendReq(arr[i]);
    });
  }
  sendReq(arr[i]);
}

go(handleArr(data));
