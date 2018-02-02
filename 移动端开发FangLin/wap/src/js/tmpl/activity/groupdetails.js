 /*************团购列表*****************/
!function(Global) {
	
	    var referurl = window.location.href;
	    
	    localStorage.setItem('thirdBack',referurl);
                            
    
	
	 	var group_id = GetQueryString('pintuan_group_id'),			
			pintuan_parent_id = GetQueryString('pintuan_parent_id'),
		    mid,
		    token;
		    
		    
		    //安卓 ios wap信息
		    if(native_flag=='0'){
		    	
		    	var obj = getMemberInfo();		    	
				addcookie('mid',obj.member_id);
				addcookie('token',obj.token);
				
		    }else if(native_flag=="1"){
		    	
			    	connectWebViewJavascriptBridge(function(bridge) {
						_bridge = bridge;
						try{
							bridge.init(function(message, responseCallback) {
							
							
						    });
						}catch(e){
							
						}
					
					    igetMemberInfo();
				    });
				    
				    
				    
		    }else{
		    	mid= getcookie('mid');
		        token=getcookie('token');
		    }
		    
		    
		    
		    if(getcookie('mid')){
		    	
		    	mid= getcookie('mid');
		        token=getcookie('token');
				
			    var data = {group_id:group_id,mid:mid,token:token,pintuan_parent_id:pintuan_parent_id,flag:'wap'};
					
			}else {
				 
			    var data = {group_id:group_id,pintuan_parent_id:pintuan_parent_id,flag:'wap'};
			}
			
			loadDate(data);
		     
		    getPintuanlist(4,1,"yes");
		    
		    
		    
           function getPintuanlist(num,curpage){
           	
	             $.ajax({
		            url: WapSiteUrl + '/api/index.php?act=buyer_pintuan&op=get_pintuan_list',
		            type: 'get',
		            dataType: 'json',
		            data: { num: num,curpage: curpage,flag: 'wap'},
		            success: function(data) {
		                if (data&&data.error == "0") {
		                	console.log(data);
		                	
		                  var html= template.render('list-tpl',data);
							
						   $('#groupgoodslist').html(html);
							
	                       $('#groupgoodslist img').lazyload();
		        
		                }
		            }
		        });
           
           }
   
          
           function loadDate(e){
           	
	           	$.ajax({
		            url: WapSiteUrl + '/api/index.php?act=buyer_pintuan&op=get_group_detail',
		            type: 'get',
		            dataType: 'json',
		            data: e,
		            success: function(data) {
		                if (data&&data.error) {
		                	var res = data.result;
		                	
		                	data.result.agreeurl = WapSiteUrl;
		                	
		                    var html= template.render('goods-tpl',data);
							
						   $('#goods_list').html(html);
	                       $('#goods_list img').lazyload();
	                       
	                        bindEvent(res);	                       
	                       	
	                       	$(".again").click(function(){
	                       		location.href = "group_goods_detail.html?goods_id="+res.goods_id+"&pintuan_id="+res.pintuan_id;
	                       	});
		        
		                }
		            }
		        });
           }
    function bindEvent(res){
    	 //倒计时
		if (res.countdown != '0') {
			var t = res.countdown;
			var t_pay_time = setInterval(function() {
				t--;
				$('#countdown').text(parseInt(t / 3600) + '时' + parseInt(t % 3600 / 60) + '分' + (t % 60) + '秒');
				if (t <= 0) {
					clearInterval(t_pay_time);
					$('#validity_pay_time').hide();
				}
			}, 1000);
		} else {
			$('#validity_pay_time').hide();
		}
		
		//立即参团
		$('.gotoapp').click(function(){	                       	
	                       
           	var goodsId_num = res.goods_id+"|1";
           	var goods_source="0";
           	var if_cart = 0;
           	var pintuan_id = res.pintuan_id;

            var pintuan_parent_id = res.pintuan_parent_id;
            var resource_tags=res.resource_tags || "";
           	  
           	  if(native_flag=='0'){
           	  	
           	  	 androidgenOrder(goodsId_num, goods_source, if_cart, pintuan_id, group_id,pintuan_parent_id,resource_tags);
           	  	 
           	  }else if(native_flag=='1'){
           	  	
           	  	 genOrder(goodsId_num, goods_source, if_cart, pintuan_id, group_id,pintuan_parent_id,resource_tags);
           	  	 
           	  }else{
           	  	
           	  	if(!getcookie('mid')){
           	  		location.href = wxLogin;
           	  	}else{
           	  		          	  		
           	  	    location.href = WapSiteUrl+"/wap/tmpl/order/order_confirmation.html?if_cart="+if_cart+"&area=" + goods_source + "&cart_info=" + goodsId_num +"&pintuan_id="+pintuan_id+ "&pintuan_group_id="+group_id+"&pintuan_parent_id="+pintuan_parent_id+"&miaosha=" + "&resource_tags=" + resource_tags;
	
           	  	}

           	  }
        });
        
        //邀请 分享
        $(".sharebutton").click(function(){
	                       	
       	  	var title,desc,imgs,link,friend_title;
       	  	   
       	  	   title="我邀请你一起来参团,"+res.pintuan_price+"元购买"+res.goods_name;
			   desc =res.goods_desc;
			   imgs = res.goods_image;
       	  	   
			   link = WapSiteUrl+"/wap/tmpl/activity/groupdetail.html?pintuan_group_id="+group_id+"&pintuan_parent_id="+ mid;
				   if(native_flag=='0'||native_flag=='1'){
				   	
						share(title,desc,imgs,link);
						
					}else{

		                 //分享提示
							$('.masksharetip').show();
														
							$('.masksharetip').click(function() {
								$(this).hide();
							})
						

						FL.wxShare(title,desc,link,imgs);
					}
       	});
    }
         //ios login info
    function igetMemberInfo() {
				
		var data = {
			"func" : "getmember",
			"params" : ""
		};

		_bridge.send(data, function(responseData) {
			
				addcookie('member_name',responseData.member_name);
				addcookie('mid',responseData.member_id);
				addcookie('token',responseData.token);
				addcookie('nickname',responseData.member_nickname);				

		});
	}       
        	     //安卓跳转至订单确认页
	function androidgenOrder(goodsId_num, goods_source, if_cart,pintuan_id, resource_tags) {

		var data = {
			"goodsId_num": goodsId_num,
			"goods_source": goods_source,
			"if_cart": if_cart,
			"pintuan_id":pintuan_id,
			"resource_tags": resource_tags
		};

		FHMall.genOrder(JSON.stringify(data));

	}
                 //ios跳转至订单确认页
	function genOrder(goodsId_num, goods_source, if_cart, pintuan_id,pintuan_group_id,pintuan_parent_id,resource_tags) {
		var data = {
			"func": "genOrder",
			"params": {
				"goodsId_num": goodsId_num,
				"goods_source": goods_source,
				"if_cart": if_cart,
				"pintuan_id":pintuan_id,
				"pintuan_group_id":pintuan_group_id,
				"pintuan_parent_id":pintuan_parent_id,
				"resource_tags": resource_tags
			}
		};
		_bridge.send(data);
	} 
	
	     //分享
	    function share(title,content,imgs,url){

	        if(native_flag=='0'){
				   shareByApp(title,content,imgs,url);
			}else if(native_flag=='1'){
				   ishareByApp(title,content,imgs,url);
			}

		}

		function ishareByApp(title,content,imgs,url) {
			var data = {
				"func" : "share",
				"params" : {
					"title" : title,
					"content" : content,
					"imgs" : imgs,
					"justWechat":true,
					"url" : url
				}
			};
			_bridge.send(data, function(responseData) {

			});
		}

		function shareByApp(title,content,imgs,url) {
			var sharejson = {
				"title": title,
				"content": content,
				"imgs": imgs,
				"justWechat":true,
				"url": url
			};
			FHMall.shareByApp(JSON.stringify(sharejson), function(data) {

			});
		}
		  
		 

}(this);
          
           