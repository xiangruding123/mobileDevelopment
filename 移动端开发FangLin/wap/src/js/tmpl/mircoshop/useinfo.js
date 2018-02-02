$(function() {
    // 页面初始化
    $.init();
    // 地址
    $(".city-picker").cityPicker({
      toolbarTemplate: '<header class="bar bar-nav">\
                  <button class="button button-link pull-right close-picker">确定</button>\
                  <h1 class="title">选择常驻地址</h1>\
                  </header>'
    });

    $('#test_form .button').on('click',function() {
      getDate('#test_form');
    });
    $('#test_form2 .button').on('click',function() {
      getDate('#test_form2');
    });

    if(native_flag=='0'){


      $('#person_pic_url').bind('click',function(){

           FHMall.upload(true, 206, 266, 0, 0, function(flag, url) {
                 addcookie('person_pic_url',url);
                 $('#person_pic_url_img').attr('src', url);

           });
      });

      $('#company_pic_url').bind('click',function(){
           FHMall.upload(true, 600, 600, 0, 0, function(flag, url) {
                 addcookie('company_pic_url',url);
                 $('#company_pic_url_img').attr('src', url);
           });
      });

    }


    function getDate(form2) {

      var $me = this;
      var mid = FL.mid,
        token = FL.token,
        member_type = $('.member_type .active').attr('member_type'),
        card_name = $('#card_name').val(),
        card_number = $('#card_number').val(),
        company_name = $('#company_name').val(),
        company_number = $('#company_number').val(),
        address = $(form2).find('.city-picker').val(),
        account_type = $(form2).find('.account_type').val(),
        account_number = $(form2).find('.account_number').val(),
        email = $(form2).find('.email').val(),
        wechat_number = $(form2).find('.wechat_number').val(),
        qq_number = $(form2).find('.qq_number').val(),
        person_pic_url = getcookie('person_pic_url'),
        company_pic_url = getcookie('company_pic_url');

        if(form2=='#test_form2'){
             person_pic_url = null;
             card_name = null;
        }else{
             company_name= null;
             company_pic_url = null;
        }

      date = {
        mid: mid,
        token: token,
        member_type: member_type,
        card_name: card_name,
        card_number: card_number,
        company_name: company_name,
        company_number: company_number,
        address: address,
        account_type: account_type,
        account_number: account_number,
        email: email,
        wechat_number: wechat_number,
        qq_number: qq_number,
        person_pic_url: person_pic_url,
        company_pic_url: company_pic_url
      }


              if(form2=='#test_form'){

                 if(!card_name){
                  alertInfo("姓名不能为空");
                 }else if(!address){
                  alertInfo("常驻地址不能为空");
                 }else if(!person_pic_url){
                  alertInfo("请上传图片");
                 }else{
                  submit(date);
                 }

              }else{
                if(!company_name){
                  alertInfo("公司名称不能为空");
                 }else if(!address){
                  alertInfo("常驻地址不能为空");
                 }else if(!company_pic_url){
                  alertInfo("请上传图片");
                }else{
                    submit(date);
                }

              }

    }

    function upLoadImage(blob, type) {

      var fd = new FormData();
      fd.append("mid", FL.mid);
      fd.append("token", FL.token);
      fd.append("flag", "wap");
      fd.append("img", blob);
      fd.append("type", "microshop_owner_pics");


      $.ajax({

        type: 'post',

        url: image_upload,

        processData: false,

        contentType: false,

        dataType: "json",

        data: fd,

        success: function(data) {
          // console.log(data);
          if(data && data.error == "0") {

            if(type == 'person') {
              addcookie('person_pic_url', data.result);
              $('#person_pic_url_img').attr('src', data.result);
            } else {
              addcookie('company_pic_url', data.result);
              $('#company_pic_url_img').attr('src', data.result);
            }

          }
        },
        error: function(xhr) {

        }

      });

    }

    compressImg('person_pic_url','person');

    $('.member_type a').click(function() {
      var me = this;

      var index = $(me).index();

      if(index=='1'){
        compressImg('company_pic_url','company');
      }else{
        compressImg('person_pic_url','person');
      }

    });

    function submit(date) {
      FL.ajaxDate('post', edit_member_info, date, function(data) {
        if(data && data.error == '0') {
          location.href = "infoaffirm.html?time="+Math.random();
        }else{
          alertInfo(data.msg);
        }
      })
    }


    function alertInfo(msg){
      $('body').append('<div class="cxvalidation_tip show">'+msg+'</div>');
           setTimeout(function(){
            $('.cxvalidation_tip').remove();
      },2000);
    }

    function compressImg(objId,application){

    //压缩图片
    var filechooser = document.getElementById(objId);
    //    用于压缩图片的canvas
    var canvas = document.createElement("canvas");
    var ctx = canvas.getContext('2d');
    //    瓦片canvas
    var tCanvas = document.createElement("canvas");
    var tctx = tCanvas.getContext("2d");
    var maxsize = 200 * 1024;

    filechooser.onchange = function() {

      FL.fhload();

      if (!this.files.length) return;
      var files = Array.prototype.slice.call(this.files);

      files.forEach(function(file, i) {
        if (!/\/(?:jpeg|png|gif)/i.test(file.type)) return;
        var reader = new FileReader();

        reader.onload = function() {
          var preview = this.result;
          var img = new Image();
          img.src = preview;

          //如果图片大小小于100kb，则直接上传
          if (preview.length <= maxsize) {
            img = null;

            //base64的图片转成二进制对象，塞进formdata上传
            var blob = getBlob(preview);

            upLoadImage(blob, application);
            return;
          }
  //      图片加载完毕之后进行压缩，然后上传
          if (img.complete) {
            callback();
          } else {
            img.onload = callback;
          }
          function callback() {
            var preview = compress(img);

            //base64的图片转成二进制对象，塞进formdata上传
            var blob = getBlob(preview);

            upLoadImage(blob, application);

            img = null;
          }
        };
        reader.readAsDataURL(file);
      })
    }

    //    使用canvas对大图片进行压缩
    function compress(img) {
      var initSize = img.src.length;
      var width = img.width;
      var height = img.height;
      //如果图片大于四百万像素，计算压缩比并将大小压至400万以下
      var ratio;
      if ((ratio = width * height / 4000000) > 1) {
        ratio = Math.sqrt(ratio);
        width /= ratio;
        height /= ratio;
      } else {
        ratio = 1;
      }
      canvas.width = width;
      canvas.height = height;
  //        铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      //如果图片像素大于100万则使用瓦片绘制
      var count;
      if ((count = width * height / 1000000) > 1) {
        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
  //            计算每块瓦片的宽和高
        var nw = ~~(width / count);
        var nh = ~~(height / count);
        tCanvas.width = nw;
        tCanvas.height = nh;
        for (var i = 0; i < count; i++) {
          for (var j = 0; j < count; j++) {
            tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
            ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
          }
        }
      } else {
        ctx.drawImage(img, 0, 0, width, height);
      }
      //进行最小压缩
      var ndata = canvas.toDataURL('image/jpeg', 0.5);

      tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
      return ndata;
    }

  }



      //base64的图片转成二进制对象，塞进formdata上传
    function getBlob(preview){
      var binaryString = atob(preview.split(',')[1]),
              mimeType = preview.split(',')[0].match(/:(.*?);/)[1],
              length = binaryString.length,
              u8arr = new Uint8Array(length),
              blob;
      while(length--) {
          u8arr[length] = binaryString.charCodeAt(length);
      }
      blob = new Blob([u8arr.buffer], {type: mimeType});
      return blob;
    }

  });
