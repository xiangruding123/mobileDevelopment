/*************修改密码*****************/
$(function(){
		var num = GetQueryString("num");
		var code = GetQueryString("code");
		$("#registerForm").validate({
 			rules: {
				oldpwd:{
					required:true
				},
				
				newpwd:{
					required:true,
					minlength:6,
					maxlength:20
				}
	        },
	        messages: {
				oldpwd:{
					required:"请输入您的旧密码"
				},
				newpwd:{
					required:"请输入您的新密码",
					minlength:"密码长度不得小于6个字符",
					maxlength:"密码长度不得大于20个字符"
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
		//确定修改密码

		function modifyPwd(){
			var old_pwd = $("#old_pwd").val();
			var new_pwd = $("#new_pwd").val();
			$.ajax({

				type:'post',

				url:WapSiteUrl+"/api/index.php?act=common_member&op=change_pwd",

				data:{flag:"wap",mobile:num,code:code,newpwd:new_pwd,oldpwd:old_pwd,mid:FL.mid,token:FL.token},

				dataType:'json',

				success:function(data){
					if(data&&data.error==0){
						layer.msg("修改成功");
						delCookie("mid");
						delCookie("token");
						FL.token="";
						FL.mid = "";
						setTimeout(function(){
							FL.logLogin();
						},500);
					}
				},
				error:function(xhr) {

				}

			});

		}
		//点击确定
		$("#modify").click(function(){
			 if($("#registerForm").valid()){
			 	modifyPwd();
			 }
		});


});