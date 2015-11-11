define([],function(){var apiBaseUrl=avalon.illyGlobal.apiBaseUrl,wx=(avalon.illyGlobal.token,avalon.wx),resourcePrefix=avalon.illyGlobal.resourceBaseUrl,avatar={defaultFullUrl:resourcePrefix+"images/avatar/children/default1.png?imageView2/1/w/200/h/200",localId:"",serverId:""},me=avalon.define({$id:"me",infoProfile:["displayName","gender","phone","parent","onSchool","grade"],editing:!1,copyProfile:"",username:"",displayName:"",gender:"",phone:"",parent:"",onSchool:"",grade:"",finishedHomeworkCount:"",finishedPreviewsCount:"",score:"",resetData:function(){avatar.localId="",avatar.serverId=""},hasDiff:function(){var diff=me.infoProfile.every(function(item){return me[item]===me.copyProfile[item]});return!diff},setVM:function(source,setAvatar){setAvatar!==!1&&(setAvatar=!0),me.username=source.username,me.displayName=source.displayName,me.gender=source.gender||"男",me.phone=source.phone,me.parent=source.parent,setAvatar&&(me.avatar=void 0!==source.avatar?resourcePrefix+source.avatar+"?imageView2/1/w/200/h/200":avatar.defaultFullUrl),me.onSchool=source.onSchool,me.grade=source.grade,me.finishedHomeworkCount=source.finishedHomeworkCount,me.finishedPreviewsCount=source.finishedPreviewsCount,me.score=source.score},fetchData:function(){$http.ajax({url:apiBaseUrl+"profile",headers:{},dataType:"json",success:function(json){me.copyProfile=json,me.setVM(json,!0)}})},chooseImage:function(){wx.chooseImage({count:1,sizeType:["original","compressed"],sourceType:["album","camera"],success:function(res){var localIds=res.localIds;avatar.localId=localIds&&localIds[0],me.avatar=avatar.localId,me.uploadImage()}})},uploadImage:function(){wx.uploadImage({localId:avatar.localId,isShowProgressTips:1,success:function(res){var serverId=res.serverId;avatar.serverId=serverId,setTimeout(function(){me.updateAvatar()},200)}})},updateProfile:function(){$http.ajax({method:"PUT",url:apiBaseUrl+"profile",headers:{},data:{displayName:me.displayName,gender:me.gender,phone:me.phone,parent:me.parent,onSchool:me.onSchool,grade:me.grade},success:function(){},error:function(res){alert("对不起，账户信息更新失败..."+res),me.resetAll()},ajaxFail:function(res){alert("对不起，账户信息更新失败..."+res),me.resetAll()}})},updateAvatar:function(){$http.ajax({method:"PUT",url:apiBaseUrl+"avatar",headers:{},data:{avatar:avatar.serverId},success:function(){avalon.vmodels.task.showAlert("头像更换成功!",2)},error:function(res){avalon.illyError("avatar ajax error",res),avalon.vmodels.task.showAlert("对不起，头像更换失败，请重试！",1)},ajaxFail:function(res){avalon.illyError("avatar ajax ",res),avalon.vmodels.task.showAlert("对不起，头像更换失败，请重试！",1)}})},edit:function(){me.editing=!0},resetAll:function(){me.setVM(me.copyProfile,!1)},save:function(){me.hasDiff()&&me.updateProfile(),me.editing=!1},cancel:function(){me.resetAll(),me.editing=!1}});return avalon.controller(function($ctrl){$ctrl.$onRendered=function(){},$ctrl.$onEnter=function(){me.resetData(),me.fetchData()},$ctrl.$onBeforeUnload=function(){},$ctrl.$vmodels=[]})});
//# sourceMappingURL=me.js.map