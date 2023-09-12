class App {
    onCreate(appGuid) {
        /** create script entry */
        debugger;
        TraceInfo("开始了");
        const express = require("express");
        const bodyParser = require("body-parser"); //解析,用req.body获取post参数
        //TraceInfo("express", "bodyParser", express, bodyParser);
        const app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: false
        }));
        TraceInfo("开始请求");
        app.post("/getWMS_CPCK", function (req, res) {
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
                //var ParamS = JSON.parse(Param);
                var ParamS =JSON.stringify(Param)
                TraceInfo("ParamS", ParamS);
                if (ParamS.length > 0) {
                    var a = InParam.data.orderinfo; //接收第三方传入的参数
                    TraceInfo("a", a);
                    if (a.length !== 0) {
                        TraceInfo("a.length", a.length);
                        for (var i = 0; i < a.length; i++) {
                             TraceInfo("当前I=   ", i);
                            // var request_no = Param[i].request_no; //请检编号
                            // var inspection_type = Param[i].inspection_type; //1.原料，2.包材，3.洗釜检，4.混合溶剂，5.半成品，6.成品，7.成品入库检，8.成品发货检
                            // var org_code = Param[i].org_code; //公司代码
                            // var sample_code = Param[i].sample_code; //物料编码
                            // var sample_name = Param[i].sample_name; //物料名称
                            // var batch_no = Param[i].batch_no; //生产批号
                            // var grade_Name = Param[i].grade_name; //样品判定，质检结果只能是合格或者不合格
                            // var gradeName_last = Param[i].gradename_last; //上次样品判定
                            // var flag = Param[i].flag; //回传次数，"0"; 
                            var warehouseId = a[i].warehouseId;
                            var wmsOrderNo = a[i].wmsOrderNo;
                            var docNo = a[i].docNo;
                            var customerId = a[i].customerId;
                            var orderType = a[i].orderType;
                            var shippedTime = a[i].shippedTime;
                            
                            for (var k = 0; k < a[i].details.length; k++) {
                            TraceInfo("当前K=   ", k);
                                var referenceNo = a[i].details[k].referenceNo;
                                var lineNo = a[i].details[k].lineNo;
                                var sku = a[i].details[k].sku;
                                var qtyShipped = a[i].details[k].qtyShipped;
                                var lotAtt04 = a[i].details[k].lotAtt04;
                                var lotAtt05 = a[i].details[k].lotAtt05;
                                var lotAtt06 = a[i].details[k].lotAtt06;
                                var lotAtt07 = a[i].details[k].lotAtt07;
                                var lotAtt08 = a[i].details[k].lotAtt08;

                                var objectID = "54975581753801";
                                TraceInfo("请求信息   ",warehouseId,);
                                var recordValues = [
                                    {
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
                                ];
                                TraceInfo("objectID:", objectID);
                                TraceInfo("recordValues:", recordValues);
                                SetData(objectID, recordValues).then(res => { TraceInfo("res:", res); });
                            }
                        }
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
                else {
                     TraceInfo("Param为空");
                }

            }
        });
        //绑定和侦听指定主机和端口上的连接
        var server = app.listen(30017, "172.16.24.205", function () {
            var host = server.address().address;
            var port = server.address().port;
            TraceInfo("地址为 http://%s:%s", host, port);
        });
        //声明函数，修改灌装数据为已下发 ，历史库写入数据
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
    }
}
module.exports = App