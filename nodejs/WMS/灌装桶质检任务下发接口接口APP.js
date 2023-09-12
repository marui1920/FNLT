class App {
    onCreate(appGuid) {
        /** create script entry */
        debugger;
        TraceInfo("开始了");
        const date = new Date();
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        const millisecond = date.getMilliseconds();
        const express = require("express");
        const bodyParser = require("body-parser"); //解析,用req.body获取post参数
        const app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: false
        }));
        app.post("/getWMS_GZTSJ", function (req, res) {
            TraceInfo("AAA","");
            const params = req.body.InParam.data.orderinfo;
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
                var warehouseId = params[i].warehouseId;//仓库ID CS01：法恩莱特长沙仓库
                var wmsNo = params[i].wmsNo;//WMS 订单号
                var orderNo = params[i].orderNo;//ERP 订单号        
                var customerId = params[i].customerId;//货主ID（本项目是FNLT）
                var orderType = params[i].orderType;//订单类型 (XSCK: 销售出库)
                var receivedTime = params[i].receivedTime;//收货时间
                var supplierId = params[i].supplierId;//供应商ID
                var supplierName = params[i].supplierName;//供应商名称
                for (let j = 0; j < params[i].details.length; j++) {
                    var referenceNo = params[i].details[j].referenceNo;//上游来源备注号
                    var lineNo = params[i].details[j].lineNo;//ERP 订单行号
                    var skuDM = params[i].details[j].sku;//产品编号
                    var receivedQty = params[i].details[j].receivedQty;//实收数量
                    var lotAtt03 = params[i].details[j].lotAtt03;//入库日期
                    var lotAtt04 = params[i].details[j].lotAtt04;//产品批号
                    var lotAtt05 = params[i].details[j].lotAtt05;//ERP 组织
                    var lotAtt06 = params[i].details[j].lotAtt06;//ERP 仓库
                    var lotAtt07 = params[i].details[j].lotAtt07;//ERP 货主
                    var lotAtt08 = params[i].details[j].lotAtt08;//质量状态(0:良品,1:不良品,2:待检品)
                    var userDefine1 = params[i].details[j].userDefine1; //ERP 货主类型（ORG:组织，SUP:供应商，CUS:客户）
                    var userDefine2 = params[i].details[j].userDefine2; //桶号
                    var userDefine3 = params[i].details[j].userDefine3; //物料名称
                    var userDefine4 = params[i].details[j].userDefine4; //用户自定义4
                    var userDefine5 = params[i].details[j].userDefine5; //用户自定义5
                    var userDefine6 = params[i].details[j].userDefine6; //用户自定义6
                    data_obj = {};
                    data_arr = [];
                    data_obj1 = {};
                    data_arr1 = [];  
                    data_obj2 = {};
                    data_arr2 = [];                   
                    //灌装桶质检任务下发数据
                    data_arr[0] = {
                        "key": 1,
                        "value": {
                            stringValue: warehouseId
                        }, //仓库CS01: 法恩莱特长沙仓库
                    };
                    data_arr[1] = {
                        "key": 2,
                        "value": {
                            stringValue: wmsNo
                        }, //WMS订单号
                    };
                    data_arr[2] = {
                        "key": 3,
                        "value": {
                            stringValue: orderNo
                        }, //ERP订单号  
                    };
                    data_arr[3] = {
                        "key": 4,
                        "value": {
                            stringValue: customerId
                        }, //货主ID（本项目是FNLT）
                    };
                    data_arr[4] = {
                        "key": 5,
                        "value": {
                            stringValue: orderType
                        }, //订单类型 (XSCK: 销售出库)
                    };
                    data_arr[5] = {
                        "key": 6,
                        "value": {
                            stringValue: receivedTime
                        }, //收货时间
                    };
                    data_arr[6] = {
                        "key": 7,
                        "value": {
                            stringValue: supplierId
                        }, //供应商ID
                    };
                    data_arr[7] = {
                        "key": 8,
                        "value": {
                            stringValue: supplierName
                        }, //供应商名称
                    };
                    data_arr[8] = {
                        "key": 9,
                        "value": {
                            stringValue: referenceNo
                        }, //上游来源备注号
                    };
                    data_arr[9] = {
                        "key": 10,
                        "value": {
                            stringValue: lineNo
                        }, //ERP订单行号
                    };
                    data_arr[10] = {
                        "key": 11,
                        "value": {
                            stringValue: skuDM
                        }, //产品编号
                    };
                    data_arr[11] = {
                        "key": 12,
                        "value": {
                            stringValue: receivedQty
                        }, //实收数量
                    };
                    data_arr[12] = {
                        "key": 13,
                        "value": {
                            stringValue: lotAtt03
                        }, //入库日期
                    }; 
                    data_arr[13] = {
                        "key": 14,
                        "value": {
                            stringValue: lotAtt04
                        }, //产品批号
                    }; 
                    data_arr[14] = {
                        "key": 15,
                        "value": {
                            stringValue: lotAtt05
                        }, //ERP组织
                    }; 
                    data_arr[15] = {
                        "key": 16,
                        "value": {
                            stringValue: lotAtt06
                        }, //ERP仓库
                    }; 
                    data_arr[16] = {
                        "key": 17,
                        "value": {
                            stringValue: lotAtt07
                        }, //ERP货主
                    }; 
                    data_arr[17] = {
                        "key": 18,
                        "value": {
                            stringValue: lotAtt08
                        }, //质量状态(0:良品,1:不良品,2:待检品)
                    }; 
                    data_arr[18] = {
                        "key": 19,
                        "value": {
                            stringValue: userDefine1
                        }, //ERP货主类型
                    };
                    data_arr[19] = {
                        "key": 20,
                        "value": {
                            stringValue: userDefine2
                        }, //用户自定义2，灌装桶号
                    }; 
                    data_arr[20] = {
                        "key": 21,
                        "value": {
                            stringValue: userDefine3
                        }, //用户自定义3
                    }; 
                    data_arr[21] = {
                        "key": 22,
                        "value": {
                            stringValue: userDefine4
                        }, //用户自定义4
                    }; 
                    data_arr[22] = {
                        "key": 23,
                        "value": {
                            stringValue: userDefine5
                        }, //用户自定义5
                    }; 
                    data_arr[23] = {
                        "key": 24,
                        "value": {
                            stringValue: userDefine6
                        }, //用户自定义6
                    };                                                                                                      
                    data_arr[24] = {
                        "key": 25,
                        "value": {
                            stringValue: '未下发'
                        }, //质检下发状态
                    }; 
                    data_arr[25] = {
                        "key": 26,
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
                    data_arr[26] = {
                        "key": 27,
                        "value": {
                            stringValue: ''
                        }, //筛选
                    };                      
                    data_arr[27] = {
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
                    data_arr[28] = {
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
                            stringValue: lotAtt03
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
                            stringValue: userDefine2
                        }, //生产批号
                    };
                    data_arr1[9] = {
                        "key": 10,
                        "value": {
                            stringValue: receivedQty
                        }, //批次数量
                    };
                    data_arr1[10] = {
                        "key": 11,
                        "value": {
                            stringValue: supplierId
                        }, //供应商代码
                    };
                    data_arr1[11] = {
                        "key": 12,
                        "value": {
                            stringValue: supplierName
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
                    data_obj1.keyValueList = data_arr1; 
                    recordValues1.push(data_obj1); 
                    //更新灌装桶质检任务下发数据 
                    data_arr2[0] = {
                        "key": 25,
                        "value": {
                            stringValue: '已下发'
                        }, //质检下发状态
                    };
                    data_obj2.keyValueList = data_arr2; 
                    recordValues2.push(data_obj2);                                                            
                }
            }  
            TraceInfo("recordValues:",recordValues); 
            TraceInfo("recordValues1:",recordValues1);
            TraceInfo("recordValues2:",recordValues2); 
            //添加数据到灌装桶质检任务下发_清洗前
            var obj = {};
            var objectID = "87960930548082";            
            PlanAddThingRecord(objectID,recordValues,function (res1) {
                if ( !res1.ret ) {
                    //添加数据到质检下发
                    var objectID1 = "3603183167776751619";  
                    RealtimeAddThingRecord(objectID1,recordValues1,function (res2) {
                        if ( !res2.ret ) {
                            //修改灌装桶质检任务下发_清洗前数据，质检下发状态从'未下发'更新为'已下发'
                            var recordIDs = res1.recordIDs;
                            TraceInfo("recordIDs:",recordIDs);                          
                            PlanUpdateThingRecord(objectID,recordIDs,recordValues2,function (res3) {
                                if ( !res3.ret ) {
                                    TraceInfo("更新灌装桶质检任务下发_清洗前数据成功");
                                    obj = {
                                        "Response": {
                                            "return": {
                                                "returnCode": "0000",
                                                "returnDesc": "ok",
                                                "returnFlag": "1"
                                            }
                                        }
                                    };
                                    //传送HTTP响应
                                    res.send(obj); //把数据返回
                                } else {
                                    TraceInfo("更新灌装桶质检任务下发_清洗前数据失败");
                                    obj = {
                                        "Response": {
                                            "return": {
                                                "returnCode": "0001",
                                                "returnDesc": "数据接收异常",
                                                "returnFlag": "0"
                                            }
                                        }
                                    };
                                    //传送HTTP响应
                                    res.send(obj); //把数据返回  
                                }
                            });
                        } else {
                            //业务处理
                            TraceInfo("添加灌装桶质检任务下发_清洗前及质检下发数据失败");
                            obj = {
                                "Response": {
                                    "return": {
                                        "returnCode": "0001",
                                        "returnDesc": "数据接收异常",
                                        "returnFlag": "0"
                                    }
                                }
                            };
                            //传送HTTP响应
                            res.send(obj); //把数据返回                            
                        }
                    });
                } else {
                    //业务处理
                    TraceInfo("添加灌装桶质检任务下发_清洗前数据失败");
                    obj = {
                        "Response": {
                            "return": {
                                "returnCode": "0001",
                                "returnDesc": "数据接收异常",
                                "returnFlag": "0"
                            }
                        }
                    };
                    //传送HTTP响应
                    res.send(obj); //把数据返回
                }                
            });  
        });
        //绑定和侦听指定主机和端口上的连接
        var server = app.listen(30013, "172.16.24.205", function () {
            var host = server.address().address;
            var port = server.address().port;
            console.log("地址为 http://%s:%s", host, port);
        });
    }
    onDestroy() {
        /** destroy script entry */
    }
}
module.exports = App