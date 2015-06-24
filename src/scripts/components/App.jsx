var React = require('react');
var Header = require('./Header.jsx');
var Items = require('./Items.jsx');

var App = React.createClass({

  render: function() {
    return (
      <div>
        <Header text="Hello" />
        <Items items={this.state.items} />
      </div>
    );
  }

});

module.exports = App;