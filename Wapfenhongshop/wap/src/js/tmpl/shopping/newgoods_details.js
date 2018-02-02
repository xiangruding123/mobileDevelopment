! function(Global) {
    var goods_id = GetQueryString('goods_id');
    var talent_deductid = GetQueryString('talent_deductid');
    var resource_tags = GetQueryString('resource_tags');
    var dmid = GetQueryString('dmid');
    var token = getcookie("token");
    var mid = getcookie("mid");
    var goods_commonid;
    var goodsId;
    var curpage = 1,
        num = 10;
    var regu = /^[-]{0,1}[0-9]{1,}$/; //判断是否是整数;
    var count = 0; //当前商品总数 用来判断是否还要继续加载更多
    var type = 0;
    var wx_link; /*****添加微信分享用*******/
    var timeDown;
    //添加浏览历史
    FL.addLibrary(goods_id);
    
    
    //分享提示
    if(GetQueryString('shareType')=='share'){
    	FL.addShadeLog();
    }
     

    function loadGoods() {
        $.ajax({
            url: WapSiteUrl + '/api/index.php?act=common_goods&op=get_goods_detail',
            type: 'get',
            dataType: 'json',
            data: {
                goods_id: goods_id,
                mid: FL.mid,
                flag: 'wap',
                talent_deductid: talent_deductid,
                dmid: dmid,
                resource_tags: resource_tags
            },
            success: function(data) {
                if (data.error === '0') {
                    var res = data.result;
                    template.helper("daysBetween", daysBetween);
                    var html = template.render('details-tpl', res);
                    //秒杀倒计时

                    if (data.result.seckilling_countup) {
                        achieveTime(data.result.seckilling_countup);
                    } else {
                        if (data.result.seckilling) {
                            achieveTime(data.result.seckilling.countdown);
                        }
                    }



                    $('#details').html(html);

                    // 轮播
                    var mySwiper = new Swiper('.swiper-container', {
                        autoplay: 6000,
                        effect: 'fade',
                        fade: {
                            crossFade: true,
                        },
                        pagination: '.swiper-pagination'
                    });

                    //设置微信分享信息

                    wx_link = location.href.split('#')[0];
                    FL.wxShare(res.goods_name, res.goods_desc, wx_link, res.goods_images[0]);

                    $("img").lazyload();

                    bindEvent(res);
                    addressShow(res);

                    //优惠套装
                    hui(goods_id);

                    if (!FL.mid) {
                        //定位
                        var province = getcookie('province');
                        if (province == "") {
                            function getCityByBaiduCoordinate(rs) {
                                var province = rs.addressComponents.province.slice(0, rs.addressComponents.province.length - 1);
                                var city = rs.addressComponents.city.slice(0, rs.addressComponents.city.length - 1);
                                var district = rs.addressComponents.district;
                                $('#area').html(province + city + district);
                                addcookie('province', province);
                                addcookie('city', city);
                                addcookie('district', district);

                                if (res.area_list != '') {
                                    for (var k in res.area_list) {
                                        if (res.area_list[k].indexOf(province) >= 0) {

                                            $('#area').html(province + city + district);

                                            area_id = k;

                                            area_money(area_id, res.transport_id);
                                            break;
                                        }
                                        if (res.not_deliver_areas.indexOf(province) >= 0) {
                                            $('.not_deliver_areas').show();
                                            $('.not-deliver-area').hide();
                                        } else {
                                            $('.not_deliver_areas').hide();
                                            $('.not-deliver-area').show();
                                        }

                                    }
                                }

                            }

                            getGps();



                            function getGps() {
                                var geolocation = new BMap.Geolocation();
                                geolocation.getCurrentPosition(function(r) {
                                    if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                                        var x = r.point.lng;
                                        var y = r.point.lat;
                                        var ggPoint = new BMap.Point(x, y);
                                        var geoc = new BMap.Geocoder();
                                        geoc.getLocation(ggPoint, getCityByBaiduCoordinate);
                                    } else {}
                                }, {
                                    enableHighAccuracy: true
                                })
                            }

                        }
                    } else {
                        province = unescape(province);
                        if (res.area_list != '') {
                            for (var k in res.area_list) {
                                if (res.area_list[k].indexOf(province) >= 0) {
                                    var district = unescape(getcookie('district'));
                                    var city = unescape(getcookie('city'));
                                    $('#area').html(province + city + district);

                                    area_id = k;

                                    area_money(area_id, res.transport_id);
                                    break;
                                }
                                if (res.not_deliver_areas.indexOf(province) >= 0) {
                                    $('.not_deliver_areas').show();
                                    $('.not-deliver-area').hide();
                                } else {
                                    $('.not_deliver_areas').hide();
                                    $('.not-deliver-area').show();
                                }
                            }
                        }

                    }

                } else if (data.error == '0004') {

                    layer.msg('此商品不存在或者已下架，看看其他商品吧！', {
                        time: 3000
                    });
                    setTimeout(function() {
                        location.href = "../index/index.html";
                    }, 4500);

                }

            }

        });
    }





    function bindEvent(res) {

        /****准备删除*****/
        // 物流
        //	    addcookie('transport_id', res.transport_id);

        // table切换
        //      $(".norms li").click(function(event) {
        //          $(this).addClass('active').siblings('li').removeClass('active');
        //          $('.norms .content').eq($(this).index()).addClass('show').siblings('.content').removeClass('show');
        //      });
        /*****准备删除******/


        /**********头部table切换********/

        $('header h2').click(function(event) {
            var indexNum = $(this).index() - 1;

            $(this).addClass('active').siblings('h2').removeClass('active');

            $('.row>section').eq($(this).index() - 1).show().siblings('section').hide();

            if (indexNum == 1) {

                var goods_commonid = $('#pull_up').attr('goods_commonid');

                imageText('#details_info', goods_commonid);

            } else if (indexNum == 2) {




            }

        });


        //购物车数量
        FL.getGoodsNum({
            success: loadSuccess
        });

        function loadSuccess(data) {
            if (data && data.error == 0) {
                if (data.result.num != 0) {
                    if (data.result.num > 99) {
                        data.result.num = "99+";
                    }
                    var dom = '<span class="cart-num">' + data.result.num + '</span>';
                    $(".shop-icon").append(dom);
                    if (data.result.is_global == '1') {
                        $('.shoppingurl').prop('href', '../shopping/shopping_cart_global.html');
                    } else {
                        $('.shoppingurl').prop('href', '../shopping/shopping_cart_cn.html');
                    }
                }
            }
        }

        // 下拉图文详情
        $('#pull_up').click(function() {
            //	      $('header h2').eq(1).click();
            var goods_commonid = $('#pull_up').attr('goods_commonid');

            imageText('#details_info', goods_commonid);
        });
        $('#pull_up').click();
        //晒单评价
        $(".estimate,.com_list").click(function() {

            location.href = 'comment.html?goods_id=' + goods_id;

        });



        //图片加载
        $(".goods_comments img").lazyload();
        var me = this;
        $('#notice').click(function() {
            var me = this;

            //		 	$(this).hide();
            if ($(me).hasClass('down')) {
                $('#noticetxt').removeClass('overhideline1');
                $(me).removeClass('down').addClass('up');
                $(me).find('img').prop('src', '../../images/wap/detail/notice_up.png');
            } else {
                $('#noticetxt').addClass('overhideline1');
                $(me).removeClass('up').addClass('down');
                $(me).find('img').prop('src', '../../images/wap/detail/notice.png');
            }

        });

        $('#pictexttab li').click(function() {
            $(this).addClass('selectactive').siblings('li').removeClass('selectactive');
            $('.pictexttab').eq($(this).index()).show().siblings('.pictexttab').hide();

        })

        var height = $(window).height() - 50 - 38;
        $('.product_data').css('height', height + "px");









        // 佣金显示
        if_shoper = getcookie('if_shoper');
        if (!FL.mid || if_shoper == 0) {
            $('.commission_p').hide();
        } else {
            $('.commission_shoper').hide();
        }

        /*七天不退货*/
        //	    $('#icon-down-up').click(function(){
        //	    	if($('#icon-down-up').attr('class')=='icon-angle-down right-arrow'){
        //	    		$('.tableChange').slideDown(300);
        //	    	    $('#icon-down-up').attr('class','icon-angle-up right-arrow');
        //	        }else{
        //	    		$('.tableChange').slideUp(300);
        //	    	    $('#icon-down-up').attr('class','icon-angle-down right-arrow');
        //	        }
        //
        //	    });

        //百度商桥
        $('.store_baidusales').click(function() {
            res.store_baidusales ? location.href = ('store_baidusales.html?store_baidusales=' + res.store_baidusales) : layer.msg('商家不在线，请稍后联系');
        });

        // 地区三级联动
        $("#area").click(function() {
            if (res.area_list == '') {
                return false;
            } else {
                getProvinceBuy("#area", res);
            }

        });

        //税率
        var hs_rate = parseFloat(res.hs_rate);
        $('.tax_num').text(hs_rate * 10000 / 100 + '%');
        tax_tate = Math.ceil(hs_rate * 1000 * (res.goods_price) / 10) / 100;

        $('.tax_money').html((tax_tate <= 0) ? '￥ 0.00' : '￥' + tax_tate);
        //产品参数
        $('#product_data').click(function(event) {
            if (res.goods_attr) {
                $('.product_data').show();
            } else {
                layer.msg('暂未维护产品参数');
            }

        });
        $('.dataClose').click(function() {
            $(this).parents('.product_data').hide();

        });


        // 规格映射

        var array = [];
        //       var num_=$(".goods_spac").length;
        $('.goods_spac li').click(function() {
            $(".shop-input").val(1); //选中数量重置为1
            $(".sk-tips").text("");
            $(this).addClass('active').siblings("li").removeClass('active');
            if (res.goods_source > 0 && res.oversea_per_purchase_limit > 0) {
                var limit_price = parseFloat(res.goods_price) * 1;
                if (limit_price - res.oversea_per_purchase_limit <= 0) {
                    $('#limit_tip').hide();
                    $('#button_limit').hide();
                    $('#confirm').show();
                }
            }
            var spac_re = $(this).attr('spac_re');
            var indexnum = ($(this).parents(".goods_spaclist").index());
            array[indexnum] = spac_re;
            $(this).parents(".goods_spaclist").siblings(".goods_spaclist").each(function() {
                var indexnum = $(this).index();
                var spac_re = $(this).find("li.active").attr('spac_re');
                array[indexnum] = spac_re;
            });
            array.sort(function(a, b) {
                return a > b ? 1 : -1
            });
            goodsId = res.spec_relation[array.join("|")];
            selectStand(goodsId);
            parameter(res, goodsId);
        });

        //添加购物车
        var goods_source = res.goods_source; //商品来源
        $('.btn_true').click(function(event) {
            quantity = $('.shop-input').val();
            if (FL.store_id != "null") {
                var data = {
                    token: token,
                    goods_id: goodsId || goods_id,
                    quantity: quantity,
                    store_id: FL.store_id,
                    mid: mid,
                    flag: 'wap',
                    gc_area: goods_source,
                    resource_tags: resource_tags
                };
            } else {
                var data = {
                    token: token,
                    goods_id: goodsId || goods_id,
                    quantity: quantity,
                    mid: mid,
                    flag: 'wap',
                    gc_area: goods_source,
                    resource_tags: resource_tags
                };
            }
            addShopCar(data);
        });


        //直接添加购物车
        $('.button-highlight').click(function() {
            if (FL.token) {
                if (!res.spec_list) {
                    var quantity = 1;
                    if (FL.store_id != "null") {
                        var data = {
                            token: token,
                            goods_id: goods_id,
                            quantity: quantity,
                            store_id: FL.store_id,
                            mid: mid,
                            flag: 'wap',
                            gc_area: goods_source
                        };
                    } else {
                        var data = {
                            token: token,
                            goods_id: goods_id,
                            quantity: quantity,
                            mid: mid,
                            flag: 'wap',
                            gc_area: goods_source
                        };
                    }
                    addShopCar(data);
                } else {
                    $('#mask').show();
                    FL.addShade();
                    $('.nowhide').hide();
                    $('#confirm').addClass("none");
                    $('#confirm_cat').removeClass("none");
                    //	            $('body').css('overflow','hidden');
                    var scrollTop = $('body').scrollTop();
                    $('body').css({
                        'overflow': 'hidden',
                        'position': 'fixed',
                        'top': scrollTop * -1
                    });
                }



            } else {
                FL.logLogin();
            }

        });
        //直接立即购买
        $('.buy .buynow').click(function() {
            //      	if(FL.token){
            //      	var href = '../order/order_confirmation.html?if_cart=0&area='+res.goods_source;
            //      	var quantity =1;
            //              if(res.sale_stop==0){
            //              	((res.goods_storage-quantity)>=0)?location.href = (href+'&cart_info='+ goods_id+'|'+quantity):layer.msg('库存不足');
            //              }else if(res.sale_stop==1){
            //              	layer.msg('商品即将发售，敬请期待！');
            //              }
            //      	}else{
            //      		location.href='../login/login.html?goods_id='+goods_id;
            //      	}
            if (FL.token) {
                $('#mask').show();
                FL.addShade();
                $('.nowhide').hide();
                $('#confirm_cat').addClass("none");
                $('#confirm').removeClass("none");
                //	            $('body').css('overflow','hidden');
                var scrollTop = $('body').scrollTop();
                $('body').css({
                    'overflow': 'hidden',
                    'position': 'fixed',
                    'top': scrollTop * -1
                });

            } else {
                /*location.href='../login/login.html?goods_id='+goods_id;*/
                FL.logLogin();
            }

        });



        parameter(res, goodsId);

        /*税费弹出层*/
        $('.tax_click').click(function() {
            $('.tax_rate').show();
            $('.tax_rate').addClass('animated slideInUp');
            FL.addShade();
            //          FL.closeDiv('.tax_rate', 'hide');
        });
        $('.tax_close').click(function() {
            FL.removeShade();
            FL.closeDiv('.tax_rate', 'hide');
            $('.tax_rate').hide();
        });

        /* 规格弹出层 */
        /* 规格弹出层 */
        $('#standard').click(function() {
            $('#mask').show();
            $('#mask').addClass('animated slideInUp');
            FL.addShade();
            $('.nowhide').show();
            $('#confirm').addClass("none");
            $('#confirm_cat').addClass("none");
            //          $('body').css('overflow','hidden');
            $('body').css({
                'overflow': 'auto',
                'position': 'static',
                'top': 'auto'
            });

        });

        //      $('.button-highlight').click(function() {
        //          $('#mask').show();
        //          $('#mask').addClass('animated slideInUp');
        //          FL.addShade();
        //
        //          $('#confirm').addClass("buytrue");
        //
        //          //添加购物车
        //	        var goods_source = res.goods_source;//商品来源
        //	        $('#mask .buytrue').click(function(event) {
        //	        	quantity = $('.shop-input').val();
        //	        	if(FL.store_id!="null"){
        //	            	var data =  {token: token,goods_id: goodsId || goods_id,quantity: quantity,store_id: FL.store_id,mid: mid,flag: 'wap',gc_area: goods_source };
        //	           	}else{
        //	           		var data =  {token: token,goods_id: goodsId || goods_id,quantity: quantity,mid: mid,flag: 'wap',gc_area: goods_source };
        //	           	}
        //	           	addShopCar(data);
        //	           	$('#confirm').removeClass("buytrue");
        //	        });
        //      });

        $(".goods-assess .com_list:last-child").css('border', '0');




        $('.de_close').click(function() {
            FL.removeShade();
            FL.closeDiv('#mask', 'hide');
            $('#mask').hide();
            //  	    $('body').css('overflow','auto');
            $('body').css({
                'overflow': 'auto',
                'position': 'static',
                'top': 'auto'
            });
            try {
                $('#confirm').removeClass("buytrue buyTrue");

            } catch (e) {

            }

        });

        // 添加、取消收藏
        // 判断是否收藏
        var flag = true;
        addcookie('flag', true);
        if (res.if_fav === 1) {
            $('#goods_collect img').prop('src', '../../images/wap/detail/goodsdetail4.png');
            $('#goods_collect img').addClass('heart').removeClass('heart-empty');
            addcookie('flag', false);
        }

        $('#goods_collect').click(function(event) {
            flag = getcookie('flag');
            if (FL.token) {
                flag == 'true' ? addCollect() : delCollect();
            } else {
                /* location.href='../login/login.html?goods_id='+goods_id;*/
                FL.logLogin();
            }


        });





        /**数量加减**/
        var quantity, goods_storage;
        //初始化库存
        $('#goods_storage').text(parseInt($('#goods_storage').text()));
        if (res.goods_source > 0 && res.oversea_per_purchase_limit > 0) {
            quantity = parseInt($('.shop-input').val());
            var limit_price = parseFloat(res.goods_price) * quantity;
            if (limit_price - res.oversea_per_purchase_limit > 0) {
                $('#limit_tip').show();
                $('#button_limit').show();
                $('#confirm').hide();
            }
        }
        $('.sub').click(function(event) {
            quantity = parseInt($('.shop-input').val()) - 1;
            //                  goods_storage = parseInt($('#goods_storage').text());
            var price = $(".sk-limit").attr("price"); //miaosha price
            var top_limit = $(".sk-limit").attr("top_limit"); //miaosha xiangou
            var origin_price = $(".sk-limit").attr("origin_price"); //miaosha yuanjia
            var killing_stock = $(".sk-limit").attr("killing_stock");
            if (res.goods_source > 0 && res.oversea_per_purchase_limit > 0) {
                var limit_price = parseFloat(res.goods_price) * quantity;
                if (limit_price - res.oversea_per_purchase_limit <= 0) {
                    $('#limit_tip').hide();
                    $('#button_limit').hide();
                    $('#confirm').show();
                }
            }
            if (top_limit) {
                if (parseInt(quantity) <= parseInt(killing_stock)) {
                    if ((parseInt(quantity) <= parseInt(top_limit)) || top_limit == 0) {
                        $('#goods_storage').text(killing_stock);
                        $(".fh-price").text("￥" + price);
                        $("#mask-sk").show();
                        $(".sk-tips").text("");
                    }
                }
            }
            if (quantity <= 0) {
                layer.msg('选择不能小于1件');
                return false;
            } else {
                $('.shop-input').val(quantity + '');
                //                      $('#goods_storage').text(goods_storage + 1);
            }
            if (res.xianshi) {
                if (quantity < res.xianshi.lower_limit) {
                    $('.popbox .fh-price').text(res.goods_price);
                }
            }
        });

        $('.shop-input').keyup(function() {
            if ($(this).val() <= 1 || isNaN($(this).val())) {
                $(this).val(1);
            }
            var num = $(this).val();
            var price = $(".sk-limit").attr("price"); //miaosha price
            var top_limit = $(".sk-limit").attr("top_limit"); //miaosha xiangou
            var origin_price = $(".sk-limit").attr("origin_price"); //miaosha yuanjia
            var killing_stock = $(".sk-limit").attr("killing_stock");
            goods_storage = parseInt($('#goods_storage').text());
            var all_storage = $('#goods_storage').attr("all_storage"); //总库存
            if (top_limit) {
                if (parseInt(num) <= parseInt(killing_stock)) {
                    if (parseInt(num) > parseInt(top_limit) && top_limit != 0) {
                        $(".fh-price").text("￥" + origin_price);
                        $('#goods_storage').text(all_storage);
                        $("#mask-sk").hide();
                        $(".sk-tips").text("超出限购数量不享受优惠价");
                    } else {
                        $(".fh-price").text("￥" + price);
                        $('#goods_storage').text(killing_stock);
                        $("#mask-sk").show();
                        $(".sk-tips").text("");
                    }
                } else if (parseInt(num) > parseInt(killing_stock)) {
                    $(".fh-price").text("￥" + origin_price);
                    $('#goods_storage').text(all_storage);
                    $("#mask-sk").hide();
                    if (parseInt(killing_stock) < parseInt(top_limit) || top_limit == 0) {
                        $(".sk-tips").text("大于秒杀库存不享受优惠价");
                    } else {
                        $(".sk-tips").text("超出限购数量不享受优惠价");
                    }
                }

            }
            if ($(this).val() - $('#goods_storage').text() > 0) {
                layer.msg('库存不足');
                $(this).val(parseInt($('#goods_storage').text()))
            };
        });

        //	                $('.shop-input').val()


        $('.add').click(function(event) {
            quantity = parseInt($('.shop-input').val()) + 1;
            goods_storage = parseInt($('#goods_storage').text());
            var price = $(".sk-limit").attr("price"); //miaosha price
            var top_limit = $(".sk-limit").attr("top_limit"); //miaosha xiangou
            var origin_price = $(".sk-limit").attr("origin_price"); //miaosha yuanjia
            var killing_stock = $(".sk-limit").attr("killing_stock");
            var all_storage = $('#goods_storage').attr("all_storage"); //有秒杀时的总库存

            if (res.goods_source > 0 && res.oversea_per_purchase_limit > 0) {
                var limit_price = parseFloat(res.goods_price) * quantity;
                if (limit_price - res.oversea_per_purchase_limit > 0) {
                    $('#limit_tip').show();
                    $('#button_limit').show();
                    $('#confirm').hide();
                }
            }

            if (goods_storage - quantity < 0 && quantity > all_storage) {
                layer.msg('库存不足');
                return false;
            } else {
                //               $('#goods_storage').text(goods_storage - 1);
            }
            $('.shop-input').val(quantity + '');

            if (top_limit) {
                if (parseInt(quantity) <= parseInt(killing_stock)) {
                    if (quantity > top_limit && top_limit != 0) {
                        $(".fh-price").text("￥" + origin_price);
                        $('#goods_storage').text(all_storage);
                        $("#mask-sk").hide();
                        $(".sk-tips").text("超出限购数量不享受优惠价");
                    }
                } else if (parseInt(quantity) > parseInt(killing_stock)) {
                    $(".fh-price").text("￥" + origin_price);
                    $('#goods_storage').text(all_storage);
                    $("#mask-sk").hide();
                    if (parseInt(killing_stock) < parseInt(top_limit)) {
                        $(".sk-tips").text("大于秒杀库存不享受优惠价");
                    }
                } else {
                    $(".sk-tips").text("");
                }
            }

            if (res.xianshi) {
                if (quantity >= res.xianshi.lower_limit) {
                    $('.popbox .fh-price').text(res.xianshi.price);
                }
            }
        });

        //包邮
        $("#store_free_freight").click(function() {

            $("#free").show();
        });
        $(".freeClose").click(function() {

            $("#free,#nofree").hide();
        });


        //不包邮

        $("#store_nofree_freight").click(function() {

            $("#nofree").show();
        });
        //满送
        //		$(".mansongclick").click(function(){
        //			$('#mansongmask').show();
        //		});
        //		$(".mansongClose").click(function(){
        //			$('#mansongmask').hide();
        //		});
        //限时
        if (res.xianshi) {
            var maxtime = res.xianshi.countdown;
            var tim = setInterval(function() {
                maxtime--;
                var days = Math.floor(maxtime / 86400);
                var hours = Math.floor((maxtime % 86400) / 3600);
                var minutes = Math.floor(((maxtime % 86400) % 3600) / 60);
                var seconds = Math.floor(((maxtime % 86400) % 3600) % 60);

                $('#countdown').text("还剩：" + days + "天" + hours + "小时" + minutes + "分" + seconds + "秒");
                if (maxtime == 0) {
                    $('#countdown').text("限时促销活动已结束");
                    clearInterval(tim);
                }
            }, 1000);
        }

        if (res.xianshi || res.mansong || res.store_free_freight_amount || (res.seckilling && res.seckilling.top_limit != 0)) {
            $('#marketing').show();
            $('.marketingempty').show();
        }

        $('#marketing .skip-link:last-child').removeClass('border-b');

        var offsettop = $("#pictexttab").offset().top;
        window.onscroll = function() {
            var scrollTop = $(window).scrollTop();

            if (scrollTop - 380 >= offsettop) {
                $('#pictexttab').addClass('picfixed');

            } else {
                $('#pictexttab').removeClass('picfixed');
            }


        }

        //地址列表
        $('#free_address').click(function() {
            $('.free-address').show();
            FL.addShade();
        });




        //商家服务说明
        //		$('#store_service').click(function(){
        //			$('body').css('overflow','hidden');
        //			$('#storeservice').show();
        //		});
        //		$('#storeservice,#storeserviceClose').click(function(){
        //			$('body').css('overflow','auto');
        //			$('#storeservice').hide();
        //		})

    }


    //三级联动函数
    function getProvinceBuy(dom, res) {
        var proStr = res.area_list;
        $("body .dqld_div").remove();
        var height = $(window).height();
        var newStr = new Array();
        newStr.push("<div class=\"dqld_div animated slideInRight\"><ul class='dqld_ul'>");
        for (var i in proStr) {
            var provinceName = proStr[i];
            newStr.push("<li area_id='" + i + "'>" + provinceName + "</li>");
        }
        newStr.push("</ul></div>");
        $("body").append(newStr.join(""));
        $(".dqld_div").css("height", height + "px");
        $("body").css("overflow", "hidden");

        FL.addShade();
        FL.closeDiv(".dqld_div", "remove");
        $('.dqld_ul li').click(function() {
            $(this).css('color', '#ff1f64');
            $('#area').html($(this).text());
            area_id = $(this).attr('area_id')
            $('#area').attr('area_id', area_id);

            setTimeout(function() {
                FL.removeShade();
                $(".dqld_div").hide();
                $("body").css("overflow", "auto");
            }, 500);

            area_money(area_id, res.transport_id);

        });
        $('.loading-shade').click(function() {
            $("body").css("overflow", "auto");
        });

    }

    //运费
    function area_money(area_id, transport_id) {
        $.ajax({
            type: "get",
            url: WapSiteUrl + "/api/index.php?act=common_goods&op=get_area_freight",
            data: {
                area_id: area_id,
                transport_id: transport_id,
                flag: 'wap'
            },
            dataType: 'json',
            success: function(data) {
                if (data && data.error === '0') {

                    data.result == 0.00 ? $('.area_money').text('卖家承担运费') : $('.area_money').text('￥' + data.result);
                }
            }
        });

    }

    //规格选择函数
    function selectStand(goods_id) {
        $.ajax({
            url: WapSiteUrl + '/api/index.php?act=common_goods&op=goods_spec_select',
            type: 'get',
            dataType: 'json',
            data: {
                'goods_id': goods_id,
                'flag': 'wap',
                mid: FL.mid
            },
            success: function(data) {
                if (data.error === '0') {

                    var res = data.result;
                    $('#spac_img').prop('src', res.goods_image + '!small');
                    $('#goods_storage').text(res.goods_storage);
                    if (res.xianshi) {
                        $('.popbox>div>.fh-price').text('￥' + res.xianshi.price);
                    } else {
                        $('.popbox>div>.fh-price').text('￥' + res.goods_price);
                    }

                    //是否是秒杀商品
                    if ((res.seckilling && (res.seckilling.top_limit != res.seckilling.purchased_num)) || (res.seckilling && res.seckilling.top_limit == 0)) {
                        var killing_stock = res.seckilling.killing_stock;
                        $('#goods_storage').text(killing_stock);
                        var origin_price = res.seckilling.origin_price;
                        var price = res.seckilling.price;
                        var top_limit = res.seckilling.top_limit;
                        var num = $(".shop-input").val();

                        $("#mask-sk").remove();
                        var secklling_div = '<div class="seckill mt5" id="mask-sk" >' +
                            '<img src="../../images/wap/app_miaosha.png" class="app-seckill">' +
                            '<span class="sk-limit" price="' + price + '" top_limit="' + top_limit + '" origin_price="' + origin_price + '" killing_stock="' + killing_stock + '">限购' + top_limit + '件</span></div>';
                        $("#mask_div").append(secklling_div);
                        if (num <= top_limit) {
                            $("#mask-sk").show();
                            $('.popbox>div>.fh-price').text('￥' + price);
                        } else {
                            $("#mask-sk").hide();
                            $('.popbox>div>.fh-price').text('￥' + origin_price);
                        }
                    } else {
                        $("#mask-sk").remove();
                    }

                }
            }
        });
    }

    // 传递给订单核实的参数
    function parameter(res, goodsId) {
        var href = '../order/order_confirmation.html?if_cart=0&area=' + res.goods_source;
        if (goodsId) {
            var goodsspacid = goodsId;
        } else {
            var goodsspacid = goods_id;
        }
        //if or not miaosha
        var $sk = $(".sk-limit");

        $('.buy .nowbuy,#confirm').click(function(event) {
            if (FL.token) {
                var quantity = $('.shop-input').val();
                var now_storage = $("#goods_storage").text();
                if (res.sale_stop == 0) {
                    if (now_storage - quantity < 0) {
                        layer.msg("库存不足");
                    } else {
                        addcookie("cartGoodsNum", quantity);
                        if ($sk.length != 0 && $sk.parent().is(":visible")) {
                            location.href = href + '&cart_info=' + goodsspacid + '|' + quantity + '&miaosha=' + goods_id + "&resource_tags=" + resource_tags;
                        } else {
                            location.href = href + '&cart_info=' + goodsspacid + '|' + quantity + '&miaosha=' + "&resource_tags=" + resource_tags;
                        }
                    }

                } else if (res.sale_stop == 1) {
                    layer.msg('商品即将发售，敬请期待！');
                }
            } else {
                /*location.href='../login/login.html?goods_id='+goods_id+"&resource_tags="+resource_tags;*/
                FL.logLogin();
            }

        });


    }

    //添加收藏
    function addCollect() {
        $.ajax({
            url: WapSiteUrl + '/api/index.php?act=buyer_favorite&op=add_favorites',
            type: 'post',
            dataType: 'json',
            data: {
                token: token,
                fid: goods_id,
                mid: mid,
                type: 'goods',
                flag: 'wap'
            },
            success: function(data) {
                if (data.error === '0') {
                    $('#goods_collect img').prop('src', '../../images/wap/detail/goodsdetail4.png');
                    $('#goods_collect img').addClass('heart').removeClass('heart-empty');
                    layer.msg('收藏商品成功');
                } else if (data.error === '0008') {

                    /*location.href='../login/login.html?goods_id='+goods_id;*/
                    FL.logLogin();

                } else {
                    layer.msg(data.msg);
                }

                addcookie('flag', false);
            },
            error: function() {
                layer.msg('收藏商品失败');
                addcookie('flag', true);
            }
        });
    }
    //删除收藏
    function delCollect() {
        $.ajax({
            url: WapSiteUrl + '/api/index.php?act=buyer_favorite&op=delete_favorites',
            type: 'post',
            dataType: 'json',
            data: {
                token: token,
                fid: goods_id,
                mid: mid,
                type: 'goods',
                flag: 'wap'
            },
            success: function(data) {
                if (data.error === '0') {
                    $('#goods_collect img').prop('src', '../../images/wap/detail/goodsdetail3.png');
                    $('#goods_collect img').addClass('heart-empty').removeClass('heart');

                    layer.msg('已取消收藏');
                } else if (data.error === '0008') {

                    FL.logLogin();

                } else {
                    layer.msg(data.msg);
                }

                addcookie('flag', true);
            },
            error: function() {
                layer.msg('取消收藏失败');
                addcookie('flag', false);
            }

        });
    }
    //添加购物车
    function addShopCar(data) {
        $("#goods-details #addOne").hide();
        $.ajax({
            url: WapSiteUrl + '/api/index.php?act=buyer_cart&op=add',
            type: 'get',
            dataType: 'json',

            data: data,

            success: function(data) {

                if (data.error === '0') {
                    FL.closeDiv('#mask', 'hide');
                    layer.msg('添加购物车成功');
                    $('#mask').hide();
                    $('.loading-shade').hide();
                    $("#goods-details #addOne").show();
                    FL.getGoodsNum({
                        success: loadSuccess
                    });

                    function loadSuccess(data) {
                        if (data && data.error == 0) {
                            if (data.result.num > 99) {
                                data.result.num = "99+";
                            }
                            var dom = '<span class="cart-num">' + data.result.num || 0 + '</span>';
                            $(".shop-icon").append(dom);
                            if (data.result.is_global == '1') {
                                $('.shoppingurl').prop('href', '../shopping/shopping_cart_global.html');
                            } else {
                                $('.shoppingurl').prop('href', '../shopping/shopping_cart_cn.html');
                            }
                        }
                    }
                    $('body').css({
                        'overflow': 'auto',
                        'position': 'static',
                        'top': 'auto'
                    });

                } else if (data.error === '0008') {

                    /*location.href='../login/login.html?goods_id='+goods_id;*/
                    FL.logLogin();

                } else if (data.error === '2001008') {
                    FL.closeDiv('#mask', 'hide');
                    $('#mask').hide();
                    $('.loading-shade').hide()
                }
            },
            error: function(xhr) {

            }
        });
    }

    //图文详情
    function imageText(id, goods_commonid) {
        $.ajax({
            url: WapSiteUrl + '/api/index.php?act=common_goods&op=get_goods_graphic',
            type: 'get',
            dataType: 'json',
            data: {
                goods_commonid: goods_commonid,
                flag: 'wap'
            },
            success: function(data) {
                if (data.error === '0') {
                    if (typeof(data.result.pc_body) == 'string') {
                        $(id).html(data.result.pc_body);
                    } else {
                        $(id).empty();
                        for (var i = 0; i < data.result.pc_body.length; i++) {
                            if (data.result.pc_body[i].type == 'image') {
                                $(id).append('<img src="' + data.result.pc_body[i].value + '" >');
                            } else {
                                $(id).append('<p>' + data.result.pc_body[i].value + '</p>');
                            }

                        }

                    }
                    if (data.result.goods_source > 0) {

                        $(id).prepend('<img src="../../images/wap/goodsgraphic.png" alt="image">');

                    }

                }
            }
        });
    }

    // 商品评论列表
    function commentList(type, curpage, appendtype) {
        $.ajax({
            url: WapSiteUrl + '/api/index.php?act=common_goods&op=get_goods_comments',
            type: 'get',
            dataType: 'json',
            data: {
                goods_id: goods_id,
                num: num,
                curpage: curpage,
                flag: 'wap',
                type: type
            },
            success: function(data) {

                if (data && data.error === '0') {
                    template.helper("daysBetween", daysBetween);
                    //评价头部
                    if (appendtype == 'yes') {
                        var html = template.render('details_comment_title_tpl', data.result);
                        $('#details_comment .details_comment-title').empty();
                        $('#details_comment .details_comment-title').html(html);

                        upRefresh(); //下拉加载
                    }
                    //当前评价标签显示
                    $('.details_comment_btn>button').eq(type).addClass('selected').siblings('button').removeClass('selected');
                    //评论为空 不显示当前标签样式
                    if (data.result.comments == '') {
                        $('.details_comment_btn>button').removeClass('selected');
                    }

                    $('#details_comment .focus-color').text(data.result.good_percent + "%");
                    $('#details_comment .span-right').text(data.result.all_count + "人评价");


                    //评价内容
                    var html = template.render('details_comment_tpl', data.result);
                    if (appendtype == 'no') {
                        $('#details_comment .goods-assess>ul').append(html);
                    } else {
                        $('#details_comment .goods-assess>ul').empty();
                        $('#details_comment .goods-assess>ul').html(html);
                    }

                    $("#details_comment img").lazyload();


                    //评价分类 有图无图好评差评
                    $('.details_comment_btn>button').click(function(event) {
                        type = $(this).index();
                        console.log(type);
                        commentList(type, 1, 'yes');
                        $(this).addClass('selected').siblings('button').removeClass('selected');
                    });


                }
            }
        });
    }
    //优惠套装
    function hui(goods_id) {
        $.ajax({
            type: "get",
            url: WapSiteUrl + "/api/index.php?act=common_goods&op=get_bundling_combo",
            data: {
                flag: "wap",
                goods_id: goods_id
            },
            dataType: "json",
            success: function(data) {
                if (data && data.error == 0) {

                    if (data.result.bundling) {
                        $('#marketing').show();
                        $('.onlyhui').show();
                        var num = data.result.bundling.length;
                        $("#hui .marketing span#suitnum").text(num);
                        $("#hui .marketing span#moneymax").text(data.result.bundling_save_money);

                        $("#hui a").click(function() {
                            location.href = "coupon.html?goods_id=" + goods_id;
                        });
                    }

                }
            }
        });
    }
    //  商品评论列表下拉加载
    function upRefresh() {
        $(window).scroll(function() {
            var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
            var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
            var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            if (scrollTop + clientHeight == htmlHeight) {
                var showNum = $("#details_comment .goods-assess>ul>li").length; //当前页面显示的个数
                curpage = showNum / 10 + 1; //上拉加载要显示的页数
                if (count != curpage && regu.test(curpage)) {
                    type = $('.details_comment_btn .selected').index();
                    if (type < 0) {
                        type = 0;
                    }
                    commentList(type, curpage, 'no');
                    count = curpage;
                } else {
                    return false;
                }
            }
        })
    }

    function addressShow(res) {

        $.ajax({
            type: "post",
            url: WapSiteUrl + "/api/index.php?act=buyer_delivery&op=get_address",
            data: {
                flag: "wap",
                mid: FL.mid,
                token: FL.token
            },
            dataType: "json",
            success: function(data) {
                if (data && data.error == 0) {
                    $('#free_address').removeClass("none");
                    var html = template("address-tpl", data);
                    $('.free-address').html(html);
                    if (data.result.length == 1) {
                        $('#area').text(data.result[0].area_info);
                    } else {
                        for (var d = 0; d < data.result.length; d++) {
                            if (data.result[d].is_default == 1) {
                                $('#area').text(data.result[d].area_info);
                                var province = data.result[d].area_info.split('')[0];
                                if (res.not_deliver_areas.indexOf(province) >= 0) {
                                    $('.not_deliver_areas').show();
                                    $('.not-deliver-area').hide();
                                } else {
                                    $('.not_deliver_areas').hide();
                                    $('.not-deliver-area').show();
                                }
                                break;
                            }
                        }
                    }




                    $('.free-address .de_close').click(function() {
                        $('.free-address').hide();
                        $('.loading-shade').remove();
                    });
                    $('#address-list div').click(function() {
                        $('.coin').remove();
                        $(this).append('<img src="../../images/wap/detail/coin.png" alt="" class="coin">');
                        var addprovince = $(this).find('.addressinfo').text();
                        $('#area').text(addprovince);
                        province = addprovince.split('')[0];
                        if (res.not_deliver_areas.indexOf(province) >= 0) {
                            $('.not_deliver_areas').show();
                            $('.not-deliver-area').hide();
                        } else {
                            $('.not_deliver_areas').hide();
                            $('.not-deliver-area').show();
                        }

                        $('.loading-shade').remove();
                        $('.free-address').hide();
                    });
                } else {
                    //定位
                    var province = getcookie('province');
                    if (province == "") {
                        function getCityByBaiduCoordinate(rs) {
                            var province = rs.addressComponents.province.slice(0, rs.addressComponents.province.length - 1);
                            var city = rs.addressComponents.city.slice(0, rs.addressComponents.city.length - 1);
                            var district = rs.addressComponents.district;
                            $('#area').html(province + city + district);
                            addcookie('province', province);
                            addcookie('city', city);
                            addcookie('district', district);

                            if (res.area_list != '') {
                                for (var k in res.area_list) {
                                    if (res.area_list[k].indexOf(province) >= 0) {

                                        $('#area').html(province + city + district);

                                        area_id = k;

                                        area_money(area_id, res.transport_id);
                                        break;
                                    }
                                    if (res.not_deliver_areas.indexOf(province) >= 0) {
                                        $('.not_deliver_areas').show();
                                        $('.not-deliver-area').hide();
                                    } else {
                                        $('.not_deliver_areas').hide();
                                        $('.not-deliver-area').show();
                                    }

                                }
                            }

                        }

                        getGps();



                        function getGps() {
                            var geolocation = new BMap.Geolocation();
                            geolocation.getCurrentPosition(function(r) {
                                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                                    var x = r.point.lng;
                                    var y = r.point.lat;
                                    var ggPoint = new BMap.Point(x, y);
                                    var geoc = new BMap.Geocoder();
                                    geoc.getLocation(ggPoint, getCityByBaiduCoordinate);
                                } else {}
                            }, {
                                enableHighAccuracy: true
                            })
                        }
                    } else {
                        province = unescape(province);
                        if (res.area_list != '') {
                            for (var k in res.area_list) {
                                if (res.area_list[k].indexOf(province) >= 0) {
                                    var district = unescape(getcookie('district'));
                                    var city = unescape(getcookie('city'));
                                    $('#area').html(province + city + district);

                                    area_id = k;

                                    area_money(area_id, res.transport_id);
                                    break;
                                }
                                if (res.not_deliver_areas.indexOf(province) >= 0) {
                                    $('.not_deliver_areas').show();
                                    $('.not-deliver-area').hide();
                                } else {
                                    $('.not_deliver_areas').hide();
                                    $('.not-deliver-area').show();
                                }
                            }
                        }
                    }
                }
            }
        });

    }

    //时间间隔
    function daysBetween(DateOne, DateTwo) {
        var OneMonth = DateOne.substring(5, DateOne.lastIndexOf('-'));
        var OneDay = DateOne.substring(DateOne.length, DateOne.lastIndexOf('-') + 1);
        var OneYear = DateOne.substring(0, DateOne.indexOf('-'));

        var TwoMonth = DateTwo.substring(5, DateTwo.lastIndexOf('-'));
        var TwoDay = DateTwo.substring(DateTwo.length, DateTwo.lastIndexOf('-') + 1);
        var TwoYear = DateTwo.substring(0, DateTwo.indexOf('-'));

        var cha = ((Date.parse(OneMonth + '/' + OneDay + '/' + OneYear) - Date.parse(TwoMonth + '/' + TwoDay + '/' + TwoYear)) / 86400000);
        return Math.abs(cha);
    }
    //秒杀倒计时
    function achieveTime(countdownTime) {
        clearInterval(timeDown);
        var time = countdownTime;
        if (time >= 0) {
            showTime(time);
            timeDown = setInterval(function() {
                --time;
                showTime(time);
                if (time == 0) {
                    clearInterval(timeDown);
                }
            }, 1000);
        } else {
            $(".sk-h").text('00');
            $(".sk-m").text('00');
            $(".sk-s").text('00');
        }
    }

    function showTime(t) {
        var h = Math.floor(t / 60 / 60 % 24);
        var m = Math.floor(t / 60 % 60);
        var s = Math.floor(t % 60);
        if (h < 10) {
            h = "0" + h
        }
        if (m < 10) {
            m = "0" + m
        }
        if (s < 10) {
            s = "0" + s
        }
        $(".sk-h").text(h);
        $(".sk-m").text(m);
        $(".sk-s").text(s);
    }
    var goodsDetail = function() {
        this.onLoad = function() {
            loadGoods();
        }
    }

    Global.Goods = Global.Goods || {};
    Goods.goodsDetail = new goodsDetail();



}(this)
