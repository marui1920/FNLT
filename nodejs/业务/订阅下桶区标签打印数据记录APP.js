class App {
    onCreate() {
      /** create script entry */
      //开启订阅
      TraceInfo("开启下桶区标签打印数据记录订阅功能");
      var modelID_sub = "3604857723985854692";
      var objectIDs_sub = ["3603183167776751629"];
      RealtimeSubscribeThingRecord(modelID_sub, objectIDs_sub, function (res1) {
        // 业务处理
        TraceInfo("res1:", res1);
        var callbackData = res1.thingEvents;
        for (let i = 0; i < callbackData.length; i++) {
          //15增加，16删除，17修改
          if (callbackData[i].eventType === 15) {
            var recordID = callbackData[i].recordID;
            TraceInfo("recordID:", recordID);
            dataprocess(recordID).then((res) => {
              TraceInfo("res:", res);
              csvwrite(res);
            });
          }
        }
      });
      //定义方法，时空库交互，数据处理
      async function dataprocess (dataID) {
        var objectID = "3603183167776751629";
        var recordIDs = [];   
        var fieldIDs=[1, 2, 3, 4, 5, 6, 7, 8, 9, 12];
        recordIDs.push(dataID);
        var res = await RealtimeQueryThingRecordByRecordID(objectID,recordIDs,fieldIDs);
        if ( !res.ret ) {
          //业务处理
          var dataSets = res.fieldValues;
          var lens = dataSets.length;
          TraceInfo("dataSets:", dataSets);
          if (lens !== 0) {
            var data_obj = {};
            data_obj.batch_number = dataSets[0].values[0].stringValue; //生产批次号
            data_obj.barrel_number = dataSets[0].values[1].stringValue; //桶号
            data_obj.unload_barrel_time = dataSets[0].values[2].stringValue; //下桶时间
            data_obj.unload_barrel_type = dataSets[0].values[3].stringValue; //类型（如灌装下桶、不合格下桶）
            data_obj.product_name = dataSets[0].values[4].stringValue; //品名
            data_obj.product_type = dataSets[0].values[5].stringValue; //产品型号
            data_obj.net_weight = dataSets[0].values[6].stringValue; //净重
            data_obj.gross_weight = dataSets[0].values[7].stringValue; //毛重
            data_obj.customer_name = dataSets[0].values[8].stringValue; //客户名称
            data_obj.spare1 = dataSets[0].values[9].stringValue; //客户名称
            return data_obj;
          }
        } else {
          TraceInfo("查询下桶区标签打印数据记录失败");
        }
      }
      //定义方法，node.js读写csv文件
      function csvwrite (csvContent) {
        const fs = require("fs");
        // __dirname:表示当前正在执行的 js 文件所在的路径
        // __filename:表示当前正在执行的 js 文件的完成路径
        //var filename = __dirname +'\\'+'hello.txt'
        // const { stringify } = require("csv-stringify");
        // const columns = [
        //   "生产批次号",
        //   "桶号",
        //   "下桶时间",
        //   "类型",
        //   "品名",
        //   "产品型号",
        //   "净重",
        //   "毛重",
        //   "客户名称"
        // ];
        // const stringifier = stringify({ header: true, columns: columns });
        // stringifier.write(csvContent);
        // // 生成文件夹
        // fs.mkdir('testCSV2', (err) => {
        //   if (err) {
        //     TraceInfo("err:", err);
        //     //return console.log(err)
        //   } else {
        //     TraceInfo("生成文件夹");
        //   }
        // })
        // // 生成csv文件
        // fs.writeFile('./testCSV2/testCSV2.csv', csvContent, function (err) {
        //   if (err) {
        //     TraceInfo("err:", err);
        //     //console.log(err)       
        //   } else {
        //     TraceInfo("生成csv文件");
        //   }
        // })
        var csvContent1 = '';
        //表头
        csvContent1 += '\ufeff' + '生产批次号' + ',';
        csvContent1 += '\ufeff' + '桶号' + ',';
        csvContent1 += '\ufeff' + '下桶时间' + ',';
        csvContent1 += '\ufeff' + '类型' + ',';
        csvContent1 += '\ufeff' + '品名' + ',';
        csvContent1 += '\ufeff' + '产品型号' + ',';
        csvContent1 += '\ufeff' + '净重' + ',';
        csvContent1 += '\ufeff' + '毛重' + ',';
        csvContent1 += '\ufeff' + '保质期' + ',';
        csvContent1 += '\ufeff' + '客户名称' + '\n';
        //内容
        csvContent1 += '\ufeff' + csvContent.batch_number + ',';
        csvContent1 += '\ufeff' + csvContent.barrel_number + ',';
        csvContent1 += '\ufeff' + csvContent.unload_barrel_time + ',';
        csvContent1 += '\ufeff' + csvContent.unload_barrel_type + ',';
        csvContent1 += '\ufeff' + csvContent.product_name + ',';
        csvContent1 += '\ufeff' + csvContent.product_type + ',';
        csvContent1 += '\ufeff' + csvContent.net_weight + ',';
        csvContent1 += '\ufeff' + csvContent.gross_weight + ',';
        csvContent1 += '\ufeff' + csvContent.spare1 + ',';
        csvContent1 += '\ufeff' + csvContent.customer_name + '\n';
        TraceInfo("csvContent1:", csvContent1);
        // stringify(csvContent2, {
        //     header: true,
        //     columns: columns
        // }, function (err, output) {
        //   if (err) {
        //     TraceInfo("err:", err);
        //   } else {
        //     TraceInfo("写入csv文件数据");
        //     fs.writeFile('./testCSV2/testCSV4.csv', output);            
        //   }

        // })
        fs.appendFile('/usr/wellinos_cloud/nodeCalculation/testCSV.csv', csvContent1, function (err) {
          //fs.appendFile(__dirname + '/testCSV.csv', csvContent1, function (err) {
          //fs.appendFile('./testCSV/testCSV1.csv', csvContent1, function (err) {
          if (err) {
            TraceInfo("err:", err);
          }
        })

      }
    }
    onDestroy() {
      /** destroy script entry */
      //取消订阅
      TraceInfo("取消下桶区标签打印数据记录订阅功能");
      var modelID_unsub="3604857723985854692";
      var objectIDs_unsub=["3603183167776751629"]; 
      RealtimeUnSubscribeThingRecord(modelID_unsub,objectIDs_unsub,function (res11) {
        if ( !res11.ret ) {
          //业务处理
          TraceInfo("取消订阅功能成功");
        } else {
          TraceInfo("取消订阅功能失败");
        }
      });
    }
}

module.exports = App