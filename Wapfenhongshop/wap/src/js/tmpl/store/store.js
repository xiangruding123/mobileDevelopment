/*************店铺*****************/ ! function(Global) {
	var num = 10,
		curpage = 1,
		count = 0,
		stc_id = 0,
		order_num = 2, //排序规则(商城商品用)
		sort_num = 3,
		s_order_num = 1, //店铺首页用
		s_sort_num = 0,
		regu = /^[-]{0,1}[0-9]{1,}$/, //判断是否是整数;
		store_id = GetQueryString("store_id");
	FL.mid = FL.mid || GetQueryString("mid");
	ImgFormat(); //图片格式
	//店铺首页
	function loadStore(store_id) {
		$.ajax({
			type: "get",
			url: WapSiteUrl + "/api/index.php?act=buyer_shopping&op=get_store_home_info",
			data: {
				store_id: store_id,
				mid: FL.mid,
				flag: "wap"
			},
			dataType: 'json',
			success: function(data) {
				if(data && data.error == 0) {
					console.log(data);

					var html = template.render('hide-tpl', data.result);
					$('.hideStoreInfo').html(html);

					$("#store_scroll").removeClass();
					var store_info = data.result;
					//							$(".head").css("background-image","url("+store_info.store_banner+")");
					$("#store_logo").attr("src", store_info.store_label);
					$("#store_name").text(store_info.store_name);
					//判断是否收藏
					if(data.result.is_collected && data.result.is_collected == 1) {
						$("#col_shop").attr("class", "collect");
						$("#col_shop").text("已收藏");
					}

					$("#store_tab").hide();
					$("#store_head").show();
					$("#store_banner").show();
					//百度商桥
					if(data.result.store_baidusales) {
						$('.store_baidusales').click(function() {
							location.href = '../shopping/store_baidusales.html?store_baidusales=' + data.result.store_baidusales;
						});
					} else {
						$('.store_baidusales').click(function() {
							layer.msg('商家不在线，请稍后联系');
						});
					}

					$('.listToggle').toggle(function() {
						$('.listToggle').html('收起<i class="icon-angle-up pl5"></i>');
						$('.hideStoreInfo').removeClass('hide');
						$('.store_position').addClass('position');
						FL.addShade();
						var scrollTop = $('body').scrollTop();
						$('body').css({
							'overflow': 'hidden',
							'position': 'fixed',
							'top': scrollTop * -1
						});
					}, function() {
						$('.listToggle').html('查看店铺详情 <i class="icon-angle-down pl5"></i>');
						$('.hideStoreInfo').addClass('hide');
						$('.store_position').removeClass('position');
						FL.removeShade();
						$('body').css({
							'overflow': 'auto',
							'position': 'static'
						});
					})
					
					data.result.new_goods_status==1?$('.newred').hide():$('.newred').show();
					

					//设置微信分享信息
					var wx_title = data.result.share_name;
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

	//广告图和店家推荐
	function getStoreHomeAppend() {
		FL.ajaxDate('get', get_store_home_append, {
			store_id: store_id,
			mid: FL.mid
		}, function(data) {
			if(data && data.error == "0") {

				console.log(data);
				var html = template.render('store_home_append_tpl', data);
				$("#store_home_append").html(html);

				var imgwidth = parseInt(($(".container").width() + 30) * 0.49);
				$(".store-list img").css({
					"height": imgwidth + "px"
				});
				$("#store_home_append img").lazyload({
					threshold: 200
				});

			}
		});
	}

	//加载店铺所有商品
	function loadAllGoods(store_id, stc_id, sort, order, num, curpage, type) {
		$.ajax({
			type: "get",
			url: WapSiteUrl + "/api/index.php?act=common_goods&op=get_goods_list",
			data: {
				sid: store_id,
				scid: stc_id,
				sort: sort,
				order: order,
				num: num,
				curpage: curpage,
				flag: "wap"
			},
			dataType: 'json',
			success: function(data) {
				if(data && data.error == 0) {

					template.helper('parseFloat', parseFloat);
					var goodsHtml = template.render('storeGoods', data);
					if(type == "yes") {
						$("#goods_list").empty();
					}
					$("#goods_list").append(goodsHtml);
					//计算图片大小
					var imgwidth = parseInt(($(".container").width() + 30) * 0.49);
					$(".store-list img").css({
						"height": imgwidth + "px"
					});
					$("#goods_list img").lazyload({
						threshold: 200
					});

				}
			}
		});
	}

	// 下拉加载
	function windowScroll() {
		$(window).scroll(function() {
			var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
			var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
			var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			if(scrollTop + clientHeight == htmlHeight) {
				var showNum = $(".store-goods").length; //当前页面显示的个数
				page = showNum / num + 1; //上拉加载要显示的页数
				if(count != page && regu.test(page)) {
					loadAllGoods(store_id, stc_id, sort_num, order_num, num, page);
					count = page;
				} else {
					layer.msg("已经没有商品了");
				}
			}
		})
	}

	//收藏点击
	$("#col_shop").click(function() {
		var me = this;
		FL.judgeLogin();
		if($(".uncollect").length == 0) {
			delFavShop();
		} else {
			addFavShop();
		}
	});

	//收藏店铺
	function addFavShop() {
		$.ajax({
			type: 'post',
			url: WapSiteUrl + '/api/index.php?act=buyer_favorite&op=add_favorites',
			data: {
				mid: FL.mid,
				token: FL.token,
				flag: "wap",
				fid: store_id,
				type: "shop"
			},
			dataType: 'json',
			success: function(data) {
				if(data && data.error === "0") {
					layer.msg("收藏成功");
					$("#col_shop").attr("class", "collect");
					$('#col_shop img').attr('src',"../../images/wap/store/fillred.png");
					$("#col_shop").text("已收藏");
				}
			},
			error: function(xhr) {

			},
			complete: function(xhr) {

			}
		});
	}
	//取消收藏店铺
	function delFavShop() {
		$.ajax({
			type: 'post',
			url: WapSiteUrl + '/api/index.php?act=buyer_favorite&op=delete_favorites',
			data: {
				mid: FL.mid,
				token: FL.token,
				flag: "wap",
				fid: store_id,
				type: "shop"
			},
			dataType: 'json',
			success: function(data) {
				if(data && data.error === "0") {
					layer.msg("已取消收藏");
					$("#col_shop").attr("class", "uncollect");
					$('#col_shop img').attr('src',"../../images/wap/store/fill.png");
					$("#col_shop").text("收藏");
				}
			},
			error: function(xhr) {

			},
			complete: function(xhr) {

			}
		});
	}
	//顶部
	$('.timemore').click(function() {
		var me = this;
		if(!$(me).hasClass('timeup')) {
			$(me).addClass('timeup');
			$(me).next('.updownlog').show();
		} else {
			$(me).removeClass('timeup');
			$(me).next('.updownlog').hide();
		}
	});

	// 底部链接
	$('.newgoods').bind('click', function() {
		location.href = 'newgoods.html?store_id=' + store_id;
	});
	$('.allgoods').bind('click', function() {
		location.href = 'class_goods.html?store_id=' + store_id;
	});
	$('#goods_class').bind('click', function() {
		location.href = 'store_class.html?store_id=' + store_id;
	});

	var Store = function() {
		this.onLoad = function() {
			loadStore(store_id, stc_id, s_sort_num, s_order_num, num, curpage);
			// getStoreClass();
			getStoreHomeAppend();
			//加载下方商品
			loadAllGoods(store_id, stc_id, 3, 2, num, curpage, "yes");
			windowScroll();
			// 点击搜索跳转到商品列表
			FL.goSearch("#goods_search");
		}
	}
	Global.Goods = Global.Member || {};
	Goods.Store = new Store();

}(this);