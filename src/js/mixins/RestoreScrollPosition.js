module.exports = {
    componentDidMount() {
        var data = this.props.data||{};
        var param = data.param||{};
        var scrollTop = param.saved&&param.saved.scrollTop;
        if (scrollTop) {
            $('.page-content').scrollTop(scrollTop);
        }
    }
};
