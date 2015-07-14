module.exports = {
    componentDidMount: function() {
        var param = this.props.data.param;
        var scrollTop = param.old&&param.old.scrollTop;
        if (scrollTop) {
            $('.page-content').scrollTop(scrollTop);
        }
    }
};
