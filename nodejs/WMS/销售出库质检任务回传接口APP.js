/*main.js */
function main() {
    TraceInfo("------main 函数执行操作---------");
    var http = require("http"); //引入http模块
    //查询成品发货质检回传、工单管理生产内符合条件数据，返回
    var date = intervalTime();
    var objectID = "54975581388809";
    //3:请检编号;6:物料编码;7:物料名称;8:生产批号;9:质检结果;257:dataid
    var fieldIDs = [3, 6, 7, 8, 9, 257];
    var filter = `f12 == "待回传WMS"`;
    var startTime = {
        "year":date.year,
        "month":date.month,     /// 1-12
        "day":1,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
        "hour":0,         /// 0-23
        "minute":0,       /// 0-59
        "second":0,       /// 0-59
        "millisecond":0
    };
    var endTime = {
        "year":date.year + 1,
        "month":date.month,     /// 1-12
        "day":1,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
        "hour":0,         /// 0-23
        "minute":0,       /// 0-59
        "second":0,       /// 0-59
        "millisecond":0
    };   
    TraceInfo("startTime:",startTime);
    TraceInfo("endTime:",endTime);
    var timeRelation=1;//数据结束时间在查询时间范围内
    TraceInfo("函数执行前");
    //查询成品发货质检回传记录
    HistoryQueryThingRecord(objectID,startTime,endTime,timeRelation,filter,fieldIDs,function (res) {
        TraceInfo("res:",res);
        if ( !res.ret ) {
            //业务处理
            TraceInfo("函数执行中");
            var dataSets = res.dataSets;
            var lens = dataSets.length;
            var docNo = 'TR' + date.year + date.month + date.day + date.hour + date.minute + date.second; //"TR2210090007"; 单据号 
            TraceInfo("",dataSets);
            if (lens !== 0) {
                var targetdata;
                GetData(lens,dataSets).then(res1 => {
                    targetdata = JSON.stringify({
                        "data": {
                            "header": [{
                                "warehouseId": 'CS01',
                                "customerId": 'FNLT',
                                "docNo": docNo,
                                "soReferenceA": "",
                                "soReferenceB": "",
                                "soReferenceC": "",
                                "soReferenceD": "",
                                "hedi01": "",
                                "hedi02": "",
                                "hedi03": "",
                                "hedi04": "CKJY",
                                "hedi05": "",
                                "hedi06": "",
                                "hedi07": "",
                                "hedi08": "",
                                "hedi09": "",
                                "hedi10": "",
                                "userDefine1": "",
                                "userDefine2": "",
                                "userDefine3": "",
                                "userDefine4": "",
                                "userDefine5": "",
                                "userDefine6": "",
                                "notes": '',
                                "details": res1.data
                            }]
                        }
                    });
                    TraceInfo("res1:",res1);
                    TraceInfo("targetdata:",targetdata);
                    var adr = '/datahubjson/FluxWmsJsonApi/?method=putInventoryTransfer&apptoken=24B42D970E5D3DFE2EEE47B5DC39F925&timestamp=2022-10-25 09:15:00&sign=FNLT&format=JSON';
                    adr = encodeURI(adr);
                    TraceInfo("adr",adr);
                    var opt = {
                        hostname: '36.155.6.207',
                        port: '38080',
                        path: adr,
                        method: 'POST',
                        headers: {
                            'Connection':'keep-alive',
                            'Content-Type': 'application/json;charset-utf-8'
                        }
                    }
                    TraceInfo("opt",opt);
                    var body = '';
                    var req = http.request(opt, function (res2) {
                        TraceInfo("response: ", JSON.stringify(res2.statusCode));
                        res2.on('data', function (data) {
                            body += data;
                        }).on('end', async function () {
                            TraceInfo('body:', JSON.stringify(body));
                            TraceInfo('body:', body);
                            TraceInfo('body:', JSON.parse(body).error);
                            //下发数据成功
                            if (JSON.parse(body).Response.return.returnCode === '0000' || JSON.parse(body).Response.return.returnCode === 'ED0345') {
                                //更新数据
                                SetData(res1.dataID).then();
                            }
                        });
                    }).on('error', function (e) {
                        TraceInfo("error: ", JSON.stringify(e.message));
                    })
                    req.write(targetdata);
                    req.end();                    
                });

            }
        }
    
    }); 
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
    let month = newDate.getMonth() < 9 ? 1 + newDate.getMonth() : 1 + newDate.getMonth();
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
async function GetData(lens,dataSets) {
    var date = intervalTime();
    var return_obj = {};
    var data_obj = {};
    var data_arr = [];
    var dataID_arr = [];
    for (var i = 0; i < lens; i++) {
        data_obj = {};
        var batch_no = dataSets[i].values[3].stringValue;
        var WLDM = dataSets[i].values[1].stringValue;
        var grade_name = dataSets[i].values[4].stringValue;
        var dataid = dataSets[i].values[5].uint64Value;
        TraceInfo("batch_no:",batch_no);
        TraceInfo("WLDM:",WLDM);
        var objectID1 = "87960930486082";
        //11:产品编号;12:实收数量;14:产品批号;15:ERP组织;16:ERP仓库;17:ERP货主;18:质量状态(0:良品,1:不良品,2:待检品);20:桶号257:dataid
        var fieldIDs1 = [11, 12, 14, 15, 16, 17, 18, 20, 257];
        var filter1 = `(f11 == "${WLDM}")&&(f20 == "${batch_no}")`;
        var startTime = {
            "year":date.year,
            "month":date.month,     /// 1-12
            "day":1,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
            "hour":0,         /// 0-23
            "minute":0,       /// 0-59
            "second":0,       /// 0-59
            "millisecond":0
        };
        var endTime = {
            "year":date.year + 1,
            "month":date.month,     /// 1-12
            "day":1,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
            "hour":0,         /// 0-23
            "minute":0,       /// 0-59
            "second":0,       /// 0-59
            "millisecond":0
        };   
        TraceInfo("startTime:",startTime);
        TraceInfo("endTime:",endTime);
        var timeRelation=1;//数据结束时间在查询时间范围内
        //查询销售出库质检任务下发记录
        var data1 = await PlanQueryThingRecord(objectID1,startTime,endTime,timeRelation,filter1,fieldIDs1).then(function (res) {
            TraceInfo("res:",res);
            data_obj.lineNo = i + 1;
            data_obj.fmSku = res.dataSets[0].values[0].stringValue;
            data_obj.toCustomerId = 'FNLT'; 
            data_obj.toSKU = res.dataSets[0].values[0].stringValue;             
            data_obj.qtyOrdered = res.dataSets[0].values[1].stringValue; 
            data_obj.lotAtt04 = res.dataSets[0].values[2].stringValue; 
            data_obj.lotAtt05 = (res.dataSets[0].values[3].stringValue ? res.dataSets[0].values[3].stringValue : '' );
            data_obj.lotAtt06 = (res.dataSets[0].values[4].stringValue ? res.dataSets[0].values[4].stringValue : '' );
            data_obj.lotAtt07 = (res.dataSets[0].values[5].stringValue ? res.dataSets[0].values[5].stringValue : '' );
            data_obj.lotAtt08 = (res.dataSets[0].values[6].stringValue ? res.dataSets[0].values[6].stringValue : '' );
            data_obj.toLotAtt04 = res.dataSets[0].values[2].stringValue; 
            data_obj.toLotAtt05 = data_obj.lotAtt05;
            data_obj.toLotAtt06 = data_obj.lotAtt06;
            data_obj.toLotAtt07 = data_obj.lotAtt07;
            switch (grade_name) {
                case '待检':
                    data_obj.toLotAtt08 = '1';
                    break;
                case '合格':
                    data_obj.toLotAtt08 = '3';
                    break;
                case '不合格':
                    data_obj.toLotAtt08 = '2';
                    break;
                default:
                    break;
            }
            data_obj.userDefine2 = res.dataSets[0].values[7].stringValue; 
            //dataID_arr.push(res.dataSets[0].values[8].uint64Value);
            dataID_arr.push(dataid);
            data_arr.push(data_obj);
            return_obj = {
                dataID:dataID_arr,
                data:data_arr
            }
            return return_obj;            
        })
    }
    return data1;   
}
//将成品发货质检回传内"待回传wms"的数据更新为"已下发wms"
async function SetData(recordIDs) {
    var objectID = "54975581388809";
    //var recordIDs=["1459166279268040719","1459166279268040720"];
    var arr = [];
    var obj = {};
    for (let i = 0; i < recordIDs.length; i++) {
        obj = {};
        obj.keyValueList = [{"key":12,"value":{stringValue:"已回传WMS"},}];
        //arr.push(JSON.stringify(obj));
        arr.push(obj);
    }
    var recordValues = arr;
    TraceInfo("recordValues",recordValues);
    await HistoryUpdateThingRecord(objectID,recordIDs,recordValues).then(function (res) {
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
}