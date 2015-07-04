var React = require('react');

module.exports = React.createClass({
    getInitialState: function() {
        return {
            checked: this.props.checked
        };
    },
    onChange: function(e) {
        var checked = e.target.checked;
        this.setState({checked: (checked)});
        this.props.onChange&&this.props.onChange(checked);
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
