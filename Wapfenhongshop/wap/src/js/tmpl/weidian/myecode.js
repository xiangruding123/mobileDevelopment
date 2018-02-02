$(function() {

  /*
  *content 获取用户信息
  *author  ljz
  *time  20160831
  */
  var wx_title,wx_desc,wx_img,wx_link;
  var call_url,mid,token,member_name,nickname;

  // 用户信息

  function getMemberInfo(info) {
      mid = info.member_id,
          token = info.token,
          member_name = info.member_name;
          member_nickname = info.member_nickname;

          if(native_flag=='0'){

                 flag = 'android';

          }else if(native_flag=='1'){

                flag =  'ios';

          }

      loadData(member_name,nickname,mid,token,flag);//页面数据


  }

  /*
  *content 分享信息
  *author  ljz
  *time  20161027
  */
  function shareInfo(member_name,mid,imgcode){

    wx_title='我是'+member_name+',邀你成为分红全球购红人大咖';
    wx_desc = '【省+赚】省钱有招，赚钱无忧，快来加入分红全球购！';

    var wx_img = imgcode;

    wx_link = WapSiteUrl+'/wap/tmpl/weidian/sharepage.html?deductid='+mid;


    native_flag=='-1'?FL.wxShare(wx_title,wx_desc,wx_link,wx_img):false;


    /*
    *content 分享
    *author  ljz
    *time  20160831
    */
    var shareObj ={};
	  shareObj.title = wx_title,
		shareObj.desc = wx_desc,
		shareObj.img = wx_img,
		shareObj.url = wx_link;

    rightShare(shareObj);
  }


  /*
  *content 页面信息
  *author  ljz
  *time  20160831
  */

  function loadData(member_name,nickname,mid,token,flag){
    if(nickname=='undefined'||nickname==''||nickname==null||nickname=='null'){
      member_name = member_name;
    }else{
      member_name = nickname;
    }
    $('.meb_name').text(member_name);
    native_flag=='-1'?$('.fh-header').removeClass('none'):false;
    qrcode(mid,token);

    shareInfo(member_name,mid);

  }



  /*
  *content 分享
  *author  ljz
  *time  20160831
  */
  function allShare(wx_title,wx_desc,wx_img,wx_link){


       if(native_flag=='0'){

         enableShareButton(wx_title,wx_desc,wx_img,wx_link);

       }else if(native_flag=='1'){

         enableShare(wx_title,wx_desc,wx_img,wx_link);

       }


  }




  function qrcode(mid,call_url,token,flag,member_name){
    $.ajax({
      type: "get",
      url: WapSiteUrl + "/api/index.php?act=common_index&op=get_qrcode",
      data: {
        call_url:call_url,
        token: token,
        member_id:mid,
        flag: flag
      },
      dataType: 'json',
      success: function(data) {

        if(data.error==='0'){
          var imgcode = data.result;

          setTimeout(function(){
              $('#img2').after('<img src="'+imgcode+'" class="eweicode" />');
          }, 100);

          shareInfo(member_name,mid,imgcode);

        }
      },error:function(e){

      }
    });
  }



  if(native_flag=='-1'){
    $('.share').bind('click',function(){
      FL.addShadeLog();
    })

    member_name = unescape(getcookie('member_name'));
    nickname = unescape(getcookie('nickname'));

    loadData(member_name,nickname,FL.mid,FL.token,'wap');
  }else{

    appMemberInfo({
        success: getMemberInfo
    });
  }


})
