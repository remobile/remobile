var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    componentDidMount() {
        var pageContainer = $(this.getDOMNode());
        if (app.params.material) {
            app.initPageMaterialPreloader(pageContainer);
            app.initPageMaterialInputs(pageContainer);
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
