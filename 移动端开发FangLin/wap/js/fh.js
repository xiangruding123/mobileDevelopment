document.write("<script src='../../js/eecross.js'></script>");
/*判断设备*/

var ss = navigator.userAgent.toLowerCase();

if(ss.indexOf("fhmall_android") > 0) {
	native_flag = 0;
} else if(ss.indexOf("fhmall_ios") > 0) {
	native_flag = 1;
} else {
	native_flag = -1;
}

//login
function appMemberInfo(load) {
	if(native_flag == '0') {
		try {
			var obj = JSON.parse(FHMall.getMemberInfo());
		} catch(e) {
			var timer = setTimeout(function() {
				var obj = JSON.parse(FHMall.getMemberInfo());
				if(obj.member_id) {
					load.success(obj);
					clearInterval('timer');
				}
			}, 100);
		}

		if(obj.member_id) {
			load.success(obj);
		}

	} else if(native_flag == '1') {

				EECross.executeNative("getMemberInfo", null, function(data) {
					var memberInfo = JSON.parse(data);
					load.success(memberInfo);
				});

	}
}

//安卓
if(native_flag == '0') {
	//按钮分享
	function shareByApp(obj) {
		var sharejson = {
			"title": obj.title,
			"content": obj.desc,
			"imgs": obj.img,
			"shareImage": obj.shareImage || false,
			"justWechat": obj.justWechat || false,
			"cutLastOne": obj.cutLastOne || false,
			"mul_img": obj.mul_img,
			"url": obj.url,
			"storeInfo": {
				"store_name": obj.store_name,
				"store_avatar": obj.store_avatar,
				"store_qrcode": obj.store_qrcode,
				"store_banner": obj.store_banner
			}
		};
		FHMall.shareByApp(JSON.stringify(sharejson), function(data) {

		});
	}
}


/* 按钮分享 */
function appShare(obj) {
	if(native_flag == '0') {
		shareByApp(obj);
	} else if(native_flag == '1') {
		ishareByApp(obj);
	}
}

// 链接跳转
function gotoAppHome(appIndex) {
	if(native_flag == '0') {
		FHMall.gotoHome(appIndex);
	} else if(native_flag == '1') {
		igotoHome(appIndex);
	}
}

function rightShare(obj) {

	if(native_flag == '0') {

		try {
			enableShareButton(obj);
		} catch(e) {

			setTimeout(function() {
				enableShareButton(obj);
			}, 50);

		}

	} else if(native_flag == '1') {

		ienableShareButton(obj);


	}

}

//设置android分享
function enableShareButton(obj) {
	var sharejson = {
		"title": obj.title,
		"content": obj.desc,
		"imgs": obj.img,
		"shareImage": obj.shareImage || false,
		"justWechat": obj.justWechat || false,
		"cutLastOne": obj.cutLastOne || false,
		"mul_img": obj.mul_img,
		"url": obj.url,
		"storeInfo": {
			"store_name": obj.store_name,
			"store_avatar": obj.store_avatar,
			"store_qrcode": obj.store_qrcode,
			"store_banner": obj.store_banner
		}
	};
	FHMall.enableShareButton(JSON.stringify(sharejson));
}



// function ishowImage(data) {
// 	$("#debugQrCode").attr("src", data);
// 	$("#imgPnl").popup();
// }


//开启定位
// function doLocate() {
// 	EECross.executeNative("doLocate", null, function(data) {
// 		debug(data);
// 	});
// }

//显示地理位置 纬度：mLat 经度：mLng 位置描述：mPoi
// function showMap() {
// 	EECross.executeNative("showMap", {
// 		mLat: 36.081600,
// 		mLng: 120.422760,
// 		mPoi: "青岛大学宁夏路231"
// 	}, null);
// }

//分享商品
function ishareByApp(obj) {

	var aJson = {
		"title": obj.title,
		"content": obj.desc,
		"imgs": obj.img,
		"shareImage": obj.shareImage || false,
		"justWechat": obj.justWechat || false,
		"cutLastOne": obj.cutLastOne || false,
		"mul_img": obj.mul_img,
		"url": obj.url,
		"storeInfo": {
			"store_name": obj.store_name,
			"store_avatar": obj.store_avatar,
			"store_qrcode": obj.store_qrcode,
			"store_banner": obj.store_banner
		}

	};
	var shareJson = JSON.stringify(aJson);
	shareJson = BASE64.encoder(shareJson);

	EECross.executeNative("shareByApp", {
		"shareJson": shareJson
	}, function(data) {

	});
}



//轻提示
function itoast(toastcontent) {
	EECross.executeNative("toast", {
		"content": toastcontent
	}, null);
}

