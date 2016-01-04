var React = require('react');

module.exports = React.createClass({
    componentDidMount() {
        var self = this;
        var container = $('.infinite-scroll');
        app.initInfiniteScroll(container);
        container.on('infinite', (e)=>{
            self.props.onInfinite && self.props.onInfinite(e);
        });
    },
    componentWillUnmount() {
        app.destroyInfiniteScroll();
    },
    render() {
        return null;
    }
});
