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
		stc_id=GetQueryString('stc_id');
		
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
							//设置微信分享信息
							var wx_title = data.result.store_name;
							var wx_desc = data.result.share_content;
							var wx_link = location.href.split('#')[0];
							var wx_img = data.result.share_images;
					        
							FL.wxShare(wx_title,wx_desc,wx_link,wx_img);
							
							$(".shareTime").click(function(){
								$('.-mob-share-ui').show();
								FL.share(wx_title,wx_desc,wx_img,wx_link);
							});
							

					}
				}
			});
		}
		//加载店铺所有商品
		function loadAllGoods(store_id,stc_id,sort,order,num,curpage,type){
			$.ajax({
				type: "get",
				url: WapSiteUrl + "/api/index.php?act=common_goods&op=get_goods_list",
				data: {sid:store_id,scid:stc_id,sort:sort,order:order ,num: num,curpage: curpage,flag: "wap"},
				dataType: 'json',
				success: function(data) {
					if(data&&data.error==0){
						
						template.helper('parseFloat', parseFloat);
						var goodsHtml = template.render('goods_list_tpl', data);
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
		
		
		//商品选择tab点击
		$(".st-nav li").click(function(){
    		var me = this;
    		$(".store-goods").remove();
    		var tab_num = $(me).attr("num");
    		if(tab_num==2){
    			$(".st-nav li").find("a").removeClass("focus-font");
    			$(me).find("a").attr("class","focus-font");
    			$(me).find("i").hasClass("icon-sort-up")?sortPrice(me,"desc"):sortPrice(me,"asc");
    		}else{
    			$(".st-nav li").find("a").removeClass("focus-font");
    			$(me).find("a").attr("class","focus-font");
    			order_num= 2;
    			sort_num = tab_num;
    			loadAllGoods(store_id,stc_id,sort_num,order_num,num,curpage,"yes");
    		}
    			count = 0;//切换页面重置count  用来计算上拉加载
    	});
    	function sortPrice(me,method){
	    	if(method=="desc"){
	    		$(me).find('i').attr("class","icon-sort-down");
	    		sort_num= 2;
	    		order_num = 2;
	    	}else{
	    		$(me).find('i').attr("class","icon-sort-up");
	    		sort_num = 2;
	    		order_num= 1;
	    	}
	    	loadAllGoods(store_id,stc_id,sort_num,order_num,num,curpage,"yes");
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
		
		//顶部
	$('.timemore').click(function() {
		var me = this;
		if(!$(me).hasClass('timeup')) {
			$(me).addClass('timeup');
			$('.updownlog').show();
		} else {
			$(me).removeClass('timeup');
			$('.updownlog').hide();
		}
	});

		$('.classAll').click(function(){
			location.href = 'store_class.html?store_id='+store_id;
		})
		loadStore(store_id);
		//加载下方商品
        loadAllGoods(store_id,stc_id,3,2,num,curpage,"yes");
		windowScroll();
		// 点击搜索跳转到商品列表
		FL.goSearch("#goods_search"); 


}(this);

