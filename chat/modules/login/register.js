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

function getImageData(img, width, height) {
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    return canvas.toDataURL("image/png");
}

function getImage(i) {
    return 'img/app/head/'+i+'.jpg';
}

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
    componentWillMount: function() {
        this.headImageIndex = this.props.data.param.headImageIndex||0;
    },
    doRegister: function() {
        var userid = this.state.userid.replace(/-/g, "");
        if (!(/\d{11}/.test(userid))) {
            app.showError("Invalid Phone!");
            return;
        }
        var password = this.state.password;
        if (password !== this.state.confirmPwd) {
            app.showError("Please Confirm PassWord");
            return;
        }
        if (!this.state.username) {
            app.showError("UserName Empty!");
            return;
        }
        var head = getImageData(this.refs.head.getDOMNode(), 100,100);
        var param = {
            userid: userid,
            password: password,
            username: this.state.username,
            sign: this.state.sign,
            head: head
        };
        app.socket.emit('USER_REGISTER_RQ', param);
    },
    handleChange: function(type, e) {
        var state = {};
        state[type] = e.target.value;
        this.setState(state);
    },
    selectHead: function() {
        app.showView('selectHead', 'left');
    },
    getInitialState: function() {
        return {
            userid: '',
            password: '',
            username: '',
            sign: ''
        };
    },
    render: function() {
        return (
            <View.Page title="Register">
                <View.PageContent>
                    <Content.ContentBlock>
                    <List.List block>
                        <FormItem icon="ion-android-contact" label="Head:">
                            <img className={"big_user_head"} src={getImage(this.headImageIndex)} onClick={this.selectHead} ref="head"/>
                        </FormItem>
                    </List.List>
                    </Content.ContentBlock>

                    <Content.ContentBlock>
                    <List.List block>
                        <FormItem icon="icon-form-tel" label="Phone:">
                            <MaskInput mask="999-9999-9999" placeholder="Input Phone" type="tel" value={this.state.phone} onChange={this.handleChange.bind(this, "userid")}/>
                        </FormItem>
                        <FormInputItem icon="icon-form-name" label="User Name:" input_type="text" placeholder="Input UserName" value={this.state.username} onChange={this.handleChange.bind(this, "username")}/>
                    </List.List>
                    </Content.ContentBlock>

                    <Content.ContentBlock>
                    <List.List block>
                        <FormInputItem icon="icon-form-password" label="PassWord:" input_type="password" placeholder="Input PassWord" value={this.state.password} onChange={this.handleChange.bind(this, "password")}/>
                        <FormInputItem icon="icon-form-password" label="Confirm Pwd:" input_type="password" placeholder="Confirm PassWord" value={this.state.confirmPwd} onChange={this.handleChange.bind(this, "confirmPwd")}/>
                    </List.List>
                    </Content.ContentBlock>

                    <Content.ContentBlock>
                    <List.List block>
                        <FormItem icon="icon-form-comment" label="Sign:">
                            <textarea placeholder="Input Sign" value={this.state.sign} onChange={this.handleChange.bind(this, "sign")}></textarea>
                        </FormItem>
                    </List.List>
                    </Content.ContentBlock>

                    <Content.ContentBlock>
                        <Grid.Row>
                            <Grid.Col per={100}><Button big fill color="green" onTap={this.doRegister}>Register</Button></Grid.Col>
                        </Grid.Row>
                    </Content.ContentBlock>
                </View.PageContent>
            </View.Page>
        );
    }
});
