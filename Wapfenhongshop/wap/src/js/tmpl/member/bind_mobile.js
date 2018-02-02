/*************绑定手机*****************/
$(function(){

		//页面字段校验
		$("#mobileForm").validate({

	        rules: {
	
	            phone: {
	            	required:true,
	            	telephone:true
	            },
	
	            code: "required",
	            
				password:"required"
	        },
	
	        messages: {
	
	            phone: {
	            	required:"手机号不能为空！",
	            	telephone:"请填写正确的手机号"
	            },
	
	            code: "验证码必填",
	            
				password:"登录密码必填"
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
   
		function getCode(){
			var number = $("input[name='phone']").val();
			$.ajax({

				type:'get',

				url:WapSiteUrl+"/api/index.php?act=common_member&op=get_phone_code",

				data:{number:number,flag:"wap",reset:true},

				dataType:'json',

				success:function(result){
					if(result.error===0){

					}
				},
				error:function(xhr) {

				}

			});

		}
		//校验验证码
		function validCode(){

			var code = $("input[name='code']").val();
			var number = $("input[name='phone']").val();
			$.ajax({
				type:'post',

				url:WapSiteUrl+"/api/index.php?act=common_member&op=check_code",

				data:{num:number,code:code,flag:"wap"},

				dataType:'json',

				success:function(result){
					
				},
				error:function(xhr) {

				}
			})

		}
		//获取验证码
		$("#mobile-code").click(function(){
				FL.countDown(60,$("#mobile-code"));//获取验证码倒计时
				getCode();
		});
		//点击确定
		$("#bind-confirm").click(function(){
			 if($("#mobileForm").valid()){
			 	validCode();
			 }
		});

});