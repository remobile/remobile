var React = require('react');

module.exports = React.createClass({
    componentDidMount: function() {
        app.initFloatingLabel(this.getDOMNode());
    },
    render: function() {
         return (
             <div className='floating-label'>
         		{this.props.children}
         		<div className='label'>{this.props.label}</div>
         	</div>
         );
    }
});
