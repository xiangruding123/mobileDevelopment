$(function() {
	layer.load(1, {
		shade: [0.5, '#000000'] //0.1透明度的白色背景
	});
	var regu = /^[-]{0,1}[0-9]{1,}$/; //判断是否是整数;
	var count = 0; //当前商品总数 用来判断是否还要继续加载更多
	var num = 7,
	curpage = 1;
	var area = 1;
	ImgFormat();
	//加载首页轮播图
	$.ajax({
		type: "get",
		url: WapSiteUrl + "/api/index.php?act=common_index&op=get_slides",
		data: {
			flag: "wap",
			type: "quanqiugou"
		},
		dataType: 'json',
		success: function(data) {

			var html = template.render('swiper-tpl', data);
			$("#swiper-wrapper").append(html);
			var mySwiper = new Swiper('.swiper-container', {
				loop: true,
				effect: 'fade',
				autoplay: 6000,
				// 如果需要分页器
				pagination: '.swiper-pagination'
			});
		}
	});
	//点击搜索跳转页面
	FL.goSearch('#goods_search');
	
	
	$("#classify").toggle(function(){
		$("#classify_one").show();
		$("#classify_two").show();
		FL.addWhiteShade();
		$("body").css("overflow","hidden");
		$(".loading-white-shade").click(function(){
			$("#classify_one").hide();
			$("#classify_two").hide();
			FL.removeWhiteShade();
			$("body").css("overflow","auto");
		});
	},function(){
		$("#classify_one").hide();
		$("#classify_two").hide();
		FL.removeWhiteShade();
		$("body").css("overflow","auto");
	});
	//加载海外产品分类
	FL.goodsClass(0,area,{success:loadSuccess});
	
	function loadSuccess(data){
		if(data&&data.error==0){
			var html = template.render('classifyOne',data);
			$("#classify_one").html(html);
			loadSecond(data.result[0].gc_id,area);
			$($(".one-li")[0]).addClass("activity");
			bindClick();
			//查询二级分类
		}
	}
	function bindClick(){
		$(".one-li").click(function(){
			var me = this;
			var gc_id = $(me).attr("gc_id");
			$(me).addClass("activity").siblings().removeClass("activity");
			loadSecond(gc_id,area);
		});
	}
	//加载2级菜单
	function loadSecond(gc_id,area){
		$.ajax({
			type:'get',
       	    url:WapSiteUrl+'/api/index.php?act=common_goods&op=get_goods_class',
       	    data:{pid:gc_id,area:area,flag:"wap"},
       	    global:false,
       	    dataType:'json',
       	    success:function(data){
       	    	if(data&&data.error==0){
					var html = template.render('classifyTwo',data);
					$("#classify_two").html(html);
				}
       	    }
       	   
		})
		
	}
	//加载团购推荐列表
	$.ajax({
		type: "get",
		url: WapSiteUrl + "/api/index.php?act=buyer_groupbuy&op=get_groupbuy_class",
		data: {
			flag: "wap",
			recommend: 1,
			area:area,
			num: 3
		},
		dataType: 'json',
		success: function(data) {
			if(data&&data.error==0){
				var html = template.render('group_list', data);
				$("#group").empty();
				$("#group").append(html);
				$("#group img").lazyload();
			}else{
				$("#group").hide();
			}
		}
	});
	
	//加载国家馆
	$.ajax({
		type: "get",
		url: WapSiteUrl + "/api/index.php?act=buyer_activity&op=get_activity_list",
		data: {
			type: "guojiaguan",
			channel: 2,
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
			channel: 2,
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
			area :area,
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
		data: {type:"quanqiugou",flag:"wap"},
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
	var mySwiper = new Swiper('.swiper-contain', {
		slidesPerView: 3,
		centeredSlides: true,
	
	});
	
	function likeGoods(curpage,num) {
		$.ajax({
			type: "get",
			url: WapSiteUrl + "/api/index.php?act=buyer_shopping&op=get_goods_scheme",
			data: {
				flag: "wap",
				type: 'cainixihuan',
				num: num,
				area :area,
				curpage: curpage
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
	
	likeGoods(curpage,num); 
	bindRefresh();
	});