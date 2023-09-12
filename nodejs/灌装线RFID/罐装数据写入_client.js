class App {
    onCreate(appGuid) {
        /** create script entry */
        debugger;
        TraceInfo("灌装数据写入APP部署成功");
        const express = require("express");
        const bodyParser = require("body-parser"); //解析,用req.body获取post参数
        const app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: false
        }));
        //var recordValues = [];
        app.post("/RfidToMes", function (req, res) {
            TraceInfo("RfidToMes","");
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hour = date.getHours();
            const minute = date.getMinutes();
            const second = date.getSeconds();
            const millisecond = date.getMilliseconds();
            const params = req.body.InParam;
            console.log(params);
            TraceInfo("",params);
            TraceInfo("",JSON.stringify(params));
            const job_number = params.job_number; //批次号
            const filling_line = params.filling_line; //罐装线号
            const barrel_number = ((params.barrel_number).padStart(8,'B')).replace(/T/g, "A"); //桶编号
            const temperature = params.temperature; //温度
            const pressure = params.pressure; //压力
            const parameter_generation_time = params.parameter_generation_time; //温度压力产生时间
            //加入判断，区分是否为宁德的订单
            var objectID="87960930222082";
            var startTime = {
                    "year":year,
                    "month":1,     /// 1-12
                    "day":1,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                    "hour":0,         /// 0-23
                    "minute":0,       /// 0-59
                    "second":0,       /// 0-59
                    "millisecond":0
                    };
            var endTime = {
                    "year":year + 1,
                    "month":month,     /// 1-12
                    "day":day,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                    "hour":hour,        /// 0-23
                    "minute":minute,         /// 0-59
                    "second":second,       /// 0-59
                    "millisecond":millisecond
                    };
            var filter = `(f22=="宁德时代")||(f22=="宁德")&&(f2=="${job_number}")`; //例如2>10，表示第2个成员大于100
            var timeRelation = 1; //数据结束时间在查询时间范围内
            var fieldIDs = [2,22];
            //计划库查询
            PlanQueryThingRecord(objectID,startTime,endTime,timeRelation,filter,fieldIDs,function (res1) {
                if ( !res1.ret ) {
                    //业务处理
                    var dataSets = res1.dataSets;
                    var lens = dataSets.length;
                    TraceInfo("lens:",lens); 
                    var qualified;
                    var temperature1;
                    if (lens !== 0) {
                        qualified = parseFloat(temperature) + 1 <25.0 ? '合格' : '不合格';
                        temperature1 = temperature;
                    } else {
                        qualified = '合格';
                        temperature1 = '-9999'
                    }
                    var recordValues = [];
                    var data_obj = {};
                    var data_arr = [];
                    data_arr[0] = {
                        "key": 1,
                        "value": {
                            stringValue: job_number
                        }, //批次号
                    };
                    data_arr[1] = {
                        "key": 2,
                        "value": {
                            stringValue: filling_line
                        }, //灌装线
                    };
                    data_arr[2] = {
                        "key": 3,
                        "value": {
                            stringValue: barrel_number
                        }, //桶编号
                    };
                    data_arr[3] = {
                        "key": 4,
                        "value": {
                            stringValue: temperature1
                        }, //温度
                    };
                    data_arr[4] = {
                        "key": 5,
                        "value": {
                            stringValue: pressure
                        }, //压力
                    };
                    data_arr[5] = {
                        "key": 6,
                        "value": {
                            stringValue: parameter_generation_time
                        }, ////温度压力产生时间
                    };
                    data_arr[6] = {
                        "key": 7,
                        "value": {
                            stringValue: qualified
                        }, //温度是否合格
                    };
                    data_arr[7] = {
                        "key": 8,
                        "value": {
                            stringValue: ""
                        }, //毛重
                    };     
                    data_arr[8] = {
                        "key": 9,
                        "value": {
                            stringValue: ""
                        }, //桶重
                    }; 
                    data_arr[9] = {
                        "key": 10,
                        "value": {
                            stringValue: ""
                        }, //净重
                    }; 
                    data_arr[10] = {
                        "key": 11,
                        "value": {
                            stringValue: ""
                        }, //桶重是否合格
                    };  
                    data_arr[11] = {
                        "key": 12,
                        "value": {
                            stringValue: "待检"
                        }, //质检状态，待检，已下发，质检合格/不合格
                    };   
                    data_arr[12] = {
                        "key": 13,
                        "value": {
                            stringValue: "待入库"
                        }, //入库状态，待入库，已下发，已入库
                    };         
                    data_obj.keyValueList = data_arr;
                    recordValues.push(data_obj);
                    var obj = {};
                    var objectID1 = "3603183167776751618";  
                    TraceInfo("recordValues:",recordValues); 
                    RealtimeAddThingRecord(objectID1,recordValues,function (res2) {
                        if ( !res2.ret ) {
                            //业务处理
                            TraceInfo("添加数据成功");
                            obj = {
                                "res": "MES接收数据成功"
                            };
                            //传送HTTP响应
                            res.send(obj); //把数据返回
                        } else {
                            //业务处理
                            TraceInfo("添加数据失败");
                            obj = {
                                "res": "MES接收数据失败"
                            };
                            //传送HTTP响应
                            res.send(obj); //把数据返回
                        }
                        
                    });                     
                }
            })
        });
        //绑定和侦听指定主机和端口上的连接
        var server = app.listen(30007, "10.18.6.19", function () {
            var host = server.address().address;
            var port = server.address().port;
            console.log("地址为 http://%s:%s", host, port);
        });
    }
    onDestroy() {
        /** destroy script entry */
        TraceInfo("灌装数据写入APP取消部署");
    }
}
module.exports = App