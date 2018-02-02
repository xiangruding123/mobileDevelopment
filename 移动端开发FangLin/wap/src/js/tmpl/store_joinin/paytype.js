(function($, w, d) {
    'use strict';

    check_login();
     var mid = FL.mid,    token = FL.token;
    $(function() {

        $.ajax({
            type: 'get',
            url: WapSiteUrl + "/api/index.php?act=common_store_joinin",
            data: {
                mid: mid,                                token:token,
                flag: "wap"
            },
            dataType: "json",
            success: function(data) {
                if (data.error == "0") {

                    var html = template.render('paytype_tpl', data.result);
                    $("#paytype").append(html);

                    if (data.result.step == "2") {
                        location.href = "information.html";
                    }
                    if (data.result.step == "5") {
                        location.href = "payment.html";
                    }

                    if (data.result.step == "7") {
                        location.href = "payment.html";
                    }

                    if (data.result.step == "8") {
                        $(".zhongdian").css({
                            "color": "#ff4b4b"
                        });
                        location.href = "payment.html";
                    }

                    $('#pay_certificate').on('change', function() {

                        var fd = new FormData();
                        fd.append("token", token);
                        fd.append("mid", mid);
                        fd.append('flag', 'wap');
                        fd.append('pay_certificate', $(this)[0].files[0]);


                        swal({
                            title: "",
                            text: "正在努力上传...",
                            imageUrl: "../images/preloader.gif",
                            showConfirmButton: false
                        });

                        $.ajax({
                            type: 'post',
                            url: WapSiteUrl + "/api/index.php?act=common_store_joinin&op=pay_offline",
                            data: fd,
                            processData: false,
                            contentType: false,
                            dataType: "json",
                            success: function(data) {
                                if (data.error == "0") {
                                    swal('', '上传成功！', 'success');
                                    $('.upload-pic').find('img').attr("src", data.result).show();
                                } else {
                                    swal('', '上传失败，请重试~', 'error');
                                }
                            }
                        });

                        return false;
                    });

                    $('.submit').click(function() {
                        var pic = $('.upload-pic').find('img').attr('src');

                        var fd = new FormData();
                        fd.append("token", token);
                        fd.append("mid", mid);
                        fd.append('flag', 'wap');
                        fd.append('step', '5');
                        fd.append('pay_certificate_explain', $('.textarea').val());
        
                        if (pic) {
                            $.ajax({
                                type: 'post',
                                url:  WapSiteUrl + "/api/index.php?act=common_store_joinin&op=pay_offline",
                                data: fd,
                                processData: false,
                                contentType: false,
                                dataType: "json",
                                success: function(data) {
                                    if (data.error == "0") {
                                        swal({
                                            title: "",
                                            text: "付款凭证提交成功！",
                                            type: "success",
                                        }, function() {
                                            location.href = 'payment.html';
                                        });
                                    } else {
                                        swal('', '提交失败，请重试~', 'error');
                                        return false;
                                    }
                                }
                            });
                        } else {
                            swal('', '请上传付款凭证电子版', 'error');
                            return false;
                        }
                    });

                }
            }
        });
    });
}($, window, document));
