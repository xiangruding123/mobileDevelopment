$(function(){
			    	
			    	equipmentCheck();
			    	
			    	if(native_flag==-1){
			    		if(FL.mid){
			    			var  wx_title,wx_desc,wx_link,wx_img;
			    		      mid=FL.mid;
			    		$('.fh-header').removeClass('none');
			    		
			    		$('#direct').click(function(){
			    			$('#mask').show();
			    			setTimeout(function(){
				   		    $('#mask').click();
				   	        },5000);
			    		});
			    		
			    		$('#mask').click(function(){
			    			$('#mask').hide();
			    		});
			    		var mathNum = Math.floor(Math.random()*3);
			    			mid = getcookie('mid');
			    			if(unescape(getcookie('nickname'))=='null'||unescape(getcookie('nickname'))==''){
								member_name = unescape(getcookie('member_name'));
							}else{
								member_name = unescape(getcookie('nickname'));
							}
			    		if(mathNum==0){
			    	    	wx_title='我是'+member_name+',成为我的合伙人，有钱一起赚！';
			    	        wx_desc = '【免费】分销享分红，人人都是网购创业家！一键分销坐拥全球好货，赚钱神器！';
			    	    }else if(mathNum==1){
			    	    	wx_title='【钱，一起赚】既然遇见了，何不干一场！';
			    	        wx_desc = '我是'+member_name+'我不是招募你，我是在给你机会！0成本0风险，佣金厚，动动手指向钱看~';
			    	    }else{
			    	    	wx_title='成为我的合伙人，有钱一起赚！';
			    	        wx_desc = '我是'+member_name+',我在招募合伙人！0成本0风险0门槛，一起分销全球尖货，动动手指就能赚钱啦~';
			    	    }
			    		
                        //设置微信分享信息
      			
		      			wx_link = WapSiteUrl+'/wap/tmpl/member/partner.html?mid='+mid;
		      			wx_img = WapSiteUrl+'/wap/images/wap/logo.png';
		                
						FL.wxShare(wx_title,wx_desc,wx_link,wx_img);
			    		}else{
			    			FL.logLogin();
			    		}
			    		
			    		
			    	}else if(native_flag==0){
			    		
			    			
		    			var obj = getMemberInfo();

		    			if(!obj){
		    				
		    				FHMall.gotoLogin4Result(function(data) {
			                    var objInfo = getMemberInfo();
			            	    addcookie('mid',obj.member_id);
				    			addcookie('token',obj.token);
				    			addcookie('member_name',obj.member_name);
				    			addcookie('nickname',obj.member_nickname);

				            });
		    			}else{

							addcookie('mid',obj.member_id);
							addcookie('token',obj.token);
							addcookie('member_name',obj.member_name);
							addcookie('nickname',obj.member_nickname);

						}

			    		
			    		$('#direct').click(function(){
			    			var mathNum = Math.floor(Math.random()*3);
			    			mid = getcookie('mid');
			    			if(unescape(getcookie('nickname'))=='undefined'||unescape(getcookie('nickname'))==''){
						member_name = unescape(getcookie('member_name'));
					}else{
						member_name = unescape(getcookie('nickname'));
					}
			    			 if(mathNum==0){
			    	    	title='我是'+member_name+',成为我的合伙人，有钱一起赚！';
			    	desc = '【免费】分销享分红，人人都是网购创业家！一键分销坐拥全球好货，赚钱神器！';
			    	    }else if(mathNum==1){
			    	    	title='【钱，一起赚】既然遇见了，何不干一场！';
			    	desc = '我是'+member_name+'我不是招募你，我是在给你机会！0成本0风险，佣金厚，动动手指向钱看~';
			    	    }else{
			    	    	title='成为我的合伙人，有钱一起赚！';
			    	desc = '我是'+member_name+',我在招募合伙人！0成本0风险0门槛，一起分销全球尖货，动动手指就能赚钱啦~';
			    	    }
			    		  shareByApp(title,desc,WapSiteUrl+'/wap/images/wap/logo.png',WapSiteUrl+'/wap/tmpl/member/partner.html?mid='+mid);
				          function shareByApp(title,content,imgs,url) {
					          var sharejson = {
									"title": title,
									"content": content,
									"imgs": imgs,
									"url": url
							  };
								FHMall.shareByApp(JSON.stringify(sharejson), function(data) {
//									 
								});
			              }
				          
			    		})

			    		
			    	}else if(native_flag==1){
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

	                        addcookie('member_name',responseData.member_name);
                            addcookie('mid',responseData.member_id);
                            addcookie('token',responseData.token);                       
                            addcookie('nickname',responseData.member_nickname);
	                        
                        }
                        
                    });
                }
                
                
                
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
			
			
			function gotoLogin4Result() {
						var data = {
							"func" : "gotoLogin4Result",
						    "params" : ""
					    };
					    					    
					    _bridge.send(data, function(responseData) {						
                           
                                	igetMemberInfo();
						
						});
			}
                
                
                  
                        
                   
                        $('#direct').click(function(){
                        	mid = getcookie('mid');
                        	if(unescape(getcookie('nickname'))=='null'||unescape(getcookie('nickname'))==''){
						    member_name = unescape(getcookie('member_name'));
					        }else{
						    member_name = unescape(getcookie('nickname'));
					        }
                        	
                        	 var mathNum = Math.floor(Math.random()*3);
                        	 if(mathNum==0){
			    	    	title='我是'+member_name+',成为我的合伙人，有钱一起赚！';
			    	desc = '【免费】分销享分红，人人都是网购创业家！一键分销坐拥全球好货，赚钱神器！';
			    	    }else if(mathNum==1){
			    	    	title='【钱，一起赚】既然遇见了，何不干一场！';
			    	desc = '我是'+member_name+'我不是招募你，我是在给你机会！0成本0风险，佣金厚，动动手指向钱看~';
			    	    }else{
			    	    	title='成为我的合伙人，有钱一起赚！';
			    	desc = '我是'+member_name+',我在招募合伙人！0成本0风险0门槛，一起分销全球尖货，动动手指就能赚钱啦~';
			    	    }
                        	ishareByApp(title,desc,WapSiteUrl+"/wap/images/wap/logo.png",WapSiteUrl+"/wap/tmpl/member/partner.html?mid="+mid);
                        });
                        
                        /* 分享 */
			function ishareByApp(title,content,imgs,iosurl) {
				var data = {
					"func" : "share",
					"params" : {
						"title" : title,
						"content" : content,
						"imgs" : imgs,
						"url" : iosurl
					}
				};
				_bridge.send(data, function(responseData) {					
					
				});
			}
                        
            
                        
			    	}
			    })