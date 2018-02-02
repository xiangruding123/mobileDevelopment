/*************个人资料*****************/
$(function(){
	FL.judgeLogin();
	function getMember(){

		$.ajax({
				type:'post',

				url:WapSiteUrl+"/api/index.php?act=common_member&op=get_member_info",

				data:{mid:FL.mid,token:FL.token,flag:"wap"},

				dataType:"json",

				success:function(data){
					if(data&&data.error=="0"){
						var  res = data.result;
						if(res.member_nickname){
                          $("#nickname").text(unescape(res.member_nickname));
						}else{
                          $("#nickname").text('您还没有昵称快来补上吧');
						}

						 $("#mobile").text(res.member_mobile);
						 $(".fh-img").attr("src",res.member_avatar);
						 $("#member_name").text(res.member_name);
						 $('#birthday').attr("placeholder",res.member_birthday);

                         if(res.member_sex=='1'){
                         	$('#personsex').text('男');
                         }else if(res.member_sex=='2'){
                         	$('#personsex').text('女');
                         }else{
                         	$('#personsex').text('保密');
                         }

                         $('#sexlog i,#personsex').unbind("click").bind("click",function(){
                         	FL.addShade();
                         	$('.personsex').show();
                         });
                         $('.personsex p').bind('click',function(){
                         	var sex = $(this).attr("data-sex");
                         	 $('.loading-shade').remove();
                         	$('.personsex').hide();
                         	editMemberInfo(sex);
                         });
                         $('#birthday').change(function(){
                         	var birth = $(this).val();
                         	editMemberInfo("",birth);
                         });


                         $('#nicknameLink').click(function(){

                         	  if(res.member_nickname){
	                            location.href = "modify_name.html?nickname_status="+res.nickname_status+"&surplus_time="+res.surplus_time+"&member_nickname="+ res.member_nickname;
	                          }else{
	                          	location.href = "modify_name.html?nickname_status="+res.nickname_status+"&surplus_time="+res.surplus_time;

	                          }

                         });

					}
				}


		});
	}

	function editMemberInfo(sex,birth){
		$.ajax({

			type:'post',

			url:WapSiteUrl+"/api/index.php?act=common_member&op=edit_member_info",

            dataType: "json",

			data:{mid:FL.mid,token:FL.token,flag:'wap',sex:sex,birth:birth},

			success:function(data){
				if(data&&data.error=="0"){
					getMember();
				}
			},
			error:function(xhr) {

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
            fd.append("avatar", $('#avatar')[0].files[0]);
			$.ajax({

				type:'post',

				url:WapSiteUrl+"/api/index.php?act=common_member&op=edit_member_info",

				processData:false,

				contentType:false,

				dataType: "json",

				data:fd,

				success:function(data){
					if(data&&data.error=="0"){
						getMember();
					}
				},
				error:function(xhr) {

				}

			});
		}

	getMember();

});
