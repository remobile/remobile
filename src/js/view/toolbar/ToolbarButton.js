var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    componentWillReceiveProps(nextProps) {
        if (nextProps.active) {
            var el = $(this.refs.link.getDOMNode());
            var tabbar = el.parents('.tabbar')[0];
            app.materialTabbarSetHighlight(tabbar, el);
        }
    },
    render() {
        var className = cn("tab-link", {
            "active": this.props.active
        });
        var icon;
        if ($.isArray(this.props.icon)) {
            icon = this.props.active?this.props.icon[0]:this.props.icon[1];
        } else {
            icon = this.props.icon;
        }
        return (
            <a
                className={className}
                onClick={this.props.onTap}
                ref="link">
                <i className={"icon "+icon}>
                    {this.props.badge}
                </i>
                <span className ="tabbar-label">
                    {this.props.children}
                </span>
            </a>
        );
    }
});
