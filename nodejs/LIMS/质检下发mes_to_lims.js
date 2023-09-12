function main() {
    TraceInfo("------main 函数执行操作---------");
    var https = require("https"); //引入http模块
    GetData().then(res => {
        if (res.length !== 0) {
            TraceInfo("",res);
            var targetdata = res;
            var paramsData = JSON.stringify({
                "method": "api.Lpsh.registerTestRequest",
                "data": {
                    "testRequests": res.data2
                }
            })
            var opt = {
                hostname: 'qms.fenlet.cn',
                port: '',
                path: '/servlet/limsapi',
                method: 'POST',
                rejectUnauthorized: false,
                headers: {
                    'Content-Type': 'application/json',
                    'Cookie': 'JSESSIONID=2894046C26817833B84C0295B0CE72D2'
                }
            }
            TraceInfo("",paramsData); 
            TraceInfo("",opt);
            var body = '';
            var req = https.request(opt, function (res1) {
                TraceInfo("response: ", JSON.stringify(res1.statusCode));
                res1.on('data', function (data) {
                    body += data;
                }).on('end', async function () {
                    TraceInfo('body:', JSON.stringify(body));
                    TraceInfo('body:', body);
                    TraceInfo('body:', JSON.parse(body).error);
                    //下发数据成功
                    var errorCode = JSON.parse(body).error;
                    TraceInfo('errorCode :', errorCode);
                    if (errorCode === "0") {
                    //if (true) {
                        var dataid_arr = [];
                        var requestno_arr = [];
                        TraceInfo('targetdata:', targetdata)
                        for (let i = 0; i < targetdata.data1.length; i++) {
                            var dataid = targetdata.data1[i].dataid;
                            var requestno = targetdata.data2[i].request_no;
                            dataid_arr.push(dataid);
                            requestno_arr.push(requestno);
                        } 
                        TraceInfo('dataid_arr:', dataid_arr);
                        TraceInfo('requestno_arr:', requestno_arr);
                        //更新数据
                        SetData(dataid_arr,requestno_arr).then();

                    }
                });
            }).on('error', function (e) {
                TraceInfo("error: ", JSON.stringify(e.message));
            })
            req.write(paramsData);
            req.end();

        }
                
    })
}

