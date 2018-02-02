$(function() {
	FL.judgeLogin();
	var indexnum = GetQueryString('index');
	var state, num = 7,
		curpage = 1;
	FL.fhload();
	var regu = /^[-]{0,1}[0-9]{1,}$/; //判断是否是整数;
	var count = 0; //当前商品总数 用来判断是否还要继续加载更多

	function loadDate() {
		//页面加载
		$('#order_state li').eq(indexnum).addClass('selected').siblings('li').removeClass('selected');
		$('.tableChange').eq($('.selected').index()).show().siblings('.tableChange').hide();
		state = $('.selected').attr('order_state');
		tpl = $('.selected').attr('tpl');
		section_id = $('.tableChange').eq($('.selected').index());
		getOrder(state, num, 1, tpl, section_id, true);
	}
	function clickEvent(){
		$('#order_state li').click(function() {

			$(this).addClass('selected').siblings('li').removeClass('selected');
			$('.tableChange').eq($(this).index()).show().siblings('.tableChange').hide();
			state = $('.selected').attr('order_state');
			tpl = $('.selected').attr('tpl');
			section_id = $('.tableChange').eq($('.selected').index());
			$('.ord_empty').hide();
			getOrder(state, num, 1, tpl, section_id, true);

	    });
	}

	function bindEvent() {
		// table切换




		bindRefresh();



		//去付款
		$('.unweixin').click(function() {
				pay_sn = $(this).attr('pay_sn');
				pay_amount= $(this).attr('real_amount');
				payment = $(this).attr('payment');
				location.href = 'order_pay.html?pay_sn=' + pay_sn+'&pay_amount='+pay_amount+'&payment='+payment;
		})



		//点击取消订单
		$('button.cancelorder').click(function() {
			$('#mask').show();
			$('#maskbox').show();
			//取消订单的居中
			order_id = $(this).attr('order_id');
			that = $(this).parents('div.media');

			var left = ($(window).width() - $('#maskbox').width()) / 2;

			var top = ($(window).height() - $('#maskbox').height()) / 2;

			$('#maskbox').css({
				'left': left + 'px',
				'top': top + 'px'
			});
		});


		$('#mask').click(function() {
			$('#mask').hide();
			$('#maskbox').hide();
		})
		$('#maskbox p').click(function() {
				msg = $(this).text();
				cancelOrder(order_id, msg, that);
			})
			//点击删除订单
		$('.delorder').click(function() {
			order_id = $(this).attr('order_id');
			thatParent = $(this).parents('div.media');
			delOrder(order_id, thatParent);
		})


		//点击确认收货
		$('.receipt').click(function() {
			var order_id = $(this).attr('order_id');
			FL.addShade();
            $('#goods_receipt_dialog').show();
			$('#goods_receipt_dialog #rightbtn').click(function() {
				goods_receipt(order_id, parent);

			})
			$('#goods_receipt_dialog #leftbtn').click(function() {
				$('#goods_receipt_dialog').hide();
				FL.removeShade();
			})
		})

		$('#goods_receipt_dialog_success #leftbtn').click(function() {
			$('#goods_receipt_dialog_success').hide();
			FL.removeShade();
		});
		$('#goods_receipt_dialog_success #leftbtn').click(function() {
			location.href="order_all.html?index=4";
			$('#goods_receipt_dialog_success').hide();
			FL.removeShade();
		})

	}



	// 获取订单

	function getOrder(state, num, curpage, tpl, section_id, type_append) {
		$.ajax({
			url: WapSiteUrl + '/api/index.php?act=buyer_order&op=get_order_list',
			type: 'post',
			dataType: 'json',
			data: {
				flag: 'wap',
				token: FL.token,
				mid: FL.mid,
				state: state,
				num: num,
				curpage: curpage
			},
			success: function(data) {

				if (data.error === '0') {
                    console.log(data);
					if (type_append) {
						var html = template.render(tpl, data);
						section_id.empty();
						section_id.html(html);
					} else {
						var html = template.render(tpl, data);
						section_id.append(html);
					}

					$('.ord_empty').hide();

					bindEvent();



					$('.tableChange').eq($('.selected').index()).find(".media").each(function(index){
						var me = this;

						var l = $(window).width();
						var itemNum=$(me).find(".container .pull-left img").length;
						var w = itemNum*60+50;

						if(w>l){

                            $(me).find('.container .pull-left').css("width",w+"px");

							if($(me).find('.container>div').attr("class")==("imglist_"+index)){
								var tabScrool = new IScroll(".imglist_"+index,{scrollX:true,scrollY:false,mouseWheel:true});
							}else if($(me).find('.container>div').attr("class")==("imglist_1_"+index)){
								var tabScrool = new IScroll(".imglist_1_"+index,{scrollX:true,scrollY:false,mouseWheel:true});
							}else if($(me).find('.container>div').attr("class")==("imglist_2_"+index)){
								var tabScrool = new IScroll(".imglist_2_"+index,{scrollX:true,scrollY:false,mouseWheel:true});
							}else if($(me).find('.container>div').attr("class")==("imglist_3_"+index)){
								var tabScrool = new IScroll(".imglist_3_"+index,{scrollX:true,scrollY:false,mouseWheel:true});
							}else if($(me).find('.container>div').attr("class")==("imglist_4_"+index)){
								var tabScrool = new IScroll(".imglist_4_"+index,{scrollX:true,scrollY:false,mouseWheel:true});
							}



						}
					});

				} else {
					if(type_append){

						section_id.empty();
						$('.ord_empty').show();
						if (state == '0') {
							$('.ord_empty p').text('没有待付款的订单！');

						} else if (state == '10') {
							$('.ord_empty p').text('没有待付款的订单！');
						} else if (state == '20') {
							$('.ord_empty p').text('没有待发货的订单！');
						} else if (state == '30') {
							$('.ord_empty p').text('没有待收货的订单！');
						} else if (state == '100') {
							$('.ord_empty p').text('没有待评价的订单！');
						}


					}
				}
			}
		});
	}
	// 确定收货
	function goods_receipt(order_id, e) {
		$.ajax({
			url: WapSiteUrl + '/api/index.php?act=buyer_order&op=receive_order',
			type: 'post',
			dataType: 'json',
			data: {
				flag: 'wap',
				token: FL.token,
				mid: FL.mid,
				order_id: order_id
			},
			success: function(data) {
				if (data.error === '0') {
					$('#goods_receipt_dialog').hide();
					$('#goods_receipt_dialog_success').show();
					e.hide();

				}
			}
		});
	}
	//取消订单
	function cancelOrder(order_id, msg, e) {
		$.ajax({
			url: WapSiteUrl + '/api/index.php?act=buyer_order&op=cancle_order',
			type: 'post',
			dataType: 'json',
			data: {
				flag: 'wap',
				token: FL.token,
				mid: FL.mid,
				msg: msg,
				order_id: order_id
			},
			success: function(data) {
				if (data.error === '0') {
					$('#mask').hide();
					$('#maskbox').hide();
					e.hide();
					layer.msg('取消成功');

				}
			}
		});
	}




	//删除订单

	function delOrder(order_id, e) {
		$.ajax({
			url: WapSiteUrl + '/api/index.php?act=buyer_order&op=delete_order',
			type: 'post',
			dataType: 'json',
			data: {
				flag: 'wap',
				token: FL.token,
				mid: FL.mid,

				order_id: order_id
			},
			success: function(data) {
				if (data.error === '0') {
					$('#mask').hide();
					$('#maskbox').hide();
					e.hide();
					e.next('.empty').hide();
					layer.msg('删除成功');

				}
			}
		});
	}
	//绑定滚动
	function bindRefresh() {
		$(window).scroll(function() {
			var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
			var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
			var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			if (scrollTop + clientHeight >= htmlHeight) {
				var showNum = $('.tableChange').eq($('.selected').index()).find('.media').length; //当前页面显示的个数
				curpage = showNum / 7 + 1; //上拉加载要显示的页数
				if (count != curpage && regu.test(curpage)) {
					getOrder(state, num, curpage, tpl, section_id, false);
					count = curpage;
				}
			}
		})
	}


	loadDate();
    clickEvent();

})
