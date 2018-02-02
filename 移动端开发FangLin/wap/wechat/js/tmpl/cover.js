!function(Global) {
		var pid = GetQueryString("pid");
		var title = GetQueryString("title");
		var regu = /^[-]{0,1}[0-9]{1,}$/; //判断是否是整数;
		var count = 0; //当前商品总数 用来判断是否还要继续加载更多
		var num = 5,
			page = 1;
			
		
			
		//获取文章列表
		function getArticle(ac_id,page, num,type) {
			$.ajax({
				type: 'get',
				url: WapSiteUrl + "/api/index.php?act=common_article&op=get_article_list",
				data: {ac_id: ac_id,num: num,curpage: page,flag: 'wap'},
				dataType: 'json',
				success: function(data) {
					if (data && data.error == "0") {
						template.helper("format",dateFormat);
						var html = template('cList', data);
						if(type=="yes"){
						    $('#c_list').html(html);
						}else{
						    $('#c_list').append(html);
						}								
					}else{
						if(type=="yes"){
							$('#article').empty();
						}
						
					}
					
				}
			});
		}
				
		//绑定滚动
		$(window).scroll(function() {
			var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
			var clientHeight =  document.documentElement.clientHeight;
			var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			if (scrollTop + clientHeight == htmlHeight) {
				var showNum = $(".c-box").length; //当前页面显示的个数
				page = showNum /5 + 1; //上拉加载要显示的页数
				if (count != page && regu.test(page)) {
					getArticle(ac_id,page, num,"no");
					count = page;
				} else {
					$(".c-bottom").show();
				}
			}
		});
		
		var Cover = function(){
			this.onLoad = function(){
				$("#title").text(title||"分红全球购");
				getArticle(pid,page, num,"yes");
			}
		}
	Global.Wechat=Global.Wechat||{};
	Wechat.Cover=new Cover();
	
}(this);