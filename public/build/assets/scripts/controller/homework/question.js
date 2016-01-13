define([],function(){var wx=avalon.wx,record={startTime:0,endTime:0,duration:5,localId:"",timeout:"timeout",playRecordTimeout:"playRecordTimeout",remainTimeTimer:null,showTimeoutDelay:45,recordTooShortTipsLastTime:1.5,showTimeOutLayer:function(){var timeoutMask=avalon.$(".timeout-mask");record.layerUiChange(),record.remainTimeTimer=setInterval(function(){var time=timeoutMask&&parseInt(timeoutMask.innerHTML,10)||0;timeoutMask&&(timeoutMask.innerHTML=time>0?time-1:10),0===time&&(question.stopRecord(),clearInterval(record.remainTimeTimer))},1e3),setTimeout(function(){record.layerUiRecover()},18e3)},layerUiChange:function(){var timeoutMask=avalon.$(".timeout-mask"),isRecording=avalon.$(".isRecording");timeoutMask&&(timeoutMask.style.display="inline-block"),isRecording&&isRecording.classList.add("timeout")},layerUiRecover:function(){var timeoutMask=avalon.$(".timeout-mask"),isRecording=avalon.$(".isRecording"),remainTimeTimer=record.remainTimeTimer;remainTimeTimer&&clearInterval(remainTimeTimer),timeoutMask&&(timeoutMask.innerHTML="10"),timeoutMask&&(timeoutMask.style.display="none"),isRecording&&isRecording.classList.remove("timeout")},showTips:function(){var recordTips=avalon.$(".record-tips");recordTips&&(recordTips.style.display="inline-block")},hideTips:function(){var recordTips=avalon.$(".record-tips");recordTips&&(recordTips.style.display="none")}},question=avalon.define({$id:"question",homeworkId:"",starter:!0,isDroped:!1,isRecording:!1,isPlaying:!1,hasNext:!1,showPlayRecordBtn:!1,duration:3,localAnswers:[],exercise:{},total:0,currentId:0,userAnswer:"",right:null,uploadRecord:function(){var localId=record.localId;return""===localId?(avalon.illyError("上传失败，没有localId, localId为："+localId),void alert("对不起,上传失败!")):void wx.uploadVoice({localId:localId,isShowProgressTips:1,success:function(res){var serverId=res.serverId;question.userAnswer=serverId,question.showPlayRecordBtn=!0,question.duration=record.duration}})},playRecord:function(){var localId=record.localId;return""===localId?(avalon.illyError("no localId to playRecord"),void alert("录制不成功，请重试！")):(wx.playVoice({localId:localId}),question.isPlaying=!0,clearTimeout(record.playRecordTimeout),void(record.playRecordTimeout=setTimeout(function(){question.isPlaying=!1},1e3*record.duration)))},stopPlayRecord:function(){var localId=record.localId;""!==localId&&(wx.stopVoice({localId:localId}),question.isPlaying=!1)},next:function(){avalon.router.go("app.detail.question",{homeworkId:question.homeworkId,questionId:question.currentId+1})},startRecord:function(){wx.stopRecord(),wx.startRecord(),record.hideTips(),question.isRecording=!0;var startTime=Date.now();record.startTime=startTime,wx.onVoiceRecordEnd({complete:function(res){var localId=res.localId;record.localId=localId,question.uploadRecord()}}),record.timeout=setTimeout(function(){record.showTimeOutLayer()},1e3*record.showTimeoutDelay)},stopRecord:function(){question.isRecording=!1,avalon.$(".timeout-mask").style.display="none",record.timeout&&clearTimeout(record.timeout);var endTime=Date.now();record.endTime=endTime;var duration=(record.endTime-record.startTime)/1e3;duration=parseInt(duration,10)||1,record.duration=duration,3>duration?(record.showTips(),setTimeout(function(){record.hideTips()},1e3*record.recordTooShortTipsLastTime),wx.stopRecord({})):duration>=3&&60>=duration&&wx.stopRecord({success:function(res){var localId=res.localId;record.localId=localId,question.uploadRecord()}})},togglePlayRecord:function(){question.isPlaying?question.stopPlayRecord():question.playRecord()},checkAnswer:function(){if(avalon.vmodels.detail.isDoing=!0,question.localAnswers.length>=question.currentId)return avalon.illyError("不可更改答案!"),void alert("不可更改答案!");question.isRecording&&question.stopPlayRecord();var detailVM=avalon.getVM("detail");if(question.exercise&&3===question.exercise.eType){question.stopRecord();var audioAnswer=question.userAnswer;return""===audioAnswer?void question.dropRecordQuestionConfirm():(question.right=!0,detailVM.audioAnswers.push({sequence:question.currentId,answer:audioAnswer}),void question.localAnswers.push({localId:record.localId,duration:question.duration}))}if(""===question.userAnswer)return void avalon.vmodels.app.showAlert("请至少给出一个答案！");if(question.exercise&&question.exercise.answer.trim()===question.userAnswer.trim())question.right=!0;else{question.right=!1;var radioAnswer=question.userAnswer;detailVM.wrongCollect.push({sequence:question.exercise.sequence,answer:radioAnswer})}question.localAnswers.push(question.userAnswer)},submit:function(){avalon.vmodels.detail.submit()},dropRecordQuestionConfirm:function(){var app=avalon.vmodels.app;question.isDroped||(app.showConfirm("是否放弃本录音题?"),app.$watch("yesOrNo",function(value){value===!0?(question.right=!0,question.localAnswers.push({localId:"",duration:0}),question.isDroped=!0,question.hasNext?question.next():question.submit()):app.$unwatch("yesOrNo")}))}}),hasRequestRecordAuth=!1;return avalon.controller(function($ctrl){var detailVM=avalon.getVM("detail"),exercises=detailVM.exercises;$ctrl.$onRendered=function(){avalon.vmodels.question.starter&&(avalon.vmodels.detail.questionStartTime=Date.now(),avalon.vmodels.question.starter=!1),setTimeout(function(){wx.stopRecord()},200)},$ctrl.$onEnter=function(params){if(question.homeworkId=avalon.vmodels.detail.homeworkId,setTimeout(function(){wx.stopRecord()},200),question.isDroped=!1,!hasRequestRecordAuth){var needRequestAuth=avalon.vmodels.detail.exercises.some(function(item){return 3===item.eType});needRequestAuth&&(wx.startRecord(),setTimeout(function(){wx.stopRecord()},2e3),hasRequestRecordAuth=!0,wx.stopRecord())}question.currentId=params.questionId;var id=params.questionId-1||0;if(setTimeout(function(){var currentHomeworkId=avalon.vmodels.detail.homeworkId,urlHomeworkId=params.homeworkId;currentHomeworkId!==urlHomeworkId&&avalon.router.go("app.list")},100),0===exercises.length)return void location.replace("./homework.html");if(question.exercise=exercises[id],3===question.exercise.eType){var localAnswerObj=question.localAnswers[question.currentId-1]||{localId:"",duration:0};question.userAnswer=localAnswerObj.localId,question.duration=localAnswerObj.duration,record.startTime="",record.endTime="",record.localId=question.userAnswer,record.duration=question.duration,record.remainTimeTimer=null,question.isRecording=!1}else setTimeout(function(){question.userAnswer=question.localAnswers[question.currentId-1]||"",question.right=question.exercise.answer.trim()===question.userAnswer.trim()||3===question.exercise.eType},100);question.showPlayRecordBtn=question.localAnswers.length<question.currentId?!1:!0,question.total=avalon.vmodels.detail.exercises.length,question.hasNext=params.questionId<question.total?!0:!1,setTimeout(function(){$(".yo-list").on("click",".item",function(){$(this).find("input").attr("disabled")||($(".yo-list .item").removeClass("question-item-active"),$(this).addClass("question-item-active"))})},100)},$ctrl.$onBeforeUnload=function(){question.stopPlayRecord(),avalon.vmodels.app.hideConfirm()},$ctrl.$vmodels=[]})});
//# sourceMappingURL=question.js.map