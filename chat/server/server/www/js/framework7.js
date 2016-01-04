/*===========================
Dom7 Library
===========================*/
window.$ = (function () {
    var Dom7 = function (arr) {
        var _this = this, i = 0;
        // Create array-like object
        for (i = 0; i < arr.length; i++) {
            _this[i] = arr[i];
        }
        _this.length = arr.length;
        // Return collection with methods
        return this;
    };
    var $ = function (selector, context) {
        var arr = [], i = 0;
        if (selector && !context) {
            if (selector instanceof Dom7) {
                return selector;
            }
        }
        if (selector) {
            // String
            if (typeof selector === 'string') {
                var els, tempParent, html = selector.trim();
                if (html.indexOf('<') >= 0 && html.indexOf('>') >= 0) {
                    var toCreate = 'div';
                    if (html.indexOf('<li') === 0) toCreate = 'ul';
                    if (html.indexOf('<tr') === 0) toCreate = 'tbody';
                    if (html.indexOf('<td') === 0 || html.indexOf('<th') === 0) toCreate = 'tr';
                    if (html.indexOf('<tbody') === 0) toCreate = 'table';
                    if (html.indexOf('<option') === 0) toCreate = 'select';
                    tempParent = document.createElement(toCreate);
                    tempParent.innerHTML = selector;
                    for (i = 0; i < tempParent.childNodes.length; i++) {
                        arr.push(tempParent.childNodes[i]);
                    }
                }
                else {
                    if (!context && selector[0] === '#' && !selector.match(/[ .<>:~]/)) {
                        // Pure ID selector
                        els = [document.getElementById(selector.split('#')[1])];
                    }
                    else {
                        // Other selectors
                        els = (context || document).querySelectorAll(selector);
                    }
                    for (i = 0; i < els.length; i++) {
                        if (els[i]) arr.push(els[i]);
                    }
                }
            }
            // Node/element
            else if (selector.nodeType || selector === window || selector === document) {
                arr.push(selector);
            }
            //Array of elements or instance of Dom
            else if (selector.length > 0 && selector[0].nodeType) {
                for (i = 0; i < selector.length; i++) {
                    arr.push(selector[i]);
                }
            }
        }
        return new Dom7(arr);
    };

Dom7.prototype = {
    // Classes and attriutes
    addClass: function (className) {
        if (typeof className === 'undefined') {
            return this;
        }
        var classes = className.split(' ');
        for (var i = 0; i < classes.length; i++) {
            for (var j = 0; j < this.length; j++) {
                if (typeof this[j].classList !== 'undefined') this[j].classList.add(classes[i]);
            }
        }
        return this;
    },
    removeClass: function (className) {
        var classes = className.split(' ');
        for (var i = 0; i < classes.length; i++) {
            for (var j = 0; j < this.length; j++) {
                if (typeof this[j].classList !== 'undefined') this[j].classList.remove(classes[i]);
            }
        }
        return this;
    },
    hasClass: function (className) {
        if (!this[0]) return false;
        else return this[0].classList.contains(className);
    },
    toggleClass: function (className) {
        var classes = className.split(' ');
        for (var i = 0; i < classes.length; i++) {
            for (var j = 0; j < this.length; j++) {
                if (typeof this[j].classList !== 'undefined') this[j].classList.toggle(classes[i]);
            }
        }
        return this;
    },
    attr: function (attrs, value) {
        if (arguments.length === 1 && typeof attrs === 'string') {
            // Get attr
            if (this[0]) return this[0].getAttribute(attrs);
            else return undefined;
        }
        else {
            // Set attrs
            for (var i = 0; i < this.length; i++) {
                if (arguments.length === 2) {
                    // String
                    this[i].setAttribute(attrs, value);
                }
                else {
                    // Object
                    for (var attrName in attrs) {
                        this[i][attrName] = attrs[attrName];
                        this[i].setAttribute(attrName, attrs[attrName]);
                    }
                }
            }
            return this;
        }
    },
    removeAttr: function (attr) {
        for (var i = 0; i < this.length; i++) {
            this[i].removeAttribute(attr);
        }
        return this;
    },
    prop: function (props, value) {
        if (arguments.length === 1 && typeof props === 'string') {
            // Get prop
            if (this[0]) return this[0][props];
            else return undefined;
        }
        else {
            // Set props
            for (var i = 0; i < this.length; i++) {
                if (arguments.length === 2) {
                    // String
                    this[i][props] = value;
                }
                else {
                    // Object
                    for (var propName in props) {
                        this[i][propName] = props[propName];
                    }
                }
            }
            return this;
        }
    },
    data: function (key, value) {
        if (typeof value === 'undefined') {
            // Get value
            if (this[0]) {
                if (this[0].dom7ElementDataStorage && (key in this[0].dom7ElementDataStorage)) {
                    return this[0].dom7ElementDataStorage[key];
                }
                else {
                    var dataKey = this[0].getAttribute('data-' + key);    
                    if (dataKey) {
                        return dataKey;
                    }
                    else return undefined;
                }
            }
            else return undefined;
        }
        else {
            // Set value
            for (var i = 0; i < this.length; i++) {
                var el = this[i];
                if (!el.dom7ElementDataStorage) el.dom7ElementDataStorage = {};
                el.dom7ElementDataStorage[key] = value;
            }
            return this;
        }
    },
    removeData: function(key) {
        for (var i = 0; i < this.length; i++) {
            var el = this[i];
            if (el.dom7ElementDataStorage && el.dom7ElementDataStorage[key]) {
                el.dom7ElementDataStorage[key] = null;
                delete el.dom7ElementDataStorage[key];
            }
        }
    },
    dataset: function () {
        var el = this[0];
        if (el) {
            var dataset = {};
            if (el.dataset) {
                for (var dataKey in el.dataset) {
                    dataset[dataKey] = el.dataset[dataKey];
                }
            }
            else {
                for (var i = 0; i < el.attributes.length; i++) {
                    var attr = el.attributes[i];
                    if (attr.name.indexOf('data-') >= 0) {
                        dataset[$.toCamelCase(attr.name.split('data-')[1])] = attr.value;
                    }
                }
            }
            for (var key in dataset) {
                if (dataset[key] === 'false') dataset[key] = false;
                else if (dataset[key] === 'true') dataset[key] = true;
                else if (parseFloat(dataset[key]) === dataset[key] * 1) dataset[key] = dataset[key] * 1;
            }
            return dataset;
        }
        else return undefined;
    },
    val: function (value) {
        if (typeof value === 'undefined') {
            if (this[0]) return this[0].value;
            else return undefined;
        }
        else {
            for (var i = 0; i < this.length; i++) {
                this[i].value = value;
            }
            return this;
        }
    },
    // Transforms
    transform : function (transform) {
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransform = elStyle.MsTransform = elStyle.msTransform = elStyle.MozTransform = elStyle.OTransform = elStyle.transform = transform;
        }
        return this;
    },
    transition: function (duration) {
        if (typeof duration !== 'string') {
            duration = duration + 'ms';
        }
        for (var i = 0; i < this.length; i++) {
            var elStyle = this[i].style;
            elStyle.webkitTransitionDuration = elStyle.MsTransitionDuration = elStyle.msTransitionDuration = elStyle.MozTransitionDuration = elStyle.OTransitionDuration = elStyle.transitionDuration = duration;
        }
        return this;
    },
    //Events
    on: function (eventName, targetSelector, listener, capture) {
        function handleLiveEvent(e) {
            var target = e.target;
            if ($(target).is(targetSelector)) listener.call(target, e);
            else {
                var parents = $(target).parents();
                for (var k = 0; k < parents.length; k++) {
                    if ($(parents[k]).is(targetSelector)) listener.call(parents[k], e);
                }
            }
        }
        var events = eventName.split(' ');
        var i, j;
        for (i = 0; i < this.length; i++) {
            if (typeof targetSelector === 'function' || targetSelector === false) {
                // Usual events
                if (typeof targetSelector === 'function') {
                    listener = arguments[1];
                    capture = arguments[2] || false;
                }
                for (j = 0; j < events.length; j++) {
                    this[i].addEventListener(events[j], listener, capture);
                }
            }
            else {
                //Live events
                for (j = 0; j < events.length; j++) {
                    if (!this[i].dom7LiveListeners) this[i].dom7LiveListeners = [];
                    this[i].dom7LiveListeners.push({listener: listener, liveListener: handleLiveEvent});
                    this[i].addEventListener(events[j], handleLiveEvent, capture);
                }
            }
        }

        return this;
    },
    off: function (eventName, targetSelector, listener, capture) {
        var events = eventName.split(' ');
        for (var i = 0; i < events.length; i++) {
            for (var j = 0; j < this.length; j++) {
                if (typeof targetSelector === 'function' || targetSelector === false) {
                    // Usual events
                    if (typeof targetSelector === 'function') {
                        listener = arguments[1];
                        capture = arguments[2] || false;
                    }
                    this[j].removeEventListener(events[i], listener, capture);
                }
                else {
                    // Live event
                    if (this[j].dom7LiveListeners) {
                        for (var k = 0; k < this[j].dom7LiveListeners.length; k++) {
                            if (this[j].dom7LiveListeners[k].listener === listener) {
                                this[j].removeEventListener(events[i], this[j].dom7LiveListeners[k].liveListener, capture);
                            }
                        }
                    }
                }
            }
        }
        return this;
    },
    once: function (eventName, targetSelector, listener, capture) {
        var dom = this;
        if (typeof targetSelector === 'function') {
            listener = arguments[1];
            capture = arguments[2];
            targetSelector = false;
        }
        function proxy(e) {
            listener.call(e.target, e);
            dom.off(eventName, targetSelector, proxy, capture);
        }
        return dom.on(eventName, targetSelector, proxy, capture);
    },
    trigger: function (eventName, eventData) {
        var events = eventName.split(' ');
        for (var i = 0; i < events.length; i++) {
            for (var j = 0; j < this.length; j++) {
                var evt;
                try {
                    evt = new CustomEvent(events[i], {detail: eventData, bubbles: true, cancelable: true});
                }
                catch (e) {
                    evt = document.createEvent('Event');
                    evt.initEvent(events[i], true, true);
                    evt.detail = eventData;
                }
                this[j].dispatchEvent(evt);
            }
        }
        return this;
    },
    transitionEnd: function (callback) {
        var events = ['webkitTransitionEnd', 'transitionend', 'oTransitionEnd', 'MSTransitionEnd', 'msTransitionEnd'],
            i, j, dom = this;
        function fireCallBack(e) {
            /*jshint validthis:true */
            if (e.target !== this) return;
            callback.call(this, e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }
        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
        return this;
    },
    animationEnd: function (callback) {
        var events = ['webkitAnimationEnd', 'OAnimationEnd', 'MSAnimationEnd', 'animationend'],
            i, j, dom = this;
        function fireCallBack(e) {
            callback(e);
            for (i = 0; i < events.length; i++) {
                dom.off(events[i], fireCallBack);
            }
        }
        if (callback) {
            for (i = 0; i < events.length; i++) {
                dom.on(events[i], fireCallBack);
            }
        }
        return this;
    },
    // Sizing/Styles
    width: function () {
        if (this[0] === window) {
            return window.innerWidth;
        }
        else {
            if (this.length > 0) {
                return parseFloat(this.css('width'));
            }
            else {
                return null;
            }
        }
    },
    outerWidth: function (includeMargins) {
        if (this.length > 0) {
            if (includeMargins) {
                var styles = this.styles();
                return this[0].offsetWidth + parseFloat(styles.getPropertyValue('margin-right')) + parseFloat(styles.getPropertyValue('margin-left'));    
            }
            else
                return this[0].offsetWidth;
        }
        else return null;
    },
    height: function () {
        if (this[0] === window) {
            return window.innerHeight;
        }
        else {
            if (this.length > 0) {
                return parseFloat(this.css('height'));
            }
            else {
                return null;
            }
        }
    },
    outerHeight: function (includeMargins) {
        if (this.length > 0) {
            if (includeMargins) {
                var styles = this.styles();
                return this[0].offsetHeight + parseFloat(styles.getPropertyValue('margin-top')) + parseFloat(styles.getPropertyValue('margin-bottom'));    
            }
            else
                return this[0].offsetHeight;
        }
        else return null;
    },
    offset: function () {
        if (this.length > 0) {
            var el = this[0];
            var box = el.getBoundingClientRect();
            var body = document.body;
            var clientTop  = el.clientTop  || body.clientTop  || 0;
            var clientLeft = el.clientLeft || body.clientLeft || 0;
            var scrollTop  = window.pageYOffset || el.scrollTop;
            var scrollLeft = window.pageXOffset || el.scrollLeft;
            return {
                top: box.top  + scrollTop  - clientTop,
                left: box.left + scrollLeft - clientLeft
            };
        }
        else {
            return null;
        }
    },
    hide: function () {
        for (var i = 0; i < this.length; i++) {
            this[i].style.display = 'none';
        }
        return this;
    },
    show: function () {
        for (var i = 0; i < this.length; i++) {
            this[i].style.display = 'block';
        }
        return this;
    },
    styles: function () {
        var i, styles;
        if (this[0]) return window.getComputedStyle(this[0], null);
        else return undefined;
    },
    css: function (props, value) {
        var i;
        if (arguments.length === 1) {
            if (typeof props === 'string') {
                if (this[0]) return window.getComputedStyle(this[0], null).getPropertyValue(props);
            }
            else {
                for (i = 0; i < this.length; i++) {
                    for (var prop in props) {
                        this[i].style[prop] = props[prop];
                    }
                }
                return this;
            }
        }
        if (arguments.length === 2 && typeof props === 'string') {
            for (i = 0; i < this.length; i++) {
                this[i].style[props] = value;
            }
            return this;
        }
        return this;
    },

    //Dom manipulation
    each: function (callback) {
        for (var i = 0; i < this.length; i++) {
            callback.call(this[i], i, this[i]);
        }
        return this;
    },
    filter: function (callback) {
        var matchedItems = [];
        var dom = this;
        for (var i = 0; i < dom.length; i++) {
            if (callback.call(dom[i], i, dom[i])) matchedItems.push(dom[i]);
        }
        return new Dom7(matchedItems);
    },
    html: function (html) {
        if (typeof html === 'undefined') {
            return this[0] ? this[0].innerHTML : undefined;
        }
        else {
            for (var i = 0; i < this.length; i++) {
                this[i].innerHTML = html;
            }
            return this;
        }
    },
    text: function (text) {
        if (typeof text === 'undefined') {
            if (this[0]) {
                return this[0].textContent.trim();
            }
            else return null;
        }
        else {
            for (var i = 0; i < this.length; i++) {
                this[i].textContent = text;
            }
        }
    },
    is: function (selector) {
        if (!this[0] || typeof selector === 'undefined') return false;
        var compareWith, i;
        if (typeof selector === 'string') {
            var el = this[0];
            if (el === document) return selector === document;
            if (el === window) return selector === window;

            if (el.matches) return el.matches(selector);
            else if (el.webkitMatchesSelector) return el.webkitMatchesSelector(selector);
            else if (el.mozMatchesSelector) return el.mozMatchesSelector(selector);
            else if (el.msMatchesSelector) return el.msMatchesSelector(selector);
            else {
                compareWith = $(selector);
                for (i = 0; i < compareWith.length; i++) {
                    if (compareWith[i] === this[0]) return true;
                }
                return false;
            }
        }
        else if (selector === document) return this[0] === document;
        else if (selector === window) return this[0] === window;
        else {
            if (selector.nodeType || selector instanceof Dom7) {
                compareWith = selector.nodeType ? [selector] : selector;
                for (i = 0; i < compareWith.length; i++) {
                    if (compareWith[i] === this[0]) return true;
                }
                return false;
            }
            return false;
        }

    },
    indexOf: function (el) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === el) return i;
        }
    },
    index: function () {
        if (this[0]) {
            var child = this[0];
            var i = 0;
            while ((child = child.previousSibling) !== null) {
                if (child.nodeType === 1) i++;
            }
            return i;
        }
        else return undefined;
    },
    eq: function (index) {
        if (typeof index === 'undefined') return this;
        var length = this.length;
        var returnIndex;
        if (index > length - 1) {
            return new Dom7([]);
        }
        if (index < 0) {
            returnIndex = length + index;
            if (returnIndex < 0) return new Dom7([]);
            else return new Dom7([this[returnIndex]]);
        }
        return new Dom7([this[index]]);
    },
    append: function (newChild) {
        var i, j;
        for (i = 0; i < this.length; i++) {
            if (typeof newChild === 'string') {
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = newChild;
                while (tempDiv.firstChild) {
                    this[i].appendChild(tempDiv.firstChild);
                }
            }
            else if (newChild instanceof Dom7) {
                for (j = 0; j < newChild.length; j++) {
                    this[i].appendChild(newChild[j]);
                }
            }
            else {
                this[i].appendChild(newChild);
            }
        }
        return this;
    },
    appendTo: function (parent) {
        $(parent).append(this);
        return this;
    },
    prepend: function (newChild) {
        var i, j;
        for (i = 0; i < this.length; i++) {
            if (typeof newChild === 'string') {
                var tempDiv = document.createElement('div');
                tempDiv.innerHTML = newChild;
                for (j = tempDiv.childNodes.length - 1; j >= 0; j--) {
                    this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
                }
                // this[i].insertAdjacentHTML('afterbegin', newChild);
            }
            else if (newChild instanceof Dom7) {
                for (j = 0; j < newChild.length; j++) {
                    this[i].insertBefore(newChild[j], this[i].childNodes[0]);
                }
            }
            else {
                this[i].insertBefore(newChild, this[i].childNodes[0]);
            }
        }
        return this;
    },
    prependTo: function (parent) {
        $(parent).prepend(this);
        return this;
    },
    insertBefore: function (selector) {
        var before = $(selector);
        for (var i = 0; i < this.length; i++) {
            if (before.length === 1) {
                before[0].parentNode.insertBefore(this[i], before[0]);
            }
            else if (before.length > 1) {
                for (var j = 0; j < before.length; j++) {
                    before[j].parentNode.insertBefore(this[i].cloneNode(true), before[j]);
                }
            }
        }
    },
    insertAfter: function (selector) {
        var after = $(selector);
        for (var i = 0; i < this.length; i++) {
            if (after.length === 1) {
                after[0].parentNode.insertBefore(this[i], after[0].nextSibling);
            }
            else if (after.length > 1) {
                for (var j = 0; j < after.length; j++) {
                    after[j].parentNode.insertBefore(this[i].cloneNode(true), after[j].nextSibling);
                }
            }
        }
    },
    next: function (selector) {
        if (this.length > 0) {
            if (selector) {
                if (this[0].nextElementSibling && $(this[0].nextElementSibling).is(selector)) return new Dom7([this[0].nextElementSibling]);
                else return new Dom7([]);
            }
            else {
                if (this[0].nextElementSibling) return new Dom7([this[0].nextElementSibling]);
                else return new Dom7([]);
            }
        }
        else return new Dom7([]);
    },
    nextAll: function (selector) {
        var nextEls = [];
        var el = this[0];
        if (!el) return new Dom7([]);
        while (el.nextElementSibling) {
            var next = el.nextElementSibling;
            if (selector) {
                if($(next).is(selector)) nextEls.push(next);
            }
            else nextEls.push(next);
            el = next;
        }
        return new Dom7(nextEls);
    },
    prev: function (selector) {
        if (this.length > 0) {
            if (selector) {
                if (this[0].previousElementSibling && $(this[0].previousElementSibling).is(selector)) return new Dom7([this[0].previousElementSibling]);
                else return new Dom7([]);
            }
            else {
                if (this[0].previousElementSibling) return new Dom7([this[0].previousElementSibling]);
                else return new Dom7([]);
            }
        }
        else return new Dom7([]);
    },
    prevAll: function (selector) {
        var prevEls = [];
        var el = this[0];
        if (!el) return new Dom7([]);
        while (el.previousElementSibling) {
            var prev = el.previousElementSibling;
            if (selector) {
                if($(prev).is(selector)) prevEls.push(prev);
            }
            else prevEls.push(prev);
            el = prev;
        }
        return new Dom7(prevEls);
    },
    parent: function (selector) {
        var parents = [];
        for (var i = 0; i < this.length; i++) {
            if (this[i].parentNode !== null) {
                if (selector) {
                    if ($(this[i].parentNode).is(selector)) parents.push(this[i].parentNode);
                }
                else {
                   parents.push(this[i].parentNode);
                }
            }
        }
        return $($.unique(parents));
    },
    parents: function (selector) {
        var parents = [];
        for (var i = 0; i < this.length; i++) {
            var parent = this[i].parentNode;
            while (parent) {
                if (selector) {
                    if ($(parent).is(selector)) parents.push(parent);
                }
                else {
                    parents.push(parent);
                }
                parent = parent.parentNode;
            }
        }
        return $($.unique(parents));
    },
    find : function (selector) {
        var foundElements = [];
        for (var i = 0; i < this.length; i++) {
            var found = this[i].querySelectorAll(selector);
            for (var j = 0; j < found.length; j++) {
                foundElements.push(found[j]);
            }
        }
        return new Dom7(foundElements);
    },
    children: function (selector) {
        var children = [];
        for (var i = 0; i < this.length; i++) {
            var childNodes = this[i].childNodes;

            for (var j = 0; j < childNodes.length; j++) {
                if (!selector) {
                    if (childNodes[j].nodeType === 1) children.push(childNodes[j]);
                }
                else {
                    if (childNodes[j].nodeType === 1 && $(childNodes[j]).is(selector)) children.push(childNodes[j]);
                }
            }
        }
        return new Dom7($.unique(children));
    },
    remove: function () {
        for (var i = 0; i < this.length; i++) {
            if (this[i].parentNode) this[i].parentNode.removeChild(this[i]);
        }
        return this;
    },
    detach: function () {
        return this.remove();
    },
    add: function () {
        var dom = this;
        var i, j;
        for (i = 0; i < arguments.length; i++) {
            var toAdd = $(arguments[i]);
            for (j = 0; j < toAdd.length; j++) {
                dom[dom.length] = toAdd[j];
                dom.length++;
            }
        }
        return dom;
    }
};

