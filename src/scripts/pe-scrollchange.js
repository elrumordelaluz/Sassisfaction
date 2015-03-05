
var peScrollChange = (function(){

  "use strict"


  var initialize = function (options) {

    var config = {
      elem: '.navbar',
      trigger: 50,
      classesToChange: 'nav-bg',
      offset: 0,
      removeClass: false,
      endPoint:0
    };

    for(var prop in options) {
      if(options.hasOwnProperty(prop)){
        config[prop] = options[prop];
      }
    }


    function d() {

      function addCls(){
        for (var i = 0; i < aCs.length; i++) {
            g.classList.add(aCs[i]);
        };
      }

      function removeCls(){
        for (var i = 0; i < aCs.length; i++) {
            g.classList.remove(aCs[i]);
        };
      }

      var g = config.elem.nodeType === 1 ? config.elem : document.querySelector(config.elem),
          a, x,
          aC = config.classesToChange || "nav-bg",
          aCs = aC.split(' ');

      if(isNaN(config.trigger)){
          x = config.trigger.nodeType === 1 ? config.trigger : document.querySelector(config.trigger);
          a = x.getBoundingClientRect().top + c() - g.offsetHeight + config.offset;
          a = a > 0 ? a : g.offsetHeight; 
      } else {
        a = config.trigger;
      }

      var h = c();
      if(config.endPoint !== 0){
        if (h >= a && h <= a + config.endPoint) {
          if(!config.removeClass) { addCls(); } else { removeCls(); }
        } else {
          if(!config.removeClass) { removeCls(); } else{ addCls(); }
        }  
      } else {
        if (h >= a) {
          if(!config.removeClass) { addCls(); } else { removeCls(); }
        } else {
          if(!config.removeClass) { removeCls(); } else{ addCls(); }
        } 
      }
      
    }

    function c() {
      return window.pageYOffset || document.documentElement.scrollTop
    }


    window.addEventListener( 'scroll', d);
    window.addEventListener( 'load', d);


  } // Init


  return {
    init: initialize
  };

})();


