!function(o){function t(){$.ajax({type:"get",url:WapSiteUrl+"/api/index.php?act=common_goods&op=get_bundling_combo",data:{flag:"wap",goods_id:e},dataType:"json",success:function(o){if(o&&0==o.error){var t=o.result.bundling[i],e=template("goods_coupon_detail_tpl",t);$("#coupon_list").html(e),$(".media img").lazyload(),n(),$("#addcart").click(function(){var o=t.bl_id;FL.token?a(o):FL.logLogin()})}}})}function n(){var o=parseFloat(i)+1;$(".typenum").text("套装"+o)}function a(o){$.ajax({type:"get",url:WapSiteUrl+"//api/index.php?act=buyer_cart&op=add",data:{flag:"wap",mid:FL.mid,token:FL.token,bl_id:o,store_id:FL.store_id},dataType:"json",success:function(o){o&&0==o.error&&(location.href="../shopping/shopping_cart_cn.html")}})}var i=GetQueryString("typenum"),e=GetQueryString("goods_id"),d=function(){this.onLoad=function(){t()}};o.Goods=o.Goods||{},Goods.goodsCouponDetail=new d}(this);