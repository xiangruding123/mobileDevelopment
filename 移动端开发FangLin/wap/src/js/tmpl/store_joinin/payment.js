(function($, w, d) {
    'use strict';

    check_login();
    var mid = FL.mid,    token = FL.token;    
    $(function() {

        $("p.submit").hide();

        $.ajax({
            type: "get",
            url: WapSiteUrl + "/api/index.php?act=common_store_joinin",
            data: {
                mid: mid,                token:token,
                flag: "wap"
            },
            dataType: "json",
            success: function(data) {
                if (data.error == "0") {

                    var html = template.render('payment_tpl', data.result);
                    $("#payment").append(html);

                    if (data.result.step == "4") {
                        $("p.submit").show();
                    }

                    if (data.result.step == "6") {
                        $('.next:not(.submit)').show();
                    }
                    if (data.result.step == "7") {
                        $("p.submit").show();
                        $("p.submit").html("重新付款");
                        $("p.submit").click(function() {
                            $.ajax({
                                type: 'get',
                                url: WapSiteUrl + "/api/index.php?act=common_store_joinin",
                                data: {
                                    mid: mid,                                    token:token,
                                    step: "7",
                                    flag: "wap"
                                },
                                dataType: "json",
                                success: function(data) {
                                    if (data.error == "0") {
                                        if (data.result.step == "4") {
                                            location.href = "paytype.html";
                                        }
                                    }
                                }
                            });
                        });
                    }

                    if (data.result.step == "8") {
                        $(".zhongdian p").css({
                            "color": "#ff4b4b",
                            "font-size": "13px"
                        });
                    }


                    $(".next:not(.submit)").click(function() {
                        $.ajax({
                            type: 'get',
                            url: WapSiteUrl + "/api/index.php?act=common_store_joinin",
                            data: {
                                mid: mid,                                token:token,
                                step: '6',
                                flag: "wap"
                            },
                            dataType: "json",
                            success: function(data) {
                                if (data.error == "0") {
                                    if (data.result.step == "1") {
                                        location.href = "aptitude.html";
                                    } else {
                                        alert("fanhuiyemian  false");
                                    }
                                }
                            }
                        });
                    });

                    $(".submit").click(function() {
                        $.ajax({
                            type: 'get',
                            url: WapSiteUrl + "/api/index.php?act=common_store_joinin",
                            data: {
                                mid: mid,                                token:token,
                                step: '7',
                                flag: "wap"
                            },
                            dataType: "json",
                            success: function(data) {
                                if (data.error == "0") {
                                    location.href = 'paytype.html';
                                }
                            }
                        });
                    });


                } else {
                    return false;
                }
            }
        });


        
    });
}($, window, document));
