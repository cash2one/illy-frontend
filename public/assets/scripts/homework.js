define(["http://res.wx.qq.com/open/js/jweixin-1.0.0.js", "./lib/mmRouter/mmState", "./http"], function(wx) { // 此处wx对象必须手动导入内部，不同于其他模式工厂return的对象，内部直接可用。且导入时位置还必须在第一个。fuck...
    
    //====================== global config area start **********************//

    // screen splash show time config
    //avalon.splashShowTime = 666; // ms, used in app.js
    
    // 缓存访问过得页面，为了更好的loading体验，性能嘛? 先mark一下!!!
    var cachePage = [];
        
    // global apiBaseUrl
    var apiBaseUrl = 'http://api.hizuoye.com/api/v1/';

    // get the token and ready to cache
    var token = localStorage.getItem('illy-token');

    // global view change animation, from animation.css, the custom one
    var global_viewload_animation_name = "a-bounceinR"; 

    // global config, always show loader when enter the view 
    var global_always_show_loader = true;

    // global always reset scrollbar when view enter
    var global_always_reset_scrollbar = true;

    // global loading timeout
    var global_loading_timeout = 8000; // ms, abort the loading when timeout, then auto goback

    // loading delay
    var global_loading_duration = 300; // ms

    // loader className
    var global_loader_className = '.loader';

    // var global_loader_dom = document.querySelector('.loader');

    // title Map， 映射各种状态的action bar title
    var acTitle = {
        'list': "作业列表",
        'info': '作业详情',
        'question': '题目详情',
        'result': '作业结果',
        'mistake': '错题列表',
        'wrong': '错题详情',
        'evaluation': '课堂表现'
    };

    // avalon global stuff when app init
    avalon.illyGlobal = {

        viewani           : global_viewload_animation_name,
        token             : token,
        apiBaseUrl        : apiBaseUrl,
        question_view_ani : 'a-bounceinL',
        noTokenHandler    : function() {
            alert("对不起，本系统仅供内部使用！");
        }

    };

    /***** static method start *****/
    // avalon global static method, get vm-object with vm-name
    avalon.getVM = function(vm) {
        return avalon.vmodels[vm];
    };

    // avalon global static method, get pure $model for server
    avalon.getPureModel = function(vm) {
        return avalon.vmodels && avalon.vmodels[vm] && avalon.vmodels[vm].$model; // for strong
    };

    // avalon global static method, get element
    avalon.$ = function(selector) {
        return document.querySelector(selector);
    };
    /***** static method area end *****/

    // deal with bad network condition for wait too long, auto-back when time enough with tip
    var bindBadNetworkHandler = function bindBadNetworkHandler(delay) {
        delay = global_loading_timeout || 8000;
        var loader = document.querySelector('.loader');
        var badNetworkTimer = setTimeout(function() {
            alert('对不起，您的网络状态暂时不佳，请稍后重试！');
            // even can invoke the wx-sdk to close the page
            history.go(-1);
            // for strong, need ()
            loader && (loader.style.display = 'none'); /* jshint ignore:line */
        }, delay);
        avalon.badNetworkTimer = badNetworkTimer;
    };

    /* wxsdk start */

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

    /* wxsdk end */

    //========================= global config area end =========================//

    //========================= bootstrap the app =========================// 

    /* router start */

    // 定义一个顶层的vmodel，用来放置全局共享数据, 挂载在body元素上
    var root = avalon.define({
        $id: "root",
        currentPage: '',
        currentIsVisited: false,
        title: "标题", // 每一页action bar的标题    
        back: function() { // has default back and can custom it
            var state = root.currentPage;
            if (state === 'info' || state === 'result') { // not include question, 此处尽量收窄范围
                state = 'detail';
            }
            state = avalon.vmodels[state];
            if (state.back) {
                state.back();
            } else {
                history.go(-1);
            }
        }
    });

    // 定义一个全局抽象状态，用来渲染通用不会改变的视图，比如header，footer
    avalon.state("app", { // app.js这个控制器接管整个应用控制权
        url: "/",
        abstract: true, // 抽象状态，不会对应到url上, 会立即绘制list这个view
        views: {
            //"splash@": {
                //templateUrl: "assets/template/homework/splash.html", // 指定模板地址
            //},
            //"loading@": {
                //templateUrl: "assets/template/loading.html", // 指定模板地址
            //},
            "header@": {
                templateUrl: "assets/template/homework/header.html", // 指定模板地址
            },
            "": {
                templateUrl: "assets/template/homework/app.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/app.js", // 指定控制器地址
            }
            //,"footer@": { // 视图名字的语法请仔细查阅文档
                //templateUrl: "assets/template/footer.html", // 指定模板地址
            //}
        }
    })
    .state("app.list", { // 定义一个子状态
        url: "", // list the homework and can enter to do it
        views: {
            "": {
                templateUrl: "assets/template/homework/list.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/list.js" // 指定控制器地址
                //ignoreChange: function(changeType) { 
                    //return !!changeType;
                //} // url通过{}配置的参数变量发生变化的时候是否通过innerHTML重刷ms-view内的DOM，默认会，如果你做的是翻页这种应用，建议使用例子内的配置，把数据更新到vmodel上即可
            }
        }
    })
    .state("app.detail", { // 用来作为做题模块的总ctrl，抽象状态,加载完资源后会立即绘制info
        //url: "", // a homework with info and result panel, ms-view to render question one by one
        abstract: true, // 抽象状态，用法心得：总控。对复杂的情况分而治之
        views: {
            "": {
                templateUrl: "assets/template/homework/detail.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/detail.js" // 指定控制器地址
            }
        }
    })
    .state("app.detail.info", { // 作业信息面板，带homeworkId, 用于跳转到相应题目视图
        url: "detail/{homeworkId}/info", // 
        views: {
            "": {
                templateUrl: "assets/template/homework/info.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/info.js" // 指定控制器地址
            }
        }
    })
    .state("app.detail.question", { // 作业，url较为复杂，某作业下的某题
        url: "detail/{homeworkId}/q/{questionId}", // deal with a spec question, render it for different type
        views: {
            "": {
                templateUrl: "assets/template/homework/question.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/question.js", // 指定控制器地址
                ignoreChange: function(changeType) {
                    return !!changeType;
                }
            }
        }
    })
    .state("app.detail.result", { // 某次作业的结果
        url: "detail/{homeworkId}/result", // 
        views: {
            "": {
                templateUrl: "assets/template/homework/result.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/result.js" // 指定控制器地址
            }
        }
    })
    .state("app.mistake", { // 用来作为错题ctrl，抽象状态,加载完资源后会立即绘制 mistakeList
        //url: "", // a homework with info and result panel, ms-view to render question one by one
        abstract: true, // 抽象状态，用法心得：总控。对复杂的情况分而治之
        views: {
            "": {
                templateUrl: "assets/template/homework/mistake.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/mistake.js" // 指定控制器地址
            }
        }
    })
    .state("app.mistake.list", { // mistake list
        url: "mistake/list", // 
        views: {
            "": {
                templateUrl: "assets/template/homework/mistakeList.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/mistakeList.js" // 指定控制器地址
            }
        }
    })
    .state("app.mistake.wrong", { // mistake question
        url: "mistake/{homeworkId}/q/{questionId}", // deal with a spec question, render it for different type
        views: {
            "": {
                templateUrl: "assets/template/homework/wrong.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/wrong.js", // 指定控制器地址
                ignoreChange: function(changeType) {
                    return !!changeType;
                }
            }
        }
    })
    .state("app.evaluation", { // 课堂表现评价列表
        url: "evaluation", // 
        views: {
            "": {
                templateUrl: "assets/template/homework/evaluation.html", // 指定模板地址
                controllerUrl: "scripts/controller/homework/evaluation.js" // 指定控制器地址
            }
        }
    });
    //.state("app.report", { // 学业统计报告页面
    //    url: "report", // 
    //    views: {
    //        "": {
    //            templateUrl: "assets/template/homework/report.html", // 指定模板地址
    //            controllerUrl: "scripts/controller/homework/report.js" // 指定控制器地址
    //        }
    //    }
    //})

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
            avalon.log("Error!, Redirect to index!", arguments);
            avalon.router.go("/");
        }, 
        onBeforeUnload: function() { // 太宽泛了，放到具体ctrl里处理

        },
        onUnload: function() { // url变化时触发

        },
        onBegin: function() {

            // ====== view visit statistical ====== //
            function doIsVisitedCheck(cacheContainer, callback) { 

                if (typeof cacheContainer === 'function') {
                    callback = cacheContainer;
                    cacheContainer = void 0;
                }

                var pageId = location.href.split("!")[1];
                cacheContainer = cacheContainer || cachePage;
                cacheContainer.push(pageId);
                // var loader = document.querySelector('.loader');
                var isVisited = false;
                for (var i = 0, len = cachePage.length - 1; i < len; i++) { // last one must be the current href, so not included(length - 1)
                    if (cachePage[i] === pageId) {
                        // visited = true;
                        isVisited = true;
                    }
                }
                if (callback && typeof callback === 'function') {
                    callback();
                }
                // avalon.vmodels.root[vmProptoSet] = isVisited;
                return isVisited;
            }
            avalon.vmodels.root.currentIsVisited = doIsVisitedCheck();
            // ====== view visit statistical ====== // 
             
            // ====== loader show and bind network handler ====== //
            function loadingBeginHandler(loader, callback) { // mark!!! mark!!! deal with arguments

                if (typeof loader === 'function') { // deal with only one arguments and is callback
                    callback = loader;
                    loader = void 0;
                }
                loader = document.querySelector(loader || global_loader_className);
                var showLoader = function () { loader && (loader.style.display = ''); }; /* jshint ignore:line */
                var always_show_loader = global_always_show_loader === true ? true : false;
                 // loader show logic
                if (loader && always_show_loader) {
                    showLoader();
                } else if (loader && !always_show_loader && !root.currentIsVisited) {
                    showLoader();
                }
                if (callback && typeof callback === 'function') {
                    callback();
                }
            }
            loadingBeginHandler(bindBadNetworkHandler);
            // ====== loader show and bind network handler ====== //
            
        },
        onLoad: function() { // 切换完成并成功

            // ====== reset scroll bar ====== //
            function resetScrollbarWhenViewEnter() {
                document.body.scrollTop = 0;
                document.documentElement.scrollTop = 0;
            }
            if (global_always_reset_scrollbar) {
                resetScrollbarWhenViewEnter();
            }
            // ====== reset scroll bar ====== //

            // update current state ====== //
            function getCurrentState() {
                var state1 = mmState.currentState.stateName.split(".")[1]; // 第二个
                var state2 = mmState.currentState.stateName.split(".")[2]; // 第三个
                if (state2 === void 0) {
                    return state1;
                } else {
                    return state2;
                }
            }
            root.currentPage = getCurrentState();
            // state2 === void 0 ? root.currentPage = state1 : root.currentPage = state2; /* jshint ignore:line */
            // update current state ====== //

            // ====== set action bar title in page ====== //
            function setPageTitle() {
                var currentState = root.currentPage;
                root.title = acTitle[currentState];
            }
            setPageTitle();
            // ====== set action bar title in page ====== //

            // ====== remove loader and unbind bad network handler ====== //
            // next view loaded, remove loader && badNetworkHandler
            function unbindBadNetworkHandler(timer) {
                timer = timer || avalon.badNetworkTimer;
                timer && clearTimeout(timer); /* jshint ignore:line */ 
            }
            function loadingEndHandler(loader, callback) {
                if (typeof loader === 'function') { // deal with only one arguments and is callback
                    callback = loader;
                    loader = void 0;
                }
                loader = document.querySelector(loader || global_loader_className);
                var hideLoader = function() {
                    // for strong, need ()
                    loader && (loader.style.display = 'none'); /* jshint ignore:line */
                };
                if (global_loading_duration === void 0) {
                    global_loading_duration = 500;
                    console.log('WARNING: no global_loading_duration set!');
                }
                setTimeout(function() {
                    hideLoader();
                    if (callback && typeof callback === 'function') {
                        callback();
                    }
                }, global_loading_duration);   
            }
            loadingEndHandler(unbindBadNetworkHandler);

            // ====== remove loader and unbind bad network handler ====== //

            // ====== add view enter animation ====== //
            // var view = document.querySelector('[avalonctrl='+ root.currentPage + ']');
            // for strong
            // view && view.classList.add(avalon.illyGlobal && avalon.illyGlobal.viewani); /* jshint ignore:line */
            // ====== add view enter animation ====== //

        },
        onViewEnter: function(newNode, oldNode) { /* jshint ignore:line */
            //avalon(oldNode).animate({
            //    marginLeft: "-100%"
            //}, 500, "easein", function() {
            //    oldNode.parentNode && oldNode.parentNode.removeChild(oldNode)
            //})
        } 
    });

    /* router end */

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
    };

});

