/*************收货地址*****************/
!function(Global) {
		
		var s_address_id=GetQueryString("address_id");
		var referurl = document.referrer; //上级网址
		
		if(sessionStorage.getItem('orderbackreferurl')){  //订单页面直接跳到新建地址 订单页面地址保存
			referurl = sessionStorage.getItem('orderbackreferurl');
		}
		if(referurl.indexOf('order_confirmation')>0){
			referurl = referurl.split('?')[1];
			referurl = referurl.split('&address_id=')[0];
			sessionStorage.setItem('referurl',referurl);
		}else{
			
			referurl = sessionStorage.getItem("referurl");
		}
		
		function loadData(){
			$.ajax({
		
				type:'post',
				
				url:WapSiteUrl+"/api/index.php?act=buyer_delivery&op=get_address",
		
				data:{mid:FL.mid,token:FL.token,flag:"wap"},
		
				dataType:'json',
		
				success:function(data){
		
					if(data&&data.error==="0"){
						var html = template.render("addressList",data);
		
						$("#address_list").empty();
		
						$("#address_list").append(html);
						
						var address_id=GetQueryString("address_id");
						
						if(address_id){
							for(var i =0;i<$(".adr-body").length;i++){
								if($($(".adr-body")[i]).attr("address_id")==address_id){
									$($(".adr-body")[i]).find(".left-icon").attr("class","icon-ok-sign left-icon");
								}
							}
						}else{
							$($(".adr-body")[0]).find(".left-icon").attr("class","icon-ok-sign left-icon");
						}
						
						bindEvent();
					}else if(data&&data.error=="0004"){
						var html = template.render("addressList",data);
		
						$("#address_list").empty();
		
						$("#address_list").append(html);
					}
		
				},
				error:function(xhr) {
		
				}
		
			});
		}
		function deleteAddress(me,address_id){
			
			$.ajax({

				type:'post',
				
				url:WapSiteUrl+"/api/index.php?act=buyer_delivery&op=del_address",
		
				data:{mid:FL.mid,token:FL.token,address_id:address_id,flag:"wap"},
		
				dataType:'json',
		
				success:function(data){
		
					if(data&&data.error==="0"){
						layer.msg("删除成功");
						$(me).parents(".adr-body").remove();
						$($(me).parents(".adr-body").siblings()[0]).remove();
					}
		
				},
				error:function(xhr) {
		
				}
		
			});
		}
	function bindEvent(){
	    //添加点击区域
	    $(".choose-adr").click(function(){
	    	var me = this;
	    	$(".left-icon").attr("class","icon-circle-blank left-icon");
	    	$(me).parent().find(".left-icon").attr("class","icon-ok-sign left-icon");
	    	var address_id = $(me).parents(".adr-body").attr("address_id");
	    	setTimeout(function(){
	    		location.replace("../order/order_confirmation.html?"+referurl+"&address_id="+address_id);
//               location.href=referurl+"&address_id="+address_id;
	    	},100);
	    });
	    
	    $(".choose-adr2").click(function(){
	    	var me = this;
	    	$(".left-icon").attr("class","icon-circle-blank left-icon");
	    	$(me).find(".left-icon").attr("class","icon-ok-sign left-icon");
	    	var address_id = $(me).parents(".adr-body").attr("address_id");
	    	setTimeout(function(){
                 location.replace("../order/order_confirmation.html?"+referurl+"&address_id="+address_id); 
//	    		 location.href=referurl+"&address_id="+address_id;
	    	},100);
	    });
	    
	    $(".adr-edit").click(function(){
	    	var me = this;
	    	var address_id = $(me).parents(".adr-body").attr("address_id");
	    	location.replace("add_address.html?address_id="+address_id+"&type=buy");
//          location.href=referurl+"&address_id="+address_id+"&type=buy";
	    });
		$(".adr-cancel").click(function(){
	    	var me = this;
	    	var address_id = $(me).parents(".adr-body").attr("address_id");
	    	deleteAddress(me,address_id);
	    });
	    var refer = document.referrer;
	    if(refer.indexOf("order_confirmation")>0){
			addcookie("orderUrl",refer);
		}
	   
	}
	 //监听返回按钮
	$(".goback").click(function(){
		var s_address_id = $(".icon-ok-sign").parents(".adr-body").attr("address_id");
		if(s_address_id){
			location.replace("../order/order_confirmation.html?"+referurl+"&address_id="+s_address_id); 
//          location.href=referurl+"&address_id="+s_address_id;
		}else{
			history.back();
            
		}
	});
	
	var Address = function(){
		this.onLoad = function(){
			loadData();
		}
	}
	Global.Member = Global.Member||{};
	Member.Address = new Address(); 

}(this);

