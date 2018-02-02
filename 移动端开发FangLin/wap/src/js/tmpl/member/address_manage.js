/*************地址管理*****************/
!function(Global) {
	
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
					}
		
				},
				error:function(xhr) {
		
				}
		
			});
		}
	function bindEvent(){
	    $(".adr-edit").click(function(){
	    	var me = this;
	    	var address_id = $(me).parents(".adr-body").attr("address_id");
	    	location.href="add_address.html?address_id="+address_id;
	    });
		$(".adr-cancel").click(function(){
	    	var me = this;
			FL.addShade();
			$('#noinfoDialog').show();
			$('#leftbtn').click(function(){
				FL.removeShade();
				$('#noinfoDialog').hide();
			});
			$('#rightbtn').click(function(){
				FL.removeShade();
				$('#noinfoDialog').hide();
				var address_id = $(me).parents(".adr-body").attr("address_id");
				deleteAddress(me,address_id);
			});

	    });
	}
	
	var AddressM = function(){
		this.onLoad = function(){
			FL.judgeLogin();
			loadData();
		}
	}
	Global.Member = Global.Member||{};
	Member.AddressM = new AddressM(); 
 
}(this);

