module.exports = (function() {
    "use strict";
    function DateUtils() {
    }

    DateUtils.prototype.getShowDate = function(time) {
        var date = new Date(time);
        var now = new Date();
        date.setHours(0);date.setMinutes(0);date.setSeconds(0);date.setMilliseconds(0);
        now.setHours(0);now.setMinutes(0);now.setSeconds(0);now.setMilliseconds(0);
        if (now.getTime() == date.getTime()) {
            var d = new Date(time);
            var h = d.getHours();
            var pre = h<6?'凌晨':h<12?'早上':h<13?'中午':h<17?'下午':h<22?'晚上':'深夜';
            return pre+h+":"+d.getMinutes();
        }
        date.getDate(date.getDate()+1);
        if (now.getTime() == date.getTime()) {
            return '昨天';
        }
        date.getDate(date.getDate()+1);
        if (now.getTime() == date.getTime()) {
            return '前天';
        }
        var d = new Date(time);
        return (d.getMonth()+1)+'月'+ d.getDate()+'日';
    }
    DateUtils.prototype.getShowDateTime = function(time) {
        var date = new Date(time);
        var now = new Date();
        now.setHours(0);now.setMinutes(0);now.setSeconds(0);now.setMilliseconds(0);
        date.setHours(0);date.setMinutes(0);date.setSeconds(0);date.setMilliseconds(0);
        var d = new Date(time);
        var h = d.getHours();
        var pre = h<6?'凌晨':h<12?'早上':h<13?'中午':h<17?'下午':h<22?'晚上':'深夜';
        if (now.getTime() == date.getTime()) {
            return pre+h+":"+d.getMinutes();
        }
        date.getDate(date.getDate()+1);
        if (now.getTime() == date.getTime()) {
            return '昨天 '+pre+h+":"+d.getMinutes();
        }
        date.getDate(date.getDate()+1);
        if (now.getTime() == date.getTime()) {
            return '前天 '+pre+h+":"+d.getMinutes();
        }
        return (d.getMonth()+1)+'月'+ d.getDate()+'日 '+h+":"+d.getMinutes();
    };

    return new DateUtils();
})();


