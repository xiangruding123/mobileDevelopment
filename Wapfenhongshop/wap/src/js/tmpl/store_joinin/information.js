(function($, w, d) {
	'use strict';

	check_login();
	var token = FL.token;
	var mid = FL.mid;
	$(function() {
		$.ajax({
			type: "get",
			url: WapSiteUrl + "/api/index.php?act=common_store_joinin&op=store_info",
			data: {
				mid: mid,
				token: token,
				flag: "wap"
			},
			dataType: "json",
			success: function(data) {
				if (data.result.step >= 3) {
					location.href = "payment.html";
				}
				if (data.error == "0") {
					var html = template.render('store_info_tpl', data.result);
					$("#store_info").append(html);

					var txt = '';
					var valtxt = '';
					var that = null;
					var itemid = ''; //表单项id
					var val = ''; //表单项值
					var post_key = ''; //参数键
					var post_val = ''; //参数值
					var gc_ids = ''; //经营类目id(逗号隔开)
					var gc_names = ''; //经营类目名称(逗号隔开)

					//表单滑动层滑入视图
					$('#info-form .item').each(function(index, item) {
						$(item).click(function() {
							var page_type = '#page';
							switch (index) {
								case 2:
									page_type = '.pagesel';
									break;
								case 3:
									page_type = '.classify';
									break;
								case 4:
									page_type = '.type';
									break;
							}
							$('.page-layout').height($(w).height());
							$(page_type).show().animate({
								left: 0,
								opacity: 1
							});
							$("html,body").animate({
								scrollTop: "0px"
							}, 200);

							that = $(this);
							txt = $(this).find('span').text();
							valtxt = $(this).find('label').text();
							$("section .info").hide();

							if (!txt || $(this).find('span').hasClass('red')) {
								$('.ming input').val("");
								$('.ming input').attr('placeholder', "请填写" + valtxt);
							} else {
								$('.ming input').attr('value', txt);
							}

							if (valtxt == "店铺名称") {
								$('#page .red').text("*店铺名称提交申请后不可修改，请认真填写。");
							} else if (valtxt === '商家帐号') {
								$('#page .red').text("*此账号为日后登录并管理商家中心时使用, 注册后不可修改，请牢记。");
							}

							return false;
						});
					});

					//滑动层滑出视图
					$('.back').click(function() {
						$('.page').animate({
							left: '-800px',
							opacity: 0
						});
					});

					//点击验证并保存数据
					$('.success').click(function() {

						$("p.error").hide(300);
						$(".ming input").click(function() {
							$("p.error").hide(300);
						});
						itemid = that.find('span').attr('id');
						var pattern = '';
						var error_tip = '';
						var valid = true;

						switch (itemid) {
							case 'seller_name':
								pattern = /^[a-zA-Z0-9]{5,16}$/;
								error_tip = '*商家账号必须为5-16位数字、字母组成';
								post_key = itemid;
								break;
							case 'store_name':
								pattern = /^.{5,16}$/;
								error_tip = '*店铺名称必须为5-16位字符组成';
								post_key = itemid;
								break;
							case 'sg_name':
								pattern = '.pagesel';
								error_tip = '*请选择店铺等级';
								post_key = 'sg_id';
								break;
							case 'sc_name':
								pattern = '.classify';
								error_tip = '*请选择店铺分类';
								post_key = 'sc_id';
								break;
							case 'store_class':
								pattern = '.type';
								error_tip = '*请选择经营类目';
								break;
						}

						if (typeof pattern !== 'string') {
							val = $('.ming input').val();

							if (!pattern.test(val)) {
								valid = false;
							} else {
								post_val = val;
							}
						} else {
							if (pattern !== '.type') {
								post_val = $(pattern).find('select option:selected').val();
								val = $.trim($(pattern).find('select option:selected').text());
								if (!post_val) valid = false;
							} else {
								gc_ids = '';
								gc_names = '';
								val = '';
								$(pattern).find('#itemfi,#itemse,#itemtr').each(function(index, node) {
									var $opt = $(node).find('option:selected');
									var opt_val = $opt.val();
									var opt_text = $opt.text();
									gc_ids += ',' + opt_val;
									gc_names += ',' + opt_text;
									val += '<li class="scope-list">' + opt_text + '</li>';
									if (!Number(opt_val)) {
										valid = false;
									}
								});
								gc_ids = gc_ids.slice(1);
								gc_names = gc_names.slice(1);
								if (valid) {
									val = val + '<li class="scope-list red"' + 'data-scope="' + gc_ids + '|' + gc_names + '")>删除</li>';
								}
							}
						}

						if (itemid === 'store_class') {
							$('.scope-list.red').each(function(index, node) {
								if ((gc_ids + '|' + gc_names) === $(node).attr('data-scope')) {
									swal('', '不能重复选择经营类目', 'warning');
									valid = false;
								}
							});
						}

						if (!valid) {
							$("p.error").show(300);
							$("p.error").text(error_tip);
							return false;
						}

						if (val && ("请填写" + valtxt) != $('.ming input').attr('value')) {
							var data = '';

							if (gc_ids) {
								data = eval('({token:"' + token + '",mid:"' + mid + '",gc_ids:"' + gc_ids + '",gc_names:"' + gc_names + '",flag: "wap"})');

							} else {
								data = eval('({token:"' + token + '",mid:"' + mid + '",' + post_key + ':"' + post_val + '",flag: "wap"})');
							}

							$.ajax({
								type: 'post',
								url: WapSiteUrl + '/api/index.php?act=common_store_joinin&op=store_info_save',
								data: data,
								dataType: 'json',
								success: function(data) {
									if (data.error === "0") {
										$('.page').hide();
										if (itemid === 'store_class') {
											$(val).appendTo('.typeinfo ul');
											$('#' + itemid).text('');
										} else {
											if (itemid === 'sg_name') {
												val = val.slice(0, 8);
											}
											that.find('span').text(val).removeClass('red');
										}
									} else {
										switch (data.error) {
											case '1001006':
												swal('', '此账号名称已存在，换一个呗~', 'warning');
												valid = false;
												break;
											case '1001007':
												swal('', '此店铺名称已存在，换一个吧~', 'warning');
												valid = false;
												break;
										}
									}
									if (valid) {
										$('.page').hide();
									}
								}
							});
						} else {
							$('.ming input').val('请填写' + valtxt);
							$('.ming input').css({
								'color': '#ff4b4b'
							});
							return false;
						}
						return false;
					});


					//获取经营类目
					$.ajax({
						type: "get",
						url: WapSiteUrl + "/api/index.php?act=common_goods&op=get_goods_class",
						dataType: "json",
						data: {
							pid: 0,
							area: 0,
							flag: 'wap'
						},
						success: function(data) {
							if (data.error === "0") {
								var length = data.result.length;
								for (var i = 0; i < length; i++) {
									$("#itemfi").append("<option value=" + data.result[i].gc_id + ">" + data.result[i].gc_name + "</option>");
								}
							}
						}
					});
					$("#type select").change(function() {

						//根据选择重置相关select
						var next_select = '';
						switch ($(this).attr('id')) {
							case 'itemfi':
								$("#itemse").html("<option>请选择经营类目（二）</option>");
								$("#itemtr").html("<option>请选择经营类目（三）</option>");
								next_select = '#itemse';
								break;
							case 'itemse':
								$("#itemtr").html("<option>请选择经营类目（三）</option>");
								next_select = '#itemtr';
								break;
						}

						var pid = $(this).find("option:selected").attr("value");

						if (next_select) {
							$.ajax({
								type: "get",
								url: WapSiteUrl + "/api/index.php?act=common_goods&op=get_goods_class",
								dataType: "json",
								data: {
									pid: pid,
									area: 0,
									flag: 'wap'
								},
								success: function(data) {

									if (data.error == "0") {
										for (var i = 0, length = data.result.length; i < length; i++) {
											$(next_select).append("<option value=" + data.result[i].gc_id + ">" + data.result[i].gc_name + "</option>");
										}
									}
								}
							});
						}

					});

					//删除经营类目
					$('.typeinfo').delegate('.scope-list.red', 'click', function() {
						var scope = $(this).attr('data-scope');
						var scope_arr = scope.split('|');
						var ids = scope_arr[0];
						var names = scope_arr[1];
						var $this_scope = $(this);
						swal({
								title: "",
								text: "您确定删除该经营类目吗？",
								type: "warning",
								showCancelButton: true,
								cancelButtonText: '取消',
								confirmButtonColor: "#DD6B55",
								confirmButtonText: "确定",
								closeOnConfirm: false
							},
							function() {
								$.ajax({
									type: 'post',
									url: WapSiteUrl + '/api/index.php?act=common_store_joinin&op=store_class_del',
									data: {
										token: token,
										mid: mid,
										flag: "wap",
										gc_ids: ids,
										gc_names: names
									},
									dataType: 'json',
									success: function(data) {
										if (data.error == "0") {
											$this_scope.prev().prev().prev().remove();
											$this_scope.prev().prev().remove();
											$this_scope.prev().andSelf().remove();
											swal('', '删除成功！', 'success');
										} else {
											swal('', '删除失败，请重试~', 'error');
										}
									}
								});
							});

					});

					//提交审核
					$(".next").click(function() {
						var fl = true;
						$('.item span:not(#store_class)').each(function(index, node) {

							if ($(node).text() === '' || $(node).text() === '请完善此处信息') {
								$(node).text('请完善此处信息').addClass('red');
								fl = false;
							}
						});

						if ($('.scope-list').length === 0) {
							$('#store_class').text('请选择经营类目').addClass('red');
							fl = false;
						}

						if (fl) {
							swal({
								title: "",
								text: "信息一旦确定不可修改，你确定吗？",
								type: "warning",
								showCancelButton: true,
								cancelButtonText: '取消',
								confirmButtonColor: "#DD6B55",
								confirmButtonText: "确定",
								closeOnConfirm: false
							}, function() {
								$.ajax({
									type: "post",
									url: WapSiteUrl + "/api/index.php?act=common_store_joinin&op=store_info_submit",
									dataType: "json",
									data: {
										token: token,
										mid: mid,
										flag: "wap"
									},
									success: function(data) {
										if (data.error == "0") {
											if (data.result.step === "3") {
												location.href = "payment.html";
											}
										}
									}
								});
							});
						} else {
							swal('', '您的信息不完善请继续填写', 'info');
							return false;
						}
					});
				}
			}
		});
	});
}($, window, document));