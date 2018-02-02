! function(Global) {
	var batch_id = GetQueryString("batch_id");//红包组id

    //var bag_success_wx_link = "https%3a%2f%2fopen.weixin.qq.com%2fconnect%2foauth2%2fauthorize%3fappid%3dwx5853a3512939c939%26redirect_uri=http%3A%2F%2Fwww.fenhongshop.com%2Fwap%2Ftmpl%2Fpacket%2Fbag_success.html%3F";

	function bindEvent() {

        $(".friendBtn").click(function(){
        	
			if (native_flag == '0' || native_flag == '1') {
				personDate();
			}
			mid = getcookie('mid');
			if (unescape(getcookie('nickname')) == 'null' || unescape(getcookie('nickname')) == 'undefined') {
				member_name = unescape(getcookie('member_name'));
			} else {
				member_name = unescape(getcookie('nickname'));
			}
            
			var title, desc, imgs, url;

			title = '分红全球购送你168元新人现金大礼！';
			desc = '中国真正的跨境直购平台送你168元现金大礼！真正购物能抵现！足不出户享海外价格';
			imgs = WapSiteUrl + '/wap/images/red-packet/bagshare.jpg';

			url = bag_success_wx_link +"member_name%3d"+member_name+"deduct_userid"+mid+"%26response_type%3dcode%26scope%3dsnsapi_login%26state%3dSTATE%23wechat_redirect";

			if (native_flag == '0' || native_flag == '1') {
								
				var shareObj ={};
				    shareObj.title = title,
					shareObj.desc = desc,
					shareObj.img = imgs,
					shareObj.url = url;
				
				
				appShare(shareObj);
				
			} else {

                //url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx5853a3512939c939&redirect_uri=http://www.fenhongshop.com/wap/tmpl/packet/bag_success.html?member_name="+member_name+"deduct_userid"+mid+"&response_type=code&scope=snsapi_login&state=STATE#wechat_redirect";

				FL.wxShare(title, desc, url, imgs);
			}
       });
		
        //红包规则
		$('#explain').click(function() {
			$('#mask').show();
		});
		$('#mask,#closebag').click(function() {
			$('#mask').hide();
		});

		//分享提示
		if (native_flag == '-1') {
			$('.friendBtn').click(function() {
				$('.masksharetip').show();
				setTimeout(function() {
					$('.masksharetip').hide();
				}, 3000);
			});
			$('.masksharetip').click(function() {
				$(this).hide();
			})
		}

	}

	//获取用户信息
	function personDate() {
		if (native_flag == '0'||native_flag == '1') {
			
				
			// 用户信息
			appMemberInfo({
                success: getMemberInfo
            });

		    function getMemberInfo(obj) {
		    
		        //app数据添加token
		        addcookie('mid', obj.member_id);
				addcookie('token', obj.token);
				addcookie('member_name', obj.member_name);
				addcookie('nickname', obj.member_nickname);
		
		    }

		} else if (native_flag == '-1') {
			$('.fh-header').removeClass('none');
			if (!FL.mid) {

				FL.logLogin();
			}
			var flag = 'wap';
		}
		var mid = getcookie('mid'),
			token = getcookie('token');

		invitationRewards(mid, token, flag);


	}


	

	function invitationRewards(mid, token, flag) {
		$.ajax({
			type: "get",
			url: WapSiteUrl + "/api/index.php?act=buyer_coupon&op=invitation_rewards&time=" + Math.random(),
			data: {

				token: token,
				mid: mid,
				flag: flag
			},
			dataType: 'json',
			success: function(data) {

				if (data.error === '0') {

					template.helper("dateFormat", FL.dateFormat);
					var html = template.render('bagHistory', data);
					$('#articlebox').html(html);
					$('.sharehide').hide();
				}				

			},
			error: function(e) {

			}
		});
	}

	function invitationRankings(flag) {
		$.ajax({
			type: "get",
			url: WapSiteUrl + "/api/index.php?act=buyer_coupon&op=invitation_rankings&time=" + Math.random(),
			data: {

				flag: flag
			},
			dataType: 'json',
			success: function(data) {
				if (data.error == '0') {
					var html = template.render('topList-tpl', data);
					$('#topListTitle').html(html);
				}
			},
			error: function(e) {

			}
		});
	}

	var Friend = function() {
		this.onLoad = function() {
			bindEvent();
			invitationRankings("wap");
			personDate();

		}

	}

	Global.Packet = Global.Packet || {};
	Packet.Friend = new Friend();

}(this);