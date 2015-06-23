var React = require('react');

module.exports = React.createClass({
    render: function() {
         return (
             <label className="label-switch">
             		<input type="checkbox" />
             		<div className="checkbox"></div>
             </label>
         );
    }
});
