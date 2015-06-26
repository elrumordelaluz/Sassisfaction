var React = require('react');
var SearchExample = require('./search.jsx')

var altLogo = <svg className='alt-logo' dangerouslySetInnerHTML={{__html: "<use xlink:href='assets/img/symbols.svg#alt-logo'/>"}}></svg>;


var Item = React.createClass({

  render: function() {
    return (
      <div className='items__item half'>
        <a href={ this.props.link } className='item-image' style={ (this.props.image ? { backgroundImage:'url(' + this.props.image + ')' } : { backgroundImage: 'none'}) }>
          { ( !this.props.image ? altLogo : '' ) }
        </a>
        <div className='item-content'>
          <h3 className='item-title'> 
            <a href={ this.props.link }>{ this.props.title }</a>
          </h3>
          <p className='item-desc'> { this.props.desc } </p>
          <div className='item-meta'>
            <div className='item-tags'>
              { 
                this.props.tags.map(function(tag){
                  return <button onClick={this.props.onSomeEvent} key={tag}>{tag}</button>
                }, this)
              }
            </div>
            <div className='item-links'>
            { 
            /*
              <a href={ this.props.link }>
                <svg 
                  dangerouslySetInnerHTML={{__html: "<use xlink:href='assets/img/symbols.svg#icon-pin'/>"}}>
                </svg>
              </a>
              <a href={ this.props.link }>
                <svg
                  dangerouslySetInnerHTML={{__html: "<use xlink:href='assets/img/symbols.svg#icon-info'/>"}}>
                </svg>
              </a>
              */
            }
              <a href={ this.props.link }>
                <svg
                  dangerouslySetInnerHTML={{__html: "<use xlink:href='assets/img/symbols.svg#icon-link'/>"}}>
                </svg>
              </a>
            </div>
          </div>
        
        </div>
      </div>
    );
  }
});

module.exports = Item;
