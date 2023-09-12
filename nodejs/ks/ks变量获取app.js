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
        app.post("/getKSValue", function (req, res) {
            TraceInfo("getKSValue","");
            const params = req.body.InParam.data;
            TraceInfo("",params);
            TraceInfo("",JSON.stringify(params));
            //调用方法，同步调用ks 3个接口 
            var returndata;
            asyncFun(params).then(res1 => {
                returndata = res1;
                var target_obj = {
                    "res":returndata
                };
                res.send(target_obj); //把数据返回                 
            })
        });
        //绑定和侦听指定主机和端口上的连接
        var server = app.listen(30015, "172.16.24.205", function () {
            var host = server.address().address;
            var port = server.address().port;
            console.log("地址为 http://%s:%s", host, port);
        });
        //封装方法，获取kstoken
        function getKStoken() {
            return new Promise((res, rej) => {
                const http = require('http');
                http.get('http://116.128.234.50:9433/api/v1/GetToken?UserName=KS1&PassWord=B301F491798159CF0971D06621B3CF96', (response) => {
                    let todo = '';
                    // called when a data chunk is received.
                    response.on('data', (chunk) => {
                        todo += chunk;
                    });
                    // called when the complete response is received.
                    response.on('end', () => {
                        TraceInfo("todo:",todo);
                        var aa = todo.replace(/\n/g, "");
                        var token = JSON.parse(aa).Token;
                        TraceInfo("token:",token);
                        console.log(token);
                        res(token);
                    });
                }).on("error", (error) => {
                    TraceInfo("Error: " + error.message);
                });
            })
        }
        //封装方法，获取ks变量
        /*inparam：ks变量，数组
            kstoken：token
        */
        function getKSvalue(inparam, kstoken) {
            return new Promise((res, rej) => {
                const http = require('http');
                var paramsData = JSON.stringify({
                    "objs": inparam
                })
                var opt = {
                    hostname: '116.128.234.50',
                    port: '9433',
                    path: '/api/v1/ReadRealdata',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'token': kstoken
                    }
                }
                TraceInfo("", paramsData);
                TraceInfo("", opt);
                var body = '';
                var req = http.request(opt, function (res11) {
                    TraceInfo("response: ", JSON.stringify(res11.statusCode));
                    res11.on('data', function (data) {
                        body += data;
                    }).on('end', async function () {
                        TraceInfo('body:', body);
                        var bb = body.replace(/\n/g, "");
                        var bb1 = bb.substring(0, 37);
                        var bb2 = bb.substring(38, bb.length-2);
                        var bb3 = JSON.parse(bb1 + bb2 + '}').data;
                        TraceInfo('bb3:', bb3);
                        res(bb3);
                    });
                }).on('error', function (e) {
                    TraceInfo("error: ", JSON.stringify(e.message));
                })
                req.write(paramsData);
                req.end();
            })
        }
        //封装方法，释放kstoken
        /*
            kstoken：token
        */  
        function deleteKStoken(kstoken) {
            return new Promise((res, rej) => {
                TraceInfo("开始执行释放kstoken");
                const http = require('http');
                var opt = {
                    hostname: '116.128.234.50',
                    port: '9433',
                    path: '/api/v1/DelToken',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Token': kstoken
                    }
                }
                TraceInfo("", opt);
                var body = '';
                var req = http.request(opt, function (res12) {
                    TraceInfo("response: ", JSON.stringify(res12.statusCode));
                    res12.on('data', function (data) {
                        body += data;
                    }).on('end', async function () {
                        TraceInfo('body:', body);
                        res(JSON.parse(body).message);
                    });
                }).on('error', function (e) {
                    TraceInfo("error: ", JSON.stringify(e.message));
                })
                req.write("");
                req.end();
            })
        }  
        //封装方法，同步调用ks 3个接口  
        /*inparam：ks变量，数组
        */              
        async function asyncFun(inparams) {
            var token = await getKStoken();
            TraceInfo("token: ", token);
            var ksdata = await getKSvalue(inparams, token);
            TraceInfo("ksdata:", ksdata);
            var message = await deleteKStoken(token);
            TraceInfo("message:", message);
            return ksdata;
        }
    }
    onDestroy() {
        /** destroy script entry */
    }
}
module.exports = App