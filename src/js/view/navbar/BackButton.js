var React = require('react');

module.exports = React.createClass({
    goBack() {
        var goBack = this.props.goBack;
        if (!goBack || !goBack()) {
            app.goBack();
        }
    },
    render() {
        var haveBackButton = this.props.goBack!==false;
        if (!haveBackButton) {
            return (
                <div className="left"></div>
            )
        }
        return (
            <div className="left sliding">
                    <a
                        href="#"
                        className="back link"
                        onClick={this.goBack}>
                        <i className="icon icon-back">
                        </i>
                        <span>
                            {this.props.children}
                        </span>
                    </a>
            </div>
        )
    }
});
