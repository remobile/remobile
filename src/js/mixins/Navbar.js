module.exports = {
	sizeNavbars :function(container) {
		var navbarInner =  $(container).find('.navbar .navbar-inner:not(.cached)');
		navbarInner.each(function () {
			var n = $(this);
			if (n.hasClass('cached')) return;
			var left = n.find('.left'),
			right = n.find('.right'),
			center = n.find('.center'),
			subnavbar = n.find('.subnavbar'),
			noLeft = left.length === 0,
			noRight = right.length === 0,
			leftWidth = noLeft ? 0 : left.outerWidth(true),
			rightWidth = noRight ? 0 : right.outerWidth(true),
			centerWidth = center.outerWidth(true),
			navbarStyles = n.styles(),
			navbarWidth = n[0].offsetWidth - parseInt(navbarStyles.paddingLeft, 10) - parseInt(navbarStyles.paddingRight, 10),
			onLeft = n.hasClass('navbar-on-left'),
			currLeft, diff;

			if (noRight) {
				currLeft = navbarWidth - centerWidth;
			}
			if (noLeft) {
				currLeft = 0;
			}
			if (!noLeft && !noRight) {
				currLeft = (navbarWidth - rightWidth - centerWidth + leftWidth) / 2;
			}
			var requiredLeft = (navbarWidth - centerWidth) / 2;
			if (navbarWidth - leftWidth - rightWidth > centerWidth) {
				if (requiredLeft < leftWidth) {
					requiredLeft = leftWidth;
				}
				if (requiredLeft + centerWidth > navbarWidth - rightWidth) {
					requiredLeft = navbarWidth - rightWidth - centerWidth;
				}
				diff = requiredLeft - currLeft;
			}
			else {
				diff = 0;
			}
			// RTL inverter
			var inverter = 1;

			if (center.hasClass('sliding')) {
				center[0].f7NavbarLeftOffset = -(currLeft + diff) * inverter;
				center[0].f7NavbarRightOffset = (navbarWidth - currLeft - diff - centerWidth) * inverter;
				if (onLeft) center.transform('translate3d(' + center[0].f7NavbarLeftOffset + 'px, 0, 0)');
			}
			if (!noLeft && left.hasClass('sliding')) {
				left[0].f7NavbarLeftOffset = -leftWidth;
				left[0].f7NavbarRightOffset = (navbarWidth - left[0].offsetWidth) / 2;
				if (onLeft) left.transform('translate3d(' + left[0].f7NavbarLeftOffset + 'px, 0, 0)');
			}
			if (!noRight && right.hasClass('sliding')) {
				right[0].f7NavbarLeftOffset = -(navbarWidth - right[0].offsetWidth) / 2;
				right[0].f7NavbarRightOffset = rightWidth;
				if (onLeft) right.transform('translate3d(' + right[0].f7NavbarLeftOffset + 'px, 0, 0)');
			}
			if (subnavbar.length && subnavbar.hasClass('sliding')) {
				subnavbar[0].f7NavbarLeftOffset = -subnavbar[0].offsetWidth;
				subnavbar[0].f7NavbarRightOffset = -subnavbar[0].f7NavbarLeftOffset;
			}

			// Center left
			var centerLeft = diff;
			center.css({left: centerLeft + 'px'});

		});
	},
	hideNavbar: function(navbarContainer) {
		$(navbarContainer).addClass('navbar-hidden');
		return true;
	},
	showNavbar: function(navbarContainer) {
		var navbar = $(navbarContainer);
		navbar.addClass('navbar-hiding').removeClass('navbar-hidden').transitionEnd(function () {
			navbar.removeClass('navbar-hiding');
		});
		return true;
	},
	hideToolbar: function(toolbarContainer) {
		$(toolbarContainer).addClass('toolbar-hidden');
		return true;
	},
	showToolbar: function(toolbarContainer) {
		var toolbar = $(toolbarContainer);
		toolbar.addClass('toolbar-hiding').removeClass('toolbar-hidden').transitionEnd(function () {
			toolbar.removeClass('toolbar-hiding');
		});
	}
}
