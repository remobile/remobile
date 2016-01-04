var React = require('react');
var cn = require('classnames');

module.exports = React.createClass({
    onChange(i, e) {
        this.props.onChange(i, e.target.checked);
    },
    render() {
        var content;
        if (this.props.link) {
            if (this.props.swipeout) {
                content =
                <div className="swipeout-content">
                    <a
                        href="#"
                        className="item-link item-content"
                        onClick={this.props.onTap}>
                        {this.props.children}
                    </a>
                </div>
                ;
            } else {
                content =
                <a
                    href="#"
                    className="item-link item-content"
                    onClick={this.props.onTap}>
                    {this.props.children}
                </a>
                ;
            }
        } else {
            var dcn = cn("item-content", {"swipeout-content": this.props.swipeout});
            content =
            <div className={dcn} onClick={this.props.onTap}>
                {this.props.children}
            </div>
            ;
        }
        var className = cn({"swipeout": this.props.swipeout});

        if (this.props.radio) {
            var onChange = this.onChange.bind(null, this.props.value);
            return (
                <li>
                    <label className="label-radio item-content">
                        <input
                            type="radio"
                            value={this.props.value}
                            name={this.props.name}
                            defaultChecked={this.props.checked}
                            onChange={onChange}/>
                        {app.params.material&&
                            <div className="item-media">
                                <i className="icon icon-form-radio">
                                </i>
                            </div>
                        }
                        {this.props.children}
                    </label>
                </li>
            );
        } else if (this.props.checkbox) {
            var onChange = this.onChange.bind(null, this.props.value);
            return (
                <li>
                    <label className="label-checkbox item-content">
                        <input
                            type="checkbox"
                            value={this.props.value}
                            name={this.props.name}
                            defaultChecked={this.props.checked}
                            onChange={onChange}/>
                        <div className="item-media">
                            <i className="icon icon-form-checkbox">
                            </i>
                        </div>
                        {this.props.children}
                    </label>
                </li>
            );
        } else {
            return (
                <li className={className}>
                    {content}
                    {this.props.sortable&&
                        <div className="sortable-handler">
                        </div>
                    }
                    {this.props.swipeoutLeft&&
                        <div className="swipeout-actions-left">
                            {this.props.swipeoutLeft}
                        </div>
                    }
                    {this.props.swipeoutRight&&
                        <div className="swipeout-actions-right">
                            {this.props.swipeoutRight}
                        </div>
                    }
                </li>
            );
        }
    }
});
