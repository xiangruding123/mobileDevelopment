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
        $mask.live("click", function() {
            $mask.remove();
        });
        $("body").append($mask);
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
            sameto:"两次输入不同",
            mustnum:"{0}必须为数字",
            mustint:"{0}必须为整数",
            nummin:"{0}不能小于{1}",
            nummax:"{0}不能大于{1}",
            selnotval:"请选择{0}",
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
        //必须是数字
        if ($item[0].hasAttribute("mustnum")) {
            if (!(/^[\+\-]?\d*?\.?\d*?$/.test(itemval)) && itemval != "") {
                currMsg = formatStr(msg["mustnum"], $item.attr("tip"));
                return currMsg;
            }
        }
        //最小数字
        if ($item[0].hasAttribute("nummin")) {
            if (parseFloat(itemval) < parseFloat($item.attr("nummin"))) {
                currMsg = formatStr(msg["nummin"],$item.attr("tip"),$item.attr("nummin"));
                return currMsg;
            }
        }
        //最大数字
        if ($item[0].hasAttribute("nummax")) {
            if (parseFloat(itemval) >= parseFloat($item.attr("nummax"))) {
                currMsg = formatStr(msg["nummax"],$item.attr("tip"),$item.attr("nummax"));
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
        //判断身份证是否合法
        if ($item[0].hasAttribute("identity")) {
            var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
            var tip = "";
            var pass= true;
            
            if(!itemval || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(itemval)){
                tip = "身份证号格式错误";
                pass = false;
            } else if(!city[itemval.substr(0,2)]){
                tip = "身份证号地址编码错误";
                pass = false;
            } else{
                //18位身份证需要验证最后一位校验位
                if(itemval.length == 18){
                    itemval = itemval.split('');
                    //∑(ai×Wi)(mod 11)
                    //加权因子
                    var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                    //校验位
                    var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                    var sum = 0;
                    var ai = 0;
                    var wi = 0;
                    for (var i = 0; i < 17; i++)
                    {
                        ai = itemval[i];
                        wi = factor[i];
                        sum += ai * wi;
                    }
                    var last = parity[sum % 11];
                    if(parity[sum % 11] != itemval[17]){
                        tip = "身份证号格式错误";
                        pass =false;
                    }
                }
            }
            if(!pass){
                return tip;
            }
            
        }
        
        //判断下拉列表是否选择
        if ($item[0].hasAttribute("selnotval")) {
            if (itemval==$item.attr("selnotval")) {
                currMsg = formatStr(msg["selnotval"], $item.attr("tip"));
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

    //固定头部位置
    function setHeaderTop(){
        var $win = $(window);
        var tempL = 0;
        if($win.width()>=640){
            tempL = ($win.width() - $("header.header").width())/2;
            $("header.header").css({left:tempL});
        }
    }
    
    //设置select默认值
    function initSelval(){
        $.each($("select"),function(i,dom){
            var defval = $(dom).attr("defval");
            if(typeof(defval)!="undefined"){
                $(dom).val(defval);
            }
        });
    }
    
    //获取区间随机数
    function getRandom(begin,end){
        return Math.floor(Math.random()*(end-begin))+begin;
    }
    
    //获取URL参数
    function getQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)
            return decodeURI(r[2]);
        return null;
    };
    
    //获取今天前后日期
    function getDateStr(AddDayCount) {
        var dd = new Date();
        dd.setDate(dd.getDate()+AddDayCount);//获取AddDayCount天后的日期
        var y = dd.getFullYear();
        var m = dd.getMonth()+1;//获取当前月份的日期
        var d = dd.getDate();
        //callback(y,m,d);
        return new Date(y,m,d);
    };
    
    //添加cookie
    function addcookie(name, value, expireHours) {
        expireHours = expireHours || 0;
        var expires = "";
        if (expireHours != 0) {  
            var date = new Date();
            date.setTime(date.getTime() + (expireHours * 3600 * 1000));
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
    };

    function delCookie(name) {//删除cookie
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval = getcookie(name);
        if (cval != null)
            document.cookie = name + "=" + cval + "; path=/;expires=" + exp.toGMTString();
    };
    
    //时间戳转日期.
    function getLocalTime(nS) {     
        return new Date(parseInt(nS) * 1000);
    };

    
    
    
    
    
    //把函数注册到命名空间中  
    window['FL']['isWeiXin'] = isWeiXin;                        //判断是否微信浏览器
    window['FL']['showMask'] = showMask;                        //显示遮罩
    window['FL']['getScrollTop'] = getScrollTop;                //获取滚动条当前位置
    window['FL']['getClientHeight'] = getClientHeight;          //获取当前可视范围的高度
    window['FL']['scrollEndLoad'] = scrollEndLoad;              //获取当前可视范围的高度
    window['FL']['formatStr'] = formatStr;                      //字符串格式化（占位符替换）
    window['FL']['valid'] = valid;                              //表单验证（占位符替换）
    window['FL']['isEmptyObject'] = isEmptyObject;              //判断对象(json)是否为空
    window['FL']['setHeaderTop'] = setHeaderTop;                //固定头部位置
    window['FL']['initSelval'] = initSelval;                    //设置下拉列表默认值
    window['FL']['getRandom'] = getRandom;                      //生成 区间 随机数
    window['FL']['getQueryString'] = getQueryString;            //获取URL参数
    window['FL']['getDateStr'] = getDateStr;                    //获取今天前后的日期.
    window['FL']['addcookie'] = addcookie;                      //新增cookie
    window['FL']['getcookie'] = getcookie;                      //获取cookie
    window['FL']['delCookie'] = delCookie;                      //删除cookie
    window['FL']['getLocalTime'] = getLocalTime;                //时间戳转JS日期
    
    
})();




