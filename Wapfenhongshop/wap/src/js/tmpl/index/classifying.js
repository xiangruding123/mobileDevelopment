!$(function() {


    // 全部分类
    FL.goodsClass("0",'2', {
        success: loadSuccess
    });

    function loadSuccess(data) {

        var html = template.render('inlandClass-tpl', data);
        $('#inlandClass').html(html);
        var html = template.render('foreignClass-tpl', data);
        $('#foreignClass').html(html);

    }

     // 点击搜索跳转到商品列表
       FL.goSearch('#gotoSearch');

    FL.getGoodsNum({success:loadSuccessCart});

    function loadSuccessCart(data){
        if(data&&data.error==0){
            	if(data.result.num!=0){
				if(data.result.num>99){
					data.result.num="99+";
				}
				var dom = '<span class="cart-num">'+data.result.num+'</span>';
			    $(".shoppingurl").after(dom);
				if(data.result.is_global=='1'){
					$('.shoppingurl').prop('href','../shopping/shopping_cart_global.html');
				}else{
					$('.shoppingurl').prop('href','../shopping/shopping_cart_cn.html');
				}
		    }
        }
    }


})
