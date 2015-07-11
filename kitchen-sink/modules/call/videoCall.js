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
    componentWillMount: function() {
        this.userid = this.props.data.param.target;
    },
    componentDidMount: function() {
        app.userMgr.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        app.userMgr.removeChangeListener(this._onChange);
    },
    _onChange: function() {
        this.forceUpdate();
    },
    systemCall: function() {
        navigator.utils.callNumber(this.userid);
    },
    systemMessage: function() {
        navigator.utils.sendSms(this.userid);
    },
    sendMessage: function() {
        var param = {
            type: app.messageMgr.USER_TYPE,
            target: this.userid
        };
        app.showView('messageInfo', 'fade', param);
    },
    audioCall: function() {
    },
    videoCall: function() {
    },
    render: function() {
        var userid = this.userid;
        var user = app.userMgr.users[userid];
        var username = user.username||userid;
        return (
            <View.Page title="Video Call">
                <View.PageContent>
                    <div className="video_call_status_container">
                        <div className="chat_head video_call_head default_head"></div>
                        <div className="video_call_status">
                            <div>fang</div>
                            <div className="call_state" style={{color:"red"}}>呼叫中</div>
                            <div className="call_time">00:00:00</div>
                        </div>
                    </div>
                    <div className="video_small_screen" onclick={this.toggleVideoView}></div>
                    <div className="video_large_screen" onclick={this.toggleVideoView}></div>
                    <div className="vidc_panel">
                        <Content.ContentBlock>
                        <Grid.Row>
                            <Grid.Col><Button big fill color="red" onTap={this.hangupAudioCall}>挂断</Button></Grid.Col>
                        </Grid.Row>
                        </Content.ContentBlock>
                        <Content.ContentBlock>
                            <Grid.Row>
                                <Grid.Col per={50}><Button big fill color="green" onTap={this.answerAudioCall}>接听</Button></Grid.Col>
                                <Grid.Col per={50}><Button big fill color="red" onTap={this.refuseAudioCall}>挂断</Button></Grid.Col>
                            </Grid.Row>
                        </Content.ContentBlock>
                    </div>
                </View.PageContent>
            </View.Page>
        );
    }
});
