!function(e){function o(){$("#forgetPwd2Form").validate({rules:{password:{required:!0,minlength:6,maxlength:20},confirm_password:{required:!0,equalTo:"#password"}},messages:{password:{required:"登录密码必填",minlength:"密码长度不得小于6个字符",maxlength:"密码长度不得大于20个字符"},confirm_password:{required:"请输入您的确认密码",equalTo:"两次输入密码不一致"}},errorPlacement:function(e,o){var r=e.text(),t='<div class="tooltip-top" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-in">'+r+"</div></div>";$(".tooltip-top").remove(),o.before(t)}})}function r(){$("#confirm").click(function(){$("#forgetPwd2Form").valid()&&t()})}function t(){var e=GetQueryString("number"),o=GetQueryString("code"),r=hex_md5($("#password").val());$.ajax({type:"post",url:WapSiteUrl+"/api/index.php?act=common_member&op=reset_pwd&test=1",data:{phone:e,code:o,flag:"wap",pwd:r},dataType:"json",success:function(e){"0"===e.error&&(layer.msg("修改成功"),delCookie("mid"),delCookie("token"),FL.token="",FL.mid="",setTimeout(function(){FL.logLogin()},1e3))},error:function(e){}})}var i=function(){this.onLoad=function(){o(),r()}};e.Member=e.Member||{},Member.ForgetPwd2=new i}(this);