var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    render() {
        var obj = {};
        if (this.props.color) {
            obj['bg-'+this.props.color] = true;
        }
        var className = cn("badge", obj);
        return (
            <span className={className}>
                {this.props.children}
            </span>
        )
    }
});
