/*main.js */
/*
 * 定时执行某些脚本
 */
function main() {
    TraceInfo("------main 函数执行操作---------");
    var http = require("http"); //引入http模块
    GetData().then(res => {
        if (res.length !== 0) {
            TraceInfo("",res);
            var targetdata = res;
            var paramsData = JSON.stringify({             
                "orderNo":targetdata.orderNo,
                "batchNo":'',
                "material_num":targetdata.material_num,
                "count":targetdata.count,
                "line":targetdata.line,
                "cmptybarrelDown": targetdata.cmptybarrelDown,
                "emptybarrelUp": targetdata.emptybarrelUp,
                "weght": targetdata.weght,
                "allowDown": targetdata.allowDown,
                "allowUp": targetdata.allowUp
                });
            var opt = {
                hostname: '116.128.234.50',
                port: '10000',
                path: '/api/GetMesOrdersList',
                method: 'POST',
                //rejectUnauthorized: false,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            TraceInfo("",paramsData); 
            TraceInfo("",opt);
            var body = '';
            var req = http.request(opt, function (res1) {
                TraceInfo("response: ", JSON.stringify(res1.statusCode));
                res1.on('data', function (data) {
                    body += data;
                }).on('end', async function () {
                    TraceInfo('body:', JSON.stringify(body));
                    TraceInfo('body:', body);
                    TraceInfo('body.code:', JSON.parse(body).code);
                    //下发数据成功
                    if (JSON.parse(body).code === 0) {
                    //if (true) {
                        var target_arr = [];
                        target_arr.push(targetdata.recordID);
                        // for (let i = 0; i < targetdata.length; i++) {
                        //     var aa = (targetdata[i].request_no).substring(2)
                        //     target_arr.push(aa);
                        // } 
                        TraceInfo('body:', target_arr)
                        //更新数据
                        SetData(target_arr).then();

                    }
                });
            }).on('error', function (e) {
                TraceInfo("error: ", JSON.stringify(e.message));
            })
            req.write(paramsData);
            req.end();
        }                
    })
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
//查询符合条件数据，返回
async function GetData() {
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();
    const millisecond = date.getMilliseconds();
    var objectID = "87960930222082";
    //2：工单号，20：灌装线，11：桶数量，17：罐装下发状态，19：生产状态，16：产品型号
    var fieldIDs = [2, 20, 11, 17, 19, 16, 257];
    var startTime = {
        "year":year,
        "month":1,     /// 1-12
        "day":1,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
        "hour":0,         /// 0-23
        "minute":0,       /// 0-59
        "second":0,       /// 0-59
        "millisecond":0
        };
    var endTime = {
        "year":year + 1,
        "month":month,     /// 1-12
        "day":day,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
        "hour":hour,        /// 0-23
        "minute":minute,         /// 0-59
        "second":second,       /// 0-59
        "millisecond":millisecond
        };
    //var filter = `(f17=="未下发")&&(f19=="1"||f19=="2")`; //例如2>10，表示第2个成员大于100
    //var filter = `(f17=="未下发")&&(f19=="1")||(f19=="2")`;
    var filter = `(f9=="未下发")&&(f19=="1")`;////灌装线下发状态成员用开始日期，索引为9
    var timeRelation = 1; //数据结束时间在查询时间范围内        
    TraceInfo("函数执行前");
    //计划库查询
    var returndata = await PlanQueryThingRecord(objectID,startTime,endTime,timeRelation,filter,fieldIDs,function (res) {
        if (!res.ret) {
            //业务处理
            TraceInfo("函数执行中");
            console.log(res);
            var dataSets = res.dataSets;
            var lens = dataSets.length;
            TraceInfo("",dataSets);
            if (lens !== 0) {
                //for循环重组数组,一次下发一条；
                var data_obj = {};           
                for (var i = 0; i < 1; i++) {
                    data_obj = {};
                    data_obj.recordID = dataSets[0].values[6].uint64Value;
                    data_obj.orderNo = dataSets[0].values[0].stringValue;
                    data_obj.batchNo = "";
                    data_obj.material_num = dataSets[0].values[5].stringValue;;
                    data_obj.count = dataSets[0].values[2].stringValue;
                    data_obj.line = dataSets[0].values[1].stringValue;
                    data_obj.cmptybarrelDown = "220";
                    data_obj.emptybarrelUp = "580";
                    data_obj.weght = "1000";
                    data_obj.allowDown = true;
                    data_obj.allowUp = false;
                }
                return data_obj; 
            }
        }
    }) 
    return returndata;         
}
async function SetData(recordIDs) {
    var objectID = "87960930222082";;
    var arr = [];
    var obj = {};
    for (let i = 0; i < recordIDs.length; i++) {
        obj = {};
        ////灌装线下发状态成员用开始日期，索引为9
        obj.keyValueList = [{"key":9,"value":{stringValue:"已下发"},}];
        //arr.push(JSON.stringify(obj));
        arr.push(obj);
    }
    var recordValues = arr;
    TraceInfo("recordValues",recordValues);
    await PlanUpdateThingRecord(objectID,recordIDs,recordValues).then(function (res) {
        if ( !res.ret ) {
            //业务处理
            TraceInfo("res",res);
        }
    });
}
// 导出函数
module.exports = {
    main: main,
    scheduleQuery: scheduleQuery,
};