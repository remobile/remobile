module.exports = function(app) {
/*======================================================
************   Navigation / Router   ************
======================================================*/
app.router = {
    // Set pages classess for animationEnd
    animatePages: function (leftPage, rightPage, direction) {
        // Loading new page
        var removeClasses = 'page-on-center page-on-right page-on-left';
        if (direction === 'to-left') {
            leftPage.removeClass(removeClasses).addClass('page-from-center-to-left');
            rightPage.removeClass(removeClasses).addClass('page-from-right-to-center');
        }
        // Go back
        if (direction === 'to-right') {
            leftPage.removeClass(removeClasses).addClass('page-from-left-to-center');
            rightPage.removeClass(removeClasses).addClass('page-from-center-to-right');
        }
    },

    // Prepare navbar before animarion
    prepareNavbar: function (newNavbarInner, oldNavbarInner, newNavbarPosition) {
        $(newNavbarInner).find('.sliding').each(function () {
            var sliding = $(this);
            var slidingOffset = newNavbarPosition === 'right' ? this.f7NavbarRightOffset : this.f7NavbarLeftOffset;

            if (app.params.animateNavBackIcon) {
                if (sliding.hasClass('left') && sliding.find('.back .icon').length > 0) {
                    sliding.find('.back .icon').transform('translate3d(' + (-slidingOffset) + 'px,0,0)');
                }
                if (newNavbarPosition === 'left' && sliding.hasClass('center') && $(oldNavbarInner).find('.left .back .icon ~ span').length > 0) {
                    slidingOffset += $(oldNavbarInner).find('.left .back span')[0].offsetLeft;
                }
            }

            sliding.transform('translate3d(' + slidingOffset + 'px,0,0)');
        });
    },

    // Set navbars transform for backup
    adjustNavbars: function (leftNavbarInner, rightNavbarInner) {
        leftNavbarInner.find('.sliding').each(function () {
            var sliding = $(this);
            var rightText;
            if (app.params.animateNavBackIcon) {
                if (sliding.hasClass('center') && rightNavbarInner.find('.sliding.left .back .icon').length > 0) {
                    rightText = rightNavbarInner.find('.sliding.left .back span');
                    if (rightText.length > 0) this.f7NavbarLeftOffset += rightText[0].offsetLeft;
                }
                if (sliding.hasClass('left') && sliding.find('.back .icon').length > 0) {
                    sliding.find('.back .icon').transform('translate3d(' + (-this.f7NavbarLeftOffset) + 'px,0,0)');
                }
            }
            sliding.transform('translate3d(' + (this.f7NavbarLeftOffset) + 'px,0,0)');
        });
    },

    // Set navbars classess for animation
    animateNavbars: function (leftNavbarInner, rightNavbarInner, direction) {
        // Loading new page
        var removeClasses = 'navbar-on-right navbar-on-center navbar-on-left';
        if (direction === 'to-left') {
            rightNavbarInner.removeClass(removeClasses).addClass('navbar-from-right-to-center');
            rightNavbarInner.find('.sliding').each(function () {
                var sliding = $(this);
                sliding.transform('translate3d(0px,0,0)');
                if (app.params.animateNavBackIcon) {
                    if (sliding.hasClass('left') && sliding.find('.back .icon').length > 0) {
                        sliding.find('.back .icon').transform('translate3d(0px,0,0)');
                    }
                }
            });

            leftNavbarInner.removeClass(removeClasses).addClass('navbar-from-center-to-left');
            leftNavbarInner.find('.sliding').each(function () {
                var sliding = $(this);
                var rightText;
                if (app.params.animateNavBackIcon) {
                    if (sliding.hasClass('center') && rightNavbarInner.find('.sliding.left .back .icon').length > 0) {
                        rightText = rightNavbarInner.find('.sliding.left .back span');
                        if (rightText.length > 0) this.f7NavbarLeftOffset += rightText[0].offsetLeft;
                    }
                    if (sliding.hasClass('left') && sliding.find('.back .icon').length > 0) {
                        sliding.find('.back .icon').transform('translate3d(' + (-this.f7NavbarLeftOffset) + 'px,0,0)');
                    }
                }
                sliding.transform('translate3d(' + (this.f7NavbarLeftOffset) + 'px,0,0)');
            });
        }
        // Go back
        if (direction === 'to-right') {
            leftNavbarInner.removeClass(removeClasses).addClass('navbar-from-left-to-center');
            leftNavbarInner.find('.sliding').each(function () {
                var sliding = $(this);
                sliding.transform('translate3d(0px,0,0)');
                if (app.params.animateNavBackIcon) {
                    if (sliding.hasClass('left') && sliding.find('.back .icon').length > 0) {
                        sliding.find('.back .icon').transform('translate3d(0px,0,0)');
                    }
                }
            });

            rightNavbarInner.removeClass(removeClasses).addClass('navbar-from-center-to-right');
            rightNavbarInner.find('.sliding').each(function () {
                var sliding = $(this);
                if (app.params.animateNavBackIcon) {
                    if (sliding.hasClass('left') && sliding.find('.back .icon').length > 0) {
                        sliding.find('.back .icon').transform('translate3d(' + (-this.f7NavbarRightOffset) + 'px,0,0)');
                    }
                }
                sliding.transform('translate3d(' + (this.f7NavbarRightOffset) + 'px,0,0)');
            });
        }
    },
};
app.showViewEnterAnimate = function (param) {
    var {oldPage, newPage, oldNavbarInner, newNavbarInner, dynamicNavbar} = param;

    function afterAnimation() {
        newPage.removeClass('page-from-right-to-center page-on-right page-on-left').addClass('page-on-center');
        oldPage.removeClass('page-from-center-to-left page-on-center page-on-right').addClass('page-on-left');
        if (dynamicNavbar) {
            newNavbarInner.removeClass('navbar-from-right-to-center navbar-on-left navbar-on-right').addClass('navbar-on-center');
            oldNavbarInner.removeClass('navbar-from-center-to-left navbar-on-center navbar-on-right').addClass('navbar-on-left');
        }
    }

    if (app.params.animatePages) {
        if (dynamicNavbar) {
            app.router.prepareNavbar(newNavbarInner, oldNavbarInner, 'right');
        }
        // Set pages before animation
        if (app.params.material && app.params.materialPageLoadDelay) {
            setTimeout(function () {
                app.router.animatePages(oldPage, newPage, 'to-left');
            }, app.params.materialPageLoadDelay);
        }
        else {
            app.router.animatePages(oldPage, newPage, 'to-left');
        }

        // Dynamic navbar animation
        if (dynamicNavbar) {
            setTimeout(function() {
                app.router.animateNavbars(oldNavbarInner, newNavbarInner, 'to-left');
            }, 0);
        }
        newPage.animationEnd(function (e) {
            afterAnimation();
        });
    }
    else {
        if (dynamicNavbar) newNavbarInner.find('.sliding, .sliding .back .icon').transform('');
        afterAnimation();
    }
};
app.adjustViewBackupNavbars = function (param) {
    var {oldNavbarInner, newNavbarInner} = param;
    app.router.adjustNavbars(oldNavbarInner, newNavbarInner);
};
app.showViewExitAnimate = function (param) {
    var {oldPage, newPage, oldNavbarInner, newNavbarInner, dynamicNavbar, callback} = param;

    function afterAnimation() {
        newPage.removeClass('page-from-left-to-center page-on-left').addClass('page-on-center');
        oldPage.removeClass('page-from-center-to-right page-on-center').addClass('page-on-right');
        if (dynamicNavbar) {
	        newNavbarInner.removeClass('navbar-on-left navbar-from-left-to-center').addClass('navbar-on-center');
	        oldNavbarInner.removeClass('navbar-on-center navbar-from-center-to-right').addClass('navbar-on-left');
	      }
        callback();
    }

    if (app.params.animatePages) {
        // Set pages before animation
        app.router.animatePages(newPage, oldPage, 'to-right');

        // Dynamic navbar animation
        if (dynamicNavbar) {
            setTimeout(function () {
                app.router.animateNavbars(newNavbarInner, oldNavbarInner, 'to-right');
            }, 0);
        }

        newPage.animationEnd(function () {
            afterAnimation();
        });
    }
    else {
        if (dynamicNavbar) newNavbarInner.find('.sliding, .sliding .back .icon').transform('');
        afterAnimation();
    }
};
return app;
};
