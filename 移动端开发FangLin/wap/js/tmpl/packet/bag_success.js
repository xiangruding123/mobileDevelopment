!function(e){function t(e){$.ajax({type:"post",url:WapSiteUrl+"/api/index.php?act=common_member&op=get_third_account_info",data:{code:e,type:"wx",flag:"wap"},dataType:"json",success:function(e){if(0==e.error){var t=e.result;_=t.openid,h=t.nickname,b=t.headimgurl,addcookie("wx_openid",_),addcookie("wx_nickname",h),addcookie("wx_headimgurl",b)}else"40029"==e.error&&(_=unescape(getcookie("wx_openid")),h=unescape(getcookie("wx_nickname")),b=unescape(getcookie("wx_headimgurl")));a(d,_,"wx"),s(d,_,h,b)},error:function(e){}})}function a(e,t,a){var i;"wx"==a?i={batch_id:e,flag:"wap",wechat_id:t}:"mid"==a&&(i={batch_id:e,flag:"wap",mid:FL.mid}),$.ajax({type:"get",url:WapSiteUrl+"/api/index.php?act=buyer_coupon&op=get_bag_detail",data:i,dataType:"json",success:function(e){if(e&&0==e.error){if(0==e.result.is_gotten)$("#bag_success").show(),$("#bagMoney").text(e.result.bag_amount),$("#person").text(sessionStorage.getItem("member_name")),r();else{m=e.result.bag_id,$("#ticketbag").show(),l=e.result.mobile,template.helper("format",FL.dateFormat);var t=template.render("bag_content",e.result);$("#bag_content_box").html(t),o(l,!0)}g=e.result.bag_amount}}})}function i(e){var t=sessionStorage.getItem("deduct_userid");$.ajax({type:"post",url:WapSiteUrl+"/api/index.php?act=buyer_coupon&op=get_bag",data:{mobile:e,batch_id:d,wechat_id:_,wechat_name:h,wechat_avatar:b,flag:"wap",deduct_userid:t},dataType:"json",success:function(t){t&&0==t.error?(m=t.result,$("#bag_success").hide(),$("#ticketbag").show(),o(e)):"2014001"==t.error?location.href="empty_packet.html":layer.msg(t.msg||"领取失败"),$("#grab").removeAttr("disabled")}})}function o(e,t){t||n(m,l),$("#phone").text(e)}function c(e){$.ajax({type:"get",url:WapSiteUrl+"/api/index.php?act=buyer_coupon&op=get_bag_detail",data:{batch_id:d,wechat_id:e,flag:"wap"},dataType:"json",success:function(e){if(e&&0==e.error){template.helper("format",FL.dateFormat);var t=template.render("bag_content",e.result);$("#bag_content_box").html(t)}}})}function n(e,t){$.ajax({type:"post",url:WapSiteUrl+"/api/index.php?act=buyer_coupon&op=get_coupon",data:{bag_id:e,mobile:t,flag:"wap"},dataType:"json",success:function(e){e&&0==e.error&&("success"==e.result?c(_):"pending"==e.result&&c(_))}})}function r(){$("#explain").click(function(){$("#mask").show()}),$("#mask,#closebag").click(function(){$("#mask").hide()}),$("#grab").click(function(){var e=this;l=$("#mobile").val(),/^1[3|4|5|7|8|9][0-9]\d{4,8}$/.test(l)&&/^1\d{10}$/.test(l)?($(e).attr("disabled","disabled"),$.ajax({type:"get",url:WapSiteUrl+"/api/index.php?act=common_member&op=check_phone",data:{mobile:l,flag:"wap"},dataType:"json",success:function(e){1000011==e.error||0==e.error?i(l):(layer.msg("您手机号已注册"),$("#grab").removeAttr("disabled"))}})):layer.msg("请输入正确的手机号")}),$("#sharebtn").click(function(){$(".masksharetip").show()}),$(".masksharetip").click(function(){$(this).hide()})}function s(e,t,a,i){var o,c,n,r;o="分红全球购送你168元新人现金大礼！",c="中国真正的跨境直购平台送你168元现金大礼！真正购物能抵现！足不出户享海外价格",n=WapSiteUrl+"/wap/images/red-packet/bagshare.jpg",r=bag_success_wx_link+"member_name="+a+"deduct_userid"+t+"&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect",FL.wxShare(o,c,r,n)}var d=GetQueryString("batch_id");d=2;var p=GetQueryString("member_name"),u=p.split("deduct_userid")[1];p=p.split("deduct_userid")[0];GetQueryString("headimgurl");sessionStorage.setItem("member_name",p),sessionStorage.setItem("deduct_userid",u);var m,l,g,_,h,b;$("#phonetxtchange").click(function(){$("#bag_success").show(),$("#person").text(sessionStorage.getItem("member_name")),$("#ticketbag").hide(),r()}),$("#sharebtn").click(function(){$(".masksharetip").show(),setTimeout(function(){$(".masksharetip").hide()},3e3)}),$(".masksharetip").click(function(){$(this).hide()}),$(".gotoindex").click(function(){addcookie("member_name",""),addcookie("mid",""),addcookie("token",""),addcookie("member_mobile",""),addcookie("nickname","")});var f=function(){this.onLoad=function(){var e=GetQueryString("code");t(e)}};e.Packet=e.Packet||{},Packet.BagSuccess=new f}(this);