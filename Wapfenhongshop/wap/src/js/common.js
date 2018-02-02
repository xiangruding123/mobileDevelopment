/*带有sweetalert插件提示的登录验证  */ 
function check_login() {
    if (!FL.token) {
        swal({
                title: "",
                text: "请先登录",
                type: "warning",
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确定",
                closeOnConfirm: false
            },
            function() {
                FL.logLogin();
            });

    }
}



//判断是否提示下载APP
var firstShow = getcookie("firstShow");

var ss = navigator.userAgent.toLowerCase();//判断是否是wap

if(firstShow==""&&ss.indexOf("fh")==-1){
    var dom = '<div class="downLoad-fix layout">'
        +'<img src="../../images/wap/downLoad.jpg" style="width:100%" id="downLoad-btn"/>'
        +'<img src="../../images/wap/top-x.png" class="downLoad-x" id="closeDownLoad" />'
        +'</div>';
    $("body").prepend(dom);
    $("#closeDownLoad").click(function(){
        $(".downLoad-fix").hide();
        addcookie("firstShow","no",1);
    });
    //判断安卓和苹果下载链接
    var u = navigator.userAgent, app = navigator.appVersion;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    $('#downLoad-btn').click(function(){

        location.href='http://a.app.qq.com/o/simple.jsp?pkgname=com.fanglin.fenhong.microbuyer';

    })
}
/*加载fastclick*/
try{
    FastClick.attach(document.body);
}catch(e){

}
/*统计代码*/

var statisticsDom='<div style="display:none;">'
    +'<script src="http://s4.cnzz.com/z_stat.php?id=1000496844&web_id=1000496844" language="JavaScript">'
    +'</script>'
    +'</div>';
$("body").prepend(statisticsDom);


/* 微店安卓客户端调用，写入cookie*/
function onSignWap(key, userid, username) {

    //alert(userid);

    addcookie('key', key);

    addcookie('userid', userid);

    addcookie('username', username);

    addcookie('istuiguang', 1);

    //$("body").append('<div style="padding-bottom:4em;">key='+key+'</div>');

}
//链接带后缀！用
function getUrl(url,name) {

    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = url.split("?")[1].match(reg);
    //	var r = url.split(name+"=")[1].split("!")[0];

    if (r != null)

        return decodeURI(r[2]);

    return null;

}
//全局添加A链接监听
function Aclick(load){
    var ss = navigator.userAgent.toLowerCase();//判断是否是wap
    if(ss.indexOf("fh")<0){

        $("a[href]").unbind("click").bind("click",function(e){
            var me = this;
            var url = $(me).attr("href");
            url = url.replace(/&amp;/g,"&");
            if(url&&url.split("!")[1]){
                try{
                    var suffix = url.split("!")[1].split("&")[0];
                    var newUrl = url.split("!")[0];
                    var parameter  = url.split("!")[1].split("&")[1];
                    if(suffix =="nation"){
                        var activity_id = getUrl(newUrl,"val");
                        location.href = "../activity/pavilion.html?activity_id="+activity_id;
                    }else if(suffix =="goodsdetail"){//商品详情
                        var goods_id = getUrl(newUrl,"goods_id");

                        location.href = "../shopping/goods_details.html?goods_id="+goods_id+"&"+parameter+"&resource_tags="+load;
                    }else if(suffix =="store"){//店铺
                        var store_id = getUrl(newUrl,"store_id");
                        location.href = "../store/store_index.html?store_id="+store_id;
                    }else if(suffix =="microshop"){//微店
                        var shop_id = getUrl(newUrl,"shop_id");
                        location.href = "../activity/discover_details.html?shop_id="+shop_id;
                    }else if(suffix =="express"){//物流
                        var e_code = getUrl(newUrl,"e_code");
                        var shipping_code = getUrl(newUrl,"shipping_code");
                        location.href = "../shopping/goods_details.html?e_code="+e_code+"&shipping_code="+shipping_code;
                    }else if(suffix =="activity"){//主题馆
                        var activity_id = getUrl(newUrl,"activity_id");
                        var title = unescape(getUrl(newUrl,"title"));
                        location.href = "../activity/theme_details.html?activity_id="+activity_id+"&title="+title;
                    }else{
                        location.href=url;
                    }
                    e.preventDefault();
                }catch(e){

                }
            }
        });
    }
}
//全局监听ajax
var _ajax = $.ajax;
$.ajax = function(options){
    options.timeout = options.timeout||20000;

    var _success = options.success || function(){};
    var _error = options.error || function(){};
    var _complete = options.complete || function(){};

    options.success = function(xhr,status,err){
        if(xhr&&(xhr.error=="0010"||xhr.error=="0009"||xhr.error=="0008")){

            setTimeout(function(){
                try{
                    appLogin();
                }catch(e){

                }
            },1000);

        }

        if(xhr&&xhr.error=="0010"){
            layer.msg("您的账号已在别的地方登录");
            delCookie("mid");
            delCookie("token");
            setTimeout(function(){
                FL.logLogin();
            },1000);
        }else if(xhr&&xhr.error=="0009"){
            delCookie("mid");
            delCookie("token");
        }else if(xhr&&xhr.error=="2001008"){
            layer.msg("商品即将发售,敬请期待");
        }else if(xhr&&xhr.error=="2001003"){
            layer.msg("商品已售罄，我们正在神速补货，请先收藏商品");
        }else if(xhr&&xhr.error=="2001004"){
            layer.msg("购买商品太多");
        }else if(xhr&&xhr.error=="2001001"){
            layer.msg("商品已下架");
        }else if(xhr&&xhr.error=="2001006"){
            layer.msg(xhr.msg||"商品已下架或不存在");
            setTimeout(function(){
                location.href="../index/index.html";
            },4500);
        }



        _success(xhr,status,err);
    };
    options.error = function(xhr,status,err){
        if(status == "timeout"){
            $(".fh-loading").remove();

            layer.msg("请求超时");
        }else if(xhr){

        }

    };
    options.complete = function(xhr,status,err){

        $(".fh-loading").remove();

        try{
            var resource_tags = getUrl(JSON.parse(xhr.responseText).url,"resource_tags");
        }catch(e){

        }
        Aclick(resource_tags);

    }
    //调用原始ajax获取数据
    xhr = _ajax(options);

    return xhr;
}

