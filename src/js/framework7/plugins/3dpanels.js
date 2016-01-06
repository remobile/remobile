module.exports = function (app) {
    'use strict';
    var enabled = false;

    app.panels3d = {
        enable: function () {
            $('body').addClass('panels-3d');
            enabled = true;
        },
        disable: function () {
            $('body').removeClass('panels-3d');
            enabled = false;
        },
    };

    var leftPanelWidth, rightPanelWidth, page;

    function leftPanelOpen() {
        if (!enabled) return;
        page.css({
            '-webkit-transform-origin': '100% center',
            'transform-origin': '100% center',
        });
    }

    function rightPanelOpen() {
        if (!enabled) return;
        page.css({
            '-webkit-transform-origin': '0% center',
            'transform-origin': '0% center',
        });
    }


    app.init3dPanels = function(side) {
        page = $('.page');
        var panel = $('.panel-'+side+'.panel-reveal');
        var callback = side==='left'?leftPanelOpen:rightPanelOpen;
        app.panels3d.enable();
        panel.on('open', callback);

        app.destroy3dPanels = function() {
            app.panels3d.disable();
            panel.off('open', callback);
        }
    };

    app.swipePanelSetTransform = function(viewsContainer, panel, perc) {
        if (!enabled) return;
        panel = $(panel);
        if (!panel.hasClass('panel-reveal')) return;

        if (panel.hasClass('panel-left')) {
            if (!leftPanelWidth) leftPanelWidth = panel[0].offsetWidth;
            page.transform('translate3d(' + (leftPanelWidth * perc) + 'px,0,0) rotateY(' + (-30 * perc) + 'deg)');
            page.css({
                '-webkit-transform-origin': '100% center',
                'transform-origin': '100% center',
            });
            panel.transform('translate3d(' + (-leftPanelWidth * (1 - perc)) + 'px,0,0)');
        }
        if (panel.hasClass('panel-right')) {
            if (!rightPanelWidth) rightPanelWidth = panel[0].offsetWidth;
            page.transform('translate3d(' + (-rightPanelWidth * perc) + 'px,0,0) rotateY(' + (30 * perc) + 'deg)');
            page.css({
                '-webkit-transform-origin': '0% center',
                'transform-origin': '0% center',
            });
            panel.transform('translate3d(' + (rightPanelWidth * (1 - perc)) + 'px,0,0)');
        }
    };
};
