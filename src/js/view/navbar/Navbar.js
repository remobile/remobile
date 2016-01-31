var React = require('react');
var BackButton = require('./BackButton');
var NavbarTitle = require('./NavbarTitle');

module.exports = React.createClass({
    getVisibleTitle(title) {
		if (!title)return title;
		var realLength = 0, len = title.length, preLen = -1, charCode = -1, needCut = false;
		for (var i=0; i<len; i++) {
			charCode = title.charCodeAt(i);
			if (charCode >= 0 && charCode <= 128) {
				realLength += 1;
			} else {
				realLength += 2;
			}
			if (preLen===-1 && realLength >= 4) {
				preLen = i+1;
			} else if (realLength > 6) {
				needCut = true;
				break;
			}
		}
		if (needCut) {
			title = title.substr(0, preLen)+'..';
		}
		return title;
	},
    render() {
        return (
            <div className="navbar-inner">
                <BackButton goBack={this.props.goBack}>
                    {this.props.backText}
                </BackButton>
                <NavbarTitle>
                    {this.props.title}
                </NavbarTitle>
                {this.props.children}
            </div>
        );
    }
});
