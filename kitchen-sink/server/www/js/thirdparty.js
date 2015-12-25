/*
 * desktopBrowsers contributed by Carlos Ouro @ Badoo
 * translates desktop browsers events to touch events and prevents defaults
 * It can be used independently in other apps but it is required for using the touchLayer in the desktop
 *
 * @param {Function} $ The appframework selector function
 */
/* global DocumentTouch*/
(function () {
    "use strict";
    var cancelClickMove = false;
    var userAgent = window.navigator.userAgent;
    //See if we can create a touch event
    var tmp;
    try {
        tmp = document.createEvent("TouchEvent");
        return;
    } catch (ex) {}

    window.ontouchstart = function(){}
    var preventAll = function (e) {
        e.preventDefault();
        e.stopPropagation();
    };
    var ieThreshold=userAgent.match(/Phone/i)?2:7;
    /**
     * Stop propagation, and remove default behavior for everything but INPUT, TEXTAREA & SELECT fields
     *
     * @param {Event} event
     * @param {HTMLElement} target
     */
    var preventAllButInputs = function(event, target) {
        if (!target.tagName) {
            return;
        }
        var tag = target.tagName.toUpperCase();
        if (tag.indexOf("SELECT") > -1 || tag.indexOf("TEXTAREA") > -1 || tag.indexOf("INPUT") > -1 || (tag.indexOf("DIV") > -1 && target.contentEditable)) {
            return;
        }
        preventAll(event);
    };
    function TouchList(){
        this.length=0;
    }
    TouchList.prototype = {
        item:function(ind){
            return this[ind];
        },
        _add:function(touch){
            this[this.length]=touch;
            this.length++;
        }
    };

    var touchIdentifier=1000;
    function Touch() {
        this.touchIdentifier=touchIdentifier++;
    }

    Touch.prototye = {
        "clientX":0,
        "clientY":0,
        "screenX":0,
        "screenY":0,
        "pageX":0,
        "pageY":0,
        "identifier":0
    }



    var redirectMouseToTouch = function (type, originalEvent, newTarget,skipPrevent) {

        var theTarget = newTarget ? newTarget : originalEvent.target;
        if(!skipPrevent)
            preventAllButInputs(originalEvent, theTarget);

        var touchevt = document.createEvent("MouseEvent");

        touchevt.initEvent(type, true, true);
        touchevt.initMouseEvent(type, true, true, window, originalEvent.detail, originalEvent.screenX, originalEvent.screenY, originalEvent.clientX, originalEvent.clientY, originalEvent.ctrlKey, originalEvent.shiftKey, originalEvent.altKey, originalEvent.metaKey, originalEvent.button, originalEvent.relatedTarget);
        touchevt.touches=  new TouchList();
        touchevt.changedTouches = new TouchList();
        touchevt.targetTouches = new TouchList();
        var thetouch=new Touch();
        thetouch.pageX=originalEvent.pageX;
        thetouch.pageY=originalEvent.pageY;
        thetouch.target=originalEvent.target;
        touchevt.changedTouches._add(thetouch);
        if (type !== "touchend") {
            touchevt.touches = touchevt.changedTouches;
            touchevt.targetTouches = touchevt.changedTouches;
        }
        //target

        touchevt.mouseToTouch = true;
        if (userAgent.match(/MSIE 10.0/i)||userAgent.match(/Trident\/7/i) ? true : false) {
            // handle inline event handlers for target and parents (for bubbling)
            var elem = originalEvent.target;
            while (elem !== null) {
                if (elem.hasAttribute("on" + type)) {
                    eval(elem.getAttribute("on" + type));
                }
                elem = elem.parentElement;
            }
        }
        theTarget.dispatchEvent(touchevt);
    };

    var mouseDown = false,
    lastTarget = null,
    prevX=0,
    prevY=0;
    if (!window.navigator.msPointerEnabled) {

        document.addEventListener("mousedown", function (e) {
            mouseDown = true;
            lastTarget = e.target;
            if (e.target.nodeName.toLowerCase() === "a" && e.target.href.toLowerCase() === "javascript:;")
            e.target.href = "#";
            redirectMouseToTouch("touchstart", e);
            cancelClickMove = false;
            prevX=e.clientX;
            prevY=e.clientY;
        }, true);

        document.addEventListener("mouseup", function (e) {
            if (!mouseDown) return;
            redirectMouseToTouch("touchend", e, lastTarget); //bind it to initial mousedown target
            lastTarget = null;
            mouseDown = false;
        }, true);

        document.addEventListener("mousemove", function (e) {
            if(e.clientX===prevX&&e.clientY===prevY) return;
            if (!mouseDown) return;
            redirectMouseToTouch("touchmove", e, lastTarget);
            cancelClickMove = true;
        }, true);
    } else { //Win8
        var skipMove=false;
        document.addEventListener("MSPointerDown", function (e) {
            mouseDown = true;
            skipMove=true;
            lastTarget = e.target;
            if (e.target.nodeName.toLowerCase() === "a" && e.target.href.toLowerCase() === "javascript:;")
            e.target.href = "";
            redirectMouseToTouch("touchstart", e,null,true);
            cancelClickMove = false;
            prevX=e.clientX;
            prevY=e.clientY;
        }, true);

        document.addEventListener("MSPointerUp", function (e) {
            if (!mouseDown) return;
            redirectMouseToTouch("touchend", e, lastTarget,true); // bind it to initial mousedown target
            lastTarget = null;
            mouseDown = false;
        }, true);
        document.addEventListener("MSPointerMove", function (e) {
            //IE is very flakey...we need 7 pixel movement before we trigger it

            if(Math.abs(e.clientX-prevX)<=ieThreshold||Math.abs(e.clientY-prevY)<=ieThreshold) return;
            if (!mouseDown) return;
            redirectMouseToTouch("touchmove", e, lastTarget,true);

            cancelClickMove = true;

        }, true);
    }

    // prevent all mouse events which don't exist on touch devices
    document.addEventListener("drag", preventAll, true);
    document.addEventListener("dragstart", preventAll, true);
    document.addEventListener("dragenter", preventAll, true);
    document.addEventListener("dragover", preventAll, true);
    document.addEventListener("dragleave", preventAll, true);
    document.addEventListener("dragend", preventAll, true);
    document.addEventListener("drop", preventAll, true);
    // Allow selection of input elements
    document.addEventListener("selectstart", function(e){
        preventAllButInputs(e, e.target);
    }, true);
    document.addEventListener("click", function (e) {
        if (!e.mouseToTouch && e.target === lastTarget) {
            preventAll(e);
        }
        if (cancelClickMove) {
            preventAll(e);
            cancelClickMove = false;
        }
    }, true);
})();

/*!
 * async
 * https://github.com/caolan/async
 *
 * Copyright 2010-2014 Caolan McMahon
 * Released under the MIT license
 */
