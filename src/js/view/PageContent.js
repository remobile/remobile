var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    render: function() {
        var obj = {
            "messages-content": this.props.message,
            "hide-bars-on-scroll": this.props.scrollHideBar,
            "with-subnavbar": this.props.subnavbar
        };
        this.props.class&&(obj[this.props.class]=true);
        var className = cn("page-content", obj);
        return (
            <div className={className}>
                {this.props.children}
            </div>
        );
    }
});
