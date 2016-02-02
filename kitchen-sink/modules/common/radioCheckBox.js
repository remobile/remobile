var React = require('react');
var UI = require('UI');
var _ = require('underscore');

var View = UI.View;
var Content = UI.Content;
var Grid = UI.Grid;
var List = UI.List;
var Select = UI.Select;
var Icon = UI.Icon.Icon;
var Button = UI.Button.Button;
var ButtonsRow = UI.Button.ButtonsRow;

function getImage(i) {
    return 'img/app/photo/'+i+'.jpg';
}

var List1 = React.createClass({
    getInitialState() {
        return {
            checkedList: []
        }
    },
    handleChange(i, checked) {
        if (checked) {
            this.state.checkedList.push(i);
        } else {
            this.state.checkedList = _.without(this.state.checkedList, i);
        }
        console.log(this.state.checkedList);
    },
    render() {
        var checkedList = this.state.checkedList;
        return (
            <List.List block>
            	{["Books", "Movies", "Food", "Drinks"].map((label, i)=>{return (
            		<List.ItemContent key={i} checkbox value={i} name="checkbox1" checked={checkedList.indexOf(i)!==-1} onChange={this.handleChange}>
                    <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitle>{label}</List.ItemTitle>
                        <List.ItemAfter>CEO</List.ItemAfter>
                    </List.ItemInner>
                 </List.ItemContent>
             	)})}
            </List.List>
        );
    }
});

var List2 = React.createClass({
    handleChange(i, checked) {
        console.log(i, checked);
    },
    render() {
        return (
            <List.List block>
            	{["Books", "Movies", "Food", "Drinks"].map((label, i)=>{return (
            		<List.ItemContent key={i} radio value={i} name="radio1" checked={i===2} onChange={this.handleChange}>
                    <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitle>{label}</List.ItemTitle>
                        <List.ItemAfter>CEO</List.ItemAfter>
                    </List.ItemInner>
                 </List.ItemContent>
             	)})}
            </List.List>
        );
    }
});

var List3 = React.createClass({
    getInitialState() {
        return {
            checkedList: []
        }
    },
    handleChange(i, checked) {
        if (checked) {
            this.state.checkedList.push(i);
        } else {
            this.state.checkedList = _.without(this.state.checkedList, i);
        }
        console.log(this.state.checkedList);
    },
    render() {
    		var checkedList = this.state.checkedList;
        return (
            <List.List block media>
            	{[{name:"Yellow Submarine", price:"$15", title:"Beatles"},
            		{name:"Don't Stop Me Now", price:"$22", title:"Queen"},
            		{name:"Billie Jean", price:"$16", title:"Michael Jackson"}].map((item, i)=>{return (
            		<List.ItemContent key={i} checkbox value={i} name="checkbox2" checked={checkedList.indexOf(i)!==-1} onChange={this.handleChange}>
                    <List.ItemMedia><img src={getImage(i+1)} width="80"/></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitleRow>
                            <List.ItemTitle>{item.name}</List.ItemTitle>
                            <List.ItemAfter>{item.price}</List.ItemAfter>
                        </List.ItemTitleRow>
                        <List.ItemSubTitle>{item.title}</List.ItemSubTitle>
                        <List.ItemText>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.
                        </List.ItemText>
                    </List.ItemInner>
                 </List.ItemContent>
             	)})}
            </List.List>
        );
    }
});

var List4 = React.createClass({
    handleChange(i, checked) {
        console.log(i, checked);
    },
    render() {
        return (
            <List.List block media>
            	{[{name:"Yellow Submarine", price:"$15", title:"Beatles"},
            		{name:"Don't Stop Me Now", price:"$22", title:"Queen"},
            		{name:"Billie Jean", price:"$16", title:"Michael Jackson"}].map((item, i)=>{return (
            		<List.ItemContent key={i} radio value={i} name="radio1" checked={i===2} onChange={this.handleChange}>
                    <List.ItemMedia><img src={getImage(i+4)} width="80"/></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitleRow>
                            <List.ItemTitle>{item.name}</List.ItemTitle>
                            <List.ItemAfter>{item.price}</List.ItemAfter>
                        </List.ItemTitleRow>
                        <List.ItemSubTitle>{item.title}</List.ItemSubTitle>
                        <List.ItemText>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus.
                        </List.ItemText>
                    </List.ItemInner>
                 </List.ItemContent>
             	)})}
            </List.List>
        );
    }
});

module.exports.navbar = React.createClass({
    render() {
        return (
            <View.Navbar title="Radio CheckBox" />
        )
    }
});

module.exports.page = React.createClass({
    render() {
        return (
            <View.PageContent>
                <Content.ContentBlockTitle>Checkbox group</Content.ContentBlockTitle>
                <List1 />
                <Content.ContentBlockTitle>Radio buttons group</Content.ContentBlockTitle>
                <List2 />
                <Content.ContentBlockTitle>With Media Lists</Content.ContentBlockTitle>
                <List3 />
                <Content.ContentBlockTitle>What is your favourite song?</Content.ContentBlockTitle>
                <List4 />
            </View.PageContent>
        );
    }
});
