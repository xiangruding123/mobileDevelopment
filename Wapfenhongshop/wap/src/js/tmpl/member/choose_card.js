/*************选择银行卡*****************/
$(function(){

		var key = localStorage.getItem("key");
		
		$(".fill").click(function(){
			var me = this;
			 chooseCard(me);
		});
		
		function chooseCard(self){
			$(".choose-icon").attr("class","icon-circle-blank default-icon");
			$(self).find("i").attr("class","icon-ok-sign choose-icon");
			
		}
});	

