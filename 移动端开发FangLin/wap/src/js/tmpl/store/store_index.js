/*************原店铺*****************/
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
							$("#store_scroll").removeClass();
							var store_info = data.result;
							$(".head").css("background-image","url("+store_info.store_banner+")");
							$("#store_logo").attr("src",store_info.store_avatar);
							$("#store_name").text(store_info.store_name);
							//判断是否收藏
							if(data.result.is_collected&&data.result.is_collected==1){
								$("#col_shop").attr("class","uncollect");
	       	    				$("#col_shop").text("-已收藏");
							}
							//加载首页banner
							var html = template.render('storeBanner', data.result);
							$("#store_banner").html(html);
							var mySwiper = new Swiper('.swiper-container', {
								loop: true,
								autoplay: 6000,
								pagination : '.swiper-pagination',
								autoplayDisableOnInteraction : false
							});
							$("#store_tab").hide();
							$("#store_head").show();
							$("#store_banner").show();
							 //百度商桥
			                if(data.result.store_baidusales){
			                	$('.store_baidusales').click(function(){			                		
			                		location.href='../shopping/store_baidusales.html?store_baidusales='+data.result.store_baidusales;
			                	});
			                }else{
			                	$('.store_baidusales').click(function(){
			                		layer.msg('商家不在线，请稍后联系');
			                	});
			                }
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
						$("#goods_list img").lazyload({ threshold : 200 });
					}
				}
			});
		}
		//获取商品总数和上新总数
		$.ajax({
			type: "get",
			url: WapSiteUrl + "/api/index.php?act=buyer_shopping&op=get_store_number",
			data: {store_id:store_id,flag:"wap"},
			dataType: 'json',
			success: function(data) {
				if(data&&data.error==0){
					$("#goods_num").text(data.result.all_goods_number);
					$("#new_goods_num").text(data.result.new_goods_number);
				}
			}
		});
		//tab页切换事件
		$(".shop_list li").click(function(){
			var me = this;
			$(".shop_list li").removeClass();
			$(me).attr("class","active");
			var type = $(me).attr("type");
			$(".store-goods").remove();
			stc_id = 0;
			if(type=="index"){
				loadStore(store_id,0,0,1,num,curpage);
				loadAllGoods(store_id,stc_id,3,2,num,curpage,"yes");
			}else if(type=="all"){
				$("#store_head").hide();
				$("#store_banner").hide();
				$("#store_tab").show();
				$(".st-nav li").find("a").removeClass("focus-font");
    			$($(".st-nav li")[0]).find("a").attr("class","focus-font");
				$("#store_scroll").attr("class","st-index");
				loadAllGoods(store_id,stc_id,3,2,num,curpage,"yes");
			}else if(type=="new"){
				$("#store_head").hide();
				$("#store_banner").hide();
				$("#store_tab").hide();
				$("#store_scroll").removeClass();
				loadNewGoods(store_id);
			}
		});
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
	    //获取店铺分类
	    function getStoreClass(){
	    	$.ajax({
				type: "get",
				url: WapSiteUrl + "/api/index.php?act=buyer_shopping&op=get_store_class",
				data: {store_id:store_id,flag:"wap"},
				dataType: 'json',
				success: function(data) {
					var html = template.render('storeClass', data);
					$("#store_class").html(html);
					chooseClass();//绑定分类点击事件
				}
			});
	    }
	    //点击选择商品分类、
		function chooseClass(){
			$("#goods_class").click(function(){
				$(".drc-dialog").toggle();
			});
			$(".tab").click(function(){
				var me = this;
				$(".store-goods").remove();
				var new_stc_id = $(me).attr("stc_id");
				$($(".shop_list li")[1]).trigger("click");
				$("#store_head").hide();
				$("#store_banner").hide();
				$("#store_tab").show();
				$("#store_scroll").attr("class","st-index");
				loadAllGoods(store_id,new_stc_id,3,2,num,curpage,"yes");
				$(".drc-dialog").hide();
			//	addRefresh("all");
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
		
		//收藏点击
		$("#col_shop").click(function(){
			var me = this;
			FL.judgeLogin();
			if($(".collect").length==0){
				delFavShop();
			}else{
				addFavShop();
			}
		});
		
		//收藏店铺
		function addFavShop(){
			$.ajax({
				type:'post',
	       	    url:WapSiteUrl+'/api/index.php?act=buyer_favorite&op=add_favorites',
	       	    data:{mid:FL.mid,token:FL.token,flag:"wap",fid:store_id,type:"shop"},
	       	    dataType:'json',
	       	    success:function(data){
	       	    	if(data&&data.error==="0"){
	       	    		layer.msg("收藏成功");
	       	    		$("#col_shop").attr("class","uncollect");
	       	    		$("#col_shop").text("-已收藏");
	       	    	}
	       	    },
	       	    error:function(xhr){
	       	    	
	       	    },
	       	    complete:function(xhr){
	       	    	
	       	    }
			});
		}
		//取消收藏店铺
		function delFavShop(){
			$.ajax({
				type:'post',
	       	    url:WapSiteUrl+'/api/index.php?act=buyer_favorite&op=delete_favorites',
	       	    data:{mid:FL.mid,token:FL.token,flag:"wap",fid:store_id,type:"shop"},
	       	    dataType:'json',
	       	    success:function(data){
	       	    	if(data&&data.error==="0"){
	       	    		layer.msg("已取消收藏");
	       	    		$("#col_shop").attr("class","collect");
	       	    		$("#col_shop").text("+收藏");
	       	    	}
	       	    },
	       	    error:function(xhr){
	       	    	
	       	    },
	       	    complete:function(xhr){
	       	    	
	       	    }
			});
		}
	 		//获取购物车数量
		FL.getGoodsNum({success:loadSuccess});
		
		function loadSuccess(data){
			if(data&&data.error==0){							
				if(data.result.num!=0){
					if(data.result.num>99){
						data.result.num="99+";
					}
					var dom = '<span class="cart-num">'+data.result.num+'</span>';
				    $("#cart").append(dom);
					if(data.result.is_global=='1'){
						$('#cart').prop('href','../shopping/shopping_cart_global.html');
					}else{
						$('#cart').prop('href','../shopping/shopping_cart_cn.html');
					}
			    }
			}
		}
		var Store = function(){
			this.onLoad = function(){
				loadStore(store_id,stc_id,s_sort_num,s_order_num,num,curpage);
				getStoreClass();
				//加载下方商品
				loadAllGoods(store_id,stc_id,3,2,num,curpage,"yes");
				windowScroll();
				// 点击搜索跳转到商品列表
	  		    FL.goSearch("#goods_search"); 
			}
		}
		Global.Goods = Global.Member||{};
		Goods.Store = new Store(); 

}(this);

