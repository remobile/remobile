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
            <View.Page title="Audio Call">
            <View.PageContent>
                <div className={"audio_call_head default_head user_head_"+userid}></div>
                <div className="center_div">
                    <div style={{fontSize: "2em", paddingTop: "20px", paddingBottom: "20px"}}></div>
                    <div style={{color:"red"}}>呼叫中</div>
                    <div style={{color:"dimgray"}}>00:00:00</div>
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
