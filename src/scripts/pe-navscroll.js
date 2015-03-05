
var peNavScroll = (function(){
  "use strict";

  // shim layer with setTimeout fallback
  // http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){ window.setTimeout(callback, 1000 / 60); };
  })();
  
  var root = /firefox|trident/i.test(navigator.userAgent) ? document.documentElement : document.body,
      config;
  

  var initialize = function (options) {

    config = {
      nav: '.navbar',
      duration: 900,
      offset: 0,
      allLinks: false,
      hashChange: true,
      class: 'active',
      easingFunction : function(e){
        return e;
      }
    };

    for(var prop in options) {
      if(options.hasOwnProperty(prop)){
        config[prop] = options[prop];
      }
    }

    function deselectAll(){
      [].slice.call(navLinks).forEach(function(elem, index){
        navLinks[index].parentElement.classList.remove(config.class);
        navLinks[index].blur();
      });
    }

    function eP(elem){
      if( getOffset(elem).top < root.scrollTop+tMenu.offsetHeight + config.offset + 2 ){
        return elem;
      }
    }


    var tMenu = document.querySelector(config.nav),
        links = config.allLinks ? document.querySelectorAll('a[href^="#"]') : tMenu.querySelectorAll("a"),
        navLinks,
        lId;

    function isRealLink(elem){
      if(document.getElementById(/[^#]+$/.exec(elem.href)[0]))
        return elem;
    }

    links = [].slice.call(links).filter(isRealLink);
    navLinks = [].slice.call(tMenu.querySelectorAll("a")).filter(isRealLink);
    
    var i = links.length;
    

    var scrlItem = navLinks.map(function(value, index){
      var item = document.getElementById(/[^#]+$/.exec(navLinks[index].href)[0]);
      if(item !== undefined) { return item; }
    });

    while (i--) {
      if( document.getElementById(/[^#]+$/.exec(links[i].href)[0])){

        links[i].addEventListener("click", function(e) {

          var startPos = root.scrollTop;
          var hash = /[^#]+$/.exec(this.href)[0];
          var maxScroll = root.scrollHeight - window.innerHeight;
          var endPos = document.getElementById(hash).getBoundingClientRect().top - (tMenu.offsetHeight + config.offset);
          var scrollEndValue = startPos + endPos < maxScroll ? endPos : maxScroll - startPos;
          var duration = config.duration;
          
          scrollTo(startPos + scrollEndValue, duration, config.easingFunction, function(){
            // Callback 
          });

          if(config.hashChange) {
            if(history.pushState) {
              history.pushState(null, null, '#' + hash);
            } else {
              location.hash = '#' + hash;
            }
          }

          e.preventDefault();
          
        });

      } // if

    } // while



    var onScrollFn = function (event) {

      var maxScroll = root.scrollHeight - window.innerHeight;
      var current = scrlItem.filter(eP);

      if(current.length){
        current = current[current.length-1];
        var cId = current.id;
        
        if(lId !== cId){
          lId = cId;
          deselectAll();
          tMenu.querySelector('[href="#' + cId + '"]').parentElement.classList.add(config.class);
        }

        if( (getViewportH() + scrollY() ) >= root.scrollHeight ){
          deselectAll();
          navLinks[navLinks.length-1].parentElement.classList.add(config.class);
        }
      }
      
      
    }; // Scroll

    window.addEventListener( 'scroll', onScrollFn);
  
  };
  

  return {
    init: initialize
  };

})();





// Utility functions and objects

function scrollTo(Y, duration, easingFunction, callback) {
    
    var start = Date.now(),
      root = /firefox|trident/i.test(navigator.userAgent) ? document.documentElement : document.body,
      elem = root,
      from = elem.scrollTop;
 
    if(from === Y) {
        callback();
        return;
    }
 
    function min(a,b) {
      return a<b?a:b;
    }
 
    function scroll(timestamp) {
 
        var currentTime = Date.now(),
            time = min(1, ((currentTime - start) / duration)),
            easedT = easingFunction(time);
 
        elem.scrollTop = (easedT * (Y - from)) + from;
 
        if(time < 1) requestAnimationFrame(scroll);
        else
            if(callback) callback();
    }
 
    requestAnimationFrame(scroll);
}

var easing = {
  linear: function (t) { return t; },
  easeInQuad: function (t) { return t*t; },
  easeOutQuad: function (t) { return t*(2-t); },
  easeInOutQuad: function (t) { return t<0.5 ? 2*t*t : -1+(4-2*t)*t; },
  easeInCubic: function (t) { return t*t*t; },
  easeOutCubic: function (t) { return (--t)*t*t+1; },
  easeInOutCubic: function (t) { return t<0.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1; },
  easeInQuart: function (t) { return t*t*t*t; },
  easeOutQuart: function (t) { return 1-(--t)*t*t*t; },
  easeInOutQuart: function (t) { return t<0.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t; },
  easeInQuint: function (t) { return t*t*t*t*t; },
  easeOutQuint: function (t) { return 1+(--t)*t*t*t*t; },
  easeInOutQuint: function (t) { return t<0.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t; }
};

var docElem = window.document.documentElement;

function getViewportH() {
  var client = docElem.clientHeight,
  inner = window.innerHeight;
  
  if( client < inner ) {
    return inner; 
  } else {
    return client;
  }
}

function scrollY() {
  return window.pageYOffset || docElem.scrollTop;
}

function getOffset( el ) {
  var offsetTop = 0, offsetLeft = 0;
  do {
    if ( !isNaN( el.offsetTop ) ) {
     offsetTop += el.offsetTop;
    }
    if ( !isNaN( el.offsetLeft ) ) {
     offsetLeft += el.offsetLeft;
    }
  } while( el = el.offsetParent );

    return {
    top : offsetTop,
    left : offsetLeft
  };
}