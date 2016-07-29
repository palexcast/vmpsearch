'use strict';

function SideNav() {
  // Constants
  this.showButtonEl = document.querySelector( '.js-menu-show' );
  this.hideButtonEl = document.querySelector( '.js-menu-hide' );
  this.sideNavEl = document.querySelector( '.js-side-nav' );
  this.sideNavContainerEl = document.querySelector( '.js-side-nav-container' );

  // Control whether the container's children can be focused
  // Set initial state to inert since the drawer is offscreen
  this.detabinator = new Detabinator( this.sideNavContainerEl );
  this.detabinator.inert = true;

  // Functions
  this.showSideNav = showSideNav.bind( this );
  this.hideSideNav = hideSideNav.bind( this );
  this.blockClicks = blockClicks.bind( this );
  this.onTouchStart = onTouchStart.bind( this );
  this.onTouchMove = onTouchMove.bind( this );
  this.onTouchEnd = onTouchEnd.bind( this );
  this.onTransitionEnd = onTransitionEnd.bind( this );
  this.update = update.bind( this );
  this.addEventListeners = addEventListeners.bind( this );
  this.applyPassive = applyPassive;

  // Variables
  this.startX = 0;
  this.currentX = 0;
  this.touchingSideNav = false;

  this.supportsPassive = undefined;

  this.addEventListeners();

  /**
   * @desc Adds event listeners to the SideNav elements
   */
  function addEventListeners() {
    this.showButtonEl.addEventListener( 'click', this.showSideNav );
    this.hideButtonEl.addEventListener( 'click', this.hideSideNav );
    this.sideNavEl.addEventListener( 'click', this.hideSideNav );
    this.sideNavContainerEl.addEventListener( 'click', this.blockClicks );

    this.sideNavEl.addEventListener( 'touchstart', this.onTouchStart, this.applyPassive() );
    this.sideNavEl.addEventListener( 'touchmove', this.onTouchMove, this.applyPassive() );
    this.sideNavEl.addEventListener( 'touchend', this.onTouchEnd );
  }

  /**
   * @desc
   */
  function applyPassive() {
    if ( this.supportsPassive !== undefined ) {
      return this.supportsPassive ? {
        passive: true
      } : false;
    }
    // feature detect
    var isSupported = false;
    try {
      document.addEventListener( 'test', null, {get passive() {
          isSupported = true;
        }
      } );
    } catch ( e ) {}
    this.supportsPassive = isSupported;
    return this.applyPassive();
  }

  /**
   * @desc
   */
  function onTouchStart( event ) {
    if ( !this.sideNavEl.classList.contains( 'side-nav--visible' ) )
      return;

    this.startX = event.touches[ 0 ].pageX;
    this.currentX = this.startX;

    this.touchingSideNav = true;
    requestAnimationFrame( this.update );
  }

  /**
   * @desc
   */
  function onTouchMove( event ) {
    if ( !this.touchingSideNav )
      return;

    this.currentX = event.touches[ 0 ].pageX;
    var translateX = Math.min( 0, this.currentX - this.startX );

    if ( translateX < 0 ) {
      event.preventDefault();
    }
  }

  /**
   * @desc
   */
  function onTouchEnd( event ) {
    if ( !this.touchingSideNav )
      return;

    this.touchingSideNav = false;

    var translateX = Math.min( 0, this.currentX - this.startX );
    this.sideNavContainerEl.style.transform = '';

    if ( translateX < 0 ) {
      this.hideSideNav();
    }
  }

  /**
   * @desc
   */
  function update() {
    if ( !this.touchingSideNav )
      return;

    requestAnimationFrame( this.update );

    var translateX = Math.min( 0, this.currentX - this.startX );
    this.sideNavContainerEl.style.transform = `translateX(${translateX}px)`;
  }

  /**
   * @desc
   */
  function blockClicks( event ) {
    event.stopPropagation();
  }

  /**
   * @desc
   */
  function onTransitionEnd( event ) {
    this.sideNavEl.classList.remove( 'side-nav--animatable' );
    this.sideNavEl.removeEventListener( 'transitionend', this.onTransitionEnd );
  }

  /**
   * @desc
   */
  function showSideNav() {
    this.sideNavEl.classList.add( 'side-nav--animatable' );
    this.sideNavEl.classList.add( 'side-nav--visible' );
    this.detabinator.inert = false;
    this.sideNavEl.addEventListener( 'transitionend', this.onTransitionEnd );
  }

  /**
   * @desc
   */
  function hideSideNav() {
    this.sideNavEl.classList.add( 'side-nav--animatable' );
    this.sideNavEl.classList.remove( 'side-nav--visible' );
    this.detabinator.inert = true;
    this.sideNavEl.addEventListener( 'transitionend', this.onTransitionEnd );
  }
}

var sideNav = new SideNav();
