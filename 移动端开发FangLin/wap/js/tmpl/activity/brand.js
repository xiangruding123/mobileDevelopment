$(function(){function e(){FL.ajaxDate("get",get_brand_message,{brand_id:h},function(e){if(e&&"0"==e.error){console.log(e),$("title,.header-title").html(e.result.brand_name);var t=template("brandBlock-tpl",e);$(".brandBlock").html(t);var n=$("#noticetxt").height();console.log(n),n>30&&($("#noticetxt").addClass("overhide"),$("#notice").removeClass("hide")),$("#notice").click(function(){var e=this;$(e).hasClass("down")?($("#noticetxt").removeClass("overhide"),$(e).removeClass("down").addClass("up"),$(e).find("img").prop("src","../../images/wap/detail/notice_up.png")):($("#noticetxt").addClass("overhide"),$(e).removeClass("up").addClass("down"),$(e).find("img").prop("src","../../images/wap/detail/notice.png"))});var o;setTimeout(function(){o=$(".nav-pills").offset().top},500),$(window).scroll(function(){var e=$(this).scrollTop();console.log(o),e>o?$(".fh-nav").css({position:"fixed",top:"0",width:"100%","z-index":"103"}):$(".fh-nav").css({position:"relative",top:"0"})}),i(e.result)}})}function t(e,t,n,o,a,i){FL.ajaxDate("get",get_brand_goods,{num:a,curpage:o,order:t,sort:n,brand_id:i},function(t){if(t&&"0"==t.error){console.log(t);var n=template.render("brandDetails",t);"yes"==e&&$(".fh-goods").remove(),$(".pullUp").before(n),$("#brand_details img").lazyload({threshold:200})}})}function n(){$(".nav li").click(function(){var e=this,n=$(e).attr("num");2==n?($(".nav li").find("a").removeClass("focus-font"),$(e).find("a").attr("class","focus-font"),$(e).find("i").hasClass("icon-sort-up")?o(e,"desc"):o(e,"asc")):($(".nav li").find("a").removeClass("focus-font"),$(e).find("a").attr("class","focus-font"),u=1,g=n,t("yes",2,n,1,10,h)),f=0})}function o(e,n){"desc"==n?($(e).find("i").attr("class","icon-sort-down"),u=2,g=2,t("yes",u,g,d,c,h)):($(e).find("i").attr("class","icon-sort-up"),u=1,g=2,t("yes",u,g,d,c,h))}function a(){$(window).scroll(function(){var e=document.body.scrollHeight||document.documentElement.scrollHeight,n=document.body.clientHeight||document.documentElement.clientHeight,o=document.body.scrollTop||document.documentElement.scrollTop;if(o+n==e){var a=$(".fh-goods").length;page=a/c+1,f!=page&&m.test(page)?(t("no",u,g,page,c,h),f=page):layer.msg("已经没有商品了")}})}function i(e){var t=e.share_title,n=e.share_desc,o=location.href.split("#")[0],a=e.share_img;s(t,n,a,o),FL.wxShare(t,n,o,a),$(".share").click(function(){$(".-mob-share-ui").show(),FL.share(t,n,a,o)})}function s(e,t,n,o){var a=navigator.userAgent.toLowerCase();a.indexOf("fhmall_android")>0?r(e,t,n,o):a.indexOf("fhmall_ios")>0&&connectWebViewJavascriptBridge(function(a){_bridge=a;try{a.init(function(e,t){})}catch(i){}l(e,t,n,o)})}function r(e,t,n,o){var a={title:e,content:t,imgs:n,url:o};FHMall.enableShareButton(JSON.stringify(a))}function l(e,t,n,o){var a={func:"enableshare",params:{title:e,content:t,imgs:n,url:o}};_bridge.send(a)}var c=10,d=1,f=0,u=2,g=3,m=/^[-]{0,1}[0-9]{1,}$/;ImgFormat();var h=GetQueryString("brand_id");"-1"==native_flag&&$("header").removeClass("none"),e(),t("yes",u,g,d,c,h),n(),a()});