//ajax loading
$(document).on("ajaxStart",function() {
    try{

        FL.fhload();

    }catch(e){

    }

});
$(document).on("ajaxComplete",function() {

    setTimeout(function() {
        $(".fh-loading").remove();
    }, 100);
});

function GetQueryString(name) {

    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");

    var r = window.location.search.substr(1).match(reg);

    if (r != null)

        return decodeURI(r[2]);

    return null;

}



function addcookie(name, value, days) {

    days = days || 0;

    var expires = "";

    if (days != 0) {

        var date = new Date();

        date.setTime(date.getTime() + (days * 24 * 3600 * 1000));

        expires = "; expires=" + date.toGMTString();

    }

    document.cookie = name + "=" + escape(value) + expires + "; path=/";

}



function getcookie(name) {

    var strcookie = document.cookie;

    var arrcookie = strcookie.split("; ");

    for (var i = 0; i < arrcookie.length; i++) {

        var arr = arrcookie[i].split("=");

        if (arr[0] == name)

            return arr[1];

    }

    return "";

}



function delCookie(name) { //删除cookie

    var exp = new Date();

    exp.setTime(exp.getTime() - 1);

    var cval = getcookie(name);

    if (cval != null)

        document.cookie = name + "=" + cval + "; path=/;expires=" + exp.toGMTString();

}



function checklogin(state) {

    if (state == 0) {

        FL.logLogin();

        return false;

    } else {

        return true;

    }

}
/*时间戳转日期*/
function getLocalTime(nS) {
    return new Date(parseInt(nS) * 1000);
};


function contains(arr, str) {

    var i = arr.length;

    while (i--) {

        if (arr[i] === str) {

            return true;

        }

    }

    return false;

}



function buildUrl(type, data) {

    switch (type) {

        case 'keyword':

            return WapSiteUrl + '/tmpl/product_list.html?keyword=' + encodeURIComponent(data);

        case 'special':

            return WapSiteUrl + '/special.html?special_id=' + data;

        case 'goods':

            return WapSiteUrl + '/tmpl/product_detail.html?goods_id=' + data;

        case 'url':

            return data;

    }

    return WapSiteUrl;

}


/* 卖家版APP调用函数 */

function appDisplayElement(_type, _name, _value) {

    var num = 0;

    if (_type == 'id') {

        //document.getElementById(_name).style.display = value;

        $("#" + _name).css("display", _value);

        var setIntApp = window.setInterval(function() {

            num++;

            $("#" + _name).css("display", _value);

            if (num > 100) {

                window.clearInterval(setIntApp);

            }

        }, 100);

    } else {

        //document.getElementsByClassName(_name).style.display = _value;

        $("." + _name).css("display", _value);

        var setIntApp = window.setInterval(function() {

            num++;

            $("." + _name).css("display", _value);

            if (num > 100) {

                window.clearInterval(setIntApp);

            }

        }, 100);

    }

}

//模版圖片選擇
function ImgFormat(){
    template.helper('FormatImg',function(r){
        if(r.indexOf("!")>=0){
            return r;
        }else{
            return r+"!thumb";
        }
    });
}

