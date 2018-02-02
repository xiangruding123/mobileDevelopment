/**
 * Created by martin on 16/7/18.
 */
$(function(){

	var num = 10,
    	curpage = 1,
    	count = 0,
    	order_num =2,
    	sort_num =3,
    	regu = /^[-]{0,1}[0-9]{1,}$/,//判断是否是整数;
    	flag = true;

	ImgFormat();
    	
	var brand_id = GetQueryString("brand_id");
	if(native_flag=='-1'){
		$('header').removeClass('none');
	}
	
	
	//分享提示
    if(GetQueryString('shareType')=='share'){
    	FL.addShadeLog();
    }
	
	function loadDate(){
		FL.ajaxDate('get',get_brand_message,{brand_id:brand_id},function(data){
			        if(data&&data.error=='0'){

						console.log(data);



						$('title,.header-title').html(data.result.brand_name);


						var html = template('brandBlock-tpl',data);
						$('.brandBlock').html(html);
						
						var lH = $("#noticetxt").height();
						console.log(lH);
						if(lH>30){
							$("#noticetxt").addClass("overhide");
							$('#notice').removeClass('hide');
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
						var topHeight;
						setTimeout(function(){
							 topHeight = $('.nav-pills').offset().top;
//                           abc = topHeight;
						},500);
                        
                             $(window).scroll(function(){
                             	var st = $(this).scrollTop();
                             	console.log(topHeight)
                             	if(st>topHeight){
                             		$('.fh-nav').css({"position":"fixed","top":"0","width":"100%","z-index":"103"});
                             	}else{
                             		$('.fh-nav').css({"position":"relative","top":"0"});
                             	}
                             });
						brandShare(data.result);//分享

			        }
	    });
	}
	 

     //type:yes页面清空再添加 no直接添加
    function getBrandGoods(type,order,sort,curpage,num,brand_id){
    	     FL.ajaxDate('get',get_brand_goods,{num: num,curpage: curpage,order: order,sort:sort,brand_id:brand_id},function(data){
			        if(data&&data.error=='0'){
				        console.log(data);
				        var html = template.render('brandDetails', data);
	                    if(type=="yes"){
	                    	$(".fh-goods").remove();
	                    }
	                    $(".pullUp").before(html);
	                    $("#brand_details img").lazyload({ threshold : 200 });
	                    
	                   

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
    			getBrandGoods("yes",2,tab_num,1,10,brand_id);
    		}
    		count = 0;
    	});
     
    };
    
    function sortPrice(me,method){
    	if(method=="desc"){
    		$(me).find('i').attr("class","icon-sort-down");
    		order_num = 2;
    		sort_num = 2;
    		getBrandGoods("yes",order_num,sort_num,curpage,num,brand_id);
    	}else{
    		$(me).find('i').attr("class","icon-sort-up");
    		order_num = 1;
    		sort_num = 2;
    		getBrandGoods("yes",order_num,sort_num,curpage,num,brand_id);
    	}

    }
  
	function bindRefresh(){
   		$(window).scroll(function() {
			var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
			var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
			var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			if (scrollTop + clientHeight == htmlHeight) {
				var showNum = $(".fh-goods").length;//当前页面显示的个数
				page = showNum/num + 1; //上拉加载要显示的页数
				if(count != page && regu.test(page)){
					getBrandGoods("no",order_num,sort_num,page,num,brand_id);
					count = page;
				}else{
                    layer.msg("已经没有商品了");
				}
			}
		})
	}
    
    //设置微信分享信息
    function brandShare(res){

		 var wx_title = res.share_title,
			 wx_desc = res.share_desc,
		     wx_link = location.href.split('#')[0],
		     wx_img = res.share_img;
		     
        
        
        var shareObj = {};
			shareObj.title = res.share_title,
			shareObj.desc = res.share_desc,
			shareObj.img = res.share_img,
			shareObj.url = location.href.split('#')[0];

		rightShare(shareObj);
        
		FL.wxShare(wx_title,wx_desc,wx_link,wx_img);
		
		$(".share").click(function(){
			$('.-mob-share-ui').show();
			FL.share(wx_title,wx_desc,wx_img,wx_link);
		});
    }


		
    loadDate();
    getBrandGoods("yes",order_num,sort_num,curpage,num,brand_id);
	bindEvent();
	bindRefresh();
    
})