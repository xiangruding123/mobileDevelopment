!function(Global) {
  	var order_id = GetQueryString("order_id");
  	var rec_id = GetQueryString("rec_id");
  	var goods_num = GetQueryString('goods_num');
  	var imgUrl = '';
  	var way = GetQueryString("way")||GetQueryString("refund_type");//判断是否是待发货 类型  退款 1(待发货传1) 退货 2
  	var max_money;
  	function loadData(){
  		if(way==1){
  			$($(".tab")[1]).hide();
  			loadGoodsMsg(order_id);
  		}else{
  			loadGoodsMsg(order_id,rec_id);
  		}
  	}
  	//获取退款/退货信息
  	function loadGoodsMsg(order_id,rec_id){
  		$.ajax({
			type:"post",
			url:WapSiteUrl+"/api/index.php?act=buyer_order&op=get_refund_info",
			data:{flag:"wap",mid:FL.mid,token:FL.token,order_id:order_id,rec_id:rec_id},
			dataType:"json",
			success:function(data){
			
				if(data&&data.result){
					max_money = data.result.goods_pay_price;
					$("#max_money").text("最多￥"+data.result.goods_pay_price+"(已扣除优惠券￥"+data.result.coupon_deduct+"元)");
					$("#max_num").text("最多"+goods_num+"件");
					if(way==1||$(".active").attr("type")==1){
				//		$("#refund_amount").val(data.result.goods_pay_price);
				//		$("#refund_amount").attr("readonly","readonly");
					}else{
						$("#goods_num").show();
						$("#max_num").val(goods_num);
					}
					if(data.result.reason){
						 var html = template.render('refundReason', data.result);
						 $("#refund_reason").before(html);
					}
				}
			}
		});
  	}
  	function upLoadImage(me){
        var fd = new FormData();
        fd.append("mid", FL.mid);
        fd.append("token",FL.token);
        fd.append("flag","wap");
        fd.append("type","goods_refund");
        fd.append("img", $('#avatar')[0].files[0]);
		$.ajax({
			type:'post',
			url:WapSiteUrl+"/api/index.php?act=common_index&op=image_upload",
			processData:false,
			contentType:false,
			data:fd,
			dataType:"json",
			success:function(data){
				if(data&&data.error=="0"){
					$(me).parent().find("img").attr("src",data.result);
					$(me).parent().find("img").attr("class","refund-img");
					imgUrl += ","+data.result;
					$("#avatar").remove();
					if($(".refund-li").length<3){
						var dom = ' <li class="refund-li">'
				                    +'<input type="file" accept="image/*" capture=camera class="fh-file" id="avatar" name="avatar" />'
				                    +' <img class="width100" />'
				                   +'</li>';
						$("#refund_imgs").append(dom);
						$('#avatar').change(function(){ 
							var me = this;
						 	upLoadImage(me);
						});
					}
					
				}
			},
			error:function(xhr) {

			}

		});
	}
  	function bindEvent(){
  		$('.tab').click(function(){
  			var me = this;
  			$('.tab').removeClass("active");
  			$('.tab').find("i").remove();
  			$(me).addClass("active");
  			$(me).append('<i class="icon-ok"></i>');
  			if($(".active").attr("type")!=1){
  				$("#goods_num").show();
				$("#max_num").val(goods_num);
  			}else{
  				$("#goods_num").hide();
  			}
  		});
  		
			$('#avatar').change(function(){ 
				var me = this;
			 	upLoadImage(me);
			});
			//提交信息
			$("#submitForm").click(function(){
					var me = this;
					var refund_type = $(".active").attr("type");//1 退款 2退货
					var buyer_message = $("#buyer_message").val();
					var refund_amount = $("#refund_amount").val();
					var reason_id  = $("#reasons option:selected").val();
					var newImg = imgUrl.substr(1);
					var refund_num = $("#refund_num").val();
					if(!refund_amount){
						layer.msg("请输入退款金额");
					}else if(refund_amount>max_money){
						layer.msg("输入金额不得大于"+max_money);
					}else{
						if(way==1){//退款
							refundMoney(order_id,buyer_message,newImg);
						}else if(refund_type==1){//退货退款中的退款
							refundGoods(order_id,rec_id,buyer_message,refund_amount,reason_id,newImg,0,refund_type);
						}else{
							if(!refund_num&&refund_num!=0){
								layer.msg("请输入退货数量");
							}else if(refund_num>goods_num){
								layer.msg("输入数量不得大于"+goods_num);
							}else{
								refundGoods(order_id,rec_id,buyer_message,refund_amount,reason_id,newImg,goods_num,refund_type);
							}
							
						}
					}
			});
  	}
  	
  	function refundMoney(order_id,buyer_message,newImg){
  		$.ajax({
			type:"post",
			url:WapSiteUrl+"/api/index.php?act=buyer_order&op=add_refund_all",
			data:{flag:"wap",mid:FL.mid,token:FL.token,order_id:order_id,buyer_message:buyer_message,pic_info:newImg},
			dataType:"json",
			success:function(data){
				if(data&&data.error==0){
					layer.msg("提交成功");
					setTimeout(function(){
						location.href="refund_lists.html";
					},1000);
				}
			}
		});
  	}
  	
  	function refundGoods(order_id,rec_id,buyer_message,refund_amount,reason_id,newImg,goods_num,refund_type){
		$.ajax({
			type:"post",
			url:WapSiteUrl+"/api/index.php?act=buyer_order&op=add_refund",
			data:{flag:"wap",mid:FL.mid,token:FL.token,order_id:order_id,rec_id:rec_id,refund_amount:refund_amount,goods_num:goods_num,refund_type:refund_type,reason_id:reason_id,buyer_message:buyer_message,pic_info:newImg},
			dataType:"json",
			success:function(data){
				if(data&&data.error==0){
					layer.msg("提交成功");
					setTimeout(function(){
						location.href="refund_lists.html";
					},1000);
				}
			}
		});
  	}
	var ApplyService = function(){
		this.onLoad = function(){
			loadData();
			bindEvent();          
		 }
	}
	Global.Goods = Global.Goods||{};
	Goods.ApplyService = new ApplyService(); 

}(this);
