!function(t){function i(){$("title,.header-title").text(p),e("yes",r,d,c,s,f,y)}function e(t,i,e,a,n,o,s){$.ajax({url:WapSiteUrl+"/api/index.php?act=buyer_activity&op=get_activity_goods",type:"get",dataType:"json",data:{num:n,curpage:a,flag:"wap",order:i,sort:e,type:activity_type,activity_id:o,class_id:s},success:function(i){if(i&&"0"===i.error){var e=template.render("brandDetails",i);"yes"==t&&$(".brand_details_list li").remove(),$(".pullUp").before(e);var a=parseInt($(".brand_details_list li").width());$(".brand_details_list img").css({width:a+"px",height:a+"px"}),$("#brand_details img").lazyload({threshold:200})}}})}function a(){$(".nav li").click(function(){var t=this,i=$(t).attr("num");3==i?($(".nav li").find("a").removeClass("focus-font"),$(t).find("a").attr("class","focus-font"),$(t).find("i").hasClass("icon-sort-up")?n(t,"desc"):n(t,"asc")):($(".nav li").find("a").removeClass("focus-font"),$(t).find("a").attr("class","focus-font"),d=i,e("yes",2,i,1,10,f,y)),l=0})}function n(t,i){"desc"==i?($(t).find("i").attr("class","icon-sort-down"),r=2,d=3,e("yes",r,d,c,s,f,y)):($(t).find("i").attr("class","icon-sort-up"),r=1,d=3,e("yes",r,d,c,s,f,y))}function o(){$(window).scroll(function(){var t=document.body.scrollHeight||document.documentElement.scrollHeight,i=document.body.clientHeight||document.documentElement.clientHeight,a=document.body.scrollTop||document.documentElement.scrollTop;if(a+i==t){var n=$(".brand_details_list li").length;page=n/s+1,l!=page&&u.test(page)?(e("no",r,d,page,s,f,y),l=page):layer.msg("已经没有商品了")}})}var s=10,c=1,l=0,r=2,d=1,u=/^[-]{0,1}[0-9]{1,}$/;ImgFormat();var f=GetQueryString("activity_id"),p=GetQueryString("activity_title");activity_type="guojiaguan";var y=GetQueryString("class_id"),g=function(){this.onLoad=function(){i(),o(),a()}};t.Goods=t.Goods||{},Goods.BrandDetails=new g}(this);