(function() {
    var _self;
    global._ = require('underscore');
    var express = require('express')();

    function App() {
        _self = this;
        var modulePath = __dirname+'/modules/';
        _self.server = require('http').Server(express);
        _self.io = require('socket.io')(_self.server);
        _self.config = require(__dirname+'/config.js');
        _self.error = require(modulePath+'utils/error');
        _self.console = require(modulePath+'utils/console');
        _self.socketMgr = require(modulePath+'socketMgr/socketMgr');
        _self.expressMgr = require(modulePath+'socketMgr/expressMgr');
        _self.router = require(modulePath+'socketMgr/router');
        _self.userMgr = require(modulePath+'userMgr/userMgr');
        _self.onlineUserMgr = require(modulePath+'userMgr/onlineUserMgr');
        _self.notifyMgr = require(modulePath+'userMgr/notifyMgr');
        _self.messageMgr = require(modulePath+'messageMgr/messageMgr');
        _self.groupMgr = require(modulePath+'groupMgr/groupMgr');
        _self.callMgr = require(modulePath+'callMgr/callMgr');
        _self.db = require(modulePath+'mongodbMgr/mongodbMgr');
    }

    App.prototype.start = function() {
        app.db.start('mongodb://localhost/MRPCHAT', function() {
            app.expressMgr.start(express, function() {
                app.socketMgr.start(function() {
                    _self.server.listen(8000, function(){
                        console.log("listen on port 8000");
                    });
                });
            });
        })
    };

    app = new App();
    app.start();
})();

