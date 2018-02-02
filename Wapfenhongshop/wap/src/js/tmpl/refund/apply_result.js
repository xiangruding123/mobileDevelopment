!function(Global) {
  	var state_id = GetQueryString("state_id");
  	var refund_id = GetQueryString("refund_id");
  	var refund_type = GetQueryString("refund_type");
  	var order_id = GetQueryString("order_id");
  	function loadData(state_id,refund_id){
  		$.ajax({
  			type:"post",
			url:WapSiteUrl+"/api/index.php?act=buyer_order&op=get_refund_state",
			data:{flag:"wap",mid:FL.mid,token:FL.token,state_id:state_id,refund_id:refund_id},
			dataType:"json",
			success:function(data){
				if(data&&data.result){
					if(state_id==1){
						var days = Math.floor(data.result.countdown/86400); 
						var hours = Math.floor((data.result.countdown%86400)/3600); 
						var minutes = Math.floor(((data.result.countdown%86400)%3600)/60);
						var html = template.render("applyS1",data);
						$("#apply_s1").html(html);
						$("#days").text(days);
						$("#hours").text(hours);
						$("#minutes").text(minutes);
					}else if(state_id==2){
						$("#reason").text(data.result.seller_message);
					}else if(state_id==3){
						$("#seller_message").text(data.result.seller_message);
						getExpress();
						getAddress(refund_id);
						$("#sendGoods").click(function(){
							submitGoods();
						});
					}else if(state_id==4){
						getExpress();
						getAddress(refund_id);
					//	$("#express_msg option[value="++"]").attr("selected","selected")
						$("#modify").click(function(){
							submitGoods();
						});
						$("#getLogistics").click(function(){
							location.href="../logistics/logistics.html?order_id="+order_id;
						});
					}else if(state_id==7){
						loadDeatils(refund_id);
					}
				}
			}
  		})
  	}
  	//获取退货地址
  	function getAddress(refund_id){
  		$.ajax({
  			type:"post",
			url:WapSiteUrl+"/api/index.php?act=buyer_order&op=get_refund_address",
			data:{flag:"wap",mid:FL.mid,token:FL.token,refund_id:refund_id},
			dataType:"json",
			success:function(data){
				if(data&&data.result){
					$("#consignee").text(data.result.consignee||"");
					$("#tel").text(data.result.tel||"");
					$("#address").text(data.result.address||"");
				}
			}
		});
  	}
  	//获取快递列表
  	function getExpress(){
  		$.ajax({
  			type:"get",
			url:WapSiteUrl+"/api/index.php?act=common_index&op=get_express",
			data:{flag:"wap"},
			dataType:"json",
			success:function(data){
				if(data&&data.result){
					var html = template.render("expressMsg",data);
					$("#express_msg").html(html);	
				}
			}
		});
  	}
  	//提交退货发货信息
  	function submitGoods(){
  		var express_id = $("#express_msg option:checked").val();
  		var invoice_no = $("#invoice_no").val();
  		if(invoice_no==""){
  			layer.msg("请输入快递单号");
  		}else{
	  		$.ajax({
	  			type:"post",
				url:WapSiteUrl+"/api/index.php?act=buyer_order&op=refund_ship",
				data:{flag:"wap",mid:FL.mid,token:FL.token,refund_id:refund_id,express_id:express_id,invoice_no:invoice_no},
				dataType:"json",
				success:function(data){
					if(data&&data.error==0){
						layer.msg("提交成功");
						setTimeout(function(){
							location.href="refund_progress.html?refund_id="+refund_id;
						},1000);
					}
				}
			});
		}
  	}
  	//获取退货退款详情
  	function loadDeatils(refund_id){
  		$.ajax({
  			type:"post",
			url:WapSiteUrl+"/api/index.php?act=buyer_order&op=get_refund_detail",
			data:{flag:"wap",mid:FL.mid,token:FL.token,refund_id:refund_id},
			dataType:"json",
			success:function(data){
				template.helper("format", FL.dateFormat); 
				var html = template.render("refund",data);
				$(".row").append(html);
			}
		});
  	}
	var refundResult = function(){
		this.onLoad = function(){
			loadData(state_id,refund_id);
		//	bindEvent();
		 }
	}
	Global.Goods = Global.Goods||{};
	Goods.refundResult = new refundResult(); 

}(this);
