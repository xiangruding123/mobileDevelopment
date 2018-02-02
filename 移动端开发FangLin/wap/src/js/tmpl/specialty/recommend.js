!function(Global) {
    var num = 10,
        order_num =2,
        sort_num =3,
        flag = true,
        key,
        dataType,
        gc_id,
        gc_deep=2,
        regu = /^[-]{0,1}[0-9]{1,}$/;//判断是否是整数;

    var count = 0; //当前商品总数 用来判断是否还要继续加载更多

    ImgFormat();//圖片格式
    var talent_id =GetQueryString('talent_id');


    //mold:yes页面清空再添加 no直接添加
    function getRecommendGoods(num,curpage,mold,gid) {
        FL.ajaxDate('get',get_recommend_goods,{num: num,curpage: curpage,talent_id:talent_id,gid:gid},function(data){
            if (data&&data.error === "0") {
                console.log(data)
                var html = template.render('goods_list_tpl', data);

                mold=='yes'?$('#goods_list').html(html):$('#goods_list').append(html);

                if(!gid){
                    var htmlnav = template.render('goods_nav_tpl',data);
                    $('.navbox').html(htmlnav);
                }


                $('title,.header-title').text(data.result.talent.talent_name+"爱的·商品");

                var tabScrool = new IScroll(".f-nav-stickytabs",{scrollX:true,scrollY:false,mouseWheel:true,tab:true});

                bindEvent()

                $("#goods_list img").scrollLoading();
            }


        });
    }

    function bindEvent(){
        $(".navbox span").click(function(){
            var me = this;
            gc_id = $(me).attr("gc-id");
            $(me).addClass("active").siblings('span').removeClass("active");
            getRecommendGoods(num,'1',"yes",gc_id);
        });


    };


    //绑定滚动
    function bindRefresh() {
        $(window).scroll(function() {
            var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
            var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
            var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            if (scrollTop + clientHeight == htmlHeight) {
                var showNum = $(".media").length; //当前页面显示的个数
                curpage = showNum / 10 + 1; //上拉加载要显示的页数
                if (count != curpage && regu.test(curpage)) {
                    //					goodsList("no",order_num,sort_num,curpage,key,gc_id,is_own);
                    getRecommendGoods(num,curpage,"no",gc_id);
                    count = curpage;
                } else {
                    layer.msg("已经没有商品了");
                }
            }
        })
    }



    getRecommendGoods(num,"1","yes",0);
    bindRefresh();


}(this);
