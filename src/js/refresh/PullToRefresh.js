var React = require('react');

module.exports = React.createClass({
    componentDidMount: function() {
        var self = this;
        this.container = $('.pull-to-refresh-content');
        app.initPullToRefresh(this.container);
        this.container.on('refresh', function (e) {
            self.props.onRefresh && self.props.onRefresh(e);
        });
    },
    componentWillUnmount: function() {
        app.destroyPullToRefresh(this.container);
    },
    refreshDone: function() {
        app.pullToRefreshDone();
    },
    render: function() {
         return (
            <div className="pull-to-refresh-layer">
                <div className="preloader"></div>
                <div className="pull-to-refresh-arrow"></div>
            </div>
         );
    }
});
