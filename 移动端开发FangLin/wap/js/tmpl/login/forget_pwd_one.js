!function(e){function t(){FL.ajaxDate("get",sms_code_init,{mobile:c},function(e){if("0"===e.error){var t=e.result;countdown=t.countdown,if_captcha=t.if_captcha,mobile_correct=t.mobile_correct,sms_available=t.sms_available,$("#getCode").attr("countdown",countdown),t.last_countdown&&FL.countDown(t.last_countdown,$("#getCode")),"1"==if_captcha?($("#img_secode").attr("src",WapSiteUrl+"/api/index.php?act=common_index&op=get_captcha&flag=wap&mobile="+c),r()):($("#secodebox").hide(),o()),$(".cleareye").click(function(){"text"==$("#password").attr("type")?($("#password").prop("type","password"),$(".cleareye").prop("src","../../src/images/wap/login/eye.png")):($("#password").prop("type","text"),$(".cleareye").prop("src","../../src/images/wap/login/eyeclick.png"))}),$(".cleartext").click(function(){$(this).parent("div").find("input").val("").focus(),$(this).hide()})}})}function o(){$("#getCode").click(function(){if($("#getCode").hasClass("nogetcode"))$("#secodebox").show(),$("#img_secode").attr("src",WapSiteUrl+"/api/index.php?act=common_index&op=get_captcha&flag=wap&mobile="+c),r();else{var e=$("#getCode").attr("countdown");$("#code").focus(),FL.getSmsCode(c,e,"getCode")}}),$("#code").keyup(function(){var e=this,t=$(e).val().length;t>1?$(".cleartext").show():$(".cleartext").hide();var o=$("#password").val().length;o>5&&o<21&&t>3?$("#nextStep").removeAttr("disabled"):$("#nextStep").attr("disabled","disabled")}),$("#password").keyup(function(){var e=this,t=$(e).val().length;t>5&&t<21&&$("#code").val().length>3?$("#nextStep").removeAttr("disabled"):$("#nextStep").attr("disabled","disabled")}),a(),$("#nextStep").click(function(){$("#forgetPwdForm").valid()&&n()})}function a(){$("#forgetPwdForm").validate({rules:{code:"required",password:{required:!0,minlength:6,maxlength:20}},messages:{code:"手机验证码必填",password:{required:"登录密码必填",minlength:"密码长度不得小于6个字符",maxlength:"密码长度不得大于20个字符"}},errorPlacement:function(e,t){var o=e.text(),a='<div class="tooltip-top" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-in">'+o+"</div></div>";$(".tooltip-top").remove(),t.before(a)}})}function r(){$("#getCode").click(function(){if(4!=$("#secode").val().length)layer.msg("请输入正确的图形验证码");else{var e=$("#getCode").attr("countdown");$("#code").focus(),FL.getSmsCode(c,e,"getCode",$("#secode").val())}}),$("#secode,#code").keyup(function(){var e=this,t=$(e).val().length,o=$(e).parent("div").find(".cleartext");t>1?o.show():o.hide();var a=$("#password").val().length;a>5&&a<21&&$("#code").val().length>3?$("#nextStep").removeAttr("disabled"):$("#nextStep").attr("disabled","disabled")}),$("#nextStep").click(function(){$("#forgetPwdForm").valid()&&n()}),$("#password").keyup(function(){var e=this;$(e).val().length>5&&$(e).val().length<21&&$("#code").val().length>3?$("#nextStep").removeAttr("disabled"):$("#nextStep").attr("disabled","disabled")}),a()}function n(){$("#nextStep").text("修改密码中...");var e=$("input[name='code']").val();FL.ajaxDate("post",check_phone_code,{num:c,code:e},function(e){"0"===e.error?i():(layer.msg(e.msg),$("#nextStep").text("确定"))})}function i(){var e=$("input[name='code']").val(),t=hex_md5($("#password").val());FL.ajaxDate("post",reset_pwd,{phone:c,code:e,pwd:t},function(e){"0"===e.error&&(delCookie("mid"),delCookie("token"),FL.token="",FL.mid="",d(c,t))})}function d(e,t){$.ajax({type:"post",url:common_member_login,data:{account:e,password:t,flag:"wap"},dataType:"json",success:function(e){if("0"===e.error){addcookie("member_name",e.result.member_name),addcookie("mid",e.result.member_id,365),addcookie("token",e.result.token,365),addcookie("member_mobile",e.result.member_mobile),addcookie("nickname",e.result.member_nickname),addcookie("store_id",e.result.store_id,365),addcookie("if_shoper",e.result.if_shoper,365),addcookie("talent_id",e.result.talent_id,365);var t=localStorage.getItem("referurl");localStorage.removeItem("referurl"),t.indexOf("forget_pwd_two")>0||t.indexOf("modify_password_two")>0||t.indexOf("register2")>0||t.indexOf("setting")>0||""==t||t.indexOf("bag_details")>0||t.indexOf("fenhongshop")<0?location.href=WapSiteUrl+"/wap/tmpl/member/person.html":location.href=t,$(".error-tips").hide()}else layer.msg(e.msg)},error:function(e){}})}var c=GetQueryString("account")||"";$(".merber").text(c);var l=function(){this.onLoad=function(){t()}};e.Member=e.Member||{},Member.ForgetPwd=new l}(this);