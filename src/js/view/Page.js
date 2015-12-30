/*framework7-base scroll-toolbars.js*/
var React = require('react');
var cn = require('classnames');
var NavbarTitle = require('./navbar/NavbarTitle');
var Navbar = require('./navbar/Navbar');
var BackButton = require('./navbar/BackButton');
var NavbarMixins = require('../mixins').Navbar;

var ScrollHideBar = function (container) {
    var p = this;
    var scrollContent = container.find('.page-content');

    p.hideNavbarOnPageScroll = false;
    p.hideToolbarOnPageScroll = false;
    p.hideTabbarOnPageScroll = false;
    p.showBarsOnPageScrollEnd = true;
    p.showBarsOnPageScrollTop = true;


    p.init = function () {
        var hideNavbar = (p.hideNavbarOnPageScroll || scrollContent.hasClass('hide-navbar-on-scroll') || scrollContent.hasClass('hide-bars-on-scroll')) && !(scrollContent.hasClass('keep-navbar-on-scroll') || scrollContent.hasClass('keep-bars-on-scroll'));
        var hideToolbar = (p.hideToolbarOnPageScroll || scrollContent.hasClass('hide-toolbar-on-scroll') || scrollContent.hasClass('hide-bars-on-scroll')) && !(scrollContent.hasClass('keep-toolbar-on-scroll') || scrollContent.hasClass('keep-bars-on-scroll'));
        var hideTabbar = (p.hideTabbarOnPageScroll || scrollContent.hasClass('hide-tabbar-on-scroll')) && !(scrollContent.hasClass('keep-tabbar-on-scroll'));

        if (!(hideNavbar || hideToolbar || hideTabbar)) return;

        var navbar = container.find('.navbar'),
        toolbar = container.find('.toolbar'),
        tabbar;
        if (hideTabbar) {
            tabbar = container.find('.tabbar');
        }

        var hasNavbar = navbar.length > 0,
        hasToolbar = toolbar.length > 0,
        hasTabbar = tabbar && tabbar.length > 0;

        var previousScroll, currentScroll;
        previousScroll = currentScroll = scrollContent[0].scrollTop;

        var scrollHeight, offsetHeight, reachEnd, action, navbarHidden, toolbarHidden, tabbarHidden;

        var toolbarHeight = (hasToolbar && hideToolbar) ? toolbar[0].offsetHeight : 0;
        var tabbarHeight = (hasTabbar && hideTabbar) ? tabbar[0].offsetHeight : 0;
        var bottomBarHeight = tabbarHeight || toolbarHeight;

        function handleScroll(e) {
            currentScroll = scrollContent[0].scrollTop;
            scrollHeight = scrollContent[0].scrollHeight;
            offsetHeight = scrollContent[0].offsetHeight;
            reachEnd = currentScroll + offsetHeight >= scrollHeight - bottomBarHeight;
            navbarHidden = navbar.hasClass('navbar-hidden');
            toolbarHidden = toolbar.hasClass('toolbar-hidden');
            tabbarHidden = tabbar && tabbar.hasClass('toolbar-hidden');

            if (reachEnd) {
                if (p.showBarsOnPageScrollEnd) {
                    action = 'show';
                }
            }
            else if (previousScroll > currentScroll) {
                if (p.showBarsOnPageScrollTop || currentScroll <= 44) {
                    action = 'show';
                }
                else {
                    action = 'hide';
                }
            }
            else {
                if (currentScroll > 44) {
                    action = 'hide';
                }
                else {
                    action = 'show';
                }
            }

            if (action === 'show') {
                if (hasNavbar && hideNavbar && navbarHidden) {
                    NavbarMixins.showNavbar(navbar);
                    container.removeClass('no-navbar-by-scroll');
                    navbarHidden = false;
                }
                if (hasToolbar && hideToolbar && toolbarHidden) {
                    NavbarMixins.showToolbar(toolbar);
                    container.removeClass('no-toolbar-by-scroll');
                    toolbarHidden = false;
                }
                if (hasTabbar && hideTabbar && tabbarHidden) {
                    NavbarMixins.showToolbar(tabbar);
                    container.removeClass('no-tabbar-by-scroll');
                    tabbarHidden = false;
                }
            }
            else {
                if (hasNavbar && hideNavbar && !navbarHidden) {
                    NavbarMixins.hideNavbar(navbar);
                    container.addClass('no-navbar-by-scroll');
                    navbarHidden = true;
                }
                if (hasToolbar && hideToolbar && !toolbarHidden) {
                    NavbarMixins.hideToolbar(toolbar);
                    container.addClass('no-toolbar-by-scroll');
                    toolbarHidden = true;
                }
                if (hasTabbar && hideTabbar && !tabbarHidden) {
                    NavbarMixins.hideToolbar(tabbar);
                    container.addClass('no-tabbar-by-scroll');
                    tabbarHidden = true;
                }
            }

            previousScroll = currentScroll;
        }
        scrollContent.on('scroll', handleScroll);
        scrollContent[0].f7ScrollToolbarsHandler = handleScroll;
    };
    p.destory = function () {
        scrollContent[0].f7ScrollToolbarsHandler&&scrollContent.off('scroll', scrollContent[0].f7ScrollToolbarsHandler);
    };

    return p;
};

module.exports = React.createClass({
    componentDidMount: function() {
        var pageContainer = $(this.refs.container.getDOMNode());
        if (this.props.scrollHideBar) {
            this.scrollHideBar = new ScrollHideBar(pageContainer);
            this.scrollHideBar.init();
        }
        // Init Material Preloader
        if (app.params.material && app.initPageMaterialPreloader) app.initPageMaterialPreloader(pageContainer);
        // Init Material Inputs
        if (app.params.material && app.initPageMaterialInputs) app.initPageMaterialInputs(pageContainer);
        // Init Material Tabbar
        if (app.params.material && app.initPageMaterialTabbar) app.initPageMaterialTabbar(pageContainer);
    },
    componentWillUnmount: function() {
        if (this.props.scrollHideBar) {
            this.scrollHideBar.destory();
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
            'toolbar-through': this.props.toolbar
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
