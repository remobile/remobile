var React = require('react');

module.exports = React.createClass({
    componentDidMount() {
        app.initFloatingLabel(this.getDOMNode());
    },
    render() {
        return (
            <div className='floating-label'>
                {this.props.children}

                <div className='label'>
                    {this.props.label}
                </div>

            </div>
        );
    }
});
