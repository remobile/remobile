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