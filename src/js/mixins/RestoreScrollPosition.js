module.exports = {
    componentDidMount: function() {
        var param = this.props.data.param;
        var scrollTop = param&&param.scrollTop;
        if (scrollTop) {
            $('.page-content').scrollTop(scrollTop);
        }
    }
};