// Shortcuts
(function () {
    var shortcuts = ('click blur focus focusin focusout keyup keydown keypress submit change mousedown mousemove mouseup mouseenter mouseleave mouseout mouseover touchstart touchend touchmove resize scroll').split(' ');
    var notTrigger = ('resize scroll').split(' ');
    function createMethod(name) {
        Dom7.prototype[name] = function (targetSelector, listener, capture) {
            var i;
            if (typeof targetSelector === 'undefined') {
                for (i = 0; i < this.length; i++) {
                    if (notTrigger.indexOf(name) < 0) {
                        if (name in this[i]) this[i][name]();
                        else {
                            $(this[i]).trigger(name);
                        }
                    }
                }
                return this;
            }
            else {
                return this.on(name, targetSelector, listener, capture);
            }
        };
    }
    for (var i = 0; i < shortcuts.length; i++) {
        createMethod(shortcuts[i]);
    }
})();

// Global Ajax Setup
var globalAjaxOptions = {};
$.ajaxSetup = function (options) {
    if (options.type) options.method = options.type;
    $.each(options, function (optionName, optionValue) {
        globalAjaxOptions[optionName]  = optionValue;
    });
};

// Ajax
var _jsonpRequests = 0;
$.ajax = function (options) {
    var defaults = {
        method: 'GET',
        data: false,
        async: true,
        cache: true,
        user: '',
        password: '',
        headers: {},
        xhrFields: {},
        statusCode: {},
        processData: true,
        dataType: 'text',
        contentType: 'application/x-www-form-urlencoded',
        timeout: 0
    };
    var callbacks = ['beforeSend', 'error', 'complete', 'success', 'statusCode'];


    //For jQuery guys
    if (options.type) options.method = options.type;

    // Merge global and defaults
    $.each(globalAjaxOptions, function (globalOptionName, globalOptionValue) {
        if (callbacks.indexOf(globalOptionName) < 0) defaults[globalOptionName] = globalOptionValue;
    });

    // Function to run XHR callbacks and events
    function fireAjaxCallback (eventName, eventData, callbackName) {
        var a = arguments;
        if (eventName) $(document).trigger(eventName, eventData);
        if (callbackName) {
            // Global callback
            if (callbackName in globalAjaxOptions) globalAjaxOptions[callbackName](a[3], a[4], a[5], a[6]);
            // Options callback
            if (options[callbackName]) options[callbackName](a[3], a[4], a[5], a[6]);
        }
    }

    // Merge options and defaults
    $.each(defaults, function (prop, defaultValue) {
        if (!(prop in options)) options[prop] = defaultValue;
    });

    // Default URL
    if (!options.url) {
        options.url = window.location.toString();
    }
    // Parameters Prefix
    var paramsPrefix = options.url.indexOf('?') >= 0 ? '&' : '?';

    // UC method
    var _method = options.method.toUpperCase();
    // Data to modify GET URL
    if ((_method === 'GET' || _method === 'HEAD') && options.data) {
        var stringData;
        if (typeof options.data === 'string') {
            // Should be key=value string
            if (options.data.indexOf('?') >= 0) stringData = options.data.split('?')[1];
            else stringData = options.data;
        }
        else {
            // Should be key=value object
            stringData = $.serializeObject(options.data);
        }
        options.url += paramsPrefix + stringData;
    }
    // JSONP
    if (options.dataType === 'json' && options.url.indexOf('callback=') >= 0) {

        var callbackName = 'f7jsonp_' + Date.now() + (_jsonpRequests++);
        var abortTimeout;
        var callbackSplit = options.url.split('callback=');
        var requestUrl = callbackSplit[0] + 'callback=' + callbackName;
        if (callbackSplit[1].indexOf('&') >= 0) {
            var addVars = callbackSplit[1].split('&').filter(function (el) { return el.indexOf('=') > 0; }).join('&');
            if (addVars.length > 0) requestUrl += '&' + addVars;
        }

        // Create script
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.onerror = function() {
            clearTimeout(abortTimeout);
            fireAjaxCallback(undefined, undefined, 'error', null, 'scripterror');
        };
        script.src = requestUrl;

        // Handler
        window[callbackName] = function (data) {
            clearTimeout(abortTimeout);
            fireAjaxCallback(undefined, undefined, 'success', data);
            script.parentNode.removeChild(script);
            script = null;
            delete window[callbackName];
        };
        document.querySelector('head').appendChild(script);

        if (options.timeout > 0) {
            abortTimeout = setTimeout(function () {
                script.parentNode.removeChild(script);
                script = null;
                fireAjaxCallback(undefined, undefined, 'error', null, 'timeout');
            }, options.timeout);
        }

        return;
    }

    // Cache for GET/HEAD requests
    if (_method === 'GET' || _method === 'HEAD' || _method === 'OPTIONS' || _method === 'DELETE') {
        if (options.cache === false) {
            options.url += (paramsPrefix + '_nocache=' + Date.now());
        }
    }

    // Create XHR
    var xhr = new XMLHttpRequest();

    // Save Request URL
    xhr.requestUrl = options.url;
    xhr.requestParameters = options;

    // Open XHR
    xhr.open(_method, options.url, options.async, options.user, options.password);

    // Create POST Data
    var postData = null;

    if ((_method === 'POST' || _method === 'PUT' || _method === 'PATCH') && options.data) {
        if (options.processData) {
            var postDataInstances = [ArrayBuffer, Blob, Document, FormData];
            // Post Data
            if (postDataInstances.indexOf(options.data.constructor) >= 0) {
                postData = options.data;
            }
            else {
                // POST Headers
                var boundary = '---------------------------' + Date.now().toString(16);

                if (options.contentType === 'multipart\/form-data') {
                    xhr.setRequestHeader('Content-Type', 'multipart\/form-data; boundary=' + boundary);
                }
                else {
                    xhr.setRequestHeader('Content-Type', options.contentType);
                }
                postData = '';
                var _data = $.serializeObject(options.data);
                if (options.contentType === 'multipart\/form-data') {
                    boundary = '---------------------------' + Date.now().toString(16);
                    _data = _data.split('&');
                    var _newData = [];
                    for (var i = 0; i < _data.length; i++) {
                        _newData.push('Content-Disposition: form-data; name="' + _data[i].split('=')[0] + '"\r\n\r\n' + _data[i].split('=')[1] + '\r\n');
                    }
                    postData = '--' + boundary + '\r\n' + _newData.join('--' + boundary + '\r\n') + '--' + boundary + '--\r\n';
                }
                else {
                    postData = options.contentType === 'application/x-www-form-urlencoded' ? _data : _data.replace(/&/g, '\r\n');
                }
            }
        }
        else {
            postData = options.data;
        }

    }

    // Additional headers
    if (options.headers) {
        $.each(options.headers, function (headerName, headerCallback) {
            xhr.setRequestHeader(headerName, headerCallback);
        });
    }

    // Check for crossDomain
    if (typeof options.crossDomain === 'undefined') {
        options.crossDomain = /^([\w-]+:)?\/\/([^\/]+)/.test(options.url) && RegExp.$2 !== window.location.host;
    }

    if (!options.crossDomain) {
        xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    }

    if (options.xhrFields) {
        $.each(options.xhrFields, function (fieldName, fieldValue) {
            xhr[fieldName] = fieldValue;
        });
    }

    var xhrTimeout;
    // Handle XHR
    xhr.onload = function (e) {
        if (xhrTimeout) clearTimeout(xhrTimeout);
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0) {
            var responseData;
            if (options.dataType === 'json') {
                try {
                    responseData = JSON.parse(xhr.responseText);
                    fireAjaxCallback('ajaxSuccess', {xhr: xhr}, 'success', responseData, xhr.status, xhr);
                }
                catch (err) {
                    fireAjaxCallback('ajaxError', {xhr: xhr, parseerror: true}, 'error', xhr, 'parseerror');
                }
            }
            else {
                responseData = xhr.responseType === 'text' || xhr.responseType === '' ? xhr.responseText : xhr.response;
                fireAjaxCallback('ajaxSuccess', {xhr: xhr}, 'success', responseData, xhr.status, xhr);
            }
        }
        else {
            fireAjaxCallback('ajaxError', {xhr: xhr}, 'error', xhr, xhr.status);
        }
        if (options.statusCode) {
            if (globalAjaxOptions.statusCode && globalAjaxOptions.statusCode[xhr.status]) globalAjaxOptions.statusCode[xhr.status](xhr);
            if (options.statusCode[xhr.status]) options.statusCode[xhr.status](xhr);
        }
        fireAjaxCallback('ajaxComplete', {xhr: xhr}, 'complete', xhr, xhr.status);
    };

    xhr.onerror = function (e) {
        if (xhrTimeout) clearTimeout(xhrTimeout);
        fireAjaxCallback('ajaxError', {xhr: xhr}, 'error', xhr, xhr.status);
    };

    // Ajax start callback
    fireAjaxCallback('ajaxStart', {xhr: xhr}, 'start', xhr);
    fireAjaxCallback(undefined, undefined, 'beforeSend', xhr);


    // Send XHR
    xhr.send(postData);

    // Timeout
    if (options.timeout > 0) {
        xhr.onabort = function () {
            if (xhrTimeout) clearTimeout(xhrTimeout);
        };
        xhrTimeout = setTimeout(function () {
            xhr.abort();
            fireAjaxCallback('ajaxError', {xhr: xhr, timeout: true}, 'error', xhr, 'timeout');
            fireAjaxCallback('ajaxComplete', {xhr: xhr, timeout: true}, 'complete', xhr, 'timeout');
        }, options.timeout);
    }

    // Return XHR object
    return xhr;
};
// Shrotcuts
(function () {
    var methods = ('get post getJSON').split(' ');
    function createMethod(method) {
        $[method] = function (url, data, success) {
            return $.ajax({
                url: url,
                method: method === 'post' ? 'POST' : 'GET',
                data: typeof data === 'function' ? undefined : data,
                success: typeof data === 'function' ? data : success,
                dataType: method === 'getJSON' ? 'json' : undefined
            });
        };
    }
    for (var i = 0; i < methods.length; i++) {
        createMethod(methods[i]);
    }
})();

