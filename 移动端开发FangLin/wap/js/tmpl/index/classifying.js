!$(function(){function s(s){var r=template.render("inlandClass-tpl",s);$("#inlandClass").html(r);var r=template.render("foreignClass-tpl",s);$("#foreignClass").html(r)}function r(s){if(s&&0==s.error&&0!=s.result.num){s.result.num>99&&(s.result.num="99+");var r='<span class="cart-num">'+s.result.num+"</span>";$(".shoppingurl").after(r),"1"==s.result.is_global?$(".shoppingurl").prop("href","../shopping/shopping_cart_global.html"):$(".shoppingurl").prop("href","../shopping/shopping_cart_cn.html")}}FL.goodsClass("0","2",{success:s}),FL.goSearch("#gotoSearch"),FL.getGoodsNum({success:r})});