class App {
    onCreate(appGuid) {
        /** create script entry */
        TraceInfo("灌装桶信息查询接口APP部署成功");
        const express = require("express");
        const bodyParser = require("body-parser"); //解析,用req.body获取post参数
        const app = express();
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: false
        }));
        app.post("/GuanzToMesSearch", function (req, res) {
            TraceInfo("AAA","");
            const params = req.body.InParam;
            console.log(params);
            TraceInfo("",params);
            TraceInfo("",JSON.stringify(params));
            var job_number = params.job_number;
            var barrel_number = params.barrel_number;
            var objectID="1459166279268040708";
            var fieldIDs=[1, 3, 7, 257];
            var filter=`(f1=="${job_number}")&&(f3=="${barrel_number}")`;
            var obj;            
            //查询符合条件数据的id
            RealtimeQueryThingRecord(objectID,fieldIDs,filter,function (res1) {
                if ( !res1.ret ) {
                    //业务处理
                  var dataSets = res1.fieldValues;
                  var lens = dataSets.length;
                  TraceInfo("",dataSets);
                  if (lens !== 0) {
                    var data_obj = {};
                    var data_arr = [];
                    data_obj.job_number = dataSets[0].values[0].stringValue; 
                    data_obj.barrel_number = dataSets[0].values[1].stringValue; 
                    data_obj.qualified = dataSets[0].values[2].stringValue; 
                    data_arr.push(data_obj);
                    obj = { "res": data_arr};
                    //传送HTTP响应
                    res.send(obj); //把数据返回
                  } else {
                    obj = { "res": "无相关数据"};
                    //传送HTTP响应
                    res.send(obj); //把数据返回
                  }
                } else {
                    obj = { "res": "查询异常"};
                    //传送HTTP响应
                    res.send(obj); //把数据返回
                }
            }); 
        });
        //绑定和侦听指定主机和端口上的连接
        var server = app.listen(30009, "172.16.24.205", function () {
            var host = server.address().address;
            var port = server.address().port;
            console.log("地址为 http://%s:%s", host, port);
        });
    }
    onDestroy() {
        /** destroy script entry */
        TraceInfo("灌装桶信息查询接口APP部署取消");
    }
}
module.exports = App