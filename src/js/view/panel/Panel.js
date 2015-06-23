var React = require('react');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var cn = require('classnames');

module.exports = React.createClass({
		getDefaultProps: function() {
			return {
				visible: false
			}
		},
    render: function() {
				var className = cn("panel", {
					"panel-left": this.props.type==="left",
					"panel-right": this.props.type==="right",
					"layout-dark": true
				});
				var transition = (this.props.type==="left")?"panelLeft":"panelRight";
         return (
         	<div>
	         	{this.props.visible&&<div className= "panel-overlay" onClick={app.hidePanel}/>}
		        <ReactCSSTransitionGroup transitionName={transition}>
			          {this.props.visible&&<div className={className}>{this.props.children}</div>}
		        </ReactCSSTransitionGroup>
	        </div>
	       )
    }
});
