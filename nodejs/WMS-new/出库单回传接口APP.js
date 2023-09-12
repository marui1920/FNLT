class App {
    onCreate(appGuid) {
        /** create script entry */
        TraceInfo("领料单回传接口APP部署成功");
        const express = require("express");
        const bodyParser = require("body-parser"); //解析,用req.body获取post参数
        const app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: false
        }));
        app.post("/getWMS_LLCK", function (req, res) {
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hour = date.getHours();
            const minute = date.getMinutes();
            const second = date.getSeconds();
            const millisecond = date.getMilliseconds();
            const InParam = req.body.InParam;
            const Param = InParam.data;
            TraceInfo("Param", Param);
            TraceInfo("Param", JSON.stringify(Param));
            var return_obj = {};
            if (InParam === null || InParam === "" || JSON.stringify(InParam) === "{}") {
                TraceInfo("为空");
                return_obj = {
                    "Response": {
                        "return": {
                            "returnCode": "0001",
                            "returnDesc": "传入数据为空",
                            "returnFlag": "0"
                        }
                    }
                }
                //传送HTTP响应
                res.send(return_obj); //把数据返回
            }
            else {
                TraceInfo("不为空");
                var ParamS =JSON.stringify(Param)
                TraceInfo("ParamS", ParamS);
                if (ParamS.length > 0) {
                    var a = InParam.data.orderinfo; //接收第三方传入的参数
                    TraceInfo("a", a);
                    if (a.length !== 0) {
                        TraceInfo("a.length:", a.length);
                        var warehouseId = a[0].warehouseId;
                        var wmsOrderNo = a[0].wmsOrderNo;
                        var docNo = a[0].docNo;
                        var customerId = a[0].customerId;
                        var orderType = a[0].orderType;
                        var shippedTime = a[0].shippedTime;
                        //数据写入"领料单回传"对象
                        var data_arr = [];
                        var data_obj = {};                           
                        for (let k = 0; k < a[0].details.length; k++) {
                            TraceInfo("当前K=   ", k);
                            var referenceNo = a[0].details[k].referenceNo;
                            var lineNo = a[0].details[k].lineNo;
                            var sku = a[0].details[k].sku;
                            var qtyShipped = a[0].details[k].qtyShipped;
                            var lotAtt04 = a[0].details[k].lotAtt04;
                            var lotAtt05 = a[0].details[k].lotAtt05;
                            var lotAtt06 = a[0].details[k].lotAtt06;
                            var lotAtt07 = a[0].details[k].lotAtt07;
                            var lotAtt08 = a[0].details[k].lotAtt08;                               
                            data_obj = {}; 
                            var  data_obj = {
                                "keyValueList": [
                                    {
                                        "key": 4,
                                        "value": { stringValue: warehouseId },//4-仓库ID
                                    },
                                    {
                                        "key": 5,
                                        "value": { stringValue: wmsOrderNo }, //wms订单号

                                    },
                                    {
                                        "key": 6,
                                        "value": { stringValue: docNo } //mes订单号

                                    },
                                    {
                                        "key": 7,
                                        "value": { stringValue: customerId } //货主ID

                                    },
                                    {
                                        "key": 8,
                                        "value": { stringValue: orderType } //订单类型

                                    },
                                    {
                                        "key": 9,
                                        "value": { stringValue: shippedTime } //收货时间

                                    },
                                    {
                                        "key": 10,
                                        "value": { stringValue: referenceNo } //上游来源备注号

                                    },
                                    {
                                        "key": 11,
                                        "value": { stringValue: lineNo } //MES 订单行号

                                    },
                                    {
                                        "key": 12,
                                        "value": { stringValue: sku } // 产品编号

                                    },
                                    {
                                        "key": 13,
                                        "value": { stringValue: qtyShipped } // 实收数量

                                    },
                                    {
                                        "key": 14,
                                        "value": { stringValue: lotAtt04 } // 产品批号

                                    },
                                    {
                                        "key": 15,
                                        "value": { stringValue: lotAtt05 } //erp组织

                                    },
                                    {
                                        "key": 16,
                                        "value": { stringValue: lotAtt06 } //erp仓库

                                    },
                                    {
                                        "key": 17,
                                        "value": { stringValue: lotAtt07 } //erp货主

                                    },
                                    {
                                        "key": 18,
                                        "value": { stringValue: lotAtt08 } //质量状态

                                    },
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
                                        }//开始时间
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
                                        } //结束时间                               
                                    }
                                ]
                            } 
                            data_arr.push(data_obj);                              
                        }
                        var recordValues = data_arr;
                        //TraceInfo("objectID:", objectID);
                        TraceInfo("recordValues:", recordValues);
                        //数据写入领料单回传对象
                        SetData(recordValues).then(res1 => { 
                            TraceInfo("res1:", res1);
                            return_obj = {
                                "Response": {
                                    "return": {
                                        "returnCode": "0000",
                                        "returnDesc": "ok",
                                        "returnFlag": "1"
                                    }
                                }
                            }
                            //传送HTTP响应
                            res.send(return_obj); //把数据返回
                            TraceInfo("send成功");                              
                            //出库单类型为领料出库-非罐区时，调用方法，数据合并返回新数组
                            if (orderType === "LLCK-FGQ") {
                                var newArray = handelData(a[0].details); 
                                //调用方法，领料数据写入"线边仓物料统计"对象
                                linedataSet(newArray);                                  
                            }                             
                        });                                                   
                    }
                }
                else {
                     TraceInfo("Param为空");
                }

            }
        });
        //自定义函数，数据写入线边仓
        async function linedataSet(newArray) {
            TraceInfo("newArray:", newArray);
            for (let j = 0; j < newArray.length; j++) {
                var date = new Date();
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                var hour = date.getHours();
                var minute = date.getMinutes();
                var second = date.getSeconds();
                var millisecond = date.getMilliseconds(); 
                //查询线边仓库存
                var objectID = "3603812087758862849";
                //2：物料代码，3:物料批次，4：重量，5：库存位置（存物料编码）
                var fieldIDs = [2, 3, 4, 5, 257];
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
                //var filter = `(f19=="0")&&(f4=="${materialcode1}")`;
                //f5库存位置，存物料编码；f3物料批次
                var filter = `(f5=="${newArray[j].sku}")&&(f3=="${newArray[j].lotAtt04}")`;
                TraceInfo("filter:",filter);
                var timeRelation = 1; //数据结束时间在查询时间范围内                                       
                var res1 = await PlanQueryThingRecord(objectID, startTime, endTime, timeRelation, filter, fieldIDs);
                if (!res1.ret) {
                    TraceInfo("线边仓查询成功", res1.ret);
                    //业务处理
                    var dataSets1 = res1.dataSets;
                    var lens1 = dataSets1.length;
                    TraceInfo("dataSets1:", dataSets1);
                    if (lens1 !== 0) {
                        //有数据，更新
                        TraceInfo("有数据");
                        var dataID = dataSets1[0].values[4].uint64Value;
                        //重量
                        var weight = dataSets1[0].values[2].stringValue;
                        var weight_after = String(Number(weight) + Number(newArray[j].qtyShipped));
                        TraceInfo("weight:", weight);
                        TraceInfo("weight_after:", weight_after);
                        var recordIDs = [];
                        recordIDs.push(dataID);
                        var recordValues = [
                            {
                                "keyValueList": [//记录1
                                    {
                                        "key": 4,
                                        "value": { stringValue: weight_after },//4为重量
                                    }
                                ]
                            }
                        ];
                        TraceInfo("recordValues:", recordValues);
                        var res2 = await PlanUpdateThingRecord(objectID, recordIDs, recordValues);
                        if (!res2.ret) { 
                            TraceInfo("线边仓数据更新成功！");
                        } else {
                            TraceInfo("线边仓数据更新失败，错误码：", res2.ret);
                        }
                    } else if (lens1 === 0) {
                        //无数据，写入
                        TraceInfo("无数据");
                        //查询bom信息展示
                        var objectID11 = "87960930222083";
                        var filter11 = `(f10=="${newArray[j].sku}")`;
                        //10：子项物料代码，11:子项物料名称，18：物料代码
                        var fieldIDs11 = [10, 11, 18];
                        var res3 = await PlanQueryThingRecord(objectID11, startTime, endTime, timeRelation, filter11, fieldIDs11);
                        if (!res3.ret) {
                            TraceInfo("查询bom成功", res3.ret);
                            var dataSets3 = res3.dataSets;
                            var lens3 = dataSets3.length;
                            TraceInfo("dataSets3:", dataSets3);
                            var materialName;
                            var materialCode;
                            if (lens3 !== 0) {
                                materialName = dataSets3[0].values[1].stringValue;
                                materialCode = dataSets3[0].values[2].stringValue;
                            } else {
                                materialName = "";
                                materialCode = "";
                            }
                            var quality_sta = "";
                            if (newArray[j].lotAtt08 === "0") {
                                quality_sta = "良品";
                            } else if (newArray[j].lotAtt08 === "1") {
                                quality_sta = "待检品";
                            } else if (newArray[j].lotAtt08 === "2") {
                                quality_sta = "不良品";
                            } else if (newArray[j].lotAtt08 === "3") {
                                quality_sta = "出库良品";
                            } else {
                                quality_sta = "";
                            }
                            var recordValues12 = [
                                {
                                    "keyValueList": [//记录1
                                        {
                                            "key": 1,
                                            "value": { stringValue: materialName },//1为物料名称
                                        },{
                                            "key": 2,
                                            "value": { stringValue: materialCode },//2为物料代码
                                        },{
                                            "key": 3,
                                            "value": { stringValue: newArray[j].lotAtt04 },//3为批次
                                        },{
                                            "key": 4,
                                            "value": { stringValue: newArray[j].qtyShipped },//4为重量
                                        },{
                                            "key": 5,
                                            "value": { stringValue: newArray[j].sku },//5为库存位置，存物料代码
                                        },{
                                            "key": 6,
                                            "value": { stringValue: "" },//6为供应商
                                        },{
                                            "key": 7,
                                            "value": { stringValue: intervalTime().dateTime },//7为入库时间
                                        },{
                                            "key": 8,
                                            "value": { stringValue: quality_sta },//8为质检状态
                                        },{
                                            "key": 9,
                                            "value": { stringValue: "正常" },//9为状态
                                        },{
                                            "key": 10,
                                            "value": { stringValue: "否" },//10为是否退料
                                        },{
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
                                        },{
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
                                        }
                                    ]
                                }
                            ];
                            var objectID12 = "3603812087758862849";
                            TraceInfo("recordValues12:", recordValues12);
                            var res4 = await PlanAddThingRecord(objectID12, recordValues12);
                            if (!res4.ret) {
                                TraceInfo("线边仓数据写入成功！",  res4);
                            } else {
                                TraceInfo("线边仓数据写入失败，错误码：", res4.ret);
                            }
                        } else {
                            TraceInfo("查询bom失败,错误码：", res3.ret);
                        }


                    }
                } else {
                    TraceInfo("线边仓查询失败，错误码：", res1.ret);
                }



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
        //定义方法，重组数组，将批次号和物料代码重复的数据合并，返回新数组
        function handelData(r) {
            if (!Array.isArray(r)) {
                return []
            } else {
                //const aMap = new Map();
                const arr = [];   
                r.forEach(item => {
                    const index = arr.findIndex(subItem => subItem.sku === item.sku && subItem.lotAtt04 === item.lotAtt04)
                    if (index > -1) {
                        //新数组包含对应成员,重量累加
                        arr[index].qtyShipped = Number(item.qtyShipped) + Number(arr[index].qtyShipped);
                    } else {
                        //新数组无对应成员
                        arr.push(item);
                    }
                })
                return arr;
            }
        }
        //绑定和侦听指定主机和端口上的连接
        var server = app.listen(30017, "10.18.6.19", function () {
            var host = server.address().address;
            var port = server.address().port;
            TraceInfo("地址为 http://%s:%s", host, port);
        });
        //声明函数，记录写入历史库对象“领料单回传”
        async function SetData(recordValues) {           
            TraceInfo("开始写入历史库对象“领料单回传”");
            var objectID = "54975581753801";
            var returndata = await HistoryAddThingRecord(objectID, recordValues).then(function (res) {
                if (!res.ret) {
                    //业务处理
                    return res;
                }
            });
            return returndata;
        }   
    }
    onDestroy() {
        /** destroy script entry */
        TraceInfo("领料单回传接口APP取消部署");
    }
}
module.exports = App