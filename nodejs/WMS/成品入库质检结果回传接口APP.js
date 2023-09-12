function main() {
    TraceInfo("------main 函数执行操作---------");
    var http = require("http"); //引入http模块
    try {
        getData().then(returndataManage => {
            if (JSON.stringify(returndataManage) !== '{}') {
                TraceInfo("执行GetData", returndataManage);
                var date = intervalTime();
                var docNo = 'TR' + date.year + date.month + date.day + date.hour + date.minute + date.second; //"TR2210090007"; 单据号 
                var data_details = returndataManage.sendData;
                var targetdata = JSON.stringify({
                    "data": {
                        "header": [{
                            "warehouseId": 'CS02',
                            "customerId": 'FNLT',
                            "docNo": docNo,
                            "soReferenceA": "",
                            "soReferenceB": "",
                            "soReferenceC": "",
                            "soReferenceD": "",
                            "hedi01": "",
                            "hedi02": "",
                            "hedi03": "",
                            "hedi04": "JY",
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
                            "notes": '生产入库',
                            "details": data_details
                        }]
                    }
                });
                TraceInfo("targetdata:", targetdata);
                var adr = '/datahubjson/FluxWmsJsonApi/?method=putASN&apptoken=24B42D970E5D3DFE2EEE47B5DC39F925&timestamp=2022-10-25 09:15:00&sign=FNLT&format=JSON';
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
                var body = '';
                var req = http.request(opt, function (res) {
                    res.on('data', function (data) {
                        body += data;
                    }).on('end', async function () {
                        // TraceInfo('body:', JSON.stringify(body));
                        TraceInfo('body:', body);
                        //TraceInfo('body:', JSON.parse(body).error);
                        //下发数据成功
                        if (JSON.parse(body).Response.return.returnCode === "0000" || JSON.parse(body).Response.return.returnCode === "ED0342") { //此处ED0342为测试，正式版请删除
                            TraceInfo('返回正确,准备执行SetData:');
                            SetData(returndataManage.dataIDs).then();
                        } else {
                            TraceInfo("body(else): ", body);
                        }
                    });
                }).on('error', function (e) {
                    TraceInfo("error: ", JSON.stringify(e.message));
                })
                req.write(targetdata);
                req.end();
            }
        })
    } catch (e) {
        TraceInfo("异常出现，错误消息：", e.message);
    }
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
            var yearFlag = false,
                monthFlag = false,
                dateFlag = false;
            var hourFlag = false,
                minuteFlag = false,
                secondFlag = false;
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
//查询时空库，获取要发送数据
async function getData() {
    //查询成品入库回传对象下质检结果未上传WMS的数据记录
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var millisecond = date.getMilliseconds();
    //定义方法返回值，对象
    var return_obj = {};
    //查询成品入库回传记录
    var objectID = "54975581631802";
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
    var filter = `(f23=="未上传")`;
    var timeRelation = 1; //数据结束时间在查询时间范围内 
    //11：产品编号，12：实收数量，15：产品批号，21：桶号
    var fieldIDs = [11, 12, 15, 21, 257];
    var res = await HistoryQueryThingRecord(objectID, startTime, endTime, timeRelation, filter, fieldIDs);
    if (!res.ret) {
        TraceInfo("成品入库回传记录查询成功", res.ret);
        //业务处理
        var dataSets = res.dataSets;
        var lens = dataSets.length;
        TraceInfo("dataSets:", dataSets);
        if (lens !== 0) {
            //成品入库回传记录有未上传wms数据
            //for (let i = 0; i < lens; i++) {
            TraceInfo("成品入库回传记录数据dataSets[0]:", dataSets[0]);
            var material_num = dataSets[0].values[0].stringValue; //产品编号
            var qtyOrdered =dataSets[0].values[1].stringValue; //实收数量
            var job_num = dataSets[0].values[2].stringValue; //工单号
            var barrel_num = dataSets[0].values[3].stringValue; //桶号
            var dataId = dataSets[0].values[4].uint64Value; //dataid
            //根据批次号查询工单管理生产对象，查询该批次是全检还是抽检
            var objectID1 = "87960930222082";
            //19：生产状态，29：质检类型
            var fieldIDs1 = [19, 29, 257];
            var filter1 = `(f2=="${job_num}")`; //用工单查 质检类型 `f29 == \"抽检\"`//hege 
            var res1 = await PlanQueryThingRecord(objectID1, startTime, endTime, timeRelation, filter1, fieldIDs1);
            if (!res1.ret) {
                TraceInfo("工单管理生产记录查询成功", res1.ret);
                //业务处理
                var dataSets1 = res1.dataSets;
                var lens1 = dataSets1.length;
                TraceInfo("工单管理生产记录数据dataSets1:", dataSets1);
                if (lens1 !== 0) {
                    var inspectiontype = res1.dataSets[0].values[1].stringValue;
                    var product_sta = res1.dataSets[0].values[0].stringValue;
                    if (inspectiontype === "全检") {
                        TraceInfo("全检");
                        //查询实时库质检下发记录数据，获得请检编号
                        var objectID2 = "3603183167776751619";
                        //1:请检编号
                        var fieldIDs2 = [1, 257];
                        var filter2 = `(f2=="7")&&(f4=="${material_num}")&&(f9=="${job_num}")&&(f6=="${barrel_num}")`;
                        var res2 = RealtimeQueryThingRecord(objectID2, fieldIDs2, filter2);
                        var request_no = res2.fieldValues[0].values[0].stringValue;
                        //查询成品入库质检回传记录数据
                        var objectID3 = "54975581388805";
                        //2:回传时间；9：质检结果
                        var fieldIDs3 = [2, 9, 257];
                        var filter3 = `(f3=="${request_no}")`;
                        var res3 = await HistoryQueryThingRecord(objectID3, startTime, endTime, timeRelation, filter3, fieldIDs3);
                        if (res3.dataSets.length === 0) {
                            //质检结果LIMS未返回
                            return {};
                        } else if (res3.dataSets.length === 1) {
                            //质检结果LIMS已返回
                            var return_time_obj = res3.dataSets[0].values[0].dateTimeValue;
                            var return_time = return_time_obj.year + "-" + return_time_obj.month + "-" + return_time_obj.day + " " + return_time_obj.hour + ":" + return_time_obj.minute + ":" + return_time_obj.second; 
                            var grade_name = res3.dataSets[0].values[1].stringValue;
                            var tolotAtt08;
                            if (grade_name === "合格") {
                                tolotAtt08 = "0"
                            } else if (grade_name === "不合格") {
                                tolotAtt08 = "2"
                            } else {
                                tolotAtt08 = "1"
                            }
                            TraceInfo("grade_name:", grade_name);
                            //重组返回数据
                            var dataId_arr = [];
                            dataId_arr.push(dataId)
                            return_obj.dataIDs = dataId_arr;
                            return_obj.sendData = [
                            {
                                "docNo": "",
                                "lineNo": "1",
                                "fmSku": material_num,
                                "toCustomerId": "FNLT",
                                "toSKU": material_num,
                                "qtyOrdered": qtyOrdered,
                                "lotAtt01": "",
                                "lotAtt02": "",
                                "lotAtt03": "",
                                "lotAtt04": job_num,
                                "lotAtt05": "FT01",
                                "lotAtt06": "W10501",
                                "lotAtt07": "FT01",
                                "lotAtt08": "1",
                                "lotAtt09": "",
                                "lotAtt10": "",
                                "lotAtt11": "",
                                "lotAtt12": "",
                                "lotAtt13": "",
                                "lotAtt14": "",
                                "lotAtt15": "",
                                "lotAtt16": "",
                                "lotAtt17": "",
                                "lotAtt18": "",
                                "lotAtt19": "",
                                "lotAtt20": "",
                                "lotAtt21": "",
                                "lotAtt22": "",
                                "lotAtt23": "",
                                "lotAtt24": "",
                                "toLotAtt01": "",
                                "toLotAtt02": "",
                                "toLotAtt03": "",
                                "toLotAtt04": job_num,
                                "toLotAtt05": "FT01",
                                "toLotAtt06": "W10501",
                                "toLotAtt07": "FT01",
                                "toLotAtt08": tolotAtt08,
                                "toLotAtt09": "",
                                "toLotAtt10": "",
                                "toLotAtt11": "",
                                "toLotAtt12": "",
                                "toLotAtt13": return_time,
                                "toLotAtt14": "",
                                "toLotAtt15": "",
                                "toLotAtt16": "",
                                "toLotAtt17": "",
                                "toLotAtt18": "",
                                "toLotAtt19": "",
                                "toLotAtt20": "",
                                "toLotAtt21": "",
                                "toLotAtt22": "",
                                "toLotAtt23": "",
                                "toLotAtt24": "",
                                "dedi04": "",
                                "dedi05": "",
                                "dedi06": "",
                                "dedi07": "",
                                "dedi08": "",
                                "dedi09": "",
                                "dedi10": "",
                                "dedi11": "",
                                "dedi12": "",
                                "dedi13": "",
                                "dedi14": "",
                                "dedi15": "",
                                "dedi16": "",
                                "userDefine1": "",
                                "userDefine2": "",
                                "userDefine3": barrel_num,
                                "userDefine4": "",
                                "userDefine5": "",
                                "userDefine6": "",
                                "notes": ""
                            }]
                            TraceInfo("return_obj:", return_obj);
                            return return_obj;
                        }
                    } else if (inspectiontype === "抽检" && (product_sta === "2" || product_sta === "4")) {
                        //抽检需要整个批次一起上传，首先判断这个批次是否灌装完成
                        //批次灌装完成
                        //查询成品入库质检回传记录数据，获取该批次质检回传结果
                        TraceInfo("抽检，批次灌装完成");
                        var objectID4 = "54975581388805";
                        //2:回传时间；9：质检结果
                        var fieldIDs4 = [2, 9, 257];
                        var filter4 = `(f8=="${job_num}")`;
                        var res4 = await HistoryQueryThingRecord(objectID4, startTime, endTime, timeRelation, filter4, fieldIDs4);
                        if (res4.dataSets.length === 0) {
                            //质检结果LIMS未返回
                            return {};
                        } else if (res4.dataSets.length === 1) {
                            //质检结果LIMS返回，获取首桶质检结果
                            var return_time_obj1 = res4.dataSets[0].values[0].dateTimeValue;
                            var return_time1 = return_time_obj1.year + "-" + return_time_obj1.month + "-" + return_time_obj1.day + " " + return_time_obj1.hour + ":" + return_time_obj1.minute + ":" + return_time_obj1.second; 
                            var grade_name1 = res4.dataSets[0].values[1].stringValue;
                            var tolotAtt08_1;
                            if (grade_name1 === "合格") {
                                tolotAtt08_1 = "0"
                            } else if (grade_name1 === "不合格") {
                                tolotAtt08_1 = "2"
                            } else {
                                tolotAtt08_1 = "1"
                            }
                            TraceInfo("grade_name1:", grade_name1);
                            //查询成品入库回传对象下该批次所有质检结果未上传WMS的数据记录
                            var objectID5 = "54975581631802";
                            var filter5 = `(f15=="${job_num}")&&(f23=="未上传")`;
                            //11：产品编号，12：实收数量，15：产品批号，21：桶号
                            var fieldIDs5 = [11, 12, 15, 21, 257];
                            var res5 = await HistoryQueryThingRecord(objectID5, startTime, endTime, timeRelation, filter5, fieldIDs5);
                            var dataId_arr1 = [];
                            var data_arr2 = [];
                            var data_ojb2 = {};
                            for (let i = 0; i < res.dataSets.length; i++) {
                                dataId_arr1.push(res5.dataSets[i].values[4].uint64Value);
                                var material_num1 = res5.dataSets[i].values[0].stringValue; //产品编号
                                var barrel_num1 = res5.dataSets[i].values[3].stringValue; //桶号
                                var qtyOrdered1 = res5.dataSets[i].values[1].stringValue; //实收数量
                                var job_num1 = res5.dataSets[i].values[2].stringValue; //批号
                                data_ojb2 = {};
                                data_ojb2.docNo = "",
                                data_ojb2.lineNo = "1",
                                data_ojb2.fmSku = material_num1,
                                data_ojb2.toCustomerId = "FNLT",
                                data_ojb2.toSKU = material_num1,
                                data_ojb2.qtyOrdered =  qtyOrdered1,
                                data_ojb2.lotAtt01 = "",
                                data_ojb2.lotAtt02 = "",
                                data_ojb2.lotAtt03 = "",
                                data_ojb2.lotAtt04 = job_num1,
                                data_ojb2.lotAtt05 = "FT01",
                                data_ojb2.lotAtt06 = "W10501",
                                data_ojb2.lotAtt07 = "FT01",
                                data_ojb2.lotAtt08 = "1",
                                data_ojb2.lotAtt09 = "",
                                data_ojb2.lotAtt10 = "",
                                data_ojb2.lotAtt11 = "",
                                data_ojb2.lotAtt12 = "",
                                data_ojb2.lotAtt13 = "",
                                data_ojb2.lotAtt14 = "",
                                data_ojb2.lotAtt15 = "",
                                data_ojb2.lotAtt16 = "",
                                data_ojb2.lotAtt17 = "",
                                data_ojb2.lotAtt18 = "",
                                data_ojb2.lotAtt19 = "",
                                data_ojb2.lotAtt20 = "",
                                data_ojb2.lotAtt21 = "",
                                data_ojb2.lotAtt22 = "",
                                data_ojb2.lotAtt23 = "",
                                data_ojb2.lotAtt24 = "",
                                data_ojb2.toLotAtt01 = "",
                                data_ojb2.toLotAtt02 = "",
                                data_ojb2.toLotAtt03 = "",
                                data_ojb2.toLotAtt04 = job_num1,
                                data_ojb2.toLotAtt05 = "FT01",
                                data_ojb2.toLotAtt06 = "W10501",
                                data_ojb2.toLotAtt07 = "FT01",
                                data_ojb2.toLotAtt08 = tolotAtt08_1,
                                data_ojb2.toLotAtt09 = "",
                                data_ojb2.toLotAtt10 = "",
                                data_ojb2.toLotAtt11 = "",
                                data_ojb2.toLotAtt12 = "",
                                data_ojb2.toLotAtt13 = return_time1,
                                data_ojb2.toLotAtt14 = "",
                                data_ojb2.toLotAtt15 = "",
                                data_ojb2.toLotAtt16 = "",
                                data_ojb2.toLotAtt17 = "",
                                data_ojb2.toLotAtt18 = "",
                                data_ojb2.toLotAtt19 = "",
                                data_ojb2.toLotAtt20 = "",
                                data_ojb2.toLotAtt21 = "",
                                data_ojb2.toLotAtt22 = "",
                                data_ojb2.toLotAtt23 = "",
                                data_ojb2.toLotAtt24 = "",
                                data_ojb2.dedi04 = "",
                                data_ojb2.dedi05 = "",
                                data_ojb2.dedi06 = "",
                                data_ojb2.dedi07 = "",
                                data_ojb2.dedi08 = "",
                                data_ojb2.dedi09 = "",
                                data_ojb2.dedi10 = "",
                                data_ojb2.dedi11 = "",
                                data_ojb2.dedi12 = "",
                                data_ojb2.dedi13 = "",
                                data_ojb2.dedi14 = "",
                                data_ojb2.dedi15 = "",
                                data_ojb2.dedi16 = "",
                                data_ojb2.userDefine1 = "",
                                data_ojb2.userDefine2 = "",
                                data_ojb2.userDefine3 = barrel_num1,
                                data_ojb2.userDefine4 = "",
                                data_ojb2.userDefine5 = "",
                                data_ojb2.userDefine6 = "",
                                data_ojb2.notes = ""
                                data_arr2.push(data_ojb2);
                            }
                            return_obj.dataIDs = dataId_arr1;
                            return_obj.sendData = data_arr2;
                            TraceInfo("return_obj:", return_obj);
                            return return_obj;
                        }
                    } else if (inspectiontype === "抽检" && (product_sta === "1" || product_sta === "3")) {
                        //抽检需要整个批次一起上传，首先判断这个批次是否灌装完成
                        //批次灌装未完成
                        TraceInfo("抽检，批次灌装未完成");
                        return {};
                    }
                } else if (lens1 === 0) {
                    //无数据
                    TraceInfo("工单管理生产记录无符合条件数据");
                    return {};
                }
            } else {
                TraceInfo("工单管理生产记录查询失败，错误码：", res1.ret);
                return {};
            }
            //}
        } else if (lens === 0) {
            //无数据
            TraceInfo("成品入库回传无符合条件数据");
            return {};
        }
    } else {
        TraceInfo("成品入库回传记录查询失败，错误码：", res.ret);
        return {};
    }
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
//访问时空库，更新对象记录
async function setData(recordIDs) {
    TraceInfo("历史库成品入库回传对象记录更改");
    //成品入库回传对象
    var objectID = "54975581631802";
    var data_arr = [];
    var data_obj = {};
    for (let i = 0; i < recordIDs.length; i++) {
        data_obj = {};
        data_obj = {
            "keyValueList": [ //记录1
                {
                    "key": 23,
                    "value": {
                        stringValue: "已上传"
                    }, //质检是否上传WMS
                }
            ]
        }
        data_arr.push(data_obj);
    }
    var recordValues = data_arr;
    var res = await HistoryUpdateThingRecord(objectID, recordIDs, recordValues);
    if (!res.ret) {
        //业务处理
        TraceInfo("成品入库回传数据更新成功！");
    } else {
        TraceInfo("成品入库回传数据更新失败，错误码：", res.ret);
    }
}
// 导出函数
module.exports = {
    main: main,
    scheduleQuery: scheduleQuery,
};