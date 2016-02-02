module.exports = function (app) {
    app.initUpScroller = function (pageContainer, text) {
        pageContainer = $(pageContainer);
        text = text||'Go Top';
        var button = $('<div class="upscroller">↑ ' + text + '</div>');
        pageContainer.prepend(button);

        button.click(function(event) {
            event.stopPropagation();
            event.preventDefault();
            pageContainer.scrollTop(0, Math.round(pageContainer.scrollTop()/4));
        });
        pageContainer.scroll(function(event){
            var e = $(event.target).scrollTop();
            if(e > 300) {
                button.addClass('show');
            } else {
                button.removeClass('show');
            }
        });
    };
    return app;
};
