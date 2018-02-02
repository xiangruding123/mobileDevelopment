!function(Global) {
    var num = 10,
    	curpage = 1,
    	count = 0,
    	order_num =2,
    	sort_num =1,
    	flag = true,
        key,
        gc_id,
    	regu = /^[-]{0,1}[0-9]{1,}$/;//判断是否是整数;
    	ImgFormat();//图片选择


    var activity_id =GetQueryString("activity_id"),
        activity_title = GetQueryString('activity_title');
        activity_type='guojiaguan';
    var class_id=0;//全部商品
    var resource_tags;

	function loadData(){

		$('title,.header-title').text(activity_title);
		pavilion_content();
		getBrandList("yes",order_num,sort_num,curpage,num,activity_id,class_id);
	}

	//国家馆
	function pavilion_content(){
		 $.ajax({
            url: WapSiteUrl + '/api/index.php?act=buyer_activity&op=get_activity_detail',
            type: 'get',
            dataType: 'json',
            data: {activity_id:activity_id,type:activity_type,flag:'wap'},
            success: function(data) {
                if (data&&data.error === "0") {
                	$('title,.header-title').text(data.result.activity_title);
                    var html = template.render('ads_list_tpl', data);
                    $('header').after(html);
                    $(".row img").lazyload({ threshold : 200 });
                    if($('#paviilion_sort_list li').length>8){
                    	 $('#paviilion_sort_list li:gt(7)').hide();
                    	 $('.listToggle').removeClass('hide');
                    }
                    $('.listToggle').toggle(function(){
	                    	$('.listToggle').html('收起<i class="icon-angle-up pl5"></i>');
	                    	$('#paviilion_sort_list li:gt(7)').show();
	                    },function(){
	                    	$('.listToggle').html('全部分类<i class="icon-angle-down pl5"></i>');
	                    	$('#paviilion_sort_list li:gt(7)').hide();
                    })

                    resource_tags=data.result.resource_tags;


                    var mySwiper = new Swiper('#swiper-index', {
						loop: true,
						effect: 'fade',
						autoplay: 3000,
						pagination: '.swiper-pagination'
					});

					$('#swiper-index ul li:nth-of-type(3n)').css("margin-right","0");

                    //设置微信分享信息
					var wx_title = data.result.share_title;
					var wx_desc = data.result.share_desc;
					var wx_link = location.href.split('#')[0];
					var wx_img = data.result.share_img;

					FL.wxShare(wx_title,wx_desc,wx_link,wx_img);
					
					var shareObj ={};
						    shareObj.title = wx_title,
							shareObj.desc = wx_desc,
							shareObj.img = wx_img,
							shareObj.url = wx_link;
					
					    rightShare(shareObj);
                }
            }
        });
	}







	//type:yes页面清空再添加 no直接添加
    function getBrandList(type,order,sort,curpage,num,activity_id,class_id) {
        $.ajax({
            url: WapSiteUrl + '/api/index.php?act=buyer_activity&op=get_activity_goods',
            type: 'get',
            dataType: 'json',
            data: { num: num,curpage: curpage,flag: 'wap',order: order,sort:sort,type:activity_type,activity_id:activity_id,class_id:class_id},
            success: function(data) {
                if (data&&data.error === "0") {
                	data.result.resource_tags=resource_tags;
                    var html = template.render('brandDetails', data);
                    if(type=="yes"){
                    	$("#brand_details").html(html);
                    }else{
                    	$("#brand_details").append(html);
                    }
                    console.log(data);

                    //计算图片大小
						var imgwidth =parseInt(($(".brand_details_list li").width()));
						$(".brand_details_list a>img").css({"width":imgwidth+"px","height":imgwidth+"px"});

                    $("#brand_details img").lazyload({ threshold : 200 });

                }
            }
        });
    }

    function bindEvent(){

    	$(".nav li").click(function(){
    		var me = this;
    		var tab_num = $(me).attr("num");
    		if(tab_num==3){
    			$(".nav li").find("a").removeClass("focus-font");
    			$(me).find("a").attr("class","focus-font");
    			$(me).find("i").hasClass("icon-sort-up")?sortPrice(me,"desc"):sortPrice(me,"asc");
    		}else{
    			$(".nav li").find("a").removeClass("focus-font");
    			$(me).find("a").attr("class","focus-font");
//  			order_num = 1;
    			sort_num = tab_num;
    			getBrandList("yes",2,tab_num,1,10,activity_id,class_id);

    		}
    		count = 0;

    	});
    };

    function sortPrice(me,method){
    	if(method=="desc"){
    		$(me).find('i').attr("class","icon-sort-down");
    		order_num = 2;
    		sort_num = 3;
    		getBrandList("yes",order_num,sort_num,curpage,num,activity_id,class_id);
    	}else{
    		$(me).find('i').attr("class","icon-sort-up");
    		order_num = 1;
    		sort_num = 3;
    		getBrandList("yes",order_num,sort_num,curpage,num,activity_id,class_id);
    	}

    }

	function bindRefresh(){
   		$(window).scroll(function() {
			var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
			var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
			var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			if (scrollTop + clientHeight == htmlHeight) {
				var showNum = $(".brand_details_list li").length;//当前页面显示的个数
				page = showNum/num + 1; //上拉加载要显示的页数
				if(count != page && regu.test(page)){
					getBrandList("no",order_num,sort_num,page,num,activity_id,class_id);
					count = page;
				}else{
//                  layer.msg("已经没有商品了");
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
