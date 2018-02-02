!function(Global) {
    var num = 10,
    	order_num =1,
    	sort_num =3,
    	flag = true,
        key,
        gc_id,
        gc_deep=2,
    	regu = /^[-]{0,1}[0-9]{1,}$/;//判断是否是整数;

		var count = 0; //当前商品总数 用来判断是否还要继续加载更多
        key= GetQueryString('key');
        gc_id=GetQueryString('gc_id');
     if(key){
        $('#goods_search').val(key);
        var curpage=1;
        goodsList("yes",order_num,sort_num,curpage,key,gc_id);

     };
     is_own=GetQueryString('is_own');
     if(is_own){
     	var curpage=1;
        goodsList("yes",order_num,sort_num,curpage,key,gc_id,1);
     }

     ImgFormat();//圖片格式


	//type:yes页面清空再添加 no直接添加
    function goodsList(type,order,sort,curpage,key,gc_id,is_own) {
        $.ajax({
            url: WapSiteUrl + '/api/index.php?act=common_goods&op=get_goods_list',
            type: 'get',
            dataType: 'json',
            data: {
                num: num,
                curpage: curpage,
                flag: 'wap',
                order: order,
                sort: sort,
                key:key,
                gc_id:gc_id,
                gc_deep:2,
                is_own:is_own
            },
            success: function(data) {

                if (data&&data.error === "0") {
                    $('#emptysearch').hide();
                    var html = template.render('goods_list_tpl', data);
                    if(type=="yes"){
                    	$(".fh-goods").remove();
                    }
                    $(".pullUp").before(html);
                    $("#goods_list img").lazyload();
                    $('#-mob-share').attr('src','http://f1.webshare.mob.com/code/mob-share.js?appkey=13a3931a47072');

                    $('-mob-share-open').click(function(){
                        var me = this;
                        var _title,_desc,_pic,_url;
                        _title = $(me).attr('data-title');
                        _desc  = $(me).attr('data-content');
                        _pic   = $(me).attr('data-image');
                        _url   = $(me).attr('data-url');
                        $('.-mob-share-ui').show();
                        FL.share(_title,_desc,_pic,_url);
                    });

                }else{
                	if(type=="yes"){
                		$(".fh-goods").remove();
                		$('#emptysearch').show();
                	}

                }
            }
        });
    }

    function bindEvent(){
    	$(".nav li").click(function(){
    		var me = this;
    		var tab_num = $(me).attr("num");
    		if(tab_num==2){
    			$(".nav li").find("a").removeClass("focus-font");
    			$(me).find("a").attr("class","focus-font");
    			$(me).find("i").hasClass("icon-sort-up")?sortPrice(me,"desc"):sortPrice(me,"asc");
    		}else if(tab_num==5){
    			$(".nav li").find("a").removeClass("focus-font");
    			$(me).find("a").attr("class","focus-font");
    			$(me).find("i").hasClass("icon-sort-up")?sortMoneyPrice(me,"desc"):sortMoneyPrice(me,"asc");
    		}else{
    			$(".nav li").find("a").removeClass("focus-font");
    			$(me).find("a").attr("class","focus-font");
    			order_num = 1;
    			sort_num = tab_num;
    			goodsList("yes",2,tab_num,1,key,gc_id);

    		}
    	});
           // 搜索


        $('#goods_search').bind('keydown',function(event){

		if (event.keyCode==13){
		$('.icon-search').click();
	    }

	    })
        $('.icon-search').click(function(event) {
             key =$.trim($('#goods_search').val());
             var curpage=1;
             gc_id='';
             goodsList("yes",order_num,order_num,curpage,key,gc_id,is_own);
             curpage++;

            $.ajax({
                url: WapSiteUrl+'/api/index.php?act=common_goods&op=add_search_history',
                type: 'post',
                dataType: 'json',
                data: {token: FL.token,mid:FL.mid,flag:'wap',keywords:key,is_own:is_own},
                success:function(data){

                }
            });

         });
    };

    function sortPrice(me,method){
    	if(method=="desc"){
    		$(me).find('i').attr("class","icon-sort-down");
    		// order_num = 2;
    		// sort_num = 2;
    		goodsList("yes",2,2,1,key,gc_id,is_own);
    	}else{
    		$(me).find('i').attr("class","icon-sort-up");
    		// order_num = 1;
    		// sort_num = 2;
    		goodsList("yes",1,2,1,key,gc_id,is_own);
    	}

    }
    function sortMoneyPrice(me,method){
    	if(method=="desc"){
    		$(me).find('i').attr("class","icon-sort-down");
        // 佣金排序
    		goodsList("yes",order_num,sort_num,1,key,gc_id,is_own);
    	}else{
    		$(me).find('i').attr("class","icon-sort-up");
        // 佣金排序
    		goodsList("yes",order_num,sort_num,1,key,gc_id,is_own);
    	}

    }
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
					goodsList("no",order_num,sort_num,curpage,key,gc_id,is_own);
					count = curpage;
				} else {
					layer.msg("已经没有商品了");
				}
			}
		})
	}

            gc_id = GetQueryString('gc_id');
			goodsList("yes",order_num,sort_num,1,key,gc_id,is_own);
			bindRefresh();
			bindEvent();

}(this);
