!function(t){function o(){$.ajax({type:"get",url:WapSiteUrl+"/api/index.php?act=common_goods&op=get_bundling_combo",data:{flag:"wap",goods_id:a},dataType:"json",success:function(t){if(t&&0==t.error){var o=template("coupon_tpl",t);$("#goods_coupon_list").html(o),$(".navbar-nav img").lazyload(),n()}}})}function n(){$(".suit").each(function(t){that=$(this);var o=.5*($(".container").width()+30);o=160;var n=that.find("li").length,a=o*n;if(a>$(".container").width()+30){that.find(".navbar-nav").attr("style","width:"+a+"px"),$(that.find(".navbar-nav").find("li")).attr("style","width:"+o+"px");new IScroll("#t-tabs-"+t,{scrollX:!0,scrollY:!1,mouseWheel:!0})}}),$(".navbar-nav li:last-child").find("span").remove()}var a=GetQueryString("goods_id"),i=function(){this.onLoad=function(){o()}};t.Goods=t.Goods||{},Goods.goodsCouponDetail=new i}(this);