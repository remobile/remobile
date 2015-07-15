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
        mgr.addCallChangeListener(this._onChange);
        if (!this.answer) {
            this.callid = mgr.callOut(this.userid, mgr.AUDIO_TYPE);
        }
        mgr.updateTime(function(time, status) {
            self.setState({time:time, status:status});
        });
    },
    componentWillUnmount: function() {
        this.hangupAudioCall();
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
    onSessionAnswer: function(userid, callid) {
        console.log('onSessionAnswer', userid, callid);
    },
    onCallOutError: function(callid) {
        console.log('onCallOutError', callid, this.callid);
        if (this.callid != null) {
            this.callid = null;
            app.goBack();
        }
    },
    answerAudioCall: function() {
        var mgr = app.callMgr;
        console.log('answerAudioCall', this.callid);
        mgr.answerCallIn(this.userid, mgr.AUDIO_TYPE, this.callid);
        this.setState({showButton: SHOW_CALLOUT_BUTTON});
    },
    onCallOutAnswered: function(callid) {
        console.log('onCallOutAnswered', callid, this.callid);
    },
    refuseAudioCall: function() {
        if (this.callid != null) {
            console.log('refuseAudioCall', this.callid);
            var mgr = app.callMgr;
            mgr.refuseCallIn(this.userid, mgr.AUDIO_TYPE, this.callid);
            this.callid = null;
            app.goBack();
        }
    },
    onCallOutRefused: function(callid) {
        if (this.callid != null) {
            console.log('onCallOutRefused', callid, this.callid);
            this.callid = null;
            app.goBack();
        }
    },
    hangupAudioCall: function() {
        if (this.callid != null) {
            console.log('hangupAudioCall', this.callid);
            var mgr = app.callMgr;
            mgr.callHangup(this.userid, mgr.AUDIO_TYPE, this.callid);
            this.callid = null;
            app.goBack();
        }
    },
    onPreCallHangupNotify: function(callid) {
        this.setState({showButton: SHOW_CALLOUT_BUTTON});
    },
    onCallHangupNotify: function(callid) {
        if (this.callid != null) {
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
            <View.Page title="Audio Call">
            <View.PageContent>
                <div className={"audio_call_head default_head user_head_"+userid}></div>
                <div className="center_div">
                    <div style={{fontSize: "2em", paddingTop: "20px", paddingBottom: "20px"}}>{username}</div>
                    <div style={{color:"red"}}>{this.state.status}</div>
                    <div style={{color:"dimgray"}}>{this.state.time}</div>
                </div>
                {this.state.showButton===SHOW_CALLOUT_BUTTON&&<Content.ContentBlock>
                    <Grid.Row>
                        <Grid.Col><Button big fill color="red" onTap={this.hangupAudioCall}>挂断</Button></Grid.Col>
                    </Grid.Row>
                </Content.ContentBlock>}
                {this.state.showButton===SHOW_CALLIN_BUTTON&&<Content.ContentBlock>
                    <Grid.Row>
                        <Grid.Col per={50}><Button big fill color="green" onTap={this.answerAudioCall}>接听</Button></Grid.Col>
                        <Grid.Col per={50}><Button big fill color="red" onTap={this.refuseAudioCall}>挂断</Button></Grid.Col>
                    </Grid.Row>
                </Content.ContentBlock>}
            </View.PageContent>
            </View.Page>
        );
    }
});
