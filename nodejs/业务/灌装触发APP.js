function main() {
        TraceInfo("------main 函数执行操作---------");
        GetData().then;
}
async function GetData() {
        var objectIDManage = "87960930222082";
        var fieldIDsManage = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 257];
        //var filterManage = `((f19 ==\"1\")||(f19 ==\"3\")||(f19 ==\"2\")||(f19 ==\"4\"))&&(f17 ==\"已下发\")`;
        //灌装线下发状态成员用开始日期，索引为9
        var filterManage = `((f19 ==\"1\")||(f19 ==\"3\")||(f19 ==\"2\")||(f19 ==\"4\"))&&(f9 ==\"已下发\")`;
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
        TraceInfo("输入信息-------------", objectIDManage, startTime, endTime, timeRelation, filterManage, fieldIDsManage);
        //PlanQueryThingRecord(objectID, startTime, endTime, timeRelation, filter,fieldIDs,callback);
        var returndataManage = await PlanQueryThingRecord(objectIDManage, startTime, endTime, timeRelation, filterManage, fieldIDsManage)
        TraceInfo("returndataManage", returndataManage);
        if (returndataManage.ret == 0 && returndataManage.dataSets.length != 0) {
                //业务处理
                TraceInfo("查询工单管理中所有的数据成功,一共有", returndataManage.dataSets.length, "个--------------------分别为：", returndataManage);
                var dataSetsManage = returndataManage.dataSets;
                TraceInfo("dataSetsManage ，个数", dataSetsManage.length);
                for (var i = 0; i < returndataManage.dataSets.length; i++) {
                        //桶数量和工单号
                        TraceInfo("-----------------------------------------------------------------------------i=", i);
                        var ordID = returndataManage.dataSets[i].values[1].stringValue; // manage f2 工单号
                        var batch_num = returndataManage.dataSets[i].values[10].stringValue; // manage f11  桶数量
                        var productionStatus = returndataManage.dataSets[i].values[18].stringValue; // manage f19  生产状态
                        var dataID = returndataManage.dataSets[i].values[19].uint64Value; // manage 数据ID
                        TraceInfo("ordID---------------", ordID);
                        TraceInfo("batch_num---------------", batch_num);
                        TraceInfo("productionStatus---------------", productionStatus);
                        TraceInfo("dataID---------------", dataID);

                        //查询灌装工单管理 找到工单下的数据条数
                        var objectIDFill = "3603183167776751618";
                        var fieldIDsFill = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 257];
                        var filterFill = `(f1=="${ordID}")&&(f8!="")&&(f9!="")&&(f10!="")`;
                        var returndataFill = await RealtimeQueryThingRecord(objectIDFill, fieldIDsFill, filterFill)
                        //TraceInfo("returndataFill",returndataFill);
                        var fillDataLength = returndataFill.fieldValues.length;
                        TraceInfo("fillDataLength----", fillDataLength);
                        //是否需要转数字进行比较
                        if (batch_num > fillDataLength) {
                                if (productionStatus == "2") {
                                        var recordID = dataID + "";
                                        var recordIDs = [recordID];
                                        var recordValues = [{
                                                "keyValueList": [ //记录1
                                                        {
                                                                "key": 19,
                                                                "value": {
                                                                        stringValue: "1"
                                                                }, //f19为生产状态, 2改为1 
                                                        },
                                                ]
                                        }, ];
                                        TraceInfo("修改工单管理中的状态，输入信息为---------------", objectIDManage, ",", recordIDs, ",", recordValues);
                                        PlanUpdateThingRecord(objectIDManage, recordIDs, recordValues, function (res) {
                                                if (!res.ret) {
                                                        //业务处理
                                                        TraceInfo("修改成功 ，生产状态由2修改为1 ----");
                                                }
                                        });
                                } else if (productionStatus == "4") {
                                        var recordID = dataID + "";
                                        var recordIDs = [recordID];
                                        var recordValues = [{
                                                "keyValueList": [ //记录1
                                                        {
                                                                "key": 19,
                                                                "value": {
                                                                        stringValue: "3"
                                                                }, //f19为生产状态, 4改为3 
                                                        },
                                                ]
                                        }, ];
                                        TraceInfo("修改工单管理中的状态，输入信息为---------------", objectIDManage, ",", recordIDs, ",", recordValues);
                                        PlanUpdateThingRecord(objectIDManage, recordIDs, recordValues, function (res) {
                                                if (!res.ret) {
                                                        //业务处理
                                                        TraceInfo("修改成功 ，生产状态由4修改为3 ----");
                                                }
                                        });
                                }
                        } else if (batch_num == fillDataLength) {
                                TraceInfo("桶数量和数据条数相等，开始继续执行，判断生产状态是否为1或者3，productionStatus：", productionStatus);
                                if (productionStatus == "1") {
                                        var recordID = dataID + "";
                                        var recordIDs = [recordID];
                                        var recordValues = [{
                                                "keyValueList": [ //记录1
                                                        {
                                                                "key": 19,
                                                                "value": {
                                                                        stringValue: "2"
                                                                }, //f19为生产状态, 1改为2 
                                                        },
                                                ]
                                        }, ];
                                        TraceInfo("修改工单管理中的状态，输入信息为---------------", objectIDManage, ",", recordIDs, ",", recordValues);
                                        PlanUpdateThingRecord(objectIDManage, recordIDs, recordValues, function (res) {
                                                if (!res.ret) {
                                                        //业务处理
                                                        TraceInfo("修改成功 ，生产状态由1修改为2 ----");
                                                }
                                        });
                                } else if (productionStatus == "3") {
                                        var recordID = dataID + "";
                                        var recordIDs = [recordID];
                                        var recordValues = [{
                                                "keyValueList": [ //记录1
                                                        {
                                                                "key": 19,
                                                                "value": {
                                                                        stringValue: "4"
                                                                }, //f19为生产状态, 1改为2 
                                                        },
                                                ]
                                        }, ];
                                        TraceInfo("修改工单管理中的状态，输入信息为---------------", objectIDManage, ",", recordIDs, ",", recordValues);
                                        PlanUpdateThingRecord(objectIDManage, recordIDs, recordValues, function (res) {
                                                if (!res.ret) {
                                                        //业务处理
                                                        TraceInfo("修改成功 ，生产状态由3修改为4 ----");
                                                }
                                        });
                                } else {
                                        TraceInfo("该工单下的生产状态不符要求  ，为----", productionStatus);
                                }
                        } else {
                                TraceInfo("灌装数量超过工单数量", batch_num, "、", fillDataLength);
                        }
                }


        } else if (returndataManage.ret == 0 && returndataManage.dataSets.length == 0) {
                TraceInfo("查询到工单管理中的数据，数量不正确----", returndataManage.dataSets.length);

        } else {

                TraceInfo("查询失败---", returndataManage.ret);
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

// 导出函数
module.exports = {
        main: main,
        scheduleQuery: scheduleQuery,
};