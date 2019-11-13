;(function(global, factory) {
    // UMD 加载方案
    if (typeof exports === "object" && typeof module !== "undefined") {
        module.exports = factory()
        return
    }
    if (typeof global.define === "function" && global.define.amd) {
        global.define(factory)
        return
    }
    global.dateFn = factory()
})(window, function() {
    "use strict"

    // 星期几 中文
    var weekDayArr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]
    var weekDayArrE = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"]
    var weekDayArrF = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"]
    var oneDayNum = 24 * 60 * 60 * 1000

    // 只保留年月日
    function wipeOut(date, isWipe) {
        var t = date.getTime()
        if (isWipe) {
            t = Math.floor(t / oneDayNum) * oneDayNum
        }
        return new Date(t)
        //console.log('date', date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate())
        // return new Date(date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate());
    }

    // 创建时间对象
    // date,表示时间的对象(date，字符串，数字)
    // 是否需要去 时分秒毫秒
    function parse(date, isWipe) {
        if (typeof date == "boolean") {
            isWipe = date
            date = null
        }
        // 日期
        var val
        if (date && date.constructor == "Date") {
            return wipeOut(date, isWipe)
        }

        if (typeof date == "string") {
            date = date
                .replace(/^(\d{4})(\d{2})(\d{2})(\d{2})?(\d{2})?(\d{2})?$/, function(str, Y, M, D, h, m, s) {
                    return Y + "/" + M + "/" + D + " " + (h || "00") + ":" + (m || "00") + ":" + (s || "00")
                })
                .replace(/\-/g, "/")
                .replace(/T/, " ")
                .replace(/\.\d+$/, "")
        }

        return wipeOut(new Date(date || undefined), isWipe)
    }

    // 格式化
    function format(str, arr, info) {
        if (!str) {
            // 无格式化字符串
            return info
        }
        str = str.replace(/<(\w+):(.*?)>/g, function(s0, s1, s2) {
            var val = info[s1]
            if (val) {
                return val + s2
            }
            return ""
        })
        for (var i = 0; i < arr.length; i += 1) {
            str = str.replace(new RegExp(arr[i], "g"), info[arr[i]])
        }
        return str
    }

    // 格式化日期
    // formatStr为格式化日期
    var parseArr = "YYYY,YY,MM,M,DD,D,hh,h,mm,m,ss,s,w,EW,FW,W,X".split(",")
    function get(date, formatStr) {
        date = parse(date)
        var YYYY = date.getFullYear()
        var YY = date.getYear()
        var M = date.getMonth() + 1
        var MM = ("0" + M).slice(-2)
        var D = date.getDate()
        var DD = ("0" + D).slice(-2)
        var h = date.getHours()
        var hh = ("0" + h).slice(-2)
        var m = date.getMinutes()
        var mm = ("0" + m).slice(-2)
        var s = date.getSeconds()
        var ss = ("0" + s).slice(-2)
        var w = date.getDay()
        var EW = weekDayArrE[w]
        var FW = weekDayArrF[w]
        var W = weekDayArr[w]

        var diff = wipeOut(date, true).getTime() - parse(true).getTime()
        var X = diff == 86400000 ? "明天" : diff == 0 ? "今天" : W

        return format(formatStr, parseArr, {
            date: date,
            YYYY: YYYY,
            YY: YY,
            MM: MM,
            M: M,
            DD: DD,
            D: D,
            hh: hh,
            h: h,
            mm: mm,
            m: m,
            ss: ss,
            s: s,
            w: w,
            W: W,
            EW:EW,
            FW:FW,
            X: X
        })
    }

    // 时间间隔差
    var diffIntervalArr = "D,ms,h,m,s".split(",")
    function diff(num, formatStr) {
        if (typeof num != "number") {
            num = parse(num).getTime() - parse(formatStr).getTime()
            formatStr = arguments[2]
        }

        var mm = Math.abs(num)
        // 毫秒
        var ms = mm % 1000
        // 秒
        mm = Math.floor(mm / 1000)
        var s = mm % 60
        mm = Math.floor(mm / 60)
        var m = mm % 60
        mm = Math.floor(mm / 60)
        var h = mm % 24
        var D = Math.floor(mm / 24)

        return format(formatStr, diffIntervalArr, {
            D: D,
            ms: ms,
            h: h,
            m: m,
            s: s
        })
    }

    // 日期上增加特定时间
    var appendTimeOpt = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000
    }
    function append(n, date, formatStr) {
        if (typeof n == "string") {
            if (/^(-?\d+)([a-z])$/i.test(n)) {
                n = RegExp.$1 * (appendTimeOpt[RegExp.$2.toLowerCase()] || 0)
            } else {
                n = 0
            }
        }

        var val = new Date(parse(date).getTime() + n)
        if (formatStr) {
            return parse(val, formatStr)
        }
        return val
    }

    return {
        parse: parse,
        get: get,
        diff: diff,
        append: append
    }
})
