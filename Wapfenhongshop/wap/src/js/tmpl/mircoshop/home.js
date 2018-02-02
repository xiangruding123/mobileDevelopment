$(function() {
    // 页面初始化

    $.init();

    var mid, token, shop_id;


    //页面数据填充

    function loadDate(mid, token, shop_id) {
        FL.ajaxDate('get', get_shop_info_all, {
            mid: mid,
            token: token,
            shop_id: shop_id
        }, function(data) {

            if (data && data.error == '0') {

                var res = data.result;

                $('.shop_number').eq(0).html(res.allsum_money_today);
                $('.shop_number').eq(1).html(res.allsum_money_thismonth);
                $('.shop_number').eq(2).html(res.visit_count);
                $('.shop_number').eq(3).html(res.all_money);
                if (res.shop_logo) {

                    $('.headphoto .shoplogo').prop('src', res.shop_logo);

                }

                if (res.micro_shop_first_time_visit) {
                    $('.hometip').show();
                }

                $('.hometip').click(function() {
                    $(this).hide();
                });

                if (res.shop_name) {
                    $('.headphoto p').html(res.shop_name);
                }

                $('.headphoto .paimg').click(function() {
                    location.href = "shopdata.html?status=" + res.shop_type;
                    event.stopPropagation();

                });
                if (res.shop_type == '2') {
                    $('title').html('大V红人店铺');
                    $('.home-top-bottom span').removeClass('none');
                    $('.iconbutton365').show();
                    $('.booknickname').html('大V');
                } else if (res.shop_type == '3') {
                    $('title').html('皇冠红人店铺');
                    $('.iconbutton666').show();
                    $('.booknickname').html('皇冠');
                }

                if (res.shop_banner) {
                    $('.home-top').css('backgroundImage', 'url(' + res.shop_banner + ')');
                }

                //升级
                $('.home-top-bottom span').click(function() {
                    //location.href = 'order.html?updata=1';
                    location.href = 'six.html';
                })

                if (res.micro_shop_update_remind) {
                    $.toast(res.micro_shop_update_remind);
                }



                getBook(mid, token); //证书


                //页面事件添加
                loadEvent(mid, token, shop_id);

            }
        })
    }




    function compressImg(objId) {


        //压缩图片
        var filechooser = document.getElementById(objId);


        //    用于压缩图片的canvas
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext('2d');
        //    瓦片canvas
        var tCanvas = document.createElement("canvas");
        var tctx = tCanvas.getContext("2d");
        var maxsize = 200 * 1024;

        filechooser.onchange = function() {

            FL.fhload();

            if (!this.files.length) return;
            var files = Array.prototype.slice.call(this.files);
            // if (files.length > 9) {
            //   alert("最多同时只可上传9张图片");
            //   return;
            // }
            files.forEach(function(file, i) {
                if (!/\/(?:jpeg|png|gif)/i.test(file.type)) return;
                var reader = new FileReader();

                reader.onload = function() {
                    var preview = this.result;
                    var img = new Image();
                    img.src = preview;

                    //如果图片大小小于100kb，则直接上传
                    if (preview.length <= maxsize) {
                        img = null;

                        //base64的图片转成二进制对象，塞进formdata上传
                        var blob = getBlob(preview);

                        upLoadImage(blob);
                        return;
                    }
                    //      图片加载完毕之后进行压缩，然后上传
                    if (img.complete) {
                        callback();
                    } else {
                        img.onload = callback;
                    }

                    function callback() {
                        var preview = compress(img);

                        //base64的图片转成二进制对象，塞进formdata上传
                        var blob = getBlob(preview);

                        upLoadImage(blob);

                        img = null;
                    }
                };
                reader.readAsDataURL(file);
            })
        }

        //    使用canvas对大图片进行压缩
        function compress(img) {
            var initSize = img.src.length;
            var width = img.width;
            var height = img.height;
            //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
            var ratio;
            if ((ratio = width * height / 4000000) > 1) {
                ratio = Math.sqrt(ratio);
                width /= ratio;
                height /= ratio;
            } else {
                ratio = 1;
            }
            canvas.width = width;
            canvas.height = height;
            //        铺底色
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            //如果图片像素大于100万则使用瓦片绘制
            var count;
            if ((count = width * height / 1000000) > 1) {
                count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
                //            计算每块瓦片的宽和高
                var nw = ~~(width / count);
                var nh = ~~(height / count);
                tCanvas.width = nw;
                tCanvas.height = nh;
                for (var i = 0; i < count; i++) {
                    for (var j = 0; j < count; j++) {
                        tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
                        ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
                    }
                }
            } else {
                ctx.drawImage(img, 0, 0, width, height);
            }
            //进行最小压缩
            var ndata = canvas.toDataURL('image/jpeg', 0.5);

            tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
            return ndata;
        }

    }



    //base64的图片转成二进制对象，塞进formdata上传
    function getBlob(preview) {
        var binaryString = atob(preview.split(',')[1]),
            mimeType = preview.split(',')[0].match(/:(.*?);/)[1],
            length = binaryString.length,
            u8arr = new Uint8Array(length),
            blob;
        while (length--) {
            u8arr[length] = binaryString.charCodeAt(length);
        }
        blob = new Blob([u8arr.buffer], {
            type: mimeType
        });
        return blob;
    }

    if (native_flag == '0') {


        $('#avatar').bind('click', function() {
            FHMall.upload(false, 500, 400, 0, 0, function(flag, url) {
                $('.home-top').css('backgroundImage', 'url(' + url + ')');

                FL.ajaxDate('post', set_shoper_info, {
                    mid: getcookie('mid'),
                    token: getcookie('token'),
                    shop_banner: url
                }, function(date) {
                    if (date && date.error == "0") {

                        $('.photochange').addClass('none');
                    }
                });
            });
        });
    }

    function upLoadImage(objImg) {

        var fd = new FormData();
        fd.append("mid", getcookie('mid'));
        fd.append("token", getcookie('token'));
        if (native_flag == '-1') {
            fd.append("flag", "wap");
        } else if (native_flag == '1') {
            fd.append("flag", "ios");
        }
        fd.append("type", "goods_evaluation");
        fd.append("img", objImg);

        $.ajax({

            type: 'post',

            url: image_upload,

            processData: false,

            contentType: false,

            dataType: "json",

            data: fd,

            success: function(data) {
                if (data && data.error == "0") {

                    $('.home-top').css('backgroundImage', 'url(' + data.result + ')');

                    FL.ajaxDate('post', set_shoper_info, {
                        mid: getcookie('mid'),
                        token: getcookie('token'),
                        shop_banner: data.result
                    }, function(date) {
                        if (date && date.error == "0") {

                            $('.photochange').addClass('none');
                        }
                    });
                }
            },
            error: function(xhr) {

            }

        });

    }


    //证书数据获取

    function getBook(mid, token) {
        FL.ajaxDate('post', get_member_info, {
            mid: mid,
            token: token
        }, function(data) {
            if (data && data.error == '0') {

                // 证书显示隐藏
                $(document).on('click', '.open-about', function() {
                    $.popup('.popup-about');
                });

                $(document).on('click', '.popup-overlay', function() {
                    $.closeModal('.popup-about');
                });

                var res = data.result;

                $('.bookecode').attr('src', res.micro_shop_qrcode_url);
                $('.bookname').html(res.card_name);

                if (res.company_pic_url) {
                    $('.bookphoto').attr('src', res.company_pic_url);
                } else {
                    $('.bookphoto').attr('src', res.person_pic_url);
                }

                $('.booknickname').html(res.micro_shop_name);


                $('.auth_sn').html(res.auth_sn);
                $('.time').html(res.verify_time);

            }
        })
    }






    function loadEvent(mid, token, shop_id) {

        FL.ajaxDate('post', is_complete_member, {
            mid: mid,
            token: token,
            shop_id: shop_id
        }, function(data) {

            //未完成资料补充
            if (data.result.is_complete == '0') {
                $.toast('您的资料还没完善，快去完善吧');
                setTimeout(function() {
                    location.href = "useinfo.html";
                }, 5000);

            }
        });

        //上传背景
        $('.home-top').click(function() {

            $('.photochange').removeClass('none');

            compressImg('avatar');


        });

        $('.photochange').click(function() {
            $('.photochange').addClass('none');
            event.stopPropagation();
        });

        // 底部导航
        $('.appBtmFooter li').bind('click', function() {
            var me = this;

            var appIndex = $(me).index();

            if (native_flag == '-1') {
                var href = $(me).find('a').attr("data-href");
                location.href = href;
            } else {
                gotoAppHome(appIndex);
            }
        });


        //share
        var _title = "我是红人店主，邀您共现创富梦",
            _desc = "【赚钱】独创运营模式，全方位指导，专业团队，引领世界共创富，分红全球购打造亿万大众创富梦想的平台，财富等您加入！！！",
            _pic = "http://www.fenhongshop.com/wap/images/wap/logo.png",
            _url = WapSiteUrl + '/wap/tmpl/mircoshop/shop.html?shop_id=' + shop_id;


        FL.wxShare(_title, _desc, _url, _pic, _desc);

    }





    // 用户信息

    function getMemberInfo(info) {
        mid = info.member_id,
            token = info.token,
            shop_id = info.shop_id;


        if (!shop_id) {
            FL.ajaxDate('get', get_shoper_info, {
                mid: mid
            }, function(data) {
                if (data && data.error == "0") {
                    var res = data.result;
                    addcookie('shop_id', res.shop_id);

                    loadDate(mid, token, res.shop_id); //页面数据
                }
            });
        } else {

            loadDate(mid, token, shop_id); //页面数据
        }


        //app数据添加token
        addcookie('member_name', info.member_name);
        addcookie('mid', info.member_id);
        addcookie('token', info.token);
        addcookie('nickname', info.member_nickname);
        addcookie('shop_id', info.shop_id);

    }




    //页面数据获取
    if (native_flag == '-1') {
        loadDate(FL.mid, FL.token, FL.shop_id); //页面数据
    } else {
    	
        appMemberInfo({
                success: getMemberInfo
        });
        
    }


});
