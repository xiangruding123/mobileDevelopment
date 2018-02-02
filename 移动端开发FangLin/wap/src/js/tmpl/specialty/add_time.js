/*************添加时光*****************/
$(function(){
    if(!localStorage.getItem("backLink")){
        var backLink=document.referrer;
        localStorage.setItem("backLink",backLink);
    }

    var tags=JSON.parse(sessionStorage.getItem('tags'))||[];var gps={};
    // 发布时光
    function addTime(content,gps,tags,images,goods){
        data = {mid:FL.mid,token:FL.token,content:content,gps:gps,tags:tags,images:images,goods:goods}
        FL.ajaxDate('post',add_time,data,function(data){
            if(data&&data.error=='0'){
                if(data.result>0){
                    layer.msg('发布成功');
                    var backLink = localStorage.getItem("backLink");
                    localStorage.removeItem("backLink");
                    setTimeout(function(){
                        sessionStorage.clear();
                        location.href = backLink;
                    },1500);
                }
            }else{
                layer.msg(data.msg);
            }
        });
    }
    function getCityByBaiduCoordinate(rs) {
        var city = rs.addressComponents.city;
        var county = rs.addressComponents.district;
        var address = rs.addressComponents.street;
        gps.city=city;
        gps.county=county;
        gps.address=address;
        sessionStorage.setItem('gps',JSON.stringify(gps));
        $('.city').text(city);
        $('.address').text(address);
        $('.location span').text(city+" "+address);
    }

    //getGps();

    function getGps(){
        var geolocation = new BMap.Geolocation();
        geolocation.getCurrentPosition(function(r){
            if(this.getStatus() == BMAP_STATUS_SUCCESS){
                var x =r.point.lng;
                var y =r.point.lat;
                gps.x=x;
                gps.y=y;
                var ggPoint = new BMap.Point(x,y);
                var geoc = new BMap.Geocoder();
                geoc.getLocation(ggPoint, getCityByBaiduCoordinate);
            }
        },{enableHighAccuracy: true})
    }

    $('#geolocation').click(function(){
        FL.addShade();
        $('.location').show();
    });

    $('.location p').on('click',function(){
        var  index =  $(this).index();
        $('.location').hide();
        FL.removeShade();
        if(index ==0){
            $('#geolocation').hide();
            sessionStorage.removeItem('gps');
        }else if(index == 2){
            getGps();
        }
    })




    //滑动函数 标签 图片 商品
    function tagWarpScroll(){
        var tabScrool = new IScroll(".tag-warp",{scrollX:true,scrollY:false,mouseWheel:true,tab:true});
        tagTum($('.tag-warp'),10);
        tagDelete();
    }
    function picWarpScroll(){
        var tabScrool = new IScroll(".pic-warp",{scrollX:true,scrollY:false,mouseWheel:true,tab:true});
        tagTum($('.pic-warp'),5);
    }
    function goodsWarpScroll(){
        var tabScrool = new IScroll(".goods-warp",{scrollX:true,scrollY:false,mouseWheel:true,tab:true});
        tagTum($('.goods-warp'),10);
    }

    function tagTum(self,num){
        var len = $(self).find('.tagname').length||$(self).find('.tagpic').length||$(self).find('.taggoods').length;
        $(self).parents('.timearticle').find('.tagTum').text(len+"/"+num);
    }

    //标签数据
    function loadDate(){
        FL.ajaxDate('post',get_tags,{mid:FL.mid,token:FL.token},function(data){
            if(data&&data.error=='0'){
                var html = template("tag-tmpl",data.result);
                $("#tag .fh-header").after(html);
                bindEvent();
            }
        });
    }

    //删除时光标签最近选择
    function deleteHistory(del_all,tag_name){
        FL.ajaxDate('post',delete_history,{mid:FL.mid,token:FL.token,del_all:del_all,tag_name:tag_name},function(data){
            if(data&&data.error=='0'){
                layer.msg("删除成功");
            }
        });
    }

    //搜索时光标签
    function searchTags(key,num){
        if(key){
            FL.ajaxDate('post',search_tags,{mid:FL.mid,token:FL.token,key:key,num:num},function(data){
                if(data&&data.error=='0'){
                    var html = template("search_tags_tmpl",data.result);
                    $("#search_tag").html(html);
                    if(data.result.exists=='0'){
                        $('#addSearchTag span').text(key);
                    }


                    $('#addSearchTag').click(function(){
                        addTag(key);
                    });

                    $('.activetag').click(function(){
                        var me = this;
                        var tagsData = JSON.parse(sessionStorage.getItem('tags'))||[];
                        var spandom = "<span index="+tagsData.length+" class='tagname'>"+$(me).text()+"</span>";
                        tags[tags.length]=$(me).text();
                        sessionStorage.setItem('tags',JSON.stringify(tags));
                        $('#addTagName').after(spandom);
                        tagWarpScroll();
                        $('#search_tag').hide();
                        $('#tag').hide();
                    })
                }
            });
        }else{
            $('#addSearchTag').remove();
        }

    }
    //添加时光标签
    function addTag(tag_name){
        FL.ajaxDate('post',add_tag,{mid:FL.mid,token:FL.token,tag_name:tag_name},function(data){

            if(data&&data.error=='0'&&data.result>0){
                searchTags(tag_name);
            }
        });

    }

    //标签选择
    $('#tag .goback').click(function(){
        $('#tag').hide();
    });

    $('#addTagName').click(function(){
        var len = $('.tag-warp .tagname').length;
        if(len<10){
            $('#tag').show();
        }else{
            layer.msg('标签最多添加10个');
        }

    });
    $('.activetag').click(function(){
        var me = this;
        var spandom = "<span index="+tags.length+" class='tagname'>"+$(me).text()+"</span>";
        // if(sessionStorage.getItem('tags')){
        //     sessionStorage.setItem('tags',sessionStorage.getItem('tags')+","+$(me).text());
        // }else{
        //     sessionStorage.setItem('tags',$(me).text());
        // }
        tags[tags.length]=$(me).text();
        sessionStorage.setItem('tags',JSON.stringify(tags));
        $('#addTagName').after(spandom);
        tagWarpScroll();
        $('#tag').hide();
    })

    //标签时件
    function bindEvent(){
        $('#clearTag').on('click',function(){
            $('#noinfoDialog').show();
            FL.addShade();
            $('#leftbtn').click(function(){
                FL.removeShade();
                $('#noinfoDialog').hide();
            });
            $('#rightbtn').click(function(){
                FL.removeShade();
                $('#noinfoDialog').hide();
                deleteHistory(1,'');
                $('.tag-article-new span').remove();
            });

        });
        $('#goods_search').bind("input propertychange",function(){
            var me = this;
            if($(me).length>0){
                $('#search_tag').show();
                $('#tag header').css("position",'fixed');
            }else{
                $('#search_tag').hide();
                $('#tag header').css("position",'relative');
            }
            var key = $(me).val();
            searchTags(key,10);
        });

        $('#tag .tagname').click(function(){
            var me = this;
            var spandom = "<span index="+tags.length+" class='tagname'>"+$(me).text()+"</span>";
            // if(sessionStorage.getItem('tags')){
            //     sessionStorage.setItem('tags',sessionStorage.getItem('tags')+","+$(me).text());
            // }else{
            //     sessionStorage.setItem('tags',$(me).text());
            // }
            tags[tags.length]=$(me).text();
            sessionStorage.setItem('tags',JSON.stringify(tags));
            $('#addTagName').after(spandom);
            tagWarpScroll();
            $('#tag').hide();
        })

    }


    //时光图片
    $('#picwarp').change(function(){
        upLoadImage();
    });

    function upLoadImage(){

        var fd = new FormData();
        fd.append("mid", FL.mid);
        fd.append("token",FL.token);
        fd.append("flag","wap");
        fd.append("img", $('#picwarp')[0].files[0]);
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
                    location.href = "pic.html?img="+data.result;
                }
            },
            error:function(xhr) {

            }

        });


    }

    $('#goodswarp').click(function(){
        try{
            var goodslen = JSON.parse(sessionStorage.getItem('goods')).length;
        } catch(e) {
            var goodslen =0;
        }

        if(goodslen<10){
            location.href = "goods.html";
        }else{
            layer.msg('关联商品不能超过10个');
        }

    });

    //存储取值
    if(sessionStorage.getItem('tags')){
        var tagsData = JSON.parse(sessionStorage.getItem('tags'));
        for(var i=0;i<tagsData.length;i++){
            (function(index){
                $('#addTagName').after("<span index="+index+" class='tagname'>"+tagsData[index]+"</span>");
                tagWarpScroll();
            })(i);
        }
    }
    if(sessionStorage.getItem('images')){
        var imagesData = JSON.parse(sessionStorage.getItem('images'));
        for(var i=0;i<imagesData.length;i++){
            (function(index){
                $('#picwarp').after('<img class="tagpic" index="'+index+'" src="'+imagesData[index].image+'" alt="">');
                picWarpScroll();
            })(i);
        }
    }
    if(sessionStorage.getItem('goods')){
        var goodsData = JSON.parse(sessionStorage.getItem('goods'));
        for(var i=0;i<goodsData.length;i++){
            (function(index){
                $('#goodswarp').after('<img index="'+index+'" goods_id="'+goodsData[index].goods_id+'" class="taggoods" src="'+goodsData[index].goods_images+'" alt="">');
                goodsWarpScroll();
            })(i);
        }
    }


    loadDate();

    // 删除标签
    $('.delTagName').on("click",function(){
        var me = this;
        var index = $(me).index();
        
        
    });


    //删除标签
    function tagDelete(){
        $('.boxtag .tagname').unbind("click").bind("click",function(){
            var me = this;
            var index = $(me).attr('index');
            FL.addShade();
            $('#deleteInfoDialog').show();
            $('#deleteInfoDialog #leftbtn').click(function(){
                FL.removeShade();
                $('#deleteInfoDialog').hide();
                var tagsData = JSON.parse(sessionStorage.getItem('tags'));
                tagsData.splice(index,1);
                sessionStorage.setItem('tags',JSON.stringify(tagsData));
                $(me).remove();
            });
            $('#deleteInfoDialog #rightbtn').click(function(){
                FL.removeShade();
                $('#deleteInfoDialog').hide();
            });
        });
    }

    //删除关联商品
    
    
    //删除图片中含有的商品
        var goodsDataSub = JSON.parse(sessionStorage.getItem('goods'));
	        if(goodsDataSub){
	        	    for(var l=goodsDataSub.length;l>-1;l--){
		            (function(index){
		            	
		            	  try{
		            	  	if(goodsDataSub[index].goods_flag=="true"){
		                    goodsDataSub.splice(index,1);
		                    sessionStorage.setItem('Good',JSON.stringify(goodsDataSub));
		                }
		            	  }catch(e){
		            	  	console.log('hello');
		            	  }
		                
		            })(l);		            
		        }
	        	    
        }
        


    $('#submitTime').on("click",function(){
        var content = $('#timeContent').val(),
            gps = sessionStorage.getItem('gps')||"",
            tags = sessionStorage.getItem('tags'),
            images = sessionStorage.getItem('images'),
            goods = sessionStorage.getItem('Good');
        
          addTime(content,gps,tags,images,goods);
    });
});

