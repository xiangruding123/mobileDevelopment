!function(e){function o(e){$.ajax({type:"get",url:WapSiteUrl+"/api/index.php?act=buyer_shopping&op=get_store_home_info",data:{store_id:e,mid:FL.mid,flag:"wap"},dataType:"json",success:function(e){if(e&&0==e.error){console.log(e);var o=e.result.store_name,t="这家店铺的商品品质可靠、物美价廉、快来看看吧！",a=location.href.split("#")[0],s=e.result.store_avatar||e.result.store_label;FL.wxShare(o,t,a,s)}}})}function t(e){$.ajax({type:"get",url:WapSiteUrl+"/api/index.php?act=buyer_shopping&op=get_store_new_goods",data:{store_id:e,flag:"wap"},dataType:"json",success:function(e){if(e&&0==e.error){var o=template.render("newGoods",e);$("#goods_list").empty(),$("#goods_list").append(o);var t=parseInt(.49*($(".container").width()+30));$(".store-list img").css({height:t+"px"}),$(".data-pic").css({height:"auto"}),$("#goods_list img").lazyload({threshold:200})}else $(".adr-header").removeClass("hide")}})}function a(){$(window).scroll(function(){var e=document.body.scrollHeight||document.documentElement.scrollHeight,o=document.body.clientHeight||document.documentElement.clientHeight,t=document.body.scrollTop||document.documentElement.scrollTop;if(t+o==e){var a=$(".store-goods").length;page=a/s+1,n!=page&&d.test(page)?(loadAllGoods(c,r,l,i,s,page),n=page):layer.msg("已经没有商品了")}})}var s=10,n=0,r=0,i=2,l=3,d=/^[-]{0,1}[0-9]{1,}$/,c=GetQueryString("store_id");ImgFormat();var p=function(){this.onLoad=function(){o(c),t(c),a()}};e.Goods=e.Member||{},Goods.Store=new p}(this);