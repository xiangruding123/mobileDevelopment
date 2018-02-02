$(function() {

	var activity_id = GetQueryString('activity_id');

	ImgFormat(); //图片格式

	loadGoods(activity_id);

	function loadGoods(activity_id) {
		$.ajax({
			type: "get",
			url: WapSiteUrl + "/api/index.php?act=buyer_activity&op=get_activity_detail",
			data: {
				activity_id: activity_id,
				type: "hongbao",
				flag: "wap"
			},
			dataType: 'json',
			success: function(data) {

				if (data && data.error == 0) {

					$('title,.header-title').text(data.result.activity_title);
					$('.banner').attr('src', data.result.activity_banner);
					template.helper('parseFloat', parseFloat);
					var html = template.render('floor_tpl', data);
					$('#floor').html(html);

					var html = template.render('activity_slides_tpl', data);
					$('#activity_slides').html(html);

					$("#activity_slides img").lazyload();

					$("#floor img").lazyload();

					AddEvent(data.result.coupon_batchs[0]);

					var title = data.result.share_title,
						share_desc = data.result.share_desc,
						share_img = data.result.share_img,
						_link = window.location.href;

					  var shareObj = {};
					  shareObj.title = data.result.share_title,
						shareObj.desc = data.result.share_desc,
						shareObj.img = data.result.share_img,
						shareObj.url = window.location.href;

					rightShare(shareObj);

					FL.wxShare(title, share_desc, _link, share_img);


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

	//判断领取红包
	function is_gotten(mid, batch_id) {
		$.ajax({
			type: 'get',

			url: WapSiteUrl + "/api/index.php?act=buyer_coupon&op=get_bag_detail",

			data: {
				mid: mid,
				batch_id: batch_id,
				flag: "wap"
			},

			dataType: 'json',

			success: function(data) {

				if (data && data.error === "0") {
					if (data.result.is_gotten == '1') {
						$(".checked").removeClass("none");
						$(".oldy").addClass("none");
					} else {
						$(".oldy").removeClass("none");
						$(".checked").addClass("none");
					}
				}

			}
		})

	}


	function AddEvent(batchs_id) {

		if (native_flag == '0') {
	    var obj = JSON.parse(FHMall.getMemberInfo());
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

						var objInfo = JSON.parse(FHMall.getMemberInfo());
						$(".checked").removeClass("none");
						$(".new").addClass("none");
						is_gotten(objInfo.member_id,batchs_id);
						$('.oldy').click(function(){
						      getbag(objInfo.member_id,objInfo.token,batchs_id);
				        });

				});
			});

		} else if (native_flag == '1') {

			EECross.executeNative("getMemberInfo", null, function(data) {
				var memberInfo = JSON.parse(data);
				$(".checked").removeClass("none");
				$(".new").addClass("none");
				is_gotten(memberInfo.member_id,batchs_id);
				$('.oldy').click(function(){
				         getbag(memberInfo.member_id,memberInfo.token,batchs_id);
		         });
			});

			$(".new").click(function() {

				EECross.executeNative("gotoLogin4Result", null, function(data) {

						var objInfo = JSON.parse(data);
						$(".checked").removeClass("none");
						$(".new").addClass("none");
						is_gotten(objInfo.member_id,batchs_id);
						$('.oldy').click(function(){
									getbag(objInfo.member_id,objInfo.token,batchs_id);
						});

				});

			});



		} else if (native_flag == '-1') {
            if(FL.isWeiXin()==false){
            	$('.fh-header').removeClass('none');
            }

			if (FL.mid) {

				is_gotten(FL.mid, batchs_id);

				//领取红包

				$('.oldy').click(function() {
					getbag(FL.mid, FL.token, batchs_id);
				});

			} else {
				$('.oldy').click(function() {
					FL.logLogin();
				});
			}



		}
	}


	function getbag(mid, token, batch_id) {
		$.ajax({
			type: "post",
			url: WapSiteUrl + "/api/index.php?act=buyer_coupon&op=get_bag",
			data: {
				mid: mid,
				token: token,
				batch_id: batch_id,
				flag: "wap"
			},
			timeout: 3000,
			dataType: "json",
			success: function(data) {

				if (data.error == '0') {
					getCoupon(mid, token, data.result);
				}

			},
			error: function(data) {

				layer.msg("服务器繁忙，请稍候领取");
			},
			complete: function(XMLHttpRequest, status) {
				　　　　
				if (status == 'timeout') {　　　　　
					layer.msg("正在拼命加载，请稍候领取");　　　
				}


			}

		});

	}

	function getCoupon(mid, token, bag_id) {
		$.ajax({
			type: "post",
			url: WapSiteUrl + "/api/index.php?act=buyer_coupon&op=get_coupon",
			data: {
				mid: mid,
				token: token,
				bag_id: bag_id,
				flag: "wap"
			},
			dataType: "json",
			timeout: 3000,
			success: function(data) {
				if (data.error == '0') {
					if (data.result == 'success') {
						layer.msg("你已经成功领取红包");
						$(".checked").removeClass("none");
						$(".oldy").addClass("none");
					} else if (data.result == 'pending') {
						layer.msg('手机号还未注册，快去下载app吧');
						location.href = "http://a.app.qq.com/o/simple.jsp?pkgname=com.fanglin.fenhong.microbuyer";
					}

				}
			},
			error: function() {
				layer.msg("服务器繁忙中，请稍候领取");
			},
			complete: function(XMLHttpRequest, status) {
				　　　　
				if (status == 'timeout') {　　　　　
					layer.msg("正在拼命加载中，请稍候领取");　　　
				}　　
			}

		});
	}


})
