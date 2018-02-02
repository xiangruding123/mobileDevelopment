/*************购物车*****************/
! function(Global) {
	var pay_sn = GetQueryString("pay_sn");

	function loadGoods() {

		//获取合并订单
		$.ajax({
			type: 'post',
			url: WapSiteUrl + "/api/index.php?act=buyer_order&op=get_order_list",
			data: {
				token: FL.token,
				mid: FL.mid,
				state: 10,
				pay_sn: pay_sn,
				num: 100,
				curpage: 1,
				flag: 'wap'
			},
			dataType: 'json',
			success: function(data) {
				if (data && data.error == "0") {

					//地址获取
					var adrDom = template.render("my_address", data.result[0].reciver_info);
					$("#myAddress").empty();
					$("#myAddress").html(adrDom);

					//商品获取
					var dom = template.render("goods_details", data);
					$("#goods-list").empty();
					$("#goods-list").html(dom);

					$('.timestamp').each(function() {
						var t = $(this).text();
						commonTime = FL.dateFormat(t);
						$(this).text(commonTime);
					});
					//实际付款
					$('#total_price').text(data.result[0].all_real_amount.toFixed(2));
					var pay_amount=data.result[0].all_real_amount.toFixed(2);
                    maskSuit(pay_sn);
					var payment = data.result[0].payment_list.join("|");

					bindEvent(pay_amount,payment);

				}
			},
			error: function(xhr) {

			}
		});
	}






	function bindEvent(pay_amount) {
		//选择支付方式
//		$(".pay-chose").click(function() {
//			var me = this;
//			$(".pay-chose").attr("class", "icon-circle-blank pay-chose");
//			$(me).attr("class", "icon-ok-sign pay-chose");
//		});
		//取消订单
		$('.cancleOrder').click(function() {

			order_id = $(this).attr('order_id');
			e_cancle = $(this).parents('.store_goods');

			$('#mask').show();
			$('#maskbox').show();
			//取消订单的居中

			var left = ($(window).width()-$('#maskbox').width())/2;

			var top = ($(window).height()-$('#maskbox').height())/2;

			$('#maskbox').css({'left':left+'px','top':top+'px'});

		});
		$('#mask').click(function(){
		 	$('#mask').hide();
			$('#maskbox').hide();
		});
		 $('#maskbox p').click(function(){
		 	msg = $(this).text();
		 	$('#mask').hide();
			$('#maskbox').hide();
		 	cancleOrder(order_id,msg,e_cancle);
		 });

		//支付
		$("#pay_money").click(function() {



			location.href = 'order_pay.html?pay_sn=' + pay_sn+'&pay_amount='+pay_amount+'&payment='+payment;


		});

		//弹出层
		$('#imglist_tao').click(function(){

     	 $('#goods_suit').show();

     	 $('.taogoback').click(function(){

		 	$('#goods_suit').hide();

		 });

        });
	}
	 //套装弹出层
		function maskSuit(pay_sn){
			$.ajax({
			type: 'post',
			url: WapSiteUrl + "/api/index.php?act=buyer_order&op=get_order_list",
			data: {
				token: FL.token,
				mid: FL.mid,
				state: 10,
				pay_sn: pay_sn,
				num: 100,
				curpage: 1,
				flag: 'wap'
			},

				dataType:'json',

				success:function(data){
					if(data&&data.error=="0"){
						var html = template('goods_suit_tmpl',data);
						$('#goods_suit').html(html);
					}
				}
			});
		}
	function cancleOrder(order_id,msg,e){
		$.ajax({
				type: 'post',

				url: WapSiteUrl + "/api/index.php?act=buyer_order&op=cancle_order",

				data: {
					token: FL.token,
					mid: FL.mid,
					order_id: order_id,
					msg:msg,
					flag: 'wap'
				},

				dataType: 'json',

				success: function(data) {
					if (data && data.error == "0") {
						layer.msg('取消成功');
						e.remove();
						if($('#goods-list .container').length==0){
							location.href = 'order_all.html';
						}else{
							window.location.reload();//刷新当前页面
						}

					} else {
						layer.msg('取消失败');
					}
				}
			});
	}
	var Confirmation = function() {
		this.onLoad = function() {
			loadGoods();

		}
	}
	Global.Goods = Global.Goods || {};
	Goods.Confirmation = new Confirmation();
}(this);
