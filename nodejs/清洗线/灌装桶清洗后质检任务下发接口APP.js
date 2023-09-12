class App {
    onCreate(appGuid) {
        /** create script entry */
        TraceInfo("灌装桶清洗后质检任务下发接口APP部署成功");
        const express = require("express");
        const bodyParser = require("body-parser"); //解析,用req.body获取post参数
        const app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: false
        }));
        app.post("/getCleaningLine_QXSJ", function (req, res) {
            TraceInfo("getCleaningLine_QXSJ","");
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hour = date.getHours();
            const minute = date.getMinutes();
            const second = date.getSeconds();
            const millisecond = date.getMilliseconds();
            const params = req.body.InParam.data.details;
            TraceInfo("",params);
            TraceInfo("",JSON.stringify(params));
            var data_obj = {};
            var data_arr = [];
            var data_obj1 = {};
            var data_arr1 = [];  
            var data_obj2 = {};
            var data_arr2 = [];                       
            var recordValues = [];
            var recordValues1 = [];
            var recordValues2 = [];
            for (let i = 0; i < params.length; i++) {
                var bucketNo = params[i].bucketNo;//灌装桶号
                var bucketSpe = params[i].bucketSpe;//灌装桶规格（1000L/200L）
                var onlineTime = params[i].onlineTime;//上线时间
                var nb_EC = params[i].nb_EC;//内壁站_电导率
                var nb_pH = params[i].nb_pH;//内壁站_pH
                var nb_Result = params[i].nb_Result;//内壁清洗结果
                var nb_Time = params[i].nb_Time;//内壁站数据保存时间
                var zh_Number = params[i].zh_Number;//氮气置换次数
                var zh_Pressure = params[i].zh_Pressure;//负压值/kPa
                var zh_Pressure1 = params[i].zh_Pressure1;//最终保压值/kPa
                var zh_DewPoint = params[i].zh_DewPoint;//露点值/℃
                var zh_Result = params[i].zh_Result;//充氮气是否合格
                var zh_Time = params[i].zh_Time;//置换站数据保存时间
                var qx_Result = params[i].qx_Result;//清洗结果
                var userDefine1 = params[i].userDefine1; //用户自定义1
                var userDefine2 = params[i].userDefine2; //用户自定义2
                var userDefine3 = params[i].userDefine3; //用户自定义3
                var userDefine4 = params[i].userDefine4; //用户自定义4
                var userDefine5 = params[i].userDefine5; //用户自定义5
                var skuDM;
                if (bucketSpe === '1000L') {
                    skuDM = '02010001';
                } else if (bucketSpe === '200L') {
                    skuDM = '02010002';
                } else {
                    skuDM = '';
                }
                data_obj = {};
                data_arr = [];
                data_obj1 = {};
                data_arr1 = [];  
                data_obj2 = {};
                data_arr2 = [];                   
                //灌装桶清洗后质检任务下发数据
                data_arr[0] = {
                    "key": 1,
                    "value": {
                        stringValue: bucketNo
                    }, //灌装桶号
                };
                data_arr[1] = {
                    "key": 2,
                    "value": {
                        stringValue: bucketSpe
                    }, //灌装桶规格（1000L/200L）
                };
                data_arr[2] = {
                    "key": 3,
                    "value": {
                        stringValue: onlineTime
                    }, //上线时间  
                };
                data_arr[3] = {
                    "key": 4,
                    "value": {
                        stringValue: nb_EC
                    }, //内壁站_电导率
                };
                data_arr[4] = {
                    "key": 5,
                    "value": {
                        stringValue: nb_pH
                    }, //内壁站_pH
                };
                data_arr[5] = {
                    "key": 6,
                    "value": {
                        stringValue: nb_Result
                    }, //内壁清洗结果
                };
                data_arr[6] = {
                    "key": 7,
                    "value": {
                        stringValue: nb_Time
                    }, //内壁站数据保存时间
                };
                data_arr[7] = {
                    "key": 8,
                    "value": {
                        stringValue: zh_Number
                    }, //氮气置换次数
                };
                data_arr[8] = {
                    "key": 9,
                    "value": {
                        stringValue: zh_Pressure
                    }, //负压值/kPa
                };
                data_arr[9] = {
                    "key": 10,
                    "value": {
                        stringValue: zh_Pressure1
                    }, //最终保压值/kPa
                };
                data_arr[10] = {
                    "key": 11,
                    "value": {
                        stringValue: zh_DewPoint
                    }, //露点值/℃
                };
                data_arr[11] = {
                    "key": 12,
                    "value": {
                        stringValue: zh_Result
                    }, //充氮气是否合格
                };
                data_arr[12] = {
                    "key": 13,
                    "value": {
                        stringValue: zh_Time
                    }, //置换站数据保存时间
                }; 
                data_arr[13] = {
                    "key": 14,
                    "value": {
                        stringValue: qx_Result
                    }, //清洗结果
                }; 
                data_arr[14] = {
                    "key": 15,
                    "value": {
                        stringValue: userDefine1
                    }, //用户自定义1
                };
                data_arr[15] = {
                    "key": 16,
                    "value": {
                        stringValue: userDefine2
                    }, //用户自定义2
                }; 
                data_arr[16] = {
                    "key": 17,
                    "value": {
                        stringValue: userDefine3
                    }, //用户自定义3
                }; 
                data_arr[17] = {
                    "key": 18,
                    "value": {
                        stringValue: userDefine4
                    }, //用户自定义4
                }; 
                data_arr[18] = {
                    "key": 19,
                    "value": {
                        stringValue: userDefine5
                    }, //用户自定义5
                };                                                                                                     
                data_arr[19] = {
                    "key": 20,
                    "value": {
                        stringValue: '未下发'
                    }, //质检下发状态
                }; 
                data_arr[20] = {
                    "key": 21,
                    "value":{
                        dateTimeValue:{
                            "year":year,
                            "month":month,     /// 1-12
                            "day":day,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                            "hour":hour,         /// 0-23
                            "minute":minute,       /// 0-59
                            "second":second,       /// 0-59
                            "millisecond":millisecond
                        }                       
                    },//创建时间
                };
                data_arr[21] = {
                    "key": 22,
                    "value": {
                        stringValue: ''
                    }, //筛选
                };                      
                data_arr[22] = {
                    "key": 258,
                    "value": {
                        dateTimeValue:{
                            "year":year,
                            "month":month,     /// 1-12
                            "day":day,      /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                            "hour":hour,      /// 0-23
                            "minute":minute,    /// 0-59
                            "second":second,    /// 0-59
                            "millisecond":millisecond
                        }
                    }, //计划开始时间
                };
                data_arr[23] = {
                    "key": 259,
                    "value": {
                        dateTimeValue:{
                            "year":year,
                            "month":month + 1,     /// 1-12
                            "day":day,      /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                            "hour":hour,      /// 0-23
                            "minute":minute,    /// 0-59
                            "second":second,    /// 0-59
                            "millisecond":millisecond
                        }
                    }, //计划结束时间
                }; 
                data_obj.keyValueList = data_arr;
                recordValues.push(data_obj);  
                //质检下发数据
                data_arr1[0] = {
                    "key": 1,
                    "value": {
                        stringValue: ''
                    }, //请检编号
                };
                data_arr1[1] = {
                    "key": 2,
                    "value": {
                        stringValue: '2'
                    }, //报检类型
                };
                data_arr1[2] = {
                    "key": 3,
                    "value": {
                        stringValue: 'FT01'
                    }, //公司代码
                };
                data_arr1[3] = {
                    "key": 4,
                    "value": {
                        stringValue: skuDM
                    }, //物料编码
                };
                data_arr1[4] = {
                    "key": 5,
                    "value": {
                        stringValue: '成品桶'
                    }, //物料名称
                };
                data_arr1[5] = {
                    "key": 6,
                    "value": {
                        stringValue: '清洗车间'
                    }, //采样地点
                };
                data_arr1[6] = {
                    "key": 7,
                    "value": {
                        stringValue: onlineTime
                    }, //生产日期
                };
                data_arr1[7] = {
                    "key": 8,
                    "value": {
                        stringValue: year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
                    }, //报检日期
                };
                data_arr1[8] = {
                    "key": 9,
                    "value": {
                        stringValue: bucketNo
                    }, //生产批号
                };
                data_arr1[9] = {
                    "key": 10,
                    "value": {
                        stringValue: '1'
                    }, //批次数量
                };
                data_arr1[10] = {
                    "key": 11,
                    "value": {
                        stringValue: ''
                    }, //供应商代码
                };
                data_arr1[11] = {
                    "key": 12,
                    "value": {
                        stringValue: ''
                    }, //供应商名称
                };
                data_arr1[12] = {
                    "key": 13,
                    "value": {
                        stringValue: 'MES'
                    }, //报检人
                }; 
                data_arr1[13] = {
                    "key": 14,
                    "value": {
                        stringValue: 'MES'
                    }, //报检部门
                }; 
                data_arr1[14] = {
                    "key": 15,
                    "value": {
                        stringValue: ''
                    }, //包号(分)
                }; 
                data_arr1[15] = {
                    "key": 16,
                    "value": {
                        stringValue: ''
                    }, //生产批号(分)
                }; 
                data_arr1[16] = {
                    "key": 17,
                    "value": {
                        stringValue: '未下发'
                    }, //质检下发状态，初始值为未下发，发送后更新为已下
                }; 
                data_arr1[17] = {
                    "key": 18,
                    "value":{
                        dateTimeValue:{
                            "year":year,
                            "month":month,     /// 1-12
                            "day":day,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                            "hour":hour,         /// 0-23
                            "minute":minute,       /// 0-59
                            "second":second,       /// 0-59
                            "millisecond":millisecond
                        }                       
                    },//创建时间
                }; 
                data_arr1[18] = {
                    "key": 19,
                    "value": {
                        stringValue: '未打印'
                    }, //质检标签打印状态，初始值为未打印
                }; 
                data_obj1.keyValueList = data_arr1; 
                recordValues1.push(data_obj1); 
                //更新灌装桶清洗后质检任务下发数据 
                data_arr2[0] = {
                    "key": 20,
                    "value": {
                        stringValue: '已下发'
                    }, //质检下发状态
                };
                data_obj2.keyValueList = data_arr2; 
                recordValues2.push(data_obj2);                                                            
            }            
            TraceInfo("recordValues:",recordValues); 
            TraceInfo("recordValues1:",recordValues1);
            TraceInfo("recordValues2:",recordValues2); 
            //添加数据到灌装桶质检任务下发_清洗后
            var obj = {};
            var objectID = "87960931190081";            
            PlanAddThingRecord(objectID,recordValues,function (res1) {
                if ( !res1.ret ) {
                    //添加数据到质检下发
                    var objectID1 = "3603183167776751619";  
                    RealtimeAddThingRecord(objectID1,recordValues1,function (res2) {
                        if ( !res2.ret ) {
                            //修改灌装桶质检任务下发_清洗后数据，质检下发状态从'未下发'更新为'已下发'
                            var recordIDs = res1.recordIDs;
                            TraceInfo("recordIDs:",recordIDs);                          
                            PlanUpdateThingRecord(objectID,recordIDs,recordValues2,function (res3) {
                                if ( !res3.ret ) {
                                    TraceInfo("更新灌装桶质检任务下发_清洗后数据成功");
                                    obj = {
                                        "Response": {
                                            "returnCode": "0000",
                                            "returnDesc": "ok",
                                            "returnFlag": "1"

                                        }
                                    };
                                    //传送HTTP响应
                                    res.send(obj); //把数据返回
                                } else {
                                    TraceInfo("更新灌装桶质检任务下发_清洗后数据失败");
                                    obj = {
                                        "Response": {
                                            "returnCode": "0001",
                                            "returnDesc": "数据接收异常",
                                            "returnFlag": "0"

                                        }
                                    };
                                    //传送HTTP响应
                                    res.send(obj); //把数据返回  
                                }
                            });
                        } else {
                            //业务处理
                            TraceInfo("添加灌装桶质检任务下发_清洗后及质检下发数据失败");
                            obj = {
                                "Response": {
                                    "returnCode": "0001",
                                    "returnDesc": "数据接收异常",
                                    "returnFlag": "0"
                                }
                            };
                            //传送HTTP响应
                            res.send(obj); //把数据返回                            
                        }
                    });
                } else {
                    //业务处理
                    TraceInfo("添加灌装桶质检任务下发_清洗后数据失败");
                    obj = {
                        "Response": {
                            "returnCode": "0001",
                            "returnDesc": "数据接收异常",
                            "returnFlag": "0"
                        }
                    };
                    //传送HTTP响应
                    res.send(obj); //把数据返回
                }                
            });  
        });
        //绑定和侦听指定主机和端口上的连接
        var server = app.listen(30014, "172.16.24.205", function () {
            var host = server.address().address;
            var port = server.address().port;
            console.log("地址为 http://%s:%s", host, port);
        });
    }
    onDestroy() {
        /** destroy script entry */
        TraceInfo("灌装桶清洗后质检任务下发接口APP取消部署");
    }
}
module.exports = App