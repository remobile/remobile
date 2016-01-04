var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
	toggleDialPanel() {
		var el = $(this.getDOMNode());
		el.toggleClass('speed-dial-opened');
	},
	showPopoverPanel() {
		app.showCover(this.props.popover, {type:'popover', target:this.getDOMNode()});
	},
	render() {
		var obj = {
			'floating-button':true,
			'floating-button-to-popover':this.props.popover,
		};
		this.props.color&&(obj["color-"+this.props.color] = true);
		var className = cn(obj);
		if (this.props.onTap) {
			return (
				<a
					href="#"
					className={className}
					onClick={this.props.onTap}>
					<i className="icon icon-plus">
					</i>
				</a>
			);
		} else if (this.props.popover) {
			return (
				<a
					href="#"
					className={className}
					onClick={this.showPopoverPanel}>
					<i className="icon icon-plus">
					</i>
				</a>
			);
		} else {
			return (
				<div className="speed-dial">

					<a
						href="#"
						className={className}
						onClick={this.toggleDialPanel}>
						<i className="icon icon-plus">
						</i>
						<i className="icon icon-close">
						</i>
					</a>

					<div className="speed-dial-buttons">
						{this.props.children}

					</div>

				</div>
			);
		}
	}
});
