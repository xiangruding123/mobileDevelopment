// 买家版接口扩展
// ========================================================================

var fhbuyer = {};
fhbuyer.extend = function(){ 
	// copy reference to target object 
	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options; 
	// Handle a deep copy situation 
    if (typeof target === "boolean") { 
		deep = target; 
		target = arguments[1] || {}; 
		// skip the boolean and the target 
		i = 2; 
	} 
	// Handle case when target is a string or something (possible in deep copy) 
	if (typeof target !== "object" && !jQuery.isFunction(target)) 
		target = {}; 
		// extend jQuery itself if only one argument is passed 
	if (length == i) { 
		target = this; 
		--i; 
	} 
	for (; i < length; i++) 
	// Only deal with non-null/undefined values 
	if ((options = arguments[i]) != null) 
	// Extend the base object 
	for (var name in options) { 
		var src = target[name], copy = options[name]; 
		// Prevent never-ending loop 
		if (target === copy) 
			continue; 
			// Recurse if we're merging object values 
		if (deep && copy && typeof copy === "object" && !copy.nodeType) 
			target[name] = jQuery.extend(deep, // Never move original objects, clone them 
			src || (copy.length != null ? [] : {}), copy); 
		// Don't bring in undefined values 
		else 
			if (copy !== undefined) 
				target[name] = copy; 
	} 
	// Return the modified object 
	return target; 
}; 


