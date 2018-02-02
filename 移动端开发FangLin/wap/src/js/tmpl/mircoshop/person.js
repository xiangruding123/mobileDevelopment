! function(Global) {
    var firstShow = getcookie("firstShow");

    function loadData() {
        var mid = getcookie("mid");
        var token = getcookie("token");
        var if_shoper = getcookie("if_shoper");
        var talent_id = getcookie("talent_id");

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
                    $(".shoppingurl").after(dom);
                    if (data.result.is_global == '1') {
                        $('.shoppingurl').prop('href', '../mircoshop/shopping_cart_global.html');
                    } else {
                        $('.shoppingurl').prop('href', '../mircoshop/shopping_cart_cn.html');
                    }
                }
            }
        }

        //		合伙人判断
        $('.friend').on('click',function() {
            if (getcookie('if_shoper') == '1') {
                location.href = '../member/friend.html';
            } else if (getcookie('if_shoper') == '0') {
                location.href = '../weidian/small_store.html';
            }
        });

        $("#service").on('click',function() {
            location.href = "../refund/refund_lists.html";
            //layer.msg("退款售后正在完善中");
        });

        if (if_shoper == 1&&FL.mid) {
            $("#store").show();
        }

        if (talent_id > 0) {
            $('#daren').show();
            $('#person_time_list').on('click',function() {
                location.href = "../specialty/time_list.html?talent_id=" + talent_id;
            });
        }

        $('.circle-out').on('click',function() {
            if (!$(this).attr('href')) {
                FL.logLogin();
            };
        });
        $.ajax({
            type: 'post',
            url: WapSiteUrl + '/api/index.php?act=common_member&op=get_member_info',
            data: {
                token: token,
                mid: mid,
                flag: "wap"
            },
            dataType: 'json',
            success: function(data) {
                if (data.error === "0") {
                    $(".circle-out").attr("href", "../member/person_data.html");
                    var newImg = data.result.member_avatar || '../../images/wap/header.png';
                    $("#person-header").attr("style", "background:url(../../images/wap/person-loginbg.png) no-repeat !important");
                    $(".circle-out").html("<img src='" + newImg + "' class='header'>");
                    $("#person_name").text(data.result.member_nickname || data.result.member_name);
                    $("#person_point").text(data.result.member_exppoints || "");
                }
            },
            error: function(xhr) {

            }
        });
        $.ajax({
            type: 'post',
            url: WapSiteUrl + '/api/index.php?act=common_member&op=ucenter',
            data: {
                token: token,
                mid: mid,
                flag: "wap"
            },
            dataType: 'json',
            success: function(data) {
                if (data && data.error === "0") {
                    var obj = data.result;
                    $('.coll-nav .coll_nav_num').eq(0).text(obj.goods_favorite_count);
                    $('.coll-nav .coll_nav_num').eq(1).text(obj.store_favorite_count);
                    $('.coll-nav .coll_nav_num').eq(2).text(obj.microshop_favorite_count);
                    $('.coll-nav .coll_nav_num').eq(3).text(obj.talent_favorite_count);
                    $('.coll-nav .coll_nav_num').eq(4).text(obj.time_favorite_count);
                    obj.wait_paid_order_count == 0 ? "" : addPoint("#wait_pay", obj.wait_paid_order_count);
                    obj.wait_send_order_count == 0 ? "" : addPoint("#wait_send", obj.wait_send_order_count);
                    obj.wait_receive_order_count == 0 ? "" : addPoint("#wait_receive", obj.wait_receive_order_count);
                    obj.wait_evaluate_order_count == 0 ? "" : addPoint("#wait_evaluate", obj.wait_evaluate_order_count);
                    obj.service_order_count == 0 ? "" : addPoint("#service", obj.service_order_count);
                    $('#wallet .wallet_val').eq(0).text(obj.member_balance);
                    $('#wallet .wallet_val').eq(1).text(obj.coupon_count);
                    $('#wallet .wallet_val').eq(2).text(obj.member_points);

                    obj.wait_evaluate_order_count == 0 ? "" : $('.arrow_p_t').css("display", "block");

                    if (obj.batch_id && obj.bag_name) {

                        $('.bag_name').html(obj.bag_name);
                        FL.addShade();
                        $('.new-packet-img').show();

                    }

                    if (obj.newcoming_coupon_count) {
                        $('.ticketlink .wallet_val').after("<span class='newcoming_coupon_count'>" + obj.newcoming_coupon_count + "</span>");
                        $('.ticketlink').on('click',function() {
                            sessionStorage.setItem('bagtip', 'bagtip');
                            location.href = "../packet/coupon_list.html";
                        });

                    } else {
                        $('.ticketlink').on('click',function() {
                            location.href = "../packet/coupon_list.html";
                        });
                    }

                    $('.loading-shade,.new-packet-x').on('click',function() {
                        $('.new-packet-img,.loading-shade').hide();
                    });
                    $('#shop_type').on("click",function() {
                        if(!FL.mid){
                           FL.logLogin();
                        }else{


                        if (obj.shop_type == '2') {
                            location.href = "../mircoshop/home.html?shop_type=2";
                        } else if (obj.shop_type == '3') {
                            location.href = "../mircoshop/home.html?shop_type=3";
                        } else {
                            location.href = "../mircoshop/register.html";
                        }
                        }
                    })

                    if (obj.shop_type == '2') {
                           $('#shop_type span').html('大V红人店铺');
                     } else if (obj.shop_type == '3') {
                            $('#shop_type span').html('皇冠红人店铺');
                     }


                    FL.ajaxDate('get',get_shoper_info,{mid:FL.mid},function(data){
                         if(data&&data.error=="0"){
                           var res = data.result;
                           addcookie('shop_id',res.shop_id);
                         }
                     });


                }
            },
            error: function(xhr) {

            }
        });
    }
    //添加数量
    function addPoint(id, num) {
        if (num > 99) {
            num = 99;
        }
        $(id).append('<span class="num-icon">' + num + '</span>');
    }

    function bindEvent() {
        $("#closeBtn").click(function() {
            $(".foot-fix").hide();
            addcookie("firstShow", "no");
        });
    }

    function showFooter() {
        if (firstShow == "") {
            $(".foot-fix").show();
        }
    }

    var Person = function() {
        this.onLoad = function() {
            //			FL.judgeLogin();
            loadData();
            //	bindEvent();
            //	showFooter();
        }
    }




    Global.Member = Global.Member || {};
    Member.Person = new Person();

}(this);
