var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    render() {
        var obj = {
        	"lazy-fadeIn":true,
        	"lazy":true,
        };
        this.props.class&&(obj[this.props.class]=true);
        var className = cn(obj);
        return (
            <div data-background={this.props.background} className={className} style={this.props.style}>{this.props.children}</div>
        )
    }
});
