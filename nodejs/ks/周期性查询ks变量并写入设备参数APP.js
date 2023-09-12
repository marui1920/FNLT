function main() {
    TraceInfo("------main 函数执行操作---------");
    asyncFun();
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
/*
 * @function 获取数据
 * @description 获取历史库“设备参数位号”对象下备注为1的记录
 * @param void
 * @return {Array} 设备位号
 * @autor marui 2023/08/11
 * @version v1.0
 */
function getData() {
    return new Promise((res, rej) => {
        var objectID = "3603497627432498913";
        var startTime = {
            "year": 2000,
            "month": 1,     /// 1-12
            "day": 1,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
            "hour": 0,         /// 0-23
            "minute": 0,       /// 0-59
            "second": 0,       /// 0-59
            "millisecond": 0
        };
        var endTime = {
            "year": 2100,
            "month": 1,     /// 1-12
            "day": 1,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
            "hour": 0,         /// 0-23
            "minute": 0,       /// 0-59
            "second": 0,       /// 0-59
            "millisecond": 0
        };
        var filter = `f4=="1"`;//例如2>10，表示第2个成员大于100
        var timeRelation = 1;//数据结束时间在查询时间范围内
        var fieldIDs = [1, 2, 3, 4];
        TraceInfo("filter:", filter);
        HistoryQueryThingRecord(objectID, startTime, endTime, timeRelation, filter, fieldIDs, function (res1) {
            if (!res1.ret) {
                //业务处理
                //var data = res1.dataSets;
                TraceInfo("res1.ret:", res1.ret);
                TraceInfo("res1.dataSets:", res1.dataSets);
                if (res1.dataSets.length !== 0) {
                    var data_arr = [];
                    //var data = res1.dataSets
                    res1.dataSets.forEach((element) => {
                        data_arr.push(element.values[2].stringValue);
                    });
                    TraceInfo("data_arr:", data_arr);
                    res(data_arr);
                } else {
                    TraceInfo("设备参数位号对象下无符合条件数据");
                }

            } else {
                TraceInfo("res1.ret:", res1.ret);
            }
        }); 
    })       
}
/*
 * @function 写入数据
 * @description 获取ks变量数据后写入历史库“设备实时参数”对象
 * @param inparam {Array} ks数据
 * @return void
 * @autor marui 2023/08/11
 * @version v1.0
 */
function setData(inparam) {
    if (inparam.length !== 0) {
        return new Promise((res, rej) => {
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hour = date.getHours();
            const minute = date.getMinutes();
            const second = date.getSeconds();
            const millisecond = date.getMilliseconds();
            var data_obj = {};
            var data_arr = [];
            for (let i = 0; i < inparam.length; i++) {
                data_obj = {};
                data_obj = {
                    "keyValueList": [//记录1
                        {
                            "key": 1,
                            "value": { 
                                stringValue: inparam[i].N
                            },//1为位号
                        },
                        {
                            "key": 2,
                            "value": { 
                                stringValue: inparam[i].V
                            },//2为数值
                        },
                        {
                            "key": 3,
                            "value": {                             
                                dateTimeValue: {
                                    "year": Number((inparam[i].T).slice(0, 4)),
                                    "month": Number((inparam[i].T).slice(5, 7)),     /// 1-12
                                    "day": Number((inparam[i].T).slice(8, 10)),       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                                    "hour": Number((inparam[i].T).slice(11, 13)),         /// 0-23
                                    "minute": Number((inparam[i].T).slice(14, 16)),       /// 0-59
                                    "second": Number((inparam[i].T).slice(17, 19)),       /// 0-59
                                    "millisecond": Number((inparam[i].T).slice(20))
                                } 
                            },//3为时间
                        },                    
                        {
                            "key": 258,
                            "value": {
                                dateTimeValue: {
                                    "year": year,
                                    "month": month,     /// 1-12
                                    "day": day,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                                    "hour": 0,         /// 0-23
                                    "minute": 0,       /// 0-59
                                    "second": 0,       /// 0-59
                                    "millisecond": 0
                                }
                            },//开始时间
                        },
                        {
                            "key": 259,
                            "value": {
                                dateTimeValue: {
                                    "year": year + 1,
                                    "month": month,     /// 1-12
                                    "day": day,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                                    "hour": 0,         /// 0-23
                                    "minute": 0,       /// 0-59
                                    "second": 0,       /// 0-59
                                    "millisecond": 0
                                }
                            }, //结束时间

                        }
                    ]
                }
                data_arr.push(data_obj);            
            }
            var objectID = "3603497627432498915";
            var recordValues = data_arr;
            HistoryAddThingRecord(objectID, recordValues, function (res1) {
                if (!res1.ret) {
                    //业务处理
                    TraceInfo("写入数据返回res.data:", res1.data);
                }
            });  
        })          
    }
}
/*
 * @function 获取kstoken
 * @description 调用接口，获取kstoken
 * @param void
 * @return {Object} 返回Promise对象
 * @autor marui 2023/08/11
 * @version v1.0
 */
function getKStoken() {
    return new Promise((res, rej) => {
        const http = require('http');
        http.get('http://116.128.234.50:9433/api/v1/GetToken?UserName=KS1&PassWord=B301F491798159CF0971D06621B3CF96', (response) => {
            let todo = '';
            // called when a data chunk is received.
            response.on('data', (chunk) => {
                todo += chunk;
            });
            // called when the complete response is received.
            response.on('end', () => {
                TraceInfo("todo:",todo);
                var aa = todo.replace(/\n/g, "");
                var token = JSON.parse(aa).Token;
                TraceInfo("token:",token);
                console.log(token);
                res(token);
            });
        }).on("error", (error) => {
            TraceInfo("Error: " + error.message);
        });
    })
}
/*
 * @function 获取变量值
 * @description 调用接口，获取ks获取变量值
 * @param inparam{Array} 设备位号数组
 * @param kstoken{String} kstoken
 * @return {Object} 返回Promise对象
 * @autor marui 2023/08/11
 * @version v1.0
 */
function getKSvalue(inparam, kstoken) {
    return new Promise((res, rej) => {
        const http = require('http');
        var paramsData = JSON.stringify({
            "objs": inparam
        })
        var opt = {
            hostname: '116.128.234.50',
            port: '9433',
            path: '/api/v1/ReadRealdata',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'token': kstoken
            }
        }
        TraceInfo("", paramsData);
        TraceInfo("", opt);
        var body = '';
        var req = http.request(opt, function (res11) {
            TraceInfo("response: ", JSON.stringify(res11.statusCode));
            res11.on('data', function (data) {
                body += data;
            }).on('end', async function () {
                TraceInfo('body:', body);
                var bb = body.replace(/\n/g, "");
                var bb1 = bb.substring(0, 37);
                var bb2 = bb.substring(38, bb.length-2);
                var bb3 = JSON.parse(bb1 + bb2 + '}').data;
                TraceInfo('bb3:', bb3);
                res(bb3);
            });
        }).on('error', function (e) {
            TraceInfo("error: ", JSON.stringify(e.message));
        })
        req.write(paramsData);
        req.end();
    })
}
/*
 * @function 释放kstoken
 * @description 调用接口，释放kstoken
 * @param kstoken{String} kstoken
 * @return {Object} 返回Promise对象
 * @autor marui 2023/08/11
 * @version v1.0
 */ 
