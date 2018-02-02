$(function(){

    var num = 10,
        curpage=1,
        regu = /^[-]{0,1}[0-9]{1,}$/;//判断是否是整数;

    var count = 0; //当前商品总数 用来判断是否还要继续加载更多

    

    var talent_id= GetQueryString('talent_id');


    function loadDate(talent_id,type,num,curpage){
        FL.ajaxDate('get',get_fans_list,{mid:FL.mid,token:FL.token,talent_id:talent_id,num:num,curpage:curpage},function(data){
            if(data&&data.error=='0'){
               var html = template('fanslist-tpl',data);
                if(type=='yes'){
                  $('.fanslist').html(html);
                }else{
                  $('.fanslist').append(html);
                }

                $('.fanslist img').lazyload();
           }
        });
    }

    //绑定滚动
    function bindRefresh() {
        $(window).scroll(function() {
            var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
            var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
            var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
            if (scrollTop + clientHeight == htmlHeight) {
                var showNum = $(".fillmedia").length; //当前页面显示的个数
                curpage = showNum / 10 + 1; //上拉加载要显示的页数
                if (count != curpage && regu.test(curpage)) {
                    loadDate(talent_id,"no",num,curpage);
                    count = curpage;
                } else {
                    layer.msg("已经没有商品了");
                }
            }
        })
    }

    loadDate(talent_id,"yes",num,curpage);
    bindRefresh();







});
