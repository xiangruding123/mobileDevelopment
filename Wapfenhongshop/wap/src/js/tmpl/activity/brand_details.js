!function(Global) {
    var num = 10,
    	curpage = 1,
    	count = 0,
    	order_num =2,
    	sort_num =3,
    	flag = true,
        key,
        gc_id,        
    	regu = /^[-]{0,1}[0-9]{1,}$/,//判断是否是整数;
    	brand_id = GetQueryString("brand_id"),
    	brand_banner = unescape(GetQueryString("brand_banner")),
    	brand_name  = GetQueryString("brand_name");

     	try{
            share_desc = GetQueryString("share_desc");
        }catch(e){
            share_desc ="分红全球购，快乐购全球";
        }

     	share_img = GetQueryString("share_img");
     	share_title = GetQueryString("share_title");
     	ImgFormat();//图片选择
	function loadData(){
		$(".header-title,title").text(brand_name);
		$("#brand_img").attr("src",brand_banner);
		getBrandList("yes",order_num,sort_num,curpage,num,brand_id);
		//设置微信分享信息
		var wx_title = share_title;
		var wx_desc = share_desc;
		var wx_link = location.href.split('#')[0];
		var wx_img = share_img;
        
		FL.wxShare(wx_title,wx_desc,wx_link,wx_img);
	}
	
	$('#notice').click(function(){
		 	var  me = this;
             if($(me).hasClass('down')){
             	$('#noticetxt').removeClass('overhide');
             	$(me).removeClass('down').addClass('up');
             	$(me).find('img').prop('src','../../images/wap/detail/notice_up.png');
             }else{
             	$('#noticetxt').addClass('overhide');
             	$(me).removeClass('up').addClass('down');
             	$(me).find('img').prop('src','../../images/wap/detail/notice.png');
             }
		 	
		 });
	//type:yes页面清空再添加 no直接添加
    function getBrandList(type,order,sort,curpage,num,brand_id) {
        $.ajax({
            url: WapSiteUrl + '/api/index.php?act=buyer_shopping&op=get_brandhouse_goods',
            type: 'get',
            dataType: 'json',
//          global:false,
            data: { num: num,curpage: curpage,flag: 'wap',order: order,sort:sort,brand_id:brand_id},
            success: function(data) {
                if (data&&data.error === "0") {
                    var html = template.render('brandDetails', data);
                    if(type=="yes"){
                    	$(".fh-goods").remove();
                    }
                    $(".pullUp").before(html);
                    $("#brand_details img").lazyload({ threshold : 200 });
        //       	    MyPlugin.scroller().refresh();
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
    		}else{
    			$(".nav li").find("a").removeClass("focus-font");
    			$(me).find("a").attr("class","focus-font");
    			order_num = 1;
    			sort_num = tab_num;
    			getBrandList("yes",2,tab_num,1,10,brand_id);
    	//		MyPlugin.scroller().scrollTo(0,0);
    		}
    		count = 0;
    	});
    };
    
    function sortPrice(me,method){
    	if(method=="desc"){
    		$(me).find('i').attr("class","icon-sort-down");
    		order_num = 2;
    		sort_num = 2;
    		getBrandList("yes",order_num,sort_num,curpage,num,brand_id);
    	}else{
    		$(me).find('i').attr("class","icon-sort-up");
    		order_num = 1;
    		sort_num = 2;
    		getBrandList("yes",order_num,sort_num,curpage,num,brand_id);
    	}
    //	MyPlugin.scroller().scrollTo(0,0);
    }
   /* //绑定滚动
    function bindRefresh(){
    	MyPlugin.fhScroll("#brand_scroll",function(){
    		
    	},function(callback){
				var showNum = $(".fh-goods").length;//当前页面显示的个数
				page = showNum/num + 1; //上拉加载要显示的页数
				if(regu.test(page)){
					getBrandList("no",order_num,sort_num,page,10,brand_id);
				}else{
                    layer.msg("已经没有商品了");
				}
    	});
    }
    */
	function bindRefresh(){
   		$(window).scroll(function() {
			var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
			var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
			var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			if (scrollTop + clientHeight == htmlHeight) {
				var showNum = $(".fh-goods").length;//当前页面显示的个数
				page = showNum/num + 1; //上拉加载要显示的页数
				if(count != page && regu.test(page)){
					getBrandList("no",order_num,sort_num,page,num,brand_id);
					count = page;
				}else{
                    layer.msg("已经没有商品了");
				}
			}
		})
	}
	var BrandDetails = function(){
		this.onLoad = function(){
			loadData();
			bindRefresh();
			bindEvent();          
		 }
	}
	Global.Goods = Global.Goods||{};
	Goods.BrandDetails = new BrandDetails(); 

}(this);
