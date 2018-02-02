!function(Global) {
		var batch_id = GetQueryString("batch_id");//红包组id
		var num = 20,
	    	curpage = 1,
	    	count = 0,
	    	bag_id,
	    	mobile,
	    	bag_amount,
	    	regu = /^[-]{0,1}[0-9]{1,}$/;//判断是否是整数;
	    var wx_openid,wx_nickname,wx_headimgurl,wx_phone;	
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
							wx_phone = info.mobile;
							addcookie("wx_openid",wx_openid);
							addcookie("wx_nickname",wx_nickname);
							addcookie("wx_headimgurl",wx_headimgurl);
							addcookie("wx_phone",wx_phone);
						}else if(data.error=="40029"){
							wx_openid = unescape(getcookie("wx_openid"));
							wx_nickname = unescape(getcookie("wx_nickname"));
							wx_headimgurl = unescape(getcookie("wx_headimgurl"));
							wx_phone = unescape(getcookie("wx_phone"));
						}
						is_gotten(batch_id,wx_openid,"wx",wx_phone);
		       	    },
		       	    error:function(xhr){
		       	    }
		 		});
		}
	    
	    //判断红包是否被领取过
	    function is_gotten(batch_id,id,type,wx_phone){
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
	       	    			
	       	    			if(!wx_phone){
	       	    				$("#getbag").show();
		       	    			$("#bag_money").text(data.result.bag_amount);
		       	    			bindEvent();
	       	    			}else{
	       	    				getPacket(wx_phone);
	       	    			}
	       	    			
	       	    		}else{
	       	    			bag_id = data.result.bag_id;
	       	    			$("#ticket").show();
	       	    			mobile = data.result.mobile;
	       	    			template.helper("format", FL.dateFormat); 
		       	    		var html = template.render("bag_content",data.result);
		       	    		$("#bag_title").after(html);
	       	    			loadDetails(mobile,true);
							getBagHistory(batch_id);
						//	addScroll();
	       	    		}
	       	    		bag_amount = data.result.bag_amount;
	       	    	}
	       	  	}
	    	});
	    }
	   	//领取红包
		function getPacket(mobile){
			$.ajax({
	       	    type:'post',
	       	    url:WapSiteUrl+'/api/index.php?act=buyer_coupon&op=get_bag',
	       	    data:{mobile:mobile,batch_id :batch_id,wechat_id:wx_openid,wechat_name:wx_nickname,wechat_avatar:wx_headimgurl,flag:"wap"},
	       	    dataType:'json',
	       	    success:function(data){
	       	    	if(data&&data.error==0){
	       	    		bag_id = data.result;
		       	    	$("#getbag").hide();
		       	    	$("#ticket").show();
	       	    		loadDetails(mobile);
				//		addScroll();
	       	    	}else if(data.error=="2014001"){
	       	    		location.href="empty_packet.html";
	       	    	}else{
	       	    		layer.msg(data.msg||"领取失败");
	       	    	}
	       	    	
	       	  	},
	       	  	complete:function(){
	       	  		$("#grab").removeAttr("disabled");
	       	  	}
	    	});
		}
	
	
		function loadDetails(mobile,getten){
			
			if(getten){
				$("#header_title").text("您已领过了哦！");
			}else{
				$("#header_title").text("恭喜您成功领取红包！");
				getBagTicket(bag_id,mobile);
			}
			$("#phone").text(mobile);
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
	       	    		$("#bag_title").after(html);
	       	    		getBagHistory(batch_id);
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
	       	    		if(data.result=="success"||data.result=="pending"){
	       	    			getBagDetails(wx_openid);
	       	    			
	       	    		}/*else if(data.result=="pending"){
	       	    			
	       	    			layer.msg("您的手机号还未注册,请前往下载分红全球购APP");
	       	    		}*/
	       	    	}
	       	  	}
	    	});
		}
		
		//获取该红包组领取记录
		function getBagHistory(batch_id,type){
			$.ajax({
	       	    type:'get',
	       	    url:WapSiteUrl+'/api/index.php?act=buyer_coupon&op=get_bag_record',
	       	    data:{batch_id:batch_id,num:num,curpage:curpage,flag:"wap"},
	       	    dataType:'json',
	       	    success:function(data){
	       	    	if(data&&data.error==0){
	       	    		var html = template.render("bagHistory",data);
	       	    		if(type=="append"){
	       	    			$("#bag_history").append(html);
	       	    		}else{
	       	    			$("#bag_history").html(html);
	       	    		}
	       	    		$(".wx-money").text(bag_amount+"元");
	       	    		var bag_num = $(".skip-link").length||0;
	       	    		$("#bag_num").text("共20个优惠礼包，已领取"+bag_num+"个");
	       	    		$("#bag_history img").lazyload({ threshold : 200 });
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
					getPacket(mobile);
				}else{
					layer.msg("请输入正确的手机号");
				}
			});
		}
	/*	function addScroll(){
			$(window).scroll(function() {
				var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
				var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
				var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
				if (scrollTop + clientHeight == htmlHeight) {
					var showNum = $(".skip-link").length;//当前页面显示的个数
					page = showNum/num + 1; //上拉加载要显示的页数
					if(count != page && regu.test(page)){
						getBagHistory(batch_id,'append')
						count = page;
					}else{
						layer.msg("没有更多了");
						$(window).unbind("scroll");
					}
				}
			});
		}*/
		//获取分享内容
		function getWxShare(){
			$.ajax({
	       	    type:'get',
	       	    url:WapSiteUrl+'/api/index.php?act=buyer_coupon&op=batch_share',
	       	    data:{batch_id:batch_id,flag:"wap"},
	       	    dataType:'json',
	       	    success:function(data){
	       	    	if(data&&data.error==0){
	       	    		var wx_title=data.result.share_title,
						wx_desc=data.result.share_desc,
						wx_link= bag_details_wx_link+batch_id+"&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect",
						wx_img=data.result.share_img;
						FL.wxShare(wx_title,wx_desc,wx_link,wx_img);
	       	    	}
	       	  	}
	    	});
		}
		var BagDetails = function(){
			this.onLoad = function(){
			//	var time = GetQueryString("batch_id");
		/*		if(!time){
					//PC
					location.href="https://open.weixin.qq.com/connect/qrconnect?appid=wx87f9c1b0f5b48ecc&redirect_uri=http%3A%2F%2Ft.fenhongshop.com%2Fwap%2Ftmpl%2Fpacket%2Fbag_details.html%3Fbatch_id%3D3&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect";
					//wap
				//	location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx87f9c1b0f5b48ecc&redirect_uri=http%3A%2F%2Ft.fenhongshop.com%2Fwap%2Ftmpl%2Fpacket%2Fbag_details.html%3Fbatch_id%3D"+batch_id+"&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect";
				}else{*/
					var code = GetQueryString("code");	
					loadData(code);
					getWxShare();
			}
			
		}
		Global.Packet = Global.Packet||{};
		Packet.BagDetails = new BagDetails(); 

}(this);
