(function($, w, d) {
    'use strict';
    $(function() {
       
        $('#coupon section').click(function(){
        $(this).next().show();
       })

        // voucher_list 代金券列表
        // voucher_id 代金券编号
        // voucher_code 代金券编码
        // voucher_title 代金券标题
        // voucher_desc 代金券描述
        // voucher_start_date 代金券开始时间
        // voucher_end_date 代金券过期时间
        // voucher_price 代金券面额
        // voucher_limit 代金券使用限额
        // voucher_state 代金券状态编号
        // voucher_order_id 使用代金券的订单编号
        // voucher_store_id 店铺编号
        // store_name 店铺名称
        // store_id 店铺编号
        // store_domain 店铺域名
        // voucher_t_customimg 代金券图片
        // voucher_state_text 代金券状态文字

        // ******购物券信息   byljz
        var order_id, // 订单编号
            key;

        // key = getcookie('key');
        key = localStorage.getItem('key');

        $.ajax({
            url: ApiUrl + '/index.php?act=member_voucher&op=voucher_list',
            type: 'post',
            dataType: 'json',
            data: {
                key: key,
                voucher_state: 1
            },
            success: function(res) {
             var html = template.render('conpon_tpl',res);
             $('#my_conpon').html(html);
            }
        });

    })


}($, window, document));
