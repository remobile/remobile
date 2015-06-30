"use strict";
module.exports = {
    setStringData: function (key, value) {
        localStorage.setItem(key, value + "");
    },
    getStringData: function (key) {
        return localStorage.getItem(key);
    },
    setBooleanData: function (key, value) {
        localStorage.setItem(key, value + "");
    },
    getBooleanData: function (key) {
        return "true" == localStorage.getItem(key) ? true : false;
    },
    setIntData: function (key, value) {
        localStorage.setItem(key, value + "");
    },
    getIntData: function (key) {
        var val = localStorage.getItem(key)||0;
        return parseInt(val);
    },
    setObjectData: function (key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    },
    getObjectData: function (key) {
        var obj = localStorage.getItem(key);
        if (obj == null) {
            return null;
        }
        return JSON.parse(obj);
    }
}

