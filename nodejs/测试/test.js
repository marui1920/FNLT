// 需要被排序的数组
const data = ["delta", "alpha", "charlie", "bravo"];
// 用于存放位置和排序值的对象数组
const mapped = data.map((v, i) => {
  return { i, value: someSlowOperation(v) };
});

// 按照多个值排序数组
mapped.sort((a, b) => {
  if (a.value > b.value) {
    return 1;
  }
  if (a.value < b.value) {
    return -1;
  }
  return 0;
});

const result = mapped.map((v) => data[v.i]);
console.log(result);