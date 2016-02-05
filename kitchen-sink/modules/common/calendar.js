var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var List = UI.List;
var Badge = UI.Badge.Badge;

module.exports.navbar = React.createClass({
    render() {
        return (
            <View.Navbar title="Calendar" />
        )
    }
});

module.exports.page = React.createClass({
	componentDidMount() {
    // Default
    var calendarDefault = app.calendar({
        input: '#ks-calendar-default',
    });
    // With custom date format
    var calendarDateFormat = app.calendar({
        input: '#ks-calendar-date-format',
        dateFormat: 'DD, MM dd, yyyy'
    });
    // With multiple values
    var calendarMultiple = app.calendar({
        input: '#ks-calendar-multiple',
        dateFormat: 'M dd yyyy',
        multiple: true
    });
    // Range Picker
    var calendarRange = app.calendar({
        input: '#ks-calendar-range',
        dateFormat: 'M dd yyyy',
        rangePicker: true
    });
    // Inline with custom toolbar
    var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August' , 'September' , 'October', 'November', 'December'];
    var calendarInline = app.calendar({
        container: '#ks-calendar-inline-container',
        value: [new Date()],
        weekHeader: false,
        header: false,
        footer: false,
        toolbarTemplate:
            '<div class="toolbar calendar-custom-toolbar">' +
                '<div class="toolbar-inner">' +
                    '<div class="left">' +
                        '<a href="#" class="link icon-only"><i class="icon icon-back"></i></a>' +
                    '</div>' +
                    '<div class="center"></div>' +
                    '<div class="right">' +
                        '<a href="#" class="link icon-only"><i class="icon icon-forward"></i></a>' +
                    '</div>' +
                '</div>' +
            '</div>',
        onOpen(p) {
            $('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] +', ' + p.currentYear);
            $('.calendar-custom-toolbar .left .link').on('click', function () {
                calendarInline.prevMonth();
            });
            $('.calendar-custom-toolbar .right .link').on('click', function () {
                calendarInline.nextMonth();
            });
        },
        onMonthYearChangeStart(p) {
            $('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] +', ' + p.currentYear);
        }
    });
	},
	render() {
		return (
			<View.PageContent>
				<Content.ContentBlock>
					<p>
						Calendar is a touch optimized component that provides an easy way to handle dates.
					</p>
					<p>
						Calendar could be used as inline component or as overlay. Overlay Calendar will be automatically converted to Popover on tablets (iPad).
					</p>
				</Content.ContentBlock>
				<Content.ContentBlockTitle>
					Default setup
				</Content.ContentBlockTitle>
				<List.List>
					<List.ItemContent>
						<List.ItemInner>
							<List.ItemInput>
								<input
									type="text"
									placeholder="Your birth date"
									readonly="readonly"
									id="ks-calendar-default"/>
							</List.ItemInput>
						</List.ItemInner>
					</List.ItemContent>
				</List.List>
				<Content.ContentBlockTitle>
					Custom date format
				</Content.ContentBlockTitle>
				<List.List>
					<List.ItemContent>
						<List.ItemInner>
							<List.ItemInput>
								<input
									type="text"
									placeholder="Select multiple dates"
									readonly="readonly"
									id="ks-calendar-date-format"/>
							</List.ItemInput>
						</List.ItemInner>
					</List.ItemContent>
				</List.List>
				<Content.ContentBlockTitle>
					Multiple Values
				</Content.ContentBlockTitle>
				<List.List>
					<List.ItemContent>
						<List.ItemInner>
							<List.ItemInput>
								<input
									type="text"
									placeholder="Select multiple dates"
									readonly="readonly"
									id="ks-calendar-multiple"/>
							</List.ItemInput>
						</List.ItemInner>
					</List.ItemContent>
				</List.List>
				<Content.ContentBlockTitle>
					Range Picker
					<Badge color="green">NEW</Badge>
				</Content.ContentBlockTitle>
				<List.List>
					<List.ItemContent>
						<List.ItemInner>
							<List.ItemInput>
								<input
									type="text"
									placeholder="elect date range"
									readonly="readonly"
									id="ks-calendar-range"/>
							</List.ItemInput>
						</List.ItemInner>
					</List.ItemContent>
				</List.List>
				<Content.ContentBlockTitle>
					Inline with custom toolbar
				</Content.ContentBlockTitle>
				<Content.ContentBlock>
					<Content.ContentBlockInner style={{padding:'0', marginRight:'-15px', width:'auto'}}>
						<div id="ks-calendar-inline-container">
						</div>
					</Content.ContentBlockInner>
				</Content.ContentBlock>
			</View.PageContent>
		);
	}
});
