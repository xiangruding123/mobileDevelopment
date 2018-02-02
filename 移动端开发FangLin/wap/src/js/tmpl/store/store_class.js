$(function(){

    var store_id = GetQueryString('store_id');

    function loadDate(store_id){
        FL.ajaxDate('get',get_store_class,{store_id:store_id},function(data){
            if(data&&data.error=='0'){

               var html = template('store_tpl',data);
               $('.separator').after(html);
               console.log(data);
               
           }
        });
    }

    loadDate(store_id);

    $('.separator').bind('click',function(){
      location.href = 'class_goods.html?store_id='+store_id;
    })


})