//模版时间
function talentTime(date,mode){
    date = new Date(date*1000);
    var map = {
        "M": date.getMonth() + 1, //月份
        "d": date.getDate(), //日
    };

    format = mode.replace(/([yMd])+/g, function(all, t){
        var v = map[t];
        if (v !== undefined) {
            if (all.length > 1) {
                v = '0' + v;
                v = v.substr(v.length - 2);
            }
            return v;
        }
        else if (t === 'y') {
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return format;
}
//模版时间
function dateTime(){
    template.helper('DateTime',function(data){
    date = new Date(date*1000);
    var map = {
        "M": date.getMonth() + 1, //月份
        "d": date.getDate(), //日
        "h": date.getHours(), //小时
        "m": date.getMinutes(), //分
        "s": date.getSeconds(), //秒
        "q": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };

    formatTime = "<span class='f30'>MM</span>·yyyy".replace(/([yMdhmq])+/g, function(all, t){
        var v = map[t];
        if (v !== undefined) {
            if (all.length > 1) {
                v = '0' + v;
                v = v.substr(v.length - 2);
            }
            return v;
        }
        else if (t === 'y') {
            return (date.getFullYear() + '').substr(4 - all.length);
        }
        return all;
    });
    return formatTime;
    });
}


//国家属性截取
function nationSplit(){
    template.helper("formatNation",function(name){
        var newName = name.split(" ")[0];
        return newName;
    });
}

//decodeURIComponent

function decodeUrl(){
    template.helper("decodeUrl",function(name){
        return decodeURIComponent(name);
    });
}

//页面加载 如果存在导航栏就添加点击事件
var headerDom = '<ul class="nav-bar animated fadeInDown" id="nav-bar">'
    +'<li><a class="nav-header-tab" link="../index/index.html"><img src="../../images/wap/shouye.png">首页</a></li>'
    +'<li><a class="nav-header-tab" link="../index/classifying.html"><img src="../../images/wap/fenleihead.png">分类</a></li> '
    +'<li><a class="nav-header-tab" link="../activity/discover.html"><img src="../../images/wap/faxian.png">发现</a></li> '
    +'<li><a class="nav-header-tab shoppingurl" link="../shopping/shopping_cart_cn.html"><img src="../../images/index/shopcart.png">购物袋</a></li>'
    +'<li><a class="nav-header-tab" link="../member/person.html"><img src="../../images/wap/wode.png">我的</a></li>'
    +'</ul>';
if($("#nav-show")){

    $("#nav-show").click(function(){
        if($("#nav-bar").length==0){
            $("header").after(headerDom);
            FL.getGoodsNum({success:loadSuccess});

            function loadSuccess(data){
                if(data&&data.error==0){
                    if(data.result.is_global=='1'){
                        $('.shoppingurl').attr('link','../shopping/shopping_cart_global.html');
                    }else{
                        $('.shoppingurl').attr('link','../shopping/shopping_cart_cn.html');
                    }
                }
            }
            bindClick();
        }else{
            $("#nav-bar").attr("class","nav-bar animated fadeOutUp");
            setTimeout(function(){
                $("#nav-bar").remove();
            },300);
        }
    });

    function bindClick(){
        $(".nav-header-tab").click(function(){
            var me = this;
            var href = $(me).attr("link");
            location.href = href;
            $("#nav-bar").remove();
        })
    }
}
if($(".allBtmFooter")){
    $(".allBtmFooter li").click(function(){
        var me = this;
        var href = $(me).find('a').attr("data-href");
        location.href = href;
    });
}
//通用兼容zepto滚动
function scroll(scrollTo, time) {
    var scrollFrom = parseInt(document.body.scrollTop),
        i = 0,
        runEvery = 5; // run every 5ms

    scrollTo = parseInt(scrollTo);
    time /= runEvery;

    var interval = setInterval(function () {
        i++;

        document.body.scrollTop = (scrollTo - scrollFrom) / time * i + scrollFrom;

        if (i >= time) {
            clearInterval(interval);
        }
    }, runEvery);
}
//获取分享来源人id--商品追踪
var deductid = GetQueryString("deductid");
if(deductid){
    addcookie("deductid",deductid);
    setDeductid(deductid);
}else{
    deductid = getcookie("deductid");
    if(deductid){
        setDeductid(deductid);
    }
}

function setDeductid(deductid){
    $.ajax({
        type: "get",
        url: WapSiteUrl + "/shop/index.php?act=deduct&op=setdeduct",
        data: {deductid:deductid},
        success: function(data) {

        }
    });
}

/*

 * JAVASCRIPT 常用JS方法库

 *

 */

(function() {

    //注册命名空间gyb到window对象上

    window['FL'] = {};

    FL.mid = getcookie("mid")||"";
    FL.token = getcookie("token")||"";
    FL.store_id = getcookie("store_id")||"";
    FL.shop_id = getcookie("shop_id")||"";
    
    //判断是否微信浏览器

    function isWeiXin() {

        var ua = window.navigator.userAgent.toLowerCase();

        if (ua.match(/MicroMessenger/i) == 'micromessenger') {

            return true;

        } else {

            return false;

        }

    }

    ;







    //获取滚动条当前的位置

    function getScrollTop() {

        var scrollTop = 0;

        if (document.documentElement && document.documentElement.scrollTop) {

            scrollTop = document.documentElement.scrollTop;

        } else if (document.body) {

            scrollTop = document.body.scrollTop;

        }

        return scrollTop;

    }

    ;



    //获取当前可视范围的高度

    function getClientHeight() {

        var clientHeight = 0;

        if (document.body.clientHeight && document.documentElement.clientHeight) {

            clientHeight = Math.min(document.body.clientHeight, document.documentElement.clientHeight);

        } else {

            clientHeight = Math.max(document.body.clientHeight, document.documentElement.clientHeight);

        }

        return clientHeight;

    }

    ;



    //获取文档完整的高度

    function getScrollHeight() {

        return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

    }

    ;



    //滚动到底部加载数据

    function scrollEndLoad(callback) {

        $(window).on('scroll', function() {

            if (getScrollTop() + getClientHeight() == getScrollHeight()) {

                callback();

            }

        });

    }

    ;



    //回到顶部

    function toTop(n) {

        $(window).on('scroll', function() {

            //alert(getScrollTop()+"!"+getScrollHeight());

            if ($("#totop").size() > 0) {

                if (getScrollTop() < $(window).height() * n) {

                    $("#totop").remove();

                }

            } else {

                if (getScrollTop() >= $(window).height() * n) {

                    $("body").after("<div id='totop'></div>");

                    $("#totop").on('click', function() {

                        scroll(0,200);

                    });

                }

            }

        });

    }

    ;



    //字符串截取，超出则加“...”

    function subStrLen(str, len) {

        if (str.length > len) {

            str = str.substring(0, len) + "...";

        }

        return str;

    }

    ;



    /*判断对象(json)是否为空*/

    function isEmptyObject(obj) {

        var name;

        for (name in obj) {

            return false;

        }

        return true;

    }

    ;



    /*

     * 占位符格式化

     * 第一个参数为需要格式化的字符串："aa{0}bb{1}" *必填

     * 后面的参数为对应替换的字符串

     * DEMO:  formatStr("aa{0}bb{1}","F","L");//得到的结果为：aaFbbL

     * @returns

     */

    function formatStr() {

        var ary = [];

        for (i = 1; i < arguments.length; i++) {

            ary.push(arguments[i]);

        }

        return arguments[0].replace(/\{(\d+)\}/g, function(m, i) {

            return ary[i];

        });

    }

    ;

    //提示信息

    function validMsg() {

        return {

            need: "{0}不能为空！",

            telephone: "{0}格式不正确！",

            min: "请输入{0}个字符以上",

            max: "请输入{0}个字符以内",

            sameto: "两次输入不同"

        };

    }

    ;

    /*

     * 传入表单项，根据属性进行验证

     * @param {zepto对象} $item

     * need:必填

     * @returns {undefined}

     */

    function validItem($item) {

        var msg = validMsg();

        var currMsg = "";

        var itemval = $.trim($item.val());

        //判断是否必填

        if ($item[0].hasAttribute("need")) { //是必填

            if (itemval == "") {

                currMsg = formatStr(msg["need"], $item.attr("tip"));

                return currMsg;

            }

        }

        //最小长度

        if ($item[0].hasAttribute("min")) {

            if (itemval.length < parseInt($item.attr("min")) && itemval != "") {

                currMsg = formatStr(msg["min"], $item.attr("min"));

                return currMsg;

            }

        }

        //最大长度

        if ($item[0].hasAttribute("max")) {

            if (itemval.length > parseInt($item.attr("max")) && itemval != "") {

                currMsg = formatStr(msg["max"], $item.attr("max"));

                return currMsg;

            }

        }

        //比较两次输入

        if ($item[0].hasAttribute("sameto")) {

            if (itemval != $("#" + $item.attr("sameto")).val()) {

                currMsg = $item.attr("tip");

                return currMsg;

            }

        }

        //判断是否是手机号

        if ($item[0].hasAttribute("telephone")) {

            if (!(/^1[1-9][0-9]\d{8}$/.test(itemval)) && itemval != "") {

                currMsg = formatStr(msg["telephone"], $item.attr("tip"));

                return currMsg;

            }

        }

        return currMsg;

    }



    //表单项验证

    //vlist:所有需要验证的表单元素（id集合，例：{"aa","bb"}）

    function valid(vlist, extFun) {

        var errorMsg = {};

        for (var item in vlist) {

            var temp = validItem($("#" + vlist[item]));

            if (temp != "") {

                errorMsg[vlist[item]] = temp;

            }

        }

        extFun(errorMsg);

    }

    //获取验证码倒计时60s
    function countDown(time, self) {
        self.attr("disabled", true);

        if (time == 0) {
            self.removeAttr("disabled");
            self.text("获取验证码");

            //clearTimeout(num);
            return false;
        } else {
            self.text(time+"s");
            time--;
        }
        setTimeout(function() {
            countDown(time, self);
        }, 1000);
    }
    /**
     * 地区联动
     * */
    function getProvinceBuy(dom) {
        var proStr = selectArea();
        $("body .dqld_div").remove();
        var height = $(window).height();
        var newStr = new Array();
        newStr.push("<div class=\"dqld_div animated slideInRight\"><ul class='dqld_ul'>");
        for (var i = 0; i < proStr.length; i++) {
            var id = proStr[i].area_id;
            var provinceName = proStr[i].area_name;
            newStr.push("<li onclick=\"FL.getCityBuy(" + id + ",'" + dom + "','" + provinceName + "')\">" + provinceName + "</li>");
        }
        newStr.push("</ul></div>");
        $("body").append(newStr.join(""));
        $(".dqld_div").css("height", height + "px");
        $("body").css("overflow", "hidden");
        addShade();
        closeDiv(".dqld_div", "remove");
    }

    function getCityBuy(val, dom, name) {
        var proStr = selectArea(val);
        var newStr = new Array();
        newStr.push("<div class=\"dqld_div \"><ul>");
        newStr.push("<li onclick=\"getProvinceBuy()\" class='bck-one'>" + name + "</li>");
        for (var j = 0; j < proStr.length; j++) {
            var id = proStr[j].area_id;
            var cityName = proStr[j].area_name;
            newStr.push("<li onclick=\"FL.getAreaBuy(" + val + "," + id + ",'" + dom + "','" + name + "','" + cityName + "')\"  class='pl20'>" + cityName + "</li>");
        }
        newStr.push("</ul></div>");
        $("body .dqld_div").remove();
        $("body").append(newStr.join(""));
        var height = $(window).height();
        $(".dqld_div").css("height", height + "px");
    }

    function getAreaBuy(val, val1, dom, name1, name2) {
        var proStr = selectArea(val1);
        var newStr = new Array();
        newStr.push("<div class=\"dqld_div\"><ul>");
        newStr.push("<li onclick=\"FL.getProvinceBuy()\" class='bck-one'>" + name1 + "</li>");
        newStr.push("<li onclick=\"FL.getCityBuy(" + val1 + ")\" class='pl20 bck-two'>" + name2 + "</li>");
        for (var t = 0; t < proStr.length; t++) {
            var id = proStr[t].area_id;
            var areaName = proStr[t].area_name;
            newStr.push("<li  class='pl30' onclick=\"FL.getallArea(" + val + "," + val1 + "," + id + ",'" + dom + "','" + name1 + "','" + name2 + "','" + areaName + "')\">" + areaName + "</li>");
        }
        newStr.push("</ul></div>");
        if (proStr.length == 0) {
            var allarea = name1 + '>' + name2;
            $(dom).attr({
                "SS": val,
                "city_id": val1,
                "area_id": ""
            });
            $(dom).val(allarea);
            $("body .dqld_div").remove();
            removeShade();
        } else {
            $("body .dqld_div").remove();
            $("body").append(newStr.join(""));
        }
        var height = $(window).height();
        $(".dqld_div").css("height", height + "px");
    }

    function getallArea(val, val1, val2, dom, name1, name2, name3) {
        var allarea = name1 + '>' + name2 + '>' + name3;
        $(dom).attr({
            "SS": val,
            "city_id": val1,
            "area_id": val2
        });
        $(dom).val(allarea);
        $("body .dqld_div").remove();
        $("body").css("overflow", "auto");
        removeShade();
    }
    //fastClick

    /*添加页面遮罩*/
    function addShade() {
        var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
        $("body").append('<div class="loading-shade"></div>');
        $(".loading-shade").css("height",htmlHeight+"px");
    }
    function addWhiteShade() {
        var htmlHeight = document.body.clientHeight;
        $("body").append('<div class="loading-white-shade"></div>');
        $(".loading-white-shade").css("height",htmlHeight+"px");
    }
    /*删除页面遮罩*/
    function removeShade() {
        $(".loading-shade").remove();

    }
    function removeWhiteShade() {
        $(".loading-white-shade").remove();

    }
    /*页面遮罩点击关闭弹出层
     * dom=>#id
     * type => hide || remove
     * */
    function closeDiv(dom, type) {
        $(".loading-shade").click(function() {
            type == "hide" ? $(dom).hide() : $(dom).remove();
            $(".loading-shade").remove();
        })

    }
    /*地区查询*/
    function selectArea(id) {
        var result;
        if (id) {
            var newData = {
                pid: id,
                flag: "wap"
            };
        } else {
            var newData = {
                flag: "wap"
            };
        }
        $.ajax({
            type: "get",
            async: false,
            url: WapSiteUrl + '/api/index.php?act=common_index&op=get_area_list',
            data: newData,
            dataType: "json",
            success: function(data) {
                result = data.result;
            }
        });
        return result;
    }
    //未登录用户获取验证码
    function getCode(number,hashSecode,captchaNum) {
        $.ajax({

            type: 'get',

            url: WapSiteUrl + "/api/index.php?act=common_index&op=get_phone_code",

            data: {number: number,flag: "wap",nchash:hashSecode,captcha:captchaNum},
            //	        data: {number: number,flag: "wap"},

            dataType: 'json',

            success: function(result) {
                if (result.error === "0") {
                    layer.msg('短信验证码已经成功发送');
                }else{
                    layer.msg(result.msg);
                }
            },
            error: function(xhr) {

            }

        });
    }
    //已登录用户获取验证码
    function getOnlineCode(number,mid,token){
        $.ajax({

            type: 'get',

            url: WapSiteUrl + "/api/index.php?act=common_index&op=get_phone_code",

            data: {number: number,flag: "wap",mid:mid,token:token},

            dataType: 'json',

            success: function(result) {
                if (result.error === "0") {

                }
            },
            error: function(xhr) {

            }

        });
    }

    //获取商品分类
    function goodsClass(pid,area,load){
        var data ;
        if(pid!==""){
            data = {pid :pid,area:area,flag:"wap"};
        }else{
            data ={area:area,flag:"wap"};
        }
        $.ajax({
            type:'get',
            url:WapSiteUrl+'/api/index.php?act=common_goods&op=get_goods_class',
            data:data,
            dataType:'json',
            success:function(data){
                load.success(data);
            },
            error:function(xhr){

            },
            complete:function(xhr){

            }
        })
    }
    //删除收货地址
    function deleteAddress(id){
        $.ajax({
            type:'post',
            url:WapSiteUrl+'/api/index.php?act=buyer_delivery&op=del_address',
            data:{mid:FL.mid,token:FL.token,flag:"wap",address_id:id},
            dataType:'json',
            success:function(data){
                if(data&&data.error==="0"){
                    layer.msg("地址已删除");
                }
            },
            error:function(xhr){

            },
            complete:function(xhr){

            }
        });
    }
    //添加收藏方法
    function addFavorite(id,type){
        $.ajax({
            type:'post',
            url:WapSiteUrl+'/api/index.php?act=buyer_favorite&op=add_favorites',
            data:{mid:FL.mid,token:FL.token,flag:"wap",fid:id,type:type},
            dataType:'json',
            success:function(data){
                if(data&&data.error==="0"){
                    layer.msg("收藏成功");
                }
            },
            error:function(xhr){

            },
            complete:function(xhr){

            }
        });
    }
    //删除收藏
    function deleteFavorite(id,type){
        $.ajax({
            type:'post',
            url:WapSiteUrl+'/api/index.php?act=buyer_favorite&op=delete_favorites',
            data:{mid:FL.mid,token:FL.token,flag:"wap",fid:id,type:type},
            dataType:'json',
            success:function(data){
                if(data&&data.error==="0"){
                    layer.msg("收藏已删除");
                }
            },
            error:function(xhr){

            },
            complete:function(xhr){

            }
        });
    }
    //添加浏览历史
    function addLibrary(id){
        $.ajax({
            type:'post',
            url:WapSiteUrl+'/api/index.php?act=buyer_browse&op=add_browse',
            data:{mid:FL.mid,token:FL.token,flag:"wap",id:id},
            dataType:'json',
            success:function(data){
                if(data&&data.error==="0"){
                }
            },
            error:function(xhr){

            },
            complete:function(xhr){

            }
        });
    }
    //判断用户是否登录,未登录跳到登录页
    function  judgeLogin(){

        FL.fhload();
        var token = getcookie("token");
        if(!token){

            FL.logLogin();

        }
        $(".fh-loading").remove();

    }
    function getCityByBaiduCoordinate(rs) {
        var province = rs.addressComponents.province.slice(0,rs.addressComponents.province.length-1);
        var city = rs.addressComponents.city.slice(0,rs.addressComponents.city.length-1);
        addcookie("province",province);
        addcookie("city",city);
        addcookie("road",rs.addressComponents.district+rs.addressComponents.street+rs.addressComponents.streetNumber||"");
        $("#gps1").html(province+" · "+city);
        $("#gps2").html(rs.addressComponents.district+rs.addressComponents.street+rs.addressComponents.streetNumber||"");
    }
    function getGps(){
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r){
            if(this.getStatus() == BMAP_STATUS_SUCCESS){
                var x =r.point.lng;
                var y =r.point.lat;
                var ggPoint = new BMap.Point(x,y);
                var geoc = new BMap.Geocoder();
                geoc.getLocation(ggPoint, getCityByBaiduCoordinate);
            }
            else {
            }
        },{enableHighAccuracy: true})
    }

    //获取购物车数量
    function getCartGoodsNum(mid,token,load){
        $.ajax({
            type:'get',
            url:WapSiteUrl+'/api/index.php?act=buyer_cart&op=list',
            data:{mid:mid,token:token,flag:"wap",type:"db",area:2},
            dataType:'json',
            success:function(data){
                load.success(data);
            },
            error:function(xhr){

            },
            complete:function(xhr){

            }
        })
    }
    //搜索框点击跳转到搜索页
    function  goSearch(e){
        $(e).click(function(){
            location.href='../index/search.html';
        });
    }

    //获取个人购物车数量
    function  getGoodsNum(load){
        $.ajax({
            type:"post",
            url:WapSiteUrl+'/api/index.php?act=buyer_cart&op=goods_count',
            data:{mid:FL.mid,token:FL.token,flag:"wap"},
            dataType:"json",
            success:function(data){
                load.success(data);
            },
            error:function(xhr){

            },
            complete:function(xhr){

            }
        });
    }
    //添加验证码
    function getHash(id){
        $.ajax({
            type:"get",
            url:WapSiteUrl+"/api/index.php?act=common_index&op=get_secode_hash",
            data:{"flag":"wap"},
            global:false,
            dataType:"json",
            success:function(data){
                if(data&&data.error==0){
                    hashSecode = data.result||"17becb3b";
                    $("#"+id).attr("src",WapSiteUrl+"/api/index.php?act=common_index&op=make_secode&flag=wap&nchash="+data.result);
                }
            },
            error:function(xhr){
            }
        })
    }
    //验证码
    function get_captcha(mobile,id){
        $.ajax({
            type:"get",
            url:WapSiteUrl+"/api/index.php?act=common_index&op=get_captcha",
            data:{"flag":"wap",mobile:mobile},
            global:false,
            dataType:"json",
            success:function(data){

                $("#"+id).attr("src",WapSiteUrl+"/api/index.php?act=common_index&op=get_captcha&flag=wap&mobile="+mobile);

            },
            error:function(xhr){
            }
        })
    }
    //校验验证码(captcha:校验码,phoneNum:手机号,codeId:获取手机验证码按钮id)
    function checkSecode(captcha,phoneNum,codeId,time){

        $.ajax({
            type:"get",
            url:WapSiteUrl+"/api/index.php?act=common_index&op=check_captcha",
            data:{"flag":"wap","captcha":captcha,"mobile":phoneNum},
            global:false,
            dataType:"json",
            success:function(data){
                if(data&&data.error==0){
                    if(/^1[3|4|5|7|8|9][0-9]\d{4,8}$/.test(phoneNum)&&/^1\d{10}$/.test(phoneNum)){
                        $("#"+codeId).removeAttr("disabled");

                        FL.countDown(time,$("#"+codeId));//获取验证码倒计时



                    }
                }else{
                    $("#"+codeId).attr("disabled","disabled");

                    layer.msg("请输入正确的图形验证码");


                }
            },
            error:function(xhr){
            }
        })


    }

    //快递100物流状态返回
    function getLogistics(state){
        if(state==0){
            return "货物处于运输过程中";
        }else if(state==1){
            return "货物已由快递公司揽收并且产生了第一条跟踪信息";
        }else if(state==2){
            return "货物寄送过程出了问题";
        }else if(state==3){
            return "收件人已签收";
        }else if(state==4){
            return "货物由于用户拒签、超区等原因退回，而且发件人已经签收";
        }else if(state==5){
            return "快递正在进行同城派件";
        }else if(state==6){
            return "货物正处于退回发件人的途中";
        }
    }

    //微信分享自定义事件
    function wxShare(wx_title,wx_desc,wx_link,wx_img,friend_title,shop_id,shop_type,share_id,type){
        var url = location.href.split('#')[0];//+"&resource_tags="+resourcetags;
        try{
            $.ajax({
                url: WapSiteUrl+"/shop/index.php?act=wxtoken",
                type: 'get',
                data:{url:url},
                dataType: 'json',
                //  async:false,
                success: function(result) {
                    var appId = result.appId;
                    var timestamp = result.timestamp;
                    var nonceStr = result.nonceStr;
                    var signature = result.signature;
                    var returl_url = result.url;

                    var timeStr = new Date().getTime();
                    if(wx_link.indexOf("packet")>0){  //分享链接是来自红包 新人红包时不添加后缀

                    }else if(wx_link.indexOf("?")>0){
                        if(FL.mid){
                            wx_link = wx_link+"&flag=wap&deductid="+FL.mid+"&vid="+FL.mid+"@"+timeStr;
                        }else if(wx_link.indexOf("deductid")>0){

                        }
                    }else{
                        if(FL.mid){
                            wx_link = wx_link+"?flag=wap&deductid="+FL.mid+"&vid="+FL.mid+"@"+timeStr;
                        }else if(wx_link.indexOf("deductid")>0){

                        }
                    }
                    wx.config({
                        //debug: true,
                        appId: appId,
                        timestamp: timestamp,
                        nonceStr: nonceStr,
                        signature: signature,
                        jsApiList: [
                            'onMenuShareTimeline',//分享到朋友圈
                            'onMenuShareAppMessage',//分享给朋友
                            'onMenuShareQQ',//分享到QQ
                            'onMenuShareQZone'//qzone
                        ]
                    });
                    //微信分享
                    wx.ready(function() {
                        //朋友
                        wx.onMenuShareAppMessage({
                            title: wx_title,
                            desc: wx_desc||wx_title,
                            link: wx_link,
                            imgUrl: wx_img||'http://www.fenhongshop.com/wap/images/wap/logo.png',
                            success: function () {
                                shoper_commission_share(wx_title,wx_desc,wx_img,wx_link,_reason,"5",shop_id,shop_type,share_id,type);
                            }
                        });
                        //朋友圈
                        wx.onMenuShareTimeline({
                            title: friend_title||wx_title,
                            link: wx_link,
                            imgUrl: wx_img||'http://www.fenhongshop.com/wap/images/wap/logo.png',
                            success: function () {
                                shoper_commission_share(wx_title,wx_desc,wx_img,wx_link,_reason,"4",shop_id,shop_type,share_id,type);						    }
                        });
                        //QQ
                        wx.onMenuShareQQ({
                            title: wx_title, // 分享标题
                            desc: wx_desc||wx_title, // 分享描述
                            link: wx_link, // 分享链接
                            imgUrl: wx_img||'http://www.fenhongshop.com/wap/images/wap/logo.png' ,
                            success: function () {
                                shoper_commission_share(wx_title,wx_desc,wx_img,wx_link,_reason,"2",shop_id,shop_type,share_id,type);
                            }
                        });
                        //qzone
                        wx.onMenuShareQZone({
                            title: wx_title, // 分享标题
                            desc: wx_desc||wx_title, // 分享描述
                            link: wx_link, // 分享链接
                            imgUrl: wx_img||'http://www.fenhongshop.com/wap/images/wap/logo.png' ,
                            success: function () {
                                shoper_commission_share(wx_title,wx_desc,wx_img,wx_link,_reason,"6",shop_id,shop_type,share_id,type);
                            }
                        });
                    });
                }
            });
        }catch(e){
        }
    }
    //分享
    function share(_title,_desc,_pic,_url,_reason,shop_id,shop_type,share_id,type){

        FL.wxShare(_title,_desc,_pic,_url,_reason,shop_id,shop_type,share_id,type);

        var timeStr = new Date().getTime();
        if(_url.indexOf("packet")>0){  //分享链接是来自红包 新人红包时不添加后缀

        }else if(_url.indexOf("?")>0){
            if(FL.mid){
                _url = _url+"&flag=wap&deductid="+FL.mid+"&vid="+FL.mid+"@"+timeStr;
            }else if(_url.indexOf("deductid")>0){

            }
        }else{
            if(FL.mid){
                _url = _url+"?flag=wap&deductid="+FL.mid+"&vid="+FL.mid+"@"+timeStr;
            }else if(_url.indexOf("deductid")>0){

            }
        }
        mobShare.config( {

            appkey: '13a3931a47072', // appkey

            params: {
                title: _title, // 分享标题
                description: _desc, // 分享内容
                pic: _pic, // 分享图片，使用逗号,隔开
                url: _url, // 分享链接
                reason:_reason//只应用与QZone与朋友网
            },
            callback: function( plat, params ) {
                if(plat=='qq'){
                    sharetype=2;
                }else if(plat=='weixin'){
                    sharetype=5;
                }else if(plat=='qzone'){
                    sharetype=6;
                }else if(plat=='weibo'){
                    sharetype=3;
                }else{
                    sharetype=9;
                }
                shoper_commission_share(_title,_desc,_pic,_url,_reason,sharetype,shop_id,shop_type,share_id,type);
            }


        } );

    }
    function shoper_commission_share(_title,_desc,_pic,_url,_reason,sharetype,shop_id,shop_type,share_id,type){
        _url=_url+"&sharetype="+sharetype;
        if(!share_id){
            $.ajax({
                url: WapSiteUrl+"/api/index.php?act=shoper_commission&op=share",
                type: 'post',
                data:{flag:"wap",token:FL.token,mid:FL.mid,content:_desc,title:_title,img:_pic,rurl:_url,shop_id:shop_id,shop_type:shop_type},
                async:false,
                dataType: 'json',
                success: function(data) {
                    if(data&&data.error){

                    }
                }
            });
        }else{
            time_share(share_id,type);
        }


    }
    function time_share(share_id,type){

            $.ajax({
                url: WapSiteUrl+"/talent/api.php?act=share&op=share",
                type: 'post',
                data:{flag:"wap",token:FL.token,mid:FL.mid,share_id:share_id,type:type},
                async:false,
                dataType: 'json',
                success: function(data) {
                    if(data&&data.error){

                    }
                }
            });
    }
    //格式化时间方法
    function dateFormat(date){

        date = new Date(date*1000);
        var map = {
            "M": date.getMonth() + 1, //月份
            "d": date.getDate(), //日
            "h": date.getHours(), //小时
            "m": date.getMinutes(), //分
            "s": date.getSeconds(), //秒
            "q": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };

        format = "yyyy-MM-dd".replace(/([yMdhmsqS])+/g, function(all, t){
            var v = map[t];
            if (v !== undefined) {
                if (all.length > 1) {
                    v = '0' + v;
                    v = v.substr(v.length - 2);
                }
                return v;
            }
            else if (t === 'y') {
                return (date.getFullYear() + '').substr(4 - all.length);
            }
            return all;
        });
        return format;
    }

    //控制红包开关
    function functional_control(){
        var type ;
        $.ajax({
            url: WapSiteUrl+"/api/index.php?act=common_index&op=function_switch",
            type: 'get',
            data:{flag:"wap"},
            async:false,
            dataType: 'json',
            success: function(data) {
                if(data&&data.error){
                    type = data.result[0];
                }
            }
        });
        return type;
    }


    //获取接口数据
    function ajaxDate(type,url,data,success,error){
        data.flag ='wap';
        data.deviceid ="wap";
        data.market = "wap";
        data.vercode=310;
        data.vername='3.1.0';
        $.ajax({
            url: url,
            type: type,
            data:data,
            dataType: 'json',
            success: success,
            error:error
        });
    }

    //login
    function logLogin(signage){
        if(!isWeiXin()||signage){
            $('#checklogin').remove();

            var logindom = '<div class="layout animated fadeInUp" id="checklogin">'+
                '        <div class="tc percent">'+
                '           <img src="../../src/images/wap/login/logo.png" class="logo"/>'+
                '           <div class="pl20 pr20 pr">'+
                '           	     <input type="text" name="" id="textarea" value="" placeholder="请输入手机号/用户名" />'+
                '           	     <img src="../../src/images/wap/login/cleartext.png" class="cleartext"/>'+
                '           </div>          '+
                '           <div class="pl20 pr20">'+
                '           <button id="loginClick" disabled="disabled">登录/注册</button>'+
                '           </div>'+
                '           <img src="../../src/images/wap/login/close.png" class="close"/>'+
                '        </div>'+
                '    </div>'+
                '    <div class="fh-dialog">'+
                '        <div class="fh-dialog-wrap">'+
                '            <div class="tc">'+
                '                <img src="../../images/wap/login/fh-dialog-img.png" alt="" class="fh-dialog-img"/></div>'+
                '            <div class="fh-dialog-body">'+
                '                <p class="fh-dialog-brief">该帐号未注册</p>'+
                '            </div>'+
                '            <div class="fh-dialog-footer">'+
                '                <button class="fh-dialog-button focus-font" id="leftbtn">确认</button>'+
                '            </div>'+
                '        </div>'+
                '    </div>';
            $('body').append(logindom);
            $.getScript("../../js/apiLink.js");
            $.getScript("../../src/js/tmpl/login/checklogin.js");
        }else{
            localStorage.setItem('thirdBack',window.location.href);
            location.href = wxLogin;
        }
    }
    function getSmsCode(mobile,time,codeId,captcha){
        $.ajax({
            type:"get",
            url:WapSiteUrl+"/api/index.php?act=common_member&op=get_sms_code",
            data:{"flag":"wap","captcha":captcha,"mobile":mobile},
            dataType:"json",
            success:function(data){
                if(data&&data.error==0){
                    FL.countDown(time, $('#'+codeId));
                    $('#'+codeId).attr('countdown',data.result.countdown);
                    if(data.result.if_captcha==1){
                        $('#'+codeId).addClass("nogetcode");
                    }

                }else{
                    if(data.result.if_captcha==1){
                        $('#'+codeId).addClass("nogetcode");
                    }
                    layer.msg(data.msg);


                }
            },
            error:function(xhr){
            }
        })
    }
    //load
    function fhload(){

        var loaddom = '<p class="fh-loading">'+
            '			<img src="../../images/index/load.png" alt="" class="f-load"/>'+
            '			<img src="../../images/index/loading.png" alt="" class="f-loadimg"/>'+
            '</p>';

        $('body').append(loaddom);

    }
    //把函数注册到命名空间中

    window['FL']['isWeiXin'] = isWeiXin; //判断是否微信浏览器

    window['FL']['getScrollTop'] = getScrollTop; //获取滚动条当前位置

    window['FL']['getClientHeight'] = getClientHeight; //获取当前可视范围的高度

    window['FL']['scrollEndLoad'] = scrollEndLoad; //获取当前可视范围的高度

    window['FL']['buildUrl'] = buildUrl; //获取当前可视范围的高度

    window['FL']['formatStr'] = formatStr; //字符串格式化（占位符替换）

    window['FL']['valid'] = valid; //表单验证（占位符替换）

    window['FL']['toTop'] = toTop; //回到顶部

    window['FL']['subStrLen'] = subStrLen; //字符串截取，如超出长度以“...”替换

    window['FL']['isEmptyObject'] = isEmptyObject; //判断对象(json)是否为空

    window['FL']['countDown'] = countDown; //获取验证码倒计时

    window['FL']['getProvinceBuy'] = getProvinceBuy; //获地区联动

    window['FL']['getCityBuy'] = getCityBuy;

    window['FL']['getAreaBuy'] = getAreaBuy;

    window['FL']['getallArea'] = getallArea;

    window['FL']['addShade'] = addShade; //添加遮罩

    window['FL']['addWhiteShade'] = addWhiteShade; //添加白色遮罩

    window['FL']['removeShade'] = removeShade; //删除遮罩

    window['FL']['removeWhiteShade'] = removeWhiteShade; //删除白色遮罩

    window['FL']['closeDiv'] = closeDiv; //关闭弹出层.

    window['FL']['getCode'] = getCode; //获取验证码

    window['FL']['getOnlineCode'] = getOnlineCode; //已登录获取验证码

    window['FL']['goodsClass'] = goodsClass; //获取商品分类

    window['FL']['deleteAddress'] = deleteAddress; //删除收货地址

    window['FL']['addFavorite'] = addFavorite; //添加收藏

    window['FL']['deleteFavorite'] = deleteFavorite; //删除收藏

    window['FL']['addLibrary'] = addLibrary; //添加浏览历史

    window['FL']['judgeLogin'] = judgeLogin; //判断用户是否登录

    window['FL']['getGps'] = getGps; //获取地理位置信息

    window['FL']['getCartGoodsNum'] = getCartGoodsNum; //获取购物车数量

    window['FL']['goSearch'] = goSearch; //跳转搜索页面

    window['FL']['getGoodsNum'] = getGoodsNum;//获取购物车数量(页面显示个数用)

    window['FL']['getHash'] = getHash;//获取图形验证码

    window['FL']['checkSecode'] = checkSecode;//校验图形验证码

    ///	window['FL']['Aclick'] = Aclick;//A链接添加浏览器判断

    window['FL']['getLogistics'] = getLogistics;//快递100物流状态返回

    window['FL']['wxShare'] = wxShare;//微信分享

    window['FL']['share'] = share;//分享

    window['FL']['dateFormat'] = dateFormat;//格式化时间

    window['FL']['functional_control'] = functional_control;//功能控制开关

    window['FL']['get_captcha'] = get_captcha;//3.1验证码

    window['FL']['ajaxDate'] = ajaxDate;//获取接口数据

    window['FL']['logLogin'] = logLogin;//登录

    window['FL']['getSmsCode'] = getSmsCode;//获取手机验证码（v3.1.0）

    window['FL']['fhload'] = fhload;//load
})();

$(function(){
    FL.toTop(2);
})