// DOM Library Utilites
$.parseUrlQuery = function (url) {
    var query = {}, i, params, param;
    if (url.indexOf('?') >= 0) url = url.split('?')[1];
    else return query;
    params = url.split('&');
    for (i = 0; i < params.length; i++) {
        param = params[i].split('=');
        query[param[0]] = param[1];
    }
    return query;
};
$.isArray = function (arr) {
    if (Object.prototype.toString.apply(arr) === '[object Array]') return true;
    else return false;
};
$.each = function (obj, callback) {
    if (typeof obj !== 'object') return;
    if (!callback) return;
    var i, prop;
    if ($.isArray(obj) || obj instanceof Dom7) {
        // Array
        for (i = 0; i < obj.length; i++) {
            callback(i, obj[i]);
        }
    }
    else {
        // Object
        for (prop in obj) {
            if (obj.hasOwnProperty(prop)) {
                callback(prop, obj[prop]);
            }
        }
    }
};
$.unique = function (arr) {
    var unique = [];
    for (var i = 0; i < arr.length; i++) {
        if (unique.indexOf(arr[i]) === -1) unique.push(arr[i]);
    }
    return unique;
};
$.serializeObject = $.param = function (obj, parents) {
    if (typeof obj === 'string') return obj;
    var resultArray = [];
    var separator = '&';
    parents = parents || [];
    var newParents;
    function var_name(name) {
        if (parents.length > 0) {
            var _parents = '';
            for (var j = 0; j < parents.length; j++) {
                if (j === 0) _parents += parents[j];
                else _parents += '[' + encodeURIComponent(parents[j]) + ']';
            }
            return _parents + '[' + encodeURIComponent(name) + ']';
        }
        else {
            return encodeURIComponent(name);
        }
    }
    function var_value(value) {
        return encodeURIComponent(value);
    }
    for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) {
            var toPush;
            if ($.isArray(obj[prop])) {
                toPush = [];
                for (var i = 0; i < obj[prop].length; i ++) {
                    if (!$.isArray(obj[prop][i]) && typeof obj[prop][i] === 'object') {
                        newParents = parents.slice();
                        newParents.push(prop);
                        newParents.push(i + '');
                        toPush.push($.serializeObject(obj[prop][i], newParents));
                    }
                    else {
                        toPush.push(var_name(prop) + '[]=' + var_value(obj[prop][i]));
                    }
                    
                }
                if (toPush.length > 0) resultArray.push(toPush.join(separator));
            }
            else if (typeof obj[prop] === 'object') {
                // Object, convert to named array
                newParents = parents.slice();
                newParents.push(prop);
                toPush = $.serializeObject(obj[prop], newParents);
                if (toPush !== '') resultArray.push(toPush);
            }
            else if (typeof obj[prop] !== 'undefined' && obj[prop] !== '') {
                // Should be string or plain value
                resultArray.push(var_name(prop) + '=' + var_value(obj[prop]));
            }
        }
    }
    return resultArray.join(separator);
};
$.toCamelCase = function (string) {
    return string.toLowerCase().replace(/-(.)/g, function(match, group1) {
        return group1.toUpperCase();
    });
};
$.dataset = function (el) {
    return $(el).dataset();
};
$.getTranslate = function (el, axis) {
    var matrix, curTransform, curStyle, transformMatrix;

    // automatic axis detection
    if (typeof axis === 'undefined') {
        axis = 'x';
    }

    curStyle = window.getComputedStyle(el, null);
    if (window.WebKitCSSMatrix) {
        curTransform = curStyle.transform || curStyle.webkitTransform;
        if (curTransform.split(',').length > 6) {
            curTransform = curTransform.split(', ').map(function(a){
                return a.replace(',','.');
            }).join(', ');
        }
        // Some old versions of Webkit choke when 'none' is passed; pass
        // empty string instead in this case
        transformMatrix = new WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform);
    }
    else {
        transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform  || curStyle.transform || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,');
        matrix = transformMatrix.toString().split(',');
    }

    if (axis === 'x') {
        //Latest Chrome and webkits Fix
        if (window.WebKitCSSMatrix)
            curTransform = transformMatrix.m41;
        //Crazy IE10 Matrix
        else if (matrix.length === 16)
            curTransform = parseFloat(matrix[12]);
        //Normal Browsers
        else
            curTransform = parseFloat(matrix[4]);
    }
    if (axis === 'y') {
        //Latest Chrome and webkits Fix
        if (window.WebKitCSSMatrix)
            curTransform = transformMatrix.m42;
        //Crazy IE10 Matrix
        else if (matrix.length === 16)
            curTransform = parseFloat(matrix[13]);
        //Normal Browsers
        else
            curTransform = parseFloat(matrix[5]);
    }
    
    return curTransform || 0;
};

$.requestAnimationFrame = function (callback) {
    if (window.requestAnimationFrame) return window.requestAnimationFrame(callback);
    else if (window.webkitRequestAnimationFrame) return window.webkitRequestAnimationFrame(callback);
    else if (window.mozRequestAnimationFrame) return window.mozRequestAnimationFrame(callback);
    else {
        return window.setTimeout(callback, 1000 / 60);
    }
};
$.cancelAnimationFrame = function (id) {
    if (window.cancelAnimationFrame) return window.cancelAnimationFrame(id);
    else if (window.webkitCancelAnimationFrame) return window.webkitCancelAnimationFrame(id);
    else if (window.mozCancelAnimationFrame) return window.mozCancelAnimationFrame(id);
    else {
        return window.clearTimeout(id);
    }  
};
$.supportTouch = !!(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch);

// Link to prototype
$.fn = Dom7.prototype;

