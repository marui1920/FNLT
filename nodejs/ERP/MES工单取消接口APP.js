class App {
    onCreate() {
        /** create script entry */
        TraceInfo("MES工单取消接口APP部署成功");
        const express = require("express");
        const bodyParser = require("body-parser"); //解析,用req.body获取post参数
        const app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: false
        }));
        //注册路由
        app.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Methods", "PUT,GET,POST,DELETE,OPTIONS");
            res.header("Access-Control-Allow-Headers", "X-Requested-With");
            res.header("Access-Control-Allow-Headers", "Content-Type");
            res.header("Access-Control-Allow-Headers", "*");
            res.header("Access-Control-Allow-Credentials", "true");
            if (req.method === "OPTIONS") {
                res.sendStatus(200);
            } else {
                next();
            }
        });
        app.post("/cancelMES_order", function (req, res) {
            TraceInfo("cancelMES_order接口开始接收前端数据", "");
            const params = req.body.InParam.data;
            TraceInfo("", params);
            TraceInfo("", JSON.stringify(params));
            //定义输出参数
            var obj = {};
            //接口参数校验
            if (params[0].order_no === "") {
                TraceInfo("工单号为空");
                obj = {
                    "errorcode": 1,
                    "message": "接口参数校验失败，工单号不能为空"
                };
                //传送HTTP响应
                res.send(obj);
            } else {
                //上传erp相关数据
                processdata(params, (res1) => {
                    TraceInfo("res1:", res1);
                    res.send(res1);
                })
                // var res1 = processdata(params).then((res1) => {
                // TraceInfo("res1:", res1); 
                //     res.send(res1);

                // processdata(params).then((res1) => {
                //     TraceInfo("res1:",res1);
                //     if (res1 === 0) {
                //         //上传成功后更改工单是否上传erp成员状态，更改订单中已制单数量
                //         var res2 = setData(params);
                //         TraceInfo("res2:",res2);
                //         if (res2 === 0) {
                //             obj = {
                //                 "errorcode": 0,
                //                 "message": "MES取消工单成功"
                //             };
                //             res.send(obj);
                //         } else if (res2 === 1) {
                //             obj = {
                //                 "errorcode": 1,
                //                 "message": "MES取消工单失败"
                //             };
                //             res.send(obj);
                //         }

                //     } else if (res1 === 1) {
                //         obj = {
                //             "errorcode": 1,
                //             "message": "MES取消工单失败"
                //         };
                //         //传送HTTP响应
                //         res.send(obj);
                //     }

                // })
            }
        });
        //声明异步方法，调用erp工单取消接口发送数据
        function processdata(inparams, callback) {
            //var http = require("http");
            var request = require('request');
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
            var jobNo = inparams[0].order_no;
            var paramsData = {
                "method": "cancelSOData",
                "client_customerid": "MES",
                "client_db": "MES",
                "messageid": "SOCF",
                "sign": "",
                "timestamp": `${currentdate}`,
                "apptoken": "80AC1A3F-F949-492C-A024-7044B28C8025",
                "appkey": "test",
                "appSecret": "123456",
                "data": `{
                    "xmldata": {
                        "data": {
                            "orderinfo": {
                                "OrderNo": '${jobNo}', 
                                "OrderType": "SCDD", 
                                "CustomerID": "LBM",
                            }
                        }
                    }
                }`
            };
            var options = {
                'method': 'POST',
                'url': 'http://10.8.6.29:9003/ERPApi.aspx',
                'timeout': 30000,
                'headers': {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'apptoken': '80AC1A3F-F949-492C-A024-7044B28C8025',
                    'appkey': 'test',
                    'appSecret': '123456',
                    'method': 'confirmSOData',
                    'client_customerid': 'MES',
                    'client_db': 'MES',
                    'messageid': 'SOCF',
                    'sign': '',
                    'timestamp': `${currentdate}`
                },
                form: paramsData
            };
            TraceInfo('options:', options);
            request(options, function (error, response) {
                if (error) {
                    TraceInfo("error: ", error);
                } else {
                    //上传数据成功
                    var obj = {};
                    if (JSON.parse(response.body).Response.return.returnCode === "0000") {
                        TraceInfo("response.body: ", response.body);
                        TraceInfo('工单取消回传ERP成功');
                        setData(inparams).then((res2) => {
                            TraceInfo("res2:",res2);
                            if (res2 === 0) {
                                obj = {
                                    "errorcode": 0,
                                    "message": "MES取消工单成功"
                                };
                            } else if (res2 === 1) {
                                obj = {
                                    "errorcode": 1,
                                    "message": "MES取消工单失败"
                                };
                            }
                            TraceInfo("obj: ", obj);
                            callback(obj);
                            //return obj;                            
                        })
                    } else {
                        TraceInfo("response.body: ", response.body);
                        TraceInfo('工单取消回传ERP失败');
                        obj = {
                            "errorcode": 1,
                            "message": "MES取消工单失败"
                        };
                        callback(obj);
                        //return obj;
                    }
                }
            });
            // var opt = {
            //     hostname: '10.8.6.179',
            //     port: '9002',
            //     path: '/ERPApi.aspx',
            //     method: 'POST',
            //     //rejectUnauthorized: false,
            //     headers: {
            //         'Content-Type': 'application/x-www-form-urlencoded',
            //         'apptoken': '80AC1A3F-F949-492C-A024-7044B28C8025',
            //         'appkey': 'test',
            //         'appSecret': '123456',
            //         'method': 'confirmSOData',
            //         'client_customerid': 'MES',
            //         'client_db': 'MES',
            //         'messageid': 'SOCF',
            //         'sign': '',
            //         'timestamp': `${currentdate}`
            //     }
            // }
            // TraceInfo("", paramsData);
            // TraceInfo("", opt);
            // var body = '';
            // var req = http.request(opt, function (res) {
            //     TraceInfo("response: ", JSON.stringify(res.statusCode));
            //     res.on('data', function (data) {
            //         body += data;
            //     }).on('end', async function () {
            //         TraceInfo('body:', body);
            //         TraceInfo('parse:body:', JSON.parse(body));
            //         //下发数据成功
            //         if (JSON.parse(body).Response.return.returnCode === "0000") {
            //             TraceInfo('工单取消回传ERP成功');
            //             return 0;
            //         } else {
            //             TraceInfo('工单取消回传ERP成功');
            //             return 1;
            //         }
            //     });
            // }).on('error', function (e) {
            //     TraceInfo("error: ", JSON.stringify(e.message));
            // })
            // req.write(paramsData);
            // req.end();
        }
        //声明异步方法，上传成功后更改工单是否上传erp成员状态，更改订单中已制单数量
        async function setData(inparams) {
            var order_no = inparams[0].order_no; //工单号
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hour = date.getHours();
            const minute = date.getMinutes();
            const second = date.getSeconds();
            const millisecond = date.getMilliseconds();
            var objectID = "87960930222082";
            //1：ERP订单号，2：MES工单号，31：工单重量
            var fieldIDs = [1, 2, 31, 257];
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
            var filter = `(f2=="${order_no}")&&(f30=="已上传")`; //筛选未上传ERP且已审核工单
            var timeRelation = 1; //数据结束时间在查询时间范围内        
            //计划库工单管理生产查询
            var res = await PlanQueryThingRecord(objectID, startTime, endTime, timeRelation, filter, fieldIDs);
            if (!res.ret && res.dataSets.length !== 0) {
                var dataSets = res.dataSets;
                var order_erp = dataSets[0].values[0].stringValue; //订单号
                var weight = dataSets[0].values[2].stringValue; //批次重量
                var recordID = dataSets[0].values[3].uint64Value; //dataid
                var recordValues = [{
                    "keyValueList": [ //记录1
                        {
                            "key": 30,
                            "value": {
                                stringValue: "已取消"
                            }, //1为温度
                        }
                    ]
                }];
                var recordIDs = [];
                recordIDs.push(recordID);
                TraceInfo("recordIDs:", recordIDs);
                TraceInfo("recordValues:", recordValues);
                ////更新计划库工单管理生产
                var res1 = await PlanUpdateThingRecord(objectID, recordIDs, recordValues);
                if (!res1.ret) {
                    //计划库订单管理查询
                    var objectID1 = "87960930222081";
                    //1：ERP订单号，5：已制单
                    var fieldIDs1 = [1, 5, 257];
                    var filter1 = `(f1=="${order_erp }")&&(f17=="否")`; //筛选未上传ERP且已审核工单
                    var res2 = await PlanQueryThingRecord(objectID1, startTime, endTime, timeRelation, filter1, fieldIDs1);
                    if (!res2.ret && res2.dataSets.length !== 0) {
                        var dataSets1 = res2.dataSets;
                        var weight_before = dataSets1[0].values[1].stringValue; //已制单重量
                        var recordID1 = dataSets1[0].values[2].uint64Value; //dataid
                        var weight_after = Number(weight_before) - Number(weight);
                        var recordValues1 = [{
                            "keyValueList": [ //记录1
                                {
                                    "key": 5,
                                    "value": {
                                        stringValue: String(weight_after)
                                    }, //1为温度
                                }
                            ]
                        }];
                        var recordIDs1 = [];
                        recordIDs1.push(recordID1);
                        TraceInfo("recordIDs1:", recordIDs1);
                        TraceInfo("recordValues1:", recordValues1);
                        ////更新计划库计划库订单管理查询
                        var res3 = await PlanUpdateThingRecord(objectID1, recordIDs1, recordValues1);
                        if (!res3.ret) {
                            return 0;
                        } else {
                            return 1;
                        }

                    }
                }
            }
        }
        //绑定和侦听指定主机和端口上的连接
        var server = app.listen(30011, "10.18.6.19", function () {
            var host = server.address().address;
            var port = server.address().port;
            console.log("地址为 http://%s:%s", host, port);
        });
    }

    onDestroy() {
        /** destroy script entry */
        TraceInfo("MES工单取消接口APP取消部署成功");
    }
}

module.exports = App