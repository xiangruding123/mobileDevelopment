$(function() {
	try{
		FL.load();
	}catch(e){ 
		 
	}
	
	            equipmentCheck();
	
			    // 设备检测
			    var mid,token,flag;	    
			    
			    if(native_flag == '1'){
			   
				    var _bridge;
				        
					function connectWebViewJavascriptBridge(callback) {
						if (window.WebViewJavascriptBridge) {
							callback(WebViewJavascriptBridge);
						} else {
							document.addEventListener('WebViewJavascriptBridgeReady', function() {
								callback(WebViewJavascriptBridge);
							}, false);
						}
					}
			     }
			    
			    $('#btn_checkin').unbind('click');
			    
				
				
				if (native_flag == '0') {
					
				    	
				    	try{
				    		var objInfo = JSON.parse(FHMall.getMemberInfo());		
				    	}catch(e){
				    		objInfo = "fenhong";//安卓报错处理   给附上一个值
				    	}
						
						
					    
					    if(!objInfo){
					    	
					    						    	
					    	FHMall.gotoLogin4Result(function(data) {
					    		
					                 objInfo = JSON.parse(FHMall.getMemberInfo());
					                 
					            	 mid = objInfo.member_id,token = objInfo.token,member_mobile = objInfo.member_mobile,flag="android";					  
							         addcookie("mid",mid);
	                                 addcookie("token",token);
	                                 addcookie("member_mobile", member_mobile);
					       
					                 checkins(mid,token,flag);
					            
				            });
					      
					    }else{
					    	
					    		
							
								var timeand = setInterval(function(){
									try{
									objInfo = JSON.parse(FHMall.getMemberInfo());
									mid = objInfo.member_id,token = objInfo.token,member_mobile = objInfo.member_mobile,flag="android";	
					       	        checkins(mid,token,flag);
							       	}catch(e){
										
									}
					           },300);
							
					       
					        
					    }
					
				    	
					
				} else if (native_flag == '1') {
					
					flag="ios";
					
					connectWebViewJavascriptBridge(function(bridge) {
						_bridge = bridge;
						/*JS 接收消息模块*/
						try{
							bridge.init(function(message, responseCallback) {
							
						    });
						}catch(e){
							
						}
					
						igetMemberInfo();
					});
							
						   /* 获取会员信息 */
                function igetMemberInfo() {
                    var data = {
                        "func" : "getmember",
                        "params" : ""
                    };
                    
                    _bridge.send(data, function(responseData) {  
                         
                        if(responseData==null){
							    
								gotoLogin4Result();
							

                        }else{
                        	
                        	
                        	
					        mid = responseData.member_id;
	                        token = responseData.token;
	                        member_mobile = responseData.member_mobile;	                      
	                        
	                        addcookie("mid",mid);
	                        addcookie("token",token);
	                        addcookie("member_mobile", member_mobile);
	                        
					        checkins(mid,token,flag);
					        
	                        
	                        
	                        
                        }
                        
                    });
                }
                    
                  function gotoLogin4Result() {
						var data = {
							"func" : "gotoLogin4Result",
						    "params" : ""
					    };
					    					    
					    _bridge.send(data, function(responseData) {						
                           
                                	igetMemberInfo();
						
						});
					}
			
				
					
					
				} else if (native_flag == -1) {
					
					$('.fh-header').removeClass("none");
					
					mid = FL.mid,token=FL.token,flag="wap";
					
					if(!token){
						layer.open({
						btn: ['点此登录'],
						content: "登录后才能签到",
						yes: function(index) {
							FL.logLogin();
							
						}
					});
					}
					
					checkins(mid,token,flag);
					
				}
				
				
				//获取签到信息
				function checkins(mid,token,flag){
					
					$.ajax({
						type: "post",
						url: WapSiteUrl + "/api/index.php?act=common_checkin&op=checkin_index&time="+Math.random(),
						data: {
							mid: mid,
							token: token,
							flag: flag
						},						
						dataType: 'json',
						success: function(data) {  
						  
							if (data.error === '0') { 
								
								$("#hassign").html(data.result.total_checks);
								$("#tel").html(data.result.member_name);
								$("#score").html(data.result.member_points);
								initLine(data.result.check_sequence);
								openBox();
								if(data.result.is_checked){
									$('#btn_checkin').css('background-color','#999');
								}else{
									$('#btn_checkin').css('background-color','#FF4B4B');
								}
								
								if(native_flag==1||native_flag==0){
									
									$('.recharge').prop('href','recharge.html?mid='+mid+'&token='+token);
								    
								}else{
									$('.recharge').prop('href','down.html');
								}
								
								$('#btn_checkin').bind('click');
								
								clearInterval(timeand);
								
							}
					},
					error: function() {
					    
					}
						
					
					 
				});
				}
				
				$('body').css('height', window.screen.height + 'px');
				$(".rele_shuo").click(function() {
					$(".mask_rule").show();
					$(".content").show();
					$('body').css('overflow','hidden');
				})
				$(".close_rule").click(function() {
					$(".mask_rule").hide();
					$(".content").hide();
					$('body').css('overflow','auto');
				})
				$(".mask_rule").click(function() {
					$(this).hide();
					$(".content").hide();
					$('body').css('overflow','auto');
				})
				$('.close_rule span').click(function() {
					$('.mask_rule').hide();
				});
				var currckinnum = 0; // 连续签到天数
				//根据签到天数初始化红条
				function initLine(num) {
						currckinnum = num;
						if (num == 0) { //签到天数为0;
							$("div.quanl").removeClass("curr");
						} else if (num == 7) {
							$("div.quanl").addClass("curr");
							$("div.quanr").addClass("curr");
							$("div.linered").css({
								width: (12.5 * (num + 1)) + "%"
							});
						} else {
							$("div.quanl").addClass("curr");
							$("div.linered").css({
								width: (12.5 * num) + "%"
							});
						}
						for (var i = 1; i <= num; i++) {
							$("div.i" + i).addClass("curr");
						}
					}
					//打开箱子

				function openBox() {
						var $i7 = $(".i7");
						if ($(".i7").hasClass("curr")) {
							$i7.find("img").attr("src", "img/baoxiang-open.png");
						}
					}
					//组织签到成功的文字

				function initText(score) {
						var points_arr = [10, 15, 20, 20, 20, 20, 50];
						var html = "已经连续签到{0}天，获得{1}个积分，明日继续可得到{2}积分";
						return FL.formatStr(html, currckinnum, score, currckinnum == 7 ? 10 : points_arr[currckinnum]);
					}
					//点击签到
				$("#btn_checkin").click(function() {
					
					$.ajax({
						type: "post",
						url: WapSiteUrl + "/api/index.php?act=common_checkin&op=checkin_do",
						data: {
							mid: mid,
							token: token,
							flag: flag
						},
						dataType: 'json',
						success: function(data) {
							if (data.error === "0") { //成功获取签到信息.
								var currhassign = parseInt($("#hassign").html());
								$("#hassign").html(currhassign + 1); //总签到数字+1
								var currscore = parseInt($("#score").html());
								$("#score").html(currscore + parseInt(data.result));
								initLine(currckinnum + 1);
								var txt = initText(data.result);
								openBox();
								
								layer.open({
									title: '签到成功',
									content: txt,
									btn: ['确定'],
									yes: function(index) {
										location.reload();
									}
								});
							}else{
								
								var txt= data.msg;
								layer.open({	
									
									content: txt
									
								});
							}
						}
					});
				});
				
				
			});