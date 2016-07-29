( function () {
  'use strict';

  angular
    .module( 'fjellkam', [
      'fjellkam.config',
      'fjellkam.routes',
      'fjellkam.run'
    ] );

  angular
    .module( 'fjellkam.config', [ 'pascalprecht.translate' ] )
    .config( config );

  angular
    .module( 'fjellkam.run', [] )
    .run( run );

  config.$inject = [ '$httpProvider', '$locationProvider', '$sceProvider', '$translateProvider' ];

  function config( $httpProvider, $locationProvider, $sceProvider, $translateProvider ) {
    /**
     * Adds a flag that makes the XMLHttpRequests send credentials with its requests
     *
     * https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS#Requests_with_credentials
     */
    $httpProvider.defaults.withCredentials = true;


    /**
     * Prettifies the url, and activates
     * the HTML History API
     */
    $locationProvider.html5Mode( true );

    /**
     * Disables the $sce service, which in turn enables all HTML evaluation.
     * Remember to always disable unwanted tags (script, etc) server-side.
     * Used to display rich text content.
     *
     * USE WITH CARE. High risk of Cross Site Scripting
     */
    $sceProvider.enabled( false );


    /**
     * Adds support for i18n and l10n
     * Language files are found in js/strings.
     * strings_XX are global variables
     *
     * Github: https://github.com/angular-translate/angular-translate
     * Guide: https://angular-translate.github.io/docs/#/guide
     */
    $translateProvider
      .translations( 'nn', strings_nb ) // Adds support for Norwegian (bokmål).

    .translations( 'en', strings_en ) // Adds support for English.

    // .determinePreferredLanguage();  // Makes ng-translate finding the user's preferred language (doesn't work?).

    .uniformLanguageTag( 'bcp47' ) // Makes ng-translate use BCP 47 to check whether the user's preferred languages is in the list of translations.

    .preferredLanguage( 'nb' ) // Sets the language to Norwegian if the user's preferred languages does not match any of the provided translations.

    .useSanitizeValueStrategy( 'escape' ) // Escapes the translation strings, to prevent XSS.

    .useCookieStorage() // Makes ng-translate work together with ng-cookie to store what language the user prefers.

    .fallbackLanguage( 'nb' ); // Sets Norwegian as the fallback-language for whenever a translation is missing.
  }

} )();
