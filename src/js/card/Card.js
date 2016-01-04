var React = require('react');
var cn = require('classnames');
var CardHeader = require('./CardHeader');
var CardFooter = require('./CardFooter');
var CardContent = require('./CardContent');
var CardContentInner = require('./CardContentInner');

module.exports = React.createClass({
    render() {
        var obj = {
            "card": true
        };
        this.props.class&&(obj[this.props.class]=true);
        var className = cn(obj);
        if (this.props.inner) {
            return (
                <div
                    className={className}
                    style={this.props.style}>
                    <CardContent>
                        {!!this.props.header&&
                            <CardHeader>
                                {this.props.header}
                            </CardHeader>
                        }
                        {!!this.props.customHeader&&this.props.customHeader}
                        <CardContentInner>
                            {this.props.children}
                        </CardContentInner>
                        {!!this.props.footer&&
                            <CardFooter>
                                {this.props.footer}
                            </CardFooter>
                        }
                        {!!this.props.customFooter&&this.props.customFooter}
                    </CardContent>
                </div>
            );
        } else {
            return (
                <div
                    className={className}
                    style={this.props.style}>
                    <CardContent>
                        {!!this.props.header&&
                            <CardHeader>
                                {this.props.header}
                            </CardHeader>
                        }
                        {!!this.props.customHeader&&this.props.customHeader}
                        {this.props.children}
                        {!!this.props.footer&&
                            <CardFooter>
                                {this.props.footer}
                            </CardFooter>
                        }
                        {!!this.props.customFooter&&this.props.customFooter}
                    </CardContent>
                </div>
            );
        }
    }
});
