/*************分类微店*****************/
!function(Global) {
	
		function loadData(){
			$.ajax({
		
				type:'post',
				
				url:WapSiteUrl+"/api/index.php?act=shoper_manage&op=get_shop_list",
		
				data:{flag:"wap",mid :FL.mid,token:FL.token},
		
				dataType:'json',
		
				success:function(data){
					if(data&&data.error==="0"){
						var html = template.render("storeList",data);
						$(".row").append(html);
					}
				},
				error:function(xhr) {
		
				}
		
			});
		}
	var Weidian = function(){
		this.onLoad = function(){
			loadData();
		}
	}
	Global.Member = Global.Member||{};
	Member.Weidian = new Weidian(); 

}(this);

