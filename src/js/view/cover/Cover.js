var React = require('react');
var CoverContent = require('./CoverContent');

module.exports = React.createClass({
	getInitialState() {
        return {
            coverVisible: false,
        };
    },
	componentWillMount() {
        app.cover = this;
    },
	render() {
		return (
			<div>
				{this.state.coverVisible&&<CoverContent params={this.state.coverParams}>{this.state.coverChildren}</CoverContent>}
			</div>
		)
	}
});
