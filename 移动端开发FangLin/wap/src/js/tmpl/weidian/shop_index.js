(function($, w, d) {
    'use strict';
     $(function(){
     	//table切换
       $("#shop_index .shop_list li").click(function(event) {
           $(this).addClass('active').siblings('li').removeClass('active');
           $(".tableChange").eq($(this).index()).show().siblings(".tableChange").hide();
       });         

     })


}($, window, document));
