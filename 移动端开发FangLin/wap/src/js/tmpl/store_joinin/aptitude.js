(function($, w, d) {
	'use strict';

	check_login();

	var fl = true;
	var token = FL.token,
		mid = FL.mid;
	$(function() {

		$.ajax({
			type: 'get',
			url: WapSiteUrl + '/api/index.php?act=common_store_joinin&op=company_info',
			data: {
				mid: mid,
				token: token,
				flag: "wap"
			},
			dataType: "json",
			success: function(data) {
				if (data.error === "0") {
					if (data.result.step === '2') {
						location.href = "information.html";
					} else if (data.result.step !== '1') {
						location.href = "payment.html";
					}

					var html = template.render('company_info_tpl', data.result);
					$("#company_info").append(html);


					if ($('#licence-pic').attr('src')) {
						$('#licence-pic').show();
					}
					if ($('#identity-pic').attr('src')) {
						$('#identity-pic').show();
					}

					var txt = '';
					var valtxt = '';
					var that = null;
					var itemid = ''; //表单项id
					var pid = 0; //省份id
					var cid = 0; //城市id
					var val = ''; //表单项值

					//表单滑动层滑入视图
					$('.item').click(function() {

						$('.page-layout').height($(w).height());
						$('.page').show().animate({
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

						$('.ming input').click(function() {
							if ($(this).hasClass('red')) {
								$(this).val('').removeClass('red');
							}

						});

						if (valtxt == "公司所在地") {
							$(".city").show();
							$('.ming').hide();
						} else {
							$(".city").hide();
							$('.ming').show();
						}
						return false;
					});




					//城市级联
					$.ajax({
						type: 'get',
						url: WapSiteUrl + '/api/index.php?act=common_index&op=get_area_list',
						data: {
							pid: "0",
							flag:'wap'
						},
						dataType: "json",
						success: function(data) {
							if (data.error == "0") {
								var length = data.result.length;
								for (var i = 0; i < length; i++) {
									$("#s_province").append("<option area_id=" + data.result[i].area_id + ">" + data.result[i].area_name + "</option>");
								}
							}
						}
					});
					$("#s_province,#s_city").change(function() {
						var theId = $(this).attr('id');
						var nextId = $(this).parent().next().find('select').attr('id');
						pid = $('#' + theId + ' option:selected').attr("area_id");

						$.ajax({
							type: 'get',
							url: WapSiteUrl + '/api/index.php?act=common_index&op=get_area_list',
							data: {
								pid: pid,
								flag:'wap'
							},
							dataType: "json",
							success: function(data) {
								if (data.error == "0") {
									var length = data.result.length;
									$('#' + nextId).html('<option value="">请选择...</option>');
									for (var i = 0; i < length; i++) {
										$('#' + nextId).append("<option area_id=" + data.result[i].area_id + ">" + data.result[i].area_name + "</option>");
									}
								}
							}
						});
					});

					//点击保存数据
					$('.success').click(function() {
						$("p.error").hide(300);
						$(".ming input").click(function() {
							$("p.error").hide(300);
						});
						itemid = that.find('span').attr('id');

						if (itemid == "company_address") {
							if ($("#s_province option:selected").text() != "请选择省份..." &&
								$("#s_city option:selected").text() != "请选择城市..." && $("#s_county option:selected").text() != "请选择地区...") {

								val = $("#s_province option:selected").text() + ' ' + $("#s_city option:selected").text() + ' ' + $("#s_county option:selected").text();
							} else {
								$(".ming").text("请正确选择公司所在地");
								return false;
							}
						} else {
							val = $('.ming input').val();
						}

						if (val && ("请填写" + valtxt) != $('.ming input').attr('value')) {

							if (itemid == "contacts_phone") {
								if (!/^1[1-9][0-9]\d{8}$/.test(val)) {
									$("p.error").show(300);
									$("p.error").text("* 请填写正确的联系人电话");
									return false;
								}
							}

							if (itemid == "contacts_email") {
								var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
								if (!filter.test(val)) {
									$("p.error").show(300);
									$("p.error").text("*请填写正确的邮箱");
									return false;
								}
							}

							if (itemid == "identity_code") {
								var re = /^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
								if (!re.test(val)) {
									$("p.error").show(300);
									$("p.error").text("*请填写正确的身份证号");
									return false;
								}
							}

							var data = eval('({key:"' + key + '",mid:"' + mid + '",' + itemid + ':"' + val + '",flag: "wap"})');
							$.ajax({
								type: 'post',
								url: WapSiteUrl + '/api/index.php?act=common_store_joinin&op=company_info_save',
								data: data,
								dataType: 'json',
								success: function(data) {
									if (data.error === "0") {
										$('.page').hide();
										$('#' + itemid).text(val).removeClass('red');
										that.find('span').text(val);
										fl = true;
									}
								}
							});
						} else {
							$('.ming input').val('请填写' + valtxt);
							$('.ming input').addClass('red');
							return false;
						}
						$('.page').hide();
						return false;
					});


					//滑动层滑出视图
					$('#page .back').click(function() {
						$('.page').animate({
							left: '-800px',
							opacity: 0
						});
						$('.city').hide();
					});


					//上传图片
					$('#business_licence_number_electronic,#identity_code_electronic').change(function() {
						var theId = $(this).attr('id');
						var fd = new FormData();
						fd.append("token", token);
						fd.append("mid", mid);
						fd.append('flag', 'wap');
						fd.append(theId, $(this)[0].files[0]);

						swal({
							title: "",
							text: "正在努力上传...",
							imageUrl: "../images/preloader.gif",
							showConfirmButton: false
						});

						$.ajax({
							type: 'post',
							url: WapSiteUrl + '/api/index.php?act=common_store_joinin&op=company_info_save',
							data: fd,
							processData: false,
							contentType: false,
							dataType: "json",
							success: function(data) {
								if (data.error == "0") {
									swal('', '上传成功！', 'success');
									$('#' + theId).closest('.pic').find('img').attr("src", data.result).show();
									fl = true;
								} else {
									swal('', '上传失败，请重试~', 'error');
									fl = false;
								}
							}

						});
						return false;
					});


					//表单验证
					$('.next').click(function() {

						var business_licence_number_electronic = $(".pic").eq(0).find("img").attr("src");
						var identity_code_electronic = $(".pic").eq(1).find("img").attr("src");

						$('.item span').each(function(index, node) {
							if ($(node).text() === '' || $(node).text() === '请完善此处信息') {
								$(node).text('请完善此处信息').addClass('red');
								fl = false;
							}
						});


						if (!business_licence_number_electronic) {
							swal('', '请上传营业执照电子版', 'info');
							fl = false;
							return false;
						}

						if (!identity_code_electronic) {
							swal('', '请上传身份证电子版', 'info');
							fl = false;
							return false;
						}

						if (!$(".checkbox").attr("checked")) {
							swal('', '您还未同意供应商入驻协议', 'info');
							return false;
						}

						if (!fl) {
							swal('', '您的信息不完善请继续填写', 'info');
							return false;
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
									type: 'post',
									url: WapSiteUrl + '/api/index.php?act=common_store_joinin&op=company_info_submit',
									data: {
										token: token,
										mid: mid,
										flag: "wap"
									},
									dataType: 'json',
									success: function(data) {
										if (data.error == "0") {
											location.href = 'information.html';
										}
									}
								});
							});

						} else {
							return false;
						}

						return false;
					});

					//入驻协议
					$('.agreement').click(function() {
						layer.open({
							type: 2,
							title: '供应商入驻协议',
							shadeClose: true,
							shade: 0.8,
							area: ['75%', '80%'],
							content: 'terms.html'
						});

					});
				}
			}
		});

	});

}($, window, document));