function deleteKStoken(kstoken) {
    return new Promise((res, rej) => {
        const http = require('http');
        var opt = {
            hostname: '116.128.234.50',
            port: '9433',
            path: '/api/v1/DelToken',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Token': kstoken
            }
        }
        TraceInfo("", opt);
        var body = '';
        var req = http.request(opt, function (res12) {
            TraceInfo("response: ", JSON.stringify(res12.statusCode));
            res12.on('data', function (data) {
                body += data;
            }).on('end', async function () {
                TraceInfo('body:', body);
                res(JSON.parse(body).message);
            });
        }).on('error', function (e) {
            TraceInfo("error: ", JSON.stringify(e.message));
        })
        req.write("");
        req.end();
    })
} 
//封装方法，同步调用4个方法           
async function asyncFun() {
    var data_arr = await getData();
    if (data_arr.length !== 0) {
        TraceInfo("data_arr: ", data_arr);
        var token = await getKStoken();
        TraceInfo("token: ", token);
        var ksdata = await getKSvalue(data_arr, token);
        TraceInfo("ksdata:", ksdata);
        var message = await deleteKStoken(token);
        TraceInfo("message:", message);
        await setData(ksdata);        
    } else {
        TraceInfo("设备参数位号对象下无符合条件数据");
    }

}
// 导出函数
module.exports = {
    main: main,
    scheduleQuery: scheduleQuery,
};