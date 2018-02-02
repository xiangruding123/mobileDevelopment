!function(Global){
	localStorage.setItem('onetime','2');
	deduct_userid = GetQueryString('mid');//上级mid

	function pageInit(account){
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
						$('#secodebox').show();
						var account = $('#mobile').val();
						$("#img_secode").attr("src",WapSiteUrl+"/api/index.php?act=common_index&op=get_captcha&flag=wap&mobile="+account);
						bind();
					}else{
						$('#secodebox').hide();
						var time = $('#getCode').attr('countdown');
						$('#code').focus();
						var account = $('#mobile').val();
						FL.getSmsCode(account,time,'getCode');
						bindEvent();
					}

					$('.agree').click(function(){
						if($(this).hasClass('yes')){
							$(this).prop('src','../../images/wap/login/noagree.png');
							$(this).removeClass('yes');
							$("#nextStep").attr('disabled','disabled');
						}else{
							$(this).prop('src','../../images/wap/login/agree.png');
							$(this).addClass('yes');
							var lenum = $('#password').val().length;
							if(lenum>5&&lenum<21&&$('#code').val().length>3){
								$("#nextStep").removeAttr('disabled');
							}

						}
					});

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
	$('#secodebox').hide();
	//获取验证码
	$("#getCode").click(function(){
		var me = this;
		var account = $("input[name='mobile']").val();

        checklogin(account);

	});
	function checklogin(account){

		$.ajax({
			type:'get',

			url:if_account_exists,

			data:{account:account,flag:"wap"},

			dataType:'json',

			success:function(data){

				if(data&&data.error==="0"){
					if(data.result=='1'){
						layer.msg('该账号已注册');
					}else if(data.result=='0'){
						if(/^[1][34578]\d{9}$/.test(account)){
							if(localStorage.getItem('onetime')==2){
								localStorage.setItem('onetime','1');
								pageInit(account);

								if($('#getCode').hasClass('nogetcode')){
									$('#secodebox').show();
									$("#img_secode").attr("src",WapSiteUrl+"/api/index.php?act=common_index&op=get_captcha&flag=wap&mobile="+account);
									bind();
								}
							}
						}
					}else{
							layer.msg('请输入正确的手机号！');
						}
					}
				}

		});


	}
	function bindEvent(){

		$("#getCode").click(function(){

			var me = this;

            var account = $('#mobile').val();

			if($('#getCode').hasClass('nogetcode')){
				$('#secodebox').show();
				$("#img_secode").attr("src",WapSiteUrl+"/api/index.php?act=common_index&op=get_captcha&flag=wap&mobile="+account);
				bind();
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
			if(l>5&&l<21&&len>3&&$('.agree').hasClass('yes')){

				$("#nextStep").removeAttr('disabled');

			}else{
				$("#nextStep").attr('disabled','disabled');
			}
		})

		$('#password').keyup(function(){
			var me = this;
			var len = $(me).val().length;

			if(len>5&&len<21&&$('#code').val().length>3&&$('.agree').hasClass('yes')){

				$("#nextStep").removeAttr('disabled');

			}else{
				$("#nextStep").attr('disabled','disabled');
			}
		})

		validate();
		//点击确定
		$("#nextStep").click(function(){

			validCode();

		});

	}
	function bind(){

		//获取验证码
		$("#getCode").click(function(){
			var account = $('#mobile').val();
			if($("#secode").val().length!=4){
				layer.msg('请输入正确的图形验证码');
			}else{
				var time = $('#getCode').attr('countdown');

				$('#code').focus();
				FL.getSmsCode(account,time,'getCode',$("#secode").val());
			}

		});
		//校验输入验证码是否正确
		//校验输入验证码是否正确
		$("#secode,#code").keyup(function(){
			var me = this;
			var len = $(me).val().length;
			var eclear = $(me).parent("div").find('.cleartext');
			len>1?eclear.show():eclear.hide();
			var l = $('#password').val().length;
			if(l>5&&l<21&&$('#code').val().length>3&&$('.agree').hasClass('yes')){

				$("#nextStep").removeAttr('disabled');

			}else{
				$("#nextStep").attr('disabled','disabled');
			}
		});
		//点击确定
		$("#nextStep").click(function(){
			if($("#registerForm").valid()){
				validCode();
			}
		});
		$('#password').keyup(function(){
			var me = this;
			if($(me).val().length>5&&$(me).val().length<21&&$('#code').val().length>3&&$('.agree').hasClass('yes')){

				$("#nextStep").removeAttr('disabled');

			}else{
				$("#nextStep").attr('disabled','disabled');
			}
		});
		validate();

	}
	//页面字段校验
	function validate(){

		$("#registerForm").validate({
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

	//校验验证码
	function validCode(){

		var code = $("input[name='code']").val();
		var account = $('#mobile').val();
		FL.ajaxDate('post',check_phone_code,{num:account,code:code},
			function(result){
				if(result.error==="0"){
					register();
				}else{
					layer.msg(result.msg);
				}
			}
		);

	}
	//会员注册
	function register(){
		var account = $('#mobile').val();
		var code = $("input[name='code']").val();
		var pwd = hex_md5($("input[name='password']").val());
		FL.ajaxDate('post',member_register,{mobile:account,code:code,password:pwd,deduct_userid:deduct_userid},
			function(data){
				if(data.error==="0"){
					layer.msg("注册成功");
					addcookie('member_name', data.result.member_name);
					addcookie('mid', data.result.member_id ,365);
					addcookie('token', data.result.token ,365);
					addcookie('member_mobile', data.result.member_mobile);
					addcookie('nickname',data.result.member_nickname);
					addcookie('store_id', data.result.store_id ,365);
					addcookie('if_shoper', data.result.if_shoper ,365);
					token= data.result.token;
					member_id= data.result.member_id;
					setTimeout(function(){

						location.href="../weidian/shoper.html?mid="+member_id+"&token="+token;

				    },2500);
				}
			}
		);
	}
	$('#agreement').click(function(){
		$('.iframehead').show();
		$('iframe').show();

	});
	$('.iframehead .goback').click(function(){
		$('.iframehead').hide();
		$('iframe').hide();
	});
	var WxBind = function(){
		this.onLoad = function(){


		}
	}
	Global.Member = Global.Member||{};
	Member.WxBind = new WxBind();
}(this);

