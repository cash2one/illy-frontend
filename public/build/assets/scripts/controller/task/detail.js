define([],function(){var token=(avalon.illyGlobal.apiBaseUrl,avalon.illyGlobal.token);null===token&&avalon.vmodels.root.noTokenHandler();var detail=avalon.define({$id:"detail",taskId:1,scoreAward:0,outer:!1,hideTaskInfo:function(infoArr){infoArr.forEach(function(item){item=""})},clearCachedData:function(){}});return avalon.controller(function($ctrl){$ctrl.$onRendered=function(){},$ctrl.$onEnter=function(){detail.clearCachedData()},$ctrl.$onBeforeUnload=function(){},$ctrl.$vmodels=[]})});
//# sourceMappingURL=detail.js.map