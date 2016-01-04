var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    render() {
        var obj = {'chip-media':true};
        obj['bg-'+this.props.color] = true;
        var className = cn(obj);
        return (
            <div className="chip">
                {this.props.media&&
                    <div className={className}>
                        {this.props.media}
                    </div>
                }

                <div className="chip-label">
                    {this.props.children}
                </div>
                {this.props.delete&&
                    <a
                        href="#"
                        className="chip-delete"
                        onClick={this.props.delete}>
                    </a>
                }

            </div>
        );
    }
});
