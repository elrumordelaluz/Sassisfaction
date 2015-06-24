var React = require('react');
var Search = require('./Search.jsx');

var Header = React.createClass({
    render: function () {
        return (
          <div className="container">
            <div>{this.props.text}</div>
            <Search />
          </div>
        );
    }
});

module.exports = Header;