/*jshint onevar: false, indent:4 */
/*global setImmediate: false, setTimeout: false, console: false */
(function () {

    var async = {};

    // global on the server, window in the browser
    var root, previous_async;

    root = this;
    if (root != null) {
      previous_async = root.async;
    }

    async.noConflict = function () {
        root.async = previous_async;
        return async;
    };

    function only_once(fn) {
        var called = false;
        return function() {
            if (called) throw new Error("Callback was already called.");
            called = true;
            fn.apply(root, arguments);
        }
    }

    //// cross-browser compatiblity functions ////

    var _toString = Object.prototype.toString;

    var _isArray = Array.isArray || function (obj) {
        return _toString.call(obj) === '[object Array]';
    };

    var _each = function (arr, iterator) {
        if (arr.forEach) {
            return arr.forEach(iterator);
        }
        for (var i = 0; i < arr.length; i += 1) {
            iterator(arr[i], i, arr);
        }
    };

    var _map = function (arr, iterator) {
        if (arr.map) {
            return arr.map(iterator);
        }
        var results = [];
        _each(arr, function (x, i, a) {
            results.push(iterator(x, i, a));
        });
        return results;
    };

    var _reduce = function (arr, iterator, memo) {
        if (arr.reduce) {
            return arr.reduce(iterator, memo);
        }
        _each(arr, function (x, i, a) {
            memo = iterator(memo, x, i, a);
        });
        return memo;
    };

    var _keys = function (obj) {
        if (Object.keys) {
            return Object.keys(obj);
        }
        var keys = [];
        for (var k in obj) {
            if (obj.hasOwnProperty(k)) {
                keys.push(k);
            }
        }
        return keys;
    };

    //// exported async module functions ////

    //// nextTick implementation with browser-compatible fallback ////
    if (typeof process === 'undefined' || !(process.nextTick)) {
        if (typeof setImmediate === 'function') {
            async.nextTick = function (fn) {
                // not a direct alias for IE10 compatibility
                setImmediate(fn);
            };
            async.setImmediate = async.nextTick;
        }
        else {
            async.nextTick = function (fn) {
                setTimeout(fn, 0);
            };
            async.setImmediate = async.nextTick;
        }
    }
    else {
        async.nextTick = process.nextTick;
        if (typeof setImmediate !== 'undefined') {
            async.setImmediate = function (fn) {
              // not a direct alias for IE10 compatibility
              setImmediate(fn);
            };
        }
        else {
            async.setImmediate = async.nextTick;
        }
    }

    async.each = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        _each(arr, function (x) {
            iterator(x, only_once(done) );
        });
        function done(err) {
          if (err) {
              callback(err);
              callback = function () {};
          }
          else {
              completed += 1;
              if (completed >= arr.length) {
                  callback();
              }
          }
        }
    };
    async.forEach = async.each;

    async.eachSeries = function (arr, iterator, callback) {
        callback = callback || function () {};
        if (!arr.length) {
            return callback();
        }
        var completed = 0;
        var iterate = function () {
            iterator(arr[completed], function (err) {
                if (err) {
                    callback(err);
                    callback = function () {};
                }
                else {
                    completed += 1;
                    if (completed >= arr.length) {
                        callback();
                    }
                    else {
                        iterate();
                    }
                }
            });
        };
        iterate();
    };
    async.forEachSeries = async.eachSeries;

    async.eachLimit = function (arr, limit, iterator, callback) {
        var fn = _eachLimit(limit);
        fn.apply(null, [arr, iterator, callback]);
    };
    async.forEachLimit = async.eachLimit;

    var _eachLimit = function (limit) {

        return function (arr, iterator, callback) {
            callback = callback || function () {};
            if (!arr.length || limit <= 0) {
                return callback();
            }
            var completed = 0;
            var started = 0;
            var running = 0;

            (function replenish () {
                if (completed >= arr.length) {
                    return callback();
                }

                while (running < limit && started < arr.length) {
                    started += 1;
                    running += 1;
                    iterator(arr[started - 1], function (err) {
                        if (err) {
                            callback(err);
                            callback = function () {};
                        }
                        else {
                            completed += 1;
                            running -= 1;
                            if (completed >= arr.length) {
                                callback();
                            }
                            else {
                                replenish();
                            }
                        }
                    });
                }
            })();
        };
    };


    var doParallel = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.each].concat(args));
        };
    };
    var doParallelLimit = function(limit, fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [_eachLimit(limit)].concat(args));
        };
    };
    var doSeries = function (fn) {
        return function () {
            var args = Array.prototype.slice.call(arguments);
            return fn.apply(null, [async.eachSeries].concat(args));
        };
    };


    var _asyncMap = function (eachfn, arr, iterator, callback) {
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        if (!callback) {
            eachfn(arr, function (x, callback) {
                iterator(x.value, function (err) {
                    callback(err);
                });
            });
        } else {
            var results = [];
            eachfn(arr, function (x, callback) {
                iterator(x.value, function (err, v) {
                    results[x.index] = v;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };
    async.map = doParallel(_asyncMap);
    async.mapSeries = doSeries(_asyncMap);
    async.mapLimit = function (arr, limit, iterator, callback) {
        return _mapLimit(limit)(arr, iterator, callback);
    };

    var _mapLimit = function(limit) {
        return doParallelLimit(limit, _asyncMap);
    };

    // reduce only has a series version, as doing reduce in parallel won't
    // work in many situations.
    async.reduce = function (arr, memo, iterator, callback) {
        async.eachSeries(arr, function (x, callback) {
            iterator(memo, x, function (err, v) {
                memo = v;
                callback(err);
            });
        }, function (err) {
            callback(err, memo);
        });
    };
    // inject alias
    async.inject = async.reduce;
    // foldl alias
    async.foldl = async.reduce;

    async.reduceRight = function (arr, memo, iterator, callback) {
        var reversed = _map(arr, function (x) {
            return x;
        }).reverse();
        async.reduce(reversed, memo, iterator, callback);
    };
    // foldr alias
    async.foldr = async.reduceRight;

    var _filter = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.filter = doParallel(_filter);
    async.filterSeries = doSeries(_filter);
    // select alias
    async.select = async.filter;
    async.selectSeries = async.filterSeries;

    var _reject = function (eachfn, arr, iterator, callback) {
        var results = [];
        arr = _map(arr, function (x, i) {
            return {index: i, value: x};
        });
        eachfn(arr, function (x, callback) {
            iterator(x.value, function (v) {
                if (!v) {
                    results.push(x);
                }
                callback();
            });
        }, function (err) {
            callback(_map(results.sort(function (a, b) {
                return a.index - b.index;
            }), function (x) {
                return x.value;
            }));
        });
    };
    async.reject = doParallel(_reject);
    async.rejectSeries = doSeries(_reject);

    var _detect = function (eachfn, arr, iterator, main_callback) {
        eachfn(arr, function (x, callback) {
            iterator(x, function (result) {
                if (result) {
                    main_callback(x);
                    main_callback = function () {};
                }
                else {
                    callback();
                }
            });
        }, function (err) {
            main_callback();
        });
    };
    async.detect = doParallel(_detect);
    async.detectSeries = doSeries(_detect);

    async.some = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (v) {
                    main_callback(true);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(false);
        });
    };
    // any alias
    async.any = async.some;

    async.every = function (arr, iterator, main_callback) {
        async.each(arr, function (x, callback) {
            iterator(x, function (v) {
                if (!v) {
                    main_callback(false);
                    main_callback = function () {};
                }
                callback();
            });
        }, function (err) {
            main_callback(true);
        });
    };
    // all alias
    async.all = async.every;

    async.sortBy = function (arr, iterator, callback) {
        async.map(arr, function (x, callback) {
            iterator(x, function (err, criteria) {
                if (err) {
                    callback(err);
                }
                else {
                    callback(null, {value: x, criteria: criteria});
                }
            });
        }, function (err, results) {
            if (err) {
                return callback(err);
            }
            else {
                var fn = function (left, right) {
                    var a = left.criteria, b = right.criteria;
                    return a < b ? -1 : a > b ? 1 : 0;
                };
                callback(null, _map(results.sort(fn), function (x) {
                    return x.value;
                }));
            }
        });
    };

    async.auto = function (tasks, callback) {
        callback = callback || function () {};
        var keys = _keys(tasks);
        var remainingTasks = keys.length
        if (!remainingTasks) {
            return callback();
        }

        var results = {};

        var listeners = [];
        var addListener = function (fn) {
            listeners.unshift(fn);
        };
        var removeListener = function (fn) {
            for (var i = 0; i < listeners.length; i += 1) {
                if (listeners[i] === fn) {
                    listeners.splice(i, 1);
                    return;
                }
            }
        };
        var taskComplete = function () {
            remainingTasks--
            _each(listeners.slice(0), function (fn) {
                fn();
            });
        };

        addListener(function () {
            if (!remainingTasks) {
                var theCallback = callback;
                // prevent final callback from calling itself if it errors
                callback = function () {};

                theCallback(null, results);
            }
        });

        _each(keys, function (k) {
            var task = _isArray(tasks[k]) ? tasks[k]: [tasks[k]];
            var taskCallback = function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (args.length <= 1) {
                    args = args[0];
                }
                if (err) {
                    var safeResults = {};
                    _each(_keys(results), function(rkey) {
                        safeResults[rkey] = results[rkey];
                    });
                    safeResults[k] = args;
                    callback(err, safeResults);
                    // stop subsequent errors hitting callback multiple times
                    callback = function () {};
                }
                else {
                    results[k] = args;
                    async.setImmediate(taskComplete);
                }
            };
            var requires = task.slice(0, Math.abs(task.length - 1)) || [];
            var ready = function () {
                return _reduce(requires, function (a, x) {
                    return (a && results.hasOwnProperty(x));
                }, true) && !results.hasOwnProperty(k);
            };
            if (ready()) {
                task[task.length - 1](taskCallback, results);
            }
            else {
                var listener = function () {
                    if (ready()) {
                        removeListener(listener);
                        task[task.length - 1](taskCallback, results);
                    }
                };
                addListener(listener);
            }
        });
    };

    async.retry = function(times, task, callback) {
        var DEFAULT_TIMES = 5;
        var attempts = [];
        // Use defaults if times not passed
        if (typeof times === 'function') {
            callback = task;
            task = times;
            times = DEFAULT_TIMES;
        }
        // Make sure times is a number
        times = parseInt(times, 10) || DEFAULT_TIMES;
        var wrappedTask = function(wrappedCallback, wrappedResults) {
            var retryAttempt = function(task, finalAttempt) {
                return function(seriesCallback) {
                    task(function(err, result){
                        seriesCallback(!err || finalAttempt, {err: err, result: result});
                    }, wrappedResults);
                };
            };
            while (times) {
                attempts.push(retryAttempt(task, !(times-=1)));
            }
            async.series(attempts, function(done, data){
                data = data[data.length - 1];
                (wrappedCallback || callback)(data.err, data.result);
            });
        }
        // If a callback is passed, run this as a controll flow
        return callback ? wrappedTask() : wrappedTask
    };

    async.waterfall = function (tasks, callback) {
        callback = callback || function () {};
        if (!_isArray(tasks)) {
          var err = new Error('First argument to waterfall must be an array of functions');
          return callback(err);
        }
        if (!tasks.length) {
            return callback();
        }
        var wrapIterator = function (iterator) {
            return function (err) {
                if (err) {
                    callback.apply(null, arguments);
                    callback = function () {};
                }
                else {
                    var args = Array.prototype.slice.call(arguments, 1);
                    var next = iterator.next();
                    if (next) {
                        args.push(wrapIterator(next));
                    }
                    else {
                        args.push(callback);
                    }
                    async.setImmediate(function () {
                        iterator.apply(null, args);
                    });
                }
            };
        };
        wrapIterator(async.iterator(tasks))();
    };

    var _parallel = function(eachfn, tasks, callback) {
        callback = callback || function () {};
        if (_isArray(tasks)) {
            eachfn.map(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            eachfn.each(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.parallel = function (tasks, callback) {
        _parallel({ map: async.map, each: async.each }, tasks, callback);
    };

    async.parallelLimit = function(tasks, limit, callback) {
        _parallel({ map: _mapLimit(limit), each: _eachLimit(limit) }, tasks, callback);
    };

    async.series = function (tasks, callback) {
        callback = callback || function () {};
        if (_isArray(tasks)) {
            async.mapSeries(tasks, function (fn, callback) {
                if (fn) {
                    fn(function (err) {
                        var args = Array.prototype.slice.call(arguments, 1);
                        if (args.length <= 1) {
                            args = args[0];
                        }
                        callback.call(null, err, args);
                    });
                }
            }, callback);
        }
        else {
            var results = {};
            async.eachSeries(_keys(tasks), function (k, callback) {
                tasks[k](function (err) {
                    var args = Array.prototype.slice.call(arguments, 1);
                    if (args.length <= 1) {
                        args = args[0];
                    }
                    results[k] = args;
                    callback(err);
                });
            }, function (err) {
                callback(err, results);
            });
        }
    };

    async.iterator = function (tasks) {
        var makeCallback = function (index) {
            var fn = function () {
                if (tasks.length) {
                    tasks[index].apply(null, arguments);
                }
                return fn.next();
            };
            fn.next = function () {
                return (index < tasks.length - 1) ? makeCallback(index + 1): null;
            };
            return fn;
        };
        return makeCallback(0);
    };

    async.apply = function (fn) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function () {
            return fn.apply(
                null, args.concat(Array.prototype.slice.call(arguments))
            );
        };
    };

    var _concat = function (eachfn, arr, fn, callback) {
        var r = [];
        eachfn(arr, function (x, cb) {
            fn(x, function (err, y) {
                r = r.concat(y || []);
                cb(err);
            });
        }, function (err) {
            callback(err, r);
        });
    };
    async.concat = doParallel(_concat);
    async.concatSeries = doSeries(_concat);

    async.whilst = function (test, iterator, callback) {
        if (test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.whilst(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doWhilst = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            var args = Array.prototype.slice.call(arguments, 1);
            if (test.apply(null, args)) {
                async.doWhilst(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.until = function (test, iterator, callback) {
        if (!test()) {
            iterator(function (err) {
                if (err) {
                    return callback(err);
                }
                async.until(test, iterator, callback);
            });
        }
        else {
            callback();
        }
    };

    async.doUntil = function (iterator, test, callback) {
        iterator(function (err) {
            if (err) {
                return callback(err);
            }
            var args = Array.prototype.slice.call(arguments, 1);
            if (!test.apply(null, args)) {
                async.doUntil(iterator, test, callback);
            }
            else {
                callback();
            }
        });
    };

    async.queue = function (worker, concurrency) {
        if (concurrency === undefined) {
            concurrency = 1;
        }
        function _insert(q, data, pos, callback) {
          if (!q.started){
            q.started = true;
          }
          if (!_isArray(data)) {
              data = [data];
          }
          if(data.length == 0) {
             // call drain immediately if there are no tasks
             return async.setImmediate(function() {
                 if (q.drain) {
                     q.drain();
                 }
             });
          }
          _each(data, function(task) {
              var item = {
                  data: task,
                  callback: typeof callback === 'function' ? callback : null
              };

              if (pos) {
                q.tasks.unshift(item);
              } else {
                q.tasks.push(item);
              }

              if (q.saturated && q.tasks.length === q.concurrency) {
                  q.saturated();
              }
              async.setImmediate(q.process);
          });
        }

        var workers = 0;
        var q = {
            tasks: [],
            concurrency: concurrency,
            saturated: null,
            empty: null,
            drain: null,
            started: false,
            paused: false,
            push: function (data, callback) {
              _insert(q, data, false, callback);
            },
            kill: function () {
              q.drain = null;
              q.tasks = [];
            },
            unshift: function (data, callback) {
              _insert(q, data, true, callback);
            },
            process: function () {
                if (!q.paused && workers < q.concurrency && q.tasks.length) {
                    var task = q.tasks.shift();
                    if (q.empty && q.tasks.length === 0) {
                        q.empty();
                    }
                    workers += 1;
                    var next = function () {
                        workers -= 1;
                        if (task.callback) {
                            task.callback.apply(task, arguments);
                        }
                        if (q.drain && q.tasks.length + workers === 0) {
                            q.drain();
                        }
                        q.process();
                    };
                    var cb = only_once(next);
                    worker(task.data, cb);
                }
            },
            length: function () {
                return q.tasks.length;
            },
            running: function () {
                return workers;
            },
            idle: function() {
                return q.tasks.length + workers === 0;
            },
            pause: function () {
                if (q.paused === true) { return; }
                q.paused = true;
                q.process();
            },
            resume: function () {
                if (q.paused === false) { return; }
                q.paused = false;
                q.process();
            }
        };
        return q;
    };
    
    async.priorityQueue = function (worker, concurrency) {
        
        function _compareTasks(a, b){
          return a.priority - b.priority;
        };
        
        function _binarySearch(sequence, item, compare) {
          var beg = -1,
              end = sequence.length - 1;
          while (beg < end) {
            var mid = beg + ((end - beg + 1) >>> 1);
            if (compare(item, sequence[mid]) >= 0) {
              beg = mid;
            } else {
              end = mid - 1;
            }
          }
          return beg;
        }
        
        function _insert(q, data, priority, callback) {
          if (!q.started){
            q.started = true;
          }
          if (!_isArray(data)) {
              data = [data];
          }
          if(data.length == 0) {
             // call drain immediately if there are no tasks
             return async.setImmediate(function() {
                 if (q.drain) {
                     q.drain();
                 }
             });
          }
          _each(data, function(task) {
              var item = {
                  data: task,
                  priority: priority,
                  callback: typeof callback === 'function' ? callback : null
              };
              
              q.tasks.splice(_binarySearch(q.tasks, item, _compareTasks) + 1, 0, item);

              if (q.saturated && q.tasks.length === q.concurrency) {
                  q.saturated();
              }
              async.setImmediate(q.process);
          });
        }
        
        // Start with a normal queue
        var q = async.queue(worker, concurrency);
        
        // Override push to accept second parameter representing priority
        q.push = function (data, priority, callback) {
          _insert(q, data, priority, callback);
        };
        
        // Remove unshift function
        delete q.unshift;

        return q;
    };

    async.cargo = function (worker, payload) {
        var working     = false,
            tasks       = [];

        var cargo = {
            tasks: tasks,
            payload: payload,
            saturated: null,
            empty: null,
            drain: null,
            drained: true,
            push: function (data, callback) {
                if (!_isArray(data)) {
                    data = [data];
                }
                _each(data, function(task) {
                    tasks.push({
                        data: task,
                        callback: typeof callback === 'function' ? callback : null
                    });
                    cargo.drained = false;
                    if (cargo.saturated && tasks.length === payload) {
                        cargo.saturated();
                    }
                });
                async.setImmediate(cargo.process);
            },
            process: function process() {
                if (working) return;
                if (tasks.length === 0) {
                    if(cargo.drain && !cargo.drained) cargo.drain();
                    cargo.drained = true;
                    return;
                }

                var ts = typeof payload === 'number'
                            ? tasks.splice(0, payload)
                            : tasks.splice(0, tasks.length);

                var ds = _map(ts, function (task) {
                    return task.data;
                });

                if(cargo.empty) cargo.empty();
                working = true;
                worker(ds, function () {
                    working = false;

                    var args = arguments;
                    _each(ts, function (data) {
                        if (data.callback) {
                            data.callback.apply(null, args);
                        }
                    });

                    process();
                });
            },
            length: function () {
                return tasks.length;
            },
            running: function () {
                return working;
            }
        };
        return cargo;
    };

    var _console_fn = function (name) {
        return function (fn) {
            var args = Array.prototype.slice.call(arguments, 1);
            fn.apply(null, args.concat([function (err) {
                var args = Array.prototype.slice.call(arguments, 1);
                if (typeof console !== 'undefined') {
                    if (err) {
                        if (console.error) {
                            console.error(err);
                        }
                    }
                    else if (console[name]) {
                        _each(args, function (x) {
                            console[name](x);
                        });
                    }
                }
            }]));
        };
    };
    async.log = _console_fn('log');
    async.dir = _console_fn('dir');
    /*async.info = _console_fn('info');
    async.warn = _console_fn('warn');
    async.error = _console_fn('error');*/

    async.memoize = function (fn, hasher) {
        var memo = {};
        var queues = {};
        hasher = hasher || function (x) {
            return x;
        };
        var memoized = function () {
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            var key = hasher.apply(null, args);
            if (key in memo) {
                async.nextTick(function () {
                    callback.apply(null, memo[key]);
                });
            }
            else if (key in queues) {
                queues[key].push(callback);
            }
            else {
                queues[key] = [callback];
                fn.apply(null, args.concat([function () {
                    memo[key] = arguments;
                    var q = queues[key];
                    delete queues[key];
                    for (var i = 0, l = q.length; i < l; i++) {
                      q[i].apply(null, arguments);
                    }
                }]));
            }
        };
        memoized.memo = memo;
        memoized.unmemoized = fn;
        return memoized;
    };

    async.unmemoize = function (fn) {
      return function () {
        return (fn.unmemoized || fn).apply(null, arguments);
      };
    };

    async.times = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.map(counter, iterator, callback);
    };

    async.timesSeries = function (count, iterator, callback) {
        var counter = [];
        for (var i = 0; i < count; i++) {
            counter.push(i);
        }
        return async.mapSeries(counter, iterator, callback);
    };

    async.seq = function (/* functions... */) {
        var fns = arguments;
        return function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            async.reduce(fns, args, function (newargs, fn, cb) {
                fn.apply(that, newargs.concat([function () {
                    var err = arguments[0];
                    var nextargs = Array.prototype.slice.call(arguments, 1);
                    cb(err, nextargs);
                }]))
            },
            function (err, results) {
                callback.apply(that, [err].concat(results));
            });
        };
    };

    async.compose = function (/* functions... */) {
      return async.seq.apply(null, Array.prototype.reverse.call(arguments));
    };

    var _applyEach = function (eachfn, fns /*args...*/) {
        var go = function () {
            var that = this;
            var args = Array.prototype.slice.call(arguments);
            var callback = args.pop();
            return eachfn(fns, function (fn, cb) {
                fn.apply(that, args.concat([cb]));
            },
            callback);
        };
        if (arguments.length > 2) {
            var args = Array.prototype.slice.call(arguments, 2);
            return go.apply(this, args);
        }
        else {
            return go;
        }
    };
    async.applyEach = doParallel(_applyEach);
    async.applyEachSeries = doSeries(_applyEach);

    async.forever = function (fn, callback) {
        function next(err) {
            if (err) {
                if (callback) {
                    return callback(err);
                }
                throw err;
            }
            fn(next);
        }
        next();
    };

    // Node.js
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = async;
    }
    // AMD / RequireJS
    else if (typeof define !== 'undefined' && define.amd) {
        define([], function () {
            return async;
        });
    }
    // included directly via <script> tag
    else {
        root.async = async;
    }

}());

/*jshint globalstrict: true*/
'use strict';
/**
 * An initialization file that checks for conditions, removes console.log and warn, etc
 */
var idbModules = {};

var cleanInterface = false;
(function () {
    var testObject = {test: true};
    //Test whether Object.defineProperty really works.
    if (Object.defineProperty) {
        try {
            Object.defineProperty(testObject, 'test', { enumerable: false });
            if (testObject.test) {
                cleanInterface = true;
            }
        } catch (e) {
        //Object.defineProperty does not work as intended.
        }
    }
})();

/*jshint globalstrict: true*/
'use strict';
(function(idbModules) {
    /**
     * A utility method to callback onsuccess, onerror, etc as soon as the calling function's context is over
     * @param {Object} fn
     * @param {Object} context
     * @param {Object} argArray
     */

    function callback(fn, context, event, func) {
        //window.setTimeout(function(){
        event.target = context;
        (typeof context[fn] === "function") && context[fn].apply(context, [event]);
        (typeof func === "function") && func();
        //}, 1);
    }

    /**
     * Throws a new DOM Exception,
     * @param {Object} name
     * @param {Object} message
     * @param {Object} error
     */

    function throwDOMException(name, message, error) {
        var e = new DOMException.prototype.constructor(0, message);
        e.name = name;
        e.message = message;
        if (idbModules.DEBUG) {
            console.log(name, message, error, e);
            console.trace && console.trace();
        }
        throw e;
    }

    /**
     * Shim the DOMStringList object.
     *
     */
    var StringList = function() {
        this.length = 0;
        this._items = [];
        //Internal functions on the prototype have been made non-enumerable below.
        if (cleanInterface) {
            Object.defineProperty(this, '_items', {
                enumerable: false
            });
        }
    };
    StringList.prototype = {
        // Interface.
        contains: function(str) {
            return -1 !== this._items.indexOf(str);
        },
        item: function(key) {
            return this._items[key];
        },

        // Helpers. Should only be used internally.
        indexOf: function(str) {
            return this._items.indexOf(str);
        },
        push: function(item) {
            this._items.push(item);
            this.length += 1;
            for (var i = 0; i < this._items.length; i++) {
                this[i] = this._items[i];
            }
        },
        splice: function( /*index, howmany, item1, ..., itemX*/ ) {
            this._items.splice.apply(this._items, arguments);
            this.length = this._items.length;
            for (var i in this) {
                if (i === String(parseInt(i, 10))) {
                    delete this[i];
                }
            }
            for (i = 0; i < this._items.length; i++) {
                this[i] = this._items[i];
            }
        }
    };
    if (cleanInterface) {
        for (var i in {
            'indexOf': false,
            'push': false,
            'splice': false
        }) {
            Object.defineProperty(StringList.prototype, i, {
                enumerable: false
            });
        }
    }
    idbModules.util = {
        "throwDOMException": throwDOMException,
        "callback": callback,
        "quote": function(arg) {
            return "'" + arg + "'";
        },
        "StringList": StringList
    };
}(idbModules));
/*jshint globalstrict: true*/
'use strict';
(function(idbModules){
    /**
     * Implementation of the Structured Cloning Algorithm.  Supports the
     * following object types:
     * - Blob
     * - Boolean
     * - Date object
     * - File object (deserialized as Blob object).
     * - Number object
     * - RegExp object
     * - String object
     * This is accomplished by doing the following:
     * 1) Using the cycle/decycle functions from:
     *    https://github.com/douglascrockford/JSON-js/blob/master/cycle.js
     * 2) Serializing/deserializing objects to/from string that don't work with
     *    JSON.stringify and JSON.parse by using object specific logic (eg use 
     *    the FileReader API to convert a Blob or File object to a data URL.   
     * 3) JSON.stringify and JSON.parse do the final conversion to/from string.
     */
    var Sca = (function(){
        return {
            decycle: function(object, callback) {
                //From: https://github.com/douglascrockford/JSON-js/blob/master/cycle.js
                // Contains additional logic to convert the following object types to string
                // so that they can properly be encoded using JSON.stringify:
                //  *Boolean
                //  *Date
                //  *File
                //  *Blob
                //  *Number
                //  *Regex
                // Make a deep copy of an object or array, assuring that there is at most
                // one instance of each object or array in the resulting structure. The
                // duplicate references (which might be forming cycles) are replaced with
                // an object of the form
                //      {$ref: PATH}
                // where the PATH is a JSONPath string that locates the first occurance.
                // So,
                //      var a = [];
                //      a[0] = a;
                //      return JSON.stringify(JSON.decycle(a));
                // produces the string '[{"$ref":"$"}]'.

                // JSONPath is used to locate the unique object. $ indicates the top level of
                // the object or array. [NUMBER] or [STRING] indicates a child member or
                // property.

                var objects = [],   // Keep a reference to each unique object or array
                paths = [],     // Keep the path to each unique object or array
                queuedObjects = [],
                returnCallback = callback;

                /**
                 * Check the queue to see if all objects have been processed.
                 * if they have, call the callback with the converted object.
                 */
                function checkForCompletion() {
                    if (queuedObjects.length === 0) {
                        returnCallback(derezObj);
                    }    
                }

                /**
                 * Convert a blob to a data URL.
                 * @param {Blob} blob to convert.
                 * @param {String} path of blob in object being encoded.
                 */
                function readBlobAsDataURL(blob, path) {
                    var reader = new FileReader();
                    reader.onloadend = function(loadedEvent) {
                        var dataURL = loadedEvent.target.result;
                        var blobtype = 'blob'; 
                        if (blob instanceof File) {
                            //blobtype = 'file';
                        }
                        updateEncodedBlob(dataURL, path, blobtype);
                    };
                    reader.readAsDataURL(blob);
                }
                
                /**
                 * Async handler to update a blob object to a data URL for encoding.
                 * @param {String} dataURL
                 * @param {String} path
                 * @param {String} blobtype - file if the blob is a file; blob otherwise
                 */
                function updateEncodedBlob(dataURL, path, blobtype) {
                    var encoded = queuedObjects.indexOf(path);
                    path = path.replace('$','derezObj');
                    eval(path+'.$enc="'+dataURL+'"');
                    eval(path+'.$type="'+blobtype+'"');
                    queuedObjects.splice(encoded, 1);
                    checkForCompletion();
                }

                function derez(value, path) {

                    // The derez recurses through the object, producing the deep copy.

                    var i,          // The loop counter
                    name,       // Property name
                    nu;         // The new object or array

                    // typeof null === 'object', so go on if this value is really an object but not
                    // one of the weird builtin objects.

                    if (typeof value === 'object' && value !== null &&
                        !(value instanceof Boolean) &&
                        !(value instanceof Date)    &&
                        !(value instanceof Number)  &&
                        !(value instanceof RegExp)  &&
                        !(value instanceof Blob)  &&
                        !(value instanceof String)) {

                        // If the value is an object or array, look to see if we have already
                        // encountered it. If so, return a $ref/path object. This is a hard way,
                        // linear search that will get slower as the number of unique objects grows.

                        for (i = 0; i < objects.length; i += 1) {
                            if (objects[i] === value) {
                                return {$ref: paths[i]};
                            }
                        }

                        // Otherwise, accumulate the unique value and its path.

                        objects.push(value);
                        paths.push(path);

                        // If it is an array, replicate the array.

                        if (Object.prototype.toString.apply(value) === '[object Array]') {
                            nu = [];
                            for (i = 0; i < value.length; i += 1) {
                                nu[i] = derez(value[i], path + '[' + i + ']');
                            }
                        } else {
                            // If it is an object, replicate the object.
                            nu = {};
                            for (name in value) {
                                if (Object.prototype.hasOwnProperty.call(value, name)) {
                                    nu[name] = derez(value[name],
                                     path + '[' + JSON.stringify(name) + ']');
                                }
                            }
                        }

                        return nu;
                    } else if (value instanceof Blob) {
                        //Queue blob for conversion
                        queuedObjects.push(path);
                        readBlobAsDataURL(value, path);
                    } else if (value instanceof Boolean) {
                        value = {
                            '$type': 'bool',
                            '$enc': value.toString()
                        };
                    } else if (value instanceof Date) {
                        value = {
                            '$type': 'date',
                            '$enc': value.getTime()
                        };
                    } else if (value instanceof Number) {
                        value = {
                            '$type': 'num',
                            '$enc': value.toString()
                        };
                    } else if (value instanceof RegExp) {
                        value = {
                            '$type': 'regex',
                            '$enc': value.toString()
                        }; 
                    }
                    return value;
                }
                var derezObj = derez(object, '$');
                checkForCompletion();
            },
                
            retrocycle: function retrocycle($) {
                //From: https://github.com/douglascrockford/JSON-js/blob/master/cycle.js
                // Contains additional logic to convert strings to the following object types 
                // so that they can properly be decoded:
                //  *Boolean
                //  *Date
                //  *File
                //  *Blob
                //  *Number
                //  *Regex
                // Restore an object that was reduced by decycle. Members whose values are
                // objects of the form
                //      {$ref: PATH}
                // are replaced with references to the value found by the PATH. This will
                // restore cycles. The object will be mutated.

                // The eval function is used to locate the values described by a PATH. The
                // root object is kept in a $ variable. A regular expression is used to
                // assure that the PATH is extremely well formed. The regexp contains nested
                // * quantifiers. That has been known to have extremely bad performance
                // problems on some browsers for very long strings. A PATH is expected to be
                // reasonably short. A PATH is allowed to belong to a very restricted subset of
                // Goessner's JSONPath.

                // So,
                //      var s = '[{"$ref":"$"}]';
                //      return JSON.retrocycle(JSON.parse(s));
                // produces an array containing a single element which is the array itself.

                var px = /^\$(?:\[(?:\d+|\"(?:[^\\\"\u0000-\u001f]|\\([\\\"\/bfnrt]|u[0-9a-zA-Z]{4}))*\")\])*$/;
                
                /**
                 * Converts the specified data URL to a Blob object
                 * @param {String} dataURL to convert to a Blob
                 * @returns {Blob} the converted Blob object
                 */
                function dataURLToBlob(dataURL) {
                    var BASE64_MARKER = ';base64,',
                        contentType,
                        parts,
                        raw;
                    if (dataURL.indexOf(BASE64_MARKER) === -1) {
                        parts = dataURL.split(',');
                        contentType = parts[0].split(':')[1];
                        raw = parts[1];

                        return new Blob([raw], {type: contentType});
                    }

                    parts = dataURL.split(BASE64_MARKER);
                    contentType = parts[0].split(':')[1];
                    raw = window.atob(parts[1]);
                    var rawLength = raw.length;
                    var uInt8Array = new Uint8Array(rawLength);

                    for (var i = 0; i < rawLength; ++i) {
                        uInt8Array[i] = raw.charCodeAt(i);
                    }
                    return new Blob([uInt8Array.buffer], {type: contentType});
                }
                
                function rez(value) {
                    // The rez function walks recursively through the object looking for $ref
                    // properties. When it finds one that has a value that is a path, then it
                    // replaces the $ref object with a reference to the value that is found by
                    // the path.

                    var i, item, name, path;

                    if (value && typeof value === 'object') {
                        if (Object.prototype.toString.apply(value) === '[object Array]') {
                            for (i = 0; i < value.length; i += 1) {
                                item = value[i];
                                if (item && typeof item === 'object') {
                                    path = item.$ref;
                                    if (typeof path === 'string' && px.test(path)) {
                                        value[i] = eval(path);
                                    } else {
                                        value[i] = rez(item);
                                    }
                                }
                            }
                        } else {
                            if (value.$type !== undefined) {
                                switch(value.$type) {
                                    case 'blob':
                                    case 'file': 
                                        value = dataURLToBlob(value.$enc);
                                        break;
                                    case 'bool':
                                        value = Boolean(value.$enc === 'true');
                                        break;
                                    case 'date':
                                        value = new Date(value.$enc);
                                        break;
                                    case 'num':
                                        value = Number(value.$enc);
                                        break;
                                    case 'regex':
                                        value = eval(value.$enc);
                                        break;
                                }
                            } else {
                                for (name in value) {
                                    if (typeof value[name] === 'object') {
                                        item = value[name];
                                        if (item) {
                                            path = item.$ref;
                                            if (typeof path === 'string' && px.test(path)) {
                                                value[name] = eval(path);
                                            } else {
                                                value[name] = rez(item);
                                            }
                                        }
                                    }   
                                }
                            }
                        }
                    }
                    return value;
                }
                rez($);
                return $;

            },

            /**
             * Encode the specified object as a string.  Because of the asynchronus
             * conversion of Blob/File to string, the encode function requires
             * a callback
             * @param {Object} val the value to convert.
             * @param {function} callback the function to call once conversion is
             * complete.  The callback gets called with the converted value.
             */
            "encode": function(val, callback){
                function finishEncode(val) {
                    callback(JSON.stringify(val));
                }
                this.decycle(val, finishEncode);                        
            },
                    
            /**
             * Deserialize the specified string to an object
             * @param {String} val the serialized string
             * @returns {Object} the deserialized object
             */
            "decode": function(val){
                return this.retrocycle(JSON.parse(val));
            }
        };
    }());
    idbModules.Sca = Sca;
}(idbModules));
/*jshint globalstrict: true*/
'use strict';
(function(idbModules){
    /**
     * Encodes the keys and values based on their types. This is required to maintain collations
     */
    var collations = ["", "number", "string", "boolean", "object", "undefined"];
    var getGenericEncoder = function(){
        return {
            "encode": function(key){
                return collations.indexOf(typeof key) + "-" + JSON.stringify(key);
            },
            "decode": function(key){
                if (typeof key === "undefined") {
                    return undefined;
                }
                else {
                    return JSON.parse(key.substring(2));
                }
            }
        };
    };
    
    var types = {
        "number": getGenericEncoder("number"), // decoder will fail for NaN
        "boolean": getGenericEncoder(),
        "object": getGenericEncoder(),
        "string": {
            "encode": function(key){
                return collations.indexOf("string") + "-" + key;
            },
            "decode": function(key){
                return "" + key.substring(2);
            }
        },
        "undefined": {
            "encode": function(key){
                return collations.indexOf("undefined") + "-undefined";
            },
            "decode": function(key){
                return undefined;
            }
        }
    };
	
    var Key = (function(){
        return {
            encode: function(key){
                return types[typeof key].encode(key);
            },
            decode: function(key){
                return types[collations[key.substring(0, 1)]].decode(key);
            }
        };
    }());
    idbModules.Key = Key;
}(idbModules));

/*jshint globalstrict: true*/
'use strict';
(function(idbModules, undefined){
	// The event interface used for IndexedDB Actions.
	var Event = function(type, debug){
		// Returning an object instead of an event as the event's target cannot be set to IndexedDB Objects
		// We still need to have event.target.result as the result of the IDB request
		return {
			"type": type,
			debug: debug,
			bubbles: false,
			cancelable: false,
			eventPhase: 0,
			timeStamp: new Date()
		};
	};
	idbModules.Event = Event;
}(idbModules));

/*jshint globalstrict: true*/
'use strict';
(function(idbModules){

    /**
     * The IDBRequest Object that is returns for all async calls
     * http://dvcs.w3.org/hg/IndexedDB/raw-file/tip/Overview.html#request-api
     */
    var IDBRequest = function(){
        this.onsuccess = this.onerror = this.result = this.error = this.source = this.transaction = null;
        this.readyState = "pending";
    };
    /**
     * The IDBOpen Request called when a database is opened
     */
    var IDBOpenRequest = function(){
        this.onblocked = this.onupgradeneeded = null;
    };
    IDBOpenRequest.prototype = IDBRequest;
    
    idbModules.IDBRequest = IDBRequest;
    idbModules.IDBOpenRequest = IDBOpenRequest;
    
}(idbModules));

/*jshint globalstrict: true*/
'use strict';
(function(idbModules, undefined){
    /**
     * The IndexedDB KeyRange object
     * http://dvcs.w3.org/hg/IndexedDB/raw-file/tip/Overview.html#dfn-key-range
     * @param {Object} lower
     * @param {Object} upper
     * @param {Object} lowerOpen
     * @param {Object} upperOpen
     */
    var IDBKeyRange = function(lower, upper, lowerOpen, upperOpen){
        this.lower = lower;
        this.upper = upper;
        this.lowerOpen = lowerOpen;
        this.upperOpen = upperOpen;
    };
    
    IDBKeyRange.only = function(value){
        return new IDBKeyRange(value, value, false, false);
    };
    
    IDBKeyRange.lowerBound = function(value, open){
        return new IDBKeyRange(value, undefined, open, undefined);
    };
    IDBKeyRange.upperBound = function(value){
        return new IDBKeyRange(undefined, value, undefined, open);
    };
    IDBKeyRange.bound = function(lower, upper, lowerOpen, upperOpen){
        return new IDBKeyRange(lower, upper, lowerOpen, upperOpen);
    };
    
    idbModules.IDBKeyRange = IDBKeyRange;
    
}(idbModules));

/*jshint globalstrict: true*/
'use strict';
(function(idbModules, undefined){
    /**
     * The IndexedDB Cursor Object
     * http://dvcs.w3.org/hg/IndexedDB/raw-file/tip/Overview.html#idl-def-IDBCursor
     * @param {Object} range
     * @param {Object} direction
     * @param {Object} idbObjectStore
     * @param {Object} cursorRequest
     */
    function IDBCursor(range, direction, idbObjectStore, cursorRequest, keyColumnName, valueColumnName){
        if (range && !(range instanceof idbModules.IDBKeyRange)) {
            range = new idbModules.IDBKeyRange(range, range, false, false);
        }
        this.__range = range;
        this.source = this.__idbObjectStore = idbObjectStore;
        this.__req = cursorRequest;

        this.key = undefined;
        this.direction = direction;

        this.__keyColumnName = keyColumnName;
        this.__valueColumnName = valueColumnName;
        this.__valueDecoder = valueColumnName === "value" ? idbModules.Sca : idbModules.Key;

        if (!this.source.transaction.__active) {
            idbModules.util.throwDOMException("TransactionInactiveError - The transaction this IDBObjectStore belongs to is not active.");
        }
        // Setting this to -1 as continue will set it to 0 anyway
        this.__offset = -1;

        this.__lastKeyContinued = undefined; // Used when continuing with a key

        this["continue"]();
    }

    IDBCursor.prototype.__find = function (key, tx, success, error, recordsToLoad) {
        recordsToLoad = recordsToLoad || 1;

        var me = this;
        var sql = ["SELECT * FROM ", idbModules.util.quote(me.__idbObjectStore.name)];
        var sqlValues = [];
        sql.push("WHERE ", me.__keyColumnName, " NOT NULL");
        if (me.__range && (me.__range.lower || me.__range.upper)) {
            sql.push("AND");
            if (me.__range.lower) {
                sql.push(me.__keyColumnName + (me.__range.lowerOpen ? " >" : " >= ") + " ?");
                sqlValues.push(idbModules.Key.encode(me.__range.lower));
            }
            (me.__range.lower && me.__range.upper) && sql.push("AND");
            if (me.__range.upper) {
                sql.push(me.__keyColumnName + (me.__range.upperOpen ? " < " : " <= ") + " ?");
                sqlValues.push(idbModules.Key.encode(me.__range.upper));
            }
        }
        if (typeof key !== "undefined") {
            me.__lastKeyContinued = key;
            me.__offset = 0;
        }
        if (me.__lastKeyContinued !== undefined) {
            sql.push("AND " + me.__keyColumnName + " >= ?");
            sqlValues.push(idbModules.Key.encode(me.__lastKeyContinued));
        }
        sql.push("ORDER BY ", me.__keyColumnName);
        sql.push("LIMIT " + recordsToLoad + " OFFSET " + me.__offset);
        idbModules.DEBUG && console.log(sql.join(" "), sqlValues);

        me.__prefetchedData = null;
        tx.executeSql(sql.join(" "), sqlValues, function (tx, data) {

            if (data.rows.length > 1) {
                me.__prefetchedData = data.rows;
                me.__prefetchedIndex = 0;
                idbModules.DEBUG && console.log("Preloaded " + me.__prefetchedData.length + " records for cursor");
                me.__decode(data.rows.item(0), success);
            }
            else if (data.rows.length === 1) {
                me.__decode(data.rows.item(0), success);
            }
            else {
                idbModules.DEBUG && console.log("Reached end of cursors");
                success(undefined, undefined);
            }
        }, function (tx, data) {
            idbModules.DEBUG && console.log("Could not execute Cursor.continue");
            error(data);
        });
    };

    IDBCursor.prototype.__decode = function (rowItem, callback) {
        var key = idbModules.Key.decode(rowItem[this.__keyColumnName]);
        var val = this.__valueDecoder.decode(rowItem[this.__valueColumnName]);
        var primaryKey = idbModules.Key.decode(rowItem.key);
        callback(key, val, primaryKey);
    };

    IDBCursor.prototype["continue"] = function (key) {
        var recordsToPreloadOnContinue = idbModules.cursorPreloadPackSize || 100;
        var me = this;

        this.__idbObjectStore.transaction.__addToTransactionQueue(function (tx, args, success, error) {

            me.__offset++;

            var successCallback = function(key, val, primaryKey) {
                me.key = key;
                me.value = val;
                me.primaryKey = primaryKey;
                success(typeof me.key !== "undefined" ? me : undefined, me.__req);
            };

            if (me.__prefetchedData) {
                // We have pre-loaded data for the cursor
                me.__prefetchedIndex++;
                if (me.__prefetchedIndex < me.__prefetchedData.length) {
                    me.__decode(me.__prefetchedData.item(me.__prefetchedIndex), successCallback);
                    return;
                }
            }
            // No pre-fetched data, do query
            me.__find(key, tx, successCallback, error, recordsToPreloadOnContinue);

        });
    };

    IDBCursor.prototype.advance = function(count){
        if (count <= 0) {
            idbModules.util.throwDOMException("Type Error - Count is invalid - 0 or negative", count);
        }
        var me = this;
        this.__idbObjectStore.transaction.__addToTransactionQueue(function(tx, args, success, error){
            me.__offset += count;
            me.__find(undefined, tx, function(key, value){
                me.key = key;
                me.value = value;
                success(typeof me.key !== "undefined" ? me : undefined, me.__req);
            }, error);
        });
    };

    IDBCursor.prototype.update = function(valueToUpdate){
        var me = this,
                request = this.__idbObjectStore.transaction.__createRequest(function(){}); //Stub request
        idbModules.Sca.encode(valueToUpdate, function(encoded) {
            me.__idbObjectStore.transaction.__pushToQueue(request, function(tx, args, success, error){
                me.__find(undefined, tx, function(key, value, primaryKey){
                    var store = me.__idbObjectStore,
                        storeProperties = me.__idbObjectStore.transaction.db.__storeProperties;
                    var params = [encoded];
                    var sql = "UPDATE " + idbModules.util.quote(store.name) + " SET value = ?";
                    var indexList = storeProperties[store.name] && storeProperties[store.name].indexList;
                    // Also correct the indexes in the table
                    if (indexList) {
                        for (var index in indexList) {
                            var indexProps = indexList[index];
                            sql += ", " + index + " = ?";
                            params.push(idbModules.Key.encode(valueToUpdate[indexProps.keyPath]));
                        }
                    }
                    sql += " WHERE key = ?";
                    params.push(idbModules.Key.encode(primaryKey));

                    idbModules.DEBUG && console.log(sql, encoded, key, primaryKey);
                    tx.executeSql(sql, params, function(tx, data){
                        me.__prefetchedData = null;
                        if (data.rowsAffected === 1) {
                            success(key);
                        }
                        else {
                            error("No rows with key found" + key);
                        }
                    }, function(tx, data){
                        error(data);
                    });
                }, error);
            });
        });
        return request;
    };

    IDBCursor.prototype["delete"] = function(){
        var me = this;
        return this.__idbObjectStore.transaction.__addToTransactionQueue(function(tx, args, success, error){
            me.__find(undefined, tx, function(key, value, primaryKey){
                var sql = "DELETE FROM  " + idbModules.util.quote(me.__idbObjectStore.name) + " WHERE key = ?";
                idbModules.DEBUG && console.log(sql, key, primaryKey);
                tx.executeSql(sql, [idbModules.Key.encode(primaryKey)], function(tx, data){
                    me.__prefetchedData = null;
                    if (data.rowsAffected === 1) {
                        // lower the offset or we will miss a row
                        me.__offset--;
                        success(undefined);
                    }
                    else {
                        error("No rows with key found" + key);
                    }
                }, function(tx, data){
                    error(data);
                });
            }, error);
        });
    };

    idbModules.IDBCursor = IDBCursor;
}(idbModules));

/*jshint globalstrict: true*/
'use strict';
(function(idbModules, undefined){
    /**
     * IDB Index
     * http://www.w3.org/TR/IndexedDB/#idl-def-IDBIndex
     * @param {Object} name;
     * @param {Object} objectStore;
     */
    function IDBIndex(indexName, idbObjectStore){
        this.indexName = this.name = indexName;
        this.__idbObjectStore = this.objectStore = this.source = idbObjectStore;

        var storeProps = idbObjectStore.transaction.db.__storeProperties[idbObjectStore.name];
        var indexList = storeProps && storeProps.indexList;

        this.keyPath = ((indexList && indexList[indexName] && indexList[indexName].keyPath) || indexName);
        ['multiEntry','unique'].forEach(function(prop){
            this[prop] = !!indexList && !!indexList[indexName] && !!indexList[indexName].optionalParams && !!indexList[indexName].optionalParams[prop];
        }, this);
    }
    
    IDBIndex.prototype.__createIndex = function(indexName, keyPath, optionalParameters){
        var me = this;
        var transaction = me.__idbObjectStore.transaction;
        transaction.__addToTransactionQueue(function(tx, args, success, failure){
            me.__idbObjectStore.__getStoreProps(tx, function(){
                function error(){
                    idbModules.util.throwDOMException(0, "Could not create new index", arguments);
                }
                if (transaction.mode !== 2) {
                    idbModules.util.throwDOMException(0, "Invalid State error, not a version transaction", me.transaction);
                }
                var idxList = JSON.parse(me.__idbObjectStore.__storeProps.indexList);
                if (typeof idxList[indexName] !== "undefined") {
                    idbModules.util.throwDOMException(0, "Index already exists on store", idxList);
                }
                var columnName = indexName;
                idxList[indexName] = {
                    "columnName": columnName,
                    "keyPath": keyPath,
                    "optionalParams": optionalParameters
                };
                // For this index, first create a column
                me.__idbObjectStore.__storeProps.indexList = JSON.stringify(idxList);
                var sql = ["ALTER TABLE", idbModules.util.quote(me.__idbObjectStore.name), "ADD", columnName, "BLOB"].join(" ");
                idbModules.DEBUG && console.log(sql);
                tx.executeSql(sql, [], function(tx, data){
                    // Once a column is created, put existing records into the index
                    tx.executeSql("SELECT * FROM " + idbModules.util.quote(me.__idbObjectStore.name), [], function(tx, data){
                        (function initIndexForRow(i){
                            if (i < data.rows.length) {
                                try {
                                    var value = idbModules.Sca.decode(data.rows.item(i).value);
                                    var indexKey = eval("value['" + keyPath + "']");
                                    tx.executeSql("UPDATE " + idbModules.util.quote(me.__idbObjectStore.name) + " set " + columnName + " = ? where key = ?", [idbModules.Key.encode(indexKey), data.rows.item(i).key], function(tx, data){
                                        initIndexForRow(i + 1);
                                    }, error);
                                } 
                                catch (e) {
                                    // Not a valid value to insert into index, so just continue
                                    initIndexForRow(i + 1);
                                }
                            }
                            else {
                                idbModules.DEBUG && console.log("Updating the indexes in table", me.__idbObjectStore.__storeProps);
                                tx.executeSql("UPDATE __sys__ set indexList = ? where name = ?", [me.__idbObjectStore.__storeProps.indexList, me.__idbObjectStore.name], function(){
                                    me.__idbObjectStore.__setReadyState("createIndex", true);
                                    success(me);
                                }, error);
                            }
                        }(0));
                    }, error);
                }, error);
            }, "createObjectStore");
        });
    };
    
    IDBIndex.prototype.openCursor = function(range, direction){
        var cursorRequest = new idbModules.IDBRequest();
        var cursor = new idbModules.IDBCursor(range, direction, this.source, cursorRequest, this.indexName, "value");
        return cursorRequest;
    };
    
    IDBIndex.prototype.openKeyCursor = function(range, direction){
        var cursorRequest = new idbModules.IDBRequest();
        var cursor = new idbModules.IDBCursor(range, direction, this.source, cursorRequest, this.indexName, "key");
        return cursorRequest;
    };
    
    IDBIndex.prototype.__fetchIndexData = function(key, opType){
        var me = this;
        return me.__idbObjectStore.transaction.__addToTransactionQueue(function(tx, args, success, error){
            var sql = ["SELECT * FROM ", idbModules.util.quote(me.__idbObjectStore.name), " WHERE", me.indexName, "NOT NULL"];
            var sqlValues = [];
            if (typeof key !== "undefined") {
                sql.push("AND", me.indexName, " = ?");
                sqlValues.push(idbModules.Key.encode(key));
            }
            idbModules.DEBUG && console.log("Trying to fetch data for Index", sql.join(" "), sqlValues);
            tx.executeSql(sql.join(" "), sqlValues, function(tx, data){
                var d;
                if (opType === "count") {
                    d = data.rows.length;
                }
                else 
                    if (data.rows.length === 0) {
                        d = undefined;
                    }
                    else 
                        if (opType === "key") {
                            d = idbModules.Key.decode(data.rows.item(0).key);
                        }
                        else { // when opType is value
                            d = idbModules.Sca.decode(data.rows.item(0).value);
                        }
                success(d);
            }, error);
        });
    };
    
    IDBIndex.prototype.get = function(key){
        return this.__fetchIndexData(key, "value");
    };
    
    IDBIndex.prototype.getKey = function(key){
        return this.__fetchIndexData(key, "key");
    };
    
    IDBIndex.prototype.count = function(key){
        return this.__fetchIndexData(key, "count");
    };
    
    idbModules.IDBIndex = IDBIndex;
}(idbModules));

/*jshint globalstrict: true*/
'use strict';
(function(idbModules){

    /**
     * IndexedDB Object Store
     * http://dvcs.w3.org/hg/IndexedDB/raw-file/tip/Overview.html#idl-def-IDBObjectStore
     * @param {Object} name
     * @param {Object} transaction
     */
    var IDBObjectStore = function(name, idbTransaction, ready){
        this.name = name;
        this.transaction = idbTransaction;
        this.__ready = {};
        this.__setReadyState("createObjectStore", typeof ready === "undefined" ? true : ready);
        this.indexNames = new idbModules.util.StringList();
        var dbProps = idbTransaction.db.__storeProperties;
        if (dbProps[name] && dbProps[name].indexList) {
            var indexes = dbProps[name].indexList;
            for (var indexName in indexes) {
                if(indexes.hasOwnProperty(indexName)) {
                    this.indexNames.push(indexName);
                }
            }
        }
    };
    
    /**
     * Need this flag as createObjectStore is synchronous. So, we simply return when create ObjectStore is called
     * but do the processing in the background. All other operations should wait till ready is set
     * @param {Object} val
     */
    IDBObjectStore.prototype.__setReadyState = function(key, val){
        this.__ready[key] = val;
    };
    
    /**
     * Called by all operations on the object store, waits till the store is ready, and then performs the operation
     * @param {Object} callback
     */
    IDBObjectStore.prototype.__waitForReady = function(callback, key){
        var ready = true;
        if (typeof key !== "undefined") {
            ready = (typeof this.__ready[key] === "undefined") ? true : this.__ready[key];
        }
        else {
            for (var x in this.__ready) {
                if (!this.__ready[x]) {
                    ready = false;
                }
            }
        }
        
        if (ready) {
            callback();
        }
        else {
            idbModules.DEBUG && console.log("Waiting for to be ready", key);
            var me = this;
            window.setTimeout(function(){
                me.__waitForReady(callback, key);
            }, 100);
        }
    };
    
    /**
     * Gets (and optionally caches) the properties like keyPath, autoincrement, etc for this objectStore
     * @param {Object} callback
     */
    IDBObjectStore.prototype.__getStoreProps = function(tx, callback, waitOnProperty){
        var me = this;
        this.__waitForReady(function(){
            if (me.__storeProps) {
                idbModules.DEBUG && console.log("Store properties - cached", me.__storeProps);
                callback(me.__storeProps);
            }
            else {
                tx.executeSql("SELECT * FROM __sys__ where name = ?", [me.name], function(tx, data){
                    if (data.rows.length !== 1) {
                        callback();
                    }
                    else {
                        me.__storeProps = {
                            "name": data.rows.item(0).name,
                            "indexList": data.rows.item(0).indexList,
                            "autoInc": data.rows.item(0).autoInc,
                            "keyPath": data.rows.item(0).keyPath
                        };
                        idbModules.DEBUG && console.log("Store properties", me.__storeProps);
                        callback(me.__storeProps);
                    }
                }, function(){
                    callback();
                });
            }
        }, waitOnProperty);
    };
    
    /**
     * From the store properties and object, extracts the value for the key in hte object Store
     * If the table has auto increment, get the next in sequence
     * @param {Object} props
     * @param {Object} value
     * @param {Object} key
     */
    IDBObjectStore.prototype.__deriveKey = function(tx, value, key, callback){
        function getNextAutoIncKey(){
            tx.executeSql("SELECT * FROM sqlite_sequence where name like ?", [me.name], function(tx, data){
                if (data.rows.length !== 1) {
                    callback(0);
                }
                else {
                    callback(data.rows.item(0).seq);
                }
            }, function(tx, error){
                idbModules.util.throwDOMException(0, "Data Error - Could not get the auto increment value for key", error);
            });
        }
        
        var me = this;
        me.__getStoreProps(tx, function(props){
            if (!props) {
                idbModules.util.throwDOMException(0, "Data Error - Could not locate defination for this table", props);
            }
            if (props.keyPath) {
                if (typeof key !== "undefined") {
                    idbModules.util.throwDOMException(0, "Data Error - The object store uses in-line keys and the key parameter was provided", props);
                }
                if (value) {
                    try {
                        var primaryKey = eval("value['" + props.keyPath + "']");
                        if (primaryKey === undefined) {
                            if (props.autoInc === "true") {
                                getNextAutoIncKey();
                            }
                            else {
                                idbModules.util.throwDOMException(0, "Data Error - Could not eval key from keyPath");
                            }
                        }
                        else {
                            callback(primaryKey);
                        }
                    } 
                    catch (e) {
                        idbModules.util.throwDOMException(0, "Data Error - Could not eval key from keyPath", e);
                    }
                }
                else {
                    idbModules.util.throwDOMException(0, "Data Error - KeyPath was specified, but value was not");
                }
            }
            else {
                if (typeof key !== "undefined") {
                    callback(key);
                }
                else {
                    if (props.autoInc === "false") {
                        idbModules.util.throwDOMException(0, "Data Error - The object store uses out-of-line keys and has no key generator and the key parameter was not provided. ", props);
                    }
                    else {
                        // Looks like this has autoInc, so lets get the next in sequence and return that.
                        getNextAutoIncKey();
                    }
                }
            }
        });
    };
    
    IDBObjectStore.prototype.__insertData = function(tx, encoded, value, primaryKey, success, error){
        var paramMap = {};
        if (typeof primaryKey !== "undefined") {
            paramMap.key = idbModules.Key.encode(primaryKey);
        }
        var indexes = JSON.parse(this.__storeProps.indexList);
        for (var key in indexes) {
            try {
                paramMap[indexes[key].columnName] = idbModules.Key.encode(eval("value['" + indexes[key].keyPath + "']"));
            } 
            catch (e) {
                error(e);
            }
        }
        var sqlStart = ["INSERT INTO ", idbModules.util.quote(this.name), "("];
        var sqlEnd = [" VALUES ("];
        var sqlValues = [];
        for (key in paramMap) {
            sqlStart.push(key + ",");
            sqlEnd.push("?,");
            sqlValues.push(paramMap[key]);
        }
        // removing the trailing comma
        sqlStart.push("value )");
        sqlEnd.push("?)");
        sqlValues.push(encoded);
        
        var sql = sqlStart.join(" ") + sqlEnd.join(" ");
        
        idbModules.DEBUG && console.log("SQL for adding", sql, sqlValues);
        tx.executeSql(sql, sqlValues, function(tx, data){
            success(primaryKey);
        }, function(tx, err){
            error(err);
        });
    };
    
    IDBObjectStore.prototype.add = function(value, key){
        var me = this,
            request = me.transaction.__createRequest(function(){}); //Stub request
        idbModules.Sca.encode(value, function(encoded) {
            me.transaction.__pushToQueue(request, function(tx, args, success, error){
                me.__deriveKey(tx, value, key, function(primaryKey){
                    me.__insertData(tx, encoded, value, primaryKey, success, error);
                });
            });
        });
        return request;
    };
    
    IDBObjectStore.prototype.put = function(value, key){
        var me = this,
            request = me.transaction.__createRequest(function(){}); //Stub request
        idbModules.Sca.encode(value, function(encoded) {
            me.transaction.__pushToQueue(request, function(tx, args, success, error){
                me.__deriveKey(tx, value, key, function(primaryKey){
                    // First try to delete if the record exists
                    var sql = "DELETE FROM " + idbModules.util.quote(me.name) + " where key = ?";
                    tx.executeSql(sql, [idbModules.Key.encode(primaryKey)], function(tx, data){
                        idbModules.DEBUG && console.log("Did the row with the", primaryKey, "exist? ", data.rowsAffected);
                        me.__insertData(tx, encoded, value, primaryKey, success, error);
                    }, function(tx, err){
                        error(err);
                    });
                });
            });
        });
        return request;
    };
    
    IDBObjectStore.prototype.get = function(key){
        // TODO Key should also be a key range
        var me = this;
        return me.transaction.__addToTransactionQueue(function(tx, args, success, error){
            me.__waitForReady(function(){
                var primaryKey = idbModules.Key.encode(key);
                idbModules.DEBUG && console.log("Fetching", me.name, primaryKey);
                tx.executeSql("SELECT * FROM " + idbModules.util.quote(me.name) + " where key = ?", [primaryKey], function(tx, data){
                    idbModules.DEBUG && console.log("Fetched data", data);
                    try {
                        // Opera can't deal with the try-catch here.
                        if (0 === data.rows.length) {
                            return success();
                        }
                        
                        success(idbModules.Sca.decode(data.rows.item(0).value));
                    } 
                    catch (e) {
                        idbModules.DEBUG && console.log(e);
                        // If no result is returned, or error occurs when parsing JSON
                        success(undefined);
                    }
                }, function(tx, err){
                    error(err);
                });
            });
        });
    };
    
    IDBObjectStore.prototype["delete"] = function(key){
        // TODO key should also support key ranges
        var me = this;
        return me.transaction.__addToTransactionQueue(function(tx, args, success, error){
            me.__waitForReady(function(){
                var primaryKey = idbModules.Key.encode(key);
                idbModules.DEBUG && console.log("Fetching", me.name, primaryKey);
                tx.executeSql("DELETE FROM " + idbModules.util.quote(me.name) + " where key = ?", [primaryKey], function(tx, data){
                    idbModules.DEBUG && console.log("Deleted from database", data.rowsAffected);
                    success();
                }, function(tx, err){
                    error(err);
                });
            });
        });
    };
    
    IDBObjectStore.prototype.clear = function(){
        var me = this;
        return me.transaction.__addToTransactionQueue(function(tx, args, success, error){
            me.__waitForReady(function(){
                tx.executeSql("DELETE FROM " + idbModules.util.quote(me.name), [], function(tx, data){
                    idbModules.DEBUG && console.log("Cleared all records from database", data.rowsAffected);
                    success();
                }, function(tx, err){
                    error(err);
                });
            });
        });
    };
    
    IDBObjectStore.prototype.count = function(key){
        var me = this;
        return me.transaction.__addToTransactionQueue(function(tx, args, success, error){
            me.__waitForReady(function(){
                var sql = "SELECT * FROM " + idbModules.util.quote(me.name) + ((typeof key !== "undefined") ? " WHERE key = ?" : "");
                var sqlValues = [];
                (typeof key !== "undefined") && sqlValues.push(idbModules.Key.encode(key));
                tx.executeSql(sql, sqlValues, function(tx, data){
                    success(data.rows.length);
                }, function(tx, err){
                    error(err);
                });
            });
        });
    };
    
    IDBObjectStore.prototype.openCursor = function(range, direction){
        var cursorRequest = new idbModules.IDBRequest();
        var cursor = new idbModules.IDBCursor(range, direction, this, cursorRequest, "key", "value");
        return cursorRequest;
    };
    
    IDBObjectStore.prototype.index = function(indexName){
        var index = new idbModules.IDBIndex(indexName, this);
        return index;
    };
    
    IDBObjectStore.prototype.createIndex = function(indexName, keyPath, optionalParameters){
        var me = this;
        optionalParameters = optionalParameters || {};
        me.__setReadyState("createIndex", false);
        var result = new idbModules.IDBIndex(indexName, me);
        me.__waitForReady(function(){
            result.__createIndex(indexName, keyPath, optionalParameters);
        }, "createObjectStore");
        me.indexNames.push(indexName);

        // Also update the db indexList, because after reopening the store, we still want to know this indexName
        var storeProps = me.transaction.db.__storeProperties[me.name];
        storeProps.indexList[indexName] = {
            keyPath: keyPath,
            optionalParams: optionalParameters
        };
        return result;
    };
    
    IDBObjectStore.prototype.deleteIndex = function(indexName){
        var result = new idbModules.IDBIndex(indexName, this, false);
        result.__deleteIndex(indexName);
        return result;
    };
    
    idbModules.IDBObjectStore = IDBObjectStore;
}(idbModules));

/*jshint globalstrict: true*/
'use strict';
(function(idbModules){

    /**
     * The IndexedDB Transaction
     * http://dvcs.w3.org/hg/IndexedDB/raw-file/tip/Overview.html#idl-def-IDBTransaction
     * @param {Object} storeNames
     * @param {Object} mode
     * @param {Object} db
     */
    var READ = 0;
    var READ_WRITE = 1;
    var VERSION_TRANSACTION = 2;
    
    var IDBTransaction = function(storeNames, mode, db){
        if (typeof mode === "number") {
            this.mode = mode;
            (mode !== 2) && idbModules.DEBUG && console.log("Mode should be a string, but was specified as ", mode);
        }
        else 
            if (typeof mode === "string") {
                switch (mode) {
                    case "readwrite":
                        this.mode = READ_WRITE;
                        break;
                    case "readonly":
                        this.mode = READ;
                        break;
                    default:
                        this.mode = READ;
                        break;
                }
            }
        
        this.storeNames = typeof storeNames === "string" ? [storeNames] : storeNames;
        for (var i = 0; i < this.storeNames.length; i++) {
            if (!db.objectStoreNames.contains(this.storeNames[i])) {
                idbModules.util.throwDOMException(0, "The operation failed because the requested database object could not be found. For example, an object store did not exist but was being opened.", this.storeNames[i]);
            }
        }
        this.__active = true;
        this.__running = false;
        this.__requests = [];
        this.__aborted = false;
        this.db = db;
        this.error = null;
        this.onabort = this.onerror = this.oncomplete = null;
        var me = this;
    };
    
    IDBTransaction.prototype.__executeRequests = function(){
        if (this.__running && this.mode !== VERSION_TRANSACTION) {
            idbModules.DEBUG && console.log("Looks like the request set is already running", this.mode);
            return;
        }
        this.__running = true;
        var me = this;
        window.setTimeout(function(){
            if (me.mode !== 2 && !me.__active) {
                idbModules.util.throwDOMException(0, "A request was placed against a transaction which is currently not active, or which is finished", me.__active);
            }
            // Start using the version transaction
            me.db.__db.transaction(function(tx){
                me.__tx = tx;
                var q = null, i = 0;
                function success(result, req){
                    if (req) {
                        q.req = req;// Need to do this in case of cursors
                    }
                    q.req.readyState = "done";
                    q.req.result = result;
                    delete q.req.error;
                    var e = idbModules.Event("success");
                    idbModules.util.callback("onsuccess", q.req, e);
                    i++;
                    executeRequest();
                }
                
                function error(errorVal){
                    q.req.readyState = "done";
                    q.req.error = "DOMError";
                    var e = idbModules.Event("error", arguments);
                    idbModules.util.callback("onerror", q.req, e);
                    i++;
                    executeRequest();
                }
                function executeRequest(){
                    if (i >= me.__requests.length) {
                        me.__active = false; // All requests in the transaction is done
                        me.__requests = [];
                        return;
                    }
                    q = me.__requests[i];
                    q.op(tx, q.args, success, error);
                }
                try {
                    executeRequest();
                } 
                catch (e) {
                    idbModules.DEBUG && console.log("An exception occured in transaction", arguments);
                    typeof me.onerror === "function" && me.onerror();
                }
            }, function(){
                idbModules.DEBUG && console.log("An error in transaction", arguments);
                typeof me.onerror === "function" && me.onerror();
            }, function(){
                idbModules.DEBUG && console.log("Transaction completed", arguments);
                typeof me.oncomplete === "function" && me.oncomplete();
            });
        }, 1);
    };
    
    IDBTransaction.prototype.__addToTransactionQueue = function(callback, args){
        if (!this.__active && this.mode !== VERSION_TRANSACTION) {
            idbModules.util.throwDOMException(0, "A request was placed against a transaction which is currently not active, or which is finished.", this.__mode);
        }
        var request = this.__createRequest();
        this.__pushToQueue(request, callback, args);       
        return request;
    };
    
    IDBTransaction.prototype.__createRequest = function(){
        var request = new idbModules.IDBRequest();
        request.source = this.db;
        request.transaction = this;
        return request;
    };
    
    IDBTransaction.prototype.__pushToQueue = function(request, callback, args) {
        this.__requests.push({
            "op": callback,
            "args": args,
            "req": request
        });
        // Start the queue for executing the requests
        this.__executeRequests();
    };
    
    IDBTransaction.prototype.objectStore = function(objectStoreName){
        return new idbModules.IDBObjectStore(objectStoreName, this);
    };
    
    IDBTransaction.prototype.abort = function(){
        !this.__active && idbModules.util.throwDOMException(0, "A request was placed against a transaction which is currently not active, or which is finished", this.__active);
        
    };
    
    IDBTransaction.prototype.READ_ONLY = 0;
    IDBTransaction.prototype.READ_WRITE = 1;
    IDBTransaction.prototype.VERSION_CHANGE = 2;
    
    idbModules.IDBTransaction = IDBTransaction;
}(idbModules));

/*jshint globalstrict: true*/
'use strict';
(function(idbModules){

    /**
     * IDB Database Object
     * http://dvcs.w3.org/hg/IndexedDB/raw-file/tip/Overview.html#database-interface
     * @param {Object} db
     */
    var IDBDatabase = function(db, name, version, storeProperties){
        this.__db = db;
        this.version = version;
        this.objectStoreNames = new idbModules.util.StringList();
        for (var i = 0; i < storeProperties.rows.length; i++) {
            this.objectStoreNames.push(storeProperties.rows.item(i).name);
        }
        // Convert store properties to an object because we need to modify the object when a db is upgraded and new
        // stores/indexes are being created
        this.__storeProperties = {};
        for (i = 0; i < storeProperties.rows.length; i++) {
            var row = storeProperties.rows.item(i);
            var objectStoreProps = this.__storeProperties[row.name] = {};
            objectStoreProps.keyPath = row.keypath;
            objectStoreProps.autoInc = row.autoInc === "true";
            objectStoreProps.indexList = JSON.parse(row.indexList);
        }
        this.name = name;
        this.onabort = this.onerror = this.onversionchange = null;
    };
    
    IDBDatabase.prototype.createObjectStore = function(storeName, createOptions){
        var me = this;
        createOptions = createOptions || {};
        createOptions.keyPath = createOptions.keyPath || null;
        var result = new idbModules.IDBObjectStore(storeName, me.__versionTransaction, false);
        
        var transaction = me.__versionTransaction;
        transaction.__addToTransactionQueue(function(tx, args, success, failure){
            function error(){
                idbModules.util.throwDOMException(0, "Could not create new object store", arguments);
            }
            
            if (!me.__versionTransaction) {
                idbModules.util.throwDOMException(0, "Invalid State error", me.transaction);
            }
            //key INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL UNIQUE
            var sql = ["CREATE TABLE", idbModules.util.quote(storeName), "(key BLOB", createOptions.autoIncrement ? ", inc INTEGER PRIMARY KEY AUTOINCREMENT" : "PRIMARY KEY", ", value BLOB)"].join(" ");
            idbModules.DEBUG && console.log(sql);
            tx.executeSql(sql, [], function(tx, data){
                tx.executeSql("INSERT INTO __sys__ VALUES (?,?,?,?)", [storeName, createOptions.keyPath, createOptions.autoIncrement ? true : false, "{}"], function(){
                    result.__setReadyState("createObjectStore", true);
                    success(result);
                }, error);
            }, error);
        });
        
        // The IndexedDB Specification needs us to return an Object Store immediatly, but WebSQL does not create and return the store immediatly
        // Hence, this can technically be unusable, and we hack around it, by setting the ready value to false
        me.objectStoreNames.push(storeName);
        // Also store this for the first run
        var storeProps = me.__storeProperties[storeName] = {};
        storeProps.keyPath = createOptions.keyPath;
        storeProps.autoInc = !!createOptions.autoIncrement;
        storeProps.indexList = {};
        return result;
    };
    
    IDBDatabase.prototype.deleteObjectStore = function(storeName){
        var error = function(){
            idbModules.util.throwDOMException(0, "Could not delete ObjectStore", arguments);
        };
        var me = this;
        !me.objectStoreNames.contains(storeName) && error("Object Store does not exist");
        me.objectStoreNames.splice(me.objectStoreNames.indexOf(storeName), 1);
        
        var transaction = me.__versionTransaction;
        transaction.__addToTransactionQueue(function(tx, args, success, failure){
            if (!me.__versionTransaction) {
                idbModules.util.throwDOMException(0, "Invalid State error", me.transaction);
            }
            me.__db.transaction(function(tx){
                tx.executeSql("SELECT * FROM __sys__ where name = ?", [storeName], function(tx, data){
                    if (data.rows.length > 0) {
                        tx.executeSql("DROP TABLE " + idbModules.util.quote(storeName), [], function(){
                            tx.executeSql("DELETE FROM __sys__ WHERE name = ?", [storeName], function(){
                            }, error);
                        }, error);
                    }
                });
            });
        });
    };
    
    IDBDatabase.prototype.close = function(){
        // Don't do anything coz the database automatically closes
    };
    
    IDBDatabase.prototype.transaction = function(storeNames, mode){
        var transaction = new idbModules.IDBTransaction(storeNames, mode || 1, this);
        return transaction;
    };
    
    idbModules.IDBDatabase = IDBDatabase;
}(idbModules));

/*jshint globalstrict: true*/
'use strict';
(function(idbModules){
    var DEFAULT_DB_SIZE = 4 * 1024 * 1024;
    if (!window.openDatabase) {
        return;
    }
    // The sysDB to keep track of version numbers for databases
    var sysdb = window.openDatabase("__sysdb__", 1, "System Database", DEFAULT_DB_SIZE);
    sysdb.transaction(function(tx){
        tx.executeSql("CREATE TABLE IF NOT EXISTS dbVersions (name VARCHAR(255), version INT);", []);
    }, function() {
       idbModules.DEBUG && console.log("Error in sysdb transaction - when creating dbVersions", arguments);
    });
    
    var shimIndexedDB = {
        /**
         * The IndexedDB Method to create a new database and return the DB
         * @param {Object} name
         * @param {Object} version
         */
        open: function(name, version){
            var req = new idbModules.IDBOpenRequest();
            var calledDbCreateError = false;
            
            function dbCreateError(){
                if (calledDbCreateError) {
                    return;
                }
                var e = idbModules.Event("error", arguments);
                req.readyState = "done";
                req.error = "DOMError";
                idbModules.util.callback("onerror", req, e);
                calledDbCreateError = true;
            }
            
            function openDB(oldVersion){
                var db = window.openDatabase(name, 1, name, DEFAULT_DB_SIZE);
                req.readyState = "done";
                if (typeof version === "undefined") {
                    version = oldVersion || 1;
                }
                if (version <= 0 || oldVersion > version) {
                    idbModules.util.throwDOMException(0, "An attempt was made to open a database using a lower version than the existing version.", version);
                }
                
                db.transaction(function(tx){
                    tx.executeSql("CREATE TABLE IF NOT EXISTS __sys__ (name VARCHAR(255), keyPath VARCHAR(255), autoInc BOOLEAN, indexList BLOB)", [], function(){
                        tx.executeSql("SELECT * FROM __sys__", [], function(tx, data){
                            var e = idbModules.Event("success");
                            req.source = req.result = new idbModules.IDBDatabase(db, name, version, data);
                            if (oldVersion < version) {
                                // DB Upgrade in progress 
                                sysdb.transaction(function(systx){
                                    systx.executeSql("UPDATE dbVersions set version = ? where name = ?", [version, name], function(){
                                        var e = idbModules.Event("upgradeneeded");
                                        e.oldVersion = oldVersion;
                                        e.newVersion = version;
                                        req.transaction = req.result.__versionTransaction = new idbModules.IDBTransaction([], 2, req.source);
                                        idbModules.util.callback("onupgradeneeded", req, e, function(){
                                            var e = idbModules.Event("success");
                                            idbModules.util.callback("onsuccess", req, e);
                                        });
                                    }, dbCreateError);
                                }, dbCreateError);
                            } else {
                                idbModules.util.callback("onsuccess", req, e);
                            }
                        }, dbCreateError);
                    }, dbCreateError);
                }, dbCreateError);
            }
            
            sysdb.transaction(function(tx){
                tx.executeSql("SELECT * FROM dbVersions where name = ?", [name], function(tx, data){
                    if (data.rows.length === 0) {
                        // Database with this name does not exist
                        tx.executeSql("INSERT INTO dbVersions VALUES (?,?)", [name, version || 1], function(){
                            openDB(0);
                        }, dbCreateError);
                    } else {
                        openDB(data.rows.item(0).version);
                    }
                }, dbCreateError);
            }, dbCreateError);
            
            return req;
        },
        
        "deleteDatabase": function(name){
            var req = new idbModules.IDBOpenRequest();
            var calledDBError = false;
            function dbError(msg){
                if (calledDBError) {
                    return;
                }
                req.readyState = "done";
                req.error = "DOMError";
                var e = idbModules.Event("error");
                e.message = msg;
                e.debug = arguments;
                idbModules.util.callback("onerror", req, e);
                calledDBError = true;
            }
            var version = null;
            function deleteFromDbVersions(){
                sysdb.transaction(function(systx){
                    systx.executeSql("DELETE FROM dbVersions where name = ? ", [name], function(){
                        req.result = undefined;
                        var e = idbModules.Event("success");
                        e.newVersion = null;
                        e.oldVersion = version;
                        idbModules.util.callback("onsuccess", req, e);
                    }, dbError);
                }, dbError);
            }
            sysdb.transaction(function(systx){
                systx.executeSql("SELECT * FROM dbVersions where name = ?", [name], function(tx, data){
                    if (data.rows.length === 0) {
                        req.result = undefined;
                        var e = idbModules.Event("success");
                        e.newVersion = null;
                        e.oldVersion = version;
                        idbModules.util.callback("onsuccess", req, e);
                        return;
                    }
                    version = data.rows.item(0).version;
                    var db = window.openDatabase(name, 1, name, DEFAULT_DB_SIZE);
                    db.transaction(function(tx){
                        tx.executeSql("SELECT * FROM __sys__", [], function(tx, data){
                            var tables = data.rows;
                            (function deleteTables(i){
                                if (i >= tables.length) {
                                    // If all tables are deleted, delete the housekeeping tables
                                    tx.executeSql("DROP TABLE __sys__", [], function(){
                                        // Finally, delete the record for this DB from sysdb
                                        deleteFromDbVersions();
                                    }, dbError);
                                } else {
                                    // Delete all tables in this database, maintained in the sys table
                                    tx.executeSql("DROP TABLE " + idbModules.util.quote(tables.item(i).name), [], function(){
                                        deleteTables(i + 1);
                                    }, function(){
                                        deleteTables(i + 1);
                                    });
                                }
                            }(0));
                        }, function(e){
                            // __sysdb table does not exist, but that does not mean delete did not happen
                            deleteFromDbVersions();
                        });
                    }, dbError);
                });
            }, dbError);
            return req;
        },
        "cmp": function(key1, key2){
            return idbModules.Key.encode(key1) > idbModules.Key.encode(key2) ? 1 : key1 === key2 ? 0 : -1;
        }
    };
    
    idbModules.shimIndexedDB = shimIndexedDB;
}(idbModules));

/*jshint globalstrict: true*/
'use strict';
(function(window, idbModules){
    if (typeof window.openDatabase !== "undefined") {
        window.shimIndexedDB = idbModules.shimIndexedDB;
        if (window.shimIndexedDB) {
            window.shimIndexedDB.__useShim = function(){
                window.indexedDB = idbModules.shimIndexedDB;
                window.IDBDatabase = idbModules.IDBDatabase;
                window.IDBTransaction = idbModules.IDBTransaction;
                window.IDBCursor = idbModules.IDBCursor;
                window.IDBKeyRange = idbModules.IDBKeyRange;
                // On some browsers the assignment fails, overwrite with the defineProperty method
                if (window.indexedDB !== idbModules.shimIndexedDB && Object.defineProperty) {
                    Object.defineProperty(window, 'indexedDB', {
                        value: idbModules.shimIndexedDB
                    });
                }
            };
            window.shimIndexedDB.__debug = function(val){
                idbModules.DEBUG = val;
            };
        }
    }
    
    /*
    prevent error in Firefox
    */
    if(!('indexedDB' in window)) {
        window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.oIndexedDB || window.msIndexedDB;
    }
    
    /*
    detect browsers with known IndexedDb issues (e.g. Android pre-4.4)
    */
    var poorIndexedDbSupport = false;
    if (navigator.userAgent.match(/Android 2/) || navigator.userAgent.match(/Android 3/) || navigator.userAgent.match(/Android 4\.[0-3]/)) {
        /* Chrome is an exception. It supports IndexedDb */
        if (!navigator.userAgent.match(/Chrome/)) {
            poorIndexedDbSupport = true;
        }
    }

    if ((typeof window.indexedDB === "undefined" || poorIndexedDbSupport) && typeof window.openDatabase !== "undefined") {
        window.shimIndexedDB.__useShim();
    }
    else {
        window.IDBDatabase = window.IDBDatabase || window.webkitIDBDatabase;
        window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
        window.IDBCursor = window.IDBCursor || window.webkitIDBCursor;
        window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
        if(!window.IDBTransaction){
            window.IDBTransaction = {};
        }
        /* Some browsers (e.g. Chrome 18 on Android) support IndexedDb but do not allow writing of these properties */
        try {
            window.IDBTransaction.READ_ONLY = window.IDBTransaction.READ_ONLY || "readonly";
            window.IDBTransaction.READ_WRITE = window.IDBTransaction.READ_WRITE || "readwrite";
        } catch (e) {}
    }
}(window, idbModules));

/*jshint browser: true, onevar: false, strict: false, eqeqeq: false */
/*global IDBKeyRange, define, exports, module */
// index.js
// Provides easy interaction with indexedDB
// ---
// Part of the Riggr SPA framework <https://github.com/Fluidbyte/Riggr> and released
// under the MIT license. This notice must remain intact.
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.indexed = factory();
    }
}(this, function () {
    var in_id = 0;
    var out_id = 0;
    window.shimIndexedDB.__debug(true);
    // Hackery
    var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.oIndexedDB || window.msIndexedDB||window.shimIndexedDB;

    function indexed(dbstore) {

        return {

            // Ensure callback exists and is function, then do it...
            processCB: function (cb, out) {
                if (cb && typeof cb === 'function') {
                    var err = (out === false) ? true : false;
                    cb(err, out);
                }
            },

            // Parse query to string for evaluation
            parseQuery: function (query) {
                var res = [];
                if (!Array.isArray(query)) {
                    query = [query];
                }
                query.forEach(function (cond) {
                    // Set key
                    for (var key in cond) {
                        // Check for conditional
                        if (typeof cond[key] === 'object') {
                            var condition = Object.keys(cond[key]);
                            res.push({
                                field: key,
                                operand: condition[0],
                                value: cond[key][condition]
                            });
                        } else {
                            // Direct (==) matching
                            res.push({
                                field: key,
                                operand: '$eq',
                                value: cond[key]
                            });
                        }
                    }
                });
                return res;
            },

            // Check data type
            checkType: function (obj) {
                return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
            },

            // Create indexedDB store
            _create: function (option, cb) {
                console.log("[indexed]: open", option, cb);
                var self = this;
                option = option||{};
                if (option.capped) {
                    self.capped = option.capped;
                }
                var store;
                var request = indexedDB.open(dbstore);
                // Handle onupgradeneeded
                request.onupgradeneeded = function (e) {
                    console.log("[indexed]: open onupgradeneeded");
                    var db = e.target.result;

                    // Create store
                    store = db.createObjectStore(dbstore, {
                        keyPath: '_id',
                        autoIncrement: false
                    });

                    var indexes = option.indexes;
                    for (var i in indexes) {
                        var item = indexes[i];
                        store.createIndex(item.name, item.name, {unique:item.unique});
                    }
                };

                request.onsuccess = function (e) {
                    console.log("[indexed]: open onsuccess");
                    var db = e.target.result;
                    if (!db.objectStoreNames.contains(dbstore)) {
                        console.log("[indexed]: open not contains");
                        self._drop(function() {
                            self._create(option, cb);
                        });
                    } else {
                        self.db = db;
                        console.log("[indexed]: open contains");
                        if (self.capped&&!store) {
                            var trans = db.transaction([dbstore], self.IDBTransactionModes.READ_ONLY);
                            store = trans.objectStore(dbstore);
                            var countRequest = store.count();
                            countRequest.onsuccess = function() {
                                console.log("[indexed]:init count:"+countRequest.result);
                                self.itemCount = countRequest.result;
                                self.processCB(cb, true);
                                db.close();
                            }
                        } else {
                            console.log("[indexed]:init count:0");
                            self.itemCount = 0;
                            self.processCB(cb, true);
                            db.close();
                        }
                    }
                };

                request.onerror = function () {
                    console.log("[indexed]: open onerror");
                    self._drop(function() {
                        self._create(option, cb);
                    });
                };
            },
            create: function(option, cb) {
                var _id = in_id++;
                var self = this;
                async.until(
                    function(){return _id===out_id},
                    function(c) {setTimeout(c, 100)},
                    function() {self._create(option, function(err, doc) {out_id++; cb&&cb(err, doc)})}
                );
                return this;
            },
            _insert: function (data, cb) {
                var self = this;
                var request = indexedDB.open(dbstore);

                function insertData(db, store) {
                    data._id = new Date().getTime();
                    var request = store.put(data).onsuccess = function (e) {
                        self.itemCount++;
                        self.processCB(cb, true);
                        db.close();
                    };
                    request.onerror = function (e) {
                        self.processCB(cb, false);
                    };
                }

                request.onsuccess = function (e) {
                    // Setup trans and store
                    var db = e.target.result;
                    var trans = db.transaction([dbstore], self.IDBTransactionModes.READ_WRITE);
                    var store = trans.objectStore(dbstore);

                    console.log("[indexed]:"+dbstore+"'s count="+self.itemCount+(self.capped?("("+self.capped.max+")"):''));
                    if (self.capped && self.itemCount>=self.capped.max) {
                        var index = store.index(self.capped.name);
                        var cursorRequest = index.openCursor(null, self.capped.direction==1?"next":"prev");
                        cursorRequest.onsuccess = function(e) {
                            var result = e.target.result;
                            if (result) {
                                var oldval = result.value[self.capped.name];
                                var newval = data[self.capped.name];
                                if (self.capped.strict && (oldval-newval)*self.capped.direction>=0) {
                                    //do nothing
                                    console.log("[indexed]:not replace "+oldval+" to "+newval);
                                    self.processCB(cb, {resolve:true});
                                    return;
                                }
                                console.log("[indexed]:replace "+oldval+" to "+newval);
                                result.delete(result.value._id);
                                self.itemCount--;
                                insertData(db, store);
                            }
                        };
                        cursorRequest.onerror = function() {
                            self.processCB(cb, false);
                        };
                    } else {
                        console.log("[indexed]:insert "+(self.capped?data[self.capped.name]:JSON.stringify(data)));
                        insertData(db, store);
                    }
                };

                // General error
                request.onerror = function () {
                    self.processCB(cb, false);
                };
            },
            insert: function(data, cb) {
                var _id = in_id++;
                var self = this;
                async.until(
                    function(){return _id===out_id},
                    function(c) {setTimeout(c, 100)},
                    function() {self._insert(data, function(err, doc) {out_id++; cb&&cb(err, doc)})}
                );
                return this;
            },
            // Add item to the store
            _insertEx: function (data, cb) {
                var self = this;
                var request = indexedDB.open(dbstore);
                request.onsuccess = function (e) {
                    // Setup trans and store
                    var db = e.target.result;
                    var trans = db.transaction([dbstore], self.IDBTransactionModes.READ_WRITE);
                    var store = trans.objectStore(dbstore);
                    var i, returnQuery;

                    function putNext() {
                        if (i < data.length) {
                            // Set _id
                            data[i]._id = new Date().getTime() + i;
                            // Insert, call putNext recursively on success
                            store.put(data[i]).onsuccess = putNext;
                            //console.log('data', data[i]);
                            i++;
                        } else {
                            // Complete
                            self.processCB(cb, true);
                        }
                    }

                    if (self.checkType(data) === 'array') {
                        // Insert array of items
                        i = 0;
                        returnQuery = {
                            '_id': {
                                '$gte': new Date().getTime()
                            }
                        };

                        putNext();

                    } else {
                        // Insert single item
                        data._id = new Date().getTime();
                        var request = store.put(data).onsuccess = function (e) {
                            // Run select to return new record
                            self.processCB(cb, true);
                            db.close();
                        };

                        // Insert error
                        request.onerror = function (e) {
                            self.processCB(cb, false);
                        };
                    }
                };

                // General error
                request.onerror = function () {
                    self.processCB(cb, false);
                };
            },
            insertEx: function(data, cb) {
                var _id = in_id++;
                var self = this;
                async.until(
                    function(){return _id===out_id},
                    function(c) {setTimeout(c, 100);},
                    function() {self._insertEx(data, function(err, data){out_id++; cb&&cb(err, data)})}
                );
                return this;
            },

            // Traverse data
            traverse: function (query, data, cb) {
                var self = this;
                var request = indexedDB.open(dbstore);

                request.onsuccess = function (e) {

                    var db = e.target.result;
                    var trans = db.transaction([dbstore], self.IDBTransactionModes.READ_WRITE);
                    var store = trans.objectStore(dbstore);

                    // Setup cursor request
                    var keyRange = IDBKeyRange.lowerBound(0);
                    var cursorRequest = store.openCursor(keyRange);
                    var results = [];

                    cursorRequest.onsuccess = function (e) {
                        //jshint maxstatements: 24, maxcomplexity: 12
                        var result = e.target.result;
                        var prop;

                        // Stop on no result
                        if (!result) {
                            return;
                        }

                        function evaluate(val1, op, val2) {
                            switch (op) {
                                case '$gt':
                                    return val1 > val2;
                                case '$lt':
                                    return val1 < val2;
                                case '$gte':
                                    return val1 >= val2;
                                case '$lte':
                                    return val1 <= val2;
                                case '$ne':
                                    return val1 != val2;
                                case '$eq':
                                    return val1 == val2;
                                case '$like':
                                    return new RegExp(val2, 'i').test(val1);
                            }
                        }
                        // Test query
                        if (query) {
                            var match = true;
                            query.forEach(function (cond) {
                                match = match && evaluate(result.value[cond.field], cond.operand, cond.value);
                            });
                            // Evaluate test condition
                            if (match) {
                                // Check if update
                                if (self.checkType(data) === 'object') {
                                    for (prop in data) {
                                        result.value[prop] = data[prop];
                                    }
                                    result.update(result.value);
                                }
                                // Check if delete
                                if (data === 'delete') {
                                    result.delete(result.value._id);
                                }
                                // Push to array
                                results.push(result.value);
                            }
                        } else {
                            // Check if update
                            if (self.checkType(data) === 'object') {
                                for (prop in data) {
                                    result.value[prop] = data[prop];
                                }
                                result.update(result.value);
                            }
                            // Check if delete
                            if (data === 'delete') {
                                result.delete(result.value._id);
                            }
                            // Push to array
                            results.push(result.value);
                        }
                        // Move on
                        result.continue();
                    };

                    // Entire transaction complete
                    trans.oncomplete = function (e) {
                        // Send results
                        self.processCB(cb, results);
                        db.close();
                    };

                    // Cursor error
                    cursorRequest.onerror = function () {
                        self.processCB(cb, false);
                    };
                };

                // General error, cb false
                request.onerror = function () {
                    self.processCB(cb, false);
                };

            },

            // Find record(s)
            __find: function () {
                var query = false;
                var cb;
                // Check arguments to determine query
                if (arguments.length === 1 && typeof arguments[0] === 'function') {
                    // Find all
                    cb = arguments[0];
                } else {
                    // Conditional find
                    query = this.parseQuery(arguments[0]);
                    cb = arguments[1];
                }
                this.traverse(query, false, cb);
            },
            _find: function (query, cb) {
                this.traverse(query, false, cb);
            },
            find: function() {
                var _id = in_id++;
                var self = this;
                var query = false;
                var cb;
                // Check arguments to determine query
                if (arguments.length === 1 && typeof arguments[0] === 'function') {
                    // Find all
                    cb = arguments[0];
                } else {
                    // Conditional find
                    query = this.parseQuery(arguments[0]);
                    cb = arguments[1];
                }
                async.until(
                    function(){return _id===out_id},
                    function(c) {setTimeout(c, 100)},
                    function() {self._find(query, function(err, docs) {out_id++; cb&&cb(err, docs)})}
                );
                return this;
            },

            // FindOne record
            _findOne: function (query, cb) {
                this.traverse(query, false, function(err, docs) {
                    cb(err, docs?docs[0]:null);
                });
            },
            findOne: function() {
                var _id = in_id++;
                var self = this;
                var query = false;
                var cb;
                if (arguments.length === 1 && typeof arguments[0] === 'function') {
                    // Find all
                    cb = arguments[0];
                } else {
                    // Conditional find
                    query = this.parseQuery(arguments[0]);
                    cb = arguments[1];
                }
                async.until(
                    function(){return _id===out_id},
                    function(c) {setTimeout(c, 100)},
                    function() {self._findOne(query, function(err, doc) {out_id++; cb&&cb(err, doc)})}
                );
                return this;
            },

            // Update record(s)
            _update: function (query, data, cb) {
                this.traverse(query, data, cb);
            },
            update: function() {
                var _id = in_id++;
                var self = this;
                var query = false;
                var data;
                var cb;
                // Check arguments to determine query
                if (arguments.length === 2 && typeof arguments[1] === 'function') {
                    // Update all
                    data = arguments[0];
                    cb = arguments[1];
                } else {
                    // Update on match
                    query = this.parseQuery(arguments[0]);
                    data = arguments[1];
                    cb = arguments[2];
                }
                async.until(
                    function(){return _id===out_id},
                    function(c) {setTimeout(c, 100)},
                    function() {self._update(query, data, function(err, data) {out_id++; cb&&cb(err, data)})}
                );
                return this;
            },

            // Upsert record(s)
            _upsert: function (query, data, ddata, cb) {
                var self = this;
                this._update(query, data, function(err, docs) {
                    if (!docs.length) {
                        for (var key in ddata) {
                            data[key] = ddata[key];
                        }
                        self._insert(data, cb);
                    } else {
                        cb(err, docs);
                    }
                });
            },
            upsert: function() {
                var _id = in_id++;
                var self = this;
                var query = false;
                var data, ddata;
                var cb;
                query = arguments[0];
                data = arguments[1];
                // Check arguments to determine query
                if (arguments.length === 3 && typeof arguments[2] === 'function') {
                    // Update all
                    cb = arguments[2];
                } else if (arguments.length === 4 && typeof arguments[3] === 'function') {
                    // Update all
                    ddata = arguments[2];
                    cb = arguments[3];
                    ddata = {};
                } else {
                    // Update on match
                    ddata = arguments[2];
                    cb = arguments[3];
                }
                if (!ddata) {
                    ddata = {};
                }
                for (var key in query) {
                    ddata[key] = query[key];
                }
                query = this.parseQuery(query);
                async.until(
                    function(){return _id===out_id},
                    function(c) {setTimeout(c, 100)},
                    function() {self._upsert(query, data, ddata, function(err, data) {out_id++; cb&&cb(err, data)})}
                );
                return this;
            },

            // Delete record(s)
            _delete: function (query, cb) {
                this.traverse(query, 'delete', cb);
            },
            delete: function() {
                var _id = in_id++;
                var self = this;
                var query = false;
                var cb;
                // Check arguments to determine query
                if (arguments.length === 1 && typeof arguments[0] === 'function') {
                    // Find all
                    cb = arguments[0];
                } else {
                    // Conditional find
                    query = this.parseQuery(arguments[0]);
                    cb = arguments[1];
                }
                async.until(
                    function(){return _id===out_id},
                    function(c) {setTimeout(c, 100)},
                    function() {self._delete(query, function(err, data){out_id++; cb&&cb(err, data)})}
                );
                return this;
            },

            // Drop data store
            _drop: function (cb) {
                var self = this;
                var deleteRequest = indexedDB.deleteDatabase(dbstore);
                // Golden
                deleteRequest.onsuccess = function (e) {
                    console.log("[indexed]: drop onsuccess");
                    self.processCB(cb, true);
                };
                // Blocked
                deleteRequest.onblocked = function (e) {
                    console.log("[indexed]: drop onblocked");
                    self.processCB(cb, false);
                };
                // Something worse
                deleteRequest.onerror = function () {
                    console.log("[indexed]: drop onerror");
                    self.processCB(cb, false);
                };
            },
            drop: function(cb) {
                var _id = in_id++;
                var self = this;
                async.until(
                    function(){return _id===out_id},
                    function(c) {setTimeout(c, 100)},
                    function() {self._drop(function(err, data) {out_id++; cb&&cb(err, data)})}
                );
                return this;
            },
            IDBTransactionModes: {
                'READ_ONLY': 'readonly',
                'READ_WRITE': 'readwrite',
                'VERSION_CHANGE': 'versionchange'
            }
        };
    }

    return indexed;

}));
!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.io=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){

    module.exports = _dereq_('./lib/');

},{"./lib/":2}],2:[function(_dereq_,module,exports){

    /**
     * Module dependencies.
     */

    var url = _dereq_('./url');
    var parser = _dereq_('socket.io-parser');
    var Manager = _dereq_('./manager');
    var debug = _dereq_('debug')('socket.io-client');

    /**
     * Module exports.
     */

    module.exports = exports = lookup;

    /**
     * Managers cache.
     */

    var cache = exports.managers = {};

    /**
     * Looks up an existing `Manager` for multiplexing.
     * If the user summons:
     *
     *   `io('http://localhost/a');`
     *   `io('http://localhost/b');`
     *
     * We reuse the existing instance based on same scheme/port/host,
     * and we initialize sockets for each namespace.
     *
     * @api public
     */

    function lookup(uri, opts) {
        if (typeof uri == 'object') {
            opts = uri;
            uri = undefined;
        }

        opts = opts || {};

        var parsed = url(uri);
        var source = parsed.source;
        var id = parsed.id;
        var io;

        if (opts.forceNew || opts['force new connection'] || false === opts.multiplex) {
            debug('ignoring socket cache for %s', source);
            io = Manager(source, opts);
        } else {
            if (!cache[id]) {
                debug('new io instance for %s', source);
                cache[id] = Manager(source, opts);
            }
            io = cache[id];
        }

        return io.socket(parsed.path);
    }

    /**
     * Protocol version.
     *
     * @api public
     */

    exports.protocol = parser.protocol;

    /**
     * `connect`.
     *
     * @param {String} uri
     * @api public
     */

    exports.connect = lookup;

    /**
     * Expose constructors for standalone build.
     *
     * @api public
     */

    exports.Manager = _dereq_('./manager');
    exports.Socket = _dereq_('./socket');

},{"./manager":3,"./socket":5,"./url":6,"debug":10,"socket.io-parser":46}],3:[function(_dereq_,module,exports){

    /**
     * Module dependencies.
     */

    var url = _dereq_('./url');
    var eio = _dereq_('engine.io-client');
    var Socket = _dereq_('./socket');
    var Emitter = _dereq_('component-emitter');
    var parser = _dereq_('socket.io-parser');
    var on = _dereq_('./on');
    var bind = _dereq_('component-bind');
    var object = _dereq_('object-component');
    var debug = _dereq_('debug')('socket.io-client:manager');
    var indexOf = _dereq_('indexof');
    var Backoff = _dereq_('backo2');

    /**
     * Module exports
     */

    module.exports = Manager;

    /**
     * `Manager` constructor.
     *
     * @param {String} engine instance or engine uri/opts
     * @param {Object} options
     * @api public
     */

    function Manager(uri, opts){
        if (!(this instanceof Manager)) return new Manager(uri, opts);
        if (uri && ('object' == typeof uri)) {
            opts = uri;
            uri = undefined;
        }
        opts = opts || {};

        opts.path = opts.path || '/socket.io';
        this.nsps = {};
        this.subs = [];
        this.opts = opts;
        this.reconnection(opts.reconnection !== false);
        this.reconnectionAttempts(opts.reconnectionAttempts || Infinity);
        this.reconnectionDelay(opts.reconnectionDelay || 1000);
        this.reconnectionDelayMax(opts.reconnectionDelayMax || 5000);
        this.randomizationFactor(opts.randomizationFactor || 0.5);
        this.backoff = new Backoff({
            min: this.reconnectionDelay(),
            max: this.reconnectionDelayMax(),
            jitter: this.randomizationFactor()
        });
        this.timeout(null == opts.timeout ? 20000 : opts.timeout);
        this.readyState = 'closed';
        this.uri = uri;
        this.connected = [];
        this.encoding = false;
        this.packetBuffer = [];
        this.encoder = new parser.Encoder();
        this.decoder = new parser.Decoder();
        this.autoConnect = opts.autoConnect !== false;
        if (this.autoConnect) this.open();
    }

    /**
     * Propagate given event to sockets and emit on `this`
     *
     * @api private
     */

    Manager.prototype.emitAll = function() {
        this.emit.apply(this, arguments);
        for (var nsp in this.nsps) {
            this.nsps[nsp].emit.apply(this.nsps[nsp], arguments);
        }
    };

    /**
     * Update `socket.id` of all sockets
     *
     * @api private
     */

    Manager.prototype.updateSocketIds = function(){
        for (var nsp in this.nsps) {
            this.nsps[nsp].id = this.engine.id;
        }
    };

    /**
     * Mix in `Emitter`.
     */

    Emitter(Manager.prototype);

    /**
     * Sets the `reconnection` config.
     *
     * @param {Boolean} true/false if it should automatically reconnect
     * @return {Manager} self or value
     * @api public
     */

    Manager.prototype.reconnection = function(v){
        if (!arguments.length) return this._reconnection;
        this._reconnection = !!v;
        return this;
    };

    /**
     * Sets the reconnection attempts config.
     *
     * @param {Number} max reconnection attempts before giving up
     * @return {Manager} self or value
     * @api public
     */

    Manager.prototype.reconnectionAttempts = function(v){
        if (!arguments.length) return this._reconnectionAttempts;
        this._reconnectionAttempts = v;
        return this;
    };

    /**
     * Sets the delay between reconnections.
     *
     * @param {Number} delay
     * @return {Manager} self or value
     * @api public
     */

    Manager.prototype.reconnectionDelay = function(v){
        if (!arguments.length) return this._reconnectionDelay;
        this._reconnectionDelay = v;
        this.backoff && this.backoff.setMin(v);
        return this;
    };

    Manager.prototype.randomizationFactor = function(v){
        if (!arguments.length) return this._randomizationFactor;
        this._randomizationFactor = v;
        this.backoff && this.backoff.setJitter(v);
        return this;
    };

    /**
     * Sets the maximum delay between reconnections.
     *
     * @param {Number} delay
     * @return {Manager} self or value
     * @api public
     */

    Manager.prototype.reconnectionDelayMax = function(v){
        if (!arguments.length) return this._reconnectionDelayMax;
        this._reconnectionDelayMax = v;
        this.backoff && this.backoff.setMax(v);
        return this;
    };

    /**
     * Sets the connection timeout. `false` to disable
     *
     * @return {Manager} self or value
     * @api public
     */

    Manager.prototype.timeout = function(v){
        if (!arguments.length) return this._timeout;
        this._timeout = v;
        return this;
    };

    /**
     * Starts trying to reconnect if reconnection is enabled and we have not
     * started reconnecting yet
     *
     * @api private
     */

    Manager.prototype.maybeReconnectOnOpen = function() {
        // Only try to reconnect if it's the first time we're connecting
        if (!this.reconnecting && this._reconnection && this.backoff.attempts === 0) {
            // keeps reconnection from firing twice for the same reconnection loop
            this.reconnect();
        }
    };


    /**
     * Sets the current transport `socket`.
     *
     * @param {Function} optional, callback
     * @return {Manager} self
     * @api public
     */

    Manager.prototype.open =
        Manager.prototype.connect = function(fn){
            debug('readyState %s', this.readyState);
            if (~this.readyState.indexOf('open')) return this;

            debug('opening %s', this.uri);
            this.engine = eio(this.uri, this.opts);
            var socket = this.engine;
            var self = this;
            this.readyState = 'opening';
            this.skipReconnect = false;

            // emit `open`
            var openSub = on(socket, 'open', function() {
                self.onopen();
                fn && fn();
            });

            // emit `connect_error`
            var errorSub = on(socket, 'error', function(data){
                debug('connect_error');
                self.cleanup();
                self.readyState = 'closed';
                self.emitAll('connect_error', data);
                if (fn) {
                    var err = new Error('Connection error');
                    err.data = data;
                    fn(err);
                } else {
                    // Only do this if there is no fn to handle the error
                    self.maybeReconnectOnOpen();
                }
            });

            // emit `connect_timeout`
            if (false !== this._timeout) {
                var timeout = this._timeout;
                debug('connect attempt will timeout after %d', timeout);

                // set timer
                var timer = setTimeout(function(){
                    debug('connect attempt timed out after %d', timeout);
                    openSub.destroy();
                    socket.close();
                    socket.emit('error', 'timeout');
                    self.emitAll('connect_timeout', timeout);
                }, timeout);

                this.subs.push({
                    destroy: function(){
                        clearTimeout(timer);
                    }
                });
            }

            this.subs.push(openSub);
            this.subs.push(errorSub);

            return this;
        };

    /**
     * Called upon transport open.
     *
     * @api private
     */

    Manager.prototype.onopen = function(){
        debug('open');

        // clear old subs
        this.cleanup();

        // mark as open
        this.readyState = 'open';
        this.emit('open');

        // add new subs
        var socket = this.engine;
        this.subs.push(on(socket, 'data', bind(this, 'ondata')));
        this.subs.push(on(this.decoder, 'decoded', bind(this, 'ondecoded')));
        this.subs.push(on(socket, 'error', bind(this, 'onerror')));
        this.subs.push(on(socket, 'close', bind(this, 'onclose')));
    };

    /**
     * Called with data.
     *
     * @api private
     */

    Manager.prototype.ondata = function(data){
        this.decoder.add(data);
    };

    /**
     * Called when parser fully decodes a packet.
     *
     * @api private
     */

    Manager.prototype.ondecoded = function(packet) {
        this.emit('packet', packet);
    };

    /**
     * Called upon socket error.
     *
     * @api private
     */

    Manager.prototype.onerror = function(err){
        debug('error', err);
        this.emitAll('error', err);
    };

    /**
     * Creates a new socket for the given `nsp`.
     *
     * @return {Socket}
     * @api public
     */

    Manager.prototype.socket = function(nsp){
        var socket = this.nsps[nsp];
        if (!socket) {
            socket = new Socket(this, nsp);
            this.nsps[nsp] = socket;
            var self = this;
            socket.on('connect', function(){
                socket.id = self.engine.id;
                if (!~indexOf(self.connected, socket)) {
                    self.connected.push(socket);
                }
            });
        }
        return socket;
    };

    /**
     * Called upon a socket close.
     *
     * @param {Socket} socket
     */

    Manager.prototype.destroy = function(socket){
        var index = indexOf(this.connected, socket);
        if (~index) this.connected.splice(index, 1);
        if (this.connected.length) return;

        this.close();
    };

    /**
     * Writes a packet.
     *
     * @param {Object} packet
     * @api private
     */

    Manager.prototype.packet = function(packet){
        debug('writing packet %j', packet);
        var self = this;

        if (!self.encoding) {
            // encode, then write to engine with result
            self.encoding = true;
            this.encoder.encode(packet, function(encodedPackets) {
                for (var i = 0; i < encodedPackets.length; i++) {
                    self.engine.write(encodedPackets[i]);
                }
                self.encoding = false;
                self.processPacketQueue();
            });
        } else { // add packet to the queue
            self.packetBuffer.push(packet);
        }
    };

    /**
     * If packet buffer is non-empty, begins encoding the
     * next packet in line.
     *
     * @api private
     */

    Manager.prototype.processPacketQueue = function() {
        if (this.packetBuffer.length > 0 && !this.encoding) {
            var pack = this.packetBuffer.shift();
            this.packet(pack);
        }
    };

    /**
     * Clean up transport subscriptions and packet buffer.
     *
     * @api private
     */

    Manager.prototype.cleanup = function(){
        var sub;
        while (sub = this.subs.shift()) sub.destroy();

        this.packetBuffer = [];
        this.encoding = false;

        this.decoder.destroy();
    };

    /**
     * Close the current socket.
     *
     * @api private
     */

    Manager.prototype.close =
        Manager.prototype.disconnect = function(){
            this.skipReconnect = true;
            this.backoff.reset();
            this.readyState = 'closed';
            this.engine && this.engine.close();
        };

    /**
     * Called upon engine close.
     *
     * @api private
     */

    Manager.prototype.onclose = function(reason){
        debug('close');
        this.cleanup();
        this.backoff.reset();
        this.readyState = 'closed';
        this.emit('close', reason);
        if (this._reconnection && !this.skipReconnect) {
            this.reconnect();
        }
    };

    /**
     * Attempt a reconnection.
     *
     * @api private
     */

    Manager.prototype.reconnect = function(){
        if (this.reconnecting || this.skipReconnect) return this;

        var self = this;

        if (this.backoff.attempts >= this._reconnectionAttempts) {
            debug('reconnect failed');
            this.backoff.reset();
            this.emitAll('reconnect_failed');
            this.reconnecting = false;
        } else {
            var delay = this.backoff.duration();
            debug('will wait %dms before reconnect attempt', delay);

            this.reconnecting = true;
            var timer = setTimeout(function(){
                if (self.skipReconnect) return;

                debug('attempting reconnect');
                self.emitAll('reconnect_attempt', self.backoff.attempts);
                self.emitAll('reconnecting', self.backoff.attempts);

                // check again for the case socket closed in above events
                if (self.skipReconnect) return;

                self.open(function(err){
                    if (err) {
                        debug('reconnect attempt error');
                        self.reconnecting = false;
                        self.reconnect();
                        self.emitAll('reconnect_error', err.data);
                    } else {
                        debug('reconnect success');
                        self.onreconnect();
                    }
                });
            }, delay);

            this.subs.push({
                destroy: function(){
                    clearTimeout(timer);
                }
            });
        }
    };

    /**
     * Called upon successful reconnect.
     *
     * @api private
     */

    Manager.prototype.onreconnect = function(){
        var attempt = this.backoff.attempts;
        this.reconnecting = false;
        this.backoff.reset();
        this.updateSocketIds();
        this.emitAll('reconnect', attempt);
    };

},{"./on":4,"./socket":5,"./url":6,"backo2":7,"component-bind":8,"component-emitter":9,"debug":10,"engine.io-client":11,"indexof":42,"object-component":43,"socket.io-parser":46}],4:[function(_dereq_,module,exports){

    /**
     * Module exports.
     */

    module.exports = on;

    /**
     * Helper for subscriptions.
     *
     * @param {Object|EventEmitter} obj with `Emitter` mixin or `EventEmitter`
     * @param {String} event name
     * @param {Function} callback
     * @api public
     */

    function on(obj, ev, fn) {
        obj.on(ev, fn);
        return {
            destroy: function(){
                obj.removeListener(ev, fn);
            }
        };
    }

},{}],5:[function(_dereq_,module,exports){

    /**
     * Module dependencies.
     */

    var parser = _dereq_('socket.io-parser');
    var Emitter = _dereq_('component-emitter');
    var toArray = _dereq_('to-array');
    var on = _dereq_('./on');
    var bind = _dereq_('component-bind');
    var debug = _dereq_('debug')('socket.io-client:socket');
    var hasBin = _dereq_('has-binary');

    /**
     * Module exports.
     */

    module.exports = exports = Socket;

    /**
     * Internal events (blacklisted).
     * These events can't be emitted by the user.
     *
     * @api private
     */

    var events = {
        connect: 1,
        connect_error: 1,
        connect_timeout: 1,
        disconnect: 1,
        error: 1,
        reconnect: 1,
        reconnect_attempt: 1,
        reconnect_failed: 1,
        reconnect_error: 1,
        reconnecting: 1
    };

    /**
     * Shortcut to `Emitter#emit`.
     */

    var emit = Emitter.prototype.emit;

    /**
     * `Socket` constructor.
     *
     * @api public
     */

    function Socket(io, nsp){
        this.io = io;
        this.nsp = nsp;
        this.json = this; // compat
        this.ids = 0;
        this.acks = {};
        if (this.io.autoConnect) this.open();
        this.receiveBuffer = [];
        this.sendBuffer = [];
        this.connected = false;
        this.disconnected = true;
    }

    /**
     * Mix in `Emitter`.
     */

    Emitter(Socket.prototype);

    /**
     * Subscribe to open, close and packet events
     *
     * @api private
     */

    Socket.prototype.subEvents = function() {
        if (this.subs) return;

        var io = this.io;
        this.subs = [
            on(io, 'open', bind(this, 'onopen')),
            on(io, 'packet', bind(this, 'onpacket')),
            on(io, 'close', bind(this, 'onclose'))
        ];
    };

    /**
     * "Opens" the socket.
     *
     * @api public
     */

    Socket.prototype.open =
        Socket.prototype.connect = function(){
            if (this.connected) return this;

            this.subEvents();
            this.io.open(); // ensure open
            if ('open' == this.io.readyState) this.onopen();
            return this;
        };

    /**
     * Sends a `message` event.
     *
     * @return {Socket} self
     * @api public
     */

    Socket.prototype.send = function(){
        var args = toArray(arguments);
        args.unshift('message');
        this.emit.apply(this, args);
        return this;
    };

    /**
     * Override `emit`.
     * If the event is in `events`, it's emitted normally.
     *
     * @param {String} event name
     * @return {Socket} self
     * @api public
     */

    Socket.prototype.emit = function(ev){
        if (events.hasOwnProperty(ev)) {
            emit.apply(this, arguments);
            return this;
        }

        var args = toArray(arguments);
        var parserType = parser.EVENT; // default
        if (hasBin(args)) { parserType = parser.BINARY_EVENT; } // binary
        var packet = { type: parserType, data: args };

        // event ack callback
        if ('function' == typeof args[args.length - 1]) {
            debug('emitting packet with ack id %d', this.ids);
            this.acks[this.ids] = args.pop();
            packet.id = this.ids++;
        }

        if (this.connected) {
            this.packet(packet);
        } else {
            this.sendBuffer.push(packet);
        }

        return this;
    };

    /**
     * Sends a packet.
     *
     * @param {Object} packet
     * @api private
     */

    Socket.prototype.packet = function(packet){
        packet.nsp = this.nsp;
        this.io.packet(packet);
    };

    /**
     * Called upon engine `open`.
     *
     * @api private
     */

    Socket.prototype.onopen = function(){
        debug('transport is open - connecting');

        // write connect packet if necessary
        if ('/' != this.nsp) {
            this.packet({ type: parser.CONNECT });
        }
    };

    /**
     * Called upon engine `close`.
     *
     * @param {String} reason
     * @api private
     */

    Socket.prototype.onclose = function(reason){
        debug('close (%s)', reason);
        this.connected = false;
        this.disconnected = true;
        delete this.id;
        this.emit('disconnect', reason);
    };

    /**
     * Called with socket packet.
     *
     * @param {Object} packet
     * @api private
     */

    Socket.prototype.onpacket = function(packet){
        if (packet.nsp != this.nsp) return;

        switch (packet.type) {
            case parser.CONNECT:
                this.onconnect();
                break;

            case parser.EVENT:
                this.onevent(packet);
                break;

            case parser.BINARY_EVENT:
                this.onevent(packet);
                break;

            case parser.ACK:
                this.onack(packet);
                break;

            case parser.BINARY_ACK:
                this.onack(packet);
                break;

            case parser.DISCONNECT:
                this.ondisconnect();
                break;

            case parser.ERROR:
                this.emit('error', packet.data);
                break;
        }
    };

    /**
     * Called upon a server event.
     *
     * @param {Object} packet
     * @api private
     */

    Socket.prototype.onevent = function(packet){
        var args = packet.data || [];
        debug('emitting event %j', args);

        if (null != packet.id) {
            debug('attaching ack callback to event');
            args.push(this.ack(packet.id));
        }

        if (this.connected) {
            emit.apply(this, args);
        } else {
            this.receiveBuffer.push(args);
        }
    };

    /**
     * Produces an ack callback to emit with an event.
     *
     * @api private
     */

    Socket.prototype.ack = function(id){
        var self = this;
        var sent = false;
        return function(){
            // prevent double callbacks
            if (sent) return;
            sent = true;
            var args = toArray(arguments);
            debug('sending ack %j', args);

            var type = hasBin(args) ? parser.BINARY_ACK : parser.ACK;
            self.packet({
                type: type,
                id: id,
                data: args
            });
        };
    };

    /**
     * Called upon a server acknowlegement.
     *
     * @param {Object} packet
     * @api private
     */

    Socket.prototype.onack = function(packet){
        debug('calling ack %s with %j', packet.id, packet.data);
        var fn = this.acks[packet.id];
        fn.apply(this, packet.data);
        delete this.acks[packet.id];
    };

    /**
     * Called upon server connect.
     *
     * @api private
     */

    Socket.prototype.onconnect = function(){
        this.connected = true;
        this.disconnected = false;
        this.emit('connect');
        this.emitBuffered();
    };

    /**
     * Emit buffered events (received and emitted).
     *
     * @api private
     */

    Socket.prototype.emitBuffered = function(){
        var i;
        for (i = 0; i < this.receiveBuffer.length; i++) {
            emit.apply(this, this.receiveBuffer[i]);
        }
        this.receiveBuffer = [];

        for (i = 0; i < this.sendBuffer.length; i++) {
            this.packet(this.sendBuffer[i]);
        }
        this.sendBuffer = [];
    };

    /**
     * Called upon server disconnect.
     *
     * @api private
     */

    Socket.prototype.ondisconnect = function(){
        debug('server disconnect (%s)', this.nsp);
        this.destroy();
        this.onclose('io server disconnect');
    };

    /**
     * Called upon forced client/server side disconnections,
     * this method ensures the manager stops tracking us and
     * that reconnections don't get triggered for this.
     *
     * @api private.
     */

    Socket.prototype.destroy = function(){
        if (this.subs) {
            // clean subscriptions to avoid reconnections
            for (var i = 0; i < this.subs.length; i++) {
                this.subs[i].destroy();
            }
            this.subs = null;
        }

        this.io.destroy(this);
    };

    /**
     * Disconnects the socket manually.
     *
     * @return {Socket} self
     * @api public
     */

    Socket.prototype.close =
        Socket.prototype.disconnect = function(){
            if (this.connected) {
                debug('performing disconnect (%s)', this.nsp);
                this.packet({ type: parser.DISCONNECT });
            }

            // remove socket from pool
            this.destroy();

            if (this.connected) {
                // fire events
                this.onclose('io client disconnect');
            }
            return this;
        };

},{"./on":4,"component-bind":8,"component-emitter":9,"debug":10,"has-binary":38,"socket.io-parser":46,"to-array":50}],6:[function(_dereq_,module,exports){
    (function (global){

        /**
         * Module dependencies.
         */

        var parseuri = _dereq_('parseuri');
        var debug = _dereq_('debug')('socket.io-client:url');

        /**
         * Module exports.
         */

        module.exports = url;

        /**
         * URL parser.
         *
         * @param {String} url
         * @param {Object} An object meant to mimic window.location.
         *                 Defaults to window.location.
         * @api public
         */

        function url(uri, loc){
            var obj = uri;

            // default to window.location
            var loc = loc || global.location;
            if (null == uri) uri = loc.protocol + '//' + loc.host;

            // relative path support
            if ('string' == typeof uri) {
                if ('/' == uri.charAt(0)) {
                    if ('/' == uri.charAt(1)) {
                        uri = loc.protocol + uri;
                    } else {
                        uri = loc.hostname + uri;
                    }
                }

                if (!/^(https?|wss?):\/\//.test(uri)) {
                    debug('protocol-less url %s', uri);
                    if ('undefined' != typeof loc) {
                        uri = loc.protocol + '//' + uri;
                    } else {
                        uri = 'https://' + uri;
                    }
                }

                // parse
                debug('parse %s', uri);
                obj = parseuri(uri);
            }

            // make sure we treat `localhost:80` and `localhost` equally
            if (!obj.port) {
                if (/^(http|ws)$/.test(obj.protocol)) {
                    obj.port = '80';
                }
                else if (/^(http|ws)s$/.test(obj.protocol)) {
                    obj.port = '443';
                }
            }

            obj.path = obj.path || '/';

            // define unique id
            obj.id = obj.protocol + '://' + obj.host + ':' + obj.port;
            // define href
            obj.href = obj.protocol + '://' + obj.host + (loc && loc.port == obj.port ? '' : (':' + obj.port));

            return obj;
        }

    }).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"debug":10,"parseuri":44}],7:[function(_dereq_,module,exports){

    /**
     * Expose `Backoff`.
     */

    module.exports = Backoff;

    /**
     * Initialize backoff timer with `opts`.
     *
     * - `min` initial timeout in milliseconds [100]
     * - `max` max timeout [10000]
     * - `jitter` [0]
     * - `factor` [2]
     *
     * @param {Object} opts
     * @api public
     */

    function Backoff(opts) {
        opts = opts || {};
        this.ms = opts.min || 100;
        this.max = opts.max || 10000;
        this.factor = opts.factor || 2;
        this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
        this.attempts = 0;
    }

    /**
     * Return the backoff duration.
     *
     * @return {Number}
     * @api public
     */

    Backoff.prototype.duration = function(){
        var ms = this.ms * Math.pow(this.factor, this.attempts++);
        if (this.jitter) {
            var rand =  Math.random();
            var deviation = Math.floor(rand * this.jitter * ms);
            ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
        }
        return Math.min(ms, this.max) | 0;
    };

    /**
     * Reset the number of attempts.
     *
     * @api public
     */

    Backoff.prototype.reset = function(){
        this.attempts = 0;
    };

    /**
     * Set the minimum duration
     *
     * @api public
     */

    Backoff.prototype.setMin = function(min){
        this.ms = min;
    };

    /**
     * Set the maximum duration
     *
     * @api public
     */

    Backoff.prototype.setMax = function(max){
        this.max = max;
    };

    /**
     * Set the jitter
     *
     * @api public
     */

    Backoff.prototype.setJitter = function(jitter){
        this.jitter = jitter;
    };


},{}],8:[function(_dereq_,module,exports){
    /**
     * Slice reference.
     */

    var slice = [].slice;

    /**
     * Bind `obj` to `fn`.
     *
     * @param {Object} obj
     * @param {Function|String} fn or string
     * @return {Function}
     * @api public
     */

    module.exports = function(obj, fn){
        if ('string' == typeof fn) fn = obj[fn];
        if ('function' != typeof fn) throw new Error('bind() requires a function');
        var args = slice.call(arguments, 2);
        return function(){
            return fn.apply(obj, args.concat(slice.call(arguments)));
        }
    };

},{}],9:[function(_dereq_,module,exports){

    /**
     * Expose `Emitter`.
     */

    module.exports = Emitter;

    /**
     * Initialize a new `Emitter`.
     *
     * @api public
     */

    function Emitter(obj) {
        if (obj) return mixin(obj);
    };

    /**
     * Mixin the emitter properties.
     *
     * @param {Object} obj
     * @return {Object}
     * @api private
     */

    function mixin(obj) {
        for (var key in Emitter.prototype) {
            obj[key] = Emitter.prototype[key];
        }
        return obj;
    }

    /**
     * Listen on the given `event` with `fn`.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.on =
        Emitter.prototype.addEventListener = function(event, fn){
            this._callbacks = this._callbacks || {};
            (this._callbacks[event] = this._callbacks[event] || [])
                .push(fn);
            return this;
        };

    /**
     * Adds an `event` listener that will be invoked a single
     * time then automatically removed.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.once = function(event, fn){
        var self = this;
        this._callbacks = this._callbacks || {};

        function on() {
            self.off(event, on);
            fn.apply(this, arguments);
        }

        on.fn = fn;
        this.on(event, on);
        return this;
    };

    /**
     * Remove the given callback for `event` or all
     * registered callbacks.
     *
     * @param {String} event
     * @param {Function} fn
     * @return {Emitter}
     * @api public
     */

    Emitter.prototype.off =
        Emitter.prototype.removeListener =
            Emitter.prototype.removeAllListeners =
                Emitter.prototype.removeEventListener = function(event, fn){
                    this._callbacks = this._callbacks || {};

                    // all
                    if (0 == arguments.length) {
                        this._callbacks = {};
                        return this;
                    }

                    // specific event
                    var callbacks = this._callbacks[event];
                    if (!callbacks) return this;

                    // remove all handlers
                    if (1 == arguments.length) {
                        delete this._callbacks[event];
                        return this;
                    }

                    // remove specific handler
                    var cb;
                    for (var i = 0; i < callbacks.length; i++) {
                        cb = callbacks[i];
                        if (cb === fn || cb.fn === fn) {
                            callbacks.splice(i, 1);
                            break;
                        }
                    }
                    return this;
                };

    /**
     * Emit `event` with the given args.
     *
     * @param {String} event
     * @param {Mixed} ...
     * @return {Emitter}
     */

    Emitter.prototype.emit = function(event){
        this._callbacks = this._callbacks || {};
        var args = [].slice.call(arguments, 1)
            , callbacks = this._callbacks[event];

        if (callbacks) {
            callbacks = callbacks.slice(0);
            for (var i = 0, len = callbacks.length; i < len; ++i) {
                callbacks[i].apply(this, args);
            }
        }

        return this;
    };

    /**
     * Return array of callbacks for `event`.
     *
     * @param {String} event
     * @return {Array}
     * @api public
     */

    Emitter.prototype.listeners = function(event){
        this._callbacks = this._callbacks || {};
        return this._callbacks[event] || [];
    };

    /**
     * Check if this emitter has `event` handlers.
     *
     * @param {String} event
     * @return {Boolean}
     * @api public
     */

    Emitter.prototype.hasListeners = function(event){
        return !! this.listeners(event).length;
    };

},{}],10:[function(_dereq_,module,exports){

    /**
     * Expose `debug()` as the module.
     */

    module.exports = debug;

    /**
     * Create a debugger with the given `name`.
     *
     * @param {String} name
     * @return {Type}
     * @api public
     */

    function debug(name) {
        if (!debug.enabled(name)) return function(){};

        return function(fmt){
            fmt = coerce(fmt);

            var curr = new Date;
            var ms = curr - (debug[name] || curr);
            debug[name] = curr;

            fmt = name
                + ' '
                + fmt
                + ' +' + debug.humanize(ms);

            // This hackery is required for IE8
            // where `console.log` doesn't have 'apply'
            window.console
            && console.log
            && Function.prototype.apply.call(console.log, console, arguments);
        }
    }

    /**
     * The currently active debug mode names.
     */

    debug.names = [];
    debug.skips = [];

    /**
     * Enables a debug mode by name. This can include modes
     * separated by a colon and wildcards.
     *
     * @param {String} name
     * @api public
     */

    debug.enable = function(name) {
        try {
            localStorage.debug = name;
        } catch(e){}

        var split = (name || '').split(/[\s,]+/)
            , len = split.length;

        for (var i = 0; i < len; i++) {
            name = split[i].replace('*', '.*?');
            if (name[0] === '-') {
                debug.skips.push(new RegExp('^' + name.substr(1) + '$'));
            }
            else {
                debug.names.push(new RegExp('^' + name + '$'));
            }
        }
    };

    /**
     * Disable debug output.
     *
     * @api public
     */

    debug.disable = function(){
        debug.enable('');
    };

    /**
     * Humanize the given `ms`.
     *
     * @param {Number} m
     * @return {String}
     * @api private
     */

    debug.humanize = function(ms) {
        var sec = 1000
            , min = 60 * 1000
            , hour = 60 * min;

        if (ms >= hour) return (ms / hour).toFixed(1) + 'h';
        if (ms >= min) return (ms / min).toFixed(1) + 'm';
        if (ms >= sec) return (ms / sec | 0) + 's';
        return ms + 'ms';
    };

    /**
     * Returns true if the given mode name is enabled, false otherwise.
     *
     * @param {String} name
     * @return {Boolean}
     * @api public
     */

    debug.enabled = function(name) {
        for (var i = 0, len = debug.skips.length; i < len; i++) {
            if (debug.skips[i].test(name)) {
                return false;
            }
        }
        for (var i = 0, len = debug.names.length; i < len; i++) {
            if (debug.names[i].test(name)) {
                return true;
            }
        }
        return false;
    };

    /**
     * Coerce `val`.
     */

    function coerce(val) {
        if (val instanceof Error) return val.stack || val.message;
        return val;
    }

// persist

    try {
        if (window.localStorage) debug.enable(localStorage.debug);
    } catch(e){}

},{}],11:[function(_dereq_,module,exports){

    module.exports =  _dereq_('./lib/');

},{"./lib/":12}],12:[function(_dereq_,module,exports){

    module.exports = _dereq_('./socket');

    /**
     * Exports parser
     *
     * @api public
     *
     */
    module.exports.parser = _dereq_('engine.io-parser');

},{"./socket":13,"engine.io-parser":25}],13:[function(_dereq_,module,exports){
    (function (global){
        /**
         * Module dependencies.
         */

        var transports = _dereq_('./transports');
        var Emitter = _dereq_('component-emitter');
        var debug = _dereq_('debug')('engine.io-client:socket');
        var index = _dereq_('indexof');
        var parser = _dereq_('engine.io-parser');
        var parseuri = _dereq_('parseuri');
        var parsejson = _dereq_('parsejson');
        var parseqs = _dereq_('parseqs');

        /**
         * Module exports.
         */

        module.exports = Socket;

        /**
         * Noop function.
         *
         * @api private
         */

        function noop(){}

        /**
         * Socket constructor.
         *
         * @param {String|Object} uri or options
         * @param {Object} options
         * @api public
         */

        function Socket(uri, opts){
            if (!(this instanceof Socket)) return new Socket(uri, opts);

            opts = opts || {};

            if (uri && 'object' == typeof uri) {
                opts = uri;
                uri = null;
            }

            if (uri) {
                uri = parseuri(uri);
                opts.host = uri.host;
                opts.secure = uri.protocol == 'https' || uri.protocol == 'wss';
                opts.port = uri.port;
                if (uri.query) opts.query = uri.query;
            }

            this.secure = null != opts.secure ? opts.secure :
                (global.location && 'https:' == location.protocol);

            if (opts.host) {
                var pieces = opts.host.split(':');
                opts.hostname = pieces.shift();
                if (pieces.length) {
                    opts.port = pieces.pop();
                } else if (!opts.port) {
                    // if no port is specified manually, use the protocol default
                    opts.port = this.secure ? '443' : '80';
                }
            }

            this.agent = opts.agent || false;
            this.hostname = opts.hostname ||
                (global.location ? location.hostname : 'localhost');
            this.port = opts.port || (global.location && location.port ?
                location.port :
                (this.secure ? 443 : 80));
            this.query = opts.query || {};
            if ('string' == typeof this.query) this.query = parseqs.decode(this.query);
            this.upgrade = false !== opts.upgrade;
            this.path = (opts.path || '/engine.io').replace(/\/$/, '') + '/';
            this.forceJSONP = !!opts.forceJSONP;
            this.jsonp = false !== opts.jsonp;
            this.forceBase64 = !!opts.forceBase64;
            this.enablesXDR = !!opts.enablesXDR;
            this.timestampParam = opts.timestampParam || 't';
            this.timestampRequests = opts.timestampRequests;
            this.transports = opts.transports || ['polling', 'websocket'];
            this.readyState = '';
            this.writeBuffer = [];
            this.callbackBuffer = [];
            this.policyPort = opts.policyPort || 843;
            this.rememberUpgrade = opts.rememberUpgrade || false;
            this.binaryType = null;
            this.onlyBinaryUpgrades = opts.onlyBinaryUpgrades;

            // SSL options for Node.js client
            this.pfx = opts.pfx || null;
            this.key = opts.key || null;
            this.passphrase = opts.passphrase || null;
            this.cert = opts.cert || null;
            this.ca = opts.ca || null;
            this.ciphers = opts.ciphers || null;
            this.rejectUnauthorized = opts.rejectUnauthorized || null;

            this.open();
        }

        Socket.priorWebsocketSuccess = false;

        /**
         * Mix in `Emitter`.
         */

        Emitter(Socket.prototype);

        /**
         * Protocol version.
         *
         * @api public
         */

        Socket.protocol = parser.protocol; // this is an int

        /**
         * Expose deps for legacy compatibility
         * and standalone browser access.
         */

        Socket.Socket = Socket;
        Socket.Transport = _dereq_('./transport');
        Socket.transports = _dereq_('./transports');
        Socket.parser = _dereq_('engine.io-parser');

        /**
         * Creates transport of the given type.
         *
         * @param {String} transport name
         * @return {Transport}
         * @api private
         */

        Socket.prototype.createTransport = function (name) {
            debug('creating transport "%s"', name);
            var query = clone(this.query);

            // append engine.io protocol identifier
            query.EIO = parser.protocol;

            // transport name
            query.transport = name;

            // session id if we already have one
            if (this.id) query.sid = this.id;

            var transport = new transports[name]({
                agent: this.agent,
                hostname: this.hostname,
                port: this.port,
                secure: this.secure,
                path: this.path,
                query: query,
                forceJSONP: this.forceJSONP,
                jsonp: this.jsonp,
                forceBase64: this.forceBase64,
                enablesXDR: this.enablesXDR,
                timestampRequests: this.timestampRequests,
                timestampParam: this.timestampParam,
                policyPort: this.policyPort,
                socket: this,
                pfx: this.pfx,
                key: this.key,
                passphrase: this.passphrase,
                cert: this.cert,
                ca: this.ca,
                ciphers: this.ciphers,
                rejectUnauthorized: this.rejectUnauthorized
            });

            return transport;
        };

        function clone (obj) {
            var o = {};
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    o[i] = obj[i];
                }
            }
            return o;
        }

        /**
         * Initializes transport to use and starts probe.
         *
         * @api private
         */
        Socket.prototype.open = function () {
            var transport;
            if (this.rememberUpgrade && Socket.priorWebsocketSuccess && this.transports.indexOf('websocket') != -1) {
                transport = 'websocket';
            } else if (0 == this.transports.length) {
                // Emit error on next tick so it can be listened to
                var self = this;
                setTimeout(function() {
                    self.emit('error', 'No transports available');
                }, 0);
                return;
            } else {
                transport = this.transports[0];
            }
            this.readyState = 'opening';

            // Retry with the next transport if the transport is disabled (jsonp: false)
            var transport;
            try {
                transport = this.createTransport(transport);
            } catch (e) {
                this.transports.shift();
                this.open();
                return;
            }

            transport.open();
            this.setTransport(transport);
        };

        /**
         * Sets the current transport. Disables the existing one (if any).
         *
         * @api private
         */

        Socket.prototype.setTransport = function(transport){
            debug('setting transport %s', transport.name);
            var self = this;

            if (this.transport) {
                debug('clearing existing transport %s', this.transport.name);
                this.transport.removeAllListeners();
            }

            // set up transport
            this.transport = transport;

            // set up transport listeners
            transport
                .on('drain', function(){
                    self.onDrain();
                })
                .on('packet', function(packet){
                    self.onPacket(packet);
                })
                .on('error', function(e){
                    self.onError(e);
                })
                .on('close', function(){
                    self.onClose('transport close');
                });
        };

        /**
         * Probes a transport.
         *
         * @param {String} transport name
         * @api private
         */

        Socket.prototype.probe = function (name) {
            debug('probing transport "%s"', name);
            var transport = this.createTransport(name, { probe: 1 })
                , failed = false
                , self = this;

            Socket.priorWebsocketSuccess = false;

            function onTransportOpen(){
                if (self.onlyBinaryUpgrades) {
                    var upgradeLosesBinary = !this.supportsBinary && self.transport.supportsBinary;
                    failed = failed || upgradeLosesBinary;
                }
                if (failed) return;

                debug('probe transport "%s" opened', name);
                transport.send([{ type: 'ping', data: 'probe' }]);
                transport.once('packet', function (msg) {
                    if (failed) return;
                    if ('pong' == msg.type && 'probe' == msg.data) {
                        debug('probe transport "%s" pong', name);
                        self.upgrading = true;
                        self.emit('upgrading', transport);
                        if (!transport) return;
                        Socket.priorWebsocketSuccess = 'websocket' == transport.name;

                        debug('pausing current transport "%s"', self.transport.name);
                        self.transport.pause(function () {
                            if (failed) return;
                            if ('closed' == self.readyState) return;
                            debug('changing transport and sending upgrade packet');

                            cleanup();

                            self.setTransport(transport);
                            transport.send([{ type: 'upgrade' }]);
                            self.emit('upgrade', transport);
                            transport = null;
                            self.upgrading = false;
                            self.flush();
                        });
                    } else {
                        debug('probe transport "%s" failed', name);
                        var err = new Error('probe error');
                        err.transport = transport.name;
                        self.emit('upgradeError', err);
                    }
                });
            }

            function freezeTransport() {
                if (failed) return;

                // Any callback called by transport should be ignored since now
                failed = true;

                cleanup();

                transport.close();
                transport = null;
            }

            //Handle any error that happens while probing
            function onerror(err) {
                var error = new Error('probe error: ' + err);
                error.transport = transport.name;

                freezeTransport();

                debug('probe transport "%s" failed because of error: %s', name, err);

                self.emit('upgradeError', error);
            }

            function onTransportClose(){
                onerror("transport closed");
            }

            //When the socket is closed while we're probing
            function onclose(){
                onerror("socket closed");
            }

            //When the socket is upgraded while we're probing
            function onupgrade(to){
                if (transport && to.name != transport.name) {
                    debug('"%s" works - aborting "%s"', to.name, transport.name);
                    freezeTransport();
                }
            }

            //Remove all listeners on the transport and on self
            function cleanup(){
                transport.removeListener('open', onTransportOpen);
                transport.removeListener('error', onerror);
                transport.removeListener('close', onTransportClose);
                self.removeListener('close', onclose);
                self.removeListener('upgrading', onupgrade);
            }

            transport.once('open', onTransportOpen);
            transport.once('error', onerror);
            transport.once('close', onTransportClose);

            this.once('close', onclose);
            this.once('upgrading', onupgrade);

            transport.open();

        };

        /**
         * Called when connection is deemed open.
         *
         * @api public
         */

        Socket.prototype.onOpen = function () {
            debug('socket open');
            this.readyState = 'open';
            Socket.priorWebsocketSuccess = 'websocket' == this.transport.name;
            this.emit('open');
            this.flush();

            // we check for `readyState` in case an `open`
            // listener already closed the socket
            if ('open' == this.readyState && this.upgrade && this.transport.pause) {
                debug('starting upgrade probes');
                for (var i = 0, l = this.upgrades.length; i < l; i++) {
                    this.probe(this.upgrades[i]);
                }
            }
        };

        /**
         * Handles a packet.
         *
         * @api private
         */

        Socket.prototype.onPacket = function (packet) {
            if ('opening' == this.readyState || 'open' == this.readyState) {
                debug('socket receive: type "%s", data "%s"', packet.type, packet.data);

                this.emit('packet', packet);

                // Socket is live - any packet counts
                this.emit('heartbeat');

                switch (packet.type) {
                    case 'open':
                        this.onHandshake(parsejson(packet.data));
                        break;

                    case 'pong':
                        this.setPing();
                        break;

                    case 'error':
                        var err = new Error('server error');
                        err.code = packet.data;
                        this.emit('error', err);
                        break;

                    case 'message':
                        this.emit('data', packet.data);
                        this.emit('message', packet.data);
                        break;
                }
            } else {
                debug('packet received with socket readyState "%s"', this.readyState);
            }
        };

        /**
         * Called upon handshake completion.
         *
         * @param {Object} handshake obj
         * @api private
         */

        Socket.prototype.onHandshake = function (data) {
            this.emit('handshake', data);
            this.id = data.sid;
            this.transport.query.sid = data.sid;
            this.upgrades = this.filterUpgrades(data.upgrades);
            this.pingInterval = data.pingInterval;
            this.pingTimeout = data.pingTimeout;
            this.onOpen();
            // In case open handler closes socket
            if  ('closed' == this.readyState) return;
            this.setPing();

            // Prolong liveness of socket on heartbeat
            this.removeListener('heartbeat', this.onHeartbeat);
            this.on('heartbeat', this.onHeartbeat);
        };

        /**
         * Resets ping timeout.
         *
         * @api private
         */

        Socket.prototype.onHeartbeat = function (timeout) {
            clearTimeout(this.pingTimeoutTimer);
            var self = this;
            self.pingTimeoutTimer = setTimeout(function () {
                if ('closed' == self.readyState) return;
                self.onClose('ping timeout');
            }, timeout || (self.pingInterval + self.pingTimeout));
        };

        /**
         * Pings server every `this.pingInterval` and expects response
         * within `this.pingTimeout` or closes connection.
         *
         * @api private
         */

        Socket.prototype.setPing = function () {
            var self = this;
            clearTimeout(self.pingIntervalTimer);
            self.pingIntervalTimer = setTimeout(function () {
                debug('writing ping packet - expecting pong within %sms', self.pingTimeout);
                self.ping();
                self.onHeartbeat(self.pingTimeout);
            }, self.pingInterval);
        };

        /**
         * Sends a ping packet.
         *
         * @api public
         */

        Socket.prototype.ping = function () {
            this.sendPacket('ping');
        };

        /**
         * Called on `drain` event
         *
         * @api private
         */

        Socket.prototype.onDrain = function() {
            for (var i = 0; i < this.prevBufferLen; i++) {
                if (this.callbackBuffer[i]) {
                    this.callbackBuffer[i]();
                }
            }

            this.writeBuffer.splice(0, this.prevBufferLen);
            this.callbackBuffer.splice(0, this.prevBufferLen);

            // setting prevBufferLen = 0 is very important
            // for example, when upgrading, upgrade packet is sent over,
            // and a nonzero prevBufferLen could cause problems on `drain`
            this.prevBufferLen = 0;

            if (this.writeBuffer.length == 0) {
                this.emit('drain');
            } else {
                this.flush();
            }
        };

        /**
         * Flush write buffers.
         *
         * @api private
         */

        Socket.prototype.flush = function () {
            if ('closed' != this.readyState && this.transport.writable &&
                !this.upgrading && this.writeBuffer.length) {
                debug('flushing %d packets in socket', this.writeBuffer.length);
                this.transport.send(this.writeBuffer);
                // keep track of current length of writeBuffer
                // splice writeBuffer and callbackBuffer on `drain`
                this.prevBufferLen = this.writeBuffer.length;
                this.emit('flush');
            }
        };

        /**
         * Sends a message.
         *
         * @param {String} message.
         * @param {Function} callback function.
         * @return {Socket} for chaining.
         * @api public
         */

        Socket.prototype.write =
            Socket.prototype.send = function (msg, fn) {
                this.sendPacket('message', msg, fn);
                return this;
            };

        /**
         * Sends a packet.
         *
         * @param {String} packet type.
         * @param {String} data.
         * @param {Function} callback function.
         * @api private
         */

        Socket.prototype.sendPacket = function (type, data, fn) {
            if ('closing' == this.readyState || 'closed' == this.readyState) {
                return;
            }

            var packet = { type: type, data: data };
            this.emit('packetCreate', packet);
            this.writeBuffer.push(packet);
            this.callbackBuffer.push(fn);
            this.flush();
        };

        /**
         * Closes the connection.
         *
         * @api private
         */

        Socket.prototype.close = function () {
            if ('opening' == this.readyState || 'open' == this.readyState) {
                this.readyState = 'closing';

                var self = this;

                function close() {
                    self.onClose('forced close');
                    debug('socket closing - telling transport to close');
                    self.transport.close();
                }

                function cleanupAndClose() {
                    self.removeListener('upgrade', cleanupAndClose);
                    self.removeListener('upgradeError', cleanupAndClose);
                    close();
                }

                function waitForUpgrade() {
                    // wait for upgrade to finish since we can't send packets while pausing a transport
                    self.once('upgrade', cleanupAndClose);
                    self.once('upgradeError', cleanupAndClose);
                }

                if (this.writeBuffer.length) {
                    this.once('drain', function() {
                        if (this.upgrading) {
                            waitForUpgrade();
                        } else {
                            close();
                        }
                    });
                } else if (this.upgrading) {
                    waitForUpgrade();
                } else {
                    close();
                }
            }

            return this;
        };

        /**
         * Called upon transport error
         *
         * @api private
         */

        Socket.prototype.onError = function (err) {
            debug('socket error %j', err);
            Socket.priorWebsocketSuccess = false;
            this.emit('error', err);
            this.onClose('transport error', err);
        };

        /**
         * Called upon transport close.
         *
         * @api private
         */

        Socket.prototype.onClose = function (reason, desc) {
            if ('opening' == this.readyState || 'open' == this.readyState || 'closing' == this.readyState) {
                debug('socket close with reason: "%s"', reason);
                var self = this;

                // clear timers
                clearTimeout(this.pingIntervalTimer);
                clearTimeout(this.pingTimeoutTimer);

                // clean buffers in next tick, so developers can still
                // grab the buffers on `close` event
                setTimeout(function() {
                    self.writeBuffer = [];
                    self.callbackBuffer = [];
                    self.prevBufferLen = 0;
                }, 0);

                // stop event from firing again for transport
                this.transport.removeAllListeners('close');

                // ensure transport won't stay open
                this.transport.close();

                // ignore further transport communication
                this.transport.removeAllListeners();

                // set ready state
                this.readyState = 'closed';

                // clear session id
                this.id = null;

                // emit close event
                this.emit('close', reason, desc);
            }
        };

        /**
         * Filters upgrades, returning only those matching client transports.
         *
         * @param {Array} server upgrades
         * @api private
         *
         */

        Socket.prototype.filterUpgrades = function (upgrades) {
            var filteredUpgrades = [];
            for (var i = 0, j = upgrades.length; i<j; i++) {
                if (~index(this.transports, upgrades[i])) filteredUpgrades.push(upgrades[i]);
            }
            return filteredUpgrades;
        };

    }).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./transport":14,"./transports":15,"component-emitter":9,"debug":22,"engine.io-parser":25,"indexof":42,"parsejson":34,"parseqs":35,"parseuri":36}],14:[function(_dereq_,module,exports){
    /**
     * Module dependencies.
     */

    var parser = _dereq_('engine.io-parser');
    var Emitter = _dereq_('component-emitter');

    /**
     * Module exports.
     */

    module.exports = Transport;

    /**
     * Transport abstract constructor.
     *
     * @param {Object} options.
     * @api private
     */

    function Transport (opts) {
        this.path = opts.path;
        this.hostname = opts.hostname;
        this.port = opts.port;
        this.secure = opts.secure;
        this.query = opts.query;
        this.timestampParam = opts.timestampParam;
        this.timestampRequests = opts.timestampRequests;
        this.readyState = '';
        this.agent = opts.agent || false;
        this.socket = opts.socket;
        this.enablesXDR = opts.enablesXDR;

        // SSL options for Node.js client
        this.pfx = opts.pfx;
        this.key = opts.key;
        this.passphrase = opts.passphrase;
        this.cert = opts.cert;
        this.ca = opts.ca;
        this.ciphers = opts.ciphers;
        this.rejectUnauthorized = opts.rejectUnauthorized;
    }

    /**
     * Mix in `Emitter`.
     */

    Emitter(Transport.prototype);

    /**
     * A counter used to prevent collisions in the timestamps used
     * for cache busting.
     */

    Transport.timestamps = 0;

    /**
     * Emits an error.
     *
     * @param {String} str
     * @return {Transport} for chaining
     * @api public
     */

    Transport.prototype.onError = function (msg, desc) {
        var err = new Error(msg);
        err.type = 'TransportError';
        err.description = desc;
        this.emit('error', err);
        return this;
    };

    /**
     * Opens the transport.
     *
     * @api public
     */

    Transport.prototype.open = function () {
        if ('closed' == this.readyState || '' == this.readyState) {
            this.readyState = 'opening';
            this.doOpen();
        }

        return this;
    };

    /**
     * Closes the transport.
     *
     * @api private
     */

    Transport.prototype.close = function () {
        if ('opening' == this.readyState || 'open' == this.readyState) {
            this.doClose();
            this.onClose();
        }

        return this;
    };

    /**
     * Sends multiple packets.
     *
     * @param {Array} packets
     * @api private
     */

    Transport.prototype.send = function(packets){
        if ('open' == this.readyState) {
            this.write(packets);
        } else {
            throw new Error('Transport not open');
        }
    };

    /**
     * Called upon open
     *
     * @api private
     */

    Transport.prototype.onOpen = function () {
        this.readyState = 'open';
        this.writable = true;
        this.emit('open');
    };

    /**
     * Called with data.
     *
     * @param {String} data
     * @api private
     */

    Transport.prototype.onData = function(data){
        var packet = parser.decodePacket(data, this.socket.binaryType);
        this.onPacket(packet);
    };

    /**
     * Called with a decoded packet.
     */

    Transport.prototype.onPacket = function (packet) {
        this.emit('packet', packet);
    };

    /**
     * Called upon close.
     *
     * @api private
     */

    Transport.prototype.onClose = function () {
        this.readyState = 'closed';
        this.emit('close');
    };

},{"component-emitter":9,"engine.io-parser":25}],15:[function(_dereq_,module,exports){
    (function (global){
        /**
         * Module dependencies
         */

        var XMLHttpRequest = _dereq_('xmlhttprequest');
        var XHR = _dereq_('./polling-xhr');
        var JSONP = _dereq_('./polling-jsonp');
        var websocket = _dereq_('./websocket');

        /**
         * Export transports.
         */

        exports.polling = polling;
        exports.websocket = websocket;

        /**
         * Polling transport polymorphic constructor.
         * Decides on xhr vs jsonp based on feature detection.
         *
         * @api private
         */

        function polling(opts){
            var xhr;
            var xd = false;
            var xs = false;
            var jsonp = false !== opts.jsonp;

            if (global.location) {
                var isSSL = 'https:' == location.protocol;
                var port = location.port;

                // some user agents have empty `location.port`
                if (!port) {
                    port = isSSL ? 443 : 80;
                }

                xd = opts.hostname != location.hostname || port != opts.port;
                xs = opts.secure != isSSL;
            }

            opts.xdomain = xd;
            opts.xscheme = xs;
            xhr = new XMLHttpRequest(opts);

            if ('open' in xhr && !opts.forceJSONP) {
                return new XHR(opts);
            } else {
                if (!jsonp) throw new Error('JSONP disabled');
                return new JSONP(opts);
            }
        }

    }).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./polling-jsonp":16,"./polling-xhr":17,"./websocket":19,"xmlhttprequest":20}],16:[function(_dereq_,module,exports){
    (function (global){

        /**
         * Module requirements.
         */

        var Polling = _dereq_('./polling');
        var inherit = _dereq_('component-inherit');

        /**
         * Module exports.
         */

        module.exports = JSONPPolling;

        /**
         * Cached regular expressions.
         */

        var rNewline = /\n/g;
        var rEscapedNewline = /\\n/g;

        /**
         * Global JSONP callbacks.
         */

        var callbacks;

        /**
         * Callbacks count.
         */

        var index = 0;

        /**
         * Noop.
         */

        function empty () { }

        /**
         * JSONP Polling constructor.
         *
         * @param {Object} opts.
         * @api public
         */

        function JSONPPolling (opts) {
            Polling.call(this, opts);

            this.query = this.query || {};

            // define global callbacks array if not present
            // we do this here (lazily) to avoid unneeded global pollution
            if (!callbacks) {
                // we need to consider multiple engines in the same page
                if (!global.___eio) global.___eio = [];
                callbacks = global.___eio;
            }

            // callback identifier
            this.index = callbacks.length;

            // add callback to jsonp global
            var self = this;
            callbacks.push(function (msg) {
                self.onData(msg);
            });

            // append to query string
            this.query.j = this.index;

            // prevent spurious errors from being emitted when the window is unloaded
            if (global.document && global.addEventListener) {
                global.addEventListener('beforeunload', function () {
                    if (self.script) self.script.onerror = empty;
                }, false);
            }
        }

        /**
         * Inherits from Polling.
         */

        inherit(JSONPPolling, Polling);

        /*
         * JSONP only supports binary as base64 encoded strings
         */

        JSONPPolling.prototype.supportsBinary = false;

        /**
         * Closes the socket.
         *
         * @api private
         */

        JSONPPolling.prototype.doClose = function () {
            if (this.script) {
                this.script.parentNode.removeChild(this.script);
                this.script = null;
            }

            if (this.form) {
                this.form.parentNode.removeChild(this.form);
                this.form = null;
                this.iframe = null;
            }

            Polling.prototype.doClose.call(this);
        };

        /**
         * Starts a poll cycle.
         *
         * @api private
         */

        JSONPPolling.prototype.doPoll = function () {
            var self = this;
            var script = document.createElement('script');

            if (this.script) {
                this.script.parentNode.removeChild(this.script);
                this.script = null;
            }

            script.async = true;
            script.src = this.uri();
            script.onerror = function(e){
                self.onError('jsonp poll error',e);
            };

            var insertAt = document.getElementsByTagName('script')[0];
            insertAt.parentNode.insertBefore(script, insertAt);
            this.script = script;

            var isUAgecko = 'undefined' != typeof navigator && /gecko/i.test(navigator.userAgent);

            if (isUAgecko) {
                setTimeout(function () {
                    var iframe = document.createElement('iframe');
                    document.body.appendChild(iframe);
                    document.body.removeChild(iframe);
                }, 100);
            }
        };

        /**
         * Writes with a hidden iframe.
         *
         * @param {String} data to send
         * @param {Function} called upon flush.
         * @api private
         */

        JSONPPolling.prototype.doWrite = function (data, fn) {
            var self = this;

            if (!this.form) {
                var form = document.createElement('form');
                var area = document.createElement('textarea');
                var id = this.iframeId = 'eio_iframe_' + this.index;
                var iframe;

                form.className = 'socketio';
                form.style.position = 'absolute';
                form.style.top = '-1000px';
                form.style.left = '-1000px';
                form.target = id;
                form.method = 'POST';
                form.setAttribute('accept-charset', 'utf-8');
                area.name = 'd';
                form.appendChild(area);
                document.body.appendChild(form);

                this.form = form;
                this.area = area;
            }

            this.form.action = this.uri();

            function complete () {
                initIframe();
                fn();
            }

            function initIframe () {
                if (self.iframe) {
                    try {
                        self.form.removeChild(self.iframe);
                    } catch (e) {
                        self.onError('jsonp polling iframe removal error', e);
                    }
                }

                try {
                    // ie6 dynamic iframes with target="" support (thanks Chris Lambacher)
                    var html = '<iframe src="javascript:0" name="'+ self.iframeId +'">';
                    iframe = document.createElement(html);
                } catch (e) {
                    iframe = document.createElement('iframe');
                    iframe.name = self.iframeId;
                    iframe.src = 'javascript:0';
                }

                iframe.id = self.iframeId;

                self.form.appendChild(iframe);
                self.iframe = iframe;
            }

            initIframe();

            // escape \n to prevent it from being converted into \r\n by some UAs
            // double escaping is required for escaped new lines because unescaping of new lines can be done safely on server-side
            data = data.replace(rEscapedNewline, '\\\n');
            this.area.value = data.replace(rNewline, '\\n');

            try {
                this.form.submit();
            } catch(e) {}

            if (this.iframe.attachEvent) {
                this.iframe.onreadystatechange = function(){
                    if (self.iframe.readyState == 'complete') {
                        complete();
                    }
                };
            } else {
                this.iframe.onload = complete;
            }
        };

    }).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./polling":18,"component-inherit":21}],17:[function(_dereq_,module,exports){
    (function (global){
        /**
         * Module requirements.
         */

        var XMLHttpRequest = _dereq_('xmlhttprequest');
        var Polling = _dereq_('./polling');
        var Emitter = _dereq_('component-emitter');
        var inherit = _dereq_('component-inherit');
        var debug = _dereq_('debug')('engine.io-client:polling-xhr');

        /**
         * Module exports.
         */

        module.exports = XHR;
        module.exports.Request = Request;

        /**
         * Empty function
         */

        function empty(){}

        /**
         * XHR Polling constructor.
         *
         * @param {Object} opts
         * @api public
         */

        function XHR(opts){
            Polling.call(this, opts);

            if (global.location) {
                var isSSL = 'https:' == location.protocol;
                var port = location.port;

                // some user agents have empty `location.port`
                if (!port) {
                    port = isSSL ? 443 : 80;
                }

                this.xd = opts.hostname != global.location.hostname ||
                    port != opts.port;
                this.xs = opts.secure != isSSL;
            }
        }

        /**
         * Inherits from Polling.
         */

        inherit(XHR, Polling);

        /**
         * XHR supports binary
         */

        XHR.prototype.supportsBinary = true;

        /**
         * Creates a request.
         *
         * @param {String} method
         * @api private
         */

        XHR.prototype.request = function(opts){
            opts = opts || {};
            opts.uri = this.uri();
            opts.xd = this.xd;
            opts.xs = this.xs;
            opts.agent = this.agent || false;
            opts.supportsBinary = this.supportsBinary;
            opts.enablesXDR = this.enablesXDR;

            // SSL options for Node.js client
            opts.pfx = this.pfx;
            opts.key = this.key;
            opts.passphrase = this.passphrase;
            opts.cert = this.cert;
            opts.ca = this.ca;
            opts.ciphers = this.ciphers;
            opts.rejectUnauthorized = this.rejectUnauthorized;

            return new Request(opts);
        };

        /**
         * Sends data.
         *
         * @param {String} data to send.
         * @param {Function} called upon flush.
         * @api private
         */

        XHR.prototype.doWrite = function(data, fn){
            var isBinary = typeof data !== 'string' && data !== undefined;
            var req = this.request({ method: 'POST', data: data, isBinary: isBinary });
            var self = this;
            req.on('success', fn);
            req.on('error', function(err){
                self.onError('xhr post error', err);
            });
            this.sendXhr = req;
        };

        /**
         * Starts a poll cycle.
         *
         * @api private
         */

        XHR.prototype.doPoll = function(){
            debug('xhr poll');
            var req = this.request();
            var self = this;
            req.on('data', function(data){
                self.onData(data);
            });
            req.on('error', function(err){
                self.onError('xhr poll error', err);
            });
            this.pollXhr = req;
        };

        /**
         * Request constructor
         *
         * @param {Object} options
         * @api public
         */

        function Request(opts){
            this.method = opts.method || 'GET';
            this.uri = opts.uri;
            this.xd = !!opts.xd;
            this.xs = !!opts.xs;
            this.async = false !== opts.async;
            this.data = undefined != opts.data ? opts.data : null;
            this.agent = opts.agent;
            this.isBinary = opts.isBinary;
            this.supportsBinary = opts.supportsBinary;
            this.enablesXDR = opts.enablesXDR;

            // SSL options for Node.js client
            this.pfx = opts.pfx;
            this.key = opts.key;
            this.passphrase = opts.passphrase;
            this.cert = opts.cert;
            this.ca = opts.ca;
            this.ciphers = opts.ciphers;
            this.rejectUnauthorized = opts.rejectUnauthorized;

            this.create();
        }

        /**
         * Mix in `Emitter`.
         */

        Emitter(Request.prototype);

        /**
         * Creates the XHR object and sends the request.
         *
         * @api private
         */

        Request.prototype.create = function(){
            var opts = { agent: this.agent, xdomain: this.xd, xscheme: this.xs, enablesXDR: this.enablesXDR };

            // SSL options for Node.js client
            opts.pfx = this.pfx;
            opts.key = this.key;
            opts.passphrase = this.passphrase;
            opts.cert = this.cert;
            opts.ca = this.ca;
            opts.ciphers = this.ciphers;
            opts.rejectUnauthorized = this.rejectUnauthorized;

            var xhr = this.xhr = new XMLHttpRequest(opts);
            var self = this;

            try {
                debug('xhr open %s: %s', this.method, this.uri);
                xhr.open(this.method, this.uri, this.async);
                if (this.supportsBinary) {
                    // This has to be done after open because Firefox is stupid
                    // http://stackoverflow.com/questions/13216903/get-binary-data-with-xmlhttprequest-in-a-firefox-extension
                    xhr.responseType = 'arraybuffer';
                }

                if ('POST' == this.method) {
                    try {
                        if (this.isBinary) {
                            xhr.setRequestHeader('Content-type', 'application/octet-stream');
                        } else {
                            xhr.setRequestHeader('Content-type', 'text/plain;charset=UTF-8');
                        }
                    } catch (e) {}
                }

                // ie6 check
                if ('withCredentials' in xhr) {
                    xhr.withCredentials = true;
                }

                if (this.hasXDR()) {
                    xhr.onload = function(){
                        self.onLoad();
                    };
                    xhr.onerror = function(){
                        self.onError(xhr.responseText);
                    };
                } else {
                    xhr.onreadystatechange = function(){
                        if (4 != xhr.readyState) return;
                        if (200 == xhr.status || 1223 == xhr.status) {
                            self.onLoad();
                        } else {
                            // make sure the `error` event handler that's user-set
                            // does not throw in the same tick and gets caught here
                            setTimeout(function(){
                                self.onError(xhr.status);
                            }, 0);
                        }
                    };
                }

                debug('xhr data %s', this.data);
                xhr.send(this.data);
            } catch (e) {
                // Need to defer since .create() is called directly fhrom the constructor
                // and thus the 'error' event can only be only bound *after* this exception
                // occurs.  Therefore, also, we cannot throw here at all.
                setTimeout(function() {
                    self.onError(e);
                }, 0);
                return;
            }

            if (global.document) {
                this.index = Request.requestsCount++;
                Request.requests[this.index] = this;
            }
        };

        /**
         * Called upon successful response.
         *
         * @api private
         */

        Request.prototype.onSuccess = function(){
            this.emit('success');
            this.cleanup();
        };

        /**
         * Called if we have data.
         *
         * @api private
         */

        Request.prototype.onData = function(data){
            this.emit('data', data);
            this.onSuccess();
        };

        /**
         * Called upon error.
         *
         * @api private
         */

        Request.prototype.onError = function(err){
            this.emit('error', err);
            this.cleanup(true);
        };

        /**
         * Cleans up house.
         *
         * @api private
         */

        Request.prototype.cleanup = function(fromError){
            if ('undefined' == typeof this.xhr || null === this.xhr) {
                return;
            }
            // xmlhttprequest
            if (this.hasXDR()) {
                this.xhr.onload = this.xhr.onerror = empty;
            } else {
                this.xhr.onreadystatechange = empty;
            }

            if (fromError) {
                try {
                    this.xhr.abort();
                } catch(e) {}
            }

            if (global.document) {
                delete Request.requests[this.index];
            }

            this.xhr = null;
        };

        /**
         * Called upon load.
         *
         * @api private
         */

        Request.prototype.onLoad = function(){
            var data;
            try {
                var contentType;
                try {
                    contentType = this.xhr.getResponseHeader('Content-Type').split(';')[0];
                } catch (e) {}
                if (contentType === 'application/octet-stream') {
                    data = this.xhr.response;
                } else {
                    if (!this.supportsBinary) {
                        data = this.xhr.responseText;
                    } else {
                        data = 'ok';
                    }
                }
            } catch (e) {
                this.onError(e);
            }
            if (null != data) {
                this.onData(data);
            }
        };

        /**
         * Check if it has XDomainRequest.
         *
         * @api private
         */

        Request.prototype.hasXDR = function(){
            return 'undefined' !== typeof global.XDomainRequest && !this.xs && this.enablesXDR;
        };

        /**
         * Aborts the request.
         *
         * @api public
         */

        Request.prototype.abort = function(){
            this.cleanup();
        };

        /**
         * Aborts pending requests when unloading the window. This is needed to prevent
         * memory leaks (e.g. when using IE) and to ensure that no spurious error is
         * emitted.
         */

        if (global.document) {
            Request.requestsCount = 0;
            Request.requests = {};
            if (global.attachEvent) {
                global.attachEvent('onunload', unloadHandler);
            } else if (global.addEventListener) {
                global.addEventListener('beforeunload', unloadHandler, false);
            }
        }

        function unloadHandler() {
            for (var i in Request.requests) {
                if (Request.requests.hasOwnProperty(i)) {
                    Request.requests[i].abort();
                }
            }
        }

    }).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./polling":18,"component-emitter":9,"component-inherit":21,"debug":22,"xmlhttprequest":20}],18:[function(_dereq_,module,exports){
    /**
     * Module dependencies.
     */

    var Transport = _dereq_('../transport');
    var parseqs = _dereq_('parseqs');
    var parser = _dereq_('engine.io-parser');
    var inherit = _dereq_('component-inherit');
    var debug = _dereq_('debug')('engine.io-client:polling');

    /**
     * Module exports.
     */

    module.exports = Polling;

    /**
     * Is XHR2 supported?
     */

    var hasXHR2 = (function() {
        var XMLHttpRequest = _dereq_('xmlhttprequest');
        var xhr = new XMLHttpRequest({ xdomain: false });
        return null != xhr.responseType;
    })();

    /**
     * Polling interface.
     *
     * @param {Object} opts
     * @api private
     */

    function Polling(opts){
        var forceBase64 = (opts && opts.forceBase64);
        if (!hasXHR2 || forceBase64) {
            this.supportsBinary = false;
        }
        Transport.call(this, opts);
    }

    /**
     * Inherits from Transport.
     */

    inherit(Polling, Transport);

    /**
     * Transport name.
     */

    Polling.prototype.name = 'polling';

    /**
     * Opens the socket (triggers polling). We write a PING message to determine
     * when the transport is open.
     *
     * @api private
     */

    Polling.prototype.doOpen = function(){
        this.poll();
    };

    /**
     * Pauses polling.
     *
     * @param {Function} callback upon buffers are flushed and transport is paused
     * @api private
     */

    Polling.prototype.pause = function(onPause){
        var pending = 0;
        var self = this;

        this.readyState = 'pausing';

        function pause(){
            debug('paused');
            self.readyState = 'paused';
            onPause();
        }

        if (this.polling || !this.writable) {
            var total = 0;

            if (this.polling) {
                debug('we are currently polling - waiting to pause');
                total++;
                this.once('pollComplete', function(){
                    debug('pre-pause polling complete');
                    --total || pause();
                });
            }

            if (!this.writable) {
                debug('we are currently writing - waiting to pause');
                total++;
                this.once('drain', function(){
                    debug('pre-pause writing complete');
                    --total || pause();
                });
            }
        } else {
            pause();
        }
    };

    /**
     * Starts polling cycle.
     *
     * @api public
     */

    Polling.prototype.poll = function(){
        debug('polling');
        this.polling = true;
        this.doPoll();
        this.emit('poll');
    };

    /**
     * Overloads onData to detect payloads.
     *
     * @api private
     */

    Polling.prototype.onData = function(data){
        var self = this;
        debug('polling got data %s', data);
        var callback = function(packet, index, total) {
            // if its the first message we consider the transport open
            if ('opening' == self.readyState) {
                self.onOpen();
            }

            // if its a close packet, we close the ongoing requests
            if ('close' == packet.type) {
                self.onClose();
                return false;
            }

            // otherwise bypass onData and handle the message
            self.onPacket(packet);
        };

        // decode payload
        parser.decodePayload(data, this.socket.binaryType, callback);

        // if an event did not trigger closing
        if ('closed' != this.readyState) {
            // if we got data we're not polling
            this.polling = false;
            this.emit('pollComplete');

            if ('open' == this.readyState) {
                this.poll();
            } else {
                debug('ignoring poll - transport state "%s"', this.readyState);
            }
        }
    };

    /**
     * For polling, send a close packet.
     *
     * @api private
     */

    Polling.prototype.doClose = function(){
        var self = this;

        function close(){
            debug('writing close packet');
            self.write([{ type: 'close' }]);
        }

        if ('open' == this.readyState) {
            debug('transport open - closing');
            close();
        } else {
            // in case we're trying to close while
            // handshaking is in progress (GH-164)
            debug('transport not open - deferring close');
            this.once('open', close);
        }
    };

    /**
     * Writes a packets payload.
     *
     * @param {Array} data packets
     * @param {Function} drain callback
     * @api private
     */

    Polling.prototype.write = function(packets){
        var self = this;
        this.writable = false;
        var callbackfn = function() {
            self.writable = true;
            self.emit('drain');
        };

        var self = this;
        parser.encodePayload(packets, this.supportsBinary, function(data) {
            self.doWrite(data, callbackfn);
        });
    };

    /**
     * Generates uri for connection.
     *
     * @api private
     */

    Polling.prototype.uri = function(){
        var query = this.query || {};
        var schema = this.secure ? 'https' : 'http';
        var port = '';

        // cache busting is forced
        if (false !== this.timestampRequests) {
            query[this.timestampParam] = +new Date + '-' + Transport.timestamps++;
        }

        if (!this.supportsBinary && !query.sid) {
            query.b64 = 1;
        }

        query = parseqs.encode(query);

        // avoid port if default for schema
        if (this.port && (('https' == schema && this.port != 443) ||
            ('http' == schema && this.port != 80))) {
            port = ':' + this.port;
        }

        // prepend ? to query
        if (query.length) {
            query = '?' + query;
        }

        return schema + '://' + this.hostname + port + this.path + query;
    };

},{"../transport":14,"component-inherit":21,"debug":22,"engine.io-parser":25,"parseqs":35,"xmlhttprequest":20}],19:[function(_dereq_,module,exports){
    /**
     * Module dependencies.
     */

    var Transport = _dereq_('../transport');
    var parser = _dereq_('engine.io-parser');
    var parseqs = _dereq_('parseqs');
    var inherit = _dereq_('component-inherit');
    var debug = _dereq_('debug')('engine.io-client:websocket');

    /**
     * `ws` exposes a WebSocket-compatible interface in
     * Node, or the `WebSocket` or `MozWebSocket` globals
     * in the browser.
     */

    var WebSocket = _dereq_('ws');

    /**
     * Module exports.
     */

    module.exports = WS;

    /**
     * WebSocket transport constructor.
     *
     * @api {Object} connection options
     * @api public
     */

    function WS(opts){
        var forceBase64 = (opts && opts.forceBase64);
        if (forceBase64) {
            this.supportsBinary = false;
        }
        Transport.call(this, opts);
    }

    /**
     * Inherits from Transport.
     */

    inherit(WS, Transport);

    /**
     * Transport name.
     *
     * @api public
     */

    WS.prototype.name = 'websocket';

    /*
     * WebSockets support binary
     */

    WS.prototype.supportsBinary = true;

    /**
     * Opens socket.
     *
     * @api private
     */

    WS.prototype.doOpen = function(){
        if (!this.check()) {
            // let probe timeout
            return;
        }

        var self = this;
        var uri = this.uri();
        var protocols = void(0);
        var opts = { agent: this.agent };

        // SSL options for Node.js client
        opts.pfx = this.pfx;
        opts.key = this.key;
        opts.passphrase = this.passphrase;
        opts.cert = this.cert;
        opts.ca = this.ca;
        opts.ciphers = this.ciphers;
        opts.rejectUnauthorized = this.rejectUnauthorized;

        this.ws = new WebSocket(uri, protocols, opts);

        if (this.ws.binaryType === undefined) {
            this.supportsBinary = false;
        }

        this.ws.binaryType = 'arraybuffer';
        this.addEventListeners();
    };

    /**
     * Adds event listeners to the socket
     *
     * @api private
     */

    WS.prototype.addEventListeners = function(){
        var self = this;

        this.ws.onopen = function(){
            self.onOpen();
        };
        this.ws.onclose = function(){
            self.onClose();
        };
        this.ws.onmessage = function(ev){
            self.onData(ev.data);
        };
        this.ws.onerror = function(e){
            self.onError('websocket error', e);
        };
    };

    /**
     * Override `onData` to use a timer on iOS.
     * See: https://gist.github.com/mloughran/2052006
     *
     * @api private
     */

    if ('undefined' != typeof navigator
        && /iPad|iPhone|iPod/i.test(navigator.userAgent)) {
        WS.prototype.onData = function(data){
            var self = this;
            setTimeout(function(){
                Transport.prototype.onData.call(self, data);
            }, 0);
        };
    }

    /**
     * Writes data to socket.
     *
     * @param {Array} array of packets.
     * @api private
     */

    WS.prototype.write = function(packets){
        var self = this;
        this.writable = false;
        // encodePacket efficient as it uses WS framing
        // no need for encodePayload
        for (var i = 0, l = packets.length; i < l; i++) {
            parser.encodePacket(packets[i], this.supportsBinary, function(data) {
                //Sometimes the websocket has already been closed but the browser didn't
                //have a chance of informing us about it yet, in that case send will
                //throw an error
                try {
                    self.ws.send(data);
                } catch (e){
                    debug('websocket closed before onclose event');
                }
            });
        }

        function ondrain() {
            self.writable = true;
            self.emit('drain');
        }
        // fake drain
        // defer to next tick to allow Socket to clear writeBuffer
        setTimeout(ondrain, 0);
    };

    /**
     * Called upon close
     *
     * @api private
     */

    WS.prototype.onClose = function(){
        Transport.prototype.onClose.call(this);
    };

    /**
     * Closes socket.
     *
     * @api private
     */

    WS.prototype.doClose = function(){
        if (typeof this.ws !== 'undefined') {
            this.ws.close();
        }
    };

    /**
     * Generates uri for connection.
     *
     * @api private
     */

    WS.prototype.uri = function(){
        var query = this.query || {};
        var schema = this.secure ? 'wss' : 'ws';
        var port = '';

        // avoid port if default for schema
        if (this.port && (('wss' == schema && this.port != 443)
            || ('ws' == schema && this.port != 80))) {
            port = ':' + this.port;
        }

        // append timestamp to URI
        if (this.timestampRequests) {
            query[this.timestampParam] = +new Date;
        }

        // communicate binary support capabilities
        if (!this.supportsBinary) {
            query.b64 = 1;
        }

        query = parseqs.encode(query);

        // prepend ? to query
        if (query.length) {
            query = '?' + query;
        }

        return schema + '://' + this.hostname + port + this.path + query;
    };

    /**
     * Feature detection for WebSocket.
     *
     * @return {Boolean} whether this transport is available.
     * @api public
     */

    WS.prototype.check = function(){
        return !!WebSocket && !('__initialize' in WebSocket && this.name === WS.prototype.name);
    };

},{"../transport":14,"component-inherit":21,"debug":22,"engine.io-parser":25,"parseqs":35,"ws":37}],20:[function(_dereq_,module,exports){
// browser shim for xmlhttprequest module
    var hasCORS = _dereq_('has-cors');

    module.exports = function(opts) {
        var xdomain = opts.xdomain;

        // scheme must be same when usign XDomainRequest
        // http://blogs.msdn.com/b/ieinternals/archive/2010/05/13/xdomainrequest-restrictions-limitations-and-workarounds.aspx
        var xscheme = opts.xscheme;

        // XDomainRequest has a flow of not sending cookie, therefore it should be disabled as a default.
        // https://github.com/Automattic/engine.io-client/pull/217
        var enablesXDR = opts.enablesXDR;

        // XMLHttpRequest can be disabled on IE
        try {
            if ('undefined' != typeof XMLHttpRequest && (!xdomain || hasCORS)) {
                return new XMLHttpRequest();
            }
        } catch (e) { }

        // Use XDomainRequest for IE8 if enablesXDR is true
        // because loading bar keeps flashing when using jsonp-polling
        // https://github.com/yujiosaka/socke.io-ie8-loading-example
        try {
            if ('undefined' != typeof XDomainRequest && !xscheme && enablesXDR) {
                return new XDomainRequest();
            }
        } catch (e) { }

        if (!xdomain) {
            try {
                return new ActiveXObject('Microsoft.XMLHTTP');
            } catch(e) { }
        }
    }

},{"has-cors":40}],21:[function(_dereq_,module,exports){

    module.exports = function(a, b){
        var fn = function(){};
        fn.prototype = b.prototype;
        a.prototype = new fn;
        a.prototype.constructor = a;
    };
},{}],22:[function(_dereq_,module,exports){

    /**
     * This is the web browser implementation of `debug()`.
     *
     * Expose `debug()` as the module.
     */

    exports = module.exports = _dereq_('./debug');
    exports.log = log;
    exports.formatArgs = formatArgs;
    exports.save = save;
    exports.load = load;
    exports.useColors = useColors;

    /**
     * Colors.
     */

    exports.colors = [
        'lightseagreen',
        'forestgreen',
        'goldenrod',
        'dodgerblue',
        'darkorchid',
        'crimson'
    ];

    /**
     * Currently only WebKit-based Web Inspectors, Firefox >= v31,
     * and the Firebug extension (any Firefox version) are known
     * to support "%c" CSS customizations.
     *
     * TODO: add a `localStorage` variable to explicitly enable/disable colors
     */

    function useColors() {
        // is webkit? http://stackoverflow.com/a/16459606/376773
        return ('WebkitAppearance' in document.documentElement.style) ||
            // is firebug? http://stackoverflow.com/a/398120/376773
            (window.console && (console.firebug || (console.exception && console.table))) ||
            // is firefox >= v31?
            // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
            (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
    }

    /**
     * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
     */

    exports.formatters.j = function(v) {
        return JSON.stringify(v);
    };


    /**
     * Colorize log arguments if enabled.
     *
     * @api public
     */

    function formatArgs() {
        var args = arguments;
        var useColors = this.useColors;

        args[0] = (useColors ? '%c' : '')
            + this.namespace
            + (useColors ? ' %c' : ' ')
            + args[0]
            + (useColors ? '%c ' : ' ')
            + '+' + exports.humanize(this.diff);

        if (!useColors) return args;

        var c = 'color: ' + this.color;
        args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

        // the final "%c" is somewhat tricky, because there could be other
        // arguments passed either before or after the %c, so we need to
        // figure out the correct index to insert the CSS into
        var index = 0;
        var lastC = 0;
        args[0].replace(/%[a-z%]/g, function(match) {
            if ('%' === match) return;
            index++;
            if ('%c' === match) {
                // we only are interested in the *last* %c
                // (the user may have provided their own)
                lastC = index;
            }
        });

        args.splice(lastC, 0, c);
        return args;
    }

    /**
     * Invokes `console.log()` when available.
     * No-op when `console.log` is not a "function".
     *
     * @api public
     */

    function log() {
        // This hackery is required for IE8,
        // where the `console.log` function doesn't have 'apply'
        return 'object' == typeof console
            && 'function' == typeof console.log
            && Function.prototype.apply.call(console.log, console, arguments);
    }

    /**
     * Save `namespaces`.
     *
     * @param {String} namespaces
     * @api private
     */

    function save(namespaces) {
        try {
            if (null == namespaces) {
                localStorage.removeItem('debug');
            } else {
                localStorage.debug = namespaces;
            }
        } catch(e) {}
    }

    /**
     * Load `namespaces`.
     *
     * @return {String} returns the previously persisted debug modes
     * @api private
     */

    function load() {
        var r;
        try {
            r = localStorage.debug;
        } catch(e) {}
        return r;
    }

    /**
     * Enable namespaces listed in `localStorage.debug` initially.
     */

    exports.enable(load());

},{"./debug":23}],23:[function(_dereq_,module,exports){

    /**
     * This is the common logic for both the Node.js and web browser
     * implementations of `debug()`.
     *
     * Expose `debug()` as the module.
     */

    exports = module.exports = debug;
    exports.coerce = coerce;
    exports.disable = disable;
    exports.enable = enable;
    exports.enabled = enabled;
    exports.humanize = _dereq_('ms');

    /**
     * The currently active debug mode names, and names to skip.
     */

    exports.names = [];
    exports.skips = [];

    /**
     * Map of special "%n" handling functions, for the debug "format" argument.
     *
     * Valid key names are a single, lowercased letter, i.e. "n".
     */

    exports.formatters = {};

    /**
     * Previously assigned color.
     */

    var prevColor = 0;

    /**
     * Previous log timestamp.
     */

    var prevTime;

    /**
     * Select a color.
     *
     * @return {Number}
     * @api private
     */

    function selectColor() {
        return exports.colors[prevColor++ % exports.colors.length];
    }

    /**
     * Create a debugger with the given `namespace`.
     *
     * @param {String} namespace
     * @return {Function}
     * @api public
     */

    function debug(namespace) {

        // define the `disabled` version
        function disabled() {
        }
        disabled.enabled = false;

        // define the `enabled` version
        function enabled() {

            var self = enabled;

            // set `diff` timestamp
            var curr = +new Date();
            var ms = curr - (prevTime || curr);
            self.diff = ms;
            self.prev = prevTime;
            self.curr = curr;
            prevTime = curr;

            // add the `color` if not set
            if (null == self.useColors) self.useColors = exports.useColors();
            if (null == self.color && self.useColors) self.color = selectColor();

            var args = Array.prototype.slice.call(arguments);

            args[0] = exports.coerce(args[0]);

            if ('string' !== typeof args[0]) {
                // anything else let's inspect with %o
                args = ['%o'].concat(args);
            }

            // apply any `formatters` transformations
            var index = 0;
            args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
                // if we encounter an escaped % then don't increase the array index
                if (match === '%') return match;
                index++;
                var formatter = exports.formatters[format];
                if ('function' === typeof formatter) {
                    var val = args[index];
                    match = formatter.call(self, val);

                    // now we need to remove `args[index]` since it's inlined in the `format`
                    args.splice(index, 1);
                    index--;
                }
                return match;
            });

            if ('function' === typeof exports.formatArgs) {
                args = exports.formatArgs.apply(self, args);
            }
            var logFn = enabled.log || exports.log || console.log.bind(console);
            logFn.apply(self, args);
        }
        enabled.enabled = true;

        var fn = exports.enabled(namespace) ? enabled : disabled;

        fn.namespace = namespace;

        return fn;
    }

    /**
     * Enables a debug mode by namespaces. This can include modes
     * separated by a colon and wildcards.
     *
     * @param {String} namespaces
     * @api public
     */

    function enable(namespaces) {
        exports.save(namespaces);

        var split = (namespaces || '').split(/[\s,]+/);
        var len = split.length;

        for (var i = 0; i < len; i++) {
            if (!split[i]) continue; // ignore empty strings
            namespaces = split[i].replace(/\*/g, '.*?');
            if (namespaces[0] === '-') {
                exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
            } else {
                exports.names.push(new RegExp('^' + namespaces + '$'));
            }
        }
    }

    /**
     * Disable debug output.
     *
     * @api public
     */

    function disable() {
        exports.enable('');
    }

    /**
     * Returns true if the given mode name is enabled, false otherwise.
     *
     * @param {String} name
     * @return {Boolean}
     * @api public
     */

    function enabled(name) {
        var i, len;
        for (i = 0, len = exports.skips.length; i < len; i++) {
            if (exports.skips[i].test(name)) {
                return false;
            }
        }
        for (i = 0, len = exports.names.length; i < len; i++) {
            if (exports.names[i].test(name)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Coerce `val`.
     *
     * @param {Mixed} val
     * @return {Mixed}
     * @api private
     */

    function coerce(val) {
        if (val instanceof Error) return val.stack || val.message;
        return val;
    }

},{"ms":24}],24:[function(_dereq_,module,exports){
    /**
     * Helpers.
     */

    var s = 1000;
    var m = s * 60;
    var h = m * 60;
    var d = h * 24;
    var y = d * 365.25;

    /**
     * Parse or format the given `val`.
     *
     * Options:
     *
     *  - `long` verbose formatting [false]
     *
     * @param {String|Number} val
     * @param {Object} options
     * @return {String|Number}
     * @api public
     */

    module.exports = function(val, options){
        options = options || {};
        if ('string' == typeof val) return parse(val);
        return options.long
            ? long(val)
            : short(val);
    };

    /**
     * Parse the given `str` and return milliseconds.
     *
     * @param {String} str
     * @return {Number}
     * @api private
     */

    function parse(str) {
        var match = /^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(str);
        if (!match) return;
        var n = parseFloat(match[1]);
        var type = (match[2] || 'ms').toLowerCase();
        switch (type) {
            case 'years':
            case 'year':
            case 'y':
                return n * y;
            case 'days':
            case 'day':
            case 'd':
                return n * d;
            case 'hours':
            case 'hour':
            case 'h':
                return n * h;
            case 'minutes':
            case 'minute':
            case 'm':
                return n * m;
            case 'seconds':
            case 'second':
            case 's':
                return n * s;
            case 'ms':
                return n;
        }
    }

    /**
     * Short format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */

    function short(ms) {
        if (ms >= d) return Math.round(ms / d) + 'd';
        if (ms >= h) return Math.round(ms / h) + 'h';
        if (ms >= m) return Math.round(ms / m) + 'm';
        if (ms >= s) return Math.round(ms / s) + 's';
        return ms + 'ms';
    }

    /**
     * Long format for `ms`.
     *
     * @param {Number} ms
     * @return {String}
     * @api private
     */

    function long(ms) {
        return plural(ms, d, 'day')
            || plural(ms, h, 'hour')
            || plural(ms, m, 'minute')
            || plural(ms, s, 'second')
            || ms + ' ms';
    }

    /**
     * Pluralization helper.
     */

    function plural(ms, n, name) {
        if (ms < n) return;
        if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
        return Math.ceil(ms / n) + ' ' + name + 's';
    }

},{}],25:[function(_dereq_,module,exports){
    (function (global){
        /**
         * Module dependencies.
         */

        var keys = _dereq_('./keys');
        var hasBinary = _dereq_('has-binary');
        var sliceBuffer = _dereq_('arraybuffer.slice');
        var base64encoder = _dereq_('base64-arraybuffer');
        var after = _dereq_('after');
        var utf8 = _dereq_('utf8');

        /**
         * Check if we are running an android browser. That requires us to use
         * ArrayBuffer with polling transports...
         *
         * http://ghinda.net/jpeg-blob-ajax-android/
         */

        var isAndroid = navigator.userAgent.match(/Android/i);

        /**
         * Check if we are running in PhantomJS.
         * Uploading a Blob with PhantomJS does not work correctly, as reported here:
         * https://github.com/ariya/phantomjs/issues/11395
         * @type boolean
         */
        var isPhantomJS = /PhantomJS/i.test(navigator.userAgent);

        /**
         * When true, avoids using Blobs to encode payloads.
         * @type boolean
         */
        var dontSendBlobs = isAndroid || isPhantomJS;

        /**
         * Current protocol version.
         */

        exports.protocol = 3;

        /**
         * Packet types.
         */

        var packets = exports.packets = {
            open:     0    // non-ws
            , close:    1    // non-ws
            , ping:     2
            , pong:     3
            , message:  4
            , upgrade:  5
            , noop:     6
        };

        var packetslist = keys(packets);

        /**
         * Premade error packet.
         */

        var err = { type: 'error', data: 'parser error' };

        /**
         * Create a blob api even for blob builder when vendor prefixes exist
         */

        var Blob = _dereq_('blob');

        /**
         * Encodes a packet.
         *
         *     <packet type id> [ <data> ]
         *
         * Example:
         *
         *     5hello world
         *     3
         *     4
         *
         * Binary is encoded in an identical principle
         *
         * @api private
         */

        exports.encodePacket = function (packet, supportsBinary, utf8encode, callback) {
            if ('function' == typeof supportsBinary) {
                callback = supportsBinary;
                supportsBinary = false;
            }

            if ('function' == typeof utf8encode) {
                callback = utf8encode;
                utf8encode = null;
            }

            var data = (packet.data === undefined)
                ? undefined
                : packet.data.buffer || packet.data;

            if (global.ArrayBuffer && data instanceof ArrayBuffer) {
                return encodeArrayBuffer(packet, supportsBinary, callback);
            } else if (Blob && data instanceof global.Blob) {
                return encodeBlob(packet, supportsBinary, callback);
            }

            // might be an object with { base64: true, data: dataAsBase64String }
            if (data && data.base64) {
                return encodeBase64Object(packet, callback);
            }

            // Sending data as a utf-8 string
            var encoded = packets[packet.type];

            // data fragment is optional
            if (undefined !== packet.data) {
                encoded += utf8encode ? utf8.encode(String(packet.data)) : String(packet.data);
            }

            return callback('' + encoded);

        };

        function encodeBase64Object(packet, callback) {
            // packet data is an object { base64: true, data: dataAsBase64String }
            var message = 'b' + exports.packets[packet.type] + packet.data.data;
            return callback(message);
        }

        /**
         * Encode packet helpers for binary types
         */

        function encodeArrayBuffer(packet, supportsBinary, callback) {
            if (!supportsBinary) {
                return exports.encodeBase64Packet(packet, callback);
            }

            var data = packet.data;
            var contentArray = new Uint8Array(data);
            var resultBuffer = new Uint8Array(1 + data.byteLength);

            resultBuffer[0] = packets[packet.type];
            for (var i = 0; i < contentArray.length; i++) {
                resultBuffer[i+1] = contentArray[i];
            }

            return callback(resultBuffer.buffer);
        }

        function encodeBlobAsArrayBuffer(packet, supportsBinary, callback) {
            if (!supportsBinary) {
                return exports.encodeBase64Packet(packet, callback);
            }

            var fr = new FileReader();
            fr.onload = function() {
                packet.data = fr.result;
                exports.encodePacket(packet, supportsBinary, true, callback);
            };
            return fr.readAsArrayBuffer(packet.data);
        }

        function encodeBlob(packet, supportsBinary, callback) {
            if (!supportsBinary) {
                return exports.encodeBase64Packet(packet, callback);
            }

            if (dontSendBlobs) {
                return encodeBlobAsArrayBuffer(packet, supportsBinary, callback);
            }

            var length = new Uint8Array(1);
            length[0] = packets[packet.type];
            var blob = new Blob([length.buffer, packet.data]);

            return callback(blob);
        }

        /**
         * Encodes a packet with binary data in a base64 string
         *
         * @param {Object} packet, has `type` and `data`
         * @return {String} base64 encoded message
         */

        exports.encodeBase64Packet = function(packet, callback) {
            var message = 'b' + exports.packets[packet.type];
            if (Blob && packet.data instanceof Blob) {
                var fr = new FileReader();
                fr.onload = function() {
                    var b64 = fr.result.split(',')[1];
                    callback(message + b64);
                };
                return fr.readAsDataURL(packet.data);
            }

            var b64data;
            try {
                b64data = String.fromCharCode.apply(null, new Uint8Array(packet.data));
            } catch (e) {
                // iPhone Safari doesn't let you apply with typed arrays
                var typed = new Uint8Array(packet.data);
                var basic = new Array(typed.length);
                for (var i = 0; i < typed.length; i++) {
                    basic[i] = typed[i];
                }
                b64data = String.fromCharCode.apply(null, basic);
            }
            message += global.btoa(b64data);
            return callback(message);
        };

        /**
         * Decodes a packet. Changes format to Blob if requested.
         *
         * @return {Object} with `type` and `data` (if any)
         * @api private
         */

        exports.decodePacket = function (data, binaryType, utf8decode) {
            // String data
            if (typeof data == 'string' || data === undefined) {
                if (data.charAt(0) == 'b') {
                    return exports.decodeBase64Packet(data.substr(1), binaryType);
                }

                if (utf8decode) {
                    try {
                        data = utf8.decode(data);
                    } catch (e) {
                        return err;
                    }
                }
                var type = data.charAt(0);

                if (Number(type) != type || !packetslist[type]) {
                    return err;
                }

                if (data.length > 1) {
                    return { type: packetslist[type], data: data.substring(1) };
                } else {
                    return { type: packetslist[type] };
                }
            }

            var asArray = new Uint8Array(data);
            var type = asArray[0];
            var rest = sliceBuffer(data, 1);
            if (Blob && binaryType === 'blob') {
                rest = new Blob([rest]);
            }
            return { type: packetslist[type], data: rest };
        };

        /**
         * Decodes a packet encoded in a base64 string
         *
         * @param {String} base64 encoded message
         * @return {Object} with `type` and `data` (if any)
         */

        exports.decodeBase64Packet = function(msg, binaryType) {
            var type = packetslist[msg.charAt(0)];
            if (!global.ArrayBuffer) {
                return { type: type, data: { base64: true, data: msg.substr(1) } };
            }

            var data = base64encoder.decode(msg.substr(1));

            if (binaryType === 'blob' && Blob) {
                data = new Blob([data]);
            }

            return { type: type, data: data };
        };

        /**
         * Encodes multiple messages (payload).
         *
         *     <length>:data
         *
         * Example:
         *
         *     11:hello world2:hi
         *
         * If any contents are binary, they will be encoded as base64 strings. Base64
         * encoded strings are marked with a b before the length specifier
         *
         * @param {Array} packets
         * @api private
         */

        exports.encodePayload = function (packets, supportsBinary, callback) {
            if (typeof supportsBinary == 'function') {
                callback = supportsBinary;
                supportsBinary = null;
            }

            var isBinary = hasBinary(packets);

            if (supportsBinary && isBinary) {
                if (Blob && !dontSendBlobs) {
                    return exports.encodePayloadAsBlob(packets, callback);
                }

                return exports.encodePayloadAsArrayBuffer(packets, callback);
            }

            if (!packets.length) {
                return callback('0:');
            }

            function setLengthHeader(message) {
                return message.length + ':' + message;
            }

            function encodeOne(packet, doneCallback) {
                exports.encodePacket(packet, !isBinary ? false : supportsBinary, true, function(message) {
                    doneCallback(null, setLengthHeader(message));
                });
            }

            map(packets, encodeOne, function(err, results) {
                return callback(results.join(''));
            });
        };

        /**
         * Async array map using after
         */

        function map(ary, each, done) {
            var result = new Array(ary.length);
            var next = after(ary.length, done);

            var eachWithIndex = function(i, el, cb) {
                each(el, function(error, msg) {
                    result[i] = msg;
                    cb(error, result);
                });
            };

            for (var i = 0; i < ary.length; i++) {
                eachWithIndex(i, ary[i], next);
            }
        }

        /*
         * Decodes data when a payload is maybe expected. Possible binary contents are
         * decoded from their base64 representation
         *
         * @param {String} data, callback method
         * @api public
         */

        exports.decodePayload = function (data, binaryType, callback) {
            if (typeof data != 'string') {
                return exports.decodePayloadAsBinary(data, binaryType, callback);
            }

            if (typeof binaryType === 'function') {
                callback = binaryType;
                binaryType = null;
            }

            var packet;
            if (data == '') {
                // parser error - ignoring payload
                return callback(err, 0, 1);
            }

            var length = ''
                , n, msg;

            for (var i = 0, l = data.length; i < l; i++) {
                var chr = data.charAt(i);

                if (':' != chr) {
                    length += chr;
                } else {
                    if ('' == length || (length != (n = Number(length)))) {
                        // parser error - ignoring payload
                        return callback(err, 0, 1);
                    }

                    msg = data.substr(i + 1, n);

                    if (length != msg.length) {
                        // parser error - ignoring payload
                        return callback(err, 0, 1);
                    }

                    if (msg.length) {
                        packet = exports.decodePacket(msg, binaryType, true);

                        if (err.type == packet.type && err.data == packet.data) {
                            // parser error in individual packet - ignoring payload
                            return callback(err, 0, 1);
                        }

                        var ret = callback(packet, i + n, l);
                        if (false === ret) return;
                    }

                    // advance cursor
                    i += n;
                    length = '';
                }
            }

            if (length != '') {
                // parser error - ignoring payload
                return callback(err, 0, 1);
            }

        };

        /**
         * Encodes multiple messages (payload) as binary.
         *
         * <1 = binary, 0 = string><number from 0-9><number from 0-9>[...]<number
         * 255><data>
         *
         * Example:
         * 1 3 255 1 2 3, if the binary contents are interpreted as 8 bit integers
         *
         * @param {Array} packets
         * @return {ArrayBuffer} encoded payload
         * @api private
         */

        exports.encodePayloadAsArrayBuffer = function(packets, callback) {
            if (!packets.length) {
                return callback(new ArrayBuffer(0));
            }

            function encodeOne(packet, doneCallback) {
                exports.encodePacket(packet, true, true, function(data) {
                    return doneCallback(null, data);
                });
            }

            map(packets, encodeOne, function(err, encodedPackets) {
                var totalLength = encodedPackets.reduce(function(acc, p) {
                    var len;
                    if (typeof p === 'string'){
                        len = p.length;
                    } else {
                        len = p.byteLength;
                    }
                    return acc + len.toString().length + len + 2; // string/binary identifier + separator = 2
                }, 0);

                var resultArray = new Uint8Array(totalLength);

                var bufferIndex = 0;
                encodedPackets.forEach(function(p) {
                    var isString = typeof p === 'string';
                    var ab = p;
                    if (isString) {
                        var view = new Uint8Array(p.length);
                        for (var i = 0; i < p.length; i++) {
                            view[i] = p.charCodeAt(i);
                        }
                        ab = view.buffer;
                    }

                    if (isString) { // not true binary
                        resultArray[bufferIndex++] = 0;
                    } else { // true binary
                        resultArray[bufferIndex++] = 1;
                    }

                    var lenStr = ab.byteLength.toString();
                    for (var i = 0; i < lenStr.length; i++) {
                        resultArray[bufferIndex++] = parseInt(lenStr[i]);
                    }
                    resultArray[bufferIndex++] = 255;

                    var view = new Uint8Array(ab);
                    for (var i = 0; i < view.length; i++) {
                        resultArray[bufferIndex++] = view[i];
                    }
                });

                return callback(resultArray.buffer);
            });
        };

        /**
         * Encode as Blob
         */

        exports.encodePayloadAsBlob = function(packets, callback) {
            function encodeOne(packet, doneCallback) {
                exports.encodePacket(packet, true, true, function(encoded) {
                    var binaryIdentifier = new Uint8Array(1);
                    binaryIdentifier[0] = 1;
                    if (typeof encoded === 'string') {
                        var view = new Uint8Array(encoded.length);
                        for (var i = 0; i < encoded.length; i++) {
                            view[i] = encoded.charCodeAt(i);
                        }
                        encoded = view.buffer;
                        binaryIdentifier[0] = 0;
                    }

                    var len = (encoded instanceof ArrayBuffer)
                        ? encoded.byteLength
                        : encoded.size;

                    var lenStr = len.toString();
                    var lengthAry = new Uint8Array(lenStr.length + 1);
                    for (var i = 0; i < lenStr.length; i++) {
                        lengthAry[i] = parseInt(lenStr[i]);
                    }
                    lengthAry[lenStr.length] = 255;

                    if (Blob) {
                        var blob = new Blob([binaryIdentifier.buffer, lengthAry.buffer, encoded]);
                        doneCallback(null, blob);
                    }
                });
            }

            map(packets, encodeOne, function(err, results) {
                return callback(new Blob(results));
            });
        };

        /*
         * Decodes data when a payload is maybe expected. Strings are decoded by
         * interpreting each byte as a key code for entries marked to start with 0. See
         * description of encodePayloadAsBinary
         *
         * @param {ArrayBuffer} data, callback method
         * @api public
         */

        exports.decodePayloadAsBinary = function (data, binaryType, callback) {
            if (typeof binaryType === 'function') {
                callback = binaryType;
                binaryType = null;
            }

            var bufferTail = data;
            var buffers = [];

            var numberTooLong = false;
            while (bufferTail.byteLength > 0) {
                var tailArray = new Uint8Array(bufferTail);
                var isString = tailArray[0] === 0;
                var msgLength = '';

                for (var i = 1; ; i++) {
                    if (tailArray[i] == 255) break;

                    if (msgLength.length > 310) {
                        numberTooLong = true;
                        break;
                    }

                    msgLength += tailArray[i];
                }

                if(numberTooLong) return callback(err, 0, 1);

                bufferTail = sliceBuffer(bufferTail, 2 + msgLength.length);
                msgLength = parseInt(msgLength);

                var msg = sliceBuffer(bufferTail, 0, msgLength);
                if (isString) {
                    try {
                        msg = String.fromCharCode.apply(null, new Uint8Array(msg));
                    } catch (e) {
                        // iPhone Safari doesn't let you apply to typed arrays
                        var typed = new Uint8Array(msg);
                        msg = '';
                        for (var i = 0; i < typed.length; i++) {
                            msg += String.fromCharCode(typed[i]);
                        }
                    }
                }

                buffers.push(msg);
                bufferTail = sliceBuffer(bufferTail, msgLength);
            }

            var total = buffers.length;
            buffers.forEach(function(buffer, i) {
                callback(exports.decodePacket(buffer, binaryType, true), i, total);
            });
        };

    }).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./keys":26,"after":27,"arraybuffer.slice":28,"base64-arraybuffer":29,"blob":30,"has-binary":31,"utf8":33}],26:[function(_dereq_,module,exports){

    /**
     * Gets the keys for an object.
     *
     * @return {Array} keys
     * @api private
     */

    module.exports = Object.keys || function keys (obj){
        var arr = [];
        var has = Object.prototype.hasOwnProperty;

        for (var i in obj) {
            if (has.call(obj, i)) {
                arr.push(i);
            }
        }
        return arr;
    };

},{}],27:[function(_dereq_,module,exports){
    module.exports = after

    function after(count, callback, err_cb) {
        var bail = false
        err_cb = err_cb || noop
        proxy.count = count

        return (count === 0) ? callback() : proxy

        function proxy(err, result) {
            if (proxy.count <= 0) {
                throw new Error('after called too many times')
            }
            --proxy.count

            // after first error, rest are passed to err_cb
            if (err) {
                bail = true
                callback(err)
                // future error callbacks will go to error handler
                callback = err_cb
            } else if (proxy.count === 0 && !bail) {
                callback(null, result)
            }
        }
    }

    function noop() {}

},{}],28:[function(_dereq_,module,exports){
    /**
     * An abstraction for slicing an arraybuffer even when
     * ArrayBuffer.prototype.slice is not supported
     *
     * @api public
     */

    module.exports = function(arraybuffer, start, end) {
        var bytes = arraybuffer.byteLength;
        start = start || 0;
        end = end || bytes;

        if (arraybuffer.slice) { return arraybuffer.slice(start, end); }

        if (start < 0) { start += bytes; }
        if (end < 0) { end += bytes; }
        if (end > bytes) { end = bytes; }

        if (start >= bytes || start >= end || bytes === 0) {
            return new ArrayBuffer(0);
        }

        var abv = new Uint8Array(arraybuffer);
        var result = new Uint8Array(end - start);
        for (var i = start, ii = 0; i < end; i++, ii++) {
            result[ii] = abv[i];
        }
        return result.buffer;
    };

},{}],29:[function(_dereq_,module,exports){
    /*
     * base64-arraybuffer
     * https://github.com/niklasvh/base64-arraybuffer
     *
     * Copyright (c) 2012 Niklas von Hertzen
     * Licensed under the MIT license.
     */
    (function(chars){
        "use strict";

        exports.encode = function(arraybuffer) {
            var bytes = new Uint8Array(arraybuffer),
                i, len = bytes.length, base64 = "";

            for (i = 0; i < len; i+=3) {
                base64 += chars[bytes[i] >> 2];
                base64 += chars[((bytes[i] & 3) << 4) | (bytes[i + 1] >> 4)];
                base64 += chars[((bytes[i + 1] & 15) << 2) | (bytes[i + 2] >> 6)];
                base64 += chars[bytes[i + 2] & 63];
            }

            if ((len % 3) === 2) {
                base64 = base64.substring(0, base64.length - 1) + "=";
            } else if (len % 3 === 1) {
                base64 = base64.substring(0, base64.length - 2) + "==";
            }

            return base64;
        };

        exports.decode =  function(base64) {
            var bufferLength = base64.length * 0.75,
                len = base64.length, i, p = 0,
                encoded1, encoded2, encoded3, encoded4;

            if (base64[base64.length - 1] === "=") {
                bufferLength--;
                if (base64[base64.length - 2] === "=") {
                    bufferLength--;
                }
            }

            var arraybuffer = new ArrayBuffer(bufferLength),
                bytes = new Uint8Array(arraybuffer);

            for (i = 0; i < len; i+=4) {
                encoded1 = chars.indexOf(base64[i]);
                encoded2 = chars.indexOf(base64[i+1]);
                encoded3 = chars.indexOf(base64[i+2]);
                encoded4 = chars.indexOf(base64[i+3]);

                bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
                bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
                bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
            }

            return arraybuffer;
        };
    })("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");

},{}],30:[function(_dereq_,module,exports){
    (function (global){
        /**
         * Create a blob builder even when vendor prefixes exist
         */

        var BlobBuilder = global.BlobBuilder
            || global.WebKitBlobBuilder
            || global.MSBlobBuilder
            || global.MozBlobBuilder;

        /**
         * Check if Blob constructor is supported
         */

        var blobSupported = (function() {
            try {
                var b = new Blob(['hi']);
                return b.size == 2;
            } catch(e) {
                return false;
            }
        })();

        /**
         * Check if BlobBuilder is supported
         */

        var blobBuilderSupported = BlobBuilder
            && BlobBuilder.prototype.append
            && BlobBuilder.prototype.getBlob;

        function BlobBuilderConstructor(ary, options) {
            options = options || {};

            var bb = new BlobBuilder();
            for (var i = 0; i < ary.length; i++) {
                bb.append(ary[i]);
            }
            return (options.type) ? bb.getBlob(options.type) : bb.getBlob();
        };

        module.exports = (function() {
            if (blobSupported) {
                return global.Blob;
            } else if (blobBuilderSupported) {
                return BlobBuilderConstructor;
            } else {
                return undefined;
            }
        })();

    }).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],31:[function(_dereq_,module,exports){
    (function (global){

        /*
         * Module requirements.
         */

        var isArray = _dereq_('isarray');

        /**
         * Module exports.
         */

        module.exports = hasBinary;

        /**
         * Checks for binary data.
         *
         * Right now only Buffer and ArrayBuffer are supported..
         *
         * @param {Object} anything
         * @api public
         */

        function hasBinary(data) {

            function _hasBinary(obj) {
                if (!obj) return false;

                if ( (global.Buffer && global.Buffer.isBuffer(obj)) ||
                    (global.ArrayBuffer && obj instanceof ArrayBuffer) ||
                    (global.Blob && obj instanceof Blob) ||
                    (global.File && obj instanceof File)
                    ) {
                    return true;
                }

                if (isArray(obj)) {
                    for (var i = 0; i < obj.length; i++) {
                        if (_hasBinary(obj[i])) {
                            return true;
                        }
                    }
                } else if (obj && 'object' == typeof obj) {
                    if (obj.toJSON) {
                        obj = obj.toJSON();
                    }

                    for (var key in obj) {
                        if (obj.hasOwnProperty(key) && _hasBinary(obj[key])) {
                            return true;
                        }
                    }
                }

                return false;
            }

            return _hasBinary(data);
        }

    }).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"isarray":32}],32:[function(_dereq_,module,exports){
    module.exports = Array.isArray || function (arr) {
        return Object.prototype.toString.call(arr) == '[object Array]';
    };

},{}],33:[function(_dereq_,module,exports){
    (function (global){
        /*! http://mths.be/utf8js v2.0.0 by @mathias */
        ;(function(root) {

            // Detect free variables `exports`
            var freeExports = typeof exports == 'object' && exports;

            // Detect free variable `module`
            var freeModule = typeof module == 'object' && module &&
                module.exports == freeExports && module;

            // Detect free variable `global`, from Node.js or Browserified code,
            // and use it as `root`
            var freeGlobal = typeof global == 'object' && global;
            if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
                root = freeGlobal;
            }

            /*--------------------------------------------------------------------------*/

            var stringFromCharCode = String.fromCharCode;

            // Taken from http://mths.be/punycode
            function ucs2decode(string) {
                var output = [];
                var counter = 0;
                var length = string.length;
                var value;
                var extra;
                while (counter < length) {
                    value = string.charCodeAt(counter++);
                    if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
                        // high surrogate, and there is a next character
                        extra = string.charCodeAt(counter++);
                        if ((extra & 0xFC00) == 0xDC00) { // low surrogate
                            output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
                        } else {
                            // unmatched surrogate; only append this code unit, in case the next
                            // code unit is the high surrogate of a surrogate pair
                            output.push(value);
                            counter--;
                        }
                    } else {
                        output.push(value);
                    }
                }
                return output;
            }

            // Taken from http://mths.be/punycode
            function ucs2encode(array) {
                var length = array.length;
                var index = -1;
                var value;
                var output = '';
                while (++index < length) {
                    value = array[index];
                    if (value > 0xFFFF) {
                        value -= 0x10000;
                        output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
                        value = 0xDC00 | value & 0x3FF;
                    }
                    output += stringFromCharCode(value);
                }
                return output;
            }

            /*--------------------------------------------------------------------------*/

            function createByte(codePoint, shift) {
                return stringFromCharCode(((codePoint >> shift) & 0x3F) | 0x80);
            }

            function encodeCodePoint(codePoint) {
                if ((codePoint & 0xFFFFFF80) == 0) { // 1-byte sequence
                    return stringFromCharCode(codePoint);
                }
                var symbol = '';
                if ((codePoint & 0xFFFFF800) == 0) { // 2-byte sequence
                    symbol = stringFromCharCode(((codePoint >> 6) & 0x1F) | 0xC0);
                }
                else if ((codePoint & 0xFFFF0000) == 0) { // 3-byte sequence
                    symbol = stringFromCharCode(((codePoint >> 12) & 0x0F) | 0xE0);
                    symbol += createByte(codePoint, 6);
                }
                else if ((codePoint & 0xFFE00000) == 0) { // 4-byte sequence
                    symbol = stringFromCharCode(((codePoint >> 18) & 0x07) | 0xF0);
                    symbol += createByte(codePoint, 12);
                    symbol += createByte(codePoint, 6);
                }
                symbol += stringFromCharCode((codePoint & 0x3F) | 0x80);
                return symbol;
            }

            function utf8encode(string) {
                var codePoints = ucs2decode(string);

                // console.log(JSON.stringify(codePoints.map(function(x) {
                // 	return 'U+' + x.toString(16).toUpperCase();
                // })));

                var length = codePoints.length;
                var index = -1;
                var codePoint;
                var byteString = '';
                while (++index < length) {
                    codePoint = codePoints[index];
                    byteString += encodeCodePoint(codePoint);
                }
                return byteString;
            }

            /*--------------------------------------------------------------------------*/

            function readContinuationByte() {
                if (byteIndex >= byteCount) {
                    throw Error('Invalid byte index');
                }

                var continuationByte = byteArray[byteIndex] & 0xFF;
                byteIndex++;

                if ((continuationByte & 0xC0) == 0x80) {
                    return continuationByte & 0x3F;
                }

                // If we end up here, it’s not a continuation byte
                throw Error('Invalid continuation byte');
            }

            function decodeSymbol() {
                var byte1;
                var byte2;
                var byte3;
                var byte4;
                var codePoint;

                if (byteIndex > byteCount) {
                    throw Error('Invalid byte index');
                }

                if (byteIndex == byteCount) {
                    return false;
                }

                // Read first byte
                byte1 = byteArray[byteIndex] & 0xFF;
                byteIndex++;

                // 1-byte sequence (no continuation bytes)
                if ((byte1 & 0x80) == 0) {
                    return byte1;
                }

                // 2-byte sequence
                if ((byte1 & 0xE0) == 0xC0) {
                    var byte2 = readContinuationByte();
                    codePoint = ((byte1 & 0x1F) << 6) | byte2;
                    if (codePoint >= 0x80) {
                        return codePoint;
                    } else {
                        throw Error('Invalid continuation byte');
                    }
                }

                // 3-byte sequence (may include unpaired surrogates)
                if ((byte1 & 0xF0) == 0xE0) {
                    byte2 = readContinuationByte();
                    byte3 = readContinuationByte();
                    codePoint = ((byte1 & 0x0F) << 12) | (byte2 << 6) | byte3;
                    if (codePoint >= 0x0800) {
                        return codePoint;
                    } else {
                        throw Error('Invalid continuation byte');
                    }
                }

                // 4-byte sequence
                if ((byte1 & 0xF8) == 0xF0) {
                    byte2 = readContinuationByte();
                    byte3 = readContinuationByte();
                    byte4 = readContinuationByte();
                    codePoint = ((byte1 & 0x0F) << 0x12) | (byte2 << 0x0C) |
                        (byte3 << 0x06) | byte4;
                    if (codePoint >= 0x010000 && codePoint <= 0x10FFFF) {
                        return codePoint;
                    }
                }

                throw Error('Invalid UTF-8 detected');
            }

            var byteArray;
            var byteCount;
            var byteIndex;
            function utf8decode(byteString) {
                byteArray = ucs2decode(byteString);
                byteCount = byteArray.length;
                byteIndex = 0;
                var codePoints = [];
                var tmp;
                while ((tmp = decodeSymbol()) !== false) {
                    codePoints.push(tmp);
                }
                return ucs2encode(codePoints);
            }

            /*--------------------------------------------------------------------------*/

            var utf8 = {
                'version': '2.0.0',
                'encode': utf8encode,
                'decode': utf8decode
            };

            // Some AMD build optimizers, like r.js, check for specific condition patterns
            // like the following:
            if (
                typeof define == 'function' &&
                typeof define.amd == 'object' &&
                define.amd
                ) {
                define(function() {
                    return utf8;
                });
            }	else if (freeExports && !freeExports.nodeType) {
                if (freeModule) { // in Node.js or RingoJS v0.8.0+
                    freeModule.exports = utf8;
                } else { // in Narwhal or RingoJS v0.7.0-
                    var object = {};
                    var hasOwnProperty = object.hasOwnProperty;
                    for (var key in utf8) {
                        hasOwnProperty.call(utf8, key) && (freeExports[key] = utf8[key]);
                    }
                }
            } else { // in Rhino or a web browser
                root.utf8 = utf8;
            }

        }(this));

    }).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],34:[function(_dereq_,module,exports){
    (function (global){
        /**
         * JSON parse.
         *
         * @see Based on jQuery#parseJSON (MIT) and JSON2
         * @api private
         */

        var rvalidchars = /^[\],:{}\s]*$/;
        var rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
        var rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
        var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
        var rtrimLeft = /^\s+/;
        var rtrimRight = /\s+$/;

        module.exports = function parsejson(data) {
            if ('string' != typeof data || !data) {
                return null;
            }

            data = data.replace(rtrimLeft, '').replace(rtrimRight, '');

            // Attempt to parse using the native JSON parser first
            if (global.JSON && JSON.parse) {
                return JSON.parse(data);
            }

            if (rvalidchars.test(data.replace(rvalidescape, '@')
                .replace(rvalidtokens, ']')
                .replace(rvalidbraces, ''))) {
                return (new Function('return ' + data))();
            }
        };
    }).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],35:[function(_dereq_,module,exports){
    /**
     * Compiles a querystring
     * Returns string representation of the object
     *
     * @param {Object}
     * @api private
     */

    exports.encode = function (obj) {
        var str = '';

        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                if (str.length) str += '&';
                str += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]);
            }
        }

        return str;
    };

    /**
     * Parses a simple querystring into an object
     *
     * @param {String} qs
     * @api private
     */

    exports.decode = function(qs){
        var qry = {};
        var pairs = qs.split('&');
        for (var i = 0, l = pairs.length; i < l; i++) {
            var pair = pairs[i].split('=');
            qry[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
        return qry;
    };

},{}],36:[function(_dereq_,module,exports){
    /**
     * Parses an URI
     *
     * @author Steven Levithan <stevenlevithan.com> (MIT license)
     * @api private
     */

    var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

    var parts = [
        'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
    ];

    module.exports = function parseuri(str) {
        var src = str,
            b = str.indexOf('['),
            e = str.indexOf(']');

        if (b != -1 && e != -1) {
            str = str.substring(0, b) + str.substring(b, e).replace(/:/g, ';') + str.substring(e, str.length);
        }

        var m = re.exec(str || ''),
            uri = {},
            i = 14;

        while (i--) {
            uri[parts[i]] = m[i] || '';
        }

        if (b != -1 && e != -1) {
            uri.source = src;
            uri.host = uri.host.substring(1, uri.host.length - 1).replace(/;/g, ':');
            uri.authority = uri.authority.replace('[', '').replace(']', '').replace(/;/g, ':');
            uri.ipv6uri = true;
        }

        return uri;
    };

},{}],37:[function(_dereq_,module,exports){

    /**
     * Module dependencies.
     */

    var global = (function() { return this; })();

    /**
     * WebSocket constructor.
     */

    var WebSocket = global.WebSocket || global.MozWebSocket;

    /**
     * Module exports.
     */

    module.exports = WebSocket ? ws : null;

    /**
     * WebSocket constructor.
     *
     * The third `opts` options object gets ignored in web browsers, since it's
     * non-standard, and throws a TypeError if passed to the constructor.
     * See: https://github.com/einaros/ws/issues/227
     *
     * @param {String} uri
     * @param {Array} protocols (optional)
     * @param {Object) opts (optional)
 * @api public
     */

    function ws(uri, protocols, opts) {
        var instance;
        if (protocols) {
            instance = new WebSocket(uri, protocols);
        } else {
            instance = new WebSocket(uri);
        }
        return instance;
    }

    if (WebSocket) ws.prototype = WebSocket.prototype;

},{}],38:[function(_dereq_,module,exports){
    (function (global){

        /*
         * Module requirements.
         */

        var isArray = _dereq_('isarray');

        /**
         * Module exports.
         */

        module.exports = hasBinary;

        /**
         * Checks for binary data.
         *
         * Right now only Buffer and ArrayBuffer are supported..
         *
         * @param {Object} anything
         * @api public
         */

        function hasBinary(data) {

            function _hasBinary(obj) {
                if (!obj) return false;

                if ( (global.Buffer && global.Buffer.isBuffer(obj)) ||
                    (global.ArrayBuffer && obj instanceof ArrayBuffer) ||
                    (global.Blob && obj instanceof Blob) ||
                    (global.File && obj instanceof File)
                    ) {
                    return true;
                }

                if (isArray(obj)) {
                    for (var i = 0; i < obj.length; i++) {
                        if (_hasBinary(obj[i])) {
                            return true;
                        }
                    }
                } else if (obj && 'object' == typeof obj) {
                    if (obj.toJSON) {
                        obj = obj.toJSON();
                    }

                    for (var key in obj) {
                        if (Object.prototype.hasOwnProperty.call(obj, key) && _hasBinary(obj[key])) {
                            return true;
                        }
                    }
                }

                return false;
            }

            return _hasBinary(data);
        }

    }).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"isarray":39}],39:[function(_dereq_,module,exports){
    module.exports=_dereq_(32)
},{}],40:[function(_dereq_,module,exports){

    /**
     * Module dependencies.
     */

    var global = _dereq_('global');

    /**
     * Module exports.
     *
     * Logic borrowed from Modernizr:
     *
     *   - https://github.com/Modernizr/Modernizr/blob/master/feature-detects/cors.js
     */

    try {
        module.exports = 'XMLHttpRequest' in global &&
            'withCredentials' in new global.XMLHttpRequest();
    } catch (err) {
        // if XMLHttp support is disabled in IE then it will throw
        // when trying to create
        module.exports = false;
    }

},{"global":41}],41:[function(_dereq_,module,exports){

    /**
     * Returns `this`. Execute this without a "context" (i.e. without it being
     * attached to an object of the left-hand side), and `this` points to the
     * "global" scope of the current JS execution.
     */

    module.exports = (function () { return this; })();

},{}],42:[function(_dereq_,module,exports){

    var indexOf = [].indexOf;

    module.exports = function(arr, obj){
        if (indexOf) return arr.indexOf(obj);
        for (var i = 0; i < arr.length; ++i) {
            if (arr[i] === obj) return i;
        }
        return -1;
    };
},{}],43:[function(_dereq_,module,exports){

    /**
     * HOP ref.
     */

    var has = Object.prototype.hasOwnProperty;

    /**
     * Return own keys in `obj`.
     *
     * @param {Object} obj
     * @return {Array}
     * @api public
     */

    exports.keys = Object.keys || function(obj){
        var keys = [];
        for (var key in obj) {
            if (has.call(obj, key)) {
                keys.push(key);
            }
        }
        return keys;
    };

    /**
     * Return own values in `obj`.
     *
     * @param {Object} obj
     * @return {Array}
     * @api public
     */

    exports.values = function(obj){
        var vals = [];
        for (var key in obj) {
            if (has.call(obj, key)) {
                vals.push(obj[key]);
            }
        }
        return vals;
    };

    /**
     * Merge `b` into `a`.
     *
     * @param {Object} a
     * @param {Object} b
     * @return {Object} a
     * @api public
     */

    exports.merge = function(a, b){
        for (var key in b) {
            if (has.call(b, key)) {
                a[key] = b[key];
            }
        }
        return a;
    };

    /**
     * Return length of `obj`.
     *
     * @param {Object} obj
     * @return {Number}
     * @api public
     */

    exports.length = function(obj){
        return exports.keys(obj).length;
    };

    /**
     * Check if `obj` is empty.
     *
     * @param {Object} obj
     * @return {Boolean}
     * @api public
     */

    exports.isEmpty = function(obj){
        return 0 == exports.length(obj);
    };
},{}],44:[function(_dereq_,module,exports){
    /**
     * Parses an URI
     *
     * @author Steven Levithan <stevenlevithan.com> (MIT license)
     * @api private
     */

    var re = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/;

    var parts = [
        'source', 'protocol', 'authority', 'userInfo', 'user', 'password', 'host'
        , 'port', 'relative', 'path', 'directory', 'file', 'query', 'anchor'
    ];

    module.exports = function parseuri(str) {
        var m = re.exec(str || '')
            , uri = {}
            , i = 14;

        while (i--) {
            uri[parts[i]] = m[i] || '';
        }

        return uri;
    };

},{}],45:[function(_dereq_,module,exports){
    (function (global){
        /*global Blob,File*/

        /**
         * Module requirements
         */

        var isArray = _dereq_('isarray');
        var isBuf = _dereq_('./is-buffer');

        /**
         * Replaces every Buffer | ArrayBuffer in packet with a numbered placeholder.
         * Anything with blobs or files should be fed through removeBlobs before coming
         * here.
         *
         * @param {Object} packet - socket.io event packet
         * @return {Object} with deconstructed packet and list of buffers
         * @api public
         */

        exports.deconstructPacket = function(packet){
            var buffers = [];
            var packetData = packet.data;

            function _deconstructPacket(data) {
                if (!data) return data;

                if (isBuf(data)) {
                    var placeholder = { _placeholder: true, num: buffers.length };
                    buffers.push(data);
                    return placeholder;
                } else if (isArray(data)) {
                    var newData = new Array(data.length);
                    for (var i = 0; i < data.length; i++) {
                        newData[i] = _deconstructPacket(data[i]);
                    }
                    return newData;
                } else if ('object' == typeof data && !(data instanceof Date)) {
                    var newData = {};
                    for (var key in data) {
                        newData[key] = _deconstructPacket(data[key]);
                    }
                    return newData;
                }
                return data;
            }

            var pack = packet;
            pack.data = _deconstructPacket(packetData);
            pack.attachments = buffers.length; // number of binary 'attachments'
            return {packet: pack, buffers: buffers};
        };

        /**
         * Reconstructs a binary packet from its placeholder packet and buffers
         *
         * @param {Object} packet - event packet with placeholders
         * @param {Array} buffers - binary buffers to put in placeholder positions
         * @return {Object} reconstructed packet
         * @api public
         */

        exports.reconstructPacket = function(packet, buffers) {
            var curPlaceHolder = 0;

            function _reconstructPacket(data) {
                if (data && data._placeholder) {
                    var buf = buffers[data.num]; // appropriate buffer (should be natural order anyway)
                    return buf;
                } else if (isArray(data)) {
                    for (var i = 0; i < data.length; i++) {
                        data[i] = _reconstructPacket(data[i]);
                    }
                    return data;
                } else if (data && 'object' == typeof data) {
                    for (var key in data) {
                        data[key] = _reconstructPacket(data[key]);
                    }
                    return data;
                }
                return data;
            }

            packet.data = _reconstructPacket(packet.data);
            packet.attachments = undefined; // no longer useful
            return packet;
        };

        /**
         * Asynchronously removes Blobs or Files from data via
         * FileReader's readAsArrayBuffer method. Used before encoding
         * data as msgpack. Calls callback with the blobless data.
         *
         * @param {Object} data
         * @param {Function} callback
         * @api private
         */

        exports.removeBlobs = function(data, callback) {
            function _removeBlobs(obj, curKey, containingObject) {
                if (!obj) return obj;

                // convert any blob
                if ((global.Blob && obj instanceof Blob) ||
                    (global.File && obj instanceof File)) {
                    pendingBlobs++;

                    // async filereader
                    var fileReader = new FileReader();
                    fileReader.onload = function() { // this.result == arraybuffer
                        if (containingObject) {
                            containingObject[curKey] = this.result;
                        }
                        else {
                            bloblessData = this.result;
                        }

                        // if nothing pending its callback time
                        if(! --pendingBlobs) {
                            callback(bloblessData);
                        }
                    };

                    fileReader.readAsArrayBuffer(obj); // blob -> arraybuffer
                } else if (isArray(obj)) { // handle array
                    for (var i = 0; i < obj.length; i++) {
                        _removeBlobs(obj[i], i, obj);
                    }
                } else if (obj && 'object' == typeof obj && !isBuf(obj)) { // and object
                    for (var key in obj) {
                        _removeBlobs(obj[key], key, obj);
                    }
                }
            }

            var pendingBlobs = 0;
            var bloblessData = data;
            _removeBlobs(bloblessData);
            if (!pendingBlobs) {
                callback(bloblessData);
            }
        };

    }).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./is-buffer":47,"isarray":48}],46:[function(_dereq_,module,exports){

    /**
     * Module dependencies.
     */

    var debug = _dereq_('debug')('socket.io-parser');
    var json = _dereq_('json3');
    var isArray = _dereq_('isarray');
    var Emitter = _dereq_('component-emitter');
    var binary = _dereq_('./binary');
    var isBuf = _dereq_('./is-buffer');

    /**
     * Protocol version.
     *
     * @api public
     */

    exports.protocol = 4;

    /**
     * Packet types.
     *
     * @api public
     */

    exports.types = [
        'CONNECT',
        'DISCONNECT',
        'EVENT',
        'BINARY_EVENT',
        'ACK',
        'BINARY_ACK',
        'ERROR'
    ];

    /**
     * Packet type `connect`.
     *
     * @api public
     */

    exports.CONNECT = 0;

    /**
     * Packet type `disconnect`.
     *
     * @api public
     */

    exports.DISCONNECT = 1;

    /**
     * Packet type `event`.
     *
     * @api public
     */

    exports.EVENT = 2;

    /**
     * Packet type `ack`.
     *
     * @api public
     */

    exports.ACK = 3;

    /**
     * Packet type `error`.
     *
     * @api public
     */

    exports.ERROR = 4;

    /**
     * Packet type 'binary event'
     *
     * @api public
     */

    exports.BINARY_EVENT = 5;

    /**
     * Packet type `binary ack`. For acks with binary arguments.
     *
     * @api public
     */

    exports.BINARY_ACK = 6;

    /**
     * Encoder constructor.
     *
     * @api public
     */

    exports.Encoder = Encoder;

    /**
     * Decoder constructor.
     *
     * @api public
     */

    exports.Decoder = Decoder;

    /**
     * A socket.io Encoder instance
     *
     * @api public
     */

    function Encoder() {}

    /**
     * Encode a packet as a single string if non-binary, or as a
     * buffer sequence, depending on packet type.
     *
     * @param {Object} obj - packet object
     * @param {Function} callback - function to handle encodings (likely engine.write)
     * @return Calls callback with Array of encodings
     * @api public
     */

    Encoder.prototype.encode = function(obj, callback){
        debug('encoding packet %j', obj);

        if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
            encodeAsBinary(obj, callback);
        }
        else {
            var encoding = encodeAsString(obj);
            callback([encoding]);
        }
    };

    /**
     * Encode packet as string.
     *
     * @param {Object} packet
     * @return {String} encoded
     * @api private
     */

    function encodeAsString(obj) {
        var str = '';
        var nsp = false;

        // first is type
        str += obj.type;

        // attachments if we have them
        if (exports.BINARY_EVENT == obj.type || exports.BINARY_ACK == obj.type) {
            str += obj.attachments;
            str += '-';
        }

        // if we have a namespace other than `/`
        // we append it followed by a comma `,`
        if (obj.nsp && '/' != obj.nsp) {
            nsp = true;
            str += obj.nsp;
        }

        // immediately followed by the id
        if (null != obj.id) {
            if (nsp) {
                str += ',';
                nsp = false;
            }
            str += obj.id;
        }

        // json data
        if (null != obj.data) {
            if (nsp) str += ',';
            str += json.stringify(obj.data);
        }

        debug('encoded %j as %s', obj, str);
        return str;
    }

    /**
     * Encode packet as 'buffer sequence' by removing blobs, and
     * deconstructing packet into object with placeholders and
     * a list of buffers.
     *
     * @param {Object} packet
     * @return {Buffer} encoded
     * @api private
     */

    function encodeAsBinary(obj, callback) {

        function writeEncoding(bloblessData) {
            var deconstruction = binary.deconstructPacket(bloblessData);
            var pack = encodeAsString(deconstruction.packet);
            var buffers = deconstruction.buffers;

            buffers.unshift(pack); // add packet info to beginning of data list
            callback(buffers); // write all the buffers
        }

        binary.removeBlobs(obj, writeEncoding);
    }

    /**
     * A socket.io Decoder instance
     *
     * @return {Object} decoder
     * @api public
     */

    function Decoder() {
        this.reconstructor = null;
    }

    /**
     * Mix in `Emitter` with Decoder.
     */

    Emitter(Decoder.prototype);

    /**
     * Decodes an ecoded packet string into packet JSON.
     *
     * @param {String} obj - encoded packet
     * @return {Object} packet
     * @api public
     */

    Decoder.prototype.add = function(obj) {
        var packet;
        if ('string' == typeof obj) {
            packet = decodeString(obj);
            if (exports.BINARY_EVENT == packet.type || exports.BINARY_ACK == packet.type) { // binary packet's json
                this.reconstructor = new BinaryReconstructor(packet);

                // no attachments, labeled binary but no binary data to follow
                if (this.reconstructor.reconPack.attachments === 0) {
                    this.emit('decoded', packet);
                }
            } else { // non-binary full packet
                this.emit('decoded', packet);
            }
        }
        else if (isBuf(obj) || obj.base64) { // raw binary data
            if (!this.reconstructor) {
                throw new Error('got binary data when not reconstructing a packet');
            } else {
                packet = this.reconstructor.takeBinaryData(obj);
                if (packet) { // received final buffer
                    this.reconstructor = null;
                    this.emit('decoded', packet);
                }
            }
        }
        else {
            throw new Error('Unknown type: ' + obj);
        }
    };

    /**
     * Decode a packet String (JSON data)
     *
     * @param {String} str
     * @return {Object} packet
     * @api private
     */

    function decodeString(str) {
        var p = {};
        var i = 0;

        // look up type
        p.type = Number(str.charAt(0));
        if (null == exports.types[p.type]) return error();

        // look up attachments if type binary
        if (exports.BINARY_EVENT == p.type || exports.BINARY_ACK == p.type) {
            var buf = '';
            while (str.charAt(++i) != '-') {
                buf += str.charAt(i);
                if (i + 1 == str.length) break;
            }
            if (buf != Number(buf) || str.charAt(i) != '-') {
                throw new Error('Illegal attachments');
            }
            p.attachments = Number(buf);
        }

        // look up namespace (if any)
        if ('/' == str.charAt(i + 1)) {
            p.nsp = '';
            while (++i) {
                var c = str.charAt(i);
                if (',' == c) break;
                p.nsp += c;
                if (i + 1 == str.length) break;
            }
        } else {
            p.nsp = '/';
        }

        // look up id
        var next = str.charAt(i + 1);
        if ('' !== next && Number(next) == next) {
            p.id = '';
            while (++i) {
                var c = str.charAt(i);
                if (null == c || Number(c) != c) {
                    --i;
                    break;
                }
                p.id += str.charAt(i);
                if (i + 1 == str.length) break;
            }
            p.id = Number(p.id);
        }

        // look up json data
        if (str.charAt(++i)) {
            try {
                p.data = json.parse(str.substr(i));
            } catch(e){
                return error();
            }
        }

        debug('decoded %s as %j', str, p);
        return p;
    }

    /**
     * Deallocates a parser's resources
     *
     * @api public
     */

    Decoder.prototype.destroy = function() {
        if (this.reconstructor) {
            this.reconstructor.finishedReconstruction();
        }
    };

    /**
     * A manager of a binary event's 'buffer sequence'. Should
     * be constructed whenever a packet of type BINARY_EVENT is
     * decoded.
     *
     * @param {Object} packet
     * @return {BinaryReconstructor} initialized reconstructor
     * @api private
     */

    function BinaryReconstructor(packet) {
        this.reconPack = packet;
        this.buffers = [];
    }

    /**
     * Method to be called when binary data received from connection
     * after a BINARY_EVENT packet.
     *
     * @param {Buffer | ArrayBuffer} binData - the raw binary data received
     * @return {null | Object} returns null if more binary data is expected or
     *   a reconstructed packet object if all buffers have been received.
     * @api private
     */

    BinaryReconstructor.prototype.takeBinaryData = function(binData) {
        this.buffers.push(binData);
        if (this.buffers.length == this.reconPack.attachments) { // done with buffer list
            var packet = binary.reconstructPacket(this.reconPack, this.buffers);
            this.finishedReconstruction();
            return packet;
        }
        return null;
    };

    /**
     * Cleans up binary packet reconstruction variables.
     *
     * @api private
     */

    BinaryReconstructor.prototype.finishedReconstruction = function() {
        this.reconPack = null;
        this.buffers = [];
    };

    function error(data){
        return {
            type: exports.ERROR,
            data: 'parser error'
        };
    }

},{"./binary":45,"./is-buffer":47,"component-emitter":9,"debug":10,"isarray":48,"json3":49}],47:[function(_dereq_,module,exports){
    (function (global){

        module.exports = isBuf;

        /**
         * Returns true if obj is a buffer or an arraybuffer.
         *
         * @api private
         */

        function isBuf(obj) {
            return (global.Buffer && global.Buffer.isBuffer(obj)) ||
                (global.ArrayBuffer && obj instanceof ArrayBuffer);
        }

    }).call(this,typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],48:[function(_dereq_,module,exports){
    module.exports=_dereq_(32)
},{}],49:[function(_dereq_,module,exports){
    /*! JSON v3.2.6 | http://bestiejs.github.io/json3 | Copyright 2012-2013, Kit Cambridge | http://kit.mit-license.org */
    ;(function (window) {
        // Convenience aliases.
        var getClass = {}.toString, isProperty, forEach, undef;

        // Detect the `define` function exposed by asynchronous module loaders. The
        // strict `define` check is necessary for compatibility with `r.js`.
        var isLoader = typeof define === "function" && define.amd;

        // Detect native implementations.
        var nativeJSON = typeof JSON == "object" && JSON;

        // Set up the JSON 3 namespace, preferring the CommonJS `exports` object if
        // available.
        var JSON3 = typeof exports == "object" && exports && !exports.nodeType && exports;

        if (JSON3 && nativeJSON) {
            // Explicitly delegate to the native `stringify` and `parse`
            // implementations in CommonJS environments.
            JSON3.stringify = nativeJSON.stringify;
            JSON3.parse = nativeJSON.parse;
        } else {
            // Export for web browsers, JavaScript engines, and asynchronous module
            // loaders, using the global `JSON` object if available.
            JSON3 = window.JSON = nativeJSON || {};
        }

        // Test the `Date#getUTC*` methods. Based on work by @Yaffle.
        var isExtended = new Date(-3509827334573292);
        try {
            // The `getUTCFullYear`, `Month`, and `Date` methods return nonsensical
            // results for certain dates in Opera >= 10.53.
            isExtended = isExtended.getUTCFullYear() == -109252 && isExtended.getUTCMonth() === 0 && isExtended.getUTCDate() === 1 &&
                // Safari < 2.0.2 stores the internal millisecond time value correctly,
                // but clips the values returned by the date methods to the range of
                // signed 32-bit integers ([-2 ** 31, 2 ** 31 - 1]).
                isExtended.getUTCHours() == 10 && isExtended.getUTCMinutes() == 37 && isExtended.getUTCSeconds() == 6 && isExtended.getUTCMilliseconds() == 708;
        } catch (exception) {}

        // Internal: Determines whether the native `JSON.stringify` and `parse`
        // implementations are spec-compliant. Based on work by Ken Snyder.
        function has(name) {
            if (has[name] !== undef) {
                // Return cached feature test result.
                return has[name];
            }

            var isSupported;
            if (name == "bug-string-char-index") {
                // IE <= 7 doesn't support accessing string characters using square
                // bracket notation. IE 8 only supports this for primitives.
                isSupported = "a"[0] != "a";
            } else if (name == "json") {
                // Indicates whether both `JSON.stringify` and `JSON.parse` are
                // supported.
                isSupported = has("json-stringify") && has("json-parse");
            } else {
                var value, serialized = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
                // Test `JSON.stringify`.
                if (name == "json-stringify") {
                    var stringify = JSON3.stringify, stringifySupported = typeof stringify == "function" && isExtended;
                    if (stringifySupported) {
                        // A test function object with a custom `toJSON` method.
                        (value = function () {
                            return 1;
                        }).toJSON = value;
                        try {
                            stringifySupported =
                                // Firefox 3.1b1 and b2 serialize string, number, and boolean
                                // primitives as object literals.
                                stringify(0) === "0" &&
                                // FF 3.1b1, b2, and JSON 2 serialize wrapped primitives as object
                                // literals.
                                stringify(new Number()) === "0" &&
                                stringify(new String()) == '""' &&
                                // FF 3.1b1, 2 throw an error if the value is `null`, `undefined`, or
                                // does not define a canonical JSON representation (this applies to
                                // objects with `toJSON` properties as well, *unless* they are nested
                                // within an object or array).
                                stringify(getClass) === undef &&
                                // IE 8 serializes `undefined` as `"undefined"`. Safari <= 5.1.7 and
                                // FF 3.1b3 pass this test.
                                stringify(undef) === undef &&
                                // Safari <= 5.1.7 and FF 3.1b3 throw `Error`s and `TypeError`s,
                                // respectively, if the value is omitted entirely.
                                stringify() === undef &&
                                // FF 3.1b1, 2 throw an error if the given value is not a number,
                                // string, array, object, Boolean, or `null` literal. This applies to
                                // objects with custom `toJSON` methods as well, unless they are nested
                                // inside object or array literals. YUI 3.0.0b1 ignores custom `toJSON`
                                // methods entirely.
                                stringify(value) === "1" &&
                                stringify([value]) == "[1]" &&
                                // Prototype <= 1.6.1 serializes `[undefined]` as `"[]"` instead of
                                // `"[null]"`.
                                stringify([undef]) == "[null]" &&
                                // YUI 3.0.0b1 fails to serialize `null` literals.
                                stringify(null) == "null" &&
                                // FF 3.1b1, 2 halts serialization if an array contains a function:
                                // `[1, true, getClass, 1]` serializes as "[1,true,],". FF 3.1b3
                                // elides non-JSON values from objects and arrays, unless they
                                // define custom `toJSON` methods.
                                stringify([undef, getClass, null]) == "[null,null,null]" &&
                                // Simple serialization test. FF 3.1b1 uses Unicode escape sequences
                                // where character escape codes are expected (e.g., `\b` => `\u0008`).
                                stringify({ "a": [value, true, false, null, "\x00\b\n\f\r\t"] }) == serialized &&
                                // FF 3.1b1 and b2 ignore the `filter` and `width` arguments.
                                stringify(null, value) === "1" &&
                                stringify([1, 2], null, 1) == "[\n 1,\n 2\n]" &&
                                // JSON 2, Prototype <= 1.7, and older WebKit builds incorrectly
                                // serialize extended years.
                                stringify(new Date(-8.64e15)) == '"-271821-04-20T00:00:00.000Z"' &&
                                // The milliseconds are optional in ES 5, but required in 5.1.
                                stringify(new Date(8.64e15)) == '"+275760-09-13T00:00:00.000Z"' &&
                                // Firefox <= 11.0 incorrectly serializes years prior to 0 as negative
                                // four-digit years instead of six-digit years. Credits: @Yaffle.
                                stringify(new Date(-621987552e5)) == '"-000001-01-01T00:00:00.000Z"' &&
                                // Safari <= 5.1.5 and Opera >= 10.53 incorrectly serialize millisecond
                                // values less than 1000. Credits: @Yaffle.
                                stringify(new Date(-1)) == '"1969-12-31T23:59:59.999Z"';
                        } catch (exception) {
                            stringifySupported = false;
                        }
                    }
                    isSupported = stringifySupported;
                }
                // Test `JSON.parse`.
                if (name == "json-parse") {
                    var parse = JSON3.parse;
                    if (typeof parse == "function") {
                        try {
                            // FF 3.1b1, b2 will throw an exception if a bare literal is provided.
                            // Conforming implementations should also coerce the initial argument to
                            // a string prior to parsing.
                            if (parse("0") === 0 && !parse(false)) {
                                // Simple parsing test.
                                value = parse(serialized);
                                var parseSupported = value["a"].length == 5 && value["a"][0] === 1;
                                if (parseSupported) {
                                    try {
                                        // Safari <= 5.1.2 and FF 3.1b1 allow unescaped tabs in strings.
                                        parseSupported = !parse('"\t"');
                                    } catch (exception) {}
                                    if (parseSupported) {
                                        try {
                                            // FF 4.0 and 4.0.1 allow leading `+` signs and leading
                                            // decimal points. FF 4.0, 4.0.1, and IE 9-10 also allow
                                            // certain octal literals.
                                            parseSupported = parse("01") !== 1;
                                        } catch (exception) {}
                                    }
                                    if (parseSupported) {
                                        try {
                                            // FF 4.0, 4.0.1, and Rhino 1.7R3-R4 allow trailing decimal
                                            // points. These environments, along with FF 3.1b1 and 2,
                                            // also allow trailing commas in JSON objects and arrays.
                                            parseSupported = parse("1.") !== 1;
                                        } catch (exception) {}
                                    }
                                }
                            }
                        } catch (exception) {
                            parseSupported = false;
                        }
                    }
                    isSupported = parseSupported;
                }
            }
            return has[name] = !!isSupported;
        }

        if (!has("json")) {
            // Common `[[Class]]` name aliases.
            var functionClass = "[object Function]";
            var dateClass = "[object Date]";
            var numberClass = "[object Number]";
            var stringClass = "[object String]";
            var arrayClass = "[object Array]";
            var booleanClass = "[object Boolean]";

            // Detect incomplete support for accessing string characters by index.
            var charIndexBuggy = has("bug-string-char-index");

            // Define additional utility methods if the `Date` methods are buggy.
            if (!isExtended) {
                var floor = Math.floor;
                // A mapping between the months of the year and the number of days between
                // January 1st and the first of the respective month.
                var Months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
                // Internal: Calculates the number of days between the Unix epoch and the
                // first day of the given month.
                var getDay = function (year, month) {
                    return Months[month] + 365 * (year - 1970) + floor((year - 1969 + (month = +(month > 1))) / 4) - floor((year - 1901 + month) / 100) + floor((year - 1601 + month) / 400);
                };
            }

            // Internal: Determines if a property is a direct property of the given
            // object. Delegates to the native `Object#hasOwnProperty` method.
            if (!(isProperty = {}.hasOwnProperty)) {
                isProperty = function (property) {
                    var members = {}, constructor;
                    if ((members.__proto__ = null, members.__proto__ = {
                        // The *proto* property cannot be set multiple times in recent
                        // versions of Firefox and SeaMonkey.
                        "toString": 1
                    }, members).toString != getClass) {
                        // Safari <= 2.0.3 doesn't implement `Object#hasOwnProperty`, but
                        // supports the mutable *proto* property.
                        isProperty = function (property) {
                            // Capture and break the object's prototype chain (see section 8.6.2
                            // of the ES 5.1 spec). The parenthesized expression prevents an
                            // unsafe transformation by the Closure Compiler.
                            var original = this.__proto__, result = property in (this.__proto__ = null, this);
                            // Restore the original prototype chain.
                            this.__proto__ = original;
                            return result;
                        };
                    } else {
                        // Capture a reference to the top-level `Object` constructor.
                        constructor = members.constructor;
                        // Use the `constructor` property to simulate `Object#hasOwnProperty` in
                        // other environments.
                        isProperty = function (property) {
                            var parent = (this.constructor || constructor).prototype;
                            return property in this && !(property in parent && this[property] === parent[property]);
                        };
                    }
                    members = null;
                    return isProperty.call(this, property);
                };
            }

            // Internal: A set of primitive types used by `isHostType`.
            var PrimitiveTypes = {
                'boolean': 1,
                'number': 1,
                'string': 1,
                'undefined': 1
            };

            // Internal: Determines if the given object `property` value is a
            // non-primitive.
            var isHostType = function (object, property) {
                var type = typeof object[property];
                return type == 'object' ? !!object[property] : !PrimitiveTypes[type];
            };

            // Internal: Normalizes the `for...in` iteration algorithm across
            // environments. Each enumerated key is yielded to a `callback` function.
            forEach = function (object, callback) {
                var size = 0, Properties, members, property;

                // Tests for bugs in the current environment's `for...in` algorithm. The
                // `valueOf` property inherits the non-enumerable flag from
                // `Object.prototype` in older versions of IE, Netscape, and Mozilla.
                (Properties = function () {
                    this.valueOf = 0;
                }).prototype.valueOf = 0;

                // Iterate over a new instance of the `Properties` class.
                members = new Properties();
                for (property in members) {
                    // Ignore all properties inherited from `Object.prototype`.
                    if (isProperty.call(members, property)) {
                        size++;
                    }
                }
                Properties = members = null;

                // Normalize the iteration algorithm.
                if (!size) {
                    // A list of non-enumerable properties inherited from `Object.prototype`.
                    members = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"];
                    // IE <= 8, Mozilla 1.0, and Netscape 6.2 ignore shadowed non-enumerable
                    // properties.
                    forEach = function (object, callback) {
                        var isFunction = getClass.call(object) == functionClass, property, length;
                        var hasProperty = !isFunction && typeof object.constructor != 'function' && isHostType(object, 'hasOwnProperty') ? object.hasOwnProperty : isProperty;
                        for (property in object) {
                            // Gecko <= 1.0 enumerates the `prototype` property of functions under
                            // certain conditions; IE does not.
                            if (!(isFunction && property == "prototype") && hasProperty.call(object, property)) {
                                callback(property);
                            }
                        }
                        // Manually invoke the callback for each non-enumerable property.
                        for (length = members.length; property = members[--length]; hasProperty.call(object, property) && callback(property));
                    };
                } else if (size == 2) {
                    // Safari <= 2.0.4 enumerates shadowed properties twice.
                    forEach = function (object, callback) {
                        // Create a set of iterated properties.
                        var members = {}, isFunction = getClass.call(object) == functionClass, property;
                        for (property in object) {
                            // Store each property name to prevent double enumeration. The
                            // `prototype` property of functions is not enumerated due to cross-
                            // environment inconsistencies.
                            if (!(isFunction && property == "prototype") && !isProperty.call(members, property) && (members[property] = 1) && isProperty.call(object, property)) {
                                callback(property);
                            }
                        }
                    };
                } else {
                    // No bugs detected; use the standard `for...in` algorithm.
                    forEach = function (object, callback) {
                        var isFunction = getClass.call(object) == functionClass, property, isConstructor;
                        for (property in object) {
                            if (!(isFunction && property == "prototype") && isProperty.call(object, property) && !(isConstructor = property === "constructor")) {
                                callback(property);
                            }
                        }
                        // Manually invoke the callback for the `constructor` property due to
                        // cross-environment inconsistencies.
                        if (isConstructor || isProperty.call(object, (property = "constructor"))) {
                            callback(property);
                        }
                    };
                }
                return forEach(object, callback);
            };

            // Public: Serializes a JavaScript `value` as a JSON string. The optional
            // `filter` argument may specify either a function that alters how object and
            // array members are serialized, or an array of strings and numbers that
            // indicates which properties should be serialized. The optional `width`
            // argument may be either a string or number that specifies the indentation
            // level of the output.
            if (!has("json-stringify")) {
                // Internal: A map of control characters and their escaped equivalents.
                var Escapes = {
                    92: "\\\\",
                    34: '\\"',
                    8: "\\b",
                    12: "\\f",
                    10: "\\n",
                    13: "\\r",
                    9: "\\t"
                };

                // Internal: Converts `value` into a zero-padded string such that its
                // length is at least equal to `width`. The `width` must be <= 6.
                var leadingZeroes = "000000";
                var toPaddedString = function (width, value) {
                    // The `|| 0` expression is necessary to work around a bug in
                    // Opera <= 7.54u2 where `0 == -0`, but `String(-0) !== "0"`.
                    return (leadingZeroes + (value || 0)).slice(-width);
                };

                // Internal: Double-quotes a string `value`, replacing all ASCII control
                // characters (characters with code unit values between 0 and 31) with
                // their escaped equivalents. This is an implementation of the
                // `Quote(value)` operation defined in ES 5.1 section 15.12.3.
                var unicodePrefix = "\\u00";
                var quote = function (value) {
                    var result = '"', index = 0, length = value.length, isLarge = length > 10 && charIndexBuggy, symbols;
                    if (isLarge) {
                        symbols = value.split("");
                    }
                    for (; index < length; index++) {
                        var charCode = value.charCodeAt(index);
                        // If the character is a control character, append its Unicode or
                        // shorthand escape sequence; otherwise, append the character as-is.
                        switch (charCode) {
                            case 8: case 9: case 10: case 12: case 13: case 34: case 92:
                            result += Escapes[charCode];
                            break;
                            default:
                                if (charCode < 32) {
                                    result += unicodePrefix + toPaddedString(2, charCode.toString(16));
                                    break;
                                }
                                result += isLarge ? symbols[index] : charIndexBuggy ? value.charAt(index) : value[index];
                        }
                    }
                    return result + '"';
                };

                // Internal: Recursively serializes an object. Implements the
                // `Str(key, holder)`, `JO(value)`, and `JA(value)` operations.
                var serialize = function (property, object, callback, properties, whitespace, indentation, stack) {
                    var value, className, year, month, date, time, hours, minutes, seconds, milliseconds, results, element, index, length, prefix, result;
                    try {
                        // Necessary for host object support.
                        value = object[property];
                    } catch (exception) {}
                    if (typeof value == "object" && value) {
                        className = getClass.call(value);
                        if (className == dateClass && !isProperty.call(value, "toJSON")) {
                            if (value > -1 / 0 && value < 1 / 0) {
                                // Dates are serialized according to the `Date#toJSON` method
                                // specified in ES 5.1 section 15.9.5.44. See section 15.9.1.15
                                // for the ISO 8601 date time string format.
                                if (getDay) {
                                    // Manually compute the year, month, date, hours, minutes,
                                    // seconds, and milliseconds if the `getUTC*` methods are
                                    // buggy. Adapted from @Yaffle's `date-shim` project.
                                    date = floor(value / 864e5);
                                    for (year = floor(date / 365.2425) + 1970 - 1; getDay(year + 1, 0) <= date; year++);
                                    for (month = floor((date - getDay(year, 0)) / 30.42); getDay(year, month + 1) <= date; month++);
                                    date = 1 + date - getDay(year, month);
                                    // The `time` value specifies the time within the day (see ES
                                    // 5.1 section 15.9.1.2). The formula `(A % B + B) % B` is used
                                    // to compute `A modulo B`, as the `%` operator does not
                                    // correspond to the `modulo` operation for negative numbers.
                                    time = (value % 864e5 + 864e5) % 864e5;
                                    // The hours, minutes, seconds, and milliseconds are obtained by
                                    // decomposing the time within the day. See section 15.9.1.10.
                                    hours = floor(time / 36e5) % 24;
                                    minutes = floor(time / 6e4) % 60;
                                    seconds = floor(time / 1e3) % 60;
                                    milliseconds = time % 1e3;
                                } else {
                                    year = value.getUTCFullYear();
                                    month = value.getUTCMonth();
                                    date = value.getUTCDate();
                                    hours = value.getUTCHours();
                                    minutes = value.getUTCMinutes();
                                    seconds = value.getUTCSeconds();
                                    milliseconds = value.getUTCMilliseconds();
                                }
                                // Serialize extended years correctly.
                                value = (year <= 0 || year >= 1e4 ? (year < 0 ? "-" : "+") + toPaddedString(6, year < 0 ? -year : year) : toPaddedString(4, year)) +
                                    "-" + toPaddedString(2, month + 1) + "-" + toPaddedString(2, date) +
                                    // Months, dates, hours, minutes, and seconds should have two
                                    // digits; milliseconds should have three.
                                    "T" + toPaddedString(2, hours) + ":" + toPaddedString(2, minutes) + ":" + toPaddedString(2, seconds) +
                                    // Milliseconds are optional in ES 5.0, but required in 5.1.
                                    "." + toPaddedString(3, milliseconds) + "Z";
                            } else {
                                value = null;
                            }
                        } else if (typeof value.toJSON == "function" && ((className != numberClass && className != stringClass && className != arrayClass) || isProperty.call(value, "toJSON"))) {
                            // Prototype <= 1.6.1 adds non-standard `toJSON` methods to the
                            // `Number`, `String`, `Date`, and `Array` prototypes. JSON 3
                            // ignores all `toJSON` methods on these objects unless they are
                            // defined directly on an instance.
                            value = value.toJSON(property);
                        }
                    }
                    if (callback) {
                        // If a replacement function was provided, call it to obtain the value
                        // for serialization.
                        value = callback.call(object, property, value);
                    }
                    if (value === null) {
                        return "null";
                    }
                    className = getClass.call(value);
                    if (className == booleanClass) {
                        // Booleans are represented literally.
                        return "" + value;
                    } else if (className == numberClass) {
                        // JSON numbers must be finite. `Infinity` and `NaN` are serialized as
                        // `"null"`.
                        return value > -1 / 0 && value < 1 / 0 ? "" + value : "null";
                    } else if (className == stringClass) {
                        // Strings are double-quoted and escaped.
                        return quote("" + value);
                    }
                    // Recursively serialize objects and arrays.
                    if (typeof value == "object") {
                        // Check for cyclic structures. This is a linear search; performance
                        // is inversely proportional to the number of unique nested objects.
                        for (length = stack.length; length--;) {
                            if (stack[length] === value) {
                                // Cyclic structures cannot be serialized by `JSON.stringify`.
                                throw TypeError();
                            }
                        }
                        // Add the object to the stack of traversed objects.
                        stack.push(value);
                        results = [];
                        // Save the current indentation level and indent one additional level.
                        prefix = indentation;
                        indentation += whitespace;
                        if (className == arrayClass) {
                            // Recursively serialize array elements.
                            for (index = 0, length = value.length; index < length; index++) {
                                element = serialize(index, value, callback, properties, whitespace, indentation, stack);
                                results.push(element === undef ? "null" : element);
                            }
                            result = results.length ? (whitespace ? "[\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "]" : ("[" + results.join(",") + "]")) : "[]";
                        } else {
                            // Recursively serialize object members. Members are selected from
                            // either a user-specified list of property names, or the object
                            // itself.
                            forEach(properties || value, function (property) {
                                var element = serialize(property, value, callback, properties, whitespace, indentation, stack);
                                if (element !== undef) {
                                    // According to ES 5.1 section 15.12.3: "If `gap` {whitespace}
                                    // is not the empty string, let `member` {quote(property) + ":"}
                                    // be the concatenation of `member` and the `space` character."
                                    // The "`space` character" refers to the literal space
                                    // character, not the `space` {width} argument provided to
                                    // `JSON.stringify`.
                                    results.push(quote(property) + ":" + (whitespace ? " " : "") + element);
                                }
                            });
                            result = results.length ? (whitespace ? "{\n" + indentation + results.join(",\n" + indentation) + "\n" + prefix + "}" : ("{" + results.join(",") + "}")) : "{}";
                        }
                        // Remove the object from the traversed object stack.
                        stack.pop();
                        return result;
                    }
                };

                // Public: `JSON.stringify`. See ES 5.1 section 15.12.3.
                JSON3.stringify = function (source, filter, width) {
                    var whitespace, callback, properties, className;
                    if (typeof filter == "function" || typeof filter == "object" && filter) {
                        if ((className = getClass.call(filter)) == functionClass) {
                            callback = filter;
                        } else if (className == arrayClass) {
                            // Convert the property names array into a makeshift set.
                            properties = {};
                            for (var index = 0, length = filter.length, value; index < length; value = filter[index++], ((className = getClass.call(value)), className == stringClass || className == numberClass) && (properties[value] = 1));
                        }
                    }
                    if (width) {
                        if ((className = getClass.call(width)) == numberClass) {
                            // Convert the `width` to an integer and create a string containing
                            // `width` number of space characters.
                            if ((width -= width % 1) > 0) {
                                for (whitespace = "", width > 10 && (width = 10); whitespace.length < width; whitespace += " ");
                            }
                        } else if (className == stringClass) {
                            whitespace = width.length <= 10 ? width : width.slice(0, 10);
                        }
                    }
                    // Opera <= 7.54u2 discards the values associated with empty string keys
                    // (`""`) only if they are used directly within an object member list
                    // (e.g., `!("" in { "": 1})`).
                    return serialize("", (value = {}, value[""] = source, value), callback, properties, whitespace, "", []);
                };
            }

            // Public: Parses a JSON source string.
            if (!has("json-parse")) {
                var fromCharCode = String.fromCharCode;

                // Internal: A map of escaped control characters and their unescaped
                // equivalents.
                var Unescapes = {
                    92: "\\",
                    34: '"',
                    47: "/",
                    98: "\b",
                    116: "\t",
                    110: "\n",
                    102: "\f",
                    114: "\r"
                };

                // Internal: Stores the parser state.
                var Index, Source;

                // Internal: Resets the parser state and throws a `SyntaxError`.
                var abort = function() {
                    Index = Source = null;
                    throw SyntaxError();
                };

                // Internal: Returns the next token, or `"$"` if the parser has reached
                // the end of the source string. A token may be a string, number, `null`
                // literal, or Boolean literal.
                var lex = function () {
                    var source = Source, length = source.length, value, begin, position, isSigned, charCode;
                    while (Index < length) {
                        charCode = source.charCodeAt(Index);
                        switch (charCode) {
                            case 9: case 10: case 13: case 32:
                            // Skip whitespace tokens, including tabs, carriage returns, line
                            // feeds, and space characters.
                            Index++;
                            break;
                            case 123: case 125: case 91: case 93: case 58: case 44:
                            // Parse a punctuator token (`{`, `}`, `[`, `]`, `:`, or `,`) at
                            // the current position.
                            value = charIndexBuggy ? source.charAt(Index) : source[Index];
                            Index++;
                            return value;
                            case 34:
                                // `"` delimits a JSON string; advance to the next character and
                                // begin parsing the string. String tokens are prefixed with the
                                // sentinel `@` character to distinguish them from punctuators and
                                // end-of-string tokens.
                                for (value = "@", Index++; Index < length;) {
                                    charCode = source.charCodeAt(Index);
                                    if (charCode < 32) {
                                        // Unescaped ASCII control characters (those with a code unit
                                        // less than the space character) are not permitted.
                                        abort();
                                    } else if (charCode == 92) {
                                        // A reverse solidus (`\`) marks the beginning of an escaped
                                        // control character (including `"`, `\`, and `/`) or Unicode
                                        // escape sequence.
                                        charCode = source.charCodeAt(++Index);
                                        switch (charCode) {
                                            case 92: case 34: case 47: case 98: case 116: case 110: case 102: case 114:
                                            // Revive escaped control characters.
                                            value += Unescapes[charCode];
                                            Index++;
                                            break;
                                            case 117:
                                                // `\u` marks the beginning of a Unicode escape sequence.
                                                // Advance to the first character and validate the
                                                // four-digit code point.
                                                begin = ++Index;
                                                for (position = Index + 4; Index < position; Index++) {
                                                    charCode = source.charCodeAt(Index);
                                                    // A valid sequence comprises four hexdigits (case-
                                                    // insensitive) that form a single hexadecimal value.
                                                    if (!(charCode >= 48 && charCode <= 57 || charCode >= 97 && charCode <= 102 || charCode >= 65 && charCode <= 70)) {
                                                        // Invalid Unicode escape sequence.
                                                        abort();
                                                    }
                                                }
                                                // Revive the escaped character.
                                                value += fromCharCode("0x" + source.slice(begin, Index));
                                                break;
                                            default:
                                                // Invalid escape sequence.
                                                abort();
                                        }
                                    } else {
                                        if (charCode == 34) {
                                            // An unescaped double-quote character marks the end of the
                                            // string.
                                            break;
                                        }
                                        charCode = source.charCodeAt(Index);
                                        begin = Index;
                                        // Optimize for the common case where a string is valid.
                                        while (charCode >= 32 && charCode != 92 && charCode != 34) {
                                            charCode = source.charCodeAt(++Index);
                                        }
                                        // Append the string as-is.
                                        value += source.slice(begin, Index);
                                    }
                                }
                                if (source.charCodeAt(Index) == 34) {
                                    // Advance to the next character and return the revived string.
                                    Index++;
                                    return value;
                                }
                                // Unterminated string.
                                abort();
                            default:
                                // Parse numbers and literals.
                                begin = Index;
                                // Advance past the negative sign, if one is specified.
                                if (charCode == 45) {
                                    isSigned = true;
                                    charCode = source.charCodeAt(++Index);
                                }
                                // Parse an integer or floating-point value.
                                if (charCode >= 48 && charCode <= 57) {
                                    // Leading zeroes are interpreted as octal literals.
                                    if (charCode == 48 && ((charCode = source.charCodeAt(Index + 1)), charCode >= 48 && charCode <= 57)) {
                                        // Illegal octal literal.
                                        abort();
                                    }
                                    isSigned = false;
                                    // Parse the integer component.
                                    for (; Index < length && ((charCode = source.charCodeAt(Index)), charCode >= 48 && charCode <= 57); Index++);
                                    // Floats cannot contain a leading decimal point; however, this
                                    // case is already accounted for by the parser.
                                    if (source.charCodeAt(Index) == 46) {
                                        position = ++Index;
                                        // Parse the decimal component.
                                        for (; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                                        if (position == Index) {
                                            // Illegal trailing decimal.
                                            abort();
                                        }
                                        Index = position;
                                    }
                                    // Parse exponents. The `e` denoting the exponent is
                                    // case-insensitive.
                                    charCode = source.charCodeAt(Index);
                                    if (charCode == 101 || charCode == 69) {
                                        charCode = source.charCodeAt(++Index);
                                        // Skip past the sign following the exponent, if one is
                                        // specified.
                                        if (charCode == 43 || charCode == 45) {
                                            Index++;
                                        }
                                        // Parse the exponential component.
                                        for (position = Index; position < length && ((charCode = source.charCodeAt(position)), charCode >= 48 && charCode <= 57); position++);
                                        if (position == Index) {
                                            // Illegal empty exponent.
                                            abort();
                                        }
                                        Index = position;
                                    }
                                    // Coerce the parsed value to a JavaScript number.
                                    return +source.slice(begin, Index);
                                }
                                // A negative sign may only precede numbers.
                                if (isSigned) {
                                    abort();
                                }
                                // `true`, `false`, and `null` literals.
                                if (source.slice(Index, Index + 4) == "true") {
                                    Index += 4;
                                    return true;
                                } else if (source.slice(Index, Index + 5) == "false") {
                                    Index += 5;
                                    return false;
                                } else if (source.slice(Index, Index + 4) == "null") {
                                    Index += 4;
                                    return null;
                                }
                                // Unrecognized token.
                                abort();
                        }
                    }
                    // Return the sentinel `$` character if the parser has reached the end
                    // of the source string.
                    return "$";
                };

                // Internal: Parses a JSON `value` token.
                var get = function (value) {
                    var results, hasMembers;
                    if (value == "$") {
                        // Unexpected end of input.
                        abort();
                    }
                    if (typeof value == "string") {
                        if ((charIndexBuggy ? value.charAt(0) : value[0]) == "@") {
                            // Remove the sentinel `@` character.
                            return value.slice(1);
                        }
                        // Parse object and array literals.
                        if (value == "[") {
                            // Parses a JSON array, returning a new JavaScript array.
                            results = [];
                            for (;; hasMembers || (hasMembers = true)) {
                                value = lex();
                                // A closing square bracket marks the end of the array literal.
                                if (value == "]") {
                                    break;
                                }
                                // If the array literal contains elements, the current token
                                // should be a comma separating the previous element from the
                                // next.
                                if (hasMembers) {
                                    if (value == ",") {
                                        value = lex();
                                        if (value == "]") {
                                            // Unexpected trailing `,` in array literal.
                                            abort();
                                        }
                                    } else {
                                        // A `,` must separate each array element.
                                        abort();
                                    }
                                }
                                // Elisions and leading commas are not permitted.
                                if (value == ",") {
                                    abort();
                                }
                                results.push(get(value));
                            }
                            return results;
                        } else if (value == "{") {
                            // Parses a JSON object, returning a new JavaScript object.
                            results = {};
                            for (;; hasMembers || (hasMembers = true)) {
                                value = lex();
                                // A closing curly brace marks the end of the object literal.
                                if (value == "}") {
                                    break;
                                }
                                // If the object literal contains members, the current token
                                // should be a comma separator.
                                if (hasMembers) {
                                    if (value == ",") {
                                        value = lex();
                                        if (value == "}") {
                                            // Unexpected trailing `,` in object literal.
                                            abort();
                                        }
                                    } else {
                                        // A `,` must separate each object member.
                                        abort();
                                    }
                                }
                                // Leading commas are not permitted, object property names must be
                                // double-quoted strings, and a `:` must separate each property
                                // name and value.
                                if (value == "," || typeof value != "string" || (charIndexBuggy ? value.charAt(0) : value[0]) != "@" || lex() != ":") {
                                    abort();
                                }
                                results[value.slice(1)] = get(lex());
                            }
                            return results;
                        }
                        // Unexpected token encountered.
                        abort();
                    }
                    return value;
                };

                // Internal: Updates a traversed object member.
                var update = function(source, property, callback) {
                    var element = walk(source, property, callback);
                    if (element === undef) {
                        delete source[property];
                    } else {
                        source[property] = element;
                    }
                };

                // Internal: Recursively traverses a parsed JSON object, invoking the
                // `callback` function for each value. This is an implementation of the
                // `Walk(holder, name)` operation defined in ES 5.1 section 15.12.2.
                var walk = function (source, property, callback) {
                    var value = source[property], length;
                    if (typeof value == "object" && value) {
                        // `forEach` can't be used to traverse an array in Opera <= 8.54
                        // because its `Object#hasOwnProperty` implementation returns `false`
                        // for array indices (e.g., `![1, 2, 3].hasOwnProperty("0")`).
                        if (getClass.call(value) == arrayClass) {
                            for (length = value.length; length--;) {
                                update(value, length, callback);
                            }
                        } else {
                            forEach(value, function (property) {
                                update(value, property, callback);
                            });
                        }
                    }
                    return callback.call(source, property, value);
                };

                // Public: `JSON.parse`. See ES 5.1 section 15.12.2.
                JSON3.parse = function (source, callback) {
                    var result, value;
                    Index = 0;
                    Source = "" + source;
                    result = get(lex());
                    // If a JSON string contains multiple tokens, it is invalid.
                    if (lex() != "$") {
                        abort();
                    }
                    // Reset the parser state.
                    Index = Source = null;
                    return callback && getClass.call(callback) == functionClass ? walk((value = {}, value[""] = result, value), "", callback) : result;
                };
            }
        }

        // Export for asynchronous module loaders.
        if (isLoader) {
            define(function () {
                return JSON3;
            });
        }
    }(this));

},{}],50:[function(_dereq_,module,exports){
    module.exports = toArray

    function toArray(list, index) {
        var array = []

        index = index || 0

        for (var i = index || 0; i < list.length; i++) {
            array[i - index] = list[i]
        }

        return array
    }

},{}]},{},[1])
(1)
});
