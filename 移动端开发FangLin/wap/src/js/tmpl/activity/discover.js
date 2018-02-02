/*************发现列表*****************/
!function(Global) {
	var province = getcookie("province");
	var city = getcookie("city");
	var road = getcookie("road");
		function loadData(){
			$.ajax({
		
				type:'get',
				
				url:WapSiteUrl+"/api/index.php?act=buyer_discovery&op=get_shop_class",
		
				data:{flag:"wap"},
		
				dataType:'json',
		
				success:function(data){
					if(data&&data.error==="0"){
						var html = template.render("discoverList",data);
						$("#discover_list").html(html);
						$("#discover_list img").lazyload({ threshold : 200 });
					}
				},
				error:function(xhr) {
		
				}
		
			});
		}
//		function loadGps(){
//			if(province!=""){
//				$("#gps1").html(unescape(province)+" · "+unescape(city));
//  			$("#gps2").html(unescape(road));
//			}else{
//				FL.getGps();
//			}
//		}

	function getShopSettings(){
		$.ajax({

			type:'get',

			url:WapSiteUrl+"/api/index.php?act=buyer_discovery&op=get_shop_settings",

			data:{flag:"wap",mid:FL.mid},

			dataType:'json',

			success:function(data){
				if(data&&data.error==="0"){
                    $('.img-list').attr('src',data.result.shop_banner_pic);
					if(data.result.shop_banner_url){
						$('.img-list').click(function(){
							location.href = data.result.shop_banner_url;
						})
					}
				}
			},
			error:function(xhr) {

			}

		});
	}



	FL.getGoodsNum({success:loadSuccess});

	function loadSuccess(data){
		if(data&&data.error==0){
			if(data.result.num!=0){
				if(data.result.num>99){
					data.result.num="99+";
				}
				var dom = '<span class="cart-num">'+data.result.num+'</span>';
			    $(".shoppingurl").after(dom);
				if(data.result.is_global=='1'){
					$('.shoppingurl').prop('href','../shopping/shopping_cart_global.html');
				}else{
					$('.shoppingurl').prop('href','../shopping/shopping_cart_cn.html');
				}
		    }
		}
	}

	var num = 10,curpage=1,
		regu = /^[-]{0,1}[0-9]{1,}$/;//判断是否是整数;

	var count = 0; //当前商品总数 用来判断是否还要继续加载更多

	function getFound(num,curpage,type){
		FL.ajaxDate('get',get_found_home,{mid:FL.mid,num:num,curpage:curpage},function(data){
			if(data&&data.error=='0'){
				var html = template('discover-tmpl',data);
				if(type == "yes"){
					$('#discoverCentent').html(html);
				}else{
					$('#discoverCentent').append(html);
				}

				for(var i =0;i<data.result.length;i++){

					try{
						var mySwiper = new Swiper('.timeListMedia'+i+' .swiper-container', {
							loop: true,
							effect: 'fade',
							autoplay: 6000,
							// 如果需要分页器
							pagination: '.timeListMedia'+i+' .swiper-pagination'

						});
					} catch(e) {

					}

				}
				console.log(data);
				for(var h = 0;h<data.result.length;h++){
				for(var m = 0;m<data.result[h].images.length;m++){
					if(data.result[h].images[m].goods){
						var canvas = document.getElementById("myCanvas_"+h+"_"+m);
						var goods = data.result[h].images[m].goods;
						var w = $(window).width();
						canvas.width = w;
						canvas.height = w;
						for(var j=0;j<goods.length;j++){
							var value = goods[j].location.split(',');
							x = parseFloat(value[0])*w;
							y = parseFloat(value[1])*w;
							var valueO=goods[j].line1.value,
								valueT=goods[j].line2.value,
								valueTh=goods[j].line3.value;
							var direction =goods[j].line1.direction;
							drawLine(canvas,x,y,valueO,valueT,valueTh,direction);
							//var dom = '<a class="goodsLink" style="top:'+(x+40)+'px;left:'+y/2+'px;" href="../shopping/goods_details.html?goods_id='+goods[j].goods_id+'&talent_deductid='+data.result.images[m].talent_deductid+'"></a>';
							if(direction=="R"){
								var dom = '<a class="goodsLink" style="top:'+(y-45)+'px;left:'+x+'px;" href="../shopping/goods_details.html?goods_id='+goods[j].goods_id+'&talent_deductid='+data.result[h].images[m].talent_deductid+'"></a>';
							}else{
								var dom = '<a class="goodsLink" style="top:'+(y-45)+'px;left:'+(x-130)+'px;" href="../shopping/goods_details.html?goods_id='+goods[j].goods_id+'&talent_deductid='+data.result[h].images[m].talent_deductid+'"></a>';
							}
							$("#myCanvas_"+h+"_"+m).after(dom);
						}
					}

				}
				}

				$('canvas').on('click',function(){
					var me = this;
					if($(me).css('opacity')=='0'){
						$(me).parent('div').find('.goodsLink').show();
						$(me).css('opacity','1');
					}else{
						$(me).parent('div').find('.goodsLink').hide();
						$(me).css('opacity','0');
					}
				});


				for(var m =0;m<data.result.length;m++){
					try{

						var tabScrool = new IScroll(".f-nav-stickytabs"+m,{scrollX:true,scrollY:false,mouseWheel:true,tab:true});

					}catch(e){
						//TODO handle the exception
					}
				}

				$('.collect_count').click(function(){
					FL.judgeLogin();
					var me = this;
					var collect_count = parseFloat($(me).attr('collect_count'));
					var time_id=$(me).attr('time_id');
					if($(me).hasClass('collected')){
						delCollect(time_id,"time",me,collect_count);
					}else{

						addFavorites(time_id,"time",me,collect_count);
					}

				});

				$('.comment_count').click(function(){
					FL.judgeLogin();
					var time_id = $(this).attr('time_id');
					location.href='../specialty/time_detail.html?time_id='+time_id+"&comment_count=true";
				})

				$(".shareBtn").click(function(){
					var me = this;
					$('.-mob-share-ui').show();
					var _title = $(me).attr("goods_name");
					var _desc = $(me).attr("goods_desc");
					var _url = $(me).attr("goods_url");
					var _pic = $(me).attr("goods_image");
					var share_id = $(me).attr("time_id");
					FL.share(_title,_desc,_pic,_url,"","",0,share_id,"time");
				});

				bindRefresh();

			}
		});
	}


	function bindRefresh() {
		$(window).scroll(function() {
			var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
			var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
			var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			if (scrollTop + clientHeight == htmlHeight) {
				var showNum = $(".timeListMedia").length; //当前页面显示的个数
				curpage = showNum / 10 + 1; //上拉加载要显示的页数
				if (count != curpage && regu.test(curpage)) {

					getFound(num,curpage,'no');
					count = curpage;
				} else {

				}

			}
		})
	}


	// 删除收藏
	function delCollect(fid,type,self,collect_count){
		$.ajax({
			type: 'post',
			url: WapSiteUrl + '/api/index.php?act=buyer_favorite&op=delete_favorites',
			data: {
				flag: 'wap',
				token: FL.token,
				mid: FL.mid,
				fid:fid,
				type:type
			},
			dataType: 'json',
			success: function(data) {
				if (data&&data.error === '0') {
					$(self).removeClass('collected');
					$(self).find('img').attr('src','../../images/wap/specialty/collect.png');
					collect_count=='1'?$(self).find("span").text("收藏"):$(self).find("span").text(collect_count-1);
					$(self).attr('collect_count',collect_count-1);
				}
			}

		})
	}

	function addFavorites(fid,type,self,collect_count){
		$.ajax({
			type: 'post',
			url: WapSiteUrl + '/api/index.php?act=buyer_favorite&op=add_favorites',
			data: {
				flag: 'wap',
				token: FL.token,
				mid: FL.mid,
				fid:fid,
				type:type
			},
			dataType: 'json',
			success: function(data) {
				if (data&&data.error === '0') {
					$(self).addClass('collected');
					$(self).find('img').attr('src','../../images/wap/specialty/collected.png');
					collect_count++;
					$(self).find("span").text(collect_count);
					$(self).attr('collect_count',collect_count);
				}
			}

		});
	}


	function functional_control(){
		var type ;
		$.ajax({
			url: WapSiteUrl+"/api/index.php?act=common_index&op=function_switch",
			type: 'get',
			data:{flag:"wap"},
			async:false,
			dataType: 'json',
			success: function(data) {
				if(data&&data.error){
					if(data.result[1].name=='discover'&&(data.result[1].type.indexOf("wap")>=0||data.result[1].type.indexOf("all")>=0)){
						$('#discover').removeClass('none');
						getShopSettings();
						loadData();
					}else{
						$('#discover_index').removeClass('none');
						getFound(10,1,"yes");
					}
				}
			}
		});
	}

	function drawLine(canvas,x,y,valueO,valueT,valueTh,direction){
		if(canvas.getContext){
			var ctx = canvas.getContext("2d");
			ctx.beginPath();
			ctx.strokeStyle = "white";
			if(direction=='R'){
				ctx.moveTo(x, y);
				ctx.lineTo(x+100, y);

				ctx.moveTo(x, y-30);
				ctx.lineTo(x+130, y-30);

				ctx.moveTo(x, y+30);
				ctx.lineTo(x+130, y+30);
				ctx.fillStyle='#fff';//文字颜色
				ctx.fillText(valueO, x+10, y-40);
				ctx.fillText(valueT, x+10, y-10);
				ctx.fillText(valueTh, x+10, y+20);

			}else if(direction=='L'){
				ctx.moveTo(x, y);
				ctx.lineTo(x-100, y);

				ctx.moveTo(x, y-30);
				ctx.lineTo(x-130, y-30);

				ctx.moveTo(x, y+30);
				ctx.lineTo(x-130, y+30);

				ctx.fillStyle='#fff';//文字颜色
				ctx.fillText(valueO, x-80, y-40);
				ctx.fillText(valueT, x-80, y-10);
				ctx.fillText(valueTh, x-80, y+20);

			}

			ctx.moveTo(x, y-30);
			ctx.lineTo(x, y+30);
			ctx.stroke();
			ctx.closePath();

			ctx.beginPath();
			ctx.arc(x, y, 10, 0, Math.PI * 2, false);
			ctx.closePath();
			ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
			ctx.fill();

			ctx.beginPath();
			ctx.arc(x, y, 5, 0, Math.PI * 2, false);
			ctx.closePath();
			ctx.fillStyle = '#fff';
			ctx.fill();

		}
	}

	var Discover = function(){
		this.onLoad = function(){

			functional_control();
		}
	}
	Global.Activity = Global.Activity||{};
	Activity.Discover = new Discover(); 

}(this);

