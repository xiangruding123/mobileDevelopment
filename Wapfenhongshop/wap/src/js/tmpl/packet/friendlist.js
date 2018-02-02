!function(Global) {
		

        //获取用户信息
	    
		
		
        function invitationRewards(mid,token,flag){
			$.ajax({
				type: "get",
				url: WapSiteUrl + "/api/index.php?act=buyer_coupon&op=invitation_rewards",
				data: {
					
					token: token,
					mid:mid,
					flag: flag
				},
				dataType: 'json',
				success: function(data) {
					
					if(data.error==='0'){

						template.helper("dateFormat",FL.dateFormat);
						var html = template.render('bagHistory',data);
						$('#articlebox').html(html);						
					}
					
					
				    },
				error:function(e){

				}
			});
		}
        
       
        
		var Friend = function(){
			this.onLoad = function(){
				  
				 var mid = getcookie('mid'),token = getcookie('token');
          
			     invitationRewards(mid,token,"wap");
                  

			}
			
		}

		Global.Packet = Global.Packet||{};
		Packet.Friend = new Friend();

}(this);
