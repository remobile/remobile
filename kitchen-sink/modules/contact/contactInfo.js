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
        this.userid = this.props.data.param.userid;
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
            userid: this.userid
        };
        app.showView('messageInfo', 'fade', param);
    },
    audioCall: function(online) {
        if (!online) {
            app.toast("对方不在线");
            return;
        }
        var param = {
            userid: this.userid
        };
        app.showView('audioCall', 'fade', param);
    },
    videoCall: function(online) {
        if (!online) {
            app.toast("对方不在线");
            return;
        }
        var param = {
            userid: this.userid
        };
        app.showView('videoCall', 'fade', param);
    },
	render: function() {
        var userid = this.userid;
        var user = app.userMgr.users[userid];
        var username = user.username;
        var sign = user.sign||"这个家伙很懒，什么都没有留下";
        var callButtonColor = user.online?"green":"gray";
        return (
            <View.Page title="Contact Info">
            <View.PageContent>
                <Content.ContentBlock>
                <List.List block media>
                    <List.ItemContent>
                        <List.ItemMedia><div className={"big_user_head default_head user_head_"+userid}/></List.ItemMedia>
                        <List.ItemInner style={{fontSize:"2em"}}>
                            <List.ItemTitleRow>
                                <List.ItemTitle style={app.color.usernameColor(user)}>{username}</List.ItemTitle>
                            </List.ItemTitleRow>
                            <List.ItemText style={{fontSize:"0.8em"}}>
                                <span style={{color:"olivedrab"}}>{userid}</span>
                                <span className="ion-ios7-telephone" style={{marginLeft: "5%", color:"green"}} onClick={this.systemCall}></span>
                                <span className="ion-chatbox-working" style={{marginLeft: "12%", color:"green"}} onClick={this.systemMessage}></span>
                            </List.ItemText>
                        </List.ItemInner>
                     </List.ItemContent>
                 </List.List>
                </Content.ContentBlock>
                <Card.Card header="个性签名:" inner>
                    {sign}
                </Card.Card>
                <Content.ContentBlock>
                    <Grid.Row>
                        <Grid.Col><Button big fill color="green" onTap={this.sendMessage}>Send Message</Button></Grid.Col>
                    </Grid.Row>
                </Content.ContentBlock>
                <Content.ContentBlock>
                    <Grid.Row>
                        <Grid.Col per={50}><Button big fill color={callButtonColor} onTap={this.audioCall.bind(null, user.online)}>Audio Call</Button></Grid.Col>
                        <Grid.Col per={50}><Button big fill color={callButtonColor} onTap={this.videoCall.bind(null, user.online)}>Video Call</Button></Grid.Col>
                    </Grid.Row>
                </Content.ContentBlock>
            </View.PageContent>
            </View.Page>
        );
    }
});
