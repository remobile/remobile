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
        if (this.props.p) {
            return (
                <p className={className}>
                    {this.props.children}
                </p>
            );
        } else {
            return (
                <div className={className}>
                    {this.props.children}
                </div>
            );
        }
    }
});
