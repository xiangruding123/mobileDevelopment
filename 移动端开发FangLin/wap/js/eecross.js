/**
 *create Plucky 2016-11-06 am 11:13
 *@author plucky@echo.engineer
 *EECross.js 1.0.0
 * Android(JAVA)、iOS(SWIFT/Object C) 与 JS 交互方案
 */
(function($) {

	// 构造jQuery的观察者模式  --Begin
	var o = $({});

	$.subscribe = function() {
		o.on.apply(o, arguments);
	};
	$.unsubscribe = function() {
		o.off.apply(o, arguments);
	};
	$.publish = function() {
		o.trigger.apply(o, arguments);
	};
	$.isJson = function(str) {
		var reg = /^\{(.+:.+,*){1,}\}$/;
		return reg.test(str);
	};
	// 构造jQuery的观察者模式  --End

	//触发URL跳转
	var __loadURL = function(url) {
		var iFrame = document.createElement("iframe");
		iFrame.setAttribute("src", url);
		iFrame.setAttribute("style", "display:none;");
		iFrame.setAttribute("height", "0px");
		iFrame.setAttribute("width", "0px");
		iFrame.setAttribute("frameborder", "0");
		document.body.appendChild(iFrame);

		// 发起请求后这个iFrame就没用了，所以把它从dom上移除掉
		iFrame.parentNode.removeChild(iFrame);
		iFrame = null;
	};

	var __EECross = {
		options: {
			"scheme": "FHMall"
		},
		init: function(scheme) {
			this.options.scheme = scheme;
		},
		//执行原生方法
		executeNative: function(func, params, callback) {
			if(callback) {
				$.subscribe(func, function(e, data) {
					callback(data);
				});
			}
			var aurl = this.options.scheme + "://" + func + "/";
			if(params) {
				for(var akey in params) {
					var keyVal = akey + "=" + params[akey];
					if(aurl.indexOf("?") >= 0) {
						aurl += "&" + keyVal;
					} else {
						aurl += "?" + keyVal;
					}
				}
			}
			__loadURL(aurl);
		}
	};

	window.EECross = __EECross;
	window.onEECrossResult = function(func, data) {
		$.publish(func, data);
	};

})($);
