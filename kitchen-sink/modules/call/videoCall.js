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
    componentWillMount: function() {
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
    componentDidMount: function() {
        var mgr = app.callMgr;
        var self = this;

        this.smallView = this.refs.smallView.getDOMNode();
        this.largeView = this.refs.largeView.getDOMNode();

        mgr.addCallChangeListener(this._onChange);
        this.updateVideoView();
        if (!this.answer) {
            this.callid = mgr.callOut(this.userid, mgr.VIDEO_TYPE);
        }
        mgr.updateTime(function(time, status) {
            self.setState({time:time, status:status});
        });
    },
    componentWillUnmount: function() {
        this.hangupVideoCall();
        app.callMgr.removeCallChangeListener(this._onChange);
    },
    _onChange: function(obj) {
        var type = obj.type;
        switch(type) {
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
            default:;
        }
    },
    getInitialState: function() {
        return {
            status: '',
            time: '',
            showButton:SHOW_NONE_BUTTON
        }
    },
    toggleVideoView: function() {
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
    updateVideoView: function() {
        var local = this.localLarge;
        navigator.phonertc.setVideoView({
            localView: local?this.largeView:this.smallView,
            remoteView: !local?this.largeView:this.smallView
        });
    },
    onSessionAnswer: function(userid, callid) {
        console.log('onSessionAnswer', userid, callid);
        this.toggleVideoView();
    },
    onCallOutError: function(callid) {
        console.log('onCallOutError', callid, this.callid);
        if (this.callid != null) {
            this.callid = null;
            navigator.phonertc.removeLocalVideoView();
            app.goBack();
        }
    },
    answerVideoCall: function() {
        var mgr = app.callMgr;
        console.log('answerVideoCall', this.callid);
        mgr.answerCallIn(this.userid, mgr.VIDEO_TYPE, this.callid);
        this.setState({showButton: SHOW_CALLOUT_BUTTON});
    },
    onCallOutAnswered: function(callid) {
        console.log('onCallOutAnswered', callid, this.callid);
    },
    refuseVideoCall: function() {
        if (this.callid != null) {
            navigator.phonertc.removeLocalVideoView();
            console.log('refuseVideoCall', this.callid);
            var mgr = app.callMgr;
            mgr.refuseCallIn(this.userid, mgr.VIDEO_TYPE, this.callid);
            this.callid = null;
            app.goBack();
        }
    },
    onCallOutRefused: function(callid) {
        if (this.callid != null) {
            navigator.phonertc.removeLocalVideoView();
            console.log('onCallOutRefused', callid, this.callid);
            this.callid = null;
            app.goBack();
        }
    },
    hangupVideoCall: function() {
        if (this.callid != null) {
            navigator.phonertc.removeLocalVideoView();
            console.log('hangupVideoCall', this.callid);
            var mgr = app.callMgr;
            mgr.callHangup(this.userid, mgr.VIDEO_TYPE, this.callid);
            this.callid = null;
            app.goBack();
        }
    },
    onPreCallHangupNotify: function(callid) {
        this.setState({showButton: SHOW_CALLOUT_BUTTON});
    },
    onCallHangupNotify: function(callid) {
        if (this.callid != null) {
            navigator.phonertc.removeLocalVideoView();
            console.log('onCallHangupNotify', callid, this.callid);
            this.callid = null;
            app.goBack();
        }
    },
    render: function() {
        var userid = this.userid;
        var user = app.userMgr.users[userid];
        var username = user.username;
        return (
            <View.Page title="Video Call">
                <View.PageContent>
                    <div className="video_call_status_container">
                        <div className={"chat_head video_call_head default_head user_head_"+userid}></div>
                        <div className="video_call_status">
                            <div>fang</div>
                            <div className="call_state" style={{color:"red"}}>{this.state.status}</div>
                            <div className="call_time">{this.state.time}</div>
                        </div>
                    </div>
                    <div className="video_small_screen" ref="smallView" onclick={this.toggleVideoView}></div>
                    <div className="video_large_screen" ref="largeView" onclick={this.toggleVideoView}></div>
                    <div className="vidc_panel">
                        {this.state.showButton===SHOW_CALLOUT_BUTTON&&<Content.ContentBlock>
                            <Grid.Row>
                                <Grid.Col><Button big fill color="red" onTap={this.hangupVideoCall}>挂断</Button></Grid.Col>
                            </Grid.Row>
                        </Content.ContentBlock>}
                        {this.state.showButton===SHOW_CALLIN_BUTTON&&<Content.ContentBlock>
                            <Grid.Row>
                                <Grid.Col per={50}><Button big fill color="green" onTap={this.answerVideoCall}>接听</Button></Grid.Col>
                                <Grid.Col per={50}><Button big fill color="red" onTap={this.refuseVideoCall}>挂断</Button></Grid.Col>
                            </Grid.Row>
                        </Content.ContentBlock>}
                    </div>
                </View.PageContent>
            </View.Page>
        );
    }
});
