var xtend = require('xtend/mutable');
var React = require('react/addons');
var system = require('../system');

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


function App (views) {
    console.log(system);
	return {
        device: system.Device,
        support: system.Support,
        touchEvents: {
            start: system.Support.touch ? 'touchstart' : 'mousedown',
            move: system.Support.touch ? 'touchmove' : 'mousemove',
            end: system.Support.touch ? 'touchend' : 'mouseup'
        },
		componentWillMount: function () {
			window.app = this;
			this.history = [];
			this.data = {};
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
			return xtend({
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
		showView: function (viewId, transition, param) {
			var trans = VIEW_TRANSITIONS[transition];
			this.history.push({id:this.state.currentView, transition:transition});
			this.displayView(viewId, trans? trans.go: 'none', param);
		},
		goBack: function(step, param) {
			if (step === undefined) {
				step = 1;
			}
			var obj;
			for (var i=0; i<step; i++) {
					var t = this.history.pop();
					t && (obj = t);
			}
			if (obj) {
				var trans = VIEW_TRANSITIONS[obj.transition];
				this.displayView(obj.id, trans? trans.back: 'none', param);
			}
		}
	};
}

module.exports = App;
