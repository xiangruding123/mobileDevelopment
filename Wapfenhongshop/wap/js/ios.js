function loadURL(url) {
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
}

function debug(data) {
	var reg = /^\{(.+:.+,*){1,}\}$/;
	if(data && reg.test(data)) {
		var ajson = JSON.parse(data);
		$("#msgPnlContent").JSONView(ajson, {
			collapsed: true
		});
	} else {
		$("#msgPnlContent").html(data);
	}
	$("#msgPnl").popup();
}

function showImage(data) {
	$("#debugQrCode").attr("src", data);
	$("#imgPnl").popup();
}

//接收来自FHSafari浏览器的回调
//function onFHMallResult(func, data) {
//	switch(func) {
//		case "getMemberInfo":
//			debug(data);
//			break;
//		case "gotoLogin4Result":
//			$.alert("登录回调:" + data);
//			break;
//		case "shareByApp":
//			$.alert("分享回调:" + data);
//			break;
//		case "doLocate":
//			debug(data);
//			break;
//		case "getAppInfo":
//			debug(data);
//			break;
//		case "pay":
//			$.alert("支付回调:" + data);
//			break;
//		case "genQrcode":
//			showImage(data);
//			break;
//		case "ajax":
//			debug(data);
//			break;
//		default:
//			break;
//	}
//}
//开启定位
function doLocate() {
	loadURL("FHMall://doLocate");
}

//显示地理位置 纬度：lat 经度：lng 位置描述：addr
function showMap() {
	loadURL("FHMall://showMap?mLat=36.081600&mLng=120.422760&mPoi=青岛大学宁夏路231");
}

//跳转至商品详情页
function gotoActivity() {
	var pageData = {
		goodsId: "10588",
		resourceTags: "oooxxx",
		talentDeductid: "xxx000"
	};
	var pageDataStr = JSON.stringify(pageData);
	pageDataStr = BASE64.encoder(pageDataStr);
	loadURL("FHMall://gotoActivity/?controller=ProductDetailsBaseVC&pageData=" + pageDataStr);
}

//分享商品
function shareByApp() {
	//http://www.fenhongshop.com/shop/index.php?act=goods&c=测试&op=index&goods_id=10588
	var aJson = {
		"title": "新茶 武夷岩茶 散装正宗大红袍茶叶 礼盒装 浓香 特级 新兴",
		"content": "试饮精装版，一罐茶叶净重量50g，每天17点的订单可当日发货，17点后的次日发出。",
		"imgs": "http://img.fenhongshop.com/goods/325714/20150322/550edefe683df.jpg!big",
		"shareImage": true,
		"justWechat": false,
		"cutLastOne": true,
		"mul_img": ["http://img.fenhongshop.com/goods/325714/20150322/550edefe683df.jpg!big", "https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/logo_white_fe6da1ec.png"],
		"url": "http://www.fenhongshop.com/wap/tmpl/index",
		"storeInfo": {
			"store_name": "喵喵喵的小店",
			"store_avatar": "http://www.fenhongshop.com/wap/images/wap/logo.png",
			"store_qrcode": "http://bshare.optimix.asia/barCode?site=weixin&url=http://www.fenhongshop.com/wap/tmpl/mircoshop/shop.html?shop_id=1102785%26deductid=328386",
			"store_banner": "http://42.96.171.11/fh_app/resources/fhshare/A.jpg"
		}
	};
	var shareJson = JSON.stringify(aJson);
	shareJson = BASE64.encoder(shareJson);
	loadURL("FHMall://shareByApp/?shareJson=" + shareJson);
}

//获取会员信息
function getMemberInfo() {
	loadURL("FHMall://getMemberInfo");
}

//轻提示
function toast() {
	var content = "耀哥V5";
	loadURL("FHMall://toast/?content=" + content);
}

//获取APP信息
function getAppInfo() {
	loadURL("FHMall://getAppInfo");
}

