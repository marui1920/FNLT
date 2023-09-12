class App {
    onCreate(appGuid) {
        /** create script entry */
        TraceInfo("getERP_order获取ERP订单接口APP部署成功");
        const express = require("express");
        const bodyParser = require("body-parser"); //解析,用req.body获取post参数
        const app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: false
        }));        
        app.post("/getERP_order", function (req, res) {
            TraceInfo("getERP_order","");
            var date = new Date();
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var day = date.getDate();
            var hour = date.getHours();
            var minute = date.getMinutes();
            var second = date.getSeconds();
            var millisecond = date.getMilliseconds();
            const params = req.body.InParam.data;
            console.log(params);
            TraceInfo("",params);
            TraceInfo("",JSON.stringify(params));
            var data_obj = {};
            var data_arr = [];
            var recordValues = [];
            for (let i = 0; i < params.length; i++) {
                data_obj = {};
                data_arr = [];
                var delivery_time = params[i].order_delivery_time;
                var delivery_time_year = Number(delivery_time.slice(0, 4));
                var delivery_time_month = Number(delivery_time.slice(5, 7));
                var delivery_time_day = Number(delivery_time.slice(8, 10));
                data_arr[0] = {
                    "key": 1,
                    "value": {
                        stringValue: params[i].document_no
                    }, //订单编号
                };
                data_arr[1] = {
                    "key": 2,
                    "value": {
                        stringValue: params[i].material_code
                    }, //产品编码
                };
                data_arr[2] = {
                    "key": 3,
                    "value": {
                        stringValue: params[i].material_name
                    }, //产品名称
                };
                data_arr[3] = {
                    "key": 4,
                    "value": {
                        stringValue: params[i].sales_volumes
                    }, //订单数量   jjjj
                };
                data_arr[4] = {
                    "key": 5,
                    "value": {
                        stringValue: "0"
                    }, //已制单
                };
                data_arr[5] = {
                    "key": 6,
                    "value": {
                        stringValue: params[i].order_preparation_time
                    }, //制单时间
                };
                data_arr[6] = {
                    "key": 7,
                    "value": {
                        stringValue: params[i].order_delivery_time
                    }, //订单交期
                };
                data_arr[7] = {
                    "key": 8,
                    "value": {
                        stringValue: params[i].barrel_specifications
                    }, //桶规格
                };
                data_arr[8] = {
                    "key": 9,
                    "value": {
                        stringValue: params[i].number_of_barrels
                    }, //桶数量
                };
                data_arr[9] = {
                    "key": 10,
                    "value": {
                        stringValue: params[i].order_status
                    }, //订单状态
                };
                data_arr[10] = {
                    "key": 11,
                    "value": {
                        stringValue: params[i].customer_name
                    }, //客户名称
                };
                data_arr[11] = {
                    "key": 12,
                    "value": {
                        stringValue: params[i].shelf_life
                    }, //保质期
                };
                data_arr[12] = {
                    "key": 13,
                    "value": {
                        stringValue: params[i].product_model
                    }, //产品型号
                };
                data_arr[13] = {
                    "key": 14,
                    "value": {
                        stringValue: intervalTime().dateTime
                    }, //质检类型改为下发时间
                };
                 data_arr[14] = {
                    "key": 15,
                    "value": {
                        stringValue: ''
                    }, //筛选
                };   
                data_arr[15] = {
                    "key": 16,
                    "value": {
                        dateTimeValue:{
                            "year":delivery_time_year,
                            "month":delivery_time_month,     /// 1-12
                            "day":delivery_time_day,      /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                            "hour":0,      /// 0-23
                            "minute":0,    /// 0-59
                            "second":0,    /// 0-59
                            "millisecond":0
                        }
                    }, //订单交期1
                }; 
                 data_arr[16] = {
                    "key": 17,
                    "value": {
                        stringValue: '否'
                    }, //订单是否取消，默认为否
                };                           
                data_arr[17] = {
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
                data_arr[18] = {
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
            }
            var obj = {};
            var objectID = "87960930222081";  
            TraceInfo("",recordValues); 
            PlanAddThingRecord(objectID,recordValues,function (res1) {
                if ( !res1.ret ) {
                    //业务处理
                    TraceInfo("添加数据成功");
                    obj = {
                        "errorcode": 0,
                        "message": "MES接收ERP_order清单成功"
                    };
                    //传送HTTP响应
                    res.send(obj); //把数据返回
                } else {
                    //业务处理
                    TraceInfo("添加数据失败");
                    obj = {
                        "errorcode": 1,
                        "message": "MES接收ERP_order清单失败"
                    };
                    //传送HTTP响应
                    res.send(obj); //把数据返回
                }
                
            });  
        });
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
        //绑定和侦听指定主机和端口上的连接
        var server = app.listen(30001, "10.18.6.19", function () {
            var host = server.address().address;
            var port = server.address().port;
            console.log("地址为 http://%s:%s", host, port);
        });
    }
    onDestroy() {
        /** destroy script entry */
        TraceInfo("getERP_order获取ERP订单接口APP取消部署");
    }
}
module.exports = App