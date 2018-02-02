/*************会员注册*****************/
!function(Global){
	var account = getcookie('member_mobile')||"";
	//页面字段校验
    $('.merber').text(account);
	function pageInit(){
		FL.ajaxDate('get',sms_code_init,{mobile:account},
			function(data){
				if(data.error==="0"){
					var res = data.result;
					countdown = res.countdown;
					if_captcha = res.if_captcha;
					mobile_correct = res.mobile_correct;
					sms_available = res.sms_available;
					$('#getCode').attr('countdown',countdown);
					
					if(res.last_countdown){
						FL.countDown(res.last_countdown,$('#getCode'));
					}

					if(if_captcha=='1'){//显示图文验证码
						$("#img_secode").attr("src",WapSiteUrl+"/api/index.php?act=common_index&op=get_captcha&flag=wap&mobile="+account);
						bindEvent();
					}else{
						$('#secodebox').hide();
						bind();
					}

					$('.cleareye').click(function(){
						if($('#password').attr('type')=='text'){
							$('#password').prop("type","password");
							$('.cleareye').prop('src','../../src/images/wap/login/eye.png');
						}else{
							$('#password').prop("type","text");
							$('.cleareye').prop('src','../../src/images/wap/login/eyeclick.png');
						}

					});
					$('.cleartext').click(function(){
						$(this).parent('div').find('input').val('').focus();
						$(this).hide();
					});
				}
			}
		);

	}
	function bind(){
		//获取验证码
		$("#getCode").click(function(){
			if($('#getCode').hasClass('nogetcode')){
				$('#secodebox').show();
				$("#img_secode").attr("src",WapSiteUrl+"/api/index.php?act=common_index&op=get_captcha&flag=wap&mobile="+account);				
				bindEvent();
			}else{
				var time = $('#getCode').attr('countdown');
				$('#code').focus();
				FL.getSmsCode(account,time,'getCode');
			}
			
		});

		$('#code').keyup(function(){
			var me = this;
			var len = $(me).val().length;
			len>1?$('.cleartext').show():$('.cleartext').hide();
			var l = $('#password').val().length;
			if(l>5&&l<21&&len>3){

				$("#nextStep").removeAttr('disabled');

			}else{
				$("#nextStep").attr('disabled','disabled');
			}
		})

		$('#password').keyup(function(){
			var me = this;
			var len = $(me).val().length;

			if(len>5&&len<21&&$('#code').val().length>3){

				$("#nextStep").removeAttr('disabled');

			}else{
				$("#nextStep").attr('disabled','disabled');
			}
		})

		validate();
		//点击确定
		$("#nextStep").click(function(){
			if($("#forgetPwdForm").valid()){
				validCode();
			}
		});
	}
	//页面字段校验
	function validate(){

		$("#forgetPwdForm").validate({
			rules: {

				code: "required",
				password:{
					required:true,
					minlength:6,
					maxlength:20
				}

			},

			messages: {
				code: "手机验证码必填",

				password:{
					required:"登录密码必填",
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
	}
	function bindEvent(){
		//获取验证码
		$("#getCode").click(function(){

			if($("#secode").val().length!=4){
				layer.msg('请输入正确的图形验证码');
			}else{
				var time = $('#getCode').attr('countdown');

				$('#code').focus();
				FL.getSmsCode(account,time,'getCode',$("#secode").val());
			}

		});
		//校验输入验证码是否正确
		$("#secode,#code").keyup(function(){
			var me = this;
			var len = $(me).val().length;
			var eclear = $(me).parent("div").find('.cleartext');
			len>1?eclear.show():eclear.hide();
			var l = $('#password').val().length;
			if(l>5&&l<21&&$('#code').val().length>3){

				$("#nextStep").removeAttr('disabled');

			}else{
				$("#nextStep").attr('disabled','disabled');
			}
		});

		//点击确定
		$("#nextStep").click(function(){
			if($("#forgetPwdForm").valid()){
				validCode();
			}
		});

		$('#password').keyup(function(){
			var me = this;
			if($(me).val().length>5&&$(me).val().length<21&&$('#code').val().length>3){

				$("#nextStep").removeAttr('disabled');

			}else{
				$("#nextStep").attr('disabled','disabled');
			}
		});

		validate();


	}

	//校验验证码
	function validCode(){
        $('#nextStep').text("修改密码中...");
		var code = $("input[name='code']").val();

		FL.ajaxDate('post',check_phone_code,{num:account,code:code},
			function(result){
				if(result.error==="0"){
					modifyPwd();
				}else{

					layer.msg(result.msg);
					
					$('#nextStep').text("确定");
				}
			}
		);

	}

	//修改密码
	function modifyPwd(){
		var code = $("input[name='code']").val();
		var pwd  = hex_md5($("#password").val());
		FL.ajaxDate('post',reset_pwd,{phone:account,code:code,pwd :pwd},
			function(data){
				if(data.error==="0"){					
					layer.msg("修改密码成功");
					location.href= 'person_data.html';
				}
			}
		);
	}
	
	
	var Modify = function(){
		this.onLoad = function(){
			pageInit();
		}
	}
	Global.Member = Global.Member||{};
	Member.Modify = new Modify(); 
}(this);

///*************修改密码*****************/
//!function(Global){
//
//			
//	//页面字段校验
//	function validate(){
//			
//		$("#registerForm").validate({
//	        rules: {
//	
//	            mobile: {
//	            	required:true,
//	            	telephone:true
//	            },
//	
//	            code: "required"
//	        },
//	
//	        messages: {
//	
//	            mobile: {
//	            	required:"手机号不能为空！",
//	            	telephone:"请填写正确的手机号"
//	            },
//	
//	            code: "验证码必填"
//				
//				
//	        },
//		    errorPlacement: function(error, element) {
//		        	var text = error.text();
//		        	var dom =   '<div class="tooltip-top" role="tooltip">'
//							      +'<div class="tooltip-arrow"></div>'
//							      +'<div class="tooltip-in">'+text+'</div>'
//							    +'</div>'
//					$(".tooltip-top").remove();
//					element.before(dom);
//			}
//
// 		 });
//	}
//	
//	function bindEvent(){
//		//获取验证码
//		$("#getCode").click(function(){
//			var me = this;
//			var number = $("input[name='mobile']").val();
//			if(/^1[3|4|5|7|8|9][0-9]\d{4,8}$/.test(number)&&/^1\d{10}$/.test(number)){
//				$("#next_step").removeAttr("disabled");
//				FL.countDown(60,$("#getCode"));//获取验证码倒计时
//				FL.getOnlineCode(number,FL.mid,FL.token);
//			}else{
//				layer.msg('请输入正确的手机号！');
//			}
//				
//		});
//		//点击确定
//		$("#next_step").click(function(){
//			 if($("#registerForm").valid()){
//			 	validCode();
//			 }
//		});
//		
//		//校验输入验证码是否正确
//		$("#mobile").keyup(function(){
//			var me = this;
//			var phoneNum = $("#mobile").val();
//			if(/^1[3|4|5|7|8|9][0-9]\d{4,8}$/.test(phoneNum)&&/^1\d{10}$/.test(phoneNum)){
//				$("#getCode").removeAttr("disabled");
//			}else{
//				$("#getCode").attr("disabled","disabled");
//			}
//		})
//	}
//	//校验验证码
//	function validCode(){
//
//		var code = $("input[name='code']").val();
//		var number = $("input[name='mobile']").val();
//		$.ajax({
//			type:'post',
//
//			url:WapSiteUrl+"/api/index.php?act=common_member&op=check_phone_code",
//
//			data:{num:number,code:code,flag:"wap"},
//
//			dataType:'json',
//
//			success:function(result){
//				if(result.error==="0"){
//					location.href="../member/modify_password_two.html?num="+number+"&code="+code;
//				}else{
//					layer.msg(result.msg);
//				}
//			},
//			error:function(xhr) {
//
//			}
//		});
//		
//	}
//		
//		
//	var Modify = function(){
//		this.onLoad = function(){
//			validate();
//			bindEvent();
//		}
//	}
//	Global.Member = Global.Member||{};
//	Member.Modify = new Modify(); 
//}(this);