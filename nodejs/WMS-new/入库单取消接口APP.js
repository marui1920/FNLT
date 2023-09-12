class App {
    onCreate() {
      /** create script entry */
      TraceInfo("入库单取消接口APP部署成功");
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
      app.post("/cancelRKD", function (req, res) {
        TraceInfo("cancelRKD", "");
        const params = req.body.InParam.data;
        TraceInfo("", params);
        TraceInfo("", JSON.stringify(params));
        //returndata:前端请求返回数据 
        var returndata;
        //前端请求参数校验
        if (JSON.stringify(params) === "{}" || params.docNo === "" || params.docType === "") {
          returndata = {
            "returnCode": "0001",
            "returnDesc": "前端请求参数校验失败,单号或者单据类型为空",
            "returnFlag": "0"
          }
          res.send(returndata); //把数据返回
        } else {
          method(params).then(res1 => {
            returndata = res1;
            res.send(returndata); //把数据返回                 
          })
        }      
      });
      //绑定和侦听指定主机和端口上的连接
      var server = app.listen(30019, "10.18.6.19", function () {
        var host = server.address().address;
        var port = server.address().port;
        console.log("地址为 http://%s:%s", host, port);
      });
      //定义方法，调用wms出库单取消接口
      function cancelRKD(inparams) {
        return new Promise((resolve, reject) => {
          var http = require("http");
          var targetdata;
          if (inparams.docType === "SCRK") {
            targetdata= JSON.stringify({
              "data": {
                "ordernos": {
                  "warehouseId": "CS02",
                  "customerId": "FNLT",
                  "docNo": inparams.docNo,
                  "orderType": inparams.docType,
                  "erpCancelReason": ""
                }
              }
            });
          } else if (inparams.docType === "TLRK") {
            targetdata= JSON.stringify({
              "data": {
                "ordernos": {
                  "warehouseId": "CS01",
                  "customerId": "FNLT",
                  "docNo": inparams.docNo,
                  "orderType": inparams.docType,
                  "erpCancelReason": ""
                }
              }
            });
          }
          TraceInfo("targetdata:", targetdata);
          var adr = '/datahubjson/FluxWmsJsonApi/?method=cancelASN&apptoken=24B42D970E5D3DFE2EEE47B5DC39F925&timestamp=2022-10-25 09:15:00&sign=FNLT&format=JSON';
          adr = encodeURI(adr);
          TraceInfo("adr", adr);
          var opt = {
            hostname: '36.155.6.207',
            port: '38080',
            path: adr,
            method: 'POST',
            headers: {
              'Connection': 'keep-alive',
              'Content-Type': 'application/json;charset-utf-8'
            }
          }
          TraceInfo("opt", opt);
          var body = '';
          var req = http.request(opt, function (res) {
            TraceInfo("response: ", JSON.stringify(res.statusCode));
            res.on('data', function (data) {
              body += data;
            }).on('end', async function () {
              TraceInfo('body:', JSON.stringify(body));
              TraceInfo('body:', body);
              TraceInfo('body:', JSON.parse(body).error);
              //返回响应代码
              resolve(JSON.parse(body).Response.return);
            });
          }).on('error', function (e) {
            TraceInfo("error: ", JSON.stringify(e.message));
          })
          req.write(targetdata);
          req.end();
        })
      }
      //定义async方法，同步调用
      async function method(inparams) {
        var returncode = await cancelRKD(inparams);
        return returncode;
      }
    }
  
    onDestroy() {
      /** destroy script entry */
      TraceInfo("入库单取消接口APP取消部署");
    }
  }
  
  module.exports = App