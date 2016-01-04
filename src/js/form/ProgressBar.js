var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
	getDefaultProps() {
		return {
			value: 0
		}
	},
	render() {
		var value = this.props.value;
		var obj = {
			"progressbar": true
		};
		if (this.props.color) {
			obj['color-'+this.props.color] = true;
		}
		var className = cn(obj);
		return (
			<div className={className}>

				<span style={{transform:"translate3d("+(-100+value)+"%, 0px, 0px)"}}>
				</span>
			</div>
		);
	}
});
