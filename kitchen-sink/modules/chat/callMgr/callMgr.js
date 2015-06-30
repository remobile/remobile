module.exports = (function() {
    "use strict";
    var _self;

    function CallMgr() {
        _self = this;
        _self.callid = localStorage.callid||1;
        //call type
        _self.AUDIO_TYPE = 0;
        _self.VIDEO_TYPE = 1;

        //call state
        _self.STATE_FREE = 0;    //next: STATE_CALLOUT STATE_CALLIN
        _self.STATE_CALLOUT = 1; //next: STATE_ERROR STATE_BUSY STATE_REFUSE STATE_CALLING STATE_DISCONNECT
        _self.STATE_CALLIN = 2;  //next: STATE_FREE STATE_CALLING STATE_DISCONNECT
        _self.STATE_CALLING = 3; //next: STATE_HANGUP STATE_DISCONNECT
        _self.STATE_BUSY = 4;    //next: STATE_FREE
        _self.STATE_REFUSE = 5;  //next: STATE_FREE
        _self.STATE_HANGUP = 6;  //next: STATE_FREE
        _self.STATE_ERROR = 7;  //next: STATE_FREE
        _self.STATE_DISCONNECT = 8;  //next: STATE_FREE

        _self.state = _self.STATE_FREE;
        _self.delay = 3000;
        _self.longdelay = 10000;
        _self.session = null;
        _self.time = {hour:0, minute:0, second:0};
    }

    CallMgr.prototype.parent = function(type) {
        if (type == _self.VIDEO_TYPE) {
            return app.videoCall;
        }
        return app.audioCall;
    };
    CallMgr.prototype.updateTime = function(callback) {
        var time = _self.time;
        var STATES = ['空闲中...', '拨号中...','电话呼入...', '通话中...', '对方正在通话中', '对方拒绝接听', '对方终止了电话',  '对方不在线', '断开了连接'];

        if (_self.state == _self.STATE_FREE) {
            return;
        }

        time.second++;
        if (time.second == 60) {
            time.second = 0;
            time.minute++;
            if (time.minute == 60) {
                time.minute = 0;
                time.hour++;
            }
        }
        var hour = time.hour;
        var minute = time.minute;
        var second = time.second;
        time = (hour<10?'0':'')+hour+':'+(minute<10?'0':'')+minute+':'+(second<10?'0':'')+second;
        callback(time, STATES[_self.state]);
        setTimeout(_self.updateTime, 1000, callback);
    };
    CallMgr.prototype.increaseCallId = function() {
        _self.callid++;
        if (!_self.callid) {
            _self.callid = 1;
        }
        localStorage.callid = _self.callid;
    };
    CallMgr.prototype.call = function(isInitiator, userid, type, callid) {
        console.log('calling to ' + userid + ', isInitiator: ' + isInitiator + ', type:' + type);
        var config = {
            isInitiator: isInitiator,
            turn: {
                host: 'turn:numb.viagenie.ca',
                username: 'webrtc@live.com',
                password: 'muazkh'
            },
            streams: {
                audio: true,
                video: type==_self.VIDEO_TYPE
            }
        };
        var session = new navigator.phonertc.Session(config);
        session.on('sendMessage', function (data) {
            app.emit('CALL_WEBRTC_SIGNAL_NFS', {
                userid: userid,
                type: type,
                callid: callid,
                data: JSON.stringify(data)
            });
        });
        session.on('answer', function () {
            console.log('he/she is answered');
            _self.parent(type).onSessionAnswer(userid, callid);
        });
        session.on('disconnect', function () {
            if (_self.state == _self.STATE_CALLOUT || _self.state == _self.STATE_CALLIN || _self.state == _self.STATE_CALLING ) {
                console.log('session disconnected');
                _self.parent(type).onPreCallHangupNotify(callid);
                app.utils.playRing(app.resource.aud_hangup);
                _self.state = _self.STATE_DISCONNECT;
                app.emit('CALL_HANGUP_RQ', {userid: userid, type: type, callid: callid});
                setTimeout(function() {
                    if (_self.state == _self.STATE_DISCONNECT) {
                        _self.parent(type).onCallHangupNotify(callid);
                        app.utils.stopRing();
                        _self.state = _self.STATE_FREE;
                    }
                }, _self.delay);
            }
            _self.session = null;
        });
        session.call();
        _self.session = session;
    };
    CallMgr.prototype.onCallWebrtcSignalNotify = function(obj) {
        console.log('onCallWebrtcSignalNotify', obj);
        var session = _self.session;
        session&&session.receiveMessage(JSON.parse(obj.data));
    };
    CallMgr.prototype.callOut = function(userid, type) {
        _self.time = {hour:0, minute:0, second:0};
        _self.increaseCallId();
        app.emit('CALL_OUT_RQ', {userid:userid, type:type, callid:_self.callid});
        app.utils.playRing(app.resource.aud_call_out);
        _self.state = _self.STATE_CALLOUT;
        return _self.callid;
    };
    CallMgr.prototype.onCallOut = function(obj) {
        console.log('onCallOut', obj);
        if (obj.error) {
            app.utils.showChatError(obj.error);
            _self.state = _self.STATE_ERROR;
            app.utils.playRing(app.resource.aud_call_error);
            setTimeout(function() {
                if (_self.state == _self.STATE_ERROR) {
                    app.utils.stopRing();
                    _self.state = _self.STATE_FREE;
                    _self.parent(obj.type).onCallOutError(obj.callid);
                }
            }, _self.delay);
        }
    };
    CallMgr.prototype.onCallInNotify = function(obj) {
        console.log('onCallInNotify', obj);
        if (_self.state != _self.STATE_FREE) {
            app.emit('CALL_IN_NFS', {userid:obj.userid, type:obj.type, callid:obj.callid, answer:2});
            return;
        }
        _self.time = {hour:0, minute:0, second:0};
        _self.state = _self.STATE_CALLIN;
        app.utils.playRing(app.resource.aud_call_in);
        if (obj.type == _self.VIDEO_TYPE) {
            //require('videoCall').show(obj.userid, obj.callid);
        } else {
            //require('audioCall').show(obj.userid, obj.callid);
        }
    };
    CallMgr.prototype.answerCallIn = function(userid, type, callid) {
        console.log('answerCallIn', userid, type, callid);
        _self.time = {hour:0, minute:0, second:0};
        _self.call(false, userid, type, callid);
        app.emit('CALL_IN_NFS', {userid:userid, type:type, callid:callid, answer:0});
        app.utils.stopRing();
        _self.state = _self.STATE_CALLING;
    };
    CallMgr.prototype.refuseCallIn = function(userid, type, callid) {
        app.emit('CALL_IN_NFS', {userid:userid, type:type, callid:callid, answer:1});
        app.utils.stopRing();
        _self.state = _self.STATE_FREE;
    };
    CallMgr.prototype.onCallInReplyNotify = function(obj) {
        console.log('onCallInReplyNotify', obj);
        if (obj.answer == 0) {
            console.log("he/she answer call");
            _self.parent(obj.type).onCallOutAnswered(obj.callid);
            _self.call(true, obj.userid, obj.type, obj.callid);
            _self.time = {hour:0, minute:0, second:0};
            app.utils.stopRing();
            _self.state = _self.STATE_CALLING;
        } else if (obj.answer == 1) {
            console.log("he/she refuse call");
            app.utils.playRing(app.resource.aud_refuse);
            _self.state = _self.STATE_REFUSE;
            setTimeout(function() {
                if (_self.state == _self.STATE_REFUSE) {
                    app.utils.stopRing();
                    _self.state = _self.STATE_FREE;
                    _self.parent(obj.type).onCallOutRefused(obj.callid);
                }
            }, _self.delay);
        } else {
            console.log("he/she is busy");
            app.utils.playRing(app.resource.aud_busy);
            _self.state = _self.STATE_BUSY;
            setTimeout(function() {
                if (_self.state == _self.STATE_BUSY) {
                    app.utils.stopRing();
                    _self.state = _self.STATE_FREE;
                    _self.parent(obj.type).onCallOutRefused(obj.callid);
                }
            }, _self.longdelay);
        }
    };
    CallMgr.prototype.callHangup = function(userid, type, callid) {
        console.log('callHangup', userid, type, callid);
        console.log(_self.state);
        app.utils.stopRing();
        if (_self.state == _self.STATE_CALLOUT || _self.state == _self.STATE_CALLIN || _self.state == _self.STATE_CALLING ) {
            _self.state = _self.STATE_FREE;
            var session = _self.session;
            app.emit('CALL_HANGUP_RQ', {userid: userid, type: type, callid: callid});
            session && session.close();
            _self.session = null;
        }
        _self.state = _self.STATE_FREE;
    };
    CallMgr.prototype.onCallHangup = function(obj) {
        console.log("i hang up call");
    };
    CallMgr.prototype.onCallHangupNotify = function(obj) {
        _self.parent(obj.type).onPreCallHangupNotify(obj.callid);
        if (_self.state == _self.STATE_FREE) {
            return;
        }
        console.log('onCallHangupNotify', obj);
        app.utils.playRing(app.resource.aud_hangup);
        _self.state = _self.STATE_HANGUP;
        setTimeout(function() {
            if (_self.state == _self.STATE_HANGUP) {
                _self.parent(obj.type).onCallHangupNotify(obj.callid);
                app.utils.stopRing();
                _self.state = _self.STATE_FREE;
            }
        }, _self.delay);
        var session = _self.session;
        session&&session.close();
        _self.session = null;
    };

    return new CallMgr();
})();


