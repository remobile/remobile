var React = require('react');
var UI = require('UI');

var View = UI.View;
var List = UI.List;
var Content = UI.Content;
var Icon = UI.Icon.Icon;
var Switch = UI.Form.Switch;
var Slider = UI.Form.Slider;
var FloatingLabel = UI.Form.FloatingLabel;


var FormItem = React.createClass({
	 render() {
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
	 render() {
        return (
             <FormItem icon={this.props.icon} label={this.props.label}>
                 <input type={this.props.input_type} placeholder={this.props.placeholder} />
            </FormItem>
        );
    }
});

var FormList = React.createClass({
    render() {
        return (
            <List.List block inputs>
            	<FormInputItem icon="icon-form-name" label="Name" input_type="text" placeholder="Please Input Your Name" />
            	<FormInputItem icon="icon-form-email" label="Email" input_type="email" placeholder="Please Input Your Email" />
            	<FormInputItem icon="icon-form-url" label="URL" input_type="url" placeholder="Please Input Your URL" />
            	<FormInputItem icon="icon-form-password" label="PassWord" input_type="password" placeholder="Please Input Your PassWord" />
            	<FormInputItem icon="icon-form-tel" label="Telephone" input_type="tel" placeholder="Please Input Your Telephone" />
            	<FormItem icon="icon-form-gender" label="Gender">
            		<select>
            			<option>Male</option>
            			<option>Female</option>
            		</select>
            	</FormItem>
            	<FormItem icon="icon-form-calendar" label="BirthDay">
            		<input type="date" defaultValue="2015-04-30"/>
            	</FormItem>
            	<FormItem icon="icon-form-calendar" label="Time">
            		<input type="datetime-local" defaultValue="2015-04-30 11:11"/>
            	</FormItem>
            	<FormItem icon="icon-form-toggle" label="Switch">
            		<Switch />
            	</FormItem>
            	<FormItem icon="icon-form-settings" label="Slider">
            		<Slider />
            	</FormItem>
            	<FormItem icon="icon-form-comment" label="TextArea">
            		<textarea placeholder="Please input comment"></textarea>
            	</FormItem>
           </List.List>
        );
    }
});


var FormList1 = React.createClass({
    render() {
        return (
            <List.List block inputs>
            	<FormInputItem icon="icon-form-name" input_type="text" placeholder="Please Input Your Name" />
            	<FormInputItem icon="icon-form-email" input_type="email" placeholder="Please Input Your Email" />
            	<FormItem icon="icon-form-gender">
            		<select>
            			<option>Male</option>
            			<option>Female</option>
            		</select>
            	</FormItem>
            	<FormItem icon="icon-form-calendar">
            		<input type="date" defaultValue="2015-04-30"/>
            	</FormItem>
            	<FormItem icon="icon-form-toggle">
            		<Switch />
            	</FormItem>
           </List.List>
        );
    }
});

var FormList2 = React.createClass({
    render() {
        return (
            <List.List block inputs>
            	<FormInputItem input_type="text" placeholder="Please Input Your Name" />
            	<FormInputItem input_type="email" placeholder="Please Input Your Email" />
            	<FormItem>
            		<select>
            			<option>Male</option>
            			<option>Female</option>
            		</select>
            	</FormItem>
            	<FormItem>
            		<input type="date" defaultValue="2015-04-30"/>
            	</FormItem>
            	<FormItem>
            		<Switch />
            	</FormItem>
           </List.List>
        );
    }
});

var FormList3 = React.createClass({
    render() {
        return (
            <List.List block inputs inset>
            	<FormInputItem input_type="text" placeholder="Please Input Your Name" />
            	<FormInputItem input_type="email" placeholder="Please Input Your Email" />
            	<FormItem>
            		<select>
            			<option>Male</option>
            			<option>Female</option>
            		</select>
            	</FormItem>
            	<FormItem>
            		<input type="date" defaultValue="2015-04-30"/>
            	</FormItem>
            	<FormItem>
            		<Switch />
            	</FormItem>
           </List.List>
        );
    }
});

var FormList4 = React.createClass({
    render() {
        return (
            <List.List block inputs inset>
				<List.ItemContent>
                   <List.ItemInner>
                       <FloatingLabel label="UserName">
						   <input type='text'/>
                       </FloatingLabel>
                   </List.ItemInner>
               </List.ItemContent>
			   <List.ItemContent>
				  <List.ItemInner>
					  <FloatingLabel label="PassWord">
						  <input type='password'/>
					  </FloatingLabel>
				  </List.ItemInner>
			  </List.ItemContent>
           </List.List>
        );
    }
});

module.exports.navbar = React.createClass({
    render() {
        return (
            <View.Navbar title="Form" />
        )
    }
});

module.exports.page = React.createClass({
	render() {
		return (
			<View.PageContent>
    			<Content.ContentBlockTitle>Full Layout</Content.ContentBlockTitle>
				<FormList />
				<Content.ContentBlockTitle>Icons And Inputs</Content.ContentBlockTitle>
				<FormList1 />
				<Content.ContentBlockTitle>Just Inputs</Content.ContentBlockTitle>
				<FormList2 />
				<Content.ContentBlockTitle>Inset, Just Inputs</Content.ContentBlockTitle>
				<FormList3 />
				<Content.ContentBlockTitle>Floating Label</Content.ContentBlockTitle>
				<FormList4 />
			</View.PageContent>
		);
	}
});
