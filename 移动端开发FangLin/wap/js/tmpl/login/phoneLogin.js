$(function(){function e(){$("#loginForm").validate({rules:{mobile:{required:!0,telephone:!0},code:"required"},messages:{mobile:{required:"手机号不能为空！",telephone:"请填写正确的手机号"},code:"手机验证码必填"},errorPlacement:function(e,o){var i=e.text(),t='<div class="tooltip-top" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-in">'+i+"</div></div>";$(".tooltip-top").remove(),o.before(t)}})}FL.getHash("img_secode"),$("#img_secode").click(function(){FL.getHash("img_secode")}),$("#getCode").click(function(){var e=$("input[name='mobile']").val();if(/^1[3|4|5|7|8|9][0-9]\d{4,8}$/.test(e)&&/^1\d{10}$/.test(e)&&!$("input[name='mobile']").hasClass("error")){var o=$("#mobile").val();FL.checkSecode($.trim($("#secode").val()),o,"getCode")}else layer.msg("请输入正确的的手机号！")}),e(),$("#loginbtn").click(function(){var e=$("#mobile").val(),o=$("#code").val();$("#loginForm").valid()&&$.ajax({type:"post",url:WapSiteUrl+"/api/index.php?act=common_member&op=login&test=1",data:{account:e,code:o,is_easy:1,flag:"wap"},dataType:"json",success:function(e){if("0"===e.error){addcookie("member_name",e.result.member_name),addcookie("mid",e.result.member_id,365),addcookie("token",e.result.token,365),addcookie("member_mobile",e.result.member_mobile),addcookie("nickname",e.result.member_nickname),addcookie("store_id",e.result.store_id,365),addcookie("if_shoper",e.result.if_shoper,365),addcookie("talent_id",e.result.talent_id,365);var o=localStorage.getItem("thirdBack");localStorage.removeItem("thirdBack"),o.indexOf("forget_pwd_two")>0||o.indexOf("modify_password_two")>0||o.indexOf("register2")>0||o.indexOf("setting")>0||""==o||o.indexOf("bag_details")>0||o.indexOf("fenhongshop")<0?location.href=WapSiteUrl+"/wap/tmpl/member/person.html":location.href=o,$(".error-tips").hide()}else layer.msg(e.msg)},error:function(e){}})})});