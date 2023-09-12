class App {
    onCreate() {
      /** create script entry */
      debugger;
      TraceInfo("开始了");
      const express = require("express");
      const bodyParser = require("body-parser"); //解析,用req.body获取post参数
      const app = express();
      app.use(bodyParser.json());
      app.use(bodyParser.urlencoded({
          extended: false
      }));
      app.post("/oauth/token", function (req, res) {
          TraceInfo("/oauth/token","");
          const params = req.body;
          TraceInfo("",params);
          TraceInfo("",JSON.stringify(params));
          //TraceInfo("JSON.parse(params).clientId:",JSON.parse(params).clientId);
          //TraceInfo("JSON.parse(params).clientSecret:",JSON.parse(params).clientSecret);
          if (params.client_id === "BC6652DD88C76644" && params.client_secret === "329D0D3D7B410CAC8057AEE5D4F5E541" ) {
            var obj = {
              "access_token": "TNLT",
              "expires_in": 3600,
              "refresh_token": "TNLT",
              "token_type": "bearer"
            };
            //传送HTTP响应
            res.send(obj); //把数据返回             
          }
      });
      //绑定和侦听指定主机和端口上的连接
      var server = app.listen(30020, "172.16.24.205", function () {
          var host = server.address().address;
          var port = server.address().port;
          console.log("地址为 http://%s:%s", host, port);
      });

    }

    onDestroy() {
        /** destroy script entry */

    }
}

module.exports = App