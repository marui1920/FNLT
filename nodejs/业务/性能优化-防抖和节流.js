/*
 *防抖函数-防抖是指在一定时间内，多次触发同一事件，只执行最后一次，或者只在开始时执行一次。防抖的应用场景比较广泛，例如在用户输入搜索关键词时，可以使用防抖来避免频繁地向服务器发送请求。
 *@param {Function} fn-需要执行的函数
 *@param {Number} delay-时间延迟参数
 *@return {Function} 返回一个新的函数
 */
function debounce(fn, delay) {
    // 定义一个变量来保存定时器的返回值
    let timer = null;
    // 返回一个新的函数
    return function () {
        // 保存函数执行时的参数
        const args = arguments;
        // 如果已经存在定时器，则清除之前的定时器
        if (timer) clearTimeout(timer);
        // 创建一个新的定时器
        timer = setTimeout(() => {
            // 在延迟结束后执行传入的函数，并传入之前保存的参数
            fn.apply(this, args);
        }, delay);
    }
}
function aa() {
    console.log('延时1000ms');
}
var a = debounce(aa, 1000)
a();
/*
 * 节流函数-节流是指在一定时间内，多次触发同一事件，只执行一次。节流的应用场景也比较广泛，例如在用户滚动页面时，可以使用节流来避免频繁地触发函数。
 * @param {Function} fn - 需要执行的函数
 * @param {Number} delay - 时间延迟参数
 * @return {Function} 返回一个新的函数
 */
function throttle(fn, delay) {
    // 定义一个变量来保存定时器的返回值
    let timer = null;
    // 返回一个新的函数
    return function () {
        // 保存函数执行时的参数
        const args = arguments;
        // 如果已经存在定时器，则直接返回
        if (timer) return;
        // 创建一个新的定时器
        //fn.apply(this, args); //在延迟前执行传入的函数，并传入之前保存的参数
        timer = setTimeout(() => {
            // 在延迟结束后执行传入的函数，并传入之前保存的参数
            fn.apply(this, args);
            // 执行完毕后将定时器变量设置为 null，以便下一次调用函数
            timer = null;
        }, delay);
    }
}