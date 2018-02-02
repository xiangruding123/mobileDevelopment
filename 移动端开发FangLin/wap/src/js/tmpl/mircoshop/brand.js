! function(Global) {

  // 页面初始化
  $.init();

    var num = 10,
        order_num = 2,
        sort_num = 3,
        flag = true,
        key,
        gc_id,
        gc_deep = 2,
        regu = /^[-]{0,1}[0-9]{1,}$/; //判断是否是整数;

    var count = 0; //当前商品总数 用来判断是否还要继续加载更多
    key = GetQueryString('key');
    gc_id = GetQueryString('gc_id');
    if (key) {
        $('#goods_search').val(key);
        var curpage = 1;
        goodsList("yes", order_num, sort_num, curpage, key, gc_id);

    };
    is_own = GetQueryString('is_own');
    if (is_own) {
        var curpage = 1;
        goodsList("yes", order_num, sort_num, curpage, key, gc_id, 1);
    }

    ImgFormat(); //圖片格式

    var shop_id = getcookie('shop_id'),
        uname = '';

    //type:yes页面清空再添加 no直接添加
    function goodsList(type, order, sort, curpage, key, char, cid) {
        $.ajax({
            url: WapSiteUrl + '/api/index.php?act=shoper_manage&op=get_brands',
            type: 'get',
            dataType: 'json',
            data: {
                num: num,
                start: curpage,
                flag: 'wap',
                order: order,
                sort: sort,
                key: key,
                char: char,
                cid: cid,
                shop_id: shop_id
            },
            success: function(data) {
                console.log(data)

                if (data && data.error === "0") {
                    $('#emptysearch').hide();
                    var html = template.render('goods_list_tpl', data);
                    if (type == "yes") {
                        $(".inditem").remove();
                        //新数据重新绑定滚动
                        $.attachInfiniteScroll($('.infinite-scroll'));
                    }
                    $(".pullUp").before(html);


                    $('.addbrand').on('click', function() {
                        var me = this;
                        var brand_id = $(me).attr('brand_id');
                        addBrand(brand_id, me);
                    });



                    $('.-mob-share-open').unbind("click").bind("click", function() {
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

                    for(var i = 0;i<data.result.length;i++){
                         var lH = $($('.notice-text')[i+(curpage-1)*num]).height();
                         if (lH > 44) {

                            $($('.notice-text')[i+(curpage-1)*num]).addClass('overhide');

                        } else {
                            $($('.notice')[i+(curpage-1)*num]).hide();
                        }
                    }

                    $('.notice').unbind("click").bind('click',function(){
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

                } else {
                    if (type == "yes") {
                        $(".inditem").remove();
                        $('#emptysearch').show();
                    }

                }
            }
        });
    }

    function bindEvent() {
        $(".nav li").click(function() {
            var me = this;
            var tab_num = $(me).attr("num");
            if (tab_num == 2) {
                $(".nav li").find("a").removeClass("focus-font");
                $(me).find("a").attr("class", "focus-font");
                $(me).find("i").hasClass("icon-sort-up") ? sortPrice(me, "desc") : sortPrice(me, "asc");
            } else {
                $(".nav li").find("a").removeClass("focus-font");
                $(me).find("a").attr("class", "focus-font");
                order_num = 1;
                sort_num = tab_num;
                goodsList("yes", 2, tab_num, 1, key, gc_id);

            }
        });
        // 搜索


        $('#search').bind('keydown', function(event) {

            if (event.keyCode == 13) {
                $('.icon-search').click();
            }

        })
        $('.icon-search').click(function(event) {
            key = $.trim($('#search').val());
            var curpage = 1;
            gc_id = '';
            goodsList("yes", order_num, order_num, curpage, key, gc_id, is_own);
            curpage++;
            count = 0;

            $.ajax({
                url: WapSiteUrl + '/api/index.php?act=common_goods&op=add_search_history',
                type: 'post',
                dataType: 'json',
                data: {
                    token: FL.token,
                    mid: FL.mid,
                    flag: 'wap',
                    keywords: key,
                    is_own: is_own
                },
                success: function(data) {

                }
            });

        });
    };

    function sortPrice(me, method) {
        if (method == "desc") {
            $(me).find('i').attr("class", "icon-sort-down");
            order_num = 2;
            sort_num = 2;
            goodsList("yes", 2, 2, 1, key, gc_id, is_own);
        } else {
            $(me).find('i').attr("class", "icon-sort-up");
            order_num = 1;
            sort_num = 2;
            goodsList("yes", 1, 2, 1, key, gc_id, is_own);
        }

    }
    //绑定滚动
    function bindRefresh() {

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

                  goodsList("no", order_num, sort_num, curpage, key, gc_id, is_own);
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
    }


    function addBrand(brand_id, me) {
        $.ajax({
            url: WapSiteUrl + '/api/index.php?act=shoper_manage&op=brand_save',
            type: 'post',
            dataType: 'json',
            data: {
                token: FL.token,
                mid: FL.mid,
                flag: 'wap',
                shop_id: shop_id,
                uname: uname,
                brand: brand_id
            },
            success: function(data) {
                if (data && data.error == '0') {
                    console.log(data);
                    $(me).html('<img src="../../images/weidian/ok.png" alt="" class="w20 mr5 mt2 vm">已上架');
                }

            }
        });
    }

    gc_id = GetQueryString('gc_id');

    // setTimeout(function(){
      goodsList("yes", order_num, sort_num, 1, key, gc_id, is_own);
      bindRefresh();
      bindEvent();
    // },100);

}(this);
