!function(o){function t(){$.ajax({type:"get",url:WapSiteUrl+"/api/index.php?act=buyer_groupbuy&op=get_groupbuy_class",data:{flag:"wap"},dataType:"json",success:function(o){if(o&&"0"===o.error){var t=template.render("groups",o);$(".group-list").remove(),$("#group_lists").append(t),$("#group_lists img").lazyload({threshold:200})}},error:function(o){}})}function n(){$(".goback").click(function(){location.replace("../index/index.html")})}var e=function(){this.onLoad=function(){t(),n()}};o.Goods=o.Goods||{},Goods.GroupList=new e}(this);