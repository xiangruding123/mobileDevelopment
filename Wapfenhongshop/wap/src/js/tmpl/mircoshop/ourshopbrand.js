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
        shop_id = getcookie('shop_id');

    function loadInfo(mid, token, shop_id) {
        FL.ajaxDate('get', get_shop_info_all, {
            mid: FL.mid,
            token: FL.token,
            shop_id: shop_id
        }, function(data) {

            var res = data.result;

            if (res.shop_logo) {
                $('.headphoto .shoplogo').prop('src', res.shop_logo);
            }
            if (res.shop_banner) {
                $('.home-top').css('backgroundImage', 'url(' + res.shop_banner + ')');
            }
            if (res.shop_name) {
                $('.headphoto p').html(res.shop_name);
            }

            $('.headphoto img').click(function() {
                location.href = "shopdata.html?status=" + res.shop_type;
            });



            if (res.shop_type == '2') {
                $('.home-top-bottom span').removeClass('none');
                $('.iconbutton365').show();
                $('.booknickname').html('大V');
            } else if (res.shop_type == '3') {

                $('.iconbutton666').show();
                $('.booknickname').html('皇冠');
            }



            //升级
            $('.home-top-bottom span').click(function() {
                //location.href = 'order.html?updata=1';
                location.href = 'six.html';
            });

            getBook(mid,token);

        })

    }



    function getShopBrand(type, curpage, num, sort, order, mid, token, shop_id) {

        data = {
            shop_id: shop_id,
            curpage: curpage,
            num: num,
            sort: sort,
            order: order,
            mid: mid,
            token: token
        }

        FL.ajaxDate('get', get_shop_brand, data, function(date) {

            if (date && date.error == '0') {
                console.log(date);
                var html = template.render('brandtpl', date);
                type == 'yes' ? $('#brand').html(html) : $('#brand').append(html);
                $('.delbrand').live('click', function() {
                    var me = this;
                    var brand_id = $(me).attr('brand_id') + "|";

                    DelBrandSave(brand_id, me);

                })

                $('.sharebrand').unbind("click").bind("click", function() {

                    var me = this;
                    if (native_flag == '-1') {
                        location.href = WapSiteUrl + '/wap/tmpl/activity/brand.html?shareType=share&brand_id=' + $(this).attr('brand_id');
                    } else {
                      var shareObj={};
                          shareObj.title = $(me).attr('title'),
                          shareObj.desc = $(me).attr('desc'),
                          shareObj.img = $(me).attr('img'),
                          shareObj.url = WapSiteUrl + '/wap/tmpl/activity/brand.html?brand_id=' + $(me).attr('brand_id');
                          appShare(shareObj);
                    }
                });


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

    function DelBrandSave(brand_id, me) {
        FL.ajaxDate('post', del_shop_brand, {
            shop_id: shop_id,
            brand_id: brand_id,
            mid: mid,
            token: token
        }, function(data) {
            if (data && data.error == '0') {
                $(me).parents('.inditem').remove();
            }
        });
    }


    function loadEvent() {

        $('.link-shop').click(function() {
            location.href = "shopindex.html?shop_id=" + shop_id+"&time="+Math.random();
        })

        //  店铺分享

        var _title = "我是红人店主，邀您共现创富梦",
            _desc = "【赚钱】独创运营模式，全方位指导，专业团队，引领世界共创富，分红全球购打造亿万大众创富梦想的平台，财富等您加入！！！",
            _pic = "http://www.fenhongshop.com/wap/images/wap/logo.png",
            _url = WapSiteUrl + '/wap/tmpl/mircoshop/shop.html?shop_id=' + shop_id;
        //  店铺分享
        $('.homeshare').click(function() {

            if (native_flag == '-1') {
                FL.addShadeLog();

                FL.wxShare(_title, _desc, _url, _pic, _desc);
            } else {

              var shareObj={};
                  shareObj.title = _title,
                  shareObj.desc = _desc,
                  shareObj.img = _pic,
                  shareObj.url = _url;
                  appShare(shareObj);
            }

        });

        FL.wxShare(_title, _desc, _url, _pic, _desc);

        $('.footer span').bind('click', function() {
            var me = this;
            $(me).addClass('active').siblings('span').removeClass('active');
            var index = $(me).index();
            if (index == '0') {
                location.href = 'ourshop.html';
            }

        });

    }


    //证书数据获取

   function getBook(mid,token){
     FL.ajaxDate('post', get_member_info, {
         mid: mid,
         token: token
     }, function(data) {
         if (data && data.error == '0') {

           // 证书显示隐藏
           $(document).on('click', '.open-about', function() {
               $.popup('.popup-about');
           });

           $(document).on('click', '.popup-overlay', function() {
               $.closeModal('.popup-about');
           });

             var res = data.result;

             $('.bookecode').attr('src', res.micro_shop_qrcode_url);
             $('.bookname').html(res.card_name);

             if (res.company_pic_url) {
                 $('.bookphoto').attr('src', res.company_pic_url);
             } else {
                 $('.bookphoto').attr('src', res.person_pic_url);
             }

             $('.booknickname').html(res.micro_shop_name);


             $('.auth_sn').html(res.auth_sn);
             $('.time').html(res.verify_time);

         }
     })
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
                delCookie('lastToast');
                getShopBrand('no', curpage, num, sort, order, mid, token, shop_id); //商品

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
        loadInfo(mid, token, shop_id); //店铺信息
        getShopBrand('yes', curpage, num, sort, order, mid, token, shop_id); //商品
        loadEvent();
    // }, 100);

});
