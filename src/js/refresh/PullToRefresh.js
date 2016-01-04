var React = require('react');

module.exports = React.createClass({
    componentDidMount() {
        var self = this;
        this.container = $('.pull-to-refresh-content');
        app.initPullToRefresh(this.container);
        this.container.on('refresh', (e)=>{
            self.props.onRefresh && self.props.onRefresh(e);
        });
    },
    componentWillUnmount() {
        app.destroyPullToRefresh(this.container);
    },
    refreshDone() {
        app.pullToRefreshDone();
    },
    render() {
        return (
            <div className="pull-to-refresh-layer">
                <div className="preloader">
                </div>
                <div className="pull-to-refresh-arrow">
                </div>
            </div>
        );
    }
});
