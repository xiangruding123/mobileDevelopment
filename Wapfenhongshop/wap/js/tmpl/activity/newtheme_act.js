!function(t){function e(t){window.WebViewJavascriptBridge?t(WebViewJavascriptBridge):document.addEventListener("WebViewJavascriptBridgeReady",function(){t(WebViewJavascriptBridge)},!1)}function i(){$.ajax({type:"get",url:WapSiteUrl+"/api/index.php?act=buyer_activity&op=get_activity_detail",data:{activity_id:d,flag:"wap",type:"tietu"},dataType:"json",success:function(t){if(t&&"0"===t.error){if(v=t.result.resource_tags||v,template.helper("resource",function(t){return t+"&resource_tags="+v}),$("title,.header-title").text(t.result.activity_title),$(".activity_body").html(t.result.activity_body),$(".activity_body").after("<img src='"+t.result.activity_banner+"' style='width:100%'>"),template.helper("parseFloat",parseFloat),$(".activity_body a[href]").unbind("click").bind("click",function(t){var e=$(this).attr("href"),i=e.split("!")[0];e.indexOf("goods_id=")>0&&(location.href=i+"&resource_tags="+v+"!goodsdetail",t.preventDefault())}),t.result.activity_slides){var e=template.render("banners",t.result);$(".swiper-wrapper").empty(),$(".swiper-wrapper").append(e)}var i=template.render("themeBars",t.result);$("#themeList").empty(),$("#themeList").append(i),$($(".navbar-nav").find("li")[0]).attr("class","active");var r=parseInt(.48*($(".container").width()+30))-20;$(".tm-imgList").css({width:r+"px",height:r+"px"}),$("#themeList img").lazyload({threshold:200}),l(),a(),c();var o=t.result.share_title,s=t.result.share_desc,d=location.href.split("#")[0],p=t.result.share_img;FL.wxShare(o,s,d,p,s,v),n(o,s,p,d)}},error:function(t){}})}function a(){"-1"==native_flag&&$("header").removeClass("none"),$(window).on("scroll",function(){var t=document.body.scrollTop;t>=198?$(".tm-nav").attr("style","position:fixed !important;"):($(".tm-nav").attr("style","position:relitive !important"),$($(".navbar-nav").find("li")[0]).attr("class","active")),$(".m-dropdown .floors li").eq($(".navbar-nav .active").index()).addClass("active").siblings("li").removeClass("active");var e=$(".navbar-nav .active");r(e)}),$("#t-tabs li").click(function(){var t=this;setTimeout(function(){$("#t-tabs li").removeClass(),$(t).attr("class","active"),r(t)},10)}),$(".floor-ul li").mousemove(function(){$(this).css("border-color","#fa2855")}),$(".floor-ul li").mouseout(function(){$(this).css("border-color","#eee")}),$(".rg-arrow").click(function(){$(".m-dropdown").addClass("show mask"),$(".m-dropdown").attr("style","position:fixed !important;")}),$(".select-btn").click(function(){$(".m-dropdown").removeClass("show mask"),$(".m-dropdown").attr("style","position:relative !important;")}),$(".m-dropdown .floors li").click(function(){var t=this;$(".navbar-nav").eq($(t).index()).click(),$(this).addClass("active").siblings("li").removeClass("active"),$(".m-dropdown").removeClass("show mask"),$(".m-dropdown").attr("style","position:relative !important;"),r(t)})}function r(t){var e=$(t).index();if(e>2){var i=.25*($(".container").width()+30),a=-(e*i-$(".container").width()/2);$(".navbar-nav").css("transform","translateX("+a+"px)")}else $(".navbar-nav").css("transform","translateX(0px)")}function n(t,i,a,r){var n=navigator.userAgent.toLowerCase();n.indexOf("fhmall_android")>0?o(t,i,a,r):n.indexOf("fhmall_ios")>0&&e(function(e){u=e;try{e.init(function(t,e){})}catch(n){}s(t,i,a,r)})}function o(t,e,i,a){var r={title:t,content:e,imgs:i,url:a};FHMall.enableShareButton(JSON.stringify(r))}function s(t,e,i,a){var r={func:"enableshare",params:{title:t,content:e,imgs:i,url:a}};u.send(r)}function l(){var t=.25*($(".container").width()+30),e=$("#t-tabs li").length,i=t*e;if(i>$(".container").width()+30){$(".navbar-nav").attr("style","width:"+i+"px"),$($(".navbar-nav").find("li")).attr("style","width:"+t+"px");new IScroll("#t-tabs",{scrollX:!0,scrollY:!1,mouseWheel:!0,tab:!0})}}function c(){new Swiper(".swiper-container",{autoplay:6e3,autoplayDisableOnInteraction:!1,pagination:".swiper-pagination"})}var d=GetQueryString("activity_id"),v=GetQueryString("resource_tags"),p=GetQueryString("title");$(".header-title").text(p);var u;ImgFormat();var f=function(){this.onLoad=function(){i()}};t.Goods=t.Goods||{},Goods.ThemeDetails=new f}(this);