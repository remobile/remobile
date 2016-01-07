module.exports = function(app) {
	app.initIndexedList = function(params) {
		var isTouched, lastLetter, lastPreviewLetter, groupPostion = {}, box;
		var eventsTarget = params.container;

		var pageContainer = $('.page');
		var pageContent = $('.page').find('.page-content');
		var searchBar = $(pageContainer).find('.searchbar').length > 0;
		var serachBarOffset = searchBar*app.params.material?56:44;
		var fixedNavbar = pageContent.parents('.navbar-fixed').length > 0 || pageContent.parents('.navbar-through').length > 0;
		var fixedNavbarOffset = fixedNavbar*app.params.material?48:44;
		var fixedToolbar =  pageContent.parents('.toolbar-through').length > 0 || pageContent.parents('.tabbar-labels-through').length > 0;
		var toolBarOffset = fixedToolbar*app.params.material?72:44;

		var height = eventsTarget.height();
		if (fixedNavbar||searchBar){
			eventsTarget.css('padding-top',  (fixedNavbarOffset+serachBarOffset)+'px');
			height -= fixedNavbarOffset+serachBarOffset;
		}
		if (fixedToolbar) {
			height -= toolBarOffset;
		}
		eventsTarget.css({'height':height+'px'});
		pageContent.css({'width': 'calc(100% - '+eventsTarget.width()+'px)'});

		function showThumbnail(letter) {
			$('.indexed-list-letter-container').off('click').off('transitionEnd').remove();
			box = $('<div class="indexed-list-letter-container show">');
			box.html('<div class="letter">' +letter +'</div>');
			$('body').append(box);
			box.css('margin-top', box.outerHeight() / -2 + 'px').css('margin-left', box.outerWidth() / -2 + 'px');
			box.addClass('fadein');
		}

		function updateThumbnail(letter) {
			if (box) {
				box.find('.letter').html(letter);
			} else {
				showThumbnail(letter);
			}
		}

		function hideThumbnail() {
			if (box) {
				box.removeClass('fadein').transitionEnd(function () {
				  box.remove();
				  box = null;
				});
			}
		}

		function callback(letter) {
			var scrollToEl = pageContent.find('.list-group ul li[data-index-letter="' + letter + '"]');
			if (!scrollToEl.length) return;
			var scrollTop = scrollToEl.offset().top + pageContent.scrollTop() - fixedNavbarOffset - serachBarOffset;
			pageContent.scrollTop(scrollTop);
		}

		function handleTouchStart(e) {
			e.preventDefault();
			isTouched = true;

			var target = $(e.target);
			if (!target.is('li')) target = target.parents('li');
			if (target.length > 0) {
				scrollToLetter(target.eq(0).data('index-letter'), true);
			}
		}

		function handleTouchMove(e) {
			if (!isTouched) return;
			e.preventDefault();
			var target;
			if (e.type === 'mousemove') {
				target = $(e.target);
			}
			else {
				target = $(document.elementFromPoint(e.touches[0].pageX, e.touches[0].pageY));
			}
			if (!target.is('li')) target = target.parents('li');

			if (target.length === 0) return;
			if (target.length > 0 && !target.is('.list-index li')) return;

			scrollToLetter(target.eq(0).data('index-letter'));
		}

		function handleTouchEnd(e) {
			isTouched = false;
			hideThumbnail();
		}

		function handleClick(e) {
			var target = $(e.target);
			if (!target.is('li')) target = target.parents('li');
			if (target.length > 0) {
				scrollToLetter(target.eq(0).data('index-letter'), true);
			}
		}

		function handlePageScroll() {
			var inf = $(this);
			var scrollTop = inf[0].scrollTop;
			var scrollHeight = inf[0].scrollHeight;
			var height = inf[0].offsetHeight;

			var prevLetter = 'A';
			for (var letter in groupPostion) {
				var top = groupPostion[letter].offset().top-fixedNavbarOffset-serachBarOffset-2;
				if (top >= 0) {
					break;
				}
				prevLetter = letter;
			}
			if (lastPreviewLetter !== prevLetter) {
				lastPreviewLetter = prevLetter;
				params.callback(prevLetter);
			}
		}

		function scrollToLetter(letter, start) {
			if (lastLetter !== letter) {
				lastLetter = letter;
				callback(letter);
				params.callback(letter);
				if (start) {
					showThumbnail(letter);
				} else {
					updateThumbnail(letter);
				}
			}
		}

		params.letters.map((letter)=>{groupPostion[letter] = pageContent.find('.list-group ul li[data-index-letter="' + letter + '"]')});
		pageContent.on('scroll', handlePageScroll);
		eventsTarget.on('click', '.list-index li', handleClick);
		eventsTarget.on(app.touchEvents.start, handleTouchStart);
		eventsTarget.on(app.touchEvents.move, handleTouchMove);
		eventsTarget.on(app.touchEvents.end, handleTouchEnd);

		app.destroyIndexedList = function () {
			pageContent.off('scroll', handlePageScroll);
			eventsTarget.off('click', '.list-index li', handleClick);
			eventsTarget.off(app.touchEvents.start, handleTouchStart);
			eventsTarget.off(app.touchEvents.move, handleTouchMove);
			eventsTarget.off(app.touchEvents.end, handleTouchEnd);
		};
	}
	return app;
}
