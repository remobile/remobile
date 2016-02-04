var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    getInitialState() {
        return {
            activeAlpha: this.props.letters[0]
        }
    },
    componentDidMount() {
        app.initIndexedList({
            container: this.getDOMNode(),
            callback: (letter)=>{this.setState({activeAlpha:letter})},
            letters: this.props.letters
        });
    },
    componentWillUnmount() {
        app.destroyIndexedList();
    },
    render() {
        return (
            <ul
                className="list-index"
                style={this.props.style}>
                {this.props.letters.map((letter)=>{
                    var obj = {};
                    if (this.state.activeAlpha == letter) {
                        obj.active = true;
                    }
                    return <li
                        key={letter}
                        className={cn(obj)}
                        data-index-letter={letter}>
                        {letter}
                    </li>
                })}
            </ul>
        );
    }
});
