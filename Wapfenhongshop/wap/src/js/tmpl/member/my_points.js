/*************我的积分*****************/
!function(Global) {
		var num = 10,
			curpage =1,
			regu = /^[-]{0,1}[0-9]{1,}$/,//判断是否是整数;
			count = 0;
		function loadData(curpage,num){
			$.ajax({
				type:'post',
				url:WapSiteUrl+"/api/index.php?act=buyer_account&op=points",
				data:{flag:"wap",mid :FL.mid,start:curpage,num:num},
				dataType:'json',
				success:function(data){
					$("#allPoints").text(data.result.allpoints);
					if(data&&data.error==="0"){
						var html = template.render("myPoints",data.result);
						$("#my_points").append(html);
					}
				},
				error:function(xhr) {
				}
			});
		}
		
		$(window).scroll(function() {
			var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
			var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
			var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			if (scrollTop + clientHeight == htmlHeight) {
				var showNum = $(".pt-li").length;//当前页面显示的个数
				page = showNum/num + 1; //上拉加载要显示的页数
				if(count != page && regu.test(page)){
					loadData(page,num);
					count = page;
				}else{
					layer.msg("没有更多了");
				}
			}
		})
	var myPoints = function(){
		this.onLoad = function(){
			FL.judgeLogin();
			loadData(curpage,num);
		}
	}
	Global.Member = Global.Member||{};
	Member.myPoints = new myPoints(); 

}(this);

