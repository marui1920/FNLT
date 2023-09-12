function main() {
    TraceInfo("------main 函数执行操作---------");
    var http = require("http"); //引入http模块
    //请求WMS成品仓库数据
    var paramsData = JSON.stringify(
        {
            "data": {
                "header": {
                    "warehouseId": "CS02",
                    "customerId": "FNLT",
                    "sku": "",
                    "invDate": "",
                    "pageSize": "",
                    "pageNo": ""
                }
            }
        }
    );
    TraceInfo("paramsData:", paramsData);
    var adr = '/datahubjson/FluxWmsJsonApi/?method=queryInventory&apptoken=24B42D970E5D3DFE2EEE47B5DC39F925&timestamp=2023-04-11 12:00:00&sign=FNLT&format=JSON';
    adr = encodeURI(adr);
    var opt = {
        hostname: '36.155.6.207',
        port: '38080',
        path: adr,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    var body = "";
    var req = http.request(opt, function (res) {
        res.on('data', function (data) {
            body += data;
        }).on('end', async function () {
            TraceInfo('body:', JSON.parse(body).Response); 
            //下发数据成功
            if (JSON.parse(body).Response.return.returnCode === "0000" || JSON.parse(body).Response.return.returnCode === "ED0342") {  //此处ED0342为测试，正式版请删除
                TraceInfo('WMS返回正确,准备执行SetData:', JSON.parse(body).Response.items.item);
                SetData(body);          
            } else {
                TraceInfo('body:', JSON.parse(body).Response.items.item.length);
                TraceInfo("WMS返回异常: ", JSON.parse(body).Response.return);
            }
        });
    }).on('error', function (e) {
        TraceInfo("error: ", JSON.stringify(e.message));
    })
    req.write(paramsData);
    req.end();
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
//自定义函数，返回时间对象
function intervalTime(diff, inDate) {
    let interval = diff || 0;
    let newDate = new Date();
    if (inDate) {
        newDate = new Date(inDate);
    }
    newDate.setDate(newDate.getDate() + interval);
    let timestamp = newDate.getTime(); //时间戳
    let year = newDate.getFullYear();
    let month = newDate.getMonth() < 9 ? `0${1 + newDate.getMonth()}` : 1 + newDate.getMonth();
    let day = newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate();
    let hour = newDate.getHours() < 10 ? `0${newDate.getHours()}` : newDate.getHours();
    let minute = newDate.getMinutes() < 10 ? `0${newDate.getMinutes()}` : newDate.getMinutes();
    let second = newDate.getSeconds() < 10 ? `0${newDate.getSeconds()}` : newDate.getSeconds();
    let millisecond = newDate.getMilliseconds(); //毫秒
    let dateTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    let time = `${hour}:${minute}:${second}`;
    let date = `${year}-${month}-${day}`;
    let timeExport = `${year}${month}${day}${hour}${minute}${second}${millisecond}`;
    let outTime = {
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        second: second,
        dateTime: dateTime,
        time: time,
        date: date,
        timestamp: timestamp,
        timeExport: timeExport,
    };
    return outTime;
}
async function SetData(body) {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const millisecond = date.getMilliseconds();
    //先清空WMS成品库存数据  PlanDeleteThingRecord(var objectID,DateTime startTime,DateTime endTime,Int16 timeRelation);
    var objectID = "3603812087760047850";
    var startTime = {
        "year": year - 1,
        "month": month,     /// 1-12
        "day": day,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
        "hour": hour,         /// 0-23
        "minute": minute,       /// 0-59
        "second": second,       /// 0-59
        "millisecond": millisecond
    };
    var endTime = {
        "year": year + 1,
        "month": month,     /// 1-12
        "day": day,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
        "hour": hour,         /// 0-23
        "minute": minute,       /// 0-59
        "second": second,       /// 0-59
        "millisecond": millisecond
    };
    var timeRelation = 1;//数据结束时间在查询时间范围内
    //删除数据前查询对象下记录是否为空
    var filter = "";//例如2>10，表示第2个成员大于100
    var fieldIDs = [1, 258, 259];
    var res = await PlanQueryThingRecord(objectID, startTime, endTime, timeRelation, filter, fieldIDs);
    if (!res.ret) {
        TraceInfo("查询WMS成品仓库对象记录成功");
        if (res.dataSets.length > 0) {
            TraceInfo("有记录");
            var Deleteret = await PlanDeleteThingRecord(objectID, startTime, endTime, timeRelation);
            if (Deleteret.ret == 0) {
                //业务处理
                TraceInfo("清空数据成功", Deleteret);
                TraceInfo("开始添加数据 ,item个数", JSON.parse(body).Response.items.item.length);
                var items = JSON.parse(body).Response.items;
                var arr = [];
                var obj = {};
                for (let k = 0; k < items.item.length; k++) {
                    TraceInfo("K-------------------- ", k);
                    var warehouseId = items.item[k].warehouseId;//仓库ID,CS01：法恩莱特长沙仓库
                    TraceInfo("成员 1", warehouseId);
                    var customerId = items.item[k].customerId;//货主ID
                    TraceInfo("成员 2");
                    var WLDM = items.item[k].sku;//产品编号
                    TraceInfo("成员 3");
                    var qty = parseInt(items.item[k].qty); //可用库存数量
                    TraceInfo("成员 4");
                    var FDATE = items.item[k].lotAtt03;//WMS入库时间
                    TraceInfo("成员 5");
                    var PCSX = items.item[k].lotAtt04; //产品批号 
                    TraceInfo("成员 6");
                    var lotAtt05 = items.item[k].lotAtt05;//ERP组织
                    TraceInfo("成员 7");
                    var FSTOCKNAME = items.item[k].lotAtt06;//ERP 仓库      
                    TraceInfo("成员 8");
                    var lotAtt07 = items.item[k].lotAtt07;//ERP货主
                    TraceInfo("成员 9");
                    var lotAtt08 = items.item[k].lotAtt08;//质量状态(0-良品;1-待检品;2-不良品)
                    TraceInfo("成员 10");
                    var userDefine1 = items.item[k].userDefine1; //平库/立库
                    TraceInfo("成员 11");
                    var userDefine2 = items.item[k].userDefine2; //物料名称
                    TraceInfo("成员 12");
                    var userDefine3 = items.item[k].userDefine3; //区域库区
                    TraceInfo("成员 13");
                    //var arr = [];
                    obj = {};
                    obj.keyValueList = [
                        { "key": 1, "value": { stringValue: warehouseId }, },
                        { "key": 2, "value": { stringValue: customerId }, },
                        { "key": 3, "value": { stringValue: WLDM }, },
                        { "key": 4, "value": { int64Value: qty }, },
                        { "key": 5, "value": { stringValue: FDATE }, },
                        { "key": 6, "value": { stringValue: PCSX }, },
                        { "key": 7, "value": { stringValue: lotAtt05 }, },
                        { "key": 8, "value": { stringValue: FSTOCKNAME }, },
                        { "key": 9, "value": { stringValue: lotAtt07 }, },
                        { "key": 10, "value": { stringValue: lotAtt08 }, },
                        { "key": 11, "value": { stringValue: userDefine1 }, },
                        { "key": 12, "value": { stringValue: userDefine2 }, },
                        { "key": 13, "value": { stringValue: userDefine3 }, },
                        {
                            "key": 258,
                            "value": {
                                dateTimeValue: {
                                    "year": year,
                                    "month": month,     /// 1-12
                                    "day": day,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                                    "hour": hour,         /// 0-23
                                    "minute": minute,       /// 0-59
                                    "second": second,       /// 0-59
                                    "millisecond": millisecond
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
                                    "hour": hour,         /// 0-23
                                    "minute": minute,       /// 0-59
                                    "second": second,       /// 0-59
                                    "millisecond": millisecond
                                }
                            }, //结束时间

                        },
                    ];
                    arr.push(obj);
                }
                TraceInfo("开始添加记录 ");
                var recordValues = [];
                recordValues= arr;
                TraceInfo("recordValues", recordValues);
                TraceInfo("输入信息-------", objectID, "、", recordValues);
                var addret = await PlanAddThingRecord(objectID, recordValues);
                if (addret.ret == 0) {
                    //业务处理
                    TraceInfo("添加wms成品库存数据成功:", addret);
                } else {
                    TraceInfo("添加wms成品库存数据失败:", addret);
                }        
            } else {
                TraceInfo("删除数据失败 Deleteret", Deleteret);
            }
        } else {
            TraceInfo("无记录");
            TraceInfo("开始添加数据 ,item个数", JSON.parse(body).Response.items.item.length);
            var items = JSON.parse(body).Response.items;
            var arr = [];
            var obj = {};
            for (let k = 0; k < items.item.length; k++) {
                TraceInfo("K-------------------- ", k);
                var warehouseId = items.item[k].warehouseId;//仓库ID,CS01：法恩莱特长沙仓库
                TraceInfo("成员 1", warehouseId);
                var customerId = items.item[k].customerId;//货主ID
                TraceInfo("成员 2");
                var WLDM = items.item[k].sku;//产品编号
                TraceInfo("成员 3");
                var qty = parseInt(items.item[k].qty); //可用库存数量
                TraceInfo("成员 4");
                var FDATE = items.item[k].lotAtt03;//WMS入库时间
                TraceInfo("成员 5");
                var PCSX = items.item[k].lotAtt04; //产品批号 
                TraceInfo("成员 6");
                var lotAtt05 = items.item[k].lotAtt05;//ERP组织
                TraceInfo("成员 7");
                var FSTOCKNAME = items.item[k].lotAtt06;//ERP 仓库      
                TraceInfo("成员 8");
                var lotAtt07 = items.item[k].lotAtt07;//ERP货主
                TraceInfo("成员 9");
                var lotAtt08 = items.item[k].lotAtt08;//质量状态(0-良品;1-待检品;2-不良品)
                TraceInfo("成员 10");
                var userDefine1 = items.item[k].userDefine1; //平库/立库
                TraceInfo("成员 11");
                var userDefine2 = items.item[k].userDefine2; //物料名称
                TraceInfo("成员 12");
                var userDefine3 = items.item[k].userDefine3; //区域库区
                TraceInfo("成员 13");
                //var arr = [];
                obj = {};
                obj.keyValueList = [
                    { "key": 1, "value": { stringValue: warehouseId }, },
                    { "key": 2, "value": { stringValue: customerId }, },
                    { "key": 3, "value": { stringValue: WLDM }, },
                    { "key": 4, "value": { int64Value: qty }, },
                    { "key": 5, "value": { stringValue: FDATE }, },
                    { "key": 6, "value": { stringValue: PCSX }, },
                    { "key": 7, "value": { stringValue: lotAtt05 }, },
                    { "key": 8, "value": { stringValue: FSTOCKNAME }, },
                    { "key": 9, "value": { stringValue: lotAtt07 }, },
                    { "key": 10, "value": { stringValue: lotAtt08 }, },
                    { "key": 11, "value": { stringValue: userDefine1 }, },
                    { "key": 12, "value": { stringValue: userDefine2 }, },
                    { "key": 13, "value": { stringValue: userDefine3 }, },
                    {
                        "key": 258,
                        "value": {
                            dateTimeValue: {
                                "year": year,
                                "month": month,     /// 1-12
                                "day": day,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                                "hour": hour,         /// 0-23
                                "minute": minute,       /// 0-59
                                "second": second,       /// 0-59
                                "millisecond": millisecond
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
                                "hour": hour,         /// 0-23
                                "minute": minute,       /// 0-59
                                "second": second,       /// 0-59
                                "millisecond": millisecond
                            }
                        }, //结束时间

                    },
                ];
                arr.push(obj);
            }
            TraceInfo("开始添加记录 ");
            var recordValues = [];
            recordValues= arr;
            TraceInfo("recordValues", recordValues);
            TraceInfo("输入信息-------", objectID, "、", recordValues);
            var addret = await PlanAddThingRecord(objectID, recordValues);
            if (addret.ret == 0) {
                //业务处理
                TraceInfo("添加wms成品库存数据成功:", addret);
            } else {
                TraceInfo("添加wms成品库存数据失败:", addret);
            } 
        }
    } else {
        TraceInfo("查询WMS成品仓库对象记录失败", res);
    }
}
// 导出函数
module.exports = {
    main: main,
    scheduleQuery: scheduleQuery,
};