//支付
function pay() {
	var aJson = {
		pay_sn: "780530012905083386",
		country_source: 0,
		payment_list: "alipay,wxpay"
	};
	var payInfo = JSON.stringify(aJson);
	payInfo = BASE64.encoder(payInfo);
	loadURL("FHMall://pay/?payInfo=" + payInfo);
}

//退出登录
function logOff() {
	loadURL("FHMall://logOff");
}

//登录带回调
function gotoLogin4Result() {
	loadURL("FHMall://gotoLogin4Result");
}

//解锁分享按钮
function enableShareButton() {
	var aJson = {
		"title": "新茶 武夷岩茶 散装正宗大红袍茶叶 礼盒装 浓香 特级 新兴",
		"content": "试饮精装版，一罐茶叶净重量50g，每天17点的订单可当日发货，17点后的次日发出。",
		"imgs": "http://img.fenhongshop.com/goods/325714/20150322/550edefe683df.jpg!big",
		"shareImage": true,
		"justWechat": false,
		"cutLastOne": true,
		"mul_img": ["http://img.fenhongshop.com/goods/325714/20150322/550edefe683df.jpg!big", "https://ss0.bdstatic.com/5aV1bjqh_Q23odCf/static/superman/img/logo/logo_white_fe6da1ec.png"],
		"url": "http://www.fenhongshop.com/shop/index.php?act=goods&c=测试&op=index&goods_id=10588",
		"storeInfo": {
			"store_name": "喵喵喵的小店",
			"store_avatar": "http://www.fenhongshop.com/wap/images/wap/logo.png",
			"store_qrcode": "http://bshare.optimix.asia/barCode?site=weixin&url=http://www.fenhongshop.com/wap/tmpl/mircoshop/shop.html?shop_id=1102785%26deductid=328386",
			"store_banner": "http://42.96.171.11/fh_app/resources/fhshare/A.jpg"
		}
	};
	var shareJson = JSON.stringify(aJson);
	shareJson = BASE64.encoder(shareJson);
	loadURL("FHMall://enableShareButton/?shareJson=" + shareJson);
}

//复制文本
function copy() {
	var content = "耀哥V5";
	loadURL("FHMall://copy/?content=" + content);
}

//下载文件
function download() {
	var urls = "http://pic.fenhongshop.com/slides/20160530/574baefa467f4.jpg,http://pic.fenhongshop.com/slides/20160602/574fc812ba012.jpg,http://7xs20s.com1.z0.glb.clouddn.com/tuchongeter/ff13728b4710b912ff079bfbcbfdfc03934522f6.jpg,http://7xs20s.com1.z0.glb.clouddn.com/tuchongeter/%E7%B4%A0%E6%9D%90/downtown-1-10.png";
	loadURL("FHMall://download/?urls=" + urls);
}

//回到首页
function gotoHome() {
	// index：0-首页 1-分类 2-发现 3-购物车 4-我的 
	var index = 3;
	loadURL("FHMall://gotoHome/?index=" + index);
}

//重新加载
function reload() {
	loadURL("FHMall://reload");
}

//关闭浏览器
function finish() {
	loadURL("FHMall://finish");
}

//原生ajax
function ajax() {
	var aJson = {
		'url': "http://test.fenhongshop.com/api/index.php?act=common_member&op=get_member_info&flag=android",
		'method': "POST",
		'data': {
			'mid': "328386",
			'token': "xxxoooxxx000"
		}
	};
	var ajaxData = JSON.stringify(aJson);
	ajaxData = BASE64.encoder(ajaxData);
	loadURL("FHMall://ajax/?ajaxData=" + ajaxData);
}

//生成二维码
function genQrcode() {
	var aJson = {
		qrtext: "耀哥V5",
		width: 200,
		height: 200,
		preFix: "data:image/png;base64,"
	}
	var params = JSON.stringify(aJson);
	params = BASE64.encoder(params);
	loadURL("FHMall://genQrcode/?params=" + params);
}