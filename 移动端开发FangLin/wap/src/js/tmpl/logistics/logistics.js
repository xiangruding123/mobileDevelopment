$(function() {
    'use strict';
  	var order_id = GetQueryString("order_id");
	$.ajax({
		type: "get",
		url:  WapSiteUrl + '/api/index.php?act=buyer_delivery&op=query_express',
		data:{mid:FL.mid,token:FL.token,order_id:order_id,flag:"wap"},
		dataType: 'json',
		success: function(data) {
			if(data&&data.error==0){
				
				
				if(data.result.home_express_info){
					$("#eCode").text(data.result.home_express_info.com||"");
  					$("#shippingCode").text(data.result.home_express_info.nu||"");
  					if(data.result.home_express_info.data){
  						var html = template.render("deliver_tpl",data.result.home_express_info);
  						$("#deliver_info").html(html);
  					}
				}
				
				if(data.result.foreign_express_info){
					$("#eCode").text(data.result.foreign_express_info.com||"");
  					$("#shippingCode").text(data.result.foreign_express_info.nu||"");
  					if(data.result.foreign_express_info.data){
						var html = template.render("deliver_tpl",data.result.foreign_express_info);
						$("#deliver_info").append(html);
					}
				}
				var dom = $(".lgt-ul").find("li")[0];
				$(dom).addClass("focus-adr");
				$(dom).find("span").addClass("active");
				$("#status").text(data.result.state_info);
			}else{
				$("#status").text("商家备货中");
			}
			
		}
	});

});
