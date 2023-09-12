class App {
  onCreate() {
    /** create script entry */
    TraceInfo("灌装线下桶区数据回传接口APP部署成功");
    const express = require("express");
    const bodyParser = require("body-parser"); //解析,用req.body获取post参数
    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
      extended: false
    }));
    app.post("/GuanzxtToMes", function (req, res) {
      TraceInfo("GuanzxtToMes", "");
      const params = req.body.InParam;
      console.log(params);
      TraceInfo("", params);
      TraceInfo("", JSON.stringify(params));
      //调用数据处理方法
      var obj = {};
      dataProcess(params).then(res1 => {
        if (!res1.ret) {
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
    });
    //绑定和侦听指定主机和端口上的连接
    var server = app.listen(30003, "172.16.24.205", function () {
      var host = server.address().address;
      var port = server.address().port;
      console.log("地址为 http://%s:%s", host, port);
    });
    //时空库业务处理逻辑
    async function dataProcess(inparam) {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
      const millisecond = date.getMilliseconds();
      const job_number = inparam.job_number; //生产批次号
      const barrel_number = inparam.barrel_number; //桶编号
      const unload_barrel_time = inparam.unload_barrel_time; //下桶时间
      const unload_barrel_type = inparam.unload_barrel_type; //下桶类型
      var product_name = '锂离子电池电解液';//品名,固定
      var product_type = '';//产品型号
      var net_weight = '';//净重
      var gross_weight = '';//毛重
      var customer_name = '';//客户名称
      var spare1 = '';//保质期
      //根据工单查询"工单管理生产"计划库
      var objectID = "87960930222082";
      //2：工单号，16：产品型号，22：客户名称，23：保质期
      var fieldIDs = [2, 16, 22, 23, 257];
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
      var filter = `(f2=="${job_number}")`;
      var timeRelation = 1; //数据结束时间在查询时间范围内        
      TraceInfo("函数执行前");
      var res = await PlanQueryThingRecord(objectID, startTime, endTime, timeRelation, filter, fieldIDs);
      if (!res.ret) {
        //业务处理
        var dataSets = res.dataSets;
        var lens = dataSets.length;
        TraceInfo("dataSets:", dataSets);
        if (lens !== 0) {
          product_type = dataSets[0].values[1].stringValue;
          customer_name = dataSets[0].values[2].stringValue;
          spare1 = dataSets[0].values[3].stringValue;
          //查询"灌装工单管理"实时库
          var objectID1 = "3603183167776751618";
          //8：毛重，10：净重
          var fieldIDs1 = [8, 10];
          var filter1 = `(f1=="${job_number}")&&(f3=="${barrel_number}")`;
          var res1 = await RealtimeQueryThingRecord(objectID1, fieldIDs1, filter1);
          TraceInfo("res1:", res1);
          if (!res1.ret) {            
            //业务处理
            var dataSets1 = res1.fieldValues;
            var lens1 = dataSets1.length;
            TraceInfo("dataSets1:", dataSets1);
            if (lens1 !== 0) {
              net_weight = dataSets1[0].values[1].stringValue;
              gross_weight = dataSets1[0].values[0].stringValue;
              //更新"下桶区标签打印"实时库
              var objectID2 = "3603183167776751629";
              var recordValues2 = [
                {
                  //第一条记录
                  "keyValueList": [
                    {
                      "key": 1,
                      "value": {
                        stringValue: job_number
                      },            //生产批次号
                    }, {
                      "key": 2,
                      "value": {
                        stringValue: barrel_number
                      },            //桶号
                    }, {
                      "key": 3,
                      "value": {
                        stringValue: unload_barrel_time
                      },            //下桶时间
                    }, {
                      "key": 4,
                      "value": {
                        stringValue: unload_barrel_type
                      },            //类型（如灌装下桶、不合格下桶）
                    }, {
                      "key": 5,
                      "value": {
                        stringValue: product_name
                      },            //品名
                    }, {
                      "key": 6,
                      "value": {
                        stringValue: product_type
                      },            //产品型号
                    }, {
                      "key": 7,
                      "value": {
                        stringValue: net_weight
                      },            //净重
                    }, {
                      "key": 8,
                      "value": {
                        stringValue: gross_weight
                      },            //毛重
                    }, {
                      "key": 9,
                      "value": {
                        stringValue: customer_name
                      },            //客户名称
                    }, {
                      "key": 10,
                      "value": {
                        stringValue: ""
                      },            //筛选
                    }, {
                      "key": 11,
                      "value": {
                        stringValue: ""
                      },            //状态标志位
                    }, {
                      "key": 12,
                      "value": {
                        stringValue: spare1
                      },            //保质期
                    }, {
                      "key": 13,
                      "value": {
                        stringValue: ""
                      },            //预留2
                    }, {
                      "key": 14,
                      "value": {
                        stringValue: ""
                      },            //预留3
                    }, {
                      "key": 15,
                      "value": {
                        stringValue: ""
                      },            //预留4
                    }, {
                      "key": 16,
                      "value": {
                        stringValue: ""
                      }             //预留5
                    }]
                }
              ];
              TraceInfo("recordValues2:", recordValues2);
              var res2 = await RealtimeAddThingRecord(objectID2, recordValues2);
              if (!res2.ret) {
                //业务处理
                TraceInfo("下桶区标签打印数据写入成功");
                return res2;
              } else {
                TraceInfo("下桶区标签打印数据写入失败");
                return res2;
              }
            } else {
              TraceInfo("灌装工单管理查询失败");
            }
          } else {
            TraceInfo("灌装工单管理符合条件数据为空");
          }
        } else {
          TraceInfo("工单管理生产符合条件数据为空");
        }
      } else {
        TraceInfo("工单管理生产查询失败");
      }
    }
  }
  onDestroy() {
    /** destroy script entry */
    TraceInfo("灌装线下桶区数据回传接口APP取消部署");
  }
}

module.exports = App