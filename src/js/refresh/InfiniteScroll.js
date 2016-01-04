var React = require('react');

module.exports = React.createClass({
    componentDidMount: function() {
        var self = this;
        var container = $('.infinite-scroll');
        app.initInfiniteScroll(container);
        container.on('infinite', function (e) {
            self.props.onInfinite && self.props.onInfinite(e);
        });
    },
    componentWillUnmount: function() {
        app.destroyInfiniteScroll();
    },
    render: function() {
        return null;
    }
});
