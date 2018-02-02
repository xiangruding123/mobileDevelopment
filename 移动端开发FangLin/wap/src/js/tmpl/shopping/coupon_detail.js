!function(Global){
    	var typenum = GetQueryString('typenum');
		var goods_id = GetQueryString('goods_id');
           function loadGoods(){
           	    $.ajax({
					type:"get",
					url:WapSiteUrl+"/api/index.php?act=common_goods&op=get_bundling_combo",
					data : {flag:"wap",goods_id:goods_id},
					dataType:"json",
					success:function(data){ 
						if(data&&data.error==0){
							var res = data.result.bundling[typenum];
							var html = template("goods_coupon_detail_tpl",res);
							$('#coupon_list').html(html);
							
								//图片加载
			                $(".media img").lazyload();
			                
			                bindEvent();
			                
			                $('#addcart').click(function(){			                	
			                	var bl_id=res.bl_id;
			                	if(FL.token){
			                	   addCart(bl_id);
			                	}else{
                                    FL.logLogin();
			                	}
			                	
			                });
			                
						}
					}
				});
           }
          
           function bindEvent(){
           	

                 var type_num = parseFloat(typenum)+1;
                 $('.typenum').text("套装"+type_num);
		    	
		              
            }
           
           function addCart(bl_id){

           	   $.ajax({
					type:"get",
					url:WapSiteUrl+"//api/index.php?act=buyer_cart&op=add",
					data : {flag:"wap",mid:FL.mid, token:FL.token,bl_id:bl_id,store_id:FL.store_id},
					dataType:"json",
					success:function(data){ 
						if(data&&data.error==0){
							location.href="../shopping/shopping_cart_cn.html";
						}
					}
				});
           }
           
           var goodsCouponDetail= function(){
				this.onLoad= function(){
					loadGoods();					
				}
			}
			
			Global.Goods = Global.Goods||{};
			Goods.goodsCouponDetail = new goodsCouponDetail();  
           
	
}(this);