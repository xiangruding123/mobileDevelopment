/*************购物车*****************/
! function(Global) {
    ImgFormat();//图片格式
    var cart_info = "";
    var miaosha = "";
    var empty_cart = '<section class="adr-header" style="top:0px !important">' +
        '<img class="adr-img mt50" src="../../images/wap/Esearch.png" />' +
        '<div class="adr-tips color9">购物车空空的!</div>' +
        '<div class="btns">' +
        '<a href="../index/index_global.html" class="button button-block  empty-btn pull-left">随便逛逛</a>' +
        '<a href="../member/history_shop.html?index=0" class="button button-block  empty-btn pull-right">看看关注</a>' +
        '</div>' +
        '</section>';

    function loadGoods(type) {
        $.ajax({
            type: 'get',

            url: WapSiteUrl + "/api/index.php?act=buyer_cart&op=list",

            data: {
                mid: FL.mid,
                type: "db",
                flag: "wap",
                gc_area: 1,
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
                            deleteGoods(me);
                        });
                    });
                    //为已下架商品添加移除事件
                    removeUnderGooods();
                    //购物车为空时底部添加轮播
                    calculateAllPrice();

                    bindEvent();
                    //优惠活动点击事件
//                  sec_click();
                    //包邮点击事件
                    $(".post").click(postClick);
                    //满送点击事件
                    $(".send").click(sendClick);

                    // for (var i = 0;i < $('.store_goods').length;i++) {
                    //     calculatePrice($('.all').eq(i));
                    // }

                }
            },
            error: function(xhr) {

            }
        });
    }

    function singleGoods() {
        var me = this;
        chooseGoods(me, "single");
        calculatePrice(me);
    }

    function allGoods() {
        var me = this;
        chooseGoods(me, "all");
        calculatePrice(me);
    }

    function storeGoods() {
        var me = this;
        chooseGoods(me, "store");
        calculatePrice(me);
    }

    function chooseGoods(self, type) {
        var parent = $(self).parents(".store_goods");
        if (type === "all") {
            $(self).hasClass("icon-ok-sign") ? cancelAll(self, parent) : selectAll(self, parent);
        } else if (type == "single") {
            $(self).hasClass("icon-ok-sign") ? cancelOne(self, parent) : selectOne(self, parent);
        } else {
            $(self).hasClass("icon-ok-sign") ? cancelStore(self, parent) : selectStore(self, parent)
        }
        haveGoods(self);
    }

    //点击全选
    function selectAll(self, parent) {
        var single = parent.find(".single");
        var store = parent.find(".store");
        single.attr("class", "icon-ok-sign single");
        store.attr("class", "icon-ok-sign store");
        $(self).attr("class", "icon-ok-sign all");
    }

    function cancelAll(self, parent) {
        var single = parent.find(".single");
        var store = parent.find(".store");
        single.attr("class", "icon-circle-blank single font-gray");
        store.attr("class", "icon-circle-blank store font-gray");
        $(self).attr("class", "icon-circle-blank all");
    }

    function selectOne(self, parent) {
        var all = parent.find(".all");
        var store = parent.find(".store");
        $(self).attr("class", "icon-ok-sign single");
        var num = parent.find(".icon-circle-blank.single.font-gray").length;
        if (num > 0) {
            all.attr("class", "icon-circle-blank all");
        } else {
            all.attr("class", "icon-ok-sign all");
        }
        var storeNum = parent.find(".single").length;
        var selectNum = parent.find(".icon-ok-sign.single").length;
        if (storeNum == selectNum) {
            store.attr("class", "icon-ok-sign store");
        } else {
            store.attr("class", "icon-circle-blank store font-gray");
        }
    }

    function cancelOne(self, parent) {
        var all = parent.find(".all");
        var store = parent.find(".store");
        $(self).attr("class", "icon-circle-blank single font-gray");
        all.attr("class", "icon-circle-blank all");
        store.attr("class", "icon-circle-blank store font-gray");
    }

    function selectStore(self, parent) {
        var all = parent.find(".all");
        var single = parent.find(".single");
        $(self).attr("class", "icon-ok-sign store");
        single.attr("class", "icon-ok-sign single");
        var num = parent.find(".icon-circle-blank.single.font-gray").length;
        if (num > 0) {
            all.attr("class", "icon-circle-blank all");
        } else {
            all.attr("class", "icon-ok-sign all");
        }
    }

    function cancelStore(self, parent) {
        var all = parent.find(".all");
        var single = parent.find(".single");
        $(self).attr("class", "icon-circle-blank store font-gray");
        all.attr("class", "icon-circle-blank all");
        single.attr("class", "icon-circle-blank single font-gray");
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
                gc_area: 1,
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
                    var $me = dom.find(".container")[0];
                    calculatePrice($me); //重新计算价格
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
            //$($(self).parents(".container")[0]).find(".goods-price");
        } else {
            num <= 1 ? num = 1 : --num;
            $(self).siblings("input").val(num);
        }
        var stock = $(self).parents(".container").attr("stock");
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
        calculatePrice(self);
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
                gc_area: 1
            },

            dataType: "json",

            success: function(data) {

                if (data && data.error == "0") {


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
        calculatePrice(me.target);
    }

    //
    function calculatePrice(me) {
        var module = $(me).parents(".store_goods");
        var goodsNum = module.find(".icon-ok-sign.single");
        var countNum = 0,numman = 0;
        var totalPrice = parseFloat("0.00"),youhuiPrice= parseFloat("0.00"),manselectTotalPrice=0,
            dutyPrice = parseFloat("0.00"); //关税
        for (var i = 0; i < goodsNum.length; i++) {
            var parent = $(goodsNum[i]).parent();
            var price = parent.find(".goods-price").text().slice(1);
            var num = parent.find(".num").val();
            var hs_rate = parent.attr("hs_rate");
            if (parent.parents(".container.valid").find(".some-div").length != 0) {
                var partNum = parent.parent().find(".some-div").length * num;
                countNum = countNum + partNum;
            } else {
                countNum += parseInt(num);
            }

            /**
			     * @content 任选活动优惠价格
			     * @author  ljz
			     * @date    20160822
			     **/

          //  优惠价格   =  a


           if($($(goodsNum)[i]).parent().attr('goods_activity_state')==1){

	             var manselectPrice = $($(goodsNum)[i]).parent('.container').find(".goods-price").text().slice(1);
	             var manselectnum = parseFloat($($(goodsNum)[i]).parent('.container').find(".num").val());

	             var manobj = $(me).parents('.store_goods').find('.manselect');

               if(manobj.attr('manselect_nums1')&&(parseFloat(numman)+parseFloat(manselectnum)-manobj.attr('manselect_nums1')>=0)){
  					      	manselectTotalPriceNew = manselectTotalPrice+parseFloat(manselectPrice * (manobj.attr('manselect_nums1')-numman));
  					       	youhuiPrice = manselectTotalPriceNew-manobj.attr('manselect_money1');
  					   }else if(manobj.attr('manselect_nums0')&&(parseFloat(numman)+parseFloat(manselectnum)-manobj.attr('manselect_nums0')>=0)){
  					      	manselectTotalPriceNew = manselectTotalPrice+parseFloat(manselectPrice * (manobj.attr('manselect_nums0')-numman));
  					        youhuiPrice = manselectTotalPriceNew-manobj.attr('manselect_money0');
  					   }else{
  					        youhuiPrice = 0;
  					   }

					     numman += parseFloat(manselectnum);
					     manselectTotalPrice +=parseFloat(manselectPrice*manselectnum);


            }


           totalPrice += parseFloat(price * num);
           dutyPrice += parseFloat(price * num * hs_rate);

           if(youhuiPrice>0){
           	   module.find(".coupon").html("-￥" + youhuiPrice.toFixed(2));
           }else{
           	  youhuiPrice=0;  //当优惠为负值时令优惠为0
           }
        }





        addcookie("cartGoodsNum", countNum);
        module.find(".marker").text("共 " + countNum + " 件");
        module.find(".chooseGoods").text("已选" + countNum + "件商品");
        module.find(".total_price").html("￥" + totalPrice.toFixed(2));
        module.find(".duty").html("￥" + dutyPrice.toFixed(2));



        //计算是否包邮
        var storeEnouth = module.find(".sec-active .post").attr("free_limit");
        if (storeEnouth && totalPrice >= storeEnouth) {
            module.find(".post .send-full-span").text("已包邮");
        } else if (storeEnouth && totalPrice < storeEnouth) {
            var poorMoney = storeEnouth - totalPrice;
            module.find(".post .send-full-span").text("还差" + poorMoney.toFixed(2) + "元包邮");
        }
        //			if(dutyPrice<=50){
        //				module.find(".amount_price").html("￥"+totalPrice.toFixed(2));
        //			}else{
        module.find(".amount_price").html("￥" + (totalPrice + dutyPrice-youhuiPrice).toFixed(2));
        //			}
        judgeGoods(module);

        /**
             * @content 任选活动
             * @author  ljz
             * @date    20160819
             **/
            var manselect_info = JSON.parse(sessionStorage.getItem('manselect_info'));
            if(manselect_info[$(module).find('.manselect').attr('store_id')]){
            var objmanselect = manselect_info[$(module).find('.manselect').attr('store_id')].manselect_rules;
            var renxuan_num = 0;
            for (var j = 0; j < goodsNum.length; j++) {
	            	if($($(goodsNum)[j]).parent().attr('goods_activity_state')==1){
	                num = $($(goodsNum)[j]).parent().find(".num").val();
	                renxuan_num += parseFloat(num);
	            }
            }
            var $sendFullSpan = $(module).find(".manselect .send-full-span");
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
          }

    }
    //页面加载分别计算所有商铺的购物车价钱
    function calculateAllPrice() {
        var module = $(".store_goods");
        for (var i = 0; i < module.length; i++) {
            var goodsNum = $(module[i]).find(".icon-ok-sign.single");
            //该店铺下只有失效商品时阻止结算
            if (goodsNum.length == 0) {
                $(module[i]).find(".tettle").attr("class", "tettle btn-unshopping");
            }
            var countNum = 0;
            var totalPrice = parseFloat("0.00"),
                dutyPrice = parseFloat("0.00"); //关税
            for (var j = 0; j < goodsNum.length; j++) {
                var parent = $(goodsNum[j]).parent();
                var price = parent.find(".goods-price").text().slice(1);
                var num = parent.find(".num").val();
                var hs_rate = parent.attr("hs_rate");
                if (parent.parents(".container.valid").find(".some-div").length != 0) {
                    var partNum = parent.parent().find(".some-div").length * num;
                    countNum = countNum + partNum;
                } else {
                    countNum += parseInt(num);
                }
                totalPrice += parseFloat(price * num);
                dutyPrice += parseFloat(price * num * hs_rate);
            }
            addcookie("cartGoodsNum", countNum);
            $(module[i]).find(".marker").text("共 " + countNum + " 件");
            $(module[i]).find(".chooseGoods").text("已选" + countNum + "件商品");
            $(module[i]).find(".total_price").html("￥" + totalPrice.toFixed(2));
            $(module[i]).find(".duty").html("￥" + dutyPrice.toFixed(2));
            //计算是否包邮
            var storeEnouth = $(module[i]).find(".sec-active .post").attr("free_limit");
            if (storeEnouth && totalPrice >= storeEnouth) {
                $(module[i]).find(".post .send-full-span").text("已包邮");
            } else if (storeEnouth && totalPrice < storeEnouth) {
                var poorMoney = storeEnouth - totalPrice;
                $(module[i]).find(".post .send-full-span").text("还差" + poorMoney.toFixed(2) + "元包邮");
            }
            //税
            //				if(dutyPrice<=50){
            //					$(module[i]).find(".amount_price").html("￥"+totalPrice.toFixed(2));
            //				}else{
            $(module[i]).find(".amount_price").html("￥" + (totalPrice + dutyPrice).toFixed(2));
            //				}
            judgeGoods($(module[i]));
        }
    }

    //判断所购商品是否超过限制或者税是否少于50
    function judgeGoods(dom) {
        var okNum = dom.find(".icon-ok-sign.single").length; //勾选的商品个数
        var dutyPrice = dom.find(".duty").text().substr(1);
        var amountPrice = dom.find(".amount_price").text().substr(1);
        var total_price = dom.find(".total_price").text().substr(1);
        var custom_purchase_limit = parseFloat(dom.find('.store-title').attr('custom_purchase_limit'));
        //			if(dutyPrice<=50){
        //				dom.find(".duty").addClass("line-through");
        //			}else{
        dom.find(".duty").removeClass("line-through");
        //			}
        if (total_price > custom_purchase_limit && custom_purchase_limit > 0) {
            dom.find(".warning").remove();
            var hint = "<div class='warning'>" +
                "<p>本包裹超过¥" + custom_purchase_limit + "了，请分开结算，政策规定本包裹多件商品总价低于¥" + custom_purchase_limit + "才可过关哦~</p>"

            +"</div>";
            dom.find(".calculatePrice").append(hint);
            dom.find(".tettle").attr("class", "tettle btn-unshopping");
        } else if (okNum != 0) {
            dom.find(".tettle").attr("class", "tettle btn-shopping");
            dom.find(".warning").remove();
        } else if (okNum == 0) {
            dom.find(".warning").remove();
        }
        $(".tettle").unbind("click");
        bindEvent();
    }

    function bindEvent() {
        //结算
        $(".btn-shopping").unbind("click").bind("click", function() {
            var me = this;
            var stockoutNum = $(this).parents(".store_goods").find(".stockout").length;
            if (stockoutNum > 0) {
                layer.msg("所购商品库存不足");
            } else {
                loadGoodsMsg(me);
                location.href = "../order/order_confirmation.html?cart_info=" + cart_info + "&if_cart=1&area=1&miaosha=" + miaosha;
            }

        });
    }
    //记住跳转路径 国内国外切换
    function remeberReferurl() {
        var referurl = document.referrer;
        if (referurl.indexOf("shopping_cart_cn") < 0) {
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

    //页面加载判断店铺是否可结算
    function canSettle() {
        var storeList = $(".store_goods");
        for (var i = 0; i < storeList.length; i++) {

        }
    }
    //计算购物车商品信息
    function loadGoodsMsg(me) {
        var data = $(me).parents(".store_goods").find(".container.valid .icon-ok-sign").parent(),
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

    //判断是否还有选中的商品
    function haveGoods(self) {
        var dom = $(self).parents(".store_goods");
        var num = dom.find(".icon-ok-sign.single").length;
        if (num != 0) {
            dom.find(".tettle").attr("class", "tettle btn-shopping");
            bindEvent();
            $('#delete').addClass('okdelete');
        } else {
            dom.find(".tettle").attr("class", "tettle btn-unshopping");
            dom.find(".tettle").unbind("click");
            $('#delete').removeClass('okdelete');
        }
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
                curpage: 1,
                area: 1
            },
            dataType: 'json',
            success: function(data) {
                if (data && data.error === '0') {
                    var html = template.render('like_goods', data);
                    $('#likeGoods').html(html);
                    //计算图片大小
                    var imgwidth = parseInt($(".container").width() * 0.49);
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
            //$("#edit").text("完成");
            $("#edit").hide();
            $('.goback').hide();
            $('#nav-show').hide();
            $(".calculatePrice").hide();
            $(".bottom-frame").hide();
            $("#editBottom").show();
            $(".unuseful").attr("class", "icon-circle-blank single font-gray");
            editCancelAll();
            editAllClick();
        }
    });
    //页面编辑时添加全选点击事件
    function editAllClick() {
        $(".editAll").unbind("click").bind("click", function() {
            var me = this;
            $(me).hasClass("icon-ok-sign") ? editCancelAll(me) : editSelectAll(me);
        });
    }
    //页面编辑时全选
    function editSelectAll() {
        $(".single").attr("class", "icon-ok-sign single");
        $(".store").attr("class", "icon-ok-sign store");
        $(".editAll").attr("class", "icon-ok-sign editAll");
    }

    function editCancelAll() {
        $(".single").attr("class", "icon-circle-blank single font-gray");
        $(".store").attr("class", "icon-circle-blank store font-gray");
        $(".editAll").attr("class", "icon-circle-blank editAll");
    }
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
            //				editDelete(cart_id_all);
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
                gc_area: 1,
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
            editCancelAll();
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
        $(".calculatePrice").show();
        $(".bottom-frame").show();
        $("#editBottom").hide();
        calculateAllPrice();
        $('#delete').removeClass('okdelete');
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
                    gc_area: 1,
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
                            $(".bottom-frame").hide();
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
        var total = $(me).parents(".store_goods").find(".total_price").text().slice(1);
        addcookie("storeTotal", total);
        location.href = "shopping_cart_pinkage.html?store_id=" + store_id + "&free_limit=" + free_limit + "&type=post";
    }
    //满送点击
    function sendClick() {
        var me = this;
        var store_id = $(me).attr("store_id");
        var total = $(me).parents(".store_goods").find(".total_price").text().slice(1);
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
    //删除弹出层
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
                $('.shoppingurl').attr('data-href', '../shopping/shopping_cart_global.html');
            } else {
                $('.shoppingurl').attr('data-href', '../shopping/shopping_cart_cn.html');
            }
        }
    }
    var Carts_glo = function() {
        this.onLoad = function() {
            //	remeberReferurl();
            loadGoods();
        }
    }
    Global.Goods = Global.Goods || {};
    Goods.Carts_glo = new Carts_glo();
}(this);
