$(function(){
    			
    			equipmentCheck();


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

    			
				var token;
				
				if (native_flag == 0) {

					// try{
					// 			var objInfo = JSON.parse(FHMall.getMemberInfo());
					// }catch(e){
					// 			objInfo = "fenhong";//安卓报错处理   给附上一个值
					// }
					// if(!objInfo){
                    //
                    //
					// 	FHMall.gotoLogin4Result(function(data) {
                    //
					// 		objInfo = JSON.parse(FHMall.getMemberInfo());
                    //
					// 		if_shoper = objInfo.if_shoper;
					// 		if(if_shoper==1){
                    //
					// 			location.href='shopermoney.html';
                    //
					// 		}
                    //
					// 	});
                    //
					// }else {
                    //
                    //
					// 	var timeand = setInterval(function(){
					// 		try{
					// 			objInfo = JSON.parse(FHMall.getMemberInfo());
					// 			if_shoper = objInfo.if_shoper;
					// 			if(if_shoper == 1){
					// 				clearInterval(timeand);
					// 				location.href = 'shopermoney.html';
                    //
					// 			}
					// 		} catch (e) {
                    //
					// 		}
					// 	}, 300);
					// }

				   $('.goin').removeClass('none');

				   $('.goin').click(function(){
					   
				   	    var obj = FHMall.getMemberInfo();	
						if(!obj){
							
					       	FHMall.toast("您还没有登录，快去登录吧");
					       	
					       	FHMall.logOff();
							
						}else{
							 
					    
					         if_shoper = obj.if_shoper;
				             mid = obj.member_id;
	                         token = obj.token;
	                         
	                         addcookie('mid',mid);
	                         addcookie('token',token);
					       	 if(if_shoper==0){
				    	    		
						    location.href ='goinshop.html?mid='+mid+'&token='+token;
						    
						    }else{
						    	
							FHMall.toast("你已经是微店主了");
							location.href='shopermoney.html';
							
							}
					    }
				   });
				   

					
				}else if(native_flag == 1){
			       
				
			
				connectWebViewJavascriptBridge(function(bridge) {
				_bridge = bridge;
				/*JS 接收消息模块*/
				bridge.init(function(message, responseCallback) {
					
				});
				igetMemberInfo();
			});
			       
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
		                        if_shoper = responseData.if_shoper;  
		                        addcookie('mid',mid);
	                            addcookie('token',token);
	                            
	                            $('.goin').removeClass('none');
	                            try{
	                            	    if(if_shoper==1){
									    	

										location.href='shopermoney.html';
										
										}
	                            }catch(e){
	                            	//TODO handle the exception
	                            }
	                           
	                            
                        	 $('.goin').click(function(){
                        		
	                        	if(if_shoper==0){
					    	    		
							    location.href ='goinshop.html?mid='+mid+'&token='+token;
							    
							    }else if(if_shoper==1){
							    	
								layer.msg("你已经是微店主了");
								location.href='shopermoney.html';
								
								}
                        	
                              });
                             
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
			
			
					
				}else if(native_flag == -1){
					$('.fh-header').removeClass('none');
					$('.goin').removeClass('none');
					if(!FL.token){
						

					    $('.goin').click(function(){
							FL.logLogin();
					    })
					}else{
						
						if(getcookie('if_shoper')=='1'){
							
							location.href = 'shopermoney.html';
							
							$('.goin').click(function(){
								layer.msg('您已经是微店主了');
								setTimeout(function(){
									 location.href = 'shopermoney.html';
								},1500);
					        })
							
						}else{
							$('.goin').click(function(){
						    location.href ='goinshop.html?mid='+FL.mid+'&token='+FL.token;
					       })
						}
						
					}
				}    		
    		
    		})