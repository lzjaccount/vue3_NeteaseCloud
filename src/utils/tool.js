export function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};
export function padLeftZero(str) {
    return ('00' + str).substr(str.length);
};

//将毫秒转化为yyyy年mm月dd日 h:m:s的格式
export function myFormatDate(time) {
    let date = new Date(time)
    let Y = date.getFullYear()
    let M = (date.getMonth() + 1) >= 10 ? date.getMonth() + 1 : '0' + (date.getMonth() + 1)
    let d = (date.getDay() + 1) >= 10 ? date.getDay() + 1 : '0' + (date.getDay() + 1)
    let h = (date.getHours() + 1) >= 10 ? date.getHours() + 1 : '0' + (date.getHours() + 1)
    let m = (date.getMinutes() + 1) >= 10 ? date.getMinutes() + 1 : '0' + (date.getMinutes() + 1)
    let s = (date.getSeconds() + 1) >= 10 ? date.getSeconds() + 1 : '0' + (date.getSeconds() + 1)
    return Y + '年' + M + '月' + d + '日' + ' ' + h + ':' + m + ':' + s
}

//将秒转化为 03:56 这种格式
export function secToMinute(time) {
    let alltime = Math.round(time)
    let minute = Math.floor(alltime / 60) >= 10 ? Math.floor(alltime / 60) : '0' + Math.floor(alltime / 60)
    let sec = alltime - minute * 60

    return minute + ':' + (sec >= 10 ? sec : '0' + sec)
}


//将03:56转化为秒
export function minuteToSec(str) {
    let arr = str.split(':')
    let alltime = arr[0] * 60 + parseInt(arr[1])
    return alltime
}


//将大于万的数字换成1.2万格式
export function formatNumber(number) {
    if (number > 10000 && number < 100000000) {
        return (number / 10000).toFixed(2) + '万'
    } else if (number > 100000000) {
        return (number / 100000000).toFixed(2) + '亿'
    } else {
        return number
    }
}