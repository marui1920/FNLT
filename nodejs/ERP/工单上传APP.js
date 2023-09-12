function main() {
    TraceInfo("------main 函数执行操作---------");
    var http = require("http"); //引入http模块
    var request = require('request');
    TraceInfo('http:', http);
    TraceInfo('request:', request);
    GetData().then(res => {
        if (JSON.stringify(res) !== "{}") {
            TraceInfo("",res);
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            var hour = date.getHours();
            var minutes = date.getMinutes();
            var seconds = date.getSeconds();                
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            if (minutes >= 0 && minutes <= 9) {
                minutes = "0" + minutes;
            }
            var currentdate = year + "-" + month + "-" + strDate + " " + hour + ":" + minutes + ":" + seconds;    
            var recordID = res.recordID;
            var orderNo = res.orderNo;
            var jobNo = res.jobNo;
            var materialCode = res.materialCode;
            var materialName = res.materialName;
            var line = res.line;
            var jobWeight = res.jobWeight;
            var workshop = res.workshop;
            var materialType = res.materialType;
            var material_version = res.material_version;
            //var startTime = res.startTime.year + "-" + res.startTime.month + "-" + res.startTime.day + " " + res.startTime.hour + ":" + res.startTime.minute + ":" + res.startTime.second;
            //var endTime = res.endTime.year + "-" + res.endTime.month + "-" + res.endTime.day + " " + res.endTime.hour + ":" + res.endTime.minute + ":" + res.endTime.second;  
            var startTime = res.startTime.year + "-" + res.startTime.month + "-" + res.startTime.day + " " + "23" + ":" + "59" + ":" + "59";
            var endTime = res.endTime.year + "-" + res.endTime.month + "-" + res.endTime.day + " " + "23" + ":" + "59" + ":" + "59";        
            var paramsData = {
                "method": "confirmSOData",
                "client_customerid": "MES",
                "client_db": "MES",
                "messageid": "SOCF",
                "sign": "",
                "timestamp": `${currentdate}`,
                "apptoken": "80AC1A3F-F949-492C-A024-7044B28C8025",
                "appkey": "test",
                "appSecret": "123456",
                "data": `{
                    "xmldata": {
                        "data": {
                            "orderinfo": [{
                                "OrderNo": '${jobNo}', 
                                "OrderType": "SCDD", 
                                "CustomerID": "LBM",
                                "WarehouseID": "", 
                                "DeliveryNo": "", 
                                "Weight": "", 
                                "CarrierId": "", 
                                "CarrierName": "", 
                                "Soreference1": "",
                                "Soreference2": "FT01", 
                                "Soreference3": '',
                                "Soreference4": '',
                                "Soreference5": "1", 
                                "Udf1": "FT01", 
                                "Udf2": "",
                                "Udf3": "",
                                "Udf4": "",
                                "Udf5": "",
                                "Udf6": "",
                                "Udf7": "",
                                "Udf8": "",
                                "Udf9": "",
                                "Udf10": "",
                                "item": [{
                                    "OrderNo": '${jobNo}', 
                                    "LineNo": "1", 
                                    "SKU": '${materialCode}', 
                                    "QtyShipped": '${jobWeight}', 
                                    "ShippedTime": '${currentdate}', 
                                    "DeliveryNo": "",
                                    "Weight": "",
                                    "Lotatt01": "",
                                    "Lotatt02": 'FD010703', 
                                    "Lotatt03": '${material_version}', 
                                    "Lotatt04": "",
                                    "Lotatt05": '${jobNo}', 
                                    "Lotatt06": "010501", 
                                    "Lotatt07": "",
                                    "Lotatt08": '${startTime}',
                                    "Lotatt09": '${endTime}', 
                                    "Lotatt10": "FT01", 
                                    "Lotatt11": "FT01", 
                                    "Lotatt12": "",
                                    "Udf1": "",
                                    "Udf2": "",  
                                    "Udf3": "",
                                    "Udf4": "",
                                    "Udf5": "",
                                    "Udf6": "",
                                    "Udf7": "",
                                    "Udf8": "",
                                    "Udf9": "",
                                    "Udf10": ""
                                }]
                            }]
                        }
                    }
                }`
            };
            var options = {
                'method': 'POST',
                'url': 'http://10.8.6.29:9003/ERPApi.aspx',
                'timeout': 30000,
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'apptoken': '80AC1A3F-F949-492C-A024-7044B28C8025',
                    'appkey': 'test',
                    'appSecret': '123456',
                    'method': 'confirmSOData',
                    'client_customerid': 'MES',
                    'client_db': 'MES',
                    'messageid': 'SOCF',
                    'sign': '',
                    'timestamp': `${currentdate}`
                },
                form: paramsData
            };
            TraceInfo('options:', options);
            request(options, function (error, response) {
                if (error) {
                    TraceInfo("error: ", error);
                } else {
                    //上传数据成功
                    if (JSON.parse(response.body).Response.return.returnCode === "0000") {
                        var target_arr = [];
                        target_arr.push(recordID);
                        TraceInfo('body:', target_arr)
                        //更新数据，从未上传更新为已上传
                        SetData(target_arr).then();
                    } else {
                        TraceInfo("response.body: ", response.body);
                    }
                }
            });
            // var opt = {
            //     hostname: '10.8.6.29',
            //     port: '9090',
            //     path: '/ERPApi.aspx',
            //     method: 'POST',
            //     timeout: 240000,
            //     //rejectUnauthorized: false,
            //     headers: {
            //         'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            //         'apptoken': '80AC1A3F-F949-492C-A024-7044B28C8025',
            //         'appkey': 'test',
            //         'appSecret': '123456',
            //         'method': 'confirmSOData',
            //         'client_customerid': 'MES',
            //         'client_db': 'MES',
            //         'messageid': 'SOCF',
            //         'sign': '',
            //         'timestamp': `${currentdate}`
            //     }
            // }
            // TraceInfo("",paramsData); 
            // TraceInfo("",opt);
            // var body = '';
            // var req = http.request(opt, function (res1) {
            //     TraceInfo("response: ", JSON.stringify(res1.statusCode));
            //     res1.on('data', function (data) {
            //         body += data;
            //     }).on('end', async function () {
            //         TraceInfo('body:', body);
            //         TraceInfo('parse:body:', JSON.parse(body));
            //         //上传数据成功
            //         if (JSON.parse(body).Response.return.returnCode === "0000") {
            //             var target_arr = [];
            //             target_arr.push(recordID);
            //             TraceInfo('body:', target_arr)
            //             //更新数据，从未上传更新为已上传
            //             SetData(target_arr).then();
            //         }
            //     });
            // }).on('error', function (e) {
            //     TraceInfo("error: ", JSON.stringify(e.message));
            //     TraceInfo("error: ", e);
            // });
            // req.write(paramsData);
            // req.end();
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
    //1：ERP订单号，2：MES工单号，3：产品编码，4:产线，6：工单产量，13：生产车间，16：产品型号，27：开始日期，28：结束日期
    var fieldIDs = [1, 2, 3, 4, 6, 13, 16, 27, 28, 257];
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
    var filter = `(f30=="未上传")&&(f14=="通过")`;//筛选未上传ERP且已审核工单
    var timeRelation = 1; //数据结束时间在查询时间范围内        
    var data_obj = {}; //定义要返回的对象
    //计划库工单管理生产查询
    var res = await PlanQueryThingRecord(objectID,startTime,endTime,timeRelation,filter,fieldIDs);
    if (!res.ret && res.dataSets.length !== 0) {
        var dataSets = res.dataSets;
        data_obj.recordID = dataSets[0].values[9].uint64Value;
        data_obj.orderNo = dataSets[0].values[0].stringValue;
        data_obj.jobNo = dataSets[0].values[1].stringValue;
        data_obj.materialCode = dataSets[0].values[2].stringValue;
        data_obj.line = dataSets[0].values[3].stringValue;
        data_obj.jobWeight = dataSets[0].values[4].stringValue;
        data_obj.workshop = dataSets[0].values[5].stringValue;
        data_obj.materialType = dataSets[0].values[6].stringValue;
        data_obj.startTime = dataSets[0].values[7].dateTimeValue;
        data_obj.endTime = dataSets[0].values[8].dateTimeValue;
        var objectID1 = "87960930222083";
        //计划库bom信息展示查询
        //2：BOM版本，5：父项物料编码，6:物料名称，7：规格型号
        var fieldIDs1 = [2, 5, 6, 7];
        var filter1 = `f5=="${dataSets[0].values[2].stringValue}"`;//筛选出父项物料编码符合条件的数据
        var res1 = await PlanQueryThingRecord(objectID1,startTime,endTime,timeRelation,filter1,fieldIDs1);
        if (!res1.ret && res1.dataSets.length !== 0) {
            var dataSets1 = res1.dataSets;
            data_obj.material_version = dataSets1[0].values[0].stringValue;     
            data_obj.materialName = dataSets1[0].values[2].stringValue;           
        }
    }
    return data_obj;         
}
//更新数据
async function SetData(recordIDs) {
    var objectID = "87960930222082";;
    var arr = [];
    var obj = {};
    for (let i = 0; i < recordIDs.length; i++) {
        obj = {};
        obj.keyValueList = [{"key":30,"value":{stringValue:"已上传"},}];
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