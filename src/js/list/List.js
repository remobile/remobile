var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
	render() {
		var obj = {
			'list-block': true,
			'inset': this.props.inset,
			'list-block-label': this.props.tabletInset,
			'media-list': this.props.media,
			'sortable': this.props.sortable,
			'virtual-list': this.props.virtual,
			'contacts-block': this.props.contacts,
			'searchbar-found': this.props.search,
			'inputs-list': this.props.inputs&&app.params.material,
		};
		this.props.class&&(obj[this.props.class]=true);
		var className = cn(obj);

		var style= this.props.block?{}:{margin:'0px 0px'};
		if (this.props.group) {
			return (
				<div className={className} style={style}>
					{this.props.children}
				</div>
			)
		} else if (this.props.sortable||this.props.swipeout){
			return (
				<div
					className={className}
					style={style}
					ref="container">
					<ul>
						{this.props.children}
					</ul>
				</div>
			)
		} else {
			return (
				<div className={className} style={style}>
					<ul>
						{this.props.children}
					</ul>
				</div>
			)
		}
	}
});
