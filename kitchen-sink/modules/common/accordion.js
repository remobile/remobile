var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Card = UI.Card;
var List = UI.List;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Button = UI.Button.Button;


var content = (
    <Content.ContentBlock>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean elementum id neque nec commodo. Sed vel justo at turpis laoreet pellentesque quis sed lorem. Integer semper arcu nibh, non mollis arcu tempor vel. Sed pharetra tortor vitae est rhoncus, vel congue dui sollicitudin. Donec eu arcu dignissim felis viverra blandit suscipit eget ipsum.</p>
    </Content.ContentBlock>
);

var List1 = React.createClass({
    render() {
        return (
            <List.List inset>
                <List.ItemContent>
                    <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitle>Ivan Petrov</List.ItemTitle>
                        <List.ItemAfter>CEO</List.ItemAfter>
                    </List.ItemInner>
                 </List.ItemContent>
                <List.ItemContent>
                    <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitle>John Doe</List.ItemTitle>
                        <List.ItemAfter><Badge>5</Badge></List.ItemAfter>
                    </List.ItemInner>
                 </List.ItemContent>
                <List.ItemContent>
                    <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitle>Jenna Smith</List.ItemTitle>
                    </List.ItemInner>
                 </List.ItemContent>
            </List.List>
        );
    }
});

var ListItem = React.createClass({
    render() {
        return (
            <UI.Accordion.AccordionItem list content={this.props.value&1?content:<List1 />}>
                <List.ItemLink>
                    <List.ItemMedia><Icon name="icon-f7" /></List.ItemMedia>
                    <List.ItemInner>
                        <List.ItemTitle>Item {this.props.value}</List.ItemTitle>
                        <List.ItemAfter><Badge>{this.props.value}</Badge></List.ItemAfter>
                    </List.ItemInner>
                </List.ItemLink>
            </UI.Accordion.AccordionItem>
        );
    }
});

var CustomItem = React.createClass({
    render() {
        return (
            <UI.Accordion.AccordionItem content={this.props.value&1?content:<List1 />}>
                <div className="accordion-item-toggle">
	                <i className="icon icon-ks-plus">+</i>
	                <i className="icon icon-ks-minus">-</i>
	                <span>Item {this.props.value}</span>
                </div>
            </UI.Accordion.AccordionItem>
        );
    }
});

module.exports.navbar = React.createClass({
    render() {
        return (
            <View.Navbar title="Accordion" />
        )
    }
});

module.exports.page = React.createClass({
    getInitialState() {
        return {
            list:[1,2,3]
        };
    },
	render() {
        return (
            <View.PageContent>
            		<Content.ContentBlockTitle>List View Accordion</Content.ContentBlockTitle>
                <List.List>
                    {this.state.list.map((item)=>{ return <ListItem value={item}/>})}
                </List.List>
                <Content.ContentBlockTitle>Group List View Accordion</Content.ContentBlockTitle>
                <List.List class="accordion-list">
                    {this.state.list.map((item)=>{ return <ListItem value={item}/>})}
                </List.List>
                <Content.ContentBlockTitle>Inset Accordion</Content.ContentBlockTitle>
                <List.List inset class="accordion-list">
                    {this.state.list.map((item)=>{ return <ListItem value={item}/>})}
                </List.List>
                <Content.ContentBlockTitle>Custom Styled Accordion</Content.ContentBlockTitle>
                <Content.ContentBlock class="custom-accordion accordion-list">
                		{this.state.list.map((item)=>{ return <CustomItem value={item}/>})}
                </Content.ContentBlock>
            </View.PageContent>
        );
    }
});
