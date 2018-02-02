/*************达人资料*****************/
$(function(){
    FL.judgeLogin();
    function getMember(){

        FL.ajaxDate('post',get_talent_home,{mid:FL.mid,token:FL.token,curpage:"1",num:"1"},function(data){
            if(data&&data.error=='0'){
                var res = data.result.talent_info;
               $('.avatar-img').attr('src',res.talent_avatar);
               $('.background-img').attr('src',res.talent_background);
               $('#nickname').val(res.talent_name);
               $('#talent-intro').val(res.talent_intro);
            }
        });
    }




    $('#avatar').change(function(){

        upLoadImage("avatar");

    });
    $('#background').change(function(){

        upLoadImage('background');

    });

    function upLoadImage(avatar){

        var fd = new FormData();
        fd.append("mid", FL.mid);
        fd.append("token",FL.token);
        fd.append("flag","wap");
        avatar=='avatar'?fd.append("img", $('#avatar')[0].files[0]):fd.append("img", $('#background')[0].files[0]);
        fd.append("type","goods_evaluation");

        $.ajax({

            type:'post',

            url:image_upload,

            processData:false,

            contentType:false,

            dataType: "json",

            data:fd,

            success:function(data){
                if(data&&data.error=="0"){
                    var res;
                    if(avatar=='avatar'){
                         res = {mid:FL.mid,token:FL.token,avatar:data.result};
                    }else{
                         res = {mid:FL.mid,token:FL.token,background:data.result};
                    }

                    FL.ajaxDate('post',change_talent_info,res,function(data){
                        if(data&&data.error=="0"){
                            layer.msg("图片上传成功");
                            getMember();
                        }
                    });
                }
            },
            error:function(xhr) {

            }

        });


    }

    getMember();

    $('.header-right').click(function(){
        var intro =  $('#talent-intro').val();
        var _name  =  $('#nickname').val();
        if(_name.length>=2&&intro.length>=2){

            FL.ajaxDate('post',change_talent_info,{mid:FL.mid,token:FL.token,name:_name,intro:intro},function(data){
                if(data&&data.error=="0"){
                    layer.msg("保存成功");
                    getMember();
                    setTimeout(function(){
                        location.href = "talent_index.html";
                    },2500);
                }else{
                    layer.msg("保存失败");
                }
            });

        }else if(_name.length<2){
            layer.msg("昵称不能小于2位！");
        }else if(intro.length<2){
            layer.msg("个性签名不能小于2位！");
        }
    });
    
    
    
    
    
    

});