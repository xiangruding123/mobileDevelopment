/*************修改支付密码****************/
$(function(){

	//页面字段校验
	$("#modify_pwd").validate({

        rules: {

            code: "required",
            
            pwd : "required",
            
			password:{
				equalTo :"#pay_pwd",
				required : true
			}
        },

        messages: {

            code: "验证码必填",
            
			pwd:"请输入支付密码",
			
			password: {
				required:"请输入确认密码",
            	equalTo:"两次输入密码不一致！"
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
		//确定修改
		$("#confirm").click(function(event) {
			$("#modify_pwd").valid();
				//confirmModify();
		});
		//获取验证码
		$("#getCode").click(function(event) {
				FL.countDown(60,$("#getCode"));
			//	getCode();
		});
		
		function getCode(){
			//取手机号
			
			$.ajax({

				type:'get',

				url:ApiUrl+"/index.php?act=security&op=get_phone_code",

				data:{number:number},

				dataType:'json',

				success:function(result){
					if(result.datas===1){

					}
				},
				error:function(xhr) {

				}
			});
		}
		
});