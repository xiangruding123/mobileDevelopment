!function(t){function e(t){clearInterval(f);var e=t-1;e>=0?(i(e),f=setInterval(function(){--e,i(e),0==e&&(clearInterval(f),l())},1e3)):($(".sk-h").text("00"),$(".sk-m").text("00"),$(".sk-s").text("00"))}function i(t){var e=Math.floor(t/60/60%24),i=Math.floor(t/60%60),s=Math.floor(t%60);e<10&&(e="0"+e),i<10&&(i="0"+i),s<10&&(s="0"+s),$(".sk-h").text(e+":"),$(".sk-m").text(i+":"),$(".sk-s").text(s)}function s(){$("#tab_ul").on("click","li",function(){var t=this;$(t).addClass("color-active").siblings().removeClass("color-active");var e=($(t).attr("start_time"),$(t).attr("end_time"),$(t).find("p:eq(0)").text(),$(t).find("p:eq(1)").attr("state")),i=($(t).find("p:eq(1)").attr("title"),$(t).attr("if_current")),s=$(t).attr("type"),n=$(t).attr("if_cover"),l=$(t).attr("sequence_time"),a=$(t).attr("s_id");r(a,e,i,n,s),$(".sk-t-img").hide(),$(".img-"+a).show(),$(".sk-title").text(l+"正式开抢");var o=document.documentElement.clientWidth;o=o>640?640:o;var c=o/5,u=new IScroll("#sk_tab",{scrollX:!0,scrollY:!1,mouseWheel:!0,tap:!0});if($(t).index()>4){var d=-($(t).index()-4)*c;setTimeout(function(){u.scrollTo(d,0)},10)}else u.scrollTo(0,0)}),$("#tab_change").click(function(){var t=$(".color-active").next();0!=t.length&&t.trigger("click")})}function n(t){var e=document.documentElement.clientWidth;e=e>640?640:e;var i=e/5;$("#tab_ul").css("width",i*t+"px"),$("#tab_ul li").css("width",i+"px");new IScroll("#sk_tab",{scrollX:!0,scrollY:!1,mouseWheel:!0,tap:!0})}function l(){$.ajax({type:"get",data:{flag:"wap"},url:WapSiteUrl+"/api/index.php?act=buyer_seckilling&op=get_sequence_list&time="+Math.random(),dataType:"json",success:function(t){if(t&&0==t.error){var e=template.render("tabUl",t);$("#tab_ul").html(e);for(var i=0;i<t.result.length;i++)1==t.result[i].if_current&&3!=t.result[i].sequence_state&&$("#tab_ul li").eq(i).click(),3==t.result[i].sequence_state&&1==t.result[i].if_current&&$("#tab_ul li").eq(i+1).click(),2==t.result[i].sequence_state&&1==t.result[i].if_current&&(t.result[i].sequence_title?$(".sk-title").text("限时限量  入场疯抢"):$(".sk-title").text("抢购中 "+t.result[i].sequence_time+"开抢"),r(t.result[i].sequence_id,2,1));var s=template.render("sk_banner",t);$("#sk_tab").after(s),n(t.result.length)}}})}function r(t,i,s,n,l){$.ajax({type:"get",url:WapSiteUrl+"/api/index.php?act=buyer_seckilling&op=get_sequence_goods&time="+Math.random(),data:{flag:"wap",sequence_id:t},dataType:"json",success:function(t){if(t&&0==t.error){t.result.state=i,t.result.if_current=s,t.result.if_cover=n;var r=template.render("seckillList",t);$("#seckill_list").empty(),$("#seckill_list").html(r),setTimeout(function(){for(var t=0;t<$(".sk-pro").length;t++){var e=$($(".sk-pro")[t]).attr("width");$($(".sk-pro")[t]).css("width",e)}}),$(".sk-s-ready").click(function(){layer.msg("活动还未开始哦~")}),t.result[0].countdown?e(t.result[0].countdown):t.result[0].countdown_end&&e(t.result[0].countdown_end),1==i?(2==l?$("#sk_tips").hide():$("#sk_tips").show(),t.result[0].countdown&&$(".sk-span1").text("距开始")):2==i&&1==s?($("#sk_tips").show(),$(".sk-span1").text("距结束")):2==i&&0==s?$("#sk_tips").hide():3==i&&($("#sk_tips").show(),$(".sk-span1").text("本次秒杀结束"),$(".sk-time").hide())}else t&&"0004"==t.error&&$("#seckill_list").empty()}})}function a(){var t=document.getElementById("sk_tab").offsetTop;$(window).scroll(function(){var e=(document.body.scrollHeight||document.documentElement.scrollHeight,document.body.clientHeight||document.documentElement.clientHeight,document.body.scrollTop||document.documentElement.scrollTop);e>t?$("#sk_tab").css("position","fixed"):$("#sk_tab").css("position","relative")})}function o(){$.ajax({type:"get",url:WapSiteUrl+"/api/index.php?act=buyer_seckilling&op=get_seckilling_data",data:{flag:"wap"},dataType:"json",success:function(t){if(t&&0==t.error){var e=t.result.share_title,i=t.result.share_desc,s=t.result.share_img,n=t.result.seckilling_title,l=t.result.share_url||location.href.split("#")[0];$(".header-title").text(n),$("title").text(n),FL.wxShare(e,i,l,s),c(e,i,s,l)}}})}function c(t,e,i,s){var n=navigator.userAgent.toLowerCase();n.indexOf("fhmall_android")>0?u(t,e,i,s):n.indexOf("fhmall_ios")>0&&connectWebViewJavascriptBridge(function(n){_bridge=n;try{n.init(function(t,e){})}catch(l){}d(t,e,i,s)})}function u(t,e,i,s){var n={title:t,content:e,imgs:i,url:s};FHMall.enableShareButton(JSON.stringify(n))}function d(t,e,i,s){var n={func:"enableshare",params:{title:t,content:e,imgs:i,url:s}};_bridge.send(n)}var f,_=function(){this.onLoad=function(){$(".downLoad-fix").hide(),native_flag==-1&&$(".fh-header").removeClass("none"),addcookie("firstShow","no",1),a(),s(),l(),o()}};t.Activity=t.Activity||{},Activity.Seckill=new _}(this);