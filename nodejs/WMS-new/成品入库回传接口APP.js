class App {
    onCreate(appGuid) {
        /** create script entry */
        TraceInfo("成品入库回传接口APP部署成功");
        const express = require("express");
        const bodyParser = require("body-parser"); //解析,用req.body获取post参数
        const app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: false
        }));
        TraceInfo("开始请求");
        app.post("/getWMS_CPRK", function (req, res) {
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
                var warehouseId = InParam.data.orderinfo[0].warehouseId;
                var wmsNo = InParam.data.orderinfo[0].wmsNo;
                var orderNo = InParam.data.orderinfo[0].orderNo;
                var customerId = InParam.data.orderinfo[0].customerId;
                var orderType = InParam.data.orderinfo[0].orderType;
                var receivedTime = InParam.data.orderinfo[0].receivedTime;
                var a = InParam.data.orderinfo[0].details;
                if (a.length !== 0) {
                    TraceInfo("a.length", a.length);
                    var recordValues = [];
                    var data_obj = {};
                    for (var i = 0; i < a.length; i++) {
                        var lineNo = a[i].lineNo;
                        var sku = a[i].sku;
                        var receivedQty = a[i].receivedQty;
                        var lotAtt01 = a[i].lotAtt01;
                        var lotAtt03 = a[i].lotAtt03;
                        var lotAtt04 = a[i].lotAtt04;
                        var lotAtt05 = a[i].lotAtt05;
                        var lotAtt06 = a[i].lotAtt06;
                        var lotAtt07 = a[i].lotAtt07;
                        var lotAtt08 = a[i].lotAtt08;
                        var userDefine1 = a[i].userDefine1;
                        var userDefine2 = a[i].userDefine2;
                        var objectID = "54975581631802";
                        data_obj = {};
                        data_obj = {
                            "keyValueList": [
                                {
                                    "key": 4,
                                    "value": { stringValue: warehouseId },//4-仓库ID
                                },
                                {
                                    "key": 5,
                                    "value": { stringValue: wmsNo }, //wms订单号

                                },
                                {
                                    "key": 6,
                                    "value": { stringValue: orderNo } //mes订单号

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
                                    "value": { stringValue: receivedTime } //收货时间

                                },
                                {
                                    "key": 10,
                                    "value": { stringValue: lineNo } //MES订单行号

                                },
                                {
                                    "key": 11,
                                    "value": { stringValue: sku } //产品编号

                                },
                                {
                                    "key": 12,
                                    "value": { stringValue: receivedQty } //实收数量

                                },
                                {
                                    "key": 13,
                                    "value": { stringValue: lotAtt01 } //生产日期

                                },
                                {
                                    "key": 14,
                                    "value": { stringValue: lotAtt03 } //入库日期

                                },
                                {
                                    "key": 15,
                                    "value": { stringValue: lotAtt04 } //产品批号

                                },
                                {
                                    "key": 16,
                                    "value": { stringValue: lotAtt05 } //erp组织

                                },
                                {
                                    "key": 17,
                                    "value": { stringValue: lotAtt06 } //erp仓库

                                },
                                {
                                    "key": 18,
                                    "value": { stringValue: lotAtt07 } //erp货主

                                },
                                {
                                    "key": 19,
                                    "value": { stringValue: lotAtt08 } //质量状态

                                },
                                {
                                    "key": 20,
                                    "value": { stringValue: userDefine1 } //erp货主类型

                                },
                                {
                                    "key": 21,
                                    "value": { stringValue: userDefine2 } //收货桶号

                                },
                                {
                                    "key": 22,
                                    "value": { stringValue: "未上传" } //是否上传ERP

                                },
                                {
                                    "key": 23,
                                    "value": { stringValue: "未上传" } //质检是否上传WMS

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
                        recordValues.push(data_obj);
                    }
                    TraceInfo("objectID:", objectID);
                    TraceInfo("recordValues:", recordValues);
                    SetData(objectID, recordValues).then(res => { TraceInfo("res:", res); });
                }
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
            }
        });
        //绑定和侦听指定主机和端口上的连接
        var server = app.listen(30016, "10.18.6.19", function () {
            var host = server.address().address;
            var port = server.address().port;
            TraceInfo("地址为 http://%s:%s", host, port);
        });
        //声明函数，历史库"成品入库回传"添加记录
        async function SetData(objectID1, recordValues1) {
            TraceInfo("开始写入历史库数据");
            var returndata = await HistoryAddThingRecord(objectID1, recordValues1).then(function (res) {
                if (!res.ret) {
                    //业务处理
                    TraceInfo("res:", res)
                    return res;
                }
            });
            return returndata;
        }
    }
    onDestroy() {
        /** destroy script entry */
        TraceInfo("成品入库回传接口APP取消部署");
    }
}
module.exports = App