define([],function(){var apiBaseUrl=avalon.illyGlobal.apiBaseUrl,token=avalon.illyGlobal.token,cachedPrefix="illy-question-detail-",resourcePrefix=avalon.illyGlobal.resourceBaseUrl,detail=avalon.define({$id:"detail",visited:!1,questionId:"",questionImage:"",questionText:"",createdTime:"",answer:"",teacher:{},fetchData:function(questionId){if(detail.visited){var res=avalon.getLocalCache(cachedPrefix+detail.questionId);return detail.questionImage=""!==res.questionImage?resourcePrefix+res.questionImage+"?imageView/2/w/600/h/300":"",detail.questionText=res.questionText,detail.createdTime=res.createdTime,detail.answer=res.answer,void(detail.teacher=res.teacher||{})}$http.ajax({method:"GET",url:apiBaseUrl+"questions/"+questionId,headers:{Authorization:"Bearer "+token},dataType:"json",success:function(res){detail.questionImage=""!==res.questionImage?resourcePrefix+res.questionImage+"?imageView/2/w/600/h/300":"",detail.questionText=res.questionText,detail.createdTime=res.createdTime,detail.answer=res.answer,detail.teacher=res.teacher||{},avalon.setLocalCache(cachedPrefix+detail.questionId,res)},error:function(res){avalon.illyError("detail list ajax error",res)},ajaxFail:function(res){avalon.illyError("detail ajax failed"+res)}})}});return avalon.controller(function($ctrl){$ctrl.$onRendered=function(){},$ctrl.$onEnter=function(params){detail.questionId=params.questionId,detail.visited=avalon.vmodels.root.currentIsVisited,detail.fetchData(detail.questionId)},$ctrl.$onBeforeUnload=function(){},$ctrl.$vmodels=[]})});
//# sourceMappingURL=detail.js.map