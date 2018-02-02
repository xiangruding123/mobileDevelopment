/*************会员注册*****************/
!function(Global){
	var nickname_status=GetQueryString('nickname_status'),
	    surplus_time=GetQueryString('surplus_time'),
	    member_nickname = GetQueryString('member_nickname');
	    
	    if(member_nickname){
	    	 	$('#nickname').attr('placeholder',member_nickname);
	    }
	    if(nickname_status=='1'){
	    	$('#tip').text("修改昵称后，180天内将不能再次修改");
	    }else if(nickname_status=='2'){
	    	$('#tip').text(surplus_time+"天可后修改昵称");
	    	$('#nickname').attr('readonly','readonly');
	    }



	//页面字段校验
	function validate(){
			
		$("#modifyForm").validate({
	        rules: {
	
	            nickname: {
	            	required:true,
	            	minlength: 4
	            	
	            } 
	        },
	
	        messages: {
	
	            nickname: {
	            	required:"请输入昵称！",
	            	minlength:'请输入4-20个字的昵称'
	            }
				
	        },
		    errorPlacement: function(error, element) {
		        	var text = error.text();
		        	var dom =   '<div class="tooltip-top" role="tooltip">'
							      +'<div class="tooltip-arrow"></div>'
							      +'<div class="tooltip-in">'+text+'</div>'
							    +'</div>'
					$(".tooltip-top").remove();
					element.before(dom);
			}

   		 });
	}
	
	function bindEvent(){
		//保存
		$("#saveName").click(function(){
			if(nickname_status=='2'){
				location.replace("person_data.html");
			}else{
				if($("#modifyForm").valid()){
			 	
				 	var a = "^[a-zA-Z0-9_-\u4e00-\u9fa5]+$";
				 	var nickname = $("#nickname").val();
				 	if(/^[a-zA-Z0-9_\-+\u4e00-\u9fa5]+$/.test(nickname)){
				 		submitForm(nickname);
				 	}else{
				 		layer.msg("请输入由中英文、数字、“_”、“-”组成的字符");
				 	}
				 	
				 }
			}
			 
		});
	}
   
	//提交
	function submitForm(nickname){

		
		$.ajax({
			type:'post',

			url:WapSiteUrl+"/api/index.php?act=common_member&op=edit_member_info",

			data:{nickname:nickname,mid:FL.mid,token:FL.token,flag:"wap"},

			dataType:'json',

			success:function(result){
				if(result.error==="0"){
					layer.msg("保存成功");
					addcookie("nickname",nickname);
					setTimeout(function(){
						location.replace("person_data.html");
					},1000);
				}
			},
			error:function(xhr) {

			}
		});
		
	}
		
		
	var ModifyName = function(){
		this.onLoad = function(){
			validate();
			bindEvent();
		}
	}
	Global.Member = Global.Member||{};
	Member.ModifyName = new ModifyName(); 
}(this);