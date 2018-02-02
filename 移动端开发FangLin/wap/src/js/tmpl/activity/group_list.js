/*************团购列表*****************/
!function(Global) {
	
		function loadData(){
			$.ajax({
		
				type:'get',
				
				url:WapSiteUrl+"/api/index.php?act=buyer_groupbuy&op=get_groupbuy_class",
		
				data:{flag:"wap"},
		
				dataType:'json',
		
				success:function(data){
		
					if(data&&data.error==="0"){
						var html = template.render("groups",data);
		
						$(".group-list").remove();
		
						$("#group_lists").append(html);
						$("#group_lists img").lazyload({ threshold : 200 });
					}
				},
				error:function(xhr) {
		
				}
		
			});
		}
		
		function bindEvent(){
			$(".goback").click(function(){
				location.replace("../index/index.html");
			});
		}
	var GroupList = function(){
		this.onLoad = function(){
			loadData();
			bindEvent();
		}
	}
	Global.Goods = Global.Goods||{};
	Goods.GroupList = new GroupList(); 

}(this);

