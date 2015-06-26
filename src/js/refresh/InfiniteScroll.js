var React = require('react');

var InfiniteScroll = function(params)  {
    var p = this;
    var distance = params?(params.distance||50):50;

    function handleInfiniteScroll() {
        /*jshint validthis:true */
        var inf = $(this);
        var scrollTop = inf[0].scrollTop;
        var scrollHeight = inf[0].scrollHeight;
        var height = inf[0].offsetHeight;

        var virtualListContainer = inf.find('.virtual-list');
        var virtualList;
        var onTop = inf.hasClass('infinite-scroll-top');

        if (typeof distance === 'string' && distance.indexOf('%') >= 0) {
            distance = parseInt(distance, 10) / 100 * height;
        }

        if (distance > height) distance = height;
        if (onTop) {
            if (scrollTop < distance) {
                inf.trigger('infinite');
            }
        }
        else {
            if (scrollTop + height >= scrollHeight - distance) {
                if (virtualListContainer.length > 0) {
                    virtualList = virtualListContainer[0].f7VirtualList;
                    if (virtualList && !virtualList.reachEnd) return;
                }
                inf.trigger('infinite');
            }
        }

    }
    p.initInfiniteScroll = function (container) {
        p.container = container;
        p.container.on('scroll', handleInfiniteScroll);
    };
    p.destoryInfiniteScroll = function () {
        p.container.off('scroll', handleInfiniteScroll);
    };

    return p;
};


module.exports = React.createClass({
    componentDidMount: function() {
        var self = this;
        this.infiniteScroll = new InfiniteScroll({distance: this.props.distance});
        var container = $('.infinite-scroll');
        this.infiniteScroll.initInfiniteScroll(container);
        container.on('infinite', function (e) {
            self.props.onInfinite && self.props.onInfinite(e);
        });
    },
    componentWillUnmount: function() {
        this.infiniteScroll.destoryInfiniteScroll();
    },
    render: function() {
        return null;
    }
});
