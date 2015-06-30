module.exports = (function() {
    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    var GroupSchema = Schema({
        name: {type:String, unique:true, required: true},
        creator: {type:String, required: true},
        users: {type:Array, required:true},
        type: {type:Number, default:0}
    }, {
        collection: 'groups'
    });

    GroupSchema.statics._create = function(name, creator, users, type, callback) {
        var group = this({name:name, creator:creator, users:users, type:type});
        group.save(function(err){
            var error = null;
            if (err) {
                if (err.code == 11000) {
                    error = app.error.GROUP_NAME_DUPLICATE;
                } else {
                    error = app.error.UNKNOWN_ERROR;
                }
            }
            callback(error);
        });
    };
    GroupSchema.statics._modify = function(name, users, type, callback) {
        this.findOne({name:name}, function(err, doc){
            if (doc) {
                var oldusers = doc.users;
                doc.users = users;
                if (type != null) {
                    doc.type = type;
                }
                doc.save();
                callback(null, doc, oldusers);
            } else {
                callback(app.error.GROUP_NOT_EXIST);
            }
        });
    };
    GroupSchema.statics._remove = function(name, callback) {
        this.remove({name:name}, function() {
            callback();
        });
    };
    GroupSchema.statics._getList = function(name, creator, users, selfid, callback) {
        var obj = {type: 0};
        if (name) {
            obj.name = new RegExp('.*'+name+'.*', 'i');
        }
        if (creator) {
            obj.creator = creator;
        }
        this.find(obj,'-_id -__v', function(err, docs) {
            var ret = [];
            if (!users||!users.length) {
                for (var i=0,len=docs.length; i<len; i++) {
                    var doc = docs[i];
                    if (!_.contains(doc.users, selfid)) {
                        ret.push(doc);
                    }
                }
            } else {
                for (var i=0,len=docs.length; i<len; i++) {
                    var doc = docs[i];
                    if (!_.contains(doc.users, selfid) && _.intersection(users, doc.users).length) {
                        ret.push(doc);
                    }
                }
            }
            callback(ret);
        });
    };
    GroupSchema.statics._getInfo = function(name, callback) {
        this.findOne({name:name}, '-_id -__v', function(err, doc) {
            callback(doc);
        });
    };
    GroupSchema.statics._join = function(name, userid, callback) {
        this.findOne({name:name}, function(err, doc){
            if (doc) {
                var users = doc.users;
                var oldusers = _.union(users, null);
                if (users.indexOf(userid) == -1) {
                    users.push(userid);
                    doc.users = users;
                    doc.save();
                    callback(null, doc, oldusers);
                } else {
                    callback(app.error.GROUP_JOIN_MORE_TIMES);
                }
            } else {
                callback(app.error.GROUP_NOT_EXIST);
            }
        });
    };
    GroupSchema.statics._leave = function(name, userid, callback) {
        var update = {$pull:{users:userid}};
        this.findOneAndUpdate({name:name}, update, function(err, doc) {
            callback(doc);
        });
    };
    GroupSchema.statics._pullIn = function(name, userid, users, callback) {
        this.findOne({name:name, creator:userid}, function(err, doc) {
            if (!doc) {
                callback(app.error.GROUP_NOT_CREATOR);
            } else {
                var oldusers = doc.users;
                doc.users = _.union(doc.users, users);
                doc.save();
                callback(null, doc, oldusers);
            }
        });
    };
    GroupSchema.statics._fireOut = function(name, userid, users, callback) {
        this.findOne({name:name, creator:userid}, function(err, doc) {
            if (!doc) {
                callback(app.error.GROUP_NOT_CREATOR);
            } else {
                var oldusers = doc.users;
                doc.users = _.difference(doc.users, users);
                doc.save();
                callback(null, doc, oldusers);
            }
        });
    };

    return mongoose.model('Group', GroupSchema);
})();


