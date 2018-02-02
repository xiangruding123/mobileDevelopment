(function($, w, d) {

		// 收藏商品列表
		var token = getcookie("token");
		var mid = getcookie("mid");
		var num =10;
		var curpage = 1;
		var count=0,regu = /^[-]{0,1}[0-9]{1,}$/;//判断是否是整数;
		//页面跳转过来进入相应的页面
		var tab_num = GetQueryString("index");
	    var tabScrool = new IScroll(".f-nav-stickytabs",{scrollX:true,scrollY:false,tab:true,preventDefault:false});


	function  bindEvent(){

			//相应页面显示
			if(tab_num){

				$($(".navbox li")[tab_num]).addClass('selected').siblings('li').removeClass('selected');
				if(tab_num=='2'){
              tab_num=6;
				}else if(tab_num=='3'){
				    	tab_num=5;
				}

				$(".tableChange").hide();
				$($(".tableChange")[tab_num]).show();
				//页面内容
				loadPanel(tab_num,1);

		    }

			//点击进入相应页面
			$(".navbox li").bind('click',function(){
				var me = this;
				var page = $(me).attr("tab");

				curpage=1;
				count = 0;

				$(me).addClass('selected').siblings('li').removeClass('selected');

				$(".tableChange").hide();

				if($($(".tableChange")[page]).text()==""){
					loadPanel(page,curpage);
				}

				$($(".tableChange")[page]).show();

				//店铺收藏横向滑动
				if(page=="1"){
					addScroll();
				}

				//切换时编辑状态取消
				$('.media_l').hide();
				$('footer').hide();

		    });


		    //编辑
		     edit();


		    //单个选中取消
	        $("#history").on("click",".single",radio);

		     //全部选中取消
            $("#history").on("click",".all",moreChoose);


		}


		//type 获取类型 (goods:商品， shop:店铺， microshop:微店)
		function loadPanel(tab_num,curpage){
			if(tab_num==0){
				collectAjax('goods', 'goods-tpl', '#product-collect',curpage);
			}else if(tab_num==1){
				collectAjax('shop', 'shop-tpl', '#shop-collect',curpage);
			}else if(tab_num==2){
				collectAjax('microshop', 'microshop-tpl', '#microshop-collect',curpage);
			}else if(tab_num==3){
				collectAjax('talent', 'talent-tpl', '#talent-collect',curpage);
			}else if(tab_num==4){
				collectAjax('time', 'time-tpl', '#time-collect',curpage);
			}else if(tab_num==5){
				myLibrary('library-tpl','#library-collect',curpage);
			}else if(tab_num==6){
				collectAjax('brand','brand-tpl','#brand-collect',curpage);
			}

		}

        //收藏列表
		function collectAjax(type, tpl, id , curpage) {
			$.ajax({
				type: 'post',
				url: WapSiteUrl + '/api/index.php?act=buyer_favorite&op=get_favorites_list',
				data: {
					flag: 'wap',
					token: token,
					mid: mid,
					type: type,
					num:num,
					curpage:curpage
				},
				dataType: 'json',
				success: function(data) {
					if (data&&data.error === '0') {
						var html = template.render(tpl, data);
						$(id).append(html);


						addScroll();



					}


				}

			})
		}

	    //浏览历史列表
		function myLibrary(tpl, id,curpage){
			$.ajax({
				type: 'post',
				url: WapSiteUrl + '/api/index.php?act=buyer_browse&op=get_browse_list',
				data: {
					flag: 'wap',
					token: token,
					mid: mid,
					num:num,
					curpage:curpage
				},
				dataType: 'json',
				success: function(data) {
					if (data&&data.error === '0') {
						var html = template.render(tpl, data);
						$(id).append(html);
					}


				}

			})
		}
        // 删除收藏
	    function delCollect(fid,type,thisid){
	    	$.ajax({
				type: 'post',
				url: WapSiteUrl + '/api/index.php?act=buyer_favorite&op=delete_favorites',
				data: {
					flag: 'wap',
					token: token,
					mid: mid,
					fid:fid,
					type:type
				},
				dataType: 'json',
				success: function(data) {

					if (data&&data.error === '0') {
						$(thisid).remove();
					    layer.msg('删除成功');
					}
				}

			})
	    }
	    //删除浏览历史
	    function delhistory(id,thisid,all){
	    	if(all=="alldel"){
	    		res={flag:'wap',token:token,mid:mid,delall:1};
	    	}else{
	    		res={flag:'wap',token:token,mid:mid,id:id};
	    	}
	    	$.ajax({
				type: 'post',
				url: WapSiteUrl + '/api/index.php?act=buyer_browse&op=delete_browse',
				data: res,
				dataType: 'json',
				success: function(data) {

					if (data&&data.error === '0') {
						$(thisid).remove();
					    layer.msg('删除成功');
					}
				}
			})
	    }


        	  //计算店铺添加横向滚动条
		function addScroll(){
			var liWidth = ($(".swiper-container").width())*0.3+10;
			$('.swiper-container').each(function(index){
				var num = $(this).find("li").length;
				var tabWith = liWidth*num;
				if(tabWith>($(".swiper-container").width())){
					$(this).find(".swiper-wrapper").attr("style","width:"+tabWith+"px");
					$(".img-single").attr("style","width:"+liWidth+"px");
					$($(".img-single").find("img")).each(function(){
						$(this).css("height",$(this).offsetWidth+"px");
					});


					var tabScrool = new IScroll("#t_tabs_"+index,{scrollX:true,scrollY:false,tab:true,preventDefault:false});

				}
			});
		}


        //编辑
        function edit(){
        	 $("img.icon_edit").click(function(){
	        	var page = $('.selected').attr("tab");
	        	var objIcon=$($('.tableChange')[page]).find(".media_l");
	        	if(objIcon.is(":hidden")){
	        		objIcon.show();
	        		$("footer").show();

	        	}else{
	        		objIcon.hide();
	        		$("footer").hide();
	        	}

	        });
        }



        //单个选中取消
        function radio(){
        	var me = this;
        	if($(me).hasClass('icon-circle-blank')){
        		$(me).attr("class",'single icon-ok-sign');
        		$(me).parents(".tableChange").find('footer button').css('background-color','#fa2855');

        		var mLen = $(me).parents(".tableChange").find('.media').length;
        	    var iLen = $(me).parents(".tableChange").find('.media').find('i.icon-ok-sign').length;
	        	if(mLen==iLen){
	        		$('footer i').attr('class','icon-ok-sign');
	        	}

	        	var tabNum = $(me).parents("section.tableChange").attr("tab");

	        	var fidtype;
	        	if(tabNum=='0'||tabNum=='5'){
	    		 	fidtype='goods_id';
	    		 }else if(tabNum=='1'){
	    		 	fidtype='store_id';
	    		 }else if(tabNum=='2'){
	    		 	fidtype='shop_id';
	    		 }else if(tabNum=='3'){
	    		 	fidtype="talent_id";
	    		 }else if(tabNum=='4'){
	    		 	fidtype="time_id";
					}else if(tabNum=='6'){
	    		 	fidtype="brand_id";
	    		 }
	        	var arrayFid=[];
        		var thisid = $(me).parents(".tableChange").find('.media').find('i.icon-ok-sign').parents('.media');

                var inum = $(me).parents(".tableChange").find('.media').index();

                arrayFid[inum]=$(me).parents('.media').attr(fidtype);

        		var fid = arrayFid.join(',');
	        	del(fid,thisid);


        	}else{
        		if($(me).parents(".media").siblings(".media").find("i.icon-ok-sign").length<=0){
        			$(me).parents(".tableChange").find('footer button').css('background-color','#999');
        		}
        		$(me).attr("class",'single icon-circle-blank');

        		$('footer i').attr('class','icon-circle-blank');

        	}
        }
        //全部选中取消
        function moreChoose(){
        	var me=this;
        	var tabNum = $(me).parents("section.tableChange").attr("tab");
        	var fidtype;
        	if(tabNum=='0'||tabNum=='5'){
    		 	fidtype='goods_id';
    		 }else if(tabNum=='1'){
    		 	fidtype='store_id';
    		 }else if(tabNum=='2'){
    		 	fidtype='shop_id';
    		 }else if(tabNum=='3'){
	    		fidtype="talent_id";
	    	 }else if(tabNum=='4'){
	    		fidtype="time_id";
	    	 }else if(tabNum=='6'){
					 fidtype="brand_id";
					}

        	if($(me).hasClass('icon-circle-blank')){

        		$(me).attr("class",'icon-ok-sign all');

        		$(me).parents(".tableChange").find('footer button').css('background-color','#fa2855');

        		$(me).parents(".tableChange").find('.media').find('i').attr("class",'icon-ok-sign single');

        		var arrayFid=[];
        		var thisid = $(me).parents(".tableChange").find('.media').find('i.icon-ok-sign').parents('.media');

                var inum = $(me).parents(".tableChange").find('.media').index();

                arrayFid[inum]=$(me).parents('.media').attr(fidtype);

        		var fid = arrayFid.join(',');

	        	del(fid,thisid,"alldel");

        	}else{

        		$(me).parents(".tableChange").find('footer button').css('background-color','#999');

        		$(me).attr("class",'icon-circle-blank all');

        		$(me).parents(".tableChange").find('.media').find('i').attr("class",'icon-circle-blank single');

        	}
        }

        //删除
        function del(fid,thisid,all){
        	$('#history').on('click','.delHis',function(){
        		var me = this;
        		var tabNum = $(me).parents(".tableChange").attr('tab');

        		 if(tabNum=='0'){
        		 	delCollect(fid,'goods',thisid);
        		 }else if(tabNum=='1'){
        		 	delCollect(fid,'shop',thisid);
        		 }else if(tabNum=='2'){
        		 	delCollect(fid,'microshop',thisid);
        		 }else if(tabNum=='3'){
	    		 	delCollect(fid,'talent',thisid);
	    		 }else if(tabNum=='4'){
	    		 	delCollect(fid,'time',thisid);
	    		 }else if(tabNum=='5'){
        		 	delhistory(fid,thisid,all);
						}else if(tabNum=='6'){
		    		 	delCollect(fid,'brand',thisid);
		    		 }
        	})
        }

        bindEvent();

        bindRefresh();
				//绑定滚动
		    function bindRefresh() {
				$(window).scroll(function() {
					var htmlHeight = document.body.scrollHeight || document.documentElement.scrollHeight;
					var clientHeight = document.body.clientHeight || document.documentElement.clientHeight;
					var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
					if (scrollTop + clientHeight >= htmlHeight) {
						var tab_num = $(".navbox li.selected").attr('tab');
						var showNum = $('.tableChange').eq(tab_num).find(".media").length; //当前页面显示的个数
						curpage = showNum / 10 + 1; //上拉加载要显示的页数
						if (count != curpage && regu.test(curpage)) {

							loadPanel(tab_num,curpage);
							count = curpage;
						}else{
							layer.msg('没有更多内容了');
						}
					}
				})
			}

}($, window, document));
