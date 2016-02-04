var React = require('react');
var cn = require('classnames');

var PageContent = require('../PageContent');
var Page = require('../Page');
var NavbarButton = require('../navbar/NavbarButton');

module.exports = React.createClass({
	componentWillUnmount() {
		var params = this.props.params;
		if (params.type === 'panel' && params.is3d) {
			app.destroy3dPanels();
		}
	},
	componentDidMount() {
		var params = this.props.params;
		var type = params.type;
		if (type === 'panel') {
			if (params.is3d) {
				app.initSwipePanels();
				app.init3dPanels(params.side);
			}
			app.openPanel(params.side);
			$(this.refs.panel.getDOMNode()).on('closed', ()=>{
				app.hideCover();
			});
		} else if (type === 'popup') {
			var el = this.getDOMNode();
			app.popup(el);
			$(el).on('closed', ()=>{
				app.hideCover();
			});
		} else if (type === 'picker') {
			var el = this.getDOMNode();
			app.pickerModal(el);
			$(el).on('closed', ()=>{
				app.hideCover();
			});
		} else if (type === 'popover') {
			var el = this.getDOMNode();
			app.popover(el, params.target);
			$(el).on('closed', ()=>{
				app.hideCover();
			});
		} else if (type === 'modal') {
			var el = this.refs.modal.getDOMNode();
			app.openModal(el);
			$(el).on('closed', ()=>{
				app.hideCover();
			});
		}
	},
	renderPanel() {
		var params = this.props.params;
		var obj = {
			"panel": true,
			"panel-left": params.side==="left",
			"panel-right": params.side==="right",
			"panel-reveal": params.is3d,
		};
		if (!params.is3d) {
			var affect = params.affect||'cover';
			obj["panel-"+affect] = true;
			var color = params.color||'dark';
			obj["layout-"+color] = true;
		}
		var className = cn(obj);
		return (
			<div>
				<div className="panel-overlay"></div>
				<div className={className} ref="panel">
					{this.props.children}
				</div>
			</div>
		)
	},
	renderPopup() {
		return (
			<div className="popup">
				<div className="view navbar-fixed">
					<div className="pages">
						<div className="page">
							<div className="navbar">
								<div className="navbar-inner">
									<div className="center">{this.props.params.title||' '}</div>
									<NavbarButton right popup>Done</NavbarButton>
								</div>
							</div>
							<div className="page-content">
								{this.props.children}
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	},
	renderPickerModal() {
		var params = this.props.params;
		var leftButton = this.props.leftButton;
		var rightButton = this.props.rightButton||(
			<a href="#" className="link close-picker">Done</a>
		);
		return (
			<div className="picker-modal">
				<div className="toolbar">
					<div className="toolbar-inner">
						<div className="left">
							{leftButton}
						</div>
						<div className="right">
							{rightButton}
						</div>
					</div>
				</div>
				<div className="picker-modal-inner">
					{this.props.children}
				</div>
			</div>
		)
	},
	renderPopover() {
		var params = this.props.params;
		return (
			<div className="popover popover-menu">
				<div className="popover-angle">
				</div>
				<div className="popover-inner">
					{this.props.children}
				</div>
			</div>
		)
	},
	renderModal() {
		return (
			<div>
				<div className="modal-overlay">
				</div>
				<div className="modal" ref="modal">
					{this.props.children}
				</div>
			</div>
		)
	},
	render() {
		var type = this.props.params.type;
		if (type === 'panel') {
			return this.renderPanel();
		}
		if (type === 'popup') {
			return this.renderPopup();
		}
		if (type === 'picker') {
			return this.renderPickerModal();
		}
		if (type === 'popover') {
			return this.renderPopover();
		}
		if (type === 'modal') {
			return this.renderModal();
		}
		return null;
	}
});
