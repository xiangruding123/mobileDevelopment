!function(Global) {
    var num = 10,
    	curpage = 1,
    	count = 0,
    	order_num =2,
    	sort_num =1,
    	flag = true,
        key,
        gc_id,        
    	regu = /^[-]{0,1}[0-9]{1,}$/;//判断是否是整数;
    	ImgFormat();//图片选择
    var _title='你最爱的N元任选来啦', _content='我在分红全球购发现了一个超值N元任选活动！N元任选N件买买买，想省多少你说的算！会花会省才是王道！', _url=location.href ,_imgs='http://www.fenhongshop.com/wap/images/wap/logo.png';
    var mid = "";
    var store_id = GetQueryString("store_id");
    var resource_tags;
    
	function loadData(){
		getBrandList("yes",num,curpage,store_id,mid);
	}
	
	function getMemberInfo(info) {
        mid = info.member_id,
            token = info.token,
            storeId = info.store_id;


        loadData();


        //app数据添加token
        addcookie('member_name', info.member_name);
        addcookie('mid', info.member_id);
        addcookie('token', info.token);
        addcookie('nickname', info.member_nickname);
        addcookie('storeId', info.store_id);

    }
	
	//获取mid
	if(native_flag=='0'||native_flag=='1'){
		
        
        appMemberInfo({
                success: getMemberInfo
        });
        
        // 用户信息
	
		
	}else{
		$('.fh-header').removeClass('none');
		mid = FL.mid;
		token = FL.token;
		storeId = FL.store_id;
		$("#-mob-share").attr('src','http://f1.webshare.mob.com/code/mob-share.js?appkey=13a3931a47072');
		loadData();
	}
	
	//分享
	$('.share').click(function(){
		$(".-mob-share-ui").show();
		FL.wxShare(_title, _content, _url ,_imgs);
	});
    FL.wxShare(_title, _content, _url ,_imgs);
    
    var shareObj ={};
	    shareObj.title = _title,
		shareObj.desc = _content,
		shareObj.img = _imgs,
		shareObj.url = _url;

    rightShare(shareObj);


	
	
	
	//type:yes页面清空再添加 no直接添加
    function getBrandList(type,num,curpage,store_id,mid) {
        $.ajax({
            url: WapSiteUrl + '/api/index.php?act=store_manselect&op=get_manselect_activity',
            type: 'get',
            dataType: 'json',
            data: { num: num,curpage: curpage,flag: 'wap',store_id:store_id,mid:mid},
            success: function(data) {
                if (data&&data.error === "0") {
                	
                	$('#rule_name').text("以下商品"+data.result.rule_name);
                	
                var 	objmanselect = data.result.manselect_rules;
                var goods_nums = data.result.goods_nums;
                	titleChange(objmanselect,goods_nums);
                	sessionStorage.setItem('goods_nums',goods_nums);
                	sessionStorage.setItem('objmanselect',JSON.stringify(objmanselect));
                    var html = template.render('brandDetails', data);
                    if(type=="yes"){
                    	$("#brand_details").html(html);
                    }else{
                    	$("#brand_details").append(html);
                    }
                    
                    //计算图片大小
						var imgwidth =parseInt(($(".brand_details_list li").width()));
						$(".brand_details_list a>img").css({"width":imgwidth+"px","height":imgwidth+"px"});
						
                    $("#brand_details img").lazyload({ threshold : 200 });
                    
                    $('.add-cart').click(function(){
                    		var goods_id = $(this).attr('goods_id'),quantity=1,goods_source=$(this).attr('goods_source');
			        		var data =  {token: token,goods_id: goods_id,quantity: quantity,store_id: storeId,mid: mid,flag: 'wap',gc_area: goods_source };
			           	addShopCar(data);
                    });
                    
                   
                }
                
            }
        });
    }
    
   //添加购物车
	function addShopCar(data){
		$("#goods-details #addOne").hide();
		$.ajax({
            url: WapSiteUrl + '/api/index.php?act=buyer_cart&op=add',
            type: 'get',
            dataType: 'json',

            data:data,

            success: function(data) {
                
                if (data.error==='0') {
                    
                    layer.msg('添加购物车成功');
                    
                    	var goods_nums = sessionStorage.getItem('goods_nums');
                	    var  objmanselect = JSON.parse(sessionStorage.getItem('objmanselect'));
                	    goods_nums=parseFloat(goods_nums)+1;
		            titleChange(objmanselect,goods_nums);
		            sessionStorage.setItem('goods_nums',goods_nums);
                }else if(data.error==='0008'){
                    if(native_flag=='0'){
                    	
                    	EECross.executeNative("gotoLogin4Result", null, function(data) {
                    		obj = JSON.parse(data);
		                   mid=obj.member_id;
					       token = obj.token;
					       storeId = obj.store_id;
					       loadData();
					       
	                    });
	                    	
                    }else if(native_flag=='1'){
                    	    FHMall.gotoLogin4Result(function(data) {
									   obj = JSON.parse(data);
					                   mid=obj.member_id;
								       token = obj.token;
								       storeId = obj.store_id;
								       loadData();
							});
                    }else{
                      	FL.logLogin();
                    }
					
                	
                }else{
                	   var txt = data.msg||'系统繁忙中,请稍后添加';
                	   layer.msg(txt);
                }
            },
            error:function(xhr){
            	
            }
        });
	}
	
    function titleChange(objmanselect,goods_nums){
    	    for (var l = 0; l < objmanselect.length; l++) {
                if (objmanselect[l].manselect_nums - goods_nums > 0) {
	                    if (l > 0) {
	                        	$("#goods_nums").text("已满足【" + objmanselect[l - 1].manselect_money + "元任选" + objmanselect[l - 1].manselect_nums + "件】");
	                        break;
	                    } else {
	                        	$("#goods_nums").text("已选"+goods_nums+"件 再购" + (objmanselect[l].manselect_nums - goods_nums) + "件立享【" + objmanselect[l].manselect_money + "元任选" + objmanselect[l].manselect_nums + "件】");
	                        break;
	                    }
	
	                } else if (objmanselect[l].manselect_nums - goods_nums == 0) {
	                    	$("#goods_nums").text("已满足【" + objmanselect[l].manselect_money + "元任选" + objmanselect[l].manselect_nums + "件】");
	                    break;
	                } else if (objmanselect[l].manselect_nums - goods_nums < 0) {
	                    	$("#goods_nums").text("已满足【" + objmanselect[l].manselect_money + "元任选" + objmanselect[l].manselect_nums + "件】");
	                    
	                }
	            }
    }
    

	function bindRefresh(){
   		$(window).scroll(function() {
			var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
			var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
			var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
			if (scrollTop + clientHeight == htmlHeight) {
				var showNum = $(".brand_details_list li").length;//当前页面显示的个数
				page = showNum/num + 1; //上拉加载要显示的页数
				if(count != page && regu.test(page)){
					getBrandList("no",num,page,store_id,mid);
					count = page;
				}else{
//                  layer.msg("已经没有商品了");
				}
			}
		})
	}
	
	bindRefresh();
		

}(this);
