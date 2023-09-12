class App {
    onCreate() {
      /** create script entry */
        TraceInfo("开始了");
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
            TraceInfo("cancelRKD","");
            const params = req.body.InParam.data;
            TraceInfo("",params);
            TraceInfo("",JSON.stringify(params));
            //调用方法，同步调用ks 3个接口 
            var returndata;
            method (params[0]).then(res1 => {
                returndata = res1;
                // var target_obj = {
                //     "resreturnCode":returndata
                // };
                res.send(returndata); //把数据返回                 
            })
        });
        //绑定和侦听指定主机和端口上的连接
        var server = app.listen(30019, "172.16.24.205", function () {
            var host = server.address().address;
            var port = server.address().port;
            console.log("地址为 http://%s:%s", host, port);
        });
        //定义方法，调用wms出库单取消接口
        function cancelRKD(docNo) {
          return new Promise((res, rej) => {
            var http = require("http"); 
            var targetdata = JSON.stringify({
              "data": {
                "ordernos": {
                  "warehouseId": "CS01",
                  "customerId": "FNLT",
                  "docNo": docNo,
                  "orderType": "SCRK",
                  "erpCancelReason": ""
                }
              }
            });
            TraceInfo("targetdata:",targetdata);
            var adr = '/datahubjson/FluxWmsJsonApi/?method=cancelASN&apptoken=24B42D970E5D3DFE2EEE47B5DC39F925&timestamp=2022-10-25 09:15:00&sign=FNLT&format=JSON';
            adr = encodeURI(adr);
            TraceInfo("adr",adr);
            var opt = {
                hostname: '36.155.6.207',
                port: '38080',
                path: adr,
                method: 'POST',
                headers: {
                    'Connection':'keep-alive',
                    'Content-Type': 'application/json;charset-utf-8'
                }
            }
            TraceInfo("opt",opt);
            var body = '';
            var req = http.request(opt, function (res2) {
              TraceInfo("response: ", JSON.stringify(res2.statusCode));
              res2.on('data', function (data) {
                  body += data;
              }).on('end', async function () {
                  TraceInfo('body:', JSON.stringify(body));
                  TraceInfo('body:', body);
                  TraceInfo('body:', JSON.parse(body).error);
                  //返回响应代码
                  res(JSON.parse(body).Response.return);
                  // if (JSON.parse(body).Response.return.returnCode === '0000' || JSON.parse(body).Response.return.returnCode === 'ED0345') {
                  //     //更新数据
                  //     SetData(res1.dataID).then();
                  // }
              });
            }).on('error', function (e) {
              TraceInfo("error: ", JSON.stringify(e.message));
            })
            req.write(targetdata);
            req.end(); 
          })
        }
        //定义async方法，同步调用
        async function method (docNum) {
          var returncode = await cancelRKD(docNum);
          return returncode;
        }
    }

    onDestroy() {
        /** destroy script entry */

    }
}

module.exports = App