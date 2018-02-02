/*************店铺资料*****************/
$(function(){
		
	function getMember(){
		FL.ajaxDate('get',get_shop_info,{mid:FL.mid},function(data){
					if(data&&data.error=="0"){	
						var res = data.result;		
						if(res.shop_logo){
							$(".fh-img").attr("src",res.shop_logo);
						}						
						$("#member_name").text(getcookie('member_name'));
						if(res.shop_name){
						 	$('#shop_name').val(res.shop_name);
						}
						if(res.shop_scope){
						 	$('#shop_scope').val(res.shop_scope);
						}
						  
					}
			});
	}
		
		 $('#avatar').change(function(){ 
		 	upLoadImage();
		 });
		
		function upLoadImage(){
			         
            var fd = new FormData();
            fd.append("mid", FL.mid);
            fd.append("token",FL.token);
            fd.append("flag","wap");
            fd.append("type","goods_evaluation");
            fd.append("img", $('#avatar')[0].files[0]);	            
            
            $.ajax({

				type:'post',

				url:image_upload,
				
				processData:false,
				
				contentType:false,
				
				dataType: "json",
				
				data:fd,

				success:function(data){					
					if(data&&data.error=="0"){
						FL.ajaxDate('post',set_shop_info,{mid:FL.mid,token:FL.token,shop_logo:data.result},function(data){
									if(data&&data.error=="0"){	
										layer.msg("图片上传成功");
										getMember();						  
									}
					    });
					}
				},
				error:function(xhr) {

				}

			});

		}
		
	getMember();
	
	$('#shop_scope,#shop_name').focus(function(){		
		$(this).removeClass('focus-font');
	});
	$('.header-right').click(function(){
		var shop_scope =  $('#shop_scope').val();
		var shop_name  =  $('#shop_name').val();
		if(shop_scope.length>=2&&shop_name.length>=2){
		
			FL.ajaxDate('post',set_shop_info,{mid:FL.mid,token:FL.token,shop_name:shop_name,shop_scope:shop_scope},function(data){
						if(data&&data.error=="0"){	
							layer.msg("保存成功");
							getMember();						  
						}else{
							layer.msg("保存失败");
						}
		    });
		    
	    }else if(shop_name.length<2){
	   	   layer.msg("店铺名称不能小于2位！");
	    }else if(shop_scope.length<2){
	   	   layer.msg("店铺标语不能小于2位！");
	    }
	    if(shop_name.length<2){
	   	  $('#shop_name').addClass('focus-font');
	    }
		if(shop_scope.length<2){
			$('#shop_scope').addClass('focus-font');
		}
	   
	});
   
});