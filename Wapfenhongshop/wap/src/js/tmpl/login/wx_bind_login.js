/*************三方登录绑定注册*****************/
!function(Global){
    localStorage.setItem('onetime','2');
    var infoStr =GetQueryString("infoStr") ;

    // if(localStorage.getItem('thirdBack').indexOf('deductid')>0){
    //   var deduct_userid = getUrl(localStorage.getItem('thirdBack'), 'deductid');
    // }

    var deduct_userid = localStorage.getItem("deductid");


    // alert(deduct_userid+"deduct_userid");


    var info = JSON.parse(infoStr);
    try {
        var nickname = info.nickname;
    } catch (e) {

    }
    try {
        var headimgurl = info.headimgurl;
    } catch (e) {

    }

    if (nickname) {
        $('.nickname').text(nickname); //昵称
    }
    if (headimgurl) {
        $('.headimgurl').attr('src', headimgurl); //头像
    }


    
    function pageInit(account) {
        FL.ajaxDate('get', sms_code_init, {
                mobile: account
            },
            function(data) {
                if (data.error === "0") {
                    var res = data.result;
                    countdown = res.countdown;
                    if_captcha = res.if_captcha;
                    mobile_correct = res.mobile_correct;
                    sms_available = res.sms_available;
                    $('#getCode').attr('countdown', countdown);

                    if (res.last_countdown) {
                        FL.countDown(res.last_countdown, $('#getCode'));
                    }

                    if (if_captcha == '1') { //显示图文验证码
                        $('#secodebox').show();
                        var account = $('#mobile').val();
                        $("#img_secode").attr("src", WapSiteUrl + "/api/index.php?act=common_index&op=get_captcha&flag=wap&mobile=" + account);
                        bind();
                    } else {
                        $('#secodebox').hide();
                        var time = $('#getCode').attr('countdown');
                        // $('#code').focus();
                        var account = $('#mobile').val();
                        FL.getSmsCode(account, time, 'getCode');
                        bindEvent();
                    }

                    $('.cleareye').click(function() {
                        if ($('#password').attr('type') == 'text') {
                            $('#password').prop("type", "password");
                            $('.cleareye').prop('src', '../../src/images/wap/login/eye.png');
                        } else {
                            $('#password').prop("type", "text");
                            $('.cleareye').prop('src', '../../src/images/wap/login/eyeclick.png');
                        }

                    });
                    $('.cleartext').click(function() {
                        $(this).parent('div').find('input').val('').focus();
                        $(this).hide();
                    });
                }
            }
        );

    }


    //获取验证码
    $("#getCode").click(function() {
        var me = this;
        var number = $("input[name='mobile']").val();

        if (/^[1][34578]\d{9}$/.test(number)) {
            if (localStorage.getItem('onetime') == 2) {
                localStorage.setItem('onetime', '1');
                pageInit(number);

                if ($('#getCode').hasClass('nogetcode')) {
                    $('#secodebox').show();
                    $("#img_secode").attr("src", WapSiteUrl + "/api/index.php?act=common_index&op=get_captcha&flag=wap&mobile=" + account);
                    bind();
                }
            }
        } else {
            layer.msg('请输入正确的手机号！');
        }

    });

    function bindEvent() {

        $("#getCode").click(function() {

            var me = this;
            var number = $("input[name='mobile']").val();

            if (/^[1][34578]\d{9}$/.test(number)) {

                var time = $('#getCode').attr('countdown');
                // $('#code').focus();
                var account = $('#mobile').val();
                FL.getSmsCode(account, time, 'getCode');

            }

        });

        $("#code").keyup(function() {
            var me = this;
            if ($(me).val().length == 4) {
                $("#nextStep").removeAttr('disabled');
            } else {
                $("#nextStep").attr('disabled', 'disabled');
            }
        });
        //点击确定
        $("#nextStep").click(function() {
            validCode();
        });

    }

    function bind() {

        $("#getCode").click(function() {
            var me = this;
            var number = $("input[name='mobile']").val();
            if (/^[1][34578]\d{9}$/.test(number)) {

                if ($("#secode").val().length != 4) {
                    layer.msg('请输入正确的图形验证码');
                } else {
                    var time = $('#getCode').attr('countdown');

                    // $('#code').focus();
                    FL.getSmsCode(number, time, 'getCode', $("#secode").val());
                }

            } else {
                layer.msg('请输入正确的手机号！');
            }
        });

        $("#code").keyup(function() {
            var me = this;
            if ($(me).val().length == 4) {
                $("#nextStep").removeAttr('disabled');
            } else {
                $("#nextStep").attr('disabled', 'disabled');
            }
        });
        //点击确定
        $("#nextStep").click(function() {
            validCode();
        });
    }
    //校验验证码
    function validCode() {

        var code = $("input[name='code']").val();
        var number = $("input[name='mobile']").val();
        $.ajax({
            type: 'post',

            url: WapSiteUrl + "/api/index.php?act=common_member&op=check_phone_code", //测试专用不加验证码

            data: {
                num: number,
                code: code,
                flag: "wap"
            },

            dataType: 'json',

            success: function(result) {
                if (result.error === "0") {
                    checkMobile(number);

                } else {
                    layer.msg(result.msg);
                }
            },
            error: function(xhr) {

            }
        });

    }


    //三方账号绑定手机号
    function bindLogin(number, check) {
        var code = $("input[name='code']").val();
        $.ajax({
            type: 'post',

            url: WapSiteUrl + "/api/index.php?act=common_member&op=third_bind",

            data: {
                info: infoStr,
                type: "wx",
                flag: "wap",
                mobile: number,
                code: code,
                check: check
            },

            dataType: 'json',

            success: function(data) {
                if (data && data.error == 0) {
                    addcookie('member_name', data.result.member_name);
                    addcookie('mid', data.result.member_id);
                    addcookie('token', data.result.token);
                    addcookie('member_mobile', data.result.member_mobile);
                    addcookie('store_id', data.result.store_id);
                    addcookie('if_shoper', data.result.if_shoper);
                    addcookie('nickname', data.result.member_nickname);
                    addcookie('shop_id', data.result.shop_id);
                    addcookie('talent_id', data.result.talent_id, 365);
                    //var backUrl =  unescape(getcookie('thirdBack'));
                    var backUrl = localStorage.getItem('thirdBack');
                    localStorage.removeItem('thirdBack'); //上级存储了页面地址  这里清空
                    if (backUrl.indexOf('forget_pwd_two') > 0 || backUrl.indexOf('modify_password_two') > 0 || backUrl.indexOf('register2') > 0 || backUrl.indexOf('setting') > 0 || backUrl == "" || backUrl.indexOf('bag_details') > 0 || backUrl.indexOf('fenhongshop') < 0) {

                        location.href = WapSiteUrl + '/wap/tmpl/member/person.html';
                    } else {
                        location.href = backUrl;

                    }
                } else if (data.error == '1000015') {
                    FL.addShade();
                    $('#noinfoDialog').show();
                    $('#leftbtn').click(function() {
                        $('#noinfoDialog').hide();
                        FL.removeShade();
                    });
                    $('#rightbtn').click(function() {
                        $('#noinfoDialog').hide();
                        FL.removeShade();
                        bindLogin(number);
                    });

                }

            }
        });
    }
    //检测手机号是否已注册  否跳到设置密码页  是直接跳到首页
    function checkMobile(number) {
        var code = $("input[name='code']").val();
        $.ajax({
            type: 'get',

            url: WapSiteUrl + "/api/index.php?act=common_member&op=check_phone",

            data: {
                mobile: number,
                flag: "wap"
            },

            dataType: 'json',

            success: function(data) {

                if (data.error == '1000002') {

                    bindLogin(number, 1);

                } else if (data.error == '1000011' || data.error == '0') {
                    var infoStr = JSON.stringify(info);

                    register(infoStr, code, number, number);
                }
            }
        });
    }
    //会员注册
    function register(info, code, number, pwd) {

        $.ajax({
            type: "post",
            url: WapSiteUrl + "/api/index.php?act=common_member&op=third_register", //测试专用不加验证码
            data: {
                flag: "wap",
                type: "wx",
                mobile: number,
                code: code,
                pwd: pwd,
                info: info,
                deduct_userid: deduct_userid
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
                    addcookie('nickname', data.result.member_nickname);
                    addcookie('talent_id', data.result.talent_id, 365);
                    addcookie('shop_id', data.result.shop_id);
                    localStorage.setItem("unionid", info.unionid);
                    localStorage.setItem("info", JSON.stringify(info));
                    //var backUrl =  unescape(getcookie('thirdBack'));
                    var backUrl = localStorage.getItem('thirdBack');
                    localStorage.removeItem('thirdBack'); //上级存储了页面地址  这里清空
                    if (backUrl.indexOf('forget_pwd_two') > 0 || backUrl.indexOf('modify_password_two') > 0 || backUrl.indexOf('register2') > 0 || backUrl.indexOf('setting') > 0 || backUrl == "" || backUrl.indexOf('bag_details') > 0 || backUrl.indexOf('fenhongshop') < 0) {
                        location.href = WapSiteUrl + '/wap/tmpl/member/person.html';
                    } else {
                        location.href = backUrl;

                    }
                }
            }
        });
    }

    var WxBind = function() {
        this.onLoad = function() {


        }
    }
    Global.Member = Global.Member || {};
    Member.WxBind = new WxBind();
}(this);
