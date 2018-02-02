
!function(Global) {
		
		
		function loadData(batch_id){
			
		 	//获取红包领取记录
		 	$.ajax({
		       	    type:'get',
		       	    url:WapSiteUrl+'/api/index.php?act=buyer_coupon&op=get_bag_record',		       	   
		       	    data:{batch_id:batch_id,flag:"wap"},
		       	    dataType:'json',
		       	    success:function(data){
					var html = template.rander('bag_friend_tpl',data);
					$('#bag_friend_list');
		       	    },
		       	    error:function(xhr){
		       	    }
		 		});
		 		
		}
		
		function bindEvent(){
			
			
		}
	var Ticket = function(){
		this.onLoad = function(){
			var batch_id = GetQueryString('batch_id');
			loadData(batch_id);
			bindEvent();
		}
	}
	Global.Favorable = Global.Favorable||{};
	Favorable.Ticket = new Ticket(); 

}(this);

