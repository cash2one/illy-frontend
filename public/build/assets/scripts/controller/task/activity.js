define([],function(){function resetScroll(){document.documentElement.srcollTop=0,document.body.scrollTop=0}var apiBaseUrl=avalon.illyGlobal.apiBaseUrl,token=avalon.illyGlobal.token;null===token&&avalon.illyGlobal.noTokenHandler();var jinbiResourcePrefix=avalon.vmodels.task.illy_domain+"/assets/images",wx=avalon.wx,cachedPrefix="illy-task-activity-",copyArr=function(arr){for(var brr=[],i=0,len=arr.length;len>i;i++)brr[i]=arr[i];return brr},dataAdapter=function(source){for(var arr=copyArr(source),i=2,len=arr.length;len>i;i++)arr[i]={key:activity.CopyinfoCollect[i],value:arr[i]};arr.shift(),arr.shift();var infoJSON=arr;return{name:source[0],phone:source[1],others:infoJSON}},activity=avalon.define({$id:"activity",visited:!1,taskId:1,theme:"",isDone:!1,isCancel:!1,isFilling:!1,activityId:1,scoreAward:10,address:"",content:"",startTime:"",endTime:"",deadline:"",shareCount:88,visitCount:88,likeCount:0,infoCollect:[],CopyinfoCollect:[],isShared:!1,updateShare:function(){$http.ajax({method:"PUT",url:apiBaseUrl+"tasks/"+activity.taskId+"/done",headers:{Authorization:"Bearer "+token},success:function(res){avalon.vmodels.task.score=res.score},error:function(res){console.log(res)},ajaxFail:function(res){console.log(res)}})},hasLiked:!1,updateLike:function(){$http.ajax({method:"PUT",url:apiBaseUrl+"public/activities/"+activity.activityId+"/like",headers:{Authorization:"Bearer "+token},success:function(){var likeCount=activity.likeCount||0;activity.likeCount=++likeCount},error:function(res){console.log(res)},ajaxFail:function(res){console.log(res)}})},like:function(){activity.updateLike(),avalon.setLocalCache(cachedPrefix+activity.taskId+"-like","hasLiked"),activity.hasLiked=!0},scrollTop:0,shareMaskShow:!0,showShareMask:function(){var scrollTop=document.body.scrollTop||document.documentElement.scrollTop;activity.scrollTop=scrollTop,document.body.scrollTop=0,document.documentElement.scrollTop=0;var mask=document.querySelector(".shareMask");setTimeout(function(){mask&&(mask.style.display="block"),mask&&mask.classList.add("a-bounceinB")},16)},hideShareMask:function(){document.body.scrollTop=activity.scrollTop,document.documentElement.scrollTop=activity.scrollTop;var mask=document.querySelector(".shareMask");mask&&mask.classList.remove("a-bounceinB"),setTimeout(function(){mask&&mask.classList.add("a-bounceoutB")},16),setTimeout(function(){mask&&(mask.style.display="none"),mask&&mask.classList.remove("a-bounceoutB")},500)},filling:function(){activity.isFilling=!0},cancel:function(){activity.isCancel=!0,activity.isFilling=!1},pushInfo:function(){var validPhone=function(phone){return/^\d{3,}$/.test(phone)},valid=""!==activity.infoCollect[0]&&validPhone(activity.infoCollect[1]);return valid?void $http.ajax({method:"POST",url:apiBaseUrl+"public/activities/"+activity.activityId+"/info",headers:{Authorization:"Bearer "+token},data:dataAdapter(activity.infoCollect),success:function(){activity.isDone=!0,activity.isFilling=!1,avalon.setLocalCache(cachedPrefix+activity.taskId+"-isSignUp","signUp")},error:function(res){console.log(res)},ajaxFail:function(res){console.log(res)}}):void avalon.vmodels.task.showAlert("请填写完整, 格式无误的信息",2)},fetchData:function(){if(activity.visited){var localCache=avalon.getLocalCache(cachedPrefix+activity.taskId);return activity.activityId=localCache._id,activity.theme=localCache.theme,activity.address=localCache.address,activity.content=localCache.content,activity.startTime=localCache.startTime,activity.endTime=localCache.endTime,activity.deadline=localCache.deadline,activity.shareCount=localCache.shareCount,activity.visitCount=localCache.visitCount,activity.likeCount=localCache.like||0,activity.infoCollect=localCache.infoCollect[0],void(activity.CopyinfoCollect=localCache.infoCollect[0])}$http.ajax({url:apiBaseUrl+"tasks/"+activity.taskId,headers:{Authorization:"Bearer "+token},dataType:"json",success:function(json){activity.activityId=json._id,activity.theme=json.theme,activity.address=json.address,activity.content=json.content,activity.startTime=json.startTime,activity.endTime=json.endTime,activity.deadline=json.deadline,activity.shareCount=json.shareCount,activity.visitCount=json.visitCount,activity.likeCount=json.like||0,json.infoCollect.unshift("姓名","电话"),activity.infoCollect=json.infoCollect;for(var i=0,len=activity.infoCollect.length;len>i;i++)activity.infoCollect[i]="";activity.CopyinfoCollect=json.infoCollect,activity.theme=json.theme,avalon.setLocalCache(cachedPrefix+activity.taskId,json);var imgUrl=document.querySelector(".content").querySelectorAll("img")[0];wx.onMenuShareTimeline({title:activity.theme,link:avalon.vmodels.task.illy_domain+"/outer/staticActivity.html?id="+activity.activityId,imgUrl:imgUrl&&imgUrl.src||avalon.vmodels.task.illy_domain+"/assets/images/kd2.png",success:function(){activity.hideShareMask(),activity.shareCount++,activity.isShared===!1&&(activity.isShared=!0,resetScroll(),activity.updateShare(),setTimeout(function(){$(".item1 > div.kodai").click()},1500))},cancel:function(){activity.isShared||avalon.vmodels.task.showAlert("差一点就分享成功了, 拿积分兑大奖了!",3)}});var appMessageDesc="发现"+avalon.vmodels.task.schoolName+"的这篇<<"+activity.theme+">>很赞, 你也瞧瞧~";wx.onMenuShareAppMessage({title:activity.theme,desc:appMessageDesc,link:avalon.vmodels.task.illy_domain+"/outer/staticActivity.html?id="+activity.activityId,imgUrl:imgUrl&&imgUrl.src||avalon.vmodels.task.illy_domain+"/assets/images/kd2.png",success:function(){avalon.vmodels.task.showAlert("分享成功! 朋友将会收到您的分享~",3)},cancel:function(){activity.isShared||avalon.vmodels.task.showAlert("差一点就分享成功了!",3)}})}})}});return avalon.controller(function($ctrl){$ctrl.$onRendered=function(){var signUp=avalon.getLocalCache(cachedPrefix+activity.taskId+"-isSignUp");"signUp"===signUp&&(activity.isDone=!0,activity.isFilling=!1)},$ctrl.$onEnter=function(params){setTimeout(function(){avalon.$("#footer").style.display="none"},300),activity.taskId=params.taskId,activity.scoreAward=params.scoreAward,activity.visited=avalon.vmodels.root.currentIsVisited,activity.isShared=!1,activity.fetchData();var isLiked=avalon.getLocalCache(cachedPrefix+activity.taskId+"-like");"hasLiked"===isLiked?(activity.hasLiked=!0,++activity.likeCount):activity.hasLiked=!1,activity.isFilling=!1,activity.$watch("isShared",function(newVal){if(newVal){(genClips=function(){$t=$(".item1");for(var amount=5,width=$t.width()/amount,height=$t.height()/amount,y=(Math.pow(amount,2),0),index=1,z=0;amount*width>=z;z+=width)$('<img class="clipped" src="'+jinbiResourcePrefix+"/jb"+index+'.png" />').appendTo($(".item1 .clipped-box")),z===amount*width-width&&(y+=height,z=-width),index>=5&&(index=1),index++,y===amount*height&&(z=9999999)})();var rand=function(min,max){return Math.floor(Math.random()*(max-min+1))+min},first=!1,clicked=!1;$(".item1 div.kodai").on("click",function(){setTimeout(function(){alert("任务完成，恭喜获得"+activity.scoreAward+"积分！快去兑大奖吧~")},3e3),setTimeout(function(){activity.isShared="isShared"},4e3),clicked===!1&&($(".full").css({display:"none"}),$(".empty").css({display:"block"}),clicked=!0,$(".item1 .clipped-box").css({display:"block"}),$(".clipped-box img").each(function(){var z,nx,ny,v=rand(120,90),angle=rand(80,89),theta=angle*Math.PI/180,g=-9.8,self=$(this),t=0,totalt=10,negate=[1,-1,0],direction=negate[Math.floor(Math.random()*negate.length)],randDeg=rand(-5,10),randScale=rand(.9,1.1),randDeg2=rand(30,5);$(this).css({transform:"scale("+randScale+") skew("+randDeg+"deg) rotateZ("+randDeg2+"deg)"}),z=setInterval(function(){var ux=Math.cos(theta)*v*direction,uy=Math.sin(theta)*v- -g*t;nx=ux*t,ny=uy*t+.25*g*Math.pow(t,2),-40>ny&&(ny=-40),$(self).css({bottom:ny+"px",left:nx+"px"}),t+=.1,t>totalt&&(clicked=!1,first=!0,clearInterval(z))},20)}))}),r=setInterval(function(){first===!0&&($(".empty").addClass("Shake"),first=!1)},300)}})},$ctrl.$onBeforeUnload=function(){},$ctrl.$vmodels=[]})});
//# sourceMappingURL=activity.js.map