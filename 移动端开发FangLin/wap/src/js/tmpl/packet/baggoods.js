/*************店铺*****************/
!function(Global) {
		var num =10,
		curpage=1,
		count = 0,
		stc_id=0,
		order_num=2,//排序规则(商城商品用)
		sort_num=3,
		s_order_num=1,//店铺首页用
		s_sort_num=0,
		regu = /^[-]{0,1}[0-9]{1,}$/,//判断是否是整数;
		store_id = GetQueryString("store_id"),
		stc_id=GetQueryString('stc_id'),
		coupon_type=GetQueryString('coupon_type');
		
		var ss = navigator.userAgent.toLowerCase();


		if (ss.indexOf("fhmall_android") > 0||ss.indexOf("fhmall_ios") > 0) {
			
		} else {
			$('.fh-header').removeClass('none');
		}
		
		if(coupon_type=="person"){
			store_id=325778;
		}
		
		ImgFormat();//图片格式
		
		//加载店铺所有商品
		function loadAllGoods(store_id,stc_id,sort,order,num,curpage,type){
			$.ajax({
				type: "get",
				url: WapSiteUrl + "/api/index.php?act=common_goods&op=get_goods_list",
				data: {sid:store_id,scid:stc_id,sort:sort,order:order ,num: num,curpage: curpage,flag: "wap",from:"baggoods"},
				dataType: 'json',
				success: function(data) {
					if(data&&data.error==0){
						
						template.helper('parseFloat', parseFloat);
						var goodsHtml = template.render('storeGoods', data);
						if(type=="yes"){
							$("#goods_list").empty();
						}
						$("#goods_list").append(goodsHtml);
						//计算图片大小
						var imgwidth = parseInt(($(".container").width()+30)*0.49);
						$(".store-list img").css({"height": imgwidth + "px"});
						$("#goods_list img").lazyload({ threshold : 200 });
					
					}
				}
			});
		}
		
		
		
	    
	
		function windowScroll(){
			$(window).scroll(function(){
		        var htmlHeight=document.body.scrollHeight||document.documentElement.scrollHeight;  
		        var clientHeight=document.body.clientHeight||document.documentElement.clientHeight;  
		        var scrollTop=document.body.scrollTop||document.documentElement.scrollTop;  
		        if(scrollTop+clientHeight==htmlHeight){  
		        	var showNum = $(".store-goods").length;//当前页面显示的个数
					page = showNum/num + 1; //上拉加载要显示的页数
					if(count != page && regu.test(page)){
						loadAllGoods(store_id,stc_id,sort_num,order_num,num,page);
						count = page;
					}else{
	                    layer.msg("已经没有商品了");
					}
		        }  
		    })  
	   }
		
		
		
		//加载下方商品
        loadAllGoods(store_id,stc_id,3,2,num,curpage,"yes");
		windowScroll();
		

}(this);

