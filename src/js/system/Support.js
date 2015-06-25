module.exports =  {
    touch : (window.Modernizr && Modernizr.touch === true) || (function () {
        return !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);
    })(),
    transforms3d : (window.Modernizr && Modernizr.csstransforms3d === true) || (function () {
        var div = document.createElement('div').style;
        return ('webkitPerspective' in div || 'MozPerspective' in div || 'OPerspective' in div || 'MsPerspective' in div || 'perspective' in div);
    })(),
    flexbox: (function () {
        var div = document.createElement('div').style;
        var styles = ('alignItems webkitAlignItems webkitBoxAlign msFlexAlign mozBoxAlign webkitFlexDirection msFlexDirection mozBoxDirection mozBoxOrient webkitBoxDirection webkitBoxOrient').split(' ');
        for (var i = 0; i < styles.length; i++) {
            if (styles[i] in div) return true;
        }
    })(),
    observer: (function () {
        return ('MutationObserver' in window || 'WebkitMutationObserver' in window);
    })()
};
