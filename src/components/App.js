import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';
import * as h from '../helpers';
import Item from './Item';

class App extends Component {
  constructor (props) {
    super(props);

    this.state = {
      searchString: '',
      libraries: []
    }

    this.handleTagEvent = this.handleTagEvent.bind(this);
    this.handleFocus = this.handleFocus.bind(this);
    this.handleGA = this.handleGA.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleEsc = this.handleEsc.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  componentDidMount () {
    fetch(this.props.jsonURL)
      .then(response => response.json()
        .then( json => {
          const libs = json.map(item => ({
            name: item.name,
            url: item.url,
            tags: item.tags,
            image: item.image,
            desc: item.description
          }));
          this.setState({
            libraries: libs
          })
        }
      )
    )
  }

  handleChange (e) {
    this.setState({ searchString:e.target.value });
    this._closeBtn.classList.add('show');
  }

  handleFocus () {
    this._mainSearch.classList.add('focus');
  }

  handleTagEvent (e) {
    this.setState({ searchString: '#' + e.target.innerHTML + ':' });
    this._closeBtn.classList.add('show');
    this._textInput.focus();
  }

  handleClear () {
    this.setState({ searchString:'' });
    this._closeBtn.classList.remove('show');
  }

  handleEsc (e) {
    if (e.keyCode == 27) {
      this.handleClear();
    }
  }

  handleGA (e) {
    const val = this._textInput.value;
    this._mainSearch.classList.remove('focus');
    ga('send', 'event', 'search', val);
  }

  render () {
    let libraries = this.state.libraries,
        searchString = this.state.searchString.trim().toLowerCase(),
        re = /^#/;

    if( searchString.length > 0 && !re.test(searchString) ){
      // Searching by string
      libraries = libraries.filter(l => l.name.toLowerCase().match( searchString ) || l.desc.toLowerCase().match( searchString ));
    } else if( searchString.length > 0 && re.test(searchString) ){
      // Searching by tags
      const str = searchString.replace(re, '');
      const after = str.substr(str.indexOf(":") + 1);
      const before = str.substr(0, str.indexOf(':')); 
      const libsByTag = libraries.filter( l => str.indexOf(':') !== -1 ? l.tags.indexOf( before ) !== -1 : l.tags.indexOf( str ) !== -1);
      const libsByTagAndname = libsByTag.filter(l => l.name.toLowerCase().match( after ) || l.desc.toLowerCase().match( after ));
      libraries = str.indexOf(':') !== -1 ? libsByTagAndname : libsByTag;
    }

    return (
      <div className='container text--center'>
        <div className='main-search top' ref={c => this._mainSearch = c}>
          <label>
            <svg className="search-icon" dangerouslySetInnerHTML={{__html: "<use xlink:href='assets/symbols.svg#icon-search'/>"}}></svg>
            <input type="text" ref={c => this._textInput = c} value={this.state.searchString} onFocus={this.handleFocus} onChange={this.handleChange} onKeyUp={this.handleEsc} onBlur={ this.handleGA } placeholder="Search..." />
            <svg className="close-icon" ref={c => this._closeBtn = c} onClick={this.handleClear} dangerouslySetInnerHTML={{__html: "<use xlink:href='assets/symbols.svg#icon-close'/>"}}></svg>
          </label>
        </div>
          <div className='items'> 
            { libraries.map(lib => <Item title={lib.name} desc={lib.desc} link={lib.url} tags={lib.tags} key={h.toHash(lib.name)} image={lib.image} onClickTag={this.handleTagEvent}></Item>).reverse() }
          </div>
      </div>
    );
  }
}

export default App;
