var React = require('react');
var UI = require('UI');
var _ = require('underscore');

var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Form = UI.Form;
var View = UI.View;

var ContactItem = React.createClass({
   render: function() {
       return (
           <List.ItemContent>
             <List.ItemMedia><Icon name={"icon-default-head user_head_"+this.props.person.userid} round/></List.ItemMedia>
               <List.ItemInner>
                    <List.ItemTitle>{this.props.person.name}</List.ItemTitle>
               </List.ItemInner>
           </List.ItemContent>
        )
   }
});

var ContactGroup = React.createClass({
    render: function() {
        return (
            <List.ListGroup>
                <List.ListGroupTitle data={{'data-index-letter':this.props.letter}}>{this.props.letter}</List.ListGroupTitle>
                {this.props.persons.map((person)=>{return <ContactItem person={person}/>})}
            </List.ListGroup>
        )
    }
});


var ContactList = React.createClass({
    render: function() {
        return (
            <List.List block group class="contacts-block">
                {_.mapObject(app.userMgr.users, (value, key)=>{return <ContactGroup letter={key} persons={value.persons}/>})}
            </List.List>
        );
    }
});


module.exports = React.createClass({
	render: function() {
		return (
				<ContactList />
		);
	}
});
