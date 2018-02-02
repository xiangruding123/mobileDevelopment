$(function(){
	
	// 记录上级网址，用户跳转到注册页面注册成功后调用。
    var referurl = document.referrer; //上级网址
    localStorage.setItem('referurl', referurl);
    localStorage.setItem("thirdBack",referurl); 
	
	function checklogin(account){

		$.ajax({
			type:'get',

			url:if_account_exists,

			data:{account:account,flag:"wap"},

			dataType:'json',

			success:function(data){

				if(data&&data.error==="0"){
                     if(data.result=='1'){

						 location.href = WapSiteUrl + "/wap/tmpl/login/login.html?account="+account;

					 }else{
						 if(/^[1][34578]\d{9}$/.test(account)){

							 location.href = WapSiteUrl +  "/wap/tmpl/login/register1.html?account="+account;

						 }else{
							 FL.addShade();
							 $('.fh-dialog').show();
							 $('#leftbtn').click(function(){
								 $("#textarea").val('').focus();
								 FL.removeShade();
								 $('.fh-dialog').hide();
								 $('#checklogin #loginClick').text('登录/注册').attr('disabled','disabled');
								 $('#checklogin .cleartext').hide();
							 });
						 }
					 }
				}

			},
			error:function(xhr) {

			}

		});

	}
	function bindEvent(){
		//关闭
		$('#checklogin .close').click(function(){
			
			/*location.href = localStorage.getItem('referurl');*/
			$('#checklogin').remove();
			
		});
		//输入框变化
		$('#checklogin #textarea').keyup(function(){
			var len = $(this).val().length;
			if(len>0){
				$('#checklogin #loginClick').removeAttr('disabled');
				
				$('#checklogin .cleartext').show();
			}else{
				$('#checklogin #loginClick').attr('disabled',"disabled");
				$('#checklogin .cleartext').hide();
			}
		});
		
		$('#checklogin .cleartext').click(function(){
			$("#checklogin #textarea").val('').focus();
			$(this).hide();
			$('#checklogin #loginClick').attr('disabled',"disabled");
		})
		$('#checklogin #loginClick').click(function(){

			   var account = $('#checklogin #textarea').val();
			   $('#checklogin #loginClick').text('账号检测中...');
			   checklogin(account);

		})
		
	}
	
	bindEvent();
	
});

