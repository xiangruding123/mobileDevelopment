;$(function(){


	var pid= GetQueryString('pid');
	var gc_name= GetQueryString('gc_name');
	var gc_area= GetQueryString('gc_area');	
	$('.header-title').text(gc_name);
	document.title=gc_name;
	//二级分类
     
     
    FL.goodsClass(pid,gc_area, {
        success: loadSuccess
   });

    function loadSuccess(data) {
         var html = template.render('reclassify-tpl', data);
          $('#reclassify_list').html(html);
       
    }



});