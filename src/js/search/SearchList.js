var React = require('react');
var List = require('../list');

module.exports =  React.createClass({
    render() {
        var className = "searchbar-found";
        if (this.props.class) {
            className = className + " " + this.props.class;
        }
        return (
            <div>
                <List.List block class="searchbar-not-found">
                    <List.ItemContent>
                        <List.ItemInner>
                            <List.ItemTitle>
                                Nothing found
                            </List.ItemTitle>
                        </List.ItemInner>
                    </List.ItemContent>
                </List.List>
                <List.List block class={className}>
                    {this.props.children}
                </List.List>
            </div>
        );
    }
});
