!function(e,t,a){function i(){k&&(e(e(".navbox li")[k]).addClass("selected").siblings("li").removeClass("selected"),e(".tableChange").hide(),e(e(".tableChange")[k]).show()),n(k),e(".navbox li").click(function(){var t=this,a=e(t).attr("tab");e(t).addClass("selected").siblings("li").removeClass("selected"),e(".tableChange").hide(),""==e(e(".tableChange")[a]).text()&&n(a),e(e(".tableChange")[a]).show(),"1"==a&&c(),e(".media_l").hide(),e("footer").hide()}),d(),e("#history").on("click",".single",p),e("#history").on("click",".all",h)}function n(e){0==e?o("goods","goods-tpl","#product-collect"):1==e?o("shop","shop-tpl","#shop-collect"):2==e?o("microshop","microshop-tpl","#microshop-collect"):3==e?o("talent","talent-tpl","#talent-collect"):4==e?o("time","time-tpl","#time-collect"):5==e&&s("library-tpl","#library-collect")}function o(t,a,i){e.ajax({type:"post",url:WapSiteUrl+"/api/index.php?act=buyer_favorite&op=get_favorites_list",data:{flag:"wap",token:g,mid:b,type:t,num:u,curpage:m},dataType:"json",success:function(t){if(t&&"0"===t.error){var n=template.render(a,t);e(i).append(n),c()}}})}function s(t,a){e.ajax({type:"post",url:WapSiteUrl+"/api/index.php?act=buyer_browse&op=get_browse_list",data:{flag:"wap",token:g,mid:b,num:u,curpage:m},dataType:"json",success:function(i){if(i&&"0"===i.error){var n=template.render(t,i);e(a).append(n)}}})}function l(t,a,i){e.ajax({type:"post",url:WapSiteUrl+"/api/index.php?act=buyer_favorite&op=delete_favorites",data:{flag:"wap",token:g,mid:b,fid:t,type:a},dataType:"json",success:function(t){t&&"0"===t.error&&(e(i).remove(),layer.msg("删除成功"))}})}function r(t,a,i){"alldel"==i?res={flag:"wap",token:g,mid:b,delall:1}:res={flag:"wap",token:g,mid:b,id:t},e.ajax({type:"post",url:WapSiteUrl+"/api/index.php?act=buyer_browse&op=delete_browse",data:res,dataType:"json",success:function(t){t&&"0"===t.error&&(e(a).remove(),layer.msg("删除成功"))}})}function c(){var t=.3*e(".swiper-container").width()+10;e(".swiper-container").each(function(a){var i=e(this).find("li").length,n=t*i;if(n>e(".swiper-container").width()){e(this).find(".swiper-wrapper").attr("style","width:"+n+"px"),e(".img-single").attr("style","width:"+t+"px"),e(e(".img-single").find("img")).each(function(){e(this).css("height",e(this).offsetWidth+"px")});new IScroll("#t_tabs_"+a,{scrollX:!0,scrollY:!1,mouseWheel:!0,click:!0})}})}function d(){e("img.icon_edit").click(function(){var t=e(".selected").attr("tab"),a=e(e(".tableChange")[t]).find(".media_l");a.is(":hidden")?(a.show(),e("footer").show()):(a.hide(),e("footer").hide())})}function p(){var t=this;if(e(t).hasClass("icon-circle-blank")){e(t).attr("class","single icon-ok-sign"),e(t).parents(".tableChange").find("footer button").css("background-color","#fa2855");var a=e(t).parents(".tableChange").find(".media").length,i=e(t).parents(".tableChange").find(".media").find("i.icon-ok-sign").length;a==i&&e("footer i").attr("class","icon-ok-sign");var n,o=e(t).parents("section.tableChange").attr("tab");"0"==o||"5"==o?n="goods_id":"1"==o?n="store_id":"2"==o?n="shop_id":"3"==o?n="talent_id":"4"==o&&(n="time_id");var s=[],l=e(t).parents(".tableChange").find(".media").find("i.icon-ok-sign").parents(".media"),r=e(t).parents(".tableChange").find(".media").index();s[r]=e(t).parents(".media").attr(n);var c=s.join(",");f(c,l)}else e(t).parents(".media").siblings(".media").find("i.icon-ok-sign").length<=0&&e(t).parents(".tableChange").find("footer button").css("background-color","#999"),e(t).attr("class","single icon-circle-blank"),e("footer i").attr("class","icon-circle-blank")}function h(){var t,a=this,i=e(a).parents("section.tableChange").attr("tab");if("0"==i||"5"==i?t="goods_id":"1"==i?t="store_id":"2"==i?t="shop_id":"3"==i?t="talent_id":"4"==i&&(t="time_id"),e(a).hasClass("icon-circle-blank")){e(a).attr("class","icon-ok-sign all"),e(a).parents(".tableChange").find("footer button").css("background-color","#fa2855"),e(a).parents(".tableChange").find(".media").find("i").attr("class","icon-ok-sign single");var n=[],o=e(a).parents(".tableChange").find(".media").find("i.icon-ok-sign").parents(".media"),s=e(a).parents(".tableChange").find(".media").index();n[s]=e(a).parents(".media").attr(t);var l=n.join(",");f(l,o,"alldel")}else e(a).parents(".tableChange").find("footer button").css("background-color","#999"),e(a).attr("class","icon-circle-blank all"),e(a).parents(".tableChange").find(".media").find("i").attr("class","icon-circle-blank single")}function f(t,a,i){e("#history").on("click",".delHis",function(){var n=this,o=e(n).parents(".tableChange").attr("tab");"0"==o?l(t,"goods",a):"1"==o?l(t,"shop",a):"2"==o?l(t,"microshop",a):"3"==o?l(t,"talent",a):"4"==o?l(t,"time",a):"5"==o&&r(t,a,i)})}var g=getcookie("token"),b=getcookie("mid"),u=10,m=1,k=GetQueryString("index");new IScroll(".f-nav-stickytabs",{scrollX:!0,scrollY:!1,mouseWheel:!0,tab:!0});i()}($,window,document);