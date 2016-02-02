var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    componentDidMount() {
		var props = this.props;
		var pageContainer = $(this.getDOMNode());

		if (props.initPageScrollToolbars) {
			app.initPageScrollToolbars(pageContainer);
		}
		if (app.params.material) {
			app.initPageMaterialPreloader(pageContainer);
			app.initPageMaterialInputs(pageContainer);
			app.initPageMaterialTabbar(pageContainer);
		}
		if (props.initPageSwiper) {
			app.initPageSwiper(pageContainer);
		}
		if (props.initUpScroller) {
			app.initUpScroller(pageContainer);
		}
	},
    componentWillUnmount() {
        var props = this.props;
		var pageContainer = $(this.getDOMNode());

		if (props.initPageScrollToolbars) {
			app.destroyScrollToolbars(pageContainer);
		}
	},
    render() {
        var obj = {
            "messages-content": this.props.message,
            "hide-bars-on-scroll": this.props.scrollHideBar,
            "with-subnavbar": this.props.subnavbar,
            "tab": this.props.tab,
            "active": this.props.active,
        };
        this.props.class&&(obj[this.props.class]=true);
        var className = cn("page-content", obj);

        var data = this.props.data;
        var dataAttribute = {};
        for (var key in data) {
            dataAttribute['data-'+key] = data[key];
        }
        return (
            <div
                className={className}
                id={this.props.tab} {...dataAttribute}>
                {this.props.children}
            </div>
        );
    }
});
