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
      app.post("/getLIMS_ZJJG", function (req, res) {
          const InParam = req.body.InParam;
          const Param = InParam.data;            
          TraceInfo("",Param);
          TraceInfo("",JSON.stringify(Param));
          var return_obj = {};
          if (InParam === null || InParam === "" || JSON.stringify(InParam) === "{}") {
            return_obj = {
                "errorCode": 1,
                'message': "传入参数inparam为空"
            };
            //传送HTTP响应
            res.send(return_obj); //把数据返回
          } else {
            if (Param.length !== 0) {
              for (let i = 0; i < Param.length; i++) {
                var request_no = Param[i].request_no; //请检编号
                var inspection_type = Param[i].inspection_type; //1.原料，2.包材，3.洗釜检，9.混合溶剂，5.半成品，6.成品，7.成品入库检，8.成品发货检
                var org_code = Param[i].org_code; //公司代码
                var sample_code = Param[i].sample_code; //物料编码
                var sample_name = Param[i].sample_name; //物料名称
                var batch_no = Param[i].batch_no; //生产批号
                var grade_Name = Param[i].grade_name; //样品判定，质检结果只能是合格或者不合格
                var gradeName_last = Param[i].gradename_last; //上次样品判定
                var flag = Param[i].flag; //回传次数，"0";
                if (grade_Name === gradeName_last) {
                  return_obj = {
                    "errorCode": 7,
                    'message': "传入参数的本次质检结果与上次质检结果相同，请核对后再进行接口数据上传！"
                  };
                  //传送HTTP响应
                  res.send(return_obj); //把数据返回
                  break;
                } else if (grade_Name !== '合格' && grade_Name !== '不合格') {
                  return_obj = {
                    "errorCode": 8,
                    'message': "传入参数的本次质检结果只能是‘合格’或者‘不合格’，请核对后再进行接口数据上传！"
                  };
                  //传送HTTP响应
                  res.send(return_obj); //把数据返回
                  break;
                } else {
                  var objectID = "";
                  var request_item = "";
                  var status = "";
                  switch (inspection_type) { //报检类型 1.原料，2.包材，3.洗釜检，4.混合溶剂，5.半成品，6.成品，7.成品入库检，8.成品发货检 
                    case '1': //  QC_Raw_Input
                      objectID = "54975581388807"; 
                      request_item = "原料报检回传";
                      status = "待回传WMS";
                      break;
                    case '2': //  QC_Raw_Input
                      objectID = "54975581388811"; 
                      request_item = "空桶清洗后报检回传";
                      status = "待回传WMS";
                      break;
                    case '3': //  QC_Raw_Input
                      objectID = "54975581388808"; 
                      request_item = "洗釜完成后报检回传";
                      status = "待回传WMS";
                      break;
                    case '9': //  QC_Raw_Input
                      objectID = "54975581388806"; 
                      request_item = "溶剂添加完成后报检回传";
                      status = "待回传WMS";
                      break;
                    case '5': //  QC_Raw_Input
                      objectID = "54975581388806"; 
                      request_item = "溶质添加完成后报检回传";
                      status = "待回传WMS";
                      break;
                    case '6': //  QC_Raw_Input
                      objectID = "54975581388806"; 
                      request_item = "添加剂添加完成后报检回传";
                      status = "待回传WMS";
                      break;
                    case '7': //  QC_Raw_Input
                      objectID = "54975581388805"; 
                      request_item = "成品入库报检回传";
                      status = "待回传WMS";
                      break;
                    case '8': //  QC_Raw_Input
                      objectID = "54975581388809"; 
                      request_item = "成品发货报检回传";
                      status = "待回传WMS";
                      break;                                                                                                                        
                  }
                  var recordValues = [];
                  var recordValues = [
                  {
                    "keyValueList":[
                      {
                          "key":1,
                          "value":{stringValue:request_item},//1为质检项目
                      },
                      {
                          "key":2,
                          "value":{dateTimeValue:{
                              "year":year,
                              "month":month,     /// 1-12
                              "day":day,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                              "hour":hour,         /// 0-23
                              "minute":minute,       /// 0-59
                              "second":second,       /// 0-59
                              "millisecond":millisecond
                          }},//回传时间
                      },
                      {
                          "key":3,
                          "value":{stringValue:request_no}, //请检编号
                              
                      },
                      {
                          "key":4,
                          "value":{stringValue:inspection_type} //报检类型
                              
                      },
                      {
                          "key":5,
                          "value":{stringValue:org_code} //公司代码
                              
                      },
                      {
                          "key":6,
                          "value":{stringValue:sample_code} //物料编码
                              
                      },
                      {
                          "key":7,
                          "value":{stringValue:sample_name} //物料名称
                              
                      },
                      {
                          "key":8,
                          "value":{stringValue:batch_no} //生产批号
                              
                      },
                      {
                          "key":9,
                          "value":{stringValue:grade_Name} //样品判定，质检结果只能是合格或者不合格
                              
                      },
                      {
                          "key":10,
                          "value":{stringValue:gradeName_last} //上次样品判定
                              
                      },
                      {
                          "key":11,
                          "value":{stringValue:flag} //回传次数，"0";
                              
                      },
                      {
                          "key":12,
                          "value":{stringValue:status} //回传状态;
                              
                      },
                      {
                          "key":258,
                          "value":{dateTimeValue:{
                              "year":year,
                              "month":month,     /// 1-12
                              "day":day,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                              "hour":hour,         /// 0-23
                              "minute":minute,       /// 0-59
                              "second":second,       /// 0-59
                              "millisecond":millisecond
                          }},//开始时间
                      },
                      {
                          "key":259,
                          "value":{dateTimeValue:{
                              "year":year + 1,
                              "month":month,     /// 1-12
                              "day":day,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
                              "hour":hour,         /// 0-23
                              "minute":minute,       /// 0-59
                              "second":second,       /// 0-59
                              "millisecond":millisecond
                          }}, //结束时间                               
                      }]
                    }];
                  TraceInfo("objectID:",objectID);
                  TraceInfo("recordValues:",recordValues);  
                  SetData(objectID,recordValues).then(res => {
                    TraceInfo("res:",res);  
                    //添加剂添加完成后报检回传后，更新工单管理生产内记录“生产状态”成员
                    if (request_item === "添加剂添加完成后报检回传" && grade_Name === "合格") {
                      SetData1(batch_no);
                    } else if (request_item === "成品入库报检回传" && grade_Name === "合格") {
                      SetData2(request_no);
                    }                    
                  });

                }
              }
              return_obj = {
                "errorCode": 0,
                'message': "MES接收LIMS质检信息成功!"
              };
              //传送HTTP响应
              res.send(return_obj); //把数据返回
            }
          }
      });
      //绑定和侦听指定主机和端口上的连接
      var server = app.listen(30005, "172.16.24.205", function () {
          var host = server.address().address;
          var port = server.address().port;
          console.log("地址为 http://%s:%s", host, port);
      });
      //声明函数，历史库写入数据
      async function SetData(objectID1,recordValues1) {
        var returndata = await HistoryAddThingRecord(objectID1,recordValues1).then(function (res) {
          if ( !res.ret ) {
              //业务处理
              TraceInfo("res:",res)
              return res;
          }
        }); 
        return returndata;
      }
      //声明函数，更新工单管理生产内记录“生产状态”成员
      async function SetData1(batch) {
          var objectID_plan = "87960930222082";
          //2：工单号;4: 产线
          var fieldIDs_plan = [2, 4, 257];
          var startTime_plan = {
            "year":year - 100,
            "month":1,     /// 1-12
            "day":1,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
            "hour":0,         /// 0-23
            "minute":0,       /// 0-59
            "second":0,       /// 0-59
            "millisecond":0
          };
          var endTime_plan = {
            "year":year + 100,
            "month":month,     /// 1-12
            "day":day,       /// { 31,28/29,31,30,31,30,31,31,30,31,30,31 }
            "hour":hour,        /// 0-23
            "minute":minute,         /// 0-59
            "second":second,       /// 0-59
            "millisecond":millisecond
          };
          var filter_plan = `(f2=="${batch}")`;
          var timeRelation_plan = 1; //数据结束时间在查询时间范围内  
          await PlanQueryThingRecord(objectID_plan,startTime_plan,endTime_plan,timeRelation_plan,filter_plan,fieldIDs_plan,function (res) {
            if (!res.ret) {
              TraceInfo("查询res",res);
              var dataSets = res.dataSets;
              var line = Number(dataSets[0].values[1].stringValue);
              var dataid = dataSets[0].values[2].uint64Value;
              var recordIDs_plan = [];
              recordIDs_plan.push(dataid);
              var product_status = '';
              if (line < 5 ) {
                product_status = "3";
              } else if (line >= 5) {
                product_status = "1";
              }
              var recordValues_plan = [
                {
                    "keyValueList":[//记录1
                        {
                            "key":19,
                            "value":{stringValue:product_status},//19:生产状态
                        }]
                }]
              PlanUpdateThingRecord(objectID_plan,recordIDs_plan,recordValues_plan).then(function (res1) {
                if ( !res1.ret ) {
                    //业务处理
                    TraceInfo("更新res1",res1);
                }
              });
            }
          })
      }
      //声明函数，更新罐装工单管理内记录“质检状态”成员
      async function SetData2(request_id) {
        //查询质检下发对象记录，获取工单号及桶编号
        var objectID = "3603183167776751619";
        //6：桶编号;9:工单号
        var fieldIDs = [6, 9];
        var filter = `(f1=="${request_id}")`;
        var res = await RealtimeQueryThingRecord(objectID,fieldIDs,filter)
        if (!res.ret) {
          TraceInfo("查询res",res);
          var dataSets = res.fieldValues;
          var barrel_number = dataSets[0].values[0].stringValue;
          var batch_number = dataSets[0].values[1].stringValue;             
          //查询罐装工单管理内记录
          var objectID1 = "3603183167776751618";
          //1：工单号;3: 桶编号
          var fieldIDs1 = [1, 3, 257];
          var filter1 = `(f1=="${batch_number}")&&(f3=="${barrel_number}")&&(f12=="已下发")`;
          var res1 = await RealtimeQueryThingRecord(objectID1,fieldIDs1,filter1);
          if (!res1.ret) {
            TraceInfo("查询res",res);
            var dataSets1 = res1.fieldValues;
            var dataid1 = dataSets1[0].values[2].uint64Value;
            var recordIDs1 = [];
            recordIDs1.push(dataid1);
            var recordValues1 = [
              {
                "keyValueList":[//记录1
                  {
                      "key":12,
                      "value":{stringValue:"合格"},//19:生产状态
                  }]
              }]
            var res2 = await RealtimeUpdateThingRecord(objectID1,recordIDs1,recordValues1);
            if ( !res2.ret ) {
              //业务处理
              TraceInfo("更新res1",res1);
            }
          }
        }      
      }
  }
  onDestroy() {
      /** destroy script entry */
  }
}
module.exports = App