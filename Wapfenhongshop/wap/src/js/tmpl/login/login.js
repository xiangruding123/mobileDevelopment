$(function() {
	var account = GetQueryString("account")||"";
	$('#member_login .focus-font').text(account);

	// 记录上级网址，用户跳转到注册页面注册成功后调用。
	var referurl = document.referrer; //上级网址

	localStorage.setItem('referurl', referurl);
	localStorage.setItem("thirdBack", referurl);

	var ua = navigator.userAgent.toLowerCase();

	if (ua.match(/MicroMessenger/i) == "micromessenger") {
		$("#wxLogin").show();
		if (referurl.indexOf("setting") < 0) {
			location.href = wxLogin;
		}

	}

	function bindEvent() {
		//输入框变化
		$('#password').keyup(function() {
			var len = $(this).val().length;
			len>1?$('.cleartext').show():$('.cleartext').hide();
			if (len > 5&& len<21) {
				$('#loginClick').removeAttr('disabled');
			} else {
				$('#loginClick').attr('disabled',"disabled");
			}
		});
		$('.cleartext').click(function(){
			$(this).hide();
			$("#password").val('').focus();
			$('#loginClick').attr('disabled',"disabled");
		})

		//登录
		$("#loginClick").click(function() {

				$("#loginClick").text("登录中...");
				var pwd = hex_md5($("#password").val());
				login(account, pwd);

		})
        //忘记密码
		$('.forget_pwd').click(function(){
			if(/^[1][34578]\d{9}$/.test(account)){
				location.href = "forget_pwd.html?account="+account;
			}else{
			    FL.addShade();
			    $('#nosiupDialog').show();
			    $('#siupleftbtn').click(function(){
				FL.removeShade();
				$('#nosiupDialog').hide();
			     });
		      }
		});
		//输入密码错误后忘记密码
		$('#rightbtn').click(function(){
			$('#noinfoDialog').hide();
			if(/^[1][34578]\d{9}$/.test(account)){
				location.href = "forget_pwd.html?account="+account;
			}else{
				$('#nosiupDialog').show();
				$('#siupleftbtn').click(function(){
					FL.removeShade();
					$('#nosiupDialog').hide();
					$("#password").val('');
					$('.cleartext').hide();
					$('#loginClick').text('登录').attr('disabled',"disabled");
				})
			}


		});

	}

	function login(account, pwd) {

		$.ajax({

			type: "post",
			url: common_member_login,
			data: {
				account: account,
				password: pwd,
				flag: "wap"
			},
			dataType: "json",

			success: function(data) {

				if (data.error === '0') {

					addcookie('member_name', data.result.member_name);

					addcookie('mid', data.result.member_id, 365);

					addcookie('token', data.result.token, 365);

					addcookie('member_mobile', data.result.member_mobile);

					addcookie('nickname', data.result.member_nickname);

					addcookie('store_id', data.result.store_id, 365);

					addcookie('if_shoper', data.result.if_shoper, 365);

					addcookie('talent_id', data.result.talent_id, 365);

					addcookie('shop_id', data.result.shop_id);

					var referurl = localStorage.getItem('referurl');

					localStorage.removeItem('referurl'); //上级存储了页面地址  这里清空

					if (referurl.indexOf('forget_pwd_two') > 0 || referurl.indexOf('modify_password_two') > 0 || referurl.indexOf('register2') > 0 || referurl.indexOf('setting') > 0 || referurl == "" || referurl.indexOf('bag_details') > 0 || referurl.indexOf('fenhongshop') < 0) {
						location.href = WapSiteUrl + '/wap/tmpl/member/person.html';
					} else {
						location.href = referurl;
					}

					$(".error-tips").hide();

				} else if(data.error === '1000005'){
					FL.addShade();
                    $('#noinfoDialog').show();
					$('#leftbtn').click(function(){
                         $("#password").val('').focus();
						 FL.removeShade();
						 $('#noinfoDialog').hide();
						 $('.cleartext').hide();
						 $('#loginClick').text('登录').attr('disabled',"disabled");
					});

				} else {

					layer.msg(data.msg);

				}

			},
			error: function(xhr) {}

		});
	}

	bindEvent();

});

