var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
	render() {
		return (
			<div className="page" style={this.props.style}>
				{this.props.children}
			</div>
		);
	}
});