// Plugins
$.fn.scrollTo = function (left, top, duration, easing, callback) {
    if (arguments.length === 4 && typeof easing === 'function') {
        callback = easing;
        easing = undefined;
    }
    return this.each(function () {
        var el = this;
        var currentTop, currentLeft, maxTop, maxLeft, newTop, newLeft, scrollTop, scrollLeft;
        var animateTop = top > 0 || top === 0;
        var animateLeft = left > 0 || left === 0;
        if (typeof easing === 'undefined') {
            easing = 'swing';
        }
        if (animateTop) {
            currentTop = el.scrollTop;
            if (!duration) {
                el.scrollTop = top;
            }
        }
        if (animateLeft) {
            currentLeft = el.scrollLeft;
            if (!duration) {
                el.scrollLeft = left;
            }
        }
        if (!duration) return;
        if (animateTop) {
            maxTop = el.scrollHeight - el.offsetHeight;
            newTop = Math.max(Math.min(top, maxTop), 0);
        }
        if (animateLeft) {
            maxLeft = el.scrollWidth - el.offsetWidth;
            newLeft = Math.max(Math.min(left, maxLeft), 0);
        }
        var startTime = null;
        if (animateTop && newTop === currentTop) animateTop = false;
        if (animateLeft && newLeft === currentLeft) animateLeft = false;
        function render(time) {
            if (time === undefined) {
                time = new Date().getTime();
            }
            if (startTime === null) {
                startTime = time;
            }
            var doneLeft, doneTop, done;
            var progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
            var easeProgress = easing === 'linear' ? progress : (0.5 - Math.cos( progress * Math.PI ) / 2);
            if (animateTop) scrollTop = currentTop + (easeProgress * (newTop - currentTop));
            if (animateLeft) scrollLeft = currentLeft + (easeProgress * (newLeft - currentLeft));
            if (animateTop && newTop > currentTop && scrollTop >= newTop)  {
                el.scrollTop = newTop;
                done = true;
            }
            if (animateTop && newTop < currentTop && scrollTop <= newTop)  {
                el.scrollTop = newTop;
                done = true;
            }

            if (animateLeft && newLeft > currentLeft && scrollLeft >= newLeft)  {
                el.scrollLeft = newLeft;
                done = true;
            }
            if (animateLeft && newLeft < currentLeft && scrollLeft <= newLeft)  {
                el.scrollLeft = newLeft;
                done = true;
            }

            if (done) {
                if (callback) callback();
                return;
            }
            if (animateTop) el.scrollTop = scrollTop;
            if (animateLeft) el.scrollLeft = scrollLeft;
            $.requestAnimationFrame(render);
        }
        $.requestAnimationFrame(render);
    });
};
$.fn.scrollTop = function (top, duration, easing, callback) {
    if (arguments.length === 3 && typeof easing === 'function') {
        callback = easing;
        easing = undefined;
    }
    var dom = this;
    if (typeof top === 'undefined') {
        if (dom.length > 0) return dom[0].scrollTop;
        else return null;
    }
    return dom.scrollTo(undefined, top, duration, easing, callback);
};
$.fn.scrollBottom = function (duration, easing, callback) {
    if (arguments.length === 2 && typeof easing === 'function') {
        callback = easing;
        easing = undefined;
    }
    var dom = this;
    return dom.scrollTo(undefined, dom.height(), duration, easing, callback);
};
$.fn.scrollLeft = function (left, duration, easing, callback) {
    if (arguments.length === 3 && typeof easing === 'function') {
        callback = easing;
        easing = undefined;
    }
    var dom = this;
    if (typeof left === 'undefined') {
        if (dom.length > 0) return dom[0].scrollLeft;
        else return null;
    }
    return dom.scrollTo(left, undefined, duration, easing, callback);
};

(function($) {
    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        a256 = '',
        r64 = [256],
        r256 = [256],
        i = 0;
    var UTF8 = {
        /**
         * Encode multi-byte Unicode string into utf-8 multiple single-byte     characters
         * (BMP / basic multilingual plane only)
         *
         * Chars in range U+0080 - U+07FF are encoded in 2 chars, U+0800 - U+FFFF in 3 chars
         *
         * @param {String} strUni Unicode string to be encoded as UTF-8
         * @returns {String} encoded string
         */
        encode: function(strUni) {
            // use regular expressions & String.replace callback function for better efficiency
            // than procedural approaches
            var strUtf = strUni.replace(/[\u0080-\u07ff]/g, // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
            function(c) {
                var cc = c.charCodeAt(0);
                return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
            })
            .replace(/[\u0800-\uffff]/g, // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
            function(c) {
                var cc = c.charCodeAt(0);
                return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
            });
            return strUtf;
        },
        /**
         * Decode utf-8 encoded string back into multi-byte Unicode characters
         *
         * @param {String} strUtf UTF-8 string to be decoded back to Unicode
         * @returns {String} decoded string
         */
        decode: function(strUtf) {
            // note: decode 3-byte chars first as decoded 2-byte strings could appear to be 3-byte char!
            var strUni = strUtf.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g, // 3-byte chars
            function(c) { // (note parentheses for precence)
                var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
                return String.fromCharCode(cc);
            })
            .replace(/[\u00c0-\u00df][\u0080-\u00bf]/g, // 2-byte chars
            function(c) { // (note parentheses for precence)
                var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
                return String.fromCharCode(cc);
            });
            return strUni;
        }
    };
    while(i < 256) {
        var c = String.fromCharCode(i);
        a256 += c;
        r256[i] = i;
        r64[i] = b64.indexOf(c);
        ++i;
    }
    function code(s, discard, alpha, beta, w1, w2) {
        s = String(s);
        var buffer = 0,
            i = 0,
            length = s.length,
            result = '',
            bitsInBuffer = 0;
        while(i < length) {
            var c = s.charCodeAt(i);
            c = c < 256 ? alpha[c] : -1;
            buffer = (buffer << w1) + c;
            bitsInBuffer += w1;
            while(bitsInBuffer >= w2) {
                bitsInBuffer -= w2;
                var tmp = buffer >> bitsInBuffer;
                result += beta.charAt(tmp);
                buffer ^= tmp << bitsInBuffer;
            }
            ++i;
        }
        if(!discard && bitsInBuffer > 0) result += beta.charAt(buffer << (w2 - bitsInBuffer));
        return result;
    }
    var Plugin = $.base64 = function(dir, input, encode) {
            return input ? Plugin[dir](input, encode) : dir ? null : this;
        };
    Plugin.btoa = Plugin.encode = function(plain, utf8encode) {
        plain = Plugin.raw === false || Plugin.utf8encode || utf8encode ? UTF8.encode(plain) : plain;
        plain = code(plain, false, r256, b64, 8, 6);
        return plain + '===='.slice((plain.length % 4) || 4);
    };
    Plugin.atob = Plugin.decode = function(coded, utf8decode) {
        coded = String(coded).split('=');
        var i = coded.length;
        do {--i;
            coded[i] = code(coded[i], true, r64, a256, 6, 8);
        } while (i > 0);
        coded = coded.join('');
        return Plugin.raw === false || Plugin.utf8decode || utf8decode ? UTF8.decode(coded) : coded;
    };
}($));

