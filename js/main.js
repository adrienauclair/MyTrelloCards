var app = angular.module("app", ["ngRoute","mgcrea.ngStrap"]);



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
});

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
