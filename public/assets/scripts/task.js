define(["http://res.wx.qq.com/open/js/jweixin-1.0.0.js", AvalonLibsBaseUrl + "mmState", "./lib/http/http"], function(wx) { // 此处wx对象必须手动导入内部，不同于其他模式工厂return的对象，内部直接可用。且导入时位置还必须在第一个。fuck...
// AvalonLibsBaseUrl defined in project main file(.html)

    /********* generated by grunt-includereplace **********/

    // ==================== global config area start, @included  ==================== //

    // project domain
    //var illy_domain = 'http://weixin.hizuoye.com';
    var illy_domain = 'http://app.hizuoye.com';

    // project images base src
    var illy_images_base_src = illy_domain + '/assets/images';

    // global apiBaseUrl
    var api_base_url = 'http://101.201.176.191/api/v1/';

    // get the token and ready to cache
    var token = localStorage.getItem('illy-token');

    // global view loaded animation, from animation.css, the custom version 
    var global_viewload_animation_name = "a-bounceinR";

    // global config, always show loader when view enter 
    var global_always_show_loader = true;

    // global config, always reset scrollbar when view enter
    var global_always_reset_scrollbar = true;

    // global config, loading timeout
    var global_loading_timeout = 8000; // ms, abort the loading when timeout, then auto goback

    // global config, view loaded with a litle delay for rendering page, time enough
    var global_loading_delay = 300; // ms

    // global config, loader className
    var global_loader_className = '.loader';

    // global config, loader'dom, must ensure the dom is exists
    var global_loader_dom = document.querySelector('.loader');

    // global config, error log style
    var global_errorLog_style = "background-color: red; color: #fff; padding: 3px; border-radius: 3px";

    // global config, info log style
    var global_infoLog_style = "background-color: #fff; color: #14E5D5; padding: 3px; border-radius: 3px";

    // ==================== global config area end, @included  ==================== //

    
    // ==================== static method start, @included  ==================== //

    avalon.getVM = function(vm) {
        return avalon.vmodels[vm];
    };

    avalon.getPureModel = function(vm) {
        return avalon.vmodels && avalon.vmodels[vm] && avalon.vmodels[vm].$model; // for strong
    };

    avalon.$ = function(selector) {
        return document.querySelector(selector);
    };

    var index = 0;
    /**
     * illyLog
     *
     * @param type {String}
     * @param msg {String}
     * @param res {String | Object}
     * @param saveToLocalStorage {Boolean}
     *
     */
    var illyLog = function illyLog(type, msg, res, style, saveToLocalStorage) {
        var root = avalon.vmodels.root;
        var namespace = root.namespace;
        var currentVM = root.currentState;
        res = res || '';
        if (typeof res !== 'string') {
            res = JSON.stringify(res);
        }
        console.log('%c' + type.toUpperCase() + ': ' + namespace + ' ' + currentVM + ' ' + msg +  '! '+ res, style); 
        if (saveToLocalStorage) {
            localStorage.setItem(namespace + ' ' + currentVM + ' log ' + index, msg + ' ' + res);
            index++;
        }
    };

    avalon.illyError = function(msg, res) {
        illyLog('error', msg, res, global_errorLog_style, false);
    };

    avalon.illyInfo = function(msg, res) {
        illyLog('info', msg, res, global_infoLog_style, true);
    };

    /*
     * clearLocalCache
     * @param prefix {string}
     * clear the cache item includes the given prefix
    */
    var clearLocalCache = function clearLocalCache(prefix) {
        for (var key in localStorage) {
            if (key.indexOf(prefix) >= 0) {
                localStorage.rem
            }
        }
    };

    /**
     * setLocalCache
     * @param itemName {String}
     * @param source   {String} (json-like)
    */
    var setLocalCache = function setLocalCache(itemName, source) {
        source = JSON.stringify(source);
        localStorage.setItem && localStorage.setItem( itemName, source ); /* jshint ignore:line */
    };

    /**
     * getLocalCache
     * @param itemName {String}
     * return result   {Object} (json-from-api)
    */
    var getLocalCache = function getLocalCache(itemName) {
        return localStorage.getItem && JSON.parse( '' + localStorage.getItem(itemName) );
    };

    // 挂载
    avalon.clearLocalCache = clearLocalCache;
    avalon.setLocalCache = setLocalCache;
    avalon.getLocalCache = getLocalCache;

    // ==================== static method end, @included ==================== //

    
    // ==================== custom project data start @include ==================== //

    // avalon global stuff when app init
    avalon.illyGlobal = {

        viewani    : global_viewload_animation_name,
        token      : token,
        apiBaseUrl : api_base_url,
        illyDomain : illy_domain,
        imagesBaseSrc: illy_images_base_src,
        noTokenHandler: function() {
            alert("对不起，本系统仅供内部使用！");
        }

    };

    // 定义一个顶层的vmodel，用来放置全局共享数据, 挂载在html元素上
    var root = avalon.define({
        $id: "root", // in html or body
        namespace: 'task', // module namespace, for global cachePrefix use
        currentState: '', // list question wrong info result...
        currentAction: '', // onBegin onLoad onBeforeUnload onUnload onError...
        currentIsVisited: false, // boolean flag
        title: '', // for title element or actionBar use
        footerInfo: '', // first in get the info, rendered in page footer
        back: function() {
            history.go(-1);
        }
    });

    // ==================== custom project data end @include ==================== //

    
    // ==================== app actionController start @include ==================== //
    root.$watch('currentAction', function(currentAction) {
        if (currentAction !== void 0) {
            
            switch (currentAction) {

                // -------------------- onError start -------------------- //
                case 'onError':
                    avalon.log("Error!, Redirect to index!", arguments);
                    avalon.router.go("task.list");
                    break;
                // -------------------- onError end -------------------- //
            
                // -------------------- onBegin start -------------------- //
                case 'onBegin':
                    
                    break;
                // -------------------- onBegin end -------------------- //

                // -------------------- onLoad start -------------------- //
                case 'onLoad':

                    // var view = document.querySelector('[avalonctrl='+ root.currentState + ']');
                    // for strong
                    // view && view.classList.add(g_viewload_animation); /* jshint ignore:line */

                    break;
                // -------------------- onLoad end -------------------- //

                // -------------------- onBeforeUnload end -------------------- //
                case 'onBeforeUnload':
                    break;
                // -------------------- onBeforeUnload end -------------------- //

                // -------------------- onUnload start -------------------- //
                case 'onUnload':
                    break;
                // -------------------- onUnload end -------------------- //

            } // end of root.currentAction switch

        } // end of if
    }); // end of root.currentAction watcher
    // ==================== app actionController start @include ==================== //

    
    // ==================== app components area start @include ==================== // 

    // loading component start //

    var loadingBeginHandler = function loadingBeginHandler(loader, callback) {

        if (typeof loader === 'function') { // deal with only one arguments and is callback
            callback = loader;
            loader = void 0;
        }

        loader = global_loader_dom || document.querySelector(global_loader_className);

        var showLoader = function() {
            loader && (loader.style.display = ''); /* jshint ignore:line */
        };

        // loader show logic
        var always_show_loader = global_always_show_loader === true ? true : false;
        if (loader && always_show_loader) {
            showLoader();
        } else if (loader && !always_show_loader && !root.currentIsVisited) {
            showLoader();
        }

        if (callback && typeof callback === 'function') {
            callback();
        }

    };

    var loadingEndHandler = function loadingEndHandler(loader, callback) {

        if (typeof loader === 'function') { // deal with only one arguments and is callback
            callback = loader;
            loader = void 0;
        }

        loader = global_loader_dom || document.querySelector(global_loader_className);

        var hideLoader = function() {
            loader && (loader.style.display = 'none'); /* jshint ignore:line */
        };

        if (global_loading_delay === void 0) {
            global_loading_delay = 500;
            console.log('%cWARNING: no global_loading_delay set!', "background-color: red; color: #fff");
        }

        setTimeout(function() {
            hideLoader();
            if (callback && typeof callback === 'function') {
                callback();
            }
        }, global_loading_delay);

    };

    root.$watch('currentAction', function(currentAction) {
        if (currentAction === 'onBegin') {
            loadingBeginHandler();
        }
        if (currentAction === 'onLoad') {
            loadingEndHandler();
        }
    });

    // loading component end //

    // badNetworkHandler component start // 
    
    // deal with bad network condition for wait too long, auto-back when time enough with tip
    var bindBadNetworkHandler = function bindBadNetworkHandler(timeout) {

        timeout = global_loading_timeout || 8000;
        var loader = global_loader_dom || document.querySelector(global_loader_className);
        badNetworkTimer && clearTimeout(badNetworkTimer); /* jshint ignore:line */

        var badNetworkTimer = setTimeout(function() {
            alert('对不起，您的网络状态暂时不佳，请稍后重试！');
            // even can invoke the wx-sdk to close the page
            history.go(-1);
            // for strong, need ()
            loader && (loader.style.display = 'none'); /* jshint ignore:line */
        }, timeout);

        avalon.badNetworkTimer = badNetworkTimer;

        root.$watch('currentState', function(changeState) {
            if (changeState !== void 0) {
                clearTimeout(badNetworkTimer);
            }
        });

    };

    var unbindBadNetworkHandler = function unbindBadNetworkHandler(timer) {
        timer = timer || avalon.badNetworkTimer;
        timer && clearTimeout(timer); /* jshint ignore:line */
    };

    root.$watch('currentAction', function(currentAction) {
        if (currentAction === 'onBegin') {
            bindBadNetworkHandler();
        }
        if (currentAction === 'onLoad') {
            unbindBadNetworkHandler();
        }
    });

    // badNetworkHandler component end //

    // getCurrentState component start //
    
    var getCurrentState = function getCurrentState() {
        var state1 = mmState.currentState.stateName.split(".")[1]; // 第二个
        var state2 = mmState.currentState.stateName.split(".")[2]; // 第三个
        if (state2 === void 0) {
            return state1;
        } else {
            return state2;
        }
    };

    root.$watch('currentAction', function(currentAction) {
        if (currentAction === 'onLoad') {
            root.currentState = getCurrentState();
        }
    });

    // getCurrentState component end //

    // setTitle component start //
    
    var setPageTitle = function setPageTitle(titleMap) {
        titleMap = titleMap || ACTIONBAR_TITLE_MAP;
        var currentState = root.currentState;
        root.title = titleMap[currentState];
    };

    root.$watch('currentAction', function(currentAction) {
        if (currentAction === 'onLoad') {
            setPageTitle();
        }
    });

    // setTitle component end //

    // visitedChecker component start //
    
    var doIsVisitedCheck = function doIsVisitedCheck(cacheContainer, callback) {

        if (typeof cacheContainer === 'function') {
            callback = cacheContainer;
            cacheContainer = void 0;
        }

        var pageId = location.href.split("!")[1];
        cacheContainer = cacheContainer || CACHE_VISITED_PAGEID_CONTAINER;
        cacheContainer.push(pageId);
        var isVisited = false;
        for (var i = 0, len = CACHE_VISITED_PAGEID_CONTAINER.length - 1; i < len; i++) { // last one must be the current href, so not included(length - 1)
            if (CACHE_VISITED_PAGEID_CONTAINER[i] === pageId) {
                isVisited = true;
            }
        }
        if (callback && typeof callback === 'function') {
            callback();
        }

        return isVisited;

    };

    // 页面访问统计容器
    var CACHE_VISITED_PAGEID_CONTAINER = [];
    root.$watch('currentAction', function(currentAction) {
        if (currentAction === 'onBegin') {
            root.currentIsVisited = doIsVisitedCheck();
        }
    });

    // visitedChecker component end //

    // resetScrollbar component start //
    
    var resetScrollbarWhenViewLoaded = function resetScrollbarWhenViewLoaded() {
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
    };

    if (global_always_reset_scrollbar === true) {
        root.$watch('currentAction', function(currentAction) {
            if (currentAction === 'onLoad') {
                resetScrollbarWhenViewLoaded();
            }
        });
    }
    // resetScrollbar component end //

    // ==================== app components area end @include ==================== //


    // ==================== wxsdk-config start @include ==================== //

    // 挂载微信sdk到avalon以供全局调用
    avalon.wx = wx;

    var uri = location.href.split("#")[0];
    var url = encodeURIComponent(uri);

    $http.ajax({
        url: 'http://api.hizuoye.com/api/v1/public/sdk/signature',
        data: {
            url: url
        },
        success: function(jsonobj) {
            var appId = jsonobj.appid;
            var timestamp = jsonobj.timestamp;
            var nonceStr = jsonobj.nonceStr;
            var signature = jsonobj.signature;
            // config the wx-sdk
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: appId, // 必填，公众号的唯一标识
                timestamp: timestamp, // 必填，生成签名的时间戳
                nonceStr: nonceStr, // 必填，生成签名的随机串
                signature: signature, // 必填，签名，见附录1
                jsApiList: [
                    'checkJsApi',
                    'onMenuShareTimeline',
                    'onMenuShareAppMessage',
                    'onMenuShareQQ',
                    'onMenuShareWeibo',
                    'hideMenuItems',
                    'showMenuItems',
                    'hideAllNonBaseMenuItem',
                    'showAllNonBaseMenuItem',
                    'translateVoice',
                    'startRecord',
                    'stopRecord',
                    'onRecordEnd',
                    'playVoice',
                    'pauseVoice',
                    'stopVoice',
                    'uploadVoice',
                    'downloadVoice',
                    'chooseImage',
                    'previewImage',
                    'uploadImage',
                    'downloadImage',
                    'getNetworkType',
                    'openLocation',
                    'getLocation',
                    'hideOptionMenu',
                    'showOptionMenu',
                    'closeWindow',
                    'scanQRCode',
                    'chooseWXPay',
                    'openProductSpecificView',
                    'addCard',
                    'chooseCard',
                    'openCard'
                ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
        },
        error: function(res) {
            console.log("wx ajax error" + res);
        },
        ajaxFail: function(res) {
            console.log("wx ajaxFail" + res);
        }
    });

    //wx.ready(function() {
    //    // do all thing here, except user trigger functions(can put in outside)
    //    wx.checkJsApi({
    //        jsApiList: ['startRecord'], // apis to check
    //            success: function(res) {
    //                alert(parse(res));
    //                // key --- value, if usable, true, then false
    //                // e.g. {"checkResult": {"chooseImage": true}, "errMsg": "checkJsApi:ok"}
    //            }
    //    });
    //});

    wx.error(function(res) {
        alert("Woops, error comes..." + res);
    });

    // ====================  wxsdk-config end @include ==================== //
    

    // ==================== router start @include ==================== //

    // title Map， 映射各种状态的action-bar title
    var ACTIONBAR_TITLE_MAP = {
        'list': '任务列表',
        'rank': '排行榜',
        'mall': '积分商城',
        'article': '活动详情',
        'activity': '活动详情',
        'me': '个人中心'
    };

    // 定义一个全局抽象状态，用来渲染通用不会改变的视图，比如header，footer
    avalon.state("task", { // task.js这个控制器接管整个应用控制权
        url: "/",
        abstract: true, // 抽象状态，不会对应到url上, 会立即绘制index这个view
        views: {
            "": {
                templateUrl: "assets/templates/task/task.html", // 指定模板地址
                controllerUrl: "scripts/controller/task/task.js", // 指定控制器地址
            },
            "footer@": { // 视图名字的语法请仔细查阅文档
                templateUrl: "assets/templates/footer.html", // 指定模板地址
            }
        }
    })
    .state("task.taskList", { // 任务列表
        url: "",
        views: {
            "": {
                templateUrl: "assets/templates/task/taskList.html", // 指定模板地址
                controllerUrl: "scripts/controller/task/taskList.js" // 指定控制器地址
            }
        }
    })
    .state("task.detail", { // 
        abstract: true, // 抽象状态，用法心得：总控。对复杂的情况分而治之
        views: {
            "": {
                templateUrl: "assets/templates/task/detail.html", // 指定模板地址
                controllerUrl: "scripts/controller/task/detail.js" // 指定控制器地址
            }
        }
    })
    .state("task.detail.article", { // task, typeof article 
        url: "article/{taskId}/score/{scoreAward}", // 
        views: {
            "": {
                templateUrl: "assets/templates/task/article.html", // 指定模板地址
                controllerUrl: "scripts/controller/task/article.js" // 指定控制器地址
            }
        }
    })
    .state("task.detail.activity", { // task, typeof activity 
        url: "activity/{taskId}/score/{scoreAward}", // deal with a spec question, render it for different type
        views: {
            "": {
                templateUrl: "assets/templates/task/activity.html", // 指定模板地址
                controllerUrl: "scripts/controller/task/activity.js" // 指定控制器地址
            }
        }
    })
    .state("task.rank", { // 排行榜
        url: "rank",
        views: {
            "": {
                templateUrl: "assets/templates/task/rank.html", // 指定模板地址
                controllerUrl: "scripts/controller/task/rank.js" // 指定控制器地址
            }
        }
    })
    .state("task.mall", { // 积分商城
        url: "mall",
        views: {
            "": {
                templateUrl: "assets/templates/task/mall.html", // 指定模板地址
                controllerUrl: "scripts/controller/task/mall.js" // 指定控制器地r
            }
        }
    })
    .state("task.me", { // 积分商城
        url: "me",
        views: {
            "": {
                templateUrl: "assets/templates/task/me.html", // 指定模板地址
                controllerUrl: "scripts/controller/task/me.js" // 指定控制器地址
            }
        }
    });

    // ==================== router end @include ==================== //

    
    // ==================== state config start @include ==================== //

    /*
    *  @interface avalon.state.config 全局配置
    *  @param {Object} config 配置对象
    *  @param {Function} config.onBeforeUnload 开始切前的回调，this指向router对象，第一个参数是fromState，第二个参数是toState，return false可以用来阻止切换进行
    *  @param {Function} config.onAbort onBeforeUnload return false之后，触发的回调，this指向mmState对象，参数同onBeforeUnload
    *  @param {Function} config.onUnload url切换时候触发，this指向mmState对象，参数同onBeforeUnload
    *  @param {Function} config.onBegin  开始切换的回调，this指向mmState对象，参数同onBeforeUnload，如果配置了onBegin，则忽略begin
    *  @param {Function} config.onLoad 切换完成并成功，this指向mmState对象，参数同onBeforeUnload
    *  @param {Function} config.onViewEnter 视图插入动画函数，有一个默认效果
    *  @param {Node} config.onViewEnter.arguments[0] 新视图节点
    *  @param {Node} config.onViewEnter.arguments[1] 旧的节点
    *  @param {Function} config.onError 出错的回调，this指向对应的state，第一个参数是一个object，object.type表示出错的类型，比如view表示加载出错，object.name则对应出错的view name，object.xhr则是当使用默认模板加载器的时候的httpRequest对象，第二个参数是对应的state
    */

    // 每次view载入都会执行的回调，适合来做一些统一操作
    avalon.state.config({
        onError: function() {
            root.currentAction = 'onError';
        },
        onBeforeUnload: function() { // 太宽泛了，放到具体ctrl里处理
            root.currentAction = 'onBeforeUnload';
        },
        onUnload: function() { // url变化时触发
            root.currentAction = 'onUnload';
        },
        onBegin: function() {
            root.currentAction = 'onBegin';
        },
        onLoad: function() { // 切换完成并成功
            root.currentAction = 'onLoad';
        }
    }); 

    // ====================  state config end @include ==================== //

    
    // exports 
    return {
        init: function() { // init router and bootstrap the app
            avalon.log("init to bootstrap the app!");
            avalon.history.start({
                // basepath: "/mmRouter",
                fireAnchor: false
                //,routeElementJudger: function(ele, href) {
                //    avalon.log(arguments);
                //    //return href;
                //}
            });
            //go!!!!!!!!!
            avalon.scan();

            // APP inner performance listener start, avalon take charge of everything and start to init the app
            avalon.appInitTime = Date.now();
        }
    }; // end of exports


});

