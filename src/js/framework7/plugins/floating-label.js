module.exports = function(app) {
	app.initFloatingLabel = function(container) {
		container = $(container);
	    var input = container.find('input'),
	    	label = container.find('.label');

		var placeholder = label.html();
	    input.attr('placeholder', placeholder);

	    input.on('focus', function(e) {
	    	if(!input.hasClass('label-active')) {
	    		input.addClass('label-active');
	    		label.addClass('active');
	    	}
	    });

	    input.on('blur', function(e) {
	    	if(!input.val()) {
	    		input.removeClass('label-active');
	    		label.removeClass('active');
	    	}
	    });
	    return input;
	};
	return app;
};
