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
    onTap(tab, e) {
        var el = $(e.target);
        if (!el.hasClass('tab-link')) {
            el = el.parent();
        }
        app.showTab(tab, el);
        e.preventDefault();
        this.props.onTap&&this.props.onTap(tab, e);
    },
    render() {
        var className = cn("tab-link", {
            "active": this.props.active
        });
        var href = '#'+this.props.href;
        return (
            <a
                href={href}
                className={className}
                onClick={this.onTap.bind(null, href)}
                ref="link">
                <i className={"icon "+this.props.icon}>
                    {this.props.badge}
                </i>
                <span className ="tabbar-label">
                    {this.props.children}
                </span>
            </a>
        );
    }
});
