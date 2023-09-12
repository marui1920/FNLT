class App {
    onCreate() {
        /** create script entry */
        TraceInfo("ERP订单取消接口APP部署成功");
        const express = require("express");
        const bodyParser = require("body-parser"); //解析,用req.body获取post参数
        const app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: false
        }));
        app.use(bodyParser.json({
            limit: '100mb'
        }));
        app.use(bodyParser.urlencoded({
            limit: '100mb',
            extended: true
        }));
        app.post("/cancelERP_order", function (req, res) {
            TraceInfo("cancelERP_order接口开始接收数据:", "");
            const params = req.body.InParam.data;
            TraceInfo("", params);
            TraceInfo("", JSON.stringify(params));
            //定义输出参数
            var obj = {};
            //接口参数校验
            if (params[0].order_no === "") {
                TraceInfo("订单号为空");
                obj = {
                    "errorcode": 1,
                    "message": "接口参数校验失败，订单号不能为空"
                };
                //传送HTTP响应
                res.send(obj);
            } else {
                processdata(params).then((res1) => {
                    if (res1 === 0) {
                        obj = {
                            "errorcode": 0,
                            "message": "ERP取消订单成功"
                        };
                    } else if (res1 === "查询工单数据非空，不可以取消") {
                        obj = {
                            "errorcode": 1,
                            "message": "该订单已拆分工单并且已审核，不可以取消"
                        };
                    } else if (res1 === "MES未查找到对应订单") {
                        obj = {
                            "errorcode": 1,
                            "message": "MES系统未查找到对应订单"
                        };
                    } else {
                        obj = {
                            "errorcode": 1,
                            "message": "MES查询订单失败"
                        };
                    }
                    //传送HTTP响应
                    res.send(obj);
                });
            }
        });
        //声明异步方法，处理erp发送数据
        async function processdata(inparams) {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            var millisecond = date.getMilliseconds();
            for (let i = 0; i < inparams.length; i++) {
                var order_no = inparams[i].order_no; //订单号
                var objectID = "87960930222081";
                //1：订单编号, 17:是否取消
                var fieldIDs = [1, 17, 257];
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
                var filter = `(f1=="${order_no}")&&(f17=="否")`;
                var timeRelation = 1; //数据结束时间在查询时间范围内  
                var res = await PlanQueryThingRecord(objectID, startTime, endTime, timeRelation, filter, fieldIDs);
                if (!res.ret) {
                    //业务处理
                    TraceInfo("查询订单数据成功");
                    var dataSets = res.dataSets;
                    var lens = dataSets.length;
                    TraceInfo("dataSets:", dataSets);
                    if (lens !== 0) {
                        TraceInfo("查询订单数据非空");
                        //查询工单信息，已拆工单无法取消；
                        var objectID1 = "87960930222082";
                        var filter1 = `(f1=="${order_no}")&&(f14=="通过")`;
                        var fieldIDs1 = [1, 2, 257];
                        var res1 = await PlanQueryThingRecord(objectID1, startTime, endTime, timeRelation, filter1, fieldIDs1);
                        if (res1.dataSets.length === 0) {
                            TraceInfo("查询工单数据为空，可以取消");
                            var recordIDs = [];
                            recordIDs.push(dataSets[0].values[2].uint64Value);
                            var recordValues = [{
                                "keyValueList": [ //记录1
                                    {
                                        "key": 17,
                                        "value": {
                                            stringValue: "是"
                                        }, //是否取消
                                    }
                                ]
                            }];
                            var res2 = await PlanUpdateThingRecord(objectID, recordIDs, recordValues);
                            return res2.ret;
                        } else if (res1.dataSets.length !== 0) {
                            TraceInfo("查询工单数据非空，不可以取消");
                            return "查询工单数据非空，不可以取消";
                        }
                    } else {
                        TraceInfo("MES未查找到对于订单");
                        return "MES未查找到对应订单";
                    }
                } else {
                    TraceInfo("查询订单数据失败");
                    return "查询订单数据失败";
                }

            }

        }
        //绑定和侦听指定主机和端口上的连接
        var server = app.listen(30004, "10.18.6.19", function () {
            var host = server.address().address;
            var port = server.address().port;
            TraceInfo("地址为 http://%s:%s", host, port);
        });
    }
    onDestroy() {
        /** destroy script entry */

    }
}
module.exports = App