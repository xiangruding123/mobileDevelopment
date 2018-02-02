/*************设置*****************/
!function(Global) {
	
	function bindEvent(){
		$("#logoutbtn").click(function(){
			$.ajax({
				type:'post',
				url:WapSiteUrl+"/api/index.php?act=common_member&op=logout",
				data:{mid:FL.mid,token:FL.token,flag:"wap"},
				dataType:'json',
				success:function(data){
					if(data&&data.error==0){						
                        FL.logLogin("true");//为true 在微信中也显示 登录页面
						delCookie("mid");
						delCookie("token");
						delCookie("member_name");
						delCookie("member_mobile");
						delCookie("nickname");
						delCookie("store_id");
						delCookie("if_shoper");
						delCookie("talent_id");
						delCookie("shop_id");
					}
				}
			});
			
		});
	}
	
	var Setting = function(){
		this.onLoad = function(){
			bindEvent();
		}
	}
	Global.Member = Global.Member||{};
	Member.Setting = new Setting(); 

}(this);
