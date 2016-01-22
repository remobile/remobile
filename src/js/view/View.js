var React = require('react');
var cn = require('classnames');
var LifeCycle = require('@remobile/react-lifecycle');


module.exports = React.createClass({
    // mixins: [LifeCycle('view', 1)],
    goBack(callback) {
        var tag0 = this.pageTag;
        var tag1 = tag0^1;

        var newPage = this.pages[tag0];
        var oldPage = this.pages[tag1];
        var newNavbarInner = this.navbars[tag0];
        var oldNavbarInner = this.navbars[tag1];

        app.showViewExitAnimate({oldPage, newPage, oldNavbarInner, newNavbarInner, dynamicNavbar:true, callback:()=>{
            newPage.css('z-index', 1);
            oldPage.css('z-index', 0);
            oldPage.removeClass('page-from-center-to-right page-on-center').addClass('page-on-left');
            callback();
        }});
    },
    componentWillMount() {
        app.view = this;
        this.pageTag = 0;
    },
    componentDidMount() {
        this.pages = [$(this.refs.page0.getDOMNode()), $(this.refs.page1.getDOMNode())];
        this.navbars = [$(this.refs.navbar0.getDOMNode()), $(this.refs.navbar1.getDOMNode())];
        this.pageTag = this.pageTag^1;
    },
    componentWillUpdate: function(nextProps, nextState){
        var tag0 = this.pageTag;
        var tag1 = tag0^1;
        this.pages[tag0].css('z-index', 1);
        this.pages[tag1].css('z-index', 0);
        if (!!nextProps.newView.navbar) {
            this.navbars[0].parent().css('display', 'block');
        } else {
            this.navbars[0].parent().css('display', 'none');
        }
    },
    componentDidUpdate(prevProps, prevState) {
        var tag0 = this.pageTag;
        var tag1 = tag0^1;

        var newPage = this.pages[tag0];
        var oldPage = this.pages[tag1];
        var newNavbarInner = this.navbars[tag0];
        var oldNavbarInner = this.navbars[tag1];

        app.sizeNavbars($(this.getDOMNode()));
        if (!this.props.noAnimate) {
            app.showViewEnterAnimate({oldPage, newPage, oldNavbarInner, newNavbarInner, dynamicNavbar:true});
        } else {
            app.adjustViewBackupNavbars({oldNavbarInner, newNavbarInner});
        }
        this.pageTag = this.pageTag^1;
    },
    render() {
        var newView = this.props.newView, oldView = this.props.oldView||{};
        var newnavbar = newView.navbar, newtoolbar = newView.toolbar, newpage = newView.page;
        var oldnavbar = oldView.navbar, oldtoolbar = oldView.toolbar, oldpage = oldView.page;
        var co = {
            'pages': true,
            'navbar-through': !!newnavbar,
            'toolbar-through': !!newtoolbar,
        };
        return (
            <div className='view'>
                <div className='navbar'>
                    <div ref="navbar1" className='navbar-inner navbar-on-left'>
                        {this.pageTag===1 ? newnavbar : oldnavbar}
                    </div>
                    <div ref="navbar0" className='navbar-inner navbar-on-center'>
                        {this.pageTag===0 ? newnavbar : oldnavbar}
                    </div>
                </div>
                { !!newtoolbar &&
                    <div className='toolbar'>
                        {newtoolbar}
                    </div>
                }
                <div className={cn(co)}>
                    <div ref="page1" className='page'>
                        {this.pageTag===1 ? newpage : oldpage}
                    </div>
                    <div ref="page0" className='page'>
                        {this.pageTag===0 ? newpage : oldpage}
                    </div>
                </div>
            </div>
        );
    }
});
