/*************购物车*****************/
!function(Global){
		var cart_info,if_cart,area,vat_hash,offpay_hash,offpay_hash_batch,pay_sn,pay_amount,cert_num,coupon_id,coupon_price=0,pay_money,newMoney,seckilling_goods;
		var custom_index;//海关序号
		var custom_claim;
		var resource_tags=GetQueryString("resource_tags");
	    var pintuan_id = GetQueryString("pintuan_id"),
	        pintuan_group_id = GetQueryString("pintuan_group_id"),
	        pintuan_parent_id = GetQueryString("pintuan_parent_id");
		function loadGoods(){
			cart_info = GetQueryString("cart_info");
			if_cart = GetQueryString("if_cart");
			area = GetQueryString("area");
			seckilling_goods  = ""+GetQueryString("miaosha");
			var address_id = GetQueryString("address_id");
			if(!address_id){
				addcookie("cart_info",cart_info);
				addcookie("if_cart",if_cart);
				addcookie("area",area);
			}
			addGoods(address_id);
		}
		//校验购物车信息
		function addGoods(address_id){
			cart_info = unescape(getcookie("cart_info"));
			if_cart = getcookie("if_cart");
			area = getcookie("area");
			var member_store_id = getcookie("member_store_id");
			if(member_store_id&&address_id){
				var data = {mid:FL.mid,flag:"wap",token:FL.token,cart_info:cart_info,if_cart:if_cart,member_store_id:member_store_id,address_id:address_id,area:area};
			}else if(member_store_id&&!address_id){
				var data = {mid:FL.mid,flag:"wap",token:FL.token,cart_info:cart_info,if_cart:if_cart,member_store_id:member_store_id,area:area};
			}else if(!member_store_id&&address_id){
				var data = {mid:FL.mid,flag:"wap",token:FL.token,cart_info:cart_info,if_cart:if_cart,address_id:address_id,area:area};
			}else{
				var data = {mid:FL.mid,flag:"wap",token:FL.token,cart_info:cart_info,if_cart:if_cart,area:area};
			}
			$.ajax({
				type:'post',

				url:WapSiteUrl+"/api/index.php?act=buyer_cart&op=check_cart",

				data:data,

				dataType:'json',

				success:function(data){
					if(data&&data.error=="0"){
						vat_hash = data.result.vat_hash;
						offpay_hash = data.result.offpay_hash;
						offpay_hash_batch = data.result.offpay_hash_batch;


						//海关序号
						custom_index = data.result.custom_index;

						custom_claim = data.result.custom_claim;

						 addcookie("area",area);
                         addcookie("custom_index",custom_index);
						//地址获取
						var adrDom = template.render("my_address",data.result);
						$("#myAddress").empty();
						$("#myAddress").html(adrDom);

						if(data.result.address){
							cert_num = data.result.address.cert_num;
						}
						//商品获取
						if(data.result.store_cart_list){
							template.helper("floatPrice",floatPrice);
							var dom = template.render("goods_details",data.result);
							$("#goods-list").empty();
							$("#goods-list").html(dom);

							if(area&&area!=0){
								addDuty(data.result.store_cart_list[0].goods_list);//添加税
							}
						}else{
							history.go(-1);
						}

						// 不配送地区商品列表
						if(data.result.not_deliver_areas_goods_list&&data.result.not_deliver_areas_goods_list.length>0){
							FL.addShade();
							$('#noinfoDialog').show();
							$('#leftbtn').click(function(){
								location.href="../member/address.html?address_id="+data.result.address.address_id;
							});
							$('#rightbtn').click(function(){
								area=="0"?location.href="../shopping/shopping_cart_cn.html":location.href="../shopping/shopping_cart_global.html";
							});
						}


						//大v优惠
						if(data.result.micro_shoper_save_desc||(data.result.micro_shoper_save_money>0)){
							$('#shoper_save').show();
							$('#shoper_save span.pull-left').text(data.result.micro_shoper_save_desc);
							$('#shoper_save span.fh-black').text('- ￥'+data.result.micro_shoper_save_money.toFixed(2));
						}

						//是否符合秒杀
						var sek_dom = $(".seckill-goods");
						if(sek_dom.length>0){
							for(var i=0;i<sek_dom.length;i++){
								var limit  = $(sek_dom[i]).attr("top_limit");
								var num = $(sek_dom[i]).attr("goods_num");
								var old_price =  $(sek_dom[i]).attr("old_price");
								if(num>limit){
									$(sek_dom[i]).text("￥"+old_price);
								}
							}
						}
						//套装详情点击事件
						$(".bl-ul").click(suitClick);
						//判断红包功能是否关闭
						var bagStatus = FL.functional_control();
						var bagIsOpen = bagStatus.type;
						var functionalName = bagStatus.name;
						if(functionalName=="hongbao"&&(bagIsOpen=="all"||bagIsOpen.indexOf("wap")>-1)){
							$("#tickets").show();
							var msg = bagStatus.message;
							var url = bagStatus.url;
							$("#ticket_num").attr("class","noticket");
							$("#ticket_num").text(msg);
							if(url){
								$("#tickets").click(function(){
									location.href = url;
								});
							}

						}else{
							//判断是否有可用的优惠券
							if(data.result.coupon_list&&data.result.coupon_list.available){
								var count =0;
								for(var i in data.result.coupon_list.available){
									count += 1;
								}


								if(count!=0){
									$("#ticket_num").text(count+"张优惠券可用");
									bindTicket();
									$("#tickets").show();
									$("#tickets_cancel").show();
									$("#use").text(count);

									var phoneHeight = document.documentElement.clientHeight;
									var scrollHeight = phoneHeight-93;
									;

									$("#ticket").css("height",phoneHeight+"px");
									$("#bag_lists,#un_bag_lists").css({"height":scrollHeight+"px","overflow":"scroll"});
									var screenWidth = $(document).width();

									if(screenWidth>640){
										var leftWidth =  (screenWidth-640)/2;
										$("#ticket").css("left",leftWidth+"px");
									}

									template.helper("format", FL.dateFormat);
									var html = template.render("bagLists",data.result.coupon_list);
									$("#bag_lists").empty();
									$("#bag_lists").html(html);
									chooseBag();
								}
							}
							if(data.result.coupon_list&&data.result.coupon_list.unavailable){
								var uncount =0;
								for(var i in data.result.coupon_list.unavailable){
									uncount += 1;
								}
								$("#unuse").text(uncount);
								template.helper("format", FL.dateFormat);
								var unHtml = template.render("unBagLists",data.result.coupon_list);
								$("#un_bag_lists").empty();
								$("#un_bag_lists").html(unHtml);
								$("#un_bag_lists").append("<div style='height:30px;width:100%;background:#f0f0f0'></div>");
							}
						}
						calculatePrice();



					}
				},
				error:function(xhr) {

				}
			});
		}
		//绑定优惠券点击
		function bindTicket(){
			$("#tickets").click(function(){
				$("#ticket").show();
			});
			//隐藏红包
			$("#hideBag").click(function(){
				$("#ticket").hide();
			});
			$(".bag-nav li").click(function(){
				var me = this;
				var id = $(me).attr("tabId");
				if(id==0){
					$("#un_bag_lists").hide();
					$("#bag_lists").show();
				}else{
					$("#bag_lists").hide();
					$("#un_bag_lists").show();
				}
				$(me).addClass('selected').siblings('li').removeClass('selected');
			});
		}
		//红包选中
		function chooseBag(){
			//选中红包
			$(".single-bag").click(function(){
				var me = this;
				coupon_id = $(me).attr("coupon_id");
				coupon_price = $(me).attr("coupon_price");
				$("#ticket_num").text("已选中一张￥"+parseFloat(coupon_price).toFixed(2)+"的优惠券");
				$(".bag-i").attr("class","icon-circle-blank bag-i");
				$(me).find("i").attr("class","icon-ok-sign bag-i");
				$("#cancelMoney").text("-￥"+parseFloat(coupon_price).toFixed(2));
				setTimeout(function(){
					$("#ticket").hide();
				},200);
				if(!isNaN(pay_money)){
					newMoney = (pay_money - coupon_price).toFixed(2);
					newMoney<=0?newMoney='0.00':newMoney;
					$("#total_price").text("￥"+newMoney);
				}
			});
		}
		//计算价格
		function calculatePrice(){
		//	var goodsNum = $("#goods-list").find(".container");
			var storeNum = $("#goods-list").find(".store_goods");//以店铺来计算金额
			var countNum = 0;
			var totalPrice = parseFloat("0.00"),
				dutyPrice =  parseFloat("0.00");//关税
				freightPrice = parseFloat("0.00");//运费
			for(var i = 0;i<storeNum.length;i++){
				var goodsNum = $(storeNum[i]).find(".container");//计算每个店铺的商品
				var prompt = $(storeNum[i]).find(".prompt").attr('free_freight_list');
				var s_countNum=0,
					s_all = parseFloat("0.00"),//加运费关税所有价格
				    s_totalPrice = parseFloat("0.00"),
					s_dutyPrice =  parseFloat("0.00"),//关税
					s_freightPrice = parseFloat($(storeNum[i]).find(".express_price").text().slice(1));
				for(var j=0;j<goodsNum.length;j++){
					var price = $(goodsNum[j]).find(".goods-price").text().slice(1);
					var num = $(goodsNum[j]).find(".module-num").text().slice(1);
					var hs_rate  = goodsNum.attr("hs_rate");
					if($(goodsNum[j]).find(".bl-ul li").length!=0){
						var partNum = $(goodsNum[j]).find(".bl-ul li").length*num;
						s_countNum = s_countNum + partNum;
					}else{
						s_countNum += parseInt(num);
					}
					s_totalPrice += parseFloat(price*num);
//					s_dutyPrice += parseFloat(price*num*hs_rate);
				}

				s_dutyPrice=parseFloat($(storeNum[i]).attr('dutyPrice'));

				if(area&&area!=0){
					$("#duty").show();
//					if(s_dutyPrice<=50){
//						$(storeNum[i]).find("#dutyMoney").text("￥"+s_dutyPrice.toFixed(2));
//						s_dutyPrice =0;
//					}else{
						$("#dutyMoney").removeClass("crossed");
						$(storeNum[i]).find("#dutyMoney").text("￥"+s_dutyPrice);
//					}
					$(".free-duty").show();
				}
				//店铺优惠
				var s_storePrice = $(storeNum[i]).find("#youhui .fh-black").text().slice(2);
				s_all = (s_totalPrice+s_dutyPrice+s_freightPrice-s_storePrice).toFixed(2);
				totalPrice +=parseFloat(s_all);
				countNum += s_countNum;
				$(storeNum[i]).find(".real_price").text("￥"+s_totalPrice.toFixed(2));
				if(s_totalPrice<prompt){
					$('.prompt').hide();
				}
			}
			var totalNum = getcookie("cartGoodsNum");
			totalPrice = totalPrice-$('.shoper_save').text().split('￥')[1];
			$("#total_num").html("共 "+totalNum+" 件");
			if(isNaN(totalPrice)){
				$("#total_price").html("");
			}else{
				$("#total_price").html("￥"+totalPrice.toFixed(2));
			}
			pay_money = totalPrice;

		}
		//生成订单
		function makeOrder(){
			var address_id = $(".adr-body").attr("address_id");
			var passData;
			if(coupon_id){
				passData = {mid:FL.mid,flag:"wap",token:FL.token,seckilling_goods:seckilling_goods,cart_info:cart_info,if_cart:if_cart,area:area,address_id:address_id,vat_hash:vat_hash,offpay_hash:offpay_hash,offpay_hash_batch:offpay_hash_batch,coupon_id:coupon_id,pintuan_id:pintuan_id,pintuan_group_id:pintuan_group_id,pintuan_parent_id:pintuan_parent_id,resource_tags:resource_tags};
			}else{
				passData = {mid:FL.mid,flag:"wap",token:FL.token,seckilling_goods:seckilling_goods,cart_info:cart_info,if_cart:if_cart,area:area,address_id:address_id,vat_hash:vat_hash,offpay_hash:offpay_hash,offpay_hash_batch:offpay_hash_batch,pintuan_id:pintuan_id,pintuan_group_id:pintuan_group_id,pintuan_parent_id:pintuan_parent_id,resource_tags:resource_tags};
			}


			$.ajax({
				type:'post',

				url:WapSiteUrl+"/api/index.php?act=buyer_order&op=submit",

				data:passData,

				dataType:'json',

				success:function(data){
					if(data&&data.error==0){
						pay_sn = data.result.pay_sn;
						pay_amount = data.result.pay_amount;
						payment = data.result.payment_list.join("|");
						if(pay_amount==0){
							location.href="order_success.html?pay_sn="+pay_sn+"&pay_amount="+pay_amount+"&type=coupon&payment="+payment;
						}else{
							location.href="order_pay.html?pay_sn="+pay_sn+"&pay_amount="+pay_amount+"&payment="+payment;
						}

						/*$("#pay_method").show();
						FL.addShade();
						FL.closeDiv('#pay_method', 'hide');*/
					}else{
						layer.msg(data.msg);
					}
				}
			})
		}

		function bindEvent(){
			//选择支付方式
			$(".pay-chose").click(function(){
				var me = this;
				$(".pay-chose").attr("class","icon-circle-blank pay-chose");
				$(me).attr("class","icon-ok-sign pay-chose");
			});
			//生成订单
			$("#pay_money").click(function(){
				if($('#agree_select').attr("class").indexOf("icon-ok-circle")>=0){

					var address_id = $(".adr-body").attr("address_id");
					var ua = navigator.userAgent.toLowerCase();
					if(ua.match(/MicroMessenger/i)=="micromessenger"&&area==1&&custom_index==1) {
//						$("#no_wxpay").show();
//						setTimeout(function(){
//							$("#no_wxpay").hide();
//						},5000);

				 	}else{
				 		if(area==0){
							if(address_id){
								makeOrder();
							}else{
								layer.msg("请添加收货地址");
							}
						}else if(area!=0){
							if(address_id)
							{
								if(cert_num==""&&custom_claim==1)
								{
									layer.msg("购买国外商品收货地址要填写身份证信息",{time:4000});
									$("#myAddress").css("border","2px solid #fa2855");
								}
								else {
									makeOrder();
								}
							}
							else {
								layer.msg("请添加收货地址");
							}
						}
				 	}
				}

			});
			$("#no_wxpay").click(function(){
				$("#no_wxpay").hide();
			});
		/*	//监听返回按钮
			$(".goback").click(function(){
				var historyNum = window.history.length;
				location.href = referurl;
			});*/
            //选择协议按钮
			$('#agree_select').click(function(){
				var that = this;
				if($(that).attr("class").indexOf("icon-ok-circle")>=0){
					$(that).removeClass("icon-ok-circle").addClass("icon-circle-blank");
					$("#pay_money").css("background-color","#666");
				}else{
					$(that).removeClass("icon-circle-blank").addClass("icon-ok-circle");
					$("#pay_money").css("background-color","#fa2855");
				}
			});
		}
		//判断国内外商品
		function addDuty(data){
			var dutyPrice =0;
			for(var i=0;i<data.length;i++){

			}
			$("#duty").show();
		}

		/*************************************套装详情*********************************************/
		function suitClick(){
			var me = this;
			var suit_goods_id = $(me).attr("goods_id");
			var suit_bl_id = $(me).attr("bl_id");
			loadSuitList(suit_goods_id,suit_bl_id);
			var scrollHeight =document.body.clientHeight-48;
			$("#suit").css("height",(document.body.clientHeight+50)+"px");
			$("#suit_list").css({"height":scrollHeight+"px","overflow":"scroll"});
			var screenWidth = document.body.clientWidth;
			if(screenWidth>640){
				var leftWidth =  (screenWidth-640)/2;
				$("#suit").css("left",leftWidth+"px");
			}
			$("#suit").show();
			$("body").css("overflow","hidden");
		}

		$("#hideSuit").click(function(){
			$("#suit").hide();
			$("body").css("overflow","auto");
		});
		//根据goods_id加载套装详情
		function loadSuitList(suit_goods_id,suit_bl_id){
			$.ajax({
				type:'get',
				url:WapSiteUrl+"/api/index.php?act=common_goods&op=get_bundling_combo",
				data:{goods_id:suit_goods_id,flag:"wap"},
				dataType:'json',
				success:function(data){
					if(data&&data.error==0){

						var blData,savePrice;
						for(var i=0;i<data.result.bundling.length;i++){
							if(data.result.bundling[i].bl_id==suit_bl_id){
								blData = data.result.bundling[i];
								//计算省下的钱
								savePrice = blData.cost_price - blData.current_price;
							}
						}
						var html = template.render("suitList",blData);
						$("#suit_list").html(html);
						$("#save_price").text("立省"+savePrice.toFixed(2)+"元");
					}else{
						layer.msg(data.msg);
					}
				}
			})
		}
		//float格式化
		function floatPrice(price){
			return parseFloat(price).toFixed(2);
		}


	var Confirmation = function(){
		this.onLoad = function(){
			FL.judgeLogin();
			loadGoods();
			bindEvent();
		}
	}
	Global.Goods = Global.Goods||{};
	Goods.Confirmation = new Confirmation();
}(this);
