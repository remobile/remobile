var React = require('react');
var cn = require('classnames');
var NavbarTitle = require('./navbar/NavbarTitle');
var Navbar = require('./navbar/Navbar');
var SubNavbar = require('./navbar/SubNavbar');
var BackButton = require('./navbar/BackButton');
var ButtonsRow = require('../button/ButtonsRow');

module.exports = React.createClass({
	getVisibleTitle(title) {
		if (!title)return title;
		var realLength = 0, len = title.length, preLen = -1, charCode = -1, needCut = false;
		for (var i=0; i<len; i++) {
			charCode = title.charCodeAt(i);
			if (charCode >= 0 && charCode <= 128) {
				realLength += 1;
			} else {
				realLength += 2;
			}
			if (preLen===-1 && realLength >= 4) {
				preLen = i+1;
			} else if (realLength > 6) {
				needCut = true;
				break;
			}
		}
		if (needCut) {
			title = title.substr(0, preLen)+'..';
		}
		return title;
	},
	componentWillMount() {
		app.data.currentTitle = this.props.title;
	},
	componentDidMount() {
		var props = this.props;
		var pageContainer = $(this.getDOMNode());
		if (props.initPageScrollToolbars) {
			app.initPageScrollToolbars(pageContainer);
		}
		if (app.params.material) {
			app.initPageMaterialPreloader(pageContainer);
			app.initPageMaterialInputs(pageContainer);
			app.initPageMaterialTabbar(pageContainer);
		}
		if (props.initPageSwiper) {
			app.initPageSwiper(pageContainer);
		}
		if (props.initUpScroller) {
			app.initUpScroller(this.getDOMNode());
		}
	},
	componentWillUnmount() {
		var pageContainer = $(this.getDOMNode());
		if (this.props.initPageScrollToolbars) {
			app.destroyScrollToolbars(pageContainer);
		}
	},
	render() {
		var navbar = false;
		var title = false;
		if (this.props.title) {
			navbar = true;
			title = this.props.title;
		} else if (this.props.navbar) {
			navbar = true;
		}

		var obj = {
			'page': true,
			'navbar-through': navbar,
			'toolbar-through': this.props.toolbar,
			'tabbar-labels-through': this.props.labelsTabbar,
			'navbar-fixed': app.params.material&&this.props.tabs
		};
		var className = cn(obj);

		if (!app.params.material) {
			var backText = this.props.backText;
			if (!backText) {
				backText = app.data.lastTitle;
			}
			backText = this.getVisibleTitle(backText);
		}
		if (!this.props.tabs) {
			return (
				<div
					className={className}
					style={this.props.style}>
					{!!title&&
						<Navbar
							goBack={this.props.goBack}
							backText={backText}>
							<NavbarTitle>
								{title}
							</NavbarTitle>
							{this.props.right}
						</Navbar>
					}
					{this.props.children}

				</div>
			);
		} else {
			var tabs = this.props.tabs;
			var tabsCN = "tabs-"+tabs.type+"-wrap"
			return (
				<div
					className={className}
					style={this.props.style}>
					{!!title&&
						<Navbar
							goBack={this.props.goBack}
							backText={backText}>
							<NavbarTitle>
								{title}
							</NavbarTitle>
							{this.props.right}
						</Navbar>
					}
					{!app.params.material?
						<SubNavbar>
							<ButtonsRow>
								{tabs.buttons}

							</ButtonsRow>
						</SubNavbar>
						:
						<div className="toolbar tabbar">
							<div className="toolbar-inner">
								{tabs.buttons}
							</div>
						</div>
					}
					<div className={tabsCN}>
						<div className="tabs">
							{this.props.children}
						</div>
					</div>
				</div>
			);
		}
	}
});
