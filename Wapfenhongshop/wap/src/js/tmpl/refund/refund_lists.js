!function(Global) {
  	 var num = 5,
    	curpage = 1,
    	count = 0,
    	regu = /^[-]{0,1}[0-9]{1,}$/;//判断是否是整数;
  	function loadData(curpage,num,type){
  		$.ajax({
			type:"post",
			url:WapSiteUrl+"/api/index.php?act=buyer_order&op=get_refund_list",
			data:{flag:"wap",mid:FL.mid,token:FL.token,curpage:curpage,num:num},
			dataType:"json",
			success:function(data){
				if(data&&data.result){
					template.helper("doms",formatDom);
				
					var html = template.render("goodsLists",data);
					if(type=="append"){
						$("#goods_lists").append(html);
					}else{
						$("#goods_lists").html(html);
					}
				
					bindEvent();
				}
			}
		});
  	}
  	
  	function formatDom(data){
  		var div = document.createElement("span");
  		$(div).attr("class","overhide h35 ");
　　		div.innerHTML = data;
  		return  div;
  	}
  	$(window).scroll(function() {
		var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
		var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
		var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
		if (scrollTop + clientHeight == htmlHeight) {
			var showNum = $(".fh-order").length;//当前页面显示的个数
			page = showNum/num + 1; //上拉加载要显示的页数
			if(count != page && regu.test(page)){
				loadData(page,num,"append");
				count = page;
			}else{
                layer.msg("没有更多了");
			}
		}
	});
	function bindEvent(){
		$(".check").click(function(){
			var me =this;
			var state_id =$(me).attr("state_id");
			var refund_id =$(me).attr("refund_id");
			var order_id = $(me).attr("order_id");
			location.href = "refund_progress.html?refund_id="+refund_id+"&order_id="+order_id;
		});
	}
  	
	var Refunds = function(){
		this.onLoad = function(){
			loadData(curpage,num,"html");
		 }
	}
	Global.Goods = Global.Goods||{};
	Goods.Refunds = new Refunds(); 

}(this);
