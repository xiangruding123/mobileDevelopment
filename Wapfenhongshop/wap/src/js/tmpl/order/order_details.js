$(function(){
        //核对购物车信息
        
        var cart_info =  GetQueryString('cart_info'),
        if_cart =  GetQueryString('if_cart');
        $.ajax({
            url:WapSiteUrl+ '/api/index.php?act=buyer_cart&op=check_cart',
            type: 'post',
            dataType: 'json',
            data: {mid:FL.mid,token:FL.token,cart_info:cart_info,if_cart:1,member_store_id:FL.store_id,flag:'wap'},
            success:function(data){
            if(data.error==='0'){
                var html = template('confirm-tpl',data);
                $('#confirm-info').html(html);
            }
            }
        });


         var address_id = GetQueryString('address_id');
         $.ajax({
            url:WapSiteUrl+ '/api/index.php?act=buyer_delivery&op=get_address',
            type: 'post',
            dataType: 'json',
            data: {mid:FL.mid,token:FL.token,flag:'wap',address_id:address_id},
            success:function(data){
                // var data ='undefined';
            if(data&&data.error==='0'){
                var html=template('address-tpl',data);
                $('#address').html(html);
            }
            }
        });


//         获取收货地址(post)

// (host)/api/index.php?act=buyer_delivery&op=get_address
// 请求参数

// mid    会员id

// address_id    收货地址id（可选，不传则返回会员所有地址）

// token    登录令牌
// 返回数据(array/obje)

// address_id 地址id
// name 收货人姓名

// cert_name    身份证姓名 

// cert_num    身份证号码

// area_id 区县id
// city_id 城市id
// area_info 地区信息
// address 街道信息
// mob_phone 手机号
// is_default 是否默认收货地址
        
       });