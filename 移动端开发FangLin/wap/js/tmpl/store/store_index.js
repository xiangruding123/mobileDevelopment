!function(e){function t(e){$.ajax({type:"get",url:WapSiteUrl+"/api/index.php?act=buyer_shopping&op=get_store_home_info",data:{store_id:e,mid:FL.mid,flag:"wap"},dataType:"json",success:function(e){if(e&&0==e.error){$("#store_scroll").removeClass();var t=e.result;$(".head").css("background-image","url("+t.store_banner+")"),$("#store_logo").attr("src",t.store_avatar),$("#store_name").text(t.store_name),e.result.is_collected&&1==e.result.is_collected&&($("#col_shop").attr("class","uncollect"),$("#col_shop").text("-已收藏"));var o=template.render("storeBanner",e.result);$("#store_banner").html(o);new Swiper(".swiper-container",{loop:!0,autoplay:6e3,pagination:".swiper-pagination",autoplayDisableOnInteraction:!1});$("#store_tab").hide(),$("#store_head").show(),$("#store_banner").show(),e.result.store_baidusales?$(".store_baidusales").click(function(){location.href="../shopping/store_baidusales.html?store_baidusales="+e.result.store_baidusales}):$(".store_baidusales").click(function(){layer.msg("商家不在线，请稍后联系")});var s=e.result.store_name,a="这家店铺的商品品质可靠、物美价廉、快来看看吧！",r=location.href.split("#")[0],n=e.result.store_avatar||e.result.store_label;FL.wxShare(s,a,r,n)}}})}function o(e,t,o,s,a,r,n){$.ajax({type:"get",url:WapSiteUrl+"/api/index.php?act=common_goods&op=get_goods_list",data:{sid:e,scid:t,sort:o,order:s,num:a,curpage:r,flag:"wap"},dataType:"json",success:function(e){if(e&&0==e.error){template.helper("parseFloat",parseFloat);var t=template.render("storeGoods",e);"yes"==n&&$("#goods_list").empty(),$("#goods_list").append(t);var o=parseInt(.49*($(".container").width()+30));$(".store-list img").css({height:o+"px"}),$("#goods_list img").lazyload({threshold:200})}}})}function s(e){$.ajax({type:"get",url:WapSiteUrl+"/api/index.php?act=buyer_shopping&op=get_store_new_goods",data:{store_id:e,flag:"wap"},dataType:"json",success:function(e){if(e&&0==e.error){var t=template.render("newGoods",e);$("#goods_list").empty(),$("#goods_list").append(t);var o=parseInt(.49*($(".container").width()+30));$(".store-list img").css({height:o+"px"}),$("#goods_list img").lazyload({threshold:200})}}})}function a(e,t){"desc"==t?($(e).find("i").attr("class","icon-sort-down"),f=2,h=2):($(e).find("i").attr("class","icon-sort-up"),f=2,h=1),o(b,g,f,h,d,u,"yes")}function r(){$.ajax({type:"get",url:WapSiteUrl+"/api/index.php?act=buyer_shopping&op=get_store_class",data:{store_id:b,flag:"wap"},dataType:"json",success:function(e){var t=template.render("storeClass",e);$("#store_class").html(t),n()}})}function n(){$("#goods_class").click(function(){$(".drc-dialog").toggle()}),$(".tab").click(function(){var e=this;$(".store-goods").remove();var t=$(e).attr("stc_id");$($(".shop_list li")[1]).trigger("click"),$("#store_head").hide(),$("#store_banner").hide(),$("#store_tab").show(),$("#store_scroll").attr("class","st-index"),o(b,t,3,2,d,u,"yes"),$(".drc-dialog").hide()})}function i(){$(window).scroll(function(){var e=document.body.scrollHeight||document.documentElement.scrollHeight,t=document.body.clientHeight||document.documentElement.clientHeight,s=document.body.scrollTop||document.documentElement.scrollTop;if(s+t==e){var a=$(".store-goods").length;page=a/d+1,_!=page&&v.test(page)?(o(b,g,f,h,d,page),_=page):layer.msg("已经没有商品了")}})}function l(){$.ajax({type:"post",url:WapSiteUrl+"/api/index.php?act=buyer_favorite&op=add_favorites",data:{mid:FL.mid,token:FL.token,flag:"wap",fid:b,type:"shop"},dataType:"json",success:function(e){e&&"0"===e.error&&(layer.msg("收藏成功"),$("#col_shop").attr("class","uncollect"),$("#col_shop").text("-已收藏"))},error:function(e){},complete:function(e){}})}function c(){$.ajax({type:"post",url:WapSiteUrl+"/api/index.php?act=buyer_favorite&op=delete_favorites",data:{mid:FL.mid,token:FL.token,flag:"wap",fid:b,type:"shop"},dataType:"json",success:function(e){e&&"0"===e.error&&(layer.msg("已取消收藏"),$("#col_shop").attr("class","collect"),$("#col_shop").text("+收藏"))},error:function(e){},complete:function(e){}})}function p(e){if(e&&0==e.error&&0!=e.result.num){e.result.num>99&&(e.result.num="99+");var t='<span class="cart-num">'+e.result.num+"</span>";$("#cart").append(t),"1"==e.result.is_global?$("#cart").prop("href","../shopping/shopping_cart_global.html"):$("#cart").prop("href","../shopping/shopping_cart_cn.html")}}var d=10,u=1,_=0,g=0,h=2,f=3,m=1,y=0,v=/^[-]{0,1}[0-9]{1,}$/,b=GetQueryString("store_id");ImgFormat(),$.ajax({type:"get",url:WapSiteUrl+"/api/index.php?act=buyer_shopping&op=get_store_number",data:{store_id:b,flag:"wap"},dataType:"json",success:function(e){e&&0==e.error&&($("#goods_num").text(e.result.all_goods_number),$("#new_goods_num").text(e.result.new_goods_number))}}),$(".shop_list li").click(function(){var e=this;$(".shop_list li").removeClass(),$(e).attr("class","active");var a=$(e).attr("type");$(".store-goods").remove(),g=0,"index"==a?(t(b,0,0,1,d,u),o(b,g,3,2,d,u,"yes")):"all"==a?($("#store_head").hide(),$("#store_banner").hide(),$("#store_tab").show(),$(".st-nav li").find("a").removeClass("focus-font"),$($(".st-nav li")[0]).find("a").attr("class","focus-font"),$("#store_scroll").attr("class","st-index"),o(b,g,3,2,d,u,"yes")):"new"==a&&($("#store_head").hide(),$("#store_banner").hide(),$("#store_tab").hide(),$("#store_scroll").removeClass(),s(b))}),$(".st-nav li").click(function(){var e=this;$(".store-goods").remove();var t=$(e).attr("num");2==t?($(".st-nav li").find("a").removeClass("focus-font"),$(e).find("a").attr("class","focus-font"),$(e).find("i").hasClass("icon-sort-up")?a(e,"desc"):a(e,"asc")):($(".st-nav li").find("a").removeClass("focus-font"),$(e).find("a").attr("class","focus-font"),h=2,f=t,o(b,g,f,h,d,u,"yes")),_=0}),$("#col_shop").click(function(){FL.judgeLogin(),0==$(".collect").length?c():l()}),FL.getGoodsNum({success:p});var w=function(){this.onLoad=function(){t(b,g,y,m,d,u),r(),o(b,g,3,2,d,u,"yes"),i(),FL.goSearch("#goods_search")}};e.Goods=e.Member||{},Goods.Store=new w}(this);