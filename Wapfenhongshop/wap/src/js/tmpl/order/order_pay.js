/*************购物车*****************/
!function(Global){
		$("#pay_method").attr("action",WapSiteUrl + '/api/index.php?act=buyer_order&op=pay');
		var pay_sn = GetQueryString("pay_sn");
		var pay_amount = GetQueryString("pay_amount");
		var payment= GetQueryString("payment");
		var payment_list = GetQueryString("payment");


    // 页面显示编号和价格
		$('#paysn').text(pay_sn);
		$("#pay_amount").text("￥"+pay_amount);

		//是微信还是支付宝选中状态
		var ua = navigator.userAgent.toLowerCase();
		if(ua.match(/MicroMessenger/i)=="micromessenger") {
       $("#wx").find("i").attr("class","icon-ok-sign pay-chose");
	 	}else{
	 		 $("#zfb").find("i").attr("class","icon-ok-sign pay-chose");
			 $('#wx').hide();
	 	}





		function bindEvent(){
			//选择支付方式
			$(".pay-chose").click(function(){
				var me = this;
				$(".pay-chose").attr("class","icon-circle-blank pay-chose");
				$(me).attr("class","icon-ok-sign pay-chose");
			});
			//选择好支付方式返回三方支付页面
			$("#sure_pay").click(function(){
				var me = this;
				if(FL.mid==''||FL.token==''){

					FL.logLogin();

				}else{

					var payment_code = $(".icon-ok-sign").parent().attr("payment_code");
           if(payment_list.indexOf(payment_code)>=0){
						 $("#payment_code").val(payment_code);
	 					 $("#pay_sn").val(pay_sn);
	 					 $("#mid").val(FL.mid);
	 					 $("#token").val(FL.token);

	 					 $("#pay_method").submit();
					 }else {
						   switch (payment_code) {
						   	case "alipay":
						   		msg = '支付宝'
						   		break;
						   	case "wxpay":
						   		msg = '微信'
						   		break;
						   	case "jdpay":
						   		msg = '京东'
						   		break;
						   	default:
						   		msg = '该方式'
						   }
               layer.msg('暂不支持'+msg+'支付');
					 }
				}

			});

		}


	var OrderPay = function(){
		this.onLoad = function(){
			bindEvent();
		}
	}
	Global.Goods = Global.Goods||{};
	Goods.OrderPay = new OrderPay();
}(this);