var fhbuyer_apiready = false;
var fhbuyer_callback = '';
var fhbuyer_version = 101;
var fhbuyer_ready_flag = false;
fhbuyer.extend({
	api_ready: function(callback){
		var data = {
			'funcName':'api_ready',
			'paraJson': {}
			};
		if( parseInt(fhbuyer_version) > 100 ){
			api.sendEvent({name:"event_fhbuyer",extra:data});
		}
		else{
			parent.postMessage( JSON.stringify(data), "*");
		}
		window.setTimeout(function(){
			if( fhbuyer_ready_flag == false ){
				var data = {'state':'fail', 'api_isready':'false', 'msg':'接口不能调用'};
				fhbuyer_callback(data);
			}
		},500);
		fhbuyer_callback = callback;
	},
	api_system: function(callback){
		// 获取系统类型
		var data = {
			'funcName':'api_system',
			'paraJson': {}
			};
		if( parseInt(fhbuyer_version) > 100 ){
			api.sendEvent({name:"event_fhbuyer",extra:data});
		}
		else{
			parent.postMessage( JSON.stringify(data), "*");
		}
		fhbuyer_callback = callback;
	},
	api_settitle: function(paraJson){
		// 设置http打开页面的title
		var data = {
			'funcName':'api_settitle',
			'paraJson': paraJson
			};		
		if( parseInt(fhbuyer_version) > 100 ){
			api.sendEvent({name:"event_fhbuyer",extra:data});
		}
		else{
			parent.postMessage( JSON.stringify(data), "*");
		}
	},
	api_alert: function(paraJson){
		// 调用系统原生提示框
		var data = {
			'funcName':'api_alert',
			'paraJson': paraJson
			};		
		if( parseInt(fhbuyer_version) > 100 ){
			api.sendEvent({name:"event_fhbuyer",extra:data});
		}
		else{
			parent.postMessage( JSON.stringify(data), "*");
		}
	},
	api_login: function(){
		// 调用系统登录页
		var data = {
			'funcName':'api_login',
			'paraJson': {}
			};
		if( parseInt(fhbuyer_version) > 100 ){
			window.setTimeout(function(){
			    api.sendEvent({name:"event_fhbuyer",extra:data});
			},300);
		}
		else{
			parent.postMessage( JSON.stringify(data), "*");
		}
	},
	api_islogin: function(callback){
		// 查询登录状态
		var data = {
			'funcName':'api_islogin',
			'paraJson': {}
			};
		if( parseInt(fhbuyer_version) > 100 ){
			window.setTimeout(function(){
			    api.sendEvent({name:"event_fhbuyer",extra:data});
			},300);
		}
		else{
			parent.postMessage( JSON.stringify(data), "*");
		}
		fhbuyer_callback = callback;
	},
	api_openframe: function(data,callback){
		// 执行页面跳转
		/*
		data = {
			'paraJson': {
				'_frameName' : '窗口名',  //必填
				'_url' : 'url地址',       //必填
				'_refresh' : '强制刷新',   //true，false
				'_type' : '类型'          //openFrame, openWin(ios)
		    }
		};
		请将data
		*/
        data['funcName'] = 'api_openframe';
		if( parseInt(fhbuyer_version) > 100 ){
			api.sendEvent({name:"event_fhbuyer",extra:data});
		}
		else{
			parent.postMessage( JSON.stringify(data), "*");
		}
		fhbuyer_callback = callback;
	},
	api_alipay: function(data,callback){
		/*
		接口说明：支付宝支付接口
		服务端回调地址：服务端回调地址用于判断支付成功后的金额是否一致，增强安全性。服务端在数据库保存支付回调信息。
		参数结构：
		data = {
			'paraJson': {
				'_subject' : '支付标题',
				'_body' : '支付描述',
				'_amount' : '支付金额',
				'_tradeno' : '订单号',
				'_notifyurl' : '服务端回调地址'
		    }
		};
		*/
        data['funcName'] = 'api_alipay';
		if( parseInt(fhbuyer_version) > 100 ){
			api.sendEvent({name:"event_fhbuyer",extra:data});
		}
		else{
			parent.postMessage( JSON.stringify(data), "*");
		}
		fhbuyer_callback = callback;
		/*
		回调返回结果说明：
		{'state':'success', 'code':'9000', 'msg':'操作成功'};
		代码  	含义
		9000	操作成功
		4000	系统异常
		4001	数据格式不正确
		4003	该用户绑定的支付宝账户被冻结或不允许支付
		4004	该用户已解除绑定
		4005	绑定失败或没有绑定
		4006	订单支付失败
		4010	重新绑定账户
		6000	支付服务正在进行升级操作
		6001	用户中途取消支付操作
		0001	缺少商户配置信息（商户id，支付公钥，支付密钥）
		0002	用户当前设备没有安装支付宝客户端（ios）或安全支付插件（Android）
		0003	签名错误（公钥私钥错误）
		0004    商户配置错误
		0010    参数错误
		*/
	},	
	api_share: function(data,callback){
		/*
		接口说明：调用系统分享		
		分享渠道(share_type)：QFriend(qq好友)/QZone(qq空间)/session(微信好友)/timeline(微信朋友圈)/multipic(微信多图)/weibo(新浪微博)
		微信多图分享：share_type :'multipic'，将goods_id赋值给_title，将商品分享链接赋值给_url，其他参数可空 （仅限android系统调用）
		参数结构：
		data = {
			'paraJson': {
				'share_type' : '分享渠道',
				'share_title' : '标题',
				'share_content' : '内容',
				'share_url' : 'http://www.xxx.com',
				'share_pic' : 'http://www.xxx.com/xxx.jpg'
		    }
		};
		*/
        data['funcName'] = 'api_share';
		if( parseInt(fhbuyer_version) > 100 ){
			api.sendEvent({name:"event_fhbuyer",extra:data});
		}
		else{
			parent.postMessage( JSON.stringify(data), "*");
		}
		fhbuyer_callback = callback;
	},
	api_share_hide: function(){
		// 设置http打开页面的title
		var data = {
			'funcName':'api_share_hide',
			'paraJson': {}
			};
		if( parseInt(fhbuyer_version) > 100 ){
			api.sendEvent({name:"event_fhbuyer",extra:data});
		}
		else{
			parent.postMessage( JSON.stringify(data), "*");
		}
	},
	//APP 回调函数
	callBack: function(data,version){
		// 执行调用
		try{
			if( typeof data.api_isready != 'undefined' ){
				if( data.api_isready == 'true' ){
					fhbuyer_ready_flag = true;
				}
			}
		}
		catch(e){
			//todo
		}
		fhbuyer_callback(data);
	}

}); 


// 回调函数，app版本大于1.0.0
window.apiready = function(){
	
	// 记录apicloud加载状态
	fhbuyer_apiready = true;
	
	// 获取版本信息
	var appVersion = api.appVersion;
	fhbuyer_version = parseInt(appVersion.replace(/\./g,''));
	if( fhbuyer_version == 0 ) fhbuyer_version = 101;
	
	api.addEventListener({
		name: 'event_fhbuyer_callback'
	}, function(ret){
		if(ret && ret.value){
			console.log('--->>>---正在接收回调数据: ' + JSON.stringify(ret.value));
			var data = ret.value;
			if( fhbuyer_callback != '' ){
	            fhbuyer.callBack(data.callJson,data.version);
			}
		}
	});	
	
	
	if( fhbuyer_version > 100 ){
        // 读取当前页标题，并发送到APP
		fhbuyer.api_settitle({title: document.title});
	}
}
// 回调函数，app版本1.0.0
window.addEventListener('message',function(e){
	var data = JSON.parse(e.data);
	// 执行回调	
	if( fhbuyer_callback != '' ){
		fhbuyer.callBack(data.callJson,data.version);	
	}
},false);