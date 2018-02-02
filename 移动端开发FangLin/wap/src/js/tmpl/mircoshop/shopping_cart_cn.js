/*************购物车*****************/ ! function(Global) {
    ImgFormat(); //图片格式
    var cart_info = "",
        miaosha = "",
        num = 10,
        curpage = 1,
        count = 0,
        stc_id = 0,
        order_num = 2, //排序规则(商城商品用)
        sort_num = 3,
        s_order_num = 1, //店铺首页用
        s_sort_num = 0,
        // regu = /^-{0,1}[0-9]{1,}$/, //判断是否是整数;
        store_id = GetQueryString("store_id");
    var empty_cart = '<section class="adr-header" style="top:0px !important">' +
        '<img class="adr-img mt50" src="../../images/wap/Esearch.png" />' +
        '<div class="adr-tips color9">购物车空空的!</div>' +
        '<div class="btns">' +
        '<a href="../index/index.html" class="button button-block  empty-btn pull-left">随便逛逛</a>' +
        '<a href="../member/history_shop.html?index=0" class="button button-block  empty-btn pull-right">查看收藏</a>' +
        '</div>' +
        '</section>';

    function loadGoods() {
        $.ajax({
            type: 'get',

            url: WapSiteUrl + "/api/index.php?act=buyer_cart&op=list",

            data: {
                mid: FL.mid,
                type: "db",
                flag: "wap",
                gc_area: 0,
                token: FL.token
            },

            dataType: 'json',

            success: function(data) {
                if (data && data.error == "0") {
                    var dom = template.render("goods_cn", data);
                    $("#cart_cn").empty();
                    $("#cart_cn").html(dom);
                    //判断是否符合秒杀
                    judgeSeckill();
                    console.log(data);

                    if (data.result.store_cart_list.length == 0) {
                        $(".bottom-frame").hide();
                    }
                    if ($(".store_goods").length != 0) {
                        $("#edit").show(); //是否显示编辑按钮
                    }
                    loadLikeGoods();
                    //满赠数据存入cookie
                    if (data.result.mansong) {
                        addcookie("manzeng", JSON.stringify(data.result.mansong));
                    }
                    //任选数据存入cookie
                    if (data.result.manselect_info) {
                        sessionStorage.setItem("manselect_info", JSON.stringify(data.result.manselect_info));
                    }
                    //商品-
                    $(".sub").click(subGoods);
                    //商品+
                    $(".add").click(addGoods);
                    //手动输入数量
                    $(".num").keyup(modifyNum);
                    //单个商品选中取消
                    //$(".single").click(singleGoods);
                    $("#shopping").on("click", ".single", singleGoods);
                    //所有商品选中取消
                    $(".all").click(allGoods);
                    //店铺所有商品选中取消
                    $(".store").click(storeGoods);
                    //单个商品删除
                    $(".close").click(function() {
                        var me = this;
                        dialogDelete(function() {
                            deleteGoods(me)
                        });
                    });
                    //为已下架商品添加移除事件
                    removeUnderGooods();
                    //购物车为空时底部添加轮播
                    calculatePrice();
                    //优惠活动点击事件
                    //sec_click();
                    //包邮点击事件
                    $(".post").click(postClick);
                    //满送点击事件
                    $(".send").click(sendClick);
                    //计算店铺满送产品

                } else if (data && data.error == 0008) {

                    FL.logLogin();
                }
            },
            error: function(xhr) {

            }
        });
    }

    function singleGoods() {
        var me = this;
        chooseGoods(me, "single");
        calculatePrice();

    }

    function allGoods() {
        var me = this;
        chooseGoods(me, "all");
        calculatePrice();
    }

    function storeGoods() {
        var me = this;
        chooseGoods(me, "store");
        calculatePrice();
    }

    function chooseGoods(self, type) {
        if (type === "all") {
            $(self).hasClass("icon-ok-sign") ? cancelAll(self) : selectAll(self);
        } else if (type == "single") {
            $(self).hasClass("icon-ok-sign") ? cancelOne(self) : selectOne(self);
        } else {
            $(self).hasClass("icon-ok-sign") ? cancelStore(self) : selectStore(self)
        }
        haveGoods();


    }

    //点击全选
    function selectAll(self) {
        $(".single").attr("class", "icon-ok-sign single");
        $(".store").attr("class", "icon-ok-sign store");
        $(".all").attr("class", "icon-ok-sign all");
    }

    function cancelAll(self) {
        $(".single").attr("class", "icon-circle-blank single font-gray");
        $(".store").attr("class", "icon-circle-blank store font-gray");
        $(".all").attr("class", "icon-circle-blank all");
    }

    function selectOne(self) {
        $(self).attr("class", "icon-ok-sign single");
        var num = $(".icon-circle-blank.single.font-gray").length;
        if (num > 0) {
            $(".all").attr("class", "icon-circle-blank all");
        } else {
            $(".all").attr("class", "icon-ok-sign all");
        }
        var storeNum = $(self).parents(".store_goods").find(".single").length;
        var selectNum = $(self).parents(".store_goods").find(".icon-ok-sign.single").length;
        if (storeNum == selectNum) {
            $(self).parents(".store_goods").find(".store-title .store").attr("class", "icon-ok-sign store");
        } else {
            $(self).parents(".store_goods").find(".store-title .store").attr("class", "icon-circle-blank store font-gray");
        }
    }

    function cancelOne(self) {
        $(self).attr("class", "icon-circle-blank single font-gray");
        $(".all").attr("class", "icon-circle-blank all");
        $(self).parents(".store_goods").find(".store-title .store").attr("class", "icon-circle-blank store font-gray");
    }

    function selectStore(self) {
        $(self).attr("class", "icon-ok-sign store");
        $(self).parents(".store_goods").find(".container .single").attr("class", "icon-ok-sign single");
        var num = $(".icon-circle-blank.single.font-gray").length;
        if (num > 0) {
            $(".all").attr("class", "icon-circle-blank all");
        } else {
            $(".all").attr("class", "icon-ok-sign all");
        }
    }

    function cancelStore(self) {
        $(self).attr("class", "icon-circle-blank store font-gray");
        $(".all").attr("class", "icon-circle-blank all");
        $(self).parents(".store_goods").find(".container .single").attr("class", "icon-circle-blank single font-gray");
    }
    //单个删除产品
    function deleteGoods(self) {
        var me = self;
        var cart_id = $(me).parents(".container").attr("cart_id");
        $.ajax({
            type: 'get',
            url: WapSiteUrl + "/api/index.php?act=buyer_cart&op=del",
            data: {
                mid: FL.mid,
                token: FL.token,
                cart_id: cart_id,
                gc_area: 0,
                flag: "wap"
            },
            dataType: "json",
            success: function(data) {
                if (data && data.error == "0") {
                    var dom = $(me).parents(".store_goods");
                    $(me).parents(".container").next(".empty").remove();
                    $(me).parents(".container").remove();
                    var goods = dom.find(".container");
                    if (goods.length == 0) {
                        dom.remove();
                    }
                    calculatePrice(); //重新计算价格
                    ifEmpty();
                }

            }
        })
    }
    //购物车商品加减
    function addSub(self, type) {
        var top_limit = $(self).parents(".container").find(".goods-price").attr("top_limit"); //秒杀限购数量
        var goods_price = $(self).parents(".container").find(".goods-price").attr("goods_price"); //原价
        var killing_price = $(self).parents(".container").find(".goods-price").attr("killing_price"); //秒杀价
        var killing_stock = $(self).parents(".container").find(".goods-price").attr("killing_stock"); //秒杀库存
        var goods_storage = $(self).parents(".container").find(".goods-price").attr("goods_storage"); //库存

        var itParent = $(self).parent();
        var cart_id = $(itParent).attr("cart_id");
        var num = parseInt($(self).siblings("input").val());
        if (type === "add") {
            num = ++num;
            if (num > killing_stock && num > goods_storage) {
                layer.msg("库存不足");
                return false;
            }
            $(self).siblings("input").val(num);
            //	$($(self).parents(".container")[0]).find(".goods-price");
        } else {
            num <= 1 ? num = 1 : --num;
            $(self).siblings("input").val(num);
        }
        var stock = $(self).parents(".container").attr("stock"); //库存

        //是否库存不足
        if (killing_stock > stock) {

        } else if (stock && stock < num) {
            layer.msg("库存紧张,最多购买" + stock + "件哦!");
            $(self).siblings("input").val(stock);
            num = stock;
        }
        if ($(self).parents(".container").find(".goods-limit").length != 0) {
            var limit = $(self).parents(".container").find(".goods-limit").attr("limit"); //限购最少数量
            var limitPrice = $(self).parents(".container").find(".goods-limit").attr("limitPrice"); //限购价
            var price = $(self).parents(".container").find(".goods-limit").attr("price"); //原价

            //是否满足限购价条件
            if (num >= limit) {
                $(self).parents(".container").find(".goods-price").text("￥" + limitPrice);
            } else {
                $(self).parents(".container").find(".goods-price").text("￥" + price);
            }
        }
        //秒杀处理
        if (top_limit) {
            if (num > top_limit && top_limit != 0) {
                $(self).parents(".container").find(".goods-price").text("￥" + goods_price);
                $(self).parents(".container").find(".app-seckill").remove();
                $(self).parents(".container").find(".sk-limit").remove();
            } else {
                $(self).parents(".container").find(".goods-price").text("￥" + killing_price);
                if ($(self).parents(".container").find('.app-seckill').length == 0) {
                    $(self).parents(".container").find(".goods-price").after('<img src="../../images/wap/app_miaosha.png" class="app-seckill" /><span class="sk-limit">限购' + top_limit + '件</span>');
                }
            }

        }

        updateNum(self, cart_id, num);
        calculatePrice();
    }
    //手动输入数量
    function modifyNum(self) {
        var me = self;
        if ($(me.target).val() <= 1 || isNaN($(me.target).val())) {
            $(me.target).val(1);
        }
        var itParent = $(me.target).parent();
        var cart_id = $(itParent).attr("cart_id");
        var num = parseInt($(me.target).val());
        var stock = $(me.target).parents(".container").attr("stock");

        var top_limit = $(me.target).parents(".container").find(".goods-price").attr("top_limit"); //秒杀限购数量
        var goods_price = $(me.target).parents(".container").find(".goods-price").attr("goods_price"); //原价
        var killing_price = $(me.target).parents(".container").find(".goods-price").attr("killing_price"); //秒杀价
        var killing_stock = $(me.target).parents(".container").find(".goods-price").attr("killing_stock"); //秒杀库存
        var goods_storage = $(me.target).parents(".container").find(".goods-price").attr("goods_storage"); //库存

        if (num > killing_stock && num > goods_storage) {
            layer.msg("库存不足");
            $(me.target).val(1);
            return false;
        }
        if (killing_stock > stock) {

        } else if (stock && stock < num) {
            layer.msg("库存紧张,最多购买" + stock + "件哦!");
            $(me.target).val(stock);
            num = stock;
        }
        if ($(me.target).parents(".container").find(".goods-limit").length != 0) {
            var limit = $(me.target).parents(".container").find(".goods-limit").attr("limit"); //限购最少数量
            var limitPrice = $(me.target).parents(".container").find(".goods-limit").attr("limitPrice"); //限购价
            var price = $(me.target).parents(".container").find(".goods-limit").attr("price"); //原价

            //是否满足限购价条件
            if (num >= limit) {
                $(me.target).parents(".container").find(".goods-price").text("￥" + limitPrice);
            } else {
                $(me.target).parents(".container").find(".goods-price").text("￥" + price);
            }
        }
        //秒杀处理
        if (top_limit) {
            if (num > top_limit && top_limit != 0) {
                $(me.target).parents(".container").find(".goods-price").text("￥" + goods_price);
                $(me.target).parents(".container").find(".app-seckill").remove();
                $(me.target).parents(".container").find(".sk-limit").remove();
            } else {
                if ($(me.target).parents(".container").find(".app-seckill").length == 0) {
                    $(me.target).parents(".container").find(".goods-price").text("￥" + killing_price);
                    $(me.target).parents(".container").find(".goods-price").after('<img src="../../images/wap/app_miaosha.png" class="app-seckill" /><span class="sk-limit">限购' + top_limit + '件</span>');
                }
            }

        }
        updateNum(me, cart_id, num);
        calculatePrice();
    }
    //修改购物车数量
    function updateNum(self, cart_id, num) {
        $.ajax({

            url: WapSiteUrl + "/api/index.php?act=buyer_cart&op=update",

            type: "get",

            data: {
                token: FL.token,
                cart_id: cart_id,
                quantity: num,
                mid: FL.mid,
                flag: "wap",
                gc_area: 0
            },

            dataType: "json",

            success: function(data) {

                if (data && data.error == "0") {


                } else {
                    layer.msg(data.msg);
                }

            }

        });
    }
    //点击数量+1
    function addGoods() {
        var me = this;
        addSub(me, "add");
    }
    //点击数量-1
    function subGoods() {
        var me = this;
        addSub(me, "sub");
    }
    //
    function calculatePrice() {
        var goodsNum = $(".icon-ok-sign.single");
        var countNum = 0;
        //该店铺下只有失效商品时阻止结算
        if (goodsNum.length == 0) {
            $("#settle").attr("class", "btn-unshopping");
        }
        var totalPrice = parseFloat("0.00");
        for (var i = 0; i < goodsNum.length; i++) {
            var parent = $(goodsNum[i]).parent();
            var price = parent.find(".goods-price").text().slice(1);
            var num = parent.find(".num").val();
            if (parent.parents(".container").find(".some-div").length != 0) {
                var partNum = parent.parent().find(".some-div").length * num;
                countNum = countNum + partNum;
            } else {
                countNum += parseInt(num);
            }
            totalPrice += parseFloat(price * num);
        }
        addcookie("cartGoodsNum", countNum);
        $(".marker").text("共 " + countNum + " 件");

        //计算每个店铺的总金额
        try {
            calculateStore(totalPrice);
        } catch (e) {}
    }
    //计算每个店铺的总金额
    function calculateStore(totalAllPrice) {
        var storeList = $(".store_goods");
        for (var i = 0; i < storeList.length; i++) {
            var countNum = 0;
            var totalPrice = parseFloat("0.00"),
                manselectTotalPrice = parseFloat("0.00"),
                youhuiPrice = 0;
            var $icon = $(storeList[i]).find(".icon-ok-sign");
            var $contain = $icon.parents(".container.valid");

            /**
             * @content 任选活动
             * @author  ljz
             * @date    20160822
             **/
            var manselect_info = JSON.parse(sessionStorage.getItem('manselect_info'));
            try {
                var objmanselect = manselect_info[$(storeList[i]).find('.manselect').attr('store_id')].manselect_rules;
            } catch (e) {
                var objmanselect = [];
            }



            var renxuan_num = 0,
                numman = 0;
            for (var j = 0; j < $contain.length; j++) {
                if ($($contain[j]).attr('goods_activity_state') == 1) {
                    num = $($contain[j]).find(".num").val();
                    renxuan_num += parseFloat(num);
                }
            }
            var $sendFullSpan = $(storeList[i]).find(".manselect .send-full-span");
            for (var l = 0; l < objmanselect.length; l++) {
                if (objmanselect[l].manselect_nums - renxuan_num > 0) {
                    if (l > 0) {
                        $sendFullSpan.text("已满足【" + objmanselect[l - 1].manselect_money + "元任选" + objmanselect[l - 1].manselect_nums + "件】");
                        break;
                    } else {
                        $sendFullSpan.text("再购" + (objmanselect[l].manselect_nums - renxuan_num) + "件立享【" + objmanselect[l].manselect_money + "元任选" + objmanselect[l].manselect_nums + "件】");
                        break;
                    }

                } else if (objmanselect[l].manselect_nums - renxuan_num == 0) {
                    $sendFullSpan.text("已满足【" + objmanselect[l].manselect_money + "元任选" + objmanselect[l].manselect_nums + "件】");
                    break;
                } else if (objmanselect[l].manselect_nums - renxuan_num < 0) {
                    $sendFullSpan.text("已满足【" + objmanselect[l].manselect_money + "元任选" + objmanselect[l].manselect_nums + "件】");
                }
            }



            var num;
            for (var j = 0; j < $contain.length; j++) {
                var price = $($contain[j]).find(".goods-price").text().slice(1);
                num = $($contain[j]).find(".num").val();
                totalPrice += parseFloat(price * num);

                /**
                 * @content 任选活动优惠价格
                 * @author  ljz
                 * @date    20160913
                 **/
                if (objmanselect.length > 0) {

                    if ($($contain[j]).attr('goods_activity_state') == 1) {

                        var manselectPrice = $($contain[j]).find(".goods-price").text().slice(1);
                        manselectnum = $($contain[j]).find(".num").val();

                        var manobj = $($contain[j]).parents('.store_goods').find('.manselect');

                        if (manobj.attr('manselect_nums1') && (parseFloat(numman) + parseFloat(manselectnum) - manobj.attr('manselect_nums1') >= 0)) {
                            manselectTotalPriceNew = manselectTotalPrice + parseFloat(manselectPrice * (manobj.attr('manselect_nums1') - numman));
                            youhuiPrice = manselectTotalPriceNew - manobj.attr('manselect_money1');
                        } else if (manobj.attr('manselect_nums0') && (parseFloat(numman) + parseFloat(manselectnum) - manobj.attr('manselect_nums0') >= 0)) {
                            manselectTotalPriceNew = manselectTotalPrice + parseFloat(manselectPrice * (manobj.attr('manselect_nums0') - numman));
                            youhuiPrice = manselectTotalPriceNew - manobj.attr('manselect_money0');
                        } else {
                            youhuiPrice = 0;
                        }

                        numman += parseFloat(manselectnum);
                        manselectTotalPrice += parseFloat(manselectPrice * manselectnum);

                    }

                }

                if (youhuiPrice && youhuiPrice > 0) {
                    totalPrice = totalAllPrice - youhuiPrice;
                } else {
                    totalPrice = totalAllPrice;
                }

                $("#total_price").html("￥" + totalPrice.toFixed(2));

            }




            $(storeList[i]).find(".div-active").parent().attr("total", totalPrice.toFixed(2));
            //店铺包邮钱
            var storeEnouth = $(storeList[i]).find(".post").attr("free_limit");
            if (storeEnouth && totalPrice >= storeEnouth) {
                $(storeList[i]).find(".post .send-full-span").text("已包邮");
            } else if (storeEnouth && totalPrice < storeEnouth) {
                var poorMoney = storeEnouth - totalPrice;
                $(storeList[i]).find(".post .send-full-span").text("还差" + poorMoney.toFixed(2) + "元包邮");
            }

        }
    }

    function bindEvent() {
        var referurl = document.referrer;
        if (referurl.indexOf("shopping_cart_global") < 0) {
            addcookie("shopping_cart", referurl);
            $(".goback").click(function() {
                javascript: history.back();
            })
        } else {
            $(".goback").click(function() {
                location.replace(unescape(getcookie("shopping_cart")));
            })
        }
    }
    //结算
    function settleGoods() {
        $("#shopping").on("click", ".btn-shopping", function() {
            var me = this;
            var selectGoods = $(".stockout").parents(".container").find(".icon-ok-sign.single");
            if ($(".stockout").length > 0 && selectGoods.length > 0) {
                layer.msg("所购商品库存不足");
            } else {
                loadGoodsMsg();

                location.href = "../order/order_confirmation.html?cart_info=" + cart_info + "&if_cart=1&area=0&miaosha=" + miaosha;
            }

        });
    }
    //判断是否还有选中的商品
    function haveGoods() {
        var num = $(".icon-ok-sign.single").length;
        if (num != 0) {
            $("#settle").attr("class", "btn-shopping");
            $('#delete').addClass('okdelete');
        } else {
            $("#settle").attr("class", "btn-unshopping");
            $('#delete').removeClass('okdelete');
        }

    }
    //计算购物车商品信息
    function loadGoodsMsg() {
        var data = $(".container .icon-ok-sign").parent(),
            cart_id, num;
        cart_info = "";
        miaosha = "";
        for (var i = 0; i < data.length; i++) {
            var isMs = $(data[i]).find(".app-seckill");
            if (isMs.length != 0) {
                var goods_id = $(data[i]).attr("goods_id");
                miaosha += goods_id + ",";
            }

            cart_id = $(data[i]).attr("cart_id");
            num = $(data[i]).find(".num").val();
            cart_info += cart_id + "|" + num + ","
        }
        cart_info = cart_info.substring(0, cart_info.length - 1);
        miaosha = miaosha.substring(0, miaosha.length - 1);
    }
    //加载猜你还喜欢
    function loadLikeGoods() {
        $.ajax({
            type: "get",
            url: WapSiteUrl + "/api/index.php?act=buyer_shopping&op=get_goods_scheme",
            data: {
                flag: "wap",
                type: 'cainixihuan',
                num: 4,
                curpage: 1
            },
            dataType: 'json',
            success: function(data) {
                if (data && data.error === '0') {
                    var html = template.render('like_goods', data);
                    $('#likeGoods').html(html);
                    //计算图片大小
                    var imgwidth = parseInt(($(".container").width() + 30) * 0.49);
                    $(".brand-ul img").css({
                        "height": imgwidth + "px"
                    });
                }
            }
        });
    }
    //还原
    $('#start').click(function() {
        ifEmpty();
    });

    //编辑功能
    $("#edit").click(function() {

        if (!$("#likeGoods").is(":hidden")) {
            //进入编辑状态
            $('#start,#delete').show();
            $("#likeGoods").hide();
            //				$("#edit").text("完成");
            $("#edit").hide();
            $('.goback').hide();
            $('#nav-show').hide();
            $(".num_opt").hide();
            $("#bottom").hide();
            $("#editBottom").show();
            $(".unuseful").attr("class", "icon-circle-blank single font-gray");
            cancelAll();
        }
        //			else{
        //				ifEmpty();
        //			}
    });
    //编辑页删除功能
    $("#delete").click(function() {
        var selectGoods = $(".icon-ok-sign.single");
        if (selectGoods.length != 0) {
            var cart_id_all = "";
            for (var i = 0; i < selectGoods.length; i++) {
                var cart_id_s = $(selectGoods[i]).parent().attr("cart_id");
                cart_id_all += cart_id_s + ",";
            }
            cart_id_all = cart_id_all.substring(0, cart_id_all.length - 1);
            dialogDelete(function() {
                editDelete(cart_id_all);
            });
        } else {
            layer.msg("您还没有选择商品哦!");
        }
    });
    //编辑状态下删除ajax
    function editDelete(cart_id) {
        $.ajax({
            type: 'get',
            url: WapSiteUrl + "/api/index.php?act=buyer_cart&op=del",
            data: {
                mid: FL.mid,
                token: FL.token,
                cart_id: cart_id,
                gc_area: 0,
                flag: "wap"
            },
            dataType: "json",
            success: function(data) {
                if (data && data.error == "0") {
                    var selectGoods = $(".icon-ok-sign.single");
                    for (var i = 0; i < selectGoods.length; i++) {
                        var store = $(selectGoods[i]).parents(".store_goods");
                        var dom = $(selectGoods[i]).parents(".container");
                        dom.next(".empty").remove();
                        dom.remove();
                        var goods = store.find(".container");
                        if (goods.length == 0) {
                            store.remove();
                        }
                    }
                    ifEmpty();
                }
            }
        })
    }
    //删除时判断时候还有商品
    function ifEmpty() {
        $(".unvalid .single").attr("class", "icon-circle-blank unuseful");

        if ($(".store_goods").length == 0) {
            $("#cart_cn").before(empty_cart);
            cancelAll();
        }
        if ($(".container").length == 0) {
            $("#edit").hide();
        } else {
            //				$("#edit").text("编辑");
            $("#edit").show();

        }

        $('#start,#delete').hide();
        $('.goback').show();
        $('#nav-show').show();
        $("#likeGoods").show();
        $("#bottom").show();
        $(".num_opt").show();
        $("#editBottom").hide();
        haveGoods();
        $('#delete').removeClass('okdelete');
        calculatePrice();

    }

    //移除已下架的商品
    function removeUnderGooods() {
        $(".fh-btn").click(function() {
            var me = this;
            var cart_id = $(me).parents(".container").attr("cart_id");
            $.ajax({
                type: 'get',
                url: WapSiteUrl + "/api/index.php?act=buyer_cart&op=del",
                data: {
                    mid: FL.mid,
                    token: FL.token,
                    cart_id: cart_id,
                    gc_area: 0,
                    flag: "wap"
                },
                dataType: "json",
                success: function(data) {
                    if (data && data.error == "0") {
                        var dom = $(me).parents(".store_goods");
                        $(me).parents(".container").next(".empty").remove();
                        $(me).parents(".container").remove();
                        var goods = dom.find(".container");
                        if (goods.length == 0) {
                            dom.remove();
                        }
                        layer.msg("已移除");
                        if ($(".store_goods").length == 0) {
                            $("#cart_cn").before(empty_cart);
                            $("#likeGoods").hide();
                            $("#bottom").hide();
                        }
                    }
                }
            })
        })
    }
    /*****************************************优惠活动相关**********************************************/
    //购物车优惠活动展开关闭处理
    function sec_click() {
        $(".sec-active").toggle(function() {
            var me = this;
            $(me).find(".title-i").attr("class", "icon-angle-down title-i");
            var dom = $(me).find(".div-active").show();
        }, function() {
            var me = this;
            var dom = $(me).find(".div-active").hide();
            $(me).find(".title-i").attr("class", "icon-angle-right title-i");
        });
    }
    //包邮点击
    function postClick() {
        var me = this;
        var store_id = $(me).attr("store_id");
        var free_limit = $(me).attr("free_limit");
        var total = $(me).attr("total");
        addcookie("storeTotal", total);
        location.href = "shopping_cart_pinkage.html?store_id=" + store_id + "&free_limit=" + free_limit + "&type=post";
    }
    //满送点击
    function sendClick() {
        var me = this;
        var store_id = $(me).attr("store_id");
        var total = $(me).attr("total");
        addcookie("storeTotal", total);
        location.href = "shopping_cart_pinkage.html?store_id=" + store_id + "&type=send";
    }

    function judgeSeckill() {
        var $price = $(".container.valid").find(".goods-price");
        for (var i = 0; i < $price.length; i++) {
            var top_limit = $($price[i]).attr("top_limit");
            var killing_price = $($price[i]).attr("killing_price");
            var goods_price = $($price[i]).attr("goods_price");
            var num = $($(".container.valid")[i]).find(".num").val();
            if (top_limit) {
                if (num > top_limit && top_limit != 0) {
                    $($price[i]).text("￥" + goods_price);
                    $($(".container.valid")[i]).find(".app-seckill").remove();
                    $($(".container.valid")[i]).find(".sk-limit").remove();
                }
            }
        }
    }

    function dialogDelete(load) {
        $('.fh-dialog').show();
        FL.addShade();
        $('#leftbtn').click(function() {
            $(".fh-dialog").hide();
            FL.removeShade();
        });
        $('#rightbtn').click(function() {
            $(".fh-dialog").hide();
            load();
            FL.removeShade();
        });
    }
    FL.getGoodsNum({
        success: loadSuccess
    });

    function loadSuccess(data) {
        if (data && data.error == 0) {
            if (data.result.is_global == '1') {
                $('.shoppingurl').attr('data-href', '../mircoshop/shopping_cart_global.html');
            } else {
                $('.shoppingurl').attr('data-href', '../mircoshop/shopping_cart_cn.html');
            }
        }
    }


    var Carts = function() {
        this.onLoad = function() {
            FL.judgeLogin();
            loadGoods();
            settleGoods();
        }
    }
    Global.Goods = Global.Goods || {};
    Goods.Carts = new Carts();
}(this);
