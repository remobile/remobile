/*framework7-base scroll-toolbars.js*/
var React = require('react');
var cn = require('classnames');
var NavbarTitle = require('./navbar/NavbarTitle');
var Navbar = require('./navbar/Navbar');
var BackButton = require('./navbar/BackButton');

module.exports = React.createClass({
    componentDidMount: function() {
        var pageContainer = $(this.refs.container.getDOMNode());
        if (this.props.scrollHideBar) {
            app.initPageScrollToolbars(pageContainer);
        }
        // Init Material Preloader
        if (app.params.material && app.initPageMaterialPreloader) app.initPageMaterialPreloader(pageContainer);
        // Init Material Inputs
        if (app.params.material && app.initPageMaterialInputs) app.initPageMaterialInputs(pageContainer);
        // Init Material Tabbar
        if (app.params.material && app.initPageMaterialTabbar) app.initPageMaterialTabbar(pageContainer);
    },
    componentWillUnmount: function() {
        var pageContainer = $(this.refs.container.getDOMNode());
        if (this.props.scrollHideBar) {
            app.destroyScrollToolbars(pageContainer);
        }
    },
    render: function() {
        var navbar = false;
        var title = false;
        if (this.props.title) {
            navbar = true;
            title = this.props.title;
        } else if (this.props.navbar) {
            navbar = true;
        }
        var className = cn("page", {
            'navbar-through': navbar,
            'toolbar-through': this.props.toolbar,
            'tabbar-labels-through': this.props.labelsTabbar,
        });
        return (
            <div
                className={className}
                style={this.props.style}
                ref="container">
                {!!title&&
                    <Navbar goBack={this.props.goBack} backText={this.props.backText}>
                        <NavbarTitle>
                            {title}
                        </NavbarTitle>
                        {this.props.right}
                    </Navbar>
                }
                {this.props.children}
            </div>
        );
    }
});
