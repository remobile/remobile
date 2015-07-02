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
        app.showView('home', 'fade', null, true);
    },
    doRegister: function() {
        app.toast("Will be complete soon");
    },
    handleUserIdInputChange: function(e) {
        this.setState({userid: event.target.value});
    },
    handlePassWordInputChange: function() {
        this.setState({password: event.target.value});
    },
    handleAutoLoginSwitchChange: function() {
        this.setState({autoLogin: event.target.value});
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
                                    <Switch />
                                </List.ItemInput>
                            </List.ItemInner>
                        </List.ItemContent>
                        <List.ItemContent>
                            <List.ItemInner>
                                <List.ItemTitle label style={{width:'80%'}}>Auto Login:</List.ItemTitle>
                                <List.ItemInput>
                                    <Switch />
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
