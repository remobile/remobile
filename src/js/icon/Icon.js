var React = require('react');
var cn = require('classnames');
var assign = require('object-assign');

module.exports = React.createClass({
    render() {
        var obj = {
            'icon':true
        };
        this.props.name&&(obj[this.props.name] = true);
        var className = cn(obj);

        var style= {};
        if (this.props.round) {
            style.borderRadius = '50%';
        }
        if (this.props.color) {
            style.color = this.props.color;
        }
        style = assign(style, this.props.style);
        return (
            <i className={className} style={style}>
            </i>
        );
    }
});
