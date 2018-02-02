$(function() {

  	var waybill_id = GetQueryString("waybill_id");

      FL.ajaxDate('get',wholesaler_query_express,{"waybill_id":waybill_id},function(database) {
      			if(database&&database.error==0){

      				if(database.result.data){
      					$("#eCode").text(database.result.com||"");
        					$("#shippingCode").text(database.result.nu||"");
        					if(database.result.data){
        						var html = template.render("deliver_tpl",database.result);
        						$("#deliver_info").html(html);
        					}
      				}


      				var dom = $(".lgt-ul").find("li")[0];
      				$(dom).addClass("focus-adr");
      				$(dom).find("span").addClass("active");
      				$("#status").text(database.result.state);
      			}else{
      				$("#status").text("商家备货中");
      			}

  	})

});
