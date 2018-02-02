	var appId = '';
	var timestamp = '';
	var nonceStr = '';
	var signature = '';
	var returl_url = '';
	var url = location.href.split('#')[0];
    $.ajax({
        url: WapSiteUrl+"/shop/index.php?act=wxtoken",
        type: 'get',
        data:{url:url},
        dataType: 'json',
        async:false,
        success: function(result) {
        	//$("#ok_ou").html(JSON.stringify(result));
        	appId = result.appId;
        	timestamp = result.timestamp;
        	nonceStr = result.nonceStr;
        	signature = result.signature;
        	returl_url = result.url;
        	wxConfig(appId,timestamp,nonceStr,signature);
        }
    });
    
    function wxConfig(appId,timestamp,nonceStr,signature){
   		wx.config({
   			//debug: true,
            appId: appId,
            timestamp: timestamp,
            nonceStr: nonceStr,
            signature: signature,
            jsApiList: [
                'onMenuShareTimeline',//分享到朋友圈
                'onMenuShareAppMessage',//分享给朋友
                'onMenuShareQQ'//分享到QQ
            ]
        });
  	}
