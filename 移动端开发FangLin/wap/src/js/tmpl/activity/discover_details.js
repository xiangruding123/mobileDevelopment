/*************微店商品*****************/
!function(Global) {
	var shop_id = GetQueryString("shop_id");
	var regu = /^[-]{0,1}[0-9]{1,}$/;//判断是否是整数;
	var count = 0;//当前商品总数 用来判断是否还要继续加载更多
	function loadData(){
		//FL.getCartGoodsNum(FL.mid,FL.token,{success:doSuccess})
		getwd(shop_id);
		getwdGoods(shop_id,1,10,"",1,2,1);
	}
	//获取购物车数量
	function doSuccess(data){
		var dom = '<span class="num-icon">'+data.total+'</span>';
		$("#shopping_cart").append(dom);
	}
	//获取微店信息
	function getwd(shop_id){
		$.ajax({
		
			type:'get',
			
			url:WapSiteUrl+"/api/index.php?act=buyer_discovery&op=get_shop_info",
	
			data:{flag:"wap",shop_id:shop_id,mid:FL.mid},
	
			dataType:'json',
	
			success:function(data){
				if(data&&data.error==="0"){
					var html = template.render("wdDetails",data);
					$(".dcr-bg").html(html);
					if(data.result.if_collected&&data.result.if_collected==1){
						$("#add_favorite").find("i").attr("class","icon-heart mr5 focus-font");
					}
					$(".header-title").text(data.result.shop_name);
					chooseClass();
					//设置微信分享信息
					var wx_title = data.result.shop_name;
					var wx_desc = '我发现一个很有意思的小店，快来看看吧！';
					var wx_link = location.href.split('#')[0];
					var wx_img = data.result.shop_logo||data.result.shop_banner;
			        
					FL.wxShare(wx_title,wx_desc,wx_link,wx_img);
				}
			},
			error:function(xhr) {
	
			}
	
		});
	}
	//获取微店商品列表  type 1:html 2：append
	function getwdGoods(shop_id,curpage,num,cid,sort,order,type){
		$.ajax({
		
			type:'get',
			
			url:WapSiteUrl+"/api/index.php?act=buyer_discovery&op=get_shop_goods",
	
			data:{flag:"wap",shop_id:shop_id,curpage:curpage,num:num,cid:cid,sort:sort,order:order},
	
			dataType:'json',
	
			success:function(data){
				if(data&&data.error==="0"){
					var html = template.render("wdGoods",data);
					if(type==2){
						$("#wd_goods").append(html);
					}else{
						$("#wd_goods").html(html);
					}
					
				}
				//计算图片大小
				var imgwidth = parseInt(($(".container").width()+30)*0.49);
				$(".tm-imgList").css({"height": imgwidth + "px"});
				$("img").lazyload({threshold : 200});
			},
			error:function(xhr) {
	
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
			var cid = $(me).attr("wclass_id");
			getwdGoods(shop_id,1,10,cid,1,2,1);
			$(".drc-dialog").hide();
			count = 0;
		});
	}
	//收藏微店
	function addWd($me){
		$.ajax({
			type:'post',
       	    url:WapSiteUrl+'/api/index.php?act=buyer_favorite&op=add_favorites',
       	    data:{mid:FL.mid,token:FL.token,flag:"wap",fid:shop_id,type:"microshop"},
       	    dataType:'json',
       	    success:function(data){
       	    	if(data&&data.error==="0"){
       	    		$me.attr("class","icon-heart mr5 focus-font");
       	    		layer.msg("收藏成功");
       	    	}
       	    },
       	    error:function(xhr){
       	    	
       	    },
       	    complete:function(xhr){
       	    	
       	    }
		});
	}
	//取消收藏微店
	function delWd($me){
		$.ajax({
			type:'post',
       	    url:WapSiteUrl+'/api/index.php?act=buyer_favorite&op=delete_favorites',
       	    data:{mid:FL.mid,token:FL.token,flag:"wap",fid:shop_id,type:"microshop"},
       	    dataType:'json',
       	    success:function(data){
       	    	if(data&&data.error==="0"){
       	    		$me.attr("class","icon-heart-empty mr5");
       	    		layer.msg("已取消收藏");
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
		if(data.result.num!=0){
			if(data.result.num>99){
				data.result.num="99+";
			}
			var dom = '<span class="cart-num">'+data.result.num+'</span>';
		    $("#cart").append(dom);
			if(data.result.is_global=='1'){
				$('.shoppingurl').prop('href','../shopping/shopping_cart_global.html');
			}else{
				$('.shoppingurl').prop('href','../shopping/shopping_cart_cn.html');
			}
	    }
	}
	function bindEvent(){
		$("#add_favorite").click(function(){
			var me = this;
			FL.judgeLogin();
			var $me = $(me).find("i");
			if($(".icon-heart-empty").length==0){
				delWd($me);
			}else{
				addWd($me);
			}
		});
		$(window).scroll(function(){  
	        var htmlHeight=document.body.scrollHeight||document.documentElement.scrollHeight;  
	        var clientHeight=document.body.clientHeight||document.documentElement.clientHeight;  
	        var scrollTop=document.body.scrollTop||document.documentElement.scrollTop;  
	        if(scrollTop+clientHeight==htmlHeight){  
	        	var showNum = $(".li-goods").length;//当前页面显示的个数
				page = showNum/10 + 1; //上拉加载要显示的页数
				if(count!=page&&regu.test(page)){
					 getwdGoods(shop_id,page,10,"",1,2,2);
					 count = page;
				}else{
                    layer.msg("已经没有商品了");
				}
	        }  
	    })  
	}
	var DiscoverDetails = function(){
		this.onLoad = function(){
			loadData();
			bindEvent();
		}
	}
	Global.Activity = Global.Activity||{};
	Activity.DiscoverDetails = new DiscoverDetails(); 

}(this);

