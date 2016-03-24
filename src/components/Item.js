import React from 'react';

const Item = (props) => {
  const altLogo = <svg className='alt-logo' 
                    dangerouslySetInnerHTML={{__html: "<use xlink:href='assets/symbols.svg#alt-logo'/>"}}></svg>;

  return (
    <div className='items__item half'>
      <a href={ props.link } className='item-image' style={ (props.image ? { backgroundImage:'url(' + props.image + ')' } : { backgroundImage: 'none'}) }>
        { ( !props.image ? altLogo : '' ) }
      </a>
      <div className='item-content'>
        <h3 className='item-title'> 
          <a href={ props.link }>{ props.title }</a>
        </h3>
        <p className='item-desc'> { props.desc } </p>
        <div className='item-meta'>
          <div className='item-tags'>
            { 
              props.tags.map(function(tag){
                return <button onClick={props.onClickTag} key={tag}>{tag}</button>
              }, this)
            }
          </div>
          <div className='item-links'>
            <a href={ 'https://twitter.com/intent/tweet?url=' + props.link + '&text=Another great link from https://sassisfaction.com :: &related=yarrcat' }>
              <svg
                dangerouslySetInnerHTML={{__html: "<use xlink:href='assets/symbols.svg#icon-twitter'/>"}}>
              </svg>
            </a>
            <a href={ props.link }>
              <svg
                dangerouslySetInnerHTML={{__html: "<use xlink:href='assets/symbols.svg#icon-link'/>"}}>
              </svg>
            </a>
          </div>
        </div>
      
      </div>
    </div>
  );
}

export default Item;
