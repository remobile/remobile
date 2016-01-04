var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    render() {
        var className = cn('message', {
            'message-sent': this.props.sent,
            'message-received': !this.props.sent,
            'message-last message-with-tail': this.props.tail,
            'message-with-avatar': !!this.props.avatar,
            'message-name': !!this.props.name,
            'message-pic': !!this.props.pic
        });
        var children = {};
        if (this.props.name) {
            children.name =(
                <div
                    className="message-name"
                    style={this.props.nameStyle}>
                    {this.props.name}
                </div>
            );
        }
        if (this.props.pic) {
            children.text = (
                <div className="message-text">
                    <img src={this.props.pic} />
                </div>
            );
        } else {
            children.text = (
                <div className="message-text">
                    {this.props.children}
                </div>
            );
        }
        if (this.props.label) {
            children.label = (
                <div className="message-label">
                    {this.props.label}
                </div>
            );
        }
        if (this.props.avatar) {
            children.avatar = (
                <div className={"message-avatar default_head user_head_"+this.props.avatar}>
                </div>
            );
        }
        return (
            <div className = {className}>
                {React.addons.createFragment(children)}

            </div>
        );
    }
});
