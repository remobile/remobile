var React = require('react');
var UI = require('UI');

var View = UI.View;
var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Button = UI.Button.Button;
var ButtonsRow = UI.Button.ButtonsRow;
var Form = UI.Form;

var TAB_ID_PREFIX = 'tab_'

var Tab1 = React.createClass({
	render() {
		return (
			<View.PageContent subnavbar tab={TAB_ID_PREFIX+1} active>
				<Content.ContentBlock>
		        <p>This is tab 1 content</p>
		        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque elementum mi quis felis scelerisque faucibus. Aliquam ut commodo justo. Mauris vitae pharetra arcu. Sed tincidunt dui et nibh auctor pretium. Nam accumsan fermentum sem. Suspendisse potenti. Nulla sed orci malesuada, pellentesque elit vitae, cursus lorem. Praesent et vehicula sapien, ut rhoncus quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. In vitae mi nec lorem aliquet venenatis quis nec nibh. Aenean sit amet leo ligula. Fusce in massa et nisl dictum ultricies et vitae dui. Sed sagittis quis diam sed lobortis. Donec in massa pharetra, tristique purus vitae, consequat mauris. Aliquam tellus ante, pharetra in mattis ut, dictum quis erat.</p>
		        <p>Ut ac lobortis lacus, non pellentesque arcu. Quisque sodales sapien malesuada, condimentum nunc at, viverra lacus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus eu pulvinar turpis, id tristique quam. Aenean venenatis molestie diam, sit amet condimentum nisl pretium id. Donec diam tortor, mollis in vehicula id, vehicula consectetur nulla. Quisque posuere rutrum mauris, eu rutrum turpis blandit at. Proin volutpat tortor sit amet metus porttitor accumsan. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut dapibus posuere dictum.</p>
		      </Content.ContentBlock>
	      </View.PageContent>
		);
	}
});

var Tab2 = React.createClass({
	render() {
		return (
			<View.PageContent subnavbar tab={TAB_ID_PREFIX+2} >
				<Content.ContentBlock>
		        <p>This is tab 2 content</p>
		        <p>Ut ac lobortis lacus, non pellentesque arcu. Quisque sodales sapien malesuada, condimentum nunc at, viverra lacus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Vivamus eu pulvinar turpis, id tristique quam. Aenean venenatis molestie diam, sit amet condimentum nisl pretium id. Donec diam tortor, mollis in vehicula id, vehicula consectetur nulla. Quisque posuere rutrum mauris, eu rutrum turpis blandit at. Proin volutpat tortor sit amet metus porttitor accumsan. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Ut dapibus posuere dictum.</p>
		        <p>Fusce luctus turpis nunc, id porta orci blandit eget. Aenean sodales quam nec diam varius, in ornare ipsum condimentum. Aenean eleifend, nulla sit amet volutpat adipiscing, ligula nulla pharetra risus, vitae consequat leo tortor eu nunc. Vivamus at fringilla metus. Duis neque lectus, sagittis in volutpat a, pretium vel turpis. Nam accumsan auctor libero, quis sodales felis faucibus quis. Etiam vestibulum sed nisl vel aliquet. Aliquam pellentesque leo a lacus ultricies scelerisque. Vestibulum vestibulum fermentum tincidunt. Proin eleifend metus non quam pretium, eu vehicula ipsum egestas. Nam eget nibh enim. Etiam sem leo, pellentesque a elit vel, egestas rhoncus enim. Morbi ultricies adipiscing tortor, vitae condimentum lacus hendrerit nec. Phasellus laoreet leo quis purus elementum, ut fringilla justo eleifend. Nunc ultricies a sapien vitae auctor. Aliquam id erat elementum, laoreet est et, dapibus ligula.</p>
		      </Content.ContentBlock>
	      </View.PageContent>
		);
	}
});

var Tab3 = React.createClass({
	render() {
		return (
			<View.PageContent subnavbar tab={TAB_ID_PREFIX+3} >
				<Content.ContentBlock>
		        <p>This is tab 3 content</p>
		        <p>Nulla gravida libero eget lobortis iaculis. In sed elit eu nibh adipiscing faucibus. Sed ac accumsan lacus. In ut diam quis turpis fringilla volutpat. In ultrices dignissim consequat. Cras pretium tortor et lorem condimentum posuere. Nulla facilisi. Suspendisse pretium egestas lacus ac laoreet. Mauris rhoncus quis ipsum quis tristique. Vivamus ultricies urna quis nunc egestas, in euismod turpis fringilla. Nam tellus massa, vehicula eu sapien non, dapibus tempor lorem. Fusce placerat orci arcu, eu dignissim enim porttitor vel. Nullam porttitor vel dolor sed feugiat. Suspendisse potenti. Maecenas ac mattis odio. Sed vel ultricies lacus, sed posuere libero.</p>
		        <p>Nulla gravida libero eget lobortis iaculis. In sed elit eu nibh adipiscing faucibus. Sed ac accumsan lacus. In ut diam quis turpis fringilla volutpat. In ultrices dignissim consequat. Cras pretium tortor et lorem condimentum posuere. Nulla facilisi. Suspendisse pretium egestas lacus ac laoreet. Mauris rhoncus quis ipsum quis tristique. Vivamus ultricies urna quis nunc egestas, in euismod turpis fringilla. Nam tellus massa, vehicula eu sapien non, dapibus tempor lorem. Fusce placerat orci arcu, eu dignissim enim porttitor vel. Nullam porttitor vel dolor sed feugiat. Suspendisse potenti. Maecenas ac mattis odio. Sed vel ultricies lacus, sed posuere libero.</p>
		      </Content.ContentBlock>
	      </View.PageContent>
		);
	}
});

module.exports.navbar = React.createClass({
    switchTab(tab, e) {
        app.showTab('#'+TAB_ID_PREFIX+tab, e.target);
        e.preventDefault();
    },
    render() {
        return (
			<View.Navbar title="Animated Tabs">
				<View.SubNavbar>
					<ButtonsRow>
						<Button tab={'#'+TAB_ID_PREFIX+1} active onTap={this.switchTab.bind(this, 1)}>Tab 1</Button>
						<Button tab={'#'+TAB_ID_PREFIX+2} onTap={this.switchTab.bind(this, 2)}>Tab 2</Button>
						<Button tab={'#'+TAB_ID_PREFIX+3} onTap={this.switchTab.bind(this, 3)}>Tab 3</Button>
					</ButtonsRow>
				</View.SubNavbar>
			</View.Navbar>
        )
    }
});

module.exports.page = React.createClass({
    render() {
        return (
			<View.Page>
				<div className="tabs-animated-wrap">
	                <div className="tabs">
						<Tab1 />
		                <Tab2 />
		                <Tab3 />
	                </div>
                </div>
            </View.Page>
        );
    }
});
