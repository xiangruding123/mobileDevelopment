!function(a){function t(){var a=10,t=1,i=(GetQueryString("class_parent_id"),GetQueryString("class_id"));e(i),r(i),s(i,"",t,a)}function e(a){$.ajax({url:WapSiteUrl+"/api/index.php?act=buyer_groupbuy&op=get_groupbuy_class_slides",type:"get",dataType:"json",data:{flag:"wap",class_id:a},success:function(a){if(a&&"0"===a.error){var t=template.render("swiper-tpl",a);$(".swiper-container").html(t);new Swiper(".swiper-container",{autoplay:6e3,autoplayDisableOnInteraction:!1})}}})}function r(a){$.ajax({url:WapSiteUrl+"/api/index.php?act=buyer_groupbuy&op=get_groupbuy_class",type:"get",dataType:"json",data:{flag:"wap",class_parent_id:a},success:function(t){if(t&&"0"===t.error){var e=template.render("nav_tabs",t),r='<li class="tab" class_id="" class_parent_id="'+a+'"><a>'+l+"</a>";$("#tabsList").html(e),$("#tabs ul").prepend(r),$($(".tab")[0]).attr("class","tab active"),i(),n()}},error:function(a){}})}function s(a,t,e,r){$.ajax({url:WapSiteUrl+"/api/index.php?act=buyer_groupbuy&op=get_groupbuy_goods_list",type:"get",dataType:"json",data:{flag:"wap",num:r,curpage:e,class_id:a,s_class_id:t},success:function(a){if(a&&"0"===a.error){var t=template.render("groupList",a);$("#group_list").html(t),$("#group_list img").lazyload({threshold:200})}else a&&4==a.error&&$("#group_list").empty()}})}function i(){$(".tab").click(function(){var a=this,t=$(a).attr("class_id"),e=$(a).attr("class_parent_id");s(e,t,1,10),$(".tab").attr("class","tab"),$(a).attr("class","tab active")})}function n(){var a=.25*($(".container").width()+30),t=$("#tabs li").length,e=a*t;if(e>$(".container").width()+30){$("#tabs").append('<i class="icon-angle-right rg-arrow"></i>'),$(".navbar-nav").attr("style","width:"+e+"px"),$($(".navbar-nav").find("li")).attr("style","width:"+a+"px");new IScroll("#tabs",{scrollX:!0,scrollY:!1,mouseWheel:!0,tab:!0})}}var l=GetQueryString("class_name"),o=function(){this.onLoad=function(){t()}};a.Goods=a.Member||{},Goods.GroupDetails=new o}(this);