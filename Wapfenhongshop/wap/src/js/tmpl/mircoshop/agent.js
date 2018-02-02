$(function() {
    // 页面初始化
    $.init();
    if (getcookie("repetition")) {
        addcookie("repetition",'');
        location.href="daili.html";
    }
    $("#nosiupDialog").hide();
    // 地址
    $(".city-picker").cityPicker({
        toolbarTemplate: '<header class="bar bar-nav">\
                      <button class="button button-link pull-right close-picker" id="button_two" >确定</button>\
                      <h1 class="title">选择申请地址</h1>\
                      </header>',
                      onClose:address()
    });

    if($("#realname").val() !='' && $("#tel").val() !='' && $("#area_info").val !=''){
        $("#button").removeClass("fh-bg-gray");
    }else{
        $("#button").addClass("fh-bg-gray");
    }


    $("#button").bind('click',function(){
     if($("#realname").val() !='' && $("#tel").val() !='' && $("#area_info").val()!='' ){
     getDate("#test_form");
     }else{
     $("#button").attr("disabled", true);
     }

     });
     
     //绑定事件
     
     $("#tel").bind('keyup',function(){
     	  rlname();
     });
     $("#realname").bind('keyup',function(){
     	  rlname();
     });
     $("#area_info").bind('change',function(){
       address();
     });
     
     
     

    function address(){
       if($("#realname").val() !='' && $("#tel").val() !='' && $("#area_info").val !=''){
           $("#button").removeClass("fh-bg-gray");
       }
    }

    function getDate(form) {
        var realname = $("#realname").val();
        var tel = $("#tel").val();
        var area_info = $("#area_info").val();
        if (getcookie("tid")) {
            var mid = getcookie("tid");
        } else {
            var mid = 1;
        }


        date = {
            realname: realname,
            tel: tel,
            area_info: area_info,
            from_id: mid
        }
        if(realname.match(/\^|\.|\*|\?|\%|\!|\/|\\|\$|\#|\&|\||,|\[|\]|\{|\}|\(|\)|\-|\+|\=/g)){
            $.toast('请输入正确的真实姓名');
           /* $("#nosiupRealname").show();

            setTimeout(function(){
                $("#nosiupRealname").hide();
            },1000);*/
        }else if(!tel.match(/^(13[0-9]|14[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$/)){
            $.toast('请输入正确的手机号');
           /* $("#nosiupDialog").show();

            setTimeout(function(){
                $("#nosiupDialog").hide();
            },1000);*/

        }else{
            submit(date);
        }

    }

   /* function close_div(){
        $("#nosiupDialog").hide();
    }
    function close_one(){
        $("#nosiupRealname").hide();
    }*/
    function submit(date){

        FL.ajaxDate('post', agent_application, date, function(data) {
            if(data && data.error == '0') {
                var res = data.result;
                location.href = "agent_pass.html?realname="+res.realname+"&tel="+res.tel;
            }else{
                layer.msg(data.msg);
            }
        })

    }

    function rlname(){
        var realname = $("#realname").val();
        var tel      = $("#tel").val();
        if(realname.match(/\ +/g) || tel.match(/\ +/g)) {
            $("#realname").val($("#realname").val().replace(/\ +/g, ""));
            $("#tel").val($("#tel").val().replace(/\ +/g,""));
        }

        if($("#realname").val()){
            $("#namespan").html('<img src="../../images/x.png" alt="" width="20" height="19"/>');
        }else{
            $("#namespan").html('');
        }

        if($("#tel").val()){
            $("#telspan").html('<img src="../../images/x.png" alt="" width="20" height="19"/>');
        }else{
            $("#telspan").html('');
        }
        if($("#realname").val() !='' && $("#tel").val() !='' && $("#area_info").val()!='' ){
            $("#button").removeClass("fh-bg-gray");
        }else{
            $("#button").addClass("fh-bg-gray");
        }
    }

    function namespan(){
        $("#realname").val('');
        $("#namespan").html('');

        if($("#realname").val() !='' && $("#tel").val() !='' && $("#area_info").val !=''){
            $("#button").removeClass("fh-bg-gray");
        }else{
            $("#button").addClass("fh-bg-gray");
        }
    }

    function telspan(){
        $("#tel").val('');
        $("#telspan").html('');

        if($("#realname").val() !='' && $("#tel").val() !='' && $("#area_info").val !=''){
            $("#button").removeClass("fh-bg-gray");
        }else{
            $("#button").addClass("fh-bg-gray");
        }
    }
});