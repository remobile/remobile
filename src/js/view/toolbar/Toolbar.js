var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    render: function() {
        var className = cn("toolbar", {
            "tabbar": this.props.tabbar,
            "tabbar-labels": this.props.labels
        });
         return (
             <div className={className}>
                <div className="toolbar-inner">
                    {this.props.children}
                </div>
             </div>
         );
    }
});
