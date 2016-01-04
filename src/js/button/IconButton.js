var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    render() {
        var obj = {
            'icon':true
        };
        this.props.name&&(obj[this.props.name] = true);
        var className = cn(obj);
        return (
            <a href="#" onClick={this.props.onTap}>
                <i className={className}>
                </i>
            </a>
        );
    }
});
