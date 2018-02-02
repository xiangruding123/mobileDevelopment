/*************主题馆详情*****************/ ! function(Global) {
    var activity_id = GetQueryString("activity_id");

    var resource_tags = GetQueryString("resource_tags");

    var title = GetQueryString("title");
    $(".header-title").text(title);

    var myScroll;
    if (native_flag == '1') {
        var _bridge;

        function connectWebViewJavascriptBridge(callback) {
            if (window.WebViewJavascriptBridge) {
                callback(WebViewJavascriptBridge);
            } else {
                document.addEventListener('WebViewJavascriptBridgeReady', function() {
                    callback(WebViewJavascriptBridge);
                }, false);
            }
        }
    }


    ImgFormat(); //图片格式

    function loadData() {
        $.ajax({

            type: 'get',

            url: WapSiteUrl + "/api/index.php?act=buyer_activity&op=get_activity_detail",

            data: {
                activity_id: activity_id,
                flag: "wap",
                type: 'tietu'
            },

            dataType: 'json',

            success: function(data) {

                if (data && data.error === "0") {

                    //标识

                    resource_tags = data.result.resource_tags || resource_tags;

                    template.helper('resource', function(r) {
                        return r + "&resource_tags=" + resource_tags;
                    });

                    //标题
                    $('title,.header-title').text(data.result.activity_title);

                    $('.activity_body').html(data.result.activity_body);


                    if (data.result.activity_banner) {
                        if (data.result.activity_banner_link) {
                            $('.activity_body').after("<a href='" + data.result.activity_banner_link + "'><img src='" + data.result.activity_banner + "' style='width:100%'></a>");
                        } else {
                            $('.activity_body').after("<img src='" + data.result.activity_banner + "' style='width:100%'>");
                        }
                    }

                    template.helper('parseFloat', parseFloat);

                    $('.activity_body a[href]').unbind("click").bind("click", function(e) {
                        var me = this;
                        var url = $(this).attr("href");
                        var a_url = url.split("!")[0];

                        if (url.indexOf("goods_id=") > 0) {

                            location.href = a_url + "&resource_tags=" + resource_tags + "!goodsdetail";

                            e.preventDefault();
                        }

                    });

                    if (data.result.activity_slides) {
                        var bannerImg = template.render("banners", data.result);

                        $(".swiper-wrapper").empty();

                        $(".swiper-wrapper").append(bannerImg);
                    }
                    var html = template.render("themeBars", data.result);

                    $("#themeList").empty();

                    $("#themeList").append(html);

                    $($(".navbar-nav").find("li")[0]).attr("class", "active");

                    //计算图片大小
                    var imgwidth = parseInt(($(".container").width() + 30) * 0.48) - 20;
                    $(".tm-imgList").css({
                        "width": imgwidth + "px",
                        "height": imgwidth + "px"
                    });



                    $("#themeList img").lazyload({
                        threshold: 200
                    });
                    addScroll();
                    if ($('#t-tabs').length > 0) {
                        myScroll = new IScroll("#t-tabs", {
                            scrollX: true,
                            scrollY: false,
                            mouseWheel: true,
                            probeType: false,
                            preventDefault: false,
                            tap: true
                        });

                    }

                    bindEvent();
                    bannerSwiper();

                    //设置微信分享信息
                    var wx_title = data.result.share_title;
                    var wx_desc = data.result.share_desc;
                    var wx_link = location.href.split('#')[0];
                    var wx_img = data.result.share_img;

                    FL.wxShare(wx_title, wx_desc, wx_link, wx_img, wx_desc, resource_tags);

                    equipmentCheck(wx_title, wx_desc, wx_img, wx_link);



                }
            },
            error: function(xhr) {

            }

        });
    }

    function bindEvent() {
        if (native_flag == '-1') {
            $('header').removeClass('none');
        }
        //页面添加滚动监听
        $(window).bind('scroll', scrollLoad);

        //		$("#t-tabs li").click(function() {
        //			var me = this;
        //			setTimeout(function() {
        //				$("#t-tabs li").removeClass();
        //				$(me).attr("class", "active");
        //				center(me);
        //			}, 10);
        //
        //		});
        // $(".floor-ul li").mousemove(function() {
        //     $(this).css('border-color', '#fa2855');
        // });
        // $(".floor-ul li").mouseout(function() {
        //     $(this).css('border-color', '#eee');
        // });

        $('.select-pic').click(function() {
            $('.m-dropdown').addClass('show mask');
            $('.m-dropdown').attr("style", "position:fixed !important;");
        });
        $('.select-btn').click(function() {
            $('.m-dropdown').removeClass('show mask');
            $('.m-dropdown').attr("style", "position:relative !important;");
        });
        $('.m-dropdown .floors li').click(function() {
            var me = this;
            $('.navbar-nav li').eq($(me).index()).click();
            $(this).addClass("active").siblings('li').removeClass('active');
            $('.m-dropdown').removeClass('show mask');
            $('.m-dropdown').attr("style", "position:relative !important;");
            center(me);
        });


        $('.navbar-nav li').click(function() {
            var me = this;

            if (FL.getScrollTop() >= 198) {
                $(window).unbind('scroll');
            }


            $(me).addClass('active').siblings('li').removeClass('active');


            var dataindex = $(me).attr('data-block');
            var ele = $('.floor-header').eq(dataindex);
            var top = $(ele).offset().top; //元素到页面顶部距离

            center(me);

            document.body.scrollTop = top;

            setTimeout(function() {
                $(window).bind('scroll', scrollLoad);
            }, 600);

        });

    }

    function center(self) {
        var index = $(self).index();
        if ($(self).length > 0) {
            if (index > 1) {
                var liWidth = ($(".container").width() + 30) * 0.25;
                var liwidth = -(index * liWidth - $(".container").width() / 2) - 20;

                setTimeout(function() {
                    myScroll.scrollTo(liwidth, 0);
                }, 10);

            } else {
                myScroll.scrollTo(0, 0);
            }
        }
    }

    function scrollLoad() {
        var ScrollTop = FL.getScrollTop();
        if (ScrollTop >= 198) {
            $(".tm-nav").attr("style", "position:fixed !important;");
        } else {
            $(".tm-nav").attr("style", "position:relitive !important");
            $($(".navbar-nav").find("li")[0]).attr("class", "active");

        }
        for (var k = 0; k < $('.navbar-nav li').length - 1; k++) {
            var dataTop = $($('.floor-header').eq(k)).offset().top;

            try {
                if (dataTop < ScrollTop && ($($('.floor-header').eq(k + 1)).offset().top > ScrollTop)) {
                    $('.navbar-nav li').eq(k).addClass('active').siblings('li').removeClass('active');
                    break;
                }
            } catch (e) {
                $('.navbar-nav li').eq(k).addClass('active').siblings('li').removeClass('active');
            }

        }

        $('.m-dropdown .floors li').eq($(".navbar-nav .active").index()).addClass('active').siblings('li').removeClass('active');
        var self = $('.navbar-nav .active');
        center(self);

    }

    function equipmentCheck(_title, _content, _imgs, _url) {

        var ss = navigator.userAgent.toLowerCase();
        if (ss.indexOf("fhmall_android") > 0) {
            enableShareButton(_title, _content, _imgs, _url);

        } else if (ss.indexOf("fhmall_ios") > 0) {
            connectWebViewJavascriptBridge(function(bridge) {
                _bridge = bridge;
                /*JS 接收消息模块*/
                try {
                    bridge.init(function(message, responseCallback) {

                    });
                } catch (e) {

                }

                enableShare(_title, _content, _imgs, _url);
            });

        } else {

        }

    }

    //设置android分享
    function enableShareButton(_title, _content, _imgs, _url) {
        var sharejson = {
            "title": _title,
            "content": _content,
            "imgs": _imgs,
            "url": _url
        };
        FHMall.enableShareButton(JSON.stringify(sharejson));
    }

    /* 设置ios浏览器右上角分享按钮 */
    function enableShare(_title, _content, _imgs, _url) {
        var data = {
            "func": "enableshare",
            "params": {
                "title": _title,
                "content": _content,
                "imgs": _imgs,
                "url": _url
            }
        };
        _bridge.send(data);
    }

    //计算添加横向滚动条
    function addScroll() {
        var liWidth = ($(".container").width() + 30) * 0.25;
        var num = $("#t-tabs li").length;
        var tabWith = liWidth * num;

        if (tabWith > ($(".container").width() + 30)) {
            //				$("#t-tabs").append('<i class="icon-angle-down rg-arrow"></i>');
            $(".navbar-nav").attr("style", "width:" + tabWith + "px");
            $($(".navbar-nav").find("li")).attr("style", "width:" + liWidth + "px");
            //			var tabScrool = new IScroll("#t-tabs", {
            //				scrollX: true,
            //				scrollY: false,
            //				mouseWheel: true,
            //				tap: true
            //			});

        }
    }
    //轮播
    function bannerSwiper() {
        var mySwiper = new Swiper('.swiper-container', {
            autoplay: 6000,
            autoplayDisableOnInteraction: false,
            pagination: '.swiper-pagination'
        });
    }
    /**
     * @content 新人红包链接跳转判断
     * @author  ljz
     * @date    20160829
     **/



    function linkGoTo() {
        if (native_flag == '0') {
            try {
                var obj = JSON.parse(FHMall.getMemberInfo());
            } catch (e) {
                var obj = null;
            }

            if (obj) {

                location.href = "../packet/coupon_list.html?!coupons";

            } else {

                location.href = "../activity/bagactivity.html?activity_id=51";

            }


        } else if (native_flag == '1') {

            connectWebViewJavascriptBridge(function(bridge) {
                _bridge = bridge;
                /*JS 接收消息模块*/
                try {
                    bridge.init(function(message, responseCallback) {

                    });
                } catch (e) {

                }
                igetMemberInfo();
            });
            /* 获取会员信息 */

            function igetMemberInfo() {
                var data = {
                    "func": "getmember",
                    "params": ""
                };
                _bridge.send(data, function(responseData) {
                    if (responseData) {

                        location.href = "../packet/coupon_list.html?!coupons";

                    } else {

                        location.href = "../activity/bagactivity.html?activity_id=51";

                    }
                });
            }



        } else if (native_flag == '-1') {


            if (FL.mid) {
                location.href = "../packet/coupon_list.html?!coupons";
            } else {
                location.href = "../activity/bagactivity.html?activity_id=51";
            }


        }
    }



    $('#linkGoTo').click(function() {
        linkGoTo();
    });

    var ThemeDetails = function() {
        this.onLoad = function() {

            loadData();

        }
    }
    Global.Goods = Global.Goods || {};
    Goods.ThemeDetails = new ThemeDetails();

}(this);