//获取APP信息
// function igetAppInfo() {
// 	EECross.executeNative("getAppInfo", null, function(data) {
//
// 	});
// }


//支付
function ipay() {
	var atime = new Date();
	var timeStr = atime.getTime().toString();
	var aJson = {
		pay_sn: timeStr,
		country_source: 0,
		pay_amount: 0.01,
		payment_list: ["alipay", "wxpay"]
	};
	var payInfo = JSON.stringify(aJson);
	payInfo = BASE64.encoder(payInfo);
	EECross.executeNative("pay", {
		"payInfo": payInfo
	}, function(data) {
		// debug(data);
	});
}

//退出登录
function ilogOff() {
	EECross.executeNative("logOff", null, null);
}

//登录带回调
function igotoLogin4Result() {
	EECross.executeNative("gotoLogin4Result", null, function(data) {
		// debug(data);
	});
}

//右上角分享按钮
function ienableShareButton(obj) {
	var aJson = {
		"title": obj.title,
		"content": obj.desc,
		"imgs": obj.img,
		"shareImage": obj.shareImage || false,
		"justWechat": obj.justWechat || false,
		"cutLastOne": obj.cutLastOne || false,
		"mul_img": obj.mul_img,
		"url": obj.url,
		"storeInfo": {
			"store_name": obj.store_name,
			"store_avatar": obj.store_avatar,
			"store_qrcode": obj.store_qrcode,
			"store_banner": obj.store_banner
		}

	};
	var shareJson = JSON.stringify(aJson);
	shareJson = BASE64.encoder(shareJson);

	EECross.executeNative("enableShareButton", {
		"shareJson": shareJson
	}, null);
}


//复制文本
function icopy(copycontent) {
	EECross.executeNative("copy", {
		"content": copycontent
	}, null);
}

//下载文件
function idownload(downUrls) {
	var ajson = {
		// "array": [
		// 	"http://7xs20s.com1.z0.glb.clouddn.com/tuchongeter/ff13728b4710b912ff079bfbcbfdfc03934522f6.jpg",
		// 	"http://7xs20s.com1.z0.glb.clouddn.com/tuchongeter/%E7%B4%A0%E6%9D%90/downtown-1-10.png"
		// ]
		"array":downUrls
	};
	var urls = JSON.stringify(ajson);
	urls = BASE64.encoder(urls);
	EECross.executeNative("download", {
		"urls": urls
	}, null);
}

//回到首页
function igotoHome(goindex) {
	// index：0-首页 1-分类 2-发现 3-购物车 4-我的
	EECross.executeNative("gotoHome", {
		"index": goindex
	}, null);
}

//重新加载
function ireload() {
	EECross.executeNative("reload", null, null);
}

//关闭浏览器
function ifinish() {
	EECross.executeNative("finish", null, null);
}

//原生ajax
function iajax() {
	var aJson = {
		'url': "http://test.fenhongshop.com/api/index.php?act=common_member&op=get_member_info&flag=android",
		'method': "POST",
		'data': {
			'mid': "1113182",
			'token': "cd958551d23294caa8ee2a54b6b460e4"
		}
	};
	var ajaxData = JSON.stringify(aJson);
	ajaxData = BASE64.encoder(ajaxData);
	EECross.executeNative("ajax", {
		"ajaxData": ajaxData
	}, function(data) {
      //  debug(data);
	});
}

//生成二维码
function igenQrcode() {
	var aJson = {
		qrtext: "耀哥V5",
		width: 200,
		height: 200,
		preFix: "data:image/png;base64,"
	}
	var params = JSON.stringify(aJson);
	params = BASE64.encoder(params);

	EECross.executeNative("genQrcode", {
		"params": params
	}, function(data) {
		// ishowImage(data);
	});
}

//跳转至商品详情页
// function igotoActivity() {
// 	var pageData = {
// 		goodsId: "10588",
// 		resourceTags: "oooxxx",
// 		talentDeductid: "xxx000"
// 	};
// 	var pageDataStr = JSON.stringify(pageData);
// 	pageDataStr = BASE64.encoder(pageDataStr);
//
// 	EECross.executeNative("gotoActivity", {
// 		controller: "ProductDetailsBaseVC",
// 		pageData: pageDataStr
// 	}, function(data) {
// 		debug(data);
// 	});
// }

//订单确认
function igenOrder() {
	var data = {
		"goodsId_num": "140|1",
		"goods_source": "0",
		"if_cart": "0",
		"resource_tags": "XXXXX",
		"pintuan_id": "8",
		"pintuan_group_id": "",
		"pintuan_parent_id": ""
	};

	var params = JSON.stringify(data);
	params = BASE64.encoder(params);

	EECross.executeNative("gotoActivity", {
		controller: "CheckCartViewController",
		pageData: params
	}, null);
}
