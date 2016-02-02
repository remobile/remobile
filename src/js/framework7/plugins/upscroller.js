module.exports = function (app) {
    app.initUpScroller = function (container, text) {
        text = text||'Go Top';
        var button = $('<div class="upscroller">↑ ' + text + '</div>');
        container.prepend(button);

        button.click(function(event) {
            event.stopPropagation();
            event.preventDefault();
            container.scrollTop(0, Math.round(container.scrollTop()/4));
        });
        container.scroll(function(event){
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
