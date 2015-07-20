define([], function() {

    // site ctrl take charge of everything...
    var site = avalon.define({
        $id: "site"
    });

    return avalon.controller(function($ctrl) {
        // 视图渲染后，意思是avalon.scan完成
        $ctrl.$onRendered = function() {
            avalon.log("site.js onRendered fn");
        }
        // 进入视图
        $ctrl.$onEnter = function() {
            avalon.log("site.js says i am in onEnter fn, do some common init stuff...");
        }
        // 对应的视图销毁前
        $ctrl.$onBeforeUnload = function() {
            avalon.log("site.js says i am in onBeforeUnload fn"); // 貌似到不了这里，因为是抽象视图
        }
        // 指定一个avalon.scan视图的vmodels，vmodels = $ctrl.$vmodels.concat(DOM树上下文vmodels)
        $ctrl.$vmodels = [];
    });
    
});
