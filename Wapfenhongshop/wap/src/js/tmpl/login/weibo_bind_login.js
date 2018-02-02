/*************三方登录绑定注册*****************/
!function(Global){
	var infoStr =GetQueryString("infoStr") ;
	var info = JSON.parse(infoStr);
	var type = GetQueryString("type");
	//页面字段校验
	function validate(){
			
		$("#registerForm").validate({
	        rules: {
	
	            mobile: {
	            	required:true,
	            	telephone:true
	            },
	
	            code: "required"
	        },
	
	        messages: {
	
	            mobile: {
	            	required:"手机号不能为空！",
	            	telephone:"请填写正确的手机号"
	            },
	
	            code: "验证码必填"
				
				
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
		//获取验证码
		$("#getCode").click(function(){
			var me = this
//			var number = $("input[name='mobile']").val();
//			if(/^1[3|4|5|7|8|9][0-9]\d{4,8}$/.test(number)&&/^1\d{10}$/.test(number)){
//				$("#next_step").removeAttr("disabled");
//				FL.countDown(60,$("#getCode"));//获取验证码倒计时
//				var captchaNum = $("#secode").val();
//				FL.getCode(number,hashSecode,captchaNum);
//			}else{
//				layer.msg('请输入正确的手机号！');
//			}
             var number = $("input[name='mobile']").val();
			if(/^1[3|4|5|7|8|9][0-9]\d{4,8}$/.test(number)&&/^1\d{10}$/.test(number)&&!$("input[name='mobile']").hasClass('error')){
				var phoneNum = $("#mobile").val();
				
				FL.checkSecode($.trim($("#secode").val()),phoneNum,'getCode');
			}else{
				layer.msg('请输入符合规则的手机号！');
			}
		});
		//点击确定
		$("#next_step").click(function(){
			 if($("#registerForm").valid()){
			 	validCode();
			 }
		});
		//校验输入验证码是否正确
//		$("#secode").keyup(function(){
//			var me = this;
//			var phoneNum = $("#mobile").val();
//			if($(me).val().length==4){
//				FL.checkSecode($(me).val(),phoneNum,"getCode");
//			}else{
//				$("#getCode").attr("disabled","disabled");
//			}
//		});
	}
   	
	//校验验证码
	function validCode(){

		var code = $("input[name='code']").val();
		var number = $("input[name='mobile']").val();
		$.ajax({
			type:'post',

			url:WapSiteUrl+"/api/index.php?act=common_member&op=check_phone_code",

			data:{num:number,code:code,flag:"wap"},

			dataType:'json',

			success:function(result){
				if(result.error==="0"){
					checkMobile(number);
				}else{
					layer.msg(result.msg);
				}
			},
			error:function(xhr) {

			}
		});
		
	}
	
	
	//三方账号绑定手机号
	function bindLogin(number){
		var code = $("input[name='code']").val();
		$.ajax({
			type:'post',

			url:WapSiteUrl+"/api/index.php?act=common_member&op=third_bind",

			data:{info:infoStr,type:type,flag:"wap",mobile:number,code:code},

			dataType:'json',

			success:function(data){
				if(data&&data.error==0){
					addcookie('member_name', data.result.member_name);
	                addcookie('mid', data.result.member_id);                          
	                addcookie('token', data.result.token);
	                addcookie('member_mobile', data.result.member_mobile);
	                addcookie('store_id', data.result.store_id);
					addcookie('if_shoper', data.result.if_shoper);
					addcookie('talent_id', data.result.talent_id, 365);
					var backUrl = localStorage.getItem('thirdBack');
					localStorage.removeItem('thirdBack');//上级存储了页面地址  这里清空
					if(backUrl.indexOf('forget_pwd_two')>0||backUrl.indexOf('modify_password_two')>0||backUrl.indexOf('register2')>0||backUrl.indexOf('setting')>0||backUrl==""||backUrl.indexOf('bag_details')>0||backUrl.indexOf('fenhongshop')<0){
                        location.href = WapSiteUrl+'/wap/tmpl/member/person.html';
                    }else{
                    	location.href = backUrl;                    	
                    }
				}
				
			}
		});
	}
	//检测手机号是否已注册  否跳到设置密码页  是直接跳到首页
	function checkMobile(number){
		var code = $("input[name='code']").val();
		$.ajax({
			type:'get',

			url:WapSiteUrl+"/api/index.php?act=common_member&op=check_phone",

			data:{mobile:number,flag:"wap"},

			dataType:'json',

			success:function(data){
				if(data.error=='1000002'){
					bindLogin(number);
				}
				else if(data.error=='1000011'||data.error=='0'){
					var infoStr = JSON.stringify(info);
					
					register(infoStr,code,number,number);
				}
			}
		});
	}
	//会员注册
	function register(info,code,number,pwd){
		
		$.ajax({
			type:"post",
			url:WapSiteUrl+"/api/index.php?act=common_member&op=third_register",
			data : {flag:"wap",type:"sina",mobile:number,code:code,pwd:pwd,info:info},
			dataType:"json",
			success:function(data){ 
				if(data&&data.error==0){
					addcookie('member_name', data.result.member_name);
	                addcookie('mid', data.result.member_id);                          
	                addcookie('token', data.result.token);
	                addcookie('member_mobile', data.result.member_mobile);
	                addcookie('store_id', data.result.store_id);
					addcookie('if_shoper', data.result.if_shoper);
					addcookie('talent_id', data.result.talent_id, 365);
					localStorage.setItem("unionid",info.unionid);
					localStorage.setItem("info",JSON.stringify(info));
					var backUrl = localStorage.getItem('thirdBack');
					localStorage.removeItem('thirdBack');//上级存储了页面地址  这里清空
					if(backUrl.indexOf('forget_pwd_two')>0||backUrl.indexOf('modify_password_two')>0||backUrl.indexOf('register2')>0||backUrl.indexOf('setting')>0||backUrl==""||backUrl.indexOf('bag_details')>0||backUrl.indexOf('fenhongshop')<0){
                        location.href = WapSiteUrl+'/wap/tmpl/member/person.html';
                    }else{
                    	location.href = backUrl;                    	
                    }
				}
			}
		});
	}
	$("#img_secode").click(function(){
		FL.getHash("img_secode");
	});
	var WeiboBind = function(){
		this.onLoad = function(){
			FL.getHash("img_secode");
			validate();
			bindEvent();
		}
	}
	Global.Member = Global.Member||{};
	Member.WeiboBind = new WeiboBind(); 
}(this);