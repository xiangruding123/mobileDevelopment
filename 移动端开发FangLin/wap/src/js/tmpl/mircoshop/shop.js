		$(function() {
		    // 页面初始化

		    $.init();

		    var regu = /^[-]{0,1}[0-9]{1,}$/; //判断是否是整数;

		    var count = 0; //当前商品总数 用来判断是否还要继续加载更多



		    var curpage_goods = 1,
		        num_goods = 10,
		        curpage_brand = 1,
		        num_brand = 4;



		    var shop_id = GetQueryString('shop_id'),
		        mid = getcookie('mid'),
		        token = getcookie('token');

				localStorage.setItem('shop_id',shop_id);


				FL.getGoodsNum({
            success: loadSuccess
        });

        function loadSuccess(data) {
            if (data && data.error == 0) {
                if (data.result.num != 0) {
                    if (data.result.num > 99) {
                        data.result.num = "99+";
                    }
                    var dom = '<span class="cart-num">' + data.result.num + '</span>';
                    $(".shoppingurl").append(dom);
                    if (data.result.is_global == '1') {
                        $('.shoppingurl').prop('href', '../mircoshop/shopping_cart_global.html');
                    } else {
                        $('.shoppingurl').prop('href', '../mircoshop/shopping_cart_cn.html');
                    }
                }
            }
        }


		    function loadDate(mid, token, shop_id) {


		        FL.ajaxDate('get', get_shop_info_all, {
		            mid: mid,
		            token: token,
		            shop_id: shop_id
		        }, function(data) {

		            var res = data.result;

		            if (FL.mid == res.member_id) {
		                $('.existed').removeClass('none');
		                $('.existedblock').hide();
		            }

		            if (res.shop_logo) {
		                $('.headphoto .shoplogo').prop('src', res.shop_logo);
		            } else {
		                $('.hometip').show();
		            }

		            if (res.shop_banner) {
		                $('.home-top').css('backgroundImage', 'url(' + res.shop_banner + ')');
		            }

		            if (res.shop_name) {
		                $('.headphoto p').html(res.shop_name);
		            }

		            if (res.shop_type == '2') {
		                $('.home-top-bottom span').removeClass('none');
		                $('.iconbutton365').show();
		            } else if (res.shop_type == '3') {
		                $('.iconbutton666').show();
		            }

		            if (res.shop_public_msg) {
		                $('.shop_public_msg').removeClass('none');
		                $('.shop_public_msg>span').html(res.shop_public_msg);
		            }

		            var lH = $(".shop_public_msg span").height();

		            if (lH > 44) {
		                $('.shop_public_msg>span').addClass('overhide');

		            } else {
		                $('#notice').hide();
		            }

		            $('#notice').click(function() {
		                var me = this;

		                if ($(me).hasClass('down')) {
		                    $('.shop_public_msg>span').removeClass('overhide');
		                    $(me).removeClass('down').addClass('up');
		                    $('#notice>span').html('收起');
		                    $(me).find('img').prop('src', '../../images/wap/detail/notice_up.png');
		                } else {
		                    $('.shop_public_msg>span').addClass('overhide');
		                    $(me).removeClass('up').addClass('down');
		                    $('#notice>span').html('展开');
		                    $(me).find('img').prop('src', '../../images/wap/detail/notice.png');
		                }

		            });

		            getBook(shop_id);
		        })

		    }




		    function getShoperBrand(type, curpage_goods, num_goods, curpage_brand, num_brand) {


		        FL.ajaxDate('get', get_shoper, {
		            curpage_goods: curpage_goods,
		            num_goods: num_goods,
		            curpage_brand: curpage_brand,
		            num_brand: num_brand,
		            mid: FL.mid,
		            shop_id: shop_id
		        }, function(data) {
		            if (data && data.error == '0') {
		                var res = data.result;

										if(res.brands_num-4>0){
											$('#more').removeClass('none');
										}

		                var html = template('shopcontentTpl', data);
		                if (type == 'yes') {
		                    $('#shopbrand').html(html);
		                } else {
		                    $('#shopbrand').append(html);
		                }


		                for (var m = 0; m < res.brands.length; m++) {
		                    try {

		                        var tabScrool = new IScroll(".f-handpick-bar" + m, {
		                            scrollX: true,
		                            scrollY: false,
		                            tab: true,
		                            preventDefault: false
		                        });

		                    } catch (e) {
		                        //TODO handle the exception
		                    }
		                }


										for(var i = 0;i<res.brands.length;i++){

													var lH = $($('.notice-text')[i+(curpage_brand-1)*num_brand]).height();

 		                     if (lH > 44) {

 		     		                $($('.notice-text')[i+(curpage_brand-1)*num_brand]).addClass('overhide');

 		     		            } else {
 		     		                $($('.notice')[i+(curpage_brand-1)*num_brand]).hide();
 		     		            }



		                }

		                $('.notice').unbind("click").bind('click',function(){
		                  var me = this;

		                  if ($(me).hasClass('down')) {
		                      $(me).prev('.notice-text').removeClass('overhide');
		                      $(me).removeClass('down').addClass('up');
		                      $(me).find('img').prop('src', '../../images/wap/detail/notice_up.png');
		                  } else {
		                      $(me).prev('.notice-text').addClass('overhide');
		                      $(me).removeClass('up').addClass('down');
		                      $(me).find('img').prop('src', '../../images/wap/detail/notice.png');
		                  }
		                })





		            }



		        });

		    }

		    function getShoper(type, curpage_goods, num_goods, curpage_brand, num_brand) {


		        FL.ajaxDate('get', get_shoper, {
		            curpage_goods: curpage_goods,
		            num_goods: num_goods,
		            curpage_brand: curpage_brand,
		            num_brand: num_brand,
		            mid: FL.mid,
		            shop_id: shop_id
		        }, function(data) {
		            if (data && data.error == '0') {
		                var res = data.result;

		                var html = template('shopGoodsTpl', data);
		                if (type == 'yes') {
		                    $('#shopgoods').html(html);
		                } else {
		                    $('#shopgoods').append(html);
		                }

		                $('.-mob-share-open').unbind("click").bind("click", function() {

		                    var me = this;
		                    if (native_flag == '-1') {
		                        location.href = WapSiteUrl + '/wap/tmpl/shopping/goods_details.html?shareType=share&goods_id=' + $(this).attr('goods_id');
		                    } else {
													var shareObj={};
															shareObj.title = $(me).attr('title'),
															shareObj.desc = $(me).attr('desc'),
															shareObj.img = $(me).attr('img'),
															shareObj.url = WapSiteUrl + '/wap/tmpl/shopping/goods_details.html?goods_id=' + $(me).attr('goods_id');
															appShare(shareObj);
		                    }
		                });
		            }


								$('.gocart').unbind("click").bind('click',function(){

									var self = this;
									if(!mid){
                      FL.logLogin();
									}else{
										var goods_id = $(self).attr('goods_id');
                    var goods_source = $(self).attr('goods_source');
									var data = {
											token: token,
											goods_id: goods_id,
											quantity: '1',
											mid: mid,
											flag: 'wap',
											gc_area: goods_source

									};
                  addShopCar(data);
									}


								})


		        });

		    }

		    //证书数据获取

		    function getBook(shop_id) {
		        FL.ajaxDate('post', get_member_info, {
		            shop_id:shop_id
		        }, function(data) {
		            if (data && data.error == '0') {

		                // 证书显示隐藏
		                $(document).on('click', '.open-about', function() {
		                    $.popup('.popup-about');
		                });

		                $(document).on('click', '.popup-overlay', function() {
		                    $.closeModal('.popup-about');
		                });

		                var res = data.result;

		                $('.bookecode').attr('src', res.micro_shop_qrcode_url);
		                $('.bookname').html(res.card_name);

		                if (res.company_pic_url) {
		                    $('.bookphoto').attr('src', res.company_pic_url);
		                } else {
		                    $('.bookphoto').attr('src', res.person_pic_url);
		                }

		                $('.booknickname').html(res.micro_shop_name);


		                $('.auth_sn').html(res.auth_sn);
		                $('.time').html(res.verify_time);

		            }
		        })
		    }


		    function loadEvent(shop_id) {
		        var _title = "我是红人店主，邀您共现创富梦",
		            _desc = "【赚钱】独创运营模式，全方位指导，专业团队，引领世界共创富，分红全球购打造亿万大众创富梦想的平台，财富等您加入！！！",
		            _pic = "http://www.fenhongshop.com/wap/images/wap/logo.png",
		            _url = WapSiteUrl + '/wap/tmpl/mircoshop/shop.html?shop_id=' + shop_id;
		        //  店铺分享

		        FL.wxShare(_title, _desc, _url, _pic, _desc);
		    }

         //加载更多品牌
				 $('#more').bind('click',function(){
					 location.href = 'morebrand.html';
				 })


		    //绑定滚动
		    var loading = false;

		    // 上次加载的序号

		    var lastIndex = 10;

		    // 注册'infinite'事件处理函数
		    $(document).on('infinite', '.infinite-scroll-bottom', function() {

		        // 如果正在加载，则退出
		        if (loading) return;

		        // 设置flag
		        loading = true;

		        // 模拟1s的加载过程
		        setTimeout(function() {
		            // 重置加载flag
		            loading = false;

		            var showNum = $('.inditem').length; //当前页面显示的个数
		            curpage_goods = showNum / 10 + 1; //上拉加载要显示的页数
		            if (count != curpage_goods && regu.test(curpage_goods)) {

		                getShoper('no', curpage_goods, num_goods, curpage_brand, num_brand);

		                count = curpage_goods;

		            }else {
									// console.log("count="+count);
	                // console.log("curpage="+curpage_goods);
	                $('.toast').remove();
	                $.toast("没有更多内容了");
	                $.detachInfiniteScroll($('.infinite-scroll'));
		             }


		            $.refreshScroller();
		        }, 1000);
		    });

				//添加购物车
				function addShopCar(data) {
						$("#goods-details #addOne").hide();
						$.ajax({
								url: WapSiteUrl + '/api/index.php?act=buyer_cart&op=add',
								type: 'get',
								dataType: 'json',

								data: data,

								success: function(data) {

										if (data.error === '0') {

												$.toast('添加购物车成功');

												FL.getGoodsNum({
								            success: loadSuccess
								        });


										} else if (data.error === '0008') {

												FL.logLogin();

										} else if (data.error === '2001008') {
												$('.loading-shade').hide();
												$('.fh-loading').remove();
										}
								},
								error: function(xhr) {

								}
						});
				}


		    loadDate(mid, token, shop_id);
		    getShoperBrand('yes', curpage_goods, num_goods, curpage_brand, num_brand)
		    getShoper('yes', curpage_goods, num_goods, curpage_brand, num_brand);
		    loadEvent(shop_id);


		});
