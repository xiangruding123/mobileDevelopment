!function(Global) {
	var serverTime,
		timeDown,
		sequence_state_name = ['未开始','进行中','已结束','管理员关闭'];
    
    function achieveTime(startTime,serverTime,countdownTime){
    	clearInterval(timeDown);
    	var time ;
    	if(startTime){
    		time = startTime - serverTime;
    	}else{
    		time = countdownTime;
    	}
    	if(time>=0){
			showTime(time);
			timeDown = setInterval(function(){
				--time ;
				showTime(time);
				if(time==0){
					clearInterval(timeDown);
				}
			},1000);
		}else{
			$(".sk-h").text('00');
	        $(".sk-m").text('00');
	        $(".sk-s").text('00');
		}
    }
    
    function showTime(t){
        var h = Math.floor(t/60/60%24);
        var m = Math.floor(t/60%60);
        var s = Math.floor(t%60);
        if(h<10){
        	h = "0"+h
        }
        if(m<10){
        	m = "0"+m
        }
        if(s<10){
        	s = "0"+s
        }
        $(".sk-h").text(h+':');
        $(".sk-m").text(m+':');
        $(".sk-s").text(s);
    }
    //页面事件委托
    function bindEvent(){
    	$("#tab_ul").on("click","li",function(){
    		var me = this;
    		$(me).addClass("color-active").siblings().removeClass("color-active");
    		var startTime = $(me).attr("start_time");
    		var endTime = $(me).attr("end_time");
    		serverTime =  FL.getServerTime().getTime()/1000;
    		var time = $(me).find("p:eq(0)").text();
    		var state = $(me).find("p:eq(1)").attr("state");//获取点击场次状态
    		var title = $(me).find("p:eq(1)").attr("title");
    		var if_current = $(me).attr("if_current");
    		var type = $(me).attr("type");
    		if(!title){
	    		if(state==1){
	    			if(type==2){
	    				$(".sk-title").text("即将开始  明天"+time+"开抢");
	    			}else{
	    				$(".sk-title").text("即将开始  "+time+"开抢");
	    			}
	    			
	    			$(".sk-span1").text("距开始： ");
	    			$("#sk_tips").show();
	    			achieveTime(startTime,serverTime);
	    		}else if(state==2&&if_current==1){
	    			$(".sk-title").text("抢购中 "+time+"开始");
	    			$("#sk_tips").hide();
	    		}else if(state==2&&if_current==0){
	    			$(".sk-title").text("本场次还有商品可以继续抢购");
	    			$("#sk_tips").hide();
	    		}else if(state==3){
	    			$(".sk-title").text("本场次结束");
	    			$("#sk_tips").hide();
	    		}
	    	}else{
	    		if(state==1){
	    			$(".sk-title").text("即将开始  08:00开抢");
	    		}else if(state==2&&if_current==1){
	    			$(".sk-title").text("限时限量  入场疯抢");
	    			$("#sk_tips").hide();
	    		}else if(state==2&&if_current==0){
	    			$(".sk-title").text("本场次还有商品可以继续抢购");
	    			$("#sk_tips").hide();
	    		}else if(state==3){
	    			$(".sk-title").text("本场次结束");
	    			$("#sk_tips").hide();
	    		}
	    	}
    		var s_id = $(me).attr("s_id");
    		//加载商品列表
    		loadGoods(s_id,state,if_current);
    		//切换banner
    		$(".sk-t-img").hide();
    		$(".img-"+s_id).show();
    	});
    	$("#tab_change").click(function(){
    		var me = this;
    		var $li =$(".color-active").next();
    		if($li.length!=0){
    			$li.trigger("click");
    		}
    	});
    }
    //添加滚动条
    function addScroll(num){
    	var wapWidth = document.documentElement.clientWidth;
    	wapWidth>640?wapWidth=640:wapWidth=wapWidth;
    	var liWidth = wapWidth/5;
    	$("#tab_ul").css("width",(liWidth*num)+"px");
    	$("#tab_ul li").css("width",liWidth+"px");
    	var tabScroll = new IScroll('#sk_tab',{scrollX:true,scrollY:false,mouseWheel:true,tap:true});
    }
    //加载秒杀场次
    function loadList(){
    	$.ajax({
    		type:"get",
    		data:{flag:'wap'},
    		url:WapSiteUrl+"/api/index.php?act=buyer_seckilling&op=get_sequence_list",
    		dataType:'json',
    		success:function(data){
    			if(data&&data.error==0){
    				for(var i=0;i<data.result.length;i++){
    					if(data.result[i].sequence_state==2&&data.result[i].if_current==1){
    						$("#sk_tips").hide();
    						if(data.result[i].sequence_title){
    							$(".sk-title").text("限时限量  入场疯抢");
    						}else{
    							$(".sk-title").text("抢购中 "+data.result[i].sequence_time+"开抢");
    						}
    						
    						loadGoods(data.result[i].sequence_id,2,1);
    					//	achieveTime(data.result[i].end_time,serverTime,data.result[i].countdown);
    					}
    				}
    				
	    			var html = template.render("tabUl",data);
	    			$("#tab_ul").html(html);
	    			
	    			//banner图加载
	    			var imgs = template.render("sk_banner",data);
	    			$("#sk_tab").after(imgs);
	    			addScroll(data.result.length);
	    		}
    		}
    	});
    }
    //获取所选场次商品列表
    function loadGoods(s_id,state,if_current){
    	$.ajax({
    		type:"get",
    		url:WapSiteUrl+"/api/index.php?act=buyer_seckilling&op=get_sequence_goods",
    		data:{flag:"wap",sequence_id:s_id},
    		dataType:"json",
    		success:function(data){
    			if(data&&data.error==0){
    				data.result.state = state;
    				data.result.if_current = if_current;
					var html = template.render("seckillList",data);
					$("#seckill_list").empty();
					$("#seckill_list").html(html);
					
					setTimeout(function(){
						for(var i=0;i<$(".sk-pro").length;i++){
							var cssWidth =  $($(".sk-pro")[i]).attr("width");
							$($(".sk-pro")[i]).css("width",cssWidth);
						}
					});
					
    			}else if(data&&data.error=='0004'){
    				$("#seckill_list").empty();
    			}
    		}
    	});
    }
    //添加上下滑动
    function addWindowScroll(){
    	var top = document.getElementById("sk_tab").offsetTop;
    	$(window).scroll(function(){  
	        var htmlHeight=document.body.scrollHeight||document.documentElement.scrollHeight;  
	        var clientHeight=document.body.clientHeight||document.documentElement.clientHeight;  
	        var scrollTop=document.body.scrollTop||document.documentElement.scrollTop;  
	        if(scrollTop>top){  
	        	$("#sk_tab").css("position","fixed");
	        }else{
	        	$("#sk_tab").css("position","relative");
	        }
	    })  
    }
    //获取微信分享信息
    function loadWxShare(){
    	$.ajax({
    		type:"get",
    		url:WapSiteUrl+"/api/index.php?act=buyer_seckilling&op=get_seckilling_data",
    		data:{flag:"wap"},
    		dataType:"json",
    		success:function(data){
    			if(data&&data.error==0){
    				var wxTitle = data.result.share_title;
    				var wxDesc = data.result.share_desc;
    				var wxImg = data.result.share_img;
    				var title = data.result.seckilling_title;
    				var wxLink = data.result.share_url||location.href.split('#')[0];
    				$(".header-title").text(title);
    				FL.wxShare(wxTitle,wxDesc,wxLink,wxImg);
    			}
    		}
    	});
    }
	var Seckill = function(){
		this.onLoad = function(){
			$(".downLoad-fix").hide();
			addcookie("firstShow","no",1);
			serverTime =  FL.getServerTime().getTime()/1000;
			addWindowScroll();
			bindEvent();
			loadList();
			loadWxShare();
		}
	}
	Global.Activity = Global.Activity||{};
	Activity.Seckill = new Seckill(); 

}(this);
