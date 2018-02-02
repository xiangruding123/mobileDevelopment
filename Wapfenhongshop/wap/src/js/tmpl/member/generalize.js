/*************我的推广*****************/
!function(Global) {
		var regu = /^[-]{0,1}[0-9]{1,}$/,
			num = 10,
			page=1,
			sort =1,
			order = 2;
		function loadData(page,num,sort,order){
			$.ajax({
		
				type:'post',
				
				url:WapSiteUrl+"/api/index.php?act=shoper_commission&op=gettrace",
		
				data:{flag:"wap",mid :FL.mid,token:FL.token,start:page,num:num,sort:sort,order:order},
		
				dataType:'json',
		
				success:function(data){
					if(data&&data.error==="0"){
						template.helper('clickIcon',function(r,index){
							if(r.indexOf(index)>=0){
								return "click";
							}
						});
						var html = template.render("generalizeList",data);
						$("#generalize_list").append(html);
					}
				},
				error:function(xhr) {
				}
		
			});
		}
		$(window).scroll(function(){
	        var htmlHeight=document.body.scrollHeight||document.documentElement.scrollHeight;  
	        var clientHeight=document.body.clientHeight||document.documentElement.clientHeight;  
	        var scrollTop=document.body.scrollTop||document.documentElement.scrollTop;  
	        if(scrollTop+clientHeight==htmlHeight){  
	        	var showNum = $(".skip_link").length;//当前页面显示的个数
				page = showNum/num + 1; //上拉加载要显示的页数
				if(regu.test(page)){
					FL.fhload();
					loadData(page,num,sort,order);
				}else{
                    layer.msg("已经没有记录了");
				}
	        }  
	    });  
	var Generalize = function(){
		this.onLoad = function(){
			loadData(page,num,sort,order);
		}
	}
	Global.Member = Global.Member||{};
	Member.Generalize = new Generalize(); 

}(this);

