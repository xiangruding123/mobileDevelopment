/*************三方绑定注册*****************/ ! function(Global) {

    //页面字段校验
    function validate() {

        $("#registerForm").validate({
            rules: {

                password: "required",

                com_pwd: {
                    required: true,
                    equalTo: "#login_pwd"
                }
            },

            messages: {

                password: "登录密码必填",

                com_pwd: {
                    required: "请输入您的确认密码",
                    equalTo: "两次输入密码不一致"
                }
            },
            errorPlacement: function(error, element) {
                var text = error.text();
                var dom = '<div class="tooltip-top" role="tooltip">' +
                    '<div class="tooltip-arrow"></div>' +
                    '<div class="tooltip-in">' + text + '</div>' +
                    '</div>'
                $(".tooltip-top").remove();
                element.before(dom);
            }

        });
    }

    function bindEvent() {
        //注册
        $("#register").click(function() {
            if ($("#registerForm").valid()) {
                register();
            }
        });
    }

    //会员注册
    function register() {
        var code = GetQueryString("code");
        var number = GetQueryString("num");
        var pwd = $("input[name='password']").val();
        var info = GetQueryString("info");
        $.ajax({
            type: "post",
            url: WapSiteUrl + "/api/index.php?act=common_member&op=third_register",
            data: {
                flag: "wap",
                type: "wx",
                mobile: number,
                code: code,
                pwd: pwd,
                info: info
            },
            dataType: "json",
            success: function(data) {
                if (data && data.error == 0) {
                    addcookie('member_name', data.result.member_name);
                    addcookie('mid', data.result.member_id);
                    addcookie('token', data.result.token);
                    addcookie('member_mobile', data.result.member_mobile);
                    addcookie('store_id', data.result.store_id);
                    addcookie('if_shoper', data.result.if_shoper);
                    addcookie('talent_id', data.result.talent_id, 365);
                    localStorage.setItem("unionid", info.unionid);
                    localStorage.setItem("info", JSON.stringify(info));
                    var backUrl = unescape(getcookie('thirdBack'));
                    if (backUrl.indexOf('forget_pwd_two') > 0 || backUrl.indexOf('modify_password_two') > 0 || backUrl.indexOf('register2') > 0 || backUrl.indexOf('setting') > 0 || backUrl == "" || backUrl.indexOf('bag_details') > 0 || backUrl.indexOf('fenhongshop') < 0) {
                        location.href = '../member/person.html';
                    } else {
                        location.href = backUrl;
                    }
                }
            }
        });
    }


    var ThirdRegister = function() {
        this.onLoad = function() {
            validate();
            bindEvent();
        }
    }
    Global.Member = Global.Member || {};
    Member.ThirdRegister = new ThirdRegister();
}(this);
