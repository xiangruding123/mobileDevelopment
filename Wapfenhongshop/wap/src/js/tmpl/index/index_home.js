
$(function() {
	
	layer.load(1, {
		shade: [0.5, '#000000'] //0.1透明度的白色背景
	});
	var regu = /^[-]{0,1}[0-9]{1,}$/; //判断是否是整数;
	var count = 0; //当前商品总数 用来判断是否还要继续加载更多
	var num = 10,
	curpage = 1;	
	ImgFormat();//圖片格式
	
	function headDate(){

        $.ajax({
			type:"get",
			url:WapSiteUrl+"/api/index.php?act=common_index&op=get_navigation",			
			data:{flag:"ios",location:0},
			dataType: 'json',
			success:function(data){			
				if(data.error==0){					
					var html = template('head-tpl',data);
					$('.navbox').html(html);
					console.log(data);
					//  大导航
	                var tabScrool = new IScroll(".f-nav-stickytabs",{scrollX:true,scrollY:false,mouseWheel:true,tab:true});
				    $('.navbox span:first').addClass('curr js-selected');
				    
				    $('.navbox span').click(function(){
				    	var me = this;
				    	$(me).addClass('curr js-selected').siblings('span').removeClass('curr js-selected');
				    	var dataType = $(me).attr('data-url');
				    	var channel_id=getUrl(dataType,"channel_id");
				    	
				    	if(dataType.indexOf('themeType=1')>=0){
				    		$('#page1').show().siblings('section').hide();
				    	}else if(dataType.indexOf('themeType=2')>=0){
				    		$('#page2').show().siblings('section').hide();
				    		channelDate(channel_id);
				    	}else{
				    		$('#page3').show().siblings('section').hide();
				    		$('#page3').find('iframe').attr('src',dataType);
				    		$('#iframepage').height($(window).height()-88);
				    	}
				    	
				    });
				}
			}
		});
	}
	function loadDate(){
		$.ajax({
			type:"get",
			url:WapSiteUrl+"/api/index.php?act=common_index&op=get_index_data",			
			data:{flag:"wap"},
			dataType: 'json',
			success:function(data){			
				if(data.error==0){
					var html = template('page1-tpl',data);
					$('#page1').html(html);
					
					$("img").lazyload({threshold:200});					
					console.log(data);
					
					bindEvent(data);
					
				}
			}
		});
	}
	function channelDate(channel_id){
		$.ajax({
			type:"get",
			url:WapSiteUrl+"/api/index.php?act=buyer_shopping&op=get_channel_data",				
			data:{flag:"wap",channel_id:channel_id},
			dataType: 'json',
			success:function(data){			
				if(data.error==0){
					var html = template('page2-tpl',data);
					$('#page2').html(html);				
					console.log(data);
					
					$("img").lazyload({threshold:200});
					
					bindEventChannel(data,channel_id);
					
				}
			}
		});
	}
	function bindEvent(data){
		//轮播
		var mySwiper = new Swiper('#swiper-index', {
				loop: true,
				effect: 'fade',
				autoplay: 6000,
				// 如果需要分页器
				pagination: '.swiper-pagination',
				autoplayDisableOnInteraction : false
			});
		
		//分红精选
		for(var m =0;m<data.result.zhutiguan.list.length;m++){
			try{
				
				var tabScrool = new IScroll(".f-handpick-bar"+m,{scrollX:true,scrollY:false,mouseWheel:true,tab:true});	
			    
			}catch(e){
				//TODO handle the exception
			}
		}
		
		$('.love-group-goods-price').click(function(){
			var me = this;
              if(!FL.mid){
              	location.href='../login/login.html?goods_id='+goods_id;
              }else{
              	var goods_id=$(me).attr('goods_id'),gc_area=$(me).attr('goods_source'),resource_tags=$(me).attr('resource_tags');
              	var d = {token:FL.token,mid:FL.mid,goods_id:goods_id,store_id:FL.store_id,quantity:1,gc_area:gc_area,resource_tags:resource_tags,flag:"wap"};
              	addShopCar(d);
              }
		});
		
		//bindRefresh();//下拉加载
		
		$(window).scroll(function() {
			var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
			var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
			var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			if (scrollTop + clientHeight == htmlHeight) {
				var showNum = $(".love-group-goods").length; //当前页面显示的个数
				page = showNum / 10 + 1; //上拉加载要显示的页数
				if (count != page && regu.test(page)) {
					likeGoods(page, num);
					count = page;
				} else {
					//  layer.msg("已经没有商品了");
				}
			}
		});
 	
	}
	
	function bindEventChannel(e,d){
		//轮播
		var mySwiper = new Swiper('.swiper-container', {
//				loop: true,
				effect: 'fade',
				autoplay: 6000,
				// 如果需要分页器
				pagination: '.swiper-pagination',
				autoplayDisableOnInteraction : false
			});
		
		//分红精选
		for(var m =0;m<e.result.hot_activities.list.length;m++){
			try{
				
				var tabScrool = new IScroll(".f-hot-bar"+m,{scrollX:true,scrollY:false,mouseWheel:true,tab:true});	
			   
			}catch(e){
				//TODO handle the exception
			}
		}
   	    
   	    //计算图片大小
		var imgwidth =parseInt(($(".hot-floor-goods").width()+30)*0.48)-40;
		$(".hot-floor-goods li img").css({"width":imgwidth+"px","height":imgwidth+"px"});
	}
	
	
	function addShopCar(d){
		
		$.ajax({
            url: WapSiteUrl + '/api/index.php?act=buyer_cart&op=add',
            type: 'get',
            dataType: 'json',

            data:d,

            success: function(data) {
                
                if (data.error==='0') {
                    
                    layer.msg('添加购物车成功');
                   
                    

                }else if(data.error==='0008'){_
                	
                	location.href='../login/login.html?goods_id='+goods_id;
                	
                }
            },
            error:function(xhr){
            	
            }
        });
	}
	
	headDate();
	loadDate();
	

	
	
	
	
	
	
	 
	function likeGoods(curpage,num) {
		$.ajax({
			type: "get",
			url: WapSiteUrl + "/api/index.php?act=buyer_shopping&op=get_goods_scheme",
			data: {
				flag: "wap",
				type: ' jingxuantuijian',
				num: num,				
				curpage:curpage
			},
			dataType: 'json',
			success: function(data) {
				if (data && data.error === '0') {
					var html = template('love-goods-tpl',data);
					$('#page1').append(html);
					$("img").lazyload({threshold:200});
				}
			}
		});
	}
	
	
	
	
	
	
	
		//设置微信分享信息
		var mathNum = Math.floor(Math.random()*2);
		if(mathNum==0){
			var wx_title = '分红全球购-海外直邮，正品保证！';
			var wx_desc = '网罗全球大牌，嗨购全球低价正品，海外直邮，极速达，话费红包天天领！~';
			var friend_title = '分红全球购——购全球·享分红！嗨购全球低价正品，海外直邮极速达，话费红包天天领~';
		}else{
			var wx_title = '分红全球购——中国跨境直购平台！快乐购全球！';
			var wx_desc = '海外直邮，足不出户买遍全球好货，正品、低价！话费红包天天领！~';
			var friend_title = '分红全球购——中国跨境直购平台！众享全球尖货，分销享分红，正品、低价、海外直邮！';
		}
		var wx_link = location.href.split('#')[0];
		var wx_img = 'http://www.fenhongshop.com/wap/images/wap/logo.png';
        
		FL.wxShare(wx_title,wx_desc,wx_link,wx_img,friend_title);
	//购物车数量
	FL.getGoodsNum({success:loadSuccess});
	
	function loadSuccess(data){
		if(data&&data.error==0){
			if(data.result!=0){
				var dom = '<span class="cart-num">'+data.result||0+'</span>';
			    $(".shop-icon").append(dom);
			}
			
		}
	}
	//绑定滚动
	function bindRefresh() {
		$(window).scroll(function() {
			var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
			var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
			var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			if (scrollTop + clientHeight == htmlHeight) {
				var showNum = $(".love-group-goods").length; //当前页面显示的个数
				page = showNum / 10 + 1; //上拉加载要显示的页数
				if (count != page && regu.test(page)) {
					likeGoods(page, num);
					count = page;
				} else {
					//  layer.msg("已经没有商品了");
				}
			}
		});
	}
	var province = getcookie('province');
	if(province==""){
		
		setTimeout(function (){
			FL.getGps();
		},10000);
		
	}

	
	});
	
//新人首次注册登录弹出红包
  var time = GetQueryString("time");
	  if(time =="first"){
	  	 $("body").append('<div class="loading-shade"></div>');
	  	 var html = '<div class="new-packet-img animated fadeInDown">'
	            	+'<img class="new-packet-x" id="close-x" src="../../images/red-packet/x.png"/>'
					+' <button class="button btn1">马上使用</button>'
					+' <button class="button btn2">查看优惠卷</button>'
				    +'</div>';
	  	 $("body").append(html);
	  	 $("#close-x").click(function(){
	  	 	$(".new-packet-img").remove();
	  	 	$(".loading-shade").remove();
	  	 });
  }

