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
            <View.Navbar title="Grid" />
        )
    }
});

module.exports.page = React.createClass({
	render() {
		return (
			<View.PageContent>
				<div className="ks-grid">
					<Content.ContentBlock>
						<p>
							flexible layout grid
						</p>
					</Content.ContentBlock>
					<Content.ContentBlockTitle>
						Columns with gutter
					</Content.ContentBlockTitle>
					<Content.ContentBlock>
						<Grid.Row>
							<Grid.Col per={50}>50</Grid.Col>
							<Grid.Col per={50}>50</Grid.Col>
						</Grid.Row>
						<Grid.Row>
							<Grid.Col per={33}>33</Grid.Col>
							<Grid.Col per={33}>33</Grid.Col>
							<Grid.Col per={33}>33</Grid.Col>
						</Grid.Row>
						<Grid.Row>
							<Grid.Col per={25}>25</Grid.Col>
							<Grid.Col per={25}>25</Grid.Col>
							<Grid.Col per={25}>25</Grid.Col>
							<Grid.Col per={25}>25</Grid.Col>
						</Grid.Row>
						<Grid.Row>
							<Grid.Col per={20}>20</Grid.Col>
							<Grid.Col per={20}>20</Grid.Col>
							<Grid.Col per={20}>20</Grid.Col>
							<Grid.Col per={20}>20</Grid.Col>
							<Grid.Col per={20}>20</Grid.Col>
						</Grid.Row>
						<Grid.Row>
							<Grid.Col per={33}>33</Grid.Col>
							<Grid.Col per={66}>66</Grid.Col>
						</Grid.Row>
						<Grid.Row>
							<Grid.Col per={25}>25</Grid.Col>
							<Grid.Col per={25}>25</Grid.Col>
							<Grid.Col per={50}>50</Grid.Col>
						</Grid.Row>
						<Grid.Row>
							<Grid.Col per={75}>75</Grid.Col>
							<Grid.Col per={25}>25</Grid.Col>
						</Grid.Row>
						<Grid.Row>
							<Grid.Col per={20}>20</Grid.Col>
							<Grid.Col per={80}>80</Grid.Col>
						</Grid.Row>
					</Content.ContentBlock>
					<Content.ContentBlockTitle>
						Columns with no gutter
					</Content.ContentBlockTitle>
					<Content.ContentBlock>
						<Grid.Row noGutter>
							<Grid.Col per={50}>50</Grid.Col>
							<Grid.Col per={50}>50</Grid.Col>
						</Grid.Row>
						<Grid.Row noGutter>
							<Grid.Col per={33}>33</Grid.Col>
							<Grid.Col per={33}>33</Grid.Col>
							<Grid.Col per={33}>33</Grid.Col>
						</Grid.Row>
						<Grid.Row noGutter>
							<Grid.Col per={25}>25</Grid.Col>
							<Grid.Col per={25}>25</Grid.Col>
							<Grid.Col per={25}>25</Grid.Col>
							<Grid.Col per={25}>25</Grid.Col>
						</Grid.Row>
						<Grid.Row noGutter>
							<Grid.Col per={20}>20</Grid.Col>
							<Grid.Col per={20}>20</Grid.Col>
							<Grid.Col per={20}>20</Grid.Col>
							<Grid.Col per={20}>20</Grid.Col>
							<Grid.Col per={20}>20</Grid.Col>
						</Grid.Row>
						<Grid.Row noGutter>
							<Grid.Col per={33}>33</Grid.Col>
							<Grid.Col per={66}>66</Grid.Col>
						</Grid.Row>
						<Grid.Row noGutter>
							<Grid.Col per={25}>25</Grid.Col>
							<Grid.Col per={25}>25</Grid.Col>
							<Grid.Col per={50}>50</Grid.Col>
						</Grid.Row>
						<Grid.Row noGutter>
							<Grid.Col per={75}>75</Grid.Col>
							<Grid.Col per={25}>25</Grid.Col>
						</Grid.Row>
						<Grid.Row noGutter>
							<Grid.Col per={20}>20</Grid.Col>
							<Grid.Col per={80}>80</Grid.Col>
						</Grid.Row>
					</Content.ContentBlock>
				</div>
			</View.PageContent>
		);
	}
});
