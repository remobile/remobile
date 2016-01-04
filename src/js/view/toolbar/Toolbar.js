var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    render: function() {
    		var obj = {
    				"toolbar": true,
            "tabbar": this.props.tabbar,
            "tabbar-labels": this.props.labels
        };
        this.props.class&&(obj[this.props.class]=true);
        var className = cn(obj);
         return (
             <div className={className}>
                <div className="toolbar-inner">
                    {this.props.children}
                </div>
             </div>
         );
    }
});
