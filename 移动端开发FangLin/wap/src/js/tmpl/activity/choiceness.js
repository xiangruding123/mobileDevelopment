/************jingxuantuijian****************/
!function(Global) {
		var num = 10,
			curpage =1,
			regu = /^[-]{0,1}[0-9]{1,}$/,//判断是否是整数;
			count = 0;
		var area = GetQueryString("area");
		function loadData(num,curpage,area){
			$.ajax({
				type: "get",
				url: WapSiteUrl + "/api/index.php?act=buyer_shopping&op=get_goods_scheme",
				data: {type:"jingxuantuijian",num:num,curpage: curpage,area:area,flag: "wap"},
				dataType: 'json',
				success: function(data) {
					var html = template.render('recommends_list', data);
					$("#recommends").append(html);
					$("#recommends img").lazyload({ threshold : 200 });
				}
			});
		}
		
		$(window).scroll(function() {
			var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
			var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
			var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			if (scrollTop + clientHeight == htmlHeight) {
				var showNum = $(".choiceness-list").length;//当前页面显示的个数
				page = showNum/num + 1; //上拉加载要显示的页数
				if(count != page && regu.test(page)){
					loadData(num,page,area);
					count = page;
				}else{
                    layer.msg("已经没有商品了");
				}
			}
		})
		
		var Choiceness = function(){
			this.onLoad = function(){
				loadData(num,curpage,area);
			}
		}
		Global.Goods = Global.Member||{};
		Goods.Choiceness = new Choiceness(); 

}(this);

