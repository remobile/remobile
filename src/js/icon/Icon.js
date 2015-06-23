var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    render: function() {
    		var obj = {
            'icon':true
        };
        this.props.name&&(obj[this.props.name] = true);
        var className = cn(obj);
         return (
             <i className={className}></i>
         );
    }
});
