/*
 * JAVASCRIPT 常用JS方法库
 * 
 */
(function() {
    //注册命名空间gyb到window对象上  
    window['FL'] = {};

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

    //显示蒙版
    function showMask($maskIn) {
        var $mask = $("<div class='mask'></div>");
        $mask.append($maskIn);
        $mask.live("tap", function() {
            $mask.remove();
        });
        $("body").append($mask);
    }
    ;

    //点击分享生成转发代码。
    function makeShareLink(type, url, tit, pic) {
        switch (type) {
            case "qqkj":
                window.open('http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?summary=%20&title=' + tit + '&pics=' + encodeURIComponent(pic) + '&url=' + encodeURIComponent(url), '_blank');
                break;
            case "qqwb":
                window.open('http://share.v.t.qq.com/index.php?c=share&a=index&title=' + encodeURIComponent(tit) + '&url=' + encodeURIComponent(url) + '&pic=' + encodeURIComponent(pic), '_blank');
                break;
            case "sinawb":
                window.open('http://v.t.sina.com.cn/share/share.php?title=' + tit + '&pic=' + encodeURIComponent(pic) + '&url=' + encodeURIComponent(url), '_blank');
                break;
            default:
                //
        }
    }
    ;

    //获取滚动条当前的位置 
    function getScrollTop() {
        var scrollTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
            scrollTop = document.documentElement.scrollTop;
        }
        else if (document.body) {
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
        }
        else {
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
    function toTop(n){
        $(window).on('scroll', function() {
            //alert(getScrollTop()+"!"+getScrollHeight());
            if($("#totop").size()>0){
                if (getScrollTop()  < $(window).height() * n) {
                    $("#totop").remove();
                }
            }else{
                if (getScrollTop()  >= $(window).height() * n) {
                    $("body").after("<div id='totop'></div>");
                }
            }
        });
        $(window).on('click', function() {
            $(window).scrollTop(0);
        });
    }
    ;
    
    //字符串截取，超出则加“...”
    function subStrLen(str,len){
        if(str.length > len){
            str = str.substring(0,len) + "...";
        }
        return str;
    }

    //生成连接
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
            min:"请输入{0}个字符以上",
            max:"请输入{0}个字符以内",
            sameto:"两次输入不同"
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
        if ($item[0].hasAttribute("need")) {//是必填
            if (itemval == "") {
                currMsg = formatStr(msg["need"], $item.attr("tip"));
                return currMsg;
            }
        }
        //最小长度
        if ($item[0].hasAttribute("min")) {
            if (itemval.length < parseInt($item.attr("min")) && itemval != "") {
                currMsg = formatStr(msg["min"],$item.attr("min"));
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
            if (itemval != $("#"+$item.attr("sameto")).val()) {
                currMsg = $item.attr("tip");
                return currMsg;
            }
        }
        //判断是否是手机号
        if ($item[0].hasAttribute("telephone")) {
            if (!(/^1[1-9][0-9]\d{4,8}$/.test(itemval)) && itemval != "") {
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

    //头部焦点图
    function showAdvList() {
        $.ajax({
            url: ApiUrl + "/index.php?act=api&op=get_shop_banner&flag=a",
            type: 'get',
            dataType: 'json',
            success: function(result) {
                var data = result.result;
                var html = '';
                html = template.render("adv_list", result);
                $(".device").html(html);
                $('.device').each(function() {
//                    if ($(this).find('.swiper-slide').length < 2) {
//                        return;
//                    }
                    var mySwiper = new Swiper('.swiper-container', {
                        pagination: '.pagination',
                        loop: true,
                        grabCursor: true,
                        paginationClickable: true
                    });
                });
            }
        });
    }
    ;






    //把函数注册到命名空间中  
    window['FL']['isWeiXin'] = isWeiXin;                        //判断是否微信浏览器
    window['FL']['showMask'] = showMask;                        //显示遮罩
    window['FL']['makeShareLink'] = makeShareLink;              //分享方法
    window['FL']['getScrollTop'] = getScrollTop;                //获取滚动条当前位置
    window['FL']['getClientHeight'] = getClientHeight;          //获取当前可视范围的高度
    window['FL']['scrollEndLoad'] = scrollEndLoad;              //获取当前可视范围的高度
    window['FL']['buildUrl'] = buildUrl;                        //获取当前可视范围的高度
    window['FL']['formatStr'] = formatStr;                      //字符串格式化（占位符替换）
    window['FL']['valid'] = valid;                              //表单验证（占位符替换）
    window['FL']['toTop'] = toTop;                              //回到顶部
    window['FL']['subStrLen'] = subStrLen;                      //字符串截取，如超出长度以“...”替换


    window['FL']['showAdvList'] = showAdvList;                  //页头焦点图
    window['FL']['isEmptyObject'] = isEmptyObject;              //判断对象(json)是否为空

    //window['FL']['pageLogin'] = pageLogin;                      //登陆页js



})();