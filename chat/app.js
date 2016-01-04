var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var classnames = require('classnames');
var UI =require('UI');
var ModalPanel = UI.Modal.ModalPanel;
var views = require('./modules');
var welcome = require('./modules/home/welcome');
var utils = require('./modules/utils');
var chat = require('./modules/chat');
var resource = require('./modules/resource/resource');

var App = React.createClass({
    mixins: [UI.Mixins.App(views)],
    componentWillMount: function () {
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
    componentDidMount: function () {
        navigator.utils.setupAudio();
        navigator.utils.setupFileChooser();
        this.device.pause = false;
    },
    showError: function(error) {
        this.toast(error);
    },
    showChatError: function(error) {
        this.toast(this.error[error]);
    },
    emit: function() {
        console.log(arguments[0], JSON.stringify(arguments[1]));
        if (!this.loginMgr.online) {
            console.log('you are offline');
            return;
        }
        this.socket.emit.apply(this.socket, arguments);
    },
    showWait: function(text) {
        this.showPreloader(text);
    },
    hideWait: function() {
        this.hidePreloader();
    },
    showCover(coverChildren, coverParams) {
        this.setState({coverVisible:true, coverChildren:coverChildren, coverParams:coverParams});
    },
    hideCover() {
        this.setState({coverVisible:false});
    },
    getInitialState: function() {
        return {
            currentView: 'login'
        };
    },
    render: function() {
        return (
            <ReactCSSTransitionGroup transitionName={this.state.viewTransition.name} transitionEnter={this.state.viewTransition.in} transitionLeave={this.state.viewTransition.out} component="div">
                {this.state.coverVisible&&<UI.View.Cover params={this.state.coverParams}>{this.state.coverChildren}</UI.View.Cover>}
                {this.getCurrentView()}
            </ReactCSSTransitionGroup>
        );
    }
});
function onDeviceReady() {
    React.render(<App />, document.getElementById('app'));
}
document.addEventListener('deviceready', onDeviceReady, false);