function scheduleQuery(func, timeSpan, years = [], months = [], dates = [], hours = [], minutes = [], seconds = []) {
    /**
     * func:
     *      待执行的脚本函数; func()可支持无参和带参函数；无参函数只需要传递函数名即可;
     *      带参函数则把func的函数同步写在scheduleQuery函数的参数列表中，注意写在timespan前
     *      并且本函数的调用也要传入相关参数，内部代码也要传入参数。
     * timeSpan:
     *      时间间隔，每隔多久查一下时间；当其他时间参数都为空值时，这个参数就是待执行脚本的周期
     * years:
     *      指定运行的年份，默认为空数组，即每年都可以执行
     * months:
     *      指定运行的月份，默认为空数组，即每个月都可以执行，数组内的值范围为0至11
     * dates:
     *      指定运行的天，默认为空数组，即每天都可以执行，数组内的取值范围为0至30
     * hours:
     *      指定运行的小时，默认为空数组，即每小时都可以执行，数组内的取值范围为0至23
     * minutes:
     *      指定运行的分钟，默认为空数组，即每分钟都可以执行，数组内的取值范围为0至59
     * seconds:
     *      指定运行的秒数，默认为空数组，即每秒都可以执行，取值范围为0至59; 
     *      参数seconds不建议指定;
     *      主要原因是：
     *          scheduleQuery 执行的秒数不一定会恰好在你指定的范围内，从而无法递归调用；
     *          func 函数的执行时间不一定会在秒级完成。
     * 
     * 调用方式：
     *      1. scheduleQuery(func, 1000*60);  // 每隔 timespan（1分钟） 执行一次 func
     *      2. scheduleQuery(func, timeSpan, [], [], [], exeu_hours, [0,30], []); // 指定小时和分钟执行
     *      3. scheduleQuery(func, func_para1, func_para2, 1000*60);  // 每隔 timespan（1分钟） 执行一次带参函数func(func_para1, func_para2)
     *      4. scheduleQuery(func, func_para1, func_para2, timeSpan, [], [], [], exeu_hours, [0,30], []); // 指定小时和分钟执行
     * 
     */
    // todo 参数的合法性校验
    // 设置定时器触发待执行的脚本
    const intervalQuery = setInterval(
        () => {
            var now = new Date(); // 获取当前时间
            // 声明六个时间标志
            var yearFlag = false, monthFlag = false, dateFlag = false;
            var hourFlag = false, minuteFlag = false, secondFlag = false;
            if (years.length == 0 || years.includes(now.getFullYear())) {
                // 默认每年都执行 or 当前年份在指定年份数组内
                yearFlag = true;
            }
            if (months.length == 0 || months.includes(now.getMonth())) {
                monthFlag = true;
            }
            if (dates.length == 0 || dates.includes(now.getDate())) {
                dateFlag = true;
            }
            if (hours.length == 0 || hours.includes(now.getHours())) {
                hourFlag = true;
            }
            if (minutes.length == 0 || minutes.includes(now.getMinutes())) {
                minuteFlag = true;
            }
            if (seconds.length == 0 || seconds.includes(now.getSeconds())) {
                secondFlag = true;
            }
            // 所有时间参数都符合要求
            if (yearFlag && monthFlag && dateFlag && hourFlag && minuteFlag && secondFlag) {
                func(); // 待执行脚本
                clearInterval(intervalQuery); // 清除当前的这个定时器
                scheduleQuery(func, timeSpan, years, months, dates, hours, minutes, seconds); // 递归调用设置下一次执行时间
            }
        },
        timeSpan); // 每隔 timespan 查询一次时间，判断是否符合时间要求
}
//自定义函数，返回时间对象
function intervalTime(diff, inDate) {
    let interval = diff || 0;
    let newDate = new Date();
    if (inDate) {
        newDate = new Date(inDate);
    }
    newDate.setDate(newDate.getDate() + interval);
    let timestamp = newDate.getTime(); //时间戳
    let year = newDate.getFullYear();
    let month = newDate.getMonth() < 9 ? `0${1 + newDate.getMonth()}` : 1 + newDate.getMonth();
    let day = newDate.getDate() < 10 ? `0${newDate.getDate()}` : newDate.getDate();
    let hour = newDate.getHours() < 10 ? `0${newDate.getHours()}` : newDate.getHours();
    let minute = newDate.getMinutes() < 10 ? `0${newDate.getMinutes()}` : newDate.getMinutes();
    let second = newDate.getSeconds() < 10 ? `0${newDate.getSeconds()}` : newDate.getSeconds();
    let millisecond = newDate.getMilliseconds(); //毫秒
    let dateTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    let time = `${hour}:${minute}:${second}`;
    let date = `${year}-${month}-${day}`;
    let timeExport = `${year}${month}${day}${hour}${minute}${second}${millisecond}`;
    let outTime = {
        year: year,
        month: month,
        day: day,
        hour: hour,
        minute: minute,
        second: second,
        dateTime: dateTime,
        time: time,
        date: date,
        timestamp: timestamp,
        timeExport: timeExport,
    };
    return outTime;
}
//查询符合条件数据，返回
async function GetData() {
    var objectID = "3603183167776751619";
    var fieldIDs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 257];
    var filter = `f17 == "未下发"`;
    TraceInfo("函数执行前");
    var returndata = await RealtimeQueryThingRecord(objectID, fieldIDs, filter).then(function(res) {
        if (!res.ret) {
            //业务处理
            TraceInfo("函数执行中");
            console.log(res);
            var dataSets = res.fieldValues;
            var lens = dataSets.length;
            TraceInfo("",dataSets);
            if (lens !== 0) {
                //for循环重组数组
                var data = {};
                var data_obj2 = {};
                var data_arr2 = [];
                var data_obj1 = {};
                var data_arr1 = [];
                var intervalTime1 = intervalTime();
                var request_date = intervalTime1.dateTime; 
                // var year = intervalTime1.year;
                // var month = intervalTime1.month;
                // var day = intervalTime1.day;
                // var yearA = year.toString();
                // var monthA = month.toString();
                // var dayA = day.toString();
                // var num = Math.random() * 9000 + 1000;
                // num = (parseInt(num)).toString();
                // var request_no = 'ZJ' + yearA.substring(2, 4) + monthA + dayA + num;                
                for (var i = 0; i < lens; i++) {
                    data_obj2 = {};
                    data_obj1 = {};
                    //request_no += ("000" + i).slice(-4);
                    //data_obj.request_no = 'ZJ' + dataSets[i].values[17].uint64Value;
                    data_obj1.dataid = dataSets[i].values[17].uint64Value;
                    if (i < 10) {
                        data_obj2.request_no = 'ZJ' + '-' + Math.random().toString(16).slice(2) + '-0' + i;
                    } else {
                        data_obj2.request_no = 'ZJ' + '-' + Math.random().toString(16).slice(2) + '-' + i;
                    }                   
                    data_obj2.inspection_type = dataSets[i].values[1].stringValue;
                    data_obj2.org_code = "FT01";
                    data_obj2.sample_code = dataSets[i].values[3].stringValue;
                    data_obj2.sample_name = dataSets[i].values[4].stringValue;
                    data_obj2.sample_point = dataSets[i].values[5].stringValue;
                    data_obj2.production_date = dataSets[i].values[6].stringValue;
                    data_obj2.request_date = request_date;
                    //data_obj.request_date = dataSets[i].values[7].stringValue;
                    data_obj2.batch_no = dataSets[i].values[8].stringValue;
                    data_obj2.batch_number = dataSets[i].values[9].stringValue;
                    data_obj2.c_Supplier_Code = dataSets[i].values[10].stringValue;
                    data_obj2.c_Supplier_Name = dataSets[i].values[11].stringValue;
                    data_obj2.request_person = "MES";
                    data_obj2.request_dept = "MES";
                    data_obj2.batch_bh = "";
                    data_obj2.batch_bh_no = "";
                    data_arr1.push(data_obj1);//dataid
                    data_arr2.push(data_obj2);//下发数据
                }
                TraceInfo("data_arr1:",data_arr1);
                TraceInfo("data_arr2:",data_arr2);
                data.data1 = data_arr1;
                data.data2 = data_arr2;
                return data;
            }
        }
    }) 
    return returndata;         
}
async function SetData(recordIDs,requestno) {
    var objectID = "3603183167776751619";
    //var recordIDs=["1459166279268040719","1459166279268040720"];
    var arr = [];
    var obj = {};
    for (let i = 0; i < recordIDs.length; i++) {
        obj = {};
        var request_no = requestno[i];
        obj.keyValueList = [{"key":1,"value":{stringValue:`${request_no}`}},{"key":17,"value":{stringValue:"已下发"}}];
        //arr.push(JSON.stringify(obj));
        arr.push(obj);
    }
    var recordValues = arr;
    TraceInfo("recordValues",recordValues);
    await RealtimeUpdateThingRecord(objectID,recordIDs,recordValues).then(function (res) {
        if ( !res.ret ) {
            //业务处理
            TraceInfo("res",res);
        }
    });
}
// 导出函数
module.exports = {
    main: main,
    scheduleQuery: scheduleQuery,
};