module.exports = (function() {
    var _self;

    function MongodbMgr() {
        _self = this;
         var modelsPath = __dirname+'/models/';
        _self.User = require(modelsPath+'User');
        _self.Logger = require(modelsPath+'Logger');
        _self.OfflineMessage = require(modelsPath+'OfflineMessage');
        _self.Message = require(modelsPath+'Message');
        _self.Group = require(modelsPath+'Group');
        _self.UserInfo = require(modelsPath+'UserInfo');
        _self.UserNotify = require(modelsPath+'UserNotify');
    }

    MongodbMgr.prototype.start = function(dburl, callback) {
        var mongoose = require('mongoose');
        var db = mongoose.connect(dburl).connection;
        db.once('open', function() {
            console.log('mongo working');
            callback();
        }).on('error', function() {
            console.log('connect error');
        });
    }

    return new MongodbMgr();
})();


