/*************三方登录绑定注册*****************/ ! function(Global) {

    if (sessionStorage.getItem("timenum") == "one") {
        sessionStorage.removeItem("timenum");
        var backUrl = localStorage.getItem('thirdBack') || "http://www.fenhongshop.com/wap/tmpl/index/index.html";
        location.href = backUrl;
    } else {
        sessionStorage.setItem("timenum", "one");
    }


    var source = GetQueryString("from");

    var info, infoStr;


    //获取三方登录信息
    var code = GetQueryString("code");
    var type = GetQueryString("type");
    //获取三方用户信息
    $.ajax({
        type: 'post',
        url: WapSiteUrl + '/api/index.php?act=common_member&op=get_third_account_info',
        global: false,
        data: {
            code: code,
            type: type,
            flag: "wap"
        },
        dataType: 'json',
        success: function(data) {
            info = data.result;
            infoStr = JSON.stringify(info);

            localStorage.setItem('thirdBack', referurl);

            thirdLoginIn(type, infoStr);

        },
        error: function(xhr) {}
    });

    function thirdLoginIn(type, infoStr) {
        $.ajax({
            type: 'post',
            url: WapSiteUrl + "/api/index.php?act=common_member&op=third_login",
            data: {
                flag: "wap",
                info: infoStr,
                type: type
            },
            //  global:false,
            dataType: 'json',
            success: function(data) {
                if (data && data.error == 0 && typeof(data.result) == "object") {
                    addcookie('member_name', data.result.member_name);
                    addcookie('mid', data.result.member_id);
                    addcookie('token', data.result.token);
                    addcookie('member_mobile', data.result.member_mobile);
                    addcookie('store_id', data.result.store_id);
                    addcookie('if_shoper', data.result.if_shoper);
                    addcookie('nickname', data.result.member_nickname);
                    addcookie('talent_id', data.result.talent_id, 365);
                    addcookie('shop_id', data.result.shop_id);
                    var backUrl = localStorage.getItem('thirdBack');
                    localStorage.removeItem('thirdBack'); //上级存储了页面地址  这里清空
                    if (backUrl.indexOf('forget_pwd_two') > 0 || backUrl.indexOf('modify_password_two') > 0 || backUrl.indexOf('register2') > 0 || backUrl.indexOf('setting') > 0 || backUrl == "" || backUrl.indexOf('bag_details') > 0 || backUrl.indexOf('fenhongshop') < 0) {
                        location.href = '../member/person.html';
                    } else {
                        location.href = backUrl;
                    }

                } else {
                    if (type == "sina" || type == "qq") {
                        location.href = "weibo_bind_login.html?infoStr=" + infoStr + "&type=" + type;
                    } else if (type == "wx") {
                        location.href = "wx_bind_login.html?infoStr=" + infoStr;
                    }

                }
            }
        })
    }

    var thirdLogin = function() {
        this.onLoad = function() {

        }
    }
    Global.Member = Global.Member || {};
    Member.thirdLogin = new thirdLogin();

}(this);
