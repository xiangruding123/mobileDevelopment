/*************标签*****************/
!function(Global) {
	    var tags=[];
	    function tagWarpScroll(){
			var tabScrool = new IScroll(".tag-warp",{scrollX:true,scrollY:false,mouseWheel:true,tab:true});
		}

		function loadDate(){
			FL.ajaxDate('post',get_tags,{mid:FL.mid,token:FL.token},function(data){
			        if(data&&data.error=='0'){
			        	var html = template("tag-tmpl",data.result);
						$("#tag .fh-header").after(html);
						
						
						bindEvent();
			        }
		    });
		}
		
		//删除时光标签最近选择
		function deleteHistory(del_all,tag_name){
                FL.ajaxDate('post',delete_history,{mid:FL.mid,token:FL.token,del_all:del_all,tag_name:tag_name},function(data){
			        if(data&&data.error=='0'){
			        	layer.msg("删除成功");
			        }
		        });
		}
		
		//搜索时光标签
        function searchTags(key,num){
        	if(key){
        		FL.ajaxDate('post',search_tags,{mid:FL.mid,token:FL.token,key:key,num:num},function(data){                	
			        if(data&&data.error=='0'){			        	
			        	var html = template("search_tags_tmpl",data.result);
						$("#search_tag").html(html);
						if(data.result.exists=='0'){
							$('#addSearchTag span').text(key);
						}
						
						
						$('#addSearchTag').click(function(){							
							 addTag(key);
						});

						$('.activetag').click(function(){
							var me = this;
							var spandom = "<span class='tagname'>"+$(me).text()+"</span>";
							if(sessionStorage.getItem('tags')){
								sessionStorage.setItem('tags',sessionStorage.getItem('tags')+","+$(me).text());
							}else{
								sessionStorage.setItem('tags',$(me).text());
							}
							$('#addTagName').after(spandom);
							tagWarpScroll();
							$('#tag').hide();
						})
			        }
		        });
        	}else{
			    $('#addSearchTag').remove();
			}
                
		}
        //添加时光标签 
		function addTag(tag_name){	
			FL.ajaxDate('post',add_tag,{mid:FL.mid,token:FL.token,tag_name:tag_name},function(data){
            	
		        if(data&&data.error=='0'&&data.result>0){			        	
		        	searchTags(tag_name);					
		        }
	        });

		}
		function bindEvent(){
			$('#clearTag').on('click',function(){
				deleteHistory(del_all,tag_name);
			});
			$('#goods_search').bind("input propertychange",function(){
				var me = this;
				if($(me).length>0){
					$('#search_tag').show();
					$('#tag header').css("position",'fixed');
				}else{
					$('#search_tag').hide();
					$('#tag header').css("position",'relative');
				}
				
					var key = $(me).val();
					
					   searchTags(key,10);
						
					
			});

			$('.tagname').click(function(){
				var me = this;
				var spandom = "<span class='tagname'>"+$(me).text()+"</span>";
				if(sessionStorage.getItem('tags')){
					sessionStorage.setItem('tags',sessionStorage.getItem('tags')+","+$(me).text());
				}else{
					sessionStorage.setItem('tags',$(me).text());
				}
				$('#addTagName').after(spandom);
				tagWarpScroll();
				$('#tag').hide();
			})
			
		}
		
		
		$('#tag .goback').click(function(){
			$('#tag').hide();
		})
		
		loadDate();



	    //存储取值
	    if(sessionStorage.getItem('tags')){
			for(var i=0;i<sessionStorage.getItem('tags').split(',').length;i++){
				(function(index){
					$('#addTagName').after("<span class='tagname'>"+sessionStorage.getItem('tags').split(',')[index]+"</span>");
					tagWarpScroll();
				})(i);
			}
        }

}(this);
