$(function(){function e(e,t){$.ajax({type:"get",url:WapSiteUrl+"/api/index.php?act=buyer_shopping&op=get_goods_scheme",data:{flag:"wap",type:"cainixihuan",num:t,area:l,curpage:e},dataType:"json",success:function(e){if(e&&"0"===e.error){var t=template.render("group-goods-tpl",e);$("#group-goods").append(t),$("#group-goods img").lazyload({threshold:200}),$(".group-price .dis").each(function(){p=$(this).parents(".group-price"),a=p.find(".goods_price").text(),b=p.find(".goods_marketprice").text(),dis=parseFloat(a/b*10).toFixed(1),$(this).text(dis+"折")})}}})}function t(e){if(e&&0==e.error&&0!=e.result){var a='<span class="cart-num">'+e.result||"0</span>";$(".shop-icon").append(a)}}function n(){$(window).scroll(function(){var a=document.body.scrollHeight||document.documentElement.scrollHeight,t=document.body.clientHeight||document.documentElement.clientHeight,n=document.body.scrollTop||document.documentElement.scrollTop;if(n+t==a){var p=$(".group-goods").length;page=p/7+1,o!=page&&i.test(page)&&(e(page,r),o=page)}})}layer.load(1,{shade:[.5,"#000000"]});var i=/^[-]{0,1}[0-9]{1,}$/,o=0,r=7,s=1,l=2;ImgFormat(),$.ajax({type:"get",url:WapSiteUrl+"/api/index.php?act=common_index&op=get_navigation",data:{location:1,flag:"wap"},dataType:"json",success:function(e){var a=template.render("navBars",e);$("#nav_bars").html(a),$(".nav7").click(function(e){FL.token?"0"==getcookie("if_shoper")?location.href="../weidian/small_store.html":"1"==getcookie("if_shoper")&&(location.href="../weidian/shopermoney.html"):location.href="../login/login.html",e.preventDefault()})}}),$.ajax({type:"get",url:WapSiteUrl+"/api/index.php?act=common_index&op=get_slides",data:{flag:"wap",type:"shouye"},dataType:"json",success:function(e){var a=template.render("swiper-tpl",e);$("#swiper-wrapper").append(a);new Swiper("#swiper-index",{loop:!0,effect:"fade",autoplay:6e3,pagination:".swiper-pagination",autoplayDisableOnInteraction:!1})}}),$.ajax({type:"get",url:WapSiteUrl+"/api/index.php?act=common_article&op=get_article_list",data:{flag:"wap",ac_id:"1",num:5,curpage:"1"},dataType:"json",success:function(e){var a=template.render("affiche-tpl",e);$("#affiche .swiper-wrapper").html(a);new Swiper("#affiche",{loop:!0,effect:"slide",autoplay:6e3,direction:"vertical",onSetTransition:function(e,a){$(".detailLink").attr("href",$("#affiche .swiper-slide").eq(e.activeIndex).attr("url"))}})}}),$.ajax({type:"get",url:WapSiteUrl+"/api/index.php?act=buyer_activity&op=get_activity_list",data:{type:"guojiaguan",channel:1,num:4,curpage:1,flag:"wap"},dataType:"json",success:function(e){if(e&&0==e.error){var a=template.render("nation_list",e);$("#nation").empty(),$("#nation").append(a),$("#nation img").lazyload({threshold:200})}else $("#nation").hide()}}),$.ajax({type:"get",url:WapSiteUrl+"/api/index.php?act=buyer_activity&op=get_activity_list",data:{type:"zhutiguan",channel:1,num:3,curpage:1,flag:"wap"},dataType:"json",success:function(e){if(e&&0==e.error){var a=template.render("theme_list",e);$("#theme").empty(),$("#theme").append(a),$("#theme img").lazyload({threshold:200})}else $("#theme").hide()}}),$.ajax({type:"get",url:WapSiteUrl+"/api/index.php?act=buyer_shopping&op=get_brandhouse_brands",data:{area:l,num:4,curpage:1,flag:"wap"},dataType:"json",success:function(e){if(e&&0==e.error){var a=template.render("brand_list",e);$("#brand").empty(),$("#brand").append(a);var t=parseInt(.49*$(".layout").width());$(".brand-ul img").css({height:t+"px"}),$("#brand img").lazyload({threshold:200})}else $("#brand").hide()}}),$.ajax({type:"get",url:WapSiteUrl+"/api/index.php?act=buyer_shopping&op=get_goods_scheme",data:{type:"jingxuantuijian",num:3,area:l,curpage:1,flag:"wap"},dataType:"json",success:function(e){if(e&&0==e.error){var a=template.render("recommends_list",e);$("#recommends").empty(),$("#recommends").append(a),$("#recommends img").lazyload({threshold:200})}else $("#recommends").hide()}}),$.ajax({type:"get",url:WapSiteUrl+"/api/index.php?act=common_index&op=get_adv_list",data:{type:"shouye",flag:"wap"},dataType:"json",success:function(e){if(e&&0==e.error){0==e.result.length&&($("#adv1").hide(),$("#adv2").hide());for(var a=0;a<e.result.length;a++){if(e.result[a].adv_link){var t=e.result[a].adv_link.replace(/&amp;/g,"&");$("#adv"+(a+1)).attr("href",t)}$("#adv"+(a+1)).find("img").attr("src",e.result[a].adv_pic)}}}});var d=Math.floor(2*Math.random());if(0==d)var c="分红全球购-海外直邮，正品保证！",u="网罗全球大牌，嗨购全球低价正品，海外直邮，极速达！~",g="分红全球购——购全球·享分红！嗨购全球低价正品，海外直邮极速达~";else var c="分红全球购——中国跨境直购平台！快乐购全球！",u="海外直邮，足不出户买遍全球好货，正品、低价！~",g="分红全球购——中国跨境直购平台！众享全球尖货，分销享分红，正品、低价、海外直邮！";var m=location.href.split("#")[0],h="http://www.fenhongshop.com/wap/images/wap/logo.png";FL.wxShare(c,u,m,h,g),FL.getGoodsNum({success:t});var f=getcookie("province");""==f&&setTimeout(function(){FL.getGps()},1e4),e(s,r),n()});var time=GetQueryString("time");if("first"==time){$("body").append('<div class="loading-shade"></div>');var html='<div class="new-packet-img animated fadeInDown"><img class="new-packet-x" id="close-x" src="../../images/red-packet/x.png"/> <button class="button btn1">马上使用</button> <button class="button btn2">查看优惠卷</button></div>';$("body").append(html),$("#close-x").click(function(){$(".new-packet-img").remove(),$(".loading-shade").remove()})}