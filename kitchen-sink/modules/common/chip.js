var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Card = UI.Card;
var List = UI.List;
var Icon = UI.Icon.Icon;
var Badge = UI.Badge.Badge;
var Button = UI.Button.Button;
var Chip = UI.Chip.Chip;

function getImage(i) {
	return 'img/app/photo/'+i+'.jpg';
}

module.exports.navbar = React.createClass({
    render() {
        return (
            <View.Navbar title="Chips" />
        )
    }
});

module.exports.page = React.createClass({
	dealDelete() {
		console.log("delete");
	},
	render() {
        return (
            <View.PageContent>
                <Content.ContentBlock>
                   <p>Chips represent complex entities in small blocks, such as a contact. They can contain a photo, short title string, and brief information.</p>
                </Content.ContentBlock>

                <Content.ContentBlockTitle>Chips With Text</Content.ContentBlockTitle>
                <Content.ContentBlock>
                	{["Example Chip", "Another Chip", "One More Chip", "Fourth Chip", "Last One"].map((text)=>{return <Chip>{text}</Chip>})}
                </Content.ContentBlock>

                <Content.ContentBlockTitle>Icon Chips</Content.ContentBlockTitle>
                <Content.ContentBlock>
                	<Chip media={<Icon name="ks-icon-calendar"/>} color="blue">Set Date</Chip>
                	<Chip media={<Icon name="ks-icon-email"/>} color="purple">Set Date</Chip>
                	<Chip media={<Icon name="ks-icon-upload"/>} color="red">Set Date</Chip>
                </Content.ContentBlock>

                <Content.ContentBlockTitle>Contact Chips</Content.ContentBlockTitle>
                <Content.ContentBlock>
                	<Chip media={<img src={getImage(1)}/>}>Jane Doe</Chip>
                	<Chip media={<img src={getImage(2)}/>}>Jone Doe</Chip>
                	<Chip media={<img src={getImage(3)}/>}>Adam Smith</Chip>
                	<Chip media="A" color="pink">Adam Smith</Chip>
                	<Chip media="C" color="teal">Jone Doe</Chip>
                	<Chip media="K" color="red">Kate</Chip>
                </Content.ContentBlock>

                <Content.ContentBlockTitle>>Deletable Chips / Tags</Content.ContentBlockTitle>
                <Content.ContentBlock>
                	<Chip media={<img src={getImage(1)}/>} delete={this.dealDelete}>Jane Doe</Chip>
                	<Chip media={<img src={getImage(2)}/>} delete={this.dealDelete}>Jone Doe</Chip>
                	<Chip media={<img src={getImage(3)}/>} delete={this.dealDelete}>Adam Smith</Chip>
                	<Chip media="A" color="pink" delete={this.dealDelete}>Adam Smith</Chip>
                	<Chip media="C" color="teal" delete={this.dealDelete}>Jone Doe</Chip>
                	<Chip media="K" color="red" delete={this.dealDelete}>Kate</Chip>
                </Content.ContentBlock>

            </View.PageContent>
        );
    }
});
