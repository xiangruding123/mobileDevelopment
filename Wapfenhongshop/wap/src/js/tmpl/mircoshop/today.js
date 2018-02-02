/*************佣金收入*****************/
!function(Global) {
		var num = 5,
		state = 0;
		var regu = /^[-]{0,1}[0-9]{1,}$/; //判断是否是整数;

		var count = 0; //当前商品总数 用来判断是否还要继续加载更多
		var curpage = 1;

    function loadData() {
        getList(num, curpage, state,'yes');
    }

    //
    function getList(num, curpage, state,status) {
        $.ajax({
            type: "post",
            url: WapSiteUrl + "/api/index.php?act=buyer_order&op=get_order_today",
            data: {
                num: num,
                curpage: curpage,
                state: state,
                mid: FL.mid,
                token: FL.token,
                flag: "wap"
            },
            dataType: 'json',
            success: function(data) {
                var data = {
                    "result": [{
                        "order_id": "39774",
                        "order_sn": "8000000002813101",
                        "pay_sn": "450529593631238386",
                        "store_id": "50081",
                        "store_name": "\u7231\u751f\u6d3b\u7231\u5bb6\u5c45",
                        "order_state": "0",
                        "add_time": "1476249631",
                        "goods_amount": "28.91",
                        "order_amount": "38.91",
                        "shipping_fee": "10.00",
                        "shipping_code": null,
                        "country_source": "0",
                        "evaluation_state": "0",
                        "order_custom": "0",
                        "buyer_id": "328386",
                        "payment_code": "online",
                        "delay_time": "0",
                        "coupon_id": null,
                        "pd_amount": "0.00",
                        "coupon_amount": null,
                        "rcb_amount": "0.00",
                        "finnshed_time": "0",
                        "order_type": "1",
                        "shipping_weight": "500g",
                        "use_limit": 0,
                        "real_amount": 38.91,
                        "validity_pay_time": 0,
                        "state_desc": "\u5df2\u53d6\u6d88",
                        "pay_count": "1",
                        "goods_num": 5,
                        "invoice_info": [],
                        "e_code": null,
                        "e_name": null,
                        "if_refund": 0,
                        "free_freight": "90.00",
                        "extend_order_goods": [{
                            "rec_id": "90651",
                            "order_id": "39774",
                            "goods_id": "212",
                            "goods_name": "\u65b0\u54c1 \u539f\u4ea7\u5730\u5c0f\u5546\u54c1 \u4e0d\u9508\u94a2\u5496\u5561\u6405\u62cc\u52fa\u5b50(1\u628a)",
                            "goods_price": "5.90",
                            "goods_num": "5",
                            "goods_manselect_price": "0.00",
                            "goods_manselect_nums": "0",
                            "goods_image": "http:\/\/img.fenhongshop.com\/goods\/50081\/20140717\/53c7672acae6d.jpg",
                            "goods_pay_price": "29.50",
                            "store_id": "50081",
                            "buyer_id": "328386",
                            "goods_type": "1",
                            "promotions_id": "0",
                            "commis_rate": "200",
                            "gc_id": "236",
                            "deduct_userid": "1",
                            "deduct_username": "\u5206\u7ea2\u5546\u57ce",
                            "deduct_money": null,
                            "deduct_price": "10.00",
                            "hs_rate": "0.12",
                            "hsid": "0",
                            "hs_code": "",
                            "hs_name": "",
                            "goods_widget": "0.500",
                            "coupon_deduct": null,
                            "is_activity": "0",
                            "resource_tags": "",
                            "hs_tariff": "0.00",
                            "hs_saletax": "0.00",
                            "hs_vat": "0.17",
                            "goods_spec": null,
                            "goods_state": "1",
                            "if_refund": 0
                        }],
                        "all_goods_num": 10,
                        "all_goods_amount": 1039.91,
                        "all_goods_shipping_fee": 100,
                        "all_order_amount": 1139.91,
                        "all_real_amount": 1139.91
                    }, {
                        "order_id": "39753",
                        "order_sn": "8000000002811102",
                        "pay_sn": "880529351952597386",
                        "store_id": "50081",
                        "store_name": "\u7231\u751f\u6d3b\u7231\u5bb6\u5c45",
                        "order_state": "0",
                        "add_time": "1476007952",
                        "goods_amount": "10.00",
                        "order_amount": "20.00",
                        "shipping_fee": "10.00",
                        "shipping_code": null,
                        "country_source": "0",
                        "evaluation_state": "0",
                        "order_custom": "0",
                        "buyer_id": "328386",
                        "payment_code": "online",
                        "delay_time": "0",
                        "coupon_id": null,
                        "pd_amount": "0.00",
                        "coupon_amount": null,
                        "rcb_amount": "0.00",
                        "finnshed_time": "0",
                        "order_type": "1",
                        "shipping_weight": "100g",
                        "use_limit": 0,
                        "real_amount": 20,
                        "validity_pay_time": 0,
                        "state_desc": "\u5df2\u53d6\u6d88",
                        "pay_count": "2",
                        "goods_num": 2,
                        "invoice_info": [],
                        "e_code": null,
                        "e_name": null,
                        "if_refund": 0,
                        "free_freight": "90.00",
                        "extend_order_goods": [{
                            "rec_id": "90628",
                            "order_id": "39753",
                            "goods_id": "21241",
                            "goods_name": "\u53d1\u8d27\u6e20\u9053\u6d4b\u8bd5\u5546\u54c11",
                            "goods_price": "8.00",
                            "goods_num": "1",
                            "goods_manselect_price": "0.00",
                            "goods_manselect_nums": "0",
                            "goods_image": "http:\/\/img.fenhongshop.com\/goods\/50081\/20160817\/57b42d02cd47b.png",
                            "goods_pay_price": "8.00",
                            "store_id": "50081",
                            "buyer_id": "328386",
                            "goods_type": "1",
                            "promotions_id": "0",
                            "commis_rate": "200",
                            "gc_id": "1861",
                            "deduct_userid": "1",
                            "deduct_username": "\u5206\u7ea2\u5546\u57ce",
                            "deduct_money": null,
                            "deduct_price": "10.00",
                            "hs_rate": "0.00",
                            "hsid": "0",
                            "hs_code": "",
                            "hs_name": "",
                            "goods_widget": "0.100",
                            "coupon_deduct": null,
                            "is_activity": "1",
                            "resource_tags": "",
                            "hs_tariff": "0.00",
                            "hs_saletax": "0.00",
                            "hs_vat": "0.00",
                            "goods_spec": null,
                            "goods_state": "1",
                            "if_refund": 0
                        }, {
                            "rec_id": "90629",
                            "order_id": "39753",
                            "goods_id": "21256",
                            "goods_name": "\u591a\u89c4\u683c\u6d4b\u8bd5",
                            "goods_price": "2.00",
                            "goods_num": "1",
                            "goods_manselect_price": "0.00",
                            "goods_manselect_nums": "0",
                            "goods_image": "http:\/\/img.fenhongshop.com\/goods\/50081\/20160906\/57ce3c8c859ab.png",
                            "goods_pay_price": "2.00",
                            "store_id": "50081",
                            "buyer_id": "328386",
                            "goods_type": "1",
                            "promotions_id": "0",
                            "commis_rate": "200",
                            "gc_id": "514",
                            "deduct_userid": "1",
                            "deduct_username": "\u5206\u7ea2\u5546\u57ce",
                            "deduct_money": null,
                            "deduct_price": "10.00",
                            "hs_rate": "0.00",
                            "hsid": "0",
                            "hs_code": "",
                            "hs_name": "",
                            "goods_widget": "11.000",
                            "coupon_deduct": null,
                            "is_activity": "1",
                            "resource_tags": "",
                            "hs_tariff": "0.00",
                            "hs_saletax": "0.00",
                            "hs_vat": "0.00",
                            "goods_spec": null,
                            "goods_state": "1",
                            "if_refund": 0
                        }],
                        "all_goods_num": 10,
                        "all_goods_amount": 1039.91,
                        "all_goods_shipping_fee": 100,
                        "all_order_amount": 1139.91,
                        "all_real_amount": 1139.91
                    }, {
                        "order_id": "39752",
                        "order_sn": "8000000002811101",
                        "pay_sn": "880529351952597386",
                        "store_id": "325778",
                        "store_name": "\u5206\u7ea2\u5168\u7403\u8d2d\u81ea\u8425",
                        "order_state": "0",
                        "add_time": "1476007952",
                        "goods_amount": "500.00",
                        "order_amount": "540.00",
                        "shipping_fee": "40.00",
                        "shipping_code": null,
                        "country_source": "0",
                        "evaluation_state": "0",
                        "order_custom": "0",
                        "buyer_id": "328386",
                        "payment_code": "online",
                        "delay_time": "0",
                        "coupon_id": null,
                        "pd_amount": "0.00",
                        "coupon_amount": null,
                        "rcb_amount": "0.00",
                        "finnshed_time": "0",
                        "order_type": "1",
                        "shipping_weight": "1500g",
                        "use_limit": 0,
                        "real_amount": 540,
                        "validity_pay_time": 0,
                        "state_desc": "\u5df2\u53d6\u6d88",
                        "pay_count": "2",
                        "goods_num": 1,
                        "invoice_info": [],
                        "e_code": null,
                        "e_name": null,
                        "if_refund": 0,
                        "free_freight": 0,
                        "extend_order_goods": [{
                            "rec_id": "90627",
                            "order_id": "39752",
                            "goods_id": "21190",
                            "goods_name": "\u7ea2\u9152-\u8fdb\u53e3\u5c11\u4e8e\u4e24\u5343",
                            "goods_price": "500.00",
                            "goods_num": "1",
                            "goods_manselect_price": "0.00",
                            "goods_manselect_nums": "0",
                            "goods_image": "http:\/\/img.fenhongshop.com\/goods\/325778\/20160519\/573d3716dc5be.jpg",
                            "goods_pay_price": "500.00",
                            "store_id": "325778",
                            "buyer_id": "328386",
                            "goods_type": "1",
                            "promotions_id": "0",
                            "commis_rate": "200",
                            "gc_id": "1861",
                            "deduct_userid": "1",
                            "deduct_username": "\u5206\u7ea2\u5546\u57ce",
                            "deduct_money": null,
                            "deduct_price": "2.00",
                            "hs_rate": "0.00",
                            "hsid": "0",
                            "hs_code": "",
                            "hs_name": "",
                            "goods_widget": "1.500",
                            "coupon_deduct": null,
                            "is_activity": "1",
                            "resource_tags": "",
                            "hs_tariff": "0.00",
                            "hs_saletax": "0.00",
                            "hs_vat": "0.00",
                            "goods_spec": null,
                            "goods_state": "1",
                            "if_refund": 0
                        }],
                        "all_goods_num": 10,
                        "all_goods_amount": 1039.91,
                        "all_goods_shipping_fee": 100,
                        "all_order_amount": 1139.91,
                        "all_real_amount": 1139.91
                    }, {
                        "order_id": "39751",
                        "order_sn": "8000000002811002",
                        "pay_sn": "310529351794739386",
                        "store_id": "50081",
                        "store_name": "\u7231\u751f\u6d3b\u7231\u5bb6\u5c45",
                        "order_state": "0",
                        "add_time": "1476007794",
                        "goods_amount": "1.00",
                        "order_amount": "1.00",
                        "shipping_fee": "0.00",
                        "shipping_code": null,
                        "country_source": "0",
                        "evaluation_state": "0",
                        "order_custom": "0",
                        "buyer_id": "328386",
                        "payment_code": "online",
                        "delay_time": "0",
                        "coupon_id": null,
                        "pd_amount": "0.00",
                        "coupon_amount": null,
                        "rcb_amount": "0.00",
                        "finnshed_time": "0",
                        "order_type": "1",
                        "shipping_weight": "1000g",
                        "use_limit": 0,
                        "real_amount": 1,
                        "validity_pay_time": 0,
                        "state_desc": "\u5df2\u53d6\u6d88",
                        "pay_count": "2",
                        "goods_num": 1,
                        "invoice_info": [],
                        "e_code": null,
                        "e_name": null,
                        "if_refund": 0,
                        "free_freight": "90.00",
                        "extend_order_goods": [{
                            "rec_id": "90626",
                            "order_id": "39751",
                            "goods_id": "21233",
                            "goods_name": "\u652f\u63017\u5929\u65e0\u7406\u7531\u9000",
                            "goods_price": "1.00",
                            "goods_num": "1",
                            "goods_manselect_price": "0.00",
                            "goods_manselect_nums": "0",
                            "goods_image": "http:\/\/img.fenhongshop.com\/goods\/50081\/20160817\/57b42c387af7e.jpg",
                            "goods_pay_price": "1.00",
                            "store_id": "50081",
                            "buyer_id": "328386",
                            "goods_type": "1",
                            "promotions_id": "0",
                            "commis_rate": "200",
                            "gc_id": "616",
                            "deduct_userid": "1",
                            "deduct_username": "\u5206\u7ea2\u5546\u57ce",
                            "deduct_money": null,
                            "deduct_price": "11.00",
                            "hs_rate": "0.00",
                            "hsid": "0",
                            "hs_code": "",
                            "hs_name": "",
                            "goods_widget": "1.000",
                            "coupon_deduct": null,
                            "is_activity": "1",
                            "resource_tags": "",
                            "hs_tariff": "0.00",
                            "hs_saletax": "0.00",
                            "hs_vat": "0.00",
                            "goods_spec": null,
                            "goods_state": "1",
                            "if_refund": 0
                        }],
                        "all_goods_num": 10,
                        "all_goods_amount": 1039.91,
                        "all_goods_shipping_fee": 100,
                        "all_order_amount": 1139.91,
                        "all_real_amount": 1139.91
                    }, {
                        "order_id": "39750",
                        "order_sn": "8000000002811001",
                        "pay_sn": "310529351794739386",
                        "store_id": "325778",
                        "store_name": "\u5206\u7ea2\u5168\u7403\u8d2d\u81ea\u8425",
                        "order_state": "0",
                        "add_time": "1476007794",
                        "goods_amount": "500.00",
                        "order_amount": "540.00",
                        "shipping_fee": "40.00",
                        "shipping_code": null,
                        "country_source": "0",
                        "evaluation_state": "0",
                        "order_custom": "0",
                        "buyer_id": "328386",
                        "payment_code": "online",
                        "delay_time": "0",
                        "coupon_id": null,
                        "pd_amount": "0.00",
                        "coupon_amount": null,
                        "rcb_amount": "0.00",
                        "finnshed_time": "0",
                        "order_type": "1",
                        "shipping_weight": "1500g",
                        "use_limit": 0,
                        "real_amount": 540,
                        "validity_pay_time": 0,
                        "state_desc": "\u5df2\u53d6\u6d88",
                        "pay_count": "2",
                        "goods_num": 1,
                        "invoice_info": [],
                        "e_code": null,
                        "e_name": null,
                        "if_refund": 0,
                        "free_freight": 0,
                        "extend_order_goods": [{
                            "rec_id": "90625",
                            "order_id": "39750",
                            "goods_id": "21190",
                            "goods_name": "\u7ea2\u9152-\u8fdb\u53e3\u5c11\u4e8e\u4e24\u5343",
                            "goods_price": "500.00",
                            "goods_num": "1",
                            "goods_manselect_price": "0.00",
                            "goods_manselect_nums": "0",
                            "goods_image": "http:\/\/img.fenhongshop.com\/goods\/325778\/20160519\/573d3716dc5be.jpg",
                            "goods_pay_price": "500.00",
                            "store_id": "325778",
                            "buyer_id": "328386",
                            "goods_type": "1",
                            "promotions_id": "0",
                            "commis_rate": "200",
                            "gc_id": "1861",
                            "deduct_userid": "1",
                            "deduct_username": "\u5206\u7ea2\u5546\u57ce",
                            "deduct_money": null,
                            "deduct_price": "2.00",
                            "hs_rate": "0.00",
                            "hsid": "0",
                            "hs_code": "",
                            "hs_name": "",
                            "goods_widget": "1.500",
                            "coupon_deduct": null,
                            "is_activity": "1",
                            "resource_tags": "",
                            "hs_tariff": "0.00",
                            "hs_saletax": "0.00",
                            "hs_vat": "0.00",
                            "goods_spec": null,
                            "goods_state": "1",
                            "if_refund": 0
                        }],
                        "all_goods_num": 10,
                        "all_goods_amount": 1039.91,
                        "all_goods_shipping_fee": 100,
                        "all_order_amount": 1139.91,
                        "all_real_amount": 1139.91
                    }, {
                        "buyer_name": "m15806500549",
                        "order_sn": "8000000002772201",
                        "goods_name": "\u97e9\u56fd\u6b63\u54c1 \u7eff\u5415\u6e05\u723d\u63a7\u6cb9\u5957\u88c5 \u6d17\u53d1\u6c34+\u62a4\u53d1\u7d20  \u6df1\u5c42\u6d01\u51c0\u62a4\u7406 400ML+400ML",
                        "order_state": "\u5df2\u5931\u6548",
                        "goods_price": "149.00",
                        "deduct_price": 7.3,
                        "goods_num": "1",
                        "order_date": "2016-06-28 08:53",
                        "change_date": "",
                        "goods_id": "20574",
                        "order_state_code": "0",
                        "goods_image": "http:\/\/img.fenhongshop.com\/goods\/325778\/20160310\/56e123ae45628.jpg",
                        "store_name": "\u5206\u7ea2\u5168\u7403\u8d2d\u81ea\u8425"
                    }, {
                        "buyer_name": "m15806500549",
                        "order_sn": "8000000002772101",
                        "goods_name": "\u97e9\u56fd\u6b63\u54c1 \u7eff\u5415\u6e05\u723d\u63a7\u6cb9\u5957\u88c5 \u6d17\u53d1\u6c34+\u62a4\u53d1\u7d20  \u6df1\u5c42\u6d01\u51c0\u62a4\u7406 400ML+400ML",
                        "order_state": "\u5df2\u5931\u6548",
                        "goods_price": "149.00",
                        "deduct_price": 7.3,
                        "goods_num": "1",
                        "order_date": "2016-06-28 08:48",
                        "change_date": "",
                        "goods_id": "20574",
                        "order_state_code": "0",
                        "goods_image": "http:\/\/img.fenhongshop.com\/goods\/325778\/20160310\/56e123ae45628.jpg",
                        "store_name": "\u5206\u7ea2\u5168\u7403\u8d2d\u81ea\u8425"
                    }, {
                        "buyer_name": "m15806500549",
                        "order_sn": "8000000002772001",
                        "goods_name": "\u65b0\u897f\u5170 Nutra Life \u7ebd\u4e50 \u9ad8\u542b\u91cf\u8461\u8404\u7c7d\u7cbe\u534e\u80f6\u56ca 50000mg*120\u7c92",
                        "order_state": "\u5df2\u5931\u6548",
                        "goods_price": "235.00",
                        "deduct_price": 5.75,
                        "goods_num": "1",
                        "order_date": "2016-06-27 18:08",
                        "change_date": "",
                        "goods_id": "18435",
                        "order_state_code": "0",
                        "goods_image": "http:\/\/img.fenhongshop.com\/goods\/325779\/20151215\/566f9f5979cfd.jpg",
                        "store_name": "\u5c0f\u7eff\u74f6"
                    }, {
                        "buyer_name": "lin1000b",
                        "order_sn": "8000000002212501",
                        "goods_name": "ORIHIRO \u8fdb\u53e3\u4f4e\u5206\u5b50\u73bb\u5c3f\u9178\u80f6\u539f\u86cb\u767d\u80bd\u80f6\u539f\u86cb\u767d\u7c89 180g\/\u888b",
                        "order_state": "\u5df2\u5931\u6548",
                        "goods_price": "114.00",
                        "deduct_price": 5.58,
                        "goods_num": "1",
                        "order_date": "2016-01-27 23:48",
                        "change_date": "",
                        "goods_id": "20073",
                        "order_state_code": "0",
                        "goods_image": "http:\/\/img.fenhongshop.com\/goods\/325776\/20160112\/56948e8509715.jpg",
                        "store_name": "\u65e5\u672c\u306e\u826f\u54c1"
                    }, {
                        "buyer_name": "guicn",
                        "order_sn": "7000000000406501",
                        "goods_name": "\u8fd0\u8d39\u5dee\u4ef7",
                        "order_state": "\u5df2\u5931\u6548",
                        "goods_price": "0.01",
                        "deduct_price": 0,
                        "goods_num": "1",
                        "order_date": "2015-06-19 15:39",
                        "change_date": "",
                        "goods_id": "10573",
                        "order_state_code": "0",
                        "goods_image": "http:\/\/img.fenhongshop.com\/goods\/325703\/20150304\/54f6bba6190c5.jpg",
                        "store_name": "MISS\u4f11\u95f2\u98df\u54c1"
                    }],
                    "error": "0",
                    "msg": "",
                    "total": 0,
                    "hasmore": false
                }
                console.log(data);

                if (data && data.result) {
                    var html = template.render("commission_list", data);
                    if (status == "yes") {
                        $("#search_goods_list").html(html);
                    } else {
                        $("#search_goods_list").append(html);
                    }
                } else {
                    $("#search_goods_list").empty();
                }


            }
        });
    }
    $(".cos-ul1 li").click(function() {
        var me = this;
        var state = $(me).attr("tab");
        $(".cos-ul1 li").removeClass("focus-btn");
        $(me).addClass("focus-btn");
        curpage = 1;
        getList(num, curpage, state,'yes');
    });

    $(window).scroll(function() {
        var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
        var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        if (scrollTop + clientHeight == htmlHeight) {
            var showNum = $(".com-history").length; //当前页面显示的个数
            curpage = showNum / num + 1; //上拉加载要显示的页数
            if (count != curpage && regu.test(curpage)) {
                state = $('.focus-btn').attr('tab');
                getList(num, curpage, state,'no');
                count = curpage;
            } else {

            }
        }
    })
    var Commission = function() {
        this.onLoad = function() {
            loadData();
        }
    }
    Global.Member = Global.Member || {};
    Member.Commission = new Commission();


}(this);