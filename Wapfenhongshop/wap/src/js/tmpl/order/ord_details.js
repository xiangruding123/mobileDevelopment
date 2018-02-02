/*************订单详情*****************/ ! function(Global) {
	var cart_info, if_cart, area, vat_hash, offpay_hash, offpay_hash_batch, pay_sn, pay_amount, cert_num;
	var progress = GetQueryString("progress");


	//获取订单详情
	var order_id = GetQueryString("order_id");

	function loadDate() {
		$.ajax({
			type: 'post',

			url: WapSiteUrl + "/api/index.php?act=buyer_order&op=get_order_detail",

			data: {
				token: FL.token,
				mid: FL.mid,
				order_id: order_id,
				flag: 'wap'
			},

			dataType: 'json',

			success: function(data) {
				if (data && data.error == "0") {
					var dete = data.result;
					console.log(data);
					//地址获取
					var adrDom = template.render("my_address", dete.reciver_info);
					$("#myAddress").empty();
					$("#myAddress").html(adrDom);

					//商品获取
					var dom = template.render("goods_details", data);
					$("#goods-list").empty();
					$("#goods-list").html(dom);

					//顶部状态 文字 时间
					topState(dete);

					//套装弹出层
					maskSuit(order_id);

					//金额 优惠券部分
					pay(dete);

                    //底部按钮
					bottomBtn(dete);

					//获取红包
					getbag(dete.pay_sn);

                    bindEvent();

					//计算价格
					calculatePrice(dete);


				}
			},
			error: function(xhr) {

			}
		});
	}



    function topState(dete){

    	var reg_font = /[\u4e00-\u9fa5]/g;
		var result = dete.state_desc.match(reg_font);
		if(dete.pintuan_state&&dete.pintuan_id!=0){
			 if(dete.pintuan_state=='0'){
			 	  $('#state').text("拼团中 等待付款");
			 }else if(dete.pintuan_state=='1'){
		     	 $('#state').text("拼团中");
		     }else if(dete.pintuan_state=='2'){
		     	 $('#state').text("拼团成功，等待发货");
		     }else if(dete.pintuan_state=='3'){
		     	 $('#state').text("拼团失败，退款中");
		     }


		}else{
			$('#state').text(result.join(""));

	    	//交易失败
			if (dete.order_state == 50) {
				$('#state').text('交易失败');
			}
		}

		grouphref = '../activity/groupdetail.html?pintuan_group_id='+dete.pintuan_group_id+'&pintuan_parent_id='+dete.pintuan_parent_id;
		$("#grouphref").prop('href',grouphref);


		//退款退货状态
		if (progress == 7) {
			$("#state").text("退款/退货成功");
		} else if (progress == 1 || progress == 2 || progress == 3 || progress == 4 || progress == 5 || progress == 6) {
			$("#state").text("售后申请处理中");
		}

		//订单号
		$('#order_sn').text(dete.order_sn);

		//倒计时
		if (dete.validity_pay_time != '0') {
			var t = dete.validity_pay_time;
			var t_pay_time = setInterval(function() {
				t--;
				$('#validity_pay_time span').text(parseInt(t / 3600) + '时' + parseInt(t % 3600 / 60) + '分' + (t % 60) + '秒');
				if (t <= 0) {
					clearInterval(t_pay_time);
					$('#validity_pay_time').text('由于长时间未付款,订单已经自动取消');
				}
			}, 1000);
		} else {
			$('#validity_pay_time').text('由于长时间未付款,订单已经自动取消');
		}
		if (dete.order_state > 10 && dete.order_state != 50) {
			t = FL.dateFormat(dete.payment_time);

			$('#validity_pay_time').text("支付时间：" + t);
		} else if (dete.order_state == 0) {
			$('#validity_pay_time').hide();
		}

		$('.baidustore').click(function(){
			if(dete.store_baidusales){
				location.href="../shopping/store_baidusales.html?store_baidusales="+dete.store_baidusales;
			}else{
				layer.msg('卖家家不在线，请稍后联系');
			}
		});


			if(dete.order_state==20){
				$('.refund').css("display","inline-block");
			}

			$('.refund').click(function(){
				if(dete.refund_enabled===1&&dete.order_state==20){
				   location.href="../refund/apply_service.html?order_id=" + dete.order_id + "&way=1&goods_num=" + dete.order_goods[0].goods_num;
				}else{
					layer.msg("订单中商品不支持退款，如有疑问请联系卖家");
				}
			});


    }

    function pay(dete){

        //运费
		$('#express_price').text("￥" + dete.shipping_fee);

		//关税
		if (dete.country_source != 0) {
			$('#duty').show();
			if (dete.duty_fee == null) {
				$('#duty_price').text('￥0.00');
			} else {
				$('#duty_price').text("￥" + dete.duty_fee);
			}

//			if (dete.duty_fee > 50) {
//				$('#duty_price').css('text-decoration', 'none');
//			} else {
//				$('#duty_price').css('text-decoration', 'line-through');
//			}
		}

		//优惠券
		$('#privilege_price').text((dete.coupon_amount).toFixed(2));

		//余额
		if (dete.pd_amount) {
			$('#yu_price').text((dete.pd_amount).toFixed(2));
		}

		//实际付款
		$('#total_price').text("￥" + dete.real_amount.toFixed(2));

		if (dete.order_state == "10") {
			$('#totaltext').text("应付金额");
		}

		//大v优惠
		if(dete.micro_shoper_save_desc||(dete.micro_shoper_save_money>0)){
			$('#shoper_save').show();
			$('#shoper_save span.pull-left').text(dete.micro_shoper_save_desc);
			$('#shoper_save span.fh-black').text(dete.micro_shoper_save_money);
		}

		//店铺优惠
		if (dete.mansong) {
			$('#shop_free span.fh-black').text(dete.mansong.minus_amount);
		}


		//显示优惠券
		if (dete.order_state != 0) {
			$('#tickets').show();
		}

    }


    function bottomBtn(dete){
    	//  底部按钮
		if (dete.order_state == 0) {

			$('.detail_btn').html('<a class="btn-shopping fh-bg-yellow" order_id="' + dete.order_id + '" id="del_order">删除订单</a>');

		} else if (dete.order_state == 10) {
           if(dete.pintuan_state=='0'&&dete.pintuan_id!=0){

				$('.detail_btn').html('<a class="btn-shopping unweixin pintuanbuy" id="pay_money" payment="' +dete.payment_list.join("|")+ '" pay_sn="' + dete.pay_sn + '" pay_amount="' + dete.real_amount + '" country_source="' + dete.country_source + '">立即付款</a>');

           }else{
           	    if (dete.validity_pay_time == 0) {
				 $('.detail_btn').html('<a class="btn-shopping fh-bg-yellow" order_id="' + dete.order_id + '" id="cancle_order">取消订单</a>');
				} else {

					$('.detail_btn').html('<a class="btn-shopping unweixin" id="pay_money" payment="' +dete.payment_list.join("|")+ '" pay_sn="' + dete.pay_sn + '" pay_amount="' + dete.real_amount + '" country_source="' + dete.country_source + '">立即付款</a><a class="btn-shopping fh-bg-yellow btn_right" order_id="' + dete.order_id + '" id="cancle_order">取消订单</a>');
				}
           }

		} else if (dete.order_state == 20) {

	         if(dete.pintuan_id){
	         	if(dete.pintuan_state=='1'){

	         		$('.detail_btn').html('<a class="pintuanbuy btn-shopping" href="../activity/groupdetail.html?pintuan_group_id=' + dete.pintuan_group_id + '&pintuan_parent_id=' + dete.pintuan_parent_id + '">查看团详情</a>');

	         	}else if(dete.pintuan_state=='2'){

	         		$('.detail_btn').html('<a class="pintuanbuy btn-shopping" href="../logistics/logistics.html?order_id=' + dete.order_id + '&shipping_code=' + dete.shipping_code + '">订单跟踪</a>');

	         	}else if(dete.pintuan_state=='3'){

				    $('.detail_btn').html('<a class="pintuanbuy" order_id="' + dete.order_id + '" id="del_order">删除订单</a>');

	         	}


	         }else{

				$('.detail_btn').html('<a class="btn-shopping" href="../logistics/logistics.html?order_id=' + dete.order_id + '&shipping_code=' + dete.shipping_code + '">订单跟踪</a>');
	        }

		} else if (dete.order_state == 30) {


			$('.detail_btn').html('<a class="btn-shopping receipt" order_id="' + dete.order_id + '">确认收货</a><a class="btn-shopping fh-bg-yellow btn_right" href="../logistics/logistics.html?order_id=' + dete.order_id + '&shipping_code=' + dete.shipping_code + '">订单跟踪</a>');
		} else if (dete.order_state == 40) {

			if (dete.evaluation_state == '0') {

				$('.detail_btn').html('<a class="btn-shopping" href="../order/evaluation_guide.html?order_id=' + dete.order_id + '">去评价</a><a class="btn-shopping fh-bg-yellow btn_right" href="../logistics/logistics.html?order_id=' + dete.order_id + '&shipping_code=' + dete.shipping_code + '">订单跟踪</a>');
			} else if(dete.evaluation_state == '1'){

               $('.detail_btn').html('<a class="btn-shopping" href="../shopping/evaluation.html?if_append_evaluate=1&order_id=' + dete.order_id + '">追加评价</a><a class="btn-shopping fh-bg-yellow btn_right" href="../logistics/logistics.html?order_id=' + dete.order_id + '&shipping_code=' + dete.shipping_code + '">订单跟踪</a>');

			}else{
				$('.detail_btn').html('<a class="btn-shopping fh-bg-yellow btn_right" order_id="' + dete.order_id + '" id="del_order">删除订单</a><a class="btn-shopping" href="../logistics/logistics.html?order_id=' + dete.order_id + '&shipping_code=' + dete.shipping_code + '">订单跟踪</a>');

			}
		}
    }

    //计算价格
	function calculatePrice(dete) {
		var goodsNum = $("#goods-list").find(".container");
		var countNum = 0;
		var totalPrice = parseFloat("0.00"),
			realPrice = parseFloat("0.00"),
			dutyPrice = parseFloat("0.00"); //关税
		var privilegePrice = parseFloat($("#privilege_price").text());
		for (var i = 0; i < goodsNum.length; i++) {
			var price = $(goodsNum[i]).find(".goods-price").text().slice(1);
			var num = $(goodsNum[i]).find(".module-num").text().slice(1);
			var hs_rate = goodsNum.attr("hs_rate");
			countNum += parseInt(num);
			dutyPrice = parseFloat($('#duty_price').text());
			realPrice += parseFloat(price * num);
		}
		totalPrice = realPrice + parseFloat($("#express_price").text().slice(1)) + privilegePrice;
		$("#total_num").html("共 " + countNum + " 件");
		if (dete.country_source == '0') {
			$("#real_price").html("￥" + realPrice);
		} else {
//			if (dutyPrice <= 50) {
//
//				$("#real_price").html("￥" + realPrice);
//
//			} else {

				$("#real_price").html("￥" + (realPrice).toFixed(2));
//			}
		}

	}
	//点击确认收货
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
					$('#mask').hide();
					$('#goods_receipt').hide();
					setTimeout(function() {
						location.reload();
					}, 300);

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
					setTimeout(function() {
						location.reload();
					}, 500);


				}
			}
		});
	}
	//删除订单

	function delOrder(order_id) {
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

					layer.msg('删除成功');
					setTimeout(function() {
						javascript: history.back();
					}, 1000);


				}
			}
		});
	}

	//加载红包
	function getbag(pay_sn) {
		$.ajax({
			url: WapSiteUrl + '/api/index.php?act=buyer_coupon&op=paid_coupon_batch',
			type: 'post',
			dataType: 'json',
			data: {
				flag: 'wap',
				token: FL.token,
				mid: FL.mid,
				pay_sn: pay_sn
			},
			success: function(data) {
				if (data.error === '0') {
					var res = data.result;
					if (res.batch_id && res.batch_name) {
						$('#bag_detail').removeClass('none');
						$("#num").text(res.bag_num);
					}
					FL.wxShare(res.share_title, res.share_desc, res.share_url, res.share_img, res.share_desc);
				} else {

				}

			}
		})
	}

	//生成订单
	function makeOrder() {
		var address_id = $(".adr-body").attr("address_id");
		$.ajax({
			type: 'post',

			url: WapSiteUrl + "/api/index.php?act=buyer_order&op=submit",

			data: {
				mid: FL.mid,
				flag: "wap",
				token: FL.token,
				cart_info: cart_info,
				if_cart: if_cart,
				area: area,
				address_id: address_id,
				vat_hash: vat_hash,
				offpay_hash: offpay_hash,
				offpay_hash_batch: offpay_hash_batch
			},

			dataType: 'json',

			success: function(data) {
				if (data && data.error == 0) {
					pay_sn = data.result.pay_sn;
					pay_amount = data.result.pay_amount;
					payment = data.result.payment_list.join("|");
					location.href = "order_pay.html?pay_sn=" + pay_sn +"&pay_amount="+pay_amount+"&payment="+payment;

				}
			}
		})
	}
	//套装弹出层
	function maskSuit(order_id) {
		$.ajax({
			type: 'post',

			url: WapSiteUrl + "/api/index.php?act=buyer_order&op=get_order_detail",

			data: {
				token: FL.token,
				mid: FL.mid,
				order_id: order_id,
				flag: 'wap'
			},

			dataType: 'json',

			success: function(data) {
				if (data && data.error == "0") {
					var html = template('goods_suit_tmpl', data.result);
					$('#goods_suit').html(html);
					var res = data.result;
					var totalDownPrice = 0;
					for (var i = 0; i < res.order_goods.length; i++) {
						if (res.order_goods[i].bundling) {

							for (var k = 0; k < res.order_goods[i].bundling.bl_list.length; k++) {
								totalDownPrice += parseFloat(res.order_goods[i].bundling.bl_list[k].down_price);
							}
							totalDownPrice = totalDownPrice.toFixed(2);
							var bl_price = parseFloat(res.order_goods[i].bundling.bl_price);
							$("#downPrice").text("立省 ￥" + totalDownPrice + "元");
							$('#totalpricedel').text('￥' + (parseFloat(totalDownPrice) + parseFloat(bl_price)).toFixed(2));
						}
					}


				}
			}
		});





	}

	function bindEvent() {

		//红包显示
		$('#bag_detail').click(function() {
				$('#maskbag').show();
		})
		//套装
		$('#imglist_tao').click(function() {

			$('#goods_suit').show();
			var h = document.body.clientHeight;
			$('#goods_suit').css('height', h + Number(50, 10) + "px");
			var scrollHeight = h - 48;
			$('body').css("overflow", "hidden");
			$("#goodsscroll").css({
				"height": scrollHeight + "px",
				"overflow": "scroll"
			});

			$('.taogoback').click(function() {

				$('#goods_suit').hide();
				$('body').css('overflow', "auto");
			});
		});
		//选择支付方式
		$(".pay-chose").click(function() {
			var me = this;
			$(".pay-chose").attr("class", "icon-circle-blank pay-chose");
			$(me).attr("class", "icon-ok-sign pay-chose");
		});

		//红包
		$('.new-packet-x,#maskbag').click(function() {
			$('#maskbag').hide();
			$('.native_tip').hide();
		});

		$('#cover').click(function() {
			if (FL.isWeiXin()) {
				$('#covershare').show();
			} else {
				$('.native_tip').show();

			}
			event.stopPropagation();
		});
		$('#covershare').click(function() {
			$('#covershare').hide();
		});



        //支付
		$('#pay_money').click(function() {
            pay_sn = $(this).attr('pay_sn');
			      pay_amount = $(this).attr('pay_amount');
			      payment = $(this).attr('payment');
				    location.href = 'order_pay.html?pay_sn=' + pay_sn+'&pay_amount='+pay_amount+'&payment='+payment;
		})

		$("#no_wxpay").click(function() {
			$("#no_wxpay").hide();
		});
		//生成订单
//		$("#pay_money").click(function() {
//			var address_id = $(".adr-body").attr("address_id");
//			if (area == 0) {
//				if (address_id) {
//					makeOrder();
//				} else {
//					layer.msg("请添加收货地址");
//				}
//			} else if (area == 1) {
//				if (address_id && cert_num != "") {
//					makeOrder();
//				} else if (!address_id) {
//					layer.msg("请添加收货地址");
//				} else if (cert_num == "") {
//					layer.msg("购买国外商品收货地址要填写身份证信息");
//				}
//			}
//
//		});

        //点击取消订单
		$('#cancle_order').click(function() {
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
		})
		$('#mask').click(function() {
			$('#mask').hide();
			$('#maskbox').hide();
		})
		$('#maskbox p').click(function() {
			msg = $(this).text();
			cancelOrder(order_id, msg, that);
		});
		//点击删除
		$('#del_order').click(function() {
			order_id = $(this).attr('order_id');
			delOrder(order_id);
		})

		//点击确认收货
		$('.receipt').click(function() {
			var order_id = $(this).attr('order_id');
			$('#mask').show();
			$('#goods_receipt').show();
			var parent = $(this).parents('.media');
			var left = ($(window).width() - $('#goods_receipt').width()) / 2 - 40;

			var top = ($(window).height() - $('#goods_receipt').height()) / 2;

			$('#goods_receipt').css({
				'left': left + 'px',
				'top': top + 'px'
			});

			$('#goods_ok').click(function() {
				goods_receipt(order_id, parent);

			})
		})
		$('.cancle_receipt,#mask').click(function(event) {
			$('#mask').hide();
			$('#goods_receipt').hide();
		});

	}


	var Confirmation = function() {
		this.onLoad = function() {
			loadDate();

		}
	}
	Global.Goods = Global.Goods || {};
	Goods.Confirmation = new Confirmation();
}(this);
