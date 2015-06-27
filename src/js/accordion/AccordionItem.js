var React = require('react');

var Accordion = function(params)  {
    var p = this;

    p.accordionToggle = function (item) {
        item = $(item);
        if (item.length === 0) return;
        if (item.hasClass('accordion-item-expanded')) p.accordionClose(item);
        else p.accordionOpen(item);
    };
    p.accordionOpen = function (item) {
        item = $(item);
        var group = item.parents('.accordion-group').eq(0);
        var content = item.children('.accordion-item-content');
        if (content.length === 0) content = item.find('.accordion-item-content');
        var expandedItem = group.length > 0 && item.parent().children('.accordion-item-expanded');
        if (expandedItem.length > 0) {
            p.accordionClose(expandedItem);
        }
        content.css('height', content[0].scrollHeight + 'px').transitionEnd(function () {
            if (item.hasClass('accordion-item-expanded')) {
                content.transition(0);
                content.css('height', 'auto');
                var clientLeft = content[0].clientLeft;
                content.transition('');
                item.trigger('opened');
            }
            else {
                content.css('height', '');
                item.trigger('closed');
            }
        });
        item.trigger('open');
        item.addClass('accordion-item-expanded');
    };
    p.accordionClose = function (item) {
        item = $(item);
        var content = item.children('.accordion-item-content');
        if (content.length === 0) content = item.find('.accordion-item-content');
        item.removeClass('accordion-item-expanded');
        content.transition(0);
        content.css('height', content[0].scrollHeight + 'px');
        // Relayout
        var clientLeft = content[0].clientLeft;
        // Close
        content.transition('');
        content.css('height', '').transitionEnd(function () {
            if (item.hasClass('accordion-item-expanded')) {
                content.transition(0);
                content.css('height', 'auto');
                var clientLeft = content[0].clientLeft;
                content.transition('');
                item.trigger('opened');
            }
            else {
                content.css('height', '');
                item.trigger('closed');
            }
        });
        item.trigger('close');
    };
    return p;
};

module.exports = React.createClass({
    componentDidMount: function() {
        this.accordionItem = new Accordion();
        this.item = this.refs.item.getDOMNode();
    },
    toggle: function() {
        this.accordionItem.accordionToggle(this.item);
    },
    render: function() {
        var content = (
            <div className="accordion-item-content" onClick={function(e){e.stopPropagation()}}>
                {this.props.content}
            </div>
        );
        if (this.props.list) {
            return (
                <li ref="item" onClick={this.toggle}>
                    {this.props.children}
                    {content}
                </li>
            );
        } else {
            return (
                <div ref="item" onClick={this.toggle}>
                    {this.props.children}
                    {content}
                </div>
            );
        }
    }
});

