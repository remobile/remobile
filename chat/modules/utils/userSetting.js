"use strict";
module.exports = {
    string: function (key, value) {
        if (value !== undefined) {
            localStorage.setItem(key, value + "");
        } else {
            return localStorage.getItem(key);
        }
    },
    bool: function (key, value) {
        if (value !== undefined) {
            localStorage.setItem(key, value + "");
        } else {
            return "true" == localStorage.getItem(key) ? true : false;
        }
    },
    int: function (key, value) {
        if (value !== undefined) {
            localStorage.setItem(key, value + "");
        } else {
            var val = localStorage.getItem(key)||0;
            return parseInt(val);
        }
    },
    object: function (key, value) {
        if (value !== undefined) {
            localStorage.setItem(key, JSON.stringify(value));
        } else {
            var obj = localStorage.getItem(key);
            if (obj == null) {
                return null;
            }
            return JSON.parse(obj);
        }
    }
}

