var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    render: function() {
        var obj = {
            'icon':true
        };
        this.props.name&&(obj[this.props.name] = true);
        var className = cn(obj);

        var style= {};
        if (this.props.round) {
            style.borderRadius = '50%';
        }
        return (
            <i className={className} style={style}></i>
        );
    }
});
