var React = require('react');
var cn = require('classnames');
var List = require('../list/List');
var Utils = require('../mixins/Utils');

var RadioItem = React.createClass({
    render: function() {
        var onChange = this.props.onChange;
        onChange = onChange&&onChange.bind(null, this.props.value);
        return (
            <li>
                <label className="label-radio item-content">
                    <input type="radio" value={this.props.value} name={this.props.name} defaultChecked={this.props.checked} onChange={onChange}/>
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
            name: this.props.name||('radio-'+this.uuid()),
            select: this.props.select||0
        }
    },
    render: function() {
        var name = this.state.name;
        var select = this.state.select;
        var onChange = this.props.onChange;
        return (
            <List block>
            {this.props.list.map((item, i) => {
                return <RadioItem label={item} value={i} name={name} checked={select===i} onChange={onChange}/>
            })}
            </List>
        );
    }
});

