/*************时光列表*****************/
!function(Global) {
    var num = 10,
        flag = true,
        curpage,
        dataType,
        regu = /^[-]{0,1}[0-9]{1,}$/;//判断是否是整数;

    var count = 0; //当前商品总数 用来判断是否还要继续加载更多

    ImgFormat();//圖片格式
    var comment_id;



    var  time_id = GetQueryString('time_id'),comment_count=GetQueryString('comment_count');

    function loadDate(dataType){
        FL.ajaxDate('post',get_time_detail,{time_id:time_id,mid:FL.mid,token:FL.token,num:num,curpage:curpage},function(data){
            if(data&&data.error=='0'){
                console.log(data);


                var html = template("timeList-tmpl",data.result);
                if(dataType=='yes'){
                    $("#timeListCentent").html(html);
                }else{
                    $("#timeListCentent").append(html);
                }

                $("#search_goods_list img").scrollLoading();

                for(var m = 0;m<data.result.images.length;m++){
                    if(data.result.images[m].goods){
                        var canvas = document.getElementById("myCanvas"+m);
                        var goods = data.result.images[m].goods;
                        var w = $(window).width();
                        canvas.width = w;
                        canvas.height = w;
                        for(var j=0;j<goods.length;j++){
                            var value = goods[j].location.split(',');
                            x = parseFloat(value[0])*w;
                            y = parseFloat(value[1])*w;
                            var valueO=goods[j].line1.value,
                                valueT=goods[j].line2.value,
                                valueTh=goods[j].line3.value;
                            var direction =goods[j].line1.direction;
                            drawLine(canvas,x,y,valueO,valueT,valueTh,direction);
                            //var dom = '<a class="goodsLink" style="top:'+(x+40)+'px;left:'+y/2+'px;" href="../shopping/goods_details.html?goods_id='+goods[j].goods_id+'&talent_deductid='+data.result.images[m].talent_deductid+'"></a>';
                            if(direction=="R"){
                                var dom = '<a class="goodsLink" style="top:'+(y-45)+'px;left:'+x+'px;" href="../shopping/goods_details.html?goods_id='+goods[j].goods_id+'&talent_deductid='+data.result.images[m].talent_deductid+'"></a>';
                            }else{
                                var dom = '<a class="goodsLink" style="top:'+(y-45)+'px;left:'+(x-130)+'px;" href="../shopping/goods_details.html?goods_id='+goods[j].goods_id+'&talent_deductid='+data.result.images[m].talent_deductid+'"></a>';
                            }
                            $("#myCanvas"+m).after(dom);
                        }
                    }

                }

                $('canvas').on('click',function(){
                    var me = this;
                    if($(me).css('opacity')=='0'){
                        $(me).parent('div').find('.goodsLink').show();
                        $(me).css('opacity','1');
                    }else{
                        $(me).parent('div').find('.goodsLink').hide();
                        $(me).css('opacity','0');
                    }
                });

                var mySwiper = new Swiper('.swiper-container', {
                    // loop: true,
                    effect: 'fade',
                    autoplay: 6000,
                    // 如果需要分页器
                    pagination: '.swiper-pagination'

                });

                var tabScrool = new IScroll(".f-nav-stickytabs",{scrollX:true,scrollY:false,mouseWheel:true,tab:true});


                bindEvent(data);

            }
        });
    }


    function bindEvent(data){
        if(comment_count=="true"){
            $('input').focus();
        }

        $('.timemore').click(function(){
            var me = this;
            if(!$(me).hasClass('timeup')){
                $(me).addClass('timeup');
                $(me).next('.updownlog').show();
            }else{
                $(me).removeClass('timeup');
                $(me).next('.updownlog').hide();
            }
        });
        $('.share').click(function(){
            var me = this;
            var _title,_desc,_pic,_url;
            var res = data.result.share;
            _title = res.title;
            _desc  = res.content;
            _pic   = res.image;
            _url   = res.url;
            share_id = data.result.time_id;
            FL.share(_title,_desc,_pic,_url,"","","",share_id,"time");
        });

        // $('.deleteTime').click(function(){
        //     var me = this;
        //     var time_id= data.result.time_id;
        //     var self = $(me).parents('.timeListMedia');
        //     deleteTime(time_id,self);
        // });

        $('.timereport').click(function(){
            var report_name =data.result.talent.talent_name,
                report_id =data.result.time_id;
            location.href = 'report.html?report_name='+report_name+"&type=time&report_id="+report_id;
        })

        $('#attention').click(function(){
        	   FL.judgeLogin();
            var me = this;
            var  talent_id = $(me).attr('talent_id');
            if($(me).hasClass("is_collected")){
                var type=1;
            }else{
                var type=0;
            }
            followTalent(talent_id,type,me);
        });

        $('.up_count').click(function(){
        	    FL.judgeLogin();
            var comment_id =  $(this).parents('.time-head').attr('comment_id');
            var is_upped = $(this).attr('is_upped');
            var me = this;
            //is_upped=='1'?cancelUp(comment_id,me):upComment(comment_id,me);
            is_upped=='1'?false:upComment(comment_id,me);
            event.stopPropagation();
        });

        $('.time-comment .time-head').click(function(){
        	   FL.judgeLogin();
            comment_id = $(this).attr('comment_id');
            member_name = $(this).attr('member_name');
            FL.addShade();
            $('#timeList .commentdialog').show();
            $('.commentback').click(function(){
                FL.removeShade();
                $('#timeList .commentdialog').hide();
                $('#commentText input').focus();
                $('#commentText input').attr('placeholder','回复:'+member_name);
                $('#commentText button').attr('comment_id',comment_id);
            });
            $('.reportLink').click(function(){
                FL.removeShade();
                $('#timeList .commentdialog').hide();
                var report_name =data.result.talent.talent_name;
                location.href = "report.html?report_name="+report_name+"&type=time_comment&report_id="+comment_id;
            });
            $('.loading-shade').click(function(){
                FL.removeShade();
                $('#timeList .commentdialog').hide();
            });
            event.stopPropagation();
        });

    }


    function followTalent(talent_id,type,self){
        FL.ajaxDate('post',follow_talent,{mid:FL.mid,token:FL.token,talent_id:talent_id,type:type},function(data){
            if(data&&data.error=='0'){
                type=='1'?$(self).removeClass("is_collected"):$(self).addClass("is_collected");
                type=='1'?$(self).text("+关注"):$(self).text("已关注");
            }
        });
    }

    function addTimeComment(comment,comment_id){
        FL.ajaxDate('post',add_time_comment,{mid:FL.mid,token:FL.token,time_id:time_id,comment:comment,comment_id:comment_id},function(data){
            if(data&&data.error=='0'){
                if(data.result=='1'){
                    location.reload();
                }else{
                    layer.msg(data.msg||"评论失败");
                }
            }
        });
    }

    function upComment(comment_id,me){
        FL.ajaxDate('post',up_comment,{mid:FL.mid,token:FL.token,comment_id:comment_id},function(data){
            if(data&&data.error=='0'){
                if(data.result=='1'){
                    $(me).find('.upcount').removeClass('grayupcount').addClass('redupcount');
                    var count = parseFloat($(me).find('.comment_up_count').text());
                    count++;
                    $(me).find('.comment_up_count').text(count);
                    $(me).attr('is_upped','1');
                }else{
                    layer.msg(data.msg);
                }
            }
        });
    }

    function cancelUp(comment_id,me){
        FL.ajaxDate('post',cancel_up,{mid:FL.mid,token:FL.token,comment_id:comment_id},function(data){
            if(data&&data.error=='0'){
                if(data.result=='1'){
                    $(me).find('.upcount').removeClass('redupcount').addClass('grayupcount');
                    var count = parseFloat($(me).find('.comment_up_count').text());
                    count--;
                    $(me).find('.comment_up_count').text(count);
                    $(me).attr('is_upped','0');
                }else{
                    layer.msg(data.msg);
                }
            }
        });
    }

    $('#commentText button').click(function(){
    	    FL.judgeLogin();
        var comment = $('#commentText input').val(),
            comment_id = $(this).attr('comment_id');
        addTimeComment(comment,comment_id);
    });



    loadDate();




    function drawLine(canvas,x,y,valueO,valueT,valueTh,direction){
        if(canvas.getContext){
            var ctx = canvas.getContext("2d");
            ctx.beginPath();
            ctx.strokeStyle = "white";
            if(direction=='R'){
                ctx.moveTo(x, y);
                ctx.lineTo(x+100, y);

                ctx.moveTo(x, y-30);
                ctx.lineTo(x+130, y-30);

                ctx.moveTo(x, y+30);
                ctx.lineTo(x+130, y+30);
                ctx.fillStyle='#fff';//文字颜色
                ctx.fillText(valueO, x+10, y-40);
                ctx.fillText(valueT, x+10, y-10);
                ctx.fillText(valueTh, x+10, y+20);

            }else if(direction=='L'){
                ctx.moveTo(x, y);
                ctx.lineTo(x-100, y);

                ctx.moveTo(x, y-30);
                ctx.lineTo(x-130, y-30);

                ctx.moveTo(x, y+30);
                ctx.lineTo(x-130, y+30);

                ctx.fillStyle='#fff';//文字颜色
                ctx.fillText(valueO, x-80, y-40);
                ctx.fillText(valueT, x-80, y-10);
                ctx.fillText(valueTh, x-80, y+20);

            }

            ctx.moveTo(x, y-30);
            ctx.lineTo(x, y+30);
            ctx.stroke();
            ctx.closePath();

            ctx.beginPath();
            ctx.arc(x, y, 10, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            ctx.fill();

            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2, false);
            ctx.closePath();
            ctx.fillStyle = '#fff';
            ctx.fill();

        }
    }

}(this);
