module.exports = function(app) {
/*===============================================================================
************   Handle clicks and make them fast (on tap);   ************
===============================================================================*/
app.initClickEvents = function () {
    function handleClicks(e) {
        /*jshint validthis:true */
        var clicked = $(this);

        // Close Modal
        if (clicked.hasClass('modal-overlay')) {
            if ($('.modal.modal-in').length > 0 && app.params.modalCloseByOutside)
                app.closeModal('.modal.modal-in');
            if ($('.actions-modal.modal-in').length > 0 && app.params.actionsCloseByOutside)
                app.closeModal('.actions-modal.modal-in');

            if ($('.popover.modal-in').length > 0) app.closeModal('.popover.modal-in');
        }
        if (clicked.hasClass('popup-overlay')) {
            if ($('.popup.modal-in').length > 0 && app.params.popupCloseByOutside)
                app.closeModal('.popup.modal-in');
        }
        if (clicked.hasClass('picker-modal-overlay')) {
            if ($('.picker-modal.modal-in').length > 0)
                app.closeModal('.picker-modal.modal-in');
        }
        
        // Picker
        if (clicked.hasClass('close-picker')) {
            var pickerToClose = $('.picker-modal.modal-in');
            if (pickerToClose.length > 0) {
                app.closeModal(pickerToClose);
            }
            else {
                pickerToClose = $('.popover.modal-in .picker-modal');
                if (pickerToClose.length > 0) {
                    app.closeModal(pickerToClose.parents('.popover'));
                }
            }
        }
        
        // Close Panel
        if (clicked.hasClass('close-panel')) {
            app.closePanel();
        }

        if (clicked.hasClass('panel-overlay') && app.params.panelsCloseByOutside) {
            app.closePanel();
        }
        
        // Popup
        var popup;
        if (clicked.hasClass('close-popup')) {
            app.closeModal('.popup.modal-in');
        }
        
        // Popover
        if (clicked.hasClass('close-popover')) {
            app.closeModal('.popover.modal-in');
        }
    }
    $(document).on('click', '.modal-overlay, .popup-overlay, .picker-modal-overlay, .close-picker, .close-panel, .panel-overlay, .close-popup, .close-popover', handleClicks);

    // Prevent scrolling on overlays
    function preventScrolling(e) {
        e.preventDefault();
    }
    if (app.support.touch && !app.device.android) {
        $(document).on((app.params.fastClicks ? 'touchstart' : 'touchmove'), '.panel-overlay, .modal-overlay, .preloader-indicator-overlay, .popup-overlay, .searchbar-overlay', preventScrolling);
    }
};
return app;
};