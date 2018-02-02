$(function() {



    //获取图文验证码
    FL.getHash("img_secode");
    $('#img_secode').click(function() {
        FL.getHash("img_secode");
    });
    //获取验证码
    $("#getCode").click(function() {

        var number = $("input[name='mobile']").val();
        if (/^1[3|4|5|7|8|9][0-9]\d{4,8}$/.test(number) && /^1\d{10}$/.test(number) && !$("input[name='mobile']").hasClass('error')) {
            var phoneNum = $("#mobile").val();
            FL.checkSecode($.trim($("#secode").val()), phoneNum, 'getCode');
        } else {
            layer.msg('请输入正确的的手机号！');
        }

    });

    //页面字段校验
    function validate() {

        $("#loginForm").validate({
            rules: {

                mobile: {
                    required: true,
                    telephone: true
                },

                code: "required"
            },

            messages: {

                mobile: {
                    required: "手机号不能为空！",
                    telephone: "请填写正确的手机号"
                },

                code: "手机验证码必填"


            },
            errorPlacement: function(error, element) {

                var text = error.text();
                var dom = '<div class="tooltip-top" role="tooltip">' + '<div class="tooltip-arrow"></div>' + '<div class="tooltip-in">' + text + '</div>' + '</div>'
                $(".tooltip-top").remove();
                element.before(dom);
            }

        });
    }

    validate();

    //会员登陆
    $('#loginbtn').click(function() {

        var mobile = $('#mobile').val();

        var code = $('#code').val();

        var token;



        if ($("#loginForm").valid()) {

            $.ajax({

                type: 'post',


                url: WapSiteUrl + "/api/index.php?act=common_member&op=login",

                data: {
                    account: mobile,
                    code: code,
                    is_easy: 1,
                    flag: "wap"
                },

                dataType: 'json',

                success: function(data) {


                    if (data.error === '0') {

                        //                      if (typeof(data.result.token) == 'undefined') {
                        //
                        //                          return false;
                        //
                        //                      } else {

                        addcookie('member_name', data.result.member_name);

                        addcookie('mid', data.result.member_id, 365);

                        addcookie('token', data.result.token, 365);

                        addcookie('member_mobile', data.result.member_mobile);

                        addcookie('nickname', data.result.member_nickname);

                        addcookie('store_id', data.result.store_id, 365);

                        addcookie('if_shoper', data.result.if_shoper, 365);

                        addcookie('talent_id', data.result.talent_id, 365);

                        var referurl = localStorage.getItem('thirdBack');

                        localStorage.removeItem('thirdBack'); //上级存储了页面地址  这里清空

                        if (referurl.indexOf('forget_pwd_two') > 0 || referurl.indexOf('modify_password_two') > 0 || referurl.indexOf('register2') > 0 || referurl.indexOf('setting') > 0 || referurl == "" || referurl.indexOf('bag_details') > 0 || referurl.indexOf('fenhongshop') < 0) {
                            location.href = WapSiteUrl + '/wap/tmpl/member/person.html';
                        } else {
                            location.href = referurl;
                        }

                        //                      }

                        $(".error-tips").hide();

                    } else {

                        layer.msg(data.msg);

                    }

                },
                error: function(xhr) {}


            });
        }
    });


});
