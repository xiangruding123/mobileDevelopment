/*************分类微店*****************/
!function(Global) {
	    ImgFormat();//图片格式
		function loadData(){
			var cid = GetQueryString("cid");
			var sc_name = GetQueryString("sc_name");
			$(".header-title").text(sc_name);
			$.ajax({
		
				type:'get',
				
				url:WapSiteUrl+"/api/index.php?act=buyer_discovery&op=get_shop_list",
		
				data:{flag:"wap",cid:cid},
		
				dataType:'json',
		
				success:function(data){
					if(data&&data.error==="0"){
						var html = template.render("storeList",data);
						$(".row").append(html);
						$("img").lazyload({ threshold : 200 });
					}
				},
				error:function(xhr) {
		
				}
		
			});
		}
	var DiscoverList = function(){
		this.onLoad = function(){
			loadData();
		}
	}
	Global.Activity = Global.Activity||{};
	Activity.DiscoverList = new DiscoverList(); 

}(this);

