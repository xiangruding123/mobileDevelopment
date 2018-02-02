/*************主题馆*****************/
!function(Global) {
	
		function loadData(){
			$.ajax({
		
				type:'get',
				
				url:WapSiteUrl+"/api/index.php?act=buyer_activity&op=get_activity_list",
		
				data:{type:"zhutiguan",num:10,curpage:1,flag:"wap"},
		
				dataType:'json',
		
				success:function(data){
		
					if(data&&data.error==="0"){
						var html = template.render("themes",data);
		
						$("#themeList").empty();
		
						$("#themeList").append(html);
						$("#themeList img").lazyload({ threshold : 200 });
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
	var Theme = function(){
		this.onLoad = function(){
			loadData();
			bindEvent();
		}
	}
	Global.Goods = Global.Member||{};
	Goods.Theme = new Theme(); 

}(this);

