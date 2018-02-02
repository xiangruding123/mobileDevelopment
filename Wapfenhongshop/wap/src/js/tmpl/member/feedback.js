/*************意见反馈*****************/
!function(Global) {
	    
	function bindEvent(){
		//保存地址
		$("#submit").click(function() {
			var textValue = $("#feedback").val();
			if(textValue.length>0){
				saveSubmit(textValue);
			}else{
				layer.msg("请输入内容");
			}
	    	
	    });
	}
	function saveSubmit(textValue){
		
		$.ajax({

			type:'post',
			
			url:WapSiteUrl+"/api/index.php?act=member_feedback&op=add_buyer_feedback",
	
			data:{feedback:textValue,mid:FL.mid,flag:"wap"},
	
			dataType:'json',
	
			success:function(data){
				if(data&&data.error==0){
					layer.msg("提交成功!");
					setTimeout(function(){
						$("#feedbackForm")[0].reset();
						location.href = "setting.html";
					},500);
				}
			},
			error:function(xhr) {
	
			}
	
		});
	}

	var Feedback = function(){
		this.onLoad = function(){
			bindEvent();
		}
	}
	Global.Member = Global.Member||{};
	Member.Feedback = new Feedback(); 

}(this);
