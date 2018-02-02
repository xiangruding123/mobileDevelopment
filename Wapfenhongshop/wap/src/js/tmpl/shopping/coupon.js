!function(Global){
    	var goods_id = GetQueryString("goods_id");
//  	    goods_id = 67;
           function loadGoods(){
           	    $.ajax({
					type:"get",
					url:WapSiteUrl+"/api/index.php?act=common_goods&op=get_bundling_combo",
					data : {flag:"wap",goods_id:goods_id},
					dataType:"json",
					success:function(data){ 
						if(data&&data.error==0){
							
							var html = template("coupon_tpl",data);
							$('#goods_coupon_list').html(html);
							
								//图片加载
			                $(".navbar-nav img").lazyload();
			                
			                bindEvent();
						}
					}
				});
           }
          
           function bindEvent(){
           	
	           	 $('.suit').each(function(index){
		    		that = $(this);
		    		var liWidth = ($(".container").width()+30)*0.5;
		    		    liWidth =160;
					var num = that.find("li").length;
					var tabWith = liWidth*num;
					if(tabWith>($(".container").width()+30)){
						that.find(".navbar-nav").attr("style","width:"+tabWith+"px");
						$(that.find(".navbar-nav").find("li")).attr("style","width:"+liWidth+"px");							
						var tabScrool = new IScroll("#t-tabs-"+index,{scrollX:true,scrollY:false,mouseWheel:true});
					}
		    		
			    });
		    	
		       $('.navbar-nav li:last-child').find("span").remove();           
            }
           
           var goodsCouponDetail= function(){
				this.onLoad= function(){
					loadGoods();					
				}
			}
			
			Global.Goods = Global.Goods||{};
			Goods.goodsCouponDetail = new goodsCouponDetail();  
           
	
}(this);