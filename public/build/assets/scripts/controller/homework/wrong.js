define([],function(){var wrong=avalon.define({$id:"wrong",homeworkId:avalon.vmodels.mistake.homeworkId,exercise:{},total:0,currentId:0,userAnswer:"",localAnswers:[],right:null,hasNext:!1,next:function(){avalon.router.go("app.mistake.wrong",{homeworkId:wrong.homeworkId,questionId:wrong.currentId+1})},submit:function(){wrong.localAnswers=[],avalon.vmodels.mistake.submit()}});return avalon.controller(function($ctrl){$ctrl.$onRendered=function(){{var question=avalon.$(".question"),win_height=document.documentElement.clientHeight;avalon.$(".answer-panel")}setTimeout(function(){question&&(question.style.height=win_height+"px")},16)},$ctrl.$onEnter=function(params){wrong.currentId=params.questionId;var exercises=avalon.vmodels.mistake.exercises;if(0===exercises.length)return void location.replace("./homework.html#!/mistake/list");var id=params.questionId-1||0;wrong.exercise=exercises[id],wrong.userAnswer=wrong.exercise.wrongAnswer,wrong.localAnswers.push(wrong.exercise.wrongAnswer),wrong.right=!1,wrong.total=avalon.vmodels.mistake.exercises.length,wrong.hasNext=params.questionId<wrong.total?!0:!1},$ctrl.$onBeforeUnload=function(){},$ctrl.$vmodels=[]})});
//# sourceMappingURL=wrong.js.map