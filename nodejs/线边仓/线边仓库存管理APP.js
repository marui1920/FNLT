class App {
    onCreate() {
        /** create script entry */
        TraceInfo("线边仓库存管理APP部署成功");
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
        app.post("/getLineStorage", function (req, res) {
            TraceInfo("getLineStorage","");
            const params = req.body.InParam.data;
            TraceInfo("",params);
            TraceInfo("",JSON.stringify(params));
            //调用方法，同步调用ks 3个接口 
            var returndata;
            GetData(params).then(res1 => {
                returndata = res1;
                var target_obj = {
                    "res":returndata
                };
                res.send(target_obj); //把数据返回                 
            })
        });
        //绑定和侦听指定主机和端口上的连接
        var server = app.listen(30002, "172.16.24.205", function () {
            var host = server.address().address;
            var port = server.address().port;
            console.log("地址为 http://%s:%s", host, port);
        });
        async function GetData(inparam) {
            const date = new Date();
            const year = date.getFullYear();
            const month = date.getMonth() + 1;
            const day = date.getDate();
            const hour = date.getHours();
            const minute = date.getMinutes();
            const second = date.getSeconds();
            const millisecond = date.getMilliseconds(); 
            //查询线边仓库存
            var objectID = "3603812087758862849";
            //2：物料代码，4：重量
            var fieldIDs = [2, 4, 257];
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
            var filter = '';
            if (inparam.length === 0) {
                filter = ``;
            } else if (inparam.length === 1) {
                filter = `(f2=="${inparam[0]}")`;               
            } else if (inparam.length > 1) {
                for (let j = 0; j < inparam.length; j++) {
                    filter += `(f2=="${inparam[j]}")||`; 
                }
                filter = filter.substring(0, filter.length-2);
            }
            TraceInfo("filter:",filter);
            var timeRelation = 1; //数据结束时间在查询时间范围内        
            TraceInfo("函数执行前");
            var res = await PlanQueryThingRecord(objectID, startTime, endTime, timeRelation, filter, fieldIDs);
            if (!res.ret) {
                //业务处理
                var dataSets = res.dataSets;
                var lens = dataSets.length;
                TraceInfo("dataSets:", dataSets);
                if (lens !== 0) {
                    var data_obj = {};
                    var data_arr = [];
                    for (let i = 0; i < lens; i++) {
                        data_obj = {};
                        //物料代码
                        var materialcode = dataSets[i].values[0].stringValue;
                        //重量
                        var weight = dataSets[i].values[1].stringValue;
                        data_obj.materialcode = materialcode;
                        data_obj.weight_sum = Number(weight);
                        //data_obj[materialcode] = weight;
                        data_arr.push(data_obj);
                    }
                    TraceInfo('data_arr:',data_arr);
                    //调用handelData()方法，数组对象，合并其中某一属性值相同的项且属性值相加
                    var data = handelData(data_arr, 'materialcode', 'weight_sum', 'materialcode', 'weight_sum');
                    TraceInfo('data:',data);
                    for (let i1 = 0; i1 < data.length; i1++) {
                        //物料代码
                        var materialcode1 = data[i1].materialcode;
                        //总重量
                        var weight1 = data[i1].weight;
                        //占用重量
                        //var weight_pv = "";
                        var weight_sum = 0.00;  
                        ////查询生产状态为0的工单
                        var objectID1 = "87960930222082";
                        var filter1 = `(f19=="0")`;
                        //2：工单号，19：生产状态
                        var fieldIDs1 = [2, 19, 257];
                        var res1 = await PlanQueryThingRecord(objectID1, startTime, endTime, timeRelation, filter1, fieldIDs1);
                        if (!res1.ret) {
                            //业务处理
                            var dataSets1 = res1.dataSets;
                            var lens1 = dataSets1.length;
                            TraceInfo("dataSets1:", dataSets1);
                            if (lens1 !== 0) {
                                // data_arr = [];           
                                for (let i2 = 0; i2 < lens1; i2++) {
                                    //工单号
                                    var jobNumber = dataSets1[i2].values[0].stringValue;
                                    //查询生产投料记录对象记录
                                    var objectID2 = "87960930284085";
                                    var filter2 = `(f1=="${jobNumber}")&&(f4=="${materialcode1}")&&(f8=="未投料")`; //例如2>10，表示第2个成员大于100
                                    //1：工单号，4：子项物料代码，6：理论投料重量
                                    var fieldIDs2 = [1, 4, 6, 257];
                                    var res2 = await PlanQueryThingRecord(objectID2, startTime, endTime, timeRelation, filter2, fieldIDs2);
                                    if (!res2.ret) {
                                        var dataSets2 = res2.dataSets;
                                        var lens2 = dataSets2.length;
                                        TraceInfo("dataSets2:", dataSets2);
                                        //var weight_sum = 0.00;  
                                        if (lens2 !== 0) {                              
                                            for (let i3 = 0; i3 < lens2; i3++) {
                                                if (dataSets2[i3].values[2].stringValue !== "") {
                                                    weight_sum += Number(dataSets2[i3].values[2].stringValue);
                                                } else {
                                                    weight_sum += 0.00;  
                                                }                                                
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        //对象添加属性，占用重量
                        data[i1].weight_occupy = weight_sum;
                    }
                    TraceInfo('data:',data);                    
                    return data;
                } else {
                    //若无数据，返回空数组
                    var data1 = [];
                    return data1;
                }
            }       
        }
        //定义方法，数组对象，合并其中某一属性值相同的项且属性值相加
        const handelData = (r, orgK, orgV, changeK, changeV) => {
            const v = [...r];
            const aMap = new Map();
            const arr = [];   
            v.forEach((e) => {
                const k = e[orgK];
                aMap.set(k, (aMap.get(k) || 0) + Number(e[orgV]));
            })    
            aMap.forEach((val, key) => {
                const item = {};
                item[changeK] = key;
                item[changeV] = val;
                arr.push(item);
            })    
            return arr;
        }
    }
    onDestroy() {
        /** destroy script entry */
        TraceInfo("线边仓库存管理APP取消部署");
    }
}
module.exports = App