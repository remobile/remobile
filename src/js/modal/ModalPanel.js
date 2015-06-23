var React = require('react');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var ModalOverlay = require('./Overlay/ModalOverlay');
var PreloaderIndicatorOverlay = require('./Overlay/PreloaderIndicatorOverlay');
var IndicatorModal = require('./Preloader/IndicatorModal');

module.exports = React.createClass({
    getDefaultProps: function() {
        return {
            visible: false
        }
    },
    getTransition: function(type) {
    	switch (type) {
    		case 'actionsModal':
    			return {name:'actionsModal', enter:true, leave:true, onTap:app.hideModal};
    		case 'modal':
    			return {name:'modal', enter:true, leave:true};
    		case 'popoverModal':
    			return {name:'popoverModal', enter:false, leave:true, onTap:app.hideModal};
    		case 'pickerModal':
    			return {name:'pickerModal', enter:false, leave:true, onTap:app.hideModal};
    		default:
    			return {name:'unknown', enter:false, leave:false};
    	}
    },
    render: function() {
    		var type = this.props.type;
        if (type === 'indicator') {
            return (
                this.props.visible&& <div>
                    <PreloaderIndicatorOverlay/>
                    <IndicatorModal />
                </div>
            )
        } else {
        		var trans = this.getTransition(type);
            return (
                <div>
                    <ReactCSSTransitionGroup transitionName="modalOverlay">
                        {this.props.visible&&<ModalOverlay onTap={trans.onTap}/>}
                    </ReactCSSTransitionGroup>
                    <ReactCSSTransitionGroup transitionName={trans.name} transitionEnter={trans.enter} transitionLeave={trans.leave}>
                        {this.props.visible&&this.props.children}
                    </ReactCSSTransitionGroup>
                </div>
            )
        }
    }
});
