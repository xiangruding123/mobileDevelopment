
### mediaMobile：

```
css，纯css的实现方式，在css中设置根节点html的字体大小，body内容的部分的大小采用rem为长度单位且会根据相应的根节点大小来实现适配。
本media1.css文件的设计稿需要是640px的，这样在iPhone5下就能完全适配，且包括尺寸大于iPhone的手机都能实现适配。
在iPhone5的调试下，640px的设计稿，对应的元素大小只需要将像素大小除以50px即可得到页面该元素的像素大小。
```

--------------

### mediaPC_demo:

```

关于媒体查询实现自适应网页布局的一个案例demo
作为pc网页媒体查询的参考案例，实现网页的自适应布局/响应式布局/流式布局 

简单描述：
//------------------------------------
.gridmenu {
	width: 23%;
}
.gridmain {
	width: 48%;
}
.gridright {
	width: 23%;
	margin-right: 0;
}
.gridfooter {
	width: 100%;
	margin-bottom: 0;
}
@media only screen and (max-width: 500px) {
	.gridmenu {
		width: 100%;
	}
	.menuitem {
		margin: 1%;
		padding: 1%;
	}
	.gridmain {
		width: 100%;
	}
	.main {
		padding: 1%;
	}
	.gridright {
		width: 100%;
	}
	.right {
		padding: 1%;
	}
	.gridbox {
		margin-right: 0;
		float: left;
	}
}
```

---------------

### media设置参考：

所移动端和PC端的media，媒体查询方式实现PC端页面的响应式布局的media的设置。

----------

### meta标签设置：

页面首部的meta的设置
```
<head>
	<meta charset="UTF-8">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <meta name="format-detection" content="telephone=no">
    <meta name="format-detection" content="email=no">
    <meta content="yes" name="apple-mobile-web-app-capable">
    <meta content="yes" name="apple-touch-fullscreen">
    <meta content="telephone=no,email=no" name="format-detection">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=0">
	<title>淘宝的meta标签</title>
</head>
```
--------------

### MonileTemplete:

简单的rem示例，更多关于templete.js的使用参见Wapfenhongshop文件中的wap文件内容：
eg:
```
 <script type="text/html" id="coupon_tpl">
    <%if(result.bundling){%>
       <%for(var i=0;i<result.bundling.length;i++){%>           	
       	  <div class="suit"><a href="coupon_detail.html?typenum=<%=i%>&goods_id=<%=result.bundling[0].goods_list[0].id%>" class="skip-link"><p class="mb10 mt10">套装<%=i+1%> ￥<%=result.bundling[i].current_price%>省<span class="font-pink"><%=(result.bundling[i].cost_price-result.bundling[i].current_price).toFixed(2)%></span>元<i class="icon-angle-right pull-right"></i></p></a>
        	<div id="t-tabs-<%=i%>">
        		<a href="coupon_detail.html?typenum=<%=i%>&goods_id=<%=result.bundling[0].goods_list[0].id%>" class="skip-link">
			        <ul class="nav navbar-nav">
			        	<%for(var k=0;k<result.bundling[i].goods_list.length;k++){%>				        	
			          		<li>
			          			<img src="../../images/wap/guanggao-1.jpg" alt="" data-original="<%=result.bundling[i].goods_list[k].image%>" class="coupon_img"/><span class="add">+</span>
			          		</li>				          		
                        <%}%>        	
			        </ul>
			     </a>
		    </div>
        </div>
       <%}%>
    <%}%>
</script>
```
-------------
### rem

三种rem的设置：adaptive.js、flexible.js、rem.js（Liujingzhao）：
```
1、https://github.com/Vibing/adaptive
2、https://github.com/amfe/lib-flexible
3、
<script type="text/javascript">
	!function(win){function resize(){var domWidth=domEle.getBoundingClientRect().width;if(domWidth/v>540){domWidth=540*v}win.rem=domWidth/7.5;domEle.style.fontSize=win.rem+"px"}var v,initial_scale,timeCode,dom=win.document,domEle=dom.documentElement,viewport=dom.querySelector('meta[name="viewport"]'),flexible=dom.querySelector('meta[name="flexible"]');if(viewport){var o=viewport.getAttribute("content").match(/initial\-scale=(["']?)([\d\.]+)\1?/);if(o){initial_scale=parseFloat(o[2]);v=parseInt(1/initial_scale)}}else{if(flexible){var o=flexible.getAttribute("content").match(/initial\-dpr=(["']?)([\d\.]+)\1?/);if(o){v=parseFloat(o[2]);initial_scale=parseFloat((1/v).toFixed(2))}}}if(!v&&!initial_scale){var n=(win.navigator.appVersion.match(/android/gi),win.navigator.appVersion.match(/iphone/gi));v=win.devicePixelRatio;v=n?v>=3?3:v>=2?2:1:1,initial_scale=1/v}if(domEle.setAttribute("data-dpr",v),!viewport){if(viewport=dom.createElement("meta"),viewport.setAttribute("name","viewport"),viewport.setAttribute("content","initial-scale="+initial_scale+", maximum-scale="+initial_scale+", minimum-scale="+initial_scale+", user-scalable=no"),domEle.firstElementChild){domEle.firstElementChild.appendChild(viewport)}else{var m=dom.createElement("div");m.appendChild(viewport),dom.write(m.innerHTML)}}win.dpr=v;win.addEventListener("resize",function(){clearTimeout(timeCode),timeCode=setTimeout(resize,300)},false);win.addEventListener("pageshow",function(b){b.persisted&&(clearTimeout(timeCode),timeCode=setTimeout(resize,300))},false);resize()}(window);
</script>
```

