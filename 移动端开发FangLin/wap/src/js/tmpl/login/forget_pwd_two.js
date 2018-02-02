/*************会员注册*****************/
!function(Global){




	//页面字段校验
	function validate(){

		$("#forgetPwd2Form").validate({
	        rules: {
	            password:{
					required:true,
					minlength:6,
					maxlength:20
				},

	            confirm_password:{
	            	required:true,
	            	equalTo:"#password"
	            }
	        },

	        messages: {
	            password:{
					required:"登录密码必填",
					minlength:"密码长度不得小于6个字符",
					maxlength:"密码长度不得大于20个字符"
				},

	            confirm_password:{
	            	required:"请输入您的确认密码",
	            	equalTo:"两次输入密码不一致"
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
		//点击确定
		$("#confirm").click(function(){
			 if($("#forgetPwd2Form").valid()){
			 	modifyPwd();
			 }
		});
	}

	//校验验证码
	function modifyPwd(){
			var number = GetQueryString("number");
			var code =  GetQueryString("code");
			var pwd  = hex_md5($("#password").val());
			$.ajax({
				type:'post',

				url:WapSiteUrl+"/api/index.php?act=common_member&op=reset_pwd",

				data:{phone:number,code:code,flag:"wap",pwd :pwd},

				dataType:'json',

				success:function(data){
					if(data.error==="0"){
						layer.msg("修改成功");
						delCookie("mid");
						delCookie("token");
						FL.token="";
						FL.mid = "";
						setTimeout(function(){
							FL.logLogin();
						},1000);
					}
				},
				error:function(xhr) {

				}
			});



	}


	var ForgetPwd2 = function(){
		this.onLoad = function(){
			validate();
			bindEvent();
		}
	}
	Global.Member = Global.Member||{};
	Member.ForgetPwd2 = new ForgetPwd2();
}(this);
