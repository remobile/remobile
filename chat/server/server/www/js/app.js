(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var classnames = require('classnames');
var UI = require('UI');
var ModalPanel = UI.Modal.ModalPanel;
var views = require('./modules');
var welcome = require('./modules/home/welcome');
var utils = require('./modules/utils');
var chat = require('./modules/chat');
var resource = require('./modules/resource/resource');

var App = React.createClass({
    displayName: 'App',

    mixins: [UI.Mixins.App(views)],
    componentWillMount: function componentWillMount() {
        this.resource = resource;
        this.us = utils.userSetting;
        this.error = utils.error;
        this.constants = utils.constants;
        this.date = utils.date;
        this.color = utils.color;
        this.setting = utils.setting;
        this.sound = utils.sound;
        this.callMgr = chat.callMgr;
        this.groupMgr = chat.groupMgr;
        this.messageMgr = chat.messageMgr;
        this.router = chat.router;
        this.socketMgr = chat.socketMgr;
        this.notifyMgr = chat.notifyMgr;
        this.loginMgr = chat.loginMgr;
        this.userMgr = chat.userMgr;
        this.userHeadCss = $.createStyleSheet();

        // welcome.showWelcome();
        this.socketMgr.start("http://192.168.1.119:8000");
    },
    componentDidMount: function componentDidMount() {
        navigator.utils.setupAudio();
        navigator.utils.setupFileChooser();
        this.device.pause = false;
    },
    showError: function showError(error) {
        this.toast(error);
    },
    showChatError: function showChatError(error) {
        this.toast(this.error[error]);
    },
    emit: function emit() {
        console.log(arguments[0], JSON.stringify(arguments[1]));
        if (!this.loginMgr.online) {
            console.log('you are offline');
            return;
        }
        this.socket.emit.apply(this.socket, arguments);
    },
    showWait: function showWait(text) {
        this.showPreloader(text);
    },
    hideWait: function hideWait() {
        this.hidePreloader();
    },
    showCover: function showCover(coverChildren, coverParams) {
        this.setState({ coverVisible: true, coverChildren: coverChildren, coverParams: coverParams });
    },
    hideCover: function hideCover() {
        this.setState({ coverVisible: false });
    },
    getInitialState: function getInitialState() {
        return {
            currentView: 'login'
        };
    },
    render: function render() {
        return React.createElement(
            ReactCSSTransitionGroup,
            { transitionName: this.state.viewTransition.name, transitionEnter: this.state.viewTransition['in'], transitionLeave: this.state.viewTransition.out, component: 'div' },
            this.state.coverVisible && React.createElement(
                UI.View.Cover,
                { params: this.state.coverParams },
                this.state.coverChildren
            ),
            this.getCurrentView()
        );
    }
});
function onDeviceReady() {
    React.render(React.createElement(App, null), document.getElementById('app'));
}
document.addEventListener('deviceready', onDeviceReady, false);

},{"./modules":26,"./modules/chat":6,"./modules/home/welcome":25,"./modules/resource/resource":32,"./modules/utils":37,"UI":41,"classnames":43,"react/addons":undefined}],2:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var List = UI.List;
var Grid = UI.Grid;
var Card = UI.Card;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Button = UI.Button.Button;

var SHOW_NONE_BUTTON = 0;
var SHOW_CALLIN_BUTTON = 1;
var SHOW_CALLOUT_BUTTON = 2;

module.exports = React.createClass({
    displayName: 'exports',

    componentWillMount: function componentWillMount() {
        var param = this.props.data.param;
        this.userid = param.userid;
        var callid = param.callid;
        if (callid != null) {
            this.answer = true;
            this.callid = callid;
            this.state.showButton = SHOW_CALLIN_BUTTON;
        } else {
            this.answer = false;
            this.state.showButton = SHOW_CALLOUT_BUTTON;
        }
    },
    componentDidMount: function componentDidMount() {
        var mgr = app.callMgr;
        var self = this;
        mgr.addCallChangeListener(this._onChange);
        if (!this.answer) {
            this.callid = mgr.callOut(this.userid, mgr.AUDIO_TYPE);
        }
        mgr.updateTime(function (time, status) {
            self.setState({ time: time, status: status });
        });
    },
    componentWillUnmount: function componentWillUnmount() {
        this.hangupAudioCall();
        app.callMgr.removeCallChangeListener(this._onChange);
    },
    _onChange: function _onChange(obj) {
        var type = obj.type;
        switch (type) {
            case "ON_SESSION_ANSWER":
                this.onSessionAnswer(obj.userid, obj.callid);
                break;
            case "ON_CALLOUT_ERROR":
                this.onCallOutError(obj.callid);
                break;
            case "ON_CALLOUT_ANSWERED":
                this.onCallOutAnswered(obj.callid);
                break;
            case "ON_CALLOUT_REFUSED":
                this.onCallOutRefused(obj.callid);
                break;
            case "ON_PRE_CALL_HANGUP_NOTIFY":
                this.onPreCallHangupNotify(obj.callid);
                break;
            case "ON_CALL_HANGUP_NOTIFY":
                this.onCallHangupNotify(obj.callid);
                break;
            default:
                ;
        }
    },
    getInitialState: function getInitialState() {
        return {
            status: '',
            time: '',
            showButton: SHOW_NONE_BUTTON
        };
    },
    onSessionAnswer: function onSessionAnswer(userid, callid) {
        console.log('onSessionAnswer', userid, callid);
    },
    onCallOutError: function onCallOutError(callid) {
        console.log('onCallOutError', callid, this.callid);
        if (this.callid != null) {
            this.callid = null;
            app.goBack();
        }
    },
    answerAudioCall: function answerAudioCall() {
        var mgr = app.callMgr;
        console.log('answerAudioCall', this.callid);
        mgr.answerCallIn(this.userid, mgr.AUDIO_TYPE, this.callid);
        this.setState({ showButton: SHOW_CALLOUT_BUTTON });
    },
    onCallOutAnswered: function onCallOutAnswered(callid) {
        console.log('onCallOutAnswered', callid, this.callid);
    },
    refuseAudioCall: function refuseAudioCall() {
        if (this.callid != null) {
            console.log('refuseAudioCall', this.callid);
            var mgr = app.callMgr;
            mgr.refuseCallIn(this.userid, mgr.AUDIO_TYPE, this.callid);
            this.callid = null;
            app.goBack();
        }
    },
    onCallOutRefused: function onCallOutRefused(callid) {
        if (this.callid != null) {
            console.log('onCallOutRefused', callid, this.callid);
            this.callid = null;
            app.goBack();
        }
    },
    hangupAudioCall: function hangupAudioCall() {
        if (this.callid != null) {
            console.log('hangupAudioCall', this.callid);
            var mgr = app.callMgr;
            mgr.callHangup(this.userid, mgr.AUDIO_TYPE, this.callid);
            this.callid = null;
            app.goBack();
        }
    },
    onPreCallHangupNotify: function onPreCallHangupNotify(callid) {
        this.setState({ showButton: SHOW_CALLOUT_BUTTON });
    },
    onCallHangupNotify: function onCallHangupNotify(callid) {
        if (this.callid != null) {
            console.log('onCallHangupNotify', callid, this.callid);
            this.callid = null;
            app.goBack();
        }
    },
    render: function render() {
        var userid = this.userid;
        var user = app.userMgr.users[userid];
        var username = user.username;
        return React.createElement(
            View.Page,
            { title: 'Audio Call' },
            React.createElement(
                View.PageContent,
                null,
                React.createElement('div', { className: "audio_call_head default_head user_head_" + userid }),
                React.createElement(
                    'div',
                    { className: 'center_div' },
                    React.createElement(
                        'div',
                        { style: { fontSize: "2em", paddingTop: "20px", paddingBottom: "20px" } },
                        username
                    ),
                    React.createElement(
                        'div',
                        { style: { color: "red" } },
                        this.state.status
                    ),
                    React.createElement(
                        'div',
                        { style: { color: "dimgray" } },
                        this.state.time
                    )
                ),
                this.state.showButton === SHOW_CALLOUT_BUTTON && React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        Grid.Row,
                        null,
                        React.createElement(
                            Grid.Col,
                            null,
                            React.createElement(
                                Button,
                                { big: true, fill: true, color: 'red', onTap: this.hangupAudioCall },
                                '挂断'
                            )
                        )
                    )
                ),
                this.state.showButton === SHOW_CALLIN_BUTTON && React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        Grid.Row,
                        null,
                        React.createElement(
                            Grid.Col,
                            { per: 50 },
                            React.createElement(
                                Button,
                                { big: true, fill: true, color: 'green', onTap: this.answerAudioCall },
                                '接听'
                            )
                        ),
                        React.createElement(
                            Grid.Col,
                            { per: 50 },
                            React.createElement(
                                Button,
                                { big: true, fill: true, color: 'red', onTap: this.refuseAudioCall },
                                '挂断'
                            )
                        )
                    )
                )
            )
        );
    }
});

},{"UI":41,"react":undefined}],3:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var List = UI.List;
var Grid = UI.Grid;
var Card = UI.Card;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Button = UI.Button.Button;

var SHOW_NONE_BUTTON = 0;
var SHOW_CALLIN_BUTTON = 1;
var SHOW_CALLOUT_BUTTON = 2;

module.exports = React.createClass({
    displayName: 'exports',

    componentWillMount: function componentWillMount() {
        var param = this.props.data.param;
        this.userid = param.userid;
        this.localLarge = true;
        var callid = param.callid;
        if (callid != null) {
            this.answer = true;
            this.callid = callid;
            this.state.showButton = SHOW_CALLIN_BUTTON;
        } else {
            this.answer = false;
            this.state.showButton = SHOW_CALLOUT_BUTTON;
        }
    },
    componentDidMount: function componentDidMount() {
        var mgr = app.callMgr;
        var self = this;

        this.smallView = this.refs.smallView.getDOMNode();
        this.largeView = this.refs.largeView.getDOMNode();

        mgr.addCallChangeListener(this._onChange);
        this.updateVideoView();
        if (!this.answer) {
            this.callid = mgr.callOut(this.userid, mgr.VIDEO_TYPE);
        }
        mgr.updateTime(function (time, status) {
            self.setState({ time: time, status: status });
        });
    },
    componentWillUnmount: function componentWillUnmount() {
        this.hangupVideoCall();
        app.callMgr.removeCallChangeListener(this._onChange);
    },
    _onChange: function _onChange(obj) {
        var type = obj.type;
        switch (type) {
            case "ON_SESSION_ANSWER":
                this.onSessionAnswer(obj.userid, obj.callid);
                break;
            case "ON_CALLOUT_ERROR":
                this.onCallOutError(obj.callid);
                break;
            case "ON_CALLOUT_ANSWERED":
                this.onCallOutAnswered(obj.callid);
                break;
            case "ON_CALLOUT_REFUSED":
                this.onCallOutRefused(obj.callid);
                break;
            case "ON_PRE_CALL_HANGUP_NOTIFY":
                this.onPreCallHangupNotify(obj.callid);
                break;
            case "ON_CALL_HANGUP_NOTIFY":
                this.onCallHangupNotify(obj.callid);
                break;
            default:
                ;
        }
    },
    getInitialState: function getInitialState() {
        return {
            status: '',
            time: '',
            showButton: SHOW_NONE_BUTTON
        };
    },
    toggleVideoView: function toggleVideoView() {
        console.log("==================toggleVideoView");
        console.log("==================toggleVideoView");
        console.log("==================toggleVideoView");
        console.log("==================toggleVideoView");
        console.log("==================toggleVideoView");
        console.log("==================toggleVideoView");
        console.log("==================toggleVideoView");
        console.log("==================toggleVideoView");
        console.log("==================toggleVideoView");
        console.log("==================toggleVideoView");
        this.localLarge = !this.localLarge;
        this.updateVideoView();
    },
    updateVideoView: function updateVideoView() {
        var local = this.localLarge;
        navigator.phonertc.setVideoView({
            localView: local ? this.largeView : this.smallView,
            remoteView: !local ? this.largeView : this.smallView
        });
    },
    onSessionAnswer: function onSessionAnswer(userid, callid) {
        console.log('onSessionAnswer', userid, callid);
        this.toggleVideoView();
    },
    onCallOutError: function onCallOutError(callid) {
        console.log('onCallOutError', callid, this.callid);
        if (this.callid != null) {
            this.callid = null;
            navigator.phonertc.removeLocalVideoView();
            app.goBack();
        }
    },
    answerVideoCall: function answerVideoCall() {
        var mgr = app.callMgr;
        console.log('answerVideoCall', this.callid);
        mgr.answerCallIn(this.userid, mgr.VIDEO_TYPE, this.callid);
        this.setState({ showButton: SHOW_CALLOUT_BUTTON });
    },
    onCallOutAnswered: function onCallOutAnswered(callid) {
        console.log('onCallOutAnswered', callid, this.callid);
    },
    refuseVideoCall: function refuseVideoCall() {
        if (this.callid != null) {
            navigator.phonertc.removeLocalVideoView();
            console.log('refuseVideoCall', this.callid);
            var mgr = app.callMgr;
            mgr.refuseCallIn(this.userid, mgr.VIDEO_TYPE, this.callid);
            this.callid = null;
            app.goBack();
        }
    },
    onCallOutRefused: function onCallOutRefused(callid) {
        if (this.callid != null) {
            navigator.phonertc.removeLocalVideoView();
            console.log('onCallOutRefused', callid, this.callid);
            this.callid = null;
            app.goBack();
        }
    },
    hangupVideoCall: function hangupVideoCall() {
        if (this.callid != null) {
            navigator.phonertc.removeLocalVideoView();
            console.log('hangupVideoCall', this.callid);
            var mgr = app.callMgr;
            mgr.callHangup(this.userid, mgr.VIDEO_TYPE, this.callid);
            this.callid = null;
            app.goBack();
        }
    },
    onPreCallHangupNotify: function onPreCallHangupNotify(callid) {
        this.setState({ showButton: SHOW_CALLOUT_BUTTON });
    },
    onCallHangupNotify: function onCallHangupNotify(callid) {
        if (this.callid != null) {
            navigator.phonertc.removeLocalVideoView();
            console.log('onCallHangupNotify', callid, this.callid);
            this.callid = null;
            app.goBack();
        }
    },
    render: function render() {
        var userid = this.userid;
        var user = app.userMgr.users[userid];
        var username = user.username;
        return React.createElement(
            View.Page,
            { title: 'Video Call' },
            React.createElement(
                View.PageContent,
                null,
                React.createElement(
                    'div',
                    { className: 'video_call_status_container' },
                    React.createElement('div', { className: "chat_head video_call_head default_head user_head_" + userid }),
                    React.createElement(
                        'div',
                        { className: 'video_call_status' },
                        React.createElement(
                            'div',
                            null,
                            'fang'
                        ),
                        React.createElement(
                            'div',
                            { className: 'call_state', style: { color: "red" } },
                            this.state.status
                        ),
                        React.createElement(
                            'div',
                            { className: 'call_time' },
                            this.state.time
                        )
                    )
                ),
                React.createElement('div', { className: 'video_small_screen', ref: 'smallView', onclick: this.toggleVideoView }),
                React.createElement('div', { className: 'video_large_screen', ref: 'largeView', onclick: this.toggleVideoView }),
                React.createElement(
                    'div',
                    { className: 'vidc_panel' },
                    this.state.showButton === SHOW_CALLOUT_BUTTON && React.createElement(
                        Content.ContentBlock,
                        null,
                        React.createElement(
                            Grid.Row,
                            null,
                            React.createElement(
                                Grid.Col,
                                null,
                                React.createElement(
                                    Button,
                                    { big: true, fill: true, color: 'red', onTap: this.hangupVideoCall },
                                    '挂断'
                                )
                            )
                        )
                    ),
                    this.state.showButton === SHOW_CALLIN_BUTTON && React.createElement(
                        Content.ContentBlock,
                        null,
                        React.createElement(
                            Grid.Row,
                            null,
                            React.createElement(
                                Grid.Col,
                                { per: 50 },
                                React.createElement(
                                    Button,
                                    { big: true, fill: true, color: 'green', onTap: this.answerVideoCall },
                                    '接听'
                                )
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 50 },
                                React.createElement(
                                    Button,
                                    { big: true, fill: true, color: 'red', onTap: this.refuseVideoCall },
                                    '挂断'
                                )
                            )
                        )
                    )
                )
            )
        );
    }
});

},{"UI":41,"react":undefined}],4:[function(require,module,exports){
'use strict';

var EventEmitter = require('events').EventEmitter;
var assign = require("object-assign");
var us = require('../../utils/userSetting');
var constants = require('../../utils/constants');

module.exports = (function () {
    "use strict";

    function CallMgr() {
        assign(this, EventEmitter.prototype);

        this.callid = localStorage.callid || 1;
        //call type
        this.AUDIO_TYPE = 0;
        this.VIDEO_TYPE = 1;

        //call state
        this.STATE_FREE = 0; //next: STATE_CALLOUT STATE_CALLIN
        this.STATE_CALLOUT = 1; //next: STATE_ERROR STATE_BUSY STATE_REFUSE STATE_CALLING STATE_DISCONNECT
        this.STATE_CALLIN = 2; //next: STATE_FREE STATE_CALLING STATE_DISCONNECT
        this.STATE_CALLING = 3; //next: STATE_HANGUP STATE_DISCONNECT
        this.STATE_BUSY = 4; //next: STATE_FREE
        this.STATE_REFUSE = 5; //next: STATE_FREE
        this.STATE_HANGUP = 6; //next: STATE_FREE
        this.STATE_ERROR = 7; //next: STATE_FREE
        this.STATE_DISCONNECT = 8; //next: STATE_FREE

        this.state = this.STATE_FREE;
        this.delay = 3000;
        this.longdelay = 10000;
        this.session = null;
        this.time = { hour: 0, minute: 0, second: 0 };
    }

    CallMgr.prototype.emitCallChange = function (data) {
        this.emit("call_change", data);
    };
    CallMgr.prototype.addCallChangeListener = function (callback) {
        this.on("call_change", callback);
    };
    CallMgr.prototype.removeCallChangeListener = function (callback) {
        this.removeListener("call_change", callback);
    };
    CallMgr.prototype.updateTime = function (callback) {
        var self = app.callMgr;
        var time = self.time;
        var STATUS = ['空闲中...', '拨号中...', '电话呼入...', '通话中...', '对方正在通话中', '对方拒绝接听', '对方终止了电话', '对方不在线', '断开了连接'];

        if (self.state === self.STATE_FREE) {
            return;
        }
        if (self.state !== self.STATE_HANGUP && self.state !== self.STATE_REFUSE) {
            time.second++;
            if (time.second === 60) {
                time.second = 0;
                time.minute++;
                if (time.minute === 60) {
                    time.minute = 0;
                    time.hour++;
                }
            }
        }
        var hour = time.hour;
        var minute = time.minute;
        var second = time.second;
        time = (hour < 10 ? '0' : '') + hour + ':' + (minute < 10 ? '0' : '') + minute + ':' + (second < 10 ? '0' : '') + second;
        callback(time, STATUS[self.state]);
        setTimeout(self.updateTime, 1000, callback);
    };
    CallMgr.prototype.increaseCallId = function () {
        this.callid++;
        if (!this.callid) {
            this.callid = 1;
        }
        localStorage.callid = this.callid;
    };
    CallMgr.prototype.call = function (isInitiator, userid, type, callid) {
        console.log('calling to ' + userid + ', isInitiator: ' + isInitiator + ', type:' + type);
        var self = this;
        var config = {
            isInitiator: isInitiator,
            turn: {
                host: 'turn:numb.viagenie.ca',
                username: 'webrtc@live.com',
                password: 'muazkh'
            },
            streams: {
                audio: true,
                video: type === this.VIDEO_TYPE
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
            self.emitCallChange({ type: "ON_SESSION_ANSWER", userid: userid, callid: callid });
        });
        session.on('disconnect', function () {
            if (self.state === self.STATE_CALLOUT || self.state === self.STATE_CALLIN || self.state === self.STATE_CALLING) {
                console.log('session disconnected');
                self.state = self.STATE_DISCONNECT;
                self.emitCallChange({ type: "ON_PRE_CALL_HANGUP_NOTIFY", callid: callid });
                app.sound.playRing(app.resource.aud_hangup);
                app.emit('CALL_HANGUP_RQ', { userid: userid, type: type, callid: callid });
                setTimeout(function () {
                    if (self.state === self.STATE_DISCONNECT) {
                        app.sound.stopRing();
                        self.emitCallChange({ type: "ON_CALL_HANGUP_NOTIFY", callid: callid });
                        self.state = self.STATE_FREE;
                    }
                }, self.delay);
            }
            self.session = null;
        });
        session.call();
        this.session = session;
    };
    CallMgr.prototype.onCallWebrtcSignalNotify = function (obj) {
        console.log('onCallWebrtcSignalNotify', obj);
        var session = this.session;
        session && session.receiveMessage(JSON.parse(obj.data));
    };
    CallMgr.prototype.callOut = function (userid, type) {
        this.time = { hour: 0, minute: 0, second: 0 };
        this.increaseCallId();
        app.emit('CALL_OUT_RQ', { userid: userid, type: type, callid: this.callid });
        app.sound.playRing(app.resource.aud_call_out);
        this.state = this.STATE_CALLOUT;
        return this.callid;
    };
    CallMgr.prototype.onCallOut = function (obj) {
        console.log('onCallOut', obj);
        if (obj.error) {
            app.showChatError(obj.error);
            this.state = this.STATE_ERROR;
            app.sound.playRing(app.resource.aud_call_error);
            var self = this;
            setTimeout(function () {
                if (self.state === self.STATE_ERROR) {
                    app.sound.stopRing();
                    self.state = self.STATE_FREE;
                    self.emitCallChange({ type: "ON_CALLOUT_ERROR", callid: obj.callid });
                }
            }, this.delay);
        }
    };
    CallMgr.prototype.onCallInNotify = function (obj) {
        console.log('onCallInNotify', obj);
        if (this.state != this.STATE_FREE) {
            app.emit('CALL_IN_NFS', { userid: obj.userid, type: obj.type, callid: obj.callid, answer: 2 });
            return;
        }
        this.time = { hour: 0, minute: 0, second: 0 };
        this.state = this.STATE_CALLIN;
        app.sound.playRing(app.resource.aud_call_in);
        if (obj.type === this.VIDEO_TYPE) {
            app.showView('videoCall', 'fade', { userid: obj.userid, callid: obj.callid });
        } else {
            app.showView('audioCall', 'fade', { userid: obj.userid, callid: obj.callid });
        }
    };
    CallMgr.prototype.answerCallIn = function (userid, type, callid) {
        console.log('answerCallIn', userid, type, callid);
        this.time = { hour: 0, minute: 0, second: 0 };
        this.call(false, userid, type, callid);
        app.emit('CALL_IN_NFS', { userid: userid, type: type, callid: callid, answer: 0 });
        app.sound.stopRing();
        this.state = this.STATE_CALLING;
    };
    CallMgr.prototype.refuseCallIn = function (userid, type, callid) {
        app.emit('CALL_IN_NFS', { userid: userid, type: type, callid: callid, answer: 1 });
        app.sound.stopRing();
        this.state = this.STATE_FREE;
    };
    CallMgr.prototype.onCallInReplyNotify = function (obj) {
        console.log('onCallInReplyNotify', obj);
        if (obj.answer === 0) {
            console.log("he/she answer call");
            this.emitCallChange({ type: "ON_CALLOUT_ANSWERED", callid: obj.callid });
            this.call(true, obj.userid, obj.type, obj.callid);
            this.time = { hour: 0, minute: 0, second: 0 };
            app.sound.stopRing();
            this.state = this.STATE_CALLING;
        } else if (obj.answer === 1) {
            console.log("he/she refuse call");
            app.sound.playRing(app.resource.aud_refuse);
            this.state = this.STATE_REFUSE;
            var self = this;
            setTimeout(function () {
                if (self.state === self.STATE_REFUSE) {
                    app.sound.stopRing();
                    self.state = self.STATE_FREE;
                    self.emitCallChange({ type: "ON_CALLOUT_REFUSED", callid: obj.callid });
                }
            }, this.delay);
        } else {
            console.log("he/she is busy");
            app.sound.playRing(app.resource.aud_busy);
            this.state = this.STATE_BUSY;
            var self = this;
            setTimeout(function () {
                if (self.state === self.STATE_BUSY) {
                    app.sound.stopRing();
                    self.state = self.STATE_FREE;
                    self.emitCallChange({ type: "ON_CALLOUT_REFUSED", callid: obj.callid });
                }
            }, this.longdelay);
        }
    };
    CallMgr.prototype.callHangup = function (userid, type, callid) {
        console.log('callHangup', userid, type, callid);
        console.log(this.state);
        app.sound.stopRing();
        if (this.state === this.STATE_CALLOUT || this.state === this.STATE_CALLIN || this.state === this.STATE_CALLING) {
            this.state = this.STATE_FREE;
            var session = this.session;
            app.emit('CALL_HANGUP_RQ', { userid: userid, type: type, callid: callid });
            session && session.close();
            this.session = null;
        }
        this.state = this.STATE_FREE;
    };
    CallMgr.prototype.onCallHangup = function (obj) {
        console.log("i hang up call");
    };
    CallMgr.prototype.onCallHangupNotify = function (obj) {
        this.emitCallChange({ type: "ON_PRE_CALL_HANGUP_NOTIFY", callid: obj.callid });
        if (this.state === this.STATE_FREE) {
            return;
        }
        console.log('onCallHangupNotify', obj);
        app.sound.playRing(app.resource.aud_hangup);
        this.state = this.STATE_HANGUP;
        var self = this;
        setTimeout(function () {
            if (self.state === self.STATE_HANGUP) {
                self.state = self.STATE_FREE;
                self.emitCallChange({ type: "ON_CALL_HANGUP_NOTIFY", callid: obj.callid });
                app.sound.stopRing();
            }
        }, this.delay);
        var session = this.session;
        session && session.close();
        this.session = null;
    };

    return new CallMgr();
})();

},{"../../utils/constants":34,"../../utils/userSetting":40,"events":42,"object-assign":44}],5:[function(require,module,exports){
'use strict';

var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

module.exports = (function () {
    "use strict";

    function GroupMgr() {
        assign(this, EventEmitter.prototype);
        this.reset();
    }

    GroupMgr.prototype.emitEvent = function (data) {
        this.emit("GROUP_EVENT", data);
    };
    GroupMgr.prototype.addEventListener = function (callback) {
        this.on("GROUP_EVENT", callback);
    };
    GroupMgr.prototype.removeEventListener = function (callback) {
        this.removeListener("GROUP_EVENT", callback);
    };
    GroupMgr.prototype.reset = function () {
        this.list = {};
        this.alphaList = {};
        this.init = false;
    };
    GroupMgr.prototype.add = function (obj, noupdate) {
        var id = obj.id,
            list = this.list;
        if (!list.hasOwnProperty(id)) {
            list[id] = obj;
            this.addAlphaList(id, obj.name);
        }
    };
    GroupMgr.prototype.addAlphaList = function (id, name) {
        var alpha = $.fisrtPinyin(name);
        var alphaList = this.alphaList;
        alphaList[alpha] = alphaList[alpha] || [];
        alphaList[alpha].push(id);
    };
    GroupMgr.prototype.remove = function (obj) {
        if (this.list.hasOwnProperty(obj.id)) {
            var groupname = this.list[obj.id].name;
            delete this.list[obj.id];
            this.removeAlphaList(obj.id, groupname);
        }
    };
    GroupMgr.prototype.removeAlphaList = function (id, name) {
        var alpha = $.fisrtPinyin(name);
        var alphaList = this.alphaList[alpha];
        if (alphaList) {
            alphaList = _.without(alphaList, id);
            if (alphaList.length === 0) {
                delete this.alphaList[alpha];
            } else {
                this.alphaList[alpha] = alphaList;
            }
        }
    };
    GroupMgr.prototype.updateGroup = function (obj) {
        this.list[obj.id].members = obj.members;
        if (obj.type != null) {
            this.list[obj.id].type = obj.type;
        }
        if (obj.name != null) {
            this.list[obj.id].name = obj.name;
        }
    };
    GroupMgr.prototype.addMembers = function (obj) {
        var list = this.list[obj.id].members;
        list.push(obj.userid);
    };
    GroupMgr.prototype.removeMembers = function (obj) {
        var list = this.list[obj.id].members;
        this.list[obj.id].members = _.without(list, obj.userid);
    };
    GroupMgr.prototype.addList = function (list) {
        for (var i in list) {
            this.add(list[i]);
        }
        this.init = true;
    };
    GroupMgr.prototype.showGroupMessage = function (obj) {
        console.log('[', obj.group, obj.from, ']' + obj.msg);
    };
    GroupMgr.prototype.getGroupList = function (name, creators, members) {
        app.showWait();
        var obj = {};
        if (name) {
            obj.name = name;
        }
        if (creators && creators.length) {
            obj.creators = creators;
        }
        if (members && members.length) {
            obj.members = members;
        }
        app.emit('GROUP_LIST_RQ', obj);
    };
    GroupMgr.prototype.onGetGroupList = function (groups) {
        this.emitEvent({ type: "ON_GET_GROUP_LIST", groups: groups });
    };
    GroupMgr.prototype.getGroupInfo = function (groupid) {
        app.emit('GROUP_INFO_RQ', { id: groupid });
    };
    GroupMgr.prototype.onGetGroupInfo = function (obj) {
        if (obj) {
            console.log(obj);
        } else {
            console.error("there is no group");
        }
    };
    GroupMgr.prototype.createGroup = function (name, members, type) {
        type = type && 1 || 0;
        app.emit('GROUP_CREATE_RQ', { name: name, members: members, type: type });
    };
    GroupMgr.prototype.onCreateGroup = function (obj) {
        console.log(obj);
        if (obj.error) {
            console.error("create " + obj.name + " failed: for " + obj.error);
        } else {
            this.add({ id: obj.id, name: obj.name, creator: app.loginMgr.userid, type: obj.type, members: obj.members });
            console.log("create " + obj.name + " success");
        }
        this.emitEvent({ type: "ON_CREATE_GROUP", error: obj.error });
    };
    GroupMgr.prototype.modifyGroup = function (id, name, members, type) {
        type = type && 1 || 0;
        app.emit('GROUP_MODIFY_RQ', { id: id, name: name, members: members, type: type });
    };
    GroupMgr.prototype.onModifyGroup = function (obj) {
        if (obj.error) {
            console.error("modify " + obj.id + " failed: for " + obj.error);
        } else {
            this.list[obj.id].members = obj.members;
            this.list[obj.id].type = obj.type;
            this.list[obj.id].name = obj.name;
            console.log("modify " + obj.id + " success");
        }
        this.emitEvent({ type: "ON_MODIFY_GROUP", error: obj.error });
    };
    GroupMgr.prototype.removeGroup = function (id) {
        app.emit('GROUP_DELETE_RQ', { id: id });
    };
    GroupMgr.prototype.onRemoveGroup = function (obj) {
        if (obj.error) {
            console.error("remove " + obj.id + " failed: for " + obj.error);
        } else {
            this.remove(obj);
            console.log("remove " + obj.id + " success");
        }
        this.emitEvent({ type: "ON_REMOVE_GROUP", error: obj.error });
    };
    GroupMgr.prototype.onRemoveGroupNotify = function (obj) {
        this.remove(obj);
        console.log(obj.id, 'is been delete');
        this.emitEvent({ type: "ON_GROUP_LIST_CHANGE" });
    };
    GroupMgr.prototype.joinGroup = function (id) {
        app.emit('GROUP_JOIN_RQ', { id: id });
    };
    GroupMgr.prototype.onJoinGroup = function (obj) {
        if (obj.error) {
            console.error("join " + obj.id + " failed: for " + obj.error);
        } else {
            this.add({ id: obj.id, name: obj.name, creator: obj.creator, type: obj.type, members: obj.members });
            console.log("join " + obj.id + " success");
        }
        this.emitEvent({ type: "ON_JOIN_GROUP", error: obj.error });
    };
    GroupMgr.prototype.onJoinGroupNotify = function (obj) {
        this.addMembers({ id: obj.id, userid: obj.userid });
        console.log(obj.userid, 'join group', obj.id);
        this.emitEvent({ type: "ON_UPDATE_GROUP", id: obj.id });
    };
    GroupMgr.prototype.leaveGroup = function (id) {
        app.emit('GROUP_LEAVE_RQ', { id: id });
    };
    GroupMgr.prototype.onLeaveGroup = function (obj) {
        this.remove(obj);
        console.log("leave " + obj.id + " success");
        this.emitEvent({ type: "ON_LEAVE_GROUP" });
    };
    GroupMgr.prototype.onLeaveGroupNotify = function (obj) {
        this.removeMembers({ id: obj.id, userid: obj.userid });
        console.log(obj.userid, 'lest group', obj.id);
        this.emitEvent({ type: "ON_UPDATE_GROUP", id: obj.id });
    };
    GroupMgr.prototype.pullInGroup = function (id, members) {
        app.emit('GROUP_PULL_IN_RQ', { id: id, members: members });
    };
    GroupMgr.prototype.onPullInGroup = function (obj) {
        if (obj.error) {
            console.error("pull " + obj.id + " failed: for " + obj.error);
        } else {
            this.updateGroup({ id: obj.id, members: obj.members });
            console.log("pull " + obj.id + " success");
        }
    };
    GroupMgr.prototype.onPullInGroupNotify = function (obj) {
        if (_.contains(obj.pulledmembers, app.loginMgr.userid)) {
            this.add({ id: obj.id, name: obj.name, creator: obj.creator, type: obj.type, members: obj.members });
            console.log('you have been pull', obj.id);
            this.emitEvent({ type: "ON_GROUP_LIST_CHANGE" });
        } else {
            this.updateGroup({ id: obj.id, members: obj.members, type: obj.type, name: obj.name });
            if (obj.pulledmembers.length) {
                console.log(JSON.stringify(obj.pulledmembers), 'been pull', obj.id, obj.members);
            } else {
                console.log(obj.id, 'been modify', 'type=' + obj.type);
            }
            this.emitEvent({ type: "ON_UPDATE_GROUP", id: obj.id });
        }
    };
    GroupMgr.prototype.fireOutGroup = function (id, members) {
        app.emit('GROUP_FIRE_OUT_RQ', { id: id, members: members });
    };
    GroupMgr.prototype.onFireOutGroup = function (obj) {
        if (obj.error) {
            console.error("fireOut " + obj.id + " failed: for " + obj.error);
        } else {
            this.updateGroup({ id: obj.id, members: obj.members });
            console.log("fireOut " + obj.id + " success");
        }
    };
    GroupMgr.prototype.onFireOutGroupNotify = function (obj) {
        if (_.contains(obj.firedmembers, app.loginMgr.userid)) {
            this.remove(obj);
            console.log('you have been fire', obj.id);
            this.emitEvent({ type: "ON_GROUP_LIST_CHANGE" });
            this.emitEvent({ type: "ON_FIRE_OUT_GROUP", id: obj.id });
            app.messageMgr.removeLeftGroupMessages(obj.id);
        } else {
            this.updateGroup({ id: obj.id, members: obj.members, type: obj.type, name: obj.name });
            console.log(JSON.stringify(obj.firedmembers), 'been fire', obj.id);
            this.emitEvent({ type: "ON_UPDATE_GROUP", id: obj.id });
        }
    };

    return new GroupMgr();
})();

},{"events":42,"object-assign":44,"underscore":46}],6:[function(require,module,exports){
'use strict';

module.exports = {
	callMgr: require('./callMgr/callMgr'),
	groupMgr: require('./groupMgr/groupMgr'),
	messageMgr: require('./messageMgr/messageMgr'),
	router: require('./socketMgr/router'),
	socketMgr: require('./socketMgr/socketMgr'),
	notifyMgr: require('./userMgr/notifyMgr'),
	loginMgr: require('./userMgr/loginMgr'),
	userMgr: require('./userMgr/userMgr')
};

},{"./callMgr/callMgr":4,"./groupMgr/groupMgr":5,"./messageMgr/messageMgr":7,"./socketMgr/router":8,"./socketMgr/socketMgr":9,"./userMgr/loginMgr":10,"./userMgr/notifyMgr":11,"./userMgr/userMgr":12}],7:[function(require,module,exports){
'use strict';

var EventEmitter = require('events').EventEmitter;
var assign = require("object-assign");
var us = require('../../utils/userSetting');
var constants = require('../../utils/constants');

module.exports = (function () {
    "use strict";
    function MessageMgr() {
        assign(this, EventEmitter.prototype);

        this.msgid = localStorage.msgid || 1;

        //message type
        this.TEXT_TYPE = 0;
        this.IMAGE_TYPE = 1;
        this.AUDIO_TYPE = 2;
        this.VIDEO_TYPE = 3;

        //user type
        this.USER_TYPE = 0;
        this.GROUP_TYPE = 1;

        //message per count
        this.PER_COUNT = 10;

        this.newestMessage = [];
        this.displayMessage = [];
        this.displayMessageInfo = {};
        this.getUnreadMessage();
    }

    MessageMgr.prototype.getUnreadMessage = function () {
        this.unreadMessage = {
            group: us.object(constants.GROUP_MESSAGE_BADGES) || {},
            users: us.object(constants.MESSAGE_BADGES) || {},
            at: us.object(constants.GROUP_CHAT_AT_NUMBERS) || {}
        };
        var obj = this.unreadMessage.group;
        var total = 0;
        for (var key in obj) {
            total += obj[key];
        }
        var obj = this.unreadMessage.users;
        for (var key in obj) {
            total += obj[key];
        }
        this.unreadMessage.total = total;
    };
    MessageMgr.prototype.emitNewestMessageChange = function () {
        this.emit("newest_message_change");
    };
    MessageMgr.prototype.addNewestMessageChangeListener = function (callback) {
        this.on("newest_message_change", callback);
    };
    MessageMgr.prototype.removeNewestMessageChangeListener = function (callback) {
        this.removeListener("newest_message_change", callback);
    };
    MessageMgr.prototype.emitDisplayMessageChange = function () {
        this.emit("display_message_change");
    };
    MessageMgr.prototype.addDisplayMessageChangeListener = function (callback) {
        this.on("display_message_change", callback);
    };
    MessageMgr.prototype.removeDisplayMessageChangeListener = function (callback) {
        this.removeListener("display_message_change", callback);
    };
    MessageMgr.prototype.increaseMsgId = function () {
        this.msgid++;
        if (!this.msgid) {
            this.msgid = 1;
        }
        localStorage.msgid = this.msgid;
    };
    MessageMgr.prototype.getNewestMessage = function () {
        var self = this;
        app.db_newest_message.find(function (err, docs) {
            self.newestMessage = _.sortBy(docs, function (obj) {
                return -obj.time;
            });
            self.emitNewestMessageChange();
        });
    };
    MessageMgr.prototype.getUserMessage = function (userid, time) {
        var query = {
            type: this.USER_TYPE,
            userid: userid
        };
        if (time) {
            query.time = { $lt: time };
        }
        var self = this;
        app.db_history_message.find(query, function (err, docs) {
            var message = _.sortBy(docs, function (obj) {
                return -obj.time;
            }).slice(0, self.PER_COUNT);

            if (time) {
                self.displayMessage = message.reverse().concat(self.displayMessage);
            } else {
                self.displayMessage = message.reverse();
            }
            self.emitDisplayMessageChange();
        });
    };
    MessageMgr.prototype.getGroupMessage = function (groupid, time) {
        var query = {
            type: this.GROUP_TYPE,
            groupid: groupid
        };
        if (time) {
            query.time = { $lt: time };
        }
        var self = this;
        app.db_history_message.find(query, function (err, docs) {
            var message = _.sortBy(docs, function (obj) {
                return -obj.time;
            }).slice(0, self.PER_COUNT);

            if (time) {
                self.displayMessage = message.reverse().concat(self.displayMessage);
            } else {
                self.displayMessage = message.reverse();
            }
            self.emitDisplayMessageChange();
        });
    };
    MessageMgr.prototype.increaseUserUnreadNotify = function (userid) {
        var obj = this.unreadMessage.users;
        if (!obj[userid]) {
            obj[userid] = 1;
        } else {
            obj[userid]++;
        }
        this.unreadMessage.total++;
        us.object(constants.MESSAGE_BADGES, obj);
    };
    MessageMgr.prototype.clearUserUnreadNotify = function (userid) {
        var obj = this.unreadMessage.users;
        var cnt = obj[userid] || 0;
        delete obj[userid];
        this.unreadMessage.total -= cnt;
        us.object(constants.MESSAGE_BADGES, obj);
    };
    MessageMgr.prototype.increaseGroupUnreadNotify = function (groupid, touserid) {
        var obj = this.unreadMessage.group;
        if (!obj[groupid]) {
            obj[groupid] = 1;
        } else {
            obj[groupid]++;
        }
        us.object(constants.GROUP_MESSAGE_BADGES, obj);

        obj = this.unreadMessage.at;
        if (touserid == app.loginMgr.userid) {
            if (!obj[groupid]) {
                obj[groupid] = 1;
            } else {
                obj[groupid]++;
            }
            us.object(constants.GROUP_CHAT_AT_NUMBERS, obj);
        }
        this.unreadMessage.total++;
    };
    MessageMgr.prototype.clearGroupUnreadNotify = function (groupid) {
        var obj = this.unreadMessage.group;
        var cnt = obj[groupid] || 0;
        delete obj[groupid];
        this.unreadMessage.total -= cnt;
        us.object(constants.GROUP_MESSAGE_BADGES, obj);
    };
    MessageMgr.prototype.removeLeftGroupMessages = function (groupid) {
        this.clearGroupUnreadNotify(groupid);
        app.db_history_message['delete']({ type: this.GROUP_TYPE, groupid: groupid });
        var self = this;
        app.db_newest_message['delete']({ type: this.GROUP_TYPE, groupid: groupid }, function () {
            self.emitNewestMessageChange();
        });
    };
    MessageMgr.prototype.showNewestMessage = function (type, userid, groupid, time, msg, msgtype, send, touserid) {
        var display;
        var isGroup = type === this.GROUP_TYPE;
        var newest_message = { userid: userid, groupid: groupid, time: time, msg: msg, msgtype: msgtype, touserid: touserid };

        if (isGroup) {
            display = this.displayMessageInfo.target === groupid;
            if (!(app.state.currentView === "messageInfo" && display)) {
                this.increaseGroupUnreadNotify(groupid, touserid);
            }
            this.newestMessage = _.reject(this.newestMessage, function (item) {
                return item.groupid == groupid && item.type == type;
            });
            this.newestMessage.unshift(assign({ type: type, groupid: groupid }, newest_message));
            app.db_newest_message.upsert({ type: type, groupid: groupid }, newest_message);
            console.log("update newest_message_db", { type: type, groupid: groupid }, { groupid: groupid, time: time, msg: msg, msgtype: msgtype });
        } else {
            display = this.displayMessageInfo.target === userid;
            if (!(app.state.currentView === "messageInfo" && display)) {
                this.increaseUserUnreadNotify(userid);
            }
            this.newestMessage = _.reject(this.newestMessage, function (item) {
                return item.userid == userid && item.type == type;
            });
            this.newestMessage.unshift(assign({ type: type, userid: userid }, newest_message));
            app.db_newest_message.upsert({ type: type, userid: userid }, newest_message);
            console.log("update newest_message_db", { type: type, userid: userid }, { time: time, msg: msg, msgtype: msgtype });
        }
        this.emitNewestMessageChange();

        var display_message = { type: type, userid: userid, groupid: groupid, time: time, msg: msg, msgtype: msgtype };
        if (send != null) {
            display_message.send = send;
        }
        if (touserid) {
            display_message.touserid = touserid;
        }
        if (display) {
            this.displayMessage.push(display_message);
            this.emitDisplayMessageChange();
        }

        app.db_history_message.insert(display_message);
        console.log("update history_message_db", display_message);
    };
    MessageMgr.prototype.sendUserMessage = function (users, msg, msgtype) {
        this.increaseMsgId();
        app.emit('USER_SEND_MESSAGE_RQ', { type: this.USER_TYPE, to: users, msg: msg, msgtype: msgtype, msgid: this.msgid });
        var list = users.split(',');
        var time = Date.now();
        for (var i = 0, len = list.length; i < len; i++) {
            var userid = list[i];
            this.showNewestMessage(this.USER_TYPE, userid, null, time, msg, msgtype, this.msgid);
        }
    };
    MessageMgr.prototype.sendGroupMessage = function (groupid, msg, msgtype, touserid) {
        this.increaseMsgId();
        app.emit('USER_SEND_MESSAGE_RQ', { type: this.GROUP_TYPE, to: groupid, msg: msg, msgtype: msgtype, msgid: this.msgid, touserid: touserid });
        var time = Date.now();
        this.showNewestMessage(this.GROUP_TYPE, app.loginMgr.userid, groupid, time, msg, msgtype, this.msgid, touserid);
    };
    MessageMgr.prototype.onSendUserMessage = function (obj) {
        if (obj.error) {
            console.error(error);
        } else {
            console.log("send to " + obj.to + " [" + obj.msgid + "]", obj.time, "server success");
        }
    };
    MessageMgr.prototype.addMessageNotification = function (userid, groupid, message) {
        var username;
        if (userid !== null) {
            username = app.userMgr.users[userid].username;
        } else {
            username = "【群】:" + app.groupMgr.list[groupid].name;
        }
        username = "来自 " + username + " 的消息";
        navigator.utils.addNotification(app.constants.MESSAGE_NOTIFY_ID, username, message);
    };
    MessageMgr.prototype.showUserMessage = function (obj) {
        app.sound.playSound(app.resource.aud_message_tip);
        if (obj.type == this.USER_TYPE) {
            this.addMessageNotification(obj.from, null, obj.msg);
            this.showNewestMessage(this.USER_TYPE, obj.from, null, obj.time, obj.msg, obj.msgtype);
            console.log('[' + obj.from + ']', '[' + obj.msgid + ']:', obj.msg, obj.msgtype, obj.time);
        } else {
            this.addMessageNotification(null, obj.groupid, obj.msg);
            this.showNewestMessage(this.GROUP_TYPE, obj.from, obj.groupid, obj.time, obj.msg, obj.msgtype, null, obj.touserid);
            console.log(' group:' + obj.groupid, ' [' + obj.from + ']', ' [' + obj.msgid + ']:', obj.msg, obj.msgtype, obj.time, obj.touserid);
        }
    };
    MessageMgr.prototype.onUserMessageReceived = function (obj) {
        console.log(' [' + obj.msgid + ']:', obj.to, 'received');
    };
    MessageMgr.prototype.noticeNewMessage = function (obj) {
        return;
        app.sound.playSound(app.resource.aud_new_message);
    };
    MessageMgr.prototype.showOfflineMessage = function (obj) {
        if (!app.uiMessage.hasUpdateLogMessage) {
            setTimeout(function () {
                this.showOfflineMessage(obj);
            }, 200);
        } else {
            var len = obj.length;
            var allUsers = app.userMgr.users;
            if (len) {
                this.noticeNewMessage();
            }
            for (var i = 0; i < len; i++) {
                var item = obj[i];
                if (item.type == this.GROUP_TYPE) {
                    console.log(' [' + item.groupid + ']', ' [' + item.from + '][' + item.time + ']:', item.msg);
                    this.showNewestMessage(this.GROUP_TYPE, item.from, item.groupid, new Date(item.time).getTime(), item.msg, item.msgtype, null, item.touserid);
                } else {
                    console.log(' [' + item.from + '][' + new Date(item.time).getTime() + ']:', item.msg);
                    this.showNewestMessage(this.USER_TYPE, item.from, allUsers[item.from].username, new Date(item.time).getTime(), item.msg, item.msgtype);
                }
            }
        }
    };
    MessageMgr.prototype.getUserMessageFromServer = function (counter, time) {
        app.emit('USER_GET_MESSAGE_RQ', { type: this.USER_TYPE, counter: counter, time: time, cnt: this.PER_COUNT });
    };
    MessageMgr.prototype.getGroupMessageFromServer = function (counter, time) {
        app.emit('USER_GET_MESSAGE_RQ', { type: this.GROUP_TYPE, counter: counter, time: time, cnt: this.PER_COUNT });
    };
    MessageMgr.prototype.onGetMessage = function (obj) {
        var type = obj.type;
        var msg = obj.msg;
        var _id = obj._id;
        var selfid = app.loginMgr.userid;
        var arr = _.map(msg, function (item) {
            var from = item.from;
            var to = item.to;
            var obj;
            if (from == selfid) {
                return { userid: to, msg: item.msg, msgtype: item.msgtype, time: new Date(item.time).getTime(), send: item.msgid };
            } else {
                return { userid: from, msg: item.msg, msgtype: item.msgtype, time: new Date(item.time).getTime() };
            }
        });
        this.displayMessage = arr.reverse().concat(this.displayMessage);
        this.emitDisplayMessageChange();
    };

    return new MessageMgr();
})();

},{"../../utils/constants":34,"../../utils/userSetting":40,"events":42,"object-assign":44}],8:[function(require,module,exports){
'use strict';

module.exports = (function () {
    "use strict";

    function Router() {}

    Router.prototype.ON_CONNECT = function (obj) {
        app.chatconnect = true;
    };
    Router.prototype.ON_RECONNECT = function (obj) {
        app.chatconnect = true;
        app.loginMgr.login();
        app.toast('服务器重新连接连接成功');
    };
    Router.prototype.ON_DISCONNECT = function (obj) {
        app.chatconnect = false;
        app.loginMgr.online = false;
        app.userMgr.reset();
        app.groupMgr.reset();
        app.toast('服务器断开了连接');
    };
    Router.prototype.ON_USER_REGISTER_RS = function (obj) {
        app.loginMgr.onRegister(obj);
    };
    Router.prototype.ON_USER_REGISTER_NF = function (obj) {
        app.loginMgr.onRegisterNotify(obj);
    };
    Router.prototype.ON_USER_LOGIN_RS = function (obj) {
        app.loginMgr.onLogin(obj);
    };
    Router.prototype.ON_USER_LOGIN_NF = function (obj) {
        if (app.loginMgr.online) {
            app.userMgr.online(obj);
        }
    };
    Router.prototype.ON_USER_LOGOUT_NF = function (obj) {
        if (app.loginMgr.online) {
            app.userMgr.offline(obj);
        }
    };
    Router.prototype.ON_USERS_LIST_NF = function (obj) {
        app.userMgr.addList(obj);
    };
    Router.prototype.ON_GROUP_LIST_NF = function (obj) {
        app.groupMgr.addList(obj);
    };
    Router.prototype.ON_USERS_NOTIFY_NF = function (obj) {
        app.notifyMgr.onNotify(obj);
    };
    Router.prototype.ON_USER_SEND_MESSAGE_RS = function (obj) {
        app.messageMgr.onSendUserMessage(obj);
    };
    Router.prototype.ON_USER_MESSAGE_NF = function (obj) {
        app.emit('USER_MESSAGE_NFS', { from: obj.from, msgid: obj.msgid });
        app.messageMgr.showUserMessage(obj);
    };
    Router.prototype.ON_USER_MESSAGE_RECEIVED_NF = function (obj) {
        app.messageMgr.onUserMessageReceived(obj);
    };
    Router.prototype.ON_USER_OFFONLINE_MESSAGE_NF = function (obj) {
        app.emit('USER_OFFONLINE_MESSAGE_NFS');
        app.messageMgr.showOfflineMessage(obj);
    };
    Router.prototype.ON_USER_GET_MESSAGE_RS = function (obj) {
        app.messageMgr.onGetMessage(obj);
    };
    Router.prototype.ON_USERS_UPDATE_HEAD_RS = function (obj) {
        app.personalInfo.onUpdateHead();
    };
    Router.prototype.ON_USERS_UPDATE_HEAD_NF = function (obj) {
        app.notifyMgr.updateUserHead(obj);
    };
    Router.prototype.ON_USERS_GET_HEAD_RS = function (obj) {
        app.notifyMgr.onGetUserHead(obj);
    };
    Router.prototype.ON_USERS_UPDATE_USERINFO_RS = function (obj) {
        app.personalInfo.onUpdateUserInfo(obj);
    };
    Router.prototype.ON_USERS_UPDATE_USERINFO_NF = function (obj) {
        app.userMgr.onUpdateUserInfoNotify(obj);
    };
    Router.prototype.ON_GROUP_LIST_RS = function (obj) {
        app.groupMgr.onGetGroupList(obj);
    };
    Router.prototype.ON_GROUP_INFO_RS = function (obj) {
        app.groupMgr.onGetGroupInfo(obj);
    };
    Router.prototype.ON_GROUP_CREATE_RS = function (obj) {
        app.groupMgr.onCreateGroup(obj);
    };
    Router.prototype.ON_GROUP_MODIFY_RS = function (obj) {
        app.groupMgr.onModifyGroup(obj);
    };
    Router.prototype.ON_GROUP_DELETE_RS = function (obj) {
        app.groupMgr.onRemoveGroup(obj);
    };
    Router.prototype.ON_GROUP_DELETE_NF = function (obj) {
        app.groupMgr.onRemoveGroupNotify(obj);
    };
    Router.prototype.ON_GROUP_JOIN_RS = function (obj) {
        app.groupMgr.onJoinGroup(obj);
    };
    Router.prototype.ON_GROUP_JOIN_NF = function (obj) {
        app.groupMgr.onJoinGroupNotify(obj);
    };
    Router.prototype.ON_GROUP_LEAVE_RS = function (obj) {
        app.groupMgr.onLeaveGroup(obj);
    };
    Router.prototype.ON_GROUP_LEAVE_NF = function (obj) {
        app.groupMgr.onLeaveGroupNotify(obj);
    };
    Router.prototype.ON_GROUP_PULL_IN_RS = function (obj) {
        app.groupMgr.onPullInGroup(obj);
    };
    Router.prototype.ON_GROUP_PULL_IN_NF = function (obj) {
        app.groupMgr.onPullInGroupNotify(obj);
    };
    Router.prototype.ON_GROUP_FIRE_OUT_RS = function (obj) {
        app.groupMgr.onFireOutGroup(obj);
    };
    Router.prototype.ON_GROUP_FIRE_OUT_NF = function (obj) {
        app.groupMgr.onFireOutGroupNotify(obj);
    };
    Router.prototype.ON_CALL_WEBRTC_SIGNAL_NF = function (obj) {
        app.callMgr.onCallWebrtcSignalNotify(obj);
    };
    Router.prototype.ON_CALL_OUT_RS = function (obj) {
        app.callMgr.onCallOut(obj);
    };
    Router.prototype.ON_CALL_IN_NF = function (obj) {
        app.callMgr.onCallInNotify(obj);
    };
    Router.prototype.ON_CALL_IN_REPLY_NF = function (obj) {
        app.callMgr.onCallInReplyNotify(obj);
    };
    Router.prototype.ON_CALL_HANGUP_RS = function (obj) {
        app.callMgr.onCallHangup(obj);
    };
    Router.prototype.ON_CALL_HANGUP_NF = function (obj) {
        app.callMgr.onCallHangupNotify(obj);
    };

    return new Router();
})();

},{}],9:[function(require,module,exports){
'use strict';

module.exports = (function () {
    "use strict";
    var router = require('./router');
    function SocketMgr() {}
    SocketMgr.prototype.start = function (url) {
        app.socket = io.connect(url, {
            connect_timeout: 3000
        });
        app.socket.on('connect', function (obj) {
            console.log("connect to server");
            router.ON_CONNECT();
        }).on('disconnect', function (obj) {
            console.log("disconnect to server");
            router.ON_DISCONNECT();
        }).on('connect_error', function (obj) {
            console.error("connect to server error");
            //app.showError(app.error.CANNOT_CONNECT_CHAT_SERVER);
        }).on('connect_timeout', function (obj) {
            console.error("connect to server timeout");
        }).on('reconnect', function (obj) {
            console.log(" reconnect to server");
            router.ON_RECONNECT();
        }).on('reconnect_error', function (obj) {
            console.error("reconnect to server error");
            //app.showError(app.error.CANNOT_CONNECT_CHAT_SERVER);
        }).on('reconnect_failed', function (obj) {
            console.error("reconnect to server failed");
            //app.showError(app.error.CANNOT_CONNECT_CHAT_SERVER);
        }).on('USER_REGISTER_RS', function (obj) {
            app.router.ON_USER_REGISTER_RS(obj);
        }).on('USER_REGISTER_NF', function (obj) {
            app.router.ON_USER_REGISTER_NF(obj);
        }).on('USER_LOGIN_RS', function (obj) {
            router.ON_USER_LOGIN_RS(obj);
        }).on('USER_LOGOUT_NF', function (obj) {
            router.ON_USER_LOGOUT_NF(obj);
        }).on('USER_LOGIN_NF', function (obj) {
            router.ON_USER_LOGIN_NF(obj);
        }).on('USERS_LIST_NF', function (obj) {
            router.ON_USERS_LIST_NF(obj);
        }).on('GROUP_LIST_NF', function (obj) {
            router.ON_GROUP_LIST_NF(obj);
        }).on('USERS_NOTIFY_NF', function (obj) {
            router.ON_USERS_NOTIFY_NF(obj);
        }).on('USER_SEND_MESSAGE_RS', function (obj) {
            router.ON_USER_SEND_MESSAGE_RS(obj);
        }).on('USER_MESSAGE_NF', function (obj) {
            router.ON_USER_MESSAGE_NF(obj);
        }).on('USER_MESSAGE_RECEIVED_NF', function (obj) {
            router.ON_USER_MESSAGE_RECEIVED_NF(obj);
        }).once('USER_OFFONLINE_MESSAGE_NF', function (obj) {
            router.ON_USER_OFFONLINE_MESSAGE_NF(obj);
        }).on('USER_GET_MESSAGE_RS', function (obj) {
            router.ON_USER_GET_MESSAGE_RS(obj);
        }).on('USERS_UPDATE_HEAD_RS', function (obj) {
            router.ON_USERS_UPDATE_HEAD_RS(obj);
        }).on('USERS_UPDATE_HEAD_NF', function (obj) {
            router.ON_USERS_UPDATE_HEAD_NF(obj);
        }).on('USERS_GET_HEAD_RS', function (obj) {
            router.ON_USERS_GET_HEAD_RS(obj);
        }).on('USERS_UPDATE_USERINFO_RS', function (obj) {
            router.ON_USERS_UPDATE_USERINFO_RS(obj);
        }).on('USERS_UPDATE_USERINFO_NF', function (obj) {
            router.ON_USERS_UPDATE_USERINFO_NF(obj);
        }).on('GROUP_LIST_RS', function (obj) {
            router.ON_GROUP_LIST_RS(obj);
        }).on('GROUP_INFO_RS', function (obj) {
            router.ON_GROUP_INFO_RS(obj);
        }).on('GROUP_CREATE_RS', function (obj) {
            router.ON_GROUP_CREATE_RS(obj);
        }).on('GROUP_MODIFY_RS', function (obj) {
            router.ON_GROUP_MODIFY_RS(obj);
        }).on('GROUP_DELETE_RS', function (obj) {
            router.ON_GROUP_DELETE_RS(obj);
        }).on('GROUP_DELETE_NF', function (obj) {
            router.ON_GROUP_DELETE_NF(obj);
        }).on('GROUP_JOIN_RS', function (obj) {
            router.ON_GROUP_JOIN_RS(obj);
        }).on('GROUP_JOIN_NF', function (obj) {
            router.ON_GROUP_JOIN_NF(obj);
        }).on('GROUP_LEAVE_RS', function (obj) {
            router.ON_GROUP_LEAVE_RS(obj);
        }).on('GROUP_LEAVE_NF', function (obj) {
            router.ON_GROUP_LEAVE_NF(obj);
        }).on('GROUP_PULL_IN_RS', function (obj) {
            router.ON_GROUP_PULL_IN_RS(obj);
        }).on('GROUP_PULL_IN_NF', function (obj) {
            router.ON_GROUP_PULL_IN_NF(obj);
        }).on('GROUP_FIRE_OUT_RS', function (obj) {
            router.ON_GROUP_FIRE_OUT_RS(obj);
        }).on('GROUP_FIRE_OUT_NF', function (obj) {
            router.ON_GROUP_FIRE_OUT_NF(obj);
        }).on('CALL_WEBRTC_SIGNAL_NF', function (obj) {
            router.ON_CALL_WEBRTC_SIGNAL_NF(obj);
        }).on('CALL_OUT_RS', function (obj) {
            router.ON_CALL_OUT_RS(obj);
        }).on('CALL_IN_NF', function (obj) {
            router.ON_CALL_IN_NF(obj);
        }).on('CALL_IN_REPLY_NF', function (obj) {
            router.ON_CALL_IN_REPLY_NF(obj);
        }).on('CALL_HANGUP_RS', function (obj) {
            router.ON_CALL_HANGUP_RS(obj);
        }).on('CALL_HANGUP_NF', function (obj) {
            router.ON_CALL_HANGUP_NF(obj);
        });
    };
    return new SocketMgr();
})();

},{"./router":8}],10:[function(require,module,exports){
'use strict';

var _ = require('underscore');

module.exports = (function () {
    "use strict";
    function LoginMgr() {}

    LoginMgr.prototype.login = function (userid, password, autoLogin, remeberPassword) {
        if (!app.chatconnect) {
            app.toast('chat server not connected');
            return;
        }
        var reconnect = !userid;
        if (!reconnect) {
            this.userid = userid;
            this.password = password;
            this.autoLogin = autoLogin;
            this.remeberPassword = remeberPassword;
        } else {
            userid = this.userid;
            password = this.password;
        }
        if (!userid || !password) {
            console.log("reconnect without user");
            return;
        }
        var param = {
            userid: userid,
            password: password,
            reconnect: reconnect
        };
        this.reconnect = reconnect;
        app.showWait();
        app.socket.emit('USER_LOGIN_RQ', param);
    };
    LoginMgr.prototype.autoLogin = function (userid, password, autoLogin, remeberPassword) {
        var self = this;
        var time = 0;
        async.until(function () {
            return app.chatconnect || time > 3000;
        }, function (c) {
            time += 100;setTimeout(c, 100);
        }, function () {
            self.login(userid, password, autoLogin, remeberPassword);
        });
    };
    LoginMgr.prototype.onLogin = function (obj) {
        console.log(obj);
        app.hideWait();
        if (obj.error) {
            app.showChatError(obj.error);
            return;
        }
        if (!this.reconnect) {
            var us = app.us;
            var constants = app.constants;
            var userid = obj.userid;
            us.string(constants.LOGIN_USER_ID, userid);
            if (this.remeberPassword) {
                us.string(constants.LOGIN_PASSWORD, obj.password);
            } else {
                us.string(constants.LOGIN_PASSWORD, '');
            }
            us.bool(constants.LOGIN_AUTO_LOGIN, this.autoLogin);
            var option = {
                indexes: [{ name: "time", unique: false }],
                capped: { name: "time", max: 1000, direction: 1, strict: true }
            };
            app.db_history_message = indexed('history_message_' + userid).create(option);
            app.db_newest_message = indexed('newest_message_' + userid).create();
            app.db_user_head = indexed('user_head_' + userid).create();
            app.db_user_head.find(function (err, docs) {
                _.each(docs, function (doc) {
                    $.insertStyleSheet(app.userHeadCss, '.user_head_' + doc.userid, 'background-image:url(' + doc.head + ')');
                });
            });
        }
        app.socket.emit('USER_LOGIN_SUCCESS_NFS');
        this.online = true;
        app.messageMgr.getNewestMessage();
        app.showView('home', 'fade', null, true);
    };
    LoginMgr.prototype.onRegister = function (obj) {
        console.log(obj);
        if (obj.error) {
            app.showChatError(obj.error);
            return;
        }
        app.toast("Register Success");
        app.goBack();
    };
    LoginMgr.prototype.onRegisterNotify = function (obj) {
        console.log(obj);
        app.userMgr.add({ userid: obj.userid, username: obj.username, sign: obj.sign });
        app.notifyMgr.updateUserHead({ userid: obj.userid, head: obj.head });
        app.userMgr.emitChange();
    };

    return new LoginMgr();
})();

},{"underscore":46}],11:[function(require,module,exports){
"use strict";

var _ = require("underscore");
module.exports = (function () {
    "use strict";
    function NotifyMgr() {}

    NotifyMgr.prototype.onNotify = function (obj) {
        app.emit('USERS_NOTIFY_NFS');
        console.log(obj);
        var have_head_users = [];
        app.db_user_head.find(function (err, docs) {
            _.each(docs, function (doc) {
                have_head_users.push(doc.userid);
            });
            var have_notify_users = [];
            var head = obj.head;
            for (var i = 0, len = head.length; i < len; i++) {
                var item = head[i];
                this.updateUserHead(item);
                have_notify_users.push(item.userid);
            }

            var users = app.userMgr.users;
            var all_users = _.keys(users);
            var need_update_users = _.difference(all_users, have_notify_users, have_head_users);
            app.emit('USERS_GET_HEAD_RQ', need_update_users);
        });
    };
    NotifyMgr.prototype.updateUserHead = function (obj) {
        var userid = obj.userid;
        var head = obj.head;
        app.db_user_head.upsert({ userid: userid }, { head: head });
        $.upsertStyleSheet(app.userHeadCss, '.user_head_' + userid, 'background-image:url(' + head + ')');
    };
    NotifyMgr.prototype.onGetUserHead = function (obj) {
        for (var i = 0, len = obj.length; i < len; i++) {
            var item = obj[i];
            this.updateUserHead(item);
        }
    };

    return new NotifyMgr();
})();

},{"underscore":46}],12:[function(require,module,exports){
'use strict';

var _ = require('underscore');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

module.exports = (function () {
    "use strict";
    function UserMgr() {
        assign(this, EventEmitter.prototype);
        this.reset();
    }

    UserMgr.prototype.emitChange = function () {
        this.emit("change");
    };
    UserMgr.prototype.addChangeListener = function (callback) {
        this.on("change", callback);
    };
    UserMgr.prototype.removeChangeListener = function (callback) {
        this.removeListener("change", callback);
    };
    UserMgr.prototype.reset = function () {
        this.users = {};
        this.groupedUsers = {}; //use alpha grouped
        this.init = false;
    };
    UserMgr.prototype.add = function (obj) {
        var users = this.users;
        var userid = obj.userid;
        if (!users.hasOwnProperty(userid)) {
            users[userid] = obj;
            this.addGroupedUser(userid);
            this.emitChange();
        }
    };
    UserMgr.prototype.remove = function (obj) {
        var users = this.users;
        var userid = obj.userid;
        if (users.hasOwnProperty(userid)) {
            var username = users[userid].username;
            delete users[userid];
            this.removeGroupedUser(userid, username);
            this.emitChange();
        }
    };
    UserMgr.prototype.online = function (obj) {
        var userid = obj.userid;
        this.users[userid].online = true;
        this.emitChange();
        console.log("red@" + userid, "login");
    };
    UserMgr.prototype.offline = function (obj) {
        var userid = obj.userid;
        this.users[userid].online = false;
        this.emitChange();
        console.log("red@" + userid, "logout");
    };
    UserMgr.prototype.addList = function (list) {
        var users = this.users;
        for (var i in list) {
            var userid = list[i].userid;
            if (!users.hasOwnProperty(userid)) {
                users[userid] = list[i];
                this.addGroupedUser(userid);
            }
        }
        this.emitChange();
        this.init = true;
    };
    UserMgr.prototype.addGroupedUser = function (userid) {
        if (app.loginMgr.userid === userid) {
            return;
        }
        var user = this.users[userid];
        var username = user.username;
        var alpha = $.fisrtPinyin(username);
        var list = this.groupedUsers;
        if (!list[alpha]) {
            list[alpha] = [];
        }
        list[alpha].push(userid);
    };
    UserMgr.prototype.removeGroupedUser = function (userid, username) {
        var alpha = $.fisrtPinyin(username);
        var list = this.groupedUsers[alpha];
        if (list) {
            list = _.without(list, userid);
            if (list.length === 0) {
                delete this.groupedUsers[alpha];
            } else {
                this.groupedUsers[alpha] = list;
            }
        }
    };
    UserMgr.prototype.getUseridByUsername = function (username) {
        var users = this.users;
        for (var id in users) {
            var user = users[id];
            if (username == user.username) {
                return id;
            }
        }
        return null;
    };
    UserMgr.prototype.updateHead = function (head) {
        app.emit('USERS_UPDATE_HEAD_RQ', { head: head });
    };
    UserMgr.prototype.updateUserInfo = function (username, phone, sign) {
        app.emit('USERS_UPDATE_USERINFO_RQ', { username: username, phone: phone, sign: sign });
    };
    UserMgr.prototype.onUpdateUserInfoNotify = function (obj) {
        console.log(obj);
        var users = this.users;
        var userid = obj.userid;
        if (users.hasOwnProperty(userid)) {
            users[userid].username = obj.username;
            users[userid].phone = obj.phone;
            users[userid].sign = obj.sign;
            this.emitChange();
        }
    };

    return new UserMgr();
})();

},{"events":42,"object-assign":44,"underscore":46}],13:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var List = UI.List;
var Grid = UI.Grid;
var Card = UI.Card;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Button = UI.Button.Button;

module.exports = React.createClass({
    displayName: 'exports',

    componentWillMount: function componentWillMount() {
        this.userid = this.props.data.param.userid;
    },
    componentDidMount: function componentDidMount() {
        app.userMgr.addChangeListener(this._onChange);
    },
    componentWillUnmount: function componentWillUnmount() {
        app.userMgr.removeChangeListener(this._onChange);
    },
    _onChange: function _onChange() {
        this.forceUpdate();
    },
    systemCall: function systemCall() {
        navigator.utils.callNumber(this.userid);
    },
    systemMessage: function systemMessage() {
        navigator.utils.sendSms(this.userid);
    },
    sendMessage: function sendMessage() {
        var param = {
            type: app.messageMgr.USER_TYPE,
            userid: this.userid
        };
        app.showView('messageInfo', 'fade', param);
    },
    audioCall: function audioCall(online) {
        if (!online) {
            app.toast("对方不在线");
            return;
        }
        var param = {
            userid: this.userid
        };
        app.showView('audioCall', 'fade', param);
    },
    videoCall: function videoCall(online) {
        if (!online) {
            app.toast("对方不在线");
            return;
        }
        var param = {
            userid: this.userid
        };
        app.showView('videoCall', 'fade', param);
    },
    render: function render() {
        var userid = this.userid;
        var user = app.userMgr.users[userid];
        var username = user.username;
        var sign = user.sign || "这个家伙很懒，什么都没有留下";
        var callButtonColor = user.online ? "green" : "gray";
        return React.createElement(
            View.Page,
            { title: 'Contact Info' },
            React.createElement(
                View.PageContent,
                null,
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        List.List,
                        { block: true, media: true },
                        React.createElement(
                            List.ItemContent,
                            null,
                            React.createElement(
                                List.ItemMedia,
                                null,
                                React.createElement('div', { className: "big_user_head default_head user_head_" + userid })
                            ),
                            React.createElement(
                                List.ItemInner,
                                { style: { fontSize: "2em" } },
                                React.createElement(
                                    List.ItemTitleRow,
                                    null,
                                    React.createElement(
                                        List.ItemTitle,
                                        { style: app.color.usernameColor(user) },
                                        username
                                    )
                                ),
                                React.createElement(
                                    List.ItemText,
                                    { style: { fontSize: "0.8em" } },
                                    React.createElement(
                                        'span',
                                        { style: { color: "olivedrab" } },
                                        userid
                                    ),
                                    React.createElement('span', { className: 'ion-ios7-telephone', style: { marginLeft: "5%", color: "green" }, onClick: this.systemCall }),
                                    React.createElement('span', { className: 'ion-chatbox-working', style: { marginLeft: "12%", color: "green" }, onClick: this.systemMessage })
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    Card.Card,
                    { header: '个性签名:', inner: true },
                    sign
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        Grid.Row,
                        null,
                        React.createElement(
                            Grid.Col,
                            null,
                            React.createElement(
                                Button,
                                { big: true, fill: true, color: 'green', onTap: this.sendMessage },
                                'Send Message'
                            )
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        Grid.Row,
                        null,
                        React.createElement(
                            Grid.Col,
                            { per: 50 },
                            React.createElement(
                                Button,
                                { big: true, fill: true, color: callButtonColor, onTap: this.audioCall.bind(null, user.online) },
                                'Audio Call'
                            )
                        ),
                        React.createElement(
                            Grid.Col,
                            { per: 50 },
                            React.createElement(
                                Button,
                                { big: true, fill: true, color: callButtonColor, onTap: this.videoCall.bind(null, user.online) },
                                'Video Call'
                            )
                        )
                    )
                )
            )
        );
    }
});

},{"UI":41,"react":undefined}],14:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');
var _ = require('underscore');
var Contacts = require('../home/pages/contacts');

var View = UI.View;
var Content = UI.Content;
var Grid = UI.Grid;
var List = UI.List;
var Select = UI.Select;
var Icon = UI.Icon.Icon;
var Button = UI.Button.Button;
var ButtonsRow = UI.Button.ButtonsRow;

module.exports = React.createClass({
    displayName: 'exports',

    componentWillMount: function componentWillMount() {
        var value = this.props.data.param.value;
        this.users = value;
        this.originUsers = value;
        if (_.isArray(value)) {
            this.type = "checkbox";
            var list = value.concat();
            var self = this;
            this.onChange = function (val, checked) {
                if (checked) {
                    list.push(val);
                } else {
                    list = _.without(list, val);
                }
                self.users = list;
            };
        } else {
            this.type = "radio";
            var self = this;
            this.onChange = function (val) {
                self.users = val;
            };
        }
    },
    doSetSelectUsers: function doSetSelectUsers() {
        app.goBack(1, { users: this.users });
    },
    goBack: function goBack() {
        app.goBack(1, { users: this.originUsers });
        return true;
    },
    render: function render() {
        var value = this.props.data.param.value;
        var type = this.type;
        return React.createElement(
            View.Page,
            { title: 'Select Users', goBack: this.goBack },
            React.createElement(
                View.PageContent,
                null,
                React.createElement(Contacts, { select: { type: type, name: "contacts-" + type, 'default': value, onChange: this.onChange }, data: { param: {} } }),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        Grid.Row,
                        null,
                        React.createElement(
                            Grid.Col,
                            null,
                            React.createElement(
                                Button,
                                { big: true, fill: true, color: 'green', onTap: this.doSetSelectUsers },
                                '确定'
                            )
                        )
                    )
                )
            )
        );
    }
});

},{"../home/pages/contacts":21,"UI":41,"react":undefined,"underscore":46}],15:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var List = UI.List;
var Grid = UI.Grid;
var Card = UI.Card;
var Modal = UI.Modal;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Switch = UI.Form.Switch;
var Button = UI.Button.Button;

var FormItem = React.createClass({
    displayName: 'FormItem',

    render: function render() {
        return React.createElement(
            List.ItemContent,
            null,
            this.props.icon && React.createElement(
                List.ItemMedia,
                null,
                React.createElement(Icon, { name: this.props.icon })
            ),
            React.createElement(
                List.ItemInner,
                null,
                this.props.label && React.createElement(
                    List.ItemTitle,
                    { label: true },
                    this.props.label
                ),
                React.createElement(
                    List.ItemInput,
                    null,
                    this.props.children
                )
            )
        );
    }
});

var FormInputItem = React.createClass({
    displayName: 'FormInputItem',

    render: function render() {
        return React.createElement(
            FormItem,
            { icon: this.props.icon, label: this.props.label },
            React.createElement('input', { type: this.props.input_type, placeholder: this.props.placeholder, value: this.props.value, onChange: this.props.onChange })
        );
    }
});

var ContactItem = React.createClass({
    displayName: 'ContactItem',

    render: function render() {
        var userid = this.props.userid;
        var user = app.userMgr.users[userid];
        var username = user.username;
        return React.createElement(
            List.ItemContent,
            { swipeout: true, swipeoutRight: React.createElement(
                    'a',
                    { className: 'swipeout-delete', onClick: this.props.onDelete.bind(null, userid) },
                    'Delete'
                ) },
            React.createElement(
                List.ItemMedia,
                null,
                React.createElement(Icon, { name: "default_head user_head_" + userid, round: true })
            ),
            React.createElement(
                List.ItemInner,
                null,
                React.createElement(
                    List.ItemTitle,
                    { style: app.color.usernameColor(user) },
                    username
                )
            )
        );
    }
});

var ButtonItem = React.createClass({
    displayName: 'ButtonItem',

    render: function render() {
        return React.createElement(
            Content.ContentBlock,
            null,
            React.createElement(
                Grid.Row,
                null,
                React.createElement(
                    Grid.Col,
                    null,
                    React.createElement(
                        Button,
                        { big: true, fill: true, color: this.props.color, onTap: this.props.onTap },
                        this.props.label
                    )
                )
            )
        );
    }
});

module.exports = React.createClass({
    displayName: 'exports',

    getInitialState: function getInitialState() {
        var param = this.props.data.param;
        var saved = param.saved || {};
        var from = this.props.data.from;
        if (from === "groupDetail") {
            var group = app.groupMgr.list[param.groupid];
            this.groupid = param.groupid;
            return {
                type: group.type,
                groupname: group.name,
                members: group.members
            };
        } else {
            this.groupid = saved.groupid;
            console.log(param);
            return {
                type: saved.type || false,
                groupname: saved.groupname || '',
                members: param.users || []
            };
        }
    },
    componentDidMount: function componentDidMount() {
        app.groupMgr.addEventListener(this._onListener);
    },
    componentWillUnmount: function componentWillUnmount() {
        app.groupMgr.removeEventListener(this._onListener);
    },
    _onListener: function _onListener(obj) {
        var type = obj.type;
        switch (type) {
            case "ON_CREATE_GROUP":
                obj.error ? app.showChatError(obj.error) : app.toast("创建群组成功");
                app.hideWait();
                app.goBack();
                break;
            case "ON_MODIFY_GROUP":
                obj.error ? app.showChatError(obj.error) : app.toast("修改群组成功");
                app.hideWait();
                app.goBack();
                break;
            case "ON_REMOVE_GROUP":
                obj.error ? app.showChatError(obj.error) : app.toast("解散群组成功");
                app.hideWait();
                app.goBack(2);
                break;
            case "ON_UPDATE_GROUP":
                if (this.props.data.from === "groupDetail" && this.groupid === obj.id) {
                    var group = app.groupMgr.list[obj.id];
                    this.setState({
                        type: group.type,
                        groupname: group.name,
                        members: group.members
                    });
                }
                break;
            default:
                ;
        }
    },
    handleInputChange: function handleInputChange(type, e) {
        var state = {};
        state[type] = e.target.value;
        this.setState(state);
    },
    handleSwitchChange: function handleSwitchChange(type, checked) {
        var state = {};
        state[type] = checked;
        this.setState(state);
    },
    onDelete: function onDelete(userid, e) {
        var clicked = $(e.target);
        var self = this;
        this.refs.list.swipeout['delete'](clicked.parents('.swipeout'), function () {
            self.setState({ members: _.without(self.state.members, userid) });
        });
    },
    addMembers: function addMembers() {
        var param = {
            value: this.state.members,
            saved: {
                type: this.state.type,
                groupname: this.state.groupname,
                groupid: this.groupid
            }
        };
        app.showView('selectUsers', 'left', param);
    },
    doCreateGroup: function doCreateGroup() {
        var name = this.state.groupname;
        var members = this.state.members;
        var type = this.state.type;
        app.showWait();
        app.groupMgr.createGroup(name, members, type);
    },
    doModifyGroup: function doModifyGroup() {
        var name = this.state.groupname;
        var members = this.state.members;
        var type = this.state.type;
        app.showWait();
        app.groupMgr.modifyGroup(this.groupid, name, members, type);
    },
    doDeleteGroup: function doDeleteGroup() {
        var self = this;
        var confirm = React.createElement(Modal.Confirm, { title: '警告', text: '你确定要解散该群吗?',
            okFunc: function () {
                app.showWait();
                app.groupMgr.removeGroup(self.groupid);
            }
        });
        app.showModal('modal', confirm);
    },
    render: function render() {
        var _this = this;

        var title;
        var buttons = [];
        if (this.groupid == null) {
            title = "创建群组";
            buttons.push(React.createElement(ButtonItem, { key: 'createGroup', color: 'green', label: '创建', onTap: this.doCreateGroup }));
        } else {
            title = "修改群组";
            buttons.push(React.createElement(ButtonItem, { key: 'modifyGroup', color: 'green', label: '确认修改', onTap: this.doModifyGroup }));
            buttons.push(React.createElement(ButtonItem, { key: 'deleteGroup', color: 'red', label: '解散群组', onTap: this.doDeleteGroup }));
        }
        return React.createElement(
            View.Page,
            { title: title },
            React.createElement(
                View.PageContent,
                null,
                React.createElement(
                    List.List,
                    null,
                    React.createElement(FormInputItem, { icon: 'icon-form-name', label: '群组名称:', input_type: 'text', placeholder: '例如:讨论组', value: this.state.groupname, onChange: this.handleInputChange.bind(this, "groupname") }),
                    React.createElement(
                        List.ItemContent,
                        null,
                        React.createElement(
                            List.ItemMedia,
                            null,
                            React.createElement(Icon, { name: "icon-form-toggle" })
                        ),
                        React.createElement(
                            List.ItemInner,
                            null,
                            React.createElement(
                                List.ItemTitle,
                                { label: true, style: { width: '80%' } },
                                '私有群组:'
                            ),
                            React.createElement(
                                List.ItemInput,
                                null,
                                React.createElement(Switch, { checked: this.state.type, onChange: this.handleSwitchChange.bind(this, "type") })
                            )
                        )
                    ),
                    React.createElement(
                        List.ItemContent,
                        { onTap: this.addMembers },
                        React.createElement(
                            List.ItemMedia,
                            null,
                            React.createElement(Icon, { name: 'ion-ios7-people' })
                        ),
                        React.createElement(
                            List.ItemInner,
                            null,
                            React.createElement(
                                List.ItemTitle,
                                null,
                                '群组成员'
                            ),
                            React.createElement(
                                List.ItemAfter,
                                null,
                                React.createElement(Icon, { color: 'green', name: 'ion-plus-circled' })
                            )
                        )
                    ),
                    React.createElement(
                        List.List,
                        { inset: true, swipeout: true, ref: 'list' },
                        this.state.members.map(function (userid) {
                            return React.createElement(ContactItem, { key: userid, userid: userid, onDelete: _this.onDelete });
                        })
                    )
                ),
                buttons
            )
        );
    }
});

},{"UI":41,"react":undefined}],16:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var List = UI.List;
var Grid = UI.Grid;
var Modal = UI.Modal;
var Card = UI.Card;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Switch = UI.Form.Switch;
var Button = UI.Button.Button;

var ContactItem = React.createClass({
    displayName: 'ContactItem',

    render: function render() {
        var userid = this.props.userid;
        var user = app.userMgr.users[userid];
        return React.createElement(
            List.ItemContent,
            null,
            React.createElement(
                List.ItemMedia,
                null,
                React.createElement(Icon, { name: "default_head user_head_" + userid, round: true })
            ),
            React.createElement(
                List.ItemInner,
                null,
                React.createElement(
                    List.ItemTitle,
                    { style: app.color.usernameColor(user) },
                    user.username
                )
            )
        );
    }
});

var MemberList = React.createClass({
    displayName: 'MemberList',

    render: function render() {
        var members = this.props.members;
        return React.createElement(
            List.List,
            { group: true },
            React.createElement(
                'ul',
                { style: { paddingLeft: "10px" } },
                members.map(function (userid) {
                    return React.createElement(ContactItem, { key: userid, userid: userid });
                })
            )
        );
    }
});

var FormLabelItem = React.createClass({
    displayName: 'FormLabelItem',

    render: function render() {
        console.log(this.props.value);
        return React.createElement(
            List.ItemContent,
            null,
            React.createElement(
                List.ItemMedia,
                null,
                React.createElement(Icon, { name: this.props.icon })
            ),
            React.createElement(
                List.ItemInner,
                null,
                React.createElement(
                    List.ItemTitle,
                    { label: true },
                    this.props.label
                ),
                React.createElement(
                    List.ItemInput,
                    null,
                    React.createElement('input', { type: 'text', value: this.props.value, readonly: true })
                )
            )
        );
    }
});

var ButtonItem = React.createClass({
    displayName: 'ButtonItem',

    render: function render() {
        return React.createElement(
            Content.ContentBlock,
            null,
            React.createElement(
                Grid.Row,
                null,
                React.createElement(
                    Grid.Col,
                    null,
                    React.createElement(
                        Button,
                        { big: true, fill: true, color: this.props.color, onTap: this.props.onTap },
                        this.props.label
                    )
                )
            )
        );
    }
});

module.exports = React.createClass({
    displayName: 'exports',

    getInitialState: function getInitialState() {
        var param = this.props.data.param;
        this.search = this.props.data.from === "searchGroupList";
        var group = param.group || app.groupMgr.list[param.saved.groupid];
        return {
            group: group
        };
    },
    componentDidMount: function componentDidMount() {
        app.groupMgr.addEventListener(this._onListener);
        app.userMgr.addChangeListener(this._onChange);
    },
    componentWillUnmount: function componentWillUnmount() {
        app.groupMgr.removeEventListener(this._onListener);
        app.userMgr.removeChangeListener(this._onChange);
    },
    _onListener: function _onListener(obj) {
        var type = obj.type;
        switch (type) {
            case "ON_LEAVE_GROUP":
                obj.error ? app.showChatError(obj.error) : app.toast("退出群组成功");
                app.hideWait();
                app.goBack();
                break;
            case "ON_JOIN_GROUP":
                obj.error ? app.showChatError(obj.error) : app.toast("加入群组成功");
                app.hideWait();
                app.goBack(3);
                break;
            case "ON_UPDATE_GROUP":
                if (this.state.group.id === obj.id) {
                    this.setState({ group: app.groupMgr.list[obj.id] });
                }
                break;
            case "ON_FIRE_OUT_GROUP":
                if (this.state.group.id === obj.id) {
                    app.toast("你已经被踢出了这个群");
                    app.goBack();
                }
                break;
            default:
                ;
        }
    },
    _onChange: function _onChange() {
        this.forceUpdate();
    },
    doGroupChat: function doGroupChat() {
        var group = this.state.group;
        app.showView('messageInfo', 'left', {
            type: app.messageMgr.GROUP_TYPE,
            groupid: group.id,
            saved: { groupid: group.id }
        });
    },
    doManageGroup: function doManageGroup() {
        var group = this.state.group;
        app.showView('createGroup', 'left', {
            groupid: group.id,
            saved: { groupid: group.id }
        });
    },
    doLeaveGroup: function doLeaveGroup() {
        var groupid = this.state.group.id;
        var confirm = React.createElement(Modal.Confirm, { title: '警告', text: '你确定要退出该群吗?',
            okFunc: function () {
                app.showWait();
                app.groupMgr.leaveGroup(groupid);
            }
        });
        app.showModal('modal', confirm);
    },
    doAddGroup: function doAddGroup() {
        app.showWait();
        app.groupMgr.joinGroup(this.state.group.id);
    },
    render: function render() {
        var group = this.state.group;
        var creator = app.userMgr.users[group.creator].username;
        var selfid = app.loginMgr.userid;
        var buttons = [];
        if (this.search) {
            buttons.push(React.createElement(ButtonItem, { key: 'addGroup', color: 'green', label: '加入群组', onTap: this.doAddGroup }));
        } else {
            buttons.push(React.createElement(ButtonItem, { key: 'groupChat', color: 'green', label: '发消息', onTap: this.doGroupChat }));
            if (group.creator === selfid) {
                buttons.push(React.createElement(ButtonItem, { key: 'manageGroup', color: 'green', label: '管理群组', onTap: this.doManageGroup }));
            } else {
                buttons.push(React.createElement(ButtonItem, { key: 'leaveGroup', color: 'red', label: '退出群组', onTap: this.doLeaveGroup }));
            }
        }

        return React.createElement(
            View.Page,
            { title: '群组详情' },
            React.createElement(
                View.PageContent,
                null,
                React.createElement(
                    List.List,
                    null,
                    React.createElement(FormLabelItem, { icon: 'icon-form-tel', label: '群组名称:', value: group.name }),
                    React.createElement(FormLabelItem, { icon: 'icon-form-name', label: '创建者:', value: creator }),
                    React.createElement(FormLabelItem, { icon: 'icon-form-tel', label: '群组类型:', value: group.type ? "私有群组" : "公有群组" }),
                    React.createElement(
                        UI.Accordion.AccordionItem,
                        { list: true, content: React.createElement(MemberList, { members: group.members }) },
                        React.createElement(
                            List.ItemLink,
                            null,
                            React.createElement(
                                List.ItemMedia,
                                null,
                                React.createElement(Icon, { name: "icon-form-name" })
                            ),
                            React.createElement(
                                List.ItemInner,
                                null,
                                React.createElement(
                                    List.ItemTitle,
                                    { label: true, style: { width: '80%' } },
                                    '群组成员:'
                                ),
                                React.createElement(
                                    List.ItemAfter,
                                    null,
                                    React.createElement(
                                        Badge,
                                        { color: 'green' },
                                        group.members.length
                                    )
                                )
                            )
                        )
                    )
                ),
                buttons
            )
        );
    }
});

},{"UI":41,"react":undefined}],17:[function(require,module,exports){
'use strict';

var React = require('react');
var assign = require('object-assign');
var UI = require('UI');

var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;
var View = UI.View;

var MenuItem = React.createClass({
    displayName: 'MenuItem',

    getDefaultProps: function getDefaultProps() {
        return { color: "blue" };
    },
    render: function render() {
        return React.createElement(
            List.ItemContent,
            { onTap: this.props.onTap },
            React.createElement(
                List.ItemMedia,
                null,
                React.createElement(Icon, { name: this.props.icon })
            ),
            React.createElement(
                List.ItemInner,
                null,
                React.createElement(
                    List.ItemTitle,
                    { style: { color: this.props.color, fontWeight: "bold" } },
                    this.props.label
                )
            )
        );
    }
});

var MenuList = React.createClass({
    displayName: 'MenuList',

    createGroup: function createGroup() {
        app.showView("createGroup", "left");
    },
    searchGroup: function searchGroup() {
        app.showView("searchGroup", "left");
    },
    render: function render() {
        return React.createElement(
            List.ListGroup,
            null,
            React.createElement(MenuItem, { icon: 'img_create_group', label: '新建一个群', onTap: this.createGroup }),
            React.createElement(MenuItem, { icon: 'img_send_multi', label: '加入群组', onTap: this.searchGroup })
        );
    }
});

var GroupItem = React.createClass({
    displayName: 'GroupItem',

    showGroupInfo: function showGroupInfo(group) {
        var param = { group: group };
        app.showView("groupDetail", "left", param);
    },
    render: function render() {
        var groupid = this.props.groupid;
        var icon = "group_head_" + groupid;
        var group = app.groupMgr.list[groupid];
        var groupname = group.name;
        return React.createElement(
            List.ItemContent,
            { onTap: this.showGroupInfo.bind(this, group) },
            React.createElement(
                List.ItemMedia,
                null,
                React.createElement(Icon, { name: "default_head " + icon })
            ),
            React.createElement(
                List.ItemInner,
                null,
                React.createElement(
                    List.ItemTitle,
                    null,
                    groupname
                )
            )
        );
    }
});

var GroupGroup = React.createClass({
    displayName: 'GroupGroup',

    render: function render() {
        var groupids = this.props.groupids;
        var letter = this.props.letter;
        return React.createElement(
            List.ListGroup,
            null,
            React.createElement(
                List.ListGroupTitle,
                { data: { 'data-index-letter': letter } },
                letter
            ),
            groupids.map(function (groupid) {
                return React.createElement(GroupItem, { key: groupid, groupid: groupid });
            })
        );
    }
});

var GroupList = React.createClass({
    displayName: 'GroupList',

    render: function render() {
        var alphaList = this.props.alphaList;
        var letters = this.props.letters;
        return React.createElement(
            List.List,
            { block: true, group: true, 'class': 'contacts-block' },
            React.createElement(MenuList, null),
            _.map(letters, function (letter) {
                return React.createElement(GroupGroup, { key: letter, letter: letter, groupids: alphaList[letter] });
            })
        );
    }
});

module.exports = React.createClass({
    displayName: 'exports',

    getInitialState: function getInitialState() {
        var alphaList = app.groupMgr.alphaList;
        return {
            alphaList: alphaList
        };
    },
    componentDidMount: function componentDidMount() {
        app.groupMgr.addEventListener(this._onListener);
    },
    componentWillUnmount: function componentWillUnmount() {
        app.groupMgr.removeEventListener(this._onListener);
    },
    _onListener: function _onListener(obj) {
        var type = obj.type;
        switch (type) {
            case "ON_GROUP_LIST_CHANGE":
                var alphaList = app.groupMgr.alphaList;
                this.setState({
                    alphaList: alphaList
                });
                break;
            case "ON_UPDATE_GROUP":
                this.forceUpdate();
                break;
            default:
                ;
        }
    },
    render: function render() {
        var alphaList = this.state.alphaList;
        var letters = _.keys(alphaList).sort(function (a, b) {
            return a.localeCompare(b);
        });
        return React.createElement(
            View.Page,
            { title: '群聊' },
            React.createElement(
                View.PageContent,
                null,
                React.createElement(GroupList, { alphaList: alphaList, letters: letters })
            ),
            React.createElement(List.IndexedList, { letters: letters })
        );
    }
});

},{"UI":41,"object-assign":44,"react":undefined}],18:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var List = UI.List;
var Grid = UI.Grid;
var Card = UI.Card;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Switch = UI.Form.Switch;
var Button = UI.Button.Button;

var ContactItem = React.createClass({
    displayName: 'ContactItem',

    render: function render() {
        var userid = this.props.userid;
        return React.createElement(
            List.ItemContent,
            null,
            React.createElement(
                List.ItemMedia,
                null,
                React.createElement(Icon, { name: "default_head user_head_" + userid, round: true })
            ),
            React.createElement(
                List.ItemInner,
                null,
                React.createElement(
                    List.ItemTitle,
                    null,
                    'fangyunjiang'
                )
            )
        );
    }
});

var FormItem = React.createClass({
    displayName: 'FormItem',

    render: function render() {
        return React.createElement(
            List.ItemContent,
            null,
            this.props.icon && React.createElement(
                List.ItemMedia,
                null,
                React.createElement(Icon, { name: this.props.icon })
            ),
            React.createElement(
                List.ItemInner,
                null,
                this.props.label && React.createElement(
                    List.ItemTitle,
                    { label: true },
                    this.props.label
                ),
                React.createElement(
                    List.ItemInput,
                    null,
                    this.props.children
                )
            )
        );
    }
});

var FormInputItem = React.createClass({
    displayName: 'FormInputItem',

    render: function render() {
        return React.createElement(
            FormItem,
            { icon: this.props.icon, label: this.props.label },
            React.createElement('input', { type: this.props.input_type, placeholder: this.props.placeholder, value: this.props.value, onChange: this.props.onChange })
        );
    }
});

var ContactItem = React.createClass({
    displayName: 'ContactItem',

    render: function render() {
        var userid = this.props.userid;
        var user = app.userMgr.users[userid];
        var username = user.username;
        return React.createElement(
            List.ItemContent,
            { swipeout: true, swipeoutRight: React.createElement(
                    'a',
                    { className: 'swipeout-delete', onClick: this.props.onDelete.bind(null, userid) },
                    'Delete'
                ) },
            React.createElement(
                List.ItemMedia,
                null,
                React.createElement(Icon, { name: "default_head user_head_" + userid, round: true })
            ),
            React.createElement(
                List.ItemInner,
                null,
                React.createElement(
                    List.ItemTitle,
                    { style: app.color.usernameColor(user) },
                    username
                )
            )
        );
    }
});

module.exports = React.createClass({
    displayName: 'exports',

    getInitialState: function getInitialState() {
        var param = this.props.data.param;
        var saved = param.saved || {};
        if (this.props.data.from === "searchGroupList") {
            console.log(saved);
            return {
                groupname: saved.groupname || '',
                creators: saved.creators,
                members: saved.members
            };
        }
        var obj = {
            groupname: saved.groupname || '',
            creators: [],
            members: []
        };
        if (saved.creators) {
            obj.creators = saved.creators;
            obj.members = param.users || [];
        } else if (saved.members) {
            obj.members = saved.members;
            obj.creators = param.users || [];
        }
        return obj;
    },
    componentDidMount: function componentDidMount() {
        app.groupMgr.addEventListener(this._onListener);
    },
    componentWillUnmount: function componentWillUnmount() {
        app.groupMgr.removeEventListener(this._onListener);
    },
    _onListener: function _onListener(obj) {
        var type = obj.type;
        switch (type) {
            case "ON_GET_GROUP_LIST":
                var groups = obj.groups;
                app.hideWait();
                if (!groups.length) {
                    app.toast("没有符合条件的群组");
                } else {
                    this.showSearchGroupList(groups);
                }
                break;
            default:
                ;
        }
    },
    showSearchGroupList: function showSearchGroupList(groups) {
        var list = {};
        var alphaList = {};
        _.each(groups, function (group) {
            var name = group.name;
            var id = group.id;
            var type = group.type;
            var creator = group.creator;
            var alpha = $.fisrtPinyin(name);
            list[id] = group;
            alphaList[alpha] = alphaList[alpha] || [];
            alphaList[alpha].push(id);
        });
        app.showView("searchGroupList", "fade", {
            alphaList: alphaList,
            list: list,
            saved: {
                creators: this.state.creators,
                members: this.state.members,
                groupname: this.state.groupname
            }
        });
    },
    handleInputChange: function handleInputChange(type, e) {
        var state = {};
        state[type] = e.target.value;
        this.setState(state);
    },
    onDelete: function onDelete(ref, userid, e) {
        var clicked = $(e.target);
        var self = this;
        if (ref === 'creators-list') {
            this.refs[ref].swipeout['delete'](clicked.parents('.swipeout'), function () {
                self.setState({ creators: _.without(self.state.creators, userid) });
            });
        } else {
            this.refs[ref].swipeout['delete'](clicked.parents('.swipeout'), function () {
                self.setState({ members: _.without(self.state.members, userid) });
            });
        }
    },
    addUsers: function addUsers(type) {
        var param;
        if (type === "creators") {
            param = {
                value: this.state.creators,
                saved: {
                    members: this.state.members,
                    groupname: this.state.groupname
                }
            };
        } else {
            param = {
                value: this.state.members,
                saved: {
                    creators: this.state.creators,
                    groupname: this.state.groupname
                }
            };
        }
        app.showView('selectUsers', 'left', param);
    },
    doSearchGroup: function doSearchGroup() {
        app.showWait();
        app.groupMgr.getGroupList(this.state.groupname, this.state.creators, this.state.members);
    },
    render: function render() {
        var _this = this;

        return React.createElement(
            View.Page,
            { title: '搜索群组' },
            React.createElement(
                View.PageContent,
                null,
                React.createElement(
                    List.List,
                    null,
                    React.createElement(FormInputItem, { icon: 'icon-form-email', label: '群组名称:', input_type: 'text', placeholder: '例如:讨论组', value: this.state.groupname, onChange: this.handleInputChange.bind(this, "groupname") }),
                    React.createElement(
                        List.ItemContent,
                        { onTap: this.addUsers.bind(null, "creators") },
                        React.createElement(
                            List.ItemMedia,
                            null,
                            React.createElement(Icon, { name: 'ion-android-contact' })
                        ),
                        React.createElement(
                            List.ItemInner,
                            null,
                            React.createElement(
                                List.ItemTitle,
                                null,
                                '群主:'
                            ),
                            React.createElement(
                                List.ItemAfter,
                                null,
                                React.createElement(Icon, { color: 'green', name: 'ion-plus-circled' })
                            )
                        )
                    ),
                    !!this.state.creators.length && React.createElement(
                        List.List,
                        { inset: true, swipeout: true, ref: 'creators-list' },
                        this.state.creators.map(function (userid) {
                            return React.createElement(ContactItem, { key: userid, userid: userid, onDelete: _this.onDelete.bind(null, "creators-list") });
                        })
                    ),
                    React.createElement(
                        List.ItemContent,
                        { onTap: this.addUsers.bind(null, "members") },
                        React.createElement(
                            List.ItemMedia,
                            null,
                            React.createElement(Icon, { name: 'ion-ios7-people' })
                        ),
                        React.createElement(
                            List.ItemInner,
                            null,
                            React.createElement(
                                List.ItemTitle,
                                null,
                                '包含群成员:'
                            ),
                            React.createElement(
                                List.ItemAfter,
                                null,
                                React.createElement(Icon, { color: 'green', name: 'ion-plus-circled' })
                            )
                        )
                    ),
                    !!this.state.members.length && React.createElement(
                        List.List,
                        { inset: true, swipeout: true, ref: 'members-list' },
                        this.state.members.map(function (userid) {
                            return React.createElement(ContactItem, { key: userid, userid: userid, onDelete: _this.onDelete.bind(null, "members-list") });
                        })
                    )
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        Grid.Row,
                        null,
                        React.createElement(
                            Grid.Col,
                            null,
                            React.createElement(
                                Button,
                                { big: true, fill: true, color: 'green', onTap: this.doSearchGroup },
                                '搜索'
                            )
                        )
                    )
                )
            )
        );
    }
});

},{"UI":41,"react":undefined}],19:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');
var _ = require('underscore');

var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;
var View = UI.View;

var GroupItem = React.createClass({
    displayName: 'GroupItem',

    render: function render() {
        var groupid = this.props.groupid;
        var group = this.props.list[groupid];
        return React.createElement(
            List.ItemContent,
            { onTap: this.props.showGroupDetail.bind(this, group) },
            React.createElement(
                List.ItemMedia,
                null,
                React.createElement(Icon, { name: "default_head group_head_" + groupid })
            ),
            React.createElement(
                List.ItemInner,
                null,
                React.createElement(
                    List.ItemTitle,
                    null,
                    group.name
                )
            )
        );
    }
});

var GroupGroup = React.createClass({
    displayName: 'GroupGroup',

    render: function render() {
        var _this = this;

        var groupids = this.props.groupids;
        var list = this.props.list;
        var letter = this.props.letter;
        return React.createElement(
            List.ListGroup,
            null,
            React.createElement(
                List.ListGroupTitle,
                { data: { 'data-index-letter': letter } },
                letter
            ),
            groupids.map(function (groupid) {
                return React.createElement(GroupItem, { key: groupid, groupid: groupid, list: list, showGroupDetail: _this.props.showGroupDetail });
            })
        );
    }
});

var GroupList = React.createClass({
    displayName: 'GroupList',

    render: function render() {
        var _this2 = this;

        var list = this.props.list;
        var alphaList = this.props.alphaList;
        var letters = this.props.letters;
        return React.createElement(
            List.List,
            { block: true, group: true, 'class': 'contacts-block' },
            _.map(letters, function (letter) {
                return React.createElement(GroupGroup, { key: letter, letter: letter, groupids: alphaList[letter], list: list, showGroupDetail: _this2.props.showGroupDetail });
            })
        );
    }
});

module.exports = React.createClass({
    displayName: 'exports',

    getInitialState: function getInitialState() {
        var param = this.props.data.param;
        var from = this.props.data.from;
        var saved = param.saved;
        if (from === "groupDetail") {
            return {
                list: saved.list,
                alphaList: saved.alphaList
            };
        }
        return {
            list: param.list,
            alphaList: param.alphaList
        };
    },
    showGroupDetail: function showGroupDetail(group) {
        var param = {
            group: group,
            saved: {
                list: this.state.list,
                alphaList: this.state.alphaList
            }
        };
        app.showView("groupDetail", "left", param);
    },
    render: function render() {
        var alphaList = this.state.alphaList;
        var letters = _.keys(alphaList).sort(function (a, b) {
            return a.localeCompare(b);
        });
        return React.createElement(
            View.Page,
            { title: '群组列表' },
            React.createElement(
                View.PageContent,
                null,
                React.createElement(GroupList, { alphaList: alphaList, list: this.state.list, letters: letters, showGroupDetail: this.showGroupDetail }),
                React.createElement(List.IndexedList, { letters: letters })
            )
        );
    }
});

},{"UI":41,"react":undefined,"underscore":46}],20:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');
var _ = require('underscore');

var Content = UI.Content;
var Grid = UI.Grid;
var List = UI.List;
var Button = UI.Button.Button;
var ButtonsRow = UI.Button.ButtonsRow;
var View = UI.View;
var Badge = UI.Badge.Badge;
var pages = require('./pages');

var IndexedList = React.createClass({
    displayName: 'IndexedList',

    getInitialState: function getInitialState() {
        return { letters: _.keys(app.userMgr.groupedUsers).sort(function (a, b) {
                return a.localeCompare(b);
            }) };
    },
    componentDidMount: function componentDidMount() {
        app.userMgr.addChangeListener(this._onChange);
    },
    componentWillUnmount: function componentWillUnmount() {
        app.userMgr.removeChangeListener(this._onChange);
    },
    _onChange: function _onChange() {
        this.setState({ letters: _.keys(app.userMgr.groupedUsers).sort(function (a, b) {
                return a.localeCompare(b);
            }) });
    },
    render: function render() {
        return React.createElement(List.IndexedList, { letters: this.state.letters });
    }
});

module.exports = React.createClass({
    displayName: 'exports',

    mixins: [UI.Mixins.RestoreScrollPosition],
    getInitialState: function getInitialState() {
        return {
            page: app.data.homePageIndex || 0,
            messageBadge: app.messageMgr.unreadMessage.total
        };
    },
    getDefaultProps: function getDefaultProps() {
        return { pages: [pages.Contacts, pages.Messages, pages.More] };
    },
    switchPage: function switchPage(page) {
        app.data.homePageIndex = page;
        this.setState({ page: page });
    },
    componentDidMount: function componentDidMount() {
        app.messageMgr.addNewestMessageChangeListener(this._onChange);
    },
    componentWillUnmount: function componentWillUnmount() {
        app.messageMgr.removeNewestMessageChangeListener(this._onChange);
    },
    _onChange: function _onChange() {
        this.setState({ messageBadge: app.messageMgr.unreadMessage.total });
    },
    render: function render() {
        var CurrentPage = this.props.pages[this.state.page];
        return React.createElement(
            View.Page,
            { labelsTabbar: true },
            React.createElement(
                View.Toolbar,
                { tabbar: true, labels: true, 'class': 'toolbar-bottom' },
                React.createElement(
                    View.ToolbarButton,
                    { active: this.state.page === 0,
                        icon: 'ion-android-contacts',
                        onTap: this.switchPage.bind(this, 0) },
                    'Contacts'
                ),
                React.createElement(
                    View.ToolbarButton,
                    { active: this.state.page === 1,
                        icon: 'ion-chatbubble-working',
                        badge: this.state.messageBadge > 0 && React.createElement(
                            Badge,
                            { color: 'red' },
                            this.state.messageBadge
                        ),
                        onTap: this.switchPage.bind(this, 1) },
                    'Messages'
                ),
                React.createElement(
                    View.ToolbarButton,
                    { active: this.state.page === 2,
                        icon: 'ion-settings',
                        onTap: this.switchPage.bind(this, 2) },
                    'More'
                )
            ),
            React.createElement(
                View.PageContent,
                null,
                React.createElement(CurrentPage, { data: this.props.data })
            ),
            this.state.page === 0 && React.createElement(IndexedList, null)
        );
    }
});

},{"./pages":22,"UI":41,"react":undefined,"underscore":46}],21:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');
var _ = require('underscore');

var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;
var View = UI.View;

var MenuItem = React.createClass({
    displayName: 'MenuItem',

    getDefaultProps: function getDefaultProps() {
        return { color: "blue" };
    },
    render: function render() {
        return React.createElement(
            List.ItemContent,
            { onTap: this.props.onTap },
            React.createElement(
                List.ItemMedia,
                null,
                React.createElement(Icon, { name: this.props.icon })
            ),
            React.createElement(
                List.ItemInner,
                null,
                React.createElement(
                    List.ItemTitle,
                    { style: { color: this.props.color, fontWeight: "bold" } },
                    this.props.label
                )
            )
        );
    }
});

var MenuList = React.createClass({
    displayName: 'MenuList',

    showGroupList: function showGroupList() {
        var onlineType = this.props.onlineType;
        app.showView("groupList", "left", { saved: { onlineType: onlineType } });
    },
    sendMultiMessage: function sendMultiMessage() {
        var onlineType = this.props.onlineType;
        app.showView("sendMultiMessage", "left", { saved: { onlineType: onlineType } });
    },
    render: function render() {
        var onlineType = this.props.onlineType;
        var select = this.props.select;
        if (select) {
            return React.createElement(
                List.ListGroup,
                null,
                React.createElement(MenuItem, { color: onlineType ? "blue" : "green", icon: onlineType ? "img_user_online" : "img_user_offline", label: onlineType ? "只显示在线联系人" : "显示所有联系人", onTap: this.props.changeShowOnline })
            );
        } else {
            return React.createElement(
                List.ListGroup,
                null,
                React.createElement(MenuItem, { icon: 'img_group_chat', label: '群聊', onTap: this.showGroupList }),
                React.createElement(MenuItem, { icon: 'img_send_multi', label: '发送给多人', onTap: this.sendMultiMessage }),
                React.createElement(MenuItem, { color: onlineType ? "green" : "blue", icon: onlineType ? "img_user_online" : "img_user_offline", label: onlineType ? "显示所有联系人" : "只显示在线联系人", onTap: this.props.changeShowOnline })
            );
        }
    }
});

var ContactItemInner = function ContactItemInner(userid, username, user) {
    return [React.createElement(
        List.ItemMedia,
        { key: '0' },
        React.createElement(Icon, { name: "default_head user_head_" + userid, round: true })
    ), React.createElement(
        List.ItemInner,
        { key: '1' },
        React.createElement(
            List.ItemTitle,
            { style: app.color.usernameColor(user) },
            username
        )
    )];
};

var ContactItem = React.createClass({
    displayName: 'ContactItem',

    showContactInfo: function showContactInfo(userid) {
        var param = { userid: userid, saved: { onlineType: this.props.onlineType } };
        app.showView("contactInfo", "up", param);
    },
    render: function render() {
        var userid = this.props.userid;
        var user = this.props.users[userid];
        var username = user.username;
        var select = this.props.select;
        if (!select) {
            return React.createElement(
                List.ItemContent,
                { onTap: this.showContactInfo.bind(this, userid) },
                ContactItemInner(userid, username, user)
            );
        } else if (select.type == "radio") {
            return React.createElement(
                List.ItemContent,
                { radio: true, value: userid, name: select.name, checked: select['default'] === userid, onChange: select.onChange },
                ContactItemInner(userid, username, user)
            );
        } else {
            return React.createElement(
                List.ItemContent,
                { checkbox: true, value: userid, name: select.name, checked: select['default'].indexOf(userid) !== -1, onChange: select.onChange },
                ContactItemInner(userid, username, user)
            );
        }
    }
});

var ContactGroup = React.createClass({
    displayName: 'ContactGroup',

    render: function render() {
        var users = this.props.users;
        var userids = this.props.userids;
        var select = this.props.select;
        var letter = this.props.letter;
        var onlineType = this.props.onlineType;
        return React.createElement(
            List.ListGroup,
            null,
            React.createElement(
                List.ListGroupTitle,
                { data: { 'data-index-letter': letter } },
                letter
            ),
            userids.map(function (userid) {
                return React.createElement(ContactItem, { key: userid, onlineType: onlineType, userid: userid, users: users, select: select });
            })
        );
    }
});

var ContactList = React.createClass({
    displayName: 'ContactList',

    render: function render() {
        var onlineType = this.props.onlineType;
        var users = this.props.users;
        var groupedUsers = this.props.groupedUsers;
        if (onlineType) {
            var newGroupedUsers = {};
            _.mapObject(groupedUsers, function (userids, letter) {
                var newUserids = _.filter(userids, function (userid) {
                    return users[userid].online;
                });
                if (newUserids.length) {
                    newGroupedUsers[letter] = newUserids;
                }
            });
            groupedUsers = newGroupedUsers;
        }
        var letters = _.keys(groupedUsers).sort(function (a, b) {
            return a.localeCompare(b);
        });
        var select = this.props.select;
        return React.createElement(
            List.List,
            { block: true, group: true, 'class': 'contacts-block' },
            React.createElement(MenuList, { select: select, onlineType: onlineType, changeShowOnline: this.props.changeShowOnline }),
            _.map(letters, function (letter) {
                return React.createElement(ContactGroup, { key: letter, onlineType: onlineType, letter: letter, userids: groupedUsers[letter], users: users, select: select });
            })
        );
    }
});

module.exports = React.createClass({
    displayName: 'exports',

    getInitialState: function getInitialState() {
        var saved = this.props.data.param.saved || {};
        return {
            groupedUsers: app.userMgr.groupedUsers,
            users: app.userMgr.users,
            onlineType: saved.onlineType
        };
    },
    componentDidMount: function componentDidMount() {
        app.userMgr.addChangeListener(this._onChange);
    },
    componentWillUnmount: function componentWillUnmount() {
        app.userMgr.removeChangeListener(this._onChange);
    },
    _onChange: function _onChange() {
        this.setState({
            groupedUsers: app.userMgr.groupedUsers,
            users: app.userMgr.users
        });
    },
    changeShowOnline: function changeShowOnline() {
        this.setState({ onlineType: !this.state.onlineType });
    },
    render: function render() {
        return React.createElement(ContactList, { users: this.state.users, groupedUsers: this.state.groupedUsers, select: this.props.select, onlineType: this.state.onlineType, changeShowOnline: this.changeShowOnline });
    }
});

},{"UI":41,"react":undefined,"underscore":46}],22:[function(require,module,exports){
'use strict';

module.exports = {
	Contacts: require('./contacts'),
	Messages: require('./messages'),
	More: require('./more')
};

},{"./contacts":21,"./messages":23,"./more":24}],23:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');
var _ = require('underscore');

var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;
var View = UI.View;

var MessageItem = React.createClass({
    displayName: 'MessageItem',

    showMessageInfo: function showMessageInfo(type, target) {
        var param = {
            type: type
        };
        if (type === app.messageMgr.GROUP_TYPE) {
            param["groupid"] = target;
        } else {
            param["userid"] = target;
        }
        app.showView('messageInfo', 'fade', param);
    },
    render: function render() {
        var msg = this.props.msg;
        var userid = msg.userid;
        var user = app.userMgr.users[userid];
        var username = userid === app.loginMgr.userid ? "我" : user.username;
        var time = app.date.getShowDate(msg.time);
        var isGroup = msg.type === app.messageMgr.GROUP_TYPE;
        var message = msg.msg;
        var style = app.color.usernameColor(user);
        if (isGroup) {
            var groupid = msg.groupid;
            var badge = app.messageMgr.unreadMessage.group[groupid];
            var group = app.groupMgr.list[groupid];
            if (!group) {
                app.messageMgr.removeLeftGroupMessages(groupid);
                return null;
            }
            var groupname = group.name;
            return React.createElement(
                List.ItemContent,
                null,
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement(Icon, { name: "default_head user_head_" + groupid, round: true })
                ),
                React.createElement(
                    List.ItemInner,
                    { onTap: this.showMessageInfo.bind(this, msg.type, groupid) },
                    React.createElement(
                        List.ItemTitleRow,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            React.createElement(
                                'span',
                                { style: { color: "red" } },
                                groupname
                            )
                        ),
                        React.createElement(
                            List.ItemAfter,
                            null,
                            time,
                            badge > 0 && React.createElement(
                                Badge,
                                { color: 'red' },
                                badge
                            )
                        )
                    ),
                    React.createElement(
                        List.ItemSubTitle,
                        null,
                        React.createElement(
                            'span',
                            { style: style },
                            username
                        ),
                        React.createElement(
                            'span',
                            { style: { color: "blue" } },
                            '说:'
                        ),
                        message
                    )
                )
            );
        } else {
            var badge = app.messageMgr.unreadMessage.users[userid];
            return React.createElement(
                List.ItemContent,
                null,
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement(Icon, { name: "default_head user_head_" + userid, round: true })
                ),
                React.createElement(
                    List.ItemInner,
                    { onTap: this.showMessageInfo.bind(this, msg.type, userid) },
                    React.createElement(
                        List.ItemTitleRow,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            { style: style },
                            username
                        ),
                        React.createElement(
                            List.ItemAfter,
                            null,
                            time,
                            badge > 0 && React.createElement(
                                Badge,
                                { color: 'red' },
                                badge
                            )
                        )
                    ),
                    React.createElement(
                        List.ItemSubTitle,
                        null,
                        message
                    )
                )
            );
        }
    }
});

var NewestMessage = React.createClass({
    displayName: 'NewestMessage',

    render: function render() {
        var messages = this.props.messages;
        return React.createElement(
            List.List,
            { block: true, media: true },
            messages.map(function (msg, i) {
                return React.createElement(MessageItem, { key: i, msg: msg });
            })
        );
    }
});

module.exports = React.createClass({
    displayName: 'exports',

    getInitialState: function getInitialState() {
        return {
            messages: app.messageMgr.newestMessage
        };
    },
    componentDidMount: function componentDidMount() {
        app.userMgr.addChangeListener(this._onChange);
        app.messageMgr.addNewestMessageChangeListener(this._onChange);
    },
    componentWillUnmount: function componentWillUnmount() {
        app.userMgr.removeChangeListener(this._onChange);
        app.messageMgr.removeNewestMessageChangeListener(this._onChange);
    },
    _onChange: function _onChange() {
        this.setState({
            messages: app.messageMgr.newestMessage
        });
    },
    render: function render() {
        return React.createElement(NewestMessage, { messages: this.state.messages });
    }
});

},{"UI":41,"react":undefined,"underscore":46}],24:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Grid = UI.Grid;
var List = UI.List;
var Button = UI.Button.Button;
var ButtonsRow = UI.Button.ButtonsRow;

var LayoutCell = React.createClass({
  displayName: 'LayoutCell',

  changeColorTheme: function changeColorTheme(color) {
    var layouts = 'layout-dark layout-white';
    $('body').removeClass(layouts).addClass('layout-' + color);
  },
  render: function render() {
    return React.createElement('div', { className: "col-33 ks-layout-theme ks-layout-" + this.props.color, onClick: this.changeColorTheme.bind(null, this.props.color) });
  }
});

var ColorCell = React.createClass({
  displayName: 'ColorCell',

  changeColorTheme: function changeColorTheme(color) {
    var themes = 'theme-white theme-black theme-yellow theme-red theme-blue theme-green theme-pink theme-lightblue theme-orange theme-gray';
    $('body').removeClass(themes).addClass('theme-' + color);
  },
  render: function render() {
    return React.createElement('div', { className: "col-20 ks-layout-theme bg-" + this.props.color, onClick: this.changeColorTheme.bind(null, this.props.color) });
  }
});

module.exports = React.createClass({
  displayName: 'exports',

  render: function render() {
    return React.createElement(
      'div',
      null,
      React.createElement(
        Content.ContentBlock,
        null,
        React.createElement(
          'p',
          null,
          'Framework7 comes with default 10 iOS color themes set and three layout color themes (default, dark and pure white):'
        )
      ),
      React.createElement(
        Content.ContentBlockTitle,
        null,
        'Choose Layout Theme'
      ),
      React.createElement(
        Content.ContentBlock,
        null,
        React.createElement(
          Grid.Row,
          null,
          ["default", "dark", "white"].map(function (color) {
            return React.createElement(LayoutCell, { key: color, color: color });
          })
        ),
        React.createElement(
          Content.ContentBlockTitle,
          null,
          'Choose Color Theme'
        ),
        React.createElement(
          Grid.Row,
          null,
          ["white", "black", "blue", "orange", "red"].map(function (color) {
            return React.createElement(ColorCell, { key: color, color: color });
          })
        )
      ),
      React.createElement(
        Content.ContentBlock,
        null,
        React.createElement(
          Grid.Row,
          null,
          ["pink", "green", "lightblue", "yellow", "gray"].map(function (color) {
            return React.createElement(ColorCell, { key: color, color: color });
          })
        )
      )
    );
  }
});

},{"UI":41,"react":undefined}],25:[function(require,module,exports){
'use strict';

var UI = require('UI');

module.exports = { showWelcome: function showWelcome() {
		var options = {
			'bgcolor': '#0da6ec',
			'fontcolor': '#fff',
			'onOpened': function onOpened() {
				console.log("welcome screen opened");
			},
			'onClosed': function onClosed() {
				console.log("welcome screen closed");
			}
		},
		    slides,
		    welcomescreen;

		slides = [{
			id: 'slide0',
			picture: '<div class="tutorialicon">♥</div>',
			text: 'Welcome to this tutorial. In the <a class="tutorial-next-link" href="#">next steps</a> we will guide you through a manual that will teach you how to use this app.'
		}, {
			id: 'slide1',
			picture: '<div class="tutorialicon">✲</div>',
			text: 'This is slide 2'
		}, {
			id: 'slide2',
			picture: '<div class="tutorialicon">♫</div>',
			text: 'This is slide 3'
		}, {
			id: 'slide3',
			picture: '<div class="tutorialicon">☆</div>',
			text: 'Thanks for reading! Enjoy this app or go to <a class="tutorial-previous-slide" href="#">previous slide</a>.<br><br><a class="tutorial-close-btn" href="#">Enter</a>'
		}];

		welcomescreen = UI.Welcome.WelcomeScreen(slides, options);

		$(document).on('click', '.tutorial-close-btn', function () {
			welcomescreen.close();
		});

		$('.tutorial-open-btn').click(function () {
			welcomescreen.open();
		});

		$(document).on('click', '.tutorial-next-link', function (e) {
			welcomescreen.next();
		});

		$(document).on('click', '.tutorial-previous-slide', function (e) {
			welcomescreen.previous();
		});
	} };

},{"UI":41}],26:[function(require,module,exports){
'use strict';

module.exports = {
	// app
	'home': require('./home/main'),
	//chat
	'login': require('./login/login'),
	'register': require('./login/register'),
	'selectHead': require('./login/selectHead'),
	'messageInfo': require('./message/messageInfo'),
	'sendMultiMessage': require('./message/sendMultiMessage'),
	'contactInfo': require('./contact/contactInfo'),
	'selectUsers': require('./contact/selectUsers'),
	'audioCall': require('./call/audioCall'),
	'videoCall': require('./call/videoCall'),
	'groupList': require('./group/groupList'),
	'createGroup': require('./group/createGroup'),
	'searchGroup': require('./group/searchGroup'),
	'groupDetail': require('./group/groupDetail'),
	'searchGroupList': require('./group/searchGroupList'),
	'selectGroupUser': require('./group/searchGroup')
};

},{"./call/audioCall":2,"./call/videoCall":3,"./contact/contactInfo":13,"./contact/selectUsers":14,"./group/createGroup":15,"./group/groupDetail":16,"./group/groupList":17,"./group/searchGroup":18,"./group/searchGroupList":19,"./home/main":20,"./login/login":27,"./login/register":28,"./login/selectHead":29,"./message/messageInfo":30,"./message/sendMultiMessage":31}],27:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var ReactMaskMixin = require('react-mask-mixin');
var UI = require('UI');

var View = UI.View;
var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Switch = UI.Form.Switch;
var Slider = UI.Form.Slider;
var Grid = UI.Grid;
var Button = UI.Button.Button;

var MaskInput = React.createClass({
    displayName: 'MaskInput',

    mixins: [ReactMaskMixin],
    render: function render() {
        return React.createElement('input', _extends({}, this.props, this.mask.props));
    }
});

var FormItem = React.createClass({
    displayName: 'FormItem',

    render: function render() {
        return React.createElement(
            List.ItemContent,
            null,
            this.props.icon && React.createElement(
                List.ItemMedia,
                null,
                React.createElement(Icon, { name: this.props.icon })
            ),
            React.createElement(
                List.ItemInner,
                null,
                this.props.label && React.createElement(
                    List.ItemTitle,
                    { label: true },
                    this.props.label
                ),
                React.createElement(
                    List.ItemInput,
                    null,
                    this.props.children
                )
            )
        );
    }
});

var FormInputItem = React.createClass({
    displayName: 'FormInputItem',

    render: function render() {
        return React.createElement(
            FormItem,
            { icon: this.props.icon, label: this.props.label },
            React.createElement('input', { type: this.props.input_type, placeholder: this.props.placeholder, value: this.props.value, onChange: this.props.onChange })
        );
    }
});

module.exports = React.createClass({
    displayName: 'exports',

    componentDidMount: function componentDidMount() {
        var autoLogin = this.state.autoLogin;
        var userid = this.state.userid;
        var password = this.state.password;
        if (autoLogin && userid && password) {
            app.loginMgr.autoLogin(userid, password, autoLogin, true);
        }
    },
    getInitialState: function getInitialState() {
        var us = app.us;
        var constants = app.constants;
        var userid = us.string(constants.LOGIN_USER_ID) || '';
        var password = us.string(constants.LOGIN_PASSWORD);
        var autoLogin = us.bool(constants.LOGIN_AUTO_LOGIN);
        var remeberPassword = !!password;
        return {
            userid: userid,
            password: password,
            autoLogin: autoLogin,
            remeberPassword: remeberPassword
        };
    },
    doLogin: function doLogin() {
        var userid = this.state.userid.replace(/-/g, "");
        if (!/\d{11}/.test(userid)) {
            app.showError("Invalid Phone!");
            return;
        }
        var password = this.state.password;
        if (!password) {
            app.showError("PassWord Needed!");
            return;
        }
        app.loginMgr.login(userid, password, this.state.autoLogin, this.state.remeberPassword);
    },
    doRegister: function doRegister() {
        app.showView('register', 'left');
    },
    handleInputChange: function handleInputChange(type, e) {
        var state = {};
        state[type] = e.target.value;
        this.setState(state);
    },
    handleSwitchChange: function handleSwitchChange(type, checked) {
        var state = {};
        state[type] = checked;
        this.setState(state);
    },
    render: function render() {
        return React.createElement(
            View.Page,
            null,
            React.createElement(
                View.PageContent,
                null,
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        List.List,
                        { block: true },
                        React.createElement(
                            FormItem,
                            { icon: 'icon-form-tel', label: 'Phone:' },
                            React.createElement(MaskInput, { mask: '999-9999-9999', placeholder: 'Input Phone', type: 'tel', value: this.state.userid, onChange: this.handleInputChange.bind(this, "userid") })
                        ),
                        React.createElement(FormInputItem, { icon: 'icon-form-password', label: 'PassWord:', input_type: 'password', placeholder: 'Input PassWord', value: this.state.password, onChange: this.handleInputChange.bind(this, "password") })
                    )
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        List.List,
                        { block: true },
                        React.createElement(
                            List.ItemContent,
                            null,
                            React.createElement(
                                List.ItemInner,
                                null,
                                React.createElement(
                                    List.ItemTitle,
                                    { label: true, style: { width: '80%' } },
                                    'Remeber Password:'
                                ),
                                React.createElement(
                                    List.ItemInput,
                                    null,
                                    React.createElement(Switch, { checked: this.state.remeberPassword, onChange: this.handleSwitchChange.bind(this, "remeberPassword") })
                                )
                            )
                        ),
                        React.createElement(
                            List.ItemContent,
                            null,
                            React.createElement(
                                List.ItemInner,
                                null,
                                React.createElement(
                                    List.ItemTitle,
                                    { label: true, style: { width: '80%' } },
                                    'Auto Login:'
                                ),
                                React.createElement(
                                    List.ItemInput,
                                    null,
                                    React.createElement(Switch, { checked: this.state.autoLogin, onChange: this.handleSwitchChange.bind(this, "autoLogin") })
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        Grid.Row,
                        null,
                        React.createElement(
                            Grid.Col,
                            { per: 50 },
                            React.createElement(
                                Button,
                                { big: true, fill: true, color: 'green', onTap: this.doLogin },
                                'Login'
                            )
                        ),
                        React.createElement(
                            Grid.Col,
                            { per: 50 },
                            React.createElement(
                                Button,
                                { big: true, fill: true, color: 'red', onTap: this.doRegister },
                                'Register'
                            )
                        )
                    )
                )
            )
        );
    }
});

},{"UI":41,"react":undefined,"react-mask-mixin":45}],28:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var ReactMaskMixin = require('react-mask-mixin');
var UI = require('UI');

var View = UI.View;
var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Switch = UI.Form.Switch;
var Slider = UI.Form.Slider;
var Grid = UI.Grid;
var Button = UI.Button.Button;

function getImageData(img, width, height) {
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    return canvas.toDataURL("image/png");
}

function getImage(i) {
    return 'img/app/head/' + i + '.jpg';
}

var MaskInput = React.createClass({
    displayName: 'MaskInput',

    mixins: [ReactMaskMixin],
    render: function render() {
        return React.createElement('input', _extends({}, this.props, this.mask.props));
    }
});

var FormItem = React.createClass({
    displayName: 'FormItem',

    render: function render() {
        return React.createElement(
            List.ItemContent,
            null,
            this.props.icon && React.createElement(
                List.ItemMedia,
                null,
                React.createElement(Icon, { name: this.props.icon })
            ),
            React.createElement(
                List.ItemInner,
                null,
                this.props.label && React.createElement(
                    List.ItemTitle,
                    { label: true },
                    this.props.label
                ),
                React.createElement(
                    List.ItemInput,
                    null,
                    this.props.children
                )
            )
        );
    }
});

var FormInputItem = React.createClass({
    displayName: 'FormInputItem',

    render: function render() {
        return React.createElement(
            FormItem,
            { icon: this.props.icon, label: this.props.label },
            React.createElement('input', { type: this.props.input_type, placeholder: this.props.placeholder, value: this.props.value, onChange: this.props.onChange })
        );
    }
});

module.exports = React.createClass({
    displayName: 'exports',

    componentWillMount: function componentWillMount() {
        this.headImageIndex = this.props.data.param.headImageIndex || 0;
    },
    doRegister: function doRegister() {
        var userid = this.state.userid.replace(/-/g, "");
        if (!/\d{11}/.test(userid)) {
            app.showError("Invalid Phone!");
            return;
        }
        var password = this.state.password;
        if (password !== this.state.confirmPwd) {
            app.showError("Please Confirm PassWord");
            return;
        }
        if (!this.state.username) {
            app.showError("UserName Empty!");
            return;
        }
        var head = getImageData(this.refs.head.getDOMNode(), 100, 100);
        var param = {
            userid: userid,
            password: password,
            username: this.state.username,
            sign: this.state.sign,
            head: head
        };
        app.socket.emit('USER_REGISTER_RQ', param);
    },
    handleChange: function handleChange(type, e) {
        var state = {};
        state[type] = e.target.value;
        this.setState(state);
    },
    selectHead: function selectHead() {
        app.showView('selectHead', 'left');
    },
    getInitialState: function getInitialState() {
        return {
            userid: '',
            password: '',
            username: '',
            sign: ''
        };
    },
    render: function render() {
        return React.createElement(
            View.Page,
            { title: 'Register' },
            React.createElement(
                View.PageContent,
                null,
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        List.List,
                        { block: true },
                        React.createElement(
                            FormItem,
                            { icon: 'ion-android-contact', label: 'Head:' },
                            React.createElement('img', { className: "big_user_head", src: getImage(this.headImageIndex), onClick: this.selectHead, ref: 'head' })
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        List.List,
                        { block: true },
                        React.createElement(
                            FormItem,
                            { icon: 'icon-form-tel', label: 'Phone:' },
                            React.createElement(MaskInput, { mask: '999-9999-9999', placeholder: 'Input Phone', type: 'tel', value: this.state.phone, onChange: this.handleChange.bind(this, "userid") })
                        ),
                        React.createElement(FormInputItem, { icon: 'icon-form-name', label: 'User Name:', input_type: 'text', placeholder: 'Input UserName', value: this.state.username, onChange: this.handleChange.bind(this, "username") })
                    )
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        List.List,
                        { block: true },
                        React.createElement(FormInputItem, { icon: 'icon-form-password', label: 'PassWord:', input_type: 'password', placeholder: 'Input PassWord', value: this.state.password, onChange: this.handleChange.bind(this, "password") }),
                        React.createElement(FormInputItem, { icon: 'icon-form-password', label: 'Confirm Pwd:', input_type: 'password', placeholder: 'Confirm PassWord', value: this.state.confirmPwd, onChange: this.handleChange.bind(this, "confirmPwd") })
                    )
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        List.List,
                        { block: true },
                        React.createElement(
                            FormItem,
                            { icon: 'icon-form-comment', label: 'Sign:' },
                            React.createElement('textarea', { placeholder: 'Input Sign', value: this.state.sign, onChange: this.handleChange.bind(this, "sign") })
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        Grid.Row,
                        null,
                        React.createElement(
                            Grid.Col,
                            { per: 100 },
                            React.createElement(
                                Button,
                                { big: true, fill: true, color: 'green', onTap: this.doRegister },
                                'Register'
                            )
                        )
                    )
                )
            )
        );
    }
});

},{"UI":41,"react":undefined,"react-mask-mixin":45}],29:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var Content = UI.Content;
var View = UI.View;
var Grid = UI.Grid;
var Button = UI.Button.Button;

function getImage(i) {
    return { backgroundImage: 'url(img/app/head/' + i + '.jpg)', backgroundSize: "100% 100%" };
}

module.exports = React.createClass({
    displayName: 'exports',

    componentDidMount: function componentDidMount() {
        var params = {
            pagination: ".swiper-pagination",
            effect: "coverflow",
            slidesPerView: "auto",
            centeredSlides: true
        };
        this.slider = app.swiper(this.refs.swiper.getDOMNode(), params);
        this.headImageIndex = 0;
        var self = this;
        this.slider.on('onProgress', function (el, per) {
            self.headImageIndex = Math.round(per * 33);
        });
    },
    componentWillUnmount: function componentWillUnmount() {
        this.slider.destroy();
    },
    doSelectHead: function doSelectHead() {
        app.goBack(1, { headImageIndex: this.headImageIndex });
    },
    render: function render() {
        var images = [];
        for (var i = 0; i < 33; i++) {
            images.push(React.createElement('div', { key: i, style: getImage(i), className: 'swiper-slide' }));
        }
        return React.createElement(
            View.Page,
            { title: '选择头像', right: React.createElement(
                    View.NavbarButton,
                    { right: true, onTap: this.doSelectHead },
                    'Select'
                ) },
            React.createElement(
                View.PageContent,
                null,
                React.createElement(
                    'div',
                    { className: 'swiper-container ks-demo-slider ks-coverflow-slider', ref: 'swiper' },
                    React.createElement('div', { className: 'swiper-pagination' }),
                    React.createElement(
                        'div',
                        { className: 'swiper-wrapper' },
                        images
                    )
                )
            )
        );
    }
});

},{"UI":41,"react":undefined}],30:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var Message = UI.Message;
var MessageDate = Message.MessageDate;
var MessageText = Message.MessageText;

function getShowTime(time, lastTime) {
    if (!lastTime) {
        return app.date.getShowDateTime(time);
    }

    var date = new Date(time);date.setSeconds(0);date.setMilliseconds(0);
    var last = new Date(lastTime);last.setSeconds(0);last.setMilliseconds(0);

    if (last.getTime() === date.getTime()) {
        return null;
    }
    return app.date.getShowDateTime(time);
};

function getMessageList(messages, isGroup) {
    var lastTime, timeStr;
    var list = [];
    var len = messages.length;
    var users = app.userMgr.users;

    if (!len) {
        return null;
    }
    for (var i = 0; i < len; i++) {
        var msg = messages[i];
        timeStr = getShowTime(msg.time, lastTime);
        lastTime = msg.time;
        if (timeStr) {
            var index = list.length - 1;
            var item = list[index];
            if (item) {
                list[index] = React.addons.cloneWithProps(item, { tail: true });
            }
            list.push(React.createElement(
                MessageDate,
                null,
                timeStr
            ));
        }

        var props = {};
        var userid = msg.userid;
        var next = messages[i + 1];
        var pre = messages[i - 1];
        var user = users[userid];
        var username = user.username;
        props.tail = !next || userid !== next.userid || !(!!msg.send === !!next.send);
        props.sent = !!msg.send;
        props.avatar = msg.send ? app.loginMgr.userid : userid;
        props.nameStyle = app.color.usernameColor(user);
        props.name = msg.send ? false : pre && pre.userid === userid && !timeStr ? false : username;

        list.push(React.createElement(
            MessageText,
            props,
            msg.msg
        ));
    }
    return list;
}

var MessageList = React.createClass({
    displayName: 'MessageList',

    render: function render() {
        var list = getMessageList(this.props.messages, this.props.isGroup);
        return React.createElement(
            Message.Messages,
            null,
            list
        );
    }
});

module.exports = React.createClass({
    displayName: 'exports',

    getInitialState: function getInitialState() {
        return {
            messages: []
        };
    },
    componentWillMount: function componentWillMount() {
        this.localStorageEnd = false;
        var mgr = app.messageMgr;
        var param = this.props.data.param;
        if (param.type === mgr.USER_TYPE) {
            this.isGroup = false;
            this.userid = param.userid;
            mgr.clearUserUnreadNotify(this.userid);
        } else {
            this.isGroup = true;
            this.groupid = param.groupid;
            mgr.clearGroupUnreadNotify(this.groupid);
        }
    },
    componentDidMount: function componentDidMount() {
        var mgr = app.messageMgr;
        app.userMgr.addChangeListener(this._onChange);
        mgr.addDisplayMessageChangeListener(this._onMessageChange);
        app.groupMgr.addEventListener(this._onListener);
        if (this.isGroup) {
            mgr.displayMessageInfo.target = this.groupid;
            mgr.getGroupMessage(this.groupid);
        } else {
            mgr.displayMessageInfo.target = this.userid;
            mgr.getUserMessage(this.userid);
        }
    },
    componentWillUnmount: function componentWillUnmount() {
        app.userMgr.removeChangeListener(this._onChange);
        var mgr = app.messageMgr;
        mgr.removeDisplayMessageChangeListener(this._onMessageChange);
        app.groupMgr.removeEventListener(this._onListener);
        mgr.displayMessageInfo = {};
    },
    _onMessageChange: function _onMessageChange() {
        if (this.refreshing) {
            var msg = app.messageMgr.displayMessage[0];
            var time = msg && msg.time;
            if (this.oldestMessageTime === time && !this.localStorageEnd) {
                this.localStorageEnd = true;
                app.messageMgr.getUserMessageFromServer(this.userid, this.oldestMessageTime || Date.now());
            } else {
                var self = this;
                setTimeout(function () {
                    self.refs.refresh.refreshDone();
                    self._onChange(true);
                    self.refreshing = false;
                }, 1000);
            }
        } else {
            this._onChange();
        }
    },
    _onChange: function _onChange(noScroll) {
        this.setState({
            messages: app.messageMgr.displayMessage
        }, function () {
            noScroll || $('.page-content').scrollBottom(500);
        });
    },
    _onListener: function _onListener(obj) {
        var type = obj.type;
        switch (type) {
            case "ON_FIRE_OUT_GROUP":
                if (this.groupid === obj.id) {
                    app.toast("你已经被踢出了这个群");
                    if (this.props.data.from === "groupDetail") {
                        app.goBack(2);
                    } else {
                        app.goBack();
                    }
                }
                break;
            default:
                ;
        }
    },
    handleSend: function handleSend() {
        var text = this.refs.toolbar.getValue();
        var mgr = app.messageMgr;
        if (this.isGroup) {
            mgr.sendGroupMessage(this.groupid, text, mgr.TEXT_TYPE, this.sendGroupUserId);
        } else {
            mgr.sendUserMessage(this.userid, text, mgr.TEXT_TYPE);
        }
        this.refs.toolbar.setValue('');
    },
    handleRefresh: function handleRefresh(e) {
        var msg = this.state.messages[0];
        if (!this.refreshing) {
            this.refreshing = true;
            this.oldestMessageTime = msg && msg.time;
            if (this.isGroup) {
                if (this.localStorageEnd || !msg) {
                    app.messageMgr.getGroupMessageFromServer(this.groupid, this.oldestMessageTime || Date.now());
                } else {
                    app.messageMgr.getGroupMessage(this.groupid, this.oldestMessageTime);
                }
            } else {
                if (this.localStorageEnd || !msg) {
                    app.messageMgr.getUserMessageFromServer(this.userid, this.oldestMessageTime || Date.now());
                } else {
                    app.messageMgr.getUserMessage(this.userid, this.oldestMessageTime);
                }
            }
        }
    },
    render: function render() {
        return React.createElement(
            View.Page,
            { title: 'Messages', toolbar: true },
            React.createElement(
                View.PageContent,
                { message: true, 'class': 'pull-to-refresh-content' },
                React.createElement(UI.Refresh.PullToRefresh, { onRefresh: this.handleRefresh, ref: 'refresh' }),
                React.createElement(MessageList, { messages: this.state.messages, isGroup: this.isGroup })
            ),
            React.createElement(Message.MessageToolbar, { onSend: this.handleSend, ref: 'toolbar' })
        );
    }
});

},{"UI":41,"react":undefined}],31:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var Message = UI.Message;
var List = UI.List;
var Icon = UI.Icon.Icon;

var ContactItem = React.createClass({
    displayName: 'ContactItem',

    render: function render() {
        var userid = this.props.userid;
        var user = app.userMgr.users[userid];
        var username = user.username;
        return React.createElement(
            List.ItemContent,
            { swipeout: true, swipeoutRight: React.createElement(
                    'a',
                    { className: 'swipeout-delete', onClick: this.props.onDelete.bind(null, userid) },
                    'Delete'
                ) },
            React.createElement(
                List.ItemMedia,
                null,
                React.createElement(Icon, { name: "default_head user_head_" + userid, round: true })
            ),
            React.createElement(
                List.ItemInner,
                null,
                React.createElement(
                    List.ItemTitle,
                    { style: app.color.usernameColor(user) },
                    username
                )
            )
        );
    }
});

module.exports = React.createClass({
    displayName: 'exports',

    getInitialState: function getInitialState() {
        return {
            users: this.props.data.param.users || []
        };
    },
    componentWillMount: function componentWillMount() {
        var saved = this.props.data.param.saved;
        if (saved) {
            this.text = saved.text;
        }
    },
    onDelete: function onDelete(userid, e) {
        var clicked = $(e.target);
        var self = this;
        this.refs.list.swipeout['delete'](clicked.parents('.swipeout'), function () {
            self.setState({ users: _.without(self.state.users, userid) });
        });
    },
    addReceivers: function addReceivers() {
        var text = this.refs.toolbar.getValue();
        app.showView('selectUsers', 'left', { value: this.state.users, saved: { text: text } });
    },
    handleSend: function handleSend() {
        var text = this.refs.toolbar.getValue();
        var mgr = app.messageMgr;
        mgr.sendUserMessage(this.state.users.join(','), text, mgr.TEXT_TYPE);
        app.goBack();
    },
    render: function render() {
        var _this = this;

        return React.createElement(
            View.Page,
            { title: 'Messages', toolbar: true },
            React.createElement(
                View.PageContent,
                { message: true, 'class': 'pull-to-refresh-content' },
                React.createElement(
                    List.List,
                    { swipeout: true, ref: 'list' },
                    React.createElement(
                        List.ItemContent,
                        { onTap: this.addReceivers },
                        React.createElement(
                            List.ItemMedia,
                            null,
                            React.createElement(Icon, { name: 'ion-ios7-people' })
                        ),
                        React.createElement(
                            List.ItemInner,
                            null,
                            React.createElement(
                                List.ItemTitle,
                                null,
                                '收信人'
                            ),
                            React.createElement(
                                List.ItemAfter,
                                null,
                                React.createElement(Icon, { color: 'green', name: 'ion-plus-circled' })
                            )
                        )
                    ),
                    this.state.users.map(function (userid) {
                        return React.createElement(ContactItem, { key: userid, userid: userid, onDelete: _this.onDelete });
                    })
                )
            ),
            React.createElement(Message.MessageToolbar, { sendChecked: this.state.users.length > 0, onSend: this.handleSend, value: this.text, ref: 'toolbar' })
        );
    }
});

},{"UI":41,"react":undefined}],32:[function(require,module,exports){
"use strict";
var aud = '../audio/';
//var aud_file_type = (navigator.app.target==="web")?"mp3":"wav";
var aud_file_type = "wav";
module.exports = {
    aud_fail_tip: aud + 'fail_tip.' + aud_file_type,
    aud_login_tip: aud + 'login_tip.' + aud_file_type,
    aud_message_tip: aud + 'message_tip.' + aud_file_type,
    aud_new_message: aud + 'new_message.' + aud_file_type,
    aud_call_in: aud + 'call_in.' + aud_file_type,
    aud_call_out: aud + 'call_out.' + aud_file_type,
    aud_hangup: aud + 'hangup.' + aud_file_type,
    aud_refuse: aud + 'hangup.' + aud_file_type,
    aud_call_error: aud + 'hangup.' + aud_file_type,
    aud_busy: aud + 'busy.' + aud_file_type
};

},{}],33:[function(require,module,exports){
"use strict";

module.exports = (function () {
    "use strict";
    function Color() {}

    Color.prototype.usernameColor = function (user) {
        return user.userid === app.loginMgr.userid ? { color: "blue" } : user.online ? { color: "#00FF7F" } : { color: "gray" };
    };

    return new Color();
})();

},{}],34:[function(require,module,exports){
'use strict';

module.exports = {
    //local storage id
    LOGIN_USER_ID: 'LOGIN_USER_ID',
    LOGIN_PASSWORD: 'LOGIN_PASSWORD',
    LOGIN_AUTO_LOGIN: 'LOGIN_AUTO_LOGIN',
    MESSAGE_BADGES: 'MESSAGE_BADGES',
    GROUP_MESSAGE_BADGES: 'GROUP_MESSAGE_BADGES',
    GROUP_CHAT_AT_NUMBERS: 'GROUP_CHAT_AT_NUMBERS',
    US_NOT_PLAY_SOUND: 'US_NOT_PLAY_SOUND',
    //notify message id
    MESSAGE_NOTIFY_ID: 1001,
    UNKOWN: 'UNKOWN'
};

},{}],35:[function(require,module,exports){
'use strict';

module.exports = (function () {
    "use strict";
    function DateUtils() {}

    DateUtils.prototype.getShowDate = function (time) {
        var date = new Date(time);
        var now = new Date();
        date.setHours(0);date.setMinutes(0);date.setSeconds(0);date.setMilliseconds(0);
        now.setHours(0);now.setMinutes(0);now.setSeconds(0);now.setMilliseconds(0);
        if (now.getTime() == date.getTime()) {
            var d = new Date(time);
            var h = d.getHours();
            var pre = h < 6 ? '凌晨' : h < 12 ? '早上' : h < 13 ? '中午' : h < 17 ? '下午' : h < 22 ? '晚上' : '深夜';
            return pre + h + ":" + d.getMinutes();
        }
        date.getDate(date.getDate() + 1);
        if (now.getTime() == date.getTime()) {
            return '昨天';
        }
        date.getDate(date.getDate() + 1);
        if (now.getTime() == date.getTime()) {
            return '前天';
        }
        var d = new Date(time);
        return d.getMonth() + 1 + '月' + d.getDate() + '日';
    };
    DateUtils.prototype.getShowDateTime = function (time) {
        var date = new Date(time);
        var now = new Date();
        now.setHours(0);now.setMinutes(0);now.setSeconds(0);now.setMilliseconds(0);
        date.setHours(0);date.setMinutes(0);date.setSeconds(0);date.setMilliseconds(0);
        var d = new Date(time);
        var h = d.getHours();
        var pre = h < 6 ? '凌晨' : h < 12 ? '早上' : h < 13 ? '中午' : h < 17 ? '下午' : h < 22 ? '晚上' : '深夜';
        if (now.getTime() == date.getTime()) {
            return pre + h + ":" + d.getMinutes();
        }
        date.getDate(date.getDate() + 1);
        if (now.getTime() == date.getTime()) {
            return '昨天 ' + pre + h + ":" + d.getMinutes();
        }
        date.getDate(date.getDate() + 1);
        if (now.getTime() == date.getTime()) {
            return '前天 ' + pre + h + ":" + d.getMinutes();
        }
        return d.getMonth() + 1 + '月' + d.getDate() + '日 ' + h + ":" + d.getMinutes();
    };

    return new DateUtils();
})();

},{}],36:[function(require,module,exports){
"use strict";

module.exports = {
    UNKONW_ERROR: "未知错误",
    SYSTEM_ERROR: "系统错误",
    NET_TIMEOUT_ERROR: "网络超时",
    SERVER_ERROR: "服务器异常",
    INVALID_ACCOUNT: "无效账号",
    PASSWORD_ERROR: "密码错误",
    DATA_ERROR: "数据错误",
    JSON_PARSE_ERROR: "数据解析错误",
    UPDATE_ERROR: "升级失败",
    //chat error
    CANNOT_CONNECT_CHAT_SERVER: "无法连接到聊天服务器",
    INVALID_INPUT: "无效输入",
    USER_NAME_DUPLICATE: "该姓名已经被别人使用",
    USER_ID_DUPLICATE: "该电话号码已经被注册",
    MRP_ID_DUPLICATE: "MRP编号已经被其他人注册",
    USER_ID_NOT_EXIST: "该账号不存在",
    USER_NOT_NOLINE: "对方不在线",
    LOGIN_MORE_TIMES: "该账号已经在其他地方登陆",
    GROUP_NOT_EXIST: "群组不存在",
    GROUP_JOIN_MORE_TIMES: "多次加入群组错误",
    GROUP_NAME_DUPLICATE: "群组名称重复",
    GROUP_NOT_CREATOR: "你不是群组创建者",
    UNKNOWN_ERROR: "未知错误"

};

},{}],37:[function(require,module,exports){
'use strict';

module.exports = {
	constants: require('./constants'),
	error: require('./error'),
	userSetting: require('./userSetting'),
	date: require('./date'),
	color: require('./color'),
	setting: require('./setting'),
	sound: require('./sound')
};

},{"./color":33,"./constants":34,"./date":35,"./error":36,"./setting":38,"./sound":39,"./userSetting":40}],38:[function(require,module,exports){
'use strict';

var us = require('./userSetting');
var constants = require('./constants');

module.exports = {
    notPlaySound: us.bool(constants.US_NOT_PLAY_SOUND)
};

},{"./constants":34,"./userSetting":40}],39:[function(require,module,exports){
'use strict';

module.exports = (function () {
    "use strict";
    function Sound() {}

    Sound.prototype.playSound = function (src) {
        if (app.setting.notPlaySound || app.device.pause) {
            return;
        }
        if (this.audio_sound) {
            this.audio_sound.stop();
            this.audio_sound.release();
            this.audio_sound = null;
        }
        this.audio_sound = new Media(app.device.os === 'desktop' || navigator.app.target === 'web' ? src : app.resPath + src);
        this.audio_sound.play();
    };
    Sound.prototype.stopRing = function () {
        if (this.audio_ring) {
            this.ring_state = 0;
            this.audio_ring.stop();
            this.audio_ring.release();
            this.audio_ring = null;
        }
    };
    Sound.prototype.playRing = function (src) {
        console.log("playRing:" + src);
        this.ring_state = 1;
        if (app.device.os === 'desktop' || navigator.app.target === 'web') {
            this.audio_ring = new Media(src, 1);
        } else {
            this.audio_ring = new Media(app.resPath + src, null, null, function (status) {
                if (status == Media.MEDIA_STOPPED && this.ring_state == 1) {
                    this.audio_ring.play();
                }
            });
        }
        this.audio_ring.play();
    };
    return new Sound();
})();

},{}],40:[function(require,module,exports){
"use strict";
module.exports = {
    string: function string(key, value) {
        if (value !== undefined) {
            localStorage.setItem(key, value + "");
        } else {
            return localStorage.getItem(key);
        }
    },
    bool: function bool(key, value) {
        if (value !== undefined) {
            localStorage.setItem(key, value + "");
        } else {
            return "true" == localStorage.getItem(key) ? true : false;
        }
    },
    int: function int(key, value) {
        if (value !== undefined) {
            localStorage.setItem(key, value + "");
        } else {
            var val = localStorage.getItem(key) || 0;
            return parseInt(val);
        }
    },
    object: function object(key, value) {
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
};

},{}],41:[function(require,module,exports){
module.exports = require('../../src/js/index.js');

},{"../../src/js/index.js":105}],42:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      }
      throw TypeError('Uncaught, unspecified "error" event.');
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        len = arguments.length;
        args = new Array(len - 1);
        for (i = 1; i < len; i++)
          args[i - 1] = arguments[i];
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    len = arguments.length;
    args = new Array(len - 1);
    for (i = 1; i < len; i++)
      args[i - 1] = arguments[i];

    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    var m;
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.listenerCount = function(emitter, type) {
  var ret;
  if (!emitter._events || !emitter._events[type])
    ret = 0;
  else if (isFunction(emitter._events[type]))
    ret = 1;
  else
    ret = emitter._events[type].length;
  return ret;
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}

},{}],43:[function(require,module,exports){
/*!
  Copyright (c) 2015 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes += ' ' + arg;
			} else if (Array.isArray(arg)) {
				classes += ' ' + classNames.apply(null, arg);
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes += ' ' + key;
					}
				}
			}
		}

		return classes.substr(1);
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],44:[function(require,module,exports){
'use strict';

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = Object.keys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			to[keys[i]] = from[keys[i]];
		}
	}

	return to;
};

},{}],45:[function(require,module,exports){
// react-mask-mixin
// http://github.com/borbit/react-mask-mixin
// Copyright (c) 2015 Serge Borbit
// Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
// Version: 0.0.3
(function(root) {

var MASK_REGEX = {
  '9': /\d/,
  'A': /[A-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]/,
  '*': /[\dA-Za-z\u0410-\u044f\u0401\u0451\xc0-\xff\xb5]/
}

var MASK_CHARS = Object.keys(MASK_REGEX)
var PTRN_REGEX = new RegExp('[' + MASK_CHARS.join(',') + ']', 'g')

var ReactMaskMixin = {
  componentWillMount: function() {
    this.mask = {
      props: {
        value: this.props.value,
        onClick: this._onClick,
        onChange: this._onChange,
        onKeyDown: this._onKeyDown,
        onFocus: this._onFocus,
        onBlur: this._onBlur
      },
      empty: true,
      cursorPrev: 0,
      cursor: 0
    }

    if (this.props.value && this.props.mask) {
      this.processValue(this.props.value)
    }
  },

  componentDidUpdate: function() {
    this.getDOMNode().setSelectionRange(
      this.mask.cursor,
      this.mask.cursor
    )
  },

  processValue: function(value) {
    var mask = this.props.mask
    var pattern = mask.replace(PTRN_REGEX, '_')
    var rexps = {}

    mask.split('').forEach(function(c, i) {
      if (~MASK_CHARS.indexOf(c)) {
        rexps[i+1] = MASK_REGEX[c]
      }
    })

    var cursorMax = 0
    var cursorMin = 0
    var newValue = ''
    var nextChar

    for (i = 0; i < mask.length; i++) {
      if (~MASK_CHARS.indexOf(mask[i])) {
        cursorMin = i
        break
      }
    }

    for (var i = 0, j = 0; i < mask.length;) {
      if (!~MASK_CHARS.indexOf(mask[i])) {
        newValue += mask[i]
        if (mask[i] == value[j]) {
          j++
        }
        i++
      } else {
        if (nextChar = value.substr(j++, 1)) {
          if (rexps[newValue.length+1].test(nextChar)) {
            newValue += nextChar
            cursorMax = newValue.length
            i++
          }
        } else {
          newValue = newValue.substr(0, cursorMax)
          newValue += pattern.slice(cursorMax)
          break
        }
      }
    }

    var cursorPrev = this.mask.cursor
    var cursorCurr = this.isMounted() ? this.getDOMNode().selectionStart : 0
    var removing = this.mask.cursor > cursorCurr
    cursorMax = Math.max(cursorMax, cursorMin)

    if (cursorCurr <= cursorMin) {
      cursorCurr = cursorMin
    } else if (cursorCurr >= cursorMax) {
      cursorCurr = cursorMax
    } else if (removing) {
      for (var i = cursorCurr; i >= 0; i--) {
        cursorCurr = i
        if (rexps[i] && !rexps[i+1]) break
        if (rexps[i] && rexps[i+1] && rexps[i+1].test(newValue[i])) {
          break
        }
      }
    } else {
      for (var i = cursorCurr; i <= cursorMax; i++) {
        cursorCurr = i
        if (!rexps[i+1] && rexps[i]) break
        if (rexps[i+1] && rexps[i+1].test(newValue[i])) {
          if (!rexps[i]) {
            cursorCurr++
          }
          break
        }
      }
    }

    this.mask.empty = cursorMax == cursorMin
    this.mask.props.value = newValue
    this.mask.cursor = cursorCurr
  },

  _onBlur: function(e) {
    if (this.props.mask) {
      var cursor = this.mask.cursor
      var value = this.mask.props.value

      if (!this.mask.empty) {
        this.mask.props.value = value.substr(0, cursor)
      } else {
        this.mask.props.value = ''
      }

      this.forceUpdate()
    }
    if (this.props.onBlur) {
      this.props.onBlur(e)
    }
  },

  _onChange: function(e) {
    if (this.props.mask) {
      this.processValue(e.target.value)
      e.target.value = this.mask.props.value
      this.forceUpdate()
    }
    if (this.props.onChange) {
      this.props.onChange(e)
    }
  },

  _onKeyDown: function(e) {
    if (this.props.mask) {
      this.mask.cursor = this.getDOMNode().selectionStart
    }
    if (this.props.onKeyDown) {
      this.props.onKeyDown(e)
    }
  },

  _onFocus: function(e) {
    this._onChange(e)
    if (this.props.onFocus) {
      this.props.onFocus(e)
    }
  },

  _onClick: function(e) {
    this._onChange(e)
    if (this.props.onClick) {
      this.props.onClick(e)
    }
  }
}

// Export ReactMaskMixin for CommonJS. If being loaded as an
// AMD module, define it as such. Otherwise, just add
// `ReactMaskMixin` to the global object
if (typeof exports !== 'undefined') {
  if (typeof module !== 'undefined' && module.exports) {
    exports = module.exports = ReactMaskMixin;
  }
  exports.ReactMaskMixin = ReactMaskMixin;
} else if (typeof define === 'function' && define.amd) {
  // Return the ReactMaskMixin as an AMD module:
  define([], function() {
    return ReactMaskMixin;
  });
} else {
  // Declare `ReactMaskMixin` on the root (global/window) object:
  root['ReactMaskMixin'] = ReactMaskMixin;
}

})(this)
},{}],46:[function(require,module,exports){
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}],47:[function(require,module,exports){
'use strict';

var Toast = function Toast(params) {
  var text = params.text,
      icon = params.icon,
      container;

  function hideBox($curbox) {
    if ($curbox) {
      $curbox.removeClass('fadein').transitionEnd(function () {
        $curbox.remove();
      });
    }
  }

  this.show = function (show) {
    if (show) {
      $('.toast-container').off('click').off('transitionEnd').remove();
      container = $('<div class="toast-container show">');
      var html = '<span class="toast-msg">';
      icon && (html += '<i class="icon ' + icon + '"></i>');
      text && (html += text);
      html += '</span>';
      container.html(html);
      $('body').append(container);

      var offsetWidth = container.find('.toast-msg')[0].offsetWidth;
      container.css({
        'margin-left': -offsetWidth / 2 + 'px'
      });

      container.click(function () {
        hideBox(container);
      });
      container.addClass('fadein');
      setTimeout(function () {
        hideBox(container);
      }, 1500);
    } else {
      hideBox(container);
    }
  };

  return this;
};

module.exports = function (params) {
  return new Toast(params).show(true);
};

},{}],48:[function(require,module,exports){
'use strict';

module.exports = {
	Toast: require('./Toast')
};

},{"./Toast":47}],49:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    toggle: function toggle() {
        app.accordionToggle(this.getDOMNode());
    },
    render: function render() {
        var content = React.createElement(
            "div",
            {
                className: "accordion-item-content",
                onClick: function (e) {
                    e.stopPropagation();
                } },
            this.props.content
        );
        if (this.props.list) {
            return React.createElement(
                "li",
                { onClick: this.toggle },
                this.props.children,
                content
            );
        } else {
            return React.createElement(
                "div",
                { onClick: this.toggle },
                this.props.children,
                content
            );
        }
    }
});

},{"react":undefined}],50:[function(require,module,exports){
'use strict';

module.exports = {
	AccordionItem: require('./AccordionItem')
};

},{"./AccordionItem":49}],51:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        var obj = {};
        if (this.props.color) {
            obj['bg-' + this.props.color] = true;
        }
        var className = cn("badge", obj);
        return React.createElement(
            'span',
            { className: className },
            this.props.children
        );
    }
});

},{"classnames":43,"react":undefined}],52:[function(require,module,exports){
'use strict';

module.exports = {
	Badge: require('./Badge')
};

},{"./Badge":51}],53:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');
var assign = require('object-assign');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        var obj = {
            'button': !this.props.list,
            'active': this.props.active,
            'button-round': this.props.round,
            'button-big': this.props.big,
            'button-fill': this.props.fill,
            'list-button item-link': this.props.list,
            'tab-link': this.props.tab
        };
        if (this.props.color) {
            obj['color-' + this.props.color] = true;
        }
        var link = this.props.tab ? this.props.tab : '#';
        var className = cn(obj);
        var style = this.props.inline ? { display: 'inline-block', verticalAlign: 'middle' } : {};
        style = assign(style, this.props.style);
        return React.createElement(
            'a',
            {
                href: link,
                className: className,
                style: style,
                onClick: this.props.onTap },
            this.props.children
        );
    }
});

},{"classnames":43,"object-assign":44,"react":undefined}],54:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "buttons-row" },
            this.props.children
        );
    }
});

},{"react":undefined}],55:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
	displayName: 'exports',

	toggleDialPanel: function toggleDialPanel() {
		var el = $(this.getDOMNode());
		el.toggleClass('speed-dial-opened');
	},
	showPopoverPanel: function showPopoverPanel() {
		app.showCover(this.props.popover, { type: 'popover', target: this.getDOMNode() });
	},
	render: function render() {
		var obj = {
			'floating-button': true,
			'floating-button-to-popover': this.props.popover
		};
		this.props.color && (obj["color-" + this.props.color] = true);
		var className = cn(obj);
		if (this.props.onTap) {
			return React.createElement(
				'a',
				{
					href: '#',
					className: className,
					onClick: this.props.onTap },
				React.createElement('i', { className: 'icon icon-plus' })
			);
		} else if (this.props.popover) {
			return React.createElement(
				'a',
				{
					href: '#',
					className: className,
					onClick: this.showPopoverPanel },
				React.createElement('i', { className: 'icon icon-plus' })
			);
		} else {
			return React.createElement(
				'div',
				{ className: 'speed-dial' },
				React.createElement(
					'a',
					{
						href: '#',
						className: className,
						onClick: this.toggleDialPanel },
					React.createElement('i', { className: 'icon icon-plus' }),
					React.createElement('i', { className: 'icon icon-close' })
				),
				React.createElement(
					'div',
					{ className: 'speed-dial-buttons' },
					this.props.children
				)
			);
		}
	}
});

},{"classnames":43,"react":undefined}],56:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        var obj = {
            'icon': true
        };
        this.props.name && (obj[this.props.name] = true);
        var className = cn(obj);
        return React.createElement(
            'a',
            { href: '#', onClick: this.props.onTap },
            React.createElement('i', { className: className })
        );
    }
});

},{"classnames":43,"react":undefined}],57:[function(require,module,exports){
'use strict';

module.exports = {
	Button: require('./Button'),
	ButtonsRow: require('./ButtonsRow'),
	FloatingButton: require('./FloatingButton'),
	IconButton: require('./IconButton')
};

},{"./Button":53,"./ButtonsRow":54,"./FloatingButton":55,"./IconButton":56}],58:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');
var CardHeader = require('./CardHeader');
var CardFooter = require('./CardFooter');
var CardContent = require('./CardContent');
var CardContentInner = require('./CardContentInner');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        var obj = {
            "card": true
        };
        this.props['class'] && (obj[this.props['class']] = true);
        var className = cn(obj);
        if (this.props.inner) {
            return React.createElement(
                'div',
                {
                    className: className,
                    style: this.props.style },
                React.createElement(
                    CardContent,
                    null,
                    !!this.props.header && React.createElement(
                        CardHeader,
                        null,
                        this.props.header
                    ),
                    !!this.props.customHeader && this.props.customHeader,
                    React.createElement(
                        CardContentInner,
                        null,
                        this.props.children
                    ),
                    !!this.props.footer && React.createElement(
                        CardFooter,
                        null,
                        this.props.footer
                    ),
                    !!this.props.customFooter && this.props.customFooter
                )
            );
        } else {
            return React.createElement(
                'div',
                {
                    className: className,
                    style: this.props.style },
                React.createElement(
                    CardContent,
                    null,
                    !!this.props.header && React.createElement(
                        CardHeader,
                        null,
                        this.props.header
                    ),
                    !!this.props.customHeader && this.props.customHeader,
                    this.props.children,
                    !!this.props.footer && React.createElement(
                        CardFooter,
                        null,
                        this.props.footer
                    ),
                    !!this.props.customFooter && this.props.customFooter
                )
            );
        }
    }
});

},{"./CardContent":59,"./CardContentInner":60,"./CardFooter":61,"./CardHeader":62,"classnames":43,"react":undefined}],59:[function(require,module,exports){
'use strict';

var React = require('react');
var CardContentInner = require('./CardContentInner');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        if (this.props.inner) {
            return React.createElement(
                'div',
                {
                    className: 'card-content',
                    style: this.props.style },
                React.createElement(
                    CardContentInner,
                    null,
                    this.props.children
                )
            );
        } else {
            return React.createElement(
                'div',
                {
                    className: 'card-content',
                    style: this.props.style },
                this.props.children
            );
        }
    }
});

},{"./CardContentInner":60,"react":undefined}],60:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            {
                className: "card-content-inner",
                style: this.props.style },
            this.props.children
        );
    }
});

},{"react":undefined}],61:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            {
                className: "card-footer",
                style: this.props.style },
            this.props.children
        );
    }
});

},{"react":undefined}],62:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        var obj = {
            "card-header": true
        };
        this.props['class'] && (obj[this.props['class']] = true);
        var className = cn(obj);
        return React.createElement(
            'div',
            {
                className: className,
                style: this.props.style },
            this.props.children
        );
    }
});

},{"classnames":43,"react":undefined}],63:[function(require,module,exports){
'use strict';

module.exports = {
	Card: require('./Card'),
	CardContent: require('./CardContent'),
	CardContentInner: require('./CardContentInner'),
	CardFooter: require('./CardFooter'),
	CardHeader: require('./CardHeader')
};

},{"./Card":58,"./CardContent":59,"./CardContentInner":60,"./CardFooter":61,"./CardHeader":62}],64:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        var obj = { 'chip-media': true };
        obj['bg-' + this.props.color] = true;
        var className = cn(obj);
        return React.createElement(
            'div',
            { className: 'chip' },
            this.props.media && React.createElement(
                'div',
                { className: className },
                this.props.media
            ),
            React.createElement(
                'div',
                { className: 'chip-label' },
                this.props.children
            ),
            this.props['delete'] && React.createElement('a', {
                href: '#',
                className: 'chip-delete',
                onClick: this.props['delete'] })
        );
    }
});

},{"classnames":43,"react":undefined}],65:[function(require,module,exports){
'use strict';

module.exports = {
	Chip: require('./Chip')
};

},{"./Chip":64}],66:[function(require,module,exports){
'use strict';

var React = require('react');
var assign = require('object-assign');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        var obj = {
            "row": this.props.row
        };
        this.props['class'] && (obj[this.props['class']] = true);
        var className = cn("content-block", obj);
        var style = assign({}, this.props.style, this.props.relative && { position: "relative" });
        return React.createElement(
            'div',
            { className: className, style: style },
            this.props.children
        );
    }
});

},{"classnames":43,"object-assign":44,"react":undefined}],67:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            {
                className: "content-block-inner",
                style: this.props.style },
            this.props.children
        );
    }
});

},{"react":undefined}],68:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "content-block-title" },
            this.props.children
        );
    }
});

},{"react":undefined}],69:[function(require,module,exports){
'use strict';

module.exports = {
	ContentBlock: require('./ContentBlock'),
	ContentBlockInner: require('./ContentBlockInner'),
	ContentBlockTitle: require('./ContentBlockTitle')
};

},{"./ContentBlock":66,"./ContentBlockInner":67,"./ContentBlockTitle":68}],70:[function(require,module,exports){
'use strict';

var React = require('react');

module.exports = React.createClass({
    displayName: 'exports',

    componentDidMount: function componentDidMount() {
        app.initFloatingLabel(this.getDOMNode());
    },
    render: function render() {
        return React.createElement(
            'div',
            { className: 'floating-label' },
            this.props.children,
            React.createElement(
                'div',
                { className: 'label' },
                this.props.label
            )
        );
    }
});

},{"react":undefined}],71:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
	displayName: 'exports',

	getDefaultProps: function getDefaultProps() {
		return {
			value: 0
		};
	},
	render: function render() {
		var value = this.props.value;
		var obj = {
			"progressbar": true
		};
		if (this.props.color) {
			obj['color-' + this.props.color] = true;
		}
		var className = cn(obj);
		return React.createElement(
			'div',
			{ className: className },
			React.createElement('span', { style: { transform: "translate3d(" + (-100 + value) + "%, 0px, 0px)" } })
		);
	}
});

},{"classnames":43,"react":undefined}],72:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
	displayName: "exports",

	getDefaultProps: function getDefaultProps() {
		return {
			param: { min: 0, max: 100, value: 50, step: 1 }
		};
	},
	render: function render() {
		var param = this.props.param;
		return React.createElement(
			"div",
			{ className: "range-slider" },
			React.createElement("input", {
				type: "range",
				min: param.min,
				max: param.max,
				defaultValue: param.value,
				step: param.step })
		);
	}
});

},{"react":undefined}],73:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    getInitialState: function getInitialState() {
        return {
            checked: this.props.checked
        };
    },
    onChange: function onChange(e) {
        var checked = e.target.checked;
        this.setState({ checked: checked });
        this.props.onChange && this.props.onChange(checked);
    },
    render: function render() {
        return React.createElement(
            "label",
            { className: "label-switch" },
            React.createElement("input", {
                type: "checkbox",
                checked: this.state.checked,
                onChange: this.onChange }),
            React.createElement("div", { className: "checkbox" })
        );
    }
});

},{"react":undefined}],74:[function(require,module,exports){
'use strict';

module.exports = {
	Slider: require('./Slider'),
	Switch: require('./Switch'),
	ProgressBar: require('./ProgressBar'),
	FloatingLabel: require('./FloatingLabel')
};

},{"./FloatingLabel":70,"./ProgressBar":71,"./Slider":72,"./Switch":73}],75:[function(require,module,exports){
'use strict';

module.exports = function (app) {
    /*===============================================================================
    ************   Accordion   ************
    ===============================================================================*/
    app.accordionToggle = function (item) {
        item = $(item);
        if (item.length === 0) return;
        if (item.hasClass('accordion-item-expanded')) app.accordionClose(item);else app.accordionOpen(item);
    };
    app.accordionOpen = function (item) {
        item = $(item);
        var list = item.parents('.accordion-list').eq(0);
        var content = item.children('.accordion-item-content');
        if (content.length === 0) content = item.find('.accordion-item-content');
        var expandedItem = list.length > 0 && item.parent().children('.accordion-item-expanded');
        if (expandedItem.length > 0) {
            app.accordionClose(expandedItem);
        }
        content.css('height', content[0].scrollHeight + 'px').transitionEnd(function () {
            if (item.hasClass('accordion-item-expanded')) {
                content.transition(0);
                content.css('height', 'auto');
                var clientLeft = content[0].clientLeft;
                content.transition('');
                item.trigger('opened');
            } else {
                content.css('height', '');
                item.trigger('closed');
            }
        });
        item.trigger('open');
        item.addClass('accordion-item-expanded');
    };
    app.accordionClose = function (item) {
        item = $(item);
        var content = item.children('.accordion-item-content');
        if (content.length === 0) content = item.find('.accordion-item-content');
        item.removeClass('accordion-item-expanded');
        content.transition(0);
        content.css('height', content[0].scrollHeight + 'px');
        // Relayout
        var clientLeft = content[0].clientLeft;
        // Close
        content.transition('');
        content.css('height', '').transitionEnd(function () {
            if (item.hasClass('accordion-item-expanded')) {
                content.transition(0);
                content.css('height', 'auto');
                var clientLeft = content[0].clientLeft;
                content.transition('');
                item.trigger('opened');
            } else {
                content.css('height', '');
                item.trigger('closed');
            }
        });
        item.trigger('close');
    };
    return app;
};

},{}],76:[function(require,module,exports){
'use strict';

module.exports = function (app) {
    /*===============================================================================
    ************   Autocomplete   ************
    ===============================================================================*/
    var Autocomplete = function Autocomplete(params) {
        var a = this;

        // Params
        var defaults = {
            // Standalone Options
            // opener: undefined,
            popupCloseText: 'Close',
            backText: 'Back',
            searchbarPlaceholderText: 'Search...',
            searchbarCancelText: 'Cancel',
            openIn: 'page',
            backOnSelect: false,
            notFoundText: 'Nothing found',
            // pageTitle: undefined,

            // Handle Data
            // source: undefined,
            // limit: undefined,
            valueProperty: 'id',
            textProperty: 'text',

            // Dropdown Options
            // dropdownPlaceholderText: 'Type anything...',
            updateInputValueOnSelect: true,
            expandInput: false,

            // Preloader
            preloaderColor: false,
            preloader: false

        };

        // Templates
        // itemTemplate: undefined,
        // naavbarTemplate: undefined,
        // pageTemplate: undefined,
        // searchbarTemplate: undefined,
        // dropD: undefined,
        // dropdownItemTemplate: undefined,
        // dropdownPlaceholderTemplate: undefined

        // Color themes
        // toolbarTheme: undefined,
        // navbarTheme: undefined,
        // formTheme: undefined,

        // Callbacks
        //onChange: function (a, value) - for not dropdown
        //onOpen: function (a)
        //onClose: function (a)
        params = params || {};
        for (var def in defaults) {
            if (typeof params[def] === 'undefined') {
                params[def] = defaults[def];
            }
        }
        a.params = params;

        // Opener Link & View
        if (a.params.opener) {
            a.opener = $(a.params.opener);
        }
        var view = a.params.view;
        if (!a.params.view && a.opener && a.opener.length) {
            // Find related view
            view = a.opener.parents('.' + app.params.viewClass);
            if (view.length === 0) return;
            view = view[0].f7View;
        }

        // Input
        if (a.params.input) {
            a.input = $(a.params.input);
            if (a.input.length === 0 && a.params.openIn === 'dropdown') return;
        }

        // Array with selected items
        a.value = a.params.value || [];

        // ID & Inputs
        a.id = new Date().getTime();
        a.inputType = a.params.multiple ? 'checkbox' : 'radio';
        a.inputName = a.inputType + '-' + a.id;

        // Is Material
        var material = app.params.material;

        // Back On Select
        var backOnSelect = a.params.backOnSelect;

        if (a.params.openIn !== 'dropdown') {
            // Item Template
            a.itemTemplate = app.t7.compile(a.params.itemTemplate || '<li>' + '<label class="label-{{inputType}} item-content">' + '<input type="{{inputType}}" name="{{inputName}}" value="{{value}}" {{#if selected}}checked{{/if}}>' + '{{#if material}}' + '<div class="item-media">' + '<i class="icon icon-form-{{inputType}}"></i>' + '</div>' + '<div class="item-inner">' + '<div class="item-title">{{text}}</div>' + '</div>' + '{{else}}' + '{{#if checkbox}}' + '<div class="item-media">' + '<i class="icon icon-form-checkbox"></i>' + '</div>' + '{{/if}}' + '<div class="item-inner">' + '<div class="item-title">{{text}}</div>' + '</div>' + '{{/if}}' + '</label>' + '</li>');
            // Page Layout
            var pageTitle = a.params.pageTitle || '';
            if (!pageTitle && a.opener && a.opener.length) {
                pageTitle = a.opener.find('.item-title').text();
            }
            var pageName = 'autocomplete-' + a.inputName;

            var navbarTheme = a.params.navbarTheme,
                formTheme = a.params.formTheme;

            // Navbar HTML
            var navbarHTML;
            var noNavbar = '',
                noToolbar = '',
                navbarLayout;

            a.navbarTemplate = app.t7.compile(a.params.navbarTemplate || '<div class="navbar {{#if navbarTheme}}theme-{{navbarTheme}}{{/if}}">' + '<div class="navbar-inner">' + '<div class="left sliding">' + '{{#if material}}' + '<a href="#" class="link {{#if inPopup}}close-popup{{else}}back{{/if}} icon-only"><i class="icon icon-back"></i></a>' + '{{else}}' + '<a href="#" class="link {{#if inPopup}}close-popup{{else}}back{{/if}}">' + '<i class="icon icon-back"></i>' + '{{#if inPopup}}' + '<span>{{popupCloseText}}</span>' + '{{else}}' + '<span>{{backText}}</span>' + '{{/if}}' + '</a>' + '{{/if}}' + '</div>' + '<div class="center sliding">{{pageTitle}}</div>' + '{{#if preloader}}' + '<div class="right">' + '<div class="autocomplete-preloader preloader {{#if preloaderColor}}preloader-{{preloaderColor}}{{/if}}"></div>' + '</div>' + '{{/if}}' + '</div>' + '</div>');
            navbarHTML = a.navbarTemplate({
                pageTitle: pageTitle,
                backText: a.params.backText,
                popupCloseText: a.params.popupCloseText,
                openIn: a.params.openIn,
                navbarTheme: navbarTheme,
                inPopup: a.params.openIn === 'popup',
                inPage: a.params.openIn === 'page',
                material: material,
                preloader: a.params.preloader,
                preloaderColor: a.params.preloaderColor
            });

            // Determine navbar layout type - static/fixed/through
            if (a.params.openIn === 'page') {
                navbarLayout = 'static';
                if (a.opener) {
                    if (a.opener.parents('.navbar-through').length > 0) navbarLayout = 'through';
                    if (a.opener.parents('.navbar-fixed').length > 0) navbarLayout = 'fixed';
                    noToolbar = a.opener.parents('.page').hasClass('no-toolbar') ? 'no-toolbar' : '';
                    noNavbar = a.opener.parents('.page').hasClass('no-navbar') ? 'no-navbar' : 'navbar-' + navbarLayout;
                } else if (view.container) {
                    if ($(view.container).hasClass('navbar-through') || $(view.container).find('.navbar-through').length > 0) navbarLayout = 'through';
                    if ($(view.container).hasClass('navbar-fixed') || $(view.container).find('.navbar-fixed').length > 0) navbarLayout = 'fixed';
                    noToolbar = $(view.activePage.container).hasClass('no-toolbar') ? 'no-toolbar' : '';
                    noNavbar = $(view.activePage.container).hasClass('no-navbar') ? 'no-navbar' : 'navbar-' + navbarLayout;
                }
            } else {
                navbarLayout = 'fixed';
            }
            var searchbarHTML = '<form class="searchbar">' + '<div class="searchbar-input">' + '<input type="search" placeholder="' + a.params.searchbarPlaceholderText + '">' + '<a href="#" class="searchbar-clear"></a>' + '</div>' + (material ? '' : '<a href="#" class="searchbar-cancel">' + a.params.searchbarCancelText + '</a>') + '</form>' + '<div class="searchbar-overlay"></div>';
            var pageHTML = (navbarLayout === 'through' ? navbarHTML : '') + '<div class="pages">' + '<div data-page="' + pageName + '" class="page autocomplete-page ' + noNavbar + ' ' + noToolbar + '">' + (navbarLayout === 'fixed' ? navbarHTML : '') + searchbarHTML + '<div class="page-content">' + (navbarLayout === 'static' ? navbarHTML : '') + '<div class="list-block autocomplete-found autocomplete-list-' + a.id + ' ' + (formTheme ? 'theme-' + formTheme : '') + '">' + '<ul></ul>' + '</div>' + '<div class="list-block autocomplete-not-found">' + '<ul><li class="item-content"><div class="item-inner"><div class="item-title">' + a.params.notFoundText + '</div></div></li></ul>' + '</div>' + '<div class="list-block autocomplete-values">' + '<ul></ul>' + '</div>' + '</div>' + '</div>' + '</div>';
        } else {
            a.dropdownItemTemplate = app.t7.compile(a.params.dropdownItemTemplate || '<li>' + '<label class="{{#unless placeholder}}label-radio{{/unless}} item-content" data-value="{{value}}">' + '<div class="item-inner">' + '<div class="item-title">{{text}}</div>' + '</div>' + '</label>' + '</li>');
            a.dropdownPlaceholderTemplate = app.t7.compile(a.params.dropdownPlaceholderTemplate || '<li class="autocomplete-dropdown-placeholder">' + '<div class="item-content">' + '<div class="item-inner">' + '<div class="item-title">{{text}}</div>' + '</div>' + '</label>' + '</li>');
            a.dropdownTemplate = app.t7.compile(a.params.dropdownTemplate || '<div class="autocomplete-dropdown">' + '<div class="autocomplete-dropdown-inner">' + '<div class="list-block">' + '<ul></ul>' + '</div>' + '</div>' + '{{#if preloader}}' + '<div class="autocomplete-preloader preloader {{#if preloaderColor}}preloader-{{preloaderColor}}{{/if}}">{{#if material}}{{materialPreloaderHtml}}{{/if}}</div>' + '{{/if}}' + '</div>');
        }

        // Define popup
        a.popup = undefined;

        // Define Dropdown
        a.dropdown = undefined;

        // Handle Input Value Change
        a.handleInputValue = function (e) {
            var query = a.input.val();
            if (a.params.source) {
                a.params.source(a, query, function (items) {
                    var itemsHTML = '';
                    var limit = a.params.limit ? Math.min(a.params.limit, items.length) : items.length;
                    a.items = items;
                    var i, j;
                    var regExp = new RegExp('(' + query + ')', 'i');
                    for (i = 0; i < limit; i++) {
                        var itemValue = typeof items[i] === 'object' ? items[i][a.params.valueProperty] : items[i];
                        itemsHTML += a.dropdownItemTemplate({
                            value: itemValue,
                            text: (typeof items[i] !== 'object' ? items[i] : items[i][a.params.textProperty]).replace(regExp, '<b>$1</b>')
                        });
                    }
                    if (itemsHTML === '' && query === '' && a.params.dropdownPlaceholderText) {
                        itemsHTML += a.dropdownPlaceholderTemplate({
                            text: a.params.dropdownPlaceholderText
                        });
                    }
                    a.dropdown.find('ul').html(itemsHTML);
                });
            }
        };
        // Handle Drop Down Click
        a.handleDropdownClick = function (e) {
            var clicked = $(this);
            var clickedItem;
            for (var i = 0; i < a.items.length; i++) {
                var itemValue = typeof a.items[i] === 'object' ? a.items[i][a.params.valueProperty] : a.items[i];
                var value = clicked.attr('data-value');
                if (itemValue === value || itemValue * 1 === value * 1) {
                    clickedItem = a.items[i];
                }
            }
            if (a.params.updateInputValueOnSelect) {
                a.input.val(typeof clickedItem === 'object' ? clickedItem[a.params.textProperty] : clickedItem);
                a.input.trigger('input change');
            }

            if (a.params.onChange) {
                a.params.onChange(a, clickedItem);
            }

            a.close();
        };
        a.positionDropDown = function () {
            var listBlock = a.input.parents('.list-block'),
                pageContent = a.input.parents('.page-content'),
                paddingTop = parseInt(pageContent.css('padding-top'), 10),
                paddingBottom = parseInt(pageContent.css('padding-top'), 10),
                inputOffset = a.input.offset(),
                listBlockOffset = listBlock.length > 0 ? listBlock.offset() : 0,
                maxHeight = pageContent[0].scrollHeight - paddingBottom - (inputOffset.top + pageContent[0].scrollTop) - a.input[0].offsetHeight;

            a.dropdown.css({
                left: (listBlock.length > 0 ? listBlockOffset.left : inputOffset.left) + 'px',
                top: inputOffset.top + pageContent[0].scrollTop + a.input[0].offsetHeight + 'px',
                width: (listBlock.length > 0 ? listBlock[0].offsetWidth : a.input[0].offsetWidth) + 'px'
            });
            a.dropdown.children('.autocomplete-dropdown-inner').css({
                maxHeight: maxHeight + 'px',
                paddingLeft: listBlock.length > 0 && !a.params.expandInput ? inputOffset.left - (material ? 16 : 15) + 'px' : ''
            });
        };

        // Event Listeners on new page
        a.pageInit = function (e) {
            var page = e.detail.page;
            if (page.name !== pageName) {
                return;
            }
            var container = $(page.container);
            // Init Search Bar
            var searchBar = app.searchbar(container.find('.searchbar'), {
                customSearch: true,
                onSearch: function onSearch(searchbar, data) {
                    if (data.query.length === 0) {
                        searchbar.overlay.addClass('searchbar-overlay-active');
                    } else {
                        searchbar.overlay.removeClass('searchbar-overlay-active');
                    }

                    var i, j, k;

                    if (a.params.source) {
                        a.params.source(a, data.query, function (items) {
                            var itemsHTML = '';
                            var limit = a.params.limit ? Math.min(a.params.limit, items.length) : items.length;
                            a.items = items;
                            for (i = 0; i < limit; i++) {
                                var selected = false;
                                var itemValue = typeof items[i] === 'object' ? items[i][a.params.valueProperty] : items[i];
                                for (j = 0; j < a.value.length; j++) {
                                    var aValue = typeof a.value[j] === 'object' ? a.value[j][a.params.valueProperty] : a.value[j];
                                    if (aValue === itemValue || aValue * 1 === itemValue * 1) selected = true;
                                }
                                itemsHTML += a.itemTemplate({
                                    value: itemValue,
                                    text: typeof items[i] !== 'object' ? items[i] : items[i][a.params.textProperty],
                                    inputType: a.inputType,
                                    id: a.id,
                                    inputName: a.inputName,
                                    selected: selected,
                                    checkbox: a.inputType === 'checkbox',
                                    material: material
                                });
                            }
                            container.find('.autocomplete-found ul').html(itemsHTML);
                            if (items.length === 0) {
                                if (data.query.length !== 0) {
                                    container.find('.autocomplete-not-found').show();
                                    container.find('.autocomplete-found, .autocomplete-values').hide();
                                } else {
                                    container.find('.autocomplete-values').show();
                                    container.find('.autocomplete-found, .autocomplete-not-found').hide();
                                }
                            } else {
                                container.find('.autocomplete-found').show();
                                container.find('.autocomplete-not-found, .autocomplete-values').hide();
                            }
                        });
                    }
                }
            });

            function updateValues() {
                var valuesHTML = '';
                var i;
                for (i = 0; i < a.value.length; i++) {

                    valuesHTML += a.itemTemplate({
                        value: typeof a.value[i] === 'object' ? a.value[i][a.params.valueProperty] : a.value[i],
                        text: typeof a.value[i] === 'object' ? a.value[i][a.params.textProperty] : a.value[i],
                        inputType: a.inputType,
                        id: a.id,
                        inputName: a.inputName + '-checked',
                        checkbox: a.inputType === 'checkbox',
                        material: material,
                        selected: true
                    });
                }
                container.find('.autocomplete-values ul').html(valuesHTML);
            }

            // Handle Inputs
            container.on('change', 'input[type="radio"], input[type="checkbox"]', function () {
                var i;
                var input = this;
                var value = input.value;
                var text = $(input).parents('li').find('.item-title').text();
                var isValues = $(input).parents('.autocomplete-values').length > 0;
                var item, itemValue, aValue;
                if (isValues) {
                    if (a.inputType === 'checkbox' && !input.checked) {
                        for (i = 0; i < a.value.length; i++) {
                            aValue = typeof a.value[i] === 'string' ? a.value[i] : a.value[i][a.params.valueProperty];
                            if (aValue === value || aValue * 1 === value * 1) {
                                a.value.splice(i, 1);
                            }
                        }
                        updateValues();
                        if (a.params.onChange) a.params.onChange(a, a.value);
                    }
                    return;
                }

                // Find Related Item
                for (i = 0; i < a.items.length; i++) {
                    itemValue = typeof a.items[i] === 'string' ? a.items[i] : a.items[i][a.params.valueProperty];
                    if (itemValue === value || itemValue * 1 === value * 1) item = a.items[i];
                }
                // Update Selected Value
                if (a.inputType === 'radio') {
                    a.value = [item];
                } else {
                    if (input.checked) {
                        a.value.push(item);
                    } else {
                        for (i = 0; i < a.value.length; i++) {
                            aValue = typeof a.value[i] === 'string' ? a.value[i] : a.value[i][a.params.valueProperty];
                            if (aValue === value || aValue * 1 === value * 1) {
                                a.value.splice(i, 1);
                            }
                        }
                    }
                }

                // Update Values Block
                updateValues();

                // On Select Callback
                if ((a.inputType === 'radio' && input.checked || a.inputType === 'checkbox') && a.params.onChange) {
                    a.params.onChange(a, a.value);
                }
                if (backOnSelect && a.inputType === 'radio') {
                    if (a.params.openIn === 'popup') app.closeModal(a.popup);else view.router.back();
                }
            });

            // Update Values On Page Init
            updateValues();

            if (a.params.onOpen) a.params.onOpen(a);
        };

        // Show Hide Preloader
        a.showPreloader = function () {
            if (a.params.openIn === 'dropdown') {
                if (a.dropdown) a.dropdown.find('.autocomplete-preloader').addClass('autocomplete-preloader-visible');
            } else $('.autocomplete-preloader').addClass('autocomplete-preloader-visible');
        };

        a.hidePreloader = function () {
            if (a.params.openIn === 'dropdown') {
                if (a.dropdown) a.dropdown.find('.autocomplete-preloader').removeClass('autocomplete-preloader-visible');
            } else $('.autocomplete-preloader').removeClass('autocomplete-preloader-visible');
        };

        // Open Autocomplete Page/Popup
        a.open = function () {
            if (a.opened) return;
            a.opened = true;
            if (a.params.openIn === 'dropdown') {
                if (!a.dropdown) {
                    a.dropdown = $(a.dropdownTemplate({
                        preloader: a.params.preloader,
                        preloaderColor: a.params.preloaderColor,
                        material: material,
                        materialPreloaderHtml: app.params.materialPreloaderHtml
                    }));
                    a.dropdown.on('click', 'label', a.handleDropdownClick);
                }
                var listBlock = a.input.parents('.list-block');
                if (listBlock.length && a.input.parents('.item-content').length > 0 && a.params.expandInput) {
                    a.input.parents('.item-content').addClass('item-content-dropdown-expand');
                }
                a.positionDropDown();
                a.input.parents('.page-content').append(a.dropdown);
                a.dropdown.addClass('autocomplete-dropdown-in');
                a.input.trigger('input');
                $(window).on('resize', a.positionDropDown);
                if (a.params.onOpen) a.params.onOpen(a);
            } else {
                $(document).once('pageInit', '.autocomplete-page', a.pageInit);
                if (a.params.openIn === 'popup') {
                    a.popup = app.popup('<div class="popup autocomplete-popup autocomplete-popup-' + a.inputName + '">' + '<div class="view navbar-fixed">' + pageHTML + '</div>' + '</div>');
                    a.popup = $(a.popup);
                    a.popup.once('closed', function () {
                        a.popup = undefined;
                        a.opened = false;
                        if (a.params.onClose) a.params.onClose(a);
                    });
                } else {
                    view.router.load({
                        content: pageHTML
                    });
                    $(document).once('pageBack', '.autocomplete-page', function () {
                        a.opened = false;
                        if (a.params.onClose) a.params.onClose(a);
                    });
                }
            }
        };
        a.close = function (e) {
            if (!a.opened) return;
            if (a.params.openIn === 'dropdown') {
                if (e && e.type === 'blur' && a.dropdown.find('label.active-state').length > 0) return;
                a.dropdown.removeClass('autocomplete-dropdown-in').remove();
                a.input.parents('.item-content-dropdown-expand').removeClass('item-content-dropdown-expand');
                a.opened = false;
                $(window).off('resize', a.positionDropDown);
                if (a.params.onClose) a.params.onClose(a);
            }
            if (a.params.openIn === 'popup') {
                if (a.popup) app.closeModal(a.popup);
            }
        };

        // Init Events
        a.initEvents = function (detach) {
            var method = detach ? 'off' : 'on';
            if (a.params.openIn !== 'dropdown' && a.opener) {
                a.opener[method]('click', a.open);
            }
            if (a.params.openIn === 'dropdown' && a.input) {
                a.input[method]('focus', a.open);
                a.input[method]('input', a.handleInputValue);
                a.input[method]('blur', a.close);
            }
            if (detach && a.dropdown) {
                a.dropdown = null;
            }
        };

        // Init/Destroy Methods
        a.init = function () {
            a.initEvents();
        };
        a.destroy = function () {
            a.initEvents(true);
            a = null;
        };

        // Init
        a.init();

        return a;
    };
    app.autocomplete = function (params) {
        return new Autocomplete(params);
    };
    return app;
};

},{}],77:[function(require,module,exports){
'use strict';

module.exports = function (app) {
    /*======================================================
    ************   Calendar   ************
    ======================================================*/
    var Calendar = function Calendar(params) {
        var p = this;
        var defaults = {
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            firstDay: 1, // First day of the week, Monday
            weekendDays: [0, 6], // Sunday and Saturday
            multiple: false,
            rangePicker: false,
            dateFormat: 'yyyy-mm-dd',
            direction: 'horizontal', // or 'vertical'
            minDate: null,
            maxDate: null,
            disabled: null, // dates range of disabled days
            events: null, // dates range of days with events
            rangesClasses: null, //array with custom classes date ranges
            touchMove: true,
            animate: true,
            closeOnSelect: false,
            monthPicker: true,
            monthPickerTemplate: '<div class="picker-calendar-month-picker">' + '<a href="#" class="link icon-only picker-calendar-prev-month"><i class="icon icon-prev"></i></a>' + '<span class="current-month-value"></span>' + '<a href="#" class="link icon-only picker-calendar-next-month"><i class="icon icon-next"></i></a>' + '</div>',
            yearPicker: true,
            yearPickerTemplate: '<div class="picker-calendar-year-picker">' + '<a href="#" class="link icon-only picker-calendar-prev-year"><i class="icon icon-prev"></i></a>' + '<span class="current-year-value"></span>' + '<a href="#" class="link icon-only picker-calendar-next-year"><i class="icon icon-next"></i></a>' + '</div>',
            weekHeader: true,
            // Common settings
            closeByOutsideClick: true,
            scrollToInput: true,
            inputReadOnly: true,
            convertToPopover: true,
            onlyInPopover: false,
            toolbar: true,
            toolbarCloseText: 'Done',
            headerPlaceholder: 'Select date',
            header: app.params.material,
            footer: app.params.material,
            toolbarTemplate: '<div class="toolbar">' + '<div class="toolbar-inner">' + '{{monthPicker}}' + '{{yearPicker}}' + '</div>' + '</div>',
            headerTemplate: '<div class="picker-header">' + '<div class="picker-calendar-selected-date">{{placeholder}}</div>' + '</div>',
            footerTemplate: '<div class="picker-footer">' + '<a href="#" class="button close-picker">{{closeText}}</a>' + '</div>'

        };
        /* Callbacks
        onMonthAdd
        onChange
        onOpen
        onClose
        onDayClick
        onMonthYearChangeStart
        onMonthYearChangeEnd
        */
        params = params || {};
        for (var def in defaults) {
            if (typeof params[def] === 'undefined') {
                params[def] = defaults[def];
            }
        }
        p.params = params;
        p.initialized = false;

        // Inline flag
        p.inline = p.params.container ? true : false;

        // Is horizontal
        p.isH = p.params.direction === 'horizontal';

        // RTL inverter
        var inverter = p.isH ? app.rtl ? -1 : 1 : 1;

        // Animating flag
        p.animating = false;

        // Should be converted to popover
        function isPopover() {
            var toPopover = false;
            if (!p.params.convertToPopover && !p.params.onlyInPopover) return toPopover;
            if (!p.inline && p.params.input) {
                if (p.params.onlyInPopover) toPopover = true;else {
                    if (app.device.ios) {
                        toPopover = app.device.ipad ? true : false;
                    } else {
                        if ($(window).width() >= 768) toPopover = true;
                    }
                }
            }
            return toPopover;
        }
        function inPopover() {
            if (p.opened && p.container && p.container.length > 0 && p.container.parents('.popover').length > 0) return true;else return false;
        }

        // Format date
        function formatDate(date) {
            date = new Date(date);
            var year = date.getFullYear();
            var month = date.getMonth();
            var month1 = month + 1;
            var day = date.getDate();
            var weekDay = date.getDay();

            return p.params.dateFormat.replace(/yyyy/g, year).replace(/yy/g, (year + '').substring(2)).replace(/mm/g, month1 < 10 ? '0' + month1 : month1).replace(/m(\W+)/g, month1 + '$1').replace(/MM/g, p.params.monthNames[month]).replace(/M(\W+)/g, p.params.monthNamesShort[month] + '$1').replace(/dd/g, day < 10 ? '0' + day : day).replace(/d(\W+)/g, day + '$1').replace(/DD/g, p.params.dayNames[weekDay]).replace(/D(\W+)/g, p.params.dayNamesShort[weekDay] + '$1');
        }

        // Value
        p.addValue = function (value) {
            if (p.params.multiple) {
                if (!p.value) p.value = [];
                var inValuesIndex;
                for (var i = 0; i < p.value.length; i++) {
                    if (new Date(value).getTime() === new Date(p.value[i]).getTime()) {
                        inValuesIndex = i;
                    }
                }
                if (typeof inValuesIndex === 'undefined') {
                    p.value.push(value);
                } else {
                    p.value.splice(inValuesIndex, 1);
                }
                p.updateValue();
            } else if (p.params.rangePicker) {
                if (!p.value) p.value = [];
                if (p.value.length === 2 || p.value.length === 0) {
                    p.value = [];
                }
                if (p.value[0] !== value) p.value.push(value);else p.value = [];
                p.value.sort(function (a, b) {
                    return a - b;
                });
                p.updateValue();
            } else {
                p.value = [value];
                p.updateValue();
            }
        };
        p.setValue = function (arrValues) {
            p.value = arrValues;
            p.updateValue();
        };
        p.updateValue = function (onlyHeader) {
            var i, inputValue;
            if (p.container && p.container.length > 0) {
                p.wrapper.find('.picker-calendar-day-selected').removeClass('picker-calendar-day-selected');
                var valueDate;
                if (p.params.rangePicker && p.value.length === 2) {
                    for (i = p.value[0]; i <= p.value[1]; i += 24 * 60 * 60 * 1000) {
                        valueDate = new Date(i);
                        p.wrapper.find('.picker-calendar-day[data-date="' + valueDate.getFullYear() + '-' + valueDate.getMonth() + '-' + valueDate.getDate() + '"]').addClass('picker-calendar-day-selected');
                    }
                } else {
                    for (i = 0; i < p.value.length; i++) {
                        valueDate = new Date(p.value[i]);
                        p.wrapper.find('.picker-calendar-day[data-date="' + valueDate.getFullYear() + '-' + valueDate.getMonth() + '-' + valueDate.getDate() + '"]').addClass('picker-calendar-day-selected');
                    }
                }
            }

            if (p.params.onChange) {
                p.params.onChange(p, p.value);
            }
            if (p.input && p.input.length > 0 || app.params.material && p.params.header) {
                if (p.params.formatValue) inputValue = p.params.formatValue(p, p.value);else {
                    inputValue = [];
                    for (i = 0; i < p.value.length; i++) {
                        inputValue.push(formatDate(p.value[i]));
                    }
                    inputValue = inputValue.join(p.params.rangePicker ? ' - ' : ', ');
                }
                if (app.params.material && p.params.header && p.container && p.container.length > 0) {
                    p.container.find('.picker-calendar-selected-date').text(inputValue);
                }
                if (p.input && p.input.length > 0 && !onlyHeader) {
                    $(p.input).val(inputValue);
                    $(p.input).trigger('change');
                }
            }
        };

        // Columns Handlers
        p.initCalendarEvents = function () {
            var col;
            var allowItemClick = true;
            var isTouched, isMoved, touchStartX, touchStartY, touchCurrentX, touchCurrentY, touchStartTime, touchEndTime, startTranslate, currentTranslate, wrapperWidth, wrapperHeight, percentage, touchesDiff, isScrolling;
            function handleTouchStart(e) {
                if (isMoved || isTouched) return;
                // e.preventDefault();
                isTouched = true;
                touchStartX = touchCurrentY = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
                touchStartY = touchCurrentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
                touchStartTime = new Date().getTime();
                percentage = 0;
                allowItemClick = true;
                isScrolling = undefined;
                startTranslate = currentTranslate = p.monthsTranslate;
            }
            function handleTouchMove(e) {
                if (!isTouched) return;

                touchCurrentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
                touchCurrentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
                if (typeof isScrolling === 'undefined') {
                    isScrolling = !!(isScrolling || Math.abs(touchCurrentY - touchStartY) > Math.abs(touchCurrentX - touchStartX));
                }
                if (p.isH && isScrolling) {
                    isTouched = false;
                    return;
                }
                e.preventDefault();
                if (p.animating) {
                    isTouched = false;
                    return;
                }
                allowItemClick = false;
                if (!isMoved) {
                    // First move
                    isMoved = true;
                    wrapperWidth = p.wrapper[0].offsetWidth;
                    wrapperHeight = p.wrapper[0].offsetHeight;
                    p.wrapper.transition(0);
                }
                e.preventDefault();

                touchesDiff = p.isH ? touchCurrentX - touchStartX : touchCurrentY - touchStartY;
                percentage = touchesDiff / (p.isH ? wrapperWidth : wrapperHeight);
                currentTranslate = (p.monthsTranslate * inverter + percentage) * 100;

                // Transform wrapper
                p.wrapper.transform('translate3d(' + (p.isH ? currentTranslate : 0) + '%, ' + (p.isH ? 0 : currentTranslate) + '%, 0)');
            }
            function handleTouchEnd(e) {
                if (!isTouched || !isMoved) {
                    isTouched = isMoved = false;
                    return;
                }
                isTouched = isMoved = false;

                touchEndTime = new Date().getTime();
                if (touchEndTime - touchStartTime < 300) {
                    if (Math.abs(touchesDiff) < 10) {
                        p.resetMonth();
                    } else if (touchesDiff >= 10) {
                        if (app.rtl) p.nextMonth();else p.prevMonth();
                    } else {
                        if (app.rtl) p.prevMonth();else p.nextMonth();
                    }
                } else {
                    if (percentage <= -0.5) {
                        if (app.rtl) p.prevMonth();else p.nextMonth();
                    } else if (percentage >= 0.5) {
                        if (app.rtl) p.nextMonth();else p.prevMonth();
                    } else {
                        p.resetMonth();
                    }
                }

                // Allow click
                setTimeout(function () {
                    allowItemClick = true;
                }, 100);
            }

            function handleDayClick(e) {
                if (!allowItemClick) return;
                var day = $(e.target).parents('.picker-calendar-day');
                if (day.length === 0 && $(e.target).hasClass('picker-calendar-day')) {
                    day = $(e.target);
                }
                if (day.length === 0) return;
                if (day.hasClass('picker-calendar-day-selected') && !(p.params.multiple || p.params.rangePicker)) return;
                if (day.hasClass('picker-calendar-day-disabled')) return;
                if (!p.params.rangePicker) {
                    if (day.hasClass('picker-calendar-day-next')) p.nextMonth();
                    if (day.hasClass('picker-calendar-day-prev')) p.prevMonth();
                }
                var dateYear = day.attr('data-year');
                var dateMonth = day.attr('data-month');
                var dateDay = day.attr('data-day');
                if (p.params.onDayClick) {
                    p.params.onDayClick(p, day[0], dateYear, dateMonth, dateDay);
                }
                p.addValue(new Date(dateYear, dateMonth, dateDay).getTime());
                if (p.params.closeOnSelect) {
                    if (p.params.rangePicker && p.value.length === 2 || !p.params.rangePicker) p.close();
                }
            }

            p.container.find('.picker-calendar-prev-month').on('click', p.prevMonth);
            p.container.find('.picker-calendar-next-month').on('click', p.nextMonth);
            p.container.find('.picker-calendar-prev-year').on('click', p.prevYear);
            p.container.find('.picker-calendar-next-year').on('click', p.nextYear);
            p.wrapper.on('click', handleDayClick);
            if (p.params.touchMove) {
                p.wrapper.on(app.touchEvents.start, handleTouchStart);
                p.wrapper.on(app.touchEvents.move, handleTouchMove);
                p.wrapper.on(app.touchEvents.end, handleTouchEnd);
            }

            p.container[0].f7DestroyCalendarEvents = function () {
                p.container.find('.picker-calendar-prev-month').off('click', p.prevMonth);
                p.container.find('.picker-calendar-next-month').off('click', p.nextMonth);
                p.container.find('.picker-calendar-prev-year').off('click', p.prevYear);
                p.container.find('.picker-calendar-next-year').off('click', p.nextYear);
                p.wrapper.off('click', handleDayClick);
                if (p.params.touchMove) {
                    p.wrapper.off(app.touchEvents.start, handleTouchStart);
                    p.wrapper.off(app.touchEvents.move, handleTouchMove);
                    p.wrapper.off(app.touchEvents.end, handleTouchEnd);
                }
            };
        };
        p.destroyCalendarEvents = function (colContainer) {
            if ('f7DestroyCalendarEvents' in p.container[0]) p.container[0].f7DestroyCalendarEvents();
        };

        // Scan Dates Range
        p.dateInRange = function (dayDate, range) {
            var match = false;
            var i;
            if (!range) return false;
            if ($.isArray(range)) {
                for (i = 0; i < range.length; i++) {
                    if (range[i].from || range[i].to) {
                        if (range[i].from && range[i].to) {
                            if (dayDate <= new Date(range[i].to).getTime() && dayDate >= new Date(range[i].from).getTime()) {
                                match = true;
                            }
                        } else if (range[i].from) {
                            if (dayDate >= new Date(range[i].from).getTime()) {
                                match = true;
                            }
                        } else if (range[i].to) {
                            if (dayDate <= new Date(range[i].to).getTime()) {
                                match = true;
                            }
                        }
                    } else if (dayDate === new Date(range[i]).getTime()) {
                        match = true;
                    }
                }
            } else if (range.from || range.to) {
                if (range.from && range.to) {
                    if (dayDate <= new Date(range.to).getTime() && dayDate >= new Date(range.from).getTime()) {
                        match = true;
                    }
                } else if (range.from) {
                    if (dayDate >= new Date(range.from).getTime()) {
                        match = true;
                    }
                } else if (range.to) {
                    if (dayDate <= new Date(range.to).getTime()) {
                        match = true;
                    }
                }
            } else if (typeof range === 'function') {
                match = range(new Date(dayDate));
            }
            return match;
        };
        // Calendar Methods
        p.daysInMonth = function (date) {
            var d = new Date(date);
            return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
        };
        p.monthHTML = function (date, offset) {
            date = new Date(date);
            var year = date.getFullYear(),
                month = date.getMonth(),
                day = date.getDate();
            if (offset === 'next') {
                if (month === 11) date = new Date(year + 1, 0);else date = new Date(year, month + 1, 1);
            }
            if (offset === 'prev') {
                if (month === 0) date = new Date(year - 1, 11);else date = new Date(year, month - 1, 1);
            }
            if (offset === 'next' || offset === 'prev') {
                month = date.getMonth();
                year = date.getFullYear();
            }
            var daysInPrevMonth = p.daysInMonth(new Date(date.getFullYear(), date.getMonth()).getTime() - 10 * 24 * 60 * 60 * 1000),
                daysInMonth = p.daysInMonth(date),
                firstDayOfMonthIndex = new Date(date.getFullYear(), date.getMonth()).getDay();
            if (firstDayOfMonthIndex === 0) firstDayOfMonthIndex = 7;

            var dayDate,
                currentValues = [],
                i,
                j,
                k,
                rows = 6,
                cols = 7,
                monthHTML = '',
                dayIndex = 0 + (p.params.firstDay - 1),
                today = new Date().setHours(0, 0, 0, 0),
                minDate = p.params.minDate ? new Date(p.params.minDate).getTime() : null,
                maxDate = p.params.maxDate ? new Date(p.params.maxDate).getTime() : null,
                disabled,
                hasEvent;

            if (p.value && p.value.length) {
                for (i = 0; i < p.value.length; i++) {
                    currentValues.push(new Date(p.value[i]).setHours(0, 0, 0, 0));
                }
            }

            for (i = 1; i <= rows; i++) {
                var rowHTML = '';
                var row = i;
                for (j = 1; j <= cols; j++) {
                    var col = j;
                    dayIndex++;
                    var dayNumber = dayIndex - firstDayOfMonthIndex;
                    var weekDayIndex = col - 1 + p.params.firstDay > 6 ? col - 1 - 7 + p.params.firstDay : col - 1 + p.params.firstDay;
                    var addClass = '';
                    if (dayNumber < 0) {
                        dayNumber = daysInPrevMonth + dayNumber + 1;
                        addClass += ' picker-calendar-day-prev';
                        dayDate = new Date(month - 1 < 0 ? year - 1 : year, month - 1 < 0 ? 11 : month - 1, dayNumber).getTime();
                    } else {
                        dayNumber = dayNumber + 1;
                        if (dayNumber > daysInMonth) {
                            dayNumber = dayNumber - daysInMonth;
                            addClass += ' picker-calendar-day-next';
                            dayDate = new Date(month + 1 > 11 ? year + 1 : year, month + 1 > 11 ? 0 : month + 1, dayNumber).getTime();
                        } else {
                            dayDate = new Date(year, month, dayNumber).getTime();
                        }
                    }
                    // Today
                    if (dayDate === today) addClass += ' picker-calendar-day-today';
                    // Selected
                    if (p.params.rangePicker && currentValues.length === 2) {
                        if (dayDate >= currentValues[0] && dayDate <= currentValues[1]) addClass += ' picker-calendar-day-selected';
                    } else {
                        if (currentValues.indexOf(dayDate) >= 0) addClass += ' picker-calendar-day-selected';
                    }
                    // Weekend
                    if (p.params.weekendDays.indexOf(weekDayIndex) >= 0) {
                        addClass += ' picker-calendar-day-weekend';
                    }
                    // Has Events
                    hasEvent = false;
                    if (p.params.events) {
                        if (p.dateInRange(dayDate, p.params.events)) {
                            hasEvent = true;
                        }
                    }
                    if (hasEvent) {
                        addClass += ' picker-calendar-day-has-events';
                    }
                    // Custom Ranges
                    if (p.params.rangesClasses) {
                        for (k = 0; k < p.params.rangesClasses.length; k++) {
                            if (p.dateInRange(dayDate, p.params.rangesClasses[k].range)) {
                                addClass += ' ' + p.params.rangesClasses[k].cssClass;
                            }
                        }
                    }
                    // Disabled
                    disabled = false;
                    if (minDate && dayDate < minDate || maxDate && dayDate > maxDate) {
                        disabled = true;
                    }
                    if (p.params.disabled) {
                        if (p.dateInRange(dayDate, p.params.disabled)) {
                            disabled = true;
                        }
                    }
                    if (disabled) {
                        addClass += ' picker-calendar-day-disabled';
                    }

                    dayDate = new Date(dayDate);
                    var dayYear = dayDate.getFullYear();
                    var dayMonth = dayDate.getMonth();
                    rowHTML += '<div data-year="' + dayYear + '" data-month="' + dayMonth + '" data-day="' + dayNumber + '" class="picker-calendar-day' + addClass + '" data-date="' + (dayYear + '-' + dayMonth + '-' + dayNumber) + '"><span>' + dayNumber + '</span></div>';
                }
                monthHTML += '<div class="picker-calendar-row">' + rowHTML + '</div>';
            }
            monthHTML = '<div class="picker-calendar-month" data-year="' + year + '" data-month="' + month + '">' + monthHTML + '</div>';
            return monthHTML;
        };
        p.animating = false;
        p.updateCurrentMonthYear = function (dir) {
            if (typeof dir === 'undefined') {
                p.currentMonth = parseInt(p.months.eq(1).attr('data-month'), 10);
                p.currentYear = parseInt(p.months.eq(1).attr('data-year'), 10);
            } else {
                p.currentMonth = parseInt(p.months.eq(dir === 'next' ? p.months.length - 1 : 0).attr('data-month'), 10);
                p.currentYear = parseInt(p.months.eq(dir === 'next' ? p.months.length - 1 : 0).attr('data-year'), 10);
            }
            p.container.find('.current-month-value').text(p.params.monthNames[p.currentMonth]);
            p.container.find('.current-year-value').text(p.currentYear);
        };
        p.onMonthChangeStart = function (dir) {
            p.updateCurrentMonthYear(dir);
            p.months.removeClass('picker-calendar-month-current picker-calendar-month-prev picker-calendar-month-next');
            var currentIndex = dir === 'next' ? p.months.length - 1 : 0;

            p.months.eq(currentIndex).addClass('picker-calendar-month-current');
            p.months.eq(dir === 'next' ? currentIndex - 1 : currentIndex + 1).addClass(dir === 'next' ? 'picker-calendar-month-prev' : 'picker-calendar-month-next');

            if (p.params.onMonthYearChangeStart) {
                p.params.onMonthYearChangeStart(p, p.currentYear, p.currentMonth);
            }
        };
        p.onMonthChangeEnd = function (dir, rebuildBoth) {
            p.animating = false;
            var nextMonthHTML, prevMonthHTML, newMonthHTML;
            p.wrapper.find('.picker-calendar-month:not(.picker-calendar-month-prev):not(.picker-calendar-month-current):not(.picker-calendar-month-next)').remove();

            if (typeof dir === 'undefined') {
                dir = 'next';
                rebuildBoth = true;
            }
            if (!rebuildBoth) {
                newMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), dir);
            } else {
                p.wrapper.find('.picker-calendar-month-next, .picker-calendar-month-prev').remove();
                prevMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), 'prev');
                nextMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), 'next');
            }
            if (dir === 'next' || rebuildBoth) {
                p.wrapper.append(newMonthHTML || nextMonthHTML);
            }
            if (dir === 'prev' || rebuildBoth) {
                p.wrapper.prepend(newMonthHTML || prevMonthHTML);
            }
            p.months = p.wrapper.find('.picker-calendar-month');
            p.setMonthsTranslate(p.monthsTranslate);
            if (p.params.onMonthAdd) {
                p.params.onMonthAdd(p, dir === 'next' ? p.months.eq(p.months.length - 1)[0] : p.months.eq(0)[0]);
            }
            if (p.params.onMonthYearChangeEnd) {
                p.params.onMonthYearChangeEnd(p, p.currentYear, p.currentMonth);
            }
        };
        p.setMonthsTranslate = function (translate) {
            translate = translate || p.monthsTranslate || 0;
            if (typeof p.monthsTranslate === 'undefined') p.monthsTranslate = translate;
            p.months.removeClass('picker-calendar-month-current picker-calendar-month-prev picker-calendar-month-next');
            var prevMonthTranslate = -(translate + 1) * 100 * inverter;
            var currentMonthTranslate = -translate * 100 * inverter;
            var nextMonthTranslate = -(translate - 1) * 100 * inverter;
            p.months.eq(0).transform('translate3d(' + (p.isH ? prevMonthTranslate : 0) + '%, ' + (p.isH ? 0 : prevMonthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
            p.months.eq(1).transform('translate3d(' + (p.isH ? currentMonthTranslate : 0) + '%, ' + (p.isH ? 0 : currentMonthTranslate) + '%, 0)').addClass('picker-calendar-month-current');
            p.months.eq(2).transform('translate3d(' + (p.isH ? nextMonthTranslate : 0) + '%, ' + (p.isH ? 0 : nextMonthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
        };
        p.nextMonth = function (transition) {
            if (typeof transition === 'undefined' || typeof transition === 'object') {
                transition = '';
                if (!p.params.animate) transition = 0;
            }
            var nextMonth = parseInt(p.months.eq(p.months.length - 1).attr('data-month'), 10);
            var nextYear = parseInt(p.months.eq(p.months.length - 1).attr('data-year'), 10);
            var nextDate = new Date(nextYear, nextMonth);
            var nextDateTime = nextDate.getTime();
            var transitionEndCallback = p.animating ? false : true;
            if (p.params.maxDate) {
                if (nextDateTime > new Date(p.params.maxDate).getTime()) {
                    return p.resetMonth();
                }
            }
            p.monthsTranslate--;
            if (nextMonth === p.currentMonth) {
                var nextMonthTranslate = -p.monthsTranslate * 100 * inverter;
                var nextMonthHTML = $(p.monthHTML(nextDateTime, 'next')).transform('translate3d(' + (p.isH ? nextMonthTranslate : 0) + '%, ' + (p.isH ? 0 : nextMonthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
                p.wrapper.append(nextMonthHTML[0]);
                p.months = p.wrapper.find('.picker-calendar-month');
                if (p.params.onMonthAdd) {
                    p.params.onMonthAdd(p, p.months.eq(p.months.length - 1)[0]);
                }
            }
            p.animating = true;
            p.onMonthChangeStart('next');
            var translate = p.monthsTranslate * 100 * inverter;

            p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
            if (transitionEndCallback) {
                p.wrapper.transitionEnd(function () {
                    p.onMonthChangeEnd('next');
                });
            }
            if (!p.params.animate) {
                p.onMonthChangeEnd('next');
            }
        };
        p.prevMonth = function (transition) {
            if (typeof transition === 'undefined' || typeof transition === 'object') {
                transition = '';
                if (!p.params.animate) transition = 0;
            }
            var prevMonth = parseInt(p.months.eq(0).attr('data-month'), 10);
            var prevYear = parseInt(p.months.eq(0).attr('data-year'), 10);
            var prevDate = new Date(prevYear, prevMonth + 1, -1);
            var prevDateTime = prevDate.getTime();
            var transitionEndCallback = p.animating ? false : true;
            if (p.params.minDate) {
                if (prevDateTime < new Date(p.params.minDate).getTime()) {
                    return p.resetMonth();
                }
            }
            p.monthsTranslate++;
            if (prevMonth === p.currentMonth) {
                var prevMonthTranslate = -p.monthsTranslate * 100 * inverter;
                var prevMonthHTML = $(p.monthHTML(prevDateTime, 'prev')).transform('translate3d(' + (p.isH ? prevMonthTranslate : 0) + '%, ' + (p.isH ? 0 : prevMonthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
                p.wrapper.prepend(prevMonthHTML[0]);
                p.months = p.wrapper.find('.picker-calendar-month');
                if (p.params.onMonthAdd) {
                    p.params.onMonthAdd(p, p.months.eq(0)[0]);
                }
            }
            p.animating = true;
            p.onMonthChangeStart('prev');
            var translate = p.monthsTranslate * 100 * inverter;
            p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
            if (transitionEndCallback) {
                p.wrapper.transitionEnd(function () {
                    p.onMonthChangeEnd('prev');
                });
            }
            if (!p.params.animate) {
                p.onMonthChangeEnd('prev');
            }
        };
        p.resetMonth = function (transition) {
            if (typeof transition === 'undefined') transition = '';
            var translate = p.monthsTranslate * 100 * inverter;
            p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
        };
        p.setYearMonth = function (year, month, transition) {
            if (typeof year === 'undefined') year = p.currentYear;
            if (typeof month === 'undefined') month = p.currentMonth;
            if (typeof transition === 'undefined' || typeof transition === 'object') {
                transition = '';
                if (!p.params.animate) transition = 0;
            }
            var targetDate;
            if (year < p.currentYear) {
                targetDate = new Date(year, month + 1, -1).getTime();
            } else {
                targetDate = new Date(year, month).getTime();
            }
            if (p.params.maxDate && targetDate > new Date(p.params.maxDate).getTime()) {
                return false;
            }
            if (p.params.minDate && targetDate < new Date(p.params.minDate).getTime()) {
                return false;
            }
            var currentDate = new Date(p.currentYear, p.currentMonth).getTime();
            var dir = targetDate > currentDate ? 'next' : 'prev';
            var newMonthHTML = p.monthHTML(new Date(year, month));
            p.monthsTranslate = p.monthsTranslate || 0;
            var prevTranslate = p.monthsTranslate;
            var monthTranslate, wrapperTranslate;
            var transitionEndCallback = p.animating ? false : true;
            if (targetDate > currentDate) {
                // To next
                p.monthsTranslate--;
                if (!p.animating) p.months.eq(p.months.length - 1).remove();
                p.wrapper.append(newMonthHTML);
                p.months = p.wrapper.find('.picker-calendar-month');
                monthTranslate = -(prevTranslate - 1) * 100 * inverter;
                p.months.eq(p.months.length - 1).transform('translate3d(' + (p.isH ? monthTranslate : 0) + '%, ' + (p.isH ? 0 : monthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
            } else {
                // To prev
                p.monthsTranslate++;
                if (!p.animating) p.months.eq(0).remove();
                p.wrapper.prepend(newMonthHTML);
                p.months = p.wrapper.find('.picker-calendar-month');
                monthTranslate = -(prevTranslate + 1) * 100 * inverter;
                p.months.eq(0).transform('translate3d(' + (p.isH ? monthTranslate : 0) + '%, ' + (p.isH ? 0 : monthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
            }
            if (p.params.onMonthAdd) {
                p.params.onMonthAdd(p, dir === 'next' ? p.months.eq(p.months.length - 1)[0] : p.months.eq(0)[0]);
            }
            p.animating = true;
            p.onMonthChangeStart(dir);
            wrapperTranslate = p.monthsTranslate * 100 * inverter;
            p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? wrapperTranslate : 0) + '%, ' + (p.isH ? 0 : wrapperTranslate) + '%, 0)');
            if (transitionEndCallback) {
                p.wrapper.transitionEnd(function () {
                    p.onMonthChangeEnd(dir, true);
                });
            }
            if (!p.params.animate) {
                p.onMonthChangeEnd(dir);
            }
        };
        p.nextYear = function () {
            p.setYearMonth(p.currentYear + 1);
        };
        p.prevYear = function () {
            p.setYearMonth(p.currentYear - 1);
        };

        // HTML Layout
        p.layout = function () {
            var pickerHTML = '';
            var pickerClass = '';
            var i;

            var layoutDate = p.value && p.value.length ? p.value[0] : new Date().setHours(0, 0, 0, 0);
            var prevMonthHTML = p.monthHTML(layoutDate, 'prev');
            var currentMonthHTML = p.monthHTML(layoutDate);
            var nextMonthHTML = p.monthHTML(layoutDate, 'next');
            var monthsHTML = '<div class="picker-calendar-months"><div class="picker-calendar-months-wrapper">' + (prevMonthHTML + currentMonthHTML + nextMonthHTML) + '</div></div>';
            // Week days header
            var weekHeaderHTML = '';
            if (p.params.weekHeader) {
                for (i = 0; i < 7; i++) {
                    var weekDayIndex = i + p.params.firstDay > 6 ? i - 7 + p.params.firstDay : i + p.params.firstDay;
                    var dayName = p.params.dayNamesShort[weekDayIndex];
                    weekHeaderHTML += '<div class="picker-calendar-week-day ' + (p.params.weekendDays.indexOf(weekDayIndex) >= 0 ? 'picker-calendar-week-day-weekend' : '') + '"> ' + dayName + '</div>';
                }
                weekHeaderHTML = '<div class="picker-calendar-week-days">' + weekHeaderHTML + '</div>';
            }
            pickerClass = 'picker-modal picker-calendar' + (p.params.rangePicker ? ' picker-calendar-range' : '') + (p.params.cssClass ? ' ' + p.params.cssClass : '');
            var toolbarHTML = p.params.toolbar ? p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText) : '';
            if (p.params.toolbar) {
                toolbarHTML = p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText).replace(/{{monthPicker}}/g, p.params.monthPicker ? p.params.monthPickerTemplate : '').replace(/{{yearPicker}}/g, p.params.yearPicker ? p.params.yearPickerTemplate : '');
            }
            var headerHTML = p.params.header ? p.params.headerTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText).replace(/{{placeholder}}/g, p.params.headerPlaceholder) : '';
            var footerHTML = p.params.footer ? p.params.footerTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText) : '';

            pickerHTML = '<div class="' + pickerClass + '">' + headerHTML + footerHTML + toolbarHTML + '<div class="picker-modal-inner">' + weekHeaderHTML + monthsHTML + '</div>' + '</div>';

            p.pickerHTML = pickerHTML;
        };

        // Input Events
        function openOnInput(e) {
            e.preventDefault();
            if (p.opened) return;
            p.open();
            if (p.params.scrollToInput && !isPopover() && !app.params.material) {
                var pageContent = p.input.parents('.page-content');
                if (pageContent.length === 0) return;

                var paddingTop = parseInt(pageContent.css('padding-top'), 10),
                    paddingBottom = parseInt(pageContent.css('padding-bottom'), 10),
                    pageHeight = pageContent[0].offsetHeight - paddingTop - p.container.height(),
                    pageScrollHeight = pageContent[0].scrollHeight - paddingTop - p.container.height(),
                    newPaddingBottom;

                var inputTop = p.input.offset().top - paddingTop + p.input[0].offsetHeight;
                if (inputTop > pageHeight) {
                    var scrollTop = pageContent.scrollTop() + inputTop - pageHeight;
                    if (scrollTop + pageHeight > pageScrollHeight) {
                        newPaddingBottom = scrollTop + pageHeight - pageScrollHeight + paddingBottom;
                        if (pageHeight === pageScrollHeight) {
                            newPaddingBottom = p.container.height();
                        }
                        pageContent.css({ 'padding-bottom': newPaddingBottom + 'px' });
                    }
                    pageContent.scrollTop(scrollTop, 300);
                }
            }
        }
        function closeOnHTMLClick(e) {
            if (inPopover()) return;
            if (p.input && p.input.length > 0) {
                if (e.target !== p.input[0] && $(e.target).parents('.picker-modal').length === 0) p.close();
            } else {
                if ($(e.target).parents('.picker-modal').length === 0) p.close();
            }
        }

        if (p.params.input) {
            p.input = $(p.params.input);
            if (p.input.length > 0) {
                if (p.params.inputReadOnly) p.input.prop('readOnly', true);
                if (!p.inline) {
                    p.input.on('click', openOnInput);
                }
                if (p.params.inputReadOnly) {
                    p.input.on('focus mousedown', function (e) {
                        e.preventDefault();
                    });
                }
            }
        }

        if (!p.inline && p.params.closeByOutsideClick) $('html').on('click', closeOnHTMLClick);

        // Open
        function onPickerClose() {
            p.opened = false;
            if (p.input && p.input.length > 0) {
                p.input.parents('.page-content').css({ 'padding-bottom': '' });
                if (app.params.material) p.input.trigger('blur');
            }
            if (p.params.onClose) p.params.onClose(p);

            // Destroy events
            p.destroyCalendarEvents();
        }

        p.opened = false;
        p.open = function () {
            var toPopover = isPopover();
            var updateValue = false;
            if (!p.opened) {
                // Set date value
                if (!p.value) {
                    if (p.params.value) {
                        p.value = p.params.value;
                        updateValue = true;
                    }
                }

                // Layout
                p.layout();

                // Append
                if (toPopover) {
                    p.pickerHTML = '<div class="popover popover-picker-calendar"><div class="popover-inner">' + p.pickerHTML + '</div></div>';
                    p.popover = app.popover(p.pickerHTML, p.params.input, true);
                    p.container = $(p.popover).find('.picker-modal');
                    $(p.popover).on('close', function () {
                        onPickerClose();
                    });
                } else if (p.inline) {
                    p.container = $(p.pickerHTML);
                    p.container.addClass('picker-modal-inline');
                    $(p.params.container).append(p.container);
                } else {
                    p.container = $(app.pickerModal(p.pickerHTML));
                    $(p.container).on('close', function () {
                        onPickerClose();
                    });
                }

                // Store calendar instance
                p.container[0].f7Calendar = p;
                p.wrapper = p.container.find('.picker-calendar-months-wrapper');

                // Months
                p.months = p.wrapper.find('.picker-calendar-month');

                // Update current month and year
                p.updateCurrentMonthYear();

                // Set initial translate
                p.monthsTranslate = 0;
                p.setMonthsTranslate();

                // Init events
                p.initCalendarEvents();

                // Update input value
                if (updateValue) p.updateValue();else if (app.params.material && p.value) p.updateValue(true);

                // Material Focus
                if (p.input && p.input.length > 0 && app.params.material) {
                    p.input.trigger('focus');
                }
            }

            // Set flag
            p.opened = true;
            p.initialized = true;
            if (p.params.onMonthAdd) {
                p.months.each(function () {
                    p.params.onMonthAdd(p, this);
                });
            }
            if (p.params.onOpen) p.params.onOpen(p);
        };

        // Close
        p.close = function () {
            if (!p.opened || p.inline) return;
            if (inPopover()) {
                app.closeModal(p.popover);
                return;
            } else {
                app.closeModal(p.container);
                return;
            }
        };

        // Destroy
        p.destroy = function () {
            p.close();
            if (p.params.input && p.input.length > 0) {
                p.input.off('click focus', openOnInput);
            }
            $('html').off('click', closeOnHTMLClick);
        };

        if (p.inline) {
            p.open();
        } else {
            if (!p.initialized && p.params.value) p.setValue(p.params.value);
        }

        return p;
    };
    app.calendar = function (params) {
        return new Calendar(params);
    };
    return app;
};

},{}],78:[function(require,module,exports){
'use strict';

module.exports = function (app) {
    /*===============================================================================
    ************   Handle clicks and make them fast (on tap);   ************
    ===============================================================================*/
    app.initClickEvents = function () {
        function handleClicks(e) {
            /*jshint validthis:true */
            var clicked = $(this);

            // Close Modal
            if (clicked.hasClass('modal-overlay')) {
                if ($('.modal.modal-in').length > 0 && app.params.modalCloseByOutside) app.closeModal('.modal.modal-in');
                if ($('.actions-modal.modal-in').length > 0 && app.params.actionsCloseByOutside) app.closeModal('.actions-modal.modal-in');

                if ($('.popover.modal-in').length > 0) app.closeModal('.popover.modal-in');
            }
            if (clicked.hasClass('popup-overlay')) {
                if ($('.popup.modal-in').length > 0 && app.params.popupCloseByOutside) app.closeModal('.popup.modal-in');
            }
            if (clicked.hasClass('picker-modal-overlay')) {
                if ($('.picker-modal.modal-in').length > 0) app.closeModal('.picker-modal.modal-in');
            }

            // Picker
            if (clicked.hasClass('close-picker')) {
                var pickerToClose = $('.picker-modal.modal-in');
                if (pickerToClose.length > 0) {
                    app.closeModal(pickerToClose);
                } else {
                    pickerToClose = $('.popover.modal-in .picker-modal');
                    if (pickerToClose.length > 0) {
                        app.closeModal(pickerToClose.parents('.popover'));
                    }
                }
            }

            // Close Panel
            if (clicked.hasClass('close-panel')) {
                app.closePanel();
            }

            if (clicked.hasClass('panel-overlay') && app.params.panelsCloseByOutside) {
                app.closePanel();
            }

            // Popup
            var popup;
            if (clicked.hasClass('close-popup')) {
                app.closeModal('.popup.modal-in');
            }

            // Popover
            if (clicked.hasClass('close-popover')) {
                app.closeModal('.popover.modal-in');
            }
        }
        $(document).on('click', '.modal-overlay, .popup-overlay, .picker-modal-overlay, .close-picker, .close-panel, .panel-overlay, .close-popup, .close-popover', handleClicks);

        // Prevent scrolling on overlays
        function preventScrolling(e) {
            e.preventDefault();
        }
        if (app.support.touch && !app.device.android) {
            $(document).on(app.params.fastClicks ? 'touchstart' : 'touchmove', '.panel-overlay, .modal-overlay, .preloader-indicator-overlay, .popup-overlay, .searchbar-overlay', preventScrolling);
        }
    };
    return app;
};

},{}],79:[function(require,module,exports){
'use strict';

module.exports = function (app) {
    /*===============================================================================
    ************   Fast Clicks   ************
    ************   Inspired by https://github.com/ftlabs/fastclick   ************
    ===============================================================================*/
    app.initFastClicks = function () {
        if (app.params.activeState) {
            $('html').addClass('watch-active-state');
        }
        if (app.device.ios && app.device.webView) {
            // Strange hack required for iOS 8 webview to work on inputs
            window.addEventListener('touchstart', function () {});
        }

        var touchStartX, touchStartY, touchStartTime, targetElement, trackClick, activeSelection, scrollParent, lastClickTime, isMoved, tapHoldFired, tapHoldTimeout;
        var activableElement, activeTimeout, needsFastClick, needsFastClickTimeOut;
        var rippleWave, rippleTarget, rippleTransform, rippleTimeout;
        function findActivableElement(el) {
            var target = $(el);
            var parents = target.parents(app.params.activeStateElements);
            var activable;
            if (target.is(app.params.activeStateElements)) {
                activable = target;
            }
            if (parents.length > 0) {
                activable = activable ? activable.add(parents) : parents;
            }
            return activable ? activable : target;
        }
        function isInsideScrollableView(el) {
            var pageContent = el.parents('.page-content, .panel');

            if (pageContent.length === 0) {
                return false;
            }

            // This event handler covers the "tap to stop scrolling".
            if (pageContent.prop('scrollHandlerSet') !== 'yes') {
                pageContent.on('scroll', function () {
                    clearTimeout(activeTimeout);
                    clearTimeout(rippleTimeout);
                });
                pageContent.prop('scrollHandlerSet', 'yes');
            }

            return true;
        }
        function addActive() {
            if (!activableElement) return;
            activableElement.addClass('active-state');
        }
        function removeActive(el) {
            if (!activableElement) return;
            activableElement.removeClass('active-state');
            activableElement = null;
        }
        function isFormElement(el) {
            var nodes = 'input select textarea label'.split(' ');
            if (el.nodeName && nodes.indexOf(el.nodeName.toLowerCase()) >= 0) return true;
            return false;
        }
        function androidNeedsBlur(el) {
            var noBlur = 'button input textarea select'.split(' ');
            if (document.activeElement && el !== document.activeElement && document.activeElement !== document.body) {
                if (noBlur.indexOf(el.nodeName.toLowerCase()) >= 0) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return false;
            }
        }
        function targetNeedsFastClick(el) {
            var $el = $(el);
            if (el.nodeName.toLowerCase() === 'input' && el.type === 'file') return false;
            if ($el.hasClass('no-fastclick') || $el.parents('.no-fastclick').length > 0) return false;
            return true;
        }
        function targetNeedsFocus(el) {
            if (document.activeElement === el) {
                return false;
            }
            var tag = el.nodeName.toLowerCase();
            var skipInputs = 'button checkbox file image radio submit'.split(' ');
            if (el.disabled || el.readOnly) return false;
            if (tag === 'textarea') return true;
            if (tag === 'select') {
                if (app.device.android) return false;else return true;
            }
            if (tag === 'input' && skipInputs.indexOf(el.type) < 0) return true;
        }
        function targetNeedsPrevent(el) {
            el = $(el);
            var prevent = true;
            if (el.is('label') || el.parents('label').length > 0) {
                if (app.device.android) {
                    prevent = false;
                } else if (app.device.ios && el.is('input')) {
                    prevent = true;
                } else prevent = false;
            }
            return prevent;
        }

        // Mouse Handlers
        function handleMouseDown(e) {
            findActivableElement(e.target).addClass('active-state');
            if ('which' in e && e.which === 3) {
                setTimeout(function () {
                    $('.active-state').removeClass('active-state');
                }, 0);
            }
            if (app.params.material && app.params.materialRipple) {
                touchStartX = e.pageX;
                touchStartY = e.pageY;
                rippleTouchStart(e.target, e.pageX, e.pageY);
            }
        }
        function handleMouseMove(e) {
            $('.active-state').removeClass('active-state');
            if (app.params.material && app.params.materialRipple) {
                rippleTouchMove();
            }
        }
        function handleMouseUp(e) {
            $('.active-state').removeClass('active-state');
            if (app.params.material && app.params.materialRipple) {
                rippleTouchEnd();
            }
        }

        // Material Touch Ripple Effect
        function findRippleElement(el) {
            var needsRipple = app.params.materialRippleElements;
            var $el = $(el);
            if ($el.is(needsRipple)) {
                if ($el.hasClass('no-ripple')) {
                    return false;
                }
                return $el;
            } else if ($el.parents(needsRipple).length > 0) {
                var rippleParent = $el.parents(needsRipple).eq(0);
                if (rippleParent.hasClass('no-ripple')) {
                    return false;
                }
                return rippleParent;
            } else return false;
        }
        function createRipple(x, y, el) {
            var box = el[0].getBoundingClientRect();
            var center = {
                x: x - box.left,
                y: y - box.top
            },
                height = box.height,
                width = box.width;
            var diameter = Math.max(Math.pow(Math.pow(height, 2) + Math.pow(width, 2), 0.5), 48);

            rippleWave = $('<div class="ripple-wave" style="width: ' + diameter + 'px; height: ' + diameter + 'px; margin-top:-' + diameter / 2 + 'px; margin-left:-' + diameter / 2 + 'px; left:' + center.x + 'px; top:' + center.y + 'px;"></div>');
            el.prepend(rippleWave);
            var clientLeft = rippleWave[0].clientLeft;
            rippleTransform = 'translate3d(' + (-center.x + width / 2) + 'px, ' + (-center.y + height / 2) + 'px, 0) scale(1)';
            rippleWave.transform(rippleTransform);
        }

        function removeRipple() {
            if (!rippleWave) return;
            var toRemove = rippleWave;

            var removeTimeout = setTimeout(function () {
                toRemove.remove();
            }, 400);

            rippleWave.addClass('ripple-wave-fill').transform(rippleTransform.replace('scale(1)', 'scale(1.01)')).transitionEnd(function () {
                clearTimeout(removeTimeout);

                var rippleWave = $(this).addClass('ripple-wave-out').transform(rippleTransform.replace('scale(1)', 'scale(1.01)'));

                removeTimeout = setTimeout(function () {
                    rippleWave.remove();
                }, 700);

                setTimeout(function () {
                    rippleWave.transitionEnd(function () {
                        clearTimeout(removeTimeout);
                        $(this).remove();
                    });
                }, 0);
            });

            rippleWave = rippleTarget = undefined;
        }

        function rippleTouchStart(el, x, y) {
            rippleTarget = findRippleElement(el);
            if (!rippleTarget || rippleTarget.length === 0) {
                rippleTarget = undefined;
                return;
            }
            if (!isInsideScrollableView(rippleTarget)) {
                createRipple(touchStartX, touchStartY, rippleTarget);
            } else {
                rippleTimeout = setTimeout(function () {
                    createRipple(touchStartX, touchStartY, rippleTarget);
                }, 80);
            }
        }
        function rippleTouchMove() {
            clearTimeout(rippleTimeout);
            removeRipple();
        }
        function rippleTouchEnd() {
            if (rippleWave) {
                removeRipple();
            } else if (rippleTarget && !isMoved) {
                clearTimeout(rippleTimeout);
                createRipple(touchStartX, touchStartY, rippleTarget);
                setTimeout(removeRipple, 0);
            } else {
                removeRipple();
            }
        }

        // Send Click
        function sendClick(e) {
            var touch = e.changedTouches[0];
            var evt = document.createEvent('MouseEvents');
            var eventType = 'click';
            if (app.device.android && targetElement.nodeName.toLowerCase() === 'select') {
                eventType = 'mousedown';
            }
            evt.initMouseEvent(eventType, true, true, window, 1, touch.screenX, touch.screenY, touch.clientX, touch.clientY, false, false, false, false, 0, null);
            evt.forwardedTouchEvent = true;
            targetElement.dispatchEvent(evt);
        }

        // Touch Handlers
        function handleTouchStart(e) {
            isMoved = false;
            tapHoldFired = false;
            if (e.targetTouches.length > 1) {
                if (activableElement) removeActive();
                return true;
            }
            if (e.touches.length > 1 && activableElement) {
                removeActive();
            }
            if (app.params.tapHold) {
                if (tapHoldTimeout) clearTimeout(tapHoldTimeout);
                tapHoldTimeout = setTimeout(function () {
                    tapHoldFired = true;
                    e.preventDefault();
                    $(e.target).trigger('taphold');
                }, app.params.tapHoldDelay);
            }
            if (needsFastClickTimeOut) clearTimeout(needsFastClickTimeOut);
            needsFastClick = targetNeedsFastClick(e.target);

            if (!needsFastClick) {
                trackClick = false;
                return true;
            }
            if (app.device.ios) {
                var selection = window.getSelection();
                if (selection.rangeCount && selection.focusNode !== document.body && (!selection.isCollapsed || document.activeElement === selection.focusNode)) {
                    activeSelection = true;
                    return true;
                } else {
                    activeSelection = false;
                }
            }
            if (app.device.android) {
                if (androidNeedsBlur(e.target)) {
                    document.activeElement.blur();
                }
            }

            trackClick = true;
            targetElement = e.target;
            touchStartTime = new Date().getTime();
            touchStartX = e.targetTouches[0].pageX;
            touchStartY = e.targetTouches[0].pageY;

            // Detect scroll parent
            if (app.device.ios) {
                scrollParent = undefined;
                $(targetElement).parents().each(function () {
                    var parent = this;
                    if (parent.scrollHeight > parent.offsetHeight && !scrollParent) {
                        scrollParent = parent;
                        scrollParent.f7ScrollTop = scrollParent.scrollTop;
                    }
                });
            }
            if (e.timeStamp - lastClickTime < app.params.fastClicksDelayBetweenClicks) {
                e.preventDefault();
            }

            if (app.params.activeState) {
                activableElement = findActivableElement(targetElement);
                // If it's inside a scrollable view, we don't trigger active-state yet,
                // because it can be a scroll instead. Based on the link:
                // http://labnote.beedesk.com/click-scroll-and-pseudo-active-on-mobile-webk
                if (!isInsideScrollableView(activableElement)) {
                    addActive();
                } else {
                    activeTimeout = setTimeout(addActive, 80);
                }
            }
            if (app.params.material && app.params.materialRipple) {
                rippleTouchStart(targetElement, touchStartX, touchStartY);
            }
        }
        function handleTouchMove(e) {
            if (!trackClick) return;
            var _isMoved = false;
            var distance = app.params.fastClicksDistanceThreshold;
            if (distance) {
                var pageX = e.targetTouches[0].pageX;
                var pageY = e.targetTouches[0].pageY;
                if (Math.abs(pageX - touchStartX) > distance || Math.abs(pageY - touchStartY) > distance) {
                    _isMoved = true;
                }
            } else {
                _isMoved = true;
            }
            if (_isMoved) {
                trackClick = false;
                targetElement = null;
                isMoved = true;
                if (app.params.tapHold) {
                    clearTimeout(tapHoldTimeout);
                }
                if (app.params.activeState) {
                    clearTimeout(activeTimeout);
                    removeActive();
                }
                if (app.params.material && app.params.materialRipple) {
                    rippleTouchMove();
                }
            }
        }
        function handleTouchEnd(e) {
            clearTimeout(activeTimeout);
            clearTimeout(tapHoldTimeout);

            if (!trackClick) {
                if (!activeSelection && needsFastClick) {
                    if (!(app.device.android && !e.cancelable)) {
                        e.preventDefault();
                    }
                }
                return true;
            }

            if (document.activeElement === e.target) {
                if (app.params.activeState) removeActive();
                if (app.params.material && app.params.materialRipple) {
                    rippleTouchEnd();
                }
                return true;
            }

            if (!activeSelection) {
                e.preventDefault();
            }

            if (e.timeStamp - lastClickTime < app.params.fastClicksDelayBetweenClicks) {
                setTimeout(removeActive, 0);
                return true;
            }

            lastClickTime = e.timeStamp;

            trackClick = false;

            if (app.device.ios && scrollParent) {
                if (scrollParent.scrollTop !== scrollParent.f7ScrollTop) {
                    return false;
                }
            }

            // Add active-state here because, in a very fast tap, the timeout didn't
            // have the chance to execute. Removing active-state in a timeout gives
            // the chance to the animation execute.
            if (app.params.activeState) {
                addActive();
                setTimeout(removeActive, 0);
            }
            // Remove Ripple
            if (app.params.material && app.params.materialRipple) {
                rippleTouchEnd();
            }

            // Trigger focus when required
            if (targetNeedsFocus(targetElement)) {
                if (app.device.ios && app.device.webView) {
                    if (event.timeStamp - touchStartTime > 159) {
                        targetElement = null;
                        return false;
                    }
                    targetElement.focus();
                    return false;
                } else {
                    targetElement.focus();
                }
            }

            // Blur active elements
            if (document.activeElement && targetElement !== document.activeElement && document.activeElement !== document.body && targetElement.nodeName.toLowerCase() !== 'label') {
                document.activeElement.blur();
            }

            // Send click
            e.preventDefault();
            sendClick(e);
            return false;
        }
        function handleTouchCancel(e) {
            trackClick = false;
            targetElement = null;

            // Remove Active State
            clearTimeout(activeTimeout);
            clearTimeout(tapHoldTimeout);
            if (app.params.activeState) {
                removeActive();
            }

            // Remove Ripple
            if (app.params.material && app.params.materialRipple) {
                rippleTouchEnd();
            }
        }

        function handleClick(e) {
            var allowClick = false;

            if (trackClick) {
                targetElement = null;
                trackClick = false;
                return true;
            }
            if (e.target.type === 'submit' && e.detail === 0) {
                return true;
            }
            if (!targetElement) {
                if (!isFormElement(e.target)) {
                    allowClick = true;
                }
            }
            if (!needsFastClick) {
                allowClick = true;
            }
            if (document.activeElement === targetElement) {
                allowClick = true;
            }
            if (e.forwardedTouchEvent) {
                allowClick = true;
            }
            if (!e.cancelable) {
                allowClick = true;
            }
            if (app.params.tapHold && app.params.tapHoldPreventClicks && tapHoldFired) {
                allowClick = false;
            }
            if (!allowClick) {
                e.stopImmediatePropagation();
                e.stopPropagation();
                if (targetElement) {
                    if (targetNeedsPrevent(targetElement) || isMoved) {
                        e.preventDefault();
                    }
                } else {
                    e.preventDefault();
                }
                targetElement = null;
            }
            needsFastClickTimeOut = setTimeout(function () {
                needsFastClick = false;
            }, app.device.ios || app.device.androidChrome ? 100 : 400);

            if (app.params.tapHold) {
                tapHoldTimeout = setTimeout(function () {
                    tapHoldFired = false;
                }, app.device.ios || app.device.androidChrome ? 100 : 400);
            }

            return allowClick;
        }
        if (app.support.touch) {
            document.addEventListener('click', handleClick, true);

            document.addEventListener('touchstart', handleTouchStart);
            document.addEventListener('touchmove', handleTouchMove);
            document.addEventListener('touchend', handleTouchEnd);
            document.addEventListener('touchcancel', handleTouchCancel);
        } else {
            if (app.params.activeState) {
                document.addEventListener('mousedown', handleMouseDown);
                document.addEventListener('mousemove', handleMouseMove);
                document.addEventListener('mouseup', handleMouseUp);
            }
        }
        if (app.params.material && app.params.materialRipple) {
            document.addEventListener('contextmenu', function (e) {
                if (activableElement) removeActive();
                rippleTouchEnd();
            });
        }
    };
    return app;
};

},{}],80:[function(require,module,exports){
'use strict';

module.exports = function (app) {
	app.initFloatingLabel = function (container) {
		container = $(container);
		var input = container.find('input'),
		    label = container.find('.label');

		var placeholder = label.html();
		input.attr('placeholder', placeholder);

		input.on('focus', function (e) {
			if (!input.hasClass('label-active')) {
				input.addClass('label-active');
				label.addClass('active');
			}
		});

		input.on('blur', function (e) {
			if (!input.val()) {
				input.removeClass('label-active');
				label.removeClass('active');
			}
		});
		return input;
	};
	return app;
};

},{}],81:[function(require,module,exports){
'use strict';

module.exports = function (app) {
    /* ===============================================================================
    ************   Infinite Scroll   ************
    =============================================================================== */
    function handleInfiniteScroll() {
        /*jshint validthis:true */
        var inf = $(this);
        var scrollTop = inf[0].scrollTop;
        var scrollHeight = inf[0].scrollHeight;
        var height = inf[0].offsetHeight;
        var distance = inf[0].getAttribute('data-distance');
        var virtualListContainer = inf.find('.virtual-list');
        var virtualList;
        var onTop = inf.hasClass('infinite-scroll-top');
        if (!distance) distance = 50;
        if (typeof distance === 'string' && distance.indexOf('%') >= 0) {
            distance = parseInt(distance, 10) / 100 * height;
        }
        if (distance > height) distance = height;
        if (onTop) {
            if (scrollTop < distance) {
                inf.trigger('infinite');
            }
        } else {
            if (scrollTop + height >= scrollHeight - distance) {
                if (virtualListContainer.length > 0) {
                    virtualList = virtualListContainer[0].f7VirtualList;
                    if (virtualList && !virtualList.reachEnd) return;
                }
                inf.trigger('infinite');
            }
        }
    }
    app.attachInfiniteScroll = function (infiniteContent) {
        $(infiniteContent).on('scroll', handleInfiniteScroll);
    };
    app.detachInfiniteScroll = function (infiniteContent) {
        $(infiniteContent).off('scroll', handleInfiniteScroll);
    };

    app.initInfiniteScroll = function (infiniteContent) {
        app.attachInfiniteScroll(infiniteContent);
        function detachEvents() {
            app.detachInfiniteScroll(infiniteContent);
        }
        app.destroyInfiniteScroll = detachEvents;
    };
    return app;
};

},{}],82:[function(require,module,exports){
'use strict';

module.exports = function (app) {
    /*======================================================
    ************   Material Text Inputs   ************
    ======================================================*/
    app.initPageMaterialInputs = function (pageContainer) {
        pageContainer = $(pageContainer);
        var textareas = pageContainer.find('textarea.resizable');
        pageContainer.find('.item-input').each(function () {
            var itemInput = $(this);
            var notInputs = ['checkbox', 'button', 'submit', 'range', 'radio', 'image'];
            itemInput.find('input, select, textarea').each(function () {
                var input = $(this);
                if (notInputs.indexOf(input.attr('type')) < 0) {
                    itemInput.addClass('item-input-field');
                    if (input.val().trim() !== '') {
                        input.parents('.item-input, .input-field').add(input.parents('.item-inner')).addClass('not-empty-state');
                    }
                }
            });
            if (itemInput.parents('.input-item, .inputs-list').length > 0) return;
            itemInput.parents('.list-block').eq(0).addClass('inputs-list');
        });
    };
    /*======================================================
    ************   Material Focus Inputs   ************
    ======================================================*/
    app.initMaterialWatchInputs = function () {
        var notInputs = ['checkbox', 'button', 'submit', 'range', 'radio', 'image'];
        function addFocusState(e) {
            /*jshint validthis:true*/
            var i = $(this);
            var type = i.attr('type');
            if (notInputs.indexOf(type) >= 0) return;
            var els = i.add(i.parents('.item-input, .input-field')).add(i.parents('.item-inner').eq(0));
            els.addClass('focus-state');
        }
        function removeFocusState(e) {
            /*jshint validthis:true*/
            var i = $(this),
                value = i.val();
            var type = i.attr('type');
            if (notInputs.indexOf(type) >= 0) return;
            var els = i.add(i.parents('.item-input, .input-field')).add(i.parents('.item-inner').eq(0));
            els.removeClass('focus-state');
            if (value && value.trim() !== '') {
                els.addClass('not-empty-state');
            } else {
                els.removeClass('not-empty-state');
            }
        }
        function watchChangeState(e) {
            /*jshint validthis:true*/
            var i = $(this),
                value = i.val();
            var type = i.attr('type');
            if (notInputs.indexOf(type) >= 0) return;
            var els = i.add(i.parents('.item-input, .input-field')).add(i.parents('.item-inner').eq(0));
            if (value && value.trim() !== '') {
                els.addClass('not-empty-state');
            } else {
                els.removeClass('not-empty-state');
            }
        }
        $(document).on('change', '.item-input input, .item-input select, .item-input textarea, input, textarea, select', watchChangeState, true);
        $(document).on('focus', '.item-input input, .item-input select, .item-input textarea, input, textarea, select', addFocusState, true);
        $(document).on('blur', '.item-input input, .item-input select, .item-input textarea, input, textarea, select', removeFocusState, true);
    };
    return app;
};

},{}],83:[function(require,module,exports){
'use strict';

module.exports = function (app) {
    /*======================================================
    ************   Material Preloader   ************
    ======================================================*/
    app.initPageMaterialPreloader = function (pageContainer) {
        $(pageContainer).find('.preloader').each(function () {
            if ($(this).children().length === 0) {
                $(this).html(app.params.materialPreloaderHtml);
            }
        });
    };
    return app;
};

},{}],84:[function(require,module,exports){
'use strict';

module.exports = function (app) {
    /*======================================================
    ************   Material Tabbar   ************
    ======================================================*/
    app.materialTabbarSetHighlight = function (tabbar, activeLink) {
        tabbar = $(tabbar);
        activeLink = activeLink || tabbar.find('.tab-link.active');

        var tabLinkWidth, highlightTranslate;
        if (tabbar.hasClass('tabbar-scrollable')) {
            tabLinkWidth = activeLink[0].offsetWidth + 'px';
            highlightTranslate = (app.rtl ? -activeLink[0].offsetLeft : activeLink[0].offsetLeft) + 'px';
        } else {
            tabLinkWidth = 1 / tabbar.find('.tab-link').length * 100 + '%';
            highlightTranslate = (app.rtl ? -activeLink.index() : activeLink.index()) * 100 + '%';
        }

        tabbar.find('.tab-link-highlight').css({ width: tabLinkWidth }).transform('translate3d(' + highlightTranslate + ',0,0)');
    };
    app.initPageMaterialTabbar = function (pageContainer) {
        pageContainer = $(pageContainer);
        var tabbar = $(pageContainer).find('.tabbar');

        function tabbarSetHighlight() {
            app.materialTabbarSetHighlight(tabbar);
        }
        if (tabbar.length > 0) {
            if (tabbar.find('.tab-link-highlight').length === 0) {
                tabbar.find('.toolbar-inner').append('<span class="tab-link-highlight"></span>');
            }

            tabbarSetHighlight();
        }
    };
    return app;
};

},{}],85:[function(require,module,exports){
'use strict';

module.exports = function (app) {
    /*======================================================
    ************   Modals   ************
    ======================================================*/
    var _modalTemplateTempDiv = document.createElement('div');
    app.modalStack = [];
    app.modalStackClearQueue = function () {
        if (app.modalStack.length) {
            app.modalStack.shift()();
        }
    };
    app.modal = function (params) {
        params = params || {};
        var modalHTML = '';
        if (app.params.modalTemplate) {
            if (!app._compiledTemplates.modal) app._compiledTemplates.modal = t7.compile(app.params.modalTemplate);
            modalHTML = app._compiledTemplates.modal(params);
        } else {
            var buttonsHTML = '';
            if (params.buttons && params.buttons.length > 0) {
                for (var i = 0; i < params.buttons.length; i++) {
                    buttonsHTML += '<span class="modal-button' + (params.buttons[i].bold ? ' modal-button-bold' : '') + '">' + params.buttons[i].text + '</span>';
                }
            }
            var titleHTML = params.title ? '<div class="modal-title">' + params.title + '</div>' : '';
            var textHTML = params.text ? '<div class="modal-text">' + params.text + '</div>' : '';
            var afterTextHTML = params.afterText ? params.afterText : '';
            var noButtons = !params.buttons || params.buttons.length === 0 ? 'modal-no-buttons' : '';
            var verticalButtons = params.verticalButtons ? 'modal-buttons-vertical' : '';
            var modalButtonsHTML = params.buttons && params.buttons.length > 0 ? '<div class="modal-buttons modal-buttons-' + params.buttons.length + ' ' + verticalButtons + '">' + buttonsHTML + '</div>' : '';
            modalHTML = '<div class="modal ' + noButtons + ' ' + (params.cssClass || '') + '"><div class="modal-inner">' + (titleHTML + textHTML + afterTextHTML) + '</div>' + modalButtonsHTML + '</div>';
        }

        _modalTemplateTempDiv.innerHTML = modalHTML;

        var modal = $(_modalTemplateTempDiv).children();

        $('body').append(modal[0]);

        // Add events on buttons
        modal.find('.modal-button').each(function (index, el) {
            $(el).on('click', function (e) {
                if (params.buttons[index].close !== false) app.closeModal(modal);
                if (params.buttons[index].onClick) params.buttons[index].onClick(modal, e);
                if (params.onClick) params.onClick(modal, index);
            });
        });
        app.openModal(modal);
        return modal[0];
    };
    app.alert = function (text, title, callbackOk) {
        if (typeof title === 'function') {
            callbackOk = arguments[1];
            title = undefined;
        }
        return app.modal({
            text: text || '',
            title: typeof title === 'undefined' ? app.params.modalTitle : title,
            buttons: [{ text: app.params.modalButtonOk, bold: true, onClick: callbackOk }]
        });
    };
    app.confirm = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
            callbackCancel = arguments[2];
            callbackOk = arguments[1];
            title = undefined;
        }
        return app.modal({
            text: text || '',
            title: typeof title === 'undefined' ? app.params.modalTitle : title,
            buttons: [{ text: app.params.modalButtonCancel, onClick: callbackCancel }, { text: app.params.modalButtonOk, bold: true, onClick: callbackOk }]
        });
    };
    app.prompt = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
            callbackCancel = arguments[2];
            callbackOk = arguments[1];
            title = undefined;
        }
        return app.modal({
            text: text || '',
            title: typeof title === 'undefined' ? app.params.modalTitle : title,
            afterText: '<div class="input-field"><input type="text" class="modal-text-input"></div>',
            buttons: [{
                text: app.params.modalButtonCancel
            }, {
                text: app.params.modalButtonOk,
                bold: true
            }],
            onClick: function onClick(modal, index) {
                if (index === 0 && callbackCancel) callbackCancel($(modal).find('.modal-text-input').val());
                if (index === 1 && callbackOk) callbackOk($(modal).find('.modal-text-input').val());
            }
        });
    };
    app.modalLogin = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
            callbackCancel = arguments[2];
            callbackOk = arguments[1];
            title = undefined;
        }
        return app.modal({
            text: text || '',
            title: typeof title === 'undefined' ? app.params.modalTitle : title,
            afterText: '<div class="input-field modal-input-double"><input type="text" name="modal-username" placeholder="' + app.params.modalUsernamePlaceholder + '" class="modal-text-input"></div><div class="input-field modal-input-double"><input type="password" name="modal-password" placeholder="' + app.params.modalPasswordPlaceholder + '" class="modal-text-input"></div>',
            buttons: [{
                text: app.params.modalButtonCancel
            }, {
                text: app.params.modalButtonOk,
                bold: true
            }],
            onClick: function onClick(modal, index) {
                var username = $(modal).find('.modal-text-input[name="modal-username"]').val();
                var password = $(modal).find('.modal-text-input[name="modal-password"]').val();
                if (index === 0 && callbackCancel) callbackCancel(username, password);
                if (index === 1 && callbackOk) callbackOk(username, password);
            }
        });
    };
    app.modalPassword = function (text, title, callbackOk, callbackCancel) {
        if (typeof title === 'function') {
            callbackCancel = arguments[2];
            callbackOk = arguments[1];
            title = undefined;
        }
        return app.modal({
            text: text || '',
            title: typeof title === 'undefined' ? app.params.modalTitle : title,
            afterText: '<div class="input-field"><input type="password" name="modal-password" placeholder="' + app.params.modalPasswordPlaceholder + '" class="modal-text-input"></div>',
            buttons: [{
                text: app.params.modalButtonCancel
            }, {
                text: app.params.modalButtonOk,
                bold: true
            }],
            onClick: function onClick(modal, index) {
                var password = $(modal).find('.modal-text-input[name="modal-password"]').val();
                if (index === 0 && callbackCancel) callbackCancel(password);
                if (index === 1 && callbackOk) callbackOk(password);
            }
        });
    };
    app.showPreloader = function (title) {
        return app.modal({
            title: title || app.params.modalPreloaderTitle,
            text: '<div class="preloader">' + (app.params.material ? app.params.materialPreloaderHtml : '') + '</div>',
            cssClass: 'modal-preloader'
        });
    };
    app.hidePreloader = function () {
        app.closeModal('.modal.modal-in');
    };
    app.showIndicator = function () {
        $('body').append('<div class="preloader-indicator-overlay"></div><div class="preloader-indicator-modal"><span class="preloader preloader-white">' + (app.params.material ? app.params.materialPreloaderHtml : '') + '</span></div>');
    };
    app.hideIndicator = function () {
        $('.preloader-indicator-overlay, .preloader-indicator-modal').remove();
    };
    // Action Sheet
    app.actions = function (target, params) {
        var toPopover = false,
            modal,
            groupSelector,
            buttonSelector;
        if (arguments.length === 1) {
            // Actions
            params = target;
        } else {
            // Popover
            if (app.device.ios) {
                if (app.device.ipad) toPopover = true;
            } else {
                if ($(window).width() >= 768) toPopover = true;
            }
        }
        params = params || [];

        if (params.length > 0 && !$.isArray(params[0])) {
            params = [params];
        }
        var modalHTML;
        if (toPopover) {
            var actionsToPopoverTemplate = app.params.modalActionsToPopoverTemplate || '<div class="popover actions-popover">' + '<div class="popover-inner">' + '{{#each this}}' + '<div class="list-block">' + '<ul>' + '{{#each this}}' + '{{#if label}}' + '<li class="actions-popover-label {{#if color}}color-{{color}}{{/if}} {{#if bold}}actions-popover-bold{{/if}}">{{text}}</li>' + '{{else}}' + '<li><a href="#" class="item-link list-button {{#if color}}color-{{color}}{{/if}} {{#if bg}}bg-{{bg}}{{/if}} {{#if bold}}actions-popover-bold{{/if}} {{#if disabled}}disabled{{/if}}">{{text}}</a></li>' + '{{/if}}' + '{{/each}}' + '</ul>' + '</div>' + '{{/each}}' + '</div>' + '</div>';
            if (!app._compiledTemplates.actionsToPopover) {
                app._compiledTemplates.actionsToPopover = t7.compile(actionsToPopoverTemplate);
            }
            var popoverHTML = app._compiledTemplates.actionsToPopover(params);
            modal = $(app.popover(popoverHTML, target, true));
            groupSelector = '.list-block ul';
            buttonSelector = '.list-button';
        } else {
            if (app.params.modalActionsTemplate) {
                if (!app._compiledTemplates.actions) app._compiledTemplates.actions = t7.compile(app.params.modalActionsTemplate);
                modalHTML = app._compiledTemplates.actions(params);
            } else {
                var buttonsHTML = '';
                for (var i = 0; i < params.length; i++) {
                    for (var j = 0; j < params[i].length; j++) {
                        if (j === 0) buttonsHTML += '<div class="actions-modal-group">';
                        var button = params[i][j];
                        var buttonClass = button.label ? 'actions-modal-label' : 'actions-modal-button';
                        if (button.bold) buttonClass += ' actions-modal-button-bold';
                        if (button.color) buttonClass += ' color-' + button.color;
                        if (button.bg) buttonClass += ' bg-' + button.bg;
                        if (button.disabled) buttonClass += ' disabled';
                        buttonsHTML += '<div class="' + buttonClass + '">' + button.text + '</div>';
                        if (j === params[i].length - 1) buttonsHTML += '</div>';
                    }
                }
                modalHTML = '<div class="actions-modal">' + buttonsHTML + '</div>';
            }
            _modalTemplateTempDiv.innerHTML = modalHTML;
            modal = $(_modalTemplateTempDiv).children();
            $('body').append(modal[0]);
            groupSelector = '.actions-modal-group';
            buttonSelector = '.actions-modal-button';
        }

        var groups = modal.find(groupSelector);
        groups.each(function (index, el) {
            var groupIndex = index;
            $(el).children().each(function (index, el) {
                var buttonIndex = index;
                var buttonParams = params[groupIndex][buttonIndex];
                var clickTarget;
                if (!toPopover && $(el).is(buttonSelector)) clickTarget = $(el);
                if (toPopover && $(el).find(buttonSelector).length > 0) clickTarget = $(el).find(buttonSelector);

                if (clickTarget) {
                    clickTarget.on('click', function (e) {
                        if (buttonParams.close !== false) app.closeModal(modal);
                        if (buttonParams.onClick) buttonParams.onClick(modal, e);
                    });
                }
            });
        });
        if (!toPopover) app.openModal(modal);
        return modal[0];
    };
    app.popover = function (modal, target, removeOnClose) {
        if (typeof removeOnClose === 'undefined') removeOnClose = true;
        if (typeof modal === 'string' && modal.indexOf('<') >= 0) {
            var _modal = document.createElement('div');
            _modal.innerHTML = modal.trim();
            if (_modal.childNodes.length > 0) {
                modal = _modal.childNodes[0];
                if (removeOnClose) modal.classList.add('remove-on-close');
                $('body').append(modal);
            } else return false; //nothing found
        }
        modal = $(modal);
        target = $(target);
        if (modal.length === 0 || target.length === 0) return false;
        if (modal.find('.popover-angle').length === 0 && !app.params.material) {
            modal.append('<div class="popover-angle"></div>');
        }
        modal.show();

        var material = app.params.material;

        function sizePopover() {
            modal.css({ left: '', top: '' });
            var modalWidth = modal.width();
            var modalHeight = modal.height(); // 13 - height of angle
            var modalAngle,
                modalAngleSize = 0,
                modalAngleLeft,
                modalAngleTop;
            if (!material) {
                modalAngle = modal.find('.popover-angle');
                modalAngleSize = modalAngle.width() / 2;
                modalAngle.removeClass('on-left on-right on-top on-bottom').css({ left: '', top: '' });
            } else {
                modal.removeClass('popover-on-left popover-on-right popover-on-top popover-on-bottom').css({ left: '', top: '' });
            }

            var targetWidth = target.outerWidth();
            var targetHeight = target.outerHeight();
            var targetOffset = target.offset();
            var targetParentPage = target.parents('.page');
            if (targetParentPage.length > 0) {
                targetOffset.top = targetOffset.top - targetParentPage[0].scrollTop;
            }

            var windowHeight = $(window).height();
            var windowWidth = $(window).width();

            var modalTop = 0;
            var modalLeft = 0;
            var diff = 0;
            // Top Position
            var modalPosition = material ? 'bottom' : 'top';
            if (material) {
                if (modalHeight < windowHeight - targetOffset.top - targetHeight) {
                    // On bottom
                    modalPosition = 'bottom';
                    modalTop = targetOffset.top;
                } else if (modalHeight < targetOffset.top) {
                    // On top
                    modalTop = targetOffset.top - modalHeight + targetHeight;
                    modalPosition = 'top';
                } else {
                    // On middle
                    modalPosition = 'bottom';
                    modalTop = targetOffset.top;
                }

                if (modalTop <= 0) {
                    modalTop = 8;
                } else if (modalTop + modalHeight >= windowHeight) {
                    modalTop = windowHeight - modalHeight - 8;
                }

                // Horizontal Position
                modalLeft = targetOffset.left;
                if (modalLeft + modalWidth >= windowWidth - 8) {
                    modalLeft = targetOffset.left + targetWidth - modalWidth - 8;
                }
                if (modalLeft < 8) {
                    modalLeft = 8;
                }
                if (modalPosition === 'top') {
                    modal.addClass('popover-on-top');
                }
                if (modalPosition === 'bottom') {
                    modal.addClass('popover-on-bottom');
                }
                if (target.hasClass('floating-button-to-popover') && !modal.hasClass('modal-in')) {
                    modal.addClass('popover-floating-button');
                    var diffX = modalLeft + modalWidth / 2 - (targetOffset.left + targetWidth / 2),
                        diffY = modalTop + modalHeight / 2 - (targetOffset.top + targetHeight / 2);
                    target.addClass('floating-button-to-popover-in').transform('translate3d(' + diffX + 'px, ' + diffY + 'px,0)').transitionEnd(function (e) {
                        if (!target.hasClass('floating-button-to-popover-in')) return;
                        target.addClass('floating-button-to-popover-scale').transform('translate3d(' + diffX + 'px, ' + diffY + 'px,0) scale(' + modalWidth / targetWidth + ', ' + modalHeight / targetHeight + ')');
                    });

                    modal.once('close', function () {
                        target.removeClass('floating-button-to-popover-in floating-button-to-popover-scale').addClass('floating-button-to-popover-out').transform('').transitionEnd(function (e) {
                            target.removeClass('floating-button-to-popover-out');
                        });
                    });
                    modal.once('closed', function () {
                        modal.removeClass('popover-floating-button');
                    });
                }
            } else {
                if (modalHeight + modalAngleSize < targetOffset.top) {
                    // On top
                    modalTop = targetOffset.top - modalHeight - modalAngleSize;
                } else if (modalHeight + modalAngleSize < windowHeight - targetOffset.top - targetHeight) {
                    // On bottom
                    modalPosition = 'bottom';
                    modalTop = targetOffset.top + targetHeight + modalAngleSize;
                } else {
                    // On middle
                    modalPosition = 'middle';
                    modalTop = targetHeight / 2 + targetOffset.top - modalHeight / 2;
                    diff = modalTop;
                    if (modalTop <= 0) {
                        modalTop = 5;
                    } else if (modalTop + modalHeight >= windowHeight) {
                        modalTop = windowHeight - modalHeight - 5;
                    }
                    diff = diff - modalTop;
                }

                // Horizontal Position
                if (modalPosition === 'top' || modalPosition === 'bottom') {
                    modalLeft = targetWidth / 2 + targetOffset.left - modalWidth / 2;
                    diff = modalLeft;
                    if (modalLeft < 5) modalLeft = 5;
                    if (modalLeft + modalWidth > windowWidth) modalLeft = windowWidth - modalWidth - 5;
                    if (modalPosition === 'top') {
                        modalAngle.addClass('on-bottom');
                    }
                    if (modalPosition === 'bottom') {
                        modalAngle.addClass('on-top');
                    }
                    diff = diff - modalLeft;
                    modalAngleLeft = modalWidth / 2 - modalAngleSize + diff;
                    modalAngleLeft = Math.max(Math.min(modalAngleLeft, modalWidth - modalAngleSize * 2 - 13), 13);
                    modalAngle.css({ left: modalAngleLeft + 'px' });
                } else if (modalPosition === 'middle') {
                    modalLeft = targetOffset.left - modalWidth - modalAngleSize;
                    modalAngle.addClass('on-right');
                    if (modalLeft < 5 || modalLeft + modalWidth > windowWidth) {
                        if (modalLeft < 5) modalLeft = targetOffset.left + targetWidth + modalAngleSize;
                        if (modalLeft + modalWidth > windowWidth) modalLeft = windowWidth - modalWidth - 5;
                        modalAngle.removeClass('on-right').addClass('on-left');
                    }
                    modalAngleTop = modalHeight / 2 - modalAngleSize + diff;
                    modalAngleTop = Math.max(Math.min(modalAngleTop, modalHeight - modalAngleSize * 2 - 13), 13);
                    modalAngle.css({ top: modalAngleTop + 'px' });
                }
            }

            // Apply Styles
            modal.css({ top: modalTop + 'px', left: modalLeft + 'px' });
        }

        sizePopover();

        $(window).on('resize', sizePopover);

        modal.on('close', function () {
            $(window).off('resize', sizePopover);
        });

        app.openModal(modal);
        return modal[0];
    };
    app.popup = function (modal, removeOnClose) {
        if (typeof removeOnClose === 'undefined') removeOnClose = true;
        if (typeof modal === 'string' && modal.indexOf('<') >= 0) {
            var _modal = document.createElement('div');
            _modal.innerHTML = modal.trim();
            if (_modal.childNodes.length > 0) {
                modal = _modal.childNodes[0];
                if (removeOnClose) modal.classList.add('remove-on-close');
                $('body').append(modal);
            } else return false; //nothing found
        }
        modal = $(modal);
        if (modal.length === 0) return false;
        modal.show();

        app.openModal(modal);
        return modal[0];
    };
    app.pickerModal = function (modal, removeOnClose) {
        if (typeof removeOnClose === 'undefined') removeOnClose = true;
        if (typeof modal === 'string' && modal.indexOf('<') >= 0) {
            modal = $(modal);
            if (modal.length > 0) {
                if (removeOnClose) modal.addClass('remove-on-close');
                $('body').append(modal[0]);
            } else return false; //nothing found
        }
        modal = $(modal);
        if (modal.length === 0) return false;
        if ($('.picker-modal.modal-in:not(.modal-out)').length > 0 && !modal.hasClass('modal-in')) {
            app.closeModal('.picker-modal.modal-in:not(.modal-out)');
        }
        modal.show();
        app.openModal(modal);
        return modal[0];
    };
    app.loginScreen = function (modal) {
        if (!modal) modal = '.login-screen';
        modal = $(modal);
        if (modal.length === 0) return false;
        if ($('.login-screen.modal-in:not(.modal-out)').length > 0 && !modal.hasClass('modal-in')) {
            app.closeModal('.login-screen.modal-in:not(.modal-out)');
        }
        modal.show();

        app.openModal(modal);
        return modal[0];
    };
    app.openModal = function (modal) {
        modal = $(modal);
        var isModal = modal.hasClass('modal');
        if ($('.modal.modal-in:not(.modal-out)').length && app.params.modalStack && isModal) {
            app.modalStack.push(function () {
                app.openModal(modal);
            });
            return;
        }
        // do nothing if this modal already shown
        if (true === modal.data('f7-modal-shown')) {
            return;
        }
        modal.data('f7-modal-shown', true);
        modal.once('close', function () {
            modal.removeData('f7-modal-shown');
        });
        var isPopover = modal.hasClass('popover');
        var isPopup = modal.hasClass('popup');
        var isLoginScreen = modal.hasClass('login-screen');
        var isPickerModal = modal.hasClass('picker-modal');
        if (isModal) {
            modal.show();
            modal.css({
                marginTop: -Math.round(modal.outerHeight() / 2) + 'px'
            });
        }

        var overlay;
        if (!isLoginScreen && !isPickerModal) {
            if ($('.modal-overlay').length === 0 && !isPopup) {
                $('body').append('<div class="modal-overlay"></div>');
            }
            if ($('.popup-overlay').length === 0 && isPopup) {
                $('body').append('<div class="popup-overlay"></div>');
            }
            overlay = isPopup ? $('.popup-overlay') : $('.modal-overlay');
        }
        if (app.params.material && isPickerModal) {
            if (modal.hasClass('picker-calendar')) {
                if ($('.picker-modal-overlay').length === 0 && !isPopup) {
                    $('body').append('<div class="picker-modal-overlay"></div>');
                }
                overlay = $('.picker-modal-overlay');
            }
        }

        //Make sure that styles are applied, trigger relayout;
        var clientLeft = modal[0].clientLeft;

        // Trugger open event
        modal.trigger('open');

        // Picker modal body class
        if (isPickerModal) {
            $('body').addClass('with-picker-modal');
        }

        // Init Pages and Navbars in modal
        if (modal.find('.' + app.params.viewClass).length > 0) {
            modal.find('.page').each(function () {
                app.initPageWithCallback(this);
            });
            modal.find('.navbar').each(function () {
                app.initNavbarWithCallback(this);
            });
        }

        // Classes for transition in
        if (!isLoginScreen && !isPickerModal) overlay.addClass('modal-overlay-visible');
        if (app.params.material && isPickerModal && overlay) overlay.addClass('modal-overlay-visible');
        modal.removeClass('modal-out').addClass('modal-in').transitionEnd(function (e) {
            if (modal.hasClass('modal-out')) modal.trigger('closed');else modal.trigger('opened');
        });
        return true;
    };
    app.closeModal = function (modal) {
        modal = $(modal || '.modal-in');
        if (typeof modal !== 'undefined' && modal.length === 0) {
            return;
        }
        var isModal = modal.hasClass('modal');
        var isPopover = modal.hasClass('popover');
        var isPopup = modal.hasClass('popup');
        var isLoginScreen = modal.hasClass('login-screen');
        var isPickerModal = modal.hasClass('picker-modal');

        var removeOnClose = modal.hasClass('remove-on-close');

        var overlay;

        if (isPopup) overlay = $('.popup-overlay');else {
            if (isPickerModal && app.params.material) overlay = $('.picker-modal-overlay');else if (!isPickerModal) overlay = $('.modal-overlay');
        }

        if (isPopup) {
            if (modal.length === $('.popup.modal-in').length) {
                overlay.removeClass('modal-overlay-visible');
            }
        } else if (overlay && overlay.length > 0) {
            overlay.removeClass('modal-overlay-visible');
        }

        modal.trigger('close');

        // Picker modal body class
        if (isPickerModal) {
            $('body').removeClass('with-picker-modal');
            $('body').addClass('picker-modal-closing');
        }

        if (!(isPopover && !app.params.material)) {
            modal.removeClass('modal-in').addClass('modal-out').transitionEnd(function (e) {
                if (modal.hasClass('modal-out')) modal.trigger('closed');else {
                    modal.trigger('opened');
                    if (isPopover) return;
                }

                if (isPickerModal) {
                    $('body').removeClass('picker-modal-closing');
                }
                if (isPopup || isLoginScreen || isPickerModal || isPopover) {
                    modal.removeClass('modal-out').hide();
                    if (removeOnClose && modal.length > 0) {
                        modal.remove();
                    }
                } else {
                    modal.remove();
                }
            });
            if (isModal && app.params.modalStack) {
                app.modalStackClearQueue();
            }
        } else {
            modal.removeClass('modal-in modal-out').trigger('closed').hide();
            if (removeOnClose) {
                modal.remove();
            }
        }
        return true;
    };
    return app;
};

},{}],86:[function(require,module,exports){
'use strict';

module.exports = function (app) {
    /*======================================================
    ************   Navbars && Toolbars   ************
    ======================================================*/
    // On Navbar Init Callback
    app.navbarInitCallback = function (view, pageContainer, navbarContainer, navbarInnerContainer) {
        if (!navbarContainer && navbarInnerContainer) navbarContainer = $(navbarInnerContainer).parent('.navbar')[0];
        if (navbarInnerContainer.f7NavbarInitialized && view && !view.params.domCache) return;
        var navbarData = {
            container: navbarContainer,
            innerContainer: navbarInnerContainer
        };
        var pageData = pageContainer && pageContainer.f7PageData;

        var eventData = {
            page: pageData,
            navbar: navbarData
        };

        if (navbarInnerContainer.f7NavbarInitialized && (view && view.params.domCache || !view && $(navbarContainer).parents('.popup, .popover, .login-screen, .modal, .actions-modal, .picker-modal').length > 0)) {
            // Reinit Navbar
            app.reinitNavbar(navbarContainer, navbarInnerContainer);

            // Plugin hook
            app.pluginHook('navbarReinit', eventData);

            // Event
            $(navbarInnerContainer).trigger('navbarReinit', eventData);
            return;
        }
        navbarInnerContainer.f7NavbarInitialized = true;
        // Before Init
        app.pluginHook('navbarBeforeInit', navbarData, pageData);
        $(navbarInnerContainer).trigger('navbarBeforeInit', eventData);

        // Initialize Navbar
        app.initNavbar(navbarContainer, navbarInnerContainer);

        // On init
        app.pluginHook('navbarInit', navbarData, pageData);
        $(navbarInnerContainer).trigger('navbarInit', eventData);
    };
    // Navbar Remove Callback
    app.navbarRemoveCallback = function (view, pageContainer, navbarContainer, navbarInnerContainer) {
        if (!navbarContainer && navbarInnerContainer) navbarContainer = $(navbarInnerContainer).parent('.navbar')[0];
        var navbarData = {
            container: navbarContainer,
            innerContainer: navbarInnerContainer
        };
        var pageData = pageContainer.f7PageData;

        var eventData = {
            page: pageData,
            navbar: navbarData
        };
        app.pluginHook('navbarBeforeRemove', navbarData, pageData);
        $(navbarInnerContainer).trigger('navbarBeforeRemove', eventData);
    };
    app.initNavbar = function (navbarContainer, navbarInnerContainer) {
        // Init Subnavbar Searchbar
        if (app.initSearchbar) app.initSearchbar(navbarInnerContainer);
    };
    app.reinitNavbar = function (navbarContainer, navbarInnerContainer) {
        // Re init navbar methods
    };
    app.initNavbarWithCallback = function (navbarContainer) {
        navbarContainer = $(navbarContainer);
        var viewContainer = navbarContainer.parents('.' + app.params.viewClass);
        var view;
        if (viewContainer.length === 0) return;
        if (navbarContainer.parents('.navbar-through').length === 0 && viewContainer.find('.navbar-through').length === 0) return;
        view = viewContainer[0].f7View || undefined;

        navbarContainer.find('.navbar-inner').each(function () {
            var navbarInnerContainer = this;
            var pageContainer;
            if ($(navbarInnerContainer).attr('data-page')) {
                // For dom cache
                pageContainer = viewContainer.find('.page[data-page="' + $(navbarInnerContainer).attr('data-page') + '"]')[0];
            }
            if (!pageContainer) {
                var pages = viewContainer.find('.page');
                if (pages.length === 1) {
                    pageContainer = pages[0];
                } else {
                    viewContainer.find('.page').each(function () {
                        if (this.f7PageData && this.f7PageData.navbarInnerContainer === navbarInnerContainer) {
                            pageContainer = this;
                        }
                    });
                }
            }
            app.navbarInitCallback(view, pageContainer, navbarContainer[0], navbarInnerContainer);
        });
    };

    // Size Navbars
    app.sizeNavbars = function (viewContainer) {
        if (app.params.material) return;
        var navbarInner = viewContainer ? $(viewContainer).find('.navbar .navbar-inner:not(.cached)') : $('.navbar .navbar-inner:not(.cached)');
        navbarInner.each(function () {
            var n = $(this);
            if (n.hasClass('cached')) return;
            var left = app.rtl ? n.find('.right') : n.find('.left'),
                right = app.rtl ? n.find('.left') : n.find('.right'),
                center = n.find('.center'),
                subnavbar = n.find('.subnavbar'),
                noLeft = left.length === 0,
                noRight = right.length === 0,
                leftWidth = noLeft ? 0 : left.outerWidth(true),
                rightWidth = noRight ? 0 : right.outerWidth(true),
                centerWidth = center.outerWidth(true),
                navbarStyles = n.styles(),
                navbarWidth = n[0].offsetWidth - parseInt(navbarStyles.paddingLeft, 10) - parseInt(navbarStyles.paddingRight, 10),
                onLeft = n.hasClass('navbar-on-left'),
                currLeft,
                diff;

            if (noRight) {
                currLeft = navbarWidth - centerWidth;
            }
            if (noLeft) {
                currLeft = 0;
            }
            if (!noLeft && !noRight) {
                currLeft = (navbarWidth - rightWidth - centerWidth + leftWidth) / 2;
            }
            var requiredLeft = (navbarWidth - centerWidth) / 2;
            if (navbarWidth - leftWidth - rightWidth > centerWidth) {
                if (requiredLeft < leftWidth) {
                    requiredLeft = leftWidth;
                }
                if (requiredLeft + centerWidth > navbarWidth - rightWidth) {
                    requiredLeft = navbarWidth - rightWidth - centerWidth;
                }
                diff = requiredLeft - currLeft;
            } else {
                diff = 0;
            }
            // RTL inverter
            var inverter = app.rtl ? -1 : 1;

            if (center.hasClass('sliding')) {
                center[0].f7NavbarLeftOffset = -(currLeft + diff) * inverter;
                center[0].f7NavbarRightOffset = (navbarWidth - currLeft - diff - centerWidth) * inverter;
                if (onLeft) center.transform('translate3d(' + center[0].f7NavbarLeftOffset + 'px, 0, 0)');
            }
            if (!noLeft && left.hasClass('sliding')) {
                if (app.rtl) {
                    left[0].f7NavbarLeftOffset = -(navbarWidth - left[0].offsetWidth) / 2 * inverter;
                    left[0].f7NavbarRightOffset = leftWidth * inverter;
                } else {
                    left[0].f7NavbarLeftOffset = -leftWidth;
                    left[0].f7NavbarRightOffset = (navbarWidth - left[0].offsetWidth) / 2;
                }
                if (onLeft) left.transform('translate3d(' + left[0].f7NavbarLeftOffset + 'px, 0, 0)');
            }
            if (!noRight && right.hasClass('sliding')) {
                if (app.rtl) {
                    right[0].f7NavbarLeftOffset = -rightWidth * inverter;
                    right[0].f7NavbarRightOffset = (navbarWidth - right[0].offsetWidth) / 2 * inverter;
                } else {
                    right[0].f7NavbarLeftOffset = -(navbarWidth - right[0].offsetWidth) / 2;
                    right[0].f7NavbarRightOffset = rightWidth;
                }
                if (onLeft) right.transform('translate3d(' + right[0].f7NavbarLeftOffset + 'px, 0, 0)');
            }
            if (subnavbar.length && subnavbar.hasClass('sliding')) {
                subnavbar[0].f7NavbarLeftOffset = app.rtl ? subnavbar[0].offsetWidth : -subnavbar[0].offsetWidth;
                subnavbar[0].f7NavbarRightOffset = -subnavbar[0].f7NavbarLeftOffset;
            }

            // Center left
            var centerLeft = diff;
            if (app.rtl && noLeft && noRight && center.length > 0) centerLeft = -centerLeft;
            center.css({ left: centerLeft + 'px' });
        });
    };

    // Hide/Show Navbars/Toolbars
    app.hideNavbar = function (navbarContainer) {
        $(navbarContainer).addClass('navbar-hidden');
        return true;
    };
    app.showNavbar = function (navbarContainer) {
        var navbar = $(navbarContainer);
        navbar.addClass('navbar-hiding').removeClass('navbar-hidden').transitionEnd(function () {
            navbar.removeClass('navbar-hiding');
        });
        return true;
    };
    app.hideToolbar = function (toolbarContainer) {
        $(toolbarContainer).addClass('toolbar-hidden');
        return true;
    };
    app.showToolbar = function (toolbarContainer) {
        var toolbar = $(toolbarContainer);
        toolbar.addClass('toolbar-hiding').removeClass('toolbar-hidden').transitionEnd(function () {
            toolbar.removeClass('toolbar-hiding');
        });
    };
    return app;
};

},{}],87:[function(require,module,exports){
'use strict';

module.exports = function (app) {
    /*======================================================
    ************   Notifications   ************
    ======================================================*/
    var _tempNotificationElement;
    app.addNotification = function (params) {
        if (!params) return;

        if (typeof params.media === 'undefined') params.media = app.params.notificationMedia;
        if (typeof params.title === 'undefined') params.title = app.params.notificationTitle;
        if (typeof params.subtitle === 'undefined') params.subtitle = app.params.notificationSubtitle;
        if (typeof params.closeIcon === 'undefined') params.closeIcon = app.params.notificationCloseIcon;
        if (typeof params.hold === 'undefined') params.hold = app.params.notificationHold;
        if (typeof params.closeOnClick === 'undefined') params.closeOnClick = app.params.notificationCloseOnClick;
        if (typeof params.button === 'undefined') params.button = app.params.notificationCloseButtonText && {
            text: app.params.notificationCloseButtonText,
            close: true
        };

        if (!_tempNotificationElement) _tempNotificationElement = document.createElement('div');

        params.material = app.params.material;

        var container = $('.notifications');
        if (container.length === 0) {
            $('body').append('<div class="notifications list-block' + (params.material ? '' : ' media-list') + '"><ul></ul></div>');
            container = $('.notifications');
        }
        var list = container.children('ul');

        var notificationTemplate = app.params.notificationTemplate || '{{#if custom}}' + '<li>{{custom}}</li>' + '{{else}}' + '<li class="notification-item notification-hidden">' + '<div class="item-content">' + '{{#if material}}' + '<div class="item-inner">' + '<div class="item-title">{{js "this.message || this.title || this.subtitle"}}</div>' + '{{#if ../button}}{{#button}}' + '<div class="item-after">' + '<a href="#" class="button {{#if color}}color-{{color}}{{/if}} {{#js_compare "this.close !== false"}}close-notification{{/js_compare}}">{{text}}</a>' + '</div>' + '{{/button}}{{/if}}' + '</div>' + '{{else}}' + '{{#if media}}' + '<div class="item-media">{{media}}</div>' + '{{/if}}' + '<div class="item-inner">' + '<div class="item-title-row">' + '{{#if title}}' + '<div class="item-title">{{title}}</div>' + '{{/if}}' + '{{#if closeIcon}}' + '<div class="item-after"><a href="#" class="close-notification"><span></span></a></div>' + '{{/if}}' + '</div>' + '{{#if subtitle}}' + '<div class="item-subtitle">{{subtitle}}</div>' + '{{/if}}' + '{{#if message}}' + '<div class="item-text">{{message}}</div>' + '</div>' + '{{/if}}' + '{{/if}}' + '</div>' + '</li>' + '{{/if}}';
        if (!app._compiledTemplates.notification) {
            app._compiledTemplates.notification = app.t7.compile(notificationTemplate);
        }
        _tempNotificationElement.innerHTML = app._compiledTemplates.notification(params);

        var item = $(_tempNotificationElement).children();

        item.on('click', function (e) {
            var close = false;
            var target = $(e.target);
            if (params.material && target.hasClass('button')) {
                if (params.button && params.button.onClick) params.button.onClick.call(target[0], e, item[0]);
            }
            if (target.is('.close-notification') || $(e.target).parents('.close-notification').length > 0) {
                close = true;
            } else {
                if (params.onClick) params.onClick(e, item[0]);
                if (params.closeOnClick) close = true;
            }
            if (close) app.closeNotification(item[0]);
        });
        if (params.onClose) {
            item.data('f7NotificationOnClose', function () {
                params.onClose(item[0]);
            });
        }
        if (params.additionalClass) {
            item.addClass(params.additionalClass);
        }
        if (params.hold) {
            setTimeout(function () {
                if (item.length > 0) app.closeNotification(item[0]);
            }, params.hold);
        }

        list[params.material ? 'append' : 'prepend'](item[0]);
        container.show();

        var itemHeight = item.outerHeight(),
            clientLeft;
        if (params.material) {
            container.transform('translate3d(0, ' + itemHeight + 'px, 0)');
            container.transition(0);

            clientLeft = item[0].clientLeft;

            container.transform('translate3d(0, 0, 0)');
            container.transition('');
        } else {
            item.css('marginTop', -itemHeight + 'px');
            item.transition(0);

            clientLeft = item[0].clientLeft;

            item.transition('');
            item.css('marginTop', '0px');
        }

        container.transform('translate3d(0, 0,0)');
        item.removeClass('notification-hidden');

        return item[0];
    };
    app.closeNotification = function (item) {
        item = $(item);
        if (item.length === 0) return;
        if (item.hasClass('notification-item-removing')) return;
        var container = $('.notifications');

        var itemHeight = item.outerHeight();
        item.css('height', itemHeight + 'px').transition(0).addClass('notification-item-removing');
        var clientLeft = item[0].clientLeft;

        item.css('height', '0px').transition('');
        if (item.data('f7NotificationOnClose')) item.data('f7NotificationOnClose')();

        if (container.find('.notification-item:not(.notification-item-removing)').length === 0) {
            container.transform('');
        }

        item.addClass('notification-hidden').transitionEnd(function () {
            item.remove();
            if (container.find('.notification-item').length === 0) {
                container.hide();
            }
        });
    };
    return app;
};

},{}],88:[function(require,module,exports){
'use strict';

module.exports = function (app) {
    /*======================================================
    ************   Panels   ************
    ======================================================*/
    app.allowPanelOpen = true;
    app.openPanel = function (panelPosition) {
        if (!app.allowPanelOpen) return false;
        var panel = $('.panel-' + panelPosition);
        if (panel.length === 0 || panel.hasClass('active')) return false;
        app.closePanel(); // Close if some panel is opened
        app.allowPanelOpen = false;
        var effect = panel.hasClass('panel-reveal') ? 'reveal' : 'cover';
        panel.css({ display: 'block' }).addClass('active');
        panel.trigger('open');
        if (app.params.material) {
            $('.panel-overlay').show();
        }
        if (panel.find('.' + app.params.viewClass).length > 0) {
            if (app.sizeNavbars) app.sizeNavbars(panel.find('.' + app.params.viewClass)[0]);
        }

        // Trigger reLayout
        var clientLeft = panel[0].clientLeft;

        // Transition End;
        var transitionEndTarget = effect === 'reveal' ? $('.' + app.params.viewsClass) : panel;
        var openedTriggered = false;

        function panelTransitionEnd() {
            transitionEndTarget.transitionEnd(function (e) {
                if ($(e.target).is(transitionEndTarget)) {
                    if (panel.hasClass('active')) {
                        panel.trigger('opened');
                    } else {
                        panel.trigger('closed');
                    }
                    if (app.params.material) $('.panel-overlay').css({ display: '' });
                    app.allowPanelOpen = true;
                } else panelTransitionEnd();
            });
        }
        panelTransitionEnd();

        $('body').addClass('with-panel-' + panelPosition + '-' + effect);
        return true;
    };
    app.closePanel = function () {
        var activePanel = $('.panel.active');
        if (activePanel.length === 0) return false;
        var effect = activePanel.hasClass('panel-reveal') ? 'reveal' : 'cover';
        var panelPosition = activePanel.hasClass('panel-left') ? 'left' : 'right';
        activePanel.removeClass('active');
        var transitionEndTarget = effect === 'reveal' ? $('.' + app.params.viewsClass) : activePanel;
        activePanel.trigger('close');
        app.allowPanelOpen = false;

        transitionEndTarget.transitionEnd(function () {
            if (activePanel.hasClass('active')) return;
            activePanel.css({ display: '' });
            activePanel.trigger('closed');
            $('body').removeClass('panel-closing');
            app.allowPanelOpen = true;
        });

        $('body').addClass('panel-closing').removeClass('with-panel-' + panelPosition + '-' + effect);
    };
    /*======================================================
    ************   Swipe panels   ************
    ======================================================*/
    app.initSwipePanels = function () {
        var panel, side;
        if (app.params.swipePanel) {
            panel = $('.panel.panel-' + app.params.swipePanel);
            side = app.params.swipePanel;
            if (panel.length === 0) return;
        } else {
            if (app.params.swipePanelOnlyClose) {
                if ($('.panel').length === 0) return;
            } else return;
        }

        var panelOverlay = $('.panel-overlay');
        var isTouched,
            isMoved,
            isScrolling,
            touchesStart = {},
            touchStartTime,
            touchesDiff,
            translate,
            overlayOpacity,
            opened,
            panelWidth,
            effect,
            direction;
        var views = $('.' + app.params.viewsClass);

        function handleTouchStart(e) {
            if (!app.allowPanelOpen || !app.params.swipePanel && !app.params.swipePanelOnlyClose || isTouched) return;
            if ($('.modal-in, .photo-browser-in').length > 0) return;
            if (!(app.params.swipePanelCloseOpposite || app.params.swipePanelOnlyClose)) {
                if ($('.panel.active').length > 0 && !panel.hasClass('active')) return;
            }
            touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
            touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
            if (app.params.swipePanelCloseOpposite || app.params.swipePanelOnlyClose) {
                if ($('.panel.active').length > 0) {
                    side = $('.panel.active').hasClass('panel-left') ? 'left' : 'right';
                } else {
                    if (app.params.swipePanelOnlyClose) return;
                    side = app.params.swipePanel;
                }
                if (!side) return;
            }
            panel = $('.panel.panel-' + side);
            opened = panel.hasClass('active');
            if (app.params.swipePanelActiveArea && !opened) {
                if (side === 'left') {
                    if (touchesStart.x > app.params.swipePanelActiveArea) return;
                }
                if (side === 'right') {
                    if (touchesStart.x < window.innerWidth - app.params.swipePanelActiveArea) return;
                }
            }
            isMoved = false;
            isTouched = true;
            isScrolling = undefined;

            touchStartTime = new Date().getTime();
            direction = undefined;
        }
        function handleTouchMove(e) {
            if (!isTouched) return;
            if (e.f7PreventPanelSwipe) return;
            var pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
            var pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
            if (typeof isScrolling === 'undefined') {
                isScrolling = !!(isScrolling || Math.abs(pageY - touchesStart.y) > Math.abs(pageX - touchesStart.x));
            }
            if (isScrolling) {
                isTouched = false;
                return;
            }
            if (!direction) {
                if (pageX > touchesStart.x) {
                    direction = 'to-right';
                } else {
                    direction = 'to-left';
                }

                if (side === 'left' && direction === 'to-left' && !panel.hasClass('active') || side === 'right' && direction === 'to-right' && !panel.hasClass('active')) {
                    isTouched = false;
                    return;
                }
            }

            if (app.params.swipePanelNoFollow) {
                var timeDiff = new Date().getTime() - touchStartTime;
                if (timeDiff < 300) {
                    if (direction === 'to-left') {
                        if (side === 'right') app.openPanel(side);
                        if (side === 'left' && panel.hasClass('active')) app.closePanel();
                    }
                    if (direction === 'to-right') {
                        if (side === 'left') app.openPanel(side);
                        if (side === 'right' && panel.hasClass('active')) app.closePanel();
                    }
                }
                isTouched = false;
                isMoved = false;
                return;
            }

            if (!isMoved) {
                effect = panel.hasClass('panel-cover') ? 'cover' : 'reveal';
                if (!opened) {
                    panel.show();
                    panelOverlay.show();
                }
                panelWidth = panel[0].offsetWidth;
                panel.transition(0);
                if (panel.find('.' + app.params.viewClass).length > 0) {
                    if (app.sizeNavbars) app.sizeNavbars(panel.find('.' + app.params.viewClass)[0]);
                }
            }

            isMoved = true;

            e.preventDefault();
            var threshold = opened ? 0 : -app.params.swipePanelThreshold;
            if (side === 'right') threshold = -threshold;

            touchesDiff = pageX - touchesStart.x + threshold;

            if (side === 'right') {
                translate = touchesDiff - (opened ? panelWidth : 0);
                if (translate > 0) translate = 0;
                if (translate < -panelWidth) {
                    translate = -panelWidth;
                }
            } else {
                translate = touchesDiff + (opened ? panelWidth : 0);
                if (translate < 0) translate = 0;
                if (translate > panelWidth) {
                    translate = panelWidth;
                }
            }
            if (effect === 'reveal') {
                views.transform('translate3d(' + translate + 'px,0,0)').transition(0);
                panelOverlay.transform('translate3d(' + translate + 'px,0,0)').transition(0);

                app.pluginHook('swipePanelSetTransform', views[0], panel[0], Math.abs(translate / panelWidth));
            } else {
                panel.transform('translate3d(' + translate + 'px,0,0)').transition(0);
                if (app.params.material) {
                    panelOverlay.transition(0);
                    overlayOpacity = Math.abs(translate / panelWidth);
                    panelOverlay.css({ opacity: overlayOpacity });
                }
                app.pluginHook('swipePanelSetTransform', views[0], panel[0], Math.abs(translate / panelWidth));
            }
        }
        function handleTouchEnd(e) {
            if (!isTouched || !isMoved) {
                isTouched = false;
                isMoved = false;
                return;
            }
            isTouched = false;
            isMoved = false;
            var timeDiff = new Date().getTime() - touchStartTime;
            var action;
            var edge = translate === 0 || Math.abs(translate) === panelWidth;

            if (!opened) {
                if (translate === 0) {
                    action = 'reset';
                } else if (timeDiff < 300 && Math.abs(translate) > 0 || timeDiff >= 300 && Math.abs(translate) >= panelWidth / 2) {
                    action = 'swap';
                } else {
                    action = 'reset';
                }
            } else {
                if (translate === -panelWidth) {
                    action = 'reset';
                } else if (timeDiff < 300 && Math.abs(translate) >= 0 || timeDiff >= 300 && Math.abs(translate) <= panelWidth / 2) {
                    if (side === 'left' && translate === panelWidth) action = 'reset';else action = 'swap';
                } else {
                    action = 'reset';
                }
            }
            if (action === 'swap') {
                app.allowPanelOpen = true;
                if (opened) {
                    app.closePanel();
                    if (edge) {
                        panel.css({ display: '' });
                        $('body').removeClass('panel-closing');
                    }
                } else {
                    app.openPanel(side);
                }
                if (edge) app.allowPanelOpen = true;
            }
            if (action === 'reset') {
                if (opened) {
                    app.allowPanelOpen = true;
                    app.openPanel(side);
                } else {
                    app.closePanel();
                    if (edge) {
                        app.allowPanelOpen = true;
                        panel.css({ display: '' });
                    } else {
                        var target = effect === 'reveal' ? views : panel;
                        panel.trigger('close');
                        $('body').addClass('panel-closing');
                        target.transitionEnd(function () {
                            panel.trigger('closed');
                            panel.css({ display: '' });
                            $('body').removeClass('panel-closing');
                            app.allowPanelOpen = true;
                        });
                    }
                }
            }
            if (effect === 'reveal') {
                views.transition('');
                views.transform('');
            }
            panel.transition('').transform('');
            panelOverlay.css({ display: '' }).transform('').transition('').css('opacity', '');
        }
        $(document).on(app.touchEvents.start, handleTouchStart);
        $(document).on(app.touchEvents.move, handleTouchMove);
        $(document).on(app.touchEvents.end, handleTouchEnd);
    };
    return app;
};

},{}],89:[function(require,module,exports){
'use strict';

module.exports = function (app) {
    /*======================================================
    ************   Photo Browser   ************
    ======================================================*/
    var PhotoBrowser = function PhotoBrowser(params) {
        var pb = this,
            i;

        var defaults = {
            photos: [],
            initialSlide: 0,
            spaceBetween: 20,
            speed: 300,
            zoom: true,
            maxZoom: 3,
            minZoom: 1,
            exposition: true,
            expositionHideCaptions: false,
            type: 'standalone',
            navbar: true,
            toolbar: true,
            theme: 'light',
            swipeToClose: true,
            backLinkText: 'Close',
            ofText: 'of',
            loop: false,
            lazyLoading: false,
            lazyLoadingInPrevNext: false,
            lazyLoadingOnTransitionStart: false,
            material: app.params.material,
            materialPreloaderSvg: app.params.materialPreloaderSvg,
            materialPreloaderHtml: app.params.materialPreloaderHtml
        };

        /*
        Callbacks:
        onLazyImageLoad(pb, slide, img)
        onLazyImageReady(pb, slide, img)
        onOpen(pb)
        onClose(pb)
        onTransitionStart(swiper)
        onTransitionEnd(swiper)
        onSlideChangeStart(swiper)
        onSlideChangeEnd(swiper)
        onTap(swiper, e)
        onClick(swiper, e)
        onDoubleTap(swiper, e)
        onSwipeToClose(pb)
        */
        params = params || {};
        if (!params.backLinkText && app.params.material) defaults.backLinkText = '';
        for (var def in defaults) {
            if (typeof params[def] === 'undefined') {
                params[def] = defaults[def];
            }
        }

        pb.params = params;
        pb.params.iconsColorClass = pb.params.iconsColor ? 'color-' + pb.params.iconsColor : pb.params.theme === 'dark' ? 'color-white' : '';
        pb.params.preloaderColorClass = pb.params.theme === 'dark' ? 'preloader-white' : '';

        // Templates
        var photoTemplate = pb.params.photoTemplate || '<div class="photo-browser-slide swiper-slide">' + '<span class="photo-browser-zoom-container">' + '<img src="{{js "this.url || this"}}">' + '</span>' + '</div>';
        var photoLazyTemplate = pb.params.lazyPhotoTemplate || '<div class="photo-browser-slide photo-browser-slide-lazy swiper-slide">' + '<div class="preloader {{@root.preloaderColorClass}}">{{#if @root.material}}{{@root.materialPreloaderHtml}}{{/if}}</div>' + '<span class="photo-browser-zoom-container">' + '<img data-src="{{js "this.url || this"}}" class="swiper-lazy">' + '</span>' + '</div>';
        var objectTemplate = pb.params.objectTemplate || '<div class="photo-browser-slide photo-browser-object-slide swiper-slide">{{js "this.html || this"}}</div>';
        var captionTemplate = pb.params.captionTemplate || '<div class="photo-browser-caption" data-caption-index="{{@index}}">' + '{{caption}}' + '</div>';
        var navbarTemplate = pb.params.navbarTemplate || '<div class="navbar">' + '<div class="navbar-inner">' + '<div class="left sliding">' + '<a href="#" class="link close-popup photo-browser-close-link {{#unless backLinkText}}icon-only{{/unless}} {{js "this.type === \'page\' ? \'back\' : \'\'"}}">' + '<i class="icon icon-back {{iconsColorClass}}"></i>' + '{{#if backLinkText}}<span>{{backLinkText}}</span>{{/if}}' + '</a>' + '</div>' + '<div class="center sliding">' + '<span class="photo-browser-current"></span> ' + '<span class="photo-browser-of">{{ofText}}</span> ' + '<span class="photo-browser-total"></span>' + '</div>' + '<div class="right"></div>' + '</div>' + '</div>';
        var toolbarTemplate = pb.params.toolbarTemplate || '<div class="toolbar tabbar">' + '<div class="toolbar-inner">' + '<a href="#" class="link photo-browser-prev">' + '<i class="icon icon-prev {{iconsColorClass}}"></i>' + '</a>' + '<a href="#" class="link photo-browser-next">' + '<i class="icon icon-next {{iconsColorClass}}"></i>' + '</a>' + '</div>' + '</div>';
        var htmlTemplate = app.t7.compile('<div class="photo-browser photo-browser-{{theme}}">' + '<div class="view navbar-fixed toolbar-fixed">' + '{{#unless material}}{{#if navbar}}' + navbarTemplate + '{{/if}}{{/unless}}' + '<div class="page no-toolbar {{#unless navbar}}no-navbar{{/unless}} toolbar-fixed navbar-fixed" data-page="photo-browser-slides">' + '{{#if material}}{{#if navbar}}' + navbarTemplate + '{{/if}}{{/if}}' + '{{#if toolbar}}' + toolbarTemplate + '{{/if}}' + '<div class="photo-browser-captions photo-browser-captions-{{js "this.captionsTheme || this.theme"}}">' + '{{#each photos}}{{#if caption}}' + captionTemplate + '{{/if}}{{/each}}' + '</div>' + '<div class="photo-browser-swiper-container swiper-container">' + '<div class="photo-browser-swiper-wrapper swiper-wrapper">' + '{{#each photos}}' + '{{#js_compare "this.html || ((typeof this === \'string\' || this instanceof String) && (this.indexOf(\'<\') >= 0 || this.indexOf(\'>\') >= 0))"}}' + objectTemplate + '{{else}}' + '{{#if @root.lazyLoading}}' + photoLazyTemplate + '{{else}}' + photoTemplate + '{{/if}}' + '{{/js_compare}}' + '{{/each}}' + '</div>' + '</div>' + '</div>' + '</div>' + '</div>')(pb.params);

        pb.activeIndex = pb.params.initialSlide;
        pb.openIndex = pb.activeIndex;
        pb.opened = false;

        pb.open = function (index) {
            if (typeof index === 'undefined') index = pb.activeIndex;
            index = parseInt(index, 10);
            if (pb.opened && pb.swiper) {
                pb.swiper.slideTo(index);
                return;
            }
            pb.opened = true;
            pb.openIndex = index;
            if (pb.params.type === 'standalone') {
                $('body').append(htmlTemplate);
            }
            if (pb.params.type === 'popup') {
                pb.popup = app.popup('<div class="popup photo-browser-popup">' + htmlTemplate + '</div>');
                $(pb.popup).on('closed', pb.onPopupClose);
            }
            if (pb.params.type === 'page') {
                $(document).on('pageBeforeInit', pb.onPageBeforeInit);
                $(document).on('pageBeforeRemove', pb.onPageBeforeRemove);
                if (!pb.params.view) pb.params.view = app.mainView;
                pb.params.view.loadContent(htmlTemplate);
                return;
            }
            pb.layout(pb.openIndex);
            if (pb.params.onOpen) {
                pb.params.onOpen(pb);
            }
        };
        pb.close = function () {
            pb.opened = false;
            if (!pb.swiperContainer || pb.swiperContainer.length === 0) {
                return;
            }
            if (pb.params.onClose) {
                pb.params.onClose(pb);
            }
            // Detach events
            pb.attachEvents(true);
            // Delete from DOM
            if (pb.params.type === 'standalone') {
                pb.container.removeClass('photo-browser-in').addClass('photo-browser-out').animationEnd(function () {
                    pb.container.remove();
                });
            }
            // Destroy slider
            pb.swiper.destroy();
            // Delete references
            pb.swiper = pb.swiperContainer = pb.swiperWrapper = pb.slides = gestureSlide = gestureImg = gestureImgWrap = undefined;
        };

        pb.onPopupClose = function (e) {
            pb.close();
            $(pb.popup).off('pageBeforeInit', pb.onPopupClose);
        };
        pb.onPageBeforeInit = function (e) {
            if (e.detail.page.name === 'photo-browser-slides') {
                pb.layout(pb.openIndex);
            }
            $(document).off('pageBeforeInit', pb.onPageBeforeInit);
        };
        pb.onPageBeforeRemove = function (e) {
            if (e.detail.page.name === 'photo-browser-slides') {
                pb.close();
            }
            $(document).off('pageBeforeRemove', pb.onPageBeforeRemove);
        };

        pb.onSliderTransitionStart = function (swiper) {
            pb.activeIndex = swiper.activeIndex;

            var current = swiper.activeIndex + 1;
            var total = swiper.slides.length;
            if (pb.params.loop) {
                total = total - 2;
                current = current - swiper.loopedSlides;
                if (current < 1) current = total + current;
                if (current > total) current = current - total;
            }
            pb.container.find('.photo-browser-current').text(current);
            pb.container.find('.photo-browser-total').text(total);

            $('.photo-browser-prev, .photo-browser-next').removeClass('photo-browser-link-inactive');

            if (swiper.isBeginning && !pb.params.loop) {
                $('.photo-browser-prev').addClass('photo-browser-link-inactive');
            }
            if (swiper.isEnd && !pb.params.loop) {
                $('.photo-browser-next').addClass('photo-browser-link-inactive');
            }

            // Update captions
            if (pb.captions.length > 0) {
                pb.captionsContainer.find('.photo-browser-caption-active').removeClass('photo-browser-caption-active');
                var captionIndex = pb.params.loop ? swiper.slides.eq(swiper.activeIndex).attr('data-swiper-slide-index') : pb.activeIndex;
                pb.captionsContainer.find('[data-caption-index="' + captionIndex + '"]').addClass('photo-browser-caption-active');
            }

            // Stop Video
            var previousSlideVideo = swiper.slides.eq(swiper.previousIndex).find('video');
            if (previousSlideVideo.length > 0) {
                if ('pause' in previousSlideVideo[0]) previousSlideVideo[0].pause();
            }
            // Callback
            if (pb.params.onTransitionStart) pb.params.onTransitionStart(swiper);
        };
        pb.onSliderTransitionEnd = function (swiper) {
            // Reset zoom
            if (pb.params.zoom && gestureSlide && swiper.previousIndex !== swiper.activeIndex) {
                gestureImg.transform('translate3d(0,0,0) scale(1)');
                gestureImgWrap.transform('translate3d(0,0,0)');
                gestureSlide = gestureImg = gestureImgWrap = undefined;
                scale = currentScale = 1;
            }
            if (pb.params.onTransitionEnd) pb.params.onTransitionEnd(swiper);
        };

        pb.layout = function (index) {
            if (pb.params.type === 'page') {
                pb.container = $('.photo-browser-swiper-container').parents('.view');
            } else {
                pb.container = $('.photo-browser');
            }
            if (pb.params.type === 'standalone') {
                pb.container.addClass('photo-browser-in');
                app.sizeNavbars(pb.container);
            }
            pb.swiperContainer = pb.container.find('.photo-browser-swiper-container');
            pb.swiperWrapper = pb.container.find('.photo-browser-swiper-wrapper');
            pb.slides = pb.container.find('.photo-browser-slide');
            pb.captionsContainer = pb.container.find('.photo-browser-captions');
            pb.captions = pb.container.find('.photo-browser-caption');

            var sliderSettings = {
                nextButton: pb.params.nextButton || '.photo-browser-next',
                prevButton: pb.params.prevButton || '.photo-browser-prev',
                indexButton: pb.params.indexButton,
                initialSlide: index,
                spaceBetween: pb.params.spaceBetween,
                speed: pb.params.speed,
                loop: pb.params.loop,
                lazyLoading: pb.params.lazyLoading,
                lazyLoadingInPrevNext: pb.params.lazyLoadingInPrevNext,
                lazyLoadingOnTransitionStart: pb.params.lazyLoadingOnTransitionStart,
                preloadImages: pb.params.lazyLoading ? false : true,
                onTap: function onTap(swiper, e) {
                    if (pb.params.onTap) pb.params.onTap(swiper, e);
                },
                onClick: function onClick(swiper, e) {
                    if (pb.params.exposition) pb.toggleExposition();
                    if (pb.params.onClick) pb.params.onClick(swiper, e);
                },
                onDoubleTap: function onDoubleTap(swiper, e) {
                    pb.toggleZoom(e);
                    if (pb.params.onDoubleTap) pb.params.onDoubleTap(swiper, e);
                },
                onTransitionStart: function onTransitionStart(swiper) {
                    pb.onSliderTransitionStart(swiper);
                },
                onTransitionEnd: function onTransitionEnd(swiper) {
                    pb.onSliderTransitionEnd(swiper);
                },
                onSlideChangeStart: pb.params.onSlideChangeStart,
                onSlideChangeEnd: pb.params.onSlideChangeEnd,
                onLazyImageLoad: function onLazyImageLoad(swiper, slide, img) {
                    if (pb.params.onLazyImageLoad) pb.params.onLazyImageLoad(pb, slide, img);
                },
                onLazyImageReady: function onLazyImageReady(swiper, slide, img) {
                    $(slide).removeClass('photo-browser-slide-lazy');
                    if (pb.params.onLazyImageReady) pb.params.onLazyImageReady(pb, slide, img);
                }
            };

            if (pb.params.swipeToClose && pb.params.type !== 'page') {
                sliderSettings.onTouchStart = pb.swipeCloseTouchStart;
                sliderSettings.onTouchMoveOpposite = pb.swipeCloseTouchMove;
                sliderSettings.onTouchEnd = pb.swipeCloseTouchEnd;
            }

            pb.swiper = app.swiper(pb.swiperContainer, sliderSettings);
            if (index === 0) {
                pb.onSliderTransitionStart(pb.swiper);
            }
            pb.attachEvents();
        };
        pb.attachEvents = function (detach) {
            var action = detach ? 'off' : 'on';
            // Slide between photos

            if (pb.params.zoom) {
                var target = pb.params.loop ? pb.swiper.slides : pb.slides;
                // Scale image
                target[action]('gesturestart', pb.onSlideGestureStart);
                target[action]('gesturechange', pb.onSlideGestureChange);
                target[action]('gestureend', pb.onSlideGestureEnd);

                // Move image
                target[action](app.touchEvents.start, pb.onSlideTouchStart);
                target[action](app.touchEvents.move, pb.onSlideTouchMove);
                target[action](app.touchEvents.end, pb.onSlideTouchEnd);
            }
            pb.container.find('.photo-browser-close-link')[action]('click', pb.close);
        };

        var isTouched,
            isMoved,
            touchesStart = {},
            touchesCurrent = {},
            touchStartTime,
            isScrolling,
            animating = false,
            currentTranslate;
        var allowClick = true;

        // Expose
        pb.exposed = false;
        pb.toggleExposition = function () {
            if (pb.container) pb.container.toggleClass('photo-browser-exposed');
            if (pb.params.expositionHideCaptions) pb.captionsContainer.toggleClass('photo-browser-captions-exposed');
            pb.exposed = !pb.exposed;
        };
        pb.enableExposition = function () {
            if (pb.container) pb.container.addClass('photo-browser-exposed');
            if (pb.params.expositionHideCaptions) pb.captionsContainer.addClass('photo-browser-captions-exposed');
            pb.exposed = true;
        };
        pb.disableExposition = function () {
            if (pb.container) pb.container.removeClass('photo-browser-exposed');
            if (pb.params.expositionHideCaptions) pb.captionsContainer.removeClass('photo-browser-captions-exposed');
            pb.exposed = false;
        };

        // Gestures
        var gestureSlide,
            gestureImg,
            gestureImgWrap,
            scale = 1,
            currentScale = 1,
            isScaling = false;
        pb.onSlideGestureStart = function (e) {
            if (!gestureSlide || !gestureSlide.length) {
                gestureSlide = $(this);
                if (gestureSlide.length === 0) gestureSlide = pb.swiper.slides.eq(pb.swiper.activeIndex);
                gestureImg = gestureSlide.find('img, svg, canvas');
                gestureImgWrap = gestureImg.parent('.photo-browser-zoom-container');
                if (gestureImgWrap.length === 0) {
                    gestureImg = undefined;
                    return;
                }
            }
            gestureImg.transition(0);
            isScaling = true;
        };
        pb.onSlideGestureChange = function (e) {
            if (!gestureImg || gestureImg.length === 0) return;
            scale = e.scale * currentScale;
            if (scale > pb.params.maxZoom) {
                scale = pb.params.maxZoom - 1 + Math.pow(scale - pb.params.maxZoom + 1, 0.5);
            }
            if (scale < pb.params.minZoom) {
                scale = pb.params.minZoom + 1 - Math.pow(pb.params.minZoom - scale + 1, 0.5);
            }
            gestureImg.transform('translate3d(0,0,0) scale(' + scale + ')');
        };
        pb.onSlideGestureEnd = function (e) {
            if (!gestureImg || gestureImg.length === 0) return;
            scale = Math.max(Math.min(scale, pb.params.maxZoom), pb.params.minZoom);
            gestureImg.transition(pb.params.speed).transform('translate3d(0,0,0) scale(' + scale + ')');
            currentScale = scale;
            isScaling = false;
            if (scale === 1) gestureSlide = undefined;
        };
        pb.toggleZoom = function (e) {
            if (!gestureSlide) {
                gestureSlide = pb.swiper.slides.eq(pb.swiper.activeIndex);
                gestureImg = gestureSlide.find('img, svg, canvas');
                gestureImgWrap = gestureImg.parent('.photo-browser-zoom-container');
            }
            if (!gestureImg || gestureImg.length === 0) return;

            var touchX, touchY, offsetX, offsetY, diffX, diffY, translateX, translateY, imageWidth, imageHeight, scaledWidth, scaledHeight, translateMinX, translateMinY, translateMaxX, translateMaxY;

            if (typeof imageTouchesStart.x === 'undefined' && e) {
                touchX = e.type === 'touchend' ? e.changedTouches[0].pageX : e.pageX;
                touchY = e.type === 'touchend' ? e.changedTouches[0].pageY : e.pageY;
            } else {
                touchX = imageTouchesStart.x;
                touchY = imageTouchesStart.y;
            }

            if (scale && scale !== 1) {
                // Zoom Out
                scale = currentScale = 1;
                gestureImgWrap.transition(300).transform('translate3d(0,0,0)');
                gestureImg.transition(300).transform('translate3d(0,0,0) scale(1)');
                gestureSlide = undefined;
            } else {
                // Zoom In
                scale = currentScale = pb.params.maxZoom;
                if (e) {
                    offsetX = pb.container.offset().left;
                    offsetY = pb.container.offset().top;
                    diffX = offsetX + pb.container[0].offsetWidth / 2 - touchX;
                    diffY = offsetY + pb.container[0].offsetHeight / 2 - touchY;

                    imageWidth = gestureImg[0].offsetWidth;
                    imageHeight = gestureImg[0].offsetHeight;
                    scaledWidth = imageWidth * scale;
                    scaledHeight = imageHeight * scale;

                    translateMinX = Math.min(pb.swiper.width / 2 - scaledWidth / 2, 0);
                    translateMinY = Math.min(pb.swiper.height / 2 - scaledHeight / 2, 0);
                    translateMaxX = -translateMinX;
                    translateMaxY = -translateMinY;

                    translateX = diffX * scale;
                    translateY = diffY * scale;

                    if (translateX < translateMinX) {
                        translateX = translateMinX;
                    }
                    if (translateX > translateMaxX) {
                        translateX = translateMaxX;
                    }

                    if (translateY < translateMinY) {
                        translateY = translateMinY;
                    }
                    if (translateY > translateMaxY) {
                        translateY = translateMaxY;
                    }
                } else {
                    translateX = 0;
                    translateY = 0;
                }
                gestureImgWrap.transition(300).transform('translate3d(' + translateX + 'px, ' + translateY + 'px,0)');
                gestureImg.transition(300).transform('translate3d(0,0,0) scale(' + scale + ')');
            }
        };

        var imageIsTouched,
            imageIsMoved,
            imageCurrentX,
            imageCurrentY,
            imageMinX,
            imageMinY,
            imageMaxX,
            imageMaxY,
            imageWidth,
            imageHeight,
            imageTouchesStart = {},
            imageTouchesCurrent = {},
            imageStartX,
            imageStartY,
            velocityPrevPositionX,
            velocityPrevTime,
            velocityX,
            velocityPrevPositionY,
            velocityY;

        pb.onSlideTouchStart = function (e) {
            if (!gestureImg || gestureImg.length === 0) return;
            if (imageIsTouched) return;
            if (app.device.os === 'android') e.preventDefault();
            imageIsTouched = true;
            imageTouchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
            imageTouchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
        };
        pb.onSlideTouchMove = function (e) {
            if (!gestureImg || gestureImg.length === 0) return;
            pb.swiper.allowClick = false;
            if (!imageIsTouched || !gestureSlide) return;

            if (!imageIsMoved) {
                imageWidth = gestureImg[0].offsetWidth;
                imageHeight = gestureImg[0].offsetHeight;
                imageStartX = $.getTranslate(gestureImgWrap[0], 'x') || 0;
                imageStartY = $.getTranslate(gestureImgWrap[0], 'y') || 0;
                gestureImgWrap.transition(0);
            }
            // Define if we need image drag
            var scaledWidth = imageWidth * scale;
            var scaledHeight = imageHeight * scale;

            if (scaledWidth < pb.swiper.width && scaledHeight < pb.swiper.height) return;

            imageMinX = Math.min(pb.swiper.width / 2 - scaledWidth / 2, 0);
            imageMaxX = -imageMinX;
            imageMinY = Math.min(pb.swiper.height / 2 - scaledHeight / 2, 0);
            imageMaxY = -imageMinY;

            imageTouchesCurrent.x = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
            imageTouchesCurrent.y = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

            if (!imageIsMoved && !isScaling) {
                if (Math.floor(imageMinX) === Math.floor(imageStartX) && imageTouchesCurrent.x < imageTouchesStart.x || Math.floor(imageMaxX) === Math.floor(imageStartX) && imageTouchesCurrent.x > imageTouchesStart.x) {
                    imageIsTouched = false;
                    return;
                }
            }
            e.preventDefault();
            e.stopPropagation();
            imageIsMoved = true;
            imageCurrentX = imageTouchesCurrent.x - imageTouchesStart.x + imageStartX;
            imageCurrentY = imageTouchesCurrent.y - imageTouchesStart.y + imageStartY;

            if (imageCurrentX < imageMinX) {
                imageCurrentX = imageMinX + 1 - Math.pow(imageMinX - imageCurrentX + 1, 0.8);
            }
            if (imageCurrentX > imageMaxX) {
                imageCurrentX = imageMaxX - 1 + Math.pow(imageCurrentX - imageMaxX + 1, 0.8);
            }

            if (imageCurrentY < imageMinY) {
                imageCurrentY = imageMinY + 1 - Math.pow(imageMinY - imageCurrentY + 1, 0.8);
            }
            if (imageCurrentY > imageMaxY) {
                imageCurrentY = imageMaxY - 1 + Math.pow(imageCurrentY - imageMaxY + 1, 0.8);
            }

            //Velocity
            if (!velocityPrevPositionX) velocityPrevPositionX = imageTouchesCurrent.x;
            if (!velocityPrevPositionY) velocityPrevPositionY = imageTouchesCurrent.y;
            if (!velocityPrevTime) velocityPrevTime = Date.now();
            velocityX = (imageTouchesCurrent.x - velocityPrevPositionX) / (Date.now() - velocityPrevTime) / 2;
            velocityY = (imageTouchesCurrent.y - velocityPrevPositionY) / (Date.now() - velocityPrevTime) / 2;
            if (Math.abs(imageTouchesCurrent.x - velocityPrevPositionX) < 2) velocityX = 0;
            if (Math.abs(imageTouchesCurrent.y - velocityPrevPositionY) < 2) velocityY = 0;
            velocityPrevPositionX = imageTouchesCurrent.x;
            velocityPrevPositionY = imageTouchesCurrent.y;
            velocityPrevTime = Date.now();

            gestureImgWrap.transform('translate3d(' + imageCurrentX + 'px, ' + imageCurrentY + 'px,0)');
        };
        pb.onSlideTouchEnd = function (e) {
            if (!gestureImg || gestureImg.length === 0) return;
            if (!imageIsTouched || !imageIsMoved) {
                imageIsTouched = false;
                imageIsMoved = false;
                return;
            }
            imageIsTouched = false;
            imageIsMoved = false;
            var momentumDurationX = 300;
            var momentumDurationY = 300;
            var momentumDistanceX = velocityX * momentumDurationX;
            var newPositionX = imageCurrentX + momentumDistanceX;
            var momentumDistanceY = velocityY * momentumDurationY;
            var newPositionY = imageCurrentY + momentumDistanceY;

            //Fix duration
            if (velocityX !== 0) momentumDurationX = Math.abs((newPositionX - imageCurrentX) / velocityX);
            if (velocityY !== 0) momentumDurationY = Math.abs((newPositionY - imageCurrentY) / velocityY);
            var momentumDuration = Math.max(momentumDurationX, momentumDurationY);

            imageCurrentX = newPositionX;
            imageCurrentY = newPositionY;

            // Define if we need image drag
            var scaledWidth = imageWidth * scale;
            var scaledHeight = imageHeight * scale;
            imageMinX = Math.min(pb.swiper.width / 2 - scaledWidth / 2, 0);
            imageMaxX = -imageMinX;
            imageMinY = Math.min(pb.swiper.height / 2 - scaledHeight / 2, 0);
            imageMaxY = -imageMinY;
            imageCurrentX = Math.max(Math.min(imageCurrentX, imageMaxX), imageMinX);
            imageCurrentY = Math.max(Math.min(imageCurrentY, imageMaxY), imageMinY);

            gestureImgWrap.transition(momentumDuration).transform('translate3d(' + imageCurrentX + 'px, ' + imageCurrentY + 'px,0)');
        };

        // Swipe Up To Close
        var swipeToCloseIsTouched = false;
        var allowSwipeToClose = true;
        var swipeToCloseDiff,
            swipeToCloseStart,
            swipeToCloseCurrent,
            swipeToCloseStarted = false,
            swipeToCloseActiveSlide,
            swipeToCloseTimeStart;
        pb.swipeCloseTouchStart = function (swiper, e) {
            if (!allowSwipeToClose) return;
            swipeToCloseIsTouched = true;
        };
        pb.swipeCloseTouchMove = function (swiper, e) {
            if (!swipeToCloseIsTouched) return;
            if (!swipeToCloseStarted) {
                swipeToCloseStarted = true;
                swipeToCloseStart = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
                swipeToCloseActiveSlide = pb.swiper.slides.eq(pb.swiper.activeIndex);
                swipeToCloseTimeStart = new Date().getTime();
            }
            e.preventDefault();
            swipeToCloseCurrent = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
            swipeToCloseDiff = swipeToCloseStart - swipeToCloseCurrent;
            var opacity = 1 - Math.abs(swipeToCloseDiff) / 300;
            swipeToCloseActiveSlide.transform('translate3d(0,' + -swipeToCloseDiff + 'px,0)');
            pb.swiper.container.css('opacity', opacity).transition(0);
        };
        pb.swipeCloseTouchEnd = function (swiper, e) {
            swipeToCloseIsTouched = false;
            if (!swipeToCloseStarted) {
                swipeToCloseStarted = false;
                return;
            }
            swipeToCloseStarted = false;
            allowSwipeToClose = false;
            var diff = Math.abs(swipeToCloseDiff);
            var timeDiff = new Date().getTime() - swipeToCloseTimeStart;
            if (timeDiff < 300 && diff > 20 || timeDiff >= 300 && diff > 100) {
                setTimeout(function () {
                    if (pb.params.type === 'standalone') {
                        pb.close();
                    }
                    if (pb.params.type === 'popup') {
                        app.closeModal(pb.popup);
                    }
                    if (pb.params.onSwipeToClose) {
                        pb.params.onSwipeToClose(pb);
                    }
                    allowSwipeToClose = true;
                }, 0);
                return;
            }
            if (diff !== 0) {
                swipeToCloseActiveSlide.addClass('transitioning').transitionEnd(function () {
                    allowSwipeToClose = true;
                    swipeToCloseActiveSlide.removeClass('transitioning');
                });
            } else {
                allowSwipeToClose = true;
            }
            pb.swiper.container.css('opacity', '').transition('');
            swipeToCloseActiveSlide.transform('');
        };

        return pb;
    };

    app.photoBrowser = function (params) {
        return new PhotoBrowser(params);
    };
    return app;
};

},{}],90:[function(require,module,exports){
'use strict';

module.exports = function (app) {
    /*======================================================
    ************   Picker   ************
    ======================================================*/
    var Picker = function Picker(params) {
        var p = this;
        var defaults = {
            updateValuesOnMomentum: false,
            updateValuesOnTouchmove: true,
            rotateEffect: false,
            momentumRatio: 7,
            freeMode: false,
            // Common settings
            closeByOutsideClick: true,
            scrollToInput: true,
            inputReadOnly: true,
            convertToPopover: true,
            onlyInPopover: false,
            toolbar: true,
            toolbarCloseText: 'Done',
            toolbarTemplate: '<div class="toolbar">' + '<div class="toolbar-inner">' + '<div class="left"></div>' + '<div class="right">' + '<a href="#" class="link close-picker">{{closeText}}</a>' + '</div>' + '</div>' + '</div>'
        };
        params = params || {};
        for (var def in defaults) {
            if (typeof params[def] === 'undefined') {
                params[def] = defaults[def];
            }
        }
        p.params = params;
        p.cols = [];
        p.initialized = false;

        // Inline flag
        p.inline = p.params.container ? true : false;

        // 3D Transforms origin bug, only on safari
        var originBug = app.device.ios || navigator.userAgent.toLowerCase().indexOf('safari') >= 0 && navigator.userAgent.toLowerCase().indexOf('chrome') < 0 && !app.device.android;

        // Should be converted to popover
        function isPopover() {
            var toPopover = false;
            if (!p.params.convertToPopover && !p.params.onlyInPopover) return toPopover;
            if (!p.inline && p.params.input) {
                if (p.params.onlyInPopover) toPopover = true;else {
                    if (app.device.ios) {
                        toPopover = app.device.ipad ? true : false;
                    } else {
                        if ($(window).width() >= 768) toPopover = true;
                    }
                }
            }
            return toPopover;
        }
        function inPopover() {
            if (p.opened && p.container && p.container.length > 0 && p.container.parents('.popover').length > 0) return true;else return false;
        }

        // Value
        p.setValue = function (arrValues, transition) {
            var valueIndex = 0;
            if (p.cols.length === 0) {
                p.value = arrValues;
                p.updateValue(arrValues);
                return;
            }
            for (var i = 0; i < p.cols.length; i++) {
                if (p.cols[i] && !p.cols[i].divider) {
                    p.cols[i].setValue(arrValues[valueIndex], transition);
                    valueIndex++;
                }
            }
        };
        p.updateValue = function (forceValues) {
            var newValue = forceValues || [];
            var newDisplayValue = [];
            for (var i = 0; i < p.cols.length; i++) {
                if (!p.cols[i].divider) {
                    newValue.push(p.cols[i].value);
                    newDisplayValue.push(p.cols[i].displayValue);
                }
            }
            if (newValue.indexOf(undefined) >= 0) {
                return;
            }
            p.value = newValue;
            p.displayValue = newDisplayValue;
            if (p.params.onChange) {
                p.params.onChange(p, p.value, p.displayValue);
            }
            if (p.input && p.input.length > 0) {
                $(p.input).val(p.params.formatValue ? p.params.formatValue(p, p.value, p.displayValue) : p.value.join(' '));
                $(p.input).trigger('change');
            }
        };

        // Columns Handlers
        p.initPickerCol = function (colElement, updateItems) {
            var colContainer = $(colElement);
            var colIndex = colContainer.index();
            var col = p.cols[colIndex];
            if (col.divider) return;
            col.container = colContainer;
            col.wrapper = col.container.find('.picker-items-col-wrapper');
            col.items = col.wrapper.find('.picker-item');

            var i, j;
            var wrapperHeight, itemHeight, itemsHeight, minTranslate, maxTranslate;
            col.replaceValues = function (values, displayValues) {
                col.destroyEvents();
                col.values = values;
                col.displayValues = displayValues;
                var newItemsHTML = p.columnHTML(col, true);
                col.wrapper.html(newItemsHTML);
                col.items = col.wrapper.find('.picker-item');
                col.calcSize();
                col.setValue(col.values[0], 0, true);
                col.initEvents();
            };
            col.calcSize = function () {
                if (p.params.rotateEffect) {
                    col.container.removeClass('picker-items-col-absolute');
                    if (!col.width) col.container.css({ width: '' });
                }
                var colWidth, colHeight;
                colWidth = 0;
                colHeight = col.container[0].offsetHeight;
                wrapperHeight = col.wrapper[0].offsetHeight;
                itemHeight = col.items[0].offsetHeight;
                itemsHeight = itemHeight * col.items.length;
                minTranslate = colHeight / 2 - itemsHeight + itemHeight / 2;
                maxTranslate = colHeight / 2 - itemHeight / 2;
                if (col.width) {
                    colWidth = col.width;
                    if (parseInt(colWidth, 10) === colWidth) colWidth = colWidth + 'px';
                    col.container.css({ width: colWidth });
                }
                if (p.params.rotateEffect) {
                    if (!col.width) {
                        col.items.each(function () {
                            var item = $(this);
                            item.css({ width: 'auto' });
                            colWidth = Math.max(colWidth, item[0].offsetWidth);
                            item.css({ width: '' });
                        });
                        col.container.css({ width: colWidth + 2 + 'px' });
                    }
                    col.container.addClass('picker-items-col-absolute');
                }
            };
            col.calcSize();

            col.wrapper.transform('translate3d(0,' + maxTranslate + 'px,0)').transition(0);

            var activeIndex = 0;
            var animationFrameId;

            // Set Value Function
            col.setValue = function (newValue, transition, valueCallbacks) {
                if (typeof transition === 'undefined') transition = '';
                var newActiveIndex = col.wrapper.find('.picker-item[data-picker-value="' + newValue + '"]').index();
                if (typeof newActiveIndex === 'undefined' || newActiveIndex === -1) {
                    return;
                }
                var newTranslate = -newActiveIndex * itemHeight + maxTranslate;
                // Update wrapper
                col.wrapper.transition(transition);
                col.wrapper.transform('translate3d(0,' + newTranslate + 'px,0)');

                // Watch items
                if (p.params.updateValuesOnMomentum && col.activeIndex && col.activeIndex !== newActiveIndex) {
                    $.cancelAnimationFrame(animationFrameId);
                    col.wrapper.transitionEnd(function () {
                        $.cancelAnimationFrame(animationFrameId);
                    });
                    updateDuringScroll();
                }

                // Update items
                col.updateItems(newActiveIndex, newTranslate, transition, valueCallbacks);
            };

            col.updateItems = function (activeIndex, translate, transition, valueCallbacks) {
                if (typeof translate === 'undefined') {
                    translate = $.getTranslate(col.wrapper[0], 'y');
                }
                if (typeof activeIndex === 'undefined') activeIndex = -Math.round((translate - maxTranslate) / itemHeight);
                if (activeIndex < 0) activeIndex = 0;
                if (activeIndex >= col.items.length) activeIndex = col.items.length - 1;
                var previousActiveIndex = col.activeIndex;
                col.activeIndex = activeIndex;
                col.wrapper.find('.picker-selected').removeClass('picker-selected');

                col.items.transition(transition);

                var selectedItem = col.items.eq(activeIndex).addClass('picker-selected').transform('');

                // Set 3D rotate effect
                if (p.params.rotateEffect) {
                    var percentage = (translate - (Math.floor((translate - maxTranslate) / itemHeight) * itemHeight + maxTranslate)) / itemHeight;

                    col.items.each(function () {
                        var item = $(this);
                        var itemOffsetTop = item.index() * itemHeight;
                        var translateOffset = maxTranslate - translate;
                        var itemOffset = itemOffsetTop - translateOffset;
                        var percentage = itemOffset / itemHeight;

                        var itemsFit = Math.ceil(col.height / itemHeight / 2) + 1;

                        var angle = -18 * percentage;
                        if (angle > 180) angle = 180;
                        if (angle < -180) angle = -180;
                        // Far class
                        if (Math.abs(percentage) > itemsFit) item.addClass('picker-item-far');else item.removeClass('picker-item-far');
                        // Set transform
                        item.transform('translate3d(0, ' + (-translate + maxTranslate) + 'px, ' + (originBug ? -110 : 0) + 'px) rotateX(' + angle + 'deg)');
                    });
                }

                if (valueCallbacks || typeof valueCallbacks === 'undefined') {
                    // Update values
                    col.value = selectedItem.attr('data-picker-value');
                    col.displayValue = col.displayValues ? col.displayValues[activeIndex] : col.value;
                    // On change callback
                    if (previousActiveIndex !== activeIndex) {
                        if (col.onChange) {
                            col.onChange(p, col.value, col.displayValue);
                        }
                        p.updateValue();
                    }
                }
            };

            function updateDuringScroll() {
                animationFrameId = $.requestAnimationFrame(function () {
                    col.updateItems(undefined, undefined, 0);
                    updateDuringScroll();
                });
            }

            // Update items on init
            if (updateItems) col.updateItems(0, maxTranslate, 0);

            var allowItemClick = true;
            var isTouched, isMoved, touchStartY, touchCurrentY, touchStartTime, touchEndTime, startTranslate, returnTo, currentTranslate, prevTranslate, velocityTranslate, velocityTime;
            function handleTouchStart(e) {
                if (isMoved || isTouched) return;
                e.preventDefault();
                isTouched = true;
                touchStartY = touchCurrentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
                touchStartTime = new Date().getTime();

                allowItemClick = true;
                startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], 'y');
            }
            function handleTouchMove(e) {
                if (!isTouched) return;
                e.preventDefault();
                allowItemClick = false;
                touchCurrentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
                if (!isMoved) {
                    // First move
                    $.cancelAnimationFrame(animationFrameId);
                    isMoved = true;
                    startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], 'y');
                    col.wrapper.transition(0);
                }
                e.preventDefault();

                var diff = touchCurrentY - touchStartY;
                currentTranslate = startTranslate + diff;
                returnTo = undefined;

                // Normalize translate
                if (currentTranslate < minTranslate) {
                    currentTranslate = minTranslate - Math.pow(minTranslate - currentTranslate, 0.8);
                    returnTo = 'min';
                }
                if (currentTranslate > maxTranslate) {
                    currentTranslate = maxTranslate + Math.pow(currentTranslate - maxTranslate, 0.8);
                    returnTo = 'max';
                }
                // Transform wrapper
                col.wrapper.transform('translate3d(0,' + currentTranslate + 'px,0)');

                // Update items
                col.updateItems(undefined, currentTranslate, 0, p.params.updateValuesOnTouchmove);

                // Calc velocity
                velocityTranslate = currentTranslate - prevTranslate || currentTranslate;
                velocityTime = new Date().getTime();
                prevTranslate = currentTranslate;
            }
            function handleTouchEnd(e) {
                if (!isTouched || !isMoved) {
                    isTouched = isMoved = false;
                    return;
                }
                isTouched = isMoved = false;
                col.wrapper.transition('');
                if (returnTo) {
                    if (returnTo === 'min') {
                        col.wrapper.transform('translate3d(0,' + minTranslate + 'px,0)');
                    } else col.wrapper.transform('translate3d(0,' + maxTranslate + 'px,0)');
                }
                touchEndTime = new Date().getTime();
                var velocity, newTranslate;
                if (touchEndTime - touchStartTime > 300) {
                    newTranslate = currentTranslate;
                } else {
                    velocity = Math.abs(velocityTranslate / (touchEndTime - velocityTime));
                    newTranslate = currentTranslate + velocityTranslate * p.params.momentumRatio;
                }

                newTranslate = Math.max(Math.min(newTranslate, maxTranslate), minTranslate);

                // Active Index
                var activeIndex = -Math.floor((newTranslate - maxTranslate) / itemHeight);

                // Normalize translate
                if (!p.params.freeMode) newTranslate = -activeIndex * itemHeight + maxTranslate;

                // Transform wrapper
                col.wrapper.transform('translate3d(0,' + parseInt(newTranslate, 10) + 'px,0)');

                // Update items
                col.updateItems(activeIndex, newTranslate, '', true);

                // Watch items
                if (p.params.updateValuesOnMomentum) {
                    updateDuringScroll();
                    col.wrapper.transitionEnd(function () {
                        $.cancelAnimationFrame(animationFrameId);
                    });
                }

                // Allow click
                setTimeout(function () {
                    allowItemClick = true;
                }, 100);
            }

            function handleClick(e) {
                if (!allowItemClick) return;
                $.cancelAnimationFrame(animationFrameId);
                /*jshint validthis:true */
                var value = $(this).attr('data-picker-value');
                col.setValue(value);
            }

            col.initEvents = function (detach) {
                var method = detach ? 'off' : 'on';
                col.container[method](app.touchEvents.start, handleTouchStart);
                col.container[method](app.touchEvents.move, handleTouchMove);
                col.container[method](app.touchEvents.end, handleTouchEnd);
                col.items[method]('click', handleClick);
            };
            col.destroyEvents = function () {
                col.initEvents(true);
            };

            col.container[0].f7DestroyPickerCol = function () {
                col.destroyEvents();
            };

            col.initEvents();
        };
        p.destroyPickerCol = function (colContainer) {
            colContainer = $(colContainer);
            if ('f7DestroyPickerCol' in colContainer[0]) colContainer[0].f7DestroyPickerCol();
        };
        // Resize cols
        function resizeCols() {
            if (!p.opened) return;
            for (var i = 0; i < p.cols.length; i++) {
                if (!p.cols[i].divider) {
                    p.cols[i].calcSize();
                    p.cols[i].setValue(p.cols[i].value, 0, false);
                }
            }
        }
        $(window).on('resize', resizeCols);

        // HTML Layout
        p.columnHTML = function (col, onlyItems) {
            var columnItemsHTML = '';
            var columnHTML = '';
            if (col.divider) {
                columnHTML += '<div class="picker-items-col picker-items-col-divider ' + (col.textAlign ? 'picker-items-col-' + col.textAlign : '') + ' ' + (col.cssClass || '') + '">' + col.content + '</div>';
            } else {
                for (var j = 0; j < col.values.length; j++) {
                    columnItemsHTML += '<div class="picker-item" data-picker-value="' + col.values[j] + '">' + (col.displayValues ? col.displayValues[j] : col.values[j]) + '</div>';
                }
                columnHTML += '<div class="picker-items-col ' + (col.textAlign ? 'picker-items-col-' + col.textAlign : '') + ' ' + (col.cssClass || '') + '"><div class="picker-items-col-wrapper">' + columnItemsHTML + '</div></div>';
            }
            return onlyItems ? columnItemsHTML : columnHTML;
        };
        p.layout = function () {
            var pickerHTML = '';
            var pickerClass = '';
            var i;
            p.cols = [];
            var colsHTML = '';
            for (i = 0; i < p.params.cols.length; i++) {
                var col = p.params.cols[i];
                colsHTML += p.columnHTML(p.params.cols[i]);
                p.cols.push(col);
            }
            pickerClass = 'picker-modal picker-columns ' + (p.params.cssClass || '') + (p.params.rotateEffect ? ' picker-3d' : '');
            pickerHTML = '<div class="' + pickerClass + '">' + (p.params.toolbar ? p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText) : '') + '<div class="picker-modal-inner picker-items">' + colsHTML + '<div class="picker-center-highlight"></div>' + '</div>' + '</div>';

            p.pickerHTML = pickerHTML;
        };

        // Input Events
        function openOnInput(e) {
            e.preventDefault();
            if (p.opened) return;
            p.open();
            if (p.params.scrollToInput && !isPopover()) {
                var pageContent = p.input.parents('.page-content');
                if (pageContent.length === 0) return;

                var paddingTop = parseInt(pageContent.css('padding-top'), 10),
                    paddingBottom = parseInt(pageContent.css('padding-bottom'), 10),
                    pageHeight = pageContent[0].offsetHeight - paddingTop - p.container.height(),
                    pageScrollHeight = pageContent[0].scrollHeight - paddingTop - p.container.height(),
                    newPaddingBottom;
                var inputTop = p.input.offset().top - paddingTop + p.input[0].offsetHeight;
                if (inputTop > pageHeight) {
                    var scrollTop = pageContent.scrollTop() + inputTop - pageHeight;
                    if (scrollTop + pageHeight > pageScrollHeight) {
                        newPaddingBottom = scrollTop + pageHeight - pageScrollHeight + paddingBottom;
                        if (pageHeight === pageScrollHeight) {
                            newPaddingBottom = p.container.height();
                        }
                        pageContent.css({ 'padding-bottom': newPaddingBottom + 'px' });
                    }
                    pageContent.scrollTop(scrollTop, 300);
                }
            }
        }
        function closeOnHTMLClick(e) {
            if (inPopover()) return;
            if (p.input && p.input.length > 0) {
                if (e.target !== p.input[0] && $(e.target).parents('.picker-modal').length === 0) p.close();
            } else {
                if ($(e.target).parents('.picker-modal').length === 0) p.close();
            }
        }

        if (p.params.input) {
            p.input = $(p.params.input);
            if (p.input.length > 0) {
                if (p.params.inputReadOnly) p.input.prop('readOnly', true);
                if (!p.inline) {
                    p.input.on('click', openOnInput);
                }
                if (p.params.inputReadOnly) {
                    p.input.on('focus mousedown', function (e) {
                        e.preventDefault();
                    });
                }
            }
        }

        if (!p.inline && p.params.closeByOutsideClick) $('html').on('click', closeOnHTMLClick);

        // Open
        function onPickerClose() {
            p.opened = false;
            if (p.input && p.input.length > 0) {
                p.input.parents('.page-content').css({ 'padding-bottom': '' });
                if (app.params.material) p.input.trigger('blur');
            }
            if (p.params.onClose) p.params.onClose(p);

            // Destroy events
            p.container.find('.picker-items-col').each(function () {
                p.destroyPickerCol(this);
            });
        }

        p.opened = false;
        p.open = function () {
            var toPopover = isPopover();

            if (!p.opened) {

                // Layout
                p.layout();

                // Append
                if (toPopover) {
                    p.pickerHTML = '<div class="popover popover-picker-columns"><div class="popover-inner">' + p.pickerHTML + '</div></div>';
                    p.popover = app.popover(p.pickerHTML, p.params.input, true);
                    p.container = $(p.popover).find('.picker-modal');
                    $(p.popover).on('close', function () {
                        onPickerClose();
                    });
                } else if (p.inline) {
                    p.container = $(p.pickerHTML);
                    p.container.addClass('picker-modal-inline');
                    $(p.params.container).append(p.container);
                } else {
                    p.container = $(app.pickerModal(p.pickerHTML));
                    $(p.container).on('close', function () {
                        onPickerClose();
                    });
                }

                // Store picker instance
                p.container[0].f7Picker = p;

                // Init Events
                p.container.find('.picker-items-col').each(function () {
                    var updateItems = true;
                    if (!p.initialized && p.params.value || p.initialized && p.value) updateItems = false;
                    p.initPickerCol(this, updateItems);
                });

                // Set value
                if (!p.initialized) {
                    if (p.value) p.setValue(p.value, 0);else if (p.params.value) {
                        p.setValue(p.params.value, 0);
                    }
                } else {
                    if (p.value) p.setValue(p.value, 0);
                }

                // Material Focus
                if (p.input && p.input.length > 0 && app.params.material) {
                    p.input.trigger('focus');
                }
            }

            // Set flag
            p.opened = true;
            p.initialized = true;

            if (p.params.onOpen) p.params.onOpen(p);
        };

        // Close
        p.close = function () {
            if (!p.opened || p.inline) return;
            if (inPopover()) {
                app.closeModal(p.popover);
                return;
            } else {
                app.closeModal(p.container);
                return;
            }
        };

        // Destroy
        p.destroy = function () {
            p.close();
            if (p.params.input && p.input.length > 0) {
                p.input.off('click focus', openOnInput);
            }
            $('html').off('click', closeOnHTMLClick);
            $(window).off('resize', resizeCols);
        };

        if (p.inline) {
            p.open();
        } else {
            if (!p.initialized && p.params.value) p.setValue(p.params.value);
        }

        return p;
    };
    app.picker = function (params) {
        return new Picker(params);
    };
    return app;
};

},{}],91:[function(require,module,exports){
'use strict';

module.exports = function (app) {
    /*======================================================
    ************   Pull To Refresh   ************
    ======================================================*/
    app.initPullToRefresh = function (pageContainer) {
        var eventsTarget = $(pageContainer);
        if (!eventsTarget.hasClass('pull-to-refresh-content')) {
            eventsTarget = eventsTarget.find('.pull-to-refresh-content');
        }
        if (!eventsTarget || eventsTarget.length === 0) return;

        var touchId,
            isTouched,
            isMoved,
            touchesStart = {},
            isScrolling,
            touchesDiff,
            touchStartTime,
            container,
            refresh = false,
            useTranslate = false,
            startTranslate = 0,
            translate,
            scrollTop,
            wasScrolled,
            layer,
            triggerDistance,
            dynamicTriggerDistance,
            pullStarted;
        var page = eventsTarget.hasClass('page') ? eventsTarget : eventsTarget.parents('.page');
        var hasNavbar = false;
        if (page.find('.navbar').length > 0 || page.parents('.navbar-fixed, .navbar-through').length > 0 || page.hasClass('navbar-fixed') || page.hasClass('navbar-through')) hasNavbar = true;
        if (page.hasClass('no-navbar')) hasNavbar = false;
        if (!hasNavbar) eventsTarget.addClass('pull-to-refresh-no-navbar');

        container = eventsTarget;

        // Define trigger distance
        if (container.attr('data-ptr-distance')) {
            dynamicTriggerDistance = true;
        } else {
            triggerDistance = 44;
        }

        function handleTouchStart(e) {
            if (isTouched) {
                if (app.device.os === 'android') {
                    if ('targetTouches' in e && e.targetTouches.length > 1) return;
                } else return;
            }

            /*jshint validthis:true */
            container = $(this);
            if (container.hasClass('refreshing')) {
                return;
            }

            isMoved = false;
            pullStarted = false;
            isTouched = true;
            isScrolling = undefined;
            wasScrolled = undefined;
            if (e.type === 'touchstart') touchId = e.targetTouches[0].identifier;
            touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
            touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
            touchStartTime = new Date().getTime();
        }

        function handleTouchMove(e) {
            if (!isTouched) return;
            var pageX, pageY, touch;
            if (e.type === 'touchmove') {
                if (touchId && e.touches) {
                    for (var i = 0; i < e.touches.length; i++) {
                        if (e.touches[i].identifier === touchId) {
                            touch = e.touches[i];
                        }
                    }
                }
                if (!touch) touch = e.targetTouches[0];
                pageX = touch.pageX;
                pageY = touch.pageY;
            } else {
                pageX = e.pageX;
                pageY = e.pageY;
            }
            if (!pageX || !pageY) return;

            if (typeof isScrolling === 'undefined') {
                isScrolling = !!(isScrolling || Math.abs(pageY - touchesStart.y) > Math.abs(pageX - touchesStart.x));
            }
            if (!isScrolling) {
                isTouched = false;
                return;
            }

            scrollTop = container[0].scrollTop;
            if (typeof wasScrolled === 'undefined' && scrollTop !== 0) wasScrolled = true;

            if (!isMoved) {
                /*jshint validthis:true */
                container.removeClass('transitioning');
                if (scrollTop > container[0].offsetHeight) {
                    isTouched = false;
                    return;
                }
                if (dynamicTriggerDistance) {
                    triggerDistance = container.attr('data-ptr-distance');
                    if (triggerDistance.indexOf('%') >= 0) triggerDistance = container[0].offsetHeight * parseInt(triggerDistance, 10) / 100;
                }
                startTranslate = container.hasClass('refreshing') ? triggerDistance : 0;
                if (container[0].scrollHeight === container[0].offsetHeight || app.device.os !== 'ios') {
                    useTranslate = true;
                } else {
                    useTranslate = false;
                }
            }
            isMoved = true;
            touchesDiff = pageY - touchesStart.y;

            if (touchesDiff > 0 && scrollTop <= 0 || scrollTop < 0) {
                // iOS 8 fix
                if (app.device.os === 'ios' && parseInt(app.device.osVersion.split('.')[0], 10) > 7 && scrollTop === 0 && !wasScrolled) useTranslate = true;

                if (useTranslate) {
                    e.preventDefault();
                    translate = Math.pow(touchesDiff, 0.85) + startTranslate;
                    container.transform('translate3d(0,' + translate + 'px,0)');
                }
                if (useTranslate && Math.pow(touchesDiff, 0.85) > triggerDistance || !useTranslate && touchesDiff >= triggerDistance * 2) {
                    refresh = true;
                    container.addClass('pull-up').removeClass('pull-down');
                } else {
                    refresh = false;
                    container.removeClass('pull-up').addClass('pull-down');
                }
                if (!pullStarted) {
                    container.trigger('pullstart');
                    pullStarted = true;
                }
                container.trigger('pullmove', {
                    event: e,
                    scrollTop: scrollTop,
                    translate: translate,
                    touchesDiff: touchesDiff
                });
            } else {
                pullStarted = false;
                container.removeClass('pull-up pull-down');
                refresh = false;
                return;
            }
        }
        function handleTouchEnd(e) {
            if (e.type === 'touchend' && e.changedTouches && e.changedTouches.length > 0 && touchId) {
                if (e.changedTouches[0].identifier !== touchId) return;
            }
            if (!isTouched || !isMoved) {
                isTouched = false;
                isMoved = false;
                return;
            }
            if (translate) {
                container.addClass('transitioning');
                translate = 0;
            }
            container.transform('');
            if (refresh) {
                container.addClass('refreshing');
                container.trigger('refresh', {
                    done: function done() {
                        app.pullToRefreshDone(container);
                    }
                });
            } else {
                container.removeClass('pull-down');
            }
            isTouched = false;
            isMoved = false;
            if (pullStarted) container.trigger('pullend');
        }

        // Attach Events
        eventsTarget.on(app.touchEvents.start, handleTouchStart);
        eventsTarget.on(app.touchEvents.move, handleTouchMove);
        eventsTarget.on(app.touchEvents.end, handleTouchEnd);

        // Detach Events on page remove
        if (page.length === 0) return;
        function destroyPullToRefresh() {
            eventsTarget.off(app.touchEvents.start, handleTouchStart);
            eventsTarget.off(app.touchEvents.move, handleTouchMove);
            eventsTarget.off(app.touchEvents.end, handleTouchEnd);
        }
        eventsTarget[0].f7DestroyPullToRefresh = destroyPullToRefresh;
        function detachEvents() {
            destroyPullToRefresh();
        }
    };

    app.pullToRefreshDone = function (container) {
        container = $(container);
        if (container.length === 0) container = $('.pull-to-refresh-content.refreshing');
        container.removeClass('refreshing').addClass('transitioning');
        container.transitionEnd(function () {
            container.removeClass('transitioning pull-up pull-down');
            container.trigger('refreshdone');
        });
    };
    app.pullToRefreshTrigger = function (container) {
        container = $(container);
        if (container.length === 0) container = $('.pull-to-refresh-content');
        if (container.hasClass('refreshing')) return;
        container.addClass('transitioning refreshing');
        container.trigger('refresh', {
            done: function done() {
                app.pullToRefreshDone(container);
            }
        });
    };

    app.destroyPullToRefresh = function (pageContainer) {
        pageContainer = $(pageContainer);
        var pullToRefreshContent = pageContainer.hasClass('pull-to-refresh-content') ? pageContainer : pageContainer.find('.pull-to-refresh-content');
        if (pullToRefreshContent.length === 0) return;
        if (pullToRefreshContent[0].f7DestroyPullToRefresh) pullToRefreshContent[0].f7DestroyPullToRefresh();
    };
    return app;
};

},{}],92:[function(require,module,exports){
'use strict';

module.exports = function (app) {
    /*=============================================================
    ************   Hide/show Toolbar/Navbar on scroll   ************
    =============================================================*/
    app.initPageScrollToolbars = function (pageContainer) {
        pageContainer = $(pageContainer);
        var scrollContent = pageContainer.find('.page-content');
        if (scrollContent.length === 0) return;
        var hideNavbar = (app.params.hideNavbarOnPageScroll || scrollContent.hasClass('hide-navbar-on-scroll') || scrollContent.hasClass('hide-bars-on-scroll')) && !(scrollContent.hasClass('keep-navbar-on-scroll') || scrollContent.hasClass('keep-bars-on-scroll'));
        var hideToolbar = (app.params.hideToolbarOnPageScroll || scrollContent.hasClass('hide-toolbar-on-scroll') || scrollContent.hasClass('hide-bars-on-scroll')) && !(scrollContent.hasClass('keep-toolbar-on-scroll') || scrollContent.hasClass('keep-bars-on-scroll'));
        var hideTabbar = (app.params.hideTabbarOnPageScroll || scrollContent.hasClass('hide-tabbar-on-scroll')) && !scrollContent.hasClass('keep-tabbar-on-scroll');

        if (!(hideNavbar || hideToolbar || hideTabbar)) return;

        // var viewContainer = scrollContent.parents('.' + app.params.viewClass);
        // if (viewContainer.length === 0) return;

        var navbar = pageContainer.find('.navbar'),
            toolbar = pageContainer.find('.toolbar'),
            tabbar;
        if (hideTabbar) {
            tabbar = pageContainer.find('.tabbar');
            // if (tabbar.length === 0) tabbar = viewContainer.parents('.' + app.params.viewsClass).find('.tabbar');
        }

        var hasNavbar = navbar.length > 0,
            hasToolbar = toolbar.length > 0,
            hasTabbar = tabbar && tabbar.length > 0;

        var previousScroll, currentScroll;
        previousScroll = currentScroll = scrollContent[0].scrollTop;

        var scrollHeight, offsetHeight, reachEnd, action, navbarHidden, toolbarHidden, tabbarHidden;

        var toolbarHeight = hasToolbar && hideToolbar ? toolbar[0].offsetHeight : 0;
        var tabbarHeight = hasTabbar && hideTabbar ? tabbar[0].offsetHeight : 0;
        var bottomBarHeight = tabbarHeight || toolbarHeight;

        function handleScroll(e) {
            if (pageContainer.hasClass('page-on-left')) return;
            currentScroll = scrollContent[0].scrollTop;
            scrollHeight = scrollContent[0].scrollHeight;
            offsetHeight = scrollContent[0].offsetHeight;
            reachEnd = currentScroll + offsetHeight >= scrollHeight - bottomBarHeight;
            navbarHidden = navbar.hasClass('navbar-hidden');
            toolbarHidden = toolbar.hasClass('toolbar-hidden');
            tabbarHidden = tabbar && tabbar.hasClass('toolbar-hidden');

            if (reachEnd) {
                if (app.params.showBarsOnPageScrollEnd) {
                    action = 'show';
                }
            } else if (previousScroll > currentScroll) {
                if (app.params.showBarsOnPageScrollTop || currentScroll <= 44) {
                    action = 'show';
                } else {
                    action = 'hide';
                }
            } else {
                if (currentScroll > 44) {
                    action = 'hide';
                } else {
                    action = 'show';
                }
            }

            if (action === 'show') {
                if (hasNavbar && hideNavbar && navbarHidden) {
                    app.showNavbar(navbar);
                    pageContainer.removeClass('no-navbar-by-scroll');
                    navbarHidden = false;
                }
                if (hasToolbar && hideToolbar && toolbarHidden) {
                    app.showToolbar(toolbar);
                    pageContainer.removeClass('no-toolbar-by-scroll');
                    toolbarHidden = false;
                }
                if (hasTabbar && hideTabbar && tabbarHidden) {
                    app.showToolbar(tabbar);
                    pageContainer.removeClass('no-tabbar-by-scroll');
                    tabbarHidden = false;
                }
            } else {
                if (hasNavbar && hideNavbar && !navbarHidden) {
                    app.hideNavbar(navbar);
                    pageContainer.addClass('no-navbar-by-scroll');
                    navbarHidden = true;
                }
                if (hasToolbar && hideToolbar && !toolbarHidden) {
                    app.hideToolbar(toolbar);
                    pageContainer.addClass('no-toolbar-by-scroll');
                    toolbarHidden = true;
                }
                if (hasTabbar && hideTabbar && !tabbarHidden) {
                    app.hideToolbar(tabbar);
                    pageContainer.addClass('no-tabbar-by-scroll');
                    tabbarHidden = true;
                }
            }

            previousScroll = currentScroll;
        }
        scrollContent.on('scroll', handleScroll);
        scrollContent[0].f7ScrollToolbarsHandler = handleScroll;
    };
    app.destroyScrollToolbars = function (pageContainer) {
        pageContainer = $(pageContainer);
        var scrollContent = pageContainer.find('.page-content');
        if (scrollContent.length === 0) return;
        var handler = scrollContent[0].f7ScrollToolbarsHandler;
        if (!handler) return;
        scrollContent.off('scroll', scrollContent[0].f7ScrollToolbarsHandler);
    };
    return app;
};

},{}],93:[function(require,module,exports){
'use strict';

module.exports = function (app) {
    /*======================================================
    ************   Searchbar   ************
    ======================================================*/
    var Searchbar = function Searchbar(container, params) {
        var defaults = {
            input: null,
            clearButton: null,
            cancelButton: null,
            searchList: null,
            searchIn: '.item-title',
            searchBy: '',
            found: null,
            notFound: null,
            overlay: null,
            ignore: '.searchbar-ignore',
            customSearch: false,
            removeDiacritics: false,
            hideDividers: true,
            hideGroups: true
        };
        /* Callbacks
        onSearch
        onEnable
        onDisable
        onClear
        */

        params = params || {};
        for (var def in defaults) {
            if (typeof params[def] === 'undefined' || params[def] === null) {
                params[def] = defaults[def];
            }
        }

        // Instance
        var s = this;

        // Material
        s.material = app.params.material;

        // Params
        s.params = params;

        // Container
        container = $(container);
        s.container = container;

        // Active
        s.active = false;

        // Input
        s.input = s.params.input ? $(s.params.input) : s.container.find('input[type="search"]');
        s.clearButton = s.params.clearButton ? $(s.params.clearButton) : s.container.find('.searchbar-clear');
        s.cancelButton = s.params.cancelButton ? $(s.params.cancelButton) : s.container.find('.searchbar-cancel');

        // Search List
        s.searchList = $(s.params.searchList);

        // Is Virtual List
        s.isVirtualList = s.searchList.hasClass('virtual-list');

        // Is In Page
        s.pageContainer = s.container.parents('.page').eq(0);

        // Overlay
        if (!s.params.overlay) {
            s.overlay = s.pageContainer.length > 0 ? s.pageContainer.find('.searchbar-overlay') : $('.searchbar-overlay');
        } else {
            s.overlay = $(s.params.overlay);
        }
        // Found and not found
        if (!s.params.found) {
            s.found = s.pageContainer.length > 0 ? s.pageContainer.find('.searchbar-found') : $('.searchbar-found');
        } else {
            s.found = $(s.params.found);
        }
        if (!s.params.notFound) {
            s.notFound = s.pageContainer.length > 0 ? s.pageContainer.find('.searchbar-not-found') : $('.searchbar-not-found');
        } else {
            s.notFound = $(s.params.notFound);
        }

        // Diacritics
        var defaultDiacriticsRemovalap = [{ base: 'A', letters: 'AⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ' }, { base: 'AA', letters: 'Ꜳ' }, { base: 'AE', letters: 'ÆǼǢ' }, { base: 'AO', letters: 'Ꜵ' }, { base: 'AU', letters: 'Ꜷ' }, { base: 'AV', letters: 'ꜸꜺ' }, { base: 'AY', letters: 'Ꜽ' }, { base: 'B', letters: 'BⒷＢḂḄḆɃƂƁ' }, { base: 'C', letters: 'CⒸＣĆĈĊČÇḈƇȻꜾ' }, { base: 'D', letters: 'DⒹＤḊĎḌḐḒḎĐƋƊƉꝹ' }, { base: 'DZ', letters: 'ǱǄ' }, { base: 'Dz', letters: 'ǲǅ' }, { base: 'E', letters: 'EⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ' }, { base: 'F', letters: 'FⒻＦḞƑꝻ' }, { base: 'G', letters: 'GⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ' }, { base: 'H', letters: 'HⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ' }, { base: 'I', letters: 'IⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ' }, { base: 'J', letters: 'JⒿＪĴɈ' }, { base: 'K', letters: 'KⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ' }, { base: 'L', letters: 'LⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ' }, { base: 'LJ', letters: 'Ǉ' }, { base: 'Lj', letters: 'ǈ' }, { base: 'M', letters: 'MⓂＭḾṀṂⱮƜ' }, { base: 'N', letters: 'NⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ' }, { base: 'NJ', letters: 'Ǌ' }, { base: 'Nj', letters: 'ǋ' }, { base: 'O', letters: 'OⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ' }, { base: 'OI', letters: 'Ƣ' }, { base: 'OO', letters: 'Ꝏ' }, { base: 'OU', letters: 'Ȣ' }, { base: 'OE', letters: 'Œ' }, { base: 'oe', letters: 'œ' }, { base: 'P', letters: 'PⓅＰṔṖƤⱣꝐꝒꝔ' }, { base: 'Q', letters: 'QⓆＱꝖꝘɊ' }, { base: 'R', letters: 'RⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ' }, { base: 'S', letters: 'SⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ' }, { base: 'T', letters: 'TⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ' }, { base: 'TZ', letters: 'Ꜩ' }, { base: 'U', letters: 'UⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ' }, { base: 'V', letters: 'VⓋＶṼṾƲꝞɅ' }, { base: 'VY', letters: 'Ꝡ' }, { base: 'W', letters: 'WⓌＷẀẂŴẆẄẈⱲ' }, { base: 'X', letters: 'XⓍＸẊẌ' }, { base: 'Y', letters: 'YⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ' }, { base: 'Z', letters: 'ZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ' }, { base: 'a', letters: 'aⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐ' }, { base: 'aa', letters: 'ꜳ' }, { base: 'ae', letters: 'æǽǣ' }, { base: 'ao', letters: 'ꜵ' }, { base: 'au', letters: 'ꜷ' }, { base: 'av', letters: 'ꜹꜻ' }, { base: 'ay', letters: 'ꜽ' }, { base: 'b', letters: 'bⓑｂḃḅḇƀƃɓ' }, { base: 'c', letters: 'cⓒｃćĉċčçḉƈȼꜿↄ' }, { base: 'd', letters: 'dⓓｄḋďḍḑḓḏđƌɖɗꝺ' }, { base: 'dz', letters: 'ǳǆ' }, { base: 'e', letters: 'eⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ' }, { base: 'f', letters: 'fⓕｆḟƒꝼ' }, { base: 'g', letters: 'gⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ' }, { base: 'h', letters: 'hⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ' }, { base: 'hv', letters: 'ƕ' }, { base: 'i', letters: 'iⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı' }, { base: 'j', letters: 'jⓙｊĵǰɉ' }, { base: 'k', letters: 'kⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ' }, { base: 'l', letters: 'lⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ' }, { base: 'lj', letters: 'ǉ' }, { base: 'm', letters: 'mⓜｍḿṁṃɱɯ' }, { base: 'n', letters: 'nⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥ' }, { base: 'nj', letters: 'ǌ' }, { base: 'o', letters: 'oⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ' }, { base: 'oi', letters: 'ƣ' }, { base: 'ou', letters: 'ȣ' }, { base: 'oo', letters: 'ꝏ' }, { base: 'p', letters: 'pⓟｐṕṗƥᵽꝑꝓꝕ' }, { base: 'q', letters: 'qⓠｑɋꝗꝙ' }, { base: 'r', letters: 'rⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ' }, { base: 's', letters: 'sⓢｓßśṥŝṡšṧṣṩșşȿꞩꞅẛ' }, { base: 't', letters: 'tⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ' }, { base: 'tz', letters: 'ꜩ' }, { base: 'u', letters: 'uⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ' }, { base: 'v', letters: 'vⓥｖṽṿʋꝟʌ' }, { base: 'vy', letters: 'ꝡ' }, { base: 'w', letters: 'wⓦｗẁẃŵẇẅẘẉⱳ' }, { base: 'x', letters: 'xⓧｘẋẍ' }, { base: 'y', letters: 'yⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ' }, { base: 'z', letters: 'zⓩｚźẑżžẓẕƶȥɀⱬꝣ' }];

        var diacriticsMap = {};
        for (var i = 0; i < defaultDiacriticsRemovalap.length; i++) {
            var letters = defaultDiacriticsRemovalap[i].letters;
            for (var j = 0; j < letters.length; j++) {
                diacriticsMap[letters[j]] = defaultDiacriticsRemovalap[i].base;
            }
        }

        function removeDiacritics(str) {
            return str.replace(/[^\u0000-\u007E]/g, function (a) {
                return diacriticsMap[a] || a;
            });
        }

        // Set Cancel button
        var cancelMarginProp = app.rtl ? 'margin-left' : 'margin-right';
        var cancelButtonHasMargin = false;
        s.setCancelButtonMargin = function () {
            s.cancelButton.transition(0).show();
            s.cancelButton.css(cancelMarginProp, -s.cancelButton[0].offsetWidth + 'px');
            var clientLeft = s.cancelButton[0].clientLeft;
            s.cancelButton.transition('');
            cancelButtonHasMargin = true;
        };

        // Trigger
        s.triggerEvent = function (eventName, callbackName, eventData) {
            s.container.trigger(eventName, eventData);
            if (s.searchList.length > 0) s.searchList.trigger(eventName, eventData);
            if (callbackName && s.params[callbackName]) s.params[callbackName](s, eventData);
        };

        // Enable/disalbe
        s.enable = function () {
            function _enable() {
                if ((s.searchList.length || s.params.customSearch) && !s.container.hasClass('searchbar-active')) s.overlay.addClass('searchbar-overlay-active');
                s.container.addClass('searchbar-active');
                if (s.cancelButton.length > 0 && !s.material) {
                    if (!cancelButtonHasMargin) {
                        s.setCancelButtonMargin();
                    }
                    s.cancelButton.css(cancelMarginProp, '0px');
                }
                s.triggerEvent('enableSearch', 'onEnable');
                s.active = true;
            }
            if (app.device.ios && !app.params.material) {
                setTimeout(function () {
                    _enable();
                }, 400);
            } else {
                _enable();
            }
        };

        s.disable = function () {
            s.input.val('').trigger('change');
            s.container.removeClass('searchbar-active searchbar-not-empty');
            if (s.cancelButton.length > 0 && !s.material) s.cancelButton.css(cancelMarginProp, -s.cancelButton[0].offsetWidth + 'px');

            if (s.searchList.length || s.params.customSearch) s.overlay.removeClass('searchbar-overlay-active');
            function _disable() {
                s.input.blur();
                s.triggerEvent('disableSearch', 'onDisable');
                s.active = false;
            }
            if (app.device.ios) {
                setTimeout(function () {
                    _disable();
                }, 400);
            } else {
                _disable();
            }
        };

        // Clear
        s.clear = function (e) {
            if (!s.query && e && $(e.target).hasClass('searchbar-clear')) {
                s.disable();
                return;
            }
            s.input.val('').trigger('change').focus();
            s.triggerEvent('clearSearch', 'onClear');
        };

        // Search
        s.handleInput = function () {
            setTimeout(function () {
                var value = s.input.val().trim();
                if ((s.searchList.length > 0 || s.params.customSearch) && (s.params.searchIn || s.isVirtualList)) s.search(value, true);
            }, 0);
        };

        var previousQuery = '';
        var virtualList;
        s.search = function (query, internal) {
            if (query.trim() === previousQuery) return;
            previousQuery = query.trim();

            if (!internal) {
                if (!s.active) {
                    s.enable();
                }
                if (!internal) {
                    s.input.val(query);
                }
            }
            s.query = s.value = query;
            // Add active/inactive classes on overlay
            if (query.length === 0) {
                s.container.removeClass('searchbar-not-empty');
                if (s.searchList.length && s.container.hasClass('searchbar-active')) s.overlay.addClass('searchbar-overlay-active');
            } else {
                s.container.addClass('searchbar-not-empty');
                if (s.searchList.length && s.container.hasClass('searchbar-active')) s.overlay.removeClass('searchbar-overlay-active');
            }

            if (s.params.customSearch) {
                s.triggerEvent('search', 'onSearch', { query: query });
                return;
            }

            var foundItems = [];
            if (s.isVirtualList) {
                virtualList = s.searchList[0].f7VirtualList;
                if (query.trim() === '') {
                    virtualList.resetFilter();
                    s.notFound.hide();
                    s.found.show();
                    return;
                }
                if (virtualList.params.searchAll) {
                    foundItems = virtualList.params.searchAll(query, virtualList.items) || [];
                } else if (virtualList.params.searchByItem) {
                    for (var i = 0; i < virtualList.items.length; i++) {
                        if (virtualList.params.searchByItem(query, i, virtualList.params.items[i])) {
                            foundItems.push(i);
                        }
                    }
                }
            } else {
                var values;
                if (s.params.removeDiacritics) values = removeDiacritics(query.trim().toLowerCase()).split(' ');else {
                    values = query.trim().toLowerCase().split(' ');
                }
                s.searchList.find('li').removeClass('hidden-by-searchbar').each(function (index, el) {
                    el = $(el);
                    var compareWithText = [];
                    el.find(s.params.searchIn).each(function () {
                        var itemText = $(this).text().trim().toLowerCase();
                        if (s.params.removeDiacritics) itemText = removeDiacritics(itemText);
                        compareWithText.push(itemText);
                    });
                    compareWithText = compareWithText.join(' ');
                    var wordsMatch = 0;
                    for (var i = 0; i < values.length; i++) {
                        if (compareWithText.indexOf(values[i]) >= 0) wordsMatch++;
                    }
                    if (wordsMatch !== values.length && !(s.params.ignore && el.is(s.params.ignore))) {
                        el.addClass('hidden-by-searchbar');
                    } else {
                        foundItems.push(el[0]);
                    }
                });

                if (s.params.hideDividers) {
                    s.searchList.find('.item-divider, .list-group-title').each(function () {
                        var title = $(this);
                        var nextElements = title.nextAll('li');
                        var hide = true;
                        for (var i = 0; i < nextElements.length; i++) {
                            var nextEl = $(nextElements[i]);
                            if (nextEl.hasClass('list-group-title') || nextEl.hasClass('item-divider')) break;
                            if (!nextEl.hasClass('hidden-by-searchbar')) {
                                hide = false;
                            }
                        }
                        var ignore = s.params.ignore && title.is(s.params.ignore);
                        if (hide && !ignore) title.addClass('hidden-by-searchbar');else title.removeClass('hidden-by-searchbar');
                    });
                }
                if (s.params.hideGroups) {
                    s.searchList.find('.list-group').each(function () {
                        var group = $(this);
                        var ignore = s.params.ignore && group.is(s.params.ignore);
                        var notHidden = group.find('li:not(.hidden-by-searchbar)');
                        if (notHidden.length === 0 && !ignore) {
                            group.addClass('hidden-by-searchbar');
                        } else {
                            group.removeClass('hidden-by-searchbar');
                        }
                    });
                }
            }
            s.triggerEvent('search', 'onSearch', { query: query, foundItems: foundItems });
            if (foundItems.length === 0) {
                s.notFound.show();
                s.found.hide();
            } else {
                s.notFound.hide();
                s.found.show();
            }
            if (s.isVirtualList) {
                virtualList.filterItems(foundItems);
            }
        };

        // Events
        function preventSubmit(e) {
            e.preventDefault();
        }

        s.attachEvents = function (destroy) {
            var method = destroy ? 'off' : 'on';
            s.container[method]('submit', preventSubmit);
            if (!s.material) s.cancelButton[method]('click', s.disable);
            s.overlay[method]('click', s.disable);
            s.input[method]('focus', s.enable);
            s.input[method]('change keydown keypress keyup', s.handleInput);
            s.clearButton[method]('click', s.clear);
        };
        s.detachEvents = function () {
            s.attachEvents(true);
        };

        // Init Destroy
        s.init = function () {
            s.attachEvents();
        };
        s.destroy = function () {
            if (!s) return;
            s.detachEvents();
            s = null;
        };

        // Init
        s.init();

        s.container[0].f7Searchbar = s;
        return s;
    };
    app.searchbar = function (container, params) {
        return new Searchbar(container, params);
    };
    return app;
};

},{}],94:[function(require,module,exports){
'use strict';

module.exports = function (app) {
    /*===============================================================================
    ************   Sortable   ************
    ===============================================================================*/
    app.sortableToggle = function (sortableContainer) {
        sortableContainer = $(sortableContainer);
        if (sortableContainer.length === 0) sortableContainer = $('.list-block.sortable');
        sortableContainer.toggleClass('sortable-opened');
        if (sortableContainer.hasClass('sortable-opened')) {
            sortableContainer.trigger('open');
        } else {
            sortableContainer.trigger('close');
        }
        return sortableContainer;
    };
    app.sortableOpen = function (sortableContainer) {
        sortableContainer = $(sortableContainer);
        if (sortableContainer.length === 0) sortableContainer = $('.list-block.sortable');
        sortableContainer.addClass('sortable-opened');
        sortableContainer.trigger('open');
        return sortableContainer;
    };
    app.sortableClose = function (sortableContainer) {
        sortableContainer = $(sortableContainer);
        if (sortableContainer.length === 0) sortableContainer = $('.list-block.sortable');
        sortableContainer.removeClass('sortable-opened');
        sortableContainer.trigger('close');
        return sortableContainer;
    };
    app.initSortable = function () {
        var isTouched, isMoved, touchStartY, touchesDiff, sortingEl, sortingElHeight, sortingItems, minTop, maxTop, insertAfter, insertBefore, sortableContainer;

        function handleTouchStart(e) {
            isMoved = false;
            isTouched = true;
            touchStartY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
            /*jshint validthis:true */
            sortingEl = $(this).parent();
            sortingItems = sortingEl.parent().find('li');
            sortableContainer = sortingEl.parents('.sortable');
            e.preventDefault();
            app.allowPanelOpen = app.allowSwipeout = false;
        }
        function handleTouchMove(e) {
            if (!isTouched || !sortingEl) return;
            var pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
            var pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
            if (!isMoved) {
                sortingEl.addClass('sorting');
                sortableContainer.addClass('sortable-sorting');
                minTop = sortingEl[0].offsetTop;
                maxTop = sortingEl.parent().height() - sortingEl[0].offsetTop - sortingEl.height();
                sortingElHeight = sortingEl[0].offsetHeight;
            }
            isMoved = true;

            e.preventDefault();
            e.f7PreventPanelSwipe = true;
            touchesDiff = pageY - touchStartY;
            var translate = touchesDiff;
            if (translate < -minTop) translate = -minTop;
            if (translate > maxTop) translate = maxTop;
            sortingEl.transform('translate3d(0,' + translate + 'px,0)');

            insertBefore = insertAfter = undefined;

            sortingItems.each(function () {
                var currentEl = $(this);
                if (currentEl[0] === sortingEl[0]) return;
                var currentElOffset = currentEl[0].offsetTop;
                var currentElHeight = currentEl.height();
                var sortingElOffset = sortingEl[0].offsetTop + translate;

                if (sortingElOffset >= currentElOffset - currentElHeight / 2 && sortingEl.index() < currentEl.index()) {
                    currentEl.transform('translate3d(0, ' + -sortingElHeight + 'px,0)');
                    insertAfter = currentEl;
                    insertBefore = undefined;
                } else if (sortingElOffset <= currentElOffset + currentElHeight / 2 && sortingEl.index() > currentEl.index()) {
                    currentEl.transform('translate3d(0, ' + sortingElHeight + 'px,0)');
                    insertAfter = undefined;
                    if (!insertBefore) insertBefore = currentEl;
                } else {
                    $(this).transform('translate3d(0, 0%,0)');
                }
            });
        }
        function handleTouchEnd(e) {
            app.allowPanelOpen = app.allowSwipeout = true;
            if (!isTouched || !isMoved) {
                isTouched = false;
                isMoved = false;
                return;
            }
            e.preventDefault();
            sortingItems.transform('');
            sortingEl.removeClass('sorting');
            sortableContainer.removeClass('sortable-sorting');
            var virtualList, oldIndex, newIndex;
            if (insertAfter) {
                sortingEl.insertAfter(insertAfter);
                sortingEl.trigger('sort');
            }
            if (insertBefore) {
                sortingEl.insertBefore(insertBefore);
                sortingEl.trigger('sort');
            }
            if ((insertAfter || insertBefore) && sortableContainer.hasClass('virtual-list')) {
                virtualList = sortableContainer[0].f7VirtualList;
                oldIndex = sortingEl[0].f7VirtualListIndex;
                newIndex = insertBefore ? insertBefore[0].f7VirtualListIndex : insertAfter[0].f7VirtualListIndex;
                if (virtualList) virtualList.moveItem(oldIndex, newIndex);
            }
            insertAfter = insertBefore = undefined;
            isTouched = false;
            isMoved = false;
        }
        $(document).on(app.touchEvents.start, '.list-block.sortable .sortable-handler', handleTouchStart);
        if (app.support.touch) {
            $(document).on(app.touchEvents.move, '.list-block.sortable .sortable-handler', handleTouchMove);
            $(document).on(app.touchEvents.end, '.list-block.sortable .sortable-handler', handleTouchEnd);
        } else {
            $(document).on(app.touchEvents.move, handleTouchMove);
            $(document).on(app.touchEvents.end, handleTouchEnd);
        }
    };
    return app;
};

},{}],95:[function(require,module,exports){
'use strict';

module.exports = function (app) {
    /*===============================================================================
    ************   Swipeout Actions (Swipe to delete)   ************
    ===============================================================================*/
    app.swipeoutOpenedEl = undefined;
    app.allowSwipeout = true;
    app.initSwipeout = function (swipeoutEl) {
        var isTouched,
            isMoved,
            isScrolling,
            touchesStart = {},
            touchStartTime,
            touchesDiff,
            swipeOutEl,
            swipeOutContent,
            actionsRight,
            actionsLeft,
            actionsLeftWidth,
            actionsRightWidth,
            translate,
            opened,
            openedActions,
            buttonsLeft,
            buttonsRight,
            direction,
            overswipeLeftButton,
            overswipeRightButton,
            overswipeLeft,
            overswipeRight,
            noFoldLeft,
            noFoldRight;
        $(document).on(app.touchEvents.start, function (e) {
            if (app.swipeoutOpenedEl) {
                var target = $(e.target);
                if (!(app.swipeoutOpenedEl.is(target[0]) || target.parents('.swipeout').is(app.swipeoutOpenedEl) || target.hasClass('modal-in') || target.hasClass('modal-overlay') || target.hasClass('actions-modal') || target.parents('.actions-modal.modal-in, .modal.modal-in').length > 0)) {
                    app.swipeoutClose(app.swipeoutOpenedEl);
                }
            }
        });

        function handleTouchStart(e) {
            if (!app.allowSwipeout) return;
            isMoved = false;
            isTouched = true;
            isScrolling = undefined;
            touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
            touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
            touchStartTime = new Date().getTime();
        }
        function handleTouchMove(e) {
            if (!isTouched) return;
            var pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
            var pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
            if (typeof isScrolling === 'undefined') {
                isScrolling = !!(isScrolling || Math.abs(pageY - touchesStart.y) > Math.abs(pageX - touchesStart.x));
            }
            if (isScrolling) {
                isTouched = false;
                return;
            }

            if (!isMoved) {
                if ($('.list-block.sortable-opened').length > 0) return;
                /*jshint validthis:true */
                swipeOutEl = $(this);
                swipeOutContent = swipeOutEl.find('.swipeout-content');
                actionsRight = swipeOutEl.find('.swipeout-actions-right');
                actionsLeft = swipeOutEl.find('.swipeout-actions-left');
                actionsLeftWidth = actionsRightWidth = buttonsLeft = buttonsRight = overswipeRightButton = overswipeLeftButton = null;
                noFoldLeft = actionsLeft.hasClass('swipeout-actions-no-fold') || app.params.swipeoutActionsNoFold;
                noFoldRight = actionsRight.hasClass('swipeout-actions-no-fold') || app.params.swipeoutActionsNoFold;
                if (actionsLeft.length > 0) {
                    actionsLeftWidth = actionsLeft.outerWidth();
                    buttonsLeft = actionsLeft.children('a');
                    overswipeLeftButton = actionsLeft.find('.swipeout-overswipe');
                }
                if (actionsRight.length > 0) {
                    actionsRightWidth = actionsRight.outerWidth();
                    buttonsRight = actionsRight.children('a');
                    overswipeRightButton = actionsRight.find('.swipeout-overswipe');
                }
                opened = swipeOutEl.hasClass('swipeout-opened');
                if (opened) {
                    openedActions = swipeOutEl.find('.swipeout-actions-left.swipeout-actions-opened').length > 0 ? 'left' : 'right';
                }
                swipeOutEl.removeClass('transitioning');
                if (!app.params.swipeoutNoFollow) {
                    swipeOutEl.find('.swipeout-actions-opened').removeClass('swipeout-actions-opened');
                    swipeOutEl.removeClass('swipeout-opened');
                }
            }
            isMoved = true;
            e.preventDefault();

            touchesDiff = pageX - touchesStart.x;
            translate = touchesDiff;

            if (opened) {
                if (openedActions === 'right') translate = translate - actionsRightWidth;else translate = translate + actionsLeftWidth;
            }

            if (translate > 0 && actionsLeft.length === 0 || translate < 0 && actionsRight.length === 0) {
                if (!opened) {
                    isTouched = isMoved = false;
                    swipeOutContent.transform('');
                    if (buttonsRight && buttonsRight.length > 0) {
                        buttonsRight.transform('');
                    }
                    if (buttonsLeft && buttonsLeft.length > 0) {
                        buttonsLeft.transform('');
                    }
                    return;
                }
                translate = 0;
            }

            if (translate < 0) direction = 'to-left';else if (translate > 0) direction = 'to-right';else {
                if (direction) direction = direction;else direction = 'to-left';
            }

            var i, buttonOffset, progress;

            e.f7PreventPanelSwipe = true;
            if (app.params.swipeoutNoFollow) {
                if (opened) {
                    if (openedActions === 'right' && touchesDiff > 0) {
                        app.swipeoutClose(swipeOutEl);
                    }
                    if (openedActions === 'left' && touchesDiff < 0) {
                        app.swipeoutClose(swipeOutEl);
                    }
                } else {
                    if (touchesDiff < 0 && actionsRight.length > 0) {
                        app.swipeoutOpen(swipeOutEl, 'right');
                    }
                    if (touchesDiff > 0 && actionsLeft.length > 0) {
                        app.swipeoutOpen(swipeOutEl, 'left');
                    }
                }
                isTouched = false;
                isMoved = false;
                return;
            }
            overswipeLeft = false;
            overswipeRight = false;
            var $button;
            if (actionsRight.length > 0) {
                // Show right actions
                progress = translate / actionsRightWidth;
                if (translate < -actionsRightWidth) {
                    translate = -actionsRightWidth - Math.pow(-translate - actionsRightWidth, 0.8);
                    if (overswipeRightButton.length > 0) {
                        overswipeRight = true;
                    }
                }
                for (i = 0; i < buttonsRight.length; i++) {
                    if (typeof buttonsRight[i]._buttonOffset === 'undefined') {
                        buttonsRight[i]._buttonOffset = buttonsRight[i].offsetLeft;
                    }
                    buttonOffset = buttonsRight[i]._buttonOffset;
                    $button = $(buttonsRight[i]);
                    if (overswipeRightButton.length > 0 && $button.hasClass('swipeout-overswipe')) {
                        $button.css({ left: (overswipeRight ? -buttonOffset : 0) + 'px' });
                        if (overswipeRight) {
                            $button.addClass('swipeout-overswipe-active');
                        } else {
                            $button.removeClass('swipeout-overswipe-active');
                        }
                    }
                    $button.transform('translate3d(' + (translate - buttonOffset * (1 + Math.max(progress, -1))) + 'px,0,0)');
                }
            }
            if (actionsLeft.length > 0) {
                // Show left actions
                progress = translate / actionsLeftWidth;
                if (translate > actionsLeftWidth) {
                    translate = actionsLeftWidth + Math.pow(translate - actionsLeftWidth, 0.8);
                    if (overswipeLeftButton.length > 0) {
                        overswipeLeft = true;
                    }
                }
                for (i = 0; i < buttonsLeft.length; i++) {
                    if (typeof buttonsLeft[i]._buttonOffset === 'undefined') {
                        buttonsLeft[i]._buttonOffset = actionsLeftWidth - buttonsLeft[i].offsetLeft - buttonsLeft[i].offsetWidth;
                    }
                    buttonOffset = buttonsLeft[i]._buttonOffset;
                    $button = $(buttonsLeft[i]);
                    if (overswipeLeftButton.length > 0 && $button.hasClass('swipeout-overswipe')) {
                        $button.css({ left: (overswipeLeft ? buttonOffset : 0) + 'px' });
                        if (overswipeLeft) {
                            $button.addClass('swipeout-overswipe-active');
                        } else {
                            $button.removeClass('swipeout-overswipe-active');
                        }
                    }
                    if (buttonsLeft.length > 1) {
                        $button.css('z-index', buttonsLeft.length - i);
                    }
                    $button.transform('translate3d(' + (translate + buttonOffset * (1 - Math.min(progress, 1))) + 'px,0,0)');
                }
            }
            swipeOutContent.transform('translate3d(' + translate + 'px,0,0)');
        }
        function handleTouchEnd(e) {
            if (!isTouched || !isMoved) {
                isTouched = false;
                isMoved = false;
                return;
            }

            isTouched = false;
            isMoved = false;
            var timeDiff = new Date().getTime() - touchStartTime;
            var action, actionsWidth, actions, buttons, i, noFold;

            noFold = direction === 'to-left' ? noFoldRight : noFoldLeft;
            actions = direction === 'to-left' ? actionsRight : actionsLeft;
            actionsWidth = direction === 'to-left' ? actionsRightWidth : actionsLeftWidth;

            if (timeDiff < 300 && (touchesDiff < -10 && direction === 'to-left' || touchesDiff > 10 && direction === 'to-right') || timeDiff >= 300 && Math.abs(translate) > actionsWidth / 2) {
                action = 'open';
            } else {
                action = 'close';
            }
            if (timeDiff < 300) {
                if (Math.abs(translate) === 0) action = 'close';
                if (Math.abs(translate) === actionsWidth) action = 'open';
            }

            if (action === 'open') {
                app.swipeoutOpenedEl = swipeOutEl;
                swipeOutEl.trigger('open');
                swipeOutEl.addClass('swipeout-opened transitioning');
                var newTranslate = direction === 'to-left' ? -actionsWidth : actionsWidth;
                swipeOutContent.transform('translate3d(' + newTranslate + 'px,0,0)');
                actions.addClass('swipeout-actions-opened');
                buttons = direction === 'to-left' ? buttonsRight : buttonsLeft;
                if (buttons) {
                    for (i = 0; i < buttons.length; i++) {
                        $(buttons[i]).transform('translate3d(' + newTranslate + 'px,0,0)');
                    }
                }
                if (overswipeRight) {
                    actionsRight.find('.swipeout-overswipe')[0].click();
                }
                if (overswipeLeft) {
                    actionsLeft.find('.swipeout-overswipe')[0].click();
                }
            } else {
                swipeOutEl.trigger('close');
                app.swipeoutOpenedEl = undefined;
                swipeOutEl.addClass('transitioning').removeClass('swipeout-opened');
                swipeOutContent.transform('');
                actions.removeClass('swipeout-actions-opened');
            }

            var buttonOffset;
            if (buttonsLeft && buttonsLeft.length > 0 && buttonsLeft !== buttons) {
                for (i = 0; i < buttonsLeft.length; i++) {
                    buttonOffset = buttonsLeft[i]._buttonOffset;
                    if (typeof buttonOffset === 'undefined') {
                        buttonsLeft[i]._buttonOffset = actionsLeftWidth - buttonsLeft[i].offsetLeft - buttonsLeft[i].offsetWidth;
                    }
                    $(buttonsLeft[i]).transform('translate3d(' + buttonOffset + 'px,0,0)');
                }
            }
            if (buttonsRight && buttonsRight.length > 0 && buttonsRight !== buttons) {
                for (i = 0; i < buttonsRight.length; i++) {
                    buttonOffset = buttonsRight[i]._buttonOffset;
                    if (typeof buttonOffset === 'undefined') {
                        buttonsRight[i]._buttonOffset = buttonsRight[i].offsetLeft;
                    }
                    $(buttonsRight[i]).transform('translate3d(' + -buttonOffset + 'px,0,0)');
                }
            }
            swipeOutContent.transitionEnd(function (e) {
                if (opened && action === 'open' || closed && action === 'close') return;
                swipeOutEl.trigger(action === 'open' ? 'opened' : 'closed');
                if (opened && action === 'close') {
                    if (actionsRight.length > 0) {
                        buttonsRight.transform('');
                    }
                    if (actionsLeft.length > 0) {
                        buttonsLeft.transform('');
                    }
                }
            });
        }
        if (swipeoutEl) {
            $(swipeoutEl).on(app.touchEvents.start, handleTouchStart);
            $(swipeoutEl).on(app.touchEvents.move, handleTouchMove);
            $(swipeoutEl).on(app.touchEvents.end, handleTouchEnd);
        } else {
            $(document).on(app.touchEvents.start, '.list-block li.swipeout', handleTouchStart);
            $(document).on(app.touchEvents.move, '.list-block li.swipeout', handleTouchMove);
            $(document).on(app.touchEvents.end, '.list-block li.swipeout', handleTouchEnd);
        }
    };
    app.swipeoutOpen = function (el, dir, callback) {
        el = $(el);
        if (arguments.length === 2) {
            if (typeof arguments[1] === 'function') {
                callback = dir;
            }
        }

        if (el.length === 0) return;
        if (el.length > 1) el = $(el[0]);
        if (!el.hasClass('swipeout') || el.hasClass('swipeout-opened')) return;
        if (!dir) {
            if (el.find('.swipeout-actions-right').length > 0) dir = 'right';else dir = 'left';
        }
        var swipeOutActions = el.find('.swipeout-actions-' + dir);
        if (swipeOutActions.length === 0) return;
        var noFold = swipeOutActions.hasClass('swipeout-actions-no-fold') || app.params.swipeoutActionsNoFold;
        el.trigger('open').addClass('swipeout-opened').removeClass('transitioning');
        swipeOutActions.addClass('swipeout-actions-opened');
        var buttons = swipeOutActions.children('a');
        var swipeOutActionsWidth = swipeOutActions.outerWidth();
        var translate = dir === 'right' ? -swipeOutActionsWidth : swipeOutActionsWidth;
        var i;
        if (buttons.length > 1) {
            for (i = 0; i < buttons.length; i++) {
                if (dir === 'right') {
                    $(buttons[i]).transform('translate3d(' + -buttons[i].offsetLeft + 'px,0,0)');
                } else {
                    $(buttons[i]).css('z-index', buttons.length - i).transform('translate3d(' + (swipeOutActionsWidth - buttons[i].offsetWidth - buttons[i].offsetLeft) + 'px,0,0)');
                }
            }
            var clientLeft = buttons[1].clientLeft;
        }
        el.addClass('transitioning');
        for (i = 0; i < buttons.length; i++) {
            $(buttons[i]).transform('translate3d(' + translate + 'px,0,0)');
        }
        el.find('.swipeout-content').transform('translate3d(' + translate + 'px,0,0)').transitionEnd(function () {
            el.trigger('opened');
            if (callback) callback.call(el[0]);
        });
        app.swipeoutOpenedEl = el;
    };
    app.swipeoutClose = function (el, callback) {
        el = $(el);
        if (el.length === 0) return;
        if (!el.hasClass('swipeout-opened')) return;
        var dir = el.find('.swipeout-actions-opened').hasClass('swipeout-actions-right') ? 'right' : 'left';
        var swipeOutActions = el.find('.swipeout-actions-opened').removeClass('swipeout-actions-opened');
        var noFold = swipeOutActions.hasClass('swipeout-actions-no-fold') || app.params.swipeoutActionsNoFold;
        var buttons = swipeOutActions.children('a');
        var swipeOutActionsWidth = swipeOutActions.outerWidth();
        app.allowSwipeout = false;
        el.trigger('close');
        el.removeClass('swipeout-opened').addClass('transitioning');

        var closeTO;
        function onSwipeoutClose() {
            app.allowSwipeout = true;
            if (el.hasClass('swipeout-opened')) return;
            el.removeClass('transitioning');
            buttons.transform('');
            el.trigger('closed');
            if (callback) callback.call(el[0]);
            if (closeTO) clearTimeout(closeTO);
        }
        el.find('.swipeout-content').transform('').transitionEnd(onSwipeoutClose);
        closeTO = setTimeout(onSwipeoutClose, 500);

        for (var i = 0; i < buttons.length; i++) {
            if (dir === 'right') {
                $(buttons[i]).transform('translate3d(' + -buttons[i].offsetLeft + 'px,0,0)');
            } else {
                $(buttons[i]).transform('translate3d(' + (swipeOutActionsWidth - buttons[i].offsetWidth - buttons[i].offsetLeft) + 'px,0,0)');
            }
            $(buttons[i]).css({ left: 0 + 'px' }).removeClass('swipeout-overswipe-active');
        }
        if (app.swipeoutOpenedEl && app.swipeoutOpenedEl[0] === el[0]) app.swipeoutOpenedEl = undefined;
    };
    app.swipeoutDelete = function (el, callback) {
        el = $(el);
        if (el.length === 0) return;
        if (el.length > 1) el = $(el[0]);
        app.swipeoutOpenedEl = undefined;
        el.trigger('delete');
        el.css({ height: el.outerHeight() + 'px' });
        var clientLeft = el[0].clientLeft;
        el.css({ height: 0 + 'px' }).addClass('deleting transitioning').transitionEnd(function () {
            el.trigger('deleted');
            if (callback) callback.call(el[0]);
            if (el.parents('.virtual-list').length > 0) {
                var virtualList = el.parents('.virtual-list')[0].f7VirtualList;
                var virtualIndex = el[0].f7VirtualListIndex;
                if (virtualList && typeof virtualIndex !== 'undefined') virtualList.deleteItem(virtualIndex);
            } else {
                el.remove();
            }
        });
        var translate = '-100%';
        el.find('.swipeout-content').transform('translate3d(' + translate + ',0,0)');
    };
    return app;
};

},{}],96:[function(require,module,exports){
'use strict';

module.exports = function (app) {
    /*===========================
    Framework7 Swiper Additions
    ===========================*/
    app.initPageSwiper = function (pageContainer) {
        pageContainer = $(pageContainer);
        var swipers = pageContainer.find('.swiper-init, .tabs-swipeable-wrap');
        if (swipers.length === 0) return;
        function destroySwiperOnRemove(slider) {
            function destroySwiper() {
                slider.destroy();
                pageContainer.off('pageBeforeRemove', destroySwiper);
            }
            pageContainer.on('pageBeforeRemove', destroySwiper);
        }
        swipers.each(function () {
            var swiper = $(this);
            if (swiper.hasClass('tabs-swipeable-wrap')) {
                swiper.addClass('swiper-container').children('.tabs').addClass('swiper-wrapper').children('.tab').addClass('swiper-slide');
            }
            var params;
            if (swiper.data('swiper')) {
                params = JSON.parse(swiper.data('swiper'));
            } else {
                params = swiper.dataset();
            }
            if (swiper.hasClass('tabs-swipeable-wrap')) {
                params.onSlideChangeStart = function (s) {
                    app.showTab(s.slides.eq(s.activeIndex));
                };
            }
            var _slider = app.swiper(swiper[0], params);
            destroySwiperOnRemove(_slider);
        });
    };
    app.reinitPageSwiper = function (pageContainer) {
        pageContainer = $(pageContainer);
        var sliders = pageContainer.find('.swiper-init, .tabs-swipeable-wrap');
        if (sliders.length === 0) return;
        for (var i = 0; i < sliders.length; i++) {
            var sliderInstance = sliders[0].swiper;
            if (sliderInstance) {
                sliderInstance.update(true);
            }
        }
    };
    return app;
};

},{}],97:[function(require,module,exports){
'use strict';module.exports = function(app){ /*===========================
Swiper
===========================*/var Swiper=function Swiper(container,params){if(!(this instanceof Swiper))return new Swiper(container,params);var defaults={direction:'horizontal',touchEventsTarget:'container',initialSlide:0,speed:300, // autoplay
autoplay:false,autoplayDisableOnInteraction:true, // To support iOS's swipe-to-go-back gesture (when being used in-app, with UIWebView).
iOSEdgeSwipeDetection:false,iOSEdgeSwipeThreshold:20, // Free mode
freeMode:false,freeModeMomentum:true,freeModeMomentumRatio:1,freeModeMomentumBounce:true,freeModeMomentumBounceRatio:1,freeModeSticky:false,freeModeMinimumVelocity:0.02, // Autoheight
autoHeight:false, // Set wrapper width
setWrapperSize:false, // Virtual Translate
virtualTranslate:false, // Effects
effect:'slide', // 'slide' or 'fade' or 'cube' or 'coverflow'
coverflow:{rotate:50,stretch:0,depth:100,modifier:1,slideShadows:true},cube:{slideShadows:true,shadow:true,shadowOffset:20,shadowScale:0.94},fade:{crossFade:false}, // Parallax
parallax:false, // Scrollbar
scrollbar:null,scrollbarHide:true,scrollbarDraggable:false,scrollbarSnapOnRelease:false, // Keyboard Mousewheel
keyboardControl:false,mousewheelControl:false,mousewheelReleaseOnEdges:false,mousewheelInvert:false,mousewheelForceToAxis:false,mousewheelSensitivity:1, // Hash Navigation
hashnav:false, // Breakpoints
breakpoints:undefined, // Slides grid
spaceBetween:0,slidesPerView:1,slidesPerColumn:1,slidesPerColumnFill:'column',slidesPerGroup:1,centeredSlides:false,slidesOffsetBefore:0, // in px
slidesOffsetAfter:0, // in px
// Round length
roundLengths:false, // Touches
touchRatio:1,touchAngle:45,simulateTouch:true,shortSwipes:true,longSwipes:true,longSwipesRatio:0.5,longSwipesMs:300,followFinger:true,onlyExternal:false,threshold:0,touchMoveStopPropagation:true, // Pagination
pagination:null,paginationElement:'span',paginationClickable:false,paginationHide:false,paginationBulletRender:null, // Resistance
resistance:true,resistanceRatio:0.85, // Next/prev buttons
nextButton:null,prevButton:null, // Progress
watchSlidesProgress:false,watchSlidesVisibility:false, // Cursor
grabCursor:false, // Clicks
preventClicks:true,preventClicksPropagation:true,slideToClickedSlide:false, // Lazy Loading
lazyLoading:false,lazyLoadingInPrevNext:false,lazyLoadingOnTransitionStart:false, // Images
preloadImages:true,updateOnImagesReady:true, // loop
loop:false,loopAdditionalSlides:0,loopedSlides:null, // Control
control:undefined,controlInverse:false,controlBy:'slide', //or 'container'
// Swiping/no swiping
allowSwipeToPrev:true,allowSwipeToNext:true,swipeHandler:null, //'.swipe-handler',
noSwiping:true,noSwipingClass:'swiper-no-swiping', // NS
slideClass:'swiper-slide',slideActiveClass:'swiper-slide-active',slideVisibleClass:'swiper-slide-visible',slideDuplicateClass:'swiper-slide-duplicate',slideNextClass:'swiper-slide-next',slidePrevClass:'swiper-slide-prev',wrapperClass:'swiper-wrapper',bulletClass:'swiper-pagination-bullet',bulletActiveClass:'swiper-pagination-bullet-active',buttonDisabledClass:'swiper-button-disabled',paginationHiddenClass:'swiper-pagination-hidden', // Observer
observer:false,observeParents:false, // Accessibility
a11y:false,prevSlideMessage:'Previous slide',nextSlideMessage:'Next slide',firstSlideMessage:'This is the first slide',lastSlideMessage:'This is the last slide',paginationBulletMessage:'Go to slide {{index}}', // Callbacks
runCallbacksOnInit:true /*
        Callbacks:
        onInit: function (swiper)
        onDestroy: function (swiper)
        onClick: function (swiper, e)
        onTap: function (swiper, e)
        onDoubleTap: function (swiper, e)
        onSliderMove: function (swiper, e)
        onSlideChangeStart: function (swiper)
        onSlideChangeEnd: function (swiper)
        onTransitionStart: function (swiper)
        onTransitionEnd: function (swiper)
        onImagesReady: function (swiper)
        onProgress: function (swiper, progress)
        onTouchStart: function (swiper, e)
        onTouchMove: function (swiper, e)
        onTouchMoveOpposite: function (swiper, e)
        onTouchEnd: function (swiper, e)
        onReachBeginning: function (swiper)
        onReachEnd: function (swiper)
        onSetTransition: function (swiper, duration)
        onSetTranslate: function (swiper, translate)
        onAutoplayStart: function (swiper)
        onAutoplayStop: function (swiper),
        onLazyImageLoad: function (swiper, slide, image)
        onLazyImageReady: function (swiper, slide, image)
        */};var initialVirtualTranslate=params && params.virtualTranslate;params = params || {};var originalParams={};for(var param in params) {if(typeof params[param] === 'object' && !(params[param].nodeType || params[param] === window || params[param] === document || typeof Dom7 !== 'undefined' && params[param] instanceof Dom7 || typeof jQuery !== 'undefined' && params[param] instanceof jQuery)){originalParams[param] = {};for(var deepParam in params[param]) {originalParams[param][deepParam] = params[param][deepParam];}}else {originalParams[param] = params[param];}}for(var def in defaults) {if(typeof params[def] === 'undefined'){params[def] = defaults[def];}else if(typeof params[def] === 'object'){for(var deepDef in defaults[def]) {if(typeof params[def][deepDef] === 'undefined'){params[def][deepDef] = defaults[def][deepDef];}}}} // Swiper
var s=this; // Params
s.params = params;s.originalParams = originalParams; // Classname
s.classNames = []; /*=========================
      Dom Library and plugins
      ===========================*/if(typeof $ !== 'undefined' && typeof Dom7 !== 'undefined'){$ = Dom7;}if(typeof $ === 'undefined'){if(typeof Dom7 === 'undefined'){$ = window.Dom7 || window.Zepto || window.jQuery;}else {$ = Dom7;}if(!$)return;} // Export it to Swiper instance
s.$ = $; /*=========================
      Breakpoints
      ===========================*/s.currentBreakpoint = undefined;s.getActiveBreakpoint = function(){ //Get breakpoint for window width
if(!s.params.breakpoints)return false;var breakpoint=false;var points=[],point;for(point in s.params.breakpoints) {if(s.params.breakpoints.hasOwnProperty(point)){points.push(point);}}points.sort(function(a,b){return parseInt(a,10) > parseInt(b,10);});for(var i=0;i < points.length;i++) {point = points[i];if(point >= window.innerWidth && !breakpoint){breakpoint = point;}}return breakpoint || 'max';};s.setBreakpoint = function(){ //Set breakpoint for window width and update parameters
var breakpoint=s.getActiveBreakpoint();if(breakpoint && s.currentBreakpoint !== breakpoint){var breakPointsParams=breakpoint in s.params.breakpoints?s.params.breakpoints[breakpoint]:s.originalParams;for(var param in breakPointsParams) {s.params[param] = breakPointsParams[param];}s.currentBreakpoint = breakpoint;}}; // Set breakpoint on load
if(s.params.breakpoints){s.setBreakpoint();} /*=========================
      Preparation - Define Container, Wrapper and Pagination
      ===========================*/s.container = $(container);if(s.container.length === 0)return;if(s.container.length > 1){s.container.each(function(){new Swiper(this,params);});return;} // Save instance in container HTML Element and in data
s.container[0].swiper = s;s.container.data('swiper',s);s.classNames.push('swiper-container-' + s.params.direction);if(s.params.freeMode){s.classNames.push('swiper-container-free-mode');}if(!s.support.flexbox){s.classNames.push('swiper-container-no-flexbox');s.params.slidesPerColumn = 1;}if(s.params.autoHeight){s.classNames.push('swiper-container-autoheight');} // Enable slides progress when required
if(s.params.parallax || s.params.watchSlidesVisibility){s.params.watchSlidesProgress = true;} // Coverflow / 3D
if(['cube','coverflow'].indexOf(s.params.effect) >= 0){if(s.support.transforms3d){s.params.watchSlidesProgress = true;s.classNames.push('swiper-container-3d');}else {s.params.effect = 'slide';}}if(s.params.effect !== 'slide'){s.classNames.push('swiper-container-' + s.params.effect);}if(s.params.effect === 'cube'){s.params.resistanceRatio = 0;s.params.slidesPerView = 1;s.params.slidesPerColumn = 1;s.params.slidesPerGroup = 1;s.params.centeredSlides = false;s.params.spaceBetween = 0;s.params.virtualTranslate = true;s.params.setWrapperSize = false;}if(s.params.effect === 'fade'){s.params.slidesPerView = 1;s.params.slidesPerColumn = 1;s.params.slidesPerGroup = 1;s.params.watchSlidesProgress = true;s.params.spaceBetween = 0;if(typeof initialVirtualTranslate === 'undefined'){s.params.virtualTranslate = true;}} // Grab Cursor
if(s.params.grabCursor && s.support.touch){s.params.grabCursor = false;} // Wrapper
s.wrapper = s.container.children('.' + s.params.wrapperClass); // Pagination
if(s.params.pagination){s.paginationContainer = $(s.params.pagination);if(s.params.paginationClickable){s.paginationContainer.addClass('swiper-pagination-clickable');}} // Is Horizontal
function isH(){return s.params.direction === 'horizontal';} // RTL
s.rtl = isH() && (s.container[0].dir.toLowerCase() === 'rtl' || s.container.css('direction') === 'rtl');if(s.rtl){s.classNames.push('swiper-container-rtl');} // Wrong RTL support
if(s.rtl){s.wrongRTL = s.wrapper.css('display') === '-webkit-box';} // Columns
if(s.params.slidesPerColumn > 1){s.classNames.push('swiper-container-multirow');} // Check for Android
if(s.device.android){s.classNames.push('swiper-container-android');} // Add classes
s.container.addClass(s.classNames.join(' ')); // Translate
s.translate = 0; // Progress
s.progress = 0; // Velocity
s.velocity = 0; /*=========================
      Locks, unlocks
      ===========================*/s.lockSwipeToNext = function(){s.params.allowSwipeToNext = false;};s.lockSwipeToPrev = function(){s.params.allowSwipeToPrev = false;};s.lockSwipes = function(){s.params.allowSwipeToNext = s.params.allowSwipeToPrev = false;};s.unlockSwipeToNext = function(){s.params.allowSwipeToNext = true;};s.unlockSwipeToPrev = function(){s.params.allowSwipeToPrev = true;};s.unlockSwipes = function(){s.params.allowSwipeToNext = s.params.allowSwipeToPrev = true;}; /*=========================
      Round helper
      ===========================*/function round(a){return Math.floor(a);} /*=========================
      Set grab cursor
      ===========================*/if(s.params.grabCursor){s.container[0].style.cursor = 'move';s.container[0].style.cursor = '-webkit-grab';s.container[0].style.cursor = '-moz-grab';s.container[0].style.cursor = 'grab';} /*=========================
      Update on Images Ready
      ===========================*/s.imagesToLoad = [];s.imagesLoaded = 0;s.loadImage = function(imgElement,src,srcset,checkForComplete,callback){var image;function onReady(){if(callback)callback();}if(!imgElement.complete || !checkForComplete){if(src){image = new window.Image();image.onload = onReady;image.onerror = onReady;if(srcset){image.srcset = srcset;}if(src){image.src = src;}}else {onReady();}}else { //image already loaded...
onReady();}};s.preloadImages = function(){s.imagesToLoad = s.container.find('img');function _onReady(){if(typeof s === 'undefined' || s === null)return;if(s.imagesLoaded !== undefined)s.imagesLoaded++;if(s.imagesLoaded === s.imagesToLoad.length){if(s.params.updateOnImagesReady)s.update();s.emit('onImagesReady',s);}}for(var i=0;i < s.imagesToLoad.length;i++) {s.loadImage(s.imagesToLoad[i],s.imagesToLoad[i].currentSrc || s.imagesToLoad[i].getAttribute('src'),s.imagesToLoad[i].srcset || s.imagesToLoad[i].getAttribute('srcset'),true,_onReady);}}; /*=========================
      Autoplay
      ===========================*/s.autoplayTimeoutId = undefined;s.autoplaying = false;s.autoplayPaused = false;function autoplay(){s.autoplayTimeoutId = setTimeout(function(){if(s.params.loop){s.fixLoop();s._slideNext();}else {if(!s.isEnd){s._slideNext();}else {if(!params.autoplayStopOnLast){s._slideTo(0);}else {s.stopAutoplay();}}}},s.params.autoplay);}s.startAutoplay = function(){if(typeof s.autoplayTimeoutId !== 'undefined')return false;if(!s.params.autoplay)return false;if(s.autoplaying)return false;s.autoplaying = true;s.emit('onAutoplayStart',s);autoplay();};s.stopAutoplay = function(internal){if(!s.autoplayTimeoutId)return;if(s.autoplayTimeoutId)clearTimeout(s.autoplayTimeoutId);s.autoplaying = false;s.autoplayTimeoutId = undefined;s.emit('onAutoplayStop',s);};s.pauseAutoplay = function(speed){if(s.autoplayPaused)return;if(s.autoplayTimeoutId)clearTimeout(s.autoplayTimeoutId);s.autoplayPaused = true;if(speed === 0){s.autoplayPaused = false;autoplay();}else {s.wrapper.transitionEnd(function(){if(!s)return;s.autoplayPaused = false;if(!s.autoplaying){s.stopAutoplay();}else {autoplay();}});}}; /*=========================
      Min/Max Translate
      ===========================*/s.minTranslate = function(){return -s.snapGrid[0];};s.maxTranslate = function(){return -s.snapGrid[s.snapGrid.length - 1];}; /*=========================
      Slider/slides sizes
      ===========================*/s.updateAutoHeight = function(){ // Update Height
var newHeight=s.slides.eq(s.activeIndex)[0].offsetHeight;if(newHeight)s.wrapper.css('height',s.slides.eq(s.activeIndex)[0].offsetHeight + 'px');};s.updateContainerSize = function(){var width,height;if(typeof s.params.width !== 'undefined'){width = s.params.width;}else {width = s.container[0].clientWidth;}if(typeof s.params.height !== 'undefined'){height = s.params.height;}else {height = s.container[0].clientHeight;}if(width === 0 && isH() || height === 0 && !isH()){return;} //Subtract paddings
width = width - parseInt(s.container.css('padding-left'),10) - parseInt(s.container.css('padding-right'),10);height = height - parseInt(s.container.css('padding-top'),10) - parseInt(s.container.css('padding-bottom'),10); // Store values
s.width = width;s.height = height;s.size = isH()?s.width:s.height;};s.updateSlidesSize = function(){s.slides = s.wrapper.children('.' + s.params.slideClass);s.snapGrid = [];s.slidesGrid = [];s.slidesSizesGrid = [];var spaceBetween=s.params.spaceBetween,slidePosition=-s.params.slidesOffsetBefore,i,prevSlideSize=0,index=0;if(typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0){spaceBetween = parseFloat(spaceBetween.replace('%','')) / 100 * s.size;}s.virtualSize = -spaceBetween; // reset margins
if(s.rtl)s.slides.css({marginLeft:'',marginTop:''});else s.slides.css({marginRight:'',marginBottom:''});var slidesNumberEvenToRows;if(s.params.slidesPerColumn > 1){if(Math.floor(s.slides.length / s.params.slidesPerColumn) === s.slides.length / s.params.slidesPerColumn){slidesNumberEvenToRows = s.slides.length;}else {slidesNumberEvenToRows = Math.ceil(s.slides.length / s.params.slidesPerColumn) * s.params.slidesPerColumn;}if(s.params.slidesPerView !== 'auto' && s.params.slidesPerColumnFill === 'row'){slidesNumberEvenToRows = Math.max(slidesNumberEvenToRows,s.params.slidesPerView * s.params.slidesPerColumn);}} // Calc slides
var slideSize;var slidesPerColumn=s.params.slidesPerColumn;var slidesPerRow=slidesNumberEvenToRows / slidesPerColumn;var numFullColumns=slidesPerRow - (s.params.slidesPerColumn * slidesPerRow - s.slides.length);for(i = 0;i < s.slides.length;i++) {slideSize = 0;var slide=s.slides.eq(i);if(s.params.slidesPerColumn > 1){ // Set slides order
var newSlideOrderIndex;var column,row;if(s.params.slidesPerColumnFill === 'column'){column = Math.floor(i / slidesPerColumn);row = i - column * slidesPerColumn;if(column > numFullColumns || column === numFullColumns && row === slidesPerColumn - 1){if(++row >= slidesPerColumn){row = 0;column++;}}newSlideOrderIndex = column + row * slidesNumberEvenToRows / slidesPerColumn;slide.css({'-webkit-box-ordinal-group':newSlideOrderIndex,'-moz-box-ordinal-group':newSlideOrderIndex,'-ms-flex-order':newSlideOrderIndex,'-webkit-order':newSlideOrderIndex,'order':newSlideOrderIndex});}else {row = Math.floor(i / slidesPerRow);column = i - row * slidesPerRow;}slide.css({'margin-top':row !== 0 && s.params.spaceBetween && s.params.spaceBetween + 'px'}).attr('data-swiper-column',column).attr('data-swiper-row',row);}if(slide.css('display') === 'none')continue;if(s.params.slidesPerView === 'auto'){slideSize = isH()?slide.outerWidth(true):slide.outerHeight(true);if(s.params.roundLengths)slideSize = round(slideSize);}else {slideSize = (s.size - (s.params.slidesPerView - 1) * spaceBetween) / s.params.slidesPerView;if(s.params.roundLengths)slideSize = round(slideSize);if(isH()){s.slides[i].style.width = slideSize + 'px';}else {s.slides[i].style.height = slideSize + 'px';}}s.slides[i].swiperSlideSize = slideSize;s.slidesSizesGrid.push(slideSize);if(s.params.centeredSlides){slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;if(i === 0)slidePosition = slidePosition - s.size / 2 - spaceBetween;if(Math.abs(slidePosition) < 1 / 1000)slidePosition = 0;if(index % s.params.slidesPerGroup === 0)s.snapGrid.push(slidePosition);s.slidesGrid.push(slidePosition);}else {if(index % s.params.slidesPerGroup === 0)s.snapGrid.push(slidePosition);s.slidesGrid.push(slidePosition);slidePosition = slidePosition + slideSize + spaceBetween;}s.virtualSize += slideSize + spaceBetween;prevSlideSize = slideSize;index++;}s.virtualSize = Math.max(s.virtualSize,s.size) + s.params.slidesOffsetAfter;var newSlidesGrid;if(s.rtl && s.wrongRTL && (s.params.effect === 'slide' || s.params.effect === 'coverflow')){s.wrapper.css({width:s.virtualSize + s.params.spaceBetween + 'px'});}if(!s.support.flexbox || s.params.setWrapperSize){if(isH())s.wrapper.css({width:s.virtualSize + s.params.spaceBetween + 'px'});else s.wrapper.css({height:s.virtualSize + s.params.spaceBetween + 'px'});}if(s.params.slidesPerColumn > 1){s.virtualSize = (slideSize + s.params.spaceBetween) * slidesNumberEvenToRows;s.virtualSize = Math.ceil(s.virtualSize / s.params.slidesPerColumn) - s.params.spaceBetween;s.wrapper.css({width:s.virtualSize + s.params.spaceBetween + 'px'});if(s.params.centeredSlides){newSlidesGrid = [];for(i = 0;i < s.snapGrid.length;i++) {if(s.snapGrid[i] < s.virtualSize + s.snapGrid[0])newSlidesGrid.push(s.snapGrid[i]);}s.snapGrid = newSlidesGrid;}} // Remove last grid elements depending on width
if(!s.params.centeredSlides){newSlidesGrid = [];for(i = 0;i < s.snapGrid.length;i++) {if(s.snapGrid[i] <= s.virtualSize - s.size){newSlidesGrid.push(s.snapGrid[i]);}}s.snapGrid = newSlidesGrid;if(Math.floor(s.virtualSize - s.size) > Math.floor(s.snapGrid[s.snapGrid.length - 1])){s.snapGrid.push(s.virtualSize - s.size);}}if(s.snapGrid.length === 0)s.snapGrid = [0];if(s.params.spaceBetween !== 0){if(isH()){if(s.rtl)s.slides.css({marginLeft:spaceBetween + 'px'});else s.slides.css({marginRight:spaceBetween + 'px'});}else s.slides.css({marginBottom:spaceBetween + 'px'});}if(s.params.watchSlidesProgress){s.updateSlidesOffset();}};s.updateSlidesOffset = function(){for(var i=0;i < s.slides.length;i++) {s.slides[i].swiperSlideOffset = isH()?s.slides[i].offsetLeft:s.slides[i].offsetTop;}}; /*=========================
      Slider/slides progress
      ===========================*/s.updateSlidesProgress = function(translate){if(typeof translate === 'undefined'){translate = s.translate || 0;}if(s.slides.length === 0)return;if(typeof s.slides[0].swiperSlideOffset === 'undefined')s.updateSlidesOffset();var offsetCenter=-translate;if(s.rtl)offsetCenter = translate; // Visible Slides
s.slides.removeClass(s.params.slideVisibleClass);for(var i=0;i < s.slides.length;i++) {var slide=s.slides[i];var slideProgress=(offsetCenter - slide.swiperSlideOffset) / (slide.swiperSlideSize + s.params.spaceBetween);if(s.params.watchSlidesVisibility){var slideBefore=-(offsetCenter - slide.swiperSlideOffset);var slideAfter=slideBefore + s.slidesSizesGrid[i];var isVisible=slideBefore >= 0 && slideBefore < s.size || slideAfter > 0 && slideAfter <= s.size || slideBefore <= 0 && slideAfter >= s.size;if(isVisible){s.slides.eq(i).addClass(s.params.slideVisibleClass);}}slide.progress = s.rtl?-slideProgress:slideProgress;}};s.updateProgress = function(translate){if(typeof translate === 'undefined'){translate = s.translate || 0;}var translatesDiff=s.maxTranslate() - s.minTranslate();var wasBeginning=s.isBeginning;var wasEnd=s.isEnd;if(translatesDiff === 0){s.progress = 0;s.isBeginning = s.isEnd = true;}else {s.progress = (translate - s.minTranslate()) / translatesDiff;s.isBeginning = s.progress <= 0;s.isEnd = s.progress >= 1;}if(s.isBeginning && !wasBeginning)s.emit('onReachBeginning',s);if(s.isEnd && !wasEnd)s.emit('onReachEnd',s);if(s.params.watchSlidesProgress)s.updateSlidesProgress(translate);s.emit('onProgress',s,s.progress);};s.updateActiveIndex = function(){var translate=s.rtl?s.translate:-s.translate;var newActiveIndex,i,snapIndex;for(i = 0;i < s.slidesGrid.length;i++) {if(typeof s.slidesGrid[i + 1] !== 'undefined'){if(translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1] - (s.slidesGrid[i + 1] - s.slidesGrid[i]) / 2){newActiveIndex = i;}else if(translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1]){newActiveIndex = i + 1;}}else {if(translate >= s.slidesGrid[i]){newActiveIndex = i;}}} // Normalize slideIndex
if(newActiveIndex < 0 || typeof newActiveIndex === 'undefined')newActiveIndex = 0; // for (i = 0; i < s.slidesGrid.length; i++) {
// if (- translate >= s.slidesGrid[i]) {
// newActiveIndex = i;
// }
// }
snapIndex = Math.floor(newActiveIndex / s.params.slidesPerGroup);if(snapIndex >= s.snapGrid.length)snapIndex = s.snapGrid.length - 1;if(newActiveIndex === s.activeIndex){return;}s.snapIndex = snapIndex;s.previousIndex = s.activeIndex;s.activeIndex = newActiveIndex;s.updateClasses();}; /*=========================
      Classes
      ===========================*/s.updateClasses = function(){s.slides.removeClass(s.params.slideActiveClass + ' ' + s.params.slideNextClass + ' ' + s.params.slidePrevClass);var activeSlide=s.slides.eq(s.activeIndex); // Active classes
activeSlide.addClass(s.params.slideActiveClass);activeSlide.next('.' + s.params.slideClass).addClass(s.params.slideNextClass);activeSlide.prev('.' + s.params.slideClass).addClass(s.params.slidePrevClass); // Pagination
if(s.bullets && s.bullets.length > 0){s.bullets.removeClass(s.params.bulletActiveClass);var bulletIndex;if(s.params.loop){bulletIndex = Math.ceil(s.activeIndex - s.loopedSlides) / s.params.slidesPerGroup;if(bulletIndex > s.slides.length - 1 - s.loopedSlides * 2){bulletIndex = bulletIndex - (s.slides.length - s.loopedSlides * 2);}if(bulletIndex > s.bullets.length - 1)bulletIndex = bulletIndex - s.bullets.length;}else {if(typeof s.snapIndex !== 'undefined'){bulletIndex = s.snapIndex;}else {bulletIndex = s.activeIndex || 0;}}if(s.paginationContainer.length > 1){s.bullets.each(function(){if($(this).index() === bulletIndex)$(this).addClass(s.params.bulletActiveClass);});}else {s.bullets.eq(bulletIndex).addClass(s.params.bulletActiveClass);}} // Next/active buttons
if(!s.params.loop){if(s.params.prevButton){if(s.isBeginning){$(s.params.prevButton).addClass(s.params.buttonDisabledClass);if(s.params.a11y && s.a11y)s.a11y.disable($(s.params.prevButton));}else {$(s.params.prevButton).removeClass(s.params.buttonDisabledClass);if(s.params.a11y && s.a11y)s.a11y.enable($(s.params.prevButton));}}if(s.params.nextButton){if(s.isEnd){$(s.params.nextButton).addClass(s.params.buttonDisabledClass);if(s.params.a11y && s.a11y)s.a11y.disable($(s.params.nextButton));}else {$(s.params.nextButton).removeClass(s.params.buttonDisabledClass);if(s.params.a11y && s.a11y)s.a11y.enable($(s.params.nextButton));}}}}; /*=========================
      Pagination
      ===========================*/s.updatePagination = function(){if(!s.params.pagination)return;if(s.paginationContainer && s.paginationContainer.length > 0){var bulletsHTML='';var numberOfBullets=s.params.loop?Math.ceil((s.slides.length - s.loopedSlides * 2) / s.params.slidesPerGroup):s.snapGrid.length;for(var i=0;i < numberOfBullets;i++) {if(s.params.paginationBulletRender){bulletsHTML += s.params.paginationBulletRender(i,s.params.bulletClass);}else {bulletsHTML += '<' + s.params.paginationElement + ' class="' + s.params.bulletClass + '"></' + s.params.paginationElement + '>';}}s.paginationContainer.html(bulletsHTML);s.bullets = s.paginationContainer.find('.' + s.params.bulletClass);if(s.params.paginationClickable && s.params.a11y && s.a11y){s.a11y.initPagination();}}}; /*=========================
      Common update method
      ===========================*/s.update = function(updateTranslate){s.updateContainerSize();s.updateSlidesSize();s.updateProgress();s.updatePagination();s.updateClasses();if(s.params.scrollbar && s.scrollbar){s.scrollbar.set();}function forceSetTranslate(){newTranslate = Math.min(Math.max(s.translate,s.maxTranslate()),s.minTranslate());s.setWrapperTranslate(newTranslate);s.updateActiveIndex();s.updateClasses();}if(updateTranslate){var translated,newTranslate;if(s.controller && s.controller.spline){s.controller.spline = undefined;}if(s.params.freeMode){forceSetTranslate();if(s.params.autoHeight){s.updateAutoHeight();}}else {if((s.params.slidesPerView === 'auto' || s.params.slidesPerView > 1) && s.isEnd && !s.params.centeredSlides){translated = s.slideTo(s.slides.length - 1,0,false,true);}else {translated = s.slideTo(s.activeIndex,0,false,true);}if(!translated){forceSetTranslate();}}}else if(s.params.autoHeight){s.updateAutoHeight();}}; /*=========================
      Resize Handler
      ===========================*/s.onResize = function(forceUpdatePagination){ //Breakpoints
if(s.params.breakpoints){s.setBreakpoint();} // Disable locks on resize
var allowSwipeToPrev=s.params.allowSwipeToPrev;var allowSwipeToNext=s.params.allowSwipeToNext;s.params.allowSwipeToPrev = s.params.allowSwipeToNext = true;s.updateContainerSize();s.updateSlidesSize();if(s.params.slidesPerView === 'auto' || s.params.freeMode || forceUpdatePagination)s.updatePagination();if(s.params.scrollbar && s.scrollbar){s.scrollbar.set();}if(s.controller && s.controller.spline){s.controller.spline = undefined;}if(s.params.freeMode){var newTranslate=Math.min(Math.max(s.translate,s.maxTranslate()),s.minTranslate());s.setWrapperTranslate(newTranslate);s.updateActiveIndex();s.updateClasses();if(s.params.autoHeight){s.updateAutoHeight();}}else {s.updateClasses();if((s.params.slidesPerView === 'auto' || s.params.slidesPerView > 1) && s.isEnd && !s.params.centeredSlides){s.slideTo(s.slides.length - 1,0,false,true);}else {s.slideTo(s.activeIndex,0,false,true);}} // Return locks after resize
s.params.allowSwipeToPrev = allowSwipeToPrev;s.params.allowSwipeToNext = allowSwipeToNext;}; /*=========================
      Events
      ===========================*/ //Define Touch Events
var desktopEvents=['mousedown','mousemove','mouseup'];if(window.navigator.pointerEnabled)desktopEvents = ['pointerdown','pointermove','pointerup'];else if(window.navigator.msPointerEnabled)desktopEvents = ['MSPointerDown','MSPointerMove','MSPointerUp'];s.touchEvents = {start:s.support.touch || !s.params.simulateTouch?'touchstart':desktopEvents[0],move:s.support.touch || !s.params.simulateTouch?'touchmove':desktopEvents[1],end:s.support.touch || !s.params.simulateTouch?'touchend':desktopEvents[2]}; // WP8 Touch Events Fix
if(window.navigator.pointerEnabled || window.navigator.msPointerEnabled){(s.params.touchEventsTarget === 'container'?s.container:s.wrapper).addClass('swiper-wp8-' + s.params.direction);} // Attach/detach events
s.initEvents = function(detach){var actionDom=detach?'off':'on';var action=detach?'removeEventListener':'addEventListener';var touchEventsTarget=s.params.touchEventsTarget === 'container'?s.container[0]:s.wrapper[0];var target=s.support.touch?touchEventsTarget:document;var moveCapture=s.params.nested?true:false; //Touch Events
if(s.browser.ie){touchEventsTarget[action](s.touchEvents.start,s.onTouchStart,false);target[action](s.touchEvents.move,s.onTouchMove,moveCapture);target[action](s.touchEvents.end,s.onTouchEnd,false);}else {if(s.support.touch){touchEventsTarget[action](s.touchEvents.start,s.onTouchStart,false);touchEventsTarget[action](s.touchEvents.move,s.onTouchMove,moveCapture);touchEventsTarget[action](s.touchEvents.end,s.onTouchEnd,false);}if(params.simulateTouch && !s.device.ios && !s.device.android){touchEventsTarget[action]('mousedown',s.onTouchStart,false);document[action]('mousemove',s.onTouchMove,moveCapture);document[action]('mouseup',s.onTouchEnd,false);}}window[action]('resize',s.onResize); // Next, Prev, Index
if(s.params.nextButton){$(s.params.nextButton)[actionDom]('click',s.onClickNext);if(s.params.a11y && s.a11y)$(s.params.nextButton)[actionDom]('keydown',s.a11y.onEnterKey);}if(s.params.prevButton){$(s.params.prevButton)[actionDom]('click',s.onClickPrev);if(s.params.a11y && s.a11y)$(s.params.prevButton)[actionDom]('keydown',s.a11y.onEnterKey);}if(s.params.pagination && s.params.paginationClickable){$(s.paginationContainer)[actionDom]('click','.' + s.params.bulletClass,s.onClickIndex);if(s.params.a11y && s.a11y)$(s.paginationContainer)[actionDom]('keydown','.' + s.params.bulletClass,s.a11y.onEnterKey);} // Prevent Links Clicks
if(s.params.preventClicks || s.params.preventClicksPropagation)touchEventsTarget[action]('click',s.preventClicks,true);};s.attachEvents = function(detach){s.initEvents();};s.detachEvents = function(){s.initEvents(true);}; /*=========================
      Handle Clicks
      ===========================*/ // Prevent Clicks
s.allowClick = true;s.preventClicks = function(e){if(!s.allowClick){if(s.params.preventClicks)e.preventDefault();if(s.params.preventClicksPropagation && s.animating){e.stopPropagation();e.stopImmediatePropagation();}}}; // Clicks
s.onClickNext = function(e){e.preventDefault();if(s.isEnd && !s.params.loop)return;s.slideNext();};s.onClickPrev = function(e){e.preventDefault();if(s.isBeginning && !s.params.loop)return;s.slidePrev();};s.onClickIndex = function(e){e.preventDefault();var index=$(this).index() * s.params.slidesPerGroup;if(s.params.loop)index = index + s.loopedSlides;s.slideTo(index);}; /*=========================
      Handle Touches
      ===========================*/function findElementInEvent(e,selector){var el=$(e.target);if(!el.is(selector)){if(typeof selector === 'string'){el = el.parents(selector);}else if(selector.nodeType){var found;el.parents().each(function(index,_el){if(_el === selector)found = selector;});if(!found)return undefined;else return selector;}}if(el.length === 0){return undefined;}return el[0];}s.updateClickedSlide = function(e){var slide=findElementInEvent(e,'.' + s.params.slideClass);var slideFound=false;if(slide){for(var i=0;i < s.slides.length;i++) {if(s.slides[i] === slide)slideFound = true;}}if(slide && slideFound){s.clickedSlide = slide;s.clickedIndex = $(slide).index();}else {s.clickedSlide = undefined;s.clickedIndex = undefined;return;}if(s.params.slideToClickedSlide && s.clickedIndex !== undefined && s.clickedIndex !== s.activeIndex){var slideToIndex=s.clickedIndex,realIndex,duplicatedSlides;if(s.params.loop){if(s.animating)return;realIndex = $(s.clickedSlide).attr('data-swiper-slide-index');if(s.params.centeredSlides){if(slideToIndex < s.loopedSlides - s.params.slidesPerView / 2 || slideToIndex > s.slides.length - s.loopedSlides + s.params.slidesPerView / 2){s.fixLoop();slideToIndex = s.wrapper.children('.' + s.params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]:not(.swiper-slide-duplicate)').eq(0).index();setTimeout(function(){s.slideTo(slideToIndex);},0);}else {s.slideTo(slideToIndex);}}else {if(slideToIndex > s.slides.length - s.params.slidesPerView){s.fixLoop();slideToIndex = s.wrapper.children('.' + s.params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]:not(.swiper-slide-duplicate)').eq(0).index();setTimeout(function(){s.slideTo(slideToIndex);},0);}else {s.slideTo(slideToIndex);}}}else {s.slideTo(slideToIndex);}}};var isTouched,isMoved,allowTouchCallbacks,touchStartTime,isScrolling,currentTranslate,startTranslate,allowThresholdMove, // Form elements to match
formElements='input, select, textarea, button', // Last click time
lastClickTime=Date.now(),clickTimeout, //Velocities
velocities=[],allowMomentumBounce; // Animating Flag
s.animating = false; // Touches information
s.touches = {startX:0,startY:0,currentX:0,currentY:0,diff:0}; // Touch handlers
var isTouchEvent,startMoving;s.onTouchStart = function(e){if(e.originalEvent)e = e.originalEvent;isTouchEvent = e.type === 'touchstart';if(!isTouchEvent && 'which' in e && e.which === 3)return;if(s.params.noSwiping && findElementInEvent(e,'.' + s.params.noSwipingClass)){s.allowClick = true;return;}if(s.params.swipeHandler){if(!findElementInEvent(e,s.params.swipeHandler))return;}var startX=s.touches.currentX = e.type === 'touchstart'?e.targetTouches[0].pageX:e.pageX;var startY=s.touches.currentY = e.type === 'touchstart'?e.targetTouches[0].pageY:e.pageY; // Do NOT start if iOS edge swipe is detected. Otherwise iOS app (UIWebView) cannot swipe-to-go-back anymore
if(s.device.ios && s.params.iOSEdgeSwipeDetection && startX <= s.params.iOSEdgeSwipeThreshold){return;}isTouched = true;isMoved = false;allowTouchCallbacks = true;isScrolling = undefined;startMoving = undefined;s.touches.startX = startX;s.touches.startY = startY;touchStartTime = Date.now();s.allowClick = true;s.updateContainerSize();s.swipeDirection = undefined;if(s.params.threshold > 0)allowThresholdMove = false;if(e.type !== 'touchstart'){var preventDefault=true;if($(e.target).is(formElements))preventDefault = false;if(document.activeElement && $(document.activeElement).is(formElements)){document.activeElement.blur();}if(preventDefault){e.preventDefault();}}s.emit('onTouchStart',s,e);};s.onTouchMove = function(e){if(e.originalEvent)e = e.originalEvent;if(isTouchEvent && e.type === 'mousemove')return;if(e.preventedByNestedSwiper)return;if(s.params.onlyExternal){ // isMoved = true;
s.allowClick = false;if(isTouched){s.touches.startX = s.touches.currentX = e.type === 'touchmove'?e.targetTouches[0].pageX:e.pageX;s.touches.startY = s.touches.currentY = e.type === 'touchmove'?e.targetTouches[0].pageY:e.pageY;touchStartTime = Date.now();}return;}if(isTouchEvent && document.activeElement){if(e.target === document.activeElement && $(e.target).is(formElements)){isMoved = true;s.allowClick = false;return;}}if(allowTouchCallbacks){s.emit('onTouchMove',s,e);}if(e.targetTouches && e.targetTouches.length > 1)return;s.touches.currentX = e.type === 'touchmove'?e.targetTouches[0].pageX:e.pageX;s.touches.currentY = e.type === 'touchmove'?e.targetTouches[0].pageY:e.pageY;if(typeof isScrolling === 'undefined'){var touchAngle=Math.atan2(Math.abs(s.touches.currentY - s.touches.startY),Math.abs(s.touches.currentX - s.touches.startX)) * 180 / Math.PI;isScrolling = isH()?touchAngle > s.params.touchAngle:90 - touchAngle > s.params.touchAngle;}if(isScrolling){s.emit('onTouchMoveOpposite',s,e);}if(typeof startMoving === 'undefined' && s.browser.ieTouch){if(s.touches.currentX !== s.touches.startX || s.touches.currentY !== s.touches.startY){startMoving = true;}}if(!isTouched)return;if(isScrolling){isTouched = false;return;}if(!startMoving && s.browser.ieTouch){return;}s.allowClick = false;s.emit('onSliderMove',s,e);e.preventDefault();if(s.params.touchMoveStopPropagation && !s.params.nested){e.stopPropagation();}if(!isMoved){if(params.loop){s.fixLoop();}startTranslate = s.getWrapperTranslate();s.setWrapperTransition(0);if(s.animating){s.wrapper.trigger('webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd');}if(s.params.autoplay && s.autoplaying){if(s.params.autoplayDisableOnInteraction){s.stopAutoplay();}else {s.pauseAutoplay();}}allowMomentumBounce = false; //Grab Cursor
if(s.params.grabCursor){s.container[0].style.cursor = 'move';s.container[0].style.cursor = '-webkit-grabbing';s.container[0].style.cursor = '-moz-grabbin';s.container[0].style.cursor = 'grabbing';}}isMoved = true;var diff=s.touches.diff = isH()?s.touches.currentX - s.touches.startX:s.touches.currentY - s.touches.startY;diff = diff * s.params.touchRatio;if(s.rtl)diff = -diff;s.swipeDirection = diff > 0?'prev':'next';currentTranslate = diff + startTranslate;var disableParentSwiper=true;if(diff > 0 && currentTranslate > s.minTranslate()){disableParentSwiper = false;if(s.params.resistance)currentTranslate = s.minTranslate() - 1 + Math.pow(-s.minTranslate() + startTranslate + diff,s.params.resistanceRatio);}else if(diff < 0 && currentTranslate < s.maxTranslate()){disableParentSwiper = false;if(s.params.resistance)currentTranslate = s.maxTranslate() + 1 - Math.pow(s.maxTranslate() - startTranslate - diff,s.params.resistanceRatio);}if(disableParentSwiper){e.preventedByNestedSwiper = true;} // Directions locks
if(!s.params.allowSwipeToNext && s.swipeDirection === 'next' && currentTranslate < startTranslate){currentTranslate = startTranslate;}if(!s.params.allowSwipeToPrev && s.swipeDirection === 'prev' && currentTranslate > startTranslate){currentTranslate = startTranslate;}if(!s.params.followFinger)return; // Threshold
if(s.params.threshold > 0){if(Math.abs(diff) > s.params.threshold || allowThresholdMove){if(!allowThresholdMove){allowThresholdMove = true;s.touches.startX = s.touches.currentX;s.touches.startY = s.touches.currentY;currentTranslate = startTranslate;s.touches.diff = isH()?s.touches.currentX - s.touches.startX:s.touches.currentY - s.touches.startY;return;}}else {currentTranslate = startTranslate;return;}} // Update active index in free mode
if(s.params.freeMode || s.params.watchSlidesProgress){s.updateActiveIndex();}if(s.params.freeMode){ //Velocity
if(velocities.length === 0){velocities.push({position:s.touches[isH()?'startX':'startY'],time:touchStartTime});}velocities.push({position:s.touches[isH()?'currentX':'currentY'],time:new window.Date().getTime()});} // Update progress
s.updateProgress(currentTranslate); // Update translate
s.setWrapperTranslate(currentTranslate);};s.onTouchEnd = function(e){if(e.originalEvent)e = e.originalEvent;if(allowTouchCallbacks){s.emit('onTouchEnd',s,e);}allowTouchCallbacks = false;if(!isTouched)return; //Return Grab Cursor
if(s.params.grabCursor && isMoved && isTouched){s.container[0].style.cursor = 'move';s.container[0].style.cursor = '-webkit-grab';s.container[0].style.cursor = '-moz-grab';s.container[0].style.cursor = 'grab';} // Time diff
var touchEndTime=Date.now();var timeDiff=touchEndTime - touchStartTime; // Tap, doubleTap, Click
if(s.allowClick){s.updateClickedSlide(e);s.emit('onTap',s,e);if(timeDiff < 300 && touchEndTime - lastClickTime > 300){if(clickTimeout)clearTimeout(clickTimeout);clickTimeout = setTimeout(function(){if(!s)return;if(s.params.paginationHide && s.paginationContainer.length > 0 && !$(e.target).hasClass(s.params.bulletClass)){s.paginationContainer.toggleClass(s.params.paginationHiddenClass);}s.emit('onClick',s,e);},300);}if(timeDiff < 300 && touchEndTime - lastClickTime < 300){if(clickTimeout)clearTimeout(clickTimeout);s.emit('onDoubleTap',s,e);}}lastClickTime = Date.now();setTimeout(function(){if(s)s.allowClick = true;},0);if(!isTouched || !isMoved || !s.swipeDirection || s.touches.diff === 0 || currentTranslate === startTranslate){isTouched = isMoved = false;return;}isTouched = isMoved = false;var currentPos;if(s.params.followFinger){currentPos = s.rtl?s.translate:-s.translate;}else {currentPos = -currentTranslate;}if(s.params.freeMode){if(currentPos < -s.minTranslate()){s.slideTo(s.activeIndex);return;}else if(currentPos > -s.maxTranslate()){if(s.slides.length < s.snapGrid.length){s.slideTo(s.snapGrid.length - 1);}else {s.slideTo(s.slides.length - 1);}return;}if(s.params.freeModeMomentum){if(velocities.length > 1){var lastMoveEvent=velocities.pop(),velocityEvent=velocities.pop();var distance=lastMoveEvent.position - velocityEvent.position;var time=lastMoveEvent.time - velocityEvent.time;s.velocity = distance / time;s.velocity = s.velocity / 2;if(Math.abs(s.velocity) < s.params.freeModeMinimumVelocity){s.velocity = 0;} // this implies that the user stopped moving a finger then released.
// There would be no events with distance zero, so the last event is stale.
if(time > 150 || new window.Date().getTime() - lastMoveEvent.time > 300){s.velocity = 0;}}else {s.velocity = 0;}velocities.length = 0;var momentumDuration=1000 * s.params.freeModeMomentumRatio;var momentumDistance=s.velocity * momentumDuration;var newPosition=s.translate + momentumDistance;if(s.rtl)newPosition = -newPosition;var doBounce=false;var afterBouncePosition;var bounceAmount=Math.abs(s.velocity) * 20 * s.params.freeModeMomentumBounceRatio;if(newPosition < s.maxTranslate()){if(s.params.freeModeMomentumBounce){if(newPosition + s.maxTranslate() < -bounceAmount){newPosition = s.maxTranslate() - bounceAmount;}afterBouncePosition = s.maxTranslate();doBounce = true;allowMomentumBounce = true;}else {newPosition = s.maxTranslate();}}else if(newPosition > s.minTranslate()){if(s.params.freeModeMomentumBounce){if(newPosition - s.minTranslate() > bounceAmount){newPosition = s.minTranslate() + bounceAmount;}afterBouncePosition = s.minTranslate();doBounce = true;allowMomentumBounce = true;}else {newPosition = s.minTranslate();}}else if(s.params.freeModeSticky){var j=0,nextSlide;for(j = 0;j < s.snapGrid.length;j += 1) {if(s.snapGrid[j] > -newPosition){nextSlide = j;break;}}if(Math.abs(s.snapGrid[nextSlide] - newPosition) < Math.abs(s.snapGrid[nextSlide - 1] - newPosition) || s.swipeDirection === 'next'){newPosition = s.snapGrid[nextSlide];}else {newPosition = s.snapGrid[nextSlide - 1];}if(!s.rtl)newPosition = -newPosition;} //Fix duration
if(s.velocity !== 0){if(s.rtl){momentumDuration = Math.abs((-newPosition - s.translate) / s.velocity);}else {momentumDuration = Math.abs((newPosition - s.translate) / s.velocity);}}else if(s.params.freeModeSticky){s.slideReset();return;}if(s.params.freeModeMomentumBounce && doBounce){s.updateProgress(afterBouncePosition);s.setWrapperTransition(momentumDuration);s.setWrapperTranslate(newPosition);s.onTransitionStart();s.animating = true;s.wrapper.transitionEnd(function(){if(!s || !allowMomentumBounce)return;s.emit('onMomentumBounce',s);s.setWrapperTransition(s.params.speed);s.setWrapperTranslate(afterBouncePosition);s.wrapper.transitionEnd(function(){if(!s)return;s.onTransitionEnd();});});}else if(s.velocity){s.updateProgress(newPosition);s.setWrapperTransition(momentumDuration);s.setWrapperTranslate(newPosition);s.onTransitionStart();if(!s.animating){s.animating = true;s.wrapper.transitionEnd(function(){if(!s)return;s.onTransitionEnd();});}}else {s.updateProgress(newPosition);}s.updateActiveIndex();}if(!s.params.freeModeMomentum || timeDiff >= s.params.longSwipesMs){s.updateProgress();s.updateActiveIndex();}return;} // Find current slide
var i,stopIndex=0,groupSize=s.slidesSizesGrid[0];for(i = 0;i < s.slidesGrid.length;i += s.params.slidesPerGroup) {if(typeof s.slidesGrid[i + s.params.slidesPerGroup] !== 'undefined'){if(currentPos >= s.slidesGrid[i] && currentPos < s.slidesGrid[i + s.params.slidesPerGroup]){stopIndex = i;groupSize = s.slidesGrid[i + s.params.slidesPerGroup] - s.slidesGrid[i];}}else {if(currentPos >= s.slidesGrid[i]){stopIndex = i;groupSize = s.slidesGrid[s.slidesGrid.length - 1] - s.slidesGrid[s.slidesGrid.length - 2];}}} // Find current slide size
var ratio=(currentPos - s.slidesGrid[stopIndex]) / groupSize;if(timeDiff > s.params.longSwipesMs){ // Long touches
if(!s.params.longSwipes){s.slideTo(s.activeIndex);return;}if(s.swipeDirection === 'next'){if(ratio >= s.params.longSwipesRatio)s.slideTo(stopIndex + s.params.slidesPerGroup);else s.slideTo(stopIndex);}if(s.swipeDirection === 'prev'){if(ratio > 1 - s.params.longSwipesRatio)s.slideTo(stopIndex + s.params.slidesPerGroup);else s.slideTo(stopIndex);}}else { // Short swipes
if(!s.params.shortSwipes){s.slideTo(s.activeIndex);return;}if(s.swipeDirection === 'next'){s.slideTo(stopIndex + s.params.slidesPerGroup);}if(s.swipeDirection === 'prev'){s.slideTo(stopIndex);}}}; /*=========================
      Transitions
      ===========================*/s._slideTo = function(slideIndex,speed){return s.slideTo(slideIndex,speed,true,true);};s.slideTo = function(slideIndex,speed,runCallbacks,internal){if(typeof runCallbacks === 'undefined')runCallbacks = true;if(typeof slideIndex === 'undefined')slideIndex = 0;if(slideIndex < 0)slideIndex = 0;s.snapIndex = Math.floor(slideIndex / s.params.slidesPerGroup);if(s.snapIndex >= s.snapGrid.length)s.snapIndex = s.snapGrid.length - 1;var translate=-s.snapGrid[s.snapIndex]; // Stop autoplay
if(s.params.autoplay && s.autoplaying){if(internal || !s.params.autoplayDisableOnInteraction){s.pauseAutoplay(speed);}else {s.stopAutoplay();}} // Update progress
s.updateProgress(translate); // Normalize slideIndex
for(var i=0;i < s.slidesGrid.length;i++) {if(-Math.floor(translate * 100) >= Math.floor(s.slidesGrid[i] * 100)){slideIndex = i;}} // Directions locks
if(!s.params.allowSwipeToNext && translate < s.translate && translate < s.minTranslate()){return false;}if(!s.params.allowSwipeToPrev && translate > s.translate && translate > s.maxTranslate()){if((s.activeIndex || 0) !== slideIndex)return false;} // Update Index
if(typeof speed === 'undefined')speed = s.params.speed;s.previousIndex = s.activeIndex || 0;s.activeIndex = slideIndex;if(s.rtl && -translate === s.translate || !s.rtl && translate === s.translate){ // Update Height
if(s.params.autoHeight){s.updateAutoHeight();}s.updateClasses();if(s.params.effect !== 'slide'){s.setWrapperTranslate(translate);}return false;}s.updateClasses();s.onTransitionStart(runCallbacks);if(speed === 0){s.setWrapperTranslate(translate);s.setWrapperTransition(0);s.onTransitionEnd(runCallbacks);}else {s.setWrapperTranslate(translate);s.setWrapperTransition(speed);if(!s.animating){s.animating = true;s.wrapper.transitionEnd(function(){if(!s)return;s.onTransitionEnd(runCallbacks);});}}return true;};s.onTransitionStart = function(runCallbacks){if(typeof runCallbacks === 'undefined')runCallbacks = true;if(s.params.autoHeight){s.updateAutoHeight();}if(s.lazy)s.lazy.onTransitionStart();if(runCallbacks){s.emit('onTransitionStart',s);if(s.activeIndex !== s.previousIndex){s.emit('onSlideChangeStart',s);if(s.activeIndex > s.previousIndex){s.emit('onSlideNextStart',s);}else {s.emit('onSlidePrevStart',s);}}}};s.onTransitionEnd = function(runCallbacks){s.animating = false;s.setWrapperTransition(0);if(typeof runCallbacks === 'undefined')runCallbacks = true;if(s.lazy)s.lazy.onTransitionEnd();if(runCallbacks){s.emit('onTransitionEnd',s);if(s.activeIndex !== s.previousIndex){s.emit('onSlideChangeEnd',s);if(s.activeIndex > s.previousIndex){s.emit('onSlideNextEnd',s);}else {s.emit('onSlidePrevEnd',s);}}}if(s.params.hashnav && s.hashnav){s.hashnav.setHash();}};s.slideNext = function(runCallbacks,speed,internal){if(s.params.loop){if(s.animating)return false;s.fixLoop();var clientLeft=s.container[0].clientLeft;return s.slideTo(s.activeIndex + s.params.slidesPerGroup,speed,runCallbacks,internal);}else return s.slideTo(s.activeIndex + s.params.slidesPerGroup,speed,runCallbacks,internal);};s._slideNext = function(speed){return s.slideNext(true,speed,true);};s.slidePrev = function(runCallbacks,speed,internal){if(s.params.loop){if(s.animating)return false;s.fixLoop();var clientLeft=s.container[0].clientLeft;return s.slideTo(s.activeIndex - 1,speed,runCallbacks,internal);}else return s.slideTo(s.activeIndex - 1,speed,runCallbacks,internal);};s._slidePrev = function(speed){return s.slidePrev(true,speed,true);};s.slideReset = function(runCallbacks,speed,internal){return s.slideTo(s.activeIndex,speed,runCallbacks);}; /*=========================
      Translate/transition helpers
      ===========================*/s.setWrapperTransition = function(duration,byController){s.wrapper.transition(duration);if(s.params.effect !== 'slide' && s.effects[s.params.effect]){s.effects[s.params.effect].setTransition(duration);}if(s.params.parallax && s.parallax){s.parallax.setTransition(duration);}if(s.params.scrollbar && s.scrollbar){s.scrollbar.setTransition(duration);}if(s.params.control && s.controller){s.controller.setTransition(duration,byController);}s.emit('onSetTransition',s,duration);};s.setWrapperTranslate = function(translate,updateActiveIndex,byController){var x=0,y=0,z=0;if(isH()){x = s.rtl?-translate:translate;}else {y = translate;}if(s.params.roundLengths){x = round(x);y = round(y);}if(!s.params.virtualTranslate){if(s.support.transforms3d)s.wrapper.transform('translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)');else s.wrapper.transform('translate(' + x + 'px, ' + y + 'px)');}s.translate = isH()?x:y; // Check if we need to update progress
var progress;var translatesDiff=s.maxTranslate() - s.minTranslate();if(translatesDiff === 0){progress = 0;}else {progress = (translate - s.minTranslate()) / translatesDiff;}if(progress !== s.progress){s.updateProgress(translate);}if(updateActiveIndex)s.updateActiveIndex();if(s.params.effect !== 'slide' && s.effects[s.params.effect]){s.effects[s.params.effect].setTranslate(s.translate);}if(s.params.parallax && s.parallax){s.parallax.setTranslate(s.translate);}if(s.params.scrollbar && s.scrollbar){s.scrollbar.setTranslate(s.translate);}if(s.params.control && s.controller){s.controller.setTranslate(s.translate,byController);}s.emit('onSetTranslate',s,s.translate);};s.getTranslate = function(el,axis){var matrix,curTransform,curStyle,transformMatrix; // automatic axis detection
if(typeof axis === 'undefined'){axis = 'x';}if(s.params.virtualTranslate){return s.rtl?-s.translate:s.translate;}curStyle = window.getComputedStyle(el,null);if(window.WebKitCSSMatrix){curTransform = curStyle.transform || curStyle.webkitTransform;if(curTransform.split(',').length > 6){curTransform = curTransform.split(', ').map(function(a){return a.replace(',','.');}).join(', ');} // Some old versions of Webkit choke when 'none' is passed; pass
// empty string instead in this case
transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none'?'':curTransform);}else {transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(','matrix(1, 0, 0, 1,');matrix = transformMatrix.toString().split(',');}if(axis === 'x'){ //Latest Chrome and webkits Fix
if(window.WebKitCSSMatrix)curTransform = transformMatrix.m41; //Crazy IE10 Matrix
else if(matrix.length === 16)curTransform = parseFloat(matrix[12]); //Normal Browsers
else curTransform = parseFloat(matrix[4]);}if(axis === 'y'){ //Latest Chrome and webkits Fix
if(window.WebKitCSSMatrix)curTransform = transformMatrix.m42; //Crazy IE10 Matrix
else if(matrix.length === 16)curTransform = parseFloat(matrix[13]); //Normal Browsers
else curTransform = parseFloat(matrix[5]);}if(s.rtl && curTransform)curTransform = -curTransform;return curTransform || 0;};s.getWrapperTranslate = function(axis){if(typeof axis === 'undefined'){axis = isH()?'x':'y';}return s.getTranslate(s.wrapper[0],axis);}; /*=========================
      Observer
      ===========================*/s.observers = [];function initObserver(target,options){options = options || {}; // create an observer instance
var ObserverFunc=window.MutationObserver || window.WebkitMutationObserver;var observer=new ObserverFunc(function(mutations){mutations.forEach(function(mutation){s.onResize(true);s.emit('onObserverUpdate',s,mutation);});});observer.observe(target,{attributes:typeof options.attributes === 'undefined'?true:options.attributes,childList:typeof options.childList === 'undefined'?true:options.childList,characterData:typeof options.characterData === 'undefined'?true:options.characterData});s.observers.push(observer);}s.initObservers = function(){if(s.params.observeParents){var containerParents=s.container.parents();for(var i=0;i < containerParents.length;i++) {initObserver(containerParents[i]);}} // Observe container
initObserver(s.container[0],{childList:false}); // Observe wrapper
initObserver(s.wrapper[0],{attributes:false});};s.disconnectObservers = function(){for(var i=0;i < s.observers.length;i++) {s.observers[i].disconnect();}s.observers = [];}; /*=========================
      Loop
      ===========================*/ // Create looped slides
s.createLoop = function(){ // Remove duplicated slides
s.wrapper.children('.' + s.params.slideClass + '.' + s.params.slideDuplicateClass).remove();var slides=s.wrapper.children('.' + s.params.slideClass);if(s.params.slidesPerView === 'auto' && !s.params.loopedSlides)s.params.loopedSlides = slides.length;s.loopedSlides = parseInt(s.params.loopedSlides || s.params.slidesPerView,10);s.loopedSlides = s.loopedSlides + s.params.loopAdditionalSlides;if(s.loopedSlides > slides.length){s.loopedSlides = slides.length;}var prependSlides=[],appendSlides=[],i;slides.each(function(index,el){var slide=$(this);if(index < s.loopedSlides)appendSlides.push(el);if(index < slides.length && index >= slides.length - s.loopedSlides)prependSlides.push(el);slide.attr('data-swiper-slide-index',index);});for(i = 0;i < appendSlides.length;i++) {s.wrapper.append($(appendSlides[i].cloneNode(true)).addClass(s.params.slideDuplicateClass));}for(i = prependSlides.length - 1;i >= 0;i--) {s.wrapper.prepend($(prependSlides[i].cloneNode(true)).addClass(s.params.slideDuplicateClass));}};s.destroyLoop = function(){s.wrapper.children('.' + s.params.slideClass + '.' + s.params.slideDuplicateClass).remove();s.slides.removeAttr('data-swiper-slide-index');};s.fixLoop = function(){var newIndex; //Fix For Negative Oversliding
if(s.activeIndex < s.loopedSlides){newIndex = s.slides.length - s.loopedSlides * 3 + s.activeIndex;newIndex = newIndex + s.loopedSlides;s.slideTo(newIndex,0,false,true);} //Fix For Positive Oversliding
else if(s.params.slidesPerView === 'auto' && s.activeIndex >= s.loopedSlides * 2 || s.activeIndex > s.slides.length - s.params.slidesPerView * 2){newIndex = -s.slides.length + s.activeIndex + s.loopedSlides;newIndex = newIndex + s.loopedSlides;s.slideTo(newIndex,0,false,true);}}; /*=========================
      Append/Prepend/Remove Slides
      ===========================*/s.appendSlide = function(slides){if(s.params.loop){s.destroyLoop();}if(typeof slides === 'object' && slides.length){for(var i=0;i < slides.length;i++) {if(slides[i])s.wrapper.append(slides[i]);}}else {s.wrapper.append(slides);}if(s.params.loop){s.createLoop();}if(!(s.params.observer && s.support.observer)){s.update(true);}};s.prependSlide = function(slides){if(s.params.loop){s.destroyLoop();}var newActiveIndex=s.activeIndex + 1;if(typeof slides === 'object' && slides.length){for(var i=0;i < slides.length;i++) {if(slides[i])s.wrapper.prepend(slides[i]);}newActiveIndex = s.activeIndex + slides.length;}else {s.wrapper.prepend(slides);}if(s.params.loop){s.createLoop();}if(!(s.params.observer && s.support.observer)){s.update(true);}s.slideTo(newActiveIndex,0,false);};s.removeSlide = function(slidesIndexes){if(s.params.loop){s.destroyLoop();s.slides = s.wrapper.children('.' + s.params.slideClass);}var newActiveIndex=s.activeIndex,indexToRemove;if(typeof slidesIndexes === 'object' && slidesIndexes.length){for(var i=0;i < slidesIndexes.length;i++) {indexToRemove = slidesIndexes[i];if(s.slides[indexToRemove])s.slides.eq(indexToRemove).remove();if(indexToRemove < newActiveIndex)newActiveIndex--;}newActiveIndex = Math.max(newActiveIndex,0);}else {indexToRemove = slidesIndexes;if(s.slides[indexToRemove])s.slides.eq(indexToRemove).remove();if(indexToRemove < newActiveIndex)newActiveIndex--;newActiveIndex = Math.max(newActiveIndex,0);}if(s.params.loop){s.createLoop();}if(!(s.params.observer && s.support.observer)){s.update(true);}if(s.params.loop){s.slideTo(newActiveIndex + s.loopedSlides,0,false);}else {s.slideTo(newActiveIndex,0,false);}};s.removeAllSlides = function(){var slidesIndexes=[];for(var i=0;i < s.slides.length;i++) {slidesIndexes.push(i);}s.removeSlide(slidesIndexes);}; /*=========================
      Effects
      ===========================*/s.effects = {fade:{setTranslate:function setTranslate(){for(var i=0;i < s.slides.length;i++) {var slide=s.slides.eq(i);var offset=slide[0].swiperSlideOffset;var tx=-offset;if(!s.params.virtualTranslate)tx = tx - s.translate;var ty=0;if(!isH()){ty = tx;tx = 0;}var slideOpacity=s.params.fade.crossFade?Math.max(1 - Math.abs(slide[0].progress),0):1 + Math.min(Math.max(slide[0].progress,-1),0);slide.css({opacity:slideOpacity}).transform('translate3d(' + tx + 'px, ' + ty + 'px, 0px)');}},setTransition:function setTransition(duration){s.slides.transition(duration);if(s.params.virtualTranslate && duration !== 0){var eventTriggered=false;s.slides.transitionEnd(function(){if(eventTriggered)return;if(!s)return;eventTriggered = true;s.animating = false;var triggerEvents=['webkitTransitionEnd','transitionend','oTransitionEnd','MSTransitionEnd','msTransitionEnd'];for(var i=0;i < triggerEvents.length;i++) {s.wrapper.trigger(triggerEvents[i]);}});}}},cube:{setTranslate:function setTranslate(){var wrapperRotate=0,cubeShadow;if(s.params.cube.shadow){if(isH()){cubeShadow = s.wrapper.find('.swiper-cube-shadow');if(cubeShadow.length === 0){cubeShadow = $('<div class="swiper-cube-shadow"></div>');s.wrapper.append(cubeShadow);}cubeShadow.css({height:s.width + 'px'});}else {cubeShadow = s.container.find('.swiper-cube-shadow');if(cubeShadow.length === 0){cubeShadow = $('<div class="swiper-cube-shadow"></div>');s.container.append(cubeShadow);}}}for(var i=0;i < s.slides.length;i++) {var slide=s.slides.eq(i);var slideAngle=i * 90;var round=Math.floor(slideAngle / 360);if(s.rtl){slideAngle = -slideAngle;round = Math.floor(-slideAngle / 360);}var progress=Math.max(Math.min(slide[0].progress,1),-1);var tx=0,ty=0,tz=0;if(i % 4 === 0){tx = -round * 4 * s.size;tz = 0;}else if((i - 1) % 4 === 0){tx = 0;tz = -round * 4 * s.size;}else if((i - 2) % 4 === 0){tx = s.size + round * 4 * s.size;tz = s.size;}else if((i - 3) % 4 === 0){tx = -s.size;tz = 3 * s.size + s.size * 4 * round;}if(s.rtl){tx = -tx;}if(!isH()){ty = tx;tx = 0;}var transform='rotateX(' + (isH()?0:-slideAngle) + 'deg) rotateY(' + (isH()?slideAngle:0) + 'deg) translate3d(' + tx + 'px, ' + ty + 'px, ' + tz + 'px)';if(progress <= 1 && progress > -1){wrapperRotate = i * 90 + progress * 90;if(s.rtl)wrapperRotate = -i * 90 - progress * 90;}slide.transform(transform);if(s.params.cube.slideShadows){ //Set shadows
var shadowBefore=isH()?slide.find('.swiper-slide-shadow-left'):slide.find('.swiper-slide-shadow-top');var shadowAfter=isH()?slide.find('.swiper-slide-shadow-right'):slide.find('.swiper-slide-shadow-bottom');if(shadowBefore.length === 0){shadowBefore = $('<div class="swiper-slide-shadow-' + (isH()?'left':'top') + '"></div>');slide.append(shadowBefore);}if(shadowAfter.length === 0){shadowAfter = $('<div class="swiper-slide-shadow-' + (isH()?'right':'bottom') + '"></div>');slide.append(shadowAfter);}var shadowOpacity=slide[0].progress;if(shadowBefore.length)shadowBefore[0].style.opacity = -slide[0].progress;if(shadowAfter.length)shadowAfter[0].style.opacity = slide[0].progress;}}s.wrapper.css({'-webkit-transform-origin':'50% 50% -' + s.size / 2 + 'px','-moz-transform-origin':'50% 50% -' + s.size / 2 + 'px','-ms-transform-origin':'50% 50% -' + s.size / 2 + 'px','transform-origin':'50% 50% -' + s.size / 2 + 'px'});if(s.params.cube.shadow){if(isH()){cubeShadow.transform('translate3d(0px, ' + (s.width / 2 + s.params.cube.shadowOffset) + 'px, ' + -s.width / 2 + 'px) rotateX(90deg) rotateZ(0deg) scale(' + s.params.cube.shadowScale + ')');}else {var shadowAngle=Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;var multiplier=1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);var scale1=s.params.cube.shadowScale,scale2=s.params.cube.shadowScale / multiplier,offset=s.params.cube.shadowOffset;cubeShadow.transform('scale3d(' + scale1 + ', 1, ' + scale2 + ') translate3d(0px, ' + (s.height / 2 + offset) + 'px, ' + -s.height / 2 / scale2 + 'px) rotateX(-90deg)');}}var zFactor=s.isSafari || s.isUiWebView?-s.size / 2:0;s.wrapper.transform('translate3d(0px,0,' + zFactor + 'px) rotateX(' + (isH()?0:wrapperRotate) + 'deg) rotateY(' + (isH()?-wrapperRotate:0) + 'deg)');},setTransition:function setTransition(duration){s.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);if(s.params.cube.shadow && !isH()){s.container.find('.swiper-cube-shadow').transition(duration);}}},coverflow:{setTranslate:function setTranslate(){var transform=s.translate;var center=isH()?-transform + s.width / 2:-transform + s.height / 2;var rotate=isH()?s.params.coverflow.rotate:-s.params.coverflow.rotate;var translate=s.params.coverflow.depth; //Each slide offset from center
for(var i=0,length=s.slides.length;i < length;i++) {var slide=s.slides.eq(i);var slideSize=s.slidesSizesGrid[i];var slideOffset=slide[0].swiperSlideOffset;var offsetMultiplier=(center - slideOffset - slideSize / 2) / slideSize * s.params.coverflow.modifier;var rotateY=isH()?rotate * offsetMultiplier:0;var rotateX=isH()?0:rotate * offsetMultiplier; // var rotateZ = 0
var translateZ=-translate * Math.abs(offsetMultiplier);var translateY=isH()?0:s.params.coverflow.stretch * offsetMultiplier;var translateX=isH()?s.params.coverflow.stretch * offsetMultiplier:0; //Fix for ultra small values
if(Math.abs(translateX) < 0.001)translateX = 0;if(Math.abs(translateY) < 0.001)translateY = 0;if(Math.abs(translateZ) < 0.001)translateZ = 0;if(Math.abs(rotateY) < 0.001)rotateY = 0;if(Math.abs(rotateX) < 0.001)rotateX = 0;var slideTransform='translate3d(' + translateX + 'px,' + translateY + 'px,' + translateZ + 'px)  rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';slide.transform(slideTransform);slide[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;if(s.params.coverflow.slideShadows){ //Set shadows
var shadowBefore=isH()?slide.find('.swiper-slide-shadow-left'):slide.find('.swiper-slide-shadow-top');var shadowAfter=isH()?slide.find('.swiper-slide-shadow-right'):slide.find('.swiper-slide-shadow-bottom');if(shadowBefore.length === 0){shadowBefore = $('<div class="swiper-slide-shadow-' + (isH()?'left':'top') + '"></div>');slide.append(shadowBefore);}if(shadowAfter.length === 0){shadowAfter = $('<div class="swiper-slide-shadow-' + (isH()?'right':'bottom') + '"></div>');slide.append(shadowAfter);}if(shadowBefore.length)shadowBefore[0].style.opacity = offsetMultiplier > 0?offsetMultiplier:0;if(shadowAfter.length)shadowAfter[0].style.opacity = -offsetMultiplier > 0?-offsetMultiplier:0;}} //Set correct perspective for IE10
if(s.browser.ie){var ws=s.wrapper[0].style;ws.perspectiveOrigin = center + 'px 50%';}},setTransition:function setTransition(duration){s.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);}}}; /*=========================
      Images Lazy Loading
      ===========================*/s.lazy = {initialImageLoaded:false,loadImageInSlide:function loadImageInSlide(index,loadInDuplicate){if(typeof index === 'undefined')return;if(typeof loadInDuplicate === 'undefined')loadInDuplicate = true;if(s.slides.length === 0)return;var slide=s.slides.eq(index);var img=slide.find('.swiper-lazy:not(.swiper-lazy-loaded):not(.swiper-lazy-loading)');if(slide.hasClass('swiper-lazy') && !slide.hasClass('swiper-lazy-loaded') && !slide.hasClass('swiper-lazy-loading')){img = img.add(slide[0]);}if(img.length === 0)return;img.each(function(){var _img=$(this);_img.addClass('swiper-lazy-loading');var background=_img.attr('data-background');var src=_img.attr('data-src'),srcset=_img.attr('data-srcset');s.loadImage(_img[0],src || background,srcset,false,function(){if(background){_img.css('background-image','url(' + background + ')');_img.removeAttr('data-background');}else {if(srcset){_img.attr('srcset',srcset);_img.removeAttr('data-srcset');}if(src){_img.attr('src',src);_img.removeAttr('data-src');}}_img.addClass('swiper-lazy-loaded').removeClass('swiper-lazy-loading');slide.find('.swiper-lazy-preloader, .preloader').remove();if(s.params.loop && loadInDuplicate){var slideOriginalIndex=slide.attr('data-swiper-slide-index');if(slide.hasClass(s.params.slideDuplicateClass)){var originalSlide=s.wrapper.children('[data-swiper-slide-index="' + slideOriginalIndex + '"]:not(.' + s.params.slideDuplicateClass + ')');s.lazy.loadImageInSlide(originalSlide.index(),false);}else {var duplicatedSlide=s.wrapper.children('.' + s.params.slideDuplicateClass + '[data-swiper-slide-index="' + slideOriginalIndex + '"]');s.lazy.loadImageInSlide(duplicatedSlide.index(),false);}}s.emit('onLazyImageReady',s,slide[0],_img[0]);});s.emit('onLazyImageLoad',s,slide[0],_img[0]);});},load:function load(){var i;if(s.params.watchSlidesVisibility){s.wrapper.children('.' + s.params.slideVisibleClass).each(function(){s.lazy.loadImageInSlide($(this).index());});}else {if(s.params.slidesPerView > 1){for(i = s.activeIndex;i < s.activeIndex + s.params.slidesPerView;i++) {if(s.slides[i])s.lazy.loadImageInSlide(i);}}else {s.lazy.loadImageInSlide(s.activeIndex);}}if(s.params.lazyLoadingInPrevNext){if(s.params.slidesPerView > 1){ // Next Slides
for(i = s.activeIndex + s.params.slidesPerView;i < s.activeIndex + s.params.slidesPerView + s.params.slidesPerView;i++) {if(s.slides[i])s.lazy.loadImageInSlide(i);} // Prev Slides
for(i = s.activeIndex - s.params.slidesPerView;i < s.activeIndex;i++) {if(s.slides[i])s.lazy.loadImageInSlide(i);}}else {var nextSlide=s.wrapper.children('.' + s.params.slideNextClass);if(nextSlide.length > 0)s.lazy.loadImageInSlide(nextSlide.index());var prevSlide=s.wrapper.children('.' + s.params.slidePrevClass);if(prevSlide.length > 0)s.lazy.loadImageInSlide(prevSlide.index());}}},onTransitionStart:function onTransitionStart(){if(s.params.lazyLoading){if(s.params.lazyLoadingOnTransitionStart || !s.params.lazyLoadingOnTransitionStart && !s.lazy.initialImageLoaded){s.lazy.load();}}},onTransitionEnd:function onTransitionEnd(){if(s.params.lazyLoading && !s.params.lazyLoadingOnTransitionStart){s.lazy.load();}}}; /*=========================
      Scrollbar
      ===========================*/s.scrollbar = {isTouched:false,setDragPosition:function setDragPosition(e){var sb=s.scrollbar;var x=0,y=0;var translate;var pointerPosition=isH()?e.type === 'touchstart' || e.type === 'touchmove'?e.targetTouches[0].pageX:e.pageX || e.clientX:e.type === 'touchstart' || e.type === 'touchmove'?e.targetTouches[0].pageY:e.pageY || e.clientY;var position=pointerPosition - sb.track.offset()[isH()?'left':'top'] - sb.dragSize / 2;var positionMin=-s.minTranslate() * sb.moveDivider;var positionMax=-s.maxTranslate() * sb.moveDivider;if(position < positionMin){position = positionMin;}else if(position > positionMax){position = positionMax;}position = -position / sb.moveDivider;s.updateProgress(position);s.setWrapperTranslate(position,true);},dragStart:function dragStart(e){var sb=s.scrollbar;sb.isTouched = true;e.preventDefault();e.stopPropagation();sb.setDragPosition(e);clearTimeout(sb.dragTimeout);sb.track.transition(0);if(s.params.scrollbarHide){sb.track.css('opacity',1);}s.wrapper.transition(100);sb.drag.transition(100);s.emit('onScrollbarDragStart',s);},dragMove:function dragMove(e){var sb=s.scrollbar;if(!sb.isTouched)return;if(e.preventDefault)e.preventDefault();else e.returnValue = false;sb.setDragPosition(e);s.wrapper.transition(0);sb.track.transition(0);sb.drag.transition(0);s.emit('onScrollbarDragMove',s);},dragEnd:function dragEnd(e){var sb=s.scrollbar;if(!sb.isTouched)return;sb.isTouched = false;if(s.params.scrollbarHide){clearTimeout(sb.dragTimeout);sb.dragTimeout = setTimeout(function(){sb.track.css('opacity',0);sb.track.transition(400);},1000);}s.emit('onScrollbarDragEnd',s);if(s.params.scrollbarSnapOnRelease){s.slideReset();}},enableDraggable:function enableDraggable(){var sb=s.scrollbar;var target=s.support.touch?sb.track:document;$(sb.track).on(s.touchEvents.start,sb.dragStart);$(target).on(s.touchEvents.move,sb.dragMove);$(target).on(s.touchEvents.end,sb.dragEnd);},disableDraggable:function disableDraggable(){var sb=s.scrollbar;var target=s.support.touch?sb.track:document;$(sb.track).off(s.touchEvents.start,sb.dragStart);$(target).off(s.touchEvents.move,sb.dragMove);$(target).off(s.touchEvents.end,sb.dragEnd);},set:function set(){if(!s.params.scrollbar)return;var sb=s.scrollbar;sb.track = $(s.params.scrollbar);sb.drag = sb.track.find('.swiper-scrollbar-drag');if(sb.drag.length === 0){sb.drag = $('<div class="swiper-scrollbar-drag"></div>');sb.track.append(sb.drag);}sb.drag[0].style.width = '';sb.drag[0].style.height = '';sb.trackSize = isH()?sb.track[0].offsetWidth:sb.track[0].offsetHeight;sb.divider = s.size / s.virtualSize;sb.moveDivider = sb.divider * (sb.trackSize / s.size);sb.dragSize = sb.trackSize * sb.divider;if(isH()){sb.drag[0].style.width = sb.dragSize + 'px';}else {sb.drag[0].style.height = sb.dragSize + 'px';}if(sb.divider >= 1){sb.track[0].style.display = 'none';}else {sb.track[0].style.display = '';}if(s.params.scrollbarHide){sb.track[0].style.opacity = 0;}},setTranslate:function setTranslate(){if(!s.params.scrollbar)return;var diff;var sb=s.scrollbar;var translate=s.translate || 0;var newPos;var newSize=sb.dragSize;newPos = (sb.trackSize - sb.dragSize) * s.progress;if(s.rtl && isH()){newPos = -newPos;if(newPos > 0){newSize = sb.dragSize - newPos;newPos = 0;}else if(-newPos + sb.dragSize > sb.trackSize){newSize = sb.trackSize + newPos;}}else {if(newPos < 0){newSize = sb.dragSize + newPos;newPos = 0;}else if(newPos + sb.dragSize > sb.trackSize){newSize = sb.trackSize - newPos;}}if(isH()){if(s.support.transforms3d){sb.drag.transform('translate3d(' + newPos + 'px, 0, 0)');}else {sb.drag.transform('translateX(' + newPos + 'px)');}sb.drag[0].style.width = newSize + 'px';}else {if(s.support.transforms3d){sb.drag.transform('translate3d(0px, ' + newPos + 'px, 0)');}else {sb.drag.transform('translateY(' + newPos + 'px)');}sb.drag[0].style.height = newSize + 'px';}if(s.params.scrollbarHide){clearTimeout(sb.timeout);sb.track[0].style.opacity = 1;sb.timeout = setTimeout(function(){sb.track[0].style.opacity = 0;sb.track.transition(400);},1000);}},setTransition:function setTransition(duration){if(!s.params.scrollbar)return;s.scrollbar.drag.transition(duration);}}; /*=========================
      Controller
      ===========================*/s.controller = {LinearSpline:function LinearSpline(x,y){this.x = x;this.y = y;this.lastIndex = x.length - 1; // Given an x value (x2), return the expected y2 value:
// (x1,y1) is the known point before given value,
// (x3,y3) is the known point after given value.
var i1,i3;var l=this.x.length;this.interpolate = function(x2){if(!x2)return 0; // Get the indexes of x1 and x3 (the array indexes before and after given x2):
i3 = binarySearch(this.x,x2);i1 = i3 - 1; // We have our indexes i1 & i3, so we can calculate already:
// y2 := ((x2−x1) × (y3−y1)) ÷ (x3−x1) + y1
return (x2 - this.x[i1]) * (this.y[i3] - this.y[i1]) / (this.x[i3] - this.x[i1]) + this.y[i1];};var binarySearch=(function(){var maxIndex,minIndex,guess;return function(array,val){minIndex = -1;maxIndex = array.length;while(maxIndex - minIndex > 1) if(array[guess = maxIndex + minIndex >> 1] <= val){minIndex = guess;}else {maxIndex = guess;}return maxIndex;};})();}, //xxx: for now i will just save one spline function to to
getInterpolateFunction:function getInterpolateFunction(c){if(!s.controller.spline)s.controller.spline = s.params.loop?new s.controller.LinearSpline(s.slidesGrid,c.slidesGrid):new s.controller.LinearSpline(s.snapGrid,c.snapGrid);},setTranslate:function setTranslate(translate,byController){var controlled=s.params.control;var multiplier,controlledTranslate;function setControlledTranslate(c){ // this will create an Interpolate function based on the snapGrids
// x is the Grid of the scrolled scroller and y will be the controlled scroller
// it makes sense to create this only once and recall it for the interpolation
// the function does a lot of value caching for performance
translate = c.rtl && c.params.direction === 'horizontal'?-s.translate:s.translate;if(s.params.controlBy === 'slide'){s.controller.getInterpolateFunction(c); // i am not sure why the values have to be multiplicated this way, tried to invert the snapGrid
// but it did not work out
controlledTranslate = -s.controller.spline.interpolate(-translate);}if(!controlledTranslate || s.params.controlBy === 'container'){multiplier = (c.maxTranslate() - c.minTranslate()) / (s.maxTranslate() - s.minTranslate());controlledTranslate = (translate - s.minTranslate()) * multiplier + c.minTranslate();}if(s.params.controlInverse){controlledTranslate = c.maxTranslate() - controlledTranslate;}c.updateProgress(controlledTranslate);c.setWrapperTranslate(controlledTranslate,false,s);c.updateActiveIndex();}if(s.isArray(controlled)){for(var i=0;i < controlled.length;i++) {if(controlled[i] !== byController && controlled[i] instanceof Swiper){setControlledTranslate(controlled[i]);}}}else if(controlled instanceof Swiper && byController !== controlled){setControlledTranslate(controlled);}},setTransition:function setTransition(duration,byController){var controlled=s.params.control;var i;function setControlledTransition(c){c.setWrapperTransition(duration,s);if(duration !== 0){c.onTransitionStart();c.wrapper.transitionEnd(function(){if(!controlled)return;if(c.params.loop && s.params.controlBy === 'slide'){c.fixLoop();}c.onTransitionEnd();});}}if(s.isArray(controlled)){for(i = 0;i < controlled.length;i++) {if(controlled[i] !== byController && controlled[i] instanceof Swiper){setControlledTransition(controlled[i]);}}}else if(controlled instanceof Swiper && byController !== controlled){setControlledTransition(controlled);}}}; /*=========================
      Parallax
      ===========================*/function setParallaxTransform(el,progress){el = $(el);var p,pX,pY;var rtlFactor=s.rtl?-1:1;p = el.attr('data-swiper-parallax') || '0';pX = el.attr('data-swiper-parallax-x');pY = el.attr('data-swiper-parallax-y');if(pX || pY){pX = pX || '0';pY = pY || '0';}else {if(isH()){pX = p;pY = '0';}else {pY = p;pX = '0';}}if(pX.indexOf('%') >= 0){pX = parseInt(pX,10) * progress * rtlFactor + '%';}else {pX = pX * progress * rtlFactor + 'px';}if(pY.indexOf('%') >= 0){pY = parseInt(pY,10) * progress + '%';}else {pY = pY * progress + 'px';}el.transform('translate3d(' + pX + ', ' + pY + ',0px)');}s.parallax = {setTranslate:function setTranslate(){s.container.children('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function(){setParallaxTransform(this,s.progress);});s.slides.each(function(){var slide=$(this);slide.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function(){var progress=Math.min(Math.max(slide[0].progress,-1),1);setParallaxTransform(this,progress);});});},setTransition:function setTransition(duration){if(typeof duration === 'undefined')duration = s.params.speed;s.container.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function(){var el=$(this);var parallaxDuration=parseInt(el.attr('data-swiper-parallax-duration'),10) || duration;if(duration === 0)parallaxDuration = 0;el.transition(parallaxDuration);});}}; /*=========================
      Plugins API. Collect all and init all plugins
      ===========================*/s._plugins = [];for(var plugin in s.plugins) {var p=s.plugins[plugin](s,s.params[plugin]);if(p)s._plugins.push(p);} // Method to call all plugins event/method
s.callPlugins = function(eventName){for(var i=0;i < s._plugins.length;i++) {if(eventName in s._plugins[i]){s._plugins[i][eventName](arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);}}}; /*=========================
      Events/Callbacks/Plugins Emitter
      ===========================*/function normalizeEventName(eventName){if(eventName.indexOf('on') !== 0){if(eventName[0] !== eventName[0].toUpperCase()){eventName = 'on' + eventName[0].toUpperCase() + eventName.substring(1);}else {eventName = 'on' + eventName;}}return eventName;}s.emitterEventListeners = {};s.emit = function(eventName){ // Trigger callbacks
if(s.params[eventName]){s.params[eventName](arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);}var i; // Trigger events
if(s.emitterEventListeners[eventName]){for(i = 0;i < s.emitterEventListeners[eventName].length;i++) {s.emitterEventListeners[eventName][i](arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);}} // Trigger plugins
if(s.callPlugins)s.callPlugins(eventName,arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);};s.on = function(eventName,handler){eventName = normalizeEventName(eventName);if(!s.emitterEventListeners[eventName])s.emitterEventListeners[eventName] = [];s.emitterEventListeners[eventName].push(handler);return s;};s.off = function(eventName,handler){var i;eventName = normalizeEventName(eventName);if(typeof handler === 'undefined'){ // Remove all handlers for such event
s.emitterEventListeners[eventName] = [];return s;}if(!s.emitterEventListeners[eventName] || s.emitterEventListeners[eventName].length === 0)return;for(i = 0;i < s.emitterEventListeners[eventName].length;i++) {if(s.emitterEventListeners[eventName][i] === handler)s.emitterEventListeners[eventName].splice(i,1);}return s;};s.once = function(eventName,handler){eventName = normalizeEventName(eventName);var _handler=function _handler(){handler(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);s.off(eventName,_handler);};s.on(eventName,_handler);return s;}; // Accessibility tools
s.a11y = {makeFocusable:function makeFocusable($el){$el.attr('tabIndex','0');return $el;},addRole:function addRole($el,role){$el.attr('role',role);return $el;},addLabel:function addLabel($el,label){$el.attr('aria-label',label);return $el;},disable:function disable($el){$el.attr('aria-disabled',true);return $el;},enable:function enable($el){$el.attr('aria-disabled',false);return $el;},onEnterKey:function onEnterKey(event){if(event.keyCode !== 13)return;if($(event.target).is(s.params.nextButton)){s.onClickNext(event);if(s.isEnd){s.a11y.notify(s.params.lastSlideMessage);}else {s.a11y.notify(s.params.nextSlideMessage);}}else if($(event.target).is(s.params.prevButton)){s.onClickPrev(event);if(s.isBeginning){s.a11y.notify(s.params.firstSlideMessage);}else {s.a11y.notify(s.params.prevSlideMessage);}}if($(event.target).is('.' + s.params.bulletClass)){$(event.target)[0].click();}},liveRegion:$('<span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>'),notify:function notify(message){var notification=s.a11y.liveRegion;if(notification.length === 0)return;notification.html('');notification.html(message);},init:function init(){ // Setup accessibility
if(s.params.nextButton){var nextButton=$(s.params.nextButton);s.a11y.makeFocusable(nextButton);s.a11y.addRole(nextButton,'button');s.a11y.addLabel(nextButton,s.params.nextSlideMessage);}if(s.params.prevButton){var prevButton=$(s.params.prevButton);s.a11y.makeFocusable(prevButton);s.a11y.addRole(prevButton,'button');s.a11y.addLabel(prevButton,s.params.prevSlideMessage);}$(s.container).append(s.a11y.liveRegion);},initPagination:function initPagination(){if(s.params.pagination && s.params.paginationClickable && s.bullets && s.bullets.length){s.bullets.each(function(){var bullet=$(this);s.a11y.makeFocusable(bullet);s.a11y.addRole(bullet,'button');s.a11y.addLabel(bullet,s.params.paginationBulletMessage.replace(/{{index}}/,bullet.index() + 1));});}},destroy:function destroy(){if(s.a11y.liveRegion && s.a11y.liveRegion.length > 0)s.a11y.liveRegion.remove();}}; /*=========================
      Init/Destroy
      ===========================*/s.init = function(){if(s.params.loop)s.createLoop();s.updateContainerSize();s.updateSlidesSize();s.updatePagination();if(s.params.scrollbar && s.scrollbar){s.scrollbar.set();if(s.params.scrollbarDraggable){s.scrollbar.enableDraggable();}}if(s.params.effect !== 'slide' && s.effects[s.params.effect]){if(!s.params.loop)s.updateProgress();s.effects[s.params.effect].setTranslate();}if(s.params.loop){s.slideTo(s.params.initialSlide + s.loopedSlides,0,s.params.runCallbacksOnInit);}else {s.slideTo(s.params.initialSlide,0,s.params.runCallbacksOnInit);if(s.params.initialSlide === 0){if(s.parallax && s.params.parallax)s.parallax.setTranslate();if(s.lazy && s.params.lazyLoading){s.lazy.load();s.lazy.initialImageLoaded = true;}}}s.attachEvents();if(s.params.observer && s.support.observer){s.initObservers();}if(s.params.preloadImages && !s.params.lazyLoading){s.preloadImages();}if(s.params.autoplay){s.startAutoplay();}if(s.params.keyboardControl){if(s.enableKeyboardControl)s.enableKeyboardControl();}if(s.params.mousewheelControl){if(s.enableMousewheelControl)s.enableMousewheelControl();}if(s.params.hashnav){if(s.hashnav)s.hashnav.init();}if(s.params.a11y && s.a11y)s.a11y.init();s.emit('onInit',s);}; // Cleanup dynamic styles
s.cleanupStyles = function(){ // Container
s.container.removeClass(s.classNames.join(' ')).removeAttr('style'); // Wrapper
s.wrapper.removeAttr('style'); // Slides
if(s.slides && s.slides.length){s.slides.removeClass([s.params.slideVisibleClass,s.params.slideActiveClass,s.params.slideNextClass,s.params.slidePrevClass].join(' ')).removeAttr('style').removeAttr('data-swiper-column').removeAttr('data-swiper-row');} // Pagination/Bullets
if(s.paginationContainer && s.paginationContainer.length){s.paginationContainer.removeClass(s.params.paginationHiddenClass);}if(s.bullets && s.bullets.length){s.bullets.removeClass(s.params.bulletActiveClass);} // Buttons
if(s.params.prevButton)$(s.params.prevButton).removeClass(s.params.buttonDisabledClass);if(s.params.nextButton)$(s.params.nextButton).removeClass(s.params.buttonDisabledClass); // Scrollbar
if(s.params.scrollbar && s.scrollbar){if(s.scrollbar.track && s.scrollbar.track.length)s.scrollbar.track.removeAttr('style');if(s.scrollbar.drag && s.scrollbar.drag.length)s.scrollbar.drag.removeAttr('style');}}; // Destroy
s.destroy = function(deleteInstance,cleanupStyles){ // Detach evebts
s.detachEvents(); // Stop autoplay
s.stopAutoplay(); // Disable draggable
if(s.params.scrollbar && s.scrollbar){if(s.params.scrollbarDraggable){s.scrollbar.disableDraggable();}} // Destroy loop
if(s.params.loop){s.destroyLoop();} // Cleanup styles
if(cleanupStyles){s.cleanupStyles();} // Disconnect observer
s.disconnectObservers(); // Disable keyboard/mousewheel
if(s.params.keyboardControl){if(s.disableKeyboardControl)s.disableKeyboardControl();}if(s.params.mousewheelControl){if(s.disableMousewheelControl)s.disableMousewheelControl();} // Disable a11y
if(s.params.a11y && s.a11y)s.a11y.destroy(); // Destroy callback
s.emit('onDestroy'); // Delete instance
if(deleteInstance !== false)s = null;};s.init(); // Return swiper instance
return s;}; /*==================================================
    Prototype
====================================================*/Swiper.prototype = {isSafari:(function(){var ua=navigator.userAgent.toLowerCase();return ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0;})(),isUiWebView:/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent),isArray:function isArray(arr){return Object.prototype.toString.apply(arr) === '[object Array]';}, /*==================================================
    Browser
    ====================================================*/browser:{ie:window.navigator.pointerEnabled || window.navigator.msPointerEnabled,ieTouch:window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 1 || window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 1}, /*==================================================
    Devices
    ====================================================*/device:(function(){var ua=navigator.userAgent;var android=ua.match(/(Android);?[\s\/]+([\d.]+)?/);var ipad=ua.match(/(iPad).*OS\s([\d_]+)/);var ipod=ua.match(/(iPod)(.*OS\s([\d_]+))?/);var iphone=!ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);return {ios:ipad || iphone || ipod,android:android};})(), /*==================================================
    Feature Detection
    ====================================================*/support:{touch:window.Modernizr && Modernizr.touch === true || (function(){return !!('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch);})(),transforms3d:window.Modernizr && Modernizr.csstransforms3d === true || (function(){var div=document.createElement('div').style;return 'webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div;})(),flexbox:(function(){var div=document.createElement('div').style;var styles='alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient'.split(' ');for(var i=0;i < styles.length;i++) {if(styles[i] in div)return true;}})(),observer:(function(){return 'MutationObserver' in window || 'WebkitMutationObserver' in window;})()}, /*==================================================
    Plugins
    ====================================================*/plugins:{}};app.swiper = function(container,params){return new Swiper(container,params);};return app;};

},{}],98:[function(require,module,exports){
'use strict';

module.exports = function (app) {
    /* ===============================================================================
    ************   Tabs   ************
    =============================================================================== */
    app.showTab = function (tab, tabLink, force) {
        var newTab = $(tab);
        if (arguments.length === 2) {
            if (typeof tabLink === 'boolean') {
                force = tabLink;
            }
        }
        if (newTab.length === 0) return false;
        if (newTab.hasClass('active')) {
            if (force) newTab.trigger('show');
            return false;
        }
        var tabs = newTab.parent('.tabs');
        if (tabs.length === 0) return false;

        // Return swipeouts in hidden tabs
        app.allowSwipeout = true;

        // Animated tabs
        var isAnimatedTabs = tabs.parent().hasClass('tabs-animated-wrap');
        if (isAnimatedTabs) {
            var tabTranslate = (app.rtl ? newTab.index() : -newTab.index()) * 100;
            tabs.transform('translate3d(' + tabTranslate + '%,0,0)');
        }

        // Swipeable tabs
        var isSwipeableTabs = tabs.parent().hasClass('tabs-swipeable-wrap'),
            swiper;
        if (isSwipeableTabs) {
            swiper = tabs.parent()[0].swiper;
            if (swiper.activeIndex !== newTab.index()) swiper.slideTo(newTab.index(), undefined, false);
        }

        // Remove active class from old tabs
        var oldTab = tabs.children('.tab.active').removeClass('active');
        // Add active class to new tab
        newTab.addClass('active');
        // Trigger 'show' event on new tab
        newTab.trigger('show');

        // Update navbars in new tab
        if (!isAnimatedTabs && !isSwipeableTabs && newTab.find('.navbar').length > 0) {
            // Find tab's view
            var viewContainer;
            if (newTab.hasClass(app.params.viewClass)) viewContainer = newTab[0];else viewContainer = newTab.parents('.' + app.params.viewClass)[0];
            app.sizeNavbars(viewContainer);
        }

        // Find related link for new tab
        if (tabLink) tabLink = $(tabLink);else {
            // Search by id
            if (typeof tab === 'string') tabLink = $('.tab-link[href="' + tab + '"]');else tabLink = $('.tab-link[href="#' + newTab.attr('id') + '"]');
            // Search by data-tab
            if (!tabLink || tabLink && tabLink.length === 0) {
                $('[data-tab]').each(function () {
                    if (newTab.is($(this).attr('data-tab'))) tabLink = $(this);
                });
            }
        }
        if (tabLink.length === 0) return;

        // Find related link for old tab
        var oldTabLink;
        if (oldTab && oldTab.length > 0) {
            // Search by id
            var oldTabId = oldTab.attr('id');
            if (oldTabId) oldTabLink = $('.tab-link[href="#' + oldTabId + '"]');
            // Search by data-tab
            if (!oldTabLink || oldTabLink && oldTabLink.length === 0) {
                $('[data-tab]').each(function () {
                    if (oldTab.is($(this).attr('data-tab'))) oldTabLink = $(this);
                });
            }
        }

        // Update links' classes
        if (tabLink && tabLink.length > 0) {
            tabLink.addClass('active');
            // Material Highlight
            if (app.params.material) {
                var tabbar = tabLink.parents('.tabbar');
                if (tabbar.length > 0) {
                    if (tabbar.find('.tab-link-highlight').length === 0) {
                        tabbar.find('.toolbar-inner').append('<span class="tab-link-highlight"></span>');
                    }
                    app.materialTabbarSetHighlight(tabbar, tabLink);
                }
            }
        }
        if (oldTabLink && oldTabLink.length > 0) oldTabLink.removeClass('active');

        return true;
    };
    return app;
};

},{}],99:[function(require,module,exports){
/*===========================
Template7 Template engine
===========================*/
'use strict';

window.Template7 = (function () {
    function isArray(arr) {
        return Object.prototype.toString.apply(arr) === '[object Array]';
    }
    function isObject(obj) {
        return obj instanceof Object;
    }
    function isFunction(func) {
        return typeof func === 'function';
    }
    var cache = {};
    function helperToSlices(string) {
        var helperParts = string.replace(/[{}#}]/g, '').split(' ');
        var slices = [];
        var shiftIndex, i, j;
        for (i = 0; i < helperParts.length; i++) {
            var part = helperParts[i];
            if (i === 0) slices.push(part);else {
                if (part.indexOf('"') === 0) {
                    // Plain String
                    if (part.match(/"/g).length === 2) {
                        // One word string
                        slices.push(part);
                    } else {
                        // Find closed Index
                        shiftIndex = 0;
                        for (j = i + 1; j < helperParts.length; j++) {
                            part += ' ' + helperParts[j];
                            if (helperParts[j].indexOf('"') >= 0) {
                                shiftIndex = j;
                                slices.push(part);
                                break;
                            }
                        }
                        if (shiftIndex) i = shiftIndex;
                    }
                } else {
                    if (part.indexOf('=') > 0) {
                        // Hash
                        var hashParts = part.split('=');
                        var hashName = hashParts[0];
                        var hashContent = hashParts[1];
                        if (hashContent.match(/"/g).length !== 2) {
                            shiftIndex = 0;
                            for (j = i + 1; j < helperParts.length; j++) {
                                hashContent += ' ' + helperParts[j];
                                if (helperParts[j].indexOf('"') >= 0) {
                                    shiftIndex = j;
                                    break;
                                }
                            }
                            if (shiftIndex) i = shiftIndex;
                        }
                        var hash = [hashName, hashContent.replace(/"/g, '')];
                        slices.push(hash);
                    } else {
                        // Plain variable
                        slices.push(part);
                    }
                }
            }
        }
        return slices;
    }
    function stringToBlocks(string) {
        var blocks = [],
            i,
            j,
            k;
        if (!string) return [];
        var _blocks = string.split(/({{[^{^}]*}})/);
        for (i = 0; i < _blocks.length; i++) {
            var block = _blocks[i];
            if (block === '') continue;
            if (block.indexOf('{{') < 0) {
                blocks.push({
                    type: 'plain',
                    content: block
                });
            } else {
                if (block.indexOf('{/') >= 0) {
                    continue;
                }
                if (block.indexOf('{#') < 0 && block.indexOf(' ') < 0 && block.indexOf('else') < 0) {
                    // Simple variable
                    blocks.push({
                        type: 'variable',
                        contextName: block.replace(/[{}]/g, '')
                    });
                    continue;
                }
                // Helpers
                var helperSlices = helperToSlices(block);
                var helperName = helperSlices[0];
                var isPartial = helperName === '>';
                var helperContext = [];
                var helperHash = {};
                for (j = 1; j < helperSlices.length; j++) {
                    var slice = helperSlices[j];
                    if (isArray(slice)) {
                        // Hash
                        helperHash[slice[0]] = slice[1] === 'false' ? false : slice[1];
                    } else {
                        helperContext.push(slice);
                    }
                }

                if (block.indexOf('{#') >= 0) {
                    // Condition/Helper
                    var helperStartIndex = i;
                    var helperContent = '';
                    var elseContent = '';
                    var toSkip = 0;
                    var shiftIndex;
                    var foundClosed = false,
                        foundElse = false,
                        foundClosedElse = false,
                        depth = 0;
                    for (j = i + 1; j < _blocks.length; j++) {
                        if (_blocks[j].indexOf('{{#') >= 0) {
                            depth++;
                        }
                        if (_blocks[j].indexOf('{{/') >= 0) {
                            depth--;
                        }
                        if (_blocks[j].indexOf('{{#' + helperName) >= 0) {
                            helperContent += _blocks[j];
                            if (foundElse) elseContent += _blocks[j];
                            toSkip++;
                        } else if (_blocks[j].indexOf('{{/' + helperName) >= 0) {
                            if (toSkip > 0) {
                                toSkip--;
                                helperContent += _blocks[j];
                                if (foundElse) elseContent += _blocks[j];
                            } else {
                                shiftIndex = j;
                                foundClosed = true;
                                break;
                            }
                        } else if (_blocks[j].indexOf('else') >= 0 && depth === 0) {
                            foundElse = true;
                        } else {
                            if (!foundElse) helperContent += _blocks[j];
                            if (foundElse) elseContent += _blocks[j];
                        }
                    }
                    if (foundClosed) {
                        if (shiftIndex) i = shiftIndex;
                        blocks.push({
                            type: 'helper',
                            helperName: helperName,
                            contextName: helperContext,
                            content: helperContent,
                            inverseContent: elseContent,
                            hash: helperHash
                        });
                    }
                } else if (block.indexOf(' ') > 0) {
                    if (isPartial) {
                        helperName = '_partial';
                        if (helperContext[0]) helperContext[0] = '"' + helperContext[0].replace(/"|'/g, '') + '"';
                    }
                    blocks.push({
                        type: 'helper',
                        helperName: helperName,
                        contextName: helperContext,
                        hash: helperHash
                    });
                }
            }
        }
        return blocks;
    }
    var Template7 = function Template7(template) {
        var t = this;
        t.template = template;

        function getCompileFn(block, depth) {
            if (block.content) return compile(block.content, depth);else return function () {
                return '';
            };
        }
        function getCompileInverse(block, depth) {
            if (block.inverseContent) return compile(block.inverseContent, depth);else return function () {
                return '';
            };
        }
        function getCompileVar(name, ctx) {
            var variable,
                parts,
                levelsUp = 0,
                initialCtx = ctx;
            if (name.indexOf('../') === 0) {
                levelsUp = name.split('../').length - 1;
                var newDepth = ctx.split('_')[1] - levelsUp;
                ctx = 'ctx_' + (newDepth >= 1 ? newDepth : 1);
                parts = name.split('../')[levelsUp].split('.');
            } else if (name.indexOf('@global') === 0) {
                ctx = 'Template7.global';
                parts = name.split('@global.')[1].split('.');
            } else if (name.indexOf('@root') === 0) {
                ctx = 'root';
                parts = name.split('@root.')[1].split('.');
            } else {
                parts = name.split('.');
            }
            variable = ctx;
            for (var i = 0; i < parts.length; i++) {
                var part = parts[i];
                if (part.indexOf('@') === 0) {
                    if (i > 0) {
                        variable += '[(data && data.' + part.replace('@', '') + ')]';
                    } else {
                        variable = '(data && data.' + name.replace('@', '') + ')';
                    }
                } else {
                    if (isFinite(part)) {
                        variable += '[' + part + ']';
                    } else {
                        if (part.indexOf('this') === 0) {
                            variable = part.replace('this', ctx);
                        } else {
                            variable += '.' + part;
                        }
                    }
                }
            }

            return variable;
        }
        function getCompiledArguments(contextArray, ctx) {
            var arr = [];
            for (var i = 0; i < contextArray.length; i++) {
                if (contextArray[i].indexOf('"') === 0) arr.push(contextArray[i]);else {
                    arr.push(getCompileVar(contextArray[i], ctx));
                }
            }

            return arr.join(', ');
        }
        function compile(template, depth) {
            depth = depth || 1;
            template = template || t.template;
            if (typeof template !== 'string') {
                throw new Error('Template7: Template must be a string');
            }
            var blocks = stringToBlocks(template);
            if (blocks.length === 0) {
                return function () {
                    return '';
                };
            }
            var ctx = 'ctx_' + depth;
            var resultString = '';
            if (depth === 1) {
                resultString += '(function (' + ctx + ', data, root) {\n';
            } else {
                resultString += '(function (' + ctx + ', data) {\n';
            }
            if (depth === 1) {
                resultString += 'function isArray(arr){return Object.prototype.toString.apply(arr) === \'[object Array]\';}\n';
                resultString += 'function isFunction(func){return (typeof func === \'function\');}\n';
                resultString += 'function c(val, ctx) {if (typeof val !== "undefined" && val !== null) {if (isFunction(val)) {return val.call(ctx);} else return val;} else return "";}\n';
                resultString += 'root = root || ctx_1 || {};\n';
            }
            resultString += 'var r = \'\';\n';
            var i, j, context;
            for (i = 0; i < blocks.length; i++) {
                var block = blocks[i];
                // Plain block
                if (block.type === 'plain') {
                    resultString += 'r +=\'' + block.content.replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/'/g, '\\' + '\'') + '\';';
                    continue;
                }
                var variable, compiledArguments;
                // Variable block
                if (block.type === 'variable') {
                    variable = getCompileVar(block.contextName, ctx);
                    resultString += 'r += c(' + variable + ', ' + ctx + ');';
                }
                // Helpers block
                if (block.type === 'helper') {
                    if (block.helperName in t.helpers) {
                        compiledArguments = getCompiledArguments(block.contextName, ctx);

                        resultString += 'r += (Template7.helpers.' + block.helperName + ').call(' + ctx + ', ' + (compiledArguments && compiledArguments + ', ') + '{hash:' + JSON.stringify(block.hash) + ', data: data || {}, fn: ' + getCompileFn(block, depth + 1) + ', inverse: ' + getCompileInverse(block, depth + 1) + ', root: root});';
                    } else {
                        if (block.contextName.length > 0) {
                            throw new Error('Template7: Missing helper: "' + block.helperName + '"');
                        } else {
                            variable = getCompileVar(block.helperName, ctx);
                            resultString += 'if (' + variable + ') {';
                            resultString += 'if (isArray(' + variable + ')) {';
                            resultString += 'r += (Template7.helpers.each).call(' + ctx + ', ' + variable + ', {hash:' + JSON.stringify(block.hash) + ', data: data || {}, fn: ' + getCompileFn(block, depth + 1) + ', inverse: ' + getCompileInverse(block, depth + 1) + ', root: root});';
                            resultString += '}else {';
                            resultString += 'r += (Template7.helpers.with).call(' + ctx + ', ' + variable + ', {hash:' + JSON.stringify(block.hash) + ', data: data || {}, fn: ' + getCompileFn(block, depth + 1) + ', inverse: ' + getCompileInverse(block, depth + 1) + ', root: root});';
                            resultString += '}}';
                        }
                    }
                }
            }
            resultString += '\nreturn r;})';
            return eval.call(window, resultString);
        }
        t.compile = function (template) {
            if (!t.compiled) {
                t.compiled = compile(template);
            }
            return t.compiled;
        };
    };
    Template7.prototype = {
        options: {},
        partials: {},
        helpers: {
            '_partial': function _partial(partialName, options) {
                var p = Template7.prototype.partials[partialName];
                if (!p || p && !p.template) return '';
                if (!p.compiled) {
                    p.compiled = t7.compile(p.template);
                }
                var ctx = this;
                for (var hashName in options.hash) {
                    ctx[hashName] = options.hash[hashName];
                }
                return p.compiled(ctx, options.data, options.root);
            },
            'escape': function escape(context, options) {
                if (typeof context !== 'string') {
                    throw new Error('Template7: Passed context to "escape" helper should be a string');
                }
                return context.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            },
            'if': function _if(context, options) {
                if (isFunction(context)) {
                    context = context.call(this);
                }
                if (context) {
                    return options.fn(this, options.data);
                } else {
                    return options.inverse(this, options.data);
                }
            },
            'unless': function unless(context, options) {
                if (isFunction(context)) {
                    context = context.call(this);
                }
                if (!context) {
                    return options.fn(this, options.data);
                } else {
                    return options.inverse(this, options.data);
                }
            },
            'each': function each(context, options) {
                var ret = '',
                    i = 0;
                if (isFunction(context)) {
                    context = context.call(this);
                }
                if (isArray(context)) {
                    if (options.hash.reverse) {
                        context = context.reverse();
                    }
                    for (i = 0; i < context.length; i++) {
                        ret += options.fn(context[i], { first: i === 0, last: i === context.length - 1, index: i });
                    }
                    if (options.hash.reverse) {
                        context = context.reverse();
                    }
                } else {
                    for (var key in context) {
                        i++;
                        ret += options.fn(context[key], { key: key });
                    }
                }
                if (i > 0) return ret;else return options.inverse(this);
            },
            'with': function _with(context, options) {
                if (isFunction(context)) {
                    context = context.call(this);
                }
                return options.fn(context);
            },
            'join': function join(context, options) {
                if (isFunction(context)) {
                    context = context.call(this);
                }
                return context.join(options.hash.delimiter || options.hash.delimeter);
            },
            'js': function js(expression, options) {
                var func;
                if (expression.indexOf('return') >= 0) {
                    func = '(function(){' + expression + '})';
                } else {
                    func = '(function(){return (' + expression + ')})';
                }
                return eval.call(this, func).call(this);
            },
            'js_compare': function js_compare(expression, options) {
                var func;
                if (expression.indexOf('return') >= 0) {
                    func = '(function(){' + expression + '})';
                } else {
                    func = '(function(){return (' + expression + ')})';
                }
                var condition = eval.call(this, func).call(this);
                if (condition) {
                    return options.fn(this, options.data);
                } else {
                    return options.inverse(this, options.data);
                }
            }
        }
    };
    var t7 = function t7(template, data) {
        if (arguments.length === 2) {
            var instance = new Template7(template);
            var rendered = instance.compile()(data);
            instance = null;
            return rendered;
        } else return new Template7(template);
    };
    t7.registerHelper = function (name, fn) {
        Template7.prototype.helpers[name] = fn;
    };
    t7.unregisterHelper = function (name) {
        Template7.prototype.helpers[name] = undefined;
        delete Template7.prototype.helpers[name];
    };
    t7.registerPartial = function (name, template) {
        Template7.prototype.partials[name] = { template: template };
    };
    t7.unregisterPartial = function (name, template) {
        if (Template7.prototype.partials[name]) {
            Template7.prototype.partials[name] = undefined;
            delete Template7.prototype.partials[name];
        }
    };

    t7.compile = function (template, options) {
        var instance = new Template7(template, options);
        return instance.compile();
    };

    t7.options = Template7.prototype.options;
    t7.helpers = Template7.prototype.helpers;
    t7.partials = Template7.prototype.partials;
    return t7;
})();

module.exports = window.Template7;

},{}],100:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    getDefaultProps: function getDefaultProps() {
        return {
            per: 100
        };
    },
    render: function render() {
        var obj = {};
        obj['col-' + this.props.per] = true;
        this.props['class'] && (obj[this.props['class']] = true);
        var className = cn(obj);
        if (this.props.p) {
            return React.createElement(
                'p',
                { className: className },
                this.props.children
            );
        } else {
            return React.createElement(
                'div',
                { className: className },
                this.props.children
            );
        }
    }
});

},{"classnames":43,"react":undefined}],101:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    getDefaultProps: function getDefaultProps() {
        return {
            noGutter: false
        };
    },
    render: function render() {
        var className = cn({
            'no-gutter': this.props.noGutter,
            'row': true
        });
        return React.createElement(
            'div',
            { className: className },
            this.props.children
        );
    }
});

},{"classnames":43,"react":undefined}],102:[function(require,module,exports){
'use strict';

module.exports = {
	Col: require('./Col'),
	Row: require('./Row')
};

},{"./Col":100,"./Row":101}],103:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');
var assign = require('object-assign');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        var obj = {
            'icon': true
        };
        this.props.name && (obj[this.props.name] = true);
        var className = cn(obj);

        var style = {};
        if (this.props.round) {
            style.borderRadius = '50%';
        }
        if (this.props.color) {
            style.color = this.props.color;
        }
        style = assign(style, this.props.style);
        return React.createElement('i', { className: className, style: style });
    }
});

},{"classnames":43,"object-assign":44,"react":undefined}],104:[function(require,module,exports){
'use strict';

module.exports = {
	Icon: require('./Icon')
};

},{"./Icon":103}],105:[function(require,module,exports){
'use strict';

module.exports = {
	Accordion: require('./accordion'),
	Badge: require('./badge'),
	Button: require('./button'),
	Chip: require('./chip'),
	Card: require('./card'),
	Content: require('./content'),
	Form: require('./form'),
	Grid: require('./grid'),
	Icon: require('./icon'),
	List: require('./list'),
	Modal: require('./modal'),
	Message: require('./message'),
	Mixins: require('./mixins'),
	Refresh: require('./refresh'),
	Search: require('./search'),
	Welcome: require('./welcome'),
	System: require('./system'),
	View: require('./view')
};

},{"./accordion":50,"./badge":52,"./button":57,"./card":63,"./chip":65,"./content":69,"./form":74,"./grid":102,"./icon":104,"./list":124,"./message":129,"./mixins":133,"./modal":142,"./refresh":145,"./search":149,"./system":152,"./view":156,"./welcome":165}],106:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "li",
            { className: "list-group-title" },
            this.props.children
        );
    }
});

},{"react":undefined}],107:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

function IndexedList(params) {
    var p = this;
    var isTouched,
        lastLetter,
        lastPreviewLetter,
        groupPostion = {};
    var eventsTarget = params.container;

    var pageContainer = $('.page');
    var pageContent = $('.page').find('.page-content');
    var searchBar = $(pageContainer).find('.searchbar').length > 0;
    var serachBarOffset = searchBar * 44;
    var fixedNavbar = pageContent.parents('.navbar-fixed').length > 0 || pageContent.parents('.navbar-through').length > 0;
    var fixedNavbarOffset = fixedNavbar * 44;
    var toolBar = pageContent.parents('.toolbar-through').length > 0;
    var toolBarOffset = toolBar * 44;

    function callback(letter) {
        var scrollToEl = pageContent.find('.list-group ul li[data-index-letter="' + letter + '"]');
        if (!scrollToEl.length) return;
        var scrollTop = scrollToEl.offset().top + pageContent.scrollTop() - fixedNavbarOffset - serachBarOffset;
        pageContent.scrollTop(scrollTop);
    }

    function handleTouchStart(e) {
        e.preventDefault();
        isTouched = true;

        var target = $(e.target);
        if (!target.is('li')) target = target.parents('li');
        if (target.length > 0) {
            scrollToLetter(target.eq(0).data('index-letter'));
        }
    }

    function handleTouchMove(e) {
        if (!isTouched) return;
        e.preventDefault();
        var target;
        if (e.type === 'mousemove') {
            target = $(e.target);
        } else {
            target = $(document.elementFromPoint(e.touches[0].pageX, e.touches[0].pageY));
        }
        if (!target.is('li')) target = target.parents('li');

        if (target.length === 0) return;
        if (target.length > 0 && !target.is('.list-index li')) return;

        scrollToLetter(target.eq(0).data('index-letter'));
    }

    function handleTouchEnd(e) {
        isTouched = false;
    }

    function handleClick(e) {
        var target = $(e.target);
        if (!target.is('li')) target = target.parents('li');
        if (target.length > 0) {
            scrollToLetter(target.eq(0).data('index-letter'));
        }
    }

    function handlePageScroll() {
        var inf = $(this);
        var scrollTop = inf[0].scrollTop;
        var scrollHeight = inf[0].scrollHeight;
        var height = inf[0].offsetHeight;

        var prevLetter = 'A';
        for (var letter in groupPostion) {
            var top = groupPostion[letter].offset().top - toolBarOffset - searchBar;
            if (top >= 0) {
                break;
            }
            prevLetter = letter;
        }
        if (lastPreviewLetter !== prevLetter) {
            lastPreviewLetter = prevLetter;
            params.callback(prevLetter);
        }
    }

    function scrollToLetter(letter) {
        if (lastLetter !== letter) {
            lastLetter = letter;
            callback(letter);
            params.callback(letter);
        }
    }

    p.init = function () {
        if (searchBar) {
            eventsTarget.css('margin-top', '44px');
        }
        params.letters.map(function (letter) {
            groupPostion[letter] = pageContent.find('.list-group ul li[data-index-letter="' + letter + '"]');
        });

        pageContent.on('scroll', handlePageScroll);

        eventsTarget.on('click', '.list-index li', handleClick);
        eventsTarget.on(app.touchEvents.start, handleTouchStart);
        eventsTarget.on(app.touchEvents.move, handleTouchMove);
        eventsTarget.on(app.touchEvents.end, handleTouchEnd);
    };

    p.destory = function () {
        eventsTarget.off('click', '.list-index li', handleClick);
        eventsTarget.off(app.touchEvents.start, handleTouchStart);
        eventsTarget.off(app.touchEvents.move, handleTouchMove);
        eventsTarget.off(app.touchEvents.end, handleTouchEnd);
    };

    return p;
}

module.exports = React.createClass({
    displayName: 'exports',

    getInitialState: function getInitialState() {
        return {
            activeAlpha: this.props.letters[0]
        };
    },
    componentDidMount: function componentDidMount() {
        var self = this;
        var callback = app.methods.setActiveAlpha = function (letter) {
            self.setState({ activeAlpha: letter });
        };
        this.indexedList = new IndexedList({
            container: $(this.refs.list.getDOMNode()),
            callback: callback,
            letters: this.props.letters
        });
        this.indexedList.init();
    },
    componentWillUnmount: function componentWillUnmount() {
        this.indexedList.destory();
    },
    render: function render() {
        var _this = this;

        return React.createElement(
            'ul',
            {
                className: 'list-index',
                ref: 'list',
                style: this.props.style },
            this.props.letters.map(function (letter) {
                var obj = {};
                if (_this.state.activeAlpha == letter) {
                    obj.active = true;
                }
                return React.createElement(
                    'li',
                    {
                        key: letter,
                        className: cn(obj),
                        'data-index-letter': letter },
                    letter
                );
            })
        );
    }
});

},{"classnames":43,"react":undefined}],108:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "item-after" },
            this.props.children
        );
    }
});

},{"react":undefined}],109:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    onChange: function onChange(i, e) {
        this.props.onChange(i, e.target.checked);
    },
    render: function render() {
        var content;
        if (this.props.link) {
            if (this.props.swipeout) {
                content = React.createElement(
                    'div',
                    { className: 'swipeout-content' },
                    React.createElement(
                        'a',
                        {
                            href: '#',
                            className: 'item-link item-content',
                            onClick: this.props.onTap },
                        this.props.children
                    )
                );
            } else {
                content = React.createElement(
                    'a',
                    {
                        href: '#',
                        className: 'item-link item-content',
                        onClick: this.props.onTap },
                    this.props.children
                );
            }
        } else {
            var dcn = cn("item-content", { "swipeout-content": this.props.swipeout });
            content = React.createElement(
                'div',
                { className: dcn, onClick: this.props.onTap },
                this.props.children
            );
        }
        var className = cn({ "swipeout": this.props.swipeout });

        if (this.props.radio) {
            var onChange = this.onChange.bind(null, this.props.value);
            return React.createElement(
                'li',
                null,
                React.createElement(
                    'label',
                    { className: 'label-radio item-content' },
                    React.createElement('input', {
                        type: 'radio',
                        value: this.props.value,
                        name: this.props.name,
                        defaultChecked: this.props.checked,
                        onChange: onChange }),
                    app.params.material && React.createElement(
                        'div',
                        { className: 'item-media' },
                        React.createElement('i', { className: 'icon icon-form-radio' })
                    ),
                    this.props.children
                )
            );
        } else if (this.props.checkbox) {
            var onChange = this.onChange.bind(null, this.props.value);
            return React.createElement(
                'li',
                null,
                React.createElement(
                    'label',
                    { className: 'label-checkbox item-content' },
                    React.createElement('input', {
                        type: 'checkbox',
                        value: this.props.value,
                        name: this.props.name,
                        defaultChecked: this.props.checked,
                        onChange: onChange }),
                    React.createElement(
                        'div',
                        { className: 'item-media' },
                        React.createElement('i', { className: 'icon icon-form-checkbox' })
                    ),
                    this.props.children
                )
            );
        } else {
            return React.createElement(
                'li',
                { className: className },
                content,
                this.props.sortable && React.createElement('div', { className: 'sortable-handler' }),
                this.props.swipeoutLeft && React.createElement(
                    'div',
                    { className: 'swipeout-actions-left' },
                    this.props.swipeoutLeft
                ),
                this.props.swipeoutRight && React.createElement(
                    'div',
                    { className: 'swipeout-actions-right' },
                    this.props.swipeoutRight
                )
            );
        }
    }
});

},{"classnames":43,"react":undefined}],110:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "li",
            { className: "item-divider" },
            this.props.children
        );
    }
});

},{"react":undefined}],111:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            {
                className: "item-inner",
                style: this.props.style,
                onClick: this.props.onTap },
            this.props.children
        );
    }
});

},{"react":undefined}],112:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "item-input" },
            this.props.children
        );
    }
});

},{"react":undefined}],113:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    getDefaultProps: function getDefaultProps() {
        return {
            link: false
        };
    },
    render: function render() {
        return React.createElement(
            "a",
            {
                href: "#",
                className: "item-link item-content",
                onClick: this.props.onTap },
            this.props.children
        );
    }
});

},{"react":undefined}],114:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "item-media" },
            this.props.children
        );
    }
});

},{"react":undefined}],115:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "item-subtitle" },
            this.props.children
        );
    }
});

},{"react":undefined}],116:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            {
                className: "item-text",
                style: this.props.style },
            this.props.children
        );
    }
});

},{"react":undefined}],117:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        var className = cn({
            "item-title": true,
            "label": this.props.label
        });
        return React.createElement(
            'div',
            {
                className: className,
                style: this.props.style },
            this.props.children
        );
    }
});

},{"classnames":43,"react":undefined}],118:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "item-title-row" },
            this.props.children
        );
    }
});

},{"react":undefined}],119:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
	displayName: 'exports',

	render: function render() {
		var obj = {
			'list-block': true,
			'inset': this.props.inset,
			'list-block-label': this.props.tabletInset,
			'media-list': this.props.media,
			'sortable': this.props.sortable,
			'inputs-list': this.props.inputs && app.params.material
		};
		this.props['class'] && (obj[this.props['class']] = true);
		var className = cn(obj);

		var style = this.props.block ? {} : { margin: '0px 0px' };
		if (this.props.group) {
			return React.createElement(
				'div',
				{ className: className, style: style },
				this.props.children
			);
		} else if (this.props.sortable || this.props.swipeout) {
			return React.createElement(
				'div',
				{
					className: className,
					style: style,
					ref: 'container' },
				React.createElement(
					'ul',
					null,
					this.props.children
				)
			);
		} else {
			return React.createElement(
				'div',
				{ className: className, style: style },
				React.createElement(
					'ul',
					null,
					this.props.children
				)
			);
		}
	}
});

},{"classnames":43,"react":undefined}],120:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "li",
            { className: "list-block-label" },
            this.props.children
        );
    }
});

},{"react":undefined}],121:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "list-group" },
            React.createElement(
                "ul",
                null,
                this.props.children
            )
        );
    }
});

},{"react":undefined}],122:[function(require,module,exports){
"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "li",
            _extends({
                className: "list-group-title" }, this.props.data),
            this.props.children
        );
    }
});

},{"react":undefined}],123:[function(require,module,exports){
'use strict';

var React = require('react');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        return React.createElement(
            'ul',
            null,
            this.props.children
        );
    }
});

},{"react":undefined}],124:[function(require,module,exports){
'use strict';

module.exports = {
	GroupTitle: require('./GroupTitle'),
	ItemAfter: require('./ItemAfter'),
	ItemContent: require('./ItemContent'),
	ItemDivider: require('./ItemDivider'),
	ItemInner: require('./ItemInner'),
	ItemInput: require('./ItemInput'),
	ItemLink: require('./ItemLink'),
	ItemMedia: require('./ItemMedia'),
	ItemSubTitle: require('./ItemSubTitle'),
	ItemText: require('./ItemText'),
	ItemTitle: require('./ItemTitle'),
	ItemTitleRow: require('./ItemTitleRow'),
	List: require('./List'),
	ListBlockLabel: require('./ListBlockLabel'),
	ListGroup: require('./ListGroup'),
	ListGroupTitle: require('./ListGroupTitle'),
	IndexedList: require('./IndexedList'),
	SubList: require('./SubList')
};

},{"./GroupTitle":106,"./IndexedList":107,"./ItemAfter":108,"./ItemContent":109,"./ItemDivider":110,"./ItemInner":111,"./ItemInput":112,"./ItemLink":113,"./ItemMedia":114,"./ItemSubTitle":115,"./ItemText":116,"./ItemTitle":117,"./ItemTitleRow":118,"./List":119,"./ListBlockLabel":120,"./ListGroup":121,"./ListGroupTitle":122,"./SubList":123}],125:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "messages-date" },
            this.props.children
        );
    }
});

},{"react":undefined}],126:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        var className = cn('message', {
            'message-sent': this.props.sent,
            'message-received': !this.props.sent,
            'message-last message-with-tail': this.props.tail,
            'message-with-avatar': !!this.props.avatar,
            'message-name': !!this.props.name,
            'message-pic': !!this.props.pic
        });
        var children = {};
        if (this.props.name) {
            children.name = React.createElement(
                'div',
                {
                    className: 'message-name',
                    style: this.props.nameStyle },
                this.props.name
            );
        }
        if (this.props.pic) {
            children.text = React.createElement(
                'div',
                { className: 'message-text' },
                React.createElement('img', { src: this.props.pic })
            );
        } else {
            children.text = React.createElement(
                'div',
                { className: 'message-text' },
                this.props.children
            );
        }
        if (this.props.label) {
            children.label = React.createElement(
                'div',
                { className: 'message-label' },
                this.props.label
            );
        }
        if (this.props.avatar) {
            children.avatar = React.createElement('div', { className: "message-avatar default_head user_head_" + this.props.avatar });
        }
        return React.createElement(
            'div',
            { className: className },
            React.addons.createFragment(children)
        );
    }
});

},{"classnames":43,"react":undefined}],127:[function(require,module,exports){
/*framework7-base messagebar.js*/
'use strict';

var React = require('react');
var cn = require('classnames');

var Messagebar = function Messagebar(container, maxRows) {
    var m = this;
    m.container = container;
    m.textarea = m.container.find('textarea');
    m.buttons = m.container.find('a');
    m.pageContainer = m.container.parents('.page').eq(0);
    m.pageContent = m.pageContainer.find('.page-content');
    m.buttonsHeight = parseInt(m.buttons.css('height'));
    var maxHeight = parseInt(m.textarea.css('line-height')) * (maxRows + 1);

    // Initial Sizes
    m.pageContentPadding = parseInt(m.pageContent.css('padding-bottom'));
    m.initialBarHeight = m.container[0].offsetHeight;
    m.initialAreaHeight = m.textarea[0].offsetHeight;

    // Resize textarea
    m.sizeTextarea = function () {
        // Reset
        m.textarea.css({ 'height': '' });

        var height = m.textarea[0].offsetHeight;
        var diff = height - m.textarea[0].clientHeight;
        var scrollHeight = m.textarea[0].scrollHeight;

        // Update
        if (scrollHeight + diff > height) {
            var newAreaHeight = scrollHeight + diff;
            var newBarHeight = m.initialBarHeight + (newAreaHeight - m.initialAreaHeight);
            var maxBarHeight = maxHeight;
            if (newBarHeight > maxBarHeight) {
                newBarHeight = parseInt(maxBarHeight, 10);
                newAreaHeight = newBarHeight - m.initialBarHeight + m.initialAreaHeight;
            }
            m.textarea.css('height', newAreaHeight + 'px');
            m.container.css('height', newBarHeight + 'px');
            m.buttons.css('bottom', (newBarHeight - m.buttonsHeight) / 2 + 'px');
            var onBottom = m.pageContent[0].scrollTop === m.pageContent[0].scrollHeight - m.pageContent[0].offsetHeight;
            if (m.pageContent.length > 0) {
                m.pageContent.css('padding-bottom', newBarHeight + 'px');
                if (m.pageContent.find('.messages-new-first').length === 0 && onBottom) {
                    m.pageContent.scrollTop(m.pageContent[0].scrollHeight - m.pageContent[0].offsetHeight);
                }
            }
        } else {
            if (m.pageContent.length > 0) {
                m.container.css({ 'height': '', 'bottom': '' });
                m.pageContent.css({ 'padding-bottom': '' });
                m.buttons.css('bottom', '');
            }
        }
    };

    // Clear
    m.clear = function () {
        m.textarea.val('').trigger('change');
    };
    m.value = function (value) {
        if (typeof value === 'undefined') return m.textarea.val();else m.textarea.val(value).trigger('change');
    };

    // Handle textarea
    m.textareaTimeout = undefined;
    m.handleTextarea = function (e) {
        clearTimeout(m.textareaTimeout);
        m.textareaTimeout = setTimeout(function () {
            m.sizeTextarea();
        }, 0);
    };

    //Events
    function preventSubmit(e) {
        e.preventDefault();
    }

    m.attachEvents = function (destroy) {
        var method = destroy ? 'off' : 'on';
        m.container[method]('submit', preventSubmit);
        m.textarea[method]('change keydown keypress keyup paste cut', m.handleTextarea);
    };
    m.detachEvents = function () {
        m.attachEvents(true);
    };

    // Init Destroy
    m.init = function () {
        m.attachEvents();
    };
    m.destroy = function () {
        m.detachEvents();
        m = null;
    };
    m.init();

    return m;
};

module.exports = React.createClass({
    displayName: 'exports',

    getDefaultProps: function getDefaultProps() {
        return {
            maxRows: 5,
            sendChecked: true
        };
    },
    getInitialState: function getInitialState() {
        var value = this.props.value || '';
        return {
            value: value
        };
    },
    componentDidMount: function componentDidMount() {
        this.messagebar = new Messagebar($(this.refs.messagebar.getDOMNode()), this.props.maxRows);
    },
    componentWillUnmount: function componentWillUnmount() {
        this.messagebar.destroy();
    },
    handleChange: function handleChange(e) {
        var value = e.target.value;
        this.setState({
            value: value
        });
    },
    getValue: function getValue() {
        return this.state.value;
    },
    setValue: function setValue(value) {
        this.setState({
            value: value
        });
    },
    render: function render() {
        var canSend = this.props.sendChecked && this.state.value.length;
        var sendButtonStyle = canSend ? { color: "#007aff" } : { color: "gray" };
        var onSend = canSend && this.props.onSend;
        return React.createElement(
            'div',
            {
                className: 'toolbar messagebar',
                ref: 'messagebar' },
            React.createElement(
                'div',
                { className: 'toolbar-inner' },
                React.createElement(
                    'a',
                    { className: 'link icon-only' },
                    React.createElement('i', { className: 'icon icon-camera' })
                ),
                React.createElement('textarea', {
                    placeholder: 'Message',
                    value: this.state.value,
                    onChange: this.handleChange }),
                React.createElement(
                    'a',
                    {
                        className: 'link',
                        style: sendButtonStyle,
                        onClick: onSend },
                    'Send'
                )
            )
        );
    }
});

},{"classnames":43,"react":undefined}],128:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "messages" },
            this.props.children
        );
    }
});

},{"react":undefined}],129:[function(require,module,exports){
'use strict';

module.exports = {
	MessageDate: require('./MessageDate'),
	Messages: require('./Messages'),
	MessageText: require('./MessageText'),
	MessageToolbar: require('./MessageToolbar')
};

},{"./MessageDate":125,"./MessageText":126,"./MessageToolbar":127,"./Messages":128}],130:[function(require,module,exports){
'use strict';

var assign = require('object-assign');
var React = require('react/addons');
var system = require('../system');
var Toast = require('../Toast').Toast;
var template7 = require('../framework7/template7.js');
var clicks = require('../framework7/clicks.js');
var fastClicks = require('../framework7/fast-clicks.js');
var materialInputs = require('../framework7/material-inputs.js');
var materialPreloader = require('../framework7/material-preloader.js');
var materialTabbar = require('../framework7/material-tabbar.js');
var swipeout = require('../framework7/swipeout.js');
var sortable = require('../framework7/sortable.js');
var swiper = require('../framework7/swiper.js');
var swiperInit = require('../framework7/swiper-init.js');
var navbars = require('../framework7/navbars.js');
var searchbar = require('../framework7/searchbar.js');
var scrollToolbars = require('../framework7/scroll-toolbars.js');
var photoBrowser = require('../framework7/photo-browser.js');
var notifications = require('../framework7/notifications.js');
var modals = require('../framework7/modals.js');
var picker = require('../framework7/picker.js');
var calendar = require('../framework7/calendar.js');
var panels = require('../framework7/panels.js');
var autocomplete = require('../framework7/autocomplete.js');
var tabs = require('../framework7/tabs.js');
var accordion = require('../framework7/accordion.js');
var pullToRefresh = require('../framework7/pull-to-refresh.js');
var infiniteScroll = require('../framework7/infinite-scroll.js');
var floatingLabel = require('../framework7/floating-label.js');

var VERSION = '1.4.0';
var TRANSITIONS_INOUT = {
    'none': { 'in': false, out: false },
    'fade': { 'in': true, out: true },
    'fade-contract': { 'in': true, out: true },
    'fade-expand': { 'in': true, out: true },
    'show-from-left': { 'in': true, out: true },
    'show-from-right': { 'in': true, out: true },
    'show-from-top': { 'in': true, out: true },
    'show-from-bottom': { 'in': true, out: true },
    'reveal-from-left': { 'in': true, out: true },
    'reveal-from-right': { 'in': true, out: true },
    'reveal-from-top': { 'in': false, out: true },
    'reveal-from-bottom': { 'in': false, out: true }
};

var VIEW_TRANSITIONS = {
    'node': { go: 'node', back: 'node' },
    'fade': { go: 'fade', back: 'fade' },
    'in': { go: 'fade-contract', back: 'fade-expand' },
    'out': { go: 'fade-expand', back: 'fade-contract' },
    'right': { go: 'show-from-left', back: 'reveal-from-left' },
    'left': { go: 'show-from-right', back: 'reveal-from-right' },
    'up': { go: 'show-from-bottom', back: 'reveal-from-bottom' },
    'down': { go: 'show-from-top', back: 'reveal-from-top' }
};

var params = {
    cache: true,
    cacheIgnore: [],
    cacheIgnoreGetParameters: false,
    cacheDuration: 1000 * 60 * 10, // Ten minutes
    preloadf7Page: true,
    uniqueHistory: false,
    uniqueHistoryIgnoreGetParameters: false,
    dynamicPageUrl: 'content-{{index}}',
    allowDuplicateUrls: false,
    router: true,
    // Push State
    pushState: false,
    pushStateRoot: undefined,
    pushStateNoAnimation: false,
    pushStateSeparator: '#!/',
    pushStatePreventOnLoad: true,
    // Fast clicks
    fastClicks: true,
    fastClicksDistanceThreshold: 10,
    fastClicksDelayBetweenClicks: 50,
    // Tap Hold
    tapHold: false,
    tapHoldDelay: 750,
    tapHoldPreventClicks: true,
    // Active State
    activeState: true,
    activeStateElements: 'a, button, label, span',
    // Animate Nav Back Icon
    animateNavBackIcon: false,
    // Swipe Back
    swipeBackPage: true,
    swipeBackPageThreshold: 0,
    swipeBackPageActiveArea: 30,
    swipeBackPageAnimateShadow: true,
    swipeBackPageAnimateOpacity: true,
    // Ajax
    ajaxLinks: undefined, // or CSS selector
    // External Links
    externalLinks: '.external', // CSS selector
    // Sortable
    sortable: true,
    // Scroll toolbars
    hideNavbarOnPageScroll: false,
    hideToolbarOnPageScroll: false,
    hideTabbarOnPageScroll: false,
    showBarsOnPageScrollEnd: true,
    showBarsOnPageScrollTop: true,
    // Swipeout
    swipeout: true,
    swipeoutActionsNoFold: false,
    swipeoutNoFollow: false,
    // Smart Select Back link template
    smartSelectOpenIn: 'page', // or 'popup' or 'picker'
    smartSelectBackText: 'Back',
    smartSelectPopupCloseText: 'Close',
    smartSelectPickerCloseText: 'Done',
    smartSelectSearchbar: false,
    smartSelectBackOnSelect: false,
    // Tap Navbar or Statusbar to scroll to top
    scrollTopOnNavbarClick: false,
    scrollTopOnStatusbarClick: false,
    // Panels
    swipePanel: false, // or 'left' or 'right'
    swipePanelActiveArea: 0,
    swipePanelCloseOpposite: true,
    swipePanelOnlyClose: false,
    swipePanelNoFollow: false,
    swipePanelThreshold: 0,
    panelsCloseByOutside: true,
    // Modals
    modalButtonOk: 'OK',
    modalButtonCancel: 'Cancel',
    modalUsernamePlaceholder: 'Username',
    modalPasswordPlaceholder: 'Password',
    modalTitle: 'Framework7',
    modalCloseByOutside: false,
    actionsCloseByOutside: true,
    popupCloseByOutside: true,
    modalPreloaderTitle: 'Loading... ',
    modalStack: true,
    // Lazy Load
    imagesLazyLoadThreshold: 0,
    imagesLazyLoadSequential: true,
    // Name space
    // viewClass: 'view',
    // viewMainClass: 'view-main',
    // viewsClass: 'views',
    // Notifications defaults
    notificationCloseOnClick: false,
    notificationCloseIcon: true,
    notificationCloseButtonText: 'Close',
    // Animate Pages
    animatePages: true,
    // Template7
    templates: {},
    template7Data: {},
    template7Pages: false,
    precompileTemplates: false,
    // Material
    material: true,
    materialPageLoadDelay: 0,
    materialPreloaderSvg: '<svg xmlns="http://www.w3.org/2000/svg" height="75" width="75" viewbox="0 0 75 75"><circle cx="37.5" cy="37.5" r="33.5" stroke-width="8"/></svg>',
    materialPreloaderHtml: '<span class="preloader-inner">' + '<span class="preloader-inner-gap"></span>' + '<span class="preloader-inner-left">' + '<span class="preloader-inner-half-circle"></span>' + '</span>' + '<span class="preloader-inner-right">' + '<span class="preloader-inner-half-circle"></span>' + '</span>' + '</span>',
    materialRipple: true,
    materialRippleElements: '.ripple, a.link, a.item-link, .button, .modal-button, .tab-link, .label-radio, .label-checkbox, .actions-modal-button, a.searchbar-clear, a.floating-button, .floating-button > a, .speed-dial-buttons a',
    // Auto init
    init: true
};

function App(views) {
    return {
        version: VERSION,
        params: params,
        device: system.Device,
        support: system.Support,
        touchEvents: {
            start: system.Support.touch ? 'touchstart' : 'mousedown',
            move: system.Support.touch ? 'touchmove' : 'mousemove',
            end: system.Support.touch ? 'touchend' : 'mouseup'
        },
        toast: function toast(text, icon) {
            Toast({ text: text, icon: icon });
        },
        init: function init() {
            this.t7 = template7;
            this.ls = window.localStorage;
            this._compiledTemplates = {};
            fastClicks(this).initFastClicks();
            clicks(this).initClickEvents();
            materialInputs(this).initMaterialWatchInputs();
            materialPreloader(this);
            materialTabbar(this);
            swiper(this);
            swiperInit(this);
            swipeout(this).initSwipeout();
            sortable(this).initSortable();
            navbars(this);
            searchbar(this);
            scrollToolbars(this);
            photoBrowser(this);
            notifications(this);
            modals(this);
            picker(this);
            calendar(this);
            panels(this).initSwipePanels();
            autocomplete(this);
            tabs(this);
            accordion(this);
            pullToRefresh(this);
            infiniteScroll(this);
            floatingLabel(this);
        },
        componentWillMount: function componentWillMount() {
            window._ = require('underscore');
            _.mixin({
                deepClone: function deepClone(obj) {
                    return !obj || typeof obj !== 'object' ? obj : _.isString(obj) ? String.prototype.slice.call(obj) : _.isDate(obj) ? obj.valueOf() : _.isFunction(obj.clone) ? obj.clone() : _.isArray(obj) ? _.map(obj, function (t) {
                        return _.deepClone(t);
                    }) : _.mapObject(obj, function (val, key) {
                        return _.deepClone(val);
                    });
                }
            });

            window.app = this;
            this.history = [];
            this.data = {};
            this.methods = {};
            this.resPath = window.location.pathname.replace(/index.html$/, /index.html$/, /index.html$/, /index.html$/, '');
            this.init();
        },
        getCurrentView: function getCurrentView() {
            var currentView = this.state.currentView;
            var props = { data: this.data.tempPassData };
            this.data.tempPassData = null;
            var viewsData = {};
            viewsData[currentView] = React.createElement(views[currentView], props);
            return React.addons.createFragment(viewsData);
        },
        getInitialState: function getInitialState() {
            return {
                viewTransition: this.getViewTransition('none')
            };
        },
        getViewTransition: function getViewTransition(key) {
            return assign({
                key: key,
                name: 'view-transition-' + key
            }, TRANSITIONS_INOUT[key]);
        },
        displayView: function displayView(viewId, transition, param) {
            this.data.tempPassData = {
                param: param,
                from: this.state.currentView
            };

            this.setState({
                currentView: viewId,
                viewTransition: this.getViewTransition(transition)
            });
        },
        showView: function showView(viewId, transition, param, norecord) {
            var trans = VIEW_TRANSITIONS[transition];
            param = param || {};
            if (!norecord) {
                var saved = param.saved || {};
                if (param.saved) {
                    delete param.saved;
                }
                saved = assign(saved, { scrollTop: $('.page-content').scrollTop() });
                this.history.push({ id: this.state.currentView, title: this.data.lastTitle, transition: transition, saved: saved });
                this.data.lastTitle = param.backText || this.data.currentTitle || 'Back';
            }
            this.displayView(viewId, trans ? trans.go : 'none', param);
        },
        goBack: function goBack(step, param) {
            if (!step) {
                step = 1;
            }
            var obj;
            for (var i = 0; i < step; i++) {
                var t = this.history.pop();
                t && (obj = t);
            }
            if (obj) {
                var trans = VIEW_TRANSITIONS[obj.transition];
                param = assign({}, param);
                param.saved = obj.saved;
                this.data.lastTitle = obj.title;
                this.displayView(obj.id, trans ? trans.back : 'none', param);
            }
        }
    };
}

module.exports = App;

},{"../Toast":48,"../framework7/accordion.js":75,"../framework7/autocomplete.js":76,"../framework7/calendar.js":77,"../framework7/clicks.js":78,"../framework7/fast-clicks.js":79,"../framework7/floating-label.js":80,"../framework7/infinite-scroll.js":81,"../framework7/material-inputs.js":82,"../framework7/material-preloader.js":83,"../framework7/material-tabbar.js":84,"../framework7/modals.js":85,"../framework7/navbars.js":86,"../framework7/notifications.js":87,"../framework7/panels.js":88,"../framework7/photo-browser.js":89,"../framework7/picker.js":90,"../framework7/pull-to-refresh.js":91,"../framework7/scroll-toolbars.js":92,"../framework7/searchbar.js":93,"../framework7/sortable.js":94,"../framework7/swipeout.js":95,"../framework7/swiper-init.js":96,"../framework7/swiper.js":97,"../framework7/tabs.js":98,"../framework7/template7.js":99,"../system":152,"object-assign":44,"react/addons":undefined,"underscore":46}],131:[function(require,module,exports){
'use strict';

module.exports = {
    componentDidMount: function componentDidMount() {
        var data = this.props.data || {};
        var param = data.param || {};
        var scrollTop = param.saved && param.saved.scrollTop;
        if (scrollTop) {
            $('.page-content').scrollTop(scrollTop);
        }
    }
};

},{}],132:[function(require,module,exports){
"use strict";

module.exports = {
    uuid: function uuid() {
        var S4 = function S4() {
            return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
        };
        return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
    }
};

},{}],133:[function(require,module,exports){
'use strict';

module.exports = {
	App: require('./App'),
	RestoreScrollPosition: require('./RestoreScrollPosition'),
	Utils: require('./Utils')
};

},{"./App":130,"./RestoreScrollPosition":131,"./Utils":132}],134:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    onTap: function onTap() {
        var func = this.props.onTap;
        func && func(this);
        app.closeModal();
    },
    render: function render() {
        return React.createElement(
            "span",
            {
                className: "modal-button",
                style: this.props.style,
                onClick: this.onTap },
            this.props.children
        );
    }
});

},{"react":undefined}],135:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "modal-buttons" },
            this.props.children
        );
    }
});

},{"react":undefined}],136:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "modal-inner" },
            this.props.children
        );
    }
});

},{"react":undefined}],137:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "modal modal-no-buttons" },
            this.props.children
        );
    }
});

},{"react":undefined}],138:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "modal-text" },
            this.props.children
        );
    }
});

},{"react":undefined}],139:[function(require,module,exports){
'use strict';

var React = require('react');

module.exports = React.createClass({
	displayName: 'exports',

	getDefaultProps: function getDefaultProps() {
		return {
			type: 'text'
		};
	},
	render: function render() {
		return React.createElement('input', {
			type: this.props.type,
			className: 'modal-text-input',
			placeholder: this.props.placeholder });
	}
});

},{"react":undefined}],140:[function(require,module,exports){
'use strict';

var React = require('react');

module.exports = React.createClass({
	displayName: 'exports',

	getDefaultProps: function getDefaultProps() {
		return {
			type: 'text'
		};
	},
	render: function render() {
		return React.createElement('input', {
			type: this.props.type,
			className: 'modal-text-input modal-text-input-double',
			placeholder: this.props.placeholder });
	}
});

},{"react":undefined}],141:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "modal-title" },
            this.props.children
        );
    }
});

},{"react":undefined}],142:[function(require,module,exports){
'use strict';

module.exports = {
	ModalButton: require('./Modal/ModalButton'),
	ModalButtons: require('./Modal/ModalButtons'),
	ModalInner: require('./Modal/ModalInner'),
	ModalNoButttons: require('./Modal/ModalNoButttons'),
	ModalText: require('./Modal/ModalText'),
	ModalTextInput: require('./Modal/ModalTextInput'),
	ModalTextInputDouble: require('./Modal/ModalTextInputDouble'),
	ModalTitle: require('./Modal/ModalTitle')
};

},{"./Modal/ModalButton":134,"./Modal/ModalButtons":135,"./Modal/ModalInner":136,"./Modal/ModalNoButttons":137,"./Modal/ModalText":138,"./Modal/ModalTextInput":139,"./Modal/ModalTextInputDouble":140,"./Modal/ModalTitle":141}],143:[function(require,module,exports){
'use strict';

var React = require('react');

module.exports = React.createClass({
    displayName: 'exports',

    componentDidMount: function componentDidMount() {
        var self = this;
        var container = $('.infinite-scroll');
        app.initInfiniteScroll(container);
        container.on('infinite', function (e) {
            self.props.onInfinite && self.props.onInfinite(e);
        });
    },
    componentWillUnmount: function componentWillUnmount() {
        app.destroyInfiniteScroll();
    },
    render: function render() {
        return null;
    }
});

},{"react":undefined}],144:[function(require,module,exports){
'use strict';

var React = require('react');

module.exports = React.createClass({
    displayName: 'exports',

    componentDidMount: function componentDidMount() {
        var self = this;
        this.container = $('.pull-to-refresh-content');
        app.initPullToRefresh(this.container);
        this.container.on('refresh', function (e) {
            self.props.onRefresh && self.props.onRefresh(e);
        });
    },
    componentWillUnmount: function componentWillUnmount() {
        app.destroyPullToRefresh(this.container);
    },
    refreshDone: function refreshDone() {
        app.pullToRefreshDone();
    },
    render: function render() {
        return React.createElement(
            'div',
            { className: 'pull-to-refresh-layer' },
            React.createElement('div', { className: 'preloader' }),
            React.createElement('div', { className: 'pull-to-refresh-arrow' })
        );
    }
});

},{"react":undefined}],145:[function(require,module,exports){
'use strict';

module.exports = {
	InfiniteScroll: require('./InfiniteScroll'),
	PullToRefresh: require('./PullToRefresh')
};

},{"./InfiniteScroll":143,"./PullToRefresh":144}],146:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "form",
            { className: "searchbar", ref: "searchbar" },
            React.createElement(
                "div",
                { className: "searchbar-input" },
                React.createElement("input", { type: "search", placeholder: "Search" }),
                React.createElement("a", { href: "#", className: "searchbar-clear" })
            ),
            !app.params.material && React.createElement(
                "a",
                { href: "#", className: "searchbar-cancel" },
                "Cancel"
            )
        );
    }
});

},{"react":undefined}],147:[function(require,module,exports){
'use strict';

var React = require('react');
var List = require('../list');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                List.List,
                { block: true, 'class': 'searchbar-not-found' },
                React.createElement(
                    List.ItemContent,
                    null,
                    React.createElement(
                        List.ItemInner,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Nothing found'
                        )
                    )
                )
            ),
            React.createElement(
                List.List,
                { block: true, 'class': 'searchbar-found' },
                this.props.children
            )
        );
    }
});

},{"../list":124,"react":undefined}],148:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
	displayName: "exports",

	render: function render() {
		return React.createElement("div", { className: "searchbar-overlay" });
	}
});

},{"react":undefined}],149:[function(require,module,exports){
'use strict';

module.exports = {
	Search: require('./Search'),
	SearchList: require('./SearchList'),
	SearchOverlay: require('./SearchOverlay')
};

},{"./Search":146,"./SearchList":147,"./SearchOverlay":148}],150:[function(require,module,exports){
'use strict';

module.exports = (function () {
    var device = {};
    var ua = navigator.userAgent;

    var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

    // Android
    if (android) {
        device.os = 'android';
        device.osVersion = android[2];
    } else if (ipad || iphone || ipod) {
        device.os = 'ios';
    } else {
        device.os = 'desktop';
    }
    // iOS
    if (iphone && !ipod) {
        device.osVersion = iphone[2].replace(/_/g, '.');
    }
    if (ipad) {
        device.osVersion = ipad[2].replace(/_/g, '.');
    }
    if (ipod) {
        device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
    }
    // iOS 8+ changed UA
    if (device.os === 'ios' && device.osVersion && ua.indexOf('Version/') >= 0) {
        if (device.osVersion.split('.')[0] === '10') {
            device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
        }
    }

    // Check for status bar and fullscreen app mode
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    device.statusBar = false;
    if (device.webView && windowWidth * windowHeight === screen.width * screen.height) {
        device.statusBar = true;
    } else {
        device.statusBar = false;
    }

    // Classes
    var classNames = [];

    // Pixel Ratio
    device.pixelRatio = window.devicePixelRatio || 1;
    classNames.push('pixel-ratio-' + Math.floor(device.pixelRatio));
    if (device.pixelRatio >= 2) {
        classNames.push('retina');
    }

    // OS classes
    if (device.os !== 'desktop') {
        classNames.push(device.os, device.os + '-' + device.osVersion.split('.')[0], device.os + '-' + device.osVersion.replace(/\./g, '-'));
        if (device.os === 'ios') {
            var major = parseInt(device.osVersion.split('.')[0], 10);
            for (var i = major - 1; i >= 6; i--) {
                classNames.push('ios-gt-' + i);
            }
        }
    }
    // Status bar classes
    if (device.statusBar) {
        classNames.push('with-statusbar-overlay');
    } else {
        $('html').removeClass('with-statusbar-overlay');
    }

    // Add html classes
    if (classNames.length > 0) $('html').addClass(classNames.join(' '));

    device.pause = true;
    // Export object
    return device;
})();

},{}],151:[function(require,module,exports){
'use strict';

module.exports = {
    touch: window.Modernizr && Modernizr.touch === true || (function () {
        return !!('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch);
    })(),
    transforms3d: window.Modernizr && Modernizr.csstransforms3d === true || (function () {
        var div = document.createElement('div').style;
        return 'webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div;
    })(),
    flexbox: (function () {
        var div = document.createElement('div').style;
        var styles = 'alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient'.split(' ');
        for (var i = 0; i < styles.length; i++) {
            if (styles[i] in div) return true;
        }
    })(),
    observer: (function () {
        return 'MutationObserver' in window || 'WebkitMutationObserver' in window;
    })()
};

},{}],152:[function(require,module,exports){
'use strict';

module.exports = {
	Device: require('./Device'),
	Support: require('./Support')
};

},{"./Device":150,"./Support":151}],153:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');
var NavbarTitle = require('./navbar/NavbarTitle');
var Navbar = require('./navbar/Navbar');
var SubNavbar = require('./navbar/SubNavbar');
var BackButton = require('./navbar/BackButton');
var ButtonsRow = require('../button/ButtonsRow');

module.exports = React.createClass({
	displayName: 'exports',

	getVisibleTitle: function getVisibleTitle(title) {
		if (!title) return title;
		var realLength = 0,
		    len = title.length,
		    preLen = -1,
		    charCode = -1,
		    needCut = false;
		for (var i = 0; i < len; i++) {
			charCode = title.charCodeAt(i);
			if (charCode >= 0 && charCode <= 128) {
				realLength += 1;
			} else {
				realLength += 2;
			}
			if (preLen === -1 && realLength >= 4) {
				preLen = i + 1;
			} else if (realLength > 6) {
				needCut = true;
				break;
			}
		}
		if (needCut) {
			title = title.substr(0, preLen) + '..';
		}
		return title;
	},
	componentWillMount: function componentWillMount() {
		app.data.currentTitle = this.props.title;
	},
	componentDidMount: function componentDidMount() {
		var props = this.props;
		var pageContainer = $(this.getDOMNode());
		if (props.initPageScrollToolbars) {
			app.initPageScrollToolbars(pageContainer);
		}
		if (app.params.material) {
			app.initPageMaterialPreloader(pageContainer);
			app.initPageMaterialInputs(pageContainer);
			app.initPageMaterialTabbar(pageContainer);
		}
		if (props.initPageSwiper) {
			app.initPageSwiper(pageContainer);
		}
	},
	componentWillUnmount: function componentWillUnmount() {
		var pageContainer = $(this.getDOMNode());
		if (this.props.initPageScrollToolbars) {
			app.destroyScrollToolbars(pageContainer);
		}
	},
	render: function render() {
		var navbar = false;
		var title = false;
		if (this.props.title) {
			navbar = true;
			title = this.props.title;
		} else if (this.props.navbar) {
			navbar = true;
		}

		var obj = {
			'page': true,
			'navbar-through': navbar,
			'toolbar-through': this.props.toolbar,
			'tabbar-labels-through': this.props.labelsTabbar,
			'navbar-fixed': app.params.material && this.props.tabs
		};
		var className = cn(obj);

		if (!app.params.material) {
			var backText = this.props.backText;
			if (!backText) {
				backText = app.data.lastTitle;
			}
			backText = this.getVisibleTitle(backText);
		}
		if (!this.props.tabs) {
			return React.createElement(
				'div',
				{
					className: className,
					style: this.props.style },
				!!title && React.createElement(
					Navbar,
					{
						goBack: this.props.goBack,
						backText: backText },
					React.createElement(
						NavbarTitle,
						null,
						title
					),
					this.props.right
				),
				this.props.children
			);
		} else {
			var tabs = this.props.tabs;
			var tabsCN = "tabs-" + tabs.type + "-wrap";
			return React.createElement(
				'div',
				{
					className: className,
					style: this.props.style },
				!!title && React.createElement(
					Navbar,
					{
						goBack: this.props.goBack,
						backText: backText },
					React.createElement(
						NavbarTitle,
						null,
						title
					),
					this.props.right
				),
				!app.params.material ? React.createElement(
					SubNavbar,
					null,
					React.createElement(
						ButtonsRow,
						null,
						tabs.buttons
					)
				) : React.createElement(
					'div',
					{ className: 'toolbar tabbar' },
					React.createElement(
						'div',
						{ className: 'toolbar-inner' },
						tabs.buttons
					)
				),
				React.createElement(
					'div',
					{ className: tabsCN },
					React.createElement(
						'div',
						{ className: 'tabs' },
						this.props.children
					)
				)
			);
		}
	}
});

},{"../button/ButtonsRow":54,"./navbar/BackButton":157,"./navbar/Navbar":158,"./navbar/NavbarTitle":160,"./navbar/SubNavbar":161,"classnames":43,"react":undefined}],154:[function(require,module,exports){
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        var obj = {
            "messages-content": this.props.message,
            "hide-bars-on-scroll": this.props.scrollHideBar,
            "with-subnavbar": this.props.subnavbar,
            "tab": this.props.tab,
            "active": this.props.active
        };
        this.props['class'] && (obj[this.props['class']] = true);
        var className = cn("page-content", obj);

        var data = this.props.data;
        var dataAttribute = {};
        for (var key in data) {
            dataAttribute['data-' + key] = data[key];
        }
        return React.createElement(
            'div',
            _extends({
                className: className,
                id: this.props.tab }, dataAttribute),
            this.props.children
        );
    }
});

},{"classnames":43,"react":undefined}],155:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

var PageContent = require('../PageContent');
var Page = require('../Page');
var NavbarButton = require('../navbar/NavbarButton');

module.exports = React.createClass({
	displayName: 'exports',

	componentDidMount: function componentDidMount() {
		var params = this.props.params;
		var type = params.type;
		if (type === 'panel') {
			app.openPanel(params.side);
			$(this.refs.panel.getDOMNode()).on('closed', function () {
				app.hideCover();
			});
		} else if (type === 'popup') {
			var el = this.getDOMNode();
			app.popup(el);
			$(el).on('closed', function () {
				app.hideCover();
			});
		} else if (type === 'picker') {
			var el = this.getDOMNode();
			app.pickerModal(el);
			$(el).on('closed', function () {
				app.hideCover();
			});
		} else if (type === 'popover') {
			var el = this.getDOMNode();
			app.popover(el, params.target);
			$(el).on('closed', function () {
				app.hideCover();
			});
		} else if (type === 'modal') {
			var el = this.refs.modal.getDOMNode();
			app.openModal(el);
			$(el).on('closed', function () {
				app.hideCover();
			});
		}
	},
	renderPanel: function renderPanel() {
		var params = this.props.params;
		var className = cn("panel", {
			"panel-left": params.side === "left",
			"panel-right": params.side === "right",
			"panel-cover": true,
			"layout-dark": true
		});
		return React.createElement(
			'div',
			null,
			React.createElement('div', { className: 'panel-overlay' }),
			React.createElement(
				'div',
				{ className: className, ref: 'panel' },
				this.props.children
			)
		);
	},
	renderPopup: function renderPopup() {
		return React.createElement(
			'div',
			{ className: 'popup' },
			React.createElement(
				Page,
				{
					goBack: false,
					title: this.props.title || ' ',
					right: React.createElement(
						NavbarButton,
						{ right: true, popup: true },
						'Done'
					) },
				React.createElement(
					PageContent,
					null,
					this.props.children
				)
			)
		);
	},
	renderPickerModal: function renderPickerModal() {
		var params = this.props.params;
		var leftButton = this.props.leftButton;
		var rightButton = this.props.rightButton || React.createElement(
			'a',
			{ href: '#', className: 'link close-picker' },
			'Done'
		);
		return React.createElement(
			'div',
			{ className: 'picker-modal' },
			React.createElement(
				'div',
				{ className: 'toolbar' },
				React.createElement(
					'div',
					{ className: 'toolbar-inner' },
					React.createElement(
						'div',
						{ className: 'left' },
						leftButton
					),
					React.createElement(
						'div',
						{ className: 'right' },
						rightButton
					)
				)
			),
			React.createElement(
				'div',
				{ className: 'picker-modal-inner' },
				this.props.children
			)
		);
	},
	renderPopover: function renderPopover() {
		var params = this.props.params;
		return React.createElement(
			'div',
			{ className: 'popover popover-menu' },
			React.createElement('div', { className: 'popover-angle' }),
			React.createElement(
				'div',
				{ className: 'popover-inner' },
				this.props.children
			)
		);
	},
	renderModal: function renderModal() {
		return React.createElement(
			'div',
			null,
			React.createElement('div', { className: 'modal-overlay' }),
			React.createElement(
				'div',
				{ className: 'modal', ref: 'modal' },
				this.props.children
			)
		);
	},
	render: function render() {
		var type = this.props.params.type;
		if (type === 'panel') {
			return this.renderPanel();
		}
		if (type === 'popup') {
			return this.renderPopup();
		}
		if (type === 'picker') {
			return this.renderPickerModal();
		}
		if (type === 'popover') {
			return this.renderPopover();
		}
		if (type === 'modal') {
			return this.renderModal();
		}
		return null;
	}
});

},{"../Page":153,"../PageContent":154,"../navbar/NavbarButton":159,"classnames":43,"react":undefined}],156:[function(require,module,exports){
'use strict';

module.exports = {
	BackButton: require('./navbar/BackButton'),
	Navbar: require('./navbar/Navbar'),
	SubNavbar: require('./navbar/SubNavbar'),
	NavbarButton: require('./navbar/NavbarButton'),
	NavbarTitle: require('./navbar/NavbarTitle'),
	Page: require('./Page'),
	PageContent: require('./PageContent'),
	Cover: require('./cover/Cover'),
	Toolbar: require('./toolbar/Toolbar'),
	ToolbarButton: require('./toolbar/ToolbarButton')
};

},{"./Page":153,"./PageContent":154,"./cover/Cover":155,"./navbar/BackButton":157,"./navbar/Navbar":158,"./navbar/NavbarButton":159,"./navbar/NavbarTitle":160,"./navbar/SubNavbar":161,"./toolbar/Toolbar":162,"./toolbar/ToolbarButton":163}],157:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    goBack: function goBack() {
        var goBack = this.props.goBack;
        if (!goBack || !goBack()) {
            app.goBack();
        }
    },
    render: function render() {
        var haveBackButton = this.props.goBack !== false;
        return React.createElement(
            "div",
            { className: "left sliding" },
            haveBackButton ? React.createElement(
                "a",
                {
                    href: "#",
                    className: "link",
                    onClick: this.goBack },
                React.createElement("i", { className: "icon icon-back" }),
                React.createElement(
                    "span",
                    null,
                    this.props.children
                )
            ) : React.createElement("a", { href: "#", className: "link" })
        );
    }
});

},{"react":undefined}],158:[function(require,module,exports){
'use strict';

var React = require('react');
var BackButton = require('./BackButton');

module.exports = React.createClass({
    displayName: 'exports',

    componentDidMount: function componentDidMount() {
        app.sizeNavbars(this.refs.navbar.getDOMNode());
    },
    render: function render() {
        return React.createElement(
            'div',
            { className: 'navbar', ref: 'navbar' },
            React.createElement(
                'div',
                { className: 'navbar-inner' },
                React.createElement(
                    BackButton,
                    { goBack: this.props.goBack },
                    this.props.backText
                ),
                this.props.children
            )
        );
    }
});

},{"./BackButton":157,"react":undefined}],159:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        var divCN = cn({
            "right": this.props.right,
            "left": this.props.left
        });
        var aCN = cn("link", {
            "icon-only": this.props.iconOnly,
            'close-popup': this.props.popup
        });
        if (this.props.icon) {
            var obj = { "icon": true };
            obj[this.props.icon] = true;
            var iCN = cn(obj);
            return React.createElement(
                'div',
                { className: divCN },
                React.createElement(
                    'a',
                    {
                        href: '#',
                        className: aCN,
                        onClick: this.props.onTap },
                    React.createElement('i', { className: iCN }),
                    this.props.children
                )
            );
        } else {
            return React.createElement(
                'div',
                { className: divCN },
                React.createElement(
                    'a',
                    {
                        href: '#',
                        className: aCN,
                        onClick: this.props.onTap },
                    this.props.children
                )
            );
        }
    }
});

},{"classnames":43,"react":undefined}],160:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "center sliding" },
            this.props.children
        );
    }
});

},{"react":undefined}],161:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "subnavbar sliding" },
            this.props.children
        );
    }
});

},{"react":undefined}],162:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        var obj = {
            "toolbar": true,
            "tabbar": this.props.tabbar,
            "tabbar-labels": this.props.labels
        };
        this.props['class'] && (obj[this.props['class']] = true);
        var className = cn(obj);
        return React.createElement(
            'div',
            { className: className },
            React.createElement(
                'div',
                { className: 'toolbar-inner' },
                this.props.children
            )
        );
    }
});

},{"classnames":43,"react":undefined}],163:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        if (nextProps.active) {
            var el = $(this.refs.link.getDOMNode());
            var tabbar = el.parents('.tabbar')[0];
            app.materialTabbarSetHighlight(tabbar, el);
        }
    },
    render: function render() {
        var className = cn("tab-link", {
            "active": this.props.active
        });
        var icon;
        if ($.isArray(this.props.icon)) {
            icon = this.props.active ? this.props.icon[0] : this.props.icon[1];
        } else {
            icon = this.props.icon;
        }
        return React.createElement(
            'a',
            {
                className: className,
                onClick: this.props.onTap,
                ref: 'link' },
            React.createElement(
                'i',
                { className: "icon " + icon },
                this.props.badge
            ),
            React.createElement(
                'span',
                { className: 'tabbar-label' },
                this.props.children
            )
        );
    }
});

},{"classnames":43,"react":undefined}],164:[function(require,module,exports){
'use strict';

var React = require('react');

var Welcomescreen = function Welcomescreen(slides, options) {
    var p = this,
        container,
        swiper,
        swiperContainer,
        defaults = {
        closeButton: true, // enabled/disable close button
        closeButtonText: 'Skip', // close button text
        cssClass: '', // additional class on container
        pagination: true, // swiper pagination
        loop: false, // swiper loop
        open: true // open welcome screen on init
    };

    options = options || {};
    for (var def in defaults) {
        if (typeof options[def] === 'undefined') {
            options[def] = defaults[def];
        }
    }

    p.open = function () {
        var html = '';
        html += '<div class="welcomescreen-container ' + (options.cssClass || '') + '">';
        options.closeButton && (html += '<div class="welcomescreen-closebtn close-welcomescreen">' + options.closeButtonText + '</div>');
        html += '<div class="welcomescreen-swiper swiper-container">';
        html += '<div class="swiper-wrapper">';
        for (var i in slides) {
            var item = slides[i];
            html += '<div class="swiper-slide" ' + (item.id ? 'id="' + item.id + '"' : '') + '>';
            item.content && (html += '<div class="welcomescreen-content">' + item.content + '</div>');
            item.picture && (html += '<div class="welcomescreen-picture">' + item.picture + '</div>');
            item.text && (html += '<div class="welcomescreen-text">' + item.text + '</div>');
            html += '</div>';
        }
        html += '</div>';
        options.pagination && (html += '<div class="welcomescreen-pagination swiper-pagination"></div>');
        html += '</div></div>';

        container = $(html);
        swiperContainer = container.find('.swiper-container');

        if (options.bgcolor) {
            container.css({
                'background-color': options.bgcolor,
                'color': options.fontcolor
            });
        }

        $('body').append(container);

        swiper = app.swiper('.swiper-container', {
            direction: 'horizontal',
            loop: options.loop,
            pagination: options.pagination ? swiperContainer.find('.swiper-pagination') : undefined
        });

        container[0].f7Welcomescreen = p;
        if (typeof options.onOpened === 'function') {
            options.onOpened();
        }

        $(document).on('click', '.close-welcomescreen', function (e) {
            e.preventDefault();
            var $wscreen = $(this).parents('.welcomescreen-container');
            if ($wscreen.length > 0 && $wscreen[0].f7Welcomescreen) {
                $wscreen[0].f7Welcomescreen.close();
            }
        });
    };
    p.close = function () {
        swiper && swiper.destroy(true);
        container && container.remove();
        container = swiperContainer = swiper = undefined;
        if (typeof options.onClosed === 'function') {
            options.onClosed();
        }
    };
    p.next = function () {
        swiper && swiper.slideNext();
    };
    p.previous = function () {
        swiper && swiper.slidePrev();
    };
    p.slideTo = function (index) {
        swiper && swiper.slideTo(index);
    };

    return p;
};

module.exports = function (slides, options) {
    var p = new Welcomescreen(slides, options);
    p.open();
    return p;
};

},{"react":undefined}],165:[function(require,module,exports){
'use strict';

module.exports = {
	WelcomeScreen: require('./WelcomeScreen')
};

},{"./WelcomeScreen":164}]},{},[1]);
