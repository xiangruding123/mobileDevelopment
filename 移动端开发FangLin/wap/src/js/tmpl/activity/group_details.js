/*************团购列表*****************/
!function(Global) {
	 	
		var  class_name = GetQueryString("class_name");
		function loadData(){
	       var num=10,
	    	   curpage=1;
			
			var class_id = GetQueryString("class_parent_id");
			var s_class_id  = GetQueryString("class_id");
     		loadBanner(s_class_id);
		 	loadTabs(s_class_id);
		 	loadLists(s_class_id,"",curpage,num);
		} 
		// 轮播
		function loadBanner(s_class_id){
	        $.ajax({
	            url: WapSiteUrl + '/api/index.php?act=buyer_groupbuy&op=get_groupbuy_class_slides',
	            type: 'get',
	            dataType: 'json',
	            data: {flag: 'wap',class_id:s_class_id},
	            success:function(data){
		            if(data&&data.error==='0'){
		                var html =template.render('swiper-tpl',data);
		                $('.swiper-container').html(html);
		                var mySwiper = new Swiper ('.swiper-container',{
						    autoplay: 6000,
						    autoplayDisableOnInteraction : false
						});
		            }
	            }
      		});
		}
		
		// 分类标题
		function loadTabs(class_id){
	         $.ajax({
	            url: WapSiteUrl + '/api/index.php?act=buyer_groupbuy&op=get_groupbuy_class',
	            type: 'get',
	            dataType: 'json',
	            data: {flag: 'wap',class_parent_id:class_id},
	            success:function(data){
		            if(data&&data.error==='0'){
		                var html =template.render('nav_tabs',data);
		                var firstTab = '<li class="tab" class_id="" class_parent_id="'+class_id+'">'
						          		 +'<a>'+class_name+'</a>';
						          	   +'</li>';
		                $('#tabsList').html(html);
		                $("#tabs ul").prepend(firstTab);
		                $($(".tab")[0]).attr("class","tab active");
		                bindEvent();
		                addScroll();
		            }
	            },
	            error :function(xhr){
	            }
	        }); 
		}
		// 商品列表
		function loadLists(class_id,s_class_id,curpage,num){
	         $.ajax({
	            url: WapSiteUrl + '/api/index.php?act=buyer_groupbuy&op=get_groupbuy_goods_list',
	            type: 'get',
	            dataType: 'json',
	            data: {flag:'wap',num:num,curpage:curpage,class_id:class_id,s_class_id:s_class_id},
	            success:function(data){
		            if(data&&data.error==='0'){
		                var html = template.render('groupList',data);
		                $('#group_list').html(html);
		                $("#group_list img").lazyload({ threshold : 200 });
		            }else if(data&&data.error==004){
		            	$('#group_list').empty();
		            }
	            }
	        });
		}
		
		function bindEvent(){
			//tab切換
			$(".tab").click(function(){
				var me = this;
				var t_class_id = $(me).attr("class_id");
				var t_parent_class_id = $(me).attr("class_parent_id");
				loadLists(t_parent_class_id,t_class_id,1,10);
				$(".tab").attr("class","tab");
				$(me).attr("class","tab active");
			})
		}
		//计算添加横向滚动条
		function addScroll(){
			var liWidth = ($(".container").width()+30)*0.25;
			var num = $("#tabs li").length;
			var tabWith = liWidth*num;
			if(tabWith>($(".container").width()+30)){
				$("#tabs").append('<i class="icon-angle-right rg-arrow"></i>');
				$(".navbar-nav").attr("style","width:"+tabWith+"px");
				$($(".navbar-nav").find("li")).attr("style","width:"+liWidth+"px");
				var tabScrool = new IScroll("#tabs",{scrollX:true,scrollY:false,mouseWheel:true,tab:true});
			}
		}
		var GroupDetails = function(){
			this.onLoad = function(){
				loadData();
			}
		}
		Global.Goods = Global.Member||{};
		Goods.GroupDetails = new GroupDetails(); 

}(this);
