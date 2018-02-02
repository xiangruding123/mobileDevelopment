$(function() {


	var key;
	$('#goods_search').bind('keydown',function(event){
		if (event.keyCode==13){		
		$('.icon-search').click();
	}
	})
	
	$('.icon-search,.header-right').click(function(event) {
		key = $.trim($('#goods_search').val());
		$.ajax({
			url: WapSiteUrl + '/api/index.php?act=common_goods&op=add_search_history',
			type: 'post',
			dataType: 'json',
			data: {
				token: FL.token,
				mid: FL.mid,
				flag: 'wap',
				keywords: key
			},
			success: function(data) {

			}
		});

		location.href = "../shopping/goods_list.html?key=" + key;
	});
    
    
    
	$.ajax({
		url: WapSiteUrl + '/api/index.php?act=common_goods&op=get_hot_search',
		type: 'get',
		dataType: 'json',
		data: {
			flag: 'wap'
		},
		success: function(data) {
			if (data.error === '0') {
				var html = template.render('search-hot-tpl', data);
				$('#search_hot .hot').html(html);

//              addScroll();
			}
		}
	});
	
	//计算添加横向滚动条
//		function addScroll(){
//			var liWidth = 60;
//			var num = $(".hot a").length;			
//			var tabWith = liWidth*num+150;			
//			if(tabWith>($('.container').width())){
//				$('.hot').attr("style","width:"+tabWith+"px");
//				var tabScrool = new IScroll("#search_hot p",{scrollX:true,scrollY:false,mouseWheel:true,tab:true});
//			}
//		}
	var datatxt;
	$.ajax({
		url: WapSiteUrl + '/api/index.php?act=common_goods&op=get_search_history_list',
		type: 'post',
		dataType: 'json',
		data: {
			token: FL.token,
			mid: FL.mid,
			flag: 'wap'
		},
		success: function(data) {
			if (data && data.error === '0') {

				var html = template.render('search-history-tpl', data);
				$('#search_history').html(html);

				//删除历史记录
				$('#delAll').click(function() {
					$('#search_dialog_success').show();
					FL.addShade();
					$('#leftbtn').click(function(){
						$('#search_dialog_success').hide();
						FL.removeShade();
					});
					$('#rightbtn').click(function(){
						del('1');
						$('#search_history').hide();
						FL.removeShade();
						$('#search_dialog_success').hide();
					})

				});

				$('#search_history .icon-remove').click(function() {
					var search_id = $(this).parent('li').attr('search_id');
					
					del('0',search_id);
					$(this).parent('li').hide();
				});

			}


		}
	});


	//删除历史记录

	function del(delall,search_id) {
		$.ajax({
			url: WapSiteUrl + '/api/index.php?act=common_goods&op=delete_search_history',
			type: 'post',
			dataType: 'json',
			data:{
						token: FL.token,
						mid: FL.mid,
						flag: 'wap',
						id: search_id,
						delall:delall					
					},
			success: function(data) {
				if (data && data.error === '0') {

				}
			}
		})
	}


});