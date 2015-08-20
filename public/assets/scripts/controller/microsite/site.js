define([], function() {

    // get config
    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl || 'http://api.hizuoye.com/api/v1/';
    var token = avalon.illyGlobal.token;

    // site ctrl take charge of everything...
    var site = avalon.define({ 
        $id: "site",
        categoriesNames: [], // cached auto nature
        categoryId: '',  // for list.html ui-state-active use
        fetchAllCategoriesNames: function() {
            $http.ajax({
                url: apiBaseUrl + 'categories',
                headers: {
                    'Authorization': 'Bearer ' + token
                },
                success: function(res) {
                    res.unshift({_id: 'hots', 'name': '热门文章'});
                    site.categoriesNames = res; // cached auto nature
                },
                error: function(res) {
                    console.log('site fetchAllCategoriesNames error!' + res);
                },
                ajaxFail: function(res) {
                    console.log('site fetchAllCategoriesNames failed!' + res);
                }
            });
        }
    });

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
            
            // text-loading && splash done...
            setTimeout(function() {
                document.querySelector('#splash').style.display = 'none';
            }, avalon.splashShowTime);
            // drop in 20150815
            //document.querySelector('#loading-before-site').style.display = 'none';

        };

        // 仅执行一次，抓取所有栏目名，供以后使用
        site.fetchAllCategoriesNames();

        // 进入视图
        $ctrl.$onEnter = function() {

            setTimeout(function() {
                $('#nav').navigator();
                $('.left-fixed').addClass('fixed-navigator');
            }, 500); // enough time
            // clear old local cache
            avalon.clearLocalCache('illy-microsite-');

        };
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            // 貌似到不了这里，因为执行不到这里，或者关掉页面了（那就更执行不到了）
        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
    
});

