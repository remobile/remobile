/*framework7-base sortable.js swipeout.js*/
var React = require('react');
var cn = require('classnames');

var Sortable = function (sortableContainer) {
	var p = this;

	p.sortableToggle = function() {
		sortableContainer.toggleClass('sortable-opened');
		if (sortableContainer.hasClass('sortable-opened')) {
			sortableContainer.trigger('open');
		}
		else {
			sortableContainer.trigger('close');
		}
		return sortableContainer;
	};
	p.sortableOpen = function() {
		sortableContainer.addClass('sortable-opened');
		sortableContainer.trigger('open');
		return sortableContainer;
	};
	p.sortableClose = function () {
		sortableContainer.removeClass('sortable-opened');
		sortableContainer.trigger('close');
		return sortableContainer;
	};
	p.initSortable = function () {
		var isTouched, isMoved, touchStartY, touchesDiff, sortingEl, sortingElHeight, sortingItems, minTop, maxTop, insertAfter, insertBefore;

		function handleTouchStart(e) {
			isMoved = false;
			isTouched = true;
			touchStartY = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
			/*jshint validthis:true */
			sortingEl = $(this).parent();
			sortingItems = sortingEl.parent().find('li');
			e.preventDefault();
		}
		function handleTouchMove(e) {
			if (!isTouched || !sortingEl) return;
			var pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
			var pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
			if (!isMoved) {
				sortingEl.addClass('sorting');
				sortableContainer.addClass('sortable-sorting');
				minTop = sortingEl[0].offsetTop;
				maxTop = sortingEl.parent().height() - sortingEl[0].offsetTop - sortingEl.height();
				sortingElHeight = sortingEl[0].offsetHeight;
			}
			isMoved = true;

			e.preventDefault();
			e.f7PreventPanelSwipe = true;
			touchesDiff = pageY - touchStartY;
			var translate = touchesDiff;
			if (translate < -minTop) translate = -minTop;
			if (translate > maxTop) translate = maxTop;
			sortingEl.transform('translate3d(0,' + translate + 'px,0)');

			insertBefore = insertAfter = undefined;

			sortingItems.each(function () {
				var currentEl = $(this);
				if (currentEl[0] === sortingEl[0]) return;
				var currentElOffset = currentEl[0].offsetTop;
				var currentElHeight = currentEl.height();
				var sortingElOffset = sortingEl[0].offsetTop + translate;

				if ((sortingElOffset >= currentElOffset - currentElHeight / 2) && sortingEl.index() < currentEl.index()) {
					currentEl.transform('translate3d(0, '+(-sortingElHeight)+'px,0)');
					insertAfter = currentEl;
					insertBefore = undefined;
				}
				else if ((sortingElOffset <= currentElOffset + currentElHeight / 2) && sortingEl.index() > currentEl.index()) {
					currentEl.transform('translate3d(0, '+(sortingElHeight)+'px,0)');
					insertAfter = undefined;
					if (!insertBefore) insertBefore = currentEl;
				}
				else {
					$(this).transform('translate3d(0, 0%,0)');
				}
			});
		}
		function handleTouchEnd(e) {
			if (!isTouched || !isMoved) {
				isTouched = false;
				isMoved = false;
				return;
			}
			e.preventDefault();
			sortingItems.transform('');
			sortingEl.removeClass('sorting');
			sortableContainer.removeClass('sortable-sorting');
			var virtualList, oldIndex, newIndex;
			if (insertAfter) {
				sortingEl.insertAfter(insertAfter);
				sortingEl.trigger('sort');
			}
			if (insertBefore) {
				sortingEl.insertBefore(insertBefore);
				sortingEl.trigger('sort');
			}
			if ((insertAfter || insertBefore) && sortableContainer.hasClass('virtual-list')) {
				virtualList = sortableContainer[0].f7VirtualList;
				oldIndex = sortingEl[0].f7VirtualListIndex;
				newIndex = insertBefore ? insertBefore[0].f7VirtualListIndex : insertAfter[0].f7VirtualListIndex;
				if (virtualList) virtualList.moveItem(oldIndex, newIndex);
			}
			insertAfter = insertBefore = undefined;
			isTouched = false;
			isMoved = false;
		}
		$(document).on(app.touchEvents.start, '.list-block.sortable .sortable-handler', handleTouchStart);
		if (app.support.touch) {
			$(document).on(app.touchEvents.move, '.list-block.sortable .sortable-handler', handleTouchMove);
			$(document).on(app.touchEvents.end, '.list-block.sortable .sortable-handler', handleTouchEnd);
		}
		else {
			$(document).on(app.touchEvents.move, handleTouchMove);
			$(document).on(app.touchEvents.end, handleTouchEnd);
		}
		p.destroySortableEvents = function() {
			$(document).off(app.touchEvents.start, '.list-block.sortable .sortable-handler', handleTouchStart);
			if (app.support.touch) {
				$(document).off(app.touchEvents.move, '.list-block.sortable .sortable-handler', handleTouchMove);
				$(document).off(app.touchEvents.end, '.list-block.sortable .sortable-handler', handleTouchEnd);
			}
			else {
				$(document).off(app.touchEvents.move, handleTouchMove);
				$(document).off(app.touchEvents.end, handleTouchEnd);
			}
		};
	};
	p.destorySortable = function () {
		p.destroySortableEvents&&p.destroySortableEvents();
	};

	return p;
};