//$(function() {
//	//判断是否存在mid
//	if(FL.mid!=""){
//		location.href="../index/index.html";
//	}
//
//	  // 记录上级网址，用户跳转到注册页面注册成功后调用。
//  var referurl = document.referrer; //上级网址
//  localStorage.setItem('referurl', referurl);
//  localStorage.setItem("thirdBack",referurl);
//
//  var ua = navigator.userAgent.toLowerCase();
//	if(ua.match(/MicroMessenger/i)=="micromessenger") {
//		 $("#wxLogin").show();
//		 if(referurl.indexOf("setting")<0){
//		 	location.href= wxLogin;
//		 }
//
//	}
//
//
//  //页面字段校验
//  function validate() {
//
//      $("#loginForm").validate({
//          rules: {
//
//              username: "required",
//
//              password: "required"
//
//          },
//
//          messages: {
//
//              username: "用户名必须填写！",
//
//              password: "密码必填!"
//
//          },
//          errorPlacement: function(error, element) {
//
//              var text = error.text();
//              var dom = '<div class="tooltip-top" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-in">' + text + '</div>' + '</div>'
//              $(".tooltip-top").remove();
//              element.before(dom);
//          }
//
//      });
//  }
//  validate();
//  //会员登陆
//  $('#loginbtn').click(function() {
//
//
//
//      var username = $('#username').val();
//
//      var pwd = $('#userpwd').val();
//
//      var client = 'wap';
//
//      var token;
//
//
//      if ($("#loginForm").valid()) {
//
//          $.ajax({
//
//              type: 'post',
//
//              url: WapSiteUrl + "/api/index.php?act=common_member&op=login",
//
//              data: {
//                  account: username,
//                  password: pwd,
//                  flag: "wap"
//              },
//
//              dataType: 'json',
//
//              success: function(data) {
//
//
//                  if (data.error === '0') {
//
////                      if (typeof(data.result.token) == 'undefined') {
////
////                          return false;
////
////                      } else {
//
//                          addcookie('member_name', data.result.member_name);
//
//                          addcookie('mid', data.result.member_id ,365);
//
//                          addcookie('token', data.result.token ,365);
//
//                          addcookie('member_mobile', data.result.member_mobile);
//
//                          addcookie('nickname',data.result.member_nickname);
//
//                          addcookie('store_id', data.result.store_id ,365);
//
//							addcookie('if_shoper', data.result.if_shoper ,365);
//
//                          var referurl = localStorage.getItem('referurl');
//
//                          localStorage.removeItem('referurl');//上级存储了页面地址  这里清空
//
//                       	if(referurl.indexOf('forget_pwd_two')>0||referurl.indexOf('modify_password_two')>0||referurl.indexOf('register2')>0||referurl.indexOf('setting')>0||referurl==""||referurl.indexOf('bag_details')>0||referurl.indexOf('fenhongshop')<0){
//                              location.href = WapSiteUrl+'/wap/tmpl/member/person.html';
//                          }else{
//                          	location.href = referurl;
//                          }
//
//
//
////                      }
//
//                      $(".error-tips").hide();
//
//                  } else {
//
//                      layer.msg(data.msg);
//
//                  }
//
//              },
//              error:function(xhr){
//              }
//
//
//          });
//      }
//  });
//
//	 function thirdLoginIn(type,infoStr){
//   	$.ajax({
//              type: 'post',
//              url: WapSiteUrl + "/api/index.php?act=common_member&op=third_login",
//              data: {flag: "wap",info:infoStr,type:type},
//              global:false,
//              dataType: 'json',
//              success: function(data) {
//             	   if(data&&data.error==0&&typeof(data.result)=="object"){
//						addcookie('member_name', data.result.member_name);
//		                addcookie('mid', data.result.member_id,365);
//		                addcookie('token', data.result.token,365);
//		                addcookie('member_mobile', data.result.member_mobile);
//		                addcookie('store_id', data.result.store_id,365);
//						addcookie('if_shoper', data.result.if_shoper,365);
//						location.replace("../member/person.html");
//					}else{
//						if(type=="sina"){
//							location.href="weibo_bind_login.html?infoStr="+infoStr;
//						}else if(type=="wx"){
//							location.href="wx_bind_login.html?infoStr="+infoStr;
//						}
//
//					}
//             	}
//      })
//   }
//	 //微信三方登录
//   $("#wxLogin").click(function(){
//   	location.href= wxLogin;
//   });
//
//   //新浪微博三方登录
//   $("#weiboLogin").click(function(){
// 		location.href= sinaLogin;
//   });
//   //QQ登录
//   $("#QQLogin").click(function(){
//   	location.href= qqLogin;
//
//   });
//
//});
