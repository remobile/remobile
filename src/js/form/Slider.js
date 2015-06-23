var React = require('react');

module.exports = React.createClass({
		getDefaultProps: function() {
			return {
				param: {min:0, max:100, value:50, step:1}
			}
		},
    render: function() {
    		var param = this.props.param;
         return (
            <div className="range-slider">
            	<input type="range" min={param.min} max={param.max} defaultValue={param.value} step={param.step} />
            </div>
         );
    }
});
