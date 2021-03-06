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
            login: function(params)           {return doRequest('api/user/login','post',params);} ,
            logout: function()                {return doRequest('api/user/logout','get','');} ,
            userData: function(params)        {return doRequest('api/user/info','post',params);} ,
            ModifyPassword: function(params)  {return doRequest('api/user/modifyinfo','post',params);} ,
            defaultSetting: function()        {return doRequest('api/site/config','get','');} ,

            userCategory: function()         {return doRequest('api/category/all','get','');} ,
            addCategory: function(params)    {return doRequest('api/category/new','post',params);} ,
            deleteCategory: function(params) {return doRequest('api/category/delete','post',params);} ,
            modifyCategory: function(params) {return doRequest('api/category/modify','post',params);} ,

            userBlogList: function()         {return doRequest('api/article/all','get','');} ,
            userBlogDetail: function(params) {return doRequest('api/article/detail','post',params);} ,
            similarBlog: function(params)    {return doRequest('api/article/similar','post',params);} ,
            similarBlogList: function(params){return doRequest('api/article/similarlist','post',params);} ,
            addArticle: function(params)     {return doRequest('api/article/new','post',params);} ,
            deleteArticle: function(params)  {return doRequest('api/article/delete','post',params);} ,
            modifyArticle: function(params)  {return doRequest('api/article/modify','post',params);} ,
            
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

    app.run(['$rootScope', '$window', '$http', 'AuthData', function($rootScope,$window,$http,AuthData) {
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
                    // console.log(AuthData.Category);
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

        /*var myUrl = "http://contests.acmicpc.info/contests.json?callback=JSON_CALLBACK";
        var url = "http://public-api.wordpress.com/rest/v1/sites/wtmpeachtest.wordpress.com/posts?callback=JSON_CALLBACK";

        $http.jsonp(url).success(function (data){
            console.log(data);
        });

        $http.jsonp(myUrl).success(function (data){
        　　alert(data);
        }).error(function () {
            alert("Request Error!");
        });*/
        
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

        //删除$scope.blogID 对应文章
        $scope.showWarning = false;
        $scope.showWarningWithID = function(blogAid) {
            $scope.showWarning = true;
            $scope.blogAid = blogAid;
        }
        $scope.deleteBlog = function () {
            var param = {
                aid: $scope.blogAid
            };
            AuthData.deleteArticle(param).success(function (msg) {
                if(msg['code'] === '0000') {
                    //删除文章后重新载入页面
                    $scope.showWarning = false;
                    getBlogList();
                    $rootScope.fetchData();
                }
                else alert(msg['errorMsg']);
            }).error(function () {
                alert("Network Error!");
            });
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
        $scope.showWarning = false;
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
        $scope.deleteBlog = function () {
            AuthData.deleteArticle($scope.blogID).success(function (msg) {
                if(msg['code'] === '0000') {
                    //删除完成后回退到 blog 页面
                    $window.location.replace('#/views/blog');
                }
                else alert(msg['errorMsg']);
            }).error(function () {
                alert("Network Error!");
            });
            
        };

    }]);

    app.controller("useredit", ['$scope', '$rootScope', '$modal', '$window', '$routeParams' , 'AuthData', function($scope,$rootScope,$modal,$window,$routeParams,AuthData) {
        $rootScope.onViewPage = "edit";
        $scope.user = AuthData.User;
        $scope.category = AuthData.Category;
        $scope.content = '';
        $scope.markcontent = '';
        $scope.showPreview = 0;
        $scope.newBlog = {
            "title" : "",
            "cateid" : "null",
            "public" : "null" , 
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
            // console.log($scope.category);
        });
        $scope.fetchArticle = function() {
            if($routeParams.id !== "new"){
                var param = {
                    aid : $routeParams.id
                };
                AuthData.userBlogDetail(param).success(function (msg) {
                    if(msg['code'] === "0000") {
                        $scope.newBlog.title = msg['data']['title'];
                        $scope.newBlog.cateid = msg['data']['cateid'];
                        $scope.newBlog.public = msg['data']['public'];
                        $scope.newBlog.detail = msg['data']['content'];
                        $scope.newBlog.aid = msg['data']['aid'];
                        $scope.markcontent = $scope.newBlog.detail;
                    }
                    else alert(msg['errorMsg']);
                }).error(function () {
                    alert("Network Error!");
                });
            } 
        };
        $scope.fetchArticle(); //判断预填入文章
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
            $scope.content = $scope.markcontent;
            $scope.newBlog.detail = $scope.content;
            console.log($scope.newBlog);
            if($scope.newBlog.title.length == 0) {
                alert("请输入文章标题！");
                return ;
            }
            if($scope.newBlog.cateid === "null") {
                alert("请选择文章类别！");
                return ;
            }
            if($scope.newBlog.public === "null") {
                alert("请设置文章权限！");
                return ;
            }
            if($scope.newBlog.detail.length < 50) {
                alert("内容太单调了，多写点吧！");
                return ;
            }
            if($routeParams.id === "new") {
                AuthData.addArticle($scope.newBlog).success(function (msg) {
                    if(msg['code'] === "0000") {
                        alert("发表成功");
                        $window.location.replace('#/views/blogview/' + msg['data']['aid']);
                        // alert("发表成功");
                    }
                    else alert(msg['errorMsg']);
                }).error(function() {
                    alert("Network Error!");
                });
            }
            else {
                AuthData.modifyArticle($scope.newBlog).success(function (msg) {
                    if(msg['code'] === "0000") {
                        alert("修改成功！");
                        $window.location.replace('#/views/blogview/' + msg['data']['aid']);
                        //返回新发表文章的ID  跳转至对应文章页面
                    }
                    else alert(msg['errorMsg']);
                }).error(function() {
                    alert("Network Error!");
                });
            }
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
        $scope.myFile = "";
        $scope.uploadImg = function () {
            alert("正在上传");
            console.log($scope.myFile);
            $scope.finished = 1;
        };
        $scope.close = function() {
            $modalInstance.close();
        };
    }]);

    app.controller("usercourse", ['$scope', '$rootScope', '$modal', 'AuthData', function($scope,$rootScope,$modal,AuthData) {
        $rootScope.onViewPage = "course";
        $scope.photoSrc = './images/temp/course.png';
        $scope.login = $rootScope.Login;
        $scope.$watch("Login", function() {
            $scope.login = $rootScope.Login;
        });
        $scope.uploadPhoto = function() {
            $modal.open({
                templateUrl: '/views/uploadimg.html',
                controller: 'uploadimg'
            });
        };
    }]);

    app.controller("usersetting", ['$scope', '$rootScope', 'AuthData', function($scope,$rootScope,AuthData) {
        $rootScope.onViewPage = "setting";
        $scope.user = AuthData.User;
        $scope.category = AuthData.Category;
        $scope.s_infoSetting = 0;
        $scope.s_cateSetting = 1;
        $scope.newCateName = '';
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
        //文章分类管理的 查 增 删 改 操作
        $scope.getCategory = function() {
            AuthData.userCategory().success(function (msg) {
                if(msg['code'] = "0000") {
                    AuthData.Category = msg.data;
                    $rootScope.$broadcast('getData');
                }
                else {
                    alert(msg['errorMsg']);
                }
            }).error(function() {
                alert("Network Error!");
            });
        };
        
        $scope.updateCategoryName = function(selectCateID, selectCateName, status) {
            status = 0;
            var param = {
                cid : selectCateID ,
                cname : selectCateName
            };
            AuthData.modifyCategory(param).success( function (msg) {
                if(msg['code'] = "0000") {
                    $scope.getCategory();
                }
                else {
                    alert(msg['errorMsg']);
                }
            }).error(function () {
               alert("Network Error!"); 
            });
        };

        $scope.delectCategory = function(selectCateID, selectCateCount) {
            if(selectCateCount !== '0') {
                alert("该类别下有文章，无法删除！");
                return ;
            }
            var param = {
                cid : selectCateID
            };
            AuthData.deleteCategory(param).success(function (msg) {
                if(msg['code'] == "0000") {
                    $scope.getCategory();
                }
                else {
                    alert(msg['errorMsg']);
                }
            }).error(function () {
                alert("Network Error!");
            });
        };

        $scope.addCategory = function() {
            if($scope.newCateName === "") {
                alert("请输入类别名！");
                return ;
            }
            var param = {
                cname: $scope.newCateName
            };
            // console.log(param);
            AuthData.addCategory(param).success(function (msg) {
                if(msg['code'] == "0000") {
                    $scope.getCategory();
                }
                else {
                    alert(msg['errorMsg']);
                }
            }).error(function () {
                alert("Network Error!");
            });
            $scope.newCateName = "";
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