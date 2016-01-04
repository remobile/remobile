var assign = require('object-assign');
var React = require('react/addons');
var system = require('../system');
var Toast = require('../Toast').Toast;
var template7 = require('../framework7/template7.js');
var clicks = require('../framework7/clicks.js');
var fastClicks = require('../framework7/fast-clicks.js');
var materialInputs = require('../framework7/material-inputs.js');
var materialPreloader = require('../framework7/material-preloader.js');
var materialTabbar = require('../framework7/material-tabbar.js');
var swipeout = require('../framework7/swipeout.js');
var sortable = require('../framework7/sortable.js');
var swiper = require('../framework7/swiper.js');
var swiperInit = require('../framework7/swiper-init.js');
var navbars = require('../framework7/navbars.js');
var searchbar = require('../framework7/searchbar.js');
var scrollToolbars = require('../framework7/scroll-toolbars.js');
var photoBrowser = require('../framework7/photo-browser.js');
var notifications = require('../framework7/notifications.js');
var modals = require('../framework7/modals.js');
var picker = require('../framework7/picker.js');
var calendar = require('../framework7/calendar.js');
var panels = require('../framework7/panels.js');
var autocomplete = require('../framework7/autocomplete.js');
var tabs = require('../framework7/tabs.js');
var accordion = require('../framework7/accordion.js');
var pullToRefresh = require('../framework7/pull-to-refresh.js');
var infiniteScroll = require('../framework7/infinite-scroll.js');
var floatingLabel = require('../framework7/floating-label.js');

var VERSION = '1.4.0';
var TRANSITIONS_INOUT = {
    'none': { in: false, out: false },
    'fade': { in: true, out: true },
    'fade-contract': { in: true, out: true },
    'fade-expand': { in: true, out: true },
    'show-from-left': { in: true, out: true },
    'show-from-right': { in: true, out: true },
    'show-from-top': { in: true, out: true },
    'show-from-bottom': { in: true, out: true },
    'reveal-from-left': { in: true, out: true },
    'reveal-from-right': { in: true, out: true },
    'reveal-from-top': { in: false, out: true },
    'reveal-from-bottom': { in: false, out: true }
};

var VIEW_TRANSITIONS = {
    'node': { go: 'node', back: 'node' },
    'fade': { go: 'fade', back: 'fade' },
    'in': { go: 'fade-contract', back: 'fade-expand' },
    'out': { go: 'fade-expand', back: 'fade-contract' },
    'right': { go: 'show-from-left', back: 'reveal-from-left' },
    'left': { go: 'show-from-right', back: 'reveal-from-right' },
    'up': { go: 'show-from-bottom', back: 'reveal-from-bottom' },
    'down': { go: 'show-from-top', back: 'reveal-from-top' }
};


var params = {
    cache: true,
    cacheIgnore: [],
    cacheIgnoreGetParameters: false,
    cacheDuration: 1000 * 60 * 10, // Ten minutes
    preloadf7Page: true,
    uniqueHistory: false,
    uniqueHistoryIgnoreGetParameters: false,
    dynamicPageUrl: 'content-{{index}}',
    allowDuplicateUrls: false,
    router: true,
    // Push State
    pushState: false,
    pushStateRoot: undefined,
    pushStateNoAnimation: false,
    pushStateSeparator: '#!/',
    pushStatePreventOnLoad: true,
    // Fast clicks
    fastClicks: true,
    fastClicksDistanceThreshold: 10,
    fastClicksDelayBetweenClicks: 50,
    // Tap Hold
    tapHold: false,
    tapHoldDelay: 750,
    tapHoldPreventClicks: true,
    // Active State
    activeState: true,
    activeStateElements: 'a, button, label, span',
    // Animate Nav Back Icon
    animateNavBackIcon: false,
    // Swipe Back
    swipeBackPage: true,
    swipeBackPageThreshold: 0,
    swipeBackPageActiveArea: 30,
    swipeBackPageAnimateShadow: true,
    swipeBackPageAnimateOpacity: true,
    // Ajax
    ajaxLinks: undefined, // or CSS selector
    // External Links
    externalLinks: '.external', // CSS selector
    // Sortable
    sortable: true,
    // Scroll toolbars
    hideNavbarOnPageScroll: false,
    hideToolbarOnPageScroll: false,
    hideTabbarOnPageScroll: false,
    showBarsOnPageScrollEnd: true,
    showBarsOnPageScrollTop: true,
    // Swipeout
    swipeout: true,
    swipeoutActionsNoFold: false,
    swipeoutNoFollow: false,
    // Smart Select Back link template
    smartSelectOpenIn: 'page', // or 'popup' or 'picker'
    smartSelectBackText: 'Back',
    smartSelectPopupCloseText: 'Close',
    smartSelectPickerCloseText: 'Done',
    smartSelectSearchbar: false,
    smartSelectBackOnSelect: false,
    // Tap Navbar or Statusbar to scroll to top
    scrollTopOnNavbarClick: false,
    scrollTopOnStatusbarClick: false,
    // Panels
    swipePanel: false, // or 'left' or 'right'
    swipePanelActiveArea: 0,
    swipePanelCloseOpposite: true,
    swipePanelOnlyClose: false,
    swipePanelNoFollow: false,
    swipePanelThreshold: 0,
    panelsCloseByOutside: true,
    // Modals
    modalButtonOk: 'OK',
    modalButtonCancel: 'Cancel',
    modalUsernamePlaceholder: 'Username',
    modalPasswordPlaceholder: 'Password',
    modalTitle: 'Framework7',
    modalCloseByOutside: false,
    actionsCloseByOutside: true,
    popupCloseByOutside: true,
    modalPreloaderTitle: 'Loading... ',
    modalStack: true,
    // Lazy Load
    imagesLazyLoadThreshold: 0,
    imagesLazyLoadSequential: true,
    // Name space
    // viewClass: 'view',
    // viewMainClass: 'view-main',
    // viewsClass: 'views',
    // Notifications defaults
    notificationCloseOnClick: false,
    notificationCloseIcon: true,
    notificationCloseButtonText: 'Close',
    // Animate Pages
    animatePages: true,
    // Template7
    templates: {},
    template7Data: {},
    template7Pages: false,
    precompileTemplates: false,
    // Material
    material: false,
    materialPageLoadDelay: 0,
    materialPreloaderSvg: '<svg xmlns="http://www.w3.org/2000/svg" height="75" width="75" viewbox="0 0 75 75"><circle cx="37.5" cy="37.5" r="33.5" stroke-width="8"/></svg>',
    materialPreloaderHtml:
    '<span class="preloader-inner">' +
    '<span class="preloader-inner-gap"></span>' +
    '<span class="preloader-inner-left">' +
    '<span class="preloader-inner-half-circle"></span>' +
    '</span>' +
    '<span class="preloader-inner-right">' +
    '<span class="preloader-inner-half-circle"></span>' +
    '</span>' +
    '</span>',
    materialRipple: true,
    materialRippleElements: '.ripple, a.link, a.item-link, .button, .modal-button, .tab-link, .label-radio, .label-checkbox, .actions-modal-button, a.searchbar-clear, a.floating-button, .floating-button > a, .speed-dial-buttons a',
    // Auto init
    init: true,
};


