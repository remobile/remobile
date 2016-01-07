var React = require('react');
var List = require('../list');

module.exports =  React.createClass({
    render() {
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
                <List.List block search {...this.props}>
                    {this.props.children}
                </List.List>
            </div>
        );
    }
});
