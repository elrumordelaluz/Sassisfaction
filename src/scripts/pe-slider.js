
var peSlider = (function(){
  
  "use strict"

  var slider, wrapper, slides, slidesList, config, prev, next, sliderPagination;

  var initialize = function (options) {

    config = {
      slider: '.pe-slider',
      navigation: true,
      pagination: true,
      auto: false,
      delay: 5000,
      hoverPause: false,
      infinite: true,
      hoverNav: false
    };

    for(var prop in options) {
      if(options.hasOwnProperty(prop)){
        config[prop] = options[prop];
      }
    }

    // slider = config.slider.nodeType === 1 ? config.slider :  document.querySelector(config.slider)
    // wrapper = slider.parentElement;

    // Just in this case I called 'slider' for convenience on init but here in the script is the 'wrapper'.
    wrapper = config.slider.nodeType === 1 ? config.slider :  document.querySelector(config.slider)
    slider = wrapper.querySelector('.pe-slides');
    
    slides = slider.querySelectorAll('li');
    slidesList = [].slice.call(slides);
    prev = wrapper.querySelector('.pe-slider-prev');
    next = wrapper.querySelector('.pe-slider-next');
    sliderPagination = _pagination(slides);

    var sliderElements = {
      slider : slider,
      wrapper : wrapper,
      slides : slides,
      slidesList : slidesList,
      prev : prev,
      next : next,
      sliderPagination : sliderPagination,
      timer: 0,
      infinite: config.infinite
    }

    _initEvents(config,sliderElements);
    

  } // initialize


  var _initEvents = function(options, sElems){

    sElems.wrapper.classList.add('pe-slider-wrapper');

    _updatePagination(sElems);

    if( !options.navigation ){
      sElems.wrapper.classList.add('no-nav');
    }

    if( !options.pagination ){
      sElems.wrapper.classList.add('no-pag');
    }

    if( options.hoverNav ){
      sElems.wrapper.classList.add('nav-hover');
    }

    function clearTimer(){
      clearInterval(sElems.timer);
    }

    function continueTimer(){
      startTimer(sElems, options.delay);
    }

    if( options.auto ){ 
      startTimer(sElems, options.delay);
      if ( options.hoverPause ) {
        sElems.wrapper.addEventListener('mouseover', clearTimer, false);
        sElems.wrapper.addEventListener('mouseout', continueTimer, false);
      }
    }

    function n(){
      _nextSlide(null, sElems);
      if( options.auto && !options.hoverPause ){ startTimer(sElems, options.delay); }
    }

    function p(){
      _prevSlide(null, sElems);
      if( options.auto && !options.hoverPause ){ startTimer(sElems, options.delay); }
    }

    next.addEventListener('click', n, false);
    prev.addEventListener('click', p, false);


    function paginationAction(){
      var selectedDot = this;
      
      if(!hasClass(selectedDot,'selected')){
        var dotList = [].slice.call(this.parentNode.children);
        var selectedPosition = dotList.indexOf(this);
        var activePosition = sElems.slidesList.indexOf(sElems.slider.querySelector('.selected'));
        
        if (activePosition < selectedPosition){
          _nextSlide(selectedPosition, sElems);
        } else {
          _prevSlide(selectedPosition, sElems);
        }
        if( options.auto && !options.hoverPause ){ startTimer(sElems, options.delay); }
      }

    } // paginationAction

    for (var i = 0; i < sElems.sliderPagination.length; i++){
      sElems.sliderPagination[i].addEventListener('click', paginationAction, false);
    }


  } // _initEvents



  var _nextSlide = function(s, sElems) {
    var n,
        activeSlide = sElems.slider.querySelector('.selected'),
        activeDot = sElems.wrapper.querySelector('.pe-slider-pag .selected');
    
    if(s === null){
      n = sElems.slidesList.indexOf(activeSlide) + 1;
    } else {
      n = s;
    }
    
    activeSlide.classList.remove('selected');
    activeDot.classList.remove('selected');
    
    if(n === sElems.slides.length) {
      sElems.slides[0].classList.add('selected');
      sElems.sliderPagination[0].classList.add('selected');
      sElems.slidesList.forEach(function(item, index){
        sElems.slides[index].classList.remove('past');
      });
    } else {
      sElems.slides[n].classList.add('selected');
      sElems.sliderPagination[n].classList.add('selected');
      sElems.slidesList.forEach(function(item, index){
        if(index < n){
          sElems.slides[index].classList.add('past');
        }
      });
    }
    
    if(!sElems.infinite){
      _updateNavigation(sElems.slides[n], sElems);
    }
  
  } // _nextSlide


  var _prevSlide = function(s, sElems){
    var n,
        activeSlide = sElems.slider.querySelector('.selected'),
        activeDot = sElems.wrapper.querySelector('.pe-slider-pag .selected');
    
    if(s === null){
      n = sElems.slidesList.indexOf(activeSlide) - 1;
    } else {
      n = s;
    }
    
    activeSlide.classList.remove('selected');
    activeDot.classList.remove('selected');

    if(sElems.infinite) {
      sElems.slidesList.forEach(function(item, index){
        sElems.slides[index].classList.add('past');
      });
    }

    if(n === -1) {
      sElems.slides[sElems.slides.length - 1].classList.add('selected');
      sElems.slides[sElems.slides.length - 1].classList.remove('past');
      sElems.sliderPagination[sElems.slides.length - 1].classList.add('selected');
    } else {
      sElems.slides[n].classList.add('selected');
      sElems.slides[n].classList.remove('past');
      sElems.sliderPagination[n].classList.add('selected');
      sElems.slidesList.forEach(function(item, index){
        if(index > n){
          sElems.slides[index].classList.remove('past');
        }
      });
    }

    if(!sElems.infinite){
      _updateNavigation(sElems.slides[n], sElems);
    }
    
  } // _prevSlide



  var _pagination = function(s){
    var ul = document.createElement('ul');
    ul.className = 'pe-slider-pag';
    
    [].slice.call(s).forEach(function(elem, index){
      var dotContainer = document.createElement('li');
      if(index === 0){
        dotContainer.className = 'selected';
      }
      var dot = document.createElement('a');
      dot.setAttribute('href','#0');
      dot.innerHTML = index + 1;
      dotContainer.appendChild(dot);
      ul.appendChild(dotContainer);
    });

    wrapper.appendChild(ul);
    
    return ul.querySelectorAll('li');
    
  } // _pagination


  var _updateNavigation = function(active, sElems){
    // Hide prev button
    if(sElems.slidesList.indexOf(active) === 0){
      sElems.prev.classList.add('inactive');
    } else {
      sElems.prev.classList.remove('inactive');
    }
    
    // Hide next button
    if(sElems.slidesList.indexOf(active) === sElems.slides.length - 1){
      sElems.next.classList.add('inactive');
    } else {
      sElems.next.classList.remove('inactive');
    }

    // Add .past class to past slides if start from other than first
    sElems.slidesList.forEach(function(item, index){
      if(index < sElems.slidesList.indexOf(active) ){
        sElems.slides[index].classList.add('past');
      }
    });
  } // _updateNavigation


  var _updatePagination = function(sElems){
    var n;

    // If pre-exist a slide with class 'selected'
    if(sElems.slider.querySelector('.selected')){
      n = sElems.slidesList.indexOf(sElems.slider.querySelector('.selected'));
      sElems.wrapper.querySelector('.pe-slider-pag .selected').classList.remove('selected');
      sElems.sliderPagination[n].classList.add('selected');
      if(!sElems.infinite) { _updateNavigation(sElems.slides[n],sElems); }
    } else {
      sElems.slider.querySelector('li').classList.add('selected');
      if(!sElems.infinite) { _updateNavigation(sElems.slides[0],sElems); }
    }
        
  }

  var _autoSlide = function(p, sElems) {
    if ( p === (sElems.slides.length - 1) ) {
      _prevSlide(0, sElems);
    } else {
      _nextSlide(null, sElems);
    }
  }

  var startTimer = function(sElems, delay){
    clearInterval(sElems.timer);
    sElems.timer = setInterval(function(){
      var activePosition = sElems.slidesList.indexOf(sElems.slider.querySelector('.selected'));
      _autoSlide(activePosition, sElems)
    }, delay);
  }


  function hasClass(element, cls) {
    return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
  }



  return {
    init: initialize
  };

})();