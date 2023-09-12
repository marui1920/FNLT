function main() {
    TraceInfo("------main 函数执行操作---------");
    GetData().then;
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

async function GetData() {
    // 查询工单管理对象数据 获取工单号、订单号。（用生产状态为1的筛选）
    //用订单号查询订单管理表，得到订单中的质检类型
    //根据质检类型判断，分为全检和手检，
    //全检思路和之前一样 （）
    //手检只需要将第一个进行下发，然后修改状态时 把剩下的状态也修改
    TraceInfo("开始GetData ********************************************************************");
    var objectID = "3603183167776751618";
    var fieldIDs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 257];
    var filter = `(f12 ==\"待检\")&&(f8!="")&&(f9!="")&&(f10!="")`;
    var returndata = await RealtimeQueryThingRecord(objectID, fieldIDs, filter)
    TraceInfo("returndata", returndata);
    TraceInfo("length", returndata.fieldValues.length);
    if (returndata.ret == 0 && returndata.fieldValues.length > 0) {
        //业务处理
        TraceInfo("查询待检的数据成功");
        var dataSets = returndata.fieldValues;
        var lens = dataSets.length;
        TraceInfo("dataSets", dataSets);
        //批次号查工单
        for (var k = 0; k < lens; k++) {
            TraceInfo("当前数据-------------", k);
            //用灌装中的批次号 （job_number）,查询生产工单中的信息 
            filldataIDs = returndata.fieldValues[k].values[14].uint64Value;
            TraceInfo("filldataIDs", filldataIDs);
            job_number = returndata.fieldValues[k].values[0].stringValue;
            TraceInfo("job_number", job_number, "开始使用工单进行判断质检类型");
            //这里需要判断 是抽检还是全检 ，如果是全检，那就正常继续，如果是抽检需要查询本批次是否有合格的 （是否已检），来决定是否下发
            var objectIDManage = "87960930222082";
            var fieldIDsManage = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 29, 257];
            var filterManage = `f2 ==\"${job_number}\"`; //用工单查 质检类型 `f29 == \"抽检\"`//hege 
            var startTime = {
                "year": 2020,
                "month": 1, /// 1-12
                "day": 1, /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                "hour": 8, /// 0-23
                "minute": 0, /// 0-59
                "second": 0, /// 0-59
                "millisecond": 0
            };
            var endTime = {
                "year": 2030,
                "month": 1, /// 1-12
                "day": 1, /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                "hour": 8, /// 0-23
                "minute": 0, /// 0-59
                "second": 0, /// 0-59
                "millisecond": 0
            };
            var timeRelation = 1; //数据结束时间在查询时间范围内
            //TraceInfo("输入信息-------------",objectIDManage, startTime, endTime, timeRelation,filterManage,fieldIDsManage);
            var returndataManage = await PlanQueryThingRecord(objectIDManage, startTime, endTime, timeRelation, filterManage, fieldIDsManage);
            if (returndataManage.ret == 0 && returndataManage.dataSets.length == 1) {
                //获取质检类型 判断
                var inspectiontype = returndataManage.dataSets[0].values[18].stringValue;
                TraceInfo("inspectiontype-------------", inspectiontype, "     ");
                if (inspectiontype == "全检") { //全检
                    //执行下发
                    TraceInfo("全检，开始执行入库报检---------------------------------------------------------------------------------------");
                    TraceInfo("分别是returndataManage returndata:   ", returndataManage.dataSets.length, returndata.fieldValues.length);
                    var dataSetsManage = returndataManage.dataSets;
                    var dataSetsFill = returndata.fieldValues;
                    TraceInfo("dataSetsManage", dataSetsManage);
                    TraceInfo("dataSetsFill", dataSetsFill);
                    var recordIDs = returndata.fieldValues[k].values[14].uint64Value;; // 数据ID
                    var org_code = "FT01";
                    var sample_code = returndataManage.dataSets[0].values[2].stringValue; // manage f3
                    TraceInfo("sample_code----", sample_code);
                    var sample_name = returndataManage.dataSets[0].values[15].stringValue; //manage f16产品型号
                    TraceInfo("sample_name----", sample_name);
                    var sample_point = returndata.fieldValues[k].values[2].stringValue; //fill f3
                    TraceInfo("sample_point----", sample_point);
                    var production_date = returndataManage.dataSets[0].values[17].stringValue;; // manage f18
                    TraceInfo("production_date----", production_date);
                    var request_date = "";
                    var batch_no = returndataManage.dataSets[0].values[1].stringValue;;
                    TraceInfo("batch_no----", batch_no)
                    var Year = new Date().getFullYear()
                    var Month = (new Date().getMonth()) + 1
                    var Day = new Date().getDate()
                    var Hours = new Date().getHours()
                    var Minutes = new Date().getMinutes()
                    var Seconds = new Date().getSeconds()
                    var nowDate = Year + "-" + Month + "-" + Day + " " + Hours + ":" + Minutes + ":" + Seconds;
                    data_arr = []
                    arrData = {};
                    arrData.keyValueList = [{
                            "key": 2,
                            "value": {
                                stringValue: "7"
                            },
                        },
                        {
                            "key": 3,
                            "value": {
                                stringValue: org_code
                            },
                        },
                        {
                            "key": 4,
                            "value": {
                                stringValue: sample_code
                            },
                        },
                        {
                            "key": 5,
                            "value": {
                                stringValue: sample_name
                            },
                        },
                        {
                            "key": 6,
                            "value": {
                                stringValue: sample_point
                            },
                        },
                        {
                            "key": 7,
                            "value": {
                                stringValue: production_date
                            },
                        },
                        {
                            "key": 8,
                            "value": {
                                stringValue: nowDate
                            },
                        },
                        {
                            "key": 9,
                            "value": {
                                stringValue: batch_no
                            },
                        },
                        {
                            "key": 13,
                            "value": {
                                stringValue: "MES"
                            },
                        },
                        {
                            "key": 14,
                            "value": {
                                stringValue: "MES"
                            },
                        },
                        {
                            "key": 17,
                            "value": {
                                stringValue: "未下发"
                            },
                        },
                        {
                            "key": 18,
                            "value": {
                                dateTimeValue: {
                                    "year": Year,
                                    "month": Month, /// 1-12
                                    "day": Day, /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                                    "hour": Hours, /// 0-23
                                    "minute": Minutes, /// 0-59
                                    "second": Seconds, /// 0-59
                                    "millisecond": 0
                                }
                            }
                        },
                        {
                            "key": 19,
                            "value": {
                                stringValue: "未打印"
                            },
                        },
                    ];
                    TraceInfo("arrData", arrData);
                    data_arr.push(arrData);
                    TraceInfo("data_arr", data_arr);
                    TraceInfo("开始写入数据");
                    var objectIDDistribute = "3603183167776751619";
                    var createDataValues = data_arr;
                    var createDataRet = await RealtimeAddThingRecord(objectIDDistribute, createDataValues)
                    if (createDataRet.ret == 0) {
                        TraceInfo("添加下发数据成功", createDataRet);
                    } else {
                        TraceInfo("添加下发数据失败", createDataRet);
                    }
                    //修改灌装的数据，改标志位： 待检 为 已下发  。
                    var arrs = [];
                    var objs = {};
                    for (let i = 0; i < 1; i++) {
                        objs = {};
                        objs.keyValueList = [{
                            "key": 12,
                            "value": {
                                stringValue: "已下发"
                            },
                        }, ];
                        //arr.push(JSON.stringify(obj));
                        arrs.push(objs);
                    }
                    var recordValuess = arrs;
                    TraceInfo("recordValuess", recordValuess);
                    var dataIDs = recordIDs + "";
                    var dataIDarr = [];
                    dataIDarr.push(dataIDs);
                    TraceInfo("dataIDs、", "dataIDarr：", dataIDs, dataIDarr);
                    TraceInfo("更新灌装数据时，输入的参数", objectID, dataIDarr, recordValuess);
                    var updatafills = await RealtimeUpdateThingRecord(objectID, dataIDarr, recordValuess);
                    if (updatafills.ret == 0) {
                        TraceInfo("更新灌装的数据为已下发成功", updatafills);
                    } else {
                        TraceInfo("更新灌装的数据为已下发失败", updatafills);
                    }
                } else if (inspectiontype == "抽检") {
                    // 根据工单号 ，查询灌装工单管理中的数据（需要检的）
                    TraceInfo("抽检--------------------------------------------------");
                    //业务处理
                    var oneOrdfilter = `f1 ==\"${job_number}\"`;
                    var oneOrdres = await RealtimeQueryThingRecord(objectID, fieldIDs, oneOrdfilter);
                    //抽检分为 第一个和其他，第一个需判断是否是合格，其他不需要
                    //找最小的 数据ID
                    var recordIDs = [];
                    var minrecordID;
                    var minNO;
                    for (var j = 0; j < oneOrdres.fieldValues.length; j++) {
                        TraceInfo("当前 j---------", j, "oneOrdres.fieldValues[j]", oneOrdres.fieldValues[j]);
                        thisID = oneOrdres.fieldValues[j].values[14].uint64Value;
                        TraceInfo("thisID", thisID);
                        recordIDs.push(thisID);
                        if (recordIDs[0] <= recordIDs[j]) {
                            minrecordID = recordIDs[0]
                            minNO = 0;
                        } else {
                            minrecordID = recordIDs[j];
                            minNO = j
                        }
                    }
                    TraceInfo("最小的ID和角标 minrecordID,minNO-------------", minrecordID, "     ", minNO);
                    TraceInfo("filldataIDs,minrecordID-------------", filldataIDs, "     ", minrecordID);
                    //minrecordIDs 就是想要的, 当前是不是这个最小、
                    if (filldataIDs == minrecordID) {
                        //就是最小，需要看是不是合格
                        var org_code = "FT01";
                        var sample_code = returndataManage.dataSets[0].values[2].stringValue; // manage f3
                        TraceInfo("sample_code----", sample_code);
                        var sample_name = returndataManage.dataSets[0].values[15].stringValue; //manage f16产品型号
                        TraceInfo("sample_name----", sample_name);
                        var sample_point = returndata.fieldValues[0].values[2].stringValue; //fill f3
                        TraceInfo("sample_point----", sample_point);
                        var production_date = returndataManage.dataSets[0].values[17].stringValue;; // manage f18
                        TraceInfo("production_date----", production_date);
                        var request_date = "";
                        var batch_no = returndataManage.dataSets[0].values[1].stringValue;;
                        TraceInfo("batch_no----", batch_no)
                        var recordID1 = returndata.fieldValues[0].values[14].uint64Value;; // 数据ID
                        var Year = new Date().getFullYear()
                        var Month = (new Date().getMonth()) + 1
                        var Day = new Date().getDate()
                        var Hours = new Date().getHours()
                        var Minutes = new Date().getMinutes()
                        var Seconds = new Date().getSeconds()
                        var nowDate = Year + "-" + Month + "-" + Day + " " + Hours + ":" + Minutes + ":" + Seconds;
                        data_arr = []
                        arrData = {};
                        arrData.keyValueList = [{
                                "key": 2,
                                "value": {
                                    stringValue: "7"
                                },
                            },
                            {
                                "key": 3,
                                "value": {
                                    stringValue: org_code
                                },
                            },
                            {
                                "key": 4,
                                "value": {
                                    stringValue: sample_code
                                },
                            },
                            {
                                "key": 5,
                                "value": {
                                    stringValue: sample_name
                                },
                            },
                            {
                                "key": 6,
                                "value": {
                                    stringValue: sample_point
                                },
                            },
                            {
                                "key": 7,
                                "value": {
                                    stringValue: production_date
                                },
                            },
                            {
                                "key": 8,
                                "value": {
                                    stringValue: nowDate
                                },
                            },
                            {
                                "key": 9,
                                "value": {
                                    stringValue: batch_no
                                },
                            },
                            {
                                "key": 13,
                                "value": {
                                    stringValue: "MES"
                                },
                            },
                            {
                                "key": 14,
                                "value": {
                                    stringValue: "MES"
                                },
                            },
                            {
                                "key": 17,
                                "value": {
                                    stringValue: "未下发"
                                },
                            },
                            {
                                "key": 18,
                                "value": {
                                    dateTimeValue: {
                                        "year": Year,
                                        "month": Month, /// 1-12
                                        "day": Day, /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                                        "hour": Hours, /// 0-23
                                        "minute": Minutes, /// 0-59
                                        "second": Seconds, /// 0-59
                                        "millisecond": 0
                                    }
                                }
                            },
                            {
                                "key": 19,
                                "value": {
                                    stringValue: "未打印"
                                },
                            },
                        ];
                        TraceInfo("arrData", arrData);
                        data_arr.push(arrData);
                        TraceInfo("data_arr", data_arr);
                        TraceInfo("开始写入数据");
                        var objectIDDistribute = "3603183167776751619";
                        var createDataValues = data_arr;
                        var createDataRet = await RealtimeAddThingRecord(objectIDDistribute, createDataValues)
                        if (createDataRet.ret == 0) {
                            TraceInfo("添加下发数据成功", createDataRet);
                        } else {
                            TraceInfo("添加下发数据失败", createDataRet);
                        }
                        //修改灌装的数据，改标志位： 待检 为 已下发  。
                        var arr = [];
                        var obj = {};
                        for (let i = 0; i < 1; i++) {
                            obj = {};
                            obj.keyValueList = [{
                                "key": 12,
                                "value": {
                                    stringValue: "已下发"
                                },
                            }, ];
                            //arr.push(JSON.stringify(obj));
                            arr.push(obj);
                        }
                        var recordValues = arr;
                        TraceInfo("recordValues", recordValues);
                        var dataID = recordID1 + "";
                        var dataIDs = [];
                        dataIDs.push(dataID);
                        TraceInfo("dataIDs", dataIDs);
                        TraceInfo("更新灌装数据时，输入的参数", objectID, dataIDs, recordValues);
                        var updatafill = await RealtimeUpdateThingRecord(objectID, dataIDs, recordValues);
                        if (updatafill.ret == 0) {
                            TraceInfo("更新灌装的数据为已下发成功", updatafill);
                        } else {
                            TraceInfo("更新灌装的数据为已下发失败", updatafill);
                        }
                    } else {
                        //不检，直接修改
                        var arrs = [];
                        var objs = {};
                        for (let i = 0; i < 1; i++) {
                            objs = {};
                            objs.keyValueList = [{
                                "key": 12,
                                "value": {
                                    stringValue: "待抽检"
                                },
                            }, ];
                            //arr.push(JSON.stringify(obj));
                            arrs.push(objs);
                        }
                        var recordValuess = arrs;
                        TraceInfo("recordValuess", recordValuess);
                        var dataIDs = filldataIDs.toString();
                        var dataIDarr = [];
                        dataIDarr.push(dataIDs);
                        //TraceInfo("dataIDarr",dataIDarr);
                        TraceInfo("更新灌装数据时，输入的参数", objectID, dataIDarr, recordValuess);
                        var updatafills = await RealtimeUpdateThingRecord(objectID, dataIDarr, recordValuess);
                        if (updatafills.ret == 0) {
                            TraceInfo("更新灌装的数据为已下发成功", updatafills);
                        } else {
                            TraceInfo("更新灌装的数据为已下发失败", updatafills);
                        }
                    }

                }
            } else if (returndataManage.ret == 0 && returndataManage.dataSets.length == 0) {
                TraceInfo("查询工单管理的数据成功但是没有数据 ", returndataManage);
                return
            } else {
                TraceInfo("查询工单管理的数据失败");
            }
        }
    } else if (returndata.ret == 0 && returndata.fieldValues.length == 0) {
        TraceInfo("灌装工单中无数据 ", returndata);
        return
    } else {
        TraceInfo("查询灌装数据失败");
    }
}
// 导出函数
module.exports = {
    main: main,
    scheduleQuery: scheduleQuery,
};