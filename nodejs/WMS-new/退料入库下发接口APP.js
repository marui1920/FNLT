function main() {
    TraceInfo("------main 函数执行操作---------");
    var http = require("http"); //引入http模块
    GetData().then(returndata => {
        if (JSON.stringify(returndata) !== '{}') {
            TraceInfo("执行GetData", returndata);
            var targetdata = returndata.sendData;
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
                    TraceInfo('body:', body);
                    //下发数据成功
                    if (JSON.parse(body).Response.return.returnCode === "0000" || JSON.parse(body).Response.return.returnCode === "ED0342") {  //此处ED0342为测试，正式版请删除
                        TraceInfo('返回正确,准备执行SetData:');
                        SetData(returndata.dataIds);
                    } else {
                        TraceInfo("返回错误:", JSON.parse(body));
                    }
                });
            }).on('error', function (e) {
                TraceInfo("error: ", JSON.stringify(e.message));
            })
            req.write(targetdata);
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
async function GetData() {
    //声明要返回的对象，包含dataid和要发送的数据
    var return_obj = {} 
    var objectID = "3603183167776751632";
    var fieldIDs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 257];
    var filter = `(f8 ==\"质检合格\")&&(f10 ==\"未下发\") `;
    var returndata = await RealtimeQueryThingRecord(objectID, fieldIDs, filter);
    if (returndata.ret == 0 && returndata.fieldValues.length == 0) {
        //业务处理
        TraceInfo("无符合条件数据");
        return {};
    } else if (returndata.ret == 0 && returndata.fieldValues.length > 0) {
        TraceInfo("有符合条件数据");
        var date = new Date();
        var seperator = "-";
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var hour = date.getHours();
        var minutes = date.getMinutes();
        var seconds = date.getSeconds();
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        if (minutes >= 0 && minutes <= 9) {
            minutes = "0" + minutes;
        }
        var currentdate = year + seperator + month + seperator + strDate + " " + hour + ":" + minutes + ":" + seconds;
        var timeString = year + month + strDate + hour + minutes + seconds;
        TraceInfo("currentdate----", currentdate);
        var dataSets = returndata.fieldValues;
        var lens = dataSets.length;
        TraceInfo("dataSets", dataSets);
        var batch_weight = dataSets[0].values[3].stringValue;// manage f4 重量
        TraceInfo("batch_weight----", batch_weight);
        var location = dataSets[0].values[4].stringValue;// manage f5
        TraceInfo("location----", location);
        var supplierName = dataSets[0].values[5].stringValue;// manage f6
        TraceInfo("supplierName----", supplierName);
        var time = dataSets[0].values[6].stringValue;// manage f7 入库日期
        TraceInfo("time----", time);
        var qualitystatus = dataSets[0].values[7].stringValue;// manage f8   质量状态(0:良品,1:不良品,2:待检品)
        TraceInfo("qualitystatus----", qualitystatus);
        var warehouseId = "CS01";
        var customerId = "FNLT";
        var asnType = "TLRK";
        var docNo = 'TLRK-' + timeString;
        var asnReferenceA = 'TLRK-' + timeString;
        var asnCreationTime = currentdate;
        var supplierId = "SCCJ";
        var supplier = "生产车间";
        var hedi09 = batch_weight;
        var details = [];
        var targetObj = {};
        var recordIDs = [];
        targetObj.sku = dataSets[0].values[1].stringValue;// manage f2 物料代码
        targetObj.lineNo = "1";
        targetObj.expectedQty = batch_weight;
        targetObj.lotAtt01 = time;
        targetObj.lotAtt04 = dataSets[0].values[2].stringValue;// manage f3 物料批次
        targetObj.lotAtt05 = "FT01";
        targetObj.lotAtt06 = "010501";
        targetObj.lotAtt07 = "FT01";
        targetObj.lotAtt08 = '0';
        targetObj.lotAtt09 = "";
        targetObj.lotAtt010 = '';
        targetObj.dedi04 = batch_weight;
        targetObj.dedi05 = "";
        details.push(targetObj);
        TraceInfo("details----", details);
        //recordIDs 数据ID 用来后面修改数据 
        var recordID = dataSets[0].values[11].uint64Value;// 
        recordIDs.push(recordID);
        TraceInfo("recordIDs----", recordIDs);
        //}
        var paramsData = JSON.stringify({
            "data": {
                "header": [{
                    "warehouseId": warehouseId,
                    "customerId": customerId,
                    "asnType": asnType,
                    "docNo": docNo,
                    "asnReferenceA": asnReferenceA,
                    "asnReferenceB": "",
                    "asnReferenceC": "",
                    "asnReferenceD": "",
                    "asnCreationTime": asnCreationTime,
                    "expectedArriveTime1": "",
                    "expectedArriveTime2": "",
                    "supplierId": supplierId,
                    "supplierName": supplier,
                    "supplierAddress1": "",
                    "supplierAddress2": "",
                    "supplierAddress3": "",
                    "supplierAddress4": "",
                    "supplierCountry": "",
                    "suppliMESrovince": "",
                    "supplierCity": "",
                    "supplierDistrict": "",
                    "supplierStreet": "",
                    "supplierContact": "",
                    "supplierFax": "",
                    "supplierMail": "",
                    "supplierTel1": "",
                    "supplierTel2": "",
                    "supplierZip": "",
                    "carrierId": "",
                    "carrierName": "",
                    "countryOfDestination": "",
                    "countryOfOrigin": "",
                    "followUp": "",
                    "hedi01": "",
                    "hedi02": "",
                    "hedi03": "",
                    "hedi04": "",
                    "hedi05": "",
                    "hedi06": "",
                    "hedi07": "",
                    "hedi08": "",
                    "hedi09": hedi09,
                    "hedi10": "",
                    "placeOfDischarge": "",
                    "placeOfLoading": "",
                    "placeOfDelivery": "",
                    "priority": "",
                    "userDefine1": "",
                    "userDefine2": "",
                    "userDefine3": "",
                    "userDefine4": "",
                    "userDefine5": "",
                    "userDefine6": "",
                    "userDefine7": "",
                    "userDefine8": "",
                    "userDefine9": "",
                    "userDefine10": "",
                    "notes": "",
                    "crossdockFlag": "",
                    "details": details,
                }]
            }
        })
        TraceInfo("paramsData ", paramsData);
        return_obj.dataIds = recordIDs;
        return_obj.sendData = paramsData;
        return return_obj;
    } else {
        TraceInfo("returndata查询有误", returndata);
        return {};
    }
}
//1.退料入库后，改状态 （是否退料） 否 改成 是。
//2.修改线边仓的库存数量。通过上边的物料名/物料编码 查到后仓库数量 在减掉。
async function SetData(recordIDs) {
    TraceInfo("开始修改状态（是否退料）");
    var objectID = "3603183167776751632";
    var arr = [];
    var obj = {};
    for (let i = 0; i < recordIDs.length; i++) {
        obj = {};
        obj.keyValueList = [{ "key": 10, "value": { stringValue: "已退料" }, }];
        //arr.push(JSON.stringify(obj));
        arr.push(obj);
    }
    var recordValues = arr;
    TraceInfo("recordValues", recordValues);
    var updataret = await RealtimeUpdateThingRecord(objectID, recordIDs, recordValues);
    if (!updataret.ret) {
        //业务处理
        TraceInfo("修改状态成功 updataret", updataret);
    } else {
        TraceInfo("修改状态失败 updataret", updataret);
    }
    TraceInfo("开始修改线边仓的库存数量");
    // 通过退料表的ID 查询退料表数据 ，获取物料/物料编码和退料的量，拿着物料编码物料/物料编码 查询库存数据，获取数量并减去 修改 
    for (let k = 0; k < recordIDs.length; k++) {
        TraceInfo(" k--------------------", k);
        //>RealtimeQueryThingRecordByRecordID( objectID， recordIDs， fieldIDs, callback)
        //var objectID = "3603183167776751632";
        var fieldIDs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 257];
        var queryBackMaterialRecordID = [recordIDs[k]];
        TraceInfo("输入信息---objectIDManage----------", objectID, recordIDs[k]);
        var queryBackMaterialData = await RealtimeQueryThingRecordByRecordID(objectID, queryBackMaterialRecordID, fieldIDs)
        TraceInfo("queryBackMaterialData", queryBackMaterialData);
        var materialCode = queryBackMaterialData.fieldValues[0].values[1].stringValue;
        var materialBatch = queryBackMaterialData.fieldValues[0].values[2].stringValue;
        var materialWeight = queryBackMaterialData.fieldValues[0].values[3].stringValue;
        var weightMinuend = parseFloat(materialWeight);
        TraceInfo("输入信息-materialCode------------", materialCode,);
        TraceInfo("输入信息-weightMinuend------------", weightMinuend,);
        if (queryBackMaterialData.ret == 0 && queryBackMaterialData.fieldValues.length == 1) {
            TraceInfo(" 查询退料信息成功，数量正确", queryBackMaterialData);
            //用物料编码，在线边仓库存里查询数据，得到库存量 PlanQueryThingRecord(objectID, startTime, endTime, timeRelation, filter,fieldIDs,callback);
            var inventoryobjectID = "3603812087758862849";
            var startTime = {
                "year": 2000,
                "month": 3,     /// 1-12
                "day": 12,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                "hour": 8,         /// 0-23
                "minute": 0,       /// 0-59
                "second": 0,       /// 0-59
                "millisecond": 0
            };
            var endTime = {
                "year": 2055,
                "month": 3,     /// 1-12
                "day": 13,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                "hour": 8,         /// 0-23
                "minute": 0,       /// 0-59
                "second": 0,       /// 0-59
                "millisecond": 0
            };
            var inventoryfilter = `(f2=="${materialCode}")&&(f3=="${materialBatch}")`;
            var timeRelation = 1;//数据结束时间在查询时间范围内
            TraceInfo("查询库存输入信息-------------", inventoryobjectID, inventoryfilter, fieldIDs);
            var inventoryQueryRet = await PlanQueryThingRecord(inventoryobjectID, startTime, endTime, timeRelation, inventoryfilter, fieldIDs);
            TraceInfo("-inventoryQueryRet------------", inventoryQueryRet);
            if (inventoryQueryRet.ret == 0 && inventoryQueryRet.dataSets.length == 1) {
                TraceInfo(" 查询库存信息成功，数量正确", inventoryQueryRet);
                var inventoryNum = inventoryQueryRet.dataSets[0].values[3].stringValue;
                var inventoryFloatNum = parseFloat(inventoryNum);
                var inventoryFinalFloat = (inventoryFloatNum - weightMinuend) + "";
                var inventoryFinal = inventoryFinalFloat + "";
                var inventoryrecordID = inventoryQueryRet.dataSets[0].values[10].uint64Value;
                var inventoryrecordIDs = [inventoryrecordID];
                TraceInfo(" 计算库存结果,inventoryFinal: ---", inventoryFinal);
                //计算、修改
                var inventoryrecordValues = [
                    {
                        "keyValueList": [
                            {
                                "key": 4,
                                "value": { stringValue: inventoryFinal },
                            },
                        ]
                    },
                ];
                TraceInfo(" 更新数据输入信息-------------", inventoryobjectID, inventoryrecordIDs, inventoryrecordValues);
                var updatainventoryret = await PlanUpdateThingRecord(inventoryobjectID, inventoryrecordIDs, inventoryrecordValues);
                if (!updatainventoryret.ret) {
                    //业务处理
                    TraceInfo("更新成功 updataret", updatainventoryret);
                } else {
                    TraceInfo("更新数据失败 updataret", updatainventoryret);
                }
            } else if (inventoryQueryRet.ret == 0 && inventoryQueryRet.dataSets.length != 1) {
                TraceInfo("查询库存信息成功，但数量不对 ", inventoryQueryRet);
            } else {
                TraceInfo("查询库存信息失败 ", inventoryQueryRet);
            }
        } else if (queryBackMaterialData.ret == 0 && queryBackMaterialData.fieldValues.length != 1) {
            TraceInfo("查询物料编码对应的线边仓库存数据失败-----个数不对，个数是", queryBackMaterialData.fieldValues.length);
        } else {
            TraceInfo("查询线边仓库存数据失败 updataret", updataret);
        }
    }

}
// 导出函数
module.exports = {
    main: main,
    scheduleQuery: scheduleQuery,
};
