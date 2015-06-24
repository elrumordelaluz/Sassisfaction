var React = require('react');

var Search = React.createClass({

  getInitialState: function(){
    return { 
      searchString: ''
    };
  },

  handleChange: function(e){
    this.setState( { searchString:e.target.value } );
  },

  render: function() {
    return (
      <input type="text" value={this.state.searchString} onChange={this.handleChange} placeholder="Search..." />
    );
  }

});

module.exports = Search;