var React = require('react');

module.exports = React.createClass({
    onChange: function(e) {
        this.setState({checked: (e.target.checked)});
        this.props.onChange&&this.props.onChange(this.state.checked);
    },
    render: function() {
         return (
             <label className="label-switch">
             		<input type="checkbox" checked={this.state.checked} onChange={this.onChange}/>
             		<div className="checkbox"></div>
             </label>
         );
    }
});
