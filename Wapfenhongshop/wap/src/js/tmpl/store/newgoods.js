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
		store_id = GetQueryString("store_id");
		
		ImgFormat();//图片格式
		//店铺首页
		function loadStore(store_id){
			$.ajax({
				type: "get",
				url: WapSiteUrl + "/api/index.php?act=buyer_shopping&op=get_store_home_info",
				data: {store_id:store_id,mid:FL.mid,flag: "wap"},
				dataType: 'json',
				success: function(data) {
					if(data&&data.error==0){
						console.log(data);
							//设置微信分享信息
							var wx_title = data.result.store_name;
							var wx_desc = '这家店铺的商品品质可靠、物美价廉、快来看看吧！';
							var wx_link = location.href.split('#')[0];
							var wx_img = data.result.store_avatar||data.result.store_label;
					        
							FL.wxShare(wx_title,wx_desc,wx_link,wx_img);
					}
				}
			});
		}
	
		//加载上新的商品
		function loadNewGoods(store_id){
			$.ajax({
				type: "get",
				url: WapSiteUrl + "/api/index.php?act=buyer_shopping&op=get_store_new_goods",
				data: {store_id:store_id,flag:"wap"},
				dataType: 'json',
				success: function(data) {
					if(data&&data.error==0){
						var newHtml = template.render('newGoods', data);
						$("#goods_list").empty();
						$("#goods_list").append(newHtml);
						
						//计算图片大小
						var imgwidth = parseInt(($(".container").width()+30)*0.49);
						$(".store-list img").css({"height": imgwidth + "px"});
						$('.data-pic').css({"height":"auto"});
						$("#goods_list img").lazyload({ threshold : 200 });
					}else{
						$('.adr-header').removeClass('hide');
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
		
		
		
		
		
		var Store = function(){
			this.onLoad = function(){
				loadStore(store_id);
				loadNewGoods(store_id);
				windowScroll();
			}
		}
		Global.Goods = Global.Member||{};
		Goods.Store = new Store(); 

}(this);

