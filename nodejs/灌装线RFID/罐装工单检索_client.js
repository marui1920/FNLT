class App {
  onCreate(appGuid) {
    /** create script entry */
    TraceInfo("灌装工单检索APP部署成功");
    const express = require("express");
    const bodyParser = require("body-parser"); //解析,用req.body获取post参数
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.post("/MesToRfid", function (req, res) {
      TraceInfo("MesToRfid", "");
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
      TraceInfo("", params);
      TraceInfo("", JSON.stringify(params));
      const filling_line = params.line;
      var objectID = "87960930222082";
      var startTime = {
        "year": year,
        "month": 1,     /// 1-12
        "day": 1,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
        "hour": 0,         /// 0-23
        "minute": 0,       /// 0-59
        "second": 0,       /// 0-59
        "millisecond": 0
      };
      var endTime = {
        "year": year + 1,
        "month": month,     /// 1-12
        "day": day,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
        "hour": hour,        /// 0-23
        "minute": minute,         /// 0-59
        "second": second,       /// 0-59
        "millisecond": millisecond
      };
      var filter = `(f20=="${filling_line}")&&(f19=="1")`; //例如2>10，表示第2个成员大于100
      //var filter = `(f20=="${filling_line}")&&(f2=="230808X0802")`; //例如2>10，表示第2个成员大于100
      var timeRelation = 1; //数据结束时间在查询时间范围内
      var fieldIDs = [2, 20, 18, 16];
      var data_arr = [];
      var data_obj = {};
      //计划库查询
      PlanQueryThingRecord(objectID, startTime, endTime, timeRelation, filter, fieldIDs, function (res1) {
        if (!res1.ret) {
          //业务处理
          var dataSets = res1.dataSets;
          var lens = dataSets.length;
          if (lens !== 0) {
            for (var i = 0; i < dataSets.length; i++) {
              data_obj = {};
              data_obj.job_number = dataSets[i].values[0].stringValue;
              data_obj.filling_line = dataSets[i].values[1].stringValue;
              data_obj.production_time = dataSets[i].values[2].stringValue;
              data_obj.material_num = dataSets[i].values[3].stringValue;
              data_arr.push(data_obj);
            }
            var target_obj = {
              "res": data_arr
            }
            TraceInfo("data_arr", data_arr);
            TraceInfo("target_obj", target_obj);
            //传送HTTP响应
            res.send(target_obj); //把数据返回                                   
          } else {
            target_obj = {
              "res": "无符合条件数据"
            }
            //传送HTTP响应
            res.send(target_obj); //把数据返回 
          }
        }
      });
    });
    //绑定和侦听指定主机和端口上的连接
    var server = app.listen(30006, "10.18.6.19", function () {
      var host = server.address().address;
      var port = server.address().port;
      console.log("地址为 http://%s:%s", host, port);
    });
  }
  onDestroy() {
    /** destroy script entry */
    TraceInfo("灌装工单检索APP取消部署");
  }
}
module.exports = App