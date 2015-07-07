var React = require('react');
var UI = require('UI');

var View = UI.View;
var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Switch = UI.Form.Switch;
var Slider = UI.Form.Slider;
var Grid = UI.Grid;
var Button = UI.Button.Button;

module.exports = React.createClass({
    doLogin: function() {
        var userid = this.state.userid;
        if (!userid) {
            app.showError("Userid Needed!");
            return;
        }
        var password = this.state.password;
        if (!password) {
            app.showError("PassWord Needed!");
            return;
        }
        app.loginMgr.login(userid, password, this.state.autoLogin, this.state.remeberPassword);
    },
    doRegister: function() {
        app.showView('home', 'fade', null, true);
        app.toast("Will be complete soon");
    },
    handleUserIdInputChange: function(e) {
        this.setState({userid: e.target.value});
    },
    handlePassWordInputChange: function(e) {
        this.setState({password: e.target.value});
    },
    handleRememberPasswordSwitchChange: function(checked) {
        this.state.remeberPassword = checked;
    },
    handleAutoLoginSwitchChange: function(checked) {
        this.state.autoLogin = checked;
    },
    getInitialState: function() {
        var us = app.us;
        var constants = app.constants;
        var userid =  us.string(constants.LOGIN_USER_ID);
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
    render: function() {
        return (
            <View.Page>
                <View.PageContent>
                    <Content.ContentBlock>
                    <List.List block>
                        <List.ItemContent>
                            <List.ItemMedia><Icon name="icon-form-name"/></List.ItemMedia>
                            <List.ItemInner>
                                <List.ItemTitle label>Userid:</List.ItemTitle>
                                <List.ItemInput>
                                    <input type="text" placeholder="Please Input Userid" value={this.state.userid} onChange={this.handleUserIdInputChange}/>
                                </List.ItemInput>
                            </List.ItemInner>
                        </List.ItemContent>
                        <List.ItemContent>
                            <List.ItemMedia><Icon name="icon-form-password"/></List.ItemMedia>
                            <List.ItemInner>
                            <List.ItemTitle label>PassWord:</List.ItemTitle>
                                <List.ItemInput>
                                <input type="password" placeholder="Please Input PassWord" value={this.state.password} onChange={this.handlePassWordInputChange}/>
                                </List.ItemInput>
                            </List.ItemInner>
                        </List.ItemContent>
                        </List.List>
                    </Content.ContentBlock>

                    <Content.ContentBlock>
                    <List.List block>
                        <List.ItemContent>
                            <List.ItemInner>
                                <List.ItemTitle label style={{width:'80%'}}>Remeber Password:</List.ItemTitle>
                                <List.ItemInput>
                                    <Switch checked={this.state.remeberPassword} onChange={this.handleRememberPasswordSwitchChange}/>
                                </List.ItemInput>
                            </List.ItemInner>
                        </List.ItemContent>
                        <List.ItemContent>
                            <List.ItemInner>
                                <List.ItemTitle label style={{width:'80%'}}>Auto Login:</List.ItemTitle>
                                <List.ItemInput>
                                    <Switch checked={this.state.autoLogin} onChange={this.handleAutoLoginSwitchChange}/>
                                </List.ItemInput>
                            </List.ItemInner>
                        </List.ItemContent>
                    </List.List>
                    </Content.ContentBlock>

                    <Content.ContentBlock>
                        <Grid.Row>
                            <Grid.Col per={50}><Button big fill color="green" onTap={this.doLogin}>Login</Button></Grid.Col>
                            <Grid.Col per={50}><Button big fill color="red" onTap={this.doRegister}>Register</Button></Grid.Col>
                        </Grid.Row>
                    </Content.ContentBlock>
                </View.PageContent>
            </View.Page>
        );
    }
});
