//何辩

//相同的URL前缀
var urlConfig = "";

//版本号
var Version = "weixin0.1";

function loadjscssfile(filename, filetype) {
	if(filetype == "js") {
		var fileref = document.createElement('script');
		fileref.setAttribute("type", "text/javascript");
		fileref.setAttribute("src", filename + "?version=" + Version);
	} else if(filetype == "css") {
		var fileref = document.createElement('link');
		fileref.setAttribute("rel", "stylesheet");
		fileref.setAttribute("type", "text/css");
		fileref.setAttribute("href", filename + "?version=" + Version);
	}
	if(typeof fileref != "undefined") {
		document.getElementsByTagName("head")[0].appendChild(fileref);
	}
}

var localhost = window.location.href;
if(localhost.substr(0, 5).toLowerCase() == 'http:') {
	loadjscssfile('http://res.wx.qq.com/open/js/jweixin-1.0.0.js', 'js');
} else {
	loadjscssfile(' https://res.wx.qq.com/open/js/jweixin-1.0.0.js', 'js');
}

//调用方式
//loadjscssfile('js/common/config.js','js');