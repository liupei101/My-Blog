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
        when("/views/category/:id", {
            templateUrl: '/views/userblog.html',
            controller: 'categoryview'
        }).
        when("/views/blogview/:id", {
            templateUrl: '/views/blogview.html',
            controller: 'blogview'
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

    app.factory('AuthData',  [ '$http',function ($http) {
        var User;//JSON数据格式
        var Category;
        var DEBUG = 1;
        var doRequest = function (path, way, params) {
            return $http({
                url: path,
                method: way,
                data: params
            });
        };
        return {
            //params传入为数组对象形式
            defaultSetting: function() {return doRequest('/json/default.json','get','');} ,
            login: function(params) {return doRequest('/json/login.json','get',params);} ,
            logout: function() {return doRequest('/json/logout.json','get','');} ,
            userData: function(params) {return doRequest('/json/user.json','get',params);} ,
            userBlogList: function() {return doRequest('/json/blogs.json','get','');} ,
            userCategory: function(params) {return doRequest('/json/category.json','get','');} ,
            userModifyPassword: function(params) {return doRequest('/api/user/usermodifypassword','post',params);} ,
            setUser: function(newUser) { User = newUser;} ,
            User,
            Category,
            DEBUG
        };
    }]);

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

    app.run(['$rootScope', '$window', 'AuthData', function($rootScope,$window,AuthData) {
        $rootScope.DEBUG = '1';
        $rootScope.login = 0 ;
        var getAuthData = function(admin) {
            AuthData.userData(admin).success(function (msg) {
                if(msg['code'] = "0000") {
                    AuthData.User = msg.data;
                }
                else {
                    alert(msg['errorMsg']);
                }
            }).error(function() {
                alert("Network Error!");
            });
            //得到文章分类信息
            AuthData.userCategory(admin).success(function (msg) {
                if(msg['code'] = "0000") {
                    AuthData.Category = msg['data'];
                }
                else {
                    alert(msg['errorMsg']);
                }
            }).error(function() {
                alert("Network Error!");
            });
        };
        var fetchData = function() {
            AuthData.defaultSetting().success(function (msg) {
                if(msg['code'] === '0000') {
                    getAuthData(msg['admin']);
                }
                else {
                    alert(msg['errorMsg']);
                }
            }).error(function() {
                alert("Network Error!");
            });
        };
        
        fetchData();
        $window.location.replace('/#/');
        //@ 刷新时需要fetchData

    }]);

    app.controller("site", ['$scope', '$rootScope','$window', '$modal', 'AuthData', function($scope, $rootScope, $window, $modal, AuthData) {
        $scope.page = 'config';
        $scope.login = $rootScope.login;
        $scope.$on('updateUserData', function () {
            $rootScope.login = !$rootScope.login;
            $scope.login = $rootScope.login;
            $scope.page = 'config';
            $window.location.replace('/#/');
            //alert($scope.User.login + " " + $scope.User.name);
        });

        $scope.signOut = function () {
            AuthData.logout().success(function (msg) {
                if(msg['code'] === '0000') {
                    $rootScope.$broadcast('updateUserData');
                }
            }).error(function() {
                alert("Network Error!");
            });
        };

        $scope.signIn = function() {
            $modal.open({
                templateUrl: '/views/login.html',
                controller: 'userSignIn'
            });
        };
    }]);

    app.controller("userSignIn", ['$scope', '$http', '$rootScope', '$window', '$modalInstance', 'AuthData', function($scope,$http,$rootScope,$window,$modalInstance,AuthData) {
        $scope.loginForm = {
            name: '' ,
            password: ''
        };
        $scope.signIn = function () {
            AuthData.login($scope.loginForm).success(function (msg){
                if(msg['code'] !== '0000') {
                    alert(msg['errorMsg']);
                }
                else {
                    $rootScope.$broadcast('updateUserData');//更新site视图数据
                    $modalInstance.close();
                }
            }).error(function () {
                alert("Network Error!");
            });
        };
        $scope.close = function() {
            $modalInstance.close();
        }
    }]);

    app.controller("config", ['$scope', '$rootScope', '$http', function($scope,$rootScope,$http) {
        
    }]);

    app.controller("userconfig", ['$scope', '$http', '$rootScope', 'AuthData', function($scope,$http,$rootScope,AuthData) {
        $scope.selectPage = 'home';
        $scope.user = AuthData.User;
        $scope.category = AuthData.Category;
    }]);

    app.controller("userblog", ['$scope', '$http', '$rootScope', 'AuthData', function($scope,$http,$rootScope,AuthData) {
        $scope.selectPage = 'blog';
        $scope.user = AuthData.User;
        $scope.category = AuthData.Category;
        AuthData.userBlogList().success(function (data) {
            if(data['status'] === '1') {
                $scope.blogs = data['blogs'];
            }
            else {
                alert(data['msg']);
            }
        }).error(function () {
            alert("Network Error!");
        });
    }]);

    app.controller("categoryview", ['$scope', '$http', '$rootScope', '$routeParams', 'AuthData', function($scope,$http,$rootScope,$routeParams,AuthData) {
        $scope.selectPage = 'blog';
        $scope.user = AuthData.User;
        $scope.category = AuthData.Category;
        $scope.categoryID = $routeParams.id;
        //根据ID查询对应分类的所有文章
    }]);

    app.controller("blogview", ['$scope', '$http', '$rootScope', 'AuthData', function($scope,$http,$rootScope,AuthData) {
        
        
    }]);

    app.controller("usercourse", ['$scope', '$http', '$rootScope', 'AuthData', function($scope,$http,$rootScope,AuthData) {
        $scope.selectPage = 'course';
        $scope.user = AuthData.User;
        $scope.category = AuthData.Category;
        $scope.photoSrc = './images/pic/bg.jpg';
        $scope.uplaodPhoto = function(){
            alert('上传图片成功!');
        };
    }]);

    app.controller("usersetting", ['$scope', '$http', '$rootScope', 'AuthData', function($scope,$http,$rootScope,AuthData) {
        $scope.selectPage = 'setting';
        $scope.user = AuthData.User;
        $scope.category = AuthData.Category;
        $scope.key = {
            password: '',
            newPassword: '',
            confirmPassword: '',
            motto: '结成明日奈'
        };
        $scope.confirmModify = function(){
            $scope.sending = 0;
            alert('修改成功！');
        };
    }]);
})()