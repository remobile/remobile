var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    render: function() {
        var className = cn("tab-link", {
            "active": this.props.active
        });
        var icon = (this.props.active?this.props.icon[1]:this.props.icon[0])||this.props.icon[0];
        return (
            <a className={className} onClick={this.props.onTap}>
                <i className={"icon "+icon}>{this.props.badge}</i>
                <span className ="tabbar-label">{this.props.children}</span>
            </a>
        );
    }
});
