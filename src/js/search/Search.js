var React = require('react');

module.exports =  React.createClass({
    render() {
        return (
            <form className="searchbar" ref="searchbar">
                <div className="searchbar-input">
                    <input type="search" placeholder="Search"/>
                    <a href="#" className="searchbar-clear">
                    </a>
                </div>
                {!app.params.material&&
                    <a href="#" className="searchbar-cancel">Cancel</a>
                }
            </form>
        );
    }
});
