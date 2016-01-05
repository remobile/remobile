/*jslint browser: true*/
/*global console, Framework7, alert, Dom7*/

/**
 * A plugin for Framework7 to show black little toasts
 *
 * @author www.timo-ernst.net
 * @license MIT
 */
module.exports = function(app) {
    var Toast = function (text, icon) {
        function hideBox($curbox) {
            if ($curbox) {
                $curbox.removeClass('fadein').transitionEnd(function () {
                    $curbox.remove();
                });
            }
        }
        this.show = function (show) {
            if (show) {
                $('.toast-container').off('click').off('transitionEnd').remove();
                var container = $('<div class="toast-container show">');
                var html = '<span class="toast-msg">';
                icon && (html += '<i class="icon '+icon+'"></i>');
                text && (html += text);
                html += '</span>';
                container.html(html);
                $('body').append(container);

                var offsetWidth = container.find('.toast-msg')[0].offsetWidth;
                container.css({
                    'margin-left': (-offsetWidth/2)+'px'
                });

                container.click(function () {
                    hideBox(container);
                });
                container.addClass('fadein');
                setTimeout(function () {
                    hideBox(container);
                }, 1500);
            } else {
                hideBox(container);
            }
        };
        return this;
    };
    app.toast = function (text, icon) {
        return new Toast(text, icon).show(true);;
    };
};