(function($) {
    $.dateFormat = function(date, fmt) {
        var o = {
            "M+": date.getMonth() + 1, //�·�
            "d+": date.getDate(), //��
            "h+": date.getHours(), //Сʱ
            "m+": date.getMinutes(), //��
            "s+": date.getSeconds(), //��
            "q+": Math.floor((date.getMonth() + 3) / 3), //����
            "S": date.getMilliseconds() //����
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };
}($));
(function($) {
    var strChineseFirstPY = "YDYQSXMWZSSXJBYMGCCZQPSSQBYCDSCDQLDYLYBSSJGYZZJJFKCCLZDHWDWZJLJPFYYNWJJTMYHZWZHFLZPPQHGSCYYYNJQYXXGJHHSDSJNKKTMOMLCRXYPSNQSECCQZGGLLYJLMYZZSECYKYYHQWJSSGGYXYZYJWWKDJHYCHMYXJTLXJYQBYXZLDWRDJRWYSRLDZJPCBZJJBRCFTLECZSTZFXXZHTRQHYBDLYCZSSYMMRFMYQZPWWJJYFCRWFDFZQPYDDWYXKYJAWJFFXYPSFTZYHHYZYSWCJYXSCLCXXWZZXNBGNNXBXLZSZSBSGPYSYZDHMDZBQBZCWDZZYYTZHBTSYYBZGNTNXQYWQSKBPHHLXGYBFMJEBJHHGQTJCYSXSTKZHLYCKGLYSMZXYALMELDCCXGZYRJXSDLTYZCQKCNNJWHJTZZCQLJSTSTBNXBTYXCEQXGKWJYFLZQLYHYXSPSFXLMPBYSXXXYDJCZYLLLSJXFHJXPJBTFFYABYXBHZZBJYZLWLCZGGBTSSMDTJZXPTHYQTGLJSCQFZKJZJQNLZWLSLHDZBWJNCJZYZSQQYCQYRZCJJWYBRTWPYFTWEXCSKDZCTBZHYZZYYJXZCFFZZMJYXXSDZZOTTBZLQWFCKSZSXFYRLNYJMBDTHJXSQQCCSBXYYTSYFBXDZTGBCNSLCYZZPSAZYZZSCJCSHZQYDXLBPJLLMQXTYDZXSQJTZPXLCGLQTZWJBHCTSYJSFXYEJJTLBGXSXJMYJQQPFZASYJNTYDJXKJCDJSZCBARTDCLYJQMWNQNCLLLKBYBZZSYHQQLTWLCCXTXLLZNTYLNEWYZYXCZXXGRKRMTCNDNJTSYYSSDQDGHSDBJGHRWRQLYBGLXHLGTGXBQJDZPYJSJYJCTMRNYMGRZJCZGJMZMGXMPRYXKJNYMSGMZJYMKMFXMLDTGFBHCJHKYLPFMDXLQJJSMTQGZSJLQDLDGJYCALCMZCSDJLLNXDJFFFFJCZFMZFFPFKHKGDPSXKTACJDHHZDDCRRCFQYJKQCCWJDXHWJLYLLZGCFCQDSMLZPBJJPLSBCJGGDCKKDEZSQCCKJGCGKDJTJDLZYCXKLQSCGJCLTFPCQCZGWPJDQYZJJBYJHSJDZWGFSJGZKQCCZLLPSPKJGQJHZZLJPLGJGJJTHJJYJZCZMLZLYQBGJWMLJKXZDZNJQSYZMLJLLJKYWXMKJLHSKJGBMCLYYMKXJQLBMLLKMDXXKWYXYSLMLPSJQQJQXYXFJTJDXMXXLLCXQBSYJBGWYMBGGBCYXPJYGPEPFGDJGBHBNSQJYZJKJKHXQFGQZKFHYGKHDKLLSDJQXPQYKYBNQSXQNSZSWHBSXWHXWBZZXDMNSJBSBKBBZKLYLXGWXDRWYQZMYWSJQLCJXXJXKJEQXSCYETLZHLYYYSDZPAQYZCMTLSHTZCFYZYXYLJSDCJQAGYSLCQLYYYSHMRQQKLDXZSCSSSYDYCJYSFSJBFRSSZQSBXXPXJYSDRCKGJLGDKZJZBDKTCSYQPYHSTCLDJDHMXMCGXYZHJDDTMHLTXZXYLYMOHYJCLTYFBQQXPFBDFHHTKSQHZYYWCNXXCRWHOWGYJLEGWDQCWGFJYCSNTMYTOLBYGWQWESJPWNMLRYDZSZTXYQPZGCWXHNGPYXSHMYQJXZTDPPBFYHZHTJYFDZWKGKZBLDNTSXHQEEGZZYLZMMZYJZGXZXKHKSTXNXXWYLYAPSTHXDWHZYMPXAGKYDXBHNHXKDPJNMYHYLPMGOCSLNZHKXXLPZZLBMLSFBHHGYGYYGGBHSCYAQTYWLXTZQCEZYDQDQMMHTKLLSZHLSJZWFYHQSWSCWLQAZYNYTLSXTHAZNKZZSZZLAXXZWWCTGQQTDDYZTCCHYQZFLXPSLZYGPZSZNGLNDQTBDLXGTCTAJDKYWNSYZLJHHZZCWNYYZYWMHYCHHYXHJKZWSXHZYXLYSKQYSPSLYZWMYPPKBYGLKZHTYXAXQSYSHXASMCHKDSCRSWJPWXSGZJLWWSCHSJHSQNHCSEGNDAQTBAALZZMSSTDQJCJKTSCJAXPLGGXHHGXXZCXPDMMHLDGTYBYSJMXHMRCPXXJZCKZXSHMLQXXTTHXWZFKHCCZDYTCJYXQHLXDHYPJQXYLSYYDZOZJNYXQEZYSQYAYXWYPDGXDDXSPPYZNDLTWRHXYDXZZJHTCXMCZLHPYYYYMHZLLHNXMYLLLMDCPPXHMXDKYCYRDLTXJCHHZZXZLCCLYLNZSHZJZZLNNRLWHYQSNJHXYNTTTKYJPYCHHYEGKCTTWLGQRLGGTGTYGYHPYHYLQYQGCWYQKPYYYTTTTLHYHLLTYTTSPLKYZXGZWGPYDSSZZDQXSKCQNMJJZZBXYQMJRTFFBTKHZKBXLJJKDXJTLBWFZPPTKQTZTGPDGNTPJYFALQMKGXBDCLZFHZCLLLLADPMXDJHLCCLGYHDZFGYDDGCYYFGYDXKSSEBDHYKDKDKHNAXXYBPBYYHXZQGAFFQYJXDMLJCSQZLLPCHBSXGJYNDYBYQSPZWJLZKSDDTACTBXZDYZYPJZQSJNKKTKNJDJGYYPGTLFYQKASDNTCYHBLWDZHBBYDWJRYGKZYHEYYFJMSDTYFZJJHGCXPLXHLDWXXJKYTCYKSSSMTWCTTQZLPBSZDZWZXGZAGYKTYWXLHLSPBCLLOQMMZSSLCMBJCSZZKYDCZJGQQDSMCYTZQQLWZQZXSSFPTTFQMDDZDSHDTDWFHTDYZJYQJQKYPBDJYYXTLJHDRQXXXHAYDHRJLKLYTWHLLRLLRCXYLBWSRSZZSYMKZZHHKYHXKSMDSYDYCJPBZBSQLFCXXXNXKXWYWSDZYQOGGQMMYHCDZTTFJYYBGSTTTYBYKJDHKYXBELHTYPJQNFXFDYKZHQKZBYJTZBXHFDXKDASWTAWAJLDYJSFHBLDNNTNQJTJNCHXFJSRFWHZFMDRYJYJWZPDJKZYJYMPCYZNYNXFBYTFYFWYGDBNZZZDNYTXZEMMQBSQEHXFZMBMFLZZSRXYMJGSXWZJSPRYDJSJGXHJJGLJJYNZZJXHGXKYMLPYYYCXYTWQZSWHWLYRJLPXSLSXMFSWWKLCTNXNYNPSJSZHDZEPTXMYYWXYYSYWLXJQZQXZDCLEEELMCPJPCLWBXSQHFWWTFFJTNQJHJQDXHWLBYZNFJLALKYYJLDXHHYCSTYYWNRJYXYWTRMDRQHWQCMFJDYZMHMYYXJWMYZQZXTLMRSPWWCHAQBXYGZYPXYYRRCLMPYMGKSJSZYSRMYJSNXTPLNBAPPYPYLXYYZKYNLDZYJZCZNNLMZHHARQMPGWQTZMXXMLLHGDZXYHXKYXYCJMFFYYHJFSBSSQLXXNDYCANNMTCJCYPRRNYTYQNYYMBMSXNDLYLYSLJRLXYSXQMLLYZLZJJJKYZZCSFBZXXMSTBJGNXYZHLXNMCWSCYZYFZLXBRNNNYLBNRTGZQYSATSWRYHYJZMZDHZGZDWYBSSCSKXSYHYTXXGCQGXZZSHYXJSCRHMKKBXCZJYJYMKQHZJFNBHMQHYSNJNZYBKNQMCLGQHWLZNZSWXKHLJHYYBQLBFCDSXDLDSPFZPSKJYZWZXZDDXJSMMEGJSCSSMGCLXXKYYYLNYPWWWGYDKZJGGGZGGSYCKNJWNJPCXBJJTQTJWDSSPJXZXNZXUMELPXFSXTLLXCLJXJJLJZXCTPSWXLYDHLYQRWHSYCSQYYBYAYWJJJQFWQCQQCJQGXALDBZZYJGKGXPLTZYFXJLTPADKYQHPMATLCPDCKBMTXYBHKLENXDLEEGQDYMSAWHZMLJTWYGXLYQZLJEEYYBQQFFNLYXRDSCTGJGXYYNKLLYQKCCTLHJLQMKKZGCYYGLLLJDZGYDHZWXPYSJBZKDZGYZZHYWYFQYTYZSZYEZZLYMHJJHTSMQWYZLKYYWZCSRKQYTLTDXWCTYJKLWSQZWBDCQYNCJSRSZJLKCDCDTLZZZACQQZZDDXYPLXZBQJYLZLLLQDDZQJYJYJZYXNYYYNYJXKXDAZWYRDLJYYYRJLXLLDYXJCYWYWNQCCLDDNYYYNYCKCZHXXCCLGZQJGKWPPCQQJYSBZZXYJSQPXJPZBSBDSFNSFPZXHDWZTDWPPTFLZZBZDMYYPQJRSDZSQZSQXBDGCPZSWDWCSQZGMDHZXMWWFYBPDGPHTMJTHZSMMBGZMBZJCFZWFZBBZMQCFMBDMCJXLGPNJBBXGYHYYJGPTZGZMQBQTCGYXJXLWZKYDPDYMGCFTPFXYZTZXDZXTGKMTYBBCLBJASKYTSSQYYMSZXFJEWLXLLSZBQJJJAKLYLXLYCCTSXMCWFKKKBSXLLLLJYXTYLTJYYTDPJHNHNNKBYQNFQYYZBYYESSESSGDYHFHWTCJBSDZZTFDMXHCNJZYMQWSRYJDZJQPDQBBSTJGGFBKJBXTGQHNGWJXJGDLLTHZHHYYYYYYSXWTYYYCCBDBPYPZYCCZYJPZYWCBDLFWZCWJDXXHYHLHWZZXJTCZLCDPXUJCZZZLYXJJTXPHFXWPYWXZPTDZZBDZCYHJHMLXBQXSBYLRDTGJRRCTTTHYTCZWMXFYTWWZCWJWXJYWCSKYBZSCCTZQNHXNWXXKHKFHTSWOCCJYBCMPZZYKBNNZPBZHHZDLSYDDYTYFJPXYNGFXBYQXCBHXCPSXTYZDMKYSNXSXLHKMZXLYHDHKWHXXSSKQYHHCJYXGLHZXCSNHEKDTGZXQYPKDHEXTYKCNYMYYYPKQYYYKXZLTHJQTBYQHXBMYHSQCKWWYLLHCYYLNNEQXQWMCFBDCCMLJGGXDQKTLXKGNQCDGZJWYJJLYHHQTTTNWCHMXCXWHWSZJYDJCCDBQCDGDNYXZTHCQRXCBHZTQCBXWGQWYYBXHMBYMYQTYEXMQKYAQYRGYZSLFYKKQHYSSQYSHJGJCNXKZYCXSBXYXHYYLSTYCXQTHYSMGSCPMMGCCCCCMTZTASMGQZJHKLOSQYLSWTMXSYQKDZLJQQYPLSYCZTCQQPBBQJZCLPKHQZYYXXDTDDTSJCXFFLLCHQXMJLWCJCXTSPYCXNDTJSHJWXDQQJSKXYAMYLSJHMLALYKXCYYDMNMDQMXMCZNNCYBZKKYFLMCHCMLHXRCJJHSYLNMTJZGZGYWJXSRXCWJGJQHQZDQJDCJJZKJKGDZQGJJYJYLXZXXCDQHHHEYTMHLFSBDJSYYSHFYSTCZQLPBDRFRZTZYKYWHSZYQKWDQZRKMSYNBCRXQBJYFAZPZZEDZCJYWBCJWHYJBQSZYWRYSZPTDKZPFPBNZTKLQYHBBZPNPPTYZZYBQNYDCPJMMCYCQMCYFZZDCMNLFPBPLNGQJTBTTNJZPZBBZNJKLJQYLNBZQHKSJZNGGQSZZKYXSHPZSNBCGZKDDZQANZHJKDRTLZLSWJLJZLYWTJNDJZJHXYAYNCBGTZCSSQMNJPJYTYSWXZFKWJQTKHTZPLBHSNJZSYZBWZZZZLSYLSBJHDWWQPSLMMFBJDWAQYZTCJTBNNWZXQXCDSLQGDSDPDZHJTQQPSWLYYJZLGYXYZLCTCBJTKTYCZJTQKBSJLGMGZDMCSGPYNJZYQYYKNXRPWSZXMTNCSZZYXYBYHYZAXYWQCJTLLCKJJTJHGDXDXYQYZZBYWDLWQCGLZGJGQRQZCZSSBCRPCSKYDZNXJSQGXSSJMYDNSTZTPBDLTKZWXQWQTZEXNQCZGWEZKSSBYBRTSSSLCCGBPSZQSZLCCGLLLZXHZQTHCZMQGYZQZNMCOCSZJMMZSQPJYGQLJYJPPLDXRGZYXCCSXHSHGTZNLZWZKJCXTCFCJXLBMQBCZZWPQDNHXLJCTHYZLGYLNLSZZPCXDSCQQHJQKSXZPBAJYEMSMJTZDXLCJYRYYNWJBNGZZTMJXLTBSLYRZPYLSSCNXPHLLHYLLQQZQLXYMRSYCXZLMMCZLTZSDWTJJLLNZGGQXPFSKYGYGHBFZPDKMWGHCXMSGDXJMCJZDYCABXJDLNBCDQYGSKYDQTXDJJYXMSZQAZDZFSLQXYJSJZYLBTXXWXQQZBJZUFBBLYLWDSLJHXJYZJWTDJCZFQZQZZDZSXZZQLZCDZFJHYSPYMPQZMLPPLFFXJJNZZYLSJEYQZFPFZKSYWJJJHRDJZZXTXXGLGHYDXCSKYSWMMZCWYBAZBJKSHFHJCXMHFQHYXXYZFTSJYZFXYXPZLCHMZMBXHZZSXYFYMNCWDABAZLXKTCSHHXKXJJZJSTHYGXSXYYHHHJWXKZXSSBZZWHHHCWTZZZPJXSNXQQJGZYZYWLLCWXZFXXYXYHXMKYYSWSQMNLNAYCYSPMJKHWCQHYLAJJMZXHMMCNZHBHXCLXTJPLTXYJHDYYLTTXFSZHYXXSJBJYAYRSMXYPLCKDUYHLXRLNLLSTYZYYQYGYHHSCCSMZCTZQXKYQFPYYRPFFLKQUNTSZLLZMWWTCQQYZWTLLMLMPWMBZSSTZRBPDDTLQJJBXZCSRZQQYGWCSXFWZLXCCRSZDZMCYGGDZQSGTJSWLJMYMMZYHFBJDGYXCCPSHXNZCSBSJYJGJMPPWAFFYFNXHYZXZYLREMZGZCYZSSZDLLJCSQFNXZKPTXZGXJJGFMYYYSNBTYLBNLHPFZDCYFBMGQRRSSSZXYSGTZRNYDZZCDGPJAFJFZKNZBLCZSZPSGCYCJSZLMLRSZBZZLDLSLLYSXSQZQLYXZLSKKBRXBRBZCYCXZZZEEYFGKLZLYYHGZSGZLFJHGTGWKRAAJYZKZQTSSHJJXDCYZUYJLZYRZDQQHGJZXSSZBYKJPBFRTJXLLFQWJHYLQTYMBLPZDXTZYGBDHZZRBGXHWNJTJXLKSCFSMWLSDQYSJTXKZSCFWJLBXFTZLLJZLLQBLSQMQQCGCZFPBPHZCZJLPYYGGDTGWDCFCZQYYYQYSSCLXZSKLZZZGFFCQNWGLHQYZJJCZLQZZYJPJZZBPDCCMHJGXDQDGDLZQMFGPSYTSDYFWWDJZJYSXYYCZCYHZWPBYKXRYLYBHKJKSFXTZJMMCKHLLTNYYMSYXYZPYJQYCSYCWMTJJKQYRHLLQXPSGTLYYCLJSCPXJYZFNMLRGJJTYZBXYZMSJYJHHFZQMSYXRSZCWTLRTQZSSTKXGQKGSPTGCZNJSJCQCXHMXGGZTQYDJKZDLBZSXJLHYQGGGTHQSZPYHJHHGYYGKGGCWJZZYLCZLXQSFTGZSLLLMLJSKCTBLLZZSZMMNYTPZSXQHJCJYQXYZXZQZCPSHKZZYSXCDFGMWQRLLQXRFZTLYSTCTMJCXJJXHJNXTNRZTZFQYHQGLLGCXSZSJDJLJCYDSJTLNYXHSZXCGJZYQPYLFHDJSBPCCZHJJJQZJQDYBSSLLCMYTTMQTBHJQNNYGKYRQYQMZGCJKPDCGMYZHQLLSLLCLMHOLZGDYYFZSLJCQZLYLZQJESHNYLLJXGJXLYSYYYXNBZLJSSZCQQCJYLLZLTJYLLZLLBNYLGQCHXYYXOXCXQKYJXXXYKLXSXXYQXCYKQXQCSGYXXYQXYGYTQOHXHXPYXXXULCYEYCHZZCBWQBBWJQZSCSZSSLZYLKDESJZWMYMCYTSDSXXSCJPQQSQYLYYZYCMDJDZYWCBTJSYDJKCYDDJLBDJJSODZYSYXQQYXDHHGQQYQHDYXWGMMMAJDYBBBPPBCMUUPLJZSMTXERXJMHQNUTPJDCBSSMSSSTKJTSSMMTRCPLZSZMLQDSDMJMQPNQDXCFYNBFSDQXYXHYAYKQYDDLQYYYSSZBYDSLNTFQTZQPZMCHDHCZCWFDXTMYQSPHQYYXSRGJCWTJTZZQMGWJJTJHTQJBBHWZPXXHYQFXXQYWYYHYSCDYDHHQMNMTMWCPBSZPPZZGLMZFOLLCFWHMMSJZTTDHZZYFFYTZZGZYSKYJXQYJZQBHMBZZLYGHGFMSHPZFZSNCLPBQSNJXZSLXXFPMTYJYGBXLLDLXPZJYZJYHHZCYWHJYLSJEXFSZZYWXKZJLUYDTMLYMQJPWXYHXSKTQJEZRPXXZHHMHWQPWQLYJJQJJZSZCPHJLCHHNXJLQWZJHBMZYXBDHHYPZLHLHLGFWLCHYYTLHJXCJMSCPXSTKPNHQXSRTYXXTESYJCTLSSLSTDLLLWWYHDHRJZSFGXTSYCZYNYHTDHWJSLHTZDQDJZXXQHGYLTZPHCSQFCLNJTCLZPFSTPDYNYLGMJLLYCQHYSSHCHYLHQYQTMZYPBYWRFQYKQSYSLZDQJMPXYYSSRHZJNYWTQDFZBWWTWWRXCWHGYHXMKMYYYQMSMZHNGCEPMLQQMTCWCTMMPXJPJJHFXYYZSXZHTYBMSTSYJTTQQQYYLHYNPYQZLCYZHZWSMYLKFJXLWGXYPJYTYSYXYMZCKTTWLKSMZSYLMPWLZWXWQZSSAQSYXYRHSSNTSRAPXCPWCMGDXHXZDZYFJHGZTTSBJHGYZSZYSMYCLLLXBTYXHBBZJKSSDMALXHYCFYGMQYPJYCQXJLLLJGSLZGQLYCJCCZOTYXMTMTTLLWTGPXYMZMKLPSZZZXHKQYSXCTYJZYHXSHYXZKXLZWPSQPYHJWPJPWXQQYLXSDHMRSLZZYZWTTCYXYSZZSHBSCCSTPLWSSCJCHNLCGCHSSPHYLHFHHXJSXYLLNYLSZDHZXYLSXLWZYKCLDYAXZCMDDYSPJTQJZLNWQPSSSWCTSTSZLBLNXSMNYYMJQBQHRZWTYYDCHQLXKPZWBGQYBKFCMZWPZLLYYLSZYDWHXPSBCMLJBSCGBHXLQHYRLJXYSWXWXZSLDFHLSLYNJLZYFLYJYCDRJLFSYZFSLLCQYQFGJYHYXZLYLMSTDJCYHBZLLNWLXXYGYYHSMGDHXXHHLZZJZXCZZZCYQZFNGWPYLCPKPYYPMCLQKDGXZGGWQBDXZZKZFBXXLZXJTPJPTTBYTSZZDWSLCHZHSLTYXHQLHYXXXYYZYSWTXZKHLXZXZPYHGCHKCFSYHUTJRLXFJXPTZTWHPLYXFCRHXSHXKYXXYHZQDXQWULHYHMJTBFLKHTXCWHJFWJCFPQRYQXCYYYQYGRPYWSGSUNGWCHKZDXYFLXXHJJBYZWTSXXNCYJJYMSWZJQRMHXZWFQSYLZJZGBHYNSLBGTTCSYBYXXWXYHXYYXNSQYXMQYWRGYQLXBBZLJSYLPSYTJZYHYZAWLRORJMKSCZJXXXYXCHDYXRYXXJDTSQFXLYLTSFFYXLMTYJMJUYYYXLTZCSXQZQHZXLYYXZHDNBRXXXJCTYHLBRLMBRLLAXKYLLLJLYXXLYCRYLCJTGJCMTLZLLCYZZPZPCYAWHJJFYBDYYZSMPCKZDQYQPBPCJPDCYZMDPBCYYDYCNNPLMTMLRMFMMGWYZBSJGYGSMZQQQZTXMKQWGXLLPJGZBQCDJJJFPKJKCXBLJMSWMDTQJXLDLPPBXCWRCQFBFQJCZAHZGMYKPHYYHZYKNDKZMBPJYXPXYHLFPNYYGXJDBKXNXHJMZJXSTRSTLDXSKZYSYBZXJLXYSLBZYSLHXJPFXPQNBYLLJQKYGZMCYZZYMCCSLCLHZFWFWYXZMWSXTYNXJHPYYMCYSPMHYSMYDYSHQYZCHMJJMZCAAGCFJBBHPLYZYLXXSDJGXDHKXXTXXNBHRMLYJSLTXMRHNLXQJXYZLLYSWQGDLBJHDCGJYQYCMHWFMJYBMBYJYJWYMDPWHXQLDYGPDFXXBCGJSPCKRSSYZJMSLBZZJFLJJJLGXZGYXYXLSZQYXBEXYXHGCXBPLDYHWETTWWCJMBTXCHXYQXLLXFLYXLLJLSSFWDPZSMYJCLMWYTCZPCHQEKCQBWLCQYDPLQPPQZQFJQDJHYMMCXTXDRMJWRHXCJZYLQXDYYNHYYHRSLSRSYWWZJYMTLTLLGTQCJZYABTCKZCJYCCQLJZQXALMZYHYWLWDXZXQDLLQSHGPJFJLJHJABCQZDJGTKHSSTCYJLPSWZLXZXRWGLDLZRLZXTGSLLLLZLYXXWGDZYGBDPHZPBRLWSXQBPFDWOFMWHLYPCBJCCLDMBZPBZZLCYQXLDOMZBLZWPDWYYGDSTTHCSQSCCRSSSYSLFYBFNTYJSZDFNDPDHDZZMBBLSLCMYFFGTJJQWFTMTPJWFNLBZCMMJTGBDZLQLPYFHYYMJYLSDCHDZJWJCCTLJCLDTLJJCPDDSQDSSZYBNDBJLGGJZXSXNLYCYBJXQYCBYLZCFZPPGKCXZDZFZTJJFJSJXZBNZYJQTTYJYHTYCZHYMDJXTTMPXSPLZCDWSLSHXYPZGTFMLCJTYCBPMGDKWYCYZCDSZZYHFLYCTYGWHKJYYLSJCXGYWJCBLLCSNDDBTZBSCLYZCZZSSQDLLMQYYHFSLQLLXFTYHABXGWNYWYYPLLSDLDLLBJCYXJZMLHLJDXYYQYTDLLLBUGBFDFBBQJZZMDPJHGCLGMJJPGAEHHBWCQXAXHHHZCHXYPHJAXHLPHJPGPZJQCQZGJJZZUZDMQYYBZZPHYHYBWHAZYJHYKFGDPFQSDLZMLJXKXGALXZDAGLMDGXMWZQYXXDXXPFDMMSSYMPFMDMMKXKSYZYSHDZKXSYSMMZZZMSYDNZZCZXFPLSTMZDNMXCKJMZTYYMZMZZMSXHHDCZJEMXXKLJSTLWLSQLYJZLLZJSSDPPMHNLZJCZYHMXXHGZCJMDHXTKGRMXFWMCGMWKDTKSXQMMMFZZYDKMSCLCMPCGMHSPXQPZDSSLCXKYXTWLWJYAHZJGZQMCSNXYYMMPMLKJXMHLMLQMXCTKZMJQYSZJSYSZHSYJZJCDAJZYBSDQJZGWZQQXFKDMSDJLFWEHKZQKJPEYPZYSZCDWYJFFMZZYLTTDZZEFMZLBNPPLPLPEPSZALLTYLKCKQZKGENQLWAGYXYDPXLHSXQQWQCQXQCLHYXXMLYCCWLYMQYSKGCHLCJNSZKPYZKCQZQLJPDMDZHLASXLBYDWQLWDNBQCRYDDZTJYBKBWSZDXDTNPJDTCTQDFXQQMGNXECLTTBKPWSLCTYQLPWYZZKLPYGZCQQPLLKCCYLPQMZCZQCLJSLQZDJXLDDHPZQDLJJXZQDXYZQKZLJCYQDYJPPYPQYKJYRMPCBYMCXKLLZLLFQPYLLLMBSGLCYSSLRSYSQTMXYXZQZFDZUYSYZTFFMZZSMZQHZSSCCMLYXWTPZGXZJGZGSJSGKDDHTQGGZLLBJDZLCBCHYXYZHZFYWXYZYMSDBZZYJGTSMTFXQYXQSTDGSLNXDLRYZZLRYYLXQHTXSRTZNGZXBNQQZFMYKMZJBZYMKBPNLYZPBLMCNQYZZZSJZHJCTZKHYZZJRDYZHNPXGLFZTLKGJTCTSSYLLGZRZBBQZZKLPKLCZYSSUYXBJFPNJZZXCDWXZYJXZZDJJKGGRSRJKMSMZJLSJYWQSKYHQJSXPJZZZLSNSHRNYPZTWCHKLPSRZLZXYJQXQKYSJYCZTLQZYBBYBWZPQDWWYZCYTJCJXCKCWDKKZXSGKDZXWWYYJQYYTCYTDLLXWKCZKKLCCLZCQQDZLQLCSFQCHQHSFSMQZZLNBJJZBSJHTSZDYSJQJPDLZCDCWJKJZZLPYCGMZWDJJBSJQZSYZYHHXJPBJYDSSXDZNCGLQMBTSFSBPDZDLZNFGFJGFSMPXJQLMBLGQCYYXBQKDJJQYRFKZTJDHCZKLBSDZCFJTPLLJGXHYXZCSSZZXSTJYGKGCKGYOQXJPLZPBPGTGYJZGHZQZZLBJLSQFZGKQQJZGYCZBZQTLDXRJXBSXXPZXHYZYCLWDXJJHXMFDZPFZHQHQMQGKSLYHTYCGFRZGNQXCLPDLBZCSCZQLLJBLHBZCYPZZPPDYMZZSGYHCKCPZJGSLJLNSCDSLDLXBMSTLDDFJMKDJDHZLZXLSZQPQPGJLLYBDSZGQLBZLSLKYYHZTTNTJYQTZZPSZQZTLLJTYYLLQLLQYZQLBDZLSLYYZYMDFSZSNHLXZNCZQZPBWSKRFBSYZMTHBLGJPMCZZLSTLXSHTCSYZLZBLFEQHLXFLCJLYLJQCBZLZJHHSSTBRMHXZHJZCLXFNBGXGTQJCZTMSFZKJMSSNXLJKBHSJXNTNLZDNTLMSJXGZJYJCZXYJYJWRWWQNZTNFJSZPZSHZJFYRDJSFSZJZBJFZQZZHZLXFYSBZQLZSGYFTZDCSZXZJBQMSZKJRHYJZCKMJKHCHGTXKXQGLXPXFXTRTYLXJXHDTSJXHJZJXZWZLCQSBTXWXGXTXXHXFTSDKFJHZYJFJXRZSDLLLTQSQQZQWZXSYQTWGWBZCGZLLYZBCLMQQTZHZXZXLJFRMYZFLXYSQXXJKXRMQDZDMMYYBSQBHGZMWFWXGMXLZPYYTGZYCCDXYZXYWGSYJYZNBHPZJSQSYXSXRTFYZGRHZTXSZZTHCBFCLSYXZLZQMZLMPLMXZJXSFLBYZMYQHXJSXRXSQZZZSSLYFRCZJRCRXHHZXQYDYHXSJJHZCXZBTYNSYSXJBQLPXZQPYMLXZKYXLXCJLCYSXXZZLXDLLLJJYHZXGYJWKJRWYHCPSGNRZLFZWFZZNSXGXFLZSXZZZBFCSYJDBRJKRDHHGXJLJJTGXJXXSTJTJXLYXQFCSGSWMSBCTLQZZWLZZKXJMLTMJYHSDDBXGZHDLBMYJFRZFSGCLYJBPMLYSMSXLSZJQQHJZFXGFQFQBPXZGYYQXGZTCQWYLTLGWSGWHRLFSFGZJMGMGBGTJFSYZZGZYZAFLSSPMLPFLCWBJZCLJJMZLPJJLYMQDMYYYFBGYGYZMLYZDXQYXRQQQHSYYYQXYLJTYXFSFSLLGNQCYHYCWFHCCCFXPYLYPLLZYXXXXXKQHHXSHJZCFZSCZJXCPZWHHHHHAPYLQALPQAFYHXDYLUKMZQGGGDDESRNNZLTZGCHYPPYSQJJHCLLJTOLNJPZLJLHYMHEYDYDSQYCDDHGZUNDZCLZYZLLZNTNYZGSLHSLPJJBDGWXPCDUTJCKLKCLWKLLCASSTKZZDNQNTTLYYZSSYSSZZRYLJQKCQDHHCRXRZYDGRGCWCGZQFFFPPJFZYNAKRGYWYQPQXXFKJTSZZXSWZDDFBBXTBGTZKZNPZZPZXZPJSZBMQHKCYXYLDKLJNYPKYGHGDZJXXEAHPNZKZTZCMXCXMMJXNKSZQNMNLWBWWXJKYHCPSTMCSQTZJYXTPCTPDTNNPGLLLZSJLSPBLPLQHDTNJNLYYRSZFFJFQWDPHZDWMRZCCLODAXNSSNYZRESTYJWJYJDBCFXNMWTTBYLWSTSZGYBLJPXGLBOCLHPCBJLTMXZLJYLZXCLTPNCLCKXTPZJSWCYXSFYSZDKNTLBYJCYJLLSTGQCBXRYZXBXKLYLHZLQZLNZCXWJZLJZJNCJHXMNZZGJZZXTZJXYCYYCXXJYYXJJXSSSJSTSSTTPPGQTCSXWZDCSYFPTFBFHFBBLZJCLZZDBXGCXLQPXKFZFLSYLTUWBMQJHSZBMDDBCYSCCLDXYCDDQLYJJWMQLLCSGLJJSYFPYYCCYLTJANTJJPWYCMMGQYYSXDXQMZHSZXPFTWWZQSWQRFKJLZJQQYFBRXJHHFWJJZYQAZMYFRHCYYBYQWLPEXCCZSTYRLTTDMQLYKMBBGMYYJPRKZNPBSXYXBHYZDJDNGHPMFSGMWFZMFQMMBCMZZCJJLCNUXYQLMLRYGQZCYXZLWJGCJCGGMCJNFYZZJHYCPRRCMTZQZXHFQGTJXCCJEAQCRJYHPLQLSZDJRBCQHQDYRHYLYXJSYMHZYDWLDFRYHBPYDTSSCNWBXGLPZMLZZTQSSCPJMXXYCSJYTYCGHYCJWYRXXLFEMWJNMKLLSWTXHYYYNCMMCWJDQDJZGLLJWJRKHPZGGFLCCSCZMCBLTBHBQJXQDSPDJZZGKGLFQYWBZYZJLTSTDHQHCTCBCHFLQMPWDSHYYTQWCNZZJTLBYMBPDYYYXSQKXWYYFLXXNCWCXYPMAELYKKJMZZZBRXYYQJFLJPFHHHYTZZXSGQQMHSPGDZQWBWPJHZJDYSCQWZKTXXSQLZYYMYSDZGRXCKKUJLWPYSYSCSYZLRMLQSYLJXBCXTLWDQZPCYCYKPPPNSXFYZJJRCEMHSZMSXLXGLRWGCSTLRSXBZGBZGZTCPLUJLSLYLYMTXMTZPALZXPXJTJWTCYYZLBLXBZLQMYLXPGHDSLSSDMXMBDZZSXWHAMLCZCPJMCNHJYSNSYGCHSKQMZZQDLLKABLWJXSFMOCDXJRRLYQZKJMYBYQLYHETFJZFRFKSRYXFJTWDSXXSYSQJYSLYXWJHSNLXYYXHBHAWHHJZXWMYLJCSSLKYDZTXBZSYFDXGXZJKHSXXYBSSXDPYNZWRPTQZCZENYGCXQFJYKJBZMLJCMQQXUOXSLYXXLYLLJDZBTYMHPFSTTQQWLHOKYBLZZALZXQLHZWRRQHLSTMYPYXJJXMQSJFNBXYXYJXXYQYLTHYLQYFMLKLJTMLLHSZWKZHLJMLHLJKLJSTLQXYLMBHHLNLZXQJHXCFXXLHYHJJGBYZZKBXSCQDJQDSUJZYYHZHHMGSXCSYMXFEBCQWWRBPYYJQTYZCYQYQQZYHMWFFHGZFRJFCDPXNTQYZPDYKHJLFRZXPPXZDBBGZQSTLGDGYLCQMLCHHMFYWLZYXKJLYPQHSYWMQQGQZMLZJNSQXJQSYJYCBEHSXFSZPXZWFLLBCYYJDYTDTHWZSFJMQQYJLMQXXLLDTTKHHYBFPWTYYSQQWNQWLGWDEBZWCMYGCULKJXTMXMYJSXHYBRWFYMWFRXYQMXYSZTZZTFYKMLDHQDXWYYNLCRYJBLPSXCXYWLSPRRJWXHQYPHTYDNXHHMMYWYTZCSQMTSSCCDALWZTCPQPYJLLQZYJSWXMZZMMYLMXCLMXCZMXMZSQTZPPQQBLPGXQZHFLJJHYTJSRXWZXSCCDLXTYJDCQJXSLQYCLZXLZZXMXQRJMHRHZJBHMFLJLMLCLQNLDXZLLLPYPSYJYSXCQQDCMQJZZXHNPNXZMEKMXHYKYQLXSXTXJYYHWDCWDZHQYYBGYBCYSCFGPSJNZDYZZJZXRZRQJJYMCANYRJTLDPPYZBSTJKXXZYPFDWFGZZRPYMTNGXZQBYXNBUFNQKRJQZMJEGRZGYCLKXZDSKKNSXKCLJSPJYYZLQQJYBZSSQLLLKJXTBKTYLCCDDBLSPPFYLGYDTZJYQGGKQTTFZXBDKTYYHYBBFYTYYBCLPDYTGDHRYRNJSPTCSNYJQHKLLLZSLYDXXWBCJQSPXBPJZJCJDZFFXXBRMLAZHCSNDLBJDSZBLPRZTSWSBXBCLLXXLZDJZSJPYLYXXYFTFFFBHJJXGBYXJPMMMPSSJZJMTLYZJXSWXTYLEDQPJMYGQZJGDJLQJWJQLLSJGJGYGMSCLJJXDTYGJQJQJCJZCJGDZZSXQGSJGGCXHQXSNQLZZBXHSGZXCXYLJXYXYYDFQQJHJFXDHCTXJYRXYSQTJXYEFYYSSYYJXNCYZXFXMSYSZXYYSCHSHXZZZGZZZGFJDLTYLNPZGYJYZYYQZPBXQBDZTZCZYXXYHHSQXSHDHGQHJHGYWSZTMZMLHYXGEBTYLZKQWYTJZRCLEKYSTDBCYKQQSAYXCJXWWGSBHJYZYDHCSJKQCXSWXFLTYNYZPZCCZJQTZWJQDZZZQZLJJXLSBHPYXXPSXSHHEZTXFPTLQYZZXHYTXNCFZYYHXGNXMYWXTZSJPTHHGYMXMXQZXTSBCZYJYXXTYYZYPCQLMMSZMJZZLLZXGXZAAJZYXJMZXWDXZSXZDZXLEYJJZQBHZWZZZQTZPSXZTDSXJJJZNYAZPHXYYSRNQDTHZHYYKYJHDZXZLSWCLYBZYECWCYCRYLCXNHZYDZYDYJDFRJJHTRSQTXYXJRJHOJYNXELXSFSFJZGHPZSXZSZDZCQZBYYKLSGSJHCZSHDGQGXYZGXCHXZJWYQWGYHKSSEQZZNDZFKWYSSTCLZSTSYMCDHJXXYWEYXCZAYDMPXMDSXYBSQMJMZJMTZQLPJYQZCGQHXJHHLXXHLHDLDJQCLDWBSXFZZYYSCHTYTYYBHECXHYKGJPXHHYZJFXHWHBDZFYZBCAPNPGNYDMSXHMMMMAMYNBYJTMPXYYMCTHJBZYFCGTYHWPHFTWZZEZSBZEGPFMTSKFTYCMHFLLHGPZJXZJGZJYXZSBBQSCZZLZCCSTPGXMJSFTCCZJZDJXCYBZLFCJSYZFGSZLYBCWZZBYZDZYPSWYJZXZBDSYUXLZZBZFYGCZXBZHZFTPBGZGEJBSTGKDMFHYZZJHZLLZZGJQZLSFDJSSCBZGPDLFZFZSZYZYZSYGCXSNXXCHCZXTZZLJFZGQSQYXZJQDCCZTQCDXZJYQJQCHXZTDLGSCXZSYQJQTZWLQDQZTQCHQQJZYEZZZPBWKDJFCJPZTYPQYQTTYNLMBDKTJZPQZQZZFPZSBNJLGYJDXJDZZKZGQKXDLPZJTCJDQBXDJQJSTCKNXBXZMSLYJCQMTJQWWCJQNJNLLLHJCWQTBZQYDZCZPZZDZYDDCYZZZCCJTTJFZDPRRTZTJDCQTQZDTJNPLZBCLLCTZSXKJZQZPZLBZRBTJDCXFCZDBCCJJLTQQPLDCGZDBBZJCQDCJWYNLLZYZCCDWLLXWZLXRXNTQQCZXKQLSGDFQTDDGLRLAJJTKUYMKQLLTZYTDYYCZGJWYXDXFRSKSTQTENQMRKQZHHQKDLDAZFKYPBGGPZREBZZYKZZSPEGJXGYKQZZZSLYSYYYZWFQZYLZZLZHWCHKYPQGNPGBLPLRRJYXCCSYYHSFZFYBZYYTGZXYLXCZWXXZJZBLFFLGSKHYJZEYJHLPLLLLCZGXDRZELRHGKLZZYHZLYQSZZJZQLJZFLNBHGWLCZCFJYSPYXZLZLXGCCPZBLLCYBBBBUBBCBPCRNNZCZYRBFSRLDCGQYYQXYGMQZWTZYTYJXYFWTEHZZJYWLCCNTZYJJZDEDPZDZTSYQJHDYMBJNYJZLXTSSTPHNDJXXBYXQTZQDDTJTDYYTGWSCSZQFLSHLGLBCZPHDLYZJYCKWTYTYLBNYTSDSYCCTYSZYYEBHEXHQDTWNYGYCLXTSZYSTQMYGZAZCCSZZDSLZCLZRQXYYELJSBYMXSXZTEMBBLLYYLLYTDQYSHYMRQWKFKBFXNXSBYCHXBWJYHTQBPBSBWDZYLKGZSKYHXQZJXHXJXGNLJKZLYYCDXLFYFGHLJGJYBXQLYBXQPQGZTZPLNCYPXDJYQYDYMRBESJYYHKXXSTMXRCZZYWXYQYBMCLLYZHQYZWQXDBXBZWZMSLPDMYSKFMZKLZCYQYCZLQXFZZYDQZPZYGYJYZMZXDZFYFYTTQTZHGSPCZMLCCYTZXJCYTJMKSLPZHYSNZLLYTPZCTZZCKTXDHXXTQCYFKSMQCCYYAZHTJPCYLZLYJBJXTPNYLJYYNRXSYLMMNXJSMYBCSYSYLZYLXJJQYLDZLPQBFZZBLFNDXQKCZFYWHGQMRDSXYCYTXNQQJZYYPFZXDYZFPRXEJDGYQBXRCNFYYQPGHYJDYZXGRHTKYLNWDZNTSMPKLBTHBPYSZBZTJZSZZJTYYXZPHSSZZBZCZPTQFZMYFLYPYBBJQXZMXXDJMTSYSKKBJZXHJCKLPSMKYJZCXTMLJYXRZZQSLXXQPYZXMKYXXXJCLJPRMYYGADYSKQLSNDHYZKQXZYZTCGHZTLMLWZYBWSYCTBHJHJFCWZTXWYTKZLXQSHLYJZJXTMPLPYCGLTBZZTLZJCYJGDTCLKLPLLQPJMZPAPXYZLKKTKDZCZZBNZDYDYQZJYJGMCTXLTGXSZLMLHBGLKFWNWZHDXUHLFMKYSLGXDTWWFRJEJZTZHYDXYKSHWFZCQSHKTMQQHTZHYMJDJSKHXZJZBZZXYMPAGQMSTPXLSKLZYNWRTSQLSZBPSPSGZWYHTLKSSSWHZZLYYTNXJGMJSZSUFWNLSOZTXGXLSAMMLBWLDSZYLAKQCQCTMYCFJBSLXCLZZCLXXKSBZQCLHJPSQPLSXXCKSLNHPSFQQYTXYJZLQLDXZQJZDYYDJNZPTUZDSKJFSLJHYLZSQZLBTXYDGTQFDBYAZXDZHZJNHHQBYKNXJJQCZMLLJZKSPLDYCLBBLXKLELXJLBQYCXJXGCNLCQPLZLZYJTZLJGYZDZPLTQCSXFDMNYCXGBTJDCZNBGBQYQJWGKFHTNPYQZQGBKPBBYZMTJDYTBLSQMPSXTBNPDXKLEMYYCJYNZCTLDYKZZXDDXHQSHDGMZSJYCCTAYRZLPYLTLKXSLZCGGEXCLFXLKJRTLQJAQZNCMBYDKKCXGLCZJZXJHPTDJJMZQYKQSECQZDSHHADMLZFMMZBGNTJNNLGBYJBRBTMLBYJDZXLCJLPLDLPCQDHLXZLYCBLCXZZJADJLNZMMSSSMYBHBSQKBHRSXXJMXSDZNZPXLGBRHWGGFCXGMSKLLTSJYYCQLTSKYWYYHYWXBXQYWPYWYKQLSQPTNTKHQCWDQKTWPXXHCPTHTWUMSSYHBWCRWXHJMKMZNGWTMLKFGHKJYLSYYCXWHYECLQHKQHTTQKHFZLDXQWYZYYDESBPKYRZPJFYYZJCEQDZZDLATZBBFJLLCXDLMJSSXEGYGSJQXCWBXSSZPDYZCXDNYXPPZYDLYJCZPLTXLSXYZYRXCYYYDYLWWNZSAHJSYQYHGYWWAXTJZDAXYSRLTDPSSYYFNEJDXYZHLXLLLZQZSJNYQYQQXYJGHZGZCYJCHZLYCDSHWSHJZYJXCLLNXZJJYYXNFXMWFPYLCYLLABWDDHWDXJMCXZTZPMLQZHSFHZYNZTLLDYWLSLXHYMMYLMBWWKYXYADTXYLLDJPYBPWUXJMWMLLSAFDLLYFLBHHHBQQLTZJCQJLDJTFFKMMMBYTHYGDCQRDDWRQJXNBYSNWZDBYYTBJHPYBYTTJXAAHGQDQTMYSTQXKBTZPKJLZRBEQQSSMJJBDJOTGTBXPGBKTLHQXJJJCTHXQDWJLWRFWQGWSHCKRYSWGFTGYGBXSDWDWRFHWYTJJXXXJYZYSLPYYYPAYXHYDQKXSHXYXGSKQHYWFDDDPPLCJLQQEEWXKSYYKDYPLTJTHKJLTCYYHHJTTPLTZZCDLTHQKZXQYSTEEYWYYZYXXYYSTTJKLLPZMCYHQGXYHSRMBXPLLNQYDQHXSXXWGDQBSHYLLPJJJTHYJKYPPTHYYKTYEZYENMDSHLCRPQFDGFXZPSFTLJXXJBSWYYSKSFLXLPPLBBBLBSFXFYZBSJSSYLPBBFFFFSSCJDSTZSXZRYYSYFFSYZYZBJTBCTSBSDHRTJJBYTCXYJEYLXCBNEBJDSYXYKGSJZBXBYTFZWGENYHHTHZHHXFWGCSTBGXKLSXYWMTMBYXJSTZSCDYQRCYTWXZFHMYMCXLZNSDJTTTXRYCFYJSBSDYERXJLJXBBDEYNJGHXGCKGSCYMBLXJMSZNSKGXFBNBPTHFJAAFXYXFPXMYPQDTZCXZZPXRSYWZDLYBBKTYQPQJPZYPZJZNJPZJLZZFYSBTTSLMPTZRTDXQSJEHBZYLZDHLJSQMLHTXTJECXSLZZSPKTLZKQQYFSYGYWPCPQFHQHYTQXZKRSGTTSQCZLPTXCDYYZXSQZSLXLZMYCPCQBZYXHBSXLZDLTCDXTYLZJYYZPZYZLTXJSJXHLPMYTXCQRBLZSSFJZZTNJYTXMYJHLHPPLCYXQJQQKZZSCPZKSWALQSBLCCZJSXGWWWYGYKTJBBZTDKHXHKGTGPBKQYSLPXPJCKBMLLXDZSTBKLGGQKQLSBKKTFXRMDKBFTPZFRTBBRFERQGXYJPZSSTLBZTPSZQZSJDHLJQLZBPMSMMSXLQQNHKNBLRDDNXXDHDDJCYYGYLXGZLXSYGMQQGKHBPMXYXLYTQWLWGCPBMQXCYZYDRJBHTDJYHQSHTMJSBYPLWHLZFFNYPMHXXHPLTBQPFBJWQDBYGPNZTPFZJGSDDTQSHZEAWZZYLLTYYBWJKXXGHLFKXDJTMSZSQYNZGGSWQSPHTLSSKMCLZXYSZQZXNCJDQGZDLFNYKLJCJLLZLMZZNHYDSSHTHZZLZZBBHQZWWYCRZHLYQQJBEYFXXXWHSRXWQHWPSLMSSKZTTYGYQQWRSLALHMJTQJSMXQBJJZJXZYZKXBYQXBJXSHZTSFJLXMXZXFGHKZSZGGYLCLSARJYHSLLLMZXELGLXYDJYTLFBHBPNLYZFBBHPTGJKWETZHKJJXZXXGLLJLSTGSHJJYQLQZFKCGNNDJSSZFDBCTWWSEQFHQJBSAQTGYPQLBXBMMYWXGSLZHGLZGQYFLZBYFZJFRYSFMBYZHQGFWZSYFYJJPHZBYYZFFWODGRLMFTWLBZGYCQXCDJYGZYYYYTYTYDWEGAZYHXJLZYYHLRMGRXXZCLHNELJJTJTPWJYBJJBXJJTJTEEKHWSLJPLPSFYZPQQBDLQJJTYYQLYZKDKSQJYYQZLDQTGJQYZJSUCMRYQTHTEJMFCTYHYPKMHYZWJDQFHYYXWSHCTXRLJHQXHCCYYYJLTKTTYTMXGTCJTZAYYOCZLYLBSZYWJYTSJYHBYSHFJLYGJXXTMZYYLTXXYPZLXYJZYZYYPNHMYMDYYLBLHLSYYQQLLNJJYMSOYQBZGDLYXYLCQYXTSZEGXHZGLHWBLJHEYXTWQMAKBPQCGYSHHEGQCMWYYWLJYJHYYZLLJJYLHZYHMGSLJLJXCJJYCLYCJPCPZJZJMMYLCQLNQLJQJSXYJMLSZLJQLYCMMHCFMMFPQQMFYLQMCFFQMMMMHMZNFHHJGTTHHKHSLNCHHYQDXTMMQDCYZYXYQMYQYLTDCYYYZAZZCYMZYDLZFFFMMYCQZWZZMABTBYZTDMNZZGGDFTYPCGQYTTSSFFWFDTZQSSYSTWXJHXYTSXXYLBYQHWWKXHZXWZNNZZJZJJQJCCCHYYXBZXZCYZTLLCQXYNJYCYYCYNZZQYYYEWYCZDCJYCCHYJLBTZYYCQWMPWPYMLGKDLDLGKQQBGYCHJXY";
    $.fisrtPinyin = function(ch) {
        var uni = ch.charCodeAt(0);
        if (uni >= 48 && uni <= 57) {
            return "1";
        }
        if (uni >= 65 && uni <=90) {
            return uni;
        }
        if (uni >= 97 && uni <=122) {
            return String.fromCharCode(uni-32);
        }
        if (uni > 40869 || uni < 19968) //����ں��ִ��?Χ֮��,����#
            return "#";
        return strChineseFirstPY.charAt(uni - 19968);
    };
}($));
(function($) {
    $.getImageData = function(img, width, height) {
        var canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        var ctx = canvas.getContext("2d");
        ctx.drawImage(img[0], 0, 0, width, height);

        return canvas.toDataURL("image/png");
    };
}($));
(function($) {
    $.createStyleSheet = function() {
        var stylesheet = document.createElement('style');
        stylesheet.type = "text/css";
        document.getElementsByTagName("head")[0].appendChild(stylesheet);
        return document.styleSheets[document.styleSheets.length - 1];
    };
    $.insertStyleSheet = function(stylesheet, selectorText, cssText) {
        cssText = cssText + ' !important';
        var index = stylesheet.cssRules.length;
        stylesheet.insertRule(selectorText + ' {' + cssText + '}', index);
    };
    $.removeStyleSheet = function(stylesheet, selectorText) {
        var cssrules = stylesheet.cssRules;
        var index = _.findIndex(cssrules, function(obj){
            return obj.selectorText == selectorText;
        });
        if (index != -1) {
            stylesheet.deleteRule(index);
        }
    };
    $.upsertStyleSheet = function(stylesheet, selectorText, cssText) {
        cssText = cssText + ' !important';
        var cssrules = stylesheet.cssRules;
        var index = _.findIndex(cssrules, function(obj){
            return obj.selectorText == selectorText;
        });
        if (index != -1) {
            stylesheet.deleteRule(index);
        }
        index = stylesheet.cssRules.length;
        stylesheet.insertRule(selectorText + ' {' + cssText + '}', index);
    };
}($));
(function($) {
    var keys = Object.keys || function(obj) {
            obj = Object(obj);
            var arr = [];
            for (var a in obj) arr.push(a);
            return arr;
        };
    var invert = function(obj) {
        obj = Object(obj);
        var result = {};
        for (var a in obj) result[obj[a]] = a;
        return result;
    };
    var entityMap = {
        escape: {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
            ' ': '&nbsp;',
            '\n': '<br>'
        }
    };
    entityMap.unescape = invert(entityMap.escape);
    var entityReg = {
        escape: RegExp('[' + keys(entityMap.escape).join('') + ']', 'g'),
        unescape: RegExp('(' + keys(entityMap.unescape).join('|') + ')', 'g')
    };

// ��HTMLת��Ϊʵ��
    $.escape = function(html) {
        if (typeof html !== 'string') return '';
        return html.replace(entityReg.escape, function(match) {
            return entityMap.escape[match];
        })
    }
// ��ʵ��ת��ΪHTML
    $.unescape = function(str) {
        if (typeof str !== 'string') return '';
        return str.replace(entityReg.unescape, function(match) {
            return entityMap.unescape[match];
        })
    }
}($));
(function($) {
    var ImgTouchCanvas = function(options) {
        this.canvas         = options.canvas;
        this.canvas.width   = this.canvas.clientWidth;
        this.canvas.height  = this.canvas.clientHeight;
        this.context        = this.canvas.getContext('2d');

        this.position = {x: 0,y: 0};
        this.scale = {x: 0.5,y: 0.5};
        this.imgTexture = new Image();
        this.imgTexture.src = options.path;
        var that = this;
        this.imgTexture.onload = function() {
            that.lastZoomScale = null;
            that.lastX = null;
            that.lastY = null;

            that.init = false;
            that.checkRequestAnimationFrame();
            that.setEventListeners();
            requestAnimationFrame(that.animate.bind(that));

        }
    };


    ImgTouchCanvas.prototype = {
        animate: function() {
            //set scale such as image cover all the canvas
            if(!this.init) {
                if(this.imgTexture.width) {/*
                    var scaleRatio = null;
                    if(this.canvas.clientWidth > this.canvas.clientHeight) {
                        scaleRatio = this.canvas.clientWidth / this.imgTexture.width;
                    }
                    else {
                        scaleRatio = this.canvas.clientHeight / this.imgTexture.height;
                    }

                    this.scale.x = scaleRatio;
                    this.scale.y = scaleRatio;*/
                    var imgw = this.imgTexture.width;
                    var imgh = this.imgTexture.height;
                    var canw = this.canvas.clientWidth;
                    var canh = this.canvas.clientHeight;
                    var rw = (imgw <= canw)?1:canw/imgw;
                    var rh = (imgh <= canh)?1:canh/imgh;
                    var r = Math.min(rw, rh);
                    var x = (canw-imgw*r)/2;
                    var y = (canh-imgh*r)/2;

                    this.scale.x = r;
                    this.scale.y = r;
                    this.position.x = x;
                    this.position.y = y;
                    this.init = true;


                    this.init = true;
                }
            }

            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.context.drawImage(
                this.imgTexture,
                this.position.x, this.position.y,
                this.scale.x * this.imgTexture.width,
                this.scale.y * this.imgTexture.height);
            requestAnimationFrame(this.animate.bind(this));
        },
        doZoom: function(e) {
            var zoom = 0;
            if( event.targetTouches.length >= 2 ) {
                var p1 = event.targetTouches[0];
                var p2 = event.targetTouches[1];
                var zoomScale = Math.sqrt(Math.pow(p2.pageX - p1.pageX, 2) + Math.pow(p2.pageY - p1.pageY, 2)); //euclidian distance
                if( this.lastZoomScale ) {
                    zoom = zoomScale - this.lastZoomScale;
                }
                this.lastZoomScale = zoomScale;
            }
            if (!zoom) {
                return;
            }
            zoom = zoom/100;
            //new scale
            var x = this.imgTexture.width*zoom/2;
            var y = this.imgTexture.height*zoom/2;
            //finally affectations
            this.scale.x += zoom;
            this.scale.y += zoom;
            this.position.x -= x;
            this.position.y -= y;
        },

        doMove: function(e) {
            var relativeX = e.targetTouches[0].pageX - this.canvas.getBoundingClientRect().left;
            var relativeY = e.targetTouches[0].pageY - this.canvas.getBoundingClientRect().top;
            if(this.lastX && this.lastY) {
                var deltaX = relativeX - this.lastX;
                var deltaY = relativeY - this.lastY;
                var currentWidth = (this.imgTexture.width * this.scale.x);
                var currentHeight = (this.imgTexture.height * this.scale.y);

                this.position.x += deltaX;
                this.position.y += deltaY;


                //edge cases
                if( this.position.x+currentWidth < this.canvas.clientWidth/2 ) {
                    this.position.x = this.canvas.clientWidth/2-currentWidth;
                }
                else if( this.position.x > this.canvas.clientWidth/2) {
                    this.position.x = this.canvas.clientWidth/2;
                }
                if( this.position.y+currentHeight < this.canvas.clientHeight/2 ) {
                    this.position.y = this.canvas.clientHeight/2-currentHeight;
                }
                else if( this.position.y  > this.canvas.clientHeight/2 ) {
                    this.position.y = this.canvas.clientHeight/2;
                }
            }

            this.lastX = relativeX;
            this.lastY = relativeY;
        },

        setEventListeners: function() {
            // touch
            this.canvas.addEventListener('touchstart', function(e) {
                this.lastX          = null;
                this.lastY          = null;
                this.lastZoomScale  = null;
            }.bind(this));

            this.canvas.addEventListener('touchmove', function(e) {
                e.preventDefault();

                if(e.targetTouches.length == 2) { //pinch
                    this.doZoom(e);
                }
                else if(e.targetTouches.length == 1) {
                    this.doMove(e);
                }
            }.bind(this));
        },

        checkRequestAnimationFrame: function() {
            var vendors = ['ms', 'moz', 'webkit', 'o'];
            for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
                window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
                window.cancelAnimationFrame =
                    window[vendors[x]+'CancelAnimationFrame'] || window[vendors[x]+'CancelRequestAnimationFrame'];
            }
        },

        getDataUrl: function() {
            return this.canvas.toDataURL("image/png");
        }
    };

    $.ImgTouchCanvas = ImgTouchCanvas;
}($));


    return $;
})();
