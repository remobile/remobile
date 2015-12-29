var React = require('react');
var UI = require('UI');

var View = UI.View;
var Picker = UI.Picker;
var Content = UI.Content;
var List = UI.List;
var Badge = UI.Badge.Badge;
var ActionsModal = UI.Modal.ActionsModal;

var calendarDefaultModal = (
    <ActionsModal>
    	<UI.Calendar.Calendar />
		</ActionsModal>
);
function showCalendarDefault() {
	app.showModal('pickerModal', calendarDefaultModal);
}

var calendarMultipletModal = (
    <ActionsModal>
    	<UI.Calendar.Calendar params={{multiple:true}} />
		</ActionsModal>
);
function showCalendarMultiple() {
	app.showModal('pickerModal', calendarMultipletModal);
}

var calendarRangeModal = (
    <ActionsModal>
    	<UI.Calendar.Calendar params={{rangePicker:true}} />
		</ActionsModal>
);
function showCalendarRange() {
    app.showModal('pickerModal', calendarRangeModal);
}

var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August' , 'September' , 'October', 'November', 'December'];
var params = {
    value: [new Date()],
    weekHeader: false,
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
    onOpen: function (p) {
        p.container.find('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] +', ' + p.currentYear);
        p.container.find('.calendar-custom-toolbar .left .link').on('click', function () {
            p.prevMonth();
        });
        p.container.find('.calendar-custom-toolbar .right .link').on('click', function () {
            p.nextMonth();
        });
    },
    onMonthYearChangeStart: function (p) {
        p.container.find('.calendar-custom-toolbar .center').text(monthNames[p.currentMonth] +', ' + p.currentYear);
    }
};

module.exports = React.createClass({
	render: function() {
		return (
			<View.Page title="Calendar">
				<View.PageContent>
					<Content.ContentBlock>
		        <p>Calendar is a touch optimized component that provides an easy way to handle dates.</p>
        		<p>Calendar could be used as inline component or as overlay. Overlay Calendar will be automatically converted to Popover on tablets (iPad).</p>
		      </Content.ContentBlock>

					<Content.ContentBlockTitle>Your birth date</Content.ContentBlockTitle>
					<List.List>
						<List.ItemContent>
							<List.ItemInner>
								 <List.ItemInput><input type="text" placeholder="Your birth date" readonly="readonly"  onClick={showCalendarDefault}/></List.ItemInput>
							</List.ItemInner>
						</List.ItemContent>
					</List.List>


					<Content.ContentBlockTitle>Multiple Values</Content.ContentBlockTitle>
					<List.List>
						<List.ItemContent>
							<List.ItemInner>
								<List.ItemInput><input type="text" placeholder="Select multiple dates" readonly="readonly" onClick={showCalendarMultiple}/></List.ItemInput>
							</List.ItemInner>
						</List.ItemContent>
					</List.List>

                    <Content.ContentBlockTitle>Range Picker<Badge color="green">NEW</Badge></Content.ContentBlockTitle>
					<List.List>
						<List.ItemContent>
							<List.ItemInner>
								<List.ItemInput><input type="text" placeholder="elect date range" readonly="readonly" onClick={showCalendarRange}/></List.ItemInput>
							</List.ItemInner>
						</List.ItemContent>
					</List.List>

					<Content.ContentBlockTitle>Inline with custom toolbar</Content.ContentBlockTitle>
						<Content.ContentBlock>
							<Content.ContentBlockInner style={{padding:'0', marginRight:'-15px', width:'auto'}}>
									<UI.Calendar.Calendar params={params} inline/>
							</Content.ContentBlockInner>
						</Content.ContentBlock>
				</View.PageContent>
       </View.Page>
		);
	}
});
