(function() {
  'use strict';

  angular
    .module('fjellkam.routes', [
      'ngRoute'
    ])
    .config(routes);

  routes.$inject = ['$routeProvider', '$locationProvider'];

  function routes($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'static/templates/views/home.html',
        controller: 'HomeController',
        controllerAs: 'homeCtrl',
        title: 'pageTitle.HOME'
      })

    // Table-tennis
    // Bandy
    // Football
    // Senior
    // Cabins
    // About
    // Contact

    .otherwise({
      templateUrl: 'static/templates/views/404.html',
      title: 'pageTitle.ERROR404'
    });
  }

})(););
}

})();
