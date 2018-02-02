!function(Global) {
	var serverTime,
		timeDown,
		sequence_state_name = ['未开始','进行中','已结束','管理员关闭'];    
    function achieveTime(countdownTime){
    	clearInterval(timeDown);
    	var time  = countdownTime-1;
    	
    	if(time>=0){
			showTime(time);
			timeDown = setInterval(function(){
				--time ;
				showTime(time);
				if(time==0){
					clearInterval(timeDown);
					loadList();
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
    		
    		var time = $(me).find("p:eq(0)").text();
    		var state = $(me).find("p:eq(1)").attr("state");//获取点击场次状态
    		var title = $(me).find("p:eq(1)").attr("title");
    		var if_current = $(me).attr("if_current");
    		var type = $(me).attr("type");
			var if_cover=$(me).attr("if_cover");
			var sequence_time = $(me).attr("sequence_time");
            
            
            var s_id = $(me).attr("s_id");
    		//加载商品列表
    		loadGoods(s_id,state,if_current,if_cover,type);
    		//切换banner
    		$(".sk-t-img").hide();
    		$(".img-"+s_id).show();
    		
    		
            $(".sk-title").text(sequence_time+"正式开抢");
            
            var wapWidth = document.documentElement.clientWidth;
    	    wapWidth>640?wapWidth=640:wapWidth=wapWidth;
    	    var liWidth = wapWidth/5; 
    	    var myScroll = new IScroll('#sk_tab',{scrollX:true,scrollY:false,mouseWheel:true,tap:true});
    	    if($(me).index()>4){
    	    	var transwidth=-($(me).index()-4)*liWidth;     	    	
    	    	setTimeout(function(){
					myScroll.scrollTo(transwidth, 0);
				},10);
//  	    	try{
//  	    		 $("#tab_ul").css({"transform":"translateX("+transwidth+"px)","-webkit-transform":"translateX("+transwidth+"px)"});	
//  	    	}catch(e){
//  	    		
//  	    	}
    	     
    	    }else{
//  	    	try{
//  	    		
//  	    		$("#tab_ul").css({"transform":'matrix(1, 0, 0, 1, 0, 0)',"-webkit-transform":'matrix(1, 0, 0, 1, 0, 0)'});	
//
//  	    	}catch(e){
//  	    		
//  	    	}
                myScroll.scrollTo(0, 0);
    	    }
            
//	    		if(state==1){
//	    			if(type==2){
//	    				$('#sk_tips').hide();
//	    			}else{
//	    				
//	    				$('#sk_tips').show();
//	    			}
////	    			$(".sk-title").text(sequence_time+"正式开抢");
//	    			$(".sk-span1").text("距开始： ");
//	    			
////                  if($("#sk_tips").hasClass("countnone")){
////                   	 $("#sk_tips").hide();
////                  }
//	    			
//	    		}else if(state==2&&if_current==1){
////	    			$(".sk-title").text("抢购中 "+time+"开始");
////                  $(".sk-title").text(sequence_time+"正式开抢");
//	    			$("#sk_tips").hide();
//	    		}else if(state==2&&if_current==0){
////	    			$(".sk-title").text("本场次还有商品可以继续抢购");
////                  $(".sk-title").text(sequence_time+"正式开抢");
//	    			$("#sk_tips").hide();
//	    		}else if(state==3){
////	    			$(".sk-title").text("本场次结束");
////                  $(".sk-title").text(sequence_time+"正式开抢");
//                  $("#sk_tips").show();
//                  $('.sk-span1').text('本次秒杀结束');
////	    			$("#sk_tips").hide();
//	    		}

    		
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
    		url:WapSiteUrl+"/api/index.php?act=buyer_seckilling&op=get_sequence_list&time="+Math.random(),
    		dataType:'json',
    		success:function(data){
    			if(data&&data.error==0){

					var html = template.render("tabUl",data);
					$("#tab_ul").html(html);

    				for(var i=0;i<data.result.length;i++){
						if(data.result[i].if_current==1&&data.result[i].sequence_state!=3){
							$("#tab_ul li").eq(i).click();
						}
						if(data.result[i].sequence_state==3&&data.result[i].if_current==1){
							$("#tab_ul li").eq(i+1).click();
						}
						if(data.result[i].sequence_state==2&&data.result[i].if_current==1){
//  						$("#sk_tips").hide();
    						if(data.result[i].sequence_title){
    							$(".sk-title").text("限时限量  入场疯抢");
    						}else{
    							$(".sk-title").text("抢购中 "+data.result[i].sequence_time+"开抢");
    						}
    						
    						loadGoods(data.result[i].sequence_id,2,1);
      						
    					}
						
						
    				}
//  			        if(data.result[0].sequence_state==3){
////  			        	$('.sk-time').hide();
//							$("#tab_ul li").eq(1).click();
//							
//						}
//  				if(data.result[0].countdown){
//							achieveTime(data.result[0].countdown);
//						}else{
////                          $('#sk_tips').hide();
//                          $("#sk_tips").addClass('countnone');
//					}
                   
//	    			if(data.result[0].sequence_state==2&&data.result[0].if_current==1){
////  						
//    						achieveTime(data.result[0].countdown_end);
//  				}

	    			
	    			//banner图加载
	    			var imgs = template.render("sk_banner",data);
	    			$("#sk_tab").after(imgs);
	    			addScroll(data.result.length);
	    		}
    		}
    	});
    }
    //获取所选场次商品列表
    function loadGoods(s_id,state,if_current,if_cover,type){
    	$.ajax({
    		type:"get",
    		url:WapSiteUrl+"/api/index.php?act=buyer_seckilling&op=get_sequence_goods&time="+Math.random(),
    		data:{flag:"wap",sequence_id:s_id},
    		dataType:"json",
    		success:function(data){
    			if(data&&data.error==0){
    				data.result.state = state;
    				data.result.if_current = if_current;
					data.result.if_cover = if_cover;

					var html = template.render("seckillList",data);
					$("#seckill_list").empty();
					$("#seckill_list").html(html);
					
					setTimeout(function(){
						for(var i=0;i<$(".sk-pro").length;i++){
							var cssWidth =  $($(".sk-pro")[i]).attr("width");
							$($(".sk-pro")[i]).css("width",cssWidth);
						}
					});
					

					 $('.sk-s-ready').click(function(){
                     	layer.msg("活动还未开始哦~");
                     	
                    });

					
				    if(data.result[0].countdown){
						achieveTime(data.result[0].countdown);
					}else if(data.result[0].countdown_end){
						achieveTime(data.result[0].countdown_end);
					}
				    
	    		if(state==1){
	    			if(type==2){
	    				$('#sk_tips').hide();
	    			}else{
	    				
	    				$('#sk_tips').show();
	    			}
//	    			$(".sk-title").text(sequence_time+"正式开抢");

                    if(data.result[0].countdown){
                    	$(".sk-span1").text("距开始");
                    }
	    			
//                  if($("#sk_tips").hasClass("countnone")){
//                   	 $("#sk_tips").hide();
//                  }
	    			
	    		}else if(state==2&&if_current==1){
//	    			$(".sk-title").text("抢购中 "+time+"开始");
//                  $(".sk-title").text(sequence_time+"正式开抢");
	    			$("#sk_tips").show();
	    			$(".sk-span1").text("距结束");
	    			
	    		}else if(state==2&&if_current==0){
//	    			$(".sk-title").text("本场次还有商品可以继续抢购");
//                  $(".sk-title").text(sequence_time+"正式开抢");
	    			$("#sk_tips").hide();
	    		}else if(state==3){
//	    			$(".sk-title").text("本场次结束");
//                  $(".sk-title").text(sequence_time+"正式开抢");
                    $("#sk_tips").show();
                    $('.sk-span1').text('本次秒杀结束');
	    			$(".sk-time").hide();
	    			    			
	    		}
					
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
    				$('title').text(title);
    				FL.wxShare(wxTitle,wxDesc,wxLink,wxImg);
    				equipmentCheck(wxTitle,wxDesc,wxImg,wxLink);
    			}
    		}
    	});
    }
    
    function equipmentCheck(_title,_content,_imgs,_url) {
			
			var ss = navigator.userAgent.toLowerCase();
			if (ss.indexOf("fhmall_android") > 0) {				
		        enableShareButton(_title,_content,_imgs,_url);
				
			} else if (ss.indexOf("fhmall_ios") > 0) {
				connectWebViewJavascriptBridge(function(bridge) {
				_bridge = bridge;
				/*JS 接收消息模块*/
				try{
					bridge.init(function(message, responseCallback) {
					
				   });
				}catch(e){
					
				}
				
				enableShare(_title,_content,_imgs,_url);
			    });
				
			} else {
				
				
			}
		 	
		}

		//设置android分享
		function enableShareButton(_title,_content,_imgs,_url) {
	        var sharejson = {
	             "title" : _title,
	             "content" : _content,
	             "imgs" : _imgs,
	             "url" : _url
	         };
	         FHMall.enableShareButton(JSON.stringify(sharejson));
	    }
		
		/* 设置ios浏览器右上角分享按钮 */
		function enableShare(_title,_content,_imgs,_url) {
			var data = {
				"func" : "enableshare",
				"params" : {
					 "title" : _title,
		             "content" : _content,
		             "imgs" : _imgs,
		             "url" : _url
				}
			};
			_bridge.send(data);
		}
		
	var Seckill = function(){
		this.onLoad = function(){
			$(".downLoad-fix").hide();
			if(native_flag==-1){
				$('.fh-header').removeClass('none');
			}
			addcookie("firstShow","no",1);           
			addWindowScroll();
			bindEvent();
			loadList();
			loadWxShare();
		}
	}
	Global.Activity = Global.Activity||{};
	Activity.Seckill = new Seckill(); 

}(this);
