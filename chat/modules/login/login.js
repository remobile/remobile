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
    mixins: [ReactMaskMixin],
    render: function() {
        return <input {...this.props} {...this.mask.props} />
    }
})

var FormItem = React.createClass({
     render: function() {
        return (
             <List.ItemContent>
                    {this.props.icon&&<List.ItemMedia><Icon name={this.props.icon}/></List.ItemMedia>}
                <List.ItemInner>
                    {this.props.label&&<List.ItemTitle label>{this.props.label}</List.ItemTitle>}
                    <List.ItemInput>
                        {this.props.children}
                    </List.ItemInput>
                </List.ItemInner>
            </List.ItemContent>
        );
    }
});

var FormInputItem = React.createClass({
     render: function() {
        return (
             <FormItem icon={this.props.icon} label={this.props.label}>
                 <input type={this.props.input_type} placeholder={this.props.placeholder} value={this.props.value} onChange={this.props.onChange}/>
            </FormItem>
        );
    }
});

module.exports = React.createClass({
    componentDidMount: function() {
        var autoLogin = this.state.autoLogin;
        var userid = this.state.userid;
        var password = this.state.password;
        if (autoLogin && userid && password) {
            app.loginMgr.autoLogin(userid, password, autoLogin, true);
        }
    },
    getInitialState: function() {
        var us = app.us;
        var constants = app.constants;
        var userid =  us.string(constants.LOGIN_USER_ID)||'';
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
    doLogin: function() {
        var userid = this.state.userid.replace(/-/g, "");
        if (!(/\d{11}/.test(userid))) {
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
    doRegister: function() {
        app.showView('register', 'left');
    },
    handleInputChange: function(type, e) {
        var state = {};
        state[type] = e.target.value;
        this.setState(state);
    },
    handleSwitchChange: function(type, checked) {
        var state = {};
        state[type] =  checked;
        this.setState(state);
    },
    render: function() {
        return (
            <View.Page>
                <View.PageContent>
                    <Content.ContentBlock>
                    <List.List block>
                        <FormItem icon="icon-form-tel" label="Phone:">
                            <MaskInput mask="999-9999-9999" placeholder="Input Phone" type="tel" value={this.state.userid} onChange={this.handleInputChange.bind(this, "userid")}/>
                        </FormItem>
                        <FormInputItem icon="icon-form-password" label="PassWord:" input_type="password" placeholder="Input PassWord" value={this.state.password} onChange={this.handleInputChange.bind(this, "password")}/>
                        </List.List>
                    </Content.ContentBlock>

                    <Content.ContentBlock>
                    <List.List block>
                        <List.ItemContent>
                            <List.ItemInner>
                                <List.ItemTitle label style={{width:'80%'}}>Remeber Password:</List.ItemTitle>
                                <List.ItemInput>
                                    <Switch checked={this.state.remeberPassword} onChange={this.handleSwitchChange.bind(this, "remeberPassword")}/>
                                </List.ItemInput>
                            </List.ItemInner>
                        </List.ItemContent>
                        <List.ItemContent>
                            <List.ItemInner>
                                <List.ItemTitle label style={{width:'80%'}}>Auto Login:</List.ItemTitle>
                                <List.ItemInput>
                                    <Switch checked={this.state.autoLogin} onChange={this.handleSwitchChange.bind(this, "autoLogin")}/>
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
