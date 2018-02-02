/*************品牌馆*****************/
!function(Global) {
		var num = 10,
			curpage =1,
			regu = /^[-]{0,1}[0-9]{1,}$/,//判断是否是整数;
			count = 0;
		var area = GetQueryString("area");
		function loadData(num,curpage,area){
			$.ajax({
				type: "get",
				url: WapSiteUrl + "/api/index.php?act=buyer_shopping&op=get_brandhouse_brands",			
				data: {num: num,curpage: curpage,flag: "wap"},
				dataType: 'json',
				success: function(data) {
					var html = template.render('brandLists', data);
					$("#brand_lists").append(html);
					$("#brand_lists img").lazyload({ threshold : 200 });
	
				}
			});
		}
		
		$(window).scroll(function() {
			var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
			var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
			var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			if (scrollTop + clientHeight == htmlHeight) {
				var showNum = $(".brand-list").length;//当前页面显示的个数
				page = showNum/num + 1; //上拉加载要显示的页数
				if(count != page && regu.test(page)){
					loadData(num,page,area);
					count = page;
				}else{
				}
			}
		})
		var Brand = function(){
			this.onLoad = function(){
				loadData(num,curpage,area);
			}
		}
		Global.Goods = Global.Member||{};
		Goods.Brand = new Brand(); 

}(this);

