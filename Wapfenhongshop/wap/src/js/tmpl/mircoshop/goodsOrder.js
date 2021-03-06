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
                $('.navbox').append(html);

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
                } else {
                    $('#tab1').append(html);
                }

                //分享

                $('.-mob-share-open').unbind("click").bind("click", function() {

                    var me = this;
                    if (native_flag == '-1') {
                        location.href = WapSiteUrl + '/wap/tmpl/shopping/goods_details.html?shareType=share&goods_id=' + $(this).attr('goods_id');
                    } else {
                        var title = $(me).attr('title'),
                            content = $(me).attr('desc'),
                            imgs = $(me).attr('img'),
                            url = WapSiteUrl + '/wap/tmpl/shopping/goods_details.html?goods_id=' + $(me).attr('goods_id');
                        appShare(title, content, imgs, url);
                    }
                });


                event();
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
            }
//          else {
//            $.toast("没有更多内容了");
//          }

            $.refreshScroller();

        }, 50);
    });


    //  分类导航
    setTimeout(function(){
      goodsClass("0", "2");
    },100);


});
