define([],function(){var apiBaseUrl=avalon.illyGlobal&&avalon.illyGlobal.apiBaseUrl||"http://api.hizuoye.com/api/v1/",token=avalon.illyGlobal.token;null===token&&avalon.vmodels.root.noTokenHandler();var back=function(){if(detail.isDone||!detail.isDoing)return void avalon.router.go("app.list");detail.dropCurrentDoneComfirm();var app=avalon.vmodels.app;app.$watch("yesOrNo",function(value){return value===!0?void avalon.router.go("app.list"):void app.$unwatch("yesOrNo")})},detail=avalon.define({$id:"detail",isDone:!1,isDoing:!1,homeworkId:1,title:"detail.js title",keyPoint:"detail.js keyPoint",keyPointRecord:"detail.js keyPointRecord",exercises:[],questionStartTime:"",wrongCollect:[],audioAnswers:[],result:{rightAward:88,finishedAward:88,totalAward:888,rightCount:15,wrongCount:0,totalScore:100},submit:function(){var spendSeconds=(Date.now()-avalon.vmodels.detail.questionStartTime)/1e3,IntSpendSeconds=parseInt(spendSeconds,10)||0,type=avalon.vmodels.info.workType;$http.ajax({method:"PUT",url:apiBaseUrl+type+"/"+detail.homeworkId+"/performance",headers:{Authorization:"Bearer "+token},data:{_id:avalon.getPureModel("detail").homeworkId,spendSeconds:IntSpendSeconds,wrongCollect:avalon.getPureModel("detail").wrongCollect,audioAnswers:avalon.getPureModel("detail").audioAnswers,numOfExercise:avalon.getPureModel("detail").exercises.length},success:function(res){var target=avalon.vmodels.detail.$model.result;target.rightAward=res.rightAward,target.finishedAward=res.finishedAward,target.totalAward=res.totalAward,target.rightCount=res.rightCount,target.wrongCount=res.wrongCount,target.totalScore=res.totalScore,localStorage.setItem("illy-homework-last-result",JSON.stringify(res)),setTimeout(function(){avalon.router.go("app.detail.result",{homeworkId:detail.homeworkId})},16)},error:function(res){console.log(res),alert("对不起，作业提交失败，请退出重试！"),avalon.router.go("app.list")}})},clearCachedData:function(){var detailVM=avalon.getPureModel("detail");detailVM&&(detailVM.wrongCollect=[]),detailVM&&(detailVM.audioAnswers=[]);var questionVM=avalon.getVM("question");questionVM&&(questionVM.localAnswers=[]),detail.isDone=!1,detail.isDoing=!1},dropCurrentDoneComfirm:function(){var app=avalon.vmodels.app;app.showConfirm("您确定放弃本次作业？")},back:back,clearLastHomeworkData:function(){detail.$model.homeworkId=0,detail.$model.title="",detail.$model.keyPoint="",detail.$model.keyPointRecord="",detail.$model.exercises.length=0}});return avalon.controller(function($ctrl){$ctrl.$onRendered=function(){},$ctrl.$onEnter=function(){detail.clearCachedData()},$ctrl.$onBeforeUnload=function(){},$ctrl.$vmodels=[]})});
//# sourceMappingURL=detail.js.map