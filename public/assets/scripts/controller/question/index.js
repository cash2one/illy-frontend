define([], function() {
 
    // get config
    var apiBaseUrl = avalon.illyGlobal.apiBaseUrl;
    var token = avalon.illyGlobal.token;

    var index = avalon.define({
        $id: "index",
        visited: false, // first in, no cache
        fetchRemoteData: function(apiArgs, data, target) {
            if (index.visited && needCache) { 
                avalon.vmodels.root.currentRendered = true;
                return; 
            }

            $http.ajax({
                url: apiBaseUrl + apiArgs + '',
                headers: {
                    Authorization: 'Bearer ' + token
                },
                data: data,
                success: function(res) {
                    index[target] = res;
                    avalon.vmodels.root.currentRendered = true;
                },
                error: function(res) {
                    avalon.illyError('ajax error', res);
                },
                ajaxFail: function(res) {
                    avalon.illyError('ajax failed', res);
                }
            });

        } // end of fetchRemoteData
    });

    return avalon.controller(function($ctrl) {
        // 进入视图
        $ctrl.$onEnter = function() {

            index.visited = avalon.vmodels.root.currentIsVisited;
            // index.fetchRemoteData();
            
       };
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {

        };
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {

        };
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });

});

