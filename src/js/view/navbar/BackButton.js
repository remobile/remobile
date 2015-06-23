var React = require('react');

module.exports = React.createClass({
    render: function() {
        return (
            <div className="left sliding">
	            <a href="#" className="back link" onClick={app.goBack.bind(null, 1)}><i className="icon icon-back"></i>
	            	<span>{this.props.children}</span>
	            </a>
            </div>
        );
    }
});