var Swipeout = function(container) {
	var p = this;

	app.swipeoutOpenedEl = undefined;
	app.allowSwipeout = true;

	p.initSwipeout = function (swipeoutEl) {
		var isTouched, isMoved, isScrolling, touchesStart = {}, touchStartTime, touchesDiff, swipeOutEl, swipeOutContent, actionsRight, actionsLeft, actionsLeftWidth, actionsRightWidth, translate, opened, openedActions, buttonsLeft, buttonsRight, direction, overswipeLeftButton, overswipeRightButton, overswipeLeft, overswipeRight, noFoldLeft, noFoldRight;
		$(document).on(app.touchEvents.start, function (e) {
			if (app.swipeoutOpenedEl) {
				var target = $(e.target);
				if (!(
					app.swipeoutOpenedEl.is(target[0]) ||
					target.parents('.swipeout').is(app.swipeoutOpenedEl) ||
					target.hasClass('modal-in') ||
					target.hasClass('modal-overlay') ||
					target.hasClass('actions-modal') ||
					target.parents('.actions-modal.modal-in, .modal.modal-in').length > 0
				)) {
					p.swipeoutClose(app.swipeoutOpenedEl);
				}
			}
		});

		function handleTouchStart(e) {
			if (!app.allowSwipeout) return;
			isMoved = false;
			isTouched = true;
			isScrolling = undefined;
			touchesStart.x = e.type === 'touchstart' ? e.targetTouches[0].pageX : e.pageX;
			touchesStart.y = e.type === 'touchstart' ? e.targetTouches[0].pageY : e.pageY;
			touchStartTime = (new Date()).getTime();
		}
		function handleTouchMove(e) {
			if (!isTouched) return;
			var pageX = e.type === 'touchmove' ? e.targetTouches[0].pageX : e.pageX;
			var pageY = e.type === 'touchmove' ? e.targetTouches[0].pageY : e.pageY;
			if (typeof isScrolling === 'undefined') {
				isScrolling = !!(isScrolling || Math.abs(pageY - touchesStart.y) > Math.abs(pageX - touchesStart.x));
			}
			if (isScrolling) {
				isTouched = false;
				return;
			}

			if (!isMoved) {
				if ($('.list-block.sortable-opened').length > 0) return;
				/*jshint validthis:true */
				swipeOutEl = $(this);
				swipeOutContent = swipeOutEl.find('.swipeout-content');
				actionsRight = swipeOutEl.find('.swipeout-actions-right');
				actionsLeft = swipeOutEl.find('.swipeout-actions-left');
				actionsLeftWidth = actionsRightWidth = buttonsLeft = buttonsRight = overswipeRightButton = overswipeLeftButton = null;
				noFoldLeft = actionsLeft.hasClass('swipeout-actions-no-fold') || app.params.swipeoutActionsNoFold;
				noFoldRight = actionsRight.hasClass('swipeout-actions-no-fold') || app.params.swipeoutActionsNoFold;
				if (actionsLeft.length > 0) {
					actionsLeftWidth = actionsLeft.outerWidth();
					buttonsLeft = actionsLeft.children('a');
					overswipeLeftButton = actionsLeft.find('.swipeout-overswipe');
				}
				if (actionsRight.length > 0) {
					actionsRightWidth = actionsRight.outerWidth();
					buttonsRight = actionsRight.children('a');
					overswipeRightButton = actionsRight.find('.swipeout-overswipe');
				}
				opened = swipeOutEl.hasClass('swipeout-opened');
				if (opened) {
					openedActions = swipeOutEl.find('.swipeout-actions-left.swipeout-actions-opened').length > 0 ? 'left' : 'right';
				}
				swipeOutEl.removeClass('transitioning');
				if (!app.swipeoutNoFollow) {
					swipeOutEl.find('.swipeout-actions-opened').removeClass('swipeout-actions-opened');
					swipeOutEl.removeClass('swipeout-opened');
				}
			}
			isMoved = true;
			e.preventDefault();

			touchesDiff = pageX - touchesStart.x;
			translate = touchesDiff;

			if (opened) {
				if (openedActions === 'right') translate = translate - actionsRightWidth;
				else translate = translate + actionsLeftWidth;
			}

			if (translate > 0 && actionsLeft.length === 0 || translate < 0 && actionsRight.length === 0) {
				if (!opened) {
					isTouched = isMoved = false;
					swipeOutContent.transform('');
					if (buttonsRight && buttonsRight.length > 0) {
						buttonsRight.transform('');
					}
					if (buttonsLeft && buttonsLeft.length > 0) {
						buttonsLeft.transform('');
					}
					return;
				}
				translate = 0;
			}

			if (translate < 0) direction = 'to-left';
			else if (translate > 0) direction = 'to-right';
			else {
				if (direction) direction = direction;
				else direction = 'to-left';
			}

			var i, buttonOffset, progress;

			e.f7PreventPanelSwipe = true;
			if (app.params.swipeoutNoFollow) {
				if (opened) {
					if (openedActions === 'right' && touchesDiff > 0) {
						p.swipeoutClose(swipeOutEl);
					}
					if (openedActions === 'left' && touchesDiff < 0) {
						p.swipeoutClose(swipeOutEl);
					}
				}
				else {
					if (touchesDiff < 0 && actionsRight.length > 0) {
						p.swipeoutOpen(swipeOutEl, 'right');
					}
					if (touchesDiff > 0 && actionsLeft.length > 0) {
						p.swipeoutOpen(swipeOutEl, 'left');
					}
				}
				isTouched = false;
				isMoved = false;
				return;
			}
			overswipeLeft = false;
			overswipeRight = false;
			var $button;
			if (actionsRight.length > 0) {
				// Show right actions
				progress = translate / actionsRightWidth;
				if (translate < -actionsRightWidth) {
					translate = -actionsRightWidth - Math.pow(-translate - actionsRightWidth, 0.8);
					if (overswipeRightButton.length > 0) {
						overswipeRight = true;
					}
				}
				for (i = 0; i < buttonsRight.length; i++) {
					if (typeof buttonsRight[i]._buttonOffset === 'undefined') {
						buttonsRight[i]._buttonOffset = buttonsRight[i].offsetLeft;
					}
					buttonOffset = buttonsRight[i]._buttonOffset;
					$button = $(buttonsRight[i]);
					if (overswipeRightButton.length > 0 && $button.hasClass('swipeout-overswipe')) {
						$button.css({left: (overswipeRight ? -buttonOffset : 0) + 'px'});
						if (overswipeRight) {
							$button.addClass('swipeout-overswipe-active');
						}
						else {
							$button.removeClass('swipeout-overswipe-active');
						}
					}
					$button.transform('translate3d(' + (translate - buttonOffset * (1 + Math.max(progress, -1))) + 'px,0,0)');
				}
			}
			if (actionsLeft.length > 0) {
				// Show left actions
				progress = translate / actionsLeftWidth;
				if (translate > actionsLeftWidth) {
					translate = actionsLeftWidth + Math.pow(translate - actionsLeftWidth, 0.8);
					if (overswipeLeftButton.length > 0) {
						overswipeLeft = true;
					}
				}
				for (i = 0; i < buttonsLeft.length; i++) {
					if (typeof buttonsLeft[i]._buttonOffset === 'undefined') {
						buttonsLeft[i]._buttonOffset = actionsLeftWidth - buttonsLeft[i].offsetLeft - buttonsLeft[i].offsetWidth;
					}
					buttonOffset = buttonsLeft[i]._buttonOffset;
					$button = $(buttonsLeft[i]);
					if (overswipeLeftButton.length > 0 && $button.hasClass('swipeout-overswipe')) {
						$button.css({left: (overswipeLeft ? buttonOffset : 0) + 'px'});
						if (overswipeLeft) {
							$button.addClass('swipeout-overswipe-active');
						}
						else {
							$button.removeClass('swipeout-overswipe-active');
						}
					}
					if (buttonsLeft.length > 1) {
						$button.css('z-index', buttonsLeft.length - i);
					}
					$button.transform('translate3d(' + (translate + buttonOffset * (1 - Math.min(progress, 1))) + 'px,0,0)');
				}
			}
			swipeOutContent.transform('translate3d(' + translate + 'px,0,0)');
		}
		function handleTouchEnd(e) {
			if (!isTouched || !isMoved) {
				isTouched = false;
				isMoved = false;
				return;
			}

			isTouched = false;
			isMoved = false;
			var timeDiff = (new Date()).getTime() - touchStartTime;
			var action, actionsWidth, actions, buttons, i, noFold;

			noFold = direction === 'to-left' ? noFoldRight : noFoldLeft;
			actions = direction === 'to-left' ? actionsRight : actionsLeft;
			actionsWidth = direction === 'to-left' ? actionsRightWidth : actionsLeftWidth;

			if (
				timeDiff < 300 && (touchesDiff < -10 && direction === 'to-left' || touchesDiff > 10 && direction === 'to-right') ||
				timeDiff >= 300 && Math.abs(translate) > actionsWidth / 2
			) {
				action = 'open';
			}
			else {
				action = 'close';
			}
			if (timeDiff < 300) {
				if (Math.abs(translate) === 0) action = 'close';
				if (Math.abs(translate) === actionsWidth) action = 'open';
			}

			if (action === 'open') {
				app.swipeoutOpenedEl = swipeOutEl;
				swipeOutEl.trigger('open');
				swipeOutEl.addClass('swipeout-opened transitioning');
				var newTranslate = direction === 'to-left' ? -actionsWidth : actionsWidth;
				swipeOutContent.transform('translate3d(' + newTranslate + 'px,0,0)');
				actions.addClass('swipeout-actions-opened');
				buttons = direction === 'to-left' ? buttonsRight : buttonsLeft;
				if (buttons) {
					for (i = 0; i < buttons.length; i++) {
						$(buttons[i]).transform('translate3d(' + newTranslate + 'px,0,0)');
					}
				}
				if (overswipeRight) {
					actionsRight.find('.swipeout-overswipe')[0].click();
				}
				if (overswipeLeft) {
					actionsLeft.find('.swipeout-overswipe')[0].click();
				}
			}
			else {
				swipeOutEl.trigger('close');
				app.swipeoutOpenedEl = undefined;
				swipeOutEl.addClass('transitioning').removeClass('swipeout-opened');
				swipeOutContent.transform('');
				actions.removeClass('swipeout-actions-opened');
			}

			var buttonOffset;
			if (buttonsLeft && buttonsLeft.length > 0 && buttonsLeft !== buttons) {
				for (i = 0; i < buttonsLeft.length; i++) {
					buttonOffset = buttonsLeft[i]._buttonOffset;
					if (typeof buttonOffset === 'undefined') {
						buttonsLeft[i]._buttonOffset = actionsLeftWidth - buttonsLeft[i].offsetLeft - buttonsLeft[i].offsetWidth;
					}
					$(buttonsLeft[i]).transform('translate3d(' + (buttonOffset) + 'px,0,0)');
				}
			}
			if (buttonsRight && buttonsRight.length > 0 && buttonsRight !== buttons) {
				for (i = 0; i < buttonsRight.length; i++) {
					buttonOffset = buttonsRight[i]._buttonOffset;
					if (typeof buttonOffset === 'undefined') {
						buttonsRight[i]._buttonOffset = buttonsRight[i].offsetLeft;
					}
					$(buttonsRight[i]).transform('translate3d(' + (-buttonOffset) + 'px,0,0)');
				}
			}
			swipeOutContent.transitionEnd(function (e) {
				if (opened && action === 'open' || closed && action === 'close') return;
				swipeOutEl.trigger(action === 'open' ? 'opened' : 'closed');
				if (opened && action === 'close') {
					if (actionsRight.length > 0) {
						buttonsRight.transform('');
					}
					if (actionsLeft.length > 0) {
						buttonsLeft.transform('');
					}
				}
			});
		}
		if (swipeoutEl) {
			$(swipeoutEl).on(app.touchEvents.start, handleTouchStart);
			$(swipeoutEl).on(app.touchEvents.move, handleTouchMove);
			$(swipeoutEl).on(app.touchEvents.end, handleTouchEnd);
		}
		else {
			$(document).on(app.touchEvents.start, '.list-block li.swipeout', handleTouchStart);
			$(document).on(app.touchEvents.move, '.list-block li.swipeout', handleTouchMove);
			$(document).on(app.touchEvents.end, '.list-block li.swipeout', handleTouchEnd);
		}
		p.destroySwipeoutEvents = function() {
			if (swipeoutEl) {
				$(swipeoutEl).off(app.touchEvents.start, handleTouchStart);
				$(swipeoutEl).off(app.touchEvents.move, handleTouchMove);
				$(swipeoutEl).off(app.touchEvents.end, handleTouchEnd);
			} else {
				$(document).off(app.touchEvents.start, '.list-block li.swipeout', handleTouchStart);
				$(document).off(app.touchEvents.move, '.list-block li.swipeout', handleTouchMove);
				$(document).off(app.touchEvents.end, '.list-block li.swipeout', handleTouchEnd);
			}
		};
	};
	p.swipeoutOpen = function (el, dir, callback) {
		el = $(el);
		if (arguments.length === 2) {
			if (typeof arguments[1] === 'function') {
				callback = dir;
			}
		}

		if (el.length === 0) return;
		if (el.length > 1) el = $(el[0]);
		if (!el.hasClass('swipeout') || el.hasClass('swipeout-opened')) return;
		if (!dir) {
			if (el.find('.swipeout-actions-right').length > 0) dir = 'right';
			else dir = 'left';
		}
		var swipeOutActions = el.find('.swipeout-actions-' + dir);
		if (swipeOutActions.length === 0) return;
		var noFold = swipeOutActions.hasClass('swipeout-actions-no-fold') || app.params.swipeoutActionsNoFold;
		el.trigger('open').addClass('swipeout-opened').removeClass('transitioning');
		swipeOutActions.addClass('swipeout-actions-opened');
		var buttons = swipeOutActions.children('a');
		var swipeOutActionsWidth = swipeOutActions.outerWidth();
		var translate = dir === 'right' ? -swipeOutActionsWidth : swipeOutActionsWidth;
		var i;
		if (buttons.length > 1) {
			for (i = 0; i < buttons.length; i++) {
				if (dir === 'right') {
					$(buttons[i]).transform('translate3d(' + (- buttons[i].offsetLeft) + 'px,0,0)');
				}
				else {
					$(buttons[i]).css('z-index', buttons.length - i).transform('translate3d(' + (swipeOutActionsWidth - buttons[i].offsetWidth - buttons[i].offsetLeft) + 'px,0,0)');
				}
			}
			var clientLeft = buttons[1].clientLeft;
		}
		el.addClass('transitioning');
		for (i = 0; i < buttons.length; i++) {
			$(buttons[i]).transform('translate3d(' + (translate) + 'px,0,0)');
		}
		el.find('.swipeout-content').transform('translate3d(' + translate + 'px,0,0)').transitionEnd(function () {
			el.trigger('opened');
			if (callback) callback.call(el[0]);
		});
		app.swipeoutOpenedEl = el;
	};
	p.swipeoutClose = function (el, callback) {
		el = $(el);
		if (el.length === 0) return;
		if (!el.hasClass('swipeout-opened')) return;
		var dir = el.find('.swipeout-actions-opened').hasClass('swipeout-actions-right') ? 'right' : 'left';
		var swipeOutActions = el.find('.swipeout-actions-opened').removeClass('swipeout-actions-opened');
		var noFold = swipeOutActions.hasClass('swipeout-actions-no-fold') || app.params.swipeoutActionsNoFold;
		var buttons = swipeOutActions.children('a');
		var swipeOutActionsWidth = swipeOutActions.outerWidth();
		app.allowSwipeout = false;
		el.trigger('close');
		el.removeClass('swipeout-opened').addClass('transitioning');

		var closeTO;
		function onSwipeoutClose() {
			app.allowSwipeout = true;
			if (el.hasClass('swipeout-opened')) return;
			el.removeClass('transitioning');
			buttons.transform('');
			el.trigger('closed');
			if (callback) callback.call(el[0]);
			if (closeTO) clearTimeout(closeTO);
		}
		el.find('.swipeout-content').transform('').transitionEnd(onSwipeoutClose);
		closeTO = setTimeout(onSwipeoutClose, 500);

		for (var i = 0; i < buttons.length; i++) {
			if (dir === 'right') {
				$(buttons[i]).transform('translate3d(' + (-buttons[i].offsetLeft) + 'px,0,0)');
			}
			else {
				$(buttons[i]).transform('translate3d(' + (swipeOutActionsWidth - buttons[i].offsetWidth - buttons[i].offsetLeft) + 'px,0,0)');
			}
			$(buttons[i]).css({left:0 + 'px'}).removeClass('swipeout-overswipe-active');
		}
		if (app.swipeoutOpenedEl && app.swipeoutOpenedEl[0] === el[0]) app.swipeoutOpenedEl = undefined;
	};
	p.swipeoutDelete = function (el, callback) {
		el = $(el);
		if (el.length === 0) return;
		if (el.length > 1) el = $(el[0]);
		app.swipeoutOpenedEl = undefined;
		el.trigger('delete');
		el.css({height: el.outerHeight() + 'px'});
		var clientLeft = el[0].clientLeft;
		el.css({height: 0 + 'px'}).addClass('deleting transitioning').transitionEnd(function () {
			el.trigger('deleted');
			if (callback) callback.call(el[0]);
			if (el.parents('.virtual-list').length > 0) {
				var virtualList = el.parents('.virtual-list')[0].f7VirtualList;
				var virtualIndex = el[0].f7VirtualListIndex;
				if (virtualList && typeof virtualIndex !== 'undefined') virtualList.deleteItem(virtualIndex);
			}
			else {
				//el.remove();
				el.css("display", "none");
			}
		});
		var translate = '-100%';
		el.find('.swipeout-content').transform('translate3d(' + translate + ',0,0)');
	};
	p.swipeoutDestory = function () {
		p.destroySwipeoutEvents&&p.destroySwipeoutEvents();
	};

	return p;
}

