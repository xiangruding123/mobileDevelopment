/*************添加收货地址*****************/
!function(Global) {
	var type = GetQueryString("type");
	var address_id = GetQueryString("address_id");
	var referurl = document.referrer; //上级网址
	if(referurl.indexOf('order_confirmation')>0){
		sessionStorage.setItem('orderbackreferurl',referurl);
	}


	function validate(){
		$("#add_address").validate({
	        rules: {
	
	            name: {
	            	required:true
				},
	            mobile: {
	                required: true,
	                telephone: true
	            },
	
	            area_info: "required",
	
	            address: "required",
	            
	            cert_num:{
	            	required: false,
	            	isIdCardNo:true
	            }
	        },
	
	        messages: {
	            name: {
	            	required:"收货人姓名必须填写 "
				},
	            mobile: {
	                required: "手机号不能为空！",
	                telephone: "请填写正确的手机号"
	            },
	
	            area_info: "请选择所在地区",
	
	            address: "请填写详细信息",
	            
	            cert_num:{
	            	isIdCardNo:"请输入正确的身份证号"
	            }
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
	}
	    
	function bindEvent(){
		//保存地址
		$("#save_address").click(function() {
	    	
	    		if( $("#add_address").valid()){
	    			
		    		if($("#cert_num").val()&&!$("#cert_name").val()){
		    			layer.msg("请填写身份证上的姓名");
		    		}else{
		    			saveAddress();
		    		}
		    		
		    	}
	    		
	    	
	    });
	    //地区级联
	    $("#area_info").click(function() {
	        FL.getProvinceBuy("#area_info");
	    });
	    //是否默认地址
	    $(".right-icon").click(function(){
	    	$(".right-icon").hasClass("icon-circle-blank")?$(".right-icon").attr("class","icon-ok-sign right-icon"):$(".right-icon").attr("class","icon-circle-blank right-icon");
	    });
	}
	function updateAddress(address_id){
		$.ajax({

			type:'post',
			
			url:WapSiteUrl+"/api/index.php?act=buyer_delivery&op=get_address",
	
			data:{address_id:address_id,mid:FL.mid,token:FL.token,flag:"wap"},
	
			dataType:'json',
	
			success:function(data){
	
				if(data&&data.error==="0"){
					var details = data.result;
					$("#name").val(details.name);
					$("#cert_name").val(details.cert_name);
					$("#cert_num").val(details.cert_num);
			    	$("#area_info").val(details.area_info);
			    	$("#address").val(details.address);
			    	$("#mobile").val(details.mob_phone);
			    	$("#area_info").attr("area_id",details.area_id);
    	            $("#area_info").attr("city_id",details.city_id);
    	            if(details.is_default==1){
    	            	$(".right-icon").attr("class","icon-ok-sign right-icon");
    	            }else{
    	            	$(".right-icon").attr("class","icon-circle-blank right-icon");
    	            }
				}
	
			},
			error:function(xhr) {
	
			}
	
		});
	}
    //初始化列表

    function saveAddress() {
    	var data;
		var name = $("#name").val();
    	var area_id = $("#area_info").attr("area_id");
		if(!area_id){
			var area_id = $("#area_info").attr("city_id");
    	    var city_id = $("#area_info").attr("ss");
		}else{
			var area_id = $("#area_info").attr("area_id");
			var city_id = $("#area_info").attr("city_id");
		}   	
		
    	var area_info = $("#area_info").val().replace(/>/g," ");
    	var address = $("#address").val();
    	var mobile = $("#mobile").val();
    	var is_default;
		var cert_name = $("#cert_name").val();
		var cert_num = $("#cert_num").val();
		$(".right-icon").hasClass("icon-circle-blank")?is_default=0:is_default=1;
    	if(address_id){
    		data = {address_id:address_id,name:name,area_id:area_id,city_id:city_id,area_info:area_info,address:address,mobile:mobile,is_default:is_default,mid:FL.mid,token:FL.token,flag:"wap",cert_name:cert_name,cert_num:cert_num};
    	}else{
    		data = {name:name,area_id:area_id,city_id:city_id,area_info:area_info,address:address,mobile:mobile,is_default:is_default,mid:FL.mid,token:FL.token,flag:"wap",cert_name:cert_name,cert_num:cert_num};
    	}
        $.ajax({

            type: 'post',

            url: WapSiteUrl + "/api/index.php?act=buyer_delivery&op=set_address",

            data: data,
            
            dataType: 'json',

            success: function(data) {
               if(data&&data.error==="0"){
	               	layer.msg("保存成功");
	               	setTimeout(function(){
	               		//清空表单
	               		 $(':input,textarea','#add_address')  
						 .not(':button, :submit, :reset, :hidden')  
						 .val(''); 
						 $(".right-icon").attr("class","icon-circle-blank right-icon");
						 if(type){
						 	location.replace("address.html");
						 }else{
						 	location.href="address_manage.html";
						 }
	               		
	               	},1000);
               }

            },
            error: function(xhr) {

            }

        });

    }
    //如果是从订单支付跳转过来的返回选择地址页面
   
   	$(".goback").click(function(){
	   	if(type=="buy"){
	   		location.replace("../member/address.html?address_id="+address_id);	
	   	}else{
	   		history.back();
	   	}
	})
	var AddAddress = function(){
		this.onLoad = function(){
			if(address_id){
				updateAddress(address_id);
			}
			validate();
			bindEvent();
			
		}
	}
	Global.Member = Global.Member||{};
	Member.AddAddress = new AddAddress(); 

}(this);
