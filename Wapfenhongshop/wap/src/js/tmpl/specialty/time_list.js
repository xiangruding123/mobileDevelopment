/*************时光列表*****************/
!function(Global) {
    var num = 10,
        flag = true,
        curpage,
        dataType,
        regu = /^[-]{0,1}[0-9]{1,}$/;//判断是否是整数;

    var count = 0; //当前商品总数 用来判断是否还要继续加载更多

    var  talent_id = GetQueryString('talent_id');

    function loadDate(dataType){
        FL.ajaxDate('post',get_talent_time_list,{talent_id:talent_id,mid:FL.mid,token:FL.token,num:num,curpage:curpage},function(data){
            if(data&&data.error=='0'){
            	var map = {},
                    dest = [];
                for(var i = 0; i < data.result.length; i++){
                    var ai = data.result[i];
                    ai.add_time = talentTime(ai.add_time,'<span class="f30">dd日</span>·MM月');
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
                
                 console.log(data)
                $('title,.header-title').text(data.result[0].talent.talent_name+"·时光");
                
                data.result.timePic=dest;

                var html = template("timeList-tmpl",data.result);
                if(dataType=='yes'){
                    $("#timeListCentent").html(html);
                }else{
                    $("#timeListCentent").append(html);
                }

                for(var i =0;i<data.result.timePic.length;i++){
	                	for(var m = 0;m<data.result.timePic[i].time_pic.length;m++){
	                		try{
	                        var mySwiper = new Swiper('.timeListMedia'+i+'_'+m+' .swiper-container', {
	                            // loop: true,
	                            effect: 'fade',
	                            autoplay: 6000,
	                            // 如果需要分页器
	                            pagination: '.timeListMedia'+i+'_'+m+' .swiper-pagination'
	
	                        });
	                    } catch(e) {
	
	                    }
	                	}
                }
                for(var i = 0;i<data.result.timePic.length;i++){
                	  	for(var m = 0;m<data.result.timePic[i].time_pic.length;m++){
                    for(var f = 0;f<data.result.timePic[i].time_pic[m].images.length;f++){
                        if(data.result.timePic[i].time_pic[m].images[f].goods){
                            var canvas = document.getElementById(i+"_"+m+"myCanvas"+f);
                            var goods = data.result.timePic[i].time_pic[m].images[f].goods;
                            var w =$(window).width();
                            canvas.width = w;
                            canvas.height = w;
                            for(var j=0;j<goods.length;j++){
                                var value = goods[j].location.split(',');
                                var
                                x = parseFloat(value[0])*w;
                                y = parseFloat(value[1])*w;
                                var valueO=goods[j].line1.value,
                                    valueT=goods[j].line2.value,
                                    valueTh=goods[j].line3.value;
                                var direction =goods[j].line1.direction;
                                drawLine(canvas,x,y,valueO,valueT,valueTh,direction);
                                if(direction=="R"){
                                    var dom = '<a class="goodsLink" style="top:'+(y-45)+'px;left:'+x+'px;" href="../shopping/goods_details.html?goods_id='+goods[j].goods_id+'&talent_deductid='+data.result.timePic[i].time_pic[m].images[f].talent_deductid+'"></a>';
                                }else{
                                    var dom = '<a class="goodsLink" style="top:'+(y-45)+'px;left:'+(x-130)+'px;" href="../shopping/goods_details.html?goods_id='+goods[j].goods_id+'&talent_deductid='+data.result.timePic[i].time_pic[m].images[f]+'"></a>';
                                }
                                $("#"+i+"_"+m+"myCanvas"+f).after(dom);
                            }
                        }
						}
                    }
                }

                for(var v = 0;v<data.result.timePic.length;v++){
                	  	for(var m = 0;m<data.result.timePic[v].time_pic.length;m++){
                    try{

                        var tabScrool = new IScroll(".f-nav-stickytabs"+v+"_"+m,{scrollX:true,scrollY:false,mouseWheel:true,tab:true});

                    }catch(e){
                        //TODO handle the exception
                    }
                }
                }
                bindEvent();

            }
        });
    }


    function bindEvent(){
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
        
        $('#-mob-share').attr('src','http://f1.webshare.mob.com/code/mob-share.js?appkey=13a3931a47072');

        $('.share').click(function(){
            var me = this;
            var _title,_desc,_pic,_url;
            _title = $(me).attr('data-title');
            _desc  = $(me).attr('data-content');
            _pic   = $(me).attr('data-image');
            _url   = $(me).attr('data-url');
            share_id = $(me).attr('time_id');
            $('.-mob-share-ui').show();
            FL.share(_title,_desc,_pic,_url,"","","",share_id,"time");
        });

        $('.deleteTime').click(function(){
        	    FL.judgeLogin();
            var me = this;
            var time_id= $(me).attr('time_id');
            var self = $(me).parents('.timeListMedia');
            var len = $(me).parents('.timeListPic').find('.timeListMedia').length;
            deleteTime(time_id,self,len);
            
        });
        $('.collect_count').click(function(){
					FL.judgeLogin();
					var me = this;
					var collect_count = parseFloat($(me).attr('collect_count'));
					var time_id=$(me).attr('time_id');
					if($(me).hasClass('collected')){
						delCollect(time_id,"time",me,collect_count);
					}else{

						addFavorites(time_id,"time",me,collect_count);
					}

				});

				$('.comment_count').click(function(){
					FL.judgeLogin();
					var time_id = $(this).attr('time_id');
					location.href='../specialty/time_detail.html?time_id='+time_id+"&comment_count=true";
				});
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
    }

    function deleteTime(time_id,self,len){
        FL.ajaxDate('post',delete_time,{mid:FL.mid,token:FL.token,time_id:time_id},function(data){
            if(data&&data.error=='0'){
                layer.msg('删除成功');
                	len == 1?$(self).parents('.timeListPic').remove():$(self).remove();;
                
                
            }
        });
    }



    loadDate();
    
    // 删除收藏
	function delCollect(fid,type,self,collect_count){
		$.ajax({
			type: 'post',
			url: WapSiteUrl + '/api/index.php?act=buyer_favorite&op=delete_favorites',
			data: {
				flag: 'wap',
				token: FL.token,
				mid: FL.mid,
				fid:fid,
				type:type
			},
			dataType: 'json',
			success: function(data) {
				if (data&&data.error === '0') {
					$(self).removeClass('collected');
					$(self).find('img').attr('src','../../images/wap/specialty/collect.png');
					collect_count=='1'?$(self).find("span").text("收藏"):$(self).find("span").text(collect_count-1);
					$(self).attr('collect_count',collect_count-1);
				}
			}

		})
	}

	function addFavorites(fid,type,self,collect_count){
		$.ajax({
			type: 'post',
			url: WapSiteUrl + '/api/index.php?act=buyer_favorite&op=add_favorites',
			data: {
				flag: 'wap',
				token: FL.token,
				mid: FL.mid,
				fid:fid,
				type:type
			},
			dataType: 'json',
			success: function(data) {
				if (data&&data.error === '0') {
					$(self).addClass('collected');
					$(self).find('img').attr('src','../../images/wap/specialty/collected.png');
					collect_count++;
					$(self).find("span").text(collect_count);
					$(self).attr('collect_count',collect_count);
				}
			}

		});
	}

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
