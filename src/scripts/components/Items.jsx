var React = require('react');
var Search = require('./Search.jsx');

var Items = React.createClass({

    getInitialState: function(){
      return {
        searchString: '',
        libraries: []
      };
    },

    componentDidMount: function() {
      var self = this;
      var url = this.props.jsonURL;
      var request = new XMLHttpRequest();

      request.open('GET', url, true);
      request.onload = (function(){
        if (request.status >= 200 && request.status < 400) {
          var result = JSON.parse(request.responseText);              
          var libraries = result.map(function(p){
            return { 
              name: p.name, 
              url: p.url,
              tags: p.tags,
              image: p.image
            };
          });
          self.setState({ libraries: libraries });
        } else {
          // We reached our target server, but it returned an error
        }       
      }).bind(this);

      request.onerror = function() {
        // There was a connection error of some sort
      };

      request.send();

    },

    handleChange: function(e){
      this.setState( { searchString:this.props.searchString } );
    },

    render: function () {

      var items = this.props.items.map(function (item) {
          return (
              <div> hola </div>
          );
      }.bind(this));

      return (
          <div className="container">
              <div className="row">
                  { items }
              </div>
          </div>
      );
      
    }
});

module.exports = Items;
