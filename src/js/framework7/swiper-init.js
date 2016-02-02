module.exports = function(app) {
/*===========================
Framework7 Swiper Additions
===========================*/
app.initPageSwiper = function (pageContainer) {
    pageContainer = $(pageContainer);
    var swipers = pageContainer.find('.swiper-init, .tabs-swipeable-wrap');
    if (swipers.length === 0) return;
    function destroySwiperOnRemove(slider) {
        function destroySwiper() {
            slider.destroy();
            pageContainer.off('pageBeforeRemove', destroySwiper);
        }
        pageContainer.on('pageBeforeRemove', destroySwiper);
    }
    swipers.each(function () {
        var swiper = $(this);
        if (swiper.hasClass('tabs-swipeable-wrap')) {
            swiper.addClass('swiper-container').children('.tabs').addClass('swiper-wrapper').children('.tab').addClass('swiper-slide');
        }
        var params;
        if (swiper.data('swiper')) {
            params = JSON.parse(swiper.data('swiper'));
        }
        else {
            params = swiper.dataset();
        }
        if (swiper.hasClass('tabs-swipeable-wrap')) {
            params.onSlideChangeStart = function (s) {
                app.showTab(s.slides.eq(s.activeIndex));
            };
        }
        var _slider = app.swiper(swiper[0], params);
        destroySwiperOnRemove(_slider);
    });
};
return app;
};
