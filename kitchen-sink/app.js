var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var classnames = require('classnames');
var UI =require('UI');
var ModalPanel = UI.Modal.ModalPanel;
var views = require('./modules');
var welcome = require('./modules/home/welcome');
var us = require('./modules/utils');
var chat = require('./modules/chat');

var App = React.createClass({
    mixins: [UI.Mixins.App(views)],
    componentWillMount: function () {
        this.us = utils.userSetting;
        this.error = utils.error;
        this.constants = utils.constants;
        this.callMgr = chat.callMgr;
        this.groupMgr = chat.groupMgr;
        this.messageMgr = chat.messageMgr;
        this.router = chat.router;
        this.socketMgr = chat.socketMgr;
        this.notifyMgr = chat.notifyMgr;
        this.onlineUserMgr = chat.onlineUserMgr;
        this.userMgr = chat.userMgr;
        this.userHeadCss = $.createStyleSheet();
        this.login = {};
        for (var i=0; i<33; i++) {
            $.insertStyleSheet(this.userHeadCss, '.user_head_' + i, 'background-image:url(img/head/'+i+'.jpg)');
        }
        welcome.showWelcome();
        app.chat.socketMgr.start("http://localhost:8000");
    },
    showError: function(error) {
        this.toast(error);
    },
    showChatError: function(error) {
        this.toast(this.error[error]);
    },
    showModal: function(modalType, modalChildren) {
        this.setState({modalVisible:true, modalChildren:modalChildren, modalType:modalType});
    },
    hideModal: function() {
        this.setState({modalVisible:false});
    },
    showPanel: function(panelType, panelChildren) {
        this.setState({panelVisible:true, panelChildren:panelChildren, panelType:panelType});
    },
    hidePanel: function() {
        this.setState({panelVisible:false});
    },
    getInitialState: function() {
        return {
            currentView: 'login'
        };
    },
    render: function() {
        return (
            <ReactCSSTransitionGroup transitionName={this.state.viewTransition.name} transitionEnter={this.state.viewTransition.in} transitionLeave={this.state.viewTransition.out} component="div">                  
                <ModalPanel visible={this.state.modalVisible} type={this.state.modalType}>{this.state.modalChildren}</ModalPanel>
                <UI.View.Panel visible={this.state.panelVisible} type={this.state.panelType}>{this.state.panelChildren}</UI.View.Panel>
                {this.getCurrentView()}
            </ReactCSSTransitionGroup>
        );
    }
});

function startApp() {
    React.render(<App />, document.getElementById('app'));
}

function onDeviceReady() {
    StatusBar.styleDefault();
    startApp();
}

if (typeof cordova === 'undefined') {
    startApp();
} else {
    document.addEventListener('deviceready', onDeviceReady, false);
}
