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

    app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
        // $locationProvider.html5Mode(true);
        $routeProvider.
        when("/", {
            templateUrl: '/views/userconfig.html',
            controller: 'userconfig'
        }).
        when("/views/home", {
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
                url: "api/index.php?" + path,
                method: way,
                data: params
            });
        };
        return {
            //params传入为数组对象形式
            
            // defaultSetting: function() {return doRequest('/json/default.json','get','');} ,
            login: function(params) {return doRequest('api/user/login','post',params);} ,
            logout: function() {return doRequest('api/user/logout','get','');} ,
            userData: function(params) {return doRequest('api/user/info','post',params);} ,
            userBlogList: function() {return doRequest('api/article/all','get','');} ,
            userBlogDetail: function(params) {return doRequest('api/article/detail','post',params);} ,
            userCategory: function() {return doRequest('api/category/all','get','');} ,
            similarBlog: function(params) {return doRequest('api/article/similar','post',params);} ,
            similarBlogList: function(params) {return doRequest('api/article/similarlist','post',params);} ,
            // addCategory: function(params) {return doRequest('/json/newcategory.json','get','');} ,
            // userModifyPassword: function(params) {return doRequest('/api/user/usermodifypassword','post',params);} ,
            // 
            defaultSetting: function() {return doRequest('api/site/config','get','');} ,
            // login: function(params) {return doRequest('/json/login.json','get',params);} ,
            // logout: function() {return doRequest('/json/logout.json','get','');} ,
            // userData: function(params) {return doRequest('/json/user.json','get',params);} ,
            // userBlogList: function() {return doRequest('/json/blogs.json','get','');} ,
            // userBlogDetail: function(params) {return doRequest('json/blogdetail.json','get','');} ,
            // userCategory: function(params) {return doRequest('/json/category.json','get','');} ,
            // similarBlog: function(params) {return doRequest('/json/similar.json','get','');} ,
            addCategory: function(params) {return doRequest('/json/newcategory.json','get','');} ,
            userModifyPassword: function(params) {return doRequest('/api/user/usermodifypassword','post',params);} ,
            User,
            Category,
            DEBUG
        };
    }]);

    app.directive('userinfo', function() {
        return {
            restrict: 'E',
            templateUrl: '/views/userinfo.html',
            replace: true
        };
    });

    app.run(['$rootScope', '$window', 'AuthData', function($rootScope,$window,AuthData) {
        $rootScope.DEBUG = '1';
        $rootScope.Login = 0 ;
        $rootScope.onViewPage = "home";
        var getAuthData = function(admin) {
            var user = {
                "user" : admin
            };
            AuthData.userData(user).success(function (msg) {
                if(msg['code'] = "0000") {
                    AuthData.User = msg.data;
                    //每次刷新时获取到登录信息
                    $rootScope.Login = AuthData.User.login;
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
                    AuthData.Category = msg.data;
                    console.log(AuthData.Category);
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

    app.controller("site", ['$scope', '$rootScope','$window', '$modal', 'AuthData', function($scope, $rootScope, $window, $modal, AuthData) {
        $scope.login = $rootScope.Login;
        $scope.$on('updateUserData', function () {
            console.log($rootScope.Login);
            $rootScope.Login = !$rootScope.Login;
            //用户退出 默认回到首页
            if(!$rootScope.Login) {
                $window.location.replace('#/views/home');
            }
            //alert($scope.User.login + " " + $scope.User.name);
        });
        $scope.$watch("onViewPage", function() {
            $scope.page = $rootScope.onViewPage;
        });
        $scope.$watch("Login", function() {
            $scope.login = $rootScope.Login;
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

    app.controller("userSignIn", ['$scope', '$rootScope', '$window', '$modalInstance', 'AuthData', function($scope,$rootScope,$window,$modalInstance,AuthData) {
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
                    $window.location.replace('#/');
                }
            }).error(function () {
                alert("Network Error!");
            });
        };
        $scope.close = function() {
            $modalInstance.close();
        };
    }]);

    app.controller("userconfig", ['$scope', '$rootScope', 'AuthData', function($scope,$rootScope,AuthData) {
        $rootScope.onViewPage = "home";
        
    }]);
    
    app.controller("userblog", ['$scope', '$rootScope', 'AuthData', function($scope,$rootScope,AuthData) {
        $scope.login = $rootScope.Login;
        $rootScope.onViewPage = "blog";
        $scope.user = AuthData.User;
        $scope.$watch("Login", function() {
            $scope.login = $rootScope.Login;
        });
        $scope.$on("getData", function() {
            $scope.user = AuthData.User;
        });
        //得到所有文章列表
        var getBlogList = function() {
            AuthData.userBlogList().success(function (msg) {
                if(msg['code'] === '0000') {
                    $scope.blogs = msg['data'];
                    for(var i = 0;i < $scope.blogs.length;i ++) {
                        var tmpStr = $scope.blogs[i]['content'];
                        if(tmpStr.length > 150) {
                            $scope.blogs[i]['content'] = tmpStr.substring(0, 150);
                        }
                    }
                }
                else {
                    alert(msg['errorMsg']);
                }
            }).error(function () {
                alert("Network Error!");
            });
        };
        getBlogList();
        //删除文章的功能
        $scope.delectBlog = function (blogID) {
            alert(blogID + " will be delect!");
            //调用删除文章的API
            //重新请求文章列表
            getBlogList();
        };
    }]);

    app.controller("categoryview", ['$scope', '$rootScope', '$routeParams', 'AuthData', function($scope,$rootScope,$routeParams,AuthData) {
        $rootScope.onViewPage = "blog";
        $scope.categoryID = $routeParams.id;
        var qy = {
            cateID : $routeParams.id
        };
        $scope.user = AuthData.User;
        $scope.$watch("Login", function() {
            $scope.login = $rootScope.Login;
        });
        $scope.$on("getData", function() {
            $scope.user = AuthData.User;
        });
        //根据分类的ID查询对应分类的所有文章
        AuthData.similarBlog(qy).success(function (msg) {
            if(msg['code'] == "0000") {
                $scope.blogs = msg['data'];
                for(var i = 0;i < $scope.blogs.length;i ++) {
                    var tmpStr = $scope.blogs[i]['content'];
                    if(tmpStr.length > 150) {
                        $scope.blogs[i]['content'] = tmpStr.substring(0, 150);
                    }
                }
            }
            else alert(msg['errorMsg']);
        }).error(function () {
            alert("Network error!");
        });
    }]);

    app.controller("blogview", ['$scope', '$rootScope', '$window', '$routeParams' ,'AuthData', function($scope,$rootScope,$window,$routeParams,AuthData) {
        $rootScope.onViewPage = "blog";
        $scope.user = AuthData.User;
        $scope.blogID = {
            aid : $routeParams.id
        };
        $scope.cate = {
            cateID : ''
        };
        $scope.content = '';
        $scope.login = $rootScope.Login;
        $scope.$watch("Login", function() {
            $scope.login = $rootScope.Login;
        });
        $scope.$on("getData", function() {
            $scope.user = AuthData.User;
        });
        //根据id查询对应文章
        AuthData.userBlogDetail($scope.blogID).success(function (msg) {
            if(msg['code'] === '0000') {
                $scope.blogDetail = msg['data'];
                $scope.content = $scope.blogDetail.content;
                $scope.cate.cateID = $scope.blogDetail.cateid;
                //查询同类文章的所有信息
                AuthData.similarBlogList($scope.cate).success(function (msg) {
                    if(msg['code'] = "0000") {
                        $scope.BlogSimilar = msg['data'];
                    }
                    else {
                        alert(msg['errorMsg']);
                    }
                }).error(function () {
                    alert("Network Error!");
                });
            }
            else {
                alert(msg['msg']);
            }
        }).error(function() {
            alert("Network Error!");
        });
        
        //删除$scope.blogID 对应文章
        $scope.delectBlog = function () {
            alert($scope.blogID + " will be delect!");
            //调用删除文章的API
            
            //删除完成后回退到 blog 页面
            $window.location.replace('#/views/blog');
        };

    }]);

    app.controller("useredit", ['$scope', '$rootScope', '$modal', 'AuthData', function($scope,$rootScope,$modal,AuthData) {
        $rootScope.onViewPage = "edit";
        $scope.user = AuthData.User;
        $scope.category = AuthData.Category;
        $scope.content = '';
        $scope.markcontent = '';
        $scope.showPreview = 0;
        $scope.newBlog = {
            "title" : "",
            "cateid" : "0",
            "public" : 0 , 
            "detail" : ""
        };
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
        $scope.login = $rootScope.Login;
        $scope.$watch("Login", function() {
            $scope.login = $rootScope.Login;
        });
        $scope.$on("getData", function() {
            $scope.user = AuthData.User;
            $scope.category = AuthData.Category;
        });
        $scope.switchView = function() {
            if(!$scope.showPreview) {
                $('#editor').hide();
                $scope.showPreview = 1;
                $scope.content = $scope.markcontent;
            }
            else {
                $('#editor').show();
                $scope.content = $scope.markcontent;
                $scope.showPreview = 0;
            }
        };
        $scope.postArticle = function() {
            $scope.newBlog.detail = $scope.content;
            console.log($scope.newBlog);
            //一些错误检查 
            //调用发表文章API
            alert("发表成功");
            //返回新发表文章的ID  跳转至对应文章页面
        };
        $scope.insertImg = function() {
            $modal.open({
                templateUrl: '/views/uploadimg.html',
                controller: 'uploadimg'
            });
        };
    }]);

    app.controller("uploadimg", ['$scope', '$rootScope', '$modalInstance', function($scope,$rootScope,$modalInstance) {
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

    app.controller("usercourse", ['$scope', '$rootScope', 'AuthData', function($scope,$rootScope,AuthData) {
        $rootScope.onViewPage = "course";
        $scope.photoSrc = './images/pic/bg.jpg';
        $scope.login = $rootScope.Login;
        $scope.$watch("Login", function() {
            $scope.login = $rootScope.Login;
        });
        $scope.uplaodPhoto = function(){
            alert('上传图片成功!');
        };
    }]);

    app.controller("usersetting", ['$scope', '$rootScope', 'AuthData', function($scope,$rootScope,AuthData) {
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
            motto: ''
        };
        $scope.login = $rootScope.Login;
        $scope.$watch("Login", function() {
            $scope.login = $rootScope.Login;
        });
        $scope.$on("getData", function() {
            $scope.user = AuthData.User;
            $scope.category = AuthData.Category;
        });

        //文章分类管理的 增 删 改 操作
        $scope.updateCategoryName = function(selectCateID, selectCateName, status) {
            status = 0;
            alert(selectCateID + " will be update to " + selectCateName);
            //调用修改类别名 API
        };
        $scope.delectCategory = function(selectCateID) {
            alert( selectCateID + " will be delect!");
            //调用删除指定类别 API
            //刷新视图
        };
        $scope.addCategory = function() {
            //输入检查
            //添加一个新的分类
            //得到更新后的视图
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

        //修改密码及个人信息操作
        $scope.modifyInfo = function() {
            //输入检查
            //调用修改信息 API
            //同步刷新视图(主要指刷新 头像 和 motto)
            alert("修改成功！");
        };
    }]);
})()