var React = require('react');

module.exports = React.createClass({
	getDefaultProps() {
		return {
			type: 'text'
		}
	},
	render() {
		return (
			<input
				type={this.props.type}
				className="modal-text-input"
				placeholder={this.props.placeholder}/>
		);
	}
});
