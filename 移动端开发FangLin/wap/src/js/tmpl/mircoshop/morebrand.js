$(function() {
    // 页面初始化
    $.init();

    var num = 10,
        curpage = 1,
        sort = 3,
        order = 2,
        regu = /^[-]{0,1}[0-9]{1,}$/, //判断是否是整数
        count = 0; //当前商品总数 用来判断是否还要继续加载更多

    var mid = getcookie('mid'),
        token = getcookie('token'),
        shop_id = localStorage.getItem('shop_id')||getcookie('shop_id');



    function getShopBrand(type, curpage, num, sort, order, mid, token, shop_id) {

        data = {
            shop_id: shop_id,
            curpage: curpage,
            num: num,
            sort: sort,
            order: order
        }

        FL.ajaxDate('get', get_shop_brand, data, function(date) {

            if (date && date.error == '0') {
                console.log(date);
                var html = template.render('brandtpl', date);
                type == 'yes' ? $('#brand').html(html) : $('#brand').append(html);


                for(var i = 0;i<date.result.length;i++){
                     var lH = $($('.notice-text')[i+(curpage-1)*num]).height();
                     if (lH > 44) {

     		                $($('.notice-text')[i+(curpage-1)*num]).addClass('overhide');

     		            } else {
     		                $($('.notice')[i+(curpage-1)*num]).hide();
     		            }
                }

                $('.notice').unbind('click').bind('click',function(){
                  var me = this;

                  if ($(me).hasClass('down')) {
                      $(me).prev('.notice-text').removeClass('overhide');
                      $(me).removeClass('down').addClass('up');
                      $(me).find('img').prop('src', '../../images/wap/detail/notice_up.png');
                  } else {
                      $(me).prev('.notice-text').addClass('overhide');
                      $(me).removeClass('up').addClass('down');
                      $(me).find('img').prop('src', '../../images/wap/detail/notice.png');
                  }
                })


            }
        });

    }




    function loadEvent() {


        //  店铺分享

        var _title = "我是红人店主，邀您共现创富梦",
            _desc = "【赚钱】独创运营模式，全方位指导，专业团队，引领世界共创富，分红全球购打造亿万大众创富梦想的平台，财富等您加入！！！",
            _pic = "http://www.fenhongshop.com/wap/images/wap/logo.png",
            _url = WapSiteUrl + '/wap/tmpl/mircoshop/shop.html?shop_id=' + shop_id;


        FL.wxShare(_title, _desc, _url, _pic, _desc);


    }





    //绑定滚动
    var loading = false;


    // 注册'infinite'事件处理函数
    $(document).on('infinite', '.infinite-scroll-bottom', function() {

        // 如果正在加载，则退出
        if (loading) return;

        // 设置flag
        loading = true;

        // 模拟1s的加载过程
        setTimeout(function() {
            // 重置加载flag
            loading = false;

            var showNum = $('.inditem').length; //当前页面显示的个数
            curpage = showNum / 10 + 1; //上拉加载要显示的页数
            if (count != curpage && regu.test(curpage)) {

                getShopBrand('no', curpage, num, sort, order, mid, token,shop_id);
                count = curpage;
            }else {
              // console.log("count="+count);
              // console.log("curpage="+curpage);
              $('.toast').remove();
              $.toast("没有更多内容了");
              $.detachInfiniteScroll($('.infinite-scroll'));
             }

            //容器发生改变,如果是js滚动，需要刷新滚动
            $.refreshScroller();
        }, 1000);
    });


    // setTimeout(function() {

        getShopBrand('yes', curpage, num, sort, order, mid, token, shop_id); //商品
        loadEvent();
    // }, 100);

});
