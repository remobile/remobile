var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
	render: function() {
		var content;
		if (this.props.link) {
			if (this.props.swipeout) {
				content = <div className="swipeout-content"><a href="#" className="item-link item-content" onClick={this.props.onTap}>{this.props.children}</a></div>;
			} else {
				content = <a href="#" className="item-link item-content" onClick={this.props.onTap}>{this.props.children}</a>;
			}
		} else {
			var dcn = cn("item-content", {"swipeout-content": this.props.swipeout});
			content = <div className={dcn} onClick={this.props.onTap}>{this.props.children}</div>;
		}
		var className = cn({"swipeout": this.props.swipeout});
		
		return (
			<li className={className}>
				{content}
				{this.props.sortable&&<div className="sortable-handler"></div>}
				{this.props.swipeoutLeft&&<div className="swipeout-actions-left">{this.props.swipeoutLeft}</div>}
				{this.props.swipeoutRight&&<div className="swipeout-actions-right">{this.props.swipeoutRight}</div>}
			</li>
		);
	}
});
