var React = require('react');
var cn = require('classnames');

function IndexedList(params) {
    var p = this;
    var isTouched, lastLetter, lastPreviewLetter, groupPostion = {};
    var eventsTarget = params.container;

    var pageContainer = $('.page');
    var pageContent = $('.page').find('.page-content');
    var searchBar = $(pageContainer).find('.searchbar').length > 0;
    var serachBarOffset = searchBar*44;
    var fixedNavbar = pageContent.parents('.navbar-fixed').length > 0 || pageContent.parents('.navbar-through').length > 0;
    var fixedNavbarOffset = fixedNavbar*44;
    var toolBar =  pageContent.parents('.toolbar-through').length > 0;
    var toolBarOffset = toolBar*44;

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
            scrollToLetter(target.eq(0).data('index-letter'));
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
    }

    function handleClick(e) {
        var target = $(e.target);
        if (!target.is('li')) target = target.parents('li');
        if (target.length > 0) {
            scrollToLetter(target.eq(0).data('index-letter'));
        }
    }

    function handlePageScroll() {
        var inf = $(this);
        var scrollTop = inf[0].scrollTop;
        var scrollHeight = inf[0].scrollHeight;
        var height = inf[0].offsetHeight;

        var prevLetter = 'A';
        for (var letter in groupPostion) {
            var top = groupPostion[letter].offset().top-toolBarOffset-searchBar;
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

    function scrollToLetter(letter) {
        if (lastLetter !== letter) {
            lastLetter = letter;
            callback(letter);
            params.callback(letter);
        }
    }

    p.init = function () {
        if (searchBar){
            eventsTarget.css('margin-top','44px');
        }
        params.letters.map((letter)=>{groupPostion[letter] = pageContent.find('.list-group ul li[data-index-letter="' + letter + '"]')});

        pageContent.on('scroll', handlePageScroll);

        eventsTarget.on('click', '.list-index li', handleClick);
        eventsTarget.on(app.touchEvents.start, handleTouchStart);
        eventsTarget.on(app.touchEvents.move, handleTouchMove);
        eventsTarget.on(app.touchEvents.end, handleTouchEnd);
    };

    p.destory = function () {
        eventsTarget.off('click', '.list-index li', handleClick);
        eventsTarget.off(app.touchEvents.start, handleTouchStart);
        eventsTarget.off(app.touchEvents.move, handleTouchMove);
        eventsTarget.off(app.touchEvents.end, handleTouchEnd);
    };

    return p;
}


module.exports = React.createClass({
    getInitialState: function() {
        return {
            activeAlpha: this.props.letters[0]
        }
    },
    componentDidMount: function() {
        var self = this;
        var callback = app.methods.setActiveAlpha = function(letter) {
            self.setState({activeAlpha:letter});
        };
        this.indexedList = new IndexedList({
            container: $(this.refs.list.getDOMNode()),
            callback: callback,
            letters: this.props.letters
        });
        this.indexedList.init();
    },
    componentWillUnmount: function() {
        this.indexedList.destory();
    },
    render: function() {
        return (
            <ul className="list-index" ref="list" style={this.props.style}>
                {this.props.letters.map((letter)=>{
                    var obj = {};
                    if (this.state.activeAlpha == letter) {
                        obj.active = true;
                    }
                    return <li key={letter} className={cn(obj)} data-index-letter={letter}>{letter}</li>
                })}
            </ul>
        );
    }
});


