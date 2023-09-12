debugger;
scanQrCode(0, res => {
    $Variable.釜编号 = res;
    ElementText3.text = res;
    var site = $Variable.釜编号;
    var line = '';
    switch (site) {
        case 'R0101A':
            line = '01';
            break;
        case 'R0101B':
            line = '02';
            break;
        case 'R0102A':
            line = '03';
            break;
        case 'R0102B':
            line = '04';
            break;
        case 'R1021A':
            line = '05';
            break;
        case 'R1021B':
            line = '06';
            break;
        case 'R1021C':
            line = '07';
            break;
        case 'R1031A':
            line = '08';
            break;
        case 'R1031B':
            line = '09';
            break;
        case 'R1031C':
            line = '10';
            break;
        case 'R1041A':
            line = '11';
            break;
        case 'R1041B':
            line = '12';
            break;
        case 'R1041C':
            line = '13';
            break;
        case 'R1041D':
            line = '14';
            break;
        default:
            var options ={
               title:'扫码异常',
               type:'warning',
               description:'扫码异常！',
               show_icon:true
            };
            ShowAlert(options);
    }
    //清除列表原有数据
    var listdata = VantList1.GetData();
    for (let j = 0; j < listdata.data.length; j++ ) {
        for (let j1 = 0; j1 < listdata.data[j].cellData.length; j1++ ) {
            VantList1.DeleteRow(listdata.data[j].cellData[j1].name, listdata.data[j].id);
        }
        
    }
    var objectID = "3603183167776751619";
    var fieldIDs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 257];
    var filter = `(f2 == "3")&&(f19 == "未打印")&&(f6 == "${line}")`;
    var filter1 = `(f2 == "9")&&(f19 == "未打印")&&(f6 == "${line}")`;
    var filter2 = `(f2 == "5")&&(f19 == "未打印")&&(f6 == "${line}")`;
    var filter3 = `(f2 == "6")&&(f19 == "未打印")&&(f6 == "${line}")`;
    RealtimeQueryThingRecord(objectID, fieldIDs, filter, function(res) {
        var dataSets = res.fieldValues;
        var lens = dataSets.length;
        if (lens !== 0) {
            var data_obj = {};
            var data_arr = [];
            for (let i = 0; i < lens; i++) {
                var data = {
                    request_no:'ZJ' + dataSets[i].values[19].uint64Value,//请检编号
                    inspection_type:'洗釜报检',//报检类型
                    sample_code:dataSets[i].values[3].stringValue,//物料编码
                    sample_name:dataSets[i].values[4].stringValue,//物料名称
                    sample_point:dataSets[i].values[5].stringValue,//采样地点
                    production_date:dataSets[i].values[6].stringValue,//生产日期
                    request_date:dataSets[i].values[7].stringValue,//报检日期
                    batch_no:dataSets[i].values[8].stringValue,//生产批号
                    batch_number:dataSets[i].values[9].stringValue,//批次数量
                    c_Supplier_Code:dataSets[i].values[10].stringValue,//供应商代码
                    c_Supplier_Name:dataSets[i].values[11].stringValue,//供应商名称
                    print_status:dataSets[i].values[18].stringValue,//打印状态
                    title:dataSets[i].values[5].stringValue + '洗釜报检'//标题
                };
                data_obj = {};
                data_obj.titleHtmlClassName = "list-cell-title"; // 自定义标题区域类名，可自行配置，在样式配置中可选择该类名配置
                data_obj.titleHtmlContent = createItemTitleHtml(data); // 自定义描述区域内容(html文本)，若配置此次项，则title不生效
                setTimeout(()=>{
                    addClick()
                },50)
                data_obj.name = `${i+1}`; //单元格标识符
                //value:"内容",//右侧内容
                //valueHtmlClassName:"list-cell-value", // 自定义内容区域类名，可自行配置，在样式配置中可选择该类名配置
                //valueHtmlContent:"", // 自定义描述区域内容(html文本)，若配置此次项，则value不生效
                data_obj.labelHtmlClassName = "list-cell-label"; // 自定义描述区域类名，可自行配置，在样式配置中可选择该类名配置
                data_obj.labelHtmlContent = createItemLabelHtml(data); // 自定义描述区域内容(html文本)，若配置此次项，则label不生效
                data_obj.rightData = [{
                    id: 0, //右侧按钮标识符
                    text: "删除", //右侧按钮描述
                    type: "danger", //按钮类型
                }, {
                    id: 1, //右侧按钮标识符
                    text: "收藏", //右侧按钮描述
                    type: "primary", //按钮类型
                }];
                data_obj.leftData = [{
                    id: 0, //左侧按钮标识符
                    text: "选择", //左侧按钮描述
                    type: "primary", //按钮类型
                }];
                //data_arr.push(data_obj);
                var row = {
                    id: 1,
                    cellData:data_obj
                };
                var res11 = VantList1.AppendRow(row);
                console.log(res11);   
            }
            RealtimeQueryThingRecord(objectID, fieldIDs, filter1, function(res1) {
                var dataSets1 = res1.fieldValues;
                var lens1 = dataSets1.length;
                if (lens1 !== 0) {
                    var data_obj1 = {};
                    var data_arr1 = []; 
                    for (let i1 = 0; i1 < lens1; i1++) {
                        var data1 = {
                            request_no:'ZJ' + dataSets1[i1].values[19].uint64Value,//请检编号
                            inspection_type:'混合溶剂报检',//报检类型
                            sample_code:dataSets1[i1].values[3].stringValue,//物料编码
                            sample_name:dataSets1[i1].values[4].stringValue,//物料名称
                            sample_point:dataSets1[i1].values[5].stringValue,//采样地点
                            production_date:dataSets1[i1].values[6].stringValue,//生产日期
                            request_date:dataSets1[i1].values[7].stringValue,//报检日期
                            batch_no:dataSets1[i1].values[8].stringValue,//生产批号
                            batch_number:dataSets1[i1].values[9].stringValue,//批次数量
                            c_Supplier_Code:dataSets1[i1].values[10].stringValue,//供应商代码
                            c_Supplier_Name:dataSets1[i1].values[11].stringValue,//供应商名称
                            print_status:dataSets1[i1].values[18].stringValue,//打印状态
                            title:dataSets1[i1].values[5].stringValue + '混合溶剂报检'//标题
                        };
                        data_obj1 = {};
                        data_obj1.titleHtmlClassName = "list-cell-title"; // 自定义标题区域类名，可自行配置，在样式配置中可选择该类名配置
                        data_obj1.titleHtmlContent = createItemTitleHtml(data1); // 自定义描述区域内容(html文本)，若配置此次项，则title不生效
                        setTimeout(()=>{
                            addClick()
                        },50)
                        data_obj1.name = `${i1+1}`; //单元格标识符
                        //value:"内容",//右侧内容
                        //valueHtmlClassName:"list-cell-value", // 自定义内容区域类名，可自行配置，在样式配置中可选择该类名配置
                        //valueHtmlContent:"", // 自定义描述区域内容(html文本)，若配置此次项，则value不生效
                        data_obj1.labelHtmlClassName = "list-cell-label"; // 自定义描述区域类名，可自行配置，在样式配置中可选择该类名配置
                        data_obj1.labelHtmlContent = createItemLabelHtml(data1); // 自定义描述区域内容(html文本)，若配置此次项，则label不生效
                        data_obj1.rightData = [{
                            id: 0, //右侧按钮标识符
                            text: "删除", //右侧按钮描述
                            type: "danger", //按钮类型
                        }, {
                            id: 1, //右侧按钮标识符
                            text: "收藏", //右侧按钮描述
                            type: "primary", //按钮类型
                        }];
                        data_obj1.leftData = [{
                            id: 0, //左侧按钮标识符
                            text: "选择", //左侧按钮描述
                            type: "primary", //按钮类型
                        }];
                        //data_arr.push(data_obj);
                        var row1 = {
                            id: 2,
                            cellData:data_obj1
                        };
                        var res12 = VantList1.AppendRow(row1);
                        console.log(res12);   
                    }
                    RealtimeQueryThingRecord(objectID, fieldIDs, filter2, function(res2) {
                        var dataSets2 = res2.fieldValues;
                        var lens2 = dataSets2.length;
                        if (lens2 !== 0) {
                            var data_obj2 = {};
                            var data_arr2 = []; 
                            for (var i2 = 0; i2 < lens2; i2++) {
                                var data2 = {
                                    request_no:'ZJ' + dataSets2[i2].values[19].uint64Value,//请检编号
                                    inspection_type:'混合溶质报检',//报检类型
                                    sample_code:dataSets2[i2].values[3].stringValue,//物料编码
                                    sample_name:dataSets2[i2].values[4].stringValue,//物料名称
                                    sample_point:dataSets2[i2].values[5].stringValue,//采样地点
                                    production_date:dataSets2[i2].values[6].stringValue,//生产日期
                                    request_date:dataSets2[i2].values[7].stringValue,//报检日期
                                    batch_no:dataSets2[i2].values[8].stringValue,//生产批号
                                    batch_number:dataSets2[i2].values[9].stringValue,//批次数量
                                    c_Supplier_Code:dataSets2[i2].values[10].stringValue,//供应商代码
                                    c_Supplier_Name:dataSets2[i2].values[11].stringValue,//供应商名称
                                    print_status:dataSets2[i2].values[18].stringValue,//打印状态
                                    title:dataSets2[i2].values[5].stringValue + '混合溶质报检'//标题
                                };
                                data_obj2 = {};
                                data_obj2.titleHtmlClassName = "list-cell-title"; // 自定义标题区域类名，可自行配置，在样式配置中可选择该类名配置
                                data_obj2.titleHtmlContent = createItemTitleHtml(data2); // 自定义描述区域内容(html文本)，若配置此次项，则title不生效
                                setTimeout(()=>{
                                    addClick()
                                },50)
                                data_obj2.name = `${i2+1}`; //单元格标识符
                                //value:"内容",//右侧内容
                                //valueHtmlClassName:"list-cell-value", // 自定义内容区域类名，可自行配置，在样式配置中可选择该类名配置
                                //valueHtmlContent:"", // 自定义描述区域内容(html文本)，若配置此次项，则value不生效
                                data_obj2.labelHtmlClassName = "list-cell-label"; // 自定义描述区域类名，可自行配置，在样式配置中可选择该类名配置
                                data_obj2.labelHtmlContent = createItemLabelHtml(data2); // 自定义描述区域内容(html文本)，若配置此次项，则label不生效
                                data_obj2.rightData = [{
                                    id: 0, //右侧按钮标识符
                                    text: "删除", //右侧按钮描述
                                    type: "danger", //按钮类型
                                }, {
                                    id: 1, //右侧按钮标识符
                                    text: "收藏", //右侧按钮描述
                                    type: "primary", //按钮类型
                                }];
                                data_obj2.leftData = [{
                                    id: 0, //左侧按钮标识符
                                    text: "选择", //左侧按钮描述
                                    type: "primary", //按钮类型
                                }];
                                //data_arr.push(data_obj);
                                var row2 = {
                                    id: 3,
                                    cellData:data_obj2
                                };
                                var res13 = VantList1.AppendRow(row2);    
                            }
                            RealtimeQueryThingRecord(objectID, fieldIDs, filter3, function(res3) {
                                var dataSets3 = res3.fieldValues;
                                var lens3 = dataSets3.length;
                                if (lens3 !== 0) {
                                    var data_obj3 = {};
                                    var data_arr3 = []; 
                                    for (var i3 = 0; i3 < lens3; i3++) {
                                        var data3 = {
                                            request_no:'ZJ' + dataSets3[i3].values[19].uint64Value,//请检编号
                                            inspection_type:'混合添加剂报检',//报检类型
                                            sample_code:dataSets3[i3].values[3].stringValue,//物料编码
                                            sample_name:dataSets3[i3].values[4].stringValue,//物料名称
                                            sample_point:dataSets3[i3].values[5].stringValue,//采样地点
                                            production_date:dataSets3[i3].values[6].stringValue,//生产日期
                                            request_date:dataSets3[i3].values[7].stringValue,//报检日期
                                            batch_no:dataSets3[i3].values[8].stringValue,//生产批号
                                            batch_number:dataSets3[i3].values[9].stringValue,//批次数量
                                            c_Supplier_Code:dataSets3[i3].values[10].stringValue,//供应商代码
                                            c_Supplier_Name:dataSets3[i3].values[11].stringValue,//供应商名称
                                            print_status:dataSets3[i3].values[18].stringValue,//打印状态
                                            title:dataSets3[i3].values[5].stringValue + '混合添加剂报检'//标题
                                        };
                                        data_obj3 = {};
                                        data_obj3.titleHtmlClassName = "list-cell-title"; // 自定义标题区域类名，可自行配置，在样式配置中可选择该类名配置
                                        data_obj3.titleHtmlContent = createItemTitleHtml(data3); // 自定义描述区域内容(html文本)，若配置此次项，则title不生效
                                        setTimeout(()=>{
                                            addClick()
                                        },50)
                                        data_obj3.name = `${i3+1}`; //单元格标识符
                                        //value:"内容",//右侧内容
                                        //valueHtmlClassName:"list-cell-value", // 自定义内容区域类名，可自行配置，在样式配置中可选择该类名配置
                                        //valueHtmlContent:"", // 自定义描述区域内容(html文本)，若配置此次项，则value不生效
                                        data_obj3.labelHtmlClassName = "list-cell-label"; // 自定义描述区域类名，可自行配置，在样式配置中可选择该类名配置
                                        data_obj3.labelHtmlContent = createItemLabelHtml(data3); // 自定义描述区域内容(html文本)，若配置此次项，则label不生效
                                        data_obj3.rightData = [{
                                            id: 0, //右侧按钮标识符
                                            text: "删除", //右侧按钮描述
                                            type: "danger", //按钮类型
                                        }, {
                                            id: 1, //右侧按钮标识符
                                            text: "收藏", //右侧按钮描述
                                            type: "primary", //按钮类型
                                        }];
                                        data_obj3.leftData = [{
                                            id: 0, //左侧按钮标识符
                                            text: "选择", //左侧按钮描述
                                            type: "primary", //按钮类型
                                        }];
                                        //data_arr.push(data_obj);
                                        var row3 = {
                                            id: 4,
                                            cellData:data_obj3
                                        };
                                        var res14 = VantList1.AppendRow(row3);    
                                    }    
                                }    
                            })
                        }
                        
                    })
                }   
            })
        }
    })
})   
/**
 * @method createItemTitleHtml
 * @description 创建一个标题html片段，用于自定义插槽内容 list titleHtmlContent 属性
 * @param {object} item 一条列表的业务数据
 * @returns {string} 原型画面html片段
 */
