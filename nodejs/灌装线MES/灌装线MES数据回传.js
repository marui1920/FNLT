class App {
    onCreate(appGuid) {
        /** create script entry */
        TraceInfo("灌装线MES数据回传接口APP部署成功");
        const express = require("express");
        const bodyParser = require("body-parser"); //解析,用req.body获取post参数
        const app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: false
        }));
        app.post("/GuanzToMes", function (req, res) {
            TraceInfo("AAA","");
            const params = req.body.InParam;
            console.log(params);
            TraceInfo("",params);
            TraceInfo("",JSON.stringify(params));
            var gross_weight = params.gross_weight;
            gross_weight = gross_weight + '';
            var barrel_weight = params.barrel_weight;
            barrel_weight = barrel_weight + '';
            var net_weight = params.net_weight;
            net_weight = net_weight + '';
            var job_number = params.job_number;
            var barrel_number = params.barrel_number;
            var objectID="3603183167776751618";
            var fieldIDs=[1, 3, 257];
            var filter=`(f1=="${job_number}")&&(f3=="${barrel_number}")`;
            //查询符合条件数据的id
            RealtimeQueryThingRecord(objectID,fieldIDs,filter,function (res1) {
                if ( !res1.ret ) {
                    //业务处理
                  var dataSets = res1.fieldValues;
                  var lens = dataSets.length;
                  TraceInfo("",dataSets);
                  if (lens !== 0) {
                    var recordId = dataSets[0].values[2].uint64Value;
                    var recordIDs = [];
                    recordIDs.push(recordId);
                    var recordValues = [
                        {
                          //修改第一条记录
                            "keyValueList":[
                                {
                                "key":8,
                                "value":{stringValue:gross_weight},            //修改成员压力值
                              },{
                                "key":9,
                                "value":{stringValue:barrel_weight},            //修改成员压力值
                              },{
                                "key":10,
                                "value":{stringValue:net_weight},            //修改成员压力值
                              },
                                
                            ]
                        }
                    ]; 
                    //更新记录
                    var obj = {};
                    RealtimeUpdateThingRecord(objectID,recordIDs,recordValues,function (res2) {
                        if ( !res2.ret ) {
                            //业务处理
                          obj = {
                              "res": "数据更新成功"
                          };
                          //传送HTTP响应
                          res.send(obj); //把数据返回
                        } else {
                          //业务处理
                          TraceInfo("添加数据失败");
                          obj = {
                              "res": "数据更新失败"
                          };
                          //传送HTTP响应
                          res.send(obj); //把数据返回
                      } 
                    });
                  }
                }
            }); 
        });
        //绑定和侦听指定主机和端口上的连接
        var server = app.listen(30008, "172.16.24.205", function () {
            var host = server.address().address;
            var port = server.address().port;
            console.log("地址为 http://%s:%s", host, port);
        });
    }
    onDestroy() {
        /** destroy script entry */
        TraceInfo("灌装线MES数据回传接口APP取消部署");
    }
}
module.exports = App