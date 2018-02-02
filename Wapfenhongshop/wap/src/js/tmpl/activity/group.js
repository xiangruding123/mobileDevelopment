/*************团购列表*****************/ ! function(Global) {

	ImgFormat(); //圖片格式
    var count = 0;
    regu = /^[-]{0,1}[0-9]{1,}$/;//判断是否是整数;
	var index = GetQueryString('index');

	$("#group-index-title li").click(function() {
		var me = this;
		$(me).addClass('active').siblings('li').removeClass('active');
		$('.groupselect').eq($(me).index()).removeClass('none').siblings('.groupselect').addClass('none');
	});

	
    personDate();
    
	var num = 10,
		curpage = 1;
    
	getPintuanlist(10, 1, "yes");
	

	function getPintuanlist(num, curpage, type) {
		$.ajax({
			url: WapSiteUrl + '/api/index.php?act=buyer_pintuan&op=get_pintuan_list',
			type: 'get',
			dataType: 'json',
			data: {
				num: num,
				curpage: curpage,
				flag: 'wap'
			},
			success: function(data) {
				if (data && data.error == "0") {
					var html = template.render('groupTpl', data);
					if (type == "yes") {
						$('.groupselect').eq(0).html(html);
					} else {
						$('.groupselect').eq(0).after(html);
					}
					$('.groupselect img').lazyload();
					
					bindRefresh();

				}
			}
		});

	}
	//获取用户信息
	function personDate() {
		if (native_flag == '0') {
			var flag = 'android';
			var obj = getMemberInfo();

			if (!obj) {
				FHMall.gotoLogin4Result(function(data) {

					var objInfo = getMemberInfo();
					var mid = obj.member_id;
					var token = obj.token;
					var member_name = obj.member_name;
					var nickname = obj.member_nickname;

					addcookie('mid', obj.member_id);
					addcookie('token', obj.token);
					addcookie('member_name', obj.member_name);
					addcookie('nickname', obj.member_nickname);

				});
			} else {
				addcookie('mid', obj.member_id);
				addcookie('token', obj.token);
				addcookie('member_name', obj.member_name);
				addcookie('nickname', obj.member_nickname);
			}

		} else if (native_flag == '1') {
			connectWebViewJavascriptBridge(function(bridge) {
				_bridge = bridge;
				try {
					bridge.init(function(message, responseCallback) {

					});
				} catch (e) {

				}
				igetMemberInfo();
			});
			var flag = 'ios';

		} else if (native_flag == '-1') {
			$('.fh-header').removeClass('none');
			if (!FL.mid) {
                if(FL.isWeiXin()){
				  location.href= wxLogin;
				}else{
					location.href = WapSiteUrl + "/wap/tmpl/login/login.html";
				}	
			}
			
			var flag = 'wap';
		}
		var mid = getcookie('mid'),
			token = getcookie('token');

		getMylist(10, 1,flag,mid,token, "yes");


	}

	function igetMemberInfo() {
		var data = {
			"func": "getmember",
			"params": ""
		};

		_bridge.send(data, function(responseData) {
			if (responseData == null) {

				gotoLogin4Result();

			} else {
				addcookie('member_name', responseData.member_name);
				addcookie('mid', responseData.member_id);
				addcookie('token', responseData.token);
				addcookie('nickname', responseData.member_nickname);


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

	

	function getMylist(num, curpage,flag,mid,token, type) {
		$.ajax({
			url: WapSiteUrl + '/api/index.php?act=buyer_pintuan&op=get_group_list&test=1',
			type: 'post',
			dataType: 'json',
			data: {
				num: num,
				curpage: curpage,
				flag: flag,
				token: token,
				mid: mid
			},
			success: function(data) {
				if (data && data.error == "0") {
					var html = template.render('mygroupTpl', data);
					if (type == "yes") {
						$('#mygrouplist').html(html);
					} else {
						$('#mygrouplist').after(html);
					}
					console.log(data);
					$('#mygrouplist img').lazyload();
					
					myListbindRefresh();

				}
			}
		});
	}

	

	function bindRefresh() {
		$(window).scroll(function() {
			var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
			var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
			var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			if (scrollTop + clientHeight == htmlHeight) {
				var showNum = $('.groupselect').eq(0).find(".groupGoods").length; //当前页面显示的个数
				page = showNum / num + 1; //上拉加载要显示的页数
				if (count != page && regu.test(page)) {					
					getPintuanlist(num, page, "no");
					count = page;
				} else {
					layer.msg("已经没有商品了");
				}
			}
		})
	}
	
	function myListbindRefresh() {
		$(window).scroll(function() {
			var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
			var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
			var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			if (scrollTop + clientHeight == htmlHeight) {
				var showNum = $('.groupselect').eq(1).find(".groupGoods").length; //当前页面显示的个数
				page = showNum / num + 1; //上拉加载要显示的页数
				if (count != page && regu.test(page)) {
					getMylist(num, page,flag,mid,token, "no");
					count = page;
				} else {
					layer.msg("已经没有商品了");
				}
			}
		})
	}

}(this);