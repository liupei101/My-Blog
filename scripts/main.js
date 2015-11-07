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

    app.directive('usernav', function() {
        return {
            restrict: 'E',
            templateUrl: '/views/usernav.html',
            replace: true
        };
    });

    app.directive('userinfo', function() {
        return {
            restrict: 'E',
            templateUrl: '/views/userinfo.html',
            replace: true
        };
    });

    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        // $locationProvider.html5Mode(true);
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
        $rootScope.login = 1;
    }]);

    app.controller("site", ['$scope', '$rootScope', '$modal', function($scope, $rootScope, $modal) {
        // $scope.login = 0;
        $scope.page = "config";
        
        $scope.logOut = function () {
            $rootScope.login = !$rootScope.login;
            $http.get('/api/user/logout').success(function (msg) {
                if(msg['code'] === '0000') {
                    $rootScope.$broadcast('refreshData');
                }
            });
        }
        $scope.signIn = function () {
            $modal.open({
                templateUrl: '/views/login.html',
                controller: 'userSignIn'
            });
        }
        
    }]);

    app.controller("userSignIn", ['$scope', '$http', '$rootScope', '$modalInstance', function($scope,$http,$rootScope,$modalInstance) {
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
        $scope.close = function () {
            $modalInstance.close();
        }
    }]);

    app.controller("config", ['$scope', '$rootScope', '$http', function($scope,$rootScope,$http) {
        
    }]);

    app.controller("userconfig", ['$scope', '$http', '$rootScope', function($scope,$http,$rootScope) {
        $scope.selectPage = 'home';
        $scope.userName = "NUM_24";
        $scope.visitTime = "2015-10-15";
        $scope.motto = "结成明日奈";
        $scope.contents = "";
    }]);

    app.controller("userblog", ['$scope', '$http', '$rootScope', function($scope,$http,$rootScope) {
        $scope.selectPage = 'blog';
        $scope.userName = "NUM_24";
        $scope.visitTime = "2015-10-15";
        $scope.motto = "结成明日奈";
        $scope.contents = "";
    }]);

    app.controller("usercourse", ['$scope', '$http', '$rootScope', function($scope,$http,$rootScope) {
        $scope.selectPage = 'course';
        $scope.userName = "NUM_24";
        $scope.visitTime = "2015-10-15";
        $scope.motto = "结成明日奈";
        $scope.contents = "";
    }]);

    app.controller("usersetting", ['$scope', '$http', '$rootScope', function($scope,$http,$rootScope) {
        $scope.selectPage = 'setting';
        $scope.userName = "NUM_24";
        $scope.visitTime = "2015-10-15";
        $scope.motto = "结成明日奈";
        $scope.contents = "";
    }]);
})()