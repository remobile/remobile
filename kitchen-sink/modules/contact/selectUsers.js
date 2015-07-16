var React = require('react');
var UI = require('UI');
var _ = require('underscore');
var Contacts = require('../home/pages/contacts');

var View = UI.View;
var Content = UI.Content;
var Grid = UI.Grid;
var List = UI.List;
var Select = UI.Select;
var Icon = UI.Icon.Icon;
var Button = UI.Button.Button;
var ButtonsRow = UI.Button.ButtonsRow;

module.exports = React.createClass({
    componentWillMount: function() {
        var value = this.props.data.param.value;
        this.users = value;
        this.originUsers = value;
        if (_.isArray(value)) {
            this.type = "checkbox";
            var list = value.concat();
            var self = this;
            this.onChange = function(val, checked) {
                if (checked) {
                    list.push(val);
                } else {
                    list =  _.without(list, val);
                }
                self.users = list;
            }
        } else {
            this.type = "radio";
            var self = this;
            this.onChange = function(val) {
                self.users = val;
            }
        }
    },
    doSetSelectUsers: function() {
        app.goBack(1, {users: this.users});
    },
    goBack: function() {
        app.goBack(1, {users: this.originUsers});
        return true;
    },
    render: function() {
        var value = this.props.data.param.value;
        var type = this.type;
        return (
            <View.Page title="Select Users" goBack={this.goBack}>
                <View.PageContent>
                    <Contacts select={{type:type, name:"contacts-"+type, default:value, onChange:this.onChange}} data={{param:{}}}/>
                    <Content.ContentBlock>
                        <Grid.Row>
                            <Grid.Col><Button big fill color="green" onTap={this.doSetSelectUsers}>确定</Button></Grid.Col>
                        </Grid.Row>
                    </Content.ContentBlock>
                </View.PageContent>
            </View.Page>
        );
    }
});


