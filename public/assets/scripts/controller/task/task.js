define([], function() {

    // global config, apiBaseUrl
    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl;

    // token
    var token = avalon.illyGlobal.token;
    
    var resourcePrefix = 'http://resource.hizuoye.com/';

    // defaultAvatarUrl
    var defaultAvatarUrl = 'http://resource.hizuoye.com/images/avatar/children/default1.png?imageView2/1/w/200/h/200';

    // task ctrl take charge of everything...
    var task = avalon.define({ /* jshint ignore:line */
        $id: "task",
        score: 88,
        schoolName: '',
        studentCount: 100,
        displayName: '',
        avatar: defaultAvatarUrl,
        getUserInfo: function() {
            $http.ajax({
                url: apiBaseUrl + "profile",
                headers: {
                    Authorization: 'Bearer ' + token
                },
                dataType: "json",
                success: function(json) {
                    if (json.avatar !== void 0) {
                        task.avatar = resourcePrefix + json.avatar + '?imageView2/2/w/200/h/200';
                    } else {
                        task.avatar = defaultAvatarUrl;
                    }
                    task.displayName = json.displayName;
                    task.score = json.score;
                }
            });
        },
        getSchoolInfo: function() {
            $http.ajax({
                url: apiBaseUrl + "school",
                headers: {
                    Authorization: 'Bearer ' + token
                },
                dataType: "json",
                success: function(json) {
                    task.schoolName = json.school;
                    avalon.vmodels.root.footerInfo = json.school + ' © ' + new Date().getFullYear();
                    task.studentCount = json.studentCount || 100;
                }
            });
        }
    });

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
            //avalon.log("task.js onRendered fn");
            //document.querySelector('#splash').style.display = 'none';
            //document.querySelector('#loading-before-site').style.display = 'none';
        };
        // 进入视图
        $ctrl.$onEnter = function() {
            avalon.clearLocalCache('illy-task');
            task.getUserInfo();
            task.getSchoolInfo();
        };
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {

        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
    
});

