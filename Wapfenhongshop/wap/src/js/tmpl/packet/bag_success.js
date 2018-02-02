!function(Global) {
		var batch_id = GetQueryString("batch_id");//红包组id
		    batch_id=2;
	    var member_name = GetQueryString("member_name");	        
        var deduct_userid = member_name.split('deduct_userid')[1];
            member_name = member_name.split('deduct_userid')[0];

        //var bag_success_wx_link = "https%3a%2f%2fopen.weixin.qq.com%2fconnect%2foauth2%2fauthorize%3fappid%3dwx5853a3512939c939%26redirect_uri=http%3A%2F%2Fwww.fenhongshop.com%2Fwap%2Ftmpl%2Fpacket%2Fbag_success.html%3F";


        var headimgurl = GetQueryString('headimgurl');
	        sessionStorage.setItem('member_name',member_name);
	        sessionStorage.setItem('deduct_userid',deduct_userid);
            
	var num = 20,
	    	curpage = 1,
	    	count = 0,
	    	bag_id,
	    	mobile,
	    	bag_amount,
	    	regu = /^[-]{0,1}[0-9]{1,}$/;//判断是否是整数;
	    var wx_openid,wx_nickname,wx_headimgurl;	
	    //获取用户微信信息
	    function loadData(code){
			
		 	//获取三方用户信息
		 	$.ajax({
		       	    type:'post',
		       	    url:WapSiteUrl+'/api/index.php?act=common_member&op=get_third_account_info',
		       	    data:{code:code,type:"wx",flag:"wap"},
		       	    dataType:'json',
		       	    success:function(data){
		       	    	if(data.error==0){
							var info = data.result;
							wx_openid = info.openid;
							wx_nickname = info.nickname;
							wx_headimgurl = info.headimgurl;
							addcookie("wx_openid",wx_openid);
							addcookie("wx_nickname",wx_nickname);
							addcookie("wx_headimgurl",wx_headimgurl);
						}else if(data.error=="40029"){
							wx_openid = unescape(getcookie("wx_openid"));
							wx_nickname = unescape(getcookie("wx_nickname"));
							wx_headimgurl = unescape(getcookie("wx_headimgurl"));
						}
						is_gotten(batch_id,wx_openid,"wx");
						wxshare(batch_id,wx_openid,wx_nickname,wx_headimgurl);
		       	    },
		       	    error:function(xhr){
		       	    }
		 		});
		}
	    
	    //判断红包是否被领取过
	    function is_gotten(batch_id,id,type){
	    	var newData
	    	if(type=="wx"){
	    		 newData = {batch_id:batch_id,flag:"wap",wechat_id:id};
	    	}else if(type=="mid"){
	    		 newData = {batch_id:batch_id,flag:"wap",mid:FL.mid};
	    	}
	    	$.ajax({
	       	    type:'get',
	       	    url:WapSiteUrl+'/api/index.php?act=buyer_coupon&op=get_bag_detail',
	       	    data:newData,
	       	    dataType:'json',
	       	    success:function(data){
	       	    	if(data&&data.error==0){
	       	    		if(data.result.is_gotten==0){
	       	    			$("#bag_success").show();
	       	    			$("#bagMoney").text(data.result.bag_amount);
							$('#person').text(sessionStorage.getItem('member_name'));
//							if(sessionStorage.getItem('headimgurl')){
//								$('.phone').prop('src',sessionStorage.getItem('headimgurl'));
//							}
	       	    			bindEvent();
	       	    		}else{
	       	    			bag_id = data.result.bag_id;
	       	    			$("#ticketbag").show();
	       	    			mobile = data.result.mobile;
	       	    			template.helper("format", FL.dateFormat); 
		       	    		var html = template.render("bag_content",data.result);
		       	    		$("#bag_content_box").html(html);
	       	    			loadDetails(mobile,true);
//							getBagHistory(batch_id);
						//	addScroll();
	       	    		}

						
	       	    		bag_amount = data.result.bag_amount;
	       	    	}
	       	  	}
	    	});
	    }
	   	//领取红包
		function getPacket(mobile){
			var deduct_userid = sessionStorage.getItem('deduct_userid');

			$.ajax({
	       	    type:'post',
	       	    url:WapSiteUrl+'/api/index.php?act=buyer_coupon&op=get_bag',
	       	    data:{mobile:mobile,batch_id :batch_id,wechat_id:wx_openid,wechat_name:wx_nickname,wechat_avatar:wx_headimgurl,flag:"wap",deduct_userid:deduct_userid},
	       	   //data:{mobile:mobile,batch_id :batch_id,wechat_id:wx_openid,wechat_name:wx_nickname,wechat_avatar:wx_headimgurl,flag:"wap"},

	       	   dataType:'json',
	       	    success:function(data){
	       	    	if(data&&data.error==0){
	       	    		bag_id = data.result;
		       	    	$("#bag_success").hide();
		       	    	$("#ticketbag").show();
	       	    		loadDetails(mobile);
				//		addScroll();
	       	    	}else if(data.error=="2014001"){
	       	    		location.href="empty_packet.html";
	       	    	}else{
	       	    		layer.msg(data.msg||"领取失败");
	       	    	}
	       	    	$("#grab").removeAttr("disabled");
	       	  	}
	       	  	
	    	});
		}
	
	
		function loadDetails(telphone,getten){
			
			if(getten){
//				$("#header_title").text("您已领过了哦！");
			}else{
//				$("#header_title").text("恭喜您成功领取红包！");
				getBagTicket(bag_id,mobile);
			}
			$("#phone").text(telphone);
		}
		//获取红包详情
		function getBagDetails(wx_openid){
			$.ajax({
	       	    type:'get',
	       	    url:WapSiteUrl+'/api/index.php?act=buyer_coupon&op=get_bag_detail',
	       	    data:{batch_id:batch_id,wechat_id:wx_openid,flag:"wap"},
	       	    dataType:'json',
	       	    success:function(data){
	       	    	if(data&&data.error==0){
	       	    		template.helper("format", FL.dateFormat); 
	       	    		var html = template.render("bag_content",data.result);
	       	    		$("#bag_content_box").html(html);

	       	    	}
	       	  	}
	    	});
		}
		//领取红包中的现金券
		function getBagTicket(bag_id,mobile){
			$.ajax({
	       	    type:'post',
	       	    url:WapSiteUrl+'/api/index.php?act=buyer_coupon&op=get_coupon',
	       	    data:{bag_id:bag_id,mobile:mobile,flag:"wap"},
	       	    dataType:'json',
	       	    success:function(data){
	       	    	if(data&&data.error==0){
	       	    		if(data.result=="success"){

                            getBagDetails(wx_openid);

	       	    		}else if(data.result=="pending"){

							getBagDetails(wx_openid);

	       	    		}
	       	    	}
	       	  	}
	    	});
		}
		

		function bindEvent(){
			//红包规则
			$('#explain').click(function(){
				$('#mask').show();
			});
			$('#mask,#closebag').click(function(){
				$('#mask').hide();
			});
			//点击抢红包
			$("#grab").click(function(){
				var me = this;
				mobile = $("#mobile").val();
				if(/^1[3|4|5|7|8|9][0-9]\d{4,8}$/.test(mobile)&&/^1\d{10}$/.test(mobile)){
					$(me).attr("disabled","disabled");

					$.ajax({
						type:'get',
						url:WapSiteUrl+"/api/index.php?act=common_member&op=check_phone",
						data:{mobile:mobile,flag:"wap"},
						dataType:'json',
						success:function(data){
							if(data.error==1000011||data.error==0){
								getPacket(mobile);
							}else{
								layer.msg("您手机号已注册");
								$("#grab").removeAttr("disabled");
							}

						}
					});



				}else{
					layer.msg("请输入正确的手机号");
				}
			});
			$('#sharebtn').click(function(){
				$('.masksharetip').show();
			});


			$('.masksharetip').click(function(){
				$(this).hide();
			})
		}

		//分享内容
        function wxshare(batch_id,wechat_id,member_name,wx_headimgurl){
			var title,desc,imgs,url;
			title='分红全球购送你168元新人现金大礼！';
			desc ='中国真正的跨境直购平台送你168元现金大礼！真正购物能抵现！足不出户享海外价格';
			imgs = WapSiteUrl+'/wap/images/red-packet/bagshare.jpg';
			//url  = bag_success_wx_link +"member_name%3d"+member_name+"deduct_userid"+wechat_id+"%26headimgurl%3d"+wx_headimgurl+"%26batch_id%3d"+batch_id+"%26response_type=code&scope=snsapi_login&state=STATE#wechat_redirect";
            url  = bag_success_wx_link +"member_name="+member_name+"deduct_userid"+wechat_id+"&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect";
            //url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5853a3512939c939&redirect_uri=http://www.fenhongshop.com/wap/tmpl/packet/bag_success.html?member_name="+member_name+"deduct_userid"+wechat_id+"&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect";
            

			FL.wxShare(title,desc,url,imgs);
		}

	$('#phonetxtchange').click(function(){
		$('#bag_success').show();
		$('#person').text(sessionStorage.getItem('member_name'));
//	    if(headimgurl){
//			$('.phone').prop('src',sessionStorage.getItem('headimgurl'));
//		}
		$('#ticketbag').hide();
		bindEvent();
	});
	$('#sharebtn').click(function(){
		$('.masksharetip').show();
		setTimeout(function(){
			$('.masksharetip').hide();
		},3000);
	});
	$('.masksharetip').click(function(){
		$(this).hide();
	});
	$(".gotoindex").click(function(){
		
		addcookie('member_name', "");

        addcookie('mid', "");                          

        addcookie('token', "");

        addcookie('member_mobile', "");
        
        addcookie('nickname',"");        
		
	})
	var BagSuccess = function(){
			this.onLoad = function(){
		
					var code = GetQueryString("code");	
					loadData(code);

			}
			
		}
		Global.Packet = Global.Packet||{};
		Packet.BagSuccess = new BagSuccess();

}(this);
