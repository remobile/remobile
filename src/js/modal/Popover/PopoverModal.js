var React = require('react');

module.exports = React.createClass({
		sizePopover: function(modal, modalAngle, target) {
        modal.css({left: '', top: ''});
        var modalWidth =  modal.width();
        var modalHeight =  modal.height(); // 13 - height of angle
        var modalAngle, modalAngleSize = 0, modalAngleLeft, modalAngleTop;
  
        modalAngleSize = modalAngle.width() / 2;
        modalAngle.removeClass('on-left on-right on-top on-bottom').css({left: '', top: ''});
   
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
        if ((modalHeight + modalAngleSize) < targetOffset.top) {
            // On top
            modalTop = targetOffset.top - modalHeight - modalAngleSize;
        } else if ((modalHeight + modalAngleSize) < windowHeight - targetOffset.top - targetHeight) {
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
            modalAngleLeft = (modalWidth / 2 - modalAngleSize + diff);
            modalAngleLeft = Math.max(Math.min(modalAngleLeft, modalWidth - modalAngleSize * 2 - 6), 6);
            modalAngle.css({left: modalAngleLeft + 'px'});

        } else if (modalPosition === 'middle') {
            modalLeft = targetOffset.left - modalWidth - modalAngleSize;
            modalAngle.addClass('on-right');
            if (modalLeft < 5 || (modalLeft + modalWidth > windowWidth)) {
                if (modalLeft < 5) modalLeft = targetOffset.left + targetWidth + modalAngleSize;
                if (modalLeft + modalWidth > windowWidth) modalLeft = windowWidth - modalWidth - 5;
                modalAngle.removeClass('on-right').addClass('on-left');
            }
            modalAngleTop = (modalHeight / 2 - modalAngleSize + diff);
            modalAngleTop = Math.max(Math.min(modalAngleTop, modalHeight - modalAngleSize * 2 - 6), 6);
            modalAngle.css({top: modalAngleTop + 'px'});
        }
        // Apply Styles
        modal.css({top: modalTop + 'px', left: modalLeft + 'px'});
    },
    componentDidMount: function() {
    		var modal = $(this.refs.modal.getDOMNode());
    		var modalAngle = $(this.refs.modalAngle.getDOMNode());
    		var target = $(this.props.target);
    		this.sizePopover(modal, modalAngle, target);
    },
    render: function() {
         return (
             <div ref="modal" className="popover popover-menu" onClick={app.hideModal}>
                <div ref="modalAngle" className="popover-angle"></div>
                <div className="popover-inner">
                	{this.props.children}
                </div>
             </div>
         );
    }
});
