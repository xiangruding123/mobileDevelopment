/********订单确认**********/
(function($, w, d) {
    'use strict';

    $(function() {

        
        var token = getcookie('token');
        var mid = getcookie('mid');
        var address_id= GetQueryString('address_id');
        //地址
        $.ajax({
            url: WapSiteUrl + '/api/index.php?act=buyer_delivery&op=get_address',
            type: 'post',
            data: {
                mid:mid,
                token:token,
                address_id:address_id,
                flag:'wap'
            },
            dataType: 'json',
            success: function(res) {
                if (res.error === '0') {
                    var data = res.datas;
                    var html = template.render('order_tpl', data);
                    $('#contact_address').html(html);


                }
            }


        });
        $.ajax({
            url: ApiUrl + '/index.php?act=goods&op=goods_detail',
            type: 'get',
            data: {
                goods_id: goods_id,
                flag:'wap'
            },
            dataType: 'json',
            success: function(res) {
               if (res.code === 200) {
                
                var data = res.datas;
                var html = template.render('product-tpl', data);
                    $('#product_info').html(html);
                 
                 // 是否使用优惠券
        var flag = true;
        $('.circle-right').click(function() {
            if (flag) {
                $(this).addClass('icon-ok-sign focus-font').removeClass('icon-circle-blank');
                $(this).prev('.fh-price').show();
                flag = false;
            } else {
                $(this).addClass('icon-circle-blank').removeClass('icon-ok-sign focus-font');
                $(this).prev('.fh-price').hide();
                flag = true;
            }

        });



        var price, //单价
            num, //数量
            express_price, //快递价格
            all_price, //总价
            privilege, //优惠价格
            total; //总计

        //******价格计算

        // 商品单价

         price = parseFloat(($(".media-right .fh-price").text().split("￥"))[1]);
        // 快递价格
        express_price = parseFloat($("#express_price").text());

        // 数量
         num = parseFloat(($("#num").text().split('×'))[1]);


        // 总价
        all_price = parseFloat(price * num + express_price);

        $('#all_price').html('￥' + all_price);
        //优惠价格 
        privilege = 0;
        //总计
        total = all_price - privilege;

        $('#total').html('￥' + total);
        $('.circle-right').click(function() {

            flag ? privilege = 0 : privilege = parseFloat($("#privilege").text());
            //使用优惠券总计
            total = all_price - privilege;

            $('#total').html('￥' + total);
        });

                }
            }


        });

        





        // ******购买第一步   byljz
        var cart_id, //购买参数
            ifcart; // 购物车购买标志 1


        $.ajax({
            url: ApiUrl + '/index.php?act=member_buy&op=buy_step1',
            type: 'post',
            dataType: 'json',
            data: {
                key: key,
                cart_id: cart_id,
                ifcart: 1
            },
            success: function() {

            }
        });



        //订单列表
        $.ajax({
            url: ApiUrl + '/index.php?act=member_order&op=order_list',
            type: 'post',
            dataType: 'json',
            data: {
                key: key
            },
            success: function() {

            }
        });
    })



}($, window, document));
