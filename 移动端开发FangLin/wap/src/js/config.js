

 	//正式
    
    var WapSiteUrl = "http://www.fenhongshop.com";
    var wxLogin = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5853a3512939c939&redirect_uri=http%3A%2F%2Fwww.fenhongshop.com%2Fwap%2Ftmpl%2Flogin%2Fthird_login.html%3Ftype%3Dwx&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect";
    var qqLogin = "https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101170068&redirect_uri=http%3A%2F%2Fwww.fenhongshop.com%2Fwap%2Ftmpl%2Flogin%2Fthird_login.html%3Ftype%3Dqq&state=state";
    var sinaLogin = "https://api.weibo.com/oauth2/authorize?client_id=1057865558&response_type=code&redirect_uri=http://www.fenhongshop.com/wap/tmpl/login/third_login.html?type=sina";
    var bag_details_wx_link = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5853a3512939c939&redirect_uri=http%3A%2F%2Fwww.fenhongshop.com%2Fwap%2Ftmpl%2Fpacket%2Fbag_details.html%3Fbatch_id%3D";
    var bag_success_wx_link = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5853a3512939c939&redirect_uri=http%3A%2F%2Fwww.fenhongshop.com%2Fwap%2Ftmpl%2Fpacket%2Fbag_success.html%3F";

	
	//测试服务器
/*
	var WapSiteUrl = "http://dev.fenhongshop.com";
	var wxLogin = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7f2148b1cf889a19&redirect_uri=http%3A%2F%2Fdev.fenhongshop.com%2Fwap%2Ftmpl%2Flogin%2Fthird_login.html%3Ftype%3Dwx&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect";
    var qqLogin = "https://graph.qq.com/oauth2.0/authorize?response_type=code&client_id=101170068&redirect_uri=http%3A%2F%2Fwww.fenhongshop.com%2Fwap%2Ftmpl%2Flogin%2Fthird_login.html%3Ftype%3Dqq&state=state";
    var sinaLogin = "https://api.weibo.com/oauth2/authorize?client_id=1057865558&response_type=code&redirect_uri=http://www.fenhongshop.com/wap/tmpl/login/third_login.html?type=sina";
    var bag_details_wx_link = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7f2148b1cf889a19&redirect_uri=http%3A%2F%2Fdev.fenhongshop.com%2Fwap%2Ftmpl%2Fpacket%2Fbag_details.html%3Fbatch_id%3D";
    var bag_success_wx_link = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx7f2148b1cf889a19&redirect_uri=http%3A%2F%2Fwww.fenhongshop.com%2Fwap%2Ftmpl%2Fpacket%2Fbag_success.html%3F";
 */ 
    //test服务器
/*    var WapSiteUrl = "http://test.fenhongshop.com";
    var wxLogin = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxa93681a3a23b6c43&redirect_uri=http%3A%2F%2Ftest.fenhongshop.com%2Fwap%2Ftmpl%2Flogin%2Fthird_login.html%3Ftype%3Dwx&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect";
 */ 


    var _url = window.location.href;
	if(_url.indexOf('http://temp.fenhongshop.com')>=0){
	
		WapSiteUrl='http://temp.fenhongshop.com';     
	}