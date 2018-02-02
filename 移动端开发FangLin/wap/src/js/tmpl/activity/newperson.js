$(function() {
	
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
    
    var activity_id=GetQueryString('activity_id');


	loadGoods(activity_id);

	function loadGoods(activity_id) {
		$.ajax({
			type: "get",
			url: WapSiteUrl + "/api/index.php?act=buyer_activity&op=get_activity_detail",
			data: {
				activity_id:activity_id,
				type:"hongbao",
				flag: "wap"
			},
			dataType: 'json',
			success: function(data) {

				if (data && data.error == 0) {
					
					$('title,.header-title').text(data.result.activity_title);
					$('.banner').attr('src',data.result.activity_banner);
					template.helper('parseFloat', parseFloat);
					var html = template.render('floor_tpl', data);
					$('#floor').html(html);
					
					addcookie('batchs_id',data.result.coupon_batchs[0]);
					
					
					
//					$(".old").click(function(){
//						location.href=data.result.activity_slides[0].link;
//					});
					
					var title=data.result.share_title,
					   share_desc=data.result.share_desc,
                       share_img=data.result.share_img,
                       _link=window.location.href;
					
					equipmentCheck(title,share_desc,share_img,_link);
					
					FL.wxShare(title,share_desc,_link,share_img);
					
					$('#floor li').click(function() {
						var goods_id = $(this).attr('data-id');
						if (native_flag == '0'||native_flag == '1') {
							
							location.href = "../shopping/goods_details.html?goods_id=" + goods_id+"&resource_tags="+data.result.resource_tags+"!goodsdetail"
						} else if (native_flag == '-1') {
							location.href = "../shopping/goods_details.html?goods_id=" + goods_id+"&resource_tags="+data.result.resource_tags;
						}
					});
					//计算图片大小
					var imgwidth = parseInt(($("#floor li").width()));
					$("#floor img").css({
						"width": imgwidth + "px",
						"height": imgwidth + "px"
					});
				}
			},
			error: function(data) {
			
			}
		});
	}
	
	
	function is_gotten(mid,batch_id){
		$.ajax({
			type:'get',
				
				url:WapSiteUrl+"/api/index.php?act=buyer_coupon&op=get_bag_detail",
		
				data:{mid:mid,batch_id:batch_id,flag:"wap"},
		
				dataType:'json',
		
				success:function(data){
		
					if(data&&data.error==="0"){
						if(data.result.is_gotten=='1'){
							$(".checked").removeClass("none");
							$(".oldy,.new").addClass("none");
						}else{
							$(".oldy").removeClass("none");
							$(".checked,.new").addClass("none");
						}
					}
						
				}
		})

	}

	function igotoGoodsDetail(goods_id) {
		var data = {
			"func": "togoodsdtl",
			"params": {
				"goods_id": goods_id
			}
		};

		_bridge.send(data);
	}

	function ilogOff() {
		var data = {
			"func": "logoff",
			"params": ""
		};
		_bridge.send(data);
	}
	
	var batchs_id= getcookie('batchs_id');
	
	if (native_flag == '0') {
		var obj = getMemberInfo();
		try {
			var token = obj.token;
		} catch (e) {}
		if (obj) {
			
			$(".checked").removeClass("none");
			$(".new").addClass("none");
			is_gotten(obj.member_id,batchs_id);
			$('.oldy').click(function(){
			         getbag(obj.member_id,obj.token,batchs_id);
	         });
		}
		$(".new").click(function() {
			
			FHMall.gotoLogin4Result(function(data) {

					var objInfo = getMemberInfo();
					$(".checked").removeClass("none");
					$(".new").addClass("none");
					is_gotten(obj.member_id,batchs_id);
					$('.oldy').click(function(){
					      getbag(obj.member_id,obj.token,batchs_id);
			        });
				
			});
		});
		
	} else if (native_flag == '1') {
		
		connectWebViewJavascriptBridge(function(bridge) {
			_bridge = bridge;
			/*JS 接收消息模块*/
			try {
				bridge.init(function(message, responseCallback) {

				});
			} catch (e) {
               
			}
			igetMemberInfo();
		});
		/* 获取会员信息 */

		function igetMemberInfo() {
			var data = {
				"func": "getmember",
				"params": ""
			};
			_bridge.send(data, function(responseData) {
				if (responseData) {
					$(".checked").removeClass("none");
					$(".new").addClass("none");
					is_gotten(responseData.member_id,batchs_id);
					$('.oldy').click(function(){
			         getbag(responseData.member_id,responseData.token,batchs_id);
	                  });
				} else {
					$(".new").click(function() {
						gotoLogin4Result();
					});
				}
			});
		}
		function gotoLogin4Result() {
		var data = {
			"func": "gotoLogin4Result",
			"params": ""
		};

		_bridge.send(data, function(responseData) {

			igetMemberInfo();

		});
	}
       
	} else if (native_flag == '-1') {
		
		$('.fh-header').removeClass('none');
		if (FL.mid) {
			$(".checked").removeClass("none");
			$(".new").addClass("none");
			is_gotten(FL.mid,batchs_id);
			
		}
		$('.oldy').click(function(){
			getbag(FL.mid,FL.token,batchs_id);
	    });
		$(".new").click(function() {
           FL.logLogin();
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
		
		
	function getbag(mid,token,batch_id){
		$.ajax({
			type:"post",
			url:WapSiteUrl+"/api/index.php?act=buyer_coupon&op=get_bag",
			data:{
				mid:mid,	
				token:token,
				batch_id:batch_id,
				flag:"wap"
			},
			dataType:"json",
			success:function(data){
				if(data.error=='0'){					
					getCoupon(mid,token,data.result);
				}
			}
			
		});

	}
	
	function getCoupon(mid,token,bag_id){
		$.ajax({
			type:"post",
			url:WapSiteUrl+"/api/index.php?act=buyer_coupon&op=get_coupon",
			data:{
				mid:mid,	
				token:token,
				bag_id:bag_id,
				flag:"wap"
			},
			dataType:"json",
			success:function(data){
				if(data.error=='0'){
					if(data.result=='success'){
						layer.msg("你已经成功领取红包");
					$(".checked").removeClass("none");
					$(".oldy").addClass("none");
					}else if(data.result=='pending'){
						layer.msg('手机号还未注册，快去下载app吧');
						location.href="http://a.app.qq.com/o/simple.jsp?pkgname=com.fanglin.fenhong.microbuyer";
					}
					
				}
			}
			
		});
	}
	
	$('.question').click(function() {
		$('#mask').show();
	});
	//红包规则
	$('#explain').click(function() {
		$('#mask').show();
	});
	$('#mask,#closebag').click(function() {
		$('#mask').hide();
	});

})
