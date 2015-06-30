module.exports = (function() {
    var mongoose = require('mongoose'),
        Schema = mongoose.Schema;

    var UserSchema = Schema({
        userid: {type:String, unique:true, required: true},//phone
        password: {type:String, required: true},
        username: {type:String},
        sign: {type:String},
        head: {type:Boolean, default:false},
        groups: {type:Array, default:[]}
    }, {
        collection: 'users'
    });

    UserSchema.statics._add = function(obj, callback) {
        var user = this(obj);
        user.save(function(err) {
            var error;
            if (err && err.code == 11000) {
                var name = err.err.replace(/.*users.\$([a-z]+).*/, '$1');
                if (name == 'username') {
                    error = app.error.USER_NAME_DUPLICATE;
                } else if (name == 'userid') {
                    error = app.error.USER_ID_DUPLICATE;
                }
            } else if (err) {
                error = app.error.UNKNOWN_ERROR;
            }
            callback(error);
        });
    };
    UserSchema.statics._count = function(callback) {
        this.count(function (err, count) {
            callback(count);
        });
    };
    UserSchema.statics._updateGroup = function(updateusers, name, users, type) {
        for (var i=0,len=updateusers.length; i<len; i++) {
            var userid = updateusers[i];
            this.findOne({userid:userid}, function(err, doc) {
                if (doc) {
                    var groups = doc.groups;
                    _.map(groups, function(obj) {
                        if (obj.name == name) {
                            obj.users = users;
                            if (type != null) {
                                obj.type = type;
                            }
                        }
                        return obj;
                    });
                    doc.markModified('groups');
                    doc.save();
                }
            });
        }
    };
    UserSchema.statics._joinGroup = function(userid, name, creator, type, users) {
        this.findOneAndUpdate({userid:userid}, {$push:{groups:{name:name, creator:creator, type:type, users:users}}}, function(){});
    };
    UserSchema.statics._leaveGroup = function(userid, name) {
        this.findOneAndUpdate({userid:userid}, {$pull:{groups:{name:name}}}, function(){});
    };
    UserSchema.statics._updateUserInfo = function(userid, obj, callback) {
        this.findOneAndUpdate({userid:userid}, obj, function(){
            callback();
        });
    };

    return mongoose.model('User', UserSchema);
})();


