/*************会员注册*****************/
!function(Global){

		//var key = getcookie('key');

		/*if(key==''){

			location.href = 'login.html';

		}*/

		
		
			
			
	//页面字段校验
	function validate(){
			
		$("#registerForm").validate({
	        rules: {
	
				password:{
					required:true,
					minlength:6,
					maxlength:20
				},
				com_pwd:{
					required:true,
					equalTo:"#login_pwd"
				}
	        },
	
	        messages: {
	
				password:{
					required:"登录密码必填",
					minlength:"密码长度不得小于6个字符",
					maxlength:"密码长度不得大于20个字符"
				},
				com_pwd:{
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
		//注册
		$("#register").click(function(){
			 if($("#registerForm").valid()){
			 	register();
			 }
		});
	}
   
	//会员注册
	function register(){
		var code = GetQueryString("code");
		var number = GetQueryString("num");
		var pwd = $("input[name='password']").val();
		$.ajax({
			type:"post",
			url:WapSiteUrl+"/api/index.php?act=common_member&op=register",
			data : {flag:"wap",mobile:number,code:code,password:pwd},
			dataType:"json",
			success:function(data){ 
				if(data.error==="0"){
					layer.msg("注册成功");
					loginIn(number,pwd);
				}
			}
		});
	}
	function loginIn(username,pwd){
		$.ajax({
                type: 'post',
                url: WapSiteUrl + "/api/index.php?act=common_member&op=login",
                data: {
                    account: username,
                    password: pwd,
                    flag: "wap"
                },
                dataType: 'json',
                success: function(data) {
                    if (data.error === '0') {
                        addcookie('member_name', data.result.member_name);
                        addcookie('mid', data.result.member_id ,365);                          
                        addcookie('token', data.result.token ,365);
                        addcookie('member_mobile', data.result.member_mobile);
                        addcookie('nickname',data.result.member_nickname);
                        addcookie('store_id', data.result.store_id ,365);
						addcookie('if_shoper', data.result.if_shoper ,365);
                        location.href="../member/person.html";
                    }
                },
                error:function(xhr){
                }
            });
	}
		
	var Register2 = function(){
		this.onLoad = function(){
			validate();
			bindEvent();
		}
	}
	Global.Member = Global.Member||{};
	Member.Register2 = new Register2(); 
}(this);