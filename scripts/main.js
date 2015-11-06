(function () {
    function isNumber(chr) {
        return chr >= '0' && chr <= '9';
    }
    function isAlpha(chr) {
        return (chr >= 'a' && chr <= 'z') || (chr >= 'A' && chr <= 'Z');
    }
    function isSubset(chr, set) {
        for(var i = 0; i < set.length; i++) {
            if(chr === set[i]) return true;
        }
        return false;
    }
    var app = angular.module('app', ['ngRoute', 'ui.bootstrap']);

    app.config(['$httpProvider', function($httpProvider){
        $httpProvider.defaults.transformRequest = function(obj){
            var str = [];
            for(var p in obj){
                str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
            return str.join('&');
        }
        $httpProvider.defaults.headers.post = {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        }
    }]);

    app.directive('markdown', function() {
        return {
            restrict: 'EA',
            scope: {
                content: '='
            },
            link: function($scope, $element) {
                if (angular.isDefined($scope.content)) {
                    return $scope.$watch('content', function() {
                        var content = angular.copy($scope.content);
                        content = marked(content);//解析markdown文档的方法
                        $element.empty().append(content);
                    }, true);
                }
            },
            template: '<div></div>'
        };
    });

    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        //$locationProvider.html5Mode(true);
        $routeProvider.
        when("/", {
            templateUrl: '/views/index.html',
            controller: 'config'
        }).
        when("/views/config", {
            templateUrl: '/views/userconfig.html',
            controller: 'userconfig'
        }).
        when("/views/blog", {
            templateUrl: '/views/userblog.html',
            controller: 'userblog'
        }).
        when("/views/course", {
            templateUrl: '/views/usercourse.html',
            controller: 'usercourse'
        }).
        when("/views/useredit/:type", {
            templateUrl: '/views/useredit.html',
            controller: 'useredit'
        }).
        when("/views/setting", {
            templateUrl: '/views/usersetting.html',
            controller: 'usersetting'
        }).
        otherwise({
            redirectTo: '/views/404'
        });
    }]);
    app.run(['$rootScope', function($rootScope) {
        $rootScope.DEBUG = 1;
        $rootScope.login = 0;
    }]);
    app.controller("site", ['$scope', '$rootScope', function($scope, $rootScope) {
        $scope.login = 0;
        $scope.page = "config";
        
        $scope.signOut = function () {
            $http.get('/api/user/logout').success(function (msg) {
                if(msg['code'] === '0000') {
                    $rootScope.$broadcast('refreshData');
                }
            });
        }
        $scope.signIn = function () {
            // alert("fuck");
            $modal.open({
                templateUrl: '/views/login.html',
                controller: 'userSignIn',
                size: 'lg'
            });
        }
        
    }]);

    app.controller("userSignIn", ['$scope', '$http', '$rootScope', function($scope,$http,$rootScope) {
        $scope.userName = '';
        $scope.password = '';
        $scope.signIn = function () {
            $http({
                url: '/api/user/login',
                method: 'post',
                data: {
                    userName: $scope.userName,
                    password: $scope.password
                }
            }).success(function (msg){
                if(msg['code'] !== '0000') {
                    alert(msg['errorMsg']);
                }
                $rootScope.$broadcast('refreshData');
                $rootScope.$broadcast('updateUserData');
            }).error(function () {
                alert("Network Error!");
            });
        };
    }]);

    app.controller("config", ['$scope', function($scope) {
        
    }]);

})()