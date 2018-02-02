/*************添加银行卡****************/
$(function(){

		var key = localStorage.getItem("key");
	    $("#cardForm").validate({//注册验证
			focusInvalid:true,
	        rules: {
	        	credit_card : {
	        		creditcard:true,
	        		required:true
	        	},
	
	            cname: {
	            	required:true,
	            	minlength:4
	            },
	
	
	            id_card: "required"
	
	        },
	
	        messages: {
	        	credit_card:{
	        		required:"银行卡号必填",
	        		creditcard:"请输入合法的银行卡号"
	        	},
	
	            cname: "持卡人必须填写！",
	
	
	            id_card: "身份证必填"
	        },
		    errorPlacement: function(error, element) {
		        	var text = error.text();
		        	var dom =   '<div class="tooltip-top" role="tooltip">'
							      +'<div class="tooltip-arrow"></div>'
							      +'<div class="tooltip-in">'+text+'</div>'
							    +'</div>'
					$(".tooltip-top").remove();
					element.before(dom);
			}
	
	    });
  //  ;
    $('#saveCard').click(function() {

        if ($("#cardForm").valid()) {

          

        }         


    });

});
