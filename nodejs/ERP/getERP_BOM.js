class App {
    onCreate(appGuid) {
        /** create script entry */
        TraceInfo("getERP_BOM获取ERP_BOM接口APP部署成功");
        const express = require("express");
        const bodyParser = require("body-parser"); //解析,用req.body获取post参数
        const app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: false
        }));
        app.use(bodyParser.json({limit:'100mb'}));
        app.use(bodyParser.urlencoded({ limit:'100mb', extended: true }));        
        app.post("/getERP_BOM", function (req, res) {
            TraceInfo("getERP_BOM","");
            const params = req.body.InParam.data;
            console.log(params);
            TraceInfo("",params);
            TraceInfo("",JSON.stringify(params));
            processdata(params).then((res1) => {
                var obj = {};
                var objectID = "87960930222083"; 
                var recordValues = res1;
                TraceInfo("",recordValues); 
                PlanAddThingRecord(objectID,recordValues,function (res2) {
                    if ( !res2.ret ) {
                        //业务处理
                        TraceInfo("添加数据成功");
                        obj = {
                            "errorcode": 0,
                            "message": "MES接收ERP_BOM清单成功"
                        };
                        //传送HTTP响应
                        res.send(obj); //把数据返回
                    } else {
                        //业务处理
                        TraceInfo("添加数据失败");
                        obj = {
                            "errorcode": 1,
                            "message": "MES接收ERP_BOM清单失败"
                        };
                        //传送HTTP响应
                        res.send(obj); //把数据返回
                    }
                    
                });                 
            });
 
        });
        //定义方法，处理erp发送的数据
        async function processdata(inparams) {
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            var millisecond = date.getMilliseconds();
            var recordValues = [];
            for (let i = 0; i < inparams.length; i++) {
                //查询bom是否已存在
                var objectID = "87960930222083";
                //5：父项物料编码, 10:子项物料编码
                var fieldIDs = [5, 10, 257];
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
                var filter = `(f5=="${inparams[i].parent_item_code}")&&(f10=="${inparams[i].child_item_code}")`;
                var timeRelation = 1; //数据结束时间在查询时间范围内  
                let res = await PlanQueryThingRecord(objectID,startTime,endTime,timeRelation,filter,fieldIDs);
                if (!res.ret) {
                    //业务处理
                    TraceInfo("查询数据成功");
                    var dataSets = res.dataSets;
                    var lens = dataSets.length;
                    TraceInfo("dataSets:", dataSets);
                    if (lens !== 0) {
                        TraceInfo("查询数据非空");
                        var recordIDs = [];
                        for (let j = 0; j < lens; j++) {
                            recordIDs.push(dataSets[j].values[2].uint64Value);
                        } 
                        TraceInfo("recordIDs:", recordIDs);
                        let res1 = await PlanDeleteThingRecordByRecordID(objectID,recordIDs);
                        if ( !res1.ret ) {
                            TraceInfo("删除数据成功");
                        } else {
                            TraceInfo("删除数据失败");
                        }
                    } 
                    var data_obj = {};
                    var data_arr = [];
                    data_arr[0] = {
                        "key": 1,
                        "value": {
                            stringValue: inparams[i].organization
                        }, //使用组织
                    };
                    data_arr[1] = {
                        "key": 2,
                        "value": {
                            stringValue: inparams[i].bom_version
                        }, //BOM版本
                    };
                    data_arr[2] = {
                        "key": 3,
                        "value": {
                            stringValue: inparams[i].bom_abbreviation
                        }, //BOM简称
                    };
                    data_arr[3] = {
                        "key": 4,
                        "value": {
                            stringValue: inparams[i].bom_classification
                        }, //BOM分类
                    };
                    data_arr[4] = {
                        "key": 5,
                        "value": {
                            stringValue: inparams[i].parent_item_code
                        }, //父项物料编码
                    };
                    data_arr[5] = {
                        "key": 6,
                        "value": {
                            stringValue: inparams[i].item_name
                        }, //物料名称
                    };
                    data_arr[6] = {
                        "key": 7,
                        "value": {
                            stringValue: inparams[i].specifications_and_models
                        }, //规格型号
                    };
                    data_arr[7] = {
                        "key": 8,
                        "value": {
                            stringValue: inparams[i].data_status
                        }, //数据状态
                    };
                    data_arr[8] = {
                        "key": 9,
                        "value": {
                            stringValue: inparams[i].item
                        }, //项次
                    };
                    data_arr[9] = {
                        "key": 10,
                        "value": {
                            stringValue: inparams[i].child_item_code
                        }, //子项物料编码
                    };
                    data_arr[10] = {
                        "key": 11,
                        "value": {
                            stringValue: inparams[i].child_item_name
                        }, //子项物料名称
                    };
                    data_arr[11] = {
                        "key": 12,
                        "value": {
                            stringValue: inparams[i].sub_specification_model
                        }, //子项规格型号
                    };
                    data_arr[12] = {
                        "key": 13,
                        "value": {
                            stringValue: inparams[i].supply_type
                        }, //供应类型
                    };
                    data_arr[13] = {
                        "key": 14,
                        "value": {
                            stringValue: inparams[i].subkey_units
                        }, //子项单位
                    };
                    data_arr[14] = {
                        "key": 15,
                        "value": {
                            stringValue: inparams[i].supply_organization
                        }, //供应组织
                    };
                    data_arr[15] = {
                        "key": 16,
                        "value": {
                            stringValue: inparams[i].dosage_molecule
                        }, //用量:分子
                    };
                    data_arr[16] = {
                        "key": 17,
                        "value": {
                            stringValue: inparams[i].dosage_denominator
                        }, //用量:分母
                    };
                    data_arr[17] = {
                        "key": 18,
                        "value": {
                            stringValue: inparams[i].code
                        }, //代码
                    };
                    data_arr[18] = {
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
                        }, //开始时间
                    };
                    data_arr[19] = {
                        "key": 259,
                        "value": {
                            dateTimeValue:{
                                "year":year + 1,
                                "month":month,     /// 1-12
                                "day":day,      /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                                "hour":hour,      /// 0-23
                                "minute":minute,    /// 0-59
                                "second":second,    /// 0-59
                                "millisecond":millisecond
                            }
                        },  //结束时间
                    };
                    data_obj.keyValueList = data_arr;
                    recordValues.push(data_obj);                    
                } else {
                    TraceInfo("查询数据失败");
                }
            }
            TraceInfo("recordValues:", recordValues);
            return recordValues;
        }
        //绑定和侦听指定主机和端口上的连接
        var server = app.listen(30000, "10.18.6.19", function () {
            var host = server.address().address;
            var port = server.address().port;
            console.log("地址为 http://%s:%s", host, port);
        });
    }
    onDestroy() {
        /** destroy script entry */
        TraceInfo("getERP_BOM获取ERP_BOM接口APP取消部署");
    }
}
module.exports = App