/*main.js */
/*
 * 定时执行某些脚本
 */
function main() {
    GetData();
    //TraceInfo("函数执行前");
}
function scheduleQuery(func, timeSpan, years = [], months = [], dates = [], hours = [], minutes = [], seconds = []) {
    /**
     * func:
     *      待执行的脚本函数; func()可支持无参和带参函数；无参函数只需要传递函数名即可;
     *      带参函数则把func的函数同步写在scheduleQuery函数的参数列表中，注意写在timespan前
     *      并且本函数的调用也要传入相关参数，内部代码也要传入参数。
     * timeSpan:
     *      时间间隔，每隔多久查一下时间；当其他时间参数都为空值时，这个参数就是待执行脚本的周期
     * years:
     *      指定运行的年份，默认为空数组，即每年都可以执行
     * months:
     *      指定运行的月份，默认为空数组，即每个月都可以执行，数组内的值范围为0至11
     * dates:
     *      指定运行的天，默认为空数组，即每天都可以执行，数组内的取值范围为0至30
     * hours:
     *      指定运行的小时，默认为空数组，即每小时都可以执行，数组内的取值范围为0至23
     * minutes:
     *      指定运行的分钟，默认为空数组，即每分钟都可以执行，数组内的取值范围为0至59
     * seconds:
     *      指定运行的秒数，默认为空数组，即每秒都可以执行，取值范围为0至59; 
     *      参数seconds不建议指定;
     *      主要原因是：
     *          scheduleQuery 执行的秒数不一定会恰好在你指定的范围内，从而无法递归调用；
     *          func 函数的执行时间不一定会在秒级完成。
     * 
     * 调用方式：
     *      1. scheduleQuery(func, 1000*60);  // 每隔 timespan（1分钟） 执行一次 func
     *      2. scheduleQuery(func, timeSpan, [], [], [], exeu_hours, [0,30], []); // 指定小时和分钟执行
     *      3. scheduleQuery(func, func_para1, func_para2, 1000*60);  // 每隔 timespan（1分钟） 执行一次带参函数func(func_para1, func_para2)
     *      4. scheduleQuery(func, func_para1, func_para2, timeSpan, [], [], [], exeu_hours, [0,30], []); // 指定小时和分钟执行
     * 
     */
    // todo 参数的合法性校验
    // 设置定时器触发待执行的脚本
    const intervalQuery = setInterval(
        () => {
            var now = new Date(); // 获取当前时间
            // 声明六个时间标志
            var yearFlag = false, monthFlag = false, dateFlag = false;
            var hourFlag = false, minuteFlag = false, secondFlag = false;
            if (years.length == 0 || years.includes(now.getFullYear())) {
                // 默认每年都执行 or 当前年份在指定年份数组内
                yearFlag = true;
            }
            if (months.length == 0 || months.includes(now.getMonth())) {
                monthFlag = true;
            }
            if (dates.length == 0 || dates.includes(now.getDate())) {
                dateFlag = true;
            }
            if (hours.length == 0 || hours.includes(now.getHours())) {
                hourFlag = true;
            }
            if (minutes.length == 0 || minutes.includes(now.getMinutes())) {
                minuteFlag = true;
            }
            if (seconds.length == 0 || seconds.includes(now.getSeconds())) {
                secondFlag = true;
            }
            // 所有时间参数都符合要求
            if (yearFlag && monthFlag && dateFlag && hourFlag && minuteFlag && secondFlag) {
                func(); // 待执行脚本
                clearInterval(intervalQuery); // 清除当前的这个定时器
                scheduleQuery(func, timeSpan, years, months, dates, hours, minutes, seconds); // 递归调用设置下一次执行时间
            }
        },
        timeSpan); // 每隔 timespan 查询一次时间，判断是否符合时间要求
}
//业务处理
async function GetData() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const millisecond = date.getMilliseconds();
    //查询生产状态为0的工单
    var objectID = "87960930222082";
    //2：工单号，19：生产状态
    var fieldIDs = [2, 19, 257];
    var startTime = {
        "year": year,
        "month": 1, /// 1-12
        "day": 1, /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
        "hour": 0, /// 0-23
        "minute": 0, /// 0-59
        "second": 0, /// 0-59
        "millisecond": 0
    };
    var endTime = {
        "year": year + 1,
        "month": month, /// 1-12
        "day": day, /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
        "hour": hour, /// 0-23
        "minute": minute, /// 0-59
        "second": second, /// 0-59
        "millisecond": millisecond
    };
    var filter = `(f19=="0")`;
    var timeRelation = 1; //数据结束时间在查询时间范围内        
    TraceInfo("函数执行前");
    //工单管理生产计划库查询
    var res = await PlanQueryThingRecord(objectID, startTime, endTime, timeRelation, filter, fieldIDs);
    if (!res.ret) {
        //业务处理
        var dataSets = res.dataSets;
        var lens = dataSets.length;
        TraceInfo("dataSets:", dataSets);
        if (lens !== 0) {
            // data_arr = [];           
            for (let i = 0; i < lens; i++) {
                //工单号
                var jobNumber = dataSets[i].values[0].stringValue;
                //var dataId = dataSets[i].values[2].uint64Value;
                //data_arr.push(dataId);
                //查询生产投料记录对象记录
                var objectID1 = "87960930284085";
                var startTime1 = {
                    "year": year,
                    "month": 1, /// 1-12
                    "day": 1, /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                    "hour": 0, /// 0-23
                    "minute": 0, /// 0-59
                    "second": 0, /// 0-59
                    "millisecond": 0
                };
                var endTime1 = {
                    "year": year + 1,
                    "month": month, /// 1-12
                    "day": day, /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                    "hour": hour, /// 0-23
                    "minute": minute, /// 0-59
                    "second": second, /// 0-59
                    "millisecond": millisecond
                };
                var filter1 = `(f1=="${jobNumber}")`; //例如2>10，表示第2个成员大于100
                var timeRelation1 = 1; //数据结束时间在查询时间范围内
                //1：工单号，4：子项物料代码
                var fieldIDs1 = [1, 4, 257];
                var res1 = await PlanQueryThingRecord(objectID1, startTime1, endTime1, timeRelation1, filter1, fieldIDs1)
                if (!res1.ret) {
                    //业务处理
                    var dataSets1 = res1.dataSets;
                    var lens1 = dataSets1.length;
                    TraceInfo("dataSets1", dataSets1);
                    if (lens1 !== 0) {
                        for (let i1 = 0; i1 < lens1; i1++) {
                            //工单号
                            var jobNumber1 = dataSets1[i1].values[0].stringValue;
                            //物料代码
                            var materialCode = dataSets1[i1].values[1].stringValue;
                            //记录ID
                            var dataId = dataSets1[i1].values[2].uint64Value;
                            //查询制程投料记录app对象记录
                            var objectID2 = "54975581753818";
                            var startTime2 = {
                                "year": year,
                                "month": 1, /// 1-12
                                "day": 1, /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                                "hour": 0, /// 0-23
                                "minute": 0, /// 0-59
                                "second": 0, /// 0-59
                                "millisecond": 0
                            };
                            var endTime2 = {
                                "year": year + 1,
                                "month": month, /// 1-12
                                "day": day, /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                                "hour": hour, /// 0-23
                                "minute": minute, /// 0-59
                                "second": second, /// 0-59
                                "millisecond": millisecond
                            };
                            var filter2 = `(f1=="${jobNumber1}")&&(f3=="${materialCode}")`; //例如2>10，表示第2个成员大于100
                            var timeRelation2 = 1; //数据结束时间在查询时间范围内
                            //1：工单号，2：批次号，3：物料代码，5：投料重量
                            var fieldIDs2 = [1, 2, 3, 5];
                            var res2 = await HistoryQueryThingRecord(objectID2, startTime2, endTime2, timeRelation2, filter2, fieldIDs2)
                            if (!res2.ret) {
                                //业务处理
                                var dataSets2 = res2.dataSets;
                                var lens2 = dataSets2.length;
                                TraceInfo("dataSets2", dataSets2);
                                if (lens2 !== 0) {
                                    var WLPC = '';
                                    var TLZL = 0.0;
                                    var WLPC_arr = [];
                                    for (let i2 = 0; i2 < lens2; i2++) {
                                        if (dataSets2[i2].values[1].stringValue !== "") {
                                            WLPC_arr.push(dataSets2[i2].values[1].stringValue);
                                        }
                                        if (dataSets2[i2].values[3].stringValue !== "") {
                                            TLZL += parseFloat(dataSets2[i2].values[3].stringValue);
                                        } else {
                                            TLZL += 0.0;
                                        }
                                    }
                                    //WLPC_arr数组去重
                                    var newArr = [];
                                    let map = new Map();
                                    WLPC_arr.forEach(item => {
                                        if (!map.has(item)) {
                                            map.set(item, true);
                                            newArr.push(item)
                                        };
                                    });
                                    WLPC = newArr.join();
                                    //更新生产投料记录对象对应记录
                                    var objectID3 = "87960930284085";
                                    var recordIDs3 = [];
                                    recordIDs3.push(dataId);
                                    var recordValues3 = [{
                                        "keyValueList": [ //记录1
                                            {
                                                "key": 5,
                                                "value": {
                                                    stringValue: WLPC
                                                }, //5:批次号
                                            }, {
                                                "key": 7,
                                                "value": {
                                                    stringValue: TLZL.toFixed(2)
                                                }, //7:实际投料重量
                                            }
                                        ]
                                    }];
                                    var res3 = await PlanUpdateThingRecord(objectID3, recordIDs3, recordValues3)
                                    if (!res3.ret) {
                                        //业务处理
                                        TraceInfo("更新res3", res3);
                                    }

                                }
                            }

                        }
                    }
                }

            }
        }
    }

}
// 导出函数
module.exports = {
    main: main,
    scheduleQuery: scheduleQuery,
};