/*
 * author:Plucky 2015-10-6
 * native_flag 当前浏览器标识 0 表示Android 1 表示iOS -1表示其他浏览器
 * domain 活动页域名 可统一替换（正式上线换成www）
 */
var native_flag = -1;
var domain = "http://www.fenhongshop.com";

/* -------------- 一大批私有函数-------------- */

/*
 *  所有活动页面的商品点击事件
 *  注意格式：name 标签一定要赋值为goods_id
 *  如：<a href="#" data-id="17430"></a>
 *     <div class="xxx" data-id="17430"></div>
 */




//活动页面跳转原生商品页面
function onGoodsClick(e) {
	
    equipmentCheck();
    
	var goods_id = e.getAttribute("data-id");


    
    
	var murl = domain + "/shop/index.php?act=goods&op=index&goods_id=" + goods_id;
	if(native_flag==0) {
		
	FHMall.gotoActivity("com.fanglin.fenhong.microbuyer.buyer.GoodsDetailsActivity", goods_id);

	}else if(native_flag==1){
		
	}else if(native_flag==-1){
		
	window.location.href = murl;     
		
	}
}

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
//appdne登录
function appLogin(){
	
	equipmentCheck();
	
	if(native_flag=="0"){
	  FHMall.logOff();
	}else if(native_flag=="1"){
		try{
		  ilogOff();
		}catch(e){
			
		}
	  
	}
	
}

/* ios退出登录 */
function ilogOff() {
		var data = {
			"func" : "logoff",
			"params" : ""
		};
		_bridge.send(data);
}

//获取App信息

function getAppInfo() {
	    var obj = JSON.parse(FHMall.getAppInfo());	
	    return obj;
}



//注销登录

function logOff() {
	FHMall.logOff();
}

//获取会员信息

function getMemberInfo() {
		var obj = JSON.parse(FHMall.getMemberInfo());	
		return obj
	}

//话费红包分享
function shareByApp() {
	var sharejson = {
		"title": "话费红包",
		"content": "【发红包啦】话费红包先到先得，100%中奖！",
		"imgs": WapSiteUrl+ "/wap/tmpl/phone_bill/img/icon_cai.png",
		"url":WapSiteUrl+ "/wap/tmpl/phone_bill/index.html"
	};
	FHMall.shareByApp(JSON.stringify(sharejson), function(data) {
		output.innerText = "msg:" + data;
	});
}
function shareByApp(title,content,imgs,url) {
	var sharejson = {
		"title": title,
		"content": content,
		"imgs": imgs,
		"url": url
	};
	FHMall.shareByApp(JSON.stringify(sharejson), function(data) {
		output.innerText = "msg:" + data;
	});
}
//保存图片
 function OpenPicture(url) {     	
        FHMall.OpenPicture(url);
     }
 //支付
 function pay(pay_sn,pay_amount,country_source) {   	
     	
        return FHMall.pay(pay_sn,pay_amount,country_source,function(data) {
             output.innerText = "msg:" + data;
         });
 }
 
 /*设置App浏览器右上角分享按钮*/
 function enableShareButton(_title,_content,_imgs,_url) {
        var sharejson = {
             "title" : _title,
             "content" : _content,
             "imgs" : _imgs,
             "url" : _url
         };
         FHMall.enableShareButton(JSON.stringify(sharejson));
}
