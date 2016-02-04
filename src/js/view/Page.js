var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
	render() {
		var obj = {
			"page": true
		};
		this.props.class&&(obj[this.props.class]=true);
		return (
			<div className={cn(obj)} style={this.props.style}>
				{this.props.children}
			</div>
		);
	}
});
