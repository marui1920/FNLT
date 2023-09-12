/*
 * 定时执行某些脚本
 */
function main() {
    TraceInfo("------main 函数执行操作---------");
    var http = require("http"); //引入http模块
    GetData().then(returndataManage => {
        if (JSON.stringify(returndataManage) !== '{}') {
            TraceInfo("执行GetData", returndataManage);
            var targetdata = returndataManage.sendData;
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
                    if (JSON.parse(body).Response.return.returnCode === "0000" || JSON.parse(body).Response.return.returnCode === "ED0342") {  //此处ED0342为测试，正式版请删除
                        TraceInfo('返回正确，准备执行SetData:');
                        SetData(returndataManage.docNo, returndataManage.barrel_number, returndataManage.job_number, returndataManage.material_num, returndataManage.recordID).then();
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
        //  else{
        //     TraceInfo("函数执行前");
        //  }       
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
async function GetData() {
    TraceInfo("GetData执行前"); 
    var return_data = {}; //定义返回对象
    var objectID = "3603183167776751618";
    var fieldIDs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 257];
    var filter = `(f13 ==\"待入库\")&&(f8!="")&&(f9!="")&&(f10!="")`;//3zhong,
    var returndata = await RealtimeQueryThingRecord(objectID, fieldIDs, filter)
    //TraceInfo("returndata", returndata);
    TraceInfo("length", returndata.fieldValues.length);
    if (returndata.ret == 0 && returndata.fieldValues.length > 0) {
        //业务处理
        TraceInfo("查询合格待入库的数据成功");
        var dataSets = returndata.fieldValues;
        TraceInfo("dataSets", dataSets);
        //用灌装中的批次号 （job_number）,查询生产工单中的信息 
        var filldataIDs = returndata.fieldValues[0].values[14].uint64Value;//数据ID
        TraceInfo("filldataIDs", filldataIDs);
        var qualityStatus  = returndata.fieldValues[0].values[11].stringValue;//合格 f12
        TraceInfo("qualityStatus", qualityStatus);
        var job_number = returndata.fieldValues[0].values[0].stringValue;
        TraceInfo("job_number", job_number);
        //这里需要判断 是抽检还是全检 ，如果是全检，那就正常继续，如果是抽检需要查询本批次是否有合格的 （是否已检），来决定是否下发
        var objectIDManage = "87960930222082";
        var fieldIDsManage = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 29, 257];
        var filterManage = `f2 ==\"${job_number}\"`; //用工单查 质检类型 `f29 == \"抽检\"`//hege 
        var startTime = {
            "year": 2020,
            "month": 1,     /// 1-12
            "day": 1,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
            "hour": 8,         /// 0-23
            "minute": 0,       /// 0-59
            "second": 0,       /// 0-59
            "millisecond": 0
        };
        var endTime = {
            "year": 2030,
            "month": 1,     /// 1-12
            "day": 1,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
            "hour": 8,         /// 0-23
            "minute": 0,       /// 0-59
            "second": 0,       /// 0-59
            "millisecond": 0
        };
        var timeRelation = 1;//数据结束时间在查询时间范围内
        //TraceInfo("输入信息-------------",objectIDManage, startTime, endTime, timeRelation,filterManage,fieldIDsManage);
        var returndataManage = await PlanQueryThingRecord(objectIDManage, startTime, endTime, timeRelation, filterManage, fieldIDsManage);
        if (returndataManage.ret == 0 && returndataManage.dataSets.length == 1) {
            //获取质检类型 判断
            var inspectiontype = returndataManage.dataSets[0].values[18].stringValue;
            TraceInfo("inspectiontype-------------", inspectiontype, "     ");
            //执行下发
            TraceInfo("开始执行下发---------------------------------------------------------------------------------------");
            TraceInfo("分别是returndataManage returndata:   ", returndataManage.dataSets.length, returndata.fieldValues.length);
            var dataSetsManage = returndataManage.dataSets;
            var dataSetsFill = returndata.fieldValues;
            TraceInfo("dataSetsManage", dataSetsManage);
            //TraceInfo("dataSetsFill", dataSetsFill);
            var org_code = "FT01";
            var batch_weight = returndataManage.dataSets[0].values[5].stringValue;// manage f6
            TraceInfo("batch_weight----", batch_weight);
            var product_model = returndataManage.dataSets[0].values[2].stringValue;// manage f3
            TraceInfo("product_model----", product_model);
            var production_time = returndataManage.dataSets[0].values[17].stringValue;;// manage f18
            TraceInfo("production_time----", production_time);
            material_num = returndataManage.dataSets[0].values[15].stringValue; //manage f16
            TraceInfo("material_num----", material_num);
            barrel_number = returndata.fieldValues[0].values[2].stringValue;//fill f3
            TraceInfo("barrel_number----", barrel_number);
            var gross_weight = returndata.fieldValues[0].values[7].stringValue;//fill f8
            TraceInfo("gross_weight----", gross_weight);
            var barrel_weight = returndata.fieldValues[0].values[8].stringValue;//fill f9
            TraceInfo("barrel_weight----", barrel_weight);
            // job_number = returndata.fieldValues[0].values[0].stringValue;//fill f10
            // TraceInfo("job_number----",job_number);
            var barrel_specifications = returndataManage.dataSets[0].values[14].stringValue;// manage f15
            TraceInfo("barrel_specifications----", barrel_specifications);
            recordID = returndata.fieldValues[0].values[14].uint64Value;// 数据ID
            TraceInfo("recordID----", recordID);
            var date = new Date();
            var seperator1 = "-";
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
            var currentdate1 = year + seperator1 + month + seperator1 + strDate + " " + hour + ":" + minutes + ":" + seconds;
            var timeString = year + month + strDate + hour + minutes + seconds;
            TraceInfo("currentdate1----", currentdate1);
            var warehouseId = "CS01";
            var customerId = "FNLT";
            var asnType = "SCRK";
            //var docNo ;
            var docNo = 'SCRK-' + timeString;
            var asnReferenceA = 'SCRK-' + timeString;
            var asnCreationTime = currentdate1;
            var supplierId = "2";
            var supplierName = "二期生产车间";
            var hedi09 = batch_weight;
            var lineNo = "1";
            var sku = product_model;
            var expectedQty = barrel_specifications;
            var lotAtt01 = production_time;
            var lotAtt04 = job_number;
            var lotAtt05 = "FT01";
            var lotAtt06 = "010501";
            var lotAtt07 = "FT01";
            var lotAtt08 = "0";
            var lotAtt09 = material_num;
            var lotAtt10 = barrel_weight;
            var containerid = barrel_number;
            var dedi04 = barrel_specifications;
            TraceInfo("信息----", warehouseId, customerId, asnType, docNo, asnReferenceA, asnCreationTime, supplierId, supplierName, hedi09, sku, expectedQty, lotAtt01, lotAtt09, lotAtt10, containerid);
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
                        "supplierName": supplierName,
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
                        "details": [{
                            "referenceNo": "",
                            "lineNo": "1",
                            "sku": sku,
                            "expectedQty": expectedQty,
                            "totalPrice": "",
                            "lotAtt01": lotAtt01,
                            "lotAtt02": "",
                            "lotAtt03": "",
                            "lotAtt04": lotAtt04,
                            "lotAtt05": lotAtt05,
                            "lotAtt06": lotAtt06,
                            "lotAtt07": lotAtt07,
                            "lotAtt08": lotAtt08,
                            "lotAtt09": lotAtt09,
                            "lotAtt10": lotAtt10,
                            "lotAtt11": "",
                            "containerid": containerid,
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
                            "dedi04": dedi04,
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
                            "userDefine3": "",
                            "userDefine4": "",
                            "userDefine5": "",
                            "userDefine6": "",
                            "notes": ""
                        }]
                    }]
                }
            })
            TraceInfo("paramsData ", paramsData);
            return_data.sendData = paramsData;
            return_data.docNo = docNo;
            return_data.barrel_number = barrel_number;
            return_data.job_number = job_number;
            return_data.material_num = material_num;
            return_data.recordID = recordID;
            return return_data;           
        }
        else if (returndataManage.ret == 0 && returndataManage.dataSets.length == 0) {
            TraceInfo("查询工单管理的数据成功但是没有数据 ", returndataManage);
            return {};
        }
        else {
            TraceInfo("查询工单管理的数据失败");
            return {};
        }       
    } else if (returndata.ret == 0 && returndata.fieldValues.length == 0) {
        TraceInfo("查询灌装数据成功但是没有数据 ", returndata);
        return {};
    } else {
        TraceInfo("查询合格待检的数据失败");
        return {};
    }
}
async function SetData(docNo, barrel_number, job_number, material_num, recordID) {
    //存数据 历史库  生产入库记录 HistoryAddThingRecord(objectID,recordValues,callback);
    var ordIntoBank = "3603497627432257915";
    TraceInfo("docNo(生产入库记录) ", docNo);
    TraceInfo("barrel_number(生产入库记录) ", barrel_number);
    TraceInfo("job_number(生产入库记录) ", job_number);
    TraceInfo("material_num(生产入库记录) ", material_num);
    var ordIntoBankrecordValues = [
        {
            "keyValueList": [//记录1
                {
                    "key": 1,
                    "value": { stringValue: docNo },//
                },
                {
                    "key": 2,
                    "value": { stringValue: barrel_number },//
                },
                {
                    "key": 3,
                    "value": { stringValue: job_number },//工单号
                },
                {
                    "key": 4,
                    "value": { stringValue: material_num },//产品型号
                },
                {
                    "key": 5,
                    "value": { stringValue: "" },//
                },
                {
                    "key": 6,
                    "value": { stringValue: "" },//
                },

                {
                    "key": 258,
                    "value": {
                        dateTimeValue: {
                            "year": 2023,
                            "month": 3,     /// 1-12
                            "day": 12,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                            "hour": 8,         /// 0-23
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
                            "year": 2023,
                            "month": 3,     /// 1-12
                            "day": 13,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                            "hour": 8,         /// 0-23
                            "minute": 0,       /// 0-59
                            "second": 0,       /// 0-59
                            "millisecond": 0
                        }
                    }, //结束时间

                },]
        },
    ];
    var res = await HistoryAddThingRecord(ordIntoBank, ordIntoBankrecordValues);
    if (!res.ret) {
        //业务处理
        TraceInfo("添加生产入库记录成功 ", res);
        
    } else {
        TraceInfo("添加生产入库记录失败 ", res);
    }
    var objectID = "3603183167776751618";
    var arrRecordID = [recordID];
    var arr = [];
    var obj = {};
    for (let i = 0; i < arrRecordID.length; i++) {
        obj = {};
        obj.keyValueList = [{ "key": 13, "value": { stringValue: "已入库" }, }];
        //arr.push(JSON.stringify(obj));
        arr.push(obj);
    }
    var recordValues = arr;
    TraceInfo("recordValues", recordValues);
    var updataret = await RealtimeUpdateThingRecord(objectID, arrRecordID, recordValues);
    if (!updataret.ret) {
        //业务处理
        TraceInfo("更新成功 updataret", updataret);
    } else {
        TraceInfo("更新数据失败 updataret", updataret);
    } 

}
// 导出函数
module.exports = {
    main: main,
    scheduleQuery: scheduleQuery,
};
