/*************购物车包邮*****************/
!function(Global){
		var num =10,
		curpage=1,
		count = 0,
		stc_id=0,
		order_num=2,//排序规则(商城商品用)
		sort_num=3,
		s_order_num=1,//店铺首页用
		s_sort_num=0,
		regu = /^[-]{0,1}[0-9]{1,}$/,//判断是否是整数;
		store_id = GetQueryString("store_id"),
		total = getcookie("storeTotal"),
		free_limit = GetQueryString("free_limit"),
		has_money=0;//已购买商品的总额
		var type = GetQueryString("type");
		ImgFormat();//图片格式

		ImgFormat();//图片格式



		function loadAllGoods(store_id,sort,order,num,curpage){
			$.ajax({
				type: "get",
				url: WapSiteUrl + "/api/index.php?act=common_goods&op=get_goods_list",
				data: {sid:store_id,sort:sort,order:order ,num: num,curpage: curpage,flag: "wap",is_sale:1},
				dataType: 'json',
				success: function(data) {
					if(data&&data.error==0){
					//	template.helper('parseFloat', parseFloat);
						var goodsHtml = template.render('zGoodsList', data);
						$("#z_goods_list").append(goodsHtml);

						$('#send').click(function(){
							if($(this).hasClass('overhide')){
								$(this).removeClass('overhide');
								$(this).find('i').removeClass('icon-angle-right').addClass('icon-angle-down');
							}else{
								$(this).addClass('overhide');
								$(this).find('i').removeClass('icon-angle-down').addClass('icon-angle-right');
							}

						});
					}
				}
			});
		}
		function addCart(goods_id,goods_source,goods_price){
			if(FL.store_id!="null"){
            	var data =  {token: FL.token,goods_id:  goods_id,quantity: 1,store_id: FL.store_id,mid: FL.mid,flag: 'wap',gc_area: goods_source };
           	}else{
           		var data =  {token: FL.token,goods_id:  goods_id,quantity: 1,mid: FL.mid,flag: 'wap',gc_area: goods_source };
           	}
			 $.ajax({
                    url: WapSiteUrl + '/api/index.php?act=buyer_cart&op=add',
                    type: 'get',
                    dataType: 'json',
                    data:data,
                    success: function(data) {
                        if (data.error==='0') {
                            FL.closeDiv('#mask', 'hide');
                            layer.msg('添加购物车成功');
                            $('#mask').hide();
                            $('.loading-shade').hide();
                            updateTotal(goods_price);
                        }else if(data.error==='0008'){

//                      	location.href='../login/login.html?goods_id='+goods_id;
                            FL.logLogin();

                        }else if(data.error==='2001008'){
                        	 FL.closeDiv('#mask', 'hide');
                           $('#mask').hide();
                           $('.loading-shade').hide()
                        }
                    },
                    error:function(xhr){

                    }
                });
            }
		$(window).scroll(function(){
	        var htmlHeight=document.body.scrollHeight||document.documentElement.scrollHeight;
	        var clientHeight=document.body.clientHeight||document.documentElement.clientHeight;
	        var scrollTop=document.body.scrollTop||document.documentElement.scrollTop;
	        if(scrollTop+clientHeight==htmlHeight){
	        	var showNum = $(".z-goods").length;//当前页面显示的个数
				page = showNum/num + 1; //上拉加载要显示的页数
				if(count != page && regu.test(page)){
					loadAllGoods(store_id,2,1,num,page);
					count = page;
				}else{
                    layer.msg("已经没有商品了");
				}
	        }
	    })
	    //加入购物车点击事件
		$("#shopping").on("click",".media-cart",function(e){
			var me = this;
			var goods_id = $(me).attr("goods_id");
			var goods_source =　$(me).attr("goods_source");
			var goods_price = $(me).attr("goods_price");
			addCart(goods_id,goods_source,goods_price);
			return false;
		});
		//更新购物金额
		function  updateTotal(goods_price){
			has_money =parseFloat(has_money)+ parseFloat(goods_price);
			addcookie("storeTotal",has_money);
			$("#z_price").text("￥"+has_money.toFixed(2));
			if(type=="post"){
				if(parseFloat(has_money)>=parseFloat(free_limit)){
					$(".z-marker").text("已包邮");
				}else{
					$(".z-marker").text("还差"+parseFloat(free_limit-has_money).toFixed(2)+"元包邮");
				}
			}else if(type=="send"){
				sendTotal(has_money);
			}
		}
		//包邮
		function postTotal(){
			$('#z_content>.px-index').show();
			$('#send').remove();
			$("#title").text("提示：以下商品参加满"+parseFloat(free_limit).toFixed(2)+"包邮");
			$("#z_price").text("￥"+parseFloat(total).toFixed(2));
			if(parseFloat(total)>=parseFloat(free_limit)){
				$(".z-marker").text("已包邮");
			}else{
				$(".z-marker").text("还差"+parseFloat(free_limit-total).toFixed(2)+"元包邮");
			}
			has_money = total;
		}
		//满送
		function sendTotal(buyMoney){

			var data = JSON.parse(unescape(getcookie("manzeng")));
			var html ="";
			total = buyMoney;
			$(".z-marker").text("");
			for(var i=0;i<data[store_id].length;i++){
				if(data[store_id][i].gift){

				var dom = '<p class="send-p dis-in-b">提示：满'+data[store_id][i].egt_amount+'减'+(data[store_id][i].minus_amount||0)+'元，送</p>'
//						  +'<a href="goods_details.html?goods_id='+data[store_id][i].gift.goods_id+'" >'
						  +'<span class="send-msg focus-font">'+data[store_id][i].gift.goods_name+'</span><i class="icon-angle-right"></i>';
				html += dom ;

				if(data[store_id][i].minus_amount&&(parseFloat(buyMoney)>parseFloat(data[store_id][i].egt_amount))){
//					if(data[store_id][i].gift){
//						$(".z-marker").text("立减"+parseFloat(data[store_id][i].minus_amount).toFixed(2)+"元,有赠品");
//					}else{
						$(".z-marker").text("立减"+parseFloat(data[store_id][i].minus_amount).toFixed(2)+"元");

//					}
				}

				}
			}
			if($(".z-marker").text()==""){
				var cutMoney = parseFloat(data[store_id][0].egt_amount)-parseFloat(buyMoney);
				$(".z-marker").text("差"+parseFloat(cutMoney).toFixed(2)+"元立减"+parseFloat(data[store_id][0].minus_amount).toFixed(2)+"元");
			}
			$("#send").html(html);
			$("#z_price").text("￥"+parseFloat(buyMoney).toFixed(2)+"元");
			has_money = buyMoney;
			$('#z_content>.pd-index').hide();
		}
	var Pinkage = function(){
		this.onLoad = function(){
			loadAllGoods(store_id,2,1,num,curpage);
			if(type=='post'){
				postTotal();
			}else if(type=='send'){
				sendTotal(total);
			}

		}
	}
	Global.Goods = Global.Goods||{};
	Goods.Pinkage = new Pinkage();
}(this);
