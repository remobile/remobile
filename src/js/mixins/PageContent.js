module.exports = {
    restoreScrollPosition: function() {
        var param = this.props.data.param;
        var scrollTop = param&&param.scrollTop;
        if (scrollTop) {
            console.log("restore scrollTop " + scrollTop);
            $('.page-content').scrollTop(scrollTop);
        }
    }
};
