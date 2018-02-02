/*判断设备*/
equipmentCheck();

function equipmentCheck() {

	var ss = navigator.userAgent.toLowerCase();


	if (ss.indexOf("fhmall_android") > 0) {
		return native_flag = 0;
	} else if (ss.indexOf("fhmall_ios") > 0) {
		return native_flag = 1;
	} else {
		return native_flag = -1;
	}

}


//ios初始化
if(native_flag == '1'){

	var _bridge;

    function connectWebViewJavascriptBridge(callback) {
    		if (window.WebViewJavascriptBridge) {
    			callback(WebViewJavascriptBridge);
    		} else {
    			document.addEventListener('WebViewJavascriptBridgeReady', function() {
    				callback(WebViewJavascriptBridge);
    			}, false);
    		}
	}
}


function appMemberInfo(load){
	if (native_flag == '0') {
        try {
          var obj = JSON.parse(FHMall.getMemberInfo());
        } catch (e) {
          var timer = setTimeout(function(){
            var obj = JSON.parse(FHMall.getMemberInfo());
                 if(obj.member_id){
                    load.success(obj);
                    clearInterval('timer');
                 }
          },100);
        }
	}else if(native_flag == '1') {

        connectWebViewJavascriptBridge(function(bridge) {
        _bridge = bridge;
        try {
          bridge.init(function(message, responseCallback) {

          });
        } catch (e) {

        }
        igetMemberInfo(load);
      });

	}
}






    function igetMemberInfo(load) {
		var data = {
			"func": "getmember",
			"params": ""
		};

		_bridge.send(data, function(responseData) {
			if (responseData == null) {

				gotoLogin4Result();

			} else {

        load.success(responseData);

			}

		});
	}

	function gotoLogin4Result() {
		var data = {
			"func": "gotoLogin4Result",
			"params": ""
		};

		_bridge.send(data, function(responseData) {

			igetMemberInfo();

		});
	}
