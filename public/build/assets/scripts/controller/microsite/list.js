define([],function(){var apiBaseUrl=avalon.illyGlobal.apiBaseUrl,token=avalon.illyGlobal.token;null===token&&avalon.vmodels.root.noTokenHandler();var cachedPrefix="illy-microsite-list-",needCache=!0,limit=6,list=avalon.define({$id:"list",visited:!1,lists:[],categoryId:1.1111111111111111e23,title:"title",offset:0,isLoading:!1,noMoreData:!1,btnShowMore:!0,fetchRemoteData:function(apiArgs,data,target,concat){return list.visited&&needCache&&!concat?void(list.lists=avalon.getLocalCache(cachedPrefix+list.categoryId+"-"+target)):void $http.ajax({url:apiBaseUrl+apiArgs,headers:{Authorization:"Bearer "+token},data:data,success:function(res){list[target]=concat===!0?list[target].concat(res):res,avalon.setLocalCache(cachedPrefix+list.categoryId+"-"+target,res),0===list.lists.length&&(list.noMoreData=!0)},error:function(res){console.log("list.js ajax error when fetch data"+res)},ajaxFail:function(res){console.log("list.js ajax failed when fetch data"+res)}})},showMore:function(e){e.preventDefault();var page=2;return list.offset<limit?void(list.btnShowMore=!1):(list.offset=list.offset+limit*(page-1),void list.fetchRemoteData("categories/"+list.categoryId+"/posts",{offset:list.offset},"lists",!0))}});return avalon.controller(function($ctrl){$ctrl.$onBeforeUnload=function(){},$ctrl.$onEnter=function(params){return list.visited=avalon.vmodels.root.currentIsVisited,list.categoryId=params.categoryId,avalon.vmodels.site.categoryId=params.categoryId,"hots"===list.categoryId?(list.btnShowMore=!1,void list.fetchRemoteData("posts/hot?limit=10",{},"lists")):(list.btnShowMore=list.offset<=limit?!1:!0,void list.fetchRemoteData("categories/"+list.categoryId+"/posts",{},"lists"))},$ctrl.$onRendered=function(){},$ctrl.$vmodels=[]})});
//# sourceMappingURL=list.js.map