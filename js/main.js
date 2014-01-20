var app = angular.module("app", ["ngRoute","mgcrea.ngStrap",'ui.bootstrap']);



app.config(function($routeProvider) {
    $routeProvider.when('/',
        {
            templateUrl: "main.html",
            controller: "AppCtrl"
        }
    );

    $routeProvider.when('/view1',
        {
            templateUrl: "view1.html"
        }
    );

    $routeProvider.when('/view2',
        {
            templateUrl: "view2.html",
            controller: "AppCtrl2"
        }
    );

    $routeProvider.when('/trelloAccount',
        {
            templateUrl: "trelloAccount.html",
            controller: "trelloAccount"
        }
    );
});

app.config(['$httpProvider', function($httpProvider) {
    delete $httpProvider.defaults.headers.common["X-Requested-With"]
}])

app.filter('encodeURIComponent', function () {
    return window.encodeURIComponent;
});


app.service('TrelloNg', [ '$q', '$rootScope', function($q, $rootScope){

    var TrelloNg = {};

    // wrap Trello queries in angular promise
    TrelloNg.query = function(entity_name) { // success
        var deferred = $q.defer();
        Trello.get(entity_name, function(data) {
            // wrap call to resolve in $apply as this function is out of the main event loop
            $rootScope.$apply(function() {
                deferred.resolve(data);
            });
        }, function(response) { // error
            $rootScope.$apply(function() {
                deferred.reject(response);
            });
        });

        return deferred.promise;
    };

    return TrelloNg;
}]);


app.controller("MainCtrl", function($scope) {
    $scope.model = {
        message: "This is my app!!!"
    }


});


app.controller('trelloAccount', ['$scope', 'TrelloNg', function ($scope, TrelloNg) {

        $scope.onUnlog = function() {
            Trello.deauthorize();
            console.log( Trello.authorized() );
            alert("you have been unlogged");
        }

        var onAuthorize = function() {
            alert("Authorized");
        };

        $scope.logToTrello = function() {
            Trello.authorize({
                type: "popup",
                scope: { write: false, read: true },
                persist: true,
                success: onAuthorize
            });
            console.log( Trello.authorized() );
        }


        //---------------------------
        $scope.model = {}
        $scope.model.myCards = {};
        $scope.model.trelloQueryPromise = {};

        $scope.model.refreshMyCards = function () {

            $scope.model.trelloQueryPromise = TrelloNg.query('members/adrienauclair1/cards?filter=open');
            $scope.model.trelloQueryPromise.then(
                function (allCards) {
                    $scope.model.myCards = allCards;
                    console.log("in then");
                }
            );

            console.log( "after then");
            console.log( $scope.model.myCards );

        };


    }]);

app.controller("AppCtrl", function($scope) {
    $scope.model = {
        message: "This is my app!!!"
    }


});

app.controller("AppCtrl2", function($scope) {
    $scope.model = {
        message: "This is my app 2 !!!"
    }
});
