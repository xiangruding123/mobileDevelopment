var HostLink = WapSiteUrl + "/api/index.php?";
var HostTagLink = WapSiteUrl + "/talent/api.php?";
/*login*/
var if_account_exists,common_member_login,sms_code_init,reset_pwd,member_register,check_phone_code;

if_account_exists   = HostLink + "act=common_member&op=if_account_exists";
common_member_login = HostLink + "act=common_member&op=login";
sms_code_init       = HostLink + "act=common_member&op=sms_code_init";
reset_pwd           = HostLink + "act=common_member&op=reset_pwd";
member_register     = HostLink + "act=common_member&op=register";
check_phone_code    = HostLink + "act=common_member&op=check_phone_code";

/*微店*/
var get_shop_info,set_shop_info,get_shared_goods,microshop_submit,edit_member_info,
get_member_info,verify_member_info,get_shop_goods,add_shop_goods,get_stock,del_shop_goods,
goods_add,goods_save,get_shop_info_all,del_shop_brand,get_shop_brand,get_shoper,apply_shoper;
get_shop_info       = HostLink + "act=shoper_base&op=get_shop_info";
set_shop_info       = HostLink + "act=shoper_base&op=set_shop_info";
get_shoper_info     = HostLink + "act=shoper_manage&op=get_shop_info";
set_shoper_info     = HostLink + "act=shoper_manage&op=set_shop_info";
get_shared_goods    = HostLink + "act=shoper_base&op=get_shared_goods";
microshop_submit    = HostLink + "act=buyer_microshop_order&op=submit";
get_microshop_money = HostLink + "act=buyer_microshop_order&op=getMicroShopMoney";
edit_member_info    = HostLink + "act=common_microshop_member&op=edit_member_info";
get_member_info     = HostLink + "act=common_microshop_member&op=get_member_info";
verify_member_info  = HostLink + "act=common_microshop_member&op=verify_member_info";
get_shop_goods      = HostLink + "act=buyer_discovery&op=get_shop_goods";
add_shop_goods      = HostLink + "act=shoper_manage&op=add_shop_goods";
get_stock           = HostLink + "act=shoper_manage&op=get_stock";
goods_add           = HostLink + "act=shoper_manage&op=goods_add";
goods_save          = HostLink + "act=shoper_manage&op=goods_save";
del_shop_goods      = HostLink + "act=shoper_manage&op=del_shop_goods";
get_shop_info_all   = HostLink + "act=shoper_manage&op=get_shop_info_all";
del_shop_brand      = HostLink + "act=shoper_manage&op=del_shop_brands";
get_shop_brand      = HostLink + "act=buyer_discovery&op=get_shop_brands";
get_shoper          = HostLink + "act=shoper_manage&op=get_shoper";
is_complete_member  = HostLink + "act=common_microshop_member&op=is_complete_member";
apply_shoper        = HostLink + "act=common_index&op=apply_shoper";


/*图片上传*/
var image_upload;
image_upload        = HostLink + "act=common_index&op=image_upload";

/*时光*/
var get_tags,delete_history,search_tags,add_tag,get_time_goods_list,add_time,delete_time,get_talent_time_list,get_time_detail,add_time_comment,up_comment,cancel_up;
get_tags            = HostTagLink + "act=time_tags&op=get_tags";
delete_history      = HostTagLink + "act=time_tags&op=delete_history";
search_tags         = HostTagLink + "act=time_tags&op=search_tags";
add_tag             = HostTagLink + "act=time_tags&op=add_tag";
get_time_goods_list = HostTagLink + "act=time_goods&op=get_goods_list";
add_time            = HostTagLink + "act=time&op=add_time";
delete_time         = HostTagLink + "act=time&op=delete_time";
get_talent_time_list= HostTagLink + "act=time&op=get_talent_time_list";
get_time_detail     = HostTagLink + "act=time&op=get_time_detail";
add_time_comment    = HostTagLink + "act=time_comment&op=add_comment";
up_comment          = HostTagLink + "act=time_comment&op=up_comment";
cancel_up           = HostTagLink + "act=time_comment&op=cancel_up";

/*达人*/
var follow_talent,get_fans_list,get_talent_home,change_talent_info,follow_talent,get_recommend_goods;
follow_talent       = HostTagLink + "act=talent&op=follow_talent";
get_fans_list       = HostTagLink + "act=talent&op=get_fans_list";
get_talent_home     = HostTagLink + "act=talent&op=get_talent_home";
change_talent_info  = HostTagLink + "act=talent&op=change_talent_info";
follow_talent       = HostTagLink + "act=talent&op=follow_talent";
get_recommend_goods = HostTagLink + "act=talent&op=get_recommend_goods";


/*发现*/
var get_found_home;
get_found_home      = HostTagLink + "act=time&op=get_found_home";

/*品牌*/
var get_brand_message,get_brand_goods;
get_brand_message   = HostLink  +  "act=store_brand&op=get_brand_message";
get_brand_goods     = HostLink  +  "act=store_brand&op=get_brand_goods";

/*店铺*/
var get_store_home_append,get_store_class;
get_store_home_append = HostLink  +  "act=buyer_shopping&op=get_store_home_append";
get_store_class       = HostLink  +  "act=buyer_shopping&op=get_store_class";

/*代理申请*/
var agent_application;
agent_application     = HostLink  +  "act=agent&op=agent_application";

/*物流*/
var wholesaler_query_express;
wholesaler_query_express         = HostLink  +  "act=wholesaler_delivery&op=query_express";
