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

        app.showViewExitAnimate({oldPage, newPage, oldNavbarInner, newNavbarInner, dynamicNavbar:!app.params.material, callback:()=>{
            newPage.css('z-index', 1);
            oldPage.css('z-index', 0);
            newNavbarInner.css('z-index', 1);
            oldNavbarInner.css('z-index', 0);
            oldPage.removeClass('page-from-center-to-right page-on-center').addClass('page-on-left');
            callback();
        }});
    },
    updateCurrentTitle(dom) {
        app.data.currentTitle = dom.find('.navbar-inner>.center').html();
    },
    getInitialState() {
        return {
            coverVisible: false
        };
    },
    componentWillMount() {
        app.view = this;
        this.pageTag = 0;
    },
    componentDidMount() {
        this.pages = [$(this.refs.page0.getDOMNode()), $(this.refs.page1.getDOMNode())];
        this.navbars = [$(this.refs.navbar0.getDOMNode()), $(this.refs.navbar1.getDOMNode())];
        this.pageTag = this.pageTag^1;

        if (!app.params.material) {
            if (!!this.props.newView.navbar) {
                this.navbars[0].parents('.navbar').css('display', 'block');
            } else {
                this.navbars[0].parents('.navbar').css('display', 'none');
            }
            this.updateCurrentTitle(this.navbars[0]);
        }
    },
    componentWillUpdate: function(nextProps, nextState){
        var tag0 = this.pageTag;
        var tag1 = tag0^1;
        this.pages[tag0].css('z-index', 1);
        this.pages[tag1].css('z-index', 0);
        if (!app.params.material) {
            this.navbars[tag0].css('z-index', 1);
            this.navbars[tag1].css('z-index', 0);
            if (!!nextProps.newView.navbar) {
                this.navbars[0].parents('.navbar').css('display', 'block');
            } else {
                this.navbars[0].parents('.navbar').css('display', 'none');
            }
        }
    },
    componentDidUpdate(prevProps, prevState) {
        var tag0 = this.pageTag;
        var tag1 = tag0^1;

        var newPage = this.pages[tag0];
        var oldPage = this.pages[tag1];
        var newNavbarInner = this.navbars[tag0];
        var oldNavbarInner = this.navbars[tag1];
        if (!app.params.material) {
            var newBackButton = newNavbarInner.find('.navbar-inner>.left span');
            var oldBackButton = oldNavbarInner.find('.navbar-inner>.left span');
            if (!newBackButton.html()) {
                newBackButton.html(app.getVisibleTitle(app.data.lastTitle));
            }
            if (!oldBackButton.html()) {
                oldBackButton.html(app.getVisibleTitle(app.data.lastLastTitle));
            }
        }
        app.sizeNavbars($(this.getDOMNode()));
        if (!this.props.noAnimate) {
            app.showViewEnterAnimate({oldPage, newPage, oldNavbarInner, newNavbarInner, dynamicNavbar:!app.params.material});
        } else {
            app.adjustViewBackupNavbars({oldNavbarInner, newNavbarInner});
        }
        this.pageTag = this.pageTag^1;
        if (!app.params.material) {
            this.updateCurrentTitle(newNavbarInner);
        }
    },
    render() {
        var newView = this.props.newView, oldView = this.props.oldView||{};
        var newnavbar = newView.navbar?<newView.navbar params={newView.params||{}} saved={newView.saved||{}}/>:null,
            newtoolbar = newView.toolbar?<newView.toolbar params={newView.params||{}} saved={newView.saved||{}}/>:null,
            newpage = <newView.page params={newView.params||{}} saved={newView.saved||{}}/>;
        var oldnavbar = oldView.navbar?<oldView.navbar params={oldView.params||{}} saved={oldView.saved||{}}/>:null,
        	oldtoolbar = oldView.toolbar?<oldView.toolbar params={oldView.params||{}} saved={oldView.saved||{}}/>:null,
            oldpage = oldView.page?<oldView.page params={oldView.params||{}} saved={oldView.saved||{}}/>:null;

		if (app.params.material) {
            var co = {
                'pages': true,
                'navbar-fixed': !!newnavbar,
            };
	        return (
	            <div className='view'>
	                <div className={cn(co)}>
	                    <div ref="page1" className='page'>
                            <div className='navbar'>
                                <div ref="navbar1" className='navbar-inner'>
                                    {this.pageTag===1 ? newnavbar : oldnavbar}
                                </div>
                            </div>
                            {this.pageTag===1 ? newtoolbar : oldtoolbar}
                            {this.pageTag===1 ? newpage : oldpage}
	                    </div>
                        <div ref="page0" className='page'>
                            <div className='navbar'>
                                <div ref="navbar0" className='navbar-inner'>
                                    {this.pageTag===0 ? newnavbar : oldnavbar}
                                </div>
                            </div>
                            {this.pageTag===0 ? newtoolbar : oldtoolbar}
                            {this.pageTag===0 ? newpage : oldpage}
                        </div>
	                </div>
	            </div>
	        );
		} else {
	        var co = {
	            'pages': true,
	            'navbar-through': !!newnavbar,
	            'tabbar-labels-fixed': !!newtoolbar,
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
	                {newtoolbar}
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
    }
});
