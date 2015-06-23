var React = require('react');
var cn = require('classnames');
var List = require('../list');
var Utils = require('../mixins/Utils');
var _ = require('underscore');

var CheckBoxItem = React.createClass({
    render: function() {
        var onChange = this.props.onChange;
        onChange = onChange&&onChange.bind(null, this.props.value);
        return (
            <li>
                <label className="label-checkbox item-content">
                    <input type="checkbox" value={this.props.value} name={this.props.name} defaultChecked={this.props.checked} onChange={onChange}/>
                    <div className="item-media">
                        <i className="icon icon-form-checkbox"></i>
                    </div>
                    <div className="item-inner">
                        <div className="item-title">{this.props.label}</div>
                    </div>
                </label>
            </li>
        );
    }
});

module.exports = React.createClass({
    mixins: [Utils],
    getInitialState: function() {
        return {
            name:this.props.name||('checkbox-'+this.uuid()),
            checkedList: this.props.select||[]
        }
    },
    onChange: function(i, e) {
        if (e.target.checked) {
            this.state.checkedList.push(i);
        } else {
            this.state.checkedList = _.without(this.state.checkedList, i);
        }
        this.props.onChange(this.state.checkedList);
    },
    render: function() {
        var onChange = this.props.onChange?this.onChange:null;
        var title= this.props.title;
        var name = this.state.name;
        var checkedList = this.state.checkedList;
        return (
            <List.List block>
            {title&&<List.ItemDivider>{title}</List.ItemDivider>}
            {this.props.list.map((item, i) => {
                return <CheckBoxItem label={item} value={i} name={name} checked={checkedList.indexOf(i)!==-1} onChange={onChange}/>
            })}
            </List.List>
        );
    }
});
