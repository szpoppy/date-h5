(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    // 星期几 中文
    var weekDayArr = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
    var weekDayArrE = ["Sun", "Mon", "Tues", "Wed", "Thur", "Fri", "Sat"];
    var weekDayArrF = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
    var oneDayNum = 24 * 60 * 60 * 1000;
    // 克隆一个时间兑现，是否只保留年月日
    function wipeOut(date, isWipe) {
        if (isWipe === void 0) { isWipe = false; }
        var t = date.getTime();
        if (isWipe) {
            t = Math.floor(t / oneDayNum) * oneDayNum;
        }
        return new Date(t);
    }
    // 创建时间对象
    function parse(date, isWipe) {
        if (typeof date == "boolean") {
            isWipe = date;
            date = undefined;
        }
        // 日期
        if (date instanceof Date) {
            return wipeOut(date, isWipe);
        }
        if (typeof date == "string") {
            date = date
                .replace(/^(\d{4})(\d{2})(\d{2})(\d{2})?(\d{2})?(\d{2})?$/, function (str, Y, M, D, h, m, s) {
                return Y + "/" + M + "/" + D + " " + (h || "00") + ":" + (m || "00") + ":" + (s || "00");
            })
                .replace(/\-/g, "/")
                .replace(/T/, " ")
                .replace(/\.\d+$/, "");
        }
        // 防止报错
        var x = date;
        return wipeOut(x, isWipe);
    }
    exports.parse = parse;
    // 格式化
    function format(str, arr, info) {
        if (arr === void 0) { arr = []; }
        if (info === void 0) { info = {}; }
        if (!str) {
            // 无格式化字符串
            return info;
        }
        str = str.replace(/<(\w+):(.*?)>/g, function (s0, s1, s2) {
            var val = info[s1];
            if (val) {
                return val + s2;
            }
            return "";
        });
        for (var i = 0; i < arr.length; i += 1) {
            str = str.replace(new RegExp(arr[i], "g"), info[arr[i]]);
        }
        return str;
    }
    // 格式化日期
    // formatStr为格式化日期
    var parseArr = "YYYY,YY,MM,M,DD,D,hh,h,mm,m,ss,s,w,EW,FW,W,X".split(",");
    function get(date, formatStr) {
        if (formatStr === void 0) { formatStr = ""; }
        var theDate = parse(date);
        var YYYY = theDate.getFullYear();
        var YY = YYYY - 1900;
        var M = theDate.getMonth() + 1;
        var MM = ("0" + M).slice(-2);
        var D = theDate.getDate();
        var DD = ("0" + D).slice(-2);
        var h = theDate.getHours();
        var hh = ("0" + h).slice(-2);
        var m = theDate.getMinutes();
        var mm = ("0" + m).slice(-2);
        var s = theDate.getSeconds();
        var ss = ("0" + s).slice(-2);
        var w = theDate.getDay();
        var EW = weekDayArrE[w];
        var FW = weekDayArrF[w];
        var W = weekDayArr[w];
        var diff = wipeOut(theDate, true).getTime() - parse(true).getTime();
        var X = diff == 86400000 ? "明天" : diff == 0 ? "今天" : W;
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
            EW: EW,
            FW: FW,
            X: X
        });
    }
    exports.get = get;
    // 时间间隔差
    exports.diffIntervalArr = "D,ms,h,m,s".split(",");
    function diff(arg1, arg2, arg3) {
        var num;
        var formatStr;
        if (typeof arg1 != "number") {
            num = parse(num).getTime() - parse(arg2).getTime();
            formatStr = arg3;
        }
        var mm = Math.abs(num);
        // 毫秒
        var ms = mm % 1000;
        // 秒
        mm = Math.floor(mm / 1000);
        var s = mm % 60;
        mm = Math.floor(mm / 60);
        var m = mm % 60;
        mm = Math.floor(mm / 60);
        var h = mm % 24;
        var D = Math.floor(mm / 24);
        return format(formatStr, exports.diffIntervalArr, {
            D: D,
            ms: ms,
            h: h,
            m: m,
            s: s
        });
    }
    exports.diff = diff;
    // 日期上增加特定时间
    var appendTimeOpt = {
        s: 1000,
        m: 60 * 1000,
        h: 60 * 60 * 1000,
        d: 24 * 60 * 60 * 1000
    };
    // 增加 1d 1m 1h 等
    function append(n, date, formatStr) {
        var num = n;
        if (typeof n == "string") {
            if (/^(-?\d+)([a-z])$/i.test(n)) {
                num = parseInt(RegExp.$1) * (appendTimeOpt[RegExp.$2.toLowerCase()] || 0);
            }
            else {
                num = 0;
            }
        }
        var val = new Date(parse(date).getTime() + num);
        if (formatStr) {
            return get(val, formatStr);
        }
        return val;
    }
    exports.append = append;
    exports.default = {
        parse: parse,
        get: get,
        diff: diff,
        append: append
    };
});
//# sourceMappingURL=date.js.map