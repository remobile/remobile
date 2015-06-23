var React = require('react');

module.exports = React.createClass({
		getDefaultProps: function() {
			return {
				type: 'text'
			}
		},
    render: function() {
        return (
            <input type={this.props.type} className="modal-text-input modal-text-input-double" placeholder={this.props.placeholder}/>
        );
    }
});
