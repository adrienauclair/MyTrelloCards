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


app.service('TrelloLowLevel', [ '$q', '$rootScope', function($q, $rootScope){

    var TrelloObj = {};

    // wrap Trello queries in angular promise
    TrelloObj.query = function(entity_name) { // success
        var deferred = $q.defer();
        Trello.get(entity_name, function(data) {
            // wrap call to resolve in $apply as this function is out of the main event loop
            $rootScope.$apply(function() {
                deferred.resolve(data);
            });
        }, function(response) { // error
            console.log("trello error")
            $rootScope.$apply(function() {
                deferred.reject(response);
            });
        });

        return deferred.promise;
    };

    return TrelloObj;
}]);


app.service('TrelloMgr', ['TrelloLowLevel', '$rootScope' , function(TrelloLowLevel,$rootScope) {

    var trelloContainer = {};
    trelloContainer.cards = {};

    trelloContainer.getCards = function() {
        return trelloContainer.cards;
    };

    trelloContainer.refreshCards = function() {
        console.log( "refresh cards");
        trelloQueryPromise = TrelloLowLevel.query('members/adrienauclair1/cards?filter=open');
        console.log("right after query");
        trelloQueryPromise.then(
            function (allCards) {
                trelloContainer.cards = allCards;
                console.log("in then");
                console.log( trelloContainer.cards );
                console.log("emit event");
                $rootScope.$broadcast('CARDS_UPDATED', 'no params value2');
            }
        );

        console.log( "after then");
        console.log( trelloContainer.cards );
    }

    return trelloContainer;
}])



app.controller("MainCtrl", function($scope) {
    $scope.model = {
        message: "This is my app!!!"
    }


});


app.controller('trelloAccount', ['$scope', 'TrelloMgr', function ($scope, TrelloMgr) {

    $scope.model = {}


    $scope.$on('$viewContentLoaded', function()
    {
        $scope.model.myCards = TrelloMgr.getCards();
    });

    $scope.$on('CARDS_UPDATED',function(response,params){
        $scope.model.myCards = TrelloMgr.getCards();
    })

    $scope.model.refresh = function() {
        TrelloMgr.refreshCards();
        console.log( "after refresh in ctrl");
    };


    //--------------- LOGIN ----------------------------------------
    $scope.login = {
        isLoggedIn: false
    };

    var updateLogin = function () {
        $scope.login.isLoggedIn = Trello.authorized();
        console.log("update login")
        console.log($scope.login.isLoggedIn)
    };


    // log to trello account function
    // if the user is not already logged, a popup will open and ask for credential
    // else, it will carry on withtout poping up
    $scope.logToTrello = function() {
        Trello.authorize({
            type: "popup",
            name: "Adrien Auclair test app",
            scope: { write: false, read: true },
            persist: true,                          // token is saved on local storage
            success: function () {
                Trello.authorize({
                    interactive: false,
                    success: function () {
                        updateLogin();
                        $scope.model.refresh();
                    }
                });
            }
        });
        console.log( Trello.authorized() );
    };

    $scope.login.logoutFromTrello = function () {
        Trello.deauthorize();
        updateLogin();
        $scope.model.myCards = {};
    };



    $scope.loginOpts = {
        backdropFade: true,
        dialogFade: true,
        backdropClick: false
    };

    Trello.authorize({
        interactive: false,
        success: updateLogin
    });
    console.log("is logged :")
    console.log($scope.login.isLoggedIn)

    if( $scope.login.isLoggedIn )
    {
        $scope.model.refresh();
    }


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
