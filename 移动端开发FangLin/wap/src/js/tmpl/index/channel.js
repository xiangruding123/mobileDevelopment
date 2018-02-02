$(function(){
	
	var channel_id=GetQueryString("channel");
	channelDate(channel_id);
	function channelDate(channel_id){
		$.ajax({
			type:"get",
			url:WapSiteUrl+"/api/index.php?act=buyer_shopping&op=get_channel_data",				
			data:{flag:"wap",channel_id:channel_id},
			dataType: 'json',
			success:function(data){			
				if(data.error==0){
					var html = template('page2-tpl',data);
					$('#page2').html(html);				
					
					
					$("img").lazyload({threshold:200});
					
					bindEventChannel(data);
					
				}
			}
		});
	}
	
	function bindEventChannel(e){
		//轮播
		var mySwiper = new Swiper('.swiper-container', {
				loop: true,
				effect: 'fade',
				autoplay: 6000,
				// 如果需要分页器
				pagination: '.swiper-pagination',
				autoplayDisableOnInteraction : false
			});
		
		//分红精选
		for(var m =0;m<e.result.hot_activities.list.length;m++){
			var tabScrool = new IScroll(".f-hot-bar"+m,{scrollX:true,scrollY:false,mouseWheel:true,tab:true});	
		}
   	    
   	    //计算图片大小
		var imgwidth =parseInt(($(".hot-floor-goods").width()+30)*0.48)-40;
		$(".hot-floor-goods li img").css({"width":imgwidth+"px","height":imgwidth+"px"});
	}
})
