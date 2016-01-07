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
        when("/views/useredit/:id", {
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
                        MathJax.Hub.Queue(["Typeset", MathJax.Hub]);
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
            userBlogDetail: function(params) {return doRequest('json/blogdetail.json','get','');} ,
            userCategory: function(params) {return doRequest('/json/category.json','get','');} ,
            similarBlog: function(params) {return doRequest('/json/similar.json','get','');} ,
            addCategory: function(params) {return doRequest('/json/newcategory.json','get','');} ,
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
        $rootScope.onViewPage = "home";
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
                    //刷新时同步显示信息
                    $rootScope.$broadcast("getData");
                }
                else {
                    alert(msg['errorMsg']);
                }
            }).error(function() {
                alert("Network Error!");
            });
            
        };
        $rootScope.fetchData = function() {
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
        $rootScope.fetchData();
        // $window.location.replace('/#/');
        //@ 刷新时需要fetchData

    }]);
    
    app.controller("usernavinfo", ['$scope', '$rootScope', 'AuthData', function($scope,$rootScope,AuthData) {
        $scope.$on("getData", function() {
            $scope.user = AuthData.User;
            $scope.category = AuthData.Category;
        });
    }]);

    app.controller("navbar", ['$scope', '$rootScope', function($scope,$rootScope) {
        $scope.$watch("onViewPage", function() {
            $scope.selectPage = $rootScope.onViewPage;
        });
    }]);

    app.controller("site", ['$scope', '$rootScope','$window', '$modal', 'AuthData', function($scope, $rootScope, $window, $modal, AuthData) {
        $scope.page = 'home';
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
        };
    }]);

    app.controller("config", ['$scope', '$rootScope', '$http', function($scope,$rootScope,$http) {
        
    }]);

    app.controller("userconfig", ['$scope', '$http', '$rootScope', 'AuthData', function($scope,$http,$rootScope,AuthData) {
        $rootScope.onViewPage = "home";
        
    }]);

    app.controller("userblog", ['$scope', '$http', '$rootScope', 'AuthData', function($scope,$http,$rootScope,AuthData) {
        $rootScope.onViewPage = "blog";
        $scope.user = AuthData.User;
        $scope.$on("getData", function() {
            $scope.user = AuthData.User;
        });
        AuthData.userBlogList().success(function (data) {
            if(data['code'] === '0000') {
                $scope.blogs = data['blogs'];
            }
            else {
                alert(data['errorMsg']);
            }
        }).error(function () {
            alert("Network Error!");
        });
    }]);

    app.controller("categoryview", ['$scope', '$http', '$rootScope', '$routeParams', 'AuthData', function($scope,$http,$rootScope,$routeParams,AuthData) {
        $rootScope.onViewPage = "blog";
        $scope.categoryID = $routeParams.id;
        
        //根据ID查询对应分类的所有文章
    }]);

    app.controller("blogview", ['$scope', '$http', '$rootScope', '$routeParams' ,'AuthData', function($scope,$http,$rootScope,$routeParams,AuthData) {
        $rootScope.onViewPage = "blog";
        $scope.blogID = $routeParams.id;
        $scope.content = '';
        //根据id查询对应文章
        AuthData.userBlogDetail($scope.blogID).success(function (msg) {
            if(msg['code'] === '0000') {
                $scope.blogDetail = msg['data'];
                $scope.content = $scope.blogDetail.content;
                $scope.cateID = $scope.blogDetail.cateid;
            }
            else {
                alert(msg['msg']);
            }
        }).error(function() {
            alert("Network Error!");
        });
        //查询同类文章的所有信息
        AuthData.similarBlog($scope.cateID).success(function (msg) {
            if(msg['code'] = "0000") {
                $scope.BlogSimilar = msg['data'];
            }
            else {
                alert(msg['errorMsg']);
            }
        }).error(function () {
            alert("Network Error!");
        });

    }]);

    app.controller("useredit", ['$scope', '$rootScope', '$http', '$modal', 'AuthData', function($scope,$rootScope,$http,$modal,AuthData) {
        $rootScope.onViewPage = "blog";
        $scope.user = AuthData.User;
        $scope.category = AuthData.Category;
        $scope.content = '####这里将显示输入内容......';
        $scope.markcontent = '';
        //一段傻逼的jQuery代码:
        var x = $('.modal-helps');
        x.find("li").find('div').hide();
        x.find('li:first').addClass('active');
        x.find('li:first').find('div').show();
        x.find("li").click(function(){
            x.find('li.active').find('div').hide();
            x.find('li.active').removeClass('active');
            $(this).addClass('active');
            $(this).find('div').show();
        });
        //傻逼代码结束 QAQ
        $scope.$on("getData", function() {
            $scope.user = AuthData.User;
            $scope.category = AuthData.Category;
        });
        $scope.$watch("markcontent", function() {
            if($scope.markcontent === "") {
                $scope.content = '####这里将显示输入内容......';
            }
            else {
                $scope.content = $scope.markcontent;
            }
        });
        $scope.postArticle = function() {
            //调用发表文章API
            alert("发表成功");
            //跳转至对应文章页面
        };
        $scope.insertImg = function() {
            $modal.open({
                templateUrl: '/views/uploadimg.html',
                controller: 'uploadimg'
            });
        };
    }]);

    app.controller("uploadimg", ['$scope', '$http', '$rootScope', '$modalInstance', function($scope,$http,$rootScope,$modalInstance) {
        $scope.imgUrl = "images/pic/2333.jpg";
        $scope.finished = 0;
        $scope.showHelps = 0;
        $scope.pic = "";
        $scope.uploadImg = function () {
            alert("正在上传");
            $scope.finished = 1;
        };
        $scope.close = function() {
            $modalInstance.close();
        };
    }]);

    app.controller("usercourse", ['$scope', '$http', '$rootScope', 'AuthData', function($scope,$http,$rootScope,AuthData) {
        $rootScope.onViewPage = "course";
        $scope.photoSrc = './images/pic/bg.jpg';
        $scope.uplaodPhoto = function(){
            alert('上传图片成功!');
        };
    }]);

    app.controller("usersetting", ['$scope', '$http', '$rootScope', 'AuthData', function($scope,$http,$rootScope,AuthData) {
        $rootScope.onViewPage = "setting";
        $scope.user = AuthData.User;
        $scope.category = AuthData.Category;
        $scope.s_infoSetting = 0;
        $scope.s_cateSetting = 1;
        $scope.newCateName = "";
        $scope.key = {
            password: '',
            newPassword: '',
            confirmPassword: '',
            motto: '结成明日奈'
        };
        // $rootScope.fetchData();
        $scope.$on("getData", function() {
            $scope.user = AuthData.User;
            $scope.category = AuthData.Category;
        });
        $scope.confirmModify = function(){
            $scope.sending = 0;
            alert('修改成功！');
        };
        $scope.addCategory = function() {
            //添加一个新的分类，返回新的分类信息，刷新视图
            AuthData.addCategory($scope.newCateName).success(function (msg) {
                if(msg['code'] == "0000") {

                }
                else {
                    alert(msg['errorMsg']);
                }
            }).error(function () {
                alert("Network Error!");
            });
            alert("添加成功！");
        };
    }]);
})()