/*************佣金收入*****************/
!function(Global) {
		var num = 10,
		start  = 1,
		sort = 1,
		order = 2,
		state = "",
		source = 'null';
		var regu = /^[-]{0,1}[0-9]{1,}$/; //判断是否是整数;
		var count = 0; //当前商品总数 用来判断是否还要继续加载更多
		var num = 7,
		curpage = 1;
		function loadData(){
			getList();
		}

    var shop_id = getcookie('shop_id');
		//share
		var _title = "我是红人店主，邀您共现创富梦",
				_desc = "【赚钱】独创运营模式，全方位指导，专业团队，引领世界共创富，分红全球购打造亿万大众创富梦想的平台，财富等您加入！！！",
				_pic = "http://www.fenhongshop.com/wap/images/wap/logo.png",
				_url = WapSiteUrl + '/wap/tmpl/mircoshop/shop.html?shop_id=' + shop_id;


		FL.wxShare(_title, _desc, _url, _pic, _desc);

		//
		function getList(num,start,sort,order,state,status,source){
			$.ajax({
				type: "post",
				url: WapSiteUrl + "/api/index.php?act=shoper_commission&op=getmoney",
				data: {mid:FL.mid,token: FL.token,flag: "wap",num:num,start:start,sort:sort,order:order,state:state,source:source},
				dataType: 'json',
				success: function(data) {
					if(data&&data.error=='0'){



						$("#acount").text(data.result.user_acount.toFixed(2));
						$("#freeze").text(data.result.freeze_deduct.toFixed(2));
						$("#available").text(data.result.available_predeposit.toFixed(2));

						if(data&&data.result.deduct_list){
							var html = template.render("commission_list",data.result);
							if(status=="yes"){
								$(".cos-ul2").html(html);
							}else{
								$(".cos-ul2").append(html);
							}
						}else{
							$(".cos-ul2").empty();
						}

						$(".cashBtn").click(function(){
							$("#noinfoDialog").show();
							FL.addShade();
						});
						$('#leftbtn').click(function(){
							$("#noinfoDialog").hide();
							FL.removeShade();
						});
						$('#rightbtn').click(function(){
							$("#noinfoDialog").hide();
							FL.removeShade();
							location.href='http://a.app.qq.com/o/simple.jsp?pkgname=com.fanglin.fenhong.microbuyer';
						});
					}
				}
			});
		}
		$(".cos-ul1 li").click(function(){
			var me = this;
			var state = $(me).attr("tab");
			$(".cos-ul1 li").removeClass("focus-btn");
			$(me).addClass("focus-btn");
			getList(num,start,sort,order,state,"yes",source);
		});
		$("footer button").click(function(){
			var me = this;
			$("footer button").removeClass("active");
			$(me).addClass("active");
			if($(me).index()=='1'){
				source = 'microshop';
			}else{
        source = 'null';
			}
			getList(num,start,sort,order,state,"yes",source);
		});


		$(window).scroll(function() {
			var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
			var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
			var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			if (scrollTop + clientHeight == htmlHeight) {
				var showNum = $(".com-history").length; //当前页面显示的个数
				page = showNum / num + 1; //上拉加载要显示的页数
				if (count != page && regu.test(page)) {
					state=$('.focus-btn').attr('tab');
					getList(num,page,sort,order,state,"no");
					count = page;
				} else {
					//  layer.msg("已经没有商品了");
				}
			}
		})
		var Commission = function(){
			this.onLoad = function(){
				loadData();
			}
		}
		Global.Member = Global.Member||{};
		Member.Commission = new Commission();

}(this);
