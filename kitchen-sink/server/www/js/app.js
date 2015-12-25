(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var React = require('react/addons');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var classnames = require('classnames');
var UI = require('UI');
var ModalPanel = UI.Modal.ModalPanel;
var views = require('./modules');
var welcome = require('./modules/home/welcome');

var App = React.createClass({
    displayName: 'App',

    mixins: [UI.Mixins.App(views)],
    componentWillMount: function componentWillMount() {
        // welcome.showWelcome();
    },
    showModal: function showModal(modalType, modalChildren) {
        this.setState({ modalVisible: true, modalChildren: modalChildren, modalType: modalType });
    },
    hideModal: function hideModal() {
        this.setState({ modalVisible: false });
    },
    showWait: function showWait(text) {
        if (text) {
            var Modal = UI.Modal;
            this.showModal('modal', React.createElement(
                Modal.ModalNoButttons,
                null,
                React.createElement(
                    Modal.ModalInner,
                    null,
                    React.createElement(
                        Modal.ModalTitle,
                        null,
                        text
                    ),
                    React.createElement(
                        Modal.ModalText,
                        null,
                        React.createElement(Modal.BlackPreloader, null)
                    )
                )
            ));
        } else {
            this.showModal('indicator');
        }
    },
    hideWait: function hideWait() {
        this.hideModal();
    },
    showPanel: function showPanel(panelType, panelChildren) {
        this.setState({ panelVisible: true, panelChildren: panelChildren, panelType: panelType });
    },
    hidePanel: function hidePanel() {
        this.setState({ panelVisible: false });
    },
    getInitialState: function getInitialState() {
        return {
            currentView: 'home'
        };
    },
    render: function render() {
        return React.createElement(
            ReactCSSTransitionGroup,
            { transitionName: this.state.viewTransition.name, transitionEnter: this.state.viewTransition['in'], transitionLeave: this.state.viewTransition.out, component: 'div' },
            React.createElement(
                ModalPanel,
                { visible: this.state.modalVisible, type: this.state.modalType },
                this.state.modalChildren
            ),
            React.createElement(
                UI.View.Panel,
                { visible: this.state.panelVisible, type: this.state.panelType },
                this.state.panelChildren
            ),
            this.getCurrentView()
        );
    }
});
function onDeviceReady() {
    React.render(React.createElement(App, null), document.getElementById('app'));
}
document.addEventListener('deviceready', onDeviceReady, false);

},{"./modules":35,"./modules/home/welcome":34,"UI":51,"classnames":52,"react/addons":undefined}],2:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Card = UI.Card;
var List = UI.List;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Button = UI.Button.Button;

var content = React.createElement(
    Content.ContentBlock,
    null,
    React.createElement(
        'p',
        null,
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean elementum id neque nec commodo. Sed vel justo at turpis laoreet pellentesque quis sed lorem. Integer semper arcu nibh, non mollis arcu tempor vel. Sed pharetra tortor vitae est rhoncus, vel congue dui sollicitudin. Donec eu arcu dignissim felis viverra blandit suscipit eget ipsum.'
    )
);

var List1 = React.createClass({
    displayName: 'List1',

    render: function render() {
        return React.createElement(
            List.List,
            { inset: true },
            React.createElement(
                List.ItemContent,
                null,
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement(Icon, { name: 'icon-f7' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'Ivan Petrov'
                    ),
                    React.createElement(
                        List.ItemAfter,
                        null,
                        'CEO'
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                null,
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement(Icon, { name: 'icon-f7' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'John Doe'
                    ),
                    React.createElement(
                        List.ItemAfter,
                        null,
                        React.createElement(
                            Badge,
                            null,
                            '5'
                        )
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                null,
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement(Icon, { name: 'icon-f7' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'Jenna Smith'
                    )
                )
            )
        );
    }
});

var ListItem = React.createClass({
    displayName: 'ListItem',

    render: function render() {
        return React.createElement(
            UI.Accordion.AccordionItem,
            { list: true, content: this.props.value & 1 ? content : React.createElement(List1, null) },
            React.createElement(
                List.ItemLink,
                null,
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement(Icon, { name: 'icon-f7' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'Item ',
                        this.props.value
                    ),
                    React.createElement(
                        List.ItemAfter,
                        null,
                        React.createElement(
                            Badge,
                            null,
                            this.props.value
                        )
                    )
                )
            )
        );
    }
});

var CustomItem = React.createClass({
    displayName: 'CustomItem',

    render: function render() {
        return React.createElement(
            UI.Accordion.AccordionItem,
            { content: this.props.value & 1 ? content : React.createElement(List1, null) },
            React.createElement(
                'div',
                { className: 'accordion-item-toggle' },
                React.createElement(
                    'i',
                    { className: 'icon icon-ks-plus' },
                    '+'
                ),
                React.createElement(
                    'i',
                    { className: 'icon icon-ks-minus' },
                    '-'
                ),
                React.createElement(
                    'span',
                    null,
                    'Item ',
                    this.props.value
                )
            )
        );
    }
});

module.exports = React.createClass({
    displayName: 'exports',

    getInitialState: function getInitialState() {
        return {
            list: [1, 2, 3]
        };
    },
    render: function render() {
        return React.createElement(
            View.Page,
            { title: 'Accordion' },
            React.createElement(
                View.PageContent,
                null,
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'List View Accordion'
                ),
                React.createElement(
                    List.List,
                    null,
                    this.state.list.map(function (item) {
                        return React.createElement(ListItem, { value: item });
                    })
                ),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Group List View Accordion'
                ),
                React.createElement(
                    List.List,
                    { 'class': 'accordion-group' },
                    this.state.list.map(function (item) {
                        return React.createElement(ListItem, { value: item });
                    })
                ),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Inset Accordion'
                ),
                React.createElement(
                    List.List,
                    { inset: true, 'class': 'accordion-group' },
                    this.state.list.map(function (item) {
                        return React.createElement(ListItem, { value: item });
                    })
                ),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Custom Styled Accordion'
                ),
                React.createElement(
                    Content.ContentBlock,
                    { 'class': 'custom-accordion accordion-group' },
                    this.state.list.map(function (item) {
                        return React.createElement(CustomItem, { value: item });
                    })
                )
            )
        );
    }
});

},{"UI":51,"react":undefined}],3:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        return React.createElement(
            View.Page,
            { title: 'Bars Hide On Scroll', scrollHideBar: true },
            React.createElement(
                View.PageContent,
                { scrollHideBar: true },
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        'p',
                        null,
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse at luctus dui. Praesent venenatis libero orci, in scelerisque enim tincidunt eget. Pellentesque id odio id enim consectetur condimentum. Maecenas dapibus tempus diam. Suspendisse cursus, est ut feugiat tempus, lectus odio aliquam dui, non suscipit lectus sapien vitae velit. Vestibulum tempus faucibus massa, et rutrum odio luctus finibus. Praesent aliquet accumsan magna, quis ornare elit scelerisque sit amet. Mauris commodo varius velit dictum dictum. Sed non sapien urna. Nunc porta vitae massa nec rutrum. Praesent et porttitor tortor, vitae tristique nibh. Morbi sed tempor tellus, sit amet pharetra ante. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis porta feugiat nisl sed blandit.'
                    ),
                    React.createElement(
                        'p',
                        null,
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse at luctus dui. Praesent venenatis libero orci, in scelerisque enim tincidunt eget. Pellentesque id odio id enim consectetur condimentum. Maecenas dapibus tempus diam. Suspendisse cursus, est ut feugiat tempus, lectus odio aliquam dui, non suscipit lectus sapien vitae velit. Vestibulum tempus faucibus massa, et rutrum odio luctus finibus. Praesent aliquet accumsan magna, quis ornare elit scelerisque sit amet. Mauris commodo varius velit dictum dictum. Sed non sapien urna. Nunc porta vitae massa nec rutrum. Praesent et porttitor tortor, vitae tristique nibh. Morbi sed tempor tellus, sit amet pharetra ante. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis porta feugiat nisl sed blandit.'
                    ),
                    React.createElement(
                        'p',
                        null,
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse at luctus dui. Praesent venenatis libero orci, in scelerisque enim tincidunt eget. Pellentesque id odio id enim consectetur condimentum. Maecenas dapibus tempus diam. Suspendisse cursus, est ut feugiat tempus, lectus odio aliquam dui, non suscipit lectus sapien vitae velit. Vestibulum tempus faucibus massa, et rutrum odio luctus finibus. Praesent aliquet accumsan magna, quis ornare elit scelerisque sit amet. Mauris commodo varius velit dictum dictum. Sed non sapien urna. Nunc porta vitae massa nec rutrum. Praesent et porttitor tortor, vitae tristique nibh. Morbi sed tempor tellus, sit amet pharetra ante. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis porta feugiat nisl sed blandit.'
                    ),
                    React.createElement(
                        'p',
                        null,
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse at luctus dui. Praesent venenatis libero orci, in scelerisque enim tincidunt eget. Pellentesque id odio id enim consectetur condimentum. Maecenas dapibus tempus diam. Suspendisse cursus, est ut feugiat tempus, lectus odio aliquam dui, non suscipit lectus sapien vitae velit. Vestibulum tempus faucibus massa, et rutrum odio luctus finibus. Praesent aliquet accumsan magna, quis ornare elit scelerisque sit amet. Mauris commodo varius velit dictum dictum. Sed non sapien urna. Nunc porta vitae massa nec rutrum. Praesent et porttitor tortor, vitae tristique nibh. Morbi sed tempor tellus, sit amet pharetra ante. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis porta feugiat nisl sed blandit.'
                    ),
                    React.createElement(
                        'p',
                        null,
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse at luctus dui. Praesent venenatis libero orci, in scelerisque enim tincidunt eget. Pellentesque id odio id enim consectetur condimentum. Maecenas dapibus tempus diam. Suspendisse cursus, est ut feugiat tempus, lectus odio aliquam dui, non suscipit lectus sapien vitae velit. Vestibulum tempus faucibus massa, et rutrum odio luctus finibus. Praesent aliquet accumsan magna, quis ornare elit scelerisque sit amet. Mauris commodo varius velit dictum dictum. Sed non sapien urna. Nunc porta vitae massa nec rutrum. Praesent et porttitor tortor, vitae tristique nibh. Morbi sed tempor tellus, sit amet pharetra ante. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis porta feugiat nisl sed blandit.'
                    ),
                    React.createElement(
                        'p',
                        null,
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse at luctus dui. Praesent venenatis libero orci, in scelerisque enim tincidunt eget. Pellentesque id odio id enim consectetur condimentum. Maecenas dapibus tempus diam. Suspendisse cursus, est ut feugiat tempus, lectus odio aliquam dui, non suscipit lectus sapien vitae velit. Vestibulum tempus faucibus massa, et rutrum odio luctus finibus. Praesent aliquet accumsan magna, quis ornare elit scelerisque sit amet. Mauris commodo varius velit dictum dictum. Sed non sapien urna. Nunc porta vitae massa nec rutrum. Praesent et porttitor tortor, vitae tristique nibh. Morbi sed tempor tellus, sit amet pharetra ante. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis porta feugiat nisl sed blandit.'
                    ),
                    React.createElement(
                        'p',
                        null,
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse at luctus dui. Praesent venenatis libero orci, in scelerisque enim tincidunt eget. Pellentesque id odio id enim consectetur condimentum. Maecenas dapibus tempus diam. Suspendisse cursus, est ut feugiat tempus, lectus odio aliquam dui, non suscipit lectus sapien vitae velit. Vestibulum tempus faucibus massa, et rutrum odio luctus finibus. Praesent aliquet accumsan magna, quis ornare elit scelerisque sit amet. Mauris commodo varius velit dictum dictum. Sed non sapien urna. Nunc porta vitae massa nec rutrum. Praesent et porttitor tortor, vitae tristique nibh. Morbi sed tempor tellus, sit amet pharetra ante. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis porta feugiat nisl sed blandit.'
                    ),
                    React.createElement(
                        'p',
                        null,
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse at luctus dui. Praesent venenatis libero orci, in scelerisque enim tincidunt eget. Pellentesque id odio id enim consectetur condimentum. Maecenas dapibus tempus diam. Suspendisse cursus, est ut feugiat tempus, lectus odio aliquam dui, non suscipit lectus sapien vitae velit. Vestibulum tempus faucibus massa, et rutrum odio luctus finibus. Praesent aliquet accumsan magna, quis ornare elit scelerisque sit amet. Mauris commodo varius velit dictum dictum. Sed non sapien urna. Nunc porta vitae massa nec rutrum. Praesent et porttitor tortor, vitae tristique nibh. Morbi sed tempor tellus, sit amet pharetra ante. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis porta feugiat nisl sed blandit.'
                    )
                )
            ),
            React.createElement(
                View.Toolbar,
                { tabbar: true, labels: true },
                React.createElement(
                    View.ToolbarButton,
                    { active: true,
                        icon: ["icon-camera", "icon-back"] },
                    'Edit'
                )
            )
        );
    }
});

},{"UI":51,"react":undefined}],4:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Grid = UI.Grid;
var List = UI.List;
var Button = UI.Button.Button;
var ButtonsRow = UI.Button.ButtonsRow;

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        return React.createElement(
            View.Page,
            { title: 'Button', right: React.createElement(
                    View.NavbarButton,
                    { icon: 'icon-bars', right: true },
                    '确定'
                ) },
            React.createElement(
                View.PageContent,
                null,
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Usual Buttons'
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        Grid.Row,
                        null,
                        React.createElement(
                            Grid.Col,
                            { per: 33 },
                            React.createElement(
                                Button,
                                { active: true, onTap: alert },
                                'Active'
                            )
                        ),
                        React.createElement(
                            Grid.Col,
                            { per: 33 },
                            React.createElement(
                                Button,
                                null,
                                'Button'
                            )
                        ),
                        React.createElement(
                            Grid.Col,
                            { per: 33 },
                            React.createElement(
                                Button,
                                { round: true },
                                'Round'
                            )
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        Grid.Row,
                        null,
                        React.createElement(
                            Grid.Col,
                            { per: 50 },
                            React.createElement(
                                Button,
                                { active: true },
                                'Active'
                            )
                        ),
                        React.createElement(
                            Grid.Col,
                            { per: 50 },
                            React.createElement(
                                Button,
                                { round: true },
                                'Round'
                            )
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        ButtonsRow,
                        null,
                        React.createElement(
                            Button,
                            { active: true },
                            'Active'
                        ),
                        React.createElement(
                            Button,
                            { round: true },
                            'Round'
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        ButtonsRow,
                        null,
                        React.createElement(
                            Button,
                            { round: true },
                            'Round'
                        ),
                        React.createElement(
                            Button,
                            { round: true },
                            'Round'
                        ),
                        React.createElement(
                            Button,
                            { round: true },
                            'Round'
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        ButtonsRow,
                        null,
                        React.createElement(
                            Button,
                            { round: true },
                            'Round'
                        ),
                        React.createElement(
                            Button,
                            { active: true },
                            'Active'
                        ),
                        React.createElement(
                            Button,
                            { round: true },
                            'Round'
                        ),
                        React.createElement(
                            Button,
                            { round: true },
                            'Round'
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Big Buttons'
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        Grid.Row,
                        null,
                        React.createElement(
                            Grid.Col,
                            { per: 50 },
                            React.createElement(
                                Button,
                                { big: true, active: true },
                                'Active'
                            )
                        ),
                        React.createElement(
                            Grid.Col,
                            { per: 50 },
                            React.createElement(
                                Button,
                                { big: true, round: true },
                                'Round'
                            )
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Themed Fill Buttons'
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        Grid.Row,
                        null,
                        React.createElement(
                            Grid.Col,
                            { per: 50 },
                            React.createElement(
                                Button,
                                { big: true, fill: true, color: 'green' },
                                'Submit'
                            )
                        ),
                        React.createElement(
                            Grid.Col,
                            { per: 50 },
                            React.createElement(
                                Button,
                                { big: true, fill: true, color: 'red' },
                                'Cancel'
                            )
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'List-Block Buttons'
                ),
                React.createElement(
                    List.List,
                    { block: true, inset: true },
                    React.createElement(
                        'li',
                        null,
                        React.createElement(
                            Button,
                            { list: true },
                            'List Button 1'
                        )
                    ),
                    React.createElement(
                        'li',
                        null,
                        React.createElement(
                            Button,
                            { list: true },
                            'List Button 2'
                        )
                    ),
                    React.createElement(
                        'li',
                        null,
                        React.createElement(
                            Button,
                            { list: true },
                            'List Button 3'
                        )
                    )
                ),
                React.createElement(
                    List.List,
                    { block: true, inset: true },
                    React.createElement(
                        'li',
                        null,
                        React.createElement(
                            Button,
                            { list: true, color: 'red' },
                            'List Button 1'
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        'p',
                        null,
                        'this is inline round ',
                        React.createElement(
                            Button,
                            { inline: true, round: true },
                            'Round'
                        ),
                        ' or inline ',
                        React.createElement(
                            Button,
                            { inline: true },
                            'Button'
                        )
                    ),
                    React.createElement(
                        'p',
                        null,
                        'this is inline fill ',
                        React.createElement(
                            Button,
                            { inline: true, fill: true },
                            'Round'
                        ),
                        ' or color ',
                        React.createElement(
                            Button,
                            { inline: true, fill: true, color: 'red' },
                            'Button'
                        )
                    )
                )
            )
        );
    }
});

},{"UI":51,"react":undefined}],5:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var Picker = UI.Picker;
var Content = UI.Content;
var List = UI.List;
var ActionsModal = UI.Modal.ActionsModal;

var calendarDefaultModal = React.createElement(
	ActionsModal,
	null,
	React.createElement(UI.Calendar.Calendar, null)
);
function showCalendarDefault() {
	app.showModal('pickerModal', calendarDefaultModal);
}

var calendarMultipletModal = React.createElement(
	ActionsModal,
	null,
	React.createElement(UI.Calendar.Calendar, { params: { multiple: true } })
);
function showCalendarMultiple() {
	app.showModal('pickerModal', calendarMultipletModal);
}

var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
var params = {
	value: [new Date()],
	weekHeader: false,
	toolbarTemplate: '<div class="toolbar calendar-custom-toolbar">' + '<div class="toolbar-inner">' + '<div class="left">' + '<a href="#" class="link icon-only"><i class="icon icon-back"></i></a>' + '</div>' + '<div class="center"></div>' + '<div class="right">' + '<a href="#" class="link icon-only"><i class="icon icon-forward"></i></a>' + '</div>' + '</div>' + '</div>',
	onOpen: function onOpen(p) {
		p.container.find('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] + ', ' + p.currentYear);
		p.container.find('.calendar-custom-toolbar .left .link').on('click', function () {
			p.prevMonth();
		});
		p.container.find('.calendar-custom-toolbar .right .link').on('click', function () {
			p.nextMonth();
		});
	},
	onMonthYearChangeStart: function onMonthYearChangeStart(p) {
		p.container.find('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] + ', ' + p.currentYear);
	}
};

module.exports = React.createClass({
	displayName: 'exports',

	render: function render() {
		return React.createElement(
			View.Page,
			{ title: 'Calendar' },
			React.createElement(
				View.PageContent,
				null,
				React.createElement(
					Content.ContentBlock,
					null,
					React.createElement(
						'p',
						null,
						'Calendar is a touch optimized component that provides an easy way to handle dates.'
					),
					React.createElement(
						'p',
						null,
						'Calendar could be used as inline component or as overlay. Overlay Calendar will be automatically converted to Popover on tablets (iPad).'
					)
				),
				React.createElement(
					Content.ContentBlockTitle,
					null,
					'Your birth date'
				),
				React.createElement(
					List.List,
					null,
					React.createElement(
						List.ItemContent,
						null,
						React.createElement(
							List.ItemInner,
							null,
							React.createElement(
								List.ItemInput,
								null,
								React.createElement('input', { type: 'text', placeholder: 'Your birth date', readonly: 'readonly', onClick: showCalendarDefault })
							)
						)
					)
				),
				React.createElement(
					Content.ContentBlockTitle,
					null,
					'Multiple Values'
				),
				React.createElement(
					List.List,
					null,
					React.createElement(
						List.ItemContent,
						null,
						React.createElement(
							List.ItemInner,
							null,
							React.createElement(
								List.ItemInput,
								null,
								React.createElement('input', { type: 'text', placeholder: 'Select multiple dates', readonly: 'readonly', onClick: showCalendarMultiple })
							)
						)
					)
				),
				React.createElement(
					Content.ContentBlockTitle,
					null,
					'Inline with custom toolbar'
				),
				React.createElement(
					Content.ContentBlock,
					null,
					React.createElement(
						Content.ContentBlockInner,
						{ style: { padding: '0', marginRight: '-15px', width: 'auto' } },
						React.createElement(UI.Calendar.Calendar, { params: params, inline: true })
					)
				)
			)
		);
	}
});

},{"UI":51,"react":undefined}],6:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Card = UI.Card;
var List = UI.List;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Button = UI.Button.Button;

function getImage(i) {
    return 'img/app/photo/' + i + '.jpg';
}

var List1 = React.createClass({
    displayName: 'List1',

    render: function render() {
        return React.createElement(
            List.List,
            { block: true },
            React.createElement(
                List.ItemContent,
                null,
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement(Icon, { name: 'icon-f7' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'Ivan Petrov'
                    ),
                    React.createElement(
                        List.ItemAfter,
                        null,
                        'CEO'
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                null,
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement(Icon, { name: 'icon-f7' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'John Doe'
                    ),
                    React.createElement(
                        List.ItemAfter,
                        null,
                        React.createElement(
                            Badge,
                            null,
                            '5'
                        )
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                null,
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement(Icon, { name: 'icon-f7' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'Jenna Smith'
                    )
                )
            )
        );
    }
});

var List2 = React.createClass({
    displayName: 'List2',

    render: function render() {
        return React.createElement(
            List.List,
            { block: true, media: true },
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement('img', { src: getImage(1), width: '80' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitleRow,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Yellow Submarine'
                        ),
                        React.createElement(
                            List.ItemAfter,
                            null,
                            '$15'
                        )
                    ),
                    React.createElement(
                        List.ItemSubTitle,
                        null,
                        'Beatles'
                    ),
                    React.createElement(
                        List.ItemText,
                        null,
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.'
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement('img', { src: getImage(2), width: '80' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitleRow,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Don\'t Stop Me Now'
                        ),
                        React.createElement(
                            List.ItemAfter,
                            null,
                            '$22'
                        )
                    ),
                    React.createElement(
                        List.ItemSubTitle,
                        null,
                        'Queen'
                    ),
                    React.createElement(
                        List.ItemText,
                        null,
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.'
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement('img', { src: getImage(3), width: '80' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitleRow,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Billie Jean'
                        ),
                        React.createElement(
                            List.ItemAfter,
                            null,
                            '$16'
                        )
                    ),
                    React.createElement(
                        List.ItemSubTitle,
                        null,
                        'Michael Jackson'
                    ),
                    React.createElement(
                        List.ItemText,
                        null,
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.'
                    )
                )
            )
        );
    }
});

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        return React.createElement(
            View.Page,
            { title: 'Cards' },
            React.createElement(
                View.PageContent,
                null,
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        'p',
                        null,
                        'Cards, along with List View, is a one more great way to contain and orginize your information. Cards contains unique related data, for example, a photo, text, and link all about a single subject. Cards are typically an entry point to more complex and detailed information.'
                    )
                ),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Simple Cards'
                ),
                React.createElement(
                    Card.Card,
                    { inner: true },
                    'This is simple card with plain text. But card could contain its own header, footer, list view, image, and any elements inside.'
                ),
                React.createElement(
                    Card.Card,
                    { header: 'Card header', footer: 'Card Footer', inner: true },
                    'Card with header and footer. Card header is used to display card title and footer for some additional information or for custom actions.'
                ),
                React.createElement(
                    Card.Card,
                    { inner: true },
                    'Another card. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse feugiat sem est, non tincidunt ligula volutpat sit amet. Mauris aliquet magna justo.'
                ),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Styled Cards'
                ),
                React.createElement(
                    Card.Card,
                    { inner: true,
                        customHeader: React.createElement(
                            Card.CardHeader,
                            { 'class': 'color-white no-border', style: { backgroundImage: "url(" + getImage(3) + ")" } },
                            'Journey To Mountains'
                        ),
                        customFooter: React.createElement(
                            Card.CardFooter,
                            null,
                            React.createElement(
                                'a',
                                { href: '#', 'class': 'link' },
                                'Like'
                            ),
                            React.createElement(
                                'a',
                                { href: '#', 'class': 'link' },
                                'Read more'
                            )
                        )
                    },
                    React.createElement(
                        'p',
                        { 'class': 'color-gray' },
                        'Posted on January 21, 2015'
                    ),
                    React.createElement(
                        'p',
                        null,
                        'Quisque eget vestibulum nulla. Quisque quis dui quis ex ultricies efficitur vitae non felis. Phasellus quis nibh hendrerit...'
                    )
                ),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Facebook Cards'
                ),
                React.createElement(
                    Card.Card,
                    { inner: true,
                        'class': 'ks-facebook-card',
                        customHeader: React.createElement(
                            Card.CardHeader,
                            { 'class': 'no-border' },
                            React.createElement(
                                'div',
                                { 'class': 'ks-facebook-avatar' },
                                React.createElement('img', { src: getImage(1), width: '34', height: '34' })
                            ),
                            React.createElement(
                                'div',
                                { 'class': 'ks-facebook-name' },
                                'John Doe'
                            ),
                            React.createElement(
                                'div',
                                { 'class': 'ks-facebook-date' },
                                'Monday at 3:47 PM'
                            )
                        ),
                        customFooter: React.createElement(
                            Card.CardFooter,
                            { 'class': 'no-border' },
                            React.createElement(
                                'a',
                                { href: '#', 'class': 'link' },
                                'Like'
                            ),
                            React.createElement(
                                'a',
                                { href: '#', 'class': 'link' },
                                'Comment'
                            ),
                            React.createElement(
                                'a',
                                { href: '#', 'class': 'link' },
                                'Share'
                            )
                        )
                    },
                    React.createElement('img', { src: getImage(8), width: '100%' })
                ),
                React.createElement(
                    Card.Card,
                    { inner: true,
                        'class': 'ks-facebook-card',
                        customHeader: React.createElement(
                            Card.CardHeader,
                            null,
                            React.createElement(
                                'div',
                                { 'class': 'ks-facebook-avatar' },
                                React.createElement('img', { src: getImage(1), width: '34', height: '34' })
                            ),
                            React.createElement(
                                'div',
                                { 'class': 'ks-facebook-name' },
                                'John Doe'
                            ),
                            React.createElement(
                                'div',
                                { 'class': 'ks-facebook-date' },
                                'Monday at 2:15 PM'
                            )
                        ),
                        customFooter: React.createElement(
                            Card.CardFooter,
                            { 'class': 'no-border' },
                            React.createElement(
                                'a',
                                { href: '#', 'class': 'link' },
                                'Like'
                            ),
                            React.createElement(
                                'a',
                                { href: '#', 'class': 'link' },
                                'Comment'
                            ),
                            React.createElement(
                                'a',
                                { href: '#', 'class': 'link' },
                                'Share'
                            )
                        )
                    },
                    React.createElement(
                        'p',
                        null,
                        'What a nice photo i took yesterday!'
                    ),
                    React.createElement('img', { src: getImage(8), width: '100%' }),
                    React.createElement(
                        'p',
                        { 'class': 'color-gray' },
                        'Likes: 112    Comments: 43'
                    )
                ),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Cards With List View'
                ),
                React.createElement(
                    Card.Card,
                    null,
                    React.createElement(List1, null)
                ),
                React.createElement(
                    Card.Card,
                    { header: 'New Releases:', customFooter: React.createElement(
                            Card.CardFooter,
                            null,
                            React.createElement(
                                'span',
                                null,
                                'January 20, 2015'
                            ),
                            React.createElement(
                                'span',
                                null,
                                '5 comments'
                            )
                        ) },
                    React.createElement(List2, null)
                )
            )
        );
    }
});

},{"UI":51,"react":undefined}],7:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Switch = UI.Form.Switch;
var Slider = UI.Form.Slider;

var FormItem = React.createClass({
    displayName: 'FormItem',

    render: function render() {
        return React.createElement(
            List.ItemContent,
            null,
            this.props.icon && React.createElement(
                List.ItemMedia,
                null,
                React.createElement(Icon, { name: this.props.icon })
            ),
            React.createElement(
                List.ItemInner,
                null,
                this.props.label && React.createElement(
                    List.ItemTitle,
                    { label: true },
                    this.props.label
                ),
                React.createElement(
                    List.ItemInput,
                    null,
                    this.props.children
                )
            )
        );
    }
});

var FormInputItem = React.createClass({
    displayName: 'FormInputItem',

    render: function render() {
        return React.createElement(
            FormItem,
            { icon: this.props.icon, label: this.props.label },
            React.createElement('input', { type: this.props.input_type, placeholder: this.props.placeholder })
        );
    }
});

var FormList = React.createClass({
    displayName: 'FormList',

    render: function render() {
        return React.createElement(
            List.List,
            { block: true },
            React.createElement(FormInputItem, { icon: 'icon-form-name', label: 'Name', input_type: 'text', placeholder: 'Please Input Your Name' }),
            React.createElement(FormInputItem, { icon: 'icon-form-email', label: 'Email', input_type: 'email', placeholder: 'Please Input Your Email' }),
            React.createElement(FormInputItem, { icon: 'icon-form-url', label: 'URL', input_type: 'url', placeholder: 'Please Input Your URL' }),
            React.createElement(FormInputItem, { icon: 'icon-form-password', label: 'PassWord', input_type: 'password', placeholder: 'Please Input Your PassWord' }),
            React.createElement(FormInputItem, { icon: 'icon-form-tel', label: 'Telephone', input_type: 'tel', placeholder: 'Please Input Your Telephone' }),
            React.createElement(
                FormItem,
                { icon: 'icon-form-gender', label: 'Gender' },
                React.createElement(
                    'select',
                    null,
                    React.createElement(
                        'option',
                        null,
                        'Male'
                    ),
                    React.createElement(
                        'option',
                        null,
                        'Female'
                    )
                )
            ),
            React.createElement(
                FormItem,
                { icon: 'icon-form-calendar', label: 'BirthDay' },
                React.createElement('input', { type: 'date', defaultValue: '2015-04-30' })
            ),
            React.createElement(
                FormItem,
                { icon: 'icon-form-calendar', label: 'Time' },
                React.createElement('input', { type: 'datetime-local', defaultValue: '2015-04-30 11:11' })
            ),
            React.createElement(
                FormItem,
                { icon: 'icon-form-toggle', label: 'Switch' },
                React.createElement(Switch, null)
            ),
            React.createElement(
                FormItem,
                { icon: 'icon-form-settings', label: 'Slider' },
                React.createElement(Slider, null)
            ),
            React.createElement(
                FormItem,
                { icon: 'icon-form-comment', label: 'TextArea' },
                React.createElement('textarea', { placeholder: 'Please input comment' })
            )
        );
    }
});

var FormList1 = React.createClass({
    displayName: 'FormList1',

    render: function render() {
        return React.createElement(
            List.List,
            { block: true },
            React.createElement(FormInputItem, { icon: 'icon-form-name', input_type: 'text', placeholder: 'Please Input Your Name' }),
            React.createElement(FormInputItem, { icon: 'icon-form-email', input_type: 'email', placeholder: 'Please Input Your Email' }),
            React.createElement(
                FormItem,
                { icon: 'icon-form-gender' },
                React.createElement(
                    'select',
                    null,
                    React.createElement(
                        'option',
                        null,
                        'Male'
                    ),
                    React.createElement(
                        'option',
                        null,
                        'Female'
                    )
                )
            ),
            React.createElement(
                FormItem,
                { icon: 'icon-form-calendar' },
                React.createElement('input', { type: 'date', defaultValue: '2015-04-30' })
            ),
            React.createElement(
                FormItem,
                { icon: 'icon-form-toggle' },
                React.createElement(Switch, null)
            )
        );
    }
});

var FormList2 = React.createClass({
    displayName: 'FormList2',

    render: function render() {
        return React.createElement(
            List.List,
            { block: true },
            React.createElement(FormInputItem, { input_type: 'text', placeholder: 'Please Input Your Name' }),
            React.createElement(FormInputItem, { input_type: 'email', placeholder: 'Please Input Your Email' }),
            React.createElement(
                FormItem,
                null,
                React.createElement(
                    'select',
                    null,
                    React.createElement(
                        'option',
                        null,
                        'Male'
                    ),
                    React.createElement(
                        'option',
                        null,
                        'Female'
                    )
                )
            ),
            React.createElement(
                FormItem,
                null,
                React.createElement('input', { type: 'date', defaultValue: '2015-04-30' })
            ),
            React.createElement(
                FormItem,
                null,
                React.createElement(Switch, null)
            )
        );
    }
});

var FormList3 = React.createClass({
    displayName: 'FormList3',

    render: function render() {
        return React.createElement(
            List.List,
            { block: true, inset: true },
            React.createElement(FormInputItem, { input_type: 'text', placeholder: 'Please Input Your Name' }),
            React.createElement(FormInputItem, { input_type: 'email', placeholder: 'Please Input Your Email' }),
            React.createElement(
                FormItem,
                null,
                React.createElement(
                    'select',
                    null,
                    React.createElement(
                        'option',
                        null,
                        'Male'
                    ),
                    React.createElement(
                        'option',
                        null,
                        'Female'
                    )
                )
            ),
            React.createElement(
                FormItem,
                null,
                React.createElement('input', { type: 'date', defaultValue: '2015-04-30' })
            ),
            React.createElement(
                FormItem,
                null,
                React.createElement(Switch, null)
            )
        );
    }
});

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {

        return React.createElement(
            View.Page,
            { title: 'Form' },
            React.createElement(
                View.PageContent,
                null,
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Full Layout'
                ),
                React.createElement(FormList, null),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Icons And Inputs'
                ),
                React.createElement(FormList1, null),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Just Inputs'
                ),
                React.createElement(FormList2, null),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Inset, Just Inputs'
                ),
                React.createElement(FormList3, null)
            )
        );
    }
});

},{"UI":51,"react":undefined}],8:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Grid = UI.Grid;
var List = UI.List;
var Button = UI.Button.Button;
var ButtonsRow = UI.Button.ButtonsRow;

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        return React.createElement(
            View.Page,
            { title: 'Grid' },
            React.createElement(
                View.PageContent,
                null,
                React.createElement(
                    'div',
                    { className: 'ks-grid' },
                    React.createElement(
                        Content.ContentBlock,
                        null,
                        React.createElement(
                            'p',
                            null,
                            'flexible layout grid'
                        )
                    ),
                    React.createElement(
                        Content.ContentBlockTitle,
                        null,
                        'Columns with gutter'
                    ),
                    React.createElement(
                        Content.ContentBlock,
                        null,
                        React.createElement(
                            Grid.Row,
                            null,
                            React.createElement(
                                Grid.Col,
                                { per: 50 },
                                '50'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 50 },
                                '50'
                            )
                        ),
                        React.createElement(
                            Grid.Row,
                            null,
                            React.createElement(
                                Grid.Col,
                                { per: 33 },
                                '33'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 33 },
                                '33'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 33 },
                                '33'
                            )
                        ),
                        React.createElement(
                            Grid.Row,
                            null,
                            React.createElement(
                                Grid.Col,
                                { per: 25 },
                                '25'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 25 },
                                '25'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 25 },
                                '25'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 25 },
                                '25'
                            )
                        ),
                        React.createElement(
                            Grid.Row,
                            null,
                            React.createElement(
                                Grid.Col,
                                { per: 20 },
                                '20'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 20 },
                                '20'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 20 },
                                '20'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 20 },
                                '20'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 20 },
                                '20'
                            )
                        ),
                        React.createElement(
                            Grid.Row,
                            null,
                            React.createElement(
                                Grid.Col,
                                { per: 33 },
                                '33'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 66 },
                                '66'
                            )
                        ),
                        React.createElement(
                            Grid.Row,
                            null,
                            React.createElement(
                                Grid.Col,
                                { per: 25 },
                                '25'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 25 },
                                '25'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 50 },
                                '50'
                            )
                        ),
                        React.createElement(
                            Grid.Row,
                            null,
                            React.createElement(
                                Grid.Col,
                                { per: 75 },
                                '75'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 25 },
                                '25'
                            )
                        ),
                        React.createElement(
                            Grid.Row,
                            null,
                            React.createElement(
                                Grid.Col,
                                { per: 20 },
                                '20'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 80 },
                                '80'
                            )
                        )
                    ),
                    React.createElement(
                        Content.ContentBlockTitle,
                        null,
                        'Columns with no gutter'
                    ),
                    React.createElement(
                        Content.ContentBlock,
                        null,
                        React.createElement(
                            Grid.Row,
                            { noGutter: true },
                            React.createElement(
                                Grid.Col,
                                { per: 50 },
                                '50'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 50 },
                                '50'
                            )
                        ),
                        React.createElement(
                            Grid.Row,
                            { noGutter: true },
                            React.createElement(
                                Grid.Col,
                                { per: 33 },
                                '33'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 33 },
                                '33'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 33 },
                                '33'
                            )
                        ),
                        React.createElement(
                            Grid.Row,
                            { noGutter: true },
                            React.createElement(
                                Grid.Col,
                                { per: 25 },
                                '25'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 25 },
                                '25'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 25 },
                                '25'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 25 },
                                '25'
                            )
                        ),
                        React.createElement(
                            Grid.Row,
                            { noGutter: true },
                            React.createElement(
                                Grid.Col,
                                { per: 20 },
                                '20'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 20 },
                                '20'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 20 },
                                '20'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 20 },
                                '20'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 20 },
                                '20'
                            )
                        ),
                        React.createElement(
                            Grid.Row,
                            { noGutter: true },
                            React.createElement(
                                Grid.Col,
                                { per: 33 },
                                '33'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 66 },
                                '66'
                            )
                        ),
                        React.createElement(
                            Grid.Row,
                            { noGutter: true },
                            React.createElement(
                                Grid.Col,
                                { per: 25 },
                                '25'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 25 },
                                '25'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 50 },
                                '50'
                            )
                        ),
                        React.createElement(
                            Grid.Row,
                            { noGutter: true },
                            React.createElement(
                                Grid.Col,
                                { per: 75 },
                                '75'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 25 },
                                '25'
                            )
                        ),
                        React.createElement(
                            Grid.Row,
                            { noGutter: true },
                            React.createElement(
                                Grid.Col,
                                { per: 20 },
                                '20'
                            ),
                            React.createElement(
                                Grid.Col,
                                { per: 80 },
                                '80'
                            )
                        )
                    )
                )
            )
        );
    }
});

},{"UI":51,"react":undefined}],9:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');
var UI = require('UI');

var View = UI.View;

var icons = ["ion-alert-circled", "ion-alert", "ion-android-add-contact", "ion-android-add", "ion-android-alarm", "ion-android-archive", "ion-android-arrow-back", "ion-android-arrow-down-left", "ion-android-arrow-down-right", "ion-android-arrow-forward", "ion-android-arrow-up-left", "ion-android-arrow-up-right", "ion-android-battery", "ion-android-book", "ion-android-calendar", "ion-android-call", "ion-android-camera", "ion-android-chat", "ion-android-checkmark", "ion-android-clock", "ion-android-close", "ion-android-contact", "ion-android-contacts", "ion-android-data", "ion-android-developer", "ion-android-display", "ion-android-download", "ion-android-drawer", "ion-android-dropdown", "ion-android-earth", "ion-android-folder", "ion-android-forums", "ion-android-friends", "ion-android-hand", "ion-android-image", "ion-android-inbox", "ion-android-information", "ion-android-keypad", "ion-android-lightbulb", "ion-android-locate", "ion-android-location", "ion-android-mail", "ion-android-microphone", "ion-android-mixer", "ion-android-more", "ion-android-note", "ion-android-playstore", "ion-android-printer", "ion-android-promotion", "ion-android-reminder", "ion-android-remove", "ion-android-search", "ion-android-send", "ion-android-settings", "ion-android-share", "ion-android-social-user", "ion-android-social", "ion-android-sort", "ion-android-stair-drawer", "ion-android-star", "ion-android-stopwatch", "ion-android-storage", "ion-android-system-back", "ion-android-system-home", "ion-android-system-windows", "ion-android-timer", "ion-android-trash", "ion-android-user-menu", "ion-android-volume", "ion-android-wifi", "ion-aperture", "ion-archive", "ion-arrow-down-a", "ion-arrow-down-b", "ion-arrow-down-c", "ion-arrow-expand", "ion-arrow-graph-down-left", "ion-arrow-graph-down-right", "ion-arrow-graph-up-left", "ion-arrow-graph-up-right", "ion-arrow-left-a", "ion-arrow-left-b", "ion-arrow-left-c", "ion-arrow-move", "ion-arrow-resize", "ion-arrow-return-left", "ion-arrow-return-right", "ion-arrow-right-a", "ion-arrow-right-b", "ion-arrow-right-c", "ion-arrow-shrink", "ion-arrow-swap", "ion-arrow-up-a", "ion-arrow-up-b", "ion-arrow-up-c", "ion-asterisk", "ion-at", "ion-bag", "ion-battery-charging", "ion-battery-empty", "ion-battery-full", "ion-battery-half", "ion-battery-low", "ion-beaker", "ion-beer", "ion-bluetooth", "ion-bonfire", "ion-bookmark", "ion-briefcase", "ion-bug", "ion-calculator", "ion-calendar", "ion-camera", "ion-card", "ion-cash", "ion-chatbox-working", "ion-chatbox", "ion-chatboxes", "ion-chatbubble-working", "ion-chatbubble", "ion-chatbubbles", "ion-checkmark-circled", "ion-checkmark-round", "ion-checkmark", "ion-chevron-down", "ion-chevron-left", "ion-chevron-right", "ion-chevron-up", "ion-clipboard", "ion-clock", "ion-close-circled", "ion-close-round", "ion-close", "ion-closed-captioning", "ion-cloud", "ion-code-download", "ion-code-working", "ion-code", "ion-coffee", "ion-compass", "ion-compose", "ion-connection-bars", "ion-contrast", "ion-cube", "ion-disc", "ion-document-text", "ion-document", "ion-drag", "ion-earth", "ion-edit", "ion-egg", "ion-eject", "ion-email", "ion-eye-disabled", "ion-eye", "ion-female", "ion-filing", "ion-film-marker", "ion-fireball", "ion-flag", "ion-flame", "ion-flash-off", "ion-flash", "ion-flask", "ion-folder", "ion-fork-repo", "ion-fork", "ion-forward", "ion-funnel", "ion-game-controller-a", "ion-game-controller-b", "ion-gear-a", "ion-gear-b", "ion-grid", "ion-hammer", "ion-happy", "ion-headphone", "ion-heart-broken", "ion-heart", "ion-help-buoy", "ion-help-circled", "ion-help", "ion-home", "ion-icecream", "ion-icon-social-google-plus-outline", "ion-icon-social-google-plus", "ion-image", "ion-images", "ion-information-circled", "ion-information", "ion-ionic", "ion-ios7-alarm-outline", "ion-ios7-alarm", "ion-ios7-albums-outline", "ion-ios7-albums", "ion-ios7-americanfootball-outline", "ion-ios7-americanfootball", "ion-ios7-analytics-outline", "ion-ios7-analytics", "ion-ios7-arrow-back", "ion-ios7-arrow-down", "ion-ios7-arrow-forward", "ion-ios7-arrow-left", "ion-ios7-arrow-right", "ion-ios7-arrow-thin-down", "ion-ios7-arrow-thin-left", "ion-ios7-arrow-thin-right", "ion-ios7-arrow-thin-up", "ion-ios7-arrow-up", "ion-ios7-at-outline", "ion-ios7-at", "ion-ios7-barcode-outline", "ion-ios7-barcode", "ion-ios7-baseball-outline", "ion-ios7-baseball", "ion-ios7-basketball-outline", "ion-ios7-basketball", "ion-ios7-bell-outline", "ion-ios7-bell", "ion-ios7-bolt-outline", "ion-ios7-bolt", "ion-ios7-bookmarks-outline", "ion-ios7-bookmarks", "ion-ios7-box-outline", "ion-ios7-box", "ion-ios7-briefcase-outline", "ion-ios7-briefcase", "ion-ios7-browsers-outline", "ion-ios7-browsers", "ion-ios7-calculator-outline", "ion-ios7-calculator", "ion-ios7-calendar-outline", "ion-ios7-calendar", "ion-ios7-camera-outline", "ion-ios7-camera", "ion-ios7-cart-outline", "ion-ios7-cart", "ion-ios7-chatboxes-outline", "ion-ios7-chatboxes", "ion-ios7-chatbubble-outline", "ion-ios7-chatbubble", "ion-ios7-checkmark-empty", "ion-ios7-checkmark-outline", "ion-ios7-checkmark", "ion-ios7-circle-filled", "ion-ios7-circle-outline", "ion-ios7-clock-outline", "ion-ios7-clock", "ion-ios7-close-empty", "ion-ios7-close-outline", "ion-ios7-close", "ion-ios7-cloud-download-outline", "ion-ios7-cloud-download", "ion-ios7-cloud-outline", "ion-ios7-cloud-upload-outline", "ion-ios7-cloud-upload", "ion-ios7-cloud", "ion-ios7-cloudy-night-outline", "ion-ios7-cloudy-night", "ion-ios7-cloudy-outline", "ion-ios7-cloudy", "ion-ios7-cog-outline", "ion-ios7-cog", "ion-ios7-compose-outline", "ion-ios7-compose", "ion-ios7-contact-outline", "ion-ios7-contact", "ion-ios7-copy-outline", "ion-ios7-copy", "ion-ios7-download-outline", "ion-ios7-download", "ion-ios7-drag", "ion-ios7-email-outline", "ion-ios7-email", "ion-ios7-expand", "ion-ios7-eye-outline", "ion-ios7-eye", "ion-ios7-fastforward-outline", "ion-ios7-fastforward", "ion-ios7-filing-outline", "ion-ios7-filing", "ion-ios7-film-outline", "ion-ios7-film", "ion-ios7-flag-outline", "ion-ios7-flag", "ion-ios7-folder-outline", "ion-ios7-folder", "ion-ios7-football-outline", "ion-ios7-football", "ion-ios7-gear-outline", "ion-ios7-gear", "ion-ios7-glasses-outline", "ion-ios7-glasses", "ion-ios7-heart-outline", "ion-ios7-heart", "ion-ios7-help-empty", "ion-ios7-help-outline", "ion-ios7-help", "ion-ios7-home-outline", "ion-ios7-home", "ion-ios7-infinite-outline", "ion-ios7-infinite", "ion-ios7-information-empty", "ion-ios7-information-outline", "ion-ios7-information", "ion-ios7-ionic-outline", "ion-ios7-keypad-outline", "ion-ios7-keypad", "ion-ios7-lightbulb-outline", "ion-ios7-lightbulb", "ion-ios7-location-outline", "ion-ios7-location", "ion-ios7-locked-outline", "ion-ios7-locked", "ion-ios7-loop-strong", "ion-ios7-loop", "ion-ios7-medkit-outline", "ion-ios7-medkit", "ion-ios7-mic-off", "ion-ios7-mic-outline", "ion-ios7-mic", "ion-ios7-minus-empty", "ion-ios7-minus-outline", "ion-ios7-minus", "ion-ios7-monitor-outline", "ion-ios7-monitor", "ion-ios7-moon-outline", "ion-ios7-moon", "ion-ios7-more-outline", "ion-ios7-more", "ion-ios7-musical-note", "ion-ios7-musical-notes", "ion-ios7-navigate-outline", "ion-ios7-navigate", "ion-ios7-paper-outline", "ion-ios7-paper", "ion-ios7-paperplane-outline", "ion-ios7-paperplane", "ion-ios7-partlysunny-outline", "ion-ios7-partlysunny", "ion-ios7-pause-outline", "ion-ios7-pause", "ion-ios7-paw-outline", "ion-ios7-paw", "ion-ios7-people-outline", "ion-ios7-people", "ion-ios7-person-outline", "ion-ios7-person", "ion-ios7-personadd-outline", "ion-ios7-personadd", "ion-ios7-photos-outline", "ion-ios7-photos", "ion-ios7-pie-outline", "ion-ios7-pie", "ion-ios7-play-outline", "ion-ios7-play", "ion-ios7-plus-empty", "ion-ios7-plus-outline", "ion-ios7-plus", "ion-ios7-pricetag-outline", "ion-ios7-pricetag", "ion-ios7-pricetags-outline", "ion-ios7-pricetags", "ion-ios7-printer-outline", "ion-ios7-printer", "ion-ios7-pulse-strong", "ion-ios7-pulse", "ion-ios7-rainy-outline", "ion-ios7-rainy", "ion-ios7-recording-outline", "ion-ios7-recording", "ion-ios7-redo-outline", "ion-ios7-redo", "ion-ios7-refresh-empty", "ion-ios7-refresh-outline", "ion-ios7-refresh", "ion-ios7-reload", "ion-ios7-reverse-camera-outline", "ion-ios7-reverse-camera", "ion-ios7-rewind-outline", "ion-ios7-rewind", "ion-ios7-search-strong", "ion-ios7-search", "ion-ios7-settings-strong", "ion-ios7-settings", "ion-ios7-shrink", "ion-ios7-skipbackward-outline", "ion-ios7-skipbackward", "ion-ios7-skipforward-outline", "ion-ios7-skipforward", "ion-ios7-snowy", "ion-ios7-speedometer-outline", "ion-ios7-speedometer", "ion-ios7-star-half", "ion-ios7-star-outline", "ion-ios7-star", "ion-ios7-stopwatch-outline", "ion-ios7-stopwatch", "ion-ios7-sunny-outline", "ion-ios7-sunny", "ion-ios7-telephone-outline", "ion-ios7-telephone", "ion-ios7-tennisball-outline", "ion-ios7-tennisball", "ion-ios7-thunderstorm-outline", "ion-ios7-thunderstorm", "ion-ios7-time-outline", "ion-ios7-time", "ion-ios7-timer-outline", "ion-ios7-timer", "ion-ios7-toggle-outline", "ion-ios7-toggle", "ion-ios7-trash-outline", "ion-ios7-trash", "ion-ios7-undo-outline", "ion-ios7-undo", "ion-ios7-unlocked-outline", "ion-ios7-unlocked", "ion-ios7-upload-outline", "ion-ios7-upload", "ion-ios7-videocam-outline", "ion-ios7-videocam", "ion-ios7-volume-high", "ion-ios7-volume-low", "ion-ios7-wineglass-outline", "ion-ios7-wineglass", "ion-ios7-world-outline", "ion-ios7-world", "ion-ipad", "ion-iphone", "ion-ipod", "ion-jet", "ion-key", "ion-knife", "ion-laptop", "ion-leaf", "ion-levels", "ion-lightbulb", "ion-link", "ion-load-a", "ion-load-b", "ion-load-c", "ion-load-d", "ion-location", "ion-locked", "ion-log-in", "ion-log-out", "ion-loop", "ion-magnet", "ion-male", "ion-man", "ion-map", "ion-medkit", "ion-merge", "ion-mic-a", "ion-mic-b", "ion-mic-c", "ion-minus-circled", "ion-minus-round", "ion-minus", "ion-model-s", "ion-monitor", "ion-more", "ion-mouse", "ion-music-note", "ion-navicon-round", "ion-navicon", "ion-navigate", "ion-network", "ion-no-smoking", "ion-nuclear", "ion-outlet", "ion-paper-airplane", "ion-paperclip", "ion-pause", "ion-person-add", "ion-person-stalker", "ion-person", "ion-pie-graph", "ion-pin", "ion-pinpoint", "ion-pizza", "ion-plane", "ion-planet", "ion-play", "ion-playstation", "ion-plus-circled", "ion-plus-round", "ion-plus", "ion-podium", "ion-pound", "ion-power", "ion-pricetag", "ion-pricetags", "ion-printer", "ion-pull-request", "ion-qr-scanner", "ion-quote", "ion-radio-waves", "ion-record", "ion-refresh", "ion-reply-all", "ion-reply", "ion-ribbon-a", "ion-ribbon-b", "ion-sad", "ion-scissors", "ion-search", "ion-settings", "ion-share", "ion-shuffle", "ion-skip-backward", "ion-skip-forward", "ion-social-android-outline", "ion-social-android", "ion-social-apple-outline", "ion-social-apple", "ion-social-bitcoin-outline", "ion-social-bitcoin", "ion-social-buffer-outline", "ion-social-buffer", "ion-social-designernews-outline", "ion-social-designernews", "ion-social-dribbble-outline", "ion-social-dribbble", "ion-social-dropbox-outline", "ion-social-dropbox", "ion-social-facebook-outline", "ion-social-facebook", "ion-social-foursquare-outline", "ion-social-foursquare", "ion-social-freebsd-devil", "ion-social-github-outline", "ion-social-github", "ion-social-google-outline", "ion-social-google", "ion-social-googleplus-outline", "ion-social-googleplus", "ion-social-hackernews-outline", "ion-social-hackernews", "ion-social-instagram-outline", "ion-social-instagram", "ion-social-linkedin-outline", "ion-social-linkedin", "ion-social-pinterest-outline", "ion-social-pinterest", "ion-social-reddit-outline", "ion-social-reddit", "ion-social-rss-outline", "ion-social-rss", "ion-social-skype-outline", "ion-social-skype", "ion-social-tumblr-outline", "ion-social-tumblr", "ion-social-tux", "ion-social-twitter-outline", "ion-social-twitter", "ion-social-usd-outline", "ion-social-usd", "ion-social-vimeo-outline", "ion-social-vimeo", "ion-social-windows-outline", "ion-social-windows", "ion-social-wordpress-outline", "ion-social-wordpress", "ion-social-yahoo-outline", "ion-social-yahoo", "ion-social-youtube-outline", "ion-social-youtube", "ion-speakerphone", "ion-speedometer", "ion-spoon", "ion-star", "ion-stats-bars", "ion-steam", "ion-stop", "ion-thermometer", "ion-thumbsdown", "ion-thumbsup", "ion-toggle-filled", "ion-toggle", "ion-trash-a", "ion-trash-b", "ion-trophy", "ion-umbrella", "ion-university", "ion-unlocked", "ion-upload", "ion-usb", "ion-videocamera", "ion-volume-high", "ion-volume-low", "ion-volume-medium", "ion-volume-mute", "ion-wand", "ion-waterdrop", "ion-wifi", "ion-wineglass", "ion-woman", "ion-wrench", "ion-xbox"];

var IconText = React.createClass({
    displayName: 'IconText',

    showClassName: function showClassName(name) {
        console.log(name);
    },
    render: function render() {
        var name = this.props.name;
        var className = cn("icon", name);
        return React.createElement('i', { className: className, style: { margin: "10px" }, onClick: this.showClassName.bind(this, name) });
    }
});

module.exports = React.createClass({
    displayName: 'exports',

    componentDidMount: function componentDidMount() {
        var container = $(this.refs.searchbar.getDOMNode());
        var params = {
            customSearch: true
        };
        this.searchbar = UI.Search.Search.Searchbar(container, params);
        var self = this;
        container.on("search", function (e) {
            self.updateSearch(e.detail.query);
        });
    },
    componentWillUnmount: function componentWillUnmount() {
        this.searchbar.destroy();
    },
    getInitialState: function getInitialState() {
        return { searchString: '' };
    },
    updateSearch: function updateSearch(str) {
        this.setState({ searchString: str });
    },
    getIconItems: function getIconItems() {
        var ss = new RegExp(this.state.searchString);
        var temp = icons.filter(function (name) {
            return ss.test(name);
        });
        return temp.map(function (name) {
            return React.createElement(IconText, { name: name });
        });
    },
    render: function render() {
        return React.createElement(
            View.Page,
            { title: 'Icons' },
            React.createElement(UI.Search.Search, { ref: 'searchbar' }),
            React.createElement(
                View.PageContent,
                null,
                this.getIconItems()
            )
        );
    }
});

},{"UI":51,"classnames":52,"react":undefined}],10:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Card = UI.Card;
var List = UI.List;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Button = UI.Button.Button;

var ListItem = React.createClass({
    displayName: 'ListItem',

    render: function render() {
        return React.createElement(
            List.ItemContent,
            null,
            React.createElement(
                List.ItemMedia,
                null,
                React.createElement(Icon, { name: 'icon-f7' })
            ),
            React.createElement(
                List.ItemInner,
                null,
                React.createElement(
                    List.ItemTitle,
                    null,
                    'Item ',
                    this.props.value
                ),
                React.createElement(
                    List.ItemAfter,
                    null,
                    React.createElement(
                        Badge,
                        null,
                        this.props.value
                    )
                )
            )
        );
    }
});

module.exports = React.createClass({
    displayName: 'exports',

    getInitialState: function getInitialState() {
        return {
            list: (function (n) {
                var arr = [];for (var i = 1; i <= n; i++) {
                    arr.push(i);
                }return arr;
            })(20)
        };
    },
    onInfinite: function onInfinite(e) {
        var self = this;
        setTimeout(function () {
            var len = self.state.list.length;
            self.state.list.push(len + 1);
            self.setState({ list: self.state.list });
        }, 1000);
    },
    render: function render() {
        return React.createElement(
            View.Page,
            { title: 'Infinite Scroll' },
            React.createElement(
                View.PageContent,
                { 'class': 'infinite-scroll' },
                React.createElement(UI.Refresh.InfiniteScroll, { onInfinite: this.onInfinite }),
                React.createElement(
                    List.List,
                    { block: true },
                    this.state.list.map(function (item) {
                        return React.createElement(ListItem, { value: item });
                    })
                )
            )
        );
    }
});

},{"UI":51,"react":undefined}],11:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;

var List1 = React.createClass({
    displayName: 'List1',

    render: function render() {
        return React.createElement(
            List.List,
            { block: true },
            React.createElement(
                List.ItemContent,
                null,
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement(Icon, { name: 'icon-f7' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'Ivan Petrov'
                    ),
                    React.createElement(
                        List.ItemAfter,
                        null,
                        'CEO'
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                null,
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement(Icon, { name: 'icon-f7' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'John Doe'
                    ),
                    React.createElement(
                        List.ItemAfter,
                        null,
                        React.createElement(
                            Badge,
                            null,
                            '5'
                        )
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                null,
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement(Icon, { name: 'icon-f7' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'Jenna Smith'
                    )
                )
            )
        );
    }
});

var List2 = React.createClass({
    displayName: 'List2',

    render: function render() {
        return React.createElement(
            List.List,
            { block: true },
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement(Icon, { name: 'icon-f7' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'Ivan Petrov'
                    ),
                    React.createElement(
                        List.ItemAfter,
                        null,
                        'CEO'
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement(Icon, { name: 'icon-f7' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'John Doe'
                    ),
                    React.createElement(
                        List.ItemAfter,
                        null,
                        React.createElement(
                            Badge,
                            null,
                            '5'
                        )
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement(Icon, { name: 'icon-f7' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'Jenna Smith'
                    )
                )
            )
        );
    }
});

var List3 = React.createClass({
    displayName: 'List3',

    render: function render() {
        return React.createElement(
            List.List,
            { block: true },
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'Ivan Petrov'
                    ),
                    React.createElement(
                        List.ItemAfter,
                        null,
                        'CEO'
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'John Doe'
                    ),
                    React.createElement(
                        List.ItemAfter,
                        null,
                        React.createElement(
                            Badge,
                            null,
                            '5'
                        )
                    )
                )
            ),
            React.createElement(
                List.ItemDivider,
                null,
                'Divider Here'
            ),
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'Jenna Smith'
                    )
                )
            )
        );
    }
});

var List4 = React.createClass({
    displayName: 'List4',

    render: function render() {
        return React.createElement(
            List.List,
            { block: true, group: true },
            React.createElement(
                List.ListGroup,
                null,
                React.createElement(
                    List.ListGroupTitle,
                    null,
                    'A'
                ),
                React.createElement(
                    List.ItemContent,
                    null,
                    React.createElement(
                        List.ItemInner,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Aaron'
                        )
                    )
                ),
                React.createElement(
                    List.ItemContent,
                    null,
                    React.createElement(
                        List.ItemInner,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Abbie'
                        )
                    )
                ),
                React.createElement(
                    List.ItemContent,
                    null,
                    React.createElement(
                        List.ItemInner,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Adam'
                        )
                    )
                ),
                React.createElement(
                    List.ListGroupTitle,
                    null,
                    'B'
                ),
                React.createElement(
                    List.ItemContent,
                    null,
                    React.createElement(
                        List.ItemInner,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Bailey'
                        )
                    )
                ),
                React.createElement(
                    List.ItemContent,
                    null,
                    React.createElement(
                        List.ItemInner,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Barclay'
                        )
                    )
                ),
                React.createElement(
                    List.ItemContent,
                    null,
                    React.createElement(
                        List.ItemInner,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Bartolo'
                        )
                    )
                ),
                React.createElement(
                    List.ListGroupTitle,
                    null,
                    'C'
                ),
                React.createElement(
                    List.ItemContent,
                    null,
                    React.createElement(
                        List.ItemInner,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Caiden'
                        )
                    )
                ),
                React.createElement(
                    List.ItemContent,
                    null,
                    React.createElement(
                        List.ItemInner,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Calvin'
                        )
                    )
                ),
                React.createElement(
                    List.ItemContent,
                    null,
                    React.createElement(
                        List.ItemInner,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Candy'
                        )
                    )
                )
            )
        );
    }
});

var List5 = React.createClass({
    displayName: 'List5',

    render: function render() {
        return React.createElement(
            List.List,
            { block: true },
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement(Icon, { name: 'icon-f7' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'Ivan Petrov'
                    ),
                    React.createElement(
                        List.ItemAfter,
                        null,
                        'CEO'
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement(Icon, { name: 'icon-f7' }),
                    React.createElement(Icon, { name: 'icon-f7' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'Two icons here'
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                null,
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'No icons here'
                    )
                )
            ),
            React.createElement(
                List.SubList,
                null,
                React.createElement(
                    List.ItemContent,
                    { link: true },
                    React.createElement(
                        List.ItemMedia,
                        null,
                        React.createElement(Icon, { name: 'icon-f7' })
                    ),
                    React.createElement(
                        List.ItemInner,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Ivan Petrov'
                        ),
                        React.createElement(
                            List.ItemAfter,
                            null,
                            'CEO'
                        )
                    )
                ),
                React.createElement(
                    List.ItemContent,
                    { link: true },
                    React.createElement(
                        List.ItemMedia,
                        null,
                        React.createElement(Icon, { name: 'icon-f7' }),
                        React.createElement(Icon, { name: 'icon-f7' })
                    ),
                    React.createElement(
                        List.ItemInner,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Two icons here'
                        )
                    )
                ),
                React.createElement(
                    List.ItemContent,
                    null,
                    React.createElement(
                        List.ItemInner,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'No icons here'
                        )
                    )
                ),
                React.createElement(
                    List.ItemContent,
                    { link: true },
                    React.createElement(
                        List.ItemMedia,
                        null,
                        React.createElement(Icon, { name: 'icon-f7' })
                    ),
                    React.createElement(
                        List.ItemInner,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Ultra long text goes here, no, it is really really long'
                        )
                    )
                ),
                React.createElement(
                    List.ItemContent,
                    null,
                    React.createElement(
                        List.ItemMedia,
                        null,
                        React.createElement(Icon, { name: 'icon-f7' })
                    ),
                    React.createElement(
                        List.ItemInner,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'With switch'
                        ),
                        React.createElement(
                            List.ItemAfter,
                            null,
                            React.createElement(Form.Switch, null)
                        )
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement(Icon, { name: 'icon-f7' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'Ultra long text goes here, no, it is really really long'
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                null,
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement(Icon, { name: 'icon-f7' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'With switch'
                    ),
                    React.createElement(
                        List.ItemAfter,
                        null,
                        React.createElement(Form.Switch, null)
                    )
                )
            )
        );
    }
});

var List7 = React.createClass({
    displayName: 'List7',

    render: function render() {
        return React.createElement(
            List.List,
            { block: true, tabletInset: true },
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement(Icon, { name: 'icon-f7' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'Ivan Petrov'
                    ),
                    React.createElement(
                        List.ItemAfter,
                        null,
                        'CEO'
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement(Icon, { name: 'icon-f7' }),
                    React.createElement(Icon, { name: 'icon-f7' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'Two icons here'
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement(Icon, { name: 'icon-f7' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'Ultra long text goes here, no, it is really really long'
                    )
                )
            ),
            React.createElement(
                List.ListBlockLabel,
                null,
                ' This list block will look like "inset" only on tablets (iPad) '
            )
        );
    }
});

var List6 = React.createClass({
    displayName: 'List6',

    render: function render() {
        return React.createElement(
            List.List,
            { block: true, inset: true },
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement(Icon, { name: 'icon-f7' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'Ivan Petrov'
                    ),
                    React.createElement(
                        List.ItemAfter,
                        null,
                        'CEO'
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement(Icon, { name: 'icon-f7' }),
                    React.createElement(Icon, { name: 'icon-f7' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'Two icons here'
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement(Icon, { name: 'icon-f7' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'Ultra long text goes here, no, it is really really long'
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                null,
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement(Icon, { name: 'icon-f7' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitle,
                        null,
                        'With switch'
                    ),
                    React.createElement(
                        List.ItemAfter,
                        null,
                        React.createElement(Form.Switch, null)
                    )
                )
            )
        );
    }
});

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        return React.createElement(
            View.Page,
            { title: 'List' },
            React.createElement(
                View.PageContent,
                null,
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        'p',
                        null,
                        'Framework7 allows you to be flexible with list views (table views). You can make them as navigation menus, you can use there icons, inputs, and any elements inside of the list, and even make them nested:'
                    )
                ),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Data list, with icons'
                ),
                React.createElement(List1, null),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Links'
                ),
                React.createElement(List2, null),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Links, no icons'
                ),
                React.createElement(List3, null),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Grouped with sticky titles'
                ),
                React.createElement(List4, null),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Mixed and nested'
                ),
                React.createElement(List5, null),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Mixed, inset'
                ),
                React.createElement(List6, null),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Here comes some useful information about list above'
                ),
                React.createElement(List7, null)
            )
        );
    }
});

},{"UI":51,"react":undefined}],12:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;

function getImage(i) {
    return 'img/app/photo/' + i + '.jpg';
}

var List1 = React.createClass({
    displayName: 'List1',

    render: function render() {
        return React.createElement(
            List.List,
            { block: true, media: true },
            [{ name: "Yellow Submarine", price: "$15", title: "Beatles" }, { name: "Don't Stop Me Now", price: "$22", title: "Queen" }, { name: "Billie Jean", price: "$16", title: "Michael Jackson" }].map(function (item, i) {
                return React.createElement(
                    List.ItemContent,
                    { link: true },
                    React.createElement(
                        List.ItemMedia,
                        null,
                        React.createElement('img', { src: getImage(i + 1), width: '80' })
                    ),
                    React.createElement(
                        List.ItemInner,
                        null,
                        React.createElement(
                            List.ItemTitleRow,
                            null,
                            React.createElement(
                                List.ItemTitle,
                                null,
                                item.name
                            ),
                            React.createElement(
                                List.ItemAfter,
                                null,
                                item.price
                            )
                        ),
                        React.createElement(
                            List.ItemSubTitle,
                            null,
                            item.title
                        ),
                        React.createElement(
                            List.ItemText,
                            null,
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.'
                        )
                    )
                );
            })
        );
    }
});

var List2 = React.createClass({
    displayName: 'List2',

    render: function render() {
        return React.createElement(
            List.List,
            { block: true, media: true },
            [{ name: "Facebook", time: "17:14", title: "New messages from John Doe" }, { name: "John Doe (via Twitter)", time: "18:50", title: "John Doe (@_johndoe) mentioned you on Twitter!" }, { name: "Facebook", time: "20:20", title: "New messages from John Do" }].map(function (item, i) {
                return React.createElement(
                    List.ItemContent,
                    { link: true },
                    React.createElement(
                        List.ItemMedia,
                        null,
                        React.createElement('img', { src: getImage(i + 1), width: '80' })
                    ),
                    React.createElement(
                        List.ItemInner,
                        null,
                        React.createElement(
                            List.ItemTitleRow,
                            null,
                            React.createElement(
                                List.ItemTitle,
                                null,
                                item.name
                            ),
                            React.createElement(
                                List.ItemAfter,
                                null,
                                item.time
                            )
                        ),
                        React.createElement(
                            List.ItemSubTitle,
                            null,
                            item.title
                        ),
                        React.createElement(
                            List.ItemText,
                            null,
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.'
                        )
                    )
                );
            })
        );
    }
});

var List3 = React.createClass({
    displayName: 'List3',

    render: function render() {
        return React.createElement(
            List.List,
            { block: true, media: true },
            [{ name: "Yellow Submarine", price: "$15", title: "Beatles" }, { name: "Don't Stop Me Now", price: "$22", title: "Queen" }, { name: "Billie Jean", price: "$16", title: "Michael Jackson" }].map(function (item, i) {
                return React.createElement(
                    List.ItemContent,
                    { link: true },
                    React.createElement(
                        List.ItemMedia,
                        null,
                        React.createElement('img', { src: getImage(i + 1), width: '44' })
                    ),
                    React.createElement(
                        List.ItemInner,
                        null,
                        React.createElement(
                            List.ItemTitleRow,
                            null,
                            React.createElement(
                                List.ItemTitle,
                                null,
                                item.name
                            )
                        ),
                        React.createElement(
                            List.ItemSubTitle,
                            null,
                            item.title
                        )
                    )
                );
            })
        );
    }
});

var List4 = React.createClass({
    displayName: 'List4',

    render: function render() {
        return React.createElement(
            List.List,
            { block: true, media: true, inset: true },
            [{ name: "Yellow Submarine", price: "$15", title: "Beatles" }, { name: "Don't Stop Me Now", price: "$22", title: "Queen" }, { name: "Billie Jean", price: "$16", title: "Michael Jackson" }].map(function (item, i) {
                return React.createElement(
                    List.ItemContent,
                    { link: true },
                    React.createElement(
                        List.ItemMedia,
                        null,
                        React.createElement('img', { src: getImage(i + 1), width: '44' })
                    ),
                    React.createElement(
                        List.ItemInner,
                        null,
                        React.createElement(
                            List.ItemTitleRow,
                            null,
                            React.createElement(
                                List.ItemTitle,
                                null,
                                item.name
                            )
                        ),
                        React.createElement(
                            List.ItemSubTitle,
                            null,
                            item.title
                        )
                    )
                );
            })
        );
    }
});

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        return React.createElement(
            View.Page,
            { title: 'MediaList' },
            React.createElement(
                View.PageContent,
                null,
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        'p',
                        null,
                        'Media Lists are almost the same as Data Lists, but with a more flexible layout for visualization of mor complex data, like products, services, userc, etc. You can even use them in ',
                        React.createElement(
                            'a',
                            { href: '#', 'data-popover': '.popover-music', 'class': 'open-popover' },
                            'popovers'
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Songs'
                ),
                React.createElement(List1, null),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Mail App (With Swipe to delete and overswipes)'
                ),
                React.createElement(List2, null),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Something more simple'
                ),
                React.createElement(List3, null),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Inset'
                ),
                React.createElement(List4, null)
            )
        );
    }
});

},{"UI":51,"react":undefined}],13:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var List = UI.List;
var Content = UI.Content;
var Grid = UI.Grid;
var Button = UI.Button.Button;
var Modal = UI.Modal;

function showAlertModal() {
    var alertModal = React.createElement(
        Modal.Modal,
        null,
        React.createElement(
            Modal.ModalInner,
            null,
            React.createElement(
                Modal.ModalTitle,
                null,
                'Hello'
            ),
            React.createElement(
                Modal.ModalText,
                null,
                'Hello'
            )
        ),
        React.createElement(
            Modal.ModalButtons,
            null,
            React.createElement(
                Modal.ModalButton,
                null,
                'OK'
            )
        )
    );

    app.showModal('modal', alertModal);
}

function showConfirmModal() {
    var confirmModal = React.createElement(
        Modal.Modal,
        null,
        React.createElement(
            Modal.ModalInner,
            null,
            React.createElement(
                Modal.ModalTitle,
                null,
                'Hello'
            ),
            React.createElement(
                Modal.ModalText,
                null,
                'Hello'
            )
        ),
        React.createElement(
            Modal.ModalButtons,
            null,
            React.createElement(
                Modal.ModalButton,
                null,
                'Cancel'
            ),
            React.createElement(
                Modal.ModalButton,
                { onTap: alert },
                'OK'
            )
        )
    );

    app.showModal('modal', confirmModal);
}

function showPromptModal() {
    var promptModal = React.createElement(
        Modal.Modal,
        null,
        React.createElement(
            Modal.ModalInner,
            null,
            React.createElement(
                Modal.ModalTitle,
                null,
                'Hello'
            ),
            React.createElement(
                Modal.ModalText,
                null,
                'What is yout name?'
            ),
            React.createElement(Modal.ModalTextInput, { placeholder: 'input your name' })
        ),
        React.createElement(
            Modal.ModalButtons,
            null,
            React.createElement(
                Modal.ModalButton,
                null,
                'Cancel'
            ),
            React.createElement(
                Modal.ModalButton,
                { onTap: alert },
                'OK'
            )
        )
    );
    app.showModal('modal', promptModal);
}

function showLoginModal() {
    var loginModal = React.createElement(
        Modal.Modal,
        null,
        React.createElement(
            Modal.ModalInner,
            null,
            React.createElement(
                Modal.ModalTitle,
                null,
                'Hello'
            ),
            React.createElement(
                Modal.ModalText,
                null,
                'Input your username and password'
            ),
            React.createElement(Modal.ModalTextInputDouble, { placeholder: 'username' }),
            React.createElement(Modal.ModalTextInputDouble, { type: 'password', placeholder: 'password' })
        ),
        React.createElement(
            Modal.ModalButtons,
            null,
            React.createElement(
                Modal.ModalButton,
                null,
                'Cancel'
            ),
            React.createElement(
                Modal.ModalButton,
                { onTap: alert },
                'OK'
            )
        )
    );
    app.showModal('modal', loginModal);
}

function showPasswordModal() {
    var loginModal = React.createElement(
        Modal.Modal,
        null,
        React.createElement(
            Modal.ModalInner,
            null,
            React.createElement(
                Modal.ModalTitle,
                null,
                'Hello'
            ),
            React.createElement(
                Modal.ModalText,
                null,
                'Enter your password'
            ),
            React.createElement(Modal.ModalTextInput, { type: 'password', placeholder: 'password' })
        ),
        React.createElement(
            Modal.ModalButtons,
            null,
            React.createElement(
                Modal.ModalButton,
                null,
                'Cancel'
            ),
            React.createElement(
                Modal.ModalButton,
                { onTap: alert },
                'OK'
            )
        )
    );
    app.showModal('modal', loginModal);
}

function showActionsModal() {
    var actionsModal = React.createElement(
        Modal.ActionsModal,
        null,
        React.createElement(
            Modal.ActionsModalGroup,
            null,
            React.createElement(
                Modal.ActionsModalLabel,
                null,
                'fang'
            ),
            React.createElement(
                Modal.ActionsModalButton,
                null,
                'click1'
            ),
            React.createElement(
                Modal.ActionsModalButton,
                null,
                'click2'
            )
        ),
        React.createElement(
            Modal.ActionsModalGroup,
            null,
            React.createElement(
                Modal.ActionsModalButton,
                { color: 'red', active: true },
                'cancel'
            )
        )
    );

    app.showModal('actionsModal', actionsModal);
}

function showPreLoaderModal() {
    var preLoaderModal = React.createElement(
        Modal.ModalNoButttons,
        null,
        React.createElement(
            Modal.ModalInner,
            null,
            React.createElement(
                Modal.ModalTitle,
                null,
                'Hello'
            ),
            React.createElement(
                Modal.ModalText,
                null,
                React.createElement(Modal.BlackPreloader, null)
            )
        )
    );
    app.showModal('modal', preLoaderModal);
    setTimeout(function () {
        app.hideModal();
    }, 3000);
}

function showIndicator() {
    app.showModal('indicator');
    setTimeout(function () {
        app.hideModal();
    }, 3000);
}

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        return React.createElement(
            View.Page,
            { title: 'Modals' },
            React.createElement(
                View.PageContent,
                null,
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        Content.ContentBlockInner,
                        null,
                        React.createElement(
                            'p',
                            null,
                            'There are 1:1 replacements of native Alert, Prompt and Confirm modals. They support callbacks, have very easy api and can be combined with each other. Check these examples:'
                        ),
                        React.createElement(
                            Grid.Row,
                            null,
                            React.createElement(
                                Grid.Col,
                                { p: true, per: 33 },
                                React.createElement(
                                    Button,
                                    { onTap: showAlertModal },
                                    'Alert'
                                )
                            ),
                            React.createElement(
                                Grid.Col,
                                { p: true, per: 33 },
                                React.createElement(
                                    Button,
                                    { onTap: showConfirmModal },
                                    'Confirm'
                                )
                            ),
                            React.createElement(
                                Grid.Col,
                                { p: true, per: 33 },
                                React.createElement(
                                    Button,
                                    { onTap: showPromptModal },
                                    'Prompt'
                                )
                            )
                        ),
                        React.createElement(
                            Grid.Row,
                            null,
                            React.createElement(
                                Grid.Col,
                                { p: true, per: 50 },
                                React.createElement(
                                    Button,
                                    { onTap: showLoginModal },
                                    'Login Modal'
                                )
                            ),
                            React.createElement(
                                Grid.Col,
                                { p: true, per: 50 },
                                React.createElement(
                                    Button,
                                    { onTap: showPasswordModal },
                                    'Password Modal'
                                )
                            )
                        ),
                        React.createElement(
                            Grid.Row,
                            null,
                            React.createElement(
                                Grid.Col,
                                { p: true, per: 50 },
                                React.createElement(
                                    Button,
                                    { onTap: showActionsModal },
                                    'Action Sheet'
                                )
                            ),
                            React.createElement(
                                Grid.Col,
                                { p: true, per: 50 },
                                React.createElement(
                                    Button,
                                    null,
                                    'Popup'
                                )
                            )
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Action Sheet To Popover'
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        Content.ContentBlockInner,
                        null,
                        React.createElement(
                            'p',
                            null,
                            'Action Sheet could be automatically converted to Popover (for tablets). This button will open Popover on tablets and Action Sheet on phones: ',
                            React.createElement(
                                Button,
                                { inline: true, round: true, onTap: showActionsModal },
                                'Action/Popover'
                            )
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Picker Modal'
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        Content.ContentBlockInner,
                        null,
                        React.createElement(
                            'p',
                            null,
                            'Such overlay type is similar to ',
                            React.createElement(
                                Button,
                                { inline: true, round: true },
                                'Picker\'s'
                            ),
                            'overlay, but also allows to create custom picker overlays'
                        ),
                        React.createElement(
                            'p',
                            null,
                            React.createElement(
                                Button,
                                null,
                                'Picker Modal With Custom HTML'
                            )
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Modals Stack'
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        Content.ContentBlockInner,
                        null,
                        React.createElement(
                            'p',
                            null,
                            'This feature doesn\'t allow to open multiple modals at the same time, and will automatically open next modal when you close the current one. Such behavior is similar to browser native alerts: '
                        ),
                        React.createElement(
                            'p',
                            null,
                            React.createElement(
                                Button,
                                null,
                                'Open Multiple Alerts'
                            )
                        )
                    )
                )
            )
        );
    }
});

},{"UI":51,"react":undefined}],14:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Button = UI.Button.Button;
var Notifications = UI.Notifications.Notifications;

function notificationSimple() {
    Notifications.addNotification({
        title: 'Framework7',
        message: 'This is a simple notification message with title and message'
    });
}
function notificationFull() {
    Notifications.addNotification({
        title: 'Framework7',
        subtitle: 'Notification subtitle',
        message: 'This is a simple notification message with custom icon and subtitle',
        media: '<i class="icon icon-f7"></i>'
    });
}
function notificationCustom() {
    Notifications.addNotification({
        title: 'My Awesome App',
        subtitle: 'New message from John Doe',
        message: 'Hello, how are you? Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut posuere erat. Pellentesque id elementum urna, a aliquam ante. Donec vitae volutpat orci. Aliquam sed molestie risus, quis tincidunt dui.',
        media: '<img width="44" height="44" style="border-radius:100%" src="http://lorempixel.com/output/people-q-c-100-100-9.jpg">'
    });
}
function notificationCallback() {
    Notifications.addNotification({
        title: 'My Awesome App',
        subtitle: 'New message from John Doe',
        message: 'Hello, how are you? Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut posuere erat. Pellentesque id elementum urna, a aliquam ante. Donec vitae volutpat orci. Aliquam sed molestie risus, quis tincidunt dui.',
        media: '<img width="44" height="44" style="border-radius:100%" src="http://lorempixel.com/output/people-q-c-100-100-9.jpg">',
        onClose: function onClose() {
            alert('Notification closed');
        }
    });
}

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        return React.createElement(
            View.Page,
            { title: 'Notifications' },
            React.createElement(
                View.PageContent,
                null,
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        'p',
                        null,
                        'Framework7 comes with simple Notifications component that allows you to show some useful messages to user.'
                    ),
                    React.createElement(
                        'p',
                        null,
                        React.createElement(
                            Button,
                            { onTap: notificationSimple },
                            'Default notification'
                        )
                    ),
                    React.createElement(
                        'p',
                        null,
                        React.createElement(
                            Button,
                            { onTap: notificationFull },
                            'Full-layout notification'
                        )
                    ),
                    React.createElement(
                        'p',
                        null,
                        React.createElement(
                            Button,
                            { onTap: notificationCustom },
                            'With custom image'
                        )
                    ),
                    React.createElement(
                        'p',
                        null,
                        React.createElement(
                            Button,
                            { onTap: notificationCallback },
                            'With callback on close'
                        )
                    )
                )
            )
        );
    }
});

},{"UI":51,"react":undefined}],15:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Grid = UI.Grid;
var Button = UI.Button.Button;
var MenuList = require('../home/pages/main').MenuList;

var LeftPanel = React.createClass({
	displayName: 'LeftPanel',

	render: function render() {
		return React.createElement(
			'div',
			null,
			React.createElement(
				Content.ContentBlockTitle,
				null,
				'Left Panel'
			),
			React.createElement(
				Content.ContentBlock,
				null,
				React.createElement(
					'p',
					null,
					'This is a side panel. You can close it by clicking outsite or on this link: ',
					React.createElement(
						Button,
						{ onTap: app.hidePanel },
						'close me'
					),
					'. You can put here anything, even another isolated view like in ',
					React.createElement(
						Button,
						{ onTap: showRightPanelFromLeft },
						'Right Panel'
					)
				)
			),
			React.createElement(
				Content.ContentBlockTitle,
				null,
				'Framework7 Kitchen Sink'
			),
			React.createElement(MenuList, null),
			React.createElement(
				Content.ContentBlock,
				null,
				React.createElement(
					'p',
					null,
					'Long text block goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sem urna, gravida non scelerisque id, fringilla ac velit. Phasellus elementum a ipsum at ornare. Mauris sagittis rhoncus euismod. Integer convallis augue eu lacus ultrices, in dictum elit consequat. Nulla faucibus massa id felis egestas eleifend. Proin consequat dignissim magna ut scelerisque. Vestibulum ac lorem semper, posuere sapien nec, pharetra massa. Nulla a tellus facilisis, sollicitudin quam porta, aliquam lorem. Fusce dignissim eros ac diam molestie, ut ultrices lorem tristique. Ut facilisis augue ac nisi egestas malesuada. Nunc posuere tortor quis eleifend mollis. Aliquam erat volutpat. Donec feugiat elit tellus, nec convallis orci elementum in. Sed urna mi, vestibulum id tempus id, pretium et ante. Pellentesque eget sollicitudin ligula. Phasellus pellentesque velit eu porta suscipit.'
				)
			)
		);
	}
});

var RightPanel = React.createClass({
	displayName: 'RightPanel',

	render: function render() {
		return React.createElement(
			'div',
			null,
			React.createElement(
				Content.ContentBlock,
				null,
				React.createElement(
					'p',
					null,
					'Long text block goes here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras sem urna, gravida non scelerisque id, fringilla ac velit. Phasellus elementum a ipsum at ornare. Mauris sagittis rhoncus euismod. Integer convallis augue eu lacus ultrices, in dictum elit consequat. Nulla faucibus massa id felis egestas eleifend. Proin consequat dignissim magna ut scelerisque. Vestibulum ac lorem semper, posuere sapien nec, pharetra massa. Nulla a tellus facilisis, sollicitudin quam porta, aliquam lorem. Fusce dignissim eros ac diam molestie, ut ultrices lorem tristique. Ut facilisis augue ac nisi egestas malesuada. Nunc posuere tortor quis eleifend mollis. Aliquam erat volutpat. Donec feugiat elit tellus, nec convallis orci elementum in. Sed urna mi, vestibulum id tempus id, pretium et ante. Pellentesque eget sollicitudin ligula. Phasellus pellentesque velit eu porta suscipit.'
				)
			)
		);
	}
});

function showLeftPanel() {
	app.showPanel('left', React.createElement(LeftPanel, null));
}

function showRightPanel() {
	app.showPanel('right', React.createElement(RightPanel, null));
}

function showRightPanelFromLeft() {
	app.hidePanel();
	setTimeout(function () {
		showRightPanel();
	}, 500);
}

module.exports = React.createClass({
	displayName: 'exports',

	render: function render() {
		return React.createElement(
			View.Page,
			{ title: 'Side Panels' },
			React.createElement(
				View.PageContent,
				null,
				React.createElement(
					Content.ContentBlock,
					null,
					React.createElement(
						'p',
						null,
						'Framework7 comes with 2 panels (on left and on right), both are optional. They have two different layouts/effects - ',
						React.createElement(
							'b',
							null,
							'cover'
						),
						' above the content (like left panel here) and ',
						React.createElement(
							'b',
							null,
							'reveal'
						),
						' (like right panel). You can put absolutely anything inside: data lists, forms, custom content, and even other isolated app view (like in right panel now) with its own dynamic navbar. Checkout panels:'
					)
				),
				React.createElement(
					Content.ContentBlock,
					null,
					React.createElement(
						Grid.Row,
						null,
						React.createElement(
							Grid.Col,
							{ per: 50 },
							React.createElement(
								Button,
								{ onTap: showLeftPanel },
								'Left Panel'
							)
						),
						React.createElement(
							Grid.Col,
							{ per: 50 },
							React.createElement(
								Button,
								{ onTap: showRightPanel },
								'Right Panel'
							)
						)
					)
				)
			)
		);
	}
});

},{"../home/pages/main":31,"UI":51,"react":undefined}],16:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var Picker = UI.Picker;
var Content = UI.Content;
var List = UI.List;
var ActionsModal = UI.Modal.ActionsModal;

var DevicePicker = React.createClass({
	displayName: 'DevicePicker',

	onChange: function onChange(value) {
		console.log(value);
	},
	render: function render() {
		var cols = [{
			textAlign: 'center',
			values: ['iPhone 4', 'iPhone 4S', 'iPhone 5', 'iPhone 5S', 'iPhone 6', 'iPhone 6 Plus', 'iPad 2', 'iPad Retina', 'iPad Air', 'iPad mini', 'iPad mini 2', 'iPad mini 3']
		}];
		var toolbar = React.createElement(
			Picker.ToolBar,
			null,
			React.createElement('div', { className: 'left' }),
			React.createElement(
				'div',
				{ className: 'right' },
				React.createElement(
					'a',
					{ href: '#', className: 'link right', onClick: app.hideModal },
					'Close'
				)
			)
		);
		return React.createElement(Picker.Picker, { cols: cols, defaultValue: [5], toolbar: toolbar, onChange: this.onChange });
	}
});

var devicePickerModal = React.createElement(
	ActionsModal,
	null,
	React.createElement(DevicePicker, null)
);

function showDevicePicker() {
	app.showModal('pickerModal', devicePickerModal);
}

var DescribePicker = React.createClass({
	displayName: 'DescribePicker',

	onChange: function onChange(value) {
		console.log(value);
	},
	render: function render() {
		var cols = [{
			textAlign: 'left',
			values: 'Super Lex Amazing Bat Iron Rocket Lex Cool Beautiful Wonderful Raining Happy Amazing Funny Cool Hot'.split(' ')
		}, {
			values: 'Man Luthor Woman Boy Girl Person Cutie Babe Raccoon'.split(' ')
		}];
		var toolbar = React.createElement(
			Picker.ToolBar,
			null,
			React.createElement('div', { className: 'left' }),
			React.createElement(
				'div',
				{ className: 'right' },
				React.createElement(
					'a',
					{ href: '#', className: 'link right', onClick: app.hideModal },
					'Close'
				)
			)
		);
		return React.createElement(Picker.Picker, { cols: cols, defaultValue: [5], toolbar: toolbar, onChange: this.onChange });
	}
});

var describePickerModal = React.createElement(
	ActionsModal,
	null,
	React.createElement(DescribePicker, null)
);

function showDescribePicker() {
	app.showModal('pickerModal', describePickerModal);
}

var carVendors = {
	Japanese: ['Honda', 'Lexus', 'Mazda', 'Nissan', 'Toyota'],
	German: ['Audi', 'BMW', 'Mercedes', 'Volkswagen', 'Volvo'],
	American: ['Cadillac', 'Chrysler', 'Dodge', 'Ford']
};

var countries = ['Japanese', 'German', 'American'];
var DependentPickerModal = React.createClass({
	displayName: 'DependentPickerModal',

	onChange: function onChange(value) {
		console.log(value);
	},
	render: function render() {
		var cols = [{
			textAlign: 'left',
			values: countries,
			onChange: function onChange(picker, index) {
				var country = countries[index];
				if (picker.cols[1].replaceValues) {
					picker.cols[1].replaceValues((function (n) {
						var arr = [];for (var i = 0; i < n; i++) {
							arr[i] = i;
						}return arr;
					})(carVendors[country].length), carVendors[country]);
				}
			}
		}, {
			values: carVendors.Japanese,
			width: 160
		}];
		var toolbar = React.createElement(
			Picker.ToolBar,
			null,
			React.createElement('div', { className: 'left' }),
			React.createElement(
				'div',
				{ className: 'right' },
				React.createElement(
					'a',
					{ href: '#', className: 'link right', onClick: app.hideModal },
					'Close'
				)
			)
		);
		return React.createElement(Picker.Picker, { cols: cols, toolbar: toolbar, onChange: this.onChange });
	}
});

var dependentPickerModal = React.createElement(
	ActionsModal,
	null,
	React.createElement(DependentPickerModal, null)
);

function showDependentPicker() {
	app.showModal('pickerModal', dependentPickerModal);
}

var CustomPicker = React.createClass({
	displayName: 'CustomPicker',

	onChange: function onChange(value) {
		console.log(value);
	},
	render: function render() {
		var cols = [{
			values: ['Mr', 'Ms']
		}, {
			textAlign: 'left',
			values: 'Super Lex Amazing Bat Iron Rocket Lex Cool Beautiful Wonderful Raining Happy Amazing Funny Cool Hot'.split(' ')
		}, {
			values: 'Man Luthor Woman Boy Girl Person Cutie Babe Raccoon'.split(' ')
		}];
		var toolbar = React.createElement(
			Picker.ToolBar,
			null,
			React.createElement('div', { className: 'left' }),
			React.createElement(
				'div',
				{ className: 'right' },
				React.createElement(
					'a',
					{ href: '#', className: 'link right', onClick: app.hideModal },
					'Close'
				)
			)
		);
		return React.createElement(Picker.Picker, { cols: cols, defaultValue: [5], toolbar: toolbar, onChange: this.onChange });
	}
});

var customPickerModal = React.createElement(
	ActionsModal,
	null,
	React.createElement(CustomPicker, null)
);

function showCustomPicker() {
	app.showModal('pickerModal', customPickerModal);
}

var DateTimePicker = React.createClass({
	displayName: 'DateTimePicker',

	onChange: function onChange(value) {
		console.log(value);
	},
	render: function render() {
		var cols = [
		// Months
		{
			values: 'January February March April May June July August September October November December'.split(' '),
			textAlign: 'left'
		},
		// Days
		{
			values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
		},
		// Years
		{
			values: (function () {
				var arr = [];
				for (var i = 1950; i <= 2030; i++) {
					arr.push(i);
				}
				return arr;
			})()
		},
		// Space divider
		{
			divider: true,
			content: ' '
		},
		// Hours
		{
			values: (function () {
				var arr = [];
				for (var i = 0; i <= 23; i++) {
					arr.push(i);
				}
				return arr;
			})()
		},
		// Divider
		{
			divider: true,
			content: ':'
		},
		// Minutes
		{
			values: (function () {
				var arr = [];
				for (var i = 0; i <= 59; i++) {
					arr.push(i < 10 ? '0' + i : i);
				}
				return arr;
			})()
		}];
		return React.createElement(Picker.Picker, { cols: cols, defaultValue: [4, 5, 20, 1, 2], onChange: this.onChange, inline: true });
	}
});

module.exports = React.createClass({
	displayName: 'exports',

	render: function render() {
		return React.createElement(
			View.Page,
			{ title: 'Picker' },
			React.createElement(
				View.PageContent,
				null,
				React.createElement(
					Content.ContentBlock,
					null,
					React.createElement(
						'p',
						null,
						'Picker is a powerful component that allows you to create custom overlay pickers which looks like iOS native picker.'
					),
					React.createElement(
						'p',
						null,
						'Picker could be used as inline component or as overlay. Overlay Picker will be automatically converted to Popover on tablets (iPad).'
					)
				),
				React.createElement(
					Content.ContentBlockTitle,
					null,
					'Picker with single value'
				),
				React.createElement(
					List.List,
					null,
					React.createElement(
						List.ItemContent,
						null,
						React.createElement(
							List.ItemInner,
							null,
							React.createElement(
								List.ItemInput,
								null,
								React.createElement('input', { type: 'text', placeholder: 'Your iOS device', readonly: 'readonly', onClick: showDevicePicker })
							)
						)
					)
				),
				React.createElement(
					Content.ContentBlockTitle,
					null,
					'2 values and 3d-rotate effect'
				),
				React.createElement(
					List.List,
					null,
					React.createElement(
						List.ItemContent,
						null,
						React.createElement(
							List.ItemInner,
							null,
							React.createElement(
								List.ItemInput,
								null,
								React.createElement('input', { type: 'text', placeholder: 'Describe yourself', readonly: 'readonly', onClick: showDescribePicker })
							)
						)
					)
				),
				React.createElement(
					Content.ContentBlockTitle,
					null,
					'Dependent values'
				),
				React.createElement(
					List.List,
					null,
					React.createElement(
						List.ItemContent,
						null,
						React.createElement(
							List.ItemInner,
							null,
							React.createElement(
								List.ItemInput,
								null,
								React.createElement('input', { type: 'text', placeholder: 'Your car', readonly: 'readonly', onClick: showDependentPicker })
							)
						)
					)
				),
				React.createElement(
					Content.ContentBlockTitle,
					null,
					'Custom toolbar'
				),
				React.createElement(
					List.List,
					null,
					React.createElement(
						List.ItemContent,
						null,
						React.createElement(
							List.ItemInner,
							null,
							React.createElement(
								List.ItemInput,
								null,
								React.createElement('input', { type: 'text', placeholder: 'Describe yourself', readonly: 'readonly', onClick: showCustomPicker })
							)
						)
					)
				),
				React.createElement(
					Content.ContentBlockTitle,
					null,
					'Inline Picker / Date-time'
				),
				React.createElement(
					List.List,
					null,
					React.createElement(
						List.ItemContent,
						null,
						React.createElement(
							List.ItemInner,
							null,
							React.createElement(DateTimePicker, null)
						)
					)
				)
			)
		);
	}
});

},{"UI":51,"react":undefined}],17:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var Picker = UI.Picker;
var Content = UI.Content;
var List = UI.List;
var ActionsModal = UI.Modal.ActionsModal;

var DevicePicker = React.createClass({
  displayName: 'DevicePicker',

  onChange: function onChange(value) {
    console.log(value);
  },
  render: function render() {
    var cols = [{
      textAlign: 'center',
      values: ['iPhone 4xx', 'iPhone 4S', 'iPhone 5', 'iPhone 5S', 'iPhone 6', 'iPhone 6 Plus', 'iPad 2', 'iPad Retina', 'iPad Air', 'iPad mini', 'iPad mini 2', 'iPad mini 3']
    }];
    var params = { cols: cols, defaultValue: [5], onChange: this.onChange };
    return React.createElement(Picker.PickerEx, { params: params });
  }
});

var devicePickerModal = React.createElement(
  ActionsModal,
  null,
  React.createElement(DevicePicker, null)
);

function showDevicePicker() {
  app.showModal('pickerModal', devicePickerModal);
}

var DescribePicker = React.createClass({
  displayName: 'DescribePicker',

  onChange: function onChange(value) {
    console.log(value);
  },
  render: function render() {
    var cols = [{
      textAlign: 'left',
      values: 'Super Lex Amazing Bat Iron Rocket Lex Cool Beautiful Wonderful Raining Happy Amazing Funny Cool Hot'.split(' ')
    }, {
      values: 'Man Luthor Woman Boy Girl Person Cutie Babe Raccoon'.split(' ')
    }];
    var params = {
      cols: cols,
      onChange: this.onChange
    };
    return React.createElement(Picker.PickerEx, { params: params });
  }
});

var describePickerModal = React.createElement(
  ActionsModal,
  null,
  React.createElement(DescribePicker, null)
);

function showDescribePicker() {
  app.showModal('pickerModal', describePickerModal);
}

var carVendors = {
  Japanese: ['Honda', 'Lexus', 'Mazda', 'Nissan', 'Toyota'],
  German: ['Audi', 'BMW', 'Mercedes', 'Volkswagen', 'Volvo'],
  American: ['Cadillac', 'Chrysler', 'Dodge', 'Ford']
};

var countries = ['Japanese', 'German', 'American'];
var DependentPickerModal = React.createClass({
  displayName: 'DependentPickerModal',

  onChange: function onChange(value) {
    console.log(value);
  },
  render: function render() {
    var cols = [{
      textAlign: 'left',
      values: countries,
      onChange: function onChange(picker, index) {
        var country = countries[index];
        if (picker.cols[1].replaceValues) {
          picker.cols[1].replaceValues((function (n) {
            var arr = [];for (var i = 0; i < n; i++) {
              arr[i] = i;
            }return arr;
          })(carVendors[country].length), carVendors[country]);
        }
      }
    }, {
      values: carVendors.Japanese,
      width: 160
    }];
    var params = {
      cols: cols,
      onChange: this.onChange
    };
    return React.createElement(Picker.PickerEx, { params: params });
  }
});

var dependentPickerModal = React.createElement(
  ActionsModal,
  null,
  React.createElement(DependentPickerModal, null)
);

function showDependentPicker() {
  app.showModal('pickerModal', dependentPickerModal);
}

var CustomPicker = React.createClass({
  displayName: 'CustomPicker',

  onChange: function onChange(value) {
    console.log(value);
  },
  render: function render() {
    var cols = [{
      values: ['Mr', 'Ms']
    }, {
      textAlign: 'left',
      values: 'Super Lex Amazing Bat Iron Rocket Lex Cool Beautiful Wonderful Raining Happy Amazing Funny Cool Hot'.split(' ')
    }, {
      values: 'Man Luthor Woman Boy Girl Person Cutie Babe Raccoon'.split(' ')
    }];
    var params = {
      toolbarTemplate: '<div class="toolbar">' + '<div class="toolbar-inner">' + '<div class="left">' + '<a href="#" class="link toolbar-randomize-link" onclick="app.hideModal()">Randomize</a>' + '</div>' + '<div class="right">' + '<a href="#" class="link close-picker" onclick="app.hideModal()">That\'s me</a>' + '</div>' + '</div>' + '</div>',
      cols: cols
    };

    return React.createElement(Picker.PickerEx, { params: params });
  }
});

var customPickerModal = React.createElement(
  ActionsModal,
  null,
  React.createElement(CustomPicker, null)
);

function showCustomPicker() {
  app.showModal('pickerModal', customPickerModal);
}

var DateTimePicker = React.createClass({
  displayName: 'DateTimePicker',

  onChange: function onChange(value) {
    console.log(value);
  },
  render: function render() {
    var cols = [
    // Months
    {
      values: 'January February March April May June July August September October November December'.split(' '),
      textAlign: 'left'
    },
    // Days
    {
      values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
    },
    // Years
    {
      values: (function () {
        var arr = [];
        for (var i = 1950; i <= 2030; i++) {
          arr.push(i);
        }
        return arr;
      })()
    },
    // Space divider
    {
      divider: true,
      content: ' '
    },
    // Hours
    {
      values: (function () {
        var arr = [];
        for (var i = 0; i <= 23; i++) {
          arr.push(i);
        }
        return arr;
      })()
    },
    // Divider
    {
      divider: true,
      content: ':'
    },
    // Minutes
    {
      values: (function () {
        var arr = [];
        for (var i = 0; i <= 59; i++) {
          arr.push(i < 10 ? '0' + i : i);
        }
        return arr;
      })()
    }];
    var params = {
      cols: cols,
      defaultValue: [4, 5, 20, 1, 2],
      onChange: this.onChange,
      toolbar: false,
      inline: true
    };
    return React.createElement(Picker.PickerEx, { params: params });
  }
});

module.exports = React.createClass({
  displayName: 'exports',

  render: function render() {
    return React.createElement(
      View.Page,
      { title: 'Picker 2' },
      React.createElement(
        View.PageContent,
        null,
        React.createElement(
          Content.ContentBlock,
          null,
          React.createElement(
            'p',
            null,
            'Picker is a powerful component that allows you to create custom overlay pickers which looks like iOS native picker.'
          ),
          React.createElement(
            'p',
            null,
            'Picker could be used as inline component or as overlay. Overlay Picker will be automatically converted to Popover on tablets (iPad).'
          )
        ),
        React.createElement(
          Content.ContentBlockTitle,
          null,
          'Picker with single value'
        ),
        React.createElement(
          List.List,
          null,
          React.createElement(
            List.ItemContent,
            null,
            React.createElement(
              List.ItemInner,
              null,
              React.createElement(
                List.ItemInput,
                null,
                React.createElement('input', { type: 'text', placeholder: 'Your iOS device', readonly: 'readonly', onClick: showDevicePicker })
              )
            )
          )
        ),
        React.createElement(
          Content.ContentBlockTitle,
          null,
          '2 values and 3d-rotate effect'
        ),
        React.createElement(
          List.List,
          null,
          React.createElement(
            List.ItemContent,
            null,
            React.createElement(
              List.ItemInner,
              null,
              React.createElement(
                List.ItemInput,
                null,
                React.createElement('input', { type: 'text', placeholder: 'Describe yourself', readonly: 'readonly', onClick: showDescribePicker })
              )
            )
          )
        ),
        React.createElement(
          Content.ContentBlockTitle,
          null,
          'Dependent values'
        ),
        React.createElement(
          List.List,
          null,
          React.createElement(
            List.ItemContent,
            null,
            React.createElement(
              List.ItemInner,
              null,
              React.createElement(
                List.ItemInput,
                null,
                React.createElement('input', { type: 'text', placeholder: 'Your car', readonly: 'readonly', onClick: showDependentPicker })
              )
            )
          )
        ),
        React.createElement(
          Content.ContentBlockTitle,
          null,
          'Custom toolbar'
        ),
        React.createElement(
          List.List,
          null,
          React.createElement(
            List.ItemContent,
            null,
            React.createElement(
              List.ItemInner,
              null,
              React.createElement(
                List.ItemInput,
                null,
                React.createElement('input', { type: 'text', placeholder: 'Describe yourself', readonly: 'readonly', onClick: showCustomPicker })
              )
            )
          )
        ),
        React.createElement(
          Content.ContentBlockTitle,
          null,
          'Inline Picker / Date-time'
        ),
        React.createElement(
          List.List,
          null,
          React.createElement(
            List.ItemContent,
            null,
            React.createElement(
              List.ItemInner,
              null,
              React.createElement(DateTimePicker, null)
            )
          )
        )
      )
    );
  }
});

},{"UI":51,"react":undefined}],18:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var PopoverModal = UI.Modal.PopoverModal;
var List = UI.List;
var Button = UI.Button.Button;

var PopoverModalInstance = React.createClass({
	displayName: 'PopoverModalInstance',

	render: function render() {
		return React.createElement(
			PopoverModal,
			{ target: this.props.target },
			React.createElement(
				List.List,
				{ block: true },
				React.createElement(
					'li',
					null,
					React.createElement(
						Button,
						{ list: true },
						'List Button 1'
					)
				),
				React.createElement(
					'li',
					null,
					React.createElement(
						Button,
						{ list: true },
						'List Button 1'
					)
				),
				React.createElement(
					'li',
					null,
					React.createElement(
						Button,
						{ list: true },
						'List Button 1'
					)
				)
			)
		);
	}
});

function showPopover(e) {
	app.showModal('popoverModal', React.createElement(PopoverModalInstance, { target: e.target }));
}

module.exports = React.createClass({
	displayName: 'exports',

	render: function render() {
		return React.createElement(
			View.Page,
			{ title: 'Popover' },
			React.createElement(
				View.PageContent,
				null,
				React.createElement(
					Content.ContentBlock,
					null,
					React.createElement(
						'p',
						null,
						'Of course, Framework7 has Popovers. Popovers may be called on absolutely any element with dynamic positioning. Note that due to Apple guide lines it is not recommended to use popovers on iPhone, only on bigger screens (iPad), so on small screen it may have wrong positioning because it is not fit to screen. For iPhone it is recommended to use ',
						React.createElement(
							'a',
							{ href: '#', onClick: showPopover },
							'actions and modals'
						),
						' instead. Try the "bars" icon on navbar, "menu" link on bottom toolbar, links and buttons in text below:'
					),
					React.createElement(
						'p',
						null,
						React.createElement(
							'a',
							{ href: '#', onClick: showPopover },
							'Open popover on me'
						)
					),
					React.createElement(
						'p',
						null,
						'Mauris fermentum neque et luctus venenatis. Vivamus a sem rhoncus, ornare tellus eu, euismod mauris. In porta turpis at semper convallis. Duis adipiscing leo eu nulla lacinia, quis rhoncus metus condimentum. Etiam nec malesuada nibh. Maecenas quis lacinia nisl, vel posuere dolor. Vestibulum condimentum, nisl ac vulputate egestas, neque enim dignissim elit, rhoncus volutpat magna enim a est. Aenean sit amet ligula neque. Cras suscipit rutrum enim. Nam a odio facilisis, elementum tellus non, ',
						React.createElement(
							'a',
							{ href: '#', onClick: showPopover },
							'popover'
						),
						' tortor. Pellentesque felis eros, dictum vitae lacinia quis, lobortis vitae ipsum. Cras vehicula bibendum lorem quis imperdiet.'
					),
					React.createElement(
						'p',
						null,
						'In hac habitasse platea dictumst. Etiam varius, ante vel ornare facilisis, velit massa rutrum dolor, ac porta magna magna lacinia nunc. Curabitur ',
						React.createElement(
							'a',
							{ href: '#', onClick: showPopover },
							'popover!'
						),
						' cursus laoreet. Aenean vel tempus augue. Pellentesque in imperdiet nibh. Mauris rhoncus nulla id sem suscipit volutpat. Pellentesque ac arcu in nisi viverra pulvinar. Nullam nulla orci, bibendum sed ligula non, ullamcorper iaculis mi. In hac habitasse platea dictumst. Praesent varius at nisl eu luctus. Cras aliquet porta est. Quisque elementum quis dui et consectetur. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Sed sed laoreet purus. Pellentesque eget ante ante.'
					),
					React.createElement(
						'p',
						null,
						'Duis et ultricies nibh. Sed facilisis turpis urna, ac imperdiet erat venenatis eu. Proin sit amet faucibus tortor, et varius sem. Etiam vitae lacinia neque. Aliquam nisi purus, interdum in arcu sed, ultrices rutrum arcu. Nulla mi turpis, consectetur vel enim quis, facilisis viverra dui. Aliquam quis convallis tortor, quis semper ligula. Morbi ullamcorper ',
						React.createElement(
							'a',
							{ href: '#', onClick: showPopover },
							'one more popover'
						),
						' massa at accumsan. Etiam purus odio, posuere in ligula vitae, viverra ultricies justo. Vestibulum nec interdum nisi. Aenean ac consectetur velit, non malesuada magna. Sed pharetra vehicula augue, vel venenatis lectus gravida eget. Curabitur lacus tellus, venenatis eu arcu in, interdum auctor nunc. Nunc non metus neque. Suspendisse viverra lectus sed risus aliquet, vel accumsan dolor feugiat.'
					)
				)
			)
		);
	}
});

},{"UI":51,"react":undefined}],19:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Grid = UI.Grid;
var Button = UI.Button.Button;
var Modal = UI.Modal;

function showPreloader(text) {
	console.log(text);
	text = text || 'Loading...';console.log(text);
	var preLoaderModal = React.createElement(
		Modal.ModalNoButttons,
		null,
		React.createElement(
			Modal.ModalInner,
			null,
			React.createElement(
				Modal.ModalTitle,
				null,
				text
			),
			React.createElement(
				Modal.ModalText,
				null,
				React.createElement(Modal.BlackPreloader, null)
			)
		)
	);
	app.showModal('modal', preLoaderModal);
	setTimeout(function () {
		app.hideModal();
	}, 3000);
}

function showIndicator() {
	app.showModal('indicator');
	setTimeout(function () {
		app.hideModal();
	}, 3000);
}

module.exports = React.createClass({
	displayName: 'exports',

	render: function render() {
		return React.createElement(
			View.Page,
			{ title: 'Modals' },
			React.createElement(
				View.PageContent,
				null,
				React.createElement(
					Content.ContentBlock,
					null,
					React.createElement(
						'p',
						null,
						'How about an activity indicator? Framework 7 has a nice one. The F7 preloader is made with SVG and animated with CSS so it can be easily resized. Two options are available: the default is for light background and another one is for dark background. The HTML is pretty easy, just add a .preloader className to any element. For the dark background option, also add a .preloader-white className. Here are some examples:'
					)
				),
				React.createElement(
					Content.ContentBlock,
					{ row: true, style: { textAlign: 'center' } },
					React.createElement(
						'div',
						{ className: 'col-25' },
						'Default:',
						React.createElement('br', null),
						React.createElement('span', { className: 'preloader' })
					),
					React.createElement(
						'div',
						{ style: { backgroundColor: '#333' }, className: 'col-25' },
						'White:',
						React.createElement('br', null),
						React.createElement('span', { className: 'preloader preloader-white' })
					),
					React.createElement(
						'div',
						{ className: 'col-25' },
						'Big:',
						React.createElement('br', null),
						React.createElement('span', { className: 'preloader', style: { width: '42px', height: '42px' } })
					),
					React.createElement(
						'div',
						{ style: { backgroundColor: '#333' }, className: 'col-25' },
						'White:',
						React.createElement('br', null),
						React.createElement('span', { className: 'preloader preloader-white', style: { width: '42px', height: '42px' } })
					)
				),
				React.createElement(
					Content.ContentBlock,
					null,
					React.createElement(
						'p',
						null,
						'With ',
						React.createElement(
							'b',
							null,
							'showIndicator()'
						),
						' you can call small overlay with indicator:'
					),
					React.createElement(
						Button,
						{ onTap: showIndicator },
						'Open small indicator overlay'
					),
					React.createElement(
						'p',
						null,
						'With ',
						React.createElement(
							'b',
							null,
							'showPreloader()'
						),
						' you can call modal window with preloader:'
					),
					React.createElement(
						Button,
						{ onTap: showPreloader.bind(this, '') },
						'Open preloader modal'
					),
					React.createElement(
						'p',
						null,
						'With ',
						React.createElement(
							'b',
							null,
							'showPreloader(\'My text...\')'
						),
						' you can call it with custom title:'
					),
					React.createElement(
						Button,
						{ onTap: showPreloader.bind(this, 'My text...') },
						'Open custom preloade'
					)
				)
			)
		);
	}
});

},{"UI":51,"react":undefined}],20:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Card = UI.Card;
var List = UI.List;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Button = UI.Button.Button;

var ListItem = React.createClass({
    displayName: 'ListItem',

    render: function render() {
        return React.createElement(
            List.ItemContent,
            null,
            React.createElement(
                List.ItemMedia,
                null,
                React.createElement(Icon, { name: 'icon-f7' })
            ),
            React.createElement(
                List.ItemInner,
                null,
                React.createElement(
                    List.ItemTitle,
                    null,
                    'Item ',
                    this.props.value
                ),
                React.createElement(
                    List.ItemAfter,
                    null,
                    React.createElement(
                        Badge,
                        null,
                        this.props.value
                    )
                )
            )
        );
    }
});

module.exports = React.createClass({
    displayName: 'exports',

    getInitialState: function getInitialState() {
        return {
            list: [5, 4, 3, 2, 1]
        };
    },
    onRefresh: function onRefresh(e) {
        var self = this;
        setTimeout(function () {
            var len = self.state.list.length;
            self.state.list.unshift(len + 1);
            self.setState({ list: self.state.list });
            e.detail.done();
        }, 1000);
    },
    render: function render() {
        return React.createElement(
            View.Page,
            { title: 'Pull To Refresh' },
            React.createElement(
                View.PageContent,
                { 'class': 'pull-to-refresh-content' },
                React.createElement(UI.Refresh.PullToRefresh, { onRefresh: this.onRefresh }),
                React.createElement(
                    List.List,
                    { block: true },
                    this.state.list.map(function (item) {
                        return React.createElement(ListItem, { value: item });
                    })
                )
            )
        );
    }
});

},{"UI":51,"react":undefined}],21:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');
var _ = require('underscore');

var View = UI.View;
var Content = UI.Content;
var Grid = UI.Grid;
var List = UI.List;
var Select = UI.Select;
var Icon = UI.Icon.Icon;
var Button = UI.Button.Button;
var ButtonsRow = UI.Button.ButtonsRow;

function getImage(i) {
    return 'img/app/photo/' + i + '.jpg';
}

var List1 = React.createClass({
    displayName: 'List1',

    getInitialState: function getInitialState() {
        return {
            checkedList: []
        };
    },
    handleChange: function handleChange(i, checked) {
        if (checked) {
            this.state.checkedList.push(i);
        } else {
            this.state.checkedList = _.without(this.state.checkedList, i);
        }
        console.log(this.state.checkedList);
    },
    render: function render() {
        var _this = this;

        var checkedList = this.state.checkedList;
        return React.createElement(
            List.List,
            { block: true },
            ["Books", "Movies", "Food", "Drinks"].map(function (label, i) {
                return React.createElement(
                    List.ItemContent,
                    { key: i, checkbox: true, value: i, name: 'checkbox1', checked: checkedList.indexOf(i) !== -1, onChange: _this.handleChange },
                    React.createElement(
                        List.ItemMedia,
                        null,
                        React.createElement(Icon, { name: 'icon-f7' })
                    ),
                    React.createElement(
                        List.ItemInner,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            label
                        ),
                        React.createElement(
                            List.ItemAfter,
                            null,
                            'CEO'
                        )
                    )
                );
            })
        );
    }
});

var List2 = React.createClass({
    displayName: 'List2',

    handleChange: function handleChange(i, checked) {
        console.log(i, checked);
    },
    render: function render() {
        var _this2 = this;

        return React.createElement(
            List.List,
            { block: true },
            ["Books", "Movies", "Food", "Drinks"].map(function (label, i) {
                return React.createElement(
                    List.ItemContent,
                    { key: i, radio: true, value: i, name: 'radio1', checked: i === 2, onChange: _this2.handleChange },
                    React.createElement(
                        List.ItemMedia,
                        null,
                        React.createElement(Icon, { name: 'icon-f7' })
                    ),
                    React.createElement(
                        List.ItemInner,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            label
                        ),
                        React.createElement(
                            List.ItemAfter,
                            null,
                            'CEO'
                        )
                    )
                );
            })
        );
    }
});

var List3 = React.createClass({
    displayName: 'List3',

    getInitialState: function getInitialState() {
        return {
            checkedList: []
        };
    },
    handleChange: function handleChange(i, checked) {
        if (checked) {
            this.state.checkedList.push(i);
        } else {
            this.state.checkedList = _.without(this.state.checkedList, i);
        }
        console.log(this.state.checkedList);
    },
    render: function render() {
        var _this3 = this;

        var checkedList = this.state.checkedList;
        return React.createElement(
            List.List,
            { block: true, media: true },
            [{ name: "Yellow Submarine", price: "$15", title: "Beatles" }, { name: "Don't Stop Me Now", price: "$22", title: "Queen" }, { name: "Billie Jean", price: "$16", title: "Michael Jackson" }].map(function (item, i) {
                return React.createElement(
                    List.ItemContent,
                    { key: i, checkbox: true, value: i, name: 'checkbox2', checked: checkedList.indexOf(i) !== -1, onChange: _this3.handleChange },
                    React.createElement(
                        List.ItemMedia,
                        null,
                        React.createElement('img', { src: getImage(i + 1), width: '80' })
                    ),
                    React.createElement(
                        List.ItemInner,
                        null,
                        React.createElement(
                            List.ItemTitleRow,
                            null,
                            React.createElement(
                                List.ItemTitle,
                                null,
                                item.name
                            ),
                            React.createElement(
                                List.ItemAfter,
                                null,
                                item.price
                            )
                        ),
                        React.createElement(
                            List.ItemSubTitle,
                            null,
                            item.title
                        ),
                        React.createElement(
                            List.ItemText,
                            null,
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.'
                        )
                    )
                );
            })
        );
    }
});

var List4 = React.createClass({
    displayName: 'List4',

    handleChange: function handleChange(i, checked) {
        console.log(i, checked);
    },
    render: function render() {
        var _this4 = this;

        return React.createElement(
            List.List,
            { block: true, media: true },
            [{ name: "Yellow Submarine", price: "$15", title: "Beatles" }, { name: "Don't Stop Me Now", price: "$22", title: "Queen" }, { name: "Billie Jean", price: "$16", title: "Michael Jackson" }].map(function (item, i) {
                return React.createElement(
                    List.ItemContent,
                    { key: i, radio: true, value: i, name: 'radio1', checked: i === 2, onChange: _this4.handleChange },
                    React.createElement(
                        List.ItemMedia,
                        null,
                        React.createElement('img', { src: getImage(i + 4), width: '80' })
                    ),
                    React.createElement(
                        List.ItemInner,
                        null,
                        React.createElement(
                            List.ItemTitleRow,
                            null,
                            React.createElement(
                                List.ItemTitle,
                                null,
                                item.name
                            ),
                            React.createElement(
                                List.ItemAfter,
                                null,
                                item.price
                            )
                        ),
                        React.createElement(
                            List.ItemSubTitle,
                            null,
                            item.title
                        ),
                        React.createElement(
                            List.ItemText,
                            null,
                            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.'
                        )
                    )
                );
            })
        );
    }
});

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        return React.createElement(
            View.Page,
            { title: 'CheckBox' },
            React.createElement(
                View.PageContent,
                null,
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Checkbox group'
                ),
                React.createElement(List1, null),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Radio buttons group'
                ),
                React.createElement(List2, null),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'With Media Lists'
                ),
                React.createElement(List3, null),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'What is your favourite song?'
                ),
                React.createElement(List4, null)
            )
        );
    }
});

},{"UI":51,"react":undefined,"underscore":54}],22:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var PopoverModal = UI.Modal.PopoverModal;
var List = UI.List;
var Button = UI.Button.Button;
var Icon = UI.Icon.Icon;

var persons = ['Acura', 'Audi', 'BMW', 'Cadillac ', 'Chevrolet ', 'Chrysler ', 'Dodge ', 'Ferrari ', 'Ford ', 'GMC ', 'Honda', 'Hummer', 'Hyundai', 'Infiniti ', 'Isuzu ', 'Jaguar ', 'Jeep ', 'Kia', 'Lamborghini ', 'Land Rover', 'Lexus ', 'Lincoln ', 'Lotus ', 'Mazda', 'Mercedes-Benz', 'Mercury ', 'Mitsubishi', 'Nissan ', 'Oldsmobile ', 'Peugeot ', 'Pontiac ', 'Porsche', 'Regal', 'Saab ', 'Saturn ', 'Subaru ', 'Suzuki ', 'Toyota', 'Volkswagen', 'Volvo'];

var ListItem = React.createClass({
				displayName: 'ListItem',

				render: function render() {
								return React.createElement(
												List.ItemContent,
												{ link: true },
												React.createElement(
																List.ItemMedia,
																null,
																React.createElement(Icon, { name: 'icon-f7' })
												),
												React.createElement(
																List.ItemInner,
																null,
																React.createElement(
																				List.ItemTitle,
																				null,
																				this.props.children
																)
												)
								);
				}
});

module.exports = React.createClass({
				displayName: 'exports',

				componentDidMount: function componentDidMount() {
								var container = $(this.refs.searchbar.getDOMNode());
								var params = {
												searchList: $(this.refs.searchlist.getDOMNode()).find('.searchbar-found')
								};
								this.searchbar = UI.Search.Search.Searchbar(container, params);
				},
				componentWillUnmount: function componentWillUnmount() {
								this.searchbar.destroy();
				},
				render: function render() {
								return React.createElement(
												View.Page,
												{ title: 'Search' },
												React.createElement(UI.Search.Search, { ref: 'searchbar' }),
												React.createElement(UI.Search.SearchOverlay, null),
												React.createElement(
																View.PageContent,
																null,
																React.createElement(
																				UI.Search.SearchList,
																				{ ref: 'searchlist' },
																				persons.map(function (person, i) {
																								return React.createElement(
																												ListItem,
																												{ key: i },
																												person
																								);
																				})
																)
												)
								);
				}
});

},{"UI":51,"react":undefined}],23:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;

var ListItem = React.createClass({
  displayName: 'ListItem',

  render: function render() {
    return React.createElement(
      List.ItemContent,
      { sortable: true },
      React.createElement(
        List.ItemMedia,
        null,
        React.createElement(Icon, { name: 'icon-f7' })
      ),
      React.createElement(
        List.ItemInner,
        null,
        React.createElement(
          List.ItemTitle,
          null,
          'Item ',
          this.props.value
        ),
        React.createElement(
          List.ItemAfter,
          null,
          React.createElement(
            Badge,
            null,
            this.props.value
          )
        )
      )
    );
  }
});

module.exports = React.createClass({
  displayName: 'exports',

  getInitialState: function getInitialState() {
    return {
      open: false
    };
  },
  handleClick: function handleClick() {
    this.refs.list.sortable.toggle();
    this.setState({ open: !this.state.open });
  },
  render: function render() {
    var text = this.state.open ? "Done" : "Edit";
    return React.createElement(
      View.Page,
      { title: 'Sortable List', right: React.createElement(
          View.NavbarButton,
          { right: true, iconOnly: true, onTap: this.handleClick },
          text
        ) },
      React.createElement(
        View.PageContent,
        null,
        React.createElement(
          Content.ContentBlock,
          null,
          React.createElement(
            'p',
            null,
            'Just click "Edit" button on navigation bar to enable sorting'
          )
        ),
        React.createElement(
          List.List,
          { block: true, sortable: true, ref: 'list' },
          [1, 2, 3, 4, 5].map(function (item) {
            return React.createElement(ListItem, { value: item });
          })
        )
      )
    );
  }
});

},{"UI":51,"react":undefined}],24:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Button = UI.Button;
var Form = UI.Form;

module.exports = React.createClass({
    displayName: 'exports',

    getInitialState: function getInitialState() {
        return {
            link: 1
        };
    },
    switchLink: function switchLink(link) {
        this.setState({ link: link });
    },
    render: function render() {
        return React.createElement(
            View.Page,
            { navbar: true, title: 'SubNavbar Hide On Scroll', scrollHideBar: true },
            React.createElement(
                View.Navbar,
                null,
                React.createElement(
                    View.NavbarTitle,
                    null,
                    'List'
                ),
                React.createElement(
                    View.SubNavbar,
                    null,
                    React.createElement(
                        Button.ButtonsRow,
                        null,
                        React.createElement(
                            Button.Button,
                            { active: this.state.link === 1, onTap: this.switchLink.bind(this, 1) },
                            'Link 1'
                        ),
                        React.createElement(
                            Button.Button,
                            { active: this.state.link === 2, onTap: this.switchLink.bind(this, 2) },
                            'Link 2'
                        ),
                        React.createElement(
                            Button.Button,
                            { active: this.state.link === 3, onTap: this.switchLink.bind(this, 3) },
                            'Link 3'
                        ),
                        React.createElement(
                            Button.Button,
                            { active: this.state.link === 4, onTap: this.switchLink.bind(this, 4) },
                            'Link 4'
                        )
                    )
                )
            ),
            React.createElement(
                View.PageContent,
                { subnavbar: true, scrollHideBar: true },
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        'p',
                        null,
                        'Sub Navbar is useful when you need to put any additional elements into Navbar, like Tab Links or Search Bar. It also remains visible when Navbar hidden.'
                    )
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        'p',
                        null,
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse at luctus dui. Praesent venenatis libero orci, in scelerisque enim tincidunt eget. Pellentesque id odio id enim consectetur condimentum. Maecenas dapibus tempus diam. Suspendisse cursus, est ut feugiat tempus, lectus odio aliquam dui, non suscipit lectus sapien vitae velit. Vestibulum tempus faucibus massa, et rutrum odio luctus finibus. Praesent aliquet accumsan magna, quis ornare elit scelerisque sit amet. Mauris commodo varius velit dictum dictum. Sed non sapien urna. Nunc porta vitae massa nec rutrum. Praesent et porttitor tortor, vitae tristique nibh. Morbi sed tempor tellus, sit amet pharetra ante. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis porta feugiat nisl sed blandit.'
                    ),
                    React.createElement(
                        'p',
                        null,
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse at luctus dui. Praesent venenatis libero orci, in scelerisque enim tincidunt eget. Pellentesque id odio id enim consectetur condimentum. Maecenas dapibus tempus diam. Suspendisse cursus, est ut feugiat tempus, lectus odio aliquam dui, non suscipit lectus sapien vitae velit. Vestibulum tempus faucibus massa, et rutrum odio luctus finibus. Praesent aliquet accumsan magna, quis ornare elit scelerisque sit amet. Mauris commodo varius velit dictum dictum. Sed non sapien urna. Nunc porta vitae massa nec rutrum. Praesent et porttitor tortor, vitae tristique nibh. Morbi sed tempor tellus, sit amet pharetra ante. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis porta feugiat nisl sed blandit.'
                    ),
                    React.createElement(
                        'p',
                        null,
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse at luctus dui. Praesent venenatis libero orci, in scelerisque enim tincidunt eget. Pellentesque id odio id enim consectetur condimentum. Maecenas dapibus tempus diam. Suspendisse cursus, est ut feugiat tempus, lectus odio aliquam dui, non suscipit lectus sapien vitae velit. Vestibulum tempus faucibus massa, et rutrum odio luctus finibus. Praesent aliquet accumsan magna, quis ornare elit scelerisque sit amet. Mauris commodo varius velit dictum dictum. Sed non sapien urna. Nunc porta vitae massa nec rutrum. Praesent et porttitor tortor, vitae tristique nibh. Morbi sed tempor tellus, sit amet pharetra ante. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis porta feugiat nisl sed blandit.'
                    ),
                    React.createElement(
                        'p',
                        null,
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse at luctus dui. Praesent venenatis libero orci, in scelerisque enim tincidunt eget. Pellentesque id odio id enim consectetur condimentum. Maecenas dapibus tempus diam. Suspendisse cursus, est ut feugiat tempus, lectus odio aliquam dui, non suscipit lectus sapien vitae velit. Vestibulum tempus faucibus massa, et rutrum odio luctus finibus. Praesent aliquet accumsan magna, quis ornare elit scelerisque sit amet. Mauris commodo varius velit dictum dictum. Sed non sapien urna. Nunc porta vitae massa nec rutrum. Praesent et porttitor tortor, vitae tristique nibh. Morbi sed tempor tellus, sit amet pharetra ante. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis porta feugiat nisl sed blandit.'
                    ),
                    React.createElement(
                        'p',
                        null,
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse at luctus dui. Praesent venenatis libero orci, in scelerisque enim tincidunt eget. Pellentesque id odio id enim consectetur condimentum. Maecenas dapibus tempus diam. Suspendisse cursus, est ut feugiat tempus, lectus odio aliquam dui, non suscipit lectus sapien vitae velit. Vestibulum tempus faucibus massa, et rutrum odio luctus finibus. Praesent aliquet accumsan magna, quis ornare elit scelerisque sit amet. Mauris commodo varius velit dictum dictum. Sed non sapien urna. Nunc porta vitae massa nec rutrum. Praesent et porttitor tortor, vitae tristique nibh. Morbi sed tempor tellus, sit amet pharetra ante. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis porta feugiat nisl sed blandit.'
                    ),
                    React.createElement(
                        'p',
                        null,
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse at luctus dui. Praesent venenatis libero orci, in scelerisque enim tincidunt eget. Pellentesque id odio id enim consectetur condimentum. Maecenas dapibus tempus diam. Suspendisse cursus, est ut feugiat tempus, lectus odio aliquam dui, non suscipit lectus sapien vitae velit. Vestibulum tempus faucibus massa, et rutrum odio luctus finibus. Praesent aliquet accumsan magna, quis ornare elit scelerisque sit amet. Mauris commodo varius velit dictum dictum. Sed non sapien urna. Nunc porta vitae massa nec rutrum. Praesent et porttitor tortor, vitae tristique nibh. Morbi sed tempor tellus, sit amet pharetra ante. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis porta feugiat nisl sed blandit.'
                    ),
                    React.createElement(
                        'p',
                        null,
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse at luctus dui. Praesent venenatis libero orci, in scelerisque enim tincidunt eget. Pellentesque id odio id enim consectetur condimentum. Maecenas dapibus tempus diam. Suspendisse cursus, est ut feugiat tempus, lectus odio aliquam dui, non suscipit lectus sapien vitae velit. Vestibulum tempus faucibus massa, et rutrum odio luctus finibus. Praesent aliquet accumsan magna, quis ornare elit scelerisque sit amet. Mauris commodo varius velit dictum dictum. Sed non sapien urna. Nunc porta vitae massa nec rutrum. Praesent et porttitor tortor, vitae tristique nibh. Morbi sed tempor tellus, sit amet pharetra ante. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis porta feugiat nisl sed blandit.'
                    ),
                    React.createElement(
                        'p',
                        null,
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse at luctus dui. Praesent venenatis libero orci, in scelerisque enim tincidunt eget. Pellentesque id odio id enim consectetur condimentum. Maecenas dapibus tempus diam. Suspendisse cursus, est ut feugiat tempus, lectus odio aliquam dui, non suscipit lectus sapien vitae velit. Vestibulum tempus faucibus massa, et rutrum odio luctus finibus. Praesent aliquet accumsan magna, quis ornare elit scelerisque sit amet. Mauris commodo varius velit dictum dictum. Sed non sapien urna. Nunc porta vitae massa nec rutrum. Praesent et porttitor tortor, vitae tristique nibh. Morbi sed tempor tellus, sit amet pharetra ante. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis porta feugiat nisl sed blandit.'
                    )
                )
            ),
            React.createElement(
                View.Toolbar,
                { tabbar: true, labels: true },
                React.createElement(
                    View.ToolbarButton,
                    { active: true,
                        icon: ["icon-camera", "icon-back"] },
                    'Edit'
                )
            )
        );
    }
});

},{"UI":51,"react":undefined}],25:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;

module.exports = React.createClass({
    displayName: 'exports',

    deleteItem: function deleteItem(e) {
        var clicked = $(e.target);
        this.refs.list.swipeout['delete'](clicked.parents('.swipeout'));
    },
    render: function render() {
        return React.createElement(
            View.Page,
            { title: 'Swipe Delete' },
            React.createElement(
                View.PageContent,
                null,
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        'p',
                        null,
                        'Swipe out actions on list elements is one of the most awesome F7 features. It allows you to call hidden menu for each list element where you can put default ready-to use delete button or any other buttons for some required actions. '
                    )
                ),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Swipe to delete with confirm modal'
                ),
                React.createElement(
                    List.List,
                    { block: true, swipeout: true, ref: 'list' },
                    React.createElement(
                        List.ItemContent,
                        { swipeout: true,
                            swipeoutRight: React.createElement(
                                'a',
                                { className: 'swipeout-delete', onClick: this.deleteItem },
                                'Delete'
                            )
                        },
                        React.createElement(
                            List.ItemMedia,
                            null,
                            React.createElement(Icon, { name: 'icon-f7' })
                        ),
                        React.createElement(
                            List.ItemInner,
                            null,
                            React.createElement(
                                List.ItemTitle,
                                null,
                                'Ivan Petrov'
                            ),
                            React.createElement(
                                List.ItemAfter,
                                null,
                                'CEO'
                            )
                        )
                    ),
                    React.createElement(
                        List.ItemContent,
                        { swipeout: true,
                            swipeoutLeft: React.createElement(
                                'a',
                                { className: 'bg-green swipeout-overswipe' },
                                'Reply'
                            ),
                            swipeoutRight: React.createElement(
                                'a',
                                { className: 'swipeout-delete', onClick: this.deleteItem },
                                'Delete'
                            )
                        },
                        React.createElement(
                            List.ItemMedia,
                            null,
                            React.createElement(Icon, { name: 'icon-f7' })
                        ),
                        React.createElement(
                            List.ItemInner,
                            null,
                            React.createElement(
                                List.ItemTitle,
                                null,
                                'John Doe'
                            ),
                            React.createElement(
                                List.ItemAfter,
                                null,
                                React.createElement(
                                    Badge,
                                    null,
                                    '5'
                                )
                            )
                        )
                    ),
                    React.createElement(
                        List.ItemContent,
                        { swipeout: true,
                            swipeoutLeft: [React.createElement(
                                'a',
                                { className: 'bg-green swipeout-overswipe' },
                                'Reply'
                            ), React.createElement(
                                'a',
                                { className: 'bg-blue' },
                                'Forword'
                            )],
                            swipeoutRight: [React.createElement(
                                'a',
                                null,
                                'More'
                            ), React.createElement(
                                'a',
                                { className: 'bg-orange' },
                                'More'
                            ), React.createElement(
                                'a',
                                { className: 'swipeout-delete swipeout-overswipe', onClick: this.deleteItem },
                                'Delete'
                            )]
                        },
                        React.createElement(
                            List.ItemMedia,
                            null,
                            React.createElement(Icon, { name: 'icon-f7' })
                        ),
                        React.createElement(
                            List.ItemInner,
                            null,
                            React.createElement(
                                List.ItemTitle,
                                null,
                                'Jenna Smith'
                            )
                        )
                    )
                )
            )
        );
    }
});
/*swipeout-overswipe will be pull to overswipe*/

},{"UI":51,"react":undefined}],26:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Grid = UI.Grid;
var Button = UI.Button.Button;
var ButtonsRow = UI.Button.ButtonsRow;

var Tab1 = React.createClass({
	displayName: 'Tab1',

	render: function render() {
		return React.createElement(
			Content.ContentBlock,
			null,
			React.createElement(
				'p',
				null,
				'This is tab 1 content'
			),
			React.createElement(
				'p',
				null,
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum mi quis felis scelerisque faucibus. Aliquam ut commodo justo. Mauris vitae pharetra arcu. Sed tincidunt dui et nibh auctor pretium. Nam accumsan fermentum sem. Suspendisse potenti. Nulla sed orci malesuada, pellentesque elit vitae, cursus lorem. Praesent et vehicula sapien, ut rhoncus quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vitae mi nec lorem aliquet venenatis quis nec nibh. Aenean sit amet leo ligula. Fusce in massa et nisl dictum ultricies et vitae dui. Sed sagittis quis diam sed lobortis. Donec in massa pharetra, tristique purus vitae, consequat mauris. Aliquam tellus ante, pharetra in mattis ut, dictum quis erat.'
			),
			React.createElement(
				'p',
				null,
				'Ut ac lobortis lacus, non pellentesque arcu. Quisque sodales sapien malesuada, condimentum nunc at, viverra lacus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus eu pulvinar turpis, id tristique quam. Aenean venenatis molestie diam, sit amet condimentum nisl pretium id. Donec diam tortor, mollis in vehicula id, vehicula consectetur nulla. Quisque posuere rutrum mauris, eu rutrum turpis blandit at. Proin volutpat tortor sit amet metus porttitor accumsan. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut dapibus posuere dictum.'
			)
		);
	}
});

var Tab2 = React.createClass({
	displayName: 'Tab2',

	render: function render() {
		return React.createElement(
			Content.ContentBlock,
			null,
			React.createElement(
				'p',
				null,
				'This is tab 2 content'
			),
			React.createElement(
				'p',
				null,
				'Ut ac lobortis lacus, non pellentesque arcu. Quisque sodales sapien malesuada, condimentum nunc at, viverra lacus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus eu pulvinar turpis, id tristique quam. Aenean venenatis molestie diam, sit amet condimentum nisl pretium id. Donec diam tortor, mollis in vehicula id, vehicula consectetur nulla. Quisque posuere rutrum mauris, eu rutrum turpis blandit at. Proin volutpat tortor sit amet metus porttitor accumsan. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut dapibus posuere dictum.'
			),
			React.createElement(
				'p',
				null,
				'Fusce luctus turpis nunc, id porta orci blandit eget. Aenean sodales quam nec diam varius, in ornare ipsum condimentum. Aenean eleifend, nulla sit amet volutpat adipiscing, ligula nulla pharetra risus, vitae consequat leo tortor eu nunc. Vivamus at fringilla metus. Duis neque lectus, sagittis in volutpat a, pretium vel turpis. Nam accumsan auctor libero, quis sodales felis faucibus quis. Etiam vestibulum sed nisl vel aliquet. Aliquam pellentesque leo a lacus ultricies scelerisque. Vestibulum vestibulum fermentum tincidunt. Proin eleifend metus non quam pretium, eu vehicula ipsum egestas. Nam eget nibh enim. Etiam sem leo, pellentesque a elit vel, egestas rhoncus enim. Morbi ultricies adipiscing tortor, vitae condimentum lacus hendrerit nec. Phasellus laoreet leo quis purus elementum, ut fringilla justo eleifend. Nunc ultricies a sapien vitae auctor. Aliquam id erat elementum, laoreet est et, dapibus ligula.'
			)
		);
	}
});

var Tab3 = React.createClass({
	displayName: 'Tab3',

	render: function render() {
		return React.createElement(
			Content.ContentBlock,
			null,
			React.createElement(
				'p',
				null,
				'This is tab 3 content'
			),
			React.createElement(
				'p',
				null,
				'Nulla gravida libero eget lobortis iaculis. In sed elit eu nibh adipiscing faucibus. Sed ac accumsan lacus. In ut diam quis turpis fringilla volutpat. In ultrices dignissim consequat. Cras pretium tortor et lorem condimentum posuere. Nulla facilisi. Suspendisse pretium egestas lacus ac laoreet. Mauris rhoncus quis ipsum quis tristique. Vivamus ultricies urna quis nunc egestas, in euismod turpis fringilla. Nam tellus massa, vehicula eu sapien non, dapibus tempor lorem. Fusce placerat orci arcu, eu dignissim enim porttitor vel. Nullam porttitor vel dolor sed feugiat. Suspendisse potenti. Maecenas ac mattis odio. Sed vel ultricies lacus, sed posuere libero.'
			),
			React.createElement(
				'p',
				null,
				'Nulla gravida libero eget lobortis iaculis. In sed elit eu nibh adipiscing faucibus. Sed ac accumsan lacus. In ut diam quis turpis fringilla volutpat. In ultrices dignissim consequat. Cras pretium tortor et lorem condimentum posuere. Nulla facilisi. Suspendisse pretium egestas lacus ac laoreet. Mauris rhoncus quis ipsum quis tristique. Vivamus ultricies urna quis nunc egestas, in euismod turpis fringilla. Nam tellus massa, vehicula eu sapien non, dapibus tempor lorem. Fusce placerat orci arcu, eu dignissim enim porttitor vel. Nullam porttitor vel dolor sed feugiat. Suspendisse potenti. Maecenas ac mattis odio. Sed vel ultricies lacus, sed posuere libero.'
			)
		);
	}
});

module.exports = React.createClass({
	displayName: 'exports',

	getInitialState: function getInitialState() {
		return {
			tab: 0
		};
	},
	getDefaultProps: function getDefaultProps() {
		return { tabs: [Tab1, Tab2, Tab3] };
	},
	switchTab: function switchTab(tab) {
		this.setState({ tab: tab });
	},
	render: function render() {
		var tabs = React.createElement(
			ButtonsRow,
			null,
			React.createElement(
				Button,
				{ active: this.state.tab === 0, onTap: this.switchTab.bind(this, 0) },
				'Tab 1'
			),
			React.createElement(
				Button,
				{ active: this.state.tab === 1, onTap: this.switchTab.bind(this, 1) },
				'Tab 2'
			),
			React.createElement(
				Button,
				{ active: this.state.tab === 2, onTap: this.switchTab.bind(this, 2) },
				'Tab 3'
			)
		);
		return React.createElement(
			View.Page,
			{ title: tabs },
			React.createElement(
				View.PageContent,
				null,
				React.createElement(this.props.tabs[this.state.tab])
			)
		);
	}
});

},{"UI":51,"react":undefined}],27:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Card = UI.Card;
var List = UI.List;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Button = UI.Button.Button;

function showCenterToastWithIconText() {
    app.toast("fangyunjiang", "icon-f7");
}

function showCenterToastWithOnlyText() {
    app.toast("fangyunjiang");
}

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        return React.createElement(
            View.Page,
            { title: 'Toast' },
            React.createElement(
                View.PageContent,
                null,
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        'p',
                        null,
                        'Toast is a component for show a toast msg, you also can use phonegap\'s native toast'
                    )
                ),
                React.createElement(
                    'p',
                    null,
                    React.createElement(
                        Button,
                        { onTap: showCenterToastWithIconText },
                        'Center Toast With Icon And Text'
                    )
                ),
                React.createElement(
                    'p',
                    null,
                    React.createElement(
                        Button,
                        { onTap: showCenterToastWithOnlyText },
                        'Center Toast Only Text'
                    )
                )
            )
        );
    }
});

},{"UI":51,"react":undefined}],28:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');
var _ = require('underscore');

var Content = UI.Content;
var Grid = UI.Grid;
var List = UI.List;
var Button = UI.Button.Button;
var ButtonsRow = UI.Button.ButtonsRow;
var View = UI.View;
var Badge = UI.Badge.Badge;
var pages = require('./pages');

var IndexedList = React.createClass({
				displayName: 'IndexedList',

				getInitialState: function getInitialState() {
								return { letters: ['A', 'B', 'D', 'E', 'F', 'S', 'X', 'Y'].sort(function (a, b) {
																return a.localeCompare(b);
												}) };
				},
				render: function render() {
								return React.createElement(List.IndexedList, { letters: this.state.letters });
				}
});

module.exports = React.createClass({
				displayName: 'exports',

				mixins: [UI.Mixins.RestoreScrollPosition],
				getInitialState: function getInitialState() {
								return {
												page: app.data.homePageIndex || 0
								};
				},
				getDefaultProps: function getDefaultProps() {
								return { pages: [pages.Main, pages.Contacts, pages.Messages, pages.More] };
				},
				switchPage: function switchPage(page) {
								app.data.homePageIndex = page;
								this.setState({ page: page });
				},
				render: function render() {
								var CurrentPage = this.props.pages[this.state.page];
								return React.createElement(
												View.Page,
												{ toolbar: true },
												React.createElement(
																View.PageContent,
																null,
																React.createElement(CurrentPage, { data: this.props.data })
												),
												this.state.page === 1 && React.createElement(IndexedList, null),
												React.createElement(
																View.Toolbar,
																{ tabbar: true, labels: true },
																React.createElement(
																				View.ToolbarButton,
																				{ active: this.state.page === 0,
																								icon: 'ion-social-windows-outline',
																								onTap: this.switchPage.bind(this, 0) },
																				'Home'
																),
																React.createElement(
																				View.ToolbarButton,
																				{ active: this.state.page === 1,
																								icon: 'ion-android-contacts',
																								onTap: this.switchPage.bind(this, 1) },
																				'Contacts'
																),
																React.createElement(
																				View.ToolbarButton,
																				{ active: this.state.page === 2,
																								icon: 'ion-chatbubble-working',
																								badge: React.createElement(
																												Badge,
																												{ color: 'red' },
																												'9'
																								),
																								onTap: this.switchPage.bind(this, 2) },
																				'Messages'
																),
																React.createElement(
																				View.ToolbarButton,
																				{ active: this.state.page === 3,
																								icon: 'ion-settings',
																								onTap: this.switchPage.bind(this, 3) },
																				'More'
																)
												)
								);
				}
});

},{"./pages":30,"UI":51,"react":undefined,"underscore":54}],29:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Grid = UI.Grid;
var List = UI.List;
var Button = UI.Button.Button;
var ButtonsRow = UI.Button.ButtonsRow;

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        return React.createElement(
            View.Page,
            { title: 'Button', right: React.createElement(
                    View.NavbarButton,
                    { icon: 'icon-bars', right: true },
                    '确定'
                ) },
            React.createElement(
                View.PageContent,
                null,
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Usual Buttons'
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        Grid.Row,
                        null,
                        React.createElement(
                            Grid.Col,
                            { per: 33 },
                            React.createElement(
                                Button,
                                { active: true, onTap: alert },
                                'Active'
                            )
                        ),
                        React.createElement(
                            Grid.Col,
                            { per: 33 },
                            React.createElement(
                                Button,
                                null,
                                'Button'
                            )
                        ),
                        React.createElement(
                            Grid.Col,
                            { per: 33 },
                            React.createElement(
                                Button,
                                { round: true },
                                'Round'
                            )
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        Grid.Row,
                        null,
                        React.createElement(
                            Grid.Col,
                            { per: 50 },
                            React.createElement(
                                Button,
                                { active: true },
                                'Active'
                            )
                        ),
                        React.createElement(
                            Grid.Col,
                            { per: 50 },
                            React.createElement(
                                Button,
                                { round: true },
                                'Round'
                            )
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        ButtonsRow,
                        null,
                        React.createElement(
                            Button,
                            { active: true },
                            'Active'
                        ),
                        React.createElement(
                            Button,
                            { round: true },
                            'Round'
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        ButtonsRow,
                        null,
                        React.createElement(
                            Button,
                            { round: true },
                            'Round'
                        ),
                        React.createElement(
                            Button,
                            { round: true },
                            'Round'
                        ),
                        React.createElement(
                            Button,
                            { round: true },
                            'Round'
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        ButtonsRow,
                        null,
                        React.createElement(
                            Button,
                            { round: true },
                            'Round'
                        ),
                        React.createElement(
                            Button,
                            { active: true },
                            'Active'
                        ),
                        React.createElement(
                            Button,
                            { round: true },
                            'Round'
                        ),
                        React.createElement(
                            Button,
                            { round: true },
                            'Round'
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Big Buttons'
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        Grid.Row,
                        null,
                        React.createElement(
                            Grid.Col,
                            { per: 50 },
                            React.createElement(
                                Button,
                                { big: true, active: true },
                                'Active'
                            )
                        ),
                        React.createElement(
                            Grid.Col,
                            { per: 50 },
                            React.createElement(
                                Button,
                                { big: true, round: true },
                                'Round'
                            )
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Themed Fill Buttons'
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        Grid.Row,
                        null,
                        React.createElement(
                            Grid.Col,
                            { per: 50 },
                            React.createElement(
                                Button,
                                { big: true, fill: true, color: 'green' },
                                'Submit'
                            )
                        ),
                        React.createElement(
                            Grid.Col,
                            { per: 50 },
                            React.createElement(
                                Button,
                                { big: true, fill: true, color: 'red' },
                                'Cancel'
                            )
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'List-Block Buttons'
                ),
                React.createElement(
                    List.List,
                    { block: true, inset: true },
                    React.createElement(
                        'li',
                        null,
                        React.createElement(
                            Button,
                            { list: true },
                            'List Button 1'
                        )
                    ),
                    React.createElement(
                        'li',
                        null,
                        React.createElement(
                            Button,
                            { list: true },
                            'List Button 2'
                        )
                    ),
                    React.createElement(
                        'li',
                        null,
                        React.createElement(
                            Button,
                            { list: true },
                            'List Button 3'
                        )
                    )
                ),
                React.createElement(
                    List.List,
                    { block: true, inset: true },
                    React.createElement(
                        'li',
                        null,
                        React.createElement(
                            Button,
                            { list: true, color: 'red' },
                            'List Button 1'
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        'p',
                        null,
                        'this is inline round ',
                        React.createElement(
                            Button,
                            { inline: true, round: true },
                            'Round'
                        ),
                        ' or inline ',
                        React.createElement(
                            Button,
                            { inline: true },
                            'Button'
                        )
                    ),
                    React.createElement(
                        'p',
                        null,
                        'this is inline fill ',
                        React.createElement(
                            Button,
                            { inline: true, fill: true },
                            'Round'
                        ),
                        ' or color ',
                        React.createElement(
                            Button,
                            { inline: true, fill: true, color: 'red' },
                            'Button'
                        )
                    )
                )
            )
        );
    }
});

},{"UI":51,"react":undefined}],30:[function(require,module,exports){
'use strict';

module.exports = {
	Contacts: require('./contacts'),
	Main: require('./main'),
	Messages: require('./messages'),
	More: require('./more')
};

},{"./contacts":29,"./main":31,"./messages":32,"./more":33}],31:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');
var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;
var View = UI.View;

function getImages() {
    var arr = [];
    for (var i = 1; i < 10; i++) {
        arr.push({
            url: 'img/app/photo/' + i + '.jpg',
            caption: 'chinese star picture index ' + i
        });
    }
    return arr;
}

function showPhoto() {
    var photo = UI.Photo.Photo({
        photos: getImages(),
        lazyLoading: true,
        theme: 'dark'
    });
    photo.open();
}

var ListItem = React.createClass({
    displayName: 'ListItem',

    showPage: function showPage(page) {
        app.state.panelVisible = false;
        if (page === 'photo') {
            showPhoto();
        } else {
            app.showView(page, 'left');
        }
    },
    render: function render() {
        return React.createElement(
            List.ItemContent,
            { link: true, onTap: this.showPage.bind(this, this.props.page) },
            React.createElement(
                List.ItemMedia,
                null,
                React.createElement(Icon, { name: 'icon-f7' })
            ),
            React.createElement(
                List.ItemInner,
                null,
                React.createElement(
                    List.ItemTitle,
                    null,
                    this.props.children
                )
            )
        );
    }
});

var MenuList = React.createClass({
    displayName: 'MenuList',

    render: function render() {
        return React.createElement(
            List.List,
            { block: true },
            React.createElement(
                ListItem,
                { page: 'button' },
                'Button'
            ),
            React.createElement(
                ListItem,
                { page: 'toast' },
                'Toast'
            ),
            React.createElement(
                ListItem,
                { page: 'sortableList' },
                'Sortable List'
            ),
            React.createElement(
                ListItem,
                { page: 'barsHideOnScroll' },
                'Bars Hide On Scroll'
            ),
            React.createElement(
                ListItem,
                { page: 'subbarsHideOnScroll' },
                'SubNavbar Hide On Scroll'
            ),
            React.createElement(
                ListItem,
                { page: 'swipeDelete' },
                'Swipe Delete'
            ),
            React.createElement(
                ListItem,
                { page: 'pullToRefresh' },
                'Pull To Refresh'
            ),
            React.createElement(
                ListItem,
                { page: 'infiniteScroll' },
                'Infinite Scroll'
            ),
            React.createElement(
                ListItem,
                { page: 'accordion' },
                'Accordion'
            ),
            React.createElement(
                ListItem,
                { page: 'search' },
                'Search Bar'
            ),
            React.createElement(
                ListItem,
                { page: 'cards' },
                'Cards'
            ),
            React.createElement(
                ListItem,
                { page: 'panels' },
                'Slide Panels'
            ),
            React.createElement(
                ListItem,
                { page: 'swiper' },
                'Swiper Slider'
            ),
            React.createElement(
                ListItem,
                { page: 'notifications' },
                'Notifications'
            ),
            React.createElement(
                ListItem,
                { page: 'list' },
                'List'
            ),
            React.createElement(
                ListItem,
                { page: 'medialist' },
                'Media List'
            ),
            React.createElement(
                ListItem,
                { page: 'photo' },
                'Photo Browser'
            ),
            React.createElement(
                ListItem,
                { page: 'grid' },
                'Grid'
            ),
            React.createElement(
                ListItem,
                { page: 'radioCheckBox' },
                'Radio And Checkbox'
            ),
            React.createElement(
                ListItem,
                { page: 'form' },
                'Form'
            ),
            React.createElement(
                ListItem,
                { page: 'picker' },
                'Picker'
            ),
            React.createElement(
                ListItem,
                { page: 'pickerEx' },
                'Picker2'
            ),
            React.createElement(
                ListItem,
                { page: 'popover' },
                'Popover'
            ),
            React.createElement(
                ListItem,
                { page: 'modals' },
                'Modals'
            ),
            React.createElement(
                ListItem,
                { page: 'calendar' },
                'Calendar'
            ),
            React.createElement(
                ListItem,
                { page: 'preloader' },
                'Preloader'
            ),
            React.createElement(
                ListItem,
                { page: 'tabs' },
                'Tabs'
            ),
            React.createElement(
                ListItem,
                { page: 'icons' },
                'Icons'
            )
        );
    }
});

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                Content.ContentBlockTitle,
                null,
                'React-mobile Kitchen Sink'
            ),
            React.createElement(MenuList, null)
        );
    }
});
module.exports.MenuList = MenuList;

},{"UI":51,"react":undefined}],32:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Grid = UI.Grid;
var List = UI.List;
var Button = UI.Button.Button;
var ButtonsRow = UI.Button.ButtonsRow;

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        return React.createElement(
            View.Page,
            { title: 'Button', right: React.createElement(
                    View.NavbarButton,
                    { icon: 'icon-bars', right: true },
                    '确定'
                ) },
            React.createElement(
                View.PageContent,
                null,
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Usual Buttons'
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        Grid.Row,
                        null,
                        React.createElement(
                            Grid.Col,
                            { per: 33 },
                            React.createElement(
                                Button,
                                { active: true, onTap: alert },
                                'Active'
                            )
                        ),
                        React.createElement(
                            Grid.Col,
                            { per: 33 },
                            React.createElement(
                                Button,
                                null,
                                'Button'
                            )
                        ),
                        React.createElement(
                            Grid.Col,
                            { per: 33 },
                            React.createElement(
                                Button,
                                { round: true },
                                'Round'
                            )
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        Grid.Row,
                        null,
                        React.createElement(
                            Grid.Col,
                            { per: 50 },
                            React.createElement(
                                Button,
                                { active: true },
                                'Active'
                            )
                        ),
                        React.createElement(
                            Grid.Col,
                            { per: 50 },
                            React.createElement(
                                Button,
                                { round: true },
                                'Round'
                            )
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        ButtonsRow,
                        null,
                        React.createElement(
                            Button,
                            { active: true },
                            'Active'
                        ),
                        React.createElement(
                            Button,
                            { round: true },
                            'Round'
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        ButtonsRow,
                        null,
                        React.createElement(
                            Button,
                            { round: true },
                            'Round'
                        ),
                        React.createElement(
                            Button,
                            { round: true },
                            'Round'
                        ),
                        React.createElement(
                            Button,
                            { round: true },
                            'Round'
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        ButtonsRow,
                        null,
                        React.createElement(
                            Button,
                            { round: true },
                            'Round'
                        ),
                        React.createElement(
                            Button,
                            { active: true },
                            'Active'
                        ),
                        React.createElement(
                            Button,
                            { round: true },
                            'Round'
                        ),
                        React.createElement(
                            Button,
                            { round: true },
                            'Round'
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Big Buttons'
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        Grid.Row,
                        null,
                        React.createElement(
                            Grid.Col,
                            { per: 50 },
                            React.createElement(
                                Button,
                                { big: true, active: true },
                                'Active'
                            )
                        ),
                        React.createElement(
                            Grid.Col,
                            { per: 50 },
                            React.createElement(
                                Button,
                                { big: true, round: true },
                                'Round'
                            )
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Themed Fill Buttons'
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        Grid.Row,
                        null,
                        React.createElement(
                            Grid.Col,
                            { per: 50 },
                            React.createElement(
                                Button,
                                { big: true, fill: true, color: 'green' },
                                'Submit'
                            )
                        ),
                        React.createElement(
                            Grid.Col,
                            { per: 50 },
                            React.createElement(
                                Button,
                                { big: true, fill: true, color: 'red' },
                                'Cancel'
                            )
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'List-Block Buttons'
                ),
                React.createElement(
                    List.List,
                    { block: true, inset: true },
                    React.createElement(
                        'li',
                        null,
                        React.createElement(
                            Button,
                            { list: true },
                            'List Button 1'
                        )
                    ),
                    React.createElement(
                        'li',
                        null,
                        React.createElement(
                            Button,
                            { list: true },
                            'List Button 2'
                        )
                    ),
                    React.createElement(
                        'li',
                        null,
                        React.createElement(
                            Button,
                            { list: true },
                            'List Button 3'
                        )
                    )
                ),
                React.createElement(
                    List.List,
                    { block: true, inset: true },
                    React.createElement(
                        'li',
                        null,
                        React.createElement(
                            Button,
                            { list: true, color: 'red' },
                            'List Button 1'
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        'p',
                        null,
                        'this is inline round ',
                        React.createElement(
                            Button,
                            { inline: true, round: true },
                            'Round'
                        ),
                        ' or inline ',
                        React.createElement(
                            Button,
                            { inline: true },
                            'Button'
                        )
                    ),
                    React.createElement(
                        'p',
                        null,
                        'this is inline fill ',
                        React.createElement(
                            Button,
                            { inline: true, fill: true },
                            'Round'
                        ),
                        ' or color ',
                        React.createElement(
                            Button,
                            { inline: true, fill: true, color: 'red' },
                            'Button'
                        )
                    )
                )
            )
        );
    }
});

},{"UI":51,"react":undefined}],33:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');

var View = UI.View;
var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;

var List1 = React.createClass({
    displayName: 'List1',

    render: function render() {
        return React.createElement(
            List.List,
            { block: true, media: true },
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement('img', { src: 'http://lorempixel.com/160/160/people/1', width: '80' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitleRow,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Yellow Submarine'
                        ),
                        React.createElement(
                            List.ItemAfter,
                            null,
                            '$15'
                        )
                    ),
                    React.createElement(
                        List.ItemSubTitle,
                        null,
                        'Beatles'
                    ),
                    React.createElement(
                        List.ItemText,
                        null,
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.'
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement('img', { src: 'http://lorempixel.com/160/160/people/2', width: '80' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitleRow,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Don\'t Stop Me Now'
                        ),
                        React.createElement(
                            List.ItemAfter,
                            null,
                            '$22'
                        )
                    ),
                    React.createElement(
                        List.ItemSubTitle,
                        null,
                        'Queen'
                    ),
                    React.createElement(
                        List.ItemText,
                        null,
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.'
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement('img', { src: 'http://lorempixel.com/160/160/people/3', width: '80' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitleRow,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Billie Jean'
                        ),
                        React.createElement(
                            List.ItemAfter,
                            null,
                            '$16'
                        )
                    ),
                    React.createElement(
                        List.ItemSubTitle,
                        null,
                        'Michael Jackson'
                    ),
                    React.createElement(
                        List.ItemText,
                        null,
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.'
                    )
                )
            )
        );
    }
});

var List2 = React.createClass({
    displayName: 'List2',

    render: function render() {
        return React.createElement(
            List.List,
            { block: true, media: true },
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitleRow,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Facebook'
                        ),
                        React.createElement(
                            List.ItemAfter,
                            null,
                            '17:14'
                        )
                    ),
                    React.createElement(
                        List.ItemSubTitle,
                        null,
                        'New messages from John Doe'
                    ),
                    React.createElement(
                        List.ItemText,
                        null,
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.'
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitleRow,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'John Doe (via Twitter)'
                        ),
                        React.createElement(
                            List.ItemAfter,
                            null,
                            '18:50'
                        )
                    ),
                    React.createElement(
                        List.ItemSubTitle,
                        null,
                        'John Doe (@_johndoe) mentioned you on Twitter!'
                    ),
                    React.createElement(
                        List.ItemText,
                        null,
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.'
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitleRow,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Facebook'
                        ),
                        React.createElement(
                            List.ItemAfter,
                            null,
                            '20:20'
                        )
                    ),
                    React.createElement(
                        List.ItemSubTitle,
                        null,
                        'New messages from John Do'
                    ),
                    React.createElement(
                        List.ItemText,
                        null,
                        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.'
                    )
                )
            )
        );
    }
});

var List3 = React.createClass({
    displayName: 'List3',

    render: function render() {
        return React.createElement(
            List.List,
            { block: true, media: true },
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement('img', { src: 'http://lorempixel.com/88/88/fashion/1', width: '44' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitleRow,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Yellow Submarine'
                        )
                    ),
                    React.createElement(
                        List.ItemSubTitle,
                        null,
                        'Beatles'
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement('img', { src: 'http://lorempixel.com/88/88/fashion/2', width: '44' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitleRow,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Don\'t Stop Me Now'
                        )
                    ),
                    React.createElement(
                        List.ItemSubTitle,
                        null,
                        'Queen'
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement('img', { src: 'http://lorempixel.com/88/88/fashion/3', width: '44' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitleRow,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Billie Jean'
                        )
                    ),
                    React.createElement(
                        List.ItemSubTitle,
                        null,
                        'Michael Jackson'
                    )
                )
            )
        );
    }
});

var List4 = React.createClass({
    displayName: 'List4',

    render: function render() {
        return React.createElement(
            List.List,
            { block: true, media: true, inset: true },
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement('img', { src: 'http://lorempixel.com/88/88/fashion/4', width: '44' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitleRow,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Yellow Submarine'
                        )
                    ),
                    React.createElement(
                        List.ItemSubTitle,
                        null,
                        'Beatles'
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement('img', { src: 'http://lorempixel.com/88/88/fashion/5', width: '44' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitleRow,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Don\'t Stop Me Now'
                        )
                    ),
                    React.createElement(
                        List.ItemSubTitle,
                        null,
                        'Queen'
                    )
                )
            ),
            React.createElement(
                List.ItemContent,
                { link: true },
                React.createElement(
                    List.ItemMedia,
                    null,
                    React.createElement('img', { src: 'http://lorempixel.com/88/88/fashion/6', width: '44' })
                ),
                React.createElement(
                    List.ItemInner,
                    null,
                    React.createElement(
                        List.ItemTitleRow,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Billie Jean'
                        )
                    ),
                    React.createElement(
                        List.ItemSubTitle,
                        null,
                        'Michael Jackson'
                    )
                )
            )
        );
    }
});

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        return React.createElement(
            View.Page,
            null,
            React.createElement(
                View.PageContent,
                null,
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        'p',
                        null,
                        'Media Lists are almost the same as Data Lists, but with a more flexible layout for visualization of mor complex data, like products, services, userc, etc. You can even use them in ',
                        React.createElement(
                            'a',
                            { href: '#', 'data-popover': '.popover-music', 'class': 'open-popover' },
                            'popovers'
                        )
                    )
                ),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Songs'
                ),
                React.createElement(List1, null),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Mail App (With Swipe to delete and overswipes)'
                ),
                React.createElement(List2, null),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Something more simple'
                ),
                React.createElement(List3, null),
                React.createElement(
                    Content.ContentBlockTitle,
                    null,
                    'Inset'
                ),
                React.createElement(List4, null)
            )
        );
    }
});

},{"UI":51,"react":undefined}],34:[function(require,module,exports){
'use strict';

var UI = require('UI');

module.exports = { showWelcome: function showWelcome() {
		var options = {
			'bgcolor': '#0da6ec',
			'fontcolor': '#fff',
			'onOpened': function onOpened() {
				console.log("welcome screen opened");
			},
			'onClosed': function onClosed() {
				console.log("welcome screen closed");
			}
		},
		    slides,
		    welcomescreen;

		slides = [{
			id: 'slide0',
			picture: '<div class="tutorialicon">♥</div>',
			text: 'Welcome to this tutorial. In the <a class="tutorial-next-link" href="#">next steps</a> we will guide you through a manual that will teach you how to use this app.'
		}, {
			id: 'slide1',
			picture: '<div class="tutorialicon">✲</div>',
			text: 'This is slide 2'
		}, {
			id: 'slide2',
			picture: '<div class="tutorialicon">♫</div>',
			text: 'This is slide 3'
		}, {
			id: 'slide3',
			picture: '<div class="tutorialicon">☆</div>',
			text: 'Thanks for reading! Enjoy this app or go to <a class="tutorial-previous-slide" href="#">previous slide</a>.<br><br><a class="tutorial-close-btn" href="#">Enter</a>'
		}];

		welcomescreen = UI.Welcome.WelcomeScreen(slides, options);

		$(document).on('click', '.tutorial-close-btn', function () {
			welcomescreen.close();
		});

		$('.tutorial-open-btn').click(function () {
			welcomescreen.open();
		});

		$(document).on('click', '.tutorial-next-link', function (e) {
			welcomescreen.next();
		});

		$(document).on('click', '.tutorial-previous-slide', function (e) {
			welcomescreen.previous();
		});
	} };

},{"UI":51}],35:[function(require,module,exports){
'use strict';

module.exports = {
	// app
	'home': require('./home/home'),
	'button': require('./common/button'),
	//list
	'list': require('./common/list'),
	'medialist': require('./common/mediaList'),
	'grid': require('./common/grid'),
	'radioCheckBox': require('./common/radioCheckBox'),
	'form': require('./common/form.js'),
	'picker': require('./common/picker.js'),
	'pickerEx': require('./common/pickerEx.js'),
	'popover': require('./common/popover.js'),
	'modals': require('./common/modals'),
	'preloader': require('./common/preloader'),
	'calendar': require('./common/calendar'),
	'tabs': require('./common/tabs'),
	'notifications': require('./common/notifications'),
	'panels': require('./common/panels'),
	'search': require('./common/search'),
	'cards': require('./common/cards'),
	'pullToRefresh': require('./common/pullToRefresh'),
	'infiniteScroll': require('./common/infiniteScroll'),
	'accordion': require('./common/accordion'),
	'toast': require('./common/toast'),
	'sortableList': require('./common/sortableList'),
	'swipeDelete': require('./common/swipeDelete'),
	'barsHideOnScroll': require('./common/barsHideOnScroll'),
	'subbarsHideOnScroll': require('./common/subbarsHideOnScroll'),
	//swiper
	'swiper': require('./swiper/swiper'),
	'swiperHorizontal': require('./swiper/swiperHorizontal'),
	'swiperVertical': require('./swiper/swiperVertical'),
	'swiperSpaceBetween': require('./swiper/swiperSpaceBetween'),
	'swiperMultiple': require('./swiper/swiperMultiple'),
	'swiperNested': require('./swiper/swiperNested'),
	'swiperLoop': require('./swiper/swiperLoop'),
	'swiper3dCube': require('./swiper/swiper3dCube'),
	'swiper3dCoverflow': require('./swiper/swiper3dCoverflow'),
	'swiperFade': require('./swiper/swiperFade'),
	'swiperScrollbar': require('./swiper/swiperScrollbar'),
	'swiperGallery': require('./swiper/swiperGallery'),
	'swiperCustom': require('./swiper/swiperCustom'),
	'swiperParallax': require('./swiper/swiperParallax'),
	'swiperLazy': require('./swiper/swiperLazy'),
	//icons
	'icons': require('./common/icons')
};

},{"./common/accordion":2,"./common/barsHideOnScroll":3,"./common/button":4,"./common/calendar":5,"./common/cards":6,"./common/form.js":7,"./common/grid":8,"./common/icons":9,"./common/infiniteScroll":10,"./common/list":11,"./common/mediaList":12,"./common/modals":13,"./common/notifications":14,"./common/panels":15,"./common/picker.js":16,"./common/pickerEx.js":17,"./common/popover.js":18,"./common/preloader":19,"./common/pullToRefresh":20,"./common/radioCheckBox":21,"./common/search":22,"./common/sortableList":23,"./common/subbarsHideOnScroll":24,"./common/swipeDelete":25,"./common/tabs":26,"./common/toast":27,"./home/home":28,"./swiper/swiper":36,"./swiper/swiper3dCoverflow":37,"./swiper/swiper3dCube":38,"./swiper/swiperCustom":39,"./swiper/swiperFade":40,"./swiper/swiperGallery":41,"./swiper/swiperHorizontal":42,"./swiper/swiperLazy":43,"./swiper/swiperLoop":44,"./swiper/swiperMultiple":45,"./swiper/swiperNested":46,"./swiper/swiperParallax":47,"./swiper/swiperScrollbar":48,"./swiper/swiperSpaceBetween":49,"./swiper/swiperVertical":50}],36:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');
var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;
var View = UI.View;

var ListItem = React.createClass({
    displayName: 'ListItem',

    showPage: function showPage(page) {
        app.showView(page, 'left');
    },
    render: function render() {
        return React.createElement(
            List.ItemContent,
            { link: true, onTap: this.showPage.bind(this, this.props.page) },
            React.createElement(
                List.ItemInner,
                null,
                React.createElement(
                    List.ItemTitle,
                    null,
                    this.props.children
                )
            )
        );
    }
});

var List1 = React.createClass({
    displayName: 'List1',

    render: function render() {
        return React.createElement(
            List.List,
            { block: true },
            React.createElement(
                ListItem,
                { page: 'swiperHorizontal' },
                'Swiper Horizontal'
            ),
            React.createElement(
                ListItem,
                { page: 'swiperVertical' },
                'Swiper Vertical'
            ),
            React.createElement(
                ListItem,
                { page: 'swiperSpaceBetween' },
                'Space Between Slides'
            ),
            React.createElement(
                ListItem,
                { page: 'swiperMultiple' },
                'Multiple Per Page'
            ),
            React.createElement(
                ListItem,
                { page: 'swiperNested' },
                'Nested Swipers'
            ),
            React.createElement(
                ListItem,
                { page: 'swiperLoop' },
                'Infinite Loop Mode'
            ),
            React.createElement(
                ListItem,
                { page: 'swiper3dCube' },
                '3D Cube Effect'
            ),
            React.createElement(
                ListItem,
                { page: 'swiper3dCoverflow' },
                '3D Coverflow Effect'
            ),
            React.createElement(
                ListItem,
                { page: 'swiperFade' },
                'Fade Effect'
            ),
            React.createElement(
                ListItem,
                { page: 'swiperScrollbar' },
                'With Scrollbar'
            ),
            React.createElement(
                ListItem,
                { page: 'swiperGallery' },
                'Two Way Control Gallery'
            ),
            React.createElement(
                ListItem,
                { page: 'swiperCustom' },
                'Custom Controls'
            ),
            React.createElement(
                ListItem,
                { page: 'swiperParallax' },
                'Parallax'
            ),
            React.createElement(
                ListItem,
                { page: 'swiperLazy' },
                'Lazy Loading'
            )
        );
    }
});

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        return React.createElement(
            View.Page,
            { title: 'Swiper' },
            React.createElement(
                View.PageContent,
                null,
                React.createElement(
                    Content.ContentBlock,
                    null,
                    React.createElement(
                        'p',
                        null,
                        'Framework7 comes with powerful and most modern touch slider ever - ',
                        React.createElement(
                            'a',
                            { href: 'http://idangero.us/sliders/swiper' },
                            'Swiper Slider'
                        ),
                        ' with super flexible configuration and lot, lot of features. Just check the following demos:'
                    )
                ),
                React.createElement(List1, null)
            )
        );
    }
});

},{"UI":51,"react":undefined}],37:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');
var swiper = UI.Mixins.Swiper.swiper;
var Content = UI.Content;
var View = UI.View;

function getImage(i) {
	return { backgroundImage: 'url(img/app/photo/' + i + '.jpg)' };
}

module.exports = React.createClass({
	displayName: 'exports',

	componentDidMount: function componentDidMount() {
		var params = {
			pagination: ".swiper-pagination",
			effect: "coverflow",
			slidesPerView: "auto",
			centeredSlides: true
		};
		this.props.slider = swiper(this.refs.swiper.getDOMNode(), params);
	},
	componentWillUnmount: function componentWillUnmount() {
		this.props.slider.destroy();
	},
	render: function render() {
		return React.createElement(
			View.Page,
			{ title: 'Swiper 3d Coverflow' },
			React.createElement(
				View.PageContent,
				null,
				React.createElement(
					'div',
					{ className: 'swiper-container ks-demo-slider ks-coverflow-slider', ref: 'swiper' },
					React.createElement('div', { className: 'swiper-pagination' }),
					React.createElement(
						'div',
						{ className: 'swiper-wrapper' },
						React.createElement(
							'div',
							{ style: getImage(1), className: 'swiper-slide' },
							'Slide 1'
						),
						React.createElement(
							'div',
							{ style: getImage(2), className: 'swiper-slide' },
							'Slide 2'
						),
						React.createElement(
							'div',
							{ style: getImage(3), className: 'swiper-slide' },
							'Slide 3'
						),
						React.createElement(
							'div',
							{ style: getImage(4), className: 'swiper-slide' },
							'Slide 4'
						),
						React.createElement(
							'div',
							{ style: getImage(5), className: 'swiper-slide' },
							'Slide 5'
						),
						React.createElement(
							'div',
							{ style: getImage(6), className: 'swiper-slide' },
							'Slide 6'
						),
						React.createElement(
							'div',
							{ style: getImage(7), className: 'swiper-slide' },
							'Slide 7'
						),
						React.createElement(
							'div',
							{ style: getImage(8), className: 'swiper-slide' },
							'Slide 8'
						),
						React.createElement(
							'div',
							{ style: getImage(9), className: 'swiper-slide' },
							'Slide 9'
						)
					)
				)
			)
		);
	}
});

},{"UI":51,"react":undefined}],38:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');
var swiper = UI.Mixins.Swiper.swiper;
var Content = UI.Content;
var View = UI.View;

function getImage(i) {
	return { backgroundImage: 'url(img/app/photo/' + i + '.jpg)' };
}

module.exports = React.createClass({
	displayName: 'exports',

	componentDidMount: function componentDidMount() {
		var params = {
			effect: "cube"
		};
		this.props.slider = swiper(this.refs.swiper.getDOMNode(), params);
	},
	componentWillUnmount: function componentWillUnmount() {
		this.props.slider.destroy();
	},
	render: function render() {
		return React.createElement(
			View.Page,
			{ title: 'Swiper 3d Cube' },
			React.createElement(
				View.PageContent,
				null,
				React.createElement(
					'div',
					{ className: 'swiper-container ks-demo-slider ks-cube-slider', ref: 'swiper' },
					React.createElement(
						'div',
						{ className: 'swiper-wrapper' },
						React.createElement(
							'div',
							{ style: getImage(1), className: 'swiper-slide' },
							'Slide 1'
						),
						React.createElement(
							'div',
							{ style: getImage(2), className: 'swiper-slide' },
							'Slide 2'
						),
						React.createElement(
							'div',
							{ style: getImage(3), className: 'swiper-slide' },
							'Slide 3'
						),
						React.createElement(
							'div',
							{ style: getImage(4), className: 'swiper-slide' },
							'Slide 4'
						),
						React.createElement(
							'div',
							{ style: getImage(5), className: 'swiper-slide' },
							'Slide 5'
						),
						React.createElement(
							'div',
							{ style: getImage(6), className: 'swiper-slide' },
							'Slide 6'
						),
						React.createElement(
							'div',
							{ style: getImage(7), className: 'swiper-slide' },
							'Slide 7'
						),
						React.createElement(
							'div',
							{ style: getImage(8), className: 'swiper-slide' },
							'Slide 8'
						),
						React.createElement(
							'div',
							{ style: getImage(9), className: 'swiper-slide' },
							'Slide 9'
						)
					)
				)
			)
		);
	}
});

},{"UI":51,"react":undefined}],39:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');
var swiper = UI.Mixins.Swiper.swiper;
var Content = UI.Content;
var View = UI.View;

function getImage(i) {
	return { backgroundImage: 'url(img/app/photo/' + i + '.jpg)' };
}

module.exports = React.createClass({
	displayName: 'exports',

	componentDidMount: function componentDidMount() {
		var params = {
			pagination: ".swiper-pagination",
			spaceBetween: 0,
			nextButton: ".swiper-button-next",
			prevButton: ".swiper-button-prev",
			paginationClickable: true
		};
		this.props.slider = swiper(this.refs.swiper.getDOMNode(), params);
	},
	componentWillUnmount: function componentWillUnmount() {
		this.props.slider.destroy();
	},
	render: function render() {
		return React.createElement(
			View.Page,
			{ title: 'Button' },
			React.createElement(
				View.PageContent,
				null,
				React.createElement(
					'div',
					{ className: 'ks-slider-custom' },
					React.createElement(
						'div',
						{ className: 'swiper-container', ref: 'swiper' },
						React.createElement('div', { className: 'swiper-pagination' }),
						React.createElement(
							'div',
							{ className: 'swiper-wrapper' },
							React.createElement('div', { style: getImage(1), className: 'swiper-slide' }),
							React.createElement('div', { style: getImage(2), className: 'swiper-slide' }),
							React.createElement('div', { style: getImage(3), className: 'swiper-slide' }),
							React.createElement('div', { style: getImage(4), className: 'swiper-slide' }),
							React.createElement('div', { style: getImage(5), className: 'swiper-slide' }),
							React.createElement('div', { style: getImage(6), className: 'swiper-slide' }),
							React.createElement('div', { style: getImage(7), className: 'swiper-slide' }),
							React.createElement('div', { style: getImage(8), className: 'swiper-slide' }),
							React.createElement('div', { style: getImage(9), className: 'swiper-slide' })
						),
						React.createElement('div', { className: 'swiper-button-prev' }),
						React.createElement('div', { className: 'swiper-button-next' })
					)
				)
			)
		);
	}
});

},{"UI":51,"react":undefined}],40:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');
var swiper = UI.Mixins.Swiper.swiper;
var Content = UI.Content;
var View = UI.View;

function getImage(i) {
	return { backgroundImage: 'url(img/app/photo/' + i + '.jpg)' };
}

module.exports = React.createClass({
	displayName: 'exports',

	componentDidMount: function componentDidMount() {
		var params = {
			pagination: ".swiper-pagination",
			effect: "fade"
		};
		this.props.slider = swiper(this.refs.swiper.getDOMNode(), params);
	},
	componentWillUnmount: function componentWillUnmount() {
		this.props.slider.destroy();
	},
	render: function render() {
		return React.createElement(
			View.Page,
			{ title: 'Swiper Fade' },
			React.createElement(
				View.PageContent,
				null,
				React.createElement(
					'div',
					{ className: 'swiper-container ks-demo-slider ks-fade-slider', ref: 'swiper' },
					React.createElement('div', { className: 'swiper-pagination' }),
					React.createElement(
						'div',
						{ className: 'swiper-wrapper' },
						React.createElement('div', { style: getImage(1), className: 'swiper-slide' }),
						React.createElement('div', { style: getImage(2), className: 'swiper-slide' }),
						React.createElement('div', { style: getImage(3), className: 'swiper-slide' }),
						React.createElement('div', { style: getImage(4), className: 'swiper-slide' })
					)
				)
			)
		);
	}
});

},{"UI":51,"react":undefined}],41:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');
var swiper = UI.Mixins.Swiper.swiper;
var Content = UI.Content;
var View = UI.View;

function getImage(i) {
	return { backgroundImage: 'url(img/app/photo/' + i + '.jpg)' };
}

module.exports = React.createClass({
	displayName: 'exports',

	componentDidMount: function componentDidMount() {
		this.props.sliderTop = swiper(this.refs.swiperTop.getDOMNode(), {
			nextButton: '.swiper-button-next',
			prevButton: '.swiper-button-prev',
			spaceBetween: 10
		});
		this.props.sliderThumbs = swiper(this.refs.swiperThumbs.getDOMNode(), {
			slidesPerView: 'auto',
			spaceBetween: 10,
			centeredSlides: true,
			touchRatio: 0.2,
			lazyLoading: true
		});
		this.props.sliderTop.params.control = this.props.sliderThumbs;
		this.props.sliderThumbs.params.control = this.props.sliderTop;
	},
	componentWillUnmount: function componentWillUnmount() {
		this.props.sliderTop.destroy();
		this.props.sliderThumbs.destroy();
	},
	render: function render() {
		return React.createElement(
			View.Page,
			{ title: 'Two Way Control Gallery' },
			React.createElement(
				View.PageContent,
				null,
				React.createElement(
					'div',
					{ className: 'swiper-container ks-swiper-gallery-top', ref: 'swiperTop' },
					React.createElement(
						'div',
						{ className: 'swiper-wrapper' },
						React.createElement('div', { style: getImage(1), className: 'swiper-slide' }),
						React.createElement('div', { style: getImage(2), className: 'swiper-slide' }),
						React.createElement('div', { style: getImage(3), className: 'swiper-slide' }),
						React.createElement('div', { style: getImage(4), className: 'swiper-slide' }),
						React.createElement('div', { style: getImage(5), className: 'swiper-slide' }),
						React.createElement('div', { style: getImage(6), className: 'swiper-slide' }),
						React.createElement('div', { style: getImage(7), className: 'swiper-slide' }),
						React.createElement('div', { style: getImage(8), className: 'swiper-slide' }),
						React.createElement('div', { style: getImage(9), className: 'swiper-slide' })
					),
					React.createElement('div', { className: 'swiper-button-next color-white' }),
					React.createElement('div', { className: 'swiper-button-prev color-white' })
				),
				React.createElement(
					'div',
					{ className: 'swiper-container ks-swiper-gallery-thumbs', ref: 'swiperThumbs' },
					React.createElement(
						'div',
						{ className: 'swiper-wrapper' },
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							React.createElement(
								'div',
								{ style: getImage(1), className: 'swiper-slide-pic' },
								'1'
							)
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							React.createElement(
								'div',
								{ style: getImage(2), className: 'swiper-slide-pic' },
								'2'
							)
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							React.createElement('div', { style: getImage(3), className: 'swiper-slide-pic' })
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							React.createElement('div', { style: getImage(4), className: 'swiper-slide-pic' })
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							React.createElement('div', { style: getImage(5), className: 'swiper-slide-pic' })
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							React.createElement('div', { style: getImage(6), className: 'swiper-slide-pic' })
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							React.createElement('div', { style: getImage(7), className: 'swiper-slide-pic' })
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							React.createElement('div', { style: getImage(8), className: 'swiper-slide-pic' })
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							React.createElement('div', { style: getImage(9), className: 'swiper-slide-pic' })
						)
					)
				)
			)
		);
	}
});

},{"UI":51,"react":undefined}],42:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');
var swiper = UI.Mixins.Swiper.swiper;
var Content = UI.Content;
var View = UI.View;

module.exports = React.createClass({
	displayName: 'exports',

	componentDidMount: function componentDidMount() {
		var params = {
			pagination: ".swiper-pagination",
			paginationHide: true
		};
		this.props.slider = swiper(this.refs.swiper.getDOMNode(), params);
	},
	componentWillUnmount: function componentWillUnmount() {
		this.props.slider.destroy();
	},
	render: function render() {
		return React.createElement(
			View.Page,
			{ title: 'Swiper Horizontal' },
			React.createElement(
				View.PageContent,
				null,
				React.createElement(
					'div',
					{ className: 'swiper-container ks-demo-slider', ref: 'swiper' },
					React.createElement('div', { className: 'swiper-pagination' }),
					React.createElement(
						'div',
						{ className: 'swiper-wrapper' },
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 1'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 2'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 3'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 4'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 5'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 6'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 7'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 8'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 9'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 10'
						)
					)
				)
			)
		);
	}
});

},{"UI":51,"react":undefined}],43:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');
var swiper = UI.Mixins.Swiper.swiper;
var Content = UI.Content;
var View = UI.View;

function getImage(i) {
	return 'img/app/photo/' + i + '.jpg';
}

module.exports = React.createClass({
	displayName: 'exports',

	componentDidMount: function componentDidMount() {
		var params = {
			pagination: ".swiper-pagination",
			nextButton: ".swiper-button-next",
			prevButton: ".swiper-button-prev",
			preloadImages: false,
			lazyLoading: true
		};
		this.props.slider = swiper(this.refs.swiper.getDOMNode(), params);
	},
	componentWillUnmount: function componentWillUnmount() {
		this.props.slider.destroy();
	},
	render: function render() {
		return React.createElement(
			View.Page,
			{ title: 'Swiper Lazy Loading' },
			React.createElement(
				View.PageContent,
				null,
				React.createElement(
					'div',
					{ className: 'swiper-container ks-lazy-slider', ref: 'swiper' },
					React.createElement(
						'div',
						{ className: 'swiper-wrapper' },
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							React.createElement('img', { 'data-src': getImage(1), className: 'swiper-lazy' }),
							React.createElement('div', { className: 'preloader' })
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							React.createElement('img', { 'data-src': getImage(2), className: 'swiper-lazy' }),
							React.createElement('div', { className: 'preloader' })
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							React.createElement('img', { 'data-src': getImage(3), className: 'swiper-lazy' }),
							React.createElement('div', { className: 'preloader' })
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							React.createElement('img', { 'data-src': getImage(4), className: 'swiper-lazy' }),
							React.createElement('div', { className: 'preloader' })
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							React.createElement('img', { 'data-src': getImage(5), className: 'swiper-lazy' }),
							React.createElement('div', { className: 'preloader' })
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							React.createElement('img', { 'data-src': getImage(6), className: 'swiper-lazy' }),
							React.createElement('div', { className: 'preloader' })
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							React.createElement('img', { 'data-src': getImage(7), className: 'swiper-lazy' }),
							React.createElement('div', { className: 'preloader' })
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							React.createElement('img', { 'data-src': getImage(8), className: 'swiper-lazy' }),
							React.createElement('div', { className: 'preloader' })
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							React.createElement('img', { 'data-src': getImage(9), className: 'swiper-lazy' }),
							React.createElement('div', { className: 'preloader' })
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							React.createElement('img', { 'data-src': getImage(10), className: 'swiper-lazy' }),
							React.createElement('div', { className: 'preloader' })
						)
					),
					React.createElement('div', { className: 'swiper-pagination swiper-pagination-white' }),
					React.createElement('div', { className: 'swiper-button-prev swiper-button-white' }),
					React.createElement('div', { className: 'swiper-button-next swiper-button-white' })
				)
			)
		);
	}
});

},{"UI":51,"react":undefined}],44:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');
var swiper = UI.Mixins.Swiper.swiper;
var Content = UI.Content;
var View = UI.View;

module.exports = React.createClass({
	displayName: 'exports',

	componentDidMount: function componentDidMount() {
		var params = {
			pagination: ".swiper-pagination",
			loop: true
		};
		this.props.slider = swiper(this.refs.swiper.getDOMNode(), params);
	},
	componentWillUnmount: function componentWillUnmount() {
		this.props.slider.destroy();
	},
	render: function render() {
		return React.createElement(
			View.Page,
			{ title: 'Swiper Loop' },
			React.createElement(
				View.PageContent,
				null,
				React.createElement(
					'div',
					{ className: 'swiper-container ks-demo-slider', ref: 'swiper' },
					React.createElement('div', { className: 'swiper-pagination' }),
					React.createElement(
						'div',
						{ className: 'swiper-wrapper' },
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 1'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 2'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 3'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 4'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 5'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 6'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 7'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 8'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 9'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 10'
						)
					)
				)
			)
		);
	}
});

},{"UI":51,"react":undefined}],45:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');
var swiper = UI.Mixins.Swiper.swiper;
var Content = UI.Content;
var View = UI.View;

module.exports = React.createClass({
	displayName: 'exports',

	componentDidMount: function componentDidMount() {
		var params1 = {
			pagination: ".swiper-pagination-c1",
			spaceBetween: 50
		};
		this.props.slider1 = swiper(this.refs.swiper1.getDOMNode(), params1);

		var params2 = {
			pagination: ".swiper-pagination-c2",
			spaceBetween: 20,
			slidesPerView: 2
		};
		this.props.slider2 = swiper(this.refs.swiper2.getDOMNode(), params2);

		var params3 = {
			pagination: ".swiper-pagination-c3",
			spaceBetween: 10,
			slidesPerView: 3
		};
		this.props.slider3 = swiper(this.refs.swiper3.getDOMNode(), params3);

		var params4 = {
			pagination: ".swiper-pagination-c4",
			spaceBetween: 10,
			slidesPerView: "auto",
			centeredSlides: true
		};
		this.props.slider4 = swiper(this.refs.swiper4.getDOMNode(), params4);

		var params5 = {
			pagination: ".swiper-pagination-c5",
			spaceBetween: 10,
			direction: "vertical"
		};
		this.props.slider5 = swiper(this.refs.swiper5.getDOMNode(), params5);

		var params6 = {
			speed: 900,
			pagination: ".swiper-pagination-c6",
			spaceBetween: 50
		};
		this.props.slider6 = swiper(this.refs.swiper6.getDOMNode(), params6);
	},
	componentWillUnmount: function componentWillUnmount() {
		this.props.slider1.destroy();
		this.props.slider2.destroy();
		this.props.slider3.destroy();
		this.props.slider4.destroy();
		this.props.slider5.destroy();
		this.props.slider6.destroy();
	},
	render: function render() {
		return React.createElement(
			View.Page,
			{ title: 'Swiper Multiple' },
			React.createElement(
				View.PageContent,
				null,
				React.createElement(
					Content.ContentBlockTitle,
					null,
					'1 Slide Per View, 50px Between'
				),
				React.createElement(
					'div',
					{ className: 'swiper-container  ks-carousel-slider', style: style, ref: 'swiper1' },
					React.createElement('div', { className: 'swiper-pagination swiper-pagination-c1' }),
					React.createElement(
						'div',
						{ className: 'swiper-wrapper' },
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 1'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 2'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 3'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 4'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 5'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 6'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 7'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 8'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 9'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 10'
						)
					)
				),
				React.createElement(
					Content.ContentBlockTitle,
					null,
					'>2 Slides Per View, 20px Between'
				),
				React.createElement(
					'div',
					{ className: 'swiper-container  ks-carousel-slider', style: style, ref: 'swiper2' },
					React.createElement('div', { className: 'swiper-pagination swiper-pagination-c2' }),
					React.createElement(
						'div',
						{ className: 'swiper-wrapper' },
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 1'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 2'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 3'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 4'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 5'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 6'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 7'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 8'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 9'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 10'
						)
					)
				),
				React.createElement(
					Content.ContentBlockTitle,
					null,
					'3 Slides Per View, 10px Between'
				),
				React.createElement(
					'div',
					{ className: 'swiper-container  ks-carousel-slider', style: style, ref: 'swiper3' },
					React.createElement('div', { className: 'swiper-pagination swiper-pagination-c3' }),
					React.createElement(
						'div',
						{ className: 'swiper-wrapper' },
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 1'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 2'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 3'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 4'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 5'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 6'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 7'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 8'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 9'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 10'
						)
					)
				),
				React.createElement(
					Content.ContentBlockTitle,
					null,
					'Auto Slides Per View + Centered'
				),
				React.createElement(
					'div',
					{ className: 'swiper-container  ks-carousel-slider  ks-carousel-slider-auto', style: style, ref: 'swiper4' },
					React.createElement('div', { className: 'swiper-pagination swiper-pagination-c4' }),
					React.createElement(
						'div',
						{ className: 'swiper-wrapper' },
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 1'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 2'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 3'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 4'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 5'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 6'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 7'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 8'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 9'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 10'
						)
					)
				),
				React.createElement(
					Content.ContentBlockTitle,
					null,
					'Vertical, 10px Between'
				),
				React.createElement(
					'div',
					{ className: 'swiper-container  ks-carousel-slider', style: style, ref: 'swiper5' },
					React.createElement('div', { className: 'swiper-pagination swiper-pagination-c5' }),
					React.createElement(
						'div',
						{ className: 'swiper-wrapper' },
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 1'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 2'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 3'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 4'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 5'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 6'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 7'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 8'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 9'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 10'
						)
					)
				),
				React.createElement(
					Content.ContentBlockTitle,
					null,
					'Slow speed'
				),
				React.createElement(
					'div',
					{ className: 'swiper-container  ks-carousel-slider', style: style, ref: 'swiper6' },
					React.createElement('div', { className: 'swiper-pagination swiper-pagination-c6' }),
					React.createElement(
						'div',
						{ className: 'swiper-wrapper' },
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 1'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 2'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 3'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 4'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 5'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 6'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 7'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 8'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 9'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 10'
						)
					)
				)
			)
		);
	}
});

var style = {
	fontSize: '18px',
	height: '120px',
	margin: '0 0 35px'
};

},{"UI":51,"react":undefined}],46:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');
var swiper = UI.Mixins.Swiper.swiper;
var Content = UI.Content;
var View = UI.View;

module.exports = React.createClass({
	displayName: 'exports',

	componentDidMount: function componentDidMount() {
		var paramsh = {
			pagination: ".swiper-pagination-h",
			paginationHide: false
		};
		this.props.sliderh = swiper(this.refs.swiperh.getDOMNode(), paramsh);

		var paramsv = {
			pagination: ".swiper-pagination-v",
			direction: "vertical",
			paginationHide: false
		};
		this.props.sliderv = swiper(this.refs.swiperv.getDOMNode(), paramsv);
	},
	componentWillUnmount: function componentWillUnmount() {
		this.props.sliderh.destroy();
		this.props.sliderv.destroy();
	},
	render: function render() {
		return React.createElement(
			View.Page,
			{ title: 'Swiper Nested' },
			React.createElement(
				View.PageContent,
				null,
				React.createElement(
					'div',
					{ className: 'swiper-container ks-demo-slider', ref: 'swiperh' },
					React.createElement('div', { className: 'swiper-pagination swiper-pagination-h' }),
					React.createElement(
						'div',
						{ className: 'swiper-wrapper' },
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Horizontal Slide 1'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							React.createElement(
								'div',
								{ className: 'swiper-container ks-demo-slider', ref: 'swiperv' },
								React.createElement('div', { className: 'swiper-pagination swiper-pagination-v' }),
								React.createElement(
									'div',
									{ className: 'swiper-wrapper' },
									React.createElement(
										'div',
										{ className: 'swiper-slide' },
										'Vertical Slide 1'
									),
									React.createElement(
										'div',
										{ className: 'swiper-slide' },
										'Vertical Slide 2'
									),
									React.createElement(
										'div',
										{ className: 'swiper-slide' },
										'Vertical Slide 3'
									)
								)
							)
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Horizontal Slide 3'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Horizontal Slide 4'
						)
					)
				)
			)
		);
	}
});

},{"UI":51,"react":undefined}],47:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');
var swiper = UI.Mixins.Swiper.swiper;
var Content = UI.Content;
var View = UI.View;

function getImage(i) {
	return { backgroundImage: 'url(img/app/photo/' + i + '.jpg)' };
}

module.exports = React.createClass({
	displayName: 'exports',

	componentDidMount: function componentDidMount() {
		var params = {
			pagination: ".swiper-pagination",
			parallax: true,
			nextButton: ".swiper-button-next",
			prevButton: ".swiper-button-prev",
			speed: 600
		};
		this.props.slider = swiper(this.refs.swiper.getDOMNode(), params);
	},
	componentWillUnmount: function componentWillUnmount() {
		this.props.slider.destroy();
	},
	render: function render() {
		return React.createElement(
			View.Page,
			{ title: 'Swiper Parallax' },
			React.createElement(
				View.PageContent,
				null,
				React.createElement(
					'div',
					{ className: 'swiper-container ks-parallax-slider', ref: 'swiper' },
					React.createElement('div', { 'data-swiper-parallax': '-23%', style: getImage(1), className: 'swiper-parallax-bg' }),
					React.createElement('div', { className: 'swiper-pagination color-white' }),
					React.createElement('div', { className: 'swiper-button-next color-white' }),
					React.createElement('div', { className: 'swiper-button-prev color-white' }),
					React.createElement(
						'div',
						{ className: 'swiper-wrapper' },
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							React.createElement(
								'div',
								{ 'data-swiper-parallax': '-100', className: 'swiper-slide-title' },
								'Slide 1'
							),
							React.createElement(
								'div',
								{ 'data-swiper-parallax': '-200', className: 'swiper-slide-subtitle' },
								'Subtitle'
							),
							React.createElement(
								'div',
								{ 'data-swiper-parallax': '-300', className: 'swiper-slide-text' },
								React.createElement(
									'p',
									null,
									'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dictum mattis velit, sit amet faucibus felis iaculis nec. Nulla laoreet justo vitae porttitor porttitor. Suspendisse in sem justo. Integer laoreet magna nec elit suscipit, ac laoreet nibh euismod. Aliquam hendrerit lorem at elit facilisis rutrum. Ut at ullamcorper velit. Nulla ligula nisi, imperdiet ut lacinia nec, tincidunt ut libero. Aenean feugiat non eros quis feugiat.'
								)
							)
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							React.createElement(
								'div',
								{ 'data-swiper-parallax': '-100', className: 'swiper-slide-title' },
								'Slide 2'
							),
							React.createElement(
								'div',
								{ 'data-swiper-parallax': '-200', className: 'swiper-slide-subtitle' },
								'Subtitle'
							),
							React.createElement(
								'div',
								{ 'data-swiper-parallax': '-300', className: 'swiper-slide-text' },
								React.createElement(
									'p',
									null,
									'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dictum mattis velit, sit amet faucibus felis iaculis nec. Nulla laoreet justo vitae porttitor porttitor. Suspendisse in sem justo. Integer laoreet magna nec elit suscipit, ac laoreet nibh euismod. Aliquam hendrerit lorem at elit facilisis rutrum. Ut at ullamcorper velit. Nulla ligula nisi, imperdiet ut lacinia nec, tincidunt ut libero. Aenean feugiat non eros quis feugiat.'
								)
							)
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							React.createElement(
								'div',
								{ 'data-swiper-parallax': '-100', className: 'swiper-slide-title' },
								'Slide 3'
							),
							React.createElement(
								'div',
								{ 'data-swiper-parallax': '-200', className: 'swiper-slide-subtitle' },
								'Subtitle'
							),
							React.createElement(
								'div',
								{ 'data-swiper-parallax': '-300', className: 'swiper-slide-text' },
								React.createElement(
									'p',
									null,
									'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dictum mattis velit, sit amet faucibus felis iaculis nec. Nulla laoreet justo vitae porttitor porttitor. Suspendisse in sem justo. Integer laoreet magna nec elit suscipit, ac laoreet nibh euismod. Aliquam hendrerit lorem at elit facilisis rutrum. Ut at ullamcorper velit. Nulla ligula nisi, imperdiet ut lacinia nec, tincidunt ut libero. Aenean feugiat non eros quis feugiat.'
								)
							)
						)
					)
				)
			)
		);
	}
});

},{"UI":51,"react":undefined}],48:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');
var swiper = UI.Mixins.Swiper.swiper;
var Content = UI.Content;
var View = UI.View;

module.exports = React.createClass({
	displayName: 'exports',

	componentDidMount: function componentDidMount() {
		var params = {
			scrollbar: ".swiper-scrollbar"
		};
		this.props.slider = swiper(this.refs.swiper.getDOMNode(), params);
	},
	componentWillUnmount: function componentWillUnmount() {
		this.props.slider.destroy();
	},
	render: function render() {
		return React.createElement(
			View.Page,
			{ title: 'Button' },
			React.createElement(
				View.PageContent,
				null,
				React.createElement(
					'div',
					{ className: 'swiper-container ks-demo-slider', ref: 'swiper' },
					React.createElement('div', { className: 'swiper-scrollbar' }),
					React.createElement(
						'div',
						{ className: 'swiper-wrapper' },
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 1'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 2'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 3'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 4'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 5'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 6'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 7'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 8'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 9'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 10'
						)
					)
				)
			)
		);
	}
});

},{"UI":51,"react":undefined}],49:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');
var swiper = UI.Mixins.Swiper.swiper;
var Content = UI.Content;
var View = UI.View;

module.exports = React.createClass({
	displayName: 'exports',

	componentDidMount: function componentDidMount() {
		var params = {
			spaceBetween: 50,
			pagination: ".swiper-pagination",
			paginationHide: true
		};
		this.props.slider = swiper(this.refs.swiper.getDOMNode(), params);
	},
	componentWillUnmount: function componentWillUnmount() {
		this.props.slider.destroy();
	},
	render: function render() {
		return React.createElement(
			View.Page,
			{ title: 'Swiper Space Between' },
			React.createElement(
				View.PageContent,
				null,
				React.createElement(
					'div',
					{ className: 'swiper-container ks-demo-slider', ref: 'swiper' },
					React.createElement('div', { className: 'swiper-pagination' }),
					React.createElement(
						'div',
						{ className: 'swiper-wrapper' },
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 1'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 2'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 3'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 4'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 5'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 6'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 7'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 8'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 9'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 10'
						)
					)
				)
			)
		);
	}
});

},{"UI":51,"react":undefined}],50:[function(require,module,exports){
'use strict';

var React = require('react');
var UI = require('UI');
var swiper = UI.Mixins.Swiper.swiper;
var Content = UI.Content;
var View = UI.View;

module.exports = React.createClass({
	displayName: 'exports',

	componentDidMount: function componentDidMount() {
		var params = {
			direction: 'vertical',
			pagination: ".swiper-pagination",
			paginationHide: true
		};
		this.props.slider = swiper(this.refs.swiper.getDOMNode(), params);
	},
	componentWillUnmount: function componentWillUnmount() {
		this.props.slider.destroy();
	},
	render: function render() {
		return React.createElement(
			View.Page,
			{ title: 'Swiper Vertical' },
			React.createElement(
				View.PageContent,
				null,
				React.createElement(
					'div',
					{ className: 'swiper-container ks-demo-slider', ref: 'swiper' },
					React.createElement('div', { className: 'swiper-pagination' }),
					React.createElement(
						'div',
						{ className: 'swiper-wrapper' },
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 1'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 2'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 3'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 4'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 5'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 6'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 7'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 8'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 9'
						),
						React.createElement(
							'div',
							{ className: 'swiper-slide' },
							'Slide 10'
						)
					)
				)
			)
		);
	}
});

},{"UI":51,"react":undefined}],51:[function(require,module,exports){
module.exports = require('../../src/js/index.js');

},{"../../src/js/index.js":84}],52:[function(require,module,exports){
/*!
  Copyright (c) 2015 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = '';

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes += ' ' + arg;
			} else if (Array.isArray(arg)) {
				classes += ' ' + classNames.apply(null, arg);
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes += ' ' + key;
					}
				}
			}
		}

		return classes.substr(1);
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],53:[function(require,module,exports){
'use strict';

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = Object.keys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			to[keys[i]] = from[keys[i]];
		}
	}

	return to;
};

},{}],54:[function(require,module,exports){
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}],55:[function(require,module,exports){
'use strict';

var Toast = function Toast(params) {
  var text = params.text,
      icon = params.icon,
      container;

  function hideBox($curbox) {
    if ($curbox) {
      $curbox.removeClass('fadein').transitionEnd(function () {
        $curbox.remove();
      });
    }
  }

  this.show = function (show) {
    if (show) {
      $('.toast-container').off('click').off('transitionEnd').remove();
      container = $('<div class="toast-container show">');
      var html = '<span class="toast-msg">';
      icon && (html += '<i class="icon ' + icon + '"></i>');
      text && (html += text);
      html += '</span>';
      container.html(html);
      $('body').append(container);

      var offsetWidth = container.find('.toast-msg')[0].offsetWidth;
      container.css({
        'margin-left': -offsetWidth / 2 + 'px'
      });

      container.click(function () {
        hideBox(container);
      });
      container.addClass('fadein');
      setTimeout(function () {
        hideBox(container);
      }, 1500);
    } else {
      hideBox(container);
    }
  };

  return this;
};

module.exports = function (params) {
  return new Toast(params).show(true);
};

},{}],56:[function(require,module,exports){
'use strict';

module.exports = {
	Toast: require('./Toast')
};

},{"./Toast":55}],57:[function(require,module,exports){
'use strict';

var React = require('react');

var Accordion = function Accordion(params) {
    var p = this;

    p.accordionToggle = function (item) {
        item = $(item);
        if (item.length === 0) return;
        if (item.hasClass('accordion-item-expanded')) p.accordionClose(item);else p.accordionOpen(item);
    };
    p.accordionOpen = function (item) {
        item = $(item);
        var group = item.parents('.accordion-group').eq(0);
        var content = item.children('.accordion-item-content');
        if (content.length === 0) content = item.find('.accordion-item-content');
        var expandedItem = group.length > 0 && item.parent().children('.accordion-item-expanded');
        if (expandedItem.length > 0) {
            p.accordionClose(expandedItem);
        }
        content.css('height', content[0].scrollHeight + 'px').transitionEnd(function () {
            if (item.hasClass('accordion-item-expanded')) {
                content.transition(0);
                content.css('height', 'auto');
                var clientLeft = content[0].clientLeft;
                content.transition('');
                item.trigger('opened');
            } else {
                content.css('height', '');
                item.trigger('closed');
            }
        });
        item.trigger('open');
        item.addClass('accordion-item-expanded');
    };
    p.accordionClose = function (item) {
        item = $(item);
        var content = item.children('.accordion-item-content');
        if (content.length === 0) content = item.find('.accordion-item-content');
        item.removeClass('accordion-item-expanded');
        content.transition(0);
        content.css('height', content[0].scrollHeight + 'px');
        // Relayout
        var clientLeft = content[0].clientLeft;
        // Close
        content.transition('');
        content.css('height', '').transitionEnd(function () {
            if (item.hasClass('accordion-item-expanded')) {
                content.transition(0);
                content.css('height', 'auto');
                var clientLeft = content[0].clientLeft;
                content.transition('');
                item.trigger('opened');
            } else {
                content.css('height', '');
                item.trigger('closed');
            }
        });
        item.trigger('close');
    };
    return p;
};

module.exports = React.createClass({
    displayName: 'exports',

    componentDidMount: function componentDidMount() {
        this.accordionItem = new Accordion();
        this.item = this.refs.item.getDOMNode();
    },
    toggle: function toggle() {
        this.accordionItem.accordionToggle(this.item);
    },
    render: function render() {
        var content = React.createElement(
            'div',
            { className: 'accordion-item-content', onClick: function (e) {
                    e.stopPropagation();
                } },
            this.props.content
        );
        if (this.props.list) {
            return React.createElement(
                'li',
                { ref: 'item', onClick: this.toggle },
                this.props.children,
                content
            );
        } else {
            return React.createElement(
                'div',
                { ref: 'item', onClick: this.toggle },
                this.props.children,
                content
            );
        }
    }
});

},{"react":undefined}],58:[function(require,module,exports){
'use strict';

module.exports = {
	AccordionItem: require('./AccordionItem')
};

},{"./AccordionItem":57}],59:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        var obj = {};
        if (this.props.color) {
            obj['bg-' + this.props.color] = true;
        }
        var className = cn("badge", obj);
        return React.createElement(
            'span',
            { className: className },
            this.props.children
        );
    }
});

},{"classnames":52,"react":undefined}],60:[function(require,module,exports){
'use strict';

module.exports = {
	Badge: require('./Badge')
};

},{"./Badge":59}],61:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');
var assign = require('object-assign');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        var obj = {
            'button': !this.props.list,
            'active': this.props.active,
            'button-round': this.props.round,
            'button-big': this.props.big,
            'button-fill': this.props.fill,
            'list-button item-link': this.props.list
        };
        if (this.props.color) {
            obj['color-' + this.props.color] = true;
        }
        var className = cn(obj);
        var style = this.props.inline ? { display: 'inline-block', verticalAlign: 'middle' } : {};
        style = assign(style, this.props.style);
        return React.createElement(
            'a',
            { href: '#', className: className, style: style, onClick: this.props.onTap },
            this.props.children
        );
    }
});

},{"classnames":52,"object-assign":53,"react":undefined}],62:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "buttons-row" },
            this.props.children
        );
    }
});

},{"react":undefined}],63:[function(require,module,exports){
'use strict';

module.exports = {
	Button: require('./Button'),
	ButtonsRow: require('./ButtonsRow')
};

},{"./Button":61,"./ButtonsRow":62}],64:[function(require,module,exports){
'use strict';

var React = require('react');

var Calendar = function Calendar(params) {
    var p = this;
    var defaults = {
        monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        firstDay: 1, // First day of the week, Monday
        weekendDays: [0, 6], // Sunday and Saturday
        multiple: false,
        direction: 'horizontal', // or 'vertical'
        minDate: null,
        maxDate: null,
        touchMove: true,
        animate: true,
        closeOnSelect: false,
        monthPicker: true,
        monthPickerTemplate: '<div class="picker-calendar-month-picker">' + '<a href="#" class="link icon-only picker-calendar-prev-month"><i class="icon icon-prev"></i></a>' + '<span class="current-month-value"></span>' + '<a href="#" class="link icon-only picker-calendar-next-month"><i class="icon icon-next"></i></a>' + '</div>',
        yearPicker: true,
        yearPickerTemplate: '<div class="picker-calendar-year-picker">' + '<a href="#" class="link icon-only picker-calendar-prev-year"><i class="icon icon-prev"></i></a>' + '<span class="current-year-value"></span>' + '<a href="#" class="link icon-only picker-calendar-next-year"><i class="icon icon-next"></i></a>' + '</div>',
        weekHeader: true,
        // Common settings
        toolbar: true,
        toolbarCloseText: 'Done',
        toolbarTemplate: '<div class="toolbar">' + '<div class="toolbar-inner">' + '{{monthPicker}}' + '{{yearPicker}}' +
        // '<a href="#" class="link close-picker">{{closeText}}</a>' +
        '</div>' + '</div>'
    };
    /* Callbacks
    onMonthAdd
    onChange
    onOpen
    onClose
    onDayClick
    onMonthYearChangeStart
    onMonthYearChangeEnd
    */
    params = params || {};
    for (var def in defaults) {
        if (typeof params[def] === 'undefined') {
            params[def] = defaults[def];
        }
    }
    p.params = params;

    // Is horizontal
    p.isH = p.params.direction === 'horizontal';

    // RTL inverter
    var inverter = 1;

    // Animating flag
    p.animating = false;

    // Value
    p.addValue = function (value) {
        if (p.params.multiple) {
            if (!p.value) p.value = [];
            var inValuesIndex;
            for (var i = 0; i < p.value.length; i++) {
                if (new Date(value).getTime() === new Date(p.value[i]).getTime()) {
                    inValuesIndex = i;
                }
            }
            if (typeof inValuesIndex === 'undefined') {
                p.value.push(value);
            } else {
                p.value.splice(inValuesIndex, 1);
            }
            p.updateValue();
        } else {
            p.value = [value];
            p.updateValue();
        }
    };
    p.setValue = function (arrValues) {
        p.value = arrValues;
        p.updateValue();
    };
    p.updateValue = function () {
        p.wrapper.find('.picker-calendar-day-selected').removeClass('picker-calendar-day-selected');
        var i, inputValue;
        for (i = 0; i < p.value.length; i++) {
            var valueDate = new Date(p.value[i]);
            p.wrapper.find('.picker-calendar-day[data-date="' + valueDate.getFullYear() + '-' + valueDate.getMonth() + '-' + valueDate.getDate() + '"]').addClass('picker-calendar-day-selected');
        }
        console.log(p.value);
    };

    // Columns Handlers
    p.initCalendarEvents = function () {
        var col;
        var allowItemClick = true;
        var isTouched, isMoved, touchStartX, touchStartY, touchCurrentX, touchCurrentY, touchStartTime, touchEndTime, startTranslate, currentTranslate, wrapperWidth, wrapperHeight, percentage, touchesDiff, isScrolling;
        function handleTouchStart(e) {
            if (isMoved || isTouched) return;
            // e.preventDefault();
            isTouched = true;
            touchStartX = touchCurrentY = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
            touchStartY = touchCurrentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
            touchStartTime = new Date().getTime();
            percentage = 0;
            allowItemClick = true;
            isScrolling = undefined;
            startTranslate = currentTranslate = p.monthsTranslate;
        }
        function handleTouchMove(e) {
            if (!isTouched) return;

            touchCurrentX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
            touchCurrentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
            if (typeof isScrolling === 'undefined') {
                isScrolling = !!(isScrolling || Math.abs(touchCurrentY - touchStartY) > Math.abs(touchCurrentX - touchStartX));
            }
            if (p.isH && isScrolling) {
                isTouched = false;
                return;
            }
            e.preventDefault();
            if (p.animating) {
                isTouched = false;
                return;
            }
            allowItemClick = false;
            if (!isMoved) {
                // First move
                isMoved = true;
                wrapperWidth = p.wrapper[0].offsetWidth;
                wrapperHeight = p.wrapper[0].offsetHeight;
                p.wrapper.transition(0);
            }
            e.preventDefault();

            touchesDiff = p.isH ? touchCurrentX - touchStartX : touchCurrentY - touchStartY;
            percentage = touchesDiff / (p.isH ? wrapperWidth : wrapperHeight);
            currentTranslate = (p.monthsTranslate * inverter + percentage) * 100;

            // Transform wrapper
            p.wrapper.transform('translate3d(' + (p.isH ? currentTranslate : 0) + '%, ' + (p.isH ? 0 : currentTranslate) + '%, 0)');
        }
        function handleTouchEnd(e) {
            if (!isTouched || !isMoved) {
                isTouched = isMoved = false;
                return;
            }
            isTouched = isMoved = false;

            touchEndTime = new Date().getTime();
            if (touchEndTime - touchStartTime < 300) {
                if (Math.abs(touchesDiff) < 10) {
                    p.resetMonth();
                } else if (touchesDiff >= 10) {
                    p.prevMonth();
                } else {
                    p.nextMonth();
                }
            } else {
                if (percentage <= -0.5) {
                    p.nextMonth();
                } else if (percentage >= 0.5) {
                    p.prevMonth();
                } else {
                    p.resetMonth();
                }
            }

            // Allow click
            setTimeout(function () {
                allowItemClick = true;
            }, 100);
        }

        function handleDayClick(e) {
            if (!allowItemClick) return;
            var day = $(e.target).parents('.picker-calendar-day');
            if (day.length === 0 && $(e.target).hasClass('picker-calendar-day')) {
                day = $(e.target);
            }
            if (day.length === 0) return;
            if (day.hasClass('picker-calendar-day-selected') && !p.params.multiple) return;
            if (day.hasClass('picker-calendar-day-disabled')) return;
            if (day.hasClass('picker-calendar-day-next')) p.nextMonth();
            if (day.hasClass('picker-calendar-day-prev')) p.prevMonth();
            var dateYear = day.attr('data-year');
            var dateMonth = day.attr('data-month');
            var dateDay = day.attr('data-day');
            if (p.params.onDayClick) {
                p.params.onDayClick(p, day[0], dateYear, dateMonth, dateDay);
            }
            p.addValue(new Date(dateYear, dateMonth, dateDay).getTime());
            if (p.params.closeOnSelect) {
                app.hideModal();
            };
        }

        p.container.find('.picker-calendar-prev-month').on('click', p.prevMonth);
        p.container.find('.picker-calendar-next-month').on('click', p.nextMonth);
        p.container.find('.picker-calendar-prev-year').on('click', p.prevYear);
        p.container.find('.picker-calendar-next-year').on('click', p.nextYear);
        p.wrapper.on('click', handleDayClick);
        if (p.params.touchMove) {
            p.wrapper.on(app.touchEvents.start, handleTouchStart);
            p.wrapper.on(app.touchEvents.move, handleTouchMove);
            p.wrapper.on(app.touchEvents.end, handleTouchEnd);
        }

        p.container[0].f7DestroyCalendarEvents = function () {
            p.container.find('.picker-calendar-prev-month').off('click', p.prevMonth);
            p.container.find('.picker-calendar-next-month').off('click', p.nextMonth);
            p.container.find('.picker-calendar-prev-year').off('click', p.prevYear);
            p.container.find('.picker-calendar-next-year').off('click', p.nextYear);
            p.wrapper.off('click', handleDayClick);
            if (p.params.touchMove) {
                p.wrapper.off(app.touchEvents.start, handleTouchStart);
                p.wrapper.off(app.touchEvents.move, handleTouchMove);
                p.wrapper.off(app.touchEvents.end, handleTouchEnd);
            }
        };
    };

    p.destroyCalendarEvents = function (colContainer) {
        if ('f7DestroyCalendarEvents' in p.container[0]) p.container[0].f7DestroyCalendarEvents();
    };
    // Calendar Methods
    p.daysInMonth = function (date) {
        var d = new Date(date);
        return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    };
    p.monthHTML = function (date, offset) {
        date = new Date(date);
        var year = date.getFullYear(),
            month = date.getMonth(),
            day = date.getDate();
        if (offset === 'next') {
            if (month === 11) date = new Date(year + 1, 0);else date = new Date(year, month + 1, 1);
        }
        if (offset === 'prev') {
            if (month === 0) date = new Date(year - 1, 11);else date = new Date(year, month - 1, 1);
        }
        if (offset === 'next' || offset === 'prev') {
            month = date.getMonth();
            year = date.getFullYear();
        }
        var daysInPrevMonth = p.daysInMonth(new Date(date.getFullYear(), date.getMonth()).getTime() - 10 * 24 * 60 * 60 * 1000),
            daysInMonth = p.daysInMonth(date),
            firstDayOfMonthIndex = new Date(date.getFullYear(), date.getMonth()).getDay();
        if (firstDayOfMonthIndex === 0) firstDayOfMonthIndex = 7;

        var dayDate,
            currentValues = [],
            i,
            j,
            rows = 6,
            cols = 7,
            monthHTML = '',
            dayIndex = 0 + (p.params.firstDay - 1),
            today = new Date().setHours(0, 0, 0, 0),
            minDate = p.params.minDate ? new Date(p.params.minDate).getTime() : null,
            maxDate = p.params.maxDate ? new Date(p.params.maxDate).getTime() : null;

        if (p.value && p.value.length) {
            for (i = 0; i < p.value.length; i++) {
                currentValues.push(new Date(p.value[i]).setHours(0, 0, 0, 0));
            }
        }

        for (i = 1; i <= rows; i++) {
            var rowHTML = '';
            var row = i;
            for (j = 1; j <= cols; j++) {
                var col = j;
                dayIndex++;
                var dayNumber = dayIndex - firstDayOfMonthIndex;
                var addClass = '';
                if (dayNumber < 0) {
                    dayNumber = daysInPrevMonth + dayNumber + 1;
                    addClass += ' picker-calendar-day-prev';
                    dayDate = new Date(month - 1 < 0 ? year - 1 : year, month - 1 < 0 ? 11 : month - 1, dayNumber).getTime();
                } else {
                    dayNumber = dayNumber + 1;
                    if (dayNumber > daysInMonth) {
                        dayNumber = dayNumber - daysInMonth;
                        addClass += ' picker-calendar-day-next';
                        dayDate = new Date(month + 1 > 11 ? year + 1 : year, month + 1 > 11 ? 0 : month + 1, dayNumber).getTime();
                    } else {
                        dayDate = new Date(year, month, dayNumber).getTime();
                    }
                }
                // Today
                if (dayDate === today) addClass += ' picker-calendar-day-today';
                // Selected
                if (currentValues.indexOf(dayDate) >= 0) addClass += ' picker-calendar-day-selected';
                // Weekend
                if (p.params.weekendDays.indexOf(col - 1) >= 0) {
                    addClass += ' picker-calendar-day-weekend';
                }
                // Disabled
                if (minDate && dayDate < minDate || maxDate && dayDate > maxDate) {
                    addClass += ' picker-calendar-day-disabled';
                }

                dayDate = new Date(dayDate);
                var dayYear = dayDate.getFullYear();
                var dayMonth = dayDate.getMonth();
                rowHTML += '<div data-year="' + dayYear + '" data-month="' + dayMonth + '" data-day="' + dayNumber + '" class="picker-calendar-day' + addClass + '" data-date="' + (dayYear + '-' + dayMonth + '-' + dayNumber) + '"><span>' + dayNumber + '</span></div>';
            }
            monthHTML += '<div class="picker-calendar-row">' + rowHTML + '</div>';
        }
        monthHTML = '<div class="picker-calendar-month" data-year="' + year + '" data-month="' + month + '">' + monthHTML + '</div>';
        return monthHTML;
    };
    p.animating = false;
    p.updateCurrentMonthYear = function (dir) {
        if (typeof dir === 'undefined') {
            p.currentMonth = parseInt(p.months.eq(1).attr('data-month'), 10);
            p.currentYear = parseInt(p.months.eq(1).attr('data-year'), 10);
        } else {
            p.currentMonth = parseInt(p.months.eq(dir === 'next' ? p.months.length - 1 : 0).attr('data-month'), 10);
            p.currentYear = parseInt(p.months.eq(dir === 'next' ? p.months.length - 1 : 0).attr('data-year'), 10);
        }
        p.container.find('.current-month-value').text(p.params.monthNames[p.currentMonth]);
        p.container.find('.current-year-value').text(p.currentYear);
    };
    p.onMonthChangeStart = function (dir) {
        p.updateCurrentMonthYear(dir);
        p.months.removeClass('picker-calendar-month-current picker-calendar-month-prev picker-calendar-month-next');
        var currentIndex = dir === 'next' ? p.months.length - 1 : 0;

        p.months.eq(currentIndex).addClass('picker-calendar-month-current');
        p.months.eq(dir === 'next' ? currentIndex - 1 : currentIndex + 1).addClass(dir === 'next' ? 'picker-calendar-month-prev' : 'picker-calendar-month-next');

        if (p.params.onMonthYearChangeStart) {
            p.params.onMonthYearChangeStart(p, p.currentYear, p.currentMonth);
        }
    };
    p.onMonthChangeEnd = function (dir, rebuildBoth) {
        p.animating = false;
        var nextMonthHTML, prevMonthHTML, newMonthHTML;
        p.wrapper.find('.picker-calendar-month:not(.picker-calendar-month-prev):not(.picker-calendar-month-current):not(.picker-calendar-month-next)').remove();

        if (typeof dir === 'undefined') {
            dir = 'next';
            rebuildBoth = true;
        }
        if (!rebuildBoth) {
            newMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), dir);
        } else {
            p.wrapper.find('.picker-calendar-month-next, .picker-calendar-month-prev').remove();
            prevMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), 'prev');
            nextMonthHTML = p.monthHTML(new Date(p.currentYear, p.currentMonth), 'next');
        }
        if (dir === 'next' || rebuildBoth) {
            p.wrapper.append(newMonthHTML || nextMonthHTML);
        }
        if (dir === 'prev' || rebuildBoth) {
            p.wrapper.prepend(newMonthHTML || prevMonthHTML);
        }
        p.months = p.wrapper.find('.picker-calendar-month');
        p.setMonthsTranslate(p.monthsTranslate);
        if (p.params.onMonthAdd) {
            p.params.onMonthAdd(p, dir === 'next' ? p.months.eq(p.months.length - 1)[0] : p.months.eq(0)[0]);
        }
        if (p.params.onMonthYearChangeEnd) {
            p.params.onMonthYearChangeEnd(p, p.currentYear, p.currentMonth);
        }
    };
    p.setMonthsTranslate = function (translate) {
        translate = translate || p.monthsTranslate || 0;
        if (typeof p.monthsTranslate === 'undefined') p.monthsTranslate = translate;
        p.months.removeClass('picker-calendar-month-current picker-calendar-month-prev picker-calendar-month-next');
        var prevMonthTranslate = -(translate + 1) * 100 * inverter;
        var currentMonthTranslate = -translate * 100 * inverter;
        var nextMonthTranslate = -(translate - 1) * 100 * inverter;
        p.months.eq(0).transform('translate3d(' + (p.isH ? prevMonthTranslate : 0) + '%, ' + (p.isH ? 0 : prevMonthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
        p.months.eq(1).transform('translate3d(' + (p.isH ? currentMonthTranslate : 0) + '%, ' + (p.isH ? 0 : currentMonthTranslate) + '%, 0)').addClass('picker-calendar-month-current');
        p.months.eq(2).transform('translate3d(' + (p.isH ? nextMonthTranslate : 0) + '%, ' + (p.isH ? 0 : nextMonthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
    };
    p.nextMonth = function (transition) {
        if (typeof transition === 'undefined' || typeof transition === 'object') {
            transition = '';
            if (!p.params.animate) transition = 0;
        }
        var nextMonth = parseInt(p.months.eq(p.months.length - 1).attr('data-month'), 10);
        var nextYear = parseInt(p.months.eq(p.months.length - 1).attr('data-year'), 10);
        var nextDate = new Date(nextYear, nextMonth);
        var nextDateTime = nextDate.getTime();
        var transitionEndCallback = p.animating ? false : true;
        if (p.params.maxDate) {
            if (nextDateTime > new Date(p.params.maxDate).getTime()) {
                return p.resetMonth();
            }
        }
        p.monthsTranslate--;
        if (nextMonth === p.currentMonth) {
            var nextMonthTranslate = -p.monthsTranslate * 100 * inverter;
            var nextMonthHTML = $(p.monthHTML(nextDateTime, 'next')).transform('translate3d(' + (p.isH ? nextMonthTranslate : 0) + '%, ' + (p.isH ? 0 : nextMonthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
            p.wrapper.append(nextMonthHTML[0]);
            p.months = p.wrapper.find('.picker-calendar-month');
            if (p.params.onMonthAdd) {
                p.params.onMonthAdd(p, p.months.eq(p.months.length - 1)[0]);
            }
        }
        p.animating = true;
        p.onMonthChangeStart('next');
        var translate = p.monthsTranslate * 100 * inverter;

        p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
        if (transitionEndCallback) {
            p.wrapper.transitionEnd(function () {
                p.onMonthChangeEnd('next');
            });
        }
        if (!p.params.animate) {
            p.onMonthChangeEnd('next');
        }
    };
    p.prevMonth = function (transition) {
        if (typeof transition === 'undefined' || typeof transition === 'object') {
            transition = '';
            if (!p.params.animate) transition = 0;
        }
        var prevMonth = parseInt(p.months.eq(0).attr('data-month'), 10);
        var prevYear = parseInt(p.months.eq(0).attr('data-year'), 10);
        var prevDate = new Date(prevYear, prevMonth + 1, -1);
        var prevDateTime = prevDate.getTime();
        var transitionEndCallback = p.animating ? false : true;
        if (p.params.minDate) {
            if (prevDateTime < new Date(p.params.minDate).getTime()) {
                return p.resetMonth();
            }
        }
        p.monthsTranslate++;
        if (prevMonth === p.currentMonth) {
            var prevMonthTranslate = -p.monthsTranslate * 100 * inverter;
            var prevMonthHTML = $(p.monthHTML(prevDateTime, 'prev')).transform('translate3d(' + (p.isH ? prevMonthTranslate : 0) + '%, ' + (p.isH ? 0 : prevMonthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
            p.wrapper.prepend(prevMonthHTML[0]);
            p.months = p.wrapper.find('.picker-calendar-month');
            if (p.params.onMonthAdd) {
                p.params.onMonthAdd(p, p.months.eq(0)[0]);
            }
        }
        p.animating = true;
        p.onMonthChangeStart('prev');
        var translate = p.monthsTranslate * 100 * inverter;
        p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
        if (transitionEndCallback) {
            p.wrapper.transitionEnd(function () {
                p.onMonthChangeEnd('prev');
            });
        }
        if (!p.params.animate) {
            p.onMonthChangeEnd('prev');
        }
    };
    p.resetMonth = function (transition) {
        if (typeof transition === 'undefined') transition = '';
        var translate = p.monthsTranslate * 100 * inverter;
        p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? translate : 0) + '%, ' + (p.isH ? 0 : translate) + '%, 0)');
    };
    p.setYearMonth = function (year, month, transition) {
        if (typeof year === 'undefined') year = p.currentYear;
        if (typeof month === 'undefined') month = p.currentMonth;
        if (typeof transition === 'undefined' || typeof transition === 'object') {
            transition = '';
            if (!p.params.animate) transition = 0;
        }
        var targetDate;
        if (year < p.currentYear) {
            targetDate = new Date(year, month + 1, -1).getTime();
        } else {
            targetDate = new Date(year, month).getTime();
        }
        if (p.params.maxDate && targetDate > new Date(p.params.maxDate).getTime()) {
            return false;
        }
        if (p.params.minDate && targetDate < new Date(p.params.minDate).getTime()) {
            return false;
        }
        var currentDate = new Date(p.currentYear, p.currentMonth).getTime();
        var dir = targetDate > currentDate ? 'next' : 'prev';
        var newMonthHTML = p.monthHTML(new Date(year, month));
        p.monthsTranslate = p.monthsTranslate || 0;
        var prevTranslate = p.monthsTranslate;
        var monthTranslate, wrapperTranslate;
        var transitionEndCallback = p.animating ? false : true;
        if (targetDate > currentDate) {
            // To next
            p.monthsTranslate--;
            if (!p.animating) p.months.eq(p.months.length - 1).remove();
            p.wrapper.append(newMonthHTML);
            p.months = p.wrapper.find('.picker-calendar-month');
            monthTranslate = -(prevTranslate - 1) * 100 * inverter;
            p.months.eq(p.months.length - 1).transform('translate3d(' + (p.isH ? monthTranslate : 0) + '%, ' + (p.isH ? 0 : monthTranslate) + '%, 0)').addClass('picker-calendar-month-next');
        } else {
            // To prev
            p.monthsTranslate++;
            if (!p.animating) p.months.eq(0).remove();
            p.wrapper.prepend(newMonthHTML);
            p.months = p.wrapper.find('.picker-calendar-month');
            monthTranslate = -(prevTranslate + 1) * 100 * inverter;
            p.months.eq(0).transform('translate3d(' + (p.isH ? monthTranslate : 0) + '%, ' + (p.isH ? 0 : monthTranslate) + '%, 0)').addClass('picker-calendar-month-prev');
        }
        if (p.params.onMonthAdd) {
            p.params.onMonthAdd(p, dir === 'next' ? p.months.eq(p.months.length - 1)[0] : p.months.eq(0)[0]);
        }
        p.animating = true;
        p.onMonthChangeStart(dir);
        wrapperTranslate = p.monthsTranslate * 100 * inverter;
        p.wrapper.transition(transition).transform('translate3d(' + (p.isH ? wrapperTranslate : 0) + '%, ' + (p.isH ? 0 : wrapperTranslate) + '%, 0)');
        if (transitionEndCallback) {
            p.wrapper.transitionEnd(function () {
                p.onMonthChangeEnd(dir, true);
            });
        }
        if (!p.params.animate) {
            p.onMonthChangeEnd(dir);
        }
    };
    p.nextYear = function () {
        p.setYearMonth(p.currentYear + 1);
    };
    p.prevYear = function () {
        p.setYearMonth(p.currentYear - 1);
    };

    // HTML Layout
    p.layout = function (value) {
        var pickerHTML = '';
        var pickerClass = '';
        var i;
        p.value = value;

        var layoutDate = p.value && p.value.length ? p.value[0] : new Date().setHours(0, 0, 0, 0);
        var prevMonthHTML = p.monthHTML(layoutDate, 'prev');
        var currentMonthHTML = p.monthHTML(layoutDate);
        var nextMonthHTML = p.monthHTML(layoutDate, 'next');
        var monthsHTML = '<div class="picker-calendar-months"><div class="picker-calendar-months-wrapper">' + (prevMonthHTML + currentMonthHTML + nextMonthHTML) + '</div></div>';
        // Week days header
        var weekHeaderHTML = '';
        if (p.params.weekHeader) {
            for (i = 0; i < 7; i++) {
                var weekDayIndex = i + p.params.firstDay > 6 ? i - 7 + p.params.firstDay : i + p.params.firstDay;
                var dayName = p.params.dayNamesShort[weekDayIndex];
                weekHeaderHTML += '<div class="picker-calendar-week-day ' + (p.params.weekendDays.indexOf(weekDayIndex) >= 0 ? 'picker-calendar-week-day-weekend' : '') + '"> ' + dayName + '</div>';
            }
            weekHeaderHTML = '<div class="picker-calendar-week-days">' + weekHeaderHTML + '</div>';
        }
        pickerClass = 'picker-modal picker-calendar ' + (p.params.cssClass || '');
        var toolbarHTML = p.params.toolbar ? p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText) : '';
        if (p.params.toolbar) {
            toolbarHTML = p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText).replace(/{{monthPicker}}/g, p.params.monthPicker ? p.params.monthPickerTemplate : '').replace(/{{yearPicker}}/g, p.params.yearPicker ? p.params.yearPickerTemplate : '');
        }

        pickerHTML = '<div class="' + pickerClass + '">' + toolbarHTML + '<div class="picker-modal-inner">' + weekHeaderHTML + monthsHTML + '</div>' + '</div>';

        return pickerHTML;
    };
    p.opened = false;
    p.open = function (el) {
        p.container = el;
        var updateValue = false;
        if (!p.opened) {
            p.wrapper = p.container.find('.picker-calendar-months-wrapper');

            // Months
            p.months = p.wrapper.find('.picker-calendar-month');

            // Update current month and year
            p.updateCurrentMonthYear();

            // Set initial translate
            p.monthsTranslate = 0;
            p.setMonthsTranslate();

            // Init events
            p.initCalendarEvents();
        }

        // Set flag
        p.opened = true;
        if (p.params.onMonthAdd) {
            p.months.each(function () {
                p.params.onMonthAdd(p, this);
            });
        }
        if (p.params.onOpen) p.params.onOpen(p);
    };
    p.destroy = function () {
        p.destroyCalendarEvents();
    };
    return p;
};

/*
 *props: inline multi
 *
 */
module.exports = React.createClass({
    displayName: 'exports',

    getInitialState: function getInitialState() {
        return {
            calendar: new Calendar(this.props.params)
        };
    },
    componentDidMount: function componentDidMount() {
        var $el = $(this.refs.container.getDOMNode()).find('.picker-calendar');
        this.state.calendar.open($el);
        if (this.props.inline) {
            $el.addClass('picker-modal-inline');
        } else {
            $el.addClass('picker-modal-on');
            setTimeout(function () {
                $el.css({ '-webkit-transform': 'translate3d(0,0,0)' });
            }, 0);
        }
    },
    componentWillUnmount: function componentWillUnmount() {
        this.state.calendar.destroy();
    },
    render: function render() {
        var params = this.props.params;
        var layout = this.state.calendar.layout(params ? params.value : null);
        return React.createElement('div', { dangerouslySetInnerHTML: { __html: layout }, ref: 'container' });
    }
});

},{"react":undefined}],65:[function(require,module,exports){
'use strict';

module.exports = {
	Calendar: require('./Calendar')
};

},{"./Calendar":64}],66:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');
var CardHeader = require('./CardHeader');
var CardFooter = require('./CardFooter');
var CardContent = require('./CardContent');
var CardContentInner = require('./CardContentInner');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        var obj = {
            "card": true
        };
        this.props['class'] && (obj[this.props['class']] = true);
        var className = cn(obj);
        if (this.props.inner) {
            return React.createElement(
                'div',
                { className: className, style: this.props.style },
                React.createElement(
                    CardContent,
                    null,
                    !!this.props.header && React.createElement(
                        CardHeader,
                        null,
                        this.props.header
                    ),
                    !!this.props.customHeader && this.props.customHeader,
                    React.createElement(
                        CardContentInner,
                        null,
                        this.props.children
                    ),
                    !!this.props.footer && React.createElement(
                        CardFooter,
                        null,
                        this.props.footer
                    ),
                    !!this.props.customFooter && this.props.customFooter
                )
            );
        } else {
            return React.createElement(
                'div',
                { className: className, style: this.props.style },
                React.createElement(
                    CardContent,
                    null,
                    !!this.props.header && React.createElement(
                        CardHeader,
                        null,
                        this.props.header
                    ),
                    !!this.props.customHeader && this.props.customHeader,
                    this.props.children,
                    !!this.props.footer && React.createElement(
                        CardFooter,
                        null,
                        this.props.footer
                    ),
                    !!this.props.customFooter && this.props.customFooter
                )
            );
        }
    }
});

},{"./CardContent":67,"./CardContentInner":68,"./CardFooter":69,"./CardHeader":70,"classnames":52,"react":undefined}],67:[function(require,module,exports){
'use strict';

var React = require('react');
var CardContentInner = require('./CardContentInner');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        if (this.props.inner) {
            return React.createElement(
                'div',
                { className: 'card-content', style: this.props.style },
                React.createElement(
                    CardContentInner,
                    null,
                    this.props.children
                )
            );
        } else {
            return React.createElement(
                'div',
                { className: 'card-content', style: this.props.style },
                this.props.children
            );
        }
    }
});

},{"./CardContentInner":68,"react":undefined}],68:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "card-content-inner", style: this.props.style },
            this.props.children
        );
    }
});

},{"react":undefined}],69:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "card-footer", style: this.props.style },
            this.props.children
        );
    }
});

},{"react":undefined}],70:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        var obj = {
            "card-header": true
        };
        this.props['class'] && (obj[this.props['class']] = true);
        var className = cn(obj);
        return React.createElement(
            'div',
            { className: className, style: this.props.style },
            this.props.children
        );
    }
});

},{"classnames":52,"react":undefined}],71:[function(require,module,exports){
'use strict';

module.exports = {
	Card: require('./Card'),
	CardContent: require('./CardContent'),
	CardContentInner: require('./CardContentInner'),
	CardFooter: require('./CardFooter'),
	CardHeader: require('./CardHeader')
};

},{"./Card":66,"./CardContent":67,"./CardContentInner":68,"./CardFooter":69,"./CardHeader":70}],72:[function(require,module,exports){
'use strict';

var React = require('react');
var assign = require('object-assign');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        var obj = {
            "row": this.props.row
        };
        this.props['class'] && (obj[this.props['class']] = true);
        var className = cn("content-block", obj);
        var style = assign({}, this.props.style, this.props.relative && { position: "relative" });
        return React.createElement(
            'div',
            { className: className, style: style },
            this.props.children
        );
    }
});

},{"classnames":52,"object-assign":53,"react":undefined}],73:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "content-block-inner", style: this.props.style },
            this.props.children
        );
    }
});

},{"react":undefined}],74:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "content-block-title" },
            this.props.children
        );
    }
});

},{"react":undefined}],75:[function(require,module,exports){
'use strict';

module.exports = {
	ContentBlock: require('./ContentBlock'),
	ContentBlockInner: require('./ContentBlockInner'),
	ContentBlockTitle: require('./ContentBlockTitle')
};

},{"./ContentBlock":72,"./ContentBlockInner":73,"./ContentBlockTitle":74}],76:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
  displayName: "exports",

  getDefaultProps: function getDefaultProps() {
    return {
      param: { min: 0, max: 100, value: 50, step: 1 }
    };
  },
  render: function render() {
    var param = this.props.param;
    return React.createElement(
      "div",
      { className: "range-slider" },
      React.createElement("input", { type: "range", min: param.min, max: param.max, defaultValue: param.value, step: param.step })
    );
  }
});

},{"react":undefined}],77:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    getInitialState: function getInitialState() {
        return {
            checked: this.props.checked
        };
    },
    onChange: function onChange(e) {
        var checked = e.target.checked;
        this.setState({ checked: checked });
        this.props.onChange && this.props.onChange(checked);
    },
    render: function render() {
        return React.createElement(
            "label",
            { className: "label-switch" },
            React.createElement("input", { type: "checkbox", checked: this.state.checked, onChange: this.onChange }),
            React.createElement("div", { className: "checkbox" })
        );
    }
});

},{"react":undefined}],78:[function(require,module,exports){
'use strict';

module.exports = {
	Slider: require('./Slider'),
	Switch: require('./Switch')
};

},{"./Slider":76,"./Switch":77}],79:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    getDefaultProps: function getDefaultProps() {
        return {
            per: 100
        };
    },
    render: function render() {
        var obj = {};
        obj['col-' + this.props.per] = true;
        var className = cn(obj);
        if (this.props.p) {
            return React.createElement(
                'p',
                { className: className },
                this.props.children
            );
        } else {
            return React.createElement(
                'div',
                { className: className },
                this.props.children
            );
        }
    }
});

},{"classnames":52,"react":undefined}],80:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    getDefaultProps: function getDefaultProps() {
        return {
            noGutter: false
        };
    },
    render: function render() {
        var className = cn({
            'no-gutter': this.props.noGutter,
            'row': true
        });
        return React.createElement(
            'div',
            { className: className },
            this.props.children
        );
    }
});

},{"classnames":52,"react":undefined}],81:[function(require,module,exports){
'use strict';

module.exports = {
	Col: require('./Col'),
	Row: require('./Row')
};

},{"./Col":79,"./Row":80}],82:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');
var assign = require('object-assign');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        var obj = {
            'icon': true
        };
        this.props.name && (obj[this.props.name] = true);
        var className = cn(obj);

        var style = {};
        if (this.props.round) {
            style.borderRadius = '50%';
        }
        if (this.props.color) {
            style.color = this.props.color;
        }
        style = assign(style, this.props.style);
        return React.createElement('i', { className: className, style: style });
    }
});

},{"classnames":52,"object-assign":53,"react":undefined}],83:[function(require,module,exports){
'use strict';

module.exports = {
	Icon: require('./Icon')
};

},{"./Icon":82}],84:[function(require,module,exports){
'use strict';

module.exports = {
	Accordion: require('./accordion'),
	Badge: require('./badge'),
	Button: require('./button'),
	Calendar: require('./calendar'),
	Card: require('./card'),
	Content: require('./content'),
	Form: require('./form'),
	Grid: require('./grid'),
	Icon: require('./icon'),
	List: require('./list'),
	Message: require('./message'),
	Mixins: require('./mixins'),
	Modal: require('./modal'),
	Notifications: require('./notifications'),
	Photo: require('./photo'),
	Picker: require('./picker'),
	Refresh: require('./refresh'),
	Search: require('./search'),
	Welcome: require('./welcome'),
	System: require('./system'),
	View: require('./view')
};

},{"./accordion":58,"./badge":60,"./button":63,"./calendar":65,"./card":71,"./content":75,"./form":78,"./grid":81,"./icon":83,"./list":103,"./message":108,"./mixins":114,"./modal":137,"./notifications":139,"./photo":141,"./picker":149,"./refresh":152,"./search":156,"./system":159,"./view":162,"./welcome":172}],85:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "li",
            { className: "list-group-title" },
            this.props.children
        );
    }
});

},{"react":undefined}],86:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

function IndexedList(params) {
    var p = this;
    var isTouched,
        lastLetter,
        lastPreviewLetter,
        groupPostion = {};
    var eventsTarget = params.container;

    var pageContainer = $('.page');
    var pageContent = $('.page').find('.page-content');
    var searchBar = $(pageContainer).find('.searchbar').length > 0;
    var serachBarOffset = searchBar * 44;
    var fixedNavbar = pageContent.parents('.navbar-fixed').length > 0 || pageContent.parents('.navbar-through').length > 0;
    var fixedNavbarOffset = fixedNavbar * 44;
    var toolBar = pageContent.parents('.toolbar-through').length > 0;
    var toolBarOffset = toolBar * 44;

    function callback(letter) {
        var scrollToEl = pageContent.find('.list-group ul li[data-index-letter="' + letter + '"]');
        if (!scrollToEl.length) return;
        var scrollTop = scrollToEl.offset().top + pageContent.scrollTop() - fixedNavbarOffset - serachBarOffset;
        pageContent.scrollTop(scrollTop);
    }

    function handleTouchStart(e) {
        e.preventDefault();
        isTouched = true;

        var target = $(e.target);
        if (!target.is('li')) target = target.parents('li');
        if (target.length > 0) {
            scrollToLetter(target.eq(0).data('index-letter'));
        }
    }

    function handleTouchMove(e) {
        if (!isTouched) return;
        e.preventDefault();
        var target;
        if (e.type === 'mousemove') {
            target = $(e.target);
        } else {
            target = $(document.elementFromPoint(e.touches[0].pageX, e.touches[0].pageY));
        }
        if (!target.is('li')) target = target.parents('li');

        if (target.length === 0) return;
        if (target.length > 0 && !target.is('.list-index li')) return;

        scrollToLetter(target.eq(0).data('index-letter'));
    }

    function handleTouchEnd(e) {
        isTouched = false;
    }

    function handleClick(e) {
        var target = $(e.target);
        if (!target.is('li')) target = target.parents('li');
        if (target.length > 0) {
            scrollToLetter(target.eq(0).data('index-letter'));
        }
    }

    function handlePageScroll() {
        var inf = $(this);
        var scrollTop = inf[0].scrollTop;
        var scrollHeight = inf[0].scrollHeight;
        var height = inf[0].offsetHeight;

        var prevLetter = 'A';
        for (var letter in groupPostion) {
            var top = groupPostion[letter].offset().top - toolBarOffset - searchBar;
            if (top >= 0) {
                break;
            }
            prevLetter = letter;
        }
        if (lastPreviewLetter !== prevLetter) {
            lastPreviewLetter = prevLetter;
            params.callback(prevLetter);
        }
    }

    function scrollToLetter(letter) {
        if (lastLetter !== letter) {
            lastLetter = letter;
            callback(letter);
            params.callback(letter);
        }
    }

    p.init = function () {
        if (searchBar) {
            eventsTarget.css('margin-top', '44px');
        }
        params.letters.map(function (letter) {
            groupPostion[letter] = pageContent.find('.list-group ul li[data-index-letter="' + letter + '"]');
        });

        pageContent.on('scroll', handlePageScroll);

        eventsTarget.on('click', '.list-index li', handleClick);
        eventsTarget.on(app.touchEvents.start, handleTouchStart);
        eventsTarget.on(app.touchEvents.move, handleTouchMove);
        eventsTarget.on(app.touchEvents.end, handleTouchEnd);
    };

    p.destory = function () {
        eventsTarget.off('click', '.list-index li', handleClick);
        eventsTarget.off(app.touchEvents.start, handleTouchStart);
        eventsTarget.off(app.touchEvents.move, handleTouchMove);
        eventsTarget.off(app.touchEvents.end, handleTouchEnd);
    };

    return p;
}

module.exports = React.createClass({
    displayName: 'exports',

    getInitialState: function getInitialState() {
        return {
            activeAlpha: this.props.letters[0]
        };
    },
    componentDidMount: function componentDidMount() {
        var self = this;
        var callback = app.methods.setActiveAlpha = function (letter) {
            self.setState({ activeAlpha: letter });
        };
        this.indexedList = new IndexedList({
            container: $(this.refs.list.getDOMNode()),
            callback: callback,
            letters: this.props.letters
        });
        this.indexedList.init();
    },
    componentWillUnmount: function componentWillUnmount() {
        this.indexedList.destory();
    },
    render: function render() {
        var _this = this;

        return React.createElement(
            'ul',
            { className: 'list-index', ref: 'list', style: this.props.style },
            this.props.letters.map(function (letter) {
                var obj = {};
                if (_this.state.activeAlpha == letter) {
                    obj.active = true;
                }
                return React.createElement(
                    'li',
                    { key: letter, className: cn(obj), 'data-index-letter': letter },
                    letter
                );
            })
        );
    }
});

},{"classnames":52,"react":undefined}],87:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "item-after" },
            this.props.children
        );
    }
});

},{"react":undefined}],88:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    onChange: function onChange(i, e) {
        this.props.onChange(i, e.target.checked);
    },
    render: function render() {
        var content;
        if (this.props.link) {
            if (this.props.swipeout) {
                content = React.createElement(
                    'div',
                    { className: 'swipeout-content' },
                    React.createElement(
                        'a',
                        { href: '#', className: 'item-link item-content', onClick: this.props.onTap },
                        this.props.children
                    )
                );
            } else {
                content = React.createElement(
                    'a',
                    { href: '#', className: 'item-link item-content', onClick: this.props.onTap },
                    this.props.children
                );
            }
        } else {
            var dcn = cn("item-content", { "swipeout-content": this.props.swipeout });
            content = React.createElement(
                'div',
                { className: dcn, onClick: this.props.onTap },
                this.props.children
            );
        }
        var className = cn({ "swipeout": this.props.swipeout });

        if (this.props.radio) {
            var onChange = this.onChange.bind(null, this.props.value);
            return React.createElement(
                'li',
                null,
                React.createElement(
                    'label',
                    { className: 'label-radio item-content' },
                    React.createElement('input', { type: 'radio', value: this.props.value, name: this.props.name, defaultChecked: this.props.checked, onChange: onChange }),
                    this.props.children
                )
            );
        } else if (this.props.checkbox) {
            var onChange = this.onChange.bind(null, this.props.value);
            return React.createElement(
                'li',
                null,
                React.createElement(
                    'label',
                    { className: 'label-checkbox item-content' },
                    React.createElement('input', { type: 'checkbox', value: this.props.value, name: this.props.name, defaultChecked: this.props.checked, onChange: onChange }),
                    React.createElement(
                        'div',
                        { className: 'item-media' },
                        React.createElement('i', { className: 'icon icon-form-checkbox' })
                    ),
                    this.props.children
                )
            );
        } else {
            return React.createElement(
                'li',
                { className: className },
                content,
                this.props.sortable && React.createElement('div', { className: 'sortable-handler' }),
                this.props.swipeoutLeft && React.createElement(
                    'div',
                    { className: 'swipeout-actions-left' },
                    this.props.swipeoutLeft
                ),
                this.props.swipeoutRight && React.createElement(
                    'div',
                    { className: 'swipeout-actions-right' },
                    this.props.swipeoutRight
                )
            );
        }
    }
});

},{"classnames":52,"react":undefined}],89:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "li",
            { className: "item-divider" },
            this.props.children
        );
    }
});

},{"react":undefined}],90:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "item-inner", style: this.props.style, onClick: this.props.onTap },
            this.props.children
        );
    }
});

},{"react":undefined}],91:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "item-input" },
            this.props.children
        );
    }
});

},{"react":undefined}],92:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    getDefaultProps: function getDefaultProps() {
        return {
            link: false
        };
    },
    render: function render() {
        return React.createElement(
            "a",
            { href: "#", className: "item-link item-content", onClick: this.props.onTap },
            this.props.children
        );
    }
});

},{"react":undefined}],93:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "item-media" },
            this.props.children
        );
    }
});

},{"react":undefined}],94:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "item-subtitle" },
            this.props.children
        );
    }
});

},{"react":undefined}],95:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "item-text", style: this.props.style },
            this.props.children
        );
    }
});

},{"react":undefined}],96:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        var className = cn({
            "item-title": true,
            "label": this.props.label
        });
        return React.createElement(
            'div',
            { className: className, style: this.props.style },
            this.props.children
        );
    }
});

},{"classnames":52,"react":undefined}],97:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "item-title-row" },
            this.props.children
        );
    }
});

},{"react":undefined}],98:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

var Sortable = function Sortable(container) {
	var p = this;

	p.toggle = function () {
		container.toggleClass('sortable-opened');
		if (container.hasClass('sortable-opened')) {
			container.trigger('open');
		} else {
			container.trigger('close');
		}
		return container;
	};
	p.open = function () {
		container.addClass('sortable-opened');
		container.trigger('open');
		return container;
	};
	p.close = function () {
		container.removeClass('sortable-opened');
		container.trigger('close');
		return container;
	};
	p.init = function () {
		var isTouched, isMoved, touchStartY, touchesDiff, sortingEl, sortingElHeight, sortingItems, minTop, maxTop, insertAfter, insertBefore;

		function handleTouchStart(e) {
			isMoved = false;
			isTouched = true;
			touchStartY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
			/*jshint validthis:true */
			sortingEl = $(this).parent();
			sortingItems = sortingEl.parent().find('li');
			e.preventDefault();
		}
		function handleTouchMove(e) {
			if (!isTouched || !sortingEl) return;
			var pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
			var pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
			if (!isMoved) {
				sortingEl.addClass('sorting');
				container.addClass('sortable-sorting');
				minTop = sortingEl[0].offsetTop;
				maxTop = sortingEl.parent().height() - sortingEl[0].offsetTop - sortingEl.height();
				sortingElHeight = sortingEl[0].offsetHeight;
			}
			isMoved = true;

			e.preventDefault();
			e.f7PreventPanelSwipe = true;
			touchesDiff = pageY - touchStartY;
			var translate = touchesDiff;
			if (translate < -minTop) translate = -minTop;
			if (translate > maxTop) translate = maxTop;
			sortingEl.transform('translate3d(0,' + translate + 'px,0)');

			insertBefore = insertAfter = undefined;

			sortingItems.each(function () {
				var currentEl = $(this);
				if (currentEl[0] === sortingEl[0]) return;
				var currentElOffset = currentEl[0].offsetTop;
				var currentElHeight = currentEl.height();
				var sortingElOffset = sortingEl[0].offsetTop + translate;

				if (sortingElOffset >= currentElOffset - currentElHeight / 2 && sortingEl.index() < currentEl.index()) {
					currentEl.transform('translate3d(0, ' + -sortingElHeight + 'px,0)');
					insertAfter = currentEl;
					insertBefore = undefined;
				} else if (sortingElOffset <= currentElOffset + currentElHeight / 2 && sortingEl.index() > currentEl.index()) {
					currentEl.transform('translate3d(0, ' + sortingElHeight + 'px,0)');
					insertAfter = undefined;
					if (!insertBefore) insertBefore = currentEl;
				} else {
					$(this).transform('translate3d(0, 0%,0)');
				}
			});
		}
		function handleTouchEnd(e) {
			if (!isTouched || !isMoved) {
				isTouched = false;
				isMoved = false;
				return;
			}
			e.preventDefault();
			sortingItems.transform('');
			sortingEl.removeClass('sorting');
			container.removeClass('sortable-sorting');
			var virtualList, oldIndex, newIndex;
			if (insertAfter) {
				sortingEl.insertAfter(insertAfter);
				sortingEl.trigger('sort');
			}
			if (insertBefore) {
				sortingEl.insertBefore(insertBefore);
				sortingEl.trigger('sort');
			}
			if ((insertAfter || insertBefore) && container.hasClass('virtual-list')) {
				virtualList = container[0].f7VirtualList;
				oldIndex = sortingEl[0].f7VirtualListIndex;
				newIndex = insertBefore ? insertBefore[0].f7VirtualListIndex : insertAfter[0].f7VirtualListIndex;
				if (virtualList) virtualList.moveItem(oldIndex, newIndex);
			}
			insertAfter = insertBefore = undefined;
			isTouched = false;
			isMoved = false;
		}
		$(document).on(app.touchEvents.start, '.list-block.sortable .sortable-handler', handleTouchStart);
		if (app.support.touch) {
			$(document).on(app.touchEvents.move, '.list-block.sortable .sortable-handler', handleTouchMove);
			$(document).on(app.touchEvents.end, '.list-block.sortable .sortable-handler', handleTouchEnd);
		} else {
			$(document).on(app.touchEvents.move, handleTouchMove);
			$(document).on(app.touchEvents.end, handleTouchEnd);
		}
		p.destroySortableEvents = function () {
			$(document).off(app.touchEvents.start, '.list-block.sortable .sortable-handler', handleTouchStart);
			if (app.support.touch) {
				$(document).off(app.touchEvents.move, '.list-block.sortable .sortable-handler', handleTouchMove);
				$(document).off(app.touchEvents.end, '.list-block.sortable .sortable-handler', handleTouchEnd);
			} else {
				$(document).off(app.touchEvents.move, handleTouchMove);
				$(document).off(app.touchEvents.end, handleTouchEnd);
			}
		};
	};
	p.destory = function () {
		p.destroySortableEvents && p.destroySortableEvents();
	};

	return p;
};

var Swipeout = function Swipeout(container) {
	var p = this;

	app.swipeoutOpenedEl = undefined;
	app.allowSwipeout = true;
	app.swipeoutActionsNoFold = false;
	app.swipeoutNoFollow = false;

	p.init = function (swipeoutEl) {
		var isTouched,
		    isMoved,
		    isScrolling,
		    touchesStart = {},
		    touchStartTime,
		    touchesDiff,
		    swipeOutEl,
		    swipeOutContent,
		    actionsRight,
		    actionsLeft,
		    actionsLeftWidth,
		    actionsRightWidth,
		    translate,
		    opened,
		    openedActions,
		    buttonsLeft,
		    buttonsRight,
		    direction,
		    overswipeLeftButton,
		    overswipeRightButton,
		    overswipeLeft,
		    overswipeRight,
		    noFoldLeft,
		    noFoldRight;
		$(document).on(app.touchEvents.start, function (e) {
			if (app.swipeoutOpenedEl) {
				var target = $(e.target);
				if (!(app.swipeoutOpenedEl.is(target[0]) || target.parents('.swipeout').is(app.swipeoutOpenedEl) || target.hasClass('modal-in') || target.hasClass('modal-overlay') || target.hasClass('actions-modal') || target.parents('.actions-modal.modal-in, .modal.modal-in').length > 0)) {
					p.close(app.swipeoutOpenedEl);
				}
			}
		});

		function handleTouchStart(e) {
			if (!app.allowSwipeout) return;
			isMoved = false;
			isTouched = true;
			isScrolling = undefined;
			touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
			touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
			touchStartTime = new Date().getTime();
		}
		function handleTouchMove(e) {
			if (!isTouched) return;
			var pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
			var pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
			if (typeof isScrolling === 'undefined') {
				isScrolling = !!(isScrolling || Math.abs(pageY - touchesStart.y) > Math.abs(pageX - touchesStart.x));
			}
			if (isScrolling) {
				isTouched = false;
				return;
			}

			if (!isMoved) {
				if ($('.list-block.sortable-opened').length > 0) return;
				/*jshint validthis:true */
				swipeOutEl = $(this);
				swipeOutContent = swipeOutEl.find('.swipeout-content');
				actionsRight = swipeOutEl.find('.swipeout-actions-right');
				actionsLeft = swipeOutEl.find('.swipeout-actions-left');
				actionsLeftWidth = actionsRightWidth = buttonsLeft = buttonsRight = overswipeRightButton = overswipeLeftButton = null;
				noFoldLeft = actionsLeft.hasClass('swipeout-actions-no-fold') || app.swipeoutActionsNoFold;
				noFoldRight = actionsRight.hasClass('swipeout-actions-no-fold') || app.swipeoutActionsNoFold;
				if (actionsLeft.length > 0) {
					actionsLeftWidth = actionsLeft.outerWidth();
					buttonsLeft = actionsLeft.children('a');
					overswipeLeftButton = actionsLeft.find('.swipeout-overswipe');
				}
				if (actionsRight.length > 0) {
					actionsRightWidth = actionsRight.outerWidth();
					buttonsRight = actionsRight.children('a');
					overswipeRightButton = actionsRight.find('.swipeout-overswipe');
				}
				opened = swipeOutEl.hasClass('swipeout-opened');
				if (opened) {
					openedActions = swipeOutEl.find('.swipeout-actions-left.swipeout-actions-opened').length > 0 ? 'left' : 'right';
				}
				swipeOutEl.removeClass('transitioning');
				if (!app.swipeoutNoFollow) {
					swipeOutEl.find('.swipeout-actions-opened').removeClass('swipeout-actions-opened');
					swipeOutEl.removeClass('swipeout-opened');
				}
			}
			isMoved = true;
			e.preventDefault();

			touchesDiff = pageX - touchesStart.x;
			translate = touchesDiff;

			if (opened) {
				if (openedActions === 'right') translate = translate - actionsRightWidth;else translate = translate + actionsLeftWidth;
			}

			if (translate > 0 && actionsLeft.length === 0 || translate < 0 && actionsRight.length === 0) {
				if (!opened) {
					isTouched = isMoved = false;
					return;
				}
				translate = 0;
			}

			if (translate < 0) direction = 'to-left';else if (translate > 0) direction = 'to-right';else {
				if (direction) direction = direction;else direction = 'to-left';
			}

			var i, buttonOffset, progress;

			e.f7PreventPanelSwipe = true;
			if (app.swipeoutNoFollow) {
				if (opened) {
					if (openedActions === 'right' && touchesDiff > 0) {
						p.close(swipeOutEl);
					}
					if (openedActions === 'left' && touchesDiff < 0) {
						p.close(swipeOutEl);
					}
				} else {
					if (touchesDiff < 0 && actionsRight.length > 0) {
						p.open(swipeOutEl, 'right');
					}
					if (touchesDiff > 0 && actionsLeft.length > 0) {
						p.open(swipeOutEl, 'left');
					}
				}
				isTouched = false;
				isMoved = false;
				return;
			}
			overswipeLeft = false;
			overswipeRight = false;
			var $button;
			if (actionsRight.length > 0) {
				// Show right actions
				progress = translate / actionsRightWidth;
				if (translate < -actionsRightWidth) {
					translate = -actionsRightWidth - Math.pow(-translate - actionsRightWidth, 0.8);
					if (overswipeRightButton.length > 0) {
						overswipeRight = true;
					}
				}
				for (i = 0; i < buttonsRight.length; i++) {
					if (typeof buttonsRight[i]._buttonOffset === 'undefined') {
						buttonsRight[i]._buttonOffset = buttonsRight[i].offsetLeft;
					}
					buttonOffset = buttonsRight[i]._buttonOffset;
					$button = $(buttonsRight[i]);
					if (overswipeRightButton.length > 0 && $button.hasClass('swipeout-overswipe')) {
						$button.css({ left: (overswipeRight ? -buttonOffset : 0) + 'px' });
					}
					$button.transform('translate3d(' + (translate - buttonOffset * (1 + Math.max(progress, -1))) + 'px,0,0)');
				}
			}
			if (actionsLeft.length > 0) {
				// Show left actions
				progress = translate / actionsLeftWidth;
				if (translate > actionsLeftWidth) {
					translate = actionsLeftWidth + Math.pow(translate - actionsLeftWidth, 0.8);
					if (overswipeLeftButton.length > 0) {
						overswipeLeft = true;
					}
				}
				for (i = 0; i < buttonsLeft.length; i++) {
					if (typeof buttonsLeft[i]._buttonOffset === 'undefined') {
						buttonsLeft[i]._buttonOffset = actionsLeftWidth - buttonsLeft[i].offsetLeft - buttonsLeft[i].offsetWidth;
					}
					buttonOffset = buttonsLeft[i]._buttonOffset;
					$button = $(buttonsLeft[i]);
					if (overswipeLeftButton.length > 0 && $button.hasClass('swipeout-overswipe')) {
						$button.css({ left: (overswipeLeft ? buttonOffset : 0) + 'px' });
					}
					if (buttonsLeft.length > 1) {
						$button.css('z-index', buttonsLeft.length - i);
					}
					$button.transform('translate3d(' + (translate + buttonOffset * (1 - Math.min(progress, 1))) + 'px,0,0)');
				}
			}
			swipeOutContent.transform('translate3d(' + translate + 'px,0,0)');
		}
		function handleTouchEnd(e) {
			if (!isTouched || !isMoved) {
				isTouched = false;
				isMoved = false;
				return;
			}

			isTouched = false;
			isMoved = false;
			var timeDiff = new Date().getTime() - touchStartTime;
			var action, actionsWidth, actions, buttons, i, noFold;

			noFold = direction === 'to-left' ? noFoldRight : noFoldLeft;
			actions = direction === 'to-left' ? actionsRight : actionsLeft;
			actionsWidth = direction === 'to-left' ? actionsRightWidth : actionsLeftWidth;

			if (timeDiff < 300 && (touchesDiff < -10 && direction === 'to-left' || touchesDiff > 10 && direction === 'to-right') || timeDiff >= 300 && Math.abs(translate) > actionsWidth / 2) {
				action = 'open';
			} else {
				action = 'close';
			}
			if (timeDiff < 300) {
				if (Math.abs(translate) === 0) action = 'close';
				if (Math.abs(translate) === actionsWidth) action = 'open';
			}

			if (action === 'open') {
				app.swipeoutOpenedEl = swipeOutEl;
				swipeOutEl.trigger('open');
				swipeOutEl.addClass('swipeout-opened transitioning');
				var newTranslate = direction === 'to-left' ? -actionsWidth : actionsWidth;
				swipeOutContent.transform('translate3d(' + newTranslate + 'px,0,0)');
				actions.addClass('swipeout-actions-opened');
				buttons = direction === 'to-left' ? buttonsRight : buttonsLeft;
				if (buttons) {
					for (i = 0; i < buttons.length; i++) {
						$(buttons[i]).transform('translate3d(' + newTranslate + 'px,0,0)');
					}
				}
				if (overswipeRight) {
					actionsRight.find('.swipeout-overswipe')[0].click();
				}
				if (overswipeLeft) {
					actionsLeft.find('.swipeout-overswipe')[0].click();
				}
			} else {
				swipeOutEl.trigger('close');
				app.swipeoutOpenedEl = undefined;
				swipeOutEl.addClass('transitioning').removeClass('swipeout-opened');
				swipeOutContent.transform('');
				actions.removeClass('swipeout-actions-opened');
			}

			var buttonOffset;
			if (buttonsLeft && buttonsLeft.length > 0 && buttonsLeft !== buttons) {
				for (i = 0; i < buttonsLeft.length; i++) {
					buttonOffset = buttonsLeft[i]._buttonOffset;
					if (typeof buttonOffset === 'undefined') {
						buttonsLeft[i]._buttonOffset = actionsLeftWidth - buttonsLeft[i].offsetLeft - buttonsLeft[i].offsetWidth;
					}
					$(buttonsLeft[i]).transform('translate3d(' + buttonOffset + 'px,0,0)');
				}
			}
			if (buttonsRight && buttonsRight.length > 0 && buttonsRight !== buttons) {
				for (i = 0; i < buttonsRight.length; i++) {
					buttonOffset = buttonsRight[i]._buttonOffset;
					if (typeof buttonOffset === 'undefined') {
						buttonsRight[i]._buttonOffset = buttonsRight[i].offsetLeft;
					}
					$(buttonsRight[i]).transform('translate3d(' + -buttonOffset + 'px,0,0)');
				}
			}
			swipeOutContent.transitionEnd(function (e) {
				if (opened && action === 'open' || closed && action === 'close') return;
				swipeOutEl.trigger(action === 'open' ? 'opened' : 'closed');
				if (opened && action === 'close') {
					if (actionsRight.length > 0) {
						buttonsRight.transform('');
					}
					if (actionsLeft.length > 0) {
						buttonsLeft.transform('');
					}
				}
			});
		}
		if (swipeoutEl) {
			$(swipeoutEl).on(app.touchEvents.start, handleTouchStart);
			$(swipeoutEl).on(app.touchEvents.move, handleTouchMove);
			$(swipeoutEl).on(app.touchEvents.end, handleTouchEnd);
		} else {
			$(document).on(app.touchEvents.start, '.list-block li.swipeout', handleTouchStart);
			$(document).on(app.touchEvents.move, '.list-block li.swipeout', handleTouchMove);
			$(document).on(app.touchEvents.end, '.list-block li.swipeout', handleTouchEnd);
		}
		p.destroySwipeoutEvents = function () {
			if (swipeoutEl) {
				$(swipeoutEl).off(app.touchEvents.start, handleTouchStart);
				$(swipeoutEl).off(app.touchEvents.move, handleTouchMove);
				$(swipeoutEl).off(app.touchEvents.end, handleTouchEnd);
			} else {
				$(document).off(app.touchEvents.start, '.list-block li.swipeout', handleTouchStart);
				$(document).off(app.touchEvents.move, '.list-block li.swipeout', handleTouchMove);
				$(document).off(app.touchEvents.end, '.list-block li.swipeout', handleTouchEnd);
			}
		};
	};
	p.open = function (el, dir, callback) {
		el = $(el);
		if (arguments.length === 2) {
			if (typeof arguments[1] === 'function') {
				callback = dir;
			}
		}

		if (el.length === 0) return;
		if (el.length > 1) el = $(el[0]);
		if (!el.hasClass('swipeout') || el.hasClass('swipeout-opened')) return;
		if (!dir) {
			if (el.find('.swipeout-actions-right').length > 0) dir = 'right';else dir = 'left';
		}
		var swipeOutActions = el.find('.swipeout-actions-' + dir);
		if (swipeOutActions.length === 0) return;
		var noFold = swipeOutActions.hasClass('swipeout-actions-no-fold') || app.swipeoutActionsNoFold;
		el.trigger('open').addClass('swipeout-opened').removeClass('transitioning');
		swipeOutActions.addClass('swipeout-actions-opened');
		var buttons = swipeOutActions.children('a');
		var swipeOutActionsWidth = swipeOutActions.outerWidth();
		var translate = dir === 'right' ? -swipeOutActionsWidth : swipeOutActionsWidth;
		var i;
		if (buttons.length > 1) {
			for (i = 0; i < buttons.length; i++) {
				if (dir === 'right') {
					$(buttons[i]).transform('translate3d(' + -buttons[i].offsetLeft + 'px,0,0)');
				} else {
					$(buttons[i]).css('z-index', buttons.length - i).transform('translate3d(' + (swipeOutActionsWidth - buttons[i].offsetWidth - buttons[i].offsetLeft) + 'px,0,0)');
				}
			}
			var clientLeft = buttons[1].clientLeft;
		}
		el.addClass('transitioning');
		for (i = 0; i < buttons.length; i++) {
			$(buttons[i]).transform('translate3d(' + translate + 'px,0,0)');
		}
		el.find('.swipeout-content').transform('translate3d(' + translate + 'px,0,0)').transitionEnd(function () {
			el.trigger('opened');
			if (callback) callback.call(el[0]);
		});
		app.swipeoutOpenedEl = el;
	};
	p.close = function (el, callback) {
		el = $(el);
		if (el.length === 0) return;
		if (!el.hasClass('swipeout-opened')) return;
		var dir = el.find('.swipeout-actions-opened').hasClass('swipeout-actions-right') ? 'right' : 'left';
		var swipeOutActions = el.find('.swipeout-actions-opened').removeClass('swipeout-actions-opened');
		var noFold = swipeOutActions.hasClass('swipeout-actions-no-fold') || app.swipeoutActionsNoFold;
		var buttons = swipeOutActions.children('a');
		var swipeOutActionsWidth = swipeOutActions.outerWidth();
		app.allowSwipeout = false;
		el.trigger('close');
		el.removeClass('swipeout-opened').addClass('transitioning');

		var closeTO;
		function onSwipeoutClose() {
			app.allowSwipeout = true;
			buttons.transform('');
			el.trigger('closed');
			if (callback) callback.call(el[0]);
			if (closeTO) clearTimeout(closeTO);
		}
		el.find('.swipeout-content').transform('translate3d(' + 0 + 'px,0,0)').transitionEnd(onSwipeoutClose);
		closeTO = setTimeout(onSwipeoutClose, 500);

		for (var i = 0; i < buttons.length; i++) {
			if (dir === 'right') {
				$(buttons[i]).transform('translate3d(' + -buttons[i].offsetLeft + 'px,0,0)');
			} else {
				$(buttons[i]).transform('translate3d(' + (swipeOutActionsWidth - buttons[i].offsetWidth - buttons[i].offsetLeft) + 'px,0,0)');
			}
			$(buttons[i]).css({ left: 0 + 'px' });
		}
		if (app.swipeoutOpenedEl && app.swipeoutOpenedEl[0] === el[0]) app.swipeoutOpenedEl = undefined;
	};
	p['delete'] = function (el, callback) {
		el = $(el);
		if (el.length === 0) return;
		if (el.length > 1) el = $(el[0]);
		app.swipeoutOpenedEl = undefined;
		el.trigger('delete');
		el.css({ height: el.outerHeight() + 'px' });
		var clientLeft = el[0].clientLeft;
		el.css({ height: 0 + 'px' }).addClass('deleting transitioning').transitionEnd(function () {
			el.trigger('deleted');
			if (callback) callback.call(el[0]);
			if (el.parents('.virtual-list').length > 0) {
				var virtualList = el.parents('.virtual-list')[0].f7VirtualList;
				var virtualIndex = el[0].f7VirtualListIndex;
				if (virtualList && typeof virtualIndex !== 'undefined') virtualList.deleteItem(virtualIndex);
			} else {
				//el.remove();
				el.css("display", "none");
			}
		});
		var translate = '-100%';
		el.find('.swipeout-content').transform('translate3d(' + translate + ',0,0)');
	};
	p.destory = function () {
		p.destroySwipeoutEvents && p.destroySwipeoutEvents();
	};

	return p;
};

module.exports = React.createClass({
	displayName: 'exports',

	componentDidMount: function componentDidMount() {
		if (this.props.sortable) {
			this.sortable = new Sortable($(this.refs.container.getDOMNode()));
			this.sortable.init();
		}
		if (this.props.swipeout) {
			this.swipeout = new Swipeout($(this.refs.container.getDOMNode()));
			this.swipeout.init();
		}
	},
	componentWillUnmount: function componentWillUnmount() {
		if (this.props.sortable) {
			this.sortable.destory();
		}
		if (this.props.swipeout) {
			this.swipeout.destory();
		}
	},
	render: function render() {
		var obj = {
			'list-block': true,
			'inset': this.props.inset,
			'list-block-label': this.props.tabletInset,
			'media-list': this.props.media,
			'sortable': this.props.sortable
		};
		this.props['class'] && (obj[this.props['class']] = true);
		var className = cn(obj);

		var style = this.props.block ? {} : { margin: '0px 0px' };
		if (this.props.group) {
			return React.createElement(
				'div',
				{ className: className, style: style },
				this.props.children
			);
		} else if (this.props.sortable || this.props.swipeout) {
			return React.createElement(
				'div',
				{ className: className, style: style, ref: 'container' },
				React.createElement(
					'ul',
					null,
					this.props.children
				)
			);
		} else {
			return React.createElement(
				'div',
				{ className: className, style: style },
				React.createElement(
					'ul',
					null,
					this.props.children
				)
			);
		}
	}
});

},{"classnames":52,"react":undefined}],99:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "li",
            { className: "list-block-label" },
            this.props.children
        );
    }
});

},{"react":undefined}],100:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "list-group" },
            React.createElement(
                "ul",
                null,
                this.props.children
            )
        );
    }
});

},{"react":undefined}],101:[function(require,module,exports){
"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "li",
            _extends({ className: "list-group-title" }, this.props.data),
            this.props.children
        );
    }
});

},{"react":undefined}],102:[function(require,module,exports){
'use strict';

var React = require('react');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        return React.createElement(
            'ul',
            null,
            this.props.children
        );
    }
});

},{"react":undefined}],103:[function(require,module,exports){
'use strict';

module.exports = {
	GroupTitle: require('./GroupTitle'),
	ItemAfter: require('./ItemAfter'),
	ItemContent: require('./ItemContent'),
	ItemDivider: require('./ItemDivider'),
	ItemInner: require('./ItemInner'),
	ItemInput: require('./ItemInput'),
	ItemLink: require('./ItemLink'),
	ItemMedia: require('./ItemMedia'),
	ItemSubTitle: require('./ItemSubTitle'),
	ItemText: require('./ItemText'),
	ItemTitle: require('./ItemTitle'),
	ItemTitleRow: require('./ItemTitleRow'),
	List: require('./List'),
	ListBlockLabel: require('./ListBlockLabel'),
	ListGroup: require('./ListGroup'),
	ListGroupTitle: require('./ListGroupTitle'),
	IndexedList: require('./IndexedList'),
	SubList: require('./SubList')
};

},{"./GroupTitle":85,"./IndexedList":86,"./ItemAfter":87,"./ItemContent":88,"./ItemDivider":89,"./ItemInner":90,"./ItemInput":91,"./ItemLink":92,"./ItemMedia":93,"./ItemSubTitle":94,"./ItemText":95,"./ItemTitle":96,"./ItemTitleRow":97,"./List":98,"./ListBlockLabel":99,"./ListGroup":100,"./ListGroupTitle":101,"./SubList":102}],104:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
   displayName: "exports",

   render: function render() {
      return React.createElement(
         "div",
         { className: "messages-date" },
         this.props.children
      );
   }
});

},{"react":undefined}],105:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        var className = cn('message', {
            'message-sent': this.props.sent,
            'message-received': !this.props.sent,
            'message-last message-with-tail': this.props.tail,
            'message-with-avatar': !!this.props.avatar,
            'message-name': !!this.props.name,
            'message-pic': !!this.props.pic
        });
        var children = {};
        if (this.props.name) {
            children.name = React.createElement(
                'div',
                { className: 'message-name', style: this.props.nameStyle },
                this.props.name
            );
        }
        if (this.props.pic) {
            children.text = React.createElement(
                'div',
                { className: 'message-text' },
                React.createElement('img', { src: this.props.pic })
            );
        } else {
            children.text = React.createElement(
                'div',
                { className: 'message-text' },
                this.props.children
            );
        }
        if (this.props.label) {
            children.label = React.createElement(
                'div',
                { className: 'message-label' },
                this.props.label
            );
        }
        if (this.props.avatar) {
            children.avatar = React.createElement('div', { className: "message-avatar default_head user_head_" + this.props.avatar });
        }
        return React.createElement(
            'div',
            { className: className },
            React.addons.createFragment(children)
        );
    }
});

},{"classnames":52,"react":undefined}],106:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

var Messagebar = function Messagebar(container, maxRows) {
    var m = this;
    m.container = container;
    m.textarea = m.container.find('textarea');
    m.buttons = m.container.find('a');
    m.pageContainer = m.container.parents('.page').eq(0);
    m.pageContent = m.pageContainer.find('.page-content');
    m.buttonsHeight = parseInt(m.buttons.css('height'));
    var maxHeight = parseInt(m.textarea.css('line-height')) * (maxRows + 1);

    // Initial Sizes
    m.pageContentPadding = parseInt(m.pageContent.css('padding-bottom'));
    m.initialBarHeight = m.container[0].offsetHeight;
    m.initialAreaHeight = m.textarea[0].offsetHeight;

    // Resize textarea
    m.sizeTextarea = function () {
        // Reset
        m.textarea.css({ 'height': '' });

        var height = m.textarea[0].offsetHeight;
        var diff = height - m.textarea[0].clientHeight;
        var scrollHeight = m.textarea[0].scrollHeight;

        // Update
        if (scrollHeight + diff > height) {
            var newAreaHeight = scrollHeight + diff;
            var newBarHeight = m.initialBarHeight + (newAreaHeight - m.initialAreaHeight);
            var maxBarHeight = maxHeight;
            if (newBarHeight > maxBarHeight) {
                newBarHeight = parseInt(maxBarHeight, 10);
                newAreaHeight = newBarHeight - m.initialBarHeight + m.initialAreaHeight;
            }
            m.textarea.css('height', newAreaHeight + 'px');
            m.container.css('height', newBarHeight + 'px');
            m.buttons.css('bottom', (newBarHeight - m.buttonsHeight) / 2 + 'px');
            if (m.pageContent.length > 0) {
                m.pageContent.css('padding-bottom', newBarHeight + 'px');
                if (m.pageContent.find('.messages-new-first').length === 0) {
                    m.pageContent.scrollTop(m.pageContent[0].scrollHeight - m.pageContent[0].offsetHeight);
                }
            }
        } else {
            if (m.pageContent.length > 0) {
                m.container.css({ 'height': '', 'bottom': '' });
                m.pageContent.css({ 'padding-bottom': '' });
                m.buttons.css('bottom', '');
            }
        }
    };

    // Clear
    m.clear = function () {
        m.textarea.val('').trigger('change');
    };
    m.value = function (value) {
        if (typeof value === 'undefined') return m.textarea.val();else m.textarea.val(value).trigger('change');
    };

    // Handle textarea
    m.textareaTimeout = undefined;
    m.handleTextarea = function (e) {
        clearTimeout(m.textareaTimeout);
        m.textareaTimeout = setTimeout(function () {
            m.sizeTextarea();
        }, 0);
    };

    //Events
    function preventSubmit(e) {
        e.preventDefault();
    }

    m.attachEvents = function (destroy) {
        var method = destroy ? 'off' : 'on';
        m.container[method]('submit', preventSubmit);
        m.textarea[method]('change keydown keypress keyup paste cut', m.handleTextarea);
    };
    m.detachEvents = function () {
        m.attachEvents(true);
    };

    // Init Destroy
    m.init = function () {
        m.attachEvents();
    };
    m.destroy = function () {
        m.detachEvents();
        m = null;
    };
    m.init();

    return m;
};

module.exports = React.createClass({
    displayName: 'exports',

    getDefaultProps: function getDefaultProps() {
        return {
            maxRows: 5,
            sendChecked: true
        };
    },
    getInitialState: function getInitialState() {
        var value = this.props.value || '';
        return {
            value: value
        };
    },
    componentDidMount: function componentDidMount() {
        this.messagebar = new Messagebar($(this.refs.messagebar.getDOMNode()), this.props.maxRows);
    },
    componentWillUnmount: function componentWillUnmount() {
        this.messagebar.destroy();
    },
    handleChange: function handleChange(e) {
        var value = e.target.value;
        this.setState({
            value: value
        });
    },
    getValue: function getValue() {
        return this.state.value;
    },
    setValue: function setValue(value) {
        this.setState({
            value: value
        });
    },
    render: function render() {
        var canSend = this.props.sendChecked && this.state.value.length;
        var sendButtonStyle = canSend ? { color: "#007aff" } : { color: "gray" };
        var onSend = canSend && this.props.onSend;
        return React.createElement(
            'div',
            { className: 'toolbar messagebar', ref: 'messagebar' },
            React.createElement(
                'div',
                { className: 'toolbar-inner' },
                React.createElement(
                    'a',
                    { className: 'link icon-only' },
                    React.createElement('i', { className: 'icon icon-camera' })
                ),
                React.createElement('textarea', { placeholder: 'Message', value: this.state.value, onChange: this.handleChange }),
                React.createElement(
                    'a',
                    { className: 'link', style: sendButtonStyle, onClick: onSend },
                    'Send'
                )
            )
        );
    }
});

},{"classnames":52,"react":undefined}],107:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
     displayName: "exports",

     render: function render() {
          return React.createElement(
               "div",
               { className: "messages" },
               this.props.children
          );
     }
});

},{"react":undefined}],108:[function(require,module,exports){
'use strict';

module.exports = {
	MessageDate: require('./MessageDate'),
	Messages: require('./Messages'),
	MessageText: require('./MessageText'),
	MessageToolbar: require('./MessageToolbar')
};

},{"./MessageDate":104,"./MessageText":105,"./MessageToolbar":106,"./Messages":107}],109:[function(require,module,exports){
'use strict';

var assign = require('object-assign');
var React = require('react/addons');
var system = require('../system');
var Toast = require('../Toast').Toast;

var TRANSITIONS_INOUT = {
    'none': { 'in': false, out: false },
    'fade': { 'in': true, out: true },
    'fade-contract': { 'in': true, out: true },
    'fade-expand': { 'in': true, out: true },
    'show-from-left': { 'in': true, out: true },
    'show-from-right': { 'in': true, out: true },
    'show-from-top': { 'in': true, out: true },
    'show-from-bottom': { 'in': true, out: true },
    'reveal-from-left': { 'in': true, out: true },
    'reveal-from-right': { 'in': true, out: true },
    'reveal-from-top': { 'in': false, out: true },
    'reveal-from-bottom': { 'in': false, out: true }
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

function App(views) {
    console.log(system);
    return {
        device: system.Device,
        support: system.Support,
        touchEvents: {
            start: system.Support.touch ? 'touchstart' : 'mousedown',
            move: system.Support.touch ? 'touchmove' : 'mousemove',
            end: system.Support.touch ? 'touchend' : 'mouseup'
        },
        toast: function toast(text, icon) {
            Toast({ text: text, icon: icon });
        },
        componentWillMount: function componentWillMount() {
            window._ = require('underscore');
            _.mixin({
                deepClone: function deepClone(obj) {
                    return !obj || typeof obj !== 'object' ? obj : _.isString(obj) ? String.prototype.slice.call(obj) : _.isDate(obj) ? obj.valueOf() : _.isFunction(obj.clone) ? obj.clone() : _.isArray(obj) ? _.map(obj, function (t) {
                        return _.deepClone(t);
                    }) : _.mapObject(obj, function (val, key) {
                        return _.deepClone(val);
                    });
                }
            });

            window.app = this;
            this.history = [];
            this.data = {};
            this.methods = {};
            this.resPath = window.location.pathname.replace(/index.html$/, '');
        },
        getCurrentView: function getCurrentView() {
            var currentView = this.state.currentView;
            var props = { data: this.data.tempPassData };
            this.data.tempPassData = null;
            var viewsData = {};
            viewsData[currentView] = React.createElement(views[currentView], props);
            return React.addons.createFragment(viewsData);
        },
        getInitialState: function getInitialState() {
            return {
                viewTransition: this.getViewTransition('none')
            };
        },
        getViewTransition: function getViewTransition(key) {
            return assign({
                key: key,
                name: 'view-transition-' + key
            }, TRANSITIONS_INOUT[key]);
        },
        displayView: function displayView(viewId, transition, param) {
            this.data.tempPassData = {
                param: param,
                from: this.state.currentView
            };

            this.setState({
                currentView: viewId,
                viewTransition: this.getViewTransition(transition)
            });
        },
        showView: function showView(viewId, transition, param, norecord) {
            var trans = VIEW_TRANSITIONS[transition];
            param = param || {};
            if (!norecord) {
                var saved = param.saved || {};
                if (param.saved) {
                    delete param.saved;
                }
                saved = assign(saved, { scrollTop: $('.page-content').scrollTop() });
                this.history.push({ id: this.state.currentView, transition: transition, saved: saved });
            }
            this.displayView(viewId, trans ? trans.go : 'none', param);
        },
        goBack: function goBack(step, param) {
            if (!step) {
                step = 1;
            }
            var obj;
            for (var i = 0; i < step; i++) {
                var t = this.history.pop();
                t && (obj = t);
            }
            if (obj) {
                var trans = VIEW_TRANSITIONS[obj.transition];
                param = assign({}, param);
                param.saved = obj.saved;
                this.displayView(obj.id, trans ? trans.back : 'none', param);
            }
        }
    };
}

module.exports = App;

},{"../Toast":56,"../system":159,"object-assign":53,"react/addons":undefined,"underscore":54}],110:[function(require,module,exports){
'use strict';

module.exports = {
	sizeNavbars: function sizeNavbars(container) {
		var navbarInner = $(container).find('.navbar .navbar-inner:not(.cached)');
		navbarInner.each(function () {
			var n = $(this);
			if (n.hasClass('cached')) return;
			var left = n.find('.left'),
			    right = n.find('.right'),
			    center = n.find('.center'),
			    subnavbar = n.find('.subnavbar'),
			    noLeft = left.length === 0,
			    noRight = right.length === 0,
			    leftWidth = noLeft ? 0 : left.outerWidth(true),
			    rightWidth = noRight ? 0 : right.outerWidth(true),
			    centerWidth = center.outerWidth(true),
			    navbarStyles = n.styles(),
			    navbarWidth = n[0].offsetWidth - parseInt(navbarStyles.paddingLeft, 10) - parseInt(navbarStyles.paddingRight, 10),
			    onLeft = n.hasClass('navbar-on-left'),
			    currLeft,
			    diff;

			if (noRight) {
				currLeft = navbarWidth - centerWidth;
			}
			if (noLeft) {
				currLeft = 0;
			}
			if (!noLeft && !noRight) {
				currLeft = (navbarWidth - rightWidth - centerWidth + leftWidth) / 2;
			}
			var requiredLeft = (navbarWidth - centerWidth) / 2;
			if (navbarWidth - leftWidth - rightWidth > centerWidth) {
				if (requiredLeft < leftWidth) {
					requiredLeft = leftWidth;
				}
				if (requiredLeft + centerWidth > navbarWidth - rightWidth) {
					requiredLeft = navbarWidth - rightWidth - centerWidth;
				}
				diff = requiredLeft - currLeft;
			} else {
				diff = 0;
			}
			// RTL inverter
			var inverter = 1;

			if (center.hasClass('sliding')) {
				center[0].f7NavbarLeftOffset = -(currLeft + diff) * inverter;
				center[0].f7NavbarRightOffset = (navbarWidth - currLeft - diff - centerWidth) * inverter;
				if (onLeft) center.transform('translate3d(' + center[0].f7NavbarLeftOffset + 'px, 0, 0)');
			}
			if (!noLeft && left.hasClass('sliding')) {
				left[0].f7NavbarLeftOffset = -leftWidth;
				left[0].f7NavbarRightOffset = (navbarWidth - left[0].offsetWidth) / 2;
				if (onLeft) left.transform('translate3d(' + left[0].f7NavbarLeftOffset + 'px, 0, 0)');
			}
			if (!noRight && right.hasClass('sliding')) {
				right[0].f7NavbarLeftOffset = -(navbarWidth - right[0].offsetWidth) / 2;
				right[0].f7NavbarRightOffset = rightWidth;
				if (onLeft) right.transform('translate3d(' + right[0].f7NavbarLeftOffset + 'px, 0, 0)');
			}
			if (subnavbar.length && subnavbar.hasClass('sliding')) {
				subnavbar[0].f7NavbarLeftOffset = -subnavbar[0].offsetWidth;
				subnavbar[0].f7NavbarRightOffset = -subnavbar[0].f7NavbarLeftOffset;
			}

			// Center left
			var centerLeft = diff;
			center.css({ left: centerLeft + 'px' });
		});
	},
	hideNavbar: function hideNavbar(navbarContainer) {
		$(navbarContainer).addClass('navbar-hidden');
		return true;
	},
	showNavbar: function showNavbar(navbarContainer) {
		var navbar = $(navbarContainer);
		navbar.addClass('navbar-hiding').removeClass('navbar-hidden').transitionEnd(function () {
			navbar.removeClass('navbar-hiding');
		});
		return true;
	},
	hideToolbar: function hideToolbar(toolbarContainer) {
		$(toolbarContainer).addClass('toolbar-hidden');
		return true;
	},
	showToolbar: function showToolbar(toolbarContainer) {
		var toolbar = $(toolbarContainer);
		toolbar.addClass('toolbar-hiding').removeClass('toolbar-hidden').transitionEnd(function () {
			toolbar.removeClass('toolbar-hiding');
		});
	}
};

},{}],111:[function(require,module,exports){
'use strict';

module.exports = {
    componentDidMount: function componentDidMount() {
        var data = this.props.data || {};
        var param = data.param || {};
        var scrollTop = param.saved && param.saved.scrollTop;
        if (scrollTop) {
            $('.page-content').scrollTop(scrollTop);
        }
    }
};

},{}],112:[function(require,module,exports){
'use strict';var Swiper=function Swiper(container,params){if(!(this instanceof Swiper))return new Swiper(container,params);var defaults={direction:'horizontal',touchEventsTarget:'container',initialSlide:0,speed:300, // autoplay
autoplay:false,autoplayDisableOnInteraction:true, // Free mode
freeMode:false,freeModeMomentum:true,freeModeMomentumRatio:1,freeModeMomentumBounce:true,freeModeMomentumBounceRatio:1,freeModeSticky:false, // Set wrapper width
setWrapperSize:false, // Virtual Translate
virtualTranslate:false, // Effects
effect:'slide', // 'slide' or 'fade' or 'cube' or 'coverflow'
coverflow:{rotate:50,stretch:0,depth:100,modifier:1,slideShadows:true},cube:{slideShadows:true,shadow:true,shadowOffset:20,shadowScale:0.94},fade:{crossFade:false}, // Parallax
parallax:false, // Scrollbar
scrollbar:null,scrollbarHide:true, // Keyboard Mousewheel
keyboardControl:false,mousewheelControl:false,mousewheelForceToAxis:false, // Hash Navigation
hashnav:false, // Slides grid
spaceBetween:0,slidesPerView:1,slidesPerColumn:1,slidesPerColumnFill:'column',slidesPerGroup:1,centeredSlides:false, // Touches
touchRatio:1,touchAngle:45,simulateTouch:true,shortSwipes:true,longSwipes:true,longSwipesRatio:0.5,longSwipesMs:300,followFinger:true,onlyExternal:false,threshold:0,touchMoveStopPropagation:true, // Pagination
pagination:null,paginationClickable:false,paginationHide:false,paginationBulletRender:null, // Resistance
resistance:true,resistanceRatio:0.85, // Next/prev buttons
nextButton:null,prevButton:null, // Progress
watchSlidesProgress:false,watchSlidesVisibility:false, // Cursor
grabCursor:false, // Clicks
preventClicks:true,preventClicksPropagation:true,slideToClickedSlide:false, // Lazy Loading
lazyLoading:false,lazyLoadingInPrevNext:false,lazyLoadingOnTransitionStart:false, // Images
preloadImages:true,updateOnImagesReady:true, // loop
loop:false,loopAdditionalSlides:0,loopedSlides:null, // Control
control:undefined,controlInverse:false, // Swiping/no swiping
allowSwipeToPrev:true,allowSwipeToNext:true,swipeHandler:null, //'.swipe-handler',
noSwiping:true,noSwipingClass:'swiper-no-swiping', // NS
slideClass:'swiper-slide',slideActiveClass:'swiper-slide-active',slideVisibleClass:'swiper-slide-visible',slideDuplicateClass:'swiper-slide-duplicate',slideNextClass:'swiper-slide-next',slidePrevClass:'swiper-slide-prev',wrapperClass:'swiper-wrapper',bulletClass:'swiper-pagination-bullet',bulletActiveClass:'swiper-pagination-bullet-active',buttonDisabledClass:'swiper-button-disabled',paginationHiddenClass:'swiper-pagination-hidden', // Observer
observer:false,observeParents:false, // Accessibility
a11y:false,prevSlideMessage:'Previous slide',nextSlideMessage:'Next slide',firstSlideMessage:'This is the first slide',lastSlideMessage:'This is the last slide', // Callbacks
runCallbacksOnInit:true}; /*
        Callbacks:
        onInit: function (swiper)
        onDestroy: function (swiper)
        onClick: function (swiper, e)
        onTap: function (swiper, e)
        onDoubleTap: function (swiper, e)
        onSliderMove: function (swiper, e)
        onSlideChangeStart: function (swiper)
        onSlideChangeEnd: function (swiper)
        onTransitionStart: function (swiper)
        onTransitionEnd: function (swiper)
        onImagesReady: function (swiper)
        onProgress: function (swiper, progress)
        onTouchStart: function (swiper, e)
        onTouchMove: function (swiper, e)
        onTouchMoveOpposite: function (swiper, e)
        onTouchEnd: function (swiper, e)
        onReachBeginning: function (swiper)
        onReachEnd: function (swiper)
        onSetTransition: function (swiper, duration)
        onSetTranslate: function (swiper, translate)
        onAutoplayStart: function (swiper)
        onAutoplayStop: function (swiper),
        onLazyImageLoad: function (swiper, slide, image)
        onLazyImageReady: function (swiper, slide, image)
        */var initialVirtualTranslate=params && params.virtualTranslate;params = params || {};for(var def in defaults) {if(typeof params[def] === 'undefined'){params[def] = defaults[def];}else if(typeof params[def] === 'object'){for(var deepDef in defaults[def]) {if(typeof params[def][deepDef] === 'undefined'){params[def][deepDef] = defaults[def][deepDef];}}}} // Swiper
var s=this; // Version
s.version = '3.0.7'; // Params
s.params = params; // Classname
s.classNames = []; // Export it to Swiper instance
s.$ = $; /*=========================
      Preparation - Define Container, Wrapper and Pagination
      ===========================*/s.container = $(container);if(s.container.length === 0)return;if(s.container.length > 1){s.container.each(function(){new Swiper(this,params);});return;} // Save instance in container HTML Element and in data
s.container[0].swiper = s;s.container.data('swiper',s);s.classNames.push('swiper-container-' + s.params.direction);if(s.params.freeMode){s.classNames.push('swiper-container-free-mode');}if(!s.support.flexbox){s.classNames.push('swiper-container-no-flexbox');s.params.slidesPerColumn = 1;} // Enable slides progress when required
if(s.params.parallax || s.params.watchSlidesVisibility){s.params.watchSlidesProgress = true;} // Coverflow / 3D
if(['cube','coverflow'].indexOf(s.params.effect) >= 0){if(s.support.transforms3d){s.params.watchSlidesProgress = true;s.classNames.push('swiper-container-3d');}else {s.params.effect = 'slide';}}if(s.params.effect !== 'slide'){s.classNames.push('swiper-container-' + s.params.effect);}if(s.params.effect === 'cube'){s.params.resistanceRatio = 0;s.params.slidesPerView = 1;s.params.slidesPerColumn = 1;s.params.slidesPerGroup = 1;s.params.centeredSlides = false;s.params.spaceBetween = 0;s.params.virtualTranslate = true;s.params.setWrapperSize = false;}if(s.params.effect === 'fade'){s.params.slidesPerView = 1;s.params.slidesPerColumn = 1;s.params.slidesPerGroup = 1;s.params.watchSlidesProgress = true;s.params.spaceBetween = 0;if(typeof initialVirtualTranslate === 'undefined'){s.params.virtualTranslate = true;}} // Grab Cursor
if(s.params.grabCursor && s.support.touch){s.params.grabCursor = false;} // Wrapper
s.wrapper = s.container.children('.' + s.params.wrapperClass); // Pagination
if(s.params.pagination){s.paginationContainer = $(s.params.pagination);if(s.params.paginationClickable){s.paginationContainer.addClass('swiper-pagination-clickable');}} // Is Horizontal
function isH(){return s.params.direction === 'horizontal';} // RTL
s.rtl = isH() && (s.container[0].dir.toLowerCase() === 'rtl' || s.container.css('direction') === 'rtl');if(s.rtl){s.classNames.push('swiper-container-rtl');} // Wrong RTL support
if(s.rtl){s.wrongRTL = s.wrapper.css('display') === '-webkit-box';} // Columns
if(s.params.slidesPerColumn > 1){s.classNames.push('swiper-container-multirow');} // Check for Android
if(s.device.android){s.classNames.push('swiper-container-android');} // Add classes
s.container.addClass(s.classNames.join(' ')); // Translate
s.translate = 0; // Progress
s.progress = 0; // Velocity
s.velocity = 0; // Locks, unlocks
s.lockSwipeToNext = function(){s.params.allowSwipeToNext = false;};s.lockSwipeToPrev = function(){s.params.allowSwipeToPrev = false;};s.lockSwipes = function(){s.params.allowSwipeToNext = s.params.allowSwipeToPrev = false;};s.unlockSwipeToNext = function(){s.params.allowSwipeToNext = true;};s.unlockSwipeToPrev = function(){s.params.allowSwipeToPrev = true;};s.unlockSwipes = function(){s.params.allowSwipeToNext = s.params.allowSwipeToPrev = true;}; /*=========================
      Set grab cursor
      ===========================*/if(s.params.grabCursor){s.container[0].style.cursor = 'move';s.container[0].style.cursor = '-webkit-grab';s.container[0].style.cursor = '-moz-grab';s.container[0].style.cursor = 'grab';} /*=========================
      Update on Images Ready
      ===========================*/s.imagesToLoad = [];s.imagesLoaded = 0;s.loadImage = function(imgElement,src,checkForComplete,callback){var image;function onReady(){if(callback)callback();}if(!imgElement.complete || !checkForComplete){if(src){image = new window.Image();image.onload = onReady;image.onerror = onReady;image.src = src;}else {onReady();}}else { //image already loaded...
onReady();}};s.preloadImages = function(){s.imagesToLoad = s.container.find('img');function _onReady(){if(typeof s === 'undefined' || s === null)return;if(s.imagesLoaded !== undefined)s.imagesLoaded++;if(s.imagesLoaded === s.imagesToLoad.length){if(s.params.updateOnImagesReady)s.update();s.emit('onImagesReady',s);}}for(var i=0;i < s.imagesToLoad.length;i++) {s.loadImage(s.imagesToLoad[i],s.imagesToLoad[i].currentSrc || s.imagesToLoad[i].getAttribute('src'),true,_onReady);}}; /*=========================
      Autoplay
      ===========================*/s.autoplayTimeoutId = undefined;s.autoplaying = false;s.autoplayPaused = false;function autoplay(){s.autoplayTimeoutId = setTimeout(function(){if(s.params.loop){s.fixLoop();s._slideNext();}else {if(!s.isEnd){s._slideNext();}else {if(!params.autoplayStopOnLast){s._slideTo(0);}else {s.stopAutoplay();}}}},s.params.autoplay);}s.startAutoplay = function(){if(typeof s.autoplayTimeoutId !== 'undefined')return false;if(!s.params.autoplay)return false;if(s.autoplaying)return false;s.autoplaying = true;s.emit('onAutoplayStart',s);autoplay();};s.stopAutoplay = function(internal){if(!s.autoplayTimeoutId)return;if(s.autoplayTimeoutId)clearTimeout(s.autoplayTimeoutId);s.autoplaying = false;s.autoplayTimeoutId = undefined;s.emit('onAutoplayStop',s);};s.pauseAutoplay = function(speed){if(s.autoplayPaused)return;if(s.autoplayTimeoutId)clearTimeout(s.autoplayTimeoutId);s.autoplayPaused = true;if(speed === 0){s.autoplayPaused = false;autoplay();}else {s.wrapper.transitionEnd(function(){if(!s)return;s.autoplayPaused = false;if(!s.autoplaying){s.stopAutoplay();}else {autoplay();}});}}; /*=========================
      Min/Max Translate
      ===========================*/s.minTranslate = function(){return -s.snapGrid[0];};s.maxTranslate = function(){return -s.snapGrid[s.snapGrid.length - 1];}; /*=========================
      Slider/slides sizes
      ===========================*/s.updateContainerSize = function(){var width,height;if(typeof s.params.width !== 'undefined'){width = s.params.width;}else {width = s.container[0].clientWidth;}if(typeof s.params.height !== 'undefined'){height = s.params.height;}else {height = s.container[0].clientHeight;}if(width === 0 && isH() || height === 0 && !isH()){return;}s.width = width;s.height = height;s.size = isH()?s.width:s.height;};s.updateSlidesSize = function(){s.slides = s.wrapper.children('.' + s.params.slideClass);s.snapGrid = [];s.slidesGrid = [];s.slidesSizesGrid = [];var spaceBetween=s.params.spaceBetween,slidePosition=0,i,prevSlideSize=0,index=0;if(typeof spaceBetween === 'string' && spaceBetween.indexOf('%') >= 0){spaceBetween = parseFloat(spaceBetween.replace('%','')) / 100 * s.size;}s.virtualSize = -spaceBetween; // reset margins
if(s.rtl)s.slides.css({marginLeft:'',marginTop:''});else s.slides.css({marginRight:'',marginBottom:''});var slidesNumberEvenToRows;if(s.params.slidesPerColumn > 1){if(Math.floor(s.slides.length / s.params.slidesPerColumn) === s.slides.length / s.params.slidesPerColumn){slidesNumberEvenToRows = s.slides.length;}else {slidesNumberEvenToRows = Math.ceil(s.slides.length / s.params.slidesPerColumn) * s.params.slidesPerColumn;}} // Calc slides
var slideSize;for(i = 0;i < s.slides.length;i++) {slideSize = 0;var slide=s.slides.eq(i);if(s.params.slidesPerColumn > 1){ // Set slides order
var newSlideOrderIndex;var column,row;var slidesPerColumn=s.params.slidesPerColumn;var slidesPerRow;if(s.params.slidesPerColumnFill === 'column'){column = Math.floor(i / slidesPerColumn);row = i - column * slidesPerColumn;newSlideOrderIndex = column + row * slidesNumberEvenToRows / slidesPerColumn;slide.css({'-webkit-box-ordinal-group':newSlideOrderIndex,'-moz-box-ordinal-group':newSlideOrderIndex,'-ms-flex-order':newSlideOrderIndex,'-webkit-order':newSlideOrderIndex,'order':newSlideOrderIndex});}else {slidesPerRow = slidesNumberEvenToRows / slidesPerColumn;row = Math.floor(i / slidesPerRow);column = i - row * slidesPerRow;}slide.css({'margin-top':row !== 0 && s.params.spaceBetween && s.params.spaceBetween + 'px'}).attr('data-swiper-column',column).attr('data-swiper-row',row);}if(slide.css('display') === 'none')continue;if(s.params.slidesPerView === 'auto'){slideSize = isH()?slide.outerWidth(true):slide.outerHeight(true);}else {slideSize = (s.size - (s.params.slidesPerView - 1) * spaceBetween) / s.params.slidesPerView;if(isH()){s.slides[i].style.width = slideSize + 'px';}else {s.slides[i].style.height = slideSize + 'px';}}s.slides[i].swiperSlideSize = slideSize;s.slidesSizesGrid.push(slideSize);if(s.params.centeredSlides){slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;if(i === 0)slidePosition = slidePosition - s.size / 2 - spaceBetween;if(Math.abs(slidePosition) < 1 / 1000)slidePosition = 0;if(index % s.params.slidesPerGroup === 0)s.snapGrid.push(slidePosition);s.slidesGrid.push(slidePosition);}else {if(index % s.params.slidesPerGroup === 0)s.snapGrid.push(slidePosition);s.slidesGrid.push(slidePosition);slidePosition = slidePosition + slideSize + spaceBetween;}s.virtualSize += slideSize + spaceBetween;prevSlideSize = slideSize;index++;}s.virtualSize = Math.max(s.virtualSize,s.size);var newSlidesGrid;if(s.rtl && s.wrongRTL && (s.params.effect === 'slide' || s.params.effect === 'coverflow')){s.wrapper.css({width:s.virtualSize + s.params.spaceBetween + 'px'});}if(!s.support.flexbox || s.params.setWrapperSize){if(isH())s.wrapper.css({width:s.virtualSize + s.params.spaceBetween + 'px'});else s.wrapper.css({height:s.virtualSize + s.params.spaceBetween + 'px'});}if(s.params.slidesPerColumn > 1){s.virtualSize = (slideSize + s.params.spaceBetween) * slidesNumberEvenToRows;s.virtualSize = Math.ceil(s.virtualSize / s.params.slidesPerColumn) - s.params.spaceBetween;s.wrapper.css({width:s.virtualSize + s.params.spaceBetween + 'px'});if(s.params.centeredSlides){newSlidesGrid = [];for(i = 0;i < s.snapGrid.length;i++) {if(s.snapGrid[i] < s.virtualSize + s.snapGrid[0])newSlidesGrid.push(s.snapGrid[i]);}s.snapGrid = newSlidesGrid;}} // Remove last grid elements depending on width
if(!s.params.centeredSlides){newSlidesGrid = [];for(i = 0;i < s.snapGrid.length;i++) {if(s.snapGrid[i] <= s.virtualSize - s.size){newSlidesGrid.push(s.snapGrid[i]);}}s.snapGrid = newSlidesGrid;if(Math.floor(s.virtualSize - s.size) > Math.floor(s.snapGrid[s.snapGrid.length - 1])){s.snapGrid.push(s.virtualSize - s.size);}}if(s.snapGrid.length === 0)s.snapGrid = [0];if(s.params.spaceBetween !== 0){if(isH()){if(s.rtl)s.slides.css({marginLeft:spaceBetween + 'px'});else s.slides.css({marginRight:spaceBetween + 'px'});}else s.slides.css({marginBottom:spaceBetween + 'px'});}if(s.params.watchSlidesProgress){s.updateSlidesOffset();}};s.updateSlidesOffset = function(){for(var i=0;i < s.slides.length;i++) {s.slides[i].swiperSlideOffset = isH()?s.slides[i].offsetLeft:s.slides[i].offsetTop;}}; /*=========================
      Slider/slides progress
      ===========================*/s.updateSlidesProgress = function(translate){if(typeof translate === 'undefined'){translate = s.translate || 0;}if(s.slides.length === 0)return;if(typeof s.slides[0].swiperSlideOffset === 'undefined')s.updateSlidesOffset();var offsetCenter=s.params.centeredSlides?-translate + s.size / 2:-translate;if(s.rtl)offsetCenter = s.params.centeredSlides?translate - s.size / 2:translate; // Visible Slides
var containerBox=s.container[0].getBoundingClientRect();var sideBefore=isH()?'left':'top';var sideAfter=isH()?'right':'bottom';s.slides.removeClass(s.params.slideVisibleClass);for(var i=0;i < s.slides.length;i++) {var slide=s.slides[i];var slideCenterOffset=s.params.centeredSlides === true?slide.swiperSlideSize / 2:0;var slideProgress=(offsetCenter - slide.swiperSlideOffset - slideCenterOffset) / (slide.swiperSlideSize + s.params.spaceBetween);if(s.params.watchSlidesVisibility){var slideBefore=-(offsetCenter - slide.swiperSlideOffset - slideCenterOffset);var slideAfter=slideBefore + s.slidesSizesGrid[i];var isVisible=slideBefore >= 0 && slideBefore < s.size || slideAfter > 0 && slideAfter <= s.size || slideBefore <= 0 && slideAfter >= s.size;if(isVisible){s.slides.eq(i).addClass(s.params.slideVisibleClass);}}slide.progress = s.rtl?-slideProgress:slideProgress;}};s.updateProgress = function(translate){if(typeof translate === 'undefined'){translate = s.translate || 0;}var translatesDiff=s.maxTranslate() - s.minTranslate();if(translatesDiff === 0){s.progress = 0;s.isBeginning = s.isEnd = true;}else {s.progress = (translate - s.minTranslate()) / translatesDiff;s.isBeginning = s.progress <= 0;s.isEnd = s.progress >= 1;}if(s.isBeginning)s.emit('onReachBeginning',s);if(s.isEnd)s.emit('onReachEnd',s);if(s.params.watchSlidesProgress)s.updateSlidesProgress(translate);s.emit('onProgress',s,s.progress);};s.updateActiveIndex = function(){var translate=s.rtl?s.translate:-s.translate;var newActiveIndex,i,snapIndex;for(i = 0;i < s.slidesGrid.length;i++) {if(typeof s.slidesGrid[i + 1] !== 'undefined'){if(translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1] - (s.slidesGrid[i + 1] - s.slidesGrid[i]) / 2){newActiveIndex = i;}else if(translate >= s.slidesGrid[i] && translate < s.slidesGrid[i + 1]){newActiveIndex = i + 1;}}else {if(translate >= s.slidesGrid[i]){newActiveIndex = i;}}} // Normalize slideIndex
if(newActiveIndex < 0 || typeof newActiveIndex === 'undefined')newActiveIndex = 0; // for (i = 0; i < s.slidesGrid.length; i++) {
// if (- translate >= s.slidesGrid[i]) {
// newActiveIndex = i;
// }
// }
snapIndex = Math.floor(newActiveIndex / s.params.slidesPerGroup);if(snapIndex >= s.snapGrid.length)snapIndex = s.snapGrid.length - 1;if(newActiveIndex === s.activeIndex){return;}s.snapIndex = snapIndex;s.previousIndex = s.activeIndex;s.activeIndex = newActiveIndex;s.updateClasses();}; /*=========================
      Classes
      ===========================*/s.updateClasses = function(){s.slides.removeClass(s.params.slideActiveClass + ' ' + s.params.slideNextClass + ' ' + s.params.slidePrevClass);var activeSlide=s.slides.eq(s.activeIndex); // Active classes
activeSlide.addClass(s.params.slideActiveClass);activeSlide.next('.' + s.params.slideClass).addClass(s.params.slideNextClass);activeSlide.prev('.' + s.params.slideClass).addClass(s.params.slidePrevClass); // Pagination
if(s.bullets && s.bullets.length > 0){s.bullets.removeClass(s.params.bulletActiveClass);var bulletIndex;if(s.params.loop){bulletIndex = Math.ceil(s.activeIndex - s.loopedSlides) / s.params.slidesPerGroup;if(bulletIndex > s.slides.length - 1 - s.loopedSlides * 2){bulletIndex = bulletIndex - (s.slides.length - s.loopedSlides * 2);}if(bulletIndex > s.bullets.length - 1)bulletIndex = bulletIndex - s.bullets.length;}else {if(typeof s.snapIndex !== 'undefined'){bulletIndex = s.snapIndex;}else {bulletIndex = s.activeIndex || 0;}}if(s.paginationContainer.length > 1){s.bullets.each(function(){if($(this).index() === bulletIndex)$(this).addClass(s.params.bulletActiveClass);});}else {s.bullets.eq(bulletIndex).addClass(s.params.bulletActiveClass);}} // Next/active buttons
if(!s.params.loop){if(s.params.prevButton){if(s.isBeginning){$(s.params.prevButton).addClass(s.params.buttonDisabledClass);if(s.params.a11y && s.a11y)s.a11y.disable($(s.params.prevButton));}else {$(s.params.prevButton).removeClass(s.params.buttonDisabledClass);if(s.params.a11y && s.a11y)s.a11y.enable($(s.params.prevButton));}}if(s.params.nextButton){if(s.isEnd){$(s.params.nextButton).addClass(s.params.buttonDisabledClass);if(s.params.a11y && s.a11y)s.a11y.disable($(s.params.nextButton));}else {$(s.params.nextButton).removeClass(s.params.buttonDisabledClass);if(s.params.a11y && s.a11y)s.a11y.enable($(s.params.nextButton));}}}}; /*=========================
      Pagination
      ===========================*/s.updatePagination = function(){if(!s.params.pagination)return;if(s.paginationContainer && s.paginationContainer.length > 0){var bulletsHTML='';var numberOfBullets=s.params.loop?Math.ceil((s.slides.length - s.loopedSlides * 2) / s.params.slidesPerGroup):s.snapGrid.length;for(var i=0;i < numberOfBullets;i++) {if(s.params.paginationBulletRender){bulletsHTML += s.params.paginationBulletRender(i,s.params.bulletClass);}else {bulletsHTML += '<span class="' + s.params.bulletClass + '"></span>';}}s.paginationContainer.html(bulletsHTML);s.bullets = s.paginationContainer.find('.' + s.params.bulletClass);}}; /*=========================
      Common update method
      ===========================*/s.update = function(updateTranslate){s.updateContainerSize();s.updateSlidesSize();s.updateProgress();s.updatePagination();s.updateClasses();if(s.params.scrollbar && s.scrollbar){s.scrollbar.set();}function forceSetTranslate(){newTranslate = Math.min(Math.max(s.translate,s.maxTranslate()),s.minTranslate());s.setWrapperTranslate(newTranslate);s.updateActiveIndex();s.updateClasses();}if(updateTranslate){var translated,newTranslate;if(s.params.freeMode){forceSetTranslate();}else {if(s.params.slidesPerView === 'auto' && s.isEnd && !s.params.centeredSlides){translated = s.slideTo(s.slides.length - 1,0,false,true);}else {translated = s.slideTo(s.activeIndex,0,false,true);}if(!translated){forceSetTranslate();}}}}; /*=========================
      Resize Handler
      ===========================*/s.onResize = function(forceUpdatePagination){s.updateContainerSize();s.updateSlidesSize();s.updateProgress();if(s.params.slidesPerView === 'auto' || s.params.freeMode || forceUpdatePagination)s.updatePagination();if(s.params.scrollbar && s.scrollbar){s.scrollbar.set();}if(s.params.freeMode){var newTranslate=Math.min(Math.max(s.translate,s.maxTranslate()),s.minTranslate());s.setWrapperTranslate(newTranslate);s.updateActiveIndex();s.updateClasses();}else {s.updateClasses();if(s.params.slidesPerView === 'auto' && s.isEnd && !s.params.centeredSlides){s.slideTo(s.slides.length - 1,0,false,true);}else {s.slideTo(s.activeIndex,0,false,true);}}}; /*=========================
      Events
      ===========================*/ //Define Touch Events
var desktopEvents=['mousedown','mousemove','mouseup'];if(window.navigator.pointerEnabled)desktopEvents = ['pointerdown','pointermove','pointerup'];else if(window.navigator.msPointerEnabled)desktopEvents = ['MSPointerDown','MSPointerMove','MSPointerUp'];s.touchEvents = {start:s.support.touch || !s.params.simulateTouch?'touchstart':desktopEvents[0],move:s.support.touch || !s.params.simulateTouch?'touchmove':desktopEvents[1],end:s.support.touch || !s.params.simulateTouch?'touchend':desktopEvents[2]}; // WP8 Touch Events Fix
if(window.navigator.pointerEnabled || window.navigator.msPointerEnabled){(s.params.touchEventsTarget === 'container'?s.container:s.wrapper).addClass('swiper-wp8-' + s.params.direction);} // Attach/detach events
s.initEvents = function(detach){var actionDom=detach?'off':'on';var action=detach?'removeEventListener':'addEventListener';var touchEventsTarget=s.params.touchEventsTarget === 'container'?s.container[0]:s.wrapper[0];var target=s.support.touch?touchEventsTarget:document;var moveCapture=s.params.nested?true:false; //Touch Events
if(s.browser.ie){touchEventsTarget[action](s.touchEvents.start,s.onTouchStart,false);target[action](s.touchEvents.move,s.onTouchMove,moveCapture);target[action](s.touchEvents.end,s.onTouchEnd,false);}else {if(s.support.touch){touchEventsTarget[action](s.touchEvents.start,s.onTouchStart,false);touchEventsTarget[action](s.touchEvents.move,s.onTouchMove,moveCapture);touchEventsTarget[action](s.touchEvents.end,s.onTouchEnd,false);}if(params.simulateTouch && !s.device.ios && !s.device.android){touchEventsTarget[action]('mousedown',s.onTouchStart,false);document[action]('mousemove',s.onTouchMove,moveCapture);document[action]('mouseup',s.onTouchEnd,false);}}window[action]('resize',s.onResize); // Next, Prev, Index
if(s.params.nextButton){$(s.params.nextButton)[actionDom]('click',s.onClickNext);if(s.params.a11y && s.a11y)$(s.params.nextButton)[actionDom]('keydown',s.a11y.onEnterKey);}if(s.params.prevButton){$(s.params.prevButton)[actionDom]('click',s.onClickPrev);if(s.params.a11y && s.a11y)$(s.params.prevButton)[actionDom]('keydown',s.a11y.onEnterKey);}if(s.params.pagination && s.params.paginationClickable){$(s.paginationContainer)[actionDom]('click','.' + s.params.bulletClass,s.onClickIndex);} // Prevent Links Clicks
if(s.params.preventClicks || s.params.preventClicksPropagation)touchEventsTarget[action]('click',s.preventClicks,true);};s.attachEvents = function(detach){s.initEvents();};s.detachEvents = function(){s.initEvents(true);}; /*=========================
      Handle Clicks
      ===========================*/ // Prevent Clicks
s.allowClick = true;s.preventClicks = function(e){if(!s.allowClick){if(s.params.preventClicks)e.preventDefault();if(s.params.preventClicksPropagation){e.stopPropagation();e.stopImmediatePropagation();}}}; // Clicks
s.onClickNext = function(e){e.preventDefault();s.slideNext();};s.onClickPrev = function(e){e.preventDefault();s.slidePrev();};s.onClickIndex = function(e){e.preventDefault();var index=$(this).index() * s.params.slidesPerGroup;if(s.params.loop)index = index + s.loopedSlides;s.slideTo(index);}; /*=========================
      Handle Touches
      ===========================*/function findElementInEvent(e,selector){var el=$(e.target);if(!el.is(selector)){if(typeof selector === 'string'){el = el.parents(selector);}else if(selector.nodeType){var found;el.parents().each(function(index,_el){if(_el === selector)found = selector;});if(!found)return undefined;else return selector;}}if(el.length === 0){return undefined;}return el[0];}s.updateClickedSlide = function(e){var slide=findElementInEvent(e,'.' + s.params.slideClass);var slideFound=false;if(slide){for(var i=0;i < s.slides.length;i++) {if(s.slides[i] === slide)slideFound = true;}}if(slide && slideFound){s.clickedSlide = slide;s.clickedIndex = $(slide).index();}else {s.clickedSlide = undefined;s.clickedIndex = undefined;return;}if(s.params.slideToClickedSlide && s.clickedIndex !== undefined && s.clickedIndex !== s.activeIndex){var slideToIndex=s.clickedIndex,realIndex;if(s.params.loop){realIndex = $(s.clickedSlide).attr('data-swiper-slide-index');if(slideToIndex > s.slides.length - s.params.slidesPerView){s.fixLoop();slideToIndex = s.wrapper.children('.' + s.params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]').eq(0).index();setTimeout(function(){s.slideTo(slideToIndex);},0);}else if(slideToIndex < s.params.slidesPerView - 1){s.fixLoop();var duplicatedSlides=s.wrapper.children('.' + s.params.slideClass + '[data-swiper-slide-index="' + realIndex + '"]');slideToIndex = duplicatedSlides.eq(duplicatedSlides.length - 1).index();setTimeout(function(){s.slideTo(slideToIndex);},0);}else {s.slideTo(slideToIndex);}}else {s.slideTo(slideToIndex);}}};var isTouched,isMoved,touchStartTime,isScrolling,currentTranslate,startTranslate,allowThresholdMove, // Form elements to match
formElements='input, select, textarea, button', // Last click time
lastClickTime=Date.now(),clickTimeout, //Velocities
velocities=[],allowMomentumBounce; // Animating Flag
s.animating = false; // Touches information
s.touches = {startX:0,startY:0,currentX:0,currentY:0,diff:0}; // Touch handlers
var isTouchEvent,startMoving;s.onTouchStart = function(e){if(e.originalEvent)e = e.originalEvent;isTouchEvent = e.type === 'touchstart';if(!isTouchEvent && 'which' in e && e.which === 3)return;if(s.params.noSwiping && findElementInEvent(e,'.' + s.params.noSwipingClass)){s.allowClick = true;return;}if(s.params.swipeHandler){if(!findElementInEvent(e,s.params.swipeHandler))return;}isTouched = true;isMoved = false;isScrolling = undefined;startMoving = undefined;s.touches.startX = s.touches.currentX = e.type === 'touchstart'?e.targetTouches[0].pageX:e.pageX;s.touches.startY = s.touches.currentY = e.type === 'touchstart'?e.targetTouches[0].pageY:e.pageY;touchStartTime = Date.now();s.allowClick = true;s.updateContainerSize();s.swipeDirection = undefined;if(s.params.threshold > 0)allowThresholdMove = false;if(e.type !== 'touchstart'){var preventDefault=true;if($(e.target).is(formElements))preventDefault = false;if(document.activeElement && $(document.activeElement).is(formElements)){document.activeElement.blur();}if(preventDefault){e.preventDefault();}}s.emit('onTouchStart',s,e);};s.onTouchMove = function(e){if(e.originalEvent)e = e.originalEvent;if(isTouchEvent && e.type === 'mousemove')return;if(e.preventedByNestedSwiper)return;if(s.params.onlyExternal){isMoved = true;s.allowClick = false;return;}if(isTouchEvent && document.activeElement){if(e.target === document.activeElement && $(e.target).is(formElements)){isMoved = true;s.allowClick = false;return;}}s.emit('onTouchMove',s,e);if(e.targetTouches && e.targetTouches.length > 1)return;s.touches.currentX = e.type === 'touchmove'?e.targetTouches[0].pageX:e.pageX;s.touches.currentY = e.type === 'touchmove'?e.targetTouches[0].pageY:e.pageY;if(typeof isScrolling === 'undefined'){var touchAngle=Math.atan2(Math.abs(s.touches.currentY - s.touches.startY),Math.abs(s.touches.currentX - s.touches.startX)) * 180 / Math.PI;isScrolling = isH()?touchAngle > s.params.touchAngle:90 - touchAngle > s.params.touchAngle;}if(isScrolling){s.emit('onTouchMoveOpposite',s,e);}if(typeof startMoving === 'undefined' && s.browser.ieTouch){if(s.touches.currentX !== s.touches.startX || s.touches.currentY !== s.touches.startY){startMoving = true;}}if(!isTouched)return;if(isScrolling){isTouched = false;return;}if(!startMoving && s.browser.ieTouch){return;}s.allowClick = false;s.emit('onSliderMove',s,e);e.preventDefault();if(s.params.touchMoveStopPropagation && !s.params.nested){e.stopPropagation();}if(!isMoved){if(params.loop){s.fixLoop();}startTranslate = s.getWrapperTranslate();s.setWrapperTransition(0);if(s.animating){s.wrapper.trigger('webkitTransitionEnd transitionend oTransitionEnd MSTransitionEnd msTransitionEnd');}if(s.params.autoplay && s.autoplaying){if(s.params.autoplayDisableOnInteraction){s.stopAutoplay();}else {s.pauseAutoplay();}}allowMomentumBounce = false; //Grab Cursor
if(s.params.grabCursor){s.container[0].style.cursor = 'move';s.container[0].style.cursor = '-webkit-grabbing';s.container[0].style.cursor = '-moz-grabbin';s.container[0].style.cursor = 'grabbing';}}isMoved = true;var diff=s.touches.diff = isH()?s.touches.currentX - s.touches.startX:s.touches.currentY - s.touches.startY;diff = diff * s.params.touchRatio;if(s.rtl)diff = -diff;s.swipeDirection = diff > 0?'prev':'next';currentTranslate = diff + startTranslate;var disableParentSwiper=true;if(diff > 0 && currentTranslate > s.minTranslate()){disableParentSwiper = false;if(s.params.resistance)currentTranslate = s.minTranslate() - 1 + Math.pow(-s.minTranslate() + startTranslate + diff,s.params.resistanceRatio);}else if(diff < 0 && currentTranslate < s.maxTranslate()){disableParentSwiper = false;if(s.params.resistance)currentTranslate = s.maxTranslate() + 1 - Math.pow(s.maxTranslate() - startTranslate - diff,s.params.resistanceRatio);}if(disableParentSwiper){e.preventedByNestedSwiper = true;} // Directions locks
if(!s.params.allowSwipeToNext && s.swipeDirection === 'next' && currentTranslate < startTranslate){currentTranslate = startTranslate;}if(!s.params.allowSwipeToPrev && s.swipeDirection === 'prev' && currentTranslate > startTranslate){currentTranslate = startTranslate;}if(!s.params.followFinger)return; // Threshold
if(s.params.threshold > 0){if(Math.abs(diff) > s.params.threshold || allowThresholdMove){if(!allowThresholdMove){allowThresholdMove = true;s.touches.startX = s.touches.currentX;s.touches.startY = s.touches.currentY;currentTranslate = startTranslate;s.touches.diff = isH()?s.touches.currentX - s.touches.startX:s.touches.currentY - s.touches.startY;return;}}else {currentTranslate = startTranslate;return;}} // Update active index in free mode
if(s.params.freeMode || s.params.watchSlidesProgress){s.updateActiveIndex();}if(s.params.freeMode){ //Velocity
if(velocities.length === 0){velocities.push({position:s.touches[isH()?'startX':'startY'],time:touchStartTime});}velocities.push({position:s.touches[isH()?'currentX':'currentY'],time:new window.Date().getTime()});} // Update progress
s.updateProgress(currentTranslate); // Update translate
s.setWrapperTranslate(currentTranslate);};s.onTouchEnd = function(e){if(e.originalEvent)e = e.originalEvent;s.emit('onTouchEnd',s,e);if(!isTouched)return; //Return Grab Cursor
if(s.params.grabCursor && isMoved && isTouched){s.container[0].style.cursor = 'move';s.container[0].style.cursor = '-webkit-grab';s.container[0].style.cursor = '-moz-grab';s.container[0].style.cursor = 'grab';} // Time diff
var touchEndTime=Date.now();var timeDiff=touchEndTime - touchStartTime; // Tap, doubleTap, Click
if(s.allowClick){s.updateClickedSlide(e);s.emit('onTap',s,e);if(timeDiff < 300 && touchEndTime - lastClickTime > 300){if(clickTimeout)clearTimeout(clickTimeout);clickTimeout = setTimeout(function(){if(!s)return;if(s.params.paginationHide && s.paginationContainer.length > 0 && !$(e.target).hasClass(s.params.bulletClass)){s.paginationContainer.toggleClass(s.params.paginationHiddenClass);}s.emit('onClick',s,e);},300);}if(timeDiff < 300 && touchEndTime - lastClickTime < 300){if(clickTimeout)clearTimeout(clickTimeout);s.emit('onDoubleTap',s,e);}}lastClickTime = Date.now();setTimeout(function(){if(s && s.allowClick)s.allowClick = true;},0);if(!isTouched || !isMoved || !s.swipeDirection || s.touches.diff === 0 || currentTranslate === startTranslate){isTouched = isMoved = false;return;}isTouched = isMoved = false;var currentPos;if(s.params.followFinger){currentPos = s.rtl?s.translate:-s.translate;}else {currentPos = -currentTranslate;}if(s.params.freeMode){if(currentPos < -s.minTranslate()){s.slideTo(s.activeIndex);return;}else if(currentPos > -s.maxTranslate()){if(s.slides.length < s.snapGrid.length){s.slideTo(s.snapGrid.length - 1);}else {s.slideTo(s.slides.length - 1);}return;}if(s.params.freeModeMomentum){if(velocities.length > 1){var lastMoveEvent=velocities.pop(),velocityEvent=velocities.pop();var distance=lastMoveEvent.position - velocityEvent.position;var time=lastMoveEvent.time - velocityEvent.time;s.velocity = distance / time;s.velocity = s.velocity / 2;if(Math.abs(s.velocity) < 0.02){s.velocity = 0;} // this implies that the user stopped moving a finger then released.
// There would be no events with distance zero, so the last event is stale.
if(time > 150 || new window.Date().getTime() - lastMoveEvent.time > 300){s.velocity = 0;}}else {s.velocity = 0;}velocities.length = 0;var momentumDuration=1000 * s.params.freeModeMomentumRatio;var momentumDistance=s.velocity * momentumDuration;var newPosition=s.translate + momentumDistance;if(s.rtl)newPosition = -newPosition;var doBounce=false;var afterBouncePosition;var bounceAmount=Math.abs(s.velocity) * 20 * s.params.freeModeMomentumBounceRatio;if(newPosition < s.maxTranslate()){if(s.params.freeModeMomentumBounce){if(newPosition + s.maxTranslate() < -bounceAmount){newPosition = s.maxTranslate() - bounceAmount;}afterBouncePosition = s.maxTranslate();doBounce = true;allowMomentumBounce = true;}else {newPosition = s.maxTranslate();}}else if(newPosition > s.minTranslate()){if(s.params.freeModeMomentumBounce){if(newPosition - s.minTranslate() > bounceAmount){newPosition = s.minTranslate() + bounceAmount;}afterBouncePosition = s.minTranslate();doBounce = true;allowMomentumBounce = true;}else {newPosition = s.minTranslate();}}else if(s.params.freeModeSticky){var j=0,nextSlide;for(j = 0;j < s.snapGrid.length;j += 1) {if(s.snapGrid[j] > -newPosition){nextSlide = j;break;}}if(Math.abs(s.snapGrid[nextSlide] - newPosition) < Math.abs(s.snapGrid[nextSlide - 1] - newPosition) || s.swipeDirection === 'next'){newPosition = s.snapGrid[nextSlide];}else {newPosition = s.snapGrid[nextSlide - 1];}if(!s.rtl)newPosition = -newPosition;} //Fix duration
if(s.velocity !== 0){if(s.rtl){momentumDuration = Math.abs((-newPosition - s.translate) / s.velocity);}else {momentumDuration = Math.abs((newPosition - s.translate) / s.velocity);}}else if(s.params.freeModeSticky){s.slideReset();return;}if(s.params.freeModeMomentumBounce && doBounce){s.updateProgress(afterBouncePosition);s.setWrapperTransition(momentumDuration);s.setWrapperTranslate(newPosition);s.onTransitionStart();s.animating = true;s.wrapper.transitionEnd(function(){if(!s || !allowMomentumBounce)return;s.emit('onMomentumBounce',s);s.setWrapperTransition(s.params.speed);s.setWrapperTranslate(afterBouncePosition);s.wrapper.transitionEnd(function(){if(!s)return;s.onTransitionEnd();});});}else if(s.velocity){s.updateProgress(newPosition);s.setWrapperTransition(momentumDuration);s.setWrapperTranslate(newPosition);s.onTransitionStart();if(!s.animating){s.animating = true;s.wrapper.transitionEnd(function(){if(!s)return;s.onTransitionEnd();});}}else {s.updateProgress(newPosition);}s.updateActiveIndex();}if(!s.params.freeModeMomentum || timeDiff >= s.params.longSwipesMs){s.updateProgress();s.updateActiveIndex();}return;} // Find current slide
var i,stopIndex=0,groupSize=s.slidesSizesGrid[0];for(i = 0;i < s.slidesGrid.length;i += s.params.slidesPerGroup) {if(typeof s.slidesGrid[i + s.params.slidesPerGroup] !== 'undefined'){if(currentPos >= s.slidesGrid[i] && currentPos < s.slidesGrid[i + s.params.slidesPerGroup]){stopIndex = i;groupSize = s.slidesGrid[i + s.params.slidesPerGroup] - s.slidesGrid[i];}}else {if(currentPos >= s.slidesGrid[i]){stopIndex = i;groupSize = s.slidesGrid[s.slidesGrid.length - 1] - s.slidesGrid[s.slidesGrid.length - 2];}}} // Find current slide size
var ratio=(currentPos - s.slidesGrid[stopIndex]) / groupSize;if(timeDiff > s.params.longSwipesMs){ // Long touches
if(!s.params.longSwipes){s.slideTo(s.activeIndex);return;}if(s.swipeDirection === 'next'){if(ratio >= s.params.longSwipesRatio)s.slideTo(stopIndex + s.params.slidesPerGroup);else s.slideTo(stopIndex);}if(s.swipeDirection === 'prev'){if(ratio > 1 - s.params.longSwipesRatio)s.slideTo(stopIndex + s.params.slidesPerGroup);else s.slideTo(stopIndex);}}else { // Short swipes
if(!s.params.shortSwipes){s.slideTo(s.activeIndex);return;}if(s.swipeDirection === 'next'){s.slideTo(stopIndex + s.params.slidesPerGroup);}if(s.swipeDirection === 'prev'){s.slideTo(stopIndex);}}}; /*=========================
      Transitions
      ===========================*/s._slideTo = function(slideIndex,speed){return s.slideTo(slideIndex,speed,true,true);};s.slideTo = function(slideIndex,speed,runCallbacks,internal){if(typeof runCallbacks === 'undefined')runCallbacks = true;if(typeof slideIndex === 'undefined')slideIndex = 0;if(slideIndex < 0)slideIndex = 0;s.snapIndex = Math.floor(slideIndex / s.params.slidesPerGroup);if(s.snapIndex >= s.snapGrid.length)s.snapIndex = s.snapGrid.length - 1;var translate=-s.snapGrid[s.snapIndex]; // Directions locks
if(!s.params.allowSwipeToNext && translate < s.translate){return false;}if(!s.params.allowSwipeToPrev && translate > s.translate){return false;} // Stop autoplay
if(s.params.autoplay && s.autoplaying){if(internal || !s.params.autoplayDisableOnInteraction){s.pauseAutoplay(speed);}else {s.stopAutoplay();}} // Update progress
s.updateProgress(translate); // Normalize slideIndex
for(var i=0;i < s.slidesGrid.length;i++) {if(-translate >= s.slidesGrid[i]){slideIndex = i;}}if(typeof speed === 'undefined')speed = s.params.speed;s.previousIndex = s.activeIndex || 0;s.activeIndex = slideIndex;if(translate === s.translate){s.updateClasses();return false;}s.updateClasses();s.onTransitionStart(runCallbacks);var translateX=isH()?translate:0,translateY=isH()?0:translate;if(speed === 0){s.setWrapperTransition(0);s.setWrapperTranslate(translate);s.onTransitionEnd(runCallbacks);}else {s.setWrapperTransition(speed);s.setWrapperTranslate(translate);if(!s.animating){s.animating = true;s.wrapper.transitionEnd(function(){if(!s)return;s.onTransitionEnd(runCallbacks);});}}return true;};s.onTransitionStart = function(runCallbacks){if(typeof runCallbacks === 'undefined')runCallbacks = true;if(s.lazy)s.lazy.onTransitionStart();if(runCallbacks){s.emit('onTransitionStart',s);if(s.activeIndex !== s.previousIndex){s.emit('onSlideChangeStart',s);}}};s.onTransitionEnd = function(runCallbacks){s.animating = false;s.setWrapperTransition(0);if(typeof runCallbacks === 'undefined')runCallbacks = true;if(s.lazy)s.lazy.onTransitionEnd();if(runCallbacks){s.emit('onTransitionEnd',s);if(s.activeIndex !== s.previousIndex){s.emit('onSlideChangeEnd',s);}}if(s.params.hashnav && s.hashnav){s.hashnav.setHash();}};s.slideNext = function(runCallbacks,speed,internal){if(s.params.loop){if(s.animating)return false;s.fixLoop();var clientLeft=s.container[0].clientLeft;return s.slideTo(s.activeIndex + s.params.slidesPerGroup,speed,runCallbacks,internal);}else return s.slideTo(s.activeIndex + s.params.slidesPerGroup,speed,runCallbacks,internal);};s._slideNext = function(speed){return s.slideNext(true,speed,true);};s.slidePrev = function(runCallbacks,speed,internal){if(s.params.loop){if(s.animating)return false;s.fixLoop();var clientLeft=s.container[0].clientLeft;return s.slideTo(s.activeIndex - 1,speed,runCallbacks,internal);}else return s.slideTo(s.activeIndex - 1,speed,runCallbacks,internal);};s._slidePrev = function(speed){return s.slidePrev(true,speed,true);};s.slideReset = function(runCallbacks,speed,internal){return s.slideTo(s.activeIndex,speed,runCallbacks);}; /*=========================
      Translate/transition helpers
      ===========================*/s.setWrapperTransition = function(duration,byController){s.wrapper.transition(duration);if(s.params.effect !== 'slide' && s.effects[s.params.effect]){s.effects[s.params.effect].setTransition(duration);}if(s.params.parallax && s.parallax){s.parallax.setTransition(duration);}if(s.params.scrollbar && s.scrollbar){s.scrollbar.setTransition(duration);}if(s.params.control && s.controller){s.controller.setTransition(duration,byController);}s.emit('onSetTransition',s,duration);};s.setWrapperTranslate = function(translate,updateActiveIndex,byController){var x=0,y=0,z=0;if(isH()){x = s.rtl?-translate:translate;}else {y = translate;}if(!s.params.virtualTranslate){if(s.support.transforms3d)s.wrapper.transform('translate3d(' + x + 'px, ' + y + 'px, ' + z + 'px)');else s.wrapper.transform('translate(' + x + 'px, ' + y + 'px)');}s.translate = isH()?x:y;if(updateActiveIndex)s.updateActiveIndex();if(s.params.effect !== 'slide' && s.effects[s.params.effect]){s.effects[s.params.effect].setTranslate(s.translate);}if(s.params.parallax && s.parallax){s.parallax.setTranslate(s.translate);}if(s.params.scrollbar && s.scrollbar){s.scrollbar.setTranslate(s.translate);}if(s.params.control && s.controller){s.controller.setTranslate(s.translate,byController);}s.emit('onSetTranslate',s,s.translate);};s.getTranslate = function(el,axis){var matrix,curTransform,curStyle,transformMatrix; // automatic axis detection
if(typeof axis === 'undefined'){axis = 'x';}if(s.params.virtualTranslate){return s.rtl?-s.translate:s.translate;}curStyle = window.getComputedStyle(el,null);if(window.WebKitCSSMatrix){ // Some old versions of Webkit choke when 'none' is passed; pass
// empty string instead in this case
transformMatrix = new window.WebKitCSSMatrix(curStyle.webkitTransform === 'none'?'':curStyle.webkitTransform);}else {transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(','matrix(1, 0, 0, 1,');matrix = transformMatrix.toString().split(',');}if(axis === 'x'){ //Latest Chrome and webkits Fix
if(window.WebKitCSSMatrix)curTransform = transformMatrix.m41; //Crazy IE10 Matrix
else if(matrix.length === 16)curTransform = parseFloat(matrix[12]); //Normal Browsers
else curTransform = parseFloat(matrix[4]);}if(axis === 'y'){ //Latest Chrome and webkits Fix
if(window.WebKitCSSMatrix)curTransform = transformMatrix.m42; //Crazy IE10 Matrix
else if(matrix.length === 16)curTransform = parseFloat(matrix[13]); //Normal Browsers
else curTransform = parseFloat(matrix[5]);}if(s.rtl && curTransform)curTransform = -curTransform;return curTransform || 0;};s.getWrapperTranslate = function(axis){if(typeof axis === 'undefined'){axis = isH()?'x':'y';}return s.getTranslate(s.wrapper[0],axis);}; /*=========================
      Observer
      ===========================*/s.observers = [];function initObserver(target,options){options = options || {}; // create an observer instance
var ObserverFunc=window.MutationObserver || window.WebkitMutationObserver;var observer=new ObserverFunc(function(mutations){mutations.forEach(function(mutation){s.onResize(true);s.emit('onObserverUpdate',s,mutation);});});observer.observe(target,{attributes:typeof options.attributes === 'undefined'?true:options.attributes,childList:typeof options.childList === 'undefined'?true:options.childList,characterData:typeof options.characterData === 'undefined'?true:options.characterData});s.observers.push(observer);}s.initObservers = function(){if(s.params.observeParents){var containerParents=s.container.parents();for(var i=0;i < containerParents.length;i++) {initObserver(containerParents[i]);}} // Observe container
initObserver(s.container[0],{childList:false}); // Observe wrapper
initObserver(s.wrapper[0],{attributes:false});};s.disconnectObservers = function(){for(var i=0;i < s.observers.length;i++) {s.observers[i].disconnect();}s.observers = [];}; /*=========================
      Loop
      ===========================*/ // Create looped slides
s.createLoop = function(){ // Remove duplicated slides
s.wrapper.children('.' + s.params.slideClass + '.' + s.params.slideDuplicateClass).remove();var slides=s.wrapper.children('.' + s.params.slideClass);s.loopedSlides = parseInt(s.params.loopedSlides || s.params.slidesPerView,10);s.loopedSlides = s.loopedSlides + s.params.loopAdditionalSlides;if(s.loopedSlides > slides.length){s.loopedSlides = slides.length;}var prependSlides=[],appendSlides=[],i;slides.each(function(index,el){var slide=$(this);if(index < s.loopedSlides)appendSlides.push(el);if(index < slides.length && index >= slides.length - s.loopedSlides)prependSlides.push(el);slide.attr('data-swiper-slide-index',index);});for(i = 0;i < appendSlides.length;i++) {s.wrapper.append($(appendSlides[i].cloneNode(true)).addClass(s.params.slideDuplicateClass));}for(i = prependSlides.length - 1;i >= 0;i--) {s.wrapper.prepend($(prependSlides[i].cloneNode(true)).addClass(s.params.slideDuplicateClass));}};s.destroyLoop = function(){s.wrapper.children('.' + s.params.slideClass + '.' + s.params.slideDuplicateClass).remove();s.slides.removeAttr('data-swiper-slide-index');};s.fixLoop = function(){var newIndex; //Fix For Negative Oversliding
if(s.activeIndex < s.loopedSlides){newIndex = s.slides.length - s.loopedSlides * 3 + s.activeIndex;newIndex = newIndex + s.loopedSlides;s.slideTo(newIndex,0,false,true);} //Fix For Positive Oversliding
else if(s.params.slidesPerView === 'auto' && s.activeIndex >= s.loopedSlides * 2 || s.activeIndex > s.slides.length - s.params.slidesPerView * 2){newIndex = -s.slides.length + s.activeIndex + s.loopedSlides;newIndex = newIndex + s.loopedSlides;s.slideTo(newIndex,0,false,true);}}; /*=========================
      Append/Prepend/Remove Slides
      ===========================*/s.appendSlide = function(slides){if(s.params.loop){s.destroyLoop();}if(typeof slides === 'object' && slides.length){for(var i=0;i < slides.length;i++) {if(slides[i])s.wrapper.append(slides[i]);}}else {s.wrapper.append(slides);}if(s.params.loop){s.createLoop();}if(!(s.params.observer && s.support.observer)){s.update(true);}};s.prependSlide = function(slides){if(s.params.loop){s.destroyLoop();}var newActiveIndex=s.activeIndex + 1;if(typeof slides === 'object' && slides.length){for(var i=0;i < slides.length;i++) {if(slides[i])s.wrapper.prepend(slides[i]);}newActiveIndex = s.activeIndex + slides.length;}else {s.wrapper.prepend(slides);}if(s.params.loop){s.createLoop();}if(!(s.params.observer && s.support.observer)){s.update(true);}s.slideTo(newActiveIndex,0,false);};s.removeSlide = function(slidesIndexes){if(s.params.loop){s.destroyLoop();s.slides = s.wrapper.children('.' + s.params.slideClass);}var newActiveIndex=s.activeIndex,indexToRemove;if(typeof slidesIndexes === 'object' && slidesIndexes.length){for(var i=0;i < slidesIndexes.length;i++) {indexToRemove = slidesIndexes[i];if(s.slides[indexToRemove])s.slides.eq(indexToRemove).remove();if(indexToRemove < newActiveIndex)newActiveIndex--;}newActiveIndex = Math.max(newActiveIndex,0);}else {indexToRemove = slidesIndexes;if(s.slides[indexToRemove])s.slides.eq(indexToRemove).remove();if(indexToRemove < newActiveIndex)newActiveIndex--;newActiveIndex = Math.max(newActiveIndex,0);}if(s.params.loop){s.createLoop();}if(!(s.params.observer && s.support.observer)){s.update(true);}if(s.params.loop){s.slideTo(newActiveIndex + s.loopedSlides,0,false);}else {s.slideTo(newActiveIndex,0,false);}};s.removeAllSlides = function(){var slidesIndexes=[];for(var i=0;i < s.slides.length;i++) {slidesIndexes.push(i);}s.removeSlide(slidesIndexes);}; /*=========================
      Effects
      ===========================*/s.effects = {fade:{fadeIndex:null,setTranslate:function setTranslate(){for(var i=0;i < s.slides.length;i++) {var slide=s.slides.eq(i);var offset=slide[0].swiperSlideOffset;var tx=-offset;if(!s.params.virtualTranslate)tx = tx - s.translate;var ty=0;if(!isH()){ty = tx;tx = 0;}var slideOpacity=s.params.fade.crossFade?Math.max(1 - Math.abs(slide[0].progress),0):1 + Math.min(Math.max(slide[0].progress,-1),0);if(slideOpacity > 0 && slideOpacity < 1){s.effects.fade.fadeIndex = i;}slide.css({opacity:slideOpacity}).transform('translate3d(' + tx + 'px, ' + ty + 'px, 0px)');}},setTransition:function setTransition(duration){s.slides.transition(duration);if(s.params.virtualTranslate && duration !== 0){var fadeIndex=s.effects.fade.fadeIndex !== null?s.effects.fade.fadeIndex:s.activeIndex;if(!(s.params.loop || s.params.fade.crossFade) && fadeIndex === 0){fadeIndex = s.slides.length - 1;}s.slides.eq(fadeIndex).transitionEnd(function(){if(!s)return;var triggerEvents=['webkitTransitionEnd','transitionend','oTransitionEnd','MSTransitionEnd','msTransitionEnd'];for(var i=0;i < triggerEvents.length;i++) {s.wrapper.trigger(triggerEvents[i]);}});}}},cube:{setTranslate:function setTranslate(){var wrapperRotate=0,cubeShadow;if(s.params.cube.shadow){if(isH()){cubeShadow = s.wrapper.find('.swiper-cube-shadow');if(cubeShadow.length === 0){cubeShadow = $('<div class="swiper-cube-shadow"></div>');s.wrapper.append(cubeShadow);}cubeShadow.css({height:s.width + 'px'});}else {cubeShadow = s.container.find('.swiper-cube-shadow');if(cubeShadow.length === 0){cubeShadow = $('<div class="swiper-cube-shadow"></div>');s.container.append(cubeShadow);}}}for(var i=0;i < s.slides.length;i++) {var slide=s.slides.eq(i);var slideAngle=i * 90;var round=Math.floor(slideAngle / 360);if(s.rtl){slideAngle = -slideAngle;round = Math.floor(-slideAngle / 360);}var progress=Math.max(Math.min(slide[0].progress,1),-1);var tx=0,ty=0,tz=0;if(i % 4 === 0){tx = -round * 4 * s.size;tz = 0;}else if((i - 1) % 4 === 0){tx = 0;tz = -round * 4 * s.size;}else if((i - 2) % 4 === 0){tx = s.size + round * 4 * s.size;tz = s.size;}else if((i - 3) % 4 === 0){tx = -s.size;tz = 3 * s.size + s.size * 4 * round;}if(s.rtl){tx = -tx;}if(!isH()){ty = tx;tx = 0;}var transform='rotateX(' + (isH()?0:-slideAngle) + 'deg) rotateY(' + (isH()?slideAngle:0) + 'deg) translate3d(' + tx + 'px, ' + ty + 'px, ' + tz + 'px)';if(progress <= 1 && progress > -1){wrapperRotate = i * 90 + progress * 90;if(s.rtl)wrapperRotate = -i * 90 - progress * 90;}slide.transform(transform);if(s.params.cube.slideShadows){ //Set shadows
var shadowBefore=isH()?slide.find('.swiper-slide-shadow-left'):slide.find('.swiper-slide-shadow-top');var shadowAfter=isH()?slide.find('.swiper-slide-shadow-right'):slide.find('.swiper-slide-shadow-bottom');if(shadowBefore.length === 0){shadowBefore = $('<div class="swiper-slide-shadow-' + (isH()?'left':'top') + '"></div>');slide.append(shadowBefore);}if(shadowAfter.length === 0){shadowAfter = $('<div class="swiper-slide-shadow-' + (isH()?'right':'bottom') + '"></div>');slide.append(shadowAfter);}var shadowOpacity=slide[0].progress;if(shadowBefore.length)shadowBefore[0].style.opacity = -slide[0].progress;if(shadowAfter.length)shadowAfter[0].style.opacity = slide[0].progress;}}s.wrapper.css({'-webkit-transform-origin':'50% 50% -' + s.size / 2 + 'px','-moz-transform-origin':'50% 50% -' + s.size / 2 + 'px','-ms-transform-origin':'50% 50% -' + s.size / 2 + 'px','transform-origin':'50% 50% -' + s.size / 2 + 'px'});if(s.params.cube.shadow){if(isH()){cubeShadow.transform('translate3d(0px, ' + (s.width / 2 + s.params.cube.shadowOffset) + 'px, ' + -s.width / 2 + 'px) rotateX(90deg) rotateZ(0deg) scale(' + s.params.cube.shadowScale + ')');}else {var shadowAngle=Math.abs(wrapperRotate) - Math.floor(Math.abs(wrapperRotate) / 90) * 90;var multiplier=1.5 - (Math.sin(shadowAngle * 2 * Math.PI / 360) / 2 + Math.cos(shadowAngle * 2 * Math.PI / 360) / 2);var scale1=s.params.cube.shadowScale,scale2=s.params.cube.shadowScale / multiplier,offset=s.params.cube.shadowOffset;cubeShadow.transform('scale3d(' + scale1 + ', 1, ' + scale2 + ') translate3d(0px, ' + (s.height / 2 + offset) + 'px, ' + -s.height / 2 / scale2 + 'px) rotateX(-90deg)');}}var zFactor=s.isSafari || s.isUiWebView?-s.size / 2:0;s.wrapper.transform('translate3d(0px,0,' + zFactor + 'px) rotateX(' + (isH()?0:wrapperRotate) + 'deg) rotateY(' + (isH()?-wrapperRotate:0) + 'deg)');},setTransition:function setTransition(duration){s.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);if(s.params.cube.shadow && !isH()){s.container.find('.swiper-cube-shadow').transition(duration);}}},coverflow:{setTranslate:function setTranslate(){var transform=s.translate;var center=isH()?-transform + s.width / 2:-transform + s.height / 2;var rotate=isH()?s.params.coverflow.rotate:-s.params.coverflow.rotate;var translate=s.params.coverflow.depth; //Each slide offset from center
for(var i=0,length=s.slides.length;i < length;i++) {var slide=s.slides.eq(i);var slideSize=s.slidesSizesGrid[i];var slideOffset=slide[0].swiperSlideOffset;var offsetMultiplier=(center - slideOffset - slideSize / 2) / slideSize * s.params.coverflow.modifier;var rotateY=isH()?rotate * offsetMultiplier:0;var rotateX=isH()?0:rotate * offsetMultiplier; // var rotateZ = 0
var translateZ=-translate * Math.abs(offsetMultiplier);var translateY=isH()?0:s.params.coverflow.stretch * offsetMultiplier;var translateX=isH()?s.params.coverflow.stretch * offsetMultiplier:0; //Fix for ultra small values
if(Math.abs(translateX) < 0.001)translateX = 0;if(Math.abs(translateY) < 0.001)translateY = 0;if(Math.abs(translateZ) < 0.001)translateZ = 0;if(Math.abs(rotateY) < 0.001)rotateY = 0;if(Math.abs(rotateX) < 0.001)rotateX = 0;var slideTransform='translate3d(' + translateX + 'px,' + translateY + 'px,' + translateZ + 'px)  rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg)';slide.transform(slideTransform);slide[0].style.zIndex = -Math.abs(Math.round(offsetMultiplier)) + 1;if(s.params.coverflow.slideShadows){ //Set shadows
var shadowBefore=isH()?slide.find('.swiper-slide-shadow-left'):slide.find('.swiper-slide-shadow-top');var shadowAfter=isH()?slide.find('.swiper-slide-shadow-right'):slide.find('.swiper-slide-shadow-bottom');if(shadowBefore.length === 0){shadowBefore = $('<div class="swiper-slide-shadow-' + (isH()?'left':'top') + '"></div>');slide.append(shadowBefore);}if(shadowAfter.length === 0){shadowAfter = $('<div class="swiper-slide-shadow-' + (isH()?'right':'bottom') + '"></div>');slide.append(shadowAfter);}if(shadowBefore.length)shadowBefore[0].style.opacity = offsetMultiplier > 0?offsetMultiplier:0;if(shadowAfter.length)shadowAfter[0].style.opacity = -offsetMultiplier > 0?-offsetMultiplier:0;}} //Set correct perspective for IE10
if(s.browser.ie){var ws=s.wrapper[0].style;ws.perspectiveOrigin = center + 'px 50%';}},setTransition:function setTransition(duration){s.slides.transition(duration).find('.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left').transition(duration);}}}; /*=========================
      Images Lazy Loading
      ===========================*/s.lazy = {initialImageLoaded:false,loadImageInSlide:function loadImageInSlide(index,loadInDuplicate){if(typeof index === 'undefined')return;if(typeof loadInDuplicate === 'undefined')loadInDuplicate = true;if(s.slides.length === 0)return;var slide=s.slides.eq(index);var img=slide.find('.swiper-lazy:not(.swiper-lazy-loaded):not(.swiper-lazy-loading)');if(slide.hasClass('swiper-lazy') && !slide.hasClass('swiper-lazy-loaded') && !slide.hasClass('swiper-lazy-loading')){img.add(slide[0]);}if(img.length === 0)return;img.each(function(){var _img=$(this);_img.addClass('swiper-lazy-loading');var background=_img.attr('data-background');var src=_img.attr('data-src');s.loadImage(_img[0],src || background,false,function(){if(background){_img.css('background-image','url(' + background + ')');_img.removeAttr('data-background');}else {_img.attr('src',src);_img.removeAttr('data-src');}_img.addClass('swiper-lazy-loaded').removeClass('swiper-lazy-loading');slide.find('.swiper-lazy-preloader, .preloader').remove();if(s.params.loop && loadInDuplicate){var slideOriginalIndex=slide.attr('data-swiper-slide-index');if(slide.hasClass(s.params.slideDuplicateClass)){var originalSlide=s.wrapper.children('[data-swiper-slide-index="' + slideOriginalIndex + '"]:not(.' + s.params.slideDuplicateClass + ')');s.lazy.loadImageInSlide(originalSlide.index(),false);}else {var duplicatedSlide=s.wrapper.children('.' + s.params.slideDuplicateClass + '[data-swiper-slide-index="' + slideOriginalIndex + '"]');s.lazy.loadImageInSlide(duplicatedSlide.index(),false);}}s.emit('onLazyImageReady',s,slide[0],_img[0]);});s.emit('onLazyImageLoad',s,slide[0],_img[0]);});},load:function load(){if(s.params.watchSlidesVisibility){s.wrapper.children('.' + s.params.slideVisibleClass).each(function(){s.lazy.loadImageInSlide($(this).index());});}else {if(s.params.slidesPerView > 1){for(var i=s.activeIndex;i < s.activeIndex + s.params.slidesPerView;i++) {if(s.slides[i])s.lazy.loadImageInSlide(i);}}else {s.lazy.loadImageInSlide(s.activeIndex);}}if(s.params.lazyLoadingInPrevNext){var nextSlide=s.wrapper.children('.' + s.params.slideNextClass);if(nextSlide.length > 0)s.lazy.loadImageInSlide(nextSlide.index());var prevSlide=s.wrapper.children('.' + s.params.slidePrevClass);if(prevSlide.length > 0)s.lazy.loadImageInSlide(prevSlide.index());}},onTransitionStart:function onTransitionStart(){if(s.params.lazyLoading){if(s.params.lazyLoadingOnTransitionStart || !s.params.lazyLoadingOnTransitionStart && !s.lazy.initialImageLoaded){s.lazy.load();}}},onTransitionEnd:function onTransitionEnd(){if(s.params.lazyLoading && !s.params.lazyLoadingOnTransitionStart){s.lazy.load();}}}; /*=========================
      Scrollbar
      ===========================*/s.scrollbar = {set:function set(){if(!s.params.scrollbar)return;var sb=s.scrollbar;sb.track = $(s.params.scrollbar);sb.drag = sb.track.find('.swiper-scrollbar-drag');if(sb.drag.length === 0){sb.drag = $('<div class="swiper-scrollbar-drag"></div>');sb.track.append(sb.drag);}sb.drag[0].style.width = '';sb.drag[0].style.height = '';sb.trackSize = isH()?sb.track[0].offsetWidth:sb.track[0].offsetHeight;sb.divider = s.size / s.virtualSize;sb.moveDivider = sb.divider * (sb.trackSize / s.size);sb.dragSize = sb.trackSize * sb.divider;if(isH()){sb.drag[0].style.width = sb.dragSize + 'px';}else {sb.drag[0].style.height = sb.dragSize + 'px';}if(sb.divider >= 1){sb.track[0].style.display = 'none';}else {sb.track[0].style.display = '';}if(s.params.scrollbarHide){sb.track[0].style.opacity = 0;}},setTranslate:function setTranslate(){if(!s.params.scrollbar)return;var diff;var sb=s.scrollbar;var translate=s.translate || 0;var newPos;var newSize=sb.dragSize;newPos = (sb.trackSize - sb.dragSize) * s.progress;if(s.rtl && isH()){newPos = -newPos;if(newPos > 0){newSize = sb.dragSize - newPos;newPos = 0;}else if(-newPos + sb.dragSize > sb.trackSize){newSize = sb.trackSize + newPos;}}else {if(newPos < 0){newSize = sb.dragSize + newPos;newPos = 0;}else if(newPos + sb.dragSize > sb.trackSize){newSize = sb.trackSize - newPos;}}if(isH()){if(s.support.transforms3d){sb.drag.transform('translate3d(' + newPos + 'px, 0, 0)');}else {sb.drag.transform('translateX(' + newPos + 'px)');}sb.drag[0].style.width = newSize + 'px';}else {if(s.support.transforms3d){sb.drag.transform('translate3d(0px, ' + newPos + 'px, 0)');}else {sb.drag.transform('translateY(' + newPos + 'px)');}sb.drag[0].style.height = newSize + 'px';}if(s.params.scrollbarHide){clearTimeout(sb.timeout);sb.track[0].style.opacity = 1;sb.timeout = setTimeout(function(){sb.track[0].style.opacity = 0;sb.track.transition(400);},1000);}},setTransition:function setTransition(duration){if(!s.params.scrollbar)return;s.scrollbar.drag.transition(duration);}}; /*=========================
      Controller
      ===========================*/s.controller = {setTranslate:function setTranslate(translate,byController){var controlled=s.params.control;var multiplier,controlledTranslate;function setControlledTranslate(c){translate = c.rtl && c.params.direction === 'horizontal'?-s.translate:s.translate;multiplier = (c.maxTranslate() - c.minTranslate()) / (s.maxTranslate() - s.minTranslate());controlledTranslate = (translate - s.minTranslate()) * multiplier + c.minTranslate();if(s.params.controlInverse){controlledTranslate = c.maxTranslate() - controlledTranslate;}c.updateProgress(controlledTranslate);c.setWrapperTranslate(controlledTranslate,false,s);c.updateActiveIndex();}if(s.isArray(controlled)){for(var i=0;i < controlled.length;i++) {if(controlled[i] !== byController && controlled[i] instanceof Swiper){setControlledTranslate(controlled[i]);}}}else if(controlled instanceof Swiper && byController !== controlled){setControlledTranslate(controlled);}},setTransition:function setTransition(duration,byController){var controlled=s.params.control;var i;function setControlledTransition(c){c.setWrapperTransition(duration,s);if(duration !== 0){c.onTransitionStart();c.wrapper.transitionEnd(function(){if(!controlled)return;c.onTransitionEnd();});}}if(s.isArray(controlled)){for(i = 0;i < controlled.length;i++) {if(controlled[i] !== byController && controlled[i] instanceof Swiper){setControlledTransition(controlled[i]);}}}else if(controlled instanceof Swiper && byController !== controlled){setControlledTransition(controlled);}}}; /*=========================
      Parallax
      ===========================*/function setParallaxTransform(el,progress){el = $(el);var p,pX,pY;p = el.attr('data-swiper-parallax') || '0';pX = el.attr('data-swiper-parallax-x');pY = el.attr('data-swiper-parallax-y');if(pX || pY){pX = pX || '0';pY = pY || '0';}else {if(isH()){pX = p;pY = '0';}else {pY = p;pX = '0';}}if(pX.indexOf('%') >= 0){pX = parseInt(pX,10) * progress + '%';}else {pX = pX * progress + 'px';}if(pY.indexOf('%') >= 0){pY = parseInt(pY,10) * progress + '%';}else {pY = pY * progress + 'px';}el.transform('translate3d(' + pX + ', ' + pY + ',0px)');}s.parallax = {setTranslate:function setTranslate(){s.container.children('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function(){setParallaxTransform(this,s.progress);});s.slides.each(function(){var slide=$(this);slide.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function(){var progress=Math.min(Math.max(slide[0].progress,-1),1);setParallaxTransform(this,progress);});});},setTransition:function setTransition(duration){if(typeof duration === 'undefined')duration = s.params.speed;s.container.find('[data-swiper-parallax], [data-swiper-parallax-x], [data-swiper-parallax-y]').each(function(){var el=$(this);var parallaxDuration=parseInt(el.attr('data-swiper-parallax-duration'),10) || duration;if(duration === 0)parallaxDuration = 0;el.transition(parallaxDuration);});}}; /*=========================
      Plugins API. Collect all and init all plugins
      ===========================*/s._plugins = [];for(var plugin in s.plugins) {var p=s.plugins[plugin](s,s.params[plugin]);if(p)s._plugins.push(p);} // Method to call all plugins event/method
s.callPlugins = function(eventName){for(var i=0;i < s._plugins.length;i++) {if(eventName in s._plugins[i]){s._plugins[i][eventName](arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);}}}; /*=========================
      Events/Callbacks/Plugins Emitter
      ===========================*/function normalizeEventName(eventName){if(eventName.indexOf('on') !== 0){if(eventName[0] !== eventName[0].toUpperCase()){eventName = 'on' + eventName[0].toUpperCase() + eventName.substring(1);}else {eventName = 'on' + eventName;}}return eventName;}s.emitterEventListeners = {};s.emit = function(eventName){ // Trigger callbacks
if(s.params[eventName]){s.params[eventName](arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);}var i; // Trigger events
if(s.emitterEventListeners[eventName]){for(i = 0;i < s.emitterEventListeners[eventName].length;i++) {s.emitterEventListeners[eventName][i](arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);}} // Trigger plugins
if(s.callPlugins)s.callPlugins(eventName,arguments[1],arguments[2],arguments[3],arguments[4],arguments[5]);};s.on = function(eventName,handler){eventName = normalizeEventName(eventName);if(!s.emitterEventListeners[eventName])s.emitterEventListeners[eventName] = [];s.emitterEventListeners[eventName].push(handler);return s;};s.off = function(eventName,handler){var i;eventName = normalizeEventName(eventName);if(typeof handler === 'undefined'){ // Remove all handlers for such event
s.emitterEventListeners[eventName] = [];return s;}if(!s.emitterEventListeners[eventName] || s.emitterEventListeners[eventName].length === 0)return;for(i = 0;i < s.emitterEventListeners[eventName].length;i++) {if(s.emitterEventListeners[eventName][i] === handler)s.emitterEventListeners[eventName].splice(i,1);}return s;};s.once = function(eventName,handler){eventName = normalizeEventName(eventName);var _handler=function _handler(){handler(arguments[0],arguments[1],arguments[2],arguments[3],arguments[4]);s.off(eventName,_handler);};s.on(eventName,_handler);return s;}; // Accessibility tools
s.a11y = {makeFocusable:function makeFocusable($el){$el[0].tabIndex = '0';return $el;},addRole:function addRole($el,role){$el.attr('role',role);return $el;},addLabel:function addLabel($el,label){$el.attr('aria-label',label);return $el;},disable:function disable($el){$el.attr('aria-disabled',true);return $el;},enable:function enable($el){$el.attr('aria-disabled',false);return $el;},onEnterKey:function onEnterKey(event){if(event.keyCode !== 13)return;if($(event.target).is(s.params.nextButton)){s.onClickNext(event);if(s.isEnd){s.a11y.notify(s.params.lastSlideMsg);}else {s.a11y.notify(s.params.nextSlideMsg);}}else if($(event.target).is(s.params.prevButton)){s.onClickPrev(event);if(s.isBeginning){s.a11y.notify(s.params.firstSlideMsg);}else {s.a11y.notify(s.params.prevSlideMsg);}}},liveRegion:$('<span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span>'),notify:function notify(message){var notification=s.a11y.liveRegion;if(notification.length === 0)return;notification.html('');notification.html(message);},init:function init(){ // Setup accessibility
if(s.params.nextButton){var nextButton=$(s.params.nextButton);s.a11y.makeFocusable(nextButton);s.a11y.addRole(nextButton,'button');s.a11y.addLabel(nextButton,s.params.nextSlideMsg);}if(s.params.prevButton){var prevButton=$(s.params.prevButton);s.a11y.makeFocusable(prevButton);s.a11y.addRole(prevButton,'button');s.a11y.addLabel(prevButton,s.params.prevSlideMsg);}$(s.container).append(s.a11y.liveRegion);},destroy:function destroy(){if(s.a11y.liveRegion && s.a11y.liveRegion.length > 0)s.a11y.liveRegion.remove();}}; /*=========================
      Init/Destroy
      ===========================*/s.init = function(){if(s.params.loop)s.createLoop();s.updateContainerSize();s.updateSlidesSize();s.updatePagination();if(s.params.scrollbar && s.scrollbar){s.scrollbar.set();}if(s.params.effect !== 'slide' && s.effects[s.params.effect]){if(!s.params.loop)s.updateProgress();s.effects[s.params.effect].setTranslate();}if(s.params.loop){s.slideTo(s.params.initialSlide + s.loopedSlides,0,s.params.runCallbacksOnInit);}else {s.slideTo(s.params.initialSlide,0,s.params.runCallbacksOnInit);if(s.params.initialSlide === 0){if(s.parallax && s.params.parallax)s.parallax.setTranslate();if(s.lazy && s.params.lazyLoading){s.lazy.load();s.lazy.initialImageLoaded = true;}}}s.attachEvents();if(s.params.observer && s.support.observer){s.initObservers();}if(s.params.preloadImages && !s.params.lazyLoading){s.preloadImages();}if(s.params.autoplay){s.startAutoplay();}if(s.params.keyboardControl){if(s.enableKeyboardControl)s.enableKeyboardControl();}if(s.params.mousewheelControl){if(s.enableMousewheelControl)s.enableMousewheelControl();}if(s.params.hashnav){if(s.hashnav)s.hashnav.init();}if(s.params.a11y && s.a11y)s.a11y.init();s.emit('onInit',s);}; // Cleanup dynamic styles
s.cleanupStyles = function(){ // Container
s.container.removeClass(s.classNames.join(' ')).removeAttr('style'); // Wrapper
s.wrapper.removeAttr('style'); // Slides
if(s.slides && s.slides.length){s.slides.removeClass([s.params.slideVisibleClass,s.params.slideActiveClass,s.params.slideNextClass,s.params.slidePrevClass].join(' ')).removeAttr('style').removeAttr('data-swiper-column').removeAttr('data-swiper-row');} // Pagination/Bullets
if(s.paginationContainer && s.paginationContainer.length){s.paginationContainer.removeClass(s.params.paginationHiddenClass);}if(s.bullets && s.bullets.length){s.bullets.removeClass(s.params.bulletActiveClass);} // Buttons
if(s.params.prevButton)$(s.params.prevButton).removeClass(s.params.buttonDisabledClass);if(s.params.nextButton)$(s.params.nextButton).removeClass(s.params.buttonDisabledClass); // Scrollbar
if(s.params.scrollbar && s.scrollbar){if(s.scrollbar.track && s.scrollbar.track.length)s.scrollbar.track.removeAttr('style');if(s.scrollbar.drag && s.scrollbar.drag.length)s.scrollbar.drag.removeAttr('style');}}; // Destroy
s.destroy = function(deleteInstance,cleanupStyles){ // Detach evebts
s.detachEvents(); // Stop autoplay
s.stopAutoplay(); // Destroy loop
if(s.params.loop){s.destroyLoop();} // Cleanup styles
if(cleanupStyles){s.cleanupStyles();} // Disconnect observer
s.disconnectObservers(); // Disable keyboard/mousewheel
if(s.params.keyboardControl){if(s.disableKeyboardControl)s.disableKeyboardControl();}if(s.params.mousewheelControl){if(s.disableMousewheelControl)s.disableMousewheelControl();} // Disable a11y
if(s.params.a11y && s.a11y)s.a11y.destroy(); // Destroy callback
s.emit('onDestroy'); // Delete instance
if(deleteInstance !== false)s = null;};s.init(); // Return swiper instance
return s;}; /*==================================================
    Prototype
====================================================*/Swiper.prototype = {isSafari:(function(){var ua=navigator.userAgent.toLowerCase();return ua.indexOf('safari') >= 0 && ua.indexOf('chrome') < 0 && ua.indexOf('android') < 0;})(),isUiWebView:/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent),isArray:function isArray(arr){return Object.prototype.toString.apply(arr) === '[object Array]';}, /*==================================================
    Browser
    ====================================================*/browser:{ie:window.navigator.pointerEnabled || window.navigator.msPointerEnabled,ieTouch:window.navigator.msPointerEnabled && window.navigator.msMaxTouchPoints > 1 || window.navigator.pointerEnabled && window.navigator.maxTouchPoints > 1}, /*==================================================
    Devices
    ====================================================*/device:(function(){var ua=navigator.userAgent;var android=ua.match(/(Android);?[\s\/]+([\d.]+)?/);var ipad=ua.match(/(iPad).*OS\s([\d_]+)/);var ipod=ua.match(/(iPod)(.*OS\s([\d_]+))?/);var iphone=!ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);return {ios:ipad || iphone || ipad,android:android};})(), /*==================================================
    Feature Detection
    ====================================================*/support:{touch:window.Modernizr && Modernizr.touch === true || (function(){return !!('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch);})(),transforms3d:window.Modernizr && Modernizr.csstransforms3d === true || (function(){var div=document.createElement('div').style;return 'webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div;})(),flexbox:(function(){var div=document.createElement('div').style;var styles='alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient'.split(' ');for(var i=0;i < styles.length;i++) {if(styles[i] in div)return true;}})(),observer:(function(){return 'MutationObserver' in window || 'WebkitMutationObserver' in window;})()}, /*==================================================
    Plugins
    ====================================================*/plugins:{}};module.exports = {swiper:Swiper};

},{}],113:[function(require,module,exports){
"use strict";

module.exports = {
    uuid: function uuid() {
        var S4 = function S4() {
            return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
        };
        return S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4();
    }
};

},{}],114:[function(require,module,exports){
'use strict';

module.exports = {
	App: require('./App'),
	Navbar: require('./Navbar'),
	RestoreScrollPosition: require('./RestoreScrollPosition'),
	Swiper: require('./Swiper'),
	Utils: require('./Utils')
};

},{"./App":109,"./Navbar":110,"./RestoreScrollPosition":111,"./Swiper":112,"./Utils":113}],115:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "actions-modal" },
            this.props.children
        );
    }
});

},{"react":undefined}],116:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    getDefaultProps: function getDefaultProps() {
        return {
            color: false
        };
    },
    onTap: function onTap() {
        var func = this.props.onTap;
        func && func(this);
        app.hideModal();
    },
    render: function render() {
        var obj = {
            'actions-modal-button': true
        };
        if (this.props.color) {
            obj['color-' + this.props.color] = true;
        }
        var className = cn(obj);
        return React.createElement(
            'span',
            { className: className, onClick: this.onTap },
            this.props.children
        );
    }
});

},{"classnames":52,"react":undefined}],117:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "actions-modal-group" },
            this.props.children
        );
    }
});

},{"react":undefined}],118:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "span",
            { className: "actions-modal-label" },
            this.props.children
        );
    }
});

},{"react":undefined}],119:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "modal" },
            this.props.children
        );
    }
});

},{"react":undefined}],120:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    onTap: function onTap() {
        var func = this.props.onTap;
        func && func(this);
        app.hideModal();
    },
    render: function render() {
        return React.createElement(
            "span",
            { className: "modal-button", style: this.props.style, onClick: this.onTap },
            this.props.children
        );
    }
});

},{"react":undefined}],121:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "modal-buttons" },
            this.props.children
        );
    }
});

},{"react":undefined}],122:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "modal-inner" },
            this.props.children
        );
    }
});

},{"react":undefined}],123:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "modal modal-no-buttons" },
            this.props.children
        );
    }
});

},{"react":undefined}],124:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "modal-text" },
            this.props.children
        );
    }
});

},{"react":undefined}],125:[function(require,module,exports){
'use strict';

var React = require('react');

module.exports = React.createClass({
    displayName: 'exports',

    getDefaultProps: function getDefaultProps() {
        return {
            type: 'text'
        };
    },
    render: function render() {
        return React.createElement('input', { type: this.props.type, className: 'modal-text-input', placeholder: this.props.placeholder });
    }
});

},{"react":undefined}],126:[function(require,module,exports){
'use strict';

var React = require('react');

module.exports = React.createClass({
    displayName: 'exports',

    getDefaultProps: function getDefaultProps() {
        return {
            type: 'text'
        };
    },
    render: function render() {
        return React.createElement('input', { type: this.props.type, className: 'modal-text-input modal-text-input-double', placeholder: this.props.placeholder });
    }
});

},{"react":undefined}],127:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "modal-title" },
            this.props.children
        );
    }
});

},{"react":undefined}],128:[function(require,module,exports){
'use strict';

var React = require('react');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var ModalOverlay = require('./Overlay/ModalOverlay');
var PreloaderIndicatorOverlay = require('./Overlay/PreloaderIndicatorOverlay');
var IndicatorModal = require('./Preloader/IndicatorModal');

module.exports = React.createClass({
    displayName: 'exports',

    getDefaultProps: function getDefaultProps() {
        return {
            visible: false
        };
    },
    getTransition: function getTransition(type) {
        switch (type) {
            case 'actionsModal':
                return { name: 'actionsModal', enter: true, leave: true, onTap: app.hideModal };
            case 'modal':
                return { name: 'modal', enter: true, leave: true };
            case 'popoverModal':
                return { name: 'popoverModal', enter: false, leave: true, onTap: app.hideModal };
            case 'pickerModal':
                return { name: 'pickerModal', enter: false, leave: true, onTap: app.hideModal };
            default:
                return { name: 'unknown', enter: false, leave: false };
        }
    },
    render: function render() {
        var type = this.props.type;
        if (type === 'indicator') {
            return this.props.visible && React.createElement(
                'div',
                null,
                React.createElement(PreloaderIndicatorOverlay, null),
                React.createElement(IndicatorModal, null)
            );
        } else {
            var trans = this.getTransition(type);
            return React.createElement(
                'div',
                null,
                React.createElement(
                    ReactCSSTransitionGroup,
                    { transitionName: 'modalOverlay' },
                    this.props.visible && React.createElement(ModalOverlay, { onTap: trans.onTap })
                ),
                React.createElement(
                    ReactCSSTransitionGroup,
                    { transitionName: trans.name, transitionEnter: trans.enter, transitionLeave: trans.leave },
                    this.props.visible && this.props.children
                )
            );
        }
    }
});

},{"./Overlay/ModalOverlay":129,"./Overlay/PreloaderIndicatorOverlay":130,"./Preloader/IndicatorModal":133,"react":undefined}],129:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement("div", { className: "modal-overlay", onClick: this.props.onTap });
    }
});

},{"react":undefined}],130:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement("div", { className: "preloader-indicator-overlay" });
    }
});

},{"react":undefined}],131:[function(require,module,exports){
'use strict';

var React = require('react');

module.exports = React.createClass({
    displayName: 'exports',

    sizePopover: function sizePopover(modal, modalAngle, target) {
        modal.css({ left: '', top: '' });
        var modalWidth = modal.width();
        var modalHeight = modal.height(); // 13 - height of angle
        var modalAngle,
            modalAngleSize = 0,
            modalAngleLeft,
            modalAngleTop;

        modalAngleSize = modalAngle.width() / 2;
        modalAngle.removeClass('on-left on-right on-top on-bottom').css({ left: '', top: '' });

        var targetWidth = target.outerWidth();
        var targetHeight = target.outerHeight();
        var targetOffset = target.offset();

        var windowHeight = $(window).height();
        var windowWidth = $(window).width();

        var modalTop = 0;
        var modalLeft = 0;
        var diff = 0;
        // Top Position
        var modalPosition = 'top';
        if (modalHeight + modalAngleSize < targetOffset.top) {
            // On top
            modalTop = targetOffset.top - modalHeight - modalAngleSize;
        } else if (modalHeight + modalAngleSize < windowHeight - targetOffset.top - targetHeight) {
            // On bottom
            modalPosition = 'bottom';
            modalTop = targetOffset.top + targetHeight + modalAngleSize;
        } else {
            // On middle
            modalPosition = 'middle';
            modalTop = targetHeight / 2 + targetOffset.top - modalHeight / 2;
            diff = modalTop;
            if (modalTop <= 0) {
                modalTop = 5;
            } else if (modalTop + modalHeight >= windowHeight) {
                modalTop = windowHeight - modalHeight - 5;
            }
            diff = diff - modalTop;
        }

        // Horizontal Position
        if (modalPosition === 'top' || modalPosition === 'bottom') {
            modalLeft = targetWidth / 2 + targetOffset.left - modalWidth / 2;
            diff = modalLeft;
            if (modalLeft < 5) modalLeft = 5;
            if (modalLeft + modalWidth > windowWidth) modalLeft = windowWidth - modalWidth - 5;
            if (modalPosition === 'top') {
                modalAngle.addClass('on-bottom');
            }
            if (modalPosition === 'bottom') {
                modalAngle.addClass('on-top');
            }
            diff = diff - modalLeft;
            modalAngleLeft = modalWidth / 2 - modalAngleSize + diff;
            modalAngleLeft = Math.max(Math.min(modalAngleLeft, modalWidth - modalAngleSize * 2 - 6), 6);
            modalAngle.css({ left: modalAngleLeft + 'px' });
        } else if (modalPosition === 'middle') {
            modalLeft = targetOffset.left - modalWidth - modalAngleSize;
            modalAngle.addClass('on-right');
            if (modalLeft < 5 || modalLeft + modalWidth > windowWidth) {
                if (modalLeft < 5) modalLeft = targetOffset.left + targetWidth + modalAngleSize;
                if (modalLeft + modalWidth > windowWidth) modalLeft = windowWidth - modalWidth - 5;
                modalAngle.removeClass('on-right').addClass('on-left');
            }
            modalAngleTop = modalHeight / 2 - modalAngleSize + diff;
            modalAngleTop = Math.max(Math.min(modalAngleTop, modalHeight - modalAngleSize * 2 - 6), 6);
            modalAngle.css({ top: modalAngleTop + 'px' });
        }
        // Apply Styles
        modal.css({ top: modalTop + 'px', left: modalLeft + 'px' });
    },
    componentDidMount: function componentDidMount() {
        var modal = $(this.refs.modal.getDOMNode());
        var modalAngle = $(this.refs.modalAngle.getDOMNode());
        var target = $(this.props.target);
        this.sizePopover(modal, modalAngle, target);
    },
    render: function render() {
        return React.createElement(
            'div',
            { ref: 'modal', className: 'popover popover-menu', onClick: app.hideModal },
            React.createElement('div', { ref: 'modalAngle', className: 'popover-angle' }),
            React.createElement(
                'div',
                { className: 'popover-inner' },
                this.props.children
            )
        );
    }
});

},{"react":undefined}],132:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "span",
            { className: "preloader" },
            " "
        );
    }
});

},{"react":undefined}],133:[function(require,module,exports){
'use strict';

var React = require('react');
var PreloaderIndicatorModal = require('./PreloaderIndicatorModal');
var WhitePreloader = require('./WhitePreloader');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        return React.createElement(
            PreloaderIndicatorModal,
            null,
            React.createElement(WhitePreloader, null)
        );
    }
});

},{"./PreloaderIndicatorModal":134,"./WhitePreloader":135,"react":undefined}],134:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "preloader-indicator-modal" },
            this.props.children
        );
    }
});

},{"react":undefined}],135:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "span",
            { className: "preloader preloader-white" },
            " "
        );
    }
});

},{"react":undefined}],136:[function(require,module,exports){
'use strict';

var React = require('react');
var Modal = require('../Modal/Modal');
var ModalInner = require('../Modal/ModalInner');
var ModalText = require('../Modal/ModalText');
var ModalButtons = require('../Modal/ModalButtons');
var ModalButton = require('../Modal/ModalButton');
var ModalTitle = require('../Modal/ModalTitle');

module.exports = React.createClass({
    displayName: 'exports',

    getDefaultProps: function getDefaultProps() {
        return {
            title: "温馨提示",
            cancelLabel: "取消",
            okLabel: "确定",
            cancelColor: 'red',
            okColor: 'green'
        };
    },
    render: function render() {
        return React.createElement(
            Modal,
            null,
            React.createElement(
                ModalInner,
                null,
                React.createElement(
                    ModalTitle,
                    null,
                    this.props.title
                ),
                React.createElement(
                    ModalText,
                    null,
                    this.props.text
                )
            ),
            React.createElement(
                ModalButtons,
                null,
                React.createElement(
                    ModalButton,
                    { style: { color: this.props.cancelColor }, onTap: this.props.cancelFunc },
                    this.props.cancelLabel
                ),
                React.createElement(
                    ModalButton,
                    { style: { color: this.props.okColor }, onTap: this.props.okFunc },
                    this.props.okLabel
                )
            )
        );
    }
});

},{"../Modal/Modal":119,"../Modal/ModalButton":120,"../Modal/ModalButtons":121,"../Modal/ModalInner":122,"../Modal/ModalText":124,"../Modal/ModalTitle":127,"react":undefined}],137:[function(require,module,exports){
'use strict';

module.exports = {
	ActionsModal: require('./ActionsModal/ActionsModal'),
	ActionsModalButton: require('./ActionsModal/ActionsModalButton'),
	ActionsModalGroup: require('./ActionsModal/ActionsModalGroup'),
	ActionsModalLabel: require('./ActionsModal/ActionsModalLabel'),
	Modal: require('./Modal/Modal'),
	ModalButton: require('./Modal/ModalButton'),
	ModalButtons: require('./Modal/ModalButtons'),
	ModalInner: require('./Modal/ModalInner'),
	ModalNoButttons: require('./Modal/ModalNoButttons'),
	ModalText: require('./Modal/ModalText'),
	ModalTextInput: require('./Modal/ModalTextInput'),
	ModalTextInputDouble: require('./Modal/ModalTextInputDouble'),
	ModalTitle: require('./Modal/ModalTitle'),
	ModalPanel: require('./ModalPanel'),
	ModalOverlay: require('./Overlay/ModalOverlay'),
	PreloaderIndicatorOverlay: require('./Overlay/PreloaderIndicatorOverlay'),
	PopoverModal: require('./Popover/PopoverModal'),
	BlackPreloader: require('./Preloader/BlackPreloader'),
	IndicatorModal: require('./Preloader/IndicatorModal'),
	PreloaderIndicatorModal: require('./Preloader/PreloaderIndicatorModal'),
	WhitePreloader: require('./Preloader/WhitePreloader'),
	Confirm: require('./Samples/Confirm')
};

},{"./ActionsModal/ActionsModal":115,"./ActionsModal/ActionsModalButton":116,"./ActionsModal/ActionsModalGroup":117,"./ActionsModal/ActionsModalLabel":118,"./Modal/Modal":119,"./Modal/ModalButton":120,"./Modal/ModalButtons":121,"./Modal/ModalInner":122,"./Modal/ModalNoButttons":123,"./Modal/ModalText":124,"./Modal/ModalTextInput":125,"./Modal/ModalTextInputDouble":126,"./Modal/ModalTitle":127,"./ModalPanel":128,"./Overlay/ModalOverlay":129,"./Overlay/PreloaderIndicatorOverlay":130,"./Popover/PopoverModal":131,"./Preloader/BlackPreloader":132,"./Preloader/IndicatorModal":133,"./Preloader/PreloaderIndicatorModal":134,"./Preloader/WhitePreloader":135,"./Samples/Confirm":136}],138:[function(require,module,exports){
'use strict';

var _tempNotificationElement;
module.exports = {
	/*
  *params = {media, title, subtitle, closeIcon, hold, closeOnClick}
  */
	addNotification: function addNotification(params) {
		if (!params) return;
		var self = this;
		if (typeof params.closeIcon === 'undefined') params.closeIcon = true;
		if (!_tempNotificationElement) _tempNotificationElement = document.createElement('div');

		var container = $('.notifications');
		if (container.length === 0) {
			$('body').append('<div class="notifications list-block media-list"><ul></ul></div>');
			container = $('.notifications');
		}
		var list = container.children('ul');

		var itemHTML;
		if (params.custom) {
			itemHTML = '<li>' + params.custom + '</li>';
		} else {
			itemHTML = '<li class="notification-item notification-hidden"><div class="item-content">' + (params.media ? '<div class="item-media">' + params.media + '</div>' : '') + '<div class="item-inner">' + '<div class="item-title-row">' + (params.title ? '<div class="item-title">' + params.title + '</div>' : '') + (params.closeIcon ? '<div class="item-after"><a href="#" class="close-notification"><span></span></a></div>' : '') + '</div>' + (params.subtitle ? '<div class="item-subtitle">' + params.subtitle + '</div>' : '') + (params.message ? '<div class="item-text">' + params.message + '</div>' : '') + '</div>' + '</div></li>';
		}
		_tempNotificationElement.innerHTML = itemHTML;

		var item = $(_tempNotificationElement).children();

		item.on('click', function (e) {
			var close = false;
			if ($(e.target).is('.close-notification') || $(e.target).parents('.close-notification').length > 0) {
				close = true;
			} else {
				if (params.onClick) params.onClick(e, item[0]);
				if (params.closeOnClick) close = true;
			}
			if (close) self.closeNotification(item[0]);
		});
		if (params.onClose) {
			item.data('f7NotificationOnClose', function () {
				params.onClose(item[0]);
			});
		}
		if (params.additionalClass) {
			item.addClass(params.additionalClass);
		}
		if (params.hold) {
			setTimeout(function () {
				if (item.length > 0) self.closeNotification(item[0]);
			}, params.hold);
		}

		list.prepend(item[0]);
		container.show();

		var itemHeight = item.outerHeight();
		item.css('marginTop', -itemHeight + 'px');
		item.transition(0);

		var clientLeft = item[0].clientLeft;
		item.transition('');
		item.css('marginTop', '0px');

		container.transform('translate3d(0, 0,0)');
		item.removeClass('notification-hidden');

		return item[0];
	},
	closeNotification: function closeNotification(item) {
		item = $(item);
		if (item.length === 0) return;
		if (item.hasClass('notification-item-removing')) return;
		var container = $('.notifications');

		var itemHeight = item.outerHeight();
		item.css('height', itemHeight + 'px').transition(0);
		var clientLeft = item[0].clientLeft;

		item.css('height', '0px').transition('').addClass('notification-item-removing');
		if (item.data('f7NotificationOnClose')) item.data('f7NotificationOnClose')();

		if (container.find('.notification-item:not(.notification-item-removing)').length === 0) {
			container.transform('');
		}

		item.addClass('notification-hidden').transitionEnd(function () {
			item.remove();
			if (container.find('.notification-item').length === 0) {
				container.hide();
			}
		});
	}
};

},{}],139:[function(require,module,exports){
'use strict';

module.exports = {
	Notifications: require('./Notifications')
};

},{"./Notifications":138}],140:[function(require,module,exports){
'use strict';

var React = require('react');
var Minxins = require('../mixins');
var NavbarMixins = Minxins.Navbar;
var SwiperMixins = Minxins.Swiper;

var PhotoBrowser = function PhotoBrowser(params) {
    var pb = this,
        i;

    var defaults = {
        photos: [],
        initialSlide: 0,
        spaceBetween: 20,
        speed: 300,
        zoom: true,
        maxZoom: 3,
        minZoom: 1,
        exposition: true,
        expositionHideCaptions: false,
        navbar: true,
        toolbar: true,
        theme: 'light',
        swipeToClose: true,
        backLinkText: 'Close',
        ofText: 'of',
        loop: false,
        lazyLoading: false,
        lazyLoadingInPrevNext: false,
        lazyLoadingOnTransitionStart: false
    };

    /*
    Callbacks:
    onLazyImageLoad(pb, slide, img)
    onLazyImageReady(pb, slide, img)
    onOpen(pb)
    onClose(pb)
    onSlideTransitionStart(swiper)
    onSlideTransitionEnd(swiper)
    onSlideChangeStart(swiper)
    onSlideChangeEnd(swiper)
    onTap(swiper, e)
    onClick(swiper, e)
    onDoubleTap(swiper, e)
    onSwipeToClose(pb)
    */
    params = params || {};
    for (var def in defaults) {
        if (typeof params[def] === 'undefined') {
            params[def] = defaults[def];
        }
    }

    pb.params = params;

    var iconColor = pb.params.theme === 'dark' ? 'color-white' : '';

    var navbarTemplate = pb.params.navbarTemplate || '<div class="navbar">' + '<div class="navbar-inner">' + '<div class="left sliding"><a href="#" class="link ' + ' close-popup photo-browser-close-link" data-popup=".photo-browser-popup"><i class="icon icon-back ' + iconColor + '"></i><span>' + pb.params.backLinkText + '</span></a></div>' + '<div class="center sliding"><span class="photo-browser-current"></span> <span class="photo-browser-of">' + pb.params.ofText + '</span> <span class="photo-browser-total"></span></div>' + '<div class="right"></div>' + '</div>' + '</div>';
    var toolbarTemplate = pb.params.toolbarTemplate || '<div class="toolbar tabbar">' + '<div class="toolbar-inner">' + '<a href="#" class="link photo-browser-prev"><i class="icon icon-prev ' + iconColor + '"></i></a>' + '<a href="#" class="link photo-browser-next"><i class="icon icon-next ' + iconColor + '"></i></a>' + '</div>' + '</div>';

    var template = pb.params.template || '<div class="photo-browser photo-browser-' + pb.params.theme + '">' + '<div class="view navbar-fixed toolbar-fixed">' + '{{navbar}}' + '<div data-page="photo-browser-slides" class="page no-toolbar {{noNavbar}} toolbar-fixed navbar-fixed">' + '{{toolbar}}' + '{{captions}}' + '<div class="photo-browser-swiper-container swiper-container">' + '<div class="photo-browser-swiper-wrapper swiper-wrapper">' + '{{photos}}' + '</div>' + '</div>' + '</div>' + '</div>' + '</div>';

    var photoTemplate = !pb.params.lazyLoading ? pb.params.photoTemplate || '<div class="photo-browser-slide swiper-slide"><span class="photo-browser-zoom-container"><img src="{{url}}"></span></div>' : pb.params.photoLazyTemplate || '<div class="photo-browser-slide photo-browser-slide-lazy swiper-slide"><div class="preloader' + (pb.params.theme === 'dark' ? ' preloader-white' : '') + '"></div><span class="photo-browser-zoom-container"><img data-src="{{url}}" class="swiper-lazy"></span></div>';

    var captionsTheme = pb.params.captionsTheme || pb.params.theme;
    var captionsTemplate = pb.params.captionsTemplate || '<div class="photo-browser-captions photo-browser-captions-' + captionsTheme + '">{{captions}}</div>';
    var captionTemplate = pb.params.captionTemplate || '<div class="photo-browser-caption" data-caption-index="{{captionIndex}}">{{caption}}</div>';

    var objectTemplate = pb.params.objectTemplate || '<div class="photo-browser-slide photo-browser-object-slide swiper-slide">{{html}}</div>';
    var photosHtml = '';
    var captionsHtml = '';
    for (i = 0; i < pb.params.photos.length; i++) {
        var photo = pb.params.photos[i];
        var thisTemplate = '';

        //check if photo is a string or string-like object, for backwards compatibility
        if (typeof photo === 'string' || photo instanceof String) {

            //check if "photo" is html object
            if (photo.indexOf('<') >= 0 || photo.indexOf('>') >= 0) {
                thisTemplate = objectTemplate.replace(/{{html}}/g, photo);
            } else {
                thisTemplate = photoTemplate.replace(/{{url}}/g, photo);
            }

            //photo is a string, thus has no caption, so remove the caption template placeholder
            //otherwise check if photo is an object with a url property
        } else if (typeof photo === 'object') {

                //check if "photo" is html object
                if (photo.hasOwnProperty('html') && photo.html.length > 0) {
                    thisTemplate = objectTemplate.replace(/{{html}}/g, photo.html);
                } else if (photo.hasOwnProperty('url') && photo.url.length > 0) {
                    thisTemplate = photoTemplate.replace(/{{url}}/g, photo.url);
                }

                //check if photo has a caption
                if (photo.hasOwnProperty('caption') && photo.caption.length > 0) {
                    captionsHtml += captionTemplate.replace(/{{caption}}/g, photo.caption).replace(/{{captionIndex}}/g, i);
                } else {
                    thisTemplate = thisTemplate.replace(/{{caption}}/g, '');
                }
            }

        photosHtml += thisTemplate;
    }

    var htmlTemplate = template.replace('{{navbar}}', pb.params.navbar ? navbarTemplate : '').replace('{{noNavbar}}', pb.params.navbar ? '' : 'no-navbar').replace('{{photos}}', photosHtml).replace('{{captions}}', captionsTemplate.replace(/{{captions}}/g, captionsHtml)).replace('{{toolbar}}', pb.params.toolbar ? toolbarTemplate : '');

    pb.activeIndex = pb.params.initialSlide;
    pb.openIndex = pb.activeIndex;
    pb.opened = false;

    pb.open = function (index) {
        if (typeof index === 'undefined') index = pb.activeIndex;
        index = parseInt(index, 10);
        if (pb.opened && pb.swiper) {
            pb.swiper.slideTo(index);
            return;
        }
        pb.opened = true;
        pb.openIndex = index;
        // pb.initialLazyLoaded = false;
        $('body').append(htmlTemplate);
        pb.layout(pb.openIndex);
        if (pb.params.onOpen) {
            pb.params.onOpen(pb);
        }
    };
    pb.close = function () {
        pb.opened = false;
        if (!pb.swiperContainer || pb.swiperContainer.length === 0) {
            return;
        }
        if (pb.params.onClose) {
            pb.params.onClose(pb);
        }
        // Detach events
        pb.attachEvents(true);
        // Delete from DOM
        pb.container.removeClass('photo-browser-in').addClass('photo-browser-out').animationEnd(function () {
            pb.container.remove();
        });
        // Destroy slider
        pb.swiper.destroy();
        // Delete references
        pb.swiper = pb.swiperContainer = pb.swiperWrapper = pb.slides = gestureSlide = gestureImg = gestureImgWrap = undefined;
    };

    pb.onPopupClose = function (e) {
        pb.close();
        $(pb.popup).off('pageBeforeInit', pb.onPopupClose);
    };
    pb.onPageBeforeInit = function (e) {
        if (e.detail.page.name === 'photo-browser-slides') {
            pb.layout(pb.openIndex);
        }
        $(document).off('pageBeforeInit', pb.onPageBeforeInit);
    };
    pb.onPageBeforeRemove = function (e) {
        if (e.detail.page.name === 'photo-browser-slides') {
            pb.close();
        }
        $(document).off('pageBeforeRemove', pb.onPageBeforeRemove);
    };

    pb.onSliderTransitionStart = function (swiper) {
        pb.activeIndex = swiper.activeIndex;

        var current = swiper.activeIndex + 1;
        var total = swiper.slides.length;
        if (pb.params.loop) {
            total = total - 2;
            current = current - swiper.loopedSlides;
            if (current < 1) current = total + current;
            if (current > total) current = current - total;
        }
        pb.container.find('.photo-browser-current').text(current);
        pb.container.find('.photo-browser-total').text(total);

        $('.photo-browser-prev, .photo-browser-next').removeClass('photo-browser-link-inactive');

        if (swiper.isBeginning && !pb.params.loop) {
            $('.photo-browser-prev').addClass('photo-browser-link-inactive');
        }
        if (swiper.isEnd && !pb.params.loop) {
            $('.photo-browser-next').addClass('photo-browser-link-inactive');
        }

        // Update captions
        if (pb.captions.length > 0) {
            pb.captionsContainer.find('.photo-browser-caption-active').removeClass('photo-browser-caption-active');
            var captionIndex = pb.params.loop ? swiper.slides.eq(swiper.activeIndex).attr('data-swiper-slide-index') : pb.activeIndex;
            pb.captionsContainer.find('[data-caption-index="' + captionIndex + '"]').addClass('photo-browser-caption-active');
        }

        // Stop Video
        var previousSlideVideo = swiper.slides.eq(swiper.previousIndex).find('video');
        if (previousSlideVideo.length > 0) {
            if ('pause' in previousSlideVideo[0]) previousSlideVideo[0].pause();
        }
        // Callback
        if (pb.params.onTransitionStart) pb.params.onTransitionStart(swiper);
    };
    pb.onSliderTransitionEnd = function (swiper) {
        // Reset zoom
        if (pb.params.zoom && gestureSlide && swiper.previousIndex !== swiper.activeIndex) {
            gestureImg.transform('translate3d(0,0,0) scale(1)');
            gestureImgWrap.transform('translate3d(0,0,0)');
            gestureSlide = gestureImg = gestureImgWrap = undefined;
            scale = currentScale = 1;
        }
        if (pb.params.onTransitionEnd) pb.params.onTransitionEnd(swiper);
    };

    pb.layout = function (index) {
        pb.container = $('.photo-browser');
        pb.container.addClass('photo-browser-in');
        NavbarMixins.sizeNavbars(pb.container);
        pb.swiperContainer = pb.container.find('.photo-browser-swiper-container');
        pb.swiperWrapper = pb.container.find('.photo-browser-swiper-wrapper');
        pb.slides = pb.container.find('.photo-browser-slide');
        pb.captionsContainer = pb.container.find('.photo-browser-captions');
        pb.captions = pb.container.find('.photo-browser-caption');

        var sliderSettings = {
            nextButton: pb.params.nextButton || '.photo-browser-next',
            prevButton: pb.params.prevButton || '.photo-browser-prev',
            indexButton: pb.params.indexButton,
            initialSlide: index,
            spaceBetween: pb.params.spaceBetween,
            speed: pb.params.speed,
            loop: pb.params.loop,
            lazyLoading: pb.params.lazyLoading,
            lazyLoadingInPrevNext: pb.params.lazyLoadingInPrevNext,
            lazyLoadingOnTransitionStart: pb.params.lazyLoadingOnTransitionStart,
            preloadImages: pb.params.lazyLoading ? false : true,
            onTap: function onTap(swiper, e) {
                if (pb.params.onTap) pb.params.onTap(swiper, e);
            },
            onClick: function onClick(swiper, e) {
                if (pb.params.exposition) pb.toggleExposition();
                if (pb.params.onClick) pb.params.onClick(swiper, e);
            },
            onDoubleTap: function onDoubleTap(swiper, e) {
                pb.toggleZoom($(e.target).parents('.photo-browser-slide'));
                if (pb.params.onDoubleTap) pb.params.onDoubleTap(swiper, e);
            },
            onTransitionStart: function onTransitionStart(swiper) {
                pb.onSliderTransitionStart(swiper);
            },
            onTransitionEnd: function onTransitionEnd(swiper) {
                pb.onSliderTransitionEnd(swiper);
            },
            onSlideChangeStart: pb.params.onSlideChangeStart,
            onSlideChangeEnd: pb.params.onSlideChangeEnd,
            onLazyImageLoad: function onLazyImageLoad(swiper, slide, img) {
                if (pb.params.onLazyImageLoad) pb.params.onLazyImageLoad(pb, slide, img);
            },
            onLazyImageReady: function onLazyImageReady(swiper, slide, img) {
                $(slide).removeClass('photo-browser-slide-lazy');
                if (pb.params.onLazyImageReady) pb.params.onLazyImageReady(pb, slide, img);
            }
        };

        if (pb.params.swipeToClose) {
            sliderSettings.onTouchStart = pb.swipeCloseTouchStart;
            sliderSettings.onTouchMoveOpposite = pb.swipeCloseTouchMove;
            sliderSettings.onTouchEnd = pb.swipeCloseTouchEnd;
        }

        pb.swiper = SwiperMixins.swiper(pb.swiperContainer, sliderSettings);
        if (index === 0) {
            pb.onSliderTransitionStart(pb.swiper);
        }
        pb.attachEvents();
    };
    pb.attachEvents = function (detach) {
        var action = detach ? 'off' : 'on';
        // Slide between photos

        if (pb.params.zoom) {
            var target = pb.params.loop ? pb.swiper.slides : pb.slides;
            // Scale image
            target[action]('gesturestart', pb.onSlideGestureStart);
            target[action]('gesturechange', pb.onSlideGestureChange);
            target[action]('gestureend', pb.onSlideGestureEnd);

            // Move image
            target[action](app.touchEvents.start, pb.onSlideTouchStart);
            target[action](app.touchEvents.move, pb.onSlideTouchMove);
            target[action](app.touchEvents.end, pb.onSlideTouchEnd);
        }
        pb.container.find('.photo-browser-close-link')[action]('click', pb.close);
    };

    var isTouched,
        isMoved,
        touchesStart = {},
        touchesCurrent = {},
        touchStartTime,
        isScrolling,
        animating = false,
        currentTranslate;
    var allowClick = true;

    // Expose
    pb.exposed = false;
    pb.toggleExposition = function () {
        if (pb.container) pb.container.toggleClass('photo-browser-exposed');
        if (pb.params.expositionHideCaptions) pb.captionsContainer.toggleClass('photo-browser-captions-exposed');
        pb.exposed = !pb.exposed;
    };
    pb.enableExposition = function () {
        if (pb.container) pb.container.addClass('photo-browser-exposed');
        if (pb.params.expositionHideCaptions) pb.captionsContainer.addClass('photo-browser-captions-exposed');
        pb.exposed = true;
    };
    pb.disableExposition = function () {
        if (pb.container) pb.container.removeClass('photo-browser-exposed');
        if (pb.params.expositionHideCaptions) pb.captionsContainer.removeClass('photo-browser-captions-exposed');
        pb.exposed = false;
    };

    // Gestures
    var gestureSlide,
        gestureImg,
        gestureImgWrap,
        scale = 1,
        currentScale = 1,
        isScaling = false;
    pb.onSlideGestureStart = function (e) {
        if (!gestureSlide || !gestureSlide.length) {
            gestureSlide = $(this);
            if (gestureSlide.length === 0) gestureSlide = pb.swiper.slides.eq(pb.swiper.activeIndex);
            gestureImg = gestureSlide.find('img, svg, canvas');
            gestureImgWrap = gestureImg.parent('.photo-browser-zoom-container');
            if (gestureImgWrap.length === 0) {
                gestureImg = undefined;
                return;
            }
        }
        gestureImg.transition(0);
        isScaling = true;
    };
    pb.onSlideGestureChange = function (e) {
        if (!gestureImg || gestureImg.length === 0) return;
        scale = e.scale * currentScale;
        if (scale > pb.params.maxZoom) {
            scale = pb.params.maxZoom - 1 + Math.pow(scale - pb.params.maxZoom + 1, 0.5);
        }
        if (scale < pb.params.minZoom) {
            scale = pb.params.minZoom + 1 - Math.pow(pb.params.minZoom - scale + 1, 0.5);
        }
        gestureImg.transform('translate3d(0,0,0) scale(' + scale + ')');
    };
    pb.onSlideGestureEnd = function (e) {
        if (!gestureImg || gestureImg.length === 0) return;
        scale = Math.max(Math.min(scale, pb.params.maxZoom), pb.params.minZoom);
        gestureImg.transition(pb.params.speed).transform('translate3d(0,0,0) scale(' + scale + ')');
        currentScale = scale;
        isScaling = false;
        if (scale === 1) gestureSlide = undefined;
    };
    pb.toggleZoom = function () {
        if (!gestureSlide) {
            gestureSlide = pb.swiper.slides.eq(pb.swiper.activeIndex);
            gestureImg = gestureSlide.find('img, svg, canvas');
            gestureImgWrap = gestureImg.parent('.photo-browser-zoom-container');
        }
        if (!gestureImg || gestureImg.length === 0) return;
        gestureImgWrap.transition(300).transform('translate3d(0,0,0)');
        if (scale && scale !== 1) {
            scale = currentScale = 1;
            gestureImg.transition(300).transform('translate3d(0,0,0) scale(1)');
            gestureSlide = undefined;
        } else {
            scale = currentScale = pb.params.maxZoom;
            gestureImg.transition(300).transform('translate3d(0,0,0) scale(' + scale + ')');
        }
    };

    var imageIsTouched,
        imageIsMoved,
        imageCurrentX,
        imageCurrentY,
        imageMinX,
        imageMinY,
        imageMaxX,
        imageMaxY,
        imageWidth,
        imageHeight,
        imageTouchesStart = {},
        imageTouchesCurrent = {},
        imageStartX,
        imageStartY,
        velocityPrevPositionX,
        velocityPrevTime,
        velocityX,
        velocityPrevPositionY,
        velocityY;

    pb.onSlideTouchStart = function (e) {
        if (!gestureImg || gestureImg.length === 0) return;
        if (imageIsTouched) return;
        if (app.device.os === 'android') e.preventDefault();
        imageIsTouched = true;
        imageTouchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
        imageTouchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
    };
    pb.onSlideTouchMove = function (e) {
        if (!gestureImg || gestureImg.length === 0) return;
        pb.swiper.allowClick = false;
        if (!imageIsTouched || !gestureSlide) return;

        if (!imageIsMoved) {
            imageWidth = gestureImg[0].offsetWidth;
            imageHeight = gestureImg[0].offsetHeight;
            imageStartX = $.getTranslate(gestureImgWrap[0], 'x') || 0;
            imageStartY = $.getTranslate(gestureImgWrap[0], 'y') || 0;
            gestureImgWrap.transition(0);
        }
        // Define if we need image drag
        var scaledWidth = imageWidth * scale;
        var scaledHeight = imageHeight * scale;

        if (scaledWidth < pb.swiper.width && scaledHeight < pb.swiper.height) return;

        imageMinX = Math.min(pb.swiper.width / 2 - scaledWidth / 2, 0);
        imageMaxX = -imageMinX;
        imageMinY = Math.min(pb.swiper.height / 2 - scaledHeight / 2, 0);
        imageMaxY = -imageMinY;

        imageTouchesCurrent.x = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
        imageTouchesCurrent.y = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;

        if (!imageIsMoved && !isScaling) {
            if (Math.floor(imageMinX) === Math.floor(imageStartX) && imageTouchesCurrent.x < imageTouchesStart.x || Math.floor(imageMaxX) === Math.floor(imageStartX) && imageTouchesCurrent.x > imageTouchesStart.x) {
                imageIsTouched = false;
                return;
            }
        }
        e.preventDefault();
        e.stopPropagation();
        imageIsMoved = true;
        imageCurrentX = imageTouchesCurrent.x - imageTouchesStart.x + imageStartX;
        imageCurrentY = imageTouchesCurrent.y - imageTouchesStart.y + imageStartY;

        if (imageCurrentX < imageMinX) {
            imageCurrentX = imageMinX + 1 - Math.pow(imageMinX - imageCurrentX + 1, 0.8);
        }
        if (imageCurrentX > imageMaxX) {
            imageCurrentX = imageMaxX - 1 + Math.pow(imageCurrentX - imageMaxX + 1, 0.8);
        }

        if (imageCurrentY < imageMinY) {
            imageCurrentY = imageMinY + 1 - Math.pow(imageMinY - imageCurrentY + 1, 0.8);
        }
        if (imageCurrentY > imageMaxY) {
            imageCurrentY = imageMaxY - 1 + Math.pow(imageCurrentY - imageMaxY + 1, 0.8);
        }

        //Velocity
        if (!velocityPrevPositionX) velocityPrevPositionX = imageTouchesCurrent.x;
        if (!velocityPrevPositionY) velocityPrevPositionY = imageTouchesCurrent.y;
        if (!velocityPrevTime) velocityPrevTime = Date.now();
        velocityX = (imageTouchesCurrent.x - velocityPrevPositionX) / (Date.now() - velocityPrevTime) / 2;
        velocityY = (imageTouchesCurrent.y - velocityPrevPositionY) / (Date.now() - velocityPrevTime) / 2;
        if (Math.abs(imageTouchesCurrent.x - velocityPrevPositionX) < 2) velocityX = 0;
        if (Math.abs(imageTouchesCurrent.y - velocityPrevPositionY) < 2) velocityY = 0;
        velocityPrevPositionX = imageTouchesCurrent.x;
        velocityPrevPositionY = imageTouchesCurrent.y;
        velocityPrevTime = Date.now();

        gestureImgWrap.transform('translate3d(' + imageCurrentX + 'px, ' + imageCurrentY + 'px,0)');
    };
    pb.onSlideTouchEnd = function (e) {
        if (!gestureImg || gestureImg.length === 0) return;
        if (!imageIsTouched || !imageIsMoved) {
            imageIsTouched = false;
            imageIsMoved = false;
            return;
        }
        imageIsTouched = false;
        imageIsMoved = false;
        var momentumDurationX = 300;
        var momentumDurationY = 300;
        var momentumDistanceX = velocityX * momentumDurationX;
        var newPositionX = imageCurrentX + momentumDistanceX;
        var momentumDistanceY = velocityY * momentumDurationY;
        var newPositionY = imageCurrentY + momentumDistanceY;

        //Fix duration
        if (velocityX !== 0) momentumDurationX = Math.abs((newPositionX - imageCurrentX) / velocityX);
        if (velocityY !== 0) momentumDurationY = Math.abs((newPositionY - imageCurrentY) / velocityY);
        var momentumDuration = Math.max(momentumDurationX, momentumDurationY);

        imageCurrentX = newPositionX;
        imageCurrentY = newPositionY;

        // Define if we need image drag
        var scaledWidth = imageWidth * scale;
        var scaledHeight = imageHeight * scale;
        imageMinX = Math.min(pb.swiper.width / 2 - scaledWidth / 2, 0);
        imageMaxX = -imageMinX;
        imageMinY = Math.min(pb.swiper.height / 2 - scaledHeight / 2, 0);
        imageMaxY = -imageMinY;
        imageCurrentX = Math.max(Math.min(imageCurrentX, imageMaxX), imageMinX);
        imageCurrentY = Math.max(Math.min(imageCurrentY, imageMaxY), imageMinY);

        gestureImgWrap.transition(momentumDuration).transform('translate3d(' + imageCurrentX + 'px, ' + imageCurrentY + 'px,0)');
    };

    // Swipe Up To Close
    var swipeToCloseIsTouched = false;
    var allowSwipeToClose = true;
    var swipeToCloseDiff,
        swipeToCloseStart,
        swipeToCloseCurrent,
        swipeToCloseStarted = false,
        swipeToCloseActiveSlide,
        swipeToCloseTimeStart;
    pb.swipeCloseTouchStart = function (swiper, e) {
        if (!allowSwipeToClose) return;
        swipeToCloseIsTouched = true;
    };
    pb.swipeCloseTouchMove = function (swiper, e) {
        if (!swipeToCloseIsTouched) return;
        if (!swipeToCloseStarted) {
            swipeToCloseStarted = true;
            swipeToCloseStart = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
            swipeToCloseActiveSlide = pb.swiper.slides.eq(pb.swiper.activeIndex);
            swipeToCloseTimeStart = new Date().getTime();
        }
        e.preventDefault();
        swipeToCloseCurrent = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
        swipeToCloseDiff = swipeToCloseStart - swipeToCloseCurrent;
        var opacity = 1 - Math.abs(swipeToCloseDiff) / 300;
        swipeToCloseActiveSlide.transform('translate3d(0,' + -swipeToCloseDiff + 'px,0)');
        pb.swiper.container.css('opacity', opacity).transition(0);
    };
    pb.swipeCloseTouchEnd = function (swiper, e) {
        swipeToCloseIsTouched = false;
        if (!swipeToCloseStarted) {
            swipeToCloseStarted = false;
            return;
        }
        swipeToCloseStarted = false;
        allowSwipeToClose = false;
        var diff = Math.abs(swipeToCloseDiff);
        var timeDiff = new Date().getTime() - swipeToCloseTimeStart;
        if (timeDiff < 300 && diff > 20 || timeDiff >= 300 && diff > 100) {
            setTimeout(function () {
                pb.close();
                if (pb.params.onSwipeToClose) {
                    pb.params.onSwipeToClose(pb);
                }
                allowSwipeToClose = true;
            }, 0);
            return;
        }
        if (diff !== 0) {
            swipeToCloseActiveSlide.addClass('transitioning').transitionEnd(function () {
                allowSwipeToClose = true;
                swipeToCloseActiveSlide.removeClass('transitioning');
            });
        } else {
            allowSwipeToClose = true;
        }
        pb.swiper.container.css('opacity', '').transition('');
        swipeToCloseActiveSlide.transform('');
    };

    return pb;
};

module.exports = function (params) {
    return new PhotoBrowser(params);
};

},{"../mixins":114,"react":undefined}],141:[function(require,module,exports){
'use strict';

module.exports = {
	Photo: require('./Photo')
};

},{"./Photo":140}],142:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');
var PickerItems = require('./PickerItems');

/*======================================================
************   Picker   ************
======================================================*/
var Picker = function Picker(params) {
    var p = this;
    var defaults = {
        updateValuesOnMomentum: false,
        updateValuesOnTouchmove: true,
        momentumRatio: 7,
        freeMode: false
    };
    params = params || {};
    for (var def in defaults) {
        if (typeof params[def] === 'undefined') {
            params[def] = defaults[def];
        }
    }
    p.params = params;
    p.cols = [];

    // 3D Transforms origin bug, only on safari
    var originBug = false;

    // Value
    p.setValue = function (arrValues, transition) {
        var valueIndex = 0;
        for (var i = 0; i < p.cols.length; i++) {
            if (p.cols[i] && !p.cols[i].divider) {
                p.cols[i].setValue(arrValues[valueIndex], transition);
                valueIndex++;
            }
        }
    };
    p.updateValue = function () {
        var newValue = [];
        var newDisplayValue = [];
        for (var i = 0; i < p.cols.length; i++) {
            if (!p.cols[i].divider) {
                newValue.push(p.cols[i].value);
                newDisplayValue.push(p.cols[i].displayValue);
            }
        }
        if (newValue.indexOf(undefined) >= 0) {
            return;
        }
        p.value = newValue;
        p.displayValue = newDisplayValue;
        if (p.params.onChange) {
            p.params.onChange(p.value);
        }
    };

    // Columns Handlers
    p.initPickerCol = function (colElement, updateItems) {
        var colContainer = $(colElement);
        var colIndex = colContainer.index();
        var col = p.cols[colIndex];
        if (col.divider) return;
        col.container = colContainer;
        col.wrapper = col.container.find('.picker-items-col-wrapper');
        col.items = col.wrapper.find('.picker-item');

        var i, j;
        var wrapperHeight, itemHeight, itemsHeight, minTranslate, maxTranslate;
        col.replaceValues = function (values, displayValues) {
            col.destroyEvents();
            col.values = values;
            col.displayValues = displayValues;
            var newItemsHTML = p.columnHTML(col, true);
            col.wrapper.html(newItemsHTML);
            col.items = col.wrapper.find('.picker-item');
            col.calcSize();
            col.setValue(col.values[0], 0, true);
            col.initEvents();
        };
        col.calcSize = function () {
            if (p.params.rotateEffect) {
                col.container.removeClass('picker-items-col-absolute');
                if (!col.width) col.container.css({ width: '' });
            }
            var colWidth, colHeight;
            colWidth = 0;
            colHeight = col.container[0].offsetHeight;
            wrapperHeight = col.wrapper[0].offsetHeight;
            itemHeight = col.items[0].offsetHeight;
            itemsHeight = itemHeight * col.items.length;
            minTranslate = colHeight / 2 - itemsHeight + itemHeight / 2;
            maxTranslate = colHeight / 2 - itemHeight / 2;
            if (col.width) {
                colWidth = col.width;
                if (parseInt(colWidth, 10) === colWidth) colWidth = colWidth + 'px';
                col.container.css({ width: colWidth });
            }
            if (p.params.rotateEffect) {
                if (!col.width) {
                    col.items.each(function () {
                        var item = $(this);
                        item.css({ width: 'auto' });
                        colWidth = Math.max(colWidth, item[0].offsetWidth);
                        item.css({ width: '' });
                    });
                    col.container.css({ width: colWidth + 2 + 'px' });
                }
                col.container.addClass('picker-items-col-absolute');
            }
        };
        col.calcSize();

        col.wrapper.transform('translate3d(0,' + maxTranslate + 'px,0)').transition(0);

        var activeIndex = 0;
        var animationFrameId;

        // Set Value Function
        col.setValue = function (newValue, transition, valueCallbacks) {
            if (typeof transition === 'undefined') transition = '';
            var newActiveIndex = col.wrapper.find('.picker-item[data-picker-value="' + newValue + '"]').index();
            if (typeof newActiveIndex === 'undefined' || newActiveIndex === -1) {
                return;
            }
            var newTranslate = -newActiveIndex * itemHeight + maxTranslate;
            // Update wrapper
            col.wrapper.transition(transition);
            col.wrapper.transform('translate3d(0,' + newTranslate + 'px,0)');

            // Watch items
            if (p.params.updateValuesOnMomentum && col.activeIndex && col.activeIndex !== newActiveIndex) {
                $.cancelAnimationFrame(animationFrameId);
                col.wrapper.transitionEnd(function () {
                    $.cancelAnimationFrame(animationFrameId);
                });
                updateDuringScroll();
            }

            // Update items
            col.updateItems(newActiveIndex, newTranslate, transition, valueCallbacks);
        };

        col.updateItems = function (activeIndex, translate, transition, valueCallbacks) {
            if (typeof translate === 'undefined') {
                translate = $.getTranslate(col.wrapper[0], 'y');
            }
            if (typeof activeIndex === 'undefined') activeIndex = -Math.round((translate - maxTranslate) / itemHeight);
            if (activeIndex < 0) activeIndex = 0;
            if (activeIndex >= col.items.length) activeIndex = col.items.length - 1;
            var previousActiveIndex = col.activeIndex;
            col.activeIndex = activeIndex;
            col.wrapper.find('.picker-selected, .picker-after-selected, .picker-before-selected').removeClass('picker-selected picker-after-selected picker-before-selected');

            col.items.transition(transition);
            var selectedItem = col.items.eq(activeIndex).addClass('picker-selected').transform('');
            var prevItems = selectedItem.prevAll().addClass('picker-before-selected');
            var nextItems = selectedItem.nextAll().addClass('picker-after-selected');

            if (valueCallbacks || typeof valueCallbacks === 'undefined') {
                // Update values
                col.value = selectedItem.attr('data-picker-value');
                col.displayValue = col.displayValues ? col.displayValues[activeIndex] : col.value;
                // On change callback
                if (previousActiveIndex !== activeIndex) {
                    if (col.onChange) {
                        col.onChange(p, col.value);
                    }
                    p.updateValue();
                }
            }

            // Set 3D rotate effect
            if (!p.params.rotateEffect) {
                return;
            }
            var percentage = (translate - (Math.floor((translate - maxTranslate) / itemHeight) * itemHeight + maxTranslate)) / itemHeight;

            col.items.each(function () {
                var item = $(this);
                var itemOffsetTop = item.index() * itemHeight;
                var translateOffset = maxTranslate - translate;
                var itemOffset = itemOffsetTop - translateOffset;
                var percentage = itemOffset / itemHeight;

                var itemsFit = Math.ceil(col.height / itemHeight / 2) + 1;

                var angle = -18 * percentage;
                if (angle > 180) angle = 180;
                if (angle < -180) angle = -180;
                // Far class
                if (Math.abs(percentage) > itemsFit) item.addClass('picker-item-far');else item.removeClass('picker-item-far');
                // Set transform
                item.transform('translate3d(0, ' + (-translate + maxTranslate) + 'px, ' + (originBug ? -110 : 0) + 'px) rotateX(' + angle + 'deg)');
            });
        };

        function updateDuringScroll() {
            animationFrameId = $.requestAnimationFrame(function () {
                col.updateItems(undefined, undefined, 0);
                updateDuringScroll();
            });
        }

        // Update items on init
        if (updateItems) col.updateItems(0, maxTranslate, 0);

        var allowItemClick = true;
        var isTouched, isMoved, touchStartY, touchCurrentY, touchStartTime, touchEndTime, startTranslate, returnTo, currentTranslate, prevTranslate, velocityTranslate, velocityTime;
        function handleTouchStart(e) {
            if (isMoved || isTouched) return;
            e.preventDefault();
            isTouched = true;
            touchStartY = touchCurrentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
            touchStartTime = new Date().getTime();

            allowItemClick = true;
            startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], 'y');
        }
        function handleTouchMove(e) {
            if (!isTouched) return;
            e.preventDefault();
            allowItemClick = false;
            touchCurrentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
            if (!isMoved) {
                // First move
                $.cancelAnimationFrame(animationFrameId);
                isMoved = true;
                startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], 'y');
                col.wrapper.transition(0);
            }
            e.preventDefault();

            var diff = touchCurrentY - touchStartY;
            currentTranslate = startTranslate + diff;
            returnTo = undefined;

            // Normalize translate
            if (currentTranslate < minTranslate) {
                currentTranslate = minTranslate - Math.pow(minTranslate - currentTranslate, 0.8);
                returnTo = 'min';
            }
            if (currentTranslate > maxTranslate) {
                currentTranslate = maxTranslate + Math.pow(currentTranslate - maxTranslate, 0.8);
                returnTo = 'max';
            }
            // Transform wrapper
            col.wrapper.transform('translate3d(0,' + currentTranslate + 'px,0)');

            // Update items
            col.updateItems(undefined, currentTranslate, 0, p.params.updateValuesOnTouchmove);

            // Calc velocity
            velocityTranslate = currentTranslate - prevTranslate || currentTranslate;
            velocityTime = new Date().getTime();
            prevTranslate = currentTranslate;
        }
        function handleTouchEnd(e) {
            if (!isTouched || !isMoved) {
                isTouched = isMoved = false;
                return;
            }
            isTouched = isMoved = false;
            col.wrapper.transition('');
            if (returnTo) {
                if (returnTo === 'min') {
                    col.wrapper.transform('translate3d(0,' + minTranslate + 'px,0)');
                } else col.wrapper.transform('translate3d(0,' + maxTranslate + 'px,0)');
            }
            touchEndTime = new Date().getTime();
            var velocity, newTranslate;
            if (touchEndTime - touchStartTime > 300) {
                newTranslate = currentTranslate;
            } else {
                velocity = Math.abs(velocityTranslate / (touchEndTime - velocityTime));
                newTranslate = currentTranslate + velocityTranslate * p.params.momentumRatio;
            }

            newTranslate = Math.max(Math.min(newTranslate, maxTranslate), minTranslate);

            // Active Index
            var activeIndex = -Math.floor((newTranslate - maxTranslate) / itemHeight);

            // Normalize translate
            if (!p.params.freeMode) newTranslate = -activeIndex * itemHeight + maxTranslate;

            // Transform wrapper
            col.wrapper.transform('translate3d(0,' + parseInt(newTranslate, 10) + 'px,0)');

            // Update items
            col.updateItems(activeIndex, newTranslate, '', true);

            // Watch items
            if (p.params.updateValuesOnMomentum) {
                updateDuringScroll();
                col.wrapper.transitionEnd(function () {
                    $.cancelAnimationFrame(animationFrameId);
                });
            }

            // Allow click
            setTimeout(function () {
                allowItemClick = true;
            }, 100);
        }

        function handleClick(e) {
            if (!allowItemClick) return;
            $.cancelAnimationFrame(animationFrameId);
            /*jshint validthis:true */
            var value = $(this).attr('data-picker-value');
            col.setValue(value);
        }

        col.initEvents = function (detach) {
            var method = detach ? 'off' : 'on';
            col.container[method](app.touchEvents.start, handleTouchStart);
            col.container[method](app.touchEvents.move, handleTouchMove);
            col.container[method](app.touchEvents.end, handleTouchEnd);
            col.items[method]('click', handleClick);
        };
        col.destroyEvents = function () {
            col.initEvents(true);
        };

        col.container[0].f7DestroyPickerCol = function () {
            col.destroyEvents();
        };

        col.initEvents();
    };
    p.destroyPickerCol = function (colContainer) {
        colContainer = $(colContainer);
        if ('f7DestroyPickerCol' in colContainer[0]) colContainer[0].f7DestroyPickerCol();
    };
    p.columnHTML = function (col, onlyItems) {
        var columnItemsHTML = '';
        var columnHTML = '';
        if (col.divider) {
            columnHTML += '<div class="picker-items-col picker-items-col-divider ' + (col.textAlign ? 'picker-items-col-' + col.textAlign : '') + ' ' + (col.cssClass || '') + '">' + col.content + '</div>';
        } else {
            for (var j = 0; j < col.values.length; j++) {
                columnItemsHTML += '<div class="picker-item" data-picker-value="' + col.values[j] + '">' + (col.displayValues ? col.displayValues[j] : col.values[j]) + '</div>';
            }
            columnHTML += '<div class="picker-items-col ' + (col.textAlign ? 'picker-items-col-' + col.textAlign : '') + ' ' + (col.cssClass || '') + '"><div class="picker-items-col-wrapper">' + columnItemsHTML + '</div></div>';
        }
        return onlyItems ? columnItemsHTML : columnHTML;
    };

    p.opened = false;
    p.open = function (el, cols) {
        p.cols = cols;
        p.container = el;
        el.find('.picker-items-col').each(function () {
            p.initPickerCol(this, true);
        });
        if (p.params.defaultValue) {
            p.setValue(p.params.defaultValue, 0);
        }
        p.opened = true;
    };
    p.destroy = function () {
        p.container.find('.picker-items-col').each(function () {
            p.destroyPickerCol(this);
        });
    };
    return p;
};

module.exports = React.createClass({
    displayName: 'exports',

    getDefaultProps: function getDefaultProps() {
        return {
            rotateEffect: true,
            inline: false
        };
    },
    getInitialState: function getInitialState() {
        return {
            picker: new Picker({
                rotateEffect: this.props.rotateEffect,
                defaultValue: this.props.defaultValue,
                onChange: this.props.onChange
            })
        };
    },
    componentDidMount: function componentDidMount() {
        var $el = $(this.refs.container.getDOMNode());
        var self = this;
        self.state.picker.open($el, self.props.cols);
        if (!this.props.inline) {
            $el.css({ '-webkit-transform': 'translate3d(0,0,0)' });
        }
    },
    componentWillUnmount: function componentWillUnmount() {
        this.state.picker.destroy();
    },
    render: function render() {
        var className = cn({
            "picker-modal picker-columns": true,
            "picker-3d": this.props.rotateEffect,
            "picker-modal-inline": this.props.inline,
            "picker-modal-on": !this.props.inline
        });
        return React.createElement(
            'div',
            { className: className, ref: 'container', style: { backgroundColor: "white" } },
            this.props.toolbar,
            React.createElement(PickerItems, { cols: this.props.cols })
        );
    }
});

},{"./PickerItems":145,"classnames":52,"react":undefined}],143:[function(require,module,exports){
'use strict';

var React = require('react');

/*======================================================
************   Picker   ************
======================================================*/
var Picker = function Picker(params) {
    var p = this;
    var defaults = {
        updateValuesOnMomentum: false,
        updateValuesOnTouchmove: true,
        momentumRatio: 7,
        freeMode: false,
        rotateEffect: false,
        toolbar: true,
        toolbarCloseText: 'Done',
        // Common settings
        toolbarTemplate: '<div class="toolbar">' + '<div class="toolbar-inner">' + '<div class="left"></div>' + '<div class="right">' + '<a href="#" class="link close-picker" onclick="app.hideModal()">{{closeText}}</a>' + '</div>' + '</div>' + '</div>'
    };
    params = params || {};
    for (var def in defaults) {
        if (typeof params[def] === 'undefined') {
            params[def] = defaults[def];
        }
    }
    p.params = params;
    p.cols = [];

    // 3D Transforms origin bug, only on safari
    var originBug = false;

    // Value
    p.setValue = function (arrValues, transition) {
        var valueIndex = 0;
        for (var i = 0; i < p.cols.length; i++) {
            if (p.cols[i] && !p.cols[i].divider) {
                p.cols[i].setValue(arrValues[valueIndex], transition);
                valueIndex++;
            }
        }
    };
    p.updateValue = function () {
        var newValue = [];
        var newDisplayValue = [];
        for (var i = 0; i < p.cols.length; i++) {
            if (!p.cols[i].divider) {
                newValue.push(p.cols[i].value);
                newDisplayValue.push(p.cols[i].displayValue);
            }
        }
        if (newValue.indexOf(undefined) >= 0) {
            return;
        }
        p.value = newValue;
        p.displayValue = newDisplayValue;
        if (p.params.onChange) {
            p.params.onChange(p, p.value, p.displayValue);
        }
    };

    // Columns Handlers
    p.initPickerCol = function (colElement, updateItems) {
        var colContainer = $(colElement);
        var colIndex = colContainer.index();
        var col = p.cols[colIndex];
        if (col.divider) return;
        col.container = colContainer;
        col.wrapper = col.container.find('.picker-items-col-wrapper');
        col.items = col.wrapper.find('.picker-item');

        var i, j;
        var wrapperHeight, itemHeight, itemsHeight, minTranslate, maxTranslate;
        col.replaceValues = function (values, displayValues) {
            col.destroyEvents();
            col.values = values;
            col.displayValues = displayValues;
            var newItemsHTML = p.columnHTML(col, true);
            col.wrapper.html(newItemsHTML);
            col.items = col.wrapper.find('.picker-item');
            col.calcSize();
            col.setValue(col.values[0], 0, true);
            col.initEvents();
        };
        col.calcSize = function () {
            if (p.params.rotateEffect) {
                col.container.removeClass('picker-items-col-absolute');
                if (!col.width) col.container.css({ width: '' });
            }
            var colWidth, colHeight;
            colWidth = 0;
            colHeight = col.container[0].offsetHeight;
            wrapperHeight = col.wrapper[0].offsetHeight;
            itemHeight = col.items[0].offsetHeight;
            itemsHeight = itemHeight * col.items.length;
            minTranslate = colHeight / 2 - itemsHeight + itemHeight / 2;
            maxTranslate = colHeight / 2 - itemHeight / 2;
            if (col.width) {
                colWidth = col.width;
                if (parseInt(colWidth, 10) === colWidth) colWidth = colWidth + 'px';
                col.container.css({ width: colWidth });
            }
            if (p.params.rotateEffect) {
                if (!col.width) {
                    col.items.each(function () {
                        var item = $(this);
                        item.css({ width: 'auto' });
                        colWidth = Math.max(colWidth, item[0].offsetWidth);
                        item.css({ width: '' });
                    });
                    col.container.css({ width: colWidth + 2 + 'px' });
                }
                col.container.addClass('picker-items-col-absolute');
            }
        };
        col.calcSize();

        col.wrapper.transform('translate3d(0,' + maxTranslate + 'px,0)').transition(0);

        var activeIndex = 0;
        var animationFrameId;

        // Set Value Function
        col.setValue = function (newValue, transition, valueCallbacks) {
            if (typeof transition === 'undefined') transition = '';
            var newActiveIndex = col.wrapper.find('.picker-item[data-picker-value="' + newValue + '"]').index();
            if (typeof newActiveIndex === 'undefined' || newActiveIndex === -1) {
                return;
            }
            var newTranslate = -newActiveIndex * itemHeight + maxTranslate;
            // Update wrapper
            col.wrapper.transition(transition);
            col.wrapper.transform('translate3d(0,' + newTranslate + 'px,0)');

            // Watch items
            if (p.params.updateValuesOnMomentum && col.activeIndex && col.activeIndex !== newActiveIndex) {
                $.cancelAnimationFrame(animationFrameId);
                col.wrapper.transitionEnd(function () {
                    $.cancelAnimationFrame(animationFrameId);
                });
                updateDuringScroll();
            }

            // Update items
            col.updateItems(newActiveIndex, newTranslate, transition, valueCallbacks);
        };

        col.updateItems = function (activeIndex, translate, transition, valueCallbacks) {
            if (typeof translate === 'undefined') {
                translate = $.getTranslate(col.wrapper[0], 'y');
            }
            if (typeof activeIndex === 'undefined') activeIndex = -Math.round((translate - maxTranslate) / itemHeight);
            if (activeIndex < 0) activeIndex = 0;
            if (activeIndex >= col.items.length) activeIndex = col.items.length - 1;
            var previousActiveIndex = col.activeIndex;
            col.activeIndex = activeIndex;
            col.wrapper.find('.picker-selected, .picker-after-selected, .picker-before-selected').removeClass('picker-selected picker-after-selected picker-before-selected');

            col.items.transition(transition);
            var selectedItem = col.items.eq(activeIndex).addClass('picker-selected').transform('');
            var prevItems = selectedItem.prevAll().addClass('picker-before-selected');
            var nextItems = selectedItem.nextAll().addClass('picker-after-selected');

            if (valueCallbacks || typeof valueCallbacks === 'undefined') {
                // Update values
                col.value = selectedItem.attr('data-picker-value');
                col.displayValue = col.displayValues ? col.displayValues[activeIndex] : col.value;
                // On change callback
                if (previousActiveIndex !== activeIndex) {
                    if (col.onChange) {
                        col.onChange(p, col.value, col.displayValue);
                    }
                    p.updateValue();
                }
            }

            // Set 3D rotate effect
            if (!p.params.rotateEffect) {
                return;
            }
            var percentage = (translate - (Math.floor((translate - maxTranslate) / itemHeight) * itemHeight + maxTranslate)) / itemHeight;

            col.items.each(function () {
                var item = $(this);
                var itemOffsetTop = item.index() * itemHeight;
                var translateOffset = maxTranslate - translate;
                var itemOffset = itemOffsetTop - translateOffset;
                var percentage = itemOffset / itemHeight;

                var itemsFit = Math.ceil(col.height / itemHeight / 2) + 1;

                var angle = -18 * percentage;
                if (angle > 180) angle = 180;
                if (angle < -180) angle = -180;
                // Far class
                if (Math.abs(percentage) > itemsFit) item.addClass('picker-item-far');else item.removeClass('picker-item-far');
                // Set transform
                item.transform('translate3d(0, ' + (-translate + maxTranslate) + 'px, ' + (originBug ? -110 : 0) + 'px) rotateX(' + angle + 'deg)');
            });
        };

        function updateDuringScroll() {
            animationFrameId = $.requestAnimationFrame(function () {
                col.updateItems(undefined, undefined, 0);
                updateDuringScroll();
            });
        }

        // Update items on init
        if (updateItems) col.updateItems(0, maxTranslate, 0);

        var allowItemClick = true;
        var isTouched, isMoved, touchStartY, touchCurrentY, touchStartTime, touchEndTime, startTranslate, returnTo, currentTranslate, prevTranslate, velocityTranslate, velocityTime;
        function handleTouchStart(e) {
            if (isMoved || isTouched) return;
            e.preventDefault();
            isTouched = true;
            touchStartY = touchCurrentY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
            touchStartTime = new Date().getTime();

            allowItemClick = true;
            startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], 'y');
        }
        function handleTouchMove(e) {
            if (!isTouched) return;
            e.preventDefault();
            allowItemClick = false;
            touchCurrentY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
            if (!isMoved) {
                // First move
                $.cancelAnimationFrame(animationFrameId);
                isMoved = true;
                startTranslate = currentTranslate = $.getTranslate(col.wrapper[0], 'y');
                col.wrapper.transition(0);
            }
            e.preventDefault();

            var diff = touchCurrentY - touchStartY;
            currentTranslate = startTranslate + diff;
            returnTo = undefined;

            // Normalize translate
            if (currentTranslate < minTranslate) {
                currentTranslate = minTranslate - Math.pow(minTranslate - currentTranslate, 0.8);
                returnTo = 'min';
            }
            if (currentTranslate > maxTranslate) {
                currentTranslate = maxTranslate + Math.pow(currentTranslate - maxTranslate, 0.8);
                returnTo = 'max';
            }
            // Transform wrapper
            col.wrapper.transform('translate3d(0,' + currentTranslate + 'px,0)');

            // Update items
            col.updateItems(undefined, currentTranslate, 0, p.params.updateValuesOnTouchmove);

            // Calc velocity
            velocityTranslate = currentTranslate - prevTranslate || currentTranslate;
            velocityTime = new Date().getTime();
            prevTranslate = currentTranslate;
        }
        function handleTouchEnd(e) {
            if (!isTouched || !isMoved) {
                isTouched = isMoved = false;
                return;
            }
            isTouched = isMoved = false;
            col.wrapper.transition('');
            if (returnTo) {
                if (returnTo === 'min') {
                    col.wrapper.transform('translate3d(0,' + minTranslate + 'px,0)');
                } else col.wrapper.transform('translate3d(0,' + maxTranslate + 'px,0)');
            }
            touchEndTime = new Date().getTime();
            var velocity, newTranslate;
            if (touchEndTime - touchStartTime > 300) {
                newTranslate = currentTranslate;
            } else {
                velocity = Math.abs(velocityTranslate / (touchEndTime - velocityTime));
                newTranslate = currentTranslate + velocityTranslate * p.params.momentumRatio;
            }

            newTranslate = Math.max(Math.min(newTranslate, maxTranslate), minTranslate);

            // Active Index
            var activeIndex = -Math.floor((newTranslate - maxTranslate) / itemHeight);

            // Normalize translate
            if (!p.params.freeMode) newTranslate = -activeIndex * itemHeight + maxTranslate;

            // Transform wrapper
            col.wrapper.transform('translate3d(0,' + parseInt(newTranslate, 10) + 'px,0)');

            // Update items
            col.updateItems(activeIndex, newTranslate, '', true);

            // Watch items
            if (p.params.updateValuesOnMomentum) {
                updateDuringScroll();
                col.wrapper.transitionEnd(function () {
                    $.cancelAnimationFrame(animationFrameId);
                });
            }

            // Allow click
            setTimeout(function () {
                allowItemClick = true;
            }, 100);
        }

        function handleClick(e) {
            if (!allowItemClick) return;
            $.cancelAnimationFrame(animationFrameId);
            /*jshint validthis:true */
            var value = $(this).attr('data-picker-value');
            col.setValue(value);
        }

        col.initEvents = function (detach) {
            var method = detach ? 'off' : 'on';
            col.container[method](app.touchEvents.start, handleTouchStart);
            col.container[method](app.touchEvents.move, handleTouchMove);
            col.container[method](app.touchEvents.end, handleTouchEnd);
            col.items[method]('click', handleClick);
        };
        col.destroyEvents = function () {
            col.initEvents(true);
        };

        col.container[0].f7DestroyPickerCol = function () {
            col.destroyEvents();
        };

        col.initEvents();
    };
    p.destroyPickerCol = function (colContainer) {
        colContainer = $(colContainer);
        if ('f7DestroyPickerCol' in colContainer[0]) colContainer[0].f7DestroyPickerCol();
    };
    // HTML Layout
    p.columnHTML = function (col, onlyItems) {
        var columnItemsHTML = '';
        var columnHTML = '';
        if (col.divider) {
            columnHTML += '<div class="picker-items-col picker-items-col-divider ' + (col.textAlign ? 'picker-items-col-' + col.textAlign : '') + ' ' + (col.cssClass || '') + '">' + col.content + '</div>';
        } else {
            for (var j = 0; j < col.values.length; j++) {
                columnItemsHTML += '<div class="picker-item" data-picker-value="' + col.values[j] + '">' + (col.displayValues ? col.displayValues[j] : col.values[j]) + '</div>';
            }
            columnHTML += '<div class="picker-items-col ' + (col.textAlign ? 'picker-items-col-' + col.textAlign : '') + ' ' + (col.cssClass || '') + '"><div class="picker-items-col-wrapper">' + columnItemsHTML + '</div></div>';
        }
        return onlyItems ? columnItemsHTML : columnHTML;
    };
    p.layout = function () {
        var pickerHTML = '';
        var pickerClass = '';
        var i;
        p.cols = [];
        var colsHTML = '';
        for (i = 0; i < p.params.cols.length; i++) {
            var col = p.params.cols[i];
            colsHTML += p.columnHTML(p.params.cols[i]);
            p.cols.push(col);
        }
        pickerClass = 'picker-modal picker-columns ' + (p.params.cssClass || '') + (p.params.rotateEffect ? ' picker-3d' : '') + (p.params.inline ? ' picker-modal-inline' : 'picker-modal-on');
        pickerHTML = '<div class="' + pickerClass + '">' + (p.params.toolbar ? p.params.toolbarTemplate.replace(/{{closeText}}/g, p.params.toolbarCloseText) : '') + '<div class="picker-modal-inner picker-items">' + colsHTML + '<div class="picker-center-highlight"></div>' + '</div>' + '</div>';

        return pickerHTML;
    };

    p.opened = false;
    p.open = function (el) {
        p.container = el;
        el.find('.picker-items-col').each(function () {
            p.initPickerCol(this, true);
        });
        if (p.params.defaultValue) {
            p.setValue(p.params.defaultValue, 0);
        }
        p.opened = true;
    };
    p.destroy = function () {
        p.container.find('.picker-items-col').each(function () {
            p.destroyPickerCol(this);
        });
    };
    return p;
};

module.exports = React.createClass({
    displayName: 'exports',

    getInitialState: function getInitialState() {
        return {
            picker: new Picker(this.props.params)
        };
    },
    componentDidMount: function componentDidMount() {
        var $el = $(this.refs.container.getDOMNode()).find('.picker-modal');
        this.state.picker.open($el);
        if (!this.props.params.inline) {
            setTimeout(function () {
                $el.css({ '-webkit-transform': 'translate3d(0,0,0)' });
            }, 0);
        }
    },
    componentWillUnmount: function componentWillUnmount() {
        this.state.picker.destroy();
    },
    render: function render() {
        var layout = this.state.picker.layout();
        return React.createElement('div', { dangerouslySetInnerHTML: { __html: layout }, ref: 'container' });
    }
});

},{"react":undefined}],144:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
   displayName: "exports",

   render: function render() {
      return React.createElement(
         "div",
         { className: "picker-item", "data-picker-value": this.props.index },
         this.props.children
      );
   }
});

},{"react":undefined}],145:[function(require,module,exports){
'use strict';

var React = require('react');
var PickerItemsCol = require('./PickerItemsCol');
var PickerItemsColDivider = require('./PickerItemsColDivider');
var BlackPreloader = require('../modal/Preloader/BlackPreloader');
var PreloaderIndicatorModal = require('../modal/Preloader/PreloaderIndicatorModal');

module.exports = React.createClass({
				displayName: 'exports',

				render: function render() {
								var cols = this.props.cols;
								return React.createElement(
												'div',
												{ className: 'picker-modal-inner picker-items' },
												cols.map(function (col) {
																return col.divider ? React.createElement(
																				PickerItemsColDivider,
																				{ textAlign: col.textAlign },
																				col.content
																) : React.createElement(PickerItemsCol, { values: col.values, textAlign: col.textAlign });
												}),
												React.createElement('div', { className: 'picker-center-highlight' })
								);
				}
});

},{"../modal/Preloader/BlackPreloader":132,"../modal/Preloader/PreloaderIndicatorModal":134,"./PickerItemsCol":146,"./PickerItemsColDivider":147,"react":undefined}],146:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');
var PickerItem = require('./PickerItem');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        var obj = {
            "picker-items-col": true

        };
        if (this.props.textAlign) {
            obj['picker-items-col-' + this.props.textAlign] = this.props.textAlign;
        }
        var className = cn(obj);
        var values = this.props.values;
        return React.createElement(
            'div',
            { className: className },
            React.createElement(
                'div',
                { className: 'picker-items-col-wrapper' },
                values.map(function (value, i) {
                    return React.createElement(
                        PickerItem,
                        { index: i },
                        value
                    );
                })
            )
        );
    }
});

},{"./PickerItem":144,"classnames":52,"react":undefined}],147:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        var obj = {
            "picker-items-col picker-items-col-divider": true

        };
        if (this.props.textAlign) {
            obj['picker-items-col-' + this.props.textAlign] = this.props.textAlign;
        }
        var className = cn(obj);
        return React.createElement(
            'div',
            { className: className },
            this.props.children
        );
    }
});

},{"classnames":52,"react":undefined}],148:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
   displayName: "exports",

   render: function render() {
      return React.createElement(
         "div",
         { className: "toolbar" },
         React.createElement(
            "div",
            { className: "toolbar-inner" },
            this.props.children
         )
      );
   }
});

},{"react":undefined}],149:[function(require,module,exports){
'use strict';

module.exports = {
	Picker: require('./Picker'),
	PickerEx: require('./PickerEx'),
	PickerItem: require('./PickerItem'),
	PickerItems: require('./PickerItems'),
	PickerItemsCol: require('./PickerItemsCol'),
	PickerItemsColDivider: require('./PickerItemsColDivider'),
	ToolBar: require('./ToolBar')
};

},{"./Picker":142,"./PickerEx":143,"./PickerItem":144,"./PickerItems":145,"./PickerItemsCol":146,"./PickerItemsColDivider":147,"./ToolBar":148}],150:[function(require,module,exports){
'use strict';

var React = require('react');

var InfiniteScroll = function InfiniteScroll(params) {
    var p = this;
    var distance = params ? params.distance || 50 : 50;

    function handleInfiniteScroll() {
        /*jshint validthis:true */
        var inf = $(this);
        var scrollTop = inf[0].scrollTop;
        var scrollHeight = inf[0].scrollHeight;
        var height = inf[0].offsetHeight;

        var virtualListContainer = inf.find('.virtual-list');
        var virtualList;
        var onTop = inf.hasClass('infinite-scroll-top');

        if (typeof distance === 'string' && distance.indexOf('%') >= 0) {
            distance = parseInt(distance, 10) / 100 * height;
        }

        if (distance > height) distance = height;
        if (onTop) {
            if (scrollTop < distance) {
                inf.trigger('infinite');
            }
        } else {
            if (scrollTop + height >= scrollHeight - distance) {
                if (virtualListContainer.length > 0) {
                    virtualList = virtualListContainer[0].f7VirtualList;
                    if (virtualList && !virtualList.reachEnd) return;
                }
                inf.trigger('infinite');
            }
        }
    }
    p.initInfiniteScroll = function (container) {
        p.container = container;
        p.container.on('scroll', handleInfiniteScroll);
    };
    p.destoryInfiniteScroll = function () {
        p.container.off('scroll', handleInfiniteScroll);
    };

    return p;
};

module.exports = React.createClass({
    displayName: 'exports',

    componentDidMount: function componentDidMount() {
        var self = this;
        this.infiniteScroll = new InfiniteScroll({ distance: this.props.distance });
        var container = $('.infinite-scroll');
        this.infiniteScroll.initInfiniteScroll(container);
        container.on('infinite', function (e) {
            self.props.onInfinite && self.props.onInfinite(e);
        });
    },
    componentWillUnmount: function componentWillUnmount() {
        this.infiniteScroll.destoryInfiniteScroll();
    },
    render: function render() {
        return null;
    }
});

},{"react":undefined}],151:[function(require,module,exports){
'use strict';

var React = require('react');
var PullToRefresh = function PullToRefresh(params) {
    var p = this;

    p.initPullToRefresh = function (pageContainer) {
        var eventsTarget = $(pageContainer);
        if (!eventsTarget.hasClass('pull-to-refresh-content')) {
            eventsTarget = eventsTarget.find('.pull-to-refresh-content');
        }
        if (!eventsTarget || eventsTarget.length === 0) return;

        var isTouched,
            isMoved,
            touchesStart = {},
            isScrolling,
            touchesDiff,
            touchStartTime,
            container,
            refresh = false,
            useTranslate = false,
            startTranslate = 0,
            translate,
            scrollTop,
            wasScrolled,
            layer,
            triggerDistance,
            dynamicTriggerDistance;
        var page = eventsTarget.hasClass('page') ? eventsTarget : eventsTarget.parents('.page');
        var hasNavbar = false;
        if (page.find('.navbar').length > 0 || page.parents('.navbar-fixed, .navbar-through').length > 0 || page.hasClass('navbar-fixed') || page.hasClass('navbar-through')) hasNavbar = true;
        if (page.hasClass('no-navbar')) hasNavbar = false;
        if (!hasNavbar) eventsTarget.addClass('pull-to-refresh-no-navbar');

        container = eventsTarget;

        // Define trigger distance
        if (container.attr('data-ptr-distance')) {
            dynamicTriggerDistance = true;
        } else {
            triggerDistance = 44;
        }

        function handleTouchStart(e) {
            if (isTouched) {
                if (app.device.os === 'android') {
                    if ('targetTouches' in e && e.targetTouches.length > 1) return;
                } else return;
            }
            isMoved = false;
            isTouched = true;
            isScrolling = undefined;
            wasScrolled = undefined;
            touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
            touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
            touchStartTime = new Date().getTime();
            /*jshint validthis:true */
            container = $(this);
        }

        function handleTouchMove(e) {
            if (!isTouched) return;
            var pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
            var pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
            if (typeof isScrolling === 'undefined') {
                isScrolling = !!(isScrolling || Math.abs(pageY - touchesStart.y) > Math.abs(pageX - touchesStart.x));
            }
            if (!isScrolling) {
                isTouched = false;
                return;
            }

            scrollTop = container[0].scrollTop;
            if (typeof wasScrolled === 'undefined' && scrollTop !== 0) wasScrolled = true;

            if (!isMoved) {
                /*jshint validthis:true */
                container.removeClass('transitioning');
                if (scrollTop > container[0].offsetHeight) {
                    isTouched = false;
                    return;
                }
                if (dynamicTriggerDistance) {
                    triggerDistance = container.attr('data-ptr-distance');
                    if (triggerDistance.indexOf('%') >= 0) triggerDistance = container[0].offsetHeight * parseInt(triggerDistance, 10) / 100;
                }
                startTranslate = container.hasClass('refreshing') ? triggerDistance : 0;
                if (container[0].scrollHeight === container[0].offsetHeight || app.device.os !== 'ios') {
                    useTranslate = true;
                } else {
                    useTranslate = false;
                }
            }
            isMoved = true;
            touchesDiff = pageY - touchesStart.y;

            if (touchesDiff > 0 && scrollTop <= 0 || scrollTop < 0) {
                // iOS 8 fix
                if (app.device.os === 'ios' && parseInt(app.device.osVersion.split('.')[0], 10) > 7 && scrollTop === 0 && !wasScrolled) useTranslate = true;

                if (useTranslate) {
                    e.preventDefault();
                    translate = Math.pow(touchesDiff, 0.85) + startTranslate;
                    container.transform('translate3d(0,' + translate + 'px,0)');
                } else {}
                if (useTranslate && Math.pow(touchesDiff, 0.85) > triggerDistance || !useTranslate && touchesDiff >= triggerDistance * 2) {
                    refresh = true;
                    container.addClass('pull-up').removeClass('pull-down');
                } else {
                    refresh = false;
                    container.removeClass('pull-up').addClass('pull-down');
                }
            } else {

                container.removeClass('pull-up pull-down');
                refresh = false;
                return;
            }
        }
        function handleTouchEnd(e) {
            if (!isTouched || !isMoved) {
                isTouched = false;
                isMoved = false;
                return;
            }
            if (translate) {
                container.addClass('transitioning');
                translate = 0;
            }
            container.transform('');
            if (refresh) {
                container.addClass('refreshing');
                container.trigger('refresh', {
                    done: function done() {
                        p.pullToRefreshDone(container);
                    }
                });
            } else {
                container.removeClass('pull-down');
            }
            isTouched = false;
            isMoved = false;
        }

        // Attach Events
        eventsTarget.on(app.touchEvents.start, handleTouchStart);
        eventsTarget.on(app.touchEvents.move, handleTouchMove);
        eventsTarget.on(app.touchEvents.end, handleTouchEnd);

        // Detach Events on page remove
        if (page.length === 0) return;
        function destroyPullToRefresh() {
            eventsTarget.off(app.touchEvents.start, handleTouchStart);
            eventsTarget.off(app.touchEvents.move, handleTouchMove);
            eventsTarget.off(app.touchEvents.end, handleTouchEnd);
        }
        eventsTarget[0].f7DestroyPullToRefresh = destroyPullToRefresh;
        function detachEvents() {
            destroyPullToRefresh();
        }
    };

    p.pullToRefreshDone = function (container) {
        container = $(container);
        if (container.length === 0) container = $('.pull-to-refresh-content.refreshing');
        container.removeClass('refreshing').addClass('transitioning');
        container.transitionEnd(function () {
            container.removeClass('transitioning pull-up pull-down');
        });
    };
    p.pullToRefreshTrigger = function (container) {
        container = $(container);
        if (container.length === 0) container = $('.pull-to-refresh-content');
        if (container.hasClass('refreshing')) return;
        container.addClass('transitioning refreshing');
        container.trigger('refresh', {
            done: function done() {
                p.pullToRefreshDone(container);
            }
        });
    };
    p.destroyPullToRefresh = function (pageContainer) {
        pageContainer = $(pageContainer);
        var pullToRefreshContent = pageContainer.hasClass('pull-to-refresh-content') ? pageContainer : pageContainer.find('.pull-to-refresh-content');
        if (pullToRefreshContent.length === 0) return;
        if (pullToRefreshContent[0].f7DestroyPullToRefresh) pullToRefreshContent[0].f7DestroyPullToRefresh();
    };

    return p;
};

module.exports = React.createClass({
    displayName: 'exports',

    componentDidMount: function componentDidMount() {
        var self = this;
        this.pullToRefresh = new PullToRefresh();
        this.container = $('.pull-to-refresh-content');
        this.pullToRefresh.initPullToRefresh(this.container);
        this.container.on('refresh', function (e) {
            self.props.onRefresh && self.props.onRefresh(e);
        });
    },
    componentWillUnmount: function componentWillUnmount() {
        this.pullToRefresh.destroyPullToRefresh(this.container);
    },
    refreshDone: function refreshDone() {
        this.pullToRefresh.pullToRefreshDone();
    },
    render: function render() {
        return React.createElement(
            'div',
            { className: 'pull-to-refresh-layer' },
            React.createElement('div', { className: 'preloader' }),
            React.createElement('div', { className: 'pull-to-refresh-arrow' })
        );
    }
});

},{"react":undefined}],152:[function(require,module,exports){
'use strict';

module.exports = {
	InfiniteScroll: require('./InfiniteScroll'),
	PullToRefresh: require('./PullToRefresh')
};

},{"./InfiniteScroll":150,"./PullToRefresh":151}],153:[function(require,module,exports){
'use strict';

var React = require('react');

var Searchbar = function Searchbar(container, params) {
    var defaults = {
        input: null,
        clearButton: null,
        cancelButton: null,
        searchList: null,
        searchIn: '.item-title',
        searchBy: '',
        found: null,
        notFound: null,
        overlay: null,
        ignore: '.searchbar-ignore',
        customSearch: false,
        removeDiacritics: false,
        searchbarHideDividers: true,
        searchbarHideGroups: true
    };
    params = params || {};
    for (var def in defaults) {
        if (typeof params[def] === 'undefined' || params[def] === null) {
            params[def] = defaults[def];
        }
    }

    // Instance
    var s = this;

    // Params
    s.params = params;

    // Container
    container = $(container);
    s.container = container;

    // Active
    s.active = false;

    // Input
    s.input = s.params.input ? $(s.params.input) : s.container.find('input[type="search"]');
    s.clearButton = s.params.clearButton ? $(s.params.clearButton) : s.container.find('.searchbar-clear');
    s.cancelButton = s.params.cancelButton ? $(s.params.cancelButton) : s.container.find('.searchbar-cancel');

    // Search List
    s.searchList = $(s.params.searchList);

    // Is Virtual List
    s.isVirtualList = s.searchList.hasClass('virtual-list');

    // Is In Page
    s.pageContainer = s.container.parents('.page').eq(0);

    // Overlay
    if (!s.params.overlay) {
        s.overlay = s.pageContainer.length > 0 ? s.pageContainer.find('.searchbar-overlay') : $('.searchbar-overlay');
    } else {
        s.overlay = $(s.params.overlay);
    }
    // Found and not found
    if (!s.params.found) {
        s.found = s.pageContainer.length > 0 ? s.pageContainer.find('.searchbar-found') : $('.searchbar-found');
    } else {
        s.found = $(s.params.found);
    }
    if (!s.params.notFound) {
        s.notFound = s.pageContainer.length > 0 ? s.pageContainer.find('.searchbar-not-found') : $('.searchbar-not-found');
    } else {
        s.notFound = $(s.params.notFound);
    }

    // Cancel button
    var cancelMarginProp = app.rtl ? 'margin-left' : 'margin-right';
    if (s.cancelButton.length > 0) {
        s.cancelButton.transition(0).show();
        s.cancelButton.css(cancelMarginProp, -s.cancelButton[0].offsetWidth + 'px');
        setTimeout(function () {
            s.cancelButton.transition('');
        }, 0);
    }

    // Diacritics
    var defaultDiacriticsRemovalap = [{ base: 'A', letters: 'AⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ' }, { base: 'AA', letters: 'Ꜳ' }, { base: 'AE', letters: 'ÆǼǢ' }, { base: 'AO', letters: 'Ꜵ' }, { base: 'AU', letters: 'Ꜷ' }, { base: 'AV', letters: 'ꜸꜺ' }, { base: 'AY', letters: 'Ꜽ' }, { base: 'B', letters: 'BⒷＢḂḄḆɃƂƁ' }, { base: 'C', letters: 'CⒸＣĆĈĊČÇḈƇȻꜾ' }, { base: 'D', letters: 'DⒹＤḊĎḌḐḒḎĐƋƊƉꝹ' }, { base: 'DZ', letters: 'ǱǄ' }, { base: 'Dz', letters: 'ǲǅ' }, { base: 'E', letters: 'EⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ' }, { base: 'F', letters: 'FⒻＦḞƑꝻ' }, { base: 'G', letters: 'GⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾ' }, { base: 'H', letters: 'HⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ' }, { base: 'I', letters: 'IⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ' }, { base: 'J', letters: 'JⒿＪĴɈ' }, { base: 'K', letters: 'KⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ' }, { base: 'L', letters: 'LⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ' }, { base: 'LJ', letters: 'Ǉ' }, { base: 'Lj', letters: 'ǈ' }, { base: 'M', letters: 'MⓂＭḾṀṂⱮƜ' }, { base: 'N', letters: 'NⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ' }, { base: 'NJ', letters: 'Ǌ' }, { base: 'Nj', letters: 'ǋ' }, { base: 'O', letters: 'OⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ' }, { base: 'OI', letters: 'Ƣ' }, { base: 'OO', letters: 'Ꝏ' }, { base: 'OU', letters: 'Ȣ' }, { base: 'OE', letters: 'Œ' }, { base: 'oe', letters: 'œ' }, { base: 'P', letters: 'PⓅＰṔṖƤⱣꝐꝒꝔ' }, { base: 'Q', letters: 'QⓆＱꝖꝘɊ' }, { base: 'R', letters: 'RⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ' }, { base: 'S', letters: 'SⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ' }, { base: 'T', letters: 'TⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ' }, { base: 'TZ', letters: 'Ꜩ' }, { base: 'U', letters: 'UⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ' }, { base: 'V', letters: 'VⓋＶṼṾƲꝞɅ' }, { base: 'VY', letters: 'Ꝡ' }, { base: 'W', letters: 'WⓌＷẀẂŴẆẄẈⱲ' }, { base: 'X', letters: 'XⓍＸẊẌ' }, { base: 'Y', letters: 'YⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ' }, { base: 'Z', letters: 'ZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ' }, { base: 'a', letters: 'aⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐ' }, { base: 'aa', letters: 'ꜳ' }, { base: 'ae', letters: 'æǽǣ' }, { base: 'ao', letters: 'ꜵ' }, { base: 'au', letters: 'ꜷ' }, { base: 'av', letters: 'ꜹꜻ' }, { base: 'ay', letters: 'ꜽ' }, { base: 'b', letters: 'bⓑｂḃḅḇƀƃɓ' }, { base: 'c', letters: 'cⓒｃćĉċčçḉƈȼꜿↄ' }, { base: 'd', letters: 'dⓓｄḋďḍḑḓḏđƌɖɗꝺ' }, { base: 'dz', letters: 'ǳǆ' }, { base: 'e', letters: 'eⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ' }, { base: 'f', letters: 'fⓕｆḟƒꝼ' }, { base: 'g', letters: 'gⓖｇǵĝḡğġǧģǥɠꞡᵹꝿ' }, { base: 'h', letters: 'hⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ' }, { base: 'hv', letters: 'ƕ' }, { base: 'i', letters: 'iⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı' }, { base: 'j', letters: 'jⓙｊĵǰɉ' }, { base: 'k', letters: 'kⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ' }, { base: 'l', letters: 'lⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇ' }, { base: 'lj', letters: 'ǉ' }, { base: 'm', letters: 'mⓜｍḿṁṃɱɯ' }, { base: 'n', letters: 'nⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥ' }, { base: 'nj', letters: 'ǌ' }, { base: 'o', letters: 'oⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ' }, { base: 'oi', letters: 'ƣ' }, { base: 'ou', letters: 'ȣ' }, { base: 'oo', letters: 'ꝏ' }, { base: 'p', letters: 'pⓟｐṕṗƥᵽꝑꝓꝕ' }, { base: 'q', letters: 'qⓠｑɋꝗꝙ' }, { base: 'r', letters: 'rⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ' }, { base: 's', letters: 'sⓢｓßśṥŝṡšṧṣṩșşȿꞩꞅẛ' }, { base: 't', letters: 'tⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ' }, { base: 'tz', letters: 'ꜩ' }, { base: 'u', letters: 'uⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ' }, { base: 'v', letters: 'vⓥｖṽṿʋꝟʌ' }, { base: 'vy', letters: 'ꝡ' }, { base: 'w', letters: 'wⓦｗẁẃŵẇẅẘẉⱳ' }, { base: 'x', letters: 'xⓧｘẋẍ' }, { base: 'y', letters: 'yⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ' }, { base: 'z', letters: 'zⓩｚźẑżžẓẕƶȥɀⱬꝣ' }];

    var diacriticsMap = {};
    for (var i = 0; i < defaultDiacriticsRemovalap.length; i++) {
        var letters = defaultDiacriticsRemovalap[i].letters;
        for (var j = 0; j < letters.length; j++) {
            diacriticsMap[letters[j]] = defaultDiacriticsRemovalap[i].base;
        }
    }

    function removeDiacritics(str) {
        return str.replace(/[^\u0000-\u007E]/g, function (a) {
            return diacriticsMap[a] || a;
        });
    }

    // Trigger
    s.triggerEvent = function (eventName, eventData) {
        s.container.trigger(eventName, eventData);
        if (s.searchList.length > 0) s.searchList.trigger(eventName, eventData);
    };

    // Enable/disalbe
    s.enable = function () {
        function _enable() {
            if ((s.searchList.length || s.params.customSearch) && !s.container.hasClass('searchbar-active')) s.overlay.addClass('searchbar-overlay-active');
            s.container.addClass('searchbar-active');
            if (s.cancelButton.length > 0) s.cancelButton.css(cancelMarginProp, '0px');
            s.triggerEvent('enableSearch');
            s.active = true;
        }
        if (app.device.ios) {
            setTimeout(function () {
                _enable();
            }, 400);
        } else {
            _enable();
        }
    };

    s.disable = function () {
        s.input.val('').trigger('change');
        s.container.removeClass('searchbar-active searchbar-not-empty');
        if (s.cancelButton.length > 0) s.cancelButton.css(cancelMarginProp, -s.cancelButton[0].offsetWidth + 'px');

        if (s.searchList.length || s.params.customSearch) s.overlay.removeClass('searchbar-overlay-active');
        function _disable() {
            s.input.blur();
            s.triggerEvent('disableSearch');
            s.active = false;
        }
        if (app.device.ios) {
            setTimeout(function () {
                _disable();
            }, 400);
        } else {
            _disable();
        }
    };

    // Clear
    s.clear = function () {
        s.input.val('').trigger('change').focus();
        s.triggerEvent('clearSearch');
    };

    // Search
    s.handleInput = function () {
        setTimeout(function () {
            var value = s.input.val().trim();
            if ((s.searchList.length > 0 || s.params.customSearch) && (s.params.searchIn || s.isVirtualList)) s.search(value, true);
        }, 0);
    };

    var previousQuery = '';
    var virtualList;
    s.search = function (query, internal) {
        if (query.trim() === previousQuery) return;
        previousQuery = query.trim();

        if (!internal) {
            if (!s.active) {
                s.enable();
            }
            if (!internal) {
                s.input.val(query);
            }
        }
        // Add active/inactive classes on overlay
        if (query.length === 0) {
            s.container.removeClass('searchbar-not-empty');
            if (s.searchList.length && s.container.hasClass('searchbar-active')) s.overlay.addClass('searchbar-overlay-active');
        } else {
            s.container.addClass('searchbar-not-empty');
            if (s.searchList.length && s.container.hasClass('searchbar-active')) s.overlay.removeClass('searchbar-overlay-active');
        }

        if (s.params.customSearch) {
            s.triggerEvent('search', { query: query });
            return;
        }

        var foundItems = [];
        if (s.isVirtualList) {
            virtualList = s.searchList[0].f7VirtualList;
            if (query.trim() === '') {
                virtualList.resetFilter();
                s.notFound.hide();
                s.found.show();
                return;
            }
            if (virtualList.params.searchAll) {
                foundItems = virtualList.params.searchAll(query, virtualList.items) || [];
            } else if (virtualList.params.searchByItem) {
                for (var i = 0; i < virtualList.items.length; i++) {
                    if (virtualList.params.searchByItem(query, i, virtualList.params.items[i])) {
                        foundItems.push(i);
                    }
                }
            }
        } else {
            var values;
            if (s.params.removeDiacritics) values = removeDiacritics(query.trim().toLowerCase()).split(' ');else {
                values = query.trim().toLowerCase().split(' ');
            }
            s.searchList.find('li').removeClass('hidden-by-searchbar').each(function (index, el) {
                el = $(el);
                var compareWithText = [];
                el.find(s.params.searchIn).each(function () {
                    var itemText = $(this).text().trim().toLowerCase();
                    if (s.params.removeDiacritics) itemText = removeDiacritics(itemText);
                    compareWithText.push(itemText);
                });
                compareWithText = compareWithText.join(' ');
                var wordsMatch = 0;
                for (var i = 0; i < values.length; i++) {
                    if (compareWithText.indexOf(values[i]) >= 0) wordsMatch++;
                }
                if (wordsMatch !== values.length && !(s.params.ignore && el.is(s.params.ignore))) {
                    el.addClass('hidden-by-searchbar');
                } else {
                    foundItems.push(el[0]);
                }
            });

            if (s.params.searchbarHideDividers) {
                s.searchList.find('.item-divider, .list-group-title').each(function () {
                    var title = $(this);
                    var nextElements = title.nextAll('li');
                    var hide = true;
                    for (var i = 0; i < nextElements.length; i++) {
                        var nextEl = $(nextElements[i]);
                        if (nextEl.hasClass('list-group-title') || nextEl.hasClass('item-divider')) break;
                        if (!nextEl.hasClass('hidden-by-searchbar')) {
                            hide = false;
                        }
                    }
                    var ignore = s.params.ignore && title.is(s.params.ignore);
                    if (hide && !ignore) title.addClass('hidden-by-searchbar');else title.removeClass('hidden-by-searchbar');
                });
            }
            if (s.params.searchbarHideGroups) {
                s.searchList.find('.list-group').each(function () {
                    var group = $(this);
                    var ignore = s.params.ignore && group.is(s.params.ignore);
                    var notHidden = group.find('li:not(.hidden-by-searchbar)');
                    if (notHidden.length === 0 && !ignore) {
                        group.addClass('hidden-by-searchbar');
                    } else {
                        group.removeClass('hidden-by-searchbar');
                    }
                });
            }
        }
        s.triggerEvent('search', { query: query, foundItems: foundItems });
        if (foundItems.length === 0) {
            s.notFound.show();
            s.found.hide();
        } else {
            s.notFound.hide();
            s.found.show();
        }
        if (s.isVirtualList) {
            virtualList.filterItems(foundItems);
        }
    };

    // Events
    function preventSubmit(e) {
        e.preventDefault();
    }

    s.attachEvents = function (destroy) {
        var method = destroy ? 'off' : 'on';
        s.container[method]('submit', preventSubmit);
        s.cancelButton[method]('click', s.disable);
        s.overlay[method]('click', s.disable);
        s.input[method]('focus', s.enable);
        s.input[method]('change keydown keypress keyup', s.handleInput);
        s.clearButton[method]('click', s.clear);
    };
    s.detachEvents = function () {
        s.attachEvents(true);
    };

    // Init Destroy
    s.init = function () {
        s.attachEvents();
    };
    s.destroy = function () {
        if (!s) return;
        s.detachEvents();
        s = null;
    };

    s.init();
    return s;
};

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        return React.createElement(
            'form',
            { className: 'searchbar' },
            React.createElement(
                'div',
                { className: 'searchbar-input' },
                React.createElement('input', { type: 'search', placeholder: 'Search' }),
                React.createElement('a', { href: '#', className: 'searchbar-clear' })
            ),
            React.createElement(
                'a',
                { href: '#', className: 'searchbar-cancel' },
                'Cancel'
            )
        );
    }
});
module.exports.Searchbar = function (container, params) {
    return new Searchbar(container, params);
};

},{"react":undefined}],154:[function(require,module,exports){
'use strict';

var React = require('react');
var List = require('../list');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        return React.createElement(
            'div',
            null,
            React.createElement(
                List.List,
                { block: true, 'class': 'searchbar-not-found' },
                React.createElement(
                    List.ItemContent,
                    null,
                    React.createElement(
                        List.ItemInner,
                        null,
                        React.createElement(
                            List.ItemTitle,
                            null,
                            'Nothing found'
                        )
                    )
                )
            ),
            React.createElement(
                List.List,
                { block: true, 'class': 'searchbar-found' },
                this.props.children
            )
        );
    }
});

},{"../list":103,"react":undefined}],155:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
	displayName: "exports",

	render: function render() {
		return React.createElement("div", { className: "searchbar-overlay" });
	}
});

},{"react":undefined}],156:[function(require,module,exports){
'use strict';

module.exports = {
	Search: require('./Search'),
	SearchList: require('./SearchList'),
	SearchOverlay: require('./SearchOverlay')
};

},{"./Search":153,"./SearchList":154,"./SearchOverlay":155}],157:[function(require,module,exports){
'use strict';

module.exports = (function () {
    var device = {};
    var ua = navigator.userAgent;

    var android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
    var ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
    var ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
    var iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/);

    // Android
    if (android) {
        device.os = 'android';
        device.osVersion = android[2];
    } else if (ipad || iphone || ipod) {
        device.os = 'ios';
    } else {
        device.os = 'desktop';
    }
    // iOS
    if (iphone && !ipod) {
        device.osVersion = iphone[2].replace(/_/g, '.');
    }
    if (ipad) {
        device.osVersion = ipad[2].replace(/_/g, '.');
    }
    if (ipod) {
        device.osVersion = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
    }
    // iOS 8+ changed UA
    if (device.os === 'ios' && device.osVersion && ua.indexOf('Version/') >= 0) {
        if (device.osVersion.split('.')[0] === '10') {
            device.osVersion = ua.toLowerCase().split('version/')[1].split(' ')[0];
        }
    }

    // Check for status bar and fullscreen app mode
    var windowWidth = $(window).width();
    var windowHeight = $(window).height();
    device.statusBar = false;
    if (device.webView && windowWidth * windowHeight === screen.width * screen.height) {
        device.statusBar = true;
    } else {
        device.statusBar = false;
    }

    // Classes
    var classNames = [];

    // Pixel Ratio
    device.pixelRatio = window.devicePixelRatio || 1;
    classNames.push('pixel-ratio-' + Math.floor(device.pixelRatio));
    if (device.pixelRatio >= 2) {
        classNames.push('retina');
    }

    // OS classes
    if (device.os !== 'desktop') {
        classNames.push(device.os, device.os + '-' + device.osVersion.split('.')[0], device.os + '-' + device.osVersion.replace(/\./g, '-'));
        if (device.os === 'ios') {
            var major = parseInt(device.osVersion.split('.')[0], 10);
            for (var i = major - 1; i >= 6; i--) {
                classNames.push('ios-gt-' + i);
            }
        }
    }
    // Status bar classes
    if (device.statusBar) {
        classNames.push('with-statusbar-overlay');
    } else {
        $('html').removeClass('with-statusbar-overlay');
    }

    // Add html classes
    if (classNames.length > 0) $('html').addClass(classNames.join(' '));

    device.pause = true;
    // Export object
    return device;
})();

},{}],158:[function(require,module,exports){
'use strict';

module.exports = {
    touch: window.Modernizr && Modernizr.touch === true || (function () {
        return !!('ontouchstart' in window || window.DocumentTouch && document instanceof DocumentTouch);
    })(),
    transforms3d: window.Modernizr && Modernizr.csstransforms3d === true || (function () {
        var div = document.createElement('div').style;
        return 'webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div;
    })(),
    flexbox: (function () {
        var div = document.createElement('div').style;
        var styles = 'alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient'.split(' ');
        for (var i = 0; i < styles.length; i++) {
            if (styles[i] in div) return true;
        }
    })(),
    observer: (function () {
        return 'MutationObserver' in window || 'WebkitMutationObserver' in window;
    })()
};

},{}],159:[function(require,module,exports){
'use strict';

module.exports = {
	Device: require('./Device'),
	Support: require('./Support')
};

},{"./Device":157,"./Support":158}],160:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');
var NavbarTitle = require('./navbar/NavbarTitle');
var Navbar = require('./navbar/Navbar');
var BackButton = require('./navbar/BackButton');
var NavbarMixins = require('../mixins').Navbar;

var ScrollHideBar = function ScrollHideBar(container) {
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
        var hideTabbar = (p.hideTabbarOnPageScroll || scrollContent.hasClass('hide-tabbar-on-scroll')) && !scrollContent.hasClass('keep-tabbar-on-scroll');

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

        var toolbarHeight = hasToolbar && hideToolbar ? toolbar[0].offsetHeight : 0;
        var tabbarHeight = hasTabbar && hideTabbar ? tabbar[0].offsetHeight : 0;
        var bottomBarHeight = tabbarHeight || toolbarHeight;

        function handleScroll(e) {
            currentScroll = scrollContent[0].scrollTop;
            scrollHeight = scrollContent[0].scrollHeight;
            offsetHeight = scrollContent[0].offsetHeight;
            reachEnd = p.showBarsOnPageScrollEnd && currentScroll + offsetHeight >= scrollHeight - bottomBarHeight;
            navbarHidden = navbar.hasClass('navbar-hidden');
            toolbarHidden = toolbar.hasClass('toolbar-hidden');
            tabbarHidden = tabbar && tabbar.hasClass('toolbar-hidden');

            if (reachEnd) {
                action = 'show';
            } else if (previousScroll > currentScroll) {
                if (p.showBarsOnPageScrollTop || currentScroll <= 44) {
                    action = 'show';
                } else {
                    action = 'hide';
                }
            } else {
                if (currentScroll > 44) {
                    action = 'hide';
                } else {
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
            } else {
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
        scrollContent[0].f7ScrollToolbarsHandler && scrollContent.off('scroll', scrollContent[0].f7ScrollToolbarsHandler);
    };

    return p;
};

module.exports = React.createClass({
    displayName: 'exports',

    componentDidMount: function componentDidMount() {
        if (this.props.scrollHideBar) {
            this.scrollHideBar = new ScrollHideBar($(this.refs.container.getDOMNode()));
            this.scrollHideBar.init();
        }
    },
    componentWillUnmount: function componentWillUnmount() {
        if (this.props.scrollHideBar) {
            this.scrollHideBar.destory();
        }
    },
    render: function render() {
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
        return React.createElement(
            'div',
            { className: className, style: this.props.style, ref: 'container' },
            !!title && React.createElement(
                Navbar,
                { goBack: this.props.goBack },
                React.createElement(
                    NavbarTitle,
                    null,
                    title
                ),
                this.props.right
            ),
            this.props.children
        );
    }
});

},{"../mixins":114,"./navbar/BackButton":163,"./navbar/Navbar":164,"./navbar/NavbarTitle":166,"classnames":52,"react":undefined}],161:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        var obj = {
            "messages-content": this.props.message,
            "hide-bars-on-scroll": this.props.scrollHideBar,
            "with-subnavbar": this.props.subnavbar
        };
        this.props['class'] && (obj[this.props['class']] = true);
        var className = cn("page-content", obj);
        return React.createElement(
            'div',
            { className: className },
            this.props.children
        );
    }
});

},{"classnames":52,"react":undefined}],162:[function(require,module,exports){
'use strict';

module.exports = {
	BackButton: require('./navbar/BackButton'),
	Navbar: require('./navbar/Navbar'),
	SubNavbar: require('./navbar/SubNavbar'),
	NavbarButton: require('./navbar/NavbarButton'),
	NavbarTitle: require('./navbar/NavbarTitle'),
	Page: require('./Page'),
	PageContent: require('./PageContent'),
	Panel: require('./panel/Panel'),
	Toolbar: require('./toolbar/Toolbar'),
	ToolbarButton: require('./toolbar/ToolbarButton')
};

},{"./Page":160,"./PageContent":161,"./navbar/BackButton":163,"./navbar/Navbar":164,"./navbar/NavbarButton":165,"./navbar/NavbarTitle":166,"./navbar/SubNavbar":167,"./panel/Panel":168,"./toolbar/Toolbar":169,"./toolbar/ToolbarButton":170}],163:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    goBack: function goBack() {
        var goBack = this.props.goBack;
        if (!goBack || !goBack()) {
            app.goBack();
        }
    },
    render: function render() {
        return React.createElement(
            "div",
            { className: "left sliding" },
            React.createElement(
                "a",
                { href: "#", className: "back link", onClick: this.goBack },
                React.createElement("i", { className: "icon icon-back" }),
                React.createElement(
                    "span",
                    null,
                    this.props.children
                )
            )
        );
    }
});

},{"react":undefined}],164:[function(require,module,exports){
'use strict';

var React = require('react');
var BackButton = require('./BackButton');
var NavbarMixins = require('../../mixins').Navbar;

module.exports = React.createClass({
    displayName: 'exports',

    mixins: [NavbarMixins],
    componentDidMount: function componentDidMount() {
        this.sizeNavbars(this.refs.navbar.getDOMNode());
    },
    render: function render() {
        return React.createElement(
            'div',
            { className: 'navbar', ref: 'navbar' },
            React.createElement(
                'div',
                { className: 'navbar-inner' },
                React.createElement(
                    BackButton,
                    { goBack: this.props.goBack },
                    'Back'
                ),
                this.props.children
            )
        );
    }
});

},{"../../mixins":114,"./BackButton":163,"react":undefined}],165:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        var divCN = cn({
            "right": this.props.right,
            "left": this.props.left
        });
        var aCN = cn("link", {
            "icon-only": this.props.iconOnly
        });
        if (this.props.icon) {
            var obj = { "icon": true };
            obj[this.props.icon] = true;
            var iCN = cn(obj);
            return React.createElement(
                'div',
                { className: divCN },
                React.createElement(
                    'a',
                    { href: '#', className: aCN, onClick: this.props.onTap },
                    React.createElement('i', { className: iCN }),
                    this.props.children
                )
            );
        } else {
            return React.createElement(
                'div',
                { className: divCN },
                React.createElement(
                    'a',
                    { href: '#', className: aCN, onClick: this.props.onTap },
                    this.props.children
                )
            );
        }
    }
});

},{"classnames":52,"react":undefined}],166:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "center sliding" },
            this.props.children
        );
    }
});

},{"react":undefined}],167:[function(require,module,exports){
"use strict";

var React = require('react');

module.exports = React.createClass({
    displayName: "exports",

    render: function render() {
        return React.createElement(
            "div",
            { className: "subnavbar sliding" },
            this.props.children
        );
    }
});

},{"react":undefined}],168:[function(require,module,exports){
'use strict';

var React = require('react');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;
var cn = require('classnames');

module.exports = React.createClass({
	displayName: 'exports',

	getDefaultProps: function getDefaultProps() {
		return {
			visible: false
		};
	},
	render: function render() {
		var className = cn("panel", {
			"panel-left": this.props.type === "left",
			"panel-right": this.props.type === "right",
			"layout-dark": true
		});
		var transition = this.props.type === "left" ? "panelLeft" : "panelRight";
		return React.createElement(
			'div',
			null,
			this.props.visible && React.createElement('div', { className: 'panel-overlay', onClick: app.hidePanel }),
			React.createElement(
				ReactCSSTransitionGroup,
				{ transitionName: transition },
				this.props.visible && React.createElement(
					'div',
					{ className: className },
					this.props.children
				)
			)
		);
	}
});

},{"classnames":52,"react":undefined}],169:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        var className = cn("toolbar", {
            "tabbar": this.props.tabbar,
            "tabbar-labels": this.props.labels
        });
        return React.createElement(
            'div',
            { className: className },
            React.createElement(
                'div',
                { className: 'toolbar-inner' },
                this.props.children
            )
        );
    }
});

},{"classnames":52,"react":undefined}],170:[function(require,module,exports){
'use strict';

var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    displayName: 'exports',

    render: function render() {
        var className = cn("tab-link", {
            "active": this.props.active
        });
        return React.createElement(
            'a',
            { className: className, onClick: this.props.onTap },
            React.createElement(
                'i',
                { className: "icon " + this.props.icon },
                this.props.badge
            ),
            React.createElement(
                'span',
                { className: 'tabbar-label' },
                this.props.children
            )
        );
    }
});

},{"classnames":52,"react":undefined}],171:[function(require,module,exports){
'use strict';

var React = require('react');
var Minxins = require('../mixins');
var Swiper = Minxins.Swiper;

var Welcomescreen = function Welcomescreen(slides, options) {
	var p = this,
	    container,
	    swiper,
	    swiperContainer,
	    defaults = {
		closeButton: true, // enabled/disable close button
		closeButtonText: 'Skip', // close button text
		cssClass: '', // additional class on container
		pagination: true, // swiper pagination
		loop: false, // swiper loop
		open: true // open welcome screen on init
	};

	options = options || {};
	for (var def in defaults) {
		if (typeof options[def] === 'undefined') {
			options[def] = defaults[def];
		}
	}

	p.open = function () {
		var html = '';
		html += '<div class="welcomescreen-container ' + (options.cssClass || '') + '">';
		options.closeButton && (html += '<div class="welcomescreen-closebtn close-welcomescreen">' + options.closeButtonText + '</div>');
		html += '<div class="welcomescreen-swiper swiper-container">';
		html += '<div class="swiper-wrapper">';
		for (var i in slides) {
			var item = slides[i];
			html += '<div class="swiper-slide" ' + (item.id ? 'id="' + item.id + '"' : '') + '>';
			item.content && (html += '<div class="welcomescreen-content">' + item.content + '</div>');
			item.picture && (html += '<div class="welcomescreen-picture">' + item.picture + '</div>');
			item.text && (html += '<div class="welcomescreen-text">' + item.text + '</div>');
			html += '</div>';
		}
		html += '</div>';
		options.pagination && (html += '<div class="welcomescreen-pagination swiper-pagination"></div>');
		html += '</div></div>';

		container = $(html);
		swiperContainer = container.find('.swiper-container');

		if (options.bgcolor) {
			container.css({
				'background-color': options.bgcolor,
				'color': options.fontcolor
			});
		}

		$('body').append(container);

		swiper = Swiper.swiper('.swiper-container', {
			direction: 'horizontal',
			loop: options.loop,
			pagination: options.pagination ? swiperContainer.find('.swiper-pagination') : undefined
		});

		container[0].f7Welcomescreen = p;
		if (typeof options.onOpened === 'function') {
			options.onOpened();
		}

		$(document).on('click', '.close-welcomescreen', function (e) {
			e.preventDefault();
			var $wscreen = $(this).parents('.welcomescreen-container');
			if ($wscreen.length > 0 && $wscreen[0].f7Welcomescreen) {
				$wscreen[0].f7Welcomescreen.close();
			}
		});
	};
	p.close = function () {
		swiper && swiper.destroy(true);
		container && container.remove();
		container = swiperContainer = swiper = undefined;
		if (typeof options.onClosed === 'function') {
			options.onClosed();
		}
	};
	p.next = function () {
		swiper && swiper.slideNext();
	};
	p.previous = function () {
		swiper && swiper.slidePrev();
	};
	p.slideTo = function (index) {
		swiper && swiper.slideTo(index);
	};

	return p;
};

module.exports = function (slides, options) {
	var p = new Welcomescreen(slides, options);
	p.open();
	return p;
};

},{"../mixins":114,"react":undefined}],172:[function(require,module,exports){
'use strict';

module.exports = {
	WelcomeScreen: require('./WelcomeScreen')
};

},{"./WelcomeScreen":171}]},{},[1]);
