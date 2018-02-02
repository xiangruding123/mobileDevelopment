/*************评价*****************/
$(function(){

        var if_append_evaluate = GetQueryString('if_append_evaluate'),order_id =  GetQueryString('order_id');		
					
			
		var is_anonymous=1;	
        
        //追加评论时没有店铺评价
        if(if_append_evaluate==1){
        	$('#store_credit').hide();
        }
        
        function loadDate(){
	        $.ajax({         	
	         	type:"post",
	         	url:WapSiteUrl+"/api/index.php?act=buyer_order&op=get_order_evaluate_goods",
	         	data:{mid:FL.mid,order_id:order_id,token:FL.token,flag:'wap'},
				dataType: "json",
				success:function(data){
					if(data.error ==='0'){
						           
						var html = template.render("evaluation-tpl",data);
						$("#evaluation_detail").html(html);
	                    

	                   var  basedata=data.result;
	                        bindEvent(basedata);
	                        
	                       
					}			
					
				}
				
			});
        }
		
		
		function bindEvent(basedata){		
				
			
			//评星
			$(".media-body i").click(function(event,a){
					var me = this;
					grade(me);
			});
			
			//文字评价
			$('textarea').change(function(){
				var me = this;
				checktext(me);
			});
			$('textarea').keyup(function(){
				var me = this;
				checktext(me);
			});
		    
			function checktext(self){
				
				var len = 200;				

				if($(self).val().length>len){
					content = $(self).val();
					$(self).val(content.substring(0, len - 1));
					layer.msg('评价文字最多200个字');
				}else{
					$(self).parents(".evaluation_detail_list").find('.eva_num').text($(self).val().length);
				}
			
			}
//			$('textarea').blur(function(){
//				if($(this).val().length<1){
//					layer.msg('评价文字最少1个字');
//				    $('textarea').focus();
//				}
//				
//			})
			//匿名
			$('.anonymity').click(function(){
				if($(this).is('.icon-circle-blank')){
					$(this).addClass('icon-ok-sign').removeClass('icon-circle-blank');
					is_anonymous=1;
				}else{
					$(this).addClass('icon-circle-blank').removeClass('icon-ok-sign');
					is_anonymous=0;
				}			
			});
			
			//上传图片
	    
			$('.file').change(function(){ 
				
				   var me = this;
				
				   if($(me).parents(".add_pic").find('.pic').length>4){			   	
				   	
//					$(me).attr('disabled','true');
					layer.msg('您最多可以添加5张图片');
				   }else{			   	
				 	upLoadImage(me);
				 	}
			 });
			 
			 
			 
			 
			 
			 //提交
			$("#submit").click(function(){
				
                var m = $('.evaluation_detail_list').length-1;
                
				   if(vaildTxt(m)==="true"){
				   	
				   
				   
					var evaluate_goods=[];
					
					$('.evaluation_detail_list').each(function(index){
					  var me = 	$('.evaluation_detail_list')[index];
					  var num = $(me).find(".icon-star").length,
						  goods_id = $(me).find(".evaluation_state").attr("goods_id");
						  txt = $(me).find(".content").val(),
						  images=null;
						 
					  var oPic =  $(me).find('.pic').find('img');
					 
					  for (var i = 0;i<oPic.length;i++){
					  	 images=images+","+$(oPic[i]).attr('src');
					  }
					  try{
					  	images = images.split('null,')[1];
					  }catch(e){
					  	images=null;
					  }
					  
					  
					  evaluate_goods[index]={goods_id:goods_id,comment:txt,images:images,stars:num};
						
					})
					
					
					
		
		            var store_desccredit=$("#store_desccredit .icon-star").length||5,
		                store_servicecredit=$("#store_servicecredit .icon-star").length||5,
		                store_deliverycredit=$("#store_deliverycredit .icon-star").length||5;
		            
		            evaluate_goods =  JSON.stringify(evaluate_goods);
		            is_append = basedata.evaluation_state;
		            dete = {mid:FL.mid,token:FL.token,order_id:order_id,flag:'wap',is_anonymous:is_anonymous,is_append:is_append,evaluate_goods:evaluate_goods,store_desccredit:store_desccredit,store_servicecredit:store_servicecredit,store_deliverycredit:store_deliverycredit}
				   
				    submitData(dete);
			    		
				   
				}
			});
			
				
			
			
			
		}
		
		//判断文本框文字
			 
		function vaildTxt(m){	
			
		 	 if(!$('.evaluation_detail_list').eq(m).find(".content").val()){
			   	 layer.msg('请输入评价内容');
			   	 $('.evaluation_detail_list').eq(m).find(".content").focus();
			   	 return "false";
			  }else{
			  	
			  	if(m<1){
			  		return fl='true';
			  	}else{
			  		vaildTxt(m-1);
			  	}
			  	
			  	return fl;
			  	
			  }
		}
		
        //评价星星

		function grade(self){
			$(self).parents(".media-body").find("i").attr("class","icon-star-empty");
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
		
		
		
		
		//上传图片
		function upLoadImage(self){
			         
            var fd = new FormData();
            fd.append("mid", FL.mid);
            fd.append("token",FL.token);
            fd.append("flag","wap");
            fd.append("type","goods_evaluation");
            fd.append("img", $(self)[0].files[0]);
            
            swal({
					title: "",
					text: "正在努力上传...",
//					imageUrl: "../images/preloader.gif",
					showConfirmButton: false
				});
						
			$.ajax({

				type:'post',

				url:WapSiteUrl+"/api/index.php?act=common_index&op=image_upload",
				
				processData:false,
				
				contentType:false,
				
				dataType: "json",
				
				data:fd,
                               
				success:function(data){
					if(data&&data.error=="0"){						
						swal('', '上传成功！', 'success');
						$(self).parents('.add_pic').find('.other').before('<li class="pic"><a href="'+data.result+'" data-lightbox="example-set-com"><img src="'+data.result+'"/></a><span class="picClose"></span></li>');
						
						$('.picClose').click(function(){
							$(this).parent('.pic').remove();
						})
						
					}else{
						swal('', '上传失败，请重试~', 'error');
					}
				},
				error:function(xhr) {
                        swal('', '上传失败，请重试~', 'error');
				}

			});
		}
        
         //提交
         function submitData(dete){
         	$.ajax({
				type:"post",
				url:WapSiteUrl+"/api/index.php?act=buyer_order&op=batch_evaluate",
				data:dete,
				dataType:"json",
				success:function(data){
					if(data&&data.error==='0'){
						if(data.result==0){
							layer.msg("评论成功！");
						}else{
							layer.msg("评论成功！获得"+data.result+"积分~");
						}
						
						setTimeout(function(){
							location.href='../order/order_all.html?index=4';
						},2000);
						
					}else{
						layer.msg('评价失败');
					}
					
				}
			});
         }
         
		 
      
	    
		
		
		
		
		loadDate();


});