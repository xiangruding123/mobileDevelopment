var err = GetQueryString('status');
if (err == 'sucess') {
    errNum = 0;
    err_msg = "支付成功";
} else if (err == 'fail') {
    errNum = 2;
    err_msg = "支付失败";
} else {
    errNum = 1;
    err_msg = "取消支付";
}
var shop_type = GetQueryString('shop_type');


//当前页面为wap时显示
if (native_flag == '-1') {
    $('#order-success').removeClass('none');
    $('.fh-header').removeClass('none');


    if (!getcookie('mid')) {
        FL.logLogin();
    }
}

var pay_amount = GetQueryString('pay_amount');
var pay_sn = GetQueryString('pay_sn');
var coupon = GetQueryString('type');
var update = GetQueryString('update');


$('.pay_amount').text(pay_amount);
$('.err—msg').text(err_msg);



if (update != "1") {
    if(getcookie('token')){
       getbag(pay_sn);
    }else{
      appMemberInfo({
        success: getMemberInfo
      });
    }

}

// 用户信息

function getMemberInfo(info) {
        mid = info.member_id,
        token = info.token,

    //app数据添加token
    addcookie('member_name', info.member_name);
    addcookie('mid', info.member_id);
    addcookie('token', info.token);
    addcookie('nickname', info.member_nickname);


    getbag(pay_sn);

}



$('.header-title,title').html(err_msg);

$('.new-packet-x,#maskbag').click(function() {
    $('#maskbag').hide();
    $('.native_tip').hide();
});


$('#cover').click(function() {
    if (FL.isWeiXin()) {
        $('#covershare').show();
    } else {
        $('.native_tip').show();
        $('.bags').hide();
    }
    event.stopPropagation();
});
$('#covershare').click(function() {
    $('#covershare').hide();
});

$('#link_go').bind('click', function() {
    if (native_flag == '0') {
        FHMall.gotoHome(0);
    } else if (native_flag == '1') {
        igotoHome(0);
    } else {
        location.href = "../index/index.html";
    }
});

$('#order').bind('click',function(){

    location.href = "../order/order_all.html?index=2&val=20!orders";

});



//加载红包

function getbag(pay_sn) {
    $.ajax({
        url: WapSiteUrl + '/api/index.php?act=buyer_coupon&op=paid_coupon_batch',
        type: 'post',
        dataType: 'json',
        data: {
            flag: 'wap',
            token: getcookie('token'),
            mid: getcookie('mid'),
            pay_sn: pay_sn
        },
        success: function(data) {
            if (data.error === '0') {
                var res = data.result;
                if (res.batch_id && res.batch_name && shop_type < 1) { //不是购买店铺


                    $('#maskbag').show();
                    $('#num').text(res.bag_num);



                }
                FL.wxShare(res.share_title, res.share_desc, res.share_url, res.share_img, res.share_desc);

                if (update == 1) {

                    $('.shopbag').show();

                    $('.upper').html(res.upper_text);
                    $('.lower').html(res.lower_text);

                    setTimeout(function() {

                        location.href = "../mircoshop/home.html?shop_type=3";

                    }, 5000);

                    $('.shopbag').on('click', function() {
                        location.href = "../mircoshop/home.html?shop_type=3";
                    });

                } else {

                    $('.upper').html(res.upper_text);
                    $('.lower').html(res.lower_text);

                    if (shop_type > 1) {
                        $('.shopbag').show();

                        setTimeout(function() {

                            location.href = "../mircoshop/useinfo.html?shop_type=" + shop_type;

                        }, 5000);
                    }

                    $('.shopbag').on('click', function() {
                        location.href = "../mircoshop/home.html?shop_type=3";
                    });
                }

            } else {
                if (update == 1) {
                    setTimeout(function() {

                        location.href = "../mircoshop/home.html?shop_type=3";

                    }, 5000);
                } else if (shop_type > 1) {
                    location.href = "../mircoshop/useinfo.html?shop_type=" + shop_type;
                }
            }

        }
    })
}



//猜你喜欢
function likeGoods(curpage, num) {
    $.ajax({
        type: "get",
        url: WapSiteUrl + "/api/index.php?act=buyer_shopping&op=get_goods_scheme",
        data: {
            flag: "wap",
            type: 'cainixihuan',
            num: num,
            curpage: curpage
        },
        dataType: 'json',
        success: function(data) {
            if (data && data.error === '0') {
                template.helper('parseFloat', parseFloat);
                var html = template.render('floor_tpl', data);
                $('#floor').append(html);

                //计算图片大小
                var imgwidth = parseInt(($("#floor li").width()));
                $("#floor img").css({
                    "width": imgwidth + "px",
                    "height": imgwidth + "px"
                });
            }
        }
    });
}



function get_popup_info() {
    $.ajax({
        type: "post",
        url: WapSiteUrl + "/api/index.php?act=common_index&op=get_popup_info",
        data: {
            flag: "wap",
            type: 'cainixihuan',
            num: num,
            curpage: curpage
        },
        dataType: 'json',
        success: function(data) {
            if (data && data.error === '0') {
                var html = template.render('noinfotmpl', data);
                $('#noinfoDialog').html(html);
                FL.addShade();
                $('#noinfoDialog').show();


                $('#leftbtn').click(function() {
                    FL.removeShade();
                    $('#noinfoDialog').hide();
                })

                $('#rightbtn').click(function() {

                })
            }
        }
    });
}


function shoper() {


    $.ajax({
        type: "post",
        url: WapSiteUrl + "/api/index.php?act=common_index&op=apply_shoper",
        data: {
            mid: getcookie('mid'),
            token: getcookie('token')
        },
        dataType: 'json',
        success: function(data) {
            if (data && data.error === '0') {
                layer.msg("您已经是达人了");
                // addcookie("",);

                setTimeout(function() {
                    location.href = "../member/person.html";
                }, 1000);


            }
        }
    });
}


FL.ajaxDate('get', get_shoper_info, {
    mid: getcookie('mid')
}, function(data) {
    if (data && data.error == "0") {
        var res = data.result;
        addcookie('shop_id', res.shop_id);
    }
});

likeGoods(1, 4); //商品列表
