!function(Global) {
		var num = 10,
	    	curpage = 1,
	    	count = 0,
	    	regu = /^[-]{0,1}[0-9]{1,}$/,//判断是否是整数;
			state;
			var bagtip = GetQueryString('bagtip');
		//获取红包详情
		function getCoupon(num,curpage,state,type){
			$.ajax({
	       	    type:'post',
	       	    url:WapSiteUrl+'/api/index.php?act=buyer_coupon&op=coupon_list',
	       	    data:{num:num,curpage:curpage,state:state,mid:FL.mid,token:FL.token,flag:"wap"},
	       	    dataType:'json',
	       	    success:function(data){
	       	    	if(data&&data.error==0){
	       	    		data.result.state = state;
	       	    		$("#unuse").text(data.result.coupon_counts[0]);
	       	    		$("#use").text(data.result.coupon_counts[1]);
	       	    		$("#stale").text(data.result.coupon_counts[2]);
	       	    		if(data.result.coupon_list){
	       	    			
	       	    			if(sessionStorage.getItem('bagtip')=='bagtip'){
	       	    				$('.bag_name').html("恭喜您获得<br>"+data.result.coupon_list[0].coupon_price+"元红包");
			              		FL.addShade();
			              		$('.new-packet-img').show();
			              		sessionStorage.removeItem('bagtip');
	       	    			}
	       	    			$('.loading-shade,.new-packet-x').click(function(){
			              		$('.new-packet-img,.loading-shade').hide();
			              	});
			              	
			              	$('#close').click(function(){
			              		$('.new-packet-img,.loading-shade').hide();
			              	});
	              	
	       	    			$('#ticket .ticket-group').hide();
	       	    			template.helper("format", FL.dateFormat); 
		       	    		var html = template.render("couponList",data);
		       	    		if(type=="append"){
		       	    			$("#coupon_list").append(html);
		       	    		}else{
		       	    			$("#coupon_list").html(html);
		       	    		}
//		       	    		if(state==2){
//		       	    			$("#coupon_list .ticket_content").attr('class','ticket_content clearfix ticket_bg_grey colorC')
//		       	    		}
	       	    		}else if(type=="append"){
	       	    			layer.msg("没有更多了");
	       	    		}else{
	       	    			$("#coupon_list").empty();
	       	    			$('#ticket .ticket-group').show();
	       	    			if(state=='0'){
	       	    				$('.ticket-group button').show();
	       	    			}else{
	       	    				$('.ticket-group button').hide();
	       	    			}
	       	    			
	       	    		}
	       	    	}else if(data.error=="0020"){
	       	    		$("#coupon_list").empty();
	       	    		layer.msg(data.msg);
	       	    	}
	       	  	}
	    	});
		}
		
		function bindEvent(){
			//上方tab切换点击事件
			$(".nav li").click(function(){
				var me = this;
				state = $(me).attr("tabId");
				getCoupon(num,curpage,state);
				$(me).addClass('selected').siblings('li').removeClass('selected');
        
			});
		}
		
		$(window).scroll(function() {
			var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
			var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
			var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			           
			if (scrollTop + clientHeight == htmlHeight) {
				var showNum = $(".ticket").length;//当前页面显示的个数
				page = showNum/num + 1; //上拉加载要显示的页数
				if(count != page && regu.test(page)){
					getCoupon(num,page,state,"append");
					count = page;
				}else{
					
				}
			}
		});
		var CouponList = function(){
			this.onLoad = function(){
				if (!FL.token) {
					FL.logLogin();
				}
				state=0;
				getCoupon(num,curpage,state);
				bindEvent();
			}
		}
		Global.Packet = Global.Packet||{};
		Packet.CouponList = new CouponList(); 

}(this);