function App (views) {
    return {
        version: VERSION,
        params: params,
        device: system.Device,
        support: system.Support,
        touchEvents: {
            start: system.Support.touch ? 'touchstart' : 'mousedown',
            move: system.Support.touch ? 'touchmove' : 'mousemove',
            end: system.Support.touch ? 'touchend' : 'mouseup'
        },
        toast: function (text, icon) {
            Toast({text: text, icon:icon});
        },
        init: function () {
            this.t7 =  template7;
            this.ls = window.localStorage;
            this._compiledTemplates = {};
            fastClicks(this).initFastClicks();
            clicks(this).initClickEvents();
            materialInputs(this).initMaterialWatchInputs();
            materialPreloader(this);
            materialTabbar(this);
            swiper(this);
            swiperInit(this);
            swipeout(this).initSwipeout();
            sortable(this).initSortable();
            navbars(this);
            searchbar(this);
            scrollToolbars(this);
            photoBrowser(this);
            notifications(this);
            modals(this);
            picker(this);
            calendar(this);
            panels(this).initSwipePanels();
            autocomplete(this);
            tabs(this);
            accordion(this);
            pullToRefresh(this);
            infiniteScroll(this);
            floatingLabel(this);
        },
        componentWillMount: function () {
            window._ = require('underscore');
            _.mixin({
                deepClone: function(obj) { return (!obj || (typeof obj !== 'object'))?obj:
                    (_.isString(obj))?String.prototype.slice.call(obj):
                    (_.isDate(obj))?obj.valueOf():
                    (_.isFunction(obj.clone))?obj.clone():
                    (_.isArray(obj)) ? _.map(obj, function(t){return _.deepClone(t)}):
                    _.mapObject(obj, function(val, key) {return _.deepClone(val)});
                }
            });

            window.app = this;
            this.history = [];
            this.data = {};
            this.methods = {};
            this.resPath = window.location.pathname.replace(/index.html$/,/index.html$/, '');
            this.init();
        },
        getCurrentView: function () {
            var currentView = this.state.currentView;
            var props =  {data: this.data.tempPassData};
            this.data.tempPassData = null;
            var viewsData = {};
            viewsData[currentView] = React.createElement(views[currentView], props);
            return React.addons.createFragment(viewsData);
        },
        getInitialState: function () {
            return {
                viewTransition: this.getViewTransition('none')
            };
        },
        getViewTransition: function (key) {
            return assign({
                key: key,
                name: 'view-transition-' + key
            }, TRANSITIONS_INOUT[key]);
        },
        displayView: function (viewId, transition, param) {
            this.data.tempPassData = {
                param: param,
                from: this.state.currentView
            };

            this.setState({
                currentView: viewId,
                viewTransition: this.getViewTransition(transition)
            });
        },
        showView: function (viewId, transition, param, norecord) {
            var trans = VIEW_TRANSITIONS[transition];
            param = param||{};
            if (!norecord) {
                var saved = param.saved||{};
                if (param.saved) {
                    delete param.saved;
                }
                saved = assign(saved, {scrollTop: $('.page-content').scrollTop()});
                this.history.push({id:this.state.currentView, title:this.data.lastTitle, transition:transition, saved:saved});
                this.data.lastTitle = param.backText||this.data.currentTitle||'Back';
            }
            this.displayView(viewId, trans? trans.go: 'none', param);
        },
        goBack: function(step, param) {
            if (!step) {
                step = 1;
            }
            var obj;
            for (var i=0; i<step; i++) {
                var t = this.history.pop();
                t && (obj = t);
            }
            if (obj) {
                var trans = VIEW_TRANSITIONS[obj.transition];
                param = assign({}, param);
                param.saved = obj.saved;
                this.data.lastTitle = obj.title;
                this.displayView(obj.id, trans? trans.back: 'none', param);
            }
        }
    };
}

module.exports = App;
