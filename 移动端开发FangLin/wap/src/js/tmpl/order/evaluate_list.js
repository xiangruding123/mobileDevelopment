$(function(){
    		
						
    		var order_id = GetQueryString('order_id');
    		
    		$.ajax({
    			type:"post",
    			url:WapSiteUrl+"/api/index.php?act=buyer_order&op=get_order_detail",
    			data:{token:FL.token,mid:FL.mid,order_id:order_id,flag:'wap'},
    			dataType:'json',
    			success:function(data){
    				
    				if(data&&data.error==='0'){
    					var html = template.render('eva_tpl',data);
                        $('header').after(html);
                        
                        $('.order_state').html(data.result.state_desc);
                        
                        
                        //评星
                        $(".starnum i").click(function(event,a){
								var me = this;
								grade(me);
						});
                        
				       
						
                        $('.store_evaluate').click(function(){
                        	store_desccredit=$('.starnum').eq(0).find('.icon-star').length;
							store_servicecredit=$('.starnum').eq(1).find('.icon-star').length;
							store_deliverycredit=$('.starnum').eq(2).find('.icon-star').length;

                        	store_evaluate();
                        });
    				}
    			},error:function(data){
    				
    			}
    		});
    		
    		
    		function store_evaluate(){
    			$.ajax({
    				    type:"post",
		    			url:WapSiteUrl+"/api/index.php?act=buyer_order&op=evaluate_store",
		    			data:{token:FL.token,mid:FL.mid,order_id:order_id,flag:'wap',store_desccredit:store_desccredit,store_servicecredit:store_servicecredit,store_deliverycredit:store_deliverycredit},
		    			dataType:'json',
		    			success:function(data){
		    				if(data&&data.error==='0'){
		    					$('.store_evaluate').text('已评价');
		    					$('.store_evaluate').attr('disabled',true);		    					
		    				}
		    			},error:function(data){
		    				
		    			}
    			});
    		}
    		
    		function grade(self){
     		$(self).parent('.starnum').find("i").attr("class","icon-star-empty");           
			var star = $(self);
			for(var i=0;i<5;i++){
				if(star.length===0){
					break;
				}else{
					star.attr("class","icon-star");
				}
				star = star.prev();
			}
			
		}
    	});