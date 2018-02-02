!function(Global) {
  	var page;
  	var refund_id = GetQueryString("refund_id");
  	var order_id = GetQueryString("order_id");
  	function loadData(refund_id){
  		$.ajax({
			type:"post",
			url:WapSiteUrl+"/api/index.php?act=buyer_order&op=get_refund_progress",
			data:{flag:"wap",mid:FL.mid,token:FL.token,refund_id:refund_id},
			dataType:"json",
			success:function(data){
				if(data&&data.result){
					var refund_type = data.result.refund_type;
					var state_id = data.result.refund_state;
					//跟踪走到哪一步
					if(refund_type==2){
						for(var i=0;i<state_id;i++){
							if(i==0){
								$($(".lgt-left")[i]).find("img").attr("src","../../images/wap/refund-"+(i+1)+"-ok.svg");
								$($(".lgt-left")[i]).find(".lgt-p").addClass("colorOk");
								$($(".lgt-left")[i+1]).find("img").attr("src","../../images/wap/refund-"+(i+1)+"-loading.svg");
							}else if(i==1){
								$($(".lgt-left")[1]).find("img").attr("src","../../images/wap/refund-"+(i+1)+"-ok.svg");
								$($(".lgt-left")[1]).find(".lgt-p").addClass("colorError");
								$($(".lgt-left")[1]).find(".lgt-p").text("卖家拒绝申请");
							}else if(i==2){
								$($(".lgt-left")[1]).find("img").attr("src","../../images/wap/refund-"+(i+1)+"-ok.svg");
								$($(".lgt-left")[1]).find(".lgt-p").removeClass("colorError");
								$($(".lgt-left")[1]).find(".lgt-p").addClass("colorOk");
								$($(".lgt-left")[1]).find(".lgt-p").text("卖家同意申请");
								$($(".lgt-left")[2]).find("img").attr("src","../../images/wap/refund-"+(4)+"-loading.svg");
							}else if(i==3){
								$($(".lgt-left")[i-1]).find("img").attr("src","../../images/wap/refund-"+(i+1)+"-ok.svg");
								$($(".lgt-left")[i-1]).find(".lgt-p").addClass("colorOk");
								$($(".lgt-left")[i]).find("img").attr("src","../../images/wap/refund-"+(i+2)+"-loading.svg");
							}else if(state_id==5&&i==4){
								$($(".lgt-left")[i-1]).find("img").attr("src","../../images/wap/refund-"+(i+1)+"-error.svg");
								$($(".lgt-left")[i-1]).find(".lgt-p").text("卖家未收到货物");
							}else if(i==5){
								$($(".lgt-left")[i-2]).find("img").attr("src","../../images/wap/refund-"+(i)+"-ok.svg");
								$($(".lgt-left")[i-2]).find(".lgt-p").addClass("colorOk");
								$($(".lgt-left")[i-1]).find("img").attr("src","../../images/wap/refund-"+(i+1)+"-loading.svg");
							}else if(i==6){
								$($(".lgt-left")[i-2]).find("img").attr("src","../../images/wap/refund-"+(i)+"-ok.svg");
								$($(".lgt-left")[i-1]).find("img").attr("src","../../images/wap/refund-"+(i)+"-ok.svg");
								$($(".lgt-left")[i-1]).find(".lgt-p").addClass("colorOk");
								$($(".lgt-left")[i-2]).find(".lgt-p").addClass("colorOk");
								$($(".lgt-left")[i-1]).find(".lgt-p").text("款项已到帐,退货完成");
							}
						}
						
						if(state_id>5){
							page = state_id-3;
						}
						else if(state_id>=3&&state_id<=5){
							page = state_id-2;
						}else if(state_id==2){
							page = 0 ;
						}else{
							page = state_id-1;
						}
						$($(".lgt-left")[page+1]).click(function(){
							location.href = 'apply_result_'+state_id+'.html?refund_id='+refund_id+'&state_id='+state_id+'&refund_type='+refund_type+'&order_id='+order_id;
						});
					}else if(refund_type==1){
						$($(".lgt-left")[2]).parent().remove();
						$($(".lgt-left")[2]).parent().remove();
						for(var i=0;i<state_id;i++){
							if(i==0){
								$($(".lgt-left")[i]).find("img").attr("src","../../images/wap/refund-"+(i+1)+"-ok.svg");
								$($(".lgt-left")[i]).find(".lgt-p").addClass("colorOk");
								$($(".lgt-left")[i+1]).find("img").attr("src","../../images/wap/refund-"+(i+1)+"-loading.svg");
							}else if(i==1){
								$($(".lgt-left")[1]).find("img").attr("src","../../images/wap/refund-"+(i+1)+"-ok.svg");
								$($(".lgt-left")[1]).find(".lgt-p").addClass("colorError");
								$($(".lgt-left")[1]).find(".lgt-p").text("卖家拒绝申请");
							}else if(i==2){
								$($(".lgt-left")[1]).find("img").attr("src","../../images/wap/refund-"+(i+1)+"-ok.svg");
								$($(".lgt-left")[1]).find(".lgt-p").removeClass("colorError");
								$($(".lgt-left")[1]).find(".lgt-p").addClass("colorOk");
								$($(".lgt-left")[1]).find(".lgt-p").text("卖家同意申请");
								$($(".lgt-left")[2]).find("img").attr("src","../../images/wap/refund-"+(6)+"-loading.svg");
							}else if(i==6){
								$($(".lgt-left")[2]).find("img").attr("src","../../images/wap/refund-"+(6)+"-ok.svg");
								$($(".lgt-left")[3]).find("img").attr("src","../../images/wap/refund-"+(7)+"-ok.svg");
							}
						}
						
						if(state_id<=3){
							page = state_id-1;
							if(state_id==3){
								state_id=6;
							}
						}else if(state_id==7){
							page = 3;
						}
						$($(".lgt-left")[page]).click(function(){
							location.href = 'apply_result_'+state_id+'.html?refund_id='+refund_id+'&state_id='+state_id+'&refund_type='+refund_type+'&order_id='+order_id;
						});
					}
					if(refund_type==2){
					
					
					}
					
					
				}
			}
		});
  	}
	var Progress = function(){
		this.onLoad = function(){
			loadData(refund_id);
		 }
	}
	Global.Goods = Global.Goods||{};
	Goods.Progress = new Progress(); 

}(this);
