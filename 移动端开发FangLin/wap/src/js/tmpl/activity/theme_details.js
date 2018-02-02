/*************主题馆详情*****************/
!function(Global) {
		var activity_id = GetQueryString("activity_id");
		var title = GetQueryString("title");
		$(".header-title").text(title);
		
		ImgFormat();//图片格式
		
    

		function loadData(){
			$.ajax({
		
				type:'get',
				
				url:WapSiteUrl+"/api/index.php?act=buyer_activity&op=get_activity_detail",
		
				data:{activity_id:activity_id,flag:"wap",type:"zhutiguan"},
		
				dataType:'json',
		
				success:function(data){
					
					if(data&&data.error==="0"){
						//标题
                        $('title,.header-title').text(data.result.activity_title);
						
						
						if(data.result.activity_slides){
							var bannerImg = template.render("banners",data.result);
		
							$(".swiper-wrapper").empty();
			
							$(".swiper-wrapper").append(bannerImg);
						}
						var html = template.render("themeBars",data.result);
		
						$("#themeList").empty();
		
						$("#themeList").append(html);
						
						$($(".navbar-nav").find("li")[0]).attr("class","active");
						
           
						
						//计算图片大小
						var imgwidth =parseInt(($(".container").width()+30)*0.48);
						$(".tm-imgList").css({"width":imgwidth+"px","height":imgwidth+"px"});
						$("#themeList img").lazyload({ threshold : 200 });
						addScroll();
						bindEvent();
						bannerSwiper();
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
				},
				error:function(xhr) {
		
				}
		
			});
		}
		
		function bindEvent(){
			if(native_flag=='-1'){
    			$('header').removeClass('none');
    		}
			//页面添加滚动监听
		    $(window).on('scroll', function() {
		    	var scrollTop = document.body.scrollTop;
	            if(scrollTop>=198){
	            	$(".tm-nav").attr("style","position:fixed !important;");
	            }else{
	            	$(".tm-nav").attr("style","position:relitive !important");
	            	$($(".navbar-nav").find("li")[0]).attr("class","active");
	            }
	        });
	        //页面返回按钮
	        $(".goback").click(function(){
	        	location.replace('theme_list.html');
	        });
	        
	        $("#t-tabs li").click(function(){
	        	var me = this;
				setTimeout(function(){
					$("#t-tabs li").removeClass();
					$(me).attr("class","active");
				},10);
	        });
		}
	

		//计算添加横向滚动条
		function addScroll(){
			var liWidth = ($(".container").width()+30)*0.25;
			var num = $("#t-tabs li").length;
			var tabWith = liWidth*num;
			if(tabWith>($(".container").width()+30)){
				$("#t-tabs").append('<i class="icon-angle-right rg-arrow"></i>');
				$(".navbar-nav").attr("style","width:"+tabWith+"px");
				$($(".navbar-nav").find("li")).attr("style","width:"+liWidth+"px");
				var tabScrool = new IScroll("#t-tabs",{scrollX:true,scrollY:false,mouseWheel:true});
			}
		}
		//轮播
		function bannerSwiper(){
            var mySwiper = new Swiper('.swiper-container', {
                autoplay: 6000,
                autoplayDisableOnInteraction : false,
                pagination: '.swiper-pagination'
            });
		}
	
	var ThemeDetails = function(){
		this.onLoad = function(){
			loadData();
		}
	}
	Global.Goods = Global.Goods||{};
	Goods.ThemeDetails = new ThemeDetails(); 

}(this);

