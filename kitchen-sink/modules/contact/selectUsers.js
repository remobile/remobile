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

var ContactsList = function(value, handleChange) {
    var type, onChange;
    if (_.isArray(value)) {
        type = "checkbox";
        var list = value.concat();
        onChange = function(val, checked) {
            if (checked) {
                list.push(val);
            } else {
                list =  _.without(list, val);
            }
            handleChange(list);
        }
    } else {
        type = "radio";
        onChange = function(val) {
            handleChange(val);
        }
    }
    return <Contacts select={{type:type, name:"contacts-"+type, default:value, onChange:onChange}}/>
}

module.exports = React.createClass({
    render: function() {
        var param = this.props.data.param;
        var value = param.value;
        var onChange = param.onChange;
        return (
            <View.Page title="Select Users">
                <View.PageContent>
                    {ContactsList(value, onChange)}
                </View.PageContent>
            </View.Page>
        );
    }
});


