var React = require('react');

var Welcomescreen = function (slides, options) {
    var p = this,
    container,
    swiper,
    swiperContainer,
    defaults = {
        closeButton: true,        // enabled/disable close button
        closeButtonText : 'Skip', // close button text
        cssClass: '',             // additional class on container
        pagination: true,         // swiper pagination
        loop: false,              // swiper loop
        open: true                // open welcome screen on init
    };

    options = options || {};
    for (var def in defaults) {
        if (typeof options[def] === 'undefined') {
            options[def] = defaults[def];
        }
    }

    p.open = function () {
        var html = '';
        html += '<div class="welcomescreen-container '+(options.cssClass||'')+'">';
        options.closeButton && (html += '<div class="welcomescreen-closebtn close-welcomescreen">'+options.closeButtonText+'</div>');
        html += '<div class="welcomescreen-swiper swiper-container">';
        html += '<div class="swiper-wrapper">';
        for (var i in slides) {
            var item = slides[i];
            html += '<div class="swiper-slide" '+(item.id?('id="'+item.id+'"'):'')+'>';
            item.content && (html += '<div class="welcomescreen-content">'+item.content+'</div>');
            item.picture && (html += '<div class="welcomescreen-picture">'+item.picture+'</div>');
            item.text && (html += '<div class="welcomescreen-text">'+item.text+'</div>');
            html += '</div>';
        }
        html += '</div>';
        options.pagination && (html += '<div class="welcomescreen-pagination swiper-pagination"></div>');
        html += '</div></div>';

        container = $(html);
        swiperContainer = container.find('.swiper-container');

        if (options.bgcolor) {
            container.css({
                'background-color': options.bgcolor,
                'color': options.fontcolor
            });
        }

        $('body').append(container);

        swiper = app.swiper('.swiper-container', {
            direction: 'horizontal',
            loop: options.loop,
            pagination: options.pagination ? swiperContainer.find('.swiper-pagination') : undefined
        });

        container[0].f7Welcomescreen = p;
        if (typeof options.onOpened === 'function') { options.onOpened(); }

        $(document).on('click', '.close-welcomescreen', function (e) {
            e.preventDefault();
            var $wscreen = $(this).parents('.welcomescreen-container');
            if ($wscreen.length > 0 && $wscreen[0].f7Welcomescreen) { $wscreen[0].f7Welcomescreen.close(); }
        });
    };
    p.close = function () {
        swiper && swiper.destroy(true);
        container && container.remove();
        container = swiperContainer = swiper = undefined;
        if (typeof options.onClosed === 'function') { options.onClosed(); }
    };
    p.next = function () {
        swiper && swiper.slideNext();
    };
    p.previous = function () {
        swiper && swiper.slidePrev();
    };
    p.slideTo = function (index) {
        swiper && swiper.slideTo(index);
    };

    return p;
};

module.exports = function (slides, options) {
    var p = new Welcomescreen(slides, options);
    p.open();
    return  p;
};
