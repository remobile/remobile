var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    render: function() {
        var className = cn("tab-link", {
            "active": this.props.active
        });
        return (
            <a className={className} onClick={this.props.onTap}>
                <i style={{marginTop:"-5px"}} className={"icon "+this.props.icon}>{this.props.badge}</i>
                <span className ="tabbar-label">{this.props.children}</span>
            </a>
        );
    }
});
