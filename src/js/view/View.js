var React = require('react');
var cn = require('classnames');
//var LifeCycle = require('@remobile/react-lifecycle');

module.exports.iosView = React.createClass({
	// mixins: [LifeCycle('window', 1)],
	getInitialState: function() {
		this.mainPage = this.getPage(this.props.mainPage, this.props.mainPageParams);
		return {
			num: this.props.num,
			toolbar: this.mainPage.toolbar,
		};
	},
	componentWillMount() {
		app.view = this;
		this.pageIndex = 0;
	},
	componentDidMount() {
		this.refs['page0'].toolbar = this.mainPage.toolbar;
	},
	showPageAnimate() {
		var pageIndex = this.pageIndex;
		if (!pageIndex)return;
		var newPage = $(this.refs['page'+pageIndex].getDOMNode());
		var oldPage = $(this.refs['page'+(pageIndex-1)].getDOMNode());
		var newNavbarInner = $(this.refs['navbar'+pageIndex].getDOMNode());
		var oldNavbarInner = $(this.refs['navbar'+(pageIndex-1)].getDOMNode());
		app.sizeNavbars($(this.getDOMNode()));
		app.showViewEnterAnimate({oldPage, newPage, oldNavbarInner, newNavbarInner, dynamicNavbar:true});
	},
	showPage(page, params) {
		this.pageIndex++;
		var p = this.getPage(page, params);
		var nel = this.refs['navbar'+this.pageIndex].getDOMNode();
		$(nel).css('display', 'block');
		React.render(p.navbar, nel, ()=>{
			var node = this.refs['page'+this.pageIndex];
			node.toolbar = p.toolbar;
			var el = node.getDOMNode();
			$(el).css('display', 'block');
			React.render(p.pageContent, el, ()=>{
				this.showPageAnimate();
			});
		});
		if (this.pageIndex>=this.props.num-1) {
			this.setState({num: this.state.num+1, toolbar:p.toolbar});
		} else {
			this.setState({toolbar:p.toolbar});
		}
	},
	goBack() {
		var pageIndex = this.pageIndex;
		if (!pageIndex)return;
		var node = this.refs['page'+(pageIndex-1)];
		var oldPage = $(this.refs['page'+pageIndex].getDOMNode());
		var newPage = $(node.getDOMNode());
		var oldNavbarInner = $(this.refs['navbar'+pageIndex].getDOMNode());
		var newNavbarInner = $(this.refs['navbar'+(pageIndex-1)].getDOMNode());

		this.setState({toolbar:node.toolbar});
		app.showViewExitAnimate({oldPage, newPage, oldNavbarInner, newNavbarInner, dynamicNavbar:true, callback:()=>{
			oldPage.css('display', 'none');
			oldNavbarInner.css('display', 'none');
			if (this.pageIndex>=this.props.num-1) {
				this.setState({num: this.state.num-1});
			}
			this.pageIndex--;
		}});
	},
	getPage(page, params) {
		params = params||{};
		var navbar = page.navbar?
		<page.navbar params={params}/>
		:null,
		toolbar = page.toolbar?
		<page.toolbar params={params}/>
		:null,
		pageContent =
		<page.page params={params}/>
		;

		return {navbar, toolbar, pageContent}
	},
	render() {
		var co = {
			'pages': true,
			'navbar-through': true,
			'tabbar-labels-fixed': !!this.state.toolbar,
		};
		var list = ((n)=>{for(var i=0,a=[];i<n;i++)a.push(i);return a})(this.state.num);
		var mainPage = this.mainPage;
		return (
			<div className='view'>
				<div className='navbar'>
					{list.map((i)=>{
						return (
							<div
								key={i}
								className={"navbar-inner "+(i===0?'navbar-on-center':'navbar-on-left')}
								ref={"navbar"+i}
								style={{display:(i===0)?'block':'none'}}>
								{(i===0)&& mainPage.navbar}

							</div>
						)
					})}
				</div>
				{this.state.toolbar}
				<div className={cn(co)}>
					{list.map((i)=>{
						return (
							<div
								key={i}
								className="page"
								ref={"page"+i}
								style={{display:(i===0)?'block':'none'}}>
								{(i===0)&& mainPage.pageContent}

							</div>
						)
					})}
				</div>
			</div>
		);
	}
});

var Page = React.createClass({
	componentDidMount() {
		if (app.params.material) {
			app.initPageMaterialTabbar(this.getDOMNode());
		}
	},
	render() {
		return (
			<div className="page">
				<div className='navbar'>
					{this.props.navbar}
				</div>
				{this.props.toolbar}
				{this.props.pageContent}
			</div>
		);
	}
});

module.exports.materialView = React.createClass({
	// mixins: [LifeCycle('window', 1)],
	getInitialState: function() {
		return {
			num: this.props.num
		};
	},
	componentWillMount() {
		app.view = this;
		this.pageIndex = 0;
	},
	showPageAnimate() {
		var pageIndex = this.pageIndex;
		if (!pageIndex)return;
		var newPage = $(this.refs['page'+pageIndex].getDOMNode()).children('.page');
		var oldPage = $(this.refs['page'+(pageIndex-1)].getDOMNode()).children('.page');
		var oldNavbarInner = oldPage.children('.navbar').children('.navbar-inner');
		var newNavbarInner = newPage.children('.navbar').children('.navbar-inner');
		app.showViewEnterAnimate({oldPage, newPage, oldNavbarInner, newNavbarInner, dynamicNavbar:!app.params.material});
	},
	showPage(page, params) {
		this.pageIndex++;
		var el = this.refs['page'+this.pageIndex].getDOMNode();
		$(el).css('display', 'block');
		React.render(this.getPageElement(page, params), el, ()=>{
			this.showPageAnimate();
		});
		if (this.pageIndex>=this.props.num-1) {
			this.setState({num: this.state.num+1});
		}
	},
	goBack() {
		var pageIndex = this.pageIndex;
		if (!pageIndex)return;
		var el = $(this.refs['page'+pageIndex].getDOMNode());
		var oldPage = el.children('.page');
		var newPage = $(this.refs['page'+(pageIndex-1)].getDOMNode()).children('.page');
		var newNavbarInner = oldPage.children('.navbar').children('.navbar-inner');
		var oldNavbarInner = newPage.children('.navbar').children('.navbar-inner');

		app.showViewExitAnimate({oldPage, newPage, oldNavbarInner, newNavbarInner, dynamicNavbar:!app.params.material, callback:()=>{
			el.css('display', 'none');
			if (this.pageIndex>=this.props.num-1) {
				this.setState({num: this.state.num-1});
			}
			this.pageIndex--;
		}});
	},
	getPageElement(page, params) {
		params = params||{};
		var navbar = page.navbar?<page.navbar params={params}/>:null,
			toolbar = page.toolbar?<page.toolbar params={params}/>:null,
			pageContent = <page.page params={params}/>;

		return (
			<Page {... {navbar, toolbar, pageContent}} />
		)
	},
	render() {
		var co = {
			'pages': true,
			'navbar-fixed': true,
		};
		return (
			<div className="view">
				<div className={cn(co)}>
					{((n)=>{for(var i=0,a=[];i<n;i++)a.push(i);return a})(this.state.num).map((i)=>{
						return (
							<div
								key={i}
								ref={"page"+i}
								style={{display:(i===0)?'block':'none'}}>
								{(i===0)&& this.getPageElement(this.props.mainPage, this.props.mainPageParams)}
							</div>
						)
					})}
				</div>
			</div>
		);
	}
});
