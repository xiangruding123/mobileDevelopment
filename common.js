//function goPAGE() {
//	if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
//		//window.location.href = "你的手机版地址";
//		window.location.href = "pageTest.html";
//	} else {
//		//window.location.href = "你的电脑版地址";
//		window.location.href = "index.html";
//	}
//}
//goPAGE();

//function browserRedirect() {
//	
//	var sUserAgent = navigator.userAgent.toLowerCase();
//	var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
//	var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
//	var bIsMidp = sUserAgent.match(/midp/i) == "midp";
//	var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
//	var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
//	var bIsAndroid = sUserAgent.match(/android/i) == "android";
//	var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
//	var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
//	//document.writeln("您的浏览设备为：");
//	
//	if(bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
//		//document.writeln("phone");
//		window.location.href = "phone.html";
//	} else {
//		//document.writeln("pc");
//		window.location.href = "index.html";
//	}
//}
//browserRedirect();

//(function(){
//  var res = GetRequest();
//  var par = res['index'];
//  if(par!='gfan'){
//      var ua=navigator.userAgent.toLowerCase();
//      var contains=function (a, b){
//          if(a.indexOf(b)!=-1){return true;}
//      };
//		//将下面的http://caibaojian.com改成你的wap手机版页面地址 如我的 http://caibaojian.com
//      var toMobileVertion = function(){
//          window.location.href = 'phone.html'
//      }
//
//      if(contains(ua,"ipad")||(contains(ua,"rv:1.2.3.4"))||(contains(ua,"0.0.0.0"))||(contains(ua,"8.0.552.237"))){return false}
//      if((contains(ua,"android") && contains(ua,"mobile"))||(contains(ua,"android") && contains(ua,"mozilla")) ||(contains(ua,"android") && contains(ua,"opera"))
//  ||contains(ua,"ucweb7")||contains(ua,"iphone")){toMobileVertion();}
//  }
//})();
//
//
//function GetRequest() {
// var url = location.search; //获取url中"?"符后的字串
// var theRequest = new Object();
// if (url.indexOf("?") != -1) {
//    var str = url.substr(1);
//    strs = str.split("&");
//    for(var i = 0; i < strs.length; i ++) {
//       theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);
//    }
// }
// return theRequest;
//}


//function is_mobile() {
//	var regex_match = /(nokia|iphone|android|motorola|^mot-|softbank|foma|docomo|kddi|up.browser|up.link|htc|dopod|blazer|netfront|helio|hosin|huawei|novarra|CoolPad|webos|techfaith|palmsource|blackberry|alcatel|amoi|ktouch|nexian|samsung|^sam-|s[cg]h|^lge|ericsson|philips|sagem|wellcom|bunjalloo|maui|symbian|smartphone|midp|wap|phone|windows ce|iemobile|^spice|^bird|^zte-|longcos|pantech|gionee|^sie-|portalmmm|jigs browser|hiptop|^benq|haier|^lct|operas*mobi|opera*mini|320x320|240x320|176x220)/i;
//	var u = navigator.userAgent;
//	if(null == u) {
//		return true;
//	}
//	var result = regex_match.exec(u);
//
//	if(null == result) {
//		return false
//	} else {
//		return true
//	}
//}
//if(is_mobile()) {
//	document.location.href = 'phone.html'; //修改http://caibaojian.com为你所需跳转目标页地址  
//}



//
//if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
// //alert('手机端')
// window.location.href = "phone.html";
//}else{
// //alert('移动端')
// window.location.href = "index.html";
//}



var browser={  
    versions:function(){   
           var u = navigator.userAgent, app = navigator.appVersion;   
           return {  // 移动终端浏览器版本信息   
                trident: u.indexOf('Trident') > -1,  // IE内核  
                presto: u.indexOf('Presto') > -1,    // Opera内核  
                webKit: u.indexOf('AppleWebKit') > -1,  // 苹果、谷歌内核  
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,  // 火狐内核  
                mobile: !!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/)&&u.indexOf('QIHU')&&u.indexOf('Chrome')<0,  // 是否为移动终端    
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),  // iOS终端  
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,  // Android 终端或者 UC 浏览器  
                iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,  // 是否为 iPhone 或者 QQHD 浏览器  
                iPad: u.indexOf('iPad') > -1,   // 是否 iPad  
                webApp: u.indexOf('Safari') == -1,   // 是否WEB应该程序，没有头部与底部。  
                ua:u   
            };  
         }(),  
           
         language:(navigator.browserLanguage || navigator.language).toLowerCase()  
}   
  
if(browser.versions.mobile&&!browser.versions.iPad){  
     //this.location = "http://m.baidu.com/";   // 百度手机网站  
     //this.location = "phone.html";   // 百度手机网站
       this.location = "http://192.168.0.173:8020/webCode/phone.html";   // 百度手机网站
}