function createItemTitleHtml(item) {
    // 创建一个html文本片段
    let html = `<span style="font-size: 14px;font-weight: bold;">${item.title}</span>`;
    let statusBGColor = "#1989fa";
    // 根据任务状态配置不同的标签颜色
    switch (item.print_status) {
        case "已打印":
            statusBGColor = "#1989fa";
            break;
        case "进行中":
            statusBGColor = "#07c160";
            break;
        case "未打印":
            statusBGColor = "#ee0a24";
            break;
        default:
            break;
    }
    html += `<span style="font-size: 14px;line-height:16px; background-color: ${statusBGColor};color: white;font-weight: bold;padding: 0 4px">${item.print_status}</span>`;
    html += `<span class="span1"; style="font-size:14px; color:#1989fa; font-weight:bold; padding: 0 8px; float:right";>打印</span> `;
    // 返回根据业务数据原型画面编写html文本片段
    return html;
}
/**
 * @method createItemLabelHtml
 * @description 创建一个内容html片段，用于自定义插槽内容 list labelHtmlContent 属性
 * @param {object} item 一条列表的业务数据
 * @returns {string} 原型画面html片段
 */
function createItemLabelHtml(item) {
    // 返回根据业务数据原型画面编写html文本片段
    let html = `<div style="display:flex">
                    <div style="width: 50%; display:flex; flex-direction: column">
                        <span>请检编号: ${item.request_no}</span>
                        <span>报检类型: ${item.inspection_type}</span>
                        <span>报检时间: ${item.request_date}</span>
                    </div>
                    <div style="width: 50%; display:flex; flex-direction: column">
                        <span>物料编码: ${item.sample_code}</span>
                        <span>物料名称: ${item.sample_name}</span>
                        <span>采样地点: ${item.sample_point}</span>
                        <span>生产批号: ${item.batch_no}</span>
                    </div>
                </div>`;
    return html;
}
function addClick () {
    // 打印增加点击事件
    Array.from(VantList1.$el.getElementsByClassName('van-swipe-cell')).forEach(item=>{
        item.getElementsByClassName('span1')[0].onclick = function (event) {
            debugger;
            var 请检编号 = this.parentElement.nextElementSibling.children[0].children[0].children[0].children[0].innerText;
            var 报检类型 = this.parentElement.nextElementSibling.children[0].children[0].children[0].children[1].innerText;
            var 报检时间 = this.parentElement.nextElementSibling.children[0].children[0].children[0].children[2].innerText;
            var 物料编码 = this.parentElement.nextElementSibling.children[0].children[0].children[0].nextElementSibling.children[0].innerText;
            var 物料名称 = this.parentElement.nextElementSibling.children[0].children[0].children[0].nextElementSibling.children[1].innerText;
            var 采样地点 = this.parentElement.nextElementSibling.children[0].children[0].children[0].nextElementSibling.children[2].innerText;
            var 生产批号 = this.parentElement.nextElementSibling.children[0].children[0].children[0].nextElementSibling.children[3].innerText;
            sessionStorage.setItem('请检编号', 请检编号);
            sessionStorage.setItem('报检类型', 报检类型);
            sessionStorage.setItem('报检时间', 报检时间);
            sessionStorage.setItem('物料编码', 物料编码);
            sessionStorage.setItem('物料名称', 物料名称);
            sessionStorage.setItem('采样地点', 采样地点);
            sessionStorage.setItem('生产批号', 生产批号);
            var pageName = "PDA_质检标签打印";
            var options = {type:1,};
            ShowPage(pageName,options)
            //console.log('2',event)
        }
    })
}