var React = require('react');
var Item = require('./item.jsx');

var toHash = function(str) {
  var hash = 0, i, chr;
  if (str.length == 0) return hash;
  for (i = 0; i < str.length; i++) {
    chr = str.charCodeAt(i);
    hash = ((hash<<5)-hash)+chr;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

var Search = React.createClass({

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
            image: p.image,
            desc: p.description
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
    this.setState( {searchString:e.target.value} );
    React.findDOMNode(this.refs.closeBtn).classList.add('show');
  },

  handleFocus: function(){
    React.findDOMNode(this.refs.mainSearch).classList.add('focus');
  },

  handleTagEvent: function(e){
    this.setState( {searchString: '#' + e.target.innerHTML + ':' } );
    React.findDOMNode(this.refs.closeBtn).classList.add('show');
    React.findDOMNode(this.refs.textInput).focus();
  },

  handleClear: function(){
    this.setState( {searchString:''} );
    React.findDOMNode(this.refs.closeBtn).classList.remove('show');
  },

  handleEsc: function(e){
    if (e.keyCode == 27) {
      this.handleClear();
    }
  },

  handleGA: function(e){
    var val = React.findDOMNode(this.refs.textInput).value;
    React.findDOMNode(this.refs.mainSearch).classList.remove('focus');
    ga('send', 'event', 'search', val);
  },

  render: function() {

    var that = this,
        libraries = this.state.libraries,
        searchString = this.state.searchString.trim().toLowerCase(),
        re = /^#/;


    if( searchString.length > 0 && !re.test(searchString) ){
      // Searching by string
      libraries = libraries.filter(function(l){
        return l.name.toLowerCase().match( searchString ) || l.desc.toLowerCase().match( searchString );
      });
    } 
    else if( searchString.length > 0 && re.test(searchString) ){
      // Searching by tags
      var str = searchString.replace(re, '');
      // str = str.indexOf(':') !== -1 ? str.replace(':', '') : str;
      var after = str.substr(str.indexOf(":") + 1);
      var before = str.substr(0, str.indexOf(':')); 

      var libsByTag = libraries.filter(function(l){
        var byTag =  str.indexOf(':') !== -1 ? l.tags.indexOf( before ) !== -1 : l.tags.indexOf( str ) !== -1;
        return byTag;
      });

      var libsByTagAndname = libsByTag.filter(function(l){
        return l.name.toLowerCase().match( after ) || l.desc.toLowerCase().match( after )
      });

      libraries = str.indexOf(':') !== -1 ? libsByTagAndname : libsByTag;

    }


    return (
      <div className='container text--center'>
        <div className='main-search top' ref="mainSearch">
          <label>
            <svg className="search-icon" 
              dangerouslySetInnerHTML={{__html: "<use xlink:href='assets/img/symbols.svg#icon-search'/>"}}>
            </svg>
            <input type="text" ref="textInput" value={this.state.searchString} onFocus={this.handleFocus} onChange={this.handleChange} onKeyUp={this.handleEsc} onBlur={ this.handleGA } placeholder="Search..." />
            <svg className="close-icon" ref="closeBtn" onClick={this.handleClear}
              dangerouslySetInnerHTML={{__html: "<use xlink:href='assets/img/symbols.svg#icon-close'/>"}}>
            </svg>
          </label>
        </div>
          <div className='items'> 
            { libraries.map(function(l){
              return <Item 
                  title={l.name} 
                  desc={l.desc} 
                  link={l.url} 
                  tags={l.tags} 
                  key={ toHash(l.name) } 
                  image={l.image} 
                  onClickTag={that.handleTagEvent}
                  ></Item>
            }).reverse() }
          </div>
        </div>
    );

  }

});

module.exports = Search;