module.exports = React.createClass({
	componentDidMount: function() {
		if (this.props.sortable) {
			this.sortable = new Sortable($(this.refs.container.getDOMNode()));
			this.sortable.initSortable();
		}
		if (this.props.swipeout) {
			this.swipeout = new Swipeout($(this.refs.container.getDOMNode()));
			this.swipeout.initSwipeout();
		}
	},
	componentWillUnmount: function() {
		if (this.props.sortable) {
			this.sortable.destorySortable();
		}
		if (this.props.swipeout) {
			this.swipeout.swipeoutDestory();
		}
	},
	render: function() {
		var obj = {
			'list-block': true,
			'inset': this.props.inset,
			'list-block-label': this.props.tabletInset,
			'media-list': this.props.media,
			'sortable': this.props.sortable,
			'inputs-list': this.props.inputs&&app.params.material,
		};
		this.props.class&&(obj[this.props.class]=true);
		var className = cn(obj);

		var style= this.props.block?{}:{margin:'0px 0px'};
		if (this.props.group) {
			return (
				<div className={className} style={style}>
					{this.props.children}
				</div>
			)
		} else if (this.props.sortable||this.props.swipeout){
			return (
				<div
					className={className}
					style={style}
					ref="container">
					<ul>
						{this.props.children}
					</ul>
				</div>
			)
		} else {
			return (
				<div className={className} style={style}>
					<ul>
						{this.props.children}
					</ul>
				</div>
			)
		}
	}
});
