!function(t){function e(){o(p),i(p,1,10,"",1,2,1)}function o(t){$.ajax({type:"get",url:WapSiteUrl+"/api/index.php?act=buyer_discovery&op=get_shop_info",data:{flag:"wap",shop_id:t,mid:FL.mid},dataType:"json",success:function(t){if(t&&"0"===t.error){var e=template.render("wdDetails",t);$(".dcr-bg").html(e),t.result.if_collected&&1==t.result.if_collected&&$("#add_favorite").find("i").attr("class","icon-heart mr5 focus-font"),$(".header-title").text(t.result.shop_name),n();var o=t.result.shop_name,i="我发现一个很有意思的小店，快来看看吧！",r=location.href.split("#")[0],a=t.result.shop_logo||t.result.shop_banner;FL.wxShare(o,i,r,a)}},error:function(t){}})}function i(t,e,o,i,n,r,a){$.ajax({type:"get",url:WapSiteUrl+"/api/index.php?act=buyer_discovery&op=get_shop_goods",data:{flag:"wap",shop_id:t,curpage:e,num:o,cid:i,sort:n,order:r},dataType:"json",success:function(t){if(t&&"0"===t.error){var e=template.render("wdGoods",t);2==a?$("#wd_goods").append(e):$("#wd_goods").html(e)}var o=parseInt(.49*($(".container").width()+30));$(".tm-imgList").css({height:o+"px"}),$("img").lazyload({threshold:200})},error:function(t){}})}function n(){$("#goods_class").click(function(){$(".drc-dialog").toggle()}),$(".tab").click(function(){var t=this,e=$(t).attr("wclass_id");i(p,1,10,e,1,2,1),$(".drc-dialog").hide(),d=0})}function r(t){$.ajax({type:"post",url:WapSiteUrl+"/api/index.php?act=buyer_favorite&op=add_favorites",data:{mid:FL.mid,token:FL.token,flag:"wap",fid:p,type:"microshop"},dataType:"json",success:function(e){e&&"0"===e.error&&(t.attr("class","icon-heart mr5 focus-font"),layer.msg("收藏成功"))},error:function(t){},complete:function(t){}})}function a(t){$.ajax({type:"post",url:WapSiteUrl+"/api/index.php?act=buyer_favorite&op=delete_favorites",data:{mid:FL.mid,token:FL.token,flag:"wap",fid:p,type:"microshop"},dataType:"json",success:function(e){e&&"0"===e.error&&(t.attr("class","icon-heart-empty mr5"),layer.msg("已取消收藏"))},error:function(t){},complete:function(t){}})}function c(t){if(0!=t.result.num){t.result.num>99&&(t.result.num="99+");var e='<span class="cart-num">'+t.result.num+"</span>";$("#cart").append(e),"1"==t.result.is_global?$(".shoppingurl").prop("href","../shopping/shopping_cart_global.html"):$(".shoppingurl").prop("href","../shopping/shopping_cart_cn.html")}}function s(){$("#add_favorite").click(function(){var t=this;FL.judgeLogin();var e=$(t).find("i");0==$(".icon-heart-empty").length?a(e):r(e)}),$(window).scroll(function(){var t=document.body.scrollHeight||document.documentElement.scrollHeight,e=document.body.clientHeight||document.documentElement.clientHeight,o=document.body.scrollTop||document.documentElement.scrollTop;if(o+e==t){var n=$(".li-goods").length;page=n/10+1,d!=page&&l.test(page)?(i(p,page,10,"",1,2,2),d=page):layer.msg("已经没有商品了")}})}var p=GetQueryString("shop_id"),l=/^[-]{0,1}[0-9]{1,}$/,d=0;FL.getGoodsNum({success:c});var u=function(){this.onLoad=function(){e(),s()}};t.Activity=t.Activity||{},Activity.DiscoverDetails=new u}(this);