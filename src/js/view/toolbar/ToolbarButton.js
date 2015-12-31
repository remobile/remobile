var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    componentWillReceiveProps: function(nextProps) {
        if (nextProps.active) {
            var el = $(this.refs.link.getDOMNode());
            var tabbar = el.parents('.tabbar')[0];
            app.materialTabbarSetHighlight(tabbar, el);
        }
    },
    render: function() {
        var className = cn("tab-link", {
            "active": this.props.active
        });
        return (
            <a className={className} onClick={this.props.onTap} ref="link">
                <i className={"icon "+this.props.icon}>{this.props.badge}</i>
                <span className ="tabbar-label">{this.props.children}</span>
            </a>
        );
    }
});
