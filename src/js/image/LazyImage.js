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
        var props = {};
        this.props.width&&(props.width=this.props.width);
        this.props.height&&(props.height=this.props.height);
        return (
            <img data-src={this.props.src} className={className} {...props} style={this.props.style}/>
        )
    }
});
