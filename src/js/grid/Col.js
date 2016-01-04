var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    getDefaultProps() {
        return {
            per: 100,
        }
    },
    render() {
        var obj = {};
        obj['col-'+this.props.per] = true;
        this.props.class&&(obj[this.props.class]=true);
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
