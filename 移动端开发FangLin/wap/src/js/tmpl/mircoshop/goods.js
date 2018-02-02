$(function() {
    // 页面初始化
    $.init();

    var num = 10,
        start = 1,
        key,
        regu = /^[-]{0,1}[0-9]{1,}$/; //判断是否是整数;

    var count = 0; //当前商品总数 用来判断是否还要继续加载更多

    var mid = FL.mid,
        token = FL.token,
        shop_id = getcookie('shop_id');



        function successLoad(data) {
            if (data && data.error == 0) {
                if (data.result.num != 0) {
                    if (data.result.num > 99) {
                        data.result.num = "99+";
                    }
                    var dom = '<span class="cart-num">' + data.result.num + '</span>';
                    $(".shoppingurl").append(dom);
                    if (data.result.is_global == '1') {
                        $('.shoppingurl').prop('href', '../mircoshop/shopping_cart_global.html');
                    } else {
                        $('.shoppingurl').prop('href', '../mircoshop/shopping_cart_cn.html');
                    }
                }
            }
        }


        //share
				var _title = "我是红人店主，邀您共现创富梦",
						_desc = "【赚钱】独创运营模式，全方位指导，专业团队，引领世界共创富，分红全球购打造亿万大众创富梦想的平台，财富等您加入！！！",
						_pic = "http://www.fenhongshop.com/wap/images/wap/logo.png",
						_url = WapSiteUrl + '/wap/tmpl/mircoshop/shop.html?shop_id=' + shop_id;


				FL.wxShare(_title, _desc, _url, _pic, _desc);




    function goodsClass(pid, area) {
        var data;
        if (pid !== "") {
            data = {
                pid: pid,
                area: area,
                flag: "wap"
            };
        } else {
            data = {
                area: area,
                flag: "wap"
            };
        }
        $.ajax({
            type: 'get',
            url: WapSiteUrl + '/api/index.php?act=common_goods&op=get_goods_class',
            data: data,
            dataType: 'json',
            success: function(data) {
                var html = template('head-tpl', data);
                $('.navbox').html(html);

                //  大导航
                var tabScrool = new IScroll(".f-nav-stickytabs", {
                    scrollX: true,
                    scrollY: false,
                    mouseWheel: true,
                    tab: true,
                    preventDefault: false
                });

                //默认
                $('.navbox span').eq(0).addClass('curr js-selected');

                FL.goodsClass($('.navbox span').eq(0).attr('gc_id'),$('.navbox span').eq(0).attr('gc_area'), {
                    success: loadSuccess
                });

                // getStock(num, start, $('.navbox span').eq(0).attr('gc_id'), 'yes'); //获取分类商品

                $('.navbox span').bind('click', function() {
                    var me = this;
                    $(me).addClass('curr js-selected').siblings('span').removeClass('curr js-selected');

                    var gcid = $(me).attr('gc_id');
                    var gc_area = $(me).attr('gc_area');

                    FL.goodsClass(gcid,gc_area, {
                        success: loadSuccess
                    });
                    // getStock(num, start, gcid, 'yes'); //获取分类商品
                    count = 0;
                    curpage = 1;
                });


            }
        })
    }




    function loadSuccess(data) {
         var html = template.render('reclassify-tpl', data);
           $('#reclassify_list').html(html);

           $('#reclassify_list li').eq(0).addClass('active');
           gcid = $('#reclassify_list li').eq(0).attr('gc_id');
           getStock(num,'1', gcid, '2', 'yes', '');

           $('#reclassify_list li').bind('click',function(){
           	    count =0;
                $(this).addClass('active').siblings('li').removeClass('active');
                gcid = $(this).attr('gc_id');
                getStock(num,'1', gcid, '2', 'yes', '');
           });

    }

    //获取商品
    function getStock(num, start, gcid, deep, flag, key) {

        date = {
            shop_id: shop_id,
            start: start,
            num: num,
            gcid: gcid,
            deep:deep,
            bid: '',
            sid: '',
            mid: mid,
            token: token,
            key: key

        }
        FL.ajaxDate('get', get_stock, date, function(data) {

            if (data && data.error) {
                console.log(data);
                var html = template.render('goodstpl', data);

                if (flag == 'yes') {
                    $('#tab1').html(html);
                    //新数据重新绑定滚动
                    $.attachInfiniteScroll($('.infinite-scroll'));
                } else {
                    $('#tab1').append(html);
                }

                //分享

                $('.-mob-share-open').unbind("click").bind("click", function() {

                    var me = this;
                    if (native_flag == '-1') {
                        location.href = WapSiteUrl + '/wap/tmpl/shopping/goods_details.html?shareType=share&goods_id=' + $(this).attr('goods_id');
                    }
                });


                event();


                $('.gocart').unbind("click").bind('click',function(){

									var self = this;
									if(!mid){
                      FL.logLogin();
									}else{
										var goods_id = $(self).attr('goods_id');
                    var goods_source = $(self).attr('goods_source');
									var data = {
											token: token,
											goods_id: goods_id,
											quantity: '1',
											mid: mid,
											flag: 'wap',
											gc_area: goods_source

									};
                  addShopCar(data);
									}


								})
            }
        });
    }

    // 店铺分类弹窗

    function goodsAdd() {
        FL.ajaxDate('get', goods_add, {
            shop_id: shop_id,
            mid: mid,
            token: token
        }, function(data) {
            console.log(data);
            var html = template.render('goodsClassTpl', data);
            $('#goodsClass').html(html);

            $('#goodsClass .items').click(function() {

                var me = this;
                $(me).addClass('active').siblings('.items').removeClass('active');

            });

            $('#goodsClass .items').eq(0).addClass('active');
        });
    }

    function goodsSave(shop_id, mid, token, uname, goods_class, goods, stc_name, me) {
        FL.ajaxDate('post', goods_save, {
            shop_id: shop_id,
            mid: mid,
            token: token,
            uname: uname,
            goods_class: goods_class,
            stc_name: stc_name,
            goods: goods
        }, function(data) {
            if (data && data.error == '0') {

                $('#layermbox').hide();

                $(me).parent('span').html('<img src="../../images/weidian/ok.png" alt="" class="icon">已上架')

            }
        });
    }

    function event() {

        //上架
        $('.other b').click(function() {
            //                  $('#layermbox').show();
            //                  goodsAdd();
            var me = this;
            var goods_id = $(me).attr('goods_id');

            //                  $('.btn_ok').live("click", function() {

            //                      var goods_class = $('#goodsClass .active').attr('wclass_id'),
            var goods_class = 'default',
                goods = goods_id + "|";

            //                      if (!goods_class) {
            //                          layer.msg('需要添加分类');
            //                      } else {
            goodsSave(shop_id, mid, token, 'uname', goods_class, goods, "", me);
            //                      }

            //                  });

        });

        $('.layermend').on('click', function() {
            $('#layermbox').hide();
        });

        var gtlLayer = null;

        //新增分类
        $("#jia").live("click", function() {
            layer.close(gtlLayer);
            var html1 = '<div class="addtypecont clearfix">' +
                '<div class="tit fl">分类名称</div>' +
                '<input type="text" class="ipt" />' +
                '</div>';
            var l2 = layer.open({
                style: "background-color:#F0F0F0;",
                title: '新建商品分类',
                content: html1,
                btn: ["确定"],
                yes: function(index) {
                    //ajax新建商品分类
                    var stc_name = $('.ipt').val();
                    goodsSave(shop_id, mid, token, 'uname', 'goods_class', 'goods', stc_name, layer.close(index));
                    //回调函数调用
                    goodsAdd();
                }
            });

        });

        $("#gtype").on('click', function() {
            var $curr = $(this);
            //alert("adsf");
            if ($curr.find(".goods_typelist").is(":visible")) {
                $curr.find(".goods_typelist").hide();
            } else {
                setTimeout(function() {
                    $curr.find(".goods_typelist").show();
                }, 10);
            }
        });

    }

    // 搜索

    $('#search').bind('keydown', function(event) {

        if (event.keyCode == 13) {
            $('.icon-search').click();
        }

    })
    $('.icon-search').click(function(event) {
        key = $.trim($('#search').val());
        var curpage = 1;
        gcid = '';
        getStock(num, start, gcid, '','yes', key);
        count = 0;
        curpage++;

        $.ajax({
            url: WapSiteUrl + '/api/index.php?act=common_goods&op=add_search_history',
            type: 'post',
            dataType: 'json',
            data: {
                token: FL.token,
                mid: FL.mid,
                flag: 'wap',
                keywords: key

            },
            success: function(data) {

            }
        });

    });

    //绑定滚动
    var loading = false;

    // 上次加载的序号

    var lastIndex = 10;

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

                var gcid = $('#reclassify_list li.active').attr('gc_id');
                key = $.trim($('#search').val());

                if(key){
                  gcid = '';
                }

                getStock(num, curpage, gcid,'2', 'no', key);
                count = curpage;
            }else {
              // console.log("count="+count);
              // console.log("curpage="+curpage);
              $('.toast').remove();
              $.toast("没有更多内容了");
              $.detachInfiniteScroll($('.infinite-scroll'));
             }

            $.refreshScroller();

        }, 50);
    });


    //添加购物车
    function addShopCar(data) {
        $("#goods-details #addOne").hide();
        $.ajax({
            url: WapSiteUrl + '/api/index.php?act=buyer_cart&op=add',
            type: 'get',
            dataType: 'json',

            data: data,

            success: function(data) {

                if (data.error === '0') {

                    $.toast('添加购物车成功');
                    FL.getGoodsNum({
                        success: successLoad
                    });


                } else if (data.error === '0008') {

                    /*location.href='../login/login.html?goods_id='+goods_id;*/
                    FL.logLogin();

                } else if (data.error === '2001008') {
                    $('.loading-shade').hide();
                    $('.fh-loading').remove();
                }
            },
            error: function(xhr) {

            }
        });
    }


    //  分类导航
    // setTimeout(function(){
      goodsClass("0", "2");
      FL.getGoodsNum({
          success: successLoad
      });
    // },100);


});
