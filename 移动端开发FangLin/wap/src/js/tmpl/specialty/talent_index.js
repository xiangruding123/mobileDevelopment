$(function(){
    var myScroll;
    var num = 10,
        curpage = 1,
    regu = /^[-]{0,1}[0-9]{1,}$/;//判断是否是整数;

    var talent_id = GetQueryString('talent_id');

    var count = 0; //当前商品总数 用来判断是否还要继续加载更多

    function loadDate(talent_id,curpage,num,type){
        FL.ajaxDate('post',get_talent_home,{mid:FL.mid,token:FL.token,talent_id:talent_id,curpage:curpage,num:num},function(data){
            if(data&&data.error=='0'){

               var map = {},
                    dest = [];
                for(var i = 0; i < data.result.time_images.length; i++){
                    var ai = data.result.time_images[i];
                    ai.add_time = talentTime(ai.add_time,'<span class="f30">MM</span>月·yyyy');
                    if(!map[ai.add_time]){
                        dest.push({
                            time_pic: [ai]
                        });
                        map[ai.add_time] = ai;
                    }else{
                        for(var j = 0; j < dest.length; j++){
                            var dj = dest[j];
                            if(dj.time_pic[0].add_time == ai.add_time){
                                dj.time_pic.push(ai);
                                break;
                            }
                        }
                    }
                }

                data.result.timePic=dest;

                var html = template('talent-tpl',data.result);

                if(type=='yes'){
                    $('#talent_index').html(html);
                }else{
                    $('#talent_index').append(html);
                }

                var talent_background = data.result.talent_info.talent_background;

                if(talent_background){
                    //var  talent_background = "http://img5.imgtn.bdimg.com/it/u=2716535803,3094696160&fm=21&gp=0.jpg";
                    $('#talentbody').css('background','url("'+talent_background+'") no-repeat');
                    $('#talentbody').css('background-size','cover');
                }


                $('#talent_index img').lazyload();

                var height = FL.getClientHeight();
                $('body').css('height',height);
                var cententheight = height-42+"px";
                $('.talentcentent').css('height',cententheight);
                $('.talentcentent').css('overflow','hidden');
                var blockheight = height-265-42+"px";
                $('.blockheight').css('height',blockheight);

                
                
                $('.share').click(function(){
		            var me = this;
		            var _title,_desc,_pic,_url;
		            _title = $(me).attr('data-title');
		            _desc  = $(me).attr('data-content');
		            _pic   = $(me).attr('data-image');
		            _url   = $(me).attr('data-url');
		            $('.-mob-share-ui').show();
		            FL.share(_title,_desc,_pic,_url,"","","",talent_id,"talent");
		        });
                 
                $('.isfollow').click(function(){
                	    FL.judgeLogin();
                   	var me = this;
                   	if($(me).hasClass('follow')){
                   		type = '0';
                   	}else{
                   		type ="1";
                   	}
                    followTalent(type,me);
                });
                
                setTimeout(function(){
                    $.getScript("../../src/js/tmpl/specialty/test.js");
                },2000);
                    $('#-mob-share').attr('src','http://f1.webshare.mob.com/code/mob-share.js?appkey=13a3931a47072');
               
            }
        });
    }

    function followTalent(type,self){
        FL.ajaxDate('post', follow_talent, {
            mid : FL.mid,
            token : FL.token,
            talent_id : talent_id,
            type : type
        }, function(data){
            if(data && data.error == '0'){
                if(type=='0'){
                	  $(self).removeClass('follow').addClass('followed');
                }else{
                	  $(self).removeClass('followed').addClass('follow');
                }
            }
        });
    }



    loadDate(talent_id,1,10,'yes');

})

