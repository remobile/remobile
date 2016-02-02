var React = require('react');
var UI = require('UI');

var View = UI.View;
var Content = UI.Content;
var Grid = UI.Grid;
var List = UI.List;
var Button = UI.Button.Button;
var ButtonsRow = UI.Button.ButtonsRow;

module.exports.navbar = React.createClass({
    render() {
        return (
            <View.Navbar title="Button" />
        )
    }
});

module.exports.page = React.createClass({
	render() {
		return (
            <View.PageContent>
                <Content.ContentBlockTitle>Usual Buttons</Content.ContentBlockTitle>
                <Content.ContentBlock>
                    <Grid.Row>
                        <Grid.Col per={33}><Button active onTap={alert}>Active</Button></Grid.Col>
                        <Grid.Col per={33}><Button>Button</Button></Grid.Col>
                        <Grid.Col per={33}><Button round>Round</Button></Grid.Col>
                    </Grid.Row>
                </Content.ContentBlock>
                <Content.ContentBlock>
                    <Grid.Row>
                        <Grid.Col per={50}><Button active>Active</Button></Grid.Col>
                        <Grid.Col per={50}><Button round>Round</Button></Grid.Col>
                    </Grid.Row>
                </Content.ContentBlock>
                <Content.ContentBlock>
                    <ButtonsRow>
                        <Button active>Active</Button>
                        <Button round>Round</Button>
                    </ButtonsRow>
                </Content.ContentBlock>
                <Content.ContentBlock>
                    <ButtonsRow>
                        <Button round>Round</Button>
                        <Button round>Round</Button>
                        <Button round>Round</Button>
                    </ButtonsRow>
                </Content.ContentBlock>
                <Content.ContentBlock>
                    <ButtonsRow>
                        <Button round>Round</Button>
                        <Button active>Active</Button>
                        <Button round>Round</Button>
                        <Button round>Round</Button>
                    </ButtonsRow>
                </Content.ContentBlock>
                <Content.ContentBlockTitle>Big Buttons</Content.ContentBlockTitle>
                <Content.ContentBlock>
                    <Grid.Row>
                        <Grid.Col per={50}><Button big active>Active</Button></Grid.Col>
                        <Grid.Col per={50}><Button big round>Round</Button></Grid.Col>
                    </Grid.Row>
                </Content.ContentBlock>
                <Content.ContentBlockTitle>Themed Fill Buttons</Content.ContentBlockTitle>
                <Content.ContentBlock>
                    <Grid.Row>
                        <Grid.Col per={50}><Button big fill color="green">Submit</Button></Grid.Col>
                        <Grid.Col per={50}><Button big fill color="red">Cancel</Button></Grid.Col>
                    </Grid.Row>
                </Content.ContentBlock>
                <Content.ContentBlockTitle>List-Block Buttons</Content.ContentBlockTitle>
                <List.List block inset>
                    <li><Button list>List Button 1</Button></li>
                    <li><Button list>List Button 2</Button></li>
                    <li><Button list>List Button 3</Button></li>
                </List.List>
                <List.List block inset>
                    <li><Button list color="red">List Button 1</Button></li>
                </List.List>
                <Content.ContentBlock>
                    <p>this is inline round <Button inline round>Round</Button> or inline <Button inline>Button</Button></p>
	          		<p>this is inline fill <Button inline fill>Round</Button> or color <Button inline fill color="red">Button</Button></p>
                </Content.ContentBlock>
            </View.PageContent>
		);
	}
});
