module.exports = {
    componentDidMount: function() {
        var param = this.props.data.param;
        var scrollTop = param.saved&&param.saved.scrollTop;
        if (scrollTop) {
            $('.page-content').scrollTop(scrollTop);
        }
    }
};
