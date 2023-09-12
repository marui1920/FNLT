// /**
//  * 分组排序算法
//  */
// function groupAndSort(groupFields, sortFields, list) {
//     if (Array.isArray(list) && list.length <= 0) {
//         return []
//     }
//     let tempList = []
//     list = sortByFields(groupFields, list)
//     let tempGroupValue = list[0][groupFields]
//     for (let i = 0; i < list.length; i++) {
//         if (!list[i]) {
//             continue
//         }
//         if (list[i][groupFields] != tempGroupValue) {
//             tempGroupValue = list[i][groupFields]
//         }
//         addObjToList(groupFields, sortFields, tempGroupValue, list[i], tempList)
//         list.splice(i, 1);
//         i--;
//     }
//     return tempList
// };

// function addObjToList(groupFields, sortFields, tempGroupValue, obj, list) {
//     let tempLength = list.length
//     for (let i = 0; i < list.length; i++) {
//         if (list[i][groupFields] == tempGroupValue && obj[sortFields] <= list[i][sortFields]) {
//             list.splice(i, 0, obj);
//             return
//         }
//     }
//     if (tempLength == list.length) {
//         list.push(obj)
//     }
// };

// function sortByFields(sortFields, list) {
//     return list.sort((a, b) => {
//         if (a[sortFields] < b[sortFields]) {
//             return -1
//         }
//         if (a[sortFields] > b[sortFields]) {
//             return 1
//         }
//         return 0
//     })
// };

// let dataSource = [{
//         groupxxx: 2,
//         sortxxx: 1,
//     },
//     {
//         groupxxx: 1,
//         sortxxx: 2,
//     },
//     {
//         groupxxx: 1,
//         sortxxx: 1,
//     },
//     {
//         groupxxx: 2,
//         sortxxx: 2,
//     }
// ]
// var aa = handelData(dataSource, 'groupxxx', 'sortxxx', 'groupxxx', 'sortxxx');
// function handelData(r, orgK, orgV, changeK, changeV) {
//   const v = [...r];
//   console.log(v);
//   const aMap = new Map();
//   const arr = [];   
//   v.forEach((e) => {
//       const k = e[orgK];
//       aMap.set(k, (aMap.get(k) || 0) + Number(e[orgV]));
//   })    
//   aMap.forEach((val, key) => {
//       const item = {};
//       item[changeK] = key;
//       item[changeV] = val;
//       arr.push(item);
//   })    
//   return arr;
// }

/** 
 * 如下图所示，grade为成绩表,成绩表中分别列出了小明和小红的语文、数学和英文的成绩
 * 现在需要将小明和小红的成绩合并
 * 每条记录包含5个字段，分别是【姓名、年龄、性别、科目、成绩】
 * 将姓名、年龄和性别相同的数据合并
 */

// const grades = [
//   { name: '小明', age: 15, sex: 'male', grade: 80 },
//   { name: '小明', age: 15, sex: 'male', grade: 60 },
//   { name: '小明1', age: 15, sex: 'male', grade: 70 },
//   { name: '小红', age: 15, sex: 'female', grade: 60 },
//   { name: '小红', age: 15, sex: 'female', grade: 80 },
//   { name: '小红1', age: 15, sex: 'female', grade: 70 }
// ]
// var aa = handelData(grades);
// console.log(aa);
// function handelData(r) {
//   if (!Array.isArray(r)) {
//     return []
//   } else {
//     //const aMap = new Map();
//     const arr = [];   
//     r.forEach(item => {
//       const index = arr.findIndex(subItem => subItem.name === item.name && subItem.age === item.age && subItem.sex === item.sex)
//       if (index > -1) {
//         //新数组包含对应成员
//         arr[index].grade = item.grade + arr[index].grade;
//       } else {
//         //新数组无对应成员
//         arr.push(item);

//       }
//     })
//     return arr;
//   }
// }
// /** 
// * 构造新的空数组用来存储合并后的成绩
// * 遍历成绩表，在新数组中寻找同一个人的信息 (默认姓名、性别和年龄相同的数据为同一个人)
// * if index < 0则表示暂时没有相同的同学，往 newGrade 中添加一条数据
// * if index > -1 则表示该同学的数据已经出现，则直接在grades添加该课程成绩即可
// */

// function mergeGrade(grade) {
//   if (!Array.isArray(grade)) return []
//   const newGrade = [];

//   grade.forEach(item => {
//       const index = newGrade.findIndex(subItem => subItem.name === item.name && subItem.age === item.age && subItem.sex === item.sex)
//       if (index > -1) {
//           newGrade[index].grades[item.class] = item.grade
//       } else {
//           newGrade.push({
//               name: item.name,
//               age: item.age,
//               sex: item.sex,
//               grades: { [item.class]: item.grade }
//           })
//       }
//   })
//   return newGrade
// }

// var obj1 = {
//   name: "zs",
//   language: [1,2,[1,3],4]
// }
// var obj2 = {...obj1};
// //var obj2 = obj1;
// obj2.name = "ls";
// obj2.language = [1,2,[1,3],5];
// console.log(obj1);
// console.log(obj2);
// let user = {
//   name: "张三",
//   sex: "男",
//   address: {
//     city: "北京"
//   }
// };
// let clonedUser = { ...user };
// user.name = "李四";
// user.address.city = "四川";
// console.log(user);
// console.log(clonedUser);
// var arr1 = [1,2,{
//   name: "zs",
//   language: [1,2,[1,3],4]
// }]
// //var arr2 = arr1;
// var arr2 = [...arr1];
// arr2[0] = 3;
// arr2[2].name = 'ls'
// arr2[2].language[0] = 3;
// console.log(arr1);
// console.log(arr2);
/**
 * 
 * @param {*} i 
 * @returns 
 */
// var aa = function(i) {
//   try {
//     return new Promise((res, rej) => {
//       setTimeout(() => {
//         console.log(i);
//       }, 1000);
//     });
//   } catch(e) {
//     console.log(e.message);
//   }
// }
// aa(5).then(() => {
//   return aa(4);
// }).then(() => {
//   return aa(3);
// });

// var aa = async function (x) {
//   setTimeout((x) => {
//     console.log(x);
//     return x +1;
//   }, 2000)
// };
// aa(5).then((res) => {
//   console.log(res);
//   console.log("bb");
// })
// console.log("cc");
// function timeout(ms) {
//   return new Promise((resolve) => {
//     setTimeout(resolve, ms);
//   });
// }

// async function asyncPrint(value, ms) {
//   await timeout(ms);
//   console.log(value);
// }
// console.log("bb")
// asyncPrint('hello world', 50);
// console.log("aa")

// var a = new Promise((resolve) => {
//   setTimeout(resolve, 1000, 'b');
// });
var a = new Promise((resolve) => {
  console.log("开始")
  setTimeout(() => {
    console.log("B")
  }, 1000);
  resolve();
});
a.then(() => {
  console.log("A")
});
console.log("c");