var React = require('react');
var UI = require('UI');

var View = UI.View;
var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Switch = UI.Form.Switch;
var Slider = UI.Form.Slider;
var Grid = UI.Grid;
var Button = UI.Button.Button;


var FormItem = React.createClass({
	 render: function() {
        return (
             <List.ItemContent>
             		{this.props.icon&&<List.ItemMedia><Icon name={this.props.icon}/></List.ItemMedia>}
                <List.ItemInner>
                    {this.props.label&&<List.ItemTitle label>{this.props.label}</List.ItemTitle>}
                    <List.ItemInput>
                    	{this.props.children}
                    </List.ItemInput>
                </List.ItemInner>
            </List.ItemContent>
        );
    }
});

var FormInputItem = React.createClass({
	 render: function() {
        return (
             <FormItem icon={this.props.icon} label={this.props.label}>
                 <input type={this.props.input_type} placeholder={this.props.placeholder} />
            </FormItem>
        );
    }
});


module.exports = React.createClass({
    doLogin: function() {
        app.showView('home', 'fade', null, true);
    },
    doRegister: function() {
        app.toast("Will be complete soon");
    },
	render: function() {
		return (
			<View.Page>
				<View.PageContent>
					<Content.ContentBlock>
						<List.List block>
	            	<FormInputItem icon="icon-form-name" label="Name:" input_type="text" placeholder="Please Input Name" />
	            	<FormInputItem icon="icon-form-password" label="PassWord:" input_type="password" placeholder="Please Input PassWord" />
            </List.List>
          </Content.ContentBlock>

           <Content.ContentBlock>
            	<List.List block>
            	<List.ItemContent>
                <List.ItemInner>
                    <List.ItemTitle label style={{width:'80%'}}>Remeber Password:</List.ItemTitle>
                    <List.ItemInput>
                    	<Switch />
                    </List.ItemInput>
                </List.ItemInner>
              </List.ItemContent>
              <List.ItemContent>
                <List.ItemInner>
                    <List.ItemTitle label style={{width:'80%'}}>Auto Login:</List.ItemTitle>
                    <List.ItemInput>
                    	<Switch />
                    </List.ItemInput>
                </List.ItemInner>
            	</List.ItemContent>
            	</List.List>
            </Content.ContentBlock>

           <Content.ContentBlock>
                <Grid.Row>
                    <Grid.Col per={50}><Button big fill color="green" onTap={this.doLogin}>Login</Button></Grid.Col>
                    <Grid.Col per={50}><Button big fill color="red" onTap={this.doRegister}>Register</Button></Grid.Col>
                </Grid.Row>
            </Content.ContentBlock>
				</View.PageContent>
       </View.Page>
		);
	}
});
