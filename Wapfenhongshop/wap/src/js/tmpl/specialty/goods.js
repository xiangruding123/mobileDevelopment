!function(Global) {
	var num = 10,
		order_num =2,
		sort_num =3,
		flag = true,
		key,
		dataType,
		gc_id,
		gc_deep=2,
		regu = /^[-]{0,1}[0-9]{1,}$/;//判断是否是整数;

	var count = 0; //当前商品总数 用来判断是否还要继续加载更多
	var storage=JSON.parse(sessionStorage.getItem("goods"))||[];

	$('.concat_goods_bottom span').text(storage.length);

	var hrefback = GetQueryString('type');
	if(hrefback=='concatpic'){
		$('.concat_goods_bottom').hide();
	}

	ImgFormat();//圖片格式


	//mold:yes页面清空再添加 no直接添加
	function goodsList(num,curpage,key,type,mold) {
		FL.ajaxDate('post',get_time_goods_list,{mid:FL.mid,token:FL.token,num: num,curpage: curpage,key:key,type:type},function(data){
			if (data&&data.error === "0") {
				console.log(data);
				var datagoods = sessionStorage.getItem("goods");
				if(datagoods){
					for(var i=0;i<data.result.length;i++){
						if(datagoods.indexOf(data.result[i].goods_id)>0){
							data.result[i].bound='1';
						}
					}
				}

				var html = template.render('goods_list_tpl', data);
				if(mold=="yes"){
					$(".fh-goods").remove();
				}
				$(".pullUp").before(html);
				$("#goods_list img").scrollLoading();
			}else{
				if(mold=="yes"){
					$(".fh-goods").remove();
				}
			}


			if(hrefback=='concatpic'){
				$('.time_concat_goods').click(function(){
					var  me = this;
					var goods_id = $(me).attr('goods_id');

					if($(me).hasClass('concat_goods')){
						layer.msg('无法与已关联商品关联');
					}else{
						if(storage.length<10){
							var goods_images = $(me).attr('data-img'),
								goods_commission=$(me).attr('goods_commission'),
								goods_name=$(me).attr('goods_name'),
								goods_price=$(me).attr('goods_price'),
								goods_origin=$(me).attr('goods_origin');
							$('.jianchen').show();
							FL.addShade();
							$('.jianchen button').on("click",function(){
								var ind= $(this).attr('ind');
								var value = $('.jianchen input').val();
								if(ind=='1'){
									if(value.length>0){
										$('.jianchen').hide();
										FL.removeShade();
										storage[storage.length]={"goods_id":goods_id,"sort":"0","goods_flag":"true","goods_images":goods_images,goods_commission:goods_commission,goods_name:goods_name,goods_name:goods_name,goods_price:goods_price};
										sessionStorage.setItem('goods',JSON.stringify(storage));
										location.href = "concatpic.html?goods_origin="+goods_origin+"&jianchen="+value;
									}else{
										layer.msg('简称不能为空');
									}
								}

								if(ind=='0'){
									$('.jianchen').hide();
									FL.removeShade();

								}


							})

						}else{
							layer.msg('关联商品不能超过10个');
						}

					}

				});
			}else{
				$('.time_concat_goods').click(function(){
					var  me = this;
					var goods_id = $(me).attr('goods_id');

					if($(me).hasClass('concat_goods')){
						for(var k=0;k<storage.length;k++){
							if(storage[k]&&storage[k].goods_id==goods_id){
								storage.splice(k,1);
								break;
							}
						}
						sessionStorage.setItem('goods',JSON.stringify(storage));
						$(me).removeClass('concat_goods').addClass('no_concat_goods');
						$(me).text("关联");
					}else{
						if(storage.length<10){
							$(me).removeClass('no_concat_goods').addClass('concat_goods');
							var goods_images = $(me).attr('data-img'),
								goods_commission=$(me).attr('goods_commission'),
								goods_name=$(me).attr('goods_name'),
								goods_price=$(me).attr('goods_price');
							storage[storage.length]={"goods_id":goods_id,"sort":"0","goods_images":goods_images,goods_commission:goods_commission,goods_name:goods_name,goods_name:goods_name,goods_price:goods_price};
							sessionStorage.setItem('goods',JSON.stringify(storage));
							$(me).text("已关联");

						}else{
							layer.msg('关联商品不能超过10个');
						}

// <<<<<<< HEAD
// 	                    var html = template.render('goods_list_tpl', data);
// 	                    if(mold=="yes"){
// 	                    	$(".fh-goods").remove();
// 	                    }                                  
// 	                    $(".pullUp").before(html);
// 	                    $("#goods_list img").scrollLoading();
// 	                }else{
// 	                	if(mold=="yes"){
// 	                		$(".fh-goods").remove();
// 	                	}
// 	                }
//
//
// 						if(hrefback=='concatpic'){
// 							$('.time_concat_goods').click(function(){
// 								var  me = this;
// 								var goods_id = $(me).attr('goods_id');
//
// 								if($(me).hasClass('concat_goods')){
// 									layer.msg('无法与已关联商品关联');
// 								}else{
// 									if(storage.length<10){
// 										var goods_images = $(me).attr('data-img'),
// 											goods_commission=$(me).attr('goods_commission'),
// 											goods_name=$(me).attr('goods_name'),
// 											goods_price=$(me).attr('goods_price'),
// 											goods_origin=$(me).attr('goods_origin');
// 										$('.jianchen').show();
// 										FL.addShade();
// 										$('.jianchen button').on("click",function(){
// 											var ind= $(this).attr('ind');
// 											var value = $('.jianchen input').val();
// 											if(ind=='1'){
// 												if(value.length>0){
// 													$('.jianchen').hide();
// 													FL.removeShade();
// 													storage[storage.length]={"goods_id":goods_id,"goods_images":goods_images,goods_commission:goods_commission,goods_name:goods_name,goods_name:goods_name,goods_price:goods_price};
// 													sessionStorage.setItem('goods',JSON.stringify(storage));
// 													location.href = "concatpic.html?&goods_origin="+goods_origin;
// 												}else{
// 													layer.msg('简称不能为空');
// 												}
// 											}
//
// 											if(ind=='0'){
// 												$('.jianchen').hide();
// 												FL.removeShade();
//
// 											}
//
//
// 										})
//
// 									}else{
// 										layer.msg('关联商品不能超过10个');
// 									}
//
// 								}
//
// 							});
// 						}else{
// 							$('.time_concat_goods').click(function(){
// 								var  me = this;
// 								var goods_id = $(me).attr('goods_id');
//
// 								if($(me).hasClass('concat_goods')){
// 									for(var k=0;k<storage.length;k++){
// 										if(storage[k]&&storage[k].goods_id==goods_id){
// 											storage.splice(k,1);
// 											break;
// 										}
// 									}
// 									sessionStorage.setItem('goods',JSON.stringify(storage));
// 									$(me).removeClass('concat_goods').addClass('no_concat_goods');
// 									$(me).text("关联");
// 								}else{
// 									if(storage.length<10){
// 										$(me).removeClass('no_concat_goods').addClass('concat_goods');
// 										var goods_images = $(me).attr('data-img'),
// 											goods_commission=$(me).attr('goods_commission'),
// 											goods_name=$(me).attr('goods_name'),
// 											goods_price=$(me).attr('goods_price');
// 										storage[storage.length]={"goods_id":goods_id,"goods_images":goods_images,goods_commission:goods_commission,goods_name:goods_name,goods_name:goods_name,goods_price:goods_price};
// 										sessionStorage.setItem('goods',JSON.stringify(storage));
// 										$(me).text("已关联");
//
// 									}else{
// 										layer.msg('关联商品不能超过10个');
// 									}
//
// 								}
// 								$('.concat_goods_bottom span').text(storage.length);
//
// 							});
// 						}
//
//
//
// 			            bindRefresh();
// 		 });
//     }
//    
//     function bindEvent(){
//     	$(".nav_li li").click(function(){
//     		var me = this;
// =======
					}
					$('.concat_goods_bottom span').text(storage.length);

				});
			}



			bindRefresh();
		});
	}

	function bindEvent(){
		$(".nav_li li").click(function(){
			var me = this;
			dataType = $(me).attr("data-type");

			$(me).addClass("active").siblings('li').removeClass("active");

			goodsList(num,'1',"",dataType,"yes");

		});
		// 搜索


		$('#goods_search').bind('keydown',function(event){

			if (event.keyCode==13){
				$('.icon-search').click();
			}

		})
		$('.icon-search').click(function(event) {
			key =$.trim($('#goods_search').val());
			var curpage=1;
			gc_id='';
			//           goodsList("yes",order_num,order_num,curpage,key,gc_id,is_own);
			goodsList(num,curpage,key,"","yes");
			curpage++;

			//          $.ajax({
			//              url: WapSiteUrl+'/api/index.php?act=common_goods&op=add_search_history',
			//              type: 'post',
			//              dataType: 'json',
			//              data: {token: FL.token,mid:FL.mid,flag:'wap',keywords:key,is_own:is_own},
			//              success:function(data){
			//
			//              }
			//          });

		});
	};

	//  function sortPrice(me,method){
	//  	if(method=="desc"){
	//  		$(me).find('i').attr("class","icon-sort-down");
	//  		order_num = 2;
	//  		sort_num = 2;
	//  		goodsList("yes",2,2,1,key,gc_id,is_own);
	//  	}else{
	//  		$(me).find('i').attr("class","icon-sort-up");
	//  		order_num = 1;
	//  		sort_num = 2;
	//  		goodsList("yes",1,2,1,key,gc_id,is_own);
	//  	}
	//
	//  }
	//绑定滚动
	function bindRefresh() {
		$(window).scroll(function() {
			var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
			var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
			var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			if (scrollTop + clientHeight +46 > htmlHeight) {
				var showNum = $(".media").length; //当前页面显示的个数
				curpage = showNum / 10 + 1; //上拉加载要显示的页数
				if (count != curpage && regu.test(curpage)) {
					//					goodsList("no",order_num,sort_num,curpage,key,gc_id,is_own);
					goodsList(num,curpage,key,dataType,"no");
					count = curpage;
				} else {
					layer.msg("已经没有商品了");
				}
			}
		})
	}

	//          gc_id = GetQueryString('gc_id');
	//			goodsList("yes",order_num,sort_num,1,key,gc_id,is_own);
	goodsList(num,"1",key,"bought","no");

	bindEvent();

	$('.concat_goods_bottom button').click(function(){
		location.href = "add_time.html";
	});

	$('.concat_goods_bottom p').click(function(){
		location.href = "concat_goods.html";
	});





}(this);



















