
function main() {
    TraceInfo("------main 函数执行操作---------");
    var http = require("http"); //引入http模块
    GetData().then(returndataManage => {
        if (JSON.stringify(returndataManage) !== '{}') {
            TraceInfo("执行GetData", returndataManage);
            var targetdata = returndataManage.sendData;
            TraceInfo("targetdata:", targetdata);
            var adr = '/datahubjson/FluxWmsJsonApi/?method=putSalesOrder&apptoken=24B42D970E5D3DFE2EEE47B5DC39F925&timestamp=2022-10-25 09:15:00&sign=FNLT&format=JSON';
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
                    if (JSON.parse(body).Response.return.returnCode === "0000" || JSON.parse(body).Response.return.returnCode === "ED0342") {  //此处ED0342为测试，正式版请删除
                        TraceInfo('WMS返回正确,准备执行SetData:');
                        SetData(returndataManage.dataIds).then();
                    } else {
                        TraceInfo("WMS返回错误,body: ", body);
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
    TraceInfo("GetData执行前");

    var objectID = "3603183167776751625";
    //var fieldIDs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 257];
    //5:物料需求单号;12:车间;
    var fieldIDs = [5, 12];
    var filter = `f9 == "未下发"`;
    var returndata = await RealtimeQueryThingRecord(objectID, fieldIDs, filter);
    TraceInfo("returndata", returndata);
    TraceInfo("length", returndata.fieldValues.length);
    if (returndata.ret === 0 && returndata.fieldValues.length > 0) {
        TraceInfo("查询未下发成功", returndata);
        var materialnumber = returndata.fieldValues[0].values[0].stringValue;
        TraceInfo("materialnumber----", materialnumber);
        var workshop = returndata.fieldValues[0].values[1].stringValue;
        TraceInfo("workshop----",workshop);
        var workshop_code = "";
        if (workshop === "一车间") {
            workshop_code = "1";
        } else if (workshop === "二车间") {
            workshop_code = "2";
        } else {
            workshop_code = ""
        }
        //6:物料编码；8:重量；
        var fieldIDs1 = [6, 8, 257];
        var filter1 = `(f9=="未下发")&&(f5=="${materialnumber}")&&((f7=="A")||(f7=="B")||(f7=="C")||(f7=="D")||(f7=="E"))`;
        var res1 = await RealtimeQueryThingRecord(objectID, fieldIDs1, filter1);
        //
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
        //
        var data_arr = [];
        var dataID_arr = [];
        var data_obj = {};
        var sum = 0; 
        var paramsData = '';
        //声明要返回的对象，包含dataid和要发送的数据
        var return_obj = {}             
        if (res1.ret === 0 && res1.fieldValues.length > 0) {
            //罐区
            for (let i = 0; i < res1.fieldValues.length; i++) {
                data_obj = {};
                var weight = res1.fieldValues[i].values[1].stringValue;// 
                TraceInfo("weight----", weight)
                sum += Number(weight);
                data_obj.lineNo = i + 1;
                data_obj.sku = res1.fieldValues[i].values[0].stringValue;;
                data_obj.qtyOrdered = weight;
                data_obj.lotAtt04 = '';
                data_obj.lotAtt05 = "FT01";
                data_obj.lotAtt06 = "W3";
                data_obj.lotAtt07 = "FT01";
                data_obj.lotAtt08 = '0';
                data_obj.dedi04 = weight;
                data_arr.push(data_obj);
                // var dataID = res1.fieldValues[i].values[2].uint64Value;
                // dataID_arr.push(dataID);
                dataID_arr.push(res1.fieldValues[i].values[2].uint64Value);
            }
            TraceInfo("data_arr----", data_arr);
            TraceInfo("dataID_arr----", dataID_arr);
            paramsData = JSON.stringify(
                {
                    "data": {
                        "header": [
                            {
                                "warehouseId": "CS01",
                                "customerId": "FNLT",
                                "orderType": "LLCK-GQ",
                                "docNo": materialnumber,
                                "soReferenceA": materialnumber,
                                "soReferenceB": "",
                                "soReferenceC": "",
                                "soReferenceD": "",
                                "priority": "",
                                "orderTime": currentdate,
                                "expectedShipmentTime1": "",
                                "requiredDeliveryTime": "",
                                "deliveryNo": "",
                                "consigneeId": "GG",
                                "consigneeName": "公共",
                                "consigneeContact": "",
                                "consigneeAddress1": "宁乡市金园路216 号",
                                "consigneeAddress2": "",
                                "consigneeAddress3": "",
                                "consigneeAddress4": "",
                                "consigneeCountry": "",
                                "consigneeProvince": "湖南省",
                                "consigneeCity": "长沙市",
                                "consigneeDistrict": "宁乡市",
                                "consigneeStreet": "",
                                "consigneeMail": "",
                                "consigneeTel1": "",
                                "consigneeTel2": "",
                                "consigneeZip": "",
                                "carrierId": "",
                                "carrierName": "",
                                "carrierFax": "",
                                "carrierMail": "",
                                "issuePartyId": workshop_code,
                                "issuePartyName": "",
                                "issuePartyAddress1": "",
                                "issuePartyAddress2": "",
                                "issuePartyAddress3": "",
                                "issuePartyAddress4": "",
                                "channel": "",
                                "shop": "",
                                "billingId": "",
                                "billingName": "",
                                "billingAddress1": "",
                                "billingAddress2": "",
                                "billingAddress3": "",
                                "billingAddress4": "",
                                "hedi01": "010101",
                                "hedi02": "",
                                "hedi03": "",
                                "hedi04": "",
                                "hedi05": "",
                                "hedi06": "",
                                "hedi07": "",
                                "hedi08": "",
                                "hedi09": String(sum),
                                "hedi10": "",
                                "invoicePrintFlag": "",
                                "route": "",
                                "stop": "",
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
                                "crossdockFlag": "N",
                                "details": data_arr,
                            }
                        ]
                    }
                })
            TraceInfo("paramsData ", paramsData);
            return_obj.dataIds = dataID_arr;
            return_obj.sendData = paramsData;
            return return_obj;
        } else if (res1.ret === 0 && res1.fieldValues.length === 0) {
            //非罐区
            //6:物料编码；8:重量；
            var fieldIDs2 = [6, 8, 257];
            var filter2 = `(f9=="未下发")&&(f5=="${materialnumber}")`;
            var res2 = await RealtimeQueryThingRecord(objectID, fieldIDs2, filter2);
            if (res2.ret === 0 && res2.fieldValues.length > 0) {
                for (let i = 0; i < res2.fieldValues.length; i++) {
                    data_obj = {};
                    var weight1 = res2.fieldValues[i].values[1].stringValue;// 
                    TraceInfo("weight1----", weight1)
                    sum += Number(weight1);
                    data_obj.lineNo = i + 1;
                    data_obj.sku = res2.fieldValues[i].values[0].stringValue;;
                    data_obj.qtyOrdered = weight1;
                    data_obj.lotAtt04 = '';
                    data_obj.lotAtt05 = "FT01";
                    data_obj.lotAtt06 = "W3";
                    data_obj.lotAtt07 = "FT01";
                    data_obj.lotAtt08 = '0';
                    data_obj.dedi04 = weight1;
                    data_arr.push(data_obj);
                    // var dataID1 = res2.fieldValues[i].values[2].uint64Value;
                    // dataID_arr.push(dataID1);
                    dataID_arr.push(res2.fieldValues[i].values[2].uint64Value);
                }
                TraceInfo("data_arr----", data_arr);
                TraceInfo("dataID_arr----", dataID_arr);
                paramsData = JSON.stringify(
                    {
                        "data": {
                            "header": [
                                {
                                    "warehouseId": "CS01",
                                    "customerId": "FNLT",
                                    "orderType": "LLCK-FGQ",
                                    "docNo": materialnumber,
                                    "soReferenceA": materialnumber,
                                    "soReferenceB": "",
                                    "soReferenceC": "",
                                    "soReferenceD": "",
                                    "priority": "",
                                    "orderTime": currentdate,
                                    "expectedShipmentTime1": "",
                                    "requiredDeliveryTime": "",
                                    "deliveryNo": "",
                                    "consigneeId": "GG",
                                    "consigneeName": "公共",
                                    "consigneeContact": "",
                                    "consigneeAddress1": "宁乡市金园路216 号",
                                    "consigneeAddress2": "",
                                    "consigneeAddress3": "",
                                    "consigneeAddress4": "",
                                    "consigneeCountry": "",
                                    "consigneeProvince": "湖南省",
                                    "consigneeCity": "长沙市",
                                    "consigneeDistrict": "宁乡市",
                                    "consigneeStreet": "",
                                    "consigneeMail": "",
                                    "consigneeTel1": "",
                                    "consigneeTel2": "",
                                    "consigneeZip": "",
                                    "carrierId": "",
                                    "carrierName": "",
                                    "carrierFax": "",
                                    "carrierMail": "",
                                    "issuePartyId": workshop_code,
                                    "issuePartyName": "",
                                    "issuePartyAddress1": "",
                                    "issuePartyAddress2": "",
                                    "issuePartyAddress3": "",
                                    "issuePartyAddress4": "",
                                    "channel": "",
                                    "shop": "",
                                    "billingId": "",
                                    "billingName": "",
                                    "billingAddress1": "",
                                    "billingAddress2": "",
                                    "billingAddress3": "",
                                    "billingAddress4": "",
                                    "hedi01": "010101",
                                    "hedi02": "",
                                    "hedi03": "",
                                    "hedi04": "",
                                    "hedi05": "",
                                    "hedi06": "",
                                    "hedi07": "",
                                    "hedi08": "",
                                    "hedi09": String(sum),
                                    "hedi10": "",
                                    "invoicePrintFlag": "",
                                    "route": "",
                                    "stop": "",
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
                                    "crossdockFlag": "N",
                                    "details": data_arr,
                                }
                            ]
                        }
                    })
                TraceInfo("paramsData ", paramsData);
                return_obj.dataIds = dataID_arr;
                return_obj.sendData = paramsData;
                return return_obj;
            }
        }
    }
    else if (returndata.ret == 0 && returndata.fieldValues.length == 0) {
        TraceInfo("查询数据成功但是没有数据 ", returndata);
        return {};
    }
    else {
        TraceInfo("查询数据失败", returndata);
        return {};
    }

}
async function SetData(recordIDs) {
    TraceInfo("开始修改下发成员值 ",);
    var objectID = "3603183167776751625";
    var recordValues = [];
    var obj = {};
    for (let i = 0; i < recordIDs.length; i++) {
        obj = {};
        obj.keyValueList = [{ "key": 9, "value": { stringValue: "已下发" }, }];
        recordValues.push(obj);
    }
    TraceInfo("recordValues", recordValues);
    //TraceInfo("输入信息-------",objectID,"、",recordIDs,"、",recordValues); 
    var res = await RealtimeUpdateThingRecord(objectID, recordIDs, recordValues);
    if (res.ret == 0) {
        //业务处理
        TraceInfo("更新成功:", res);
    } else {
        TraceInfo("更新数据失败:", res);
    }
}

// 导出函数
module.exports = {
    main: main,
    scheduleQuery: scheduleQuery,
};
