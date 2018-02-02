$(function() {
	layer.load(1, {
		shade: [0.5, '#000000'] //0.1透明度的白色背景
	});
	var regu = /^[-]{0,1}[0-9]{1,}$/; //判断是否是整数;
	var count = 0; //当前商品总数 用来判断是否还要继续加载更多
	var num = 7,
	curpage = 1;
	var area = 2;
	ImgFormat();//圖片格式

	//获取首页导航按钮
	$.ajax({
		type: "get",
		url: WapSiteUrl + "/api/index.php?act=common_index&op=get_navigation",
		data:{location:1,flag:"wap"},
		dataType: 'json',
		success:function(data){			
			var html = template.render('navBars', data);
			$("#nav_bars").html(html);
					
			$('.nav7').click(function(e){
				if(FL.token){
					if(getcookie('if_shoper')=='0'){
						location.href='../weidian/small_store.html';
					}else if(getcookie('if_shoper')=='1'){
						location.href='../weidian/shopermoney.html';
					}
				}else{
					location.href='../login/login.html';
				}
				e.preventDefault();
			});
		}
	});
	
	//加载首页轮播图
	$.ajax({
		type: "get",
		url: WapSiteUrl + "/api/index.php?act=common_index&op=get_slides",
		data: {
			flag: "wap",
			type: "shouye"
		},
		dataType: 'json',
		success: function(data) {

			var html = template.render('swiper-tpl', data);
			$("#swiper-wrapper").append(html);
			var mySwiper = new Swiper('#swiper-index', {
				loop: true,
				effect: 'fade',
				autoplay: 6000,
				// 如果需要分页器
				pagination: '.swiper-pagination',
				autoplayDisableOnInteraction : false
			});
		//	FL.Aclick();
		}
	});
	//加载公告
	$.ajax({
			type: "get",
			url: WapSiteUrl + "/api/index.php?act=common_article&op=get_article_list",
			data: {
				flag: "wap",
				ac_id: "1",
				num: 5,
				curpage: '1'
			},
			dataType: 'json',
			success: function(data) {

				var html = template.render('affiche-tpl', data);
				$("#affiche .swiper-wrapper").html(html);

				var mySwiper = new Swiper('#affiche', {
						loop: true,
						effect: 'slide',
						autoplay: 6000,
						direction: 'vertical',
						onSetTransition: function(swiper, transiton) {
							//查看详情链接
							$('.detailLink').attr('href', $('#affiche .swiper-slide').eq(swiper.activeIndex).attr('url'));
						}
				});
			}
	});
	//秒杀多商品添加滚动
//	$.ajax({
//		type:"get",
//		url: WapSiteUrl + "/api/index.php?act=buyer_seckilling&op=get_home_seckilling_info",
//		data:{flag:"wap"},
//		dataType:"json",
//		success:function(data){
//			var html = template.render("indexSeckill",data);
//			$("#index_seckill").html(html);
//		}
//	});
//	try{
//		var skScroll = new IScroll("#sk_div",{scrollX:true,scrollY:false,mouseWheel:true,tap:true});
//	}catch(e){
//		
//	}
	
	//加载国家馆
	$.ajax({
		type: "get",
		url: WapSiteUrl + "/api/index.php?act=buyer_activity&op=get_activity_list",
		data: {
			type: "guojiaguan",
			channel: 1,
			num: 4,
			curpage: 1,
			flag: "wap"
		},
		dataType: 'json',
		success: function(data) {
			if(data&&data.error==0){
				var html = template.render('nation_list', data);
				$("#nation").empty();
				$("#nation").append(html);
				$("#nation img").lazyload({ threshold : 200 });
			}else{
				$("#nation").hide();
			}
		}
	});
	//加载主题馆列表
	$.ajax({
		type: "get",
		url: WapSiteUrl + "/api/index.php?act=buyer_activity&op=get_activity_list",
		data: {
			type: "zhutiguan",
			channel: 1,
			num: 3,
			curpage: 1,
			flag: "wap"
		},
		dataType: 'json',
		success: function(data) {
			if(data&&data.error==0){
				var html = template.render('theme_list', data);
				$("#theme").empty();
				$("#theme").append(html);
				$("#theme img").lazyload({ threshold : 200 });
			}else{
				$("#theme").hide();
			}
		}
	});
	//加载品牌馆
	$.ajax({
		type: "get",
		url: WapSiteUrl + "/api/index.php?act=buyer_shopping&op=get_brandhouse_brands",
		data: {
			area: area,
			num: 4,
			curpage: 1,
			flag: "wap"
		},
		dataType: 'json',
		success: function(data) {
			if(data&&data.error==0){
				var html = template.render('brand_list', data);
				$("#brand").empty();
				$("#brand").append(html);
				//计算图片大小
				var imgwidth = parseInt(($(".layout").width())*0.49);
				$(".brand-ul img").css({"height": imgwidth + "px"});
				$("#brand img").lazyload({ threshold : 200 });
			}else{
				$("#brand").hide();
			}
		}
	});
	//加载精选推荐
	$.ajax({
		type: "get",
		url: WapSiteUrl + "/api/index.php?act=buyer_shopping&op=get_goods_scheme",
		data: {
			type: "jingxuantuijian",
			num: 3,
			area:area,
			curpage: 1,
			flag: "wap"
		},
		dataType: 'json',
		success: function(data) {
			if(data&&data.error==0){
				var html = template.render('recommends_list', data);
				$("#recommends").empty();
				$("#recommends").append(html);
				$("#recommends img").lazyload({ threshold : 200 });
			}else{
				$("#recommends").hide();
			}
		}
	});
	//加载广告位
	$.ajax({
		type: "get",
		url: WapSiteUrl + "/api/index.php?act=common_index&op=get_adv_list",
		data: {type:"shouye",flag:"wap"},
		dataType: 'json',
		success: function(data) {
			if(data&&data.error==0){
				if(data.result.length==0){
					$("#adv1").hide();
					$("#adv2").hide();
				}
				for(var i=0;i<data.result.length;i++){
					if(data.result[i].adv_link){
						var href = data.result[i].adv_link.replace(/&amp;/g,"&");
						$("#adv"+(i+1)).attr("href",href);
					}
					$("#adv"+(i+1)).find("img").attr("src",data.result[i].adv_pic);
				}
			}
		}
	});
	
	//猜你喜欢
	function likeGoods(curpage,num) {
		$.ajax({
			type: "get",
			url: WapSiteUrl + "/api/index.php?act=buyer_shopping&op=get_goods_scheme",
			data: {
				flag: "wap",
				type: 'cainixihuan',
				num: num,
				area:area,
				curpage:curpage
			},
			dataType: 'json',
			success: function(data) {
				if (data && data.error === '0') {
					var html = template.render('group-goods-tpl', data);
					$('#group-goods').append(html);
					$("#group-goods img").lazyload({ threshold : 200 });
					$('.group-price .dis').each(function(){
						p = $(this).parents('.group-price');
						a = p.find('.goods_price').text();
						b = p.find('.goods_marketprice').text();
						dis =parseFloat((a/b)*10).toFixed(1);
						$(this).text(dis+'折');
					})
				}
			}
		});
	}
		//设置微信分享信息
		var mathNum = Math.floor(Math.random()*2);
		if(mathNum==0){
			var wx_title = '分红全球购-海外直邮，正品保证！';
			var wx_desc = '网罗全球大牌，嗨购全球低价正品，海外直邮，极速达！~';
			var friend_title = '分红全球购——购全球·享分红！嗨购全球低价正品，海外直邮极速达~';
		}else{
			var wx_title = '分红全球购——中国跨境直购平台！快乐购全球！';
			var wx_desc = '海外直邮，足不出户买遍全球好货，正品、低价！~';
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
				var showNum = $(".group-goods").length; //当前页面显示的个数
				page = showNum / 7 + 1; //上拉加载要显示的页数
				if (count != page && regu.test(page)) {
					likeGoods(page, num);
					count = page;
				} else {
					//  layer.msg("已经没有商品了");
				}
			}
		})
	}
	var province = getcookie('province');
	if(province==""){
		
		setTimeout(function (){
			FL.getGps();
		},10000);
		
	}
	likeGoods(curpage,num); 
	bindRefresh();
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
