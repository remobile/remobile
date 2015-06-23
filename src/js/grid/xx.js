var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    getDefaultProps: function() {
        return {
            per: 100,
        }
    },
    render: function() {
        var obj = {};
        obj['col-'+this.props.per] = true;
        var className = cn(obj);
        return (
            <div className={className}>
            <div className={className}>
            {this.props.children}
            </div>
            </div>
        );
    }
});