---------------
### Rem_163.com

163.com网易官网的rem方式：
#### 1、
```
<script>
    document.documentElement.style.fontSize = document.documentElement.clientWidth / 7.5 + 'px';
    //7.5是根据你的设计稿的width决定写多少，如果是640的，那就写6.4；其他道理一样！
</script>
```
#### 2、
```
<script>
    (function(win,doc){
        win.onload = win.onresize = function(){
            doc.documentElement.style.fontSize = doc.documentElement.clientWidth*100/750+'px';
        };

//		doc.documentElement.style.fontSize = doc.documentElement.clientWidth*100/750+'px';
//      win.addEventListener("resize",function(){
//      	doc.documentElement.style.fontSize = doc.documentElement.clientWidth*100/750+'px';
//      },false);
    })(window,document);
</script>
```

--------------

### Rem_bilibili

B站的rem实现方式：采用的是hotcss.js 跟多内容详见里边文件的hotcss文件夹内容参考demo。



------------

#### wapfenhongshop 芳邻信息的移动端实现代码

-----------


## detect.js文件

-- 是张璇提供的PC端到移动端的切换凡是代码，在 需要实现pc端转换移动端的代码是可以采用这个来实现。
代码如下：
```
/**
 * Created by zhengdai on 16/8/3.
 * PC端到移动端的切换实现
 */
function detect(ua, platform){
    var os = {}, browser = {},
        webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
        android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
        osx = !!ua.match(/\(Macintosh\; Intel /),
        ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
        ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
        iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
        webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
        win = /Win\d{2}|Windows/.test(platform),
        wp = ua.match(/Windows Phone ([\d.]+)/),
        touchpad = webos && ua.match(/TouchPad/),
        kindle = ua.match(/Kindle\/([\d.]+)/),
        silk = ua.match(/Silk\/([\d._]+)/),
        blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
        bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
        rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
        playbook = ua.match(/PlayBook/),
        chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
        firefox = ua.match(/Firefox\/([\d.]+)/),
        firefoxos = ua.match(/\((?:Mobile|Tablet); rv:([\d.]+)\).*Firefox\/[\d.]+/),
        ie = ua.match(/MSIE\s([\d.]+)/) || ua.match(/Trident\/[\d](?=[^\?]+).*rv:([0-9.].)/),
        webview = !chrome && ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/),
        safari = webview || ua.match(/Version\/([\d.]+)([^S](Safari)|[^M]*(Mobile)[^S]*(Safari))/)

    // Todo: clean this up with a better OS/browser seperation:
    // - discern (more) between multiple browsers on android
    // - decide if kindle fire in silk mode is android or not
    // - Firefox on Android doesn't specify the Android version
    // - possibly devide in os, device and browser hashes

    if (browser.webkit = !!webkit) browser.version = webkit[1]

    if (android) os.android = true, os.version = android[2]
    if (iphone && !ipod) os.ios = os.iphone = true, os.version = iphone[2].replace(/_/g, '.')
    if (ipad) os.ios = os.ipad = true, os.version = ipad[2].replace(/_/g, '.')
    if (ipod) os.ios = os.ipod = true, os.version = ipod[3] ? ipod[3].replace(/_/g, '.') : null
    if (wp) os.wp = true, os.version = wp[1]
    if (webos) os.webos = true, os.version = webos[2]
    if (touchpad) os.touchpad = true
    if (blackberry) os.blackberry = true, os.version = blackberry[2]
    if (bb10) os.bb10 = true, os.version = bb10[2]
    if (rimtabletos) os.rimtabletos = true, os.version = rimtabletos[2]
    if (playbook) browser.playbook = true
    if (kindle) os.kindle = true, os.version = kindle[1]
    if (silk) browser.silk = true, browser.version = silk[1]
    if (!silk && os.android && ua.match(/Kindle Fire/)) browser.silk = true
    if (chrome) browser.chrome = true, browser.version = chrome[1]
    if (firefox) browser.firefox = true, browser.version = firefox[1]
    if (firefoxos) os.firefoxos = true, os.version = firefoxos[1]
    if (ie) browser.ie = true, browser.version = ie[1]
    if (safari && (osx || os.ios || win)) {
        browser.safari = true
        if (!os.ios) browser.version = safari[1]
    }
    if (webview) browser.webview = true

    os.tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) ||
    (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)))
    os.phone  = !!(!os.tablet && !os.ipod && (android || iphone || webos || blackberry || bb10 ||
    (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) ||
    (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))))

    return os;
}
var os = detect(navigator.userAgent, navigator.platform);
if(os.phone) {
    var index = location.href.lastIndexOf('/');
    location.href = location.href.substr(0, index + 1) + 'mobile/' + location.href.substr(index + 1);
}
```

------------














